/**
 * Pictures the client can change from the admin (logo, hero, story, about, shop hero, cookie box,
 * sign-up card). The admin saves which picture each slot uses; the Worker serves that list and the
 * pictures themselves. If nothing is saved, or the Worker cannot be reached, every slot falls back
 * to the built-in file in /public/images, so the site never breaks.
 *
 * Needs NEXT_PUBLIC_SUBSCRIBE_URL (the same Worker address the sign-up box uses).
 * Keep the slot names in step with biggs-bakes-holding/site-images-schema.js and firestore.rules.
 */

export type SiteImageSlot = 'logo' | 'hero' | 'story' | 'about' | 'shopHero' | 'box' | 'mailing';
export type SiteImages = Partial<Record<SiteImageSlot, string>>;

const SLOTS: SiteImageSlot[] = ['logo', 'hero', 'story', 'about', 'shopHero', 'box', 'mailing'];
const IMAGE_ID = /^[a-z]{2,12}-\d{10,14}$/;

/** Worker address, taken from the sign-up address so there is only one setting to maintain. */
export const API_BASE = (process.env.NEXT_PUBLIC_SUBSCRIBE_URL || '').replace(/\/api\/subscribe\/?$/, '');

/** Server side: which picture id is saved for each slot. Cached for a minute. */
export async function getSiteImages(): Promise<SiteImages> {
  if (!API_BASE) return {};
  try {
    const res = await fetch(`${API_BASE}/api/site-images`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    const data = await res.json();
    const out: SiteImages = {};
    for (const slot of SLOTS) {
      const id = data?.images?.[slot];
      if (typeof id === 'string' && IMAGE_ID.test(id)) out[slot] = id;
    }
    return out;
  } catch {
    return {};
  }
}

/** The address to use for a slot: the uploaded picture if there is one, otherwise the built-in file. */
export function resolveImage(images: SiteImages, slot: SiteImageSlot, fallback: string): string {
  const id = images[slot];
  return id && API_BASE ? `${API_BASE}/api/img/${id}` : fallback;
}

/** Convenience for server components. */
export async function siteImage(slot: SiteImageSlot, fallback: string): Promise<string> {
  return resolveImage(await getSiteImages(), slot, fallback);
}
