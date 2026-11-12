'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Wraps looping CSS animations and pauses them while off-screen (see `[data-paused]` in globals.css). */
export function InView({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-paused={!inView} className={className}>
      {children}
    </div>
  );
}
