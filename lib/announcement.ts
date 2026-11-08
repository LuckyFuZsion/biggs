import { API_BASE } from '@/lib/site-images';

/**
 * The thin bar across the top of every page. The client turns it on or off and changes its words in the
 * admin (Banner tab). The admin saves it to Firestore, the Worker serves it, and this reads it (cached for a
 * minute). If nothing is saved or the Worker cannot be reached, there is no banner and the header and page
 * spacing adjust on their own.
 *
 * Keep in step with biggs-bakes-holding/firestore.rules (validBanner) and the Worker's /api/banner.
 */
export async function getBanner(): Promise<string> {
  if (!API_BASE) return '';
  try {
    const res = await fetch(`${API_BASE}/api/banner`, { next: { revalidate: 60 } });
    if (!res.ok) return '';
    const data = await res.json();
    const b = data?.banner;
    if (b && b.enabled === true && typeof b.text === 'string') return b.text.trim().slice(0, 120);
    return '';
  } catch {
    return '';
  }
}
