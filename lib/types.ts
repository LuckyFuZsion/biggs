export interface Flavour {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  /** Optional second photo shown on hover (Shop page cards). Falls back to `image` when unset. */
  hoverImage?: string;
  /** Set from Shopify stock when known. */
  soldOut?: boolean;
  /** Shopify product handle, used to look up live stock. */
  shopifyHandle?: string;
  /** Show on the Shop page / homepage (Shopify tag `shop`). Defaults to true. */
  inShop?: boolean;
  /** Selectable in the Build Your Box dropdowns (Shopify tag `box`). Defaults to true. */
  inBox?: boolean;
  allergens: string[];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  image: string;
  type: 'box-of-3' | 'single';
}

/**
 * These are the "custom line item properties" that Shopify's Cart API
 * supports natively. Keeping the chosen flavours in a `properties` object
 * (rather than as separate SKUs) means this shape can be sent to Shopify's
 * cartLinesAdd mutation unchanged once the real integration goes in.
 */
export interface CartLineProperties {
  flavour1?: string;
  flavour2?: string;
  flavour3?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  properties?: CartLineProperties;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}
