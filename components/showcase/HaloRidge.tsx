"use client";

// Halo Ridge: a scroll-controlled flight into a fictional villa community, then the details a buyer
// looks for. Built by Zenith Dubai as a concept website; nothing here is a real development.
//
// The flight is a sticky stage driven by scroll progress. Each scene holds on a view while its
// caption reads, then flies to the next view: by scrubbing a generated clip when one exists, or by
// pushing into the still and dissolving into the next one until it does. Scroll position is the
// only clock, so the visitor can stop, reverse or jump to any scene.

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  AMENITIES, AMENITY_ASSET, FLOORS, MATERIALS, MATERIAL_ASSETS, PAYMENT, RESIDENCES, SCENES, UI,
  sized, srcSet, type Lang,
} from "@/lib/showcase/halo-ridge";
import { CONTACT_EMAIL } from "@/lib/site";

const N = SCENES.length;
const RING = 2 * Math.PI * 26;
/** Share of each scene spent holding on the view, before the flight to the next one. */
const HOLD = 0.4;

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (a: number, b: number, v: number) => {
  const x = clamp((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
/** Camera progress through one scene: a slow drift while the caption reads, then the flight. */
const camera = (t: number) => (t < HOLD ? (t / HOLD) * 0.06 : 0.06 + 0.94 * ease(HOLD, 1, t));
const fmt = (n: number) => n.toLocaleString("en-US");
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Room = (typeof FLOORS)[number]["rooms"][number];
type Media = HTMLImageElement | HTMLVideoElement | null;

export default function HaloRidge() {
  const [lang, setLang] = useState<Lang>("en");
  const [active, setActive] = useState(0);

  const journeyRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const shots = useRef<(HTMLDivElement | null)[]>([]);
  const media = useRef<Media[]>([]);
  const caps = useRef<(HTMLDivElement | null)[]>([]);

  // Arabic can be linked directly with ?lang=ar.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("lang") === "ar") setLang("ar");
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === "en" ? "ar" : "en";
    setLang(next);
    const url = new URL(window.location.href);
    if (next === "ar") url.searchParams.set("lang", "ar");
    else url.searchParams.delete("lang");
    window.history.replaceState(null, "", url);
  };

  // The flight engine.
  useEffect(() => {
    const sec = journeyRef.current;
    if (!sec) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = 0;
    let cur = -1;
    let raf = 0;
    let running = false;
    let shown = 0;

    const load = (j: number) => {
      const m = media.current[j];
      if (!m) return;
      if (m.dataset.srcset && !m.getAttribute("srcset")) m.setAttribute("srcset", m.dataset.srcset);
      if (m.dataset.src && !m.getAttribute("src")) m.setAttribute("src", m.dataset.src);
      if (m instanceof HTMLVideoElement && !m.dataset.ready) {
        m.dataset.ready = "1";
        m.preload = "auto";
        // iOS only decodes frames for seeking once a muted video has started; play and pause at once.
        m.play().then(() => m.pause()).catch(() => {});
      }
    };

    const measure = () => {
      const r = sec.getBoundingClientRect();
      const dist = r.height - window.innerHeight;
      target = dist > 0 ? clamp(-r.top / dist) : 0;
      if (barRef.current) barRef.current.dataset.solid = r.bottom <= 72 ? "1" : "0";
    };

    const render = (p: number) => {
      const still = motion.matches;
      const f = Math.min(p * N, N - 1e-4);
      const i = Math.floor(f);
      const t = f - i;
      const last = i === N - 1;
      const u = last ? t : camera(t);
      const lead = media.current[i];
      const clipLeads = lead instanceof HTMLVideoElement && !still;

      for (let j = 0; j < N; j++) {
        const shot = shots.current[j];
        if (!shot) continue;
        let o = 0;
        if (j === i) o = 1;
        else if (j === i + 1) o = ease(clipLeads ? 0.95 : 0.84, 1, t);
        shot.style.opacity = String(o);
        shot.style.visibility = o > 0 ? "visible" : "hidden";
        const m = media.current[j];
        if (!m) continue;
        if (o === 0) {
          m.style.willChange = "auto";
          continue;
        }
        if (m instanceof HTMLVideoElement) {
          if (still) continue; // the poster (the opening still) stands in for the clip
          const want = j === i ? u * Math.max(0, (m.duration || 0) - 0.05) : 0;
          if (m.readyState >= 1 && !m.seeking && Math.abs(m.currentTime - want) > 0.012) m.currentTime = want;
        } else {
          m.style.willChange = still ? "auto" : "transform";
          const s = still || j !== i ? 1 : 1 + (last ? 0.06 : 0.16) * u;
          m.style.transform = s === 1 ? "" : `scale(${s.toFixed(4)})`;
        }
      }

      for (let j = 0; j < N; j++) {
        const c = caps.current[j];
        if (!c) continue;
        const o = j === i ? (i === 0 ? 1 : ease(0, 0.1, t)) * (last ? 1 : 1 - ease(0.3, 0.42, t)) : 0;
        c.style.opacity = String(o);
        c.style.pointerEvents = o > 0.5 ? "auto" : "none";
        c.style.transform = still || o === 0 || o === 1 ? "" : `translateY(${((1 - o) * (t < 0.2 ? 14 : -14)).toFixed(1)}px)`;
      }

      ringRef.current?.style.setProperty("stroke-dashoffset", String(RING * (1 - p)));
      if (hintRef.current) hintRef.current.style.opacity = p < 0.01 ? "1" : "0";

      if (i !== shown) {
        shown = i;
        setActive(i);
      }
      load(i);
      load(i + 1);
      load(i + 2);
    };

    const frame = () => {
      measure();
      if (cur < 0 || motion.matches) cur = target;
      else cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 1e-4) cur = target;
      render(cur);
      if (cur !== target) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const videos = media.current.filter((m): m is HTMLVideoElement => m instanceof HTMLVideoElement);
    videos.forEach((v) => {
      v.addEventListener("seeked", kick);
      v.addEventListener("loadedmetadata", kick);
    });
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      videos.forEach((v) => {
        v.removeEventListener("seeked", kick);
        v.removeEventListener("loadedmetadata", kick);
      });
    };
  }, []);

  /** Scrolls to a scene, landing just after its caption has come in. */
  const go = useCallback((j: number) => {
    const sec = journeyRef.current;
    if (!sec) return;
    const k = clamp(j, 0, N - 1);
    const r = sec.getBoundingClientRect();
    const dist = r.height - window.innerHeight;
    const top = window.scrollY + r.top + ((k + (k === 0 ? 0 : 0.12)) / N) * dist;
    window.scrollTo({ top, behavior: reduced() ? "auto" : "smooth" });
  }, []);

  const goScene = useCallback((id: string) => go(SCENES.findIndex((s) => s.id === id)), [go]);

  return (
    <div className="hr" lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <a className="hr-skip" href="#enquire">{UI.skip[lang]}</a>

      <header className="hr-bar" ref={barRef} data-solid="0">
        <span className="hr-mark">{lang === "ar" ? "هالو ريدج" : "Halo Ridge"}</span>
        <span className="hr-tag">{UI.tag[lang]}</span>
        <p className="hr-note">{UI.concept[lang]}</p>
        <Link href="/showcase/" className="hr-back">{UI.back[lang]}</Link>
        <button type="button" className="hr-lang" onClick={toggleLang} lang={lang === "en" ? "ar" : "en"}>
          {UI.lang[lang]}
        </button>
      </header>

      <main>
        <section className="hr-journey" ref={journeyRef} aria-label={UI.journey[lang]} style={{ height: `${N * 105}vh` }}>
          <div className="hr-stage">
            {SCENES.map((s, j) => {
              const pos = `${s.focus.x}% ${s.focus.y}%`;
              const eager = j < 2;
              return (
                <div key={s.id} className={j === 0 ? "hr-shot is-first" : "hr-shot"} ref={(el) => { shots.current[j] = el; }}>
                  {s.clip.url ? (
                    <video
                      ref={(el) => { media.current[j] = el; }}
                      src={eager ? s.clip.url : undefined}
                      data-src={eager ? undefined : s.clip.url}
                      poster={s.still.url ? sized(s.still.url, 1920) : undefined}
                      muted
                      playsInline
                      preload={eager ? "auto" : "none"}
                      aria-hidden="true"
                      style={{ objectPosition: pos }}
                    />
                  ) : s.still.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      ref={(el) => { media.current[j] = el; }}
                      src={eager ? sized(s.still.url, 1920) : undefined}
                      srcSet={eager ? srcSet(s.still.url) : undefined}
                      data-src={eager ? undefined : sized(s.still.url, 1920)}
                      data-srcset={eager ? undefined : srcSet(s.still.url)}
                      sizes="max(100vw, 177.8vh)"
                      alt=""
                      decoding="async"
                      fetchPriority={j === 0 ? "high" : "auto"}
                      style={{ objectPosition: pos, transformOrigin: pos }}
                    />
                  ) : (
                    <div className="hr-empty" style={{ backgroundPosition: pos }} />
                  )}
                </div>
              );
            })}
            <div className="hr-scrim" />

            {SCENES.map((s, j) => (
              <div key={s.id} className={j === 0 ? "hr-cap is-first" : "hr-cap"} ref={(el) => { caps.current[j] = el; }}>
                <p className="hr-kick">{s.kicker[lang]}</p>
                {j === 0 ? <h1>{s.title[lang]}</h1> : <h2>{s.title[lang]}</h2>}
                <p>{s.body[lang]}</p>
                {s.facts ? (
                  <dl className="hr-facts">
                    {s.facts.map((f) => (
                      <div key={f.label.en}>
                        <dt>{f.label[lang]}</dt>
                        <dd>{f.value[lang]}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            ))}

            <svg className="hr-halo" viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(243,238,230,.28)" strokeWidth="1.5" />
              <circle
                ref={ringRef}
                cx="30" cy="30" r="26" fill="none" stroke="#CDB07A" strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray={RING} strokeDashoffset={RING} transform="rotate(-90 30 30)"
              />
              <text x="30" y="35.5" textAnchor="middle">{String(active + 1).padStart(2, "0")}</text>
            </svg>

            <nav className="hr-index" aria-label={UI.scenes[lang]}>
              <ol>
                {SCENES.map((s, j) => (
                  <li key={s.id}>
                    <button type="button" aria-current={active === j ? "step" : undefined} onClick={() => go(j)}>
                      <span>{s.kicker[lang]}</span>
                      <i />
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="hr-steps">
              <button type="button" aria-label={UI.prev[lang]} disabled={active === 0} onClick={() => go(active - 1)}>
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4.5 12.5 10 7l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
              <button type="button" aria-label={UI.next[lang]} disabled={active === N - 1} onClick={() => go(active + 1)}>
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4.5 7.5 10 13l5.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
            </div>

            <p className="hr-hint" ref={hintRef}>{UI.scroll[lang]}</p>
          </div>
        </section>

        <section className="hr-sec" id="residences" aria-labelledby="hr-res-h">
          <div className="hr-in">
            <h2 id="hr-res-h">{UI.residences[lang]}</h2>
            <ul className="hr-res">
              {RESIDENCES.map((r) => (
                <li key={r.id}>
                  <div>
                    <h3>{r.name[lang]}</h3>
                    <span className="hr-count">{r.count} {UI.of[lang]}</span>
                  </div>
                  <span className="hr-num">{r.beds}<small>{UI.beds[lang]}</small></span>
                  <span className="hr-num">{fmt(r.built)} {lang === "ar" ? "قدم²" : "ft²"}<small>{UI.built[lang]}</small></span>
                  <span className="hr-num">{fmt(r.plot)} {lang === "ar" ? "قدم²" : "ft²"}<small>{UI.plot[lang]}</small></span>
                  <p>{r.note[lang]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="hr-sec" aria-labelledby="hr-plan-h">
          <div className="hr-in">
            <h2 id="hr-plan-h">{UI.plans[lang]}</h2>
            <p className="hr-lead">{UI.plansHint[lang]}</p>
            <Plans lang={lang} onSee={goScene} />
          </div>
        </section>

        <section className="hr-sec" aria-labelledby="hr-amen-h">
          <div className="hr-in">
            <h2 id="hr-amen-h">{UI.amenities[lang]}</h2>
            <div className={AMENITY_ASSET.url ? "hr-amen" : "hr-amen solo"}>
              <dl>
                {AMENITIES.map((a) => (
                  <div key={a.name.en} className="hr-amen-row">
                    <dt>{a.name[lang]}</dt>
                    <dd>{a.value[lang]}</dd>
                  </div>
                ))}
              </dl>
              {AMENITY_ASSET.url ? (
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sized(AMENITY_ASSET.url, 1280)} srcSet={srcSet(AMENITY_ASSET.url, [800, 1280, 1920])} sizes="(max-width: 860px) 100vw, 50vw" alt="" loading="lazy" decoding="async" />
                </figure>
              ) : null}
            </div>
          </div>
        </section>

        <section className="hr-sec" aria-labelledby="hr-loc-h">
          <div className="hr-in">
            <h2 id="hr-loc-h">{UI.location[lang]}</h2>
            <Location lang={lang} />
          </div>
        </section>

        <section className="hr-sec" aria-labelledby="hr-mat-h">
          <div className="hr-in">
            <h2 id="hr-mat-h">{UI.materials[lang]}</h2>
            <div className="hr-mat">
              {MATERIALS.map((m) => {
                const asset = MATERIAL_ASSETS[m.id];
                return (
                  <figure key={m.id}>
                    <div className={`hr-sw ${m.id}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {asset?.url ? <img src={sized(asset.url, 800)} srcSet={srcSet(asset.url, [480, 800, 1200])} sizes="(max-width: 860px) 50vw, 25vw" alt="" loading="lazy" decoding="async" /> : null}
                    </div>
                    <figcaption>
                      <h3>{m.name[lang]}</h3>
                      <p>{m.text[lang]}</p>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>

        <section className="hr-sec" aria-labelledby="hr-pay-h">
          <div className="hr-in">
            <h2 id="hr-pay-h">{UI.payment[lang]}</h2>
            <div className="hr-pay" aria-hidden="true">
              {PAYMENT.map((p) => <i key={p.share} style={{ flexGrow: p.share }} />)}
            </div>
            <ol className="hr-pay-l">
              {PAYMENT.map((p) => (
                <li key={p.share} style={{ flexGrow: p.share }}>
                  <b>{p.share}%</b>
                  <span>{p.label[lang]}</span>
                </li>
              ))}
            </ol>
            <p className="hr-small">{UI.paymentNote[lang]}</p>
          </div>
        </section>

        <section className="hr-sec" id="enquire" aria-labelledby="hr-enq-h">
          <div className="hr-in">
            <h2 id="hr-enq-h">{UI.enquire[lang]}</h2>
            <p className="hr-lead">{UI.enquireNote[lang]}</p>
            <Enquiry lang={lang} />
          </div>
        </section>
      </main>

      <footer className="hr-foot">
        <p>{UI.footer[lang]}</p>
        <Link href="/showcase/">{UI.back[lang]}</Link>
      </footer>
    </div>
  );
}

/** The Lake Villa plan. Rooms are real buttons laid over the drawing, so labels wrap and stay legible. */
function Plans({ lang, onSee }: { lang: Lang; onSee: (scene: string) => void }) {
  const [floor, setFloor] = useState(0);
  const [roomId, setRoomId] = useState<string>("living");
  const rooms = FLOORS[floor].rooms as readonly Room[];
  const room = rooms.find((r) => r.id === roomId) ?? rooms[0];

  const pickFloor = (k: number) => {
    setFloor(k);
    const list = FLOORS[k].rooms as readonly Room[];
    setRoomId((list.find((r) => r.scene) ?? list[0]).id);
  };

  return (
    <div className="hr-plan">
      <div>
        <div className="hr-tabs" role="group" aria-label={UI.floors[lang]}>
          {FLOORS.map((f, k) => (
            <button key={f.id} type="button" aria-pressed={k === floor} onClick={() => pickFloor(k)}>
              {f.name[lang]}
            </button>
          ))}
        </div>
        <div className="hr-draw" dir="ltr">
          {rooms.map((r) => (
            <button
              key={r.id}
              type="button"
              className="hr-room"
              aria-pressed={r.id === room.id}
              lang={lang}
              dir={lang === "ar" ? "rtl" : "ltr"}
              style={{ left: `${(r.x / 24) * 100}%`, top: `${(r.y / 16) * 100}%`, width: `${(r.w / 24) * 100}%`, height: `${(r.h / 16) * 100}%` }}
              onClick={() => setRoomId(r.id)}
            >
              {r.name[lang]}
            </button>
          ))}
        </div>
      </div>
      <div className="hr-panel" aria-live="polite">
        <h3>{room.name[lang]}</h3>
        <span className="hr-num">
          {room.area} {lang === "ar" ? "م²" : "m²"}
          <small>{fmt(Math.round((room.area * 10.764) / 10) * 10)} {lang === "ar" ? "قدم²" : "ft²"}</small>
        </span>
        {room.scene ? (
          <button type="button" className="hr-btn" onClick={() => onSee(room.scene as string)}>
            {UI.seeIt[lang]}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Drive-time rings drawn around the site, the same halo as the progress ring in the flight. */
function Location({ lang }: { lang: Lang }) {
  const facts = SCENES.find((s) => s.id === "dusk")?.facts ?? [];
  const angles = [-40, 198, 112];
  const k = 5.6;
  return (
    <div className="hr-loc">
      <svg viewBox="-200 -200 400 400" role="img" aria-label={UI.mapLabel[lang]}>
        {[10, 20, 30].map((m) => (
          <g key={m}>
            <circle r={m * k} fill="none" stroke="rgba(28,33,29,.22)" strokeDasharray="2 6" />
            <text y={-m * k - 6} textAnchor="middle" className="hr-ring-l">{m} {UI.minutes[lang]}</text>
          </g>
        ))}
        <circle r="20" fill="none" stroke="#9C7F4C" strokeOpacity=".55" />
        <circle r="6" fill="#9C7F4C" />
        <text y="38" textAnchor="middle" className="hr-site-l">{lang === "ar" ? "هالو ريدج" : "Halo Ridge"}</text>
        {facts.map((f, n) => {
          const min = parseInt(f.value.en, 10);
          const a = (angles[n] * Math.PI) / 180;
          const x = Math.cos(a) * min * k;
          const y = Math.sin(a) * min * k;
          return (
            <g key={f.label.en}>
              <line x1="0" y1="0" x2={x} y2={y} stroke="#24504A" strokeOpacity=".5" />
              <circle cx={x} cy={y} r="5" fill="#24504A" />
              <text x={x} y={y - 12} textAnchor="middle" className="hr-dest-l">{f.label[lang]}</text>
            </g>
          );
        })}
      </svg>
      <div>
        <ol>
          {facts.map((f) => (
            <li key={f.label.en}>
              <span>{f.label[lang]}</span>
              <b>{f.value[lang]}</b>
            </li>
          ))}
        </ol>
        <p className="hr-small">{UI.locationNote[lang]}</p>
      </div>
    </div>
  );
}

type SendState = "idle" | "sending" | "sent" | "failed" | "email" | "missing" | "rate";

function Enquiry({ lang }: { lang: Lang }) {
  const [state, setState] = useState<SendState>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const res = await fetch("/api/showcase-enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, site: "halo-ridge", lang }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        setState("sent");
        form.reset();
      } else if (json.error === "email" || json.error === "missing" || json.error === "rate") {
        setState(json.error);
      } else {
        setState("failed");
      }
    } catch {
      setState("failed");
    }
  };

  const message =
    state === "sending" ? UI.sending[lang]
    : state === "sent" ? UI.sent[lang]
    : state === "email" ? UI.errEmail[lang]
    : state === "missing" ? UI.errMissing[lang]
    : state === "rate" ? UI.errRate[lang].replace("{email}", CONTACT_EMAIL)
    : state === "failed" ? UI.failed[lang].replace("{email}", CONTACT_EMAIL)
    : "";

  return (
    <form className="hr-form" onSubmit={onSubmit} noValidate={false}>
      <label>
        {UI.name[lang]}
        <input name="name" required autoComplete="name" maxLength={120} />
      </label>
      <label>
        {UI.email[lang]}
        <input name="email" type="email" required autoComplete="email" maxLength={200} dir="ltr" />
      </label>
      <label className="full">
        {UI.interest[lang]}
        <select name="interest" defaultValue="">
          <option value="">{UI.notSure[lang]}</option>
          {RESIDENCES.map((r) => (
            <option key={r.id} value={r.name.en}>{r.name[lang]}</option>
          ))}
        </select>
      </label>
      <label className="full">
        {UI.message[lang]}
        <textarea name="message" maxLength={2000} />
      </label>
      <label className="hp" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="full">
        <button type="submit" className="hr-btn" disabled={state === "sending"}>{UI.send[lang]}</button>
      </div>
      <p className="hr-status" role="status" aria-live="polite">{message}</p>
    </form>
  );
}
