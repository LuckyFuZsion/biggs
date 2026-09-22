import { flavours } from '@/lib/data';
import FlavourCard from './FlavourCard';
import Reveal from './Reveal';

export default function FlavourGrid() {
  return (
    <section id="cookies" className="bg-biggs-green py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="nav-tracking mb-2 text-center text-xs font-semibold uppercase text-biggs-yellow">
            Six Signature Cookies
          </p>
          <h2 className="text-center font-display text-3xl font-bold text-biggs-cream md:text-4xl">
            Iconic flavours. Unforgettable bites.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
          {flavours.map((flavour, i) => (
            <Reveal key={flavour.id} delay={i * 80} variant="scale">
              <FlavourCard flavour={flavour} onDark hidePrice />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
