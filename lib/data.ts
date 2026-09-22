import { Flavour, Product, FaqCategory } from './types';

/**
 * Local imagery from /public/images (generated via `npm run generate:images`).
 * Swap for Shopify CDN URLs before launch if needed.
 */
export const flavours: Flavour[] = [
  {
    id: 'choc-chip',
    slug: 'chocolate-chip',
    name: 'Chocolate Chip',
    description: 'The classic done right - thick, gooey and loaded with chocolate.',
    price: 3.5,
    image: '/images/chocolate-chip.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Egg', 'Soya'],
  },
  {
    id: 'red-velvet',
    slug: 'red-velvet-cheesecake',
    name: 'Red Velvet Cheesecake',
    description: 'Rich red velvet cookie with white chocolate chunks and a cheesecake swirl.',
    price: 3.75,
    image: '/images/red-velvet-cheesecake.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Egg', 'Soya'],
  },
  {
    id: 'cookies-cream',
    slug: 'cookies-and-cream',
    name: 'Cookies & Cream',
    description: "Vanilla cookie loaded with crushed Oreo® and white chocolate chips.",
    price: 3.5,
    image: '/images/cookies-and-cream.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Egg', 'Soya'],
  },
  {
    id: 'biscoff-white-choc',
    slug: 'biscoff-white-chocolate',
    name: 'Biscoff & White Chocolate',
    description: 'Biscoff cookie pieces and smooth white chocolate chunks.',
    price: 3.75,
    image: '/images/biscoff-and-white-chocolate.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Soya'],
  },
  {
    id: 'triple-choc-smores',
    slug: 'triple-chocolate-smores',
    name: "Triple Chocolate S'mores",
    description: 'Triple chocolate cookie with toasted marshmallow and milk chocolate chunks.',
    price: 3.75,
    image: '/images/triple-chocolate-smores.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Egg', 'Soya'],
  },
  {
    id: 'brookie',
    slug: 'brookie',
    name: 'Brookie',
    description: 'The best of both worlds - fudgy brownie and cookie in one epic bake.',
    price: 3.75,
    image: '/images/brookie.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Egg', 'Soya', 'Nuts'],
  },
];

export const products: Product[] = [
  {
    id: 'box-of-3',
    slug: 'build-your-box',
    title: 'Build Your Box of 3',
    description:
      'Choose any 3 of our six signature flavours and build your perfect box. Thick, gooey, NYC-inspired cookies, baked fresh in Britain.',
    price: 10.5,
    image: '/images/cookies-box.webp',
    type: 'box-of-3',
  },
];

export const faqCategories: FaqCategory[] = [
  {
    id: 'ordering-delivery',
    title: 'Ordering & Delivery',
    items: [
      {
        question: 'When will my order arrive?',
        answer:
          'Orders are baked fresh to order and dispatched within our published dispatch window. You’ll get a shipping confirmation with tracking as soon as it’s on its way.',
      },
      {
        question: 'Why is there a wait for dispatch?',
        answer:
          'Every box is baked fresh rather than pulled from a warehouse shelf, so we batch bakes and dispatch on set days each week to guarantee freshness.',
      },
      {
        question: 'Can I change my delivery address?',
        answer:
          'Get in touch as soon as possible after ordering and we’ll do our best to update it before your order is dispatched.',
      },
      {
        question: 'Can I cancel my order?',
        answer:
          'Cancellations are possible before your order enters production. Once baking has started we’re unable to cancel, as each box is made fresh for you.',
      },
      {
        question: 'Refunds/Returns Policy?',
        answer:
          'As a fresh food product we can’t accept returns, but if anything arrives damaged or isn’t right, contact us and we’ll sort it out.',
      },
    ],
  },
  {
    id: 'storage-shelf-life',
    title: 'Storage & Shelf Life',
    items: [
      {
        question: 'How long do the cookies last?',
        answer:
          'Best enjoyed within a few days of arrival, kept in an airtight container at room temperature.',
      },
      {
        question: 'Can the cookies be frozen?',
        answer:
          'Yes - they freeze well for up to 3 months. Defrost at room temperature or warm gently before eating.',
      },
    ],
  },
  {
    id: 'how-to-enjoy',
    title: 'How To Enjoy',
    items: [
      {
        question: 'Can you heat the cookies up?',
        answer:
          '10 seconds in the microwave brings back that fresh-baked, gooey centre - our favourite way to eat them.',
      },
      {
        question: 'How big are the cookies?',
        answer: 'Each cookie is a generous, thick NYC-bakery style bake - built to be shared, or not.',
      },
    ],
  },
  {
    id: 'allergens-ingredients',
    title: 'Allergens & Ingredients',
    items: [
      {
        question: 'Do your cookies contain allergens?',
        answer:
          'Yes - see our full allergen statement and per-flavour ingredient lists on the Allergens page.',
      },
      {
        question: 'Do you offer vegan or gluten-free options?',
        answer:
          'Not currently, but it’s on our radar as we grow the range. Get in touch if that’s something you’d love to see.',
      },
    ],
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    items: [
      {
        question: 'How can I get in touch regarding my order?',
        answer: 'Use the contact form below or email us directly - we usually reply within 1 business day.',
      },
    ],
  },
];

export const siteConfig = {
  name: 'Biggs',
  domain: 'biggsbakes.com',
  email: 'hello@biggsbakes.com',
  tagline: 'NYC-inspired cookies. Baked in Britain.',
  social: {
    instagram: 'https://instagram.com/biggsbakes',
    tiktok: 'https://tiktok.com/@biggsbakes',
  },
};
