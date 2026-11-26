"use client";

// ORIEL 88's sections around the floor picker.

import { EnquiryForm } from "../kit/EnquiryForm";
import { Img } from "../kit/Img";
import { sized } from "@/lib/showcase/media";
import { ALT, FAQ, GRID, GRID_TEXT, IMG, TRAVEL } from "@/lib/showcase/oriel";
import { useOriel } from "./state";

export function Hero() {
  const { t, lang } = useOriel();
  return (
    <section className="or-hero" aria-labelledby="or-hero-h">
      <picture className="or-hero-media">
        <source media="(max-width: 700px)" srcSet={[480, 800, 1200].map((w) => `${sized(IMG.heroTall, w)} ${w}w`).join(", ")} sizes="100vw" />
        <img
          src={sized(IMG.hero, 1600)}
          srcSet={[800, 1200, 1600].map((w) => `${sized(IMG.hero, w)} ${w}w`).join(", ") + `, ${IMG.hero} 2720w`}
          sizes="100vw"
          alt={ALT.hero[lang]}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="or-hero-copy">
        <h1 id="or-hero-h">{t.tagline}</h1>
        <p>{t.sub}</p>
        <div className="or-actions">
          <a href="#homes" className="or-btn or-btn-bronze">
            {t.findHome}
          </a>
          <a href="#contact" className="or-btn or-btn-line">
            {t.register}
          </a>
        </div>
      </div>
      <dl className="or-facts" id="tower">
        {t.facts.map((f) => (
          <div key={f.k}>
            <dt>{f.k}</dt>
            <dd>{f.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Aerial() {
  const { lang, t } = useOriel();
  return (
    <figure className="or-aerial">
      <Img src={IMG.aerial} alt={ALT.aerial[lang]} widths={[800, 1200, 1600, 2000]} />
      <figcaption>{t.areaIntro}</figcaption>
    </figure>
  );
}

function Grid({ id, g, title, intro, wide }: { id?: string; g: keyof typeof GRID; title: string; intro?: string; wide?: boolean }) {
  const { lang } = useOriel();
  return (
    <section className={`or-grid${wide ? " is-wide" : ""}`} id={id} aria-labelledby={`or-${g}-h`}>
      <header className="or-head">
        <h2 id={`or-${g}-h`}>{title}</h2>
        {intro && <p>{intro}</p>}
      </header>
      <ul>
        {GRID[g].map((src, i) => (
          <li key={i}>
            <Img src={src} alt={GRID_TEXT[g][i].name[lang]} sizes={wide ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 50vw, 25vw"} widths={[400, 700, 1000]} />
            <h3>{GRID_TEXT[g][i].name[lang]}</h3>
            <p>{GRID_TEXT[g][i].note[lang]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Interiors() {
  const { t } = useOriel();
  return <Grid id="interiors" g="interiors" title={t.interiorsTitle} intro={t.interiorsIntro} wide />;
}

export function Twilight() {
  const { t, lang } = useOriel();
  return (
    <figure className="or-twilight">
      <Img src={IMG.twilight} alt={ALT.twilight[lang]} widths={[800, 1200, 1600, 2000]} />
      <figcaption>{t.twilightLine}</figcaption>
    </figure>
  );
}

export function Amenities() {
  const { t } = useOriel();
  return <Grid id="amenities" g="amenities" title={t.amenitiesTitle} />;
}

export function Materials() {
  const { t } = useOriel();
  return <Grid g="materials" title={t.materialsTitle} />;
}

export function Living() {
  const { t, lang } = useOriel();
  return (
    <section className="or-living" aria-labelledby="or-living-h">
      <Img src={IMG.living} alt={ALT.living[lang]} sizes="(max-width: 900px) 100vw, 60vw" widths={[800, 1200, 1600]} />
      <div>
        <h2 id="or-living-h">{t.livingTitle}</h2>
        <p>{t.livingBody}</p>
      </div>
    </section>
  );
}

export function Area() {
  const { t, lang } = useOriel();
  return (
    <section className="or-area" id="area" aria-labelledby="or-area-h">
      <header className="or-head">
        <h2 id="or-area-h">{t.areaTitle}</h2>
        <p>{t.areaIntro}</p>
      </header>
      <ol className="or-travel">
        {TRAVEL.map((x) => (
          <li key={x.to.en}>
            <span className="or-travel-min">
              {x.min}
              <small>{t.minutes}</small>
            </span>
            <span>
              {x.to[lang]}
              <small>{x.by[lang]}</small>
            </span>
          </li>
        ))}
      </ol>
      <ul className="or-area-photos">
        {GRID.area.map((src, i) => (
          <li key={i}>
            <Img src={src} alt={GRID_TEXT.area[i].name[lang]} sizes="(max-width: 700px) 100vw, 50vw" widths={[500, 800, 1100]} />
            <p>
              <strong>{GRID_TEXT.area[i].name[lang]}</strong> {GRID_TEXT.area[i].note[lang]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Contact() {
  const { t, lang } = useOriel();
  return (
    <section className="or-contact" id="contact" aria-labelledby="or-contact-h">
      <div>
        <h2 id="or-contact-h">{t.contactTitle}</h2>
        <p>{t.contactIntro}</p>
      </div>
      <EnquiryForm site="oriel-88" lang={lang} labels={t.form} prefix="or" interestOptions={t.interests} />
    </section>
  );
}

export function Faq() {
  const { t, lang } = useOriel();
  return (
    <section className="or-faq" id="faq" aria-labelledby="or-faq-h">
      <h2 id="or-faq-h">{t.faqTitle}</h2>
      <div>
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
