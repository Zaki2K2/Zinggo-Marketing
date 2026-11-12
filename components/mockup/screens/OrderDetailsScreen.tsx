import { Swap, Tap, Thumb, ScreenHeader, ITEMS, d } from '../parts';

export function OrderDetailsScreen() {
  return (
    <div className="relative h-full bg-[#F3F6F6]">
      <ScreenHeader title="Order #ZG-1042" back right={<span className="rounded-full bg-[#FFF3C4] px-2.5 py-1 text-[10px] font-bold text-[#8a6200]"><Swap from="New" to="Accepted" delay={2300} /></span>} />
      <div className="space-y-2 px-3">
        <div className="pop-in flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm" style={d(100)}>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E6F9F8] text-[14px] font-extrabold text-[#00706b]">HA</span>
          <div>
            <p className="text-[13px] font-extrabold">Hamza Ali</p>
            <p className="text-[10.5px] text-[#66716F]">Delivery · Gulshan, Karachi</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#66716F]">Order items</p>
          {ITEMS.map((it, i) => (
            <div key={it.name} className="pop-in flex items-center gap-2.5 border-b border-[#edf1f0] py-2 last:border-0" style={d(300 + i * 250)}>
              <Thumb letter={it.letter} tone={it.tone} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-bold">{it.name}</p>
                <p className="text-[10.5px] text-[#66716F]">Qty {it.qty}</p>
              </div>
              <p className="text-[12px] font-extrabold">Rs {(it.qty * it.price).toLocaleString()}</p>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-dashed border-[#dfe6e4] pt-2">
            <span className="text-[12px] font-semibold text-[#66716F]">Total amount</span>
            <span className="text-[18px] font-extrabold">Rs 1,850</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-3 shadow-sm">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#66716F]">Order status</p>
          <div className="flex items-center justify-between text-[9.5px] font-semibold">
            {['Received', 'Preparing', 'Ready', 'Delivered'].map((s, i) => (
              <span key={s} className="flex flex-col items-center gap-1">
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold ${i === 0 ? 'bg-[#00C7BE] text-[#071B1B]' : 'bg-[#e8eeed] text-[#66716F]'}`}>{i + 1}</span>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-3 bottom-3">
        <div className="rounded-full bg-[#00C7BE] py-3 text-center text-[13px] font-extrabold text-[#071B1B]">Accept order</div>
      </div>
      <Tap x="50%" y="calc(100% - 28px)" delay={2000} />
    </div>
  );
}
