'use client';

import { useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { BUCKET_LABELS, CATEGORIES, INITIAL_STOCK, LOW_STOCK_AT, METHODS, PRODUCTS } from '@/lib/demo/data';
import { available, averageOrder, cartCount, cartTotal } from '@/lib/demo/reducer';
import type { Product } from '@/lib/demo/types';
import { rs } from '@/lib/site';
import { useDemo } from './DemoProvider';
import { ProductPhoto } from './ProductPhoto';

/** Zinggo Merchant demo screens, styled after the real app (teal header, white cards, rounded pills). */

const scroller = 'hide-scroll h-full overflow-y-auto overscroll-contain';
const methodLabel = (id: string) => METHODS.find((m) => m.id === id)?.label ?? id;

function Header({ title, sub, onBack, right }: { title: string; sub?: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 pb-2 pt-2">
      <div className="flex items-center gap-2">
        {onBack && (
          <button type="button" onClick={onBack} aria-label="Back" className="grid h-8 w-8 place-items-center rounded-full bg-black/5 transition-transform active:scale-90">
            <Icon name="back" size={15} strokeWidth={2.4} />
          </button>
        )}
        <div>
          <h3 className="text-[19px] font-extrabold leading-tight tracking-tight">{title}</h3>
          {sub && <p className="text-[11px] text-[#66716F]">{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

function Thumb({ p, size = 36 }: { p: Product; size?: number }) {
  return <ProductPhoto p={p} className="shrink-0 rounded-xl" style={{ width: size, height: size }} />;
}

const Num = ({ v, className = '' }: { v: string | number; className?: string }) => <span key={String(v)} className={`bump inline-block ${className}`}>{v}</span>;

/* ───────── Home ───────── */
export function HomeView() {
  const { state, dispatch } = useDemo();
  const low = PRODUCTS.filter((p) => state.stock[p.id] <= LOW_STOCK_AT).length;
  const recent = state.sales.slice(0, 2);
  return (
    <div className={`${scroller} bg-[#F5F5F5]`}>
      <div className="rounded-b-[26px] bg-gradient-to-b from-[#00CCC0] to-[#00A9A1] px-4 pb-14 pt-[50px] text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-white/80">Welcome back!</p>
            <p className="text-[19px] font-extrabold leading-tight tracking-tight">Al-Noor Kitchen</p>
            <p className="text-[10.5px] text-white/75">Restaurant · Demo store</p>
          </div>
          <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/20"><Icon name="bell" size={18} /></span>
        </div>
      </div>

      <div className="-mt-11 space-y-2 px-3 pb-4">
        <div className="rounded-2xl bg-white p-3.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]">
          <p className="text-[11px] font-medium text-[#66716F]">Today&apos;s Sales</p>
          <p className="text-[26px] font-extrabold leading-tight tracking-tight"><Num v={rs(state.totals.amount)} /></p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[['Orders', state.totals.orders], ['Avg. order', rs(averageOrder(state))], ['Low stock', low]].map(([l, v]) => (
              <div key={l as string} className="rounded-xl bg-[#F5F5F5] py-2 text-center">
                <p className="text-[13px] font-extrabold"><Num v={v} /></p>
                <p className="text-[9.5px] text-[#66716F]">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="px-1 pt-1 text-[14px] font-extrabold">Live Orders</p>
        {recent.map((s, i) => (
          <div key={s.no} className={`rounded-2xl border-l-4 border-[#ffd64d] bg-white p-3 shadow-sm ${i === 0 && state.lastSale?.no === s.no ? 'pop-in' : ''}`}>
            <div className="flex items-start justify-between">
              <p className="text-[13px] font-extrabold">Order {s.no}</p>
              <p className="text-[13px] font-extrabold">{rs(s.total)}</p>
            </div>
            <span className="mt-1 inline-flex items-center gap-1 rounded-lg bg-[#F0F2F2] px-2 py-1 text-[10px] font-bold text-[#555]"><Icon name="pos" size={11} /> POS</span>
            <p className="mt-1 text-[11px] text-[#66716F]">{s.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')} · {s.time}</p>
            <p className="mt-1 text-[11px] font-bold">● Completed · {methodLabel(s.method)}</p>
          </div>
        ))}

        <div className="rounded-2xl border border-[#bfeeea] bg-[#E6F9F8] p-3.5">
          <p className="text-[15px] font-extrabold">Point of Sale</p>
          <p className="text-[11px] text-[#4b5b59]">Create an in-store order and bill your customer.</p>
          <button type="button" data-demo="home-pos" onClick={() => dispatch({ type: 'NAV', view: 'pos' })} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#00CCC0] py-3 text-[13px] font-extrabold text-[#003836] transition-transform active:scale-[0.97]">
            <Icon name="plus" size={15} strokeWidth={2.6} /> Start POS Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── POS ───────── */
export function PosView() {
  const { state, dispatch } = useDemo();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All');
  const items = PRODUCTS.filter((p) => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase()));
  const count = cartCount(state);
  return (
    <div className="relative h-full bg-[#F5F5F5]">
      <div className={scroller}>
        <Header title="POS" right={<span className="grid h-8 w-8 place-items-center rounded-full bg-[#E6F9F8] text-[#00706b]"><Icon name="scan" size={16} /></span>} />
        <div className="px-3 pb-24">
          <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm">
            <Icon name="search" size={15} className="text-[#66716F]" />
            <span className="sr-only">Search products</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#8a9492]" />
          </label>
          <div className="hide-scroll -mx-3 mt-2 flex gap-1.5 overflow-x-auto px-3">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={c === cat} className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${c === cat ? 'bg-[#00CCC0] text-[#003836]' : 'bg-white text-[#555]'}`}>{c}</button>
            ))}
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {items.map((p) => {
              const left = available(state, p.id);
              const out = state.stock[p.id] <= 0;
              return (
                <article key={p.id} className={`relative rounded-2xl bg-white p-2.5 shadow-sm ${out ? 'opacity-60' : ''}`}>
                  <button type="button" data-demo={`product-${p.id}`} disabled={left <= 0} onClick={() => dispatch({ type: 'OPEN_PRODUCT', id: p.id })} aria-label={`Open ${p.name}`} className="absolute inset-0 rounded-2xl" />
                  <ProductPhoto p={p} className="h-[86px] w-full rounded-xl" />
                  <p className="mt-2 text-[12px] font-bold leading-tight">{p.name}</p>
                  <p className={`text-[10px] ${out ? 'font-bold text-[#c62a2a]' : 'text-[#66716F]'}`}>{out ? 'Sold out' : `${state.stock[p.id]} in stock`}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <p className="text-[12px] font-extrabold text-[#00706b]">{rs(p.price)}</p>
                    <button type="button" data-demo={`add-${p.id}`} disabled={left <= 0} onClick={() => dispatch({ type: 'ADD', id: p.id })} aria-label={`Add ${p.name} to cart`} className="relative z-10 grid h-7 w-7 place-items-center rounded-lg bg-[#00CCC0] text-[#003836] transition-transform active:scale-90 disabled:bg-[#e3e8e7] disabled:text-[#9aa5a3]">
                      <Icon name="plus" size={14} strokeWidth={2.8} />
                    </button>
                  </div>
                  {(state.cart[p.id] ?? 0) > 0 && <span className="pop-in absolute right-2 top-2 rounded-full bg-[#003836] px-1.5 py-0.5 text-[9.5px] font-extrabold text-white">{state.cart[p.id]}</span>}
                </article>
              );
            })}
            {items.length === 0 && <p className="col-span-2 py-10 text-center text-[12px] text-[#66716F]">No products match.</p>}
          </div>
        </div>
      </div>

      {count > 0 && (
        <div className="slide-up absolute inset-x-3 bottom-3 z-20">
          <button type="button" data-demo="cart-bar" onClick={() => dispatch({ type: 'GO_CHECKOUT' })} className="flex w-full items-center justify-between rounded-full bg-[#003836] py-2 pl-5 pr-2 text-left text-white shadow-xl transition-transform active:scale-[0.98]">
            <span>
              <span className="block text-[10px] text-white/60">{count} item{count > 1 ? 's' : ''} in cart</span>
              <span className="block text-[15px] font-extrabold leading-none"><Num v={rs(cartTotal(state))} /></span>
            </span>
            <span className="rounded-full bg-[#00CCC0] px-5 py-2.5 text-[12px] font-extrabold text-[#003836]">View cart</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ───────── Product sheet (bottom sheet over POS) ───────── */
export function ProductSheet() {
  const { state, dispatch } = useDemo();
  const p = PRODUCTS.find((x) => x.id === state.sheet);
  if (!p) return null;
  return (
    <div className="absolute inset-0 z-30" role="dialog" aria-label={`${p.name} details`}>
      <button type="button" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_SHEET' })} className="fade-in absolute inset-0 bg-black/40" />
      <div className="slide-up absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-4 pb-5 pt-3 shadow-2xl">
        <span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-[#dfe6e4]" />
        <ProductPhoto p={p} className="mb-3 h-[132px] w-full rounded-2xl" />
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-extrabold leading-tight">{p.name}</p>
            <p className="text-[11px] text-[#66716F]">{p.category} · per {p.unit} · {available(state, p.id)} available</p>
          </div>
          <p className="text-[16px] font-extrabold text-[#00706b]">{rs(p.price)}</p>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F5F5F5] px-3 py-2">
          <span className="text-[12px] font-bold">Quantity</span>
          <span className="flex items-center gap-3">
            <button type="button" data-demo="sheet-minus" onClick={() => dispatch({ type: 'SHEET_QTY', delta: -1 })} aria-label="Decrease quantity" className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-sm transition-transform active:scale-90"><Icon name="minus" size={14} /></button>
            <Num v={state.sheetQty} className="w-5 text-center text-[16px] font-extrabold" />
            <button type="button" data-demo="sheet-plus" onClick={() => dispatch({ type: 'SHEET_QTY', delta: 1 })} aria-label="Increase quantity" className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-sm transition-transform active:scale-90"><Icon name="plus" size={14} /></button>
          </span>
        </div>
        <button type="button" data-demo="sheet-add" onClick={() => dispatch({ type: 'ADD_FROM_SHEET' })} className="mt-3 w-full rounded-full bg-[#00CCC0] py-3.5 text-[13px] font-extrabold text-[#003836] transition-transform active:scale-[0.98]">
          Add to cart · {rs(p.price * state.sheetQty)}
        </button>
      </div>
    </div>
  );
}

/* ───────── Checkout ───────── */
export function CheckoutView() {
  const { state, dispatch } = useDemo();
  const lines = PRODUCTS.filter((p) => (state.cart[p.id] ?? 0) > 0);
  const ref = state.payment && state.payment !== 'cash';
  return (
    <div className={`${scroller} bg-[#F5F5F5]`}>
      <Header title="Checkout" onBack={() => dispatch({ type: 'NAV', view: 'pos' })} />
      <div className="space-y-2 px-3 pb-6">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          {lines.map((p) => (
            <div key={p.id} className="flex items-center gap-2 border-b border-[#edf1f0] py-2 last:border-0">
              <Thumb p={p} size={30} />
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-bold leading-tight">{p.name}</p>
                <p className="text-[10px] text-[#66716F]">{rs(p.price)}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#F5F5F5] px-1 py-0.5">
                <button type="button" onClick={() => dispatch({ type: 'SET_QTY', id: p.id, qty: (state.cart[p.id] ?? 0) - 1 })} aria-label={`Decrease ${p.name}`} className="grid h-6 w-6 place-items-center rounded-full bg-white"><Icon name="minus" size={11} /></button>
                <Num v={state.cart[p.id]} className="w-4 text-center text-[12px] font-extrabold" />
                <button type="button" onClick={() => dispatch({ type: 'SET_QTY', id: p.id, qty: (state.cart[p.id] ?? 0) + 1 })} aria-label={`Increase ${p.name}`} className="grid h-6 w-6 place-items-center rounded-full bg-white"><Icon name="plus" size={11} /></button>
              </span>
              <p className="w-[52px] shrink-0 text-right text-[11.5px] font-extrabold">{rs(p.price * (state.cart[p.id] ?? 0))}</p>
            </div>
          ))}
          <div className="mt-1 flex items-baseline justify-between border-t border-dashed border-[#dfe6e4] pt-2">
            <span className="text-[12px] font-semibold text-[#66716F]">Total</span>
            <span className="text-[22px] font-extrabold tracking-tight"><Num v={rs(cartTotal(state))} /></span>
          </div>
        </div>

        <p className="px-1 pt-1 text-[12px] font-extrabold">Payment method</p>
        <div className="grid grid-cols-2 gap-2">
          {METHODS.map((m) => {
            const on = state.payment === m.id;
            return (
              <button key={m.id} type="button" data-demo={`pay-${m.id}`} aria-pressed={on} onClick={() => dispatch({ type: 'SELECT_PAYMENT', method: m.id })} className={`rounded-xl border-2 bg-white p-2.5 text-left shadow-sm transition-[border-color,background-color,transform] duration-200 active:scale-[0.97] ${on ? 'border-[#00CCC0] bg-[#E6F9F8]' : 'border-transparent'}`}>
                <p className="text-[12px] font-bold">{m.label}</p>
                <p className="text-[9.5px] text-[#66716F]">{m.id === 'cash' ? 'Collect at counter' : 'Record reference'}</p>
              </button>
            );
          })}
        </div>

        {ref && (
          <div className="pop-in rounded-xl bg-white p-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#66716F]">Payment reference</p>
            <p className="text-[14px] font-extrabold tracking-wide">{`${METHODS.find((m) => m.id === state.payment)?.prefix}-${87189 + state.nextNo}`}</p>
            <p className="mt-1 text-[9.5px] leading-snug text-[#66716F]">Zinggo records the reference you enter. It does not process the payment.</p>
          </div>
        )}

        <button type="button" data-demo="complete" disabled={!state.payment} onClick={() => dispatch({ type: 'COMPLETE' })} className="w-full rounded-full bg-[#00CCC0] py-3.5 text-[13px] font-extrabold text-[#003836] transition-[transform,opacity] active:scale-[0.98] disabled:opacity-40">
          {state.payment ? 'Complete sale' : 'Choose a payment method'}
        </button>
      </div>
    </div>
  );
}

/* ───────── Receipt ───────── */
export function ReceiptView() {
  const { state, dispatch } = useDemo();
  const s = state.lastSale;
  if (!s) return null;
  return (
    <div className={`${scroller} bg-gradient-to-b from-[#E6F9F8] to-[#F5F5F5] px-4 pb-6 pt-2 text-center`}>
      <span className="pop-in mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#00CCC0] text-[#003836] shadow-[0_0_0_10px_rgba(0,204,192,0.2)]"><Icon name="check" size={30} strokeWidth={3} /></span>
      <h3 className="mt-3 text-[20px] font-extrabold tracking-tight">Sale Completed!</h3>
      <p className="text-[26px] font-extrabold tracking-tight text-[#00706b]">{rs(s.total)}</p>
      <p className="mt-1 inline-block rounded-full bg-white px-3 py-1 text-[11px] font-bold shadow-sm">Invoice generated</p>
      <div className="slide-up mt-4 rounded-2xl bg-white p-3.5 text-left shadow-[0_14px_30px_-14px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between"><p className="text-[12px] font-extrabold">Al-Noor Kitchen</p><p className="text-[10px] font-semibold text-[#66716F]">{s.no}</p></div>
        <div className="my-2 border-t border-dashed border-[#dfe6e4]" />
        {s.lines.map((l) => <div key={l.id} className="flex justify-between py-0.5 text-[11px]"><span>{l.qty} × {l.name}</span><span className="font-bold">{rs(l.qty * l.price)}</span></div>)}
        <div className="my-2 border-t border-dashed border-[#dfe6e4]" />
        <div className="flex justify-between text-[13px] font-extrabold"><span>Total</span><span>{rs(s.total)}</span></div>
        <p className="mt-1 text-[10px] text-[#66716F]">Paid via {methodLabel(s.method)}{s.reference ? ` · Ref ${s.reference}` : ''}</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" data-demo="receipt-orders" onClick={() => dispatch({ type: 'NAV', view: 'orders' })} className="rounded-full border-2 border-[#003836] py-2.5 text-[12px] font-extrabold transition-transform active:scale-[0.97]">View orders</button>
        <button type="button" onClick={() => dispatch({ type: 'NAV', view: 'pos' })} className="rounded-full bg-[#003836] py-2.5 text-[12px] font-extrabold text-white transition-transform active:scale-[0.97]">New sale</button>
      </div>
    </div>
  );
}

/* ───────── Orders / sales history ───────── */
export function OrdersView() {
  const { state } = useDemo();
  return (
    <div className={`${scroller} bg-[#F5F5F5]`}>
      <Header title="Orders" sub="Sales history" />
      <div className="space-y-2 px-3 pb-4">
        {state.sales.map((s) => {
          const fresh = state.lastSale?.no === s.no;
          return (
            <article key={s.no} className={`rounded-2xl border-l-4 bg-white p-3 shadow-sm ${fresh ? 'pop-in border-[#00CCC0]' : 'border-[#ffd64d]'}`}>
              <div className="flex items-start justify-between">
                <p className="text-[13px] font-extrabold">Order {s.no}</p>
                <p className="text-[13px] font-extrabold">{rs(s.total)}</p>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0F2F2] px-2 py-1 text-[10px] font-bold text-[#555]"><Icon name="pos" size={11} /> POS</span>
                {fresh && <span className="rounded-lg bg-[#E6F9F8] px-2 py-1 text-[10px] font-bold text-[#00706b]">New</span>}
              </div>
              <p className="mt-1 text-[11px] text-[#66716F]">{s.customer} · {s.lines.map((l) => `${l.qty}× ${l.name}`).join(', ')}</p>
              <p className="mt-1 flex justify-between text-[11px]"><span className="font-bold">● Completed · {methodLabel(s.method)}{s.reference ? ` · ${s.reference}` : ''}</span><span className="text-[#66716F]">{s.time}</span></p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── Catalog / inventory ───────── */
export function CatalogView() {
  const { state } = useDemo();
  const low = PRODUCTS.filter((p) => state.stock[p.id] <= LOW_STOCK_AT).length;
  return (
    <div className={`${scroller} bg-[#F5F5F5]`}>
      <Header title="Catalog" sub="Inventory" right={low > 0 ? <span className="rounded-full bg-[#fdeaea] px-2.5 py-1 text-[10.5px] font-bold text-[#c62a2a]">{low} low stock</span> : undefined} />
      <div className="space-y-2 px-3 pb-4">
        {PRODUCTS.map((p) => {
          const n = state.stock[p.id];
          const sold = INITIAL_STOCK[p.id] - n;
          const isLow = n <= LOW_STOCK_AT;
          return (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm">
              <Thumb p={p} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-bold">{p.name}</p>
                <p className={`text-[10.5px] ${isLow ? 'font-bold text-[#c62a2a]' : 'text-[#66716F]'}`}>{isLow ? 'Low stock' : 'In stock'} · {rs(p.price)}</p>
              </div>
              <div className="text-right">
                <p className={`text-[19px] font-extrabold leading-none ${isLow ? 'text-[#c62a2a]' : ''}`}><Num v={n} /></p>
                {sold > 0 && <p className="pop-in mt-0.5 text-[10px] font-bold text-[#c62a2a]">−{sold} today</p>}
              </div>
            </div>
          );
        })}
        <p className="px-1 pt-1 text-[10px] text-[#8a9492]">Stock drops automatically when a sale is completed.</p>
      </div>
    </div>
  );
}

/* ───────── Reports ───────── */
export function ReportsView() {
  const { state } = useDemo();
  const t = state.totals;
  const max = Math.max(...t.buckets);
  return (
    <div className={`${scroller} bg-[#F5F5F5]`}>
      <Header title="Reports" sub="Today" />
      <div className="space-y-2 px-3 pb-4">
        <div className="rounded-2xl bg-white p-3.5 shadow-sm">
          <div className="flex items-end justify-between">
            <div><p className="text-[11px] text-[#66716F]">Sales</p><p className="text-[24px] font-extrabold leading-tight tracking-tight"><Num v={rs(t.amount)} /></p></div>
            <div className="text-right"><p className="text-[11px] text-[#66716F]">Orders</p><p className="text-[18px] font-extrabold"><Num v={t.orders} /></p></div>
          </div>
          <div className="mt-3 flex h-20 items-end gap-1.5" aria-label="Sales by time of day" role="img">
            {t.buckets.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className={`w-full rounded-t-md transition-[height,background-color] duration-700 [transition-timing-function:var(--ease-panel)] ${i === t.buckets.length - 1 ? 'bg-[#00CCC0]' : 'bg-[#00CCC0]/40'}`} style={{ height: `${Math.round((v / max) * 64)}px` }} />
                <span className="text-[8.5px] text-[#8a9492]">{BUCKET_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-3.5 shadow-sm">
          <p className="mb-2 text-[12px] font-extrabold">By payment type</p>
          {METHODS.map((m) => {
            const v = t.byMethod[m.id];
            const pct = Math.round((v / t.amount) * 100);
            return (
              <div key={m.id} className="mb-2 last:mb-0">
                <div className="mb-1 flex justify-between text-[11px] font-semibold"><span>{m.label}</span><span>{rs(v)} · {pct}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-[#e8eeed]"><div className="h-full rounded-full bg-[#00CCC0] transition-[width] duration-700 [transition-timing-function:var(--ease-panel)]" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
        <p className="px-1 text-[10px] text-[#8a9492]">Demo data. Payment types are recorded references, not processed payments.</p>
      </div>
    </div>
  );
}
