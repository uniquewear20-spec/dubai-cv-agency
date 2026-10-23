// lib/agent/interview/engine.ts — server only. The built-in interviewer: plans an interview for a
// role (its track, seniority, the interview type and difficulty, the CV and the job listing, and
// earlier sessions), then reacts to each answer with fixed rules: a follow-up when something is
// missing (an example, a result, figures, the candidate's own part, reasoning), a probe on a role
// term the candidate used, or the next question, sometimes picking up a term mentioned earlier.
//
// Deterministic for a given session id, so the same answers give the same interview.

import { countriesIn, countryName } from "../countries";
import { mentions, norm, words as contentWords } from "../text";
import { analyse, hasGroup, lexicon, normMap, type Analysis } from "./analyze";
import type { BankQ, Track } from "./bank";
import { CORE } from "./bank-core";
import { SHIFTS } from "./bank-hospitality";
import {
  ACK, CALLBACK, CLOSING, CLOSING_COVERS, CV_Q, END, FOLLOW, GENERIC_KEYS, INTRO, JOB_Q, NEXT, QUOTE, REPEAT, START, TONE,
} from "./phrases";
import { bankQuestion, detectTrack, trackById } from "./tracks";
import type { Competency, FollowReason, IvAnswerInput, IvCandidate, IvHistory, IvLang, IvQuestion, IvSetup, IvState, IvTurn, IvType } from "./types";

// ── Randomness that repeats for the same session ─────────────────────────────

function hash(s: string): number {
  let h = 2166136261;
  for (const c of s) { h ^= c.codePointAt(0)!; h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function rng(seed: string): () => number {
  let a = hash(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(xs: T[], r: () => number): T => xs[Math.floor(r() * xs.length) % xs.length];

function shuffle<T>(xs: T[], r: () => number): T[] {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ── Context for one interview ────────────────────────────────────────────────

interface Ctx {
  setup: IvSetup;
  lang: IvLang;
  type: IvType;
  level: number;
  track: Track;
  /** The job's country, or the first target country. */
  country: string | null;
  company: string | null;
  /** Where the job is, when the candidate lives elsewhere (for the relocation question). */
  place: string | null;
  role: string;
}

function contextOf(setup: IvSetup, candidate: IvCandidate, track: Track, level: number): Ctx {
  const job = setup.job;
  const jobCountry = job?.location ? countriesIn(job.location)[0] ?? null : null;
  const country = jobCountry ?? candidate.countries[0] ?? null;
  const livesThere = country && candidate.location ? countriesIn(candidate.location).includes(country) : null;
  let place: string | null = null;
  if (livesThere === false) place = job?.location ? job.location.split(/[,;|]/)[0].trim() : countryName(country!, setup.lang);
  return {
    setup, lang: setup.lang, type: setup.type, level, track, country,
    company: job?.company?.trim() || null,
    place,
    role: (job?.title || setup.role).trim(),
  };
}

const fill = (text: string, c: Ctx) => text.replace("{role}", c.role).replace("{company}", c.company ?? "").replace("{place}", c.place ?? "");

function fromBank(b: BankQ, c: Ctx): IvQuestion {
  return {
    id: b.id,
    text: fill(b.q[c.lang], c),
    competency: b.comp,
    kind: b.slot === "opener" ? "opener" : "main",
    source: "bank",
    behavioural: b.beh,
    figures: b.fig,
    covers: b.covers[c.lang],
    keys: b.keys[c.lang],
    ...(b.terms.length ? { terms: b.terms } : {}),
  };
}

/** The question can be asked in this interview: seniority, country, the facts it needs. */
function fits(b: BankQ, c: Ctx): boolean {
  if (b.lv[0] > c.level + 1 || b.lv[1] < c.level - 1) return false;
  if (b.countries && (!c.country || !b.countries.includes(c.country))) return false;
  if (b.except && c.country && b.except.includes(c.country)) return false;
  if (b.needs?.includes("company") && !c.company) return false;
  if (b.needs?.includes("place") && !c.place) return false;
  if (b.id === "mot.employer" && c.company) return false; // the company question replaces it
  if (b.hard && c.setup.difficulty !== "demanding") return false;
  return true;
}

// ── Questions from the CV and the listing ────────────────────────────────────

const latestJobs = (candidate: IvCandidate) =>
  [...candidate.experience]
    .filter(j => j.title.trim())
    .sort((a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0) || (b.end ?? b.start ?? "").localeCompare(a.end ?? a.start ?? ""));

function cvQuestion(candidate: IvCandidate, c: Ctx, used: Set<string>, r: () => number): IvQuestion | null {
  const p = CV_Q[c.lang];
  const keys = (extra: string) => [...contentWords(extra).slice(0, 2), ...GENERIC_KEYS[c.lang]];
  const jobs = latestJobs(candidate);
  const options: IvQuestion[] = [];
  if (jobs[0] && !used.has("cv.achievement")) {
    const j = jobs[0];
    options.push({ id: "cv.achievement", text: p.achievement(j.title.trim(), j.employer.trim()), competency: "initiative", kind: "main", source: "cv",
      behavioural: true, figures: true, covers: p.achievementCovers, keys: keys(j.title) });
  }
  if (c.type === "screening" && jobs.length >= 2 && jobs[0].employer && jobs[1].employer && jobs[0].employer !== jobs[1].employer && !used.has("cv.move")) {
    options.push({ id: "cv.move", text: p.move(jobs[1].employer.trim(), jobs[0].employer.trim()), competency: "motivation", kind: "main", source: "cv",
      behavioural: false, figures: false, covers: p.moveCovers, keys: [...GENERIC_KEYS[c.lang].slice(0, 1)] });
  }
  const listing = c.setup.job?.description ?? "";
  const skill = listing ? candidate.skills.find(s => mentions(listing, s)) : undefined;
  if (skill && !used.has("cv.skill")) {
    options.push({ id: "cv.skill", text: p.skill(skill), competency: "product", kind: "main", source: "cv",
      behavioural: true, figures: false, covers: p.skillCovers, keys: keys(skill) });
  }
  const cert = candidate.certifications.find(x => x.trim().length >= 3);
  if (cert && !used.has("cv.cert")) {
    options.push({ id: "cv.cert", text: p.cert(cert.trim()), competency: "learning", kind: "main", source: "cv",
      behavioural: true, figures: false, covers: p.certCovers, keys: keys(cert) });
  }
  if (candidate.yearsExperience && candidate.yearsExperience >= 3 && !used.has("cv.years")) {
    options.push({ id: "cv.years", text: p.years(Math.round(candidate.yearsExperience)), competency: "learning", kind: "main", source: "cv",
      behavioural: true, figures: false, covers: p.yearsCovers, keys: GENERIC_KEYS[c.lang] });
  }
  if (!options.length) return null;
  // The achievement question first; otherwise a varied choice.
  return options[0].id === "cv.achievement" && r() < 0.6 ? options[0] : pick(options, r);
}

const REQUIREMENT = /(experience|knowledge|ability|able to|proficien|must|required|minimum|years|fluent|certif|degree|skilled|familiar|expérience|experience|connaissance|maîtrise|maitrise|exigé|requis|minimum|ans d|diplôme|خبرة|معرفة|إجادة|اجادة|شهادة|سنوات)/iu;
const NOT_REQUIREMENT = /(salary|benefit|visa|we offer|apply|e-?mail|http|www\.|whatsapp|package|accommodation|salaire|avantages|postuler|راتب|مزايا|سكن)/iu;

/** Requirement lines from a listing, most specific first. */
export function requirementsOf(description: string): string[] {
  const lines = description.split(/\n|•|·|;|(?<=\.)\s+(?=[A-Z])/).map(l => l.replace(/^[\s\-–*▪●■◦]+/, "").replace(/\s+/g, " ").trim());
  return [...new Set(lines)]
    .filter(l => l.length >= 25 && l.length <= 150 && REQUIREMENT.test(l) && !NOT_REQUIREMENT.test(l))
    .sort((a, b) => contentWords(b).length - contentWords(a).length)
    .slice(0, 3);
}

function jobQuestion(c: Ctx, used: Set<string>, r: () => number): IvQuestion | null {
  const reqs = c.setup.job ? requirementsOf(c.setup.job.description).filter((_, i) => !used.has(`job.${i}`)) : [];
  if (!reqs.length) return null;
  const all = c.setup.job ? requirementsOf(c.setup.job.description) : [];
  const req = reqs[Math.floor(r() * Math.min(2, reqs.length))];
  const i = all.indexOf(req);
  const p = JOB_Q[c.lang];
  return {
    id: `job.${i}`, text: p.ask(req.replace(/[.:]$/, "")), competency: "experience", kind: "main", source: "job",
    behavioural: true, figures: false, covers: p.covers,
    keys: contentWords(req).filter(w => w.length >= 4).slice(0, 4).map(w => (w.length > 6 ? w.slice(0, 6) : w)),
  };
}

// ── Planning ─────────────────────────────────────────────────────────────────

type Slot = "opener" | "motivation" | "leave" | "strengths" | "practical" | "cv" | "job" | "track" | "track-mgr" | "track-exec" | "comp" | "mgmt" | "exec" | "curve";

/** Slots after the opening question, most important first; "a|b" falls back from a to b. */
const SLOTS: Record<IvType, string[]> = {
  screening: ["motivation", "cv|comp", "job|track|comp", "leave|motivation", "comp", "practical", "strengths"],
  professional: ["track", "track", "job|track", "track|comp", "cv|track|comp", "comp", "track|comp"],
  competency: ["comp", "comp", "comp", "cv|comp", "comp", "track|comp", "comp"],
  management: ["mgmt", "track-mgr|mgmt", "mgmt", "track-mgr|mgmt", "comp", "mgmt", "track-mgr|mgmt"],
  executive: ["exec", "exec", "mgmt", "track-exec|exec", "exec", "mgmt|exec", "exec"],
};

const BEHAVIOURAL_COMPS: Competency[] = ["teamwork", "conflict", "pressure", "problem", "initiative", "learning", "integrity", "communication", "guest", "complaint", "quality"];

function poolOf(slot: Slot, c: Ctx): BankQ[] {
  const t = c.track;
  switch (slot) {
    case "opener": return CORE.filter(b => b.slot === "opener" && b.types.includes(c.type));
    case "motivation": case "leave": case "strengths": return CORE.filter(b => b.slot === slot);
    case "practical": return [...CORE.filter(b => b.slot === "practical"), ...(t.hospitality ? [SHIFTS] : [])];
    case "track": return t.questions.filter(b => b.types.includes(c.type) || b.types.includes("professional"));
    case "track-mgr": return t.questions.filter(b => b.lv[1] >= 4 && (b.types.includes("management") || b.types.includes("professional")));
    case "track-exec": return t.questions.filter(b => b.lv[1] >= 6);
    case "comp": return CORE.filter(b => !b.slot && b.id.startsWith("comp.") && (b.types.includes("competency") || b.types.includes(c.type)));
    case "mgmt": return CORE.filter(b => b.id.startsWith("mgmt."));
    case "exec": return CORE.filter(b => b.id.startsWith("exec."));
    case "curve": return CORE.filter(b => b.hard && b.types.includes(c.type));
    default: return [];
  }
}

/** Competencies to favour: weak ones from earlier sessions, then those that matter for the track. */
function priorities(c: Ctx, history: IvHistory | null): Competency[] {
  const weak = (history?.asked ?? [])
    .filter(a => a.score !== null && a.score < 2.5)
    .map(a => bankQuestion(a.id)?.comp)
    .filter((x): x is Competency => Boolean(x));
  return [...new Set([...weak, ...c.track.comps, ...BEHAVIOURAL_COMPS])];
}

export function planInterview(setup: IvSetup, candidate: IvCandidate, history: IvHistory | null, id: string): { plan: IvQuestion[]; track: Track; level: number } {
  const ctxText = [setup.job?.title, setup.job?.description?.slice(0, 600), candidate.headline].filter(Boolean).join(" ");
  const { track, level } = detectTrack(setup.role, setup.job?.title ?? null, ctxText, candidate.yearsExperience);
  const c = contextOf(setup, candidate, track, level);
  const r = rng(`${id}:plan`);
  const askedBefore = new Set((history?.asked ?? []).map(a => a.id));
  const used = new Set<string>();
  const usedComps = new Map<Competency, number>();
  const prio = priorities(c, history);

  const take = (q: IvQuestion) => {
    used.add(q.id);
    usedComps.set(q.competency, (usedComps.get(q.competency) ?? 0) + 1);
    return q;
  };

  const chooseFrom = (pool: BankQ[]): IvQuestion | null => {
    const ok = pool.filter(b => fits(b, c) && !used.has(b.id));
    if (!ok.length) return null;
    const fresh = ok.filter(b => !askedBefore.has(b.id));
    const list = fresh.length ? fresh : ok;
    // Prefer competencies not covered yet, in priority order, then a random pick.
    const rank = (b: BankQ) => (usedComps.get(b.comp) ?? 0) * 100 + (prio.indexOf(b.comp) < 0 ? 50 : prio.indexOf(b.comp));
    const best = Math.min(...list.map(rank));
    const top = shuffle(list.filter(b => rank(b) <= best + 3), r);
    return fromBank(top[0], c);
  };

  const fillSlot = (spec: string): IvQuestion | null => {
    for (const s of spec.split("|") as Slot[]) {
      const q = s === "cv" ? cvQuestion(candidate, c, used, r) : s === "job" ? jobQuestion(c, used, r) : chooseFrom(poolOf(s, c));
      if (q && !used.has(q.id)) return take(q);
    }
    return null;
  };

  const plan: IvQuestion[] = [];
  const opener = fillSlot("opener");
  if (opener) plan.push(opener);
  const slots = SLOTS[setup.type].slice(0, setup.length - 1);
  if (setup.difficulty === "demanding") slots[slots.length - 1] = `curve|${slots[slots.length - 1]}`;
  for (const spec of slots) {
    const q = fillSlot(spec) ?? fillSlot("comp");
    if (q) plan.push(q);
  }

  // One question that scored low last time comes back, so progress can be compared on it.
  const repeat = (history?.asked ?? [])
    .filter(a => a.score !== null && a.score < 2.5 && !used.has(a.id))
    .map(a => ({ a, b: bankQuestion(a.id) }))
    .filter((x): x is { a: { id: string; score: number }; b: BankQ } => Boolean(x.b && fits(x.b, c) && !x.b.slot))
    .sort((x, y) => x.a.score - y.a.score)[0];
  if (repeat && plan.length > 2) {
    const at = Math.min(plan.length - 1, 2);
    plan[at] = { ...fromBank(repeat.b, c), repeat: true };
  }

  plan.push({ id: "close", text: "", competency: "motivation", kind: "closing", source: "bank", behavioural: false, figures: false, covers: CLOSING_COVERS[setup.lang], keys: [] });
  return { plan, track, level };
}

// ── Running the interview ────────────────────────────────────────────────────

const now = () => new Date().toISOString();

function questionText(q: IvQuestion, lang: IvLang, r: () => number): string {
  if (q.kind === "closing") return pick(CLOSING[lang], r);
  const prefix = q.repeat ? `${REPEAT[lang]} ` : q.callback ? `${CALLBACK[lang](q.callback)} ` : "";
  return `${prefix}${q.text}`;
}

export function startInterview(setup: IvSetup, candidate: IvCandidate, history: IvHistory | null, id: string): IvState {
  const { plan, track, level } = planInterview(setup, candidate, history, id);
  const r = rng(`${id}:talk:0`);
  const c = contextOf(setup, candidate, track, level);
  const mains = plan.filter(q => q.kind !== "closing").length;
  const intro = `${INTRO[setup.lang][setup.type](c.role, c.company, mains)}${TONE[setup.lang][setup.difficulty]} ${START[setup.lang]}`;
  const turns: IvTurn[] = [
    { by: "interviewer", q: 0, kind: "intro", text: intro, at: now() },
    { by: "interviewer", q: 0, kind: plan[0].kind === "closing" ? "closing" : "question", text: questionText(plan[0], setup.lang, r), at: now() },
  ];
  return { v: 1, id, setup, track: track.id, level, engine: "rules", plan, turns, step: 0, follow: 0, done: false, startedAt: now() };
}

export type AnswerInput = IvAnswerInput;

/** Candidate answers so far on one question, oldest first. */
export const answersFor = (s: IvState, q: number) => s.turns.filter(t => t.by === "candidate" && t.q === q && t.kind === "answer").map(t => t.text);

const MAX_FOLLOW = { friendly: 1, realistic: 1, demanding: 2 } as const;

/** Role-specific competencies, where a topic the candidate raises is worth a probe. */
const TOPIC_COMPS: Competency[] = ["operations", "finance", "sales", "product", "quality", "safety", "guest", "experience", "strategy"];

/** Words that show the candidate acted on a weakness. */
const PROGRESS: Record<IvLang, string> = {
  en: "since|now i|nowadays|started|course|practis|practic|working on|changed|improv|better at|learn|training|mentor|feedback",
  fr: "depuis|desormais|maintenant|aujourd'hui|commence|formation|pratique|travaille|change|amelior|progres|appris|mentor|retour",
  ar: "منذ|الان|اصبحت|بدات|دوره|تدريب|اتدرب|اعمل على|غيرت|تحسن|تعلمت|ملاحظ",
};

function firstPhrase(text: string, re: RegExp, lang: IvLang, words = 7): string | null {
  const n = normMap(text);
  re.lastIndex = 0;
  const m = re.exec(n.text);
  if (!m) return null;
  const from = n.map[m.index];
  const piece = text.slice(from).split(/\s+/).slice(0, words).join(" ").replace(/[,.;:!?،؛]+$/, "");
  return piece || null;
}

/** The follow-up the rules choose for the latest answer, or null to move on. */
export function chooseFollow(s: IvState): { why: FollowReason; text: string } | null {
  const q = s.plan[s.step];
  if (!q || q.kind === "closing" || s.follow >= MAX_FOLLOW[s.setup.difficulty]) return null;
  const lang = s.setup.lang;
  const track = trackById(s.track);
  const answers = answersFor(s, s.step);
  const latest = answers[answers.length - 1] ?? "";
  const lastA = analyse(latest, lang);
  const all: Analysis = analyse(answers.join("\n"), lang, { keys: q.keys, terms: track.terms });
  const asked = new Set(s.turns.filter(t => t.kind === "followup" && t.q === s.step).map(t => t.why));
  const probed = new Set(s.turns.filter(t => t.kind === "followup" && t.why === "probe").map(t => t.text));
  const r = rng(`${s.id}:follow:${s.step}:${s.follow}`);
  const friendly = s.setup.difficulty === "friendly";
  const demanding = s.setup.difficulty === "demanding";
  const say = (why: FollowReason, key: keyof (typeof FOLLOW)["en"] = why, quote?: string | null) => {
    const options = FOLLOW[lang][key].filter(t => (quote ? true : !t.includes("{quote}")));
    const text = pick(options.length ? options : FOLLOW[lang][key], r).replace("{quote}", quote ? QUOTE[lang](quote) : "");
    return { why, text };
  };

  const candidates: (() => { why: FollowReason; text: string } | null)[] = [];
  const shortLimit = friendly ? 12 : q.kind === "opener" ? 25 : 20;
  candidates.push(() => (lastA.words < shortLimit && !asked.has("short") ? say("short") : null));
  if (q.kind === "opener" || q.competency === "practical") return candidates[0]();

  if (q.behavioural) {
    candidates.push(() => (!all.example && !asked.has("example") ? say("example") : null));
    if (!friendly) {
      const resolutionLike = q.competency === "conflict" || q.competency === "complaint";
      candidates.push(() => (all.example && !all.result && !asked.has("result") && !asked.has("resolution")
        ? (resolutionLike ? say("resolution") : say("result")) : null));
      candidates.push(() => {
        if (!q.figures || !all.result || all.figures.length) return null;
        if (!asked.has("figures")) return say("figures");
        return demanding && !asked.has("challenge") ? say("challenge", "no-figures-again") : null;
      });
      candidates.push(() => (all.we >= 2 && all.we > all.i && !asked.has("ownership")
        ? say("ownership", "ownership", firstPhrase(answers.join("\n"), lexicon(lang).we, lang)) : null));
      candidates.push(() => (all.vague.length && !asked.has("vague") ? say("vague", "vague", all.vague[0]) : null));
    }
  } else if (!friendly) {
    const vague = () => (all.vague.length && !asked.has("vague") ? say("vague", "vague", all.vague[0]) : null);
    if (q.competency === "motivation") {
      // Why this job, why leave: reasons are personal, so only clichés get a follow-up.
      candidates.push(vague);
    } else if (q.competency === "integrity") {
      // A weakness or what a manager would criticise: what the candidate has done about it.
      candidates.push(() => (!hasGroup(norm(answers.join("\n")), PROGRESS[lang], lang) && !asked.has("progress") ? say("progress") : null));
      candidates.push(vague);
    } else {
      candidates.push(() => (!all.reasoning.length && lastA.words < 120 && !asked.has("why") ? say("why") : null));
      candidates.push(() => (!all.example && !asked.has("example") ? say("example", "scenario-example") : null));
    }
  }

  if (!friendly) {
    // Dig into the role topic for the figures behind it, once per term in the interview: the
    // question's own topic, or a topic the candidate raised in a role-specific question. Not when
    // the answer already gave figures.
    candidates.push(() => {
      if (asked.has("probe") || all.figures.length || all.numbers >= 2) return null;
      const ids = q.terms?.length ? q.terms : TOPIC_COMPS.includes(q.competency) ? analyse(latest, lang, { terms: track.terms }).terms : [];
      for (const id of ids) {
        const text = track.terms.find(t => t.id === id)?.probe?.[lang];
        if (text && !probed.has(text)) return { why: "probe" as FollowReason, text };
      }
      return null;
    });
  }
  if (demanding) candidates.push(() => (s.follow >= 1 && !asked.has("challenge") ? say("challenge") : null));

  for (const next of candidates) {
    const f = next();
    if (f) return f;
  }
  return null;
}

/** Swaps the next track question for one about a role term the candidate brought up. */
function callbackFor(s: IvState): void {
  const q = s.plan[s.step];
  if (!q || q.kind !== "main" || q.source !== "bank" || q.repeat || q.callback || q.competency === "practical" || q.competency === "motivation") return;
  const track = trackById(s.track);
  if (!track.questions.some(b => b.id === q.id)) return;
  const max = s.plan.length > 7 ? 2 : 1;
  if (s.plan.filter(p => p.callback).length >= max) return;
  const said = s.turns.filter(t => t.by === "candidate" && t.kind === "answer").map(t => t.text).join("\n");
  const mentioned = analyse(said, s.setup.lang, { terms: track.terms }).terms;
  const inPlan = new Set(s.plan.map(p => p.id));
  const usedLabels = new Set(s.plan.map(p => p.callback).filter(Boolean));
  // Keep the plan's spread of competencies: the new question covers the same one, or the replaced
  // one is covered elsewhere and the new one adds a competency.
  const otherComps = new Set(s.plan.filter((p, i) => i !== s.step && p.kind !== "closing").map(p => p.competency));
  for (const termId of mentioned) {
    if (usedLabels.has(track.terms.find(t => t.id === termId)?.label[s.setup.lang])) continue;
    const b = track.questions.find(x => x.terms.includes(termId) && !inPlan.has(x.id) && x.lv[0] <= s.level + 1 && x.lv[1] >= s.level - 1
      && (x.comp === q.competency || (otherComps.has(q.competency) && !otherComps.has(x.comp)))
      && (x.types.includes(s.setup.type) || x.types.includes("professional")) && (!x.hard || s.setup.difficulty === "demanding"));
    if (!b) continue;
    const label = track.terms.find(t => t.id === termId)!.label[s.setup.lang];
    const job = s.setup.job;
    const c = { setup: s.setup, lang: s.setup.lang, type: s.setup.type, level: s.level, track, country: null, company: job?.company?.trim() || null, place: null, role: (job?.title || s.setup.role).trim() } as Ctx;
    s.plan[s.step] = { ...fromBank(b, c), callback: label };
    return;
  }
}

function advance(s: IvState): IvState {
  const lang = s.setup.lang;
  const r = rng(`${s.id}:talk:${s.step + 1}`);
  s.step += 1;
  s.follow = 0;
  if (s.step >= s.plan.length) { s.done = true; return s; }
  callbackFor(s);
  const next = s.plan[s.step];
  const ack = pick(ACK[lang], r);
  const transition = next.kind === "closing" || next.callback || next.repeat ? "" : pick(NEXT[lang], r);
  const text = [ack, transition, questionText(next, lang, r)].filter(Boolean).join(" ");
  s.turns.push({ by: "interviewer", q: s.step, kind: next.kind === "closing" ? "closing" : "question", text, at: now() });
  return s;
}

/** Records the candidate's answer and adds the interviewer's next turn. */
export function answerTurn(state: IvState, input: AnswerInput): IvState {
  const s: IvState = JSON.parse(JSON.stringify(state));
  if (s.done) return s;
  const q = s.plan[s.step];
  if (!q) { s.done = true; return s; }
  const at = now();
  if (input.skip || !input.text.trim()) {
    s.turns.push({ by: "candidate", q: s.step, kind: "skip", text: "", mode: input.mode, at });
    if (q.kind === "closing") {
      s.turns.push({ by: "interviewer", q: s.step, kind: "end", text: END[s.setup.lang].plain, at });
      s.done = true;
      return s;
    }
    return advance(s);
  }
  s.turns.push({ by: "candidate", q: s.step, kind: "answer", text: input.text.trim(), mode: input.mode, ...(input.speechSec ? { speechSec: Math.round(input.speechSec) } : {}), at });
  if (q.kind === "closing") {
    const asked = analyse(input.text, s.setup.lang).asked;
    s.turns.push({ by: "interviewer", q: s.step, kind: "end", text: asked ? END[s.setup.lang].asked : END[s.setup.lang].plain, at });
    s.done = true;
    return s;
  }
  const follow = chooseFollow(s);
  if (follow) {
    s.turns.push({ by: "interviewer", q: s.step, kind: "followup", text: follow.text, why: follow.why, at });
    s.follow += 1;
    return s;
  }
  return advance(s);
}

/** Ends the interview early (the candidate stops); the report covers what was answered. */
export function endEarly(state: IvState): IvState {
  const s: IvState = JSON.parse(JSON.stringify(state));
  s.done = true;
  return s;
}
