"use client";

// The reservation: night, sitting, guests, seats on the counter, pairing and notes, then a kitchen
// ticket with the total. Availability is invented but fixed for each night, so the counter you see
// is the same every time. "Request these seats" stops at the concept notice.

import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  bestBlock,
  blockAt,
  bookable,
  bookingReady,
  canSeat,
  cell,
  clock,
  DIETS,
  iso,
  isOpenDay,
  longDate,
  MAX_PARTY,
  money,
  MONTHS,
  OCCASIONS,
  parse,
  quote,
  seatRange,
  seatsLeft,
  SITTINGS,
  takenSeats,
  todayIso,
  WEEKDAYS,
  ZONES,
  zoneOf,
  BOOK_AHEAD,
  type Booking,
  type SittingId,
} from "@/lib/showcase/mawqid";
import { Img } from "../kit/Img";
import { SeatMap } from "./Seats";
import { useMawqid } from "./state";

function Calendar() {
  const { booking, setBooking, lang, t } = useMawqid();
  const [today, setToday] = useState("");
  useEffect(() => setToday(todayIso()), []);
  const [offset, setOffset] = useState(0);
  if (!today) return <div className="mq-cal is-loading" aria-hidden />;
  const first = parse(today);
  first.setDate(1);
  first.setMonth(first.getMonth() + offset);
  const last = parse(addDays(today, BOOK_AHEAD));
  const maxOffset = (last.getFullYear() - parse(today).getFullYear()) * 12 + last.getMonth() - parse(today).getMonth();
  const y = first.getFullYear(),
    m = first.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Monday first
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => iso(new Date(y, m, i + 1)))];
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <div className="mq-cal">
      <div className="mq-cal-head">
        <button type="button" className="mq-cal-nav" onClick={() => setOffset((o) => Math.max(0, o - 1))} disabled={offset === 0} aria-label={lang === "ar" ? "الشهر السابق" : "Previous month"}>
          ‹
        </button>
        <span className="mq-cal-month" aria-live="polite">
          {MONTHS[lang][m]} {y}
        </span>
        <button type="button" className="mq-cal-nav" onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))} disabled={offset >= maxOffset} aria-label={lang === "ar" ? "الشهر التالي" : "Next month"}>
          ›
        </button>
      </div>
      <div className="mq-cal-grid" role="grid">
        {order.map((d) => (
          <span key={d} className="mq-cal-wd" aria-hidden>
            {WEEKDAYS[lang][d]}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`x${i}`} />;
          const ok = bookable(d, today);
          const closed = !isOpenDay(d);
          const left = ok ? Math.max(seatsLeft(d, "early"), seatsLeft(d, "late")) : 0;
          const fits = ok && SITTINGS.some((s) => canSeat(d, s.id, booking.party));
          const sel = booking.date === d;
          return (
            <button
              key={d}
              type="button"
              className={`mq-day${sel ? " is-sel" : ""}${closed ? " is-closed" : ""}${ok && !fits ? " is-full" : ""}${ok && fits && left <= 3 ? " is-low" : ""}`}
              disabled={!ok || !fits}
              aria-pressed={sel}
              aria-label={`${longDate(d, lang)}${closed ? `, ${t.closed}` : ok && !fits ? `, ${t.full}` : ""}`}
              onClick={() => setBooking((b) => ({ ...b, date: d }))}
            >
              <span className="mq-day-n">{parse(d).getDate()}</span>
              {ok && <span className="mq-day-dot" aria-hidden />}
            </button>
          );
        })}
      </div>
      <p className="mq-cal-key">
        <span className="mq-key is-free" /> {lang === "ar" ? "مقاعد متاحة" : "Seats free"}
        <span className="mq-key is-low" /> {lang === "ar" ? "آخر المقاعد" : "Last seats"}
        <span className="mq-key is-closed" /> {lang === "ar" ? "مغلق أو محجوز" : "Closed or full"}
      </p>
    </div>
  );
}

function Stepper({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="mq-stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label} −`}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label} +`}>
        +
      </button>
    </div>
  );
}

function Ticket({ b, onRequest, hint }: { b: Booking; onRequest: () => void; hint: string }) {
  const { lang, t } = useMawqid();
  const q = quote(b);
  const sit = SITTINGS.find((s) => s.id === b.sitting);
  const zones = [...new Set(b.seats.map(zoneOf))].map((z) => ZONES[z].name[lang]).join(lang === "ar" ? "، " : ", ");
  const diet = b.diet.map((d) => DIETS.find((x) => x.id === d)?.name[lang]).filter(Boolean);
  const occ = OCCASIONS.find((o) => o.id === b.occasion);
  return (
    <div className="mq-ticket" aria-live="polite">
      <div className="mq-ticket-paper">
        <p className="mq-ticket-head">
          <span>MAWQID</span>
          <span>{t.ticketTitle}</span>
        </p>
        <dl>
          <div>
            <dt>{t.steps.date}</dt>
            <dd>{b.date ? longDate(b.date, lang) : "—"}</dd>
          </div>
          <div>
            <dt>{t.sittingLbl}</dt>
            <dd>{sit ? `${sit.time}–${sit.ends}` : "—"}</dd>
          </div>
          <div>
            <dt>{t.covers}</dt>
            <dd>{b.party}</dd>
          </div>
          <div>
            <dt>{t.seatsLbl}</dt>
            <dd>{b.seats.length ? `${seatRange(b.seats)} · ${zones}` : "—"}</dd>
          </div>
          {diet.length > 0 && (
            <div>
              <dt>{t.diet}</dt>
              <dd>{diet.join(lang === "ar" ? "، " : ", ")}</dd>
            </div>
          )}
          {occ && occ.id && (
            <div>
              <dt>{t.occasion}</dt>
              <dd>{occ.name[lang]}</dd>
            </div>
          )}
          {b.notes.trim() && (
            <div>
              <dt>{t.notes}</dt>
              <dd className="mq-ticket-notes">{b.notes.trim()}</dd>
            </div>
          )}
        </dl>
        <div className="mq-ticket-sums">
          <p>
            <span>{t.menuLine(b.party)}</span>
            <span>{money(q.menu, lang)}</span>
          </p>
          {b.pairing > 0 && (
            <p>
              <span>{t.pairingLine(Math.min(b.pairing, b.party))}</span>
              <span>{money(q.pairing, lang)}</span>
            </p>
          )}
          <p className="mq-ticket-total">
            <span>{t.total}</span>
            <span>{money(q.total, lang)}</span>
          </p>
          <p className="mq-ticket-dep">
            <span>{t.deposit}</span>
            <span>{money(q.deposit, lang)}</span>
          </p>
        </div>
      </div>
      <button type="button" className="mq-btn mq-btn-ember mq-ticket-cta" onClick={onRequest}>
        {t.request}
      </button>
      {hint && (
        <p className="mq-hint" role="status">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Reserve() {
  const { booking: b, setBooking, lang, t, open } = useMawqid();
  const [hover, setHover] = useState<number | null>(null);
  const [hint, setHint] = useState("");
  const [today, setToday] = useState("");
  useEffect(() => setToday(todayIso()), []);

  // a saved booking for a night that has passed starts over
  useEffect(() => {
    if (!today) return;
    if (b.date && !bookable(b.date, today)) setBooking((x) => ({ ...x, date: "", sitting: "", seats: [] }));
  }, [today, b.date, setBooking]);

  const taken = useMemo(() => (b.date && b.sitting ? takenSeats(b.date, b.sitting) : []), [b.date, b.sitting]);

  // keep the seats valid when the night, the sitting or the party changes
  useEffect(() => {
    if (!b.date) return;
    if (b.sitting && !canSeat(b.date, b.sitting, b.party)) {
      setBooking((x) => ({ ...x, sitting: "", seats: [] }));
      return;
    }
    if (!b.sitting) return;
    const ok = b.seats.length === b.party && b.seats.every((s) => !taken.includes(s)) && b.seats.every((s, i) => i === 0 || s === b.seats[i - 1] + 1);
    if (!ok) setBooking((x) => ({ ...x, seats: bestBlock(taken, x.party) }));
  }, [b.date, b.sitting, b.party, b.seats, taken, setBooking]);

  const pick = (seat: number) => {
    if (!b.sitting) return;
    if (taken.includes(seat)) {
      setHint(lang === "ar" ? `المقعد ${seat} محجوز.` : `Seat ${seat} is taken.`);
      return;
    }
    const block = blockAt(taken, b.party, seat);
    if (!block.length) {
      setHint(lang === "ar" ? `لا يوجد ${b.party} مقاعد متجاورة حول المقعد ${seat}.` : `There are not ${b.party} free seats side by side around seat ${seat}.`);
      return;
    }
    setHint("");
    setBooking((x) => ({ ...x, seats: block }));
  };

  const request = () => {
    if (!bookingReady(b)) {
      setHint(t.incomplete);
      return;
    }
    setHint("");
    open("notice");
  };

  const focus = hover ?? b.seats[0] ?? null;
  const zone = focus ? ZONES[zoneOf(focus)] : null;
  const noBlock = b.date && b.sitting && !canSeat(b.date, b.sitting, b.party);

  return (
    <section className="mq-reserve" id="reserve" aria-labelledby="mq-reserve-h">
      <header className="mq-head">
        <h2 id="mq-reserve-h">{t.reserveTitle}</h2>
        <p>{t.reserveIntro}</p>
      </header>
      <div className="mq-reserve-grid">
        <div className="mq-reserve-steps">
          <fieldset className="mq-step">
            <legend>{t.steps.party}</legend>
            <Stepper value={b.party} min={1} max={MAX_PARTY} label={t.party} onChange={(n) => setBooking((x) => ({ ...x, party: n, pairing: Math.min(x.pairing, n) }))} />
            <p className="mq-note">{t.partyHint}</p>
          </fieldset>
          <fieldset className="mq-step">
            <legend>{t.steps.date}</legend>
            <Calendar />
          </fieldset>
          <fieldset className="mq-step">
            <legend>{t.steps.sitting}</legend>
            {!b.date ? (
              <p className="mq-note">{t.noNight}</p>
            ) : (
              <div className="mq-sittings">
                {SITTINGS.map((s) => {
                  const left = seatsLeft(b.date, s.id);
                  const fits = canSeat(b.date, s.id, b.party);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`mq-sitting${b.sitting === s.id ? " is-sel" : ""}`}
                      disabled={!fits}
                      aria-pressed={b.sitting === s.id}
                      onClick={() => setBooking((x) => ({ ...x, sitting: s.id as SittingId }))}
                    >
                      <span className="mq-sitting-time">{s.time}</span>
                      <span className="mq-sitting-name">{s.name[lang]}</span>
                      <span className="mq-sitting-left">{left === 0 ? t.sittingFull : !fits ? t.noBlock(b.party) : t.seatsLeft(left)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>
          <fieldset className="mq-step">
            <legend>{t.steps.extras}</legend>
            <div className="mq-extras-row">
              <span>{t.pairingFor}</span>
              <Stepper value={Math.min(b.pairing, b.party)} min={0} max={b.party} label={t.pairingFor} onChange={(n) => setBooking((x) => ({ ...x, pairing: n }))} />
            </div>
            <p className="mq-sub">{t.diet}</p>
            <div className="mq-chips">
              {DIETS.map((d) => {
                const on = b.diet.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`mq-chip${on ? " is-on" : ""}`}
                    aria-pressed={on}
                    onClick={() => setBooking((x) => ({ ...x, diet: on ? x.diet.filter((v) => v !== d.id) : [...x.diet, d.id] }))}
                  >
                    {d.name[lang]}
                  </button>
                );
              })}
            </div>
            <label className="mq-field">
              <span>{t.occasion}</span>
              <select value={b.occasion} onChange={(e) => setBooking((x) => ({ ...x, occasion: e.target.value }))}>
                {OCCASIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name[lang]}
                  </option>
                ))}
              </select>
            </label>
            <label className="mq-field">
              <span>{t.notes}</span>
              <textarea rows={2} maxLength={200} value={b.notes} placeholder={t.notesPh} onChange={(e) => setBooking((x) => ({ ...x, notes: e.target.value }))} />
            </label>
          </fieldset>
        </div>
        <div className="mq-reserve-side">
          <div className="mq-step mq-step-seats">
            <p className="mq-legend">{t.steps.seats}</p>
            <SeatMap
              lang={lang}
              taken={taken}
              mine={b.seats}
              hover={hover}
              onHover={setHover}
              onPick={b.sitting ? pick : undefined}
              label={t.steps.seats}
            />
            <p className="mq-note">
              {!b.date || !b.sitting ? t.incomplete : noBlock ? t.noBlock(b.party) : t.seatsHint(b.party)}
            </p>
            <div className="mq-seat-legend" aria-hidden>
              <span className="mq-key is-free" /> {t.free}
              <span className="mq-key is-mine" /> {t.yours}
              <span className="mq-key is-taken" /> {t.taken}
            </div>
            {zone && focus && (
              <figure className="mq-seatview">
                <Img src={cell(zone.view)} alt={`${t.viewFrom} ${focus}: ${zone.name[lang]}`} sizes="(max-width: 900px) 90vw, 30vw" widths={[480, 800]} />
                <figcaption>
                  <strong>
                    {t.viewFrom} {focus}. {zone.name[lang]}
                  </strong>
                  <span>{zone.note[lang]}</span>
                </figcaption>
              </figure>
            )}
          </div>
          <Ticket b={b} onRequest={request} hint={hint} />
          {b.sitting && b.date && (
            <p className="mq-note mq-arrive">
              {lang === "ar" ? "الوصول" : "Arrive"} {clock(SITTINGS.find((s) => s.id === b.sitting)!.time, -15)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
