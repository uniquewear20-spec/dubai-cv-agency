"use client";
// components/agent/interview/Report.tsx — the coaching report: the overall level, the eight criteria
// with what each measures, the action plan, each answer with what worked, what to improve, what a
// strong answer covers and the candidate's own sentences in STAR order, role knowledge, how they came
// across, what to practise next and tips for the role. Everything is measured from the words of the
// answers with fixed rules; the report says so.

import React, { useEffect, useId, useState } from "react";
import { ArrowLeft, History, Printer, RotateCcw, Trash2 } from "lucide-react";
import { useAgent } from "../context";
import { Modal, fmtDate } from "../parts";
import { IV_COPY } from "@/lib/agent/interview/copy";
import { CRITERIA } from "@/lib/agent/interview/types";
import type { AnswerReview, IvRecord } from "@/lib/agent/interview/types";

const one = (n: number | null) => (n === null ? "–" : n.toFixed(1));

export function ScoreBar({ value, label }: { value: number | null; label: string }) {
  return (
    <span className="za-iv-scorebar" aria-hidden={value === null} role={value === null ? undefined : "img"} aria-label={value === null ? undefined : label}>
      {[0, 1, 2, 3].map(i => (
        <i key={i} style={{ "--f": `${Math.max(0, Math.min(1, (value ?? 0) - i)) * 100}%` } as React.CSSProperties} />
      ))}
    </span>
  );
}

function AnswerCard({ a, open, lang }: { a: AnswerReview; open: boolean; lang: "en" | "fr" | "ar" }) {
  const c = IV_COPY[lang];
  const scored = Object.entries(a.scores) as [keyof typeof c.criteria, number][];
  return (
    <details className="za-iv-answer-card" open={open} id={`za-iv-q${a.q}`}>
      <summary>
        <span className="za-iv-q-text" dir="auto">{a.question || c.room.closing}</span>
        <span className="za-iv-q-score" data-band={a.score === null ? "none" : a.score >= 3.2 ? "ready" : a.score >= 2.5 ? "nearly" : a.score >= 1.5 ? "developing" : "early"}>
          {a.skipped ? c.report.skipped : a.score === null ? c.report.noScore : `${one(a.score)} / 4`}
        </span>
      </summary>
      <div className="za-iv-answer-body">
        <p className="za-iv-comp">{c.comps[a.competency]}</p>
        {!a.skipped && (
          <div className="za-iv-said">
            <p className="za-label-sm">{c.report.yourAnswer}</p>
            <blockquote dir="auto">{a.answer}</blockquote>
            {a.followups.map((f, i) => (
              <div key={i} className="za-iv-follow">
                <p className="za-label-sm">{c.room.asked(c.why[f.why])}</p>
                <p className="za-iv-follow-q" dir="auto">{f.question}</p>
                {f.answer ? <blockquote dir="auto">{f.answer}</blockquote> : <p className="za-muted">{c.report.skipped}</p>}
              </div>
            ))}
          </div>
        )}
        {scored.length > 0 && (
          <ul className="za-iv-minis">
            {scored.map(([k, v]) => (
              <li key={k}><span>{c.criteria[k].name}</span><ScoreBar value={v} label={`${c.criteria[k].name}: ${v} / 4`} /><b>{v}</b></li>
            ))}
          </ul>
        )}
        <div className="za-iv-twocol">
          {a.good.length > 0 && (
            <div>
              <p className="za-label-sm">{c.report.worked}</p>
              <ul className="za-reasons">{a.good.map(g => <li key={g} data-tone="plus"><span className="za-reason-mark" aria-hidden>+</span><span>{c.good[g]}</span></li>)}</ul>
            </div>
          )}
          {a.fix.length > 0 && (
            <div>
              <p className="za-label-sm">{c.report.improve}</p>
              <ul className="za-reasons">{a.fix.map(f => <li key={f} data-tone="minus"><span className="za-reason-mark" aria-hidden>−</span><span>{c.fix[f]}</span></li>)}</ul>
            </div>
          )}
        </div>
        {a.covers.length > 0 && (
          <div>
            <p className="za-label-sm">{c.report.covers}</p>
            <ul className="za-bullets" dir="auto">{a.covers.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
        )}
        {a.outline && a.outline.some(o => o.text) && (
          <div className="za-iv-star">
            <p className="za-label-sm">{c.report.outline}</p>
            <ol>
              {a.outline.filter(o => o.part !== "T" || o.text).map(o => (
                <li key={o.part} data-missing={o.text ? undefined : "true"}>
                  <span className="za-iv-star-k">{c.star[o.part]}</span>
                  <span dir="auto">{o.text ?? c.report.missing(c.star[o.part])}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </details>
  );
}

export default function Report({ record, onAgain, onNew, onHistory, onDelete, onBack }: {
  record: IvRecord;
  onAgain: () => void;
  onNew: () => void;
  onHistory: () => void;
  onDelete: () => void;
  onBack?: () => void;
}) {
  const { lang, t } = useAgent();
  const c = IV_COPY[lang];
  const id = useId();
  const [confirmDel, setConfirmDel] = useState(false);
  // Printing shows every answer, not only the open ones.
  useEffect(() => {
    const open = () => document.querySelectorAll<HTMLDetailsElement>(".za-iv-answer-card").forEach(d => { d.open = true; });
    window.addEventListener("beforeprint", open);
    return () => window.removeEventListener("beforeprint", open);
  }, []);
  const r = record.report;
  const band = r.band ? c.bands[r.band] : null;
  const byQ = (q: number) => r.answers.find(a => a.q === q);
  const mins = Math.max(1, Math.round(record.durationSec / 60));
  const meta = [record.role, record.company, c.setup.types[record.type].name, c.setup.difficulties[record.difficulty].name, c.setup.langs[record.lang], fmtDate(record.at, lang), `${mins} min`]
    .filter(Boolean).join(" · ");

  return (
    <div className="za-stack za-iv-report">
      {onBack && <button type="button" className="za-textlink za-back" onClick={onBack}><ArrowLeft size={15} aria-hidden /> {c.history.back}</button>}
      <header>
        <h1 className="za-h1">{c.report.h}</h1>
        <p className="za-lede" dir="auto">{meta}</p>
      </header>

      <section className="za-iv-hero" aria-labelledby={`${id}-o`}>
        <div className="za-iv-overall">
          <p id={`${id}-o`} className="za-label-sm">{c.report.overall}</p>
          {r.overall !== null ? (
            <>
              <p className="za-iv-big">{one(r.overall)}<span> {c.report.outOf}</span></p>
              {band && <p className="za-iv-band" data-band={r.band}><strong>{band.name}.</strong> {band.desc}</p>}
            </>
          ) : <p className="za-body-text">{c.report.tooLittle}</p>}
          <p className="za-muted">{c.report.answered(r.answered, r.planned)}{r.endedEarly ? ` ${c.report.endedEarly}` : ""}</p>
          <p className="za-hint za-iv-measured">{c.report.measured}{record.lang === "ar" ? ` ${c.report.arabic}` : ""}</p>
        </div>
        <div className="za-iv-criteria">
          <h2 className="za-h3">{c.report.criteriaH}</h2>
          <ul>
            {CRITERIA.map(k => {
              const cr = r.criteria.find(x => x.id === k);
              return (
                <li key={k}>
                  <div className="za-iv-crit-top">
                    <strong>{c.criteria[k].name}</strong>
                    <ScoreBar value={cr?.score ?? null} label={`${c.criteria[k].name}: ${one(cr?.score ?? null)} / 4`} />
                    <b>{one(cr?.score ?? null)}</b>
                  </div>
                  <p>{c.criteria[k].what}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {r.actions.length > 0 && (
        <section className="za-panel" aria-labelledby={`${id}-a`}>
          <h2 id={`${id}-a`} className="za-h2">{c.report.actionsH}</h2>
          <ol className="za-iv-actions">{r.actions.map((a, i) => <li key={i} dir="auto">{c.actions[a.code](a)}</li>)}</ol>
        </section>
      )}

      {(r.strongest.length > 0 || r.weakest.length > 0) && (
        <div className={r.strongest.length > 0 && r.weakest.length > 0 ? "za-split" : "za-stack"}>
          {r.strongest.length > 0 && (
            <section className="za-panel">
              <h2 className="za-h2">{c.report.strongestH}</h2>
              <ul className="za-rows">{r.strongest.map(q => <li key={q} className="za-row"><a className="za-row-main" href={`#za-iv-q${q}`} onClick={e => { e.preventDefault(); document.getElementById(`za-iv-q${q}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); (document.getElementById(`za-iv-q${q}`) as HTMLDetailsElement | null)?.setAttribute("open", ""); }}><strong dir="auto">{byQ(q)?.question}</strong><span>{one(byQ(q)?.score ?? null)} / 4</span></a></li>)}</ul>
            </section>
          )}
          {r.weakest.length > 0 && (
            <section className="za-panel">
              <h2 className="za-h2">{c.report.weakestH}</h2>
              <ul className="za-rows">{r.weakest.map(q => <li key={q} className="za-row"><a className="za-row-main" href={`#za-iv-q${q}`} onClick={e => { e.preventDefault(); const el = document.getElementById(`za-iv-q${q}`) as HTMLDetailsElement | null; el?.setAttribute("open", ""); el?.scrollIntoView({ behavior: "smooth", block: "start" }); }}><strong dir="auto">{byQ(q)?.question}</strong><span>{byQ(q)?.skipped ? c.report.skipped : `${one(byQ(q)?.score ?? null)} / 4`}</span></a></li>)}</ul>
            </section>
          )}
        </div>
      )}

      <section aria-labelledby={`${id}-q`}>
        <h2 id={`${id}-q`} className="za-h2">{c.report.answersH}</h2>
        <div className="za-iv-answers">
          {r.answers.map(a => <AnswerCard key={a.q} a={a} open={r.weakest.includes(a.q)} lang={lang} />)}
        </div>
      </section>

      <div className="za-split">
        <section className="za-panel" aria-labelledby={`${id}-k`}>
          <h2 id={`${id}-k`} className="za-h2">{c.report.knowledgeH}</h2>
          {r.knowledge.used.length > 0 && (
            <>
              <p className="za-label-sm">{c.report.knowUsed}</p>
              <ul className="za-chips">{r.knowledge.used.map(x => <li key={x} className="za-chip za-chip-static" dir="auto">{x}</li>)}</ul>
            </>
          )}
          {r.knowledge.missing.length > 0 ? (
            <>
              <p className="za-label-sm">{c.report.knowMissing}</p>
              <ul className="za-chips">{r.knowledge.missing.map(x => <li key={x} className="za-chip za-chip-static za-iv-chip-missing" dir="auto">{x}</li>)}</ul>
            </>
          ) : r.knowledge.used.length === 0 ? <p className="za-muted">{c.report.knowNone}</p> : null}
          {r.competencies.shown.length > 0 && <p className="za-body-text"><strong>{c.report.shown}:</strong> {r.competencies.shown.map(x => c.comps[x]).join(", ")}</p>}
          {r.competencies.needed.length > 0 && <p className="za-body-text"><strong>{c.report.needed}:</strong> {r.competencies.needed.map(x => c.comps[x]).join(", ")}</p>}
        </section>
        <section className="za-panel" aria-labelledby={`${id}-c`}>
          <h2 id={`${id}-c`} className="za-h2">{c.report.commH}</h2>
          <ul className="za-bullets">
            <li>{c.report.comm.words(r.communication.avgWords)}</li>
            {r.communication.wpm !== null ? <li>{c.report.comm.wpm(r.communication.wpm)} {c.report.comm.wpmNote}</li> : !r.communication.voice ? <li>{c.report.comm.typed}</li> : null}
            <li>{c.report.comm.hedges(r.communication.hedges)}</li>
            <li>{c.report.comm.fillers(r.communication.fillers)}</li>
            {r.communication.asked !== null && <li>{r.communication.asked ? c.report.comm.asked : c.report.comm.notAsked}</li>}
          </ul>
        </section>
      </div>

      {(r.practice.length > 0 || r.tips.length > 0) && (
        <div className="za-split">
          {r.practice.length > 0 && (
            <section className="za-panel">
              <h2 className="za-h2">{c.report.practiceH}</h2>
              <ul className="za-bullets" dir="auto">{r.practice.map(p => <li key={p.id}>{p.text} <span className="za-muted">({c.comps[p.competency]})</span></li>)}</ul>
            </section>
          )}
          {r.tips.length > 0 && (
            <section className="za-panel">
              <h2 className="za-h2">{c.report.tipsH}</h2>
              <ul className="za-bullets">{r.tips.map(t => <li key={t}>{t}</li>)}</ul>
            </section>
          )}
        </div>
      )}


      <div className="za-actions za-iv-noprint">
        <button type="button" className="z-btn z-btn-primary" onClick={onAgain}><RotateCcw size={15} aria-hidden /> {c.report.again}</button>
        <button type="button" className="z-btn z-btn-quiet" onClick={onNew}>{c.report.newOne}</button>
        <button type="button" className="z-btn z-btn-quiet" onClick={onHistory}><History size={15} aria-hidden /> {c.report.progress}</button>
        <button type="button" className="z-btn z-btn-quiet" onClick={() => window.print()}><Printer size={15} aria-hidden /> {c.report.print}</button>
        <button type="button" className="z-btn z-btn-quiet za-danger" onClick={() => setConfirmDel(true)}><Trash2 size={15} aria-hidden /> {c.report.del}</button>
      </div>
      <Modal open={confirmDel} onClose={() => setConfirmDel(false)} title={c.report.del} closeLabel={t.common.close}>
        <p className="za-body-text">{c.report.delConfirm}</p>
        <div className="za-actions">
          <button type="button" className="z-btn z-btn-quiet" onClick={() => setConfirmDel(false)}>{t.common.cancel}</button>
          <button type="button" className="z-btn z-btn-primary" onClick={() => { setConfirmDel(false); onDelete(); }}>{c.report.del}</button>
        </div>
      </Modal>
    </div>
  );
}
