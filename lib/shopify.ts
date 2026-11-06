import { CartItem } from './types';

/**
 * Minimal Shopify Storefront API client (public token, safe for the browser).
 * Env vars (set in .env.local and in Vercel):
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN       e.g. your-store.myshopify.com
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN   public Storefront API access token
 *   NEXT_PUBLIC_SHOPIFY_API_VERSION        optional, defaults below
 */
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2026-07';

export const BOX_HANDLE = 'build-your-box';

export function isShopifyConfigured() {
  return Boolean(DOMAIN && TOKEN);
}

async function storefront<T>(
  query: string,
  variables?: Record<string, unknown>,
  init?: { revalidate?: number }
): Promise<T> {
  if (!DOMAIN || !TOKEN) {
    throw new Error('Shopify is not configured (missing store domain or token).');
  }
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    ...(init?.revalidate !== undefined ? { next: { revalidate: init.revalidate } } : {}),
  });
  if (!res.ok) {
    throw new Error(`Shopify request failed (${res.status}).`);
  }
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join('; '));
  }
  return json.data as T;
}

type ProductNode = {
  handle: string;
  title: string;
  availableForSale: boolean;
  variants: { nodes: { id: string; availableForSale: boolean; price: { amount: string } }[] };
};

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products {
    products(first: 50) {
      nodes {
        handle
        title
        availableForSale
        variants(first: 1) {
          nodes {
            id
            availableForSale
            price {
              amount
            }
          }
        }
      }
    }
  }
`;

export async function fetchProducts(): Promise<ProductNode[]> {
  const data = await storefront<{ products: { nodes: ProductNode[] } }>(PRODUCTS_QUERY);
  return data.products.nodes;
}

export type ShopifyFlavourProduct = {
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  tags: string[];
  images: { nodes: { url: string }[] };
  variants: { nodes: { price: { amount: string } }[] };
};

/**
 * Shopify's plain `description` drops the line/paragraph breaks set in the product editor,
 * so we read the HTML and turn the breaks back into newlines (shown with `whitespace-pre-line`).
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Full product details for the flavour cards (server-side, cached briefly). */
export async function fetchFlavourProducts(): Promise<ShopifyFlavourProduct[]> {
  const data = await storefront<{ products: { nodes: ShopifyFlavourProduct[] } }>(
    /* GraphQL */ `
      query FlavourProducts {
        products(first: 50) {
          nodes {
            handle
            title
            description
            descriptionHtml
            availableForSale
            tags
            images(first: 2) {
              nodes {
                url
              }
            }
            variants(first: 1) {
              nodes {
                price {
                  amount
                }
              }
            }
          }
        }
      }
    `,
    undefined,
    { revalidate: 600 }
  );
  return data.products.nodes;
}

/** Words that must all appear in a Shopify product's title (or handle) to identify each flavour. */
const FLAVOUR_WORDS: Record<string, string[]> = {
  'choc-chip': ['chocolate', 'chip'],
  'red-velvet': ['red', 'velvet'],
  'cookies-cream': ['cookies', 'cream'],
  'biscoff-white-choc': ['biscoff'],
  'triple-choc-smores': ['mores'],
  brookie: ['brookie'],
};

export function matchFlavourId(title: string): string | undefined {
  const hay = normalise(title);
  return Object.entries(FLAVOUR_WORDS).find(([, words]) => words.every((w) => hay.includes(w)))?.[0];
}

function normalise(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

/** Live check: map of Shopify product handle -> true for products that are sold out. */
export async function fetchSoldOutHandles(): Promise<Record<string, boolean>> {
  const products = await fetchProducts();
  const soldOut: Record<string, boolean> = {};
  for (const p of products) {
    if (!p.availableForSale) soldOut[p.handle] = true;
  }
  return soldOut;
}

/** Shown to the customer as-is when checkout cannot be started for a reason they can fix. */
export class CheckoutError extends Error {}

/**
 * Creates a Shopify cart from our local cart and returns the hosted checkout URL.
 *
 * Each box is the "Build Your Box" product (GBP 16.95) plus one line per chosen flavour. The flavour products
 * are priced GBP 0, so the total is unchanged, but Shopify now counts each flavour's stock down and the order
 * and dispatch note list the real flavours and SKUs. The "Cookie 1/2/3" notes stay on the box line as well.
 *
 * If Shopify cannot supply the full quantity of any line (a flavour has sold out since the page loaded), we stop
 * instead of sending the customer to a checkout with fewer cookies than they chose.
 */
export async function createCheckout(
  items: CartItem[],
  options: { allergenAccepted: boolean }
): Promise<string> {
  const products = await fetchProducts();
  const box = products.find((p) => p.handle === BOX_HANDLE);
  const variantId = box?.variants.nodes[0]?.id;
  if (!variantId) {
    throw new Error('The box product could not be found in Shopify.');
  }

  const lines: { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }[] = [];
  const flavourQty = new Map<string, number>(); // flavour variant id -> total cookies wanted
  const names = new Map<string, string>(); // flavour variant id -> product title

  for (const item of items) {
    const p = item.properties ?? {};
    const attributes = [
      p.flavour1 && { key: 'Cookie 1', value: p.flavour1 },
      p.flavour2 && { key: 'Cookie 2', value: p.flavour2 },
      p.flavour3 && { key: 'Cookie 3', value: p.flavour3 },
    ].filter(Boolean) as { key: string; value: string }[];
    lines.push({ merchandiseId: variantId, quantity: item.quantity, attributes });

    for (const handle of [p.handle1, p.handle2, p.handle3]) {
      if (!handle) continue;
      const flavour = products.find((x) => x.handle === handle);
      const variant = flavour?.variants.nodes[0];
      const id = variant?.id;
      // Flavour not found, or not priced at GBP 0 yet: skip its line so the customer is never charged for it.
      // The box still goes through with its Cookie 1/2/3 notes.
      if (!flavour || !id || Number(variant?.price.amount) !== 0) continue;
      flavourQty.set(id, (flavourQty.get(id) ?? 0) + item.quantity);
      names.set(id, flavour.title);
    }
  }
  for (const [id, quantity] of flavourQty) lines.push({ merchandiseId: id, quantity });

  const data = await storefront<{
    cartCreate: {
      cart: {
        checkoutUrl: string;
        lines: { nodes: { quantity: number; merchandise: { id: string } }[] };
      } | null;
      userErrors: { message: string }[];
    };
  }>(
    /* GraphQL */ `
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
            lines(first: 50) {
              nodes {
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
          userErrors {
            message
          }
        }
      }
    `,
    {
      input: {
        lines,
        attributes: [
          {
            key: 'Allergen & home kitchen warning accepted',
            value: options.allergenAccepted ? 'Yes' : 'No',
          },
        ],
      },
    }
  );

  const { cart, userErrors } = data.cartCreate;
  if (!cart || userErrors.length) {
    throw new Error(userErrors[0]?.message || 'Could not create the checkout.');
  }

  // Did Shopify accept everything we asked for? It quietly lowers a quantity when stock runs short.
  const accepted = new Map<string, number>();
  for (const n of cart.lines.nodes) {
    accepted.set(n.merchandise.id, (accepted.get(n.merchandise.id) ?? 0) + n.quantity);
  }
  const wanted = new Map<string, number>();
  for (const l of lines) wanted.set(l.merchandiseId, (wanted.get(l.merchandiseId) ?? 0) + l.quantity);
  for (const [id, quantity] of wanted) {
    if ((accepted.get(id) ?? 0) < quantity) {
      const what = names.get(id);
      throw new CheckoutError(
        what
          ? `Sorry, we don't have enough ${what} left for your box. Please change a flavour and try again.`
          : 'Sorry, we have sold out of boxes. Please check back soon.'
      );
    }
  }
  return cart.checkoutUrl;
}
