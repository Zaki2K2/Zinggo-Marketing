import { Icon, type IconName } from '@/components/ui/Icon';
import { Tap, ScreenHeader, d } from '../parts';

const METHODS: { name: string; icon: IconName; hint: string }[] = [
  { name: 'Cash', icon: 'cash', hint: 'Collect at counter' },
  { name: 'Easypaisa', icon: 'wallet', hint: 'Record reference' },
  { name: 'JazzCash', icon: 'wallet', hint: 'Record reference' },
  { name: 'Bank', icon: 'building', hint: 'Record reference' },
];

export function CheckoutScreen() {
  return (
    <div className="relative h-full bg-[#F3F6F6]">
      <ScreenHeader title="Checkout" back />
      <div className="px-3">
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-[11px] font-medium text-[#66716F]">Amount due</p>
          <p className="text-[30px] font-extrabold tracking-tight">Rs 1,850</p>
        </div>

        <p className="mb-1.5 mt-3 text-[12px] font-extrabold">Payment method</p>
        <div className="grid grid-cols-2 gap-2">
          {METHODS.map((m) => (
            <div key={m.name} className={`rounded-xl border-2 border-transparent bg-white p-2.5 shadow-sm ${m.name === 'Easypaisa' ? 'sel-on' : ''}`} style={m.name === 'Easypaisa' ? d(1300) : undefined}>
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#E6F9F8] text-[#00706b]">
                <Icon name={m.icon} size={15} />
              </span>
              <p className="mt-1.5 text-[12px] font-bold">{m.name}</p>
              <p className="text-[9.5px] text-[#66716F]">{m.hint}</p>
            </div>
          ))}
        </div>
        <Tap x="73%" y="205px" delay={1000} />

        <div className="pop-in mt-3 rounded-xl bg-white p-3 shadow-sm" style={d(1900)}>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#66716F]">Payment reference</p>
          <p className="mt-0.5 text-[14px] font-extrabold tracking-wide">EP-88231</p>
          <p className="mt-1 text-[9.5px] leading-snug text-[#66716F]">Zinggo records the reference you enter. It does not process the payment.</p>
        </div>
      </div>

      <div className="absolute inset-x-3 bottom-3 rounded-full bg-[#00C7BE] py-3 text-center text-[13px] font-extrabold text-[#071B1B]">Record payment</div>
      <Tap x="50%" y="calc(100% - 28px)" delay={2900} />
    </div>
  );
}
