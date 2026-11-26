"use client";

// THAHAB: the page runs from gold to indigo like a day in the dunes. Hero, the day in seven
// moments, tents, dining, the ridge, the night planner (real moon phases), after dark, getting here.

import { useState, useSyncExternalStore } from "react";
import { EnquiryForm } from "../kit/EnquiryForm";
import { Img } from "../kit/Img";
import { sized } from "@/lib/showcase/media";
import { ALT, DAY, FAQ, GRID, IMG, NIGHT_TEXT, ROOM_TEXT, TENTS, TRANSFER, aed, darkness, moon } from "@/lib/showcase/thahab";
import { useThahab } from "./state";

export function Hero() {
  const { t, lang } = useThahab();
  return (
    <section className="th-hero" aria-labelledby="th-hero-h">
      <picture className="th-hero-media">
        <source media="(max-width: 700px)" srcSet={[480, 800, 1200].map((w) => `${sized(IMG.heroTall, w)} ${w}w`).join(", ")} sizes="100vw" />
        <img src={sized(IMG.hero, 1600)} srcSet={[800, 1200, 1600].map((w) => `${sized(IMG.hero, w)} ${w}w`).join(", ") + `, ${IMG.hero} 2720w`} sizes="100vw" alt={ALT.hero[lang]} fetchPriority="high" decoding="async" />
      </picture>
      <div className="th-hero-copy">
        <h1 id="th-hero-h">{t.tagline}</h1>
        <p>{t.sub}</p>
        <div className="th-actions">
          <a href="#sky" className="th-btn th-btn-sun">
            {t.plan}
          </a>
          <a href="#day" className="th-btn th-btn-line">
            {t.day}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Day() {
  const { t, lang } = useThahab();
  return (
    <section className="th-day" id="day" aria-labelledby="th-day-h">
      <h2 id="th-day-h">{t.dayTitle}</h2>
      <ol className="th-timeline">
        {DAY.map((d, i) => (
          <li key={d.time} style={{ ["--i" as string]: i }}>
            <time>{d.time}</time>
            <Img src={d.img} alt={d.name[lang]} sizes="(max-width: 700px) 80vw, 30vw" widths={[400, 700, 1000]} />
            <h3>{d.name[lang]}</h3>
            <p>{d.note[lang]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Tents() {
  const { t, lang } = useThahab();
  return (
    <section className="th-tents" id="tents" aria-labelledby="th-tents-h">
      <h2 id="th-tents-h">{t.tentsTitle}</h2>
      <div className="th-tent-list">
        {TENTS.map((x) => (
          <article key={x.id}>
            <Img src={x.img} alt={ALT[x.id as "suite" | "family"][lang]} sizes="(max-width: 900px) 100vw, 50vw" widths={[700, 1100, 1500]} />
            <h3>{x.name[lang]}</h3>
            <p>{x.note[lang]}</p>
            <p className="th-tent-meta">
              {t.sleeps(x.sleeps)}. {t.count(x.count)}. <strong>{aed(x.price, lang)}</strong> {t.perNight}
            </p>
          </article>
        ))}
      </div>
      <ul className="th-strip">
        {GRID.room.map((src, i) => (
          <li key={i}>
            <Img src={src} alt={ROOM_TEXT[i][lang]} sizes="(max-width: 700px) 50vw, 25vw" widths={[400, 700]} />
            <p>{ROOM_TEXT[i][lang]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Dining() {
  const { t } = useThahab();
  return (
    <section className="th-dining" id="dining" aria-labelledby="th-dining-h">
      <h2 id="th-dining-h">{t.diningTitle}</h2>
      <ul className="th-strip">
        {GRID.dining.map((src, i) => (
          <li key={i}>
            <Img src={src} alt={t.diningNote[i]} sizes="(max-width: 700px) 50vw, 25vw" widths={[400, 700]} />
            <p>{t.diningNote[i]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Place() {
  const { t, lang } = useThahab();
  return (
    <section className="th-place" aria-labelledby="th-place-h">
      <Img src={IMG.aerial} alt={ALT.aerial[lang]} sizes="(max-width: 900px) 100vw, 60vw" widths={[800, 1200, 1600]} />
      <div>
        <h2 id="th-place-h">{t.placeTitle}</h2>
        <p>{t.placeBody}</p>
        <Img src={IMG.oasis} alt={ALT.oasis[lang]} sizes="(max-width: 900px) 100vw, 35vw" widths={[600, 900]} />
      </div>
    </section>
  );
}

function Moon({ phase, size = 26 }: { phase: number; size?: number }) {
  // the lit part of the disc: a half circle plus an ellipse that grows and shrinks with the phase
  const r = 10;
  const waxing = phase < 0.5;
  const k = Math.cos(2 * Math.PI * phase); // 1 new, -1 full
  const rx = Math.abs(k) * r;
  const outer = waxing ? 1 : 0; // waxing: lit on the right
  const inner = k > 0 ? (waxing ? 0 : 1) : waxing ? 1 : 0;
  const d = `M12 2 A${r} ${r} 0 0 ${outer} 12 22 A${rx.toFixed(2)} ${r} 0 0 ${inner} 12 2Z`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="th-moon">
      <circle cx="12" cy="12" r={r} className="dark" />
      <path d={d} className="lit" />
    </svg>
  );
}

const noSub = () => () => {};
export function Sky() {
  const { t, lang, open } = useThahab();
  const today = useSyncExternalStore(noSub, () => new Date().toISOString().slice(0, 10), () => "");
  const [arrive, setArrive] = useState(-1);
  const [nights, setNights] = useState(3);
  const [tent, setTent] = useState("suite");
  const [transfer, setTransfer] = useState("drive");
  const [tried, setTried] = useState(false);
  const days = today ? Array.from({ length: 42 }, (_, i) => new Date(new Date(today + "T12:00:00Z").getTime() + i * 864e5)) : [];
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang === "ar" ? "ar-AE-u-nu-latn" : "en-GB", { ...o, timeZone: "UTC" }).format(d);
  const stay = arrive >= 0 ? days.slice(arrive, arrive + nights) : [];
  const moons = stay.map((d) => ({ d, ...moon(d) }));
  const darkest = moons.reduce<(typeof moons)[number] | null>((a, b) => (!a || b.lit < a.lit ? b : a), null);
  const tentP = TENTS.find((x) => x.id === tent)!;
  const total = tentP.price * nights + (TRANSFER.find((x) => x.id === transfer)?.price ?? 0);
  return (
    <section className="th-sky" id="sky" aria-labelledby="th-sky-h">
      <div className="th-stars" aria-hidden />
      <header className="th-head">
        <h2 id="th-sky-h">{t.skyTitle}</h2>
        <p>{t.skyIntro}</p>
      </header>
      <div className="th-sky-grid">
        <div className="th-cal" role="group" aria-label={t.arrive}>
          {days.map((d, i) => {
            const m = moon(d);
            const inStay = arrive >= 0 && i >= arrive && i < arrive + nights;
            return (
              <button
                key={i}
                type="button"
                className={`${inStay ? "in-stay" : ""}${i === arrive ? " is-start" : ""}`}
                aria-pressed={i === arrive}
                aria-label={`${fmt(d, { weekday: "long", day: "numeric", month: "long" })}, ${Math.round(darkness(m.lit) * 100)}%`}
                onClick={() => setArrive(i)}
                style={{ ["--dark" as string]: darkness(m.lit) }}
              >
                <span className="th-cal-d">{i === 0 ? t.tonight : fmt(d, { day: "numeric", month: "short" })}</span>
                <Moon phase={m.phase} size={22} />
              </button>
            );
          })}
        </div>
        <div className="th-sheet" aria-live="polite">
          <fieldset className="th-seg">
            <legend>{t.nights}</legend>
            {[2, 3, 4, 5].map((n) => (
              <button key={n} type="button" aria-pressed={nights === n} onClick={() => setNights(n)}>
                {n}
              </button>
            ))}
          </fieldset>
          <fieldset className="th-seg">
            <legend>{t.tent}</legend>
            {TENTS.map((x) => (
              <button key={x.id} type="button" aria-pressed={tent === x.id} onClick={() => setTent(x.id)}>
                {x.name[lang]}
              </button>
            ))}
          </fieldset>
          <fieldset className="th-seg">
            <legend>{t.transfer}</legend>
            {TRANSFER.map((x) => (
              <button key={x.id} type="button" aria-pressed={transfer === x.id} onClick={() => setTransfer(x.id)}>
                {x.name[lang]}
              </button>
            ))}
          </fieldset>
          {darkest ? (
            <div className="th-verdict">
              <div className="th-stay-moons">
                {moons.map((m, i) => (
                  <span key={i}>
                    <Moon phase={m.phase} size={34} />
                    <small>{fmt(m.d, { weekday: "short" })}</small>
                  </span>
                ))}
              </div>
              <p>{t.darkest(fmt(darkest.d, { weekday: "long", day: "numeric", month: "long" }), Math.round(darkness(darkest.lit) * 100))}</p>
              {moons.some((m) => m.lit < 0.08) && <p className="th-good">{t.newGood}</p>}
              {moons.every((m) => m.lit > 0.8) && <p className="th-warn">{t.fullWarn}</p>}
            </div>
          ) : (
            tried && (
              <p className="th-err" role="alert">
                {t.pickArrive}
              </p>
            )
          )}
          <p className="th-total">
            <span>{t.total}</span>
            {aed(total, lang)}
          </p>
          <button type="button" className="th-btn th-btn-sun" onClick={() => { setTried(true); if (arrive >= 0) open("notice"); }}>
            {t.reserve}
          </button>
        </div>
      </div>
    </section>
  );
}

export function AfterDark() {
  const { t, lang } = useThahab();
  return (
    <section className="th-dark" aria-labelledby="th-dark-h">
      <h2 id="th-dark-h">{t.materialsTitle}</h2>
      <ul className="th-strip">
        {GRID.night.map((src, i) => (
          <li key={i}>
            <Img src={src} alt={NIGHT_TEXT[i][lang]} sizes="(max-width: 700px) 50vw, 25vw" widths={[400, 700]} />
            <p>{NIGHT_TEXT[i][lang]}</p>
          </li>
        ))}
      </ul>
      <ul className="th-strip th-spa">
        {GRID.spa.map((src, i) => (
          <li key={i}>
            <Img src={src} alt="" sizes="(max-width: 700px) 50vw, 25vw" widths={[400, 700]} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Arrive() {
  const { t, lang } = useThahab();
  return (
    <section className="th-arrive" id="arrive" aria-labelledby="th-arrive-h">
      <Img src={IMG.arrival} alt={ALT.arrival[lang]} widths={[800, 1200, 1600, 2000]} />
      <div>
        <h2 id="th-arrive-h">{t.arriveTitle}</h2>
        <p>{t.arriveBody}</p>
        <ul>
          {TRANSFER.map((x) => (
            <li key={x.id}>
              <strong>{x.name[lang]}</strong> {x.note[lang]}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Contact() {
  const { t, lang } = useThahab();
  return (
    <section className="th-contact" id="contact" aria-labelledby="th-contact-h">
      <div>
        <h2 id="th-contact-h">{t.contactTitle}</h2>
        <p>{t.contactIntro}</p>
      </div>
      <EnquiryForm site="thahab" lang={lang} labels={t.form} prefix="th" interestOptions={t.interests} />
    </section>
  );
}

export function Faq() {
  const { t, lang } = useThahab();
  return (
    <section className="th-faq" id="faq" aria-labelledby="th-faq-h">
      <h2 id="th-faq-h">{t.faqTitle}</h2>
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
