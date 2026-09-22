'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay in ms for staggered children */
  delay?: number;
  /** Animation variant */
  variant?: 'up' | 'fade' | 'scale' | 'left' | 'right';
  /** Once visible, stay visible (default true) */
  once?: boolean;
};

export default function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Visible by default so content never stays blank if JS/CSS chunks fail
  const [visible, setVisible] = useState(true);
  const [awaiting, setAwaiting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(true);
      setAwaiting(false);
      return;
    }

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (inView) {
      setVisible(true);
      setAwaiting(false);
      return;
    }

    // Below the fold: hide, then reveal on scroll
    setVisible(false);
    setAwaiting(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setAwaiting(false);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
          setAwaiting(true);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(el);

    // Safety: never leave content hidden
    const fallback = window.setTimeout(() => {
      setVisible(true);
      setAwaiting(false);
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [once]);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${awaiting && !visible ? 'reveal-await' : ''} ${
        visible ? 'reveal-visible' : ''
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
