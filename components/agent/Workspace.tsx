"use client";
// components/agent/Workspace.tsx — one application: the match, a draft built from the CV (AI or
// template), applying with explicit approval, and tracking to the outcome.

import { useId, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarPlus, Copy, Download, ExternalLink, Mail, Send, Trash2 } from "lucide-react";
import { useAgent, type Lang } from "./context";
import { Modal, Notice, ReasonList, ScoreMeter, fmtDate } from "./parts";
import { candidateSkills, daysSince, scoreJob } from "@/lib/agent/score";
import { templateDraft } from "@/lib/agent/template";
import { addDays, download, icsFile, mailto } from "@/lib/agent/links";
import type { Application, AppStatus, Draft } from "@/lib/agent/types";

const STATUSES: AppStatus[] = ["saved", "prepared", "submitted", "interview", "offer", "rejected", "withdrawn"];
const EMAIL = /^[^\s@<>"(),;:]+@[^\s@<>"(),;:]+\.[A-Za-z]{2,24}$/;

export default function Workspace({ app }: { app: Application }) {
  const { t, lang, profile, go, upsertApp, removeApp, countryLabel } = useAgent();
  const job = app.job;
  const match = useMemo(() => scoreJob(job, profile, candidateSkills(profile)), [job, profile]);
  const days = daysSince(job.postedAt);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const Back = lang === "ar" ? ArrowRight : ArrowLeft;

  const setStatus = async (status: AppStatus, extra: Partial<Application> = {}) => {
    const now = new Date().toISOString();
    const submitted = status === "submitted" && !app.submittedAt;
    await upsertApp({
      ...app,
      ...extra,
      status,
      score: match.score,
      submittedAt: submitted ? now : app.submittedAt,
      followUpOn: submitted && !app.followUpOn ? addDays(7) : extra.followUpOn !== undefined ? extra.followUpOn : app.followUpOn,
      history: status !== app.status ? [...app.history, { at: now, status }] : app.history,
    });
  };

  return (
    <div className="za-stack">
      <button type="button" className="za-textlink za-back" onClick={() => go("apps")}><Back size={16} aria-hidden /> {t.ws.back}</button>

      <header className="za-ws-head">
        <div>
          <h1 className="za-h1 za-h1-job">{job.title}</h1>
          <p className="za-meta">
            <span>{job.company}</span>
            {job.location && <span>{job.location}</span>}
            <span className="z-tag">{job.remote ? t.jobs.remote : t.jobs.onsite}</span>
            {days !== null && <span>{t.jobs.posted(days)}</span>}
            {job.salary && <span dir="ltr">{job.salary}</span>}
            <span className="za-status" data-s={app.status}>{t.apps.status[app.status]}</span>
          </p>
          <a className="z-btn z-btn-quiet z-btn-small" href={job.url} target="_blank" rel="noopener noreferrer">{t.ws.viewListing} <ExternalLink size={14} aria-hidden /></a>
        </div>
        <ScoreMeter match={match} label={t.jobs.label(match.score)} />
      </header>

      <details className="za-why za-panel">
        <summary>{t.jobs.why}</summary>
        <ReasonList reasons={match.reasons} text={r => t.reason(r, countryLabel)} />
      </details>

      <div className="za-ws-grid">
        <DraftPanel app={app} onSaved={async (draft) => {
          await upsertApp({ ...app, draft, status: app.status === "saved" ? "prepared" : app.status, history: app.status === "saved" ? [...app.history, { at: new Date().toISOString(), status: "prepared" }] : app.history });
        }} />
        <div className="za-stack za-ws-side">
          <ApplyPanel app={app} onSubmitted={(channel) => setStatus("submitted", { channel })} />
          <TrackPanel app={app} setStatus={setStatus} onDelete={() => setConfirmDelete(true)} />
        </div>
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title={t.ws.remove} closeLabel={t.common.close}>
        <p className="za-body-text">{t.ws.removeConfirm}</p>
        <div className="za-actions">
          <button type="button" className="z-btn z-btn-quiet" onClick={() => setConfirmDelete(false)}>{t.common.cancel}</button>
          <button type="button" className="z-btn z-btn-primary" onClick={async () => { await removeApp(app.jobId); go("apps"); }}>{t.ws.remove}</button>
        </div>
      </Modal>
    </div>
  );
}

// ── Draft ────────────────────────────────────────────────────────────────────

function DraftPanel({ app, onSaved }: { app: Application; onSaved: (d: Draft) => Promise<void> }) {
  const { t, lang, profile, status, access, consent, giveConsent, setUsage, go } = useAgent();
  const [draft, setDraft] = useState<Draft | null>(app.draft);
  const [draftLang, setDraftLang] = useState<Lang>(app.draft?.lang ?? lang);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [askConsent, setAskConsent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(Boolean(app.draft));
  const id = useId();
  const hasCv = profile.cvText.trim().length >= 200;
  const aiReady = Boolean(status?.ai && access && hasCv);

  const update = (d: Draft) => { setDraft(d); setSaved(false); };

  const writeTemplate = () => {
    setError(null);
    setNote(null);
    update(templateDraft(app.job, profile, draftLang));
  };

  const writeAi = async (consented = consent) => {
    if (!consented) { setAskConsent(true); return; }
    if (!access) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const res = await fetch("/api/agent/tailor/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access: { kind: access.kind, proof: access.proof },
          lang: draftLang,
          profile: { name: profile.name, headline: profile.headline, roles: profile.roles, languages: profile.languages, skills: profile.skills },
          cvText: profile.cvText,
          job: { title: app.job.title, company: app.job.company, location: app.job.location, description: app.job.description, url: app.job.url },
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.draft) {
        if (data?.usage) setUsage({ drafts: data.usage });
        setError(t.access.err[String(data?.error)] ?? data?.error ?? t.common.error);
        return;
      }
      setUsage({ drafts: data.usage });
      update(data.draft as Draft);
      setNote([`${t.ws.usage(data.usage)}.`, data.dropped ? t.ws.dropped(data.dropped) : ""].filter(Boolean).join(" "));
    } catch {
      setError(t.common.error);
    } finally {
      setBusy(false);
    }
  };

  const save = async () => { if (draft) { await onSaved(draft); setSaved(true); } };

  const asText = (d: Draft) => [
    `${app.job.title} · ${app.job.company}`, "",
    `${t.ws.summary}:`, d.tailoredSummary, "",
    `${t.ws.highlights}:`, ...d.highlights.map(h => `• ${h.text}`), "",
    `${t.ws.letter}:`, d.coverLetter, "",
    `${t.ws.gaps}:`, ...(d.gaps.length ? d.gaps.map(g => `• ${g}`) : [t.ws.gapsNone]),
  ].join("\n");

  return (
    <section className="za-panel za-draft" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="za-h2">{t.ws.draftH}</h2>
      <p className="za-muted">{t.ws.draftIntro}</p>

      {!hasCv ? (
        <Notice tone="warn">{t.ws.needCv} <button type="button" className="za-textlink" onClick={() => go("profile")}>{t.app.tabs.profile}</button></Notice>
      ) : (
        <div className="za-draft-controls">
          <div className="za-field-inline">
            <label htmlFor={`${id}-lang`}>{t.ws.draftLang}</label>
            <select id={`${id}-lang`} className="za-select" value={draftLang} onChange={e => setDraftLang(e.target.value as Lang)}>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <button type="button" className="z-btn z-btn-primary z-btn-small" onClick={() => void writeAi()} disabled={!aiReady || busy}>
            {busy ? t.ws.writing : draft?.kind === "ai" ? t.ws.again : t.ws.ai}
          </button>
          <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={writeTemplate} disabled={busy}>{t.ws.template}</button>
        </div>
      )}
      {hasCv && !status?.ai && status && <p className="za-hint">{t.ws.aiOff}</p>}
      {hasCv && status?.ai && !access && <p className="za-hint">{t.ws.aiLocked} <button type="button" className="za-textlink" onClick={() => go("overview")}>{t.access.check}</button></p>}
      {busy && <p className="za-muted" role="status">{t.ws.writing}</p>}
      {error && <Notice tone="error">{error}</Notice>}
      {note && <Notice tone="info">{note}</Notice>}

      {draft && (
        <div className="za-draft-body" lang={draft.lang} dir={draft.lang === "ar" ? "rtl" : "ltr"}>
          <p className="z-tag z-tag-gold">{draft.kind === "ai" ? t.ws.kindAi : t.ws.kindTemplate} · {fmtDate(draft.createdAt, lang)}</p>

          {draft.warnings.map(w => (
            <Notice key={w.kind} tone="warn">
              {w.kind === "figures" ? t.ws.figures : t.ws.skills} <strong dir="auto">{w.items.join(", ")}</strong>
            </Notice>
          ))}

          <h3 className="za-h3">{t.ws.fit}</h3>
          <p className="za-body-text">{draft.fitSummary}</p>

          <div className="za-field">
            <label htmlFor={`${id}-sum`} className="za-h3">{t.ws.summary}</label>
            <textarea id={`${id}-sum`} className="za-textarea za-textarea-sm" value={draft.tailoredSummary} onChange={e => update({ ...draft, tailoredSummary: e.target.value })} dir="auto" />
          </div>

          <h3 className="za-h3">{t.ws.highlights}</h3>
          {draft.highlights.length === 0 ? <p className="za-muted">—</p> : (
            <ul className="za-highlights">
              {draft.highlights.map((h, i) => (
                <li key={i}>
                  <p>{h.text}</p>
                  {h.evidence !== h.text && <p className="za-evidence"><span>{t.ws.fromCv}</span> “{h.evidence}”</p>}
                </li>
              ))}
            </ul>
          )}

          <div className="za-field">
            <label htmlFor={`${id}-letter`} className="za-h3">{t.ws.letter}</label>
            <textarea id={`${id}-letter`} className="za-textarea za-letter" value={draft.coverLetter} onChange={e => update({ ...draft, coverLetter: e.target.value })} dir="auto" />
            {draft.coverLetter.includes("[") && <p className="za-hint">{t.ws.brackets}</p>}
          </div>

          <h3 className="za-h3">{t.ws.gaps}</h3>
          {draft.gaps.length ? <ul className="za-bullets">{draft.gaps.map(g => <li key={g}>{g}</li>)}</ul> : <p className="za-muted">{t.ws.gapsNone}</p>}

          {draft.keywords.length > 0 && (
            <>
              <h3 className="za-h3">{t.ws.keywords}</h3>
              <ul className="za-chips">{draft.keywords.map(k => <li key={k} className="za-chip za-chip-static">{k}</li>)}</ul>
            </>
          )}

          <div className="za-actions">
            <button type="button" className="z-btn z-btn-primary z-btn-small" onClick={() => void save()} disabled={saved}>{saved ? t.ws.savedDraft : t.ws.save}</button>
            <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={async () => { try { await navigator.clipboard.writeText(draft.coverLetter); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ } }}>
              <Copy size={15} aria-hidden /> {copied ? t.ws.copied : t.ws.copy}
            </button>
            <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => download(new Blob([asText(draft)], { type: "text/plain;charset=utf-8" }), `application-${app.job.company.replace(/[^\w]+/g, "-").slice(0, 40) || "draft"}.txt`)}>
              <Download size={15} aria-hidden /> {t.ws.download}
            </button>
          </div>
        </div>
      )}

      <Modal open={askConsent} onClose={() => setAskConsent(false)} title={t.ws.consentH} closeLabel={t.common.close}>
        <p className="za-body-text">{t.ws.consentBody}</p>
        <div className="za-actions">
          <button type="button" className="z-btn z-btn-quiet" onClick={() => setAskConsent(false)}>{t.common.cancel}</button>
          <button type="button" className="z-btn z-btn-primary" onClick={async () => { await giveConsent(); setAskConsent(false); void writeAi(true); }}>{t.ws.consentOk}</button>
        </div>
      </Modal>
    </section>
  );
}

// ── Apply ────────────────────────────────────────────────────────────────────

function ApplyPanel({ app, onSubmitted }: { app: Application; onSubmitted: (channel: Application["channel"]) => Promise<void> }) {
  const { t, profile, access, status, usage, setUsage, lang } = useAgent();
  const [askDone, setAskDone] = useState<Application["channel"]>(null);
  const [to, setTo] = useState(app.job.applyEmail ?? "");
  const [review, setReview] = useState(false);
  const id = useId();
  const letter = app.draft?.coverLetter ?? "";
  const subject = t.ws.subjectLine(app.job.title, profile.name);
  const submitted = Boolean(app.submittedAt);
  const canZenith = Boolean(access && status?.email);

  return (
    <section className="za-panel" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="za-h2">{t.ws.applyH}</h2>
      {submitted ? (
        <Notice tone="ok">{t.apps.submittedOn(fmtDate(app.submittedAt, lang))}</Notice>
      ) : (
        <p className="za-muted">{t.ws.applyIntro}</p>
      )}

      <div className="za-apply-opt">
        <h3 className="za-h3">{t.ws.viaSite}</h3>
        <p className="za-hint">{t.ws.viaSiteBody}</p>
        <a className="z-btn z-btn-quiet z-btn-small" href={app.job.url} target="_blank" rel="noopener noreferrer" onClick={() => !submitted && setAskDone("employer site")}>
          {t.ws.openListing} <ExternalLink size={14} aria-hidden />
        </a>
      </div>

      <div className="za-apply-opt">
        <h3 className="za-h3">{t.ws.viaEmail}</h3>
        <p className="za-hint">{app.job.applyEmail ? t.ws.viaEmailBody(app.job.applyEmail) : t.ws.viaEmailNone}</p>
        <div className="za-field">
          <label htmlFor={`${id}-to`}>{t.ws.employerEmail}</label>
          <input id={`${id}-to`} type="email" className="za-input" value={to} onChange={e => setTo(e.target.value.trim())} dir="ltr" />
        </div>
        <div className="za-actions">
          <a
            className={`z-btn z-btn-quiet z-btn-small${EMAIL.test(to) && letter ? "" : " za-disabled"}`}
            href={EMAIL.test(to) && letter ? mailto(to, subject, letter) : undefined}
            aria-disabled={!(EMAIL.test(to) && letter)}
            onClick={() => { if (EMAIL.test(to) && letter && !submitted) setAskDone("email"); }}
          >
            <Mail size={15} aria-hidden /> {t.ws.openMail}
          </a>
          <button type="button" className="z-btn z-btn-primary z-btn-small" disabled={!canZenith || !EMAIL.test(to) || !letter || submitted} onClick={() => setReview(true)}>
            <Send size={15} aria-hidden /> {t.ws.zSend}
          </button>
        </div>
        <p className="za-hint">{t.ws.openMailHint}</p>
        <p className="za-hint">{!access ? t.ws.zLocked : status && !status.email ? t.ws.zOff : t.ws.zSendHint}</p>
        {usage && access && <p className="za-hint">{t.ws.sendsLeft(usage.sends)}</p>}
      </div>

      {askDone && !submitted && (
        <div className="za-confirm" role="group" aria-label={t.ws.didSubmit}>
          <p><strong>{t.ws.didSubmit}</strong></p>
          <div className="za-actions">
            <button type="button" className="z-btn z-btn-primary z-btn-small" onClick={async () => { await onSubmitted(askDone); setAskDone(null); }}>{t.ws.yes}</button>
            <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => setAskDone(null)}>{t.ws.notYet}</button>
          </div>
        </div>
      )}

      <Modal open={review} onClose={() => setReview(false)} title={t.ws.reviewH} closeLabel={t.common.close} wide>
        <SendReview to={to} subject={subject} letter={letter} onSent={async (u) => { setUsage({ sends: u }); setReview(false); await onSubmitted("zenith email"); }} />
      </Modal>
    </section>
  );
}

function SendReview({ to, subject: initialSubject, letter, onSent }: { to: string; subject: string; letter: string; onSent: (u: { used: number; limit: number; period: "order" | "day" }) => Promise<void> }) {
  const { t, lang, profile, access } = useAgent();
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(letter);
  const [cv, setCv] = useState<File | null>(null);
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const id = useId();
  const emailOk = EMAIL.test(profile.email);

  const send = async () => {
    if (!access || !approved) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("kind", access.kind);
    fd.set("proof", access.proof);
    fd.set("to", to);
    fd.set("subject", subject);
    fd.set("body", body);
    fd.set("name", profile.name);
    fd.set("email", profile.email);
    fd.set("lang", lang);
    fd.set("approve", "yes");
    if (cv) fd.set("cv", cv);
    try {
      const res = await fetch("/api/agent/send/", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) { setError(t.access.err[String(data?.error)] ?? data?.error ?? t.common.error); return; }
      setDone(true);
      await onSent(data.usage);
    } catch {
      setError(t.common.error);
    } finally {
      setBusy(false);
    }
  };

  if (done) return <Notice tone="ok">{t.ws.sent}</Notice>;

  return (
    <div className="za-stack-sm">
      <dl className="za-review">
        <div><dt>{t.ws.to}</dt><dd dir="ltr">{to}</dd></div>
        <div><dt>{t.ws.from}</dt><dd>{t.ws.fromValue(profile.name)}</dd></div>
        <div><dt>{t.ws.replyTo}</dt><dd dir="ltr">{profile.email || "—"}</dd></div>
      </dl>
      {!emailOk && <Notice tone="warn">{t.ws.needEmail}</Notice>}
      <div className="za-field">
        <label htmlFor={`${id}-s`}>{t.ws.subject}</label>
        <input id={`${id}-s`} className="za-input" value={subject} onChange={e => setSubject(e.target.value.slice(0, 200))} dir="auto" />
      </div>
      <div className="za-field">
        <label htmlFor={`${id}-b`}>{t.ws.body}</label>
        <textarea id={`${id}-b`} className="za-textarea za-letter" value={body} onChange={e => setBody(e.target.value.slice(0, 8000))} dir="auto" />
        {body.includes("[") && <p className="za-hint">{t.ws.brackets}</p>}
      </div>
      <div className="za-field">
        <label htmlFor={`${id}-f`}>{t.ws.attach}</label>
        <input id={`${id}-f`} type="file" className="za-input" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e => setCv(e.target.files?.[0] ?? null)} />
        <p className="za-hint">{t.ws.attachHint}</p>
      </div>
      <label className="za-check za-approve">
        <input type="checkbox" checked={approved} onChange={e => setApproved(e.target.checked)} />
        <span>{t.ws.approve(to)}</span>
      </label>
      {error && <Notice tone="error">{error}</Notice>}
      <div className="za-actions">
        <button type="button" className="z-btn z-btn-primary" disabled={!approved || busy || !emailOk || body.trim().length < 50 || body.includes("[")} onClick={() => void send()}>
          <Send size={16} aria-hidden /> {busy ? t.ws.sending : t.ws.send}
        </button>
      </div>
    </div>
  );
}

// ── Tracking ─────────────────────────────────────────────────────────────────

function TrackPanel({ app, setStatus, onDelete }: { app: Application; setStatus: (s: AppStatus, extra?: Partial<Application>) => Promise<void>; onDelete: () => void }) {
  const { t, lang, upsertApp } = useAgent();
  const [notes, setNotes] = useState(app.notes);
  const id = useId();
  return (
    <section className="za-panel" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="za-h2">{t.ws.trackH}</h2>
      <div className="za-field">
        <label htmlFor={`${id}-s`}>{t.ws.status}</label>
        <select id={`${id}-s`} className="za-select" value={app.status} onChange={e => void setStatus(e.target.value as AppStatus)}>
          {STATUSES.map(s => <option key={s} value={s}>{t.apps.status[s]}</option>)}
        </select>
      </div>
      <div className="za-field">
        <label htmlFor={`${id}-f`}>{t.ws.followUp}</label>
        <div className="za-inline">
          <input id={`${id}-f`} type="date" className="za-input" value={app.followUpOn ?? ""} onChange={e => void upsertApp({ ...app, followUpOn: e.target.value || null })} dir="ltr" />
          <button
            type="button"
            className="za-icon-btn"
            disabled={!app.followUpOn}
            aria-label={t.ws.ics}
            title={t.ws.ics}
            onClick={() => app.followUpOn && download(icsFile({ uid: `follow-${app.jobId}`, date: app.followUpOn, title: t.ws.calTitle(app.job.title, app.job.company), body: t.ws.calBody(app.job.url), url: app.job.url }), "follow-up.ics")}
          >
            <CalendarPlus size={18} aria-hidden />
          </button>
        </div>
      </div>
      <div className="za-field">
        <label htmlFor={`${id}-n`}>{t.ws.notes}</label>
        <textarea id={`${id}-n`} className="za-textarea za-textarea-sm" value={notes} onChange={e => setNotes(e.target.value.slice(0, 4000))} onBlur={() => notes !== app.notes && void upsertApp({ ...app, notes })} dir="auto" />
      </div>
      <h3 className="za-h3">{t.ws.history}</h3>
      <ol className="za-history">
        {app.history.map((h, i) => <li key={i}><span>{t.apps.status[h.status]}</span> <time dateTime={h.at}>{fmtDate(h.at, lang)}</time></li>)}
      </ol>
      <button type="button" className="za-textlink za-danger" onClick={onDelete}><Trash2 size={15} aria-hidden /> {t.ws.remove}</button>
    </section>
  );
}
