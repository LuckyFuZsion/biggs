import { siteConfig } from '@/lib/data';
import Reveal from '@/components/Reveal';

export default function PrivacyPage() {
  return (
    <div className="bg-biggs-cream">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <p className="hero-enter nav-tracking text-xs font-semibold uppercase text-biggs-green/60">
          Legal
        </p>
        <h1 className="hero-enter hero-enter-delay-1 mt-2 font-display text-4xl font-bold text-biggs-green">
          Privacy Policy
        </h1>

        <Reveal className="mt-8 space-y-6 text-sm leading-relaxed text-biggs-green/80" variant="up">
          <p>
            This policy explains what information {siteConfig.name} collects when you use our
            website and place an order, and how we use it.
          </p>

          <div>
            <h2 className="font-display text-xl font-bold text-biggs-green">
              Information We Collect
            </h2>
            <p className="mt-2">
              When you place an order or get in touch, we collect the details needed to fulfil
              it - your name, delivery address, email address and order contents. We don&rsquo;t
              store payment card details ourselves; payments are handled securely by our
              payment provider.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-biggs-green">
              How We Use Your Information
            </h2>
            <p className="mt-2">
              We use your details to process and deliver your order, send order updates, and
              respond to any enquiries. If you&rsquo;ve opted in to our mailing list, we&rsquo;ll use your
              email to send occasional updates about new flavours and offers - you can
              unsubscribe at any time.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-biggs-green">Sharing</h2>
            <p className="mt-2">
              We only share your information with the third parties needed to fulfil your
              order, such as our delivery courier and payment processor. We don&rsquo;t sell your
              data.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-biggs-green">Your Rights</h2>
            <p className="mt-2">
              You can ask us what information we hold about you, request that it&rsquo;s corrected or
              deleted, or opt out of marketing emails at any time by getting in touch.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-biggs-green">Contact</h2>
            <p className="mt-2">
              For any privacy-related questions, reach us via our{' '}
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
