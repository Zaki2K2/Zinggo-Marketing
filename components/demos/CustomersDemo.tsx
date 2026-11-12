'use client';

import { useState } from 'react';
import { rs } from '@/lib/site';
import { DemoFrame } from './DemoFrame';

type Tx = { date: string; label: string; amount: number };
type Customer = { id: string; name: string; phone: string; limit: number; credit: number; history: Tx[] };
const START: Customer[] = [
  { id: 'a', name: 'Sana Raza', phone: '0300 ••• 4821', limit: 5000, credit: 1800, history: [{ date: '09 Nov', label: 'Sale #ZG-1031', amount: 1200 }, { date: '04 Nov', label: 'Sale #ZG-1018', amount: 600 }] },
  { id: 'b', name: 'Bilal Traders', phone: '0321 ••• 7710', limit: 20000, credit: 6400, history: [{ date: '10 Nov', label: 'Sale #ZG-1036', amount: 4400 }, { date: '02 Nov', label: 'Sale #ZG-1009', amount: 2000 }] },
  { id: 'c', name: 'Ayesha Khan', phone: '0333 ••• 1209', limit: 3000, credit: 0, history: [{ date: '08 Nov', label: 'Sale #ZG-1027', amount: 950 }] },
];

export function CustomersDemo() {
  const [list, setList] = useState(START);
  const [sel, setSel] = useState('a');
  const c = list.find((x) => x.id === sel) ?? list[0];
  const pct = Math.min(100, Math.round((c.credit / c.limit) * 100));

  const pay = () => {
    const amt = Math.min(500, c.credit);
    if (!amt) return;
    setList((all) => all.map((x) => (x.id === c.id ? { ...x, credit: x.credit - amt, history: [{ date: 'Today', label: 'Payment received', amount: -amt }, ...x.history] } : x)));
  };

  return (
    <DemoFrame title="Customers" subtitle="Demo">
      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <ul className="space-y-2" aria-label="Customers">
          {list.map((x) => (
            <li key={x.id}>
              <button type="button" aria-pressed={x.id === sel} onClick={() => setSel(x.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-[transform,border-color] duration-150 active:scale-[0.98] ${x.id === sel ? 'border-brand-ink bg-brand-soft' : 'border-line hover:border-ink/30'}`}>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/25 text-[13px] font-extrabold text-brand-ink">{x.name.split(' ').map((w) => w[0]).join('')}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-[14px] font-bold">{x.name}</span><span className="block text-[12px] text-muted">{x.credit ? `Owes ${rs(x.credit)}` : 'No balance'}</span></span>
              </button>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl bg-mist p-4" aria-live="polite">
          <p className="text-[18px] font-extrabold">{c.name}</p>
          <p className="text-[13px] text-muted">{c.phone}</p>
          <div className="mt-4 rounded-xl bg-white p-3">
            <div className="flex items-baseline justify-between"><span className="text-[12px] font-semibold text-muted">Credit outstanding</span><span key={c.credit} className="bump text-[20px] font-extrabold">{rs(c.credit)}</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-brand transition-[width] duration-500 [transition-timing-function:var(--ease-panel)]" style={{ width: `${pct}%` }} /></div>
            <p className="mt-1 text-[11px] text-muted">{pct}% of {rs(c.limit)} credit limit</p>
          </div>
          <button type="button" onClick={pay} disabled={c.credit === 0} className="btn btn-dark btn-sm mt-3 w-full disabled:opacity-40">Record Rs 500 payment</button>
          <p className="mb-1 mt-4 text-[12px] font-bold uppercase tracking-wider text-muted">History</p>
          <ul className="divide-y divide-line rounded-xl bg-white px-3">
            {c.history.map((h, i) => (
              <li key={`${h.label}${i}`} className={`flex items-center justify-between py-2.5 text-[13px] ${i === 0 ? 'fade-in' : ''}`}><span><span className="font-semibold">{h.label}</span><span className="ml-2 text-[11px] text-muted">{h.date}</span></span><span className={`font-extrabold ${h.amount < 0 ? 'text-brand-ink' : ''}`}>{h.amount < 0 ? '−' : ''}{rs(Math.abs(h.amount))}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </DemoFrame>
  );
}
