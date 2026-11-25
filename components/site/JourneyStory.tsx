"use client";
// components/site/JourneyStory.tsx — the scroll story under the hero: how Zenith takes a search from a
// first look at the CV to the offer, in five stages, each linked to the part of Zenith that does it
// (CV X-Ray, the packages, the AI job agent, the interview coach, WhatsApp).
// Desktop: a sticky panel follows the stage being read, with a gold line that fills as the visitor
// scrolls. Under 900px the stages stack as cards. Reduced motion: no loops, no slide-ins.
//
// Every sentence here describes what the site and agent do today (checked against lib/packages.ts,
// lib/agent and the X-Ray). No numbers of applications: those wait for the package decision.

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { pick, waLink, type L10n, type Lang } from "@/lib/site";

interface Stage { key: string; name: L10n; title: L10n; problem: L10n; answer: L10n; cta: L10n; href: string | "wa" }

const STAGES: Stage[] = [
  {
    key: "diagnose",
    name: { en: "Diagnose", fr: "Diagnostiquer", ar: "التشخيص" },
    title: { en: "See your CV the way the software does", fr: "Voir votre CV comme le logiciel le voit", ar: "شاهد سيرتك كما يراها النظام" },
    problem: {
      en: "You can't see how an applicant tracking system reads your CV, or what it skips.",
      fr: "Vous ne voyez pas comment un logiciel de recrutement lit votre CV, ni ce qu'il ignore.",
      ar: "لا ترى كيف يقرأ نظام تتبّع المتقدمين سيرتك، ولا ما يتجاهله.",
    },
    answer: {
      en: "The free CV X-Ray reads it in your browser, compares it with the job you want and shows what to fix first. Your file never leaves your device.",
      fr: "La radiographie de CV gratuite le lit dans votre navigateur, le compare au poste visé et montre quoi corriger d'abord. Votre fichier ne quitte jamais votre appareil.",
      ar: "يقرأ فحص السيرة المجاني ملفك داخل متصفحك، ويقارنه بالوظيفة التي تريدها، ويُظهر ما تصلحه أولاً. ملفك لا يغادر جهازك أبداً.",
    },
    cta: { en: "Run the free X-Ray", fr: "Lancer la radiographie gratuite", ar: "ابدأ الفحص المجاني" },
    href: "/x-ray/",
  },
  {
    key: "engineer",
    name: { en: "Engineer", fr: "Concevoir", ar: "الهندسة" },
    title: { en: "Position you for the role you want", fr: "Vous positionner pour le poste visé", ar: "تموضعك للوظيفة التي تريدها" },
    problem: {
      en: "A list of duties doesn't earn a shortlist. Results and a clear target do.",
      fr: "Une liste de tâches ne décroche pas d'entretien. Des résultats et une cible claire, si.",
      ar: "قائمة المهام لا تضعك في القائمة القصيرة. النتائج والهدف الواضح يفعلان.",
    },
    answer: {
      en: "Your CV is professionally rewritten from your real experience, around your results and the role you want, in the language you need. LinkedIn optimisation is included from Career Advantage.",
      fr: "Votre CV est réécrit par un professionnel à partir de votre parcours réel, autour de vos résultats et du poste visé, dans la langue qu'il vous faut. L'optimisation LinkedIn est incluse dès Avantage Carrière.",
      ar: "تُعاد كتابة سيرتك باحتراف من خبرتك الحقيقية، حول نتائجك والوظيفة التي تريدها، وباللغة التي تحتاجها. تحسين ملف لينكدإن مشمول ابتداءً من باقة الميزة المهنية.",
    },
    cta: { en: "Compare the packages", fr: "Comparer les formules", ar: "قارن الباقات" },
    href: "#packages",
  },
  {
    key: "automate",
    name: { en: "Automate", fr: "Automatiser", ar: "الأتمتة" },
    title: { en: "Let the agent do the searching", fr: "Laissez l'agent chercher pour vous", ar: "دع الوكيل يبحث عنك" },
    problem: {
      en: "Finding the right openings and tailoring every application takes hours.",
      fr: "Trouver les bonnes offres et adapter chaque candidature prend des heures.",
      ar: "إيجاد الفرص المناسبة وتخصيص كل طلب يستغرق ساعات.",
    },
    answer: {
      en: "The Zenith AI job agent finds jobs that fit your CV, ranks them and prepares each application with you. You approve every step. Job search, ranking and template drafts are free for everyone.",
      fr: "L'agent Zenith AI trouve les offres qui correspondent à votre CV, les classe et prépare chaque candidature avec vous. Vous validez chaque étape. La recherche, le classement et les brouillons modèles sont gratuits pour tous.",
      ar: "يجد وكيل Zenith AI الوظائف التي تناسب سيرتك، ويرتّبها، ويجهّز كل طلب معك. أنت توافق على كل خطوة. البحث والترتيب والمسودات الجاهزة مجانية للجميع.",
    },
    cta: { en: "Open the AI job agent", fr: "Ouvrir l'agent IA", ar: "افتح وكيل الوظائف" },
    href: "/agent/",
  },
  {
    key: "rehearse",
    name: { en: "Rehearse", fr: "Répéter", ar: "التدريب" },
    title: { en: "Practise the interview out loud", fr: "S'entraîner à voix haute", ar: "تدرّب على المقابلة بصوت مسموع" },
    problem: {
      en: "Knowing your answers is not the same as saying them under pressure.",
      fr: "Connaître ses réponses n'est pas la même chose que les dire sous pression.",
      ar: "أن تعرف إجاباتك يختلف عن قولها تحت الضغط.",
    },
    answer: {
      en: "In the interview coach, an animated interviewer (not a real person) asks questions for your role in English, French or Arabic, follows up on what you actually say, then scores your answers on eight criteria with an action plan.",
      fr: "Dans le coach d'entretien, un recruteur animé (pas une vraie personne) pose des questions pour votre poste en anglais, français ou arabe, rebondit sur ce que vous dites vraiment, puis note vos réponses sur huit critères avec un plan d'action.",
      ar: "في مدرّب المقابلات، يطرح محاور متحرّك (ليس شخصاً حقيقياً) أسئلة تخص وظيفتك بالعربية أو الإنجليزية أو الفرنسية، ويتابع ما تقوله فعلاً، ثم يقيّم إجاباتك وفق ثمانية معايير مع خطة عمل.",
    },
    cta: { en: "See the interview coach", fr: "Voir le coach d'entretien", ar: "اطّلع على مدرّب المقابلات" },
    href: "/agent/#interview",
  },
  {
    key: "arrive",
    name: { en: "Arrive", fr: "Arriver", ar: "الوصول" },
    title: { en: "Follow through to the offer", fr: "Aller jusqu'à l'offre", ar: "تابع حتى العرض الوظيفي" },
    problem: {
      en: "Applications get lost between versions, follow-ups and deadlines.",
      fr: "Les candidatures se perdent entre les versions, les relances et les échéances.",
      ar: "تضيع الطلبات بين النسخ والمتابعات والمواعيد.",
    },
    answer: {
      en: "The agent's tracker follows each application from saved to offer, with follow-up reminders, free. Your CV gets unlimited revisions for 30 days after delivery. We can't promise a job; we can make you a stronger candidate.",
      fr: "Le suivi de l'agent accompagne chaque candidature, de l'enregistrement à l'offre, avec des rappels de relance, gratuitement. Votre CV bénéficie de révisions illimitées pendant 30 jours après la livraison. Nous ne pouvons pas promettre un emploi ; nous pouvons faire de vous un meilleur candidat.",
      ar: "يتابع متتبّع الوكيل كل طلب من الحفظ حتى العرض، مع تذكيرات بالمتابعة، مجاناً. وتحصل سيرتك على تعديلات غير محدودة لمدة 30 يوماً بعد التسليم. لا يمكننا أن نعدك بوظيفة، لكن يمكننا أن نجعلك مرشحاً أقوى.",
    },
    cta: { en: "Talk to us on WhatsApp", fr: "Nous écrire sur WhatsApp", ar: "راسلنا عبر واتساب" },
    href: "wa",
  },
];

const H2: L10n = { en: "We don't just write CVs. We engineer careers.", fr: "Nous ne faisons pas qu'écrire des CV. Nous concevons des carrières.", ar: "لا نكتب سيراً ذاتية فحسب. نحن نهندس المسارات المهنية." };
const LEDE: L10n = {
  en: "Five stages, one system. Start free, and go as far as your search needs.",
  fr: "Cinq étapes, un seul système. Commencez gratuitement, allez aussi loin que votre recherche l'exige.",
  ar: "خمس مراحل، ونظام واحد. ابدأ مجاناً، واذهب بقدر ما يحتاجه بحثك.",
};
const PROBLEM: L10n = { en: "The problem:", fr: "Le problème :", ar: "المشكلة:" };
const WA_TEXT: L10n = {
  en: "Hello Zenith Dubai CV, I'd like to talk about my job search.",
  fr: "Bonjour Zenith Dubai CV, j'aimerais parler de ma recherche d'emploi.",
  ar: "مرحباً Zenith Dubai CV، أود التحدث عن بحثي عن عمل.",
};

const EASE = [0.22, 1, 0.36, 1] as const;
/** Lines draw on when the drawing scrolls into view; `custom` is the delay in seconds. */
const DRAW: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (delay: number = 0) => ({ pathLength: 1, opacity: 1, transition: { duration: 1.1, ease: EASE, delay } }),
};

/** A line drawing for each stage, in the brand's gold. Decorative. */
function Motif({ k }: { k: string }) {
  const s = { stroke: "currentColor", strokeWidth: 1.4, fill: "none", vectorEffect: "non-scaling-stroke" as const, variants: DRAW };
  return (
    <motion.svg viewBox="0 0 240 240" className="js-motif" aria-hidden focusable="false" initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.4 }}>
      {k === "diagnose" && (<>
        <motion.rect x="62" y="30" width="116" height="160" rx="6" {...s} custom={0} />
        {[58, 74, 98, 112, 126, 150, 164].map((y, i) => <motion.line key={y} x1="78" x2={i % 3 === 0 ? 132 : 160} y1={y} y2={y} {...s} custom={0.15 + i * 0.05} />)}
        <motion.line x1="48" x2="192" y1="40" y2="40" stroke="currentColor" strokeWidth={2} initial={{ y: 0, opacity: 0 }} animate={{ y: [0, 150, 0], opacity: 1 }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      </>)}
      {k === "engineer" && (<>
        {[50, 90, 130, 170].map((v, i) => <motion.line key={`h${v}`} x1="30" x2="210" y1={v} y2={v} {...s} strokeOpacity={0.35} custom={i * 0.05} />)}
        {[50, 90, 130, 170].map((v, i) => <motion.line key={`v${v}`} y1="30" y2="210" x1={v} x2={v} {...s} strokeOpacity={0.35} custom={i * 0.05} />)}
        <motion.path d="M40 190 L90 150 L130 160 L200 60" {...s} strokeWidth={2.2} custom={0.3} />
        <motion.circle cx="200" cy="60" r="7" {...s} custom={0.9} />
      </>)}
      {k === "automate" && (<>
        {[[120, 120], [56, 70], [184, 64], [60, 176], [186, 178], [120, 40]].map(([x, y], i) => <motion.circle key={i} cx={x} cy={y} r={i === 0 ? 16 : 7} {...s} custom={i * 0.08} />)}
        {[[56, 70], [184, 64], [60, 176], [186, 178], [120, 40]].map(([x, y], i) => {
          // Spokes run from the hub's edge to each node's edge.
          const len = Math.hypot(x - 120, y - 120), ux = (x - 120) / len, uy = (y - 120) / len;
          return <motion.line key={i} x1={120 + 16 * ux} y1={120 + 16 * uy} x2={x - 7 * ux} y2={y - 7 * uy} {...s} strokeOpacity={0.6} custom={0.3 + i * 0.08} />;
        })}
      </>)}
      {k === "rehearse" && [18, 34, 60, 44, 82, 56, 96, 52, 74, 40, 58, 28, 16].map((h, i) => (
        <motion.line key={i} x1={36 + i * 14} x2={36 + i * 14} y1={120 - h / 2} y2={120 + h / 2} stroke="currentColor" strokeWidth={3} strokeLinecap="round"
          initial={{ scaleY: 0.4, opacity: 0 }} animate={{ scaleY: [0.4, 1, 0.6, 1], opacity: 1 }} transition={{ duration: 2.4, repeat: Infinity, repeatType: "mirror", delay: i * 0.08 }} />
      ))}
      {k === "arrive" && (<>
        <motion.line x1="20" x2="220" y1="168" y2="168" {...s} custom={0} />
        <motion.path d="M70 168 A50 50 0 0 1 170 168" {...s} strokeWidth={2} custom={0.2} />
        {[1, 2, 3, 4, 5].map(i => {
          const a = Math.PI * (1 + i / 6);
          return <motion.line key={i} x1={120 + 60 * Math.cos(a)} y1={168 + 60 * Math.sin(a)} x2={120 + 82 * Math.cos(a)} y2={168 + 82 * Math.sin(a)} {...s} strokeOpacity={0.6} custom={0.5 + i * 0.06} />;
        })}
      </>)}
    </motion.svg>
  );
}

export default function JourneyStory({ lang }: { lang: Lang }) {
  const [active, setActive] = useState(0);
  const grid = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const { scrollYProgress } = useScroll({ target: grid, offset: ["start 50%", "end 50%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // The stage crossing the middle of the screen is the active one.
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const stage = STAGES[active];
  const href = (s: Stage) => (s.href === "wa" ? waLink(pick(WA_TEXT, lang)) : s.href);

  return (
    <section id="journey" className="z-section js" aria-labelledby="journey-title">
      <style href="zenith-journey" precedence="medium">{CSS}</style>
      <div className="z-wrap">
        <header className="js-head">
          <h2 id="journey-title" className="z-h2">{pick(H2, lang)}</h2>
          <p className="z-lede">{pick(LEDE, lang)}</p>
        </header>
        <div className="js-grid" ref={grid}>
          <div className="js-stage" aria-hidden>
            <div className="js-panel">
              <div className="js-rail"><motion.span className="js-fill" style={{ scaleY: progress }} /></div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={stage.key} className="js-show" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE }}>
                  <p className="js-num z-serif">{String(active + 1).padStart(2, "0")}<span>/05</span></p>
                  <Motif k={stage.key} />
                  <p className="js-name">{pick(stage.name, lang)}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <ol className="js-list">
            {STAGES.map((s, i) => (
              <li key={s.key} ref={el => { items.current[i] = el; }} data-i={i} className={`js-item${i === active ? " is-active" : ""}`}>
                <div className="js-mobile-motif" aria-hidden><Motif k={s.key} /></div>
                <p className="js-label"><span className="js-n">{String(i + 1).padStart(2, "0")}</span>{pick(s.name, lang)}</p>
                <h3 className="z-h3 js-title">{pick(s.title, lang)}</h3>
                <p className="js-problem"><span>{pick(PROBLEM, lang)}</span> {pick(s.problem, lang)}</p>
                <p className="z-body">{pick(s.answer, lang)}</p>
                <a className="z-link js-cta" href={href(s)} {...(s.href === "wa" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {pick(s.cta, lang)}<ArrowRight size={16} aria-hidden className="js-flip" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.js-head{max-width:760px;margin-bottom:clamp(36px,6vw,64px)}
.js-head .z-h2{margin-bottom:16px;text-wrap:balance}
.js-grid{position:relative;display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,6vw,96px)}
.js-panel{position:sticky;top:calc(50vh - min(32vh,280px));height:min(64vh,560px);border-radius:28px;border:1px solid var(--z-rule);background:radial-gradient(120% 90% at 30% 20%,var(--z-gold-wash),transparent 60%),var(--z-surface);overflow:hidden;display:grid;place-items:center}
.js-rail{position:absolute;inset-inline-start:28px;top:28px;bottom:28px;width:2px;border-radius:2px;background:var(--z-rule)}
.js-fill{position:absolute;inset:0;border-radius:2px;background:linear-gradient(var(--z-gold),#e2c98e);transform-origin:top}
.js-show{display:grid;justify-items:center;gap:6px;color:var(--z-gold-text);padding:24px}
.js-num{font-size:clamp(64px,7vw,104px);line-height:1;color:var(--z-fg);letter-spacing:-.02em;font-variant-numeric:lining-nums}
.js-num span{font-size:.24em;letter-spacing:.08em;color:var(--z-fg-3);margin-inline-start:8px;vertical-align:.35em}
.js-motif{width:min(220px,60%);height:auto;color:var(--z-gold-text);overflow:visible}
.js-name{font-size:13px;letter-spacing:.18em;text-transform:uppercase;font-weight:500}
[dir="rtl"] .js-name{letter-spacing:0;font-size:16px;text-transform:none}
.js-list{list-style:none;margin:0;padding:0;display:grid}
.js-item{min-height:64vh;display:grid;align-content:center;justify-items:start;gap:12px;padding-block:24px;opacity:.35;transition:opacity .5s ease}
.js-item.is-active,.js-item:focus-within{opacity:1}
.js-label{display:flex;align-items:center;gap:12px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--z-gold-text);font-weight:500}
[dir="rtl"] .js-label{letter-spacing:0;font-size:15px;text-transform:none}
.js-n{font-variant-numeric:tabular-nums;color:var(--z-fg-3)}
.js-title{max-width:26ch;text-wrap:balance}
.js-problem{color:var(--z-fg-2);font-size:16px;line-height:1.65;padding-inline-start:14px;border-inline-start:2px solid var(--z-rule-strong)}
.js-problem span{font-weight:600;color:var(--z-fg)}
.js-item .z-body{max-width:58ch}
.js-cta{display:inline-flex;align-items:center;gap:8px;margin-top:4px;font-weight:500;min-height:44px}
[dir="rtl"] .js-flip{transform:scaleX(-1)}
.js-mobile-motif{display:none}
@media (max-width:900px){
  .js-grid{grid-template-columns:minmax(0,1fr);gap:0}
  .js-stage{display:none}
  .js-item{min-height:0;opacity:1;padding-block:32px;border-top:1px solid var(--z-rule)}
  .js-mobile-motif{display:block;width:88px;margin-bottom:4px}
  .js-mobile-motif .js-motif{width:88px}
}
@media (prefers-reduced-motion:reduce){
  .js-item{opacity:1;transition:none}
}
`;
