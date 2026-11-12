import type { CSSProperties, ReactNode } from 'react';

export const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** Animated finger-tap ripple at a position inside a screen. */
export function Tap({ x, y, delay }: { x: string; y: string; delay: number }) {
  return <span aria-hidden="true" className="tap" style={{ left: x, top: y, ...d(delay) }} />;
}

/** CSS-only value swap: `from` fades out and `to` fades in after `delay` ms. */
export function Swap({ from, to, delay, className = '' }: { from: ReactNode; to: ReactNode; delay: number; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="swap-out inline-block" style={d(delay)}>
        {from}
      </span>
      <span className="swap-in absolute left-0 top-0 inline-block whitespace-nowrap" style={d(delay + 120)}>
        {to}
      </span>
    </span>
  );
}

export function Thumb({ letter, tone }: { letter: string; tone: string }) {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[13px] font-extrabold text-white" style={{ background: tone }}>
      {letter}
    </span>
  );
}

export function ScreenHeader({ title, back = false, right }: { title: string; back?: boolean; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 pb-2 pt-11">
      <div className="flex items-center gap-2">
        {back && (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-black/5" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </span>
        )}
        <h3 className="text-[17px] font-extrabold tracking-tight">{title}</h3>
      </div>
      {right}
    </div>
  );
}

export const ITEMS = [
  { name: 'Chicken Biryani', qty: 2, price: 450, tone: '#e8890c', letter: 'B' },
  { name: 'Zinger Burger', qty: 1, price: 550, tone: '#c0392b', letter: 'Z' },
  { name: 'Mint Lemonade', qty: 2, price: 200, tone: '#1aa37a', letter: 'M' },
] as const;
