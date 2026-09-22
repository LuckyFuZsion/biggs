'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { flavours, products } from '@/lib/data';
import { useCart } from '@/components/CartProvider';

const DROPDOWN_LABELS = ['Cookie 1', 'Cookie 2', 'Cookie 3'];

export default function BuildYourBoxPage() {
  const product = products[0];
  const { addItem, openCart } = useCart();

  const [selections, setSelections] = useState<string[]>(['', '', '']);
  const [justAdded, setJustAdded] = useState(false);

  const allSelected = useMemo(() => selections.every((s) => s !== ''), [selections]);

  function handleChange(index: number, value: string) {
    setSelections((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setJustAdded(false);
  }

  function handleAddToCart() {
    if (!allSelected) return;

    const [f1, f2, f3] = selections.map(
      (id) => flavours.find((f) => f.id === id)?.name ?? ''
    );

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      properties: { flavour1: f1, flavour2: f2, flavour3: f3 },
    });

    setJustAdded(true);
    openCart();
  }

  return (
    <div className="bg-biggs-cream">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="overflow-hidden rounded-3xl bg-biggs-green md:grid md:grid-cols-2 md:items-center">
          {/* Form */}
          <div className="flex flex-col justify-center px-6 py-8 sm:px-8 md:px-10 md:py-10">
            <Link
              href="/shop"
              className="text-sm text-biggs-cream/60 transition hover:text-biggs-cream"
            >
              ← Back to Shop
            </Link>

            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-biggs-cream md:text-4xl">
              {product.title}
            </h1>
            <p className="mt-2 text-xl font-semibold text-biggs-yellow">
              £{product.price.toFixed(2)}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-biggs-cream/75">
              {product.description}
            </p>

            <div className="mt-6">
              <p className="nav-tracking text-xs font-semibold uppercase text-biggs-yellow/80">
                Choose Your Flavours
              </p>

              <div className="mt-3 space-y-3">
                {DROPDOWN_LABELS.map((label, index) => (
                  <div key={label}>
                    <label
                      htmlFor={`flavour-${index}`}
                      className="mb-1 block text-sm font-semibold text-biggs-cream"
                    >
                      {label}
                    </label>
                    <select
                      id={`flavour-${index}`}
                      value={selections[index]}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 text-biggs-green transition focus:outline-none focus:ring-2 focus:ring-biggs-yellow ${
                        selections[index]
                          ? 'border-biggs-yellow'
                          : 'border-transparent'
                      }`}
                    >
                      <option value="">Select a flavour…</option>
                      {flavours.map((flavour) => (
                        <option key={flavour.id} value={flavour.id}>
                          {flavour.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!allSelected}
              className="btn-pop mt-6 w-full rounded-full bg-biggs-yellow px-8 py-3 font-semibold text-biggs-green disabled:cursor-not-allowed disabled:bg-biggs-cream/20 disabled:text-biggs-cream/40"
            >
              {allSelected ? 'Add To Cart' : 'Choose all 3 flavours to continue'}
            </button>

            {justAdded && (
              <p className="mt-2 text-sm font-semibold text-biggs-yellow">
                Added to your box!
              </p>
            )}

            <p className="mt-5 text-xs leading-relaxed text-biggs-cream/50">
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

          {/* Image */}
          <div
            className="relative flex min-h-[240px] items-center justify-center px-4 py-8 md:min-h-full md:px-6 md:py-10"
            style={{
              background:
                'linear-gradient(90deg, #243026 0%, #3a4a3c 35%, #e8d9c8 100%)',
            }}
          >
            <Image
              src="/images/cookies-box.webp"
              alt={product.title}
              width={900}
              height={700}
              className="h-auto w-full max-w-md bg-transparent object-contain"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
