"use client";
// components/agent/interview/History.tsx — progress across interviews kept in this browser: the
// overall score by session, the questions practised again (before and now), and every report.

import React, { useId, useMemo, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useAgent } from "../context";
import { Modal, fmtDate } from "../parts";
import { IV_COPY } from "@/lib/agent/interview/copy";
import type { IvRecord } from "@/lib/agent/interview/types";

const one = (n: number | null) => (n === null ? "–" : n.toFixed(1));

function Chart({ records, label }: { records: IvRecord[]; label: string }) {
  const pts = [...records].reverse().filter(r => r.report.overall !== null);
  if (!pts.length) return null;
  const W = 600;
  const H = 180;
  const padL = 34;
  const padR = 14;
  const padT = 12;
  const padB = 22;
  const x = (i: number) => (pts.length === 1 ? (padL + W - padR) / 2 : padL + (i * (W - padL - padR)) / (pts.length - 1));
  const y = (v: number) => padT + (1 - v / 4) * (H - padT - padB);
  const line = pts.map((r, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(r.report.overall!).toFixed(1)}`).join(" ");
  return (
    <svg className="za-iv-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {[0, 1, 2, 3, 4].map(v => (
        <g key={v}>
          <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} className="za-iv-chart-grid" />
          <text x={padL - 10} y={y(v) + 4} textAnchor="end" className="za-iv-chart-label">{v}</text>
        </g>
      ))}
      <path d={line} className="za-iv-chart-line" />
      {pts.map((r, i) => (
        <circle key={r.id} cx={x(i)} cy={y(r.report.overall!)} r="4.5" className="za-iv-chart-dot">
          <title>{`${fmtDate(r.at, "en")}: ${one(r.report.overall)} / 4`}</title>
        </circle>
      ))}
    </svg>
  );
}

export default function HistoryView({ records, onOpen, onDelete, onDeleteAll, onBack }: {
  records: IvRecord[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
  onBack: () => void;
}) {
  const { lang, t } = useAgent();
  const c = IV_COPY[lang];
  const id = useId();
  const [confirm, setConfirm] = useState(false);

  // Questions asked in more than one session: the first score and the latest.
  const repeats = useMemo(() => {
    const seen = new Map<string, { text: string; scores: (number | null)[] }>();
    for (const r of [...records].reverse()) {
      for (const a of r.report.answers) {
        if (a.kind !== "main") continue;
        const cur = seen.get(a.id) ?? { text: a.question, scores: [] };
        cur.text = a.question;
        cur.scores.push(a.skipped ? 0 : a.score);
        seen.set(a.id, cur);
      }
    }
    return [...seen.entries()].filter(([, v]) => v.scores.length >= 2).map(([qid, v]) => ({ id: qid, text: v.text, first: v.scores[0], last: v.scores[v.scores.length - 1] })).slice(0, 8);
  }, [records]);

  const first = records[records.length - 1];
  const latest = records[0];

  return (
    <div className="za-stack">
      <button type="button" className="za-textlink za-back" onClick={onBack}><ArrowLeft size={15} aria-hidden /> {c.history.back}</button>
      <header>
        <h1 className="za-h1">{c.history.h}</h1>
      </header>
      {!records.length ? (
        <p className="za-muted">{c.history.none}</p>
      ) : (
        <>
          <section className="za-panel" aria-labelledby={`${id}-c`}>
            <div className="za-panel-head">
              <h2 id={`${id}-c`} className="za-h2">{c.history.chartH}</h2>
              {records.length >= 2 && (
                <p className="za-muted">{c.history.first}: {one(first.report.overall)} · {c.history.latest}: {one(latest.report.overall)}</p>
              )}
            </div>
            <Chart records={records} label={c.history.chartH} />
            <p className="za-hint">{c.history.chartNote}</p>
          </section>

          {repeats.length > 0 && (
            <section className="za-panel" aria-labelledby={`${id}-r`}>
              <h2 id={`${id}-r`} className="za-h2">{c.history.repeats}</h2>
              <ul className="za-rows">
                {repeats.map(q => (
                  <li key={q.id} className="za-row">
                    <div className="za-row-main"><strong dir="auto">{q.text}</strong><span>{c.history.repeatRow(one(q.first), one(q.last))}</span></div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="za-panel">
            <table className="za-table za-iv-table">
              <thead>
                <tr><th scope="col">{c.history.table.date}</th><th scope="col">{c.history.table.role}</th><th scope="col">{c.history.table.type}</th><th scope="col">{c.history.table.score}</th><th scope="col"><span className="z-sr">{c.history.open}</span></th></tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id}>
                    <td>{fmtDate(r.at, lang)}</td>
                    <th scope="row" dir="auto">{r.role}{r.company ? ` · ${r.company}` : ""}</th>
                    <td>{c.setup.types[r.type].name} · {c.setup.difficulties[r.difficulty].name}</td>
                    <td>{one(r.report.overall)}{r.report.band ? ` · ${c.bands[r.report.band].name}` : ""}</td>
                    <td className="za-iv-table-actions">
                      <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => onOpen(r.id)}>{c.history.open}</button>
                      <button type="button" className="za-icon-btn" aria-label={`${c.history.del}: ${r.role}, ${fmtDate(r.at, lang)}`} onClick={() => onDelete(r.id)}><Trash2 size={16} aria-hidden /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="za-actions za-danger-zone">
              <button type="button" className="z-btn z-btn-quiet z-btn-small za-danger" onClick={() => setConfirm(true)}><Trash2 size={15} aria-hidden /> {c.history.delAll}</button>
            </div>
          </section>
        </>
      )}
      <Modal open={confirm} onClose={() => setConfirm(false)} title={c.history.delAll} closeLabel={t.common.close}>
        <p className="za-body-text">{c.history.delAllConfirm}</p>
        <div className="za-actions">
          <button type="button" className="z-btn z-btn-quiet" onClick={() => setConfirm(false)}>{t.common.cancel}</button>
          <button type="button" className="z-btn z-btn-primary" onClick={() => { setConfirm(false); onDeleteAll(); }}>{c.history.delAll}</button>
        </div>
      </Modal>
    </div>
  );
}
