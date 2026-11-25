"use client";
// components/xray/Report.tsx — the CV X-Ray report, shared by the free page (/x-ray/) and the AI job agent.
// Order: what was checked, the overall assessment, what the parser reads, the fixes to make first,
// strongest and weakest areas, missing requirements, every finding by area, other improvements, next step.

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Check, CircleAlert, Info, MessageCircle } from "lucide-react";
import { waLink, type Lang } from "@/lib/site";
import { TIERS } from "@/lib/checkout/catalog";
import { packageName } from "@/lib/packages";
import type { Check as Finding, CheckId, Report, Status } from "@/lib/xray/analyze";
import { say, UI } from "@/lib/xray/copy";

export const STATUS_ICON: Record<Status, React.ReactNode> = {
  pass: <Check size={15} aria-hidden />,
  warn: <AlertTriangle size={15} aria-hidden />,
  fail: <CircleAlert size={15} aria-hidden />,
  info: <Info size={15} aria-hidden />,
};

const FILM_LINES = 40;
const iso = (s: string) => `⁨${s}⁩`;

/** The WhatsApp link for a review: the message carries the X-Ray summary (verdict, top issues, role), never CV text. */
export function reviewLink(report: Report | null, lang: Lang, role: string, ref: string): string {
  const ui = UI[lang];
  if (!report) return waLink(ui.waMessage(role, ref));
  const issues = report.fixes.slice(0, 3).map(c => say(c, lang).title.replace(/[\u2068\u2069]/g, ""));
  return waLink(ui.waSummary(ui.verdictShort[report.overall.verdict], issues, role, ref));
}

const AREA_OF: Partial<Record<CheckId, "layout" | "structure" | "results" | "positioning" | "keywords" | "linkedin">> = {
  columns: "layout", tables: "layout", textboxes: "layout", "header-contact": "layout", glyphs: "layout",
  headings: "structure", length: "structure", contact: "structure", order: "structure", "date-styles": "structure", undated: "structure", dense: "structure",
  metrics: "results", duties: "results", leadership: "results",
  summary: "positioning", headline: "positioning", "headline-target": "positioning", "title-fit": "positioning", level: "positioning",
  "ad-skills": "keywords", "cv-skills": "keywords", languages: "keywords",
  linkedin: "linkedin",
};

export function XrayReport({ report, lang, role, refCode }: { report: Report; lang: Lang; role: string; refCode: string }) {
  const ui = UI[lang];
  const wa = reviewLink(report, lang, role, refCode);
  const work = [...new Set([...report.fixes, ...report.improvements].map(c => AREA_OF[c.id]).filter(Boolean))].slice(0, 4) as (keyof typeof ui.specialist)[];
  const [allLines, setAllLines] = useState(false);
  const f = report.facts;
  const facts = [
    ui.facts[f.kind],
    f.pages ? ui.facts.pages(f.pages) : null,
    ui.facts.words(f.words),
    f.years ? ui.facts.years(f.years) : null,
  ].filter(Boolean) as string[];
  const lines = allLines ? report.film : report.film.slice(0, FILM_LINES);
  const checks = report.areas.reduce((n, a) => n + a.checks.length, 0);
  const verdictStatus: Status = report.overall.verdict === "strong" ? "pass" : report.overall.verdict === "fair" ? "warn" : "fail";
  const m = report.missing;

  return (
    <>
      <div className="xr-summary">
        <ul className="xr-facts" aria-label="File">{facts.map(x => <li key={x}>{x}</li>)}</ul>
        <ul className="xr-counts">
          <li data-status="pass">{STATUS_ICON.pass}{ui.counts.pass(report.counts.pass)}</li>
          <li data-status="warn">{STATUS_ICON.warn}{ui.counts.warn(report.counts.warn)}</li>
          <li data-status="fail">{STATUS_ICON.fail}{ui.counts.fail(report.counts.fail)}</li>
        </ul>
      </div>
      {!report.layoutChecked && <p className="z-small xr-note"><Info size={16} aria-hidden />{ui.layoutNote}</p>}

      <section className="xr-overall" data-status={verdictStatus} aria-labelledby="xr-overall-title">
        <p id="xr-overall-title" className="z-label">{ui.overall.title}</p>
        <p className="xr-verdict z-serif">{ui.overall.verdict[report.overall.verdict]}</p>
        <p className="z-small">{ui.overall.detail(checks, report.counts.fail, report.counts.warn)}</p>
      </section>

      <div className="xr-layout">
        <aside className="xr-film" aria-labelledby="xr-film-title">
          <div className="xr-film-head">
            <h3 id="xr-film-title" className="xr-film-title">{ui.film}</h3>
            <p className="z-micro">{ui.filmNote}</p>
            <ul className="xr-legend">
              <li data-kind="heading">{ui.legend.heading}</li>
              <li data-kind="metric">{ui.legend.metric}</li>
              <li data-kind="duty">{ui.legend.duty}</li>
              <li data-kind="contact">{ui.legend.contact}</li>
            </ul>
          </div>
          <ol className="xr-film-lines" dir="auto">
            {lines.map((l, i) => <li key={i} data-kind={l.kind} dir="auto">{l.text}</li>)}
          </ol>
          {report.film.length > FILM_LINES && (
            <button type="button" className="z-link xr-more" onClick={() => setAllLines(!allLines)}>{allLines ? ui.filmLess : ui.filmMore}</button>
          )}
        </aside>

        <div className="xr-findings">
          <section className="xr-fixes" aria-labelledby="xr-fixes-title">
            <h3 id="xr-fixes-title" className="z-h3">{ui.fixes}</h3>
            {report.fixes.length === 0 ? <p className="z-body">{ui.fixesNone}</p> : (
              <ol>
                {report.fixes.map(c => {
                  const s = say(c, lang);
                  return (
                    <li key={c.id} data-status={c.status}>
                      <span className="xr-fix-title">{s.title}</span>
                      {s.fix && <span className="xr-fix-text">{s.fix}</span>}
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          <div className="xr-duo">
            <section className="xr-mini" aria-labelledby="xr-strong-title">
              <h3 id="xr-strong-title" className="xr-mini-title"><span data-status="pass" className="xr-mini-dot" />{ui.strongest}</h3>
              {report.overall.strongest.length ? <ul>{report.overall.strongest.map(a => <li key={a}>{ui.areas[a]}</li>)}</ul> : <p className="z-small">{ui.noneYet}</p>}
            </section>
            <section className="xr-mini" aria-labelledby="xr-weak-title">
              <h3 id="xr-weak-title" className="xr-mini-title"><span data-status="fail" className="xr-mini-dot" />{ui.weakest}</h3>
              {report.overall.weakest.length ? <ul>{report.overall.weakest.map(a => <li key={a}>{ui.areas[a]}</li>)}</ul> : <p className="z-small">{ui.noneYet}</p>}
            </section>
          </div>

          <section className="xr-mini xr-missing" aria-labelledby="xr-missing-title">
            <h3 id="xr-missing-title" className="xr-mini-title"><span data-status="warn" className="xr-mini-dot" />{ui.missing.title}</h3>
            {!m || (!m.skills.length && !m.languages.length && !m.levelStep && !report.areas.some(a => a.checks.some(c => c.id === "ad-skills"))) ? (
              <p className="z-small">{ui.missing.noAd}</p>
            ) : !m.skills.length && !m.languages.length && !m.levelStep ? (
              <p className="z-small">{ui.missing.none}</p>
            ) : (
              <dl>
                {m.skills.length > 0 && <><dt>{ui.missing.skills}</dt><dd>{m.skills.map(iso).join(", ")}</dd></>}
                {m.languages.length > 0 && <><dt>{ui.missing.languages}</dt><dd>{m.languages.map(iso).join(", ")}</dd></>}
                {m.levelStep > 0 && <dd>{ui.missing.level(m.levelStep)}</dd>}
              </dl>
            )}
          </section>

          {report.areas.map((area, ai) => (
            <motion.section
              key={area.id}
              className="xr-area"
              aria-labelledby={`xr-area-${area.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06 * ai, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 id={`xr-area-${area.id}`} className="xr-area-title">
                <span className="xr-area-n">{String(ai + 1).padStart(2, "0")}</span>{ui.areas[area.id]}
              </h3>
              <ul>{area.checks.map(c => <FindingRow key={c.id} c={c} lang={lang} />)}</ul>
            </motion.section>
          ))}

          {report.improvements.length > 0 && (
            <section className="xr-fixes xr-improve" aria-labelledby="xr-more-title">
              <h3 id="xr-more-title" className="z-h3">{ui.more}</h3>
              <ul>
                {report.improvements.map(c => {
                  const s = say(c, lang);
                  return <li key={c.id} data-status={c.status}><span className="xr-fix-title">{s.title}</span>{s.fix && <span className="xr-fix-text">{s.fix}</span>}</li>;
                })}
              </ul>
            </section>
          )}

          {work.length > 0 && (
            <section className="xr-mini xr-specialist" aria-labelledby="xr-spec-title">
              <h3 id="xr-spec-title" className="xr-mini-title"><span data-status="pass" className="xr-mini-dot" />{ui.specialist.title}</h3>
              <ul>{work.map(w => <li key={w}>{ui.specialist[w]}</li>)}</ul>
            </section>
          )}

        </div>
      </div>

      <XrayNext lang={lang} wa={wa} serviceKey={report.service.key} reason={ui.reasons[report.service.reason]} />
    </>
  );
}

/** The three ways forward, in order of commitment: fix it yourself, a free human review, a package. */
export function XrayNext({ lang, wa, serviceKey, reason }: { lang: Lang; wa: string; serviceKey: "foundation" | "growth" | "apex"; reason: string }) {
  const ui = UI[lang];
  return (
    <section className="xr-next" aria-labelledby="xr-next-title">
      <h3 id="xr-next-title" className="z-h3">{ui.next.title}</h3>
      <ol className="xr-next-steps">
        <li>
          <p className="xr-next-n">1</p>
          <p className="xr-check-title">{ui.next.s1t}</p>
          <p className="z-small">{ui.next.s1d}</p>
          <a className="z-link z-small" href="#xr-fixes-title">{ui.fixes}</a>
        </li>
        <li className="xr-next-wa">
          <p className="xr-next-n">2</p>
          <p className="xr-check-title">{ui.next.s2t}</p>
          <p className="z-small">{ui.next.s2d}</p>
          <a className="z-btn z-btn-primary z-btn-small" href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden />{ui.next.s2cta}</a>
          <p className="z-micro">{ui.next.s2note}</p>
        </li>
        <li>
          <p className="xr-next-n">3</p>
          <p className="xr-check-title">{ui.next.s3t}</p>
          <p className="xr-pkg-name z-serif">{packageName(serviceKey, lang)}</p>
          <p className="z-micro">{ui.from} AED {TIERS[serviceKey].price}</p>
          <p className="z-small">{reason}</p>
          <Link className="z-btn z-btn-quiet z-btn-small" href={`/#pk-${serviceKey}`}>{ui.next.s3cta}<ArrowRight size={16} aria-hidden className="xr-flip" /></Link>
        </li>
      </ol>
    </section>
  );
}

function FindingRow({ c, lang }: { c: Finding; lang: Lang }) {
  const ui = UI[lang];
  const s = say(c, lang);
  return (
    <li className="xr-check" data-status={c.status}>
      <span className="xr-badge" data-status={c.status}>{STATUS_ICON[c.status]}{ui.status[c.status]}</span>
      <div className="xr-check-text">
        <p className="xr-check-title">{s.title}</p>
        <p className="z-small">{s.body}</p>
        {s.fix && (c.status === "warn" || c.status === "fail") && <p className="z-small xr-fix">{s.fix}</p>}
        {c.id === "duties" && Array.isArray(c.data.examples) && c.data.examples[0] && (
          <div className="xr-pattern">
            <p className="z-label">{ui.pattern.title}</p>
            <p className="z-small"><strong>{ui.pattern.yours}:</strong> <span dir="auto">“{c.data.examples[0]}”</span></p>
            <p className="z-small xr-pattern-t">{ui.pattern.template}</p>
            <p className="z-micro">{ui.pattern.example}</p>
          </div>
        )}
      </div>
    </li>
  );
}
