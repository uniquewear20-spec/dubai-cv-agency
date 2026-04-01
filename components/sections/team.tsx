"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

const G = "#C8A96E";
const INK = "#0A0907";

type Lang = "en" | "ar" | "fr";

const TX: Record<string, Record<Lang, string>> = {
  eyebrow:    { en: "AI Profile Photography",           ar: "تصوير الملف الشخصي بالذكاء الاصطناعي",  fr: "Photographie IA" },
  heading:    { en: "Let your image\nspeak.",           ar: "دع صورتك\nتتحدث عنك.",                  fr: "Laissez votre image\nparler pour vous." },
  subheading: { en: "Designed to position you for global opportunities.", ar: "مصمَّمة لتضعك في المسار الصحيح نحو الفرص العالمية.", fr: "Conçues pour vous positionner face aux opportunités mondiales." },
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

const PROFILES: ProfileCard[] = Array.from({ length: 20 }, (_, i) => ({
  image: `/team/img${i + 1}.png`,
  label: `Executive Profile ${i + 1}`,
  sublabel: "Global Market Ready",
  badge: i % 3 === 0 ? "ai" : i % 3 === 1 ? "linkedin" : "recruiter"
}));

function ProfilePhotoCard({ card, dark }: { card: ProfileCard; dark: boolean }) {
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
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full z-20" style={{ background: "rgba(10,9,7,0.85)", backdropFilter: "blur(8px)", border: `1px solid ${badgeColor}30` }}>
            <Sparkles size={8} strokeWidth={1.5} color={badgeColor} />
            <span className="text-[8px] font-medium tracking-[0.18em] uppercase" style={{ color: badgeColor, fontFamily: "sans-serif" }}>{card.badge}</span>
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

export default function TeamMarqueeSection({ dark, lang, onEnquire }: { dark: boolean; lang: Lang; onEnquire: () => void }) {
  const rowA = PROFILES.slice(0, 10);
  const rowB = PROFILES.slice(10, 20);
  const bg = dark ? INK : "#F7F3EE";
  const hi = dark ? "#EDE8E0" : "#1A1410";

  return (
    <section className="py-40 overflow-hidden" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-5 mb-16">
        <p className="text-[9px] font-medium tracking-[0.40em] uppercase mb-5" style={{ color: G }}>{tr("eyebrow", lang)}</p>
        <h2 className="text-3xl sm:text-[42px] font-normal tracking-tight leading-[1.15] mb-6" style={{ color: hi }}>
          {tr("heading", lang).split("\n").map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}
        </h2>
        <button onClick={onEnquire} className="px-10 h-[50px] rounded-full text-[10px] uppercase font-medium tracking-widest" style={{ background: G, color: INK }}>{tr("cta", lang)}</button>
      </div>
      <div className="space-y-5">
        <Marquee speed={55} pauseOnHover fade dark={dark}>{rowA.map(c => <ProfilePhotoCard key={c.image} card={c} dark={dark} />)}</Marquee>
        <Marquee speed={50} pauseOnHover reverse fade dark={dark}>{rowB.map(c => <ProfilePhotoCard key={c.image} card={c} dark={dark} />)}</Marquee>
      </div>
    </section>
  );
}