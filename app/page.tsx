"use client";
// app/page.tsx — Zenith Dubai CV homepage.
// Order: the drawing (hero) → the five-stage method (scroll story) → proof of craft (CV designs, on paper) → packages →
// the AI job agent → profile photos → portfolio websites → the Zenith Standard (trust) → questions → contact.

import React, { Suspense, useCallback, useEffect, useLayoutEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import SiteHeader from "@/components/site/SiteHeader";
import HeroDrawing from "@/components/site/HeroDrawing";
import JourneyStory from "@/components/site/JourneyStory";
import CvShowcase from "@/components/site/CvShowcase";
import Packages from "@/components/site/Packages";
import Faq from "@/components/site/Faq";
import ZenithStandard from "@/components/site/ZenithStandard";
import SiteFooter, { ContactSection } from "@/components/site/ContactFooter";
import EnquiryModal from "@/components/site/EnquiryModal";
import PhotoSection from "@/components/site/PhotoSection";
import WebsiteService from "@/components/site/WebsiteService";
import PortfolioShowcase from "@/components/sections/portfolio-showcase";
import { CURRENCIES, FALLBACK_RATES, isCurrency, type Currency, type Rates } from "@/lib/currency";
import { isLang, type Lang } from "@/lib/site";

// Below the fold, so it ships in its own bundle (still rendered on the server).
const AgentSection = dynamic(() => import("@/components/site/AgentSection"));

const SKIP: Record<Lang, string> = { en: "Skip to content", fr: "Aller au contenu", ar: "انتقل إلى المحتوى" };

export default function Home() {
  // Theme: the layout's inline script sets html[data-theme] before the first paint; this state
  // mirrors it for the sections that still take a `dark` prop.
  const [dark, setDark] = useState(true);
  const [lang, setLangState] = useState<Lang>("en");
  const [currency, setCurrency] = useState<Currency>("AED");
  const [rates, setRates] = useState<Rates>(FALLBACK_RATES);
  const [enquiry, setEnquiry] = useState(false);

  useLayoutEffect(() => {
    // Browser-only preferences, read after hydration so the server and client render the same first.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.dataset.theme !== "light");
    // Language: a ?lang=fr or ?lang=ar link (from a French or Arabic post, for example) wins and is
    // remembered; otherwise the language chosen earlier on any Zenith page.
    const fromLink = new URLSearchParams(window.location.search).get("lang");
    if (isLang(fromLink)) setLangState(fromLink);
    try {
      if (isLang(fromLink)) localStorage.setItem("z-lang", fromLink);
      else { const saved = localStorage.getItem("z-lang"); if (isLang(saved)) setLangState(saved); }
      const cur = localStorage.getItem("z-currency");
      if (isCurrency(cur)) setCurrency(cur);
    } catch { /* storage blocked: keep defaults */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // Live exchange rates for display only; checkout always charges from the AED catalog.
  useEffect(() => {
    let cancelled = false;
    fetch("https://open.er-api.com/v6/latest/AED")
      .then(r => r.json())
      .then(d => {
        if (cancelled || d?.result !== "success" || !d.rates) return;
        const next: Rates = { ...FALLBACK_RATES };
        CURRENCIES.forEach(c => { if (typeof d.rates[c.code] === "number") next[c.code] = d.rates[c.code]; });
        setRates(next);
      })
      .catch(() => { /* keep fallback rates */ });
    return () => { cancelled = true; };
  }, []);

  const toggleTheme = useCallback(() => {
    setDark(d => {
      const next = !d;
      document.documentElement.dataset.theme = next ? "dark" : "light";
      try { localStorage.setItem("z-theme", next ? "dark" : "light"); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("z-lang", l); } catch { /* ignore */ }
  }, []);

  const chooseCurrency = useCallback((c: Currency) => {
    setCurrency(c);
    try { localStorage.setItem("z-currency", c); } catch { /* ignore */ }
  }, []);

  const openEnquiry = useCallback(() => setEnquiry(true), []);
  const closeEnquiry = useCallback(() => setEnquiry(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="zs" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
        <a href="#main" className="z-skip">{SKIP[lang]}</a>
        <SiteHeader lang={lang} setLang={setLang} dark={dark} toggleTheme={toggleTheme} />
        <main id="main" tabIndex={-1}>
          <div id="top" />
          <HeroDrawing lang={lang} />
          <JourneyStory lang={lang} />
          <div className="zs-paper">
            <CvShowcase lang={lang} />
          </div>
          <Packages lang={lang} currency={currency} rates={rates} onCurrency={chooseCurrency} />
          {/* Its own boundary: the lazy bundle hydrates on its own and never holds up the rest of the page. */}
          <Suspense fallback={null}>
            <AgentSection lang={lang} />
          </Suspense>
          <PhotoSection lang={lang} />
          <React.Fragment key={lang}>
            <PortfolioShowcase dark={dark} lang={lang} />
          </React.Fragment>
          <WebsiteService lang={lang} onEnquire={openEnquiry} currency={currency} rates={rates} />
          <ZenithStandard lang={lang} withFounder />
          <Faq lang={lang} />
          <ContactSection lang={lang} onEnquire={openEnquiry} />
        </main>
        <SiteFooter lang={lang} />
        <EnquiryModal open={enquiry} onClose={closeEnquiry} lang={lang} />
      </div>
    </MotionConfig>
  );
}
