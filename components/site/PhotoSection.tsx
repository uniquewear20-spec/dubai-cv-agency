"use client";
// components/site/PhotoSection.tsx — LinkedIn profile photo enhancement (included in every package).
//
// A portrait slider: one large example portrait with its note, arrows, a counter and a strip of every
// portrait to pick from, so all of them can be seen without the page being held or scrolled sideways. About 80% of the section is the gallery; the rest shows the
// open portrait where it is used (a round profile picture and a CV header). The row opens one
// portrait after another until the visitor takes over; with reduced motion it stays still.
//
// The portraits were made with third-party AI image tools as examples; they are not clients, and
// the section says so. No before-and-after pairs are shown because none exist with permission.

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { pick, type L10n, type Lang } from "@/lib/site";

const T: Record<string, L10n> = {
  h2: { en: "A profile photo that matches the CV.", fr: "Une photo de profil à la hauteur de votre CV.", ar: "صورة شخصية بمستوى سيرتك الذاتية." },
  body: {
    en: "LinkedIn profile photo enhancement is included in every package. Send us a recent photo of yourself and we return it enhanced for LinkedIn and your CV.",
    fr: "L'amélioration de la photo de profil LinkedIn est incluse dans chaque formule. Envoyez-nous une photo récente de vous : nous vous la renvoyons améliorée pour LinkedIn et votre CV.",
    ar: "تحسين صورة لينكدإن مشمول في كل باقة. أرسل لنا صورة حديثة لك، ونعيدها إليك محسّنة لملف لينكدإن وسيرتك الذاتية.",
  },
  what: { en: "What we improve", fr: "Ce que nous améliorons", ar: "ما نحسّنه" },
  examples: {
    en: "The portraits here are examples made with third-party AI image tools, to show the finish we aim for. They are not photos of our clients.",
    fr: "Les portraits présentés sont des exemples réalisés avec des outils d'IA tiers, pour montrer le rendu visé. Ce ne sont pas des photos de nos clients.",
    ar: "الصور المعروضة أمثلة أُنشئت بأدوات ذكاء اصطناعي من جهات أخرى لتوضيح المستوى الذي نسعى إليه، وليست صوراً لعملائنا.",
  },
  honest: {
    en: "Your enhanced photo is an edited image of you, not a studio shoot. It helps you look professional; it can't guarantee interviews.",
    fr: "Votre photo améliorée est une image retouchée de vous, pas une séance en studio. Elle vous aide à paraître professionnel ; elle ne garantit pas d'entretiens.",
    ar: "صورتك المحسّنة صورة معدّلة لك وليست جلسة تصوير في استوديو. تساعدك على الظهور بمظهر احترافي، لكنها لا تضمن الحصول على مقابلات.",
  },
  reel: { en: "Example portraits", fr: "Exemples de portraits", ar: "أمثلة على الصور" },
  swipe: { en: "Swipe to see more.", fr: "Faites glisser pour en voir plus.", ar: "مرّر لرؤية المزيد." },
  usedH: { en: "Ready where it's used", fr: "Prête là où elle sert", ar: "جاهزة حيث تُستخدم" },
  usedBody: {
    en: "Framed head and shoulders, the same photo works as a round profile picture and in a CV header.",
    fr: "Cadrée tête et épaules, la même photo fonctionne en photo de profil ronde et en en-tête de CV.",
    ar: "بتأطير الرأس والكتفين، تصلح الصورة نفسها صورةً دائرية للملف الشخصي وفي ترويسة السيرة الذاتية.",
  },
  round: { en: "Round profile picture", fr: "Photo de profil ronde", ar: "صورة دائرية للملف الشخصي" },
  prevP: { en: "Previous portrait", fr: "Portrait précédent", ar: "الصورة السابقة" },
  nextP: { en: "Next portrait", fr: "Portrait suivant", ar: "الصورة التالية" },
  header: { en: "CV header", fr: "En-tête de CV", ar: "ترويسة السيرة الذاتية" },
};
const t = (k: string, l: Lang) => pick(T[k], l);

const ASPECTS: { term: L10n; desc: L10n }[] = [
  { term: { en: "Light", fr: "Lumière", ar: "الإضاءة" }, desc: { en: "Even, flattering light on your face.", fr: "Une lumière douce et homogène sur le visage.", ar: "إضاءة ناعمة ومتوازنة على الوجه." } },
  { term: { en: "Background", fr: "Arrière-plan", ar: "الخلفية" }, desc: { en: "Clean and neutral, so you stand out.", fr: "Net et neutre, pour que vous ressortiez.", ar: "نظيفة ومحايدة لتبرزك أنت." } },
  { term: { en: "Framing", fr: "Cadrage", ar: "التأطير" }, desc: { en: "Head and shoulders, centred for a round crop and a CV header.", fr: "Tête et épaules, centré pour un recadrage rond et un en-tête de CV.", ar: "الرأس والكتفان في المنتصف، بما يناسب القص الدائري وترويسة السيرة." } },
  { term: { en: "Clothing", fr: "Tenue", ar: "المظهر" }, desc: { en: "Neat and professional.", fr: "Soignée et professionnelle.", ar: "ملابس مرتبة واحترافية." } },
  { term: { en: "Still you", fr: "Toujours vous", ar: "تبقى أنت" }, desc: { en: "Your face, features and skin tone stay yours.", fr: "Votre visage, vos traits et votre teint restent les vôtres.", ar: "ملامح وجهك ولون بشرتك تبقى كما هي." } },
];

interface Portrait { id: string; big: number; note?: L10n; alt: L10n }
// Example portraits made with AI image tools (public/team originals, cropped to 3:4 in public/photos).
const PORTRAITS: Portrait[] = [
  {
    id: "08", big: 729,
    note: { en: "Soft, even light and a calm, neutral backdrop.", fr: "Lumière douce et homogène, fond neutre et calme.", ar: "إضاءة ناعمة ومتوازنة وخلفية هادئة محايدة." },
    alt: { en: "Example portrait: a woman in a brown hijab and white jacket, beige backdrop", fr: "Exemple de portrait : une femme en hijab marron et veste blanche, fond beige", ar: "صورة توضيحية: امرأة بحجاب بني وسترة بيضاء على خلفية بيج" },
  },
  {
    id: "03", big: 1000,
    note: { en: "Light that shapes the face without harsh shadows.", fr: "Une lumière qui modèle le visage sans ombres dures.", ar: "إضاءة تُبرز ملامح الوجه دون ظلال قاسية." },
    alt: { en: "Example portrait: a man with a grey beard in a navy jacket, dark blue backdrop", fr: "Exemple de portrait : un homme à la barbe grise en veste marine, fond bleu nuit", ar: "صورة توضيحية: رجل بلحية رمادية وسترة كحلية على خلفية زرقاء داكنة" },
  },
  {
    id: "11", big: 1000,
    note: { en: "National dress, crisp and bright.", fr: "Tenue nationale, nette et lumineuse.", ar: "زي وطني أنيق وناصع." },
    alt: { en: "Example portrait: a man in a white kandura and ghutra, tan backdrop", fr: "Exemple de portrait : un homme en kandura blanche et ghutra, fond camel", ar: "صورة توضيحية: رجل بكندورة بيضاء وغترة على خلفية بنية فاتحة" },
  },
  {
    id: "15", big: 1000,
    note: { en: "A natural smile: approachable and professional.", fr: "Un sourire naturel : accessible et professionnel.", ar: "ابتسامة طبيعية تجمع بين الود والاحترافية." },
    alt: { en: "Example portrait: a smiling woman in a patterned blouse, grey backdrop", fr: "Exemple de portrait : une femme souriante en chemisier imprimé, fond gris", ar: "صورة توضيحية: امرأة مبتسمة ببلوزة منقوشة على خلفية رمادية" },
  },
  {
    id: "10", big: 867,
    note: { en: "A rim of light separates a dark suit from a dark backdrop.", fr: "Un liseré de lumière détache le costume sombre du fond.", ar: "خط من الضوء يفصل البدلة الداكنة عن الخلفية." },
    alt: { en: "Example portrait: a man with grey hair in a dark suit and tie, dark grey backdrop", fr: "Exemple de portrait : un homme aux cheveux gris en costume sombre et cravate, fond gris foncé", ar: "صورة توضيحية: رجل بشعر رمادي وبدلة داكنة وربطة عنق على خلفية رمادية داكنة" },
  },
  {
    id: "13", big: 1000,
    note: { en: "Backdrop and jacket in one considered colour.", fr: "Fond et veste dans une même couleur choisie.", ar: "الخلفية والسترة بلون واحد مدروس." },
    alt: { en: "Example portrait: a woman in a burgundy blazer, burgundy backdrop", fr: "Exemple de portrait : une femme en blazer bordeaux, fond bordeaux", ar: "صورة توضيحية: امرأة بسترة عنابية على خلفية عنابية" },
  },
  {
    id: "17", big: 1000,
    note: { en: "A light, clean background, as many CVs expect.", fr: "Un fond clair et net, comme l'attendent de nombreux CV.", ar: "خلفية فاتحة ونظيفة كما تتطلب كثير من السير الذاتية." },
    alt: { en: "Example portrait: a man with glasses in a white shirt, light grey backdrop", fr: "Exemple de portrait : un homme à lunettes en chemise blanche, fond gris clair", ar: "صورة توضيحية: رجل بنظارة وقميص أبيض على خلفية رمادية فاتحة" },
  },
];

const EXAMPLE_NOTE: L10n = { en: "Framed head and shoulders, ready for a round crop.", fr: "Cadrage tête et épaules, prêt pour un recadrage rond.", ar: "تأطير للرأس والكتفين جاهز للقص الدائري." };
const EXAMPLE_ALT: L10n = { en: "Example portrait made with AI image tools", fr: "Exemple de portrait réalisé avec des outils d'IA", ar: "صورة توضيحية أُنشئت بأدوات الذكاء الاصطناعي" };
// The rest of the example portraits, between the ones with notes.
PORTRAITS.splice(2, 0, ...[
  { id: "01", big: 800, alt: EXAMPLE_ALT },
  { id: "02", big: 800, alt: EXAMPLE_ALT },
  { id: "05", big: 800, alt: EXAMPLE_ALT },
  { id: "06", big: 800, alt: EXAMPLE_ALT },
  { id: "07", big: 800, alt: EXAMPLE_ALT },
  { id: "09", big: 800, alt: EXAMPLE_ALT },
  { id: "12", big: 800, alt: EXAMPLE_ALT },
  { id: "16", big: 800, alt: EXAMPLE_ALT },
  { id: "18", big: 800, alt: EXAMPLE_ALT },
  { id: "19", big: 800, alt: EXAMPLE_ALT },
  { id: "20", big: 800, alt: EXAMPLE_ALT }
]);

const PAD = (n: number) => String(n).padStart(2, "0");

export default function PhotoSection({ lang }: { lang: Lang }) {
  const [i, setI] = useState(0);
  const auto = useRef(true);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const isAr = lang === "ar";
  const n = PORTRAITS.length;
  const cur = PORTRAITS[i];

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Move on by itself until the visitor takes over (not with reduced motion).
  useEffect(() => {
    if (!inView || !auto.current) return;
    let reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { /* ignore */ }
    if (reduce) return;
    const id = window.setInterval(() => { if (auto.current) setI(x => (x + 1) % n); }, 3400);
    return () => window.clearInterval(id);
  }, [inView, n]);

  // Keep the chosen thumbnail in view in the strip.
  useEffect(() => {
    const r = thumbs.current, el = r?.children[i] as HTMLElement | undefined;
    if (!r || !el || r.scrollWidth <= r.clientWidth + 2) return;
    r.scrollTo({ left: el.offsetLeft - r.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [i]);

  const go = (d: number) => { auto.current = false; setI(x => (x + d + n) % n); };
  const choose = (k: number) => { auto.current = false; setI(k); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    go((e.key === "ArrowRight") !== isAr ? 1 : -1);
  };
  const next = PORTRAITS[(i + 1) % n];

  return (
    <section className="z-section ph" aria-labelledby="ph-title" ref={root}>
      <style href="zenith-photo-gallery" precedence="medium">{CSS}</style>
      <div className="z-wrap z-wrap-wide">
        <div className="ph-top">
          <div>
            <h2 id="ph-title" className="z-h2">{t("h2", lang)}</h2>
            <p className="z-lede" style={{ marginTop: 16 }}>{t("body", lang)}</p>
          </div>
          <dl className="ph-aspects" aria-label={t("what", lang)}>
            {ASPECTS.map(a => (
              <div key={a.term.en}><dt className="z-serif">{pick(a.term, lang)}</dt><dd>{pick(a.desc, lang)}</dd></div>
            ))}
          </dl>
        </div>

        <div className="ph-split">
          <div className="ph-stage" role="group" aria-roledescription="carousel" aria-label={t("reel", lang)} onKeyDown={onKey}>
            <div className="ph-meta">
              <span className="ph-count" aria-live="polite">{PAD(i + 1)} / {PAD(n)}</span>
              <span className="ph-vert" aria-hidden="true">{t("reel", lang)}</span>
            </div>

            <div className="ph-main">
              <div className="ph-frame">
                { }
                <img key={cur.id} className="ph-big" src={`/photos/portrait-${cur.id}-1000.webp`} alt={pick(cur.alt, lang)} width={750} height={1000} decoding="async" />
              </div>
              {/* the next portrait is fetched ahead so the change is instant */}
              { }
              <img src={`/photos/portrait-${next.id}-1000.webp`} alt="" width={1} height={1} style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} aria-hidden="true" />
            </div>

            <div className="ph-side">
              <p className="ph-quote z-serif" key={cur.id}>{cur.note ? pick(cur.note, lang) : pick(EXAMPLE_NOTE, lang)}</p>
              <div className="ph-arrows">
                <button type="button" className="ph-arrow" onClick={() => go(-1)} aria-label={t("prevP", lang)}>{isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}</button>
                <button type="button" className="ph-arrow ph-arrow-solid" onClick={() => go(1)} aria-label={t("nextP", lang)}>{isAr ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}</button>
              </div>
            </div>

            <div className="ph-thumbs" ref={thumbs}>
              {PORTRAITS.map((p, k) => (
                <button key={p.id} type="button" className="ph-thumb" data-on={k === i || undefined} aria-pressed={k === i} aria-label={`${t("reel", lang)} ${k + 1} / ${n}`} onClick={() => choose(k)}>
                  { }
                  <img src={`/photos/portrait-${p.id}-640.webp`} alt="" width={96} height={128} loading={k < 8 ? "eager" : "lazy"} decoding="async" draggable={false} />
                </button>
              ))}
            </div>
          </div>

          <aside className="ph-used" aria-labelledby="ph-used-h">
            <h3 id="ph-used-h" className="ph-used-h z-serif">{t("usedH", lang)}</h3>
            <p className="z-small">{t("usedBody", lang)}</p>
            <div className="ph-used-row">
              <figure className="ph-fig">
                <span className="ph-round-l"><img src={`/photos/portrait-${cur.id}-640.webp`} alt="" width={160} height={213} decoding="async" /></span>
                <span className="ph-round-s" aria-hidden="true"><img src={`/photos/portrait-${cur.id}-640.webp`} alt="" width={44} height={59} decoding="async" /></span>
                <figcaption className="z-micro">{t("round", lang)}</figcaption>
              </figure>
              <figure className="ph-fig">
                <div className="ph-cvhead-sheet" aria-hidden="true">
                  <img src={`/photos/portrait-${cur.id}-640.webp`} alt="" width={64} height={85} decoding="async" />
                  <span className="ph-bars"><i /><i /><i /></span>
                </div>
                <figcaption className="z-micro">{t("header", lang)}</figcaption>
              </figure>
            </div>
          </aside>
        </div>

        <div className="ph-notes">
          <p className="z-micro">{t("examples", lang)}</p>
          <p className="z-micro">{t("honest", lang)}</p>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.ph-top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.9fr);gap:clamp(24px,4vw,64px);align-items:end;margin-bottom:34px}
.ph-top .z-lede{max-width:56ch}
.ph-aspects{margin:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px}
.ph-aspects div{padding:11px 0;border-top:1px solid var(--z-rule)}
.ph-aspects dt{font-size:17px;margin-bottom:2px}
.ph-aspects dd{margin:0;font-size:14px;line-height:1.5;color:var(--z-fg-2)}
@media (max-width:900px){.ph-top{grid-template-columns:1fr;align-items:start}}
@media (max-width:560px){.ph-aspects{grid-template-columns:1fr}}
.ph-split{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,1fr);gap:clamp(16px,2vw,28px);align-items:stretch}
@media (max-width:1100px){.ph-split{grid-template-columns:1fr}}
.ph-stage{display:grid;grid-template-columns:76px minmax(0,auto) minmax(0,1fr);grid-template-areas:"meta main side" "thumbs thumbs thumbs";column-gap:clamp(18px,3vw,44px);row-gap:22px;padding:clamp(18px,2.4vw,30px);border:1px solid var(--z-rule);border-radius:20px;background:var(--z-surface);min-width:0}
.ph-meta{grid-area:meta;display:flex;flex-direction:column;gap:18px;align-items:flex-start}
.ph-count{font-size:14px;font-variant-numeric:tabular-nums;letter-spacing:.06em;color:var(--z-fg-2);white-space:nowrap}
.ph-vert{writing-mode:vertical-rl;transform:rotate(180deg);font-size:13px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--z-gold-text)}
.ph-main{grid-area:main;position:relative}
.ph-frame{position:relative;height:clamp(340px,34vw,470px);aspect-ratio:3/4;border-radius:14px;overflow:hidden;background:var(--z-surface-2);box-shadow:0 30px 60px -36px rgba(0,0,0,.85)}
.ph-big{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 16%;animation:phFade .7s cubic-bezier(.25,1,.5,1) both}
@keyframes phFade{from{opacity:0;transform:scale(1.05)}to{opacity:1;transform:none}}
.ph-side{grid-area:side;display:flex;flex-direction:column;justify-content:space-between;gap:20px;min-width:0}
.ph-quote{margin:clamp(0px,3vw,36px) 0 0;font-size:clamp(20px,2.2vw,30px);line-height:1.3;font-weight:400;letter-spacing:-.01em;color:var(--z-fg);animation:phFade .6s .1s both;max-width:22ch}
.ph-arrows{display:flex;gap:12px}
.ph-arrow{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;border:1px solid var(--z-rule-strong);background:transparent;color:var(--z-fg);cursor:pointer;transition:border-color .2s,background .2s,color .2s}
.ph-arrow:hover{border-color:var(--z-gold);color:var(--z-gold-text)}
.ph-arrow-solid{background:var(--z-fg);color:var(--z-bg,#0a0907);border-color:var(--z-fg)}
.ph-arrow-solid:hover{background:var(--z-gold);border-color:var(--z-gold);color:#14110c}
.ph-arrow:focus-visible,.ph-thumb:focus-visible{outline:2px solid var(--z-focus);outline-offset:3px}
.ph-thumbs{grid-area:thumbs;display:flex;gap:8px;overflow-x:auto;padding:4px 2px 6px;scrollbar-width:none}
.ph-thumbs::-webkit-scrollbar{display:none}
.ph-thumb{flex:1 1 0;min-width:34px;max-width:60px;aspect-ratio:3/4;padding:0;border:0;border-radius:8px;overflow:hidden;background:var(--z-surface-2);cursor:pointer;opacity:.5;transition:opacity .3s,transform .3s,box-shadow .3s}
.ph-thumb:hover{opacity:.85}
.ph-thumb[data-on]{opacity:1;transform:translateY(-3px);box-shadow:0 0 0 2px var(--z-gold)}
.ph-thumb img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 16%}
@media (max-width:760px){
  .ph-stage{grid-template-columns:minmax(0,1fr);grid-template-areas:"main" "side" "thumbs" "meta";justify-items:stretch}
  .ph-meta{flex-direction:row;align-items:center}
  .ph-vert{writing-mode:horizontal-tb;transform:none}
  .ph-frame{height:auto;width:100%;max-width:340px;margin:0 auto}
  .ph-quote{max-width:none;margin:0}
  .ph-side{flex-direction:row;align-items:center;justify-content:space-between}
}
.ph-used{display:flex;flex-direction:column;gap:14px;padding:22px 20px;border:1px solid var(--z-rule);border-radius:16px;background:var(--z-surface)}
.ph-used-h{font-size:22px;font-weight:500;line-height:1.15}
.ph-used-row{display:flex;flex-direction:column;gap:20px;margin-top:6px}
.ph-fig{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;margin:0}
.ph-fig figcaption{flex-basis:100%;color:var(--z-fg-3)}
.ph-round-l img{display:block;width:96px;height:96px;object-fit:cover;object-position:50% 14%;border-radius:50%;box-shadow:0 0 0 3px var(--z-surface),0 0 0 4px var(--z-rule-strong)}
.ph-round-s img{display:block;width:38px;height:38px;object-fit:cover;object-position:50% 14%;border-radius:50%}
.ph-cvhead-sheet{display:flex;gap:10px;align-items:flex-start;width:100%;max-width:210px;padding:12px;border-radius:6px;background:var(--z-sheet);box-shadow:0 14px 30px -20px rgba(0,0,0,.6)}
.ph-cvhead-sheet img{display:block;width:54px;height:72px;object-fit:cover;object-position:50% 14%;border-radius:2px}
.ph-bars{display:grid;gap:6px;flex:1;padding-top:6px}
.ph-bars i{display:block;height:7px;border-radius:2px;background:#d9cfc2}
.ph-bars i:first-child{height:11px;width:86%;background:#3b2d22}
.ph-bars i:nth-child(2){width:62%;background:#b08a57}
@media (max-width:1100px){.ph-used-row{flex-direction:row;flex-wrap:wrap;gap:28px}}
.ph-notes{display:grid;gap:6px;margin-top:22px;max-width:78ch}
.ph-notes .z-micro{color:var(--z-fg-3)}
@media (prefers-reduced-motion:reduce){.ph-big,.ph-quote{animation:none}.ph-thumb{transition:none}}
`;
