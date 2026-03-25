"use client";

import { useRef, useEffect, useState } from "react";
import { Marquee } from "@/components/ui/marquee";

// ── Brand tokens (matches Zenith page.tsx exactly) ─────────────────────────────
const G  = "#C8A96E";   // gold
const GL = "#E2C98E";   // gold light
const INK = "#0A0907";  // near-black

// ── Social platform data ───────────────────────────────────────────────────────
// SVG icons are inlined so there is no dependency on specific lucide versions
// that may or may not include every brand icon.
const SOCIALS = [
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "@zenithdubaicv",
    tagline: "Executive positioning, global reach",
    href: "https://www.linkedin.com/company/zenith-dubai-uae",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    colorAccent: "#0A66C2",
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@zenith.dubai.cv",
    tagline: "Behind the craft, beyond the CV",
    href: "https://www.instagram.com/zenithdubaicv?igsh=ZG84NWttZjA3dTkx&utm_source=qr",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
    colorAccent: "#E1306C",
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "Zenith Dubai CV",
    tagline: "Community of global professionals",
    href: "https://www.facebook.com/profile.php?id=61576464566311",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    colorAccent: "#1877F2",
  },
  {
    id: "x",
    name: "X (Twitter)",
    handle: "@zenithdubaicv",
    tagline: "Insights from the executive frontier",
    href: "https://x.com/ZenithDubai_CV",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    colorAccent: "#E7E7E7",
  },
  {
    id: "tiktok",
    name: "TikTok",
    handle: "@zenithdubaicv",
    tagline: "Career transformation, documented",
    href: "tiktok.com/@zenithdubai?_r=1&_t=ZS-94z6PW9xSm9",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.27 8.27 0 0 0 4.83 1.56V6.79a4.85 4.85 0 0 1-1.07-.1z"/>
      </svg>
    ),
    colorAccent: "#69C9D0",
  },
];

// ── Glow card for each social platform ────────────────────────────────────────
function SocialCard({ s }: { s: typeof SOCIALS[0] }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <a
      ref={ref}
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "clamp(200px, 22vw, 280px)",
        flexShrink: 0,
        padding: "28px 28px 24px",
        borderRadius: "20px",
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        // Glass card
        background: hovered
          ? "linear-gradient(135deg, rgba(200,169,110,0.09) 0%, rgba(255,255,255,0.04) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
        border: hovered
          ? `1px solid ${G}55`
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hovered
          ? `0 0 0 1px ${G}20, 0 12px 48px rgba(200,169,110,0.12), 0 4px 16px rgba(0,0,0,0.40)`
          : "0 4px 24px rgba(0,0,0,0.30)",
        transform: hovered ? "translateY(-4px) scale(1.015)" : "translateY(0) scale(1)",
        transition:
          "transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease, border-color 0.3s ease, background 0.3s ease",
        minHeight: "160px",
      }}
    >
      {/* Ambient top-edge shimmer */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${G}${hovered ? "55" : "30"}, transparent)`,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Icon + platform name row */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
        {/* Icon halo */}
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: hovered
              ? `linear-gradient(135deg, ${G}22, ${G}0A)`
              : `${G}10`,
            border: `1px solid ${G}${hovered ? "35" : "18"}`,
            color: GL,
            boxShadow: hovered ? `0 0 20px ${G}25` : "none",
            transition: "all 0.35s ease",
          }}
        >
          {s.icon}
        </div>

        {/* Name + handle */}
        <div>
          <p
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "13px",
              fontWeight: 600,
              color: hovered ? GL : "#D8D0C8",
              letterSpacing: "0.02em",
              lineHeight: 1.2,
              transition: "color 0.3s ease",
              margin: 0,
            }}
          >
            {s.name}
          </p>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "10px",
              color: `${G}80`,
              letterSpacing: "0.06em",
              marginTop: "2px",
              margin: "2px 0 0",
            }}
          >
            {s.handle}
          </p>
        </div>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontFamily: "sans-serif",
          fontSize: "11px",
          lineHeight: "1.7",
          color: "rgba(200,185,170,0.55)",
          fontWeight: 300,
          margin: 0,
          fontStyle: "italic",
        }}
      >
        {s.tagline}
      </p>

      {/* Bottom "Follow" prompt */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "18px",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.3s ease, transform 0.35s ease",
        }}
      >
        <div
          style={{
            width: "16px",
            height: "1px",
            background: G,
          }}
        />
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: G,
            fontWeight: 500,
          }}
        >
          Follow
        </span>
      </div>
    </a>
  );
}

// ── Main section export ────────────────────────────────────────────────────────
export function SocialMarquee() {
  return (
    <section
      style={{
        position: "relative",
        background: INK,
        overflow: "hidden",
        paddingTop: "100px",
        paddingBottom: "100px",
      }}
    >
      {/* Grain texture overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.025,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }}
      />

      {/* Ambient top radial glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "280px",
          background: `radial-gradient(ellipse at 50% 0%, ${G}09, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Horizontal rule top */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          inset: "0 0 auto",
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${G}30 20%, ${G}60 50%, ${G}30 80%, transparent 100%)`,
        }}
      />

      {/* Section header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "56px",
          padding: "0 24px",
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: G,
            marginBottom: "16px",
          }}
        >
          Our Presence
        </p>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 46px)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "#EDE8E0",
            margin: "0 auto 16px",
            maxWidth: "560px",
          }}
        >
          Where the Conversation{" "}
          <em style={{ fontStyle: "italic", color: G }}>Begins.</em>
        </h2>

        {/* Subheading */}
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "14px",
            lineHeight: 1.9,
            fontWeight: 300,
            color: "rgba(180,165,148,0.70)",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          Follow our channels for executive career intelligence, market insights, and client transformations — delivered daily.
        </p>

        {/* Gold rule */}
        <div
          style={{
            width: "32px",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${G}, transparent)`,
            margin: "28px auto 0",
            boxShadow: `0 0 8px ${G}50`,
          }}
        />
      </div>

      {/* ── Marquee row 1 — left to right ──────────────────────────────────── */}
      <Marquee
        speed={32}
        pauseOnHover
        fade
        gap={20}
        // style={{ paddingBottom: "20px" } as React.CSSProperties}
        className="pb-5" // استخدمنا كلاس Tailwind بدلاً من style
      >
        {SOCIALS.map((s) => (
          <SocialCard key={s.id} s={s} />
        ))}
      </Marquee>

      {/* ── Marquee row 2 — right to left (reverse) ────────────────────────── */}
      <div style={{ marginTop: "20px" }}>
        <Marquee speed={28} pauseOnHover reverse fade gap={20}>
          {[...SOCIALS].reverse().map((s) => (
            <SocialCard key={s.id + "-r"} s={s} />
          ))}
        </Marquee>
      </div>

      {/* Bottom CTA strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px",
          marginTop: "60px",
          padding: "0 24px",
          flexWrap: "wrap",
        }}
      >
        {SOCIALS.map((s) => (
          <a
            key={s.id + "-dot"}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={s.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              color: `${G}55`,
              fontFamily: "sans-serif",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              transition: "color 0.25s ease",
              padding: "4px 0",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = GL;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = `${G}55`;
            }}
          >
            <span style={{ color: "inherit", display: "flex" }}>{s.icon}</span>
            {s.name}
          </a>
        ))}
      </div>

      {/* Bottom rule */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          inset: "auto 0 0",
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
        }}
      />
    </section>
  );
}

export default SocialMarquee;