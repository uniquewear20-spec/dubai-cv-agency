// lib/agent/sources.ts — server only. Finds jobs through public job sources that allow it, and
// turns every listing into the same shape. Each source is an adapter (below); adding a provider
// means adding one adapter and its entry in SOURCE_META. Each source's terms are respected:
//
//   Workable   jobs.workable.com/jobs.md            jobs at companies hiring with Workable,
//                                                    on-site and remote, worldwide. Workable
//                                                    publishes this Markdown search for AI agents
//                                                    (jobs.workable.com/llms.txt); link to the
//                                                    listing, at most 30 results a query
//   Himalayas  himalayas.app/jobs/api/search        remote jobs; credit Himalayas and link to the listing
//   Jobicy     jobicy.com/api/v2/remote-jobs        remote jobs; credit Jobicy, apply buttons go to its URL
//   Remotive   remotive.com/api/remote-jobs         remote jobs (small public feed, 24 h delay); credit
//                                                    Remotive, link to the listing, at most 4 calls a day
//   Arbeitnow  arbeitnow.com/api/job-board-api      jobs in Germany, Austria and Switzerland; link back
//   Jooble     jooble.org/api/{key}                 on-site jobs worldwide incl. the Gulf; needs JOOBLE_API_KEY
//   Adzuna     api.adzuna.com/v1/api/jobs           on-site jobs in 19 countries (no Gulf); needs
//                                                    ADZUNA_APP_ID and ADZUNA_APP_KEY; credit "Jobs by Adzuna"
//
// Every target role is planned first (lib/agent/titles.ts): typos fixed, the other titles of the
// same job (in the market's language too), its neighbours, or a whole field. Sources are asked for
// every role and country, within a per-source budget of calls. Every listing is then judged the
// same way, whatever the source: a different job (a Python engineer on a bartender search, an
// attorney on a doctor search), a remote job open only to other countries, or a listing outside
// the candidate's filters is left out and counted, never silently: the report says how many. A
// role that finds nothing is widened once to its related or broader titles, labelled as such.
//
// Calls are cached (Next.js data cache) so repeated searches don't hit the sources again.
// LinkedIn, Indeed, Bayt and GulfTalent have no public job-search API; the agent links to a
// search on those sites instead, and the candidate can add any listing by hand.

import { unstable_cache } from "next/cache";
import { FRENCH_MARKETS, GERMAN_MARKETS, cityVerdict, countriesIn, countryByCode, placeVerdict } from "./countries";
import { bare, findApplyEmail, htmlToText, norm } from "./text";
import { parseSalary } from "./salary";
import {
  SECTOR_SEARCHES, employmentOf, familyById, familyLabel, genericTitle, industriesOf, industryById, levelOfListing, mentionsJob, planRole,
  titleFit, widenTerms, wordsFitTitle, type Family, type Industry, type RolePlan,
} from "./titles";
import type { Job, RoleSearch, SalaryRange, SearchRequest, SearchResponse, SourceId, SourceReport } from "./types";

const UA = "ZenithDubaiCV-JobAgent/1.0 (+https://zenithdubaicv.com/agent/)";
const TIMEOUT = 8_000;
const MAX_DESC = 8_000;

// Local tests only: send source calls to a fixture server. Never active on Vercel.
const FIXTURE = process.env.VERCEL ? null : process.env.AGENT_SOURCES_FIXTURE_URL?.replace(/\/$/, "") || null;
const via = (url: string) => (FIXTURE ? `${FIXTURE}/${url.replace(/^https?:\/\//, "")}` : url);

type Id = Exclude<SourceId, "manual">;
interface SourceMeta { id: Id; name: string; home: string; attribution: string; needs?: string[] }

export const SOURCE_META: SourceMeta[] = [
  { id: "workable", name: "Workable", home: "https://jobs.workable.com", attribution: "Jobs from Workable" },
  { id: "himalayas", name: "Himalayas", home: "https://himalayas.app/jobs", attribution: "Remote jobs from Himalayas" },
  { id: "jobicy", name: "Jobicy", home: "https://jobicy.com", attribution: "Remote jobs from Jobicy" },
  { id: "remotive", name: "Remotive", home: "https://remotive.com", attribution: "Remote jobs from Remotive" },
  { id: "arbeitnow", name: "Arbeitnow", home: "https://www.arbeitnow.com", attribution: "Jobs from Arbeitnow" },
  { id: "jooble", name: "Jooble", home: "https://jooble.org", attribution: "Jobs from Jooble", needs: ["JOOBLE_API_KEY"] },
  { id: "adzuna", name: "Adzuna", home: "https://www.adzuna.com", attribution: "Jobs by Adzuna", needs: ["ADZUNA_APP_ID", "ADZUNA_APP_KEY"] },
];

const META = Object.fromEntries(SOURCE_META.map(m => [m.id, m])) as Record<Id, SourceMeta>;

export const sourceConfigured = (m: SourceMeta): boolean => (m.needs ?? []).every(k => Boolean(process.env[k]?.trim()));

class SourceError extends Error {}

type CacheInit = RequestInit & { next?: { revalidate?: number } };

async function getJson<T>(url: string, init: CacheInit = {}): Promise<T> {
  const res = await fetch(via(url), {
    ...init,
    headers: { Accept: "application/json", "User-Agent": UA, ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!res.ok) throw new SourceError(res.status === 429 ? "Rate limited" : `HTTP ${res.status}`);
  return (await res.json()) as T;
}

/**
 * A text page and when its server sent it (a cached page keeps its original date), or null when
 * the page doesn't exist (404, 410): a closed listing, told apart from a failure.
 */
async function getPage(url: string, init: CacheInit = {}, timeout = TIMEOUT, accept = "text/markdown, text/plain;q=0.9, */*;q=0.1"): Promise<{ text: string; at: string } | null> {
  const res = await fetch(via(url), {
    ...init,
    headers: { Accept: accept, "User-Agent": UA, ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(timeout),
  });
  if (res.status === 404 || res.status === 410) return null;
  if (!res.ok) throw new SourceError(res.status === 429 ? "Rate limited" : `HTTP ${res.status}`);
  const sent = Date.parse(res.headers.get("date") ?? "");
  return { text: await res.text(), at: new Date(Number.isFinite(sent) ? sent : Date.now()).toISOString() };
}

const iso = (v: unknown): string | null => {
  if (typeof v === "number") return new Date(v * 1000).toISOString();
  if (typeof v === "string" && v) {
    const t = Date.parse(/[zZ]|[+-]\d\d:?\d\d$/.test(v) ? v : `${v}Z`);
    return Number.isFinite(t) ? new Date(t).toISOString() : null;
  }
  return null;
};

const clean = (s: unknown, max = 200) => (typeof s === "string" ? s.replace(/\s+/g, " ").trim().slice(0, max) : "");

function job(p: Omit<Job, "applyEmail" | "description"> & { description: string }, types: (string | null | undefined)[] = []): Job {
  const description = p.description.slice(0, MAX_DESC);
  const employment = employmentOf(...types, p.title);
  return { ...p, description, applyEmail: findApplyEmail(description), ...(employment.length ? { employment } : {}) };
}

function range(min: unknown, max: unknown, currency: unknown, period: unknown): SalaryRange | null {
  const lo = typeof min === "number" && min > 0 ? min : null;
  const hi = typeof max === "number" && max > 0 ? max : null;
  if (!lo && !hi) return null;
  const p = String(period ?? "").toLowerCase();
  return {
    min: lo, max: hi, currency: typeof currency === "string" && currency ? currency.toUpperCase() : null,
    period: /hour/.test(p) ? "hour" : /day|daily/.test(p) ? "day" : /month/.test(p) ? "month" : "year",
  };
}

function salaryText(r: SalaryRange | null): string | null {
  if (!r) return null;
  const f = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));
  const amount = r.min && r.max && r.min !== r.max ? `${f(r.min)}–${f(r.max)}` : f((r.min ?? r.max)!);
  const per = r.period === "month" ? " / month" : r.period === "hour" ? " / hour" : r.period === "day" ? " / day" : " / year";
  return `${r.currency ?? ""} ${amount}${per}`.trim();
}

// ── Search plumbing ──────────────────────────────────────────────────────────

interface Ctx {
  req: SearchRequest;
  plans: RolePlan[];
  /** Listings found closed when their page was checked, per source. */
  closed: Partial<Record<Id, number>>;
  /** Listings a source left out before the shared check (a different job by its title alone), per source. */
  unrelated: Partial<Record<Id, number>>;
  /**
   * The widening pass: for each role that found nothing, the related or broader titles to search
   * (by index into plans). Only Workable and Himalayas are asked again.
   */
  widen?: Map<number, string[]>;
}

/** A listing and the target role (index into ctx.plans) whose search found it, or null for a feed. */
interface Found {
  job: Job;
  plan: number | null;
  /** Found by a search of the whole sector ("food and beverage"), not of the role: not counted as left out. */
  sweep?: boolean;
  /** Found by the widening pass for this role (index into ctx.plans). */
  widen?: number;
}

/** Which role a listing is for, and how: the job itself, a neighbour the candidate asked for, or a widened search. */
interface Verdict { plan: number; how: "same" | "related" | "widened" }

interface Adapter {
  meta: SourceMeta;
  /** Remote jobs only: not asked when the candidate wants on-site jobs only. */
  remoteOnly?: boolean;
  skip?: (ctx: Ctx) => string | null;
  run: (ctx: Ctx) => Promise<Found[]>;
}

/**
 * Up to `max` (term, place) pairs to query, chosen so every term and every place is searched at
 * least once before any combination is repeated. (Searches used to stop at the first two roles
 * and countries without saying so.)
 */
export function queryPairs<T>(terms: string[], places: T[], max: number): [string, T][] {
  const out: [string, T][] = [];
  if (!terms.length || !places.length) return out;
  const seen = new Set<string>();
  const add = (ri: number, pi: number) => {
    const k = `${ri}|${pi}`;
    if (out.length < max && !seen.has(k)) { seen.add(k); out.push([terms[ri], places[pi]]); }
  };
  for (let i = 0; i < Math.max(terms.length, places.length); i++) add(i % terms.length, i % places.length);
  for (let ri = 0; ri < terms.length; ri++) for (let pi = 0; pi < places.length; pi++) add(ri, pi);
  return out;
}

/** A role's terms for one market: the typed title, then its title in the market's language, then the common English titles. */
function marketTerms(p: RolePlan, countries: string[]): string[] {
  const local = [
    ...(countries.some(c => FRENCH_MARKETS.has(c)) ? p.local.fr.slice(0, 1) : []),
    ...(countries.some(c => GERMAN_MARKETS.has(c)) ? p.local.de.slice(0, 1) : []),
  ];
  return p.extras.length ? p.terms : [...p.terms.slice(0, 1), ...local, ...p.terms.slice(1)];
}

/** English terms for sources that list jobs in English (the remote job boards). */
function englishTerms(p: RolePlan): string[] {
  if (p.family && !p.extras.length) return [...new Set([...(p.family.search ?? [p.family.titles[0]]), ...p.terms])];
  return p.terms;
}

/**
 * The terms to send for the roles, with the role each belongs to: every role's own title first,
 * then the other common titles for the same job (and its neighbours when asked), `perRole` at most.
 * In the widening pass, the related or broader titles of the roles that found nothing.
 */
function termsFor(ctx: Ctx, perRole: number, pick: (p: RolePlan) => string[] = p => p.terms): { terms: string[]; planOf: Map<string, number> } {
  const lists: [number, string[]][] = ctx.widen ? [...ctx.widen.entries()] : ctx.plans.map((p, i) => [i, pick(p)]);
  const terms: string[] = [];
  const planOf = new Map<string, number>();
  const seen = new Set<string>();
  for (let rank = 0; rank < perRole; rank++) {
    for (const [i, list] of lists) {
      const t = list[rank];
      if (t && !seen.has(norm(t))) { seen.add(norm(t)); terms.push(t); planOf.set(t, i); }
    }
  }
  return { terms, planOf };
}

/** How many terms per role fit a source's budget of calls (fewer roles and places: more titles each). */
const perRoleFor = (ctx: Ctx, places: number, budget: number, min = 1, max = 5) =>
  Math.max(min, Math.min(max, Math.floor(budget / Math.max(1, (ctx.widen?.size ?? ctx.plans.length) * Math.max(1, places)))));

/**
 * Runs a source's calls side by side. A call that fails doesn't sink the others: the source fails
 * only when every call failed, so one busy query never hides the listings the rest found.
 */
async function settle(id: Id, calls: Promise<Found[]>[]): Promise<Found[]> {
  const results = await Promise.allSettled(calls);
  const ok = results.filter((r): r is PromiseFulfilledResult<Found[]> => r.status === "fulfilled");
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  if (failed.length) console.error(`[agent/search] ${id}: ${failed.length} of ${results.length} calls failed (${describe(failed[0].reason)})`);
  if (!ok.length && failed.length) throw failed[0].reason;
  return ok.flatMap(r => r.value);
}

const describe = (err: unknown): string =>
  err instanceof SourceError ? err.message : err instanceof Error && err.name === "TimeoutError" ? "Timed out" : "Unavailable";

/** The listings array of a source's answer. Anything else means the source changed its format. */
function listOf<T>(id: Id, body: unknown, key: string): T[] {
  const list = (body as Record<string, unknown> | null)?.[key];
  if (Array.isArray(list)) return list as T[];
  const keys = body && typeof body === "object" ? Object.keys(body).slice(0, 8).join(",") : typeof body;
  console.error(`[agent/search] ${id}: unexpected response (no "${key}" array; keys: ${keys})`);
  throw new SourceError("Unexpected response");
}

/** Wraps tasks so that at most `n` run at once. */
function limiter(n: number) {
  let active = 0;
  const waiting: (() => void)[] = [];
  return async <T>(task: () => Promise<T>): Promise<T> => {
    while (active >= n) await new Promise<void>(resolve => waiting.push(resolve));
    active++;
    try { return await task(); } finally { active--; waiting.shift()?.(); }
  };
}

/**
 * The target role a listing is (index into ctx.plans) and how, or null when it is none of them:
 *  - a job the agent knows: the listing's title is that job (any way of writing it, or a kind of
 *    it); a neighbour when the candidate asked for neighbours or the search is being widened; or a
 *    generic title ("Team Member – Lounge") in a listing whose text names the job;
 *  - a whole field: a job in the field, or a title or category that names the field;
 *  - a role the agent doesn't know: the listing's title must have its words (its description
 *    doesn't count: "Juris Doctor" in a lawyer's listing is not a doctor's job).
 */
function judge(f: Found, ctx: Ctx): Verdict | null {
  const j = f.job;
  const intro = `${j.tags.join(" ")}\n${j.description.slice(0, 1500)}`;
  let fallback: Verdict | null = null;
  for (let i = 0; i < ctx.plans.length; i++) {
    const p = ctx.plans[i];
    const widening = f.widen === i;
    if (p.family || p.field) {
      const fit = titleFit(p, j.title, intro);
      if (fit === "same") return { plan: i, how: "same" };
      if (fit === "related" && (ctx.req.related || widening)) fallback ??= { plan: i, how: widening ? "widened" : "related" };
      if (fit === "unknown" && !f.sweep) {
        if (p.family && p.family.kind !== "level" && genericTitle(j.title) && mentionsJob(p, j.title, intro)) fallback ??= { plan: i, how: "same" };
        if (p.field && industriesOf(j.title, j.tags).includes(p.field)) fallback ??= { plan: i, how: "same" };
      }
      continue;
    }
    if (p.words) {
      const w = wordsFitTitle(p.words, j.title);
      if (w === "all") return { plan: i, how: "same" };
      if (w === "head" && widening) fallback ??= { plan: i, how: "widened" };
    }
  }
  return fallback;
}

/** Why a listing that is the job is still left out: other countries or the candidate's filters. */
function placeOrFilter(j: Job, req: SearchRequest, wanted: string[]): "elsewhere" | "filtered" | null {
  if (placeVerdict(j.location, j.remote, wanted) === "elsewhere") return "elsewhere";
  if (req.city && !j.remote && cityVerdict(j.location, req.city) === "elsewhere") return "filtered";
  if (req.level) {
    const lvl = levelOfListing(j.title, `${j.tags.join(" ")}\n${j.description.slice(0, 600)}`);
    if (lvl && lvl !== req.level) return "filtered";
  }
  if (req.employment && j.employment?.length && !j.employment.includes(req.employment)) return "filtered";
  if (req.industry) {
    const inds = industriesOf(j.title, j.tags, `${j.tags.join(" ")}\n${j.description.slice(0, 600)}`);
    if (inds.length && !inds.includes(req.industry as Industry)) return "filtered";
  }
  return null;
}

// ── Workable ─────────────────────────────────────────────────────────────────
// jobs.workable.com/jobs.md?query=&location=&workplace= answers a Markdown table (at most 30 rows):
//   | Title | Company | Location | Workplace | Type | Link |
// and jobs.workable.com/jobs/<id>.md the listing itself (company, location, description…).

const WORKABLE = "https://jobs.workable.com";
const WORKABLE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
/** Listing pages opened per search (cached six hours), and how long opening them may take. */
const WORKABLE_PAGES = 30;
const WORKABLE_PAGES_MS = 7_000;

interface WorkableRow { id: string; title: string; company: string; location: string; workplace: string; type: string }

/** The rows of a search answer, or null when the answer isn't a results page (Workable changed its format). */
export function parseWorkableSearch(md: string): WorkableRow[] | null {
  if (!/Found \*\*\d+\*\*|No (matching )?jobs/i.test(md)) return null;
  const rows: WorkableRow[] = [];
  for (const line of md.split("\n")) {
    if (!line.startsWith("|")) continue;
    const link = line.match(/\]\(https:\/\/jobs\.workable\.com\/jobs\/([0-9a-f-]{36})\.md\)/);
    if (!link || !WORKABLE_ID.test(link[1])) continue;
    const cells = line.split(/(?<!\\)\|/).slice(1, -1).map(c => c.trim().replace(/\\\|/g, "|"));
    if (cells.length < 6) continue;
    rows.push({ id: link[1], title: cells[0], company: cells[1], location: cells[2], workplace: cells[3].toLowerCase(), type: cells[4] });
  }
  return rows;
}

interface WorkableDetails { description: string; salary: string | null; salaryRange: SalaryRange | null; postedAt: string | null }

/** The line of a description that states the pay, if one does ("Salary: AED 2,000 plus accommodation"). */
function salaryLineOf(description: string): string | null {
  const line = description.split("\n").find(l => /\b(salary|compensation|salaire)\b|راتب/i.test(l) && /\d/.test(l));
  return line ? clean(line.replace(/^[•\-*\s]+/, "").replace(/^(salary|compensation|salaire)\s*:\s*/i, ""), 120) : null;
}

/**
 * A listing's page (jobs.workable.com/view/<id>): the schema.org JobPosting that Workable publishes
 * in it, with the description, requirements, benefits, posting date and stated pay.
 */
export function parseWorkableLd(html: string): WorkableDetails | null {
  // In the web page, a <script type="application/ld+json">; in the Markdown version Workable serves
  // to agents, a fenced ```json block.
  for (const block of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>|```json\s*\n([\s\S]*?)\n```/gi)) {
    let data: unknown;
    try { data = JSON.parse(block[1] ?? block[2]); } catch { continue; }
    const items = (Array.isArray(data) ? data : ((data as { "@graph"?: unknown[] })["@graph"] ?? [data])) as Record<string, unknown>[];
    const jp = items.find(x => x && typeof x === "object" && x["@type"] === "JobPosting");
    if (!jp) continue;
    const text = (v: unknown) => (typeof v === "string" ? htmlToText(v, 6000) : "");
    const [main, reqs, perks] = [text(jp.description), text(jp.requirementsSection), text(jp.benefitsSection)];
    if (!main) continue;
    const description = [main, reqs && `Requirements\n${reqs}`, perks && `Benefits\n${perks}`].filter(Boolean).join("\n\n");
    const pay = jp.baseSalary as { currency?: string; value?: { minValue?: number; maxValue?: number; value?: number; unitText?: string } } | undefined;
    const r = pay?.value ? range(pay.value.minValue ?? pay.value.value, pay.value.maxValue ?? pay.value.value, pay.currency, pay.value.unitText) : null;
    const line = r ? null : salaryLineOf(description);
    return { description, salary: r ? salaryText(r) : line, salaryRange: r ?? (line ? parseSalary(line) : null), postedAt: iso(jp.datePosted) };
  }
  return null;
}

/** A listing's own page: its description as plain text, a salary line if it states one, its department. */
export function parseWorkableJob(md: string): { description: string; salary: string | null; department: string | null } | null {
  if (!/^\s*#\s/.test(md)) return null;
  const department = md.match(/\*\*Department:\*\*\s*(.+)/)?.[1]?.trim() ?? null;
  const description = md.split(/\n(?=##\s)/).slice(1).join("\n")
    .replace(/^#{2,6}\s+(.+)$/gm, "\n$1\n")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^[ \t]*[-*][ \t]+/gm, "• ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .replace(/^Description\s*\n+/, "");
  return { description, salary: salaryLineOf(description), department };
}

function workableJob(r: WorkableRow): Job {
  const remote = r.workplace === "remote";
  return job({
    id: `workable:${r.id}`,
    source: "workable",
    title: clean(r.title),
    company: clean(r.company) || "-",
    location: clean(r.location) || (remote ? "Remote" : ""),
    remote,
    url: `${WORKABLE}/view/${r.id}`,
    description: "",
    postedAt: null,
    salary: null,
    salaryRange: null,
    tags: [r.type, r.workplace === "hybrid" ? "Hybrid" : ""].filter(Boolean),
  }, [r.type]);
}

/**
 * How much a search row is worth opening, judged by its title alone (before its page is loaded):
 * 3 the job (or a neighbour asked for), 2 a generic title for a job the agent knows (its text may
 * name the job), 0 a different job (left out, not opened).
 */
function rowWorth(f: Found, ctx: Ctx): number {
  if (judge(f, ctx)) return 3;
  if (!f.sweep && genericTitle(f.job.title) && ctx.plans.some(p => p.family && p.family.kind !== "level" && titleFit(p, f.job.title) === "unknown")) return 2;
  return 0;
}

const WORKABLE_TYPES: Record<string, string> = { "full-time": "Full-time", "part-time": "Part-time", contract: "Contract", temporary: "Temporary" };

const workable: Adapter = {
  meta: META.workable,
  async run(ctx) {
    const { req, plans } = ctx;
    // A city replaces its country in the search (Workable takes a city, region or country).
    const places = req.city ? [req.city] : req.countries.length ? req.countries.map(c => countryByCode(c)?.en ?? c) : [""];
    const { terms, planOf } = termsFor(ctx, perRoleFor(ctx, places.length, 10, 2, 5), p => marketTerms(p, req.countries));
    // At most 10 searches for the roles (every term and country at least once); 6 when widening.
    // For hospitality and fields such as healthcare and teaching, up to 6 more of the sector in the
    // chosen countries: employers title the same work many ways ("Food & Beverage / Fine Dining
    // Server", "Specialist Pediatrician"), and Workable matches titles closely. Five at a time,
    // each cached an hour.
    const queries = queryPairs(terms, places, ctx.widen ? 6 : 10).map(([term, place]) => ({ term, place, plan: planOf.get(term) ?? null, sweep: false }));
    if (req.countries.length && !ctx.widen) {
      const sectorTerms = [...new Set(plans.flatMap(p => [
        ...(p.family?.sector ? SECTOR_SEARCHES[p.family.sector] : []),
        ...((p.family?.industries ?? (p.field ? [p.field] : [])).flatMap(i => industryById(i)?.sweep ?? [])),
      ]))];
      for (const [term, place] of queryPairs(sectorTerms, places, 6)) queries.push({ term, place, plan: null, sweep: true });
    }
    const slot = limiter(5);
    const rows = await settle("workable", queries.map(q => slot(async () => {
      const qs = new URLSearchParams({ query: q.term });
      if (q.place) qs.set("location", q.place);
      if (req.remote && !req.onsite) qs.set("workplace", "remote");
      if (req.employment && WORKABLE_TYPES[req.employment]) qs.set("employment_type", WORKABLE_TYPES[req.employment]);
      const page = await getPage(`${WORKABLE}/jobs.md?${qs}`, { next: { revalidate: 3600 } });
      const list = page ? parseWorkableSearch(page.text) : null;
      if (!list) { console.error("[agent/search] workable: unexpected search response"); throw new SourceError("Unexpected response"); }
      const widen = ctx.widen && q.plan !== null ? q.plan : undefined;
      return list.map(r => ({ job: workableJob(r), plan: q.plan, sweep: q.sweep, ...(widen !== undefined ? { widen } : {}) }));
    })));

    // Workable fills short result lists with other jobs ("Senior Python Engineer" on a bartender
    // search). Rows whose title is a different job are left out (and counted) before any page is opened.
    const seen = new Set<string>();
    const ranked: { f: Found; worth: number }[] = [];
    let unrelated = 0;
    for (const f of rows) {
      if (seen.has(f.job.id)) continue;
      seen.add(f.job.id);
      if (f.job.remote ? !req.remote : !req.onsite) continue;
      const worth = rowWorth(f, ctx);
      if (worth === 0) { if (!f.sweep) unrelated++; continue; }
      ranked.push({ f, worth });
    }
    ctx.unrelated.workable = unrelated;
    ranked.sort((a, b) => b.worth - a.worth);
    // Employers often post one job for every city ("Waitress / Waiter - Dubai" in five emirates);
    // those are shown as one listing, so pages are opened for different jobs first.
    const kinds = new Set<string>();
    const firsts: typeof ranked = [];
    const repeats: typeof ranked = [];
    for (const r of ranked) {
      const k = sameJobKey(r.f.job);
      (kinds.has(k) ? repeats : firsts).push(r);
      kinds.add(k);
    }
    ranked.splice(0, ranked.length, ...firsts, ...repeats);

    // Each listing's page gives its description (for matching and drafting), when it was posted,
    // a stated salary, and whether it is still open (a closed listing's page is gone). The web page
    // carries the posting date in its schema.org data; the Markdown page is the fallback. Cached six hours.
    const stopAt = Date.now() + (ctx.widen ? WORKABLE_PAGES_MS / 2 : WORKABLE_PAGES_MS);
    const page = limiter(6);
    const opened = await Promise.all(ranked.slice(0, WORKABLE_PAGES).map(({ f }) => page(async (): Promise<{ at: string; d: WorkableDetails | null } | null | undefined> => {
      const left = stopAt - Date.now();
      if (left <= 0) return undefined; // out of time: kept as found, unchecked
      const id = f.job.id.slice("workable:".length);
      const cache = { next: { revalidate: 21600 } };
      try {
        const web = await getPage(`${WORKABLE}/view/${id}`, cache, Math.min(5_000, left + 2_000), "text/html");
        if (web === null) return null;
        const d = parseWorkableLd(web.text);
        if (d) return { at: web.at, d };
        const md = await getPage(`${WORKABLE}/jobs/${id}.md`, cache, Math.min(5_000, Math.max(1_000, stopAt - Date.now() + 2_000)));
        if (md === null) return null;
        const m = parseWorkableJob(md.text);
        return { at: md.at, d: m && { description: m.description, salary: m.salary, salaryRange: parseSalary(m.salary), postedAt: null } };
      } catch {
        return undefined;
      }
    })));

    const out: Found[] = [];
    let closed = 0;
    ranked.forEach(({ f }, i) => {
      const p = opened[i];
      if (p === null) { closed++; return; }
      if (p?.d) {
        f.job.description = p.d.description.slice(0, MAX_DESC);
        f.job.applyEmail = findApplyEmail(f.job.description);
        if (p.d.salary) { f.job.salary = p.d.salary; f.job.salaryRange = p.d.salaryRange; }
        f.job.postedAt = p.d.postedAt;
        f.job.checkedAt = p.at;
      }
      out.push(f);
    });
    ctx.closed.workable = closed;
    return out;
  },
};

// ── Himalayas ────────────────────────────────────────────────────────────────

interface HimalayasJob {
  title: string; companyName: string; employmentType?: string; minSalary: number | null; maxSalary: number | null;
  salaryPeriod?: string; currency: string | null; seniority?: string[]; locationRestrictions?: string[];
  categories?: string[]; description: string; pubDate: number; applicationLink: string; guid: string;
}

const himalayas: Adapter = {
  meta: META.himalayas,
  remoteOnly: true,
  run(ctx) {
    const { req } = ctx;
    const { terms, planOf } = termsFor(ctx, perRoleFor(ctx, req.countries.length, 9, 1, 2), englishTerms);
    const queries: [string, string | null][] = req.countries.length ? queryPairs(terms, req.countries, ctx.widen ? 4 : 9) : terms.slice(0, 9).map(t => [t, null]);
    return settle("himalayas", queries.map(([term, c]) => {
      const qs = new URLSearchParams({ q: term });
      if (c) qs.set("country", c);
      const plan = planOf.get(term) ?? null;
      const widen = ctx.widen && plan !== null ? { widen: plan } : {};
      return getJson<unknown>(`https://himalayas.app/jobs/api/search?${qs}`, { next: { revalidate: 3600 } })
        .then(body => listOf<HimalayasJob>("himalayas", body, "jobs").map(j => ({ job: himalayasJob(j), plan, ...widen })));
    }));
  },
};

function himalayasJob(j: HimalayasJob): Job {
  const r = range(j.minSalary, j.maxSalary, j.currency, j.salaryPeriod);
  return job({
    id: `himalayas:${j.guid}`,
    source: "himalayas",
    title: clean(j.title),
    company: clean(j.companyName),
    location: (j.locationRestrictions ?? []).join(", ") || "Worldwide",
    remote: true,
    url: j.applicationLink || j.guid,
    description: htmlToText(j.description ?? ""),
    postedAt: iso(j.pubDate),
    salary: salaryText(r),
    salaryRange: r,
    tags: [...(j.seniority ?? []), ...(j.categories ?? []).slice(0, 6).map(c => c.replace(/-/g, " ")), j.employmentType ?? ""].filter(Boolean),
  }, [j.employmentType]);
}

// ── Jobicy ───────────────────────────────────────────────────────────────────

interface JobicyJob {
  id: number; url: string; jobTitle: string; companyName: string; jobGeo: string; jobLevel?: string; jobType?: string[];
  jobIndustry?: string[]; jobDescription: string; pubDate: string; salaryMin?: number; salaryMax?: number;
  salaryCurrency?: string; salaryPeriod?: string;
}

const jobicy: Adapter = {
  meta: META.jobicy,
  remoteOnly: true,
  skip: ctx => (ctx.widen ? "Not used to widen a search" : null),
  run(ctx) {
    const { req } = ctx;
    // Jobicy takes one location per call; countries it has no location for are searched worldwide.
    const geos = [...new Set(req.countries.map(c => countryByCode(c)?.jobicy ?? ""))];
    const { terms, planOf } = termsFor(ctx, 1, englishTerms);
    return settle("jobicy", queryPairs(terms, geos.length ? geos : [""], 6).map(([term, geo]) => {
      const qs = new URLSearchParams({ count: "50", tag: term });
      if (geo) qs.set("geo", geo);
      return getJson<unknown>(`https://jobicy.com/api/v2/remote-jobs?${qs}`, { next: { revalidate: 3600 } })
        .then(body => jobicyList(body).map(j => ({ job: jobicyJob(j), plan: planOf.get(term) ?? null })));
    }));
  },
};

/** Jobicy answers a search with no match without a "jobs" array; that is an empty result, not a failure. */
function jobicyList(body: unknown): JobicyJob[] {
  const b = body as { jobs?: unknown; jobCount?: unknown; success?: unknown } | null;
  if (b && !Array.isArray(b.jobs) && (b.jobCount === 0 || b.success === false)) return [];
  return listOf<JobicyJob>("jobicy", body, "jobs");
}

function jobicyJob(j: JobicyJob): Job {
  const r = range(j.salaryMin, j.salaryMax, j.salaryCurrency, j.salaryPeriod);
  return job({
    id: `jobicy:${j.id}`,
    source: "jobicy",
    title: clean(j.jobTitle),
    company: clean(j.companyName),
    location: clean(j.jobGeo).replace(/,\s+/g, ", ") || "Anywhere",
    remote: true,
    url: j.url,
    description: htmlToText(j.jobDescription ?? ""),
    postedAt: iso(j.pubDate),
    salary: salaryText(r),
    salaryRange: r,
    tags: [j.jobLevel ?? "", ...(j.jobIndustry ?? []), ...(j.jobType ?? [])].filter(Boolean).map(t => htmlToText(t, 60)),
  }, j.jobType ?? []);
}

// ── Remotive ─────────────────────────────────────────────────────────────────

interface RemotiveJob {
  id: number; url: string; title: string; company_name: string; category: string; tags: string[];
  job_type: string; publication_date: string; candidate_required_location: string; salary: string; description: string;
}

const remotive: Adapter = {
  meta: META.remotive,
  remoteOnly: true,
  skip: ctx => (ctx.widen ? "Not used to widen a search" : null),
  async run(ctx) {
    // The whole public feed in one call, refreshed every 6 hours (Remotive asks for at most 4 a day).
    // A feed isn't a search, so only the listings that are one of the roles are returned.
    const feed = await getJson<unknown>("https://remotive.com/api/remote-jobs", { next: { revalidate: 21600 } });
    return listOf<RemotiveJob>("remotive", feed, "jobs")
      .map(j => ({
        plan: null,
        job: job({
          id: `remotive:${j.id}`,
          source: "remotive",
          title: clean(j.title),
          company: clean(j.company_name),
          location: clean(j.candidate_required_location) || "Worldwide",
          remote: true,
          url: j.url,
          description: htmlToText(j.description ?? ""),
          postedAt: iso(j.publication_date),
          salary: clean(j.salary, 80) || null,
          salaryRange: parseSalary(j.salary),
          tags: [j.category, ...(j.tags ?? []).slice(0, 8)].filter(Boolean),
        }, [j.job_type]),
      }))
      .filter(f => judge(f, ctx) !== null);
  },
};

// ── Arbeitnow (Germany, Austria, Switzerland) ────────────────────────────────

interface ArbeitnowJob {
  slug: string; company_name: string; title: string; description: string; remote: boolean; url: string;
  tags: string[]; job_types: string[]; location: string; created_at: number;
}

// Each page is ~2 MB, too big for the fetch cache, so the trimmed result is cached instead.
const arbeitnowFeed = unstable_cache(
  async (): Promise<Job[]> => {
    const pages = await Promise.all([1, 2].map(p =>
      fetch(via(`https://www.arbeitnow.com/api/job-board-api?page=${p}`), {
        headers: { Accept: "application/json", "User-Agent": UA }, signal: AbortSignal.timeout(TIMEOUT), cache: "no-store",
      }).then(async r => { if (!r.ok) throw new SourceError(`HTTP ${r.status}`); return (await r.json()) as unknown; }),
    ));
    return pages.flatMap(p => listOf<ArbeitnowJob>("arbeitnow", p, "data")).map(j => job({
      id: `arbeitnow:${j.slug}`,
      source: "arbeitnow",
      title: clean(j.title),
      company: clean(j.company_name),
      location: clean(j.location) || "Germany",
      remote: Boolean(j.remote),
      url: j.url,
      description: htmlToText(j.description ?? "", 3000),
      postedAt: iso(j.created_at),
      salary: null,
      salaryRange: null,
      tags: [...(j.tags ?? []), ...(j.job_types ?? [])].slice(0, 8),
    }, j.job_types ?? []));
  },
  ["agent-arbeitnow-v2"],
  { revalidate: 3600 },
);

const arbeitnow: Adapter = {
  meta: META.arbeitnow,
  skip: ({ req, widen }) => (widen ? "Not used to widen a search" : req.countries.some(c => ["DE", "AT", "CH"].includes(c)) ? null : "Germany, Austria and Switzerland only"),
  async run(ctx) {
    return (await arbeitnowFeed())
      .filter(j => (j.remote ? ctx.req.remote : ctx.req.onsite))
      .map(j => ({ job: { ...j, tags: [...j.tags] }, plan: null }))
      .filter(f => judge(f, ctx) !== null);
  },
};

// ── Jooble (key) ─────────────────────────────────────────────────────────────

interface JoobleJob { id?: number | string; title: string; location: string; snippet: string; salary: string; source: string; type: string; link: string; company: string; updated: string }

const joobleMemo = new Map<string, { at: number; jobs: Job[] }>();

const jooble: Adapter = {
  meta: META.jooble,
  skip: ({ req, widen }) => (widen ? "Not used to widen a search" : req.roles.length ? null : "Needs a target role"),
  run(ctx) {
    const { req } = ctx;
    const key = process.env.JOOBLE_API_KEY!.trim();
    const places = req.city ? [req.city] : req.countries.length ? req.countries.map(c => countryByCode(c)?.en ?? c) : [""];
    const { terms, planOf } = termsFor(ctx, 2, p => marketTerms(p, req.countries));
    // Each call counts against the key's allowance: at most 6 a search (every term and country once).
    return settle("jooble", queryPairs(terms, places, 6).map(([term, place]) => {
      const plan = planOf.get(term) ?? null;
      const memoKey = `${norm(term)}|${place}`;
      const hit = joobleMemo.get(memoKey);
      if (hit && Date.now() - hit.at < 30 * 60_000) return Promise.resolve(hit.jobs.map(j => ({ job: { ...j }, plan })));
      return getJson<unknown>(`https://jooble.org/api/${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: term, location: place, page: "1" }),
        cache: "no-store",
      }).then(body => {
        const jobs = listOf<JoobleJob>("jooble", body, "jobs").map(j => job({
          id: `jooble:${j.id ?? j.link}`,
          source: "jooble",
          title: clean(htmlToText(j.title)),
          company: clean(j.company) || "-",
          location: clean(j.location),
          remote: /remote|à distance|télétravail|عن بعد/i.test(`${j.title} ${j.location} ${j.type}`),
          url: j.link,
          description: htmlToText(j.snippet ?? ""),
          postedAt: iso(j.updated),
          salary: clean(j.salary, 80) || null,
          salaryRange: parseSalary(j.salary),
          tags: [j.type, j.source].filter(Boolean).map(t => clean(t, 60)),
        }, [j.type]));
        joobleMemo.set(memoKey, { at: Date.now(), jobs });
        return jobs.map(j => ({ job: j, plan }));
      });
    }));
  },
};

// ── Adzuna (keys) ────────────────────────────────────────────────────────────

interface AdzunaJob {
  id: string; title: string; description: string; created: string; redirect_url: string;
  company?: { display_name?: string }; location?: { display_name?: string };
  salary_min?: number; salary_max?: number; salary_is_predicted?: string | number; contract_time?: string; category?: { label?: string };
}

const ADZUNA_CURRENCY: Record<string, string> = { gb: "GBP", us: "USD", ca: "CAD", au: "AUD", nz: "NZD", in: "INR", sg: "SGD", za: "ZAR", br: "BRL", mx: "MXN", ch: "CHF", pl: "PLN" };

const adzuna: Adapter = {
  meta: META.adzuna,
  skip: ({ req, widen }) => (widen ? "Not used to widen a search" : req.countries.some(c => countryByCode(c)?.adzuna) ? null : "Doesn't cover the countries you chose"),
  run(ctx) {
    const { req } = ctx;
    const id = process.env.ADZUNA_APP_ID!.trim();
    const key = process.env.ADZUNA_APP_KEY!.trim();
    const markets = req.countries.map(c => ({ code: c, az: countryByCode(c)?.adzuna })).filter(m => m.az);
    const { terms, planOf } = termsFor(ctx, 2, p => marketTerms(p, req.countries));
    // Each call counts against the key's allowance: at most 6 a search (every term and country once).
    return settle("adzuna", queryPairs(terms, markets, 6).map(([term, m]) => {
      const qs = new URLSearchParams({ app_id: id, app_key: key, what: term, results_per_page: "20", "content-type": "application/json" });
      if (req.city) qs.set("where", req.city);
      return getJson<unknown>(`https://api.adzuna.com/v1/api/jobs/${m.az}/search/1?${qs}`, { next: { revalidate: 3600 } })
        .then(body => listOf<AdzunaJob>("adzuna", body, "results").map(j => {
          const predicted = String(j.salary_is_predicted ?? "0") === "1";
          const r = predicted ? null : range(j.salary_min, j.salary_max, ADZUNA_CURRENCY[m.az!] ?? "EUR", "year");
          return {
            plan: planOf.get(term) ?? null,
            job: job({
              id: `adzuna:${j.id}`,
              source: "adzuna",
              title: clean(htmlToText(j.title)),
              company: clean(j.company?.display_name) || "-",
              location: clean(j.location?.display_name) || (countryByCode(m.code)?.en ?? ""),
              remote: /remote|home[- ]based|télétravail/i.test(`${j.title} ${j.description}`),
              url: j.redirect_url,
              description: htmlToText(j.description ?? ""),
              postedAt: iso(j.created),
              salary: salaryText(r),
              salaryRange: r,
              tags: [j.category?.label ?? "", j.contract_time ?? ""].filter(Boolean),
            }, [j.contract_time]),
          };
        }));
    }));
  },
};

// ── All sources ──────────────────────────────────────────────────────────────

const cityOf = (location: string) => norm(location.split(/[,(/]/)[0] ?? "");
const countryOf = (location: string) => norm(location.split(",").pop() ?? "");
/** The same job at the same employer in the same country (another city is the same posting for another branch). */
const sameJobKey = (j: Job) => `${norm(j.title)}|${norm(j.company)}|${countryOf(j.location)}`;

const ADAPTERS: Adapter[] = [workable, himalayas, jobicy, remotive, arbeitnow, jooble, adzuna];

/** Why a source isn't asked for this search, or null when it is. */
function skipReason(a: Adapter, ctx: Ctx): string | null {
  if (a.remoteOnly && !ctx.req.remote) return "Remote jobs only";
  return a.skip?.(ctx) ?? null;
}

/** How a role was searched, for the candidate: spelling fixed, the job understood, its other titles and neighbours. */
function roleSearch(p: RolePlan, found: number, widened: string[]): RoleSearch {
  const f = p.family;
  const own = bare(p.role);
  const titles = f ? [...new Set([...(f.search ?? []), ...f.titles])].filter(t => /^[\x20-\x7e]+$/.test(t) && bare(t) !== own) : [];
  const parent = f?.parent ? familyById(f.parent) : undefined;
  return {
    input: p.input,
    role: p.role,
    corrected: p.corrected,
    job: f ? familyLabel(f) : null,
    sameTitles: titles.slice(0, 6),
    related: p.related.map(id => familyById(id)).filter((r): r is Family => Boolean(r)).map(familyLabel),
    field: p.field,
    kindOf: parent ? familyLabel(parent) : null,
    byWords: !f && !p.field,
    extras: p.extras,
    widened,
    found,
  };
}

interface Pass { reports: SourceReport[]; found: { job: Job; verdict: Verdict; source: Id }[] }

/** Asks every source (or, when widening, the sources that can widen) and judges what they return. */
async function runPass(ctx: Ctx, wanted: string[]): Promise<Pass> {
  const reports: SourceReport[] = [];
  const found: Pass["found"] = [];
  await Promise.all(ADAPTERS.map(async a => {
    const m = a.meta;
    const base = { id: m.id, name: m.name, attribution: m.attribution, home: m.home, configured: sourceConfigured(m) };
    if (!base.configured) { reports.push({ ...base, ok: false, count: 0, note: `Needs ${m.needs!.join(" and ")}` }); return; }
    const skip = skipReason(a, ctx);
    if (skip) { reports.push({ ...base, ok: true, count: 0, skipped: true, note: skip }); return; }
    try {
      const listings = await a.run(ctx);
      let other = ctx.unrelated[m.id] ?? 0;
      let elsewhere = 0;
      let filtered = 0;
      for (const f of listings) {
        const verdict = judge(f, ctx);
        if (!verdict) { if (!f.sweep) other++; continue; }
        const why = placeOrFilter(f.job, ctx.req, wanted);
        if (why === "elsewhere") { elsewhere++; continue; }
        if (why === "filtered") { filtered++; continue; }
        found.push({ job: f.job, verdict, source: m.id });
      }
      reports.push({ ...base, ok: true, count: 0, unrelated: other, closed: ctx.closed[m.id] ?? 0, elsewhere, filtered });
    } catch (err) {
      const note = describe(err);
      console.error(`[agent/search] ${m.id}: ${note}`);
      reports.push({ ...base, ok: false, count: 0, note });
    }
  }));
  return { reports, found };
}

/** The widening pass is skipped when the first pass took longer than this (the search must answer within its time limit). */
const WIDEN_BEFORE_MS = 14_000;

export async function searchJobs(req: SearchRequest): Promise<SearchResponse> {
  const started = Date.now();
  const ctx: Ctx = { req, plans: req.roles.map(r => planRole(r, Boolean(req.related))), closed: {}, unrelated: {} };
  // The countries a listing must be open to: the chosen ones, or the city's.
  const wanted = req.countries.length ? req.countries : req.city ? countriesIn(req.city) : [];
  const first = await runPass(ctx, wanted);
  const all = [...first.found];
  const reports = first.reports;

  // Roles that found nothing: search their related or broader titles once (Workable and Himalayas),
  // and label what that finds. The candidate's own wording is never replaced silently.
  const perPlan = ctx.plans.map((_, i) => all.filter(x => x.verdict.plan === i).length);
  const widen = new Map<number, string[]>();
  ctx.plans.forEach((p, i) => { if (!perPlan[i]) { const t = widenTerms(p); if (t.length) widen.set(i, t); } });
  if (widen.size && Date.now() - started >= WIDEN_BEFORE_MS) widen.clear();
  if (widen.size && Date.now() - started < WIDEN_BEFORE_MS) {
    const second = await runPass({ ...ctx, widen, closed: {}, unrelated: {} }, wanted);
    for (const x of second.found) if (!all.some(y => y.job.id === x.job.id)) all.push(x);
    for (const r of second.reports) {
      const r1 = reports.find(x => x.id === r.id);
      if (!r1 || r.skipped || !r.ok) continue;
      r1.elsewhere = (r1.elsewhere ?? 0) + (r.elsewhere ?? 0);
      r1.filtered = (r1.filtered ?? 0) + (r.filtered ?? 0);
      r1.closed = (r1.closed ?? 0) + (r.closed ?? 0);
      if (!r1.ok) { r1.ok = true; r1.note = undefined; }
    }
  }

  // The same job from two sources, or twice from one (posted again in the same city): keep the
  // first. The same job and employer in other cities of the same country: one listing that names
  // the other cities and links to their postings. Both are counted, so each source's number is
  // what the candidate actually sees.
  const seen = new Set<string>();
  const firstOfKind = new Map<string, Job>();
  const jobs: Job[] = [];
  const kept: Partial<Record<SourceId, number>> = {};
  const dupes: Partial<Record<SourceId, number>> = {};
  const byPlan = ctx.plans.map(() => 0);
  for (const { job: j, verdict } of all) {
    if (!j.title || !j.url || !/^https:\/\//.test(j.url)) continue;
    const here = `${norm(j.title)}|${norm(j.company)}|${cityOf(j.location)}`;
    if (seen.has(here) || seen.has(j.id)) { dupes[j.source] = (dupes[j.source] ?? 0) + 1; continue; }
    seen.add(here); seen.add(j.id);
    const firstJob = j.company !== "-" ? firstOfKind.get(sameJobKey(j)) : undefined;
    if (firstJob && (firstJob.alsoAt?.length ?? 0) < 12) {
      (firstJob.alsoAt ??= []).push({ location: j.location, url: j.url });
      dupes[j.source] = (dupes[j.source] ?? 0) + 1;
      continue;
    }
    if (verdict.how === "widened") j.widened = true;
    firstOfKind.set(sameJobKey(j), j);
    kept[j.source] = (kept[j.source] ?? 0) + 1;
    byPlan[verdict.plan]++;
    jobs.push(j);
  }
  for (const r of reports) {
    if (!r.ok || r.skipped) continue;
    r.count = kept[r.id] ?? 0;
    if (dupes[r.id]) r.duplicates = dupes[r.id];
  }
  jobs.sort((a, b) => Number(Boolean(a.widened)) - Number(Boolean(b.widened)) || (b.postedAt ?? "").localeCompare(a.postedAt ?? ""));
  const order = SOURCE_META.map(m => m.id as SourceId);
  reports.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  return {
    jobs: jobs.slice(0, 200),
    sources: reports,
    fetchedAt: new Date().toISOString(),
    roles: ctx.plans.map((p, i) => roleSearch(p, byPlan[i], widen.get(i) ?? [])),
  };
}
