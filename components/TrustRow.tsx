'use client';

import Reveal from './Reveal';

const ITEMS = [
  {
    title: 'NYC Inspired',
    description: 'Inspired by the iconic bakeries of New York City.',
    icon: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* NYC skyline */}
        <path d="M3 21h18" />
        <rect x="4.5" y="14" width="4" height="7" />
        <rect x="9.5" y="6" width="5" height="15" />
        <path d="M12 6V4" />
        <rect x="15.5" y="11" width="4" height="10" />
        <circle cx="6.5" cy="17" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="11.2" cy="10" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="14.5" r="0.6" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    title: 'Premium Ingredients',
    description: 'We use real butter, premium chocolate & simple ingredients.',
    icon: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Wheat stalk */}
        <path d="M12 20V5.5" />
        <path
          d="M12 8.5c-1-1.3-2.2-1.6-3.2-1.4.2 1 .9 2.1 1.9 2.7 1 .6 1.9.5 1.9.5z"
          fill="currentColor"
          stroke="none"
        />
        <path
          d="M12 8.5c1-1.3 2.2-1.6 3.2-1.4-.2 1-.9 2.1-1.9 2.7-1 .6-1.9.5-1.9.5z"
          fill="currentColor"
          stroke="none"
        />
        <path
          d="M12 12.5c-1-1.3-2.2-1.6-3.2-1.4.2 1 .9 2.1 1.9 2.7 1 .6 1.9.5 1.9.5z"
          fill="currentColor"
          stroke="none"
        />
        <path
          d="M12 12.5c1-1.3 2.2-1.6 3.2-1.4-.2 1-.9 2.1-1.9 2.7-1 .6-1.9.5-1.9.5z"
          fill="currentColor"
          stroke="none"
        />
        <circle cx="12" cy="5.5" r="1.1" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    title: 'UK Wide Delivery',
    description: 'Delivered fresh to your door across the UK.',
    icon: (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Delivery van */}
        <path d="M3 16V8h9v8" />
        <path d="M12 11h3.5l3 3v2h-6.5" />
        <circle cx="7" cy="17.3" r="1.5" />
        <circle cx="16.5" cy="17.3" r="1.5" />
        <path d="M2 16h1M18.5 16H20" />
      </g>
    ),
  },
];

function TrustItem({
  item,
  delay,
}: {
  item: (typeof ITEMS)[number];
  delay: number;
}) {
  return (
    <Reveal delay={delay} variant="up">
      <div className="flex flex-col items-center px-4 text-center md:px-8">
        <svg
          viewBox="0 0 24 24"
          className="icon-draw h-9 w-9 text-biggs-green"
          aria-hidden="true"
        >
          {item.icon}
        </svg>
        <p className="nav-tracking mt-4 text-xs font-bold uppercase text-biggs-green">
          {item.title}
        </p>
        <p className="mt-2 max-w-[220px] text-sm text-biggs-green/60">{item.description}</p>
      </div>
    </Reveal>
  );
}

export default function TrustRow() {
  return (
    <section className="bg-biggs-cream py-14 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-biggs-green/15">
        {ITEMS.map((item, i) => (
          <TrustItem key={item.title} item={item} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}
