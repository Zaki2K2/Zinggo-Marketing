import { d } from '../parts';

export function SaleCompleteScreen() {
  return (
    <div className="relative h-full bg-gradient-to-b from-[#E6F9F8] to-[#F3F6F6] px-4 pt-12 text-center">
      <span className="pop-in mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#00C7BE] text-[#071B1B] shadow-[0_0_0_10px_rgba(0,199,190,0.2)]">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path className="draw" pathLength={1} style={d(250)} d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <h3 className="pop-in mt-3 text-[20px] font-extrabold tracking-tight" style={d(200)}>Sale Completed!</h3>
      <p className="pop-in text-[26px] font-extrabold tracking-tight text-[#00706b]" style={d(300)}>Rs 1,850</p>
      <p className="pop-in mt-0.5 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-bold shadow-sm" style={d(450)}>Invoice Generated</p>

      <div className="slide-up mx-auto mt-4 w-[88%] rounded-2xl bg-white p-3 text-left shadow-[0_14px_30px_-14px_rgba(0,0,0,0.3)]" style={d(700)}>
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-extrabold">Al-Noor Kitchen</p>
          <p className="text-[10px] font-semibold text-[#66716F]">#ZG-1042</p>
        </div>
        <div className="my-2 border-t border-dashed border-[#dfe6e4]" />
        {[
          ['2 × Chicken Biryani', '900'],
          ['1 × Zinger Burger', '550'],
          ['2 × Mint Lemonade', '400'],
        ].map(([a, b]) => (
          <div key={a} className="flex justify-between py-0.5 text-[10.5px]">
            <span>{a}</span>
            <span className="font-bold">Rs {b}</span>
          </div>
        ))}
        <div className="my-2 border-t border-dashed border-[#dfe6e4]" />
        <div className="flex justify-between text-[12px] font-extrabold">
          <span>Total</span>
          <span>Rs 1,850</span>
        </div>
        <p className="mt-1 text-[10px] text-[#66716F]">Paid via Easypaisa · Ref EP-88231</p>
      </div>
    </div>
  );
}
