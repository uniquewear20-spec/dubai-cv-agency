"use client";

// Shared by the concept sites: a dot that follows the pointer and a ring that trails it. The ring
// takes the state of the nearest [data-cursor] element (link, drag, explore...), so each site styles
// `.<prefix>-cursor-ring[data-state=...]` its own way. Fine pointers only; off for reduced motion.

import { useEffect, useRef, type ReactNode } from "react";

export function Cursor({ prefix, children }: { prefix: string; children?: ReactNode }) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fine = matchMedia("(pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce || !dot.current || !ring.current) return;
    const cls = `${prefix}-has-cursor`;
    document.documentElement.classList.add(cls);
    let mx = innerWidth / 2,
      my = innerHeight / 2,
      rx = mx,
      ry = my,
      raf = 0,
      visible = false;
    const d = dot.current;
    const r = ring.current;
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      d.style.transform = `translate3d(${mx}px,${my}px,0)`;
      if (!visible) {
        visible = true;
        d.style.opacity = "1";
        r.style.opacity = "1";
      }
      const el = e.target as HTMLElement;
      const state = el.closest("[data-cursor]")?.getAttribute("data-cursor") ?? (el.closest("a,button,[role=button],input,select,textarea,label") ? "link" : "");
      r.dataset.state = state;
      d.dataset.state = state;
    };
    const leave = () => {
      visible = false;
      d.style.opacity = "0";
      r.style.opacity = "0";
    };
    const tick = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      r.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove(cls);
    };
  }, [prefix]);
  return (
    <>
      <div ref={ring} className={`${prefix}-cursor-ring`} aria-hidden>
        {children}
      </div>
      <div ref={dot} className={`${prefix}-cursor-dot`} aria-hidden />
    </>
  );
}
