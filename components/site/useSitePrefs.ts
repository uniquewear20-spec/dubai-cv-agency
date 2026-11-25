"use client";
// components/site/useSitePrefs.ts — language and theme for pages outside the homepage.
// Same rules as the homepage: ?lang= wins and is remembered, otherwise the saved z-lang;
// the theme is set before first paint by the layout script and mirrored here.

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { isLang, type Lang } from "@/lib/site";

export function useSitePrefs() {
  const [dark, setDark] = useState(true);
  const [lang, setLangState] = useState<Lang>("en");

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.dataset.theme !== "light");
    const fromLink = new URLSearchParams(window.location.search).get("lang");
    if (isLang(fromLink)) setLangState(fromLink);
    try {
      if (isLang(fromLink)) localStorage.setItem("z-lang", fromLink);
      else {
        const saved = localStorage.getItem("z-lang");
        if (isLang(saved)) setLangState(saved);
      }
    } catch { /* storage blocked: keep defaults */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("z-lang", l); } catch { /* ignore */ }
  }, []);

  const toggleTheme = useCallback(() => {
    setDark(d => {
      const next = !d;
      document.documentElement.dataset.theme = next ? "dark" : "light";
      try { localStorage.setItem("z-theme", next ? "dark" : "light"); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return { dark, lang, setLang, toggleTheme };
}
