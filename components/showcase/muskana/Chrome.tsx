"use client";

// The frame around MUSKANA: the mark (a curl of smoke over a drop), the bar with the bag, the menu,
// the concept notice, the cursor and the footer.

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Cursor } from "../kit/Cursor";
import { useDialog } from "../kit/hooks";
import { Bag } from "./Bag";
import { MuskanaProvider, useMuskana } from "./state";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="mu-mark">
      <path d="M16 29c-4 0-6-3-6-6 0-4 6-9 6-9s6 5 6 9c0 3-2 6-6 6Z" fill="currentColor" />
      <path d="M16 11c-3-2 3-4 0-7M19 10c-2-1.5 2-3 0-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  const { lang } = useMuskana();
  return (
    <span className="mu-logo">
      <Mark />
      <span className="mu-logo-word">{lang === "ar" ? "مُسكانة" : "MUSKANA"}</span>
    </span>
  );
}

const NAV = ["layer", "shop", "craft", "gift", "stores", "contact"] as const;

function LangSwitch() {
  const { lang, setLang, t } = useMuskana();
  return (
    <button type="button" className="mu-lang" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")}>
      {t.langName}
    </button>
  );
}

function BagButton() {
  const { t, bag, open } = useMuskana();
  const n = bag.reduce((s, l) => s + l.qty, 0);
  return (
    <button type="button" className="mu-bagbtn" onClick={() => open("bag")} aria-label={`${t.bag}, ${n}`}>
      {t.bag}
      <span>{n}</span>
    </button>
  );
}

function Bar() {
  const { t, open } = useMuskana();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(scrollY > innerHeight * 0.6);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`mu-bar${solid ? " is-solid" : ""}`}>
      <a href="#top" className="mu-bar-logo" aria-label="MUSKANA">
        <Logo />
      </a>
      <nav className="mu-bar-nav" aria-label={t.menu}>
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <LangSwitch />
      <BagButton />
      <button type="button" className="mu-burger" onClick={() => open("menu")} aria-label={t.menu}>
        <span />
        <span />
      </button>
    </header>
  );
}

function Menu() {
  const { overlay, open, t } = useMuskana();
  const isOpen = overlay === "menu";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="mu-sheet" role="dialog" aria-modal="true" aria-label={t.menu} ref={box}>
      <div className="mu-sheet-top">
        <Logo />
        <button type="button" className="mu-close" onClick={() => open(null)} data-autofocus>
          {t.close}
        </button>
      </div>
      <nav className="mu-sheet-nav">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`} onClick={() => open(null)}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <div className="mu-sheet-foot">
        <LangSwitch />
        <a href="/showcase/">{t.backToGallery}</a>
      </div>
    </div>
  );
}

function Notice() {
  const { overlay, open, t } = useMuskana();
  const isOpen = overlay === "notice";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="mu-modal" role="dialog" aria-modal="true" aria-labelledby="mu-notice-h">
      <button type="button" className="mu-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="mu-modal-box" ref={box}>
        <Mark size={40} />
        <h2 id="mu-notice-h">{t.noticeTitle}</h2>
        <p>{t.noticeBody}</p>
        <div className="mu-modal-actions">
          <button type="button" className="mu-btn mu-btn-sun" onClick={() => open(null)} data-autofocus>
            {t.noticeCta}
          </button>
          <Link href="/" className="mu-btn mu-btn-line">
            {t.noticeZenith}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useMuskana();
  return (
    <footer className="mu-footer">
      <Logo />
      <p className="mu-footer-tag">{t.tagline}</p>
      <nav className="mu-footer-nav" aria-label="MUSKANA">
        {NAV.map((n) => (
          <a key={n} href={`#${n}`}>
            {t.nav[n]}
          </a>
        ))}
      </nav>
      <p className="mu-footer-note">{t.footer}</p>
      <p className="mu-footer-note">
        <a href="/showcase/">{t.footerBy}</a>
      </p>
    </footer>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { lang, t } = useMuskana();
  return (
    <div className="mu" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} id="top">
      <a href="#layer" className="mu-skip">
        {t.skip}
      </a>
      <Bar />
      <Menu />
      <Notice />
      <Bag />
      <a className="mu-concept" href="#faq" aria-label={t.concept}>
        <Mark size={14} />
        <span className="mu-concept-long">{t.concept}</span>
        <span className="mu-concept-short" aria-hidden>
          {t.conceptShort}
        </span>
      </a>
      <Cursor prefix="mu" />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <MuskanaProvider>
      <Frame>{children}</Frame>
    </MuskanaProvider>
  );
}
