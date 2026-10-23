// lib/agent/interview/bank.ts — server only. The format of the question bank, shared by the
// general questions (bank-core.ts) and the role tracks (bank-hospitality.ts, bank-business.ts).
//
// Each question is written in English, French and Arabic, with what a strong answer covers
// (shown in the report) and the ideas that show the answer is on topic (used for the relevance
// score): groups separated by " · ", alternatives inside a group by "|". English and French
// alternatives match the start of a word ("upsell" finds "upselling"); "x$" matches the whole
// word; Arabic alternatives match inside words, because of attached prefixes.

import type { Competency, IvLang, IvType } from "./types";
import type { TermDef } from "./analyze";

export interface BankQ {
  id: string;
  comp: Competency;
  types: IvType[];
  /** Seniority range 1 (entry) to 7 (executive). */
  lv: [number, number];
  /** Asks for a real past example (behavioural). */
  beh: boolean;
  /** Asks for results or performance, so figures are expected. */
  fig: boolean;
  /** A hard question, for demanding interviews. */
  hard: boolean;
  /** Generic slots: opening question, motivation, why leave, strengths, practicalities. */
  slot?: "opener" | "motivation" | "leave" | "strengths" | "practical";
  /** Placeholders the question needs: {company}, {place}. */
  needs?: ("company" | "place")[];
  /** Only asked for jobs in these countries (ISO codes). */
  countries?: string[];
  /** Not asked for jobs in these countries (a country-specific version exists). */
  except?: string[];
  /** Glossary terms the question is about. */
  terms: string[];
  q: Record<IvLang, string>;
  covers: Record<IvLang, string[]>;
  keys: Record<IvLang, string[]>;
}

type Part = [question: string, covers: string[], keys: string];

const TYPE: Record<string, IvType> = { S: "screening", P: "professional", C: "competency", M: "management", E: "executive" };

/**
 * One question. `t`: interview types ("SPCME"). `f`: "b" behavioural, "f" figures, "h" hard.
 * `lv`: seniority range. Keys: "a|b · c|d" (two groups).
 */
export function Q(
  id: string,
  comp: Competency,
  o: { t: string; lv?: [number, number]; f?: string; slot?: BankQ["slot"]; needs?: BankQ["needs"]; countries?: string[]; except?: string[]; terms?: string[] },
  en: Part,
  fr: Part,
  ar: Part,
): BankQ {
  const keys = (s: string) => s.split("·").map(g => g.trim()).filter(Boolean);
  return {
    id,
    comp,
    types: [...o.t].map(c => TYPE[c]).filter(Boolean),
    lv: o.lv ?? [1, 7],
    beh: (o.f ?? "").includes("b"),
    fig: (o.f ?? "").includes("f"),
    hard: (o.f ?? "").includes("h"),
    slot: o.slot,
    needs: o.needs,
    countries: o.countries,
    except: o.except,
    terms: o.terms ?? [],
    q: { en: en[0], fr: fr[0], ar: ar[0] },
    covers: { en: en[1], fr: fr[1], ar: ar[1] },
    keys: { en: keys(en[2]), fr: keys(fr[2]), ar: keys(ar[2]) },
  };
}

/** One glossary term: what it is called, how candidates say it, and an optional probing follow-up. */
export function T(
  id: string,
  label: [string, string, string],
  re: [string, string, string],
  probe?: [string, string, string] | null,
  core = false,
): TermDef {
  return {
    id,
    label: { en: label[0], fr: label[1], ar: label[2] },
    re: { en: re[0], fr: re[1], ar: re[2] },
    ...(probe ? { probe: { en: probe[0], fr: probe[1], ar: probe[2] } } : {}),
    ...(core ? { core: true } : {}),
  };
}

export interface Track {
  id: string;
  label: Record<IvLang, string>;
  /** Job families (lib/agent/titles.ts) that belong here. */
  families?: string[];
  /** Keywords for roles without a family (on normalised text). */
  match?: RegExp;
  /** Competencies that matter most in this kind of role, most important first. */
  comps: Competency[];
  /** Hospitality roles: shifts, weekends and public holidays come up. */
  hospitality?: boolean;
  terms: TermDef[];
  tips: Record<IvLang, string[]>;
  questions: BankQ[];
}
