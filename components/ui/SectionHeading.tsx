import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

export function SectionHeading({
  eyebrow,
  title,
  children,
  id,
  tone = 'light',
  align = 'center',
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  tone?: 'light' | 'dark';
  align?: 'center' | 'left';
}) {
  const dark = tone === 'dark';
  return (
    <Reveal className={`mx-auto max-w-3xl ${align === 'center' ? 'text-center' : 'text-left mx-0'}`}>
      <p className={`t-eyebrow mb-4 ${dark ? 'text-brand' : 'text-brand-ink'}`}>{eyebrow}</p>
      <h2 id={id} className={`t-section ${dark ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {children && <p className={`t-body mt-5 ${dark ? 'text-white/70' : 'text-muted'}`}>{children}</p>}
    </Reveal>
  );
}
