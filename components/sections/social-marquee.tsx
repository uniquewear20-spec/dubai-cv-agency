"use client";

import { useRef, useState } from "react";
import { Marquee } from "@/components/ui/marquee";

// ── Brand tokens (matches Zenith page.tsx exactly) ─────────────────────────────
const G   = "#C8A96E";
const GL  = "#E2C98E";
const INK = "#0A0907";
const ASH = "#F7F3EE";

// ── Social platform data (exported so page.tsx can render the links strip) ────
export const SOCIALS = [
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
  },
  {
    id: "tiktok",
    name: "TikTok",
    handle: "@zenithdubaicv",
    tagline: "Career transformation, documented",
    href: "https://tiktok.com/@zenithdubai?_r=1&_t=ZS-94z6PW9xSm9",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.27 8.27 0 0 0 4.83 1.56V6.79a4.85 4.85 0 0 1-1.07-.1z"/>
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    handle: "@ZenithDUBAI",
    tagline: "Executive career strategy & insights",
    href: "https://www.youtube.com/@ZenithDUBAI",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

// ── Card ───────────────────────────────────────────────────────────────────────
function SocialCard({ s, dark }: { s: typeof SOCIALS[0]; dark: boolean }) {
  const [hovered, setHovered] = useState(false);

  const cardBg = dark
    ? hovered
      ? "linear-gradient(135deg, rgba(200,169,110,0.09) 0%, rgba(255,255,255,0.04) 100%)"
      : "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)"
    : hovered
      ? "linear-gradient(135deg, rgba(200,169,110,0.10) 0%, rgba(255,255,255,0.70) 100%)"
      : "linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.55) 100%)";

  const cardBorder = dark
    ? hovered ? `1px solid ${G}55` : "1px solid rgba(255,255,255,0.07)"
    : hovered ? `1px solid ${G}55` : "1px solid rgba(0,0,0,0.08)";

  const cardShadow = dark
    ? hovered
      ? `0 0 0 1px ${G}20, 0 12px 48px rgba(200,169,110,0.12), 0 4px 16px rgba(0,0,0,0.40)`
      : "0 4px 24px rgba(0,0,0,0.30)"
    : hovered
      ? `0 0 0 1px ${G}20, 0 12px 48px rgba(200,169,110,0.10), 0 4px 16px rgba(0,0,0,0.08)`
      : "0 2px 12px rgba(0,0,0,0.06)";

  const nameColor    = dark ? (hovered ? GL : "#D8D0C8") : (hovered ? G : "#1A1410");
  const taglineColor = dark ? "rgba(200,185,170,0.55)" : "rgba(26,20,16,0.40)";
  const iconBg       = hovered ? `linear-gradient(135deg, ${G}22, ${G}0A)` : (dark ? `${G}10` : `${G}08`);
  const iconBorder   = `1px solid ${G}${hovered ? "35" : "18"}`;
  const iconColor    = dark ? GL : (hovered ? G : "#5A4E44");

  const transition = "transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease, border-color 0.3s ease, background 0.7s ease, color 0.7s ease";

  return (
    <a
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
        background: cardBg,
        border: cardBorder,
        boxShadow: cardShadow,
        transform: hovered ? "translateY(-4px) scale(1.015)" : "translateY(0) scale(1)",
        transition,
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
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: iconBg,
            border: iconBorder,
            color: iconColor,
            boxShadow: hovered ? `0 0 20px ${G}25` : "none",
            transition: "all 0.35s ease",
          }}
        >
          {s.icon}
        </div>

        <div>
          <p
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "13px",
              fontWeight: 600,
              color: nameColor,
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
          color: taglineColor,
          fontWeight: 300,
          margin: 0,
          fontStyle: "italic",
          transition: "color 0.7s ease",
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
        <div style={{ width: "16px", height: "1px", background: G }} />
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
interface SocialMarqueeProps {
  dark?: boolean;
}

export function SocialMarquee({ dark = true }: SocialMarqueeProps) {
  const sectionBg     = dark ? INK : ASH;
  const headlineColor = dark ? "#EDE8E0" : "#1A1410";
  const subColor      = dark ? "rgba(180,165,148,0.70)" : "rgba(26,20,16,0.50)";
  const topRule       = dark
    ? `linear-gradient(90deg, transparent 0%, ${G}30 20%, ${G}60 50%, ${G}30 80%, transparent 100%)`
    : `linear-gradient(90deg, transparent 0%, ${G}20 20%, ${G}45 50%, ${G}20 80%, transparent 100%)`;
  const bottomRule    = dark
    ? `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`
    : `linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.06) 50%, transparent 100%)`;

  const transition = "background 0.7s ease, color 0.7s ease";

  return (
    <section
      style={{
        position: "relative",
        background: sectionBg,
        overflow: "hidden",
        paddingTop: "100px",
        paddingBottom: "100px",
        transition,
      }}
    >
      {/* Grain texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: dark ? 0.025 : 0.018,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
          transition,
        }}
      />

      {/* Ambient top glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "280px",
          background: `radial-gradient(ellipse at 50% 0%, ${G}${dark ? "09" : "06"}, transparent 70%)`,
          pointerEvents: "none",
          transition,
        }}
      />

      {/* Top rule */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "1px",
          background: topRule,
          transition,
        }}
      />

      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "56px", padding: "0 24px" }}>
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

        <h2
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 46px)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: headlineColor,
            margin: "0 auto 16px",
            maxWidth: "560px",
            transition,
          }}
        >
          Where the Conversation{" "}
          <em style={{ fontStyle: "italic", color: G }}>Begins.</em>
        </h2>

        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "14px",
            lineHeight: 1.9,
            fontWeight: 300,
            color: subColor,
            maxWidth: "400px",
            margin: "0 auto",
            transition,
          }}
        >
          Follow our channels for executive career intelligence, market insights, and client transformations — delivered daily.
        </p>

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

      {/* Marquee */}
      <Marquee speed={32} pauseOnHover fade gap={20} dark={dark} className="pb-5">
        {SOCIALS.map((s) => (
          <SocialCard key={s.id} s={s} dark={dark} />
        ))}
      </Marquee>

      {/* Bottom rule */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "1px",
          background: bottomRule,
          transition,
        }}
      />
    </section>
  );
}

export default SocialMarquee;