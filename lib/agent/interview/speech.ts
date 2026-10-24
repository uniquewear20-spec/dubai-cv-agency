// lib/agent/interview/speech.ts — browser only. The interview room's voice and ears, built on the
// browser's own Web Speech API (no paid service):
//
//   Speaker     the interviewer's voice (speechSynthesis), in sentence-sized pieces because some
//               browsers cut long utterances short. It keeps a clock of where the speech is, from
//               the browser's word-boundary events where they exist and from a measured speaking
//               rate otherwise, so the animated mouth can follow it.
//   Recognizer  the candidate's answers (SpeechRecognition), continuous, restarted when the
//               browser ends a session on its own, with the time spoken for the speaking pace.
//
// In most browsers speech recognition runs on the browser maker's servers; on-device recognition
// is used when the browser offers it for the language (see onDeviceStatus).

export interface VoiceClock {
  /** Everything being said in this turn. */
  text: string;
  speaking: boolean;
  /** Character index reached at `baseAt` (ms, performance.now()). */
  base: number;
  baseAt: number;
  /** Where the current piece ends: the clock doesn't run past it. */
  end: number;
  /** Estimated characters per second for this voice. */
  cps: number;
}

export const newClock = (): VoiceClock => ({ text: "", speaking: false, base: 0, baseAt: 0, end: 0, cps: 14 });

/** Where the speech is now, as a character index, or -1 when silent. */
export function clockPosition(c: VoiceClock, now: number): number {
  if (!c.speaking) return -1;
  return Math.min(c.end, c.base + ((now - c.baseAt) / 1000) * c.cps);
}

/** BCP 47 tags for the interview languages. English follows the browser's own English when it has one. */
export function speechLang(lang: "en" | "fr" | "ar"): string {
  if (lang === "fr") return "fr-FR";
  if (lang === "ar") return "ar-AE";
  const nav = typeof navigator !== "undefined" ? navigator.language : "";
  return /^en-[A-Z]{2}$/i.test(nav) ? nav : "en-GB";
}

/** Sentence-sized pieces of at most ~180 characters, with their offsets in the full text. */
export function chunks(text: string): { at: number; text: string }[] {
  const out: { at: number; text: string }[] = [];
  const re = /[^.!?؟…]+[.!?؟…]*\s*/gu;
  let cur = "";
  let curAt = 0;
  for (const m of text.matchAll(re)) {
    const piece = m[0];
    if (cur && cur.length + piece.length > 180) {
      out.push({ at: curAt, text: cur });
      cur = "";
    }
    if (!cur) curAt = m.index!;
    cur += piece;
  }
  if (cur.trim()) out.push({ at: curAt, text: cur });
  // A single sentence longer than 180 characters is split at a comma or a space.
  return out.flatMap(c => {
    if (c.text.length <= 220) return [c];
    const parts: { at: number; text: string }[] = [];
    let rest = c.text;
    let at = c.at;
    while (rest.length > 220) {
      const cut = Math.max(rest.lastIndexOf(", ", 180), rest.lastIndexOf("، ", 180), rest.lastIndexOf(" ", 180));
      const n = cut > 40 ? cut + 1 : 180;
      parts.push({ at, text: rest.slice(0, n) });
      at += n;
      rest = rest.slice(n);
    }
    parts.push({ at, text: rest });
    return parts;
  });
}

// ── The interviewer's voice ──────────────────────────────────────────────────

export const canSpeak = (): boolean => typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

// ── Choosing a voice ─────────────────────────────────────────────────────────
// Browsers don't say whether a voice sounds female or male, or how natural it is. These lists name
// the voices the main platforms ship (Windows, Edge's natural voices, macOS and iOS, Chrome on
// desktop and Android), from the voice list of the Readium Speech project (BSD-3-Clause), so the
// interviewer's voice can match the look the candidate chose. A voice that isn't listed is
// "unknown": it can still be used, and the candidate is told.

export type Presentation = "female" | "male";
export type VoiceGender = Presentation | "unknown";

const FEMALE = new Set(("amina laila salma rana sana noura layla iman mouna aysha amal zariyah amany reem fatima maryam mariam hoda " +
  "emma emmamultilingual ava avamultilingual jenny aria michelle ana sonia libby maisie natasha hayley clara heather neerja emily leah yan asilia molly ezinne " +
  "rosa luna imani zoe allison nicky samantha joelle kate stephanie serena martha matilda karen catherine tara isha sangeeta veena moira tessa fiona zira " +
  "hazel susan linda heera victoria vivienne viviennemultilingual denise charline ariane eloise sylvie audrey aurelie marie aude chantal amelie julie " +
  "hortence hortense caroline").split(" "));
const MALE = new Set(("ismael ali shakir bassel taim fahed rami omar jamal abdullah moaz hamed laith hedi hamdan saleh tarik majed maged naayf " +
  "andrew andrewmultilingual brian brianmultilingual guy eric steffan christopher roger ryan thomas william liam prabhat connor luke sam chilemba mitchell " +
  "abeo james wayne elimu evan nathan tom alex aaron jamie oliver daniel arthur lee gordon aman rishi david mark george richard ravi sean remy " +
  "remymultilingual henri gerard fabrice antoine jean thierry nicolas paul claude jacques").split(" "));
/** Google's numbered natural voices (Android, ChromeOS): which numbers are female. */
const GOOGLE_NUMBERED_FEMALE: Record<string, number[]> = { "us english": [1, 2, 5, 7], "uk english": [2, 4, 6], "australian english": [1, 3], "francais": [1, 2, 4] };
/** Google's Android voice codes ("ar-xa-x-arc-network"). */
const ANDROID_FEMALE = /-x-(arc|arz|sfg|ena|enc|caa|cac)-/;
const ANDROID_MALE = /-x-(ard|are|end|ene|cab|cad)-/;
/** Novelty voices (macOS): not for an interview. */
const NOVELTY = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|pipe organ|superstar|trinoids|whisper|wobble|zarvox|deranged|hysterical|junior|ralph|fred|kathy|princess|grandma|grandpa|rocko|shelley|flo|eddy|reed|sandy)\b/;

const plain = (s: string) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Whether a voice sounds female or male, when its name tells; "unknown" otherwise. */
export function voiceGender(v: Pick<SpeechSynthesisVoice, "name" | "voiceURI">): VoiceGender {
  const name = plain(v.name);
  const uri = plain(v.voiceURI ?? "");
  if (/\bfemale\b|\bfeminine\b|\bfemme\b|انثوي|أنثوي/.test(name)) return "female";
  if (/\bmale\b|\bmasculine\b|\bhomme\b|ذكر/.test(name)) return "male";
  if (ANDROID_FEMALE.test(name) || ANDROID_FEMALE.test(uri)) return "female";
  if (ANDROID_MALE.test(name) || ANDROID_MALE.test(uri)) return "male";
  const google = name.match(/^google (us english|uk english|australian english|francais)(?: (\d))?/);
  if (google) {
    if (!google[2]) return "female"; // "Google US English", "Google français": female voices
    return GOOGLE_NUMBERED_FEMALE[google[1]].includes(Number(google[2])) ? "female" : "male";
  }
  const words = name.replace(/^microsoft /, "").split(/[^a-z]+/).filter(Boolean);
  if (words.some(w => FEMALE.has(w))) return "female";
  if (words.some(w => MALE.has(w))) return "male";
  return "unknown";
}

/**
 * A voice's name as people would say it: "Microsoft Fatima Online (Natural) - Arabic (United Arab
 * Emirates)" becomes "Fatima". Apple and Google names are already short and stay as they are.
 */
export function shortVoiceName(v: Pick<SpeechSynthesisVoice, "name">): string {
  const n = v.name.trim()
    .replace(/^Microsoft\s+/i, "")
    .replace(/\s+-\s+[^-]+$/, "")
    .replace(/\s+Online\s*\(Natural\)/i, "")
    .trim();
  return n || v.name;
}

/** How natural a voice sounds, 0 (robotic) … 3 (natural), from what its name says. */
export function voiceQuality(v: Pick<SpeechSynthesisVoice, "name" | "voiceURI" | "localService">): number {
  const n = plain(`${v.name} ${v.voiceURI ?? ""}`);
  if (/espeak|compact/.test(n)) return 0;
  if (/natural|neural|multilingual|premium/.test(n)) return 3;
  if (/enhanced|^google |-network|siri/.test(n)) return 2;
  return 1;
}

/** Regional voices preferred for each interview language (Gulf Arabic first, the browser's own English). */
function regionBonus(v: SpeechSynthesisVoice, lang: "en" | "fr" | "ar"): number {
  const tag = v.lang.toLowerCase().replace("_", "-");
  if (lang === "ar") return /-(ae)$/.test(tag) ? 8 : /-(sa)$/.test(tag) ? 7 : /-(qa|kw|bh|om)$/.test(tag) ? 6 : /-(jo|eg|lb|ma)$/.test(tag) ? 4 : 2;
  if (lang === "fr") return /-fr$/.test(tag) ? 6 : /-(be|ch)$/.test(tag) ? 4 : 2;
  const nav = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "";
  return tag === nav ? 6 : /-(gb|us)$/.test(tag) ? 4 : 2;
}

// ── Voices that are listed but not installed ─────────────────────────────────
// A Mac can list a voice (Arabic "Majed") whose speech data isn't downloaded: Chrome then races
// through the text and only punctuation is heard. On a Mac, each Arabic voice is tried once,
// silently, and a voice that "reads" a sentence far faster than speech is set aside, so the
// interviewer's words are shown as captions instead.
const broken = new Set<string>();
const probed = new Map<string, Promise<boolean>>();
const isMac = () => typeof navigator !== "undefined" && /Macintosh/.test(navigator.userAgent) && (navigator.maxTouchPoints ?? 0) === 0;

/** Whether a voice really speaks (true), tried once per page on a Mac; other devices aren't tried. */
export function voiceWorks(v: SpeechSynthesisVoice): Promise<boolean> {
  if (!canSpeak() || !isMac() || !/^ar/i.test(v.lang)) return Promise.resolve(true);
  const known = probed.get(v.voiceURI);
  if (known) return known;
  const p = new Promise<boolean>(resolve => {
    const u = new SpeechSynthesisUtterance("مرحباً، وشكراً جزيلاً على وقتك اليوم في هذه المقابلة.");
    u.voice = v;
    u.lang = utteranceLang(v, "ar-AE");
    u.volume = 0;
    const t0 = performance.now();
    let settled = false;
    const finish = (ok: boolean) => { if (settled) return; settled = true; if (!ok) broken.add(v.voiceURI); resolve(ok); };
    // Nine words take about three seconds to say; a voice without its speech data ends in about one.
    u.onend = () => finish(performance.now() - t0 > 1700);
    u.onerror = () => finish(false);
    window.setTimeout(() => { window.speechSynthesis.cancel(); finish(true); }, 6000);
    window.speechSynthesis.speak(u);
  });
  probed.set(v.voiceURI, p);
  return p;
}

/** Voices for a language, most natural first, novelty voices left out. Voices load asynchronously in some browsers. */
export function voicesFor(lang: "en" | "fr" | "ar"): SpeechSynthesisVoice[] {
  if (!canSpeak()) return [];
  const all = window.speechSynthesis.getVoices();
  return all
    .filter(v => v.lang.toLowerCase().replace("_", "-").startsWith(lang) && !NOVELTY.test(plain(v.name)) && !broken.has(v.voiceURI))
    .sort((a, b) => voiceQuality(b) - voiceQuality(a) || regionBonus(b, lang) - regionBonus(a, lang) || Number(b.localService) - Number(a.localService)
      || Number(b.default) - Number(a.default) || a.name.localeCompare(b.name));
}

export interface VoiceChoice {
  voice: SpeechSynthesisVoice | null;
  /** "yes" the voice matches the look, "unknown" its name doesn't say, "no" only the other kind of voice exists. */
  match: "yes" | "unknown" | "no" | "none";
}

/**
 * The best voice for a look in a language: one that sounds like the look (female or male), then the
 * most natural, then the regional one; a voice whose kind is unknown before the other kind.
 */
export function chooseVoice(lang: "en" | "fr" | "ar", presentation: Presentation, voices = voicesFor(lang)): VoiceChoice {
  if (!voices.length) return { voice: null, match: "none" };
  const score = (v: SpeechSynthesisVoice) => {
    const g = voiceGender(v);
    return (g === presentation ? 100 : g === "unknown" ? 45 : 0) + voiceQuality(v) * 10 + regionBonus(v, lang) + (v.localService ? 2 : 0) + (v.default ? 1 : 0);
  };
  const best = [...voices].sort((a, b) => score(b) - score(a) || Number(/jacques/i.test(b.name)) - Number(/jacques/i.test(a.name)))[0];
  return { voice: best, match: matchOf(best, presentation) };
}

/** How a given voice fits a look. */
export function matchOf(v: SpeechSynthesisVoice | null, presentation: Presentation): VoiceChoice["match"] {
  if (!v) return "none";
  const g = voiceGender(v);
  return g === presentation ? "yes" : g === "unknown" ? "unknown" : "no";
}

/**
 * The language tag to speak with: the voice's own when it is a plain language-region tag ("fr-CA"),
 * otherwise the interview's. Chrome on macOS cancels speech tagged "ar-001" (the tag of the Mac's
 * Arabic voice, Majed), so a numeric region is never passed on.
 */
export function utteranceLang(voice: Pick<SpeechSynthesisVoice, "lang"> | null | undefined, fallback: string): string {
  const l = voice?.lang?.replace("_", "-") ?? "";
  return /^[a-z]{2,3}-[a-z]{2}$/i.test(l) ? l : fallback;
}

/** Speaking rate per language: a little slower than the engines' default, which sounds rushed in an interview. */
export const speechRate = (lang: string): number => (/^ar/i.test(lang) ? 1.12 : /^fr/i.test(lang) ? 0.9 : 0.97);

/** Calls back when the list of voices is (re)loaded; returns an unsubscribe function. */
export function onVoices(cb: () => void): () => void {
  if (!canSpeak()) return () => undefined;
  const synth = window.speechSynthesis;
  const handler = () => cb();
  // Safari doesn't support addEventListener on speechSynthesis in every version.
  if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", handler);
  else synth.onvoiceschanged = handler;
  let tries = 0;
  const poll = window.setInterval(() => { tries++; if (synth.getVoices().length || tries > 12) { window.clearInterval(poll); cb(); } }, 250);
  return () => {
    window.clearInterval(poll);
    if (typeof synth.removeEventListener === "function") synth.removeEventListener("voiceschanged", handler);
    else if (synth.onvoiceschanged === handler) synth.onvoiceschanged = null;
  };
}

export class Speaker {
  private token = 0;
  constructor(public clock: VoiceClock) {}

  /**
   * Says `text` with `voice` (or silently at the measured pace when there is no voice, so the
   * captions and the mouth still follow). Resolves when finished or interrupted.
   */
  say(text: string, voice: SpeechSynthesisVoice | null, lang: string, onPiece?: (index: number) => void, presentation?: Presentation): Promise<"done" | "stopped"> {
    this.stop();
    const token = ++this.token;
    const clock = this.clock;
    clock.text = text;
    clock.base = 0;
    clock.baseAt = performance.now();
    clock.end = 0;
    const pieces = chunks(text);
    const live = () => token === this.token;

    const silent = (piece: { at: number; text: string }) => new Promise<void>(resolve => {
      clock.speaking = true;
      clock.base = piece.at;
      clock.baseAt = performance.now();
      clock.end = piece.at + piece.text.length;
      const ms = Math.max(600, (piece.text.length / clock.cps) * 1000);
      window.setTimeout(resolve, ms);
    });

    const spoken = (piece: { at: number; text: string }) => new Promise<void>(resolve => {
      const u = new SpeechSynthesisUtterance(piece.text);
      if (voice) u.voice = voice;
      u.lang = utteranceLang(voice, lang);
      u.rate = speechRate(u.lang);
      // A woman interviewer with only a man's voice on the device (an Arabic Mac has only Majed):
      // a higher pitch is the closest the free voices allow.
      u.pitch = presentation === "female" && voice && voiceGender(voice) !== "female" ? 2 : 1;
      let started = 0;
      let finished = false;
      const done = () => { if (finished) return; finished = true; window.clearTimeout(guard); resolve(); };
      // A guard for browsers that never fire "end" (or fire nothing at all).
      const guard = window.setTimeout(done, Math.max(4000, (piece.text.length / 7) * 1000));
      u.onstart = () => {
        if (!live()) return;
        started = performance.now();
        clock.speaking = true;
        clock.base = piece.at;
        clock.baseAt = started;
        clock.end = piece.at + piece.text.length;
      };
      u.onboundary = e => {
        if (!live() || (e.name && e.name !== "word")) return;
        clock.base = piece.at + e.charIndex;
        clock.baseAt = performance.now();
      };
      u.onend = () => {
        if (live() && started) {
          const secs = (performance.now() - started) / 1000;
          // Learn this voice's pace from whole pieces, for browsers without boundary events.
          if (secs > 0.8 && piece.text.length > 20) clock.cps = Math.min(30, Math.max(7, clock.cps * 0.5 + (piece.text.length / secs) * 0.5));
        }
        done();
      };
      u.onerror = () => done();
      window.speechSynthesis.speak(u);
      // Chrome can leave the queue paused after a cancel.
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    });

    return (async () => {
      for (const [i, piece] of pieces.entries()) {
        if (!live()) return "stopped" as const;
        onPiece?.(i);
        if (voice && canSpeak() && !broken.has(voice.voiceURI) && (await voiceWorks(voice))) await spoken(piece);
        else await silent(piece);
        clock.speaking = false;
        if (!live()) return "stopped" as const;
        // A breath between sentences, a little longer after a question.
        await new Promise(r => window.setTimeout(r, /[?؟]\s*$/.test(piece.text) ? 320 : 220));
      }
      clock.speaking = false;
      return live() ? ("done" as const) : ("stopped" as const);
    })();
  }

  stop(): void {
    this.token++;
    this.clock.speaking = false;
    if (canSpeak()) window.speechSynthesis.cancel();
  }
}

// ── The candidate's answers ──────────────────────────────────────────────────

type RecognitionCtor = new () => SpeechRecognitionLike;
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  processLocally?: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface RecognitionStatic {
  available?: (o: { langs: string[]; processLocally: boolean }) => Promise<string>;
  install?: (o: { langs: string[]; processLocally: boolean }) => Promise<boolean>;
}

function recognitionCtor(): (RecognitionCtor & RecognitionStatic) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor & RecognitionStatic; webkitSpeechRecognition?: RecognitionCtor & RecognitionStatic };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const canListen = (): boolean => recognitionCtor() !== null;

/** Whether this browser can recognise the language on the device: "available", "downloadable", "downloading", "unavailable" or "unknown". */
export async function onDeviceStatus(lang: string): Promise<string> {
  const R = recognitionCtor();
  if (!R?.available) return "unknown";
  try {
    return await R.available({ langs: [lang], processLocally: true });
  } catch {
    return "unknown";
  }
}

/** Asks the browser to download on-device recognition for the language. */
export async function installOnDevice(lang: string): Promise<boolean> {
  const R = recognitionCtor();
  if (!R?.install) return false;
  try {
    return Boolean(await R.install({ langs: [lang], processLocally: true }));
  } catch {
    return false;
  }
}

export type ListenError = "denied" | "no-mic" | "network" | "language" | "failed";

export interface ListenEvents {
  /** Everything heard so far: settled text, and the part still being recognised. */
  onText: (final: string, interim: string) => void;
  onError: (e: ListenError) => void;
  /** Recognition really started (after the permission prompt, if any). */
  onListening?: () => void;
}

export class Recognizer {
  private rec: SpeechRecognitionLike | null = null;
  private wanted = false;
  /** Text settled in earlier recognition sessions of this answer. */
  private carry = "";
  private sessionFinal = "";
  private interim = "";
  private firstAt = 0;
  private lastAt = 0;
  private restarts: number[] = [];

  constructor(private lang: string, private ev: ListenEvents, private local = false) {}

  get listening(): boolean { return this.wanted; }
  get heardAt(): number { return this.lastAt; }

  start(): void {
    this.wanted = true;
    this.carry = "";
    this.sessionFinal = "";
    this.interim = "";
    this.firstAt = 0;
    this.lastAt = 0;
    this.restarts = [];
    this.spawn();
  }

  /** Continues an answer after a pause, keeping what was heard. */
  resume(textSoFar: string): void {
    this.wanted = true;
    this.carry = textSoFar.trim();
    this.sessionFinal = "";
    this.interim = "";
    this.spawn();
  }

  private spawn(): void {
    const R = recognitionCtor();
    if (!R) { this.ev.onError("failed"); return; }
    let rec: SpeechRecognitionLike;
    try {
      rec = new R();
    } catch {
      this.ev.onError("failed");
      return;
    }
    rec.lang = this.lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    if (this.local && "processLocally" in rec) rec.processLocally = true;
    rec.onstart = () => this.ev.onListening?.();
    rec.onresult = e => {
      let fin = "";
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) fin += `${r[0].transcript} `;
        else interim += `${r[0].transcript} `;
      }
      const now = performance.now();
      if (!this.firstAt) this.firstAt = now;
      this.lastAt = now;
      this.sessionFinal = fin.trim();
      this.interim = interim.trim();
      this.ev.onText(this.text(false), this.interim);
    };
    rec.onerror = e => {
      if (e.error === "no-speech" || e.error === "aborted") return; // silence: onend restarts
      this.wanted = false;
      this.ev.onError(e.error === "not-allowed" || e.error === "service-not-allowed" ? "denied"
        : e.error === "audio-capture" ? "no-mic" : e.error === "network" ? "network" : e.error === "language-not-supported" ? "language" : "failed");
    };
    rec.onend = () => {
      // Keep what this session settled, then carry on if the answer isn't finished.
      this.carry = this.text(false);
      this.sessionFinal = "";
      if (this.interim) { this.carry = `${this.carry} ${this.interim}`.trim(); this.interim = ""; }
      this.rec = null;
      if (!this.wanted) return;
      const now = Date.now();
      this.restarts = [...this.restarts.filter(t => now - t < 10_000), now];
      if (this.restarts.length > 6) { this.wanted = false; this.ev.onError("failed"); return; }
      window.setTimeout(() => { if (this.wanted && !this.rec) this.spawn(); }, 120);
    };
    this.rec = rec;
    try {
      rec.start();
    } catch {
      this.rec = null;
      this.wanted = false;
      this.ev.onError("failed");
    }
  }

  private text(withInterim: boolean): string {
    return [this.carry, this.sessionFinal, withInterim ? this.interim : ""].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  }

  /** Stops listening; returns everything heard and the seconds between the first and last words. */
  stop(): { text: string; seconds: number } {
    this.wanted = false;
    const text = this.text(true);
    const seconds = this.firstAt && this.lastAt > this.firstAt ? (this.lastAt - this.firstAt) / 1000 : 0;
    try { this.rec?.stop(); } catch { /* already stopped */ }
    this.rec = null;
    return { text, seconds };
  }

  abort(): void {
    this.wanted = false;
    try { this.rec?.abort(); } catch { /* ignore */ }
    this.rec = null;
  }
}
