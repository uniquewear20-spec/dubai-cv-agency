"use client";
// components/agent/XrayView.tsx — the CV X-Ray inside the AI job agent. Checks the saved CV text (or the
// file, for layout checks too) against a target role and, optionally, a job the candidate saved, whose
// listing is used as the job ad. Everything runs in the browser, like the rest of the agent.

import React, { useEffect, useId, useState } from "react";
import { ArrowRight, ScanSearch } from "lucide-react";
import { waLink } from "@/lib/site";
import { readCv, type Layout, type ReadFailure } from "@/lib/xray/read";
import { analyzeCv, type Report } from "@/lib/xray/analyze";
import { UI } from "@/lib/xray/copy";
import { XrayCta, XrayReport } from "@/components/xray/Report";
import { useAgent } from "./context";

const TEXT_LAYOUT: Layout = { kind: "txt", pages: null, columns: false, tables: 0, textBoxes: 0, images: 0, headerOnlyContact: false, headerEmail: false, headerPhone: false, oddChars: 0 };

type Outcome = { kind: "report"; report: Report } | { kind: "scanned" } | { kind: "error"; reason: Exclude<ReadFailure, "scanned"> };

/** The job named in the address (#xray=<jobId>), when the X-Ray was opened from an application. */
function jobFromHash(): string {
  const h = decodeURIComponent(window.location.hash.slice(1));
  return h.startsWith("xray=") ? h.slice(5) : "";
}

export default function XrayView() {
  const { lang, profile, apps } = useAgent();
  const ui = UI[lang];
  const id = useId();
  const hasCv = profile.cvText.trim().length >= 200;
  const [source, setSource] = useState<"saved" | "file">(hasCv ? "saved" : "file");
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState("");
  const [role, setRole] = useState(profile.roles[0] ?? "");
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { const j = jobFromHash(); if (j) setJobId(j); }, []);

  const app = apps.find(a => a.jobId === jobId);
  const canRun = source === "saved" ? hasCv : Boolean(file);

  const run = async () => {
    if (!canRun || busy) return;
    setBusy(true);
    setOutcome(null);
    const ad = app?.job.description ?? "";
    const target = role.trim() || app?.job.title || "";
    if (source === "saved") {
      setOutcome({ kind: "report", report: analyzeCv({ text: profile.cvText, layout: TEXT_LAYOUT, role: target, ad }) });
    } else if (file) {
      const read = await readCv(file);
      if (read.ok) setOutcome({ kind: "report", report: analyzeCv({ text: read.text, layout: read.layout, role: target, ad }) });
      else if (read.reason === "scanned") setOutcome({ kind: "scanned" });
      else setOutcome({ kind: "error", reason: read.reason });
    }
    setBusy(false);
    window.requestAnimationFrame(() => document.getElementById(`${id}-res`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const wa = waLink(ui.waMessage(role.trim().slice(0, 80), "AGENT"));

  return (
    <div className="xr za-xray">
      <section className="za-panel" aria-labelledby={`${id}-h`}>
        <h2 id={`${id}-h`} className="za-h2"><ScanSearch size={20} aria-hidden /> {ui.agent.title}</h2>
        <p className="za-muted">{ui.agent.intro} {ui.promise[0]}.</p>

        <fieldset className="za-field za-xray-source">
          <legend>{ui.agent.source}</legend>
          <label><input type="radio" name={`${id}-src`} checked={source === "saved"} disabled={!hasCv} onChange={() => setSource("saved")} /> {ui.agent.saved}</label>
          <label><input type="radio" name={`${id}-src`} checked={source === "file"} onChange={() => setSource("file")} /> {ui.agent.file}</label>
        </fieldset>
        {!hasCv && source === "saved" && <p className="za-hint">{ui.agent.needCv}</p>}
        {source === "file" && (
          <div className="za-field">
            <input id={`${id}-file`} type="file" className="za-input" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            <p className="za-hint">{ui.dropHint}</p>
          </div>
        )}

        <div className="za-xray-row">
          <div className="za-field">
            <label htmlFor={`${id}-role`}>{ui.role}</label>
            <input id={`${id}-role`} className="za-input" value={role} onChange={e => setRole(e.target.value)} placeholder={ui.rolePh} maxLength={80} dir="auto" />
          </div>
          <div className="za-field">
            <label htmlFor={`${id}-job`}>{ui.agent.job}</label>
            <select id={`${id}-job`} className="za-select" value={jobId} onChange={e => setJobId(e.target.value)}>
              <option value="">{ui.agent.noJob}</option>
              {apps.map(a => <option key={a.jobId} value={a.jobId}>{a.job.title}{a.job.company ? ` · ${a.job.company}` : ""}</option>)}
            </select>
          </div>
        </div>

        <button type="button" className="z-btn z-btn-primary" onClick={() => void run()} disabled={!canRun || busy}>
          {busy ? ui.running : ui.run}{!busy && <ArrowRight size={18} aria-hidden className="xr-flip" />}
        </button>
      </section>

      <div id={`${id}-res`} className="za-xray-results" aria-live="polite">
        {outcome?.kind === "error" && <p className="xr-error" role="alert">{ui.errors[outcome.reason]}</p>}
        {outcome?.kind === "scanned" && (
          <div className="xr-scanned">
            <h3 className="z-h3">{ui.scanned.title}</h3>
            <p className="z-body">{ui.scanned.body}</p>
            <p className="z-body xr-fix">{ui.scanned.fix}</p>
            <XrayCta lang={lang} wa={wa} serviceKey="foundation" reason={ui.reasons.rebuild} />
          </div>
        )}
        {outcome?.kind === "report" && <XrayReport report={outcome.report} lang={lang} wa={wa} />}
        {outcome && <p className="z-micro xr-disclaimer">{ui.disclaimer}</p>}
      </div>
    </div>
  );
}
