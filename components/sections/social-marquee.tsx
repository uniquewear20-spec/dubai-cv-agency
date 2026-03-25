"use client";

import { Marquee } from "@/components/ui/marquee"; // adjust path if needed

// ── Brand gold (matches page.tsx) ────────────────────────────────────────────
const G = "#C8A96E";

// ── Social platform data ──────────────────────────────────────────────────────
const PLATFORMS = [
  {
    name: "Google",
    handle: "5.0 · 7,000+ reviews",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    name: "Trustpilot",
    handle: "Excellent · 4.9",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#00B67A">
        <path d="M12 2l2.9 8.9H23l-7 5.1 2.7 8.2L12 19l-6.7 5.2 2.7-8.2-7-5.1h8.1z"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    handle: "Top Career Service",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    handle: "@zenithdubaicv",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="url(#ig-grad)">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F58529"/>
            <stop offset="50%" stopColor="#DD2A7B"/>
            <stop offset="100%" stopColor="#8134AF"/>
          </linearGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    handle: "@zenithdubaicv",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    handle: "+971 50 287 9462",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface SocialMarqueeProps {
  dark?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function SocialMarquee({ dark = true }: SocialMarqueeProps) {
  // Resolved design tokens — all transitions match the site's 0.7s ease
  const cardBg     = dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)";
  const cardBorder = dark ? "rgba(200,169,110,0.10)"  : "rgba(0,0,0,0.08)";
  const labelColor = dark ? G                          : "#1A1410";
  const handleColor= dark ? "rgba(200,169,110,0.45)"  : "rgba(26,20,16,0.45)";
  const sectionBorder = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const transition = "background 0.7s ease, border-color 0.7s ease, color 0.7s ease, box-shadow 0.7s ease";

  const cards = PLATFORMS.map((p) => (
    <div
      key={p.name}
      className="flex items-center gap-3 rounded-2xl px-5 py-3 shrink-0"
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        transition,
        // Subtle gold glow on dark, none on light
        boxShadow: dark ? `0 0 0 0.5px rgba(200,169,110,0.06) inset` : "none",
      }}
    >
      {/* Icon wrapper */}
      <div
        className="flex items-center justify-center h-9 w-9 rounded-xl shrink-0"
        style={{
          background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          border: `1px solid ${cardBorder}`,
          color: dark ? G : "#1A1410",
          transition,
        }}
      >
        {p.icon}
      </div>

      {/* Text */}
      <div>
        <p
          className="text-[11px] font-semibold leading-none mb-1"
          style={{ color: labelColor, fontFamily: "sans-serif", transition }}
        >
          {p.name}
        </p>
        <p
          className="text-[9px] leading-none"
          style={{ color: handleColor, fontFamily: "sans-serif", transition }}
        >
          {p.handle}
        </p>
      </div>
    </div>
  ));

  return (
    <section
      className="py-16"
      style={{
        borderTop: `1px solid ${sectionBorder}`,
        borderBottom: `1px solid ${sectionBorder}`,
        transition,
      }}
    >
      <Marquee speed={32} gap={16} dark={dark} pauseOnHover>
        {cards}
      </Marquee>
    </section>
  );
}

export default SocialMarquee;