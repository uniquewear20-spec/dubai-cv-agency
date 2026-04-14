"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

const G = "#C8A96E";
const INK = "#0A0907";

type Lang = "en" | "ar" | "fr";
const isRTL = (lang: Lang) => lang === "ar";

const TX: Record<string, Record<Lang, string>> = {
  eyebrow: {
    en: "AI-Enhanced Executive Identity",
    ar: "هوية تنفيذية مُحسَّنة بالذكاء الاصطناعي",
    fr: "Identité Exécutive Augmentée par l'IA",
  },
  heading: {
    en: "Your Image,\nEngineered for Authority.",
    ar: "صورتك\nمُهندَسة للسلطة.",
    fr: "Votre image,\ncalibrée pour l'autorité.",
  },
  subheading: {
    en: "AI-enhanced profile photography that positions you for global opportunity — before a word is read.",
    ar: "تصوير الملف الشخصي بالذكاء الاصطناعي — يُموضعك للفرص العالمية قبل قراءة أي كلمة.",
    fr: "Photographie de profil améliorée par IA — vous positionne avant qu'un mot ne soit lu.",
  },
  cta: {
    en: "Engineer My Executive Image",
    ar: "هندسة صورتي التنفيذية",
    fr: "Architecturer mon image",
  },
  caption: {
    en: "Before a single word is read — your image commands.",
    ar: "قبل قراءة كلمة واحدة — صورتك تتحدث.",
    fr: "Avant qu'un mot soit lu — votre image s'impose.",
  },
};
const tr = (k: string, l: Lang) => TX[k]?.[l] ?? TX[k]?.en ?? k;

interface ProfileCard {
  image: string;
  label: Record<Lang, string>;
  sublabel: Record<Lang, string>;
  badge: "ai" | "linkedin" | "recruiter";
}

const PROFILES: ProfileCard[] = Array.from({ length: 20 }, (_, i) => ({
  image: `/team/img${i + 1}.png`,
  label: {
    en: `Executive Profile ${i + 1}`,
    ar: `ملف تنفيذي ${i + 1}`,
    fr: `Profil Exécutif ${i + 1}`,
  },
  sublabel: {
    en: "Global Market Ready",
    ar: "جاهز للسوق العالمي",
    fr: "Prêt pour le marché mondial",
  },
  badge: (i % 3 === 0 ? "ai" : i % 3 === 1 ? "linkedin" : "recruiter") as "ai" | "linkedin" | "recruiter",
}));

function ProfilePhotoCard({ card, dark, lang }: { card: ProfileCard; dark: boolean; lang: Lang }) {
  const badgeColor = card.badge === "ai" ? "#8A6AAA" : card.badge === "linkedin" ? G : "#4A8A6A";

  return (
    <div className="relative shrink-0 w-52 cursor-default select-none group">
      <div className="rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          border: `1px solid rgba(200,169,110,0.10)`,
          background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.92)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.22)",
        }}>
        <div className="relative overflow-hidden" style={{ height: "268px" }}>
          <img
            src={card.image}
            alt={card.label[lang]}
            className="w-full h-full object-cover object-top transition-all duration-700 
                       grayscale group-hover:grayscale-0 group-hover:scale-[1.05] group-hover:brightness-[1.05]"
          />
          <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "65%", background: "linear-gradient(to top, rgba(10,9,7,0.85) 0%, transparent 100%)" }} />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full z-20" style={{ background: "rgba(10,9,7,0.85)", backdropFilter: "blur(8px)", border: `1px solid ${badgeColor}30` }}>
            <Sparkles size={8} strokeWidth={1.5} color={badgeColor} />
            <span className="text-[8px] font-medium tracking-[0.18em] uppercase" style={{ color: badgeColor, fontFamily: "sans-serif" }}>{card.badge}</span>
          </div>
        </div>
        {/* Card text uses RTL direction for Arabic */}
        <div className="px-4 py-3" dir={isRTL(lang) ? "rtl" : "ltr"} style={{ borderTop: `1px solid rgba(200,169,110,0.08)`, textAlign: isRTL(lang) ? "right" : "left" }}>
          <p className="text-[11px] font-semibold leading-tight" style={{ color: dark ? "#C8C0B8" : "#1A1410", fontFamily: "sans-serif" }}>{card.label[lang]}</p>
          <p className="text-[9px] mt-0.5" style={{ color: dark ? "#5A5450" : "#9A8E84", fontFamily: "sans-serif", letterSpacing: isRTL(lang) ? "0.02em" : "0.10em" }}>{card.sublabel[lang]}</p>
        </div>
      </div>
    </div>
  );
}

export default function TeamMarqueeSection({ dark, lang, onEnquire }: { dark: boolean; lang: Lang; onEnquire: () => void }) {
  const rowA = PROFILES.slice(0, 10);
  const rowB = PROFILES.slice(10, 20);
  const bg = dark ? INK : "#F7F3EE";
  const hi = dark ? "#EDE8E0" : "#1A1410";
  const isAr = isRTL(lang);

  return (
    <section className="py-40 overflow-hidden" style={{ background: bg }}>
      {/* Text content respects RTL */}
      <div className="mx-auto max-w-6xl px-5 mb-16" dir={isAr ? "rtl" : "ltr"} style={{ textAlign: isAr ? "right" : "left" }}>
        <p className="text-[9px] font-medium uppercase mb-5" style={{ color: G, letterSpacing: isAr ? "0.08em" : "0.40em" }}>
          {tr("eyebrow", lang)}
        </p>

        <h2 className="text-3xl sm:text-[42px] font-normal tracking-tight mb-6" style={{ color: hi, lineHeight: isAr ? 1.4 : 1.15 }}>
          {tr("heading", lang).split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {i === 1
                ? <em style={{ fontStyle: "italic", color: G }}>{line}</em>
                : line}
            </React.Fragment>
          ))}
        </h2>

        <p className="text-sm max-w-lg mb-8" style={{ color: dark ? "#6A5E56" : "#8A7A70", fontFamily: "sans-serif", fontWeight: 300, lineHeight: isAr ? 2.2 : 2.0, ...(isAr ? { marginRight: 0, marginLeft: "auto" } : {}) }}>
          {tr("subheading", lang)}
        </p>

        <button
          onClick={onEnquire}
          className="px-10 h-[50px] rounded-full text-[10px] uppercase font-medium transition-all hover:opacity-90"
          style={{ background: G, color: INK, letterSpacing: isAr ? "0.05em" : "0.16em" }}
        >
          {tr("cta", lang)}
        </button>

        <p className="mt-6 text-[9px] uppercase" style={{ color: dark ? `${G}30` : `${G}55`, fontFamily: "sans-serif", letterSpacing: isAr ? "0.05em" : "0.20em" }}>
          {tr("caption", lang)}
        </p>
      </div>

      {/* Marquee rows — the Marquee component forces dir="ltr" internally
          so translateX animations work correctly regardless of page direction */}
      <div className="space-y-5">
        <Marquee speed={55} pauseOnHover fade dark={dark}>
          {rowA.map(c => <ProfilePhotoCard key={c.image} card={c} dark={dark} lang={lang} />)}
        </Marquee>
        <Marquee speed={50} pauseOnHover reverse fade dark={dark}>
          {rowB.map(c => <ProfilePhotoCard key={c.image} card={c} dark={dark} lang={lang} />)}
        </Marquee>
      </div>
    </section>
  );
}