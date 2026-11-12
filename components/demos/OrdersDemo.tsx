'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { rs } from '@/lib/site';
import { DemoFrame, Pill } from './DemoFrame';

const STATUSES = ['New', 'Preparing', 'Ready', 'Completed'] as const;
type Status = (typeof STATUSES)[number];
type Order = { id: string; customer: string; channel: string; items: [string, number, number][]; status: Status };

const START: Order[] = [
  { id: 'ZG-1042', customer: 'Hamza Ali', channel: 'Online', status: 'New', items: [['Chicken Biryani', 2, 450], ['Mint Lemonade', 2, 200]] },
  { id: 'ZG-1041', customer: 'Sana Raza', channel: 'QR · Table 4', status: 'Preparing', items: [['Zinger Burger', 1, 550], ['Masala Fries', 1, 250]] },
  { id: 'ZG-1040', customer: 'Walk-in', channel: 'POS', status: 'Ready', items: [['Tea Leaves 950g', 1, 1260]] },
];
const total = (o: Order) => o.items.reduce((s, [, q, p]) => s + q * p, 0);
const tone: Record<Status, string> = { New: 'bg-[#fff3c4] text-[#8a6200]', Preparing: 'bg-[#e0ecff] text-[#1d4ea8]', Ready: 'bg-brand-soft text-brand-ink', Completed: 'bg-[#e7f7ea] text-[#1c7a34]' };

export function OrdersDemo() {
  const [orders, setOrders] = useState(START);
  const [sel, setSel] = useState(START[0].id);
  const [done, setDone] = useState<string | null>(null);
  const order = orders.find((o) => o.id === sel) ?? orders[0];

  const setStatus = (s: Status) => {
    setOrders((all) => all.map((o) => (o.id === order.id ? { ...o, status: s } : o)));
    setDone(s === 'Completed' ? order.id : null);
  };

  return (
    <DemoFrame title="Orders" subtitle="Demo">
      <div className="grid gap-4 md:grid-cols-[1fr_1.15fr]">
        <ul className="space-y-2" aria-label="Orders">
          {orders.map((o) => (
            <li key={o.id}>
              <button type="button" aria-pressed={o.id === sel} onClick={() => { setSel(o.id); setDone(null); }} className={`w-full rounded-2xl border p-3 text-left transition-[transform,border-color] duration-150 active:scale-[0.98] ${o.id === sel ? 'border-brand-ink bg-brand-soft' : 'border-line hover:border-ink/30'}`}>
                <span className="flex items-center justify-between">
                  <span className="text-[14px] font-extrabold">#{o.id}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${tone[o.status]}`}>{o.status}</span>
                </span>
                <span className="mt-1 flex items-center justify-between text-[12px] text-muted"><span>{o.customer} · {o.channel}</span><span className="font-bold text-ink">{rs(total(o))}</span></span>
              </button>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl bg-mist p-4" aria-live="polite">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-muted">Order details</p>
              <p className="text-[18px] font-extrabold">#{order.id}</p>
              <p className="text-[13px] text-muted">{order.customer} · {order.channel}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${tone[order.status]}`}>{order.status}</span>
          </div>
          <ul className="my-4 divide-y divide-line rounded-xl bg-white px-3">
            {order.items.map(([n, q, p]) => (
              <li key={n} className="flex justify-between py-2.5 text-[13px]"><span>{q} × {n}</span><span className="font-bold">{rs(q * p)}</span></li>
            ))}
            <li className="flex justify-between py-2.5 text-[14px] font-extrabold"><span>Total</span><span>{rs(total(order))}</span></li>
          </ul>
          <p className="mb-2 text-[12px] font-bold uppercase tracking-wider text-muted">Set status</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Order status">
            {STATUSES.map((s) => <Pill key={s} active={order.status === s} onClick={() => setStatus(s)}>{s}</Pill>)}
          </div>
          {done === order.id && (
            <p role="status" className="pop-in mt-4 flex items-center gap-2 rounded-xl bg-[#e7f7ea] p-3 text-[13px] font-bold text-[#1c7a34]">
              <Icon name="check" size={16} strokeWidth={3} /> Order #{order.id} completed. Nicely done!
            </p>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
