// lib/agent/interview/report.ts — server only. The coaching report, scored from the transcript
// with fixed rules so that sessions compare on the same criteria:
//
//   relevance      the question's key ideas the answer touched (3 of them is full marks)
//   evidence       a specific situation (time, place, people, numbers), not general habits
//   structure      situation, task, action and result (STAR); S, A and R together is full marks
//   ownership      "I did" against "we did"
//   reasoning      problem-solving language: why, decisions, diagnosis, steps
//   impact         a stated result, with a figure where the question asks for performance
//   communication  length for the question, and few hedging or filler words
//   knowledge      role vocabulary used across the interview (or the listing's skills)
//
// Each answer is scored 0–4 on the criteria that apply to it; a criterion that needed a prompt
// from the interviewer is capped at 3; skipped questions count as 0. These measure the words
// of the answers only: they don't judge the person, their voice or their face.

import { extractSkills, mentions, norm } from "../text";
import { analyse, lexicon, normMap, outlineOf } from "./analyze";
import { CORE } from "./bank-core";
import { answersFor } from "./engine";
import { trackById } from "./tracks";
import type {
  ActionCode, AnswerReview, Band, Competency, Criterion, FixCode, GoodCode, IvLang, IvQuestion, IvReport, IvState,
} from "./types";
import { CRITERIA } from "./types";

const round1 = (n: number) => Math.round(n * 10) / 10;
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);

/** Word ranges that suit each kind of question. */
function band(q: IvQuestion): [number, number] {
  if (q.kind === "opener") return [50, 220];
  if (q.competency === "practical") return [12, 120];
  if (q.behavioural) return [70, 300];
  return [35, 220];
}

// Question words that say nothing about the topic.
const Q_STOP = new Set(`tell about time what when where which while would could should there their them they then than that this these those
with from into have been were your yours give describe walk through example does done most last next just also very much more some
parlez parle donnez decrivez racontez comment quand quel quelle quels quelles avez etiez votre vos vous dans pour avec etait sont cette
حدثني اخبرني صف كيف ماذا متى اين لماذا هل كان كانت التي الذي هذه هذا انت لديك عندما`.split(/\s+/));

/** Word stems a question and an answer share: the answer is about the same thing even if it misses the key ideas. */
function sharedStems(question: string, answer: string, lang: IvLang): number {
  const stems = (t: string) => new Set(norm(t).split(/[^\p{L}\p{N}]+/u)
    .map(w => (lang === "ar" ? w.replace(/^(?:وال|فال|بال|ال|و)/u, "") : w))
    .filter(w => w.length >= 4 && !Q_STOP.has(w))
    .map(w => w.slice(0, lang === "ar" ? 4 : 5)));
  const a = stems(answer);
  return [...stems(question)].filter(w => a.has(w)).length;
}

function lengthScore(words: number, [min, max]: [number, number]): number {
  if (words < 10) return 0;
  if (words < min) return words >= 0.75 * min ? 3 : words >= 0.5 * min ? 2 : 1;
  if (words > max) return words <= 1.25 * max ? 3 : words <= 1.5 * max ? 2 : 1;
  return 4;
}

function confidenceScore(words: number, hedges: number, fillers: number): number | null {
  if (words < 10) return null;
  const rate = ((hedges + fillers) / words) * 100;
  return rate <= 1 ? 4 : rate <= 2 ? 3 : rate <= 3.5 ? 2 : rate <= 5 ? 1 : 0;
}

export function bandOf(overall: number | null): Band | null {
  if (overall === null) return null;
  return overall < 1.5 ? "early" : overall < 2.5 ? "developing" : overall < 3.2 ? "nearly" : "ready";
}

function reviewAnswer(s: IvState, index: number): AnswerReview {
  const q = s.plan[index];
  const lang = s.setup.lang;
  const track = trackById(s.track);
  const turns = s.turns.filter(t => t.q === index);
  const answers = answersFor(s, index);
  const skipped = !answers.length;
  const followups: AnswerReview["followups"] = [];
  turns.forEach((t, i) => {
    if (t.kind !== "followup") return;
    const reply = turns.slice(i + 1).find(x => x.by === "candidate");
    followups.push({ why: t.why ?? "short", question: t.text, answer: reply?.kind === "answer" ? reply.text : "" });
  });
  const prompted = new Set(followups.map(f => f.why));
  const combined = answers.join("\n");
  const speechSec = turns.reduce((a, t) => a + (t.by === "candidate" && t.speechSec ? t.speechSec : 0), 0);
  const a = analyse(combined, lang, { keys: q.keys, terms: track.terms, speechSec: speechSec || undefined });
  const hedgeCount = hedgeCountOf(combined, lang);

  const scores: Partial<Record<Criterion, number>> = {};
  const cap = (n: number, ...reasons: string[]) => (reasons.some(r => prompted.has(r as never)) ? Math.min(3, n) : n);
  const main = q.kind === "main";
  const words = a.words;

  if (q.kind !== "closing") {
    if (q.keys.length >= 2) {
      // Key ideas touched; talking about the question's own subject counts as one more.
      const hit = a.keysHit + (sharedStems(q.text, combined, lang) >= 2 ? 1 : 0);
      scores.relevance = skipped || words < 8 ? 0 : Math.round(4 * Math.min(1, hit / Math.min(q.keys.length, 3)));
    }
    if (q.behavioural) {
      scores.evidence = skipped ? 0 : cap(a.example ? (a.anchors + a.numbers >= 2 ? 4 : 3) : a.habit ? 1 : a.actions >= 1 ? 2 : 0, "example");
      const sar = ["S", "A", "R"].every(p => a.star.includes(p as never));
      scores.structure = skipped ? 0 : sar ? 4 : Math.min(3, a.star.length);
      if (!skipped && a.i + a.we >= 2) {
        const ratio = a.i / (a.i + a.we);
        scores.ownership = cap(ratio >= 0.7 ? 4 : ratio >= 0.55 ? 3 : ratio >= 0.4 ? 2 : ratio >= 0.25 ? 1 : 0, "ownership");
      } else if (skipped) scores.ownership = 0;
    }
    if (main && q.competency !== "practical" && q.competency !== "motivation" && (skipped || words >= 15)) {
      // In a story, one clear reason for what you did goes a long way; in a scenario or a
      // knowledge question, the reasoning is the answer.
      const n = a.reasoning.length;
      const value = q.behavioural ? (n === 0 ? 1 : n === 1 ? 3 : 4) : n === 0 ? 0 : n === 1 ? 2 : n === 2 ? 3 : 4;
      scores.reasoning = skipped ? 0 : cap(value, "why");
    }
    if (q.behavioural || q.figures) {
      scores.impact = skipped ? 0 : cap(a.figures.length && a.result ? 4 : a.figures.length ? 3 : a.result ? (q.figures ? 2 : 3) : 0, "result", "figures", "resolution");
    }
    const ls = skipped ? 0 : lengthScore(words, band(q));
    const cs = skipped ? 0 : confidenceScore(words, hedgeCount, a.fillers);
    scores.communication = cs === null ? ls : round1((ls + cs) / 2);
  }

  const values = Object.values(scores) as number[];
  const score = values.length ? round1(mean(values)) : null;
  const [min, max] = band(q);
  const good: GoodCode[] = [];
  const fix: FixCode[] = [];
  if (skipped) fix.push("skipped");
  else if (q.kind === "closing") (a.asked ? good : (fix as string[])).push(a.asked ? "asked" : "no-question");
  else {
    if ((scores.evidence ?? 0) >= 3) good.push("example");
    if (scores.structure === 4) good.push("star");
    if (a.figures.length && a.result) good.push("figures");
    else if ((scores.impact ?? 0) >= 3) good.push("result");
    if ((scores.ownership ?? 0) >= 3) good.push("ownership");
    if ((scores.reasoning ?? 0) >= 3) good.push("reasoning");
    if (a.terms.length >= 2) good.push("terms");
    if ((scores.relevance ?? 0) >= 3) good.push("relevance");
    if (words >= min && words <= max) good.push("length");

    if (scores.relevance !== undefined && scores.relevance <= 1 && a.keysHit === 0) fix.push("off-topic");
    if (words < min * 0.75) fix.push("short");
    if (words > max * 1.25) fix.push("long");
    if (q.behavioural && !a.example) fix.push(a.habit ? "habit" : "no-example");
    if (q.behavioural && !a.result) fix.push("no-result");
    if (q.figures && !a.figures.length) fix.push("no-figures");
    if (scores.ownership !== undefined && scores.ownership <= 2) fix.push("we");
    if (scores.reasoning !== undefined && scores.reasoning === 0 && !q.behavioural) fix.push("no-reasoning");
    if (hedgeCount >= 3 || (words >= 10 && (hedgeCount / words) * 100 > 2)) fix.push("hedges");
    if (a.fillers >= 3) fix.push("fillers");
    if (a.vague.length) fix.push("vague");
    if (a.negative.length) fix.push("negative");
  }

  return {
    q: index, id: q.id, question: q.text, competency: q.competency, kind: q.kind,
    answer: answers[0] ?? "", followups, skipped,
    facts: {
      words, star: a.star, example: a.example, habit: a.habit, figures: a.figures, result: a.result, keysHit: a.keysHit, keysAll: a.keysAll,
      i: a.i, we: a.we, hedges: a.hedges, fillers: a.fillers, vague: a.vague, negative: a.negative, terms: a.terms, reasoning: a.reasoning,
      asked: a.asked, wpm: a.wpm,
    },
    scores, score, good, fix,
    outline: q.behavioural && !skipped ? outlineOf(combined, lang) : null,
    covers: q.covers,
  };
}

/** How many hedging phrases there are (the analysis lists which ones). */
function hedgeCountOf(text: string, lang: IvLang): number {
  const re = lexicon(lang).hedge;
  re.lastIndex = 0;
  return [...normMap(text).text.matchAll(re)].length;
}

export function buildReport(s: IvState, uiLang: IvLang): IvReport {
  const lang = s.setup.lang;
  const track = trackById(s.track);
  const reached = new Set(s.turns.filter(t => t.by === "interviewer" && (t.kind === "question" || t.kind === "closing")).map(t => t.q));
  const answers = s.plan.map((_, i) => i).filter(i => reached.has(i) && s.turns.some(t => t.by === "candidate" && t.q === i)).map(i => reviewAnswer(s, i));
  const mains = answers.filter(a => a.kind !== "closing");
  const answered = mains.filter(a => !a.skipped).length;
  const planned = s.plan.filter(q => q.kind !== "closing").length;

  // Role knowledge: the track's vocabulary, or the listing's skills for roles without a track.
  const usedTerms = [...new Set(answers.flatMap(a => a.facts.terms))];
  let knowledge: { score: number | null; used: string[]; missing: string[]; hit: number } = { score: null, used: [], missing: [], hit: 0 };
  const target = planned >= 8 ? 5 : 3;
  if (track.terms.length) {
    const used = track.terms.filter(t => usedTerms.includes(t.id));
    knowledge = {
      score: answered ? Math.round(4 * Math.min(1, used.length / target)) : null,
      used: used.map(t => t.label[lang]),
      missing: track.terms.filter(t => t.core && !usedTerms.includes(t.id)).map(t => t.label[lang]).slice(0, 5),
      hit: used.length,
    };
  } else if (s.setup.job?.description) {
    const skills = extractSkills(s.setup.job.description).slice(0, 12);
    const said = answers.map(a => [a.answer, ...a.followups.map(f => f.answer)].join("\n")).join("\n");
    const used = skills.filter(k => mentions(said, k));
    if (skills.length) {
      knowledge = {
        score: answered ? Math.round(4 * Math.min(1, used.length / Math.min(4, skills.length))) : null,
        used, missing: skills.filter(k => !used.includes(k)).slice(0, 5), hit: used.length,
      };
    }
  }

  const criteria = CRITERIA.map(id => {
    if (id === "knowledge") return { id, score: knowledge.score, n: knowledge.score === null ? 0 : 1, hit: knowledge.hit };
    const values = answers.map(a => a.scores[id]).filter((v): v is number => typeof v === "number");
    return { id, score: values.length ? round1(mean(values)) : null, n: values.length, hit: values.filter(v => v >= 3).length };
  });
  const scored = criteria.map(c => c.score).filter((v): v is number => v !== null);
  const overall = answered >= 2 && scored.length ? round1(mean(scored)) : null;

  const ranked = mains.filter(a => !a.skipped && a.score !== null);
  const strongest = [...ranked].filter(a => a.score! >= 2.5).sort((x, y) => y.score! - x.score!).slice(0, 2).map(a => a.q);
  const weakest = [...ranked, ...mains.filter(a => a.skipped)].filter(a => !strongest.includes(a.q) && (a.skipped || a.score! < 2.5))
    .sort((x, y) => (x.score ?? -1) - (y.score ?? -1)).slice(0, 2).map(a => a.q);

  const comp = (xs: AnswerReview[]) => [...new Set(xs.map(a => a.competency).filter(c => c !== "practical"))] as Competency[];
  const shown = comp(ranked.filter(a => a.score! >= 2.5));
  const needed = comp(mains.filter(a => a.skipped || (a.score !== null && a.score < 2))).filter(c => !shown.includes(c));

  const voice = s.turns.filter(t => t.by === "candidate" && t.mode === "voice" && t.kind === "answer");
  const wpms = mains.map(a => a.facts.wpm).filter((v): v is number => v !== null).sort((x, y) => x - y);
  const closing = answers.find(a => a.kind === "closing");
  const communication = {
    avgWords: Math.round(mean(mains.filter(a => !a.skipped).map(a => a.facts.words)) || 0),
    wpm: wpms.length ? wpms[Math.floor(wpms.length / 2)] : null,
    fillers: answers.reduce((n, a) => n + a.facts.fillers, 0),
    hedges: answers.reduce((n, a) => n + a.facts.hedges.length, 0),
    long: mains.filter(a => a.fix.includes("long")).length,
    short: mains.filter(a => a.fix.includes("short")).length,
    asked: closing ? closing.facts.asked && !closing.skipped : null,
    voice: voice.length > 0,
  };

  // Questions to practise next: the weakest one again, then unasked questions on weak competencies.
  const inPlan = new Set(s.plan.map(q => q.id));
  const practice: IvReport["practice"] = [];
  for (const i of weakest) {
    const a = answers.find(x => x.q === i);
    if (a && a.kind === "main") practice.push({ id: a.id, text: a.question, competency: a.competency });
  }
  const wanted = [...needed, ...track.comps];
  const pool = [...track.questions, ...CORE.filter(b => b.id.startsWith("comp."))]
    .filter(b => !inPlan.has(b.id) && !b.slot && b.lv[0] <= s.level + 1 && b.lv[1] >= s.level - 1 && !b.countries && (!b.hard || s.setup.difficulty === "demanding"));
  for (const c of wanted) {
    if (practice.length >= 4) break;
    const b = pool.find(x => x.comp === c && !practice.some(p => p.id === x.id));
    if (b) practice.push({ id: b.id, text: b.q[lang], competency: b.comp });
  }

  // The action plan: the lowest criteria first, then specific habits.
  const byId = Object.fromEntries(criteria.map(c => [c.id, c])) as Record<Criterion, (typeof criteria)[number]>;
  const low = (id: Criterion) => byId[id].score !== null && byId[id].score! < 2.5;
  const gap = (id: Criterion) => (byId[id].score === null ? 0 : 4 - byId[id].score!);
  const items: { code: ActionCode; weight: number; n?: number; of?: number; items?: string[] }[] = [];
  const beh = mains.filter(a => s.plan[a.q]?.behavioural);
  if (low("impact")) items.push({ code: "figures", weight: gap("impact"), n: beh.filter(a => a.facts.figures.length).length, of: beh.length });
  if (low("evidence")) items.push({ code: "examples", weight: gap("evidence"), n: beh.filter(a => a.facts.example).length, of: beh.length });
  if (low("structure")) items.push({ code: "star", weight: gap("structure") });
  if (low("ownership")) items.push({ code: "ownership", weight: gap("ownership"), n: answers.reduce((n, a) => n + a.facts.we, 0), of: answers.reduce((n, a) => n + a.facts.i, 0) });
  if (low("reasoning")) items.push({ code: "reasoning", weight: gap("reasoning") });
  if (low("relevance")) items.push({ code: "relevance", weight: gap("relevance") });
  if (low("knowledge")) items.push({ code: "knowledge", weight: gap("knowledge"), items: knowledge.missing });
  if (low("communication")) {
    if (communication.long >= 2) items.push({ code: "long", weight: gap("communication"), n: communication.long });
    else if (communication.short >= 2) items.push({ code: "short", weight: gap("communication"), n: communication.short });
    else items.push({ code: "hedges", weight: gap("communication"), items: [...new Set(answers.flatMap(a => a.facts.hedges))].slice(0, 4) });
  }
  const negatives = [...new Set(answers.flatMap(a => a.facts.negative))];
  if (negatives.length) items.push({ code: "negative", weight: 3, items: negatives.slice(0, 3) });
  const vague = [...new Set(answers.flatMap(a => a.facts.vague))];
  if (vague.length) items.push({ code: "vague", weight: 1.5, items: vague.slice(0, 3) });
  if (communication.asked === false) items.push({ code: "questions", weight: 1.5 });
  const actions: IvReport["actions"] = items.sort((x, y) => y.weight - x.weight).slice(0, 3)
    .map(({ code, n, of, items: it }) => ({ code, ...(n !== undefined ? { n } : {}), ...(of !== undefined ? { of } : {}), ...(it?.length ? { items: it } : {}) }));
  if (weakest.length) actions.push({ code: "repeat" });
  if (overall !== null && overall >= 3.2 && s.setup.difficulty !== "demanding") actions.push({ code: "harder" });

  return {
    v: 1, id: s.id, at: new Date().toISOString(), engine: s.engine, lang,
    answered, planned, endedEarly: !s.done || s.step < s.plan.length - 1,
    overall, band: bandOf(overall), criteria, answers, strongest, weakest,
    competencies: { shown, needed },
    knowledge: { used: knowledge.used, missing: knowledge.missing },
    communication, practice, actions,
    tips: track.tips[uiLang] ?? track.tips.en,
    ai: null,
  };
}
