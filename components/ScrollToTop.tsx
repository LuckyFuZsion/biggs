'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const HEADER_OFFSET = 104; // sticky navbar height + breathing room

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, '');
  if (!id) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return;
  }

  const el = document.getElementById(id);
  if (!el) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'smooth' });
}

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;

    // Allow the new page (and page-fade) to mount first.
    const timer = window.setTimeout(() => {
      if (hash) {
        scrollToHash(hash);
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }, 50);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  // Same-page hash clicks (e.g. footer → Delivery while already on FAQ)
  useEffect(() => {
    function onHashChange() {
      scrollToHash(window.location.hash);
    }

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return null;
}
