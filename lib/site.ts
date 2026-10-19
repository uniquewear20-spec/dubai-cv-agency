// lib/site.ts — shared constants and small helpers for the whole site (client-safe).

export type Lang = "en" | "fr" | "ar";
export type L10n = Record<Lang, string>;

export const SITE_URL = "https://zenithdubaicv.com";
export const BRAND_NAME = "Zenith Dubai CV";
export const CONTACT_EMAIL = "info@zenithdubaicv.com";
export const WHATSAPP_NUMBER = "971502879462";

export const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "ar", label: "ع", name: "العربية" },
];

export const isRtl = (l: Lang): boolean => l === "ar";
export const pick = (v: L10n, l: Lang): string => v[l] ?? v.en;
export const isLang = (v: unknown): v is Lang => v === "en" || v === "fr" || v === "ar";

export const waLink = (message: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const SOCIAL_LINKS = [
  { id: "linkedin", name: "LinkedIn", href: "https://www.linkedin.com/company/zenith-dubai-uae" },
  { id: "instagram", name: "Instagram", href: "https://www.instagram.com/zenithdubaicv" },
  { id: "facebook", name: "Facebook", href: "https://www.facebook.com/profile.php?id=61576464566311" },
  { id: "x", name: "X", href: "https://x.com/ZenithDubai_CV" },
  { id: "tiktok", name: "TikTok", href: "https://tiktok.com/@zenithdubai" },
  { id: "youtube", name: "YouTube", href: "https://www.youtube.com/@ZenithDUBAI" },
] as const;

/** The Global Horizon ebook. Sold on its own on Gumroad; included with packages 2, 3 and 4. */
export const EBOOK = {
  title: "The Global Horizon",
  subtitle: "The Executive Playbook",
  fullTitle:
    "The Global Horizon: The Executive Playbook for Securing High-Value Careers Across the Middle East, Europe, Canada, UK, USA, and Singapore",
  cover: "/images/the-global-horizon.webp",
  coverWidth: 800,
  coverHeight: 442,
  /** Public Gumroad product page (verified 19 Oct 2026). */
  gumroadUrl: "https://zenithdubaicv.gumroad.com/l/sjhxo",
} as const;
