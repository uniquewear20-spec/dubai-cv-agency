"use client";

// ─── Dependency: npm install motion ──────────────────────────────────────────
// Uses motion/react as primary; falls back gracefully to framer-motion
import { motion } from "motion/react";
import React, { useRef, useEffect, useState } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const GOLD = "#D4AF37";

const INDUSTRY_COLORS: Record<string, string> = {
  Finance:     "#F59E0B",
  Hospitality: "#D4AF37",
  Healthcare:  "#34D399",
  "Oil & Gas": "#FB923C",
  Tech:        "#3B82F6",
  Aviation:    "#818CF8",
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface TestimonialItem {
  name:      string;
  role:      string;
  flag:      string;
  industry:  string;
  stars:     number;
  text:      string;
  highlight: string;
  avatarUrl?: string;
}

interface TestimonialsColumnsProps {
  testimonials: TestimonialItem[];
  dark?: boolean;
  /** Number of columns — default 3 */
  columns?: number;
  /** Scroll speed in px/s — default 40 */
  speed?: number;
}

// ─── SINGLE CARD ─────────────────────────────────────────────────────────────
function TestimonialCard({
  item,
  dark = true,
}: {
  item: TestimonialItem;
  dark?: boolean;
}) {
  const accent  = INDUSTRY_COLORS[item.industry] ?? GOLD;
  const cardBg  = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const borderC = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const textHi  = dark ? "#ffffff"                : "#111827";
  const textSub = dark ? "#a1a1aa"                : "#6b7280";
  const textMid = dark ? "#d4d4d8"                : "#374151";

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl border p-4 mb-4 transition-all duration-300 hover:border-[#D4AF37]/50"
      style={{ borderColor: borderC, background: cardBg }}
    >
      {/* Accent glow orb */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.13]"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
      />

      {/* Top row: industry badge + stars */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{ borderColor: `${accent}40`, background: `${accent}14`, color: accent }}
        >
          {item.industry}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: item.stars }).map((_, i) => (
            <svg key={i} width="10" height="10" viewBox="0 0 14 14" fill={GOLD}>
              <path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9l-4 2.5 1.5-4L1 5h4.5z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Highlight pill */}
      <div
        className="mb-2 inline-flex self-start items-center rounded-full border px-2 py-0.5 text-[9px] font-semibold"
        style={{ borderColor: `${GOLD}35`, background: `${GOLD}10`, color: GOLD }}
      >
        ✦ {item.highlight}
      </div>

      {/* Quote */}
      <p className="flex-1 text-[11px] leading-[1.7]" style={{ color: textMid }}>
        &ldquo;{item.text}&rdquo;
      </p>

      {/* Author row */}
      <div
        className="mt-3 flex items-center gap-2 border-t pt-3"
        style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
      >
        {/* Avatar — photo or flag fallback */}
        {item.avatarUrl ? (
          <img
            src={item.avatarUrl}
            alt={item.name}
            className="h-8 w-8 shrink-0 rounded-full object-cover ring-1"
            style={{ ringColor: `${accent}40` } as React.CSSProperties}
          />
        ) : (
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm"
            style={{ borderColor: `${accent}35`, background: `${accent}12` }}
          >
            {item.flag}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold" style={{ color: textHi }}>
            {item.flag} {item.name}
          </p>
          <p className="truncate text-[10px]" style={{ color: textSub }}>{item.role}</p>
        </div>
      </div>
    </div>
  );
}

// ─── SINGLE SCROLLING COLUMN ──────────────────────────────────────────────────
function TestimonialsColumn({
  items,
  dark = true,
  durationSeconds = 40,
  reverse = false,
  className = "",
}: {
  items:           TestimonialItem[];
  dark?:           boolean;
  durationSeconds?: number;
  reverse?:        boolean;
  className?:      string;
}) {
  // Double the list for a seamless infinite loop
  const doubled = [...items, ...items];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        // Scroll up by exactly half the total height (= one copy of items)
        animate={{ y: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{
          duration:   durationSeconds,
          ease:       "linear",
          repeat:     Infinity,
          repeatType: "loop",
        }}
      >
        {doubled.map((item, i) => (
          <TestimonialCard key={`${item.name}-${i}`} item={item} dark={dark} />
        ))}
      </motion.div>
    </div>
  );
}

// ─── MAIN EXPORT: 3-COLUMN VERTICAL MARQUEE ──────────────────────────────────
export function TestimonialsColumns({
  testimonials,
  dark = true,
  columns = 3,
  speed = 40,
}: TestimonialsColumnsProps) {
  const pageBg  = dark ? "#050505" : "#ffffff";
  const textHi  = dark ? "#ffffff" : "#111827";
  const textSub = dark ? "#a1a1aa" : "#6b7280";

  // Distribute testimonials round-robin across columns
  const cols: TestimonialItem[][] = Array.from({ length: columns }, () => []);
  testimonials.forEach((t, i) => cols[i % columns].push(t));

  // Stagger speeds slightly per column for an organic feel
  const speeds = [speed, speed * 1.15, speed * 0.9];

  return (
    <section id="testimonials" className="py-16 px-6 max-w-7xl mx-auto">

      {/* Section heading */}
      <div className="mb-10">
        <p
          className="text-xs font-bold uppercase tracking-[0.18em]"
          style={{ color: GOLD }}
        >
          Testimonials
        </p>
        <h2
          className="mt-2 text-3xl font-black tracking-tight"
          style={{ color: textHi }}
        >
          Client Reviews
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="13" height="13" viewBox="0 0 14 14" fill={GOLD}>
                <path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9l-4 2.5 1.5-4L1 5h4.5z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-semibold" style={{ color: textHi }}>5.0</span>
          <span className="text-xs" style={{ color: textSub }}>200+ verified reviews</span>
        </div>
      </div>

      {/*
        Columns container.
        - Hidden on mobile/tablet; shown on lg+ (desktop) — matching the demo spec.
        - mask-image fades cards out at the top and bottom edges for the premium look.
        - Fixed height so the mask is crisp.
      */}
      <div
        className="hidden lg:grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          height:              "640px",
          // Vertical fade-out mask — fades 10% at top and bottom
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        {cols.map((colItems, ci) => (
          <TestimonialsColumn
            key={ci}
            items={colItems}
            dark={dark}
            durationSeconds={speeds[ci] ?? speed}
            // Middle column scrolls in reverse for visual interest
            reverse={ci === 1}
          />
        ))}
      </div>

      {/*
        Mobile / tablet fallback — simple 1-column scroll
        (hidden on lg+, shown below lg)
      */}
      <div
        className="lg:hidden"
        style={{
          height: "500px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          overflow: "hidden",
        }}
      >
        <TestimonialsColumn
          items={testimonials}
          dark={dark}
          durationSeconds={speed * 2}
        />
      </div>
    </section>
  );
}