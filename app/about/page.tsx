import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { siteImage } from '@/lib/site-images';

function Founder({
  name,
  role,
  src,
  alt,
  flip,
  children,
}: {
  name: string;
  role: string;
  src: string;
  alt: string;
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <Reveal variant={flip ? 'right' : 'left'} className={flip ? 'md:order-2' : ''}>
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 90vw, 384px"
            className="object-cover object-center"
          />
        </div>
      </Reveal>
      <Reveal variant={flip ? 'left' : 'right'} delay={100} className={flip ? 'md:order-1' : ''}>
        <div className="space-y-4 text-biggs-green/80">
          <div>
            <h2 className="font-bold text-biggs-green">{name} - Co-Founder</h2>
            <p className="font-bold text-biggs-green">{role}</p>
          </div>
          {children}
        </div>
      </Reveal>
    </div>
  );
}

export default async function AboutPage() {
  const jackSrc = await siteImage('about', '/images/our-story-jack.webp');
  return (
    <div className="bg-biggs-cream">
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <h1 className="hero-enter text-center font-display text-4xl font-bold text-biggs-green md:text-5xl">
          Our Story
        </h1>
        <p className="hero-enter hero-enter-delay-1 mx-auto mt-5 max-w-2xl text-center font-semibold text-biggs-green">
          Behind every Biggs cookie are two overly-obsessed cookie lovers. Bringing thick, gooey
          and ridiculously stuffed cookies to you. Six flavours at a time.
        </p>

        <div className="mt-12 space-y-14 md:mt-16 md:space-y-20">
          <Founder
            name="Jack"
            role="Chief Cookie Connoisseur"
            src={jackSrc}
            alt="Jack and Joe behind the Biggs Bakes counter"
          >
            <p>
              The brains behind the bake. Jack has spent two years perfecting his own cookie
              recipe, determined to create the ultimate thick cookie with generous fillings that
              actually stay where they’re supposed to.
            </p>
            <p>
              After plenty of testing, and the occasional cookie collapse, he cracked the recipe
              for thick, gooey perfection.
            </p>
            <p>
              Family, friends &amp; neighbours soon became just as obsessed with the cookies as
              Jack &amp; Joe, so they wanted to finally share them with everyone else - otherwise
              it would just be selfish.
            </p>
          </Founder>

          <Founder
            name="Joe"
            role="Head Cookie Monster"
            src="/images/our-story-joe.webp"
            alt="Jack and Joe in the Biggs kitchen holding a stack of cookies and a Biggs box"
            flip
          >
            <p>
              Joe’s been on a hunt for the perfect cookie that doesn’t disappear in a single bite,
              fall off like dusty shortbread…and is ACTUALLY stuffed.
            </p>
            <p>
              After discovering cookies in New York that forced him to have a lie-down in Central
              Park, he still hadn’t found that perfect bite. He couldn’t understand why the UK was
              missing out on proper chunky treats.
            </p>
            <p>So together, with Jack, they created Biggs at home, saving them both another flight.</p>
          </Founder>
        </div>
      </div>
    </div>
  );
}
