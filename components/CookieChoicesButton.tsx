'use client';

import { isFirebaseConfigured } from '@/lib/firebase';
import { OPEN_COOKIE_CHOICES_EVENT } from './FirebaseAnalytics';

/** Footer link that reopens the cookie banner. Only shown when analytics is set up. */
export default function CookieChoicesButton() {
  if (!isFirebaseConfigured()) return null;
  return (
    <li>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_CHOICES_EVENT))}
        className="nav-tracking text-xs font-semibold uppercase text-biggs-yellow transition hover:text-biggs-cream"
      >
        Cookie choices
      </button>
    </li>
  );
}
