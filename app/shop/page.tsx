import Image from 'next/image';
import Link from 'next/link';
import { flavours, products } from '@/lib/data';
import ShopProductCard from '@/components/ShopProductCard';
import Reveal from '@/components/Reveal';
import ParallaxImage from '@/components/ParallaxImage';
import JsonLd from '@/components/JsonLd';
import { shopProductsSchema } from '@/lib/schema';

const FILTERS = [
  { label: 'All Cookies', href: '/shop#cookies', active: true },
  { label: 'Best Sellers', href: '/shop#cookies', active: false },
  { label: 'Mixed Boxes', href: '/shop/build-your-box', active: false },
  { label: 'Gifting', href: '/shop/build-your-box', active: false },
];

export default function ShopPage() {
  const boxOfThree = products[0];

  return (
    <div className="bg-biggs-cream">
      <JsonLd data={shopProductsSchema()} />
      <section id="cookies" className="overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:gap-12 md:py-20">
          <div>
            <h1 className="hero-enter font-display text-6xl font-bold leading-none text-biggs-green md:text-7xl lg:text-8xl">
              Shop
            </h1>
            <p className="hero-enter hero-enter-delay-1 mt-5 max-w-xs text-base font-medium leading-relaxed text-biggs-green md:text-lg">
              NYC-inspired cookies.
              <br />
              Baked fresh in Britain.
            </p>
          </div>

          <div className="hero-image-enter relative flex justify-center overflow-hidden md:justify-end">
            <ParallaxImage
              src="/images/shop-hero.webp"
              alt="Biggs cookies and branded box"
              width={1350}
              height={1050}
              priority
              intensity={36}
              wrapperClassName="w-full overflow-hidden"
              className="h-auto w-full max-w-full origin-center object-contain md:w-[150%] md:max-w-none md:origin-right"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-12 md:pb-16">
        <Reveal>
          <nav
            aria-label="Shop filters"
            className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-biggs-green/10 pb-0"
          >
            {FILTERS.map((filter) => (
              <Link
                key={filter.label}
                href={filter.href}
                className={`nav-tracking pb-3 text-[11px] font-semibold uppercase text-biggs-green transition ${
                  filter.active
                    ? 'border-b-2 border-biggs-green'
                    : 'border-b-2 border-transparent text-biggs-green/55 hover:text-biggs-green'
                }`}
              >
                {filter.label}
              </Link>
            ))}
          </nav>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {flavours.map((flavour, i) => (
            <Reveal key={flavour.id} delay={i * 70} variant="up">
              <ShopProductCard flavour={flavour} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16" delay={100}>
          <div className="flex max-h-[280px] flex-col overflow-hidden rounded-3xl bg-biggs-green md:max-h-[260px] md:flex-row md:items-stretch">
            <div className="flex flex-1 flex-col justify-center px-8 py-6 text-center md:px-10 md:py-5 md:text-left">
              <h2 className="font-display text-2xl font-bold leading-tight text-biggs-cream md:text-3xl">
                Build your own box.
              </h2>
              <p className="mt-1.5 text-sm font-medium text-biggs-cream/70">
                Choose your favourites and create the perfect box of 3 - £
                {boxOfThree.price.toFixed(2)}.
              </p>
              <Link
                href={`/shop/${boxOfThree.slug}`}
                className="btn-pop mt-4 inline-block self-center whitespace-nowrap rounded-xl bg-biggs-yellow px-8 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-biggs-green md:self-start"
              >
                Build Your Box
              </Link>
            </div>

            <div
              className="relative flex h-[200px] shrink-0 items-end justify-end self-stretch p-0 md:h-auto md:w-[50%] lg:w-[55%]"
              style={{
                background:
                  'linear-gradient(90deg, #243026 0%, #243026 18%, #e8d9c8 100%)',
              }}
            >
              <Image
                src="/images/cookies-box.webp"
                alt="Biggs cookies"
                width={1100}
                height={850}
                className="h-full w-full max-h-full scale-110 bg-transparent object-contain object-right-bottom"
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
