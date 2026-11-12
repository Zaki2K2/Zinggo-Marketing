'use client';

import { useState } from 'react';
import { rs } from '@/lib/site';
import { DemoFrame, Pill } from './DemoFrame';

const RANGES = {
  Today: { labels: ['9a', '11a', '1p', '3p', '5p', '7p', '9p'], sales: [1200, 3400, 5200, 3100, 4800, 6900, 4200], orders: 38 },
  '7 days': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], sales: [18200, 21400, 19800, 24100, 27800, 33200, 29600], orders: 241 },
  '30 days': { labels: ['W1', 'W2', 'W3', 'W4'], sales: [118000, 126500, 139200, 151800], orders: 1030 },
} as const;
type Range = keyof typeof RANGES;

export function AnalyticsDemo() {
  const [range, setRange] = useState<Range>('7 days');
  const { labels, sales, orders } = RANGES[range];
  const total = sales.reduce((a, b) => a + b, 0);
  const max = Math.max(...sales);
  const W = 400, H = 170, pad = 14;
  const pts = sales.map((v, i) => [pad + (i * (W - pad * 2)) / (sales.length - 1), H - pad - (v / max) * (H - pad * 2)] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0]} ${H} L${pts[0][0]} ${H}Z`;
  const half = Math.floor(sales.length / 2);
  const first = sales.slice(0, half).reduce((a, b) => a + b, 0) / half;
  const last = sales.slice(-half).reduce((a, b) => a + b, 0) / half;
  const trend = Math.round(((last - first) / first) * 100);

  return (
    <DemoFrame title="Reports" subtitle="Demo">
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Date range">
        {(Object.keys(RANGES) as Range[]).map((r) => <Pill key={r} active={r === range} onClick={() => setRange(r)}>{r}</Pill>)}
      </div>

      <div className="grid grid-cols-3 gap-3" aria-live="polite">
        <div className="col-span-3 rounded-2xl bg-night p-4 text-white sm:col-span-1">
          <p className="text-[12px] text-white/60">Revenue</p>
          <p key={range} className="bump text-[22px] font-extrabold tracking-tight">{rs(total)}</p>
        </div>
        <div className="rounded-2xl bg-mist p-4"><p className="text-[12px] text-muted">Orders</p><p className="text-[22px] font-extrabold">{orders.toLocaleString()}</p></div>
        <div className="rounded-2xl bg-brand-soft p-4"><p className="text-[12px] text-muted">Trend</p><p className="text-[22px] font-extrabold text-brand-ink">▲ {trend}%</p></div>
      </div>

      <div className="mt-4 rounded-2xl border border-line p-4">
        <p className="mb-2 text-[12px] font-bold uppercase tracking-wider text-muted">Sales trend</p>
        <svg key={range} viewBox={`0 0 ${W} ${H + 22}`} className="w-full" role="img" aria-label={`Sales trend chart for ${range}, up ${trend} percent`}>
          <defs>
            <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#00C7BE" stopOpacity="0.32" /><stop offset="1" stopColor="#00C7BE" stopOpacity="0" /></linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="#E5EAE8" strokeDasharray="3 5" />)}
          <path d={area} fill="url(#ag)" className="fade-in" />
          <path d={line} pathLength={1} className="draw" fill="none" stroke="#00A9A1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#00A9A1" strokeWidth="2.5" className="pop-in" style={{ animationDelay: `${300 + i * 90}ms` }}><title>{`${labels[i]}: ${rs(sales[i])}`}</title></circle>)}
          {pts.map(([x], i) => <text key={i} x={x} y={H + 16} textAnchor="middle" fontSize="11" fill="#5a6563">{labels[i]}</text>)}
        </svg>
      </div>
    </DemoFrame>
  );
}
