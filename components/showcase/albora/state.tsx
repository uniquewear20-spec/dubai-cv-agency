"use client";

// ALBORA's shared state: language, the open overlay, the residence on the plan, the subject of a
// call and the picture open in the gallery. Language and the chosen residence are kept in
// localStorage only; the site sets no cookies, so it needs no consent banner.

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { UI, type Lang, type UIStrings } from "@/lib/showcase/albora";
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

/* ───────── one scroll engine for the whole page ───────── */
// Each scene is measured once, and again only when the page changes size, so a scroll frame reads
// nothing but scrollY and writes a few CSS variables: no layout work per frame, which keeps Safari
// smooth. "pin" scenes report progress through their sticky stage, "pass" scenes from the moment
// they enter the screen until they leave it. Photos marked data-px drift inside their frames.

type Kind = "pin" | "pass";
interface Scene {
  el: HTMLElement;
  kind: Kind;
  top: number;
  h: number;
  cur: number;
  last: string;
  open: boolean;
}
const scenes = new Set<Scene>();
let layers: { el: HTMLElement; top: number; h: number; amt: number }[] = [];
let rail: HTMLElement | null = null;
let railNum: HTMLElement | null = null;
let raf = 0;
let vh = 1;
let maxY = 1;
let snapNext = false;
let ro: ResizeObserver | null = null;
const EASE = 0.16;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function measure() {
  vh = window.innerHeight || 1;
  const y = window.scrollY;
  scenes.forEach((s) => {
    const r = s.el.getBoundingClientRect();
    s.top = r.top + y;
    s.h = r.height;
  });
  layers = Array.from(document.querySelectorAll<HTMLElement>("[data-px]")).map((el) => {
    const r = (el.parentElement ?? el).getBoundingClientRect();
    return { el, top: r.top + y, h: r.height, amt: Number(el.dataset.px) || 0.08 };
  });
  rail = document.getElementById("al-rail");
  railNum = rail?.querySelector<HTMLElement>("[data-count]") ?? null;
  maxY = Math.max(1, document.documentElement.scrollHeight - vh);
}

function frame() {
  raf = 0;
  const y = window.scrollY;
  const still = reduced();
  let again = false;
  scenes.forEach((s) => {
    const d = s.kind === "pin" ? s.h - vh : s.h + vh;
    const target = d <= 0 ? 0 : clamp01(s.kind === "pin" ? (y - s.top) / d : (y + vh - s.top) / d);
    if (still || snapNext || s.cur < 0) s.cur = target;
    else s.cur += (target - s.cur) * EASE;
    if (Math.abs(target - s.cur) < 0.0004) s.cur = target;
    else again = true;
    const v = s.cur.toFixed(4);
    if (v !== s.last) {
      s.el.style.setProperty("--p", v);
      s.last = v;
    }
    const open = s.cur > 0.5;
    if (open !== s.open) {
      s.open = open;
      s.el.dataset.open = open ? "1" : "0";
    }
  });
  for (const l of layers) {
    const top = l.top - y;
    if (top > vh || top + l.h < 0) continue;
    const prog = (top + l.h / 2 - vh / 2) / (vh / 2 + l.h / 2);
    l.el.style.transform = still ? "" : `translate3d(0, ${(-prog * l.amt * l.h).toFixed(1)}px, 0)`;
  }
  if (rail) {
    const v = clamp01(y / maxY);
    rail.style.setProperty("--v", v.toFixed(4));
    if (railNum) railNum.textContent = String(Math.round(v * 99)).padStart(2, "0");
  }
  snapNext = false;
  if (again) raf = requestAnimationFrame(frame);
}

const kick = () => {
  if (!raf) raf = requestAnimationFrame(frame);
};
const remeasure = () => {
  measure();
  kick();
};
const onSnap = () => {
  measure();
  snapNext = true;
  if (raf) cancelAnimationFrame(raf);
  frame();
};

function bind() {
  if (ro) return;
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", remeasure);
  addEventListener("concept:snap", onSnap);
  ro = new ResizeObserver(remeasure);
  ro.observe(document.body);
  document.fonts?.ready.then(remeasure).catch(() => {});
}
function unbind() {
  if (!ro) return;
  removeEventListener("scroll", kick);
  removeEventListener("resize", remeasure);
  removeEventListener("concept:snap", onSnap);
  ro.disconnect();
  ro = null;
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  layers = [];
  rail = railNum = null;
}

/** Ref for a scene: its progress (0 to 1) is written to the element's --p on every frame. */
export function useScene(kind: Kind = "pin") {
  return useCallback(
    (el: HTMLElement | null) => {
      if (!el) return;
      const s: Scene = { el, kind, top: 0, h: 0, cur: -1, last: "", open: false };
      scenes.add(s);
      bind();
      remeasure();
      return () => {
        scenes.delete(s);
        if (!scenes.size) unbind();
      };
    },
    [kind],
  );
}

/** Current progress of a scene, by the section's id. */
export function sceneProgress(id: string) {
  for (const s of scenes) if (s.el.id === id) return s.cur < 0 ? 0 : s.cur;
  return 0;
}

/** Scrolls so a pinned scene sits at progress p. */
export function goToScene(id: string, p: number) {
  for (const s of scenes) {
    if (s.el.id !== id) continue;
    const d = Math.max(0, s.h - vh);
    window.scrollTo({ top: s.top + clamp01(p) * d, behavior: reduced() ? "auto" : "smooth" });
  }
}
