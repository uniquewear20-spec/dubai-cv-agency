"use client";

// Select a residence: the twenty-nine homes drawn on the hill in their four rows, filtered by
// type, bedrooms and availability. A home opens a drawer with its sizes, view, an illustrative
// price and a plan drawn from its numbers, and can be carried into the call booking.

import { useState } from "react";
import { HOMES, KINDS, eur, type Home, type Kind } from "@/lib/showcase/albora";
import { useDialog } from "../kit/hooks";
import { useAlbora } from "./state";

type KindF = Kind | "all";
type BedsF = number | 0;

export function Residences() {
  const { t, lang, home, setHome, open } = useAlbora();
  const [kind, setKind] = useState<KindF>("all");
  const [beds, setBeds] = useState<BedsF>(0);
  const [avail, setAvail] = useState(false);
  const match = (h: Home) => (kind === "all" || h.kind === kind) && (!beds || h.beds === beds) && (!avail || h.status === "available");
  const shown = HOMES.filter(match);
  const free = shown.filter((h) => h.status === "available").length;
  const pick = (code: string) => {
    setHome(code);
    open("home");
  };
  const span = 760;
  return (
    <section className="al-res" id="residences" aria-labelledby="al-res-h">
      <div className="al-res-head">
        <h2 id="al-res-h" className="al-display">
          {t.pickTitle}
        </h2>
        <p className="al-lede">{t.pickIntro}</p>
      </div>
      <div className="al-filters">
        <div role="group" aria-label={t.filterType} className="al-chips">
          <span className="al-chips-k">{t.filterType}</span>
          {(["all", "roof", "terrace", "garden"] as KindF[]).map((k) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>
              {k === "all" ? t.all : KINDS[k].name[lang]}
            </button>
          ))}
        </div>
        <div role="group" aria-label={t.filterBeds} className="al-chips">
          <span className="al-chips-k">{t.filterBeds}</span>
          {[0, 2, 3, 4].map((b) => (
            <button key={b} type="button" aria-pressed={beds === b} onClick={() => setBeds(b)}>
              {b === 0 ? t.all : b}
            </button>
          ))}
        </div>
        <label className="al-check">
          <input type="checkbox" checked={avail} onChange={(e) => setAvail(e.target.checked)} />
          <span>{t.onlyAvailable}</span>
        </label>
        <p className="al-res-count" aria-live="polite">
          {t.shown(shown.length, free)}
        </p>
      </div>
      <div className="al-plan-wrap">
        <svg className="al-site" viewBox="0 0 1000 600" role="group" aria-label={t.pickTitle} direction="ltr">
          <defs>
            <pattern id="al-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M0 0v8" stroke="currentColor" strokeWidth="1" opacity=".35" />
            </pattern>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} className="al-contour" d={`M40 ${78 + i * 112} C 300 ${50 + i * 112}, 700 ${50 + i * 112}, 960 ${78 + i * 112}`} />
          ))}
          <rect x={180} y={506} width={640} height={34} rx={4} className="al-site-pool" />
          <text x={500} y={528} textAnchor="middle" className="al-site-label">
            {t.pool}
          </text>
          <path d="M0 560 C 250 548, 750 548, 1000 560 L1000 600 L0 600 Z" className="al-site-sea" />
          <text x={500} y={588} textAnchor="middle" className="al-site-label al-site-label-sea">
            {t.sea}
          </text>
          {HOMES.map((h) => {
            const n = HOMES.filter((x) => x.row === h.row).length;
            const w = (span / n) * 0.72;
            const on = match(h);
            const label = `${h.code}, ${KINDS[h.kind].name[lang]}, ${t.bedsN(h.beds)}, ${t.status[h.status]}`;
            return (
              <g
                key={h.code}
                className={`al-house is-${h.status}${on ? "" : " is-dim"}${home === h.code ? " is-picked" : ""}`}
                transform={`translate(${h.x.toFixed(1)} ${h.y.toFixed(1)})`}
                role="button"
                tabIndex={on ? 0 : -1}
                aria-label={label}
                aria-disabled={!on}
                onClick={() => on && pick(h.code)}
                onKeyDown={(e) => {
                  if (on && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    pick(h.code);
                  }
                }}
              >
                <rect x={(-w / 2).toFixed(1)} y={-26} width={w.toFixed(1)} height={52} rx={3} />
                {h.status === "sold" && <rect x={(-w / 2).toFixed(1)} y={-26} width={w.toFixed(1)} height={52} rx={3} fill="url(#al-hatch)" className="al-house-hatch" />}
                <text y={6} textAnchor="middle">
                  {h.code}
                </text>
              </g>
            );
          })}
        </svg>
        {shown.length === 0 && (
          <div className="al-empty">
            <p>{t.noneMatch}</p>
            <button
              type="button"
              className="al-btn al-btn-line"
              onClick={() => {
                setKind("all");
                setBeds(0);
                setAvail(false);
              }}
            >
              {t.clear}
            </button>
          </div>
        )}
        <ul className="al-legend" aria-hidden>
          {(["available", "reserved", "sold"] as const).map((s) => (
            <li key={s} className={`is-${s}`}>
              <i />
              {t.status[s]}
            </li>
          ))}
        </ul>
      </div>
      <Drawer />
    </section>
  );
}

/** A plan drawn from the home's numbers: living and kitchen, a run of bedrooms, the outside. */
function Plan({ h }: { h: Home }) {
  const { t } = useAlbora();
  const W = 320;
  const H = 210;
  const out = h.kind === "garden" ? 62 : 48;
  const inH = H - out;
  const bedW = 104;
  const living = W - bedW;
  const bh = inH / (h.beds + 1);
  return (
    <svg viewBox={`-6 -6 ${W + 12} ${H + 12}`} className="al-fplan" role="img" aria-label={`${t.plan} ${h.code}`} direction="ltr">
      <rect x={0} y={0} width={W} height={inH} className="al-fp-wall" />
      <line x1={living} y1={0} x2={living} y2={inH} className="al-fp-in" />
      <line x1={0} y1={inH * 0.42} x2={living * 0.46} y2={inH * 0.42} className="al-fp-in" />
      <text x={living * 0.23} y={inH * 0.24} className="al-fp-t">
        {t.rooms.kitchen}
      </text>
      <text x={living * 0.6} y={inH * 0.66} className="al-fp-t">
        {t.rooms.living}
      </text>
      {Array.from({ length: h.beds + 1 }, (_, i) => (
        <g key={i}>
          {i < h.beds && <line x1={living} y1={(i + 1) * bh} x2={W} y2={(i + 1) * bh} className="al-fp-in" />}
          <text x={living + bedW / 2} y={i * bh + bh / 2 + 4} className="al-fp-t">
            {i === h.beds ? t.rooms.bath : `${t.rooms.bed} ${i + 1}`}
          </text>
        </g>
      ))}
      <path d={`M${living * 0.3} ${inH} a 22 22 0 0 1 44 0`} className="al-fp-arch" />
      <path d={`M${living * 0.62} ${inH} a 22 22 0 0 1 44 0`} className="al-fp-arch" />
      <rect x={0} y={inH} width={W} height={out} className={h.kind === "garden" ? "al-fp-garden" : "al-fp-terrace"} />
      <text x={W * 0.3} y={inH + out / 2 + 4} className="al-fp-t">
        {h.kind === "garden" ? t.rooms.garden : t.rooms.terrace}
      </text>
      {h.kind === "roof" && (
        <>
          <rect x={W * 0.62} y={inH + 10} width={W * 0.3} height={out - 20} rx={3} className="al-fp-pool" />
          <text x={W * 0.77} y={inH + out / 2 + 4} className="al-fp-t">
            {t.rooms.pool}
          </text>
        </>
      )}
    </svg>
  );
}

function Drawer() {
  const { t, lang, home, setHome, overlay, open, setAbout } = useAlbora();
  const isOpen = overlay === "home";
  const box = useDialog(isOpen, () => open(null));
  const idx = HOMES.findIndex((x) => x.code === home);
  if (!isOpen || idx < 0) return null;
  const h = HOMES[idx];
  const go = (d: number) => setHome(HOMES[(idx + d + HOMES.length) % HOMES.length].code);
  const call = () => {
    setAbout(h.code);
    open(null);
    requestAnimationFrame(() => document.getElementById("call")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
  };
  return (
    <div className="al-drawer" role="dialog" aria-modal="true" aria-labelledby="al-drawer-h">
      <button type="button" className="al-scrim" aria-label={t.close} tabIndex={-1} onClick={() => open(null)} />
      <div className="al-drawer-box" ref={box}>
        <div className="al-drawer-top">
          <button type="button" className="al-close" onClick={() => open(null)} data-autofocus>
            {t.close}
          </button>
          <div className="al-drawer-nav">
            <button type="button" onClick={() => go(-1)} aria-label={t.prev}>
              ‹
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.next}>
              ›
            </button>
          </div>
        </div>
        <p className={`al-status is-${h.status}`}>{t.status[h.status]}</p>
        <h3 id="al-drawer-h" className="al-drawer-code">
          {h.code}
        </h3>
        <p className="al-drawer-kind">
          {KINDS[h.kind].name[lang]}, {t.bedsN(h.beds)}
        </p>
        <p className="al-small">{KINDS[h.kind].note[lang]}</p>
        <Plan h={h} />
        <dl className="al-facts">
          <div>
            <dt>{t.inside}</dt>
            <dd>{h.inside} m²</dd>
          </div>
          <div>
            <dt>{t.outside}</dt>
            <dd>{h.outside} m²</dd>
          </div>
          <div>
            <dt>{t.view}</dt>
            <dd>{h.view[lang]}</dd>
          </div>
          <div>
            <dt>{t.price}</dt>
            <dd>{h.status === "sold" ? t.status.sold : eur(h.price)}</dd>
          </div>
        </dl>
        <p className="al-small">{h.status === "sold" ? t.soldOut : t.priceNote}</p>
        <button type="button" className="al-btn al-btn-bloom" onClick={call}>
          {t.callAbout(h.code)}
        </button>
      </div>
    </div>
  );
}
