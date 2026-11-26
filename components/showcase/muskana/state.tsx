"use client";

// MUSKANA's shared state: language, the blend and the bag (kept across visits) and the open overlay.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_BLEND, UI, type Blend, type Lang, type UIStrings } from "@/lib/showcase/muskana";
import { usePersist } from "../kit/hooks";

type Overlay = "menu" | "notice" | "bag" | null;
export type Line = { id: string; qty: number };

interface Ctx {
  lang: Lang;
  t: UIStrings;
  setLang: (l: Lang) => void;
  blend: Blend;
  setBlend: (fn: (b: Blend) => Blend) => void;
  bag: Line[];
  setBag: (fn: (b: Line[]) => Line[]) => void;
  overlay: Overlay;
  open: (o: Overlay) => void;
}

const C = createContext<Ctx | null>(null);

export function MuskanaProvider({ children }: { children: ReactNode }) {
  const [lang, setLangRaw] = usePersist<Lang>("muskana.lang", "en");
  const [blend, setBlendRaw] = usePersist<Blend>("muskana.blend.v1", DEFAULT_BLEND);
  const setBlend = useCallback((fn: (b: Blend) => Blend) => setBlendRaw((b) => fn({ ...DEFAULT_BLEND, ...b })), [setBlendRaw]);
  const [bag, setBagRaw] = usePersist<Line[]>("muskana.bag.v1", []);
  const setBag = useCallback((fn: (b: Line[]) => Line[]) => setBagRaw((b) => fn(Array.isArray(b) ? b : [])), [setBagRaw]);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const setLang = useCallback((l: Lang) => setLangRaw(l), [setLangRaw]);
  const open = useCallback((o: Overlay) => setOverlay(o), []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    return () => {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    };
  }, [lang]);
  useEffect(() => {
    document.documentElement.classList.toggle("mu-locked", overlay !== null);
    return () => document.documentElement.classList.remove("mu-locked");
  }, [overlay]);

  const t = UI[lang] as UIStrings;
  const value = useMemo(
    () => ({ lang, t, setLang, blend: { ...DEFAULT_BLEND, ...blend }, setBlend, bag, setBag, overlay, open }),
    [lang, t, setLang, blend, setBlend, bag, setBag, overlay, open],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useMuskana() {
  const c = useContext(C);
  if (!c) throw new Error("useMuskana outside MuskanaProvider");
  return c;
}
