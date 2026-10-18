"use client";

// Ferris wheel gallery (after the 21st.dev "Ferris Wheel Image Gallery"), adapted for zenithdubaicv.com:
// - Many items: gondolas are sized from the space between neighbours, the one on view is enlarged, and a
//   far jump turns the wheel once (a little longer) instead of slot by slot.
// - `thumb` keeps the gondolas light; `label` (e.g. a catalogue number) and `marker` (a coloured dot, e.g.
//   for a live website) are shown on each gondola.
// - `dir`: the wheel itself is never mirrored, but on right-to-left pages the next item arrives from the
//   left, and arrows, swipes, keys and the caption follow the reading direction.
// - `renderPreview`, `renderCaption` and `renderActions` let the host supply the large preview and caption.
// - Autoplay is opt-in: it holds while a mouse is over the gallery, stops for good on any input or focus,
//   never runs with reduced motion, and has a visible pause button. A vertical mouse wheel or a vertical
//   swipe always scrolls the page; sideways swipes, drags, arrow keys and buttons turn the wheel.

import * as React from "react";
import { ArrowLeft, ArrowRight, ChevronDown, ImageIcon, Pause, Play } from "lucide-react";

export interface FerrisWheelItem {
  id?: string;
  src: string;
  /** Smaller image used inside the gondolas. Falls back to `src`. */
  thumb?: string;
  alt: string;
  title: string;
  year?: string | number;
  discipline?: string;
  /** Shown above the title of the selected item (default caption only). */
  badge?: React.ReactNode;
  /** Short text under the gondola. Defaults to the position (01, 02 …). */
  label?: string;
  /** Colour of a small dot on the gondola. */
  marker?: string;
}

export interface FerrisWheelLabels {
  region?: string;
  onView?: string;
  hub?: string;
  item?: string;
  browse?: string;
  help?: React.ReactNode;
  previous?: string;
  next?: string;
  view?: (title: string, position: number, total: number) => string;
  unavailable?: string;
  empty?: string;
  pause?: string;
  resume?: string;
}

type DivProps = React.ComponentProps<"div">;

export interface FerrisWheelGalleryProps extends Omit<DivProps, "dir"> {
  items: FerrisWheelItem[];
  /** Zero-based item index. Omit to let the gallery own its selection. */
  active?: number;
  defaultActive?: number;
  onActiveChange?: (index: number) => void;
  /** Reading direction of the page. The next item comes from the inline end. */
  dir?: "ltr" | "rtl";
  /** Opt in only where wanted. Input or focus stops automatic rotation. */
  autoplay?: boolean;
  interval?: number;
  /** Told whenever automatic rotation starts or stops running. */
  onRunningChange?: (running: boolean) => void;
  labels?: FerrisWheelLabels;
  /** Extra controls shown under the caption of the selected item. */
  renderActions?: (item: FerrisWheelItem, index: number) => React.ReactNode;
  /** Custom content for the large preview of the selected item (it handles its own transition). */
  renderPreview?: (item: FerrisWheelItem, index: number) => React.ReactNode;
  /** Custom caption for the selected item. */
  renderCaption?: (item: FerrisWheelItem, index: number) => React.ReactNode;
  ref?: DivProps["ref"];
}

const TURN_MS = 650;
const SWAY_MS = 340;

const DEFAULT_LABELS: Required<Omit<FerrisWheelLabels, "view">> & Pick<FerrisWheelLabels, "view"> = {
  region: "Ferris wheel image gallery",
  onView: "ON VIEW",
  hub: "STUDIES",
  item: "STUDY",
  browse: "Browse the collection",
  help: <>Drag to explore <span aria-hidden="true" className="px-1.5 text-border">/</span> use ← →</>,
  previous: "Previous image",
  next: "Next image",
  view: (title, position, total) => `View ${title}, ${position} of ${total}`,
  unavailable: "Image unavailable",
  empty: "Add images to start your collection.",
  pause: "Pause automatic rotation",
  resume: "Resume automatic rotation",
};

function wrap(index: number, total: number) {
  return total > 0 ? ((Math.trunc(Number.isFinite(index) ? index : 0) % total) + total) % total : 0;
}

function Photo({ item, thumbnail = false, unavailable }: { item: FerrisWheelItem; thumbnail?: boolean; unavailable: string }) {
  const src = thumbnail ? item.thumb ?? item.src : item.src;
  const [failed, setFailed] = React.useState("");
  const [loading, setLoading] = React.useState("");
  const [shown, setShown] = React.useState("");
  const image = React.useRef(null as HTMLImageElement | null);
  // Server markup stays visible; only a photo still downloading after mount waits behind a skeleton.
  React.useLayoutEffect(() => {
    const node = image.current;
    if (node && !(node.complete && node.naturalWidth > 0)) setLoading(src);
  }, [src]);
  const pending = loading === src && shown !== src && failed !== src;
  return (
    <>
      {pending && <span aria-hidden="true" data-photo-skeleton className="absolute inset-0 bg-muted motion-safe:animate-pulse" />}
      {failed !== src && <img ref={image} src={src} alt={thumbnail ? "" : item.alt} draggable={false} decoding="async" loading={thumbnail ? "lazy" : undefined} onLoad={() => setShown(src)} onError={() => setFailed(src)} data-photo-state={pending ? "loading" : "ready"} className={`absolute inset-0 size-full object-cover object-top ${pending ? "opacity-0" : loading === src ? "opacity-100 transition-opacity duration-500 motion-reduce:transition-none" : ""}`} />}
      {failed === src && (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground" role={thumbnail ? undefined : "img"} aria-label={thumbnail ? undefined : `${item.alt} — ${unavailable}`}>
          <ImageIcon className={thumbnail ? "size-3" : "size-6"} aria-hidden="true" />
          {!thumbnail && <span className="text-xs">{unavailable}</span>}
        </span>
      )}
    </>
  );
}

/** A vertical wheel with upright gondolas. Image URLs are supplied by the host. */
export function FerrisWheelGallery({
  items,
  active,
  defaultActive = 0,
  onActiveChange,
  dir = "ltr",
  autoplay = false,
  interval = 2600,
  onRunningChange,
  labels: labelOverrides,
  renderActions,
  renderPreview,
  renderCaption,
  className,
  ref,
  onKeyDown,
  onFocusCapture,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: FerrisWheelGalleryProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const total = items.length;
  const rtl = dir === "rtl";
  const [localActive, setLocalActive] = React.useState(() => wrap(defaultActive, total));
  const selected = wrap(active ?? localActive, total);
  // The next item arrives from the inline end, so the wheel turns towards the inline start.
  const sign = rtl ? 1 : -1;
  const slot = total > 0 ? 360 / total : 0;
  // Gondolas are sized from the distance between neighbouring hangers, so a full wheel stays readable.
  const chord = total > 1 ? 100 * Math.sin(Math.PI / total) : 100;
  const gondolaWidth = Math.max(10, Math.min(34, Math.round(chord * 1.15)));
  const small = gondolaWidth < 18;
  const activeScale = small ? 1.6 : 1.3;
  const many = total > 16;
  const box = many ? { left: "12%", top: "8%", size: "76%" } : { left: "17%", top: "13%", size: "66%" };
  // A motion-free first render is also safe for SSR and reduced-motion hydration.
  const [reducedMotion, setReducedMotion] = React.useState(true);
  const [paused, setPaused] = React.useState(false);
  const [hold, setHold] = React.useState(false);
  const [phase, setPhase] = React.useState("idle");
  const [view, setView] = React.useState(() => ({ index: selected, previous: selected }));
  const [announcement, setAnnouncement] = React.useState("");
  // The first render places the wheel; after that, one frame clock writes the transforms directly.
  const [initialAngle] = React.useState(() => selected * slot * sign);
  const angle = React.useRef(initialAngle);
  const wheelRef = React.useRef(null as HTMLDivElement | null);
  const stageRef = React.useRef(null as HTMLDivElement | null);
  const counters = React.useRef([] as (HTMLDivElement | null)[]);
  const gondolas = React.useRef([] as (HTMLDivElement | null)[]);
  const photoRef = React.useRef(null as HTMLDivElement | null);
  const previousRef = React.useRef(null as HTMLDivElement | null);
  const captionRef = React.useRef(null as HTMLDivElement | null);
  const command = React.useRef(null as ((index: number) => void) | null);
  const requestRef = React.useRef(null as ((index: number, user?: boolean) => void) | null);
  const drag = React.useRef(null as { id: number; x: number; y: number; captured: boolean } | null);
  const suppressClickUntil = React.useRef(0);
  const latest = React.useRef({ selected, active, onActiveChange, items, rtl });
  // Declared before the other effects, so they always read this render's values.
  React.useLayoutEffect(() => { latest.current = { selected, active, onActiveChange, items, rtl }; });
  const labelId = React.useId();
  const helpId = React.useId();

  React.useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // One frame clock writes both transforms, so the counter-rotation cannot drift from the wheel.
  // A new destination is reached in one turn whose length grows gently with the distance.
  React.useLayoutEffect(() => {
    let shown = latest.current.selected;
    let target = shown;
    let frame = 0;
    let sways: Animation[] = [];
    let settleTimer = 0;
    let disposed = false;

    const paint = (value: number) => {
      angle.current = value;
      if (wheelRef.current) wheelRef.current.style.transform = `rotate(${value}deg)`;
      counters.current.forEach((node) => {
        if (node) node.style.transform = `rotate(${-value}deg)`;
      });
    };
    const stopSway = () => {
      window.clearTimeout(settleTimer);
      sways.forEach((animation) => animation.cancel());
      sways = [];
    };
    const sway = (turn: number) => {
      // Two complete oscillations with a decaying amplitude, then exact zero.
      const swing = [0, -2.6, 0, 1.7, 0, -0.9, 0, 0.35, 0];
      sways = gondolas.current.flatMap((node) => node ? [node.animate(
        swing.map((value) => ({ transform: `rotate(${value * turn}deg)` })),
        { duration: SWAY_MS, easing: "ease-in-out" },
      )] : []);
      setPhase("settling");
      settleTimer = window.setTimeout(() => { if (!disposed) setPhase("idle"); }, SWAY_MS);
    };
    const announce = () => {
      const item = latest.current.items[shown];
      if (item) setAnnouncement(`${shown + 1} / ${total}: ${item.title}`);
    };
    const begin = () => {
      if (shown === target || total < 2) return;
      stopSway();
      let distance = wrap(target - shown, total);
      if (distance > total / 2) distance -= total;
      const destination = target;
      const from = angle.current;
      const to = from + distance * slot * sign;
      const duration = Math.min(1500, TURN_MS + (Math.abs(distance) - 1) * 110);
      const started = performance.now();
      setView({ index: destination, previous: shown });
      setPhase("turning");
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        const tail = progress - 1;
        const spring = 1 + 2.2 * tail ** 3 + 1.2 * tail ** 2;
        paint(from + (to - from) * spring);
        if (progress < 1) {
          frame = requestAnimationFrame(tick);
          return;
        }
        frame = 0;
        paint(to);
        shown = destination;
        if (shown !== target) begin();
        else { announce(); sway(Math.sign(distance) * sign); }
      };
      frame = requestAnimationFrame(tick);
    };
    paint(shown * slot * sign);
    setView({ index: shown, previous: shown });
    setPhase("idle");
    command.current = (index) => {
      target = wrap(index, total);
      if (reducedMotion) {
        cancelAnimationFrame(frame);
        frame = 0;
        stopSway();
        shown = target;
        paint(shown * slot * sign);
        setView({ index: shown, previous: shown });
        setPhase("idle");
        announce();
      } else if (!frame) begin();
    };
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      stopSway();
      command.current = null;
    };
  }, [total, slot, sign, reducedMotion]);

  React.useLayoutEffect(() => { command.current?.(selected); }, [selected, total, sign, reducedMotion]);

  React.useLayoutEffect(() => {
    if (reducedMotion || view.index === view.previous) return;
    const options = { duration: 360, easing: "ease-out" };
    const fades = [
      renderPreview ? undefined : photoRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], options),
      renderPreview ? undefined : previousRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], options),
      captionRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], options),
    ];
    return () => fades.forEach((animation) => animation?.cancel());
  }, [view, reducedMotion, renderPreview]);

  const request = (index: number, user = true) => {
    if (user) setPaused(true);
    const next = wrap(index, total);
    if (next === latest.current.selected || total < 2) return;
    if (latest.current.active === undefined) setLocalActive(next);
    latest.current.onActiveChange?.(next);
  };
  React.useLayoutEffect(() => { requestRef.current = request; });
  /** +1 moves to the next item, -1 to the previous one. */
  const forward = (towardsInlineEnd: number) => (rtl ? -towardsInlineEnd : towardsInlineEnd);

  // Only sideways scrolling (trackpad swipe, shift + wheel) turns the wheel, so the
  // page keeps scrolling normally when the pointer passes over the gallery.
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage || total < 2) return;
    let lastWheel = -Infinity;
    let amount = 0;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      const sideways = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!sideways && !event.shiftKey) return;
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheel < TURN_MS + 80) return;
      const delta = sideways ? event.deltaX : event.deltaY;
      amount += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1);
      if (Math.abs(amount) < 14) return;
      const step = latest.current.rtl ? -Math.sign(amount) : Math.sign(amount);
      requestRef.current?.(latest.current.selected + step);
      amount = 0;
      lastWheel = now;
    };
    stage.addEventListener("wheel", wheel, { passive: false });
    return () => stage.removeEventListener("wheel", wheel);
  }, [total]);

  const running = autoplay && !paused && !hold && !reducedMotion && total > 1;
  React.useEffect(() => { onRunningChange?.(running); }, [running, onRunningChange]);
  React.useEffect(() => {
    if (!running) return;
    const delay = Number.isFinite(interval) ? Math.max(TURN_MS + SWAY_MS, interval) : 2600;
    const timer = window.setInterval(() => requestRef.current?.(latest.current.selected + 1, false), delay);
    return () => window.clearInterval(timer);
  }, [running, interval]);

  const index = wrap(view.index, total);
  const current = items[index];
  const previous = items[wrap(view.previous, total)];
  const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background";
  const PrevIcon = rtl ? ArrowRight : ArrowLeft;
  const NextIcon = rtl ? ArrowLeft : ArrowRight;

  return (
    <div
      {...rest}
      ref={ref}
      dir={dir}
      data-ferris-gallery
      data-active={selected}
      data-visible={view.index}
      data-phase={phase}
      data-reduced-motion={reducedMotion}
      data-running={running}
      className={`@container/ferris w-full text-foreground ${className ?? ""}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={rest["aria-label"] ?? labels.region}
      onPointerEnter={(event) => { onPointerEnter?.(event); if (event.pointerType === "mouse") setHold(true); }}
      onPointerLeave={(event) => { onPointerLeave?.(event); setHold(false); }}
      onFocusCapture={(event) => { onFocusCapture?.(event); if (!event.defaultPrevented && !(event.target instanceof Element && event.target.closest("[data-autoplay-control]"))) setPaused(true); }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          request(selected + forward(event.key === "ArrowRight" ? 1 : -1));
        }
      }}
    >
      {!current ? <div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground" role="status">{labels.empty}</div> : (
        <div className="grid items-center gap-8 @min-[860px]/ferris:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] @min-[860px]/ferris:gap-12">
          <div dir="ltr">
            <div
              ref={stageRef}
              data-wheel-stage
              tabIndex={0}
              aria-label={labels.browse}
              aria-describedby={helpId}
              className={`relative mx-auto w-full max-w-[440px] select-none overflow-hidden rounded-3xl pb-4 @min-[860px]/ferris:max-w-none ${focusRing}`}
              style={{ touchAction: "pan-y" }}
              onPointerDown={(event) => {
                if (!event.isPrimary || event.button !== 0) return;
                setPaused(true);
                drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, captured: false };
              }}
              onPointerMove={(event) => {
                const start = drag.current;
                if (!start || start.id !== event.pointerId) return;
                if (!start.captured && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  start.captured = true;
                }
              }}
              onPointerUp={(event) => {
                const start = drag.current;
                drag.current = null;
                if (!start || start.id !== event.pointerId) return;
                if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
                const x = event.clientX - start.x;
                const y = event.clientY - start.y;
                // Touch: only sideways swipes turn the wheel; vertical swipes scroll the page.
                const delta = event.pointerType === "touch" ? x : Math.abs(x) >= Math.abs(y) ? x : y;
                if (start.captured) suppressClickUntil.current = event.timeStamp + 300;
                // Dragging towards the inline start brings the next item up.
                if (Math.abs(delta) >= 30) request(selected + forward(-Math.sign(delta)));
              }}
              onPointerCancel={() => { drag.current = null; }}
              // Touch pointers start captured by the element under the finger; moving that capture to the
              // stage makes the child lose it, which must not end the drag.
              onLostPointerCapture={(event) => { if (event.target === event.currentTarget) drag.current = null; }}
            >
              <div className="relative aspect-square">
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-1 text-muted-foreground">
                  <span className="text-[10px] font-medium tracking-[0.22em]" dir={dir}>{labels.onView}</span>
                  <ChevronDown className="size-3" />
                </div>
                <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full text-foreground/20" viewBox="0 0 400 400" fill="none">
                  <path d="M200 184 146 362M200 184 254 362M124 362H276" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div ref={wheelRef} data-wheel className="absolute rounded-full border-2 border-foreground/15" style={{ left: box.left, top: box.top, width: box.size, height: box.size, transform: `rotate(${initialAngle}deg)` }}>
                  <div aria-hidden="true" className="absolute inset-[6%] rounded-full border border-foreground/10" />
                  {Array.from({ length: 24 }, (_, light) => (
                    <span key={`light-${light}`} aria-hidden="true" data-rim-light className="absolute size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-2/60" style={{ left: `${50 + Math.sin(light * Math.PI / 12) * 50}%`, top: `${50 - Math.cos(light * Math.PI / 12) * 50}%` }} />
                  ))}
                  {items.map((item, position) => {
                    const radians = -sign * position * slot * Math.PI / 180;
                    const isActive = position === view.index;
                    return (
                      <React.Fragment key={`${item.id ?? item.src}-${position}`}>
                        <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-1/2 origin-left bg-foreground/10" style={{ transform: `rotate(${-90 - sign * position * slot}deg)` }} />
                        <div data-gondola-anchor={position} className="absolute" style={{ width: `${gondolaWidth}%`, left: `${50 + Math.sin(radians) * 50}%`, top: `${50 - Math.cos(radians) * 50}%`, zIndex: isActive ? 20 : 10 }}>
                          <div ref={(node) => { counters.current[position] = node; }} data-counter={position} className="relative origin-top-left" style={{ transform: `rotate(${-initialAngle}deg)` }}>
                            <div className="absolute left-0 top-0 w-full -translate-x-1/2">
                              <div ref={(node) => { gondolas.current[position] = node; }} data-pendulum={position} className="relative origin-top">
                                <span aria-hidden="true" className={`mx-auto block w-0.5 rounded-full bg-foreground/25 ${small ? "h-1.5" : "h-2.5"}`} />
                                <button
                                  type="button"
                                  tabIndex={-1}
                                  data-gondola={position}
                                  aria-label={(labels.view ?? DEFAULT_LABELS.view!)(item.title, position + 1, total)}
                                  aria-current={isActive ? "true" : undefined}
                                  aria-controls={labelId}
                                  onClick={(event) => { if (event.timeStamp >= suppressClickUntil.current) request(position); }}
                                  className={`relative block w-full origin-top rounded-md border bg-card ${small ? "p-0.5" : "p-1"} ${isActive ? `border-chart-2 ${small ? "ring-2" : "ring-4"} ring-chart-2/30 shadow-lg shadow-foreground/25` : "border-border opacity-80 shadow-sm shadow-foreground/10 hover:border-muted-foreground hover:opacity-100"} ${focusRing}`}
                                  style={{ transform: `scale(${isActive ? activeScale : 1})`, transition: reducedMotion ? "none" : "transform 320ms ease, opacity 320ms ease" }}
                                >
                                  <span className="relative block aspect-[1.6] overflow-hidden rounded-[3px] bg-muted"><Photo item={item} thumbnail unavailable={labels.unavailable} /></span>
                                  {item.marker && <span aria-hidden="true" className="absolute -right-1 -top-1 size-2 rounded-full ring-2 ring-card" style={{ background: item.marker }} />}
                                  <span aria-hidden="true" className={`mt-0.5 block text-center font-mono leading-none ${small ? "text-[8px]" : "text-[10px]"} ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{item.label ?? String(position + 1).padStart(2, "0")}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[46%] flex size-[18%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-foreground/15 bg-card shadow-md shadow-foreground/10">
                  <span className="font-mono text-lg font-light leading-none tracking-tight">{String(total).padStart(2, "0")}</span>
                  <span className="mt-1 text-[9px] font-medium leading-none tracking-[0.14em] text-muted-foreground" dir={dir}>{labels.hub}</span>
                </div>
              </div>
            </div>
            <p id={helpId} dir={dir} className="mt-1 text-center text-[10px] tracking-wide text-muted-foreground">{labels.help}</p>
          </div>
          <div data-detail-panel id={labelId} className="min-w-0">
            {renderPreview ? (
              <div ref={photoRef} data-current-photo className="min-w-0">{renderPreview(current, index)}</div>
            ) : (
              <div className="relative aspect-[1.8] min-w-0 overflow-hidden rounded-xl bg-muted @min-[600px]/ferris:aspect-[1.15]">
                {previous && view.previous !== view.index && <div ref={previousRef} data-previous-photo aria-hidden="true" className="absolute inset-0" style={{ opacity: 0 }}><Photo item={previous} unavailable={labels.unavailable} /></div>}
                <div ref={photoRef} data-current-photo className="absolute inset-0"><Photo item={current} unavailable={labels.unavailable} /></div>
                <span aria-hidden="true" className="absolute inset-0 rounded-xl ring-1 ring-inset ring-foreground/10" />
              </div>
            )}
            <div className="mt-6 min-w-0">
              <div ref={captionRef} data-caption>
                {renderCaption ? renderCaption(current, index) : (
                  <>
                    {current.badge ? <div className="mb-2">{current.badge}</div> : <p className="mb-2 border-s-2 border-chart-2 ps-2 font-mono text-[10px] tracking-wider text-muted-foreground">{labels.item} {String(view.index + 1).padStart(2, "0")}</p>}
                    <h3 className="text-xl font-medium leading-tight tracking-tight @min-[600px]/ferris:text-2xl @min-[900px]/ferris:text-3xl">{current.title}</h3>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{[current.discipline, current.year].filter((value) => value !== undefined && value !== "").join(" · ")}</p>
                  </>
                )}
                {renderActions && <div className="mt-5">{renderActions(current, index)}</div>}
              </div>
              <div className="mt-6 flex items-center gap-2">
                <button type="button" data-previous aria-label={labels.previous} disabled={total < 2} onClick={() => request(selected - 1)} className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background hover:bg-accent disabled:opacity-40 ${focusRing}`}><PrevIcon className="size-3.5" aria-hidden="true" /></button>
                <button type="button" data-next aria-label={labels.next} disabled={total < 2} onClick={() => request(selected + 1)} className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 ${focusRing}`}><NextIcon className="size-3.5" aria-hidden="true" /></button>
                {autoplay && !reducedMotion && total > 1 && <button data-autoplay-control type="button" aria-label={paused ? labels.resume : labels.pause} title={paused ? labels.resume : labels.pause} onClick={() => setPaused(!paused)} className={`ms-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-border hover:bg-accent ${focusRing}`}>{paused ? <Play className="size-3" aria-hidden="true" /> : <Pause className="size-3" aria-hidden="true" />}</button>}
                <span aria-hidden="true" className="ms-auto font-mono text-[11px] tabular-nums text-muted-foreground" dir="ltr">{String(view.index + 1).padStart(2, "0")}<span className="px-1 text-border">/</span>{String(total).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</span>
    </div>
  );
}

export default FerrisWheelGallery;
