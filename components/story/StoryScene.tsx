'use client';

import { useCallback, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { PhoneFrame, type TabId } from '@/components/mockup/PhoneFrame';
import { PosScreen } from '@/components/mockup/screens/PosScreen';
import { CheckoutScreen } from '@/components/mockup/screens/CheckoutScreen';
import { InventoryScreen } from '@/components/mockup/screens/InventoryScreen';
import { ReportsScreen } from '@/components/mockup/screens/ReportsScreen';
import { useScrollProgress } from '@/lib/useScrollProgress';

/**
 * Sticky workflow story: Product scanned -> Sale processed -> Inventory updated -> Reports updated.
 * One phone, four screens that wipe over each other (clip-path + scale, no hard cuts). Scroll position selects the
 * step, so scrolling backwards reverses the wipe. Caption and screen read the same `step`, so they never disagree.
 */

const STEPS: { name: string; text: string; tab: TabId; screen: ReactNode }[] = [
  { name: 'Product scanned', text: 'Scan a barcode or tap a product. It lands in the cart with its price.', tab: 'pos', screen: <PosScreen /> },
  { name: 'Sale processed', text: 'Choose how the customer paid and record the reference.', tab: 'pos', screen: <CheckoutScreen /> },
  { name: 'Inventory updated', text: 'Stock drops automatically, and low stock gets flagged.', tab: 'catalog', screen: <InventoryScreen /> },
  { name: 'Reports updated', text: 'Today’s sales, orders and payment types already include the sale.', tab: 'more', screen: <ReportsScreen /> },
];
const N = STEPS.length;

function Side({ show, side, title, children, y }: { show: boolean; side: 'l' | 'r'; title: string; children: ReactNode; y: string }) {
  return (
    <aside aria-hidden="true" className={`absolute hidden w-[164px] rounded-[20px] border border-white/10 bg-white p-3.5 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-panel)] xl:block ${side === 'l' ? 'left-0' : 'right-0'} ${show ? 'translate-x-0 opacity-100' : side === 'l' ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0'}`} style={{ top: y }}>
      <p className="text-[11px] font-bold text-muted">{title}</p>
      {children}
    </aside>
  );
}

export function StoryScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  // Bumped when a screen is revealed going forward so its entrance animations replay (not on reverse).
  const [gens, setGens] = useState<number[]>(() => STEPS.map(() => 0));
  const last = useRef(0);

  useScrollProgress(wrap, (p) => {
    const s = Math.min(N - 1, Math.floor(p * N));
    if (s === last.current) return;
    if (s > last.current) {
      const from = last.current;
      setGens((g) => g.map((v, i) => (i > from && i <= s ? v + 1 : v)));
    }
    last.current = s;
    setStep(s);
  });

  const jump = useCallback((i: number) => {
    const el = wrap.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.5) / N) * (el.offsetHeight - window.innerHeight), behavior: 'smooth' });
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); jump(Math.min(N - 1, step + 1)); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); jump(Math.max(0, step - 1)); }
  };

  return (
    <section id="why-zinggo" aria-labelledby="story-title" className="on-light relative -mt-10 rounded-t-[40px] bg-paper">
      <div ref={wrap} className="relative" style={{ height: `${N * 85 + 115}vh` }}>
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-5 pt-20 sm:px-8">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
            <div>
              <p className="t-eyebrow text-brand-ink">One workflow, start to finish</p>
              <h2 id="story-title" className="sr-only">How a sale flows through Zinggo: scanned, processed, stocked and reported</h2>

              <ol role="group" tabIndex={0} aria-label="Workflow steps. Use arrow keys to move between steps." onKeyDown={onKey} className="mt-4 space-y-1 rounded-2xl outline-offset-4">
                {STEPS.map((s, i) => (
                  <li key={s.name}>
                    <button type="button" onClick={() => jump(i)} aria-current={i === step ? 'step' : undefined} tabIndex={-1} className="flex w-full items-baseline gap-4 text-left">
                      <span className={`text-[13px] font-bold transition-colors duration-500 ${i === step ? 'text-brand-ink' : 'text-ink/30'}`}>0{i + 1}</span>
                      <span className={`text-[clamp(26px,3.8vw,54px)] font-extrabold leading-[1.05] tracking-[-0.04em] transition-[color,transform] duration-500 [transition-timing-function:var(--ease-panel)] ${i === step ? 'translate-x-2 text-ink' : 'text-ink/25'}`}>{s.name}</span>
                    </button>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-500 [transition-timing-function:var(--ease-panel)] ${i === step ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <p className="t-body overflow-hidden pl-9 text-muted">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-[12px] text-muted">Scroll to move the story. Demo data is fictional.</p>
            </div>

            <div className="relative mx-auto flex h-[470px] w-full max-w-[640px] justify-center sm:h-[620px]">
              <div className="origin-top scale-[0.76] sm:scale-100">
                <PhoneFrame tab={STEPS[step].tab}>
                  {STEPS.map((s, i) => {
                    const shown = i <= step;
                    return (
                      <div
                        key={s.name}
                        className="absolute inset-0 bg-[#F3F6F6] transition-[clip-path,transform,filter] duration-[900ms] [transition-timing-function:var(--ease-panel)]"
                        style={{ zIndex: i, clipPath: shown ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)', transform: i < step ? 'scale(0.94)' : 'none', filter: i < step ? 'brightness(0.92)' : 'none' }}
                      >
                        <div key={gens[i]} className="absolute inset-0">{s.screen}</div>
                      </div>
                    );
                  })}
                </PhoneFrame>
              </div>

              <Side show={step === 0} side="l" title="Scanned" y="90px">
                <p className="mt-1 text-[12px] font-extrabold">3 items · Rs 1,850</p>
                <p className="text-[10.5px] text-muted">Biryani, Burger, Lemonade</p>
              </Side>
              <Side show={step >= 1} side="l" title="Sale" y="270px">
                <p className="mt-1 text-[12px] font-extrabold">Easypaisa · Rs 1,850</p>
                <p className="text-[10.5px] font-bold text-brand-ink">Reference recorded</p>
              </Side>
              <Side show={step >= 2} side="r" title="Stock" y="90px">
                <p className="mt-1 flex justify-between text-[12px]"><span className="font-semibold">Chicken Biryani</span><b>24 → 22</b></p>
                <p className="text-[10.5px] font-bold text-brand-ink">Updated automatically</p>
              </Side>
              <Side show={step >= 3} side="r" title="Today" y="270px">
                <p className="mt-1 text-[16px] font-extrabold">Rs 26,700</p>
                <p className="text-[10.5px] font-bold text-brand-ink">39 orders · includes this sale</p>
              </Side>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
