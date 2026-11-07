import type { MetadataRoute } from 'next';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://biggsbakes.com').replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/cart'] },
      // AI search and answer tools are welcome to read the public pages.
      { userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'PerplexityBot', 'ClaudeBot', 'Claude-Web', 'Google-Extended'], allow: '/' },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
