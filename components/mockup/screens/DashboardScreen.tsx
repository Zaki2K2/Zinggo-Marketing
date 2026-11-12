import { Icon, type IconName } from '@/components/ui/Icon';
import { Swap, Tap, d } from '../parts';

const QUICK: { icon: IconName; label: string }[] = [
  { icon: 'pos', label: 'New sale' },
  { icon: 'orders', label: 'Orders' },
  { icon: 'box', label: 'Stock' },
  { icon: 'chart', label: 'Reports' },
];

/** Dashboard. `notify` shows the incoming-order banner; `updated` shows post-sale totals. */
export function DashboardScreen({ notify = false, updated = false }: { notify?: boolean; updated?: boolean }) {
  return (
    <div className="relative h-full bg-[#F3F6F6]">
      <div className="rounded-b-[26px] bg-gradient-to-b from-[#00C7BE] to-[#00A9A1] px-4 pb-14 pt-11 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-white/80">Welcome Back!</p>
            <p className="text-[17px] font-extrabold leading-tight tracking-tight">Al-Noor Kitchen</p>
          </div>
          <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/20">
            <Icon name="bell" size={18} />
            <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#c62a2a] text-[9px] font-bold">{updated ? 3 : 4}</span>
          </span>
        </div>
      </div>

      <div className="-mt-11 px-3">
        <div className="rounded-2xl bg-white p-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10.5px] font-medium text-[#66716F]">Today&apos;s Sales</p>
              <p className="text-[22px] font-extrabold leading-tight tracking-tight">{updated ? <Swap from="Rs 24,850" to="Rs 26,700" delay={500} /> : 'Rs 24,850'}</p>
            </div>
            <span className="rounded-full bg-[#E6F9F8] px-2 py-1 text-[10px] font-bold text-[#00706b]">▲ 12.4%</span>
          </div>
          <svg viewBox="0 0 240 64" className="mt-1 h-14 w-full" aria-hidden="true" preserveAspectRatio="none">
            <defs>
              <linearGradient id="dg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#00C7BE" stopOpacity="0.35" />
                <stop offset="1" stopColor="#00C7BE" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 52 L30 44 L60 48 L90 30 L120 36 L150 20 L180 26 L210 12 L240 16 L240 64 L0 64Z" fill="url(#dg)" />
            <path pathLength={1} className="draw" style={d(100)} d="M0 52 L30 44 L60 48 L90 30 L120 36 L150 20 L180 26 L210 12 L240 16" fill="none" stroke="#00A9A1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            ['Total Orders', updated ? '39' : '38', 'text-ink'],
            ['Pending', updated ? '5' : '6', 'text-[#b26a00]'],
            ['Low Stock', '4', 'text-[#c62a2a]'],
          ].map(([l, v, c]) => (
            <div key={l} className="rounded-xl bg-white p-2 text-center shadow-sm">
              <p className={`text-[17px] font-extrabold ${c}`}>{v}</p>
              <p className="text-[9.5px] font-medium text-[#66716F]">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-4 gap-2">
          {QUICK.map((q) => (
            <div key={q.label} className="flex flex-col items-center gap-1 rounded-xl bg-white py-2 shadow-sm">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#E6F9F8] text-[#00706b]">
                <Icon name={q.icon} size={15} />
              </span>
              <span className="text-[9.5px] font-semibold">{q.label}</span>
            </div>
          ))}
        </div>

        <p className="mb-1 mt-3 text-[12px] font-extrabold">Recent transactions</p>
        <div className="space-y-1.5">
          {updated && (
            <div className="pop-in flex items-center justify-between rounded-xl border border-[#00C7BE]/40 bg-[#E6F9F8] px-3 py-2" style={d(700)}>
              <span className="text-[11px] font-bold">#ZG-1042 · Easypaisa</span>
              <span className="text-[11px] font-extrabold text-[#00706b]">Rs 1,850</span>
            </div>
          )}
          {[
            ['#ZG-1041 · Cash', 'Rs 640'],
            ['#ZG-1040 · JazzCash', 'Rs 1,260'],
          ]
            .slice(0, updated ? 1 : 2)
            .map(([a, b]) => (
              <div key={a} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
                <span className="text-[11px] font-semibold">{a}</span>
                <span className="text-[11px] font-extrabold">{b}</span>
              </div>
            ))}
        </div>
      </div>

      {notify && (
        <>
          <div className="slide-down absolute inset-x-2 top-9 z-30 flex items-center gap-2.5 rounded-2xl bg-[#0A081B] p-3 text-white shadow-2xl" style={d(450)} role="status">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#00C7BE] text-[#071B1B]">
              <Icon name="bell" size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-extrabold">New Order Received!</p>
              <p className="text-[10.5px] text-white/70">Order #ZG-1042</p>
              <p className="text-[11px] font-extrabold text-[#00C7BE]">Amount: Rs 1,850</p>
            </div>
          </div>
          <Tap x="50%" y="64px" delay={2000} />
        </>
      )}
    </div>
  );
}
