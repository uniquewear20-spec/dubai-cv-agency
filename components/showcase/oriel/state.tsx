"use client";

// ORIEL 88's shared state: language, the chosen floor (kept across visits) and the open overlay.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { UI, type Lang, type UIStrings } from "@/lib/showcase/oriel";
import { usePersist } from "../kit/hooks";

type Overlay = "menu" | "notice" | null;

interface Ctx {
  lang: Lang;
  t: UIStrings;
  setLang: (l: Lang) => void;
  floor: number;
  setFloor: (f: number) => void;
  overlay: Overlay;
  open: (o: Overlay) => void;
}

const C = createContext<Ctx | null>(null);

export function OrielProvider({ children }: { children: ReactNode }) {
  const [lang, setLangRaw] = usePersist<Lang>("oriel-88.lang", "en");
  const [floor, setFloor] = usePersist<number>("oriel-88.floor", 44);
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
    document.documentElement.classList.toggle("or-locked", overlay !== null);
    return () => document.documentElement.classList.remove("or-locked");
  }, [overlay]);

  const t = UI[lang] as UIStrings;
  const value = useMemo(
    () => ({ lang, t, setLang, floor, setFloor, overlay, open }),
    [lang, t, setLang, floor, setFloor, overlay, open],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useOriel() {
  const c = useContext(C);
  if (!c) throw new Error("useOriel outside OrielProvider");
  return c;
}
