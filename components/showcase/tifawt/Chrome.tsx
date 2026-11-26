"use client";

// The parts of TIFAWT shared by the home page and the product pages: the logo, the four corner
// links (after the reference site's corner navigation), the cursor, the bag, the concept notice,
// the enquiry form and the footer.

import Link from "next/link";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { FREE_SHIPPING, PRODUCTS, COFFRETS, money, sized, type Lang } from "@/lib/showcase/tifawt";
import { nameOf, priceOf, useTifawt } from "./state";

export const BASE = "/showcase/tifawt/";

/** A Higgsfield still served through the resizing proxy at a few widths. */
export function Img({
  src,
  alt,
  sizes = "100vw",
  widths = [480, 800, 1200, 1600],
  className,
  style,
  eager,
}: {
  src: string;
  alt: string;
  sizes?: string;
  widths?: number[];
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}) {
  if (!src) return <span className={`tf-img-missing ${className ?? ""}`} style={style} aria-hidden />;
  const proxied = src.includes("cloudfront.net");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={proxied ? sized(src, widths[Math.min(2, widths.length - 1)]) : src}
      srcSet={proxied ? widths.map((w) => `${sized(src, w)} ${w}w`).join(", ") : undefined}
      sizes={sizes}
      alt={alt}
      className={className}
      style={style}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );
}

/** The argan tree at first light (tifawt): its crown opens like the rising sun, thirteen leaves
 *  fanned over a twisted trunk, and at its heart a single drop of oil. */
const LEAVES =
  "M39.53 25.94Q48.32 27.13 56.45 23.56Q47.65 22.38 39.53 25.94ZM39.05 24.15Q47.27 23.96 53.32 18.39Q45.10 18.58 39.05 24.15ZM38.15 22.53Q45.18 21.01 48.81 14.79Q41.77 16.31 38.15 22.53ZM36.89 21.18Q42.72 18.74 44.11 12.57Q38.28 15.01 36.89 21.18ZM35.33 20.17Q40.10 17.00 39.66 11.29Q34.89 14.46 35.33 20.17ZM33.58 19.57Q37.36 15.72 35.47 10.66Q31.69 14.51 33.58 19.57ZM32.00 19.40Q34.90 14.95 32.00 10.50Q29.10 14.95 32.00 19.40ZM30.42 19.57Q32.31 14.51 28.53 10.66Q26.64 15.72 30.42 19.57ZM28.67 20.17Q29.11 14.46 24.34 11.29Q23.90 17.00 28.67 20.17ZM27.11 21.18Q25.72 15.01 19.89 12.57Q21.28 18.74 27.11 21.18ZM25.85 22.53Q22.23 16.31 15.19 14.79Q18.82 21.01 25.85 22.53ZM24.95 24.15Q18.90 18.58 10.68 18.39Q16.73 23.96 24.95 24.15ZM24.47 25.94Q16.35 22.38 7.55 23.56Q15.68 27.13 24.47 25.94Z";
const TRUNK = "M30.4 28.6C31 31.6 29.2 33.8 29.6 37C29.9 39.4 28.6 41.6 26.4 43.4L37.6 43.4C35.4 41.6 34.1 39.4 34.4 37C34.8 33.8 33 31.6 33.6 28.6Z";
const DROP = "M32 18.6C33.5 20.9 35 22.4 35 24.2A3 3 0 0 1 29 24.2C29 22.4 30.5 20.9 32 18.6Z";

export function Mark({ size = 30 }: { size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const g = `tg${uid}`;
  return (
    <svg width={(size * 64) / 48} height={size} viewBox="0 0 64 48" aria-hidden className="tf-mark">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--g1)" />
          <stop offset="0.32" stopColor="var(--g2)" />
          <stop offset="0.52" stopColor="var(--g3)" />
          <stop offset="0.74" stopColor="var(--g4)" />
          <stop offset="1" stopColor="var(--g5)" />
        </linearGradient>
      </defs>
      <g fill={`url(#${g})`}>
        <path d={LEAVES} />
        <path d={TRUNK} />
        <path d={DROP} />
      </g>
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`tf-logo${compact ? " is-compact" : ""}`}>
      <Mark size={compact ? 36 : 48} />
      <span className="tf-logo-word">TIFAWT</span>
      {!compact && (
        <span className="tf-logo-sub">
          <i aria-hidden />
          Agadir
          <i aria-hidden />
        </span>
      )}
    </span>
  );
}

export const Arrow = ({ flip }: { flip?: boolean }) => (
  <svg width="11" height="11" viewBox="0 0 13 13" fill="none" aria-hidden className="tf-arrow" style={flip ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M1.5 11.5l10-10M5.5 1.5h6v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Watches which section sits under the top and bottom corners so the corner links stay legible. */
function useInk() {
  const [ink, setInk] = useState<{ top: string; bottom: string }>({ top: "light", bottom: "light" });
  useEffect(() => {
    let raf = 0;
    const read = (y: number) => {
      const els = document.elementsFromPoint(window.innerWidth / 2, y);
      for (const el of els) {
        const s = (el as HTMLElement).closest?.("[data-ink]") as HTMLElement | null;
        if (s && !s.closest(".tf-corners")) return s.dataset.ink || "light";
      }
      return "dark";
    };
    const run = () => {
      raf = 0;
      const top = read(36);
      const bottom = read(window.innerHeight - 36);
      setInk((p) => (p.top === top && p.bottom === bottom ? p : { top, bottom }));
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    window.addEventListener("tf:ink", kick);
    const id = window.setInterval(kick, 700);
    kick();
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("tf:ink", kick);
      window.clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ink;
}

function LangSwitch() {
  const { lang, setLang } = useTifawt();
  return (
    <span className="tf-lang" role="group" aria-label="Language">
      {(["en", "ar"] as Lang[]).map((l) => (
        <button key={l} type="button" aria-pressed={lang === l} className={lang === l ? "is-on" : ""} onClick={() => setLang(l)}>
          {l === "en" ? "EN" : "ع"}
        </button>
      ))}
    </span>
  );
}

/** The four corners plus the centred logo, as on the reference site. */
export function Corners({ onHome = false }: { onHome?: boolean }) {
  const { t, lang, count, open, overlay } = useTifawt();
  const ink = useInk();
  const [menu, setMenu] = useState(false);
  const [concept, setConcept] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", esc);
    };
  }, [menu]);

  return (
    <div className="tf-corners" data-top={ink.top} data-bottom={ink.bottom}>
      <a className="tf-skip" href="#tf-main">
        {lang === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
      </a>
      <Link href={BASE} className="tf-c tf-c-tl tf-c-link">
        {t.home}
      </Link>
      <Link href={BASE} className="tf-c tf-c-logo" aria-label="TIFAWT">
        <Logo />
      </Link>
      <div className="tf-c tf-c-tr" ref={menuRef}>
        <button type="button" className="tf-c-link" aria-expanded={menu} aria-controls="tf-menu" onClick={() => setMenu((m) => !m)}>
          {t.products}
        </button>
        <div id="tf-menu" className={`tf-menu${menu ? " is-open" : ""}`} hidden={!menu}>
          {PRODUCTS.map((p) => (
            <Link key={p.slug} href={`${BASE}${p.slug}/`} className="tf-menu-item" onClick={() => setMenu(false)}>
              <span className="tf-menu-thumb">{p.pack && <Img src={p.pack} alt="" widths={[160, 240]} sizes="48px" />}</span>
              <span>
                <b>{p.name}</b>
                <small>{p.kind[lang]}</small>
              </span>
            </Link>
          ))}
          <Link href={`${BASE}#collection`} className="tf-menu-all" onClick={() => setMenu(false)}>
            {t.allProducts} <Arrow flip={lang === "ar"} />
          </Link>
        </div>
      </div>
      <div className="tf-c tf-c-bl">
        <button type="button" className="tf-badge" aria-expanded={concept} onClick={() => setConcept((c) => !c)}>
          <svg viewBox="0 0 100 100" aria-hidden>
            <defs>
              <path id="tf-badge-path" d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0" />
            </defs>
            <text>
              <textPath href="#tf-badge-path">{lang === "ar" ? "مشروع تجريبي • زينيث دبي • " : "CONCEPT • ZENITH DUBAI • CONCEPT • "}</textPath>
            </text>
          </svg>
          <span>{t.concept}</span>
        </button>
        {concept && (
          <p className="tf-concept-pop" role="status">
            {t.conceptLong}
          </p>
        )}
        <Link href={onHome ? "#rituals" : `${BASE}#rituals`} className="tf-c-link">
          {t.rituals}
        </Link>
      </div>
      <div className="tf-c tf-c-br">
        <button type="button" className="tf-c-link tf-bag-btn" aria-haspopup="dialog" aria-expanded={overlay === "bag"} onClick={() => open("bag")}>
          {t.bag}
          <span className="tf-bag-count" aria-label={`${count}`}>
            {count}
          </span>
        </button>
        <span className="tf-c-sep" aria-hidden />
        <LangSwitch />
      </div>
    </div>
  );
}

/** A dot that follows the pointer and a ring that trails it; the ring grows over links and turns
 *  into a rotating "Explore" seal over products. Only on devices with a precise pointer. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const { t } = useTifawt();
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce || !dot.current || !ring.current) return;
    document.documentElement.classList.add("tf-has-cursor");
    let mx = innerWidth / 2,
      my = innerHeight / 2,
      rx = mx,
      ry = my,
      raf = 0,
      visible = false;
    const d = dot.current;
    const r = ring.current;
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      d.style.transform = `translate3d(${mx}px,${my}px,0)`;
      if (!visible) {
        visible = true;
        d.style.opacity = "1";
        r.style.opacity = "1";
      }
      const el = e.target as HTMLElement;
      const state = el.closest("[data-cursor]")?.getAttribute("data-cursor") ?? (el.closest("a,button,[role=button],input,select,textarea,label") ? "link" : "");
      r.dataset.state = state;
      d.dataset.state = state;
    };
    const leave = () => {
      visible = false;
      d.style.opacity = "0";
      r.style.opacity = "0";
    };
    const tick = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      r.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("tf-has-cursor");
    };
  }, []);
  return (
    <>
      <div ref={ring} className="tf-cursor-ring" aria-hidden>
        <svg viewBox="0 0 130 130">
          <defs>
            <path id="tf-cur-path" d="M65,65 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
          </defs>
          <text>
            <textPath href="#tf-cur-path">{`${t.explore} • ${t.explore} • ${t.explore} • `}</textPath>
          </text>
        </svg>
      </div>
      <div ref={dot} className="tf-cursor-dot" aria-hidden />
    </>
  );
}

/** A row of fine ticks at the bottom of the screen that fills with page progress. */
export function Ticks() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      ref.current?.style.setProperty("--p", p.toFixed(4));
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    kick();
    return () => {
      removeEventListener("scroll", kick);
      removeEventListener("resize", kick);
    };
  }, []);
  return (
    <div className="tf-ticks" ref={ref} aria-hidden>
      {Array.from({ length: 48 }, (_, i) => (
        <i key={i} style={{ "--i": i / 47 } as CSSProperties} />
      ))}
    </div>
  );
}

function Qty({ id, qty }: { id: string; qty: number }) {
  const { setQty, t } = useTifawt();
  return (
    <span className="tf-qty" role="group" aria-label={t.qty}>
      <button type="button" onClick={() => setQty(id, qty - 1)} aria-label="−">
        −
      </button>
      <output aria-live="polite">{qty}</output>
      <button type="button" onClick={() => setQty(id, qty + 1)} aria-label="+">
        +
      </button>
    </span>
  );
}

function ShipMeter({ subtotal }: { subtotal: number }) {
  const { t, lang } = useTifawt();
  const left = Math.max(0, FREE_SHIPPING - subtotal);
  return (
    <div className="tf-ship">
      <p>{left > 0 ? t.shippingLeft(money(left, lang)) : t.shippingFree}</p>
      <span className="tf-ship-bar">
        <i style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }} />
      </span>
    </div>
  );
}

export function BagDrawer() {
  const { overlay, open, bag, t, lang, subtotal } = useTifawt();
  const panel = useRef<HTMLDivElement>(null);
  const isOpen = overlay === "bag";
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && open(null);
    addEventListener("keydown", esc);
    document.documentElement.classList.add("tf-locked");
    return () => {
      removeEventListener("keydown", esc);
      document.documentElement.classList.remove("tf-locked");
      prev?.focus?.();
    };
  }, [isOpen, open]);

  return (
    <div className={`tf-drawer${isOpen ? " is-open" : ""}`} aria-hidden={!isOpen} inert={!isOpen}>
      <button type="button" className="tf-drawer-scrim" aria-label={t.close} onClick={() => open(null)} tabIndex={-1} />
      <div className="tf-drawer-panel" role="dialog" aria-modal="true" aria-label={t.bagTitle} ref={panel}>
        <header className="tf-drawer-head">
          <h2>{t.bagTitle}</h2>
          <button type="button" className="tf-x" onClick={() => open(null)} aria-label={t.close}>
            ×
          </button>
        </header>
        {bag.length === 0 ? (
          <div className="tf-drawer-empty">
            <p>{t.bagEmpty}</p>
            <Link href={`${BASE}#collection`} className="tf-btn" onClick={() => open(null)}>
              {t.bagEmptyCta}
            </Link>
          </div>
        ) : (
          <>
            <ShipMeter subtotal={subtotal} />
            <ul className="tf-lines">
              {bag.map((l) => {
                const p = PRODUCTS.find((x) => x.slug === l.id);
                const c = COFFRETS.find((x) => x.id === l.id);
                return (
                  <li key={l.id} className="tf-line">
                    <span className="tf-line-img">{p?.pack ? <Img src={p.pack} alt="" widths={[200, 320]} sizes="72px" /> : <Mark size={22} />}</span>
                    <span className="tf-line-txt">
                      <b>{nameOf(l.id)}</b>
                      <small>{p ? `${p.size} · ${p.kind[lang]}` : c?.line[lang]}</small>
                      <span className="tf-line-row">
                        <Qty id={l.id} qty={l.qty} />
                        <span className="tf-line-price">{money(priceOf(l.id) * l.qty, lang)}</span>
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <footer className="tf-drawer-foot">
              <p className="tf-sub">
                <span>{t.subtotal}</span>
                <b>{money(subtotal, lang)}</b>
              </p>
              <button type="button" className="tf-btn tf-btn-solid" onClick={() => open("checkout")}>
                {t.checkout}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export function CheckoutNotice({ onHome }: { onHome?: boolean }) {
  const { overlay, open, t } = useTifawt();
  const isOpen = overlay === "checkout";
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    box.current?.querySelector<HTMLElement>("a,button")?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && open(null);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [isOpen, open]);
  if (!isOpen) return null;
  return (
    <div className="tf-modal" role="dialog" aria-modal="true" aria-labelledby="tf-co-title">
      <button type="button" className="tf-drawer-scrim" aria-label={t.close} onClick={() => open(null)} tabIndex={-1} />
      <div className="tf-modal-box" ref={box}>
        <Mark size={34} />
        <h2 id="tf-co-title">{t.checkoutTitle}</h2>
        <p>{t.checkoutBody}</p>
        <div className="tf-modal-actions">
          <a href={onHome ? "#enquire" : `${BASE}#enquire`} className="tf-btn tf-btn-solid" onClick={() => open(null)}>
            {t.checkoutCta}
          </a>
          <button type="button" className="tf-btn" onClick={() => open(null)}>
            {t.keep}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast() {
  const { toast, t, open } = useTifawt();
  return (
    <div className={`tf-toast${toast ? " is-on" : ""}`} role="status" aria-live="polite">
      {toast && (
        <>
          <span>
            {t.added}: {toast}
          </span>
          <button type="button" onClick={() => open("bag")}>
            {t.bag}
          </button>
        </>
      )}
    </div>
  );
}

export function Enquiry() {
  const { t, lang } = useTifawt();
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [err, setErr] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    setErr("");
    setState("sending");
    try {
      const r = await fetch("/api/showcase-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, site: "tifawt", lang }),
      });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (r.ok && j.ok) setState("sent");
      else {
        setErr(t.errs[j.error ?? "unavailable"] ?? t.errs.unavailable);
        setState("idle");
      }
    } catch {
      setErr(t.errs.unavailable);
      setState("idle");
    }
  }
  return (
    <section className="tf-enquiry" id="enquire" data-ink="dark" aria-labelledby="tf-enq-title">
      <div className="tf-enquiry-in">
        <h2 id="tf-enq-title" className="tf-h2">
          {t.enquiryTitle}
        </h2>
        <p className="tf-lead">{t.enquiryLead}</p>
        {state === "sent" ? (
          <p className="tf-sent" role="status">
            {t.sent}
          </p>
        ) : (
          <form className="tf-form" onSubmit={submit} noValidate>
            <label>
              <span>{t.name}</span>
              <input name="name" autoComplete="name" required maxLength={120} />
            </label>
            <label>
              <span>{t.email}</span>
              <input name="email" type="email" autoComplete="email" required maxLength={200} />
            </label>
            <label>
              <span>{t.brand}</span>
              <input name="interest" maxLength={80} />
            </label>
            <label className="tf-form-wide">
              <span>{t.message}</span>
              <textarea name="message" rows={3} maxLength={2000} />
            </label>
            <input name="website" tabIndex={-1} autoComplete="off" className="tf-hp" aria-hidden />
            {err && (
              <p className="tf-err" role="alert">
                {err}
              </p>
            )}
            <button type="submit" className="tf-btn tf-btn-solid" disabled={state === "sending"}>
              {state === "sending" ? t.sending : t.send}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  const { t, lang } = useTifawt();
  return (
    <footer className="tf-footer" data-ink="light">
      <div className="tf-footer-top">
        <p className="tf-footer-line">{t.footerLine}</p>
        <nav aria-label={t.products} className="tf-footer-nav">
          {PRODUCTS.map((p) => (
            <Link key={p.slug} href={`${BASE}${p.slug}/`}>
              {p.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="tf-footer-word" aria-hidden>
        TIFAWT <span lang="tzm">ⵜⵉⴼⴰⵡⵜ</span>
      </div>
      <div className="tf-footer-bottom">
        <p>{t.rights}</p>
        <Link href="/showcase/">{t.madeBy}</Link>
        <span>{lang === "ar" ? "مفهوم ٢٠٢٦" : "Concept, 2026"}</span>
      </div>
    </footer>
  );
}

export function Shell({ children, onHome }: { children: ReactNode; onHome?: boolean }) {
  const { lang } = useTifawt();
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);
  return (
    <div className="tf" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <Corners onHome={onHome} />
      <main id="tf-main">{children}</main>
      <Ticks />
      <Toast />
      <BagDrawer />
      <CheckoutNotice onHome={onHome} />
      <Cursor />
    </div>
  );
}
