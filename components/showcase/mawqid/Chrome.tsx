"use client";

// The frame around MAWQID: the mark (the counter seen from above, the hearth in the middle), the
// top bar, the menu, the concept notice, the cursor and the footer.

import { useEffect, useId, useState, type ReactNode } from "react";
import { Cursor } from "../kit/Cursor";
import { useDialog } from "../kit/hooks";
import { MawqidProvider, useMawqid } from "./state";

/** The counter from above: a horseshoe of fourteen stools around one ember. */
export function Mark({ size = 34 }: { size?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const seats = Array.from({ length: 14 }, (_, i) => {
    // three on each arm, eight around the curve
    if (i < 3) return { x: 6, y: 9 + i * 7 };
    if (i > 10) return { x: 42, y: 9 + (13 - i) * 7 };
    const a = Math.PI - ((i - 3 + 0.5) * Math.PI) / 8;
    return { x: 24 + 18 * Math.cos(a), y: 30 + 18 * Math.sin(a) };
  });
  return (
    <svg width={(size * 48) / 52} height={size} viewBox="0 0 48 52" aria-hidden className="mq-mark">
      <defs>
        <radialGradient id={`e${id}`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset="0.45" stopColor="#ff8a3d" />
          <stop offset="1" stopColor="#d9431b" />
        </radialGradient>
      </defs>
      <path d="M12 6V30A12 12 0 0 0 36 30V6" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {seats.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="1.7" fill="currentColor" opacity=".8" />
      ))}
      <circle cx="24" cy="25" r="5.2" fill={`url(#e${id})`} />
    </svg>
  );
}

export function Logo({ small }: { small?: boolean }) {
  const { lang } = useMawqid();
  return (
    <span className={`mq-logo${small ? " is-small" : ""}`}>
      <Mark size={small ? 26 : 34} />
      <span className="mq-logo-word">{lang === "ar" ? "موقد" : "MAWQID"}</span>
    </span>
  );
}

const NAV = [
  { id: "counter", key: "counter" },
  { id: "menu", key: "menu" },
  { id: "reserve", key: "reserve" },
  { id: "gift", key: "gift" },
  { id: "private", key: "private" },
  { id: "visit", key: "visit" },
] as const;

function LangSwitch() {
  const { lang, setLang, t } = useMawqid();
  return (
    <button type="button" className="mq-lang" onClick={() => setLang(lang === "en" ? "ar" : "en")} lang={lang === "en" ? "ar" : "en"}>
      {t.langName}
    </button>
  );
}

function TopBar() {
  const { t, open } = useMawqid();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`mq-bar${solid ? " is-solid" : ""}`}>
      <a href="#top" className="mq-bar-logo" aria-label="MAWQID">
        <Logo small />
      </a>
      <nav className="mq-bar-nav" aria-label={t.menuLabel}>
        {NAV.filter((n) => n.id !== "reserve").map((n) => (
          <a key={n.id} href={`#${n.id}`}>
            {t.nav[n.key]}
          </a>
        ))}
      </nav>
      <div className="mq-bar-end">
        <LangSwitch />
        <a href="#reserve" className="mq-btn mq-btn-ember mq-bar-cta">
          {t.nav.reserve}
        </a>
        <button type="button" className="mq-burger" aria-label={t.menuLabel} aria-expanded={false} onClick={() => open("menu")}>
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

function Menu() {
  const { overlay, open, t } = useMawqid();
  const isOpen = overlay === "menu";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="mq-sheet" role="dialog" aria-modal="true" aria-label={t.menuLabel} ref={box}>
      <div className="mq-sheet-top">
        <Logo small />
        <button type="button" className="mq-close" onClick={() => open(null)} data-autofocus>
          {t.close}
        </button>
      </div>
      <nav className="mq-sheet-nav">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} onClick={() => open(null)}>
            {t.nav[n.key]}
          </a>
        ))}
      </nav>
      <div className="mq-sheet-foot">
        <LangSwitch />
        <a href="/showcase/">{t.backToGallery}</a>
      </div>
    </div>
  );
}

function Notice() {
  const { overlay, open, t } = useMawqid();
  const isOpen = overlay === "notice";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="mq-modal" role="dialog" aria-modal="true" aria-labelledby="mq-notice-h">
      <button type="button" className="mq-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="mq-modal-box" ref={box}>
        <Mark size={44} />
        <h2 id="mq-notice-h">{t.noticeTitle}</h2>
        <p>{t.noticeBody}</p>
        <div className="mq-modal-actions">
          <button type="button" className="mq-btn mq-btn-ember" onClick={() => open(null)} data-autofocus>
            {t.noticeCta}
          </button>
          <a href="/" className="mq-btn mq-btn-line">
            {t.noticeZenith}
          </a>
        </div>
      </div>
    </div>
  );
}

function ConceptTag() {
  const { t } = useMawqid();
  return (
    <a className="mq-concept" href="#faq">
      <span className="mq-concept-dot" aria-hidden />
      {t.concept}
    </a>
  );
}

function Footer() {
  const { t, lang } = useMawqid();
  return (
    <footer className="mq-footer">
      <div className="mq-footer-top">
        <Logo />
        <p className="mq-footer-tag">{t.tagline}</p>
      </div>
      <nav className="mq-footer-nav" aria-label={lang === "ar" ? "روابط" : "Links"}>
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`}>
            {t.nav[n.key]}
          </a>
        ))}
      </nav>
      <p className="mq-footer-note">{t.footer}</p>
      <p className="mq-footer-by">
        <a href="/showcase/">{t.footerBy}</a>
      </p>
    </footer>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { lang, t } = useMawqid();
  return (
    <div className="mq" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} id="top">
      <a href="#reserve" className="mq-skip">
        {t.skip}
      </a>
      <TopBar />
      <Menu />
      <Notice />
      <ConceptTag />
      <Cursor prefix="mq" />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <MawqidProvider>
      <Frame>{children}</Frame>
    </MawqidProvider>
  );
}
