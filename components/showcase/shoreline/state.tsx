"use client";

// SHORELINE NO. 9's shared state: language and the open overlay.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { UI, type Lang, type UIStrings } from "@/lib/showcase/shoreline";
import { usePersist } from "../kit/hooks";

type Overlay = "menu" | "notice" | null;

interface Ctx {
  lang: Lang;
  t: UIStrings;
  setLang: (l: Lang) => void;
  overlay: Overlay;
  open: (o: Overlay) => void;
}

const C = createContext<Ctx | null>(null);

export function ShoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangRaw] = usePersist<Lang>("shoreline-9.lang", "en");
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
    document.documentElement.classList.toggle("sh-locked", overlay !== null);
    return () => document.documentElement.classList.remove("sh-locked");
  }, [overlay]);

  const t = UI[lang] as UIStrings;
  const value = useMemo(
    () => ({ lang, t, setLang, overlay, open }),
    [lang, t, setLang, overlay, open],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useShore() {
  const c = useContext(C);
  if (!c) throw new Error("useShore outside ShoreProvider");
  return c;
}
