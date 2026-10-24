"use client";
// components/site/Hero.tsx — the opening screen.
// The visual is an edit in progress on fictional CVs: weak lines are struck through and rewritten,
// with margin notes explaining why. Sofia Benali's sheet (the "Maison" concept, unchanged) opens;
// two more illustrative profiles follow once — a software engineer and an Arabic career-change
// CV — then the stage rests on Sofia's sheet again. Visitors can choose a profile or pause.
// The edits play in CSS; with reduced motion the finished edits are shown and nothing moves.

import React, { useEffect, useId, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { pick, type L10n, type Lang } from "@/lib/site";
import { REDUCED_MOTION, useMedia } from "./useMedia";

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
  n4: {
    en: "Name the tools and the change you made, then the number that proves it.",
    fr: "Nommer les outils et le changement apporté, puis le chiffre qui le prouve.",
    ar: "اذكر الأدوات والتغيير الذي أحدثته، ثم الرقم الذي يثبته.",
  },
  n5: {
    en: "Describe the job you had in the words of the job you want.",
    fr: "Décrire le poste occupé avec les mots du poste visé.",
    ar: "صِف عملك السابق بمفردات الوظيفة التي تريدها.",
  },
  caption: { en: "A sample edit on a fictional CV.", fr: "Exemple de correction sur un CV fictif.", ar: "مثال على تحرير سيرة ذاتية افتراضية." },
  examples: { en: "Sample edits", fr: "Exemples de corrections", ar: "أمثلة على التحرير" },
  pause: { en: "Pause the examples", fr: "Mettre les exemples en pause", ar: "إيقاف الأمثلة مؤقتاً" },
  play: { en: "Play the examples", fr: "Lire les exemples", ar: "تشغيل الأمثلة" },
  before: { en: "Before:", fr: "Avant :", ar: "قبل:" },
  after: { en: "After:", fr: "Après :", ar: "بعد:" },
};
const t = (k: string, l: Lang) => pick(T[k], l);

interface Edit { before: string; after: string; note: L10n }
interface Sheet {
  id: string;
  /** The profile, as the switcher shows it. */
  field: L10n;
  role: L10n;
  /** The CV's own language. */
  lang: "en" | "ar";
  name: string;
  title: string;
  city: string;
  experience: string;
  job: string;
  dates: string;
  org: string;
  edits: Edit[];
  /** An earlier role, shown as it is (no edit). */
  earlier?: { job: string; dates: string; org: string; line: string };
  education?: { sec: string; line: string };
  expertise: string;
  keys: string[];
  keysNote?: L10n;
  /** How long the sheet stays before the next one, while the examples play (ms). */
  dwell: number;
}

// Fictional people, employers and figures. Sofia Benali's sheet is the original example, word for word.
const SHEETS: Sheet[] = [
  {
    id: "hospitality",
    field: { en: "Hospitality", fr: "Hôtellerie", ar: "الضيافة" },
    role: { en: "Director of Food & Beverage", fr: "Directrice de la restauration", ar: "مديرة الأغذية والمشروبات" },
    lang: "en",
    name: "Sofia Benali",
    title: "Director of Food & Beverage",
    city: "Dubai",
    experience: "Experience",
    job: "Director of Food & Beverage",
    dates: "2020 – present",
    org: "Five-star hotel with nine outlets, Dubai",
    edits: [
      { before: "Responsible for the daily running of restaurants and staff.", after: "Run nine outlets and a team of 240, with AED 96m in annual revenue.", note: T.n1 },
      { before: "Helped to reduce costs.", after: "Brought food cost from 31% to 27.5% through menu engineering.", note: T.n2 },
    ],
    expertise: "Expertise",
    keys: ["Pre-opening", "Menu engineering", "Revenue management"],
    keysNote: T.n3,
    dwell: 8600,
  },
  {
    id: "technology",
    field: { en: "Technology", fr: "Technologie", ar: "التقنية" },
    role: { en: "Senior software engineer", fr: "Ingénieur logiciel senior", ar: "مهندس برمجيات أول" },
    lang: "en",
    name: "Omar Khalil",
    title: "Senior Software Engineer",
    city: "Riyadh",
    experience: "Experience",
    job: "Senior Software Engineer",
    dates: "2021 – present",
    org: "Payments company, Riyadh",
    edits: [
      { before: "Worked on backend services for the mobile app.", after: "Rebuilt the payments API in Go, cutting checkout time from 4.2 s to 1.1 s.", note: T.n4 },
    ],
    earlier: { job: "Software Engineer", dates: "2017 – 2021", org: "Online marketplace, Jeddah", line: "Built the seller dashboard and its reporting tools." },
    education: { sec: "Education", line: "BSc Computer Science, 2017" },
    expertise: "Expertise",
    keys: ["Go", "Kubernetes", "PostgreSQL"],
    dwell: 7200,
  },
  {
    id: "change",
    field: { en: "Career change", fr: "Reconversion", ar: "تغيير المسار" },
    role: { en: "Cabin crew to guest experience", fr: "Du personnel navigant à l'expérience client", ar: "من الطيران إلى تجربة الضيوف" },
    lang: "ar",
    name: "هالة منصور",
    title: "مديرة تجربة الضيوف",
    city: "دبي",
    experience: "الخبرة",
    job: "رئيسة طاقم الضيافة الجوية",
    dates: "2018 – الآن",
    org: "شركة طيران دولية، دبي",
    edits: [
      { before: "تقديم الخدمة للركاب على متن الرحلات الطويلة.", after: "قيادة فريق من 12 مضيفاً لخدمة 300 ضيف في كل رحلة طويلة، وحلّ الشكاوى قبل الهبوط.", note: T.n5 },
    ],
    earlier: { job: "مضيفة طيران", dates: "2013 – 2018", org: "شركة طيران إقليمية، الدوحة", line: "تدريب أفراد الطاقم الجدد على معايير الخدمة." },
    education: { sec: "التعليم", line: "بكالوريوس إدارة الأعمال، 2013" },
    expertise: "المهارات",
    keys: ["تجربة العملاء", "قيادة الفرق", "حلّ الشكاوى"],
    dwell: 7200,
  },
];

/** The examples play once, in this order, and rest on the first sheet. */
const CYCLE = [0, 1, 2, 0];
// When each block of a sheet starts its edit (seconds after the sheet appears).
const EDIT_AT = [0.9, 2.3];

function CvSheet({ sheet, lang, state, labelledBy, panelId }: { sheet: Sheet; lang: Lang; state: "on" | "out" | "off"; labelledBy: string; panelId: string }) {
  const rtl = sheet.lang === "ar";
  const keysAt = EDIT_AT[sheet.edits.length] ?? 3.7;
  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={labelledBy}
      aria-hidden={state !== "on" || undefined}
      inert={state !== "on" || undefined}
      className={`hero-sheet hx-sheet${state === "on" ? " hs-play" : ""}`}
      data-state={state}
      dir={rtl ? "rtl" : "ltr"}
      lang={sheet.lang}
    >
      <p className="hs-name">{sheet.name}</p>
      <p className="hs-role">{sheet.title} <span>{sheet.city}</span></p>
      <div className="hs-rule" />
      <p className="hs-sec">{sheet.experience}</p>
      <p className="hs-job"><b>{sheet.job}</b><span>{sheet.dates}</span></p>
      <p className="hs-org">{sheet.org}</p>

      {sheet.edits.map((e, i) => (
        <div key={i} className={`hs-edit hs-e${i + 1}`} style={{ "--d": `${EDIT_AT[i]}s` } as React.CSSProperties}>
          <p className="hs-old"><del><span className="z-sr">{t("before", lang)} </span><span>{e.before}</span></del></p>
          <p className="hs-new"><ins><span className="z-sr">{t("after", lang)} </span>{e.after}</ins></p>
          <p className="hs-note" dir="auto" lang={lang}>{pick(e.note, lang)}</p>
        </div>
      ))}

      {sheet.earlier && (
        <>
          <p className="hs-job hs-job-2"><b>{sheet.earlier.job}</b><span>{sheet.earlier.dates}</span></p>
          <p className="hs-org">{sheet.earlier.org}</p>
          <p className="hs-line">{sheet.earlier.line}</p>
        </>
      )}

      <p className="hs-sec" style={{ marginTop: 18 }}>{sheet.expertise}</p>
      <div className="hs-edit hs-e3 hs-ekeys" style={{ "--d": `${keysAt}s` } as React.CSSProperties}>
        <p className="hs-keys">{sheet.keys.map((k, i) => <mark key={k} style={{ "--i": i } as React.CSSProperties}>{k}</mark>)}</p>
        {sheet.keysNote && <p className="hs-note" dir="auto" lang={lang}>{pick(sheet.keysNote, lang)}</p>}
      </div>

      {sheet.education && (
        <>
          <p className="hs-sec" style={{ marginTop: 18 }}>{sheet.education.sec}</p>
          <p className="hs-line">{sheet.education.line}</p>
        </>
      )}
    </div>
  );
}

export default function Hero({ lang }: { lang: Lang }) {
  const reduce = useMedia(REDUCED_MOTION);
  const uid = useId();
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  // Position in CYCLE while the examples play by themselves; null once they rest or the visitor chose.
  const [step, setStep] = useState<number | null>(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false); // pointer over the stage, or focus inside it
  const [visible, setVisible] = useState(true);
  // Reduced motion hides the progress line in CSS, so nothing advances by itself (and the server
  // and browser render the same markup).
  const playing = step !== null;
  // The Arabic sheet's fonts load once the examples are under way, not for every visitor at once.
  const warmArabic = step === null || step > 0 || active !== 0;

  const show = (i: number) => {
    if (i === active) return;
    setPrev(active);
    setActive(i);
  };

  // The examples play only while the stage is on screen.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const advance = () => {
    if (step === null) return;
    const next = step + 1;
    if (next >= CYCLE.length - 1) { show(CYCLE[CYCLE.length - 1]); setStep(null); return; }
    setStep(next);
    show(CYCLE[next]);
  };

  const choose = (i: number) => {
    setStep(null);
    show(i);
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    const rtl = lang === "ar";
    const fwd = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let i: number | null = null;
    if (e.key === fwd) i = (active + 1) % SHEETS.length;
    else if (e.key === back) i = (active - 1 + SHEETS.length) % SHEETS.length;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = SHEETS.length - 1;
    if (i === null) return;
    e.preventDefault();
    choose(i);
    tabsRef.current?.querySelectorAll<HTMLElement>("[role=tab]")[i]?.focus();
  };

  // Leaving the hero: the stage drifts up a little and the stack behind the sheet opens.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [0, -64]);
  const fanA = useTransform(scrollYProgress, [0, 1], [-1.6, -4.2]);
  const fanB = useTransform(scrollYProgress, [0, 1], [1.2, 3.6]);

  const holding = paused || held || !visible;

  return (
    <section className="hero" aria-labelledby="hero-title" ref={heroRef}>
      <style href="zenith-hero" precedence="medium">{CSS}</style>
      <div className="z-wrap z-wrap-wide hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title" className="z-h1">
            <span className="hero-l1"><span>{t("h1a", lang)}</span></span>
            <span className="hero-l2"><span>{t("h1b", lang)}</span></span>
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
          <motion.div
            className="hx-stage"
            ref={stageRef}
            style={{ y: reduce ? 0 : drift }}
            onPointerEnter={() => setHeld(true)}
            onPointerLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false); }}
          >
            <div className="hx-deck">
              <motion.div className="hx-ghost hx-g1" aria-hidden="true" style={{ x: -10, y: 6, rotate: reduce ? -1.6 : fanA }} />
              <motion.div className="hx-ghost hx-g2" aria-hidden="true" style={{ x: 10, y: 3, rotate: reduce ? 1.2 : fanB }} />
              <span className="hx-crop" aria-hidden="true"><i /><i /><i /><i /></span>
              {SHEETS.map((s, i) => (
                <CvSheet
                  key={s.id}
                  sheet={s}
                  lang={lang}
                  state={i === active ? "on" : i === prev ? "out" : "off"}
                  labelledBy={`${uid}-tab-${i}`}
                  panelId={`${uid}-panel-${i}`}
                />
              ))}
            </div>

            <div className="hx-index">
              <div className="hx-tabs" role="tablist" aria-label={t("examples", lang)} ref={tabsRef} onKeyDown={onTabKey}>
                {SHEETS.map((s, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={s.id}
                      id={`${uid}-tab-${i}`}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls={`${uid}-panel-${i}`}
                      tabIndex={on ? 0 : -1}
                      className="hx-tab"
                      onClick={() => choose(i)}
                    >
                      <span className="hx-line" aria-hidden="true">
                        {on && playing && (
                          <span
                            key={`${i}-${step}`}
                            className="hx-fill"
                            data-held={holding || undefined}
                            style={{ animationDuration: `${s.dwell}ms` }}
                            onAnimationEnd={advance}
                          />
                        )}
                      </span>
                      <span className="hx-field">{pick(s.field, lang)}</span>
                      <span className="hx-role">{pick(s.role, lang)}</span>
                    </button>
                  );
                })}
              </div>
              {playing && (
                <button type="button" className="hx-pause" onClick={() => setPaused(p => !p)} aria-label={paused ? t("play", lang) : t("pause", lang)} aria-pressed={paused}>
                  {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                </button>
              )}
            </div>
          </motion.div>
          <figcaption className="z-micro hero-cap">{t("caption", lang)}</figcaption>
          {warmArabic && <span className="hx-fontwarm" aria-hidden="true"><span>ع</span><b>ع</b></span>}
        </figure>
      </div>
    </section>
  );
}

const CSS = `
.hero{position:relative;padding-block:clamp(48px,6vw,96px) clamp(72px,8vw,120px);overflow:hidden;isolation:isolate}
@media (min-width:981px) and (min-height:760px){.hero{min-height:calc(100svh - 68px);display:flex;align-items:center}.hero>.hero-grid{flex:1}}
.hero::after{content:"";position:absolute;inset:auto 0 0;height:1px;background:linear-gradient(90deg,transparent,var(--z-rule-strong) 20%,var(--z-rule-strong) 80%,transparent)}
.hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);gap:clamp(40px,5vw,80px);align-items:center}
@media (max-width:980px){.hero-grid{grid-template-columns:1fr}}

/* Headline: the two lines rise once, behind their own edge. */
.hero .z-h1{font-size:clamp(44px,4.95vw,76px);font-weight:340;line-height:1.02;letter-spacing:-.024em}
[dir="rtl"] .hero .z-h1{font-size:clamp(36px,4.8vw,64px);font-weight:500;line-height:1.3;letter-spacing:0}
.hero .z-h1>span{display:block;overflow:hidden;padding-bottom:.1em;margin-bottom:-.1em}
.hero .z-h1>span>span{display:block}
.hero-l2{color:var(--z-gold-text)}
@media (prefers-reduced-motion:no-preference){
  .hero .z-h1>span>span{animation:hx-rise 1s cubic-bezier(.22,1,.36,1) both}
  .hero .z-h1>.hero-l2>span{animation-delay:.12s}
}
@keyframes hx-rise{from{transform:translateY(108%)}to{transform:none}}
.hero-lede{margin-top:30px;max-width:52ch}
.hero-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:36px}
@media (max-width:560px){.hero-ctas .z-btn{flex:1 1 100%}}
.hero-facts{list-style:none;margin:44px 0 0;padding:0;border-top:1px solid var(--z-rule);display:grid;grid-template-columns:repeat(3,minmax(0,auto));justify-content:start}
.hero-facts li{padding:18px 26px 0 0;font-size:14px;line-height:1.5;color:var(--z-fg-2);max-width:22ch}
.hero-facts li+li{padding-inline-start:26px;border-inline-start:1px solid var(--z-rule)}
@media (max-width:640px){
  .hero-facts{grid-template-columns:1fr}
  .hero-facts li{padding:14px 0;max-width:none;border-bottom:1px solid var(--z-rule)}
  .hero-facts li+li{padding-inline-start:0;border-inline-start:0}
}

/* Stage: the sheet lit like an object, with print crop marks. */
.hero-figure{margin:0;position:relative}
.hx-stage{position:relative;max-width:640px;margin-inline:auto;padding-top:22px}
.hx-stage::before{content:"";position:absolute;z-index:-1;inset:-30% -24% 0;background:radial-gradient(ellipse 46% 52% at 50% 34%,rgba(226,201,142,.17),rgba(226,201,142,.05) 52%,transparent 74%);pointer-events:none}
html[data-theme="light"] .hx-stage::before{background:radial-gradient(ellipse 46% 52% at 50% 34%,rgba(200,169,110,.22),transparent 72%)}
.hx-deck{position:relative;display:grid;max-width:520px;margin-inline:auto}
.hx-deck>*{grid-area:1/1}
.hx-deck::after{content:"";position:absolute;z-index:-1;inset:auto 7% -26px;height:42px;background:radial-gradient(closest-side,rgba(0,0,0,.6),transparent);filter:blur(8px)}
html[data-theme="light"] .hx-deck::after{background:radial-gradient(closest-side,rgba(60,40,20,.22),transparent)}
.hx-ghost{border-radius:6px;background:var(--z-surface-2);border:1px solid var(--z-rule);transform-origin:50% 80%}
.hx-g2{opacity:.75}
.hx-crop{position:relative;z-index:3;pointer-events:none}
.hx-crop i{position:absolute;width:22px;height:22px}
.hx-crop i::before,.hx-crop i::after{content:"";position:absolute;background:var(--z-gold);opacity:.6}
.hx-crop i::before{width:16px;height:1px}
.hx-crop i::after{width:1px;height:16px}
.hx-crop i:nth-child(1){top:-22px;left:-22px}.hx-crop i:nth-child(1)::before{bottom:0;left:0}.hx-crop i:nth-child(1)::after{top:0;right:0}
.hx-crop i:nth-child(2){top:-22px;right:-22px}.hx-crop i:nth-child(2)::before{bottom:0;right:0}.hx-crop i:nth-child(2)::after{top:0;left:0}
.hx-crop i:nth-child(3){bottom:-22px;left:-22px}.hx-crop i:nth-child(3)::before{top:0;left:0}.hx-crop i:nth-child(3)::after{bottom:0;right:0}
.hx-crop i:nth-child(4){bottom:-22px;right:-22px}.hx-crop i:nth-child(4)::before{top:0;right:0}.hx-crop i:nth-child(4)::after{bottom:0;left:0}
@media (max-width:560px){.hx-crop{display:none}}

/* The sheet (the original example's styles). */
.hero-sheet{position:relative;z-index:2;background:var(--z-sheet);color:#231a14;border-radius:6px;padding:34px 34px 30px;box-shadow:var(--z-shadow),0 0 0 1px rgba(0,0,0,.04);font-family:var(--font-sans),Arial,sans-serif;font-size:14px;line-height:1.5;width:100%}
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
.hs-old del,.hs-new ins{text-decoration:none;color:inherit;background:none}
.hs-old del>span:last-child{background:linear-gradient(#b0413e,#b0413e) no-repeat 0 58%/100% 1.5px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.hs-new{margin-top:3px;font-size:14px;font-weight:500;color:#231a14}
.hs-note{margin-top:7px;font-size:12.5px;line-height:1.45;color:#7d5f22;font-style:normal;display:flex;gap:6px}
.hs-note::before{content:"";flex:none;width:14px;height:1px;margin-top:.75em;background:#c8a96e}
[lang="ar"].hs-note{font-family:var(--font-arabic),Tahoma,sans-serif;font-size:13.5px}
.hs-job-2{margin-top:16px}
.hs-line{font-size:13px;color:#3d3129;padding-inline-start:16px}
.hs-keys{display:flex;flex-wrap:wrap;gap:6px}
.hs-keys mark{background:rgba(200,169,110,.22);color:#231a14;padding:1px 8px;border-radius:3px;font-size:12.5px}
.hero-cap{margin-top:30px;text-align:center}

/* The Arabic sheet: Arabic type, no letter-spacing, mirrored. */
.hero-sheet[lang="ar"]{font-family:var(--font-arabic),Tahoma,sans-serif;line-height:1.75}
.hero-sheet[lang="ar"] .hs-name{font-family:var(--font-arabic-serif),var(--font-arabic),serif;font-size:29px;line-height:1.35;letter-spacing:0}
.hero-sheet[lang="ar"] .hs-sec{letter-spacing:0;text-transform:none;font-size:12.5px}
.hero-sheet[lang="ar"] .hs-old{font-size:13.5px}
.hero-sheet[lang="ar"] .hs-new{font-size:14.5px}
.hero-sheet[lang="ar"] .hs-org,.hero-sheet[lang="ar"] .hs-job span{font-size:13px}
.hero-sheet[lang="ar"] .hs-keys mark{font-size:13px}
.hero-sheet .hs-note[lang="en"],.hero-sheet .hs-note[lang="fr"]{font-family:var(--font-sans),Arial,sans-serif}

@media (min-width:1180px){
  .hx-deck{max-width:640px}
  .hero-sheet{padding-right:200px}
  .hero-sheet[dir="rtl"]{padding-right:34px;padding-left:200px}
  .hs-edit{position:static}
  .hs-note{position:absolute;right:22px;width:160px;margin:0;transform:translateY(-100%);padding-top:8px;border-top:1px solid #c8a96e}
  .hero-sheet[dir="rtl"] .hs-note{right:auto;left:22px}
  .hs-note::before{display:none}
}

/* Switching sheets: the one leaving slides back into the stack, the next comes forward. */
.hx-sheet[data-state="off"]{visibility:hidden;opacity:0}
.hx-sheet[data-state="out"]{visibility:hidden;opacity:0;z-index:1}
@media (prefers-reduced-motion:no-preference){
  .hx-sheet[data-state="on"]{animation:hs-in .7s cubic-bezier(.22,1,.36,1) both}
  .hx-sheet[data-state="out"]{animation:hx-out .45s cubic-bezier(.55,0,.75,.2) both}
}
@keyframes hs-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes hx-out{from{visibility:visible;opacity:1;transform:none}to{visibility:hidden;opacity:0;transform:translate(-18px,10px) rotate(-1.4deg)}}

/* The one orchestrated moment: strike, rewrite, annotate. */
@media (prefers-reduced-motion:no-preference){
  .hs-play .hs-old del>span:last-child{animation:hs-strike .45s ease-out both;animation-delay:var(--d)}
  .hs-play .hs-new{animation:hs-write .7s cubic-bezier(.65,0,.35,1) both;animation-delay:calc(var(--d) + .4s)}
  .hs-play[dir="rtl"] .hs-new{animation-name:hs-write-rtl}
  .hs-play .hs-note{animation:hs-fade .5s ease-out both;animation-delay:calc(var(--d) + 1s)}
  .hs-play .hs-keys mark{animation:hs-mark .5s ease-out both;animation-delay:calc(var(--d) + var(--i) * .15s)}
  .hs-play .hs-ekeys .hs-note{animation-delay:calc(var(--d) + .6s)}
}
@keyframes hs-strike{from{background-size:0% 1.5px}to{background-size:100% 1.5px}}
[dir="rtl"] .hs-old del>span:last-child{background-position:100% 58%}
@keyframes hs-write{from{clip-path:inset(0 100% 0 0);opacity:.2}to{clip-path:inset(0 0 0 0);opacity:1}}
@keyframes hs-write-rtl{from{clip-path:inset(0 0 0 100%);opacity:.2}to{clip-path:inset(0 0 0 0);opacity:1}}
@keyframes hs-fade{from{opacity:0}to{opacity:1}}
@keyframes hs-mark{from{background-color:transparent}to{background-color:rgba(200,169,110,.22)}}

/* The switcher: three profiles, a hairline that fills while one plays, and a pause. */
.hx-index{display:flex;align-items:flex-start;gap:14px;margin-top:40px}
.hx-tabs{flex:1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.hx-tab{position:relative;display:flex;flex-direction:column;gap:2px;padding:14px 0 4px;border:0;background:none;color:var(--z-fg-3);text-align:start;cursor:pointer;font:inherit;min-height:44px}
.hx-line{position:absolute;inset:0 0 auto;height:1px;background:var(--z-rule-strong);overflow:hidden}
.hx-tab[aria-selected="true"] .hx-line{background:var(--z-gold)}
.hx-tab[aria-selected="true"] .hx-line:has(.hx-fill){background:var(--z-rule-strong)}
.hx-fill{position:absolute;inset:0;background:var(--z-gold);transform-origin:0 50%;animation:hx-fill linear both}
[dir="rtl"] .hx-fill{transform-origin:100% 50%}
.hx-fill[data-held]{animation-play-state:paused}
@keyframes hx-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.hx-field{font-size:13px;line-height:1.4;transition:color .2s}
.hx-role{font-size:14px;line-height:1.4;color:var(--z-fg-2);transition:color .2s}
.hx-tab[aria-selected="true"] .hx-field{color:var(--z-gold-text)}
.hx-tab[aria-selected="true"] .hx-role{color:var(--z-fg)}
.hx-tab:hover .hx-role{color:var(--z-fg)}
.hx-tab:focus-visible{outline:2px solid var(--z-focus);outline-offset:4px;border-radius:2px}
.hx-pause{flex:none;display:grid;place-items:center;width:36px;height:36px;margin-top:10px;border-radius:50%;border:1px solid var(--z-rule-strong);background:transparent;color:var(--z-fg-2);cursor:pointer;transition:border-color .2s,color .2s}
.hx-pause:hover{border-color:var(--z-gold);color:var(--z-gold-text)}
@media (max-width:560px){
  .hx-tabs{gap:10px}
  .hx-role{display:none}
  .hx-field{font-size:13.5px}
}
.hx-fontwarm{position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none}
.hx-fontwarm span{font-family:var(--font-arabic),Tahoma,sans-serif}
.hx-fontwarm b{font-family:var(--font-arabic-serif),serif}
@media (prefers-reduced-motion:reduce){.hero-sheet{animation:none}.hx-fill,.hx-pause{display:none}}
`;
