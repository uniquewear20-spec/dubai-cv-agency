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
| "Send it for me": Zenith emails an approved application, Pro only | Built; **blocked in production** until the mailbox accepts SMTP logins (22 Oct 2026: Microsoft 365 answers "SmtpClientAuthentication is disabled for the Tenant") | Owner action 0 in `docs/commercial-launch.md`, and a verified Pro purchase |
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
| `app/api/agent/{search,access,tailor,send,status}/route.ts` | API routes |
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
Hospitality search (separate run, 19 checks, all passing, on real Workable samples): bartender listings found and
backend-engineer padding left out; counts of listings left out, closed and merged; a typo fixed and shown; plural
titles ("Bartenders") ranked as the same job; listing links go to Workable; both roles and both countries sent;
the related-jobs switch reruns the search; outside-site links follow the chosen role and country; a genuine zero
explained with ways to widen it, in English, French and Arabic; no horizontal scroll at 375 px.
Gumroad license keys (separate run): refunded key refused, unknown key not found, Career Automation key unlocks
Pro and is kept only in the browser; the server sends `increment_uses_count=false`, so checking never uses up a key.
Visual pass: 6 widths × English, French, Arabic × dark and light, no horizontal overflow, no console errors.

Not tested live: AI drafting (no Anthropic key), Jooble and Adzuna (no keys), a real Gumroad license key (needs a
purchase; production answers an unknown key with "not found", which shows it reaches Gumroad with the product
ids), and "Send it for me" in production (needs a paid Pro order; never sent to a real employer in tests).
