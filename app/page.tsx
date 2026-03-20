// Updated Zenith Dubai CV - 20 March 2026
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Star, ChevronLeft, ChevronRight, Mail, X, Send } from "lucide-react";
import { TestimonialsColumns } from "@/components/ui/testimonials-columns-1";

// ─── CONTACT CONSTANTS ────────────────────────────────────────────────────────
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
type ContactForm = {
  senderEmail: string;
  subject:     string;
  message:     string;
};

const SUBJECT_OPTIONS = [
  "Basic Inquiry",
  "Professional CV",
  "Ultimate Package",
  "Other",
];

// ─── TESTIMONIALS DATA (actual client names + "precisely" wording) ────────────
const TESTIMONIALS = [
  {
    name: "Sara Al-Rashidi", role: "Finance Director, Dubai", flag: "🇦🇪",
    industry: "Finance", stars: 5,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face",
    text: "I applied to 12 roles and received 9 interview callbacks in under two weeks. The ATS CV passed every recruiter filter. Zenith understood the DIFC market precisely.",
    highlight: "9 callbacks in 2 weeks",
  },
  {
    name: "James Okafor", role: "Hospitality GM, Dubai Marina", flag: "🇳🇬",
    industry: "Hospitality", stars: 5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    text: "Every hiring manager mentioned my CV before the interview. The Cinematic Visual was breathtaking. Landed my dream role and negotiated a 28% higher salary.",
    highlight: "+28% salary negotiated",
  },
  {
    name: "Captain Rashed Al-Bloushi", role: "Senior First Officer, Emirates", flag: "🇦🇪",
    industry: "Aviation", stars: 5,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
    text: "Aviation CVs are a different discipline. The Zenith team knew exactly what airline HR departments look for. My Emirates application was shortlisted within days.",
    highlight: "Emirates shortlisted in days",
  },
  {
    name: "Marcus Vandenberg", role: "VP Engineering, ADNOC", flag: "🇳🇱",
    industry: "Oil & Gas", stars: 5,
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face",
    text: "The ATS Professional template passed Fortune 500 filters I had struggled with for months. Within three weeks I had two competing offers from major energy firms.",
    highlight: "2 competing offers in 3 weeks",
  },
  {
    name: "Priya Nair", role: "Cloud Architect, Singapore", flag: "🇸🇬",
    industry: "Tech", stars: 5,
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face",
    text: "Transitioning from India to Singapore is incredibly competitive. Zenith repositioned my profile for the APAC tech market. I doubled my interview rate and accepted an offer 40% above my previous package.",
    highlight: "40% salary increase",
  },
  {
    name: "Dr. Layla Al-Hosani", role: "Head of Cardiology, SEHA", flag: "🇦🇪",
    industry: "Healthcare", stars: 5,
    avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=120&h=120&fit=crop&crop=face",
    text: "I needed a CV that reflected both my clinical excellence and leadership. Zenith delivered a world-class executive design that helped me secure my department head position.",
    highlight: "Department Head secured",
  },
  {
    name: "Claire Beaumont", role: "Private Banking Director, DIFC", flag: "🇬🇧",
    industry: "Finance", stars: 5,
    avatarUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=120&h=120&fit=crop&crop=face",
    text: "Relocated from London to DIFC and needed a CV for ultra-high-net-worth client management. The Executive Premium design opened doors at two of the top private banks in Dubai.",
    highlight: "DIFC role landed in 4 weeks",
  },
  {
    name: "Yousef Al-Qahtani", role: "Operations Director, Aramco", flag: "🇸🇦",
    industry: "Oil & Gas", stars: 5,
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face",
    text: "My previous CV kept me at the same level for three years. After Zenith rebuilt my profile, I was promoted internally and received an unsolicited offer at 35% uplift.",
    highlight: "+35% salary uplift",
  },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function waLink(msg: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function buildMailto(form: ContactForm): string {
  const subject = encodeURIComponent(`[${form.subject}] — from ${form.senderEmail}`);
  const body    = encodeURIComponent(
    `From: ${form.senderEmail}\n\n${form.message}\n\n---\nSent via Zenith Dubai CV website`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

// ─── FADE-IN WRAPPER ──────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
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

// ─── DARK TOGGLE ──────────────────────────────────────────────────────────────
function DarkToggle({ dark, onToggle }: { dark: boolean; onToggle: (v: boolean) => void }) {
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
      {dark ? <Sun size={15} color={GOLD} strokeWidth={2} /> : <Moon size={15} color={GOLD} strokeWidth={2} />}
    </button>
  );
}

// ─── EMAIL ICON BUTTON (mobile nav) ──────────────────────────────────────────
function EmailIconButton({ dark, onClick }: { dark: boolean; onClick: () => void }) {
  return (
    <button
      type="button" onClick={onClick} aria-label="Open contact form"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:opacity-80"
      style={{
        borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(212,175,55,0.50)",
        background:   dark ? "rgba(255,255,255,0.06)" : "rgba(212,175,55,0.08)",
      }}
    >
      <Mail size={15} color={GOLD} strokeWidth={2} />
    </button>
  );
}

// ─── CONTACT FORM MODAL ───────────────────────────────────────────────────────
function ContactModal({ open, onClose, dark }: { open: boolean; onClose: () => void; dark: boolean }) {
  const [form, setForm] = useState<ContactForm>({ senderEmail: "", subject: SUBJECT_OPTIONS[0], message: "" });
  const [sent, setSent] = useState(false);

  const border  = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const inputBg = dark ? "rgba(255,255,255,0.06)" : "#f9f7f2";
  const textHi  = dark ? "#ffffff"                : "#0f172a";
  const textSub = dark ? "#a1a1aa"                : "#64748b";
  const modalBg = dark ? "#0a0a0c"                : "#ffffff";

  const inputStyle: React.CSSProperties = { background: inputBg, borderColor: `${GOLD}40`, color: textHi, outline: "none" };

  function handleSend() {
    if (!form.senderEmail.trim() || !form.message.trim()) return;
    window.location.href = buildMailto(form);
    setSent(true);
  }
  function handleClose() {
    onClose();
    setTimeout(() => { setForm({ senderEmail: "", subject: SUBJECT_OPTIONS[0], message: "" }); setSent(false); }, 300);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div className="absolute inset-0 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} style={{ background: "rgba(0,0,0,0.75)" }} />
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl"
            initial={{ opacity: 0, scale: 0.94, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1,    y: 0,  filter: "blur(0px)" }}
            exit={{   opacity: 0, scale: 0.96,  y: 10, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: modalBg, borderColor: `${GOLD}50` }}
          >
            {/* Gold top bar */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${GOLD}, #f0d060, ${GOLD})` }} />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: border, background: dark ? `${GOLD}08` : `${GOLD}05` }}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}40` }}>
                  <Mail size={16} color={GOLD} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: textHi }}>Email Inquiry</p>
                  <p className="text-[11px]"        style={{ color: textSub }}>{CONTACT_EMAIL}</p>
                </div>
              </div>
              <button type="button" onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border transition hover:opacity-70"
                style={{ borderColor: border, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: textHi }}
                aria-label="Close">
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {sent ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: `${GOLD}18`, border: `2px solid ${GOLD}` }}>
                    <Send size={26} color={GOLD} />
                  </div>
                  <p className="text-lg font-bold" style={{ color: textHi }}>Email Client Opened!</p>
                  <p className="text-sm leading-6" style={{ color: textSub }}>
                    Your message has been pre-filled. Hit{" "}
                    <span style={{ color: GOLD }} className="font-semibold">Send</span> in your email app.
                  </p>
                  <button type="button" onClick={handleClose}
                    className="mt-2 inline-flex h-10 items-center rounded-full px-6 text-sm font-bold text-black transition hover:brightness-105"
                    style={{ background: GOLD }}>Done</button>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: textSub }}>Your Email Address</label>
                    <input type="email" placeholder="you@example.com" value={form.senderEmail}
                      onChange={(e) => setForm((f) => ({ ...f, senderEmail: e.target.value }))}
                      className="w-full rounded-xl border px-4 py-3 text-sm transition-all" style={{ ...inputStyle }}
                      onFocus={(e) => { (e.target as HTMLInputElement).style.boxShadow = `0 0 0 2px ${GOLD}50`; (e.target as HTMLInputElement).style.borderColor = GOLD; }}
                      onBlur={(e)  => { (e.target as HTMLInputElement).style.boxShadow = "none"; (e.target as HTMLInputElement).style.borderColor = `${GOLD}40`; }} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: textSub }}>Subject</label>
                    <select value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className="w-full rounded-xl border px-4 py-3 text-sm transition-all appearance-none cursor-pointer"
                      style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23D4AF37' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
                      onFocus={(e) => { (e.target as HTMLSelectElement).style.boxShadow = `0 0 0 2px ${GOLD}50`; (e.target as HTMLSelectElement).style.borderColor = GOLD; }}
                      onBlur={(e)  => { (e.target as HTMLSelectElement).style.boxShadow = "none"; (e.target as HTMLSelectElement).style.borderColor = `${GOLD}40`; }}>
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} style={{ background: dark ? "#0a0a0c" : "#fff", color: dark ? "#fff" : "#0f172a" }}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: textSub }}>Message</label>
                    <textarea rows={5} placeholder="Tell us about your background, target role, and how we can help…"
                      value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full rounded-xl border px-4 py-3 text-sm transition-all resize-none" style={{ ...inputStyle }}
                      onFocus={(e) => { (e.target as HTMLTextAreaElement).style.boxShadow = `0 0 0 2px ${GOLD}50`; (e.target as HTMLTextAreaElement).style.borderColor = GOLD; }}
                      onBlur={(e)  => { (e.target as HTMLTextAreaElement).style.boxShadow = "none"; (e.target as HTMLTextAreaElement).style.borderColor = `${GOLD}40`; }} />
                  </div>
                  <button type="button" onClick={handleSend}
                    disabled={!form.senderEmail.trim() || !form.message.trim()}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold text-black transition hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: GOLD, boxShadow: `0 0 0 1px rgba(212,175,55,0.35), 0 12px 40px rgba(212,175,55,0.22)` }}>
                    <Send size={15} strokeWidth={2.2} />
                    Send via Email Client
                  </button>
                  <p className="text-center text-[11px]" style={{ color: textSub }}>
                    Opens your email app with the message pre-filled — then hit Send.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────
export default function Home() {

  // ── Theme — default dark, localStorage persisted ───────────────────────────
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("zenith-theme");
    return saved !== null ? saved === "dark" : true;
  });
  const handleSetDark = (v: boolean) => { setDark(v); localStorage.setItem("zenith-theme", v ? "dark" : "light"); };

  // ── Contact modal ──────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const openModal  = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const bg      = dark ? "#050505"                : "#ffffff";
  const textHi  = dark ? "#ffffff"                : "#0f172a";
  const textSub = dark ? "#a1a1aa"                : "#64748b";
  const textMid = dark ? "#d4d4d8"                : "#374151";
  const border  = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const cardBg  = dark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardHov = dark ? "rgba(255,255,255,0.07)" : "#f8fafc";
  const navBg   = dark ? "rgba(5,5,5,0.88)"       : "rgba(255,255,255,0.92)";

  return (
    <div className="min-h-screen w-full font-sans transition-colors duration-300 relative" style={{ background: bg, color: textHi }}>

      {/* Gold ambient glow — dark mode only */}
      {dark && (
        <div className="pointer-events-none fixed inset-0 -z-10"
          style={{ background: "radial-gradient(800px 400px at 20% 10%, rgba(212,175,55,0.09), transparent 60%)" }} />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300"
        style={{ borderColor: border, background: navBg }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

          <div className="text-xl font-black tracking-tighter italic" style={{ color: textHi }}>
            DUBAI <span style={{ color: GOLD }}>CV</span> AGENCY
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["services","process","pricing","testimonials"].map((id) => (
              <a key={id} href={`#${id}`} style={{ color: textSub }}
                className="transition hover:opacity-70 capitalize">
                {id === "testimonials" ? "Reviews" : id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={openModal}
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition hover:opacity-80"
              style={{ borderColor: `${GOLD}50`, background: `${GOLD}0d`, color: GOLD }}>
              <Mail size={12} strokeWidth={2.2} />Contact Us
            </button>
            <div className="sm:hidden"><EmailIconButton dark={dark} onClick={openModal} /></div>
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
            <p className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs mb-8"
              style={{ borderColor: border, background: cardBg, color: textSub }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: GOLD }} />
              Dubai&apos;s Premium CV Agency — ATS + Cinematic Design
            </p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight" style={{ color: textHi }}>
              GET HIRED IN <span className="italic" style={{ color: GOLD }}>DUBAI.</span>
            </h1>
            <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: textSub }}>
              Professional CV writing and LinkedIn optimization tailored for the UAE&apos;s competitive job market.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
              <a href="#pricing"
                className="inline-flex h-12 items-center rounded-full px-8 text-sm font-bold text-black hover:brightness-105 transition"
                style={{ background: GOLD, boxShadow: `0 0 0 1px rgba(212,175,55,0.35), 0 16px 50px rgba(212,175,55,0.22)` }}>
                See Packages
              </a>
              <button type="button" onClick={openModal}
                className="inline-flex h-12 items-center gap-2 rounded-full border px-8 text-sm font-bold transition hover:brightness-105"
                style={{ borderColor: GOLD, background: `${GOLD}12`, color: GOLD, boxShadow: `0 0 0 1px ${GOLD}30` }}>
                <Mail size={15} strokeWidth={2} />Email Inquiry
              </button>
              <a href={waLink("Hi! I want to upgrade my CV. Help me choose the right package.")}
                target="_blank" rel="noreferrer"
                className="inline-flex h-12 items-center rounded-full border px-8 text-sm font-bold transition hover:opacity-80"
                style={{ borderColor: border, background: cardBg, color: textHi }}>
                Chat on WhatsApp
              </a>
            </div>
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            STATS
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-8 px-6 max-w-7xl mx-auto">
          <FadeIn>
            <div className="rounded-3xl border p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
              style={{ borderColor: border, background: cardBg }}>
              {[
                { stat: "99.9%", label: "ATS Pass Rate"  },
                { stat: "3×",    label: "More Callbacks" },
                { stat: "48h",   label: "First Draft"    },
                { stat: "6",     label: "GCC Markets"    },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <p className="text-3xl font-black" style={{ color: GOLD }}>{stat}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider" style={{ color: textSub }}>{label}</p>
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
              { icon: "📄", title: "ATS-Optimized CV",     body: "Reverse-engineered against UAE and GCC applicant tracking systems. Every keyword precision-coded to pass recruiter filters automatically." },
              { icon: "🎨", title: "Cinematic Design CV",  body: "A brand identity, not a document. Layouts that command attention and make hiring managers remember your name long after the interview." },
              { icon: "💼", title: "LinkedIn SEO Profile", body: "Full profile rewrite with keyword density mapped to your target roles across the GCC, Europe, and APAC markets." },
            ].map((s, i) => (
              <FadeIn key={s.title} delay={0.08 * i}>
                <div className="flex h-full flex-col rounded-3xl border p-6 transition-all hover:border-[#D4AF37]/40"
                  style={{ borderColor: border, background: cardBg }}>
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
                <div className="flex h-full flex-col rounded-3xl border p-6" style={{ borderColor: border, background: cardBg }}>
                  <p className="text-3xl font-black mb-3" style={{ color: GOLD }}>{s.step}</p>
                  <h3 className="text-base font-bold mb-2" style={{ color: textHi }}>{s.title}</h3>
                  <p className="text-sm leading-7" style={{ color: textSub }}>{s.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            PRICING — 179 / 299 / 449 AED
        ════════════════════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-16 px-6 max-w-7xl mx-auto">
          <FadeIn className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>Pricing</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight" style={{ color: textHi }}>Packages</h2>
            <p className="mt-2 text-sm" style={{ color: textSub }}>Transparent pricing. Global-ready results.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

            {/* Basic — 179 AED */}
            <FadeIn delay={0.00}>
              <div className="rounded-[40px] border p-12 flex flex-col justify-between shadow-sm transition-colors duration-300 hover:border-[#D4AF37]"
                style={{ borderColor: border, background: cardBg }}>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: textHi }}>Basic</h3>
                  <p className="mb-8 text-sm" style={{ color: textSub }}>Standard CV Update</p>
                  <p className="text-5xl font-black mb-4 tracking-tighter" style={{ color: textHi }}>
                    179 <span className="text-xl font-medium" style={{ color: textSub }}>AED</span>
                  </p>
                  <ul className="mb-10 space-y-2 text-sm" style={{ color: textMid }}>
                    {["ATS CV or Designed CV", "Cover Letter", "AI Photo Touch-up"].map((it) => (
                      <li key={it} className="flex gap-2 items-start">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GOLD }} />{it}
                      </li>
                    ))}
                  </ul>
                </div>
                <a href={PAYMENT_LINKS.basic} target="_blank" rel="noreferrer"
                  className="block w-full py-5 text-center rounded-2xl font-bold transition-all duration-300"
                  style={{ background: cardHov, color: textHi }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = GOLD; (e.currentTarget as HTMLAnchorElement).style.color = "#000"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = cardHov; (e.currentTarget as HTMLAnchorElement).style.color = textHi; }}>
                  Buy Now
                </a>
              </div>
            </FadeIn>

            {/* Professional — 299 AED */}
            <FadeIn delay={0.07}>
              <div className="rounded-[40px] border-2 p-12 flex flex-col justify-between relative scale-105 z-10 shadow-2xl"
                style={{ borderColor: GOLD, background: dark ? "rgba(212,175,55,0.07)" : "#fffdf5" }}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest text-black"
                  style={{ background: GOLD }}>Most Popular</div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: textHi }}>Professional</h3>
                  <p className="mb-8 text-sm" style={{ color: textSub }}>CV + Cover Letter</p>
                  <p className="text-5xl font-black mb-4 tracking-tighter" style={{ color: textHi }}>
                    299 <span className="text-xl font-medium" style={{ color: textSub }}>AED</span>
                  </p>
                  <ul className="mb-10 space-y-2 text-sm" style={{ color: textMid }}>
                    {["Both CV types (ATS + Cinematic)", "LinkedIn SEO Optimization", "Career E-book", "EN, FR, DE, AR versions"].map((it) => (
                      <li key={it} className="flex gap-2 items-start">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GOLD }} />{it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <a href={PAYMENT_LINKS.professional} target="_blank" rel="noreferrer"
                    className="block w-full py-5 text-center rounded-2xl font-bold text-black hover:brightness-105 transition-all duration-300 shadow-xl"
                    style={{ background: GOLD, boxShadow: `0 0 0 1px rgba(212,175,55,0.35), 0 18px 60px rgba(212,175,55,0.22)` }}>
                    Buy with Apple Pay
                  </a>
                  <p className="mt-2 text-center text-[11px]" style={{ color: textSub }}>Secure payment via Stripe</p>
                </div>
              </div>
            </FadeIn>

            {/* Ultimate — 449 AED */}
            <FadeIn delay={0.14}>
              <div className="rounded-[40px] border p-12 flex flex-col justify-between shadow-sm transition-colors duration-300 hover:border-[#D4AF37]"
                style={{ borderColor: border, background: cardBg }}>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: textHi }}>Ultimate</h3>
                  <p className="mb-8 text-sm" style={{ color: textSub }}>Full Career Branding</p>
                  <p className="text-5xl font-black mb-4 tracking-tighter" style={{ color: textHi }}>
                    449 <span className="text-xl font-medium" style={{ color: textSub }}>AED</span>
                  </p>
                  <ul className="mb-10 space-y-2 text-sm" style={{ color: textMid }}>
                    {["Everything in Professional", "1hr Interview Coaching", "Experience Consultation", "30-day VIP Support"].map((it) => (
                      <li key={it} className="flex gap-2 items-start">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GOLD }} />{it}
                      </li>
                    ))}
                  </ul>
                </div>
                <a href={PAYMENT_LINKS.ultimate} target="_blank" rel="noreferrer"
                  className="block w-full py-5 text-center rounded-2xl font-bold transition-all duration-300"
                  style={{ background: cardHov, color: textHi }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = GOLD; (e.currentTarget as HTMLAnchorElement).style.color = "#000"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = cardHov; (e.currentTarget as HTMLAnchorElement).style.color = textHi; }}>
                  Buy Now
                </a>
              </div>
            </FadeIn>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            TESTIMONIALS
            — Vertical animated 3-column marquee via TestimonialsColumns
            — dark prop flows in so cards invert instantly with the toggle
            — mask-image fades cards at top/bottom edges (premium effect)
            — Mobile: single column; Desktop (lg+): 3 columns
        ════════════════════════════════════════════════════════════════════ */}
        <TestimonialsColumns
          testimonials={TESTIMONIALS}
          dark={dark}
          columns={3}
          speed={40}
        />

        {/* ════════════════════════════════════════════════════════════════════
            FINAL CTA
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 px-6 max-w-4xl mx-auto text-center">
          <FadeIn>
            <div className="rounded-3xl border border-[#D4AF37]/25 p-10 sm:p-14"
              style={{ background: dark ? "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(212,175,55,0.10), transparent 60%)" : "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(212,175,55,0.07), transparent 60%)" }}>
              <h2 className="text-3xl font-black tracking-tight" style={{ color: textHi }}>Your Dream Role Is One CV Away</h2>
              <p className="mt-4 text-base" style={{ color: textSub }}>Join 200+ professionals who landed roles across the GCC, Europe, and APAC.</p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href={waLink("Hi! I am ready to get started. Help me choose the right CV package.")}
                  target="_blank" rel="noreferrer"
                  className="inline-flex h-12 items-center rounded-full px-8 text-sm font-bold text-black hover:brightness-105 transition"
                  style={{ background: GOLD, boxShadow: `0 0 0 1px rgba(212,175,55,0.40), 0 18px 60px rgba(212,175,55,0.26)` }}>
                  Get Started on WhatsApp
                </a>
                <button type="button" onClick={openModal}
                  className="inline-flex h-12 items-center gap-2 rounded-full border px-8 text-sm font-bold transition hover:brightness-105"
                  style={{ borderColor: GOLD, background: `${GOLD}12`, color: GOLD }}>
                  <Mail size={15} strokeWidth={2} />Email Inquiry
                </button>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════════════════════════════ */}
        <footer className="py-16 border-t text-center" style={{ borderColor: border }}>
          <p className="text-sm font-medium tracking-widest uppercase" style={{ color: textSub }}>
            © {new Date().getFullYear()} Dubai CV Agency. Premium Careers.
          </p>
          <p className="mt-2 text-xs" style={{ color: dark ? "#52525b" : "#9ca3af" }}>
            Based in Dubai. Serving the World. — ATS + Cinematic Design
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
            <button type="button" onClick={openModal}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold transition hover:opacity-80"
              style={{ borderColor: `${GOLD}50`, background: `${GOLD}0d`, color: GOLD }}>
              <Mail size={13} strokeWidth={2.2} />{CONTACT_EMAIL}
            </button>
            <a href={waLink("Hi! I want to upgrade my CV. Help me choose the right package.")}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold transition hover:opacity-80"
              style={{ borderColor: "rgba(37,211,102,0.40)", background: "rgba(37,211,102,0.07)", color: "#25D366" }}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
                <path d="M12 22a10 10 0 0 0 8.66-15 10 10 0 0 0-16.9 10.6L3 22l4.56-.7A10 10 0 0 0 12 22Z" stroke="#25D366" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M9.35 8.9c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3.1.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.2-.2-.3-.5-.4l-1.9-.9c-.2-.1-.4-.1-.6.1-.2.2-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.5c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.5l-.8-2Z" fill="#25D366" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </footer>

      </main>

      {/* ════════════════════════════════════════════════════════════════════════
          FLOATING BUTTONS
      ════════════════════════════════════════════════════════════════════════ */}
      <button type="button" onClick={openModal} aria-label="Open email contact form" title={CONTACT_EMAIL}
        className="fixed bottom-28 right-10 w-14 h-14 rounded-full hover:scale-110 transition-transform z-50 flex items-center justify-center"
        style={{ background: GOLD, boxShadow: `0 8px 32px rgba(212,175,55,0.40)` }}>
        <Mail size={22} color="#000" strokeWidth={2.2} />
      </button>

      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in your CV packages!")}`}
        target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        className="fixed bottom-10 right-10 w-14 h-14 rounded-full hover:scale-110 transition-transform z-50 flex items-center justify-center"
        style={{ background: "#25D366", boxShadow: "0 10px 40px rgba(37,211,102,0.4)" }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <path d="M12 22a10 10 0 0 0 8.66-15 10 10 0 0 0-16.9 10.6L3 22l4.56-.7A10 10 0 0 0 12 22Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9.35 8.9c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3.1.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.2-.2-.3-.5-.4l-1.9-.9c-.2-.1-.4-.1-.6.1-.2.2-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.5c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.5l-.8-2Z" fill="white" />
        </svg>
      </a>

      <ContactModal open={modalOpen} onClose={closeModal} dark={dark} />
    </div>
  );
}