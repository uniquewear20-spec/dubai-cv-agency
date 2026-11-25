"use client";
// components/xray/XrayApp.tsx — the ATS CV X-Ray. The visitor drops a CV, optionally names a target role
// and pastes a job ad; the file is read and checked in this page (lib/xray), never uploaded. Results:
// what a parser sees (the "film"), findings in seven areas, the fixes to make first, and an honest
// pointer to the Zenith package that answers them, with a free human review on WhatsApp.

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowRight, Check, CircleAlert, FileText, Moon, Printer, RotateCcw, Sun, Upload, X } from "lucide-react";
import { isLang, type Lang } from "@/lib/site";
import { readCv, type ReadFailure } from "@/lib/xray/read";
import { analyzeCv, type Report } from "@/lib/xray/analyze";
import { UI } from "@/lib/xray/copy";
import { STATUS_ICON, XrayNext, XrayReport, reviewLink } from "./Report";

type Phase = "idle" | "reading" | "done";
type Outcome = { kind: "report"; report: Report } | { kind: "scanned" } | { kind: "error"; reason: Exclude<ReadFailure, "scanned"> };

const ACCEPT = ".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function XrayApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [ad, setAd] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [over, setOver] = useState(false);
  const [ref, setRef] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const ids = useId();
  const ui = UI[lang];

  useLayoutEffect(() => {
    // Browser-only preferences, read after hydration so the server and client render the same first.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.dataset.theme !== "light");
    const fromLink = new URLSearchParams(window.location.search).get("lang");
    if (isLang(fromLink)) setLang(fromLink);
    try {
      if (isLang(fromLink)) localStorage.setItem("z-lang", fromLink);
      else { const l = localStorage.getItem("z-lang"); if (isLang(l)) setLang(l); }
    } catch { /* storage blocked */ }
    // Where the visitor came from (?ref=IG from an Instagram bio, for example), passed on to WhatsApp.
    const r = new URLSearchParams(window.location.search).get("ref")?.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) ?? "";
    setRef(r);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const choose = (l: Lang) => { setLang(l); try { localStorage.setItem("z-lang", l); } catch { /* ignore */ } };
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("z-theme", next ? "dark" : "light"); } catch { /* ignore */ }
  };

  const pickFile = (f: File | null | undefined) => {
    if (!f) return;
    setFile(f);
    setOutcome(null);
    setPhase("idle");
  };

  const clearFile = () => {
    setFile(null);
    setOutcome(null);
    setPhase("idle");
    if (inputRef.current) inputRef.current.value = "";
  };

  const run = useCallback(async () => {
    if (!file || phase === "reading") return;
    setPhase("reading");
    setOutcome(null);
    setStep(0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ticker = reduce ? null : window.setInterval(() => setStep(s => Math.min(s + 1, 3)), 380);
    const started = performance.now();
    const read = await readCv(file);
    let next: Outcome;
    if (read.ok) next = { kind: "report", report: analyzeCv({ text: read.text, layout: read.layout, role, ad }) };
    else if (read.reason === "scanned") next = { kind: "scanned" };
    else next = { kind: "error", reason: read.reason };
    // Let the four steps be seen (about 1.6 s), unless the visitor prefers less motion.
    const wait = reduce ? 0 : Math.max(0, 1600 - (performance.now() - started));
    window.setTimeout(() => {
      if (ticker) window.clearInterval(ticker);
      setStep(4);
      setOutcome(next);
      setPhase("done");
      window.requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        resultsRef.current?.focus({ preventScroll: true });
      });
    }, wait);
  }, [file, phase, role, ad]);

  const again = () => {
    clearFile();
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const wa = reviewLink(null, lang, role.trim().slice(0, 80), ref);

  return (
    <MotionConfig reducedMotion="user">
      <div className="zs xr" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
        <a href="#xr-main" className="z-skip">{ui.skip}</a>
        <header className="xr-top">
          <div className="z-wrap xr-top-in">
            <Link href="/" className="xr-brand"><span className="z-serif">Zenith</span><span className="xr-brand-sub">{ui.back}</span></Link>
            <div className="xr-tools">
              <div className="xr-seg" role="group" aria-label={ui.language}>
                {(["en", "fr", "ar"] as Lang[]).map(l => (
                  <button key={l} type="button" lang={l} aria-pressed={lang === l} onClick={() => choose(l)}>{l === "ar" ? "ع" : l.toUpperCase()}</button>
                ))}
              </div>
              <button type="button" className="xr-icon" onClick={toggleTheme} aria-label={dark ? ui.theme[0] : ui.theme[1]}>
                {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
              </button>
            </div>
          </div>
        </header>

        <main id="xr-main">
          <section className="xr-hero" aria-labelledby={`${ids}-h1`}>
            <div className="z-wrap xr-hero-grid">
              <div className="xr-hero-copy">
                <p className="xr-eyebrow"><span className="xr-dot" aria-hidden />{ui.eyebrow}</p>
                <h1 id={`${ids}-h1`} className="z-h1 xr-h1">{ui.h1}</h1>
                <p className="z-lede">{ui.lede}</p>
                <ul className="xr-promise">
                  {ui.promise.map(p => <li key={p}><Check size={16} aria-hidden />{p}</li>)}
                </ul>
              </div>

              <form className="xr-box" onSubmit={e => { e.preventDefault(); void run(); }} aria-busy={phase === "reading"}>
                <div
                  className={`xr-drop${over ? " is-over" : ""}${file ? " has-file" : ""}`}
                  onDragOver={e => { e.preventDefault(); setOver(true); }}
                  onDragLeave={() => setOver(false)}
                  onDrop={e => { e.preventDefault(); setOver(false); pickFile(e.dataTransfer.files?.[0]); }}
                >
                  <div className="xr-grid" aria-hidden />
                  {phase === "reading" && <div className="xr-scan" aria-hidden />}
                  <input ref={inputRef} id={`${ids}-file`} type="file" accept={ACCEPT} className="z-sr" onChange={e => pickFile(e.target.files?.[0])} />
                  {!file ? (
                    <label htmlFor={`${ids}-file`} className="xr-drop-label">
                      <span className="xr-drop-icon"><Upload size={22} aria-hidden /></span>
                      <span className="xr-drop-title z-serif">{ui.drop}</span>
                      <span className="xr-drop-or">{ui.dropOr}</span>
                      <span className="z-micro">{ui.dropHint}</span>
                    </label>
                  ) : (
                    <div className="xr-file">
                      <span className="xr-file-icon"><FileText size={22} aria-hidden /></span>
                      <span className="xr-file-meta">
                        <span className="xr-file-name">{file.name}</span>
                        <span className="z-micro">{formatSize(file.size)}</span>
                      </span>
                      <span className="xr-file-actions">
                        <label htmlFor={`${ids}-file`} className="z-link xr-change">{ui.change}</label>
                        <button type="button" className="xr-icon xr-icon-small" onClick={clearFile} aria-label={ui.remove} disabled={phase === "reading"}><X size={16} aria-hidden /></button>
                      </span>
                    </div>
                  )}
                  {phase === "reading" && (
                    <ol className="xr-steps" aria-hidden>
                      {ui.steps.map((s, i) => <li key={s} className={i < step ? "is-done" : i === step ? "is-now" : ""}>{i < step ? <Check size={14} aria-hidden /> : <span className="xr-step-dot" />}{s}</li>)}
                    </ol>
                  )}
                </div>

                <label className="xr-field">
                  <span className="xr-field-label">{ui.role}</span>
                  <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder={ui.rolePh} maxLength={80} autoComplete="organization-title" />
                </label>

                <details className="z-details xr-ad">
                  <summary>{ui.adToggle}</summary>
                  <label className="xr-field">
                    <span className="xr-field-label">{ui.ad}</span>
                    <textarea value={ad} onChange={e => setAd(e.target.value)} placeholder={ui.adPh} rows={6} maxLength={12000} />
                  </label>
                </details>

                <button type="submit" className="z-btn z-btn-primary z-btn-block xr-run" disabled={!file || phase === "reading"}>
                  {phase === "reading" ? ui.running : ui.run}{phase !== "reading" && <ArrowRight size={18} aria-hidden className="xr-flip" />}
                </button>
                <p className="z-sr" aria-live="polite">{phase === "reading" ? ui.live.reading : phase === "done" ? ui.live.done : ""}</p>
              </form>
            </div>
          </section>

          <AnimatePresence>
            {outcome && (
              <motion.section
                key="results"
                className="xr-results"
                aria-labelledby={`${ids}-results`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="z-wrap">
                  <div className="xr-res-head">
                    <h2 id={`${ids}-results`} ref={resultsRef} tabIndex={-1} className="z-h2">{ui.results}</h2>
                    <div className="xr-res-actions">
                      {outcome.kind === "report" && <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => window.print()}><Printer size={16} aria-hidden />{ui.print}</button>}
                      <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={again}><RotateCcw size={16} aria-hidden />{ui.again}</button>
                    </div>
                  </div>

                  {outcome.kind === "error" && <p className="xr-error" role="alert"><CircleAlert size={18} aria-hidden />{ui.errors[outcome.reason]}</p>}

                  {outcome.kind === "scanned" && (
                    <div className="xr-scanned">
                      <span className="xr-badge" data-status="fail">{STATUS_ICON.fail}{ui.status.fail}</span>
                      <h3 className="z-h3">{ui.scanned.title}</h3>
                      <p className="z-body">{ui.scanned.body}</p>
                      <p className="z-body xr-fix">{ui.scanned.fix}</p>
                      <XrayNext lang={lang} wa={wa} serviceKey="foundation" reason={ui.reasons.rebuild} />
                    </div>
                  )}

                  {outcome.kind === "report" && <XrayReport report={outcome.report} lang={lang} role={role.trim().slice(0, 80)} refCode={ref} />}

                  <p className="z-micro xr-disclaimer">{ui.disclaimer}</p>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        <footer className="xr-foot">
          <div className="z-wrap xr-foot-in">
            <span className="z-micro">© Zenith Dubai CV</span>
            <span className="xr-foot-links">
              <Link className="z-link z-micro" href="/privacy/">{ui.privacy}</Link>
              <Link className="z-link z-micro" href="/terms/">{ui.terms}</Link>
            </span>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}

