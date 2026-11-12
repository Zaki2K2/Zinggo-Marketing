import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';

export type TabId = 'home' | 'orders' | 'pos' | 'catalog' | 'more';

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Home', icon: 'store' },
  { id: 'orders', label: 'Orders', icon: 'orders' },
  { id: 'pos', label: 'POS', icon: 'pos' },
  { id: 'catalog', label: 'Catalog', icon: 'utensils' },
  { id: 'more', label: 'More', icon: 'more' },
];

/**
 * Premium phone chrome. Pure presentation: the app screen is passed as children.
 * `chrome={false}` hides the drawn status bar and tab bar (for real screenshots that already contain them).
 */
export function PhoneFrame({ children, tab, chrome = true }: { children: ReactNode; tab: TabId; chrome?: boolean }) {
  return (
    <div className="relative mx-auto h-[600px] w-[292px] rounded-[46px] bg-gradient-to-b from-[#2b2f3d] to-[#0b0c14] p-[9px] shadow-[0_50px_90px_-30px_rgba(0,199,190,0.45),0_30px_60px_-20px_rgba(0,0,0,0.8),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
      <span className="absolute -right-[3px] top-28 h-16 w-[3px] rounded-r bg-[#1b1e2a]" aria-hidden="true" />
      <span className="absolute -left-[3px] top-24 h-9 w-[3px] rounded-l bg-[#1b1e2a]" aria-hidden="true" />
      <span className="absolute -left-[3px] top-36 h-12 w-[3px] rounded-l bg-[#1b1e2a]" aria-hidden="true" />
      <div className="relative h-full w-full overflow-hidden rounded-[37px] bg-[#F3F6F6] text-[#111716]">
        {chrome && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-9 items-center justify-between px-6 pt-1 text-[11px] font-bold">
            <span className="text-[#111716]">10:16</span>
            <span className="absolute left-1/2 top-2 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-[#05060b]" />
            <span className="flex items-center gap-1 text-[#111716]">
              <span className="h-2 w-3 rounded-[2px] bg-current opacity-80" />
              <span className="rounded-[4px] border border-current px-1 text-[9px] leading-[13px]">84</span>
            </span>
          </div>
        )}
        <div className={`absolute inset-x-0 top-0 overflow-hidden ${chrome ? 'bottom-[54px]' : 'bottom-0'}`}>{children}</div>
        {chrome && (
          <div className="absolute inset-x-0 bottom-0 z-30 flex h-[54px] items-start justify-around border-t border-[#e5eae8] bg-white/95 pt-1.5 backdrop-blur" aria-hidden="true">
            {TABS.map((t) => {
              const on = t.id === tab;
              return (
                <span key={t.id} className={`flex w-12 flex-col items-center gap-0.5 text-[9px] font-semibold transition-colors duration-300 ${on ? 'text-[#00A9A1]' : 'text-[#8a9492]'}`}>
                  <Icon name={t.icon} size={18} strokeWidth={on ? 2.2 : 1.7} />
                  {t.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
