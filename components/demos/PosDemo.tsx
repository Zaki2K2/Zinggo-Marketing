'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { rs } from '@/lib/site';
import { DemoFrame, Pill, RoundBtn } from './DemoFrame';

const PRODUCTS = [
  { id: 'bir', name: 'Chicken Biryani', price: 450, tone: '#e8890c' },
  { id: 'zin', name: 'Zinger Burger', price: 550, tone: '#c0392b' },
  { id: 'lem', name: 'Mint Lemonade', price: 200, tone: '#1aa37a' },
  { id: 'fri', name: 'Masala Fries', price: 250, tone: '#6d5bd0' },
];
type Discount = 'none' | 'pct' | 'fixed';

export function PosDemo() {
  const [cart, setCart] = useState<Record<string, number>>({ bir: 1 });
  const [discount, setDiscount] = useState<Discount>('none');
  const [invoice, setInvoice] = useState<string | null>(null);

  const lines = PRODUCTS.filter((p) => cart[p.id] > 0);
  const subtotal = lines.reduce((s, p) => s + p.price * cart[p.id], 0);
  const off = useMemo(() => (discount === 'pct' ? Math.round(subtotal * 0.1) : discount === 'fixed' ? Math.min(100, subtotal) : 0), [discount, subtotal]);
  const total = subtotal - off;

  const change = (id: string, by: number) => {
    setInvoice(null);
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + by) }));
  };

  return (
    <DemoFrame title="Point of Sale" subtitle="Demo">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[12px] font-bold uppercase tracking-wider text-muted">Choose a product</p>
          <div className="grid grid-cols-2 gap-2.5">
            {PRODUCTS.map((p) => (
              <button key={p.id} type="button" onClick={() => change(p.id, 1)} aria-label={`Add ${p.name}, ${rs(p.price)}`} className="group rounded-2xl border border-line p-3 text-left transition-[transform,border-color,box-shadow] duration-150 [transition-timing-function:var(--ease-micro)] hover:border-brand hover:shadow-soft active:scale-[0.97]">
                <span className="mb-2 grid h-10 w-10 place-items-center rounded-xl text-[15px] font-extrabold text-white" style={{ background: p.tone }}>{p.name[0]}</span>
                <span className="block text-[13px] font-bold leading-tight">{p.name}</span>
                <span className="mt-1 flex items-center justify-between text-[13px] font-extrabold text-brand-ink">
                  {rs(p.price)}
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand text-deep"><Icon name="plus" size={13} strokeWidth={2.8} /></span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-2xl bg-mist p-4">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-wider text-muted">Cart</p>
          <ul className="min-h-[120px] flex-1 space-y-2">
            {lines.length === 0 && <li className="py-6 text-center text-[13px] text-muted">Cart is empty. Tap a product to add it.</li>}
            {lines.map((p) => (
              <li key={p.id} className="fade-in flex items-center gap-2 rounded-xl bg-white p-2">
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{p.name}</span>
                <RoundBtn label={`Decrease ${p.name}`} onClick={() => change(p.id, -1)}><Icon name="minus" size={14} /></RoundBtn>
                <span className="w-5 text-center text-[13px] font-extrabold" aria-live="polite">{cart[p.id]}</span>
                <RoundBtn label={`Increase ${p.name}`} onClick={() => change(p.id, 1)}><Icon name="plus" size={14} /></RoundBtn>
                <span className="w-16 text-right text-[13px] font-extrabold">{rs(p.price * cart[p.id])}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Discount">
            <Pill active={discount === 'none'} onClick={() => setDiscount('none')}>No discount</Pill>
            <Pill active={discount === 'pct'} onClick={() => setDiscount('pct')}>10% off</Pill>
            <Pill active={discount === 'fixed'} onClick={() => setDiscount('fixed')}>Rs 100 off</Pill>
          </div>

          <dl className="mt-4 space-y-1 text-[13px]">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-semibold">{rs(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Discount</dt><dd className="font-semibold text-brand-ink">−{rs(off)}</dd></div>
            <div className="flex items-baseline justify-between border-t border-line pt-2"><dt className="font-bold">Total</dt><dd key={total} className="bump text-[24px] font-extrabold">{rs(total)}</dd></div>
          </dl>

          <button type="button" disabled={subtotal === 0} onClick={() => { setInvoice(`INV-${String(1042 + Math.floor(total % 90)).padStart(4, '0')}`); setCart({}); setDiscount('none'); }} className="btn btn-dark mt-4 w-full disabled:opacity-40">
            Generate invoice
          </button>
          <p role="status" className="mt-2 min-h-5 text-center text-[13px] font-bold text-brand-ink">{invoice ? `Invoice ${invoice} generated` : ''}</p>
        </div>
      </div>
    </DemoFrame>
  );
}
