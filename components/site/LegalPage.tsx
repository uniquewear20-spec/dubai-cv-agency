"use client";
// components/site/LegalPage.tsx — shared layout for the privacy policy, terms and refund policy.

import React, { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { Mail, MessageCircle, Moon, Sun } from "lucide-react";
import { CONTACT_EMAIL, WHATSAPP_NUMBER, isLang, waLink, type Lang } from "@/lib/site";
import type { LegalDoc } from "@/lib/legal/docs";

type Kind = "privacy" | "terms" | "refund";

const UI: Record<Lang, {
  legal: string; contents: string; home: string; email: string; whatsapp: string; questions: string; refundCta: string;
  links: Record<Kind, string>; theme: [string, string]; skip: string;
}> = {
  en: {
    legal: "Legal", contents: "Contents", home: "Back to the site", email: "Email us", whatsapp: "WhatsApp",
    questions: "Questions about this page? Write to us and we'll answer.", refundCta: "Request a refund",
    links: { privacy: "Privacy policy", terms: "Terms of service", refund: "Refund policy" }, theme: ["Switch to light theme", "Switch to dark theme"], skip: "Skip to content",
  },
  fr: {
    legal: "Mentions légales", contents: "Sommaire", home: "Retour au site", email: "Nous écrire", whatsapp: "WhatsApp",
    questions: "Une question sur cette page ? Écrivez-nous, nous vous répondrons.", refundCta: "Demander un remboursement",
    links: { privacy: "Politique de confidentialité", terms: "Conditions d'utilisation", refund: "Politique de remboursement" }, theme: ["Passer au thème clair", "Passer au thème sombre"], skip: "Aller au contenu",
  },
  ar: {
    legal: "قانوني", contents: "المحتويات", home: "العودة إلى الموقع", email: "راسلنا", whatsapp: "واتساب",
    questions: "لديك سؤال عن هذه الصفحة؟ راسلنا وسنجيبك.", refundCta: "اطلب استرداداً",
    links: { privacy: "سياسة الخصوصية", terms: "شروط الخدمة", refund: "سياسة الاسترداد" }, theme: ["التبديل إلى المظهر الفاتح", "التبديل إلى المظهر الداكن"], skip: "انتقل إلى المحتوى",
  },
};

const HREF: Record<Kind, string> = { privacy: "/privacy/", terms: "/terms/", refund: "/refund/" };

export default function LegalPage({ kind, docs }: { kind: Kind; docs: Record<Lang, LegalDoc> }) {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(true);

  useLayoutEffect(() => {
    // Browser-only preferences, read after hydration so the server and client render the same first.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.dataset.theme !== "light");
    try { const l = localStorage.getItem("z-lang"); if (isLang(l)) setLang(l); } catch { /* storage blocked */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const choose = (l: Lang) => { setLang(l); try { localStorage.setItem("z-lang", l); } catch { /* ignore */ } };
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("z-theme", next ? "dark" : "light"); } catch { /* ignore */ }
  };

  const doc = docs[lang];
  const ui = UI[lang];

  return (
    <div className="zs lg" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <style href="zenith-legal" precedence="medium">{CSS}</style>
      <a href="#lg-main" className="z-skip">{ui.skip}</a>
      <header className="lg-top">
        <div className="z-wrap lg-top-in">
          <Link href="/" className="lg-brand z-serif">Zenith</Link>
          <div className="lg-tools">
            <div className="lg-seg" role="group" aria-label="Language">
              {(["en", "fr", "ar"] as Lang[]).map(l => (
                <button key={l} type="button" lang={l} aria-pressed={lang === l} onClick={() => choose(l)}>{l === "ar" ? "ع" : l.toUpperCase()}</button>
              ))}
            </div>
            <button type="button" className="lg-icon" onClick={toggle} aria-label={dark ? ui.theme[0] : ui.theme[1]}>
              {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      <main id="lg-main" className="z-wrap lg-main" tabIndex={-1}>
        <p className="z-label">{ui.legal}</p>
        <h1 className="z-h2 lg-h1">{doc.title}</h1>
        <p className="z-micro">{doc.updated}</p>
        <p className="z-lede lg-intro">{doc.intro}</p>
        {doc.highlight && <p className="lg-highlight">{doc.highlight}</p>}
        {kind === "refund" && (
          <p style={{ marginTop: 20 }}>
            <a className="z-btn z-btn-primary" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Refund request")}`}><Mail size={16} aria-hidden /> {ui.refundCta}</a>
          </p>
        )}

        <div className="lg-grid">
          <nav className="lg-toc" aria-label={ui.contents}>
            <p className="z-micro">{ui.contents}</p>
            <ol>
              {doc.sections.map(s => <li key={s.id}><a href={`#s-${s.id}`}>{s.title}</a></li>)}
            </ol>
          </nav>
          <div className="lg-body">
            {doc.sections.map(s => (
              <section key={s.id} id={`s-${s.id}`} aria-labelledby={`h-${s.id}`}>
                <h2 id={`h-${s.id}`} className="lg-h2"><span aria-hidden>{s.id}</span>{s.title}</h2>
                {s.body.map((p, i) => <p key={i} className="z-body">{p}</p>)}
              </section>
            ))}
            <div className="lg-contact">
              <p className="z-body">{ui.questions}</p>
              <div className="lg-contact-actions">
                <a className="z-btn z-btn-quiet z-btn-small" href={`mailto:${CONTACT_EMAIL}`}><Mail size={15} aria-hidden /> <span dir="ltr">{CONTACT_EMAIL}</span></a>
                <a className="z-btn z-btn-quiet z-btn-small" href={waLink("Hello. I have a question about your policies.")} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={15} aria-hidden /> <span dir="ltr">+{WHATSAPP_NUMBER}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="lg-foot">
        <div className="z-wrap lg-foot-in">
          <Link href="/">{ui.home}</Link>
          {(["privacy", "terms", "refund"] as Kind[]).map(k => (
            <Link key={k} href={HREF[k]} aria-current={k === kind ? "page" : undefined}>{ui.links[k]}</Link>
          ))}
          <span>© {new Date().getFullYear()} Zenith Dubai CV</span>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
.lg-top{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--z-bg) 92%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--z-rule)}
.lg-top-in{display:flex;align-items:center;justify-content:space-between;height:64px}
.lg-brand{font-size:22px;color:var(--z-fg);text-decoration:none}
.lg-tools{display:flex;align-items:center;gap:8px}
.lg-seg{display:inline-flex;border:1px solid var(--z-rule-strong);border-radius:999px;padding:3px}
.lg-seg button{min-width:38px;min-height:34px;padding:0 10px;border-radius:999px;font-size:13px;font-weight:600;color:var(--z-fg-2)}
.lg-seg button[aria-pressed="true"]{background:var(--z-fg);color:var(--z-bg)}
.lg-icon{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:999px;border:1px solid var(--z-rule-strong);color:var(--z-fg-2)}
.lg-main{padding-top:56px;padding-bottom:96px}
.lg-h1{margin:10px 0 8px}
.lg-intro{margin-top:18px}
.lg-highlight{margin-top:22px;padding:16px 18px;border-radius:14px;border:1px solid color-mix(in srgb,var(--z-gold) 55%,transparent);background:var(--z-gold-wash);color:var(--z-fg);font-size:16px;max-width:62ch}
.lg-grid{display:grid;grid-template-columns:240px minmax(0,1fr);gap:56px;margin-top:56px;align-items:start}
.lg-toc{position:sticky;top:96px}
.lg-toc ol{list-style:none;margin-top:10px;display:flex;flex-direction:column;gap:2px}
.lg-toc a{display:block;padding:6px 0;font-size:14px;color:var(--z-fg-2);text-decoration:none;line-height:1.45}
.lg-toc a:hover{color:var(--z-gold-text)}
.lg-body{max-width:72ch}
.lg-body section{padding-bottom:28px;margin-bottom:28px;border-bottom:1px solid var(--z-rule);scroll-margin-top:90px}
.lg-h2{display:flex;gap:14px;align-items:baseline;font-family:var(--font-serif),Georgia,serif;font-size:24px;font-weight:500;line-height:1.3;color:var(--z-fg);margin-bottom:12px}
[dir="rtl"] .lg-h2{font-family:var(--font-arabic-serif),var(--font-arabic),serif}
.lg-h2 span{font-family:var(--font-sans),sans-serif;font-size:13px;color:var(--z-gold-text);font-variant-numeric:tabular-nums}
.lg-body .z-body+.z-body{margin-top:12px}
.lg-contact{padding:22px;border-radius:16px;background:var(--z-surface);border:1px solid var(--z-rule)}
.lg-contact-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.lg-foot{border-top:1px solid var(--z-rule)}
.lg-foot-in{display:flex;flex-wrap:wrap;gap:10px 22px;padding-block:24px;font-size:14px;color:var(--z-fg-3)}
.lg-foot a{color:var(--z-fg-2);text-decoration:underline;text-underline-offset:3px}
.lg-foot a[aria-current="page"]{color:var(--z-gold-text)}
@media (max-width:900px){.lg-grid{grid-template-columns:minmax(0,1fr);gap:28px}.lg-toc{position:static;padding:16px 18px;border:1px solid var(--z-rule);border-radius:14px}}
`;
