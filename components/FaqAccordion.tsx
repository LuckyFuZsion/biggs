'use client';

import { useState } from 'react';
import { FaqCategory } from '@/lib/types';
import Reveal from './Reveal';

export default function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {categories.map((category, catIndex) => (
        <Reveal key={category.id} delay={catIndex * 80} variant="up">
          <div id={category.id}>
            <h2 className="font-display text-2xl font-bold text-biggs-green">
              {category.title}
            </h2>
            <div className="mt-4 divide-y divide-biggs-green/10 rounded-2xl border border-biggs-green/10 bg-white/40">
              {category.items.map((item) => {
                const key = `${category.id}-${item.question}`;
                const isOpen = openKey === key;
                return (
                  <div key={key} className="overflow-hidden">
                    <button
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-biggs-green transition hover:bg-biggs-green/5"
                    >
                      {item.question}
                      <span
                        className={`ml-4 text-biggs-green/50 transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm text-biggs-green/70">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
