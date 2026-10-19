"use client";
// components/agent/Overview.tsx — the dashboard: what works now, the pipeline in numbers,
// follow-ups that are due, and the best matches from the last search.

import { CalendarPlus, Check } from "lucide-react";
import { useAgent } from "./context";
import { ScoreMeter, fmtDate } from "./parts";
import AccessPanel from "./AccessPanel";
import { addDays, download, icsFile, today } from "@/lib/agent/links";
import type { AppStatus } from "@/lib/agent/types";

export default function Overview() {
  const { t, lang, profile, apps, scored, search, status, go, upsertApp, hidden } = useAgent();
  const count = (s: AppStatus) => apps.filter(a => a.status === s).length;
  const matches = scored.filter(s => s.match.score >= 60 && !hidden.includes(s.job.id));
  const due = apps
    .filter(a => a.followUpOn && a.followUpOn <= today() && (a.status === "submitted" || a.status === "interview"))
    .sort((a, b) => (a.followUpOn ?? "").localeCompare(b.followUpOn ?? ""));
  const best = [...scored].filter(s => !hidden.includes(s.job.id)).sort((a, b) => b.match.score - a.match.score).slice(0, 5);
  const hasProfile = Boolean(profile.name && profile.roles.length && profile.cvText);
  const liveSources = status?.sources.filter(s => s.configured).length;

  const kpis: [string, number, string?][] = [
    [t.overview.kpi.matches, matches.length, t.overview.matchesHint],
    [t.overview.kpi.saved, count("saved")],
    [t.overview.kpi.prepared, count("prepared")],
    [t.overview.kpi.submitted, count("submitted")],
    [t.overview.kpi.interview, count("interview")],
    [t.overview.kpi.offer, count("offer")],
  ];

  return (
    <div className="za-stack">
      <header>
        <h1 className="za-h1">{hasProfile ? t.overview.h : t.app.title}</h1>
        <p className="za-lede">{t.app.tagline}</p>
      </header>

      <section className="za-live" aria-label={t.status.live}>
        <p><span className="za-dot" data-on="true" aria-hidden /> <strong>{t.status.live}:</strong> {t.status.liveList}{liveSources ? ` ${t.status.sources(liveSources)}.` : ""}</p>
        {status && <p><span className="za-dot" data-on={status.ai} aria-hidden /> {status.ai ? t.status.aiOn : t.status.aiOff}</p>}
      </section>

      {!hasProfile && (
        <section className="za-panel za-start">
          <h2 className="za-h2">{t.overview.emptyH}</h2>
          <p className="za-body-text">{t.overview.emptyBody}</p>
          <ol className="za-steps">
            {t.overview.steps.map(s => <li key={s}>{s}</li>)}
          </ol>
          <button type="button" className="z-btn z-btn-primary" onClick={() => go("profile")}>{t.overview.ctaProfile}</button>
        </section>
      )}

      <section aria-label={t.apps.h}>
        <dl className="za-kpis">
          {kpis.map(([label, n, hint]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{n}</dd>
              {hint && <dd className="za-kpi-hint">{hint}</dd>}
            </div>
          ))}
        </dl>
      </section>

      <div className="za-split">
        <section className="za-panel">
          <h2 className="za-h2">{t.overview.followH}</h2>
          {due.length === 0 ? (
            <p className="za-muted">{t.overview.followNone}</p>
          ) : (
            <ul className="za-rows">
              {due.map(a => (
                <li key={a.jobId} className="za-row">
                  <button type="button" className="za-row-main" onClick={() => go("apps", a.jobId)}>
                    <strong>{a.job.title}</strong>
                    <span>{a.job.company} · {t.apps.followOn(fmtDate(a.followUpOn, lang))}</span>
                  </button>
                  <div className="za-row-actions">
                    <button type="button" className="za-icon-btn" aria-label={`${t.ws.ics}: ${a.job.title}`} onClick={() => download(icsFile({ uid: `follow-${a.jobId}`, date: a.followUpOn!, title: t.ws.calTitle(a.job.title, a.job.company), body: t.ws.calBody(a.job.url), url: a.job.url }), "follow-up.ics")}>
                      <CalendarPlus size={17} aria-hidden />
                    </button>
                    <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => upsertApp({ ...a, followUpOn: addDays(3) })}>{t.overview.snooze}</button>
                    <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => upsertApp({ ...a, followUpOn: null })}>
                      <Check size={15} aria-hidden /> {t.overview.done}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <AccessPanel compact />
      </div>

      <section className="za-panel">
        <div className="za-panel-head">
          <h2 className="za-h2">{t.overview.bestH}</h2>
          {search && <p className="za-muted">{t.overview.lastSearch(fmtDate(search.at, lang))}</p>}
        </div>
        {best.length === 0 ? (
          <>
            <p className="za-muted">{t.overview.bestNone}</p>
            <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => go("jobs")}>{t.overview.find}</button>
          </>
        ) : (
          <ul className="za-rows">
            {best.map(s => (
              <li key={s.job.id} className="za-row">
                <button type="button" className="za-row-main" onClick={() => go("jobs")}>
                  <strong>{s.job.title}</strong>
                  <span>{s.job.company} · {s.job.location}</span>
                </button>
                <ScoreMeter match={s.match} label={t.jobs.label(s.match.score)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
