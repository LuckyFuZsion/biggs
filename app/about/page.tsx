import Image from 'next/image';
import Reveal from '@/components/Reveal';

export default function AboutPage() {
  return (
    <div className="bg-biggs-cream">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <p className="hero-enter nav-tracking text-xs font-semibold uppercase text-biggs-green/60">
          Our Story
        </p>
        <h1 className="hero-enter hero-enter-delay-1 mt-2 font-display text-4xl font-bold text-biggs-green md:text-5xl">
          Born in Britain. Inspired by New York.
        </h1>

        <Reveal className="mt-8" variant="scale">
          <Image
            src="/images/about-our-story.webp"
            alt="Jack and Joe at their first Biggs pop-up shop"
            width={1280}
            height={640}
            className="h-auto w-full rounded-3xl object-cover"
            priority
          />
        </Reveal>

        <div className="mt-10 space-y-6 text-biggs-green/80">
          <Reveal delay={0}>
            <p>
              Biggs began with a simple obsession: the thick, indulgent cookies you’d queue for
              in Manhattan - the kind with a crisp edge, a gooey centre, and no shortage of
              chocolate. We wanted to bring that feeling home, made properly, with real British
              ingredients.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p>
              <span className="font-semibold text-biggs-green">Jack</span> spent years honing his
              baking craft, chasing the perfect thick-cookie texture through countless test
              batches. <span className="font-semibold text-biggs-green">Joe</span> brought the
              other essential skill - a lifelong talent for eating them, and an unrelenting
              standard for what &quot;good&quot; actually tastes like.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p>
              Together they started Biggs from a single pop-up stall, selling out within hours.
              What started as a weekend obsession quickly became a full-time one - and now
              we’re bringing the same six signature flavours straight to your door, baked fresh
              to order.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
