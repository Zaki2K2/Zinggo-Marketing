'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import { NAV_LINKS, trialHref } from '@/lib/site';

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        aria-label="Primary"
        className={`pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-2.5 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 sm:px-6 ${
          'border-white/25 bg-black/30 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)]'
        }`}
      >
        <a href="#top" aria-label="Zinggo home" onClick={close} className="rounded-full">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-4 py-2 text-[15px] font-medium text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <a href="#get-started" className="rounded-full px-4 py-2 text-[15px] font-semibold text-white/90 hover:text-white">
            Sign In
          </a>
          <a href={trialHref()} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
            Start Free Trial
          </a>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full text-white transition-transform duration-150 active:scale-95 hover:bg-white/10 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`pointer-events-auto mx-auto mt-2 max-w-7xl overflow-hidden rounded-[28px] border border-white/25 bg-black/50 backdrop-blur-xl backdrop-saturate-150 transition-[opacity,transform,visibility] duration-500 [transition-timing-function:var(--ease-panel)] lg:hidden ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'
        }`}
      >
        <ul className="flex flex-col p-3">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href} style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }} className={`transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
              <a href={l.href} onClick={close} className="flex items-center justify-between rounded-2xl px-4 py-4 text-lg font-semibold text-white hover:bg-white/10">
                {l.label}
                <Icon name="arrow" size={18} className="text-brand" />
              </a>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-4">
          <a href="#get-started" onClick={close} className="btn btn-ghost">
            Sign In
          </a>
          <a href={trialHref()} target="_blank" rel="noopener noreferrer" onClick={close} className="btn btn-primary">
            Start Free Trial
          </a>
        </div>
      </div>
    </header>
  );
}
