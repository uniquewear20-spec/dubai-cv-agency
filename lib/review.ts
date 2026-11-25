// lib/review.ts — shared by the review form (/review/) and its API route.
// The consent wording is versioned: the exact text the client agreed to is emailed with every
// submission so there is a record of what was consented to, and when.

import type { L10n } from "@/lib/site";

export const CONSENT_VERSION = "2026-11-25";

export const CONSENT_TEXT: L10n = {
  en: "Zenith Dubai may publish this statement on its website and social media, shown the way I chose above. I can withdraw this consent at any time by emailing info@zenithdubaicv.com.",
  fr: "Zenith Dubai peut publier ce témoignage sur son site et ses réseaux sociaux, présenté comme je l'ai choisi ci-dessus. Je peux retirer cet accord à tout moment en écrivant à info@zenithdubaicv.com.",
  ar: "يحق لـ Zenith Dubai نشر هذا الرأي على موقعها وحساباتها على وسائل التواصل الاجتماعي بالطريقة التي اخترتها أعلاه. ويمكنني سحب هذه الموافقة في أي وقت بمراسلة info@zenithdubaicv.com.",
};

export const REVIEW_SERVICES = ["cv", "linkedin", "package", "ai-tools", "website", "other"] as const;
export type ReviewService = (typeof REVIEW_SERVICES)[number];

export const REVIEW_DISPLAY = ["full", "initial", "anonymous"] as const;
export type ReviewDisplay = (typeof REVIEW_DISPLAY)[number];

export const REVIEW_LIMITS = { name: 80, email: 160, order: 80, role: 120, messageMin: 30, messageMax: 1500 };
