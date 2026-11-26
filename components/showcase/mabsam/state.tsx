"use client";

// MABSAM's shared state: language, the finder answers (kept across visits) and the open overlay.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { UI, type Lang, type UIStrings } from "@/lib/showcase/mabsam";

export type Finder = { concerns: string[]; nerves: string; span: number };
const DEFAULT_FINDER: Finder = { concerns: ["checkup"], nerves: "little", span: 1 };
import { usePersist } from "../kit/hooks";

type Overlay = "menu" | "notice" | null;

interface Ctx {
  lang: Lang;
  t: UIStrings;
  setLang: (l: Lang) => void;
  finder: Finder;
  setFinder: (fn: (b: Finder) => Finder) => void;
  overlay: Overlay;
  open: (o: Overlay) => void;
}

const C = createContext<Ctx | null>(null);

export function MabsamProvider({ children }: { children: ReactNode }) {
  const [lang, setLangRaw] = usePersist<Lang>("mabsam.lang", "en");
  const [finder, setFinderRaw] = usePersist<Finder>("mabsam.finder.v1", DEFAULT_FINDER);
  const setFinder = useCallback((fn: (b: Finder) => Finder) => setFinderRaw((b) => fn({ ...DEFAULT_FINDER, ...b })), [setFinderRaw]);
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
    document.documentElement.classList.toggle("mb-locked", overlay !== null);
    return () => document.documentElement.classList.remove("mb-locked");
  }, [overlay]);

  const t = UI[lang] as UIStrings;
  const value = useMemo(
    () => ({ lang, t, setLang, finder: { ...DEFAULT_FINDER, ...finder }, setFinder, overlay, open }),
    [lang, t, setLang, finder, setFinder, overlay, open],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useMabsam() {
  const c = useContext(C);
  if (!c) throw new Error("useMabsam outside MabsamProvider");
  return c;
}
