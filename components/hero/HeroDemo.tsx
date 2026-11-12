'use client';

import { DemoPhone } from '@/components/demo/DemoPhone';
import { useDemo } from '@/components/demo/DemoProvider';

/**
 * The hero phone. No visible controls: it simply runs. For keyboard and screen-reader users there is a
 * pause button that appears when focused, and the current step is announced politely.
 */
export function HeroDemo() {
  const { running, playing, manual, stepLabel, play, pause } = useDemo();
  const live = running || (playing && !manual);
  return (
    <div className="mx-auto flex w-full flex-col items-center">
      <div className="phone-in phone-persp" style={{ '--d': '800ms' } as React.CSSProperties}>
        <div className="phone-tilt">
          <DemoPhone />
        </div>
      </div>

      <button
        type="button"
        onClick={() => (live ? pause() : play())}
        className="sr-only mt-4 rounded-full bg-brand px-5 py-2.5 text-[13px] font-bold text-deep focus:not-sr-only"
      >
        {live ? 'Pause the demo' : 'Play the demo'}
      </button>
      <p className="sr-only" aria-live="polite">{stepLabel}</p>
    </div>
  );
}
