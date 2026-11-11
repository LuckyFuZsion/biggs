'use client';

import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '@/lib/site-images';
import { siteConfig } from '@/lib/data';

/**
 * The "Get In Touch" form on the FAQ page. Messages go to the same Worker as the sign-up box (POST /api/contact),
 * which emails them to the shop's contact address. Needs the same two public settings as the sign-up box:
 *   NEXT_PUBLIC_SUBSCRIBE_URL        (the Worker address)
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY   Cloudflare Turnstile SITE key
 * This form never shows "thanks" unless the Worker confirmed the message was sent. If it cannot send, it says so
 * and points to the email address instead.
 */
const CONTACT_URL = API_BASE ? `${API_BASE}/api/contact` : '';
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};
const getTurnstile = () => (window as unknown as { turnstile?: TurnstileApi }).turnstile;

const ERRORS: Record<string, string> = {
  invalid_email: 'That email address does not look right. Please check it and try again.',
  missing_text: 'Please add your name and a message (at least a few words).',
  too_fast: 'That was very quick. Please check your message and press Send again.',
  rate_limited: 'You have sent a few messages already. Please try again in a little while.',
  bot_check: 'We could not confirm you are a real person. Please refresh the page and try again.',
  email_failed: 'Sorry, your message could not be sent just now.',
  not_configured: 'Sorry, the contact form is not available right now.',
};

const inputClass =
  'w-full rounded-xl border border-transparent bg-white px-4 py-3 text-biggs-green placeholder:text-biggs-green/50 focus:outline-none focus:ring-2 focus:ring-biggs-yellow';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');
  const loadedAt = useRef(Date.now());
  const token = useRef('');
  const widgetId = useRef<string | undefined>(undefined);
  const widgetEl = useRef<HTMLDivElement>(null);

  const configured = Boolean(CONTACT_URL && TURNSTILE_SITE_KEY);
  const email = siteConfig.email;

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
      if (getTurnstile()) render();
      else existing.addEventListener('load', render);
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
    if (status === 'sending') return;
    if (!configured) {
      setError(ERRORS.not_configured);
      return;
    }
    if (!token.current) {
      setError('One moment, checking you are a real person. Please press Send again.');
      return;
    }

    setStatus('sending');
    setError('');
    try {
      const res = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          token: token.current,
          hp: honeypot,
          elapsed: Date.now() - loadedAt.current,
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
      setError((code && ERRORS[code]) || 'Sorry, your message could not be sent just now.');
      setStatus('idle'); // the text they typed stays in the form
      token.current = '';
      const api = getTurnstile();
      if (api && widgetId.current !== undefined) api.reset(widgetId.current);
    }
  }

  if (status === 'done') {
    return (
      <p className="mt-6 font-semibold text-biggs-yellow" role="status">
        Thanks for getting in touch! We&rsquo;ll reply within 1-3 working days.
      </p>
    );
  }

  return (
    <>
      {!configured && (
        <p className="mt-6 font-semibold text-biggs-yellow" role="status">
          The contact form is not available right now. Please email us at{' '}
          <a className="underline underline-offset-2" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
      )}
      <form onSubmit={handleSubmit} className="relative mt-6 space-y-4">
        <label htmlFor="contact-name" className="sr-only">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          maxLength={80}
          autoComplete="name"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
        <label htmlFor="contact-email" className="sr-only">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
        <label htmlFor="contact-message" className="sr-only">
          How can we help?
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          minLength={5}
          maxLength={3000}
          placeholder="How can we help?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={inputClass}
        />
        {/* Honeypot: hidden from people, filled in by bots */}
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
        <div ref={widgetEl} />
        <p className="min-h-[1.25rem] text-sm font-semibold text-red-300" role="alert">
          {error}
          {error && (
            <>
              {' '}
              You can also email{' '}
              <a className="underline underline-offset-2" href={`mailto:${email}`}>
                {email}
              </a>
              .
            </>
          )}
        </p>
        <button
          type="submit"
          disabled={status === 'sending' || !configured}
          className="btn-pop rounded-full bg-biggs-yellow px-8 py-3 font-semibold text-biggs-green disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </>
  );
}
