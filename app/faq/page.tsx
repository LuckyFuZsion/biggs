'use client';

import { useState } from 'react';
import { faqCategories, siteConfig } from '@/lib/data';
import FaqAccordion from '@/components/FaqAccordion';
import Reveal from '@/components/Reveal';

export default function FaqPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mock submission - wire up to a real contact endpoint later.
    setSent(true);
  }

  return (
    <div className="bg-biggs-cream">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <p className="hero-enter nav-tracking text-xs font-semibold uppercase text-biggs-green/60">
          Need A Hand?
        </p>
        <h1 className="hero-enter hero-enter-delay-1 mt-2 font-display text-4xl font-bold text-biggs-green">
          FAQ & Contact Us
        </h1>

        <Reveal className="mt-10" variant="up">
          <FaqAccordion categories={faqCategories} />
        </Reveal>

        <Reveal className="mt-14" delay={120} variant="up">
          <div
            id="contact-form"
            className="rounded-2xl border border-biggs-green/15 bg-white/50 p-6"
          >
            <h2 className="font-display text-2xl font-bold text-biggs-green">Get In Touch</h2>
            <p className="mt-1 text-sm text-biggs-green/70">
              Or email us directly at{' '}
              <a href={`mailto:${siteConfig.email}`} className="underline">
                {siteConfig.email}
              </a>
            </p>

            {sent ? (
              <p className="mt-6 font-semibold text-biggs-green">
                Thanks for reaching out - we’ll be in touch soon!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-biggs-green/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-biggs-yellow"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-biggs-green/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-biggs-yellow"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-biggs-green/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-biggs-yellow"
                />
                <button
                  type="submit"
                  className="btn-pop rounded-full bg-biggs-yellow px-8 py-3 font-semibold text-biggs-green"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
