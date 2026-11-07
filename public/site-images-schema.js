/**
 * The pictures on the MAIN website that the client can change from the admin.
 * (Flavour photos come from Shopify and are changed there. Payment logos and favicons are fixed.)
 *
 * key       also the field name in the database document site/images, and the name the main site asks for
 * idPrefix  letters only, 2 to 12 (stored image ids look like  hero-1712345678901)
 * defSrc    the built-in picture, shown in the admin until one is uploaded
 *
 * Keep this list in step with firestore.rules (validSiteImages) and
 * biggs-bakes/lib/site-images.ts. If you add a slot, add it in all three places.
 */
window.BIGGS_SITE_IMAGES = [
  { key: 'logo', idPrefix: 'sitelogo', label: 'Logo', where: 'Top bar and footer on every page',
    maxDim: 600, format: 'webp', defSrc: 'admin/site-defaults/logo.webp', hint: 'Transparent background works best.' },
  { key: 'hero', idPrefix: 'hero', label: 'Home page hero picture', where: 'Large picture at the top of the home page',
    maxDim: 1400, format: 'webp', defSrc: 'admin/site-defaults/hero.webp', hint: 'A square picture on a transparent or plain background.' },
  { key: 'story', idPrefix: 'story', label: 'Home page story picture', where: 'Next to "A simple obsession" on the home page',
    maxDim: 1400, format: 'webp', defSrc: 'admin/site-defaults/story.webp', hint: 'Wide picture, about 4 by 3.' },
  { key: 'about', idPrefix: 'about', label: 'Our Story page picture', where: 'Large picture at the top of the Our Story page',
    maxDim: 1600, format: 'webp', defSrc: 'admin/site-defaults/about.png', hint: 'Wide picture, about 16 by 10.' },
  { key: 'shopHero', idPrefix: 'shophero', label: 'Shop page picture', where: 'Top of the Shop page, beside the word Shop',
    maxDim: 1600, format: 'webp', defSrc: 'admin/site-defaults/shop-hero.webp', hint: 'Wide picture, transparent or cream background.' },
  { key: 'box', idPrefix: 'cookiebox', label: 'Cookie box picture', where: 'Build your box panel and the cart',
    maxDim: 1200, format: 'webp', defSrc: 'admin/site-defaults/cookies-box.webp', hint: 'The box with cookies, transparent background.' },
  { key: 'mailing', idPrefix: 'mailing', label: 'Sign-up card picture', where: 'The "Be the first to get Biggs cookies" card on the main site',
    maxDim: 1200, format: 'webp', defSrc: 'admin/site-defaults/mailing.webp', hint: 'Square picture works best.' },
];
