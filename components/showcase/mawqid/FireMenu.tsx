"use client";

// The signature: the tasting menu as one night at the fire. The section is tall and its stage is
// pinned; scrolling moves through the ten courses. Each course sets the hearth to its own heat, the
// plate turns in over the fire and the gauge swings to the temperature at the food.

import { useCallback, useRef, useState } from "react";
import { cell, COURSES, FINISH, money, MENU_PRICE, PAIRING_PRICE, STAGES } from "@/lib/showcase/mawqid";
import { Img } from "../kit/Img";
import { useScrollStage } from "../useScrollStage";
import { Hearth } from "./Hearth";
import { useMawqid } from "./state";

const MIN = -20,
  MAX = 800;
const pos = (h: number) => (h - MIN) / (MAX - MIN);

function Gauge({ heat, label }: { heat: number; label: string }) {
  const ticks = [0, 200, 400, 600, 800];
  return (
    <div className="mq-gauge" aria-hidden>
      <span className="mq-gauge-label">{label}</span>
      <div className="mq-gauge-scale">
        <span className="mq-gauge-fill" style={{ transform: `scaleY(${pos(heat)})` }} />
        {ticks.map((v) => (
          <span key={v} className="mq-gauge-tick" style={{ bottom: `${pos(v) * 100}%` }}>
            {v}°
          </span>
        ))}
        <span className="mq-gauge-mark" style={{ bottom: `${pos(heat) * 100}%` }} />
      </div>
    </div>
  );
}

export function FireMenu() {
  const { t, lang } = useMawqid();
  const n = COURSES.length;
  const [idx, setIdx] = useState(0);
  const bar = useRef<HTMLSpanElement>(null);
  const onFrame = useCallback(
    (p: number) => {
      setIdx(Math.min(n - 1, Math.floor(p * n * 0.9999)));
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    },
    [n],
  );
  const { ref, scrollToProgress } = useScrollStage<HTMLElement>(onFrame, 0.16);
  const c = COURSES[idx];

  return (
    <>
      <section className="mq-menu" id="menu" ref={ref} style={{ height: `${n * 75 + 100}vh` }} aria-labelledby="mq-menu-h">
        <ol className="mq-sr">
          {COURSES.map((k, i) => (
            <li key={i}>
              {k.name[lang]}: {k.plate[lang]}. {STAGES[k.stage][lang]}, {k.heat}°C, {k.time[lang]}.
            </li>
          ))}
        </ol>
        <div className="mq-menu-stage" data-stage={c.stage}>
          <Hearth heat={c.heat} stage={c.stage} className="mq-menu-fire" centerOf=".mq-menu-plates" />
          <header className="mq-menu-head">
            <h2 id="mq-menu-h">{t.menuTitle}</h2>
            <p>{t.menuIntro}</p>
          </header>
          <div className="mq-menu-plates" aria-hidden>
            {COURSES.map((k, i) => (
              <figure key={i} className={`mq-plate${i === idx ? " is-on" : i < idx ? " is-past" : ""}`}>
                <Img src={cell(k.img)} alt="" sizes="(max-width: 800px) 70vw, 34vw" widths={[480, 800, 1000]} eager={i < 2} />
              </figure>
            ))}
          </div>
          <div className="mq-menu-copy">
            {COURSES.map((k, i) => (
              <article key={i} className={`mq-course${i === idx ? " is-on" : ""}`} aria-hidden={i !== idx}>
                <p className="mq-course-n">
                  {t.course} {String(i + 1).padStart(2, "0")} / {n}
                </p>
                <h3>{k.name[lang]}</h3>
                <p className="mq-course-plate">{k.plate[lang]}</p>
                <dl className="mq-course-facts">
                  <div>
                    <dt>{STAGES[k.stage][lang]}</dt>
                    <dd className="mq-course-heat">{k.heat}°C</dd>
                  </div>
                  <div>
                    <dt>{t.onFire}</dt>
                    <dd>{k.time[lang]}</dd>
                  </div>
                  <div>
                    <dt>{t.wood}</dt>
                    <dd>{t.woods[k.wood]}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
          <Gauge heat={c.heat} label={t.heatAtFood} />
          <nav className="mq-menu-dots" aria-label={t.menuTitle}>
            {COURSES.map((k, i) => (
              <button
                key={i}
                type="button"
                className={i === idx ? "is-on" : i < idx ? "is-past" : ""}
                aria-label={`${t.course} ${i + 1}: ${k.name[lang]}`}
                aria-current={i === idx ? "step" : undefined}
                onClick={() => scrollToProgress((i + 0.5) / n)}
              />
            ))}
          </nav>
          <span className="mq-menu-bar" aria-hidden>
            <span ref={bar} />
          </span>
          <a className="mq-menu-skip" href="#after-menu">
            {t.skipMenu}
          </a>
        </div>
      </section>
      <section className="mq-finish" id="after-menu" aria-label={t.toFinish}>
        <h3>{t.toFinish}</h3>
        <div className="mq-finish-row">
          {FINISH.map((f, i) => (
            <figure key={i} className="mq-finish-item">
              <Img src={cell(f.img)} alt={f.name[lang]} sizes="(max-width: 800px) 45vw, 18vw" widths={[400, 700]} />
              <figcaption>
                <strong>{f.name[lang]}</strong>
                <span>{f.plate[lang]}</span>
              </figcaption>
            </figure>
          ))}
          <div className="mq-finish-price">
            <p>
              <span className="mq-big">{money(MENU_PRICE, lang)}</span>
              <span>{t.perGuest}</span>
            </p>
            <p className="mq-note">
              {lang === "ar"
                ? `مشروبات المخمّرات والشاي ${money(PAIRING_PRICE, "ar")} للضيف. القائمة النباتية بالسعر نفسه.`
                : `Ferments and teas pairing ${money(PAIRING_PRICE, "en")} per guest. The vegetarian menu is the same price.`}
            </p>
            <a href="#reserve" className="mq-btn mq-btn-ember">
              {t.choose}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
