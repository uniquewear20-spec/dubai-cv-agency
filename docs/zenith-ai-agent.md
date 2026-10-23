# Zenith AI job agent

Last updated: 23 October 2026. Replaces the earlier "Zenith AI Career Automation" concept (launch list,
proposed plans, Ink Orbit drawings), which described a product that did not exist and has been removed.

The agent is a working tool at **zenithdubaicv.com/agent**. It finds jobs in public job sources, ranks every
listing against the candidate's CV, prepares applications from what the CV actually says, and tracks each one
to the outcome. Nothing is sent without the candidate's approval.

## What works, and what it depends on

| Capability | Status | Depends on |
|---|---|---|
| Profile and CV (PDF, Word .docx, text), read in the browser | Works | pdf.js worker at `/pdf.worker.min.mjs`, font data in `/public/pdfjs` |
| Profile completed from the CV (contacts, headline, location, work history with dates, years of experience, education, certificates, languages with levels, skills, suggested target roles) | Works, in the browser, no AI and no cost | Nothing. The candidate ticks what to copy; target roles and countries are never ticked for them. Old Word (.doc) and scanned PDFs are not read (no OCR yet): the candidate pastes the text. |
| Job search: Workable (on-site, hybrid and remote jobs worldwide, including the Gulf, North Africa, the UK, Europe and North America) | Works | Nothing (no key). Workable publishes a Markdown job search for AI agents (`jobs.workable.com/llms.txt`; its robots.txt allows `ai-input`). Only employers that hire through Workable; at most 30 results a query. |
| Job search: Himalayas, Jobicy, Remotive, Arbeitnow | Works | Nothing (public APIs, no key). The first three are remote jobs only; Arbeitnow only for Germany, Austria, Switzerland. |
| Job search: Jooble (on-site jobs incl. the Gulf) | Built, **off** | `JOOBLE_API_KEY` (free key on request at jooble.org/api/about) |
| Job search: Adzuna (19 countries, no Gulf) | Built, **off** | `ADZUNA_APP_ID` + `ADZUNA_APP_KEY`; read Adzuna's API terms first |
| LinkedIn, Indeed, Bayt, GulfTalent, Naukrigulf | Search links only | They have no open job-search API; the agent never scrapes them |
| Add a job by hand (paste the listing) | Works | Nothing |
| Ranking with reasons (title 35, skills 30, place 15, seniority 10, freshness 10; language and salary deductions) | Works, in the browser | Nothing |
| Template drafts (no AI): CV lines quoted word for word, cover-letter frame with [gaps] | Works, in the browser | Nothing |
| AI drafts (Claude), Pro only | Built, **off** until a key is added | `ANTHROPIC_API_KEY` (paid API usage). Optional `ANTHROPIC_MODEL` (default `claude-sonnet-5-5`) |
| Apply on the employer's site | Works: opens the listing; the candidate applies there | Nothing |
| Apply by email from the candidate's own mail app (mailto) | Works | Nothing |
| "Send it for me": Zenith emails an approved application, Pro only | Built. The mailbox accepted the site's SMTP login on 23 Oct 2026 (a login check only: nothing was sent). Not yet tried end to end with a real Pro order | A verified Pro purchase |
| Interview coach (packages 2–4): animated interviewer, voice or typed answers, follow-ups, scored report, progress | Works, **free to run**: no AI service, no avatar or voice service | The browser's own speech features (see "Interview coach" below). Gumroad buyers of Career Advantage need license keys switched on for that product (owner action) |
| Tracker: statuses, dates, notes, history, follow-up reminders, .ics calendar files | Works, in the browser | Nothing |
| Pro access check: PayPal order (Career Automation / Executive Career Suite) | Works | Existing PayPal keys |
| Pro access check: Gumroad license key | Works (tested against a stub of Gumroad's API; no real key yet) | Nothing more: Career Automation and Executive Career Suite are live on Gumroad with license keys, product ids in `lib/packages.ts` (`gumroadProductId`). A real key comes from a test purchase. |
| Usage limits shared across server instances | Built, per-instance until configured | `KV_REST_API_URL` + `KV_REST_API_TOKEN` (Vercel KV / Upstash Redis), or `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` |
| Export, import and delete all data | Works | Nothing |

What the agent never does: apply on job boards or employer portals, fill in application forms, get past
CAPTCHAs, sign-ins or assessments, or send anything the candidate hasn't approved. Email is the only automated
submission, because it is the only channel where the employer has published how to apply.

## How a search works

1. **Each target role is read as a job** (`lib/agent/titles.ts`): likely typos are fixed ("Baristta" → barista,
   shown to the candidate), and the role is matched to a job family with its other titles in English, French and
   Arabic (bartender = mixologist, barman, serveur de bar, بارتندر…), its level, and its neighbouring jobs (head
   bartender, barback, bar manager…). Roles the agent doesn't know are searched by their words, as before.
   Titles that also name other jobs ("Server", "Host") count only in a hospitality listing, never in "Server Engineer".
2. **Every role and every country is searched** within a budget per source (Workable 10 queries, Himalayas 9,
   Jobicy 6, Jooble 6, Adzuna 6), so that each role and each country is asked at least once. (Before 23 October
   2026 only the first two roles and countries were searched, and Jobicy used only the first country.)
3. **Neighbouring jobs** are searched only when the candidate ticks "Include related jobs" on Find jobs.
4. **Listings that are a different job are left out and counted** ("6 other jobs left out"): Workable fills short
   result lists with unrelated jobs, such as backend engineers on a bartender search.
5. **Workable listings are opened** (at most 30 per search, six at a time, within 7 seconds; pages cached six
   hours) for the description, a stated salary, and whether the listing is still open: a listing whose page is gone
   is left out and counted as closed. Opened listings show "Open when checked" with the date, because Workable
   doesn't publish posting dates.
6. **Duplicates are merged** (same title, employer and city) and counted.
7. **The result says what happened**: the number per source, why a source wasn't used (remote only, region,
   no key), why one failed (timed out, busy, unexpected format), and, when nothing is found, whether that is a real
   zero, a partial answer or an outage, with ways to widen the search (related jobs, remote work, more countries,
   LinkedIn / Indeed / Bayt links for any role and country).

Ranking (in the browser) uses the same job families: the same job under another title scores 32 of 35, a
neighbouring job 20, a different job 0 however many words it shares ("Assistant Restaurant Manager" is not
"Restaurant Manager"), and seniority uses the job's level (a head bartender is a supervisor, not a head of department).

## Reading a CV

`lib/agent/extract.ts` reads the file on the device (PDF with pdf.js, Word .docx by unzipping it, text). The file
must be what its name says (its first bytes are checked), at most 5 MB, and a Word file may not unpack to more than
20 MB. `lib/agent/cvparse.ts` then finds, in English, French and Arabic CVs: name, email, phone, where the candidate
lives, the CV's own headline, the jobs with their dates (month and year, a year alone, "present"/"aujourd'hui"/"حتى
الآن"), years of experience added up from the dates (overlaps counted once), education, certificates (HACCP, WSET,
food safety, CPA…), languages with their levels, skills, achievements with figures and management responsibilities.
Every finding says whether it is written in the CV or worked out by the agent, and flags what to check (a year
without a month, a name it had to guess). The review lists them with tick boxes: contacts are ticked only where the
profile is empty; target roles and countries are suggestions the candidate must tick. Nothing reaches the profile
until the candidate copies it, checks the form and saves. The original file is kept in the browser so it can be
downloaded again; "Delete my CV and what was read from it" removes the text, the file, the work history, education
and certificates.

## Data protection

- Profile, CV text, saved jobs, drafts, applications and the purchase proof live in the browser's IndexedDB
  (`zenith-agent`). Nothing is stored on Zenith's servers. "Your data" in the agent shows what is stored, exports
  it as JSON, imports it, and deletes the CV text or everything.
- Search sends only roles, countries and work type. The server keeps no search log.
- AI drafting sends the CV text with emails and phone numbers removed (`redactContacts`), the name, headline,
  roles, languages, listed skills and the listing to Anthropic. Anthropic deletes API inputs and outputs within
  30 days (with exceptions for usage-policy enforcement and legal requirements) and does not train on them.
  The candidate sees and accepts this before the first AI draft.
- The server logs error types only, never CV text or listings.
- Usage is counted against a SHA-256 hash of the purchase proof, never the proof itself.

## Interview coach (packages 2–4)

A practice interview at `/agent/#interview` (or `#interview=<saved job id>` from a job's page). It costs nothing to
run: the interviewer is a set of rules on Zenith's server, the voice and the speech recognition are the browser's
own, and the interviewer is an SVG animation drawn in the page.

**Access.** Every call to `/api/agent/interview` checks the purchase with PayPal or Gumroad (`verifyCoach` in
`lib/agent/access.ts`): Career Advantage, Career Automation and Executive Career Suite (`COACH_TIERS`). A successful
check is remembered for 15 minutes per server instance, so a refund can take up to 15 minutes to close access.
Without access the page explains the coach, lets the visitor hear the interviewer say a fixed line, and shows where
to enter a proof of purchase. The question bank and the scoring rules never reach the browser bundle (checked after
the build).

**The interviewer** (`lib/agent/interview/engine.ts`). It picks a track from the role (bar, coffee, floor service,
restaurant management, F&B operations, front office, housekeeping, kitchen, real estate, sales, customer service,
administration, finance, marketing, technology, healthcare; otherwise general questions plus questions built from the
CV and the listing) and a seniority level, then plans 5 or 8 questions for the interview type (screening, role,
competency, management, executive) and difficulty (friendly, realistic, demanding). Questions come from the bank
(197 questions across 16 role tracks and the general set, each in English, French and Arabic), from the CV ("Your CV mentions …, and this role needs it") and from
the listing's requirements ("This role asks for: …"). Questions that scored low before come back once. Follow-ups
are chosen from what the candidate actually said: too short, no specific example, no result, no figure where the
question is about performance, mostly "we", self-descriptions without proof (quoted back), no reasoning in a
scenario, nothing done about a weakness, the figures behind a role topic, and in demanding mode a challenge. It can
pick up a role topic the candidate mentioned for a later question ("You mentioned food cost earlier"), keeping the
spread of competencies. It never writes or suggests answers for the candidate.

**The report** (`lib/agent/interview/report.ts`). Each answer is scored 0–4 with fixed rules on relevance, evidence,
structure (STAR), ownership, reasoning, impact, communication and role knowledge; a point the interviewer had to ask
for is capped at 3. The report shows the overall level, each criterion and what it measures, an action plan, each
answer with what worked and what to improve, what a strong answer covers, the candidate's own sentences in STAR
order (missing parts named, nothing invented), role topics covered and missing, speaking pace and hedging, questions
to practise next and tips for the role. It says plainly that it measures the words of the answers, not the person's
voice, accent, face or personality, and doesn't predict an employer's decision. Arabic answers are read with
shorter word lists, which the report states.

**Voice.** `lib/agent/interview/speech.ts`: the interviewer speaks with the device's voices (speechSynthesis), in
sentence-sized pieces; the animated mouth follows the browser's word-boundary events, or a speaking rate measured
from earlier sentences where those events don't exist (Android). Answers are recognised with SpeechRecognition:
continuous, restarted when the browser ends a session on its own, half duplex (the microphone is off while the
interviewer speaks; "Start answering" interrupts it). On-device recognition is used when the browser offers it for
the language; otherwise (most browsers today) the browser maker's speech service does it, which the setup says
before the interview. A long silence after a real answer offers to send it after a 3-second countdown that the
candidate can stop. When recognition isn't available (Firefox), is refused or fails, the candidate types instead.
The optional camera view is local only. With reduced motion, the interviewer's head and body stay still.

**Data.** Answers are sent as text to the server, scored and returned; nothing is stored or logged there. Reports
(at most 50) and the interview in progress are kept in the browser (`interviews`, `interview-active`,
`interview-prefs` in IndexedDB); reports are part of the data export and of "Delete everything".

**What it doesn't do (yet).** It doesn't use AI: `engine: "ai"` is reserved for an optional mode with Claude, which
would add API costs per interview and needs the owner's approval first. It doesn't analyse voice tone, facial
expressions or body language, and it never claims to.

## Honesty checks on drafts

- Every AI highlight must quote the CV line it comes from; highlights whose quote isn't in the CV are dropped
  (`quotedFrom`), and the candidate is told how many were dropped.
- Figures that appear in neither the CV nor the listing are flagged (`unsupportedFigures`).
- Skills that the CV and the candidate's own skill list don't show are flagged (`unsupportedSkills`).
- The prompt treats the CV and the listing as data, not instructions (listings are third-party text).
- "Send it for me" is disabled while the letter still contains [square-bracket] gaps.

## Allowances (defaults, awaiting approval)

Set in `lib/agent/limits.ts`, changeable in Vercel without a code change. They are shown to verified customers
inside the agent and are **not** published on the marketing pages.

| Env var | Default | Meaning |
|---|---|---|
| `AGENT_AI_DRAFTS_CAREER_AUTOMATION` | 30 | AI drafts per Career Automation order (matches its 30 applications) |
| `AGENT_AI_DRAFTS_EXECUTIVE_SUITE_PER_DAY` | 20 | AI drafts per day for Executive Career Suite (its applications are unlimited) |
| `AGENT_SENDS_PER_DAY` | 10 | Applications Zenith may email per day per order |

## Files

| Path | What it is |
|---|---|
| `app/agent/page.tsx`, `app/agent/agent.css` | The page |
| `components/agent/*` | The interface (overview, profile, jobs, applications, workspace, data, access) |
| `lib/agent/types.ts` | Shared types |
| `lib/agent/text.ts` | HTML to text, normalisation, skills lexicon, language requirements, honesty checks |
| `lib/agent/countries.ts` | Countries, cities, source codes, place matching |
| `lib/agent/titles.ts` | Job families: titles in three languages, levels, neighbours, typo fixing (shared by search and ranking) |
| `lib/agent/score.ts` | Ranking |
| `lib/agent/template.ts` | Template drafts |
| `lib/agent/sources.ts` | Job sources (server) |
| `lib/agent/access.ts` | PayPal / Gumroad purchase checks (server) |
| `lib/agent/limits.ts` | Allowances and rate limits (server) |
| `lib/agent/claude.ts` | AI drafting and its checks (server) |
| `lib/agent/store.ts`, `extract.ts`, `links.ts`, `i18n.ts` | Browser storage, CV reading, external links / calendar / mailto, interface text |
| `app/api/agent/{search,access,tailor,send,status,interview}/route.ts` | API routes |
| `lib/agent/interview/{engine,report,analyze,state,tracks,phrases}.ts`, `bank*.ts` | Interview coach: interviewer, scoring, answer analysis, request checks, tracks, the interviewer's lines, the question bank (server) |
| `lib/agent/interview/{types,copy,client,speech,lips,looks}.ts` | Interview coach: shared types, interface text, API calls, voice and recognition, mouth shapes, the interviewer's looks (browser) |
| `components/agent/interview/*`, `app/agent/interview.css` | Interview coach screens: setup, interview room, animated interviewer, report, progress |
| `scripts/check-interview.ts` | Checks of the coach's rules: `npx tsx scripts/check-interview.ts` |
| `components/site/AgentSection.tsx` | The homepage section (`#zenith-ai`) |

## How it was tested

Locally, against stubs: `AGENT_SOURCES_FIXTURE_URL` (real sample responses captured from Workable, Himalayas,
Jobicy, Remotive and Arbeitnow), `ANTHROPIC_BASE_URL_TEST` (a stub that returns a draft with a fabricated highlight, an
invented figure and an unsupported skill), `PAYPAL_API_BASE_TEST` (stub orders: paid, ineligible, refunded,
pending, unknown), `GUMROAD_API_BASE_TEST` (stub license keys: Career Automation, Executive Career Suite,
refunded, unknown) and a local SMTP sink. These test hooks are ignored on Vercel (`VERCEL=1`).

Browser end-to-end test (34 checks, all passing): CV extraction from PDF and Word; profile; search and ranking;
template draft quoting the CV; Pro unlock refused for an ineligible order and accepted for Career Automation;
consent before AI; the fabricated highlight removed and the invented figure and skill flagged; email sending
blocked until [gaps] are filled and the approval box is ticked; submission, follow-up date and .ics file;
export, delete everything, import; access link from the order email removed from the address bar.
CV reading (separate run, 25 checks, all passing): PDF and Word read and reviewed; contacts ticked only into an
empty profile; location found and the country left for the candidate to add; work history with dates and
uncertain dates flagged; years worked out; languages with levels; education and certificates; suggested roles never
pre-ticked; copied into the form without saving; a date corrected and saved; the original file kept and downloaded
unchanged; a fake PDF and a file over 5 MB refused; a CV without contacts and with year-only dates; French and
Arabic CVs; deleting the CV and what was read from it while keeping the name; no console errors.
Hospitality search (separate run, 22 checks, all passing, on real Workable samples): bartender listings found and
backend-engineer padding left out; counts of listings left out, closed and merged; a typo fixed and shown; plural
titles ("Bartenders") ranked as the same job; listing links go to Workable; both roles and both countries sent;
the related-jobs switch reruns the search; outside-site links follow the chosen role and country; a genuine zero
explained with ways to widen it, in English, French and Arabic; no horizontal scroll at 375 px.
Gumroad license keys (separate run): refunded key refused, unknown key not found, Career Automation key unlocks
Pro and is kept only in the browser; the server sends `increment_uses_count=false`, so checking never uses up a key.
Visual pass: 6 widths × English, French, Arabic × dark and light, no horizontal overflow, no console errors.

Interview coach (23 Oct 2026): `scripts/check-interview.ts` (10 checks: English, French and Arabic analysis,
follow-ups, strong answers scored "interview ready" and weak ones "early stage", request checks, packages). In
Chromium with a scripted voice and microphone, against the production build and a Gumroad stub: locked page and
preview; unlock with a license key; a spoken English management interview from setup to report and progress;
French typed answers ended early; Arabic (right to left) with the microphone refused, switching to typing; resuming
after a reload; a phone-width interview and report with no horizontal scroll; no console errors. The API refused a
missing proof, an unknown key and a refunded key, and a malformed session.

Not tested live: AI drafting (no Anthropic key), Jooble and Adzuna (no keys), a real Gumroad license key (needs a
purchase; production answers an unknown key with "not found", which shows it reaches Gumroad with the product
ids), and "Send it for me" in production (needs a paid Pro order; never sent to a real employer in tests).
