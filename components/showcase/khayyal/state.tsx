"use client";

// KHAYYAL's shared state: language, the build (kept across visits) and the open overlay.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_BUILD, UI, type Build, type Lang, type UIStrings } from "@/lib/showcase/khayyal";
import { usePersist } from "../kit/hooks";

type Overlay = "menu" | "notice" | null;

interface Ctx {
  lang: Lang;
  t: UIStrings;
  setLang: (l: Lang) => void;
  build: Build;
  setBuild: (fn: (b: Build) => Build) => void;
  overlay: Overlay;
  open: (o: Overlay) => void;
}

const C = createContext<Ctx | null>(null);

export function KhayyalProvider({ children }: { children: ReactNode }) {
  const [lang, setLangRaw] = usePersist<Lang>("khayyal.lang", "en");
  const [build, setBuildRaw] = usePersist<Build>("khayyal.build.v1", DEFAULT_BUILD);
  const setBuild = useCallback((fn: (b: Build) => Build) => setBuildRaw((b) => fn({ ...DEFAULT_BUILD, ...b })), [setBuildRaw]);
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
    document.documentElement.classList.toggle("kh-locked", overlay !== null);
    return () => document.documentElement.classList.remove("kh-locked");
  }, [overlay]);

  const t = UI[lang] as UIStrings;
  const value = useMemo(
    () => ({ lang, t, setLang, build: { ...DEFAULT_BUILD, ...build }, setBuild, overlay, open }),
    [lang, t, setLang, build, setBuild, overlay, open],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useKhayyal() {
  const c = useContext(C);
  if (!c) throw new Error("useKhayyal outside KhayyalProvider");
  return c;
}
