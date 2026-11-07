/**
 * Every editable element of the holding page, in one place. Used by BOTH the public page
 * (to apply saved content) and the admin area (to build its editing form).
 *
 * The keys, lengths and colour format here must match functions in firestore.rules
 * (validHolding). If you add a field, add it to both.
 *
 * type    text | textarea | image | color
 * Note: browser tab title and description are applied by script, so Google may use them but
 * social media link previews (which do not run scripts) will keep the built-in ones.
 * as      how the public page applies the value:
 *           text, placeholder, aria, src, alt, title, metadesc, link, cssvar, none
 * def     the text baked into index.html. The admin opens pre-filled with it, and a field left
 *         equal to it is not saved (so the page keeps using its built-in version)
 * defSrc  for images: the built-in picture (path from the site root) shown in the admin
 */
window.BIGGS_SCHEMA = [
  { group: 'Words', key: 'heading', label: 'Main heading', type: 'textarea', max: 120,
    def: 'Be the first to get\nBiggs cookies', target: '#signup-heading', as: 'text',
    hint: 'Press Enter to start a new line.' },
  { group: 'Words', key: 'lede', label: 'Text under the heading', type: 'textarea', max: 240,
    def: 'Sign up to get updates on the next cookie drop', target: '#lede', as: 'text' },
  { group: 'Words', key: 'placeholder', label: 'Email box hint', type: 'text', max: 60,
    def: 'Your email address', target: '#email', as: 'placeholder' },
  { group: 'Words', key: 'buttonLabel', label: 'Button label (read by screen readers)', type: 'text', max: 40,
    def: 'Sign up', target: '#submit-btn', as: 'aria' },
  { group: 'Words', key: 'consent', label: 'Small print under the form (consent wording)', type: 'textarea', max: 300,
    def: 'By signing up you agree to receive emails from Biggs Bakes about\nnew drops & flavours. Unsubscribe at any time.',
    target: '#consent', as: 'text' },
  { group: 'Words', key: 'successMessage', label: 'Message after signing up', type: 'text', max: 160,
    def: 'Thanks! Check your inbox and click the link to confirm.', as: 'none' },

  { group: 'Images', key: 'logoUrl', label: 'Logo', type: 'image', maxDim: 600, format: 'webp', idPrefix: 'logo',
    defSrc: 'images/logo.webp',
    target: '#logo-img', as: 'src', hint: 'Transparent PNG or WebP works best.' },
  { group: 'Images', key: 'logoAlt', label: 'Logo description (for screen readers)', type: 'text', max: 120,
    def: 'Biggs', target: '#logo-img', as: 'alt' },
  { group: 'Images', key: 'imageUrl', label: 'Main photo', type: 'image', maxDim: 1000, format: 'webp', idPrefix: 'photo',
    defSrc: 'images/red-velvet.webp',
    target: '#cookie-img', as: 'src', hint: 'A cut-out cookie with a transparent background works best.' },
  { group: 'Images', key: 'imageAlt', label: 'Main photo description (for screen readers)', type: 'text', max: 120,
    def: 'A red velvet Biggs cookie with white chocolate drizzle', target: '#cookie-img', as: 'alt' },

  { group: 'Footer', key: 'legalLine', label: 'Company details under the card', type: 'text', max: 200,
    def: 'Biggs Productions Limited, registered in England and Wales, company no. 16768990, 86-90 Paul Street, London EC2A 4NE', target: '#legal-line', as: 'text' },
  { group: 'Footer', key: 'privacyUrl', label: 'Privacy policy link (leave empty to hide the link)', type: 'text', max: 300,
    def: '', target: '#privacy-link', as: 'link', hint: 'A full https:// address, or a page on this site such as /privacy.html.' },

  { group: 'Search and sharing', key: 'pageTitle', label: 'Browser tab and Google title', type: 'text', max: 70,
    def: 'Biggs Bakes | NYC-Inspired Cookies, Baked in Britain', as: 'title' },
  { group: 'Search and sharing', key: 'metaDescription', label: 'Google description', type: 'textarea', max: 200,
    def: 'Thick, gooey, NYC-inspired cookies baked fresh in the UK. Sign up to be the first to get Biggs cookies.',
    target: '#meta-desc', as: 'metadesc' },

  { group: 'Colours', key: 'green', label: 'Dark green (card and text)', type: 'color', def: '#243026', cssvar: '--green', as: 'cssvar' },
  { group: 'Colours', key: 'yellow', label: 'Mustard (button and highlights)', type: 'color', def: '#d7a535', cssvar: '--yellow', as: 'cssvar' },
  { group: 'Colours', key: 'cream', label: 'Cream (page background)', type: 'color', def: '#f2e6da', cssvar: '--cream', as: 'cssvar' },
];

/** Uploaded images are stored by id (for example logo-1712345678901) and served by the Worker. */
window.BIGGS_IMAGE_ID = /^[a-z]{2,12}-\d{10,14}$/;
