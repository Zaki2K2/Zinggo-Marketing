'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Icon, IconTile, type IconName } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { d } from '@/components/mockup/parts';

type Solution = { id: string; label: string; icon: IconName; summary: string; features: string[]; note?: string; preview: ReactNode };

const Row = ({ a, b, i }: { a: string; b: string; i: number }) => (
  <div className="pop-in flex items-center justify-between rounded-xl bg-white/10 px-3.5 py-2.5 text-[13px]" style={d(i * 100)}>
    <span className="font-semibold">{a}</span>
    <span className="font-extrabold text-brand">{b}</span>
  </div>
);

const SOLUTIONS: Solution[] = [
  {
    id: 'retail', label: 'Retailers', icon: 'store', summary: 'Sales, POS, inventory, purchasing, and customers.',
    features: ['Barcode scanning at the counter', 'Buy from distributors and wholesalers online', 'Batches and expiry dates', 'Customer credit and daily expenses'],
    preview: (
      <div>
        <div className="relative mb-4 h-20 overflow-hidden rounded-2xl bg-white/10" aria-hidden="true">
          <div className="absolute inset-x-6 inset-y-4 flex items-stretch gap-[3px]">{[3,1,2,1,3,2,1,2,3,1,2,1,3,1,2].map((w, i) => <span key={i} className="bg-white" style={{ width: w * 2 }} />)}</div>
          <span className="absolute inset-x-3 top-3 h-0.5 rounded bg-brand shadow-[0_0_14px_#00C7BE] [animation:scan-line_2.4s_ease-in-out_infinite]" />
        </div>
        <div className="space-y-2"><Row i={0} a="Basmati Rice 5kg" b="Rs 1,650" /><Row i={1} a="Cooking Oil 1L" b="Rs 540" /><Row i={2} a="Total" b="Rs 2,190" /></div>
      </div>
    ),
  },
  {
    id: 'restaurant', label: 'Restaurants & Cafés', icon: 'utensils', summary: 'Menus, QR ordering, POS, deliveries, and loyalty.',
    features: ['QR dine-in and takeaway ordering', 'Menus and recipes', 'Delivery rider management', 'Loyalty program and promo codes'],
    preview: (
      <div className="grid grid-cols-[96px_1fr] items-center gap-4">
        <div className="grid grid-cols-5 gap-[3px] rounded-xl bg-white p-2.5" aria-hidden="true">{Array.from({ length: 25 }).map((_, i) => <span key={i} className={`aspect-square rounded-[2px] ${[0,1,2,4,5,6,10,12,14,18,20,22,23,24,8,16].includes(i) ? 'bg-night' : 'bg-white'}`} />)}</div>
        <div className="space-y-2"><Row i={0} a="Table 4 · QR order" b="Cooking" /><Row i={1} a="Takeaway #T-22" b="Ready" /><Row i={2} a="Delivery #ZG-1042" b="On the way" /></div>
      </div>
    ),
  },
  {
    id: 'distributor', label: 'Distributors & Wholesalers', icon: 'truck', summary: 'Stock management, customer records, suppliers, and ordering.',
    features: ['Products, batches and stock levels', 'Suppliers and stock purchases', 'QR ordering and delivery areas', 'Order online from merchants'],
    preview: (
      <div className="space-y-3">
        {[['Cartons in stock', 82], ['Open purchase orders', 46], ['Retail customers served', 64]].map(([l, v], i) => (
          <div key={l as string}><div className="mb-1 flex justify-between text-[12px] font-semibold text-white/80"><span>{l}</span><span>{v}%</span></div><div className="h-2.5 overflow-hidden rounded-full bg-white/10"><div className="grow-x h-full rounded-full bg-brand" style={{ width: `${v}%`, ...d(i * 140) }} /></div></div>
        ))}
        <div className="grid grid-cols-2 gap-2 pt-1"><Row i={3} a="Suppliers" b="12" /><Row i={4} a="Areas" b="8" /></div>
      </div>
    ),
  },
  {
    id: 'enterprise', label: 'Growing Enterprises', icon: 'building', summary: 'A platform with the ambition to grow alongside your business.',
    features: ['Start with the tools you need today', 'Reports that show how the business is moving', 'A connected platform, not scattered tools', 'Talk to us about larger requirements'],
    note: 'Today’s plans cover one location and one user. If you have larger needs, get in touch and we will tell you honestly what is available.',
    preview: (
      <div className="flex h-full min-h-[190px] items-end justify-between gap-3 pb-2" aria-hidden="true">
        {[['Today', 'Single shop', 36], ['Next', 'More tools', 64], ['Ambition', 'Bigger scale', 92]].map(([a, b, h], i) => (
          <div key={a as string} className="flex-1 text-center"><div className="grow-y mx-auto w-full max-w-[84px] rounded-t-2xl bg-gradient-to-t from-brand/30 to-brand" style={{ height: `${h}px`, ...d(i * 160) }} /><p className="mt-2 text-[12px] font-extrabold text-white">{a}</p><p className="text-[11px] text-white/60">{b}</p></div>
        ))}
      </div>
    ),
  },
];

export function Solutions() {
  const [idx, setIdx] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cur = SOLUTIONS[idx];

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = SOLUTIONS.length;
    let next = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else return;
    e.preventDefault();
    setIdx(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="solutions" aria-labelledby="solutions-title" className="on-light bg-brand-soft py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="solutions-title" eyebrow="Built for your business" title="From Local Shops To Bigger Ambitions.">
          One connected platform designed around different ways of doing business.
        </SectionHeading>

        <Reveal className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div role="tablist" aria-label="Business types" aria-orientation="vertical" className="flex gap-3 overflow-x-auto pb-1 no-scrollbar lg:flex-col lg:overflow-visible">
            {SOLUTIONS.map((s, i) => {
              const on = i === idx;
              return (
                <button
                  key={s.id}
                  ref={(el) => { tabs.current[i] = el; }}
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={on}
                  aria-controls="solution-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setIdx(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`flex min-w-[240px] flex-1 items-center gap-4 rounded-[24px] border p-4 text-left transition-[transform,background-color,border-color,box-shadow] duration-300 [transition-timing-function:var(--ease-panel)] active:scale-[0.98] lg:min-w-0 ${on ? 'border-transparent bg-white shadow-lift' : 'border-brand-ink/10 bg-white/50 hover:bg-white/80'}`}
                >
                  <IconTile name={s.icon} tone={on ? 'teal' : 'light'} size={48} />
                  <span>
                    <span className="block text-[17px] font-extrabold tracking-tight">{s.label}</span>
                    <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{s.summary}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div id="solution-panel" role="tabpanel" aria-labelledby={`tab-${cur.id}`} tabIndex={0} className="grid min-h-[520px] grid-rows-[auto_1fr] overflow-hidden rounded-card bg-night text-white shadow-lift sm:min-h-[480px]">
            <div key={cur.id} className="screen-enter border-b border-white/10 bg-gradient-to-br from-deep to-night p-6 sm:p-8">
              <p className="t-eyebrow mb-4 text-brand">{cur.label}</p>
              <div className="min-h-[190px]">{cur.preview}</div>
            </div>
            <div key={`${cur.id}-f`} className="screen-enter p-6 sm:p-8">
              <p className="t-eyebrow mb-4 text-white/50">What you get</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {cur.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] leading-snug text-white/90"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-deep"><Icon name="check" size={12} strokeWidth={3.4} /></span>{f}</li>
                ))}
              </ul>
              {cur.note && <p className="mt-5 rounded-2xl bg-white/5 p-4 text-[13.5px] leading-relaxed text-white/70">{cur.note}</p>}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
