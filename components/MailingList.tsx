'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import { useSiteImage } from './SiteImagesProvider';

/**
 * Sign-ups go to the same secured Cloud Function as the holding page, so both lists end up
 * in one place. Needs two public settings (see .env.example):
 *   NEXT_PUBLIC_SUBSCRIBE_URL        e.g. https://biggsbakes.com/api/subscribe
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY   Cloudflare Turnstile SITE key (never the secret)
 * Without them the form tells the visitor sign-ups are not open, rather than pretending to work.
 */
const SUBSCRIBE_URL = process.env.NEXT_PUBLIC_SUBSCRIBE_URL;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const CONSENT =
  'By signing up you agree to receive emails from Biggs Bakes about new drops & flavours. Unsubscribe at any time.';
const COMPANY_LINE = 'Biggs Productions Limited, 86-90 Paul Street, London EC2A 4NE';

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};

const getTurnstile = () => (window as unknown as { turnstile?: TurnstileApi }).turnstile;

const ERRORS: Record<string, string> = {
  invalid_email: 'That email address does not look right. Please check it and try again.',
  rate_limited: 'Too many attempts. Please try again in a little while.',
  bot_check: 'We could not confirm you are a real person. Please refresh the page and try again.',
  email_failed: 'We could not send the confirmation email. Please try again in a moment.',
};

export default function MailingList() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');
  const loadedAt = useRef(Date.now());
  const token = useRef('');
  const widgetId = useRef<string | undefined>(undefined);
  const widgetEl = useRef<HTMLDivElement>(null);

  const configured = Boolean(SUBSCRIBE_URL && TURNSTILE_SITE_KEY);
  const cardSrc = useSiteImage('mailing', '/images/chocolate-chip.webp');

  useEffect(() => {
    if (!configured || !widgetEl.current) return;
    const el = widgetEl.current;
    function render() {
      const api = getTurnstile();
      if (!api || widgetId.current !== undefined) return;
      widgetId.current = api.render(el, {
        sitekey: TURNSTILE_SITE_KEY,
        appearance: 'interaction-only',
        callback: (t: string) => (token.current = t),
        'expired-callback': () => (token.current = ''),
        'error-callback': () => (token.current = ''),
      });
    }
    const existing = document.getElementById('turnstile-script');
    if (existing) {
      render();
      return;
    }
    const script = document.createElement('script');
    script.id = 'turnstile-script';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
  }, [configured]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === 'sending') return;
    if (!configured) {
      setError('Sign-ups are not open just yet. Please check back soon.');
      return;
    }
    if (!token.current) {
      setError('One moment, checking you are a real person. Please press the button again.');
      return;
    }

    setStatus('sending');
    setError('');
    try {
      const res = await fetch(SUBSCRIBE_URL as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          token: token.current,
          hp: honeypot,
          elapsed: Date.now() - loadedAt.current,
          source: 'main-site',
          consent: CONSENT,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        const err = new Error(data.error || 'failed') as Error & { code?: string };
        err.code = data.error;
        throw err;
      }
      setStatus('done');
    } catch (err) {
      const code = (err as { code?: string }).code;
      setError((code && ERRORS[code]) || 'Something went wrong. Please try again in a moment.');
      setStatus('idle');
      token.current = '';
      const api = getTurnstile();
      if (api && widgetId.current !== undefined) api.reset(widgetId.current);
    }
  }

  return (
    <section className="bg-biggs-cream pb-16 md:pb-20">
      <Reveal className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-[2rem] bg-biggs-green md:grid md:grid-cols-2 md:items-stretch">
          <div className="relative min-h-[220px] md:min-h-[280px]">
            <Image
              src={cardSrc}
              alt="Gooey Biggs chocolate chip cookie"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center px-8 py-10 md:px-12 md:py-14">
            <h2 className="font-display text-3xl font-bold leading-tight text-biggs-cream md:text-4xl">
              Be the first to get Biggs cookies.
            </h2>
            <p className="mt-3 max-w-sm text-sm text-biggs-cream/70 md:text-base">
              Sign up to get early access to the next drop of new flavours.
            </p>

            {status === 'done' ? (
              <p className="mt-8 font-semibold text-biggs-yellow" role="status">
                Thanks! Check your inbox and click the link to confirm.
              </p>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="relative mt-8 max-w-md" noValidate>
                  <label htmlFor="mailing-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="mailing-email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full rounded-full border-0 bg-biggs-cream py-4 pl-5 pr-14 text-biggs-green placeholder:text-biggs-green/40 focus:outline-none focus:ring-2 focus:ring-biggs-yellow"
                  />
                  {/* Honeypot: hidden from people, filled by bots */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="absolute -left-[9999px] h-px w-px opacity-0"
                  />
                  <button
                    type="submit"
                    aria-label="Sign up"
                    disabled={status === 'sending'}
                    className="btn-pop absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-biggs-yellow text-lg font-bold text-biggs-green disabled:opacity-60"
                  >
                    →
                  </button>
                </form>
                <div ref={widgetEl} className="mt-2 max-w-md" />
                <p className="mt-3 min-h-[1.25rem] text-sm font-semibold text-red-300" role="alert">
                  {error}
                </p>
                <p className="max-w-md text-xs font-medium leading-relaxed text-biggs-cream/50">
                  {CONSENT}
                </p>
              </>
            )}
            <p className="mt-4 max-w-md text-[11px] leading-relaxed text-biggs-cream/40">
              {COMPANY_LINE}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
