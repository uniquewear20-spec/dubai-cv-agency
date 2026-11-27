"use client";

// The frame around ALBORA: the turning badge, a rail that counts the scroll, the actions at the
// top, the menu, the concept notice and the footer. There is deliberately no cookie banner: the
// site sets no cookies and loads no trackers.

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useDialog } from "../kit/hooks";
import { UI } from "@/lib/showcase/albora";
import { AlboraProvider, useAlbora } from "./state";

export function Mark({ size = 28 }: { size?: number }) {
  // a village doorway: an arch over the waterline
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="al-mark">
      <path d="M8 29V14a8 8 0 0 1 16 0v15" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 29h24" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 23c2-1.4 3.4-1.4 5 0s3 1.4 5 0" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Text set around a circle that turns slowly; the centre holds the mark or an arrow. */
export function Ring({ text, id, children, size = 120 }: { text: string; id: string; children?: ReactNode; size?: number }) {
  return (
    <span className="al-ringbox" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="al-ring-svg" aria-hidden>
        <defs>
          <path id={id} d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1 -92 0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="289" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="al-ring-core">{children}</span>
    </span>
  );
}

const NAV = ["village", "coast", "homes", "living", "gallery", "call"] as const;
const HREF: Record<(typeof NAV)[number], string> = {
  village: "#village",
  coast: "#coast",
  homes: "#residences",
  living: "#living",
  gallery: "#gallery",
  call: "#call",
};

function LangSwitch() {
  const { lang, setLang, t } = useAlbora();
  return (
    <button type="button" className="al-lang" lang={lang === "en" ? "ar" : "en"} onClick={() => setLang(lang === "en" ? "ar" : "en")}>
      {t.langName}
    </button>
  );
}

function Top() {
  const { t, open } = useAlbora();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(scrollY > innerHeight * 0.9);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`al-top al-bar${solid ? " is-solid" : ""}`}>
      <a href="#top" className="al-badge" aria-label={`${t.name}, ${t.backTop}`}>
        <Ring text={UI.en.ring} id="al-badge-ring" size={92}>
          <Mark size={30} />
        </Ring>
      </a>
      <nav className="al-top-nav" aria-label={t.menu}>
        <a href="#residences" className="al-pill">
          {t.selectHome}
        </a>
        <a href="#call" className="al-top-link">
          {t.bookCall}
        </a>
        <a href="#contact" className="al-top-link">
          {t.contact}
        </a>
        <LangSwitch />
      </nav>
      <button type="button" className="al-burger" onClick={() => open("menu")} aria-label={t.menu} aria-haspopup="dialog">
        <span />
        <span />
      </button>
    </header>
  );
}

/** The scroll counter; the page's scroll engine writes the number and the bar. */
function Rail() {
  const { t } = useAlbora();
  return (
    <div className="al-rail" id="al-rail" aria-hidden>
      <span className="al-count" data-count>
        00
      </span>
      <span className="al-track">
        <i />
      </span>
      <span className="al-scroll">{t.scroll}</span>
    </div>
  );
}

function Menu() {
  const { overlay, open, t } = useAlbora();
  const isOpen = overlay === "menu";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="al-sheet" role="dialog" aria-modal="true" aria-label={t.menu} ref={box}>
      <div className="al-sheet-top">
        <span className="al-sheet-logo">
          <Mark size={34} />
          {t.name}
        </span>
        <button type="button" className="al-close" onClick={() => open(null)} data-autofocus>
          {t.close}
        </button>
      </div>
      <nav className="al-sheet-nav">
        {NAV.map((n) => (
          <a key={n} href={HREF[n]} onClick={() => open(null)}>
            {t.nav[n]}
          </a>
        ))}
        <a href="#contact" onClick={() => open(null)}>
          {t.contact}
        </a>
      </nav>
      <div className="al-sheet-foot">
        <LangSwitch />
        <a href="/showcase/">{t.backToGallery}</a>
      </div>
    </div>
  );
}

function Notice() {
  const { overlay, open, t } = useAlbora();
  const isOpen = overlay === "notice";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="al-modal" role="dialog" aria-modal="true" aria-labelledby="al-notice-h">
      <button type="button" className="al-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="al-modal-box" ref={box}>
        <Mark size={44} />
        <h2 id="al-notice-h">{t.noticeTitle}</h2>
        <p>{t.noticeBody}</p>
        <div className="al-modal-actions">
          <button type="button" className="al-btn al-btn-ink" onClick={() => open(null)} data-autofocus>
            {t.noticeCta}
          </button>
          <Link href="/" className="al-btn al-btn-line">
            {t.noticeZenith}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useAlbora();
  return (
    <footer className="al-footer">
      <p className="al-footer-word" aria-hidden>
        {t.name}
      </p>
      <p className="al-footer-line">{t.footerLine}</p>
      <nav className="al-footer-nav" aria-label={t.name}>
        {NAV.map((n) => (
          <a key={n} href={HREF[n]}>
            {t.nav[n]}
          </a>
        ))}
        <a href="#faq">{t.faqTitle}</a>
      </nav>
      <p className="al-footer-note">{t.footer}</p>
      <p className="al-footer-note">
        <a href="/showcase/">{t.footerBy}</a>
      </p>
    </footer>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { lang, t } = useAlbora();
  return (
    <div className="al" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} id="top">
      <a href="#residences" className="al-skip">
        {t.skip}
      </a>
      <Top />
      <Rail />
      <Menu />
      <Notice />
      <a className="al-concept" href="#faq" aria-label={t.concept}>
        <Mark size={14} />
        <span className="al-concept-long">{t.concept}</span>
        <span className="al-concept-short" aria-hidden>
          {t.conceptShort}
        </span>
      </a>
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <AlboraProvider>
      <Frame>{children}</Frame>
    </AlboraProvider>
  );
}
