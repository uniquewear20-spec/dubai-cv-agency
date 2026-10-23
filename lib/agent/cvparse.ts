// lib/agent/cvparse.ts — reads a CV's text into profile facts, in the browser (nothing is sent).
// Every fact says where it comes from and how sure the agent is:
//   source "cv"         written in the CV (a name, an email, a job with its dates)
//   source "worked-out" the agent's own conclusion (years of experience added up from the dates,
//                       target roles suggested from the most recent job)
//   sure false          the agent isn't confident (a year without a month, a name it had to guess)
// Nothing is applied to the profile until the candidate reviews and confirms it.

import { COUNTRIES, countriesIn } from "./countries";
import { extractSkills, LANGUAGES, norm, parseLanguages } from "./text";
import { cleanTitle, familyLabel, familyOfTitle } from "./titles";
import type { WorkEntry } from "./types";

export interface Fact<T> { value: T; source: "cv" | "worked-out"; sure: boolean }

export type CvJob = WorkEntry;

export interface CvLanguage { name: string; level: "Native" | "Fluent" | "Professional" | "Intermediate" | "Basic" | null }

export interface CvFacts {
  name?: Fact<string>;
  email?: Fact<string>;
  phone?: Fact<string>;
  location?: Fact<{ text: string; country: string | null }>;
  /** A one-line description of the candidate: the CV's own headline, or the most recent job. */
  headline?: Fact<string>;
  /** Suggested target roles (always worked out: the candidate chooses). */
  roles?: Fact<string[]>;
  jobs?: Fact<CvJob[]>;
  years?: Fact<number>;
  education?: Fact<string[]>;
  certifications?: Fact<string[]>;
  languages?: Fact<CvLanguage[]>;
  skills?: Fact<string[]>;
  achievements?: Fact<string[]>;
  leadership?: Fact<string[]>;
}

// ── Sections ─────────────────────────────────────────────────────────────────

type Section = "experience" | "education" | "certifications" | "languages" | "skills" | "summary" | "contact" | "achievements" | "other";

const HEADINGS: [Section, RegExp][] = [
  ["experience", /^((work|professional|employment|career|relevant|hospitality|industry) )?(experience|experiences|history|background)$|^(employment|career|work) history$|^experiences?( professionnelles?)?$|^parcours( professionnel)?$|^الخبر(ه|ات)( العمليه| المهنيه)?$|^الخبره العمليه$/],
  ["education", /^(education|academic background|academic qualifications|education and training|education & training|qualifications)$|^(formation|formations|formation academique|etudes|diplomes|cursus)$|^(التعليم|المؤهلات|المؤهلات العلميه|المؤهل العلمي)$/],
  ["certifications", /^(certifications?|certificates?|licen[cs]es?( (and|&) certifications?)?|training|trainings|courses|professional development|certifications? (and|&) (training|courses))$|^(certificats?|certifications?|formations? complementaires?)$|^(الشهادات|الدورات|الدورات التدريبيه)$/],
  ["languages", /^(languages?|language skills|languages spoken)$|^langues?( parlees)?$|^اللغات$/],
  ["skills", /^((key|core|technical|professional|hard|soft) )?(skills|competencies|competences)( (and|&) (abilities|expertise))?$|^areas of expertise$|^expertise$|^competences( cles)?$|^(المهارات|المهارات الشخصيه)$/],
  ["summary", /^(profile|professional profile|personal profile|summary|professional summary|career summary|executive summary|about me|objective|career objective|personal statement)$|^(profil|profil professionnel|resume|a propos( de moi)?|objectif)$|^(الملخص|نبذه|نبذه عني|الهدف|الهدف الوظيفي)$/],
  ["contact", /^(contact|contacts|contact details|contact information|personal details|personal information|personal data)$|^(coordonnees|informations personnelles|etat civil)$|^(معلومات|المعلومات الشخصيه|بيانات شخصيه|معلومات الاتصال)$/],
  ["achievements", /^((key|career|notable) )?(achievements|accomplishments)$|^realisations$|^الانجازات$/],
  ["other", /^(references|hobbies|interests|hobbies (and|&) interests|volunteering|volunteer work|projects|awards|publications|memberships)$|^(centres d'interet|loisirs|references|benevolat)$|^(الهوايات|المراجع|الاهتمامات)$/],
];

function headingOf(line: string): Section | null {
  const h = norm(line).replace(/[:：\-–—_•·|*#]+/g, " ").replace(/\s+/g, " ").trim();
  if (!h || h.split(" ").length > 6) return null;
  for (const [section, re] of HEADINGS) if (re.test(h)) return section;
  return null;
}

interface Line { text: string; section: Section | null; index: number }

function linesOf(text: string): Line[] {
  const out: Line[] = [];
  let section: Section | null = null;
  text.split("\n").forEach((raw, index) => {
    const t = raw.replace(/\s+/g, " ").trim();
    if (!t) return;
    const h = headingOf(t);
    if (h) { section = h; return; }
    out.push({ text: t, section, index });
  });
  return out;
}

// ── Contacts ─────────────────────────────────────────────────────────────────

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}/i;
const PHONE = /(?:\+|00)?\d[\d\s().-]{6,}\d/g;
const PHONE_LABEL = /(phone|mobile|tel|cell|whatsapp|contact|t[ée]l[ée]phone|portable|هاتف|جوال|موبايل|الهاتف)/i;
const NOT_NAME = /(curriculum|vitae|resume|résumé|^cv$|cv of|portfolio|page \d|confidential|سيره ذاتيه|السيره الذاتيه)/i;
const PARTICLES = new Set(["de", "da", "di", "du", "del", "van", "von", "der", "le", "la", "al", "el", "bin", "bint", "ben", "abu", "ibn", "y", "e"]);

function titleCase(s: string): string {
  return s.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_, sep: string, c: string) => sep + c.toUpperCase());
}

function findName(lines: Line[]): Fact<string> | undefined {
  const top = lines.filter(l => l.section === null || l.section === "contact" || l.section === "summary").slice(0, 8);
  for (let i = 0; i < top.length; i++) {
    const t = top[i].text.replace(/[|•·]+.*$/, "").trim();
    if (!t || /[@\d:/\\]|https?|www\./i.test(t) || NOT_NAME.test(norm(t)) || familyOfTitle(t)) continue;
    const words = t.split(/\s+/);
    if (words.length < 2 || words.length > 5) continue;
    const arabic = words.every(w => /^[\u0600-\u06FF]+$/.test(w));
    const latin = words.every(w => PARTICLES.has(w.toLowerCase()) || /^\p{Lu}[\p{L}'’.-]*$/u.test(w));
    if (!arabic && !latin) continue;
    const value = !arabic && t === t.toUpperCase() ? titleCase(t) : t;
    return { value, source: "cv", sure: i <= 1 };
  }
  return undefined;
}

function findPhone(text: string): Fact<string> | undefined {
  const lines = text.split("\n").slice(0, 60);
  let best: { value: string; rank: number } | null = null;
  for (const line of lines) {
    for (const m of line.matchAll(PHONE)) {
      const raw = m[0].trim();
      const digits = raw.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15) continue;
      // Year ranges and dates are not phone numbers ("2019 - 2021", "01/2019").
      if (/^(19|20)\d{2}\s*[-–/.]\s*(19|20)?\d{2}$/.test(raw) || /^\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}$/.test(raw)) continue;
      const rank = (PHONE_LABEL.test(line) ? 4 : 0) + (/^(\+|00)/.test(raw) ? 2 : 0) + (/^0?5\d/.test(digits) ? 1 : 0);
      if (!best || rank > best.rank) best = { value: raw.replace(/\s+/g, " "), rank };
    }
  }
  return best ? { value: best.value, source: "cv", sure: best.rank >= 2 } : undefined;
}

// Every country and city name the agent knows, to tell "Dubai" (a place) from "Zuma Dubai" (an employer).
let PLACE_RE: RegExp | null = null;
function placeOnly(text: string): boolean {
  PLACE_RE ??= new RegExp(`(?<![\\p{L}])(${COUNTRIES.flatMap(c => [c.en, c.fr, c.ar, ...c.aliases]).map(norm).filter(Boolean)
    .sort((a, b) => b.length - a.length).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![\\p{L}])`, "gu");
  const n = norm(text);
  if (!countriesIn(text).length || /\d/.test(n)) return false;
  return n.replace(PLACE_RE, " ").replace(/[^\p{L}]+/gu, "").length <= 2;
}

const LOCATION_LABEL = /(address|location|based in|lives? in|residence|resident of|current location|adresse|domicile|lieu de residence|residant|العنوان|الموقع|مقيم|السكن)/i;

function findLocation(lines: Line[]): Fact<{ text: string; country: string | null }> | undefined {
  const top = lines.filter(l => l.section === null || l.section === "contact").slice(0, 14);
  let pick: { line: string; country: string; labelled: boolean; pos: number } | null = null;
  top.forEach((l, pos) => {
    if (EMAIL.test(l.text) && !LOCATION_LABEL.test(l.text)) {
      // Contact lines often hold email | phone | city: look at the parts without the email.
    }
    const parts = l.text.split(/\s*[|•·—–]\s*|\s+-\s+/);
    for (const part of parts) {
      if (EMAIL.test(part) || /\d{6,}/.test(part.replace(/\D/g, ""))) continue;
      const found = countriesIn(part);
      if (found.length !== 1) continue;
      // "Address: Dubai, UAE" or a part that is only a place; not "10+ years in the UAE".
      const labelled = LOCATION_LABEL.test(norm(part));
      if (!labelled && !placeOnly(part)) continue;
      if (!pick || (labelled && !pick.labelled)) pick = { line: part, country: found[0], labelled, pos };
    }
  });
  if (!pick) return undefined;
  const p = pick as { line: string; country: string; labelled: boolean; pos: number };
  const text = p.line.replace(/^[^:：]*[:：]\s*/, "").replace(new RegExp(`^${LOCATION_LABEL.source}\\s*`, "i"), "").trim().slice(0, 80);
  return { value: { text, country: p.country }, source: "cv", sure: p.labelled || p.pos <= 5 };
}

// ── Jobs and dates ───────────────────────────────────────────────────────────

const MONTHS: [RegExp, number][] = [
  [/^(jan|january|janv|janvier|يناير|كانون الثاني)/, 1], [/^(feb|february|fev|fevr|fevrier|فبراير|شباط)/, 2], [/^(mar|march|mars|مارس|اذار)/, 3],
  [/^(apr|april|avr|avril|ابريل|نيسان)/, 4], [/^(may|mai|مايو|ايار)/, 5], [/^(jun|june|juin|يونيو|حزيران)/, 6], [/^(jul|july|juil|juillet|يوليو|تموز)/, 7],
  [/^(aug|august|aout|اغسطس|اب)/, 8], [/^(sep|sept|september|septembre|سبتمبر|ايلول)/, 9], [/^(oct|october|octobre|اكتوبر|تشرين الاول)/, 10],
  [/^(nov|november|novembre|نوفمبر|تشرين الثاني)/, 11], [/^(dec|december|decembre|ديسمبر|كانون الاول)/, 12],
];
const MONTH_WORD = "(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|janv(?:ier)?|fevr?(?:ier)?|mars|avr(?:il)?|mai|juin|juil(?:let)?|aout|septembre|octobre|novembre|decembre|يناير|فبراير|مارس|ابريل|مايو|يونيو|يوليو|اغسطس|سبتمبر|اكتوبر|نوفمبر|ديسمبر)\\.?";
const YEAR = "(?:19[5-9]\\d|20[0-4]\\d)";
const DATE = `(?:${MONTH_WORD}\\s*(?:\\d{1,2},?\\s*)?${YEAR}|\\d{1,2}\\s*[/.-]\\s*${YEAR}|${YEAR}\\s*[/.-]\\s*\\d{1,2}(?!\\d)|${YEAR})`;
const NOW = "(?:present|current|currently|now|today|to date|date|ongoing|aujourd'?hui|a ce jour|ce jour|actuel(?:lement)?|en cours|maintenant|حتى الان|الان|حاليا|حتي الان|الى الان)";
const RANGE = new RegExp(`(${DATE})\\s*(?:-|–|—|~|to|till|until|au|a|->|→|الى|حتى)\\s*(${DATE}|${NOW})`, "u");
const SINCE = new RegExp(`(?:since|from|depuis|منذ)\\s+(${DATE})`, "u");

const DATE_PART = new RegExp(`(?<!\\d)${YEAR}(?!\\d)|^\\s*${NOW}\\s*\\.?$|^\\s*(?:since|from|depuis|منذ|summer|winter|spring|autumn|ete|hiver)\\s*$`, "u");
/** A piece of a date line that is (part of) the dates, not the title or employer. */
const isDatePart = (part: string) => !part.trim() || DATE_PART.test(norm(part));

function parseDate(raw: string): { value: string; month: boolean } | null {
  const t = raw.trim().replace(/\.$/, "");
  const year = t.match(new RegExp(YEAR))?.[0];
  if (!year) return null;
  const word = t.match(new RegExp(`^${MONTH_WORD}`, "u"))?.[0];
  let month: number | null = null;
  if (word) month = MONTHS.find(([re]) => re.test(word.replace(/\.$/, "")))?.[1] ?? null;
  else {
    const m1 = t.match(new RegExp(`^(\\d{1,2})\\s*[/.-]\\s*${YEAR}`));
    const m2 = t.match(new RegExp(`^${YEAR}\\s*[/.-]\\s*(\\d{1,2})$`));
    const n = Number(m1?.[1] ?? m2?.[1] ?? NaN);
    if (n >= 1 && n <= 12) month = n;
  }
  return month ? { value: `${year}-${String(month).padStart(2, "0")}`, month: true } : { value: year, month: false };
}

/** Words that make a phrase a job title rather than an employer. */
const ROLE_WORD = /(?<![\p{L}])(manager|supervisor|waiter|waitress|bartender|barista|chef|cook|commis|captain|host|hostess|attendant|receptionist|agent|executive|officer|assistant|director|head|lead|coordinator|specialist|analyst|engineer|consultant|accountant|associate|intern|trainee|representative|cashier|server|sommelier|butler|concierge|steward|technician|driver|controller|administrator|clerk|advisor|adviser|designer|developer|teacher|nurse|mixologist|housekeeper|runner|crew|team member|responsable|directeur|directrice|serveur|serveuse|gerant|gerante|employe|employee|conseiller|conseillere|commercial|commerciale|stagiaire|charge|chargee|cuisinier|mdir|مدير|مشرف|نادل|نادله|طاه|شيف|موظف|مساعد|منسق|محاسب|مهندس|مستشار)(?![\p{L}])/u;

const SPLIT = /\s+(?:[|–—@]|-|at|chez|لدى|في)\s+|\s*[|–—]\s*|,\s+/u;

function splitTitleEmployer(parts: string[]): { title: string; employer: string; place: string | null } {
  let title = "";
  let employer = "";
  let place: string | null = null;
  const pieces = parts.flatMap(p => p.split(SPLIT)).map(p => p.replace(/\(\s*\)/g, " ").replace(/^[\s():،,]+|[\s():،,]+$/g, "").trim()).filter(p => p.length > 1 && p.length < 90);
  for (const p of pieces) {
    const n = norm(p);
    if (placeOnly(p)) { place ??= p; continue; }
    if (!title && (familyOfTitle(p) || ROLE_WORD.test(n))) { title = p; continue; }
    if (!employer) employer = p;
  }
  if (!title && employer && pieces.length === 1) { title = employer; employer = ""; }
  return { title, employer, place };
}

const DEGREE = /(?<![\p{L}])(bachelor'?s?|masters?|mba|msc|bsc|b\.a\.|m\.a\.|degree|diploma|university|college|school|institute|academy|licence|bts|dut|baccalaureat|bac|doctorat|phd|بكالوريوس|ماجستير|دبلوم|جامعه|كليه|معهد|ثانويه)(?![\p{L}])/u;

function findJobs(lines: Line[]): CvJob[] {
  const inExperience = lines.some(l => l.section === "experience");
  const pool = lines.filter(l => (inExperience ? l.section === "experience" : l.section !== "education" && l.section !== "certifications"));
  const jobs: CvJob[] = [];
  pool.forEach((l, i) => {
    const n = norm(l.text);
    const r = n.match(RANGE);
    const s = r ? null : n.match(SINCE);
    if (!r && !s) return;
    if (!inExperience && DEGREE.test(n)) return;
    const start = parseDate((r ?? s)![1]);
    if (!start) return;
    const endRaw = r?.[2] ?? null;
    const current = !r || new RegExp(`^${NOW}$`, "u").test(endRaw!.trim());
    const end = current ? null : parseDate(endRaw!);
    // The title and employer sit on the date line, or on the one or two lines just above it.
    // The date line is cut at its separators and the parts that are dates are dropped
    // ("Zuma Dubai, DIFC | March 2021 – Present" → "Zuma Dubai", "DIFC").
    const restClean = l.text.split(/\s*[|,()[\]–—،]\s*|\s+-\s+/).filter(part => !isDatePart(part)).join(" | ");
    const before: string[] = [];
    for (let k = i - 1; k >= 0 && k >= i - 2; k--) {
      const prev = pool[k].text;
      if (RANGE.test(norm(prev)) || /^[•\-*–▪●◦]/.test(prev) || prev.length > 120) break;
      before.unshift(prev);
    }
    const sameLine = restClean.replace(/^[\s|•·,–—-]+|[\s|•·,–—-]+$/g, "");
    const fromLine = sameLine ? splitTitleEmployer([sameLine]) : { title: "", employer: "", place: null };
    const fromAbove = splitTitleEmployer(before);
    const title = fromLine.title || fromAbove.title;
    const employer = fromLine.employer || fromAbove.employer || (fromLine.title && fromAbove.title && fromAbove.title !== fromLine.title ? fromAbove.title : "");
    if (!title && !employer) return;
    jobs.push({
      title: title.slice(0, 120),
      employer: employer.slice(0, 120),
      start: start.value,
      end: end?.value ?? null,
      current,
      datesSure: start.month && (current || Boolean(end?.month)),
    });
  });
  // The same job written twice (a summary and a detail), most recent first.
  const seen = new Set<string>();
  return jobs
    .filter(j => { const k = `${norm(j.title)}|${norm(j.employer)}|${j.start}`; if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0) || (b.start ?? "").localeCompare(a.start ?? ""));
}

/** Months between two dates written as YYYY-MM or YYYY (a year alone counts from January or to December). */
function monthIndex(d: string, edge: "start" | "end"): number {
  const [y, m] = d.split("-").map(Number);
  return y * 12 + (m ? m - 1 : edge === "start" ? 0 : 11);
}

function yearsOf(jobs: CvJob[], now: Date): Fact<number> | undefined {
  const spans = jobs
    .filter(j => j.start)
    .map(j => [monthIndex(j.start!, "start"), j.current || !j.end ? now.getFullYear() * 12 + now.getMonth() : monthIndex(j.end, "end")] as [number, number])
    .filter(([a, b]) => b >= a)
    .sort((a, b) => a[0] - b[0]);
  if (!spans.length) return undefined;
  let total = 0;
  let [cs, ce] = spans[0];
  for (const [s, e] of spans.slice(1)) {
    if (s <= ce + 1) ce = Math.max(ce, e);
    else { total += ce - cs + 1; [cs, ce] = [s, e]; }
  }
  total += ce - cs + 1;
  const years = Math.round((total / 12) * 2) / 2;
  if (years <= 0 || years > 60) return undefined;
  return { value: years, source: "worked-out", sure: jobs.every(j => j.datesSure) };
}

// ── Lists ────────────────────────────────────────────────────────────────────

const BULLET = /^[•\-*–▪●◦►✓✔]\s*/;
const clip = (s: string, n = 160) => s.replace(BULLET, "").replace(/\s+/g, " ").trim().slice(0, n);

const CERT = /(haccp|food safety|food hygiene|person in charge|\bpic\b|wset|court of master sommeliers|sommelier certificat\w*|cicerone|sca\b|specialty coffee association|barista (skills|foundation|certificat\w*)|servsafe|first aid|fire (safety|warden)|alcohol (licen[cs]e|awareness)|tips certif\w*|\bcpa\b|\bacca\b|\bcma\b|\bcfa\b|\bpmp\b|prince2|\bcipd\b|\bielts\b|\btoefl\b|\bdelf\b|\bdalf\b|\btcf\b|scrum master|six sigma|nebosh|iosh|rera|certified|certificate|certification|certificat|شهاده)/u;

function sectionLines(lines: Line[], section: Section, max: number): string[] {
  return lines.filter(l => l.section === section).map(l => clip(l.text)).filter(t => t.length > 2).slice(0, max);
}

const LEVELS: [RegExp, CvLanguage["level"]][] = [
  [/(native|mother tongue|first language|langue maternelle|maternelle|اللغه الام|لغه ام)/u, "Native"],
  [/(fluent|fluency|bilingual|courant|bilingue|c2|c1|excellent|ممتاز|طلاقه|اجاده)/u, "Fluent"],
  [/(professional|working|business|advanced|very good|tres bien|b2|avance|جيد جدا)/u, "Professional"],
  [/(intermediate|conversational|good|b1|moyen|intermediaire|جيد|متوسط)/u, "Intermediate"],
  [/(basic|beginner|elementary|notions|scolaire|a1|a2|debutant|مبتدئ|اساسي)/u, "Basic"],
];

function findLanguages(lines: Line[]): Fact<CvLanguage[]> | undefined {
  const own = lines.filter(l => l.section === "languages");
  const pool = own.length ? own : lines.filter(l => parseLanguages(l.text).length && LEVELS.some(([re]) => re.test(norm(l.text))));
  const out: CvLanguage[] = [];
  for (const l of pool) {
    // "English (fluent), Arabic (native)": each language takes the level written next to it.
    const chunks = l.text.split(/[,;|•·/]|\s{2,}/);
    for (const chunk of chunks) {
      for (const name of parseLanguages(chunk)) {
        if (out.some(x => x.name === name)) continue;
        const n = norm(chunk);
        out.push({ name, level: LEVELS.find(([re]) => re.test(n))?.[1] ?? null });
      }
    }
  }
  return out.length ? { value: out, source: "cv", sure: own.length > 0 } : undefined;
}

const ACHIEVEMENT = /(\d+\s*%|\d+\s*(?:k|m|million|thousand)\b|(?:aed|usd|eur|gbp|sar|qar|\$|€|£)\s*\d|increased|grew|raised|reduced|cut|saved|improved|achieved|won|awarded|exceeded|record|doubled|augment|reduit|ameliore|زياده|خفض|حققت)/u;
const LEADERSHIP = /(?<![\p{L}])(team of \d+|\d+\s*(?:staff|employees|people|direct reports|team members|outlets|restaurants|venues|waiters|servers|bartenders|chefs)|managed|managing|led|leading|supervised|supervising|oversaw|overseeing|trained|training new|coached|mentored|recruited|hired|equipe de \d+|encadrement|encadre|dirige|gere|ادار|اشرف|قاد|فريق من)(?![\p{L}])/u;

function bulletsMatching(lines: Line[], re: RegExp, max: number): string[] {
  const out: string[] = [];
  for (const l of lines) {
    if (l.section !== "experience" && l.section !== "achievements" && l.section !== "summary") continue;
    const n = norm(l.text);
    if (l.text.length < 25 || RANGE.test(n) || !re.test(n)) continue;
    const c = clip(l.text, 200);
    if (!out.includes(c)) out.push(c);
    if (out.length >= max) break;
  }
  return out;
}

// ── All together ─────────────────────────────────────────────────────────────

export function parseCv(text: string, now = new Date()): CvFacts {
  const lines = linesOf(text);
  const facts: CvFacts = {};

  facts.name = findName(lines);
  const email = text.match(EMAIL)?.[0];
  if (email) facts.email = { value: email.replace(/[.,;:]+$/, ""), source: "cv", sure: true };
  facts.phone = findPhone(text);
  facts.location = findLocation(lines);

  const jobs = findJobs(lines);
  if (jobs.length) facts.jobs = { value: jobs.slice(0, 12), source: "cv", sure: jobs.every(j => j.datesSure && j.title && j.employer) };
  facts.years = yearsOf(jobs, now);

  // The CV's own headline: a short line after the name that names a job ("Restaurant Manager | Fine Dining").
  const top = lines.filter(l => l.section === null).slice(0, 6);
  const ownHeadline = top.find(l => l.text !== facts.name?.value && l.text.length <= 90 && !EMAIL.test(l.text) && !/\d{6,}/.test(l.text.replace(/\D/g, "")) && (familyOfTitle(l.text) || ROLE_WORD.test(norm(l.text))));
  const latest = jobs[0];
  if (ownHeadline) facts.headline = { value: clip(ownHeadline.text, 120), source: "cv", sure: true };
  else if (latest?.title) facts.headline = { value: [latest.title, latest.employer].filter(Boolean).join(", ").slice(0, 120), source: "cv", sure: latest.datesSure };

  // Suggested roles: the most recent jobs' titles, as the agent knows them.
  const roles: string[] = [];
  const add = (r: string) => { const c = r.trim(); if (c && c.length <= 60 && !roles.some(x => norm(x) === norm(c))) roles.push(c); };
  for (const j of jobs.slice(0, 3)) {
    if (!j.title) continue;
    const f = familyOfTitle(j.title);
    add(f ? familyLabel(f) : cleanTitle(j.title).replace(/^\p{L}/u, c => c.toUpperCase()));
  }
  if (!roles.length && ownHeadline) { const f = familyOfTitle(ownHeadline.text); if (f) add(familyLabel(f)); }
  if (roles.length) facts.roles = { value: roles.slice(0, 3), source: "worked-out", sure: false };

  const education = sectionLines(lines, "education", 6);
  if (education.length) facts.education = { value: education, source: "cv", sure: true };
  else {
    const guessed = lines.filter(l => DEGREE.test(norm(l.text)) && l.text.length < 140).map(l => clip(l.text)).slice(0, 4);
    if (guessed.length) facts.education = { value: guessed, source: "cv", sure: false };
  }

  const certs = sectionLines(lines, "certifications", 8);
  for (const l of lines) {
    if (certs.length >= 10) break;
    if (l.section === "certifications" || l.section === "education" || l.text.length > 140) continue;
    if (/(haccp|food safety|food hygiene|person in charge|wset|sommelier certif|barista certif|servsafe|first aid|\bcpa\b|\bacca\b|\bcma\b|\bpmp\b|prince2|\bcipd\b|nebosh|iosh|rera|\bielts\b|\bdelf\b)/u.test(norm(l.text))) {
      const c = clip(l.text);
      if (!certs.includes(c) && CERT.test(norm(c))) certs.push(c);
    }
  }
  if (certs.length) facts.certifications = { value: certs, source: "cv", sure: true };

  facts.languages = findLanguages(lines);
  const skills = extractSkills(text);
  if (skills.length) facts.skills = { value: skills.slice(0, 40), source: "cv", sure: true };
  const achievements = bulletsMatching(lines, ACHIEVEMENT, 6);
  if (achievements.length) facts.achievements = { value: achievements, source: "cv", sure: true };
  const leadership = bulletsMatching(lines, LEADERSHIP, 5);
  if (leadership.length) facts.leadership = { value: leadership, source: "cv", sure: true };

  for (const k of Object.keys(facts) as (keyof CvFacts)[]) if (facts[k] === undefined) delete facts[k];
  return facts;
}

/** Canonical language names the parser knows, for the review screen. */
export const KNOWN_LANGUAGES = LANGUAGES.map(l => l.name);
