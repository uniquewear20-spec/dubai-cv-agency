"use client";

// The opening: a split slideshow after the reference site. Each slide is two halves (product and
// portrait) and a small square card in the middle. On a landscape screen the wheel moves through
// the three slides before the page starts to scroll; on a phone it becomes a full-bleed image with
// a card carousel to swipe.

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { A, HERO, bySlug } from "@/lib/showcase/tifawt";
import { Arrow, BASE, Img } from "./Chrome";
import { useTifawt } from "./state";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const HIDE_L = "inset(0% 0% 0% 100%)";
const HIDE_R = "inset(0% 100% 0% 0%)";
const HIDE_C = "inset(50% 50% 50% 50% round 18px)";
const SHOW = "inset(0% 0% 0% 0%)";
const SHOW_C = "inset(0% 0% 0% 0% round 18px)";
const img = (k: string) => (A as Record<string, string>)[k] ?? "";

function Word({ text, side }: { text: string; side: "l" | "r" }) {
  return (
    <span className={`tf-hero-word tf-hero-word-${side}`} aria-hidden>
      {[...text].map((ch, i) => (
        <span key={i} className="tf-ch">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { t, lang } = useTifawt();
  const root = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const cur = useRef(0);
  const busy = useRef(false);
  const released = useRef(false);
  const n = HERO.length;

  const q = (sel: string) => Array.from(root.current?.querySelectorAll<HTMLElement>(sel) ?? []);

  const go = useCallback(
    (next: number, dir: 1 | -1) => {
      const el = root.current;
      if (!el || busy.current || next === cur.current || next < 0 || next >= n) return;
      busy.current = true;
      const c = cur.current;
      const L = q(".tf-hs-l"),
        R = q(".tf-hs-r"),
        C = q(".tf-hs-c");
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fwd = dir > 0;
      const opts = (duration: number, delay = 0): KeyframeAnimationOptions => ({ duration: reduce ? 1 : duration, delay: reduce ? 0 : delay, easing: EASE, fill: "forwards" });
      const done: Promise<unknown>[] = [];
      const z = (a: HTMLElement[], v: string) => a.forEach((e) => (e.style.zIndex = v));
      [...L, ...R, ...C].forEach((e) => (e.style.zIndex = ""));
      const img = (e: HTMLElement) => e.querySelector<HTMLElement>(".tf-hs-img");
      const chars = (e: HTMLElement) => Array.from(e.querySelectorAll<HTMLElement>(".tf-ch"));

      if (fwd) {
        z([L[next], R[next]], "2");
        z([L[c], R[c]], "1");
        C[next].style.zIndex = "4";
        C[c].style.zIndex = "3";
        done.push(C[next].animate([{ clipPath: HIDE_C }, { clipPath: SHOW_C }], opts(600)).finished);
        img(C[next])?.animate([{ transform: "scale(1.25)" }, { transform: "scale(1)" }], opts(1200));
        done.push(L[next].animate([{ clipPath: HIDE_L }, { clipPath: SHOW }], opts(1250, 250)).finished);
        done.push(R[next].animate([{ clipPath: HIDE_R }, { clipPath: SHOW }], opts(1250, 250)).finished);
        img(L[next])?.animate([{ transform: "translateX(30%)" }, { transform: "translateX(0)" }], opts(1250, 250));
        img(R[next])?.animate([{ transform: "translateX(-30%)" }, { transform: "translateX(0)" }], opts(1250, 250));
        img(L[c])?.animate([{ transform: "translateX(0)" }, { transform: "translateX(-30%)" }], opts(1250, 250));
        img(R[c])?.animate([{ transform: "translateX(0)" }, { transform: "translateX(30%)" }], opts(1250, 250));
      } else {
        // The current slide folds back into the seam and uncovers the previous one underneath.
        [L[next], R[next], C[next]].forEach((e) => {
          e.getAnimations().forEach((a) => a.cancel());
          e.style.clipPath = e === C[next] ? SHOW_C : SHOW;
        });
        z([L[next], R[next]], "1");
        z([L[c], R[c]], "2");
        C[next].style.zIndex = "3";
        C[c].style.zIndex = "4";
        done.push(L[c].animate([{ clipPath: SHOW }, { clipPath: HIDE_L }], opts(1000, 250)).finished);
        done.push(R[c].animate([{ clipPath: SHOW }, { clipPath: HIDE_R }], opts(1000, 250)).finished);
        done.push(C[c].animate([{ clipPath: SHOW_C }, { clipPath: HIDE_C }], opts(750, 800)).finished);
        img(C[next])?.animate([{ transform: "scale(1.25)" }, { transform: "scale(1)" }], opts(1000, 250));
        img(L[c])?.animate([{ transform: "translateX(0)" }, { transform: "translateX(30%)" }], opts(1000, 250));
        img(R[c])?.animate([{ transform: "translateX(0)" }, { transform: "translateX(-30%)" }], opts(1000, 250));
        img(L[next])?.animate([{ transform: "translateX(-30%)" }, { transform: "translateX(0)" }], opts(1000, 250));
        img(R[next])?.animate([{ transform: "translateX(30%)" }, { transform: "translateX(0)" }], opts(1000, 250));
      }
      // Letters of the new names rise (or fall) into place one after another.
      const off = next % 2 ? -150 : 150;
      chars(L[next])
        .reverse()
        .forEach((ch, i) => ch.animate([{ transform: `translateY(${off}%)` }, { transform: "translateY(0)" }], opts(750, 250 + i * 35)));
      chars(R[next]).forEach((ch, i) => ch.animate([{ transform: `translateY(${-off}%)` }, { transform: "translateY(0)" }], opts(750, 350 + i * 35)));

      cur.current = next;
      setIdx(next);
      Promise.all(done).then(() => {
        // Park every other slide hidden and clear the finished animations.
        [...L, ...R, ...C].forEach((e, i) => {
          const s = i % n;
          e.getAnimations().forEach((a) => a.cancel());
          e.style.clipPath = s === next ? (e.classList.contains("tf-hs-c") ? SHOW_C : SHOW) : e.classList.contains("tf-hs-l") ? HIDE_L : e.classList.contains("tf-hs-r") ? HIDE_R : HIDE_C;
          e.querySelectorAll<HTMLElement>(".tf-hs-img, .tf-ch").forEach((x) => x.getAnimations().forEach((a) => a.cancel()));
        });
        setTimeout(() => (busy.current = false), reduce ? 0 : 220);
      });
    },
    [n],
  );

  // Wheel, keys and touch move through the slides first; after the last one the page scrolls on.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const landscape = () => innerHeight <= innerWidth * 1.2;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) released.current = true;
    if (scrollY > 10) released.current = true;
    let acc = 0;
    let accT = 0;
    let reengageAt = 0;
    // One swipe moves one slide: a trackpad keeps firing after the gesture, so after a change we
    // wait for a short pause in the wheel events before listening again.
    let lastEvt = 0;
    let needPause = false;
    const engaged = () => !released.current && landscape() && scrollY < 4;
    const step = (dy: number) => {
      if (busy.current) return;
      if (dy > 0) {
        if (cur.current >= n - 1) {
          released.current = true;
          reengageAt = performance.now() + 600;
        } else go(cur.current + 1, 1);
      } else if (cur.current > 0) go(cur.current - 1, -1);
    };
    const wheel = (e: WheelEvent) => {
      if (released.current) {
        if (scrollY <= 1 && e.deltaY < 0 && performance.now() > reengageAt && landscape() && !reduce) {
          released.current = false;
        } else return;
      }
      if (!engaged()) return;
      e.preventDefault();
      const now = performance.now();
      const gap = now - lastEvt;
      lastEvt = now;
      if (busy.current) {
        needPause = true;
        return;
      }
      if (needPause) {
        if (gap < 160) return;
        needPause = false;
      }
      if (now - accT > 220) acc = 0;
      accT = now;
      acc += e.deltaY;
      if (Math.abs(acc) > 28) {
        step(acc);
        acc = 0;
        needPause = true;
      }
    };
    const key = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement;
      if (tgt.closest("input,textarea,select,[contenteditable=true]")) return;
      const down = ["ArrowDown", "PageDown", " "].includes(e.key);
      const up = ["ArrowUp", "PageUp"].includes(e.key);
      if (!down && !up) return;
      if (released.current && up && scrollY <= 1 && landscape() && !reduce) released.current = false;
      if (!engaged()) return;
      e.preventDefault();
      step(down ? 1 : -1);
    };
    let ty = 0;
    const tstart = (e: TouchEvent) => (ty = e.touches[0].clientY);
    const tmove = (e: TouchEvent) => {
      if (!engaged()) return;
      const dy = ty - e.touches[0].clientY;
      e.preventDefault();
      if (Math.abs(dy) > 40) {
        step(dy);
        ty = e.touches[0].clientY;
      }
    };
    const onScroll = () => {
      if (scrollY > 30) released.current = true;
      el.classList.toggle("is-covered", scrollY > innerHeight * 1.4);
    };
    addEventListener("wheel", wheel, { passive: false });
    addEventListener("keydown", key);
    el.addEventListener("touchstart", tstart, { passive: true });
    el.addEventListener("touchmove", tmove, { passive: false });
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("wheel", wheel);
      removeEventListener("keydown", key);
      el.removeEventListener("touchstart", tstart);
      el.removeEventListener("touchmove", tmove);
      removeEventListener("scroll", onScroll);
    };
  }, [go, n]);

  // Opening: the two names and the card arrive after the first paint.
  useEffect(() => {
    root.current?.classList.add("is-in");
  }, []);

  // Phone: the background crossfades and the cards slide under the thumb.
  const [m, setM] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tr = track.current;
    if (!tr) return;
    let x0 = 0,
      y0 = 0,
      dx = 0,
      decided = false,
      horiz = false;
    const s = (e: TouchEvent) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      dx = 0;
      decided = false;
    };
    const mv = (e: TouchEvent) => {
      const ddx = e.touches[0].clientX - x0,
        ddy = e.touches[0].clientY - y0;
      if (!decided && (Math.abs(ddx) > 8 || Math.abs(ddy) > 8)) {
        decided = true;
        horiz = Math.abs(ddx) > Math.abs(ddy);
      }
      if (horiz) {
        e.preventDefault();
        dx = ddx;
      }
    };
    const en = () => {
      if (!horiz) return;
      const rtl = document.dir === "rtl" || tr.closest("[dir=rtl]");
      const sign = rtl ? -1 : 1;
      if (Math.abs(dx) > 50) setM((v) => Math.max(0, Math.min(n - 1, v + (dx * sign < 0 ? 1 : -1))));
      horiz = false;
    };
    tr.addEventListener("touchstart", s, { passive: true });
    tr.addEventListener("touchmove", mv, { passive: false });
    tr.addEventListener("touchend", en);
    return () => {
      tr.removeEventListener("touchstart", s);
      tr.removeEventListener("touchmove", mv);
      tr.removeEventListener("touchend", en);
    };
  }, [n]);

  const skip = () => {
    released.current = true;
    document.getElementById("maison")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section className="tf-hero" ref={root} data-ink="light" aria-roledescription="carousel" aria-label="TIFAWT">
      <h1 className="tf-sr">TIFAWT — {lang === "ar" ? "دار تجميل مغربية بالأركان" : "Moroccan argan beauty house"}</h1>

      <div className="tf-hero-split" aria-live="polite">
        {HERO.map((s, i) => {
          const p = bySlug(s.slug)!;
          const lTone = s.productSide === "left" ? "dark" : "light";
          const rTone = s.productSide === "right" ? "dark" : "light";
          return (
            <div key={s.slug} className="tf-hs" aria-hidden={i !== idx}>
              <div className={`tf-hs-l tf-tone-${lTone} ${s.productSide === "left" ? "is-product" : "is-portrait"}`} style={{ clipPath: i === 0 ? SHOW : HIDE_L }}>
                <div className="tf-hs-img">
                  <Img src={img(s.left.img) || (s.productSide === "left" ? p.pack : "")} alt={s.productSide === "left" ? `${p.name}, ${p.object[lang]}` : ""} sizes="50vw" eager={i === 0} />
                </div>
                <Word text={s.left.word} side="l" />
              </div>
              <div className={`tf-hs-r tf-tone-${rTone} ${s.productSide === "right" ? "is-product" : "is-portrait"}`} style={{ clipPath: i === 0 ? SHOW : HIDE_R }}>
                <div className="tf-hs-img">
                  <Img src={img(s.right.img) || (s.productSide === "right" ? p.pack : "")} alt={s.productSide === "right" ? `${p.name}, ${p.object[lang]}` : ""} sizes="50vw" eager={i === 0} />
                </div>
                <Word text={s.right.word} side="r" />
              </div>
              <div className="tf-hs-c" style={{ clipPath: i === 0 ? SHOW_C : HIDE_C }}>
                <div className="tf-hs-img">
                  {p.video ? (
                    <video src={p.video} muted loop playsInline autoPlay preload="metadata" poster={p.pack ? undefined : undefined} />
                  ) : (
                    <Img src={p.pack} alt="" sizes="240px" widths={[320, 480, 640]} eager={i === 0} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <Link href={`${BASE}${HERO[idx].slug}/`} className="tf-hero-explore" data-cursor="link">
          {t.explore} <Arrow flip={lang === "ar"} />
          <span className="tf-sr">: {bySlug(HERO[idx].slug)?.name}</span>
        </Link>
        <div className="tf-hero-dots" role="group" aria-label={`${idx + 1} ${t.of} ${n}`}>
          {HERO.map((s, i) => (
            <button key={s.slug} type="button" aria-label={`${i + 1}: ${bySlug(s.slug)?.name}`} aria-current={i === idx} onClick={() => go(i, i > idx ? 1 : -1)} />
          ))}
        </div>
        <button type="button" className="tf-hero-skip" onClick={skip}>
          {t.skipIntro}
        </button>
      </div>

      <div className="tf-hero-mobile">
        <div className="tf-hm-bg">
          {HERO.map((s, i) => (
            <div key={s.slug} className="tf-hm-layer" style={{ opacity: i === m ? 1 : 0 }}>
              <Img src={img(s.productSide === "left" ? s.left.img : s.right.img) || bySlug(s.slug)!.pack} alt="" sizes="100vw" eager={i === 0} />
            </div>
          ))}
        </div>
        <div className="tf-hm-ui">
          <div className="tf-hm-count">
            <span>
              {String(m + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <button type="button" aria-label={t.next} onClick={() => setM((v) => (v + 1) % n)}>
              <svg width="34" height="10" viewBox="0 0 34 10" aria-hidden>
                <path d="M0 5h32M28 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.2" />
              </svg>
            </button>
          </div>
          <div className="tf-hm-cards" ref={track}>
            <div className="tf-hm-track" style={{ transform: `translateX(calc(${lang === "ar" ? 1 : -1} * ${m} * (78vw + 10px)))` }}>
              {HERO.map((s) => {
                const p = bySlug(s.slug)!;
                return (
                  <Link key={s.slug} href={`${BASE}${s.slug}/`} className="tf-hm-card">
                    <span className="tf-hm-card-txt">
                      <b>
                        {s.left.word}
                        <br />
                        {s.right.word}
                      </b>
                      <small>{t.explore}</small>
                    </span>
                    <span className="tf-hm-card-img">
                      <Img src={img(s.productSide === "left" ? s.right.img : s.left.img)} alt="" sizes="30vw" widths={[240, 400]} />
                    </span>
                    <span className="tf-sr">{p.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <span className="tf-hm-scroll">{t.scroll}</span>
        </div>
      </div>
    </section>
  );
}
