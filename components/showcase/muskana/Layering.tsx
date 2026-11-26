"use client";

// The signature: the layering builder. One note per layer; a faceted bottle fills from the base up
// in the order the oils are worn, and the blend gets its name, its strength and how long it lasts.

import { BLEND_PRICE, LAYERS, aed, blendFacts } from "@/lib/showcase/muskana";
import { useMuskana } from "./state";

// a faceted bottle in outline; the liquid is clipped to it
const BOTTLE = "M70 70 L130 70 L150 96 L156 230 L136 262 L64 262 L44 230 L50 96 Z";

export function Layering() {
  const { t, lang, blend, setBlend, setBag, open } = useMuskana();
  const f = blendFacts(blend);
  const [base, heart, top] = f.notes;
  const name = t.blendName(top.word[lang], heart.word[lang], base.word[lang]);
  // heights in the bottle: base 50%, heart 30%, top 20% of the liquid
  const Y0 = 258;
  const H = 168;
  const bands = [
    { c: base.color, h: H * 0.5 },
    { c: heart.color, h: H * 0.3 },
    { c: top.color, h: H * 0.2 },
  ];
  let y = Y0;
  const addSet = () => {
    const id = `blend:${blend.base}.${blend.heart}.${blend.top}`;
    setBag((b) => (b.some((l) => l.id === id) ? b.map((l) => (l.id === id ? { ...l, qty: Math.min(9, l.qty + 1) } : l)) : [...b, { id, qty: 1 }]));
    open("bag");
  };
  return (
    <section className="mu-layer" id="layer" aria-labelledby="mu-layer-h">
      <header className="mu-head">
        <h2 id="mu-layer-h">{t.layerTitle}</h2>
        <p>{t.layerIntro}</p>
      </header>
      <div className="mu-layer-grid">
        <div className="mu-pickers">
          {LAYERS.map((layer) => (
            <fieldset key={layer.id} className="mu-pick">
              <legend>{layer.name[lang]}</legend>
              <div>
                {layer.notes.map((n) => (
                  <label key={n.id} className={blend[layer.id] === n.id ? "is-on" : ""}>
                    <input type="radio" name={`mu-${layer.id}`} checked={blend[layer.id] === n.id} onChange={() => setBlend((b) => ({ ...b, [layer.id]: n.id }))} />
                    <i style={{ background: n.color }} aria-hidden />
                    {n.name[lang]}
                  </label>
                ))}
              </div>
              <p>{layer.hint[lang]}</p>
            </fieldset>
          ))}
        </div>
        <div className="mu-vessel" aria-live="polite">
          <svg viewBox="0 0 200 300" aria-hidden className="mu-bottle">
            <defs>
              <clipPath id="mu-glass">
                <path d={BOTTLE} />
              </clipPath>
              <linearGradient id="mu-shine" x1="0" x2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
                <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.8" stopColor="#fff" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <g clipPath="url(#mu-glass)">
              {bands.map((b, i) => {
                y -= b.h;
                return <rect key={i} x="40" y={y} width="120" height={b.h + 1} fill={b.c} className="mu-band" style={{ transitionDelay: `${i * 0.12}s` }} />;
              })}
              <rect x="40" y="60" width="120" height="210" fill="url(#mu-shine)" />
            </g>
            <path d={BOTTLE} className="mu-glass" />
            <path d="M70 70 L100 96 L130 70 M50 96 L100 96 L150 96 M100 96 L100 262" className="mu-facet" />
            <rect x="80" y="30" width="40" height="40" rx="4" className="mu-cap" />
            <rect x="74" y="22" width="52" height="12" rx="3" className="mu-cap" />
          </svg>
          <p className="mu-blend-label">{t.yourBlend}</p>
          <h3 className="mu-blend-name">{name}</h3>
          <dl className="mu-blend-facts">
            <div>
              <dt>{t.strength}</dt>
              <dd>
                <span className="mu-meter" aria-hidden>
                  {Array.from({ length: 5 }, (_, i) => (
                    <i key={i} className={i < Math.round(f.strength) ? "on" : ""} />
                  ))}
                </span>
                {f.strength} / 5
              </dd>
            </div>
            <div>
              <dt>{t.lasts}</dt>
              <dd>{t.hours(f.hours)}</dd>
            </div>
          </dl>
          <h4>{t.order}</h4>
          <ol className="mu-order">
            {LAYERS.map((l, i) => (
              <li key={l.id}>
                <strong>{f.notes[i].name[lang]}</strong> {l.hint[lang]}
              </li>
            ))}
          </ol>
          <p className="mu-set">
            {t.setOf}, {aed(BLEND_PRICE, lang)}
          </p>
          <button type="button" className="mu-btn mu-btn-sun" onClick={addSet}>
            {t.addBlend}
          </button>
        </div>
      </div>
    </section>
  );
}
