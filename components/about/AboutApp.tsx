"use client";
// components/about/AboutApp.tsx — the About page: who Zenith is, the founder, the four
// disciplines, the method, the markets, the technology and the commitments.
// Chapters alternate between "night" (narrative) and "paper" (evidence, set like a document).
// One orchestrated moment only: the founder's portrait emerging from the dark as the gold rule draws,
// scroll-linked in CSS (shown as-is where unsupported or when reduced motion is set).

import React, { useEffect, useState } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/ContactFooter";
import ZenithStandard from "@/components/site/ZenithStandard";
import { useSitePrefs } from "@/components/site/useSitePrefs";
import { pick, waLink, type L10n } from "@/lib/site";
import {
  CHAPTERS, CLOSING, DISCIPLINES, FOUNDER, FOUNDER_NAME, HERO, MARKETS, METHOD, PHILOSOPHY, TECHNOLOGY, UI, WORKING,
} from "./copy";

const CHAPTER_IDS = CHAPTERS.map(c => c.id);

function useActiveChapter(): string {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = CHAPTER_IDS.map(id => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export default function AboutApp() {
  const { dark, lang, setLang, toggleTheme } = useSitePrefs();
  const active = useActiveChapter();
  const p = (v: L10n) => pick(v, lang);

  return (
      <div className="zs ab" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
        <style href="zenith-about" precedence="medium">{CSS}</style>
        <a href="#main" className="z-skip">{p(UI.skip)}</a>
        <SiteHeader lang={lang} setLang={setLang} dark={dark} toggleTheme={toggleTheme} onHome={false} current="/about/" />

        <main id="main" tabIndex={-1}>
          {/* 1 — Hero */}
          <header className="ab-hero">
            <div className="z-wrap z-wrap-wide">
              <h1 className="ab-h1">{p(HERO.h1)}</h1>
              <div className="ab-hero-foot">
                <p className="ab-lede">{p(HERO.lede)}</p>
                <div className="ab-actions">
                  <a className="z-btn z-btn-primary" href="/x-ray/">{p(HERO.xray)}</a>
                  <a className="z-btn z-btn-quiet" href="/#packages">{p(HERO.packages)}</a>
                </div>
              </div>
            </div>
          </header>

          <nav className="ab-local" aria-label={p(UI.onThisPage)}>
            <ol>
              {CHAPTERS.map(c => (
                <li key={c.id}>
                  <a href={`#${c.id}`} aria-current={active === c.id ? "true" : undefined}>{p(c.label)}</a>
                </li>
              ))}
            </ol>
          </nav>

          {/* 2 — Philosophy */}
          <section id="philosophy" className="ab-ch ab-paper" aria-labelledby="philosophy-h">
            <div className="z-wrap z-wrap-wide ab-split">
              <h2 id="philosophy-h" className="z-h2 ab-h2">{p(PHILOSOPHY.h2)}</h2>
              <div>
                <p className="ab-body-lg">{p(PHILOSOPHY.p)}</p>
                <dl className="ab-principles">
                  {PHILOSOPHY.principles.map(pr => (
                    <div key={pr.name.en}>
                      <dt>{p(pr.name)}</dt>
                      <dd>{p(pr.text)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {/* 3 — Founder: the one orchestrated moment */}
          <section id="founder" className="ab-ch ab-dark ab-founder" aria-labelledby="founder-h">
            <div className="z-wrap z-wrap-wide ab-founder-grid">
              <figure className="ab-founder-photo">
                <img
                  src="/about/founder-1200.webp"
                  srcSet="/about/founder-800.webp 800w, /about/founder-1200.webp 1200w"
                  sizes="(min-width: 960px) 42vw, 92vw"
                  width={1200}
                  height={1347}
                  alt={p(FOUNDER.alt)}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="ab-founder-text">
                <span className="ab-rule" aria-hidden="true" />
                <h2 id="founder-h" className="ab-name">
                  <span className="ab-role">{p(FOUNDER.role)}</span>
                  {FOUNDER_NAME}
                </h2>
                <p className="ab-statement">{p(FOUNDER.statement)}</p>
                {FOUNDER.story.map((s, i) => <p key={i} className="ab-body">{p(s)}</p>)}
                <blockquote className="ab-quote">
                  <p>{p(FOUNDER.quote)}</p>
                  <footer><cite>{FOUNDER_NAME}</cite></footer>
                </blockquote>
                <dl className="ab-facts">
                  {FOUNDER.facts.map((f, i) => (
                    <div key={i}>
                      <dt>{p(f.value)}</dt>
                      <dd>{p(f.label)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {/* 4 — Disciplines */}
          <section id="disciplines" className="ab-ch ab-paper" aria-labelledby="disciplines-h">
            <div className="z-wrap z-wrap-wide">
              <div className="ab-head">
                <h2 id="disciplines-h" className="z-h2 ab-h2">{p(DISCIPLINES.h2)}</h2>
                <p className="ab-intro">{p(DISCIPLINES.intro)}</p>
              </div>
              <ul className="ab-disc">
                {DISCIPLINES.items.map(it => (
                  <li key={it.slug}>
                    <h3>{p(it.name)}</h3>
                    <p>{p(it.text)}</p>
                    <div className="ab-uses">
                      <span>{p(DISCIPLINES.usedIn)}</span>
                      <ul>{it.uses.map(u => <li key={u.en}>{p(u)}</li>)}</ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 5 — Method */}
          <section id="method" className="ab-ch ab-night" aria-labelledby="method-h">
            <div className="z-wrap z-wrap-wide">
              <h2 id="method-h" className="z-h2 ab-h2">{p(METHOD.h2)}</h2>
              <ol className="ab-steps">
                {METHOD.steps.map(st => (
                  <li key={st.name.en}>
                    <h3>{p(st.name)}</h3>
                    <p>{p(st.text)}</p>
                  </li>
                ))}
              </ol>
              <p className="ab-note">{p(METHOD.note)}</p>
            </div>
          </section>

          {/* 6 — Markets */}
          <section id="markets" className="ab-ch ab-paper" aria-labelledby="markets-h">
            <div className="z-wrap z-wrap-wide">
              <div className="ab-head">
                <h2 id="markets-h" className="z-h2 ab-h2">{p(MARKETS.h2)}</h2>
                <p className="ab-intro">{p(MARKETS.intro)}</p>
              </div>
              <div className="ab-markets">
                {MARKETS.items.map(m => (
                  <div className="ab-market" key={m.name.en}>
                    <h3>{p(m.name)}</h3>
                    <p>{p(m.text)}</p>
                  </div>
                ))}
              </div>
              <p className="ab-disclaimer">{p(MARKETS.disclaimer)}</p>
            </div>
          </section>

          {/* 7 — Technology */}
          <section id="technology" className="ab-ch ab-night" aria-labelledby="technology-h">
            <div className="z-wrap z-wrap-wide">
              <div className="ab-head">
                <h2 id="technology-h" className="z-h2 ab-h2">{p(TECHNOLOGY.h2)}</h2>
                <p className="ab-intro">{p(TECHNOLOGY.intro)}</p>
              </div>
              <div className="ab-tools">
                {TECHNOLOGY.tools.map(tl => (
                  <div className="ab-tool" key={tl.href}>
                    <h3>{p(tl.name)}</h3>
                    <p>{p(tl.text)}</p>
                    <a href={tl.href}>{p(tl.cta)}</a>
                  </div>
                ))}
              </div>
              <p className="ab-honest">{p(TECHNOLOGY.honest)}</p>
            </div>
          </section>

          {/* 8 — Working together */}
          <section id="working" className="ab-ch ab-night ab-ruled" aria-labelledby="working-h">
            <div className="z-wrap z-wrap-wide ab-split">
              <h2 id="working-h" className="z-h2 ab-h2">{p(WORKING.h2)}</h2>
              <ol className="ab-work">
                {WORKING.steps.map(st => (
                  <li key={st.name.en}>
                    <div>
                      <h3>{p(st.name)}</h3>
                      <p>{p(st.text)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 9 — The Zenith Standard */}
          <ZenithStandard lang={lang} />

          {/* 10 — Close */}
          <section className="ab-ch ab-night ab-close" aria-labelledby="close-h">
            <div className="z-wrap z-wrap-wide">
              <h2 id="close-h" className="z-h2 ab-h2">{p(CLOSING.h2)}</h2>
              <p>{p(CLOSING.p)}</p>
              <div className="ab-actions">
                <a className="z-btn z-btn-primary" href="/x-ray/">{p(HERO.xray)}</a>
                <a className="z-btn z-btn-quiet" href={waLink(CLOSING.waText)} target="_blank" rel="noopener noreferrer">{p(CLOSING.whatsapp)}</a>
                <a className="z-btn z-btn-quiet" href="/#packages">{p(HERO.packages)}</a>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter lang={lang} onHome={false} />
      </div>
  );
}

const CSS = `
.ab{--ab-paper:#F5F1EB;--ab-ink:#1A1410;--ab-ink2:#4C4037;--ab-ink3:#6B5D52;--ab-rule-ink:rgba(26,20,16,.16)}
html[data-theme="light"] .ab{--ab-paper:#ECE4D8}
.ab-ch{padding-block:clamp(88px,11vw,152px);scroll-margin-top:118px}
.ab-paper{background:var(--ab-paper);color:var(--ab-ink)}
.ab-paper .z-h2{color:var(--ab-ink)}
.ab-night{background:var(--z-bg);color:var(--z-fg)}
.ab-ruled{border-top:1px solid var(--z-rule)}
.ab-dark{--z-bg:#0A0907;--z-fg:#EDE8E0;--z-fg-2:#BDB0A3;--z-fg-3:#958879;--z-rule:rgba(237,232,224,.12);--z-gold-text:#E2C98E;background:#0A0907;color:#EDE8E0}
.ab-h2{max-width:20ch}

/* Hero */
.ab-hero{padding-block:clamp(72px,10vw,144px) clamp(56px,7vw,96px)}
.ab-h1{font-family:var(--font-serif),Georgia,serif;font-optical-sizing:auto;font-weight:330;font-size:clamp(46px,7.4vw,116px);line-height:.98;letter-spacing:-.03em;color:var(--z-fg);max-width:17ch;text-wrap:balance}
[dir="rtl"] .ab-h1{font-family:var(--font-arabic-serif),var(--font-arabic),serif;font-weight:600;letter-spacing:0;line-height:1.32;font-size:clamp(38px,5.6vw,84px);max-width:16ch}
.ab-hero-foot{display:grid;gap:28px;margin-top:clamp(44px,5.5vw,80px);padding-top:28px;border-top:1px solid var(--z-gold)}
@media (min-width:960px){.ab-hero-foot{grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:72px}}
.ab-lede{font-size:clamp(18px,1.45vw,21px);line-height:1.6;color:var(--z-fg-2);max-width:54ch}
.ab-actions{display:flex;flex-wrap:wrap;gap:12px}

/* Local navigation */
.ab-local{position:sticky;top:68px;z-index:40;background:color-mix(in srgb,var(--z-bg) 90%,transparent);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-block:1px solid var(--z-rule)}
.ab-local ol{display:flex;gap:6px;list-style:none;margin:0 auto;padding:0 clamp(20px,4vw,40px);max-width:1320px;overflow-x:auto;scrollbar-width:none}
.ab-local a{display:block;padding:13px 10px;font-size:13.5px;color:var(--z-fg-3);text-decoration:none;white-space:nowrap;border-bottom:1px solid transparent;margin-bottom:-1px;transition:color .2s}
.ab-local a:hover{color:var(--z-fg)}
.ab-local a[aria-current="true"]{color:var(--z-fg);border-bottom-color:var(--z-gold)}
.ab-local a:focus-visible{outline:2px solid var(--z-focus);outline-offset:-4px}
@media (max-width:899px){.ab-local{display:none}}

/* Shared chapter parts */
.ab-split{display:grid;gap:36px}
@media (min-width:960px){.ab-split{grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(48px,6vw,104px);align-items:start}}
.ab-head{display:grid;gap:18px;max-width:780px}
.ab-intro{font-size:clamp(17px,1.35vw,19px);line-height:1.65}
.ab-paper .ab-intro,.ab-paper .ab-body-lg{color:var(--ab-ink2)}
.ab-night .ab-intro{color:var(--z-fg-2)}
.ab-body-lg{font-size:clamp(18px,1.45vw,20px);line-height:1.72}

/* Philosophy */
.ab-principles{margin:40px 0 0;border-top:1px solid var(--ab-rule-ink)}
.ab-principles>div{display:grid;grid-template-columns:150px 1fr;gap:20px;padding:20px 0;border-bottom:1px solid var(--ab-rule-ink)}
.ab-principles dt{font-family:var(--font-serif),Georgia,serif;font-size:22px;line-height:1.3;color:var(--ab-ink)}
[dir="rtl"] .ab-principles dt{font-family:var(--font-arabic-serif),serif}
.ab-principles dd{margin:0;font-size:16px;line-height:1.65;color:var(--ab-ink2)}
@media (max-width:560px){.ab-principles>div{grid-template-columns:1fr;gap:6px}}

/* Founder */
.ab-founder-grid{display:grid;gap:44px;align-items:start}
@media (min-width:960px){.ab-founder-grid{grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(48px,6vw,104px)}}
.ab-founder-photo{margin:0;max-width:560px;position:relative}
@media (min-width:960px){.ab-founder-photo{position:sticky;top:140px}}
.ab-founder-photo img{display:block;width:100%;height:auto;-webkit-mask-image:radial-gradient(ellipse 72% 78% at 50% 40%,#000 58%,transparent 100%);mask-image:radial-gradient(ellipse 72% 78% at 50% 40%,#000 58%,transparent 100%)}
.ab-founder-text{position:relative;padding-inline-start:30px}
.ab-rule{position:absolute;inset-inline-start:0;top:4px;bottom:4px;width:1px;background:var(--z-gold);transform-origin:top center;display:block}
.ab-name{font-family:var(--font-serif),Georgia,serif;font-weight:400;font-size:clamp(24px,2.2vw,30px);line-height:1.25;color:var(--z-fg)}
.ab-role{display:block;font-family:var(--font-sans),system-ui,sans-serif;font-size:14px;font-weight:500;letter-spacing:.01em;color:var(--z-gold-text);margin-bottom:8px}
[dir="rtl"] .ab-role{font-family:var(--font-arabic),sans-serif}
.ab-statement{font-family:var(--font-serif),Georgia,serif;font-weight:330;font-size:clamp(34px,3.9vw,58px);line-height:1.06;letter-spacing:-.022em;color:var(--z-fg);margin:30px 0 34px;max-width:15ch;text-wrap:balance}
[dir="rtl"] .ab-statement{font-family:var(--font-arabic-serif),serif;font-weight:600;letter-spacing:0;line-height:1.4;font-size:clamp(30px,3.2vw,46px)}
.ab-body{font-size:17px;line-height:1.78;color:var(--z-fg-2);max-width:60ch}
.ab-body+.ab-body{margin-top:18px}
.ab-quote{margin:40px 0 0;padding:26px 0 0;border-top:1px solid var(--z-rule)}
.ab-quote p{font-family:var(--font-serif),Georgia,serif;font-size:clamp(20px,1.7vw,24px);line-height:1.45;color:var(--z-fg);max-width:38ch}
[dir="rtl"] .ab-quote p{font-family:var(--font-arabic-serif),serif;line-height:1.7}
.ab-quote footer{margin-top:12px}
.ab-quote cite{font-style:normal;font-size:14px;color:var(--z-fg-3)}
.ab-facts{margin:40px 0 0;border-top:1px solid var(--z-rule)}
.ab-facts>div{display:grid;grid-template-columns:minmax(118px,max-content) 1fr;gap:20px;padding:15px 0;border-bottom:1px solid var(--z-rule);align-items:baseline}
.ab-facts dt{font-family:var(--font-serif),Georgia,serif;font-size:20px;color:var(--z-gold-text);font-variant-numeric:lining-nums}
[dir="rtl"] .ab-facts dt{font-family:var(--font-arabic-serif),serif;font-size:18px}
.ab-facts dd{margin:0;font-size:15px;line-height:1.55;color:var(--z-fg-2)}

/* The one moment: scroll-linked, CSS only */
@media (prefers-reduced-motion: no-preference){
  @supports (animation-timeline: view()){
    .ab-founder{view-timeline-name:--founder}
    .ab-founder-photo img{animation:ab-emerge linear both;animation-timeline:--founder;animation-range:entry 0% entry 80%}
    .ab-rule{animation:ab-draw linear both;animation-timeline:--founder;animation-range:entry 25% entry 100%}
  }
}
@keyframes ab-emerge{from{opacity:0;transform:scale(1.045);filter:brightness(.55)}to{opacity:1;transform:none;filter:none}}
@keyframes ab-draw{from{transform:scaleY(0)}to{transform:scaleY(1)}}

/* Disciplines: typographic, set like a specification sheet */
.ab-disc{list-style:none;margin:52px 0 0;padding:0;display:grid;grid-template-columns:1fr;border-top:1px solid var(--ab-rule-ink)}
@media (min-width:860px){.ab-disc{grid-template-columns:1fr 1fr}.ab-disc>li:nth-child(odd){padding-inline-end:clamp(32px,4vw,64px);border-inline-end:1px solid var(--ab-rule-ink)}.ab-disc>li:nth-child(even){padding-inline-start:clamp(32px,4vw,64px)}}
.ab-disc>li{padding-block:32px 36px;border-bottom:1px solid var(--ab-rule-ink)}
.ab-disc h3{font-family:var(--font-serif),Georgia,serif;font-weight:400;font-size:clamp(26px,2.4vw,34px);line-height:1.12;letter-spacing:-.015em;color:var(--ab-ink);margin:0 0 14px;max-width:18ch;text-wrap:balance}
[dir="rtl"] .ab-disc h3{font-family:var(--font-arabic-serif),serif;font-weight:600;letter-spacing:0;line-height:1.45;font-size:clamp(24px,2.1vw,30px)}
.ab-disc p{font-size:16.5px;line-height:1.68;color:var(--ab-ink2);max-width:52ch}
.ab-uses{margin-top:20px;display:flex;flex-wrap:wrap;gap:8px 10px;align-items:baseline}
.ab-uses span{font-size:13.5px;color:var(--ab-ink3);margin-inline-end:4px}
.ab-uses ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.ab-uses li{font-size:14px;color:var(--ab-ink);border:1px solid var(--ab-rule-ink);border-radius:999px;padding:4px 12px;background:rgba(255,255,255,.35)}

/* Method */
.ab-steps{list-style:none;margin:56px 0 0;padding:0;display:grid;counter-reset:st}
@media (min-width:960px){.ab-steps{grid-template-columns:repeat(5,minmax(0,1fr));border-top:1px solid var(--z-rule)}}
.ab-steps li{counter-increment:st;padding:24px 0;border-top:1px solid var(--z-rule)}
@media (min-width:960px){.ab-steps li{border-top:0;padding:28px 28px 0 0}[dir="rtl"] .ab-steps li{padding:28px 0 0 28px}}
.ab-steps li::before{content:counter(st,decimal-leading-zero);display:block;font-family:var(--font-serif),Georgia,serif;font-size:15px;color:var(--z-gold-text);margin-bottom:14px;font-variant-numeric:tabular-nums lining-nums}
.ab-steps h3,.ab-work h3,.ab-tool h3,.ab-market h3{font-family:var(--font-serif),Georgia,serif;font-weight:450;letter-spacing:-.005em}
[dir="rtl"] .ab-steps h3,[dir="rtl"] .ab-work h3,[dir="rtl"] .ab-tool h3,[dir="rtl"] .ab-market h3{font-family:var(--font-arabic-serif),serif;font-weight:600}
.ab-steps h3{font-size:24px;color:var(--z-fg);margin-bottom:8px}
.ab-steps p{font-size:15.5px;line-height:1.65;color:var(--z-fg-2)}
.ab-note{margin-top:32px;font-size:14px;color:var(--z-fg-3)}

/* Markets */
.ab-markets{margin-top:52px;display:grid;border-top:1px solid var(--ab-rule-ink)}
@media (min-width:960px){.ab-markets{grid-template-columns:1fr 1fr;column-gap:clamp(32px,5vw,80px)}}
.ab-market{display:grid;gap:6px;padding:22px 0;border-bottom:1px solid var(--ab-rule-ink)}
@media (min-width:560px){.ab-market{grid-template-columns:180px 1fr;gap:22px;align-items:baseline}}
.ab-market h3{font-size:20px;line-height:1.3;color:var(--ab-ink)}
.ab-market p{font-size:15.5px;line-height:1.62;color:var(--ab-ink2)}
.ab-disclaimer{margin-top:28px;font-size:14px;line-height:1.6;color:var(--ab-ink3);max-width:72ch}

/* Technology */
.ab-tools{margin-top:52px;display:grid;gap:44px}
@media (min-width:960px){.ab-tools{grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(28px,4vw,64px)}}
.ab-tool{padding-top:22px;border-top:1px solid var(--z-rule-strong)}
.ab-tool h3{font-size:25px;color:var(--z-fg);margin-bottom:10px}
.ab-tool p{font-size:15.5px;line-height:1.65;color:var(--z-fg-2)}
.ab-tool a{display:inline-block;margin-top:16px;color:var(--z-gold-text);font-weight:500;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}
.ab-tool a:hover{text-decoration-thickness:2px}
.ab-honest{margin-top:44px;font-size:14px;line-height:1.6;color:var(--z-fg-3);max-width:72ch}

/* Working together */
.ab-work{list-style:none;margin:0;padding:0;display:grid;counter-reset:wk}
.ab-work li{counter-increment:wk;display:grid;grid-template-columns:52px 1fr;gap:14px;padding:22px 0;border-top:1px solid var(--z-rule)}
.ab-work li:last-child{border-bottom:1px solid var(--z-rule)}
.ab-work li::before{content:counter(wk);font-family:var(--font-serif),Georgia,serif;font-size:30px;line-height:1;color:var(--z-gold-text);font-variant-numeric:lining-nums}
.ab-work h3{font-size:21px;color:var(--z-fg);margin-bottom:6px}
.ab-work p{font-size:15.5px;line-height:1.62;color:var(--z-fg-2)}

/* Close */
.ab-close p{margin-top:18px;font-size:clamp(17px,1.4vw,19px);line-height:1.6;color:var(--z-fg-2);max-width:56ch}
.ab-close .ab-actions{margin-top:34px}
`;
