"use client";

// Shared by the concept sites: drives a tall section whose sticky child is the "stage".
// onFrame receives the section's scroll progress from 0 to 1, eased toward the real position so
// motion stays smooth (or exact when the visitor prefers reduced motion). Dispatch a
// "concept:snap" event on window to render the exact position at once (tests, screenshots).

import { useCallback, useEffect, useRef } from "react";

export type FrameFn = (p: number, reduced: boolean) => void;

export function useScrollStage<T extends HTMLElement>(onFrame: FrameFn, ease = 0.14) {
  const ref = useRef<T>(null);
  const cb = useRef<FrameFn>(onFrame);
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    cb.current = onFrame;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = 0;
    let cur = -1;
    let raf = 0;
    let running = false;

    const measure = () => {
      const r = el.getBoundingClientRect();
      const dist = r.height - window.innerHeight;
      target = dist > 0 ? Math.min(1, Math.max(0, -r.top / dist)) : 0;
    };
    const frame = () => {
      measure();
      if (cur < 0 || motion.matches) cur = target;
      else cur += (target - cur) * ease;
      if (Math.abs(target - cur) < 1e-4) cur = target;
      cb.current(cur, motion.matches);
      if (cur !== target) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const snap = () => {
      measure();
      cur = target;
      cb.current(cur, motion.matches);
    };
    kickRef.current = kick;
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    window.addEventListener("concept:snap", snap);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("concept:snap", snap);
    };
  }, [ease]);

  /** Asks for one more frame, e.g. after a clip has loaded or finished seeking. */
  const refresh = useCallback(() => kickRef.current(), []);

  /** Scrolls so the section sits at progress p (0 to 1). */
  const scrollToProgress = useCallback((p: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dist = r.height - window.innerHeight;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: window.scrollY + r.top + Math.max(0, Math.min(1, p)) * dist, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return { ref, refresh, scrollToProgress };
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
