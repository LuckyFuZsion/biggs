import { getFlavours } from '@/lib/flavours';
import FlavourCard from './FlavourCard';
import Reveal from './Reveal';

export default async function FlavourGrid() {
  const flavours = await getFlavours();
  return (
    <section id="cookies" className="bg-biggs-green py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="nav-tracking mb-2 text-center text-xs font-semibold uppercase text-biggs-yellow">
            Our Signature Cookies
          </p>
          <h2 className="text-center font-display text-3xl font-bold text-biggs-cream md:text-4xl">
            Iconic flavours. Unforgettable bites.
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-wrap justify-center gap-x-5 gap-y-10 lg:gap-x-6">
          {flavours.filter((f) => f.inShop !== false).map((flavour, i) => (
            <Reveal
              key={flavour.id}
              delay={i * 80}
              variant="scale"
              className="w-[calc(50%-0.625rem)] sm:w-[calc(33.333%-0.834rem)] lg:w-[calc(16.666%-1.25rem)]"
            >
              <FlavourCard flavour={flavour} onDark hidePrice />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
