import type { Metadata } from 'next';

const DEFAULT_IMAGE = '/images/opengraph-hero.jpg';

/**
 * Per-page search/share tags: its own title, description, canonical address and share card.
 * The page title gets " | Biggs Bakes" added by the template in app/layout.tsx.
 * `path` is the page address, e.g. '/shop'. Set `noindex` for pages Google should not list.
 */
export function pageMeta(title: string, description: string, path: string, noindex = false): Metadata {
  const full = `${title} | Biggs Bakes`;
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: full,
      description,
      url: path,
      siteName: 'Biggs Bakes',
      images: [{ url: DEFAULT_IMAGE, width: 1200, height: 630, alt: 'Biggs Bakes cookies', type: 'image/jpeg' }],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: full, description, images: [DEFAULT_IMAGE] },
  };
}
