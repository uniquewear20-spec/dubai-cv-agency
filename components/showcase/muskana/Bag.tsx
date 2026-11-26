"use client";

// The bag: a side sheet with quantities, the subtotal, free delivery over AED 500 and a checkout
// that stops at the concept notice.

import { useCallback } from "react";
import { Img } from "../kit/Img";
import { useDialog } from "../kit/hooks";
import { BLEND_PRICE, FREE_DELIVERY, PRODUCTS, aed, blendFacts, type Blend } from "@/lib/showcase/muskana";
import { useMuskana } from "./state";

/** A bag line is a product id, or "blend:base.heart.top" for a layering set. */
export function lineInfo(id: string, lang: "en" | "ar", blendName: (b: Blend) => string) {
  if (id.startsWith("blend:")) {
    const [base, heart, top] = id.slice(6).split(".");
    const b = { base, heart, top };
    const f = blendFacts(b);
    return { name: blendName(b), img: "", price: BLEND_PRICE, swatch: f.notes.map((n) => n.color) };
  }
  const p = PRODUCTS.find((x) => x.id === id);
  return { name: p ? p.name[lang] : id, img: p?.img ?? "", price: p?.price ?? 0, swatch: null as string[] | null };
}

export function Bag() {
  const { t, lang, bag, setBag, overlay, open } = useMuskana();
  const isOpen = overlay === "bag";
  const close = useCallback(() => open(null), [open]);
  const box = useDialog(isOpen, close);
  if (!isOpen) return null;
  const nameOf = (b: Blend) => {
    const f = blendFacts(b);
    return t.blendName(f.notes[2].word[lang], f.notes[1].word[lang], f.notes[0].word[lang]);
  };
  const lines = bag.map((l) => ({ ...l, ...lineInfo(l.id, lang, nameOf) }));
  const sub = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const setQty = (id: string, q: number) => setBag((b) => (q <= 0 ? b.filter((l) => l.id !== id) : b.map((l) => (l.id === id ? { ...l, qty: Math.min(9, q) } : l))));
  return (
    <div className="mu-bag" role="dialog" aria-modal="true" aria-labelledby="mu-bag-h">
      <button type="button" className="mu-scrim" aria-label={t.close} tabIndex={-1} onClick={close} />
      <div className="mu-bag-box" ref={box}>
        <div className="mu-bag-top">
          <h2 id="mu-bag-h">{t.bag}</h2>
          <button type="button" className="mu-close" onClick={close} data-autofocus>
            {t.close}
          </button>
        </div>
        {lines.length === 0 ? (
          <p className="mu-bag-empty">{t.bagEmpty}</p>
        ) : (
          <ul className="mu-bag-lines">
            {lines.map((l) => (
              <li key={l.id}>
                {l.swatch ? (
                  <span className="mu-bag-swatch" aria-hidden>
                    {l.swatch.map((c, i) => (
                      <i key={i} style={{ background: c }} />
                    ))}
                  </span>
                ) : (
                  <Img src={l.img} alt="" sizes="72px" widths={[160]} className="mu-bag-img" />
                )}
                <span className="mu-bag-name">
                  {l.name}
                  <small>{aed(l.price, lang)}</small>
                </span>
                <span className="mu-qty" role="group" aria-label={t.qty}>
                  <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label={`${t.remove} 1`}>
                    −
                  </button>
                  <output>{l.qty}</output>
                  <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label="+1">
                    +
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <dl className="mu-bag-sum">
          <div>
            <dt>{t.subtotal}</dt>
            <dd>{aed(sub, lang)}</dd>
          </div>
          <div>
            <dt>{t.delivery}</dt>
            <dd>{sub >= FREE_DELIVERY ? t.free : sub ? t.toFree(aed(FREE_DELIVERY - sub, lang)) : "—"}</dd>
          </div>
        </dl>
        <button type="button" className="mu-btn mu-btn-sun" disabled={!lines.length} onClick={() => open("notice")}>
          {t.checkout}
        </button>
      </div>
    </div>
  );
}
