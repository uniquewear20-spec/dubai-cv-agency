"use client";
// components/agent/interview/InterviewView.tsx — the interview coach (#interview, #interview=<jobId>):
// set up, interview, report and progress. Included in packages 2–4: the server checks the purchase on
// every call; without it, this screen explains the coach, lets the visitor hear the animated
// interviewer and shows where to enter a proof of purchase.

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Square } from "lucide-react";
import { AgentContext, useAgent } from "../context";
import type { Access } from "@/lib/agent/types";
import AccessPanel from "../AccessPanel";
import Interviewer from "./Interviewer";
import Room, { useReducedMotion } from "./Room";
import Setup, { type StartOptions } from "./Setup";
import Report from "./Report";
import HistoryView from "./History";
import { IV_COPY } from "@/lib/agent/interview/copy";
import { delKV, getKV, setKV } from "@/lib/agent/store";
import { IvError, MAX_RECORDS, candidateOf, defaultPrefs, historyOf, isRecord, ivStart } from "@/lib/agent/interview/client";
import { Speaker, newClock, speechLang } from "@/lib/agent/interview/speech";
import { LOOKS, LOOK_IDS, type LookId } from "@/lib/agent/interview/looks";
import { VoiceNote, useLookVoice } from "./voice";
import type { IvActive, IvPrefs, IvRecord, IvSetup } from "@/lib/agent/interview/types";
import ShareButton from "../ShareButton";

type Screen = { kind: "setup"; preset?: { role?: string; jobId?: string | null } } | { kind: "room" } | { kind: "report"; id: string; from?: "history" } | { kind: "history" };

/**
 * The coach without a purchase: what it is, the three interviewers to choose from, and a short line
 * spoken with the voice that best matches the chosen look.
 */
function Locked() {
  const { lang, pkg } = useAgent();
  const c = IV_COPY[lang];
  const reduced = useReducedMotion();
  const [clock] = useState(newClock);
  const speaker = useRef<Speaker | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [look, setLook] = useState<LookId>("amal");
  const lv = useLookVoice(lang, look);
  useEffect(() => () => speaker.current?.stop(), []);
  const stop = () => { speaker.current?.stop(); setSpeaking(false); };
  const play = async () => {
    const sp = speaker.current ?? (speaker.current = new Speaker(clock));
    if (speaking) { stop(); return; }
    setSpeaking(true);
    await sp.say(c.locked.previewLine, lv.voice, speechLang(lang), undefined, LOOKS[look].presentation);
    setSpeaking(false);
  };
  const pick = (l: LookId) => { stop(); setLook(l); };
  return (
    <div className="za-stack">
      <header className="za-iv-head">
        <div>
          <h1 className="za-h1">{c.locked.h}</h1>
          <p className="za-lede">{c.locked.body(pkg.coach)}</p>
        </div>
        <ShareButton page="coach" lang={lang} />
      </header>
      <section className="za-iv-preview">
        <div className="za-iv-stage za-iv-stage-sm">
          <Interviewer key={look} look={look} mode={speaking ? "speaking" : "idle"} clock={clock} nod={0} reduced={reduced} label={`${c.looks[look]}: ${c.room.label}`} className="za-iv-avatar" />
          <p className="za-iv-label">{c.room.label}</p>
        </div>
        <div className="za-iv-preview-text">
          <fieldset className="za-iv-fieldset za-iv-pick">
            <legend>{c.locked.chooseLook}</legend>
            <div className="za-iv-looks za-iv-looks-sm">
              {LOOK_IDS.map(l => (
                <label key={l} className="za-iv-look">
                  <input type="radio" name="za-iv-preview-look" checked={look === l} onChange={() => pick(l)} />
                  <span className="za-iv-look-pic"><Interviewer look={l} mode="idle" clock={clock} nod={0} reduced still label={`${c.looks[l]}: ${c.room.label}`} /></span>
                  <span className="za-iv-look-name">{c.looks[l]}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <button type="button" className="z-btn z-btn-quiet" onClick={() => void play()} aria-pressed={speaking}>
            {speaking ? <Square size={15} aria-hidden /> : <Play size={15} aria-hidden />} {speaking ? c.locked.previewing : c.locked.preview}
          </button>
          <VoiceNote c={c} look={look} lv={lv} onLook={pick} />
          <p className="za-iv-captions za-iv-captions-sm" dir="auto">{c.locked.previewLine}</p>
          <p className="za-hint">{c.locked.previewNote}{lv.voices.length ? "" : ` ${c.setup.voiceMissing}`}</p>
          <p><Link href="/#packages" className="za-textlink">{c.locked.packages}</Link></p>
        </div>
      </section>
      <AccessPanel />
    </div>
  );
}

const TRIAL: Record<string, { btn: string; note: string; left: (m: string) => string; ready: string; over: string }> = {
  en: { btn: "Try a free 30-minute interview", note: "One free interview with the animated interviewer, about your role. No purchase needed. The 30 minutes start with the interview and keep running if you pause or visit other pages.", left: m => `Free interview: ${m} left`, ready: "Free interview: 30 minutes, starting with your first question", over: "Your free 30 minutes are over." },
  fr: { btn: "Essayer un entretien gratuit de 30 minutes", note: "Un entretien gratuit avec le recruteur animé, sur votre poste. Sans achat. Les 30 minutes commencent avec l'entretien et continuent si vous faites une pause ou visitez d'autres pages.", left: m => `Entretien gratuit : il reste ${m}`, ready: "Entretien gratuit : 30 minutes, à partir de la première question", over: "Vos 30 minutes gratuites sont écoulées." },
  ar: { btn: "جرّب مقابلة مجانية لمدة 30 دقيقة", note: "مقابلة مجانية واحدة مع المحاوِر المتحرك حول وظيفتك، دون شراء. تبدأ الدقائق الثلاثون مع بدء المقابلة وتستمر حتى لو توقفت مؤقتاً أو انتقلت إلى صفحات أخرى.", left: m => `المقابلة المجانية: متبقٍ ${m}`, ready: "المقابلة المجانية: 30 دقيقة تبدأ مع أول سؤال", over: "انتهت دقائقك الثلاثون المجانية." },
};
const TRIAL_KEY = "z-iv-trial";
const TRIAL_MS = 30 * 60_000;
interface TrialSave { proof: string; startedAt: number | null }
function readTrial(): TrialSave | null {
  try {
    const t = JSON.parse(localStorage.getItem(TRIAL_KEY) || "null") as TrialSave | null;
    return t?.proof ? t : null;
  } catch { return null; }
}
function saveTrial(t: TrialSave) { try { localStorage.setItem(TRIAL_KEY, JSON.stringify(t)); } catch { /* memory only */ } }
/** The clock starts with the interview (the first question), once. */
function markTrialStart() { const t = readTrial(); if (t && !t.startedAt) saveTrial({ ...t, startedAt: Date.now() }); }

/** The free interview's clock: it keeps running while paused or on other pages. */
function TrialClock({ lang }: { lang: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const i = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(i); }, []);
  const copy = TRIAL[lang] ?? TRIAL.en;
  const t = readTrial();
  if (!t?.startedAt) return <p className="za-iv-clock" role="status">{copy.ready}</p>;
  const left = Math.max(0, TRIAL_MS - (now - t.startedAt));
  if (!left) return <p className="za-iv-clock" role="status" data-over="true">{copy.over}</p>;
  const m = `${Math.floor(left / 60000)}:${String(Math.floor((left % 60000) / 1000)).padStart(2, "0")}`;
  return <p className="za-iv-clock" role="timer" aria-live="off">{copy.left(m)}</p>;
}

export default function InterviewView({ jobId }: { jobId: string | null }) {
  const agent = useAgent();
  // A free interview survives pauses and visits to other pages (kept in this browser).
  const [trial, setTrial] = useState<TrialSave | null>(() => (typeof window === "undefined" ? null : readTrial()));
  if (trial && !agent.access) {
    const access = { kind: "trial", proof: trial.proof, plan: null, coach: true } as Access;
    return (
      <AgentContext.Provider value={{ ...agent, access }}>
        <TrialClock lang={agent.lang} />
        <CoachScreens jobId={jobId} />
      </AgentContext.Provider>
    );
  }
  return <CoachScreens jobId={jobId} onTrial={() => { const t = { proof: crypto.randomUUID(), startedAt: null }; saveTrial(t); setTrial(t); }} />;
}

function CoachScreens({ jobId, onTrial }: { jobId: string | null; onTrial?: () => void }) {
  const { lang, access, profile } = useAgent();
  const c = IV_COPY[lang];
  const coach = Boolean(access?.coach || access?.plan);
  const [loaded, setLoaded] = useState(false);
  const [records, setRecords] = useState<IvRecord[]>([]);
  const [active, setActive] = useState<IvActive | null>(null);
  const [prefs, setPrefs] = useState<IvPrefs>(() => defaultPrefs(lang));
  const [screen, setScreen] = useState<Screen>({ kind: "setup", preset: jobId ? { jobId } : undefined });

  useEffect(() => {
    let off = false;
    (async () => {
      const [r, a, p] = await Promise.all([getKV("interviews"), getKV("interview-active"), getKV("interview-prefs")]);
      if (off) return;
      setRecords(Array.isArray(r) ? r.filter(isRecord) : []);
      setActive(a && a.state && Array.isArray(a.state.turns) ? a : null);
      if (p) setPrefs(cur => ({ ...cur, ...p, voices: { ...cur.voices, ...(p.voices ?? {}) } }));
      setLoaded(true);
    })();
    return () => { off = true; };
  }, []);

  const top = () => window.scrollTo({ top: 0 });

  const saveRecords = useCallback(async (next: IvRecord[]) => {
    setRecords(next);
    await setKV("interviews", next.slice(0, MAX_RECORDS));
  }, []);

  const saveActive = useCallback(async (a: IvActive | null) => {
    setActive(a);
    if (a) await setKV("interview-active", a);
    else await delKV("interview-active");
  }, []);

  const savePrefs = useCallback((p: IvPrefs) => {
    setPrefs(p);
    void setKV("interview-prefs", p);
  }, []);

  const start = useCallback(async (setup: IvSetup, o: StartOptions): Promise<string | null> => {
    if (!access) return c.errors["not-eligible"];
    try {
      const { state } = await ivStart(access, setup, candidateOf(profile), historyOf(records, setup));
      if (access?.kind === "trial") markTrialStart();
      await saveActive({ state, look: o.look, voiceURI: o.voiceURI, mode: o.mode, camera: o.camera, local: o.local, savedAt: new Date().toISOString() });
      setScreen({ kind: "room" });
      top();
      return null;
    } catch (e) {
      return e instanceof IvError ? c.errors[e.code] ?? c.errors.unavailable : c.errors.unavailable;
    }
  }, [access, c, profile, records, saveActive]);

  const finished = useCallback(async (record: IvRecord) => {
    await saveRecords([record, ...records.filter(r => r.id !== record.id)]);
    await saveActive(null);
    setScreen({ kind: "report", id: record.id });
    top();
  }, [records, saveActive, saveRecords]);

  if (!loaded) return <p className="za-loading">{c.setup.starting}</p>;

  if (screen.kind === "report") {
    const rec = records.find(r => r.id === screen.id);
    if (rec) {
      return (
        <Report
          record={rec}
          onBack={screen.from === "history" ? () => { setScreen({ kind: "history" }); top(); } : undefined}
          onAgain={() => { setScreen({ kind: "setup", preset: { role: rec.role, jobId: rec.jobId } }); top(); }}
          onNew={() => { setScreen({ kind: "setup" }); top(); }}
          onHistory={() => { setScreen({ kind: "history" }); top(); }}
          onDelete={() => { void saveRecords(records.filter(r => r.id !== rec.id)); setScreen({ kind: "history" }); top(); }}
        />
      );
    }
  }

  if (screen.kind === "history" || (!coach && screen.kind === "report")) {
    return (
      <HistoryView
        records={records}
        onOpen={id => { setScreen({ kind: "report", id, from: "history" }); top(); }}
        onDelete={id => void saveRecords(records.filter(r => r.id !== id))}
        onDeleteAll={() => void saveRecords([])}
        onBack={() => { setScreen({ kind: "setup" }); top(); }}
      />
    );
  }

  if (!coach) {
    return (
      <>
        <Locked />
        {onTrial && (
          <div className="za-panel za-iv-trial">
            <p>{(TRIAL[lang] ?? TRIAL.en).note}</p>
            <button type="button" className="z-btn z-btn-primary" onClick={onTrial}>{(TRIAL[lang] ?? TRIAL.en).btn}</button>
          </div>
        )}
        {records.length > 0 && (
          <p className="za-iv-past"><button type="button" className="za-textlink" onClick={() => setScreen({ kind: "history" })}>{c.setup.progressLink(records.length)}</button></p>
        )}
      </>
    );
  }

  if (screen.kind === "room" && active) {
    return (
      <Room
        key={active.state.id}
        active={active}
        onSave={a => void saveActive(a)}
        onFinish={r => void finished(r)}
        onDiscard={() => { void saveActive(null); setScreen({ kind: "setup" }); top(); }}
      />
    );
  }

  return (
    <Setup
      key={`${screen.kind === "setup" ? JSON.stringify(screen.preset ?? {}) : ""}`}
      prefs={prefs}
      onPrefs={savePrefs}
      preset={screen.kind === "setup" ? screen.preset ?? null : null}
      onStart={start}
      records={records.length}
      onHistory={() => { setScreen({ kind: "history" }); top(); }}
      active={active}
      onResume={() => { setScreen({ kind: "room" }); top(); }}
      onDiscard={() => void saveActive(null)}
    />
  );
}
