"use client";

// MAWQID's shared state: the language, the reservation being put together and the gift card (both
// kept across visits), and which overlay is open (menu or the concept notice).

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EMPTY_BOOKING, EMPTY_GIFT, UI, type Booking, type Gift, type Lang, type UIStrings } from "@/lib/showcase/mawqid";
import { usePersist } from "../kit/hooks";

type Overlay = "menu" | "notice" | null;

interface Ctx {
  lang: Lang;
  t: UIStrings;
  setLang: (l: Lang) => void;
  booking: Booking;
  setBooking: (fn: (b: Booking) => Booking) => void;
  gift: Gift;
  setGift: (fn: (g: Gift) => Gift) => void;
  overlay: Overlay;
  open: (o: Overlay) => void;
}

const C = createContext<Ctx | null>(null);

export function MawqidProvider({ children }: { children: ReactNode }) {
  const [lang, setLangRaw] = usePersist<Lang>("mawqid.lang", "en");
  const [booking, setBookingRaw] = usePersist<Booking>("mawqid.booking.v1", EMPTY_BOOKING);
  const [gift, setGiftRaw] = usePersist<Gift>("mawqid.gift.v1", EMPTY_GIFT);
  const [overlay, setOverlay] = useState<Overlay>(null);

  const setLang = useCallback((l: Lang) => setLangRaw(l), [setLangRaw]);
  const setBooking = useCallback((fn: (b: Booking) => Booking) => setBookingRaw((b) => fn({ ...EMPTY_BOOKING, ...b })), [setBookingRaw]);
  const setGift = useCallback((fn: (g: Gift) => Gift) => setGiftRaw((g) => fn({ ...EMPTY_GIFT, ...g })), [setGiftRaw]);
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
    document.documentElement.classList.toggle("mq-locked", overlay !== null);
    return () => document.documentElement.classList.remove("mq-locked");
  }, [overlay]);

  const t = UI[lang] as UIStrings;
  const value = useMemo(
    () => ({ lang, t, setLang, booking: { ...EMPTY_BOOKING, ...booking }, setBooking, gift: { ...EMPTY_GIFT, ...gift }, setGift, overlay, open }),
    [lang, t, setLang, booking, setBooking, gift, setGift, overlay, open],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useMawqid() {
  const c = useContext(C);
  if (!c) throw new Error("useMawqid outside MawqidProvider");
  return c;
}
