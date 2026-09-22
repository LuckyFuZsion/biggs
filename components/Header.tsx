'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop', match: '/shop' },
  { href: '/about', label: 'Our Story', match: '/about' },
  { href: '/shop#cookies', label: 'Our Cookies', match: null },
  { href: '/faq#ordering-delivery', label: 'Delivery', match: null },
  { href: '/faq', label: 'FAQ', match: '/faq' },
];

export default function Header() {
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [badgeKey, setBadgeKey] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setElevated(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (itemCount > 0) setBadgeKey((k) => k + 1);
  }, [itemCount]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 bg-biggs-green/95 text-biggs-cream transition-shadow duration-300 ${
        elevated ? 'header-elevated' : ''
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="inline-flex items-center" aria-label="Biggs home">
          <Image
            src="/images/logo.webp"
            alt="Biggs"
            width={220}
            height={66}
            priority
            className="h-12 w-auto md:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = link.match ? pathname.startsWith(link.match) : false;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-link nav-tracking text-xs font-bold uppercase text-biggs-yellow hover:text-biggs-cream ${
                  active ? 'nav-link-active' : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="btn-pop relative rounded-full border border-biggs-yellow/40 px-4 py-2 text-xs font-bold uppercase tracking-widest text-biggs-yellow hover:border-biggs-yellow hover:text-biggs-cream"
          >
            Cart
            {itemCount > 0 && (
              <span
                key={badgeKey}
                className="badge-pop absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-biggs-yellow text-[11px] font-bold text-biggs-green"
              >
                {itemCount}
              </span>
            )}
          </button>

          <button
            className="font-bold text-biggs-yellow md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-biggs-cream/10 bg-biggs-green px-6 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-2 text-sm font-bold uppercase tracking-widest text-biggs-yellow hover:text-biggs-cream"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
