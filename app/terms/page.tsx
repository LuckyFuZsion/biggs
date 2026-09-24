import { siteConfig } from '@/lib/data';
import Reveal from '@/components/Reveal';

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

        <Reveal className="mt-8 space-y-6 text-sm leading-relaxed text-biggs-green/80" variant="up">
          <p>
            These terms and conditions apply to all orders placed through the {siteConfig.name}{' '}
            website. By placing an order with us, you agree to the terms set out below.
          </p>

          <div>
            <h2 className="font-display text-xl font-bold text-biggs-green">Orders</h2>
            <p className="mt-2">
              All cookies are baked fresh to order in small batches. Orders are dispatched on
              our published baking days, and you&rsquo;ll receive a confirmation email once your
              order has been placed and again once it&rsquo;s on its way.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-biggs-green">Pricing & Payment</h2>
            <p className="mt-2">
              All prices are shown in GBP and include VAT where applicable. Payment is taken in
              full at the time of ordering via our secure checkout.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-biggs-green">
              Cancellations & Refunds
            </h2>
            <p className="mt-2">
              Orders can be cancelled before they enter production. Once baking has started we&rsquo;re
              unable to offer a cancellation or refund, as each box is made fresh for you. If
              anything arrives damaged or isn&rsquo;t right, please get in touch and we&rsquo;ll put it right.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-biggs-green">Allergens</h2>
            <p className="mt-2">
              Please see our{' '}
              <a href="/allergens" className="underline">
                Allergens & Ingredients
              </a>{' '}
              page before ordering if you have a food allergy or intolerance.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-biggs-green">Contact</h2>
            <p className="mt-2">
              Questions about these terms? Reach us via our{' '}
              <a href="/faq#contact-us" className="underline">
                contact form
              </a>
              .
            </p>
          </div>

          <p className="text-xs text-biggs-green/50">Last updated: {new Date().getFullYear()}.</p>
        </Reveal>
      </div>
    </div>
  );
}
