# Biggs Bakes - front-end mockup

Built by [WebFuZsion](https://webfuzsion.co.uk).

A hardcoded Next.js 14 (App Router) + TypeScript + Tailwind build of the Biggs Bakes site,
based on the client's design spec (colours, fonts, page list) and the mockup screenshots.

All product/flavour data is currently **hardcoded** in `lib/data.ts` - nothing here talks to
Shopify yet. It's deliberately shaped to match what the Shopify Storefront API will return
later, so swapping it in should mean editing `lib/data.ts` and a handful of fetch calls,
not restructuring the components.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

> This project was built inside a sandboxed environment with no access to the npm registry,
> so `npm install` has **not** been run or verified here - do that first thing when you open
> it in Cursor. If anything doesn't compile, it'll most likely be a small typo; ping me with
> the error and I'll fix it.

## Pages

| Route                     | Purpose                                                        |
|----------------------------|-----------------------------------------------------------------|
| `/`                        | Homepage - hero, flavour grid, story teaser, trust row, mailing list |
| `/shop`                    | Flavour grid + "Build your own box" banner                     |
| `/shop/build-your-box`     | The core product page - 3 flavour dropdowns, gated Add to Cart |
| `/about`                   | Founders' story                                                 |
| `/allergens`               | Allergen statement + per-flavour ingredients                    |
| `/faq`                     | FAQ accordion (5 categories) + contact form                     |
| `/cart`                    | Cart contents, gated checkout (allergen checkbox required)      |

## Cart

`components/CartProvider.tsx` is a simple React Context cart (persisted to `localStorage`
in the browser) - quantity, line items, and a `properties` object per line for the 3 chosen
flavours. That `properties` shape maps directly onto Shopify's cart **line item properties**,
which is how the flavour choices will get passed through once this is wired up for real.

## Known placeholders to swap before launch

- All images are `placehold.co` placeholders - swap for real photography.
- Logo is text-only ("Biggs" in the display font) - drop in the real logo PNG from Google Drive.
- Mailing list signup and the FAQ contact form both just show a success state - no real
  submission wired up yet.
- Terms & Conditions / Privacy Policy in the footer are placeholder text, not linked pages.

## Next step: wiring in Shopify

See the plan already discussed - install the Shopify "Headless" channel, generate a
Storefront API token, and replace the static arrays in `lib/data.ts` with GraphQL queries
against Shopify's Storefront API. The cart's `properties` field and the flavour/product
shapes in `lib/types.ts` were built with that swap in mind.
