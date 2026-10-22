'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { products } from '@/lib/data';
import { Flavour } from '@/lib/types';
import { useCart } from '@/components/CartProvider';
import { useSiteImage } from '@/components/SiteImagesProvider';
import { fetchSoldOutHandles, isShopifyConfigured } from '@/lib/shopify';

const BOX_SIZE = 3;

export default function BuildYourBoxSection({ flavours }: { flavours: Flavour[] }) {
  const product = products[0];
  const { addItem, openCart } = useCart();
  const boxSrc = useSiteImage('box', product.image);

  // Ordered flavour ids, one per filled slot (duplicates allowed, like the old dropdowns).
  const [picked, setPicked] = useState<string[]>([]);
  const [justAdded, setJustAdded] = useState(false);
  const [soldOut, setSoldOut] = useState<Record<string, boolean> | null>(null);

  // Ask Shopify which flavours are out of stock. If this fails we simply show everything.
  useEffect(() => {
    if (!isShopifyConfigured()) return;
    fetchSoldOutHandles().then(setSoldOut).catch(() => {});
  }, []);

  const isSoldOut = (f: Flavour) =>
    soldOut && f.shopifyHandle ? Boolean(soldOut[f.shopifyHandle]) : Boolean(f.soldOut);
  const boxFlavours = flavours.filter((f) => f.inBox !== false);
  const byId = (id: string) => flavours.find((f) => f.id === id);

  const full = picked.length === BOX_SIZE;
  const remaining = BOX_SIZE - picked.length;

  function addFlavour(id: string) {
    if (full) return;
    setPicked((prev) => [...prev, id]);
    setJustAdded(false);
  }

  function removeAt(index: number) {
    setPicked((prev) => prev.filter((_, i) => i !== index));
    setJustAdded(false);
  }

  function removeLastOf(id: string) {
    setPicked((prev) => {
      const i = prev.lastIndexOf(id);
      return i === -1 ? prev : prev.filter((_, idx) => idx !== i);
    });
    setJustAdded(false);
  }

  function surpriseMe() {
    const pool = boxFlavours.filter((f) => !isSoldOut(f));
    if (pool.length === 0) return;
    setPicked((prev) => {
      const next = [...prev];
      // Prefer flavours not already in the box so the surprise is a varied one.
      while (next.length < BOX_SIZE) {
        const fresh = pool.filter((f) => !next.includes(f.id));
        const source = fresh.length > 0 ? fresh : pool;
        next.push(source[Math.floor(Math.random() * source.length)].id);
      }
      return next;
    });
    setJustAdded(false);
  }

  function handleAddToCart() {
    if (!full) return;
    const [f1, f2, f3] = picked.map((id) => byId(id)?.name ?? '');

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: boxSrc,
      properties: { flavour1: f1, flavour2: f2, flavour3: f3 },
    });

    setJustAdded(true);
    openCart();
  }

  return (
    <section id="build-your-box" className="scroll-mt-24 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-3xl bg-biggs-green px-6 py-8 sm:px-8 md:px-10 md:py-10">
          <div className="max-w-2xl">
            <p className="nav-tracking text-xs font-semibold uppercase text-biggs-yellow/80">
              Build Your Box
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-biggs-cream md:text-4xl">
              Biggs Things Come in Threes
            </h2>
            <p className="mt-2 text-xl font-semibold text-biggs-yellow">
              £{product.price.toFixed(2)}
              <span className="ml-2 text-xs font-semibold text-biggs-yellow/80">
                (inc free delivery across the UK)
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-biggs-cream/75">
              {product.description}
            </p>
            <p className="nav-tracking mt-3 text-xs font-bold uppercase text-biggs-yellow">
              Go big. Go chunky.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-10">
            {/* Box preview: first on mobile so progress stays in view, right-hand column on desktop */}
            <div className="lg:sticky lg:top-28 lg:order-2">
              <div className="rounded-2xl bg-[#e8d9c8] p-4 shadow-[inset_0_2px_10px_rgba(36,48,38,0.15)] sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="nav-tracking text-xs font-bold uppercase text-biggs-green">
                    Your box
                  </p>
                  <p className="text-xs font-semibold text-biggs-green/70" aria-live="polite">
                    {full ? 'Box full' : `${picked.length} of ${BOX_SIZE} chosen`}
                  </p>
                </div>

                <ol className="grid grid-cols-3 gap-3">
                  {Array.from({ length: BOX_SIZE }, (_, i) => {
                    const flavour = picked[i] ? byId(picked[i]) : undefined;
                    return (
                      <li key={i}>
                        {flavour ? (
                          <button
                            type="button"
                            onClick={() => removeAt(i)}
                            aria-label={`Remove ${flavour.name} from slot ${i + 1}`}
                            className="group relative block w-full text-center"
                          >
                            <span className="relative block aspect-square overflow-hidden rounded-full bg-biggs-cream ring-2 ring-biggs-yellow">
                              <Image
                                key={`${flavour.id}-${i}`}
                                src={flavour.image}
                                alt=""
                                width={200}
                                height={200}
                                className="slot-pop h-full w-full object-contain p-1"
                              />
                              <span className="absolute inset-0 flex items-center justify-center bg-biggs-green/60 text-lg font-bold text-biggs-cream opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                                ✕
                              </span>
                            </span>
                            <span className="mt-1.5 block text-[11px] font-bold leading-tight text-biggs-green">
                              {flavour.name}
                            </span>
                          </button>
                        ) : (
                          <div className="text-center">
                            <div className="flex aspect-square items-center justify-center rounded-full border-2 border-dashed border-biggs-green/30 bg-biggs-cream/50 font-display text-2xl font-bold text-biggs-green/30">
                              {i + 1}
                            </div>
                            <span className="mt-1.5 block text-[11px] font-semibold leading-tight text-biggs-green/40">
                              Empty
                            </span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={surpriseMe}
                  disabled={full}
                  className="btn-pop flex-1 rounded-full border border-biggs-yellow/60 px-4 py-3 text-sm font-semibold text-biggs-yellow transition hover:border-biggs-yellow hover:text-biggs-cream disabled:cursor-not-allowed disabled:opacity-40"
                >
                  🎲 Surprise me
                </button>
                {picked.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setPicked([]);
                      setJustAdded(false);
                    }}
                    className="btn-pop rounded-full px-4 py-3 text-sm font-semibold text-biggs-cream/60 underline underline-offset-4 hover:text-biggs-cream"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!full}
                className="btn-pop mt-3 w-full rounded-full bg-biggs-yellow px-8 py-3.5 font-semibold text-biggs-green disabled:cursor-not-allowed disabled:bg-biggs-cream/20 disabled:text-biggs-cream/40"
              >
                {full
                  ? `Add To Cart - £${product.price.toFixed(2)}`
                  : `Pick ${remaining} more ${remaining === 1 ? 'cookie' : 'cookies'} to continue`}
              </button>

              {justAdded && (
                <p className="mt-2 text-sm font-semibold text-biggs-yellow">Added to your box!</p>
              )}

              <p className="mt-4 text-xs leading-relaxed text-biggs-cream/50">
                Baked in an environment handling nuts, dairy, soya, gluten and eggs.{' '}
                <Link
                  href="/allergens"
                  className="underline underline-offset-2 transition hover:text-biggs-cream"
                >
                  See allergen info
                </Link>
                .
              </p>
            </div>

            {/* Flavour tiles */}
            <div className="lg:order-1">
              <p className="nav-tracking text-xs font-semibold uppercase text-biggs-yellow/80">
                Tap to add - pick any {BOX_SIZE}, doubles welcome
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {boxFlavours.map((flavour) => {
                  const count = picked.filter((id) => id === flavour.id).length;
                  const out = isSoldOut(flavour);
                  return (
                    <li key={flavour.id} className="relative">
                      <button
                        type="button"
                        onClick={() => addFlavour(flavour.id)}
                        disabled={out || full}
                        aria-label={
                          out
                            ? `${flavour.name} (sold out)`
                            : `Add ${flavour.name} to your box${count ? `, ${count} chosen` : ''}`
                        }
                        className={`card-lift flex h-full w-full flex-col items-center rounded-2xl p-3 text-center transition disabled:cursor-not-allowed ${
                          count > 0
                            ? 'bg-biggs-cream ring-2 ring-biggs-yellow'
                            : 'bg-biggs-cream/90 hover:bg-biggs-cream'
                        } ${out ? 'opacity-50' : full && count === 0 ? 'opacity-60' : ''}`}
                      >
                        <Image
                          src={flavour.image}
                          alt=""
                          width={240}
                          height={240}
                          className="aspect-square w-full max-w-[140px] object-contain"
                        />
                        <span className="mt-2 text-sm font-bold leading-snug text-biggs-green">
                          {flavour.name}
                        </span>
                        {out && (
                          <span className="mt-1 text-xs font-semibold text-biggs-green/60">
                            Sold out
                          </span>
                        )}
                      </button>

                      {count > 0 && (
                        <>
                          <span className="pointer-events-none absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-biggs-yellow text-xs font-bold text-biggs-green shadow">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeLastOf(flavour.id)}
                            aria-label={`Remove one ${flavour.name}`}
                            className="btn-pop absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-biggs-green text-sm font-bold text-biggs-cream shadow"
                          >
                            -
                          </button>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
