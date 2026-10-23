// lib/agent/interview/state.ts — server only. Checks what the browser sends to the interview API:
// the setup, the candidate facts, earlier sessions and the session state that travels with each
// answer. Anything malformed or too large is refused; text is trimmed to fixed lengths. The state
// only ever affects the sender's own practice session, and access is checked on every call.

import { CRITERIA, IV_DIFFICULTIES, IV_TYPES } from "./types";
import type {
  Competency, Criterion, FollowReason, IvAnswerInput, IvCandidate, IvHistory, IvJob, IvQuestion, IvSetup, IvState, IvTurn,
} from "./types";
import { trackById } from "./tracks";
import type { WorkEntry } from "../types";

const COMPETENCIES: Competency[] = [
  "motivation", "experience", "guest", "complaint", "teamwork", "conflict", "pressure", "problem", "initiative", "learning", "integrity",
  "communication", "sales", "quality", "safety", "product", "leadership", "people", "finance", "operations", "stakeholder", "strategy",
  "change", "practical",
];
const REASONS: FollowReason[] = ["short", "example", "result", "figures", "ownership", "vague", "resolution", "why", "progress", "probe", "challenge"];
const TURN_KINDS: IvTurn["kind"][] = ["intro", "question", "followup", "closing", "end", "answer", "skip"];

/** The longest answer kept: about 700 words, several minutes of speech. */
export const MAX_ANSWER = 4000;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, max: number): string => (typeof v === "string" ? v.replace(/\u0000/g, "").trim().slice(0, max) : "");
const list = (v: unknown, maxItems: number, maxLen: number): string[] =>
  Array.isArray(v) ? v.map(x => str(x, maxLen)).filter(Boolean).slice(0, maxItems) : [];
const int = (v: unknown, min: number, max: number): number | null =>
  typeof v === "number" && Number.isInteger(v) && v >= min && v <= max ? v : null;
const oneOf = <T extends string>(v: unknown, xs: readonly T[]): T | null => (typeof v === "string" && (xs as readonly string[]).includes(v) ? (v as T) : null);
const date = (v: unknown): string | null => (typeof v === "string" && /^\d{4}(-\d{2})?$/.test(v) ? v : null);
const iso = (v: unknown): string => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(v) && v.length <= 30 ? v : new Date().toISOString());

export function parseJob(v: unknown): IvJob | null {
  if (!isObj(v)) return null;
  const title = str(v.title, 200);
  if (!title) return null;
  return {
    ...(str(v.id, 200) ? { id: str(v.id, 200) } : {}),
    title, company: str(v.company, 160), location: str(v.location, 160), description: str(v.description, 8000),
  };
}

export function parseSetup(v: unknown): IvSetup | null {
  if (!isObj(v)) return null;
  const lang = oneOf(v.lang, ["en", "fr", "ar"] as const);
  const type = oneOf(v.type, IV_TYPES);
  const difficulty = oneOf(v.difficulty, IV_DIFFICULTIES);
  const length = v.length === 5 || v.length === 8 ? v.length : null;
  const job = parseJob(v.job);
  const role = str(v.role, 120) || job?.title.slice(0, 120) || "";
  if (!lang || !type || !difficulty || !length || !role) return null;
  return { lang, type, difficulty, length, role, job };
}

function parseWork(v: unknown): WorkEntry | null {
  if (!isObj(v)) return null;
  const title = str(v.title, 120);
  if (!title) return null;
  return { title, employer: str(v.employer, 120), start: date(v.start), end: date(v.end), current: v.current === true, datesSure: v.datesSure !== false };
}

export function parseCandidate(v: unknown): IvCandidate {
  const o = isObj(v) ? v : {};
  const years = typeof o.yearsExperience === "number" && o.yearsExperience >= 0 && o.yearsExperience <= 60 ? o.yearsExperience : null;
  return {
    headline: str(o.headline, 200),
    skills: list(o.skills, 40, 80),
    languages: list(o.languages, 10, 40),
    countries: list(o.countries, 12, 2).map(c => c.toUpperCase()).filter(c => /^[A-Z]{2}$/.test(c)),
    location: str(o.location, 120),
    experience: (Array.isArray(o.experience) ? o.experience : []).slice(0, 20).map(parseWork).filter((w): w is WorkEntry => w !== null),
    yearsExperience: years,
    education: list(o.education, 10, 160),
    certifications: list(o.certifications, 15, 160),
  };
}

const ID = /^[a-z0-9][a-z0-9.:-]{0,59}$/i;

export function parseHistory(v: unknown): IvHistory | null {
  if (!isObj(v)) return null;
  const asked = (Array.isArray(v.asked) ? v.asked : []).slice(0, 200).flatMap(a => {
    if (!isObj(a) || typeof a.id !== "string" || !ID.test(a.id)) return [];
    const score = typeof a.score === "number" && a.score >= 0 && a.score <= 4 ? a.score : null;
    return [{ id: a.id, score }];
  });
  const weak = (Array.isArray(v.weak) ? v.weak : []).map(w => oneOf(w, CRITERIA)).filter((w): w is Criterion => w !== null);
  return { sessions: int(v.sessions, 0, 10_000) ?? 0, asked, weak: [...new Set(weak)] };
}

function parseQuestion(v: unknown): IvQuestion | null {
  if (!isObj(v)) return null;
  const id = typeof v.id === "string" && ID.test(v.id) ? v.id : null;
  const competency = oneOf(v.competency, COMPETENCIES);
  const kind = oneOf(v.kind, ["opener", "main", "closing"] as const);
  const source = oneOf(v.source, ["bank", "cv", "job"] as const);
  if (!id || !competency || !kind || !source) return null;
  const terms = list(v.terms, 6, 40);
  const callback = str(v.callback, 80);
  return {
    id, text: str(v.text, 600), competency, kind, source,
    behavioural: v.behavioural === true, figures: v.figures === true,
    covers: list(v.covers, 6, 200), keys: list(v.keys, 8, 400),
    ...(terms.length ? { terms } : {}),
    ...(v.repeat === true ? { repeat: true } : {}),
    ...(callback ? { callback } : {}),
  };
}

function parseTurn(v: unknown, planLength: number): IvTurn | null {
  if (!isObj(v)) return null;
  const by = oneOf(v.by, ["interviewer", "candidate"] as const);
  const q = int(v.q, 0, Math.max(0, planLength - 1));
  const kind = oneOf(v.kind, TURN_KINDS);
  if (!by || q === null || !kind) return null;
  if ((by === "candidate") !== (kind === "answer" || kind === "skip")) return null;
  const why = oneOf(v.why, REASONS);
  const mode = oneOf(v.mode, ["voice", "text"] as const);
  const speechSec = int(v.speechSec, 1, 1800);
  return {
    by, q, kind, text: str(v.text, by === "candidate" ? MAX_ANSWER : 1500),
    ...(why ? { why } : {}), ...(mode ? { mode } : {}), ...(speechSec ? { speechSec } : {}),
    at: iso(v.at),
  };
}

/** The session state as the browser sent it back, or null when it isn't a valid interview. */
export function parseState(v: unknown): IvState | null {
  if (!isObj(v) || v.v !== 1) return null;
  const id = typeof v.id === "string" && /^[a-z0-9-]{8,64}$/i.test(v.id) ? v.id : null;
  const setup = parseSetup(v.setup);
  const track = typeof v.track === "string" && trackById(v.track).id === v.track ? v.track : null;
  const level = int(v.level, 1, 7);
  if (!id || !setup || !track || level === null || !Array.isArray(v.plan) || !Array.isArray(v.turns)) return null;
  if (v.plan.length < 2 || v.plan.length > 12 || v.turns.length > 120) return null;
  const plan = v.plan.map(parseQuestion);
  if (plan.some(q => q === null)) return null;
  const turns = v.turns.map(t => parseTurn(t, plan.length));
  if (turns.some(t => t === null)) return null;
  const step = int(v.step, 0, plan.length);
  const follow = int(v.follow, 0, 3);
  if (step === null || follow === null) return null;
  return {
    v: 1, id, setup, track, level, engine: "rules",
    plan: plan as IvQuestion[], turns: turns as IvTurn[], step, follow, done: v.done === true, startedAt: iso(v.startedAt),
  };
}

export function parseInput(v: unknown): IvAnswerInput | null {
  if (!isObj(v)) return null;
  const mode = oneOf(v.mode, ["voice", "text"] as const);
  if (!mode) return null;
  const speechSec = typeof v.speechSec === "number" && v.speechSec > 0 && v.speechSec <= 1800 ? v.speechSec : undefined;
  return { text: str(v.text, MAX_ANSWER), mode, ...(speechSec ? { speechSec } : {}), ...(v.skip === true ? { skip: true } : {}) };
}
