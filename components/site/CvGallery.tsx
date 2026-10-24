"use client";
// components/site/CvGallery.tsx — design CVs and ATS-friendly CVs: sample layouts (placeholder
// content) on a dark stage, sheets that lift as they pass the middle of the strip, and a full-page
// view. Keyboard: Escape closes the view; arrows move through it.
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { pick, type L10n, type Lang } from "@/lib/site";

const ATS = [1, 5, 9, 26, 27];
const DESIGN = Array.from({ length: 33 }, (_, i) => i + 1).filter(n => !ATS.includes(n));

const T: Record<string, L10n> = {
  h2: { en: "Design CVs and ATS-friendly CVs.", fr: "CV design et CV compatibles ATS.", ar: "سير ذاتية بتصميم مميز وأخرى متوافقة مع أنظمة الفرز." },
  lede: {
    en: "Sample layouts with placeholder content. A design CV stands out when a person reads it; an ATS-friendly CV is read cleanly by online application systems. Your package includes the one your applications need.",
    fr: "Des modèles de mise en page au contenu fictif. Un CV design se remarque à la lecture ; un CV compatible ATS est lu sans erreur par les logiciels de candidature. Votre formule inclut celui dont vos candidatures ont besoin.",
    ar: "نماذج تصميم بمحتوى افتراضي. السيرة المصمّمة تلفت انتباه القارئ، والسيرة المتوافقة مع أنظمة الفرز تُقرأ بدقة في أنظمة التقديم الإلكتروني. تشمل باقتك ما تحتاجه طلباتك.",
  },
  design: { en: "Design CVs", fr: "CV design", ar: "سير بتصميم مميز" },
  ats: { en: "ATS-friendly CVs", fr: "CV compatibles ATS", ar: "سير متوافقة مع أنظمة الفرز" },
  open: { en: "View sample", fr: "Voir le modèle", ar: "عرض النموذج" },
  close: { en: "Close", fr: "Fermer", ar: "إغلاق" },
  prev: { en: "Previous", fr: "Précédent", ar: "السابق" },
  next: { en: "Next", fr: "Suivant", ar: "التالي" },
  sample: { en: "Sample CV", fr: "Modèle de CV", ar: "نموذج سيرة ذاتية" },
};
const t = (k: string, l: Lang) => pick(T[k], l);

export default function CvGallery({ lang }: { lang: Lang }) {
  const [tab, setTab] = useState<"design" | "ats">("design");
  const [open, setOpen] = useState<number | null>(null);
  const list = tab === "design" ? DESIGN : ATS;
  const label = (n: number) => `${t("sample", lang)} ${n}, ${ATS.includes(n) ? t("ats", lang) : t("design", lang)}`;

  useEffect(() => {
    if (open === null) return;
    const i = list.indexOf(open);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen(list[(i + 1) % list.length]);
      if (e.key === "ArrowLeft") setOpen(list[(i - 1 + list.length) % list.length]);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, list]);

  return (
    <section className="z-section cg" aria-labelledby="cg-title">
      <style href="zenith-cv-gallery" precedence="medium">{CSS}</style>
      <div className="z-wrap z-wrap-wide">
        <h2 id="cg-title" className="z-h2">{t("h2", lang)}</h2>
        <p className="z-lede" style={{ marginTop: 16 }}>{t("lede", lang)}</p>
        <div className="cg-tabs" role="group">
          {(["design", "ats"] as const).map(k => (
            <button key={k} type="button" className="z-chip" aria-pressed={tab === k} onClick={() => setTab(k)}>
              {t(k, lang)} <span className="cg-n">{(k === "design" ? DESIGN : ATS).length}</span>
            </button>
          ))}
        </div>
      </div>
      <ul className="cg-strip" tabIndex={0} aria-label={tab === "design" ? t("design", lang) : t("ats", lang)}>
        {list.map(n => (
          <li key={`${tab}-${n}`}>
            <button type="button" className="cg-sheet" onClick={() => setOpen(n)} aria-label={`${t("open", lang)}: ${label(n)}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/cv-samples/cv${n}-600.webp`} alt="" width={600} height={849} loading="lazy" decoding="async" />
              <span className="cg-tag">{ATS.includes(n) ? "ATS" : t("design", lang)}</span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div className="cg-view" role="dialog" aria-modal="true" aria-label={label(open)} onClick={e => { if (e.target === e.currentTarget) setOpen(null); }}>
          <button type="button" className="cg-btn cg-close" onClick={() => setOpen(null)} aria-label={t("close", lang)} autoFocus><X size={20} /></button>
          <button type="button" className="cg-btn cg-prev" onClick={() => { const i = list.indexOf(open); setOpen(list[(i - 1 + list.length) % list.length]); }} aria-label={t("prev", lang)}><ChevronLeft size={22} /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/cv-samples/cv${open}-1400.webp`} alt={label(open)} width={1400} height={1981} />
          <button type="button" className="cg-btn cg-next" onClick={() => { const i = list.indexOf(open); setOpen(list[(i + 1) % list.length]); }} aria-label={t("next", lang)}><ChevronRight size={22} /></button>
        </div>
      )}
    </section>
  );
}

const CSS = `
.cg-tabs{display:flex;gap:8px;margin-top:26px;flex-wrap:wrap}
.cg-n{font-size:12px;opacity:.6}
.cg-strip{list-style:none;margin:30px 0 0;padding:26px max(20px,calc((100vw - 1320px)/2 + 40px)) 34px;display:flex;gap:clamp(16px,2vw,28px);overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:thin;background:radial-gradient(ellipse 60% 70% at 50% 40%,rgba(226,201,142,.07),transparent 70%)}
.cg-strip li{flex:0 0 clamp(170px,19vw,250px);scroll-snap-align:start}
.cg-sheet{position:relative;display:block;width:100%;padding:0;border:0;border-radius:4px;background:#fff;cursor:zoom-in;box-shadow:0 26px 50px -28px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.06);transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s}
.cg-sheet img{display:block;width:100%;height:auto;border-radius:4px}
.cg-sheet:hover,.cg-sheet:focus-visible{transform:translateY(-8px) rotate(-.4deg);box-shadow:0 36px 60px -26px rgba(0,0,0,.9),0 0 0 1px var(--z-gold)}
.cg-sheet:focus-visible{outline:2px solid var(--z-focus);outline-offset:4px}
.cg-tag{position:absolute;top:10px;inset-inline-end:10px;padding:3px 9px;border-radius:999px;background:rgba(10,9,7,.82);color:var(--z-gold-text);font-size:11.5px;font-weight:600}
.cg-strip:focus-visible{outline:2px solid var(--z-focus);outline-offset:-2px}
.cg-view{position:fixed;inset:0;z-index:95;display:flex;align-items:center;justify-content:center;padding:24px 70px;background:rgba(8,7,5,.94);backdrop-filter:blur(8px)}
.cg-view img{max-height:calc(100dvh - 48px);max-width:100%;width:auto;height:auto;border-radius:3px;box-shadow:0 30px 80px -20px rgba(0,0,0,.8)}
.cg-btn{position:absolute;display:grid;place-items:center;width:46px;height:46px;border-radius:50%;border:1px solid rgba(237,232,224,.3);background:rgba(10,9,7,.6);color:#ede8e0;cursor:pointer}
.cg-close{top:16px;right:16px}.cg-prev{left:14px;top:50%;transform:translateY(-50%)}.cg-next{right:14px;top:50%;transform:translateY(-50%)}
@media (max-width:640px){.cg-view{padding:64px 10px 10px}.cg-prev,.cg-next{top:auto;bottom:16px;transform:none}}
@media (prefers-reduced-motion:reduce){.cg-sheet{transition:none}.cg-sheet:hover{transform:none}}
`;
