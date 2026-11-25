"use client";
// components/site/HeroDrawing.tsx — the homepage opens on an engineering drawing of a career.
// The sheet is a world coordinate system: a longitude ruler across the top with Zenith's markets
// plotted on it, a latitude scale down the side, and a drafting crosshair that reads out the
// coordinates under the pointer. The headline is edited live: "We write CVs." is struck through
// in gold and corrected to "We engineer careers." The call to action sits in the title block.
// One load sequence (CSS), no animation library, nothing moves under reduced motion.

import React, { useEffect, useRef } from "react";
import { pick, type L10n, type Lang } from "@/lib/site";

type L = L10n;

const T = {
  sr: { en: "We don't write CVs. We engineer careers.", fr: "Nous n'écrivons pas des CV. Nous concevons des carrières.", ar: "نحن لا نكتب السير الذاتية. نحن نهندس المسارات المهنية." } as L,
  we: { en: "We", fr: "Nous", ar: "نحن" } as L,
  struck: { en: "write CVs.", fr: "rédigeons des CV.", ar: "نكتب السير الذاتية." } as L,
  line2: { en: "We engineer careers.", fr: "Nous concevons des carrières.", ar: "نحن نهندس المسارات المهنية." } as L,
  dim: { en: "Built to the role you want", fr: "Construit pour le poste visé", ar: "مصمَّمة للوظيفة التي تريدها" } as L,
  k1: { en: "Career engineering", fr: "Ingénierie de carrière", ar: "هندسة المسارات المهنية" } as L,
  v1: { en: "English, French, Arabic", fr: "Français, anglais, arabe", ar: "العربية، الإنجليزية، الفرنسية" } as L,
  lede: {
    en: "CVs, LinkedIn profiles and applications for professionals moving across the Gulf, Europe, North America and Asia.",
    fr: "CV, profils LinkedIn et candidatures pour les professionnels qui évoluent entre le Golfe, l'Europe, l'Amérique du Nord et l'Asie.",
    ar: "سير ذاتية وملفات LinkedIn وطلبات توظيف للمهنيين المتنقلين بين الخليج وأوروبا وأمريكا الشمالية وآسيا.",
  } as L,
  cta: { en: "Run the free CV X-Ray", fr: "Lancer la radiographie gratuite", ar: "ابدأ فحص السيرة المجاني" } as L,
  packages: { en: "See packages", fr: "Voir les formules", ar: "عرض الباقات" } as L,
  note: { en: "First draft within 48 hours of your brief", fr: "Première version sous 48 heures après votre brief", ar: "مسودة أولى خلال 48 ساعة من استلام ملخصك" } as L,
};

// Markets, plotted at their true coordinates on the sheet. Each label sits on the side its routes leave free:
// Riyadh to the left, London and Dubai above, so no line ever crosses a name or a coordinate.
const CITIES: { id: string; lon: number; lat: number; side?: "l" | "t"; home?: boolean; name: L }[] = [
  { id: "tor", lon: -79.38, lat: 43.65, name: { en: "Toronto", fr: "Toronto", ar: "تورنتو" } },
  { id: "lon", lon: -0.13, lat: 51.51, side: "t", name: { en: "London", fr: "Londres", ar: "لندن" } },
  { id: "ruh", lon: 46.68, lat: 24.71, side: "l", name: { en: "Riyadh", fr: "Riyad", ar: "الرياض" } },
  { id: "dxb", lon: 55.27, lat: 25.2, side: "t", home: true, name: { en: "Dubai", fr: "Dubaï", ar: "دبي" } },
  { id: "sin", lon: 103.82, lat: 1.35, name: { en: "Singapore", fr: "Singapour", ar: "سنغافورة" } },
];

const HOME = CITIES.find(c => c.home)!;
const pos = (lon: number) => `${((lon + 180) / 360) * 100}%`;
const fmt = (v: number, a: string, b: string) => `${Math.abs(v).toFixed(1)}° ${v >= 0 ? a : b}`;

export default function HeroDrawing({ lang }: { lang: Lang }) {
  const sheet = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLSpanElement>(null);
  const p = (v: L) => pick(v, lang);

  // Drafting crosshair: pointer position → CSS variables and a coordinate readout.
  // Fine pointers only; nothing runs on touch screens or under reduced motion.
  useEffect(() => {
    const el = sheet.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const markers = [...el.querySelectorAll<HTMLElement>("[data-lon]")];
    const paint = () => {
      frame = 0;
      if (!last) return;
      const r = el.getBoundingClientRect();
      const x = Math.min(Math.max(last.clientX - r.left, 0), r.width);
      const y = Math.min(Math.max(last.clientY - r.top, 0), r.height);
      el.style.setProperty("--hx-x", `${x}px`);
      el.style.setProperty("--hx-y", `${y}px`);
      const lon = (x / r.width) * 360 - 180;
      const lat = 90 - (Math.max(y - 40, 0) / (r.height - 40)) * 180;
      if (read.current) read.current.textContent = `${fmt(lat, "N", "S")}  ${fmt(lon, "E", "W")}`;
      markers.forEach(m => m.classList.toggle("on", Math.abs(Number(m.dataset.lon) - lon) < 6 && Math.abs(Number(m.dataset.lat) - lat) < 8));
    };
    const move = (e: PointerEvent) => { last = e; el.classList.add("hx-tracking"); if (!frame) frame = requestAnimationFrame(paint); };
    const leave = () => { el.classList.remove("hx-tracking"); markers.forEach(m => m.classList.remove("on")); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); cancelAnimationFrame(frame); };
  }, []);

  return (
    <section className="hx" aria-labelledby="hx-title">
      <style href="zenith-hero-drawing" precedence="medium">{CSS}</style>
      <div className="hx-sheet" ref={sheet}>
        <div className="hx-grid" aria-hidden="true" />
        <div className="hx-corners" aria-hidden="true"><i /><i /><i /><i /></div>

        {/* Longitude ruler. Geography reads west to east in every language. */}
        <div className="hx-ruler" aria-hidden="true" dir="ltr">
          {[-120, -60, 0, 60, 120].map(v => <span key={v} style={{ left: pos(v) }}>{v === 0 ? "0°" : fmt(v, "E", "W").replace(".0", "")}</span>)}
        </div>

        {/* The markets, plotted at their true coordinates, with routes drawn from Dubai. */}
        <div className="hx-map" aria-hidden="true" dir="ltr">
          <svg viewBox="0 0 360 180" preserveAspectRatio="none">
            {CITIES.filter(c => !c.home).map((c, i) => {
              const [x1, y1, x2, y2] = [HOME.lon + 180, 90 - HOME.lat, c.lon + 180, 90 - c.lat];
              const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.22;
              return <path key={c.id} data-id={c.id} d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} pathLength={1} style={{ animationDelay: `${1.9 + i * 0.12}s` }} />;
            })}
          </svg>
          {CITIES.map(c => (
            <span key={c.id} className={`hx-pt${c.home ? " home" : ""}${c.side ? ` ${c.side}` : ""}`} data-id={c.id} style={{ left: pos(c.lon), top: `${((90 - c.lat) / 180) * 100}%` }} data-lon={c.lon} data-lat={c.lat}>
              <b /><span>{p(c.name)}<em>{fmt(c.lat, "N", "S")}, {fmt(c.lon, "E", "W")}</em></span>
            </span>
          ))}
        </div>
        <div className="hx-scale" aria-hidden="true" dir="ltr">
          {[60, 30, 0, -30, -60].map(v => <span key={v} style={{ top: `${((90 - v) / 180) * 100}%` }}>{v === 0 ? "0°" : fmt(v, "N", "S").replace(".0", "")}</span>)}
        </div>

        <div className="hx-cross" aria-hidden="true"><i className="v" /><i className="h" /><span ref={read} className="hx-read" dir="ltr" /></div>

        <div className="hx-body">
          <h1 id="hx-title" className="hx-title">
            <span className="z-sr">{p(T.sr)}</span>
            <span className="hx-l1" aria-hidden="true">{p(T.we)} <s className="hx-strike">{p(T.struck)}</s></span>
            <span className="hx-l2" aria-hidden="true">
              <span className="hx-l2-in">
                {p(T.line2)}
                <span className="hx-dim"><i />{p(T.dim)}<i /></span>
              </span>
            </span>
          </h1>

          <div className="hx-block">
            <div className="hx-row"><span>{p(T.k1)}</span><span>{p(T.v1)}</span></div>
            <p className="hx-lede">{p(T.lede)}</p>
            <div className="hx-actions">
              <a className="z-btn z-btn-primary" href="/x-ray/">{p(T.cta)}</a>
              <a className="hx-link" href="#packages">{p(T.packages)}</a>
            </div>
            <p className="hx-note">{p(T.note)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.hx{--hx-line:rgba(237,232,224,.075);--hx-line-2:rgba(237,232,224,.16);position:relative;background:var(--z-bg)}
html[data-theme="light"] .hx{--hx-line:rgba(26,20,16,.07);--hx-line-2:rgba(26,20,16,.16)}
.hx-sheet{position:relative;min-height:calc(100svh - 68px);padding:64px clamp(20px,4vw,56px) clamp(28px,4vw,48px) clamp(20px,4.4vw,64px);display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;isolation:isolate}
.hx-grid{position:absolute;inset:40px 0 0 0;z-index:-1;background-image:linear-gradient(to right,var(--hx-line) 1px,transparent 1px),linear-gradient(to bottom,var(--hx-line) 1px,transparent 1px);background-size:calc(100% / 24) calc(100% / 12)}
.hx-corners i{position:absolute;width:14px;height:14px;border-color:var(--hx-line-2);border-style:solid;border-width:0}
.hx-corners i:nth-child(1){top:48px;left:16px;border-top-width:1px;border-left-width:1px}
.hx-corners i:nth-child(2){top:48px;right:16px;border-top-width:1px;border-right-width:1px}
.hx-corners i:nth-child(3){bottom:16px;left:16px;border-bottom-width:1px;border-left-width:1px}
.hx-corners i:nth-child(4){bottom:16px;right:16px;border-bottom-width:1px;border-right-width:1px}

/* Longitude ruler */
.hx-ruler{position:absolute;left:0;right:0;top:0;height:40px;border-bottom:1px solid var(--hx-line-2);background-image:linear-gradient(to right,var(--hx-line-2) 1px,transparent 1px);background-size:calc(100% / 24) 6px;background-repeat:repeat-x;background-position:0 100%}
.hx-ruler span{position:absolute;bottom:9px;transform:translateX(-50%);font-size:10.5px;letter-spacing:.02em;color:var(--z-fg-3);opacity:.8;font-variant-numeric:tabular-nums}
.hx-map{position:absolute;left:0;right:0;top:40px;bottom:0;z-index:0}
.hx-map svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.hx-map path{fill:none;stroke:var(--z-gold);stroke-opacity:.55;stroke-width:.3;stroke-linecap:round;stroke-dasharray:1 1;stroke-dashoffset:0}
.hx-pt{position:absolute;transform:translate(-3px,-3px);display:flex;align-items:flex-start;gap:8px;font-size:12px;line-height:1.25;color:var(--z-fg-2);white-space:nowrap;transition:color .25s}
.hx-pt b{width:6px;height:6px;border-radius:50%;background:var(--z-fg-3);flex:none;margin-top:0}
.hx-pt>span{display:flex;flex-direction:column;transform:translateY(-4px)}
.hx-pt em{font-style:normal;font-size:10.5px;color:var(--z-fg-3);font-variant-numeric:tabular-nums}
.hx-pt.l{flex-direction:row-reverse;transform:translate(calc(-100% + 3px),-3px)}
.hx-pt.l>span{align-items:flex-end}
.hx-pt.t>span{position:absolute;left:7px;bottom:10px;transform:none}
.hx-pt.home{color:var(--z-gold-text)}
.hx-pt.home b{background:var(--z-gold);box-shadow:0 0 0 4px rgba(200,169,110,.14)}
.hx-pt.on{color:var(--z-fg)}
.hx-pt.on b{background:var(--z-fg)}
.hx-scale{position:absolute;left:0;top:40px;bottom:0;width:44px;border-right:1px solid var(--hx-line)}
.hx-scale span{position:absolute;left:8px;transform:translateY(-50%);font-size:10px;color:var(--z-fg-3);opacity:.7;font-variant-numeric:tabular-nums}

/* Drafting crosshair (fine pointers) */
.hx-cross{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .3s;z-index:0}
.hx-tracking .hx-cross{opacity:1}
.hx-cross .v{position:absolute;top:40px;bottom:0;left:0;width:1px;background:rgba(200,169,110,.32);transform:translateX(var(--hx-x,0))}
.hx-cross .h{position:absolute;left:0;right:0;top:0;height:1px;background:rgba(200,169,110,.32);transform:translateY(var(--hx-y,0))}
.hx-read{position:absolute;left:0;top:0;transform:translate(calc(var(--hx-x,0px) + 12px),calc(var(--hx-y,0px) + 10px));font-size:11px;letter-spacing:.02em;color:var(--z-gold-text);font-variant-numeric:tabular-nums;white-space:pre}

/* Headline: the edit */
.hx-body{position:relative;z-index:1;display:grid;gap:40px;padding-inline-start:clamp(0px,3vw,32px)}
@media (min-width:1100px){.hx-body{grid-template-columns:minmax(0,1fr) 380px;align-items:end;gap:56px}}
.hx-title{margin:0;font-family:var(--font-serif),Georgia,serif;font-optical-sizing:auto;font-weight:300;color:var(--z-fg)}
.hx-l1{display:block;font-size:clamp(34px,5.4vw,88px);line-height:1;letter-spacing:-.025em;color:var(--z-fg-3)}
.hx-strike{position:relative;text-decoration:none;color:inherit}
.hx-strike::after{content:"";position:absolute;inset-inline:-.04em;top:55%;height:max(2px,.05em);background:var(--z-gold);transform-origin:left center}
[dir="rtl"] .hx-strike::after{transform-origin:right center}
.hx-l2{display:block;margin-top:.12em;font-size:clamp(50px,8.4vw,150px);line-height:.95;letter-spacing:-.035em;padding-bottom:.62em}
.hx-l2-in{position:relative;display:inline}
.hx-dim{position:absolute;inset-inline:0;bottom:-.5em;display:flex;align-items:center;gap:12px;font-family:var(--font-sans),system-ui,sans-serif;font-size:max(12px,.1em);letter-spacing:.02em;color:var(--z-fg-3);white-space:nowrap;transform-origin:left center}
[dir="rtl"] .hx-dim{transform-origin:right center}
.hx-dim i{flex:1;height:1px;background:var(--hx-line-2);position:relative}
.hx-dim i:first-child::before,.hx-dim i:last-child::after{content:"";position:absolute;top:-5px;width:1px;height:11px;background:var(--z-fg-3)}
.hx-dim i:first-child::before{inset-inline-start:0}
.hx-dim i:last-child::after{inset-inline-end:0}
[dir="rtl"] .hx-title{font-family:var(--font-arabic-serif),var(--font-arabic),serif;font-weight:600}
[dir="rtl"] .hx-l1{font-size:clamp(26px,3.4vw,52px);line-height:1.35;letter-spacing:0}
[dir="rtl"] .hx-l2{font-size:clamp(36px,5vw,84px);line-height:1.3;letter-spacing:0}

/* Title block */
.hx-block{border:1px solid var(--hx-line-2);background:color-mix(in srgb,var(--z-bg) 94%,transparent)}
.hx-row{display:flex;justify-content:space-between;gap:16px;padding:10px 16px;border-bottom:1px solid var(--hx-line-2);font-size:12.5px;color:var(--z-fg-3)}
.hx-row span:first-child{color:var(--z-gold-text)}
.hx-lede{padding:16px 16px 0;font-size:15.5px;line-height:1.6;color:var(--z-fg-2)}
.hx-actions{display:flex;flex-wrap:wrap;align-items:center;gap:16px;padding:18px 16px}
.hx-link{color:var(--z-fg);font-size:15px;text-decoration:underline;text-decoration-color:var(--z-gold);text-underline-offset:5px}
.hx-link:hover{text-decoration-thickness:2px}
.hx-note{padding:10px 16px;border-top:1px solid var(--hx-line-2);font-size:12.5px;color:var(--z-fg-3)}

/* The one load sequence */
@media (prefers-reduced-motion: no-preference){
  .hx-grid{animation:hx-fade 1.1s ease both}
  .hx-ruler,.hx-scale{animation:hx-fade .8s .2s ease both}
  .hx-l1{animation:hx-rise .9s .35s cubic-bezier(.22,1,.36,1) both}
  .hx-strike::after{animation:hx-strike .75s 1.15s cubic-bezier(.65,0,.35,1) both}
  .hx-l2{animation:hx-reveal 1.1s 1.55s cubic-bezier(.22,1,.36,1) both}
  .hx-dim{animation:hx-strike .8s 2.3s cubic-bezier(.65,0,.35,1) both}
  .hx-block{animation:hx-fade .8s 2.4s ease both}
  .hx-map path{animation:hx-route 1.4s cubic-bezier(.65,0,.35,1) both}
  .hx-pt{animation:hx-fade .7s 1.7s ease both}
  .hx-pt.home b{animation:hx-pulse 3.2s 3s ease-in-out infinite}
  @supports (animation-timeline: view()){
    .hx-body{animation:hx-exit linear both;animation-timeline:view();animation-range:exit 0% exit 80%}
  }
}
@keyframes hx-fade{from{opacity:0}}
@keyframes hx-route{from{stroke-dashoffset:1}}
@keyframes hx-pulse{0%,100%{box-shadow:0 0 0 4px rgba(200,169,110,.14)}50%{box-shadow:0 0 0 9px rgba(200,169,110,0)}}
@keyframes hx-rise{from{opacity:0;transform:translateY(.3em)}}
@keyframes hx-strike{from{transform:scaleX(0)}}
@keyframes hx-reveal{from{clip-path:inset(0 0 100% 0);transform:translateY(.15em)}to{clip-path:inset(-10% -10% -40% -10%);transform:none}}
@keyframes hx-exit{to{opacity:.15;transform:translateY(-8%)}}

@media (max-width:759px){
  .hx-sheet{padding-top:76px}
  .hx-scale,.hx-corners{display:none}
  .hx-pt em,.hx-ruler span:nth-child(2n),.hx-map [data-id="ruh"]{display:none}
  .hx-map{bottom:auto;height:26%}
  .hx-l2{padding-bottom:.9em}
  .hx-dim{bottom:-.8em}
}
`;
