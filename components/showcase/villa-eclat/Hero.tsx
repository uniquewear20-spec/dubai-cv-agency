"use client";

// The opening, built the way Son Daven builds theirs. A sticky stage four screens tall holds a
// canvas, and the scroll position picks the frame: the drone shot is drawn frame by frame from
// sheets of stills (never a seeking video), with neighbouring frames blended so the camera glides
// rather than steps, and it runs just as smoothly backwards. The crest and the two figures fly up
// and dissolve into fine reeding as the camera starts to climb; the line, the facts and the round
// call to action hold along the bottom while it circles the house. At the end an arch opens at the
// foot of the villa and the camera passes through it to the bronze door, framed exactly as the
// film below opens, so the hand-over has no cut, no gap and no black.

import { useEffect, useRef, type CSSProperties } from "react";
import { HERO, IMG, type Seq } from "@/lib/showcase/villa-eclat";
import { sized } from "@/lib/showcase/media";

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

export function Hero() {
  const sec = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const veil = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sec.current, canvas = cv.current;
    if (!el || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = matchMedia("(max-width: 760px)").matches;
    const seq: Seq = phone ? HERO.seq.phone : HERO.seq.desk;
    const per = seq.cols * seq.rows;
    const head = document.querySelector<HTMLElement>(".ve-top");
    let gone = false, dirty = true, live = false, raf = 0, last = performance.now();
    let top = 0, span = 1, p = -1, ps = 0, shown = false;

    // ── Frames: the first sheet, then the last, then the gaps, two at a time, so the whole climb
    // can be scrubbed early and the nearest loaded frame always stands in for a missing one.
    const sheets: (HTMLImageElement | null)[] = seq.sheets.map(() => null);
    const order = [0, seq.sheets.length - 1];
    for (let step = seq.sheets.length; order.length < seq.sheets.length; step = Math.ceil(step / 2))
      for (let i = 0; i < seq.sheets.length; i += Math.max(1, step)) if (!order.includes(i)) order.push(i);
    const decoded = (im: HTMLImageElement) => (im.decode ? im.decode().catch(() => {}) : Promise.resolve());
    const fetchSheet = (i: number) =>
      new Promise<void>((done) => {
        const im = new Image();
        im.decoding = "async";
        im.onload = () => void decoded(im).then(() => { if (!gone) { sheets[i] = im; dirty = true; ready(); } done(); });
        im.onerror = () => done();
        im.src = seq.sheets[i];
      });
    const queue = [...order];
    const pump = () => { const i = queue.shift(); if (i !== undefined && !gone) void fetchSheet(i).then(pump); };
    pump();
    pump();

    // The bronze door, loaded as the film loads it (same address, same CORS mode), so the film
    // takes it from the cache and both draw the very same picture at the hand-over.
    const door = new Image();
    let doorOk = false;
    door.crossOrigin = "anonymous";
    door.decoding = "async";
    door.onload = () => void decoded(door).then(() => { doorOk = true; dirty = true; });
    const doorSrc = sized(IMG.approach, phone ? 1280 : 2048);
    let doorAsked = false;
    const askDoor = () => { if (!doorAsked) { doorAsked = true; door.src = doorSrc; } };

    // The veil lifts once the first sheet is on hand (never sooner than the emblem needs to
    // draw itself, never later than five seconds), and the crest makes its entrance.
    const t0 = performance.now();
    let lifted = false;
    const lift = () => {
      if (lifted || gone) return;
      lifted = true;
      veil.current?.classList.add("is-done");
      el.classList.add("is-in");
    };
    function ready() {
      if (!sheets[0]) return;
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
    const has = (i: number) => !!sheets[Math.floor(i / per)];
    const frame = (i: number, z = 1, fx = 0.5, fy = 0.5) => {
      const im = sheets[Math.floor(i / per)]!, c = i % per;
      cover(im, (c % seq.cols) * seq.fw, Math.floor(c / seq.cols) * seq.fh, seq.fw, seq.fh, z, fx, fy);
    };
    const nearest = (i: number) => {
      for (let d = 0; d < seq.n; d++) for (const j of [i - d, i + d]) if (j >= 0 && j < seq.n && has(j)) return j;
      return -1;
    };
    /** An Art Deco doorway: straight jambs under a semicircular head. */
    const arch = (cx: number, cy: number, w: number, h: number) => {
      const r = w / 2, spring = cy - h / 2 + r, foot = cy + h / 2;
      ctx.beginPath();
      ctx.moveTo(cx - r, foot);
      ctx.lineTo(cx - r, spring);
      ctx.arc(cx, spring, r, Math.PI, 0);
      ctx.lineTo(cx + r, foot);
      ctx.closePath();
    };

    // Shares of the hero's scroll: the drone shot runs to SEQ, then the arch carries the camera
    // through to the door by the end.
    const SEQ = 0.76;
    const render = () => {
      const cw = canvas.width, ch = canvas.height;
      ctx.imageSmoothingQuality = "high"; // reset whenever the canvas is resized
      if (p < SEQ || calm) {
        const f = (calm ? 0 : Math.min(1, p / SEQ)) * (seq.n - 1);
        const k = Math.floor(f), a = f - k, i = nearest(k);
        if (i < 0) return false;
        frame(i);
        if (a > 0.004 && i === k && k + 1 < seq.n && has(k + 1)) {
          ctx.globalAlpha = a;
          frame(k + 1);
          ctx.globalAlpha = 1;
        }
        if (calm && p > SEQ && doorOk) {
          ctx.globalAlpha = Math.min(1, (p - SEQ) / (1 - SEQ));
          cover(door, 0, 0, door.naturalWidth, door.naturalHeight, 1, HERO.focus[0], HERO.focus[1]);
          ctx.globalAlpha = 1;
        }
        return true;
      }
      // The arch: seen from a distance d that closes in, so it grows the way a real doorway
      // does as you walk at it, slowly and then all at once.
      const u = Math.min(1, (p - SEQ) / (1 - SEQ)), k = u * u * (3 - 2 * u);
      const d = 6 + (0.3 - 6) * k;
      const lastI = nearest(seq.n - 1);
      if (lastI < 0) return false;
      // Outside, the last frame keeps coming closer as the camera dives at the house.
      frame(lastI, Math.pow(6 / d, 0.28), HERO.door[0], HERO.door[1]);
      // It opens from a point of light at the foot of the house, then keeps coming.
      const w = ((Math.min(cw, ch * 1.6) * 0.95) / d) * (u < 0.1 ? Math.sin((u / 0.1) * Math.PI * 0.5) : 1), h = w * 1.55;
      const cx = cw / 2, cy = ch * (HERO.door[1] + (0.5 - HERO.door[1]) * k) + h * 0.06;
      ctx.save();
      arch(cx, cy, w, h);
      ctx.clip();
      if (doorOk) cover(door, 0, 0, door.naturalWidth, door.naturalHeight, 1 + 0.16 * (1 - k), HERO.focus[0], HERO.focus[1]);
      else { ctx.fillStyle = "#0e0c0a"; ctx.fillRect(0, 0, cw, ch); }
      ctx.restore();
      // Three gold hairlines around the arch, like the emblem; they thin out as it passes by.
      const rim = 1 - Math.min(1, Math.max(0, (k - 0.55) / 0.35));
      if (rim > 0.01) {
        const unit = Math.max(1, cw / 1400);
        ctx.lineWidth = 1.2 * unit;
        [0, 1, 2].forEach((j) => {
          const g = (5 + j * 6) * unit * (0.7 + w / cw);
          ctx.strokeStyle = `rgba(227, 201, 154, ${(rim * [0.95, 0.55, 0.3][j] * Math.min(1, u * 14)).toFixed(3)})`;
          arch(cx, cy, w + g * 2, h + g * 2);
          ctx.stroke();
        });
      }
      return true;
    };

    const measure = () => {
      top = el.getBoundingClientRect().top + scrollY;
      span = Math.max(1, el.offsetHeight - innerHeight);
      size();
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const target = Math.min(1, Math.max(0, (scrollY - top) / span));
      ps = calm ? target : ps + (target - ps) * (1 - Math.exp(-dt * 8));
      if (Math.abs(target - ps) < 2e-4) ps = target;
      if (!dirty && Math.abs(ps - p) < 1e-5) return;
      p = ps;
      dirty = false;
      if (p > 0.45) askDoor();
      el.style.setProperty("--p", p.toFixed(4));
      // The name in the header appears as the crest leaves.
      head?.style.setProperty("--name", Math.min(1, Math.max(0, (p - 0.06) * 6)).toFixed(3));
      if (render() && !shown) { shown = true; canvas.classList.add("is-live"); }
    };
    const start = () => { if (!live) { live = true; last = performance.now(); dirty = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { if (live) { live = false; cancelAnimationFrame(raf); } };
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
    // Fetch the door early when idle, so a fast scroller never sees the arch empty.
    const idle = setTimeout(askDoor, 3500);
    return () => {
      gone = true;
      stop();
      io.disconnect();
      ro.disconnect();
      removeEventListener("resize", measure);
      clearTimeout(fallback);
      clearTimeout(idle);
    };
  }, []);

  return (
    <section ref={sec} className="ve-hero" id="top" style={{ "--p": 0 } as CSSProperties}>
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
        <div className="ve-hero-veil-in" ref={veil} aria-hidden>
          <Emblem className="ve-hero-veil-em" draw id="ve-em-veil" />
          <i />
        </div>
      </div>
    </section>
  );
}
