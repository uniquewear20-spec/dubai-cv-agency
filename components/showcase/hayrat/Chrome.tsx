"use client";

// The frame around every HAYRAT page: the logo, the top bar (light or dark depending on what is
// under it), the menu, the booking drawer, the concept notice, the cursor and the footer.

import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Cursor } from "../kit/Cursor";
import { useDialog } from "../kit/hooks";
import { BASE, BookingEngine } from "./Booking";
import { HayratProvider, useHayrat } from "./state";

/** An oyster opened on its pearl. The shells take the current colour; the pearl is always nacre. */
export function Emblem({ size = 30 }: { size?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg width={(size * 48) / 40} height={size} viewBox="0 0 48 40" aria-hidden className="hy-emblem">
      <defs>
        <radialGradient id={`p${id}`} cx="0.38" cy="0.34" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#efe9f3" />
          <stop offset="0.75" stopColor="#d6ebe7" />
          <stop offset="1" stopColor="#c7d8dc" />
        </radialGradient>
      </defs>
      <path d="M6 20.5C9.5 9.5 35 6.5 43.5 17.5C34.5 13.8 17 14.6 6 20.5Z" fill="currentColor" />
      <path d="M3.5 24.5C8 35.5 40 35.5 44.5 24.5C34.5 29 13.5 29 3.5 24.5Z" fill="currentColor" />
      <path d="M9 27.6C16 30.6 32 30.6 39 27.6" fill="none" stroke="currentColor" strokeOpacity=".45" strokeWidth=".7" />
      <circle cx="24.6" cy="21.8" r="5.4" fill={`url(#p${id})`} />
      <circle cx="22.9" cy="20.1" r="1.25" fill="#fff" opacity=".9" />
    </svg>
  );
}

export function Logo({ small }: { small?: boolean }) {
  const { lang } = useHayrat();
  return (
    <span className={`hy-logo${small ? " is-small" : ""}`}>
      <Emblem size={small ? 24 : 30} />
      <span className="hy-logo-word">{lang === "ar" ? "هيرات" : "HAYRAT"}</span>
    </span>
  );
}

/** Light or dark: what the element under the top bar asks for (data-tone on a section). */
function useTone() {
  const [tone, setTone] = useState<"light" | "dark">("dark");
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const els = document.elementsFromPoint(innerWidth / 2, 34);
      for (const el of els) {
        if (el.closest(".hy-bar")) continue;
        const v = (el as HTMLElement).closest<HTMLElement>("[data-tone]")?.dataset.tone;
        if (v === "light" || v === "dark") {
          setTone(v);
          return;
        }
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
    };
  }, []);
  return tone;
}

function LangSwitch() {
  const { lang, setLang, t } = useHayrat();
  return (
    <button type="button" className="hy-lang" onClick={() => setLang(lang === "en" ? "ar" : "en")} lang={lang === "en" ? "ar" : "en"}>
      {t.lang}
    </button>
  );
}

function TopBar() {
  const { t, open } = useHayrat();
  const tone = useTone();
  return (
    <header className="hy-bar" data-on={tone}>
      <a className="hy-skip" href="#hy-main">
        {t.skip}
      </a>
      <button type="button" className="hy-bar-menu" onClick={() => open("menu")} aria-haspopup="dialog">
        <span className="hy-burger" aria-hidden>
          <i />
          <i />
        </span>
        <span>{t.menu}</span>
      </button>
      <Link href={BASE} className="hy-bar-logo" aria-label="Hayrat">
        <Logo />
      </Link>
      <div className="hy-bar-end">
        <LangSwitch />
        <button type="button" className="hy-btn hy-btn-pearl" onClick={() => open("book")}>
          {t.book}
        </button>
      </div>
    </header>
  );
}

export const NAV: { id: string; key: keyof ReturnType<typeof useHayrat>["t"]["nav"] }[] = [
  { id: "island", key: "island" },
  { id: "rooms", key: "rooms" },
  { id: "descent", key: "dive" },
  { id: "dining", key: "dining" },
  { id: "salt", key: "salt" },
  { id: "day", key: "days" },
  { id: "map", key: "map" },
  { id: "arrive", key: "arrive" },
  { id: "book", key: "book" },
];

function Menu({ onHome }: { onHome?: boolean }) {
  const { overlay, open, t } = useHayrat();
  const isOpen = overlay === "menu";
  const box = useDialog(isOpen, () => open(null));
  return (
    <div className={`hy-menu${isOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label={t.menu} hidden={!isOpen} ref={box}>
      <div className="hy-menu-top">
        <Logo small />
        <button type="button" className="hy-btn" onClick={() => open(null)} data-autofocus>
          {t.close}
        </button>
      </div>
      <nav className="hy-menu-nav">
        {NAV.map((n, i) => (
          <a key={n.id} href={onHome ? `#${n.id}` : `${BASE}#${n.id}`} onClick={() => open(null)} style={{ "--i": i } as React.CSSProperties}>
            {t.nav[n.key]}
          </a>
        ))}
      </nav>
      <div className="hy-menu-foot">
        <LangSwitch />
        <p className="hy-menu-note">{t.conceptLine}</p>
      </div>
    </div>
  );
}

function BookDrawer() {
  const { overlay, open, t } = useHayrat();
  const isOpen = overlay === "book";
  const box = useDialog(isOpen, () => open(null));
  return (
    <div className={`hy-drawer${isOpen ? " is-open" : ""}`} hidden={!isOpen}>
      <button type="button" className="hy-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="hy-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="hy-drawer-h" ref={box}>
        <div className="hy-drawer-top">
          <h2 id="hy-drawer-h">{t.bookTitle}</h2>
          <button type="button" className="hy-btn" onClick={() => open(null)} data-autofocus>
            {t.close}
          </button>
        </div>
        {isOpen && <BookingEngine months={1} />}
      </div>
    </div>
  );
}

function Notice({ onHome }: { onHome?: boolean }) {
  const { overlay, open, t } = useHayrat();
  const isOpen = overlay === "notice";
  const box = useDialog(isOpen, () => open(null));
  if (!isOpen) return null;
  return (
    <div className="hy-modal" role="dialog" aria-modal="true" aria-labelledby="hy-notice-h">
      <button type="button" className="hy-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="hy-modal-box" ref={box}>
        <Emblem size={40} />
        <h2 id="hy-notice-h">{t.noticeTitle}</h2>
        <p>{t.noticeBody}</p>
        <div className="hy-modal-actions">
          <a href={onHome ? "#enquire" : `${BASE}#enquire`} className="hy-btn hy-btn-solid" onClick={() => open(null)} data-autofocus>
            {t.noticeCta}
          </a>
          <button type="button" className="hy-btn" onClick={() => open(null)}>
            {t.keep}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConceptTag() {
  const { t } = useHayrat();
  return (
    <a className="hy-concept" href="#faq" title={t.conceptLine}>
      <span className="hy-concept-dot" aria-hidden />
      {t.concept}
    </a>
  );
}

export function Footer({ onHome }: { onHome?: boolean }) {
  const { t, lang } = useHayrat();
  return (
    <footer className="hy-footer" data-tone="dark">
      <div className="hy-footer-top">
        <Logo />
        <p className="hy-footer-line">{t.footerLine}</p>
      </div>
      <nav className="hy-footer-nav" aria-label={lang === "ar" ? "روابط" : "Links"}>
        {NAV.map((n) => (
          <a key={n.id} href={onHome ? `#${n.id}` : `${BASE}#${n.id}`}>
            {t.nav[n.key]}
          </a>
        ))}
      </nav>
      <p className="hy-footer-note">{t.footerNote}</p>
      <p className="hy-footer-by">
        <a href="/showcase/">Zenith Dubai · Concept websites</a>
      </p>
    </footer>
  );
}

function Frame({ children, onHome }: { children: ReactNode; onHome?: boolean }) {
  const { lang, t } = useHayrat();
  return (
    <div className="hy" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <TopBar />
      <Menu onHome={onHome} />
      <BookDrawer />
      <Notice onHome={onHome} />
      <ConceptTag />
      <Cursor prefix="hy">
        <span className="hy-cursor-label">{lang === "ar" ? "اسحب" : t.dragHint}</span>
      </Cursor>
      <main id="hy-main">{children}</main>
      <Footer onHome={onHome} />
    </div>
  );
}

export function Shell({ children, onHome }: { children: ReactNode; onHome?: boolean }) {
  return (
    <HayratProvider>
      <Frame onHome={onHome}>{children}</Frame>
    </HayratProvider>
  );
}
