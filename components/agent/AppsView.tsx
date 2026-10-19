"use client";
// components/agent/AppsView.tsx — every saved, prepared and submitted application, by status.

import { useState } from "react";
import { useAgent } from "./context";
import { fmtDate } from "./parts";
import type { AppStatus } from "@/lib/agent/types";

type Filter = "all" | "saved" | "prepared" | "submitted" | "interview" | "offer" | "closed";
const FILTERS: Filter[] = ["all", "saved", "prepared", "submitted", "interview", "offer", "closed"];
const CLOSED: AppStatus[] = ["rejected", "withdrawn"];

export default function AppsView() {
  const { t, lang, apps, go } = useAgent();
  const [filter, setFilter] = useState<Filter>("all");
  const inFilter = (s: AppStatus, f: Filter) => f === "all" || (f === "closed" ? CLOSED.includes(s) : s === f);
  const list = apps.filter(a => inFilter(a.status, filter));
  const label = (f: Filter) => (f === "all" ? t.apps.all : f === "closed" ? t.apps.closed : t.apps.status[f]);

  return (
    <div className="za-stack">
      <header>
        <h1 className="za-h1">{t.apps.h}</h1>
        <p className="za-lede">{t.apps.intro}</p>
      </header>

      <div className="za-tabs" role="group" aria-label={t.apps.h}>
        {FILTERS.map(f => {
          const n = apps.filter(a => inFilter(a.status, f)).length;
          return (
            <button key={f} type="button" className="z-chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {label(f)} <span className="za-count">{n}</span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <p className="za-panel za-muted">{t.apps.none}</p>
      ) : (
        <ul className="za-apps">
          {list.map(a => (
            <li key={a.jobId}>
              <button type="button" className="za-app" onClick={() => go("apps", a.jobId)}>
                <span className="za-app-main">
                  <strong>{a.job.title}</strong>
                  <span>{a.job.company}{a.job.location ? ` · ${a.job.location}` : ""}</span>
                </span>
                <span className="za-app-side">
                  <span className="za-status" data-s={a.status}>{t.apps.status[a.status]}</span>
                  <span className="za-app-dates">
                    {a.submittedAt ? t.apps.submittedOn(fmtDate(a.submittedAt, lang)) : t.apps.added(fmtDate(a.createdAt, lang))}
                    {a.followUpOn && (a.status === "submitted" || a.status === "interview") ? ` · ${t.apps.followOn(fmtDate(a.followUpOn, lang))}` : ""}
                  </span>
                </span>
                <span className="za-app-score" aria-label={`${t.ws.match}: ${a.score}`}>{a.score}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
