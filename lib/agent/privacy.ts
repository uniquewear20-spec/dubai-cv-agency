// lib/agent/privacy.ts — server only. Takes the candidate's identity out of a CV before it is sent to the
// AI service, and puts it back in the draft that comes back. The AI sees "[Candidate]" in place of the
// candidate's name (whole, and each part of three letters or more) and "[link]" in place of web
// addresses; emails and phone numbers are already removed by redactContacts (lib/agent/text.ts).

import type { Draft } from "./types";

export const NAME_TOKEN = "[Candidate]";
const LINK_TOKEN = "[link]";

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export interface Pseudonymised {
  text: string;
  /** What to send as the candidate's name: the token, or "" when no name was given. */
  name: string;
  /** Puts the real name back in a draft (the token may appear in any of its texts). */
  restore: (d: Draft) => Draft;
}

export function pseudonymise(cvText: string, name: string): Pseudonymised {
  const real = name.replace(/\s+/g, " ").trim();
  let text = cvText;
  if (real) {
    const parts = [real, ...real.split(" ").filter(p => p.replace(/[^\p{L}]/gu, "").length >= 3)];
    for (const p of [...new Set(parts)].sort((a, b) => b.length - a.length)) {
      text = text.replace(new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(p)}(?![\\p{L}\\p{N}])`, "giu"), NAME_TOKEN);
    }
    // "[Candidate] [Candidate]" (first and last name replaced one by one) reads as one name.
    text = text.split(`${NAME_TOKEN} ${NAME_TOKEN}`).join(NAME_TOKEN);
  }
  text = text.replace(/\bhttps?:\/\/\S+|\b(?:www\.)?(?:linkedin\.com|behance\.net|github\.com|instagram\.com)\/\S*/gi, LINK_TOKEN);

  const put = (s: string) => (real ? s.split(NAME_TOKEN).join(real) : s.split(NAME_TOKEN).join("").trim());
  return {
    text,
    name: real ? NAME_TOKEN : "",
    restore: d => ({
      ...d,
      fitSummary: put(d.fitSummary),
      tailoredSummary: put(d.tailoredSummary),
      coverLetter: put(d.coverLetter),
      highlights: d.highlights.map(h => ({ ...h, text: put(h.text), evidence: put(h.evidence), why: h.why ? put(h.why) : h.why })),
      gaps: d.gaps.map(put),
    }),
  };
}
