// lib/xray/analyze.ts — the CV X-Ray's checks. Pure functions: they take the text and layout facts from
// lib/xray/read.ts and return findings. No score: every finding is a fact about the file ("two
// columns", "3 of 11 skills from the ad are missing") with what to do about it. Nothing is sent anywhere.

import { cvOutline, parseCv, type CvSection } from "@/lib/agent/cvparse";
import { extractSkills, mentions, norm, parseLanguages, requiredLanguages } from "@/lib/agent/text";
import { LEVEL_BUCKETS, levelOfListing, planRole, titleFit, type LevelBucket } from "@/lib/agent/titles";
import type { TierKey } from "@/lib/checkout/catalog";
import type { Layout } from "./read";

export type Status = "pass" | "warn" | "fail" | "info";
export type AreaId = "readability" | "structure" | "keywords" | "positioning" | "formatting" | "achievements" | "alignment";
export type CheckId =
  | "text" | "columns" | "tables" | "textboxes" | "header-contact" | "glyphs"
  | "headings" | "length" | "contact" | "linkedin" | "order"
  | "ad-skills" | "no-ad" | "cv-skills"
  | "summary" | "headline" | "headline-target"
  | "date-styles" | "undated" | "dense" | "images"
  | "metrics" | "duties" | "leadership"
  | "no-role" | "title-fit" | "level" | "languages";

export type Data = Record<string, string | number | string[]>;
export interface Check { id: CheckId; status: Status; data: Data }
export interface Area { id: AreaId; checks: Check[] }
export type FilmKind = "heading" | "contact" | "metric" | "duty" | "plain";
export interface FilmLine { text: string; kind: FilmKind }

export interface Report {
  facts: { kind: Layout["kind"]; pages: number | null; words: number; years: number | null; latestTitle: string | null };
  areas: Area[];
  counts: { pass: number; warn: number; fail: number };
  /** The most useful fixes first (problems, then warnings), at most five. */
  fixes: Check[];
  service: { key: Exclude<TierKey, "executive">; reason: "senior" | "positioning" | "rebuild" | "polish" };
  film: FilmLine[];
  role: string;
}

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}/i;
const PHONE = /(?:\+|00)?\d[\d\s().-]{6,}\d/;
const LINKEDIN = /linkedin\.com\/(in|pub)\/|linkedin\s*:/i;
const YEAR_RANGE = /(19|20)\d{2}/;

/** A result with a figure: a percentage, an amount, a count of people, covers, outlets… */
const METRIC = new RegExp([
  String.raw`\d+(?:[.,]\d+)?\s*%`,
  String.raw`(?:aed|usd|eur|gbp|sar|qar|kwd|bhd|omr|mad|dhs?|\$|€|£)\s?\d`,
  String.raw`\d[\d,.]*\s?(?:k|m|bn|million|millions|thousand|aed|usd|eur|sar|qar|mad|dhs|dirhams?|euros?)(?![\p{L}])`,
  String.raw`(?:team|equipe|staff) of \d+`,
  String.raw`\d+\s*(?:staff|employees|people|persons|covers|guests|clients|customers|outlets|restaurants|venues|stores|branches|hotels|rooms|keys|projects|accounts|reports|students|members|waiters|servers|captains|chefs|cooks|bartenders|baristas|agents|nurses|engineers|drivers|technicians|sales|events|weddings|banquets|tables|seats|collaborateurs|personnes|couverts|serveurs|موظف|موظفين|موظفا)`,
  String.raw`(?:increased|grew|raised|reduced|cut|saved|improved|boosted|generated|delivered|exceeded|achieved|augmente|reduit|ameliore|genere|زياده|خفض|حققت)[^.\n]{0,60}\d`,
].join("|"), "u");

/** A line that describes a duty, not a result. */
const DUTY = /(?<![\p{L}])(responsible for|responsibilities (?:include|included|were)|duties (?:include|included|were)|in charge of|tasked with|accountable for|my role (?:was|is) to|involved in|assisted (?:in|with)|helped (?:to|with)|worked on|handled|responsable de|en charge de|chargee? de|participation a|مسؤول عن|مسؤوله عن|المسؤول عن)(?![\p{L}])/u;

const LEAD = /(?<![\p{L}])(team of \d+|\d+\s*(?:staff|employees|people|direct reports|team members|waiters|servers|chefs|agents)|managed|led|supervised|oversaw|trained|coached|mentored|recruited|hired|encadre|dirige|equipe de \d+|ادار|اشرف|قاد)(?![\p{L}])/u;

const DATE_STYLES: [string, RegExp][] = [
  ["month-name", /(?<![\p{L}])(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|janv|fevr|mars|avr|mai|juin|juil|aout|sept|oct|nov|dec)[a-z]*\.?\s+(19|20)\d{2}/u],
  ["numeric", /(?<!\d)(0?[1-9]|1[0-2])\s*[/.-]\s*(19|20)\d{2}/u],
  ["year-only", /(?<![\d/.-])(19|20)\d{2}\s*(?:-|–|—|to|au|a)\s*((19|20)\d{2}|present|current|now|aujourd'hui|ce jour)(?![\d/])/u],
];

const PRIORITY: CheckId[] = [
  "textboxes", "columns", "header-contact", "glyphs", "tables", "contact", "headings", "metrics",
  "ad-skills", "headline-target", "title-fit", "summary", "headline", "duties", "length", "order",
  "undated", "date-styles", "dense", "cv-skills", "languages", "level", "linkedin",
];

export interface XrayInput { text: string; layout: Layout; role?: string; ad?: string; now?: Date }

export function analyzeCv({ text, layout, role = "", ad = "", now = new Date() }: XrayInput): Report {
  const facts = parseCv(text, now);
  const outline = cvOutline(text);
  const found = new Set<CvSection>(outline.flatMap(l => (l.heading ? [l.heading] : [])));
  const hasExperience = found.has("experience");
  const body = outline.filter(l => !l.heading && (hasExperience ? ["experience", "achievements", "summary"].includes(l.section ?? "") : true));
  const words = text.split(/\s+/).filter(Boolean).length;
  const jobs = facts.jobs?.value ?? [];
  const latest = jobs[0];
  // Titles as the parser found them; a long line or a duty sentence is not a job title, so it is left out.
  const titles = jobs.map(j => j.title).filter(t => t && t.length <= 60 && t.split(/\s+/).length <= 8 && !DUTY.test(norm(t)));
  const years = facts.years?.value != null ? Math.round(facts.years.value) : null;
  const roleText = role.trim();
  const adText = ad.trim();

  // ── Readability ────────────────────────────────────────────────────────
  const readability: Check[] = [{ id: "text", status: "pass", data: { words } }];
  if (layout.kind !== "txt") readability.push({ id: "columns", status: layout.columns ? "warn" : "pass", data: {} });
  if (layout.kind === "docx") {
    if (layout.textBoxes) readability.push({ id: "textboxes", status: "fail", data: { n: layout.textBoxes } });
    readability.push({ id: "tables", status: layout.tables ? "warn" : "pass", data: { n: layout.tables } });
    if (layout.headerOnlyContact) readability.push({ id: "header-contact", status: "warn", data: {} });
  }
  if (layout.oddChars >= 3) readability.push({ id: "glyphs", status: "warn", data: { n: layout.oddChars } });

  // ── Structure ──────────────────────────────────────────────────────────
  const structure: Check[] = [];
  const core: CvSection[] = ["experience", "education", "skills"];
  const missing = core.filter(s => !found.has(s));
  structure.push({ id: "headings", status: missing.length === 0 ? "pass" : missing.includes("experience") ? "fail" : "warn", data: { missing, found: core.filter(s => found.has(s)) } });

  const pages = layout.pages;
  let lengthStatus: Status = "pass";
  if (pages !== null) lengthStatus = pages >= 4 ? "warn" : pages === 3 ? ((years ?? 0) >= 15 ? "info" : "warn") : "pass";
  else lengthStatus = words > 1300 ? "warn" : "pass";
  if (words < 220) lengthStatus = "warn";
  structure.push({ id: "length", status: lengthStatus, data: { pages: pages ?? 0, words, thin: words < 220 ? 1 : 0 } });

  // Contact details kept in a Word header count as found here; the readability check above flags where they are.
  const hasEmail = EMAIL.test(text) || layout.headerEmail;
  const hasPhone = Boolean(facts.phone) || PHONE.test(text.split("\n").slice(0, 40).join("\n")) || layout.headerPhone;
  structure.push({ id: "contact", status: hasEmail && hasPhone ? "pass" : !hasEmail && !hasPhone ? "fail" : "warn", data: { email: hasEmail ? 1 : 0, phone: hasPhone ? 1 : 0 } });
  structure.push({ id: "linkedin", status: LINKEDIN.test(text) ? "pass" : "info", data: {} });

  // Order of the experience: the first year of each dated line, in the order the CV lists them.
  const firstYears = outline
    .filter(l => l.section === "experience" && !l.heading)
    .map(l => l.text.match(new RegExp(`(?:^|\\D)((?:19|20)\\d{2})(?:\\D[^\\n]{0,30}?(?:(?:19|20)\\d{2}|present|current|now|aujourd|ce jour|حتى|الان))`, "iu"))?.[1])
    .filter((y): y is string => Boolean(y))
    .map(Number);
  if (firstYears.length >= 3) {
    const ascending = firstYears.every((y, i) => i === 0 || y >= firstYears[i - 1]) && firstYears[firstYears.length - 1] > firstYears[0];
    structure.push({ id: "order", status: ascending ? "warn" : "pass", data: {} });
  }

  // ── Keywords ───────────────────────────────────────────────────────────
  const keywords: Check[] = [];
  const cvSkills = facts.skills?.value ?? [];
  if (adText.length >= 80) {
    const asked = extractSkills(adText);
    const have = asked.filter(s => mentions(text, s));
    const lack = asked.filter(s => !have.includes(s));
    keywords.push({
      id: "ad-skills",
      status: asked.length === 0 ? "info" : lack.length === 0 ? "pass" : have.length / asked.length >= 0.5 ? "warn" : "fail",
      data: { asked: asked.length, have, lack },
    });
  } else {
    keywords.push({ id: "no-ad", status: "info", data: {} });
  }
  keywords.push({ id: "cv-skills", status: cvSkills.length >= 6 ? "pass" : "warn", data: { skills: cvSkills.slice(0, 16), n: cvSkills.length } });

  // ── Positioning ────────────────────────────────────────────────────────
  const positioning: Check[] = [];
  positioning.push({ id: "summary", status: found.has("summary") ? "pass" : "warn", data: {} });
  const fallback = latest ? [latest.title, latest.employer].filter(Boolean).join(", ").slice(0, 120) : "";
  const ownHeadline = facts.headline && facts.headline.value !== fallback ? facts.headline.value : null;
  positioning.push({ id: "headline", status: ownHeadline ? "pass" : "warn", data: { headline: ownHeadline ?? "" } });
  const plan = roleText ? planRole(roleText) : null;
  if (plan && ownHeadline) {
    const fit = titleFit(plan, ownHeadline);
    positioning.push({ id: "headline-target", status: fit === "same" ? "pass" : fit === "related" || fit === "unknown" ? "info" : "warn", data: { headline: ownHeadline, role: roleText, fit } });
  }

  // ── Formatting ─────────────────────────────────────────────────────────
  const formatting: Check[] = [];
  const expLines = outline.filter(l => !l.heading && (l.section === "experience" || (!hasExperience && YEAR_RANGE.test(l.text))));
  const styles = DATE_STYLES.filter(([, re]) => expLines.filter(l => re.test(norm(l.text))).length >= 2).map(([k]) => k);
  if (styles.length) formatting.push({ id: "date-styles", status: styles.length > 1 ? "warn" : "pass", data: { styles } });
  const undated = jobs.filter(j => !j.start).length;
  if (jobs.length) formatting.push({ id: "undated", status: undated ? "warn" : "pass", data: { n: undated, jobs: jobs.length } });
  const dense = body.filter(l => l.text.length > 260).length;
  formatting.push({ id: "dense", status: dense >= 2 ? "warn" : "pass", data: { n: dense } });
  if (layout.kind === "docx" && layout.images) formatting.push({ id: "images", status: "info", data: { n: layout.images } });

  // ── Achievements ───────────────────────────────────────────────────────
  const achievements: Check[] = [];
  const metricLines = body.filter(l => l.text.length >= 25 && METRIC.test(norm(l.text)))
    .sort((a, b) => Number(b.section === "experience") - Number(a.section === "experience"));
  const dutyLines = body.filter(l => DUTY.test(norm(l.text)));
  achievements.push({
    id: "metrics",
    status: metricLines.length >= 4 ? "pass" : metricLines.length >= 1 ? "warn" : "fail",
    data: { n: metricLines.length, examples: metricLines.slice(0, 2).map(l => clip(l.text)) },
  });
  if (dutyLines.length) {
    achievements.push({ id: "duties", status: dutyLines.length >= 3 ? "warn" : "info", data: { n: dutyLines.length, examples: dutyLines.slice(0, 3).map(l => clip(l.text)) } });
  }
  const leads = body.filter(l => LEAD.test(norm(l.text))).length;
  achievements.push({ id: "leadership", status: leads ? "pass" : "info", data: { n: leads } });

  // ── Role alignment ─────────────────────────────────────────────────────
  const alignment: Check[] = [];
  if (!plan) alignment.push({ id: "no-role", status: "info", data: {} });
  else {
    const recent = titles.slice(0, 2);
    const fits = recent.map(t => titleFit(plan, t));
    const best = fits.includes("same") ? "same" : fits.includes("related") ? "related" : fits.includes("other") ? "other" : "unknown";
    if (recent.length) alignment.push({ id: "title-fit", status: best === "same" ? "pass" : best === "related" || best === "unknown" ? "info" : "warn", data: { titles: recent, role: roleText, fit: best } });
    const want = levelOfListing(roleText);
    const have = recent[0] ? levelOfListing(recent[0]) : null;
    if (want && have) {
      const step = LEVEL_BUCKETS.indexOf(want) - LEVEL_BUCKETS.indexOf(have);
      alignment.push({ id: "level", status: step >= 2 ? "warn" : step === 1 ? "info" : "pass", data: { want, have, step } });
    }
  }
  if (adText.length >= 80) {
    const asked = requiredLanguages(adText);
    const spoken = new Set([...(facts.languages?.value.map(l => l.name) ?? []), ...parseLanguages(text.slice(0, 4000))]);
    const gaps = asked.filter(l => !spoken.has(l));
    // The ad may name a language as a plus rather than a requirement: a gap is a note, not a problem.
    if (asked.length) alignment.push({ id: "languages", status: gaps.length ? "info" : "pass", data: { asked, gaps } });
  }

  const areas: Area[] = [
    { id: "readability", checks: readability },
    { id: "structure", checks: structure },
    { id: "keywords", checks: keywords },
    { id: "positioning", checks: positioning },
    { id: "formatting", checks: formatting },
    { id: "achievements", checks: achievements },
    { id: "alignment", checks: alignment },
  ];
  const all = areas.flatMap(a => a.checks);
  const counts = {
    pass: all.filter(c => c.status === "pass").length,
    warn: all.filter(c => c.status === "warn").length,
    fail: all.filter(c => c.status === "fail").length,
  };
  const rank = (c: Check) => (c.status === "fail" ? 0 : 1) * 100 + PRIORITY.indexOf(c.id);
  const fixes = all.filter(c => c.status === "fail" || c.status === "warn").sort((a, b) => rank(a) - rank(b)).slice(0, 5);

  return {
    facts: { kind: layout.kind, pages: layout.pages, words, years, latestTitle: titles[0] ?? null },
    areas,
    counts,
    fixes,
    service: pickService(all, titles[0] ? levelOfListing(titles[0]) : null, years),
    film: film(outline),
    role: roleText,
  };
}

function clip(s: string, max = 160): string {
  const t = s.replace(/^[-–—•·*▪◦>\s]+/u, "");
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** The package that answers what the X-Ray found. Career Automation is never suggested here: it is chosen for its job-application campaign, which a CV check can't judge. */
function pickService(all: Check[], level: LevelBucket | null, years: number | null): Report["service"] {
  if (level === "executive" && (years ?? 0) >= 8) return { key: "apex", reason: "senior" };
  const bad = (ids: CheckId[]) => all.filter(c => ids.includes(c.id) && (c.status === "warn" || c.status === "fail")).length;
  if (bad(["summary", "headline", "headline-target", "title-fit", "ad-skills", "level"]) >= 2) return { key: "growth", reason: "positioning" };
  if (bad(["columns", "textboxes", "tables", "header-contact", "headings", "metrics", "contact", "glyphs"]) >= 2) return { key: "foundation", reason: "rebuild" };
  return { key: "foundation", reason: "polish" };
}

function film(outline: ReturnType<typeof cvOutline>): FilmLine[] {
  return outline.slice(0, 120).map(l => {
    const n = norm(l.text);
    const kind: FilmKind = l.heading ? "heading"
      : EMAIL.test(l.text) || /^(?:\+|00)\d[\d\s().-]{7,}$/.test(l.text.trim()) ? "contact"
      : l.text.length >= 25 && METRIC.test(n) ? "metric"
      : DUTY.test(n) ? "duty"
      : "plain";
    return { text: l.text, kind };
  });
}
