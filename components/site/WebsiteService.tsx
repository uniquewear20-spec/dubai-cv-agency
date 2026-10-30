// components/site/WebsiteService.tsx — business websites (from AED 1,000), next to the portfolio
// websites (from AED 300): the kinds of site we build, and a way to send the project's details.
"use client";
import React, { useState } from "react";
import WebsiteBrief, { STYLES, optLabel } from "./WebsiteBrief";
import { Mail, MessageCircle } from "lucide-react";
import { pick, waLink, type L10n, type Lang } from "@/lib/site";
import { FALLBACK_RATES, priceText, type Currency, type Rates } from "@/lib/currency";

const APPROX: Record<Lang, string> = { en: "approx.", fr: "env.", ar: "تقريباً" };

const T: Record<string, L10n> = {
  h: { en: "Websites for your business, from {a}", fr: "Des sites pour votre entreprise, dès {a}", ar: "مواقع لأعمالك، ابتداءً من {a}" },
  body: {
    en: "Beyond personal portfolios (from {b}), we design and build complete websites for companies and brands. Choose your field, send us the details and we reply with a quote and a timeline.",
    fr: "Au-delà des portfolios personnels (dès {b}), nous concevons et réalisons des sites complets pour les entreprises et les marques. Choisissez votre secteur, envoyez-nous les détails : nous répondons avec un devis et un délai.",
    ar: "إلى جانب المواقع التعريفية الشخصية (ابتداءً من {b})، نصمم وننفّذ مواقع متكاملة للشركات والعلامات التجارية. اختر مجالك وأرسل لنا التفاصيل، وسنرد بعرض سعر وجدول زمني.",
  },
  pick: { en: "Choose your field to fill in the brief", fr: "Choisissez votre secteur pour remplir le brief", ar: "اختر مجالك لتعبئة الملخص" },
  send: { en: "Send your website details", fr: "Envoyer les détails de votre site", ar: "أرسل تفاصيل موقعك" },
  wa: { en: "Discuss on WhatsApp", fr: "En parler sur WhatsApp", ar: "تحدّث معنا عبر واتساب" },
  from: { en: "From {a}", fr: "Dès {a}", ar: "ابتداءً من {a}" },
  adv: { en: "Advanced styles: 3D, motion and more", fr: "Styles avancés : 3D, animation et plus", ar: "أساليب متقدمة: ثلاثي الأبعاد والحركة والمزيد" },
};
const KINDS: L10n[] = [
  { en: "Real estate", fr: "Immobilier", ar: "العقارات" },
  { en: "Beauty & salon", fr: "Beauté et salon", ar: "التجميل والصالونات" },
  { en: "Restaurant & café", fr: "Restaurant et café", ar: "المطاعم والمقاهي" },
  { en: "Hotel & travel", fr: "Hôtel et voyage", ar: "الفنادق والسفر" },
  { en: "Clinic & healthcare", fr: "Clinique et santé", ar: "العيادات والصحة" },
  { en: "Online store", fr: "Boutique en ligne", ar: "متجر إلكتروني" },
  { en: "Law & consulting", fr: "Droit et conseil", ar: "المحاماة والاستشارات" },
  { en: "Fitness & wellness", fr: "Sport et bien-être", ar: "اللياقة والعافية" },
  { en: "Construction & interiors", fr: "Construction et intérieur", ar: "البناء والتصميم الداخلي" },
  { en: "Events & weddings", fr: "Événements et mariages", ar: "الفعاليات والأعراس" },
  { en: "Landing page", fr: "Page d'atterrissage", ar: "صفحة هبوط" },
  { en: "Booking website", fr: "Site de réservation", ar: "موقع حجوزات" },
];
const t0 = (k: string, l: Lang) => pick(T[k], l);

export default function WebsiteService({ lang, currency = "AED", rates }: { lang: Lang; onEnquire?: () => void; currency?: Currency; rates?: Rates }) {
  const r = rates ?? FALLBACK_RATES;
  const t = (k: string, l: Lang) => t0(k, l).replace("{a}", priceText(1000, currency, r, APPROX[l])).replace("{b}", priceText(300, currency, r, APPROX[l]));
  const [brief, setBrief] = useState<string | null>(null);
  const [style, setStyle] = useState<string | undefined>(undefined);
  return (
    <section className="ws" aria-labelledby="ws-title">
      <style href="zenith-websites-service" precedence="medium">{CSS}</style>
      <div className="z-wrap z-wrap-wide">
        <div className="ws-card">
          <div className="ws-head">
            <div>
              <p className="ws-price" dir="auto">{t("from", lang)}</p>
              <h2 id="ws-title" className="z-h3 z-serif ws-h">{t("h", lang)}</h2>
              <p className="z-small ws-body">{t("body", lang)}</p>
            </div>
            <div className="ws-ctas">
              <button type="button" className="z-btn z-btn-primary" onClick={() => setBrief("Other")}><Mail size={16} aria-hidden="true" /> {t("send", lang)}</button>
              <a className="z-btn z-btn-quiet" href={waLink("Hello Zenith Dubai CV, I'd like a website for my business.")} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> {t("wa", lang)}</a>
            </div>
          </div>
          <p className="z-micro ws-pick">{t("pick", lang)}</p>
          <ul className="ws-kinds">
            {KINDS.map(k => (
              <li key={k.en}>
                <button type="button" onClick={() => { setStyle(undefined); setBrief(k.en); }}>{pick(k, lang)}</button>
              </li>
            ))}
          </ul>
          <p className="z-micro ws-pick">{t("adv", lang)}</p>
          <ul className="ws-kinds ws-adv">
            {STYLES.map(s => (
              <li key={s}><button type="button" onClick={() => { setStyle(s); setBrief("Other"); }}>{optLabel(s, lang)}</button></li>
            ))}
          </ul>
        </div>
      </div>
      <WebsiteBrief key={`${brief ?? "closed"}-${style ?? ""}`} open={brief !== null} preset={brief ?? undefined} style={style} onClose={() => setBrief(null)} lang={lang} currency={currency} rates={r} />
    </section>
  );
}

const CSS = `
.ws{padding-block:0 clamp(56px,7vw,96px)}
.ws-card{padding:clamp(22px,3vw,36px);border:1px solid color-mix(in srgb,var(--z-gold) 40%,transparent);border-radius:20px;background:linear-gradient(135deg,var(--z-gold-wash),transparent 60%),var(--z-surface)}
.ws-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px 32px;align-items:end}
@media (max-width:860px){.ws-head{grid-template-columns:1fr}}
.ws-price{font-size:14px;font-weight:600;color:var(--z-gold-text)}
.ws-h{margin-top:6px;font-size:clamp(24px,2.6vw,34px);line-height:1.15}
.ws-body{margin-top:10px;max-width:64ch}
.ws-ctas{display:flex;flex-wrap:wrap;gap:10px}
.ws-ctas .z-btn{gap:8px}
.ws-pick{margin-top:22px}
.ws-kinds{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.ws-adv button{border-style:dashed}
.ws-kinds button{font:inherit;background:none;cursor:pointer;display:inline-block;padding:8px 14px;border:1px solid var(--z-rule-strong);border-radius:999px;font-size:14px;color:var(--z-fg);text-decoration:none;transition:border-color .2s,color .2s}
.ws-kinds button:hover,.ws-kinds button:focus-visible{border-color:var(--z-gold);color:var(--z-gold-text)}
`;
