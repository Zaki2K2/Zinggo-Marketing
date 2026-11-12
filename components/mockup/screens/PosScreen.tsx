import { Icon } from '@/components/ui/Icon';
import { Tap, Thumb, ScreenHeader, ITEMS, d } from '../parts';

const GRID = [
  { name: 'Chicken Biryani', price: 450, tone: '#e8890c', letter: 'B', at: 700 },
  { name: 'Zinger Burger', price: 550, tone: '#c0392b', letter: 'Z', at: 1500 },
  { name: 'Mint Lemonade', price: 200, tone: '#1aa37a', letter: 'M', at: 2300 },
  { name: 'Masala Fries', price: 250, tone: '#6d5bd0', letter: 'F', at: 0 },
];
const TAP_POS = ['27%', '73%'];

export function PosScreen() {
  return (
    <div className="relative h-full bg-[#F3F6F6]">
      <ScreenHeader title="POS" right={<span className="grid h-8 w-8 place-items-center rounded-full bg-[#E6F9F8] text-[#00706b]"><Icon name="scan" size={16} /></span>} />
      <div className="px-3">
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[11px] text-[#66716F] shadow-sm">
          <Icon name="search" size={14} /> Search products or customers…
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {GRID.map((p, i) => (
            <div key={p.name} className="rounded-xl bg-white p-2 shadow-sm">
              <div className="flex items-center gap-1.5">
                <Thumb letter={p.letter} tone={p.tone} />
                <p className="text-[10.5px] font-bold leading-tight">{p.name}</p>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-[11px] font-extrabold text-[#00706b]">Rs {p.price}</p>
                <span className="grid h-5 w-5 place-items-center rounded-md bg-[#00C7BE] text-[#071B1B]">
                  <Icon name="plus" size={12} strokeWidth={2.6} />
                </span>
              </div>
              {p.at > 0 && <Tap x={TAP_POS[i % 2]} y={`${i < 2 ? 112 : 112}px`} delay={p.at} />}
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[12px] font-extrabold">Cart</p>
            <p className="text-[10.5px] font-semibold text-[#66716F]">5 items</p>
          </div>
          {ITEMS.map((it, i) => (
            <div key={it.name} className="pop-in flex items-center gap-2 py-1.5" style={d(900 + i * 800)}>
              <p className="flex-1 truncate text-[11px] font-semibold">{it.name}</p>
              <span className="flex items-center gap-1.5 rounded-full bg-[#F3F6F6] px-1.5 py-0.5 text-[11px] font-bold">
                <Icon name="minus" size={11} /> {it.qty} <Icon name="plus" size={11} />
              </span>
              <p className="w-14 text-right text-[11px] font-extrabold">Rs {it.qty * it.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="slide-up absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-[#071B1B] py-2 pl-5 pr-2 text-white" style={d(3000)}>
        <div>
          <p className="text-[9.5px] text-white/60">Order total</p>
          <p className="text-[15px] font-extrabold leading-none">Rs 1,850</p>
        </div>
        <span className="rounded-full bg-[#00C7BE] px-5 py-2.5 text-[12px] font-extrabold text-[#071B1B]">Checkout</span>
      </div>
      <Tap x="82%" y="calc(100% - 30px)" delay={3700} />
    </div>
  );
}
