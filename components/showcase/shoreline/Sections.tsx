"use client";

// SHORELINE NO. 9: one house. The hero, the facts, the plan you can walk (the signature), the view
// that pans as you scroll, night, materials, living, the area, the viewing request, contact, FAQ.

import { useCallback, useState } from "react";
import { EnquiryForm } from "../kit/EnquiryForm";
import { Img } from "../kit/Img";
import { sized } from "@/lib/showcase/media";
import { ALT, AREA, FACTS, FAQ, GRID, IMG, LEVELS, MATERIALS, PLAN_H, PLAN_W, ROOMS } from "@/lib/showcase/shoreline";
import { useScrollStage } from "../useScrollStage";
import { useShore } from "./state";

export function Hero() {
  const { t, lang } = useShore();
  return (
    <section className="sh-hero" id="house" aria-labelledby="sh-hero-h">
      <picture className="sh-hero-media">
        <source media="(max-width: 700px)" srcSet={[480, 800, 1200].map((w) => `${sized(IMG.heroTall, w)} ${w}w`).join(", ")} sizes="100vw" />
        <img src={sized(IMG.hero, 1600)} srcSet={[800, 1200, 1600].map((w) => `${sized(IMG.hero, w)} ${w}w`).join(", ") + `, ${IMG.hero} 2720w`} sizes="100vw" alt={ALT.hero[lang]} fetchPriority="high" decoding="async" />
      </picture>
      <div className="sh-hero-copy">
        <p className="sh-nine" aria-hidden>
          9
        </p>
        <h1 id="sh-hero-h">{t.tagline}</h1>
        <p>{t.sub}</p>
        <div className="sh-actions">
          <a href="#plan" className="sh-btn sh-btn-sun">
            {t.explore}
          </a>
          <a href="#viewing" className="sh-btn sh-btn-line">
            {t.request}
          </a>
        </div>
      </div>
      <dl className="sh-facts">
        {FACTS.map((f) => (
          <div key={f.v}>
            <dd>{f.v}</dd>
            <dt>{f.k[lang]}</dt>
          </div>
        ))}
        <div>
          <dd className="sh-price">{t.price}</dd>
        </div>
      </dl>
    </section>
  );
}

export function Plan() {
  const { t, lang } = useShore();
  const [level, setLevel] = useState(1);
  const [room, setRoom] = useState("living");
  const rooms = ROOMS.filter((r) => r.level === level);
  const sel = ROOMS.find((r) => r.id === room && r.level === level) ?? rooms[0];
  const pickLevel = (l: number) => {
    setLevel(l);
    setRoom(ROOMS.find((r) => r.level === l && r.img)?.id ?? ROOMS.find((r) => r.level === l)!.id);
  };
  return (
    <section className="sh-plan" id="plan" aria-labelledby="sh-plan-h">
      <header className="sh-head">
        <h2 id="sh-plan-h">{t.planTitle}</h2>
        <p>{t.planIntro}</p>
      </header>
      <div className="sh-levels" role="tablist" aria-label={t.planTitle}>
        {LEVELS.map((l, i) => (
          <button key={i} type="button" role="tab" aria-selected={level === i} onClick={() => pickLevel(i)}>
            {l[lang]}
          </button>
        ))}
      </div>
      <div className="sh-plan-grid">
        <svg viewBox={`-1 -1 ${PLAN_W + 2} ${PLAN_H + 7}`} className="sh-plan-svg" direction="ltr" aria-label={LEVELS[level][lang]} role="group">
          <rect x="0" y="0" width={PLAN_W} height={PLAN_H} className="sh-plot" />
          {rooms.map((r) => (
            <g
              key={r.id}
              role="button"
              tabIndex={0}
              aria-pressed={sel.id === r.id}
              aria-label={`${r.name[lang]}, ${r.m2} m²`}
              className={`sh-room${sel.id === r.id ? " is-on" : ""}`}
              onClick={() => setRoom(r.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setRoom(r.id);
                }
              }}
              data-cursor="link"
            >
              <rect x={r.r[0]} y={r.r[1]} width={r.r[2]} height={r.r[3]} rx="0.4" />
              <text x={r.r[0] + r.r[2] / 2} y={r.r[1] + r.r[3] / 2} textAnchor="middle">
                {r.name[lang]}
              </text>
              <text x={r.r[0] + r.r[2] / 2} y={r.r[1] + r.r[3] / 2 + 1.6} textAnchor="middle" className="sh-m2">
                {r.m2} m²
              </text>
            </g>
          ))}
          {level === 1 && <rect x="2" y={PLAN_H + 0.6} width="36" height="1.8" rx="0.3" className="sh-pool" />}
          <path d={`M-1 ${PLAN_H + 3.6} q 3 -1 6 0 t 6 0 t 6 0 t 6 0 t 6 0 t 6 0 t 6 0`} className="sh-wave" />
          <text x={PLAN_W / 2} y={PLAN_H + 5.6} textAnchor="middle" className="sh-sea">
            {t.sea}
          </text>
        </svg>
        <div className="sh-room-card" aria-live="polite">
          <div className="sh-room-img">{sel.img ? <Img src={sel.img} alt={sel.name[lang]} sizes="(max-width: 900px) 100vw, 40vw" widths={[600, 900]} /> : <p>{t.noPhoto}</p>}</div>
          <h3>{sel.name[lang]}</h3>
          <p className="sh-room-m2">{sel.m2} m²</p>
          <p>{sel.note[lang]}</p>
        </div>
      </div>
    </section>
  );
}

export function View() {
  const { t, lang } = useShore();
  const [p, setP] = useState(0);
  const onFrame = useCallback((v: number) => setP(Math.round(v * 500) / 500), []);
  const { ref } = useScrollStage<HTMLElement>(onFrame, 0.12);
  return (
    <section className="sh-view" id="view" ref={ref} aria-labelledby="sh-view-h">
      <div className="sh-view-stage">
        <div className="sh-view-pan" style={{ transform: `translateX(${(-p * 30).toFixed(2)}%)` }}>
          <Img src={IMG.view} alt={ALT.view[lang]} sizes="180vw" widths={[1200, 1600, 2400]} />
        </div>
        <h2 id="sh-view-h">{t.viewTitle}</h2>
      </div>
    </section>
  );
}

export function Night() {
  const { t, lang } = useShore();
  return (
    <figure className="sh-night">
      <Img src={IMG.night} alt={ALT.night[lang]} widths={[800, 1200, 1600, 2000]} />
      <figcaption>{t.nightLine}</figcaption>
    </figure>
  );
}

export function Materials() {
  const { t, lang } = useShore();
  return (
    <section className="sh-mat" id="materials" aria-labelledby="sh-mat-h">
      <h2 id="sh-mat-h">{t.materialsTitle}</h2>
      <ul>
        {GRID.materials.map((src, i) => (
          <li key={i}>
            <Img src={src} alt="" sizes="(max-width: 700px) 50vw, 25vw" widths={[400, 700]} />
            <p>{MATERIALS[i][lang]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Living() {
  const { t, lang } = useShore();
  return (
    <section className="sh-living" aria-labelledby="sh-living-h">
      <Img src={IMG.living} alt={ALT.living[lang]} sizes="(max-width: 900px) 100vw, 60vw" widths={[800, 1200, 1600]} />
      <div>
        <h2 id="sh-living-h">{t.livingTitle}</h2>
        <p>{t.livingBody}</p>
      </div>
    </section>
  );
}

export function Area() {
  const { t, lang } = useShore();
  return (
    <section className="sh-area" id="area" aria-labelledby="sh-area-h">
      <h2 id="sh-area-h">{t.areaTitle}</h2>
      <div className="sh-area-grid">
        <Img src={IMG.aerial} alt={ALT.aerial[lang]} sizes="(max-width: 900px) 100vw, 50vw" widths={[800, 1200, 1600]} className="sh-aerial" />
        <ul>
          {GRID.area.map((src, i) => (
            <li key={i}>
              <Img src={src} alt="" sizes="(max-width: 900px) 50vw, 25vw" widths={[400, 700]} />
              <p>{AREA[i][lang]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Viewing() {
  const { t, open } = useShore();
  const [win, setWin] = useState("next");
  const [light, setLight] = useState("sunset");
  const [party, setParty] = useState("me");
  const [funds, setFunds] = useState(false);
  const [tried, setTried] = useState(false);
  const seg = (legend: string, list: { id: string; name: string }[], v: string, set: (s: string) => void) => (
    <fieldset className="sh-seg">
      <legend>{legend}</legend>
      {list.map((o) => (
        <button key={o.id} type="button" aria-pressed={v === o.id} onClick={() => set(o.id)}>
          {o.name}
        </button>
      ))}
    </fieldset>
  );
  return (
    <section className="sh-viewing" id="viewing" aria-labelledby="sh-viewing-h">
      <div>
        <h2 id="sh-viewing-h">{t.viewingTitle}</h2>
        <p>{t.viewingIntro}</p>
      </div>
      <div className="sh-viewing-form">
        {seg(t.when, t.windows, win, setWin)}
        {seg(t.light, t.lights, light, setLight)}
        {seg(t.party, t.parties, party, setParty)}
        <label className="sh-funds">
          <input type="checkbox" checked={funds} onChange={(e) => setFunds(e.target.checked)} />
          <span>{t.funds}</span>
        </label>
        {tried && !funds && (
          <p className="sh-err" role="alert">
            {t.needFunds}
          </p>
        )}
        <button type="button" className="sh-btn sh-btn-sun" onClick={() => { setTried(true); if (funds) open("notice"); }}>
          {t.send}
        </button>
      </div>
    </section>
  );
}

export function Contact() {
  const { t, lang } = useShore();
  return (
    <section className="sh-contact" id="contact" aria-labelledby="sh-contact-h">
      <div>
        <h2 id="sh-contact-h">{t.contactTitle}</h2>
        <p>{t.contactIntro}</p>
      </div>
      <EnquiryForm site="shoreline-9" lang={lang} labels={t.form} prefix="sh" interestOptions={t.interests} />
    </section>
  );
}

export function Faq() {
  const { t, lang } = useShore();
  return (
    <section className="sh-faq" id="faq" aria-labelledby="sh-faq-h">
      <h2 id="sh-faq-h">{t.faqTitle}</h2>
      <div>
        {FAQ.map((f, i) => (
          <details key={f.q.en} open={i === 0}>
            <summary>{f.q[lang]}</summary>
            <p>{f.a[lang]}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
