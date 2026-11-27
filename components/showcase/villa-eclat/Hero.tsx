"use client";

// The opening, built like Son Daven's: a drone shot tied to scroll (the camera climbs and circles
// over the pool toward the villa). The name sits top left with two figures beside it; as you
// scroll they fly up and fade, while the line, the facts and the round call to action stay along
// the bottom until the camera has finished climbing. The clip is fetched whole and played from
// memory, so scrubbing never waits on the network.
// The mark: "éclat" is a burst of light, so the emblem is a sun rising inside a triple Art Deco
// arch, and the name is set in Poiret One (a 1920s face) filled with metallic gold.

import { useEffect, useRef, type CSSProperties } from "react";
import { HERO, IMG } from "@/lib/showcase/villa-eclat";
import { Img } from "@/components/showcase/kit/Img";
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

    // The drone clip (1080p, or a 960 px copy on phones), fetched whole and played from memory.
    // The newest wanted moment wins, and a seek starts only when the last one is done.
    const v = vid.current;
    let want = 0, blob = "", gone = false;
    const chase = () => {
      if (!v || v.readyState < 1 || v.seeking || !v.duration) return;
      const t = want * (v.duration - 0.05);
      if (Math.abs(v.currentTime - t) > 0.01) v.currentTime = t;
    };
    if (v) {
      v.addEventListener("seeked", chase);
      v.addEventListener("loadedmetadata", chase);
      const src = matchMedia("(max-width: 760px)").matches ? HERO.videoSmall : HERO.video;
      const start = (s: string) => {
        v.src = s;
        // Playing for an instant makes iPhones decode frames for a paused video.
        v.play().then(() => v.pause()).catch(() => {});
      };
      fetch(src, { mode: "cors" })
        .then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
        .then((b) => {
          if (gone) return;
          blob = URL.createObjectURL(b);
          start(blob);
        })
        .catch(() => { if (!gone) start(src); });
    }

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
      gone = true;
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("resize", measure);
      v?.removeEventListener("seeked", chase);
      v?.removeEventListener("loadedmetadata", chase);
      if (blob) URL.revokeObjectURL(blob);
    };
  }, []);

  return (
    <section ref={sec} className="ve-hero" id="top" style={{ "--p": 0 } as CSSProperties}>
      <div className="ve-hero-stage">
        {HERO.video ? (
          <video ref={vid} className="ve-hero-video" poster={IMG.day ? sized(IMG.day, 2400) : undefined} muted playsInline preload="auto" aria-hidden />
        ) : (
          <div className="ve-hero-still" aria-hidden>
            <Img src={IMG.day} alt="" sizes="100vw" widths={[960, 1440, 1600]} eager />
          </div>
        )}
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
        <div className="ve-hero-veil" aria-hidden />
      </div>
    </section>
  );
}
