"use client";
// components/site/SiteHeader.tsx — sticky header. Inline navigation from 1120px; below that a
// menu button opens a sheet. Language and theme stay one tap away at every width.

import React, { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { CONTACT_EMAIL, LANGS, pick, waLink, type L10n, type Lang } from "@/lib/site";

const NAV: { href: string; label: L10n }[] = [
  { href: "#cv-designs", label: { en: "CV designs", fr: "CV", ar: "تصاميم السير" } },
  { href: "#packages", label: { en: "Packages", fr: "Formules", ar: "الباقات" } },
  { href: "#process", label: { en: "How it works", fr: "Déroulement", ar: "طريقة العمل" } },
  { href: "#websites", label: { en: "Websites", fr: "Sites", ar: "المواقع" } },
  { href: "#zenith-ai", label: { en: "AI job agent", fr: "Agent emploi IA", ar: "وكيل الوظائف" } },
  { href: "#faq", label: { en: "FAQ", fr: "FAQ", ar: "الأسئلة الشائعة" } },
];

const T: Record<string, L10n> = {
  cta: { en: "See packages", fr: "Voir les formules", ar: "عرض الباقات" },
  menu: { en: "Menu", fr: "Menu", ar: "القائمة" },
  close: { en: "Close menu", fr: "Fermer le menu", ar: "إغلاق القائمة" },
  language: { en: "Language", fr: "Langue", ar: "اللغة" },
  toLight: { en: "Switch to light theme", fr: "Passer au thème clair", ar: "التبديل إلى الوضع الفاتح" },
  toDark: { en: "Switch to dark theme", fr: "Passer au thème sombre", ar: "التبديل إلى الوضع الداكن" },
  main: { en: "Main", fr: "Principale", ar: "الرئيسية" },
  home: { en: "Zenith Dubai CV, back to top", fr: "Zenith Dubai CV, retour en haut", ar: "Zenith Dubai CV، العودة إلى الأعلى" },
  whatsapp: { en: "WhatsApp us", fr: "Écrire sur WhatsApp", ar: "راسلنا عبر واتساب" },
};
const t = (k: string, l: Lang) => pick(T[k], l);

function LangSwitch({ lang, setLang, idSuffix }: { lang: Lang; setLang: (l: Lang) => void; idSuffix: string }) {
  return (
    <div className="hd-lang" role="group" aria-label={t("language", lang)} id={`lang-${idSuffix}`}>
      {LANGS.map(l => (
        <button key={l.code} type="button" lang={l.code} aria-pressed={lang === l.code} aria-label={l.name} onClick={() => setLang(l.code)}>
          {l.label}
        </button>
      ))}
    </div>
  );
}

export default function SiteHeader({
  lang, setLang, dark, toggleTheme,
}: {
  lang: Lang; setLang: (l: Lang) => void; dark: boolean; toggleTheme: () => void;
}) {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
      if (e.key === "Tab" && sheetRef.current) {
        const f = [...sheetRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])")];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const onResize = () => { if (window.innerWidth >= 1120) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open]);

  return (
    <header className="hd">
      <style href="zenith-header" precedence="medium">{CSS}</style>
      <div className="z-wrap z-wrap-wide hd-row">
        <a href="#top" className="hd-logo" aria-label={t("home", lang)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="" width={96} height={54} />
        </a>
        <nav className="hd-nav" aria-label={t("main", lang)}>
          {NAV.map(n => <a key={n.href} href={n.href}>{pick(n.label, lang)}</a>)}
        </nav>
        <div className="hd-tools">
          <LangSwitch lang={lang} setLang={setLang} idSuffix="bar" />
          <button type="button" className="hd-icon" onClick={toggleTheme} aria-label={dark ? t("toLight", lang) : t("toDark", lang)}>
            {dark ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
          </button>
          <a href="#packages" className="z-btn z-btn-primary z-btn-small hd-cta">{t("cta", lang)}</a>
          <button
            ref={buttonRef}
            type="button"
            className="hd-icon hd-menu"
            aria-expanded={open}
            aria-controls="hd-sheet"
            aria-label={open ? t("close", lang) : t("menu", lang)}
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="hd-sheet" id="hd-sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-label={t("menu", lang)}>
          <nav aria-label={t("main", lang)}>
            {NAV.map(n => (
              <a key={n.href} href={n.href} className="z-serif" onClick={() => setOpen(false)}>{pick(n.label, lang)}</a>
            ))}
          </nav>
          <div className="hd-sheet-tools">
            <LangSwitch lang={lang} setLang={setLang} idSuffix="sheet" />
            <a href="#packages" className="z-btn z-btn-primary z-btn-block" onClick={() => setOpen(false)}>{t("cta", lang)}</a>
            <a href={waLink("Hello Zenith Dubai CV. I have a question.")} target="_blank" rel="noopener noreferrer" className="z-btn z-btn-quiet z-btn-block">{t("whatsapp", lang)}</a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="z-link hd-mail" dir="ltr">{CONTACT_EMAIL}</a>
          </div>
        </div>
      )}
    </header>
  );
}

const CSS = `
.hd{position:sticky;top:0;z-index:60;background:color-mix(in srgb,var(--z-bg) 86%,transparent);backdrop-filter:saturate(1.4) blur(18px);-webkit-backdrop-filter:saturate(1.4) blur(18px);border-bottom:1px solid var(--z-rule)}
.hd-row{display:flex;align-items:center;gap:20px;height:68px}
.hd-logo{display:flex;align-items:center;flex:none}
.hd-logo img{width:92px;height:auto;display:block;border-radius:6px}
html[data-theme="light"] .hd-logo img{filter:brightness(0) saturate(0)}
.hd-nav{display:flex;align-items:center;gap:clamp(14px,2vw,28px);margin-inline-start:auto}
.hd-nav a{font-size:14.5px;font-weight:500;color:var(--z-fg-2);text-decoration:none;padding:8px 0;white-space:nowrap;transition:color .2s}
.hd-nav a:hover{color:var(--z-fg)}
.hd-tools{display:flex;align-items:center;gap:10px;margin-inline-start:24px}
.hd-lang{display:flex;padding:3px;border:1px solid var(--z-rule-strong);border-radius:999px}
.hd-lang button{min-width:36px;height:32px;padding:0 10px;border:0;border-radius:999px;background:transparent;color:var(--z-fg-2);font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.hd-lang button[aria-pressed="true"]{background:var(--z-fg);color:var(--z-bg)}
.hd-lang button[lang="ar"]{font-family:var(--font-arabic),Tahoma,sans-serif;font-size:15px}
.hd-icon{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;border:1px solid var(--z-rule-strong);background:transparent;color:var(--z-fg);cursor:pointer}
.hd-icon:hover{border-color:var(--z-gold)}
.hd-menu{display:none}
@media (max-width:1119px){
  .hd-nav{display:none}
  .hd-tools{margin-inline-start:auto}
  .hd-menu{display:grid}
}
@media (max-width:639px){
  .hd-tools .hd-lang,.hd-tools .hd-cta{display:none}
}
.hd-sheet{position:fixed;inset:68px 0 0;z-index:59;overflow-y:auto;background:var(--z-bg);padding:28px clamp(20px,6vw,48px) 40px;display:flex;flex-direction:column;gap:32px}
.hd-sheet nav{display:flex;flex-direction:column}
.hd-sheet nav a{font-size:30px;line-height:1.2;padding:12px 0;border-bottom:1px solid var(--z-rule);color:var(--z-fg);text-decoration:none}
[dir="rtl"] .hd-sheet nav a{font-family:var(--font-arabic-serif),serif;font-size:26px}
.hd-sheet-tools{display:grid;gap:12px;max-width:420px}
.hd-sheet-tools .hd-lang{justify-self:start}
.hd-mail{justify-self:start;font-size:15px;margin-top:4px}
`;
