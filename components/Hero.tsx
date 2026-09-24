import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-biggs-cream">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-8 md:grid-cols-2 md:gap-10 md:py-10 lg:py-12">
        <div>
          <p className="hero-enter nav-tracking mb-4 text-xs font-semibold uppercase text-biggs-green md:text-sm">
            NYC-Inspired Cookies.
          </p>
          <h1 className="hero-enter hero-enter-delay-1 font-display text-5xl font-bold leading-[0.95] tracking-tight text-biggs-green sm:text-6xl md:text-6xl lg:text-7xl">
            Baked in Britain.
            <br />
            Big flavour.
          </h1>
          <p className="hero-enter hero-enter-delay-2 mt-6 max-w-md text-base leading-relaxed text-biggs-green/75 md:text-lg">
            Thick, gooey and packed with premium ingredients. Inspired by the best New York
            bakeries, baked fresh right here in the UK.
          </p>
          <Link
            href="/shop#build-your-box"
            className="btn-pop btn-glow hero-enter hero-enter-delay-3 mt-8 inline-block rounded-full bg-biggs-yellow px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-biggs-green"
          >
            Pre-Order Now
          </Link>
        </div>

        <div className="hero-image-enter flex justify-center">
          <Image
            src="/images/hero-section.webp"
            alt="Stack of Biggs signature cookies"
            width={1024}
            height={1024}
            priority
            className="h-auto w-full max-h-[42vh] object-contain md:max-h-[380px]"
          />
        </div>
      </div>
    </section>
  );
}
