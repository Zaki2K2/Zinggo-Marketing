import { Icon } from '@/components/ui/Icon';
import { Swap, Thumb, ScreenHeader, d } from '../parts';

const ROWS = [
  { name: 'Chicken Biryani', from: 24, to: 22, tone: '#e8890c', letter: 'B', src: '/products/biryani.jpg' },
  { name: 'Zinger Burger', from: 18, to: 17, tone: '#c0392b', letter: 'Z', src: '/products/burger.jpg' },
  { name: 'Mint Lemonade', from: 40, to: 38, tone: '#1aa37a', letter: 'M', src: '/products/lemonade.jpg' },
  { name: 'Masala Fries', from: 4, to: 4, tone: '#6d5bd0', letter: 'F', src: '/products/fries.jpg' },
];

export function InventoryScreen() {
  return (
    <div className="relative h-full bg-[#F5F5F5]">
      <ScreenHeader title="Inventory" />
      <div className="slide-down mx-3 flex items-center gap-2 rounded-2xl bg-[#003836] p-3 text-white" style={d(200)} role="status">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#00CCC0] text-[#003836]">
          <Icon name="check" size={16} strokeWidth={3} />
        </span>
        <p className="text-[12px] font-extrabold">Inventory Updated Successfully</p>
      </div>
      <div className="mt-3 space-y-2 px-3">
        {ROWS.map((r, i) => (
          <div key={r.name} className="pop-in flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm" style={d(400 + i * 150)}>
            <Thumb letter={r.letter} tone={r.tone} src={r.src} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold">{r.name}</p>
              {r.from <= 5 ? <p className="text-[10px] font-bold text-[#c62a2a]">Low stock</p> : <p className="text-[10px] text-[#66716F]">In stock</p>}
            </div>
            <div className="text-right">
              <p className="text-[18px] font-extrabold leading-none">{r.from === r.to ? r.from : <Swap from={r.from} to={r.to} delay={1300 + i * 250} />}</p>
              {r.from !== r.to && (
                <p className="swap-in mt-0.5 text-[10px] font-bold text-[#c62a2a]" style={d(1400 + i * 250)}>
                  −{r.from - r.to}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
