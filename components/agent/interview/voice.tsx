"use client";
// components/agent/interview/voice.tsx — the interviewer's voice for a look: the browser's voices for
// the language, the one chosen for this look (or the best match), and a note when the browser has
// no voice that sounds like the look, or doesn't say how a voice sounds.

import React, { useEffect, useState } from "react";
import { LOOKS, otherLook, type LookId } from "@/lib/agent/interview/looks";
import { chooseVoice, matchOf, onVoices, shortVoiceName, voiceGender, voiceWorks, voicesFor, type VoiceChoice } from "@/lib/agent/interview/speech";
import type { IvCopy } from "@/lib/agent/interview/copy";
import type { IvLang } from "@/lib/agent/interview/types";
import type { Lang } from "@/components/agent/context";

/** Keeps a Latin name in its own direction inside Arabic text (and the reverse). */
const iso = (s: string) => `\u2068${s}\u2069`;

/** The key a voice choice is kept under: one per language and look, so changing either never keeps the old voice. */
export const voiceKey = (lang: IvLang, look: LookId) => `${lang}:${look}`;

export interface LookVoice {
  voices: SpeechSynthesisVoice[];
  voice: SpeechSynthesisVoice | null;
  match: VoiceChoice["match"];
  /** True when the voice is the candidate's own choice rather than the best match. */
  own?: boolean;
  /** When the candidate chose a voice that doesn't sound like the look: the best voice that does, if the browser has one. */
  better?: SpeechSynthesisVoice | null;
}

/**
 * The voice for a look: the candidate's own choice for this language and look when the browser
 * still has it (`chosen` null means "no voice"), otherwise the voice that best matches the look.
 */
export function useLookVoice(lang: IvLang, look: LookId, chosen?: string | null): LookVoice {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    let off = false;
    const load = () => {
      const list = voicesFor(lang);
      setVoices(list);
      // Arabic on a Mac: set aside voices that are listed but not installed, then list again.
      if (lang === "ar") Promise.all(list.map(voiceWorks)).then(() => { if (!off) setVoices(voicesFor(lang)); });
    };
    load();
    const stop = onVoices(load);
    return () => { off = true; stop(); };
  }, [lang]);
  const presentation = LOOKS[look].presentation;
  if (chosen === null) return { voices, voice: null, match: "none" };
  const own = chosen ? voices.find(v => v.voiceURI === chosen) ?? null : null;
  if (own) {
    const match = matchOf(own, presentation);
    const best = match === "yes" ? null : chooseVoice(lang, presentation, voices);
    return { voices, voice: own, match, own: true, better: best?.match === "yes" ? best.voice : null };
  }
  return { voices, ...chooseVoice(lang, presentation, voices) };
}

/** The voices in a list, the ones that sound like the look first. */
export function voiceOptions(voices: SpeechSynthesisVoice[], look: LookId): SpeechSynthesisVoice[] {
  const p = LOOKS[look].presentation;
  const rank = (v: SpeechSynthesisVoice) => { const g = voiceGender(v); return g === p ? 0 : g === "unknown" ? 1 : 2; };
  return [...voices].sort((a, b) => rank(a) - rank(b));
}

/**
 * What the browser's voice means for this look, with a way to show the look that matches the voice
 * and, when the candidate chose a voice that doesn't suit the look, to go back to one that does.
 */
export function VoiceNote({ c, look, lv, onLook, onBetter }: { c: IvCopy; look: LookId; lv: LookVoice; onLook: (l: LookId) => void; onBetter?: () => void }) {
  if (!lv.voice || lv.match === "yes" || lv.match === "none") return null;
  const name = c.looks[look];
  const voice = iso(shortVoiceName(lv.voice));
  if (lv.match === "unknown") return <p className="za-hint za-iv-voice-note" role="status">{c.setup.voiceUnknown(voice, name)}</p>;
  const other = otherLook(look);
  const kind = LOOKS[look].presentation;
  return (
    <p className="za-iv-voice-note" role="status">
      {lv.own && lv.better ? c.setup.voiceChosen(name, voice, kind) : c.setup.voiceMismatch(name, voice, kind)}{" "}
      <span className="za-iv-inline-actions">
        {lv.own && lv.better && onBetter && <button type="button" className="za-textlink" onClick={onBetter}>{c.setup.useVoice(iso(shortVoiceName(lv.better)))}</button>}
        <button type="button" className="za-textlink" onClick={() => onLook(other)}>{c.setup.matchLook(c.looks[other])}</button>
      </span>
    </p>
  );
}

/** The country a voice's accent comes from ("ar-AE" → United Arab Emirates), in the page's language. */
function voiceRegion(v: SpeechSynthesisVoice, ui: Lang): string | null {
  const region = v.lang.replace("_", "-").split("-")[1];
  if (!region || !/^[A-Za-z]{2}$/.test(region)) return null;
  try {
    return new Intl.DisplayNames([ui], { type: "region" }).of(region.toUpperCase()) ?? null;
  } catch {
    return null;
  }
}

/** A voice as an option: its name, its accent's country, how it sounds, and where it runs. */
export function voiceLabel(c: IvCopy, v: SpeechSynthesisVoice, ui: Lang): string {
  const g = voiceGender(v);
  const region = voiceRegion(v, ui);
  return [iso(shortVoiceName(v)), region, g === "unknown" ? c.setup.voiceKinds.unknown : c.setup.voiceKinds[g], v.localService ? c.setup.voiceLocal : c.setup.voiceOnline]
    .filter(Boolean).join(" · ");
}
