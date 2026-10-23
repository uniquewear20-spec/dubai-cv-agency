// lib/agent/interview/types.ts — shared (browser and server) types of the interview coach.
//
// The interview runs on the server (app/api/agent/interview): the browser sends the session state
// with each answer and gets the interviewer's next turn back. Nothing is stored on the server;
// sessions and reports are kept in the candidate's browser (lib/agent/store.ts).

import type { WorkEntry } from "../types";
import type { LookId } from "./looks";

export type IvLang = "en" | "fr" | "ar";
export type IvType = "screening" | "professional" | "competency" | "management" | "executive";
export type IvDifficulty = "friendly" | "realistic" | "demanding";
/** Questions in the interview, the opening question included and the closing one not. */
export type IvLength = 5 | 8;
/** "rules": the built-in interviewer. "ai": Claude writes the questions and follow-ups (when switched on). */
export type IvEngine = "rules" | "ai";

export const IV_TYPES: IvType[] = ["screening", "professional", "competency", "management", "executive"];
export const IV_DIFFICULTIES: IvDifficulty[] = ["friendly", "realistic", "demanding"];

export type Competency =
  | "motivation" | "experience" | "guest" | "complaint" | "teamwork" | "conflict" | "pressure" | "problem"
  | "initiative" | "learning" | "integrity" | "communication" | "sales" | "quality" | "safety" | "product"
  | "leadership" | "people" | "finance" | "operations" | "stakeholder" | "strategy" | "change" | "practical";

/** The rubric. Every criterion is scored 0–4 from the transcript with fixed rules (see report.ts). */
export type Criterion = "relevance" | "evidence" | "structure" | "ownership" | "reasoning" | "impact" | "communication" | "knowledge";
export const CRITERIA: Criterion[] = ["relevance", "evidence", "structure", "ownership", "reasoning", "impact", "communication", "knowledge"];

/** Why the interviewer asked a follow-up. */
export type FollowReason = "short" | "example" | "result" | "figures" | "ownership" | "vague" | "resolution" | "why" | "progress" | "probe" | "challenge";

export interface IvJob {
  id?: string;
  title: string;
  company: string;
  location: string;
  description: string;
}

export interface IvSetup {
  /** The language of the interview (questions and answers). */
  lang: IvLang;
  type: IvType;
  difficulty: IvDifficulty;
  length: IvLength;
  /** The target role, as the candidate wrote it. */
  role: string;
  /** A saved job to practise for: its listing shapes the questions. */
  job: IvJob | null;
}

/** What the coach knows about the candidate: facts from the profile, never contact details. */
export interface IvCandidate {
  headline: string;
  skills: string[];
  languages: string[];
  /** Target countries (ISO codes). */
  countries: string[];
  location: string;
  experience: WorkEntry[];
  yearsExperience: number | null;
  education: string[];
  certifications: string[];
}

/** Earlier sessions for the same target, so questions aren't repeated by accident and weak ones come back. */
export interface IvHistory {
  sessions: number;
  asked: { id: string; score: number | null }[];
  weak: Criterion[];
}

export interface IvQuestion {
  /** Question-bank id, or cv:…, job:…, open:…, close. Stable across sessions for repeated-question tracking. */
  id: string;
  text: string;
  competency: Competency;
  kind: "opener" | "main" | "closing";
  source: "bank" | "cv" | "job";
  /** Expects a real past example (scored for example, structure and ownership). */
  behavioural: boolean;
  /** Asks about results or performance (scored for figures). */
  figures: boolean;
  /** What a strong answer covers, shown in the report. */
  covers: string[];
  /** Ideas the answer should touch: each group "a|b|c" counts once when any of its words appears. */
  keys: string[];
  /** Glossary terms this question is about (knowledge score, follow-up probes). */
  terms?: string[];
  /** Asked again on purpose: it scored low in an earlier session. */
  repeat?: boolean;
  /** Asked because the candidate mentioned this term earlier ("You mentioned …"). */
  callback?: string;
}

export interface IvTurn {
  by: "interviewer" | "candidate";
  /** Index in the plan of the question this turn belongs to. */
  q: number;
  kind: "intro" | "question" | "followup" | "closing" | "end" | "answer" | "skip";
  text: string;
  why?: FollowReason;
  /** Candidate turns: spoken or typed. */
  mode?: "voice" | "text";
  /** Spoken answers: seconds between the first and the last word heard (for speaking pace). */
  speechSec?: number;
  at: string;
}

export interface IvState {
  v: 1;
  id: string;
  setup: IvSetup;
  /** Interview track (lib/agent/interview/tracks.ts), e.g. "restaurant", "real-estate", "general". */
  track: string;
  /** Seniority 1 (entry) to 7 (executive), from the role. */
  level: number;
  engine: IvEngine;
  plan: IvQuestion[];
  turns: IvTurn[];
  /** Index in the plan of the current question. */
  step: number;
  /** Follow-ups asked on the current question. */
  follow: number;
  done: boolean;
  startedAt: string;
}

// ── Report ───────────────────────────────────────────────────────────────────

/** What the rules found in one answer (main answer and its follow-up answers together). */
export interface AnswerFacts {
  words: number;
  /** Situation, task, action, result: the parts of a STAR answer that were found. */
  star: ("S" | "T" | "A" | "R")[];
  /** A specific situation (a time, a place, a person, a number), not general habits. */
  example: boolean;
  /** Talks about what they usually do instead of a time it happened. */
  habit: boolean;
  /** Figures tied to a result: "12%", "AED 40,000", "cut waste by half". */
  figures: string[];
  /** A result is stated, with or without a figure. */
  result: boolean;
  keysHit: number;
  keysAll: number;
  i: number;
  we: number;
  hedges: string[];
  fillers: number;
  vague: string[];
  negative: string[];
  /** Role vocabulary used (glossary term ids). */
  terms: string[];
  /** Problem-solving language: why (because…), decisions (I chose…), diagnosis (I noticed…), steps (first… then…). */
  reasoning: ("why" | "decision" | "diagnosis" | "steps")[];
  /** The candidate asked a question (closing question). */
  asked: boolean;
  /** Spoken answers: words per minute. */
  wpm: number | null;
}

export type GoodCode = "example" | "star" | "figures" | "result" | "ownership" | "reasoning" | "terms" | "relevance" | "length" | "asked";
export type FixCode =
  | "skipped" | "short" | "long" | "no-example" | "habit" | "no-result" | "no-figures" | "we" | "no-reasoning" | "hedges" | "vague"
  | "negative" | "off-topic" | "no-question" | "fillers";

export interface AnswerReview {
  /** Index in the plan. */
  q: number;
  id: string;
  question: string;
  competency: Competency;
  kind: IvQuestion["kind"];
  answer: string;
  followups: { why: FollowReason; question: string; answer: string }[];
  skipped: boolean;
  facts: AnswerFacts;
  scores: Partial<Record<Criterion, number>>;
  /** Average of this answer's scores (0–4), or null when nothing could be scored. */
  score: number | null;
  good: GoodCode[];
  fix: FixCode[];
  /** A stronger answer's outline, built only from the candidate's own sentences; null parts are missing. */
  outline: { part: "S" | "T" | "A" | "R"; text: string | null }[] | null;
  covers: string[];
}

export type Band = "early" | "developing" | "nearly" | "ready";

export type ActionCode =
  | "figures" | "examples" | "star" | "ownership" | "reasoning" | "long" | "short" | "hedges" | "knowledge" | "relevance"
  | "questions" | "negative" | "vague" | "repeat" | "harder";

export interface IvReport {
  v: 1;
  /** The session id. */
  id: string;
  at: string;
  engine: IvEngine;
  /** The interview language. */
  lang: IvLang;
  answered: number;
  planned: number;
  endedEarly: boolean;
  /** Average of the criteria (0–4), or null when too little was answered. */
  overall: number | null;
  band: Band | null;
  criteria: { id: Criterion; score: number | null; n: number; hit: number }[];
  answers: AnswerReview[];
  /** Plan indexes of the strongest and weakest answers. */
  strongest: number[];
  weakest: number[];
  competencies: { shown: Competency[]; needed: Competency[] };
  /** Role vocabulary (labels in the interview language): used, and core topics not covered. */
  knowledge: { used: string[]; missing: string[] };
  communication: {
    avgWords: number; wpm: number | null; fillers: number; hedges: number; long: number; short: number;
    asked: boolean | null; voice: boolean;
  };
  /** Questions to practise next (interview language). */
  practice: { id: string; text: string; competency: Competency }[];
  /** The action plan, most important first. */
  actions: { code: ActionCode; n?: number; of?: number; items?: string[] }[];
  /** Advice for this kind of role, in the interview language. */
  tips: string[];
  /** Notes written by Claude, when the AI interviewer is switched on. */
  ai?: AiNotes | null;
}

export interface AiNotes {
  summary: string;
  strengths: { q: number; why: string }[];
  improve: { q: number; how: string; better: string }[];
  /** Figures in "better" answers that the candidate never said; shown as a warning. */
  unsupported: string[];
}

// ── Sessions kept in the browser ─────────────────────────────────────────────

/** One answer as the browser sends it. */
export interface IvAnswerInput {
  text: string;
  mode: "voice" | "text";
  /** Spoken answers: seconds between the first and the last word heard. */
  speechSec?: number;
  skip?: boolean;
}

/** A finished interview and its report (lib/agent/store.ts, key "interviews", newest first). */
export interface IvRecord {
  id: string;
  at: string;
  startedAt: string;
  role: string;
  jobId: string | null;
  company: string | null;
  lang: IvLang;
  type: IvType;
  difficulty: IvDifficulty;
  length: IvLength;
  track: string;
  level: number;
  look: LookId;
  mode: "voice" | "text";
  /** Seconds from the start to the report. */
  durationSec: number;
  report: IvReport;
}

/** The interview in progress, so it can be resumed after a reload. */
export interface IvActive {
  state: IvState;
  look: LookId;
  voiceURI: string | null;
  mode: "voice" | "text";
  camera: boolean;
  /** Recognise speech on the device (when the browser offers it). */
  local: boolean;
  savedAt: string;
}

/** The candidate's last choices in the setup. */
export interface IvPrefs {
  type: IvType;
  difficulty: IvDifficulty;
  length: IvLength;
  lang: IvLang;
  look: LookId;
  voices: Partial<Record<IvLang, string | null>>;
  mode: "voice" | "text";
  camera: boolean;
  local: boolean;
}
