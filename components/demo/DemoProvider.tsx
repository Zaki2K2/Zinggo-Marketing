'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type Dispatch, type ReactNode } from 'react';
import { initialState } from '@/lib/demo/data';
import { reducer } from '@/lib/demo/reducer';
import { SCRIPT, groupOf, stateBefore } from '@/lib/demo/script';
import type { Action, DemoState } from '@/lib/demo/types';

/**
 * Self-contained demo engine. All state lives in the browser; nothing is sent anywhere.
 *  - `state` + `dispatch`: the transaction state machine (shared by every presentation).
 *  - Autoplay: runs SCRIPT step by step (cursor taps a target, then the action is applied).
 *  - The first manual interaction pauses autoplay and it never resumes by itself.
 *  - Autoplay only runs while at least one presenter is on screen and the tab is visible.
 */

const TAP_MS = 700;
const IDLE_RESUME_MS = 12000; // after the visitor stops touching the phone, the demo quietly starts over
const START_DELAY_MS = 1500; // lets the hero entrance finish before the demo starts

interface Ctrl {
  stepIndex: number;
  stepLabel: string;
  group: number;
  playing: boolean;
  running: boolean;
  manual: boolean;
  cursor: { target: string; tick: number } | null;
  /** True once the intro inside the phone has finished (or was skipped). */
  introDone: boolean;
  finishIntro: () => void;
  play: () => void;
  pause: () => void;
  replay: () => void;
  seek: (stepIndex: number) => void;
  touch: () => void;
  /** Presenters call this while they are on screen. Returns an unregister function. */
  present: () => () => void;
}

interface DemoCtx extends Ctrl {
  state: DemoState;
  dispatch: Dispatch<Action>;
}

const Ctx = createContext<DemoCtx | null>(null);

export function useDemo(): DemoCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDemo must be used inside <DemoProvider>');
  return v;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [manual, setManual] = useState(false);
  const [cursor, setCursor] = useState<{ target: string; tick: number } | null>(null);
  const [presenters, setPresenters] = useState(0);
  // The demo waits until the Zinggo intro inside the phone has finished (see PhoneIntro).
  const [introDone, setIntroDone] = useState(false);
  const [touchTick, setTouchTick] = useState(0);
  const [epoch, setEpoch] = useState(0); // bumped by seek/replay so the step effect restarts even if the index is unchanged
  const [tabVisible, setTabVisible] = useState(true);
  const applied = useRef(-1);
  const started = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
    const onVis = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const running = playing && !manual && introDone && presenters > 0 && tabVisible;

  useEffect(() => {
    if (!running) { setCursor(null); return; }
    const step = SCRIPT[stepIndex];
    let t1 = 0;
    let t2 = 0;
    const apply = () => {
      if (applied.current !== stepIndex) {
        applied.current = stepIndex;
        if (step.action) for (const a of Array.isArray(step.action) ? step.action : [step.action]) dispatch(a);
      }
      t2 = window.setTimeout(() => {
        if (stepIndex + 1 >= SCRIPT.length) {
          dispatch({ type: 'RESET' });
          applied.current = -1;
          setStepIndex(0);
        } else {
          setStepIndex(stepIndex + 1);
        }
      }, step.wait);
    };
    const lead = !started.current && stepIndex === 0 ? START_DELAY_MS : 0;
    started.current = true;
    if (step.tap && applied.current !== stepIndex) {
      setCursor({ target: step.tap, tick: Date.now() });
      t1 = window.setTimeout(apply, TAP_MS);
    } else {
      setCursor(null);
      t1 = window.setTimeout(apply, lead);
    }
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [running, stepIndex, epoch]);

  const play = useCallback(() => {
    if (manual) {
      dispatch({ type: 'RESET' });
      applied.current = -1;
      setStepIndex(0);
      setManual(false);
    }
    setPlaying(true);
  }, [manual]);

  const pause = useCallback(() => { setPlaying(false); setCursor(null); }, []);

  const replay = useCallback(() => {
    dispatch({ type: 'RESET' });
    applied.current = -1;
    started.current = true;
    setStepIndex(0);
    setEpoch((e) => e + 1);
    setManual(false);
    setPlaying(true);
  }, []);

  const seek = useCallback((i: number) => {
    dispatch({ type: 'LOAD', state: stateBefore(i) });
    applied.current = -1;
    setStepIndex(i);
    setEpoch((e) => e + 1);
    setManual(false);
    setPlaying(true);
  }, []);

  const touch = useCallback(() => { setManual(true); setPlaying(false); setCursor(null); setTouchTick((n) => n + 1); }, []);

  // Never resumes mid-interaction; only after IDLE_RESUME_MS without a touch, from a clean state.
  useEffect(() => {
    if (!manual) return;
    const id = window.setTimeout(replay, IDLE_RESUME_MS);
    return () => window.clearTimeout(id);
  }, [manual, touchTick, replay]);

  const finishIntro = useCallback(() => setIntroDone(true), []);

  const present = useCallback(() => {
    setPresenters((n) => n + 1);
    return () => setPresenters((n) => Math.max(0, n - 1));
  }, []);

  const value = useMemo<DemoCtx>(() => ({
    state, dispatch,
    stepIndex,
    stepLabel: manual ? 'Your turn. Tap around the app.' : SCRIPT[stepIndex].label,
    group: groupOf(stepIndex),
    playing, running, manual, cursor, introDone, finishIntro,
    play, pause, replay, seek, touch, present,
  }), [state, stepIndex, playing, running, manual, cursor, introDone, finishIntro, play, pause, replay, seek, touch, present]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Marks an element as "on screen" for the engine. Autoplay pauses when no presenter is visible. */
export function usePresence(ref: React.RefObject<HTMLElement | null>, threshold = 0.25) {
  const { present } = useDemo();
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    let off: (() => void) | null = null;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !off) off = present();
      else if (!e.isIntersecting && off) { off(); off = null; }
    }, { threshold });
    io.observe(el);
    return () => { io.disconnect(); if (off) off(); };
  }, [ref, present, threshold]);
}
