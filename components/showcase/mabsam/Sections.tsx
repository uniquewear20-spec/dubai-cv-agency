"use client";

// MABSAM: hero, the treatment finder (the signature), rooms and the first visit, the clinic, care,
// a breathing exercise, booking, contact and questions.

import { useEffect, useState, useSyncExternalStore } from "react";
import { EnquiryForm } from "../kit/EnquiryForm";
import { Img } from "../kit/Img";
import { sized } from "@/lib/showcase/media";
import { ALT, CARE, CLINIC, CONCERNS, DETAILS, FAQ, GRID, IMG, NERVES, SPANS, TIMES, shortlist, takenTimes } from "@/lib/showcase/mabsam";
import { useMabsam } from "./state";

export function Hero() {
  const { t, lang } = useMabsam();
  return (
    <section className="mb-hero" aria-labelledby="mb-hero-h">
      <div className="mb-hero-copy">
        <h1 id="mb-hero-h">{t.tagline}</h1>
        <p>{t.sub}</p>
        <div className="mb-actions">
          <a href="#finder" className="mb-btn mb-btn-sun">
            {t.find}
          </a>
          <a href="#visit" className="mb-btn mb-btn-line">
            {t.book}
          </a>
        </div>
      </div>
      <picture className="mb-hero-media">
        <source media="(max-width: 700px)" srcSet={[480, 800, 1200].map((w) => `${sized(IMG.heroTall, w)} ${w}w`).join(", ")} sizes="100vw" />
        <img src={sized(IMG.hero, 1600)} srcSet={[800, 1200, 1600].map((w) => `${sized(IMG.hero, w)} ${w}w`).join(", ")} sizes="(max-width: 700px) 100vw, 60vw" alt={ALT.hero[lang]} fetchPriority="high" decoding="async" />
      </picture>
    </section>
  );
}

export function Finder() {
  const { t, lang, finder, setFinder } = useMabsam();
  const { fits, longer } = shortlist(finder.concerns, finder.span);
  const nerves = NERVES.find((n) => n.id === finder.nerves) ?? NERVES[1];
  const toggle = (id: string) => setFinder((f) => ({ ...f, concerns: f.concerns.includes(id) ? f.concerns.filter((c) => c !== id) : [...f.concerns, id] }));
  const card = (tx: (typeof fits)[number], dim?: boolean) => (
    <li key={tx.id} className={dim ? "is-longer" : ""}>
      <h4>{tx.name[lang]}</h4>
      <p>{tx.what[lang]}</p>
      <dl>
        <div>
          <dt>{lang === "ar" ? "الزيارات" : "Visits"}</dt>
          <dd>{tx.visits[lang]}</dd>
        </div>
        <div>
          <dt>{lang === "ar" ? "نطاق السعر" : "Range"}</dt>
          <dd>{tx.price[lang]}</dd>
        </div>
      </dl>
    </li>
  );
  return (
    <section className="mb-finder" id="finder" aria-labelledby="mb-finder-h">
      <header className="mb-head">
        <h2 id="mb-finder-h">{t.finderTitle}</h2>
        <p>{t.finderIntro}</p>
      </header>
      <div className="mb-finder-grid">
        <div className="mb-qs">
          <fieldset>
            <legend>{t.q1}</legend>
            <div className="mb-chips">
              {CONCERNS.map((c) => (
                <label key={c.id} className={finder.concerns.includes(c.id) ? "is-on" : ""}>
                  <input type="checkbox" checked={finder.concerns.includes(c.id)} onChange={() => toggle(c.id)} />
                  {c.name[lang]}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t.q2}</legend>
            <div className="mb-chips">
              {NERVES.map((n) => (
                <label key={n.id} className={finder.nerves === n.id ? "is-on" : ""}>
                  <input type="radio" name="mb-nerves" checked={finder.nerves === n.id} onChange={() => setFinder((f) => ({ ...f, nerves: n.id }))} />
                  {n.name[lang]}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t.q3}</legend>
            <div className="mb-chips">
              {SPANS.map((s) => (
                <label key={s.id} className={finder.span === s.id ? "is-on" : ""}>
                  <input type="radio" name="mb-span" checked={finder.span === s.id} onChange={() => setFinder((f) => ({ ...f, span: s.id }))} />
                  {s.name[lang]}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="mb-result" aria-live="polite">
          {fits.length + longer.length === 0 ? (
            <p className="mb-empty">{t.nothing}</p>
          ) : (
            <>
              <h3>{t.options}</h3>
              <ul className="mb-tx">{fits.map((x) => card(x))}</ul>
              {longer.length > 0 && (
                <>
                  <h3 className="mb-longer-h">{t.takesLonger}</h3>
                  <ul className="mb-tx">{longer.map((x) => card(x, true))}</ul>
                </>
              )}
            </>
          )}
          <div className="mb-comfort">
            <h3>{t.comfortTitle}</h3>
            <ul>
              {nerves.comfort.map((c) => (
                <li key={c.en}>{c[lang]}</li>
              ))}
            </ul>
          </div>
          <p className="mb-note">{t.priceNote}</p>
          <a href="#visit" className="mb-btn mb-btn-sun">
            {t.bookThis}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Rooms() {
  const { t, lang } = useMabsam();
  return (
    <section className="mb-rooms" aria-labelledby="mb-rooms-h">
      <figure>
        <Img src={IMG.room} alt={ALT.room[lang]} sizes="(max-width: 900px) 100vw, 50vw" widths={[700, 1100, 1500]} />
      </figure>
      <div>
        <h2 id="mb-rooms-h">{t.roomTitle}</h2>
        <p>{t.roomBody}</p>
      </div>
      <figure>
        <Img src={IMG.visit} alt={ALT.visit[lang]} sizes="(max-width: 900px) 100vw, 50vw" widths={[700, 1100, 1500]} />
      </figure>
      <div>
        <h2>{t.firstTitle}</h2>
        <ol className="mb-steps">
          {t.firstSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Row({ id, title, imgs, captions }: { id?: string; title: string; imgs: string[]; captions: { en: string; ar: string }[] }) {
  const { lang } = useMabsam();
  return (
    <section className="mb-row" id={id} aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {imgs.map((src, i) => (
          <li key={i}>
            <Img src={src} alt="" sizes="(max-width: 700px) 50vw, 25vw" widths={[400, 700]} />
            <p>{captions[i][lang]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
export function Clinic() {
  const { t } = useMabsam();
  return <Row id="clinic" title={t.clinicTitle} imgs={GRID.clinic} captions={CLINIC} />;
}
export function Small() {
  const { t } = useMabsam();
  return <Row title={t.detailsTitle} imgs={GRID.details} captions={DETAILS} />;
}
export function Care() {
  const { t } = useMabsam();
  return <Row id="care" title={t.careTitle} imgs={GRID.care} captions={CARE} />;
}

export function Breathe() {
  const { t, lang } = useMabsam();
  const [on, setOn] = useState(false);
  const [phase, setPhase] = useState<"in" | "out">("in");
  useEffect(() => {
    if (!on) return;
    setPhase("in");
    let p: "in" | "out" = "in";
    let id = setTimeout(function step() {
      p = p === "in" ? "out" : "in";
      setPhase(p);
      id = setTimeout(step, p === "in" ? 4000 : 6000);
    }, 4000);
    return () => clearTimeout(id);
  }, [on]);
  return (
    <section className="mb-breathe" id="breathe" aria-labelledby="mb-breathe-h">
      <Img src={IMG.calm} alt={ALT.calm[lang]} widths={[800, 1200, 1600, 2000]} />
      <div className="mb-breathe-copy">
        <h2 id="mb-breathe-h">{t.breatheTitle}</h2>
        <p>{t.breatheBody}</p>
        <div className={`mb-orb${on ? ` is-${phase}` : ""}`} aria-hidden>
          <span>{on ? (phase === "in" ? t.breathIn : t.breathOut) : ""}</span>
        </div>
        <p className="mb-sr" aria-live="polite">
          {on ? (phase === "in" ? t.breathIn : t.breathOut) : ""}
        </p>
        <button type="button" className="mb-btn mb-btn-line" aria-pressed={on} onClick={() => setOn((o) => !o)}>
          {on ? t.breatheStop : t.breatheStart}
        </button>
      </div>
    </section>
  );
}

const noSub = () => () => {};
export function Visit() {
  const { t, lang, finder, open } = useMabsam();
  const today = useSyncExternalStore(noSub, () => new Date().toISOString().slice(0, 10), () => "");
  const days = today
    ? Array.from({ length: 16 }, (_, i) => new Date(new Date(today + "T12:00:00Z").getTime() + (i + 1) * 864e5)).filter((d) => d.getUTCDay() !== 5)
    : [];
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [tried, setTried] = useState(false);
  const chosen = days.find((d) => d.toISOString().slice(0, 10) === day) ?? days[0];
  const iso = chosen?.toISOString().slice(0, 10) ?? "";
  const sat = chosen?.getUTCDay() === 6;
  const times = TIMES.filter((h) => !sat || (h >= "10:00" && h <= "15:00"));
  const taken = iso ? takenTimes(iso) : [];
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang === "ar" ? "ar-AE-u-nu-latn" : "en-GB", { ...o, timeZone: "UTC" }).format(d);
  const reason = finder.concerns.map((c) => CONCERNS.find((x) => x.id === c)?.name[lang]).filter(Boolean).join(lang === "ar" ? "، " : ", ") || t.reasonFree;
  return (
    <section className="mb-visit" id="visit" aria-labelledby="mb-visit-h">
      <div className="mb-visit-panel">
        <h2 id="mb-visit-h">{t.visitTitle}</h2>
        <p>{t.visitIntro}</p>
        <p className="mb-reason">
          <span>{t.reason}</span>
          {reason}
        </p>
        <fieldset className="mb-days">
          <legend>{t.day}</legend>
          {days.map((d) => {
            const k = d.toISOString().slice(0, 10);
            return (
              <button key={k} type="button" aria-pressed={k === iso} onClick={() => { setDay(k); setTime(""); }}>
                <span>{fmt(d, { weekday: "short" })}</span>
                {fmt(d, { day: "numeric" })}
              </button>
            );
          })}
        </fieldset>
        <fieldset className="mb-times">
          <legend>{t.time}</legend>
          {times.map((h) => (
            <button key={h} type="button" disabled={taken.includes(h)} aria-pressed={time === h} onClick={() => setTime(h)}>
              {h}
              {taken.includes(h) && <small>{t.taken}</small>}
            </button>
          ))}
        </fieldset>
        {chosen && time && <p className="mb-when">{t.yourVisit(`${fmt(chosen, { weekday: "long", day: "numeric", month: "long" })}, ${time}`)}</p>}
        {tried && !time && (
          <p className="mb-err" role="alert">
            {t.pickTime}
          </p>
        )}
        <button type="button" className="mb-btn mb-btn-sun" onClick={() => { setTried(true); if (time) open("notice"); }}>
          {t.confirm}
        </button>
        <p className="mb-where">{t.where}</p>
      </div>
      <Img src={IMG.facade} alt={ALT.facade[lang]} sizes="(max-width: 900px) 100vw, 45vw" widths={[600, 900, 1200]} />
    </section>
  );
}

export function Contact() {
  const { t, lang } = useMabsam();
  return (
    <section className="mb-contact" id="contact" aria-labelledby="mb-contact-h">
      <div>
        <h2 id="mb-contact-h">{t.contactTitle}</h2>
        <p>{t.contactIntro}</p>
      </div>
      <EnquiryForm site="mabsam" lang={lang} labels={t.form} prefix="mb" interestOptions={t.interests} />
    </section>
  );
}

export function Faq() {
  const { t, lang } = useMabsam();
  return (
    <section className="mb-faq" id="faq" aria-labelledby="mb-faq-h">
      <h2 id="mb-faq-h">{t.faqTitle}</h2>
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
