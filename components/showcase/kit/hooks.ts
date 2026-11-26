"use client";

// Shared by the concept sites: small hooks every site needs.

import { useEffect, useRef, useState } from "react";

/** Adds .is-in once the element scrolls into view (once). Reduced motion shows it at once. */
export function useReveal<T extends HTMLElement>(margin = "-12% 0px") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es)
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    const force = () => el.classList.add("is-in");
    addEventListener("concept:snap", force);
    return () => {
      io.disconnect();
      removeEventListener("concept:snap", force);
    };
  }, [margin]);
  return ref;
}

/** useState that survives a reload. Reads after mount so server and client render the same. */
export function usePersist<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setV(JSON.parse(raw) as T);
    } catch {
      /* storage can be blocked; the default is fine */
    }
    loaded.current = true;
  }, [key]);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  }, [key, v]);
  return [v, setV] as const;
}

/** Closes on Escape and moves focus into the box when `open` turns true. */
export function useDialog(open: boolean, close: () => void) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>("[data-autofocus],a,button,input,select,textarea")?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("keydown", esc);
    return () => {
      removeEventListener("keydown", esc);
      prev?.focus?.();
    };
  }, [open, close]);
  return box;
}

/** True once the page has scrolled past `fraction` of the viewport height. */
export function useScrolledPast(fraction = 0.6) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const on = () => setPast(window.scrollY > window.innerHeight * fraction);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, [fraction]);
  return past;
}
