"use client";

/**
 * team.tsx  ─  "Zenith Portfolio Excellence" Section
 * /components/sections/team.tsx
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

// ─── Brand tokens ────────────────────────────────────────────────────────────
const G   = "#C8A96E";
const GL  = "#E2C98E";
const INK = "#0A0907";

// ─── Translations ─────────────────────────────────────────────────────────────
type Lang = "en" | "ar" | "fr";

const TX: Record<string, Record<Lang, string>> = {
  eyebrow:    { en: "Portfolio Excellence",       ar: "تميُّز المحفظة",             fr: "Excellence du portfolio" },
  heading:    { en: "Zenith Portfolio\nExcellence.", ar: "تميُّز محفظة\nزينيث.", fr: "L'Excellence du\nPortfolio Zenith." },
  subheading: {
    en: "Crafting high-impact professional identities for the Dubai market.",
    ar: "بناء هويات مهنية عالية التأثير لسوق دبي.",
    fr: "Créer des identités professionnelles à fort impact pour le marché de Dubaï.",
  },
  pill1: { en: "Application-based intake",        ar: "قبول قائم على الطلب",     fr: "Admission sur candidature" },
  pill2: { en: "Limited monthly engagements",     ar: "تعاقدات شهرية محدودة",    fr: "Engagements mensuels limités" },
  pill3: { en: "Senior-level professionals only", ar: "للمحترفين رفيعي المستوى", fr: "Professionnels senior uniquement" },
  cta:      { en: "Request Private Review", ar: "طلب مراجعة خاصة", fr: "Demander une revue privée" },
  caption:  { en: "7,000+ careers positioned across 40+ nationalities.", ar: "أكثر من 7,000 مسار مهني عبر 40+ جنسية.", fr: "7 000+ carrières positionnées pour 40+ nationalités." },
};
const tr = (k: string, l: Lang) => TX[k]?.[l] ?? TX[k]?.en ?? k;

// ─── Team members ─────────────────────────────────────────────────────────────
interface TeamMember {
  image: string;
  name: string;
  role: string;
}

const LOCAL_MEMBERS: TeamMember[] = [
  { image: "/team/img1.png",  name: "Aryan Mehta",        role: "Executive CV Architect"       },
  { image: "/team/img2.png",  name: "Khalid Al-Mansoori", role: "GCC Career Strategist"         },
  { image: "/team/img3.png",  name: "Layla Hassan",       role: "LinkedIn Authority Lead"       },
  { image: "/team/img4.png",  name: "Sofia Elias",        role: "Personal Branding Specialist"  },
  { image: "/team/img5.png",  name: "Rania Farouk",       role: "Senior CV Consultant"          },
  { image: "/team/img6.png",  name: "Nadia Brahim",       role: "Career Identity Director"      },
  { image: "/team/img7.png",  name: "Amara Diallo",       role: "Multilingual CV Specialist"    },
  { image: "/team/img9.png",  name: "James Hartley",      role: "Executive Positioning Lead"    },
  { image: "/team/img10.png", name: "Marcus Osei",        role: "ATS Optimisation Expert"       },
  { image: "/team/img11.png", name: "Sara Gallardo",      role: "Aviation Sector Specialist"    },
  { image: "/team/img13.png", name: "Victor Blanc",       role: "European Markets Consultant"   },
];

// ─── Single card ──────────────────────────────────────────────────────────────
function MemberCard({ member, dark }: { member: TeamMember; dark: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative shrink-0 w-56 cursor-default select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: `1px solid ${hovered ? `${G}45` : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          background: dark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.92)",
          transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          boxShadow: hovered
            ? `0 0 28px ${G}14, 0 8px 32px rgba(0,0,0,0.35)`
            : "0 2px 12px rgba(0,0,0,0.20)",
        }}
      >
        {/* Photo */}
        <div className="relative overflow-hidden" style={{ height: "280px" }}>
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top"
            style={{
              filter: hovered
                ? "grayscale(0%) contrast(1.02) brightness(1.02)"
                : "grayscale(100%) contrast(1.05) brightness(0.90)",
              transition:
                "filter 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)",
              transform: hovered ? "scale(1.05)" : "scale(1.0)",
            }}
          />

          {/* Bottom gradient */}
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "60%",
              background: hovered
                ? `linear-gradient(to top, rgba(10,9,7,0.88) 0%, transparent 100%)`
                : `linear-gradient(to top, rgba(10,9,7,0.72) 0%, transparent 100%)`,
              transition: "background 0.55s ease",
            }}
          />

          {/* Gold top line on hover */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${G}, transparent)`,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
        </div>

        {/* Name / role */}
        <div
          className="px-4 py-3"
          style={{
            background: dark
              ? hovered ? `rgba(200,169,110,0.06)` : "transparent"
              : hovered ? `rgba(200,169,110,0.04)` : "rgba(255,255,255,0.95)",
            transition: "background 0.4s ease",
            borderTop: `1px solid ${hovered ? `${G}22` : dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          }}
        >
          <p
            className="text-[12px] font-semibold leading-tight"
            style={{
              color: hovered ? GL : dark ? "#C8C0B8" : "#1A1410",
              fontFamily: "sans-serif",
              transition: "color 0.3s ease",
            }}
          >
            {member.name}
          </p>
          <p
            className="text-[9px] mt-0.5 uppercase tracking-[0.16em]"
            style={{
              color: hovered ? `${G}90` : dark ? "#5A5450" : "#9A8E84",
              fontFamily: "sans-serif",
              transition: "color 0.3s ease",
            }}
          >
            {member.role}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({
  children,
  d = 0,
  y = 20,
  className = "",
}: {
  children: React.ReactNode;
  d?: number;
  y?: number;
  className?: string;
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

// ─── Main export ──────────────────────────────────────────────────────────────
interface TeamMarqueeSectionProps {
  dark: boolean;
  lang: Lang;
  onEnquire: () => void;
  members?: TeamMember[];
}

export default function TeamMarqueeSection({
  dark,
  lang,
  onEnquire,
  members = LOCAL_MEMBERS,
}: TeamMarqueeSectionProps) {
  const bg  = dark ? INK : "#F7F3EE";
  const hi  = dark ? "#EDE8E0" : "#1A1410";
  const bdr = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const rowA = members;
  const rowB = [...members].reverse();

  const headingLines = tr("heading", lang).split("\n");

  return (
    <section
      className="py-40 overflow-hidden"
      style={{
        borderTop: `1px solid ${bdr}`,
        background: bg,
        transition: "background 0.7s ease",
      }}
    >
      {/* ── Header ── */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 mb-16">
        <Reveal>
          <p
            className="text-[9px] font-medium tracking-[0.40em] uppercase mb-5"
            style={{ color: dark ? `${G}55` : G, fontFamily: "sans-serif" }}
          >
            {tr("eyebrow", lang)}
          </p>
        </Reveal>

        <Reveal d={0.1}>
          <h2
            className="text-3xl sm:text-[42px] font-normal tracking-tight leading-[1.15] mb-6"
            style={{ color: hi }}
          >
            {headingLines.map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {i === headingLines.length - 1 ? (
                  <em style={{ fontStyle: "italic", color: G }}>{line}</em>
                ) : (
                  line
                )}
              </React.Fragment>
            ))}
          </h2>
        </Reveal>

        <Reveal d={0.2}>
          <p
            className="text-base leading-[2.0] max-w-lg mb-12"
            style={{
              color: dark ? "#6A5E56" : "#8A7A70",
              fontFamily: "sans-serif",
              fontWeight: 300,
            }}
          >
            {tr("subheading", lang)}
          </p>
        </Reveal>

        {/* Pills */}
        <Reveal d={0.3}>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-12">
            {[tr("pill1", lang), tr("pill2", lang), tr("pill3", lang)].map((pt) => (
              <div
                key={pt}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
                style={{
                  background: dark ? `${G}05` : `${G}07`,
                  border: `1px solid ${G}18`,
                }}
              >
                <div
                  className="h-1 w-4 rounded-full shrink-0"
                  style={{ background: G, opacity: 0.5 }}
                />
                <p
                  className="text-[11px]"
                  style={{
                    color: dark ? "#C0B0A0" : "#5A4E44",
                    fontFamily: "sans-serif",
                  }}
                >
                  {pt}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal d={0.4}>
          <button
            type="button"
            onClick={onEnquire}
            className="flex items-center gap-2.5 px-10 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full transition-all hover:opacity-88"
            style={{
              background: G,
              color: INK,
              height: "50px",
              fontFamily: "sans-serif",
              boxShadow: `0 6px 28px ${G}24`,
              border: "none",
              cursor: "pointer",
            }}
          >
            {tr("cta", lang)} <ArrowRight size={11} strokeWidth={1.5} />
          </button>
        </Reveal>
      </div>

      {/* ── Marquee rows ── */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="pointer-events-none absolute top-0 left-0 z-10 h-full w-28 sm:w-48"
          style={{
            background: `linear-gradient(to right, ${bg}, transparent)`,
            transition: "background 0.7s ease",
          }}
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute top-0 right-0 z-10 h-full w-28 sm:w-48"
          style={{
            background: `linear-gradient(to left, ${bg}, transparent)`,
            transition: "background 0.7s ease",
          }}
        />

        {/* Row A */}
        <Marquee speed={35} pauseOnHover fade gap={20} dark={dark}>
          {rowA.map((m) => (
            <MemberCard key={m.image + "-a"} member={m} dark={dark} />
          ))}
        </Marquee>

        {/* Row B */}
        <div className="mt-5">
          <Marquee speed={28} pauseOnHover reverse fade gap={20} dark={dark}>
            {rowB.map((m) => (
              <MemberCard key={m.image + "-b"} member={m} dark={dark} />
            ))}
          </Marquee>
        </div>
      </div>

      {/* ── Caption ── */}
      <Reveal d={0.1} className="mt-14 text-center px-5">
        <p
          className="text-[9px] tracking-[0.28em] uppercase"
          style={{
            color: dark ? `${G}20` : "rgba(26,20,16,0.22)",
            fontFamily: "sans-serif",
          }}
        >
          {tr("caption", lang)}
        </p>
      </Reveal>
    </section>
  );
}