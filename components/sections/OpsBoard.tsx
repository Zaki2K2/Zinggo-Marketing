'use client';

import { useRef, type ReactNode } from 'react';
import { useDemo, usePresence } from '@/components/demo/DemoProvider';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { BUCKET_LABELS, INITIAL_STOCK, LOW_STOCK_AT, METHODS, PRODUCTS } from '@/lib/demo/data';
import { averageOrder, cartCount, cartTotal, phaseOf } from '@/lib/demo/reducer';
import { GROUPS } from '@/lib/demo/script';
import { rs } from '@/lib/site';

/**
 * "See Zinggo operate": a wide presentation of the SAME demo state that drives the hero phone.
 * Complete a sale in the phone (or press Run a sale) and the sale, stock and day totals below all follow.
 */

const Num = ({ v, className = '' }: { v: string | number; className?: string }) => <span key={String(v)} className={`bump inline-block ${className}`}>{v}</span>;

function Col({ title, tag, children }: { title: string; tag?: ReactNode; children: ReactNode }) {
  return (
    <section aria-label={title} className="p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="label text-muted">{title}</h3>
        {tag}
      </div>
      {children}
    </section>
  );
}

export function OpsBoard() {
  const { state, replay, pause, play, running, playing, manual, group } = useDemo();
  const root = useRef<HTMLElement>(null);
  usePresence(root, 0.15);

  const phase = phaseOf(state);
  const sale = state.lastSale;
  const cartLines = PRODUCTS.filter((p) => (state.cart[p.id] ?? 0) > 0).map((p) => ({ id: p.id, name: p.name, qty: state.cart[p.id], price: p.price }));
  const showCart = cartLines.length > 0;
  const lines = showCart ? cartLines : sale?.lines ?? [];
  const total = showCart ? cartTotal(state) : sale?.total ?? 0;
  const t = state.totals;
  const max = Math.max(...t.buckets);

  const doneN = sale ? 5 : phase === 'paying' ? 1 : 0;
  const activeChip = manual ? (sale ? 4 : phase === 'paying' ? 1 : phase === 'cart' ? 0 : -1) : group;
  const isLive = running || (playing && !manual);

  return (
    <section ref={root} id="why-zinggo" aria-labelledby="ops-title" className="on-light relative -mt-10 scroll-mt-20 rounded-t-[40px] bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-10">
        <Reveal className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr] lg:items-end">
          <div>
            <p className="t-eyebrow text-brand-ink">See Zinggo operate</p>
            <h2 id="ops-title" className="mt-4 text-[clamp(36px,4.6vw,72px)] font-extrabold leading-[0.96] tracking-[-0.055em]">One sale.<br />Every number follows.</h2>
          </div>
          <div>
            <p className="t-body text-muted">This board reads the same live demo as the phone. Make a sale there, or run one here, and watch the sale, stock and today’s totals update together.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={replay} className="btn btn-dark btn-sm"><Icon name="replay" size={15} /> Run a sale</button>
              <button type="button" onClick={() => (isLive ? pause() : play())} className="btn btn-sm border-[1.5px] border-line bg-white text-ink hover:border-ink">
                <Icon name={isLive ? 'pause' : 'play'} size={14} strokeWidth={2.4} /> {isLive ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-[32px] border border-line bg-white shadow-lift">
            {/* progress strip */}
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-line bg-mist px-6 py-4 sm:px-8" aria-label="Sale progress">
              {GROUPS.map((g, i) => {
                const done = i < doneN || (manual ? false : group > i);
                const on = i === activeChip;
                return (
                  <li key={g.key} className="flex items-center gap-2">
                    <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold transition-[background-color,color] duration-500 ${done ? 'bg-brand text-deep' : on ? 'bg-ink text-white' : 'bg-line text-muted'}`}>{done ? '✓' : i + 1}</span>
                    <span className={`text-[13px] font-semibold transition-colors duration-500 ${on || done ? 'text-ink' : 'text-muted'}`}>{g.label}</span>
                    {i < GROUPS.length - 1 && <span className="mx-1 hidden h-px w-6 bg-line sm:block" aria-hidden="true" />}
                  </li>
                );
              })}
              <li className="ml-auto flex items-center gap-2 text-[12px] font-semibold text-muted">
                <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-brand' : 'bg-line'}`} aria-hidden="true" /> {isLive ? 'Live demo' : manual ? 'Paused: you took over' : 'Paused'}
              </li>
            </ol>

            <div className="grid divide-y divide-line lg:grid-cols-[1.05fr_0.95fr_1.1fr] lg:divide-x lg:divide-y-0">
              <Col title="Sale" tag={<span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${phase === 'done' || (!showCart && sale) ? 'bg-brand-soft text-brand-ink' : 'bg-mist text-muted'}`}>{showCart ? (phase === 'paying' ? 'Taking payment' : `${cartCount(state)} in cart`) : sale ? `${sale.no} completed` : 'No sale yet'}</span>}>
                {lines.length === 0 ? (
                  <p className="py-10 text-[14px] leading-relaxed text-muted">No sale in progress. Add items in the phone, or press Run a sale.</p>
                ) : (
                  <ul className="space-y-2.5 text-[14px]">
                    {lines.map((l) => (
                      <li key={l.id} className="flex justify-between"><span><b className="font-extrabold">{l.qty} ×</b> {l.name}</span><span className="font-bold">{rs(l.qty * l.price)}</span></li>
                    ))}
                  </ul>
                )}
                <div className="mt-5 flex items-baseline justify-between border-t border-dashed border-line pt-4">
                  <span className="text-muted">Total</span>
                  <span className="text-[30px] font-extrabold tracking-tight"><Num v={rs(total)} /></span>
                </div>
                {!showCart && sale && (
                  <p className="mt-2 text-[13px] font-semibold text-brand-ink">Paid via {METHODS.find((m) => m.id === sale.method)?.label}{sale.reference ? ` · Reference ${sale.reference}` : ''} · invoice generated</p>
                )}
              </Col>

              <Col title="Stock" tag={<span className="text-[12px] font-semibold text-muted">{PRODUCTS.filter((p) => state.stock[p.id] <= LOW_STOCK_AT).length} low</span>}>
                <ul className="space-y-2.5">
                  {PRODUCTS.map((p) => {
                    const n = state.stock[p.id];
                    const sold = INITIAL_STOCK[p.id] - n;
                    const low = n <= LOW_STOCK_AT;
                    return (
                      <li key={p.id} className="flex items-center justify-between text-[14px]">
                        <span className="font-semibold">{p.name}</span>
                        <span className="flex items-center gap-2">
                          {sold > 0 && <span className="pop-in text-[12px] font-bold text-danger">−{sold}</span>}
                          <span className={`w-8 text-right text-[16px] font-extrabold ${low ? 'text-danger' : ''}`}><Num v={n} /></span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Col>

              <Col title="Today" tag={<span className="text-[12px] font-semibold text-muted">Avg. order {rs(averageOrder(state))}</span>}>
                <div className="flex items-end justify-between">
                  <div><p className="text-[13px] text-muted">Sales</p><p className="text-[30px] font-extrabold leading-none tracking-tight"><Num v={rs(t.amount)} /></p></div>
                  <div className="text-right"><p className="text-[13px] text-muted">Orders</p><p className="text-[22px] font-extrabold leading-none"><Num v={t.orders} /></p></div>
                </div>
                <div className="mt-5 flex h-24 items-end gap-2" role="img" aria-label="Sales by time of day">
                  {t.buckets.map((v, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <span className={`w-full rounded-t-md transition-[height,background-color] duration-700 [transition-timing-function:var(--ease-panel)] ${i === t.buckets.length - 1 ? 'bg-brand' : 'bg-brand/35'}`} style={{ height: `${Math.round((v / max) * 76)}px` }} />
                      <span className="text-[10px] text-muted">{BUCKET_LABELS[i]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                  {METHODS.map((m) => (
                    <div key={m.id} className="rounded-xl bg-mist py-2">
                      <p className="text-[13px] font-extrabold"><Num v={`${Math.round((t.byMethod[m.id] / t.amount) * 100)}%`} /></p>
                      <p className="text-[10px] text-muted">{m.label}</p>
                    </div>
                  ))}
                </div>
              </Col>
            </div>
          </div>
          <p className="mt-4 text-[13px] text-muted">Demo data in a self-contained simulation; nothing here touches real merchant or customer data. Payments are recorded as references, not processed.</p>
        </Reveal>
      </div>
    </section>
  );
}
