"use client";

// The brief builder. Each answer fills the title block of a drawing sheet beside it: what the
// project is, where, how big, when, how long the first two stages would take and what the studio
// would look at first. The brief is kept on this device; "Send" stops at the concept notice.

import { useRef, useState, useSyncExternalStore } from "react";
import { KINDS, PLACES, PRIORITIES, STARTS, briefSheet, type Brief as BriefT } from "@/lib/showcase/zill";
import { Mark } from "./Chrome";
import { useZill } from "./state";

const MIN = 40;
const MAX = 2000;
const REF = 640; // the Courtyard House, m²
const noSub = () => () => {};

function Chips<T extends { id: string; name: { en: string; ar: string } }>({
  legend,
  name,
  options,
  value,
  multi,
  onChange,
  invalid,
}: {
  legend: string;
  name: string;
  options: readonly T[];
  value: string | string[];
  multi?: boolean;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const { lang } = useZill();
  const on = (id: string) => (Array.isArray(value) ? value.includes(id) : value === id);
  return (
    <fieldset className={`zl-field${invalid ? " is-invalid" : ""}`} aria-invalid={invalid || undefined}>
      <legend>{legend}</legend>
      <div className="zl-chips">
        {options.map((o) => (
          <label key={o.id} className={`zl-chip${on(o.id) ? " is-on" : ""}`}>
            <input type={multi ? "checkbox" : "radio"} name={name} value={o.id} checked={on(o.id)} onChange={() => onChange(o.id)} />
            <span>{o.name[lang]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SizeGlyph({ size }: { size: number }) {
  // both squares drawn at the same scale: the side grows with the square root of the area
  const k = 76 / Math.sqrt(MAX);
  const a = Math.round(Math.sqrt(size) * k * 10) / 10;
  const r = Math.round(Math.sqrt(REF) * k * 10) / 10;
  return (
    <svg viewBox="0 0 84 84" className="zl-size-glyph" aria-hidden>
      <rect x={(84 - a) / 2} y={(84 - a) / 2} width={a} height={a} className="you" />
      <rect x={(84 - r) / 2} y={(84 - r) / 2} width={r} height={r} className="ref" />
    </svg>
  );
}

export function Brief() {
  const { t, lang, brief, setBrief, open } = useZill();
  const [tried, setTried] = useState(false);
  // the date the sheet is drawn up exists only in the browser (the page itself is prerendered)
  const drawn = useSyncExternalStore(
    noSub,
    () => new Intl.DateTimeFormat(lang === "ar" ? "ar-AE-u-nu-latn" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dubai" }).format(new Date()),
    () => "",
  );
  const prioRef = useRef<HTMLDivElement>(null);
  const sheet = briefSheet(brief);
  const name = (list: readonly { id: string; name: { en: string; ar: string } }[], id: string) => list.find((o) => o.id === id)?.name[lang] ?? "";
  const set = <K extends keyof BriefT>(k: K, v: BriefT[K]) => setBrief((b) => ({ ...b, [k]: v }));
  const toggle = (id: string) => setBrief((b) => ({ ...b, priorities: b.priorities.includes(id) ? b.priorities.filter((p) => p !== id) : [...b.priorities, id] }));
  const missing = brief.priorities.length === 0;

  const send = () => {
    setTried(true);
    if (missing) {
      prioRef.current?.querySelector("input")?.focus();
      return;
    }
    open("notice");
  };

  return (
    <section className="zl-brief" id="brief" aria-labelledby="zl-brief-h">
      <header className="zl-brief-head">
        <h2 id="zl-brief-h">{t.briefTitle}</h2>
        <p>{t.briefIntro}</p>
      </header>
      <div className="zl-brief-grid">
        <form
          className="zl-brief-form"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          noValidate
        >
          <Chips legend={t.kind} name="zl-kind" options={KINDS} value={brief.kind} onChange={(v) => set("kind", v)} />
          <Chips legend={t.place} name="zl-place" options={PLACES} value={brief.place} onChange={(v) => set("place", v)} />
          <div className="zl-field">
            <label htmlFor="zl-size" className="zl-field-label">
              {t.size} <output htmlFor="zl-size">{brief.size.toLocaleString("en")} {t.m2}</output>
            </label>
            <input
              id="zl-size"
              type="range"
              min={MIN}
              max={MAX}
              step={10}
              value={brief.size}
              aria-valuetext={`${brief.size} ${t.m2}`}
              onChange={(e) => set("size", Number(e.target.value))}
            />
          </div>
          <div ref={prioRef}>
            <Chips legend={t.priorities} name="zl-prio" options={PRIORITIES} value={brief.priorities} multi onChange={toggle} invalid={tried && missing} />
            {tried && missing && (
              <p className="zl-err" role="alert">
                {t.pickPriority}
              </p>
            )}
          </div>
          <Chips legend={t.start} name="zl-start" options={STARTS} value={brief.start} onChange={(v) => set("start", v)} />
          <div className="zl-field">
            <label htmlFor="zl-bname" className="zl-field-label">
              {t.yourName}
            </label>
            <input id="zl-bname" className="zl-input" value={brief.name} maxLength={80} autoComplete="name" onChange={(e) => set("name", e.target.value)} />
          </div>
          <button type="submit" className="zl-btn zl-btn-sun zl-brief-send">
            {t.sendBrief}
          </button>
        </form>

        <aside className="zl-tb" aria-label={t.sheetTitle} aria-live="polite">
          <div className="zl-tb-top">
            <span className="zl-tb-logo">
              <Mark size={22} />
              {lang === "ar" ? "ظِلّ" : "ZILL"}
            </span>
            <span className="zl-tb-title">{t.sheetTitle}</span>
          </div>
          <dl className="zl-tb-rows">
            <div>
              <dt>{t.sheetFor}</dt>
              <dd>{brief.name.trim() || "—"}</dd>
            </div>
            <div>
              <dt>{t.kind}</dt>
              <dd>{name(KINDS, brief.kind)}</dd>
            </div>
            <div>
              <dt>{t.place}</dt>
              <dd>{name(PLACES, brief.place)}</dd>
            </div>
            <div className="zl-tb-size">
              <dt>{t.size}</dt>
              <dd>
                <span>
                  {brief.size.toLocaleString("en")} {t.m2}
                </span>
                <SizeGlyph size={brief.size} />
              </dd>
            </div>
            <div>
              <dt>{t.start}</dt>
              <dd>{name(STARTS, brief.start)}</dd>
            </div>
          </dl>
          <div className="zl-tb-time">
            <div className="zl-tb-bar" aria-hidden>
              <span style={{ flexGrow: sheet.concept }} className="c" />
              <span style={{ flexGrow: sheet.design }} className="d" />
            </div>
            <p>{t.weeksConcept(sheet.concept)}</p>
            <p>{t.weeksDesign(sheet.design)}</p>
          </div>
          <div className="zl-tb-advice">
            <h3>{t.firstLook}</h3>
            {sheet.advice.length ? (
              <ul>
                {sheet.advice.map((a) => (
                  <li key={a.en}>{a[lang]}</li>
                ))}
              </ul>
            ) : (
              <p className="zl-tb-empty">{t.pickPriority}</p>
            )}
            {sheet.placeNote && <p className="zl-tb-note">{sheet.placeNote[lang]}</p>}
          </div>
          <div className="zl-tb-foot">
            <span>{drawn}</span>
            <span>{t.sizeRef}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
