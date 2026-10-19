// components/site/PhotoSection.tsx — LinkedIn profile photo enhancement (included in every package).
// A calm, swipeable strip instead of an auto-scrolling marquee: people move it themselves.
import React from "react";
import { pick, type L10n, type Lang } from "@/lib/site";

// img4 is left out on purpose (it shows an airline uniform).
const PHOTOS = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const T: Record<string, L10n> = {
  h2: { en: "A profile photo that matches the CV.", fr: "Une photo de profil à la hauteur de votre CV.", ar: "صورة شخصية بمستوى سيرتك الذاتية." },
  body: {
    en: "LinkedIn profile photo enhancement is included in every package. Send us a recent photo of yourself and we return it enhanced for LinkedIn and your CV.",
    fr: "L'amélioration de la photo de profil LinkedIn est incluse dans chaque formule. Envoyez-nous une photo récente de vous : nous vous la renvoyons améliorée pour LinkedIn et votre CV.",
    ar: "تحسين صورة لينكدإن مشمول في كل باقة. أرسل لنا صورة حديثة لك، ونعيدها إليك محسّنة لملف لينكدإن وسيرتك الذاتية.",
  },
  strip: { en: "Example portraits", fr: "Exemples de portraits", ar: "أمثلة على الصور" },
  hint: { en: "Swipe or scroll to see more.", fr: "Faites défiler pour en voir plus.", ar: "مرّر لرؤية المزيد." },
};

export default function PhotoSection({ lang }: { lang: Lang }) {
  return (
    <section id="photos" className="z-section" aria-labelledby="ph-title">
      <style href="zenith-photos" precedence="medium">{CSS}</style>
      <div className="z-wrap z-wrap-wide ph-head">
        <h2 id="ph-title" className="z-h2">{pick(T.h2, lang)}</h2>
        <p className="z-lede">{pick(T.body, lang)}</p>
      </div>
      <ul className="ph-strip" aria-label={pick(T.strip, lang)} tabIndex={0}>
        {PHOTOS.map(n => (
          <li key={n}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/team/img${n}.webp`} alt="" width={420} height={499} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
      <p className="z-wrap z-wrap-wide z-micro ph-note">{pick(T.strip, lang)}. {pick(T.hint, lang)}</p>
    </section>
  );
}

const CSS = `
.ph-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(20px,5vw,72px);align-items:end;margin-bottom:40px}
@media (max-width:900px){.ph-head{grid-template-columns:1fr}}
.ph-strip{list-style:none;margin:0;padding:4px max(20px,calc((100vw - 1320px)/2 + 40px)) 12px;display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:thin}
.ph-strip li{flex:0 0 clamp(150px,18vw,210px);scroll-snap-align:start}
.ph-strip img{display:block;width:100%;height:auto;aspect-ratio:420/499;object-fit:cover;object-position:top;border-radius:10px;filter:saturate(.92)}
.ph-strip:focus-visible{outline:2px solid var(--z-focus);outline-offset:4px}
.ph-note{margin-top:12px}
`;
