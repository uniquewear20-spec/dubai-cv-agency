"use client";
// components/site/ServicesPanel.tsx — individual services, for visitors who need one thing.
// Kept behind a disclosure so the four packages stay the main choice. Same catalog, discounts
// and PayPal checkout as before (lib/checkout/catalog.ts); the server re-prices every order.

import React, { useEffect, useState } from "react";
import { AlertCircle, ChevronDown, Loader2 } from "lucide-react";
import { SERVICES, aedToUsd, getDiscount, quotePackage, type Service } from "@/lib/checkout/catalog";
import { startCheckout } from "@/lib/checkout/client";
import { CURRENCIES, convertAed, formatAmount, type Currency, type Rates } from "@/lib/currency";
import { pick, type L10n, type Lang } from "@/lib/site";

const NAMES: Record<string, L10n> = {
  "cv-ats": { en: "CV writing, ATS-friendly", fr: "Rédaction de CV compatible ATS", ar: "كتابة سيرة ذاتية متوافقة مع الفرز الآلي" },
  "cv-design": { en: "Executive CV design", fr: "Design de CV exécutif", ar: "تصميم سيرة ذاتية تنفيذية" },
  "cover-letter": { en: "Cover letter", fr: "Lettre de motivation", ar: "خطاب تغطية" },
  linkedin: { en: "LinkedIn profile makeover", fr: "Refonte du profil LinkedIn", ar: "تجديد ملف لينكدإن" },
  "apps-5": { en: "5 job applications submitted for you", fr: "5 candidatures envoyées pour vous", ar: "5 طلبات توظيف نقدّمها نيابةً عنك" },
  "apps-10": { en: "10 job applications submitted for you", fr: "10 candidatures envoyées pour vous", ar: "10 طلبات توظيف نقدّمها نيابةً عنك" },
  "apps-30": { en: "30 job applications submitted for you", fr: "30 candidatures envoyées pour vous", ar: "30 طلب توظيف نقدّمها نيابةً عنك" },
  coaching: { en: "Interview coaching, 60 minutes", fr: "Coaching entretien, 60 minutes", ar: "تدريب على المقابلات، 60 دقيقة" },
  strategy: { en: "Career strategy session", fr: "Séance de stratégie de carrière", ar: "جلسة استراتيجية مهنية" },
  branding: { en: "Portfolio and personal branding kit", fr: "Kit portfolio et personal branding", ar: "مجموعة الملف التعريفي والعلامة الشخصية" },
};
const CATS: Record<Service["category"], L10n> = {
  document: { en: "Documents", fr: "Documents", ar: "الوثائق" },
  digital: { en: "Online presence", fr: "Présence en ligne", ar: "الحضور الرقمي" },
  applications: { en: "Applications", fr: "Candidatures", ar: "طلبات التوظيف" },
  coaching: { en: "Coaching", fr: "Coaching", ar: "التدريب" },
};
const T: Record<string, L10n> = {
  toggle: { en: "Need just one service? Build your own selection", fr: "Besoin d'un seul service ? Composez votre sélection", ar: "تحتاج خدمة واحدة فقط؟ اختر ما يناسبك" },
  intro: {
    en: "Choose any services below. Two services save 10%, three save 15% and four or more save 20%, applied automatically.",
    fr: "Choisissez les services ci-dessous. 10 % de remise pour deux services, 15 % pour trois et 20 % à partir de quatre, appliqués automatiquement.",
    ar: "اختر أي خدمات أدناه. خصم 10% لخدمتين و15% لثلاث و20% لأربع أو أكثر، يُطبَّق تلقائياً.",
  },
  subtotal: { en: "Subtotal", fr: "Sous-total", ar: "المجموع الجزئي" },
  discount: { en: "Bundle saving", fr: "Remise", ar: "خصم الباقة" },
  total: { en: "Total", fr: "Total", ar: "الإجمالي" },
  charged: { en: "PayPal charges US$", fr: "PayPal débite US$", ar: "يخصم PayPal مبلغ US$" },
  none: { en: "Select at least one service.", fr: "Sélectionnez au moins un service.", ar: "اختر خدمة واحدة على الأقل." },
  pay: { en: "Pay with PayPal", fr: "Payer avec PayPal", ar: "ادفع عبر PayPal" },
  redirecting: { en: "Opening PayPal…", fr: "Ouverture de PayPal…", ar: "جارٍ فتح PayPal…" },
  error: {
    en: "PayPal could not be opened. Try again, or message us on WhatsApp.",
    fr: "PayPal n'a pas pu s'ouvrir. Réessayez, ou écrivez-nous sur WhatsApp.",
    ar: "تعذّر فتح PayPal. حاول مجدداً أو راسلنا عبر واتساب.",
  },
  approx: { en: "approx.", fr: "env.", ar: "تقريباً" },
};
const t = (k: string, l: Lang) => pick(T[k], l);

function money(aed: number, currency: Currency, rates: Rates, lang: Lang): string {
  if (currency === "AED") return `AED ${formatAmount(aed)}`;
  if (currency === "USD") return `US$${aedToUsd(aed)}`;
  const sym = CURRENCIES.find(c => c.code === currency)?.symbol ?? currency;
  return `${t("approx", lang)} ${sym} ${formatAmount(convertAed(aed, currency, rates))}`;
}

export default function ServicesPanel({ lang, currency, rates }: { lang: Lang; currency: Currency; rates: Rates }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  // Links to #custom-builder (from the websites section) open the panel.
  useEffect(() => {
    const check = () => { if (window.location.hash === "#custom-builder") setOpen(true); };
    const frame = requestAnimationFrame(check);
    window.addEventListener("hashchange", check);
    const reset = (e: PageTransitionEvent) => { if (e.persisted) setBusy(false); };
    window.addEventListener("pageshow", reset);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("hashchange", check); window.removeEventListener("pageshow", reset); };
  }, []);

  const quote = quotePackage(selected);
  const discount = getDiscount(quote.services.length);
  const cats = Array.from(new Set(SERVICES.map(s => s.category)));

  const toggle = (id: string) => setSelected(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  async function pay() {
    if (busy || selected.length === 0) return;
    setBusy(true);
    setError(false);
    try { await startCheckout({ items: selected }, lang); }
    catch { setError(true); setBusy(false); }
  }

  return (
    <div id="custom-builder" className="sv">
      <style href="zenith-services" precedence="medium">{CSS}</style>
      <button type="button" className="sv-toggle" aria-expanded={open} aria-controls="sv-body" onClick={() => setOpen(o => !o)}>
        <span>{t("toggle", lang)}</span>
        <ChevronDown size={18} aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {open && (
        <div id="sv-body" className="sv-body">
          <p className="z-small">{t("intro", lang)}</p>
          <div className="sv-cols">
            {cats.map(cat => (
              <fieldset key={cat} className="sv-cat">
                <legend>{pick(CATS[cat], lang)}</legend>
                {SERVICES.filter(s => s.category === cat).map(s => (
                  <label key={s.id} className="sv-item">
                    <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
                    <span className="sv-name">{pick(NAMES[s.id] ?? { en: s.name, fr: s.name, ar: s.name }, lang)}</span>
                    <span className="sv-price" dir="ltr">AED {s.price}</span>
                  </label>
                ))}
              </fieldset>
            ))}
          </div>
          <div className="sv-total" aria-live="polite">
            {quote.services.length === 0 ? (
              <p className="z-small">{t("none", lang)}</p>
            ) : (
              <dl>
                <div><dt>{t("subtotal", lang)}</dt><dd dir="ltr">AED {formatAmount(quote.subtotal)}</dd></div>
                {discount > 0 && <div><dt>{t("discount", lang)} ({Math.round(discount * 100)}%)</dt><dd dir="ltr">− AED {formatAmount(quote.savings)}</dd></div>}
                <div className="sv-grand"><dt>{t("total", lang)}</dt><dd dir="ltr">{money(quote.total, currency, rates, lang)}</dd></div>
                <div><dt className="z-micro">{t("charged", lang)}<span dir="ltr">{aedToUsd(quote.total)}</span></dt></div>
              </dl>
            )}
            <button type="button" className="z-btn z-btn-primary" onClick={pay} disabled={busy || selected.length === 0} aria-busy={busy}>
              {busy ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />{t("redirecting", lang)}</> : t("pay", lang)}
            </button>
            {error && <p role="alert" className="pk-err"><AlertCircle size={15} aria-hidden="true" />{t("error", lang)}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
.sv{margin-top:36px;border:1px solid var(--z-rule);border-radius:20px;background:var(--z-surface)}
.sv-toggle{display:flex;width:100%;justify-content:space-between;align-items:center;gap:16px;min-height:64px;padding:0 24px;border:0;background:transparent;color:var(--z-fg);font:inherit;font-size:16px;font-weight:500;cursor:pointer;text-align:start;border-radius:20px}
.sv-body{padding:4px 24px 26px}
.sv-cols{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;margin-top:18px}
@media (max-width:1000px){.sv-cols{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.sv-cols{grid-template-columns:1fr}}
.sv-cat{border:0;margin:0;padding:0;min-width:0}
.sv-cat legend{font-size:14px;font-weight:600;color:var(--z-gold-text);margin-bottom:8px}
.sv-item{display:grid;grid-template-columns:20px 1fr auto;gap:10px;align-items:start;padding:10px 0;border-top:1px solid var(--z-rule);font-size:14px;line-height:1.45;cursor:pointer}
.sv-item input{width:18px;height:18px;margin-top:1px;accent-color:#c8a96e}
.sv-price{color:var(--z-fg-2);white-space:nowrap;font-variant-numeric:tabular-nums}
.sv-total{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:18px;margin-top:22px;padding-top:20px;border-top:1px solid var(--z-rule)}
.sv-total dl{margin:0;display:grid;gap:4px;min-width:240px}
.sv-total dl div{display:flex;justify-content:space-between;gap:20px;font-size:14px;color:var(--z-fg-2)}
.sv-total dd{margin:0;font-variant-numeric:tabular-nums}
.sv-grand{font-size:17px!important;color:var(--z-fg)!important;font-weight:600}
`;
