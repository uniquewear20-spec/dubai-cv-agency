"use client";
// components/agent/AgentApp.tsx — the Zenith AI job agent (/agent). Holds the agent's state, which
// lives in this browser (lib/agent/store.ts), and lays out the sections.

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { COPY } from "@/lib/agent/i18n";
import { allApps, delApp, delKV, getKV, persistent as hasStorage, putApp, setKV, type SavedSearch } from "@/lib/agent/store";
import { candidateSkills, scoreJob } from "@/lib/agent/score";
import { countryName } from "@/lib/agent/countries";
import type { Access, AgentStatus, Application, Profile, SearchRequest, SearchResponse, Usage } from "@/lib/agent/types";
import { AgentContext, type AgentState, type Lang, type Scored, type View } from "./context";
import Overview from "./Overview";
import ProfileView from "./ProfileView";
import JobsView from "./JobsView";
import AppsView from "./AppsView";
import Workspace from "./Workspace";
import DataView from "./DataView";

export const EMPTY_PROFILE: Profile = {
  name: "", email: "", phone: "", headline: "", roles: [], countries: [], remoteOk: true, onsiteOk: true,
  salaryMin: null, salaryCurrency: "AED", salaryPeriod: "month", languages: [], skills: [], excludeCompanies: [],
  cvText: "", cvFileName: null, updatedAt: null,
};

const VIEWS: View[] = ["overview", "profile", "jobs", "apps", "data"];
const isLang = (v: unknown): v is Lang => v === "en" || v === "fr" || v === "ar";
const PAYPAL_ID = /^[A-Z0-9]{8,32}$/;
const LICENSE = /^[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}$/i;

function parseHash(): { view: View; appId: string | null } {
  const h = decodeURIComponent(window.location.hash.slice(1));
  if (h.startsWith("app=")) return { view: "apps", appId: h.slice(4) || null };
  return { view: (VIEWS as string[]).includes(h) ? (h as View) : "overview", appId: null };
}

export default function AgentApp() {
  const [lang, setLangState] = useState<Lang>("en");
  const [dark, setDark] = useState(true);
  const [ready, setReady] = useState(false);
  const [persistent, setPersistent] = useState(true);
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [apps, setApps] = useState<Application[]>([]);
  const [search, setSearch] = useState<SavedSearch | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [access, setAccess] = useState<Access | null>(null);
  const [usage, setUsageState] = useState<{ drafts: Usage; sends: Usage } | null>(null);
  const [consent, setConsent] = useState(false);
  const [view, setView] = useState<View>("overview");
  const [appId, setAppId] = useState<string | null>(null);
  const t = COPY[lang];
  const langRef = useRef<Lang>("en");
  useEffect(() => { langRef.current = lang; }, [lang]);

  // Language and theme follow the rest of the site (same storage keys).
  useLayoutEffect(() => {
    setDark(document.documentElement.dataset.theme !== "light");
    try {
      const saved = localStorage.getItem("z-lang");
      if (isLang(saved)) setLangState(saved);
    } catch { /* storage blocked */ }
    const r = parseHash();
    setView(r.view);
    setAppId(r.appId);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = `${COPY[lang].app.title} · Zenith Dubai CV`;
  }, [lang]);

  useEffect(() => {
    const onHash = () => { const r = parseHash(); setView(r.view); setAppId(r.appId); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = useCallback((v: View, id?: string) => {
    const hash = id ? `#app=${encodeURIComponent(id)}` : `#${v}`;
    if (window.location.hash !== hash) window.location.hash = hash;
    setView(v);
    setAppId(id ?? null);
    window.scrollTo({ top: 0 });
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("z-lang", l); } catch { /* ignore */ }
  };
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("z-theme", next ? "dark" : "light"); } catch { /* ignore */ }
  };

  const verify = useCallback(async (proofRaw: string, quiet = false): Promise<string | null> => {
    const proof = proofRaw.trim();
    const kind = PAYPAL_ID.test(proof) ? "paypal" : LICENSE.test(proof) ? "gumroad" : null;
    const copy = COPY[langRef.current];
    if (!kind) return copy.access.err.invalid;
    try {
      const res = await fetch("/api/agent/access/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, proof }) });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.plan) {
        const code = String(data?.error ?? "unavailable");
        if (["not-found", "refunded", "not-eligible", "not-paid"].includes(code) && quiet) { await delKV("access"); setAccess(null); setUsageState(null); }
        return copy.access.err[code] ?? data?.error ?? copy.common.error;
      }
      const a: Access = { kind, proof, plan: data.plan, ref: data.ref, verifiedAt: data.verifiedAt };
      await setKV("access", a);
      setAccess(a);
      setUsageState({ drafts: data.drafts, sends: data.sends });
      return null;
    } catch {
      return copy.access.err.unavailable;
    }
  }, []);

  const load = useCallback(async () => {
    const [p, a, s, h, acc, c] = await Promise.all([getKV("profile"), allApps(), getKV("search"), getKV("hidden"), getKV("access"), getKV("ai-consent")]);
    setPersistent(await hasStorage());
    setProfile(p ? { ...EMPTY_PROFILE, ...p } : EMPTY_PROFILE);
    setApps(a);
    setSearch(s ?? null);
    setHidden(h ?? []);
    setAccess(acc ?? null);
    setConsent(Boolean(c));
    return acc ?? null;
  }, []);

  // First load: stored data, server capabilities, and an access link from the order email.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const acc = await load();
      if (cancelled) return;
      setReady(true);
      fetch("/api/agent/status/").then(r => r.json()).then(s => { if (!cancelled) setStatus(s); }).catch(() => undefined);
      const params = new URLSearchParams(window.location.search);
      const fromLink = params.get("access");
      if (fromLink) {
        window.history.replaceState(null, "", window.location.pathname + window.location.hash);
        await verify(fromLink);
      } else if (acc) {
        await verify(acc.proof, true);
      }
    })();
    return () => { cancelled = true; };
  }, [load, verify]);

  const saveProfile = useCallback(async (p: Profile) => {
    const next = { ...p, updatedAt: new Date().toISOString() };
    await setKV("profile", next);
    setProfile(next);
  }, []);

  const upsertApp = useCallback(async (a: Application) => {
    const next = { ...a, updatedAt: new Date().toISOString() };
    await putApp(next);
    setApps(list => [next, ...list.filter(x => x.jobId !== next.jobId)]);
  }, []);

  const removeApp = useCallback(async (jobId: string) => {
    await delApp(jobId);
    setApps(list => list.filter(x => x.jobId !== jobId));
  }, []);

  const saveJob = useCallback(async ({ job, match }: Scored): Promise<Application> => {
    const existing = apps.find(a => a.jobId === job.id);
    if (existing) return existing;
    const now = new Date().toISOString();
    const app: Application = {
      jobId: job.id, job, status: "saved", score: match.score, createdAt: now, updatedAt: now,
      submittedAt: null, followUpOn: null, notes: "", draft: null, channel: null, history: [{ at: now, status: "saved" }],
    };
    await upsertApp(app);
    return app;
  }, [apps, upsertApp]);

  const runSearch = useCallback(async (opts: { related?: boolean } = {}) => {
    const copy = COPY[lang];
    if (!profile.roles.length) { setSearchError(copy.jobs.needProfile); return; }
    if (!profile.remoteOk && !profile.onsiteOk) { setSearchError(copy.jobs.needMode); return; }
    setSearching(true);
    setSearchError(null);
    const request: SearchRequest = {
      roles: profile.roles, countries: profile.countries, remote: profile.remoteOk, onsite: profile.onsiteOk, keywords: [],
      related: opts.related ?? Boolean(profile.relatedTitles),
    };
    try {
      const res = await fetch("/api/agent/search/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.jobs) {
        setSearchError(res.status === 429 ? copy.jobs.tooMany : res.status >= 500 ? copy.jobs.serverError : copy.jobs.error);
        return;
      }
      const saved: SavedSearch = { request, response: data as SearchResponse, at: new Date().toISOString() };
      await setKV("search", saved);
      setSearch(saved);
    } catch {
      setSearchError(copy.jobs.error);
    } finally {
      setSearching(false);
    }
  }, [lang, profile]);

  const hideJob = useCallback(async (id: string) => {
    const next = [...hidden, id].slice(-500);
    await setKV("hidden", next);
    setHidden(next);
  }, [hidden]);

  const forgetAccess = useCallback(async () => {
    await delKV("access");
    setAccess(null);
    setUsageState(null);
  }, []);

  const giveConsent = useCallback(async () => {
    await setKV("ai-consent", { at: new Date().toISOString() });
    setConsent(true);
  }, []);

  const setUsage = useCallback((u: Partial<{ drafts: Usage; sends: Usage }>) => {
    setUsageState(prev => (prev ? { ...prev, ...u } : prev));
  }, []);

  const skills = useMemo(() => candidateSkills(profile), [profile]);
  const scored = useMemo<Scored[]>(() => {
    if (!search) return [];
    const now = Date.now();
    return search.response.jobs
      .map(job => ({ job, match: scoreJob(job, profile, skills, now) }))
      .filter(s => !s.match.excluded);
  }, [search, profile, skills]);

  const countryLabel = useCallback((code: string) => countryName(code, lang), [lang]);

  const state: AgentState = {
    lang, t, ready, persistent, status, profile, saveProfile, apps, upsertApp, removeApp, saveJob,
    search, scored, searching, searchError, runSearch, hidden, hideJob, access, usage, verifyAccess: verify,
    forgetAccess, setUsage, consent, giveConsent, go, view, appId, countryLabel, reload: async () => { await load(); },
  };

  const counts: Partial<Record<View, number>> = {
    apps: apps.length,
    jobs: search ? scored.filter(s => !hidden.includes(s.job.id)).length : undefined,
  };
  const openApp = appId ? apps.find(a => a.jobId === appId) ?? null : null;

  return (
    <AgentContext.Provider value={state}>
      <div className="zs za" dir={t.dir} lang={lang}>
        <a href="#za-main" className="z-skip">{lang === "fr" ? "Aller au contenu" : lang === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>
        <header className="za-top">
          <div className="za-top-in">
            <Link href="/" className="za-brand">
              <b className="z-serif">Zenith</b>
              <span>{t.app.title.replace(/^Zenith\s*/, "")}</span>
            </Link>
            <div className="za-tools">
              <div className="za-seg" role="group" aria-label={t.app.language}>
                {(["en", "fr", "ar"] as Lang[]).map(l => (
                  <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} lang={l}>
                    {l === "en" ? "EN" : l === "fr" ? "FR" : "ع"}
                  </button>
                ))}
              </div>
              <button type="button" className="za-icon-btn" onClick={toggleTheme} aria-label={dark ? t.app.themeLight : t.app.themeDark}>
                {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
              </button>
            </div>
          </div>
        </header>

        <div className="za-body">
          <nav className="za-nav" aria-label={t.app.menu}>
            {VIEWS.map(v => (
              <button key={v} type="button" aria-current={view === v && !openApp ? "page" : undefined} onClick={() => go(v)}>
                <span>{t.app.tabs[v]}</span>
                {counts[v] !== undefined && <span className="za-count">{counts[v]}</span>}
              </button>
            ))}
          </nav>

          <main id="za-main" className="za-main" tabIndex={-1}>
            {!persistent && ready && <div className="za-notice" data-tone="warn" role="status">{t.app.noStorage}</div>}
            {!ready ? (
              <p className="za-loading">{t.app.loading}</p>
            ) : openApp ? (
              <Workspace key={openApp.jobId} app={openApp} />
            ) : view === "profile" ? (
              <ProfileView key={profile.updatedAt ?? "new"} />
            ) : view === "jobs" ? (
              <JobsView />
            ) : view === "apps" ? (
              <AppsView />
            ) : view === "data" ? (
              <DataView />
            ) : (
              <Overview />
            )}
          </main>
        </div>

        <footer className="za-foot">
          <p>
            <Link href="/">Zenith Dubai CV</Link> · <Link href="/privacy/">{t.data.policy}</Link> · <Link href="/#packages">{t.access.packages}</Link>
          </p>
        </footer>
      </div>
    </AgentContext.Provider>
  );
}
