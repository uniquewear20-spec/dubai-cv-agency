"use client";

// The frame around THAHAB: the mark (a tent on a dune under a crescent), the bar, the menu, the
// concept notice, the cursor and the footer.

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Cursor } from "../kit/Cursor";
import { useDialog } from "../kit/hooks";
import { ThahabProvider, useThahab } from "./state";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="th-mark">
      <path d="M2 27c6-5 12-6 28-2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 24l7-11 7 11Z" fill="currentColor" />
      <path d="M24 4a5 5 0 1 0 4 8 4 4 0 1 1-4-8Z" fill="currentColor" />
    </svg>
  );
}

export function Logo() {
  const { lang } = useThahab();
  return (
    <span className="th-logo">
      <Mark />
      <span className="th-logo-word">{lang === "ar" ? "ذَهَب" : "THAHAB"}</span>
    </span>
  );
}

const NAV = ["day", "tents", "dining", "sky", "arrive", "contact"] as const;

function LangSwitch() {
  const { lang, setLang, t } = useThahab();
  return (
    <button type="button" className="th-lang" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")}>
      {t.langName}
    </button>
  );
}

function Bar() {
  const { t, open } = useThahab();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(scrollY > innerHeight * 0.6);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`th-bar${solid ? " is-solid" : ""}`}>
      <a href="#top" className="th-bar-logo" aria-label="THAHAB">
        <Logo />
      </a>
      <nav className="th-bar-nav" aria-label={t.menu}>
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <LangSwitch />
      <button type="button" className="th-burger" onClick={() => open("menu")} aria-label={t.menu}>
        <span />
        <span />
      </button>
    </header>
  );
}

function Menu() {
  const { overlay, open, t } = useThahab();
  const isOpen = overlay === "menu";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="th-sheet" role="dialog" aria-modal="true" aria-label={t.menu} ref={box}>
      <div className="th-sheet-top">
        <Logo />
        <button type="button" className="th-close" onClick={() => open(null)} data-autofocus>
          {t.close}
        </button>
      </div>
      <nav className="th-sheet-nav">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`} onClick={() => open(null)}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <div className="th-sheet-foot">
        <LangSwitch />
        <a href="/showcase/">{t.backToGallery}</a>
      </div>
    </div>
  );
}

function Notice() {
  const { overlay, open, t } = useThahab();
  const isOpen = overlay === "notice";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="th-modal" role="dialog" aria-modal="true" aria-labelledby="th-notice-h">
      <button type="button" className="th-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="th-modal-box" ref={box}>
        <Mark size={40} />
        <h2 id="th-notice-h">{t.noticeTitle}</h2>
        <p>{t.noticeBody}</p>
        <div className="th-modal-actions">
          <button type="button" className="th-btn th-btn-sun" onClick={() => open(null)} data-autofocus>
            {t.noticeCta}
          </button>
          <Link href="/" className="th-btn th-btn-line">
            {t.noticeZenith}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useThahab();
  return (
    <footer className="th-footer">
      <Logo />
      <p className="th-footer-tag">{t.tagline}</p>
      <nav className="th-footer-nav" aria-label="THAHAB">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <p className="th-footer-note">{t.footer}</p>
      <p className="th-footer-note">
        <a href="/showcase/">{t.footerBy}</a>
      </p>
    </footer>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { lang, t } = useThahab();
  return (
    <div className="th" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} id="top">
      <a href="#sky" className="th-skip">
        {t.skip}
      </a>
      <Bar />
      <Menu />
      <Notice />
      <a className="th-concept" href="#faq" aria-label={t.concept}>
        <Mark size={14} />
        <span className="th-concept-long">{t.concept}</span>
        <span className="th-concept-short" aria-hidden>
          {t.conceptShort}
        </span>
      </a>
      <Cursor prefix="th" />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <ThahabProvider>
      <Frame>{children}</Frame>
    </ThahabProvider>
  );
}
