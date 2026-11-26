"use client";

// A TIFAWT product page, following the reference site's product page: a large opening image,
// benefits, ingredients you scroll sideways through, texture, how to use, why it exists, the rest
// of the ritual, and a purchase bar that stays at the bottom of the screen.

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { INGREDIENTS, OBJECT_NOTES, bySlug, money, type Product } from "@/lib/showcase/tifawt";
import { useScrollStage } from "../useScrollStage";
import { Arrow, BASE, Enquiry, Footer, Img, Mark, Shell } from "./Chrome";
import { ProductCard } from "./Sections";
import { CellImg } from "./Story";
import { TifawtProvider, useTifawt } from "./state";

function BuyBar({ p }: { p: Product }) {
  const { t, lang, add, subtotal } = useTifawt();
  const [qty, setQty] = useState(1);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(scrollY > innerHeight * 0.6 && scrollY < document.documentElement.scrollHeight - innerHeight * 1.6);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  const left = Math.max(0, 450 - subtotal);
  return (
    <div className={`tf-buybar${show ? " is-on" : ""}`} role="region" aria-label={p.name}>
      <span className="tf-bb-name">
        <b>{p.name}</b>
        <small>
          {p.size} · {left > 0 ? t.shippingLeft(money(left, lang)) : t.shippingFree}
        </small>
      </span>
      <span className="tf-qty">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="−">
          −
        </button>
        <output>{qty}</output>
        <button type="button" onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="+">
          +
        </button>
      </span>
      <span className="tf-bb-price">{money(p.price * qty, lang)}</span>
      <button type="button" className="tf-btn tf-btn-solid" onClick={() => add(p.slug, qty)}>
        {t.add}
      </button>
    </div>
  );
}

function Benefits({ p }: { p: Product }) {
  const { t, lang } = useTifawt();
  const [open, setOpen] = useState(0);
  return (
    <section className="tf-pdp-benefits" data-ink="dark" aria-labelledby="tf-pb-h">
      <div className="tf-pdp-ben-img">
        <Img src={p.pack} alt={`${p.name}, ${p.object[lang]}`} sizes="(max-width: 900px) 90vw, 40vw" widths={[640, 960, 1280]} />
      </div>
      <div className="tf-pdp-ben-txt">
        <h2 id="tf-pb-h" className="tf-kicker">
          {t.benefits}
        </h2>
        <ul>
          {p.benefits.map((b, i) => (
            <li key={i} className={open === i ? "is-open" : ""}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{b.t[lang]}</span>
                <i aria-hidden>+</i>
              </button>
              <p>{b.d[lang]}</p>
            </li>
          ))}
        </ul>
        <p className="tf-pdp-object">
          <b>{p.object[lang]}.</b> {OBJECT_NOTES[p.slug]?.[lang]}
        </p>
      </div>
    </section>
  );
}

function KeyIngredients({ p }: { p: Product }) {
  const { t, lang } = useTifawt();
  const list = p.ingredients.map((id) => INGREDIENTS.find((i) => i.id === id)!).filter(Boolean);
  const track = useRef<HTMLDivElement>(null);
  const { ref } = useScrollStage<HTMLElement>((pr) => {
    const tr = track.current;
    if (!tr) return;
    const max = Math.max(0, tr.scrollWidth - innerWidth + 48);
    tr.style.transform = `translate3d(${(lang === "ar" ? 1 : -1) * pr * max}px,0,0)`;
  });
  return (
    <section className="tf-pdp-ing" ref={ref} data-ink="light" style={{ "--n": list.length } as CSSProperties} aria-labelledby="tf-pi-h">
      <div className="tf-pdp-ing-stage">
        <h2 id="tf-pi-h" className="tf-display">
          {t.keyIngredients}
        </h2>
        <div className="tf-pdp-ing-track" ref={track}>
          {list.map((g) => (
            <article key={g.id} className="tf-pdp-ing-card">
              <div className="tf-pdp-ing-img">
                <CellImg c={g.img} sizes="(max-width: 700px) 80vw, 30vw" />
              </div>
              <h3>{g.name[lang]}</h3>
              <span>{g.latin} · {g.origin[lang]}</span>
              <p>{g.body[lang]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ring({ p }: { p: Product }) {
  const { lang } = useTifawt();
  const label = `TIFAWT · ⵜⵉⴼⴰⵡⵜ · ${p.name.toUpperCase()} · `;
  return (
    <section className="tf-ring" data-ink="dark" aria-hidden>
      <div className="tf-ring-in">
        <svg viewBox="0 0 400 400" className="tf-ring-svg">
          <defs>
            <path id="tf-ring-path" d="M200,200 m-170,0 a170,170 0 1,1 340,0 a170,170 0 1,1 -340,0" />
          </defs>
          <text>
            <textPath href="#tf-ring-path">{label + label}</textPath>
          </text>
        </svg>
        <div className="tf-ring-obj">
          <Img src={p.cut || p.pack} alt="" sizes="320px" widths={[480, 640]} className={p.cut ? "is-cut" : "is-pack"} />
        </div>
      </div>
      <span className="tf-sr">{lang}</span>
    </section>
  );
}

function PdpBody({ p }: { p: Product }) {
  const { t, lang, add } = useTifawt();
  const pairs = p.pairs.map((s) => bySlug(s)!).filter(Boolean);
  const hero = p.env || p.pack;
  return (
    <>
      <section className="tf-pdp-hero" data-ink={p.tone === "#5a5348" || p.tone === "#7d5a4a" ? "light" : "dark"} style={{ "--tone": p.tone } as CSSProperties}>
        <div className="tf-pdp-hero-img">
          <Img src={hero} alt={`${p.name}, ${p.object[lang]}`} sizes="(max-width: 900px) 100vw, 55vw" widths={[800, 1200, 1600]} eager />
        </div>
        <div className="tf-pdp-hero-txt">
          <nav className="tf-crumbs" aria-label="Breadcrumb">
            <Link href={`${BASE}#collection`}>{t.products}</Link>
            <span aria-hidden>/</span>
            <span aria-current="page">{p.name}</span>
          </nav>
          <span className="tf-kicker">{p.kind[lang]}</span>
          <h1 className="tf-pdp-name">{p.name}</h1>
          <p className="tf-pdp-tag">{p.tagline[lang]}</p>
          <p className="tf-pdp-desc">{p.desc[lang]}</p>
          <div className="tf-pdp-buy">
            <span className="tf-price">{money(p.price, lang)}</span>
            <span className="tf-pdp-size">{p.size}</span>
            <button type="button" className="tf-btn tf-btn-solid" onClick={() => add(p.slug)}>
              {t.add}
            </button>
          </div>
        </div>
      </section>
      <Benefits p={p} />
      <KeyIngredients p={p} />
      <section className="tf-pdp-texture" data-ink="dark" aria-labelledby="tf-pt-h">
        <div className="tf-pdp-tex-img">
          <CellImg c={p.tex} sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
        <div className="tf-pdp-tex-txt">
          <h2 id="tf-pt-h" className="tf-kicker">
            {t.textureTitle}
          </h2>
          <p className="tf-pdp-big">{p.texture[lang]}</p>
          <h2 className="tf-kicker">{t.howTo}</h2>
          <ol className="tf-pdp-how">
            {p.howTo.map((h, i) => (
              <li key={i}>
                <span>{i + 1}</span>
                {h[lang]}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="tf-pdp-why" data-ink="light" style={{ "--tone": p.tone } as CSSProperties} aria-labelledby="tf-pw-h">
        <Mark size={40} />
        <h2 id="tf-pw-h" className="tf-kicker">
          {t.why}
        </h2>
        <p className="tf-pdp-quote">{p.why[lang]}</p>
      </section>
      <section className="tf-pdp-pairs" data-ink="dark" aria-labelledby="tf-pp-h">
        <h2 id="tf-pp-h" className="tf-display">
          {t.pairs}
        </h2>
        <div className="tf-grid tf-grid-3">
          {pairs.map((x) => (
            <ProductCard key={x.slug} p={x} sizes="(max-width: 700px) 50vw, 30vw" />
          ))}
        </div>
      </section>
      <Ring p={p} />
      <Link href={`${BASE}#collection`} className="tf-prefooter" data-ink="light">
        <span className="tf-kicker">{t.discover}</span>
        <span className="tf-prefooter-word">
          {t.line} <Arrow flip={lang === "ar"} />
        </span>
      </Link>
      <Enquiry />
      <Footer />
      <BuyBar p={p} />
    </>
  );
}

export default function ProductPage({ slug }: { slug: string }) {
  const p = bySlug(slug);
  if (!p) return null;
  return (
    <TifawtProvider>
      <Shell>
        <PdpBody p={p} />
      </Shell>
    </TifawtProvider>
  );
}
