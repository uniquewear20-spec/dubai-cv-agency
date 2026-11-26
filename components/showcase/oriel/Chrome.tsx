"use client";

// The frame around ORIEL 88: the mark (the tower's crown between two fins), the bar, the menu,
// the concept notice, the cursor and the footer.

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Cursor } from "../kit/Cursor";
import { useDialog } from "../kit/hooks";
import { OrielProvider, useOriel } from "./state";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="or-mark">
      <path d="M10 30V8a6 6 0 0 1 12 0v22" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M13 30V12M16 30V10M19 30V12" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 30H28" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function Logo() {
  const { lang } = useOriel();
  return (
    <span className="or-logo">
      <Mark />
      <span className="or-logo-word">{lang === "ar" ? "أوريل ٨٨" : "ORIEL 88"}</span>
    </span>
  );
}

const NAV = ["tower", "homes", "interiors", "amenities", "area", "contact"] as const;

function LangSwitch() {
  const { lang, setLang, t } = useOriel();
  return (
    <button type="button" className="or-lang" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")}>
      {t.langName}
    </button>
  );
}

function Bar() {
  const { t, open } = useOriel();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(scrollY > innerHeight * 0.6);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`or-bar${solid ? " is-solid" : ""}`}>
      <a href="#top" className="or-bar-logo" aria-label="ORIEL 88">
        <Logo />
      </a>
      <nav className="or-bar-nav" aria-label={t.menu}>
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <LangSwitch />
      <button type="button" className="or-burger" onClick={() => open("menu")} aria-label={t.menu}>
        <span />
        <span />
      </button>
    </header>
  );
}

function Menu() {
  const { overlay, open, t } = useOriel();
  const isOpen = overlay === "menu";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="or-sheet" role="dialog" aria-modal="true" aria-label={t.menu} ref={box}>
      <div className="or-sheet-top">
        <Logo />
        <button type="button" className="or-close" onClick={() => open(null)} data-autofocus>
          {t.close}
        </button>
      </div>
      <nav className="or-sheet-nav">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`} onClick={() => open(null)}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <div className="or-sheet-foot">
        <LangSwitch />
        <a href="/showcase/">{t.backToGallery}</a>
      </div>
    </div>
  );
}

function Notice() {
  const { overlay, open, t } = useOriel();
  const isOpen = overlay === "notice";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="or-modal" role="dialog" aria-modal="true" aria-labelledby="or-notice-h">
      <button type="button" className="or-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="or-modal-box" ref={box}>
        <Mark size={40} />
        <h2 id="or-notice-h">{t.noticeTitle}</h2>
        <p>{t.noticeBody}</p>
        <div className="or-modal-actions">
          <button type="button" className="or-btn or-btn-sun" onClick={() => open(null)} data-autofocus>
            {t.noticeCta}
          </button>
          <Link href="/" className="or-btn or-btn-line">
            {t.noticeZenith}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useOriel();
  return (
    <footer className="or-footer">
      <Logo />
      <p className="or-footer-tag">{t.tagline}</p>
      <nav className="or-footer-nav" aria-label="ORIEL 88">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <p className="or-footer-note">{t.footer}</p>
      <p className="or-footer-note">
        <a href="/showcase/">{t.footerBy}</a>
      </p>
    </footer>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { lang, t } = useOriel();
  return (
    <div className="or" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} id="top">
      <a href="#homes" className="or-skip">
        {t.skip}
      </a>
      <Bar />
      <Menu />
      <Notice />
      <a className="or-concept" href="#faq" aria-label={t.concept}>
        <Mark size={14} />
        <span className="or-concept-long">{t.concept}</span>
        <span className="or-concept-short" aria-hidden>
          {t.conceptShort}
        </span>
      </a>
      <Cursor prefix="or" />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <OrielProvider>
      <Frame>{children}</Frame>
    </OrielProvider>
  );
}
