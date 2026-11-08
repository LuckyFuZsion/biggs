'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { API_BASE } from '@/lib/site-images';

/**
 * Anonymous visit counting (shown in the admin, Visitors tab). It sets no cookies and stores nothing in
 * the browser, so it counts everyone and needs no consent banner. The Worker never keeps IP addresses.
 *
 * To keep the number of requests tiny it sends ONE message when a visit starts (page, referring site,
 * campaign name), and at most ONE more when the visitor leaves, listing any extra pages they looked at.
 * It does nothing for people who send "Do Not Track", for automated browsers, or on the admin pages.
 */

const MAX_EXTRA = 20;

function send(message: object) {
  const url = `${API_BASE}/api/hit`;
  const body = JSON.stringify(message);
  try {
    // text/plain keeps this a "simple" request, so the browser makes no extra preflight call
    if (navigator.sendBeacon && navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }))) return;
  } catch {
    // fall through to fetch
  }
  try {
    fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'text/plain' }, keepalive: true, mode: 'cors' }).catch(() => {});
  } catch {
    // counting is optional: never break the page
  }
}

function skip(): boolean {
  if (!API_BASE) return true;
  const nav = navigator as Navigator & { doNotTrack?: string; msDoNotTrack?: string };
  const w = window as Window & { doNotTrack?: string };
  if (nav.doNotTrack === '1' || w.doNotTrack === '1' || nav.msDoNotTrack === '1') return true;
  if (nav.webdriver) return true;
  if (/bot|crawl|spider|headless|lighthouse|preview/i.test(nav.userAgent)) return true;
  // Local development never counts, unless NEXT_PUBLIC_TRACK_DEV=1 is set to test the tracker itself.
  const host = window.location.hostname;
  const local = host === 'localhost' || host === '127.0.0.1';
  return local && process.env.NEXT_PUBLIC_TRACK_DEV !== '1';
}

export default function VisitTracker() {
  const pathname = usePathname();
  const started = useRef(false);
  const extra = useRef<string[]>([]);
  const lastPath = useRef('');

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || skip()) return;
    if (pathname === lastPath.current) return; // the same page again (for example development mode re-running effects)
    lastPath.current = pathname;
    if (!started.current) {
      started.current = true;
      let ref = '';
      try {
        ref = document.referrer ? new URL(document.referrer).hostname : '';
      } catch {
        ref = '';
      }
      const utm = new URLSearchParams(window.location.search).get('utm_source') || '';
      send({ t: 'v', p: pathname, r: ref, s: utm.slice(0, 30) });
    } else if (extra.current.length < MAX_EXTRA) {
      extra.current.push(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    const flush = () => {
      if (extra.current.length === 0) return;
      send({ t: 'p', p: extra.current });
      extra.current = [];
    };
    const onHide = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flush);
    };
  }, []);

  return null;
}
