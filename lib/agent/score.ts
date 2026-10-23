// lib/agent/score.ts — ranks a job against a candidate. Runs in the browser, so the CV never
// leaves the device for matching. Every point comes with a reason the candidate can read.
//
//   Title          35   the listing's title against the target roles: the same job under any
//                       of its titles (lib/agent/titles.ts) scores high, a neighbouring job less,
//                       a different job nothing, whatever words it shares
//   Skills         30   the candidate's skills found in the listing, and how many it asks for
//   Place          15   the listing's location or remote region against the wanted countries
//   Seniority      10   the level in the title against the candidate's own level
//   Freshness      10   how recently it was posted
//   Deductions          languages the listing requires that the candidate doesn't list,
//                       a listed salary below the candidate's minimum

import { extractSkills, norm, phraseRe, requiredLanguages, skillMatcher, words } from "./text";
import { placeFit } from "./countries";
import { cleanTitle, familyOfTitle, planRole, titleFit, titleRe, type RolePlan } from "./titles";
import { annual } from "./salary";
import type { Job, Profile } from "./types";

export type ReasonCode =
  | "title-exact" | "title-variant" | "title-related" | "title-close" | "title-weak" | "title-none"
  | "skills" | "skills-none" | "skills-missing"
  | "place-direct" | "place-worldwide" | "place-region" | "place-miss" | "remote-unwanted" | "onsite-unwanted"
  | "level-fit" | "level-higher" | "level-lower"
  | "fresh" | "recent" | "old"
  | "lang-ok" | "lang-gap"
  | "salary-ok" | "salary-below";

export interface Reason {
  code: ReasonCode;
  /** Positive, negative or neutral for the candidate. */
  tone: "plus" | "minus" | "info";
  points: number;
  data?: { role?: string; skills?: string[]; total?: number; place?: string; days?: number; langs?: string[]; listed?: string };
}

export interface Match {
  score: number;
  /** Points per part (title 35, skills 30, place 15, level 10, fresh 10) and the deductions. */
  parts: { title: number; skills: number; place: number; level: number; fresh: number; deduct: number };
  reasons: Reason[];
  matchedSkills: string[];
  missingSkills: string[];
  requiredLangs: string[];
  excluded: boolean;
}

const stem = (w: string) =>
  w.length <= 4 ? w : w.replace(/(ational|ation|ement|ments?|ial|ing|ances?|ences?|ers?|als?|ité|ique|e|s)$/u, "");

const LEVELS: [RegExp, number][] = [
  [/(?<![\p{L}])(intern|internship|trainee|stagiaire|stage|graduate|entry[- ]level|junior|jr|assistant|apprenti\w*|متدرب)(?![\p{L}])/u, 1],
  [/(?<![\p{L}])(associate|officer|specialist|analyst|coordinator|executive|accountant|engineer|consultant|chargé|chargée|spécialiste)(?![\p{L}])/u, 2],
  [/(?<![\p{L}])(senior|sr|lead|supervisor|team lead|principal consultant|confirmé|confirmée)(?![\p{L}])/u, 3],
  [/(?<![\p{L}])(manager|responsable|gestionnaire|مدير)(?![\p{L}])/u, 3.5],
  [/(?<![\p{L}])(head|director|directeur|directrice|principal|controller|contrôleur)(?![\p{L}])/u, 4],
  [/(?<![\p{L}])(vp|vice president|chief|cfo|ceo|coo|cto|cmo|chro|partner|general manager|managing director|président|رئيس)(?![\p{L}])/u, 5],
];

/** Job-family levels (1 entry … 7 executive) on the scale above. */
const FAMILY_LEVEL = [0, 1, 2, 3, 3.25, 3.5, 4, 5];

// Target roles change rarely and are planned once (typos fixed, the job they are).
const planCache = new Map<string, RolePlan>();
function planOf(role: string): RolePlan {
  let p = planCache.get(role);
  if (!p) {
    p = planRole(role);
    if (planCache.size > 50) planCache.clear();
    planCache.set(role, p);
  }
  return p;
}

/** The most senior level a text names (1 junior … 5 executive), or null. */
export function levelOf(text: string): number | null {
  const n = norm(text);
  let best: number | null = null;
  for (const [re, lvl] of LEVELS) if (re.test(n) && (best === null || lvl > best)) best = lvl;
  return best;
}

export function daysSince(iso: string | null, now = Date.now()): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? Math.max(0, Math.floor((now - t) / 86_400_000)) : null;
}

/** Skills that count for the candidate: the ones they listed plus the ones found in their CV. */
export function candidateSkills(p: Profile): string[] {
  const all = [...p.skills, ...(p.cvText ? extractSkills(p.cvText) : [])];
  const seen = new Set<string>();
  return all.filter(s => { const k = norm(s); if (!k || seen.has(k)) return false; seen.add(k); return true; });
}

// What a listing asks for doesn't change, so it is worked out once per listing.
const listingCache = new Map<string, { asked: string[]; langs: string[]; nText: string }>();
function listingFacts(job: Job, jobText: string) {
  const key = `${job.id}|${job.description.length}|${job.title}`;
  let f = listingCache.get(key);
  if (!f) {
    f = { asked: extractSkills(jobText), langs: requiredLanguages(jobText), nText: norm(jobText) };
    if (listingCache.size > 600) listingCache.clear();
    listingCache.set(key, f);
  }
  return f;
}

export function scoreJob(job: Job, p: Profile, skills = candidateSkills(p), now = Date.now()): Match {
  const reasons: Reason[] = [];
  const jobText = `${job.title}\n${job.tags.join(", ")}\n${job.description}`;
  const nTitle = norm(job.title);
  const facts = listingFacts(job, jobText);
  const nText = facts.nText;

  if (p.excludeCompanies.some(c => c.trim() && norm(job.company).includes(norm(c)))) {
    return { score: 0, parts: { title: 0, skills: 0, place: 0, level: 0, fresh: 0, deduct: 0 }, reasons: [], matchedSkills: [], missingSkills: [], requiredLangs: [], excluded: true };
  }

  // Title
  let title = 0;
  let bestRole = "";
  let titleCode = "title-none" as ReasonCode;
  const intro = `${job.tags.join(" ")}\n${job.description.slice(0, 1500)}`;
  const take = (pts: number, role: string, code: ReasonCode) => { if (pts > title) { title = pts; bestRole = role; titleCode = code; } };
  for (const role of p.roles) {
    if (!role.trim()) continue;
    const plan = planOf(role);
    const fit = titleFit(plan, job.title, intro);
    if (fit === "same") {
      // The candidate's own words in the title, or the same job under another title ("Mixologist" for "Bartender").
      const exact = titleRe(role).test(nTitle) || titleRe(plan.role).test(cleanTitle(job.title));
      take(exact ? 35 : 32, role, exact ? "title-exact" : "title-variant");
      if (title >= 35) break;
      continue;
    }
    if (fit === "related") { take(20, role, "title-related"); continue; }
    if (fit === "other") continue; // a different job ("Assistant Restaurant Manager" is not "Restaurant Manager")
    // A role or a title the agent doesn't know: compare the words.
    if (phraseRe(role).test(nTitle)) { take(35, role, "title-exact"); break; }
    const rw = words(role).map(stem);
    if (!rw.length) continue;
    const tw = new Set(words(job.title).map(stem));
    const hit = rw.filter(w => tw.has(w)).length / rw.length;
    const pts = hit >= 0.99 ? 32 : hit >= 0.5 ? Math.round(28 * hit) : 0;
    if (pts) take(pts, role, pts >= 14 ? "title-close" : "title-weak");
    else if (!title && phraseRe(role).test(nText)) take(6, role, "title-weak");
  }
  if (title > 0) reasons.push({ code: titleCode, tone: titleCode === "title-weak" || titleCode === "title-related" ? "info" : "plus", points: title, data: { role: bestRole } });
  else if (p.roles.length) reasons.push({ code: "title-none", tone: "minus", points: 0 });

  // Skills
  const asked = facts.asked;
  const matched = skills.filter(s => skillMatcher(s)(nText, jobText));
  const missing = asked.filter(s => !skills.some(c => norm(c) === norm(s)));
  let skillPts = 0;
  if (asked.length) {
    const coverage = asked.filter(s => skills.some(c => norm(c) === norm(s))).length / asked.length;
    skillPts = Math.round(30 * (0.6 * coverage + 0.4 * Math.min(1, matched.length / 5)));
  } else {
    skillPts = Math.round(21 * Math.min(1, matched.length / 4));
  }
  if (matched.length) reasons.push({ code: "skills", tone: "plus", points: skillPts, data: { skills: matched.slice(0, 8), total: asked.length } });
  else if (skills.length) reasons.push({ code: "skills-none", tone: "minus", points: 0 });
  if (missing.length) reasons.push({ code: "skills-missing", tone: "info", points: 0, data: { skills: missing.slice(0, 6) } });

  // Place
  let place = 0;
  if (job.remote && !p.remoteOk) {
    reasons.push({ code: "remote-unwanted", tone: "minus", points: 0 });
  } else if (!job.remote && !p.onsiteOk) {
    reasons.push({ code: "onsite-unwanted", tone: "minus", points: 0 });
  } else {
    const fit = placeFit(job.location, job.remote, p.countries);
    if (!p.countries.length) place = 10;
    else if (fit.match && fit.via && fit.via !== "worldwide" && fit.via.length === 2) { place = 15; reasons.push({ code: "place-direct", tone: "plus", points: 15, data: { place: fit.via } }); }
    else if (fit.match && fit.worldwide) { place = 13; reasons.push({ code: "place-worldwide", tone: "plus", points: 13 }); }
    else if (fit.match && fit.via) { place = 12; reasons.push({ code: "place-region", tone: "plus", points: 12, data: { place: fit.via } }); }
    else reasons.push({ code: "place-miss", tone: "minus", points: 0, data: { place: job.location || "-" } });
  }

  // Seniority: hospitality titles by their job's level ("Head Bartender" is a supervisor, not a
  // head of department); other titles by the words they use.
  let level = 6;
  const jobFamily = familyOfTitle(job.title, intro);
  const jobLvl = jobFamily ? FAMILY_LEVEL[jobFamily.level] : levelOf(job.title);
  const ownFamilies = [...p.roles.map(r => (r.trim() ? planOf(r).family : null)), p.headline.trim() ? familyOfTitle(p.headline) : null]
    .filter((f): f is NonNullable<typeof f> => Boolean(f));
  const candLvl = ownFamilies.length ? Math.max(...ownFamilies.map(f => FAMILY_LEVEL[f.level])) : levelOf([p.headline, ...p.roles].join(" "));
  if (jobLvl !== null && candLvl !== null) {
    const diff = jobLvl - candLvl;
    level = Math.max(0, Math.round(10 - Math.abs(diff) * 4));
    if (Math.abs(diff) < 1) reasons.push({ code: "level-fit", tone: "plus", points: level });
    else if (diff >= 1.5) reasons.push({ code: "level-higher", tone: "info", points: level });
    else if (diff <= -1.5) reasons.push({ code: "level-lower", tone: "minus", points: level });
  }

  // Freshness
  const days = daysSince(job.postedAt, now);
  let fresh = 4;
  if (days !== null) {
    fresh = days <= 3 ? 10 : days <= 7 ? 9 : days <= 14 ? 7 : days <= 30 ? 5 : days <= 60 ? 2 : 0;
    if (days <= 7) reasons.push({ code: "fresh", tone: "plus", points: fresh, data: { days } });
    else if (days <= 30) reasons.push({ code: "recent", tone: "info", points: fresh, data: { days } });
    else reasons.push({ code: "old", tone: "minus", points: fresh, data: { days } });
  }

  // Deductions: languages
  let deduct = 0;
  const langs = facts.langs;
  const have = new Set(p.languages.map(norm));
  const gaps = langs.filter(l => !have.has(norm(l)));
  if (gaps.length && p.languages.length) {
    deduct += Math.min(24, gaps.length * 12);
    reasons.push({ code: "lang-gap", tone: "minus", points: -Math.min(24, gaps.length * 12), data: { langs: gaps } });
  } else if (langs.length && p.languages.length) {
    reasons.push({ code: "lang-ok", tone: "plus", points: 0, data: { langs } });
  }

  // Deductions: salary (only when the listing and the candidate use the same currency)
  const s = job.salaryRange;
  if (s && p.salaryMin && s.currency === p.salaryCurrency && s.period) {
    const top = annual(s.max ?? s.min ?? 0, s.period);
    const want = p.salaryPeriod === "month" ? p.salaryMin * 12 : p.salaryMin;
    if (top && top < want * 0.95) {
      deduct += 15;
      reasons.push({ code: "salary-below", tone: "minus", points: -15, data: { listed: job.salary ?? "" } });
    } else if (top) {
      reasons.push({ code: "salary-ok", tone: "plus", points: 0, data: { listed: job.salary ?? "" } });
    }
  }

  let score = Math.max(0, Math.min(100, title + skillPts + place + level + fresh - deduct));
  // Without a single shared skill, a listing is at most a partial match, however well the title reads.
  if (skills.length >= 3 && matched.length === 0) score = Math.min(score, 55);
  return {
    score,
    parts: { title, skills: skillPts, place, level, fresh, deduct },
    reasons, matchedSkills: matched, missingSkills: missing, requiredLangs: langs, excluded: false,
  };
}
