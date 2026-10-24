"use client";
// components/agent/interview/Room.tsx — the interview itself. The animated interviewer speaks each
// turn (with captions), then listens: the candidate speaks (the browser turns speech into text) or
// types. Each answer goes to the server, which decides the follow-up or the next question; the
// session is saved in this browser after every turn so it can be resumed.
//
// Half duplex: the microphone is off while the interviewer speaks, so its voice is never taken for
// the candidate's. "Answer now" interrupts the interviewer.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, Mic, Pause, RotateCcw, Send, SkipForward, Square, Video, Volume2, VolumeX } from "lucide-react";
import { useAgent } from "../context";
import { Modal, Notice } from "../parts";
import Interviewer, { type AvatarMode } from "./Interviewer";
import { IV_COPY } from "@/lib/agent/interview/copy";
import { LOOKS } from "@/lib/agent/interview/looks";
import {
  Recognizer, Speaker, canListen, chooseVoice, chunks, newClock, onVoices, speechLang, voicesFor, type ListenError,
} from "@/lib/agent/interview/speech";
import { IvError, ivAnswer, ivReport, recordOf } from "@/lib/agent/interview/client";
import type { IvActive, IvRecord, IvState } from "@/lib/agent/interview/types";

type Phase = "speaking" | "await" | "listening" | "paused" | "sending" | "thinking" | "error" | "finishing";

const sleep = (ms: number) => new Promise(r => window.setTimeout(r, ms));
const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function Elapsed({ since }: { since: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(t); }, []);
  const s = Math.max(0, Math.floor((now - Date.parse(since)) / 1000));
  return <span className="za-iv-time" aria-hidden>{Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}</span>;
}

/** The candidate's camera, shown only on this screen: never recorded or sent. */
function SelfView({ label, failed }: { label: string; failed: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const onFail = useRef(failed);
  useEffect(() => { onFail.current = failed; });
  useEffect(() => {
    let stream: MediaStream | null = null;
    let stopped = false;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "user", width: { ideal: 480 } }, audio: false })
      .then(s => {
        if (stopped) { s.getTracks().forEach(t => t.stop()); return; }
        stream = s;
        if (ref.current) { ref.current.srcObject = s; void ref.current.play().catch(() => undefined); }
      })
      .catch(() => onFail.current());
    return () => { stopped = true; stream?.getTracks().forEach(t => t.stop()); };
  }, []);
  return <video ref={ref} className="za-iv-self" muted playsInline aria-label={label} />;
}

export default function Room({ active, onSave, onFinish, onDiscard }: {
  active: IvActive;
  onSave: (a: IvActive) => void;
  onFinish: (r: IvRecord) => void;
  onDiscard: () => void;
}) {
  const { lang, access } = useAgent();
  const c = IV_COPY[lang];
  const reduced = useReducedMotion();
  const ivLang = active.state.setup.lang;
  const tag = speechLang(ivLang);

  const [st, setSt] = useState<IvState>(active.state);
  const [phase, setPhase] = useState<Phase>("speaking");
  const [mode, setMode] = useState<"voice" | "text">(active.mode === "voice" && canListen() ? "voice" : "text");
  const [muted, setMuted] = useState(!active.voiceURI);
  const [draft, setDraft] = useState("");
  const [interim, setInterim] = useState("");
  const [notice, setNotice] = useState<string | null>(active.mode === "voice" && !canListen() ? c.setup.speech.none : null);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [piece, setPiece] = useState(-1);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [nod, setNod] = useState(0);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [camera, setCamera] = useState(active.camera);
  const [cameraFailed, setCameraFailed] = useState(false);

  const [clock] = useState(newClock);
  const speaker = useRef<Speaker | null>(null);
  const rec = useRef<Recognizer | null>(null);
  const stRef = useRef(st);
  const modeRef = useRef(mode);
  const mutedRef = useRef(muted);
  const phaseRef = useRef(phase);
  const retry = useRef<null | (() => void)>(null);
  const alive = useRef(true);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const listenStart = useRef(0);
  const graceUntil = useRef(0);
  useEffect(() => { stRef.current = st; }, [st]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const persist = useCallback((state: IvState) => {
    stRef.current = state;
    setSt(state);
    onSave({ ...active, state, mode: modeRef.current, camera, savedAt: new Date().toISOString() });
  }, [active, camera, onSave]);

  // The voice chosen in the setup; if the browser no longer has it (another device, an update), the
  // voice that best matches the interviewer's look, never just the first voice.
  const voice = useCallback((): SpeechSynthesisVoice | null => {
    if (mutedRef.current || !active.voiceURI) return null;
    return voicesFor(ivLang).find(v => v.voiceURI === active.voiceURI) ?? chooseVoice(ivLang, LOOKS[active.look].presentation).voice;
  }, [active.voiceURI, active.look, ivLang]);

  // ── Listening ──
  const stopListening = useCallback(() => {
    rec.current?.abort();
    rec.current = null;
    setCountdown(null);
  }, []);

  const listenFailed = useCallback(async (e: ListenError, tapped: boolean) => {
    rec.current = null;
    setCountdown(null);
    if (e === "denied" && !tapped) {
      // Some browsers refuse to start listening without a tap even when the microphone is allowed:
      // then the candidate starts it with the button instead.
      const perm = await navigator.permissions?.query({ name: "microphone" as PermissionName }).catch(() => null);
      if (perm && perm.state !== "denied") { setPhase("await"); return; }
    }
    setMode("text");
    setNotice(e === "denied" ? c.room.micDenied : e === "no-mic" ? c.room.micMissing : c.room.speechFailed);
    setPhase("await");
    window.setTimeout(() => textRef.current?.focus(), 50);
  }, [c]);

  const startListening = useCallback((keep?: string, tapped = false) => {
    if (!canListen()) { void listenFailed("failed", tapped); return; }
    stopListening();
    setNotice(null);
    const r = new Recognizer(tag, {
      onText: (fin, int) => {
        if (!alive.current) return;
        setDraft(fin);
        setInterim(int);
        setCountdown(null);
        setNod(n => n + 1);
      },
      onError: e => { if (alive.current) void listenFailed(e, tapped); },
    }, active.local);
    rec.current = r;
    listenStart.current = performance.now();
    if (keep) { r.resume(keep); } else { setDraft(""); setInterim(""); r.start(); }
    setPhase("listening");
  }, [active.local, listenFailed, stopListening, tag]);

  // ── Speaking ──
  const afterSpeaking = useRef<() => void>(() => undefined);

  const speak = useCallback(async (text: string) => {
    stopListening();
    setCaption(text);
    setPiece(0);
    setPhase("speaking");
    const sp = speaker.current ?? (speaker.current = new Speaker(clock));
    const outcome = await sp.say(text, voice(), tag, i => setPiece(i), LOOKS[active.look].presentation);
    if (outcome === "done" && alive.current) afterSpeaking.current();
  }, [clock, stopListening, tag, voice]);

  // ── Finishing ──
  const finish = useCallback(async (state: IvState, early: boolean) => {
    stopListening();
    speaker.current?.stop();
    setPhase("finishing");
    setError(null);
    if (!access) return;
    try {
      const { state: done, report } = await ivReport(access, state, lang, early);
      if (!alive.current) return;
      onFinish(recordOf(done, report, active.look, modeRef.current));
    } catch (e) {
      if (!alive.current) return;
      setError(e instanceof IvError && c.errors[e.code] ? c.errors[e.code] : c.room.netError);
      retry.current = () => void finish(state, early);
      setPhase("error");
    }
  }, [access, active.look, c, lang, onFinish, stopListening]);

  afterSpeaking.current = () => {
    const state = stRef.current;
    if (state.done) { void finish(state, false); return; }
    if (modeRef.current === "voice") startListening();
    else { setPhase("await"); window.setTimeout(() => textRef.current?.focus(), 50); }
  };

  // ── Answering ──
  const send = useCallback(async (text: string, how: "voice" | "text", seconds: number, skip = false) => {
    if (!access) return;
    stopListening();
    speaker.current?.stop();
    setPhase("sending");
    setError(null);
    setNotice(null);
    const t0 = performance.now();
    try {
      const { state } = await ivAnswer(access, stRef.current, { text, mode: how, ...(seconds >= 1 ? { speechSec: seconds } : {}), ...(skip ? { skip: true } : {}) });
      if (!alive.current) return;
      setPhase("thinking");
      const wait = 700 - (performance.now() - t0);
      if (wait > 0) await sleep(wait);
      if (!alive.current) return;
      persist(state);
      setDraft("");
      setInterim("");
      const last = state.turns[state.turns.length - 1];
      if (last && last.by === "interviewer") void speak(last.text);
      else if (state.done) void finish(state, false);
    } catch (e) {
      if (!alive.current) return;
      setDraft(text);
      setError(e instanceof IvError && c.errors[e.code] ? c.errors[e.code] : c.room.netError);
      retry.current = () => void send(text, how, seconds, skip);
      setPhase("error");
    }
  }, [access, c, finish, persist, speak, stopListening]);

  const doneSpeaking = () => {
    const r = rec.current;
    const heard = r ? r.stop() : { text: [draft, interim].filter(Boolean).join(" "), seconds: 0 };
    rec.current = null;
    setCountdown(null);
    if (!heard.text.trim()) { setNotice(c.room.noSpeech); setDraft(""); setPhase("paused"); return; }
    void send(heard.text, "voice", heard.seconds);
  };

  const pauseSpeaking = () => {
    const r = rec.current;
    const heard = r ? r.stop() : { text: draft, seconds: 0 };
    rec.current = null;
    setCountdown(null);
    setDraft(heard.text);
    setInterim("");
    setPhase("paused");
    window.setTimeout(() => textRef.current?.focus(), 50);
  };

  const sendTyped = () => {
    const text = draft.trim();
    if (!text) return;
    void send(text, phase === "paused" && mode === "voice" ? "voice" : "text", 0);
  };

  const answerNow = () => {
    speaker.current?.stop();
    if (modeRef.current === "voice") startListening(undefined, true);
    else { setPhase("await"); window.setTimeout(() => textRef.current?.focus(), 50); }
  };

  const lastInterviewer = () => [...stRef.current.turns].reverse().find(t => t.by === "interviewer")?.text ?? "";

  // Speak what's pending when the room opens: the introduction and first question, or the last turn.
  useEffect(() => {
    alive.current = true;
    let cancelled = false;
    const state = stRef.current;
    const answered = state.turns.some(t => t.by === "candidate");
    const text = answered ? lastInterviewer() : state.turns.filter(t => t.by === "interviewer").map(t => t.text).join(" ");
    const go = () => {
      if (cancelled) return;
      if (state.done) void finish(state, false);
      else void speak(text);
    };
    // Voices load asynchronously in some browsers: wait for them briefly.
    if (active.voiceURI && !voicesFor(ivLang).length) {
      const t = window.setTimeout(go, 1500);
      const off = onVoices(() => { if (voicesFor(ivLang).length) { window.clearTimeout(t); off(); go(); } });
      return () => { cancelled = true; window.clearTimeout(t); off(); };
    }
    const t = window.setTimeout(go, 350);
    return () => { cancelled = true; window.clearTimeout(t); };
    // Runs once per room.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => {
    alive.current = false;
    speaker.current?.stop();
    rec.current?.abort();
  }, []);

  // Long silence after a real answer: offer to send it, with a few seconds to keep talking.
  useEffect(() => {
    if (phase !== "listening") return;
    const t = window.setInterval(() => {
      const r = rec.current;
      if (!r) return;
      const words = wordCount(`${draft} ${interim}`);
      const quiet = performance.now() - (r.heardAt || listenStart.current);
      if (!r.heardAt && quiet > 9000) setNotice(c.room.noSpeech);
      setCountdown(cur => {
        if (words >= 12 && quiet > 6000 && performance.now() > graceUntil.current) return cur === null ? 3 : cur - 1;
        return null;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [phase, draft, interim, c]);

  useEffect(() => {
    if (countdown !== null && countdown <= 0 && phaseRef.current === "listening") doneSpeaking();
    // doneSpeaking reads the latest state when it runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const switchMode = () => {
    if (mode === "voice") {
      const r = rec.current;
      const heard = r ? r.stop() : null;
      rec.current = null;
      setCountdown(null);
      if (heard?.text) setDraft(heard.text);
      setMode("text");
      if (phaseRef.current === "listening") setPhase("await");
      window.setTimeout(() => textRef.current?.focus(), 50);
    } else {
      if (!canListen()) { setNotice(c.setup.speech.none); return; }
      setMode("voice");
      if (phaseRef.current === "await" || phaseRef.current === "paused") startListening(draft.trim() || undefined, true);
    }
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    if (next && phaseRef.current === "speaking") {
      speaker.current?.stop();
      afterSpeaking.current();
    }
  };

  const endNow = () => {
    setConfirmEnd(false);
    const answered = stRef.current.turns.some(t => t.by === "candidate" && t.kind === "answer");
    stopListening();
    speaker.current?.stop();
    if (!answered) { onDiscard(); return; }
    void finish(stRef.current, true);
  };

  // ── What's on screen ──
  const plan = st.plan;
  const mains = plan.filter(q => q.kind !== "closing").length;
  const q = plan[Math.min(st.step, plan.length - 1)];
  const lastTurn = [...st.turns].reverse().find(t => t.by === "interviewer");
  const stepLabel = q?.kind === "closing" ? c.room.closing : c.room.progress(Math.min(st.step + 1, mains), mains);
  const isFollow = lastTurn?.kind === "followup";
  const avatarMode: AvatarMode = phase === "speaking" ? "speaking" : phase === "listening" ? "listening"
    : phase === "sending" || phase === "thinking" || phase === "finishing" ? "thinking" : "idle";
  const status = phase === "speaking" ? c.room.speaking : phase === "listening" ? c.room.listening
    : phase === "sending" || phase === "thinking" ? c.room.thinking : phase === "finishing" ? c.room.finishing : c.room.yourTurn;
  const pieces = chunks(caption);
  const persona = `${c.room.persona[st.setup.type]} · ${c.looks[active.look]}`;
  const progress = Math.min(1, (Math.min(st.step, mains) + (st.done ? 1 : 0)) / Math.max(1, mains));
  const busy = phase === "sending" || phase === "thinking" || phase === "finishing";

  return (
    <div className="za-iv-room" data-phase={phase}>
      <div className="za-iv-bar">
        <p className="za-iv-step"><strong>{stepLabel}</strong>{isFollow && phase !== "finishing" && <span className="za-iv-tag">{c.room.followup}</span>}</p>
        <span className="za-iv-progress" role="progressbar" aria-label={stepLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <i style={{ width: `${progress * 100}%` }} />
        </span>
        <Elapsed since={st.startedAt} />
        <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => setConfirmEnd(true)} disabled={phase === "finishing"}>
          <Square size={14} aria-hidden /> {c.room.end}
        </button>
      </div>

      <div className="za-iv-grid">
        <div className="za-iv-main">
          <section className="za-iv-stage" aria-label={persona}>
            <p className="za-iv-persona">{persona}</p>
            <Interviewer look={active.look} mode={avatarMode} clock={clock} nod={nod} reduced={reduced} label={c.room.label} className="za-iv-avatar" zoom />
            <p className="za-iv-label">{c.room.label}</p>
            <p className="za-iv-status" aria-hidden><span className="za-dot" data-on={phase === "listening"} /> {status}</p>
            {camera && !cameraFailed && <SelfView label={c.room.selfView} failed={() => setCameraFailed(true)} />}
            <div className="za-iv-stage-tools">
              <button type="button" className="za-icon-btn" onClick={toggleMute} aria-pressed={!muted} aria-label={muted ? c.room.unmute : c.room.mute} disabled={!active.voiceURI}>
                {muted ? <VolumeX size={17} aria-hidden /> : <Volume2 size={17} aria-hidden />}
              </button>
              <button type="button" className="za-icon-btn" onClick={() => setCamera(v => !v)} aria-pressed={camera} aria-label={c.setup.camera}>
                <Video size={17} aria-hidden />
              </button>
            </div>
          </section>

          <div className="za-iv-captions" aria-live="polite" aria-label={c.room.captions}>
            {pieces.length ? pieces.map((p, i) => <span key={i} data-now={phase === "speaking" && i === piece ? "true" : undefined}>{p.text}</span>) : <span>{lastTurn?.text}</span>}
          </div>

          {cameraFailed && camera && <Notice tone="warn">{c.room.cameraDenied}</Notice>}
          {notice && <Notice tone="warn">{notice}</Notice>}
          {error && (
            <Notice tone="error">
              {error}{" "}
              <button type="button" className="za-textlink" onClick={() => { const r = retry.current; retry.current = null; r?.(); }}>{c.room.retry}</button>
            </Notice>
          )}

          <section className="za-iv-answer" aria-label={c.room.yourTurn}>
            {mode === "voice" && phase === "listening" ? (
              <>
                <div className="za-iv-heard" aria-live="off">
                  <p className="za-label-sm">{c.room.heard}</p>
                  <p>{draft}{interim && <em> {interim}</em>}{!draft && !interim && <span className="za-muted">…</span>}</p>
                </div>
                <div className="za-iv-controls">
                  <button type="button" className="z-btn z-btn-primary za-iv-mic" data-live="true" onClick={doneSpeaking}>
                    <Send size={16} aria-hidden /> {c.room.done}
                  </button>
                  <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={pauseSpeaking}><Pause size={14} aria-hidden /> {c.room.pause}</button>
                  {countdown !== null && countdown > 0 && (
                    <p className="za-iv-auto" role="status">
                      {c.room.autoSend(countdown)}{" "}
                      <button type="button" className="za-textlink" onClick={() => { setCountdown(null); graceUntil.current = performance.now() + 9000; }}>{c.room.keepTalking}</button>
                    </p>
                  )}
                </div>
              </>
            ) : mode === "voice" && phase !== "paused" ? (
              <div className="za-iv-controls">
                <button type="button" className="z-btn z-btn-primary za-iv-mic" onClick={answerNow} disabled={busy || phase === "error"}>
                  <Mic size={16} aria-hidden /> {c.room.start}
                </button>
              </div>
            ) : (
              <>
                <label className="z-sr" htmlFor="za-iv-text">{c.room.typeHere}</label>
                <textarea
                  id="za-iv-text"
                  ref={textRef}
                  className="za-textarea za-iv-text"
                  value={draft}
                  placeholder={c.room.typeHere}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); sendTyped(); } }}
                  onFocus={() => { if (phaseRef.current === "speaking") answerNow(); }}
                  disabled={busy}
                  maxLength={4000}
                  dir="auto"
                />
                <div className="za-iv-controls">
                  <button type="button" className="z-btn z-btn-primary" onClick={sendTyped} disabled={busy || !draft.trim()}>
                    <Send size={16} aria-hidden /> {c.room.send}
                  </button>
                  {mode === "voice" && phase === "paused" && (
                    <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => startListening(draft.trim() || undefined, true)}><Mic size={14} aria-hidden /> {c.room.resume}</button>
                  )}
                  <span className="za-hint">{c.room.sendHint}</span>
                </div>
              </>
            )}
            <div className="za-iv-secondary">
              <button type="button" className="za-textlink" onClick={() => void speak(lastInterviewer())} disabled={busy || phase === "listening"}><RotateCcw size={14} aria-hidden /> {c.room.repeat}</button>
              <button type="button" className="za-textlink" onClick={() => void send("", modeRef.current, 0, true)} disabled={busy || q?.kind === "closing" && phase === "speaking"}><SkipForward size={14} aria-hidden /> {c.room.skip}</button>
              <button type="button" className="za-textlink" onClick={switchMode} disabled={busy}>
                {mode === "voice" ? <><Keyboard size={14} aria-hidden /> {c.room.switchToText}</> : <><Mic size={14} aria-hidden /> {c.room.switchToVoice}</>}
              </button>
            </div>
          </section>
        </div>

        <aside className="za-iv-log" aria-label={c.room.transcript}>
          <h2 className="za-h3">{c.room.transcript}</h2>
          <ol>
            {st.turns.map((t, i) => (
              <li key={i} data-by={t.by} data-kind={t.kind}>
                <span className="za-iv-who">{t.by === "interviewer" ? c.room.persona[st.setup.type] : c.room.you}</span>
                <p dir="auto">{t.kind === "skip" ? <em>{c.report.skipped}</em> : t.text}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <Modal open={confirmEnd} onClose={() => setConfirmEnd(false)} title={c.room.endH} closeLabel={c.room.keepGoing}>
        <p className="za-body-text">{c.room.endBody}</p>
        <div className="za-actions">
          <button type="button" className="z-btn z-btn-quiet" onClick={() => setConfirmEnd(false)}>{c.room.keepGoing}</button>
          <button type="button" className="z-btn z-btn-primary" onClick={endNow}>{c.room.endConfirm}</button>
        </div>
      </Modal>
    </div>
  );
}
