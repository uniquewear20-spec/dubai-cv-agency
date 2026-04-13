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
  label: string;
  sublabel: string;
  badge: "ai" | "linkedin" | "recruiter";
}

const PROFILES: ProfileCard[] = Array.from({ length: 20 }, (_, i) => ({
  image: `/team/img${i + 1}.png`,
  label: `Executive Profile ${i + 1}`,
  sublabel: "Global Market Ready",
  badge: i % 3 === 0 ? "ai" : i % 3 === 1 ? "linkedin" : "recruiter"
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
            alt={card.label}
            className="w-full h-full object-cover object-top transition-all duration-700 
                       grayscale group-hover:grayscale-0 group-hover:scale-[1.05] group-hover:brightness-[1.05]"
          />
          <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "65%", background: "linear-gradient(to top, rgba(10,9,7,0.85) 0%, transparent 100%)" }} />
          <div className="absolute bottom-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full z-20" style={{ background: "rgba(10,9,7,0.85)", backdropFilter: "blur(8px)", border: `1px solid ${badgeColor}30`, ...(isRTL(lang) ? { right: "12px" } : { left: "12px" }) }}>
            <Sparkles size={8} strokeWidth={1.5} color={badgeColor} />
            <span className="text-[8px] font-medium tracking-[0.18em] uppercase" style={{ color: badgeColor, fontFamily: "sans-serif" }}>{card.badge}</span>
          </div>
        </div>
        <div className="px-4 py-3" style={{ borderTop: `1px solid rgba(200,169,110,0.08)`, textAlign: isRTL(lang) ? "right" : "left" }}>
          <p className="text-[11px] font-semibold leading-tight" style={{ color: dark ? "#C8C0B8" : "#1A1410", fontFamily: "sans-serif" }}>{card.label}</p>
          <p className="text-[9px] mt-0.5 tracking-[0.10em]" style={{ color: dark ? "#5A5450" : "#9A8E84", fontFamily: "sans-serif" }}>{card.sublabel}</p>
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
      <div className="mx-auto max-w-6xl px-5 mb-16" style={{ textAlign: isAr ? "right" : "left" }}>
        {/* Eyebrow */}
        <p className="text-[9px] font-medium tracking-[0.40em] uppercase mb-5" style={{ color: G }}>
          {tr("eyebrow", lang)}
        </p>

        {/* Heading */}
        <h2 className="text-3xl sm:text-[42px] font-normal tracking-tight leading-[1.15] mb-6" style={{ color: hi, ...(isAr ? { lineHeight: 1.4 } : {}) }}>
          {tr("heading", lang).split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {i === 1
                ? <em style={{ fontStyle: "italic", color: G }}>{line}</em>
                : line}
            </React.Fragment>
          ))}
        </h2>

        {/* Subheading */}
        <p className="text-sm leading-[2.0] max-w-lg mb-8" style={{ color: dark ? "#6A5E56" : "#8A7A70", fontFamily: "sans-serif", fontWeight: 300, ...(isAr ? { marginInlineStart: "auto", marginInlineEnd: 0, lineHeight: 2.2 } : {}) }}>
          {tr("subheading", lang)}
        </p>

        {/* CTA */}
        <button
          onClick={onEnquire}
          className="px-10 h-[50px] rounded-full text-[10px] uppercase font-medium tracking-widest transition-all hover:opacity-90"
          style={{ background: G, color: INK }}
        >
          {tr("cta", lang)}
        </button>

        {/* Caption */}
        <p className="mt-6 text-[9px] tracking-[0.20em] uppercase" style={{ color: dark ? `${G}30` : `${G}55`, fontFamily: "sans-serif" }}>
          {tr("caption", lang)}
        </p>
      </div>

      {/* Marquee rows */}
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