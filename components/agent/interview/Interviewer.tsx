"use client";
// components/agent/interview/Interviewer.tsx — the animated interviewer: an original SVG character
// (three looks) whose mouth follows the voice clock letter by letter, with blinking, small eye
// movements, a gently moving head, nods while the candidate speaks and a thinking pose. Drawn and
// animated in the browser (no video, no avatar service). It is always labelled as an animation.
//
// The animation runs in one requestAnimationFrame loop that writes SVG attributes directly, so
// React doesn't re-render 60 times a second. With reduced motion, the head and body stay still
// and only the mouth and the eyes move.

import React, { useEffect, useId, useRef } from "react";
import { LOOKS, type LookId } from "@/lib/agent/interview/looks";
import { REST, ease, shapeAt, type MouthShape } from "@/lib/agent/interview/lips";
import { clockPosition, type VoiceClock } from "@/lib/agent/interview/speech";

export type AvatarMode = "idle" | "speaking" | "listening" | "thinking";

const CX = 200;
const MY = 254;

export function mouthPaths(m: MouthShape, smile: number) {
  const hw = 18.5 * m.wide * (1 - 0.3 * m.round) + smile * 1.6;
  const cornerY = MY - smile * 2.8 + m.open * 1.2;
  const gap = m.open * 12;
  const topIn = MY - 0.6 - gap * 0.3;
  const botIn = MY + 0.6 + gap * 0.7;
  const lipT = 3.6 - m.round * 0.4;
  const lipB = 4.6 + m.round * 1.2;
  const L = CX - hw;
  const R = CX + hw;
  // Quadratic control points placed so the curves pass through the given heights at the centre.
  const through = (y: number) => 2 * y - cornerY;
  const f = (n: number) => n.toFixed(2);
  return {
    cavity: `M${f(L)} ${f(cornerY)} Q${CX} ${f(through(topIn))} ${f(R)} ${f(cornerY)} Q${CX} ${f(through(botIn))} ${f(L)} ${f(cornerY)} Z`,
    upper: `M${f(L)} ${f(cornerY)} C${f(L + hw * 0.36)} ${f(topIn - lipT * 1.15)} ${f(CX - hw * 0.22)} ${f(topIn - lipT - 1.6)} ${CX} ${f(topIn - lipT + 0.6)} `
      + `C${f(CX + hw * 0.22)} ${f(topIn - lipT - 1.6)} ${f(R - hw * 0.36)} ${f(topIn - lipT * 1.15)} ${f(R)} ${f(cornerY)} Q${CX} ${f(through(topIn))} ${f(L)} ${f(cornerY)} Z`,
    lower: `M${f(R)} ${f(cornerY)} Q${CX} ${f(through(botIn + lipB))} ${f(L)} ${f(cornerY)} Q${CX} ${f(through(botIn))} ${f(R)} ${f(cornerY)} Z`,
    teeth: `M${f(L)} ${f(topIn - 2)} L${f(R)} ${f(topIn - 2)} L${f(R)} ${f(topIn + 3.2 * m.teeth)} L${f(L)} ${f(topIn + 3.2 * m.teeth)} Z`,
  };
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function Interviewer({ look, mode, clock, nod, reduced, label, className, still = false, zoom = false }: {
  look: LookId;
  mode: AvatarMode;
  clock: VoiceClock;
  /** Increments when the candidate says something: the interviewer nods now and then. */
  nod: number;
  reduced: boolean;
  label: string;
  className?: string;
  /** A still picture (no animation loop), for thumbnails. */
  still?: boolean;
  /** Frame the head and shoulders more closely, as in a video call. */
  zoom?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const L = LOOKS[look];
  const refs = {
    head: useRef<SVGGElement>(null), body: useRef<SVGGElement>(null),
    cavity: useRef<SVGPathElement>(null), clip: useRef<SVGPathElement>(null), teeth: useRef<SVGPathElement>(null),
    upper: useRef<SVGPathElement>(null), lower: useRef<SVGPathElement>(null),
    eyeL: useRef<SVGGElement>(null), eyeR: useRef<SVGGElement>(null), irisL: useRef<SVGGElement>(null), irisR: useRef<SVGGElement>(null),
    browL: useRef<SVGPathElement>(null), browR: useRef<SVGPathElement>(null),
  };
  const modeRef = useRef(mode);
  const nodRef = useRef({ seen: nod, at: -1, last: 0 });
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => {
    const n = nodRef.current;
    if (nod !== n.seen) {
      n.seen = nod;
      const now = performance.now();
      // A nod at most every 2.5 s, and not on every word.
      if (modeRef.current === "listening" && now - n.last > 2500 && Math.random() < 0.55) { n.at = now; n.last = now; }
    }
  }, [nod]);

  useEffect(() => {
    if (still) return;
    let raf = 0;
    let last = performance.now();
    const m: MouthShape = { ...REST };
    const st = {
      blinkAt: last + rand(1200, 3500), blinkT: -1, gx: 0, gy: 0, tgx: 0, tgy: 0, saccadeAt: last + 1200,
      brow: 0, smile: 0.35, tilt: 0,
    };
    const set = (r: React.RefObject<SVGElement | null>, attr: string, v: string) => r.current?.setAttribute(attr, v);

    const frame = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const md = modeRef.current;
      const t = now / 1000;

      // Mouth: follow the letters being spoken.
      const pos = clockPosition(clock, now);
      const target = pos < 0 ? REST : shapeAt(clock.text, Math.floor(pos));
      ease(m, target, 1 - Math.exp(-dt / 55));
      const smileT = md === "listening" ? 0.55 : md === "thinking" ? 0.1 : md === "speaking" ? 0.26 : 0.4;
      st.smile += (smileT - st.smile) * (1 - Math.exp(-dt / 350));
      const p = mouthPaths(m, st.smile);
      set(refs.cavity, "d", p.cavity);
      set(refs.clip, "d", p.cavity);
      set(refs.upper, "d", p.upper);
      set(refs.lower, "d", p.lower);
      set(refs.teeth, "d", p.teeth);

      // Blinks (and now and then a double blink).
      if (st.blinkT < 0 && now >= st.blinkAt) st.blinkT = now;
      let lid = 1;
      if (st.blinkT >= 0) {
        const k = (now - st.blinkT) / 150;
        if (k >= 1) {
          st.blinkT = -1;
          st.blinkAt = now + (Math.random() < 0.12 ? 160 : reduced ? rand(4500, 8000) : rand(2200, 5200));
        } else lid = 1 - Math.sin(k * Math.PI) * 0.94;
      }
      const eyes = `translate(0 186) scale(1 ${lid.toFixed(3)}) translate(0 -186)`;
      set(refs.eyeL, "transform", eyes);
      set(refs.eyeR, "transform", eyes);

      // Gaze: small movements around where the interviewer looks.
      const baseX = md === "thinking" ? -3.6 : 0;
      const baseY = md === "thinking" ? -3 : md === "listening" ? 0.4 : 0;
      if (now >= st.saccadeAt) {
        const still = reduced || md === "listening";
        st.tgx = baseX + (still ? rand(-0.5, 0.5) : rand(-1.5, 1.5));
        st.tgy = baseY + (still ? rand(-0.3, 0.3) : rand(-0.8, 0.8));
        st.saccadeAt = now + rand(900, 2800);
      }
      if (md === "thinking") { st.tgx = baseX; st.tgy = baseY; }
      const gk = 1 - Math.exp(-dt / 45);
      st.gx += (st.tgx - st.gx) * gk;
      st.gy += (st.tgy - st.gy) * gk;
      set(refs.irisL, "transform", `translate(${st.gx.toFixed(2)} ${st.gy.toFixed(2)})`);
      set(refs.irisR, "transform", `translate(${st.gx.toFixed(2)} ${st.gy.toFixed(2)})`);

      // Brows: raised while listening, lifted with emphasis while speaking, one higher when thinking.
      const browT = md === "listening" ? 1.6 : md === "thinking" ? 1.2 : md === "speaking" ? 0.4 + m.open * 2.2 : 0;
      st.brow += (browT - st.brow) * (1 - Math.exp(-dt / 120));
      set(refs.browL, "transform", `translate(0 ${(-st.brow - (md === "thinking" ? 1.8 : 0)).toFixed(2)})`);
      set(refs.browR, "transform", `translate(0 ${(-st.brow).toFixed(2)})`);

      // Head and body.
      let rot = 0;
      let tx = 0;
      let ty = 0;
      if (!reduced) {
        const tiltT = md === "listening" ? 2.4 : md === "thinking" ? -2 : 0;
        st.tilt += (tiltT - st.tilt) * (1 - Math.exp(-dt / 600));
        rot = st.tilt + Math.sin(t * 0.55) * 0.8 + Math.sin(t * 1.31 + 1.1) * 0.45;
        tx = Math.sin(t * 0.42) * 1.5;
        ty = Math.sin(t * 0.77 + 0.4) * 0.7 + (md === "speaking" ? m.open * 1.3 : 0);
        const n = nodRef.current;
        if (n.at >= 0) {
          const k = (now - n.at) / 520;
          if (k >= 1) n.at = -1;
          else ty += Math.sin(k * Math.PI) * 3.4;
        }
      }
      set(refs.head, "transform", `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) rotate(${rot.toFixed(2)} 200 300)`);
      set(refs.body, "transform", `translate(0 ${reduced ? 0 : (Math.sin(t * 1.45) * 0.9).toFixed(2)})`);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // refs are stable; the clock object is mutated in place by the speaker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, clock, still]);

  const rest = mouthPaths(REST, 0.35);
  // Ids carry the look as well, so several interviewers on one page never share gradients.
  const id = (s: string) => `${s}-${look}-${uid}`;
  const url = (s: string) => `url(#${id(s)})`;
  const scarf = L.style === "scarf";
  const FACE = "M200 98 C156 98 130 130 129 178 C128 212 136 244 153 268 C167 288 184 298 200 299 C216 298 233 288 247 268 C264 244 272 212 271 178 C270 130 244 98 200 98 Z";
  const FRAME = "M152 270 C136 246 128 212 129 178 C130 130 156 98 200 98 C244 98 270 130 271 178 C272 212 264 246 248 270";

  return (
    <svg viewBox={zoom ? "36 58 328 382" : "0 0 400 440"} role="img" aria-label={label} className={className} focusable="false">
      <defs>
        <linearGradient id={id("face")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={L.skin} />
          <stop offset="0.75" stopColor={L.skin} />
          <stop offset="1" stopColor={L.skinShade} />
        </linearGradient>
        <linearGradient id={id("neck")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={L.skinShade} />
          <stop offset="1" stopColor={L.skin} />
        </linearGradient>
        <linearGradient id={id("jacket")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={L.jacket} />
          <stop offset="1" stopColor={L.jacketShade} />
        </linearGradient>
        <linearGradient id={id("hair")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={L.hair} />
          <stop offset="1" stopColor={L.hairShade} />
        </linearGradient>
        <radialGradient id={id("cheek")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={L.lips} stopOpacity="0.3" />
          <stop offset="1" stopColor={L.lips} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("light")} cx="0.38" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#fff4e2" stopOpacity="0.2" />
          <stop offset="0.65" stopColor="#fff4e2" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("mouth")}>
          <path ref={refs.clip} d={rest.cavity} />
        </clipPath>
      </defs>

      {/* Body */}
      <g ref={refs.body}>
        {L.style === "long" && (
          <path d="M200 74 C148 74 116 110 114 168 C112 212 118 252 112 296 C108 322 112 340 124 352 C140 358 156 352 160 340 C156 318 156 298 160 278 L240 278 C244 298 244 318 240 340 C244 352 260 358 276 352 C288 340 292 322 288 296 C282 252 288 212 286 168 C284 110 252 74 200 74 Z" fill={url("hair")} />
        )}
        {!scarf && (
          <>
            <path d="M170 256 C172 290 170 318 160 344 L240 344 C230 318 228 290 230 256 Z" fill={url("neck")} />
            <ellipse cx="200" cy="296" rx="36" ry="13" fill="#000" fillOpacity="0.12" />
          </>
        )}
        <path d="M38 440 C42 400 74 372 128 358 C146 353 160 348 166 340 C180 354 220 354 234 340 C240 348 254 353 272 358 C326 372 358 400 362 440 Z" fill={url("jacket")} />
        {!scarf && <path d="M166 340 C180 354 220 354 234 340 L200 430 Z" fill={L.shirt} />}
        {!scarf && (
          <>
            <path d="M168 338 L184 368 L198 351 Z" fill={L.shirt} />
            <path d="M232 338 L216 368 L202 351 Z" fill={L.shirt} />
            <path d="M184 368 L198 351 M216 368 L202 351" stroke="#000" strokeOpacity="0.1" strokeWidth="1" />
          </>
        )}
        <path d="M166 340 L146 362 L160 380 L152 392 L194 438 L200 430 Z" fill={L.jacketShade} />
        <path d="M234 340 L254 362 L240 380 L248 392 L206 438 L200 430 Z" fill={L.jacketShade} />
        <path d="M146 362 L160 380 L152 392 M254 362 L240 380 L248 392" fill="none" stroke="#fff" strokeOpacity="0.07" strokeWidth="1.2" />
        {L.pin && (
          <g>
            <circle cx="164" cy="402" r="4.6" fill="#c8a96e" />
            <circle cx="162.6" cy="400.6" r="1.4" fill="#f3e3bd" />
          </g>
        )}
        {scarf && (
          <>
            <path d="M136 300 C114 330 102 362 98 404 C130 416 168 420 200 420 C232 420 270 416 302 404 C298 362 286 330 264 300 C244 322 222 334 200 336 C178 334 156 322 136 300 Z" fill={url("hair")} />
            <path d="M124 334 C150 362 178 374 208 378 M112 368 C148 392 196 402 246 396 M268 330 C276 352 282 374 284 398" fill="none" stroke={L.hairShade} strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* Head */}
      <g ref={refs.head}>
        {scarf && (
          <path d="M200 70 C138 70 104 118 104 184 C104 240 118 284 146 312 C162 326 180 334 200 335 C220 334 238 326 254 312 C282 284 296 240 296 184 C296 118 262 70 200 70 Z" fill={url("hair")} />
        )}
        {!scarf && (
          <>
            <path d="M131 182 C121 180 117 196 120 208 C123 220 131 224 136 220 Z" fill={L.skinShade} />
            <path d="M269 182 C279 180 283 196 280 208 C277 220 269 224 264 220 Z" fill={L.skinShade} />
            <path d="M127 194 C125 200 126 207 130 211 M273 194 C275 200 274 207 270 211" fill="none" stroke="#000" strokeOpacity="0.16" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
        <path d={FACE} fill={url("face")} />
        <path d="M232 108 C262 124 272 150 271 180 C272 214 264 244 247 268 C233 288 216 298 200 299 C222 290 242 262 250 226 C258 190 252 140 232 108 Z" fill={L.skinShade} fillOpacity="0.2" />
        <path d={FACE} fill={url("light")} />
        <ellipse cx="160" cy="230" rx="18" ry="10" fill={url("cheek")} />
        <ellipse cx="240" cy="230" rx="18" ry="10" fill={url("cheek")} />

        {L.beard && (
          <path d="M131 204 C134 240 150 274 174 290 C184 297 192 300 200 300 C208 300 216 297 226 290 C250 274 266 240 269 204 C264 230 255 246 241 254 C235 270 221 279 200 280 C179 279 165 270 159 254 C145 246 136 230 131 204 Z" fill={L.hair} fillOpacity="0.72" />
        )}

        {/* Nose */}
        <path d="M201 194 C200 206 197 215 193 222 C196 227.5 204 227.5 207 222.5" fill="none" stroke={L.skinShade} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M198 198 C197 206 196 212 195 216" fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="200.5" cy="227" rx="10" ry="3" fill={L.skinShade} fillOpacity="0.3" />

        {/* Mouth */}
        <path ref={refs.cavity} d={rest.cavity} fill="#3b1d1b" />
        <g clipPath={url("mouth")}>
          <path ref={refs.teeth} d={rest.teeth} fill="#f4efe8" />
        </g>
        <path ref={refs.upper} d={rest.upper} fill={L.lips} />
        <path ref={refs.lower} d={rest.lower} fill={L.lips} />
        {L.beard && (
          <path d="M171 247 C182 241.5 194 241 200 243.5 C206 241 218 241.5 229 247 C221 248.6 210 248.4 200 246.6 C190 248.4 179 248.6 171 247 Z" fill={L.hair} fillOpacity="0.62" />
        )}

        {/* Eyes */}
        {[172, 228].map((cx, i) => (
          <g key={cx} ref={i === 0 ? refs.eyeL : refs.eyeR}>
            <ellipse cx={cx} cy="186" rx="12.5" ry="7.6" fill="#f6f1ea" />
            <g ref={i === 0 ? refs.irisL : refs.irisR}>
              <circle cx={cx} cy="186.4" r="6.2" fill={L.iris} />
              <circle cx={cx} cy="186.4" r="2.9" fill="#120c0a" />
              <circle cx={cx + 2.1} cy="184.2" r="1.5" fill="#fff" fillOpacity="0.9" />
            </g>
            <path d={i === 0 ? "M159 184.5 C164 177.6 180 177.2 185.5 183.6" : "M214.5 183.6 C220 177.2 236 177.6 241 184.5"} fill="none" stroke="#2a1d18"
              strokeWidth={L.style === "short" ? 2.2 : 3} strokeLinecap="round" />
            <path d={i === 0 ? "M161 176.5 C167 172.5 178 172.5 184 176" : "M216 176 C222 172.5 233 172.5 239 176.5"} fill="none" stroke={L.skinShade} strokeWidth="1.2" strokeOpacity="0.8" strokeLinecap="round" />
            <path d={i === 0 ? "M161 190.4 C167 194.4 178 194.4 184 190.4" : "M216 190.4 C222 194.4 233 194.4 239 190.4"} fill="none" stroke={L.skinShade} strokeWidth="1.3" strokeOpacity="0.7" strokeLinecap="round" />
          </g>
        ))}
        <path ref={refs.browL} d="M155 166 C163 158.5 177 157.5 188 162" fill="none" stroke={L.brows} strokeWidth={L.style === "short" ? 5.4 : 4.2} strokeLinecap="round" />
        <path ref={refs.browR} d="M212 162 C223 157.5 237 158.5 245 166" fill="none" stroke={L.brows} strokeWidth={L.style === "short" ? 5.4 : 4.2} strokeLinecap="round" />

        {/* Hair or headscarf in front */}
        {L.style === "short" && (
          <>
            <path d="M127 184 C118 122 156 80 204 80 C252 80 286 118 273 182 C268 162 260 146 246 136 C232 130 214 128 196 132 C176 136 156 134 144 142 C134 152 129 166 127 184 Z" fill={url("hair")} />
            <path d="M129 180 C128 192 129 202 132 212 L137 210 C135 200 135 190 136 180 Z M271 180 C272 192 271 202 268 212 L263 210 C265 200 265 190 264 180 Z" fill={L.hair} />
            <path d="M170 90 C166 104 160 118 152 130 M196 132 C208 122 226 118 246 124" fill="none" stroke={L.hairShade} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
          </>
        )}
        {L.style === "long" && (
          <>
            <path d="M128 178 C126 124 158 92 204 92 C248 92 274 122 274 170 C274 182 272 196 270 206 C266 180 258 150 240 134 C228 124 214 120 204 118 C196 132 178 146 156 156 C144 162 134 170 128 178 Z" fill={url("hair")} />
            <path d="M131 168 C123 200 123 238 135 270 C139 250 141 226 143 196 Z" fill={L.hair} />
            <path d="M204 118 C192 136 170 150 146 160 M240 134 C254 150 264 172 268 196" fill="none" stroke={L.hairShade} strokeWidth="1.8" strokeOpacity="0.6" strokeLinecap="round" />
          </>
        )}
        {scarf && (
          <>
            <path d={FRAME} fill="none" stroke={url("hair")} strokeWidth="20" strokeLinecap="round" />
            <path d={FRAME} fill="none" stroke={L.hairShade} strokeWidth="5" strokeLinecap="round" strokeOpacity="0.7" transform="translate(200 186) scale(0.915) translate(-200 -186)" />
            <path d="M150 112 C170 100 230 100 250 112" fill="none" stroke="#fff" strokeOpacity="0.08" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
}
