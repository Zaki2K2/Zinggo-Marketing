'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { PhoneFrame } from '@/components/mockup/PhoneFrame';
import { InventoryScreen } from '@/components/mockup/screens/InventoryScreen';
import { ReportsScreen } from '@/components/mockup/screens/ReportsScreen';
import { Icon } from '@/components/ui/Icon';

/**
 * Hero product stage: a perspective carousel of the Zinggo Merchant app.
 * Home, Orders and POS are the real app screens; Stock and Reports are faithful demo recreations.
 * Autoplays; pauses when off-screen / tab hidden / hovered / reduced-motion. Supports click, arrow keys and swipe.
 */

const shot = (src: string, alt: string, priority = false): ReactNode => (
  <PhoneFrame chrome={false} tab="home">
    <div className="relative h-full w-full">
      <Image src={src} alt={alt} fill sizes="274px" quality={72} priority={priority} className="object-cover object-top" />
    </div>
  </PhoneFrame>
);

const SLIDES: { id: string; label: string; caption: string; node: ReactNode }[] = [
  { id: 'home', label: 'Home', caption: 'Today’s sales, live orders and quick actions in one place.', node: shot('/screens/home.jpg', 'Zinggo Merchant home screen with store status, today’s sales and live orders', true) },
  { id: 'orders', label: 'Orders', caption: 'POS and online orders together, each with a clear status.', node: shot('/screens/orders.jpg', 'Zinggo Orders screen listing in-progress orders', true) },
  { id: 'pos', label: 'POS', caption: 'Search, scan and add products in a tap.', node: shot('/screens/pos.jpg', 'Zinggo POS screen with product cards and categories', true) },
  { id: 'stock', label: 'Stock', caption: 'Stock levels update after every sale. (Demo screen)', node: <PhoneFrame tab="catalog"><InventoryScreen /></PhoneFrame> },
  { id: 'reports', label: 'Reports', caption: 'Sales and payment types at a glance. (Demo screen)', node: <PhoneFrame tab="more"><ReportsScreen /></PhoneFrame> },
];
const N = SLIDES.length;
const DWELL = 4200;

export function HeroStage() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);
  const [hover, setHover] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const prevD = useRef<number[]>(SLIDES.map((_, i) => i));
  const down = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) setPlaying(false);
  }, []);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const on = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  const running = playing && inView && visible && !hover;
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % N), DWELL);
    return () => window.clearTimeout(id);
  }, [running, active]);

  const go = useCallback((n: number) => setActive(((n % N) + N) % N), []);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };
  const onDown = (e: PointerEvent) => { down.current = e.clientX; };
  const onUp = (e: PointerEvent) => {
    if (down.current === null) return;
    const dx = e.clientX - down.current;
    down.current = null;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
  };

  const dists = SLIDES.map((_, i) => ((i - active + N + 2) % N) - 2);
  const jumped = dists.map((d, i) => Math.abs(d - prevD.current[i]) > 2);
  useEffect(() => { prevD.current = dists; });

  return (
    <div ref={root} className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} data-paused={!running}>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Zinggo Merchant app screens. Use left and right arrow keys to change screen."
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => { down.current = null; }}
        className="relative mx-auto h-[520px] w-full touch-pan-y select-none rounded-[32px] [--step:150px] [perspective:1700px] md:h-[640px] md:[--step:250px] xl:[--step:290px]"
      >
        <div className="absolute inset-0 origin-top scale-[0.84] [transform-style:preserve-3d] md:scale-100">
          {SLIDES.map((s, i) => {
            const d = dists[i];
            const a = Math.abs(d);
            return (
              <div
                key={s.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${N}: ${s.label}`}
                aria-hidden={a !== 0}
                className="absolute inset-0 grid place-items-start justify-center"
                style={{
                  transform: `translate3d(calc(var(--step) * ${d}), 0, ${-a * 150}px) rotateY(${-d * 24}deg) scale(${1 - a * 0.1})`,
                  opacity: a === 0 ? 1 : a === 1 ? 0.6 : 0.26,
                  zIndex: 10 - a,
                  transition: jumped[i] ? 'none' : 'transform 0.9s var(--ease-panel), opacity 0.6s var(--ease-panel)',
                }}
              >
                <div className="relative">
                  {s.node}
                  {a !== 0 && <button type="button" tabIndex={-1} aria-label={`Show ${s.label}`} onClick={() => go(i)} className="absolute inset-0 cursor-pointer rounded-[46px]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rail: progress, labels, controls */}
      <div className="mx-auto mt-2 max-w-[720px] px-1">
        <p className="min-h-[44px] text-center text-[15px] leading-snug text-white/70" aria-live="polite">{SLIDES[active].caption}</p>
        <div className="mt-4 flex items-center gap-3">
          <button type="button" onClick={() => go(active - 1)} aria-label="Previous screen" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-[transform,background-color] duration-150 [transition-timing-function:var(--ease-micro)] hover:bg-white/10 active:scale-95"><Icon name="chevL" size={18} /></button>
          <ol className="grid flex-1 grid-cols-5 gap-2">
            {SLIDES.map((s, i) => (
              <li key={s.id}>
                <button type="button" onClick={() => go(i)} aria-current={i === active ? 'true' : undefined} className="group block w-full text-left">
                  <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/15">
                    {i < active && <span className="absolute inset-0 bg-white/60" />}
                    {i === active && <span key={`${active}-${running}`} className="rail-fill absolute inset-0 bg-brand" style={{ animationDuration: `${DWELL}ms`, animationPlayState: running ? 'running' : 'paused' }} />}
                  </span>
                  <span className={`label mt-2 block truncate transition-colors duration-300 ${i === active ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => go(active + 1)} aria-label="Next screen" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-[transform,background-color] duration-150 [transition-timing-function:var(--ease-micro)] hover:bg-white/10 active:scale-95"><Icon name="chevR" size={18} /></button>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause autoplay' : 'Play autoplay'} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-deep transition-transform duration-150 active:scale-95"><Icon name={playing ? 'pause' : 'play'} size={16} strokeWidth={2.4} /></button>
        </div>
      </div>
    </div>
  );
}
