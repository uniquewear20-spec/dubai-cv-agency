"use client";

// A live fire drawn on a canvas: a bed of embers, flames, sparks and smoke. Its heat follows the
// course on screen, so the fire flares for the prawns, smokes for the hamour, greys to ash for the
// lamb and goes quiet for the one cold course. Runs only while visible; one still frame for
// visitors who prefer reduced motion.

import { useEffect, useRef } from "react";
import type { Stage } from "@/lib/showcase/mawqid";

type Mix = { i: number; flame: number; smoke: number; ash: number; cold: number };

function target(heat: number, stage: Stage): Mix {
  return {
    i: Math.max(0.08, Math.min(1, heat / 720)),
    flame: stage === "flame" ? 1 : stage === "ember" ? 0.3 : 0,
    smoke: stage === "smoke" ? 1 : stage === "ash" ? 0.45 : stage === "rest" ? 0.2 : 0.12,
    ash: stage === "ash" ? 1 : 0,
    cold: stage === "rest" ? 1 : 0,
  };
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export function Hearth({ heat, stage, className, centerOf }: { heat: number; stage: Stage; className?: string; centerOf?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const want = useRef<Mix>(target(heat, stage));
  const redraw = useRef<() => void>(() => {});

  useEffect(() => {
    want.current = target(heat, stage);
    redraw.current();
  }, [heat, stage]);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const out = cv.getContext("2d");
    if (!out) return;
    // the glow, embers and flames are drawn small and scaled up, which softens them like heat haze
    const soft = document.createElement("canvas");
    const sctx = soft.getContext("2d");
    if (!sctx) return;
    const SOFT = 0.3;
    let ctx: CanvasRenderingContext2D = sctx;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0,
      H = 0,
      raf = 0,
      visible = false,
      last = performance.now();
    const cur: Mix = { ...want.current };

    // a fixed bed of embers, laid out once
    const bed = Array.from({ length: 64 }, (_, k) => {
      const a = (k * 2.39996) % (Math.PI * 2);
      const r = Math.sqrt((k + 0.5) / 64);
      return { x: Math.cos(a) * r, y: Math.sin(a) * r, s: 0.6 + ((k * 37) % 10) / 14, ph: k * 1.7, sp: 0.6 + ((k * 13) % 7) / 6 };
    });
    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };
    const sparks: P[] = [];
    const smoke: P[] = [];

    let CX = 0.5;
    const size = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = Math.max(1, Math.round(W * dpr));
      cv.height = Math.max(1, Math.round(H * dpr));
      out.setTransform(dpr, 0, 0, dpr, 0, 0);
      soft.width = Math.max(1, Math.round(W * SOFT));
      soft.height = Math.max(1, Math.round(H * SOFT));
      sctx.setTransform(SOFT, 0, 0, SOFT, 0, 0);
      const anchor = centerOf ? cv.parentElement?.querySelector(centerOf) : null;
      if (anchor) {
        const a = anchor.getBoundingClientRect();
        const c = cv.getBoundingClientRect();
        CX = c.width ? (a.left + a.width / 2 - c.left) / c.width : 0.5;
      } else CX = 0.5;
    };

    const draw = (t: number, dt: number) => {
      const k = Math.min(1, dt * 2.2);
      const w = want.current;
      cur.i = lerp(cur.i, w.i, k);
      cur.flame = lerp(cur.flame, w.flame, k);
      cur.smoke = lerp(cur.smoke, w.smoke, k);
      cur.ash = lerp(cur.ash, w.ash, k);
      cur.cold = lerp(cur.cold, w.cold, k);
      const { i, flame, ash, cold } = cur;

      ctx = sctx;
      ctx.clearRect(0, 0, W, H);
      out.clearRect(0, 0, W, H);
      const cx = W * CX,
        cy = H * 0.94,
        rx = Math.min(W * 0.34, 440),
        ry = Math.max(22, H * 0.05);

      // glow over the whole room
      ctx.globalCompositeOperation = "lighter";
      const glowR = Math.max(W, H) * (0.35 + 0.45 * i);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      const gw = (1 - cold) * (0.14 + 0.26 * i) * (1 - ash * 0.5);
      g.addColorStop(0, `rgba(255,110,40,${gw})`);
      g.addColorStop(0.45, `rgba(200,60,20,${gw * 0.35})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      if (cold > 0.01) {
        const c = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR * 0.8);
        c.addColorStop(0, `rgba(110,160,200,${0.16 * cold})`);
        c.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = c;
        ctx.fillRect(0, 0, W, H);
      }

      // the embers
      for (const b of bed) {
        const fl = 0.55 + 0.45 * Math.sin(t * b.sp * 2.1 + b.ph) * Math.sin(t * b.sp * 0.7 + b.ph * 0.5);
        const x = cx + b.x * rx,
          y = cy + b.y * ry;
        const r = (rx / 7) * b.s * (0.7 + 0.5 * i);
        const heatK = Math.max(0, Math.min(1, i * (0.65 + 0.35 * fl)));
        const R = Math.round(lerp(lerp(150, 255, heatK), 130, ash * 0.6 + cold * 0.4));
        const G = Math.round(lerp(lerp(35, 150, heatK * heatK), 120, ash * 0.55));
        const B = Math.round(lerp(lerp(12, 40, heatK), 118, ash * 0.55 + cold * 0.3));
        const a = (0.12 + 0.36 * heatK) * (1 - cold * 0.6);
        const eg = ctx.createRadialGradient(x, y, 0, x, y, r);
        eg.addColorStop(0, `rgba(${R},${G},${B},${a})`);
        eg.addColorStop(1, `rgba(${R},${G},${B},0)`);
        ctx.fillStyle = eg;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // flames
      if (flame > 0.02) {
        const n = 14;
        for (let f = 0; f < n; f++) {
          const u = (f + 0.5) / n - 0.5;
          const bx = cx + u * rx * 1.5 + Math.sin(t * 1.3 + f * 4.1) * rx * 0.03;
          const h = H * (0.05 + 0.24 * flame * i) * (0.55 + 0.45 * Math.sin(t * 3.1 + f * 1.9) * Math.sin(t * 1.7 + f)) * (1 - Math.abs(u) * 1.1);
          if (h <= 2) continue;
          const wv = Math.sin(t * 4 + f) * h * 0.14;
          const bw = rx * 0.07;
          const fg = ctx.createLinearGradient(bx, cy, bx, cy - h);
          fg.addColorStop(0, `rgba(255,214,140,${0.42 * flame})`);
          fg.addColorStop(0.4, `rgba(255,120,40,${0.3 * flame})`);
          fg.addColorStop(1, "rgba(200,50,10,0)");
          ctx.fillStyle = fg;
          ctx.beginPath();
          ctx.moveTo(bx - bw, cy);
          ctx.quadraticCurveTo(bx - bw * 0.6 + wv, cy - h * 0.55, bx + wv * 1.6, cy - h);
          ctx.quadraticCurveTo(bx + bw * 0.6 + wv, cy - h * 0.5, bx + bw, cy);
          ctx.closePath();
          ctx.fill();
        }
      }

      // put the soft layer on screen, then draw the sharp sparks over it
      out.globalCompositeOperation = "source-over";
      out.drawImage(soft, 0, 0, soft.width, soft.height, 0, 0, W, H);
      ctx = out;
      ctx.globalCompositeOperation = "lighter";

      // sparks
      const rate = (6 + 70 * i * (0.25 + flame)) * (1 - cold) * (1 - ash * 0.7);
      let spawn = rate * dt;
      while (spawn > 0) {
        if (Math.random() < spawn)
          sparks.push({
            x: cx + (Math.random() - 0.5) * rx * 1.4,
            y: cy - Math.random() * ry,
            vx: (Math.random() - 0.5) * 30,
            vy: -(50 + Math.random() * 140) * (0.5 + i),
            life: 0,
            max: 0.8 + Math.random() * 1.8,
            r: 0.6 + Math.random() * 1.4,
          });
        spawn -= 1;
      }
      for (let s = sparks.length - 1; s >= 0; s--) {
        const p = sparks[s];
        p.life += dt;
        if (p.life > p.max || sparks.length > 220) {
          sparks.splice(s, 1);
          continue;
        }
        p.vx += Math.sin(t * 3 + p.y * 0.02) * 20 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const a = 1 - p.life / p.max;
        ctx.fillStyle = `rgba(255,${Math.round(150 + 80 * a)},${Math.round(60 * a)},${a})`;
        ctx.fillRect(p.x, p.y, p.r, p.r * 2.2);
      }

      // smoke, drawn normally so it veils rather than glows
      ctx.globalCompositeOperation = "source-over";
      const srate = 1.2 + 7 * cur.smoke;
      if (Math.random() < srate * dt)
        smoke.push({
          x: cx + (Math.random() - 0.5) * rx,
          y: cy - ry,
          vx: (Math.random() - 0.5) * 12,
          vy: -(14 + Math.random() * 22),
          life: 0,
          max: 6 + Math.random() * 5,
          r: rx * (0.12 + Math.random() * 0.12),
        });
      for (let s = smoke.length - 1; s >= 0; s--) {
        const p = smoke[s];
        p.life += dt;
        if (p.life > p.max || smoke.length > 60) {
          smoke.splice(s, 1);
          continue;
        }
        p.x += (p.vx + Math.sin(t * 0.6 + s) * 8) * dt;
        p.y += p.vy * dt;
        const q = p.life / p.max;
        const r = p.r * (1 + q * 1.6);
        const a = Math.sin(Math.PI * q) * (0.025 + 0.06 * cur.smoke);
        const sg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        sg.addColorStop(0, `rgba(222,214,204,${a})`);
        sg.addColorStop(1, "rgba(222,214,204,0)");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(now / 1000, dt);
      if (visible) raf = requestAnimationFrame(loop);
    };
    const still = () => {
      // settle the mix, then draw one frame with a few sparks frozen in the air
      for (let s = 0; s < 40; s++) draw(2 + s * 0.05, 0.05);
    };
    redraw.current = () => {
      if (reduce) still();
    };

    size();
    const ro = new ResizeObserver(() => {
      size();
      if (reduce) still();
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (reduce) {
        if (visible) still();
        return;
      }
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(cv);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [centerOf]);

  return <canvas ref={canvas} className={className} aria-hidden />;
}
