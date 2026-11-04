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
    hoverImage: '/images/chocolate-chip-eaten.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Egg', 'Soya'],
  },
  {
    id: 'red-velvet',
    slug: 'red-velvet-cheesecake',
    name: 'Red Velvet Cheesecake',
    description: 'Rich red velvet cookie with white chocolate chunks and a cheesecake swirl.',
    price: 3.75,
    image: '/images/red-velvet-cheesecake.webp',
    hoverImage: '/images/red-velvet-cheesecake-eaten.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Egg', 'Soya'],
  },
  {
    id: 'cookies-cream',
    slug: 'cookies-and-cream',
    name: 'Cookies & Cream',
    description: "Vanilla cookie loaded with crushed Oreo® and white chocolate chips.",
    price: 3.5,
    image: '/images/cookies-and-cream.webp',
    hoverImage: '/images/cookies-and-cream-eaten.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Egg', 'Soya'],
  },
  {
    id: 'biscoff-white-choc',
    slug: 'biscoff-white-chocolate',
    name: 'Biscoff & White Chocolate',
    description: 'Biscoff cookie pieces and smooth white chocolate chunks.',
    price: 3.75,
    image: '/images/biscoff-and-white-chocolate.webp',
    hoverImage: '/images/biscoff-and-white-chocolate-eaten.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Soya'],
  },
  {
    id: 'triple-choc-smores',
    slug: 'triple-chocolate-smores',
    name: "Triple Chocolate S'mores",
    description: 'Triple chocolate cookie with toasted marshmallow and milk chocolate chunks.',
    price: 3.75,
    image: '/images/triple-chocolate-smores.webp',
    hoverImage: '/images/triple-chocolate-smores-eaten.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Egg', 'Soya'],
  },
  {
    id: 'brookie',
    slug: 'brookie',
    name: 'Brookie',
    description: 'The best of both worlds - fudgy brownie and cookie in one epic bake.',
    price: 3.75,
    image: '/images/brookie.webp',
    hoverImage: '/images/brookie-eaten.webp',
    allergens: ['Wheat (gluten)', 'Dairy', 'Egg', 'Soya', 'Nuts'],
  },
];

export const products: Product[] = [
  {
    id: 'box-of-3',
    slug: 'build-your-box',
    title: 'Build Your Box of 3',
    description:
      'Choose any 3 of our six signature flavours and build your perfect box.',
    price: 16.95,
    image: '/images/shop-hero-box.webp',
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
          'We aim for your cookies to arrive at your door within 5–10 working days of placing your order. Every box is baked fresh to order, so there can be a short wait before your cookies are dispatched. Once baked, your order is sent via a tracked 24-hour delivery service.',
      },
      {
        question: 'Where do you deliver and how much does delivery cost?',
        answer:
          'We deliver across the UK via a tracked 24-hour delivery service. As soon as your order is on its way, you’ll receive a delivery confirmation via text and/or email with your tracking details, so you can keep an eye on your cookie delivery.',
      },
      {
        question: 'Can I cancel my order?',
        answer:
          'Cancellations are possible before your order has started baking. As we’re a small home bakery and each box is baked fresh to order, once baking has started we’re unfortunately unable to cancel or refund the order. If you need to cancel your order, please get in touch with us as soon as possible after placing it.',
      },
      {
        question: 'Can I change my delivery address?',
        answer:
          'If you need to change your delivery address, please contact us within 24 hours of placing your order. We’ll do our best to update your address before your order is dispatched, but we can’t guarantee that changes will be possible once your order has started baking or been dispatched.',
      },
      {
        question: 'Returns Policy',
        answer:
          'As our cookies are freshly baked to order, we’re unable to accept returns once your order has been dispatched, as returned food products cannot be sold once dispatched.',
      },
      {
        question: 'Refund Policy',
        answer:
          'As our cookies are freshly baked to order and perishable goods, we do not accept refunds for change of mind. If your order arrives faulty, damaged, incorrect or not as described, please contact us within 24 hours of delivery with your order number and clear photos of the issue. We’ll review this and where appropriate offer a refund or replacement. Refunds, when approved, can take up to 10 working days to process.',
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
          'Our cookies are best enjoyed fresh, but they can be stored in an airtight container at room temperature for up to 5-7 days. For the best texture and flavour we recommend enjoying them as soon as possible after delivery.',
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
          'Yes, 10-20 seconds in the microwave brings back that freshly baked gooey centre. Our favourite way to enjoy them.',
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
          'Yes, please see our full allergen statement and per cookie flavour ingredient lists on our Allergens page.',
      },
    ],
  },
  {
    id: 'contact-us',
    title: 'Contact Us',
    items: [
      {
        question: 'How can I get in touch regarding my order?',
        answer:
          'Use the contact form below and we will reply within 1-3 business working days.',
      },
    ],
  },
];

export const siteConfig = {
  name: 'Biggs',
  domain: 'biggsbakes.com',
  email: 'hello@biggsbakes.com',
  tagline: 'NYC-inspired cookies. Baked in Britain.',
  author: {
    name: 'WebFuZsion',
    url: 'https://webfuzsion.co.uk',
    email: 'hello@webfuzsion.co.uk',
  },
  social: {
    instagram: 'https://instagram.com/biggsbakes',
    tiktok: 'https://tiktok.com/@biggsbakes',
  },
};
