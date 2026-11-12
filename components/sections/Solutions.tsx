'use client';

import Image from 'next/image';
import { useEffect, useRef, type ReactNode } from 'react';
import { PhoneFrame } from '@/components/mockup/PhoneFrame';
import { InventoryScreen } from '@/components/mockup/screens/InventoryScreen';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { trialHref } from '@/lib/site';

/**
 * One continuous showcase, no clicks and no pinning: three business types side by side on Zinggo screens.
 * Columns drift at different speeds as the section crosses the viewport (--sp, set once per frame), giving depth
 * while native scrolling stays untouched.
 */

const shot = (src: string, alt: string): ReactNode => (
  <PhoneFrame chrome={false} tab="home">
    <div className="relative h-full w-full">
      <Image src={src} alt={alt} fill sizes="274px" quality={72} className="object-cover object-top" />
    </div>
  </PhoneFrame>
);

const COLS: { label: string; title: ReactNode; text: string; tags: string; plan: string; price: string; note?: string; drift: number; node: ReactNode }[] = [
  {
    label: 'Retailers',
    title: <>The counter, <span className="text-brand">connected.</span></>,
    text: 'Scan, sell and watch stock drop. Reorder from a supplier when something runs low.',
    tags: 'POS · Barcodes · Batches and expiry · Credit',
    plan: 'Retailer', price: 'Rs 999', drift: 70,
    node: shot('/screens/pos.jpg', 'Zinggo POS screen with product search, categories and product cards'),
  },
  {
    label: 'Restaurants and cafés',
    title: <>Table to kitchen to <span className="text-brand">doorstep.</span></>,
    text: 'QR orders for dine-in and takeaway, a live order queue and delivery riders.',
    tags: 'QR ordering · Menus and recipes · Delivery · Loyalty',
    plan: 'Restaurant', price: 'Rs 2,499', drift: 0,
    node: shot('/screens/home.jpg', 'Zinggo Merchant home screen of a restaurant account with live orders and a Point of Sale shortcut'),
  },
  {
    label: 'Distributors and wholesalers',
    title: <>Every order, <span className="text-brand">on route.</span></>,
    text: 'Take orders from merchants, keep stock honest and organise deliveries by area.',
    tags: 'Merchant ordering · Inventory · Delivery areas',
    plan: 'Distributor / Wholesaler', price: 'Rs 4,999', note: 'Stock screen shown is a demo recreation.', drift: -70,
    node: <PhoneFrame tab="catalog"><InventoryScreen /></PhoneFrame>,
  },
];

export function Solutions() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      el.style.setProperty('--sp', p.toFixed(3));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} id="solutions" aria-labelledby="solutions-title" className="relative -mt-10 scroll-mt-20 rounded-t-[40px] bg-deep pb-28 pt-24 text-white sm:pb-36 sm:pt-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-10">
        <Reveal className="max-w-5xl">
          <p className="t-eyebrow text-brand">Built for your business</p>
          <h2 id="solutions-title" className="mt-4 text-[clamp(38px,5.6vw,88px)] font-extrabold leading-[0.95] tracking-[-0.055em]">One platform.<br />Three kinds of business.</h2>
        </Reveal>

        <div className="mt-16 grid gap-20 lg:mt-24 lg:grid-cols-3 lg:gap-8 xl:gap-12">
          {COLS.map((c, i) => (
            <Reveal key={c.label} delay={i * 90}>
              <article className="flex flex-col items-center text-center lg:items-start lg:text-left" style={{ transform: `translate3d(0, calc((0.5 - var(--sp, 0.5)) * ${c.drift}px), 0)` }}>
                <div className="origin-top scale-[0.9] max-lg:-mb-[60px] lg:scale-[0.88] lg:-mb-[72px] lg:self-center">{c.node}</div>
                <p className="label mt-8 text-brand">{c.label}</p>
                <h3 className="mt-3 max-w-[16ch] text-[clamp(28px,2.6vw,40px)] font-extrabold leading-[1] tracking-[-0.045em]">{c.title}</h3>
                <p className="mt-4 max-w-[34ch] text-[16px] leading-relaxed text-white/65">{c.text}</p>
                <p className="label mt-4 text-white/40">{c.tags}</p>
                {c.note && <p className="mt-2 text-[12px] text-white/40">{c.note}</p>}
                <a href={trialHref(c.plan)} target="_blank" rel="noopener noreferrer" aria-label={`Start Free Trial, ${c.plan} plan, ${c.price} per month`} className="btn btn-primary btn-sm mt-6 max-w-full">
                  Start Free Trial · {c.price}/mo <Icon name="arrow" size={16} strokeWidth={2.4} />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
