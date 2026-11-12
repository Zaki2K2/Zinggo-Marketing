'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Writes --hp (0..1) as the hero scrolls away; children read it in CSS for a controlled scroll exit (no pinning). */
export function HeroParallax({ children, className, labelledBy }: { children: ReactNode; className?: string; labelledBy: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      ref.current?.style.setProperty('--hp', p.toFixed(3));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      window.removeEventListener('scroll', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} id="top" aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}
