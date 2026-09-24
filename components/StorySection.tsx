import Link from 'next/link';
import Reveal from './Reveal';
import ParallaxImage from './ParallaxImage';

export default function StorySection() {
  return (
    <section className="bg-biggs-cream py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Reveal variant="left">
          <ParallaxImage
            src="/images/our-story.webp"
            alt="The story behind Biggs Bakes"
            width={1024}
            height={768}
            intensity={32}
            wrapperClassName="rounded-3xl"
            className="h-auto w-full rounded-3xl object-cover"
          />
        </Reveal>
        <Reveal variant="right" delay={120}>
          <div>
            <p className="nav-tracking mb-3 text-xs font-semibold uppercase text-biggs-green/60">
              Born In Britain. Inspired By New York.
            </p>
            <h2 className="font-display text-3xl font-bold text-biggs-green md:text-4xl">
              A simple obsession.
            </h2>
            <p className="mt-4 max-w-md text-biggs-green/70">
              Biggs began with a shared obsession: the thick, indulgent cookies you’d queue for
              in Manhattan, made with incredible British ingredients right here at home.
            </p>
            <Link
              href="/about"
              className="mt-5 inline-block font-semibold text-biggs-green underline underline-offset-4 transition hover:text-biggs-yellow"
            >
              Our Story →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
