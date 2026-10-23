"use client";
// components/agent/interview/InterviewView.tsx — the interview coach (#interview, #interview=<jobId>):
// set up, interview, report and progress. Included in packages 2–4: the server checks the purchase on
// every call; without it, this screen explains the coach, lets the visitor hear the animated
// interviewer and shows where to enter a proof of purchase.

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Square } from "lucide-react";
import { useAgent } from "../context";
import AccessPanel from "../AccessPanel";
import Interviewer from "./Interviewer";
import Room, { useReducedMotion } from "./Room";
import Setup, { type StartOptions } from "./Setup";
import Report from "./Report";
import HistoryView from "./History";
import { IV_COPY } from "@/lib/agent/interview/copy";
import { delKV, getKV, setKV } from "@/lib/agent/store";
import { IvError, MAX_RECORDS, candidateOf, defaultPrefs, historyOf, isRecord, ivStart } from "@/lib/agent/interview/client";
import { Speaker, newClock, onVoices, speechLang, voicesFor } from "@/lib/agent/interview/speech";
import type { IvActive, IvPrefs, IvRecord, IvSetup } from "@/lib/agent/interview/types";

type Screen = { kind: "setup"; preset?: { role?: string; jobId?: string | null } } | { kind: "room" } | { kind: "report"; id: string; from?: "history" } | { kind: "history" };

function Locked() {
  const { lang, pkg } = useAgent();
  const c = IV_COPY[lang];
  const reduced = useReducedMotion();
  const [clock] = useState(newClock);
  const speaker = useRef<Speaker | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);
  useEffect(() => onVoices(() => setHasVoice(voicesFor(lang).length > 0)), [lang]);
  useEffect(() => () => speaker.current?.stop(), []);
  const play = async () => {
    const sp = speaker.current ?? (speaker.current = new Speaker(clock));
    if (speaking) { sp.stop(); setSpeaking(false); return; }
    setSpeaking(true);
    await sp.say(c.locked.previewLine, voicesFor(lang)[0] ?? null, speechLang(lang));
    setSpeaking(false);
  };
  return (
    <div className="za-stack">
      <header>
        <h1 className="za-h1">{c.locked.h}</h1>
        <p className="za-lede">{c.locked.body(pkg.coach)}</p>
      </header>
      <section className="za-iv-preview">
        <div className="za-iv-stage za-iv-stage-sm">
          <Interviewer look="amal" mode={speaking ? "speaking" : "idle"} clock={clock} nod={0} reduced={reduced} label={c.room.label} className="za-iv-avatar" />
          <p className="za-iv-label">{c.room.label}</p>
        </div>
        <div className="za-iv-preview-text">
          <button type="button" className="z-btn z-btn-quiet" onClick={() => void play()} aria-pressed={speaking}>
            {speaking ? <Square size={15} aria-hidden /> : <Play size={15} aria-hidden />} {speaking ? c.locked.previewing : c.locked.preview}
          </button>
          <p className="za-iv-captions za-iv-captions-sm" dir="auto">{c.locked.previewLine}</p>
          <p className="za-hint">{c.locked.previewNote}{hasVoice ? "" : ` ${c.setup.voiceMissing}`}</p>
          <p><Link href="/#packages" className="za-textlink">{c.locked.packages}</Link></p>
        </div>
      </section>
      <AccessPanel />
    </div>
  );
}

export default function InterviewView({ jobId }: { jobId: string | null }) {
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
