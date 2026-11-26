"use client";

// The booking engine: a calendar that prices every night, guests, the rooms that are free for
// those nights, add-ons and a running total. It works end to end and stops at the concept notice.

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ADDONS,
  ROOMS,
  WEEKDAYS,
  addDays,
  addOnTotal,
  fits,
  fromRate,
  minStay,
  money,
  monthName,
  nightsBetween,
  quote,
  roomById,
  shortDate,
  stayAvailable,
  stayNights,
  todayIso,
  type RoomId,
} from "@/lib/showcase/hayrat";
import { Img } from "../kit/Img";
import { useHayrat } from "./state";

export const BASE = "/showcase/hayrat/";

const ym = (s: string) => s.slice(0, 7);
function shiftMonth(m: string, n: number) {
  const [y, mo] = m.split("-").map(Number);
  const d = new Date(Date.UTC(y, mo - 1 + n, 1));
  return d.toISOString().slice(0, 7);
}
function monthDays(m: string) {
  const [y, mo] = m.split("-").map(Number);
  const first = new Date(Date.UTC(y, mo - 1, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  const days: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= count; d++) days.push(`${m}-${String(d).padStart(2, "0")}`);
  return { y, mo: mo - 1, days };
}
const compact = (n: number) => (n >= 10000 ? `${(n / 1000).toFixed(1)}k` : n.toLocaleString("en-US"));

export function Calendar({ roomId, months = 2 }: { roomId?: RoomId; months?: number }) {
  const { stay, setStay, lang, t } = useHayrat();
  const today = todayIso();
  const [start, setStart] = useState(() => ym(stay.checkIn && stay.checkIn >= today ? stay.checkIn : today));
  const [hover, setHover] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const room = roomId ?? stay.room ?? undefined;

  function pick(d: string) {
    const { checkIn, checkOut } = stay;
    if (!checkIn || checkOut || d <= checkIn) {
      if (fromRate(d, room) === null) {
        setHint(t.full);
        return;
      }
      setStay((s) => ({ ...s, checkIn: d, checkOut: null, room: roomId ?? s.room }));
      setHint(t.minStay(minStay(d)));
      return;
    }
    const min = minStay(checkIn);
    if (nightsBetween(checkIn, d) < min) {
      setHint(t.minStay(min));
      return;
    }
    setStay((s) => ({ ...s, checkOut: d }));
    setHint("");
  }

  const end = stay.checkOut ?? (stay.checkIn && hover && hover > stay.checkIn ? hover : null);
  const canBack = start > ym(today);

  return (
    <div className="hy-cal">
      <div className="hy-cal-nav">
        <button type="button" className="hy-icon-btn" onClick={() => setStart((m) => shiftMonth(m, -1))} disabled={!canBack} aria-label={t.prevMonth}>
          <Chevron dir={lang === "ar" ? 1 : -1} />
        </button>
        <p className="hy-cal-status" aria-live="polite">
          {stay.checkIn && stay.checkOut ? `${shortDate(stay.checkIn, lang)} → ${shortDate(stay.checkOut, lang)} · ${t.nights(nightsBetween(stay.checkIn, stay.checkOut))}` : hint || t.pickDates}
        </p>
        <button type="button" className="hy-icon-btn" onClick={() => setStart((m) => shiftMonth(m, 1))} aria-label={t.nextMonth}>
          <Chevron dir={lang === "ar" ? -1 : 1} />
        </button>
      </div>
      <div className="hy-cal-months" style={{ "--months": months } as React.CSSProperties}>
        {Array.from({ length: months }, (_, i) => {
          const m = shiftMonth(start, i);
          const { y, mo, days } = monthDays(m);
          return (
            <div key={m} className="hy-month">
              <p className="hy-month-name">
                {monthName(mo, lang)} {y}
              </p>
              <div className="hy-week" aria-hidden>
                {WEEKDAYS[lang].map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
              <div className="hy-dates" onMouseLeave={() => setHover(null)}>
                {days.map((d, k) => {
                  if (!d) return <span key={`b${k}`} />;
                  const past = d < today;
                  const rate = past ? null : fromRate(d, room);
                  const isIn = d === stay.checkIn;
                  const isOut = d === stay.checkOut;
                  const inRange = !!(stay.checkIn && end && d > stay.checkIn && d < end);
                  const full = !past && rate === null;
                  const label = `${shortDate(d, lang)}${full ? `, ${t.full}` : rate ? `, ${money(rate, lang)}` : ""}`;
                  return (
                    <button
                      key={d}
                      type="button"
                      className={`hy-date${isIn ? " is-in" : ""}${isOut ? " is-out" : ""}${inRange ? " is-range" : ""}${full ? " is-full" : ""}`}
                      disabled={past}
                      aria-pressed={isIn || isOut}
                      aria-label={label}
                      onClick={() => pick(d)}
                      onMouseEnter={() => setHover(d)}
                    >
                      <span className="hy-date-n">{Number(d.slice(8))}</span>
                      <span className="hy-date-r">{past ? "" : full ? t.full : rate ? compact(rate) : ""}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {(stay.checkIn || stay.checkOut) && (
        <button type="button" className="hy-link" onClick={() => setStay((s) => ({ ...s, checkIn: null, checkOut: null }))}>
          {t.clear}
        </button>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: 1 | -1 }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden style={{ transform: dir < 0 ? "scaleX(-1)" : undefined }}>
      <path d="M5 2.5L9.5 7 5 11.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stepper({ label, note, value, min, max, onChange }: { label: string; note?: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="hy-stepper">
      <span className="hy-stepper-l">
        {label}
        {note && <small>{note}</small>}
      </span>
      <span className="hy-stepper-c">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label} −`}>
          −
        </button>
        <output aria-live="polite">{value}</output>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label} +`}>
          +
        </button>
      </span>
    </div>
  );
}

export function Guests() {
  const { stay, setStay, t } = useHayrat();
  return (
    <div className="hy-guests">
      <Stepper label={t.adults} value={stay.adults} min={1} max={4} onChange={(n) => setStay((s) => ({ ...s, adults: n }))} />
      <Stepper label={t.children} note={t.childrenNote} value={stay.children} min={0} max={2} onChange={(n) => setStay((s) => ({ ...s, children: n }))} />
    </div>
  );
}

function RoomChoice({ fixed }: { fixed?: RoomId }) {
  const { stay, setStay, lang, t } = useHayrat();
  const dated = !!(stay.checkIn && stay.checkOut);
  const list = fixed ? ROOMS.filter((r) => r.id === fixed) : ROOMS;
  return (
    <ul className="hy-choice" aria-label={t.roomsTitle}>
      {list.map((r) => {
        const ok = fits(r, stay.adults, stay.children);
        const free = dated ? stayAvailable(r, stay.checkIn!, stay.checkOut!) : true;
        const total = dated && free ? stayNights(r, stay.checkIn!, stay.checkOut!).reduce((s, n) => s + n.rate, 0) : null;
        const chosen = stay.room === r.id;
        const disabled = !ok || !free;
        return (
          <li key={r.id} className={`hy-choice-item${chosen ? " is-on" : ""}${disabled ? " is-off" : ""}`}>
            <span className="hy-choice-img">
              <Img src={r.img} alt="" sizes="96px" widths={[160, 240]} />
            </span>
            <span className="hy-choice-text">
              <strong>{r.name[lang]}</strong>
              <small>{!ok ? t.tooMany : !free ? t.soldOutStay : total !== null ? `${money(total, lang)} · ${t.nights(nightsBetween(stay.checkIn!, stay.checkOut!))}` : `${t.from} ${money(r.base, lang)} ${t.perNight}`}</small>
            </span>
            <button type="button" className="hy-btn hy-btn-small" disabled={disabled} aria-pressed={chosen} onClick={() => setStay((s) => ({ ...s, room: r.id }))}>
              {chosen ? t.chosen : t.chooseRoom}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function AddOns() {
  const { stay, setStay, lang, t } = useHayrat();
  const room = roomById(stay.room);
  const nights = stay.checkIn && stay.checkOut ? nightsBetween(stay.checkIn, stay.checkOut) : 1;
  return (
    <fieldset className="hy-addons">
      <legend>{t.extras}</legend>
      {ADDONS.map((a) => {
        const on = stay.addons.includes(a.id);
        const price = addOnTotal(a, stay, nights, room);
        const included = a.id === "transfer" && room?.transferIncluded;
        return (
          <label key={a.id} className={`hy-addon${on ? " is-on" : ""}`}>
            <input
              type="checkbox"
              checked={on || !!included}
              disabled={!!included}
              onChange={() => setStay((s) => ({ ...s, addons: on ? s.addons.filter((x) => x !== a.id) : [...s.addons, a.id] }))}
            />
            <span className="hy-addon-text">
              <strong>{a.name[lang]}</strong>
              <small>{a.note[lang]}</small>
            </span>
            <span className="hy-addon-price">{included ? t.included : money(price, lang)}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

function Summary() {
  const { stay, lang, t, open } = useHayrat();
  const q = useMemo(() => quote(stay), [stay]);
  const [showNights, setShowNights] = useState(false);
  if (!q) return <p className="hy-summary-empty">{t.pickDates}</p>;
  const free = stayAvailable(q.room, stay.checkIn!, stay.checkOut!) && fits(q.room, stay.adults, stay.children);
  return (
    <div className="hy-summary">
      <p className="hy-summary-h">{t.summary}</p>
      <dl>
        <div>
          <dt>{q.room.name[lang]}</dt>
          <dd>
            <button type="button" className="hy-link" onClick={() => setShowNights((v) => !v)} aria-expanded={showNights}>
              {t.nights(q.nights.length)}
            </button>{" "}
            · {money(q.roomTotal, lang)}
          </dd>
        </div>
        {showNights && (
          <ul className="hy-nightly">
            {q.nights.map((n) => (
              <li key={n.date}>
                <span>{shortDate(n.date, lang)}</span>
                <span>{money(n.rate, lang)}</span>
              </li>
            ))}
          </ul>
        )}
        {q.extras.map((e) => (
          <div key={e.a.id}>
            <dt>{e.a.name[lang]}</dt>
            <dd>{e.total === 0 ? t.included : money(e.total, lang)}</dd>
          </div>
        ))}
        <div className="hy-summary-total">
          <dt>{t.total}</dt>
          <dd>{money(q.total, lang)}</dd>
        </div>
      </dl>
      <p className="hy-small">{t.taxes}</p>
      <button type="button" className="hy-btn hy-btn-solid hy-btn-wide" disabled={!free} onClick={() => open("notice")}>
        {t.request}
      </button>
    </div>
  );
}

/** The whole engine. `fixed` limits it to one room (room pages). */
export function BookingEngine({ fixed, months = 2 }: { fixed?: RoomId; months?: number }) {
  const { stay } = useHayrat();
  return (
    <div className="hy-engine">
      <div className="hy-engine-cal">
        <Calendar roomId={fixed} months={months} />
      </div>
      <div className="hy-engine-side">
        <Guests />
        <RoomChoice fixed={fixed} />
        {stay.room && <AddOns />}
        <Summary />
      </div>
    </div>
  );
}

export const roomHref = (id: string) => `${BASE}${id}/`;
export const RoomLink = Link;
export { addDays };
