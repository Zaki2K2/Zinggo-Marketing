import { ScreenHeader, d } from '../parts';

/** Demo customer-credit screen (illustrative data), used in the stacked feature cards. */
export function CreditScreen() {
  return (
    <div className="relative h-full bg-[#F5F5F5]">
      <ScreenHeader title="Customers" />
      <div className="px-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#E6F9F8] text-[14px] font-extrabold text-[#00706b]">SR</span>
          <div>
            <p className="text-[14px] font-extrabold">Sana Raza</p>
            <p className="text-[10.5px] text-[#66716F]">0300 ••• 4821</p>
          </div>
        </div>

        <div className="mt-2 rounded-2xl bg-white p-3 shadow-sm">
          <p className="text-[10.5px] font-medium text-[#66716F]">Credit outstanding</p>
          <p className="text-[24px] font-extrabold tracking-tight">Rs 1,800</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8eeed]"><div className="grow-x h-full rounded-full bg-[#00CCC0]" style={{ width: '36%', ...d(300) }} /></div>
          <p className="mt-1 text-[10px] text-[#66716F]">36% of Rs 5,000 credit limit</p>
        </div>

        <p className="mb-1 mt-3 text-[12px] font-extrabold">History</p>
        <div className="space-y-1.5">
          {[['Sale #ZG-1031', '09 Nov', 'Rs 1,200'], ['Payment received', '07 Nov', '−Rs 500'], ['Sale #ZG-1018', '04 Nov', 'Rs 600']].map(([a, b, c], i) => (
            <div key={a} className="pop-in flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm" style={d(400 + i * 150)}>
              <span><span className="block text-[11px] font-bold">{a}</span><span className="text-[9.5px] text-[#66716F]">{b}</span></span>
              <span className={`text-[11px] font-extrabold ${c.startsWith('−') ? 'text-[#00706b]' : ''}`}>{c}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-full bg-[#00CCC0] py-2.5 text-center text-[12px] font-extrabold text-[#003836]">Record payment</div>
      </div>
    </div>
  );
}
