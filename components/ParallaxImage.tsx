'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useRef } from 'react';

type ParallaxImageProps = Omit<ImageProps, 'fill'> & {
  /** Max shift in px (default 28) - keep subtle */
  intensity?: number;
  wrapperClassName?: string;
};

export default function ParallaxImage({
  intensity = 28,
  wrapperClassName = '',
  className = '',
  alt,
  ...imageProps
}: ParallaxImageProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let frame = 0;

    function update() {
      frame = 0;
      if (!outer || !inner) return;
      const rect = outer.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2 - viewH / 2) / viewH;
      const y = Math.max(-intensity, Math.min(intensity, -progress * intensity));
      inner.style.transform = `translate3d(0, ${y}px, 0) scale(1.08)`;
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [intensity]);

  return (
    <div ref={outerRef} className={`overflow-hidden ${wrapperClassName}`}>
      <div ref={innerRef} className="will-change-transform">
        <Image {...imageProps} alt={alt} className={className} />
      </div>
    </div>
  );
}
