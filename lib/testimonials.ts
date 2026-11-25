// lib/testimonials.ts — published client statements. The list is empty on purpose: nothing is
// shown on the site until a real client has written it and given written consent.
//
// How a statement gets here:
//   1. The client sends it through /review/ (or by email). The review form emails the Zenith inbox
//      with the exact consent wording, the display choice and a timestamp. Keep that email.
//   2. Check it against a real order (name or email on the order) and confirm with the client
//      before publishing. Edit only for spelling, never for meaning.
//   3. Add one entry below with verified: true. Only verified entries with publish consent render.
//   4. If the client withdraws consent, delete the entry and redeploy.
//
// Never add invented, paraphrased-into-praise or "representative" statements, star ratings or
// review counts. Illustrative case studies belong elsewhere and must be labelled as illustrative.

import type { Lang } from "@/lib/site";

export interface Testimonial {
  id: string;
  /** The statement in the language the client wrote it in. */
  quote: string;
  lang: Lang;
  /** How the client asked to be shown. */
  display: "full" | "initial" | "anonymous";
  /** The name exactly as approved for display (empty for anonymous). */
  name?: string;
  /** Role and target market as the client approved them, e.g. "Finance manager, moving to Canada". */
  role?: string;
  /** Which service or package the statement is about. */
  service?: string;
  consent: {
    publish: boolean;
    /** ISO date the consent was given. */
    date: string;
    method: "review-form" | "email" | "whatsapp";
    /** Internal reference to the consent record, e.g. the review email subject. Never shown. */
    record: string;
  };
  /** True only after the statement was matched to a real order. */
  verified: boolean;
}

export const TESTIMONIALS: Testimonial[] = [];

export const publishedTestimonials = (): Testimonial[] =>
  TESTIMONIALS.filter(t => t.verified && t.consent.publish && t.quote.trim().length > 0);
