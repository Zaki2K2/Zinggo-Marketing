import type { ReactNode } from 'react';

/** Shared app-window chrome for the interactive feature demos. */
export function DemoFrame({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="on-light overflow-hidden rounded-[28px] border border-line bg-white text-ink shadow-lift">
      <div className="flex items-center justify-between border-b border-line bg-mist px-5 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffc342]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2fd35c]" />
        </div>
        <p className="text-[13px] font-bold">{title}</p>
        <p className="w-14 text-right text-[11px] font-semibold text-muted">{subtitle}</p>
      </div>
      <div className="h-[540px] overflow-y-auto p-5">{children}</div>
    </div>
  );
}

export function Pill({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: ReactNode; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`rounded-full px-4 py-2 text-[13px] font-bold transition-[transform,background-color,color] duration-150 [transition-timing-function:var(--ease-micro)] active:scale-95 ${active ? 'bg-deep text-white' : 'bg-mist text-ink hover:bg-line'}`}
    >
      {children}
    </button>
  );
}

export function RoundBtn({ label, onClick, children, disabled }: { label: string; onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} disabled={disabled} className="grid h-8 w-8 place-items-center rounded-full bg-mist transition-[transform,background-color] duration-150 active:scale-90 enabled:hover:bg-brand/30 disabled:opacity-40">
      {children}
    </button>
  );
}
