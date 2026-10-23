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
// same job, its neighbours. Sources are asked for every role and country, within a per-source
// budget of calls. Listings that turn out to be a different job (a Python engineer on a
// bartender search) are left out and counted, never silently: the report says how many.
//
// Calls are cached (Next.js data cache) so repeated searches don't hit the sources again.
// LinkedIn, Indeed, Bayt and GulfTalent have no public job-search API; the agent links to a
// search on those sites instead, and the candidate can add any listing by hand.

import { unstable_cache } from "next/cache";
import { countryByCode } from "./countries";
import { bare, findApplyEmail, htmlToText, norm, phraseRe, words } from "./text";
import { parseSalary } from "./salary";
import { SECTOR_SEARCHES, familyById, familyLabel, mentionsJob, planRole, titleFit, type Family, type RolePlan } from "./titles";
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

function job(p: Omit<Job, "applyEmail" | "description"> & { description: string }): Job {
  const description = p.description.slice(0, MAX_DESC);
  return { ...p, description, applyEmail: findApplyEmail(description) };
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
}

/** A listing and the target role (index into ctx.plans) whose search found it, or null for a feed. */
interface Found {
  job: Job;
  plan: number | null;
  /** Found by a search of the whole sector ("food and beverage"), not of the role: not counted as left out. */
  sweep?: boolean;
}

interface Adapter {
  meta: SourceMeta;
  /** Remote jobs only: not asked when the candidate wants on-site jobs only. */
  remoteOnly?: boolean;
  /**
   * The source's keyword search can be trusted for a role the agent doesn't know (its results
   * contain the words searched). Workable's search also returns loosely related jobs, and feeds
   * aren't searched at all, so their listings must share the role's words.
   */
  keywordSearch?: boolean;
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

/**
 * The terms to send for the roles, with the role each belongs to: every role's own title first,
 * then the other common titles for the same job (and its neighbours when asked), `perRole` at most.
 */
function termsFor(plans: RolePlan[], perRole: number): { terms: string[]; planOf: Map<string, number> } {
  const terms: string[] = [];
  const planOf = new Map<string, number>();
  const seen = new Set<string>();
  for (let rank = 0; rank < perRole; rank++) {
    plans.forEach((p, i) => {
      const t = p.terms[rank];
      if (t && !seen.has(norm(t))) { seen.add(norm(t)); terms.push(t); planOf.set(t, i); }
    });
  }
  return { terms, planOf };
}

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

const stem = (w: string) => (w.length <= 4 ? w : w.replace(/(ing|ers?|es|s)$/u, ""));

/** For a role the agent doesn't know: the listing's title or tags share a word with it, or its text names it. */
function wordsFit(p: RolePlan, j: Job, keywords: string[]): boolean {
  const targets = [...words(p.role), ...keywords.flatMap(k => words(k))].filter(w => w.length >= 3).map(stem);
  if (!targets.length) return true;
  const hay = words(`${j.title} ${j.tags.join(" ")}`).map(stem);
  if (targets.some(w => hay.some(h => h === w || h.startsWith(w.slice(0, Math.max(4, w.length - 2)))))) return true;
  return phraseRe(p.role).test(norm(j.description.slice(0, 1500)));
}

/**
 * The target role a listing is (index into ctx.plans), or null when it is none of them:
 *  - a job the agent knows: the listing's title is that job (any way of writing it), a neighbour
 *    when the candidate asked for them, or a title the agent doesn't know in a listing that names the job;
 *  - a role the agent doesn't know: a listing a keyword search found for it stands; otherwise
 *    the listing must share its words.
 */
function planFor(f: Found, ctx: Ctx, keywordSearch: boolean): number | null {
  const j = f.job;
  const intro = `${j.tags.join(" ")}\n${j.description.slice(0, 1500)}`;
  for (let i = 0; i < ctx.plans.length; i++) {
    const p = ctx.plans[i];
    if (!p.family) continue;
    const fit = titleFit(p, j.title, intro);
    if (fit === "same" || (fit === "related" && ctx.req.related)) return i;
    // A title the agent doesn't know counts when the listing names the job, but not in a sector
    // search, where many listings mention jobs they aren't ("reporting to the restaurant manager").
    if (fit === "unknown" && !f.sweep && mentionsJob(p, j.title, intro)) return i;
  }
  if (keywordSearch && f.plan !== null && !ctx.plans[f.plan]?.family) return f.plan;
  for (let i = 0; i < ctx.plans.length; i++) {
    if (!ctx.plans[i].family && wordsFit(ctx.plans[i], j, ctx.req.keywords)) return i;
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
 * A listing's web page (jobs.workable.com/view/<id>): the schema.org JobPosting that Workable
 * publishes in it, with the description, requirements, benefits, posting date and stated pay.
 */
export function parseWorkableLd(html: string): WorkableDetails | null {
  for (const block of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let data: unknown;
    try { data = JSON.parse(block[1]); } catch { continue; }
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
  });
}

/** Title words that say little about the job on their own ("Staff Backend Engineer" is not bar staff). */
const GENERIC = new Set(["staff", "attendant", "associate", "specialist", "service", "services", "maker", "member", "crew", "agent", "officer",
  "executive", "assistant", "supervisor", "director", "operations", "general", "chief", "deputy", "team", "leader", "de", "du"]);

/**
 * How much a search row is worth opening, judged by its title alone (before its page is loaded):
 * 3 the job (or a neighbour asked for), 2 a title the agent doesn't know that shares a word with
 * the job, 1 a row for a role the agent doesn't know, 0 a different job (left out, not opened).
 */
function rowWorth(f: Found, ctx: Ctx): number {
  if (f.sweep) {
    return ctx.plans.some(p => {
      const fit = p.family ? titleFit(p, f.job.title) : "unknown";
      return fit === "same" || (fit === "related" && ctx.req.related) || (!p.family && wordsFit(p, f.job, ctx.req.keywords));
    }) ? 3 : 0;
  }
  let worth = 0;
  for (const p of ctx.plans) {
    if (!p.family) {
      worth = Math.max(worth, wordsFit(p, f.job, ctx.req.keywords) ? 3 : 1);
      continue;
    }
    const fit = titleFit(p, f.job.title);
    if (fit === "same" || (fit === "related" && ctx.req.related)) return 3;
    if (fit === "unknown") {
      const own = new Set([...p.family.titles, p.role].flatMap(t => words(t)).filter(w => !GENERIC.has(w)).map(stem));
      if (words(f.job.title).map(stem).some(w => own.has(w))) worth = Math.max(worth, 2);
    }
  }
  return worth;
}

const workable: Adapter = {
  meta: META.workable,
  async run(ctx) {
    const { req, plans } = ctx;
    const places = req.countries.length ? req.countries.map(c => countryByCode(c)?.en ?? c) : [""];
    const { terms, planOf } = termsFor(plans, req.related ? 3 : 2);
    // At most 10 searches for the roles (every term and country at least once). For hospitality
    // jobs, up to 6 more of the sector in the chosen countries: employers title the same work many
    // ways ("Food & Beverage / Fine Dining Server", "Restaurant Captain"), and Workable matches titles
    // closely. Five at a time, each cached an hour.
    const queries = queryPairs(terms, places, 10).map(([term, place]) => ({ term, place, plan: planOf.get(term) ?? null, sweep: false }));
    if (req.countries.length) {
      const sectorTerms = [...new Set(plans.flatMap(p => (p.family?.sector ? SECTOR_SEARCHES[p.family.sector] : [])))];
      for (const [term, place] of queryPairs(sectorTerms, places, 6)) queries.push({ term, place, plan: null, sweep: true });
    }
    const slot = limiter(5);
    const rows = await settle("workable", queries.map(q => slot(async () => {
      const qs = new URLSearchParams({ query: q.term });
      if (q.place) qs.set("location", q.place);
      if (req.remote && !req.onsite) qs.set("workplace", "remote");
      const page = await getPage(`${WORKABLE}/jobs.md?${qs}`, { next: { revalidate: 3600 } });
      const list = page ? parseWorkableSearch(page.text) : null;
      if (!list) { console.error("[agent/search] workable: unexpected search response"); throw new SourceError("Unexpected response"); }
      return list.map(r => ({ job: workableJob(r), plan: q.plan, sweep: q.sweep }));
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
    const stopAt = Date.now() + WORKABLE_PAGES_MS;
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
  keywordSearch: true,
  run({ req, plans }) {
    const { terms, planOf } = termsFor(plans, 1);
    const queries: [string, string | null][] = req.countries.length ? queryPairs(terms, req.countries, 9) : terms.map(t => [t, null]);
    return settle("himalayas", queries.map(([term, c]) => {
      const qs = new URLSearchParams({ q: term });
      if (c) qs.set("country", c);
      return getJson<unknown>(`https://himalayas.app/jobs/api/search?${qs}`, { next: { revalidate: 3600 } })
        .then(body => listOf<HimalayasJob>("himalayas", body, "jobs").map(j => ({ job: himalayasJob(j), plan: planOf.get(term) ?? null })));
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
  });
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
  keywordSearch: true,
  run({ req, plans }) {
    // Jobicy takes one location per call; countries it has no location for are searched worldwide.
    const geos = [...new Set(req.countries.map(c => countryByCode(c)?.jobicy ?? ""))];
    const { terms, planOf } = termsFor(plans, 1);
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
  });
}

// ── Remotive ─────────────────────────────────────────────────────────────────

interface RemotiveJob {
  id: number; url: string; title: string; company_name: string; category: string; tags: string[];
  job_type: string; publication_date: string; candidate_required_location: string; salary: string; description: string;
}

const remotive: Adapter = {
  meta: META.remotive,
  remoteOnly: true,
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
        }),
      }))
      .filter(f => planFor(f, ctx, false) !== null);
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
    }));
  },
  ["agent-arbeitnow-v1"],
  { revalidate: 3600 },
);

const arbeitnow: Adapter = {
  meta: META.arbeitnow,
  skip: ({ req }) => (req.countries.some(c => ["DE", "AT", "CH"].includes(c)) ? null : "Germany, Austria and Switzerland only"),
  async run(ctx) {
    return (await arbeitnowFeed())
      .filter(j => (j.remote ? ctx.req.remote : ctx.req.onsite))
      .map(j => ({ job: { ...j, tags: [...j.tags] }, plan: null }))
      .filter(f => planFor(f, ctx, false) !== null);
  },
};

// ── Jooble (key) ─────────────────────────────────────────────────────────────

interface JoobleJob { id?: number | string; title: string; location: string; snippet: string; salary: string; source: string; type: string; link: string; company: string; updated: string }

const joobleMemo = new Map<string, { at: number; jobs: Job[] }>();

const jooble: Adapter = {
  meta: META.jooble,
  keywordSearch: true,
  skip: ({ req }) => (req.roles.length ? null : "Needs a target role"),
  run({ req, plans }) {
    const key = process.env.JOOBLE_API_KEY!.trim();
    const places = req.countries.length ? req.countries.map(c => countryByCode(c)?.en ?? c) : [""];
    const { terms, planOf } = termsFor(plans, 2);
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
        }));
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
  keywordSearch: true,
  skip: ({ req }) => (req.countries.some(c => countryByCode(c)?.adzuna) ? null : "Doesn't cover the countries you chose"),
  run({ req, plans }) {
    const id = process.env.ADZUNA_APP_ID!.trim();
    const key = process.env.ADZUNA_APP_KEY!.trim();
    const markets = req.countries.map(c => ({ code: c, az: countryByCode(c)?.adzuna })).filter(m => m.az);
    const { terms, planOf } = termsFor(plans, 2);
    // Each call counts against the key's allowance: at most 6 a search (every term and country once).
    return settle("adzuna", queryPairs(terms, markets, 6).map(([term, m]) => {
      const qs = new URLSearchParams({ app_id: id, app_key: key, what: term, results_per_page: "20", "content-type": "application/json" });
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
            }),
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
function roleSearch(p: RolePlan): RoleSearch {
  const f = p.family;
  const own = bare(p.role);
  const titles = f ? [...new Set([...(f.search ?? []), ...f.titles])].filter(t => /^[\x20-\x7e]+$/.test(t) && bare(t) !== own) : [];
  return {
    input: p.input,
    role: p.role,
    corrected: p.corrected,
    job: f ? familyLabel(f) : null,
    sameTitles: titles.slice(0, 6),
    related: p.related.map(id => familyById(id)).filter((r): r is Family => Boolean(r)).map(familyLabel),
  };
}

export async function searchJobs(req: SearchRequest): Promise<SearchResponse> {
  const ctx: Ctx = { req, plans: req.roles.map(r => planRole(r, Boolean(req.related))), closed: {}, unrelated: {} };
  const reports: SourceReport[] = [];
  const lists = await Promise.all(ADAPTERS.map(async a => {
    const m = a.meta;
    const base = { id: m.id, name: m.name, attribution: m.attribution, home: m.home, configured: sourceConfigured(m) };
    if (!base.configured) { reports.push({ ...base, ok: false, count: 0, note: `Needs ${m.needs!.join(" and ")}` }); return []; }
    const skip = skipReason(a, ctx);
    if (skip) { reports.push({ ...base, ok: true, count: 0, skipped: true, note: skip }); return []; }
    try {
      const found = await a.run(ctx);
      const wanted: Job[] = [];
      let other = ctx.unrelated[m.id] ?? 0;
      for (const f of found) {
        if (planFor(f, ctx, Boolean(a.keywordSearch)) !== null) wanted.push(f.job);
        else if (!f.sweep) other++;
      }
      reports.push({ ...base, ok: true, count: wanted.length, unrelated: other, closed: ctx.closed[m.id] ?? 0 });
      return wanted;
    } catch (err) {
      const note = describe(err);
      console.error(`[agent/search] ${m.id}: ${note}`);
      reports.push({ ...base, ok: false, count: 0, note });
      return [];
    }
  }));

  // The same job from two sources, or twice from one (posted again in the same city): keep the
  // first. The same job and employer in other cities of the same country: one listing that names
  // the other cities and links to their postings. Both are counted, so each source's number is
  // what the candidate actually sees.
  const seen = new Set<string>();
  const firstOfKind = new Map<string, Job>();
  const jobs: Job[] = [];
  const kept: Partial<Record<SourceId, number>> = {};
  const dupes: Partial<Record<SourceId, number>> = {};
  for (const j of lists.flat()) {
    if (!j.title || !j.url || !/^https:\/\//.test(j.url)) continue;
    const here = `${norm(j.title)}|${norm(j.company)}|${cityOf(j.location)}`;
    if (seen.has(here) || seen.has(j.id)) { dupes[j.source] = (dupes[j.source] ?? 0) + 1; continue; }
    seen.add(here); seen.add(j.id);
    const first = j.company !== "-" ? firstOfKind.get(sameJobKey(j)) : undefined;
    if (first && (first.alsoAt?.length ?? 0) < 12) {
      (first.alsoAt ??= []).push({ location: j.location, url: j.url });
      dupes[j.source] = (dupes[j.source] ?? 0) + 1;
      continue;
    }
    firstOfKind.set(sameJobKey(j), j);
    kept[j.source] = (kept[j.source] ?? 0) + 1;
    jobs.push(j);
  }
  for (const r of reports) {
    if (!r.ok || r.skipped) continue;
    r.count = kept[r.id] ?? 0;
    if (dupes[r.id]) r.duplicates = dupes[r.id];
  }
  jobs.sort((a, b) => (b.postedAt ?? "").localeCompare(a.postedAt ?? ""));
  const order = SOURCE_META.map(m => m.id as SourceId);
  reports.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  return { jobs: jobs.slice(0, 200), sources: reports, fetchedAt: new Date().toISOString(), roles: ctx.plans.map(roleSearch) };
}
