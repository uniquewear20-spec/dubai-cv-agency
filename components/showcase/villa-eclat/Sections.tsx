"use client";

// After the film: the villa in figures, the floor plans to explore room by room, a light study
// (drag between afternoon and blue hour), every room on a contact sheet, and the viewing request.

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { FIGURES, IMG, LEVELS, PAIRS, SHEET, type ImgKey } from "@/lib/showcase/villa-eclat";
import { Img } from "@/components/showcase/kit/Img";
import { EnquiryForm } from "@/components/showcase/kit/EnquiryForm";
import { sized } from "@/lib/showcase/media";

/**
 * A large picture that stays sharp on Retina screens: resized copies for small widths and
 * a 2,400 px copy at the top. Grid cells go through the shared Img.
 */
function Big({ k, alt, sizes, className, eager }: { k: ImgKey; alt: string; sizes: string; className?: string; eager?: boolean }) {
  const url = IMG[k];
  if (!url || url.startsWith("crop:") || !url.endsWith(".png")) return <Img src={url} alt={alt} sizes={sizes} className={className} widths={[800, 1200, 1600]} eager={eager} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={sized(url, 1600)}
      srcSet={`${sized(url, 800)} 800w, ${sized(url, 1200)} 1200w, ${sized(url, 1600)} 1600w, ${sized(url, 2400)} 2400w`}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );
}

/** Three gold hairlines, the house's Art Deco rule. */
export const Rule = ({ className }: { className?: string }) => (
  <span className={`ve-rule ${className ?? ""}`} aria-hidden>
    <i />
    <i />
    <i />
  </span>
);

export function Figures() {
  return (
    <section className="ve-sec ve-figs" id="residence" aria-labelledby="ve-figs-h">
      <header className="ve-sec-head">
        <h2 id="ve-figs-h">The residence</h2>
        <p>Four levels on a beachfront plot, built around one curved stair. A fictional house, described as a listing would describe it.</p>
      </header>
      <ul className="ve-figs-grid">
        {FIGURES.map((f) => (
          <li key={f.label}>
            <span className="ve-fig-n">
              {f.n}
              {f.unit && <small>{f.unit}</small>}
            </span>
            <Rule />
            <span className="ve-fig-l">{f.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Plans() {
  const [lv, setLv] = useState(1);
  const level = LEVELS[lv];
  const [room, setRoom] = useState(level.rooms[0].id);
  const active = level.rooms.find((r) => r.id === room) ?? level.rooms[0];
  const pick = (i: number) => {
    setLv(i);
    setRoom(LEVELS[i].rooms[0].id);
  };
  return (
    <section className="ve-sec ve-plans" id="plans" aria-labelledby="ve-plans-h">
      <header className="ve-sec-head">
        <h2 id="ve-plans-h">Plans</h2>
        <p>Choose a level, then a room.</p>
      </header>
      <div className="ve-tabs" role="tablist" aria-label="Levels">
        {LEVELS.map((l, i) => (
          <button key={l.id} role="tab" aria-selected={i === lv} className="ve-tab" onClick={() => pick(i)}>
            {l.name}
          </button>
        ))}
      </div>
      <div className="ve-plans-body">
        <svg className="ve-plan" viewBox="0 0 1000 640" role="img" aria-label={`${level.name} plan`}>
          <rect x="30" y="20" width="940" height="560" rx="150" className="ve-plan-wall" />
          <rect x="38" y="28" width="924" height="544" rx="142" className="ve-plan-wall ve-plan-wall-in" />
          {lv === 1 && (
            <g className="ve-plan-sea" aria-hidden>
              <path d="M60 8 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" />
            </g>
          )}
          {level.rooms.map((r) => {
            const [x, y, w, h, rx] = r.box;
            const on = r.id === active.id;
            return (
              <g key={r.id} className={`ve-room ${on ? "is-on" : ""}`} onMouseEnter={() => setRoom(r.id)} onClick={() => setRoom(r.id)}>
                <rect x={x} y={y} width={w} height={h} rx={Math.min(rx, w / 2, h / 2)} />
                <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle">
                  {r.name}
                </text>
              </g>
            );
          })}
          <g className="ve-plan-scale" aria-hidden>
            <path d="M60 612 H160 M60 606 V618 M160 606 V618" />
            <text x="172" y="616">10 m</text>
          </g>
          <g className="ve-plan-north" aria-hidden transform="translate(940 612)">
            <path d="M0 -14 L6 6 L0 2 L-6 6 Z" />
          </g>
        </svg>
        <aside className="ve-plans-side" aria-live="polite">
          <ul className="ve-plans-list">
            {level.rooms.map((r) => (
              <li key={r.id}>
                <button className={r.id === active.id ? "is-on" : ""} aria-pressed={r.id === active.id} onClick={() => setRoom(r.id)}>
                  <span>{r.name}</span>
                  <span>{r.m2} m²</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="ve-plans-card">
            {active.img ? <Img src={IMG[active.img]} alt={active.name} sizes="(max-width: 900px) 92vw, 30vw" widths={[480, 800]} /> : <span className="ve-plans-noimg" aria-hidden><Rule /></span>}
            <h3>{active.name}</h3>
            <p>{active.note}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function Light() {
  const [k, setK] = useState(0);
  const [x, setX] = useState(50);
  const pair = PAIRS[k];
  return (
    <section className="ve-sec ve-light" id="light" aria-labelledby="ve-light-h">
      <header className="ve-sec-head">
        <h2 id="ve-light-h">The same view, later</h2>
        <p>Drag across the picture to move from one hour to the next.</p>
      </header>
      <div className="ve-tabs" role="tablist" aria-label="Views">
        {PAIRS.map((p, i) => (
          <button key={p.id} role="tab" aria-selected={i === k} className="ve-tab" onClick={() => setK(i)}>
            {p.name}
          </button>
        ))}
      </div>
      <div className="ve-cmp" style={{ "--x": `${x}%` } as CSSProperties}>
        <Big className="ve-cmp-a" k={pair.a} alt={`${pair.name}, ${pair.aName.toLowerCase()}`} sizes="(max-width: 900px) 100vw, 86vw" />
        <div className="ve-cmp-b">
          <Big k={pair.b} alt={`${pair.name}, ${pair.bName.toLowerCase()}`} sizes="(max-width: 900px) 100vw, 86vw" />
        </div>
        <span className="ve-cmp-handle" aria-hidden>
          <i />
        </span>
        <span className="ve-cmp-lab ve-cmp-lab-a">{pair.aName}</span>
        <span className="ve-cmp-lab ve-cmp-lab-b">{pair.bName}</span>
        <input className="ve-cmp-range" type="range" min={0} max={100} step={0.5} value={x} onChange={(e) => setX(+e.target.value)} aria-label={`Move between ${pair.aName.toLowerCase()} and ${pair.bName.toLowerCase()}`} />
      </div>
    </section>
  );
}

/** A picture's true shape (width / height), so nothing in the reel is cropped. */
function shape(k: ImgKey) {
  const u = IMG[k];
  if (u.startsWith("crop:")) {
    const [, , , , w, h] = u.split("#")[1].split(",").map(Number);
    return w / h;
  }
  return k === "roof" || k === "aerial" ? 21 / 9 : 2720 / 1536;
}

/**
 * Every room on one strip of film. Scrolling down moves the strip sideways; each picture is shown
 * whole at its own shape, the frames curve gently toward the middle, and any frame opens full screen.
 */
export function Sheet() {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + SHEET.length) % SHEET.length)), []);

  useEffect(() => {
    const el = sec.current, tr = track.current;
    if (!el || !tr) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = [...tr.children] as HTMLElement[];
    let top = 0, span = 0, vh = innerHeight, vw = innerWidth, raf = 0, x = -1, xs = 0, last = performance.now(), live = false, shown = -1;
    const measure = () => {
      vh = innerHeight;
      vw = innerWidth;
      span = Math.max(0, tr.scrollWidth - vw);
      el.style.height = `${span + vh}px`;
      top = el.getBoundingClientRect().top + scrollY;
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const target = Math.min(1, Math.max(0, (scrollY - top) / Math.max(1, span))) * span;
      xs = calm ? target : xs + (target - xs) * (1 - Math.exp(-dt * 9));
      if (Math.abs(target - xs) < 0.3) xs = target;
      if (Math.abs(xs - x) < 0.3) return;
      x = xs;
      tr.style.transform = `translate3d(${-x.toFixed(1)}px, 0, 0)`;
      let best = 0, bestD = Infinity;
      items.forEach((it, i) => {
        const c = it.offsetLeft + it.offsetWidth / 2 - x - vw / 2;
        const d = c / vw;
        if (Math.abs(c) < bestD) { bestD = Math.abs(c); best = i; }
        if (!calm) it.style.transform = `perspective(1600px) rotateY(${(-d * 16).toFixed(2)}deg) scale(${(1 - Math.min(0.12, Math.abs(d) * 0.1)).toFixed(3)})`;
      });
      if (best !== shown && count.current) {
        shown = best;
        count.current.textContent = `${String(best + 1).padStart(2, "0")} / ${SHEET.length}`;
      }
    };
    measure();
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !live) { live = true; last = performance.now(); x = -1; raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting && live) { live = false; cancelAnimationFrame(raf); }
    });
    io.observe(el);
    const ro = new ResizeObserver(measure);
    ro.observe(tr);
    addEventListener("resize", measure);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (open === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    addEventListener("keydown", key);
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", key);
      html.style.overflow = "";
    };
  }, [open, close, step]);
  const cur = open === null ? null : SHEET[open];
  return (
    <section ref={sec} className="ve-reel" id="rooms" aria-labelledby="ve-sheet-h">
      <div className="ve-reel-stage">
        <header className="ve-reel-head">
          <h2 id="ve-sheet-h">Every room</h2>
          <p>Keep scrolling to run the reel. Open any frame to see it full screen.</p>
          <span className="ve-reel-count" ref={count} aria-hidden>01 / {SHEET.length}</span>
        </header>
        <div className="ve-reel-strip">
          <ol className="ve-reel-track" ref={track}>
            {SHEET.map((s, i) => (
              <li key={s.img} className="ve-reel-item" style={{ "--a": shape(s.img) } as CSSProperties}>
                <button
                  className="ve-reel-frame"
                  onClick={(e) => {
                    opener.current = e.currentTarget;
                    setOpen(i);
                  }}
                  aria-label={`Open ${s.name}`}
                >
                  <Big k={s.img} alt="" sizes="(max-width: 760px) 90vw, 60vw" />
                </button>
                <p className="ve-reel-cap">
                  <span>{String(i + 1).padStart(2, "0")}</span> {s.name}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {cur && open !== null && (
        <div className="ve-box" role="dialog" aria-modal="true" aria-label={cur.name} onClick={(e) => e.target === e.currentTarget && close()}>
          <figure>
            <Big k={cur.img} alt={cur.name} sizes="92vw" eager />
            <figcaption>
              <span>{String(open + 1).padStart(2, "0")}</span> {cur.name}
            </figcaption>
          </figure>
          <button className="ve-box-x" onClick={close} autoFocus aria-label="Close">
            Close
          </button>
          <button className="ve-box-prev" onClick={() => step(-1)} aria-label="Previous room">
            Previous
          </button>
          <button className="ve-box-next" onClick={() => step(1)} aria-label="Next room">
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export function Viewing() {
  return (
    <section className="ve-sec ve-view" id="viewing" aria-labelledby="ve-view-h">
      <div className="ve-view-art" aria-hidden>
        <Big k="night" alt="" sizes="(max-width: 900px) 100vw, 50vw" />
      </div>
      <div className="ve-view-body">
        <h2 id="ve-view-h">Private viewings</h2>
        <p>Viewings are by appointment, at the villa or by video call. Tell us what you would like to see and when suits you.</p>
        <EnquiryForm
          site="villa-eclat"
          lang="en"
          prefix="ve"
          interestOptions={["A private viewing at the villa", "A video call walk-through", "The plans and full specification", "Something else"]}
          labels={{
            name: "Name",
            email: "Email",
            interest: "You would like",
            message: "Dates, times or questions",
            send: "Request a viewing",
            sending: "Sending",
            sent: "Thank you. Your request has been received, and you will hear back by email.",
            errs: {
              missing: "Please add your name and email.",
              email: "Please check the email address.",
              rate: "Too many messages from this connection. Please try again in an hour.",
              invalid: "Something was missing. Reload the page and try again.",
              unavailable: "The form is not available right now. Email hello@zenithdubaicv.com instead.",
            },
          }}
          footnote={<p className="ve-form-note">Villa Éclat is a fictional property in a concept website by Zenith Dubai. Your message goes to Zenith Dubai.</p>}
        />
      </div>
    </section>
  );
}
