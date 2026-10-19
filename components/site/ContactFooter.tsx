// components/site/ContactFooter.tsx — closing contact band and footer.
import React from "react";
import { CONTACT_EMAIL, SOCIAL_LINKS, pick, waLink, type L10n, type Lang } from "@/lib/site";

const T: Record<string, L10n> = {
  h2: { en: "Not sure which package fits?", fr: "Vous hésitez entre deux formules ?", ar: "لست متأكداً أي باقة تناسبك؟" },
  body: {
    en: "Tell us your current role and where you want to go next. We reply within 24 hours with a straight recommendation.",
    fr: "Dites-nous votre poste actuel et ce que vous visez. Nous répondons sous 24 heures avec une recommandation claire.",
    ar: "أخبرنا بمنصبك الحالي ووجهتك التالية، وسنرد خلال 24 ساعة بتوصية واضحة.",
  },
  whatsapp: { en: "Message us on WhatsApp", fr: "Écrire sur WhatsApp", ar: "راسلنا عبر واتساب" },
  email: { en: "Send a message", fr: "Envoyer un message", ar: "أرسل رسالة" },
  tagline: {
    en: "CVs, LinkedIn profiles and job applications, written in English, French and Arabic.",
    fr: "CV, profils LinkedIn et candidatures, rédigés en français, en anglais et en arabe.",
    ar: "سير ذاتية وملفات لينكدإن وطلبات توظيف، بالعربية والإنجليزية والفرنسية.",
  },
  explore: { en: "Explore", fr: "Explorer", ar: "تصفّح" },
  legal: { en: "Policies", fr: "Informations légales", ar: "السياسات" },
  contact: { en: "Contact", fr: "Contact", ar: "التواصل" },
  privacy: { en: "Privacy policy", fr: "Politique de confidentialité", ar: "سياسة الخصوصية" },
  terms: { en: "Terms of service", fr: "Conditions d'utilisation", ar: "شروط الخدمة" },
  refund: { en: "Refund policy", fr: "Politique de remboursement", ar: "سياسة الاسترداد" },
  follow: { en: "Follow", fr: "Suivre", ar: "تابعنا" },
  designs: { en: "CV designs", fr: "CV", ar: "تصاميم السير" },
  packages: { en: "Packages", fr: "Formules", ar: "الباقات" },
  process: { en: "How it works", fr: "Déroulement", ar: "طريقة العمل" },
  websites: { en: "Portfolio websites", fr: "Sites portfolio", ar: "المواقع التعريفية" },
  agent: { en: "AI job agent", fr: "Agent emploi IA", ar: "وكيل الوظائف" },
  faq: { en: "FAQ", fr: "FAQ", ar: "الأسئلة الشائعة" },
};
const t = (k: string, l: Lang) => pick(T[k], l);

export function ContactSection({ lang, onEnquire }: { lang: Lang; onEnquire: () => void }) {
  return (
    <section id="contact" className="z-section ct" aria-labelledby="ct-title">
      <style href="zenith-footer" precedence="medium">{CSS}</style>
      <div className="z-wrap ct-inner">
        <h2 id="ct-title" className="z-h2">{t("h2", lang)}</h2>
        <p className="z-lede" style={{ marginTop: 16 }}>{t("body", lang)}</p>
        <div className="ct-actions">
          <a className="z-btn z-btn-primary" href={waLink("Hello Zenith Dubai CV. I'd like help choosing a package.")} target="_blank" rel="noopener noreferrer">{t("whatsapp", lang)}</a>
          <button type="button" className="z-btn z-btn-quiet" onClick={onEnquire}>{t("email", lang)}</button>
        </div>
      </div>
    </section>
  );
}

export default function SiteFooter({ lang }: { lang: Lang }) {
  return (
    <>
      <style href="zenith-footer" precedence="medium">{CSS}</style>
      <footer className="ft">
        <div className="z-wrap z-wrap-wide ft-grid">
          <div className="ft-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Zenith Dubai CV" width={110} height={62} />
            <p className="z-small" style={{ marginTop: 14, maxWidth: "34ch" }}>{t("tagline", lang)}</p>
          </div>
          <nav aria-label={t("explore", lang)}>
            <h3 className="ft-h">{t("explore", lang)}</h3>
            <a href="#cv-designs">{t("designs", lang)}</a>
            <a href="#packages">{t("packages", lang)}</a>
            <a href="#process">{t("process", lang)}</a>
            <a href="#websites">{t("websites", lang)}</a>
            <a href="/agent/">{t("agent", lang)}</a>
            <a href="#faq">{t("faq", lang)}</a>
          </nav>
          <nav aria-label={t("legal", lang)}>
            <h3 className="ft-h">{t("legal", lang)}</h3>
            <a href="/privacy/">{t("privacy", lang)}</a>
            <a href="/terms/">{t("terms", lang)}</a>
            <a href="/refund/">{t("refund", lang)}</a>
          </nav>
          <div>
            <h3 className="ft-h">{t("contact", lang)}</h3>
            <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">{CONTACT_EMAIL}</a>
            <a href={waLink("Hello Zenith Dubai CV.")} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <h3 className="ft-h" style={{ marginTop: 18 }}>{t("follow", lang)}</h3>
            <div className="ft-social">
              {SOCIAL_LINKS.map(s => <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer">{s.name}</a>)}
            </div>
          </div>
        </div>
        <div className="z-wrap z-wrap-wide ft-base">
          <p className="z-micro" suppressHydrationWarning>© {new Date().getFullYear()} Zenith Dubai CV</p>
        </div>
      </footer>

      <a className="ft-wa" href={waLink("Hello Zenith Dubai CV.")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M12 22a10 10 0 0 0 8.66-15 10 10 0 0 0-16.9 10.6L3 22l4.56-.7A10 10 0 0 0 12 22Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9.35 8.9c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3.1.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.2-.2-.3-.5-.4l-1.9-.9c-.2-.1-.4-.1-.6.1-.2.2-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.5c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.5l-.8-2Z" fill="white" /></svg>
      </a>
    </>
  );
}

const CSS = `
.ct{background:linear-gradient(180deg,transparent,var(--z-gold-wash))}
.ct-inner{text-align:center;display:flex;flex-direction:column;align-items:center}
.ct-inner .z-lede{margin-inline:auto}
.ct-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:30px}
.ft{border-top:1px solid var(--z-rule);padding:56px 0 28px}
.ft-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1.2fr;gap:32px}
@media (max-width:900px){.ft-grid{grid-template-columns:1fr 1fr}}
@media (max-width:520px){.ft-grid{grid-template-columns:1fr}}
.ft-brand img{width:110px;height:auto;border-radius:6px}
html[data-theme="light"] .ft-brand img{filter:brightness(0) saturate(0)}
.ft nav,.ft-grid>div{display:flex;flex-direction:column;gap:8px}
.ft-h{font-size:14px;font-weight:600;color:var(--z-fg);margin-bottom:4px}
.ft a{font-size:14px;color:var(--z-fg-2);text-decoration:none;width:fit-content}
.ft a:hover{color:var(--z-gold-text);text-decoration:underline;text-underline-offset:3px}
.ft-social{display:flex;flex-wrap:wrap;gap:8px 14px}
.ft-base{margin-top:40px;padding-top:20px;border-top:1px solid var(--z-rule)}
.ft-wa{position:fixed;bottom:20px;inset-inline-end:20px;z-index:40;display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:#1f9d55;box-shadow:0 10px 26px -8px rgba(0,0,0,.5)}
.ft-wa:hover{background:#1a8a4a}
`;
