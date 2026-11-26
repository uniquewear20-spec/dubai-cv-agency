"use client";

// The rest of the home page: the three pillars (big words with image pills that open into
// panels), the shop, the objects you can turn, how the oil is made, the rituals, the finder,
// the ingredients, the gift boxes and the questions.

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { A, COFFRETS, FAQ, INGREDIENTS, PILLARS, PROCESS, PRODUCTS, QUIZ, RITUALS, bySlug, money, recommend, type Cat, type Product } from "@/lib/showcase/tifawt";
import { clamp01, useScrollStage } from "../useScrollStage";
import { Arrow, BASE, Img } from "./Chrome";
import { CellImg } from "./Story";
import { useTifawt } from "./state";

/** Adds .is-in once the element scrolls into view (once). */
function useReveal<T extends HTMLElement>(margin = "-12% 0px") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es)
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    const force = () => el.classList.add("is-in");
    addEventListener("concept:snap", force);
    return () => {
      io.disconnect();
      removeEventListener("concept:snap", force);
    };
  }, [margin]);
  return ref;
}

/* ───────────────────────── Pillars ───────────────────────── */

export function Pillars() {
  const { t, lang } = useTifawt();
  const ref = useReveal<HTMLElement>();
  const [open, setOpen] = useState<number | null>(null);
  const panelImg = useRef<HTMLDivElement>(null);
  const from = useRef<DOMRect | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const show = (i: number) => {
    from.current = triggers.current[i]?.getBoundingClientRect() ?? null;
    setOpen(i);
  };
  // The small pill grows into the panel's photograph (a FLIP from where it was clicked).
  useEffect(() => {
    if (open === null) return;
    const el = panelImg.current;
    const a = from.current;
    document.documentElement.classList.add("tf-locked");
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    addEventListener("keydown", esc);
    if (el && a && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const b = el.getBoundingClientRect();
      el.animate(
        [
          { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`, borderRadius: "999px" },
          { transform: "none", borderRadius: "18px" },
        ],
        { duration: 1100, easing: "cubic-bezier(0.76, 0, 0.24, 1)", fill: "both" },
      );
    }
    el?.closest(".tf-pl-panel")?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.documentElement.classList.remove("tf-locked");
      removeEventListener("keydown", esc);
    };
  }, [open]);

  const close = () => {
    const i = open;
    setOpen(null);
    if (i !== null) triggers.current[i]?.focus();
  };

  return (
    <section className="tf-pillars" ref={ref} data-ink="light" aria-label={lang === "ar" ? "ركائز الدار" : "What the house stands on"}>
      <div className="tf-pl-grid">
        {PILLARS.map((pl, i) => {
          const words = lang === "ar" ? pl.ar : pl.words;
          const btn = (
            <button
              type="button"
              className="tf-pl-slot"
              ref={(el) => {
                triggers.current[i] = el;
              }}
              onClick={() => show(i)}
              aria-label={pl.title[lang]}
              data-cursor="explore"
            >
              <CellImg c={pl.img} sizes="260px" />
            </button>
          );
          return (
            <div key={i} className={`tf-pl-row tf-pl-row-${i + 1}`} style={{ "--d": i } as CSSProperties}>
              {i === 1 && btn}
              <span className="tf-pl-word tf-oh">
                <span data-dir={i === 0 ? "top" : i === 1 ? "left" : "bottom"}>{words[0]}</span>
              </span>
              {i === 2 && btn}
              <span className="tf-pl-word tf-oh">
                <span data-dir={i === 0 ? "right" : i === 1 ? "right" : "top"}>{words[1]}</span>
              </span>
              {i === 0 && btn}
            </div>
          );
        })}
      </div>
      {open !== null && (
        <div className="tf-pl-panel" role="dialog" aria-modal="true" aria-label={PILLARS[open].title[lang]}>
          <div className="tf-pl-panel-img" ref={panelImg}>
            <CellImg c={PILLARS[open].img} sizes="50vw" />
          </div>
          <div className="tf-pl-panel-txt">
            <button type="button" className="tf-pl-back" onClick={close}>
              <Arrow flip={lang !== "ar"} /> {t.back}
            </button>
            <span className="tf-pl-num">{open + 1}</span>
            <h3>{PILLARS[open].title[lang]}</h3>
            <p>{PILLARS[open].body[lang]}</p>
            <ul className="tf-pl-meta">
              {PILLARS[open].meta.map((m, k) => (
                <li key={k}>{m[lang]}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

/* ───────────────────────── Collection (shop) ───────────────────────── */

export function ProductCard({ p, sizes = "(max-width: 700px) 50vw, 25vw" }: { p: Product; sizes?: string }) {
  const { t, lang, add } = useTifawt();
  const [ok, setOk] = useState(false);
  return (
    <article className="tf-card">
      <Link href={`${BASE}${p.slug}/`} className="tf-card-media" data-cursor="explore">
        <Img src={p.pack} alt={`${p.name}, ${p.object[lang]}`} sizes={sizes} widths={[400, 640, 960]} className="tf-card-a" />
        <span className="tf-card-b">
          <CellImg c={p.tex} sizes={sizes} />
        </span>
        <span className="tf-card-object">{p.object[lang]}</span>
      </Link>
      <div className="tf-card-body">
        <h3>
          <Link href={`${BASE}${p.slug}/`}>{p.name}</Link>
        </h3>
        <p>
          {p.kind[lang]} · {p.size}
        </p>
        <div className="tf-card-row">
          <span className="tf-price">{money(p.price, lang)}</span>
          <button
            type="button"
            className={`tf-add${ok ? " is-ok" : ""}`}
            onClick={() => {
              add(p.slug);
              setOk(true);
              setTimeout(() => setOk(false), 1600);
            }}
          >
            {ok ? t.added : t.add}
          </button>
        </div>
      </div>
    </article>
  );
}

export function Collection() {
  const { t, lang } = useTifawt();
  const [f, setF] = useState<"all" | Cat>("all");
  const list = PRODUCTS.filter((p) => f === "all" || p.cat.includes(f));
  const ref = useReveal<HTMLElement>();
  return (
    <section className="tf-collection" id="collection" ref={ref} data-ink="dark" aria-labelledby="tf-col-h">
      <header className="tf-col-head">
        <h2 id="tf-col-h" className="tf-display">
          {t.collectionTitle}
        </h2>
        <p className="tf-lead">{t.collectionLead}</p>
        <div className="tf-filters" role="group" aria-label={lang === "ar" ? "تصفية" : "Filter"}>
          {(["all", "face", "hair", "sun", "botanical"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={f === k} className={f === k ? "is-on" : ""} onClick={() => setF(k)}>
              {t.filters[k]}
              <small>{k === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.cat.includes(k)).length}</small>
            </button>
          ))}
        </div>
      </header>
      <div className="tf-grid">
        {list.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── The objects you can turn ───────────────────────── */

export function Atelier() {
  const { t, lang } = useTifawt();
  const [sel, setSel] = useState(0);
  const p = PRODUCTS[sel];
  const stage = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const turn = useRef({ angle: 0, dragging: false, x: 0, v: 0 });
  const ref = useReveal<HTMLElement>();

  useEffect(() => {
    const st = stage.current;
    if (!st) return;
    const s = turn.current;
    s.angle = 0;
    let raf = 0;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const apply = () => {
      const v = vid.current;
      if (v && v.duration) {
        // A turntable clip: the angle maps onto the clip's time.
        const k = ((s.angle % 360) + 360) % 360;
        v.currentTime = (k / 360) * (v.duration - 0.05);
      } else {
        const obj = st.querySelector<HTMLElement>(".tf-at-obj");
        if (obj) obj.style.transform = `rotateY(${Math.max(-28, Math.min(28, s.angle)).toFixed(2)}deg)`;
      }
    };
    const loop = () => {
      if (!s.dragging) {
        s.v *= 0.94;
        s.angle += s.v;
        if (!vid.current?.duration) s.angle *= 0.92; // the still settles back to the front
        if (Math.abs(s.v) < 0.01 && Math.abs(s.angle) < 0.05 && !vid.current?.duration) {
          apply();
          raf = 0;
          return;
        }
      }
      apply();
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const down = (e: PointerEvent) => {
      s.dragging = true;
      s.x = e.clientX;
      s.v = 0;
      st.setPointerCapture(e.pointerId);
      kick();
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.x;
      s.x = e.clientX;
      s.angle += dx * 0.6;
      s.v = dx * 0.6;
    };
    const up = () => {
      s.dragging = false;
      if (reduce) s.v = 0;
      kick();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        s.v = e.key === "ArrowLeft" ? -6 : 6;
        kick();
      }
    };
    st.addEventListener("pointerdown", down);
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
    st.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(raf);
      st.removeEventListener("pointerdown", down);
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      st.removeEventListener("keydown", key);
    };
  }, [sel]);

  return (
    <section className="tf-atelier" ref={ref} data-ink="light" aria-labelledby="tf-at-h">
      <div className="tf-at-copy">
        <h2 id="tf-at-h" className="tf-display">
          {t.atelierTitle}
        </h2>
        <p className="tf-lead">{t.atelierLead}</p>
        <ul className="tf-at-list">
          {PRODUCTS.map((x, i) => (
            <li key={x.slug}>
              <button type="button" className={i === sel ? "is-on" : ""} aria-pressed={i === sel} onClick={() => setSel(i)}>
                <span className="tf-at-n">{x.object[lang]}</span>
                <span className="tf-at-p">{x.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="tf-at-stage" ref={stage} tabIndex={0} role="img" aria-label={`${p.name}, ${p.object[lang]}. ${t.turn}`} data-cursor="drag">
        <div className="tf-at-halo" aria-hidden />
        <div className="tf-at-obj" key={p.slug}>
          {p.video ? (
            <video ref={vid} src={p.video} muted playsInline preload="auto" />
          ) : (
            <Img src={p.cut || p.pack} alt="" sizes="(max-width: 900px) 80vw, 40vw" widths={[640, 960, 1280]} className={p.cut ? "is-cut" : "is-pack"} />
          )}
        </div>
        <span className="tf-at-hint">
          <svg width="40" height="10" viewBox="0 0 40 10" aria-hidden>
            <path d="M4 1L0 5l4 4M36 1l4 4-4 4M0 5h40" stroke="currentColor" fill="none" strokeWidth="1" />
          </svg>
          {t.turn}
        </span>
        <Link href={`${BASE}${p.slug}/`} className="tf-at-link">
          {p.name} · {money(p.price, lang)} <Arrow flip={lang === "ar"} />
        </Link>
      </div>
    </section>
  );
}

/* ───────────────────────── From kernel to bottle ───────────────────────── */

export function Process() {
  const { t, lang } = useTifawt();
  const track = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const { ref } = useScrollStage<HTMLElement>((p) => {
    const tr = track.current;
    if (!tr) return;
    const max = tr.scrollWidth - innerWidth + 64;
    const dir = lang === "ar" ? 1 : -1;
    tr.style.transform = `translate3d(${(dir * p * Math.max(0, max)).toFixed(1)}px,0,0)`;
    if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
  });
  return (
    <section className="tf-process" ref={ref} data-ink="light" aria-labelledby="tf-pr-h" style={{ "--steps": PROCESS.length } as CSSProperties}>
      <div className="tf-pr-stage">
        <header className="tf-pr-head">
          <h2 id="tf-pr-h" className="tf-display">
            {t.processTitle}
          </h2>
          <p className="tf-lead">{t.processLead}</p>
          <span className="tf-pr-bar" aria-hidden>
            <span ref={bar} />
          </span>
        </header>
        <ol className="tf-pr-track" ref={track}>
          {PROCESS.map((s, i) => (
            <li key={i} className="tf-pr-step">
              <div className="tf-pr-img">
                <CellImg c={s.img} sizes="(max-width: 700px) 80vw, 34vw" />
              </div>
              <span className="tf-pr-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.t[lang]}</h3>
              <p>{s.d[lang]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── Rituals ───────────────────────── */

export function Rituals() {
  const { t, lang, add, addMany } = useTifawt();
  const [k, setK] = useState<"dawn" | "night">("dawn");
  const steps = RITUALS[k];
  const total = steps.reduce((s, x) => s + (bySlug(x.slug)?.price ?? 0), 0);
  const ref = useReveal<HTMLElement>();
  return (
    <section className={`tf-rituals is-${k}`} id="rituals" ref={ref} data-ink={k === "night" ? "light" : "dark"} aria-labelledby="tf-ri-h">
      <header className="tf-ri-head">
        <h2 id="tf-ri-h" className="tf-display">
          {t.ritualTitle}
        </h2>
        <p className="tf-lead">{t.ritualLead}</p>
        <div className="tf-ri-switch" role="tablist" aria-label={t.ritualTitle}>
          {(["dawn", "night"] as const).map((x) => (
            <button
              key={x}
              type="button"
              role="tab"
              aria-selected={k === x}
              className={k === x ? "is-on" : ""}
              onClick={() => {
                setK(x);
                dispatchEvent(new Event("tf:ink"));
              }}
            >
              {x === "dawn" ? t.dawn : t.night}
            </button>
          ))}
        </div>
      </header>
      <ol className="tf-ri-steps" role="tabpanel" key={k}>
        {steps.map((s, i) => {
          const p = bySlug(s.slug)!;
          return (
            <li key={s.slug} className="tf-ri-step" style={{ "--i": i } as CSSProperties}>
              <span className="tf-ri-n">{i + 1}</span>
              <Link href={`${BASE}${p.slug}/`} className="tf-ri-img" data-cursor="explore">
                <Img src={p.pack} alt="" sizes="200px" widths={[240, 400]} />
              </Link>
              <div className="tf-ri-txt">
                <h3>{p.name}</h3>
                <p>{s.note[lang]}</p>
                <span className="tf-ri-row">
                  <span>{money(p.price, lang)}</span>
                  <button type="button" onClick={() => add(p.slug)}>
                    + {t.add}
                  </button>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="tf-ri-foot">
        <button type="button" className="tf-btn tf-btn-solid" onClick={() => addMany(steps.map((s) => s.slug))}>
          {t.addRitual} · {money(total, lang)}
        </button>
      </div>
    </section>
  );
}

/* ───────────────────────── Finder ───────────────────────── */

export function Finder() {
  const { t, lang, addMany } = useTifawt();
  const [a, setA] = useState<(string | undefined)[]>([]);
  const step = a.length;
  const done = step >= QUIZ.length;
  const recs = done ? recommend(a).map((s) => bySlug(s)!) : [];
  const ref = useReveal<HTMLElement>();
  return (
    <section className="tf-finder" ref={ref} data-ink="dark" aria-labelledby="tf-fi-h">
      <div className="tf-fi-side">
        <h2 id="tf-fi-h" className="tf-display">
          {t.finderTitle}
        </h2>
        <p className="tf-lead">{t.finderLead}</p>
        <ol className="tf-fi-progress" aria-hidden>
          {QUIZ.map((_, i) => (
            <li key={i} className={i < step ? "is-done" : i === step ? "is-now" : ""} />
          ))}
        </ol>
      </div>
      <div className="tf-fi-main" aria-live="polite">
        {!done ? (
          <fieldset className="tf-fi-q" key={step}>
            <legend>
              <span className="tf-fi-n">
                {step + 1} / {QUIZ.length}
              </span>
              {QUIZ[step].q[lang]}
            </legend>
            <div className="tf-fi-opts">
              {QUIZ[step].options.map((o) => (
                <button key={o.id} type="button" onClick={() => setA((x) => [...x, o.id])}>
                  {o.l[lang]}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button type="button" className="tf-fi-back" onClick={() => setA((x) => x.slice(0, -1))}>
                {t.back}
              </button>
            )}
          </fieldset>
        ) : (
          <div className="tf-fi-result">
            <h3>{t.finderResult}</h3>
            <ul>
              {recs.map((p) => (
                <li key={p.slug}>
                  <Link href={`${BASE}${p.slug}/`}>
                    <Img src={p.pack} alt="" sizes="160px" widths={[240, 400]} />
                    <b>{p.name}</b>
                    <small>{money(p.price, lang)}</small>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="tf-fi-actions">
              <button type="button" className="tf-btn tf-btn-solid" onClick={() => addMany(recs.map((p) => p.slug))}>
                {t.addAll}
              </button>
              <button type="button" className="tf-btn" onClick={() => setA([])}>
                {t.finderAgain}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── Ingredients ───────────────────────── */

export function Ingredients() {
  const { t, lang } = useTifawt();
  const [open, setOpen] = useState(0);
  const list = INGREDIENTS.filter((i) => i.id !== "cedar");
  const ref = useReveal<HTMLElement>();
  return (
    <section className="tf-ingredients" ref={ref} data-ink="light" aria-labelledby="tf-in-h">
      <h2 id="tf-in-h" className="tf-display">
        {t.ingredientsTitle}
      </h2>
      <div className="tf-in-row">
        {list.map((g, i) => (
          <article key={g.id} className={`tf-in-panel${open === i ? " is-open" : ""}`} onMouseEnter={() => setOpen(i)}>
            <button type="button" className="tf-in-btn" aria-expanded={open === i} onClick={() => setOpen(i)} onFocus={() => setOpen(i)}>
              <span className="tf-in-name">{g.name[lang]}</span>
              <span className="tf-in-latin">{g.latin}</span>
            </button>
            <div className="tf-in-img" aria-hidden>
              <CellImg c={g.img} sizes="(max-width: 900px) 90vw, 40vw" />
            </div>
            <div className="tf-in-body">
              <span className="tf-in-origin">{g.origin[lang]}</span>
              <p>{g.body[lang]}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Coffrets ───────────────────────── */

export function Coffrets() {
  const { t, lang, add } = useTifawt();
  const ref = useReveal<HTMLElement>();
  return (
    <section className="tf-coffrets" ref={ref} data-ink="dark" aria-labelledby="tf-co-h">
      <header className="tf-col-head">
        <h2 id="tf-co-h" className="tf-display">
          {t.coffretsTitle}
        </h2>
        <p className="tf-lead">{t.coffretsLead}</p>
      </header>
      <div className="tf-co-grid">
        {COFFRETS.map((c, i) => {
          const sum = c.items.reduce((s, x) => s + (bySlug(x)?.price ?? 0), 0);
          return (
            <article key={c.id} className="tf-co-card" style={{ "--i": i } as CSSProperties}>
              <div className="tf-co-img">
                {A.gift ? (
                  <Img src={A.gift} alt="" sizes="(max-width: 900px) 90vw, 33vw" style={{ objectPosition: c.focus }} />
                ) : (
                  <div className="tf-co-trio">
                    {c.items.map((slug, k) => {
                      const item = bySlug(slug);
                      return item ? (
                        <span key={slug} className="tf-co-shot" style={{ "--k": k - 1 } as CSSProperties}>
                          <Img src={item.pack} alt="" sizes="(max-width: 900px) 45vw, 16vw" widths={[320, 480, 640]} />
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              <h3>{c.name}</h3>
              <p>{c.line[lang]}</p>
              <p className="tf-co-items">
                {t.contains}: {c.items.map((x) => bySlug(x)?.name).join(", ")}
              </p>
              <div className="tf-card-row">
                <span className="tf-price">
                  {money(c.price, lang)} <s>{money(sum, lang)}</s>
                </span>
                <button type="button" className="tf-add" onClick={() => add(c.id)}>
                  {t.add}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────────────────── Questions ───────────────────────── */

export function Faq() {
  const { t, lang } = useTifawt();
  return (
    <section className="tf-faq" data-ink="dark" aria-labelledby="tf-fq-h">
      <h2 id="tf-fq-h" className="tf-display">
        {t.faqTitle}
      </h2>
      <div className="tf-fq-list">
        {FAQ.map((f, i) => (
          <details key={i} name="tf-faq" open={i === 0}>
            <summary>{f.q[lang]}</summary>
            <p>{f.a[lang]}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export const _clamp = clamp01;
