import { flavours } from '@/lib/data';
import Reveal from '@/components/Reveal';

export default function AllergensPage() {
  return (
    <div className="bg-biggs-cream">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <p className="hero-enter nav-tracking text-xs font-semibold uppercase text-biggs-green/60">
          Important Information
        </p>
        <h1 className="hero-enter hero-enter-delay-1 mt-2 font-display text-4xl font-bold text-biggs-green">
          Allergens & Ingredients
        </h1>

        <Reveal className="mt-8" variant="up">
          <div className="rounded-2xl border border-biggs-green/15 bg-white/50 p-6">
            <h2 className="font-semibold text-biggs-green">Allergen Statement</h2>
            <p className="mt-2 text-biggs-green/80">
              All Biggs cookies are handmade in a home-kitchen-style environment that handles
              nuts, dairy, soya, gluten and eggs. While we take great care with cleaning and
              preparation, we cannot guarantee any product is completely free from traces of
              these allergens due to the shared nature of our baking space. If you have a severe
              allergy, please contact us before ordering.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-10" delay={80}>
          <h2 className="font-display text-2xl font-bold text-biggs-green">
            Ingredients By Flavour
          </h2>
        </Reveal>

        <div className="mt-5 space-y-4">
          {flavours.map((flavour, i) => (
            <Reveal key={flavour.id} delay={i * 60} variant="up">
              <div className="card-lift flex flex-col justify-between gap-2 rounded-xl bg-white/40 p-4 sm:flex-row sm:items-center">
                <p className="font-semibold text-biggs-green">{flavour.name}</p>
                <p className="text-sm text-biggs-green/70">
                  Contains: {flavour.allergens.join(', ')}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
