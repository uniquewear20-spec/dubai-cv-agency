"use client";

// The walk through the house, driven by scroll. The page scrolls a tall section while one sticky
// WebGL canvas plays the "film": each shot frames a still with a moving camera, and shots hand
// over with the showreel's moves (zoom through a door, whip pans, a tilt up into a spinning
// stairwell, a rounded frame growing on ivory, a strip of film with light leaks, day into dusk).
// Captions and the timecode are ordinary text laid over the canvas.

import { useEffect, useRef, useState } from "react";
import { FILM, IMG, type ImgKey, type Shot } from "@/lib/showcase/villa-eclat";
import { Img } from "@/components/showcase/kit/Img";
import { FilmGL, frameView, type Uniforms, type View } from "./gl";

/** Viewport heights of scrolling per unit of film length. */
export const UNIT = 0.95;
const TW: Record<string, number> = { zoom: 0.18, whip: 0.15, whipUp: 0.15, fade: 0.24, white: 0.26, glow: 0.28, cut: 0 };
const STARTS = FILM.reduce<number[]>((a, _s, i) => (a.push(i ? a[i - 1] + FILM[i - 1].len : 0), a), []);
export const FILM_LEN = STARTS[STARTS.length - 1] + FILM[FILM.length - 1].len;
export const CHAPTERS = FILM.flatMap((s, i) => (s.chapter ? [{ name: s.chapter, at: STARTS[i] }] : []));
const CAPS = FILM.flatMap((s, i) => (s.lines ?? []).map((l) => ({ a: STARTS[i] + l.at[0] * s.len, b: STARTS[i] + l.at[1] * s.len, text: l.text })));
const IVORY: [number, number, number] = [0.937, 0.906, 0.855];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => 0.5 - Math.cos(Math.PI * clamp(t)) / 2;
const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const shotAt = (T: number) => {
  let i = 0;
  while (i < FILM.length - 1 && T >= STARTS[i + 1]) i++;
  return i;
};
const clipKey = (s: Shot) => `clip:${s.id}`;
const keysOf = (s: Shot): string[] => (s.clip ? [clipKey(s)] : [s.img, ...(s.img2 ? [s.img2] : []), ...(s.strip ?? [])]);
const srcOf = (k: string) => (k.startsWith("clip:") ? FILM.find((s) => clipKey(s) === k)?.clip?.src ?? "" : IMG[k as ImgKey] ?? "");
const camAt = (s: Shot, t: number) => {
  const e = ease(t), f = s.from, g = s.to;
  return { s: lerp(f.s ?? 1, g.s ?? 1, e), x: lerp(f.x ?? 0, g.x ?? 0, e), y: lerp(f.y ?? 0, g.y ?? 0, e), r: lerp(f.r ?? 0, g.r ?? 0, e) };
};

/** Everything the shader needs for one moment `T` of the film. */
function compose(T: number, sa: number, gl: FilmGL, calm: boolean): Uniforms {
  const i = shotAt(T), sh = FILM[i], t = clamp((T - STARTS[i]) / sh.len);
  const u0: Uniforms = { A: null, B: null, mix: 0, blur: [0, 0, 0, 0], frame: null, gate: null, flare: [0, 0, 0], leak: [0, 0], fade: [0, 0, 0, 0], grain: calm ? 0 : 0.012, seed: Math.floor(T * 60) % 113, vig: 0.38 };
  const view = (key: string, focus: [number, number], c: { s: number; x: number; y: number; r: number }, ds = 1, dx = 0, dy = 0): View =>
    frameView(key, gl.aspect(key), sa, focus, c.s * ds, c.x + dx, c.y + dy, calm ? 0 : c.r);

  if (sh.strip) {
    const n = sh.strip.length;
    let fh = 0.76, pos = 0;
    if (t < 0.16) fh = lerp(1, 0.76, ease(t / 0.16));
    else if (t > 0.84) { fh = lerp(0.76, 1, ease((t - 0.84) / 0.16)); pos = n - 1; }
    else {
      const x = ((t - 0.16) / 0.68) * (n - 1);
      const k = Math.min(n - 2, Math.floor(x));
      pos = x >= n - 1 ? n - 1 : k + sstep(0.3, 0.92, x - k);
    }
    const k = Math.min(n - 1, Math.floor(pos)), g = pos - k, move = Math.sin(Math.PI * g);
    const still = { s: 1, x: 0, y: 0, r: 0 };
    return {
      ...u0,
      A: view(sh.strip[k], [0.5, 0.5], still),
      B: view(sh.strip[Math.min(n - 1, k + 1)], [0.5, 0.5], still),
      gate: [g, fh, 0.05 * clamp((1 - fh) / 0.24)],
      blur: [0, calm ? 0 : 0.022 * move, 1, 0],
      leak: calm ? [0, 0] : [lerp(-0.95, 0.95, g) * sa, 0.12 + 0.82 * move],
      fade: [1, 0.97, 0.92, 1 - sstep(0, 0.1, t)],
    };
  }

  const focus = sh.focus ?? [0.5, 0.5];
  const c = camAt(sh, t);
  const m = sh.img2 && sh.mix ? sstep(sh.mix[0], sh.mix[1], t) : 0;
  const base = sh.clip ? clipKey(sh) : sh.img;
  const u: Uniforms = { ...u0, A: view(base, focus, c), B: sh.img2 ? view(sh.img2, focus, c) : null, mix: m };

  if (sh.framed && t < 0.42) {
    const k = ease((t - 0.03) / 0.39), pop = sstep(0, 0.05, t);
    u.B = u.A;
    u.frame = [0, 0, lerp(0.17 * sa, sa / 2 + 0.03, k) * pop, lerp(0.22, 0.53, k) * pop, lerp(0.045, 0, k)];
  }
  if (i === 0) u.fade = [0.055, 0.047, 0.04, 1 - sstep(0, 0.1, t)];

  const nx = FILM[i + 1];
  const tw = nx ? TW[sh.out ?? "cut"] : 0;
  const w = tw ? clamp((t - (1 - tw)) / tw) : 0;
  if (sh.flare && !calm) {
    const f = sh.flare, ft = ease(t);
    const k = f.k * sstep(0, 0.12, t) * (f.with === "mix" ? m : 1) * (1 - w);
    u.flare = [(lerp(f.from[0], f.to[0], ft) - 0.5) * sa, 0.5 - lerp(f.from[1], f.to[1], ft), k];
  }
  if (w > 0 && nx) {
    const cur = sh.img2 && m > 0.5 ? sh.img2 : base;
    const nKey = nx.strip ? nx.strip[0] : nx.clip ? clipKey(nx) : nx.img;
    const nFocus = nx.strip ? ([0.5, 0.5] as [number, number]) : nx.focus ?? [0.5, 0.5];
    const nc = nx.strip ? { s: 1, x: 0, y: 0, r: 0 } : camAt(nx, 0);
    const wave = Math.sin(Math.PI * w);
    u.mix = 0;
    u.B = view(nKey, nFocus, nc);
    switch (sh.out) {
      case "zoom":
        u.A = view(cur, focus, c, 1 + (calm ? 0.25 : 3.2) * w * w);
        u.mix = sstep(0.5, 0.9, w);
        u.blur = [calm ? 0 : 0.2 * Math.pow(wave, 2), 0, 0, 0];
        break;
      case "whip":
        u.A = view(cur, focus, c, 1, calm ? 0 : 0.55 * w * w);
        u.B = view(nKey, nFocus, nc, 1, calm ? 0 : -0.55 * (1 - w) * (1 - w));
        u.mix = sstep(0.4, 0.62, w);
        u.blur = [0, calm ? 0 : 0.07 * Math.pow(wave, 2), 1, 0];
        break;
      case "whipUp":
        u.A = view(cur, focus, c, 1, 0, calm ? 0 : -0.5 * w * w);
        u.B = view(nKey, nFocus, nc, 1, 0, calm ? 0 : 0.5 * (1 - w) * (1 - w));
        u.mix = sstep(0.4, 0.62, w);
        u.blur = [0, calm ? 0 : 0.07 * Math.pow(wave, 2), 0, 1];
        break;
      case "fade":
        u.A = view(cur, focus, c);
        u.mix = w < 0.5 ? 0 : 1;
        u.fade = [0.055, 0.047, 0.04, w < 0.5 ? sstep(0, 0.5, w) : 1 - sstep(0.5, 1, w)];
        break;
      case "white":
        u.A = view(cur, focus, c);
        u.B = null;
        u.fade = [...IVORY, sstep(0, 1, w)];
        break;
      case "glow":
        u.A = view(cur, focus, c, 1 + (calm ? 0.2 : 1.6) * w * w);
        u.B = null;
        u.blur = [calm ? 0 : 0.08 * w * w, 0, 0, 0];
        u.fade = [1, 0.97, 0.92, sstep(0.25, 1, w)];
        break;
    }
  }
  return u;
}

const timecode = (T: number) => {
  const sec = T * 2.6, f = Math.floor((sec % 1) * 24), s = Math.floor(sec) % 60, m = Math.floor(sec / 60);
  return `00:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

let filmTop = 0;
/** Scrolls the page to a moment of the film. */
export function goFilm(T: number) {
  window.scrollTo({ top: filmTop + T * innerHeight * UNIT + 2, behavior: "auto" });
}

export function Film() {
  const sec = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const caps = useRef<(HTMLParagraphElement | null)[]>([]);
  const hud = useRef<{ ch: HTMLSpanElement | null; tc: HTMLSpanElement | null; bar: HTMLSpanElement | null; end: HTMLDivElement | null; scrim: HTMLDivElement | null }>({ ch: null, tc: null, bar: null, end: null, scrim: null });
  const [flat, setFlat] = useState(false);

  useEffect(() => {
    const el = sec.current, canvas = cv.current;
    if (!el || !canvas) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = matchMedia("(max-width: 760px)").matches;
    let eng: FilmGL;
    try {
      eng = new FilmGL(canvas, srcOf, small ? 1600 : 2720, small ? 7 : 10);
    } catch {
      queueMicrotask(() => setFlat(true)); // no WebGL: show the shots as plain pictures
      return;
    }
    let Ts = 0, raf = 0, last = performance.now(), dirty = true, vh = innerHeight, live = false, shown = "", lastCap = -1;
    const measure = () => {
      filmTop = el.getBoundingClientRect().top + scrollY;
      vh = innerHeight;
      // Sharp on Retina: up to 2x, capped near 10 megapixels so big screens stay smooth.
      const dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt(10e6 / (innerWidth * vh)));
      eng.size(Math.round(innerWidth * dpr), Math.round(vh * dpr));
      dirty = true;
    };
    eng.onLoad = () => { dirty = true; };
    const overlay = (T: number) => {
      CAPS.forEach((c, k) => {
        const node = caps.current[k];
        if (!node) return;
        const o = sstep(c.a, c.a + 0.07, T) * (1 - sstep(c.b - 0.07, c.b, T));
        const key = o.toFixed(3);
        if (node.dataset.o === key) return;
        node.dataset.o = key;
        node.style.opacity = key;
        node.style.transform = `translate3d(0, ${((1 - o) * 14).toFixed(1)}px, 0)`;
        node.style.visibility = o > 0.001 ? "visible" : "hidden";
      });
      const h = hud.current;
      let ch = "";
      for (const c of CHAPTERS) if (T >= c.at - 0.001) ch = c.name;
      if (h.ch && ch !== shown) { h.ch.textContent = ch; shown = ch; }
      if (h.tc) h.tc.textContent = timecode(T);
      if (h.bar) h.bar.style.transform = `scaleX(${(T / FILM_LEN).toFixed(4)})`;
      // The dark band under the captions steps aside while a picture grows in its frame on ivory.
      const si = shotAt(T), st = (T - STARTS[si]) / FILM[si].len;
      const scrim = FILM[si].framed ? sstep(0.3, 0.42, st) : FILM[si].out === "white" ? 1 - sstep(1 - TW.white, 1 - TW.white * 0.4, st) : 1;
      if (h.scrim && h.scrim.dataset.o !== scrim.toFixed(2)) { h.scrim.dataset.o = scrim.toFixed(2); h.scrim.style.opacity = scrim.toFixed(2); }
      const endO = sstep(FILM_LEN - 0.42, FILM_LEN - 0.1, T);
      if (h.end && Math.abs(endO - lastCap) > 0.002) {
        lastCap = endO;
        h.end.style.opacity = endO.toFixed(3);
        h.end.style.visibility = endO > 0.01 ? "visible" : "hidden";
      }
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const target = clamp((scrollY - filmTop) / (vh * UNIT), 0, FILM_LEN - 1e-4);
      const prev = Ts;
      if (calm || Math.abs(target - Ts) > 3) Ts = target;
      else Ts += (target - Ts) * (1 - Math.exp(-dt * 7.5));
      if (Math.abs(target - Ts) < 2e-4) Ts = target;
      if (!dirty && Math.abs(Ts - prev) < 1e-5) return;
      dirty = false;
      eng.draw(compose(Ts, innerWidth / vh, eng, calm));
      const i = shotAt(Ts);
      const cs = FILM[i];
      if (cs.clip) eng.seek(clipKey(cs), clamp((Ts - STARTS[i]) / cs.len) * (cs.clip.dur - 0.05));
      for (const j of [i + 1, i + 2]) if (FILM[j]) keysOf(FILM[j]).forEach((k) => eng.want(k));
      overlay(Ts);
    };
    const start = () => { if (!live) { live = true; last = performance.now(); dirty = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { live = false; cancelAnimationFrame(raf); };
    measure();
    keysOf(FILM[0]).concat(keysOf(FILM[1])).forEach((k) => eng.want(k));
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "100% 0px" });
    io.observe(el);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    addEventListener("resize", measure);
    const lost = (e: Event) => { e.preventDefault(); stop(); setFlat(true); };
    canvas.addEventListener("webglcontextlost", lost);
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      removeEventListener("resize", measure);
      canvas.removeEventListener("webglcontextlost", lost);
      eng.dispose();
    };
  }, []);

  if (flat)
    return (
      <section className="ve-flat" id="film" aria-label="A walk through the house">
        {FILM.map((s) => (
          <figure key={s.id} className="ve-flat-shot">
            <Img src={IMG[s.img2 ?? s.img]} alt="" sizes="100vw" />
            {(s.lines ?? []).map((l) => (
              <figcaption key={l.text}>{l.text}</figcaption>
            ))}
          </figure>
        ))}
      </section>
    );

  return (
    <section ref={sec} className="ve-film" id="film" aria-label="A walk through the house" style={{ height: `calc(${(FILM_LEN * UNIT * 100).toFixed(1)}svh + 100svh)` }}>
      <div className="ve-film-stage">
        <canvas ref={cv} className="ve-film-canvas" aria-hidden />
        <div className="ve-film-scrim" ref={(n) => { hud.current.scrim = n; }} aria-hidden />
        <div className="ve-caps">
          {CAPS.map((c, k) => (
            <p key={k} ref={(n) => { caps.current[k] = n; }} className="ve-cap" style={{ opacity: 0, visibility: "hidden" }}>
              {c.text}
            </p>
          ))}
        </div>
        <div className="ve-end" ref={(n) => { hud.current.end = n; }} style={{ opacity: 0, visibility: "hidden" }}>
          <a className="ve-arch" href="#viewing">
            <span>Book a private viewing</span>
          </a>
        </div>
        <div className="ve-hud" aria-hidden>
          <span className="ve-hud-ch" ref={(n) => { hud.current.ch = n; }} />
          <span className="ve-hud-line">
            <span className="ve-hud-bar" ref={(n) => { hud.current.bar = n; }} />
            {CHAPTERS.map((c) => (
              <i key={c.name} style={{ left: `${(c.at / FILM_LEN) * 100}%` }} />
            ))}
          </span>
          <span className="ve-hud-tc" ref={(n) => { hud.current.tc = n; }}>00:00:00:00</span>
        </div>
      </div>
    </section>
  );
}
