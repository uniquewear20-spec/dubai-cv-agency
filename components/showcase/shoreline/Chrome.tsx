"use client";

// The frame around SHORELINE NO. 9: the mark (a nine resting on a wave), the bar, the menu, the
// concept notice, the cursor and the footer.

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Cursor } from "../kit/Cursor";
import { useDialog } from "../kit/hooks";
import { ShoreProvider, useShore } from "./state";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="sh-mark">
      <circle cx="16" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M22 11c0 6-3 9-7 10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M3 26c3-3 5-3 8 0s5 3 8 0 5-3 8 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Logo() {
  const { lang } = useShore();
  return (
    <span className="sh-logo">
      <Mark />
      <span className="sh-logo-word">{lang === "ar" ? "شورلاين ٩" : "SHORELINE NO. 9"}</span>
    </span>
  );
}

const NAV = ["house", "plan", "view", "materials", "area", "viewing"] as const;

function LangSwitch() {
  const { lang, setLang, t } = useShore();
  return (
    <button type="button" className="sh-lang" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")}>
      {t.langName}
    </button>
  );
}

function Bar() {
  const { t, open } = useShore();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(scrollY > innerHeight * 0.6);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`sh-bar${solid ? " is-solid" : ""}`}>
      <a href="#top" className="sh-bar-logo" aria-label="SHORELINE NO. 9">
        <Logo />
      </a>
      <nav className="sh-bar-nav" aria-label={t.menu}>
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <LangSwitch />
      <button type="button" className="sh-burger" onClick={() => open("menu")} aria-label={t.menu}>
        <span />
        <span />
      </button>
    </header>
  );
}

function Menu() {
  const { overlay, open, t } = useShore();
  const isOpen = overlay === "menu";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="sh-sheet" role="dialog" aria-modal="true" aria-label={t.menu} ref={box}>
      <div className="sh-sheet-top">
        <Logo />
        <button type="button" className="sh-close" onClick={() => open(null)} data-autofocus>
          {t.close}
        </button>
      </div>
      <nav className="sh-sheet-nav">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`} onClick={() => open(null)}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <div className="sh-sheet-foot">
        <LangSwitch />
        <a href="/showcase/">{t.backToGallery}</a>
      </div>
    </div>
  );
}

function Notice() {
  const { overlay, open, t } = useShore();
  const isOpen = overlay === "notice";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="sh-modal" role="dialog" aria-modal="true" aria-labelledby="sh-notice-h">
      <button type="button" className="sh-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="sh-modal-box" ref={box}>
        <Mark size={40} />
        <h2 id="sh-notice-h">{t.noticeTitle}</h2>
        <p>{t.noticeBody}</p>
        <div className="sh-modal-actions">
          <button type="button" className="sh-btn sh-btn-sun" onClick={() => open(null)} data-autofocus>
            {t.noticeCta}
          </button>
          <Link href="/" className="sh-btn sh-btn-line">
            {t.noticeZenith}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useShore();
  return (
    <footer className="sh-footer">
      <Logo />
      <p className="sh-footer-tag">{t.tagline}</p>
      <nav className="sh-footer-nav" aria-label="SHORELINE NO. 9">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <p className="sh-footer-note">{t.footer}</p>
      <p className="sh-footer-note">
        <a href="/showcase/">{t.footerBy}</a>
      </p>
    </footer>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { lang, t } = useShore();
  return (
    <div className="sh" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} id="top">
      <a href="#plan" className="sh-skip">
        {t.skip}
      </a>
      <Bar />
      <Menu />
      <Notice />
      <a className="sh-concept" href="#faq" aria-label={t.concept}>
        <Mark size={14} />
        <span className="sh-concept-long">{t.concept}</span>
        <span className="sh-concept-short" aria-hidden>
          {t.conceptShort}
        </span>
      </a>
      <Cursor prefix="sh" />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <ShoreProvider>
      <Frame>{children}</Frame>
    </ShoreProvider>
  );
}
