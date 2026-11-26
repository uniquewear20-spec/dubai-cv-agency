"use client";

// HAYRAT's home sections after the dive: the island, the rooms, the booking engine, the three
// tables, the Salt House, a day on the island (drag the sun), the map, getting here, the history of
// the banks, questions and the enquiry form.

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DAY, DEPARTURES, DINING, FAQ, IMG, RITUALS, ROOMS, SPOTS, cell, money, type Room } from "@/lib/showcase/hayrat";
import { EnquiryForm } from "../kit/EnquiryForm";
import { Img } from "../kit/Img";
import { useReveal } from "../kit/hooks";
import { BASE, BookingEngine } from "./Booking";
import { useHayrat } from "./state";

/* ───────────────────────── The island ───────────────────────── */

export function Island() {
  const { t } = useHayrat();
  const ref = useReveal<HTMLElement>();
  return (
    <section className="hy-island" id="island" ref={ref} data-tone="light">
      <div className="hy-island-text">
        <h2 className="hy-h2">{t.islandTitle}</h2>
        {t.islandBody.map((p) => (
          <p key={p} className="hy-lead">
            {p}
          </p>
        ))}
      </div>
      <figure className="hy-island-img hy-wipe">
        <Img src={IMG.aerial} alt="" sizes="(max-width: 900px) 100vw, 55vw" />
      </figure>
      <ul className="hy-facts">
        {t.facts.map((f) => (
          <li key={f.l}>
            <strong>{f.n}</strong>
            <span>{f.l}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────────────────── Rooms ───────────────────────── */

/** Lets a mouse drag a horizontal scroller; touch and keyboard scroll it natively. */
function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false,
      sx = 0,
      sl = 0,
      moved = false;
    const start = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      sx = e.clientX;
      sl = el.scrollLeft;
      el.classList.add("is-drag");
    };
    const move = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = sl - dx;
    };
    const end = () => {
      down = false;
      el.classList.remove("is-drag");
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", start);
    addEventListener("pointermove", move);
    addEventListener("pointerup", end);
    el.addEventListener("click", click, true);
    return () => {
      el.removeEventListener("pointerdown", start);
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", end);
      el.removeEventListener("click", click, true);
    };
  }, []);
  return ref;
}

export function RoomCard({ r, i }: { r: Room; i: number }) {
  const { lang, t, setStay, open } = useHayrat();
  return (
    <article className="hy-room" style={{ "--i": i } as CSSProperties}>
      <Link href={`${BASE}${r.id}/`} className="hy-room-img" data-cursor="explore" draggable={false}>
        <Img src={r.img} alt={r.name[lang]} sizes="(max-width: 700px) 84vw, 38vw" widths={[640, 960, 1280]} />
        <span className="hy-room-keys">{t.keys(r.keys)}</span>
      </Link>
      <div className="hy-room-body">
        <h3>{r.name[lang]}</h3>
        <p>{r.line[lang]}</p>
        <p className="hy-room-meta">
          {r.size} {t.sqm}
          {r.terrace ? ` + ${r.terrace} ${t.sqm} ${t.terrace}` : ""} · {r.maxAdults + r.maxChildren} {t.guests.toLowerCase()} · {r.view[lang]}
        </p>
        <div className="hy-room-row">
          <span className="hy-price">
            <small>{t.from}</small> {money(r.base, lang)} <small>{t.perNight}</small>
          </span>
          <span className="hy-room-actions">
            <Link href={`${BASE}${r.id}/`} className="hy-link">
              {t.seeRoom}
            </Link>
            <button
              type="button"
              className="hy-btn hy-btn-small"
              onClick={() => {
                setStay((s) => ({ ...s, room: r.id }));
                open("book");
              }}
            >
              {t.chooseRoom}
            </button>
          </span>
        </div>
      </div>
    </article>
  );
}

export function Rooms() {
  const { t } = useHayrat();
  const track = useDragScroll<HTMLDivElement>();
  return (
    <section className="hy-rooms" id="rooms" data-tone="light">
      <header className="hy-head">
        <h2 className="hy-h2">{t.roomsTitle}</h2>
        <p className="hy-lead">{t.roomsLead}</p>
      </header>
      <div className="hy-rooms-track" ref={track} data-cursor="drag" tabIndex={0} aria-label={t.roomsTitle}>
        {ROOMS.map((r, i) => (
          <RoomCard key={r.id} r={r} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Booking ───────────────────────── */

export function BookSection() {
  const { t } = useHayrat();
  return (
    <section className="hy-book" id="book" data-tone="light">
      <header className="hy-head">
        <h2 className="hy-h2">{t.bookTitle}</h2>
        <p className="hy-lead">{t.bookLead}</p>
      </header>
      <BookingEngine months={2} />
    </section>
  );
}

/* ───────────────────────── Dining ───────────────────────── */

export function Dining() {
  const { t, lang } = useHayrat();
  const [on, setOn] = useState(0);
  return (
    <section className="hy-dining" id="dining" data-tone="dark">
      <header className="hy-head">
        <h2 className="hy-h2">{t.diningTitle}</h2>
      </header>
      <div className="hy-dining-grid">
        <div className="hy-dining-frame" aria-hidden>
          {DINING.map((v, i) => (
            <span key={v.name.en} className={`hy-dining-pic${on === i ? " is-on" : ""}`}>
              <Img src={cell("dining", v.img)} alt="" sizes="(max-width: 900px) 90vw, 40vw" />
            </span>
          ))}
        </div>
        <ol className="hy-dining-list">
          {DINING.map((v, i) => (
            <li key={v.name.en} className={on === i ? "is-on" : ""} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} tabIndex={0}>
              <span className="hy-dining-mob" aria-hidden>
                <Img src={cell("dining", v.img)} alt="" sizes="90vw" />
              </span>
              <h3>{v.name[lang]}</h3>
              <p className="hy-small">{v.when[lang]}</p>
              <p>{v.body[lang]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── Salt House ───────────────────────── */

export function SaltHouse() {
  const { t, lang } = useHayrat();
  const ref = useReveal<HTMLElement>();
  return (
    <section className="hy-salt" id="salt" ref={ref} data-tone="light">
      <div className="hy-salt-pics">
        <figure className="hy-arch hy-wipe">
          <Img src={cell("spa", 0)} alt="" sizes="(max-width: 900px) 70vw, 30vw" />
        </figure>
        <figure className="hy-salt-small hy-wipe">
          <Img src={cell("spa", 2)} alt="" sizes="(max-width: 900px) 45vw, 18vw" />
        </figure>
      </div>
      <div className="hy-salt-text">
        <h2 className="hy-h2">{t.saltTitle}</h2>
        <p className="hy-lead">{t.saltLead}</p>
        <ul className="hy-rituals">
          {RITUALS.map((r) => (
            <li key={r.name.en}>
              <span className="hy-ritual-name">
                <strong>{r.name[lang]}</strong>
                <small>{r.body[lang]}</small>
              </span>
              <span className="hy-ritual-meta">
                {r.mins} {t.mins}
                <br />
                {money(r.price, lang)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── A day on Hayrat ───────────────────────── */

const SKY = ["#f6d7c8", "#f3e3cf", "#dcefea", "#cfe8ee", "#f1e6cf", "#f2c9a6", "#3a4f6b", "#13213a"];

export function DayDial() {
  const { t, lang } = useHayrat();
  const [i, setI] = useState(1);
  const m = DAY[i];
  const angle = Math.PI * (1 - i / (DAY.length - 1));
  const sx = 50 + Math.cos(angle) * 44;
  const sy = 54 - Math.sin(angle) * 44;
  const night = i >= DAY.length - 2;
  const src = (img: (typeof DAY)[number]["img"]) => (typeof img === "string" ? IMG[img] : cell(img.g, img.i));
  return (
    <section className="hy-day" id="day" data-tone={night ? "dark" : "light"} style={{ "--sky": SKY[i] } as CSSProperties}>
      <header className="hy-head">
        <h2 className="hy-h2">{t.dayTitle}</h2>
        <p className="hy-lead">{t.dayLead}</p>
      </header>
      <div className="hy-day-grid">
        <div className="hy-day-dial">
          <svg viewBox="0 0 100 58" aria-hidden>
            <path d="M6 54A44 44 0 0 1 94 54" fill="none" className="hy-day-arc" />
            <line x1="2" y1="54" x2="98" y2="54" className="hy-day-horizon" />
            <circle cx={sx} cy={sy} r={night ? 3.2 : 4.2} className={night ? "hy-day-moon" : "hy-day-sun"} />
          </svg>
          <p className="hy-day-time">{m.t}</p>
          <label className="hy-day-range">
            <span className="hy-sr">{t.dayTitle}</span>
            <input type="range" min={0} max={DAY.length - 1} step={1} value={i} onChange={(e) => setI(Number(e.target.value))} aria-valuetext={`${m.t}, ${m.name[lang]}`} />
          </label>
          <ol className="hy-day-ticks" aria-hidden>
            {DAY.map((d, k) => (
              <li key={d.t} className={k === i ? "is-on" : ""}>
                <button type="button" tabIndex={-1} onClick={() => setI(k)}>
                  {d.t}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="hy-day-card">
          <div className="hy-day-pics">
            {DAY.map((d, k) => (
              <span key={d.t} className={`hy-day-pic${k === i ? " is-on" : ""}`}>
                <Img src={src(d.img)} alt="" sizes="(max-width: 900px) 90vw, 45vw" />
              </span>
            ))}
          </div>
          <h3>{m.name[lang]}</h3>
          <p>{m.body[lang]}</p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── The map ───────────────────────── */

export function IslandMap() {
  const { t, lang } = useHayrat();
  const [on, setOn] = useState<string | null>("houses");
  const s = SPOTS.find((x) => x.id === on);
  return (
    <section className="hy-map" id="map" data-tone="dark">
      <header className="hy-head">
        <h2 className="hy-h2">{t.mapTitle}</h2>
        <p className="hy-lead">{t.mapLead}</p>
      </header>
      <div className="hy-map-box">
        <svg viewBox="0 0 1000 640" className="hy-map-svg" aria-hidden>
          <g className="hy-map-depth">
            <path d="M60 330C70 140 300 70 520 90C760 110 960 190 960 330C960 500 760 590 500 580C250 570 50 500 60 330Z" />
            <path d="M100 330C110 175 320 120 520 135C730 150 915 220 915 330C915 465 740 540 500 532C280 525 95 465 100 330Z" />
          </g>
          <ellipse cx="905" cy="120" rx="72" ry="44" className="hy-map-bank" />
          <path d="M150 300C150 210 260 160 420 170C560 178 700 200 820 250C900 284 910 360 860 410C800 470 650 470 520 462C380 454 250 450 190 410C160 390 150 350 150 300Z" className="hy-map-land" />
          <path d="M740 290C790 280 850 300 860 340C868 380 830 405 790 400C750 395 720 370 722 335C723 310 728 295 740 290Z" className="hy-map-lagoon" />
          <path d="M860 410C900 440 930 480 980 500" className="hy-map-sand" />
          <g className="hy-map-mangrove">
            {[
              [130, 175, 18],
              [160, 160, 14],
              [180, 190, 16],
              [120, 210, 13],
              [205, 165, 11],
            ].map(([x, y, r]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
            ))}
          </g>
          <g className="hy-map-build">
            {[
              [400, 260, 34, 26],
              [442, 282, 30, 24],
              [482, 258, 28, 26],
              [420, 304, 26, 22],
              [458, 318, 30, 22],
              [506, 222, 40, 32],
              [338, 200, 28, 28],
            ].map(([x, y, w, h]) => (
              <rect key={`${x}${y}`} x={x} y={y} width={w} height={h} rx="3" />
            ))}
            {[580, 612, 644, 676, 708, 740].map((x, k) => (
              <rect key={x} x={x} y={414 + (k % 2) * 8} width="22" height="18" rx="9" />
            ))}
            <rect x="790" y="312" width="26" height="20" rx="3" />
            <rect x="820" y="344" width="26" height="20" rx="3" />
          </g>
          <path d="M248 404L226 520" className="hy-map-jetty" />
          <path d="M226 520C200 570 150 600 60 630" className="hy-map-route" />
          <text x="70" y="600" className="hy-map-note">
            {lang === "ar" ? "إلى رصيف المرسى · 40 دقيقة" : "To the marina pier · 40 min"}
          </text>
          <g transform="translate(930 560)" className="hy-map-north">
            <path d="M0 -22L6 0L0 -5L-6 0Z" />
            <text x="0" y="16" textAnchor="middle">
              N
            </text>
          </g>
        </svg>
        {SPOTS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`hy-spot${on === p.id ? " is-on" : ""}`}
            style={{ left: `${p.x / 10}%`, top: `${(p.y / 640) * 100}%` }}
            onClick={() => setOn(p.id)}
            aria-pressed={on === p.id}
            aria-label={p.name[lang]}
          >
            <span />
          </button>
        ))}
        {s && (
          <div className="hy-map-card" role="status">
            <strong>{s.name[lang]}</strong>
            <p>{s.body[lang]}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── Getting here ───────────────────────── */

export function Arrive() {
  const { t } = useHayrat();
  const ref = useReveal<HTMLElement>();
  return (
    <section className="hy-arrive" id="arrive" ref={ref} data-tone="light">
      <div className="hy-arrive-text">
        <h2 className="hy-h2">{t.arriveTitle}</h2>
        <p className="hy-lead">{t.arriveLead}</p>
        <p className="hy-small">{t.speedboat}</p>
      </div>
      <table className="hy-table">
        <thead>
          <tr>
            <th scope="col">{t.outbound}</th>
            <th scope="col">{t.inbound}</th>
          </tr>
        </thead>
        <tbody>
          {DEPARTURES.map((d) => (
            <tr key={d.out}>
              <td>{d.out}</td>
              <td>{d.back}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figure className="hy-arrive-img hy-wipe">
        <Img src={IMG.heroJetty} alt="" sizes="(max-width: 900px) 90vw, 30vw" />
      </figure>
    </section>
  );
}

/* ───────────────────────── The banks ───────────────────────── */

export function Banks() {
  const { t } = useHayrat();
  return (
    <section className="hy-banks" data-tone="dark">
      <figure className="hy-banks-img">
        <Img src={IMG.pearl} alt="" sizes="(max-width: 900px) 80vw, 34vw" />
      </figure>
      <div>
        <h2 className="hy-h2">{t.banksTitle}</h2>
        <ul className="hy-banks-list">
          {t.banks.map((b) => (
            <li key={b.l}>
              <strong>{b.n}</strong>
              <span>{b.l}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Questions and enquiry ───────────────────────── */

export function Faq() {
  const { t, lang } = useHayrat();
  return (
    <section className="hy-faq" id="faq" data-tone="light">
      <h2 className="hy-h2">{t.faqTitle}</h2>
      <div className="hy-faq-list">
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

export function Enquiry() {
  const { t, lang } = useHayrat();
  return (
    <section className="hy-enquiry" id="enquire" data-tone="light">
      <div className="hy-enquiry-in">
        <h2 className="hy-h2">{t.enquiryTitle}</h2>
        <p className="hy-lead">{t.enquiryLead}</p>
        <EnquiryForm site="hayrat" lang={lang} labels={t.form} prefix="hy" />
      </div>
    </section>
  );
}

/* ───────────────────────── Materials ───────────────────────── */

const MATERIALS: { en: string; ar: string }[] = [
  { en: "Rope from the dhows", ar: "حبال من السفن" },
  { en: "Palm frond, woven by hand", ar: "سعف منسوج باليد" },
  { en: "Coral stone, lime and shell", ar: "حجر مرجاني وجص وصدف" },
  { en: "Mother-of-pearl", ar: "عرق اللؤلؤ" },
];

export function Materials() {
  const { lang } = useHayrat();
  const ref = useReveal<HTMLElement>();
  return (
    <section className="hy-materials" ref={ref} data-tone="light" aria-label={lang === "ar" ? "مواد الجزيرة" : "What the island is made of"}>
      {MATERIALS.map((m, i) => (
        <figure key={m.en} className="hy-material hy-wipe" style={{ "--i": i } as CSSProperties}>
          <Img src={cell("details", i)} alt="" sizes="(max-width: 700px) 50vw, 25vw" />
          <figcaption>{m[lang]}</figcaption>
        </figure>
      ))}
    </section>
  );
}
