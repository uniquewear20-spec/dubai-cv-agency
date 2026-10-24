"use client";
// components/site/PhotoSection.tsx — LinkedIn profile photo enhancement (included in every package).
//
// A reel of example portraits that moves with the page, in the manner of the Awa Ndiaye portfolio:
// on wide screens the reel is held on screen while scrolling down carries it sideways; each
// portrait opens like an aperture as it arrives, settles from a slight zoom with a little parallax,
// and its note rises beside it. On phones the reel is swiped, with the same settle, and opens as
// the section comes into view. With reduced motion it is a plain strip that scrolls sideways.
//
// The portraits were made with third-party AI image tools as examples; they are not clients, and
// the section says so. No before-and-after pairs are shown because none exist with permission.

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import { pick, type L10n, type Lang } from "@/lib/site";
import { REDUCED_MOTION, useMedia } from "./useMedia";

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

interface Portrait { id: string; big: number; note: L10n; alt: L10n }
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
    id: "14", big: 1000,
    note: { en: "A warm backdrop that flatters without distracting.", fr: "Un fond chaleureux qui valorise sans distraire.", ar: "خلفية دافئة تُجمّل الصورة دون أن تشتت الانتباه." },
    alt: { en: "Example portrait: a woman with long dark hair in a white shirt, tan backdrop", fr: "Exemple de portrait : une femme aux longs cheveux bruns en chemise blanche, fond camel", ar: "صورة توضيحية: امرأة بشعر داكن طويل وقميص أبيض على خلفية بنية فاتحة" },
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

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * One portrait. `shift` is how far the reel has travelled (px, screen direction); the card works
 * out where it is relative to the middle of the view and opens, settles and fades accordingly.
 * `enter` (0 → 1) opens the cards as the section comes into view on phones.
 */
function ReelCard({ p, lang, shift, view, dir, enter, still, version }: {
  p: Portrait; lang: Lang; shift: MotionValue<number>; view: React.RefObject<HTMLElement | null>; dir: 1 | -1;
  enter: MotionValue<number>; still: boolean; version: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const c0 = useMotionValue(0); // the card's centre on screen when the reel has not moved
  const vc = useMotionValue(0); // the view's centre
  const vw = useMotionValue(1); // the view's width

  useEffect(() => {
    const measure = () => {
      const el = ref.current, v = view.current;
      if (!el || !v) return;
      const r = el.getBoundingClientRect(), vr = v.getBoundingClientRect();
      c0.set(r.left + r.width / 2 - shift.get());
      vc.set(vr.left + vr.width / 2);
      vw.set(Math.max(1, vr.width));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [c0, vc, vw, shift, view, version]);

  // n: −0.5 … 0 … +0.5 from the left edge to the middle to the right edge. e > 0: still to come.
  const e = useTransform([shift, c0, vc, vw, enter], ([s, c, m, w, en]: number[]) => {
    const n = (c + s - m) / w;
    const ahead = dir * n;
    // Before the section is in view (phones), every card waits as if it were still to come.
    return Math.max(ahead, (1 - en) * 0.6);
  });
  const scale = useTransform(e, v => 1 + 0.12 * clamp01(Math.abs(v) / 0.6));
  const imgX = useTransform([shift, c0, vc, vw], ([s, c, m, w]: number[]) => `${(-(c + s - m) / w) * 8}%`);
  const clip = useTransform(e, v => `inset(${(10 * clamp01((v - 0.12) / 0.38)).toFixed(2)}% 0 round 12px)`);
  const fade = useTransform(e, v => (v < -0.3 ? 1 - 0.6 * clamp01((-v - 0.3) / 0.3) : 1));
  const noteO = useTransform(e, v => 1 - clamp01((v - 0.06) / 0.24));
  const noteY = useTransform(e, v => 18 * clamp01((v - 0.06) / 0.24));

  const src = `/photos/portrait-${p.id}`;
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${src}-640.webp`}
      srcSet={`${src}-640.webp 640w, ${src}-1000.webp ${p.big}w`}
      sizes="(max-width: 899px) 74vw, 50vh"
      alt={pick(p.alt, lang)}
      width={640}
      height={853}
      loading="lazy"
      decoding="async"
    />
  );
  if (still) {
    return (
      <li className="ph-card" ref={ref}>
        <figure>
          <div className="ph-frame">{img}</div>
          <figcaption className="ph-cap" dir="auto">{pick(p.note, lang)}</figcaption>
        </figure>
      </li>
    );
  }
  return (
    <motion.li className="ph-card" ref={ref} style={{ opacity: fade }}>
      <figure>
        <motion.div className="ph-frame" style={{ clipPath: clip }}>
          <motion.div className="ph-img" style={{ scale, x: imgX }}>{img}</motion.div>
        </motion.div>
        <motion.figcaption className="ph-cap" dir="auto" style={{ opacity: noteO, y: noteY }}>{pick(p.note, lang)}</motion.figcaption>
      </figure>
    </motion.li>
  );
}

function Intro({ lang, id }: { lang: Lang; id: string }) {
  return (
    <div className="ph-intro-in">
      <h2 id={id} className="z-h2">{t("h2", lang)}</h2>
      <p className="z-lede ph-body">{t("body", lang)}</p>
      <h3 className="ph-what">{t("what", lang)}</h3>
      <dl className="ph-aspects">
        {ASPECTS.map(a => (
          <div key={a.term.en}>
            <dt>{pick(a.term, lang)}</dt>
            <dd>{pick(a.desc, lang)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function InUse({ lang }: { lang: Lang }) {
  return (
    <div className="ph-used">
      <h3 className="ph-used-h z-serif">{t("usedH", lang)}</h3>
      <p className="z-small">{t("usedBody", lang)}</p>
      <div className="ph-used-demo">
        <figure className="ph-round">
          <span className="ph-round-l">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/portrait-08-face.webp" alt="" width={160} height={160} loading="lazy" decoding="async" />
          </span>
          <span className="ph-round-s" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/portrait-08-face.webp" alt="" width={44} height={44} loading="lazy" decoding="async" />
          </span>
          <figcaption className="z-micro">{t("round", lang)}</figcaption>
        </figure>
        <figure className="ph-cvhead">
          <div className="ph-cvhead-sheet" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/portrait-08-640.webp" alt="" width={72} height={96} loading="lazy" decoding="async" />
            <span className="ph-bars"><i /><i /><i /></span>
          </div>
          <figcaption className="z-micro">{t("header", lang)}</figcaption>
        </figure>
      </div>
      <p className="z-micro ph-fine">{t("examples", lang)}</p>
      <p className="z-micro ph-fine">{t("honest", lang)}</p>
    </div>
  );
}

export default function PhotoSection({ lang }: { lang: Lang }) {
  const still = useMedia(REDUCED_MOTION);
  const wide = useMedia("(min-width: 900px) and (min-height: 640px)");
  const pinned = wide && !still;
  const dir: 1 | -1 = lang === "ar" ? -1 : 1;

  const sectionRef = useRef<HTMLElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [version, setVersion] = useState(0);
  const distMV = useMotionValue(0);

  // How far the reel travels: the track's width beyond the view.
  useEffect(() => {
    const track = trackRef.current, view = viewRef.current;
    if (!track || !view) return;
    const measure = () => {
      const d = Math.max(0, Math.round(track.scrollWidth - view.clientWidth));
      setDist(d);
      distMV.set(d);
      setVersion(v => v + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(view);
    return () => ro.disconnect();
  }, [pinned, lang, distMV]);

  // Wide screens: scrolling down the held section carries the reel sideways.
  const { scrollYProgress } = useScroll({ target: runwayRef, offset: ["start 69px", "end end"] });
  const pinX = useTransform([scrollYProgress, distMV], ([p, d]: number[]) => -dir * p * d);
  // Phones: the reel is swiped; its own scroll position moves the cards.
  const { scrollX } = useScroll({ container: viewRef });
  const swipeX = useTransform(scrollX, v => -v);
  // Phones: the cards open as the reel comes up the screen.
  const { scrollYProgress: enterP } = useScroll({ target: viewRef, offset: ["start end", "start 40%"] });
  const one = useMotionValue(1);
  const shift = pinned ? pinX : swipeX;
  const enter = pinned || still ? one : enterP;

  const titleId = "ph-title";
  return (
    <section id="photos" ref={sectionRef} className="z-section ph" data-mode={pinned ? "pinned" : still ? "still" : "swipe"} aria-labelledby={titleId}>
      <style href="zenith-photos" precedence="medium">{CSS}</style>
      {!pinned && (
        <div className="z-wrap z-wrap-wide ph-head">
          <Intro lang={lang} id={titleId} />
        </div>
      )}
      <div className="ph-runway" ref={runwayRef} style={pinned ? { height: `calc(100svh - 69px + ${dist}px)` } : undefined}>
        <div
          className="ph-view"
          ref={viewRef}
          tabIndex={pinned ? undefined : 0}
          role={pinned ? undefined : "region"}
          aria-label={pinned ? undefined : `${t("reel", lang)}. ${t("swipe", lang)}`}
        >
          <motion.div className="ph-track" ref={trackRef} style={pinned ? { x: pinX } : undefined}>
            {pinned && <div className="ph-intro"><Intro lang={lang} id={titleId} /></div>}
            <ol className="ph-list" aria-label={t("reel", lang)}>
              {PORTRAITS.map(p => (
                <ReelCard key={p.id} p={p} lang={lang} shift={shift} view={viewRef} dir={dir} enter={enter} still={still} version={version} />
              ))}
            </ol>
            <div className="ph-end"><InUse lang={lang} /></div>
          </motion.div>
          {pinned && (
            <div className="ph-progress" aria-hidden="true"><motion.span style={{ scaleX: scrollYProgress }} /></div>
          )}
        </div>
      </div>
      {!pinned && <p className="z-wrap z-wrap-wide z-micro ph-hint">{t("swipe", lang)}</p>}
    </section>
  );
}

const CSS = `
.ph{position:relative}
.ph[data-mode="pinned"]{padding-bottom:0}
.ph-head{margin-bottom:34px}
.ph-intro-in .z-h2{max-width:16ch}
.ph-body{margin-top:18px;max-width:46ch}
.ph-what{margin-top:30px;font-size:14px;font-weight:600;color:var(--z-gold-text)}
.ph-aspects{margin:10px 0 0;display:grid;max-width:520px}
.ph-aspects div{display:grid;grid-template-columns:7.5rem minmax(0,1fr);gap:14px;padding:11px 0;border-top:1px solid var(--z-rule)}
.ph-aspects div:last-child{border-bottom:1px solid var(--z-rule)}
.ph-aspects dt{font-family:var(--font-serif),Georgia,serif;font-size:18px;line-height:1.35;color:var(--z-fg)}
[dir="rtl"] .ph-aspects dt{font-family:var(--font-arabic-serif),var(--font-arabic),serif;font-size:17px}
.ph-aspects dd{margin:0;font-size:14.5px;line-height:1.55;color:var(--z-fg-2)}

/* The reel */
.ph-view{position:relative}
.ph-track{display:flex;align-items:center;gap:clamp(16px,2.4vw,36px);width:max-content;padding:0 max(20px,calc((100vw - 1320px)/2 + 40px))}
.ph-list{list-style:none;margin:0;padding:0;display:flex;align-items:flex-start;gap:clamp(16px,2.4vw,36px)}
.ph-card{flex:none}
.ph-card figure{margin:0}
.ph-frame{position:relative;overflow:hidden;border-radius:12px;background:var(--z-surface-2);aspect-ratio:3/4;box-shadow:0 30px 60px -36px rgba(0,0,0,.8)}
.ph-img{position:absolute;inset:0;will-change:transform}
.ph-frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 20%;display:block}
.ph-cap{margin-top:14px;font-size:14px;line-height:1.5;color:var(--z-fg-2);max-width:30ch}
.ph-end{flex:none}

/* Wide screens: held while the reel travels */
.ph[data-mode="pinned"] .ph-view{position:sticky;top:69px;height:calc(100svh - 69px);overflow:hidden;display:flex;align-items:center}
.ph[data-mode="pinned"] .ph-track{height:100%;will-change:transform}
.ph[data-mode="pinned"] .ph-intro{flex:none;width:min(500px,36vw);margin-inline-end:clamp(24px,4vw,72px);align-self:center}
.ph[data-mode="pinned"] .ph-card{width:calc(min(66svh,640px) * .75)}
.ph[data-mode="pinned"] .ph-end{width:min(440px,34vw);margin-inline-start:clamp(16px,3vw,48px)}
.ph-progress{position:absolute;inset:auto max(20px,calc((100vw - 1320px)/2 + 40px)) 26px;height:1px;background:var(--z-rule)}
.ph-progress span{position:absolute;inset:0;background:var(--z-gold);transform-origin:0 50%}
[dir="rtl"] .ph-progress span{transform-origin:100% 50%}

/* Phones (and short screens): swiped */
.ph[data-mode="swipe"] .ph-view,.ph[data-mode="still"] .ph-view{overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding-bottom:6px}
.ph[data-mode="swipe"] .ph-view::-webkit-scrollbar{display:none}
.ph[data-mode="still"] .ph-view{scrollbar-width:thin}
.ph[data-mode="swipe"] .ph-card,.ph[data-mode="still"] .ph-card{width:min(74vw,340px);scroll-snap-align:center}
.ph[data-mode="swipe"] .ph-end,.ph[data-mode="still"] .ph-end{width:min(84vw,400px);scroll-snap-align:center;align-self:stretch;display:flex;align-items:center}
.ph-view:focus-visible{outline:2px solid var(--z-focus);outline-offset:4px}
.ph-hint{margin-top:14px}

/* Where the photo is used */
.ph-used{padding:28px;border:1px solid var(--z-rule);border-radius:16px;background:var(--z-surface)}
.ph-used-h{font-size:clamp(24px,2.2vw,30px);line-height:1.15;margin-bottom:10px}
.ph-used-demo{display:flex;align-items:flex-end;gap:22px;margin:22px 0 18px;flex-wrap:wrap}
.ph-used figure{margin:0;display:flex;flex-direction:column;gap:10px}
.ph-round{flex-direction:row!important;align-items:flex-end;gap:12px!important;flex-wrap:wrap}
.ph-round figcaption{flex-basis:100%}
.ph-round-l img{display:block;width:112px;height:112px;border-radius:50%;box-shadow:0 0 0 3px var(--z-surface),0 0 0 4px var(--z-rule-strong)}
.ph-round-s img{display:block;width:40px;height:40px;border-radius:50%}
.ph-cvhead-sheet{display:flex;gap:12px;align-items:flex-start;width:200px;padding:14px;border-radius:6px;background:var(--z-sheet);box-shadow:0 14px 30px -20px rgba(0,0,0,.6)}
.ph-cvhead-sheet img{width:54px;height:72px;object-fit:cover;object-position:50% 14%;border-radius:3px;display:block}
.ph-bars{flex:1;display:flex;flex-direction:column;gap:7px;padding-top:4px}
.ph-bars i{display:block;height:7px;border-radius:2px;background:#d9cfc2}
.ph-bars i:first-child{height:11px;width:86%;background:#3b2d22}
.ph-bars i:nth-child(2){width:62%;background:#b08a57}
.ph-bars i:nth-child(3){width:74%}
.ph-fine{margin-top:8px}
@media (prefers-reduced-motion:reduce){.ph-img{will-change:auto}}
`;
