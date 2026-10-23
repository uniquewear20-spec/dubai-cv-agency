// lib/agent/interview/tracks.ts — server only. Which kind of interview a role gets: its track
// (hospitality jobs through the job families in lib/agent/titles.ts, other fields by keywords)
// and its seniority. A role that matches no track gets the "general" track: the general
// questions plus questions built from the CV and the job listing.

import { norm } from "../text";
import { familyOfTitle } from "../titles";
import type { Track } from "./bank";
import { CORE } from "./bank-core";
import { BAR, COFFEE, FLOOR, RESTAURANT, SHIFTS } from "./bank-hospitality";
import { FNB_OPS, FRONT_OFFICE, HOUSEKEEPING, KITCHEN } from "./bank-hospitality-2";
import { ADMIN, CUSTOMER_SERVICE, FINANCE, HEALTHCARE, MARKETING, REAL_ESTATE, SALES, TECH } from "./bank-business";

export const GENERAL: Track = {
  id: "general",
  label: { en: "General", fr: "Général", ar: "عام" },
  comps: ["problem", "teamwork", "communication", "initiative", "pressure", "learning"],
  terms: [],
  tips: {
    en: ["Prepare five stories in STAR order (situation, task, action, result) that you can adapt to most questions.",
      "Put a number on each result where you honestly can: time saved, money, people, scores.",
      "Read the job listing again and match each requirement to one example from your CV."],
    fr: ["Préparez cinq histoires dans l'ordre STAR (situation, tâche, action, résultat), adaptables à la plupart des questions.",
      "Chiffrez chaque résultat quand vous le pouvez honnêtement : temps gagné, argent, personnes, notes.",
      "Relisez l'annonce et associez chaque exigence à un exemple tiré de votre CV."],
    ar: ["جهّز خمس قصص بترتيب STAR (الموقف، المهمة، الإجراء، النتيجة) يمكنك تكييفها مع معظم الأسئلة.",
      "ضع رقماً لكل نتيجة حين يمكنك ذلك بصدق: الوقت الموفّر، المال، عدد الأشخاص، التقييمات.",
      "اقرأ إعلان الوظيفة مجدداً واربط كل متطلب بمثال من سيرتك الذاتية."],
  },
  questions: [],
};

/** Order matters: hospitality and real estate match by job family first, the rest by keywords. */
export const TRACKS: Track[] = [BAR, COFFEE, FLOOR, RESTAURANT, FNB_OPS, FRONT_OFFICE, HOUSEKEEPING, KITCHEN, REAL_ESTATE,
  SALES, CUSTOMER_SERVICE, ADMIN, FINANCE, MARKETING, TECH, HEALTHCARE];

const BY_ID = new Map<string, Track>([...TRACKS, GENERAL].map(t => [t.id, t]));
export const trackById = (id: string): Track => BY_ID.get(id) ?? GENERAL;

/** Every question in the bank, for looking up questions asked in earlier sessions. */
export const ALL_QUESTIONS = [...CORE, SHIFTS, ...TRACKS.flatMap(t => t.questions)];
const Q_BY_ID = new Map(ALL_QUESTIONS.map(q => [q.id, q]));
export const bankQuestion = (id: string) => Q_BY_ID.get(id);

// Seniority from words in the title when there is no job family (1 entry … 7 executive).
const W = (words: string) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${words})(?![\\p{L}\\p{N}])`, "u");
const LEVELS: [RegExp, number][] = [
  [W("ceo|coo|cfo|cto|cmo|chief|president|managing director|vp|vice president|directeur general|pdg|الرئيس التنفيذي|مدير عام"), 7],
  [W("director|head of|directeur|directrice|مدير اول|رئيس قسم"), 6],
  [W("assistant manager|deputy manager|adjoint|adjointe|مساعد مدير|نائب مدير"), 4],
  [W("senior manager|general manager|manager|responsable|gerant|gerante|chef de service|مدير"), 5],
  [W("supervisor|team lead|team leader|lead|superviseur|chef d'equipe|مشرف|رئيس فريق"), 3],
  [W("senior|specialist|expert|confirme|confirmee|اخصائي|خبير"), 2],
  [W("junior|trainee|intern|apprentice|stagiaire|apprenti|debutant|متدرب|مبتدئ"), 1],
];

function levelOf(title: string, years: number | null): number {
  const n = norm(title);
  for (const [re, lv] of LEVELS) if (re.test(n)) return lv;
  if (years !== null && years >= 12) return 3;
  return 2;
}

export interface Detected {
  track: Track;
  level: number;
  /** The job family, when the title is a known hospitality or real-estate job. */
  family: string | null;
}

/** The track and seniority for a target role (and the saved job's title, when practising for one). */
export function detectTrack(role: string, jobTitle: string | null, context: string, years: number | null): Detected {
  const titles = [jobTitle, role].filter((t): t is string => Boolean(t && t.trim()));
  for (const title of titles) {
    const fam = familyOfTitle(title, context);
    if (!fam) continue;
    const track = TRACKS.find(t => t.families?.includes(fam.id));
    if (track) return { track, level: fam.level, family: fam.id };
  }
  for (const title of titles) {
    const n = norm(title);
    const track = TRACKS.find(t => t.match && t.match.test(n));
    if (track) return { track, level: levelOf(title, years), family: null };
  }
  return { track: GENERAL, level: levelOf(titles[0] ?? "", years), family: null };
}
