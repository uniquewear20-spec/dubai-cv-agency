// Updated Zenith Dubai CV - 20 March 2026
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Star, ChevronLeft, ChevronRight, Mail } from "lucide-react";

// ─── CONTACT CONSTANTS ────────────────────────────────────────────────────────
// 👉 Change CONTACT_EMAIL here and every button/link updates automatically
const CONTACT_EMAIL   = "info@zenithdubaicv.com";
const WHATSAPP_NUMBER = "971502879462";
const GOLD            = "#D4AF37";

// ─── STRIPE PAYMENT LINKS ─────────────────────────────────────────────────────
const PAYMENT_LINKS = {
  basic:        "https://buy.stripe.com/test_eVq4gyeEe25R03d5GG0oM00",
  professional: "https://buy.stripe.com/test_aFa28q8fQcKv3fpglk0oM01",
  ultimate:     "https://buy.stripe.com/test_aFadR89jU6m75nx4CC0oM02",
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Testimonial = {
  name:      string;
  role:      string;
  flag:      string;
  industry:  string;
  stars:     number;
  text:      string;
  highlight: string;
};

// ─── TESTIMONIALS DATA ────────────────────────────────────────────────────────
const TESTIMONIALS: Testimonial[] = [
  {
    name:      "Sara Al-Rashidi",
    role:      "Finance Director, Dubai",
    flag:      "🇦🇪",
    industry:  "Finance",
    stars:     5,
    text:      "I applied to 12 roles and received 9 interview callbacks in under two weeks. The ATS CV passed every recruiter filter. Zenith understood the DIFC market precisely.",
    highlight: "9 callbacks in 2 weeks",
  },
  {
    name:      "James Okafor",
    role:      "Hospitality GM, Dubai Marina",
    flag:      "🇳🇬",
    industry:  "Hospitality",
    stars:     5,
    text:      "Every hiring manager mentioned my CV before the interview. The Cinematic Visual was breathtaking. Landed my dream role and negotiated a 28% higher salary.",
    highlight: "+28% salary negotiated",
  },
  {
    name:      "Captain Rashed Al-Bloushi",
    role:      "Senior First Officer, Emirates",
    flag:      "🇦🇪",
    industry:  "Aviation",
    stars:     5,
    text:      "Aviation CVs are a different discipline. The Zenith team knew exactly what airline HR departments look for. My Emirates application was shortlisted within days.",
    highlight: "Emirates shortlisted in days",
  },
  {
    name:      "Marcus Vandenberg",
    role:      "VP Engineering, ADNOC",
    flag:      "🇳🇱",
    industry:  "Oil & Gas",
    stars:     5,
    text:      "The ATS Professional template passed Fortune 500 filters I had struggled with for months. Within three weeks I had two competing offers from major energy firms.",
    highlight: "2 competing offers in 3 weeks",
  },
  {
    name:      "Priya Nair",
    role:      "Cloud Architect, Singapore",
    flag:      "🇸🇬",
    industry:  "Tech",
    stars:     5,
    text:      "Transitioning from India to Singapore is incredibly competitive. Zenith repositioned my profile for the APAC tech market. I doubled my interview rate and accepted an offer 40% above my previous package.",
    highlight: "40% salary increase",
  },
  {
    name:      "Dr. Layla Al-Hosani",
    role:      "Head of Cardiology, SEHA",
    flag:      "🇦🇪",
    industry:  "Healthcare",
    stars:     5,
    text:      "I needed a CV that reflected both my clinical excellence and leadership. Zenith delivered a world-class executive design that helped me secure my department head position.",
    highlight: "Department Head secured",
  },
  {
    name:      "Claire Beaumont",
    role:      "Private Banking Director, DIFC",
    flag:      "🇬🇧",
    industry:  "Finance",
    stars:     5,
    text:      "Relocated from London to DIFC and needed a CV for ultra-high-net-worth client management. The Executive Premium design opened doors at two of the top private banks in Dubai.",
    highlight: "DIFC role landed in 4 weeks",
  },
  {
    name:      "Yousef Al-Qahtani",
    role:      "Operations Director, Aramco",
    flag:      "🇸🇦",
    industry:  "Oil & Gas",
    stars:     5,
    text:      "My previous CV kept me at the same level for three years. After Zenith rebuilt my profile, I was promoted internally and received an unsolicited offer at 35% uplift.",
    highlight: "+35% salary uplift",
  },
];

// ─── INDUSTRY ACCENT COLOURS ──────────────────────────────────────────────────
const INDUSTRY_COLORS: Record<string, string> = {
  Finance:     "#F59E0B",
  Hospitality: "#D4AF37",
  Healthcare:  "#34D399",
  "Oil & Gas": "#FB923C",
  Tech:        "#3B82F6",
  Aviation:    "#818CF8",
};

// ─── UTILITY ──────────────────────────────────────────────────────────────────
function waLink(msg: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
function emailLink(subject = "CV Inquiry", body = "") {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
}

// ─── FADE-IN ANIMATION WRAPPER ────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── STAR ROW ─────────────────────────────────────────────────────────────────
function StarRow({ count, size = 13 }: { count: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} width={size} height={size} fill={GOLD} stroke="none" />
      ))}
    </div>
  );
}

// ─── DARK / LIGHT TOGGLE ──────────────────────────────────────────────────────
function DarkToggle({
  dark,
  onToggle,
}: {
  dark: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!dark)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:opacity-80"
      style={{
        borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(212,175,55,0.50)",
        background:   dark ? "rgba(255,255,255,0.06)" : "rgba(212,175,55,0.08)",
      }}
    >
      {dark ? (
        <Sun  size={15} color={GOLD} strokeWidth={2} />
      ) : (
        <Moon size={15} color={GOLD} strokeWidth={2} />
      )}
    </button>
  );
}

// ─── EMAIL ICON BUTTON (header / footer variant) ──────────────────────────────
function EmailIconButton({ dark }: { dark: boolean }) {
  return (
    <a
      href={emailLink("CV Inquiry — Zenith Dubai CV")}
      aria-label={`Email us at ${CONTACT_EMAIL}`}
      title={CONTACT_EMAIL}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:opacity-80"
      style={{
        borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(212,175,55,0.50)",
        background:   dark ? "rgba(255,255,255,0.06)" : "rgba(212,175,55,0.08)",
      }}
    >
      <Mail size={15} color={GOLD} strokeWidth={2} />
    </a>
  );
}

// ─── TESTIMONIALS 4-COLUMN GRID WITH PAGINATION ───────────────────────────────
function TestimonialsSection({ dark }: { dark: boolean }) {
  const [page, setPage] = useState(0);
  const PER_PAGE   = 4;
  const totalPages = Math.ceil(TESTIMONIALS.length / PER_PAGE);
  const visible    = TESTIMONIALS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const border  = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const cardBg  = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const textHi  = dark ? "#ffffff"                : "#111827";
  const textSub = dark ? "#a1a1aa"                : "#6b7280";
  const textMid = dark ? "#d4d4d8"                : "#374151";
  const dotDim  = dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)";

  return (
    <section id="testimonials" className="py-16 px-6 max-w-7xl mx-auto">
      <FadeIn className="mb-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
          Testimonials
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight" style={{ color: textHi }}>
          Client Reviews
        </h2>
      </FadeIn>

      <FadeIn delay={0.05} className="mb-8 flex items-center gap-3">
        <StarRow count={5} />
        <span className="text-sm font-semibold" style={{ color: textHi }}>5.0</span>
        <span className="text-xs"               style={{ color: textSub }}>200+ verified reviews</span>
      </FadeIn>

      {/* 4-column responsive grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((tm, i) => {
          const accent = INDUSTRY_COLORS[tm.industry] ?? GOLD;
          return (
            <motion.div
              key={`${tm.name}-${page}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
              className="relative flex flex-col overflow-hidden rounded-3xl border p-4"
              style={{ borderColor: border, background: cardBg }}
            >
              {/* Decorative glow */}
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.14]"
                style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
              />

              {/* Industry badge + stars */}
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ borderColor: `${accent}40`, background: `${accent}14`, color: accent }}
                >
                  {tm.industry}
                </span>
                <StarRow count={tm.stars} size={11} />
              </div>

              {/* Highlight pill */}
              <div
                className="mb-3 inline-flex self-start items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
                style={{ borderColor: `${GOLD}35`, background: `${GOLD}10`, color: GOLD }}
              >
                {tm.highlight}
              </div>

              {/* Quote */}
              <p className="flex-1 text-xs leading-[1.7]" style={{ color: textMid }}>
                &ldquo;{tm.text}&rdquo;
              </p>

              {/* Author */}
              <div
                className="mt-4 flex items-center gap-2.5 border-t pt-3"
                style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
              >
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border text-base"
                  style={{ borderColor: `${accent}35`, background: `${accent}12` }}
                >
                  {tm.flag}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: textHi }}>{tm.name}</p>
                  <p className="text-[10px]"           style={{ color: textSub }}>{tm.role}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, pi) => (
              <button
                key={pi}
                type="button"
                onClick={() => setPage(pi)}
                aria-label={`Page ${pi + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width:      page === pi ? "2rem" : "0.5rem",
                  background: page === pi ? GOLD : dotDim,
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous page"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:opacity-80 disabled:opacity-30"
              style={{ borderColor: border, background: cardBg, color: textHi }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              aria-label="Next page"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:opacity-80 disabled:opacity-30"
              style={{ borderColor: border, background: cardBg, color: textHi }}
            >
              <ChevronRight size={16} />
            </button>
            <span className="ml-1 text-xs" style={{ color: textSub }}>
              {page + 1} / {totalPages}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── ROOT PAGE COMPONENT ──────────────────────────────────────────────────────
export default function Home() {

  // ── Theme state — default dark, persisted to localStorage ─────────────────
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("zenith-theme");
    return saved !== null ? saved === "dark" : true;
  });

  const handleSetDark = (value: boolean) => {
    setDark(value);
    localStorage.setItem("zenith-theme", value ? "dark" : "light");
  };
  // ──────────────────────────────────────────────────────────────────────────

  // Semantic theme tokens
  const bg      = dark ? "#050505"                : "#ffffff";
  const textHi  = dark ? "#ffffff"                : "#0f172a";
  const textSub = dark ? "#a1a1aa"                : "#64748b";
  const textMid = dark ? "#d4d4d8"                : "#374151";
  const border  = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const cardBg  = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardHov = dark ? "rgba(255,255,255,0.07)" : "#f8fafc";
  const navBg   = dark ? "rgba(5,5,5,0.88)"       : "rgba(255,255,255,0.92)";

  return (
    <div
      className="min-h-screen w-full font-sans transition-colors duration-300 relative"
      style={{ background: bg, color: textHi }}
    >
      {/* Gold ambient glow — dark mode only */}
      {dark && (
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(800px 400px at 20% 10%, rgba(212,175,55,0.09), transparent 60%)",
          }}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          HEADER
          — Logo | Nav links | Email icon | Dark toggle
      ══════════════════════════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300"
        style={{ borderColor: border, background: navBg }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

          {/* Logo */}
          <div className="text-xl font-black tracking-tighter italic" style={{ color: textHi }}>
            DUBAI <span style={{ color: GOLD }}>CV</span> AGENCY
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#services"     style={{ color: textSub }} className="transition hover:opacity-70">Services</a>
            <a href="#process"      style={{ color: textSub }} className="transition hover:opacity-70">Process</a>
            <a href="#pricing"      style={{ color: textSub }} className="transition hover:opacity-70">Pricing</a>
            <a href="#testimonials" style={{ color: textSub }} className="transition hover:opacity-70">Reviews</a>
          </nav>

          {/* Right-side controls */}
          <div className="flex items-center gap-2">
            {/* "Contact Us" text link — desktop only */}
            <a
              href={emailLink("CV Inquiry — Zenith Dubai CV")}
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition hover:opacity-80"
              style={{ borderColor: `${GOLD}50`, background: `${GOLD}0d`, color: GOLD }}
            >
              <Mail size={12} strokeWidth={2.2} />
              Contact Us
            </a>

            {/* Email icon — mobile fallback */}
            <div className="sm:hidden">
              <EmailIconButton dark={dark} />
            </div>

            {/* Dark / Light toggle */}
            <DarkToggle dark={dark} onToggle={handleSetDark} />
          </div>
        </div>
      </header>

      <main>

        {/* ════════════════════════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          <FadeIn>
            <p
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs mb-8"
              style={{ borderColor: border, background: cardBg, color: textSub }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: GOLD }} />
              Dubai&apos;s Premium CV Agency — ATS + Cinematic Design
            </p>

            <h1
              className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight"
              style={{ color: textHi }}
            >
              GET HIRED IN{" "}
              <span className="italic" style={{ color: GOLD }}>DUBAI.</span>
            </h1>

            <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: textSub }}>
              Professional CV writing and LinkedIn optimization tailored for the
              UAE&apos;s competitive job market.
            </p>

            {/* Hero CTA row — See Packages + Email Inquiry + WhatsApp */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

              {/* Primary — See Packages */}
              <a
                href="#pricing"
                className="inline-flex h-12 items-center rounded-full px-8 text-sm font-bold text-black hover:brightness-105 transition"
                style={{
                  background: GOLD,
                  boxShadow: `0 0 0 1px rgba(212,175,55,0.35), 0 16px 50px rgba(212,175,55,0.22)`,
                }}
              >
                See Packages
              </a>

              {/* Secondary — Email Inquiry (gold outline, Mail icon) */}
              <a
                href={emailLink(
                  "CV Inquiry — Zenith Dubai CV",
                  "Hi, I would like to learn more about your CV packages and get started."
                )}
                className="inline-flex h-12 items-center gap-2 rounded-full border px-8 text-sm font-bold transition hover:brightness-105"
                style={{
                  borderColor: GOLD,
                  background:  `${GOLD}12`,
                  color:       GOLD,
                  boxShadow:   `0 0 0 1px ${GOLD}30`,
                }}
              >
                <Mail size={15} strokeWidth={2} />
                Email Inquiry
              </a>

              {/* Tertiary — WhatsApp */}
              <a
                href={waLink("Hi! I want to upgrade my CV. Help me choose the right package.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center rounded-full border px-8 text-sm font-bold transition hover:opacity-80"
                style={{ borderColor: border, background: cardBg, color: textHi }}
              >
                Chat on WhatsApp
              </a>

            </div>
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            STATS STRIP
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-8 px-6 max-w-7xl mx-auto">
          <FadeIn>
            <div
              className="rounded-3xl border p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
              style={{ borderColor: border, background: cardBg }}
            >
              {[
                { stat: "99.9%", label: "ATS Pass Rate"  },
                { stat: "3×",    label: "More Callbacks" },
                { stat: "48h",   label: "First Draft"    },
                { stat: "6",     label: "GCC Markets"    },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <p className="text-3xl font-black" style={{ color: GOLD }}>{stat}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider" style={{ color: textSub }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SERVICES
        ════════════════════════════════════════════════════════════════════ */}
        <section id="services" className="py-16 px-6 max-w-7xl mx-auto">
          <FadeIn className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>Services</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight" style={{ color: textHi }}>What We Deliver</h2>
          </FadeIn>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon:  "📄",
                title: "ATS-Optimized CV",
                body:  "Reverse-engineered against UAE and GCC applicant tracking systems. Every keyword precision-coded to pass recruiter filters automatically.",
              },
              {
                icon:  "🎨",
                title: "Cinematic Design CV",
                body:  "A brand identity, not a document. Layouts that command attention and make hiring managers remember your name long after the interview.",
              },
              {
                icon:  "💼",
                title: "LinkedIn SEO Profile",
                body:  "Full profile rewrite with keyword density mapped to your target roles across the GCC, Europe, and APAC markets.",
              },
            ].map((s, i) => (
              <FadeIn key={s.title} delay={0.08 * i}>
                <div
                  className="flex h-full flex-col rounded-3xl border p-6 transition-all hover:border-[#D4AF37]/40"
                  style={{ borderColor: border, background: cardBg }}
                >
                  <span className="mb-4 text-3xl">{s.icon}</span>
                  <h3 className="text-base font-bold" style={{ color: textHi }}>{s.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7" style={{ color: textSub }}>{s.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            PROCESS
        ════════════════════════════════════════════════════════════════════ */}
        <section id="process" className="py-16 px-6 max-w-7xl mx-auto">
          <FadeIn className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>Process</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight" style={{ color: textHi }}>How It Works</h2>
          </FadeIn>
          <div className="grid gap-5 sm:grid-cols-4">
            {[
              { step: "01", title: "Order",  body: "Choose your package and complete secure Stripe payment." },
              { step: "02", title: "Brief",  body: "Complete a short form or WhatsApp / email us your current CV." },
              { step: "03", title: "Draft",  body: "Receive your first draft within 48 hours." },
              { step: "04", title: "Refine", body: "Request revisions until you are 100% satisfied." },
            ].map((s, i) => (
              <FadeIn key={s.step} delay={0.07 * i}>
                <div
                  className="flex h-full flex-col rounded-3xl border p-6"
                  style={{ borderColor: border, background: cardBg }}
                >
                  <p className="text-3xl font-black mb-3" style={{ color: GOLD }}>{s.step}</p>
                  <h3 className="text-base font-bold mb-2" style={{ color: textHi }}>{s.title}</h3>
                  <p className="text-sm leading-7" style={{ color: textSub }}>{s.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            PRICING  —  179 / 299 / 449 AED
        ════════════════════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-16 px-6 max-w-7xl mx-auto">
          <FadeIn className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>Pricing</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight" style={{ color: textHi }}>Packages</h2>
            <p className="mt-2 text-sm" style={{ color: textSub }}>Transparent pricing. Global-ready results.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

            {/* ── Basic — 179 AED ───────────────────────────────────────── */}
            <FadeIn delay={0.00}>
              <div
                className="rounded-[40px] border p-12 flex flex-col justify-between shadow-sm transition-colors duration-300 hover:border-[#D4AF37]"
                style={{ borderColor: border, background: cardBg }}
              >
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: textHi }}>Basic</h3>
                  <p className="mb-8 text-sm"             style={{ color: textSub }}>Standard CV Update</p>
                  <p className="text-5xl font-black mb-4 tracking-tighter" style={{ color: textHi }}>
                    179 <span className="text-xl font-medium" style={{ color: textSub }}>AED</span>
                  </p>
                  <ul className="mb-10 space-y-2 text-sm" style={{ color: textMid }}>
                    {["ATS CV or Designed CV", "Cover Letter", "AI Photo Touch-up"].map((it) => (
                      <li key={it} className="flex gap-2 items-start">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GOLD }} />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={PAYMENT_LINKS.basic}
                  target="_blank" rel="noreferrer"
                  className="block w-full py-5 text-center rounded-2xl font-bold transition-all duration-300"
                  style={{ background: cardHov, color: textHi }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = GOLD; (e.currentTarget as HTMLAnchorElement).style.color = "#000"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = cardHov; (e.currentTarget as HTMLAnchorElement).style.color = textHi; }}
                >
                  Buy Now
                </a>
              </div>
            </FadeIn>

            {/* ── Professional — 299 AED (featured) ────────────────────── */}
            <FadeIn delay={0.07}>
              <div
                className="rounded-[40px] border-2 p-12 flex flex-col justify-between relative scale-105 z-10 shadow-2xl"
                style={{ borderColor: GOLD, background: dark ? "rgba(212,175,55,0.07)" : "#fffdf5" }}
              >
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest text-black"
                  style={{ background: GOLD }}
                >
                  Most Popular
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: textHi }}>Professional</h3>
                  <p className="mb-8 text-sm"             style={{ color: textSub }}>CV + Cover Letter</p>
                  <p className="text-5xl font-black mb-4 tracking-tighter" style={{ color: textHi }}>
                    299 <span className="text-xl font-medium" style={{ color: textSub }}>AED</span>
                  </p>
                  <ul className="mb-10 space-y-2 text-sm" style={{ color: textMid }}>
                    {[
                      "Both CV types (ATS + Cinematic)",
                      "LinkedIn SEO Optimization",
                      "Career E-book",
                      "EN, FR, DE, AR versions",
                    ].map((it) => (
                      <li key={it} className="flex gap-2 items-start">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GOLD }} />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <a
                    href={PAYMENT_LINKS.professional}
                    target="_blank" rel="noreferrer"
                    className="block w-full py-5 text-center rounded-2xl font-bold text-black hover:brightness-105 transition-all duration-300 shadow-xl"
                    style={{
                      background: GOLD,
                      boxShadow: `0 0 0 1px rgba(212,175,55,0.35), 0 18px 60px rgba(212,175,55,0.22)`,
                    }}
                  >
                    Buy with Apple Pay
                  </a>
                  <p className="mt-2 text-center text-[11px]" style={{ color: textSub }}>
                    Secure payment via Stripe
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* ── Ultimate — 449 AED ────────────────────────────────────── */}
            <FadeIn delay={0.14}>
              <div
                className="rounded-[40px] border p-12 flex flex-col justify-between shadow-sm transition-colors duration-300 hover:border-[#D4AF37]"
                style={{ borderColor: border, background: cardBg }}
              >
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: textHi }}>Ultimate</h3>
                  <p className="mb-8 text-sm"             style={{ color: textSub }}>Full Career Branding</p>
                  <p className="text-5xl font-black mb-4 tracking-tighter" style={{ color: textHi }}>
                    449 <span className="text-xl font-medium" style={{ color: textSub }}>AED</span>
                  </p>
                  <ul className="mb-10 space-y-2 text-sm" style={{ color: textMid }}>
                    {[
                      "Everything in Professional",
                      "1hr Interview Coaching",
                      "Experience Consultation",
                      "30-day VIP Support",
                    ].map((it) => (
                      <li key={it} className="flex gap-2 items-start">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GOLD }} />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={PAYMENT_LINKS.ultimate}
                  target="_blank" rel="noreferrer"
                  className="block w-full py-5 text-center rounded-2xl font-bold transition-all duration-300"
                  style={{ background: cardHov, color: textHi }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = GOLD; (e.currentTarget as HTMLAnchorElement).style.color = "#000"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = cardHov; (e.currentTarget as HTMLAnchorElement).style.color = textHi; }}
                >
                  Buy Now
                </a>
              </div>
            </FadeIn>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            TESTIMONIALS — 4-column grid, paginated
        ════════════════════════════════════════════════════════════════════ */}
        <TestimonialsSection dark={dark} />

        {/* ════════════════════════════════════════════════════════════════════
            FINAL CTA
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 px-6 max-w-4xl mx-auto text-center">
          <FadeIn>
            <div
              className="rounded-3xl border border-[#D4AF37]/25 p-10 sm:p-14"
              style={{
                background: dark
                  ? "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(212,175,55,0.10), transparent 60%)"
                  : "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(212,175,55,0.07), transparent 60%)",
              }}
            >
              <h2 className="text-3xl font-black tracking-tight" style={{ color: textHi }}>
                Your Dream Role Is One CV Away
              </h2>
              <p className="mt-4 text-base" style={{ color: textSub }}>
                Join 200+ professionals who landed roles across the GCC, Europe, and APAC.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={waLink("Hi! I am ready to get started. Help me choose the right CV package.")}
                  target="_blank" rel="noreferrer"
                  className="inline-flex h-12 items-center rounded-full px-8 text-sm font-bold text-black hover:brightness-105 transition"
                  style={{
                    background: GOLD,
                    boxShadow: `0 0 0 1px rgba(212,175,55,0.40), 0 18px 60px rgba(212,175,55,0.26)`,
                  }}
                >
                  Get Started on WhatsApp
                </a>
                <a
                  href={emailLink(
                    "CV Inquiry — Zenith Dubai CV",
                    "Hi, I would like to get started with my CV. Please send me more details."
                  )}
                  className="inline-flex h-12 items-center gap-2 rounded-full border px-8 text-sm font-bold transition hover:brightness-105"
                  style={{ borderColor: GOLD, background: `${GOLD}12`, color: GOLD }}
                >
                  <Mail size={15} strokeWidth={2} />
                  Email Inquiry
                </a>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════════════════════════════ */}
        <footer
          className="py-16 border-t text-center"
          style={{ borderColor: border }}
        >
          <p className="text-sm font-medium tracking-widest uppercase" style={{ color: textSub }}>
            © {new Date().getFullYear()} Dubai CV Agency. Premium Careers.
          </p>
          <p className="mt-2 text-xs" style={{ color: dark ? "#52525b" : "#9ca3af" }}>
            Based in Dubai. Serving the World. — ATS + Cinematic Design
          </p>

          {/* Footer contact row */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {/* Email */}
            <a
              href={emailLink("CV Inquiry — Zenith Dubai CV")}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold transition hover:opacity-80"
              style={{ borderColor: `${GOLD}50`, background: `${GOLD}0d`, color: GOLD }}
            >
              <Mail size={13} strokeWidth={2.2} />
              {CONTACT_EMAIL}
            </a>

            {/* WhatsApp */}
            <a
              href={waLink("Hi! I want to upgrade my CV. Help me choose the right package.")}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold transition hover:opacity-80"
              style={{ borderColor: "rgba(37,211,102,0.40)", background: "rgba(37,211,102,0.07)", color: "#25D366" }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="#25D366">
                <path d="M12 22a10 10 0 0 0 8.66-15 10 10 0 0 0-16.9 10.6L3 22l4.56-.7A10 10 0 0 0 12 22Z" stroke="#25D366" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
                <path d="M9.35 8.9c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3.1.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.2-.2-.3-.5-.4l-1.9-.9c-.2-.1-.4-.1-.6.1-.2.2-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.5c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.5l-.8-2Z" fill="#25D366"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </footer>

      </main>

      {/* ════════════════════════════════════════════════════════════════════════
          FLOATING BUTTONS — Email (gold) + WhatsApp (green), bottom-right stack
      ════════════════════════════════════════════════════════════════════════ */}

      {/* Floating Email button */}
      <a
        href={emailLink("CV Inquiry — Zenith Dubai CV")}
        aria-label={`Email us at ${CONTACT_EMAIL}`}
        title={CONTACT_EMAIL}
        className="fixed bottom-28 right-10 w-14 h-14 rounded-full hover:scale-110 transition-transform z-50 flex items-center justify-center"
        style={{
          background: GOLD,
          boxShadow:  `0 8px 32px rgba(212,175,55,0.40)`,
        }}
      >
        <Mail size={22} color="#000" strokeWidth={2.2} />
      </a>

      {/* Floating WhatsApp button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in your CV packages!")}`}
        target="_blank" rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-10 right-10 w-14 h-14 rounded-full hover:scale-110 transition-transform z-50 flex items-center justify-center"
        style={{
          background: "#25D366",
          boxShadow:  "0 10px 40px rgba(37,211,102,0.4)",
        }}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <path d="M12 22a10 10 0 0 0 8.66-15 10 10 0 0 0-16.9 10.6L3 22l4.56-.7A10 10 0 0 0 12 22Z"
            stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9.35 8.9c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3.1.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.2-.2-.3-.5-.4l-1.9-.9c-.2-.1-.4-.1-.6.1-.2.2-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.5c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.5l-.8-2Z"
            fill="white" />
        </svg>
      </a>

    </div>
  );
}