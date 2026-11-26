"use client";

// The three scroll scenes that follow the hero, in the reference site's order:
// Maison (images fly past while the collection photograph opens), the story line with an image
// that widens inside the sentence, and the pinned walk through four products.

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { A, MOSAIC, PRODUCTS, SHOWCASE, bySlug, money, type GridCell } from "@/lib/showcase/tifawt";
import { clamp01, useScrollStage } from "../useScrollStage";
import { Arrow, BASE, Img } from "./Chrome";
import { useTifawt } from "./state";
import { cellSrc } from "./cells";

export function CellImg({ c, alt = "", sizes = "30vw", className, style }: { c: GridCell; alt?: string; sizes?: string; className?: string; style?: CSSProperties }) {
  return <Img src={cellSrc(c)} alt={alt} sizes={sizes} widths={[320, 640, 960]} className={className} style={style} />;
}

/* ───────────────────────── Maison: the telescope ───────────────────────── */

export function Maison() {
  const { t, lang } = useTifawt();
  const media = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const tl = useRef<HTMLSpanElement>(null);
  const tr = useRef<HTMLSpanElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const cta = useRef<HTMLAnchorElement>(null);
  // Tiles nearest the centre leave first, like a stagger "from the centre".
  const order = useMemo(() => {
    const d = MOSAIC.map((m, i) => ({ i, d: Math.hypot(m.x + m.w / 2 - 50, m.y - 50) }));
    d.sort((a, b) => a.d - b.d);
    const delay: number[] = [];
    d.forEach((x, k) => (delay[x.i] = (k / (d.length - 1)) * 0.15));
    return delay;
  }, []);

  const { ref } = useScrollStage<HTMLElement>((p) => {
    const e = 0.75;
    const k = clamp01(p / e);
    if (media.current) {
      media.current.style.opacity = String(clamp01(p / 0.08));
      media.current.style.transform = `scale(${(0.9 * k).toFixed(4)})`;
    }
    if (back.current) back.current.style.transform = `scale(${(1 + 0.2 * k).toFixed(4)})`;
    const dir = lang === "ar" ? -1 : 1;
    if (tl.current) tl.current.style.transform = `translate3d(${(-55 * k * dir).toFixed(2)}vw,0,0)`;
    if (tr.current) tr.current.style.transform = `translate3d(${(55 * k * dir).toFixed(2)}vw,0,0)`;
    tiles.current.forEach((el, i) => {
      if (!el) return;
      const kt = clamp01((p - order[i]) / e);
      el.style.transform = `translate3d(0,0,${(kt * 150).toFixed(2)}vh)`;
      el.style.opacity = kt > 0.97 ? "0" : "1";
    });
    if (cta.current) cta.current.style.opacity = String(clamp01((p - 0.55) / 0.2));
  });

  return (
    <section className="tf-maison" id="maison" ref={ref} data-ink="dark">
      <div className="tf-maison-stage">
        <h2 className="tf-maison-title" aria-label="TIFAWT ⵜⵉⴼⴰⵡⵜ">
          <span ref={tl} className="tf-maison-tl" aria-hidden>
            Tifawt
          </span>
          <span ref={tr} className="tf-maison-tr" lang="tzm" aria-hidden>
            ⵜⵉⴼⴰⵡⵜ
          </span>
        </h2>
        <div className="tf-maison-media" ref={media}>
          <div className="tf-maison-back" ref={back}>
            <Img
              src={A.lineup || cellSrc({ src: "mosaicA", cell: 3 })}
              alt={lang === "ar" ? "غابة الأركان في سوس عند أول الضوء" : "The argan forest of the Souss at first light"}
              sizes="90vw"
              widths={[960, 1440, 1600]}
            />
          </div>
        </div>
        <div className="tf-maison-tiles" aria-hidden>
          {MOSAIC.map((m, i) => (
            <div
              key={i}
              ref={(el) => {
                tiles.current[i] = el;
              }}
              className="tf-tile"
              style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}vw`, aspectRatio: String(m.ar) }}
            >
              <CellImg c={m.img} sizes="14vw" />
            </div>
          ))}
        </div>
        <Link href="#collection" ref={cta} className="tf-pill-btn tf-maison-cta">
          {t.discover} <Arrow flip={lang === "ar"} />
        </Link>
      </div>
    </section>
  );
}

/* ───────────────────────── The story line ───────────────────────── */

export function StoryLine() {
  const { t, lang } = useTifawt();
  const pill = useRef<HTMLSpanElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const giant = useRef<HTMLDivElement>(null);
  const sec = useRef<HTMLElement>(null);
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const el = sec.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      // The image inside the sentence widens as the line reaches the middle of the screen.
      const a = clamp01((vh * 0.9 - r.top) / (vh * 0.55));
      if (pill.current) pill.current.style.setProperty("--w", a.toFixed(4));
      copy.current?.querySelectorAll<HTMLElement>("p").forEach((p) => {
        const pr = p.getBoundingClientRect();
        const k = clamp01((vh * 0.92 - pr.top) / (vh * 0.3));
        p.style.opacity = String(k);
        p.style.transform = `translateY(${(1 - k) * 30}px)`;
      });
      const g = giant.current;
      if (g) {
        const gr = g.getBoundingClientRect();
        const chars = g.querySelectorAll<HTMLElement>(".tf-ch");
        chars.forEach((c, i) => {
          const k = clamp01((vh * 0.98 - gr.top) / (vh * 0.45) - i * 0.06);
          c.style.opacity = String(k);
          c.style.transform = `translateY(${(1 - k) * 80}px)`;
        });
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    addEventListener("concept:snap", run);
    kick();
    return () => {
      removeEventListener("scroll", kick);
      removeEventListener("resize", kick);
      removeEventListener("concept:snap", run);
      cancelAnimationFrame(raf);
    };
  }, [lang]);

  const [l1, l2, l3, l4, l5] = t.storyLines;
  return (
    <section className="tf-story" ref={sec} data-ink="light" aria-labelledby="tf-story-h">
      <h2 id="tf-story-h" className="tf-story-type">
        <span className="tf-story-line">{l1}</span>
        <span className="tf-story-line">{l2}</span>
        <span className="tf-story-line tf-story-expand">
          <span>{l3}</span>
          <span className="tf-story-pill" ref={pill} aria-hidden>
            <span className="tf-story-pill-in">
              <Img src={A.pill || cellSrc({ src: "mosaicA", cell: 2 })} alt="" sizes="600px" widths={[640, 960, 1280]} />
            </span>
          </span>
          <span>{l4}</span>
        </span>
        <span className="tf-story-line">{l5}</span>
      </h2>
      <div className="tf-story-copy" ref={copy}>
        {t.storyBody.map((b, i) => (
          <p key={i}>{b}</p>
        ))}
      </div>
      <div className="tf-story-giant" ref={giant} aria-hidden>
        {[...t.storyGiant].map((ch, i) => (
          <span key={i} className="tf-ch">
            {ch}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── The pinned product walk ───────────────────────── */

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, k: number) => {
  const x = hex(a),
    y = hex(b);
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(",")})`;
};

/** Raw progress to slide position: each product holds still for a moment before the next arrives. */
function position(raw: number, n: number) {
  const hold = 0.1;
  const move = (1 - hold * n) / (n - 1);
  let t = raw;
  for (let i = 0; i < n; i++) {
    if (t <= hold) return i;
    t -= hold;
    if (i === n - 1) return i;
    if (t <= move) return i + t / move;
    t -= move;
  }
  return n - 1;
}

export function Showcase() {
  const { t, lang, add } = useTifawt();
  const items = SHOWCASE.map((s) => bySlug(s)!);
  const n = items.length;
  const stage = useRef<HTMLDivElement>(null);
  const trackEl = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const { ref, scrollToProgress } = useScrollStage<HTMLElement>((p) => {
    const pos = position(p, n);
    const w = innerWidth;
    const dir = lang === "ar" ? 1 : -1;
    if (trackEl.current) trackEl.current.style.transform = `translate3d(${(dir * pos * w).toFixed(1)}px,0,0)`;
    const f = Math.floor(pos),
      c = Math.min(f + 1, n - 1),
      k = pos - f;
    if (stage.current) stage.current.style.backgroundColor = mix(items[f].tone, items[c].tone, k);
    stage.current?.querySelectorAll<HTMLElement>(".tf-sc-slide").forEach((el, i) => {
      const dist = i - pos;
      const dn = Math.min(Math.abs(dist), 1);
      // The arch window travels with its slide; the photograph inside slides the other way,
      // and the next window waits closer to the centre, as on the reference site.
      const pull = dist > 0 ? dist * w * 0.5 * dir : 0;
      const b = el.querySelector<HTMLElement>(".tf-sc-bottle");
      if (b) b.style.transform = `translate(-50%,-50%) translate3d(${pull.toFixed(1)}px,0,0) scale(${(1 - dn * 0.12).toFixed(4)})`;
      const inner = el.querySelector<HTMLElement>(".tf-sc-photo");
      if (inner) inner.style.transform = `translate3d(${(-dist * 22 * dir).toFixed(2)}%,0,0) scale(1.14)`;
      const word = el.querySelector<HTMLElement>(".tf-sc-word");
      if (word) word.style.transform = `translate3d(${(-dist * 18 * dir).toFixed(2)}vw,0,0)`;
      const info = el.querySelector<HTMLElement>(".tf-sc-info");
      if (info) {
        info.style.opacity = String(clamp01(1 - dn * 1.8));
        info.style.transform = `translateY(${(dn * 25).toFixed(1)}px)`;
      }
    });
    const a = Math.round(pos);
    if (a !== activeRef.current) {
      activeRef.current = a;
      setActive(a);
    }
  });

  const jump = (i: number) => {
    // Inverse of position(): the middle of product i's hold.
    const hold = 0.1;
    const move = (1 - hold * n) / (n - 1);
    scrollToProgress(i * (hold + move) + hold / 2);
  };

  return (
    <section className="tf-showcase" id="showcase" ref={ref} data-ink="dark" aria-label={t.products}>
      <div className="tf-sc-stage" ref={stage} style={{ backgroundColor: items[0].tone }}>
        <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
          <defs>
            {/* The brand's horseshoe arch, used as the window every product stands in. */}
            <clipPath id="tf-arch" clipPathUnits="objectBoundingBox">
              <path d="M0.06,1 V0.43 C0.06,0.38 0.035,0.35 0.03,0.31 C0.01,0.14 0.24,0 0.5,0 C0.76,0 0.99,0.14 0.97,0.31 C0.965,0.35 0.94,0.38 0.94,0.43 V1 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="tf-sc-track" ref={trackEl}>
          {items.map((p, i) => (
            <article key={p.slug} className="tf-sc-slide" aria-hidden={i !== active}>
              <span className="tf-sc-word" aria-hidden>
                {p.object.en.replace(/^The /, "")}
              </span>
              <div className="tf-sc-info">
                <span className="tf-sc-label">{p.kind[lang]}</span>
                <h3 className="tf-sc-name">{p.name}</h3>
                <span className="tf-sc-price">
                  {money(p.price, lang)} · {p.size}
                </span>
                <span className="tf-sc-actions">
                  <Link href={`${BASE}${p.slug}/`} className="tf-sc-explore" tabIndex={i === active ? 0 : -1}>
                    {t.explore} <Arrow flip={lang === "ar"} />
                  </Link>
                  <button type="button" className="tf-sc-add" onClick={() => add(p.slug)} tabIndex={i === active ? 0 : -1}>
                    {t.add}
                  </button>
                </span>
                <p className="tf-sc-tagline">{p.tagline[lang]}</p>
                <p className="tf-sc-desc">{p.desc[lang]}</p>
              </div>
              <Link href={`${BASE}${p.slug}/`} className="tf-sc-bottle" data-cursor="explore" tabIndex={-1} aria-label={p.name}>
                <span className="tf-sc-arch">
                  <span className="tf-sc-photo">
                    <Img src={p.pack} alt={`${p.name}, ${p.object[lang]}`} sizes="(max-width: 900px) 70vw, 30vw" widths={[480, 800, 1200]} />
                  </span>
                </span>
                <svg className="tf-sc-arch-line" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden>
                  <path d="M0.06,1 V0.43 C0.06,0.38 0.035,0.35 0.03,0.31 C0.01,0.14 0.24,0 0.5,0 C0.76,0 0.99,0.14 0.97,0.31 C0.965,0.35 0.94,0.38 0.94,0.43 V1" vectorEffect="non-scaling-stroke" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
        <div className="tf-sc-counter" aria-live="polite">
          <b>{String(active + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}
        </div>
        <div className="tf-sc-thumbs" role="group" aria-label={t.products}>
          {items.map((p, i) => (
            <button key={p.slug} type="button" className={i === active ? "is-on" : ""} onClick={() => jump(i)} aria-label={p.name} aria-current={i === active}>
              <Img src={p.cut || p.pack} alt="" sizes="64px" widths={[160, 240]} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export const allProducts = PRODUCTS;
