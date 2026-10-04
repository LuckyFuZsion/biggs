import { flavours as staticFlavours } from './data';
import { Flavour } from './types';
import {
  fetchFlavourProducts,
  isShopifyConfigured,
  matchFlavourId,
  ShopifyFlavourProduct,
} from './shopify';

/** Shopify product tags that control where a product appears. */
export const TAG_SHOP = 'shop'; // shown on the Shop page and homepage
export const TAG_BOX = 'box'; // selectable in the Build Your Box dropdowns

const hasTag = (p: ShopifyFlavourProduct, tag: string) =>
  p.tags.some((t) => t.toLowerCase() === tag);

/**
 * Flavours for the website. Shopify is the source of truth: a product tagged
 * `shop` appears on the Shop page and homepage, one tagged `box` can be picked
 * in the box builder. Name, description, photos (first = main, second = hover)
 * and stock all come from Shopify. If Shopify is unavailable, or nothing is
 * tagged yet, the built-in six flavours in lib/data.ts are used instead.
 */
async function loadFlavours(): Promise<Flavour[]> {
  if (!isShopifyConfigured()) {
    console.log('[flavours] Shopify not configured: using built-in flavours');
    return staticFlavours;
  }
  try {
    const products = await fetchFlavourProducts();
    const tagged = products.filter((p) => hasTag(p, TAG_SHOP) || hasTag(p, TAG_BOX));

    // Nothing tagged yet: keep the original six, enriched from Shopify by title.
    console.log(
      '[flavours] products:',
      products.map((p) => `${p.title} [${p.tags.join(', ')}]`).join(' | ')
    );
    if (tagged.length === 0) {
      console.log('[flavours] nothing tagged shop/box: using the original six');
      return staticFlavours.map((base) => {
        const product = products.find((p) => matchFlavourId(p.title) === base.id);
        return product ? fromProduct(product, base, true, true) : base;
      });
    }

    const result = tagged.map((product) => {
      const base = staticFlavours.find((f) => f.id === matchFlavourId(product.title));
      return fromProduct(product, base, hasTag(product, TAG_SHOP), hasTag(product, TAG_BOX));
    });

    // Keep the original six in their familiar order, then any new flavours.
    const order = (f: Flavour) => {
      const i = staticFlavours.findIndex((s) => s.id === f.id);
      return i === -1 ? staticFlavours.length : i;
    };
    return result.sort((a, b) => order(a) - order(b));
  } catch (error) {
    console.log('[flavours] Shopify fetch failed, using built-in flavours:', error);
    return staticFlavours;
  }
}

function fromProduct(
  product: ShopifyFlavourProduct,
  base: Flavour | undefined,
  inShop: boolean,
  inBox: boolean
): Flavour {
  const [main, hover] = product.images.nodes;
  return {
    id: base?.id ?? product.handle,
    slug: base?.slug ?? product.handle,
    name: product.title || base?.name || product.handle,
    description: product.description?.trim() || base?.description || '',
    price: base?.price ?? Number(product.variants.nodes[0]?.price.amount ?? 0),
    image: main?.url ?? base?.image ?? '/images/cookies-box.webp',
    hoverImage: hover?.url ?? base?.hoverImage,
    allergens: base?.allergens ?? [],
    soldOut: !product.availableForSale,
    shopifyHandle: product.handle,
    inShop,
    inBox,
  };
}

/**
 * TEMPORARY layout testing: set NEXT_PUBLIC_MOCK_FLAVOURS=1 in .env.local to add
 * three fake flavours (reusing existing photos) so you can see how the pages
 * cope with more than six. Remove the env var (and this block) when finished.
 * Never set it in Vercel.
 */
const MOCKS: Flavour[] = [
  {
    id: 'mock-7',
    slug: 'mock-seasonal-special',
    name: 'Mock Seasonal Special',
    description: 'Mock flavour for layout testing. Delete me.',
    price: 3.75,
    image: '/images/brookie.webp',
    hoverImage: '/images/brookie-eaten.webp',
    allergens: [],
  },
  {
    id: 'mock-8',
    slug: 'mock-pistachio-dream',
    name: 'Mock Pistachio Dream With A Very Long Name',
    description: 'Mock flavour with a long name and a longer description to see how wrapping looks across the cards and the page.',
    price: 3.75,
    image: '/images/red-velvet-cheesecake.webp',
    hoverImage: '/images/red-velvet-cheesecake-eaten.webp',
    allergens: [],
  },
  {
    id: 'mock-9',
    slug: 'mock-sold-out',
    name: 'Mock Sold Out Flavour',
    description: 'Mock sold-out flavour for layout testing.',
    price: 3.75,
    image: '/images/cookies-and-cream.webp',
    hoverImage: '/images/cookies-and-cream-eaten.webp',
    allergens: [],
    soldOut: true,
  },
];

export async function getFlavours(): Promise<Flavour[]> {
  const list = await loadFlavours();
  if (process.env.NEXT_PUBLIC_MOCK_FLAVOURS === '1') {
    return [...list, ...MOCKS.map((m) => ({ ...m, inShop: true, inBox: true }))];
  }
  return list;
}
