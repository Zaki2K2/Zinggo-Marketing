'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { rs } from '@/lib/site';
import { DemoFrame, Pill } from './DemoFrame';

const TABS = ['Menu', 'Dine-in', 'Takeaway', 'Delivery'] as const;
type Tab = (typeof TABS)[number];
const DELIVERY = ['Preparing', 'Picked up', 'On the way', 'Delivered'] as const;

export function RestaurantDemo() {
  const [tab, setTab] = useState<Tab>('Menu');
  const [menu, setMenu] = useState([
    { name: 'Chicken Biryani', price: 450, on: true },
    { name: 'Red Sauce Pasta', price: 200, on: true },
    { name: 'Chicken Corn Soup', price: 500, on: true },
    { name: 'Blue Lagoon Drink', price: 200, on: false },
  ]);
  const [tables, setTables] = useState([
    { t: 'Table 2', items: '2 × Biryani, 1 × Lemonade', state: 'Cooking' },
    { t: 'Table 5', items: '1 × Pasta, 1 × Soup', state: 'Served' },
    { t: 'Table 7', items: '3 × Zinger Burger', state: 'Cooking' },
  ]);
  const [take, setTake] = useState([
    { id: 'T-21', name: 'Aisha', items: '1 × Nehari', ready: false },
    { id: 'T-22', name: 'Omar', items: '2 × Beef Burger', ready: true },
  ]);
  const [drop, setDrop] = useState(0);

  return (
    <DemoFrame title="Restaurant" subtitle="Demo">
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Restaurant views">
        {TABS.map((t) => <Pill key={t} active={t === tab} onClick={() => setTab(t)}>{t}</Pill>)}
      </div>

      <div key={tab} className="fade-in">
        {tab === 'Menu' && (
          <ul className="space-y-2">
            {menu.map((m, i) => (
              <li key={m.name} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                <span className={`grid h-11 w-11 place-items-center rounded-xl text-white ${m.on ? 'bg-brand-ink' : 'bg-muted/60'}`}><Icon name="utensils" size={20} /></span>
                <span className="min-w-0 flex-1"><span className={`block text-[14px] font-bold ${m.on ? '' : 'text-muted line-through'}`}>{m.name}</span><span className="text-[13px] font-extrabold text-brand-ink">{rs(m.price)}</span></span>
                <button type="button" role="switch" aria-checked={m.on} aria-label={`${m.name} available`} onClick={() => setMenu((all) => all.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))} className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${m.on ? 'bg-brand' : 'bg-line'}`}>
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 [transition-timing-function:var(--ease-micro)] ${m.on ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </li>
            ))}
            <li className="px-1 text-[12px] text-muted">Toggle an item to mark it sold out on your menu.</li>
          </ul>
        )}

        {tab === 'Dine-in' && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {tables.map((t, i) => (
              <li key={t.t} className="rounded-2xl border border-line p-4">
                <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[14px] font-extrabold"><Icon name="qr" size={16} /> {t.t}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${t.state === 'Served' ? 'bg-[#e7f7ea] text-[#1c7a34]' : 'bg-[#fff3c4] text-[#8a6200]'}`}>{t.state}</span></div>
                <p className="mt-2 text-[13px] text-muted">{t.items}</p>
                {t.state !== 'Served' && <button type="button" onClick={() => setTables((all) => all.map((x, j) => (j === i ? { ...x, state: 'Served' } : x)))} className="btn btn-outline btn-sm mt-3">Mark served</button>}
              </li>
            ))}
            <li className="rounded-2xl bg-mist p-4 text-[13px] text-muted">Guests scan the table QR code to order. Orders land here instantly.</li>
          </ul>
        )}

        {tab === 'Takeaway' && (
          <ul className="space-y-2">
            {take.map((o, i) => (
              <li key={o.id} className="flex items-center gap-3 rounded-2xl border border-line p-4">
                <span className="min-w-0 flex-1"><span className="block text-[14px] font-extrabold">#{o.id} · {o.name}</span><span className="text-[13px] text-muted">{o.items}</span></span>
                {o.ready ? <span className="flex items-center gap-1 rounded-full bg-[#e7f7ea] px-3 py-1.5 text-[12px] font-bold text-[#1c7a34]"><Icon name="check" size={14} strokeWidth={3} /> Ready for pickup</span> : <button type="button" onClick={() => setTake((all) => all.map((x, j) => (j === i ? { ...x, ready: true } : x)))} className="btn btn-dark btn-sm">Mark ready</button>}
              </li>
            ))}
          </ul>
        )}

        {tab === 'Delivery' && (
          <div className="rounded-2xl border border-line p-5">
            <div className="flex items-center justify-between"><p className="flex items-center gap-2 text-[15px] font-extrabold"><Icon name="truck" size={18} /> Order #ZG-1042</p><span className="text-[13px] text-muted">Rider: Imran</span></div>
            <ol className="mt-5 grid grid-cols-4 gap-2" aria-label="Delivery progress">
              {DELIVERY.map((s, i) => (
                <li key={s} className="text-center" aria-current={i === drop ? 'step' : undefined}>
                  <span className={`mx-auto grid h-9 w-9 place-items-center rounded-full text-[12px] font-extrabold transition-colors duration-300 ${i <= drop ? 'bg-brand text-deep' : 'bg-mist text-muted'}`}>{i < drop ? <Icon name="check" size={15} strokeWidth={3} /> : i + 1}</span>
                  <span className={`mt-1.5 block text-[11px] font-semibold ${i <= drop ? 'text-ink' : 'text-muted'}`}>{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex gap-2">
              <button type="button" disabled={drop >= DELIVERY.length - 1} onClick={() => setDrop((d) => d + 1)} className="btn btn-dark btn-sm disabled:opacity-40">Advance status</button>
              <button type="button" onClick={() => setDrop(0)} className="btn btn-outline btn-sm">Reset</button>
            </div>
            <p role="status" className="mt-3 text-[13px] font-bold text-brand-ink">{drop === DELIVERY.length - 1 ? 'Delivered — customer notified.' : `Status: ${DELIVERY[drop]}`}</p>
          </div>
        )}
      </div>
    </DemoFrame>
  );
}
