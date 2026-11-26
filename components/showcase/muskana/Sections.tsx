"use client";

// MUSKANA's other sections: hero, shop, close-ups, craft, lookbook, gifting, boutique, contact, FAQ.

import { useState } from "react";
import { EnquiryForm } from "../kit/EnquiryForm";
import { Img } from "../kit/Img";
import { sized } from "@/lib/showcase/media";
import { ALT, CRAFT, DETAILS, FAQ, GRID, IMG, PRODUCTS, aed } from "@/lib/showcase/muskana";
import { useMuskana } from "./state";

export function Hero() {
  const { t, lang } = useMuskana();
  return (
    <section className="mu-hero" aria-labelledby="mu-hero-h">
      <picture className="mu-hero-media">
        <source media="(max-width: 700px)" srcSet={[480, 800, 1200].map((w) => `${sized(IMG.heroTall, w)} ${w}w`).join(", ")} sizes="100vw" />
        <img src={sized(IMG.hero, 1600)} srcSet={[800, 1200, 1600].map((w) => `${sized(IMG.hero, w)} ${w}w`).join(", ") + `, ${IMG.hero} 2720w`} sizes="100vw" alt={ALT.hero[lang]} fetchPriority="high" decoding="async" />
      </picture>
      <div className="mu-hero-copy">
        <h1 id="mu-hero-h">{t.tagline}</h1>
        <p>{t.sub}</p>
        <div className="mu-actions">
          <a href="#layer" className="mu-btn mu-btn-sun">
            {t.build}
          </a>
          <a href="#shop" className="mu-btn mu-btn-line">
            {t.shop}
          </a>
        </div>
      </div>
    </section>
  );
}

export function Shop() {
  const { t, lang, setBag } = useMuskana();
  const [just, setJust] = useState("");
  const add = (id: string) => {
    setBag((b) => (b.some((l) => l.id === id) ? b.map((l) => (l.id === id ? { ...l, qty: Math.min(9, l.qty + 1) } : l)) : [...b, { id, qty: 1 }]));
    setJust(id);
    setTimeout(() => setJust((j) => (j === id ? "" : j)), 1400);
  };
  return (
    <section className="mu-shop" id="shop" aria-labelledby="mu-shop-h">
      <h2 id="mu-shop-h">{t.shopTitle}</h2>
      <ul>
        {PRODUCTS.map((p) => (
          <li key={p.id}>
            <Img src={p.img} alt={p.name[lang]} sizes="(max-width: 700px) 50vw, 25vw" widths={[400, 700]} />
            <h3>{p.name[lang]}</h3>
            <p>
              {p.kind[lang]}
              {p.size !== "—" && `, ${p.size}`}
            </p>
            <div className="mu-buy">
              <span>{aed(p.price, lang)}</span>
              <button type="button" onClick={() => add(p.id)} aria-label={`${t.add}: ${p.name[lang]}`}>
                {just === p.id ? t.added : t.add}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Details() {
  const { t, lang } = useMuskana();
  return (
    <section className="mu-details" aria-labelledby="mu-det-h">
      <h2 id="mu-det-h">{t.detailsTitle}</h2>
      <div>
        {GRID.details.map((src, i) => (
          <figure key={i}>
            <Img src={src} alt="" sizes="(max-width: 700px) 50vw, 25vw" widths={[400, 700]} />
            <figcaption>{DETAILS[i][lang]}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Craft() {
  const { t, lang } = useMuskana();
  return (
    <section className="mu-craft" id="craft" aria-labelledby="mu-craft-h">
      <h2 id="mu-craft-h">{t.craftTitle}</h2>
      <ol>
        {GRID.craft.map((src, i) => (
          <li key={i}>
            <Img src={src} alt={CRAFT[i].name[lang]} sizes="(max-width: 700px) 50vw, 25vw" widths={[400, 700]} />
            <h3>{CRAFT[i].name[lang]}</h3>
            <p>{CRAFT[i].note[lang]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Story({ id, img, alt, title, body, flip }: { id?: string; img: string; alt: string; title: string; body: string; flip?: boolean }) {
  return (
    <section className={`mu-story${flip ? " is-flip" : ""}`} id={id}>
      <Img src={img} alt={alt} sizes="(max-width: 900px) 100vw, 55vw" widths={[700, 1100, 1500]} />
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </section>
  );
}

export function Look() {
  const { t, lang } = useMuskana();
  return <Story img={IMG.lookbook} alt={ALT.lookbook[lang]} title={t.lookTitle} body={t.lookBody} />;
}
export function Gift() {
  const { t, lang } = useMuskana();
  return <Story id="gift" img={IMG.gift} alt={ALT.gift[lang]} title={t.giftTitle} body={t.giftBody} flip />;
}
export function Store() {
  const { t, lang } = useMuskana();
  return <Story id="stores" img={IMG.store} alt={ALT.store[lang]} title={t.storeTitle} body={t.storeBody} />;
}

export function Contact() {
  const { t, lang } = useMuskana();
  return (
    <section className="mu-contact" id="contact" aria-labelledby="mu-contact-h">
      <div>
        <h2 id="mu-contact-h">{t.contactTitle}</h2>
        <p>{t.contactIntro}</p>
      </div>
      <EnquiryForm site="muskana" lang={lang} labels={t.form} prefix="mu" interestOptions={t.interests} />
    </section>
  );
}

export function Faq() {
  const { t, lang } = useMuskana();
  return (
    <section className="mu-faq" id="faq" aria-labelledby="mu-faq-h">
      <h2 id="mu-faq-h">{t.faqTitle}</h2>
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
