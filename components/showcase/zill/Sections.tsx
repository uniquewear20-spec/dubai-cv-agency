"use client";

// ZILL's quieter sections around the two drawings: the hero (with the sun over Dubai right now),
// the four principles, the card model, the work index and its project sheet, materials, process,
// details, contact and questions.

import { useCallback, useEffect, useState } from "react";
import { EnquiryForm } from "../kit/EnquiryForm";
import { Img } from "../kit/Img";
import { useDialog } from "../kit/hooks";
import { sized } from "@/lib/showcase/media";
import { ALT, FAQ, GRID, GRID_ALT, IMG, MATERIALS, PRINCIPLES, PROCESS, PROJECTS, compass, dubaiNow, token } from "@/lib/showcase/zill";
import { useZill } from "./state";

/* ───────── hero ───────── */

function SunGlyph() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden className="zl-sunglyph">
      <circle cx="10" cy="10" r="4" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        const r = (n: number) => Math.round(n * 100) / 100;
        return <line key={i} x1={r(10 + 6.2 * Math.cos(a))} y1={r(10 + 6.2 * Math.sin(a))} x2={r(10 + 8.6 * Math.cos(a))} y2={r(10 + 8.6 * Math.sin(a))} />;
      })}
    </svg>
  );
}

export function Hero() {
  const { t, lang } = useZill();
  const [now, setNow] = useState<ReturnType<typeof dubaiNow> | null>(null);
  useEffect(() => {
    const tick = () => setNow(dubaiNow());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="zl-hero" aria-labelledby="zl-hero-h">
      <div className="zl-hero-media">
        <picture>
          <source media="(max-width: 700px)" srcSet={[480, 800, 1200].map((w) => `${sized(IMG.courtyard, w)} ${w}w`).join(", ")} sizes="100vw" />
          <img
            src={sized(IMG.hero, 1600)}
            srcSet={[800, 1200, 1600].map((w) => `${sized(IMG.hero, w)} ${w}w`).join(", ") + `, ${IMG.hero} 2720w`}
            sizes="100vw"
            alt={ALT.hero[lang]}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <span className="zl-hero-shade" aria-hidden />
      </div>
      <div className="zl-hero-copy">
        <h1 id="zl-hero-h">{t.tagline}</h1>
        <p className="zl-hero-sub">{t.sub}</p>
        <div className="zl-hero-actions">
          <a href="#work" className="zl-btn zl-btn-sun">
            {t.seeWork}
          </a>
          <a href="#brief" className="zl-btn zl-btn-line is-light">
            {t.startBrief}
          </a>
        </div>
      </div>
      <p className="zl-hero-now" aria-live="off">
        {now && (
          <>
            <SunGlyph />
            <span>{now.alt > 0 ? t.nowLine(now.clock, Math.round(now.alt), compass(now.az, lang)) : t.nightNow(now.clock)}</span>
            <a href="#sun">{t.nowLink}</a>
          </>
        )}
      </p>
    </section>
  );
}

/* ───────── approach ───────── */

function Glyph({ id }: { id: (typeof PRINCIPLES)[number]["id"] }) {
  // drawn as small sections, the way the studio would sketch each idea
  switch (id) {
    case "shade":
      return (
        <svg viewBox="0 0 64 64" aria-hidden className="zl-glyph">
          <circle cx="12" cy="12" r="5" className="sun" />
          <path d="M8 26H56M40 26V56M8 56H56" />
          <path d="M16 18L40 42" className="ray" />
          <path d="M40 30L54 30M40 36L54 36M40 42L54 42M40 48L54 48" className="hatch" />
        </svg>
      );
    case "mass":
      return (
        <svg viewBox="0 0 64 64" aria-hidden className="zl-glyph">
          <rect x="24" y="8" width="16" height="48" />
          <path d="M26 14H38M26 22H38M26 30H38M26 38H38M26 46H38" className="hatch" />
          <path d="M6 22H18M14 18L18 22L14 26" className="ray" />
          <path d="M46 42H58M50 38L46 42L50 46" />
        </svg>
      );
    case "air":
      return (
        <svg viewBox="0 0 64 64" aria-hidden className="zl-glyph">
          <path d="M22 8H42V56M22 8V30M10 30H22M10 56H54" />
          <path d="M28 14V40M28 40L24 36M28 40L32 36" className="ray" />
          <path d="M36 22V46H14" />
          <path d="M18 42L14 46L18 50" />
        </svg>
      );
    case "water":
      return (
        <svg viewBox="0 0 64 64" aria-hidden className="zl-glyph">
          <path d="M6 30H20V44H44V30H58" />
          <path d="M22 36C26 33 30 39 34 36S40 33 42 36" className="ray" />
          <path d="M26 24C26 20 30 20 30 16M34 24C34 20 38 20 38 16" />
        </svg>
      );
  }
}

export function Approach() {
  const { t, lang } = useZill();
  return (
    <section className="zl-approach" id="approach" aria-labelledby="zl-approach-h">
      <h2 id="zl-approach-h">{t.approachTitle}</h2>
      <ul className="zl-principles">
        {PRINCIPLES.map((p) => (
          <li key={p.id}>
            <Glyph id={p.id} />
            <h3>{p.name[lang]}</h3>
            <p>{p.body[lang]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────── the card model, and the screen in the sun ───────── */

export function Model() {
  const { t, lang } = useZill();
  return (
    <section className="zl-model" aria-labelledby="zl-model-h">
      <figure className="zl-model-fig">
        <Img src={IMG.model} alt={ALT.model[lang]} sizes="(max-width: 900px) 100vw, 60vw" widths={[600, 900, 1200, 1600]} />
      </figure>
      <div className="zl-model-copy">
        <h2 id="zl-model-h">{t.modelTitle}</h2>
        <p>{t.modelBody}</p>
      </div>
    </section>
  );
}

export function ScreenBand() {
  const { t, lang } = useZill();
  return (
    <figure className="zl-band">
      <Img src={IMG.shadow} alt={ALT.shadow[lang]} widths={[800, 1200, 1600, 2000]} />
      <figcaption>{t.shadowCaption}</figcaption>
    </figure>
  );
}

/* ───────── work ───────── */

export function Work() {
  const { t, lang, open } = useZill();
  const [active, setActive] = useState(0);
  return (
    <section className="zl-work" id="work" aria-labelledby="zl-work-h">
      <header className="zl-work-head">
        <h2 id="zl-work-h">{t.workTitle}</h2>
        <p>{t.workIntro}</p>
      </header>
      <div className="zl-work-grid">
        <div className="zl-work-index" role="list">
          <div className="zl-work-cols" aria-hidden>
            <span>{t.colProject}</span>
            <span>{t.colPlace}</span>
            <span>{t.colKind}</span>
            <span>{t.area}</span>
          </div>
          {PROJECTS.map((p, i) => (
            <div role="listitem" key={p.slug}>
              <button
                type="button"
                className={`zl-work-row${i === active ? " is-on" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => open({ project: p.slug })}
                data-cursor="open"
              >
                <span className="zl-work-thumb">
                  <Img src={IMG[p.img as keyof typeof IMG]} alt="" sizes="100vw" widths={[480, 800]} />
                </span>
                <span className="zl-work-name">{p.name[lang]}</span>
                <span className="zl-work-place">{p.place[lang]}</span>
                <span className="zl-work-kind">{p.kind[lang]}</span>
                <span className="zl-work-area">{p.area.replace("m²", t.m2)}</span>
                <span className="zl-sr">{t.open}</span>
              </button>
            </div>
          ))}
        </div>
        <div className="zl-work-preview" aria-hidden>
          {PROJECTS.map((p, i) => (
            <Img key={p.slug} src={IMG[p.img as keyof typeof IMG]} alt="" className={i === active ? "is-on" : ""} sizes="(max-width: 900px) 100vw, 55vw" widths={[800, 1200, 1600]} />
          ))}
        </div>
      </div>
      <ProjectSheet />
    </section>
  );
}

function ProjectSheet() {
  const { t, lang, overlay, open } = useZill();
  const slug = overlay && typeof overlay === "object" ? overlay.project : null;
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  const close = useCallback(() => open(null), [open]);
  const box = useDialog(i >= 0, close);
  useEffect(() => {
    box.current?.querySelector(".zl-proj-body")?.scrollTo({ top: 0 });
  }, [i, box]);
  if (i < 0) return null;
  const p = PROJECTS[i];
  const go = (d: number) => open({ project: PROJECTS[(i + d + PROJECTS.length) % PROJECTS.length].slug });
  return (
    <div className="zl-proj" role="dialog" aria-modal="true" aria-labelledby="zl-proj-h">
      <button type="button" className="zl-scrim" aria-label={t.close} tabIndex={-1} onClick={close} />
      <div className="zl-proj-box" ref={box}>
        <div className="zl-proj-top">
          <button type="button" className="zl-close" onClick={close} data-autofocus>
            {t.close}
          </button>
          <div className="zl-proj-nav">
            <button type="button" onClick={() => go(-1)}>
              {t.prevProject}
            </button>
            <button type="button" onClick={() => go(1)}>
              {t.nextProject}
            </button>
          </div>
        </div>
        <div className="zl-proj-body">
          <p className="zl-proj-meta">
            {p.kind[lang]}, {p.place[lang]}
          </p>
          <h2 id="zl-proj-h">{p.name[lang]}</h2>
          <div className="zl-proj-gallery">
            {p.gallery.map((g) => {
              const im = token(g);
              return (
                <figure key={g}>
                  <Img src={im.src} alt={im.alt[lang]} sizes="(max-width: 900px) 90vw, 46vw" widths={[600, 900, 1200]} />
                </figure>
              );
            })}
          </div>
          <p className="zl-proj-text">{p.body[lang]}</p>
          <dl className="zl-proj-facts">
            <div>
              <dt>{t.area}</dt>
              <dd>{p.area.replace("m²", t.m2)}</dd>
            </div>
            <div>
              <dt>{t.colPlace}</dt>
              <dd>{p.place[lang]}</dd>
            </div>
          </dl>
          <h3>{t.moves}</h3>
          <ul className="zl-proj-moves">
            {p.moves.map((m) => (
              <li key={m.en}>{m[lang]}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ───────── materials, process, details ───────── */

export function Materials() {
  const { t, lang } = useZill();
  return (
    <section className="zl-materials" id="materials" aria-labelledby="zl-mat-h">
      <header className="zl-sec-head">
        <h2 id="zl-mat-h">{t.materialsTitle}</h2>
        <p>{t.materialsIntro}</p>
      </header>
      <ul className="zl-mat-list">
        {MATERIALS.map((m, i) => (
          <li key={m.name.en}>
            <Img src={GRID.materials[i]} alt={GRID_ALT.materials[i][lang]} sizes="(max-width: 700px) 50vw, 25vw" widths={[300, 500, 700]} />
            <h3>{m.name[lang]}</h3>
            <p>{m.body[lang]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Process() {
  const { t, lang } = useZill();
  return (
    <section className="zl-process" aria-labelledby="zl-proc-h">
      <header className="zl-sec-head">
        <h2 id="zl-proc-h">{t.processTitle}</h2>
        <p>{t.processIntro}</p>
      </header>
      <ol className="zl-steps">
        {PROCESS.map((s, i) => (
          <li key={s.name.en}>
            <Img src={GRID.process[i]} alt={GRID_ALT.process[i][lang]} sizes="(max-width: 700px) 100vw, 25vw" widths={[300, 500, 700]} />
            <span className="zl-step-n" aria-hidden>
              {i + 1}
            </span>
            <h3>{s.name[lang]}</h3>
            <p>{s.body[lang]}</p>
            <p className="zl-step-weeks">{s.weeks[lang]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Details() {
  const { t, lang } = useZill();
  return (
    <section className="zl-details" aria-labelledby="zl-det-h">
      <h2 id="zl-det-h" className="zl-details-h">
        {t.detailsTitle}
      </h2>
      <div className="zl-details-row">
        {GRID.details.map((src, i) => (
          <figure key={i}>
            <Img src={src} alt="" sizes="(max-width: 700px) 80vw, 25vw" widths={[400, 600, 800]} />
            <figcaption>{GRID_ALT.details[i][lang]}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ───────── contact and questions ───────── */

export function Contact() {
  const { t, lang } = useZill();
  return (
    <section className="zl-contact" id="contact" aria-labelledby="zl-contact-h">
      <div className="zl-contact-copy">
        <h2 id="zl-contact-h">{t.contactTitle}</h2>
        <p>{t.contactIntro}</p>
      </div>
      <EnquiryForm site="zill" lang={lang} labels={t.form} prefix="zl" interestOptions={t.interests} />
    </section>
  );
}

export function Faq() {
  const { t, lang } = useZill();
  return (
    <section className="zl-faq" id="faq" aria-labelledby="zl-faq-h">
      <h2 id="zl-faq-h">{t.faqTitle}</h2>
      <div className="zl-faq-list">
        {FAQ.map((f, i) => (
          <details key={f.q.en} open={i === 0}>
            <summary>{f.q[lang]}</summary>
            <p>{f.a[lang]}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
