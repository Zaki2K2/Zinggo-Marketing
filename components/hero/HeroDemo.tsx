'use client';

import { DemoPhone } from '@/components/demo/DemoPhone';
import { useDemo } from '@/components/demo/DemoProvider';
import { Icon } from '@/components/ui/Icon';
import { SCRIPT } from '@/lib/demo/script';

/** Phone + playback controls. The phone is the live demo; everything here reads/controls the same engine. */
export function HeroDemo() {
  const { playing, running, manual, stepLabel, stepIndex, play, pause, replay } = useDemo();
  return (
    <div className="mx-auto flex w-full flex-col items-center">
      <div className="phone-in" style={{ '--d': '800ms' } as React.CSSProperties}>
        <DemoPhone />
      </div>

      <div className="fade-in mt-5 flex w-full max-w-[340px] items-start gap-3" style={{ '--d': '1500ms' } as React.CSSProperties}>
        <button type="button" onClick={() => (running || (playing && !manual) ? pause() : play())} aria-label={running || (playing && !manual) ? 'Pause demo' : manual ? 'Restart automatic demo' : 'Play demo'} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-deep transition-transform duration-150 active:scale-95">
          <Icon name={running || (playing && !manual) ? 'pause' : 'play'} size={17} strokeWidth={2.4} />
        </button>
        <button type="button" onClick={replay} aria-label="Replay from the start" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-[transform,background-color] duration-150 hover:bg-white/10 active:scale-95">
          <Icon name="replay" size={17} />
        </button>
        <div className="min-w-0 flex-1" aria-live="polite">
          <p className="label truncate text-white/45">{manual ? 'You’re in control' : `Step ${stepIndex + 1} of ${SCRIPT.length}`}</p>
          <p className="line-clamp-2 min-h-[36px] text-[13px] font-semibold leading-snug text-white/85">{stepLabel}</p>
        </div>
      </div>
    </div>
  );
}
