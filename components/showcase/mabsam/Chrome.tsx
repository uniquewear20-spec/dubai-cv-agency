"use client";

// The frame around MABSAM: the mark (an olive leaf curving into a smile), the bar, the menu, the
// concept notice, the cursor and the footer.

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Cursor } from "../kit/Cursor";
import { useDialog } from "../kit/hooks";
import { MabsamProvider, useMabsam } from "./state";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="mb-mark">
      <path d="M5 14c4 8 18 8 22 0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 15C13 11 13 6 17 3c3 4 2 9-1 12Z" fill="currentColor" opacity=".85" />
    </svg>
  );
}

export function Logo() {
  const { lang } = useMabsam();
  return (
    <span className="mb-logo">
      <Mark />
      <span className="mb-logo-word">{lang === "ar" ? "مَبسم" : "MABSAM"}</span>
    </span>
  );
}

const NAV = ["finder", "clinic", "care", "breathe", "visit", "contact"] as const;

function LangSwitch() {
  const { lang, setLang, t } = useMabsam();
  return (
    <button type="button" className="mb-lang" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")}>
      {t.langName}
    </button>
  );
}

function Bar() {
  const { t, open } = useMabsam();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(scrollY > innerHeight * 0.6);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`mb-bar${solid ? " is-solid" : ""}`}>
      <a href="#top" className="mb-bar-logo" aria-label="MABSAM">
        <Logo />
      </a>
      <nav className="mb-bar-nav" aria-label={t.menu}>
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <LangSwitch />
      <button type="button" className="mb-burger" onClick={() => open("menu")} aria-label={t.menu}>
        <span />
        <span />
      </button>
    </header>
  );
}

function Menu() {
  const { overlay, open, t } = useMabsam();
  const isOpen = overlay === "menu";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="mb-sheet" role="dialog" aria-modal="true" aria-label={t.menu} ref={box}>
      <div className="mb-sheet-top">
        <Logo />
        <button type="button" className="mb-close" onClick={() => open(null)} data-autofocus>
          {t.close}
        </button>
      </div>
      <nav className="mb-sheet-nav">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`} onClick={() => open(null)}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <div className="mb-sheet-foot">
        <LangSwitch />
        <a href="/showcase/">{t.backToGallery}</a>
      </div>
    </div>
  );
}

function Notice() {
  const { overlay, open, t } = useMabsam();
  const isOpen = overlay === "notice";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="mb-modal" role="dialog" aria-modal="true" aria-labelledby="mb-notice-h">
      <button type="button" className="mb-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="mb-modal-box" ref={box}>
        <Mark size={40} />
        <h2 id="mb-notice-h">{t.noticeTitle}</h2>
        <p>{t.noticeBody}</p>
        <div className="mb-modal-actions">
          <button type="button" className="mb-btn mb-btn-sun" onClick={() => open(null)} data-autofocus>
            {t.noticeCta}
          </button>
          <Link href="/" className="mb-btn mb-btn-line">
            {t.noticeZenith}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useMabsam();
  return (
    <footer className="mb-footer">
      <Logo />
      <p className="mb-footer-tag">{t.tagline}</p>
      <nav className="mb-footer-nav" aria-label="MABSAM">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <p className="mb-footer-note">{t.footer}</p>
      <p className="mb-footer-note">
        <a href="/showcase/">{t.footerBy}</a>
      </p>
    </footer>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { lang, t } = useMabsam();
  return (
    <div className="mb" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} id="top">
      <a href="#finder" className="mb-skip">
        {t.skip}
      </a>
      <Bar />
      <Menu />
      <Notice />
      <a className="mb-concept" href="#faq" aria-label={t.concept}>
        <Mark size={14} />
        <span className="mb-concept-long">{t.concept}</span>
        <span className="mb-concept-short" aria-hidden>
          {t.conceptShort}
        </span>
      </a>
      <Cursor prefix="mb" />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <MabsamProvider>
      <Frame>{children}</Frame>
    </MabsamProvider>
  );
}
