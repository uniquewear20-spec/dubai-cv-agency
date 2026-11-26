"use client";

// Signature one: the Courtyard House as an exploded axonometric that puts itself together as you
// scroll. Six layers float above the plinth and land one after another; the caption follows the
// layer that is landing. Drawn in SVG from simple boxes in metres, so it stays sharp at any size.

import { useCallback, useState } from "react";
import { LAYERS } from "@/lib/showcase/zill";
import { useScrollStage } from "../useScrollStage";
import { useZill } from "./state";

const S = 13;
const C30 = Math.cos(Math.PI / 6);
// x grows westward (down-right on screen), y grows southward (down-left), z is height
const P = (x: number, y: number, z: number) => `${((x - y) * C30 * S).toFixed(1)},${((x + y) * 0.5 * S - z * S).toFixed(1)}`;

type Tone = "stone" | "earth" | "lime" | "water" | "screen";
type Item = { kind: "box"; b: [number, number, number, number, number, number]; tone: Tone; k: number; vents?: boolean } | { kind: "tree"; k: number };

const L: Item[][] = [
  [{ kind: "box", b: [-1, -1, -0.45, 21, 21, 0], tone: "stone", k: 0 }],
  [
    { kind: "box", b: [0, 0, 0, 20, 6, 4], tone: "earth", k: 10 },
    { kind: "box", b: [0, 6, 0, 6, 14, 4], tone: "earth", k: 11 },
    { kind: "box", b: [14, 6, 0, 20, 14, 4], tone: "earth", k: 30 },
    { kind: "box", b: [0, 14, 0, 20, 20, 4], tone: "earth", k: 31 },
  ],
  [
    { kind: "box", b: [9.3, 6.6, 0, 10.7, 13.4, 0.08], tone: "water", k: 20 },
    { kind: "tree", k: 22 },
  ],
  [
    { kind: "box", b: [0, 0, 4, 20, 6, 8], tone: "lime", k: 12 },
    { kind: "box", b: [0, 6, 4, 6, 14, 8], tone: "lime", k: 13 },
  ],
  [
    { kind: "box", b: [-0.3, -0.3, 8, 20.3, 6.3, 8.35], tone: "lime", k: 14 },
    { kind: "box", b: [-0.3, 6.3, 8, 6.3, 14.3, 8.35], tone: "lime", k: 15 },
    { kind: "box", b: [1, 1, 8.35, 4.2, 4.2, 12.2], tone: "lime", k: 16, vents: true },
  ],
  [{ kind: "box", b: [20.5, 1, 0.4, 20.75, 19, 3.8], tone: "screen", k: 40 }],
];
/** Where each layer's number sits on the drawing. */
const ANCHOR: [number, number, number][] = [
  [21, 21, 0],
  [20, 20, 4],
  [10, 13.4, 0.1],
  [20, 6, 8],
  [2.6, 2.6, 12.2],
  [20.75, 19, 3.8],
];
const n = LAYERS.length;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function Box({ b, tone, dz, vents }: { b: number[]; tone: Tone; dz: number; vents?: boolean }) {
  const [x0, y0, z0r, x1, y1, z1r] = b;
  const z0 = z0r + dz,
    z1 = z1r + dz;
  return (
    <g className={`zl-axo-box is-${tone}`}>
      <polygon className="f-west" points={[P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)].join(" ")} />
      <polygon className="f-south" points={[P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)].join(" ")} />
      <polygon className="f-top" points={[P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)].join(" ")} />
      {vents &&
        [0.25, 0.5, 0.75].map((f) => (
          <polygon
            key={f}
            className="f-vent"
            points={[P(x0 + (x1 - x0) * f - 0.25, y1, z1 - 2.6), P(x0 + (x1 - x0) * f + 0.25, y1, z1 - 2.6), P(x0 + (x1 - x0) * f + 0.25, y1, z1 - 0.5), P(x0 + (x1 - x0) * f - 0.25, y1, z1 - 0.5)].join(" ")}
          />
        ))}
    </g>
  );
}

function Tree({ dz }: { dz: number }) {
  const [tx, ty] = P(10, 9, dz).split(",").map(Number);
  const [cx, cy] = P(10, 9, 3.6 + dz).split(",").map(Number);
  return (
    <g className="zl-axo-tree">
      <line x1={tx} y1={ty} x2={cx} y2={cy + 6} />
      <circle cx={cx} cy={cy} r={1.9 * S} />
      <circle cx={cx - 6} cy={cy - 7} r={0.9 * S} className="hi" />
    </g>
  );
}

export function Axo() {
  const { t, lang } = useZill();
  const [p, setP] = useState(0);
  const onFrame = useCallback((v: number) => setP(Math.round(v * 400) / 400), []);
  const { ref } = useScrollStage<HTMLElement>(onFrame, 0.14);
  const local = L.map((_, i) => Math.max(0, Math.min(1, p * n * 1.05 - i)));
  const cur = Math.min(n - 1, Math.floor(Math.min(0.999, p * 1.05) * n));
  const settled: { it: Item; i: number }[] = [];
  const floating: { it: Item; i: number }[] = [];
  L.forEach((items, i) => items.forEach((it) => (local[i] >= 1 ? settled : floating).push({ it, i })));
  settled.sort((a, b) => a.it.k - b.it.k);
  const draw = ({ it, i }: { it: Item; i: number }) => {
    const dz = (1 - ease(local[i])) * (5 + i * 2.6);
    const key = `${i}-${it.k}`;
    return (
      <g key={key} className={`zl-axo-layer${i === cur ? " is-cur" : ""}`} style={{ opacity: 0.3 + 0.7 * local[i] }}>
        {it.kind === "box" ? <Box b={it.b} tone={it.tone} dz={dz} vents={it.vents} /> : <Tree dz={dz} />}
      </g>
    );
  };
  return (
    <section className="zl-house" id="house" ref={ref} aria-labelledby="zl-house-h">
      <div className="zl-house-stage">
        <header className="zl-house-head">
          <h2 id="zl-house-h">{t.houseTitle}</h2>
          <p>{t.houseIntro}</p>
        </header>
        <svg className="zl-axo" viewBox="-265 -420 530 720" role="img" aria-label={t.houseTitle} direction="ltr">
          <defs>
            <pattern id="zl-dots" width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="3.5" cy="3.5" r="1.9" fill="#3b2c22" />
            </pattern>
          </defs>
          {settled.map(draw)}
          {floating.map(draw)}
          {ANCHOR.map((a, i) => {
            const [x, y] = P(a[0], a[1], a[2] + (1 - ease(local[i])) * (5 + i * 2.6)).split(",").map(Number);
            return (
              <g key={i} className={`zl-axo-pin${i === cur ? " is-cur" : ""}${local[i] >= 1 ? " is-set" : ""}`} transform={`translate(${x} ${y})`}>
                <circle r="9" />
                <text y="3.5" textAnchor="middle">
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="zl-house-cap" aria-live="polite">
          <p className="zl-house-n">
            {t.layer} {cur + 1} / {n}
          </p>
          <h3>{LAYERS[cur].name[lang]}</h3>
          <p>{LAYERS[cur].note[lang]}</p>
          <ol className="zl-house-list">
            {LAYERS.map((l, i) => (
              <li key={i} className={i === cur ? "is-cur" : local[i] >= 1 ? "is-set" : ""}>
                {l.name[lang]}
              </li>
            ))}
          </ol>
        </div>
        <a className="zl-house-skip" href="#sun">
          {t.skipHouse}
        </a>
      </div>
    </section>
  );
}
