import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail,
  getMultiFactorResolver, multiFactor, TotpMultiFactorGenerator,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc, collection, query, orderBy, onSnapshot, deleteDoc, serverTimestamp,
  getDocs, where, documentId,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

/* Everything user supplied (emails, saved text) is written with textContent or as an attribute
   value through h() below. Nothing is ever inserted as HTML. */

const SCHEMA = window.BIGGS_SCHEMA || [];
const SITE_IMAGES = window.BIGGS_SITE_IMAGES || [];
const IMAGE_ID = window.BIGGS_IMAGE_ID;
const MAX_IMAGE_BYTES = 650 * 1024; // keeps each image document safely under Firestore's 1 MB limit
const cfg = (window.BIGGS_CONFIG && window.BIGGS_CONFIG.firebase) || {};
const $ = (sel) => document.querySelector(sel);

function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  for (const kid of kids.flat()) {
    if (kid == null) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

function say(selector, text, kind) {
  const el = $(selector);
  el.textContent = text;
  el.className = 'notice' + (kind ? ' ' + kind : '');
}

if (!cfg.apiKey || !cfg.projectId) {
  $('#setup-warning').hidden = false;
  throw new Error('Firebase config missing');
}

const app = initializeApp(cfg);
const auth = getAuth(app);
const db = getFirestore(app);

const views = { login: $('#view-login'), mfa: $('#view-mfa'), app: $('#view-app') };
function show(name) {
  for (const [key, el] of Object.entries(views)) el.hidden = key !== name;
  $('#signout').hidden = name !== 'app';
}

// ------------------------------------------------------------------ sign in
let mfaResolver = null;

$('#login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.submitter;
  btn.disabled = true;
  say('#login-msg', '');
  try {
    await signInWithEmailAndPassword(auth, $('#login-email').value.trim(), $('#login-password').value);
  } catch (err) {
    if (err.code === 'auth/multi-factor-auth-required') {
      mfaResolver = getMultiFactorResolver(auth, err);
      show('mfa');
      $('#mfa-code').focus();
    } else if (err.code === 'auth/too-many-requests') {
      say('#login-msg', 'Too many attempts. Please wait a few minutes and try again.', 'error');
    } else {
      say('#login-msg', 'Sign in failed. Check your email and password.', 'error'); // never says which was wrong
    }
  } finally {
    btn.disabled = false;
    $('#login-password').value = '';
  }
});

$('#mfa-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.submitter;
  btn.disabled = true;
  try {
    const hint = mfaResolver.hints.find((x) => x.factorId === TotpMultiFactorGenerator.FACTOR_ID);
    const assertion = TotpMultiFactorGenerator.assertionForSignIn(hint.uid, $('#mfa-code').value.trim());
    await mfaResolver.resolveSignIn(assertion);
    mfaResolver = null;
    $('#mfa-code').value = '';
  } catch {
    say('#mfa-msg', 'That code was not accepted. Try the newest code.', 'error');
  } finally {
    btn.disabled = false;
  }
});

$('#forgot').addEventListener('click', async () => {
  const email = $('#login-email').value.trim();
  if (!email) return say('#login-msg', 'Type your email address in the box above first.', 'error');
  try { await sendPasswordResetEmail(auth, email); } catch { /* same reply either way */ }
  // Same message whether or not the address has an account, so nobody can probe for admins.
  say('#login-msg', 'If that address has an admin account, a reset link is on its way. It lasts about an hour.', 'ok');
});

$('#signout').addEventListener('click', () => signOut(auth));

// Sign out after 30 minutes without activity.
let idleTimer;
function resetIdle() {
  clearTimeout(idleTimer);
  if (auth.currentUser) idleTimer = setTimeout(() => signOut(auth), 30 * 60 * 1000);
}
['click', 'keydown', 'pointermove'].forEach((evt) => window.addEventListener(evt, resetIdle, { passive: true }));

let stopSubscribers = null;
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    if (stopSubscribers) stopSubscribers();
    stopSubscribers = null;
    $('#who').textContent = '';
    show(mfaResolver ? 'mfa' : 'login');
    return;
  }
  const token = await user.getIdTokenResult(true);
  if (token.claims.admin !== true) {
    await signOut(auth);
    say('#login-msg', 'This account is not an admin.', 'error');
    return;
  }
  $('#who').textContent = user.email;
  show('app');
  resetIdle();
  startContent();
  startSiteImages();
  startBanner();
  startSubscribers();
  refreshMfaStatus();
});

// ------------------------------------------------------------------ tabs
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('is-active', t === tab));
    for (const name of ['content', 'images', 'banner', 'visitors', 'subscribers', 'send', 'security']) {
      $('#tab-' + name).hidden = tab.dataset.tab !== name;
    }
    if (tab.dataset.tab === 'send') loadHistory();
    if (tab.dataset.tab === 'visitors') { loadVisitors(); startVisitorsTimer(); } else stopVisitorsTimer();
  });
});

// ------------------------------------------------------------------ page content
const inputs = {}; // key -> () => current value
let savedContent = {};

async function startContent() {
  const snap = await getDoc(doc(db, 'site', 'holding'));
  savedContent = snap.exists() ? snap.data() : {};
  buildForm();
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function buildForm() {
  const form = $('#content-form');
  form.replaceChildren();
  let group = '';

  for (const field of SCHEMA) {
    if (field.group !== group) {
      group = field.group;
      form.append(h('h2', { class: 'group-title' }, group));
    }
    const current = typeof savedContent[field.key] === 'string' ? savedContent[field.key] : '';
    const id = 'f-' + field.key;

    if (field.type === 'image') {
      form.append(imageField(field, id, current));
    } else if (field.type === 'color') {
      form.append(colorField(field, id, current));
    } else {
      const control = field.type === 'textarea'
        ? h('textarea', { id, maxlength: field.max })
        : h('input', { id, type: 'text', maxlength: field.max });
      control.value = current || field.def || ''; // opens showing what the site says right now
      control.placeholder = field.def || '';
      const count = h('span', { class: 'count' });
      const update = () => { count.textContent = `${control.value.length}/${field.max}`; };
      control.addEventListener('input', update);
      update();
      inputs[field.key] = () => control.value.trim();
      form.append(h('div', { class: 'field' }, h('label', { for: id }, field.label, count), control));
    }
  }
  updateContrastWarning();
}

function colorField(field, id, current) {
  const picker = h('input', { id, type: 'color' });
  picker.value = current || field.def;
  const label = h('code', null, picker.value);
  const reset = h('button', { class: 'ghost', type: 'button', onclick: () => { picker.value = field.def; picker.dispatchEvent(new Event('input')); } }, 'Use original');
  picker.addEventListener('input', () => { label.textContent = picker.value; updateContrastWarning(); });
  inputs[field.key] = () => (picker.value.toLowerCase() === field.def.toLowerCase() ? '' : picker.value.toLowerCase());
  inputs['_picker_' + field.key] = () => picker.value;
  return h('div', { class: 'field' }, h('label', { for: id }, field.label), h('div', { class: 'color-row' }, picker, label, reset));
}

function updateContrastWarning() {
  const get = (k) => (inputs['_picker_' + k] ? inputs['_picker_' + k]() : null);
  const green = get('green');
  const cream = get('cream');
  const yellow = get('yellow');
  $('#colour-warning')?.remove();
  if (!green || !cream || !yellow) return;
  const problems = [];
  if (contrast(green, cream) < 4.5) problems.push('the text and card colours are too similar to read easily');
  if (contrast(green, yellow) < 3) problems.push('the button will be hard to see against the card');
  if (!problems.length) return;
  const rows = $('#content-form').querySelectorAll('.color-row');
  const last = rows[rows.length - 1];
  if (last) last.parentElement.after(h('p', { id: 'colour-warning', class: 'contrast-warning' }, 'Careful: ' + problems.join(' and ') + '.'));
}

async function blobToBase64(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

function imageField(field, id, current, registry = inputs) {
  const originalSrc = '/' + field.defSrc; // the picture the site uses until one is uploaded
  const preview = h('img', { alt: '', src: originalSrc });
  let value = IMAGE_ID.test(current) ? current : '';
  const status = h('p', { class: 'hint' }, value ? 'A custom image is in use.' : 'This is the current image on the site.');
  const file = h('input', { id, type: 'file', accept: 'image/jpeg,image/png,image/webp' });

  if (value) {
    getDoc(doc(db, 'images', value)).then((snap) => {
      if (snap.exists()) preview.src = `data:${snap.data().mime};base64,${snap.data().b64}`;
    }).catch(() => {});
  }

  file.addEventListener('change', async () => {
    const chosen = file.files[0];
    if (!chosen) return;
    status.textContent = 'Preparing and uploading...';
    try {
      const blob = await processImage(chosen, field.maxDim, field.format);
      const imageId = `${field.idPrefix}-${Date.now()}`;
      await setDoc(doc(db, 'images', imageId), {
        mime: blob.type,
        b64: await blobToBase64(blob),
        createdAt: serverTimestamp(),
      });
      value = imageId;
      preview.src = URL.createObjectURL(blob);
      status.textContent = 'Uploaded. Press Save and publish to put it on the page.';
    } catch (err) {
      status.textContent = err.message || 'Upload failed. Please try another image.';
    }
    file.value = '';
  });

  const remove = h('button', { class: 'ghost', type: 'button', onclick: () => { value = ''; preview.src = originalSrc; status.textContent = 'Back to the original image. Press Save and publish to apply it.'; } }, 'Use original image');
  registry[field.key] = () => value;
  return h('div', { class: 'field' }, h('label', { for: id }, field.label),
    field.where ? h('p', { class: 'hint' }, 'Shown: ' + field.where) : null,
    h('div', { class: 'image-row' }, preview, h('div', { class: 'controls' }, file, remove, status)));
}

/** Re-draws the picture onto a canvas. That strips any hidden data, fixes the format, and shrinks it. */
async function processImage(file, maxDim, format) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Please choose a JPG, PNG or WebP image.');
  if (file.size > 20 * 1024 * 1024) throw new Error('That file is over 20 MB. Please choose a smaller one.');
  const bitmap = await createImageBitmap(file);
  const type = format === 'jpeg' ? 'image/jpeg' : 'image/webp';
  let scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));

  // Shrink quality, then size, until it is small enough to store (about 650 KB).
  for (let attempt = 0; attempt < 6; attempt++) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext('2d');
    if (format === 'jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.88, 0.78, 0.68]) {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
      if (!blob || blob.type !== type) throw new Error('This browser could not prepare the image.');
      if (blob.size <= MAX_IMAGE_BYTES) return blob;
    }
    scale *= 0.8;
  }
  throw new Error('That picture is too detailed to shrink enough. Please try a simpler or smaller image.');
}

$('#save-content').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  say('#content-msg', 'Saving...');
  try {
    const data = {};
    for (const field of SCHEMA) {
      const value = inputs[field.key]();
      if (typeof value !== 'string' || value === '') continue;
      if (field.type === 'image' && !IMAGE_ID.test(value)) continue;
      if (field.type !== 'image' && field.def && value === field.def) continue; // unchanged: keep the built-in
      data[field.key] = value;
    }
    data.updatedAt = serverTimestamp();
    await setDoc(doc(db, 'site', 'holding'), data);
    say('#content-msg', 'Saved. The live page shows it within about a minute.', 'ok');
  } catch (err) {
    say('#content-msg', err.code === 'permission-denied'
      ? 'Not saved: something is too long or not allowed. Check the highlighted limits.'
      : 'Not saved. Please try again.', 'error');
  } finally {
    btn.disabled = false;
  }
});

// ------------------------------------------------------------------ site images (main website)
const siteInputs = {};
let savedSiteImages = {};

async function startSiteImages() {
  const snap = await getDoc(doc(db, 'site', 'images'));
  savedSiteImages = snap.exists() ? snap.data() : {};
  const form = $('#images-form');
  form.replaceChildren();
  for (const slot of SITE_IMAGES) {
    const current = typeof savedSiteImages[slot.key] === 'string' ? savedSiteImages[slot.key] : '';
    form.append(imageField(slot, 'si-' + slot.key, current, siteInputs));
  }
}

$('#save-images').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  say('#images-msg', 'Saving...');
  try {
    const data = {};
    for (const slot of SITE_IMAGES) {
      const value = siteInputs[slot.key] ? siteInputs[slot.key]() : '';
      if (IMAGE_ID.test(value)) data[slot.key] = value; // empty means: keep the original picture
    }
    data.updatedAt = serverTimestamp();
    await setDoc(doc(db, 'site', 'images'), data);
    say('#images-msg', 'Saved. The website shows it within about a minute.', 'ok');
  } catch {
    say('#images-msg', 'Not saved. Please try again.', 'error');
  } finally {
    btn.disabled = false;
  }
});

// ------------------------------------------------------------------ top banner (main website)
function updateBannerPreview() {
  const text = $('#banner-text').value.trim();
  const on = $('#banner-on').checked;
  const box = $('#banner-preview');
  box.textContent = text || 'Your banner text appears here';
  box.classList.toggle('is-off', !on);
  $('#banner-count').textContent = $('#banner-text').value.length + '/120';
}

async function startBanner() {
  try {
    const snap = await getDoc(doc(db, 'site', 'banner'));
    const saved = snap.exists() ? snap.data() : {};
    $('#banner-on').checked = saved.enabled === true;
    $('#banner-text').value = typeof saved.text === 'string' ? saved.text : '';
  } catch {
    say('#banner-msg', 'Could not load the banner.', 'error');
  }
  updateBannerPreview();
}

$('#banner-on').addEventListener('change', updateBannerPreview);
$('#banner-text').addEventListener('input', updateBannerPreview);

$('#save-banner').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  const text = $('#banner-text').value.replace(/\s+/g, ' ').trim();
  const enabled = $('#banner-on').checked;
  if (enabled && !text) return say('#banner-msg', 'Type the banner text first, or switch the banner off.', 'error');
  btn.disabled = true;
  say('#banner-msg', 'Saving...');
  try {
    await setDoc(doc(db, 'site', 'banner'), { enabled, text, updatedAt: serverTimestamp() });
    say('#banner-msg', enabled
      ? 'Saved. The banner shows on the website within about two minutes.'
      : 'Saved. The banner is switched off and disappears from the website within about two minutes.', 'ok');
  } catch {
    say('#banner-msg', 'Not saved. Please try again.', 'error');
  } finally {
    btn.disabled = false;
  }
});

// ------------------------------------------------------------------ visitors (main website)
// Past days are read once from Firestore when the tab opens (or on Refresh). While the tab is open,
// only today's live totals are re-fetched (from the Worker, once a minute), so this stays tiny.
let visitorDays = {};
let visitorsTimer = null;
const UK_DAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' });
const ukToday = () => UK_DAY.format(new Date());
function shiftDay(key, delta) {
  const d = new Date(key + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}
const nf = new Intl.NumberFormat('en-GB');
let regionNames = null;
try { regionNames = new Intl.DisplayNames(['en-GB'], { type: 'region' }); } catch { /* older browsers show the code */ }

function addInto(total, part) {
  for (const [k, n] of Object.entries(part || {})) total[k] = (total[k] || 0) + n;
}

function barList(box, entries, label) {
  const rows = entries.sort((a, b) => b[1] - a[1]).slice(0, 10);
  const max = rows.length ? rows[0][1] : 1;
  box.replaceChildren(...(rows.length ? rows.map(([name, n]) => {
    const fill = h('div', { class: 'vfill' });
    fill.style.width = Math.max(2, Math.round((n / max) * 100)) + '%';
    return h('div', { class: 'vrow' }, h('span', { class: 'vname' }, label(name)), h('b', null, nf.format(n)), h('div', { class: 'vbar' }, fill));
  }) : [h('p', { class: 'muted small' }, 'Nothing yet.')]));
}

function renderVisitors() {
  const range = $('#v-range').value;
  const today = ukToday();
  let keys;
  if (range === 'today') keys = [today];
  else if (range === 'yesterday') keys = [shiftDay(today, -1)];
  else {
    const n = Number(range);
    keys = Array.from({ length: n }, (_, i) => shiftDay(today, i - (n - 1)));
  }
  const days = keys.map((k) => visitorDays[k]).filter(Boolean);

  let visitors = 0, views = 0, visits = 0;
  const pages = {}, refs = {}, countries = {}, devices = {};
  for (const d of days) {
    visitors += d.visitors; views += d.views; visits += d.visits;
    addInto(pages, d.pages); addInto(refs, d.refs); addInto(countries, d.countries); addInto(devices, d.devices);
  }
  $('#v-visitors').textContent = nf.format(visitors);
  $('#v-views').textContent = nf.format(views);
  $('#v-visits').textContent = nf.format(visits);

  // chart: hours for one day, days for a longer range
  const chart = $('#v-chart');
  const axis = $('#v-chart-axis');
  let series, labels, title;
  if (keys.length === 1) {
    const d = visitorDays[keys[0]];
    series = d ? d.hours : Array(24).fill(0);
    labels = series.map((_, i) => String(i).padStart(2, '0') + ':00');
    title = 'Page views by hour';

  } else {
    series = keys.map((k) => (visitorDays[k] ? visitorDays[k].views : 0));
    labels = keys.map((k) => new Date(k + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }));
    title = 'Page views by day';

  }
  // axis: a label under every 3rd hour (or every day / every few days), lined up with the bars
  const step = keys.length === 1 ? 3 : Math.ceil(keys.length / 7);
  axis.replaceChildren(...series.map((_, i) => h('span', null, i % step === 0 ? (keys.length === 1 ? String(i).padStart(2, '0') : labels[i]) : '')));
  const best = series.indexOf(Math.max(...series));
  $('#v-peak').textContent = series[best] > 0
    ? (keys.length === 1
      ? 'Busiest hour: ' + labels[best] + ' to ' + String((best + 1) % 24).padStart(2, '0') + ':00 (UK time), ' + nf.format(series[best]) + ' page views. Hover or tap a bar for any hour.'
      : 'Busiest day: ' + labels[best] + ', ' + nf.format(series[best]) + ' page views. Hover or tap a bar for any day.')
    : '';
  $('#v-chart-title').textContent = title;
  const top = Math.max(1, ...series);
  // each bar carries its own number on top (blank for zero; 1,200 is shown as 1.2k to save room)
  const compact = (n) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k' : String(n));
  chart.replaceChildren(...series.map((n, i) => {
    const bar = h('i');
    bar.style.height = Math.max(2, Math.round((n / top) * 100)) + '%';
    return h('div', { class: 'vcol', title: labels[i] + ': ' + nf.format(n) }, n > 0 ? h('span', { class: 'vnum' }, compact(n)) : null, bar);
  }));

  barList($('#v-pages'), Object.entries(pages), (p) => (p === '/' ? 'Home (/)' : p));
  barList($('#v-refs'), Object.entries(refs), (r) => (r === 'direct' ? 'Direct (typed or bookmarked)' : r));
  barList($('#v-countries'), Object.entries(countries), (c) => (c === 'XX' ? 'Unknown' : c === 'other' ? 'Other' : regionNames ? regionNames.of(c) || c : c));
  barList($('#v-devices'), Object.entries(devices).filter(([, n]) => n > 0), (d) => ({ mobile: 'Phone', tablet: 'Tablet', desktop: 'Computer' }[d] || d));

  const first = Object.keys(visitorDays).sort()[0];
  $('#v-since').textContent = first
    ? 'Counting started on ' + new Date(first + 'T12:00:00Z').toLocaleDateString('en-GB', { dateStyle: 'long', timeZone: 'UTC' }) + '. Earlier days are not available.'
    : 'No visits recorded yet. Counting starts as soon as the tracker is live on the website.';
}

async function refreshLive() {
  try {
    const { data } = await adminApi('/api/admin/live', {});
    if (!data.ok) return;
    visitorDays[data.today.day] = data.today;
    $('#v-live').textContent = nf.format(data.now);
    renderVisitors();
  } catch { /* try again next minute */ }
}

async function loadVisitors() {
  say('#v-msg', 'Loading...');
  try {
    // A range on the document id (the date) needs no special index, unlike sorting newest-first.
    const snap = await getDocs(query(collection(db, 'stats'), where(documentId(), '>=', shiftDay(ukToday(), -45))));
    visitorDays = {};
    snap.forEach((d) => {
      try { visitorDays[d.id] = JSON.parse(d.data().json); } catch { /* skip a broken day */ }
    });
    say('#v-msg', '');
    renderVisitors();
    await refreshLive();
  } catch (err) {
    console.error('Visitors: could not load', err);
    say('#v-msg', 'Could not load the visitor numbers.', 'error');
  }
}

function startVisitorsTimer() {
  stopVisitorsTimer();
  visitorsTimer = setInterval(() => { if (!document.hidden) refreshLive(); }, 60000);
}
function stopVisitorsTimer() {
  if (visitorsTimer) clearInterval(visitorsTimer);
  visitorsTimer = null;
}

$('#v-range').addEventListener('change', renderVisitors);
$('#v-refresh').addEventListener('click', loadVisitors);

// ------------------------------------------------------------------ subscribers
let subscribers = [];

function startSubscribers() {
  if (stopSubscribers) stopSubscribers();
  const q = query(collection(db, 'subscribers'), orderBy('createdAt', 'desc'));
  stopSubscribers = onSnapshot(q, (snap) => {
    subscribers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderSubscribers();
  }, () => say('#sub-msg', 'Could not load subscribers.', 'error'));
}

const fmtDate = (ts) => (ts && ts.toDate ? ts.toDate().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '');

function visibleSubscribers() {
  const status = $('#sub-filter').value;
  const term = $('#sub-search').value.trim().toLowerCase();
  return subscribers.filter((s) => (status === 'all' || s.status === status) && (!term || String(s.email).includes(term)));
}

function renderSubscribers() {
  const count = (status) => subscribers.filter((s) => s.status === status).length;
  $('#stats').replaceChildren(
    ...[['Confirmed', count('confirmed')], ['Waiting to confirm', count('pending')], ['Unsubscribed', count('unsubscribed')]]
      .map(([label, n]) => h('div', { class: 'stat' }, h('b', null, n), label))
  );
  $('#copy-all').textContent = `Copy all confirmed emails (${count('confirmed')})`;

  const rows = visibleSubscribers().map((s) => h('tr', null,
    h('td', { 'data-label': 'Email' }, s.email),
    h('td', { 'data-label': 'Status' }, h('span', { class: 'badge ' + s.status }, s.status === 'pending' ? 'waiting' : s.status)),
    h('td', { 'data-label': 'Source' }, s.source || ''),
    h('td', { 'data-label': 'Signed up' }, fmtDate(s.createdAt)),
    h('td', null, h('button', {
      class: 'danger', type: 'button',
      onclick: async () => {
        if (!confirm(`Permanently delete ${s.email}? This cannot be undone.`)) return;
        try { await deleteDoc(doc(db, 'subscribers', s.id)); } catch { say('#sub-msg', 'Could not delete.', 'error'); }
      },
    }, 'Delete'))
  ));
  $('#sub-rows').replaceChildren(...(rows.length ? rows : [h('tr', null, h('td', { colspan: 5 }, 'Nothing to show yet.'))]));
}

$('#sub-filter').addEventListener('change', renderSubscribers);
$('#sub-search').addEventListener('input', renderSubscribers);

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = h('textarea', { 'aria-hidden': 'true' });
    area.value = text;
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

$('#copy-all').addEventListener('click', async () => {
  const emails = subscribers.filter((s) => s.status === 'confirmed').map((s) => s.email);
  if (!emails.length) return say('#sub-msg', 'There are no confirmed subscribers yet.', 'error');
  const raw = $('#copy-sep').value;
  const sep = raw === '\\n' ? '\n' : raw;
  const ok = await copyText(emails.join(sep));
  say('#sub-msg', ok ? `Copied ${emails.length} email addresses. Paste them into the BCC box.` : 'Could not copy. Try the CSV download.', ok ? 'ok' : 'error');
});

function csvCell(value) {
  let text = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text; // stops spreadsheet formula injection
  return `"${text.replace(/"/g, '""')}"`;
}

$('#download-csv').addEventListener('click', () => {
  const rows = [['email', 'status', 'source', 'signed_up', 'confirmed', 'unsubscribe_link']];
  for (const s of visibleSubscribers()) {
    const link = s.unsubSig ? `${location.origin}/unsubscribe.html?id=${s.id}&s=${s.unsubSig}` : '';
    rows.push([s.email, s.status, s.source, fmtDate(s.createdAt), fmtDate(s.confirmedAt), link]);
  }
  const blob = new Blob([rows.map((r) => r.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = h('a', { href: URL.createObjectURL(blob), download: `biggs-subscribers-${new Date().toISOString().slice(0, 10)}.csv` });
  document.body.append(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
});

// ------------------------------------------------------------------ send email + import
// These call the Worker with the admin's own sign-in token. The Worker checks it again, so this page alone can
// never send anything.
async function adminApi(path, body) {
  const token = await auth.currentUser.getIdToken();
  const base = ((window.BIGGS_CONFIG || {}).apiBase || '').replace(/\/+$/, '');
  const res = await fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

const sendFields = () => ({
  subject: $('#send-subject').value.trim(),
  message: $('#send-message').value.trim(),
  buttonLabel: $('#send-button-label').value.trim(),
  buttonUrl: $('#send-button-url').value.trim(),
});
const sendKey = (f) => JSON.stringify([f.subject, f.message, f.buttonLabel, f.buttonUrl]);
let testedKey = null;

function sendProblem(f) {
  if (!f.subject || !f.message) return 'Please write a subject and a message first.';
  if ((f.buttonLabel || f.buttonUrl) && (!f.buttonLabel || !/^https:\/\//.test(f.buttonUrl))) {
    return 'For a button, add both the text and a link that starts with https://';
  }
  return '';
}

const SEND_ERRORS = {
  rate_limited: 'You have sent too many in the last hour. Please wait a little while.',
  not_admin: 'Your sign-in has expired. Please sign out and in again.',
  no_recipients: 'There are no confirmed subscribers to send to yet.',
  too_many: 'The list is larger than one send allows. Ask your web developer.',
  bad_button: 'For a button, add both the text and a link that starts with https://',
  email_failed: 'The email service refused it. Nothing more was sent.',
};

$('#send-test').addEventListener('click', async () => {
  const f = sendFields();
  const problem = sendProblem(f);
  if (problem) return say('#send-msg', problem, 'error');
  const btn = $('#send-test');
  btn.disabled = true;
  say('#send-msg', 'Sending a test...');
  try {
    const { data } = await adminApi('/api/admin/newsletter', { ...f, mode: 'test' });
    if (data.ok) {
      testedKey = sendKey(f);
      say('#send-msg', 'Test sent to ' + data.sentTo + '. Check your inbox and junk folder. If it looks right, you can send it to everyone.', 'ok');
    } else {
      say('#send-msg', SEND_ERRORS[data.error] || 'The test could not be sent. Please try again.', 'error');
    }
  } catch {
    say('#send-msg', 'Could not reach the sending service. Please try again.', 'error');
  } finally {
    btn.disabled = false;
  }
});

$('#send-all').addEventListener('click', async () => {
  const f = sendFields();
  const problem = sendProblem(f);
  if (problem) return say('#send-msg', problem, 'error');
  if (testedKey !== sendKey(f)) return say('#send-msg', 'Please press "Send me a test" for this exact message first, and check it.', 'error');
  const count = subscribers.filter((s) => s.status === 'confirmed').length;
  if (!count) return say('#send-msg', 'There are no confirmed subscribers to send to yet.', 'error');
  if (!confirm('Send "' + f.subject + '" to ' + count + ' confirmed subscriber' + (count === 1 ? '' : 's') + '?\n\nThis cannot be undone.')) return;
  const btn = $('#send-all');
  btn.disabled = true;
  say('#send-msg', 'Sending... please keep this page open.');
  try {
    const { data } = await adminApi('/api/admin/newsletter', { ...f, mode: 'send', expected: count });
    if (data.ok) {
      testedKey = null;
      say('#send-msg', 'Sent to ' + data.sent + ' subscriber' + (data.sent === 1 ? '' : 's') + '.', 'ok');
      loadHistory();
    } else if (data.error === 'count_changed') {
      say('#send-msg', 'The list changed just now (it is now ' + data.count + ' people). Nothing was sent. Press send again to confirm the new number.', 'error');
    } else if (data.error === 'email_failed' && data.sent != null) {
      say('#send-msg', 'Stopped part way: ' + data.sent + ' of ' + data.total + ' were sent. Do not press send again. Ask your web developer.', 'error');
    } else {
      say('#send-msg', SEND_ERRORS[data.error] || 'It could not be sent. Please try again.', 'error');
    }
  } catch {
    say('#send-msg', 'Lost contact part way. Check with your web developer before trying again, so nobody gets it twice.', 'error');
  } finally {
    btn.disabled = false;
  }
});

// Sent history: the last real sends, read through the Worker (admin only).
async function loadHistory() {
  try {
    const { data } = await adminApi('/api/admin/newsletter-history', {});
    if (!data.ok) return say('#history-msg', 'Could not load the history.', 'error');
    say('#history-msg', '');
    const rows = (data.sends || []).map((s) => h('tr', null,
      h('td', { 'data-label': 'Sent' }, s.sentAt ? new Date(s.sentAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : ''),
      h('td', { 'data-label': 'Subject' }, s.subject),
      h('td', { 'data-label': 'By' }, s.sentBy),
      h('td', { 'data-label': 'Went to' }, s.sent === s.recipients ? s.sent + ' people' : s.sent + ' of ' + s.recipients + ' people (stopped part way)')
    ));
    $('#history-rows').replaceChildren(...(rows.length ? rows : [h('tr', null, h('td', { colspan: 4 }, 'Nothing has been sent yet.'))]));
  } catch {
    say('#history-msg', 'Could not load the history.', 'error');
  }
}

// Import
const EMAIL_FINDER = /[A-Za-z0-9][A-Za-z0-9._%+'-]*@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
$('#import-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) return say('#import-msg', 'That file is too big. Use a file under 2 MB.', 'error');
  const text = await file.text();
  $('#import-list').value = text;
  const n = new Set((text.match(EMAIL_FINDER) || []).map((x) => x.toLowerCase())).size;
  say('#import-msg', 'Found ' + n + ' email address' + (n === 1 ? '' : 'es') + ' in the file. Choose how to add them, then press Import.', 'ok');
});

$('#import-go').addEventListener('click', async () => {
  const emails = [...new Set(($('#import-list').value.match(EMAIL_FINDER) || []).map((x) => x.toLowerCase()))];
  if (!emails.length) return say('#import-msg', 'No email addresses found. Paste some or choose a file.', 'error');
  const mode = $('#import-mode').value;
  const how = mode === 'pending'
    ? 'Each person will get one email asking them to confirm. Only people who click it will receive newsletters.'
    : 'They will receive newsletters straight away, without confirming.';
  if (!confirm('Import ' + emails.length + ' address' + (emails.length === 1 ? '' : 'es') + '?\n\n' + how)) return;
  const btn = $('#import-go');
  btn.disabled = true;
  const total = { added: 0, skipped_existing: 0, invalid: 0, email_failed: 0 };
  const CHUNK = 12;
  try {
    for (let i = 0; i < emails.length; i += CHUNK) {
      say('#import-msg', 'Importing... ' + Math.min(i, emails.length) + ' of ' + emails.length);
      const { data } = await adminApi('/api/admin/import', {
        emails: emails.slice(i, i + CHUNK),
        mode,
        source: 'import',
        consent: $('#import-consent').value.trim(),
      });
      if (!data.ok) {
        say('#import-msg', 'Stopped at ' + i + ' of ' + emails.length + ': ' + (SEND_ERRORS[data.error] || 'something went wrong') +
          ' So far: ' + total.added + ' added. Importing again is safe, people already added are skipped.', 'error');
        return;
      }
      for (const k of Object.keys(total)) total[k] += data[k] || 0;
    }
    say('#import-msg', 'Done. Added ' + total.added + ', already on the list ' + total.skipped_existing + ', not valid ' + total.invalid +
      (total.email_failed ? ', confirmation email failed for ' + total.email_failed : '') + '.', 'ok');
    $('#import-list').value = '';
    $('#import-file').value = '';
  } catch {
    say('#import-msg', 'Lost contact part way. Importing again is safe, people already added are skipped.', 'error');
  } finally {
    btn.disabled = false;
  }
});

// ------------------------------------------------------------------ security
let totpSecret = null;

function refreshMfaStatus() {
  const enrolled = multiFactor(auth.currentUser).enrolledFactors.length > 0;
  $('#mfa-status').textContent = enrolled
    ? 'On. You are asked for a code from your authenticator app each time you sign in.'
    : 'Off. Turn this on: a stolen password alone should never be enough to open this admin.';
  $('#mfa-start').hidden = enrolled;
  $('#mfa-setup').hidden = true;
}

$('#mfa-start').addEventListener('click', async () => {
  try {
    const session = await multiFactor(auth.currentUser).getSession();
    totpSecret = await TotpMultiFactorGenerator.generateSecret(session);
    $('#mfa-secret').textContent = totpSecret.secretKey;
    $('#mfa-setup').hidden = false;
    $('#mfa-start').hidden = true;
  } catch (err) {
    say('#security-msg', err.code === 'auth/requires-recent-login'
      ? 'Please sign out and in again, then try once more.'
      : 'In-app 2-step needs a paid Firebase upgrade. On the free plan, 2-step is provided by Cloudflare Access in front of this page (see the README).', 'error');
  }
});

$('#mfa-enrol-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const assertion = TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, $('#mfa-enrol-code').value.trim());
    await multiFactor(auth.currentUser).enroll(assertion, 'Authenticator app');
    say('#security-msg', '2-step verification is on.', 'ok');
    refreshMfaStatus();
  } catch {
    say('#security-msg', 'That code was not accepted. Try the newest code.', 'error');
  }
});

$('#reset-password').addEventListener('click', async () => {
  try {
    await sendPasswordResetEmail(auth, auth.currentUser.email);
    say('#security-msg', 'Check your inbox for the reset link.', 'ok');
  } catch {
    say('#security-msg', 'Could not send the email. Try again shortly.', 'error');
  }
});
