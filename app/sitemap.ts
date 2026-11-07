import type { MetadataRoute } from 'next';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://biggsbakes.com').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ['/', 1],
    ['/shop', 0.9],
    ['/about', 0.6],
    ['/faq', 0.6],
    ['/allergens', 0.5],
    ['/terms', 0.3],
    ['/privacy', 0.3],
  ];
  return pages.map(([path, priority]) => ({
    url: `${base}${path === '/' ? '' : path}`,
    lastModified: new Date(),
    priority,
  }));
}
