'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { DemoFrame, RoundBtn } from './DemoFrame';

type Item = { id: string; name: string; sku: string; qty: number; min: number };
const START: Item[] = [
  { id: '1', name: 'Basmati Rice 5kg', sku: 'GR-0012', qty: 42, min: 10 },
  { id: '2', name: 'Cooking Oil 1L', sku: 'GR-0034', qty: 4, min: 12 },
  { id: '3', name: 'Tea Leaves 950g', sku: 'BV-0007', qty: 18, min: 8 },
  { id: '4', name: 'Sugar 1kg', sku: 'GR-0021', qty: 3, min: 15 },
  { id: '5', name: 'Biscuits Family Pack', sku: 'SN-0101', qty: 60, min: 20 },
  { id: '6', name: 'Detergent 1kg', sku: 'HH-0044', qty: 9, min: 10 },
];

export function InventoryDemo() {
  const [items, setItems] = useState(START);
  const [q, setQ] = useState('');
  const shown = items.filter((i) => (i.name + i.sku).toLowerCase().includes(q.trim().toLowerCase()));
  const low = items.filter((i) => i.qty <= i.min).length;
  const adjust = (id: string, by: number) => setItems((all) => all.map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + by) } : i)));

  return (
    <DemoFrame title="Inventory" subtitle="Demo">
      <div className="mb-4 flex items-center gap-3">
        <label className="relative flex-1">
          <span className="sr-only">Search products</span>
          <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products or SKU" className="w-full rounded-full border border-line bg-mist py-3 pl-10 pr-4 text-[14px] outline-none transition-colors focus:border-brand-ink" />
        </label>
        <span className="rounded-full bg-[#fdeaea] px-3 py-2 text-[12px] font-bold text-danger" aria-live="polite">{low} low stock</span>
      </div>
      <ul className="space-y-2">
        {shown.length === 0 && <li className="rounded-2xl bg-mist py-10 text-center text-[14px] text-muted">No products match “{q}”.</li>}
        {shown.map((i) => {
          const isLow = i.qty <= i.min;
          return (
            <li key={i.id} className="flex items-center gap-3 rounded-2xl border border-line p-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-ink"><Icon name="box" size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold">{i.name}</p>
                <p className="text-[12px] text-muted">{i.sku} · reorder at {i.min}</p>
              </div>
              {isLow && <span className="hidden rounded-full bg-[#fdeaea] px-2.5 py-1 text-[11px] font-bold text-danger sm:inline">Low stock</span>}
              <div className="flex items-center gap-2">
                <RoundBtn label={`Remove one ${i.name}`} onClick={() => adjust(i.id, -1)} disabled={i.qty === 0}><Icon name="minus" size={14} /></RoundBtn>
                <span key={i.qty} className={`bump w-9 text-center text-[17px] font-extrabold ${isLow ? 'text-danger' : ''}`} aria-label={`${i.qty} in stock`}>{i.qty}</span>
                <RoundBtn label={`Add one ${i.name}`} onClick={() => adjust(i.id, 1)}><Icon name="plus" size={14} /></RoundBtn>
              </div>
            </li>
          );
        })}
      </ul>
    </DemoFrame>
  );
}
