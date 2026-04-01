"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const G   = "#C8A96E";
const GL  = "#E2C98E";
const INK = "#0A0907";

// ─── Translations ─────────────────────────────────────────────────────────────
type Lang = "en" | "ar" | "fr";

const TX: Record<string, Record<Lang, string>> = {
  eyebrow:    { en: "AI Profile Photography",           ar: "تصوير الملف الشخصي بالذكاء الاصطناعي",  fr: "Photographie IA" },
  heading:    { en: "Let your image\nspeak.",           ar: "دع صورتك\nتتحدث عنك.",                  fr: "Laissez votre image\nparler pour vous." },
  subheading: {
    en: "Designed to position you for global opportunities.",
    ar: "مصمَّمة لتضعك في المسار الصحيح نحو الفرص العالمية.",
    fr: "Conçues pour vous positionner face aux opportunités mondiales.",
  },
  pill1: { en: "Recruiter-optimized framing",    ar: "إطار محسَّن للمجندين",         fr: "Cadrage optimisé recruteurs" },
  pill2: { en: "LinkedIn algorithm signals",     ar: "إشارات خوارزمية لينكدإن",      fr: "Signaux algorithme LinkedIn" },
  pill3: { en: "Global market ready",            ar: "جاهز للسوق العالمي",            fr: "Prêt pour le marché mondial" },
  cta:      { en: "Request Profile Enhancement", ar: "طلب تحسين صورة الملف", fr: "Demander l'amélioration du profil" },
  caption:  { en: "Every profile engineered to attract — before a single word is read.", ar: "كل صورة ملف مُهندَسة لتجذب — قبل قراءة كلمة واحدة.", fr: "Chaque profil conçu pour attirer — avant qu'un mot ne soit lu." },
};
const tr = (k: string, l: Lang) => TX[k]?.[l] ?? TX[k]?.en ?? k;

interface ProfileCard {
  image: string;
  label: string;
  sublabel: string;
  badge: "ai" | "linkedin" | "recruiter";
}

const PROFILES: ProfileCard[] = [
  { image: "/team/img1.png",  label: "Corporate Executive Profile",     sublabel: "C-Suite · Global Markets",           badge: "recruiter" },
  { image: "/team/img2.png",  label: "Finance Professional",            sublabel: "LinkedIn Ready · GCC",               badge: "linkedin"  },
  { image: "/team/img3.png",  label: "Tech Specialist",                 sublabel: "Global Market · APAC",               badge: "ai"        },
  { image: "/team/img4.png",  label: "Consulting-Level Portrait",       sublabel: "Senior · International",             badge: "recruiter" },
  { image: "/team/img5.png",  label: "GCC Career Profile",              sublabel: "Dubai · Riyadh · Abu Dhabi",         badge: "linkedin"  },
  { image: "/team/img6.png",  label: "ATS-Optimized Visual Identity",   sublabel: "Europe · North America",             badge: "ai"        },
  { image: "/team/img7.png",  label: "International Job Seeker",        sublabel: "Multi-Market · Recruiter Tested",    badge: "recruiter" },
  { image: "/team/img8.png",  label: "Healthcare Sector Profile",       sublabel: "GCC · Europe · Canada",             badge: "ai"        },
  { image: "/team/img9.png",  label: "Executive Leadership Profile",    sublabel: "Board Level · Global",               badge: "ai"        },
  { image: "/team/img10.png", label: "Operations Director Portrait",    sublabel: "Fortune 500 · GCC",                  badge: "linkedin"  },
  { image: "/team/img11.png", label: "Aviation Sector Profile",         sublabel: "Emirates · Gulf Carriers",           badge: "recruiter" },
  { image: "/team/img12.png", label: "Banking & Finance Identity",      sublabel: "DIFC · London · New York",           badge: "linkedin"  },
  { image: "/team/img13.png", label: "European Market Identity",        sublabel: "EU · UK · Switzerland",              badge: "ai"        },
  { image: "/team/img14.png", label: "Technology Leader Profile",       sublabel: "Silicon Valley · Singapore",         badge: "recruiter" },
  { image: "/team/img15.png", label: "Senior Management Portrait",      sublabel: "GCC · Africa · Asia",               badge: "ai"        },
  { image: "/team/img16.png", label: "Legal & Compliance Profile",      sublabel: "UAE · UK · EU",                     badge: "linkedin"  },
  { image: "/team/img17.png", label: "Hospitality Executive Identity",  sublabel: "Jumeirah · Marriott · Hilton",       badge: "recruiter" },
  { image: "/team/img18.png", label: "Engineering Sector Profile",      sublabel: "ADNOC · Aramco · Global",           badge: "ai"        },
  { image: "/team/img19.png", label: "Marketing Director Portrait",     sublabel: "Digital · Brand · Global",          badge: "linkedin"  },
  { image: "/team/img20.png", label: "C-Suite Executive Identity",      sublabel: "CEO · COO · CFO Level",             badge: "recruiter" },
];

function ProfilePhotoCard({ card, dark }: { card: ProfileCard; dark: boolean }) {
  const badgeLabel = card.badge === "ai" ? "AI Enhanced" : card.badge === "linkedin" ? "LinkedIn Ready" : "Recruiter Optimized";
  const badgeColor = card.badge === "ai" ? "#8A6AAA" : card.badge === "linkedin" ? G : "#4A8A6A";

  return (
    <div className="relative shrink-0 w-52 cursor-default select-none group">
      <div
        className="rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          border: `1px solid rgba(200,169,110,0.10)`,
          background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.92)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.22)",
        }}
      >
        <div className="relative overflow-hidden" style={{ height: "268px" }}>
          <img
            src={card.image}
            alt={card.label}
            className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-[1.05] group-hover:brightness-[1.02]"
            style={{ filter: "grayscale(100%) contrast(1.05) brightness(0.88)" }}
          />
          <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "65%", background: "linear-gradient(to top, rgba(10,9,7,0.85) 0%, transparent 100%)" }} />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(10,9,7,0.75)", backdropFilter: "blur(8px)", border: `1px solid ${badgeColor}30` }}>
            <Sparkles size={8} strokeWidth={1.5} color={badgeColor} />
            <span className="text-[8px] font-medium tracking-[0.18em] uppercase" style={{ color: badgeColor, fontFamily: "sans-serif" }}>{badgeLabel}</span>
          </div>
        </div>
        <div className="px-4 py-3" style={{ borderTop: `1px solid rgba(200,169,110,0.08)` }}>
          <p className="text-[11px] font-semibold leading-tight" style={{ color: dark ? "#C8C0B8" : "#1A1410", fontFamily: "sans-serif" }}>{card.label}</p>
          <p className="text-[9px] mt-0.5 tracking-[0.10em]" style={{ color: dark ? "#5A5450" : "#9A8E84", fontFamily: "sans-serif" }}>{card.sublabel}</p>
        </div>
      </div>
    </div>
  );
}

function Reveal({ children, d = 0, y = 20, className = "" }: { children: React.ReactNode; d?: number; y?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-4% 0px" }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: d }}>
      {children}
    </motion.div>
  );
}

export default function TeamMarqueeSection({ dark, lang, onEnquire }: { dark: boolean; lang: Lang; onEnquire: () => void }) {
  const bg = dark ? INK : "#F7F3EE";
  const hi = dark ? "#EDE8E0" : "#1A1410";
  const bdr = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const rowA = PROFILES.slice(0, 10);
  const rowB = PROFILES.slice(10, 20);

  const headingLines = tr("heading", lang).split("\n");

  return (
    <section id="ai-photos" className="py-40 overflow-hidden" style={{ borderTop: `1px solid ${bdr}`, background: bg, transition: "background 0.7s ease" }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 mb-16">
        <Reveal><div className="flex items-center gap-3 mb-5"><Sparkles size={11} color={dark ? `${G}55` : G} strokeWidth={1.5} /><p className="text-[9px] font-medium tracking-[0.40em] uppercase" style={{ color: dark ? `${G}55` : G, fontFamily: "sans-serif" }}>{tr("eyebrow", lang)}</p></div></Reveal>
        <Reveal d={0.1}><h2 className="text-3xl sm:text-[42px] font-normal tracking-tight leading-[1.15] mb-6" style={{ color: hi }}>{headingLines.map((line, i) => (<React.Fragment key={i}>{i > 0 && <br />}{i === headingLines.length - 1 ? (<em style={{ fontStyle: "italic", color: G }}>{line}</em>) : (line)}</React.Fragment>))}</h2></Reveal>
        <Reveal d={0.2}><p className="text-base leading-[2.0] max-w-lg mb-12" style={{ color: dark ? "#6A5E56" : "#8A7A70", fontFamily: "sans-serif", fontWeight: 300 }}>{tr("subheading", lang)}</p></Reveal>
        <Reveal d={0.4}><button type="button" onClick={onEnquire} className="flex items-center gap-2.5 px-10 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full transition-all" style={{ background: G, color: INK, height: "50px", fontFamily: "sans-serif", boxShadow: `0 6px 28px ${G}24`, border: "none", cursor: "pointer" }}>{tr("cta", lang)} <ArrowRight size={11} strokeWidth={1.5} /></button></Reveal>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-28 sm:w-48" style={{ background: `linear-gradient(to right, ${bg}, transparent)` }} />
        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-28 sm:w-48" style={{ background: `linear-gradient(to left, ${bg}, transparent)` }} />

        <Marquee speed={55} pauseOnHover fade gap={20} dark={dark}>
          {rowA.map((c) => (<ProfilePhotoCard key={c.image + "-a"} card={c} dark={dark} />))}
        </Marquee>

        <div className="mt-5">
          <Marquee speed={50} pauseOnHover reverse fade gap={20} dark={dark}>
            {rowB.map((c) => (<ProfilePhotoCard key={c.image + "-b"} card={c} dark={dark} />))}
          </Marquee>
        </div>
      </div>

      <Reveal d={0.1} className="mt-14 text-center px-5">
        <p className="text-[9px] tracking-[0.28em] uppercase" style={{ color: dark ? `${G}20` : "rgba(26,20,16,0.22)", fontFamily: "sans-serif" }}>{tr("caption", lang)}</p>
      </Reveal>
    </section>
  );
}