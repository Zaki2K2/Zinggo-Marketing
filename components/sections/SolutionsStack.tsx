'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { InView } from '@/components/ui/InView';
import { DistributorScene, RestaurantScene, RetailScene } from '@/components/story/BusinessScenes';
import { useScrollProgress } from '@/lib/useScrollProgress';
import { trialHref } from '@/lib/site';

/**
 * Desktop: three business scenes as a scroll-linked card stack (waiting cards peek above, the active card sits in front,
 * the outgoing card advances toward the viewer and fades). Stacking order is derived from distance to the active card inside
 * one isolated context. Mobile uses the simple stacked bands in <Business /> instead.
 */

type Card = { key: string; n: string; label: string; title: ReactNode; text: string; plan: string; price: string; bg: string; dark: boolean; scene: ReactNode };

const CARDS: Card[] = [
  { key: 'retail', n: '01', label: 'Retailers', title: <>The counter, <span className="text-brand-ink">connected.</span></>, text: 'Scan, sell and watch stock drop. Reorder from a supplier when something runs low.', plan: 'Retailer', price: 'Rs 999', bg: 'bg-white', dark: false, scene: <RetailScene /> },
  { key: 'restaurant', n: '02', label: 'Restaurants and cafés', title: <>Table to kitchen to <span className="text-brand">doorstep.</span></>, text: 'QR orders for dine-in and takeaway, a live kitchen queue and delivery riders.', plan: 'Restaurant', price: 'Rs 2,499', bg: 'bg-night', dark: true, scene: <RestaurantScene /> },
  { key: 'distributor', n: '03', label: 'Distributors and wholesalers', title: <>Every order, <span className="text-brand-ink">on route.</span></>, text: 'Take orders from merchants, keep carton stock honest and organise deliveries by area.', plan: 'Distributor / Wholesaler', price: 'Rs 4,999', bg: 'bg-brand-soft', dark: false, scene: <DistributorScene /> },
];
const N = CARDS.length;

function pose(r: number) {
  if (r >= 0) {
    const k = Math.min(r, 2);
    return { transform: `translate3d(0, ${-k * 30}px, ${-k * 90}px) scale(${1 - k * 0.05})`, opacity: r > 2 ? 0 : 1 - k * 0.3, zIndex: 40 - Math.round(r * 10) };
  }
  const q = Math.min(1, -r);
  const e = q * q * (3 - 2 * q);
  return { transform: `translate3d(0, ${e * 70}px, ${e * 140}px) rotateX(${-e * 6}deg) scale(${1 + e * 0.03})`, opacity: Math.max(0, 1 - e * 1.5), zIndex: 60 };
}

export function SolutionsStack() {
  const wrap = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef(0);
  const smooth = useRef(true);
  const [active, setActive] = useState(0);

  const paint = useCallback((t: number) => {
    els.current.forEach((el, i) => {
      if (!el) return;
      const p = pose(i - t);
      el.style.transform = p.transform;
      el.style.opacity = String(p.opacity);
      el.style.zIndex = String(p.zIndex);
      el.style.visibility = p.opacity <= 0.01 ? 'hidden' : 'visible';
      el.style.pointerEvents = Math.round(t) === i ? 'auto' : 'none';
    });
    const a = Math.round(t);
    setActive((prev) => (prev === a ? prev : a));
  }, []);

  const loop = useCallback(() => {
    raf.current = 0;
    const diff = target.current - current.current;
    if (Math.abs(diff) < 0.0008) { current.current = target.current; paint(current.current); return; }
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

  return (
    <section aria-labelledby="solutions-stack-title" className="relative -mt-10 hidden rounded-t-[40px] bg-deep text-white lg:block">
      <div ref={wrap} className="relative" style={{ height: `${N * 75 + 110}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-10 pt-20">
          <div className="mx-auto w-full max-w-[1040px]">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="t-eyebrow text-brand">Built for your business</p>
                <h2 id="solutions-stack-title" className="mt-2 text-[clamp(28px,3vw,44px)] font-extrabold leading-none tracking-[-0.04em]">Three kinds of business.<br />One Zinggo.</h2>
              </div>
              <div className="flex items-center gap-1" role="group" aria-label="Business types">
                {CARDS.map((c, i) => (
                  <button key={c.key} type="button" onClick={() => jump(i)} aria-current={i === active ? 'true' : undefined} className={`label rounded-full px-4 py-2.5 transition-[background-color,color,transform] duration-300 active:scale-95 ${i === active ? 'bg-white text-deep' : 'text-white/55 hover:text-white'}`}>
                    {c.n} {c.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <InView>
              <div className="relative isolate h-[452px] [perspective:1600px] [@media(max-height:780px)]:h-[420px]">
                <div className="absolute inset-0 origin-top [transform-style:preserve-3d] [@media(max-height:780px)]:scale-[0.88]">
                  {CARDS.map((c, i) => (
                    <div key={c.key} ref={(el) => { els.current[i] = el; }} className="absolute inset-0 will-change-transform" style={{ ...pose(i), visibility: i === 0 ? 'visible' : undefined }} aria-hidden={i !== active}>
                      <article className={`on-light-card flex h-full flex-col rounded-[32px] p-7 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.8)] ${c.bg} ${c.dark ? 'text-white' : 'text-ink'}`}>
                        <div className="mb-5 flex items-start justify-between gap-8">
                          <div>
                            <p className={`label ${c.dark ? 'text-white/50' : 'text-muted'}`}>{c.n} — {c.label}</p>
                            <h3 className="mt-2 text-[clamp(32px,3.6vw,54px)] font-extrabold leading-[0.98] tracking-[-0.05em]">{c.title}</h3>
                          </div>
                          <div className="max-w-[300px] shrink-0 pt-1">
                            <p className={`text-[15px] leading-relaxed ${c.dark ? 'text-white/70' : 'text-muted'}`}>{c.text}</p>
                            <a href={trialHref(c.plan)} target="_blank" rel="noopener noreferrer" tabIndex={i === active ? 0 : -1} className={`btn btn-sm mt-3 ${c.dark ? 'btn-primary' : 'btn-dark'}`}>Start Free Trial · {c.price}/mo <Icon name="arrow" size={16} strokeWidth={2.4} /></a>
                          </div>
                        </div>
                        <div className="min-h-0 flex-1 overflow-hidden">{c.scene}</div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </InView>
          </div>
        </div>
      </div>
    </section>
  );
}
