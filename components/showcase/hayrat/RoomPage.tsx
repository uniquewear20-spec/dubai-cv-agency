"use client";

// A room page: the room, what is in it, photographs around it, its own calendar of nightly rates
// and the other rooms.

import Link from "next/link";
import { useEffect } from "react";
import { ROOMS, cell, money, roomById, type RoomId } from "@/lib/showcase/hayrat";
import { Img } from "../kit/Img";
import { BASE, BookingEngine } from "./Booking";
import { Shell } from "./Chrome";
import { Enquiry, RoomCard } from "./Sections";
import { useHayrat } from "./state";

function Body({ id }: { id: RoomId }) {
  const { lang, t, setStay } = useHayrat();
  const r = roomById(id)!;
  useEffect(() => {
    setStay((s) => ({ ...s, room: id }));
  }, [id, setStay]);
  const others = ROOMS.filter((x) => x.id !== id);
  return (
    <>
      <section className="hy-rp-hero" data-tone="dark">
        <Img src={r.img} alt={r.name[lang]} eager sizes="100vw" widths={[960, 1440, 1600]} />
        <div className="hy-rp-hero-copy">
          <Link href={BASE + "#rooms"} className="hy-link hy-rp-back">
            {t.backHome}
          </Link>
          <h1 className="hy-h1">{r.name[lang]}</h1>
          <p className="hy-hero-body">{r.line[lang]}</p>
          <p className="hy-price hy-rp-price">
            <small>{t.from}</small> {money(r.base, lang)} <small>{t.perNight}</small>
          </p>
        </div>
      </section>
      <section className="hy-rp-facts" data-tone="light" aria-label={t.roomFacts}>
        <dl>
          <div>
            <dt>{t.size}</dt>
            <dd>
              {r.size} {t.sqm}
              {r.terrace ? ` + ${r.terrace} ${t.sqm}` : ""}
            </dd>
          </div>
          <div>
            <dt>{t.beds}</dt>
            <dd>{r.beds[lang]}</dd>
          </div>
          <div>
            <dt>{t.guests}</dt>
            <dd>
              {r.maxAdults} {t.adults.toLowerCase()}
              {r.maxChildren ? ` + ${r.maxChildren} ${t.children.toLowerCase()}` : ""}
            </dd>
          </div>
          <div>
            <dt>{t.view}</dt>
            <dd>{r.view[lang]}</dd>
          </div>
        </dl>
        <div className="hy-rp-body">
          <p className="hy-lead">{r.body[lang]}</p>
          <ul className="hy-rp-features">
            {r.features.map((f) => (
              <li key={f.en}>{f[lang]}</li>
            ))}
          </ul>
          <p className="hy-small">{t.keys(r.keys)}</p>
        </div>
      </section>
      <section className="hy-rp-gallery" data-tone="light" aria-label={t.roomGallery}>
        {r.details.map((d) => (
          <figure key={d}>
            <Img src={cell("rooms", d)} alt="" sizes="(max-width: 700px) 90vw, 45vw" />
          </figure>
        ))}
      </section>
      <section className="hy-book" id="book" data-tone="light">
        <header className="hy-head">
          <h2 className="hy-h2">{t.roomBook}</h2>
        </header>
        <BookingEngine fixed={id} months={2} />
      </section>
      <section className="hy-rooms hy-rp-others" data-tone="light">
        <header className="hy-head">
          <h2 className="hy-h2">{t.otherRooms}</h2>
        </header>
        <div className="hy-rooms-track">
          {others.map((o, i) => (
            <RoomCard key={o.id} r={o} i={i} />
          ))}
        </div>
      </section>
      <Enquiry />
    </>
  );
}

export default function RoomPage({ id }: { id: RoomId }) {
  return (
    <Shell>
      <Body id={id} />
    </Shell>
  );
}
