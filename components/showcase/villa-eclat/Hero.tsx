"use client";

// The opening: a drone shot of the villa tied to scroll, as numbered frames drawn on a canvas
// (the camera climbs from the lawn to above the pool while the wordmark shrinks away). Until the
// frames exist, the still eases forward instead. The wordmark is drawn in Art Deco triple lines.

import { useEffect, useRef, type CSSProperties } from "react";
import { HERO, IMG } from "@/lib/showcase/villa-eclat";
import { Img } from "@/components/showcase/kit/Img";
import { sized } from "@/lib/showcase/media";

/** ÉCLAT in thin gold lines, each letter with one triple-line flourish, like a 1920s marquee. */
const MARK = [
  "M0 20V120", "M0 20H56", "M0 64H44", "M0 70H40", "M0 76H36", "M0 120H56", "M24 13L34 3", "M30 13L40 3", "M36 13L46 3",
  "M184.3 37.9A50 50 0 1 0 184.3 102.1", "M113.8 43A42 42 0 0 0 113.8 97", "M116.6 53A34 34 0 0 0 116.6 87",
  "M224 20V120", "M224 120H278", "M232 113H272", "M240 106H266",
  "M300 120L340 20L380 120", "M317.6 76H362.4", "M355 40L387 120", "M370 60L394 120",
  "M418 20H488", "M424 27H482", "M430 34H476", "M453 20V120",
];

export function Wordmark({ className, draw, hair }: { className?: string; draw?: boolean; hair?: boolean }) {
  return (
    <svg className={className} viewBox="-6 -4 504 130" aria-hidden focusable="false">
      {!hair && (
        // A soft dark line under each gold line keeps the mark legible over white plaster and sky.
        <g fill="none" stroke="rgba(10, 8, 6, 0.42)" strokeWidth={7} strokeLinecap="round" className={`ve-mark-halo ${draw ? "ve-draw" : ""}`}>
          {MARK.map((d, i) => (
            <path key={i} d={d} pathLength={1} style={{ "--i": i } as CSSProperties} />
          ))}
        </g>
      )}
      <g fill="none" stroke="currentColor" strokeWidth={hair ? 1.15 : 2.1} strokeLinecap="square" className={`ve-mark-line ${draw ? "ve-draw" : ""}`}>
        {MARK.map((d, i) => (
          <path key={i} d={d} pathLength={1} vectorEffect={hair ? "non-scaling-stroke" : undefined} style={{ "--i": i } as CSSProperties} />
        ))}
      </g>
    </svg>
  );
}

export function Hero() {
  const sec = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const vid = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = sec.current;
    if (!el) return;
    const n = HERO.frames;
    const canvas = cv.current;
    const ctx = n && canvas ? canvas.getContext("2d") : null;
    const frames: (HTMLImageElement | null)[] = new Array(n).fill(null);
    let top = 0, vh = innerHeight, p = -1, ps = 0, raf = 0, last = performance.now(), drawn = -1, live = false;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      top = el.getBoundingClientRect().top + scrollY;
      vh = innerHeight;
      if (canvas && ctx) {
        const dpr = Math.min(devicePixelRatio || 1, 1.75);
        canvas.width = Math.round(innerWidth * dpr);
        canvas.height = Math.round(vh * dpr);
        drawn = -1;
      }
    };
    const draw = (f: number) => {
      if (!ctx || !canvas) return;
      let k = -1;
      for (let d = 0; d < n; d++) {
        if (frames[f - d]) { k = f - d; break; }
        if (frames[f + d]) { k = f + d; break; }
      }
      if (k < 0 || k === drawn) return;
      drawn = k;
      const img = frames[k]!;
      const cw = canvas.width, ch = canvas.height, iw = img.naturalWidth, ih = img.naturalHeight;
      const s = Math.max(cw / iw, ch / ih);
      const w = iw * s, h = ih * s;
      const x = Math.min(0, Math.max(cw - w, cw / 2 - w * HERO.focus[0]));
      const y = Math.min(0, Math.max(ch - h, ch / 2 - h * HERO.focus[1]));
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, x, y, w, h);
    };
    if (n) {
      // Coarse frames first, so scrubbing works while the rest arrive.
      const order: number[] = [];
      for (const step of [12, 6, 3, 1]) for (let i = 0; i < n; i += step) if (!order.includes(i)) order.push(i);
      if (!order.includes(n - 1)) order.splice(1, 0, n - 1);
      let at = 0;
      const next = () => {
        if (at >= order.length) return;
        const i = order[at++];
        const img = new Image();
        img.decoding = "async";
        img.onload = img.onerror = () => {
          if (img.naturalWidth) frames[i] = img;
          drawn = -1;
          next();
        };
        img.src = HERO.path(i);
      };
      for (let j = 0; j < 4; j++) next();
    }

    // The drone clip: the newest wanted moment wins; a seek starts only when the last one is done.
    const v = vid.current;
    let want = 0;
    const chase = () => {
      if (!v || v.readyState < 1 || v.seeking || !v.duration) return;
      const t = want * (v.duration - 0.05);
      if (Math.abs(v.currentTime - t) > 0.02) v.currentTime = t;
    };
    v?.addEventListener("seeked", chase);
    v?.addEventListener("loadedmetadata", chase);
    // iOS paints a paused video's new frames only after it has played once.
    const wake = () => { v?.play().then(() => v.pause()).catch(() => {}); };
    addEventListener("touchstart", wake, { once: true, passive: true });

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const target = Math.min(1, Math.max(0, (scrollY - top) / (el.offsetHeight - vh)));
      ps = calm ? target : ps + (target - ps) * (1 - Math.exp(-dt * 8));
      if (Math.abs(target - ps) < 1e-4) ps = target;
      if (n) draw(Math.round(ps * (n - 1)));
      if (v) { want = Math.min(1, ps / 0.9); chase(); }
      if (Math.abs(ps - p) < 1e-4) return;
      p = ps;
      el.style.setProperty("--p", p.toFixed(4));
    };
    measure();
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !live) { live = true; last = performance.now(); raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting && live) { live = false; cancelAnimationFrame(raf); }
    });
    io.observe(el);
    addEventListener("resize", measure);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("resize", measure);
      removeEventListener("touchstart", wake);
      v?.removeEventListener("seeked", chase);
      v?.removeEventListener("loadedmetadata", chase);
    };
  }, []);

  return (
    <section ref={sec} className="ve-hero" id="top" style={{ "--p": 0 } as CSSProperties}>
      <div className="ve-hero-stage">
        {HERO.video ? (
          <video ref={vid} className="ve-hero-video" src={HERO.video} poster={IMG.day ? sized(IMG.day, 1600) : undefined} muted playsInline preload="auto" aria-hidden />
        ) : HERO.frames ? (
          <canvas ref={cv} className="ve-hero-canvas" aria-hidden />
        ) : (
          <div className="ve-hero-still" aria-hidden>
            <Img src={IMG.day} alt="" sizes="100vw" widths={[960, 1440, 1600]} eager />
          </div>
        )}
        <div className="ve-hero-shade" aria-hidden />
        <div className="ve-hero-mark">
          <p className="ve-hero-villa">Villa</p>
          <h1 className="ve-hero-h1">
            <span className="ve-sr">Villa Éclat, a private beachfront residence on the Dubai coast</span>
            <Wordmark className="ve-hero-word" draw />
          </h1>
          <p className="ve-hero-kicker">A private residence on the Dubai coast</p>
        </div>
        <div className="ve-hero-foot">
          <p className="ve-hero-line">Six suites, eighty metres of sand, and a house drawn in curves.</p>
          <dl className="ve-hero-facts">
            <div><dt>Beach frontage</dt><dd>80 m</dd></div>
            <div><dt>Built area</dt><dd>2,150 m²</dd></div>
            <div><dt>Suites</dt><dd>6</dd></div>
          </dl>
          <a className="ve-arch ve-hero-cta" href="#viewing"><span>Book a private viewing</span></a>
        </div>
        <p className="ve-hero-cue" aria-hidden><span>Scroll to fly in</span><i /></p>
        <div className="ve-hero-veil" aria-hidden />
      </div>
    </section>
  );
}
