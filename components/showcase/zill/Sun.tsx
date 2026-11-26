"use client";

// Signature two: a working sun study. The Courtyard House in plan, north up, with the sun's path
// for the chosen day drawn around it. Move the hour (or play the day) and the walls and the olive
// tree cast their shade on the courtyard floor; the share in shade is measured, not illustrated.

import { useEffect, useState, useSyncExternalStore } from "react";
import { C0, C1, DAYS, TREE, compass, courtyardShade, dubaiNow, fmtHour, sun } from "@/lib/showcase/zill";
import { useZill } from "./state";

const CX = 10;
const CY = 10;
const R = 22;
const H0 = 5;
const H1 = 19;

/** Rounded so the server and the browser print the same numbers (their Math.sin can differ in the last digit). */
const f = (n: number) => Math.round(n * 1000) / 1000;

/** Sun-path diagram: altitude 90° at the centre, 0° on the ring; bearing clockwise from north. */
function onRing(alt: number, az: number) {
  const r = R * (1 - Math.max(0, alt) / 90);
  const a = (az * Math.PI) / 180;
  return [f(CX + r * Math.sin(a)), f(CY - r * Math.cos(a))] as const;
}

type DayId = "jun" | "mar" | "dec" | "today";
const noSub = () => () => {};

export function SunStudy() {
  const { t, lang } = useZill();
  const [day, setDay] = useState<DayId>("jun");
  const [hour, setHour] = useState(15);
  const [playing, setPlaying] = useState(false);
  // today's date in Dubai exists only in the browser (the page itself is prerendered)
  const todayDoy = useSyncExternalStore(noSub, () => dubaiNow().doy, () => 0);
  const todayName = useSyncExternalStore(
    noSub,
    () => new Intl.DateTimeFormat(lang === "ar" ? "ar-AE-u-nu-latn" : "en-GB", { day: "numeric", month: "long", timeZone: "Asia/Dubai" }).format(new Date()),
    () => "",
  );

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setHour((h) => {
        const next = Math.round((h + 0.1) * 100) / 100;
        if (next >= H1) {
          setPlaying(false);
          return H1;
        }
        return next;
      });
    }, 70);
    return () => clearInterval(id);
  }, [playing]);

  const doy = day === "today" && todayDoy ? todayDoy : (DAYS.find((d) => d.id === day)?.doy ?? 172);
  const dayName = day === "today" ? todayName : (DAYS.find((d) => d.id === day)?.name[lang] ?? "");
  const s = courtyardShade(doy, hour);
  const pct = Math.round(s.share * 100);
  const sunAt = onRing(s.alt, s.az);

  const path = (() => {
    const pts: string[] = [];
    const ticks: { h: number; x: number; y: number }[] = [];
    for (let h = 4; h <= 20.001; h += 0.1) {
      const p = sun(doy, h);
      if (p.alt <= 0) continue;
      const [x, y] = onRing(p.alt, p.az);
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    for (let h = 5; h <= 19; h++) {
      const p = sun(doy, h);
      if (p.alt <= 0) continue;
      const [x, y] = onRing(p.alt, p.az);
      ticks.push({ h, x, y });
    }
    const bars = Array.from({ length: H1 - H0 + 1 }, (_, i) => courtyardShade(doy, H0 + i).share);
    return { pts: pts.join(" "), ticks, bars };
  })();

  const pickDay = (d: DayId) => {
    setDay(d);
    if (d === "today") {
      const n = dubaiNow();
      setHour(Math.min(H1, Math.max(H0, Math.round(n.solar * 4) / 4)));
    }
  };
  const togglePlay = () => {
    if (!playing && hour >= H1) setHour(H0);
    setPlaying((p) => !p);
  };

  const line = s.up ? t.sunLine(fmtHour(hour), dayName, pct) : t.night;

  return (
    <section className="zl-sun" id="sun" aria-labelledby="zl-sun-h">
      <header className="zl-sun-head">
        <h2 id="zl-sun-h">{t.sunTitle}</h2>
        <p>{t.sunIntro}</p>
      </header>
      <div className="zl-sun-grid">
        <figure className="zl-sun-plan">
          <svg viewBox="-15 -16.5 50 51.5" role="img" aria-label={line} direction="ltr">
            <defs>
              <pattern id="zl-hatch" width="0.9" height="0.9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="0.9" className="zl-hatch-line" />
              </pattern>
              <clipPath id="zl-lit">{s.lit && <rect x={f(s.lit.x0)} y={f(s.lit.y0)} width={f(Math.max(0, s.lit.x1 - s.lit.x0))} height={f(Math.max(0, s.lit.y1 - s.lit.y0))} />}</clipPath>
            </defs>
            {/* the sky: altitude rings, compass and the sun's path */}
            <circle cx={CX} cy={CY} r={R} className="zl-ring" />
            <circle cx={CX} cy={CY} r={(R * 2) / 3} className="zl-ring is-faint" />
            <circle cx={CX} cy={CY} r={R / 3} className="zl-ring is-faint" />
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * 45 * Math.PI) / 180;
              return <line key={i} x1={f(CX + (R - 0.9) * Math.sin(a))} y1={f(CY - (R - 0.9) * Math.cos(a))} x2={f(CX + (R + 0.9) * Math.sin(a))} y2={f(CY - (R + 0.9) * Math.cos(a))} className="zl-tick" />;
            })}
            <text x={CX} y={CY - R - 1.6} textAnchor="middle" className="zl-north">
              {t.north}
            </text>
            <polyline points={path.pts} className="zl-path" />
            {path.ticks.map((k) => (
              <g key={k.h}>
                <circle cx={k.x} cy={k.y} r="0.35" className="zl-path-tick" />
                {k.h % 3 === 0 && (
                  <text x={k.x} y={f(k.y - 1)} textAnchor="middle" className="zl-path-h">
                    {k.h}
                  </text>
                )}
              </g>
            ))}

            {/* the house in plan */}
            <rect x="-1" y="-1" width="22" height="22" className="zl-plinth" />
            <path d="M0 0H20V20H0Z M6 6V14H14V6Z" fillRule="evenodd" className="zl-rooms" />
            <path d="M0 0H20V6H0Z M14 6H20V14H14Z" fill="url(#zl-hatch)" />
            <rect x="15.8" y="1" width="3.2" height="3.2" className="zl-tower" />
            <path d="M15.8 1L19 4.2M19 1L15.8 4.2" className="zl-tower-x" />
            <rect x="-0.8" y="1" width="0.28" height="18" className="zl-screen" />

            {/* the courtyard floor: shade first, then the lit part, then the tree's shade on it */}
            <rect x={C0} y={C0} width={C1 - C0} height={C1 - C0} className="zl-floor-shade" />
            {s.lit && (
              <>
                <rect x={f(s.lit.x0)} y={f(s.lit.y0)} width={f(Math.max(0, s.lit.x1 - s.lit.x0))} height={f(Math.max(0, s.lit.y1 - s.lit.y0))} className="zl-floor-sun" />
                {s.tree && (
                  <ellipse
                    cx={f(s.tree.cx)}
                    cy={f(s.tree.cy)}
                    rx={f(s.tree.a)}
                    ry={f(s.tree.b)}
                    transform={`rotate(${s.tree.angle.toFixed(2)} ${s.tree.cx.toFixed(3)} ${s.tree.cy.toFixed(3)})`}
                    clipPath="url(#zl-lit)"
                    className="zl-floor-tree"
                  />
                )}
              </>
            )}
            <rect x="9.3" y="6.6" width="1.4" height="6.8" className="zl-pool" />
            <circle cx={TREE.x} cy={TREE.y} r={TREE.r} className="zl-canopy" />
            <circle cx={TREE.x} cy={TREE.y} r="0.25" className="zl-trunk" />
            <path d="M0 0H20V20H0Z" className="zl-walls" />
            <path d="M6 6H14V14H6Z" className="zl-walls" />

            {/* the sun now */}
            {s.up && (
              <g className="zl-sun-now">
                <line x1={sunAt[0]} y1={sunAt[1]} x2={CX} y2={CY} className="zl-bearing" />
                <circle cx={sunAt[0]} cy={sunAt[1]} r="2.6" className="zl-sun-halo" />
                <circle cx={sunAt[0]} cy={sunAt[1]} r="1.3" className="zl-sun-disc" />
              </g>
            )}
          </svg>
          <figcaption className="zl-legend">
            <span className="k-sun">{t.inSun}</span>
            <span className="k-shade">{t.inShadeKey}</span>
            <span className="k-two">{t.twoFloors}</span>
            <span className="k-one">{t.oneFloor}</span>
            <span className="k-tree">{t.treeKey}</span>
            <span className="k-pool">{t.poolKey}</span>
            <span className="k-path">{t.sunPath}</span>
          </figcaption>
        </figure>

        <div className="zl-sun-side">
          <p className="zl-sun-big" aria-hidden>
            <span>{pct}</span>%
          </p>
          <p className="zl-sun-big-label">{t.inShade}</p>
          <p className="zl-sun-line" aria-live="polite">
            {line}
          </p>

          <div className="zl-days" role="group" aria-label={t.day}>
            {DAYS.map((d) => (
              <button key={d.id} type="button" aria-pressed={day === d.id} onClick={() => pickDay(d.id as DayId)}>
                {d.name[lang]}
              </button>
            ))}
            <button type="button" aria-pressed={day === "today"} onClick={() => pickDay("today")} disabled={!todayDoy}>
              {t.today}
            </button>
          </div>

          <div className="zl-hour">
            <label htmlFor="zl-hour">
              {t.hour} <output htmlFor="zl-hour">{fmtHour(hour)}</output>
            </label>
            {/* time runs left to right in both languages, like the bars below */}
            <div className="zl-hour-row" dir="ltr">
              <input
                id="zl-hour"
                type="range"
                min={H0}
                max={H1}
                step={0.25}
                value={hour}
                aria-valuetext={fmtHour(hour)}
                onChange={(e) => {
                  setPlaying(false);
                  setHour(Number(e.target.value));
                }}
              />
              <button type="button" className="zl-play" onClick={togglePlay} aria-pressed={playing}>
                <svg viewBox="0 0 16 16" aria-hidden width="14" height="14">
                  {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M4 2.5v11l9-5.5z" />}
                </svg>
                {playing ? t.pause : t.play}
              </button>
            </div>
            <svg
              className="zl-bars"
              viewBox={`0 0 ${path.bars.length * 10} 40`}
              preserveAspectRatio="none"
              aria-hidden
              direction="ltr"
              data-cursor="link"
              onClick={(e) => {
                const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
                const f = (e.clientX - r.left) / r.width;
                setPlaying(false);
                setHour(Math.min(H1, Math.max(H0, Math.round(H0 + f * (H1 - H0 + 1) - 0.5))));
              }}
            >
              {path.bars.map((b, i) => (
                <rect key={i} x={i * 10 + 1.5} y={f(40 - b * 38)} width="7" height={f(b * 38)} className={Math.floor(hour) === H0 + i ? "is-now" : ""} />
              ))}
            </svg>
            <p className="zl-bars-label">{t.dayChart}</p>
          </div>

          <dl className="zl-sun-facts">
            <div>
              <dt>{t.altitude}</dt>
              <dd>{s.up ? `${Math.round(s.alt)}°` : "—"}</dd>
            </div>
            <div>
              <dt>{t.azimuth}</dt>
              <dd>{s.up ? `${Math.round(s.az)}°${lang === "ar" ? "، " : ", "}${compass(s.az, lang)}` : "—"}</dd>
            </div>
          </dl>
          <p className="zl-sun-model">{t.model}</p>
        </div>
      </div>
    </section>
  );
}
