'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Flavour } from '@/lib/types';

export default function ShopProductCard({ flavour }: { flavour: Flavour }) {
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasHoverImage = Boolean(flavour.hoverImage);
  const showAlt = hasHoverImage && (hovered || revealed);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!hasHoverImage) return;

    // Devices with no real hover (touch/mobile): first tap reveals the
    // second photo instead of navigating straight away; tap again to
    // continue through to Build Your Box.
    const canHover =
      typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

    if (!canHover && !revealed) {
      e.preventDefault();
      setRevealed(true);
    }
  }

  return (
    <Link
      href="#build-your-box"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className="card-lift group flex h-full flex-col rounded-2xl bg-[#e8d9c8]/70 p-5 md:p-6"
    >
      <div className="relative mx-auto aspect-square w-[72%] max-w-[220px] shrink-0 overflow-hidden bg-transparent">
        <Image
          src={flavour.image}
          alt={flavour.name}
          width={440}
          height={440}
          className={`h-full w-full bg-transparent object-contain transition-opacity duration-300 ease-out ${
            showAlt ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundColor: 'transparent' }}
        />
        {hasHoverImage && (
          <Image
            src={flavour.hoverImage as string}
            alt={`${flavour.name}, half eaten`}
            width={440}
            height={440}
            className={`absolute inset-0 h-full w-full bg-transparent object-contain transition-opacity duration-300 ease-out ${
              showAlt ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundColor: 'transparent' }}
          />
        )}
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col text-left">
        <h2 className="min-h-[3.5rem] font-display text-xl font-bold leading-tight text-biggs-green md:min-h-[4rem] md:text-2xl">
          {flavour.name}
        </h2>
        <p className="mt-2 min-h-[4.5rem] text-sm font-medium leading-relaxed text-biggs-green/65">
          {flavour.description}
        </p>
      </div>
    </Link>
  );
}
