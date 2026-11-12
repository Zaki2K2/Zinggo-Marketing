'use client';

import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { IconTile, type IconName } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { PosDemo } from '@/components/demos/PosDemo';
import { InventoryDemo } from '@/components/demos/InventoryDemo';
import { OrdersDemo } from '@/components/demos/OrdersDemo';
import { AnalyticsDemo } from '@/components/demos/AnalyticsDemo';
import { CustomersDemo } from '@/components/demos/CustomersDemo';
import { RestaurantDemo } from '@/components/demos/RestaurantDemo';

type Feature = { id: string; nav: string; icon: IconName; title: string; text: string; bullets: string[]; Demo: ComponentType };

const FEATURES: Feature[] = [
  { id: 'pos', nav: 'Point of Sale', icon: 'pos', title: 'Make Every Sale Effortless.', text: 'Record transactions, apply discounts, and generate invoices with ease.', bullets: ['Fixed or percentage discounts', 'Cash, Easypaisa, JazzCash and bank references', 'Print and share invoices'], Demo: PosDemo },
  { id: 'inventory', nav: 'Inventory', icon: 'box', title: 'Never Lose Track Of Stock.', text: 'Stay informed about product quantities, purchases, and inventory activity.', bullets: ['Barcode scanning', 'Batches and expiry dates', 'Suppliers and stock purchases'], Demo: InventoryDemo },
  { id: 'orders', nav: 'Orders', icon: 'orders', title: 'Every Order. Under Control.', text: 'Manage business orders with a clear and organized workflow.', bullets: ['Online and offline orders together', 'Clear status from new to completed', 'Returns and refunds'], Demo: OrdersDemo },
  { id: 'analytics', nav: 'Analytics', icon: 'chart', title: 'Know Your Numbers.', text: 'Understand sales, purchases, expenses, and trends through clear reports.', bullets: ['Basic and advanced reports', 'Filter by payment type', 'Daily expenses and purchases'], Demo: AnalyticsDemo },
  { id: 'customers', nav: 'Customers', icon: 'users', title: 'Build Stronger Customer Relationships.', text: 'Keep customer information and credit activity organized.', bullets: ['Customer records', 'Credit tracking', 'Transaction history'], Demo: CustomersDemo },
  { id: 'restaurant', nav: 'Restaurant', icon: 'utensils', title: 'Your Restaurant. Simplified.', text: 'Manage menus, QR orders, and deliveries from one platform.', bullets: ['Menus and recipes', 'QR dine-in and takeaway orders', 'Delivery rider management'], Demo: RestaurantDemo },
];

export function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(false);
  const blocks = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Scroll-driven activation of the sticky preview (desktop).
  useEffect(() => {
    if (!desktop) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    blocks.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, [desktop]);

  const jump = useCallback((i: number) => {
    setActive(i);
    blocks.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const Active = FEATURES[active].Demo;

  return (
    <section id="features" aria-labelledby="features-title" className="on-light bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="features-title" eyebrow="Powerful features" title="Everything Your Business Needs. In One Place.">
          Explore the tools that make everyday business operations simpler.
        </SectionHeading>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            {FEATURES.map((f, i) => (
              <Reveal key={f.id}>
                <article ref={(el) => { blocks.current[i] = el; }} data-index={i} aria-labelledby={`feat-${f.id}`} className="flex scroll-mt-28 flex-col justify-center gap-6 pb-16 lg:min-h-[78vh] lg:pb-0">
                  <div className={`transition-opacity duration-500 ${desktop && active !== i ? 'lg:opacity-40' : ''}`}>
                    <IconTile name={f.icon} tone={i % 3 === 1 ? 'dark' : 'teal'} />
                    <p className="t-eyebrow mt-6 text-brand-ink">{String(i + 1).padStart(2, '0')} · {f.nav}</p>
                    <h3 id={`feat-${f.id}`} className="mt-3 text-[clamp(28px,3.4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{f.title}</h3>
                    <p className="t-body mt-4 text-muted">{f.text}</p>
                    <ul className="mt-5 space-y-2 text-[15px] font-medium">
                      {f.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />{b}</li>
                      ))}
                    </ul>
                  </div>
                  {!desktop && <f.Demo />}
                </article>
              </Reveal>
            ))}
          </div>

          {desktop && (
            <div>
              <div className="sticky top-24">
                <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Choose a feature demo">
                  {FEATURES.map((f, i) => (
                    <button key={f.id} type="button" aria-pressed={i === active} onClick={() => jump(i)} className={`rounded-full px-4 py-2 text-[13px] font-bold transition-[transform,background-color,color] duration-150 active:scale-95 ${i === active ? 'bg-brand text-deep' : 'bg-mist text-ink hover:bg-line'}`}>
                      {f.nav}
                    </button>
                  ))}
                </div>
                <div key={FEATURES[active].id} className="screen-enter">
                  <Active />
                </div>
                <p className="mt-3 text-center text-[12px] text-muted">Interactive demo with fictional sample data. Try it.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
