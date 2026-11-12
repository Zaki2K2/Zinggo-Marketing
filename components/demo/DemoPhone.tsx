'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Tab } from '@/lib/demo/types';
import { usePresence, useDemo } from './DemoProvider';
import { PhoneIntro } from './PhoneIntro';
import { CatalogView, CheckoutView, HomeView, OrdersView, PosView, ProductSheet, ReceiptView, ReportsView } from './screens';

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Home', icon: 'store' },
  { id: 'orders', label: 'Orders', icon: 'orders' },
  { id: 'pos', label: 'POS', icon: 'pos' },
  { id: 'catalog', label: 'Catalog', icon: 'box' },
  { id: 'reports', label: 'Reports', icon: 'chart' },
];

/** Position of an element's centre in the stage's own (untransformed) coordinates. */
function localCenter(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    const p = n.offsetParent as HTMLElement | null;
    if (p && p !== root) { x -= p.scrollLeft; y -= p.scrollTop; x += p.clientLeft; y += p.clientTop; }
    n = p;
  }
  return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
}

const tabOf = (v: string): Tab => (v === 'checkout' || v === 'receipt' ? 'pos' : (v as Tab));

/**
 * The interactive phone. 316x652 design size; scaled with CSS (see .demo-box in globals.css) so it never reflows.
 * Interacting with it hands control to the visitor and stops autoplay.
 */
export function DemoPhone() {
  const { state, dispatch, cursor, running, touch, introDone } = useDemo();
  const box = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  usePresence(box, 0.2);

  // Move the demo cursor onto the element it is about to tap.
  useEffect(() => {
    if (!cursor) return;
    const id = requestAnimationFrame(() => {
      const st = stage.current;
      const el = st?.querySelector<HTMLElement>(`[data-demo="${cursor.target}"]`);
      if (!st || !el) return;
      setPos(localCenter(el, st));
    });
    return () => cancelAnimationFrame(id);
  }, [cursor]);

  const view = state.view;
  const onKey = (e: KeyboardEvent) => { if (introDone && (e.key === 'Enter' || e.key === ' ')) touch(); };

  return (
    <div ref={box} className="demo-box mx-auto">
      <div
        ref={stage}
        className="demo-stage relative h-[652px] w-[316px] rounded-[50px] bg-gradient-to-b from-[#3a3f50] via-[#1a1d29] to-[#0b0c14] p-[9px] shadow-[7px_3px_0_-1px_#2a2e3c,13px_5px_0_-2px_#181b26,0_60px_100px_-30px_rgba(0,0,0,0.9),0_30px_60px_-30px_rgba(0,199,190,0.35),inset_0_0_0_1.5px_rgba(255,255,255,0.14),inset_0_0_0_4px_rgba(0,0,0,0.5)]"
        onPointerDownCapture={introDone ? touch : undefined}
        onKeyDownCapture={onKey}
        role="group"
        aria-label="Interactive Zinggo Merchant demo. Tap or click around the app."
      >
        <span className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-[#252938]" aria-hidden="true" />
        <span className="absolute -left-[3px] top-24 h-9 w-[3px] rounded-l bg-[#252938]" aria-hidden="true" />
        <span className="absolute -left-[3px] top-36 h-14 w-[3px] rounded-l bg-[#252938]" aria-hidden="true" />

        <div className="relative h-full w-full overflow-hidden rounded-[41px] bg-[#F3F6F6] text-[#111716]">
          <PhoneIntro />

          {/* status bar */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-[38px] items-center justify-between px-7 pt-1 text-[11.5px] font-bold" aria-hidden="true">
            <span className={view === 'home' ? 'text-white' : 'text-[#111716]'}>10:16</span>
            <span className="absolute left-1/2 top-[9px] h-[24px] w-[84px] -translate-x-1/2 rounded-full bg-[#05060b]" />
            <span className={`flex items-center gap-1 ${view === 'home' ? 'text-white' : 'text-[#111716]'}`}>
              <span className="h-2 w-3 rounded-[2px] bg-current opacity-80" />
              <span className="rounded-[4px] border border-current px-1 text-[9px] leading-[13px]">84</span>
            </span>
          </div>

          <div ref={screen} className={`absolute inset-x-0 top-0 bottom-[60px] ${view === 'home' ? '' : 'pt-[40px]'}`}>
            <div key={view} className="view-in h-full">
              {view === 'home' && <HomeView />}
              {view === 'pos' && <PosView />}
              {view === 'checkout' && <CheckoutView />}
              {view === 'receipt' && <ReceiptView />}
              {view === 'orders' && <OrdersView />}
              {view === 'catalog' && <CatalogView />}
              {view === 'reports' && <ReportsView />}
            </div>
            <ProductSheet />
          </div>

          {state.lastSale && view === 'receipt' && (
            <div key={state.lastSale.no} role="status" className="demo-toast absolute inset-x-3 top-[46px] z-50 flex items-center gap-2.5 rounded-2xl bg-[#0A081B]/95 px-3 py-2.5 text-white shadow-xl">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#00C7BE] text-[#071B1B]"><Icon name="check" size={16} strokeWidth={3} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-extrabold">Sale recorded</span>
                <span className="block truncate text-[10.5px] text-white/70">{state.lastSale.no} · Rs {state.lastSale.total.toLocaleString('en-PK')}</span>
              </span>
              <span className="text-[10px] text-white/50">now</span>
            </div>
          )}

          <nav aria-label="App tabs" className="absolute inset-x-0 bottom-0 z-30 flex h-[60px] items-start justify-around border-t border-[#e5eae8] bg-white/95 pt-1.5 backdrop-blur">
            {TABS.map((t) => {
              const on = t.id === tabOf(view);
              return (
                <button key={t.id} type="button" data-demo={`tab-${t.id}`} aria-current={on ? 'page' : undefined} onClick={() => dispatch({ type: 'NAV', view: t.id })} className={`flex w-14 flex-col items-center gap-0.5 rounded-xl py-1 text-[9.5px] font-semibold transition-[color,transform] duration-200 active:scale-90 ${on ? 'text-[#00A9A1]' : 'text-[#8a9492]'}`}>
                  <Icon name={t.icon} size={19} strokeWidth={on ? 2.2 : 1.7} />
                  {t.label}
                </button>
              );
            })}
          </nav>

        </div>

        {/* autoplay cursor */}
        {running && pos && (
          <span aria-hidden="true" className="demo-cursor" style={{ transform: `translate3d(${pos.x - 18}px, ${pos.y - 18}px, 0)` }}>
            <span key={cursor?.tick} className="demo-ripple" />
          </span>
        )}
      </div>
    </div>
  );
}
