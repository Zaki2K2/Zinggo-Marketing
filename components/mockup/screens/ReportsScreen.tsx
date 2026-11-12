import { ScreenHeader, d } from '../parts';

const PAY = [['Cash', 38], ['Easypaisa', 34], ['JazzCash', 18], ['Bank', 10]] as const;

/** Demo reports screen (illustrative data), used in the stacked feature cards. */
export function ReportsScreen() {
  return (
    <div className="relative h-full bg-[#F3F6F6]">
      <ScreenHeader title="Reports" />
      <div className="px-3">
        <div className="flex gap-1.5">
          {['Today', '7 days', '30 days'].map((t, i) => (
            <span key={t} className={`rounded-full px-3 py-1.5 text-[10.5px] font-bold ${i === 0 ? 'bg-[#071B1B] text-white' : 'bg-white text-[#66716F]'}`}>{t}</span>
          ))}
        </div>

        <div className="mt-2 rounded-2xl bg-white p-3 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10.5px] font-medium text-[#66716F]">Sales</p>
              <p className="text-[22px] font-extrabold leading-tight tracking-tight">Rs 26,700</p>
            </div>
            <div className="text-right">
              <p className="text-[10.5px] font-medium text-[#66716F]">Orders</p>
              <p className="text-[17px] font-extrabold">39</p>
            </div>
          </div>
          <svg viewBox="0 0 240 70" className="mt-1 h-16 w-full" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="rg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#00C7BE" stopOpacity="0.35" /><stop offset="1" stopColor="#00C7BE" stopOpacity="0" /></linearGradient></defs>
            <path d="M0 58 L34 48 L68 52 L102 34 L136 40 L170 22 L204 28 L240 8 L240 70 L0 70Z" fill="url(#rg)" />
            <path pathLength={1} className="draw" style={d(200)} d="M0 58 L34 48 L68 52 L102 34 L136 40 L170 22 L204 28 L240 8" fill="none" stroke="#00A9A1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="mt-2 rounded-2xl bg-white p-3 shadow-sm">
          <p className="mb-2 text-[11px] font-extrabold">By payment type</p>
          {PAY.map(([n, v], i) => (
            <div key={n} className="mb-2 last:mb-0">
              <div className="mb-1 flex justify-between text-[10.5px] font-semibold"><span>{n}</span><span>{v}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-[#e8eeed]"><div className="grow-x h-full rounded-full bg-[#00C7BE]" style={{ width: `${v * 2}%`, ...d(300 + i * 120) }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
