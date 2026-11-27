"use client";

// The story before the homes: the hero by day and by night, the village in one sentence, the
// coast drawn as you scroll, the Rif behind the clouds, the architecture, the gardens through the
// year and the pool garden. Pinned scenes write their progress to --p and CSS does the motion.

import { useState, type CSSProperties } from "react";
import { ALT, COAST, COAST_PATH, FIGURES, IMG, MONTHS, PLANTS, PRINCIPLES, WELLNESS } from "@/lib/showcase/albora";
import { sized } from "@/lib/showcase/media";
import { Img } from "../kit/Img";
import { Ring } from "./Chrome";
import { useAlbora, useP } from "./state";

const v = (o: Record<string, string | number>) => o as CSSProperties;

export function Hero() {
  const { t, lang } = useAlbora();
  const [night, setNight] = useState(false);
  const [spot, setSpot] = useState<number | null>(null);
  const { ref } = useP<HTMLElement>("al-hero");
  return (
    <section className={`al-hero al-pin${night ? " is-night" : ""}`} id="al-hero" ref={ref} aria-labelledby="al-hero-h">
      <div className="al-stage">
        <div className="al-hero-media" style={IMG.day ? { backgroundImage: `url(${sized(IMG.day, 64)})` } : undefined}>
          <Img src={IMG.day} alt={ALT.day[lang]} eager sizes="100vw" widths={[800, 1200, 1600, 2400]} className="al-hero-day" />
          <Img src={IMG.night} alt={night ? ALT.night[lang] : ""} sizes="100vw" widths={[800, 1200, 1600, 2400]} className="al-hero-night" />
        </div>
        <div className="al-hero-type">
          <p className="al-hero-side al-hero-left" aria-hidden>
            {t.left}
          </p>
          <div className="al-hero-lockup">
            <h1 id="al-hero-h" className="al-hero-title">
              <span className="al-hero-name">{t.name}</span>
              <span className="al-hero-res">{t.residences}</span>
              <span className="al-sr">
                {" "}
                {t.left} {t.right}, {t.script}
              </span>
            </h1>
            <p className="al-hero-script" aria-hidden>
              {t.script}
            </p>
          </div>
          <p className="al-hero-side al-hero-right" aria-hidden>
            {t.right}
          </p>
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
  const { ref } = useP<HTMLElement>("al-quote");
  const words = t.quote.split(" ");
  return (
    <section className="al-quote al-pin" id="al-quote" ref={ref} aria-label={t.quote}>
      <div className="al-stage">
        <Img src={IMG.lane} alt={ALT.lane[lang]} sizes="100vw" widths={[800, 1200, 1600, 2400]} className="al-quote-img" />
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

export function Concept() {
  const { t, lang } = useAlbora();
  return (
    <section className="al-concept-sec" id="village" aria-labelledby="al-village-h">
      <Img src={IMG.bloom} alt="" sizes="40vw" className="al-bloom al-bloom-a" />
      <Img src={IMG.bloom} alt="" sizes="30vw" className="al-bloom al-bloom-b" />
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
  const { ref } = useP<HTMLElement>("al-golden", 0.1);
  return (
    <section className="al-golden al-pin" id="al-golden" ref={ref} aria-labelledby="al-golden-h">
      <div className="al-stage">
        <div className="al-golden-track">
          <h2 id="al-golden-h" className="al-golden-words">
            <span>{t.golden1}</span> <span>{t.golden2}</span> <span>{t.golden3}</span>
          </h2>
          <figure className="al-golden-fig">
            <Img src={IMG.terrace} alt={ALT.terrace[lang]} sizes="(max-width: 700px) 80vw, 34vw" />
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

/** One cloud layer: fractal noise turned into soft, lit cumulus by an SVG filter, drawn once. */
function Cloud({ seed, fx, fy, k, b, className }: { seed: number; fx: number; fy: number; k: number; b: number; className: string }) {
  const id = `al-cloud-f${seed}`;
  return (
    <div className={`al-cloud ${className}`}>
      <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" className="al-cloud-svg">
        <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={`${fx} ${fy}`} numOctaves={5} seed={seed} result="n" />
          <feColorMatrix in="n" type="matrix" values={`0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 ${k} 0 0 0 ${b}`} result="a" />
          <feDiffuseLighting in="n" surfaceScale={5} diffuseConstant={1.2} lightingColor="#ffffff" result="l">
            <feDistantLight azimuth={255} elevation={58} />
          </feDiffuseLighting>
          <feComposite in="l" in2="a" operator="in" />
        </filter>
        <rect width="1600" height="700" fill="#fff" filter={`url(#${id})`} />
      </svg>
    </div>
  );
}

/** The coast draws itself on the limewash; then the page sinks through the clouds to the Rif. */
export function Coast() {
  const { t, lang } = useAlbora();
  const { ref } = useP<HTMLElement>("coast", 0.1);
  return (
    <section className="al-coast al-pin" id="coast" ref={ref} aria-labelledby="al-coast-h">
      <div className="al-stage">
        <Img src={IMG.rif} alt={ALT.rif[lang]} sizes="120vw" widths={[1200, 1600, 2400]} className="al-rif-img" />
        <div className="al-fog" aria-hidden>
          <div className="al-fog-wash">
            <Cloud seed={7} fx={0.0018} fy={0.0045} k={4.4} b={-1.85} className="al-cloud-back" />
            <Cloud seed={11} fx={0.0026} fy={0.0065} k={5.2} b={-2.25} className="al-cloud-mid" />
            <Cloud seed={3} fx={0.0021} fy={0.005} k={5.8} b={-2.5} className="al-cloud-front" />
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
        <Img src={IMG.aerial} alt={ALT.aerial[lang]} sizes="(max-width: 900px) 100vw, 66vw" />
      </figure>
      {IMG.model && (
        <figure className="al-arch-model">
          <Img src={IMG.model} alt={ALT.model[lang]} sizes="(max-width: 900px) 70vw, 30vw" />
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
        <Img src={IMG.garden} alt={ALT.garden[lang]} sizes="(max-width: 900px) 100vw, 50vw" />
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
      <Img src={IMG.wellness} alt={ALT.wellness[lang]} sizes="100vw" widths={[800, 1200, 1600, 2400]} className="al-well-img" />
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
