'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { PhoneFrame, type TabId } from './PhoneFrame';
import { DashboardScreen } from './screens/DashboardScreen';
import { OrderDetailsScreen } from './screens/OrderDetailsScreen';
import { PosScreen } from './screens/PosScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { SaleCompleteScreen } from './screens/SaleCompleteScreen';
import { InventoryScreen } from './screens/InventoryScreen';

type Step = { id: string; label: string; caption: string; ms: number; tab: TabId; render: () => ReactNode };

const STEPS: Step[] = [
  { id: 'dashboard', label: 'Dashboard', caption: 'Start the day with sales, orders and low stock at a glance.', ms: 4200, tab: 'home', render: () => <DashboardScreen /> },
  { id: 'notify', label: 'New order', caption: 'A new order arrives. Open it with a tap.', ms: 3800, tab: 'home', render: () => <DashboardScreen notify /> },
  { id: 'details', label: 'Order details', caption: 'Customer, items, quantities, total and status in one view.', ms: 4200, tab: 'orders', render: () => <OrderDetailsScreen /> },
  { id: 'pos', label: 'Point of sale', caption: 'Add products to the cart and see the running total.', ms: 5400, tab: 'pos', render: () => <PosScreen /> },
  { id: 'checkout', label: 'Checkout', caption: 'Choose cash, Easypaisa, JazzCash or bank and record the payment reference.', ms: 4200, tab: 'pos', render: () => <CheckoutScreen /> },
  { id: 'done', label: 'Sale completed', caption: 'The sale is recorded and an invoice is generated.', ms: 3600, tab: 'pos', render: () => <SaleCompleteScreen /> },
  { id: 'inventory', label: 'Inventory', caption: 'Stock levels update automatically after the sale.', ms: 3800, tab: 'catalog', render: () => <InventoryScreen /> },
  { id: 'back', label: 'Back to dashboard', caption: 'Back on the dashboard, today’s totals already reflect the sale.', ms: 3600, tab: 'home', render: () => <DashboardScreen updated /> },
];

export function HeroMockup() {
  const [step, setStep] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  // Respect prefers-reduced-motion: no autoplay.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) setPlaying(false);
    const onChange = (e: MediaQueryListEvent) => e.matches && setPlaying(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Pause when off-screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause when the tab is hidden.
  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const running = playing && inView && tabVisible;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => {
      setStep((s) => (s + 1) % STEPS.length);
      setRunKey((k) => k + 1);
    }, STEPS[step].ms);
    return () => window.clearTimeout(id);
  }, [running, step, runKey]);

  const go = useCallback((n: number) => {
    setStep((n + STEPS.length) % STEPS.length);
    setRunKey((k) => k + 1);
  }, []);

  const current = STEPS[step];
  const sold = step >= 5;

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-[620px]">
      <div className="relative mx-auto flex h-[552px] justify-center">
        <div className="origin-top scale-[0.92]" data-paused={!running} role="img" aria-label={`Interactive Zinggo Merchant app demonstration. Current step: ${current.label}.`}>
          <PhoneFrame tab={current.tab}>
            <div key={`${step}-${runKey}`} className="screen-enter absolute inset-0">
              {current.render()}
            </div>
          </PhoneFrame>
        </div>

        {/* Floating panels (large screens). All react to the same loop step as the phone. */}
        <aside aria-hidden="true" className="float-y absolute -left-4 top-16 hidden w-[172px] rounded-[20px] border border-white/10 bg-white p-3.5 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] xl:block" style={{ animationPlayState: running ? 'running' : 'paused', animationDelay: '-2s' }}>
          <p className="text-[11px] font-bold text-muted">Orders</p>
          <div className={`mt-2 rounded-xl border px-2.5 py-2 transition-[opacity,transform,background-color,border-color] duration-500 [transition-timing-function:var(--ease-panel)] ${step >= 1 && step <= 5 ? 'border-brand bg-brand-soft opacity-100' : step >= 6 || step === 0 ? 'border-line bg-mist opacity-100' : 'opacity-0'}`}>
            <p className="text-[12px] font-extrabold">#ZG-1042</p>
            <p className="text-[10.5px] text-muted">Hamza Ali · Rs 1,850</p>
            <p className="mt-1 text-[10.5px] font-bold text-brand-ink">{step >= 5 ? 'Completed' : step >= 2 ? 'Accepted' : step === 1 ? 'New' : 'Waiting…'}</p>
          </div>
          <div className="mt-1.5 rounded-xl bg-mist px-2.5 py-2 text-[10.5px] font-semibold text-muted">#ZG-1041 · Ready</div>
        </aside>

        <aside aria-hidden="true" className="float-y absolute bottom-20 -left-4 hidden w-[172px] rounded-[20px] border border-white/10 bg-white p-3.5 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] xl:block" style={{ animationPlayState: running ? 'running' : 'paused', animationDelay: '-4s' }}>
          <p className="text-[11px] font-bold text-muted">Stock</p>
          <div className="mt-2 flex items-center justify-between text-[12px]">
            <span className="font-semibold">Chicken Biryani</span>
            <span key={step >= 6 ? 'b' : 'a'} className={`font-extrabold ${step >= 6 ? 'bump text-brand-ink' : ''}`}>{step >= 6 ? 22 : 24}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[12px]">
            <span className="font-semibold">Masala Fries</span>
            <span className="rounded-full bg-[#fdeaea] px-2 py-0.5 text-[10px] font-bold text-danger">4 left</span>
          </div>
        </aside>

        <aside aria-hidden="true" className={`absolute bottom-36 -right-4 hidden w-[172px] rounded-[20px] border border-white/10 bg-white p-3.5 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-panel)] xl:block ${step >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
          <p className="text-[11px] font-bold text-muted">Payment</p>
          <p className="mt-1 text-[12px] font-extrabold">Easypaisa · Rs 1,850</p>
          <p className="mt-1 flex items-center gap-1 text-[10.5px] font-bold text-brand-ink"><span className="h-1.5 w-1.5 rounded-full bg-brand" />{step >= 5 ? 'Recorded · EP-88231' : 'Recording reference…'}</p>
        </aside>

        <aside aria-hidden="true" className="float-y absolute -right-4 top-4 hidden w-[172px] rounded-[20px] border border-white/10 bg-white p-4 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] xl:block" style={{ animationPlayState: running ? 'running' : 'paused' }}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-muted">Live dashboard</p>
            <span className="flex items-center gap-1 text-[10px] font-bold text-brand-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Online
            </span>
          </div>
          <p key={sold ? 'a' : 'b'} className={`mt-1 text-[26px] font-extrabold tracking-tight ${sold ? 'bump' : ''}`}>
            {sold ? 'Rs 26,700' : 'Rs 24,850'}
          </p>
          <div className="mt-2 flex h-16 items-end gap-1.5">
            {[38, 52, 44, 66, 58, 80, 70, sold ? 96 : 74].map((h, i) => (
              <span key={i} className="flex-1 rounded-t-md bg-brand/80 transition-[height] duration-500 [transition-timing-function:var(--ease-panel)]" style={{ height: `${h}%`, opacity: 0.45 + i * 0.07 }} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-mist py-2">
              <p className="text-[15px] font-extrabold">{sold ? 39 : 38}</p>
              <p className="text-[10px] text-muted">Orders</p>
            </div>
            <div className="rounded-xl bg-mist py-2">
              <p className="text-[15px] font-extrabold">{step >= 6 ? 'Synced' : '4 low'}</p>
              <p className="text-[10px] text-muted">Stock</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Controls */}
      <div className="mx-auto mt-2 max-w-[420px] text-center">
        <p className="t-eyebrow mb-1 text-brand" aria-live="polite">
          Step {step + 1} of {STEPS.length} · {current.label}
        </p>
        <p className="min-h-[44px] text-[14px] leading-snug text-white/70">{current.caption}</p>

        <div className="mt-3 flex items-center justify-center gap-1.5" role="group" aria-label="Demo controls">
          <CtrlButton label="Previous step" onClick={() => go(step - 1)} icon="chevL" />
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause demo' : 'Play demo'}
            className="grid h-12 w-12 place-items-center rounded-full bg-brand text-deep transition-transform duration-150 [transition-timing-function:var(--ease-micro)] active:scale-95"
          >
            <Icon name={playing ? 'pause' : 'play'} size={20} strokeWidth={2.4} />
          </button>
          <CtrlButton label="Next step" onClick={() => go(step + 1)} icon="chevR" />
          <CtrlButton
            label="Replay from start"
            onClick={() => {
              go(0);
              setPlaying(true);
            }}
            icon="replay"
          />
        </div>

        <ol className="mt-4 flex items-center justify-center gap-1.5" aria-label="Demo progress">
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <button type="button" onClick={() => go(i)} aria-label={`Go to step ${i + 1}: ${s.label}`} aria-current={i === step ? 'step' : undefined} className="grid h-6 w-6 place-items-center">
                <span className={`block h-1.5 rounded-full transition-all duration-500 [transition-timing-function:var(--ease-panel)] ${i === step ? 'w-6 bg-brand' : 'w-1.5 bg-white/30 hover:bg-white/60'}`} />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function CtrlButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: 'chevL' | 'chevR' | 'replay' }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-[transform,background-color] duration-150 [transition-timing-function:var(--ease-micro)] hover:bg-white/10 active:scale-95">
      <Icon name={icon} size={18} />
    </button>
  );
}
