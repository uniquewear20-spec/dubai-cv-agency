// components/site/Process.tsx — what happens after purchase, in order.
import React from "react";
import { pick, type L10n, type Lang } from "@/lib/site";

const STEPS: { title: L10n; body: L10n }[] = [
  {
    title: { en: "Choose and pay", fr: "Choisir et payer", ar: "اختر وادفع" },
    body: {
      en: "Pick a package and pay securely. You get an order reference and a confirmation straight away.",
      fr: "Choisissez une formule et payez en toute sécurité. Vous recevez aussitôt une référence de commande et une confirmation.",
      ar: "اختر باقة وادفع بأمان. تحصل فوراً على رقم مرجعي للطلب وتأكيد.",
    },
  },
  {
    title: { en: "Send your brief", fr: "Envoyer votre brief", ar: "أرسل معلوماتك" },
    body: {
      en: "Upload your current CV and tell us the roles and countries you are targeting, on a short form linked from your confirmation.",
      fr: "Envoyez votre CV actuel et indiquez les postes et pays visés, via un court formulaire accessible depuis votre confirmation.",
      ar: "ارفع سيرتك الحالية وأخبرنا بالوظائف والدول التي تستهدفها، عبر نموذج قصير مرتبط بتأكيد طلبك.",
    },
  },
  {
    title: { en: "First draft in 48 hours", fr: "Premier jet en 48 heures", ar: "المسودة الأولى خلال 48 ساعة" },
    body: {
      en: "Your specialist writes from your real experience and sends the first draft within 48 hours of receiving your complete brief.",
      fr: "Votre spécialiste rédige à partir de votre parcours réel et envoie le premier jet sous 48 heures après réception de votre brief complet.",
      ar: "يكتب مختصك من خبرتك الحقيقية ويرسل المسودة الأولى خلال 48 ساعة من استلام معلوماتك كاملة.",
    },
  },
  {
    title: { en: "Refine, then apply", fr: "Affiner, puis postuler", ar: "التحسين ثم التقديم" },
    body: {
      en: "Ask for as many revisions as you need for 30 days after delivery. Applications and coaching included in your package are then scheduled with you.",
      fr: "Demandez autant de révisions que nécessaire pendant 30 jours après la livraison. Les candidatures et le coaching inclus sont ensuite planifiés avec vous.",
      ar: "اطلب ما تحتاجه من تعديلات لمدة 30 يوماً بعد التسليم، ثم نُنسّق معك طلبات التوظيف والتدريب المشمولة في باقتك.",
    },
  },
];

const T: Record<string, L10n> = {
  h2: { en: "How it works", fr: "Comment ça se passe", ar: "كيف نعمل" },
  lede: {
    en: "A short, predictable process, so you always know what happens next.",
    fr: "Un processus court et prévisible : vous savez toujours ce qui suit.",
    ar: "خطوات قصيرة وواضحة، لتعرف دائماً ما الذي سيحدث بعد ذلك.",
  },
};

export default function Process({ lang }: { lang: Lang }) {
  return (
    <section id="process" className="z-section" aria-labelledby="pr-title">
      <style href="zenith-process" precedence="medium">{CSS}</style>
      <div className="z-wrap z-wrap-wide">
        <h2 id="pr-title" className="z-h2">{pick(T.h2, lang)}</h2>
        <p className="z-lede" style={{ marginTop: 16 }}>{pick(T.lede, lang)}</p>
        <ol className="pr-list">
          {STEPS.map((s, i) => (
            <li key={s.title.en}>
              <span className="pr-n z-serif" aria-hidden="true">{i + 1}</span>
              <h3 className="z-h3">{pick(s.title, lang)}</h3>
              <p className="z-body">{pick(s.body, lang)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const CSS = `
.pr-list{list-style:none;margin:48px 0 0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border-top:1px solid var(--z-rule)}
.pr-list li{position:relative;padding:30px 28px 8px 0}
[dir="rtl"] .pr-list li{padding:30px 0 8px 28px}
.pr-list li+li{padding-inline-start:28px;border-inline-start:1px solid var(--z-rule)}
.pr-n{display:block;font-size:56px;line-height:1;color:var(--z-gold-text);margin-bottom:18px;font-weight:300}
.pr-list .z-h3{margin-bottom:10px}
@media (max-width:980px){
  .pr-list{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pr-list li:nth-child(3){border-inline-start:0;padding-inline-start:0}
  .pr-list li:nth-child(n+3){border-top:1px solid var(--z-rule);margin-top:8px}
}
@media (max-width:600px){
  .pr-list{grid-template-columns:1fr}
  .pr-list li,.pr-list li+li{padding:26px 0 6px;border-inline-start:0}
  .pr-list li+li{border-top:1px solid var(--z-rule)}
}
`;
