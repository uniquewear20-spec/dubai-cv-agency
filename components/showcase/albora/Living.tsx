"use client";

// Life inside the walls: the rooms and their materials, the terraces and what each row looks at,
// the village services, a house that runs itself in scenes, how the village would be built, and
// a gallery with a full-screen viewer.

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ALT, AMENITIES, GALLERY, GRID, IMG, KINDS, SCENES, TIMELINE, type Kind, type SceneId } from "@/lib/showcase/albora";
import { useDialog } from "../kit/hooks";
import { Img } from "../kit/Img";
import { goToScene, sceneProgress, useAlbora, useScene } from "./state";

const v = (o: Record<string, string | number>) => o as CSSProperties;

export function Living() {
  const { t, lang } = useAlbora();
  const [tab, setTab] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (d: number) => {
    const n = (tab + d + 4) % 4;
    setTab(n);
    tabs.current[n]?.focus();
  };
  return (
    <section className="al-living" id="living" aria-labelledby="al-living-h">
      <div className="al-living-hero">
        <div className="al-px" data-px="0.1">
          <Img src={IMG.living} alt={ALT.living[lang]} sizes="100vw" widths={[800, 1200, 1600, 2400]} />
        </div>
        <h2 id="al-living-h" className="al-living-title">
          <span>{t.livingTitle}</span>
          <span className="al-script" aria-hidden>
            {t.livingScript}
          </span>
        </h2>
      </div>
      <p className="al-lede al-living-body">{t.livingBody}</p>
      <div className="al-rooms">
        <h3 className="al-h3">{t.interiorsTitle}</h3>
        <div role="tablist" aria-label={t.interiorsTitle} className="al-tabs">
          {t.interiorTabs.map((name, i) => (
            <button
              key={name}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`al-tab-${i}`}
              aria-selected={tab === i}
              aria-controls="al-tabpanel"
              tabIndex={tab === i ? 0 : -1}
              onClick={() => setTab(i)}
              onKeyDown={(e) => {
                const rtl = lang === "ar";
                if (e.key === (rtl ? "ArrowLeft" : "ArrowRight")) move(1);
                if (e.key === (rtl ? "ArrowRight" : "ArrowLeft")) move(-1);
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <div id="al-tabpanel" role="tabpanel" aria-labelledby={`al-tab-${tab}`} className="al-tabpanel">
          <Img key={tab} src={GRID.interiors[tab]} alt={t.interiorTabs[tab]} sizes="(max-width: 900px) 100vw, 60vw" className="al-room-img" />
        </div>
        <ul className="al-materials">
          {t.materialNames.map((name, i) => (
            <li key={name}>
              <Img src={GRID.materials[i]} alt="" sizes="(max-width: 700px) 45vw, 18vw" className="al-swatch" />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Terraces() {
  const { t, lang } = useAlbora();
  return (
    <section className="al-terraces" id="views" aria-labelledby="al-terr-h">
      <figure className="al-terr-img">
        <div className="al-px" data-px="0.12">
          <Img src={IMG.terrace} alt={ALT.terrace[lang]} sizes="(max-width: 900px) 100vw, 44vw" />
        </div>
      </figure>
      <div className="al-terr-copy">
        <h2 id="al-terr-h" className="al-display">
          {t.terraceTitle}
        </h2>
        <p>{t.terraceBody}</p>
        <dl className="al-kinds">
          {(["roof", "terrace", "garden"] as Kind[]).map((k) => (
            <div key={k}>
              <dt>{KINDS[k].name[lang]}</dt>
              <dd>{KINDS[k].note[lang]}</dd>
            </div>
          ))}
        </dl>
        <a href="#residences" className="al-btn al-btn-ink">
          {t.selectHome}
        </a>
      </div>
    </section>
  );
}

export function Amenities() {
  const { t, lang } = useAlbora();
  return (
    <section className="al-amen" id="amenities" aria-labelledby="al-amen-h">
      <h2 id="al-amen-h" className="al-display">
        {t.amenTitle}
      </h2>
      <dl className="al-amen-list">
        {AMENITIES.map((a) => (
          <div key={a.t.en}>
            <dt>{a.t[lang]}</dt>
            <dd>{a.b[lang]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function SmartHome() {
  const { t, lang } = useAlbora();
  const [id, setId] = useState<SceneId>("evening");
  const s = SCENES.find((x) => x.id === id)!;
  const lamps: [number, number][] = [
    [70, 70],
    [170, 60],
    [250, 120],
    [90, 150],
    [300, 190],
    [200, 200],
  ];
  const windows = [40, 120, 200, 280];
  return (
    <section className="al-smart" id="smart" aria-labelledby="al-smart-h">
      <div className="al-smart-copy">
        <h2 id="al-smart-h" className="al-display">
          {t.homeTitle}
        </h2>
        <p>{t.homeBody}</p>
        <div role="group" aria-label={t.scene} className="al-scenes">
          {SCENES.map((x) => (
            <button key={x.id} type="button" aria-pressed={id === x.id} onClick={() => setId(x.id)}>
              {x.name[lang]}
            </button>
          ))}
        </div>
        <p className="al-scene-note" aria-live="polite">
          {s.note[lang]}
        </p>
        <dl className="al-readout">
          <div>
            <dt>{t.lights}</dt>
            <dd>{Math.round(s.lights * 100)}%</dd>
          </div>
          <div>
            <dt>{t.shutters}</dt>
            <dd>{s.shutters === 0 ? t.closed : s.shutters === 1 ? t.open : `${Math.round(s.shutters * 100)}%`}</dd>
          </div>
          <div>
            <dt>{t.air}</dt>
            <dd>{s.temp}°C</dd>
          </div>
          <div>
            <dt>{t.poolLights}</dt>
            <dd>{s.pool ? t.on : t.off}</dd>
          </div>
        </dl>
      </div>
      <svg className="al-smart-plan" viewBox="0 0 360 300" aria-hidden style={v({ "--l": s.lights, "--s": s.shutters })} data-scene={id}>
        <defs>
          <radialGradient id="al-glow">
            <stop offset="0" stopColor="#ffd27a" stopOpacity="0.85" />
            <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x={20} y={20} width={320} height={200} className="al-sp-wall" />
        <line x1={140} y1={20} x2={140} y2={220} className="al-sp-in" />
        <line x1={230} y1={100} x2={340} y2={100} className="al-sp-in" />
        {windows.map((x) => (
          <g key={x}>
            <rect x={x} y={14} width={50} height={12} className="al-sp-win" />
            <rect x={x} y={14} width={50} height={12} className="al-sp-shutter" style={v({ transform: `scaleX(${(1 - s.shutters).toFixed(2)})`, transformOrigin: `${x}px 20px` })} />
          </g>
        ))}
        {lamps.map(([x, y]) => (
          <g key={`${x}-${y}`} className="al-sp-lamp" transform={`translate(${x} ${y})`}>
            <circle r={38} className="al-sp-glow" />
            <circle r={4} />
          </g>
        ))}
        <rect x={40} y={236} width={280} height={44} rx={4} className={`al-sp-pool${s.pool ? " is-on" : ""}`} />
        <text x={180} y={150} textAnchor="middle" className="al-sp-temp">
          {s.temp}°
        </text>
      </svg>
    </section>
  );
}

export function Story() {
  const { t, lang } = useAlbora();
  return (
    <section className="al-story" id="story" aria-labelledby="al-story-h">
      <h2 id="al-story-h" className="al-display">
        {t.storyTitle}
      </h2>
      <p className="al-small">{t.storyNote}</p>
      <ol className="al-timeline">
        {TIMELINE.map((s) => (
          <li key={s.when}>
            <span className="al-when">{s.when}</span>
            <strong>{s.t[lang]}</strong>
            <span>{s.b[lang]}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The gallery travels sideways as you scroll down; each photograph drifts inside its frame. */
export function Gallery() {
  const { t, lang, open, setShot } = useAlbora();
  const ref = useScene("pin");
  const step = (d: number) => goToScene("gallery", sceneProgress("gallery") + d / (GALLERY.length - 1));
  return (
    <section className="al-gallery al-pin" id="gallery" ref={ref} aria-labelledby="al-gal-h">
      <div className="al-stage">
        <div className="al-gal-head">
          <h2 id="al-gal-h" className="al-display">
            {t.galleryTitle}
          </h2>
          <p className="al-small">{t.galleryHint}</p>
          <div className="al-gal-nav">
            <button type="button" onClick={() => step(-1)} aria-label={t.prev}>
              ‹
            </button>
            <button type="button" onClick={() => step(1)} aria-label={t.next}>
              ›
            </button>
          </div>
        </div>
        <ul className="al-strip">
          {GALLERY.map((k, i) => (
            <li key={k}>
              <button
                type="button"
                onClick={() => {
                  setShot(i);
                  open("gallery");
                }}
                aria-label={`${ALT[k][lang]} (${i + 1} ${t.of} ${GALLERY.length})`}
              >
                <span className="al-gal-px">
                  <Img src={IMG[k]} alt="" sizes="(max-width: 700px) 90vw, 50vw" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Lightbox />
    </section>
  );
}

function Lightbox() {
  const { t, lang, overlay, open, shot, setShot } = useAlbora();
  const isOpen = overlay === "gallery";
  const box = useDialog(isOpen, () => open(null));
  useEffect(() => {
    if (!isOpen) return;
    const key = (e: KeyboardEvent) => {
      const rtl = lang === "ar";
      if (e.key === "ArrowRight") setShot((shot + (rtl ? -1 : 1) + GALLERY.length) % GALLERY.length);
      if (e.key === "ArrowLeft") setShot((shot + (rtl ? 1 : -1) + GALLERY.length) % GALLERY.length);
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [isOpen, shot, setShot, lang]);
  if (!isOpen) return null;
  const k = GALLERY[shot];
  return (
    <div className="al-light" role="dialog" aria-modal="true" aria-label={t.galleryTitle}>
      <div className="al-light-box" ref={box}>
        <button type="button" className="al-close al-light-close" onClick={() => open(null)} data-autofocus>
          {t.close}
        </button>
        <figure>
          <Img key={k} src={IMG[k]} alt={ALT[k][lang]} sizes="100vw" widths={[1200, 1600, 2400]} eager />
          <figcaption>
            <span>
              {shot + 1} {t.of} {GALLERY.length}
            </span>
            {ALT[k][lang]}
          </figcaption>
        </figure>
        <button type="button" className="al-light-prev" onClick={() => setShot((shot - 1 + GALLERY.length) % GALLERY.length)} aria-label={t.prev}>
          ‹
        </button>
        <button type="button" className="al-light-next" onClick={() => setShot((shot + 1) % GALLERY.length)} aria-label={t.next}>
          ›
        </button>
      </div>
    </div>
  );
}
