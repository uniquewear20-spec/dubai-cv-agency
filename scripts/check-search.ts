// scripts/check-search.ts — checks of how the job search reads roles and listings, without a
// browser or a network: npx tsx scripts/check-search.ts
// The listing titles below are real titles returned by the job sources on 24 Oct 2026 (some that
// fit, some that don't), plus titles written to test one rule each.

import assert from "node:assert/strict";
import {
  FAMILIES, cleanTitle, employmentOf, familiesOfTitle, fieldOf, industriesOf, levelOfListing, planRole, titleFit, widenTerms, wordsFitTitle,
} from "../lib/agent/titles";
import { cityVerdict, placeVerdict } from "../lib/agent/countries";
import { scoreJob } from "../lib/agent/score";
import type { Job, Profile } from "../lib/agent/types";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`ok  ${name}`);
};
const fit = (role: string, title: string, context = "") => titleFit(planRole(role), title, context);

check("no title is claimed by two jobs (except the two contexts of \"animator\")", () => {
  const seen = new Map<string, string>();
  const dupes: string[] = [];
  for (const f of FAMILIES) for (const t of f.titles) {
    const k = cleanTitle(t);
    const prev = seen.get(k);
    if (prev && prev !== f.id && k !== "animator") dupes.push(`${k}: ${prev} / ${f.id}`);
    seen.set(k, f.id);
  }
  assert.deepEqual(dupes, []);
  const ids = new Set(FAMILIES.map(f => f.id));
  const broken = FAMILIES.flatMap(f => [...(f.related ?? []), ...(f.parent ? [f.parent] : [])].filter(r => !ids.has(r)).map(r => `${f.id} -> ${r}`));
  assert.deepEqual(broken, []);
});

check("jobs in every field are understood, in English, French, Arabic and German", () => {
  const cases: [string, string][] = [
    ["Doctor", "doctor"], ["Médecin généraliste", "doctor"], ["طبيب عام", "doctor"], ["Facharzt", "doctor"], ["Cardiologist", "cardiologist"],
    ["Registered Nurse", "nurse"], ["Infirmière", "nurse"], ["ممرضة", "nurse"], ["Pflegefachkraft", "nurse"], ["Pharmacist", "pharmacist"],
    ["Fashion model", "model"], ["عارضة أزياء", "model"], ["Actress", "actor"], ["Software engineer", "software-developer"], ["Développeur web", "software-developer"],
    ["Architect", "architect"], ["Civil engineer", "civil-engineer"], ["مهندس مدني", "civil-engineer"], ["Real estate agent", "real-estate-agent"],
    ["Sales executive", "sales-executive"], ["Accountant", "accountant"], ["Comptable", "accountant"], ["محاسب", "accountant"], ["Lawyer", "lawyer"],
    ["Avocate", "lawyer"], ["Teacher", "teacher"], ["Maths teacher", "math-teacher"], ["Marketing manager", "marketing-manager"],
    ["Administrative assistant", "administrative-assistant"], ["CEO", "ceo"], ["Intern", "intern"], ["Electrician", "electrician"], ["Delivery driver", "driver"],
    ["Customer service agent", "customer-service"], ["Cabin crew", "cabin-crew"], ["Bartender", "bartender"], ["Hotel manager", "hotel-manager"],
  ];
  for (const [role, id] of cases) assert.equal(planRole(role).family?.id, id, role);
});

check("a whole field typed as a role searches the field", () => {
  assert.equal(fieldOf("Healthcare"), "healthcare");
  assert.equal(fieldOf("IT"), "technology");
  assert.equal(fieldOf("تسويق"), "marketing");
  const p = planRole("Healthcare");
  assert.equal(p.field, "healthcare");
  assert.equal(titleFit(p, "Staff Nurse"), "same");
  assert.equal(titleFit(p, "Consultant Cardiologist"), "same");
  assert.equal(titleFit(p, "Senior Accountant"), "other");
});

check("the listings that came back for a doctor search are sorted out by their titles", () => {
  assert.equal(fit("Doctor", "Consultant Anesthesiologist - Abu Dhabi / Global Doctors Welcome"), "same");
  assert.equal(fit("Doctor", "Dermatology Specialist"), "same");
  assert.equal(fit("Doctor", "Specialist Pediatrician"), "same");
  assert.equal(fit("Doctor", "Growth Product Manager"), "other"); // posted by a company called Time Doctor
  assert.equal(fit("Doctor", "Litigation Attorney"), "other"); // "Juris Doctor" in its text
  assert.equal(fit("Cardiologist", "Consultant Cardiologist"), "same");
  assert.equal(fit("Cardiologist", "Consultant Dermatologist"), "related");
  assert.equal(fit("Cardiologist", "General Practitioner"), "related");
});

check("software, teaching, legal and trades searches keep their own jobs only", () => {
  assert.equal(fit("Software developer", "Senior Backend Engineer"), "same");
  assert.equal(fit("Software developer", "EMEA Account Executive"), "other");
  assert.equal(fit("Software developer", "Graduate Sales Development Representative"), "other");
  assert.equal(fit("Teacher", "Early Childhood Teacher (PT)"), "same");
  assert.equal(fit("Teacher", "Snr. Marketing Manager, Enterprise ABM - EMEA"), "other");
  assert.equal(fit("Math teacher", "English Teacher"), "related");
  assert.equal(fit("Lawyer", "Vice President, Deputy General Counsel"), "same");
  assert.equal(fit("Lawyer", "Customer Advocate"), "unknown");
  assert.equal(fit("Electrician", "Auto Electrician"), "same");
  assert.equal(fit("Electrician", "Staff Product Manager, Fintech New Bets"), "other");
  assert.equal(fit("Civil engineer", "Civil QA/QC Engineer"), "related");
  assert.equal(fit("Engineer", "Civil QA/QC Engineer"), "same");
});

check("titles that also mean something else need the right context", () => {
  assert.equal(familiesOfTitle("Model").length, 0);
  assert.equal(familiesOfTitle("AI Model Trainer").length, 0);
  assert.equal(familiesOfTitle("Model", "Models for a fashion photoshoot for our abaya brand campaign")[0]?.id, "model");
  assert.equal(familiesOfTitle("Architect", "Revit and AutoCAD drawings for residential villas")[0]?.id, "architect");
  assert.equal(familiesOfTitle("Solutions Architect")[0]?.id, "solutions-architect");
  assert.equal(familiesOfTitle("Animator", "Kids club entertainment team at our resort")[0]?.id, "entertainment-host");
  assert.equal(familiesOfTitle("Animator", "2D and 3D character animation in Maya")[0]?.id, "motion-designer");
  assert.equal(familiesOfTitle("Driver Development Engineer")[0]?.id, "engineer");
  assert.equal(familiesOfTitle("AI Trainer - Chemistry").length, 0);
  assert.ok(!familiesOfTitle("Server Engineer").some(f => f.id === "waiter"));
});

check("an internship search needs the title to say so; career stages don't hide the job", () => {
  assert.equal(fit("Internship", "Marketing Intern"), "same");
  assert.equal(fit("Internship", "Senior Accountant"), "other");
  assert.equal(familiesOfTitle("Software Engineering Intern").some(f => f.id === "intern"), true);
});

check("a job the agent doesn't know is matched by the words of the title, never the description", () => {
  const p = planRole("Yacht crew deckhand");
  assert.equal(p.family, null);
  assert.ok(p.words);
  assert.equal(wordsFitTitle(p.words!, "Deckhand - Yacht Crew"), "all");
  assert.equal(wordsFitTitle(p.words!, "Deckhand"), "head");
  assert.equal(wordsFitTitle(p.words!, "Yacht Broker"), null);
});

check("words typed beyond the job's title make the search more specific, and widening says so", () => {
  const p = planRole("Underwater welder");
  assert.equal(p.family?.id, "welder");
  assert.deepEqual(p.extras, ["underwater"]);
  assert.equal(titleFit(p, "Underwater Welder - Offshore"), "same");
  assert.equal(titleFit(p, "Pipe Welder"), "related");
  assert.deepEqual(widenTerms(p), ["welder"]);
  assert.deepEqual(planRole("Arabic speaking receptionist in Dubai").extras, []);
  assert.deepEqual(widenTerms(planRole("Cardiologist")).slice(0, 1), ["doctor"]);
});

check("French and German markets get titles in their language", () => {
  assert.deepEqual(planRole("Nurse").local, { fr: ["infirmier"], de: ["Pflegefachkraft"] });
  assert.deepEqual(planRole("ممرضة").terms[0], "nurse"); // Arabic titles are searched by their English titles
});

check("career level and contract type come from the listing, and unstated stays unstated", () => {
  assert.equal(levelOfListing("Senior Accountant"), "senior");
  assert.equal(levelOfListing("Marketing Intern"), "entry");
  assert.equal(levelOfListing("Head of Sales"), "executive");
  assert.equal(levelOfListing("Executive Chef"), "executive");
  assert.equal(levelOfListing("Restaurant Manager"), "manager");
  assert.equal(levelOfListing("Staff Nurse"), null);
  assert.equal(levelOfListing("Accountant"), null);
  assert.deepEqual(employmentOf("Full time"), ["full-time"]);
  assert.deepEqual(employmentOf("PART_TIME"), ["part-time"]);
  assert.deepEqual(employmentOf("Contractor"), ["contract"]);
  assert.deepEqual(employmentOf("Summer Internship"), ["internship"]);
  assert.deepEqual(employmentOf("Accountant"), []);
});

check("fields of listings come from their jobs, or from field words in title and categories", () => {
  assert.ok(industriesOf("Staff Nurse").includes("healthcare"));
  assert.ok(industriesOf("Clinical Documentation Integrity Specialist", ["Healthcare"]).includes("healthcare"));
  assert.deepEqual(industriesOf("Team Member"), []);
});

check("remote jobs open only to other countries are told apart from ones that fit", () => {
  assert.equal(placeVerdict("Worldwide", true, ["AE"]), "fits");
  assert.equal(placeVerdict("United Arab Emirates", true, ["AE"]), "fits");
  assert.equal(placeVerdict("EMEA", true, ["AE"]), "fits");
  assert.equal(placeVerdict("USA", true, ["SA"]), "elsewhere");
  assert.equal(placeVerdict("UK, USA", true, ["AE"]), "elsewhere");
  assert.equal(placeVerdict("Europe", true, ["AE"]), "elsewhere");
  assert.equal(placeVerdict("Dubai, Dubai, United Arab Emirates", false, ["AE"]), "fits");
  assert.equal(placeVerdict("Business Bay", false, ["AE"]), "unclear");
  assert.equal(cityVerdict("Dubai, Dubai, United Arab Emirates", "Dubai"), "fits");
  assert.equal(cityVerdict("Sharjah, United Arab Emirates", "Dubai"), "elsewhere");
  assert.equal(cityVerdict("United Arab Emirates", "Dubai"), "unclear");
  assert.equal(cityVerdict("دبي، الإمارات", "Dubai"), "fits");
});

const profile: Profile = {
  name: "", email: "", phone: "", headline: "", roles: ["Doctor"], countries: ["AE"], remoteOk: true, onsiteOk: true, salaryMin: null, salaryCurrency: "AED",
  salaryPeriod: "month", languages: [], skills: [], excludeCompanies: [], cvText: "", cvFileName: null, updatedAt: null,
};
const listing = (title: string): Job => ({
  id: `t:${title}`, source: "workable", title, company: "Clinic", location: "Dubai, United Arab Emirates", remote: false, url: "https://example.com",
  description: "", postedAt: null, salary: null, salaryRange: null, tags: [], applyEmail: null,
});

check("ranking rewards the job itself over a related one, and a field search over nothing", () => {
  const same = scoreJob(listing("Specialist Pediatrician"), profile);
  const other = scoreJob(listing("Litigation Attorney"), profile);
  assert.ok(same.parts.title >= 32, `same ${same.parts.title}`);
  assert.equal(other.parts.title, 0);
  const field = scoreJob(listing("Staff Nurse"), { ...profile, roles: ["Healthcare"] });
  assert.equal(field.reasons.find(r => r.code === "title-field")?.data?.role, "healthcare");
});

console.log(`\n${passed} checks passed`);
