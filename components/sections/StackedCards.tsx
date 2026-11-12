'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { PhoneFrame } from '@/components/mockup/PhoneFrame';
import { InventoryScreen } from '@/components/mockup/screens/InventoryScreen';
import { CreditScreen } from '@/components/mockup/screens/CreditScreen';
import { ReportsScreen } from '@/components/mockup/screens/ReportsScreen';
import { useScrollProgress } from '@/lib/useScrollProgress';

/**
 * Scroll-linked stack of product cards with perspective.
 * Stacking is predictable: every card lives inside one isolated 3D stage and its z-index is derived
 * from its distance to the active card (see `pose`). No global z-index values are used.
 * Real screenshots: POS, Orders. Inventory, Credit and Reports are faithful demo recreations.
 */

const shot = (src: string, alt: string): ReactNode => (
  <PhoneFrame chrome={false} tab="home">
    <div className="relative h-full w-full">
      <Image src={src} alt={alt} fill sizes="274px" quality={70} className="object-cover object-top" />
    </div>
  </PhoneFrame>
);

const CARDS: { label: string; title: string; text: string; node: ReactNode }[] = [
  { label: 'Point of Sale', title: 'Make every sale effortless.', text: 'Pick products, set quantities and see the running total. Sold-out items are marked for you.', node: shot('/screens/pos.jpg', 'Zinggo POS screen with product search, categories and product cards') },
  { label: 'Inventory', title: 'Never lose track of stock.', text: 'Quantities update after every sale, and low stock is flagged before you run out.', node: <PhoneFrame tab="catalog"><InventoryScreen /></PhoneFrame> },
  { label: 'Orders', title: 'Every order. Under control.', text: 'New and in-progress orders from POS and online, with clear status on each one.', node: shot('/screens/orders.jpg', 'Zinggo Orders screen listing in-progress orders with status and View Details buttons') },
  { label: 'Customer credit', title: 'Know who owes what.', text: 'Keep customer details, credit limits and payment history together.', node: <PhoneFrame tab="more"><CreditScreen /></PhoneFrame> },
  { label: 'Reports', title: 'Know your numbers.', text: 'Sales, orders and payment types, in reports you can read at a glance.', node: <PhoneFrame tab="more"><ReportsScreen /></PhoneFrame> },
];
const N = CARDS.length;

/** Pose of a card at signed distance r from the active card (r>0 waiting behind, r<0 leaving). */
function pose(r: number) {
  if (r >= 0) {
    const k = Math.min(r, 3);
    return { transform: `translate3d(${k * 56}px, ${k * -14}px, ${-k * 110}px) rotateY(${-k * 9}deg) rotateZ(${k * 2}deg) scale(${1 - k * 0.07})`, opacity: r > 3 ? 0 : 1 - k * 0.22, zIndex: 50 - Math.round(r * 10) };
  }
  const q = Math.min(1, -r);
  const e = q * q * (3 - 2 * q);
  return { transform: `translate3d(${-e * 190}px, ${e * 24}px, ${-e * 170}px) rotateY(${e * 20}deg) rotateZ(${-e * 4}deg) scale(${1 - e * 0.1})`, opacity: 1 - e, zIndex: 60 };
}

export function StackedCards() {
  const wrap = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef(0);
  const smooth = useRef(true);
  const [active, setActive] = useState(0);

  const paint = useCallback((t: number) => {
    cards.current.forEach((el, i) => {
      if (!el) return;
      const p = pose(i - t);
      el.style.transform = p.transform;
      el.style.opacity = String(p.opacity);
      el.style.zIndex = String(p.zIndex);
      el.style.visibility = p.opacity <= 0.01 ? 'hidden' : 'visible';
    });
    const a = Math.round(t);
    setActive((prev) => (prev === a ? prev : a));
  }, []);

  const loop = useCallback(() => {
    raf.current = 0;
    const diff = target.current - current.current;
    if (Math.abs(diff) < 0.0008) {
      current.current = target.current;
      paint(current.current);
      return;
    }
    current.current += diff * (smooth.current ? 0.14 : 1);
    paint(current.current);
    raf.current = requestAnimationFrame(loop);
  }, [paint]);

  useScrollProgress(wrap, (p) => {
    target.current = p * (N - 1);
    if (!raf.current) raf.current = requestAnimationFrame(loop);
  });

  useEffect(() => {
    smooth.current = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    paint(current.current);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [paint]);

  const jump = (i: number) => {
    const el = wrap.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i / (N - 1)) * (el.offsetHeight - window.innerHeight), behavior: 'smooth' });
  };

  const c = CARDS[active];

  return (
    <section id="features" aria-labelledby="stack-title" className="bg-night text-white">
      <div ref={wrap} className="relative" style={{ height: `${N * 70 + 120}vh` }}>
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-5 pt-20 sm:px-8">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
            <div>
              <p className="t-eyebrow text-brand">Powerful features</p>
              <h2 id="stack-title" className="sr-only">Zinggo features: point of sale, inventory, orders, customer credit and reports</h2>
              <div key={active} className="screen-enter mt-3" aria-live="polite">
                <p className="text-[13px] font-bold text-white/50">0{active + 1} / 0{N} · {c.label}</p>
                <p className="mt-2 text-[clamp(30px,4.6vw,66px)] font-extrabold leading-[1] tracking-[-0.04em]">{c.title}</p>
                <p className="t-body mt-3 max-w-md text-white/65">{c.text}</p>
              </div>
              <div className="mt-5 flex items-center gap-1" role="group" aria-label="Feature cards">
                {CARDS.map((x, i) => (
                  <button key={x.label} type="button" onClick={() => jump(i)} aria-label={`Show ${x.label}`} aria-current={i === active ? 'true' : undefined} className="grid h-8 place-items-center px-1">
                    <span className={`block h-1.5 rounded-full transition-all duration-500 [transition-timing-function:var(--ease-panel)] ${i === active ? 'w-10 bg-brand' : 'w-4 bg-white/25'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative isolate mx-auto h-[470px] w-full max-w-[560px] [perspective:1400px] sm:h-[620px]">
              <div className="absolute inset-0 origin-center scale-[0.76] [transform-style:preserve-3d] sm:scale-100">
                {CARDS.map((card, i) => (
                  <div
                    key={card.label}
                    ref={(el) => { cards.current[i] = el; }}
                    className="absolute inset-0 grid place-items-center will-change-transform"
                    style={{ ...pose(i), visibility: i === 0 ? 'visible' : undefined }}
                    aria-hidden={i !== active}
                  >
                    {card.node}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
