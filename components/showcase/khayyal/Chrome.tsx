"use client";

// The frame around KHAYYAL: the mark (a falcon's brow over a light blade), the bar, the menu, the
// concept notice, the cursor and the footer.

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Cursor } from "../kit/Cursor";
import { useDialog } from "../kit/hooks";
import { KhayyalProvider, useKhayyal } from "./state";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="kh-mark">
      <path d="M3 13C10 7 22 7 29 13L23 12C19 11 13 11 9 12Z" fill="currentColor" />
      <path d="M6 20H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  const { lang } = useKhayyal();
  return (
    <span className="kh-logo">
      <Mark />
      <span className="kh-logo-word">{lang === "ar" ? "خيّال" : "KHAYYAL"}</span>
    </span>
  );
}

const NAV = ["light", "build", "cabin", "drive", "visit", "contact"] as const;

function LangSwitch() {
  const { lang, setLang, t } = useKhayyal();
  return (
    <button type="button" className="kh-lang" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")}>
      {t.langName}
    </button>
  );
}

function Bar() {
  const { t, open } = useKhayyal();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(scrollY > innerHeight * 0.6);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`kh-bar${solid ? " is-solid" : ""}`}>
      <a href="#top" className="kh-bar-logo" aria-label="KHAYYAL">
        <Logo />
      </a>
      <nav className="kh-bar-nav" aria-label={t.menu}>
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <LangSwitch />
      <button type="button" className="kh-burger" onClick={() => open("menu")} aria-label={t.menu}>
        <span />
        <span />
      </button>
    </header>
  );
}

function Menu() {
  const { overlay, open, t } = useKhayyal();
  const isOpen = overlay === "menu";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="kh-sheet" role="dialog" aria-modal="true" aria-label={t.menu} ref={box}>
      <div className="kh-sheet-top">
        <Logo />
        <button type="button" className="kh-close" onClick={() => open(null)} data-autofocus>
          {t.close}
        </button>
      </div>
      <nav className="kh-sheet-nav">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`} onClick={() => open(null)}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <div className="kh-sheet-foot">
        <LangSwitch />
        <a href="/showcase/">{t.backToGallery}</a>
      </div>
    </div>
  );
}

function Notice() {
  const { overlay, open, t } = useKhayyal();
  const isOpen = overlay === "notice";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="kh-modal" role="dialog" aria-modal="true" aria-labelledby="kh-notice-h">
      <button type="button" className="kh-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="kh-modal-box" ref={box}>
        <Mark size={40} />
        <h2 id="kh-notice-h">{t.noticeTitle}</h2>
        <p>{t.noticeBody}</p>
        <div className="kh-modal-actions">
          <button type="button" className="kh-btn kh-btn-sun" onClick={() => open(null)} data-autofocus>
            {t.noticeCta}
          </button>
          <Link href="/" className="kh-btn kh-btn-line">
            {t.noticeZenith}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useKhayyal();
  return (
    <footer className="kh-footer">
      <Logo />
      <p className="kh-footer-tag">{t.tagline}</p>
      <nav className="kh-footer-nav" aria-label="KHAYYAL">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <p className="kh-footer-note">{t.footer}</p>
      <p className="kh-footer-note">
        <a href="/showcase/">{t.footerBy}</a>
      </p>
    </footer>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { lang, t } = useKhayyal();
  return (
    <div className="kh" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} id="top">
      <a href="#build" className="kh-skip">
        {t.skip}
      </a>
      <Bar />
      <Menu />
      <Notice />
      <a className="kh-concept" href="#faq" aria-label={t.concept}>
        <Mark size={14} />
        <span className="kh-concept-long">{t.concept}</span>
        <span className="kh-concept-short" aria-hidden>
          {t.conceptShort}
        </span>
      </a>
      <Cursor prefix="kh" />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <KhayyalProvider>
      <Frame>{children}</Frame>
    </KhayyalProvider>
  );
}
