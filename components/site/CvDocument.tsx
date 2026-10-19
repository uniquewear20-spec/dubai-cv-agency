"use client";
// components/site/CvDocument.tsx — typesets one fictional CV concept as an A4 page (794 × 1123 CSS px).
// Real text, not an image: crisp at any zoom, selectable, and readable by screen readers.
// <ScaledCv> fits the page to its container width.

import React, { useCallback, useState } from "react";
import type { CvConcept, CvRole } from "@/lib/cv-concepts";

export const A4_W = 794;
export const A4_H = 1123;

const FONTS = {
  serif: "var(--font-serif), Georgia, 'Times New Roman', serif",
  sans: "var(--font-sans), 'Helvetica Neue', Arial, sans-serif",
  arabic: "var(--font-arabic), Tahoma, Arial, sans-serif",
  "arabic-serif": "var(--font-arabic-serif), var(--font-arabic), Tahoma, serif",
} as const;

const CSS = `
.cvd{position:relative;width:${A4_W}px;height:${A4_H}px;overflow:hidden;box-sizing:border-box;background:var(--p);color:var(--i);font-family:var(--fb);font-size:13.25px;line-height:1.52;text-align:start;-webkit-font-smoothing:antialiased;font-variant-numeric:lining-nums;}
.cvd *{box-sizing:border-box;margin:0;padding:0}
.cvd h1,.cvd h2,.cvd h3{font-weight:inherit}
.cvd .cvd-h{font-family:var(--fh)}
.cvd .cvd-sec{font-family:var(--fsans);font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--a);margin-bottom:9px}
.cvd[dir="rtl"]{font-size:14.5px;line-height:1.75}
.cvd[dir="rtl"] .cvd-sec{letter-spacing:0;text-transform:none;font-family:var(--fh);font-size:16.5px;font-weight:700;margin-bottom:8px}
.cvd[dir="rtl"] .cvd-role b{font-size:15.5px}
.cvd[dir="rtl"] .cvd-org{font-size:13.5px}
.cvd[dir="rtl"] .cvd-dates{font-size:12.5px}
.cvd[dir="rtl"].cvd-sidebar .cvd-summary{font-size:14.5px;line-height:1.8}
.cvd[dir="rtl"].cvd-sidebar .cvd-sblock{font-size:13.5px}
.cvd[dir="rtl"].cvd-sidebar .cvd-name{font-size:40px;line-height:1.3}
.cvd ul{list-style:none}
.cvd .cvd-bul li{position:relative;padding-inline-start:15px;margin-top:3px}
.cvd .cvd-bul li::before{content:"";position:absolute;inset-inline-start:2px;top:.66em;width:5px;height:5px;border-radius:1px;background:var(--a);opacity:.85}
.cvd[dir="rtl"] .cvd-bul li::before{top:.85em}
.cvd .cvd-role{display:flex;justify-content:space-between;align-items:baseline;gap:16px}
.cvd .cvd-role b{font-weight:600;font-size:14.25px;color:var(--i)}
.cvd .cvd-dates{font-size:12px;color:var(--m);white-space:nowrap;font-variant-numeric:tabular-nums}
.cvd .cvd-org{font-size:12.5px;color:var(--m);margin-top:1px}
.cvd .cvd-job{margin-bottom:14px}
.cvd .cvd-muted{color:var(--m)}
.cvd .cvd-rule{height:1px;background:var(--r)}
.cvd .cvd-foot{position:absolute;inset-inline:0;bottom:22px;text-align:center;font-family:var(--fsans);font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--m);opacity:.8}
.cvd[dir="rtl"] .cvd-foot{letter-spacing:0;text-transform:none;font-size:11px}

/* classic */
.cvd-classic{padding:58px 70px 70px}
.cvd-classic .cvd-head{text-align:center}
.cvd-classic .cvd-name{font-size:40px;line-height:1.05;letter-spacing:.01em;font-weight:500}
.cvd-classic .cvd-title{margin-top:8px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--a);font-weight:600;font-family:var(--fsans)}
.cvd-classic .cvd-contact{margin-top:10px;font-size:12px;color:var(--m);font-family:var(--fsans)}
.cvd-classic .cvd-contact span+span::before{content:"";display:inline-block;width:3px;height:3px;border-radius:50%;background:var(--a);margin:0 10px;vertical-align:middle}
.cvd-classic .cvd-double{margin:20px 0 22px;border-top:1px solid var(--a);border-bottom:1px solid var(--r);height:4px}
.cvd-classic .cvd-facts{display:grid;grid-template-columns:repeat(3,1fr);margin:0 0 22px;padding:12px 0;background:var(--pn)}
.cvd-classic .cvd-facts div{text-align:center}
.cvd-classic .cvd-facts div+div{border-inline-start:1px solid var(--r)}
.cvd-classic .cvd-facts strong{display:block;font-family:var(--fh);font-size:23px;line-height:1.1;font-weight:500;color:var(--i)}
.cvd-classic .cvd-facts span{font-size:10.5px;color:var(--m);letter-spacing:.06em;font-family:var(--fsans)}
.cvd-classic .cvd-block{margin-bottom:20px}
.cvd-classic .cvd-summary{font-size:13.75px;line-height:1.62}
.cvd-classic .cvd-grid3{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:24px;padding-top:16px;border-top:1px solid var(--r)}
.cvd-classic .cvd-grid3 li{margin-top:2px}

/* ledger */
.cvd-ledger{padding:54px 62px 70px}
.cvd-ledger .cvd-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding-bottom:18px;border-bottom:3px solid var(--a)}
.cvd-ledger .cvd-name{font-size:34px;line-height:1.05;font-weight:700;letter-spacing:-.015em}
.cvd-ledger .cvd-title{margin-top:6px;font-size:14.5px;color:var(--a);font-weight:600}
.cvd-ledger .cvd-contact{text-align:end;font-size:12px;color:var(--m);line-height:1.6}
.cvd-ledger .cvd-row{display:grid;grid-template-columns:132px 1fr;gap:22px;padding:15px 0;border-bottom:1px solid var(--r)}
.cvd-ledger .cvd-row:last-of-type{border-bottom:0}
.cvd-ledger .cvd-row .cvd-sec{margin:2px 0 0}
.cvd-ledger .cvd-tags{display:flex;flex-wrap:wrap;gap:6px}
.cvd-ledger .cvd-tags li{padding:2px 9px;border-radius:3px;background:var(--pn);font-size:12.25px}
.cvd-ledger .cvd-job:last-child{margin-bottom:0}

/* sidebar */
.cvd-sidebar{display:grid;grid-template-columns:262px 1fr}
.cvd-sidebar .cvd-side{background:var(--pn);color:var(--pi);padding:52px 30px 70px;height:${A4_H}px}
.cvd-sidebar .cvd-side .cvd-sec{color:var(--sa)}
.cvd-sidebar .cvd-side .cvd-muted,.cvd-sidebar .cvd-side .cvd-org{color:var(--pm)}
.cvd-sidebar .cvd-mono{width:66px;height:66px;border-radius:50%;border:1.5px solid var(--sa);display:grid;place-items:center;font-family:var(--fh);font-size:24px;color:var(--pi);margin-bottom:26px}
.cvd-sidebar .cvd-sblock{margin-bottom:22px;font-size:12.5px;line-height:1.55}
.cvd-sidebar .cvd-sblock li{margin-top:4px}
.cvd-sidebar .cvd-main{padding:52px 46px 70px 40px}
.cvd-sidebar[dir="rtl"] .cvd-main{padding:52px 40px 70px 46px}
.cvd-sidebar .cvd-name{font-size:38px;line-height:1.05;font-weight:500;letter-spacing:-.01em}
.cvd-sidebar .cvd-title{margin-top:8px;font-size:14px;color:var(--a);font-weight:600;font-family:var(--fsans)}
.cvd-sidebar[dir="rtl"] .cvd-title{font-family:var(--fb)}
.cvd-sidebar .cvd-mainrule{height:2px;width:46px;background:var(--a);margin:20px 0 20px}
.cvd-sidebar .cvd-block{margin-bottom:18px}
.cvd-sidebar .cvd-summary{font-size:13.5px;line-height:1.62}

/* editorial */
.cvd-editorial{padding:54px 60px 70px}
.cvd-editorial .cvd-name{font-size:68px;line-height:.94;letter-spacing:-.03em;font-weight:500}
.cvd-editorial .cvd-headrow{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-top:16px;padding-bottom:14px;border-bottom:1px solid var(--i)}
.cvd-editorial .cvd-title{font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;color:var(--a);font-family:var(--fsans)}
.cvd-editorial .cvd-contact{font-size:11.75px;color:var(--m);text-align:end;font-family:var(--fsans);line-height:1.6}
.cvd-editorial .cvd-cols{display:grid;grid-template-columns:1fr 228px;gap:40px;margin-top:24px}
.cvd-editorial .cvd-pull{font-family:var(--fh);font-size:18px;line-height:1.45;color:var(--i);margin-bottom:22px;padding-inline-start:14px;border-inline-start:2px solid var(--a)}
.cvd-editorial .cvd-aside .cvd-block{margin-bottom:20px;font-size:12.5px}
.cvd-editorial .cvd-aside li{margin-top:3px}
`;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.replace(/^(ال)/, "").charAt(0))
    .join("");
}

const FOOTER: Record<"en" | "fr" | "ar", string> = {
  en: "Fictional example by Zenith Dubai CV",
  fr: "Exemple fictif réalisé par Zenith Dubai CV",
  ar: "مثال افتراضي من إعداد Zenith Dubai CV",
};

function Roles({ roles }: { roles: CvRole[] }) {
  return (
    <>
      {roles.map(r => (
        <div className="cvd-job" key={r.role + r.dates}>
          <div className="cvd-role">
            <b>{r.role}</b>
            <span className="cvd-dates">{r.dates}</span>
          </div>
          <p className="cvd-org">{r.org}</p>
          <ul className="cvd-bul">
            {r.bullets.map(b => <li key={b}>{b}</li>)}
          </ul>
        </div>
      ))}
    </>
  );
}

function List({ items, className }: { items: string[]; className?: string }) {
  return <ul className={className}>{items.map(i => <li key={i}>{i}</li>)}</ul>;
}

export function CvPage({ concept, id }: { concept: CvConcept; id?: string }) {
  const { cv, palette: p, layout } = concept;
  const L = cv.labels;
  const dir = concept.docLang === "ar" ? "rtl" : "ltr";
  const vars = {
    "--p": p.paper, "--i": p.ink, "--m": p.muted, "--a": p.accent, "--r": p.rule,
    "--pn": p.panel, "--pi": p.panelInk, "--pm": p.panelMuted,
    "--sa": p.panel === p.ink || isDark(p.panel) ? lighten(p.accent) : p.accent,
    "--fh": FONTS[concept.headingFont], "--fb": FONTS[concept.bodyFont],
    "--fsans": concept.docLang === "ar" ? FONTS.arabic : FONTS.sans,
  } as React.CSSProperties;

  const exp = (
    <section className="cvd-block">
      <h3 className="cvd-sec">{L.experience}</h3>
      <Roles roles={cv.experience} />
    </section>
  );
  const edu = (
    <section className="cvd-block">
      <h3 className="cvd-sec">{L.education}</h3>
      <List items={cv.education} />
    </section>
  );
  const extras = (cv.extra ?? []).map(x => (
    <section className="cvd-block" key={x.title}>
      <h3 className="cvd-sec">{x.title}</h3>
      <List items={x.items} className="cvd-bul" />
    </section>
  ));

  return (
    <article id={id} className={`cvd cvd-${layout}`} dir={dir} lang={concept.docLang} style={vars}>
      <style href="zenith-cv-document" precedence="medium">{CSS}</style>

      {layout === "classic" && (
        <>
          <header className="cvd-head">
            <h2 className="cvd-name cvd-h">{cv.name}</h2>
            <p className="cvd-title">{cv.title}</p>
            <p className="cvd-contact"><span>{cv.location}</span>{cv.contact.map(c => <span key={c} dir="ltr">{c}</span>)}</p>
          </header>
          <div className="cvd-double" />
          {cv.facts && (
            <div className="cvd-facts">
              {cv.facts.map(f => <div key={f.label}><strong>{f.value}</strong><span>{f.label}</span></div>)}
            </div>
          )}
          <section className="cvd-block">
            <h3 className="cvd-sec">{L.profile}</h3>
            <p className="cvd-summary">{cv.summary}</p>
          </section>
          {exp}
          {extras}
          <div className="cvd-grid3">
            <section><h3 className="cvd-sec">{L.education}</h3><List items={cv.education} /></section>
            <section><h3 className="cvd-sec">{L.skills}</h3><List items={cv.skills} /></section>
            <section><h3 className="cvd-sec">{L.languages}</h3><List items={cv.languages} /></section>
          </div>
        </>
      )}

      {layout === "ledger" && (
        <>
          <header className="cvd-head">
            <div>
              <h2 className="cvd-name cvd-h">{cv.name}</h2>
              <p className="cvd-title">{cv.title}</p>
            </div>
            <div className="cvd-contact">
              <div>{cv.location}</div>
              {cv.contact.map(c => <div key={c} dir="ltr">{c}</div>)}
            </div>
          </header>
          <div className="cvd-row"><h3 className="cvd-sec">{L.profile}</h3><p>{cv.summary}</p></div>
          {cv.certifications && !cv.educationFirst && concept.field === "healthcare" && (
            <div className="cvd-row"><h3 className="cvd-sec">{L.certifications}</h3><List items={cv.certifications} className="cvd-bul" /></div>
          )}
          {cv.educationFirst && (
            <div className="cvd-row"><h3 className="cvd-sec">{L.education}</h3><List items={cv.education} /></div>
          )}
          {cv.projects && (
            <div className="cvd-row"><h3 className="cvd-sec">{L.projects}</h3><List items={cv.projects} className="cvd-bul" /></div>
          )}
          <div className="cvd-row"><h3 className="cvd-sec">{L.experience}</h3><div><Roles roles={cv.experience} /></div></div>
          {(cv.extra ?? []).map(x => (
            <div className="cvd-row" key={x.title}><h3 className="cvd-sec">{x.title}</h3><List items={x.items} className="cvd-bul" /></div>
          ))}
          {!cv.educationFirst && (
            <div className="cvd-row"><h3 className="cvd-sec">{L.education}</h3><List items={cv.education} /></div>
          )}
          {cv.certifications && concept.field !== "healthcare" && (
            <div className="cvd-row"><h3 className="cvd-sec">{L.certifications}</h3><List items={cv.certifications} /></div>
          )}
          <div className="cvd-row"><h3 className="cvd-sec">{L.skills}</h3><List items={cv.skills} className="cvd-tags" /></div>
          <div className="cvd-row"><h3 className="cvd-sec">{L.languages}</h3><p>{cv.languages.join(" · ")}</p></div>
        </>
      )}

      {layout === "sidebar" && (
        <>
          <aside className="cvd-side">
            <div className="cvd-mono" aria-hidden="true">{initials(cv.name)}</div>
            <section className="cvd-sblock">
              <h3 className="cvd-sec">{L.contact}</h3>
              <p>{cv.location}</p>
              {cv.contact.map(c => <p key={c} dir="ltr" style={{ textAlign: dir === "rtl" ? "right" : "left" }}>{c}</p>)}
            </section>
            <section className="cvd-sblock">
              <h3 className="cvd-sec">{L.skills}</h3>
              <List items={cv.skills} />
            </section>
            <section className="cvd-sblock">
              <h3 className="cvd-sec">{L.languages}</h3>
              <List items={cv.languages} />
            </section>
            <section className="cvd-sblock">
              <h3 className="cvd-sec">{L.education}</h3>
              <List items={cv.education} />
            </section>
            {cv.certifications && (
              <section className="cvd-sblock">
                <h3 className="cvd-sec">{L.certifications}</h3>
                <List items={cv.certifications} />
              </section>
            )}
          </aside>
          <div className="cvd-main">
            <h2 className="cvd-name cvd-h">{cv.name}</h2>
            <p className="cvd-title">{cv.title}</p>
            <div className="cvd-mainrule" />
            <section className="cvd-block">
              <h3 className="cvd-sec">{L.profile}</h3>
              <p className="cvd-summary">{cv.summary}</p>
            </section>
            {exp}
            {extras}
          </div>
        </>
      )}

      {layout === "editorial" && (
        <>
          <header>
            <h2 className="cvd-name cvd-h">{cv.name.split(" ").map((w, i) => <React.Fragment key={w}>{i > 0 && <br />}{w}</React.Fragment>)}</h2>
            <div className="cvd-headrow">
              <p className="cvd-title">{cv.title}</p>
              <p className="cvd-contact">{cv.location}<br />{cv.contact.join("   ")}</p>
            </div>
          </header>
          <div className="cvd-cols">
            <div>
              <p className="cvd-pull">{cv.summary}</p>
              {exp}
            </div>
            <aside className="cvd-aside">
              <section className="cvd-block"><h3 className="cvd-sec">{L.skills}</h3><List items={cv.skills} /></section>
              <section className="cvd-block"><h3 className="cvd-sec">{L.languages}</h3><List items={cv.languages} /></section>
              {edu}
              {(cv.extra ?? []).map(x => (
                <section className="cvd-block" key={x.title}><h3 className="cvd-sec">{x.title}</h3><List items={x.items} /></section>
              ))}
            </aside>
          </div>
        </>
      )}

      <p className="cvd-foot">{FOOTER[concept.docLang]}</p>
    </article>
  );
}

function isDark(hex: string): boolean {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 90;
}

function lighten(hex: string): string {
  const h = hex.replace("#", "");
  const mix = (i: number) => Math.round(parseInt(h.slice(i, i + 2), 16) * 0.45 + 255 * 0.55).toString(16).padStart(2, "0");
  return `#${mix(0)}${mix(2)}${mix(4)}`;
}

/** Fits an A4 page to the width of its container. */
export function ScaledCv({
  concept,
  className,
  maxScale = 1.25,
  decorative = false,
}: {
  concept: CvConcept;
  className?: string;
  maxScale?: number;
  /** Thumbnails: hidden from assistive technology so the text isn't announced twice. */
  decorative?: boolean;
}) {
  const [scale, setScale] = useState(0);
  const measure = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;
      const update = () => {
        const w = el.clientWidth;
        if (w > 0) setScale(Math.min(maxScale, w / A4_W));
      };
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    },
    [maxScale],
  );

  return (
    <div
      ref={measure}
      className={className}
      style={{ position: "relative", width: "100%", height: scale ? A4_H * scale : undefined, aspectRatio: scale ? undefined : `${A4_W} / ${A4_H}` }}
      aria-hidden={decorative || undefined}
      inert={decorative || undefined}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: A4_W, height: A4_H, transform: `scale(${scale || 0.0001})`, transformOrigin: "top left", visibility: scale ? "visible" : "hidden" }}>
        <CvPage concept={concept} />
      </div>
    </div>
  );
}
