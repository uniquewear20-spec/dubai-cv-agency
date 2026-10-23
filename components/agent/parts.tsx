"use client";
// components/agent/parts.tsx — small building blocks shared by the agent's views.

import React, { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Match, Reason } from "@/lib/agent/score";

/** Text list editor: type, press Enter or comma (or the Add button), remove with ×. */
export function ChipsInput({
  label, hint, values, onChange, max = 20, placeholder, addLabel, removeLabel, parse, invalidText, list, display, split = true,
}: {
  label: string; hint?: string; values: string[]; onChange: (v: string[]) => void; max?: number; placeholder?: string;
  addLabel: string; removeLabel: (x: string) => string;
  /** Turns typed text into a stored value, or null when it isn't valid. */
  parse?: (raw: string) => string | null;
  invalidText?: (raw: string) => string;
  /** Suggestions offered while typing. */
  list?: string[];
  /** How a stored value is shown (e.g. a country code as its name). */
  display?: (v: string) => string;
  /** Commas separate several values (true), or belong to one value such as a degree (false). */
  split?: boolean;
}) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const show = (v: string) => (display ? display(v) : v);

  const commit = (raw = draft) => {
    const parts = (split ? raw.split(/[,;\n]/) : [raw]).map(s => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...values];
    for (const p of parts) {
      const v = parse ? parse(p) : p.slice(0, 80);
      if (v === null) { setError(invalidText ? invalidText(p) : null); continue; }
      if (!next.some(x => x.toLowerCase() === v.toLowerCase()) && next.length < max) next.push(v);
    }
    onChange(next);
    setDraft("");
  };

  return (
    <div className="za-field">
      <label htmlFor={id}>{label}</label>
      {values.length > 0 && (
        <ul className="za-chips" aria-label={label}>
          {values.map(v => (
            <li key={v} className="za-chip">
              <span>{show(v)}</span>
              <button type="button" onClick={() => onChange(values.filter(x => x !== v))} aria-label={removeLabel(show(v))}>
                <X size={14} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      {values.length < max && (
        <div className="za-chip-add">
          <input
            id={id}
            className="za-input"
            value={draft}
            placeholder={placeholder}
            list={list ? `${id}-list` : undefined}
            onChange={e => { setDraft(e.target.value); setError(null); if (split && /[,;]$/.test(e.target.value)) commit(e.target.value); }}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
            onBlur={() => commit()}
            aria-describedby={hint ? `${id}-hint` : undefined}
            aria-invalid={error ? true : undefined}
          />
          <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => commit()}>{addLabel}</button>
          {list && <datalist id={`${id}-list`}>{list.map(o => <option key={o} value={o} />)}</datalist>}
        </div>
      )}
      {hint && <p id={`${id}-hint`} className="za-hint">{hint}</p>}
      {error && <p className="za-error" role="alert">{error}</p>}
    </div>
  );
}

const SEGMENTS: { key: keyof Match["parts"]; max: number }[] = [
  { key: "title", max: 35 }, { key: "skills", max: 30 }, { key: "place", max: 15 }, { key: "level", max: 10 }, { key: "fresh", max: 10 },
];

/** The score and its five parts, each part as wide as its weight and filled by the points earned. */
export function ScoreMeter({ match, label }: { match: Match; label: string }) {
  return (
    <div className="za-score" data-band={match.score >= 75 ? "strong" : match.score >= 60 ? "good" : match.score >= 40 ? "partial" : "weak"}>
      <p className="za-score-n">{match.score}<span className="z-sr"> / 100</span></p>
      <p className="za-score-l">{label}</p>
      <span className="za-meter" aria-hidden>
        {SEGMENTS.map(s => (
          <i key={s.key} style={{ "--w": s.max, "--f": `${Math.round((Math.min(s.max, match.parts[s.key]) / s.max) * 100)}%` } as React.CSSProperties} />
        ))}
      </span>
    </div>
  );
}

export function ReasonList({ reasons, text }: { reasons: Reason[]; text: (r: Reason) => string }) {
  return (
    <ul className="za-reasons">
      {reasons.map((r, i) => (
        <li key={i} data-tone={r.tone}>
          <span aria-hidden className="za-reason-mark">{r.tone === "plus" ? "+" : r.tone === "minus" ? "−" : "·"}</span>
          <span>{text(r)}</span>
        </li>
      ))}
    </ul>
  );
}

/** A modal built on <dialog>: focus stays inside, Escape closes, focus returns to the opener. */
export function Modal({ open, onClose, title, children, closeLabel, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; closeLabel: string; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={`za-dialog${wide ? " za-dialog-wide" : ""}`} aria-labelledby={titleId} onClose={onClose} onCancel={e => { e.preventDefault(); onClose(); }}>
      <div className="za-dialog-head">
        <h2 id={titleId} className="za-h2">{title}</h2>
        <button type="button" className="za-icon-btn" onClick={onClose} aria-label={closeLabel}><X size={18} aria-hidden /></button>
      </div>
      <div className="za-dialog-body">{open ? children : null}</div>
    </dialog>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "ok" | "warn" | "error"; children: React.ReactNode }) {
  return <div className="za-notice" data-tone={tone} role={tone === "error" ? "alert" : "status"}>{children}</div>;
}

export const fmtDate = (iso: string | null | undefined, lang: string): string => {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(lang === "ar" ? "ar-AE" : lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
};
