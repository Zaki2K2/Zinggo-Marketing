'use client';

import { useDemo } from '@/components/demo/DemoProvider';
import { GROUPS } from '@/lib/demo/script';

/** Left-column tracker: shows which part of the sale the phone is on and lets visitors jump to it. */
export function HeroTracker() {
  const { group, manual, seek } = useDemo();
  return (
    <div className="fade-in" style={{ '--d': '1100ms' } as React.CSSProperties}>
      <p className="label mb-3 text-white/40">{manual ? 'Jump to a part of the sale' : 'Happening in the app'}</p>
      <ol className="flex flex-wrap gap-x-1 gap-y-2 lg:flex-col lg:gap-1.5">
        {GROUPS.map((g, i) => {
          const on = !manual && group === i;
          const done = !manual && group > i;
          return (
            <li key={g.key}>
              <button type="button" onClick={() => seek(g.from)} aria-current={on ? 'step' : undefined} className="group flex items-center gap-3 rounded-full py-1 pr-3 text-left">
                <span className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] font-bold transition-[background-color,border-color,color] duration-500 ${on ? 'border-brand bg-brand text-deep' : done ? 'border-brand/60 text-brand' : 'border-white/20 text-white/40 group-hover:border-white/50'}`}>{done ? '✓' : i + 1}</span>
                <span className={`text-[14px] font-semibold transition-colors duration-500 ${on ? 'text-white' : 'text-white/45 group-hover:text-white/80'}`}>{g.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
