"use client";

// The frame around ZILL: the mark (a courtyard in plan with its afternoon shadow), the bar, the
// menu, the concept notice, the cursor and the footer.

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Cursor } from "../kit/Cursor";
import { useDialog } from "../kit/hooks";
import { ZillProvider, useZill } from "./state";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="zl-mark">
      <rect x="2" y="2" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="9" y="9" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9H23L9 23Z" fill="currentColor" opacity=".9" />
    </svg>
  );
}

export function Logo() {
  const { lang } = useZill();
  return (
    <span className="zl-logo">
      <Mark />
      <span className="zl-logo-word">{lang === "ar" ? "ظِلّ" : "ZILL"}</span>
    </span>
  );
}

const NAV = ["approach", "house", "sun", "work", "brief", "contact"] as const;

function LangSwitch() {
  const { lang, setLang, t } = useZill();
  return (
    <button type="button" className="zl-lang" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")}>
      {t.langName}
    </button>
  );
}

function Bar() {
  const { t, open } = useZill();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(scrollY > innerHeight * 0.6);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`zl-bar${solid ? " is-solid" : ""}`}>
      <a href="#top" className="zl-bar-logo" aria-label="ZILL">
        <Logo />
      </a>
      <nav className="zl-bar-nav" aria-label={t.menu}>
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <LangSwitch />
      <button type="button" className="zl-burger" onClick={() => open("menu")} aria-label={t.menu}>
        <span />
        <span />
      </button>
    </header>
  );
}

function Menu() {
  const { overlay, open, t } = useZill();
  const isOpen = overlay === "menu";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="zl-sheet" role="dialog" aria-modal="true" aria-label={t.menu} ref={box}>
      <div className="zl-sheet-top">
        <Logo />
        <button type="button" className="zl-close" onClick={() => open(null)} data-autofocus>
          {t.close}
        </button>
      </div>
      <nav className="zl-sheet-nav">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`} onClick={() => open(null)}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <div className="zl-sheet-foot">
        <LangSwitch />
        <a href="/showcase/">{t.backToGallery}</a>
      </div>
    </div>
  );
}

function Notice() {
  const { overlay, open, t } = useZill();
  const isOpen = overlay === "notice";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="zl-modal" role="dialog" aria-modal="true" aria-labelledby="zl-notice-h">
      <button type="button" className="zl-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="zl-modal-box" ref={box}>
        <Mark size={40} />
        <h2 id="zl-notice-h">{t.noticeTitle}</h2>
        <p>{t.noticeBody}</p>
        <div className="zl-modal-actions">
          <button type="button" className="zl-btn zl-btn-sun" onClick={() => open(null)} data-autofocus>
            {t.noticeCta}
          </button>
          <Link href="/" className="zl-btn zl-btn-line">
            {t.noticeZenith}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useZill();
  return (
    <footer className="zl-footer">
      <Logo />
      <p className="zl-footer-tag">{t.tagline}</p>
      <nav className="zl-footer-nav" aria-label="ZILL">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <p className="zl-footer-note">{t.footer}</p>
      <p className="zl-footer-note">
        <a href="/showcase/">{t.footerBy}</a>
      </p>
    </footer>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { lang, t } = useZill();
  return (
    <div className="zl" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} id="top">
      <a href="#brief" className="zl-skip">
        {t.skip}
      </a>
      <Bar />
      <Menu />
      <Notice />
      <a className="zl-concept" href="#faq" aria-label={t.concept}>
        <Mark size={14} />
        <span className="zl-concept-long">{t.concept}</span>
        <span className="zl-concept-short" aria-hidden>
          {t.conceptShort}
        </span>
      </a>
      <Cursor prefix="zl" />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <ZillProvider>
      <Frame>{children}</Frame>
    </ZillProvider>
  );
}
