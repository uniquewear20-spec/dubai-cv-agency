// lib/checkout/catalog.ts
// Single source of truth for everything that can be bought on the site.
// List prices are whole AED. PayPal cannot charge in AED, so every payment is
// charged in USD at the official AED peg (see aedToUsd). The checkout route
// charges from this file only — amounts sent by the browser are never used.

export type Lang = "en" | "ar" | "fr";

export const BRAND = "Zenith Dubai CV";

// ── Charging currency ────────────────────────────────────────────────────────
// The UAE dirham is pegged to the US dollar at 3.6725 AED = 1 USD.
export const CHARGE_CURRENCY = "USD";
export const AED_PER_USD = 3.6725;

// AED list price → USD amount string for PayPal, e.g. 299 → "81.42".
export function aedToUsd(aed: number): string {
  return (Math.round((aed / AED_PER_USD) * 100) / 100).toFixed(2);
}

// ── Packages ─────────────────────────────────────────────────────────────────
// The four packages. The keys are the original tier ids, kept so that order
// references created before the rename still decode. Names are shown on the
// PayPal page and in order emails; the site's copy lives in lib/packages.ts.
export type TierKey = "foundation" | "growth" | "executive" | "apex";

export const TIERS: Record<TierKey, { name: string; price: number }> = {
  foundation: { name: "CV Essentials",          price: 179 },
  growth:     { name: "Career Advantage",       price: 299 },
  executive:  { name: "Career Automation",      price: 449 },
  apex:       { name: "Executive Career Suite", price: 899 },
};

/** Packages that include The Global Horizon ebook (packages 2, 3 and 4). */
export const EBOOK_TIERS: readonly TierKey[] = ["growth", "executive", "apex"];
/** Packages that include Pro access to the Zenith AI job agent (sending for you; AI drafting when switched on). */
export const AI_TIERS: readonly TierKey[] = ["executive", "apex"];
/** Packages that include the agent's interview coach (packages 2, 3 and 4). */
export const COACH_TIERS: readonly TierKey[] = ["growth", "executive", "apex"];

export const isTierKey = (v: unknown): v is TierKey =>
  typeof v === "string" && Object.prototype.hasOwnProperty.call(TIERS, v);

// ── Package builder services ─────────────────────────────────────────────────
export interface Service {
  id: string;
  name: string;      // English name, shown on the PayPal payment page
  labelKey: string;  // translation key in CustomPackageBuilder
  price: number;     // AED
  category: "document" | "digital" | "coaching" | "applications";
  noteKey?: string;
}

export const SERVICES: Service[] = [
  { id: "cv-ats",       name: "CV Writing (ATS Optimised)",        labelKey: "svcCvAts",    price: 149, category: "document" },
  { id: "cv-design",    name: "Executive CV Design",               labelKey: "svcCvDesign", price: 99,  category: "document" },
  { id: "cover-letter", name: "Cover Letter",                      labelKey: "svcCover",    price: 79,  category: "document" },
  { id: "linkedin",     name: "LinkedIn Makeover",                 labelKey: "svcLinkedin", price: 149, category: "digital" },
  { id: "apps-5",       name: "Job Applications (5)",              labelKey: "svcApps5",    price: 79,  category: "applications", noteKey: "noteTailored" },
  { id: "apps-10",      name: "Job Applications (10)",             labelKey: "svcApps10",   price: 119, category: "applications", noteKey: "notePopular" },
  { id: "apps-30",      name: "Job Applications (30)",             labelKey: "svcApps30",   price: 199, category: "applications", noteKey: "noteCampaign" },
  { id: "coaching",     name: "Interview Coaching (60 min)",       labelKey: "svcCoaching", price: 199, category: "coaching" },
  { id: "strategy",     name: "Career Strategy Session",           labelKey: "svcStrategy", price: 149, category: "coaching" },
  { id: "branding",     name: "Portfolio / Personal Branding Kit", labelKey: "svcBranding", price: 300, category: "digital" },
];

// ── Quick bundles ────────────────────────────────────────────────────────────
export interface Preset {
  id: string;
  name: string;      // English name, shown on the PayPal payment page
  labelKey: string;
  tagKey: string;
  ids: string[];
}

export const PRESETS: Preset[] = [
  { id: "job-hunter",     name: "Job Hunter",     labelKey: "preJobHunter", tagKey: "preJobTag",     ids: ["cv-ats", "cover-letter", "apps-10"] },
  { id: "international",  name: "International",  labelKey: "preIntl",      tagKey: "preIntlTag",    ids: ["cv-ats", "linkedin", "cv-design"] },
  { id: "career-upgrade", name: "Career Upgrade", labelKey: "preUpgrade",   tagKey: "preUpgradeTag", ids: ["cv-ats", "linkedin", "coaching"] },
];

// ── Bundle discounts ─────────────────────────────────────────────────────────
export function getDiscount(count: number): number {
  if (count >= 4) return 0.20;
  if (count === 3) return 0.15;
  if (count === 2) return 0.10;
  return 0;
}

export interface PackageQuote {
  services: Service[];   // in catalog order
  subtotal: number;
  discount: number;      // 0, 0.10, 0.15 or 0.20
  savings: number;
  total: number;         // whole AED
}

// The one place a package total is worked out — used by the builder UI and the
// checkout route, so what the visitor sees is exactly what is charged.
// Unknown ids are ignored here; the route rejects them before calling this.
export function quotePackage(ids: Iterable<string>): PackageQuote {
  const wanted = new Set(ids);
  const services = SERVICES.filter(s => wanted.has(s.id));
  const subtotal = services.reduce((acc, s) => acc + s.price, 0);
  const discount = getDiscount(services.length);
  const savings = Math.round(subtotal * discount);
  return { services, subtotal, discount, savings, total: subtotal - savings };
}

// Returns the quick bundle whose items are exactly the given ids, if any.
export function matchPreset(ids: string[]): Preset | undefined {
  const set = new Set(ids);
  return PRESETS.find(p => p.ids.length === set.size && p.ids.every(id => set.has(id)));
}

// ── Order details stored on the PayPal order ─────────────────────────────────
// PayPal orders have no free-form metadata, so what was bought is packed into
// purchase_units[0].custom_id (max 255 chars), e.g.
//   "ref=ZN-7K2QXM;lang=en;tier=growth;aed=299"
//   "ref=ZN-7K2QXM;lang=fr;items=cv-ats,linkedin;bundle=international;aed=372"
export interface OrderMeta {
  ref: string;
  lang: Lang;
  aed: number;
  tier?: TierKey;
  items?: string[];
  bundle?: string;
}

export function encodeOrderMeta(m: OrderMeta): string {
  const parts = [`ref=${m.ref}`, `lang=${m.lang}`];
  if (m.tier) parts.push(`tier=${m.tier}`);
  if (m.items?.length) parts.push(`items=${m.items.join(",")}`);
  if (m.bundle) parts.push(`bundle=${m.bundle}`);
  parts.push(`aed=${m.aed}`);
  return parts.join(";");
}

export function decodeOrderMeta(raw: string | undefined | null): OrderMeta | null {
  if (!raw) return null;
  const map = new Map<string, string>();
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i > 0) map.set(part.slice(0, i), part.slice(i + 1));
  }
  const ref = map.get("ref");
  if (!ref || !/^ZN-[A-Z0-9]{4,12}$/.test(ref)) return null;
  const langRaw = map.get("lang");
  const lang: Lang = langRaw === "fr" || langRaw === "ar" ? langRaw : "en";
  const aed = Number(map.get("aed"));
  const tierRaw = map.get("tier");
  const known = new Set(SERVICES.map(s => s.id));
  const items = (map.get("items") ?? "").split(",").filter(id => known.has(id));
  const bundleRaw = map.get("bundle");
  return {
    ref,
    lang,
    aed: Number.isFinite(aed) && aed > 0 ? aed : 0,
    ...(isTierKey(tierRaw) ? { tier: tierRaw } : {}),
    ...(items.length ? { items } : {}),
    ...(bundleRaw && PRESETS.some(p => p.id === bundleRaw) ? { bundle: bundleRaw } : {}),
  };
}
