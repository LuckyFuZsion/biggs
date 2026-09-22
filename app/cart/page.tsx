'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import Reveal from '@/components/Reveal';

const PAYMENT_ICONS = ['Visa', 'Mastercard', 'PayPal', 'Apple Pay'];

function formatPrice(value: number) {
  return `£${value.toFixed(2)}`;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [agreed, setAgreed] = useState(false);

  if (items.length === 0) {
    return (
      <div className="bg-biggs-cream">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="hero-enter font-display text-3xl font-bold text-biggs-green">
            Your cart is empty
          </h1>
          <Link
            href="/shop/build-your-box"
            className="btn-pop hero-enter hero-enter-delay-1 mt-6 inline-block rounded-full bg-biggs-yellow px-8 py-3 font-semibold text-biggs-green"
          >
            Build Your Box
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-biggs-cream">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="hero-enter font-display text-4xl font-bold text-biggs-green">Your Cart</h1>

        <div className="mt-8 divide-y divide-biggs-green/10 rounded-2xl border border-biggs-green/10 bg-white/40">
          {items.map((line, i) => (
            <Reveal key={line.id} delay={i * 60} variant="up">
              <div className="flex flex-col gap-4 p-5 sm:flex-row">
                <Image
                  src={line.image}
                  alt={line.title}
                  width={96}
                  height={96}
                  className="h-24 w-24 flex-shrink-0 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-biggs-green">{line.title}</p>
                    <button
                      onClick={() => removeItem(line.id)}
                      className="text-xs text-biggs-green/50 transition hover:text-biggs-green"
                    >
                      Remove
                    </button>
                  </div>
                  {line.properties && (
                    <p className="mt-1 text-sm text-biggs-green/60">
                      {[
                        line.properties.flavour1,
                        line.properties.flavour2,
                        line.properties.flavour3,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        className="btn-pop h-7 w-7 rounded border border-biggs-green/20 text-biggs-green"
                      >
                        −
                      </button>
                      <span className="w-4 text-center">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        className="btn-pop h-7 w-7 rounded border border-biggs-green/20 text-biggs-green"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-biggs-green">
                      {formatPrice(line.price * line.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8" delay={100}>
          <div className="flex items-center justify-between text-lg font-semibold text-biggs-green">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </Reveal>

        <Reveal className="mt-6" delay={150}>
          <label className="flex items-start gap-3 text-sm text-biggs-green/80">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-biggs-green/30 text-biggs-yellow focus:ring-biggs-yellow"
            />
            <span>
              I have read the Allergen and Home Kitchen warning and understand these cookies are
              baked in an environment handling nuts, dairy, soya, gluten and eggs.{' '}
              <Link
                href="/allergens"
                className="underline underline-offset-2 hover:text-biggs-green"
              >
                See more
              </Link>
              .
            </span>
          </label>
        </Reveal>

        <Reveal className="mt-6" delay={200}>
          <button
            disabled={!agreed}
            className="btn-pop w-full rounded-full bg-biggs-yellow px-8 py-4 font-semibold text-biggs-green disabled:cursor-not-allowed disabled:bg-biggs-green/15 disabled:text-biggs-green/40"
          >
            {agreed ? 'Checkout' : 'Tick the box above to continue'}
          </button>

          <div className="mt-6 flex justify-center gap-4 text-xs font-semibold uppercase tracking-wide text-biggs-green/50">
            {PAYMENT_ICONS.map((icon) => (
              <span key={icon}>{icon}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
