'use client';

import { useCallback, useEffect, useState } from 'react';
import { getFirebaseAnalytics, isFirebaseConfigured } from '@/lib/firebase';

const STORAGE_KEY = 'biggs-analytics-consent';
export const OPEN_COOKIE_CHOICES_EVENT = 'biggs:open-cookie-choices';

type Choice = 'granted' | 'denied';

function readChoice(): Choice | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the choice just lasts for this visit.
  }
}

function startAnalytics() {
  getFirebaseAnalytics().catch(() => {
    // Analytics is optional - never break the page if it fails to load.
  });
}

/**
 * Cookie banner + Firebase Analytics. Analytics never loads until the visitor presses Accept,
 * and nothing at all is shown when Firebase isn't configured. The choice is remembered in the
 * browser and can be changed from the footer ("Cookie choices").
 */
export default function FirebaseAnalytics() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const choice = readChoice();
    if (choice === 'granted') startAnalytics();
    else if (choice === null) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_CHOICES_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_CHOICES_EVENT, reopen);
  }, []);

  const decide = useCallback((choice: Choice) => {
    saveChoice(choice);
    setOpen(false);
    if (choice === 'granted') startAnalytics();
    // Declining after analytics already started takes effect on the next page load,
    // because nothing is started then.
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie choices"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl bg-biggs-green p-5 text-biggs-cream shadow-2xl ring-1 ring-biggs-cream/10 sm:inset-x-6 sm:bottom-6"
    >
      <p className="text-sm font-semibold leading-relaxed">Can we use analytics cookies?</p>
      <p className="mt-1 text-xs font-medium leading-relaxed text-biggs-cream/70">
        They help us see which pages are popular so we can improve the site. Nothing is tracked unless
        you accept. See our{' '}
        <a href="/privacy" className="underline underline-offset-2">
          privacy policy
        </a>
        .
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => decide('granted')}
          className="flex-1 rounded-full bg-biggs-yellow px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-biggs-green transition hover:brightness-110"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => decide('denied')}
          className="flex-1 rounded-full bg-biggs-yellow px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-biggs-green transition hover:brightness-110"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
