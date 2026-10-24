"use client";
// components/agent/JobsView.tsx — search public job sources, rank every listing against the CV
// (in the browser), and save or prepare the ones worth applying to.

import { useId, useMemo, useState, type FormEvent } from "react";
import { ExternalLink, EyeOff, Search } from "lucide-react";
import { queryFromProfile, useAgent, type Scored } from "./context";
import { ChipsInput, Notice, ReasonList, ScoreMeter, fmtDate } from "./parts";
import { daysSince, scoreJob, candidateSkills } from "@/lib/agent/score";
import { externalSearches } from "@/lib/agent/links";
import { findApplyEmail } from "@/lib/agent/text";
import { COUNTRIES, parseCountry } from "@/lib/agent/countries";
import { INDUSTRIES, familyById, familyLabel, industryName, planRole, type Family } from "@/lib/agent/titles";
import type { Job, SearchQuery, SourceReport } from "@/lib/agent/types";

const PAGE = 30;
const ELSEWHERE_ID = "za-elsewhere";
const ARABIC = /[\p{Script=Arabic}]/u;

/** A searched role as a title: "f&b supervisor" → "F&B supervisor". */
const asTitle = (s: string) => s.replace(/^\p{L}/u, c => c.toUpperCase()).replace(/\bf&b\b/gi, "F&B");

export default function JobsView() {
  const { t, lang, search, scored, query, setQuery, runSearch, apps, hidden, hideJob, saveJob, go } = useAgent();
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<"best" | "newest">("best");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [hideSaved, setHideSaved] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const ids = { min: useId(), sort: useId() };
  const savedIds = useMemo(() => new Set(apps.map(a => a.jobId)), [apps]);

  // Neighbouring jobs of the searched titles ("Head bartender", "Barback"… for "Bartender").
  const relatedJobs = useMemo(() => {
    const plans = query.roles.map(r => planRole(r));
    const own = new Set(plans.map(p => p.family?.id).filter(Boolean));
    const near = [...new Set(plans.flatMap(p => p.related))].filter(id => !own.has(id));
    return near.map(id => familyById(id)).filter((f): f is Family => f !== undefined).map(familyLabel);
  }, [query.roles]);
  const widen = (patch: Partial<SearchQuery>) => {
    const next = { ...query, ...patch };
    void setQuery(next);
    void runSearch({ query: next });
  };

  const visible = useMemo(() => {
    const list = scored.filter(s =>
      !hidden.includes(s.job.id) && s.match.score >= minScore && (!remoteOnly || s.job.remote) && (!hideSaved || !savedIds.has(s.job.id)));
    return sort === "best"
      ? list.sort((a, b) => b.match.score - a.match.score || (b.job.postedAt ?? "").localeCompare(a.job.postedAt ?? ""))
      : list.sort((a, b) => (b.job.postedAt ?? b.job.checkedAt ?? "").localeCompare(a.job.postedAt ?? a.job.checkedAt ?? ""));
  }, [scored, hidden, minScore, remoteOnly, hideSaved, savedIds, sort]);

  const prepare = async (s: Scored) => { const a = await saveJob(s); go("apps", a.jobId); };
  const sources = search?.response.sources ?? [];
  const roles = search?.response.roles ?? [];
  const filtered = sources.reduce((n, s) => n + (s.filtered ?? 0), 0);
  const req = search?.request;
  const hasFilters = Boolean(req && (req.city || req.level || req.employment || req.industry));

  return (
    <div className="za-stack">
      <header>
        <h1 className="za-h1">{t.jobs.h}</h1>
        <p className="za-lede">{t.jobs.intro}</p>
      </header>

      <SearchPanel onSearch={() => setShown(PAGE)} />

      {search && (
        <section className="za-sources" aria-label={t.jobs.sourcesH}>
          <h2 className="za-label-sm">{t.jobs.sourcesH} · {fmtDate(search.at, lang)}</h2>
          {roles.length > 0 && (
            <ul className="za-readas" aria-label={t.jobs.readAs}>
              {roles.map(r => {
                const notes = [
                  r.corrected ? t.jobs.typed(r.input) : "",
                  r.field ? t.jobs.readField(industryName(r.field, lang)) : "",
                  r.kindOf ? t.jobs.readKind(r.kindOf) : "",
                  r.byWords ? t.jobs.readWords : "",
                  r.extras?.length ? t.jobs.readExtras(r.extras) : "",
                  r.sameTitles.length && !r.extras?.length ? t.jobs.alsoMatches(r.sameTitles) : "",
                  r.widened?.length ? t.jobs.readWidened(r.widened) : "",
                  r.found !== undefined ? t.jobs.readFound(r.found) : "",
                ].filter(Boolean);
                return (
                  <li key={r.input}>
                    <strong dir="auto">{r.corrected ? asTitle(r.role) : r.input}</strong>
                    {notes.length > 0 && <span className="za-muted"> · {notes.join(" · ")}</span>}
                  </li>
                );
              })}
              {roles.some(r => ARABIC.test(r.input)) && <li className="za-muted">{t.jobs.readArabic}</li>}
            </ul>
          )}
          <ul className="za-src-list">
            {sources.map(s => (
              <li key={s.id} data-state={!s.configured ? "off" : s.skipped ? "skip" : s.ok ? "ok" : "fail"}>
                <a href={s.home} target="_blank" rel="noopener noreferrer">{t.jobs.srcLabel(s.name, ["himalayas", "jobicy", "remotive"].includes(s.id))}</a>
                <span>{!s.configured ? t.jobs.srcOff : s.skipped ? t.jobs.srcSkipWhy(s.note) : s.ok ? t.jobs.srcOk(s.count) : t.jobs.srcFailWhy(s.note)}</span>
                {s.ok && !s.skipped && (s.unrelated || s.closed || s.duplicates || s.elsewhere || s.filtered)
                  ? <small>{t.jobs.srcDropped({ other: s.unrelated, closed: s.closed, duplicates: s.duplicates, elsewhere: s.elsewhere, filtered: s.filtered })}</small> : null}
              </li>
            ))}
          </ul>
          <p className="za-hint za-external">{t.jobs.external}</p>
        </section>
      )}

      {search && (
        <section aria-label={t.jobs.results(visible.length, scored.length)}>
          {scored.length > 0 && (
            <div className="za-filters">
              <div className="za-field-inline">
                <label htmlFor={ids.min}>{t.jobs.minScore}</label>
                <select id={ids.min} className="za-select" value={minScore} onChange={e => setMinScore(Number(e.target.value))}>
                  <option value={0}>{t.jobs.all}</option>
                  <option value={40}>40+</option>
                  <option value={60}>60+</option>
                  <option value={75}>75+</option>
                </select>
              </div>
              <div className="za-field-inline">
                <label htmlFor={ids.sort}>{t.jobs.sort}</label>
                <select id={ids.sort} className="za-select" value={sort} onChange={e => setSort(e.target.value === "newest" ? "newest" : "best")}>
                  <option value="best">{t.jobs.best}</option>
                  <option value="newest">{t.jobs.newest}</option>
                </select>
              </div>
              <label className="za-check"><input type="checkbox" checked={remoteOnly} onChange={e => setRemoteOnly(e.target.checked)} /> {t.jobs.remoteOnly}</label>
              <label className="za-check"><input type="checkbox" checked={hideSaved} onChange={e => setHideSaved(e.target.checked)} /> {t.jobs.hideSaved}</label>
              <p className="za-muted za-count-line" aria-live="polite">{t.jobs.results(visible.length, scored.length)}</p>
            </div>
          )}

          {scored.length === 0 ? (
            <NoListings
              sources={sources}
              canRelate={!query.related && relatedJobs.length > 0}
              onRelate={() => widen({ related: true })}
              filtered={hasFilters && filtered > 0}
              onClear={() => widen({ city: "", level: "", employment: "", industry: "" })}
              onRemote={!query.remote ? () => widen({ remote: true }) : null}
            />
          ) : visible.length === 0 ? (
            <Notice tone="info">{t.jobs.none}</Notice>
          ) : (
            <ol className="za-jobs">
              {visible.slice(0, shown).map(s => (
                <JobCard key={s.job.id} s={s} saved={savedIds.has(s.job.id)} onSave={() => void saveJob(s)} onPrepare={() => void prepare(s)} onHide={() => void hideJob(s.job.id)} />
              ))}
            </ol>
          )}
          {visible.length > shown && (
            <button type="button" className="z-btn z-btn-quiet za-more" onClick={() => setShown(n => n + PAGE)}>
              {t.jobs.results(Math.min(visible.length, shown + PAGE), visible.length)}
            </button>
          )}
        </section>
      )}

      <Elsewhere />
      <AddJob />
    </div>
  );
}

/**
 * The search form: any job titles, countries, a city, on-site or remote, and the filters (level,
 * contract, field, related titles). Filled from the profile until the candidate changes it; kept in
 * this browser. Only what is typed here is sent to the search, never the CV.
 */
function SearchPanel({ onSearch }: { onSearch: () => void }) {
  const { t, lang, query, setQuery, runSearch, searching, searchError, profile, countryLabel } = useAgent();
  const [q, setQ] = useState<SearchQuery>(query);
  // The form follows changes made elsewhere ("Clear filters", "Include related jobs") without being
  // remounted, so a field being edited keeps its focus.
  const [seen, setSeen] = useState(query);
  if (query !== seen) { setSeen(query); setQ(query); }
  const id = useId();
  const update = (patch: Partial<SearchQuery>) => {
    const next = { ...q, ...patch };
    setQ(next);
    void setQuery(next);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
    void runSearch({ query: q });
  };
  const filters = [q.city.trim(), q.level, q.employment, q.industry].filter(Boolean).length;
  const work = q.remote && q.onsite ? "both" : q.remote ? "remote" : "onsite";
  const fromProfile = queryFromProfile(profile);
  const canReset = profile.roles.length > 0 && JSON.stringify(fromProfile) !== JSON.stringify(q);

  return (
    <form className="za-panel za-search" onSubmit={submit} aria-labelledby={`${id}-h`} noValidate>
      <h2 id={`${id}-h`} className="z-sr">{t.jobs.search}</h2>
      <div className="za-grid-2">
        <ChipsInput label={t.jobs.formTitle} hint={t.jobs.formTitleHint} placeholder={q.roles.length ? undefined : t.jobs.formTitlePh}
          values={q.roles} onChange={v => update({ roles: v })} max={3} addLabel={t.profile.add} removeLabel={t.profile.remove} />
        <ChipsInput
          label={t.jobs.formCountries}
          hint={t.jobs.formCountriesHint}
          values={q.countries}
          onChange={v => update({ countries: v })}
          max={5}
          addLabel={t.profile.add}
          removeLabel={t.profile.remove}
          parse={parseCountry}
          invalidText={t.profile.countryUnknown}
          display={countryLabel}
          list={COUNTRIES.map(c => c[lang])}
        />
      </div>
      <div className="za-grid-2 za-search-row">
        <div className="za-field">
          <label htmlFor={`${id}-city`}>{t.jobs.formCity}</label>
          <input id={`${id}-city`} className="za-input" value={q.city} placeholder={t.jobs.formCityPh} maxLength={60} dir="auto" autoComplete="address-level2"
            onChange={e => setQ(prev => ({ ...prev, city: e.target.value }))} onBlur={() => update({ city: q.city.trim() })} />
        </div>
        <fieldset className="za-fieldset za-work">
          <legend>{t.jobs.formWork}</legend>
          <div className="za-seg za-seg-wide" role="group" aria-label={t.jobs.formWork}>
            {(["both", "onsite", "remote"] as const).map(w => (
              <button key={w} type="button" aria-pressed={work === w} onClick={() => update({ remote: w !== "onsite", onsite: w !== "remote" })}>{t.jobs.formWorkOpts[w]}</button>
            ))}
          </div>
        </fieldset>
      </div>
      <details className="za-more-filters" open={filters > 0 || q.related || undefined}>
        <summary>{t.jobs.formMore}{filters > 0 && <span className="za-muted"> · {t.jobs.filtersOn(filters)}</span>}</summary>
        <div className="za-grid-3">
          <div className="za-field">
            <label htmlFor={`${id}-lvl`}>{t.jobs.formLevel}</label>
            <select id={`${id}-lvl`} className="za-select" value={q.level} onChange={e => update({ level: e.target.value as SearchQuery["level"] })}>
              {Object.entries(t.jobs.levels).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
          <div className="za-field">
            <label htmlFor={`${id}-emp`}>{t.jobs.formEmployment}</label>
            <select id={`${id}-emp`} className="za-select" value={q.employment} onChange={e => update({ employment: e.target.value as SearchQuery["employment"] })}>
              {Object.entries(t.jobs.employments).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
          <div className="za-field">
            <label htmlFor={`${id}-ind`}>{t.jobs.formIndustry}</label>
            <select id={`${id}-ind`} className="za-select" value={q.industry} onChange={e => update({ industry: e.target.value })}>
              <option value="">{t.jobs.anyIndustry}</option>
              {INDUSTRIES.map(i => <option key={i.id} value={i.id}>{i[lang]}</option>)}
            </select>
          </div>
        </div>
        <label className="za-check za-related"><input type="checkbox" checked={q.related} onChange={e => update({ related: e.target.checked })} /> <span>{t.jobs.related}</span></label>
        <p className="za-hint">{t.jobs.filtersNote}</p>
      </details>
      <div className="za-actions">
        <button type="submit" className="z-btn z-btn-primary" disabled={searching}>
          <Search size={17} aria-hidden /> {searching ? t.jobs.searching : t.jobs.search}
        </button>
        {canReset && <button type="button" className="z-btn z-btn-quiet" onClick={() => { setQ(fromProfile); void setQuery(fromProfile); }}>{t.jobs.fromProfile}</button>}
      </div>
      {searchError && <Notice tone="error">{searchError}</Notice>}
    </form>
  );
}

/**
 * No listings at all. Says which it is: no source answered (an outage, not a zero), some didn't
 * (the zero may be incomplete), or a real zero, with the ways to widen the search.
 */
function NoListings({ sources, canRelate, onRelate, filtered, onClear, onRemote }: {
  sources: SourceReport[]; canRelate: boolean; onRelate: () => void; filtered: boolean; onClear: () => void; onRemote: (() => void) | null;
}) {
  const { t, searching } = useAgent();
  const asked = sources.filter(s => s.configured && !s.skipped);
  const failed = asked.filter(s => !s.ok);
  if (asked.length > 0 && failed.length === asked.length) return <Notice tone="error">{t.jobs.allFailed}</Notice>;
  const toElsewhere = () => document.getElementById(ELSEWHERE_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const toForm = () => document.querySelector<HTMLElement>(".za-search input")?.focus();
  return (
    <div className="za-notice za-zero" data-tone="info">
      <p role="status">{t.jobs.zero}</p>
      {failed.length > 0 && <p>{t.jobs.someFailed(failed.map(s => s.name))}</p>}
      {filtered && <p>{t.jobs.zeroFiltered}</p>}
      <p className="za-muted">{t.jobs.zeroWhy}</p>
      <p>{t.jobs.zeroTry}</p>
      <div className="za-actions">
        {filtered && <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={onClear} disabled={searching}>{t.jobs.clearFilters}</button>}
        {canRelate && <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={onRelate} disabled={searching}>{t.jobs.widenRelated}</button>}
        {onRemote && <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={onRemote} disabled={searching}>{t.jobs.widenRemote}</button>}
        <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={toForm}>{t.jobs.widenCountries}</button>
        <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={toElsewhere}>{t.jobs.widenElsewhere}</button>
      </div>
    </div>
  );
}

function JobCard({ s, saved, onSave, onPrepare, onHide }: { s: Scored; saved: boolean; onSave: () => void; onPrepare: () => void; onHide: () => void }) {
  const { t, lang, countryLabel } = useAgent();
  const { job, match } = s;
  const days = daysSince(job.postedAt);
  const headId = useId();
  const sourceName = job.source === "manual" ? "" : job.source[0].toUpperCase() + job.source.slice(1);
  const reason = (r: Parameters<typeof t.reason>[0]) => t.reason(r, countryLabel);
  return (
    <li className="za-job" aria-labelledby={headId}>
      <div className="za-job-main">
        <h3 id={headId} className="za-job-title" dir="auto">{job.title}</h3>
        <p className="za-meta">
          <span dir="auto">{job.company}</span>
          <span dir="auto">{job.location}</span>
          <span className="z-tag">{job.remote ? t.jobs.remote : t.jobs.onsite}</span>
          {job.widened && <span className="z-tag za-tag-related">{t.jobs.widenedTag}</span>}
          {days !== null ? <span>{t.jobs.posted(days)}</span> : job.source !== "manual" && <span>{t.jobs.noDate}</span>}
          {job.checkedAt && <span>{t.jobs.checked(fmtDate(job.checkedAt, lang))}</span>}
          {job.salary && <span dir="ltr">{job.salary}</span>}
          {sourceName && <span className="za-via">{t.jobs.via(sourceName)}</span>}
        </p>
        {job.alsoAt?.length ? (
          <p className="za-also">
            {t.jobs.alsoAt}{" "}
            {job.alsoAt.map((a, i) => (
              <span key={a.url}>{i > 0 && " · "}<a href={a.url} target="_blank" rel="noopener noreferrer" dir="auto">{a.location.split(",")[0]}</a></span>
            ))}
          </p>
        ) : null}
        <ReasonList reasons={match.reasons.filter(r => r.tone !== "info" || r.code === "skills-missing" || r.code === "title-related").slice(0, 3)} text={reason} />
        <details className="za-why">
          <summary>{t.jobs.why}</summary>
          <ReasonList reasons={match.reasons} text={reason} />
        </details>
        <div className="za-job-actions">
          <button type="button" className="z-btn z-btn-primary z-btn-small" onClick={onPrepare}>{t.jobs.prepare}</button>
          <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={onSave} disabled={saved} aria-pressed={saved}>{saved ? t.jobs.saved : t.jobs.save}</button>
          <a className="z-btn z-btn-quiet z-btn-small" href={job.url} target="_blank" rel="noopener noreferrer">
            {t.jobs.view} <ExternalLink size={14} aria-hidden />
          </a>
          <button type="button" className="za-icon-btn" onClick={onHide} aria-label={`${t.jobs.hide}: ${job.title}`}><EyeOff size={17} aria-hidden /></button>
        </div>
      </div>
      <ScoreMeter match={match} label={t.jobs.label(match.score)} />
    </li>
  );
}

/** The same search on sites without an open API, for any of the target roles and countries. */
function Elsewhere() {
  const { t, query, countryLabel } = useAgent();
  const [pick, setPick] = useState({ role: "", country: "" });
  const ids = { role: useId(), country: useId() };
  const profile = { roles: query.roles, countries: query.countries };
  const role = profile.roles.includes(pick.role) ? pick.role : profile.roles[0];
  if (!role) return null;
  const country = profile.countries.includes(pick.country) ? pick.country : profile.countries[0] ?? null;
  const plan = planRole(role);
  const links = externalSearches(plan.corrected ? asTitle(plan.role) : role, country);
  return (
    <section className="za-panel" id={ELSEWHERE_ID}>
      <h2 className="za-h2">{t.jobs.elsewhereH}</h2>
      <p className="za-body-text">{t.jobs.elsewhereBody}</p>
      {(profile.roles.length > 1 || profile.countries.length > 1) && (
        <div className="za-filters za-elsewhere-pick">
          {profile.roles.length > 1 && (
            <div className="za-field-inline">
              <label htmlFor={ids.role}>{t.jobs.elsewhereRole}</label>
              <select id={ids.role} className="za-select" value={role} onChange={e => setPick(p => ({ ...p, role: e.target.value }))}>
                {profile.roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}
          {profile.countries.length > 1 && (
            <div className="za-field-inline">
              <label htmlFor={ids.country}>{t.jobs.elsewhereCountry}</label>
              <select id={ids.country} className="za-select" value={country ?? ""} onChange={e => setPick(p => ({ ...p, country: e.target.value }))}>
                {profile.countries.map(c => <option key={c} value={c}>{countryLabel(c)}</option>)}
              </select>
            </div>
          )}
        </div>
      )}
      <ul className="za-linkrow">
        {links.map(l => (
          <li key={l.name}><a className="z-btn z-btn-quiet z-btn-small" href={l.url} target="_blank" rel="noopener noreferrer">{l.name} <ExternalLink size={14} aria-hidden /></a></li>
        ))}
      </ul>
    </section>
  );
}

function AddJob() {
  const { t, profile, saveJob, go } = useAgent();
  const [f, setF] = useState({ title: "", company: "", location: "", url: "", description: "", remote: false });
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  const set = (k: keyof typeof f, v: string | boolean) => { setF(prev => ({ ...prev, [k]: v })); setError(null); };

  const add = async () => {
    if (!f.title.trim() || !/^https:\/\/\S+$/.test(f.url.trim()) || f.description.trim().length < 80) { setError(t.jobs.addInvalid); return; }
    const job: Job = {
      id: `manual:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      source: "manual",
      title: f.title.trim().slice(0, 200),
      company: f.company.trim().slice(0, 160) || "-",
      location: f.location.trim().slice(0, 160),
      remote: f.remote,
      url: f.url.trim().slice(0, 600),
      description: f.description.trim().slice(0, 12000),
      postedAt: null,
      salary: null,
      salaryRange: null,
      tags: [],
      applyEmail: findApplyEmail(f.description),
    };
    const match = scoreJob(job, profile, candidateSkills(profile));
    const app = await saveJob({ job, match });
    go("apps", app.jobId);
  };

  return (
    <section className="za-panel" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="za-h2">{t.jobs.addH}</h2>
      <div className="za-grid-2">
        <div className="za-field"><label htmlFor={`${id}-t`}>{t.jobs.addTitle}</label><input id={`${id}-t`} className="za-input" value={f.title} onChange={e => set("title", e.target.value)} /></div>
        <div className="za-field"><label htmlFor={`${id}-c`}>{t.jobs.addCompany}</label><input id={`${id}-c`} className="za-input" value={f.company} onChange={e => set("company", e.target.value)} /></div>
        <div className="za-field"><label htmlFor={`${id}-l`}>{t.jobs.addLocation}</label><input id={`${id}-l`} className="za-input" value={f.location} onChange={e => set("location", e.target.value)} /></div>
        <div className="za-field"><label htmlFor={`${id}-u`}>{t.jobs.addUrl}</label><input id={`${id}-u`} type="url" className="za-input" value={f.url} onChange={e => set("url", e.target.value)} placeholder="https://" dir="ltr" /></div>
      </div>
      <label className="za-check"><input type="checkbox" checked={f.remote} onChange={e => set("remote", e.target.checked)} /> {t.jobs.addRemote}</label>
      <div className="za-field">
        <label htmlFor={`${id}-d`}>{t.jobs.addDesc}</label>
        <textarea id={`${id}-d`} className="za-textarea" value={f.description} onChange={e => set("description", e.target.value)} aria-describedby={`${id}-dh`} dir="auto" />
        <p id={`${id}-dh`} className="za-hint">{t.jobs.addDescHint}</p>
      </div>
      {error && <Notice tone="error">{error}</Notice>}
      <button type="button" className="z-btn z-btn-quiet" onClick={() => void add()}>{t.jobs.addBtn}</button>
    </section>
  );
}
