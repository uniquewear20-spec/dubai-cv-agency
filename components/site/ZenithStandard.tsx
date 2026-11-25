// components/site/ZenithStandard.tsx — the trust chapter: what Zenith commits to, what it will never
// do, and (only when they exist) client statements published with written consent.
// No ratings, review counts or invented statements, by design. Used on the homepage and About.

import React from "react";
import { pick, type L10n, type Lang } from "@/lib/site";
import { publishedTestimonials } from "@/lib/testimonials";

type L = L10n;

const T = {
  title: { en: "The Zenith Standard", fr: "L'exigence Zenith", ar: "معيار Zenith" } as L,
  sub: { en: "Our approach. Our process. Our commitment.", fr: "Notre approche. Notre méthode. Notre engagement.", ar: "نهجنا. منهجنا. التزامنا." } as L,
  commitTitle: { en: "What we commit to", fr: "Ce à quoi nous nous engageons", ar: "ما نلتزم به" } as L,
  neverTitle: { en: "What we will never do", fr: "Ce que nous ne ferons jamais", ar: "ما لن نفعله أبداً" } as L,
  consentNote: {
    en: "Client statements appear here only with each client's written consent.",
    fr: "Les témoignages de clients apparaissent ici uniquement avec leur accord écrit.",
    ar: "لا تظهر آراء العملاء هنا إلا بموافقتهم الكتابية.",
  } as L,
  share: { en: "Are you a Zenith client? Share your experience", fr: "Vous êtes client de Zenith ? Partagez votre expérience", ar: "هل أنت عميل لدى Zenith؟ شارك تجربتك" } as L,
  founder: {
    en: "Founded by Abdelilah El Khayir, after more than eleven years in hospitality operations, including international luxury hospitality.",
    fr: "Fondée par Abdelilah El Khayir, après plus de onze ans dans l'exploitation hôtelière, notamment dans l'hôtellerie de luxe internationale.",
    ar: "أسسها Abdelilah El Khayir بعد أكثر من أحد عشر عاماً في تشغيل قطاع الضيافة، بما في ذلك الضيافة الفاخرة الدولية.",
  } as L,
  about: { en: "About Zenith", fr: "À propos de Zenith", ar: "عن Zenith" } as L,
  founderAlt: { en: "Abdelilah El Khayir, founder of Zenith Dubai", fr: "Abdelilah El Khayir, fondateur de Zenith Dubai", ar: "Abdelilah El Khayir، مؤسس Zenith Dubai" } as L,
};

const COMMIT: L[] = [
  {
    en: "Your CV is written from your real experience, and every figure in it comes from you.",
    fr: "Votre CV est rédigé à partir de votre expérience réelle ; chaque chiffre vient de vous.",
    ar: "تُكتب سيرتك من خبرتك الحقيقية، وكل رقم فيها مصدره أنت.",
  },
  {
    en: "A first draft within 48 hours of your complete brief.",
    fr: "Une première version sous 48 heures après votre brief complet.",
    ar: "مسودة أولى خلال 48 ساعة من استلام ملخصك كاملاً.",
  },
  {
    en: "Unlimited revisions for 30 days after delivery, within your brief.",
    fr: "Des révisions illimitées pendant 30 jours après la livraison, dans le cadre de votre brief.",
    ar: "تعديلات غير محدودة لمدة 30 يوماً بعد التسليم، ضمن نطاق ملخصك.",
  },
  {
    en: "A full refund if you ask within 7 days of purchase.",
    fr: "Un remboursement intégral sur demande dans les 7 jours suivant l'achat.",
    ar: "استرداد كامل للمبلغ إذا طلبته خلال 7 أيام من الشراء.",
  },
  {
    en: "Your documents are used to deliver your order, and for nothing else.",
    fr: "Vos documents servent à exécuter votre commande, et à rien d'autre.",
    ar: "تُستخدم مستنداتك لتنفيذ طلبك فقط، ولا شيء غير ذلك.",
  },
];

const NEVER: L[] = [
  {
    en: "Promise interviews, job offers, salaries or visas. Employers and authorities decide those.",
    fr: "Promettre des entretiens, des offres, des salaires ou des visas. Ce sont les employeurs et les autorités qui en décident.",
    ar: "أن نعد بمقابلات أو عروض عمل أو رواتب أو تأشيرات؛ فهذه قرارات أصحاب العمل والجهات المختصة.",
  },
  {
    en: "Invent experience, employers, qualifications or results.",
    fr: "Inventer des expériences, des employeurs, des diplômes ou des résultats.",
    ar: "أن نختلق خبرات أو جهات عمل أو مؤهلات أو نتائج.",
  },
  {
    en: "Publish a client's words without written consent, or show ratings we cannot verify.",
    fr: "Publier les mots d'un client sans son accord écrit, ou afficher des notes invérifiables.",
    ar: "أن ننشر كلام عميل دون موافقته الكتابية، أو نعرض تقييمات لا يمكن التحقق منها.",
  },
  {
    en: "Sell or share your data for marketing.",
    fr: "Vendre ou partager vos données à des fins marketing.",
    ar: "أن نبيع بياناتك أو نشاركها لأغراض تسويقية.",
  },
];

const CSS = `
.zst{--p:#F5F1EB;--ink:#1A1410;--ink2:#4C4037;--ink3:#6B5D52;--rule:rgba(26,20,16,.16);--gold-ink:#7D5F22;background:var(--p);color:var(--ink);padding-block:clamp(88px,11vw,152px)}
html[data-theme="light"] .zst{--p:#ECE4D8}
.zst .z-h2{color:var(--ink);max-width:18ch}
.zst-sub{margin-top:14px;font-size:clamp(18px,1.6vw,21px);color:var(--ink2);font-family:var(--font-serif),Georgia,serif}
[dir="rtl"] .zst-sub{font-family:var(--font-arabic-serif),serif}
.zst-head{padding-bottom:clamp(32px,4vw,48px);border-bottom:1px solid var(--rule)}
.zst-cols{display:grid;grid-template-columns:1fr;gap:40px;padding-top:clamp(32px,4vw,48px)}
@media (min-width:860px){.zst-cols{grid-template-columns:1fr 1fr;gap:0}.zst-col+.zst-col{border-inline-start:1px solid var(--rule);padding-inline-start:clamp(32px,4vw,56px)}.zst-col:first-child{padding-inline-end:clamp(32px,4vw,56px)}}
.zst-h3{font-size:15px;font-weight:600;color:var(--ink);margin-bottom:18px}
.zst-list{list-style:none;margin:0;padding:0;display:grid;gap:0}
.zst-list li{position:relative;padding:14px 0 14px 28px;border-top:1px solid var(--rule);font-size:17px;line-height:1.6;color:var(--ink)}
[dir="rtl"] .zst-list li{padding:14px 28px 14px 0}
.zst-list li:last-child{border-bottom:1px solid var(--rule)}
.zst-list li::before{content:"";position:absolute;inset-inline-start:0;top:27px;width:14px;height:1px;background:var(--gold-ink)}
.zst-no li{color:var(--ink2)}
.zst-no li::before,.zst-no li::after{content:"";position:absolute;inset-inline-start:0;top:27px;width:12px;height:1px;background:var(--ink3)}
.zst-no li::before{transform:rotate(45deg)}
.zst-no li::after{transform:rotate(-45deg)}
.zst-quotes{list-style:none;margin:0;padding:clamp(32px,4vw,48px) 0 0;display:grid;gap:32px}
@media (min-width:860px){.zst-quotes{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}}
.zst-quotes blockquote{margin:0;font-family:var(--font-serif),Georgia,serif;font-size:21px;line-height:1.45;color:var(--ink)}
[dir="rtl"] .zst-quotes blockquote{font-family:var(--font-arabic-serif),serif}
.zst-quotes figcaption{margin-top:12px;font-size:14px;color:var(--ink3)}
.zst-foot{margin-top:clamp(40px,5vw,64px);display:grid;gap:20px}
.zst-founder{display:flex;align-items:center;gap:16px;max-width:640px}
.zst-founder img{width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:50% 16%;flex:none;background:#0A0907}
.zst-founder p{font-size:16px;line-height:1.6;color:var(--ink2)}
.zst a{color:var(--gold-ink);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}
.zst a:hover{text-decoration-thickness:2px}
.zst a:focus-visible{outline:2px solid var(--gold-ink);outline-offset:3px;border-radius:2px}
.zst-note{font-size:15px;line-height:1.6;color:var(--ink3)}
`;

export default function ZenithStandard({ lang, withFounder = false }: { lang: Lang; withFounder?: boolean }) {
  const quotes = publishedTestimonials();
  return (
    <section id="standard" className="zst" aria-labelledby="zst-h">
      <style href="zenith-standard" precedence="medium">{CSS}</style>
      <div className="z-wrap z-wrap-wide">
        <header className="zst-head">
          <h2 id="zst-h" className="z-h2">{pick(T.title, lang)}</h2>
          <p className="zst-sub">{pick(T.sub, lang)}</p>
        </header>

        {quotes.length > 0 && (
          <ul className="zst-quotes">
            {quotes.map(q => (
              <li key={q.id}>
                <figure lang={q.lang}>
                  <blockquote>{q.quote}</blockquote>
                  <figcaption>{[q.display === "anonymous" ? "" : q.name, q.role].filter(Boolean).join(", ")}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}

        <div className="zst-cols">
          <div className="zst-col">
            <h3 className="zst-h3">{pick(T.commitTitle, lang)}</h3>
            <ul className="zst-list zst-yes">
              {COMMIT.map((c, i) => <li key={i}>{pick(c, lang)}</li>)}
            </ul>
          </div>
          <div className="zst-col">
            <h3 className="zst-h3">{pick(T.neverTitle, lang)}</h3>
            <ul className="zst-list zst-no">
              {NEVER.map((c, i) => <li key={i}>{pick(c, lang)}</li>)}
            </ul>
          </div>
        </div>

        <div className="zst-foot">
          {withFounder && (
            <div className="zst-founder">
              <img src="/about/founder-480.webp" alt={pick(T.founderAlt, lang)} width={56} height={56} loading="lazy" decoding="async" />
              <p>{pick(T.founder, lang)} <a href="/about/">{pick(T.about, lang)}</a></p>
            </div>
          )}
          <p className="zst-note">
            {quotes.length === 0 && <>{pick(T.consentNote, lang)} </>}
            <a href="/review/">{pick(T.share, lang)}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
