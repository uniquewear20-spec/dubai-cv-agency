"use client";

// Shared state for the TIFAWT concept: language, the bag (kept in localStorage so it follows the
// visitor from the home page to a product page), and which overlay is open.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { COFFRETS, PRODUCTS, UI, type Lang, type UIStrings } from "@/lib/showcase/tifawt";

export type BagLine = { id: string; qty: number };
type Overlay = null | "bag" | "checkout" | "menu";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: UIStrings;
  bag: BagLine[];
  add: (id: string, qty?: number) => void;
  addMany: (ids: string[]) => void;
  setQty: (id: string, qty: number) => void;
  count: number;
  subtotal: number;
  overlay: Overlay;
  open: (o: Overlay) => void;
  toast: string | null;
}

const C = createContext<Ctx | null>(null);
const BAG_KEY = "tifawt.bag.v1";
const LANG_KEY = "tifawt.lang";

export const priceOf = (id: string) =>
  PRODUCTS.find((p) => p.slug === id)?.price ?? COFFRETS.find((c) => c.id === id)?.price ?? 0;
export const nameOf = (id: string) => PRODUCTS.find((p) => p.slug === id)?.name ?? COFFRETS.find((c) => c.id === id)?.name ?? id;

export function TifawtProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [bag, setBag] = useState<BagLine[]>([]);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [toast, setToast] = useState<string | null>(null);
  const loaded = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BAG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BagLine[];
        if (Array.isArray(parsed)) setBag(parsed.filter((l) => l && typeof l.id === "string" && l.qty > 0 && priceOf(l.id) > 0));
      }
      const l = localStorage.getItem(LANG_KEY);
      if (l === "ar" || l === "en") setLangState(l);
    } catch {
      /* storage can be unavailable (private mode); the bag then lives for this page only */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(BAG_KEY, JSON.stringify(bag));
    } catch {
      /* ignore */
    }
  }, [bag]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const add = useCallback(
    (id: string, qty = 1) => {
      setBag((b) => {
        const hit = b.find((l) => l.id === id);
        return hit ? b.map((l) => (l.id === id ? { ...l, qty: Math.min(9, l.qty + qty) } : l)) : [...b, { id, qty }];
      });
      flash(nameOf(id));
    },
    [flash],
  );

  const addMany = useCallback(
    (ids: string[]) => {
      setBag((b) => {
        let next = [...b];
        for (const id of ids) {
          const hit = next.find((l) => l.id === id);
          next = hit ? next.map((l) => (l.id === id ? { ...l, qty: Math.min(9, l.qty + 1) } : l)) : [...next, { id, qty: 1 }];
        }
        return next;
      });
      flash(ids.map(nameOf).join(" · "));
    },
    [flash],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setBag((b) => (qty <= 0 ? b.filter((l) => l.id !== id) : b.map((l) => (l.id === id ? { ...l, qty: Math.min(9, qty) } : l))));
  }, []);

  const value = useMemo<Ctx>(() => {
    const count = bag.reduce((s, l) => s + l.qty, 0);
    const subtotal = bag.reduce((s, l) => s + l.qty * priceOf(l.id), 0);
    return { lang, setLang, t: UI[lang] as UIStrings, bag, add, addMany, setQty, count, subtotal, overlay, open: setOverlay, toast };
  }, [lang, setLang, bag, add, addMany, setQty, overlay, toast]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useTifawt() {
  const v = useContext(C);
  if (!v) throw new Error("useTifawt outside TifawtProvider");
  return v;
}
