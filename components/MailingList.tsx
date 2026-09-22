'use client';

import Image from 'next/image';
import { useState } from 'react';
import Reveal from './Reveal';

export default function MailingList() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Mock submission - wire up to Shopify's customer/marketing consent API later.
    setSubmitted(true);
  }

  return (
    <section className="bg-biggs-cream pb-16 md:pb-20">
      <Reveal className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-[2rem] bg-biggs-green md:grid md:grid-cols-2 md:items-stretch">
          <div className="relative min-h-[220px] md:min-h-[280px]">
            <Image
              src="/images/chocolate-chip.webp"
              alt="Gooey Biggs chocolate chip cookie"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center px-8 py-10 md:px-12 md:py-14">
            <h2 className="font-display text-3xl font-bold leading-tight text-biggs-cream md:text-4xl">
              Be the first to get Biggs cookies.
            </h2>
            <p className="mt-3 max-w-sm text-sm text-biggs-cream/70 md:text-base">
              Sign up to get early access to new drops/flavours.
            </p>

            {submitted ? (
              <p className="mt-8 font-semibold text-biggs-yellow">
                Thanks - you’re on the list!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="relative mt-8 max-w-md">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-full border-0 bg-biggs-cream py-4 pl-5 pr-14 text-biggs-green placeholder:text-biggs-green/40 focus:outline-none focus:ring-2 focus:ring-biggs-yellow"
                />
                <button
                  type="submit"
                  aria-label="Sign up"
                  className="btn-pop absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-biggs-yellow text-lg font-bold text-biggs-green"
                >
                  →
                </button>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
