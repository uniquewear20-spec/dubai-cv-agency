"use client";

import React, { useRef } from "react";
import { CreditCard, FileText, Send, CheckCircle } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

// ── Tokens matching Zenith brand ──────────────────────────────────────────────
const G = "#C8A96E";
const GL = "#E2C98E";

// ── Step data ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    numeral: "I",
    title: "Select",
    description:
      "Choose the package that matches your career stage and complete a secure payment in minutes.",
    Icon: CreditCard,
  },
  {
    numeral: "II",
    title: "Brief",
    description:
      "Share your career background, target markets, and objectives via our intake form, WhatsApp, or email — whichever is most convenient for you.",
    Icon: FileText,
  },
  {
    numeral: "III",
    title: "Engineer",
    description:
      "Your dedicated career document specialist architects every element of your profile within 48 hours.",
    Icon: Send,
  },
  {
    numeral: "IV",
    title: "Refine",
    description:
      "Unlimited revision rounds until every word, format, and strategic nuance meets your full satisfaction.",
    Icon: CheckCircle,
  },
];

// ── Individual step card ──────────────────────────────────────────────────────
interface StepCardProps {
  numeral: string;
  title: string;
  description: string;
  Icon: React.ElementType;
  index: number;
}

function StepCard({ numeral, title, description, Icon, index }: StepCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl h-full",
        "transition-transform duration-500 ease-out",
        "hover:-translate-y-1"
      )}
      style={{
        animationDelay: `${index * 120}ms`,
      }}
    >
      {/* GlowingEffect border trail */}
      <GlowingEffect
        spread={28}
        proximity={80}
        borderWidth={1.5}
        blur={0}
        inactiveZone={0.4}
        movementDuration={1.4}
      />

      {/* Card surface */}
      <div
        className="relative z-10 h-full rounded-2xl overflow-hidden flex flex-col p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(4px)",
        }}
      >
        {/* Subtle top-edge shimmer */}
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(200,169,110,0.18), transparent)`,
          }}
        />

        {/* Roman numeral */}
        <p
          className="text-4xl font-normal mb-8 select-none"
          style={{
            color: G,
            fontFamily: "'Georgia', 'Times New Roman', serif",
            opacity: 0.28,
            letterSpacing: "-0.02em",
          }}
        >
          {numeral}
        </p>

        {/* Icon */}
        <div
          className="mb-5 flex items-center justify-center w-10 h-10 rounded-xl"
          style={{
            background: `${G}12`,
            border: `1px solid ${G}22`,
          }}
        >
          <Icon
            size={17}
            strokeWidth={1.5}
            style={{ color: G, opacity: 0.75 }}
          />
        </div>

        {/* Title */}
        <h3
          className="text-lg font-semibold mb-3 tracking-tight"
          style={{
            color: "#EDE8E0",
            fontFamily: "sans-serif",
          }}
        >
          {title}
        </h3>

        {/* Divider */}
        <div
          className="mb-4 h-px w-8"
          style={{ background: `linear-gradient(to right, ${G}50, transparent)` }}
        />

        {/* Description */}
        <p
          className="text-[13px] leading-[1.85] flex-1"
          style={{
            color: "rgba(200,185,170,0.65)",
            fontFamily: "sans-serif",
            fontWeight: 300,
          }}
        >
          {description}
        </p>

        {/* Bottom accent */}
        <div
          className="mt-8 h-px w-6 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{ background: G }}
        />
      </div>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader() {
  return (
    <div className="mb-16">
      <p
        className="text-[10px] font-medium tracking-[0.35em] uppercase mb-4"
        style={{ color: G, fontFamily: "sans-serif" }}
      >
        The Method
      </p>
      <h2
        className="text-3xl sm:text-4xl font-normal tracking-tight"
        style={{
          color: "#EDE8E0",
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        Precise. Rigorous.{" "}
        <em style={{ fontStyle: "italic", color: GL }}>
          Delivered in 48 hours.
        </em>
      </h2>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function ProcessSection() {
  return (
    <section
      className="relative py-32 px-5 sm:px-8 overflow-hidden"
      style={{ background: "#0A0907" }}
    >
      {/* Atmospheric background radial */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 35% at 50% -5%, rgba(200,169,110,0.055), transparent 65%)",
        }}
      />

      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeader />

        {/* Responsive grid: 1 col mobile → 2 col md → 4 col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step, i) => (
            <StepCard key={step.numeral} {...step} index={i} />
          ))}
        </div>

        {/* Connector line (desktop only) */}
        <div
          className="hidden lg:block absolute pointer-events-none"
          style={{
            top: "calc(50% + 20px)",
            left: "calc(12.5% + 20px)",
            right: "calc(12.5% + 20px)",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${G}18, ${G}25, ${G}18, transparent)`,
            zIndex: 0,
          }}
        />
      </div>
    </section>
  );
}

export default ProcessSection;