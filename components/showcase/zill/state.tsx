"use client";

// ZILL's shared state: language, the brief (kept across visits) and the open overlay.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EMPTY_BRIEF, UI, type Brief, type Lang, type UIStrings } from "@/lib/showcase/zill";
import { usePersist } from "../kit/hooks";

type Overlay = "menu" | "notice" | { project: string } | null;

interface Ctx {
  lang: Lang;
  t: UIStrings;
  setLang: (l: Lang) => void;
  brief: Brief;
  setBrief: (fn: (b: Brief) => Brief) => void;
  overlay: Overlay;
  open: (o: Overlay) => void;
}

const C = createContext<Ctx | null>(null);

export function ZillProvider({ children }: { children: ReactNode }) {
  const [lang, setLangRaw] = usePersist<Lang>("zill.lang", "en");
  const [brief, setBriefRaw] = usePersist<Brief>("zill.brief.v1", EMPTY_BRIEF);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const setLang = useCallback((l: Lang) => setLangRaw(l), [setLangRaw]);
  const setBrief = useCallback((fn: (b: Brief) => Brief) => setBriefRaw((b) => fn({ ...EMPTY_BRIEF, ...b })), [setBriefRaw]);
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
    document.documentElement.classList.toggle("zl-locked", overlay !== null);
    return () => document.documentElement.classList.remove("zl-locked");
  }, [overlay]);

  const t = UI[lang] as UIStrings;
  const value = useMemo(
    () => ({ lang, t, setLang, brief: { ...EMPTY_BRIEF, ...brief }, setBrief, overlay, open }),
    [lang, t, setLang, brief, setBrief, overlay, open],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useZill() {
  const c = useContext(C);
  if (!c) throw new Error("useZill outside ZillProvider");
  return c;
}
