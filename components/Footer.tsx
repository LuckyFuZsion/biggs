import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/data';
import Reveal from './Reveal';

const LINK_COL_ONE = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop#cookies', label: 'Our Cookies' },
  { href: '/faq#ordering-delivery', label: 'Delivery' },
  { href: '/allergens', label: 'Allergens' },
  { href: '#', label: 'Terms & Conditions' },
];

const LINK_COL_TWO = [
  { href: '/about', label: 'Our Story' },
  { href: '/faq', label: 'FAQ' },
  { href: '/faq#contact-us', label: 'Contact' },
  { href: '/allergens', label: 'Allergen Statement' },
  { href: '#', label: 'Privacy Policy' },
];

const PAYMENT_METHODS = [
  { name: 'Visa', src: '/images/payments/visa.svg', width: 48, height: 16 },
  { name: 'Mastercard', src: '/images/payments/mastercard.webp', width: 36, height: 24 },
  { name: 'PayPal', src: '/images/payments/paypal.png', width: 64, height: 24 },
  { name: 'Apple Pay', src: '/images/payments/apple-pay.webp', width: 40, height: 24 },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 4v9.2a3.3 3.3 0 1 1-2.4-3.18V8.2A5.7 5.7 0 1 0 17 13.9V8.55A6.5 6.5 0 0 0 20 9.5V6.8A6.5 6.5 0 0 1 14.5 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-biggs-green text-biggs-yellow">
      <Reveal className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-10">
          {/* Brand */}
          <div className="max-w-[220px] shrink-0">
            <Link href="/" className="inline-flex items-center" aria-label="Biggs home">
              <Image
                src="/images/logo.webp"
                alt="Biggs"
                width={240}
                height={72}
                className="h-16 w-auto md:h-[4.5rem]"
              />
            </Link>
            <p className="nav-tracking mt-5 text-[11px] font-medium uppercase leading-relaxed text-biggs-yellow">
              NYC-inspired cookies.
              <br />
              Made in the UK.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex flex-1 flex-wrap gap-x-16 gap-y-8 md:justify-center lg:gap-x-24">
            <nav aria-label="Footer">
              <ul className="space-y-3">
                {LINK_COL_ONE.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="nav-tracking text-xs font-semibold uppercase text-biggs-yellow transition hover:text-biggs-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Footer secondary">
              <ul className="space-y-3">
                {LINK_COL_TWO.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="nav-tracking text-xs font-semibold uppercase text-biggs-yellow transition hover:text-biggs-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Social */}
          <div className="shrink-0 md:text-left">
            <p className="nav-tracking text-xs font-semibold uppercase text-biggs-yellow">
              Follow Us
            </p>
            <div className="mt-4 flex items-center gap-4">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-biggs-yellow transition hover:text-biggs-cream"
              >
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-biggs-yellow transition hover:text-biggs-cream"
              >
                <TikTokIcon className="h-6 w-6" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Email"
                className="text-biggs-yellow transition hover:text-biggs-cream"
              >
                <EmailIcon className="h-6 w-6" />
              </a>
            </div>
            <p className="mt-3 text-sm text-biggs-yellow">@biggsbakes</p>
            <p className="nav-tracking mt-6 text-[10px] font-medium uppercase text-biggs-yellow/70">
              We accept
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {PAYMENT_METHODS.map((method) => (
                <Image
                  key={method.name}
                  src={method.src}
                  alt={method.name}
                  width={method.width}
                  height={method.height}
                  className="h-6 w-auto object-contain"
                  title={method.name}
                  unoptimized={method.src.endsWith('.svg')}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="nav-tracking mt-16 text-center text-[10px] font-medium uppercase text-biggs-yellow/70">
          © {new Date().getFullYear()} Biggs Bakes. All rights reserved.
        </p>

        <a
          href="https://webfuzsion.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-biggs-yellow/70 transition hover:text-biggs-yellow"
        >
          <span>Website by</span>
          <Image
            src="/images/webfuzsion.png"
            alt="Webfuzsion"
            width={120}
            height={28}
            className="h-5 w-auto"
          />
        </a>
      </Reveal>
    </footer>
  );
}
