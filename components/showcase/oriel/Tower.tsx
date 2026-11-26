"use client";

// The signature: the tower's elevation as a floor picker. Point at the facade to read a floor;
// choose one (or use the arrow keys) to see its homes and the view from that height. The view is
// one panoramic photograph, framed lower and closer for the canal floors and wider for the crown.

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { Img } from "../kit/Img";
import { AMENITY_FLOORS, ALT, COLLECTIONS, FLOORS, IMG, collectionOf, fmtAED, heightOf, unitsOn } from "@/lib/showcase/oriel";
import { useOriel } from "./state";

const W = 120;
const TOP = 60;
const FH = 9.4;
const BASE = TOP + FLOORS * FH;
const yOf = (f: number) => BASE - f * FH;
const hasAvailable = (f: number) => unitsOn(f).some((u) => u.status === "available");

export function Tower() {
  const { t, lang, floor, setFloor, open } = useOriel();
  const [hover, setHover] = useState<number | null>(null);
  const [onlyFree, setOnlyFree] = useState(false);
  const shown = hover ?? floor;
  const c = collectionOf(floor);
  const amenity = AMENITY_FLOORS[floor];
  const units = unitsOn(floor);
  const m = heightOf(floor);
  const k = floor / FLOORS;

  const pick = (f: number) => setFloor(Math.max(1, Math.min(FLOORS, f)));
  const fromPointer = (e: MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const f = Math.ceil((BASE - p.y) / FH);
    return f >= 1 && f <= FLOORS ? f : null;
  };
  const onKey = (e: KeyboardEvent) => {
    const step: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 };
    if (e.key in step) pick(floor + step[e.key]);
    else if (e.key === "Home") pick(1);
    else if (e.key === "End") pick(FLOORS);
    else return;
    e.preventDefault();
  };
  const label = (f: number) => `${t.floor} ${f}, ${AMENITY_FLOORS[f]?.[lang] ?? collectionOf(f)?.name[lang] ?? ""}`;

  return (
    <section className="or-tower" id="homes" aria-labelledby="or-tower-h">
      <header className="or-head">
        <h2 id="or-tower-h">{t.towerTitle}</h2>
        <p>{t.towerIntro}</p>
        <label className="or-check">
          <input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} />
          <span>{t.onlyAvailable}</span>
        </label>
      </header>
      <div className="or-tower-grid">
        <div className="or-elev-wrap">
          <svg
            className="or-elev"
            viewBox={`-70 0 ${W + 140} ${BASE + 30}`}
            role="slider"
            tabIndex={0}
            aria-label={t.towerTitle}
            aria-valuemin={1}
            aria-valuemax={FLOORS}
            aria-valuenow={floor}
            aria-valuetext={label(floor)}
            aria-describedby="or-keys"
            onKeyDown={onKey}
            onPointerMove={(e) => setHover(fromPointer(e))}
            onPointerLeave={() => setHover(null)}
            onClick={(e) => {
              const f = fromPointer(e);
              if (f) pick(f);
            }}
            data-cursor="link"
            direction="ltr"
          >
            {/* the crown */}
            <path d={`M0 ${TOP} V${TOP - 22} Q0 ${TOP - 52} ${W / 2} ${TOP - 54} Q${W} ${TOP - 52} ${W} ${TOP - 22} V${TOP}Z`} className="or-crown" />
            {Array.from({ length: FLOORS }, (_, i) => {
              const f = i + 1;
              const col = collectionOf(f)?.id ?? "amenity";
              const dim = onlyFree && !AMENITY_FLOORS[f] && !hasAvailable(f);
              return <rect key={f} x="0" y={yOf(f)} width={W} height={FH - 1.2} className={`or-fl is-${col}${f === floor ? " is-on" : ""}${f === hover ? " is-hover" : ""}${dim ? " is-dim" : ""}`} />;
            })}
            {Array.from({ length: 11 }, (_, i) => (
              <line key={i} x1={6 + i * 10.8} x2={6 + i * 10.8} y1={TOP - 20} y2={BASE} className="or-fin" />
            ))}
            {COLLECTIONS.map((col) => (
              <g key={col.id} className="or-band-label">
                <line x1={W + 6} x2={W + 14} y1={yOf(col.to)} y2={yOf(col.to)} />
                <line x1={W + 10} x2={W + 10} y1={yOf(col.to)} y2={yOf(col.from) + FH} />
                <text x={W + 18} y={(yOf(col.to) + yOf(col.from) + FH) / 2 + 3}>{col.from === col.to ? col.from : `${col.from}–${col.to}`}</text>
              </g>
            ))}
            <line x1={-40} x2={W + 40} y1={BASE} y2={BASE} className="or-ground" />
            <path d={`M-60 ${BASE + 14} Q${W / 2} ${BASE + 6} ${W + 60} ${BASE + 14}`} className="or-canal" />
            <g className="or-marker" transform={`translate(0 ${yOf(shown) + FH / 2})`}>
              <line x1={-44} x2={-4} y1="0" y2="0" />
              <text x={-48} y="4" textAnchor="end">
                {shown}
              </text>
            </g>
          </svg>
          <div className="or-step">
            <button type="button" onClick={() => pick(floor - 1)} aria-label={t.down} disabled={floor <= 1}>
              −
            </button>
            <span>
              {t.floor} {floor}
            </span>
            <button type="button" onClick={() => pick(floor + 1)} aria-label={t.up} disabled={floor >= FLOORS}>
              +
            </button>
          </div>
          <p id="or-keys" className="or-keys">
            {t.keys}
          </p>
        </div>

        <div className="or-floor" aria-live="polite">
          <div className="or-floor-top">
            <p className="or-floor-n">
              <span>{t.floor}</span>
              {floor}
            </p>
            <dl className="or-floor-meta">
              <div>
                <dt>{t.height}</dt>
                <dd>{m} m</dd>
              </div>
              <div>
                <dt>{t.collection}</dt>
                <dd>{amenity ? t.amenityFloor : c?.name[lang]}</dd>
              </div>
            </dl>
          </div>
          <figure className="or-view">
            <div className="or-view-frame" style={{ ["--k" as string]: k }}>
              <Img src={IMG.view} alt={ALT.view[lang]} sizes="(max-width: 900px) 100vw, 50vw" widths={[800, 1200, 1600]} />
              <span className="or-view-haze" aria-hidden />
            </div>
            <figcaption>{t.viewFrom(floor, m)}</figcaption>
          </figure>
          {amenity ? (
            <p className="or-amenity">{amenity[lang]}</p>
          ) : (
            <>
              <h3>{t.homesOn}</h3>
              {c && <p className="or-col-note">{c.note[lang]}</p>}
              <ul className="or-units">
                {units.map((u) => (
                  <li key={u.code} className={`is-${u.status}`}>
                    <span className="or-u-code">{u.code}</span>
                    <span className="or-u-main">
                      {t.beds(u.beds)}, {u.sqft.toLocaleString("en")} {t.sqft}
                      <small>
                        {t.facing}: {u.facing[lang]}
                      </small>
                    </span>
                    <span className="or-u-price">{u.status === "sold" ? "—" : fmtAED(u.price, lang)}</span>
                    {u.status === "available" ? (
                      <button type="button" className="or-btn or-btn-bronze" onClick={() => open("notice")}>
                        {t.requestViewing}
                      </button>
                    ) : (
                      <span className="or-u-status">{t.status[u.status]}</span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
