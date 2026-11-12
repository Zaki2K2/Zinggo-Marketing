'use client';

import { useEffect, useState } from 'react';
import { gifDurationMs } from '@/lib/gif';
import { useDemo } from './DemoProvider';

/**
 * Zinggo launch animation, shown inside the phone's screen only (it is mounted inside the screen's clipped,
 * rounded container, so it cannot overflow the device, and the notch stays above it).
 *
 * The GIF loops by default, so we read its real duration from the file, play it once, and fade this overlay out
 * just before a second pass could begin. The app underneath is already rendered, so the reveal never shows a blank frame.
 */

const GIF = '/intro/zinggo-intro.gif';
const START_AFTER_MS = 700; // let the phone finish arriving before the logo starts
const FADE_MS = 600; // matches .phone-intro transition in globals.css
const MAX_WAIT_MS = 9000; // safety net

export function PhoneIntro() {
  const { introDone, finishIntro } = useDemo();
  const [src, setSrc] = useState<string | null>(null);
  const [fading, setFading] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishIntro();
      return;
    }
    let cancelled = false;
    let ended = false;
    let url: string | null = null;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(() => { if (!cancelled) fn(); }, ms)); };
    const end = () => {
      if (ended) return;
      ended = true;
      setFading(true);
      later(finishIntro, FADE_MS);
    };
    const t0 = performance.now();

    (async () => {
      try {
        const r = await fetch(GIF, { cache: 'force-cache' });
        if (!r.ok) throw new Error('gif');
        const buf = await r.arrayBuffer();
        const dur = gifDurationMs(buf) ?? 3000;
        url = URL.createObjectURL(new Blob([buf], { type: 'image/gif' }));
        if (cancelled) return;
        const wait = Math.max(0, START_AFTER_MS - (performance.now() - t0));
        later(() => {
          setSrc(url);
          // end just before the GIF's second pass could start
          later(end, Math.max(600, dur - 60));
        }, wait);
      } catch {
        if (cancelled) return;
        setFallback(true);
        later(end, START_AFTER_MS + 900);
      }
    })();
    later(end, MAX_WAIT_MS);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      if (url) URL.revokeObjectURL(url);
    };
  }, [finishIntro]);

  if (introDone) return null;

  return (
    <div className={`phone-intro${fading ? ' is-fading' : ''}`} aria-hidden="true">
      {src && !fading ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" width={1080} height={1920} decoding="async" draggable={false} />
      ) : null}
      {src && fading ? (
        // keep the last frame in place while fading so the GIF cannot visibly restart
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" width={1080} height={1920} decoding="async" draggable={false} style={{ visibility: 'hidden' }} />
      ) : null}
      {fallback && <span className="phone-intro-fallback">zinggo</span>}
    </div>
  );
}
