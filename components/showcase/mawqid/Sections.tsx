"use client";

// MAWQID's sections around the two signatures (the fire menu and the reservation).

import { useEffect, useState } from "react";
import {
  BOX_PRICE,
  cell,
  clock,
  FAQ,
  GIFT_MAX,
  giftTotal,
  IMG,
  longDate,
  money,
  NIGHT,
  nextOpening,
  PAIRING,
  PRIVATE_FROM,
  SITTINGS,
  WOODS,
  ZONES,
  zoneOf,
  type CellRef,
  type SittingId,
} from "@/lib/showcase/mawqid";
import { EnquiryForm } from "../kit/EnquiryForm";
import { useReveal } from "../kit/hooks";
import { Img } from "../kit/Img";
import { Mark } from "./Chrome";
import { SeatMap } from "./Seats";
import { useMawqid } from "./state";

const src = (img: string | CellRef) => (typeof img === "string" ? IMG[img as keyof typeof IMG] ?? "" : cell(img));

export function Hero() {
  const { t, lang, setBooking } = useMawqid();
  const [next, setNext] = useState<ReturnType<typeof nextOpening>>(null);
  useEffect(() => setNext(nextOpening(2)), []);
  const sit = next ? SITTINGS.find((s) => s.id === next.sitting) : null;
  return (
    <section className="mq-hero" aria-labelledby="mq-hero-h">
      <Img src={IMG.heroCounter} alt={lang === "ar" ? "كاونتر من البلوط المدخّن حول موقد مشتعل في مستودع ليلاً" : "A smoked-oak counter around a burning hearth in a warehouse at night"} className="mq-hero-img" eager />
      <span className="mq-hero-glow" aria-hidden />
      <div className="mq-hero-copy">
        <h1 id="mq-hero-h">{t.tagline}</h1>
        <p>{t.sub}</p>
        <div className="mq-hero-cta">
          <a href="#reserve" className="mq-btn mq-btn-ember">
            {t.choose}
          </a>
          <a href="#menu" className="mq-btn mq-btn-line">
            {t.seeMenu}
          </a>
        </div>
        {next && sit && (
          <button
            type="button"
            className="mq-hero-next"
            onClick={() => {
              setBooking((b) => ({ ...b, date: next.date, sitting: next.sitting as SittingId, party: Math.max(2, b.party), seats: [] }));
              document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="mq-ember-dot" aria-hidden />
            {t.nextOpen}: {longDate(next.date, lang)}, {sit.time}. {t.seatsLeft(next.left)}
          </button>
        )}
      </div>
    </section>
  );
}

export function Counter() {
  const { t, lang } = useMawqid();
  const [hover, setHover] = useState<number | null>(7);
  const zone = ZONES[zoneOf(hover ?? 7)];
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="mq-counter" id="counter" aria-labelledby="mq-counter-h">
      <div className="mq-counter-text">
        <h2 id="mq-counter-h">{t.counterTitle}</h2>
        <p>{t.counterBody}</p>
        <dl className="mq-facts">
          {t.facts.map((f) => (
            <div key={f.l}>
              <dt>{f.n}</dt>
              <dd>{f.l}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mq-counter-map mq-reveal" ref={ref}>
        <SeatMap lang={lang} hover={hover} onHover={(s) => s && setHover(s)} label={t.hoverSeat} compact />
        <p className="mq-note">{t.hoverSeat}</p>
      </div>
      <figure className="mq-counter-view">
        <Img src={cell(zone.view)} alt={`${t.viewFrom} ${hover}: ${zone.name[lang]}`} sizes="(max-width: 900px) 92vw, 34vw" widths={[480, 800, 1200]} />
        <figcaption>
          <strong>
            {t.viewFrom} {hover}. {zone.name[lang]}
          </strong>
          <span>{zone.note[lang]}</span>
        </figcaption>
      </figure>
    </section>
  );
}

export function Woods() {
  const { t, lang } = useMawqid();
  return (
    <section className="mq-woods" id="woods" aria-labelledby="mq-woods-h">
      <header className="mq-head">
        <h2 id="mq-woods-h">{t.woodsTitle}</h2>
        <p>{t.woodsIntro}</p>
      </header>
      <div className="mq-woods-row">
        {WOODS.map((w) => (
          <article key={w.id} className="mq-wood">
            <div className="mq-wood-img">
              <Img src={src(w.img)} alt="" sizes="(max-width: 800px) 92vw, 31vw" widths={[480, 800, 1200]} />
            </div>
            <h3>{w.name[lang]}</h3>
            <p>{w.body[lang]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Night() {
  const { t, lang } = useMawqid();
  const [sit, setSit] = useState<SittingId>("early");
  const start = SITTINGS.find((s) => s.id === sit)!.time;
  return (
    <section className="mq-night" aria-labelledby="mq-night-h">
      <div className="mq-night-side">
        <h2 id="mq-night-h">{t.nightTitle}</h2>
        <p>{t.nightIntro}</p>
        <div className="mq-toggle" role="group" aria-label={t.sittingSwitch}>
          {SITTINGS.map((s) => (
            <button key={s.id} type="button" aria-pressed={sit === s.id} className={sit === s.id ? "is-on" : ""} onClick={() => setSit(s.id)}>
              {s.name[lang]} {s.time}
            </button>
          ))}
        </div>
        <div className="mq-night-img">
          <Img src={IMG.heroHands} alt={lang === "ar" ? "يدا طاهٍ تقلّبان أسياخ الروبيان فوق جمر البلوط" : "A cook's hands turning skewers of prawns over oak embers"} sizes="(max-width: 900px) 92vw, 30vw" widths={[480, 800, 1000]} />
        </div>
      </div>
      <ol className="mq-timeline">
        {NIGHT.map((s) => (
          <li key={s.t}>
            <time>{clock(start, s.t)}</time>
            <div>
              <h3>{s.name[lang]}</h3>
              <p>{s.body[lang]}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Pairing() {
  const { t, lang } = useMawqid();
  return (
    <section className="mq-pairing" aria-labelledby="mq-pairing-h">
      <header className="mq-head">
        <h2 id="mq-pairing-h">{t.pairingTitle}</h2>
        <p>{t.pairingBody}</p>
      </header>
      <div className="mq-pairing-grid">
        {PAIRING.map((p, i) => (
          <figure key={i} className="mq-pour">
            <Img src={cell(p.img)} alt="" sizes="(max-width: 800px) 46vw, 23vw" widths={[400, 700, 900]} />
            <figcaption>
              <strong>{p.name[lang]}</strong>
              <span>{p.body[lang]}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function GiftSeat() {
  const { t, lang, gift: g, setGift, open } = useMawqid();
  const [err, setErr] = useState("");
  const total = giftTotal(g);
  const go = () => {
    if (!g.to.trim()) {
      setErr(t.giftEmpty);
      return;
    }
    setErr("");
    open("notice");
  };
  return (
    <section className="mq-gift" id="gift" aria-labelledby="mq-gift-h">
      <div className="mq-gift-form">
        <h2 id="mq-gift-h">{t.giftTitle}</h2>
        <p>{t.giftIntro}</p>
        <div className="mq-toggle" role="group" aria-label={t.giftTitle}>
          {(["one", "two"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={g.kind === k} className={g.kind === k ? "is-on" : ""} onClick={() => setGift((x) => ({ ...x, kind: k }))}>
              {k === "one" ? t.giftOne : t.giftTwo}
            </button>
          ))}
        </div>
        <label className="mq-check">
          <input type="checkbox" checked={g.pairing} onChange={(e) => setGift((x) => ({ ...x, pairing: e.target.checked }))} />
          <span>{t.withPairing}</span>
        </label>
        <fieldset className="mq-radio">
          <legend>{t.format}</legend>
          <label>
            <input type="radio" name="mq-format" checked={g.format === "ecard"} onChange={() => setGift((x) => ({ ...x, format: "ecard" }))} />
            <span>{t.ecard}</span>
          </label>
          <label>
            <input type="radio" name="mq-format" checked={g.format === "box"} onChange={() => setGift((x) => ({ ...x, format: "box" }))} />
            <span>
              {t.box} (+{money(BOX_PRICE, lang)})
              <small>{t.boxNote}</small>
            </span>
          </label>
        </fieldset>
        <div className="mq-field-row">
          <label className="mq-field">
            <span>{t.to}</span>
            <input value={g.to} maxLength={40} onChange={(e) => setGift((x) => ({ ...x, to: e.target.value }))} />
          </label>
          <label className="mq-field">
            <span>{t.from}</span>
            <input value={g.from} maxLength={40} onChange={(e) => setGift((x) => ({ ...x, from: e.target.value }))} />
          </label>
        </div>
        <label className="mq-field">
          <span>
            {t.message} <small>{g.message.length}/{GIFT_MAX}</small>
          </span>
          <textarea rows={3} maxLength={GIFT_MAX} value={g.message} placeholder={t.messagePh} onChange={(e) => setGift((x) => ({ ...x, message: e.target.value }))} />
        </label>
        <div className="mq-gift-go">
          <span className="mq-big">{money(total, lang)}</span>
          <button type="button" className="mq-btn mq-btn-ember" onClick={go}>
            {t.giftCta}
          </button>
        </div>
        {err && (
          <p className="mq-hint" role="status">
            {err}
          </p>
        )}
      </div>
      <div className="mq-gift-card" aria-hidden>
        <div className={`mq-card${g.format === "box" ? " is-box" : ""}`}>
          <Mark size={46} />
          <p className="mq-card-kind">
            {g.kind === "one" ? t.giftOne : t.giftTwo}
            {g.pairing ? `, ${t.withPairing.toLowerCase()}` : ""}
          </p>
          <p className="mq-card-to">{g.to.trim() || t.to}</p>
          <p className="mq-card-msg">{g.message.trim() || t.messagePh}</p>
          <p className="mq-card-from">{g.from.trim() ? `${lang === "ar" ? "من" : "From"} ${g.from.trim()}` : ""}</p>
          <p className="mq-card-foot">
            <span>MAWQID</span>
            <span lang="ar">موقد</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export function Private() {
  const { t, lang } = useMawqid();
  return (
    <section className="mq-private" id="private" aria-labelledby="mq-private-h">
      <div className="mq-private-img">
        <Img src={IMG.privateDinner} alt={lang === "ar" ? "الكاونتر مُعدّ لعشاء خاص لأربعة عشر ضيفاً" : "The counter set for a private dinner for fourteen"} sizes="100vw" />
      </div>
      <div className="mq-private-copy">
        <h2 id="mq-private-h">{t.privateTitle}</h2>
        <p>{t.privateBody}</p>
        <p className="mq-private-from">
          {t.privateFrom} <strong>{money(PRIVATE_FROM, lang)}</strong>
        </p>
        <h3>{t.enquiryTitle}</h3>
        <EnquiryForm site="mawqid" lang={lang} labels={t.form} prefix="mq" interestOptions={t.interests} />
      </div>
    </section>
  );
}

export function Visit() {
  const { t, lang } = useMawqid();
  return (
    <section className="mq-visit" id="visit" aria-labelledby="mq-visit-h">
      <div className="mq-visit-img">
        <Img src={IMG.entrance} alt={lang === "ar" ? "باب فولاذي في مستودع، ضوء النار يتسرب منه ودخان يصعد من المدخنة" : "A steel warehouse door with firelight spilling out and smoke rising from the chimney"} sizes="(max-width: 900px) 92vw, 40vw" widths={[480, 800, 1200]} />
      </div>
      <div className="mq-visit-copy">
        <h2 id="mq-visit-h">{t.visitTitle}</h2>
        <p className="mq-visit-addr">{t.address}</p>
        <p>{t.addressNote}</p>
        <p>{t.hours}</p>
        <p>{t.hoursClosed}</p>
        <p>{t.parking}</p>
      </div>
    </section>
  );
}

export function Faq() {
  const { t, lang } = useMawqid();
  return (
    <section className="mq-faq" id="faq" aria-labelledby="mq-faq-h">
      <div className="mq-faq-ash" aria-hidden>
        <Img src={IMG.ash} alt="" sizes="100vw" />
      </div>
      <div className="mq-faq-body">
        <h2 id="mq-faq-h">{t.faqTitle}</h2>
        {FAQ.map((f, i) => (
          <details key={i} open={i === 0}>
            <summary>{f.q[lang]}</summary>
            <p>{f.a[lang]}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
