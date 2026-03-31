"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// ── Tokens (match page.tsx) ──────────────────────────────────────────────────
const G   = "#C8A96E";
const INK = "#0A0907";

// ── LinkedIn profile photo examples ─────────────────────────────────────────
// Place uploaded files at: /public/images/team/img1.png … img13.png
const PHOTOS = [
  { id: 1,  src: "/images/team/img1.png"  },
  { id: 2,  src: "/images/team/img2.png"  },
  { id: 3,  src: "/images/team/img3.png"  },
  { id: 4,  src: "/images/team/img4.png"  },
  { id: 5,  src: "/images/team/img5.png"  },
  { id: 6,  src: "/images/team/img6.png"  },
  { id: 7,  src: "/images/team/img7.png"  },
  { id: 8,  src: "/images/team/img8.png"  },
  { id: 9,  src: "/images/team/img9.png"  },
  { id: 10, src: "/images/team/img10.png" },
  { id: 11, src: "/images/team/img11.png" },
  { id: 12, src: "/images/team/img12.png" },
  { id: 13, src: "/images/team/img13.png" },
];

type Lang = "en" | "ar" | "fr";

const TX: Record<string, Record<Lang, string>> = {
  eyebrow: { en: "Selective intake",           ar: "قبول انتقائي",            fr: "Admission sélective" },
  h2a:     { en: "We work with those",         ar: "نعمل مع أولئك",           fr: "Nous travaillons avec ceux" },
  h2b:     { en: "who intend to win.",         ar: "الذين يعزمون على الفوز.",  fr: "qui ont l'intention de gagner." },
  body:    {
    en: "Zenith is not a platform. It is a practice. We accept a limited number of engagements each month — chosen for ambition, not convenience.",
    ar: "Zenith ليست منصة. إنها ممارسة. نقبل عدداً محدوداً من التعاقدات كل شهر — مختارة بناءً على الطموح.",
    fr: "Zenith n'est pas une plateforme. C'est une pratique. Nous acceptons un nombre limité de missions chaque mois.",
  },
  pt1: { en: "Application-based intake",        ar: "قبول قائم على الطلب",     fr: "Admission sur candidature" },
  pt2: { en: "Limited monthly engagements",     ar: "تعاقدات شهرية محدودة",    fr: "Engagements mensuels limités" },
  pt3: { en: "Senior-level professionals only", ar: "للمحترفين رفيعي المستوى", fr: "Professionnels senior uniquement" },
  cta: { en: "Request Private Review",          ar: "طلب مراجعة خاصة",         fr: "Demander une revue privée" },
  caption: {
    en: "LinkedIn Profile Photo Enhancement — included in every engagement",
    ar: "تحسين صورة ملف لينكدإن — مضمّن في كل تعاقد",
    fr: "Amélioration photo LinkedIn — incluse dans chaque mission",
  },
};

const tr = (k: string, l: Lang): string => TX[k]?.[l] ?? TX[k]?.en ?? k;

// ── Reveal ────────────────────────────────────────────────────────────────────
function Reveal({ children, d = 0, y = 20, className = "" }: {
  children: React.ReactNode; d?: number; y?: number; className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4% 0px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: d }}
    >
      {children}
    </motion.div>
  );
}

// ── Single card — tall rectangle, image fills it, no text overlay ─────────────
const CARD_W = 200; // px
const CARD_H = 280; // px
const GAP    = 20;  // px

function PhotoCard({ src, id, dark }: { src: string; id: number; dark: boolean }) {
  return (
    <div
      style={{
        width:        `${CARD_W}px`,
        height:       `${CARD_H}px`,
        flexShrink:   0,
        borderRadius: "16px",
        overflow:     "hidden",
        border:       `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        background:   dark ? "rgba(200,169,110,0.03)" : "rgba(200,169,110,0.05)",
      }}
    >
      <img
        src={src}
        alt={`LinkedIn profile example ${id}`}
        style={{
          width:         "100%",
          height:        "100%",
          objectFit:     "cover",
          objectPosition:"center top",
          display:       "block",
          filter:        dark
            ? "grayscale(20%) contrast(1.05) brightness(0.88)"
            : "grayscale(10%) contrast(1.02)",
          transition:    "transform 0.6s ease",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
        onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
      />
    </div>
  );
}

// ── Marquee — single seamless row ────────────────────────────────────────────
function PhotoMarquee({ dark }: { dark: boolean }) {
  // Triple the array so there is always off-screen content ready
  const items      = [...PHOTOS, ...PHOTOS, ...PHOTOS];
  const oneSetPx   = PHOTOS.length * (CARD_W + GAP);

  return (
    <div
      style={{
        overflow:           "hidden",
        maskImage:          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:    "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <motion.div
        style={{ display: "flex", gap: `${GAP}px`, width: "max-content" }}
        animate={{ x: [0, -oneSetPx] }}
        transition={{
          duration:   38,
          ease:       "linear",
          repeat:     Infinity,
          repeatType: "loop",
        }}
      >
        {items.map((photo, i) => (
          <PhotoCard key={`${photo.id}-${i}`} src={photo.src} id={photo.id} dark={dark} />
        ))}
      </motion.div>
    </div>
  );
}

// ── Main export — drop-in replacement for the Exclusivity section ─────────────
interface Props {
  dark:      boolean;
  lang:      Lang;
  onEnquire: () => void;
}

export default function TeamMarqueeSection({ dark, lang, onEnquire }: Props) {
  const hi  = dark ? "#EDE8E0" : "#1A1410";
  const mid = dark ? "#B8A89C" : "#6A5A50";
  const bdr = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const bg  = dark ? "#0A0907" : "#F7F3EE";

  return (
    <section
      style={{
        borderTop:     `1px solid ${bdr}`,
        paddingTop:    "160px",
        paddingBottom: "160px",
        background:    bg,
        overflow:      "hidden",
      }}
    >
      {/* ── Original exclusivity copy ── */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <Reveal>
            <p
              className="text-[9px] font-medium tracking-[0.40em] uppercase mb-6"
              style={{ color: dark ? `${G}55` : G, fontFamily: "sans-serif" }}
            >
              {tr("eyebrow", lang)}
            </p>
            <h2
              className="text-3xl sm:text-[42px] font-normal tracking-tight leading-[1.15] mb-8"
              style={{ color: hi }}
            >
              {tr("h2a", lang)}<br />
              <em style={{ fontStyle: "italic", color: G }}>{tr("h2b", lang)}</em>
            </h2>
            <p
              className="text-base leading-[2.0] max-w-md"
              style={{ color: dark ? "#6A5E56" : "#8A7A70", fontFamily: "sans-serif", fontWeight: 300 }}
            >
              {tr("body", lang)}
            </p>
          </Reveal>

          {/* Right */}
          <Reveal d={0.15}>
            <div className="flex flex-col gap-3 mb-8">
              {[tr("pt1", lang), tr("pt2", lang), tr("pt3", lang)].map((pt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 px-7 py-5 rounded-2xl"
                  style={{ background: dark ? `${G}04` : `${G}06`, border: `1px solid ${G}16` }}
                >
                  <div className="shrink-0 h-1 w-5" style={{ background: G, opacity: 0.5 }} />
                  <p className="text-sm" style={{ color: mid, fontFamily: "sans-serif", fontWeight: 400 }}>{pt}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onEnquire}
              className="flex items-center justify-center gap-2.5 px-10 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full transition-all hover:opacity-88"
              style={{ background: G, color: INK, height: "50px", fontFamily: "sans-serif", boxShadow: `0 6px 28px ${G}24` }}
            >
              {tr("cta", lang)} <ArrowRight size={11} strokeWidth={1.5} />
            </button>
          </Reveal>

        </div>
      </div>

      {/* ── Single-row photo marquee ── */}
      <div style={{ marginTop: "80px" }}>
        <PhotoMarquee dark={dark} />
      </div>

      {/* ── Caption ── */}
      <Reveal d={0.05}>
        <p
          className="mt-7 text-center text-[8px] tracking-[0.28em] uppercase"
          style={{ color: dark ? `${G}25` : `${G}50`, fontFamily: "sans-serif" }}
        >
          {tr("caption", lang)}
        </p>
      </Reveal>
    </section>
  );
}