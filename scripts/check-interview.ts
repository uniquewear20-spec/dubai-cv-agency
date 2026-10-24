// scripts/check-interview.ts — checks of the interview coach's rules, without a browser or a server:
//   npx tsx scripts/check-interview.ts
// Covers the answer analysis (English, French, Arabic), the interviewer's follow-ups, scoring that
// separates strong from weak answers, the checks on what the browser sends back, and which
// packages include the coach.

import assert from "node:assert/strict";
import { analyse, groupRe } from "../lib/agent/interview/analyze";
import { answerTurn, startInterview } from "../lib/agent/interview/engine";
import { buildReport } from "../lib/agent/interview/report";
import { parseInput, parseState } from "../lib/agent/interview/state";
import { featuresOf } from "../lib/agent/access";
import { norm } from "../lib/agent/text";
import { chooseVoice, shortVoiceName, utteranceLang, voiceGender } from "../lib/agent/interview/speech";
import { LOOKS, LOOK_IDS } from "../lib/agent/interview/looks";
import type { IvCandidate, IvSetup, IvState } from "../lib/agent/interview/types";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`ok  ${name}`);
};

check("a STAR answer in English is read as an example with a result and figures", () => {
  const a = analyse("Last year at the Marriott a guest complained that his steak was cold. I apologised and asked the kitchen to cook a new one because I wanted him to feel looked after. As a result he left a five-star review and our rating went from 4.1 to 4.7.", "en");
  assert.equal(a.example, true);
  assert.deepEqual(a.star.filter(p => p !== "T"), ["S", "A", "R"]);
  assert.ok(a.figures.includes("4.1") && a.figures.includes("4.7"));
  assert.ok(a.reasoning.includes("why"));
});

check("working hours are not a result", () => {
  const a = analyse("I work from Monday to Friday, from 9 to 5.", "en");
  assert.equal(a.result, false);
  assert.equal(a.figures.length, 0);
});

check("ownership counts who acted, not possessives", () => {
  const a = analyse("Our food cost was 34%. I reviewed the report and I changed two suppliers.", "en");
  assert.equal(a.we, 0);
  assert.equal(a.i, 2);
});

check("French first person with an apostrophe counts as \"I\"", () => {
  const a = analyse("J'ai d'abord écouté, puis j'ai remplacé le plat.", "fr");
  assert.ok(a.i >= 2);
});

check("Arabic short stems match their own words only", () => {
  assert.equal(groupRe("عام", "ar").test(norm("قدمت الطعام بسرعة")), false);
  assert.equal(groupRe("عام", "ar").test(norm("في العام الماضي")), true);
  assert.equal(groupRe("لان$", "ar").test(norm("الآن أعمل في دبي")), false);
  assert.equal(groupRe("سعر", "ar").test(norm("الأسعار مرتفعة")), true);
  assert.equal(groupRe("حقق", "ar").test(norm("حققت الهدف")), true);
});

const candidate: IvCandidate = {
  headline: "Restaurant manager", skills: ["Food cost control"], languages: ["English"], countries: ["AE"], location: "Dubai, UAE",
  experience: [{ title: "Restaurant Manager", employer: "Jumeirah Beach Hotel", start: "2021-03", end: null, current: true, datesSure: true }],
  yearsExperience: 9, education: [], certifications: [],
};
const setup: IvSetup = { lang: "en", type: "management", difficulty: "realistic", length: 8, role: "Restaurant Manager", job: null };

check("an interview has an opening question, the main questions and a closing question", () => {
  const s = startInterview({ ...setup, length: 5 }, candidate, null, "check-plan-0001");
  assert.equal(s.plan.length, 6);
  assert.equal(s.plan[0].kind, "opener");
  assert.equal(s.plan[s.plan.length - 1].kind, "closing");
  assert.equal(s.turns.filter(t => t.by === "interviewer").length, 2);
});

check("a very short answer gets a follow-up, a skip moves on, the closing ends it", () => {
  let s = startInterview({ ...setup, length: 5 }, candidate, null, "check-flow-0001");
  s = answerTurn(s, { text: "I manage a team.", mode: "text" });
  assert.equal(s.turns[s.turns.length - 1].kind, "followup");
  assert.equal(s.turns[s.turns.length - 1].why, "short");
  s = answerTurn(s, { text: "", mode: "text", skip: true });
  assert.equal(s.step, 1);
  while (!s.done) s = answerTurn(s, { text: "", mode: "text", skip: true });
  assert.equal(s.turns[s.turns.length - 1].kind, "end");
});

const STRONG: Record<string, string> = {
  "open.team": "I lead a team of 32 people across front and back of house at a 180-cover restaurant at Jumeirah Beach Hotel, with about AED 9 million in yearly revenue. I am accountable for sales, the P&L, food cost, labour cost and our guest scores, and I report to the director of F&B.",
  "mgmt.underperf": "In 2023 one of my waiters started arriving late and his section's average check fell. I met him privately to understand why, because his record had been good, and he told me he had a long commute after moving. I agreed a clear expectation with him, moved him to later shifts for a month and set a goal to bring his upsell back to the team average. We reviewed it every week. After six weeks he was on time every shift and his average check was up 12% on the previous month.",
  "res.rota": "First I look at the forecast: bookings, last year's covers for the same week and any events in the hotel. Then I build the rota around the peaks, with split shifts and two part-time runners for Friday and Saturday, because those are our busiest nights. I check labour cost daily against the target of 24% and adjust, for example by sending one person home early on a quiet night. Last quarter we finished at 23.6% against a 24% target.",
  "mgmt.costs": "Last year our food cost was running at 34% against a 30% budget. I reviewed the variance report and found that waste on our brunch buffet was the main cause. I decided to cook the buffet in smaller batches every 30 minutes and renegotiated two supplier contracts. I protected quality by keeping the same products and checking guest comments every week. Food cost came down to 30.5% in three months, which saved around AED 18,000 per month, and our guest score stayed at 4.6.",
  "res.spend": "Our average spend per cover was AED 210. I introduced a wine pairing for the tasting menu and trained the team with a short daily briefing on two desserts and one drink to suggest. I also ran a monthly competition for the best upsell. After three months the average spend went from AED 210 to AED 245, an increase of about 17%.",
  "comp.difficult": "Last December a guest at a birthday dinner was very upset because his table was not ready and he started shouting at the host. I took him aside, listened, apologised and told him exactly what I would do. I offered a drink at the bar while we prepared the table, and I asked the chef to add a dessert for the birthday. He calmed down, they stayed for three hours, and he later left a five-star review naming the team.",
  "mgmt.conflict": "In 2022 two of my supervisors were arguing over section allocations, and it was affecting service. I met each of them separately to listen to both sides, then together. We agreed clear rules: allocations would rotate weekly and be published on Monday. I checked in with both of them every week for a month. The tension stopped, and both were still with the team a year later.",
  "res.worstshift": "My worst shift was a Friday brunch when our POS system went down at noon with 150 guests booked. I decided to switch to paper tickets straight away, moved two runners to the pass and called the IT team. I told the guests honestly what had happened and apologised. We served everyone, and afterwards I wrote a backup procedure that we now practise every quarter.",
  close: "Yes: what would success look like for this role in the first six months, and how is the team structured today?",
};
const FOLLOW = "For example, last March a supplier delivered the wrong fish an hour before service, so I called our backup supplier and changed the special. As a result we served every guest that night.";

function run(answer: (s: IvState, followup: boolean) => string): number | null {
  let s = startInterview(setup, candidate, null, "check-score-0001");
  for (let i = 0; i < 40 && !s.done; i++) {
    const last = s.turns[s.turns.length - 1];
    s = answerTurn(s, { text: answer(s, last.kind === "followup"), mode: "text" });
  }
  return buildReport(s, "en").overall;
}

check("strong answers score as interview ready, weak ones as early stage", () => {
  const strong = run((s, f) => (f ? FOLLOW : STRONG[s.plan[s.step].id] ?? FOLLOW));
  const weak = run(() => "We usually try our best, maybe.");
  assert.ok(strong !== null && strong >= 3.2, `strong scored ${strong}`);
  assert.ok(weak !== null && weak < 1.5, `weak scored ${weak}`);
});

check("the state sent back by the browser is checked", () => {
  const s = startInterview(setup, candidate, null, "check-state-0001");
  assert.ok(parseState(JSON.parse(JSON.stringify(s))));
  assert.equal(parseState({ ...s, v: 2 }), null);
  assert.equal(parseState({ ...s, track: "not-a-track" }), null);
  assert.equal(parseState({ ...s, plan: [] }), null);
  assert.equal(parseState({ ...s, turns: [{ by: "candidate", q: 0, kind: "question", text: "x", at: "" }] }), null);
  assert.equal(parseInput({ text: "x".repeat(10_000), mode: "voice" })?.text.length, 4000);
  assert.equal(parseInput({ text: "hi", mode: "telepathy" }), null);
});

check("the coach is in packages 2 to 4, Pro in packages 3 and 4", () => {
  assert.deepEqual(featuresOf("foundation"), { plan: null, coach: false });
  assert.deepEqual(featuresOf("growth"), { plan: null, coach: true });
  assert.deepEqual(featuresOf("executive"), { plan: "career-automation", coach: true });
  assert.deepEqual(featuresOf("apex"), { plan: "executive-suite", coach: true });
});

const V = (name: string, lang: string, localService = true, voiceURI = name) => ({ name, lang, localService, default: false, voiceURI }) as unknown as SpeechSynthesisVoice;

check("voices are told apart as female or male on Apple, Windows, Edge, Chrome and Android", () => {
  const cases: [string, string][] = [
    ["Maged", "male"], ["Majed (Enhanced)", "male"], ["Mariam", "female"], ["Laila", "female"], ["Tarik", "male"],
    ["Microsoft Hoda - Arabic (Egypt)", "female"], ["Microsoft Naayf - Arabic (Saudi Arabia)", "male"],
    ["Microsoft Fatima Online (Natural) - Arabic (United Arab Emirates)", "female"], ["Microsoft Hamdan Online (Natural) - Arabic (United Arab Emirates)", "male"],
    ["Google UK English Female", "female"], ["Google UK English Male", "male"], ["Google US English", "female"], ["Google français", "female"],
    ["Google US English 4 (Natural)", "male"], ["Android Speech Recognition and Synthesis from Google ar-xa-x-ard-network", "male"],
    ["Android Speech Recognition and Synthesis from Google ar-xa-x-arc-network", "female"], ["Samantha", "female"], ["Daniel", "male"],
    ["Thomas", "male"], ["Amélie", "female"], ["Microsoft Zira - English (United States)", "female"], ["Some Engine Voice", "unknown"],
  ];
  for (const [name, g] of cases) assert.equal(voiceGender({ name, voiceURI: name }), g, name);
});

check("each interviewer gets a voice that sounds like them, and a mismatch is reported", () => {
  assert.deepEqual(LOOK_IDS.map(l => LOOKS[l].presentation), ["female", "male", "female"]);
  // An iPhone with only the default Arabic voice: Amal can't get a female voice, and says so.
  const iphone = [V("Maged", "ar-SA")];
  assert.deepEqual([chooseVoice("ar", "female", iphone).voice?.name, chooseVoice("ar", "female", iphone).match], ["Maged", "no"]);
  assert.equal(chooseVoice("ar", "male", iphone).match, "yes");
  // A Mac with an added female voice: Amal and Lina speak with it, Karim with Maged.
  const mac = [V("Maged", "ar-SA"), V("Laila", "ar-001")];
  assert.equal(chooseVoice("ar", "female", mac).voice?.name, "Laila");
  assert.equal(chooseVoice("ar", "male", mac).voice?.name, "Maged");
  // Edge: the natural Gulf voices.
  const edge = [V("Microsoft Naayf - Arabic (Saudi Arabia)", "ar-SA"), V("Microsoft Hoda - Arabic (Egypt)", "ar-EG"),
    V("Microsoft Fatima Online (Natural) - Arabic (United Arab Emirates)", "ar-AE", false), V("Microsoft Hamdan Online (Natural) - Arabic (United Arab Emirates)", "ar-AE", false),
    V("Microsoft Salma Online (Natural) - Arabic (Egypt)", "ar-EG", false)];
  assert.equal(chooseVoice("ar", "female", edge).voice?.name, "Microsoft Fatima Online (Natural) - Arabic (United Arab Emirates)");
  assert.equal(chooseVoice("ar", "male", edge).voice?.name, "Microsoft Hamdan Online (Natural) - Arabic (United Arab Emirates)");
  // Voices whose names don't say: used, and reported as unknown.
  assert.equal(chooseVoice("ar", "female", [V("Arabic", "ar")]).match, "unknown");
  assert.equal(chooseVoice("ar", "female", []).match, "none");
  // English on Windows Chrome: a female and a male voice for each look.
  const win = [V("Microsoft David - English (United States)", "en-US"), V("Microsoft Zira - English (United States)", "en-US"), V("Google UK English Male", "en-GB", false), V("Google UK English Female", "en-GB", false)];
  assert.equal(voiceGender(chooseVoice("en", "female", win).voice!), "female");
  assert.equal(voiceGender(chooseVoice("en", "male", win).voice!), "male");
});

check("a Mac's voices: Arabic Majed is spoken with a tag Chrome accepts, French uses Thomas for a man", () => {
  assert.equal(utteranceLang({ lang: "ar-001" }, "ar-AE"), "ar-AE");
  assert.equal(utteranceLang({ lang: "fr-CA" }, "fr-FR"), "fr-CA");
  assert.equal(utteranceLang(null, "ar-AE"), "ar-AE");
  const mac = [V("Majed", "ar-001")];
  assert.deepEqual([chooseVoice("ar", "male", mac).voice?.name, chooseVoice("ar", "male", mac).match], ["Majed", "yes"]);
  const fr = [V("Amélie", "fr-CA"), V("Jacques", "fr-FR"), V("Thomas", "fr-FR")];
  assert.equal(chooseVoice("fr", "male", fr).voice?.name, "Thomas");
  assert.equal(chooseVoice("fr", "female", fr).voice?.name, "Amélie");
});

check("voice names are shown the way people say them", () => {
  assert.equal(shortVoiceName({ name: "Microsoft Fatima Online (Natural) - Arabic (United Arab Emirates)" }), "Fatima");
  assert.equal(shortVoiceName({ name: "Microsoft Naayf - Arabic (Saudi Arabia)" }), "Naayf");
  assert.equal(shortVoiceName({ name: "Microsoft AvaMultilingual Online (Natural) - English (United States)" }), "AvaMultilingual");
  assert.equal(shortVoiceName({ name: "Samantha (Enhanced)" }), "Samantha (Enhanced)");
  assert.equal(shortVoiceName({ name: "Google UK English Female" }), "Google UK English Female");
  assert.equal(shortVoiceName({ name: "Google العربية" }), "Google العربية");
  assert.equal(shortVoiceName({ name: "ar-xa-x-arc-network" }), "ar-xa-x-arc-network");
});

console.log(`\n${passed} checks passed`);
