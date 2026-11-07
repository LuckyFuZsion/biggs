import { faqCategories, flavours, products, siteConfig } from './data';
import type { Flavour } from './types';

const SITE_URL = `https://${siteConfig.domain}`;

function absoluteUrl(path: string) {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function organizationSchema() {
  return {
    '@type': ['Organization', 'Bakery'],
    '@id': `${SITE_URL}/#organization`,
    name: 'Biggs Bakes',
    alternateName: siteConfig.name,
    url: SITE_URL,
    logo: absoluteUrl('/images/logo.webp'),
    image: absoluteUrl('/images/opengraph.jpg'),
    description:
      'Thick, gooey, NYC-inspired cookies baked fresh in Britain. Build your own box of 3 from six signature flavours.',
    email: siteConfig.email,
    slogan: siteConfig.tagline,
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    sameAs: [siteConfig.social.instagram, siteConfig.social.tiktok],
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.email,
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Biggs Bakes',
    description: siteConfig.tagline,
    publisher: { '@id': `${SITE_URL}/#organization` },
    creator: {
      '@type': 'Organization',
      name: 'WebFuZsion',
      url: 'https://webfuzsion.co.uk',
      logo: absoluteUrl('/images/webfuzsion.png'),
    },
    author: {
      '@type': 'Organization',
      name: 'WebFuZsion',
      url: 'https://webfuzsion.co.uk',
    },
    inLanguage: 'en-GB',
  };
}

const IN_STOCK = 'https://schema.org/InStock';
const OUT_OF_STOCK = 'https://schema.org/OutOfStock';

export function flavourProductSchema(flavour: Flavour) {
  return {
    '@type': 'Product',
    '@id': `${SITE_URL}/shop#${flavour.slug}`,
    name: flavour.name,
    description: flavour.description,
    image: absoluteUrl(flavour.image),
    sku: flavour.id,
    brand: {
      '@type': 'Brand',
      name: 'Biggs Bakes',
    },
    category: 'Cookies',
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/shop`,
      priceCurrency: 'GBP',
      price: flavour.price.toFixed(2),
      availability: flavour.soldOut ? OUT_OF_STOCK : IN_STOCK,
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

/** `inStock` is false when every flavour is sold out (the box itself is not stock-tracked). */
export function boxProductSchema(inStock = true) {
  const box = products[0];
  return {
    '@type': 'Product',
    '@id': `${SITE_URL}/shop#build-your-box`,
    name: box.title,
    description: box.description,
    image: absoluteUrl(box.image),
    sku: box.id,
    brand: {
      '@type': 'Brand',
      name: 'Biggs Bakes',
    },
    category: 'Cookie Boxes',
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/shop#build-your-box`,
      priceCurrency: 'GBP',
      price: box.price.toFixed(2),
      availability: inStock ? IN_STOCK : OUT_OF_STOCK,
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

/** Pass the live flavours (from getFlavours) so each product shows its real stock. */
export function shopProductsSchema(liveFlavours: Flavour[] = flavours) {
  const list = liveFlavours.filter((f) => f.inShop !== false);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/shop#products`,
    name: 'Biggs Bakes Cookies',
    itemListElement: [
      ...list.map((flavour, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: flavourProductSchema(flavour),
      })),
      {
        '@type': 'ListItem',
        position: list.length + 1,
        item: boxProductSchema(list.some((f) => !f.soldOut)),
      },
    ],
  };
}

export function faqPageSchema() {
  const entities = faqCategories.flatMap((category) =>
    category.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    }))
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/faq#faq`,
    mainEntity: entities,
  };
}

export function siteGraphSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), websiteSchema()],
  };
}
