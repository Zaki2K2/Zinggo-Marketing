import { SITE } from '@/lib/site';

/** Google Play mark (inline SVG, four-colour triangle). Decorative: the button text carries the meaning. */
export function PlayIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.6 1.6c-.4.3-.6.8-.6 1.5v17.8c0 .7.2 1.2.6 1.5l9.9-10.4z" fill="#00D2FF" />
      <path d="M17 15.4l-3.5-3.7 3.5-3.7 4.1 2.4c1.2.7 1.2 1.8 0 2.5z" fill="#FFD400" />
      <path d="M13.5 11.7L3.6 22.4c.4.3 1 .3 1.7-.1L17 15.4z" fill="#FF3A44" />
      <path d="M13.5 11.7L3.6 1.6c.4-.3 1-.3 1.7.1L17 8z" fill="#00F076" />
    </svg>
  );
}

/** "Get it on Google Play" button linking to the Zinggo Merchant app listing. */
export function PlayStoreButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={SITE.playStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get the Zinggo Merchant app on Google Play"
      className={`inline-flex items-center justify-center gap-2.5 rounded-[14px] border border-white/30 bg-black px-4 py-2.5 text-left text-white transition-[transform,background-color,border-color] duration-150 [transition-timing-function:var(--ease-micro)] hover:border-white/60 hover:bg-[#111] active:scale-[0.97] ${className}`}
    >
      <PlayIcon />
      <span className="leading-none">
        <span className="block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-white/75">Get it on</span>
        <span className="mt-0.5 block text-[16px] font-bold tracking-tight">Google Play</span>
      </span>
    </a>
  );
}
