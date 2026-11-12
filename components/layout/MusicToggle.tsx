'use client';

import { useEffect, useRef, useState } from 'react';

const NOTES = [392, 494, 587, 659, 587, 494, 440, 523]; // soft G-major arpeggio

/** Optional sound toggle. Off by default; audio is synthesised with Web Audio only after the user clicks (no file is loaded). */
export function MusicToggle() {
  const [on, setOn] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const timer = useRef<number | null>(null);

  const stop = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    ctx.current?.close();
    ctx.current = null;
  };

  useEffect(() => stop, []);

  const toggle = () => {
    if (on) {
      stop();
      setOn(false);
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const c = new AC();
    ctx.current = c;
    let n = 0;
    const tick = () => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'triangle';
      o.frequency.value = NOTES[n++ % NOTES.length];
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.42);
      o.connect(g).connect(c.destination);
      o.start();
      o.stop(c.currentTime + 0.45);
    };
    tick();
    timer.current = window.setInterval(tick, 420);
    setOn(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn background sound off' : 'Turn background sound on'}
      className="fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-night/85 text-white shadow-lift backdrop-blur-xl transition-transform duration-150 [transition-timing-function:var(--ease-micro)] hover:scale-105 active:scale-95"
    >
      <span className="flex h-5 items-end gap-[3px]" aria-hidden="true">
        {[0, 1, 2, 3].map((b) => (
          <span key={b} className="w-[3px] rounded-full bg-brand" style={{ height: on ? '100%' : '30%', transformOrigin: 'bottom', animation: on ? `music-bar ${0.7 + b * 0.15}s ease-in-out ${b * 0.1}s infinite alternate` : 'none' }} />
        ))}
      </span>
    </button>
  );
}
