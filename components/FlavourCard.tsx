'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Flavour } from '@/lib/types';

type FlavourCardProps = {
  flavour: Flavour;
  /** Yellow text for dark (green) backgrounds */
  onDark?: boolean;
  /** Hide the price (e.g. home signature grid) */
  hidePrice?: boolean;
};

export default function FlavourCard({
  flavour,
  onDark = false,
  hidePrice = false,
}: FlavourCardProps) {
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hasHoverImage = Boolean(flavour.hoverImage);
  const showAlt = hasHoverImage && (hovered || revealed);

  const nameClass = onDark
    ? 'font-semibold text-biggs-yellow'
    : 'font-semibold text-biggs-green';
  const priceClass = onDark
    ? 'text-sm text-biggs-yellow/80'
    : 'text-sm text-biggs-green/60';

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!hasHoverImage) return;

    // Touch/mobile has no real hover: first tap reveals the second photo
    // instead of navigating straight away; tap again to carry on through.
    const canHover =
      typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

    if (!canHover && !revealed) {
      e.preventDefault();
      setRevealed(true);
    }
  }

  return (
    <Link
      href="/shop#build-your-box"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className="group flex h-full flex-col text-center transition-transform duration-300 ease-out hover:-translate-y-1.5"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-transparent">
        <Image
          src={flavour.image}
          alt={flavour.name}
          width={768}
          height={768}
          className={`h-full w-full bg-transparent object-contain transition-opacity duration-300 ease-out ${
            showAlt ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundColor: 'transparent' }}
        />
        {hasHoverImage && (
          <Image
            src={flavour.hoverImage as string}
            alt={`${flavour.name}, half eaten`}
            width={768}
            height={768}
            className={`absolute inset-0 h-full w-full bg-transparent object-contain transition-opacity duration-300 ease-out ${
              showAlt ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundColor: 'transparent' }}
          />
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col items-center justify-start">
        <p
          className={`text-sm leading-snug md:text-base ${nameClass} ${
            hidePrice ? '' : 'min-h-[2.75rem]'
          }`}
        >
          {flavour.name}
        </p>
        {!hidePrice && (
          <p className={`mt-1 ${priceClass}`}>£{flavour.price.toFixed(2)}</p>
        )}
      </div>
    </Link>
  );
}
