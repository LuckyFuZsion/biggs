import Link from 'next/link';
import Reveal from './Reveal';
import ParallaxImage from './ParallaxImage';
import { siteImage } from '@/lib/site-images';

export default async function StorySection() {
  const storySrc = await siteImage('story', '/images/our-story-stack.webp');
  return (
    <section className="bg-biggs-cream py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Reveal variant="left">
          <ParallaxImage
            src={storySrc}
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
            <h2 className="font-display text-4xl font-bold leading-tight text-biggs-green md:text-5xl">
              Go Biggs.
              <br />
              Go Chunky.
            </h2>
            <p className="mt-4 max-w-md text-biggs-green/70">
              Behind every Biggs cookie are two overly-obsessed cookie lovers. Bringing thick,
              gooey and ridiculously stuffed cookies to you.
              <br />
              Six flavours at a time.
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
