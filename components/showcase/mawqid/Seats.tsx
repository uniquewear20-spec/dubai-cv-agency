"use client";

// The counter drawn from above: fourteen stools on a horseshoe of oak around the hearth, the pass
// across the open end. Used twice: as a preview where pointing at a stool shows the view from it,
// and in the reservation, where it shows the night as it is booked and lets you move your party.

import { type KeyboardEvent } from "react";
import { SEATS, ZONES, zoneOf, type Lang } from "@/lib/showcase/mawqid";

const CX = 200,
  CY = 172,
  R = 150;

/** Stool positions: three on each arm, eight around the curve. */
export const SEAT_POS = Array.from({ length: SEATS }, (_, i) => {
  if (i < 3) return { x: CX - R, y: 62 + i * 45 };
  if (i > 10) return { x: CX + R, y: 62 + (13 - i) * 45 };
  const a = Math.PI - ((i - 3 + 0.5) * Math.PI) / 8;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
});

export function SeatMap({
  lang,
  taken = [],
  mine = [],
  hover,
  onHover,
  onPick,
  label,
  compact,
}: {
  lang: Lang;
  taken?: number[];
  mine?: number[];
  hover?: number | null;
  onHover?: (seat: number | null) => void;
  onPick?: (seat: number) => void;
  label: string;
  compact?: boolean;
}) {
  const state = (s: number) => (mine.includes(s) ? "mine" : taken.includes(s) ? "taken" : "free");
  const word = (s: number) => {
    const st = state(s);
    if (lang === "ar") return st === "mine" ? "لك" : st === "taken" ? "محجوز" : "متاح";
    return st === "mine" ? "yours" : st === "taken" ? "taken" : "free";
  };
  const key = (e: KeyboardEvent, s: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPick?.(s);
    }
  };
  return (
    <svg
      className={`mq-seatmap${compact ? " is-compact" : ""}`}
      viewBox="0 0 400 345"
      role="group"
      aria-label={label}
      direction="ltr"
      onPointerLeave={() => onHover?.(null)}
    >
      <defs>
        <radialGradient id="mq-hearth-g" cx="0.5" cy="0.55" r="0.65">
          <stop offset="0" stopColor="#ffcf73" />
          <stop offset="0.35" stopColor="#ff7a2f" />
          <stop offset="0.75" stopColor="#a7321a" />
          <stop offset="1" stopColor="#3a1a12" />
        </radialGradient>
      </defs>
      <rect className="mq-seatmap-pass" x="78" y="10" width="244" height="16" rx="3" />
      <text className="mq-seatmap-passlabel" x="200" y="21.5" textAnchor="middle">
        {lang === "ar" ? "منصة التقديم" : "the pass"}
      </text>
      <path className="mq-seatmap-counter" d={`M${CX - 95} 34V${CY}A95 95 0 0 0 ${CX + 95} ${CY}V34`} />
      <rect className="mq-seatmap-hearth" x={CX - 46} y="70" width="92" height="150" rx="40" fill="url(#mq-hearth-g)" />
      <g className="mq-seatmap-seats">
        {SEAT_POS.map((p, i) => {
          const s = i + 1;
          const st = state(s);
          const interactive = !!onPick || !!onHover;
          return (
            <g
              key={s}
              className={`mq-seat is-${st}${hover === s ? " is-hover" : ""}`}
              transform={`translate(${p.x} ${p.y})`}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-label={`${lang === "ar" ? "المقعد" : "Seat"} ${s}, ${ZONES[zoneOf(s)].name[lang]}, ${word(s)}`}
              aria-pressed={onPick ? st === "mine" : undefined}
              aria-disabled={onPick && st === "taken" ? true : undefined}
              onPointerEnter={() => onHover?.(s)}
              onFocus={() => onHover?.(s)}
              onClick={() => onPick?.(s)}
              onKeyDown={(e) => key(e, s)}
            >
              <circle r="17" />
              <text y="4.6" textAnchor="middle">
                {s}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
