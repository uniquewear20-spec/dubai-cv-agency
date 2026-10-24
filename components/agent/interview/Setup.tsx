"use client";
// components/agent/interview/Setup.tsx — choosing the interview: the role (or a saved job), the
// kind of interview, how demanding, how long, the language, the animated interviewer and its voice,
// and how the candidate answers, with what happens to their speech said plainly.

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { History, Mic, Play, Square } from "lucide-react";
import { useAgent } from "../context";
import { Notice, fmtDate } from "../parts";
import Interviewer from "./Interviewer";
import { useReducedMotion } from "./Room";
import { IV_COPY } from "@/lib/agent/interview/copy";
import { LOOK_IDS, type LookId } from "@/lib/agent/interview/looks";
import { Speaker, canListen, canSpeak, installOnDevice, newClock, onDeviceStatus, speechLang } from "@/lib/agent/interview/speech";
import { VoiceNote, useLookVoice, voiceKey, voiceLabel, voiceOptions } from "./voice";
import { suggestType } from "@/lib/agent/interview/client";
import { IV_DIFFICULTIES, IV_TYPES } from "@/lib/agent/interview/types";
import type { IvActive, IvLang, IvPrefs, IvSetup } from "@/lib/agent/interview/types";

type SpeechNote = "cloud" | "local" | "downloadable" | "downloading" | "none" | "denied";

export interface StartOptions { look: LookId; voiceURI: string | null; mode: "voice" | "text"; camera: boolean; local: boolean }

export default function Setup({ prefs, onPrefs, preset, onStart, records, onHistory, active, onResume, onDiscard }: {
  prefs: IvPrefs;
  onPrefs: (p: IvPrefs) => void;
  preset: { role?: string; jobId?: string | null } | null;
  onStart: (setup: IvSetup, opts: StartOptions) => Promise<string | null>;
  records: number;
  onHistory: () => void;
  active: IvActive | null;
  onResume: () => void;
  onDiscard: () => void;
}) {
  const { lang, profile, apps } = useAgent();
  const c = IV_COPY[lang];
  const id = useId();
  const reduced = useReducedMotion();
  const jobs = useMemo(() => apps.filter(a => a.status !== "rejected" && a.status !== "withdrawn"), [apps]);
  const [jobId, setJobId] = useState<string>(preset?.jobId && jobs.some(a => a.jobId === preset.jobId) ? preset.jobId : "");
  const presetJob = jobs.find(a => a.jobId === jobId)?.job;
  const [role, setRole] = useState(preset?.role || presetJob?.title || profile.roles[0] || "");
  const [typeTouched, setTypeTouched] = useState(false);
  const [p, setP] = useState<IvPrefs>(() => ({ ...prefs, type: typeTouched ? prefs.type : suggestType(preset?.role || presetJob?.title || profile.roles[0] || "") }));
  // This screen only renders in the browser (the agent loads its data first), so checking the API here is safe.
  const [note, setNote] = useState<SpeechNote>(() => (canListen() ? "cloud" : "none"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [clock] = useState(newClock);
  const speaker = useRef<Speaker | null>(null);
  const ivLang = p.lang;
  const tag = speechLang(ivLang);

  const update = (patch: Partial<IvPrefs>) => setP(cur => {
    const next = { ...cur, ...patch };
    onPrefs(next);
    return next;
  });

  // The voice for this language and look: the candidate's choice for them, or the voice that best
  // matches the look (voices load asynchronously in some browsers). Changing the language or the
  // look never keeps the previous voice.
  const lv = useLookVoice(ivLang, p.look, p.voices[voiceKey(ivLang, p.look)]);
  const voices = lv.voices;
  const voiceURI = lv.voice?.voiceURI ?? null;

  // What happens to the candidate's speech in this browser, for this language.
  useEffect(() => {
    if (!canListen()) return;
    let off = false;
    (async () => {
      const perm = await navigator.permissions?.query({ name: "microphone" as PermissionName }).catch(() => null);
      if (off) return;
      if (perm?.state === "denied") { setNote("denied"); return; }
      const s = await onDeviceStatus(tag);
      if (off) return;
      setNote(s === "available" ? "local" : s === "downloadable" ? "downloadable" : s === "downloading" ? "downloading" : "cloud");
    })();
    return () => { off = true; };
  }, [tag]);

  useEffect(() => () => speaker.current?.stop(), []);

  const install = async () => {
    setNote("downloading");
    await installOnDevice(tag);
    const s = await onDeviceStatus(tag);
    setNote(s === "available" ? "local" : s === "downloading" ? "downloading" : "cloud");
  };

  const test = async () => {
    const sp = speaker.current ?? (speaker.current = new Speaker(clock));
    if (testing) { sp.stop(); setTesting(false); return; }
    const v = lv.voice;
    setTesting(true);
    await sp.say(IV_COPY[ivLang].locked.previewLine, v, tag);
    setTesting(false);
  };

  const pickJob = (v: string) => {
    setJobId(v);
    const job = jobs.find(a => a.jobId === v)?.job;
    if (job) {
      setRole(job.title);
      if (!typeTouched) update({ type: suggestType(job.title) });
    }
  };

  const start = async () => {
    if (role.trim().length < 2) { setError(c.setup.needRole); return; }
    setError(null);
    // iOS and some browsers only allow speech after a tap: say nothing now, inside the tap.
    if (canSpeak() && voiceURI) {
      try { window.speechSynthesis.speak(new SpeechSynthesisUtterance("")); } catch { /* ignore */ }
    }
    speaker.current?.stop();
    setTesting(false);
    const mode = p.mode === "voice" && note !== "none" && note !== "denied" ? "voice" : "text";
    if (mode === "voice") {
      // Ask for the microphone now, while the candidate is tapping, rather than mid-interview.
      try {
        const s = await navigator.mediaDevices?.getUserMedia({ audio: true });
        s?.getTracks().forEach(t => t.stop());
      } catch {
        /* the room explains and offers typing */
      }
    }
    const job = jobs.find(a => a.jobId === jobId)?.job;
    const setup: IvSetup = {
      lang: ivLang, type: p.type, difficulty: p.difficulty, length: p.length, role: role.trim().slice(0, 120),
      job: job ? { id: job.id, title: job.title, company: job.company, location: job.location, description: job.description.slice(0, 8000) } : null,
    };
    setBusy(true);
    const err = await onStart(setup, { look: p.look, voiceURI, mode, camera: p.camera, local: note === "local" });
    setBusy(false);
    if (err) setError(err);
  };

  const speechText = note === "none" ? c.setup.speech.none : note === "denied" ? c.setup.speech.denied : note === "local" ? c.setup.speech.local
    : note === "downloadable" ? `${c.setup.speech.downloadable} ${c.setup.speech.cloud}` : c.setup.speech.cloud;

  return (
    <div className="za-stack">
      <header className="za-iv-head">
        <div>
          <h1 className="za-h1">{c.h}</h1>
          <p className="za-lede">{c.lede}</p>
        </div>
        {records > 0 && (
          <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={onHistory}><History size={15} aria-hidden /> {c.setup.progressLink(records)}</button>
        )}
      </header>

      {active && (
        <Notice tone="info">
          {c.setup.resume(fmtDate(active.savedAt, lang))}{" "}
          <span className="za-iv-inline-actions">
            <button type="button" className="za-textlink" onClick={onResume}>{c.setup.resumeBtn}</button>
            <button type="button" className="za-textlink" onClick={onDiscard}>{c.setup.discard}</button>
          </span>
        </Notice>
      )}

      <section className="za-panel za-iv-setup" aria-labelledby={`${id}-h`}>
        <h2 id={`${id}-h`} className="za-h2">{c.setup.h}</h2>

        <div className="za-grid-2">
          <div className="za-field">
            <label htmlFor={`${id}-role`}>{c.setup.role}</label>
            <input id={`${id}-role`} className="za-input" value={role} maxLength={120} dir="auto"
              onChange={e => { setRole(e.target.value); if (!typeTouched) update({ type: suggestType(e.target.value) }); }}
              aria-describedby={`${id}-role-hint`} />
            <p id={`${id}-role-hint`} className="za-hint">{c.setup.roleHint}</p>
          </div>
          <div className="za-field">
            <label htmlFor={`${id}-job`}>{c.setup.job}</label>
            <select id={`${id}-job`} className="za-select za-iv-select" value={jobId} onChange={e => pickJob(e.target.value)} aria-describedby={`${id}-job-hint`}>
              <option value="">{c.setup.jobNone}</option>
              {jobs.map(a => <option key={a.jobId} value={a.jobId}>{a.job.title}{a.job.company ? ` · ${a.job.company}` : ""}</option>)}
            </select>
            <p id={`${id}-job-hint`} className="za-hint">{c.setup.jobHint}</p>
          </div>
        </div>

        <fieldset className="za-iv-fieldset">
          <legend>{c.setup.type}</legend>
          <div className="za-iv-choices za-iv-choices-5">
            {IV_TYPES.map(t => (
              <label key={t} className="za-iv-choice">
                <input type="radio" name={`${id}-type`} checked={p.type === t} onChange={() => { setTypeTouched(true); update({ type: t }); }} />
                <span><strong>{c.setup.types[t].name}</strong><small>{c.setup.types[t].desc}</small></span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="za-grid-2">
          <fieldset className="za-iv-fieldset">
            <legend>{c.setup.difficulty}</legend>
            <div className="za-iv-choices">
              {IV_DIFFICULTIES.map(d => (
                <label key={d} className="za-iv-choice">
                  <input type="radio" name={`${id}-diff`} checked={p.difficulty === d} onChange={() => update({ difficulty: d })} />
                  <span><strong>{c.setup.difficulties[d].name}</strong><small>{c.setup.difficulties[d].desc}</small></span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <fieldset className="za-iv-fieldset">
              <legend>{c.setup.length}</legend>
              <div className="za-iv-choices">
                {([5, 8] as const).map(n => (
                  <label key={n} className="za-iv-choice za-iv-choice-row">
                    <input type="radio" name={`${id}-len`} checked={p.length === n} onChange={() => update({ length: n })} />
                    <span><strong>{c.setup.lengths[n]}</strong></span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="za-field za-iv-lang">
              <label htmlFor={`${id}-lang`}>{c.setup.lang}</label>
              <select id={`${id}-lang`} className="za-select za-iv-select" value={ivLang} onChange={e => { speaker.current?.stop(); setTesting(false); update({ lang: e.target.value as IvLang }); }}>
                {(["en", "fr", "ar"] as const).map(l => <option key={l} value={l}>{c.setup.langs[l]}</option>)}
              </select>
            </div>
          </div>
        </div>

        <fieldset className="za-iv-fieldset">
          <legend>{c.setup.look}</legend>
          <div className="za-iv-looks">
            {LOOK_IDS.map(l => (
              <label key={l} className="za-iv-look">
                <input type="radio" name={`${id}-look`} checked={p.look === l} onChange={() => { speaker.current?.stop(); setTesting(false); update({ look: l }); }} />
                <span className="za-iv-look-pic">
                  {p.look === l
                    ? <Interviewer look={l} mode={testing ? "speaking" : "idle"} clock={clock} nod={0} reduced={reduced} label={`${c.looks[l]}: ${c.room.label}`} />
                    : <Interviewer look={l} mode="idle" clock={clock} nod={0} reduced still label={`${c.looks[l]}: ${c.room.label}`} />}
                </span>
                <span className="za-iv-look-name">{c.looks[l]}</span>
              </label>
            ))}
          </div>
          <p className="za-hint">{c.room.label}.</p>
        </fieldset>

        <div className="za-grid-2">
          <div className="za-field">
            <label htmlFor={`${id}-voice`}>{c.setup.voice}</label>
            <div className="za-inline">
              <select id={`${id}-voice`} className="za-select za-iv-select" value={voiceURI ?? ""}
                onChange={e => { speaker.current?.stop(); setTesting(false); update({ voices: { ...p.voices, [voiceKey(ivLang, p.look)]: e.target.value || null } }); }}>
                {voiceOptions(voices, p.look).map(v => <option key={v.voiceURI} value={v.voiceURI}>{voiceLabel(c, v, lang)}</option>)}
                <option value="">{c.setup.voiceNone}</option>
              </select>
              <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => void test()} disabled={!voiceURI} aria-pressed={testing}>
                {testing ? <Square size={14} aria-hidden /> : <Play size={14} aria-hidden />} {c.setup.voiceTest}
              </button>
            </div>
            {!voices.length && <p className="za-hint">{c.setup.voiceMissing}</p>}
            <VoiceNote c={c} look={p.look} lv={lv} onLook={l => { speaker.current?.stop(); setTesting(false); update({ look: l }); }}
              onBetter={() => { speaker.current?.stop(); setTesting(false); const rest = { ...p.voices }; delete rest[voiceKey(ivLang, p.look)]; update({ voices: rest }); }} />
            {voices.length > 0 && <p className="za-hint">{c.setup.voiceTip}</p>}
          </div>
          <fieldset className="za-iv-fieldset">
            <legend>{c.setup.mode}</legend>
            <div className="za-iv-choices za-iv-choices-row">
              {(["voice", "text"] as const).map(m => (
                <label key={m} className="za-iv-choice za-iv-choice-row">
                  <input type="radio" name={`${id}-mode`} checked={(note === "none" ? "text" : p.mode) === m} disabled={m === "voice" && note === "none"} onChange={() => update({ mode: m })} />
                  <span><strong>{c.setup.modes[m]}</strong></span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {(p.mode === "voice" || note === "none") && (
          <div className="za-iv-speech">
            <Mic size={16} aria-hidden />
            <p>
              {speechText}
              {note === "downloadable" && (
                <>{" "}<button type="button" className="za-textlink" onClick={() => void install()}>{c.setup.speech.download}</button></>
              )}
              {note === "downloading" && <> {c.setup.speech.downloading}</>}
            </p>
          </div>
        )}

        <label className="za-check za-iv-camera">
          <input type="checkbox" checked={p.camera} onChange={e => update({ camera: e.target.checked })} />
          <span>{c.setup.camera}<small className="za-hint">{c.setup.cameraHint}</small></span>
        </label>

        <p className="za-hint">{c.setup.profileNote}</p>
        {error && <Notice tone="error">{error}</Notice>}
        <div className="za-actions">
          <button type="button" className="z-btn z-btn-primary" onClick={() => void start()} disabled={busy}>{busy ? c.setup.starting : c.setup.start}</button>
        </div>
      </section>
    </div>
  );
}
