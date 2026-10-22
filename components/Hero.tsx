import Image from 'next/image';
import Link from 'next/link';
import { siteImage } from '@/lib/site-images';

export default async function Hero() {
  const heroSrc = await siteImage('hero', '/images/hero-section.webp');
  return (
    <section className="relative overflow-hidden bg-biggs-cream">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-8 md:grid-cols-2 md:gap-10 md:py-10 lg:py-12">
        <div>
          <p className="hero-enter nav-tracking mb-4 text-xs font-semibold uppercase text-biggs-green md:text-sm">
            We thought your cookies could do with an upgrade...
          </p>
          <h1 className="hero-enter hero-enter-delay-1 font-display text-5xl font-bold leading-[0.95] tracking-tight text-biggs-green sm:text-6xl md:text-6xl lg:text-7xl">
            Thick.
            <br />
            Chunky.
            <br />
            Unapologetic.
          </h1>
          <p className="hero-enter hero-enter-delay-2 mt-6 max-w-md text-base leading-relaxed text-biggs-green/75 md:text-lg">
            Premium cookies baked for maximum indulgence.
            <br />
            Zero regrets.
          </p>
          <Link
            href="/shop#build-your-box"
            className="btn-pop btn-glow hero-enter hero-enter-delay-3 mt-8 inline-block rounded-full bg-biggs-yellow px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-biggs-green"
          >
            Order Now
          </Link>
        </div>

        <div className="hero-image-enter flex justify-center">
          <Image
            src={heroSrc}
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
