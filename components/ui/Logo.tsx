export function Logo({ className = '', tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const color = tone === 'light' ? '#ffffff' : '#071B1B';
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#00C7BE" />
        <path d="M18 20h28L18 44h28" fill="none" stroke="#071B1B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ color }} className="text-[22px] font-extrabold tracking-[-0.04em]">
        zinggo
      </span>
    </span>
  );
}
