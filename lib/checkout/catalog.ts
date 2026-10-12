// lib/checkout/catalog.ts
// Single source of truth for everything that can be bought on the site.
// All prices are whole AED. The checkout route charges from this file only —
// amounts sent by the browser are never used.

export type Lang = "en" | "ar" | "fr";

export const BRAND = "Zenith Dubai CV";
export const CHARGE_CURRENCY = "aed";

// ── Tiers ────────────────────────────────────────────────────────────────────
export type TierKey = "foundation" | "growth" | "executive" | "apex";

export const TIERS: Record<TierKey, { name: string; price: number }> = {
  foundation: { name: "Foundation", price: 179 },
  growth:     { name: "Growth",     price: 299 },
  executive:  { name: "Executive",  price: 449 },
  apex:       { name: "Apex",       price: 899 },
};

export const isTierKey = (v: unknown): v is TierKey =>
  typeof v === "string" && Object.prototype.hasOwnProperty.call(TIERS, v);

// ── Package builder services ─────────────────────────────────────────────────
export interface Service {
  id: string;
  name: string;      // English name, used on the Stripe payment page
  labelKey: string;  // translation key in CustomPackageBuilder
  price: number;
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
  { id: "branding",     name: "Portfolio / Personal Branding Kit", labelKey: "svcBranding", price: 149, category: "digital" },
];

// ── Quick bundles ────────────────────────────────────────────────────────────
export interface Preset {
  id: string;
  name: string;      // English name, used on the Stripe payment page
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
