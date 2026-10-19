"use client";

// Ink Orbit features: Zenith AI edition.
//
// Adapted from the "ink-orbit-saas-template" features bento (live diagrams on a hatched sheet, cards with
// corner brackets) and rebuilt to explain Zenith AI Career Automation:
//   01 Application engine: your CV and career profile enter Zenith AI, which reads supported job sources,
//      prepares an application pack and moves each application through prepared, approved by you,
//      submitted (only once the sending channel confirms it) and response. A five-stage tour you can step through.
//   02 Connected workflow: Zenith AI at the centre of what it depends on. Every connection says what it is and
//      what it depends on; the email connection can be revoked and the campaign paused, to show the controls the
//      product is designed around. It is an interactive preview: nothing on the drawing is connected.
//   03 Application intelligence: an interactive weekly chart of one sample campaign, labelled as illustrative.
//
// Changes from the supplied component:
// - The source did not compile: the title parser's regular expression and the default title string had real
//   line breaks pasted into them. Copy, brand and data now arrive as props (EN/FR/AR), so neither is needed.
// - Light and dark follow the site's own switch (not the OS setting), in Zenith's palette; layouts mirror in RTL.
// - No invented activity: the original's ever-increasing "REPORT #134" counter and "pred +164%" forecast are
//   replaced by document types being prepared and by sample data that says so.
// - Accessibility: the stages are a tablist, connections are buttons, the chart is a keyboard slider with a table
//   view; motion has a pause control, stops off-screen, and is not drawn at all with reduced motion.
// - SVG ids are unique per instance; styles are scoped (.io-*) and hoisted once by React.

import * as React from "react";
import {
  Building2, Check, ListChecks, Mail, Pause, Play, Plug, Radar, Table2, Unplug, UserRound,
} from "lucide-react";

/* ----------------------------------------------------------------------------------------------- types */

export type InkTone = "dark" | "light";
export type InkDir = "ltr" | "rtl";

export interface InkCardCopy { index: string; kicker: string; title: string; body: string }
export interface InkStage { label: string; detail: string }
export type InkNodeId = "profile" | "email" | "sources" | "portals" | "tracker";
export interface InkNode { id: InkNodeId; title: string; status: string; detail: string }
export interface InkWeek { prepared: number; submitted: number; responses: number; interviews: number }

export interface InkOrbitCopy {
  brand: string;
  preview: string;
  motion: { pause: string; play: string };
  engine: InkCardCopy & {
    aria: string;
    stagesLabel: string;
    stages: [InkStage, InkStage, InkStage, InkStage, InkStage];
    cv: string;
    profile: string;
    fields: [string, string, string, string];
    sources: string;
    hubSub: string;
    pack: string;
    sheets: [string, string, string];
    pipeline: { prepared: string; approved: string; submitted: string; confirmed: string; response: string };
  };
  connect: InkCardCopy & {
    aria: string;
    hubSub: string;
    nodes: InkNode[];
    choose: string;
    revoke: string; reconnect: string; revoked: string;
    pauseCampaign: string; resumeCampaign: string; pausedNote: string; pausedHub: string;
    handshake: [string, string, string];
  };
  intel: InkCardCopy & {
    badge: string;
    series: { prepared: string; submitted: string; responses: string; interviews: string };
    week: (n: number) => string;
    weekShort: (n: number) => string;
    slider: string;
    hint: string;
    showTable: string; hideTable: string; tableCaption: string; weekCol: string;
    /** What each count means, so prepared, submitted, answered and interviewed are never confused. */
    defs: { prepared: string; submitted: string; responses: string; interviews: string };
  };
}

export interface InkOrbitFeaturesProps {
  copy: InkOrbitCopy;
  /** Weekly sample data for the chart. It is labelled on screen as illustrative. */
  data: readonly InkWeek[];
  tone?: InkTone;
  dir?: InkDir;
  className?: string;
}

/* ----------------------------------------------------------------------------------------------- hooks */

function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback((cb: () => void) => {
    const m = window.matchMedia(query);
    m.addEventListener("change", cb);
    return () => m.removeEventListener("change", cb);
  }, [query]);
  return React.useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

/** Width of an element, kept up to date (0 until measured). */
function useWidth<T extends HTMLElement>() {
  const [w, setW] = React.useState(0);
  const ref = React.useCallback((el: T | null) => {
    if (!el || typeof ResizeObserver !== "function") return;
    const ro = new ResizeObserver(entries => setW(Math.round(entries[0].contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** Whether the element is near the viewport, and whether it has ever been. */
function useInView<T extends Element>(rootMargin = "0px") {
  const [state, setState] = React.useState({ now: false, seen: false });
  const ref = React.useCallback((el: T | null) => {
    if (!el) return;
    if (typeof IntersectionObserver !== "function") { setState({ now: true, seen: true }); return; }
    const io = new IntersectionObserver(([e]) => setState(s => ({ now: e.isIntersecting, seen: s.seen || e.isIntersecting })), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, state.now, state.seen] as const;
}

/** SVG SMIL animations follow the motion switch (paused off-screen or on request). */
function useSmil(motion: boolean) {
  const ref = React.useRef<SVGSVGElement | null>(null);
  React.useEffect(() => {
    const s = ref.current;
    if (!s || typeof s.pauseAnimations !== "function") return;
    if (motion) s.unpauseAnimations(); else s.pauseAnimations();
  });
  return ref;
}

/* ----------------------------------------------------------------------------------------------- bits */

// The Zenith flame, traced from the site's own logo (24 × 24).
export const ZENITH_MARK = "M11.61 23.60C10.42 22.98 7.55 20.28 6.60 18.90C5.40 17.15 5.53 15.27 6.94 13.86C7.92 12.90 8.97 12.54 11.16 12.42C12.43 12.36 13.07 12.23 13.72 11.91C14.87 11.34 15.59 10.40 15.96 9.00C16.09 8.49 16.12 8.25 16.15 7.16C16.17 6.17 16.19 5.88 16.26 5.82C16.85 5.23 17.96 7.63 17.83 9.20C17.65 11.30 16.36 13.09 14.42 13.93C13.40 14.37 12.83 14.48 10.82 14.59C9.64 14.66 9.18 14.77 8.68 15.12C7.45 15.98 7.50 17.90 8.78 19.12C10.03 20.31 11.71 20.69 13.57 20.22C14.78 19.91 16.02 19.35 17.15 18.63C17.75 18.25 17.85 18.22 17.98 18.37C18.20 18.64 17.03 19.95 14.65 22.07C12.79 23.73 12.31 23.97 11.61 23.60ZM10.49 18.63C9.52 18.56 9.16 18.42 8.95 18.03C8.60 17.35 9.29 16.67 10.47 16.52C10.73 16.49 11.51 16.44 12.21 16.40C13.97 16.32 14.70 16.15 15.78 15.59C17.06 14.93 17.96 13.84 18.42 12.39C18.59 11.85 18.67 11.41 18.75 10.50C18.82 9.83 18.86 9.74 19.09 9.69C19.28 9.66 19.49 9.87 19.72 10.31C20.28 11.42 20.36 12.89 19.93 14.13C18.86 17.19 15.14 18.97 10.49 18.63ZM4.37 15.76C4.22 15.61 4.11 15.36 3.99 14.89C3.40 12.67 4.43 10.60 6.66 9.48C7.28 9.17 7.91 8.97 9.03 8.74C10.66 8.40 11.08 8.26 11.73 7.81C13.21 6.77 13.66 5.07 12.87 3.55C12.75 3.32 12.63 3.14 12.60 3.14C12.58 3.14 12.33 3.45 12.06 3.84C10.60 5.91 9.43 7.02 8.00 7.72C6.90 8.25 6.56 8.32 6.34 8.06C6.22 7.92 6.33 7.73 6.98 6.99C7.62 6.25 8.66 4.96 9.47 3.89C12.05 0.50 12.27 0.24 12.62 0.24C12.90 0.24 13.97 1.55 14.55 2.59C15.52 4.35 15.44 6.46 14.35 8.08C13.32 9.61 12.33 10.19 9.85 10.68C7.85 11.07 7.19 11.37 6.30 12.27C5.51 13.07 5.10 13.98 4.97 15.26C4.95 15.47 4.90 15.70 4.87 15.75C4.81 15.89 4.50 15.89 4.37 15.76Z";

function Brackets() {
  return (
    <>
      <span className="io-c io-c-tl" aria-hidden="true" />
      <span className="io-c io-c-tr" aria-hidden="true" />
      <span className="io-c io-c-bl" aria-hidden="true" />
      <span className="io-c io-c-br" aria-hidden="true" />
    </>
  );
}

function CardHead({ c, end }: { c: InkCardCopy; end?: React.ReactNode }) {
  return (
    <div className="io-head">
      <span className="io-idx">{c.index}</span>
      <span className="io-kick">{c.kicker}</span>
      <span className="io-rule" aria-hidden="true" />
      {end}
    </div>
  );
}

/** Absolute position of an HTML label over a drawing, from drawing units. */
function at(x: number, y: number, W: number, H: number, w?: number, h?: number): React.CSSProperties {
  return {
    left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`,
    ...(w !== undefined ? { width: `${(w / W) * 100}%` } : null),
    ...(h !== undefined ? { height: `${(h / H) * 100}%` } : null),
  };
}

/** The Zenith AI hub: a disc with the flame, a dashed orbit with three satellites and a turning bezel. */
function Hub({ x, y, uid, label }: { x: number; y: number; uid: string; label?: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="96" fill={`url(#${uid}-glow)`} />
      <g className="io-spin-slow">
        {ticks.map(i => {
          const a = (i / 72) * Math.PI * 2, long = i % 6 === 0, r1 = long ? 56 : 59, r2 = 62;
          return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} className={long ? "io-tick io-tick-l" : "io-tick"} />;
        })}
      </g>
      <g className="io-spin">
        <circle r="45" className="io-orbit" />
        <circle cx="45" cy="0" r="2.6" className="io-sat" />
        <circle cx="-22.5" cy="38.97" r="2" className="io-sat io-sat-2" />
        <circle cx="-22.5" cy="-38.97" r="1.6" className="io-sat io-sat-3" />
      </g>
      <circle r="31" className="io-disc" />
      <circle r="31" className="io-disc-ring" />
      <g transform="translate(-13 -13) scale(1.083)"><path d={ZENITH_MARK} className="io-mark" /></g>
      {label && <text y="80" textAnchor="middle" className="io-hubtxt">{label}</text>}
    </g>
  );
}

/* ----------------------------------------------------------------------------------------------- 01 engine */

type EngineGeo = {
  W: number; H: number; tall: boolean;
  cv: [number, number, number, number]; profile: [number, number, number, number];
  sources: [number, number, number]; sourceLine: string;
  hub: [number, number]; hubLabel: [number, number, number];
  pack: [number, number, number, number]; packLabel: [number, number, number];
  pipe: [number, number, number, number];
  paths: { cv: string; profile: string; out: string; pipe: string };
};

const WIDE: EngineGeo = {
  W: 960, H: 340, tall: false,
  cv: [118, 150, 126, 168], profile: [236, 208, 148, 150],
  sources: [430, 34, 230], sourceLine: "M430,54 L430,118",
  hub: [430, 186], hubLabel: [430, 292, 200],
  pack: [636, 184, 126, 160], packLabel: [636, 300, 180],
  pipe: [760, 76, 186, 212],
  paths: {
    cv: "M182,106 C262,106 318,168 366,178",
    profile: "M311,214 C342,214 348,198 367,194",
    out: "M493,186 C520,186 540,186 571,186",
    pipe: "M718,150 C742,150 748,98 766,98",
  },
};

const TALL: EngineGeo = {
  W: 360, H: 690, tall: true,
  cv: [104, 112, 136, 180], profile: [252, 146, 144, 152],
  sources: [56, 344, 96], sourceLine: "M106,344 L117,344",
  hub: [180, 344], hubLabel: [306, 344, 92],
  pack: [180, 528, 132, 158], packLabel: [306, 528, 92],
  pipe: [18, 610, 324, 76],
  paths: {
    cv: "M104,204 C104,252 166,258 172,283",
    profile: "M252,224 C252,256 196,262 189,283",
    out: "M180,407 C180,422 180,432 180,446",
    pipe: "M180,609 C180,612 180,614 180,617",
  },
};

function EngineCard({ c, brand, rtl, motion, uid }: { c: InkOrbitCopy["engine"]; brand: string; rtl: boolean; motion: boolean; uid: string }) {
  const [boxRef, width] = useWidth<HTMLDivElement>();
  const g = width > 0 && width < 640 ? TALL : WIDE;
  const { W, H } = g;
  const X = (x: number) => (rtl ? W - x : x);
  const P = (d: string) => (rtl ? d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, a, b) => `${W - Number(a)},${b}`) : d);

  const [stage, setStage] = React.useState(0);
  const [held, setHeld] = React.useState(false);
  const [picked, setPicked] = React.useState(false);
  React.useEffect(() => {
    if (!motion || held || picked) return;
    const t = window.setInterval(() => setStage(s => (s + 1) % c.stages.length), 3800);
    return () => window.clearInterval(t);
  }, [motion, held, picked, c.stages.length]);

  const [sheet, setSheet] = React.useState(0);
  React.useEffect(() => {
    if (!motion) return;
    const t = window.setInterval(() => setSheet(s => (s + 1) % 3), 2600);
    return () => window.clearInterval(t);
  }, [motion]);

  const svgRef = useSmil(motion);
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const choose = (i: number, focus = false) => { setStage(i); setPicked(true); if (focus) tabs.current[i]?.focus(); };
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const n = c.stages.length, fwd = rtl ? "ArrowLeft" : "ArrowRight", back = rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key === fwd) { e.preventDefault(); choose((i + 1) % n, true); }
    else if (e.key === back) { e.preventDefault(); choose((i - 1 + n) % n, true); }
    else if (e.key === "Home") { e.preventDefault(); choose(0, true); }
    else if (e.key === "End") { e.preventDefault(); choose(n - 1, true); }
  };

  // Which parts of the drawing each stage is about.
  const on = {
    inputs: stage === 0, sources: stage === 1, hub: stage === 1 || stage === 2, pack: stage === 2,
    approved: stage === 3, submitted: stage === 4, out: stage === 2 || stage === 3 || stage === 4,
  };
  const [cx, cy, cw, ch] = g.cv, [px, py, pw, ph] = g.profile, [sx, sy, sw] = g.sources;
  const [hx, hy] = g.hub, [lx, ly, lw] = g.hubLabel, [kx, ky, kw, kh] = g.pack, [qx, qy, qw, qh] = g.pipe;
  const pl = c.pipeline;
  const rows = [
    { k: "p", label: pl.prepared, on: stage >= 2 },
    { k: "a", label: pl.approved, on: on.approved },
    { k: "s", label: pl.submitted, on: on.submitted },
    { k: "r", label: pl.response, on: on.submitted },
  ];

  return (
    <div className="io-frame io-wide" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false); }}>
      <Brackets />
      <div className="io-card">
        <CardHead c={c} />
        <div ref={boxRef} className={"io-box io-engine" + (g.tall ? " io-tall" : "")} style={{ aspectRatio: `${W} / ${H}` }} role="img" aria-label={c.aria}>
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
            <defs>
              <radialGradient id={`${uid}-glow`}>
                <stop offset="0" stopColor="var(--io-glow)" />
                <stop offset="1" stopColor="var(--io-glow)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id={`${uid}-fade`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="var(--io-line2)" stopOpacity="0" />
                <stop offset=".5" stopColor="var(--io-line2)" />
                <stop offset="1" stopColor="var(--io-line2)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* a construction line through the hub, fading out at both ends */}
            <line x1={0} x2={W} y1={hy} y2={hy} stroke={`url(#${uid}-fade)`} strokeWidth="1" />
            <g className="io-zone" data-on={on.sources}>
              <path d={P(g.sourceLine)} className="io-wire io-wire-dot" />
              {motion && <circle r="2.4" className="io-pkt"><animateMotion dur="1.6s" repeatCount="indefinite" path={P(g.sourceLine)} /></circle>}
            </g>
            <g className="io-zone" data-on={on.inputs}>
              <path d={P(g.paths.cv)} className="io-wire" />
              <path d={P(g.paths.profile)} className="io-wire io-wire-dash" />
              {motion && [g.paths.cv, g.paths.profile].map((d, i) => (
                <circle key={i} r="2.4" className="io-pkt"><animateMotion dur={`${2.3 + i * 0.5}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" path={P(d)} /></circle>
              ))}
            </g>
            <g className="io-zone" data-on={on.out}>
              <path d={P(g.paths.out)} className="io-wire" />
              <path d={P(g.paths.pipe)} className="io-wire io-wire-dash" />
              {motion && [g.paths.out, g.paths.pipe].map((d, i) => (
                <circle key={i} r="2.4" className="io-pkt"><animateMotion dur={`${1.5 + i * 0.6}s`} begin={`${0.3 + i * 0.5}s`} repeatCount="indefinite" path={P(d)} /></circle>
              ))}
            </g>
            <g className="io-zone" data-on={on.hub || on.inputs || on.sources}>
              <Hub x={X(hx)} y={hy} uid={uid} />
            </g>
          </svg>

          {/* inputs */}
          <div className="io-abs io-doc io-zone" data-on={on.inputs} style={{ ...at(X(cx), cy, W, H, cw, ch), rotate: rtl ? "4deg" : "-4deg" }} aria-hidden="true">
            <span className="io-doc-k">{c.cv}</span>
            <span className="io-ln io-ln-h" style={{ width: "62%" }} />
            <span className="io-ln" style={{ width: "40%" }} />
            <span className="io-gap" />
            {[92, 78, 86, 64, 88, 70, 80, 56].map((w, i) => <span key={i} className="io-ln" style={{ width: `${w}%` }} />)}
          </div>
          <div className="io-abs io-prof io-zone" data-on={on.inputs} style={{ ...at(X(px), py, W, H, pw, ph), rotate: rtl ? "-3deg" : "3deg" }} aria-hidden="true">
            <span className="io-prof-top"><span className="io-avatar" /><span className="io-doc-k">{c.profile}</span></span>
            {c.fields.map((f, i) => (
              <span key={f} className="io-field"><span className="io-field-k">{f}</span><span className="io-ln" style={{ width: `${[70, 54, 46, 62][i]}%` }} /></span>
            ))}
          </div>
          <div className="io-abs io-pill io-zone" data-on={on.sources} style={at(X(sx), sy, W, H, sw)} aria-hidden="true">
            <Radar size={12} strokeWidth={1.6} aria-hidden="true" /><span>{c.sources}</span>
          </div>
          <div className="io-abs io-hublabel" style={at(X(lx), ly, W, H, lw)} aria-hidden="true">
            <b>{brand}</b><span>{c.hubSub}</span>
          </div>

          {/* the application pack: three documents, the front one being prepared */}
          <div className="io-abs io-pack io-zone" data-on={on.pack} style={at(X(kx), ky, W, H, kw, kh)} aria-hidden="true">
            <span className="io-sheet io-sheet-3" />
            <span className="io-sheet io-sheet-2" />
            <span key={sheet} className="io-sheet io-sheet-1">
              <span className="io-sheet-k">{c.sheets[sheet]}</span>
              <span className="io-ln io-ln-h io-wl" style={{ width: "58%", "--i": 0 } as React.CSSProperties} />
              {[90, 84, 92, 70, 86, 60].map((w, i) => <span key={i} className="io-ln io-wl" style={{ width: `${w}%`, "--i": i + 1 } as React.CSSProperties} />)}
            </span>
          </div>
          <div className="io-abs io-cap" style={at(X(g.packLabel[0]), g.packLabel[1], W, H, g.packLabel[2])} aria-hidden="true">{c.pack}</div>

          {/* the pipeline: an application's states, each only when it is true */}
          <div className={"io-abs io-pipe" + (g.tall ? " io-pipe-x" : "")} style={{ ...at(X(qx + qw / 2), qy + qh / 2, W, H, qw, qh) }} aria-hidden="true">
            <span className="io-rail" />
            <span className="io-token" />
            {rows.map((r, i) => (
              <span key={r.k} className={"io-row io-row-" + i + " io-zone"} data-on={r.on}>
                <span className="io-node-dot">{i === 2 && <Check size={9} strokeWidth={3} className="io-check" />}</span>
                <span className="io-row-l">{r.label}{i === 2 && <em className="io-conf">{pl.confirmed}</em>}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="io-copy io-copy-split">
          <div>
            <h3 className="io-title">{c.title}</h3>
            <p className="io-body">{c.body}</p>
          </div>
          <div className="io-stages">
            <div role="tablist" aria-label={c.stagesLabel} className="io-tabs">
              {c.stages.map((s, i) => (
                <button key={s.label} ref={el => { tabs.current[i] = el; }} type="button" role="tab" id={`${uid}-tab-${i}`}
                  aria-selected={stage === i} aria-controls={`${uid}-panel`} tabIndex={stage === i ? 0 : -1}
                  className="io-tab" onClick={() => choose(i)} onKeyDown={e => onTabKey(e, i)}>
                  <span className="io-tab-n">{String(i + 1).padStart(2, "0")}</span>{s.label}
                </button>
              ))}
            </div>
            <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${stage}`} aria-live={picked ? "polite" : "off"} className="io-panel">
              <p className="io-panel-t">{c.stages[stage].label}</p>
              <p className="io-body">{c.stages[stage].detail}</p>
              <span className="io-progress" aria-hidden="true"><span key={stage} className={motion && !held && !picked ? "io-progress-run" : ""} /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------------------- 02 connect */

const NODE_ICON: Record<InkNodeId, React.ElementType> = { profile: UserRound, email: Mail, sources: Radar, portals: Building2, tracker: ListChecks };
// Where each connection sits around the hub (LTR); the candidate's own things on the left, the outside world on the right.
const NODE_AT: Record<InkNodeId, [number, number]> = { profile: [86, 96], email: [86, 286], sources: [374, 96], portals: [374, 286], tracker: [230, 346] };
const INBOUND: Record<InkNodeId, boolean> = { profile: true, sources: true, email: false, portals: false, tracker: false };

function ConnectCard({ c, brand, rtl, motion, uid }: { c: InkOrbitCopy["connect"]; brand: string; rtl: boolean; motion: boolean; uid: string }) {
  const [boxRef, width] = useWidth<HTMLDivElement>();
  const list = width > 0 && width < 420;
  const W = 460, H = 390, hx = 230, hy = 190;
  const X = (x: number) => (rtl ? W - x : x);
  const [sel, setSel] = React.useState<InkNodeId>("email");
  const [revoked, setRevoked] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const svgRef = useSmil(motion && !paused);
  const node = c.nodes.find(n => n.id === sel) ?? c.nodes[0];
  const live = (id: InkNodeId) => !paused && !(id === "email" && revoked);
  const line = (id: InkNodeId) => {
    const [nx, ny] = NODE_AT[id];
    const x1 = X(hx), y1 = hy, x2 = X(nx), y2 = ny;
    const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
    const a = 66 / d, b = (d - 46) / d; // from the bezel to just short of the node
    const s: [number, number] = [x1 + dx * a, y1 + dy * a], e: [number, number] = [x1 + dx * b, y1 + dy * b];
    const from = INBOUND[id] ? e : s, to = INBOUND[id] ? s : e;
    return `M${from[0].toFixed(1)},${from[1].toFixed(1)} L${to[0].toFixed(1)},${to[1].toFixed(1)}`;
  };
  const statusFor = (n: InkNode) => (n.id === "email" && revoked ? c.revoked : n.id === "profile" && paused ? c.pausedNote : n.status);

  const nodeButton = (n: InkNode, style?: React.CSSProperties) => {
    const Icon = NODE_ICON[n.id];
    const off = !live(n.id);
    return (
      <button key={n.id} type="button" aria-pressed={sel === n.id} onClick={() => setSel(n.id)}
        className={"io-cnode" + (list ? "" : " io-abs") + (off ? " io-cnode-off" : "")} style={style} data-node={n.id}>
        <span className="io-cnode-i"><Icon size={13} strokeWidth={1.6} aria-hidden="true" /></span>
        <span className="io-cnode-t">{n.title}</span>
        <span className="io-cnode-s"><span className="io-sdot" data-s={n.id} />{statusFor(n)}</span>
      </button>
    );
  };

  return (
    <div className="io-frame">
      <Brackets />
      <div className="io-card">
        <CardHead c={c} />
        <div className="io-fig" role="group" aria-label={c.aria}>
          {list ? (
            <div ref={boxRef} className="io-clist">
              <div className="io-chub" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22"><path d={ZENITH_MARK} className="io-mark" /></svg>
                <span><b>{brand}</b>{paused ? c.pausedHub : c.hubSub}</span>
              </div>
              <div className="io-clist-items">{c.nodes.map(n => nodeButton(n))}</div>
            </div>
          ) : (
            <div ref={boxRef} className="io-box io-orbitbox" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
                <defs>
                  <radialGradient id={`${uid}-glow`}>
                    <stop offset="0" stopColor="var(--io-glow)" />
                    <stop offset="1" stopColor="var(--io-glow)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx={X(hx)} cy={hy} rx="176" ry="138" className="io-orbit io-orbit-wide" />
                {c.nodes.map(n => {
                  const d = line(n.id), on = sel === n.id, ok = live(n.id);
                  return (
                    <g key={n.id}>
                      <path d={d} className={"io-wire" + (ok ? " io-wire-flow" : " io-wire-cut") + (on ? " io-wire-on" : "")} />
                      {ok && on && motion && <circle r="2.6" className="io-pkt"><animateMotion dur="1.3s" repeatCount="indefinite" path={d} /></circle>}
                    </g>
                  );
                })}
                {revoked && (() => {
                  const [nx, ny] = NODE_AT.email; const mx = (X(hx) + X(nx)) / 2, my = (hy + ny) / 2;
                  return <g className="io-cutmark"><circle cx={mx} cy={my} r="9" /><path d={`M${mx - 3.5},${my - 3.5} L${mx + 3.5},${my + 3.5} M${mx + 3.5},${my - 3.5} L${mx - 3.5},${my + 3.5}`} /></g>;
                })()}
                <Hub x={X(hx)} y={hy} uid={uid} />
              </svg>
              <div className="io-abs io-hublabel io-hublabel-c" style={at(X(hx), hy - 90, W, H, 150)} aria-hidden="true">
                <b>{brand}</b><span>{paused ? c.pausedHub : c.hubSub}</span>
              </div>
              {c.nodes.map(n => nodeButton(n, at(X(NODE_AT[n.id][0]), NODE_AT[n.id][1], W, H, 146)))}
            </div>
          )}
        </div>
        <div className="io-detail" aria-live="polite">
          <p className="io-detail-t">{node.title}<span className="io-chip"><span className="io-sdot" data-s={node.id} />{statusFor(node)}</span></p>
          <p className="io-body">{node.detail}</p>
          {node.id === "email" && (
            <div className="io-acts">
              <ol className="io-hand" aria-label={c.handshake.join(", ")}>
                {c.handshake.map((h, i) => (
                  <li key={h} data-done={!revoked || i < 2}><span className="io-hand-n">{revoked && i === 2 ? "×" : <Check size={10} strokeWidth={2.6} aria-hidden="true" />}</span>{h}</li>
                ))}
              </ol>
              <button type="button" className="io-btn" aria-pressed={revoked} onClick={() => setRevoked(r => !r)}>
                {revoked ? <Plug size={13} strokeWidth={1.7} aria-hidden="true" /> : <Unplug size={13} strokeWidth={1.7} aria-hidden="true" />}
                {revoked ? c.reconnect : c.revoke}
              </button>
            </div>
          )}
          {node.id === "profile" && (
            <div className="io-acts">
              <button type="button" className="io-btn" aria-pressed={paused} onClick={() => setPaused(p => !p)}>
                {paused ? <Play size={13} strokeWidth={1.7} aria-hidden="true" /> : <Pause size={13} strokeWidth={1.7} aria-hidden="true" />}
                {paused ? c.resumeCampaign : c.pauseCampaign}
              </button>
            </div>
          )}
          {node.id !== "email" && node.id !== "profile" && <p className="io-hint">{c.choose}</p>}
        </div>
        <div className="io-copy">
          <h3 className="io-title">{c.title}</h3>
          <p className="io-body">{c.body}</p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------------------- 03 intel */

function niceMax(v: number) {
  const step = v <= 20 ? 5 : v <= 60 ? 10 : 20;
  return Math.max(step, Math.ceil(v / step) * step);
}

function IntelCard({ c, data, rtl, motion }: { c: InkOrbitCopy["intel"]; data: readonly InkWeek[]; rtl: boolean; motion: boolean }) {
  const [boxRef, width] = useWidth<HTMLDivElement>();
  const [seenRef, , seen] = useInView<HTMLDivElement>("-10% 0px");
  const n = data.length;
  const last = n - 1;
  const [sel, setSel] = React.useState(last);
  const [table, setTable] = React.useState(false);
  const Wd = Math.max(280, width || 520);
  const showEnd = Wd >= 360;
  const m = { s: 30, e: showEnd ? 92 : 14, t: 14 };
  const plotH = 150, laneTop = m.t + plotH + 16, laneH = 30, H = laneTop + laneH + 26;
  const top = niceMax(Math.max(...data.map(d => Math.max(d.prepared, d.submitted))));
  const x0 = m.s, x1 = Wd - m.e;
  const xs = data.map((_, i) => (n < 2 ? (x0 + x1) / 2 : x0 + (i / (n - 1)) * (x1 - x0)));
  const X = (x: number) => (rtl ? Wd - x : x);
  const Y = (v: number) => m.t + plotH - (v / top) * plotH;
  const path = (k: "prepared" | "submitted") => data.map((d, i) => `${i ? "L" : "M"}${X(xs[i]).toFixed(1)},${Y(d[k]).toFixed(1)}`).join(" ");
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(top * f));
  const w = data[sel];
  const valueText = `${c.week(sel + 1)}: ${w.prepared} ${c.series.prepared}, ${w.submitted} ${c.series.submitted}, ${w.responses} ${c.series.responses}, ${w.interviews} ${c.series.interviews}`;

  const pick = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const px = ((clientX - r.left) / r.width) * Wd;
    const vx = rtl ? Wd - px : px;
    let best = 0;
    for (let i = 1; i < n; i++) if (Math.abs(xs[i] - vx) < Math.abs(xs[best] - vx)) best = i;
    setSel(best);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const fwd = rtl ? "ArrowLeft" : "ArrowRight", back = rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key === fwd || e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.min(last, s + 1)); }
    else if (e.key === back || e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setSel(0); }
    else if (e.key === "End") { e.preventDefault(); setSel(last); }
  };
  const draw = seen || !motion;
  // Text anchors are not mirrored by hand: SVG text inherits the page direction, so "start" and "end" already
  // flip in right-to-left.

  return (
    <div className="io-frame" ref={seenRef}>
      <Brackets />
      <div className="io-card">
        <CardHead c={c} />
        <div className="io-fig">
          <p className="io-badge"><span className="io-dot" />{c.badge}</p>
          <div className="io-readout" aria-hidden="true">
            <span className="io-readout-w">{c.week(sel + 1)}</span>
            <span><i className="io-key io-key-sub" /><b>{w.submitted}</b>{c.series.submitted}</span>
            <span><i className="io-key io-key-pre" /><b>{w.prepared}</b>{c.series.prepared}</span>
            <span><i className="io-key io-key-res" /><b>{w.responses}</b>{c.series.responses}</span>
            <span><i className="io-key io-key-int" /><b>{w.interviews}</b>{c.series.interviews}</span>
          </div>
          <div ref={boxRef} className="io-chart">
            <svg width="100%" viewBox={`0 0 ${Wd} ${H}`} aria-hidden="true" focusable="false" className={draw ? "io-drawn" : ""}>
              {ticks.map(t => (
                <g key={t}>
                  <line x1={X(x0)} x2={X(x1)} y1={Y(t)} y2={Y(t)} className="io-grid" />
                  <text x={X(x0 - 8)} y={Y(t) + 3.5} textAnchor="end" className="io-axis">{t}</text>
                </g>
              ))}
              <path d={path("prepared")} pathLength={1} className="io-line io-line-pre" />
              <path d={path("submitted")} pathLength={1} className="io-line io-line-sub" />
              {/* the event lane: each employer response and interview as its own mark */}
              <line x1={X(x0)} x2={X(x1)} y1={laneTop - 7} y2={laneTop - 7} className="io-grid" />
              {data.map((d, i) => (
                <g key={i}>
                  {Array.from({ length: d.responses }, (_, k) => <circle key={"r" + k} cx={X(xs[i] + (k - (d.responses - 1) / 2) * 6.5)} cy={laneTop + 4} r="2.4" className="io-ev-res" />)}
                  {Array.from({ length: d.interviews }, (_, k) => { const ex = X(xs[i] + (k - (d.interviews - 1) / 2) * 8), ey = laneTop + 18; return <path key={"i" + k} d={`M${ex},${ey - 4} L${ex + 4},${ey} L${ex},${ey + 4} L${ex - 4},${ey} Z`} className="io-ev-int" />; })}
                  <text x={X(xs[i])} y={H - 4} textAnchor="middle" className={"io-axis" + (i === sel ? " io-axis-on" : "")}>{c.weekShort(i + 1)}</text>
                </g>
              ))}
              <line x1={X(xs[sel])} x2={X(xs[sel])} y1={m.t - 4} y2={laneTop + laneH - 2} className="io-cross" />
              {(["prepared", "submitted"] as const).map(k => (
                <circle key={k} cx={X(xs[sel])} cy={Y(w[k])} r="4.5" className={"io-mk " + (k === "prepared" ? "io-mk-pre" : "io-mk-sub")} />
              ))}
              {showEnd && (["submitted", "prepared"] as const).map(k => {
                const v = data[last][k], other = data[last][k === "submitted" ? "prepared" : "submitted"];
                const gap = Math.abs(Y(v) - Y(other)) < 14 ? (Y(v) > Y(other) ? 7 : -7) : 0;
                return <text key={k} x={X(xs[last] + 10)} y={Y(v) + 4 + gap} textAnchor="start" className="io-endl"><tspan className="io-endv">{v}</tspan> {c.series[k]}</text>;
              })}
            </svg>
            <div className="io-slider" role="slider" tabIndex={0} aria-label={c.slider} aria-valuemin={1} aria-valuemax={n} aria-valuenow={sel + 1} aria-valuetext={valueText}
              style={{ insetInlineStart: `${(m.s / Wd) * 100}%`, insetInlineEnd: `${(m.e / Wd) * 100}%`, top: 0, height: `${((laneTop + laneH) / H) * 100}%` }}
              onPointerMove={e => pick(e.clientX, e.currentTarget.parentElement as HTMLElement)}
              onPointerDown={e => pick(e.clientX, e.currentTarget.parentElement as HTMLElement)}
              onPointerLeave={e => { if (e.pointerType === "mouse") setSel(last); }}
              onKeyDown={onKey} />
          </div>
          <div className="io-legend">
            <span><i className="io-key io-key-sub" />{c.series.submitted}</span>
            <span><i className="io-key io-key-pre" />{c.series.prepared}</span>
            <span><i className="io-key io-key-res" />{c.series.responses}</span>
            <span><i className="io-key io-key-int" />{c.series.interviews}</span>
            <button type="button" className="io-link" aria-expanded={table} onClick={() => setTable(t => !t)}>
              <Table2 size={12} strokeWidth={1.7} aria-hidden="true" />{table ? c.hideTable : c.showTable}
            </button>
          </div>
          <p className="io-hint">{c.hint}</p>
          <dl className="io-defs">
            {(["prepared", "submitted", "responses", "interviews"] as const).map(k => (
              <div key={k}>
                <dt><i className={"io-key " + { prepared: "io-key-pre", submitted: "io-key-sub", responses: "io-key-res", interviews: "io-key-int" }[k]} />{c.series[k]}</dt>
                <dd>{c.defs[k]}</dd>
              </div>
            ))}
          </dl>
          {table && (
            <div className="io-tablewrap">
              <table className="io-table">
                <caption>{c.tableCaption}</caption>
                <thead><tr><th scope="col">{c.weekCol}</th><th scope="col">{c.series.prepared}</th><th scope="col">{c.series.submitted}</th><th scope="col">{c.series.responses}</th><th scope="col">{c.series.interviews}</th></tr></thead>
                <tbody>{data.map((d, i) => <tr key={i}><th scope="row">{c.week(i + 1)}</th><td>{d.prepared}</td><td>{d.submitted}</td><td>{d.responses}</td><td>{d.interviews}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>
        <div className="io-copy">
          <h3 className="io-title">{c.title}</h3>
          <p className="io-body">{c.body}</p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------------------- root */

export default function InkOrbitFeatures({ copy, data, tone = "dark", dir = "ltr", className = "" }: InkOrbitFeaturesProps) {
  const uid = "io" + React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [paused, setPaused] = React.useState(false);
  const [viewRef, inView] = useInView<HTMLDivElement>("160px");
  const motion = !reduced && !paused && inView;
  const rtl = dir === "rtl";
  return (
    <div ref={viewRef} className={"io-root " + className} data-tone={tone} data-motion={motion ? "on" : "off"} dir={dir}>
      <style href="ink-orbit-features" precedence="medium">{CSS}</style>
      <div className="io-bar">
        <p className="io-note"><span className="io-dot" />{copy.preview}</p>
        {!reduced && (
          <button type="button" className="io-btn io-btn-quiet" aria-pressed={paused} onClick={() => setPaused(p => !p)}>
            {paused ? <Play size={12} strokeWidth={1.8} aria-hidden="true" /> : <Pause size={12} strokeWidth={1.8} aria-hidden="true" />}
            {paused ? copy.motion.play : copy.motion.pause}
          </button>
        )}
      </div>
      <div className="io-bento">
        <EngineCard c={copy.engine} brand={copy.brand} rtl={rtl} motion={motion} uid={uid + "e"} />
        <ConnectCard c={copy.connect} brand={copy.brand} rtl={rtl} motion={motion} uid={uid + "c"} />
        <IntelCard c={copy.intel} data={data} rtl={rtl} motion={motion} />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------------------- styles */

const CSS = `
.io-root{--io-sheet:#0D0B09;--io-hatch:rgba(200,169,110,.045);--io-card:#13110E;--io-card2:#0E0C0A;--io-raise:#1A1713;--io-ink:#EDE8E0;--io-soft:#CFC6BA;--io-muted:#A3988C;--io-faint:#6E645A;--io-line:rgba(255,255,255,.07);--io-line2:rgba(255,255,255,.14);--io-gold:#C8A96E;--io-goldt:#D9BD84;--io-goldm:#B48C3A;--io-blue:#668DCB;--io-bracket:rgba(200,169,110,.30);--io-glow:rgba(200,169,110,.13);--io-ok:#6FBF8E;--io-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;--io-sans:"Helvetica Neue",Helvetica,Arial,sans-serif;--io-serif:Georgia,"Times New Roman",serif;position:relative;color:var(--io-ink);font-family:var(--io-sans)}
.io-root[data-tone=light]{--io-sheet:#EFE8DD;--io-hatch:rgba(138,106,46,.075);--io-card:#FFFFFF;--io-card2:#FBF8F3;--io-raise:#FFFFFF;--io-ink:#1A1410;--io-soft:#3E352E;--io-muted:#665B52;--io-faint:#9C9083;--io-line:rgba(26,20,16,.09);--io-line2:rgba(26,20,16,.17);--io-goldt:#7E5F22;--io-goldm:#A07A2C;--io-blue:#4470B0;--io-bracket:rgba(138,106,46,.42);--io-glow:rgba(200,169,110,.24);--io-ok:#2F7A52}
.io-root[dir=rtl]{--io-sans:inherit;--io-serif:inherit}
.io-root :where(*){box-sizing:border-box}
.io-root :where(h3,p,ol,figure){margin:0;padding:0}
.io-root :where(svg){display:block}
.io-root :focus-visible{outline:2px solid var(--io-gold);outline-offset:2px}
.io-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.io-note,.io-badge{display:inline-flex;align-items:center;gap:8px;font:500 10px/1.5 var(--io-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--io-muted)}
.io-root[dir=rtl] .io-note,.io-root[dir=rtl] .io-badge{font-family:inherit;letter-spacing:0;font-size:11px}
.io-dot{width:6px;height:6px;border-radius:50%;background:var(--io-gold);box-shadow:0 0 0 3px color-mix(in srgb,var(--io-gold) 22%,transparent);flex:none}
.io-btn{display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 14px;border-radius:999px;border:1px solid var(--io-line2);background:transparent;color:var(--io-ink);font:500 11px/1 var(--io-sans);letter-spacing:.06em;cursor:pointer;transition:border-color .25s,background-color .25s}
.io-btn:hover{border-color:var(--io-gold)}
.io-btn[aria-pressed=true]{background:color-mix(in srgb,var(--io-gold) 14%,transparent);border-color:var(--io-gold)}
.io-btn-quiet{height:30px;font-size:10.5px;color:var(--io-muted)}
.io-bento{position:relative;display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(18px,2.2vw,30px);padding:clamp(14px,2.2vw,30px);background-color:var(--io-sheet);background-image:repeating-linear-gradient(135deg,var(--io-hatch) 0 1px,transparent 1px 11px);border:1px solid var(--io-line)}
@media (min-width:1024px){.io-bento{grid-template-columns:repeat(2,minmax(0,1fr))}.io-wide{grid-column:1/-1}}
.io-frame{position:relative;display:flex;flex-direction:column;min-width:0}
.io-card{position:relative;flex:1;display:flex;flex-direction:column;min-width:0;background:linear-gradient(180deg,var(--io-card),var(--io-card2));border:1px solid var(--io-line);transition:border-color .35s,box-shadow .35s}
.io-frame:hover>.io-card,.io-frame:focus-within>.io-card{border-color:var(--io-line2);box-shadow:0 18px 50px -30px rgba(0,0,0,.55)}
.io-c{position:absolute;z-index:2;width:12px;height:12px;border:0 solid var(--io-bracket);pointer-events:none;transition:border-color .3s,transform .4s cubic-bezier(.2,.8,.2,1)}
.io-c-tl{top:-6px;left:-6px;border-top-width:1.5px;border-left-width:1.5px}
.io-c-tr{top:-6px;right:-6px;border-top-width:1.5px;border-right-width:1.5px}
.io-c-bl{bottom:-6px;left:-6px;border-bottom-width:1.5px;border-left-width:1.5px}
.io-c-br{bottom:-6px;right:-6px;border-bottom-width:1.5px;border-right-width:1.5px}
.io-frame:hover>.io-c,.io-frame:focus-within>.io-c{border-color:var(--io-gold)}
.io-frame:hover>.io-c-tl,.io-frame:focus-within>.io-c-tl{transform:translate(-3px,-3px)}
.io-frame:hover>.io-c-tr,.io-frame:focus-within>.io-c-tr{transform:translate(3px,-3px)}
.io-frame:hover>.io-c-bl,.io-frame:focus-within>.io-c-bl{transform:translate(-3px,3px)}
.io-frame:hover>.io-c-br,.io-frame:focus-within>.io-c-br{transform:translate(3px,3px)}
.io-head{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--io-line)}
.io-idx{font:500 10.5px/1 var(--io-mono);color:var(--io-goldt)}
.io-kick{font:600 10px/1.3 var(--io-sans);letter-spacing:.2em;text-transform:uppercase;color:var(--io-soft)}
.io-root[dir=rtl] .io-kick{letter-spacing:0;font-size:12px}
.io-rule{flex:1;height:1px;background:linear-gradient(to right,var(--io-line2),transparent)}
.io-root[dir=rtl] .io-rule{background:linear-gradient(to left,var(--io-line2),transparent)}
.io-copy{padding:18px 20px 22px;display:grid;gap:10px;margin-top:auto}
.io-copy-split{gap:22px}
@media (min-width:860px){.io-copy-split{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:start}}
.io-title{font:400 clamp(21px,1.9vw,27px)/1.18 var(--io-serif);letter-spacing:-.01em;color:var(--io-ink)}
.io-root[dir=rtl] .io-title{line-height:1.5;letter-spacing:0}
.io-body{font-size:13.5px;line-height:1.75;color:var(--io-muted);max-width:56ch}
.io-hint{font-size:11.5px;line-height:1.6;color:var(--io-faint)}
.io-fig{position:relative;padding:16px 18px 6px}
.io-box{position:relative;width:100%;container-type:inline-size}
.io-box>svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.io-abs{position:absolute;transform:translate(-50%,-50%)}
.io-zone{transition:opacity .6s ease,filter .6s ease}
.io-engine .io-zone[data-on=false]{opacity:.5}
.io-wire{fill:none;stroke:var(--io-line2);stroke-width:1.2;transition:stroke .4s}
.io-zone[data-on=true] .io-wire,.io-wire-on{stroke:var(--io-gold)}
.io-wire-dash{stroke-dasharray:3 4;animation:io-dash 1.2s linear infinite}
.io-wire-dot{stroke-dasharray:1 5;stroke-linecap:round;stroke-width:1.6;animation:io-dash 1.6s linear infinite}
.io-wire-flow{stroke-dasharray:3 5;animation:io-dash 1.4s linear infinite}
.io-wire-cut{stroke-dasharray:2 7;opacity:.55}
.io-pkt{fill:var(--io-gold)}
.io-cutmark circle{fill:var(--io-card);stroke:var(--io-gold);stroke-width:1.2}
.io-cutmark path{stroke:var(--io-gold);stroke-width:1.6;stroke-linecap:round}
.io-tick{stroke:var(--io-line2);stroke-width:1}
.io-tick-l{stroke:var(--io-gold);stroke-opacity:.6}
.io-orbit{fill:none;stroke:var(--io-gold);stroke-opacity:.38;stroke-dasharray:2 5}
.io-orbit-wide{stroke-opacity:.18;stroke-dasharray:1 6}
.io-sat{fill:var(--io-gold)}
.io-sat-2{opacity:.65}.io-sat-3{opacity:.4}
.io-disc{fill:var(--io-raise)}
.io-disc-ring{fill:none;stroke:var(--io-gold);stroke-opacity:.55;stroke-width:1.2}
.io-mark{fill:var(--io-gold)}
.io-hubtxt{font:600 9px var(--io-mono);letter-spacing:2px;fill:var(--io-soft)}
.io-spin{transform-box:fill-box;transform-origin:center;animation:io-spin 26s linear infinite}
.io-spin-slow{transform-box:fill-box;transform-origin:center;animation:io-spin 60s linear infinite reverse}
.io-hublabel{display:flex;flex-direction:column;align-items:center;gap:3px;text-align:center;pointer-events:none}
.io-hublabel b{font:600 clamp(8.5px,1.15cqi,11px)/1 var(--io-mono);letter-spacing:.24em;text-transform:uppercase;color:var(--io-ink)}
.io-hublabel span{font:400 clamp(9px,1.15cqi,11.5px)/1.35 var(--io-sans);color:var(--io-muted)}
.io-tall .io-hublabel b,.io-hublabel-c b{font-size:clamp(9px,2.6cqi,11px)}
.io-tall .io-hublabel span,.io-hublabel-c span{font-size:clamp(9.5px,2.9cqi,12px)}
.io-doc,.io-prof{overflow:hidden;display:flex;flex-direction:column;gap:max(3px,.5cqi);padding:max(8px,1.2cqi);background:var(--io-raise);border:1px solid var(--io-line2);box-shadow:0 14px 30px -18px rgba(0,0,0,.55)}
.io-doc-k{font:600 clamp(7.5px,.95cqi,10px)/1.2 var(--io-mono);letter-spacing:.16em;text-transform:uppercase;color:var(--io-goldt);margin-bottom:max(2px,.3cqi)}
.io-root[dir=rtl] .io-doc-k{font-family:var(--io-sans);letter-spacing:0;font-size:clamp(9px,1.1cqi,12px)}
.io-tall .io-doc-k{font-size:clamp(8px,2.4cqi,10px)}
.io-ln{display:block;height:max(2px,.32cqi);border-radius:2px;background:var(--io-line2)}
.io-ln-h{height:max(3px,.5cqi);background:var(--io-ink);opacity:.7}
.io-gap{height:max(3px,.4cqi)}
.io-prof-top{display:flex;align-items:center;gap:max(5px,.7cqi);margin-bottom:max(3px,.4cqi)}
.io-prof-top .io-doc-k{margin:0}
.io-avatar{width:max(14px,2.2cqi);height:max(14px,2.2cqi);border-radius:50%;background:radial-gradient(circle at 50% 38%,var(--io-faint) 0 28%,transparent 30%),radial-gradient(circle at 50% 100%,var(--io-faint) 0 46%,transparent 48%);border:1px solid var(--io-line2);flex:none}
.io-field{display:grid;grid-template-columns:minmax(0,auto) 1fr;align-items:center;gap:max(5px,.6cqi)}
.io-field-k{font:500 clamp(7.5px,.92cqi,10px)/1.25 var(--io-sans);color:var(--io-soft);white-space:nowrap}
.io-tall .io-field-k{font-size:clamp(8.5px,2.5cqi,10.5px)}
.io-pill{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:max(4px,.55cqi) max(9px,1.1cqi);border:1px solid var(--io-line2);border-radius:999px;background:var(--io-card);color:var(--io-soft);font:500 clamp(9px,1.1cqi,11.5px)/1.25 var(--io-sans);text-align:center}
.io-tall .io-pill{font-size:clamp(9px,2.7cqi,11.5px);border-radius:12px}
.io-pill svg{flex:none;color:var(--io-gold)}
.io-cap{font:600 clamp(8px,1cqi,10px)/1.35 var(--io-mono);letter-spacing:.18em;text-transform:uppercase;color:var(--io-muted);text-align:center}
.io-root[dir=rtl] .io-cap{font-family:var(--io-sans);letter-spacing:0;font-size:clamp(9.5px,1.1cqi,12px)}
.io-tall .io-cap{font-size:clamp(8.5px,2.5cqi,10.5px)}
.io-pack{pointer-events:none}
.io-sheet{position:absolute;inset:0;display:flex;flex-direction:column;gap:max(3px,.45cqi);padding:max(9px,1.2cqi);background:var(--io-raise);border:1px solid var(--io-line2);box-shadow:0 12px 26px -18px rgba(0,0,0,.6)}
.io-sheet-2{transform:translate(7%,-6%)}.io-sheet-3{transform:translate(14%,-12%)}
.io-root[dir=rtl] .io-sheet-2{transform:translate(-7%,-6%)}.io-root[dir=rtl] .io-sheet-3{transform:translate(-14%,-12%)}
.io-sheet-2,.io-sheet-3{opacity:.7}
.io-sheet-1{animation:io-print .7s cubic-bezier(.2,.8,.2,1) both}
.io-sheet-k{font:600 clamp(7.5px,.95cqi,10px)/1.25 var(--io-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--io-goldt);margin-bottom:max(3px,.4cqi)}
.io-root[dir=rtl] .io-sheet-k{font-family:var(--io-sans);letter-spacing:0;font-size:clamp(9px,1.1cqi,12px)}
.io-tall .io-sheet-k{font-size:clamp(8.5px,2.5cqi,10.5px)}
.io-wl{transform-origin:left center;animation:io-write .55s cubic-bezier(.3,.7,.3,1) both;animation-delay:calc(var(--i) * .11s + .35s)}
.io-root[dir=rtl] .io-wl{transform-origin:right center}
.io-pipe{display:block}
.io-rail{position:absolute;inset-inline-start:7px;top:10%;bottom:10%;width:1px;background:var(--io-line2)}
.io-row{position:absolute;inset-inline-start:0;inset-inline-end:0;display:flex;align-items:center;gap:max(8px,1cqi);transform:translateY(-50%)}
.io-row-0{top:10%}.io-row-1{top:36.6%}.io-row-2{top:63.3%}.io-row-3{top:90%}
.io-node-dot{position:relative;width:15px;height:15px;flex:none;border-radius:50%;border:1px solid var(--io-line2);background:var(--io-card);display:grid;place-items:center}
.io-row[data-on=true] .io-node-dot{border-color:var(--io-gold)}
.io-row-3 .io-node-dot{border-style:dashed}
.io-check{color:var(--io-gold);opacity:0;animation:io-check 7.2s linear infinite}
.io-row-l{display:flex;flex-direction:column;gap:2px;font:500 clamp(9px,1.12cqi,12px)/1.25 var(--io-sans);color:var(--io-soft)}
.io-conf{font:600 clamp(7.5px,.85cqi,9.5px)/1 var(--io-mono);font-style:normal;letter-spacing:.12em;text-transform:uppercase;color:var(--io-ok);opacity:0;animation:io-conf 7.2s linear infinite}
.io-root[dir=rtl] .io-conf{font-family:var(--io-sans);letter-spacing:0;font-size:clamp(9px,1cqi,11px)}
.io-token{position:absolute;inset-inline-start:3px;top:10%;width:9px;height:9px;margin-top:-4.5px;background:var(--io-gold);box-shadow:0 0 0 3px color-mix(in srgb,var(--io-gold) 25%,transparent);animation:io-pipe 7.2s cubic-bezier(.65,0,.35,1) infinite;z-index:1}
.io-pipe-x .io-rail{top:7px;bottom:auto;inset-inline-start:12.5%;inset-inline-end:12.5%;width:auto;height:1px}
.io-pipe-x .io-row{top:0;transform:translateX(-50%);flex-direction:column;align-items:center;gap:6px;width:25%;text-align:center}
.io-root[dir=rtl] .io-pipe-x .io-row{transform:translateX(50%)}
.io-pipe-x .io-row-0{inset-inline-start:12.5%}.io-pipe-x .io-row-1{inset-inline-start:37.5%}.io-pipe-x .io-row-2{inset-inline-start:62.5%}.io-pipe-x .io-row-3{inset-inline-start:87.5%}
.io-pipe-x .io-row{inset-inline-end:auto}
.io-pipe-x .io-row-l{align-items:center;font-size:clamp(9px,2.8cqi,11.5px)}
.io-pipe-x .io-conf{font-size:clamp(7.5px,2.2cqi,9px)}
.io-pipe-x .io-token{top:7px;inset-inline-start:12.5%;margin-inline-start:-4.5px;animation-name:io-pipe-x}
.io-stages{display:grid;gap:14px;min-width:0}
.io-tabs{display:flex;flex-wrap:wrap;gap:6px}
.io-tab{display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 12px;border-radius:999px;border:1px solid var(--io-line2);background:transparent;color:var(--io-muted);font:500 11.5px/1 var(--io-sans);cursor:pointer;transition:color .25s,border-color .25s,background-color .25s}
.io-tab:hover{color:var(--io-ink);border-color:var(--io-gold)}
.io-tab[aria-selected=true]{color:var(--io-ink);border-color:var(--io-gold);background:color-mix(in srgb,var(--io-gold) 12%,transparent)}
.io-tab-n{font:500 9.5px/1 var(--io-mono);color:var(--io-goldt)}
.io-panel{display:grid;gap:6px;min-height:118px;align-content:start}
.io-panel-t{font:600 12px/1.3 var(--io-sans);letter-spacing:.08em;text-transform:uppercase;color:var(--io-goldt)}
.io-root[dir=rtl] .io-panel-t{letter-spacing:0;font-size:13px}
.io-progress{display:block;height:1px;background:var(--io-line);margin-top:6px;overflow:hidden}
.io-progress span{display:block;height:100%;width:100%;background:var(--io-gold);transform:scaleX(0);transform-origin:left}
.io-root[dir=rtl] .io-progress span{transform-origin:right}
.io-progress-run{animation:io-bar 3.8s linear both}
.io-orbitbox{max-width:560px;margin:0 auto}
.io-cnode{display:grid;gap:3px;justify-items:start;padding:9px 11px;border:1px solid var(--io-line2);background:var(--io-card);color:var(--io-ink);text-align:start;cursor:pointer;transition:border-color .25s,background-color .25s,box-shadow .25s;font:inherit}
.io-cnode.io-abs{max-width:44%}
.io-cnode:hover{border-color:var(--io-gold)}
.io-cnode[aria-pressed=true]{border-color:var(--io-gold);background:var(--io-raise);box-shadow:0 0 0 4px color-mix(in srgb,var(--io-gold) 12%,transparent)}
.io-cnode-i{display:inline-grid;place-items:center;width:22px;height:22px;border:1px solid var(--io-line2);color:var(--io-gold)}
.io-cnode-t{font:600 12px/1.25 var(--io-sans)}
.io-cnode-s{display:inline-flex;align-items:center;gap:6px;font:500 9.5px/1.3 var(--io-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--io-muted)}
.io-root[dir=rtl] .io-cnode-s{font-family:var(--io-sans);letter-spacing:0;font-size:11px}
.io-cnode-off{opacity:.62}
.io-cnode-off .io-cnode-i{color:var(--io-faint)}
.io-sdot{width:6px;height:6px;border-radius:50%;flex:none;background:var(--io-faint)}
.io-sdot[data-s=profile]{background:var(--io-ink)}
.io-sdot[data-s=email]{background:var(--io-gold)}
.io-sdot[data-s=sources],.io-sdot[data-s=portals]{background:transparent;border:1px solid var(--io-muted)}
.io-sdot[data-s=tracker]{background:var(--io-blue)}
.io-clist{display:grid;gap:12px}
.io-chub{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--io-gold);background:var(--io-raise);width:max-content;max-width:100%}
.io-chub span{display:grid;gap:2px;font-size:12px;color:var(--io-muted)}
.io-chub b{font:600 10px/1 var(--io-mono);letter-spacing:.2em;text-transform:uppercase;color:var(--io-ink)}
.io-clist-items{display:grid;gap:8px;padding-inline-start:18px;border-inline-start:1px dashed var(--io-line2);margin-inline-start:16px}
.io-clist-items .io-cnode{position:relative}
.io-clist-items .io-cnode::before{content:"";position:absolute;inset-inline-start:-19px;top:50%;width:18px;height:1px;background:var(--io-line2)}
.io-detail{display:grid;gap:8px;margin:6px 18px 0;padding:14px 0 4px;border-top:1px solid var(--io-line);min-height:150px;align-content:start}
.io-detail-t{display:flex;align-items:center;flex-wrap:wrap;gap:10px;font:400 18px/1.3 var(--io-serif);color:var(--io-ink)}
.io-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 9px;border:1px solid var(--io-line2);border-radius:999px;font:500 9.5px/1 var(--io-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--io-soft)}
.io-root[dir=rtl] .io-chip{font-family:var(--io-sans);letter-spacing:0;font-size:11px}
.io-acts{display:flex;flex-wrap:wrap;align-items:center;gap:12px 18px;margin-top:4px}
.io-hand{list-style:none;display:flex;flex-wrap:wrap;gap:6px 14px}
.io-hand li{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:var(--io-soft)}
.io-hand-n{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:50%;border:1px solid var(--io-gold);color:var(--io-gold);font:600 10px/1 var(--io-mono)}
.io-hand li[data-done=false]{color:var(--io-faint)}
.io-hand li[data-done=false] .io-hand-n{border-color:var(--io-faint);color:var(--io-faint)}
.io-badge{margin-bottom:10px}
.io-readout{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 16px;padding:10px 12px;border:1px solid var(--io-line);background:var(--io-raise);margin-bottom:10px;min-height:44px}
.io-readout span{display:inline-flex;align-items:baseline;gap:6px;font-size:11.5px;color:var(--io-muted)}
.io-readout b{font:600 16px/1 var(--io-sans);color:var(--io-ink)}
.io-readout-w{font:600 10px/1 var(--io-mono)!important;letter-spacing:.12em;text-transform:uppercase;color:var(--io-goldt)!important;margin-inline-end:4px}
.io-root[dir=rtl] .io-readout-w{font-family:var(--io-sans)!important;letter-spacing:0;font-size:12px!important}
.io-key{display:inline-block;flex:none;align-self:center}
.io-key-sub,.io-key-pre{width:14px;height:2px;border-radius:2px}
.io-key-sub{background:var(--io-goldm)}.io-key-pre{background:var(--io-blue)}
.io-key-res{width:7px;height:7px;border-radius:50%;border:1.5px solid var(--io-soft)}
.io-key-int{width:7px;height:7px;background:var(--io-goldm);transform:rotate(45deg)}
.io-chart{position:relative;touch-action:pan-y}
.io-grid{stroke:var(--io-line);stroke-width:1}
.io-axis{font:500 9.5px var(--io-mono);fill:var(--io-faint)}
.io-axis-on{fill:var(--io-ink)}
.io-line{fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.6s cubic-bezier(.4,.1,.2,1)}
.io-drawn .io-line{stroke-dashoffset:0}
.io-line-sub{stroke:var(--io-goldm)}.io-line-pre{stroke:var(--io-blue);transition-delay:.15s}
.io-mk{stroke:var(--io-card);stroke-width:2}
.io-mk-sub{fill:var(--io-goldm)}.io-mk-pre{fill:var(--io-blue)}
.io-cross{stroke:var(--io-ink);stroke-opacity:.28;stroke-width:1}
.io-ev-res{fill:none;stroke:var(--io-soft);stroke-width:1.3}
.io-ev-int{fill:var(--io-goldm)}
.io-endl{font:500 10.5px var(--io-sans);fill:var(--io-muted)}
.io-endv{font-weight:700;fill:var(--io-ink)}
.io-slider{position:absolute;cursor:crosshair;border-radius:2px}
.io-slider:focus-visible{outline-offset:4px}
.io-legend{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;margin-top:10px;font-size:11.5px;color:var(--io-muted)}
.io-legend>span{display:inline-flex;align-items:center;gap:7px}
.io-link{display:inline-flex;align-items:center;gap:6px;margin-inline-start:auto;padding:4px 0;border:0;border-bottom:1px solid var(--io-line2);background:none;color:var(--io-ink);font:500 11.5px/1.2 var(--io-sans);cursor:pointer}
.io-link:hover{border-color:var(--io-gold)}
.io-legend+.io-hint{margin-top:8px}
.io-defs{display:grid;gap:12px 22px;margin:16px 0 0;padding-top:14px;border-top:1px solid var(--io-line)}
.io-fig:has(.io-defs){container-type:inline-size}
@container (min-width:460px){.io-defs{grid-template-columns:1fr 1fr}}
.io-defs dt{display:flex;align-items:center;gap:8px;font:600 11.5px/1.3 var(--io-sans);color:var(--io-ink)}
.io-defs dd{margin:4px 0 0;font-size:12px;line-height:1.6;color:var(--io-muted)}
.io-tablewrap{margin-top:12px;overflow-x:auto}
.io-table{width:100%;border-collapse:collapse;font-size:12px;color:var(--io-soft)}
.io-table caption{caption-side:top;text-align:start;padding-bottom:8px;font-size:11px;color:var(--io-faint)}
.io-table th,.io-table td{padding:7px 8px;border-bottom:1px solid var(--io-line);text-align:end;font-variant-numeric:tabular-nums}
.io-table th:first-child{text-align:start}
.io-table thead th{font:600 10px/1.3 var(--io-sans);letter-spacing:.06em;text-transform:uppercase;color:var(--io-muted)}
@keyframes io-dash{to{stroke-dashoffset:-14}}
@keyframes io-spin{to{transform:rotate(360deg)}}
@keyframes io-print{from{opacity:0;transform:translate(12%,-10%) rotate(5deg)}to{opacity:1;transform:none}}
@keyframes io-write{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes io-bar{to{transform:scaleX(1)}}
@keyframes io-pipe{0%{top:10%;opacity:0}5%{top:10%;opacity:1}22%{top:10%}32%{top:36.6%}58%{top:36.6%}68%{top:63.3%}82%{top:63.3%;opacity:1}94%{top:90%;opacity:.25}100%{top:90%;opacity:0}}
@keyframes io-pipe-x{0%{inset-inline-start:12.5%;opacity:0}5%{inset-inline-start:12.5%;opacity:1}22%{inset-inline-start:12.5%}32%{inset-inline-start:37.5%}58%{inset-inline-start:37.5%}68%{inset-inline-start:62.5%}82%{inset-inline-start:62.5%;opacity:1}94%{inset-inline-start:87.5%;opacity:.25}100%{inset-inline-start:87.5%;opacity:0}}
@keyframes io-check{0%,66%{opacity:0;transform:scale(.4)}70%{opacity:1;transform:scale(1.15)}74%,96%{opacity:1;transform:none}100%{opacity:0}}
@keyframes io-conf{0%,70%{opacity:0}75%,96%{opacity:1}100%{opacity:0}}
.io-root[data-motion=off] *,.io-root[data-motion=off] *::before,.io-root[data-motion=off] *::after{animation-play-state:paused!important}
@media (prefers-reduced-motion:reduce){
  .io-root *{animation:none!important;transition:none!important}
  .io-line{stroke-dashoffset:0}
  .io-check,.io-conf{opacity:1}
  .io-token{display:none}
}
`;
