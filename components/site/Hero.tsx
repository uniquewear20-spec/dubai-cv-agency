// components/site/Hero.tsx — the opening screen.
// The visual is an edit in progress on a fictional CV (the "Maison" concept): weak lines are
// struck through and rewritten, with margin notes explaining why. It plays once on load,
// in CSS; with reduced motion it simply shows the finished edit.

import React from "react";
import { pick, type L10n, type Lang } from "@/lib/site";

const T: Record<string, L10n> = {
  h1a: { en: "We don't write CVs.", fr: "Nous n'écrivons pas des CV.", ar: "لا نكتب سيرًا ذاتية." },
  h1b: { en: "We engineer careers.", fr: "Nous construisons des carrières.", ar: "نبني مسارات مهنية." },
  lede: {
    en: "CVs, LinkedIn profiles and job applications for professionals aiming at the Gulf, Europe and beyond. Written from your real experience by a career specialist, in English, French or Arabic.",
    fr: "CV, profils LinkedIn et candidatures pour les professionnels qui visent le Golfe, l'Europe et au-delà. Rédigés par un spécialiste à partir de votre parcours réel, en français, en anglais ou en arabe.",
    ar: "سير ذاتية وملفات لينكدإن وطلبات توظيف للمهنيين الذين يستهدفون الخليج وأوروبا وما بعدهما. يكتبها مختص من خبرتك الحقيقية، بالعربية أو الإنجليزية أو الفرنسية.",
  },
  primary: { en: "See the packages", fr: "Voir les formules", ar: "عرض الباقات" },
  secondary: { en: "Explore CV designs", fr: "Découvrir les CV", ar: "استعرض تصاميم السير" },
  f1: { en: "First draft within 48 hours of your brief", fr: "Premier jet sous 48 heures après votre brief", ar: "المسودة الأولى خلال 48 ساعة من استلام معلوماتك" },
  f2: { en: "Unlimited revisions for 30 days", fr: "Révisions illimitées pendant 30 jours", ar: "تعديلات غير محدودة لمدة 30 يوماً" },
  f3: { en: "From AED 179, paid once", fr: "Dès 179 AED, en un seul paiement", ar: "ابتداءً من 179 درهماً، بدفعة واحدة" },
  n1: { en: "Lead with scope: outlets, team, revenue.", fr: "Commencer par l'envergure : points de vente, équipe, chiffre d'affaires.", ar: "ابدأ بحجم المسؤولية: المنافذ والفريق والإيرادات." },
  n2: { en: "Replace effort with a result you can measure.", fr: "Remplacer l'effort par un résultat mesurable.", ar: "استبدل الجهد بنتيجة يمكن قياسها." },
  n3: { en: "Keywords taken from the roles she is targeting.", fr: "Des mots-clés tirés des postes qu'elle vise.", ar: "كلمات مفتاحية مأخوذة من الوظائف التي تستهدفها." },
  caption: { en: "A sample edit on a fictional CV.", fr: "Exemple de correction sur un CV fictif.", ar: "مثال على تحرير سيرة ذاتية افتراضية." },
};
const t = (k: string, l: Lang) => pick(T[k], l);

export default function Hero({ lang }: { lang: Lang }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <style href="zenith-hero" precedence="medium">{CSS}</style>
      <div className="z-wrap z-wrap-wide hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title" className="z-h1">
            <span className="hero-l1">{t("h1a", lang)}</span>
            <span className="hero-l2">{t("h1b", lang)}</span>
          </h1>
          <p className="z-lede hero-lede">{t("lede", lang)}</p>
          <div className="hero-ctas">
            <a className="z-btn z-btn-primary" href="#packages">{t("primary", lang)}</a>
            <a className="z-btn z-btn-quiet" href="#cv-designs">{t("secondary", lang)}</a>
          </div>
          <ul className="hero-facts">
            <li>{t("f1", lang)}</li>
            <li>{t("f2", lang)}</li>
            <li>{t("f3", lang)}</li>
          </ul>
        </div>

        <figure className="hero-figure">
          <div className="hero-sheet" dir="ltr" lang="en">
            <p className="hs-name">Sofia Benali</p>
            <p className="hs-role">Director of Food &amp; Beverage <span>Dubai</span></p>
            <div className="hs-rule" />
            <p className="hs-sec">Experience</p>
            <p className="hs-job"><b>Director of Food &amp; Beverage</b><span>2020 – present</span></p>
            <p className="hs-org">Five-star hotel with nine outlets, Dubai</p>

            <div className="hs-edit hs-e1">
              <p className="hs-old"><span>Responsible for the daily running of restaurants and staff.</span></p>
              <p className="hs-new">Run nine outlets and a team of 240, with AED 96m in annual revenue.</p>
              <p className="hs-note" dir="auto" lang={lang}>{t("n1", lang)}</p>
            </div>
            <div className="hs-edit hs-e2">
              <p className="hs-old"><span>Helped to reduce costs.</span></p>
              <p className="hs-new">Brought food cost from 31% to 27.5% through menu engineering.</p>
              <p className="hs-note" dir="auto" lang={lang}>{t("n2", lang)}</p>
            </div>

            <p className="hs-sec" style={{ marginTop: 18 }}>Expertise</p>
            <div className="hs-edit hs-e3">
              <p className="hs-keys"><mark>Pre-opening</mark><mark>Menu engineering</mark><mark>Revenue management</mark></p>
              <p className="hs-note" dir="auto" lang={lang}>{t("n3", lang)}</p>
            </div>
          </div>
          <figcaption className="z-micro hero-cap">{t("caption", lang)}</figcaption>
        </figure>
      </div>
    </section>
  );
}

const CSS = `
.hero{position:relative;padding-block:clamp(48px,7vw,104px) clamp(72px,9vw,128px);overflow:hidden}
.hero::before{content:"";position:absolute;inset:-20% -10% auto auto;width:70vw;height:70vw;max-width:900px;max-height:900px;background:radial-gradient(closest-side,rgba(200,169,110,.10),transparent 70%);pointer-events:none}
[dir="rtl"] .hero::before{inset:-20% auto auto -10%}
.hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);gap:clamp(40px,5vw,80px);align-items:center}
.hero .z-h1{font-size:clamp(42px,5.3vw,72px)}
[dir="rtl"] .hero .z-h1{font-size:clamp(36px,4.6vw,62px)}
@media (max-width:980px){.hero-grid{grid-template-columns:1fr}}
.hero .z-h1 span{display:block}
.hero-l2{color:var(--z-gold-text)}
.hero-lede{margin-top:26px;max-width:54ch}
.hero-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px}
.hero-facts{list-style:none;margin:34px 0 0;padding:22px 0 0;border-top:1px solid var(--z-rule);display:flex;flex-wrap:wrap;gap:10px 26px}
.hero-facts li{position:relative;padding-inline-start:16px;font-size:14px;color:var(--z-fg-2)}
.hero-facts li::before{content:"";position:absolute;inset-inline-start:0;top:.62em;width:6px;height:6px;border-radius:50%;background:var(--z-gold)}
@media (max-width:560px){.hero-ctas .z-btn{flex:1 1 100%}}

.hero-figure{margin:0;position:relative}
.hero-sheet{position:relative;background:var(--z-sheet);color:#231a14;border-radius:6px;padding:34px 34px 30px;box-shadow:var(--z-shadow),0 0 0 1px rgba(0,0,0,.04);font-family:var(--font-sans),Arial,sans-serif;font-size:14px;line-height:1.5;max-width:520px;margin-inline:auto;animation:hs-in .7s cubic-bezier(.22,1,.36,1) both}
.hs-name{font-family:var(--font-serif),Georgia,serif;font-size:31px;line-height:1.05;letter-spacing:-.01em;color:#231a14}
.hs-role{margin-top:6px;font-size:13px;font-weight:600;color:#8c5a2b;display:flex;gap:12px}
.hs-role span{font-weight:400;color:#6e6056}
.hs-rule{height:2px;width:44px;background:#8c5a2b;margin:16px 0 14px}
.hs-sec{font-size:10.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#8c5a2b;margin-bottom:6px}
.hs-job{display:flex;justify-content:space-between;gap:12px;font-size:14px}
.hs-job span{font-size:12px;color:#6e6056;white-space:nowrap}
.hs-org{font-size:12.5px;color:#6e6056;margin-bottom:10px}
.hs-edit{position:relative;margin-top:10px;padding-inline-start:14px;border-inline-start:2px solid rgba(140,90,43,.25)}
.hs-old{font-size:13px;color:#8a7d72}
.hs-old span{background:linear-gradient(#b0413e,#b0413e) no-repeat 0 58%/100% 1.5px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.hs-new{margin-top:3px;font-size:14px;font-weight:500;color:#231a14}
.hs-note{margin-top:7px;font-size:12.5px;line-height:1.45;color:#7d5f22;font-style:normal;display:flex;gap:6px}
.hs-note::before{content:"";flex:none;width:14px;height:1px;margin-top:.75em;background:#c8a96e}
[lang="ar"].hs-note{font-family:var(--font-arabic),Tahoma,sans-serif;font-size:13.5px}
.hs-keys{display:flex;flex-wrap:wrap;gap:6px}
.hs-keys mark{background:rgba(200,169,110,.22);color:#231a14;padding:1px 8px;border-radius:3px;font-size:12.5px}
.hero-cap{margin-top:14px;text-align:center}

@media (min-width:1180px){
  .hero-sheet{padding-right:200px;max-width:640px}
  .hs-edit{position:static}
  .hs-note{position:absolute;right:22px;width:160px;margin:0;transform:translateY(-100%);padding-top:8px;border-top:1px solid #c8a96e}
  .hs-note::before{display:none}
}

/* The one orchestrated moment: strike, rewrite, annotate. */
@media (prefers-reduced-motion:no-preference){
  .hs-old span{animation:hs-strike .45s ease-out both}
  .hs-new{animation:hs-write .7s cubic-bezier(.65,0,.35,1) both}
  .hs-note{animation:hs-fade .5s ease-out both}
  .hs-keys mark{animation:hs-mark .5s ease-out both}
  .hs-e1 .hs-old span{animation-delay:.9s}.hs-e1 .hs-new{animation-delay:1.3s}.hs-e1 .hs-note{animation-delay:1.9s}
  .hs-e2 .hs-old span{animation-delay:2.3s}.hs-e2 .hs-new{animation-delay:2.7s}.hs-e2 .hs-note{animation-delay:3.3s}
  .hs-e3 mark:nth-child(1){animation-delay:3.7s}.hs-e3 mark:nth-child(2){animation-delay:3.85s}.hs-e3 mark:nth-child(3){animation-delay:4s}.hs-e3 .hs-note{animation-delay:4.3s}
}
@keyframes hs-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes hs-strike{from{background-size:0% 1.5px}to{background-size:100% 1.5px}}
@keyframes hs-write{from{clip-path:inset(0 100% 0 0);opacity:.2}to{clip-path:inset(0 0 0 0);opacity:1}}
@keyframes hs-fade{from{opacity:0}to{opacity:1}}
@keyframes hs-mark{from{background-color:transparent}to{background-color:rgba(200,169,110,.22)}}
@media (prefers-reduced-motion:reduce){.hero-sheet{animation:none}}
`;
