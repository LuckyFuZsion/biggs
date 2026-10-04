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
  variants: { nodes: { id: string; availableForSale: boolean }[] };
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
  availableForSale: boolean;
  tags: string[];
  images: { nodes: { url: string }[] };
  variants: { nodes: { price: { amount: string } }[] };
};

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
    { revalidate: 60 }
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

/** Creates a Shopify cart from our local cart and returns the hosted checkout URL. */
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

  const lines = items.map((item) => {
    const p = item.properties ?? {};
    const attributes = [
      p.flavour1 && { key: 'Cookie 1', value: p.flavour1 },
      p.flavour2 && { key: 'Cookie 2', value: p.flavour2 },
      p.flavour3 && { key: 'Cookie 3', value: p.flavour3 },
    ].filter(Boolean);
    return { merchandiseId: variantId, quantity: item.quantity, attributes };
  });

  const data = await storefront<{
    cartCreate: {
      cart: { checkoutUrl: string } | null;
      userErrors: { message: string }[];
    };
  }>(
    /* GraphQL */ `
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
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
  return cart.checkoutUrl;
}
