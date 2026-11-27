"use client";

// ALBORA's shared state: language, the open overlay, the residence on the plan, the subject of a
// call and the picture open in the gallery. Language and the chosen residence are kept in
// localStorage only; the site sets no cookies, so it needs no consent banner.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { UI, type Lang, type UIStrings } from "@/lib/showcase/albora";
import { useScrollStage } from "../useScrollStage";
import { usePersist } from "../kit/hooks";

export type Overlay = "menu" | "notice" | "home" | "gallery" | null;

interface Ctx {
  lang: Lang;
  t: UIStrings;
  setLang: (l: Lang) => void;
  overlay: Overlay;
  open: (o: Overlay) => void;
  home: string;
  setHome: (code: string) => void;
  about: string;
  setAbout: (code: string) => void;
  shot: number;
  setShot: (i: number) => void;
}

const C = createContext<Ctx | null>(null);

export function AlboraProvider({ children }: { children: ReactNode }) {
  const [lang, setLangRaw] = usePersist<Lang>("albora.lang", "en");
  const [home, setHome] = usePersist<string>("albora.home", "");
  const [about, setAbout] = useState("");
  const [shot, setShot] = useState(0);
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
    document.documentElement.classList.toggle("al-locked", overlay !== null);
    return () => document.documentElement.classList.remove("al-locked");
  }, [overlay]);

  const t = UI[lang];
  const value = useMemo(
    () => ({ lang, t, setLang, overlay, open, home, setHome, about, setAbout, shot, setShot }),
    [lang, t, setLang, overlay, open, home, setHome, about, setAbout, shot],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useAlbora() {
  const c = useContext(C);
  if (!c) throw new Error("useAlbora outside AlboraProvider");
  return c;
}

/** A pinned scene: writes its scroll progress to the element's --p, so CSS does the motion. */
export function useP<T extends HTMLElement>(id: string, ease = 0.12) {
  return useScrollStage<T>((p) => {
    document.getElementById(id)?.style.setProperty("--p", p.toFixed(4));
  }, ease);
}
