"use client";

// The signature: the page opens above the water at dawn. Scrolling raises the waterline over the
// picture, then takes you down the rope to the oyster bank at twelve metres, where an oyster opens
// on its pearl. Everything is driven by scroll position, so it runs at the visitor's pace.

import { useCallback, useRef } from "react";
import { DESCENT, IMG, money, ROOMS, shortDate, type Lang } from "@/lib/showcase/hayrat";
import { Img } from "../kit/Img";
import { clamp01, smooth, useScrollStage } from "../useScrollStage";
import { Emblem } from "./Chrome";
import { useHayrat } from "./state";

const W_END = 0.14; // waterline fully up
const D_END = 0.84; // twelve metres reached

/** A wavy top edge for clip-path, `top` in percent of the stage height. */
function wave(top: number, phase: number) {
  const pts: string[] = [];
  const n = 18;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 100;
    const y = top + Math.sin(i * 0.9 + phase) * 0.9 + Math.sin(i * 2.3 - phase * 1.4) * 0.35;
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  return `polygon(${pts.join(",")},100% 100%,0% 100%)`;
}
function wavePath(top: number, phase: number) {
  let d = "";
  const n = 36;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 100;
    const k = (i / n) * 18;
    const y = top + Math.sin(k * 0.9 + phase) * 0.9 + Math.sin(k * 2.3 - phase * 1.4) * 0.35;
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

function StayBar() {
  const { stay, lang, t, open } = useHayrat();
  const dates = stay.checkIn && stay.checkOut ? `${shortDate(stay.checkIn, lang)} → ${shortDate(stay.checkOut, lang)}` : t.addDates;
  const lowest = Math.min(...ROOMS.map((r) => r.base));
  return (
    <div className="hy-staybar">
      <button type="button" className="hy-staybar-field" onClick={() => open("book")}>
        <small>
          {t.checkIn} · {t.checkOut}
        </small>
        <span>{dates}</span>
      </button>
      <button type="button" className="hy-staybar-field" onClick={() => open("book")}>
        <small>{t.guests}</small>
        <span>
          {stay.adults + stay.children} · {stay.adults} {t.adults.toLowerCase()}
          {stay.children ? `, ${stay.children} ${t.children.toLowerCase()}` : ""}
        </span>
      </button>
      <button type="button" className="hy-btn hy-btn-solid" onClick={() => open("book")}>
        {t.heroCta}
        <small className="hy-staybar-from">
          {t.from} {money(lowest, lang as Lang)}
        </small>
      </button>
    </div>
  );
}

export function Descent() {
  const { t, lang } = useHayrat();
  const above = useRef<HTMLDivElement>(null);
  const below = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const caps = useRef<(HTMLParagraphElement | null)[]>([]);
  const tint = useRef<HTMLDivElement>(null);
  const rays = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const gauge = useRef<HTMLDivElement>(null);
  const pearl = useRef<HTMLDivElement>(null);
  const lid = useRef<SVGGElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const tLive = useRef(t);
  tLive.current = t;

  const onFrame = useCallback((p: number) => {
    const w = clamp01(p / W_END);
    const top = 100 - w * 104;
    const phase = p * 40;
    if (below.current) below.current.style.clipPath = w >= 1 ? "none" : wave(top, phase);
    if (line.current) {
      line.current.setAttribute("d", wavePath(top, phase));
      line.current.style.opacity = w > 0.01 && w < 0.99 ? "1" : "0";
    }
    if (above.current) above.current.style.transform = `translate3d(0, ${(-w * 6).toFixed(2)}%, 0) scale(${(1 + w * 0.04).toFixed(3)})`;
    if (copy.current) {
      copy.current.style.opacity = String(1 - smooth(0, 0.55, w));
      copy.current.style.transform = `translate3d(0, ${(-w * 40).toFixed(1)}px, 0)`;
      copy.current.style.visibility = w > 0.6 ? "hidden" : "visible";
    }

    const d = clamp01((p - W_END) / (D_END - W_END)) * 12;
    const o0 = 1;
    const o1 = smooth(3, 5.2, d);
    const o2 = smooth(7, 9.2, d);
    const op = [o0, o1, o2];
    layers.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = String(op[i]);
      el.style.transform = `scale(${(1.14 - d * 0.003 - i * 0.01).toFixed(3)}) translate3d(0, ${(d * 0.22 - i * 0.6).toFixed(2)}%, 0)`;
    });
    if (tint.current) tint.current.style.opacity = String(0.08 + (d / 12) * 0.5);
    if (rays.current) rays.current.style.opacity = String(Math.max(0, 0.75 - d / 14) * w);
    // Each line owns a stretch of the dive (0-2 m, 2-6, 6-10, 10-12) and hands over to the next.
    const edges = [-1, 2, 6, 10, 13];
    caps.current.forEach((el, i) => {
      if (!el) return;
      const at = DESCENT[i].depth;
      const v = smooth(edges[i] - 0.25, edges[i] + 0.25, d) * (1 - smooth(edges[i + 1] - 0.25, edges[i + 1] + 0.25, d)) * smooth(0.82, 1, w) * (1 - smooth(D_END - 0.05, D_END, p));
      el.style.opacity = String(v);
      el.style.visibility = v < 0.01 ? "hidden" : "visible";
      el.style.transform = `translate3d(0, ${((d - at) * -26).toFixed(1)}px, 0)`;
    });
    if (marker.current) marker.current.style.top = `${(d / 12) * 100}%`;
    if (readout.current) readout.current.textContent = w < 1 && d === 0 ? tLive.current.surface : `${d.toFixed(1)} m`;
    if (gauge.current) gauge.current.style.opacity = String(smooth(0.3, 1, w));

    const e = smooth(D_END, 0.97, p);
    if (pearl.current) {
      pearl.current.style.opacity = String(smooth(D_END - 0.02, D_END + 0.06, p));
      pearl.current.style.visibility = p > D_END - 0.03 ? "visible" : "hidden";
    }
    if (lid.current) lid.current.style.transform = `rotate(${(-e * 34).toFixed(2)}deg)`;
    pearl.current?.style.setProperty("--glow", e.toFixed(3));
  }, []);

  const { ref, scrollToProgress } = useScrollStage<HTMLElement>(onFrame, 0.12);

  return (
    <section className="hy-descent" id="descent" ref={ref} aria-label={t.nav.dive}>
      <div className="hy-stage" data-tone="dark">
        <div className="hy-above" ref={above}>
          <Img src={IMG.heroDhow} alt={lang === "ar" ? "سفينة شراعية تقترب من الجزيرة عند الفجر" : "A dhow coming in to the island at dawn"} eager sizes="100vw" widths={[960, 1440, 1600]} />
        </div>
        <div className="hy-hero-copy" ref={copy}>
          <p className="hy-kicker">{t.heroKicker}</p>
          <h1 className="hy-h1">
            {t.heroTitle.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h1>
          <p className="hy-hero-body">{t.heroBody}</p>
          <div className="hy-hero-actions">
            <button type="button" className="hy-btn hy-btn-ghost" onClick={() => scrollToProgress(0.36)}>
              {t.heroDive}
            </button>
          </div>
          <StayBar />
        </div>

        <div className="hy-below" ref={below} style={{ clipPath: wave(104, 0) }}>
          {(["diveSurface", "diveDiver", "diveBank"] as const).map((k, i) => (
            <div
              key={k}
              className="hy-layer"
              ref={(el) => {
                layers.current[i] = el;
              }}
              style={{ opacity: i ? 0 : 1 }}
            >
              <Img src={IMG[k]} alt="" sizes="100vw" widths={[960, 1440, 1600]} />
            </div>
          ))}
          <div className="hy-rays" ref={rays} aria-hidden />
          <div className="hy-bubbles" aria-hidden>
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} style={{ "--i": i } as React.CSSProperties} />
            ))}
          </div>
          <div className="hy-tint" ref={tint} aria-hidden />
          <div className="hy-caps">
            {DESCENT.map((c, i) => (
              <p
                key={c.depth}
                className="hy-cap"
                ref={(el) => {
                  caps.current[i] = el;
                }}
              >
                <span className="hy-cap-depth">{c.depth} m</span>
                {c.line[lang]}
              </p>
            ))}
          </div>
          <div className="hy-pearl" ref={pearl}>
            <div className="hy-oyster" aria-hidden>
              <svg viewBox="0 0 240 170">
                <defs>
                  <radialGradient id="hy-nacre" cx="0.4" cy="0.35" r="0.8">
                    <stop offset="0" stopColor="#fbf8f4" />
                    <stop offset="0.4" stopColor="#e9e2ef" />
                    <stop offset="0.7" stopColor="#cfe6e2" />
                    <stop offset="1" stopColor="#9fb9c0" />
                  </radialGradient>
                  <radialGradient id="hy-pearl-g" cx="0.36" cy="0.32" r="0.8">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="0.5" stopColor="#f1ecf4" />
                    <stop offset="0.85" stopColor="#d4e8e4" />
                    <stop offset="1" stopColor="#b9ccd1" />
                  </radialGradient>
                </defs>
                <path d="M18 104C28 150 212 150 222 104C182 122 58 122 18 104Z" fill="url(#hy-nacre)" stroke="#e8e2da" strokeOpacity=".5" />
                <g ref={lid} className="hy-lid">
                  <path d="M24 98C40 44 196 36 220 92C176 76 66 78 24 98Z" fill="#2c4a52" stroke="#e8e2da" strokeOpacity=".4" />
                  <path d="M44 90C70 66 172 62 204 84" fill="none" stroke="#e8e2da" strokeOpacity=".25" />
                </g>
                <circle cx="120" cy="106" r="17" fill="url(#hy-pearl-g)" className="hy-pearl-dot" />
                <circle cx="114" cy="100" r="4" fill="#fff" opacity=".9" />
              </svg>
            </div>
            <p className="hy-pearl-line">{t.descentEnd}</p>
            <a className="hy-btn hy-btn-pearl" href="#island">
              {t.nav.island}
            </a>
          </div>
        </div>

        <svg className="hy-waterline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <path ref={line} d="" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="hy-gauge" ref={gauge} aria-hidden>
          <span className="hy-gauge-label">{t.depth}</span>
          <div className="hy-gauge-scale">
            {[0, 4, 8, 12].map((m) => (
              <span key={m} className="hy-gauge-tick" style={{ top: `${(m / 12) * 100}%` }}>
                {m} m
              </span>
            ))}
            <span className="hy-gauge-marker" ref={marker} />
          </div>
          <span className="hy-gauge-read" ref={readout} />
        </div>

        <a className="hy-skipdive" href="#island">
          {lang === "ar" ? "تخطَّ الغوص" : "Skip the dive"}
        </a>
        <span className="hy-scrollhint" aria-hidden>
          <Emblem size={16} />
          {t.scroll}
        </span>
      </div>
    </section>
  );
}
