import { getFlavours } from '@/lib/flavours';
import Reveal from '@/components/Reveal';
import { ALLERGEN_INFO, allergenKey } from '@/lib/allergen-info';

/** Bolds every ALL-CAPS word (the allergens) in an ingredient list. */
function boldAllergens(text: string) {
  return text.split(/(\b[A-Z]{3,}\b)/).map((part, i) =>
    /^[A-Z]{3,}$/.test(part) ? (
      <strong key={i} className="font-bold text-biggs-green">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default async function AllergensPage() {
  const flavours = (await getFlavours()).filter((f) => f.inShop !== false);
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
            <h2 className="font-semibold text-biggs-green">Allergen Information</h2>
            <p className="mt-2 text-biggs-green/80">
              All our cookies are homemade in our home kitchen, where allergens including{' '}
              <strong className="font-bold text-biggs-green">WHEAT</strong> (gluten),{' '}
              <strong className="font-bold text-biggs-green">MILK</strong>,{' '}
              <strong className="font-bold text-biggs-green">EGG</strong>,{' '}
              <strong className="font-bold text-biggs-green">SOYA</strong>,{' '}
              <strong className="font-bold text-biggs-green">PEANUTS</strong> and{' '}
              <strong className="font-bold text-biggs-green">TREE NUTS</strong> are handled
              regularly. Although we take care to minimise the risk of cross-contamination, we
              cannot guarantee that our cookies are completely free from traces of these and
              other allergens. Please check the individual allergen information for each cookie
              before ordering.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-10" delay={80}>
          <h2 className="font-display text-2xl font-bold text-biggs-green">
            Ingredients By Flavour
          </h2>
        </Reveal>

        <div className="mt-5 space-y-4">
          {flavours.map((flavour, i) => {
            const info = ALLERGEN_INFO[allergenKey(flavour.name)];
            return (
              <Reveal key={flavour.id} delay={i * 60} variant="up">
                <div className="rounded-xl bg-white/40 p-5">
                  <h3 className="font-display text-xl font-bold text-biggs-green">{flavour.name}</h3>
                  {info ? (
                    <div className="mt-2 space-y-2 text-sm leading-relaxed text-biggs-green/80">
                      <p>
                        <span className="font-bold text-biggs-green">Contains:</span>{' '}
                        <strong className="font-bold text-biggs-green">{info.contains.toUpperCase()}</strong>
                      </p>
                      <p>
                        <span className="font-bold text-biggs-green">May contain:</span>{' '}
                        <strong className="font-bold text-biggs-green">
                          {info.mayContain.toUpperCase()}
                        </strong>
                      </p>
                      <p>
                        <span className="font-bold text-biggs-green">Ingredients:</span>{' '}
                        {boldAllergens(info.ingredients)}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-biggs-green/70">
                      Please ask us for full allergen details.
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
