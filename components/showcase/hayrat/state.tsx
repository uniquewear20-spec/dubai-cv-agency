"use client";

// HAYRAT's shared state: the language, the stay being put together (kept across visits) and which
// overlay is open (menu, booking drawer or the concept notice).

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EMPTY_STAY, UI, type Lang, type Stay, type UIStrings } from "@/lib/showcase/hayrat";
import { usePersist } from "../kit/hooks";

type Overlay = "menu" | "book" | "notice" | null;

interface Ctx {
  lang: Lang;
  t: UIStrings;
  setLang: (l: Lang) => void;
  stay: Stay;
  setStay: (fn: (s: Stay) => Stay) => void;
  overlay: Overlay;
  open: (o: Overlay) => void;
}

const C = createContext<Ctx | null>(null);

export function HayratProvider({ children }: { children: ReactNode }) {
  const [lang, setLangRaw] = usePersist<Lang>("hayrat.lang", "en");
  const [stay, setStayRaw] = usePersist<Stay>("hayrat.stay.v1", EMPTY_STAY);
  const [overlay, setOverlay] = useState<Overlay>(null);

  const setLang = useCallback((l: Lang) => setLangRaw(l), [setLangRaw]);
  const setStay = useCallback((fn: (s: Stay) => Stay) => setStayRaw((s) => fn({ ...EMPTY_STAY, ...s })), [setStayRaw]);
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
    document.documentElement.classList.toggle("hy-locked", overlay !== null);
    return () => document.documentElement.classList.remove("hy-locked");
  }, [overlay]);

  // The UI type is the English shape; Arabic has the same keys.
  const t = UI[lang] as UIStrings;
  const value = useMemo(() => ({ lang, t, setLang, stay: { ...EMPTY_STAY, ...stay }, setStay, overlay, open }), [lang, t, setLang, stay, setStay, overlay, open]);
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useHayrat() {
  const c = useContext(C);
  if (!c) throw new Error("useHayrat outside HayratProvider");
  return c;
}
