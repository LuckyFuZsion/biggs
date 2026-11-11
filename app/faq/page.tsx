'use client';

import { faqCategories } from '@/lib/data';
import FaqAccordion from '@/components/FaqAccordion';
import Reveal from '@/components/Reveal';
import ContactForm from '@/components/ContactForm';

export default function FaqPage() {
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
            className="rounded-2xl bg-biggs-green p-6 md:p-8"
          >
            <h2 className="font-display text-2xl font-bold text-biggs-cream">Get In Touch</h2>

            <ContactForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
