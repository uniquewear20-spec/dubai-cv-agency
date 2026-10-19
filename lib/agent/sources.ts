// lib/agent/sources.ts — server only. Finds jobs through public job APIs that allow it, and turns
// every listing into the same shape. Each source's terms are respected:
//
//   Himalayas  himalayas.app/jobs/api/search   remote jobs; credit Himalayas and link to the listing
//   Jobicy     jobicy.com/api/v2/remote-jobs   remote jobs; credit Jobicy, apply buttons go to its URL
//   Remotive   remotive.com/api/remote-jobs    remote jobs (small public feed, 24 h delay); credit
//                                              Remotive, link to the listing, at most 4 calls a day
//   Arbeitnow  arbeitnow.com/api/job-board-api jobs in Germany, Austria and Switzerland; link back
//   Jooble     jooble.org/api/{key}            on-site jobs worldwide incl. the Gulf; needs JOOBLE_API_KEY
//   Adzuna     api.adzuna.com/v1/api/jobs      on-site jobs in 19 countries (no Gulf); needs
//                                              ADZUNA_APP_ID and ADZUNA_APP_KEY; credit "Jobs by Adzuna"
//
// Calls are cached (Next.js data cache) so repeated searches don't hit the sources again:
// one hour for most, six hours for Remotive (its whole feed is one call: at most 4 a day).
// LinkedIn, Indeed, Bayt and GulfTalent have no public job-search API; the agent links to a
// search on those sites instead, and the candidate can add any listing by hand.

import { unstable_cache } from "next/cache";
import { countryByCode } from "./countries";
import { findApplyEmail, htmlToText, norm, words } from "./text";
import { parseSalary } from "./salary";
import type { Job, SalaryRange, SearchRequest, SearchResponse, SourceId, SourceReport } from "./types";

const UA = "ZenithDubaiCV-JobAgent/1.0 (+https://zenithdubaicv.com/agent/)";
const TIMEOUT = 8_000;
const MAX_DESC = 8_000;

// Local tests only: send source calls to a fixture server. Never active on Vercel.
const FIXTURE = process.env.VERCEL ? null : process.env.AGENT_SOURCES_FIXTURE_URL?.replace(/\/$/, "") || null;
const via = (url: string) => (FIXTURE ? `${FIXTURE}/${url.replace(/^https?:\/\//, "")}` : url);

interface SourceMeta { id: SourceId; name: string; home: string; attribution: string; needs?: string[] }

export const SOURCE_META: SourceMeta[] = [
  { id: "himalayas", name: "Himalayas", home: "https://himalayas.app/jobs", attribution: "Remote jobs from Himalayas" },
  { id: "jobicy", name: "Jobicy", home: "https://jobicy.com", attribution: "Remote jobs from Jobicy" },
  { id: "remotive", name: "Remotive", home: "https://remotive.com", attribution: "Remote jobs from Remotive" },
  { id: "arbeitnow", name: "Arbeitnow", home: "https://www.arbeitnow.com", attribution: "Jobs from Arbeitnow" },
  { id: "jooble", name: "Jooble", home: "https://jooble.org", attribution: "Jobs from Jooble", needs: ["JOOBLE_API_KEY"] },
  { id: "adzuna", name: "Adzuna", home: "https://www.adzuna.com", attribution: "Jobs by Adzuna", needs: ["ADZUNA_APP_ID", "ADZUNA_APP_KEY"] },
];

export const sourceConfigured = (m: SourceMeta): boolean => (m.needs ?? []).every(k => Boolean(process.env[k]?.trim()));

class SourceError extends Error {}

async function getJson<T>(url: string, init: RequestInit & { next?: { revalidate?: number } } = {}): Promise<T> {
  const res = await fetch(via(url), {
    ...init,
    headers: { Accept: "application/json", "User-Agent": UA, ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!res.ok) throw new SourceError(`HTTP ${res.status}`);
  return (await res.json()) as T;
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

/** Loose relevance filter for feeds that can't be searched: any target word in the title or tags. */
function relevant(title: string, tags: string[], req: SearchRequest): boolean {
  const targets = [...req.roles, ...req.keywords].flatMap(r => words(r)).filter(w => w.length >= 3);
  if (!targets.length) return true;
  const hay = new Set(words(`${title} ${tags.join(" ")}`));
  return targets.some(w => hay.has(w) || [...hay].some(h => h.startsWith(w.slice(0, Math.max(4, w.length - 2)))));
}

// ── Himalayas ────────────────────────────────────────────────────────────────

interface HimalayasJob {
  title: string; companyName: string; employmentType?: string; minSalary: number | null; maxSalary: number | null;
  salaryPeriod?: string; currency: string | null; seniority?: string[]; locationRestrictions?: string[];
  categories?: string[]; description: string; pubDate: number; applicationLink: string; guid: string;
}

async function himalayas(req: SearchRequest): Promise<Job[]> {
  const queries: string[] = [];
  for (const role of req.roles.slice(0, 2)) {
    if (req.countries.length) for (const c of req.countries.slice(0, 2)) queries.push(`q=${encodeURIComponent(role)}&country=${c}`);
    else queries.push(`q=${encodeURIComponent(role)}`);
  }
  const pages = await Promise.all(queries.map(q => getJson<{ jobs?: HimalayasJob[] }>(`https://himalayas.app/jobs/api/search?${q}`, { next: { revalidate: 3600 } })));
  return pages.flatMap(p => p.jobs ?? []).map(j => {
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
  });
}

// ── Jobicy ───────────────────────────────────────────────────────────────────

interface JobicyJob {
  id: number; url: string; jobTitle: string; companyName: string; jobGeo: string; jobLevel?: string; jobType?: string[];
  jobIndustry?: string[]; jobDescription: string; pubDate: string; salaryMin?: number; salaryMax?: number;
  salaryCurrency?: string; salaryPeriod?: string;
}

async function jobicy(req: SearchRequest): Promise<Job[]> {
  const geo = req.countries.map(c => countryByCode(c)?.jobicy).find(Boolean);
  const pages = await Promise.all(
    (req.roles.length ? req.roles.slice(0, 2) : [""]).map(role => {
      const qs = new URLSearchParams({ count: "50" });
      if (role) qs.set("tag", role);
      if (geo) qs.set("geo", geo);
      return getJson<{ jobs?: JobicyJob[] }>(`https://jobicy.com/api/v2/remote-jobs?${qs}`, { next: { revalidate: 3600 } });
    }),
  );
  return pages.flatMap(p => p.jobs ?? []).map(j => {
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
  });
}

// ── Remotive ─────────────────────────────────────────────────────────────────

interface RemotiveJob {
  id: number; url: string; title: string; company_name: string; category: string; tags: string[];
  job_type: string; publication_date: string; candidate_required_location: string; salary: string; description: string;
}

async function remotive(req: SearchRequest): Promise<Job[]> {
  // The whole public feed in one call, refreshed every 6 hours (Remotive asks for at most 4 a day).
  const feed = await getJson<{ jobs?: RemotiveJob[] }>("https://remotive.com/api/remote-jobs", { next: { revalidate: 21600 } });
  return (feed.jobs ?? [])
    .filter(j => relevant(j.title, [...j.tags, j.category], req))
    .map(j => job({
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
      tags: [j.category, ...j.tags.slice(0, 8)].filter(Boolean),
    }));
}

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
      }).then(async r => { if (!r.ok) throw new SourceError(`HTTP ${r.status}`); return (await r.json()) as { data?: ArbeitnowJob[] }; }),
    ));
    return pages.flatMap(p => p.data ?? []).map(j => job({
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

async function arbeitnow(req: SearchRequest): Promise<Job[]> {
  const jobs = await arbeitnowFeed();
  return jobs.filter(j => relevant(j.title, j.tags, req) && (j.remote ? req.remote : req.onsite));
}

// ── Jooble (key) ─────────────────────────────────────────────────────────────

interface JoobleJob { id?: number | string; title: string; location: string; snippet: string; salary: string; source: string; type: string; link: string; company: string; updated: string }

const joobleMemo = new Map<string, { at: number; jobs: Job[] }>();

async function jooble(req: SearchRequest): Promise<Job[]> {
  const key = process.env.JOOBLE_API_KEY!.trim();
  const places = req.countries.length ? req.countries.slice(0, 2).map(c => countryByCode(c)?.en ?? c) : [""];
  const calls: Promise<Job[]>[] = [];
  for (const role of req.roles.slice(0, 2)) {
    for (const place of places) {
      const memoKey = `${norm(role)}|${place}`;
      const hit = joobleMemo.get(memoKey);
      if (hit && Date.now() - hit.at < 30 * 60_000) { calls.push(Promise.resolve(hit.jobs)); continue; }
      calls.push(
        getJson<{ jobs?: JoobleJob[] }>(`https://jooble.org/api/${encodeURIComponent(key)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keywords: role, location: place, page: "1" }),
          cache: "no-store",
        }).then(r => {
          const jobs = (r.jobs ?? []).map(j => job({
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
          return jobs;
        }),
      );
    }
  }
  return (await Promise.all(calls)).flat();
}

// ── Adzuna (keys) ────────────────────────────────────────────────────────────

interface AdzunaJob {
  id: string; title: string; description: string; created: string; redirect_url: string;
  company?: { display_name?: string }; location?: { display_name?: string };
  salary_min?: number; salary_max?: number; salary_is_predicted?: string | number; contract_time?: string; category?: { label?: string };
}

async function adzuna(req: SearchRequest): Promise<Job[]> {
  const id = process.env.ADZUNA_APP_ID!.trim();
  const key = process.env.ADZUNA_APP_KEY!.trim();
  const markets = req.countries.map(c => ({ code: c, az: countryByCode(c)?.adzuna })).filter(m => m.az).slice(0, 2);
  const calls = markets.flatMap(m => req.roles.slice(0, 2).map(role => {
    const qs = new URLSearchParams({ app_id: id, app_key: key, what: role, results_per_page: "20", "content-type": "application/json" });
    return getJson<{ results?: AdzunaJob[] }>(`https://api.adzuna.com/v1/api/jobs/${m.az}/search/1?${qs}`, { next: { revalidate: 3600 } })
      .then(r => (r.results ?? []).map(j => {
        const predicted = String(j.salary_is_predicted ?? "0") === "1";
        const cur = { gb: "GBP", us: "USD", ca: "CAD", au: "AUD", nz: "NZD", in: "INR", sg: "SGD", za: "ZAR", br: "BRL", mx: "MXN", ch: "CHF", pl: "PLN" }[m.az!] ?? "EUR";
        const r2 = predicted ? null : range(j.salary_min, j.salary_max, cur, "year");
        return job({
          id: `adzuna:${j.id}`,
          source: "adzuna",
          title: clean(htmlToText(j.title)),
          company: clean(j.company?.display_name) || "-",
          location: clean(j.location?.display_name) || (countryByCode(m.code)?.en ?? ""),
          remote: /remote|home[- ]based|télétravail/i.test(`${j.title} ${j.description}`),
          url: j.redirect_url,
          description: htmlToText(j.description ?? ""),
          postedAt: iso(j.created),
          salary: salaryText(r2),
          salaryRange: r2,
          tags: [j.category?.label ?? "", j.contract_time ?? ""].filter(Boolean),
        });
      }));
  }));
  return (await Promise.all(calls)).flat();
}

// ── All sources ──────────────────────────────────────────────────────────────

const RUNNERS: Record<Exclude<SourceId, "manual">, (r: SearchRequest) => Promise<Job[]>> = { himalayas, jobicy, remotive, arbeitnow, jooble, adzuna };

/** Why a source isn't asked for this search, or null when it is. */
function skipReason(id: SourceId, req: SearchRequest): string | null {
  const remoteOnly = id === "himalayas" || id === "jobicy" || id === "remotive";
  if (remoteOnly && !req.remote) return "Remote jobs only";
  if (id === "arbeitnow" && !req.countries.some(c => ["DE", "AT", "CH"].includes(c))) return "Germany, Austria and Switzerland only";
  if (id === "adzuna" && !req.countries.some(c => countryByCode(c)?.adzuna)) return "Doesn't cover the countries you chose";
  if (id === "jooble" && !req.roles.length) return "Needs a target role";
  return null;
}

export async function searchJobs(req: SearchRequest): Promise<SearchResponse> {
  const reports: SourceReport[] = [];
  const lists = await Promise.all(SOURCE_META.map(async m => {
    const base = { id: m.id, name: m.name, attribution: m.attribution, home: m.home, configured: sourceConfigured(m) };
    if (!base.configured) { reports.push({ ...base, ok: false, count: 0, note: `Needs ${m.needs!.join(" and ")}` }); return []; }
    const skip = skipReason(m.id, req);
    if (skip) { reports.push({ ...base, ok: true, count: 0, skipped: true, note: skip }); return []; }
    try {
      const jobs = await RUNNERS[m.id as keyof typeof RUNNERS](req);
      reports.push({ ...base, ok: true, count: jobs.length });
      return jobs;
    } catch (err) {
      const note = err instanceof SourceError ? err.message : err instanceof Error && err.name === "TimeoutError" ? "Timed out" : "Unavailable";
      console.error(`[agent/search] ${m.id}: ${note}`);
      reports.push({ ...base, ok: false, count: 0, note });
      return [];
    }
  }));

  // Same job from two sources (or twice from one): keep the first.
  const seen = new Set<string>();
  const jobs: Job[] = [];
  for (const j of lists.flat()) {
    if (!j.title || !j.url || !/^https:\/\//.test(j.url)) continue;
    const key = `${norm(j.title)}|${norm(j.company)}`;
    if (seen.has(key) || seen.has(j.id)) continue;
    seen.add(key); seen.add(j.id);
    jobs.push(j);
  }
  jobs.sort((a, b) => (b.postedAt ?? "").localeCompare(a.postedAt ?? ""));
  const order = SOURCE_META.map(m => m.id);
  reports.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  return { jobs: jobs.slice(0, 200), sources: reports, fetchedAt: new Date().toISOString() };
}
