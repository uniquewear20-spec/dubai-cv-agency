"use client";

// The story before the homes. The hero is a limewashed wall with the village's name and a
// horseshoe doorway cut out of it: the photograph shows through, and scrolling walks you through
// the door. Then the village in one sentence under swaying bougainvillea, the coast sideways, the
// coastline drawn and the descent through drifting clouds to the Rif, the architecture, the
// gardens through the year and the pool garden. Scenes get their progress as --p from the page's
// scroll engine and CSS does the motion.

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ALT, COAST, COAST_PATH, FIGURES, IMG, MONTHS, PLANTS, PRINCIPLES, WELLNESS } from "@/lib/showcase/albora";
import { sized } from "@/lib/showcase/media";
import { Img } from "../kit/Img";
import { Ring } from "./Chrome";
import { useAlbora, useScene } from "./state";

const v = (o: Record<string, string | number>) => o as CSSProperties;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** The wall: a limewash plane with the name and a horseshoe arch cut out of it. */
function Door({ variant, word }: { variant: "land" | "port"; word: string }) {
  const land = variant === "land";
  const W = land ? 1600 : 800;
  const H = land ? 1000 : 1600;
  const cx = W / 2;
  const cy = land ? 610 : 830;
  const r = land ? 232 : 255;
  // a horseshoe arch: the circle carries on past its widest point before the jambs drop
  const arch = (rr: number) => `M${r1(cx - rr * 0.866)} ${H + 60} V${r1(cy + rr * 0.5)} A${rr} ${rr} 0 1 1 ${r1(cx + rr * 0.866)} ${r1(cy + rr * 0.5)} V${H + 60}`;
  const id = `al-door-m-${variant}`;
  return (
    <svg className={`al-door al-door-${variant}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-W} y={-H} width={W * 3} height={H * 3}>
          <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#fff" />
          <path d={`${arch(r)} Z`} fill="#000" />
          <text x={cx} y={land ? 344 : 432} textAnchor="middle" className="al-door-word" fontSize={land ? 330 : 186} fill="#000">
            {word}
          </text>
        </mask>
      </defs>
      <rect x={-W} y={-H} width={W * 3} height={H * 3} className="al-door-wall" mask={`url(#${id})`} />
      <path d={arch(r + 20)} className="al-door-line" />
    </svg>
  );
}

/** A branch of bougainvillea that swings into place and keeps moving in the breeze. */
function Branch({ side }: { side: "l" | "r" }) {
  return (
    <div className={`al-branch al-branch-${side}`} aria-hidden>
      <div className="al-branch-sway">
        <Img src={IMG.bloom} alt="" sizes="(max-width: 700px) 40vw, 30vw" className="al-branch-img" />
      </div>
    </div>
  );
}

export function Hero() {
  const { t, lang } = useAlbora();
  const [night, setNight] = useState(false);
  const [spot, setSpot] = useState<number | null>(null);
  const ref = useScene("pin");
  return (
    <section className={`al-hero al-pin${night ? " is-night" : ""}`} id="al-hero" ref={ref} aria-labelledby="al-hero-h">
      <div className="al-stage">
        <div className="al-hero-media" style={IMG.day ? { backgroundImage: `url(${sized(IMG.day, 64)})` } : undefined}>
          <div className="al-hero-zoom">
            <div className="al-hero-kb">
              <Img src={IMG.day} alt={ALT.day[lang]} eager sizes="100vw" widths={[800, 1200, 1600, 2400]} className="al-hero-day" />
              <Img src={IMG.night} alt={night ? ALT.night[lang] : ""} sizes="100vw" widths={[800, 1200, 1600, 2400]} className="al-hero-night" />
            </div>
          </div>
        </div>
        <div className="al-door-zoom">
          <div className="al-door-in">
            <Door variant="land" word={t.name} />
            <Door variant="port" word={t.name} />
          </div>
        </div>
        <Branch side="l" />
        <Branch side="r" />
        <h1 id="al-hero-h" className="al-sr">
          {t.name} {t.residences}. {t.left} {t.right}, {t.script}.
        </h1>
        <div className="al-hero-words" aria-hidden>
          <p className="al-kicker">{t.residences}</p>
          <p className="al-hero-script">{t.script}</p>
          <p className="al-hero-side al-hero-left">{t.left}</p>
          <p className="al-hero-side al-hero-right">{t.right}</p>
        </div>
        <ul className="al-spots">
          {t.hotspots.map((h, i) => (
            <li key={h.title} style={v({ "--x": `${h.x}%`, "--y": `${h.y}%`, "--ax": h.x < 22 ? "-14%" : h.x > 70 ? "-86%" : "-50%" })} className={spot === i ? "is-open" : ""}>
              <button type="button" aria-expanded={spot === i} aria-controls={`al-spot-${i}`} onClick={() => setSpot(spot === i ? null : i)}>
                <span aria-hidden>+</span>
                <span className="al-sr">{h.title}</span>
              </button>
              <div id={`al-spot-${i}`} className="al-spot-card" hidden={spot !== i}>
                <strong>{h.title}</strong>
                <span>{h.body}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="al-daynight" role="group" aria-label={`${t.byDay} / ${t.byNight}`}>
          <button type="button" aria-pressed={!night} onClick={() => setNight(false)}>
            {t.byDay}
          </button>
          <button type="button" aria-pressed={night} onClick={() => setNight(true)}>
            {t.byNight}
          </button>
        </div>
        <a href="#residences" className="al-hero-cta" aria-label={t.viewHomes}>
          <Ring text={t.viewRing} id="al-cta-ring" size={132}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
              <path d="M12 4v15M6 13l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Ring>
        </a>
      </div>
    </section>
  );
}

export function Quote() {
  const { t, lang } = useAlbora();
  const ref = useScene("pin");
  const words = t.quote.split(" ");
  return (
    <section className="al-quote al-pin" id="al-quote" ref={ref} aria-label={t.quote}>
      <div className="al-stage">
        <Img src={IMG.lane} alt={ALT.lane[lang]} sizes="100vw" widths={[800, 1200, 1600, 2400]} className="al-quote-img" />
        <span className="al-quote-shade" aria-hidden />
        <p className="al-quote-text" style={v({ "--n": words.length })} aria-hidden>
          {words.map((w, i) => (
            <span key={i} style={v({ "--i": i })}>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

// bougainvillea bracts drifting down through the village sentence
const PETALS = [
  { x: 5, d: 0, t: 15, dx: 90, r: 280, s: 1 },
  { x: 17, d: 5, t: 18, dx: -50, r: -220, s: 0.8 },
  { x: 29, d: 9.5, t: 16, dx: 70, r: 320, s: 0.9 },
  { x: 44, d: 2.5, t: 19, dx: -80, r: 250, s: 0.7 },
  { x: 58, d: 12, t: 14, dx: 60, r: -300, s: 1.1 },
  { x: 69, d: 6.5, t: 17, dx: -60, r: 230, s: 0.85 },
  { x: 81, d: 1.5, t: 15.5, dx: 80, r: -270, s: 1 },
  { x: 93, d: 8, t: 18.5, dx: -70, r: 210, s: 0.75 },
];

export function Concept() {
  const { t, lang } = useAlbora();
  const ref = useScene("pass");
  return (
    <section className="al-concept-sec" id="village" ref={ref} aria-labelledby="al-village-h">
      <div className="al-bloom al-bloom-a" aria-hidden>
        <div className="al-bloom-sway">
          <Img src={IMG.bloom} alt="" sizes="40vw" className="al-bloom-img" />
        </div>
      </div>
      <div className="al-bloom al-bloom-b" aria-hidden>
        <div className="al-bloom-sway">
          <Img src={IMG.bloom} alt="" sizes="30vw" className="al-bloom-img" />
        </div>
      </div>
      <div className="al-petals" aria-hidden>
        {PETALS.map((p, i) => (
          <span key={i} style={v({ "--x": `${p.x}%`, "--d": `${p.d}s`, "--t": `${p.t}s`, "--dx": `${p.dx}px`, "--r": `${p.r}deg`, "--k": p.s })}>
            <svg viewBox="0 0 20 24">
              <path d="M10 1C15.5 6 19.5 12.5 16.5 19 14 23 6 23 3.5 19 .5 12.5 4.5 6 10 1z" />
            </svg>
          </span>
        ))}
      </div>
      <h2 id="al-village-h" className="al-statement">
        {t.conceptTitle}
      </h2>
      <p className="al-lede">{t.conceptBody}</p>
      <ul className="al-figures" aria-label={t.figuresNote}>
        {FIGURES.map((f) => (
          <li key={f.v}>
            <span className="al-fig-v">{f.v}</span>
            <span className="al-fig-k">{f.k[lang]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Golden() {
  const { t, lang } = useAlbora();
  const ref = useScene("pin");
  return (
    <section className="al-golden al-pin" id="al-golden" ref={ref} aria-labelledby="al-golden-h">
      <div className="al-stage">
        <div className="al-golden-track">
          <h2 id="al-golden-h" className="al-golden-words">
            <span>{t.golden1}</span> <span>{t.golden2}</span> <span>{t.golden3}</span>
          </h2>
          <figure className="al-golden-fig">
            <Img src={IMG.terrace} alt={ALT.terrace[lang]} sizes="(max-width: 700px) 80vw, 40vw" className="al-golden-img" />
          </figure>
          <div className="al-golden-end">
            <p className="al-golden-country">{t.country}</p>
            <p className="al-golden-note">{t.goldenNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A layer of cloud, painted once into a small canvas while the browser is idle after the page has
 * loaded, a few rows at a time so it never holds up scrolling: fractal value noise turned into soft
 * cumulus with lit tops and grey undersides, faded at its edges. CSS only moves the canvas, so
 * drifting and scrolling cost nothing.
 */
const idle = (fn: () => void) => {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 400 });
  else setTimeout(fn, 24);
};

function paintClouds(c: HTMLCanvasElement, seed: number, th: number, alive: () => boolean) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const w = c.width;
  const h = c.height;
  const G = 64;
  let s = seed >>> 0;
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  const lat = new Float32Array(G * G);
  for (let i = 0; i < lat.length; i++) lat[i] = rnd();
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const q = yf * yf * (3 - 2 * yf);
    const x0 = xi & (G - 1);
    const y0 = yi & (G - 1);
    const x1 = (x0 + 1) & (G - 1);
    const y1 = (y0 + 1) & (G - 1);
    const a = lat[y0 * G + x0];
    const b = lat[y0 * G + x1];
    const cc = lat[y1 * G + x0];
    const d = lat[y1 * G + x1];
    return a + (b - a) * u + (cc - a) * q + (a - b - cc + d) * u * q;
  };
  const N = new Float32Array(w * h);
  const fx = 4.2 / w;
  const fy = 2.6 / h;
  let row = 0;
  const finish = () => {
    const img = ctx.createImageData(w, h);
    const D = img.data;
    const sm = (a: number, b: number, t: number) => {
      const k = Math.min(1, Math.max(0, (t - a) / (b - a)));
      return k * k * (3 - 2 * k);
    };
    for (let y = 0; y < h; y++) {
      const ty = y / h;
      const prof = sm(0, 0.32, ty) * (1 - sm(0.58, 1, ty));
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const n = N[i];
        let a = (n - th) * 4.4;
        a = a < 0 ? 0 : a > 1 ? 1 : a;
        const up = N[Math.max(0, y - 3) * w + Math.max(0, x - 4)];
        const shade = Math.min(1, Math.max(0, 0.62 + (n - up) * 7));
        const lum = 200 + 55 * shade;
        D[i * 4] = lum - 7;
        D[i * 4 + 1] = lum - 3;
        D[i * 4 + 2] = Math.min(255, lum + 2);
        D[i * 4 + 3] = a * prof * 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  };
  const work = () => {
    if (!alive()) return;
    const stop = performance.now() + 7;
    while (row < h && performance.now() < stop) {
      for (let x = 0; x < w; x++) {
        let n = 0;
        let amp = 0.5;
        let f = 1;
        for (let o = 0; o < 5; o++) {
          n += amp * noise(x * fx * f + o * 17.3, row * fy * f + o * 9.1);
          f *= 2.03;
          amp *= 0.5;
        }
        N[row * w + x] = n / 0.96875;
      }
      row++;
    }
    if (row < h) idle(work);
    else idle(finish);
  };
  idle(work);
}

function Cloud({ seed, th, className }: { seed: number; th: number; className: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    let alive = true;
    const start = () => setTimeout(() => paintClouds(c, seed, th, () => alive), 900);
    if (document.readyState === "complete") start();
    else addEventListener("load", start, { once: true });
    return () => {
      alive = false;
      removeEventListener("load", start);
    };
  }, [seed, th]);
  return (
    <div className={`al-cloud ${className}`}>
      <canvas ref={ref} width={720} height={270} />
    </div>
  );
}

/** The coast draws itself on the limewash; then the page sinks through the clouds to the Rif. */
export function Coast() {
  const { t, lang } = useAlbora();
  const ref = useScene("pin");
  return (
    <section className="al-coast al-pin" id="coast" ref={ref} aria-labelledby="al-coast-h">
      <div className="al-stage">
        <div className="al-rif-frame">
          <Img src={IMG.rif} alt={ALT.rif[lang]} sizes="110vw" widths={[1200, 1600, 2400]} className="al-rif-img" />
        </div>
        <div className="al-fog" aria-hidden>
          <div className="al-fog-wash">
            <Cloud seed={7} th={0.4} className="al-cloud-back" />
            <Cloud seed={11} th={0.44} className="al-cloud-mid" />
            <Cloud seed={3} th={0.42} className="al-cloud-front" />
          </div>
        </div>
        <div className="al-coast-content">
          <p className="al-coast-head" aria-hidden>
            <span>{t.coastA}</span>
            <span className="al-script">{t.coastScript}</span>
            <span>{t.coastB}</span>
          </p>
          <svg className="al-map" viewBox="0 0 1000 260" role="img" aria-label={t.coastTitle} direction="ltr">
            <path d={COAST_PATH} pathLength={1} className="al-map-line" />
            {COAST.map((s, i) => (
              <g key={s.name.en} className={`al-map-stop${s.home ? " is-home" : ""}`} style={v({ "--t": (s.x / 1000).toFixed(3) })} transform={`translate(${s.x} ${s.y})`}>
                <circle r={s.home ? 9 : 5} />
                {s.home && <circle r={18} className="al-map-halo" />}
                <text y={[34, -20, -20, 46, -20, 34, -20][i]} textAnchor="middle">
                  {s.name[lang]}
                </text>
              </g>
            ))}
          </svg>
          <div className="al-coast-copy">
            <h2 id="al-coast-h">{t.coastTitle}</h2>
            <p>{t.coastBody}</p>
            <ol className="al-coast-list">
              {COAST.filter((s) => !s.home).map((s) => (
                <li key={s.name.en}>
                  <span>{s.name[lang]}</span>
                  <span>
                    {s.min} {t.minutes}
                  </span>
                </li>
              ))}
            </ol>
            <p className="al-small">{t.coastNote}</p>
          </div>
        </div>
        <div className="al-rif-copy">
          <h2>{t.rifTitle}</h2>
          <p>{t.rifBody}</p>
        </div>
      </div>
    </section>
  );
}

export function Architecture() {
  const { t, lang } = useAlbora();
  return (
    <section className="al-arch" id="architecture" aria-labelledby="al-arch-h">
      <div className="al-arch-head">
        <h2 id="al-arch-h" className="al-display">
          {t.archTitle}
        </h2>
        <p className="al-lede">{t.archBody}</p>
      </div>
      <figure className="al-arch-aerial">
        <div className="al-px" data-px="0.1">
          <Img src={IMG.aerial} alt={ALT.aerial[lang]} sizes="(max-width: 900px) 100vw, 66vw" />
        </div>
      </figure>
      {IMG.model && (
        <figure className="al-arch-model">
          <div className="al-px" data-px="0.12">
            <Img src={IMG.model} alt={ALT.model[lang]} sizes="(max-width: 900px) 70vw, 30vw" />
          </div>
        </figure>
      )}
      <dl className="al-principles">
        {PRINCIPLES.map((p) => (
          <div key={p.t.en}>
            <dt>{p.t[lang]}</dt>
            <dd>{p.b[lang]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Gardens() {
  const { t, lang } = useAlbora();
  const [m, setM] = useState(4);
  const months = MONTHS[lang];
  return (
    <section className="al-gardens" id="gardens" aria-labelledby="al-gardens-h">
      <figure className="al-gardens-img">
        <div className="al-px" data-px="0.1">
          <Img src={IMG.garden} alt={ALT.garden[lang]} sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
      </figure>
      <div className="al-gardens-copy">
        <h2 id="al-gardens-h" className="al-display">
          {t.gardenTitle}
        </h2>
        <p>{t.gardenBody}</p>
        <label className="al-month">
          <span>
            {t.month}: <strong>{months[m]}</strong>
          </span>
          <input type="range" min={0} max={11} step={1} value={m} onChange={(e) => setM(Number(e.target.value))} aria-valuetext={months[m]} />
          <span className="al-month-ticks" aria-hidden>
            {months.map((x, i) => (
              <span key={x} className={i === m ? "is-on" : ""}>
                {x.slice(0, lang === "ar" ? 3 : 1)}
              </span>
            ))}
          </span>
        </label>
        <p className="al-small" aria-live="polite">
          {t.inFlower}: {PLANTS.filter((p) => p.months.includes(m)).map((p) => p.name[lang]).join(lang === "ar" ? "، " : ", ")}
        </p>
        <ul className="al-plants">
          {PLANTS.map((p) => {
            const on = p.months.includes(m);
            return (
              <li key={p.name.en} className={on ? "is-on" : ""} style={v({ "--c": p.color })}>
                <span className="al-plant-dot" aria-hidden />
                {p.name[lang]}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Wellness() {
  const { t, lang } = useAlbora();
  return (
    <section className="al-well" id="wellness" aria-labelledby="al-well-h">
      <div className="al-well-bg">
        <div className="al-px" data-px="0.1">
          <Img src={IMG.wellness} alt={ALT.wellness[lang]} sizes="100vw" widths={[800, 1200, 1600, 2400]} />
        </div>
      </div>
      <div className="al-well-card">
        <h2 id="al-well-h" className="al-display">
          {t.wellTitle}
        </h2>
        <ul>
          {WELLNESS.map((w) => (
            <li key={w.en}>{w[lang]}</li>
          ))}
        </ul>
        <p className="al-small">{t.wellNote}</p>
      </div>
    </section>
  );
}
