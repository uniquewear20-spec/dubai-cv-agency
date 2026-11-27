"use client";

// Book a call: what about (the village or one home), how, in which language, the day and a
// free time in Morocco. The request stops at a notice, since the village is fictional. Then the
// enquiry form, which really reaches Zenith Dubai, and the questions.

import { useState, useSyncExternalStore } from "react";
import { FAQ, HOMES } from "@/lib/showcase/albora";
import { EnquiryForm } from "../kit/EnquiryForm";
import { useAlbora } from "./state";

const SLOTS = ["10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
const noSub = () => () => {};
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

/** The next six days with the village open (it rests on Sundays). */
function days(key: string) {
  if (!key) return [];
  const [y, m, d] = key.split("-").map(Number);
  const out: Date[] = [];
  for (let i = 1; out.length < 6 && i < 14; i++) {
    const x = new Date(y, m - 1, d + i, 12);
    if (x.getDay() !== 0) out.push(x);
  }
  return out;
}
const taken = (day: Date, slot: string) => (day.getDate() * 7 + SLOTS.indexOf(slot) * 5) % 4 === 0;

export function Call() {
  const { t, lang, about, setAbout, open } = useAlbora();
  const key = useSyncExternalStore(noSub, today, () => "");
  const list = days(key);
  const [format, setFormat] = useState(0);
  const [language, setLanguage] = useState(lang === "ar" ? 2 : 0);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("");
  const [err, setErr] = useState("");
  const fmt = new Intl.DateTimeFormat(lang === "ar" ? "ar-MA" : "en-GB", { weekday: "short", day: "numeric", month: "short" });
  const long = new Intl.DateTimeFormat(lang === "ar" ? "ar-MA" : "en-GB", { weekday: "long", day: "numeric", month: "long" });
  const chosen = list[day];
  const homes = HOMES.filter((h) => h.status !== "sold");
  const what = about || t.anyHome;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !chosen) {
      setErr(t.pickTime);
      return;
    }
    setErr("");
    open("notice");
  };
  return (
    <section className="al-call" id="call" aria-labelledby="al-call-h">
      <div className="al-call-head">
        <h2 id="al-call-h" className="al-display">
          {t.callTitle} <span className="al-script" aria-hidden>{t.callScript}</span>
        </h2>
        <p className="al-lede">{t.callIntro}</p>
      </div>
      <form className="al-call-form" onSubmit={submit} noValidate>
        <label className="al-field">
          <span>{t.about}</span>
          <select value={about} onChange={(e) => setAbout(e.target.value)}>
            <option value="">{t.anyHome}</option>
            {homes.map((h) => (
              <option key={h.code} value={h.code}>
                {h.code}, {t.bedsN(h.beds)}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="al-chips">
          <legend>{t.format}</legend>
          {t.formats.map((f, i) => (
            <label key={f} className="al-chip">
              <input type="radio" name="al-format" checked={format === i} onChange={() => setFormat(i)} />
              <span>{f}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="al-chips">
          <legend>{t.language}</legend>
          {t.languages.map((f, i) => (
            <label key={f} className="al-chip" lang={["en", "fr", "ar", "es"][i]}>
              <input type="radio" name="al-language" checked={language === i} onChange={() => setLanguage(i)} />
              <span>{f}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="al-chips al-days">
          <legend>{t.day}</legend>
          {list.length === 0 && <p className="al-small">{t.daysLoading}</p>}
          {list.map((d, i) => (
            <label key={d.toISOString()} className="al-chip">
              <input
                type="radio"
                name="al-day"
                checked={day === i}
                onChange={() => {
                  setDay(i);
                  setTime("");
                }}
              />
              <span>{fmt.format(d)}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="al-chips al-times">
          <legend>{t.time}</legend>
          {SLOTS.map((s) => {
            const off = !chosen || taken(chosen, s);
            return (
              <label key={s} className={`al-chip${off ? " is-off" : ""}`}>
                <input
                  type="radio"
                  name="al-time"
                  disabled={off}
                  checked={time === s}
                  onChange={() => {
                    setTime(s);
                    setErr("");
                  }}
                />
                <span>
                  {s}
                  {chosen && taken(chosen, s) && <em className="al-sr"> ({t.timeTaken})</em>}
                </span>
              </label>
            );
          })}
        </fieldset>
        <p className="al-call-summary" aria-live="polite">
          {time && chosen ? t.summary(what, `${long.format(chosen)}, ${time}`, t.formats[format]) : t.pickTime}
        </p>
        {err && (
          <p className="al-error" role="alert">
            {err}
          </p>
        )}
        <button type="submit" className="al-btn al-btn-bloom">
          {t.confirm}
        </button>
      </form>
    </section>
  );
}

export function Contact() {
  const { t, lang } = useAlbora();
  return (
    <section className="al-contact" id="contact" aria-labelledby="al-contact-h">
      <div>
        <h2 id="al-contact-h" className="al-display">
          {t.contactTitle}
        </h2>
        <p>{t.contactIntro}</p>
      </div>
      <EnquiryForm site="albora" lang={lang} labels={t.form} prefix="al" interestOptions={t.interests} />
    </section>
  );
}

export function Faq() {
  const { t, lang } = useAlbora();
  return (
    <section className="al-faq" id="faq" aria-labelledby="al-faq-h">
      <h2 id="al-faq-h" className="al-display">
        {t.faqTitle}
      </h2>
      {FAQ.map((f, i) => (
        <details key={f.q.en} open={i === 0}>
          <summary>{f.q[lang]}</summary>
          <p>{f.a[lang]}</p>
        </details>
      ))}
    </section>
  );
}
