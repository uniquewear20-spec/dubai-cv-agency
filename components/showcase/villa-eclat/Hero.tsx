"use client";

// The opening, built like Son Daven's: a drone shot tied to scroll (the camera climbs from the
// pool's edge to high above the villa). The name is huge across the top with two figures beside
// it; as you scroll they fly up and fade, while the line, the facts and the round call to action
// stay put along the bottom until the camera has finished climbing. The clip is a short-GOP MP4 so
// every seek lands at once; the wordmark is drawn in Art Deco triple lines.

import { useEffect, useRef, type CSSProperties } from "react";
import { HERO, IMG } from "@/lib/showcase/villa-eclat";
import { Img } from "@/components/showcase/kit/Img";

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
        <g fill="none" stroke="rgba(10, 8, 6, 0.45)" strokeWidth={8} strokeLinecap="round" className={`ve-mark-halo ${draw ? "ve-draw" : ""}`}>
          {MARK.map((d, i) => (
            <path key={i} d={d} pathLength={1} style={{ "--i": i } as CSSProperties} />
          ))}
        </g>
      )}
      <g fill="none" stroke="currentColor" strokeWidth={hair ? 1.15 : 2.6} strokeLinecap="square" className={`ve-mark-line ${draw ? "ve-draw" : ""}`}>
        {MARK.map((d, i) => (
          <path key={i} d={d} pathLength={1} vectorEffect={hair ? "non-scaling-stroke" : undefined} style={{ "--i": i } as CSSProperties} />
        ))}
      </g>
    </svg>
  );
}

export function Hero() {
  const sec = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = sec.current;
    if (!el) return;
    let top = 0, vh = innerHeight, p = -1, ps = 0, raf = 0, last = performance.now(), live = false;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const measure = () => {
      top = el.getBoundingClientRect().top + scrollY;
      vh = innerHeight;
    };

    // The drone clip (1080p, or a 960 px copy on phones): the newest wanted moment wins, and a seek
    // starts only when the last one is done.
    const v = vid.current;
    if (v && !v.src) v.src = matchMedia("(max-width: 760px)").matches ? HERO.videoSmall : HERO.video;
    let want = 0;
    const chase = () => {
      if (!v || v.readyState < 1 || v.seeking || !v.duration) return;
      const t = want * (v.duration - 0.05);
      if (Math.abs(v.currentTime - t) > 0.01) v.currentTime = t;
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
      ps = calm ? target : ps + (target - ps) * (1 - Math.exp(-dt * 9));
      if (Math.abs(target - ps) < 1e-4) ps = target;
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
          <video ref={vid} className="ve-hero-video" poster={IMG.day ? IMG.day.replace(/\.png$/, "_min.webp") : undefined} muted playsInline preload="auto" aria-hidden />
        ) : (
          <div className="ve-hero-still" aria-hidden>
            <Img src={IMG.day} alt="" sizes="100vw" widths={[960, 1440, 1600]} eager />
          </div>
        )}
        <div className="ve-hero-shade" aria-hidden />
        <div className="ve-hero-top">
          <div className="ve-hero-title">
            <p className="ve-hero-label">Private residence</p>
            <h1 className="ve-hero-h1">
              <span className="ve-sr">Villa Éclat, a private beachfront residence on the Dubai coast</span>
              <Wordmark className="ve-hero-word" draw />
            </h1>
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
          <p className="ve-hero-big">A beachfront villa on the Dubai coast</p>
          <dl className="ve-hero-info">
            <div><dt>Built area</dt><dd>2,150 m²</dd></div>
            <div><dt>Plot</dt><dd>3,400 m²</dd></div>
            <div><dt>Viewings</dt><dd>By appointment</dd></div>
          </dl>
          <a className="ve-ring" href="#viewing"><span>Book a private viewing</span></a>
        </div>
        <p className="ve-hero-cue" aria-hidden><span>Scroll</span><i /></p>
        <div className="ve-hero-veil" aria-hidden />
      </div>
    </section>
  );
}
