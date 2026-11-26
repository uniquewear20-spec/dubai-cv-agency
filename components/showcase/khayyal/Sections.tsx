"use client";

// KHAYYAL: the hero, the light you move along the car, the configurator, details, cabin, the drive,
// the story, the test-drive booking, contact and questions.

import { useState, useSyncExternalStore, type PointerEvent } from "react";
import { EnquiryForm } from "../kit/EnquiryForm";
import { Img } from "../kit/Img";
import { sized } from "@/lib/showcase/media";
import { ALT, CABIN, COLOURS, DETAILS, FAQ, FIGURES, GRID, IMG, OPTIONS, SHOWROOMS, TIMES, TRIMS, WHEELS, aed, priceOf, takenTimes, BASE_PRICE } from "@/lib/showcase/khayyal";
import { useKhayyal } from "./state";

export function Hero() {
  const { t, lang } = useKhayyal();
  return (
    <section className="kh-hero" aria-labelledby="kh-hero-h">
      <picture className="kh-hero-media">
        <source media="(max-width: 700px)" srcSet={[480, 800, 1200].map((w) => `${sized(IMG.heroTall, w)} ${w}w`).join(", ")} sizes="100vw" />
        <img src={sized(IMG.hero, 1600)} srcSet={[800, 1200, 1600].map((w) => `${sized(IMG.hero, w)} ${w}w`).join(", ") + `, ${IMG.hero} 2720w`} sizes="100vw" alt={ALT.hero[lang]} fetchPriority="high" decoding="async" />
      </picture>
      <span className="kh-blade" aria-hidden />
      <div className="kh-hero-copy">
        <h1 id="kh-hero-h">{t.tagline}</h1>
        <p>{t.sub}</p>
        <div className="kh-actions">
          <a href="#build" className="kh-btn kh-btn-sun">
            {t.configure}
          </a>
          <a href="#visit" className="kh-btn kh-btn-line">
            {t.testDrive}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Light() {
  const { t, lang } = useKhayyal();
  const [x, setX] = useState(30);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" && e.buttons === 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const f = (e.clientX - r.left) / r.width;
    setX(Math.round(Math.max(0, Math.min(1, f)) * 100));
  };
  return (
    <section className="kh-light" id="light" aria-labelledby="kh-light-h">
      <header className="kh-head">
        <h2 id="kh-light-h">{t.lightTitle}</h2>
        <p>{t.lightIntro}</p>
      </header>
      <div className="kh-light-stage" style={{ ["--x" as string]: `${x}%` }} onPointerMove={move} onPointerDown={move} data-cursor="drag">
        <Img src={IMG.profile} alt={ALT.profile[lang]} widths={[800, 1200, 1600, 2000]} />
        <span className="kh-light-beam" aria-hidden />
      </div>
      <label className="kh-light-range">
        <span className="kh-sr">{t.lightLabel}</span>
        <input type="range" min={0} max={100} value={x} onChange={(e) => setX(Number(e.target.value))} dir="ltr" />
      </label>
      <h3 className="kh-sub">{t.detailsTitle}</h3>
      <ul className="kh-tiles">
        {GRID.details.map((src, i) => (
          <li key={i}>
            <Img src={src} alt={DETAILS[i].name[lang]} sizes="(max-width: 700px) 50vw, 25vw" widths={[400, 700]} />
            <h4>{DETAILS[i].name[lang]}</h4>
            <p>{DETAILS[i].note[lang]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Choice<T extends { id: string; name: { en: string; ar: string }; price: number }>({ legend, name, list, value, onPick, multi, values }: { legend: string; name: string; list: T[]; value?: string; values?: string[]; multi?: boolean; onPick: (id: string) => void }) {
  const { lang } = useKhayyal();
  return (
    <fieldset className="kh-choice">
      <legend>{legend}</legend>
      {list.map((o) => {
        const on = multi ? values!.includes(o.id) : value === o.id;
        return (
          <label key={o.id} className={on ? "is-on" : ""}>
            <input type={multi ? "checkbox" : "radio"} name={name} checked={on} onChange={() => onPick(o.id)} />
            <span>{o.name[lang]}</span>
            <small>{o.price ? `+ ${aed(o.price)}` : "—"}</small>
          </label>
        );
      })}
    </fieldset>
  );
}

export function Configurator() {
  const { t, lang, build, setBuild, open } = useKhayyal();
  const colour = COLOURS.find((c) => c.id === build.colour) ?? COLOURS[0];
  return (
    <section className="kh-build" id="build" aria-labelledby="kh-build-h">
      <header className="kh-head">
        <h2 id="kh-build-h">{t.buildTitle}</h2>
        <p>{t.buildIntro}</p>
      </header>
      <div className="kh-build-grid">
        <div className="kh-build-view">
          {GRID.colours.map((src, i) => (
            <Img key={i} src={src} alt={i === colour.cell ? `${ALT.hero[lang]}: ${COLOURS[i].name[lang]}` : ""} className={i === colour.cell ? "is-on" : ""} sizes="(max-width: 900px) 100vw, 55vw" widths={[600, 900, 1200]} eager={i === 0} />
          ))}
          <div className="kh-swatches" role="radiogroup" aria-label={t.colour}>
            {COLOURS.map((c) => (
              <button key={c.id} type="button" role="radio" aria-checked={c.id === build.colour} aria-label={c.name[lang]} style={{ background: c.hex }} onClick={() => setBuild((b) => ({ ...b, colour: c.id }))} />
            ))}
            <span>{colour.name[lang]}</span>
          </div>
        </div>
        <div className="kh-sheet-panel">
          <Choice legend={t.wheels} name="kh-wheel" list={WHEELS} value={build.wheel} onPick={(id) => setBuild((b) => ({ ...b, wheel: id }))} />
          <Choice legend={t.trim} name="kh-trim" list={TRIMS} value={build.trim} onPick={(id) => setBuild((b) => ({ ...b, trim: id }))} />
          <Choice legend={t.extras} name="kh-opt" list={OPTIONS} multi values={build.options} onPick={(id) => setBuild((b) => ({ ...b, options: b.options.includes(id) ? b.options.filter((o) => o !== id) : [...b.options, id] }))} />
          <dl className="kh-total" aria-live="polite">
            <div>
              <dt>{t.base}</dt>
              <dd>{aed(BASE_PRICE)}</dd>
            </div>
            <div className="is-total">
              <dt>{t.total}</dt>
              <dd>{aed(priceOf(build))}</dd>
            </div>
          </dl>
          <button type="button" className="kh-btn kh-btn-sun" onClick={() => open("notice")}>
            {t.reserve}
          </button>
          <dl className="kh-figures">
            {FIGURES.map((f) => (
              <div key={f.v}>
                <dt>{f.k[lang]}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
          <p className="kh-note">{t.figuresNote}</p>
        </div>
      </div>
    </section>
  );
}

export function Cabin() {
  const { t, lang } = useKhayyal();
  return (
    <section className="kh-cabin" id="cabin" aria-labelledby="kh-cabin-h">
      <h2 id="kh-cabin-h">{t.cabinTitle}</h2>
      <ul>
        {GRID.cabin.map((src, i) => (
          <li key={i}>
            <Img src={src} alt={CABIN[i].name[lang]} sizes="(max-width: 700px) 100vw, 50vw" widths={[600, 900, 1200]} />
            <p>
              <strong>{CABIN[i].name[lang]}</strong> {CABIN[i].note[lang]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Drive() {
  const { t, lang } = useKhayyal();
  return (
    <section className="kh-drive" id="drive" aria-label={t.nav.drive}>
      <figure>
        <Img src={IMG.drive} alt={ALT.drive[lang]} widths={[800, 1200, 1600, 2000]} />
        <figcaption>{t.driveLine}</figcaption>
      </figure>
      <figure>
        <Img src={IMG.night} alt={ALT.night[lang]} sizes="(max-width: 900px) 100vw, 60vw" widths={[800, 1200, 1600]} />
        <figcaption>{t.nightLine}</figcaption>
      </figure>
    </section>
  );
}

export function Story() {
  const { t, lang } = useKhayyal();
  return (
    <section className="kh-story" aria-labelledby="kh-story-h">
      <Img src={IMG.falcon} alt={ALT.falcon[lang]} sizes="(max-width: 900px) 100vw, 60vw" widths={[800, 1200, 1600]} />
      <div>
        <h2 id="kh-story-h">{t.storyTitle}</h2>
        <p>{t.storyBody}</p>
      </div>
    </section>
  );
}

const noSub = () => () => {};
function useDays() {
  // the next 14 days exist only in the browser (the page itself is prerendered)
  const today = useSyncExternalStore(noSub, () => new Date().toISOString().slice(0, 10), () => "");
  if (!today) return [];
  const d0 = new Date(today + "T12:00:00Z");
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(d0.getTime() + (i + 1) * 864e5);
    return { iso: d.toISOString().slice(0, 10), dow: d.getUTCDay(), d };
  });
}

export function Visit() {
  const { t, lang, open } = useKhayyal();
  const days = useDays();
  const [room, setRoom] = useState(SHOWROOMS[0].id);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [tried, setTried] = useState(false);
  const sr = SHOWROOMS.find((s) => s.id === room)!;
  const open7 = days.filter((d) => sr.days.includes(d.dow));
  const chosen = open7.find((d) => d.iso === day) ?? open7[0];
  const taken = chosen ? takenTimes(room, chosen.iso) : [];
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang === "ar" ? "ar-AE-u-nu-latn" : "en-GB", { ...o, timeZone: "UTC" }).format(d);
  return (
    <section className="kh-visit" id="visit" aria-labelledby="kh-visit-h">
      <Img src={IMG.showroom} alt={ALT.showroom[lang]} sizes="(max-width: 900px) 100vw, 50vw" widths={[800, 1200, 1600]} />
      <div className="kh-visit-panel">
        <h2 id="kh-visit-h">{t.visitTitle}</h2>
        <p>{t.visitIntro}</p>
        <fieldset className="kh-seg">
          <legend>{t.showroom}</legend>
          {SHOWROOMS.map((s) => (
            <button key={s.id} type="button" aria-pressed={s.id === room} onClick={() => { setRoom(s.id); setTime(""); }}>
              {s.name[lang]}
            </button>
          ))}
        </fieldset>
        <fieldset className="kh-days">
          <legend>{t.day}</legend>
          {open7.map((d) => (
            <button key={d.iso} type="button" aria-pressed={chosen?.iso === d.iso} onClick={() => { setDay(d.iso); setTime(""); }}>
              <span>{fmt(d.d, { weekday: "short" })}</span>
              {fmt(d.d, { day: "numeric" })}
            </button>
          ))}
        </fieldset>
        <fieldset className="kh-times">
          <legend>{t.time}</legend>
          {TIMES.map((h) => {
            const off = taken.includes(h);
            return (
              <button key={h} type="button" disabled={off} aria-pressed={time === h} onClick={() => setTime(h)}>
                {h}
                {off && <small>{t.taken}</small>}
              </button>
            );
          })}
        </fieldset>
        {chosen && time && <p className="kh-when">{t.yourDrive(`${fmt(chosen.d, { weekday: "long", day: "numeric", month: "long" })}, ${time}`, sr.name[lang])}</p>}
        {tried && !time && (
          <p className="kh-err" role="alert">
            {t.pickTime}
          </p>
        )}
        <button
          type="button"
          className="kh-btn kh-btn-sun"
          onClick={() => {
            setTried(true);
            if (time) open("notice");
          }}
        >
          {t.book}
        </button>
      </div>
    </section>
  );
}

export function Contact() {
  const { t, lang } = useKhayyal();
  return (
    <section className="kh-contact" id="contact" aria-labelledby="kh-contact-h">
      <div>
        <h2 id="kh-contact-h">{t.contactTitle}</h2>
        <p>{t.contactIntro}</p>
      </div>
      <EnquiryForm site="khayyal" lang={lang} labels={t.form} prefix="kh" interestOptions={t.interests} />
    </section>
  );
}

export function Faq() {
  const { t, lang } = useKhayyal();
  return (
    <section className="kh-faq" id="faq" aria-labelledby="kh-faq-h">
      <h2 id="kh-faq-h">{t.faqTitle}</h2>
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
