import Reveal from '@/components/Reveal';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta(
  "Terms & Conditions",
  "The terms and conditions for ordering from Biggs Bakes, covering orders, delivery, returns and payments.",
  "/terms",
);

type Block = { type: 'p'; text: string } | { type: 'ul'; items: string[] };
type Section = { title: string; blocks: Block[] };

const p = (text: string): Block => ({ type: 'p', text });

// Source: Joe's "Terms & Conditions" (last updated 4th November 2026).
const SECTIONS: Section[] = [
  {
    title: '1. About Us',
    blocks: [
      p('Biggs Bakes is operated by Biggs Productions Limited, a limited company registered in England & Wales.'),
      p(
        'By placing an order through our website www.biggsbakes.com, you agree to be bound by these Terms & Conditions, which apply to all purchases made through our website.'
      ),
      p('Company name: Biggs Productions Limited'),
      p('Company registration number: 16768990'),
      p('Registered address: 86-90 Paul Street, London, EC2A 4NE'),
    ],
  },
  {
    title: '2. Prices & Payment',
    blocks: [
      p(
        'All products are subject to availability. Prices are shown in pounds sterling (GBP). Biggs Bakes is not VAT registered, so no VAT is added. We may change prices at any time, but changes will not affect orders we have already confirmed.'
      ),
      p('Full payment is required at checkout when placing your order.'),
      p(
        'We currently accept Visa, Mastercard, PayPal and Apple Pay. Payments are processed securely through Shopify and its supported payment providers.'
      ),
    ],
  },
  {
    title: '3. Ordering',
    blocks: [
      p('All orders must be placed through our website, www.biggsbakes.com.'),
      p(
        'Our cookie boxes are available as a build your own box of three, allowing you to choose three flavours from our available menu. Every box is freshly baked to order in small batches.'
      ),
      p(
        'Once you place an order, you will receive an order confirmation email. We reserve the right to contact you if there are any issues with your order, including product availability or incorrect order information.'
      ),
      p(
        'If a selected flavour becomes unavailable, we will contact you to discuss an alternative or appropriate resolution before making any changes to your order.'
      ),
      p(
        'As all our cookies are handmade, slight variations in appearance, size, shape and decoration may occur.'
      ),
    ],
  },
  {
    title: '4. Baking & Postal Delivery',
    blocks: [
      p(
        'Every box is baked fresh to order, so there can be a short wait before your cookies are dispatched. We aim for your cookies to arrive at your door within 2–10 working days of placing your order.'
      ),
      p(
        'Once baked, your order is carefully packaged and sent via Royal Mail Tracked 24. Royal Mail Tracked 24 aims to deliver the next working day after dispatch, although this is not a guaranteed delivery service.'
      ),
      p('We deliver across the UK using our postal service.'),
      p('Please note:'),
      {
        type: 'ul',
        items: [
          'Tracking information will be provided once your order has been dispatched.',
          'If you have ordered multiple boxes, your order may arrive in separate parcels.',
          'Delivery times are estimates and may occasionally be affected by postal delays or circumstances outside our control.',
          'Please ensure your delivery address is correct when placing your order.',
          'If you need to change your delivery address, please contact us within 24 hours of placing your order. We will do our best to make the change before your order enters preparation or is dispatched, but cannot guarantee that changes will be possible.',
        ],
      },
      p(
        'If your parcel is delayed, lost or arrives damaged, please contact us at hello@biggsbakes.com so we can investigate and help resolve the issue.'
      ),
      p(
        'Your statutory rights regarding delivery and the condition of your goods are not affected by these terms. Responsibility for your order remains with us until it is delivered to you or someone you have identified to receive it.'
      ),
    ],
  },
  {
    title: '5. Cancellations & Refunds',
    blocks: [
      p(
        'Our cookies are freshly baked to order and are perishable food products so they cannot be returned or exchanged once delivered. If you wish to cancel your order, please contact us as soon as possible at hello@biggsbakes.com. Where an order has not yet entered preparation or baking, we will do our best to accommodate cancellation requests.'
      ),
      p(
        'We do not offer refunds for change of mind where this statutory exemption applies. However, if your order arrives damaged, faulty, incorrect or not as described, please contact us within 24 hours of delivery with your order number and clear photographs of the issue.'
      ),
      p(
        'We will review the situation and, where appropriate, offer a suitable resolution, which may include a replacement or refund.'
      ),
      p(
        'Approved refunds are processed using the original payment method. We aim to process these within 10 working days, although your bank or payment provider may take additional time.'
      ),
      p('Nothing in these terms affects your statutory consumer rights.'),
    ],
  },
  {
    title: '6. Allergens & Food Safety',
    blocks: [
      p(
        'All our cookies are homemade in our home kitchen, where allergens including WHEAT (gluten), MILK, SOYA, PEANUTS and TREE NUTS are handled regularly.'
      ),
      p(
        'Although we take care to minimise the risk of cross-contamination, we cannot guarantee that our cookies are completely free from traces of these and other allergens.'
      ),
      p(
        'Please check the individual allergen and ingredient information for each cookie before ordering. Our full allergen and ingredient information can be found on our Allergens page.'
      ),
      p(
        'If you have a food allergy or intolerance and are unsure whether our products are suitable for you, please contact us before placing an order. We make every effort to maintain high standards of food hygiene, preparation and packaging.'
      ),
    ],
  },
  {
    title: '7. Storage & Freshness',
    blocks: [
      p(
        'Our cookies are best enjoyed fresh, but they can be stored in an airtight container at room temperature for up to 5-7 days. For the best texture and flavour we recommend enjoying them as soon as possible after delivery.'
      ),
      p(
        'For an extra gooey centre, we recommend warming your cookie in the microwave for 10–15 seconds. Please remove all packaging before heating.'
      ),
    ],
  },
  {
    title: '8. Intellectual Property',
    blocks: [
      p(
        'All content on the Biggs website, including text, photographs, images, graphics, logos, branding, designs and other materials, belongs to Biggs Bakes or is used with permission.'
      ),
      p(
        'This content is protected by applicable intellectual property laws and must not be copied, reproduced, distributed or used for commercial purposes without our prior written permission.'
      ),
    ],
  },
  {
    title: '9. Limitation of Liability',
    blocks: [
      p('We take care to prepare, package and dispatch every order to a high standard.'),
      p(
        'Nothing in these Terms & Conditions excludes or limits our liability for anything that cannot legally be excluded or limited under UK law, including your statutory consumer rights.'
      ),
      p(
        'We are not responsible for delays caused by circumstances outside our reasonable control, although we will always do our best to assist in resolving any issues.'
      ),
    ],
  },
  {
    title: '10. Contact & Governing Law',
    blocks: [
      p(
        'If you have any questions about these Terms & Conditions, your order or our products, please contact us at hello@biggsbakes.com'
      ),
      p(
        'These Terms & Conditions are governed by the laws of England and Wales and any dispute can be dealt with by the courts of England and Wales.'
      ),
    ],
  },
];

const LINK_CLASS = 'font-semibold underline underline-offset-2';
const BOLD_CLASS = 'font-bold text-biggs-green';

/** Turns the website address, email address and "Allergens page" into links, and bolds the allergen words. */
function render(text: string) {
  const parts = text.split(
    /(www\.biggsbakes\.com|hello@biggsbakes\.com|Allergens page|WHEAT|MILK|SOYA|PEANUTS|TREE NUTS)/
  );
  return parts.map((part, i) => {
    if (part === 'www.biggsbakes.com') {
      return (
        <a key={i} href="https://www.biggsbakes.com" className={LINK_CLASS}>
          {part}
        </a>
      );
    }
    if (part === 'hello@biggsbakes.com') {
      return (
        <a key={i} href="mailto:hello@biggsbakes.com" className={LINK_CLASS}>
          {part}
        </a>
      );
    }
    if (part === 'Allergens page') {
      return (
        <a key={i} href="/allergens" className={LINK_CLASS}>
          {part}
        </a>
      );
    }
    if (/^(WHEAT|MILK|SOYA|PEANUTS|TREE NUTS)$/.test(part)) {
      return (
        <strong key={i} className={BOLD_CLASS}>
          {part}
        </strong>
      );
    }
    return part;
  });
}

export default function TermsPage() {
  return (
    <div className="bg-biggs-cream">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <p className="hero-enter nav-tracking text-xs font-semibold uppercase text-biggs-green/60">
          Legal
        </p>
        <h1 className="hero-enter hero-enter-delay-1 mt-2 font-display text-4xl font-bold text-biggs-green">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-sm text-biggs-green/60">Last updated: 4th November 2026</p>

        <Reveal className="mt-8 space-y-8 text-sm leading-relaxed text-biggs-green/80" variant="up">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl font-bold text-biggs-green">{section.title}</h2>
              <div className="mt-3 space-y-3">
                {section.blocks.map((block, i) =>
                  block.type === 'ul' ? (
                    <ul key={i} className="list-disc space-y-2 pl-5">
                      {block.items.map((item) => (
                        <li key={item}>{render(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i}>{render(block.text)}</p>
                  )
                )}
              </div>
            </section>
          ))}

          <p className="font-semibold text-biggs-green">
            Thank you for supporting Biggs Bakes. We appreciate every order and hope you love your
            cookies as much as we love baking them.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
