"use client";

// The opening, built the way Son Daven builds theirs and carried on through the house without a
// cut. A sticky stage holds one canvas and the scroll position picks the frame: the drone circles
// the villa; the camera dives through the colonnade to the bronze door, goes through it, looks up
// in the hall, passes under the stair into the salon, through the bronze arch to the dining room
// and on through its far arch into the kitchen, where the film below takes over on the same frame.
// Every move is a real camera move (the Kling clips) drawn frame by frame from sheets of stills,
// two neighbouring frames blended, so it glides forwards and backwards alike. Where two clips meet
// they share a frame; where they do not, the camera pushes on through an opening under a zoom blur.
// When the scroll comes to rest the camera settles on a whole frame, so nothing is left ghosted.
// Only the sheets near the camera are kept in memory; the rest load ahead of it in turn.

import { useEffect, useRef, type CSSProperties } from "react";
import { CLIPS, HERO, IMG, OPENING, type ClipKey, type Seq } from "@/lib/showcase/villa-eclat";
import { sized } from "@/lib/showcase/media";
import { CHAPTERS, DRONE_LEN, HERO_LEN, SCENE_AT, TOTAL, UNIT, WALK_CAPS, chapterAt, placeHero, timecode } from "./timeline";

const RAYS = [
  "M72.6 62.6L91.9 57.5", "M71.3 59.5L88.6 49.5", "M69.2 56.8L83.3 42.7", "M66.5 54.7L76.5 37.4", "M63.4 53.4L68.5 34.1", "M60 53L60 33",
  "M56.6 53.4L51.5 34.1", "M53.5 54.7L43.5 37.4", "M50.8 56.8L36.7 42.7", "M48.7 59.5L31.4 49.5", "M47.4 62.6L28.1 57.5",
];

/** The emblem: a sun rising inside a triple arch, in gold hairlines. */
export function Emblem({ className, draw, id = "ve-em" }: { className?: string; draw?: boolean; id?: string }) {
  const paths = [
    "M4 66H116", "M10 66A50 50 0 0 1 110 66", "M16 66A44 44 0 0 1 104 66", "M22 66A38 38 0 0 1 98 66", "M50 66A10 10 0 0 1 70 66", ...RAYS,
  ];
  return (
    <svg className={className} viewBox="0 10 120 60" aria-hidden focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e7c1" />
          <stop offset="0.45" stopColor="#c9a46a" />
          <stop offset="0.7" stopColor="#f1ddb0" />
          <stop offset="1" stopColor="#a47c44" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${id})`} strokeWidth="1.2" strokeLinecap="round" className={draw ? "ve-draw" : undefined}>
        {paths.map((d, i) => (
          <path key={i} d={d} pathLength={1} style={{ "--i": i } as CSSProperties} />
        ))}
      </g>
    </svg>
  );
}

/** Emblem and name together, for the header and the footer. */
export function Logo({ className, id }: { className?: string; id: string }) {
  return (
    <span className={`ve-logo ${className ?? ""}`}>
      <Emblem className="ve-logo-em" id={id} />
      <span className="ve-logo-name">Éclat</span>
    </span>
  );
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const sceneAt = (h: number) => {
  let i = 0;
  while (i < OPENING.length - 1 && h >= SCENE_AT[i + 1]) i++;
  return i;
};

type Sheet = { url: string; bytes: number; img: HTMLImageElement | null; busy: boolean; fails: number; t0: number; t1: number };
type Track = { seq: Seq; per: number; warp?: number[]; look?: [number, number][]; sheets: Sheet[] };

export function Hero() {
  const sec = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const caps = useRef<(HTMLParagraphElement | null)[]>([]);
  const hud = useRef<{ ch: HTMLSpanElement | null; tc: HTMLSpanElement | null; bar: HTMLSpanElement | null }>({ ch: null, tc: null, bar: null });

  useEffect(() => {
    const el = sec.current, canvas = cv.current;
    if (!el || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = matchMedia("(max-width: 760px)").matches;
    const head = document.querySelector<HTMLElement>(".ve-top");
    // Decoded frames are kept up to this many bytes; the farthest from the camera go first.
    const budget = (phone ? 190 : 460) * 1048576;
    let gone = false, dirty = true, live = false, raf = 0, last = performance.now();
    let top = 0, span = 1, p = -1, ps = 0, shown = false;

    // ── The tracks: the drone shot and the four walks, as sheets of frames.
    const track = (seq: Seq, warp?: number[], look?: [number, number][]): Track => {
      const per = seq.cols * seq.rows;
      return {
        seq, per, warp, look: phone ? undefined : look, // phone frames are already cropped along the turn
        sheets: seq.sheets.map((url, j) => {
          const rows = Math.ceil(Math.min(per, seq.n - j * per) / seq.cols);
          return { url, bytes: seq.cols * seq.fw * rows * seq.fh * 4, img: null, busy: false, fails: 0, t0: Infinity, t1: -Infinity };
        }),
      };
    };
    const T = { drone: track(phone ? HERO.seq.phone : HERO.seq.desk) } as Record<ClipKey | "drone", Track>;
    for (const k of Object.keys(CLIPS) as ClipKey[]) {
      const c: { desk: Seq; phone: Seq; warp?: number[]; track?: [number, number][] } = CLIPS[k];
      T[k] = track(phone ? c.phone : c.desk, c.warp, c.track);
    }
    /** Where frame i falls along its scene (0 to 1). */
    const posOf = (tk: Track, i: number) => (tk.warp ? tk.warp[i] : i / (tk.seq.n - 1));
    /** The frame (fractional) at share u of a scene. */
    const frameAt = (tk: Track, u: number) => {
      const n = tk.seq.n, w = tk.warp;
      if (!w) return u * (n - 1);
      let lo = 0, hi = n - 1;
      while (hi - lo > 1) {
        const m = (lo + hi) >> 1;
        if (w[m] <= u) lo = m;
        else hi = m;
      }
      return lo + (w[hi] > w[lo] ? clamp((u - w[lo]) / (w[hi] - w[lo])) : 0);
    };
    // When each sheet is on screen, so the loader can fetch them in the order the camera needs them.
    const use = (tk: Track, j: number, a: number, b: number) => {
      const s = tk.sheets[j];
      s.t0 = Math.min(s.t0, a);
      s.t1 = Math.max(s.t1, b);
    };
    OPENING.forEach((sc, i) => {
      const s0 = SCENE_AT[i], L = sc.len;
      if (sc.kind === "drone" || sc.kind === "clip") {
        const tk = sc.kind === "drone" ? T.drone : T[sc.clip], n = tk.seq.n;
        tk.sheets.forEach((_s, j) => {
          const f0 = j * tk.per, f1 = Math.min(n - 1, f0 + tk.per);
          use(tk, j, s0 + posOf(tk, f0) * L, s0 + posOf(tk, f1) * L);
        });
        const prev = OPENING[i - 1];
        if (sc.kind === "clip" && prev?.kind === "clip") use(T[prev.clip], T[prev.clip].sheets.length - 1, s0, s0 + 0.05 * L);
      } else if (sc.kind === "look") use(T[sc.clip], 0, s0, s0 + L);
      else {
        const a = T[sc.from];
        use(a, a.sheets.length - 1, s0, s0 + L);
        use(T[sc.to], 0, s0, s0 + L);
      }
    });
    const sheets = Object.values(T).flatMap((t) => t.sheets).filter((s) => s.t1 >= s.t0);

    // ── Loading: the sheets nearest the camera first (those ahead of it in the direction of travel
    // count as nearer), two at a time, within the memory budget.
    const warm: HTMLImageElement[] = [];
    let inflight = 0, dir = 1, planned = -9, replan = true;
    const first = T.drone.sheets[0];
    const decoded = (im: HTMLImageElement) => (im.decode ? im.decode().catch(() => {}) : Promise.resolve());
    const drop = (s: Sheet) => {
      if (!s.img) return;
      s.img.onload = s.img.onerror = null;
      s.img.src = "";
      s.img = null;
    };
    const fetchSheet = (s: Sheet) => {
      s.busy = true;
      inflight++;
      const im = new Image();
      im.decoding = "async";
      const done = (ok: boolean) => {
        s.busy = false;
        inflight--;
        replan = true;
        if (gone) return;
        if (!ok) { s.fails++; return; }
        s.img = im;
        warm.push(im);
        dirty = true;
        if (s === first) ready();
      };
      im.onload = () => void decoded(im).then(() => done(true));
      im.onerror = () => done(false);
      im.src = s.url;
    };
    const plan = (h: number) => {
      const away = (s: Sheet) =>
        h < s.t0 ? (s.t0 - h) * (dir < 0 ? 2.5 : 1) : h > s.t1 ? (h - s.t1) * (dir > 0 ? 2.5 : 1) : 0;
      const order = [...sheets].sort((a, b) => away(a) - away(b));
      const want = new Set<Sheet>();
      let room = budget;
      for (const s of order) {
        if (s.bytes > room && want.size) break;
        want.add(s);
        room -= s.bytes;
      }
      for (const s of sheets) if (s.img && !want.has(s)) drop(s);
      for (const s of order) {
        if (inflight >= 2) break;
        if (want.has(s) && !s.img && !s.busy && s.fails < 3) fetchSheet(s);
      }
    };

    // The veil lifts once the drone's first frames are on hand (never sooner than the emblem
    // needs to draw itself, never later than five seconds), and the crest makes its entrance.
    const t0 = performance.now();
    let lifted = false;
    const lift = () => {
      if (lifted || gone) return;
      lifted = true;
      veil.current?.classList.add("is-done");
      el.classList.add("is-in");
    };
    function ready() {
      setTimeout(lift, Math.max(0, 900 - (performance.now() - t0)));
    }
    const fallback = setTimeout(lift, 5000);

    // ── Drawing.
    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt(6.2e6 / Math.max(1, r.width * r.height)));
      const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; dirty = true; }
    };
    /** Covers the canvas with a region of a picture, zoomed by z around a point given in its uv. */
    const cover = (im: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, z: number, fx: number, fy: number) => {
      const cw = canvas.width, ch = canvas.height, ca = cw / ch;
      let vw = sw, vh = sh;
      if (sw / sh > ca) vw = sh * ca; else vh = sw / ca;
      vw /= z;
      vh /= z;
      const x = Math.min(sx + sw - vw, Math.max(sx, sx + fx * sw - vw / 2));
      const y = Math.min(sy + sh - vh, Math.max(sy, sy + fy * sh - vh / 2));
      ctx.drawImage(im, x, y, vw, vh, 0, 0, cw, ch);
    };
    const has = (tk: Track, i: number) => !!tk.sheets[Math.floor(i / tk.per)]?.img;
    const frame = (tk: Track, i: number, z: number, fx: number, fy: number) => {
      const q = tk.seq, c = i % tk.per;
      cover(tk.sheets[Math.floor(i / tk.per)].img!, (c % q.cols) * q.fw, Math.floor(c / q.cols) * q.fh, q.fw, q.fh, z, fx, fy);
    };
    const nearest = (tk: Track, i: number) => {
      for (let d = 0; d < tk.seq.n; d++) for (const j of [i - d, i + d]) if (j >= 0 && j < tk.seq.n && has(tk, j)) return j;
      return -1;
    };
    const lookAt = (tk: Track, f: number) => {
      const l = tk.look;
      if (!l) return 0.5;
      for (let k = 1; k < l.length; k++) if (f <= l[k][0]) return lerp(l[k - 1][1], l[k][1], (f - l[k - 1][0]) / (l[k][0] - l[k - 1][0]));
      return l[l.length - 1][1];
    };
    /** Frame position f of a track, blending the two frames either side; false if none is loaded. */
    const shot = (tk: Track, f: number, z = 1, fy = 0.5, alpha = 1, fx?: number) => {
      const n = tk.seq.n;
      f = clamp(f, 0, n - 1);
      const k = Math.floor(f), a = f - k, i = nearest(tk, k);
      if (i < 0) return false;
      const x = fx ?? lookAt(tk, f);
      ctx.globalAlpha = alpha;
      frame(tk, i, z, x, fy);
      if (alpha === 1 && a > 0.004 && i === k && k + 1 < n && has(tk, k + 1)) {
        ctx.globalAlpha = a;
        frame(tk, k + 1, z, x, fy);
      }
      ctx.globalAlpha = 1;
      return true;
    };
    /** One frame smeared outwards from (fx, fy) by `smear` (a share of z): an even average of a few
     *  zooms, laid at `alpha` over what is already drawn. The camera's own motion blur, rushing in. */
    const rush = (tk: Track, i: number, z: number, fx: number, fy: number, smear: number, alpha: number) => {
      const N = smear < 0.004 ? 1 : phone ? 4 : 6;
      for (let j = 0; j < N; j++) {
        ctx.globalAlpha = alpha / N / (1 - ((N - 1 - j) * alpha) / N);
        frame(tk, i, z * (1 + (smear * j) / Math.max(1, N - 1)), fx, fy);
      }
      ctx.globalAlpha = 1;
    };
    const light = (k: number) => {
      if (k < 0.01) return;
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = `rgba(255, 238, 210, ${k.toFixed(3)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
    };
    const edges = (k: number) => {
      if (k < 0.01) return;
      const cw = canvas.width, ch = canvas.height;
      const g = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.3, cw / 2, ch / 2, Math.hypot(cw, ch) / 2);
      g.addColorStop(0, "rgba(14, 12, 10, 0)");
      g.addColorStop(1, `rgba(14, 12, 10, ${(0.5 * k).toFixed(3)})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cw, ch);
    };
    /** With reduced motion each move is two stills, crossfaded halfway. */
    const still = (tk: Track, u: number) => {
      const a = nearest(tk, 0), b = nearest(tk, tk.seq.n - 1);
      if (a < 0) return false;
      frame(tk, a, 1, lookAt(tk, a), 0.5);
      const m = sstep(0.4, 0.6, u);
      if (m > 0 && b >= 0) {
        ctx.globalAlpha = m;
        frame(tk, b, 1, lookAt(tk, b), 0.5);
        ctx.globalAlpha = 1;
      }
      return true;
    };

    const render = (h: number) => {
      ctx.imageSmoothingQuality = "high"; // reset whenever the canvas is resized
      for (const im of warm.splice(0)) ctx.drawImage(im, 0, 0, 2, 2, 0, 0, 1, 1);
      const i = sceneAt(h), sc = OPENING[i], u = clamp((h - SCENE_AT[i]) / sc.len);

      if (sc.kind === "drone") {
        if (calm) return still(T.drone, u);
        // Over its last stretch the drone starts to close in on the colonnade, the dive's mark.
        const next = OPENING[i + 1], aim = next?.kind === "push" ? next.at[phone ? "phone" : "desk"] : ([0.5, 0.5] as [number, number]);
        const k = sstep(0.62, 1, u);
        return shot(T.drone, u * (T.drone.seq.n - 1), 1 + 0.07 * k * k, lerp(0.5, aim[1], k), 1, lerp(0.5, aim[0], k));
      }

      if (sc.kind === "look") {
        // In the hall the camera lifts its eyes to the chandelier and the glass above, then walks on.
        const tk = T[sc.clip], b = calm ? 0 : Math.sin(Math.PI * u) ** 2;
        return shot(tk, 0, 1 + 0.15 * b, 0.5 - 0.32 * b);
      }

      if (sc.kind === "clip") {
        const tk = T[sc.clip];
        if (calm) return still(tk, u);
        const f = frameAt(tk, u), prev = OPENING[i - 1];
        // Where two clips meet they share a frame; a short dissolve hides the last few pixels of difference.
        if (prev?.kind === "clip" && u < 0.05) {
          const P = T[prev.clip], j = nearest(P, P.seq.n - 1);
          if (j >= 0) {
            frame(P, j, 1, lookAt(P, j), 0.5);
            shot(tk, f, 1, 0.5, sstep(0, 0.05, u));
            return true;
          }
        }
        return shot(tk, f);
      }

      // A push: the camera keeps travelling through an opening, rushing out of one picture and into
      // the next, which arrives still blurred and settles into the next move's first frame.
      const A = T[sc.from], B = T[sc.to];
      const ia = nearest(A, A.seq.n - 1), ib = nearest(B, 0);
      if (ia < 0 && ib < 0) return false;
      const aim = sc.at[phone ? "phone" : "desk"];
      if (calm) {
        if (ia >= 0) frame(A, ia, 1, 0.5, 0.5);
        if (ib >= 0) {
          ctx.globalAlpha = ia >= 0 ? sstep(0.3, 0.7, u) : 1;
          frame(B, ib, 1, 0.5, 0.5);
          ctx.globalAlpha = 1;
        }
        return true;
      }
      // The drone has already turned towards its mark; a clip turns from wherever it was looking.
      const z0 = sc.from === "drone" ? 1.07 : 1, turn = sc.from === "drone" ? 1 : sstep(0, 0.35, u);
      const ax = lerp(lookAt(A, A.seq.n - 1), aim[0], turn), ay = lerp(0.5, aim[1], turn);
      const mix = ia < 0 ? 1 : sstep(0.42, 0.68, u);
      if (ia >= 0 && mix < 1) rush(A, ia, z0 * (1 + 2.8 * u * u), ax, ay, 0.17 * sstep(0.04, 0.55, u), 1);
      if (ib >= 0 && mix > 0) {
        const s = 1 - sstep(0.42, 1, u);
        rush(B, ib, 1 + 0.24 * s * s, lerp(lookAt(B, 0), sc.into[0], s), lerp(0.5, sc.into[1], s), 0.15 * (1 - sstep(0.45, 0.9, u)), mix);
      }
      const peak = Math.exp(-(((u - 0.55) / 0.17) ** 2));
      edges(0.9 * peak);
      light(0.3 * peak);
      return true;
    };

    // ── The words over the picture: the crest leaves, the walk's captions and clock come in.
    const capKey = WALK_CAPS.map(() => "");
    let lastCh = "", lastTc = "", lastBar = "";
    const overlay = (h: number) => {
      const g = h - DRONE_LEN;
      const y = clamp((h - 1.85) / 0.4);
      el.style.setProperty("--x", clamp(h / 0.63).toFixed(4));
      el.style.setProperty("--y", y.toFixed(4));
      el.style.setProperty("--foot", y > 0.999 ? "hidden" : "visible"); // its ring is a link: none unseen
      el.style.setProperty("--s", clamp((h - 2.25) / 0.5).toFixed(4));
      el.style.setProperty("--w", sstep(-0.25, 0.15, g).toFixed(3));
      // The name in the header appears as the crest leaves.
      head?.style.setProperty("--name", clamp((h - 0.19) / 0.53).toFixed(3));
      WALK_CAPS.forEach((c, k) => {
        const node = caps.current[k];
        if (!node) return;
        const o = sstep(c.a, c.a + 0.07, g) * (1 - sstep(c.b - 0.07, c.b, g));
        const key = o.toFixed(3);
        if (capKey[k] === key) return;
        capKey[k] = key;
        node.style.opacity = key;
        node.style.transform = `translate3d(0, ${((1 - o) * 14).toFixed(1)}px, 0)`;
        node.style.visibility = o > 0.001 ? "visible" : "hidden";
      });
      const x = hud.current, ch = chapterAt(Math.max(0, g)), tc = timecode(g), bar = (Math.max(0, g) / TOTAL).toFixed(4);
      if (x.ch && ch !== lastCh) x.ch.textContent = lastCh = ch;
      if (x.tc && tc !== lastTc) x.tc.textContent = lastTc = tc;
      if (x.bar && bar !== lastBar) x.bar.style.transform = `scaleX(${(lastBar = bar)})`;
    };

    // ── The clock. Scroll is smoothed; when it comes to rest, the camera settles on a whole frame.
    let off = 0, idle = 0, aimed = -1;
    const restOf = (h: number) => {
      const i = sceneAt(h), sc = OPENING[i];
      if (sc.kind !== "drone" && sc.kind !== "clip") return h;
      const tk = sc.kind === "drone" ? T.drone : T[sc.clip], u = clamp((h - SCENE_AT[i]) / sc.len);
      if (sc.kind === "clip" && OPENING[i - 1]?.kind === "clip" && u < 0.05) return h;
      const f = sc.kind === "drone" ? u * (tk.seq.n - 1) : frameAt(tk, u);
      return SCENE_AT[i] + posOf(tk, Math.round(f)) * sc.len;
    };
    const measure = () => {
      top = el.getBoundingClientRect().top + scrollY;
      span = Math.max(1, el.offsetHeight - innerHeight);
      placeHero(top, span);
      size();
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const target = clamp((scrollY - top) / span);
      if (target !== aimed) {
        if (aimed >= 0) dir = target > aimed ? 1 : -1;
        aimed = target;
        idle = 0;
      } else idle += dt;
      // A jump (the chapters menu) lands at once instead of flying through every room in between.
      if (calm || Math.abs(target - ps) * HERO_LEN > 1.5) ps = target;
      else ps += (target - ps) * (1 - Math.exp(-dt * 8));
      if (Math.abs(target - ps) < 2e-5) ps = target;
      const h = ps * HERO_LEN;
      // At rest the camera eases onto the nearest whole frame; moving again, it eases back on course.
      const goal = !calm && idle > 0.14 && ps === target ? restOf(h) - h : 0, before = off;
      off += (goal - off) * (1 - Math.exp(-dt * 9));
      if (Math.abs(goal - off) < 1e-5) off = goal;
      const shownH = h + off;
      if (replan || Math.abs(h - planned) > 0.05) {
        replan = false;
        planned = h;
        plan(h);
      }
      if (!dirty && !warm.length && Math.abs(shownH - p) < 1e-6 && off === before) return;
      p = shownH;
      dirty = false;
      overlay(p);
      if (render(p) && !shown) { shown = true; canvas.classList.add("is-live"); }
    };
    const start = () => { if (!live) { live = true; last = performance.now(); dirty = true; raf = requestAnimationFrame(tick); } };
    const stop = () => {
      if (!live) return;
      live = false;
      cancelAnimationFrame(raf);
      // Out of sight, the walk's frames give their memory back to the film; the last room stays
      // so that scrolling back up finds it at once.
      for (const s of sheets) if (s.t1 < HERO_LEN - 1.3) drop(s);
    };
    measure();
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) return start();
      stop();
      head?.style.setProperty("--name", "1");
    });
    io.observe(el);
    const ro = new ResizeObserver(() => { measure(); dirty = true; });
    ro.observe(el);
    addEventListener("resize", measure);
    return () => {
      gone = true;
      stop();
      for (const s of sheets) drop(s);
      io.disconnect();
      ro.disconnect();
      removeEventListener("resize", measure);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section ref={sec} className="ve-hero" id="top" style={{ height: `calc(${(HERO_LEN * UNIT * 100).toFixed(1)}svh + 100svh)` }}>
      <div className="ve-hero-stage">
        {/* The drone shot's first frame, sharp, until the canvas has it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="ve-hero-poster"
          src={sized(IMG.day, 1600)}
          srcSet={[1200, 1600, 2400].map((w) => `${sized(IMG.day, w)} ${w}w`).join(", ")}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        <canvas ref={cv} className="ve-hero-canvas" aria-hidden />
        <div className="ve-hero-shade" aria-hidden />
        <div className="ve-film-scrim ve-walk-fade" aria-hidden />
        <div className="ve-hero-top">
          <div className="ve-hero-title">
            <Emblem className="ve-hero-em" draw id="ve-em-hero" />
            <h1 className="ve-hero-h1">
              <span className="ve-hero-villa">Villa</span>
              <span className="ve-hero-name">Éclat</span>
            </h1>
            <p className="ve-hero-label">A private residence on the Dubai coast</p>
          </div>
          <dl className="ve-hero-stats">
            <div>
              <dd>80<small>m</small></dd>
              <dt>of private beach</dt>
            </div>
            <div>
              <dd>6</dd>
              <dt>suites, each with a terrace</dt>
            </div>
          </dl>
        </div>
        <div className="ve-hero-foot">
          <p className="ve-hero-big">A beachfront villa, drawn in curves</p>
          <dl className="ve-hero-info">
            <div><dt>Built area</dt><dd>2,150 m²</dd></div>
            <div><dt>Plot</dt><dd>3,400 m²</dd></div>
            <div><dt>Viewings</dt><dd>By appointment</dd></div>
          </dl>
          <a className="ve-ring" href="#viewing"><span>Book a private viewing</span></a>
        </div>
        <div className="ve-caps">
          {WALK_CAPS.map((c, k) => (
            <p key={k} ref={(n) => { caps.current[k] = n; }} className="ve-cap" style={{ opacity: 0, visibility: "hidden" }}>
              {c.text}
            </p>
          ))}
        </div>
        <div className="ve-hud ve-walk-fade" aria-hidden>
          <span className="ve-hud-ch" ref={(n) => { hud.current.ch = n; }}>{CHAPTERS[0].name}</span>
          <span className="ve-hud-line">
            <span className="ve-hud-bar" ref={(n) => { hud.current.bar = n; }} />
            {CHAPTERS.map((c) => (
              <i key={c.name} style={{ left: `${(c.at / TOTAL) * 100}%` }} />
            ))}
          </span>
          <span className="ve-hud-tc" ref={(n) => { hud.current.tc = n; }}>00:00:00:00</span>
        </div>
        <div className="ve-hero-veil-in" ref={veil} aria-hidden>
          <Emblem className="ve-hero-veil-em" draw id="ve-em-veil" />
          <i />
        </div>
      </div>
    </section>
  );
}
