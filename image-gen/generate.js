#!/usr/bin/env node
/**
 * Biggs Bakes - Node image generation pipeline
 *
 * Usage:
 *   node image-gen/generate.js
 *   node image-gen/generate.js --force
 *
 * Providers (cheap / free):
 *   1. Hugging Face Inference API - set HF_TOKEN or HUGGINGFACE_API_KEY
 *   2. Pollinations.ai (free, no key) - used automatically when no HF token
 *
 * Skips images that already exist in public/images unless --force is passed.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROMPTS_PATH = path.join(__dirname, 'image-prompts.json');
const OUTPUT_DIR = path.join(ROOT, 'public', 'images');
const HF_MODEL =
  process.env.HF_IMAGE_MODEL || 'black-forest-labs/FLUX.1-schnell';

const FORCE = process.argv.includes('--force');

loadEnvFile(path.join(ROOT, '.env.local'));
loadEnvFile(path.join(ROOT, '.env'));

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function getHfToken() {
  return (
    process.env.HF_TOKEN ||
    process.env.HUGGINGFACE_API_KEY ||
    process.env.HUGGING_FACE_HUB_TOKEN ||
    ''
  ).trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithHuggingFace(prompt, width, height, token) {
  const endpoints = [
    `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`,
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
  ];

  let lastError;
  for (const url of endpoints) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'image/jpeg, image/png, application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width,
          height,
          num_inference_steps: 4,
        },
      }),
    });

    if (res.status === 503) {
      const body = await res.json().catch(() => ({}));
      const wait = Math.ceil((body.estimated_time || 20) * 1000);
      console.log(`  Model loading - waiting ${Math.round(wait / 1000)}s…`);
      await sleep(wait);
      lastError = new Error(body.error || 'Model is loading');
      continue;
    }

    if (!res.ok) {
      const text = await res.text();
      lastError = new Error(`HF ${res.status}: ${text.slice(0, 300)}`);
      continue;
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await res.json();
      lastError = new Error(body.error || JSON.stringify(body).slice(0, 300));
      continue;
    }

    return Buffer.from(await res.arrayBuffer());
  }

  throw lastError || new Error('Hugging Face request failed');
}

async function generateWithPollinations(prompt, width, height, attempt = 1) {
  const seed = Math.floor(Math.random() * 1_000_000);
  // Prefer flux; omit model on later retries if the first path rate-limits.
  const models = ['flux', 'turbo', ''];
  const model = models[Math.min(attempt - 1, models.length - 1)];
  const modelQuery = model ? `&model=${model}` : '';
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=${width}&height=${height}&nologo=true${modelQuery}&seed=${seed}`;

  const res = await fetch(url, {
    headers: { Accept: 'image/*' },
  });

  if (!res.ok) {
    const text = await res.text();
    const rateLimited = res.status === 429 || /429|rate.?limit/i.test(text);
    if (rateLimited && attempt < 4) {
      const wait = attempt * 8000;
      console.log(`  Rate limited - retry ${attempt}/3 in ${wait / 1000}s…`);
      await sleep(wait);
      return generateWithPollinations(prompt, width, height, attempt + 1);
    }
    throw new Error(`Pollinations ${res.status}: ${text.slice(0, 400)}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 1000) {
    throw new Error('Pollinations returned an empty or invalid image');
  }
  return buffer;
}

async function generateImage(entry, token) {
  const width = entry.width || 1024;
  const height = entry.height || 1024;

  if (token) {
    try {
      console.log(`  Provider: Hugging Face (${HF_MODEL})`);
      return await generateWithHuggingFace(entry.prompt, width, height, token);
    } catch (err) {
      console.warn(`  HF failed (${err.message}) - falling back to Pollinations`);
    }
  } else {
    console.log('  Provider: Pollinations.ai (free, no API key)');
  }

  return generateWithPollinations(entry.prompt, width, height);
}

function printImageSnippet(entry) {
  const src = `/images/${entry.filename}`;
  const alt = entry.alt || entry.filename.replace(/\.[^.]+$/, '').replace(/-/g, ' ');
  const width = entry.width || 1024;
  const height = entry.height || 1024;

  console.log(`
  <Image
    src="${src}"
    alt="${alt}"
    width={${width}}
    height={${height}}
  />`);
}

async function main() {
  if (!fs.existsSync(PROMPTS_PATH)) {
    console.error(`Missing prompts file: ${PROMPTS_PATH}`);
    process.exit(1);
  }

  const prompts = JSON.parse(fs.readFileSync(PROMPTS_PATH, 'utf8'));
  if (!Array.isArray(prompts) || prompts.length === 0) {
    console.error('image-prompts.json must be a non-empty array');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const token = getHfToken();
  if (token) {
    console.log('HF token found - will prefer Hugging Face Inference API');
  } else {
    console.log(
      'No HF_TOKEN found - using free Pollinations.ai (set HF_TOKEN in .env.local to use Hugging Face)'
    );
  }
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(FORCE ? 'Mode: regenerate all (--force)\n' : 'Mode: generate missing only\n');

  const results = [];
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of prompts) {
    if (!entry.filename || !entry.prompt) {
      console.warn('Skipping invalid entry (needs filename + prompt):', entry);
      failed += 1;
      continue;
    }

    const outPath = path.join(OUTPUT_DIR, entry.filename);
    const publicPath = `/images/${entry.filename}`;

    if (!FORCE && fs.existsSync(outPath)) {
      console.log(`⏭  Skip (exists): ${entry.filename}`);
      skipped += 1;
      results.push({ ...entry, publicPath, status: 'skipped' });
      continue;
    }

    console.log(`🎨 Generating: ${entry.filename}`);
    console.log(`   Prompt: ${entry.prompt.slice(0, 90)}…`);

    try {
      const buffer = await generateImage(entry, token);
      fs.writeFileSync(outPath, buffer);
      console.log(`✅ Saved: public/images/${entry.filename} (${buffer.length} bytes)`);
      generated += 1;
      results.push({ ...entry, publicPath, status: 'generated' });
    } catch (err) {
      console.error(`❌ Failed: ${entry.filename} - ${err.message}`);
      failed += 1;
      results.push({ ...entry, publicPath, status: 'failed', error: err.message });
    }

    // Be polite to free APIs
    await sleep(4000);
  }

  console.log('\n-- Next.js <Image> paths --');
  for (const entry of results.filter((r) => r.status !== 'failed')) {
    printImageSnippet(entry);
  }

  console.log('\n-- Summary --');
  console.log(`Generated: ${generated}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Failed:    ${failed}`);
  console.log(`Total:     ${prompts.length}`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
