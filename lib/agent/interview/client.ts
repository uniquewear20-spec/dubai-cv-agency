// lib/agent/interview/client.ts — browser only. What the interview screens need around the API:
// the candidate facts sent to the interviewer (never the name, contacts or CV text), earlier
// sessions for the same role, the calls themselves and the record kept after an interview.

import { norm } from "../text";
import type { Access, Profile } from "../types";
import type { LookId } from "./looks";
import type {
  IvAnswerInput, IvCandidate, IvHistory, IvLang, IvPrefs, IvRecord, IvReport, IvSetup, IvState, IvType,
} from "./types";

export const MAX_RECORDS = 50;

export function candidateOf(p: Profile): IvCandidate {
  return {
    headline: p.headline,
    skills: p.skills.slice(0, 40),
    languages: p.languages.slice(0, 10),
    countries: p.countries.slice(0, 12),
    location: p.location ?? "",
    experience: (p.experience ?? []).slice(0, 20),
    yearsExperience: p.yearsExperience ?? null,
    education: (p.education ?? []).slice(0, 10),
    certifications: (p.certifications ?? []).slice(0, 15),
  };
}

const sameRole = (a: string, b: string) => norm(a).replace(/\s+/g, " ").trim() === norm(b).replace(/\s+/g, " ").trim();

/** Earlier sessions for this role or job: questions already asked (with their scores) and the weak criteria. */
export function historyOf(records: IvRecord[], setup: IvSetup): IvHistory | null {
  const same = records.filter(r => (setup.job?.id && r.jobId === setup.job.id) || sameRole(r.role, setup.role));
  if (!same.length) return null;
  const asked = same.flatMap(r => r.report.answers.filter(a => a.kind === "main").map(a => ({ id: a.id, score: a.score }))).slice(0, 200);
  const weak = same[0].report.criteria.filter(c => c.score !== null && c.score < 2.5).map(c => c.id);
  return { sessions: same.length, asked, weak };
}

/** A sensible interview type for a role, before the candidate picks one. */
export function suggestType(role: string): IvType {
  const n = norm(role);
  if (/(^|\s)(ceo|coo|cfo|cto|chief|president|vp|vice president|managing director|directeur general|director|head of|directeur|directrice|مدير عام|الرئيس التنفيذي)(\s|$)/u.test(n)) return "executive";
  if (/(manager|responsable|gerant|gerante|supervisor|superviseur|team lead|chef d'equipe|مدير|مشرف)/u.test(n)) return "management";
  return "professional";
}

export const defaultPrefs = (lang: IvLang): IvPrefs => ({
  type: "professional", difficulty: "realistic", length: 5, lang, look: "amal", voices: {}, mode: "voice", camera: false, local: false,
});

export function isRecord(x: unknown): x is IvRecord {
  const r = x as IvRecord;
  return Boolean(r && typeof r.id === "string" && r.report && Array.isArray(r.report.answers) && Array.isArray(r.report.criteria));
}

export function recordOf(state: IvState, report: IvReport, look: LookId, mode: "voice" | "text"): IvRecord {
  const at = new Date().toISOString();
  const voice = state.turns.some(t => t.by === "candidate" && t.mode === "voice");
  return {
    id: state.id,
    at,
    startedAt: state.startedAt,
    role: state.setup.role,
    jobId: state.setup.job?.id ?? null,
    company: state.setup.job?.company || null,
    lang: state.setup.lang,
    type: state.setup.type,
    difficulty: state.setup.difficulty,
    length: state.setup.length,
    track: state.track,
    level: state.level,
    look,
    mode: voice ? "voice" : mode,
    durationSec: Math.max(0, Math.round((Date.parse(at) - Date.parse(state.startedAt)) / 1000)),
    report,
  };
}

// ── The API ──────────────────────────────────────────────────────────────────

export class IvError extends Error {
  constructor(public readonly code: string, public readonly status: number) {
    super(code);
    this.name = "IvError";
  }
}

type Proof = Pick<Access, "kind" | "proof">;

async function call<T>(body: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch("/api/agent/interview/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new IvError("network", 0);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new IvError(res.status === 429 ? "busy" : String(data?.error ?? "unavailable"), res.status);
  return data as T;
}

const proofOf = (a: Proof) => ({ kind: a.kind, proof: a.proof });

export const ivStart = (access: Proof, setup: IvSetup, candidate: IvCandidate, history: IvHistory | null) =>
  call<{ state: IvState; trial?: string }>({ action: "start", access: proofOf(access), setup, candidate, history });

export const ivAnswer = (access: Proof, state: IvState, input: IvAnswerInput) =>
  call<{ state: IvState }>({ action: "answer", access: proofOf(access), state, input });

export const ivReport = (access: Proof, state: IvState, uiLang: IvLang, early: boolean) =>
  call<{ state: IvState; report: IvReport }>({ action: "report", access: proofOf(access), state, uiLang, early });
