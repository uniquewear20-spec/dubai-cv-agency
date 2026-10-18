"use client";

// "Portfolio websites": the exhibition.
// Two ways to browse, the same entries:
// - Wheel (default): the Ferris wheel gallery. Every website hangs in a gondola; the one on view comes to
//   the top and is shown beside the wheel in a desktop, tablet or phone frame, captured from the real page
//   (plus a short screen recording of the opening, on desktop, once the wheel is no longer turning by itself).
// - Index: a large stage with the full list beside it; on phones, a swipeable row of cards.
// Filters, counts and numbering all come from lib/portfolios.ts, so every number on screen is the real
// number. The live website is always marked as live; everything else is marked as a concept design.

import * as React from "react";
import { ArrowLeft, ArrowRight, ExternalLink, FerrisWheel, List, Loader2, Maximize2, Monitor, Pause, Play, Smartphone, Tablet, X } from "lucide-react";
import { FerrisWheelGallery, type FerrisWheelItem } from "@/components/ui/ferris-wheel-gallery";
import { CATEGORIES, PORTFOLIOS, displayUrl, preview, type Category, type Device, type Lang, type Portfolio } from "@/lib/portfolios";

const G = "#C8A96E", INK = "#0A0907";
const LIVE = "#14804A"; // white text on it passes 4.5:1

type Filter = "all" | "live" | Category;
type View = "wheel" | "index";

const TX = {
  eyebrow:   { en: "Portfolio websites", fr: "Sites portfolio", ar: "مواقع الملفات المهنية" },
  h2b:       { en: "Each one its own idea.", fr: "Chacun son idée.", ar: "لكلٍّ منها فكرته الخاصة." },
  onShow:    { en: "On show:", fr: "À voir :", ar: "في هذا المعرض" },
  and:       { en: "and", fr: "et", ar: "و" },
  body:      { en: "Live websites are real and shown exactly as published. The concepts were made by Zenith Dubai CV for fictional professionals, each built around one idea from the profession itself, with its own typography, colour and motion.",
               fr: "Les sites en ligne sont réels et présentés tels que publiés. Les concepts ont été créés par Zenith Dubai CV pour des professionnels fictifs, chacun autour d'une idée tirée du métier lui-même, avec sa typographie, ses couleurs et son mouvement.",
               ar: "المواقع المباشرة حقيقية ومعروضة كما نُشرت تماماً، أما التصاميم المفاهيمية فقد أعدّتها زينيث دبي سي في لمهنيين خياليين، وكلٌّ منها مبنيّ على فكرة واحدة من صميم المهنة، بخطوطه وألوانه وحركته الخاصة." },
  live:      { en: "Live website", fr: "Site en ligne", ar: "موقع مباشر" },
  concept:   { en: "Concept design", fr: "Concept", ar: "تصميم مفاهيمي" },
  theIdea:   { en: "The idea", fr: "L'idée", ar: "الفكرة" },
  view:      { en: "View the website", fr: "Voir le site", ar: "عرض الموقع" },
  newTab:    { en: "Open in a new tab", fr: "Ouvrir dans un nouvel onglet", ar: "فتح في علامة تبويب جديدة" },
  prev:      { en: "Previous website", fr: "Site précédent", ar: "الموقع السابق" },
  next:      { en: "Next website", fr: "Site suivant", ar: "الموقع التالي" },
  filterBy:  { en: "Filter by field", fr: "Filtrer par domaine", ar: "تصفية حسب المجال" },
  device:    { en: "Preview on", fr: "Aperçu sur", ar: "المعاينة على" },
  desktop:   { en: "Desktop", fr: "Ordinateur", ar: "سطح المكتب" },
  tablet:    { en: "Tablet", fr: "Tablette", ar: "جهاز لوحي" },
  mobile:    { en: "Mobile", fr: "Mobile", ar: "الجوال" },
  all:       { en: "All", fr: "Tous", ar: "الكل" },
  liveF:     { en: "Live", fr: "En ligne", ar: "مباشر" },
  hospitality: { en: "Hospitality & travel", fr: "Hôtellerie et voyage", ar: "الضيافة والسفر" },
  health:    { en: "Healthcare", fr: "Santé", ar: "الرعاية الصحية" },
  business:  { en: "Business, finance & law", fr: "Entreprise, finance et droit", ar: "الأعمال والمال والقانون" },
  built:     { en: "Architecture, engineering & tech", fr: "Architecture, ingénierie et tech", ar: "العمارة والهندسة والتقنية" },
  creative:  { en: "Creative & media", fr: "Création et médias", ar: "الإبداع والإعلام" },
  music:     { en: "Music & performance", fr: "Musique et scène", ar: "الموسيقى والأداء" },
  science:   { en: "Science & research", fr: "Sciences et recherche", ar: "العلوم والبحث" },
  index:     { en: "Index", fr: "Index", ar: "الفهرس" },
  featured:  { en: "Featured", fr: "À la une", ar: "مختارات" },
  showList:  { en: "Show the full list", fr: "Afficher la liste complète", ar: "عرض القائمة الكاملة" },
  hideList:  { en: "Hide the list", fr: "Masquer la liste", ar: "إخفاء القائمة" },
  firstOf:   { en: "First screen of the website of", fr: "Premier écran du site de", ar: "الشاشة الأولى لموقع" },
  on:        { en: "on", fr: "sur", ar: "على" },
  opening:   { en: "Screen recording of the opening", fr: "Enregistrement de l'ouverture", ar: "تسجيل لافتتاحية الموقع" },
  play:      { en: "Play the opening", fr: "Lire l'ouverture", ar: "تشغيل الافتتاحية" },
  pause:     { en: "Pause the opening", fr: "Mettre en pause", ar: "إيقاف مؤقت" },
  liveFrame: { en: "Live view at tablet width", fr: "Vue en direct, format tablette", ar: "عرض مباشر بعرض الجهاز اللوحي" },
  carousel:  { en: "Portfolio websites", fr: "Sites portfolio", ar: "مواقع الملفات المهنية" },
  card:      { en: "website", fr: "site", ar: "موقع" },
  of:        { en: "of", fr: "sur", ar: "من" },
  note:      { en: "Live websites are real portfolios, shown as their owners published them. Concept designs were created by Zenith Dubai CV for fictional people: the names, employers, clients, figures and quotes on them are illustrative, and their portraits were generated with AI. Every preview is a capture of the real page.",
               fr: "Les sites en ligne sont de vrais portfolios, présentés tels que leurs propriétaires les ont publiés. Les concepts ont été créés par Zenith Dubai CV pour des personnes fictives : noms, employeurs, clients, chiffres et citations y sont illustratifs, et les portraits ont été générés par IA. Chaque aperçu est une capture de la vraie page.",
               ar: "المواقع المباشرة ملفات مهنية حقيقية تُعرض كما نشرها أصحابها. أما التصاميم المفاهيمية فقد أعدّتها زينيث دبي سي في لشخصيات خيالية: الأسماء وجهات العمل والعملاء والأرقام والاقتباسات فيها توضيحية، وصورها الشخصية مولَّدة بالذكاء الاصطناعي. وكل معاينة هنا لقطة من الصفحة الحقيقية." },
  want:      { en: "Want a website like these?", fr: "Vous voulez un site comme ceux-ci ?", ar: "هل تريد موقعاً كهذه المواقع؟" },
  kit:       { en: "Portfolio / Personal Branding Kit", fr: "Kit portfolio / personal branding", ar: "مجموعة الملف والعلامة الشخصية" },
  close:     { en: "Close", fr: "Fermer", ar: "إغلاق" },
  viewAs:    { en: "Display", fr: "Affichage", ar: "طريقة العرض" },
  wheel:     { en: "Wheel", fr: "Roue", ar: "العجلة" },
  onView:    { en: "ON VIEW", fr: "À L'AFFICHE", ar: "المعروض الآن" },
  browse:    { en: "Wheel of portfolio websites", fr: "Roue des sites portfolio", ar: "عجلة مواقع الملفات المهنية" },
  help:      { en: "Drag or swipe sideways  ·  arrow keys ← →", fr: "Glissez sur le côté  ·  flèches ← →", ar: "اسحب جانبياً  ·  مفاتيح الأسهم ← →" },
  show:      { en: "Show", fr: "Afficher", ar: "اعرض" },
  missing:   { en: "Preview unavailable", fr: "Aperçu indisponible", ar: "المعاينة غير متاحة" },
  stopWheel: { en: "Stop the wheel", fr: "Arrêter la roue", ar: "إيقاف العجلة" },
  turnWheel: { en: "Turn the wheel automatically", fr: "Faire tourner la roue", ar: "تدوير العجلة تلقائياً" },
  loading:   { en: "Loading website…", fr: "Chargement du site…", ar: "جارٍ تحميل الموقع…" },
  slow:      { en: "This website is taking a while to load.", fr: "Ce site met du temps à se charger.", ar: "يستغرق تحميل هذا الموقع وقتاً أطول من المعتاد." },
} satisfies Record<string, Record<Lang, string>>;
type Key = keyof typeof TX;
const t = (k: Key, l: Lang) => TX[k][l];

// Counted phrases, with Arabic number agreement (1, 2, 3–10, 11+).
type Forms = { en: [string, string]; fr: [string, string]; ar: [string, string, string, string] };
const COUNT: Record<"websites" | "live" | "concept", Forms> = {
  websites: { en: ["portfolio website", "portfolio websites"], fr: ["site portfolio", "sites portfolio"], ar: ["موقع مهني واحد", "موقعان مهنيان", "مواقع مهنية", "موقعاً مهنياً"] },
  live:     { en: ["live website", "live websites"], fr: ["site en ligne", "sites en ligne"], ar: ["موقع مباشر واحد", "موقعان مباشران", "مواقع مباشرة", "موقعاً مباشراً"] },
  concept:  { en: ["concept design", "concept designs"], fr: ["concept", "concepts"], ar: ["تصميم مفاهيمي واحد", "تصميمان مفاهيميان", "تصاميم مفاهيمية", "تصميماً مفاهيمياً"] },
};
function counted(n: number, key: keyof typeof COUNT, lang: Lang): string {
  const f = COUNT[key];
  if (lang === "ar") {
    if (n === 1) return f.ar[0];
    if (n === 2) return f.ar[1];
    const r = n % 100;
    return `${n} ${r >= 3 && r <= 10 ? f.ar[2] : f.ar[3]}`;
  }
  const [one, many] = lang === "fr" ? f.fr : f.en;
  return `${n} ${(lang === "fr" ? n <= 1 : n === 1) ? one : many}`;
}
const pad = (n: number) => String(n).padStart(2, "0");
// The word under the number in the wheel's hub (with Arabic number agreement).
function hubWord(n: number, lang: Lang): string {
  if (lang === "ar") { const r = n % 100; return n === 1 ? "موقع" : n === 2 ? "موقعان" : r >= 3 && r <= 10 ? "مواقع" : "موقعاً"; }
  return n === 1 ? "SITE" : "SITES";
}

// Colours for the wheel (it is styled with shadcn-style tokens), set on its wrapper for light and dark.
function themeVars(dark: boolean): React.CSSProperties {
  return (dark ? {
    "--background": INK, "--foreground": "#EDE8E0", "--card": "#15130F", "--muted": "#1C1915",
    "--muted-foreground": "#958A80", "--border": "rgba(255,255,255,0.10)", "--accent": "rgba(200,169,110,0.10)",
    "--primary": G, "--primary-foreground": INK, "--ring": G, "--chart-2": G,
  } : {
    "--background": "#F7F3EE", "--foreground": "#1A1410", "--card": "#FFFFFF", "--muted": "#EFE9E1",
    "--muted-foreground": "#6B6057", "--border": "rgba(0,0,0,0.10)", "--accent": "rgba(200,169,110,0.14)",
    "--primary": G, "--primary-foreground": INK, "--ring": "#8A6A2E", "--chart-2": G,
  }) as React.CSSProperties;
}

function useMedia(query: string): boolean {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return on;
}

// Scoped styles for the exhibition (React hoists this into <head> once).
const CSS = `
.zx-wall{transition:background-color .9s ease}
.zx-layer{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.zx-in{animation:zx-wipe .75s cubic-bezier(.77,0,.18,1) both}
.zx-in .zx-shot{animation:zx-settle 1.1s cubic-bezier(.2,.7,.2,1) both}
[dir=rtl] .zx-in{animation-name:zx-wipe-rtl}
.zx-rise{animation:zx-rise .7s cubic-bezier(.2,.7,.2,1) both}
.zx-rise-2{animation-delay:.06s}.zx-rise-3{animation-delay:.12s}
.zx-fade{transition:opacity .5s ease}
.zx-pulse{animation:zx-pulse 2.2s ease-out infinite}
.zx-scroll{scrollbar-width:thin;scrollbar-color:rgba(200,169,110,.35) transparent}
.zx-snap{scrollbar-width:none;-webkit-overflow-scrolling:touch}
.zx-snap::-webkit-scrollbar{display:none}
@keyframes zx-wipe{from{clip-path:inset(0 0 0 100%)}to{clip-path:inset(0 0 0 0)}}
@keyframes zx-wipe-rtl{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes zx-settle{from{transform:scale(1.05)}to{transform:none}}
@keyframes zx-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes zx-pulse{0%{box-shadow:0 0 0 0 rgba(31,164,99,.55)}70%{box-shadow:0 0 0 7px rgba(31,164,99,0)}100%{box-shadow:0 0 0 0 rgba(31,164,99,0)}}
@media (prefers-reduced-motion:reduce){
  .zx-in,.zx-in .zx-shot,.zx-rise,.zx-pulse{animation:none}
  .zx-wall,.zx-fade{transition:none}
}
`;

interface Theme { dark: boolean; bg: string; hi: string; sub: string; line: string; chrome: string; ui: string }

function KindBadge({ site, lang, theme }: { site: Portfolio; lang: Lang; theme: Theme }) {
  const live = site.kind === "live";
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full h-7 px-3 text-[10px] font-semibold uppercase whitespace-nowrap"
      style={live
        ? { background: LIVE, color: "#fff", letterSpacing: lang === "ar" ? "0.02em" : "0.14em", fontFamily: theme.ui }
        : { border: `1px solid ${G}80`, color: theme.dark ? G : "#8A6A2E", letterSpacing: lang === "ar" ? "0.02em" : "0.14em", fontFamily: theme.ui }}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${live ? "zx-pulse" : ""}`} style={{ background: live ? "#fff" : G }} />
      {t(live ? "live" : "concept", lang)}
    </span>
  );
}

// ── One capture inside its device ──────────────────────────────────────────────────────────────

function Screen({ site, device, lang, playing, motionOk }: {
  site: Portfolio; device: Device; lang: Lang; playing: boolean; motionOk: boolean;
}) {
  const has = site.stills.includes(device);
  const src = device === "desktop" ? preview.desktop(site.slug) : device === "tablet" ? preview.tablet(site.slug) : preview.mobile(site.slug);
  const alt = `${t("firstOf", lang)} ${site.name} ${t("on", lang)} ${t(device, lang).toLowerCase()}`;
  const wantsVideo = device === "desktop" && site.loop && motionOk && playing;
  // Only fetch a recording once the visitor has stayed on an entry for a moment (not while skimming the index).
  const [armed, setArmed] = React.useState(false);
  React.useEffect(() => {
    if (!wantsVideo) return;
    const timer = window.setTimeout(() => setArmed(true), 650);
    return () => window.clearTimeout(timer);
  }, [wantsVideo]);
  return (
    <span className="relative block size-full overflow-hidden" style={{ background: site.tone }}>
      {has ? (
        <img
          src={src} alt={alt} draggable={false} decoding="async" loading="lazy"
          className="zx-shot absolute inset-0 size-full object-cover object-top select-none"
        />
      ) : device === "tablet" && site.kind === "live" ? (
        <LiveFrame site={site} lang={lang} />
      ) : null}
      {wantsVideo && armed && <Recording key={site.slug} slug={site.slug} />}
    </span>
  );
}

// The screen recording of a site's opening: muted, looping, faded in once it is actually playing.
function Recording({ slug }: { slug: string }) {
  const [on, setOn] = React.useState(false);
  return (
    <video
      className="zx-fade absolute inset-0 size-full object-cover object-top"
      style={{ opacity: on ? 1 : 0 }}
      muted loop playsInline autoPlay preload="auto" aria-hidden="true" tabIndex={-1}
      ref={v => { if (v) { v.defaultMuted = true; v.muted = true; } }}
      onCanPlay={e => { e.currentTarget.play().catch(() => { /* autoplay refused: the still stays */ }); }}
      onPlaying={() => setOn(true)}
    >
      <source src={preview.loop(slug, "webm")} type="video/webm" />
      <source src={preview.loop(slug, "mp4")} type="video/mp4" />
    </video>
  );
}

// A live website at tablet width, scaled into the frame (used where no tablet capture exists).
function LiveFrame({ site, lang }: { site: Portfolio; lang: Lang }) {
  const box = React.useRef<HTMLSpanElement | null>(null);
  const [scale, setScale] = React.useState(0);
  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 820));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <span ref={box} className="absolute inset-0 block" inert>
      {scale > 0 && (
        <iframe
          src={site.url} title={`${site.name} · ${t("liveFrame", lang)}`} loading="lazy" tabIndex={-1}
          sandbox="allow-scripts allow-same-origin" referrerPolicy="strict-origin-when-cross-origin"
          className="absolute left-0 top-0 border-0 pointer-events-none origin-top-left"
          style={{ width: 820, height: 1180, transform: `scale(${scale})`, background: site.tone }}
        />
      )}
      <span className="absolute bottom-2 start-2 rounded-full px-2.5 h-6 inline-flex items-center text-[9px] font-semibold uppercase" style={{ background: LIVE, color: "#fff", letterSpacing: "0.12em", fontFamily: "sans-serif" }}>
        {t("liveFrame", lang)}
      </span>
    </span>
  );
}

function DeviceFrame({ site, device, lang, theme, playing, motionOk, compact }: {
  site: Portfolio; device: Device; lang: Lang; theme: Theme; playing: boolean; motionOk: boolean; compact?: boolean;
}) {
  const screen = <Screen site={site} device={device} lang={lang} playing={playing} motionOk={motionOk} />;
  if (device === "desktop") {
    return (
      <span className="block w-full overflow-hidden rounded-[10px]" style={{ background: theme.chrome, boxShadow: "0 40px 80px -40px rgba(0,0,0,.65), 0 0 0 1px rgba(0,0,0,.18)" }} dir="ltr">
        <span aria-hidden="true" className={`flex items-center gap-1.5 ${compact ? "h-5 px-2" : "h-7 px-3"}`} style={{ borderBottom: `1px solid ${theme.line}` }}>
          {["#E5534B", "#E3B341", "#57AB5A"].map(c => <span key={c} className={`${compact ? "size-1.5" : "size-2"} rounded-full`} style={{ background: c, opacity: .85 }} />)}
          {!compact && <span className="ms-3 min-w-0 flex-1 truncate rounded-full px-3 h-[18px] leading-[18px] font-mono text-[10px]" style={{ color: theme.sub, background: theme.dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)" }}>{displayUrl(site)}</span>}
        </span>
        <span className="block aspect-[16/10]">{screen}</span>
      </span>
    );
  }
  const tablet = device === "tablet";
  return (
    <span
      className="block h-full"
      style={{ aspectRatio: tablet ? "820 / 1180" : "390 / 844", padding: tablet ? (compact ? 7 : 11) : (compact ? 5 : 7), borderRadius: tablet ? (compact ? 18 : 26) : (compact ? 24 : 38), background: "#0B0A09", boxShadow: "0 40px 70px -36px rgba(0,0,0,.7), inset 0 0 0 1px rgba(255,255,255,.07)" }}
    >
      <span className="block size-full overflow-hidden" style={{ borderRadius: tablet ? (compact ? 12 : 17) : (compact ? 19 : 31) }}>{screen}</span>
    </span>
  );
}

// ── The exhibition ─────────────────────────────────────────────────────────────────────────────

export default function PortfolioShowcase({ dark, lang }: { dark: boolean; lang: Lang }) {
  const isAr = lang === "ar";
  const theme: Theme = {
    dark,
    bg: dark ? INK : "#F7F3EE",
    hi: dark ? "#EDE8E0" : "#1A1410",
    sub: dark ? "#958A80" : "#6B6057",
    line: dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.10)",
    chrome: dark ? "#1A1714" : "#FFFFFF",
    ui: isAr ? "inherit" : "sans-serif",
  };
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const finePointer = useMedia("(hover: hover) and (pointer: fine)");
  const wide = useMedia("(min-width: 1024px)");

  const [filter, setFilter] = React.useState<Filter>("all");
  const [view, setView] = React.useState<View>("wheel");
  const [wheelRunning, setWheelRunning] = React.useState(false);
  const [device, setDevice] = React.useState<Device>("desktop");
  const [activeSlug, setActiveSlug] = React.useState(PORTFOLIOS[0].slug);
  const [prevSlug, setPrevSlug] = React.useState<string | null>(null);
  const [viewing, setViewing] = React.useState(false);
  const [listOpen, setListOpen] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const opener = React.useRef<HTMLElement | null>(null);
  const exhibitRef = React.useRef<HTMLDivElement | null>(null);
  const keepInPlace = React.useRef<{ el: HTMLElement; top: number } | null>(null);
  const indexRef = React.useRef<HTMLOListElement | null>(null);
  const railRef = React.useRef<HTMLDivElement | null>(null);
  const hoverTimer = React.useRef<number | undefined>(undefined);

  // Phones start on the phone captures.
  React.useEffect(() => { if (window.matchMedia("(max-width: 639px)").matches) setDevice("mobile"); }, []);

  // Switching between the wheel and the index keeps the switch where it was on screen.
  React.useLayoutEffect(() => {
    const k = keepInPlace.current;
    keepInPlace.current = null;
    if (k && k.el.isConnected) window.scrollBy({ top: k.el.getBoundingClientRect().top - k.top, behavior: "instant" });
  }, [view]);

  // Only turn the wheel and run recordings while the exhibition is on screen.
  React.useEffect(() => {
    const el = exhibitRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const totals = React.useMemo(() => {
    const live = PORTFOLIOS.filter(p => p.kind === "live").length;
    const byCat = Object.fromEntries(CATEGORIES.map(c => [c, PORTFOLIOS.filter(p => p.category === c).length])) as Record<Category, number>;
    return { all: PORTFOLIOS.length, live, concept: PORTFOLIOS.length - live, byCat };
  }, []);
  // Catalogue numbers stay fixed (01 to the last) whatever the filter.
  const numberOf = React.useMemo(() => Object.fromEntries(PORTFOLIOS.map((p, i) => [p.slug, i + 1])) as Record<string, number>, []);

  const list = React.useMemo(
    () => PORTFOLIOS.filter(p => filter === "all" || (filter === "live" ? p.kind === "live" : p.category === filter)),
    [filter],
  );
  const activeIndex = Math.max(0, list.findIndex(p => p.slug === activeSlug));
  const site = list[activeIndex] ?? list[0];
  const motionOk = !reduce && !(typeof navigator !== "undefined" && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

  const activeRef = React.useRef(activeSlug);
  React.useEffect(() => { activeRef.current = activeSlug; }, [activeSlug]);
  const select = React.useCallback((slug: string) => {
    const cur = activeRef.current;
    if (cur === slug) return;
    activeRef.current = slug;
    setPrevSlug(cur);
    setActiveSlug(slug);
  }, []);
  const step = (d: number) => select(list[(activeIndex + d + list.length) % list.length].slug);

  const chooseFilter = (f: Filter) => {
    setFilter(f);
    const next = PORTFOLIOS.filter(p => f === "all" || (f === "live" ? p.kind === "live" : p.category === f));
    if (!next.some(p => p.slug === activeSlug)) { setPrevSlug(activeSlug); setActiveSlug(next[0].slug); }
    railRef.current?.scrollTo({ left: 0 });
  };

  // Preload the neighbours' captures so the next wipe reveals a finished image.
  React.useEffect(() => {
    if (!wide || list.length < 2) return;
    for (const d of [1, -1]) {
      const n = list[(activeIndex + d + list.length) % list.length];
      if (n.stills.includes(device)) { const img = new Image(); img.src = device === "desktop" ? preview.desktop(n.slug) : device === "tablet" ? preview.tablet(n.slug) : preview.mobile(n.slug); }
    }
  }, [activeIndex, device, list, wide]);

  // Keep the active row in view inside the index (without moving the page).
  React.useEffect(() => {
    const ol = indexRef.current;
    const row = ol?.querySelector<HTMLElement>(`[data-slug="${site.slug}"]`);
    if (!ol || !row) return;
    const top = row.offsetTop, bottom = top + row.offsetHeight; // the list is the rows' offsetParent
    if (top < ol.scrollTop + 8) ol.scrollTo({ top: Math.max(0, top - 48), behavior: reduce ? "auto" : "smooth" });
    else if (bottom > ol.scrollTop + ol.clientHeight - 8) ol.scrollTo({ top: bottom - ol.clientHeight + 48, behavior: reduce ? "auto" : "smooth" });
  }, [site.slug, reduce]);

  const openViewer = (slug: string) => {
    opener.current = document.activeElement as HTMLElement | null;
    select(slug);
    setViewing(true);
  };
  const closeViewer = React.useCallback(() => {
    setViewing(false);
    window.setTimeout(() => opener.current?.focus(), 0);
  }, []);

  const chips: { id: Filter; label: string; n: number }[] = [
    { id: "all", label: t("all", lang), n: totals.all },
    { id: "live", label: t("liveF", lang), n: totals.live },
    ...CATEGORIES.map(c => ({ id: c as Filter, label: t(c, lang), n: totals.byCat[c] })),
  ];
  const devices: { id: Device; icon: React.ReactNode }[] = [
    { id: "desktop", icon: <Monitor size={14} aria-hidden="true" /> },
    { id: "tablet", icon: <Tablet size={14} aria-hidden="true" /> },
    { id: "mobile", icon: <Smartphone size={14} aria-hidden="true" /> },
  ];
  const views: { id: View; icon: React.ReactNode }[] = [
    { id: "wheel", icon: <FerrisWheel size={14} aria-hidden="true" /> },
    { id: "index", icon: <List size={14} aria-hidden="true" /> },
  ];
  const wheelItems: FerrisWheelItem[] = list.map(p => ({
    id: p.slug,
    src: preview.desktop(p.slug),
    thumb: preview.thumb(p.slug),
    alt: `${t("firstOf", lang)} ${p.name}`,
    title: `${p.name} · ${t(p.kind === "live" ? "live" : "concept", lang)}`,
    label: pad(numberOf[p.slug]),
    marker: p.kind === "live" ? LIVE : undefined,
  }));
  const tracking = isAr ? "0.02em" : "0.16em";
  const prevSite = prevSlug ? PORTFOLIOS.find(p => p.slug === prevSlug) : undefined;
  // A recording plays once the visitor has stopped on an entry: not while the wheel turns by itself.
  const playing = wide && inView && !paused && !viewing && !(view === "wheel" && wheelRunning);
  const showVideoControl = device === "desktop" && site.loop && motionOk && wide;

  // Group the index when everything is shown: the featured sites first, then by field.
  // Each group gathers its sites from the whole list, so reordering the list never repeats a heading.
  const groups: { cat: Category | "featured"; items: Portfolio[] }[] = [];
  for (const p of list) {
    const g = p.featured ? "featured" : p.category;
    const found = groups.find(x => x.cat === g);
    if (found) found.items.push(p); else groups.push({ cat: g, items: [p] });
  }
  // Arrow keys in the index follow the order on screen.
  const indexOrder = groups.flatMap(g => g.items);

  const rowKeys = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const go = (j: number) => {
      const n = indexOrder[(j + indexOrder.length) % indexOrder.length];
      select(n.slug);
      indexRef.current?.querySelector<HTMLButtonElement>(`[data-slug="${n.slug}"] button`)?.focus();
    };
    if (e.key === "ArrowDown") { e.preventDefault(); go(i + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); go(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(indexOrder.length - 1); }
  };

  return (
    <section id="websites" className="relative py-28 sm:py-36 px-5 sm:px-8 scroll-mt-20" style={{ borderTop: `1px solid ${theme.line}` }} aria-labelledby="zx-title">
      <style href="zx-exhibition" precedence="medium">{CSS}</style>
      <div className="mx-auto max-w-[1320px]">

        {/* Heading */}
        <div className="mb-10 sm:mb-14 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="text-[9px] font-medium uppercase mb-5" style={{ color: dark ? `${G}AA` : "#8A6A2E", fontFamily: theme.ui, letterSpacing: isAr ? "0.08em" : "0.40em" }}>{t("eyebrow", lang)}</p>
            <h2 id="zx-title" className="text-[36px] sm:text-[54px] font-normal tracking-tight" style={{ color: theme.hi, lineHeight: isAr ? 1.3 : 1.06 }}>
              {counted(totals.all, "websites", lang)}.<br />
              <em style={{ fontStyle: "italic", color: G }}>{t("h2b", lang)}</em>
            </h2>
          </div>
          <div>
            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase mb-4" style={{ color: theme.hi, fontFamily: theme.ui, letterSpacing: isAr ? "0.02em" : "0.14em" }}>
              <span className="normal-case tracking-normal" style={{ color: theme.sub }}>{t("onShow", lang)}</span>
              <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full" style={{ background: LIVE }} />{counted(totals.live, "live", lang)}</span>
              <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full" style={{ background: G }} />{counted(totals.concept, "concept", lang)}</span>
            </p>
            <p className="text-[14px] leading-[1.85] max-w-xl" style={{ color: theme.sub, fontFamily: theme.ui }}>{t("body", lang)}</p>
          </div>
        </div>

        {/* Filters and device */}
        <div className="mb-7 sm:mb-9 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label={t("filterBy", lang)} className="zx-snap -mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {chips.map(c => {
              const on = filter === c.id;
              return (
                <button key={c.id} type="button" aria-pressed={on} onClick={() => chooseFilter(c.id)}
                  className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-full text-[12px] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                  style={{ fontFamily: theme.ui, color: on ? INK : theme.hi, background: on ? G : "transparent", border: `1px solid ${on ? G : theme.line}` }}>
                  {c.id === "live" && <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: on ? INK : LIVE }} />}
                  {c.label}
                  <span className="font-mono text-[10px]" style={{ color: on ? INK : theme.sub }}>{c.n}</span>
                </button>
              );
            })}
          </div>
          <div className="shrink-0 self-start flex flex-wrap items-center gap-2 sm:gap-3">
            <div role="group" aria-label={t("viewAs", lang)} className="inline-flex items-center gap-1 rounded-full p-1" style={{ border: `1px solid ${theme.line}` }}>
              {views.map(v => (
                <button key={v.id} type="button" aria-pressed={view === v.id} onClick={e => { keepInPlace.current = { el: e.currentTarget, top: e.currentTarget.getBoundingClientRect().top }; setView(v.id); }}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[10px] font-medium uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                  style={{ fontFamily: theme.ui, letterSpacing: isAr ? "0.02em" : "0.12em", color: view === v.id ? theme.bg : theme.hi, background: view === v.id ? theme.hi : "transparent" }}>
                  {v.icon}<span>{t(v.id, lang)}</span>
                </button>
              ))}
            </div>
            <div role="group" aria-label={t("device", lang)} className="inline-flex items-center gap-1 rounded-full p-1" style={{ border: `1px solid ${theme.line}` }}>
              {devices.map(d => (
                <button key={d.id} type="button" aria-pressed={device === d.id} onClick={() => setDevice(d.id)}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[10px] font-medium uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                  style={{ fontFamily: theme.ui, letterSpacing: isAr ? "0.02em" : "0.12em", color: device === d.id ? INK : theme.hi, background: device === d.id ? G : "transparent" }}>
                  {d.icon}<span className="sr-only sm:not-sr-only">{t(d.id, lang)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div ref={exhibitRef}>
        {view === "wheel" ? (
          <div style={themeVars(dark)}>
            <FerrisWheelGallery
              key={filter}
              items={wheelItems}
              active={activeIndex}
              onActiveChange={i => { if (list[i]) select(list[i].slug); }}
              dir={isAr ? "rtl" : "ltr"}
              autoplay={inView && !viewing}
              interval={4600}
              onRunningChange={setWheelRunning}
              aria-label={t("carousel", lang)}
              labels={{
                region: t("carousel", lang), onView: t("onView", lang), hub: hubWord(list.length, lang), item: "",
                browse: t("browse", lang), help: t("help", lang), previous: t("prev", lang), next: t("next", lang),
                unavailable: t("missing", lang), pause: t("stopWheel", lang), resume: t("turnWheel", lang),
                view: (title, n, total) => `${t("show", lang)} ${title}, ${n} ${t("of", lang)} ${total}`,
              }}
              renderPreview={(_, i) => list[i] && (
                <WheelPreview
                  site={list[i]} prevSite={prevSite} device={device} lang={lang} theme={theme}
                  playing={playing} motionOk={motionOk} reduce={reduce}
                  onSettled={() => setPrevSlug(null)} onOpen={() => openViewer(list[i].slug)}
                  videoControl={showVideoControl && list[i].slug === site.slug ? (
                    <button type="button" onClick={e => { e.stopPropagation(); setPaused(p => !p); }} title={t("opening", lang)}
                      className="absolute top-3 end-3 inline-flex items-center gap-2 h-8 ps-2.5 pe-3 rounded-full text-[10px] uppercase outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                      style={{ background: dark ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.7)", color: theme.hi, fontFamily: theme.ui, letterSpacing: isAr ? "0.02em" : "0.12em", backdropFilter: "blur(8px)" }}>
                      {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
                      <span>{t(paused ? "play" : "pause", lang)}</span>
                    </button>
                  ) : null}
                />
              )}
              renderCaption={(_, i) => {
                const p = list[i];
                if (!p) return null;
                return (
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[11px]" style={{ color: theme.sub }}>No. {pad(numberOf[p.slug])}</span>
                      <KindBadge site={p} lang={lang} theme={theme} />
                      <span className="text-[11px] uppercase" style={{ color: theme.sub, fontFamily: theme.ui, letterSpacing: tracking }}>{t(p.category, lang)}</span>
                    </div>
                    <h3 className="mt-3 text-[28px] sm:text-[34px] xl:text-[38px] leading-[1.06] tracking-tight" style={{ color: theme.hi }}>{p.name}</h3>
                    <p className="mt-1.5 text-[14px]" style={{ color: theme.sub, fontFamily: theme.ui }}>{p.role[lang]}</p>
                    <p className="mt-4 text-[14.5px] leading-[1.7] max-w-[60ch]" style={{ color: theme.hi, fontFamily: theme.ui }}>
                      {p.kind === "concept" && <><span className="text-[10px] uppercase me-2" style={{ color: dark ? G : "#8A6A2E", letterSpacing: tracking }}>{t("theIdea", lang)}</span><em className="not-italic font-semibold">{p.idea[lang]}.</em>{" "}</>}
                      <span style={{ color: theme.sub }}>{p.line[lang]}</span>
                    </p>
                  </div>
                );
              }}
              renderActions={(_, i) => list[i] && (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <button type="button" onClick={() => openViewer(list[i].slug)}
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-full whitespace-nowrap text-[10px] font-semibold uppercase transition-opacity hover:opacity-85 outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                    style={{ background: theme.hi, color: theme.bg, fontFamily: theme.ui, letterSpacing: tracking }}>
                    <Maximize2 size={12} aria-hidden="true" />{t("view", lang)}<span className="sr-only">: {list[i].name}</span>
                  </button>
                  <a href={list[i].url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[11.5px] underline-offset-4 hover:underline" style={{ color: theme.sub, fontFamily: theme.ui }}>
                    <ExternalLink size={11} aria-hidden="true" />{t("newTab", lang)}
                  </a>
                </div>
              )}
            />
          </div>
        ) : (<>
        {/* Desktop: stage + index */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] gap-10 items-start">
          <div role="region" aria-roledescription="carousel" aria-label={t("carousel", lang)}>
            <div
              className="zx-wall relative overflow-hidden rounded-[18px] aspect-[16/10.6]"
              style={{ backgroundColor: `color-mix(in oklab, ${site.tone} ${dark ? 26 : 30}%, ${theme.bg})`, boxShadow: `inset 0 0 0 1px ${theme.line}`, touchAction: "pan-y" }}
              onPointerDown={e => { (e.currentTarget as HTMLElement).dataset.x = String(e.clientX); }}
              onPointerUp={e => {
                const x0 = Number((e.currentTarget as HTMLElement).dataset.x);
                if (e.pointerType !== "mouse" && Number.isFinite(x0) && Math.abs(e.clientX - x0) > 50) step((e.clientX < x0) !== isAr ? 1 : -1);
              }}
            >
              <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 42%, ${dark ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.55)"}, transparent 70%)` }} />
              {prevSite && prevSite.slug !== site.slug && !reduce && (
                <div className="zx-layer" aria-hidden="true">
                  <StageFrame site={prevSite} device={device} lang={lang} theme={theme} playing={false} motionOk={false} />
                </div>
              )}
              <div key={`${site.slug}-${device}`} className={`zx-layer ${prevSite && !reduce ? "zx-in" : ""}`} onAnimationEnd={e => { if (e.target === e.currentTarget) setPrevSlug(null); }}>
                <StageFrame site={site} device={device} lang={lang} theme={theme} playing={playing} motionOk={motionOk} />
              </div>
              <span className="absolute top-3 start-4 rounded-full px-3 h-8 inline-flex items-center font-mono text-[11px]" style={{ color: theme.sub, background: dark ? "rgba(10,9,7,.62)" : "rgba(255,255,255,.78)", backdropFilter: "blur(8px)" }}>
                <span style={{ color: theme.hi }}>{pad(activeIndex + 1)}</span>&nbsp;/ {pad(list.length)}
              </span>
              <span className="sr-only" aria-live="polite">{`${site.name}, ${site.role[lang]}. ${pad(activeIndex + 1)} ${t("of", lang)} ${pad(list.length)}`}</span>
              {showVideoControl && (
                <button type="button" onClick={() => setPaused(p => !p)} title={t("opening", lang)}
                  className="absolute top-3 end-4 inline-flex items-center gap-2 h-8 ps-2.5 pe-3 rounded-full text-[10px] uppercase outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                  style={{ background: dark ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.7)", color: theme.hi, fontFamily: theme.ui, letterSpacing: isAr ? "0.02em" : "0.12em", backdropFilter: "blur(8px)" }}>
                  {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
                  <span>{t(paused ? "play" : "pause", lang)}</span>
                </button>
              )}
            </div>

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] gap-x-8 gap-y-4 items-start">
              <div key={site.slug} className="min-w-0">
                <div className="zx-rise flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[11px]" style={{ color: theme.sub }}>No. {pad(numberOf[site.slug])}</span>
                  <KindBadge site={site} lang={lang} theme={theme} />
                  <span className="text-[11px] uppercase" style={{ color: theme.sub, fontFamily: theme.ui, letterSpacing: tracking }}>{t(site.category, lang)}</span>
                </div>
                <h3 className="zx-rise zx-rise-2 mt-3 text-[34px] xl:text-[40px] leading-[1.05] tracking-tight" style={{ color: theme.hi }}>{site.name}</h3>
                <p className="zx-rise zx-rise-2 mt-1.5 text-[14px]" style={{ color: theme.sub, fontFamily: theme.ui }}>{site.role[lang]}</p>
                <p className="zx-rise zx-rise-3 mt-4 text-[15px] leading-[1.7] max-w-[60ch]" style={{ color: theme.hi, fontFamily: theme.ui }}>
                  {site.kind === "concept" && <><span className="text-[10px] uppercase me-2" style={{ color: dark ? G : "#8A6A2E", letterSpacing: tracking }}>{t("theIdea", lang)}</span><em className="not-italic font-semibold">{site.idea[lang]}.</em>{" "}</>}
                  <span style={{ color: theme.sub }}>{site.line[lang]}</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => step(-1)} aria-label={t("prev", lang)} className="grid size-10 place-items-center rounded-full outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#C8A96E]" style={{ border: `1px solid ${theme.line}`, color: theme.hi }}><ArrowLeft size={15} className="rtl:-scale-x-100" /></button>
                  <button type="button" onClick={() => step(1)} aria-label={t("next", lang)} className="grid size-10 place-items-center rounded-full outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[#C8A96E]" style={{ background: G, color: INK }}><ArrowRight size={15} className="rtl:-scale-x-100" /></button>
                </div>
                <button type="button" onClick={() => openViewer(site.slug)}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full whitespace-nowrap text-[10px] font-semibold uppercase transition-opacity hover:opacity-85 outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                  style={{ background: theme.hi, color: theme.bg, fontFamily: theme.ui, letterSpacing: tracking }}>
                  <Maximize2 size={12} aria-hidden="true" />{t("view", lang)}
                </button>
                <a href={site.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[11px] underline-offset-4 hover:underline" style={{ color: theme.sub, fontFamily: theme.ui }}>
                  <ExternalLink size={11} aria-hidden="true" />{t("newTab", lang)}
                </a>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <p className="flex items-baseline justify-between pb-3 text-[10px] uppercase" style={{ color: theme.sub, fontFamily: theme.ui, letterSpacing: tracking, borderBottom: `1px solid ${theme.line}` }}>
              <span>{t("index", lang)}</span><span className="font-mono normal-case tracking-normal">{counted(list.length, "websites", lang)}</span>
            </p>
            <ol ref={indexRef} aria-label={t("index", lang)} className="zx-scroll relative max-h-[min(74vh,700px)] overflow-y-auto pe-1 -me-1">
              {groups.map(g => (
                <li key={g.cat} className="list-none">
                  {filter === "all" && (
                    <p className="pt-5 pb-1.5 text-[9.5px] uppercase" style={{ color: dark ? G : "#8A6A2E", fontFamily: theme.ui, letterSpacing: tracking }}>
                      {t(g.cat, lang)} <span className="font-mono" style={{ color: theme.sub }}>· {g.items.length}</span>
                    </p>
                  )}
                  <ol>
                    {g.items.map(p => {
                      const i = indexOrder.indexOf(p), on = p.slug === site.slug;
                      return (
                        <li key={p.slug} data-slug={p.slug} className="list-none">
                          <button type="button" aria-current={on ? "true" : undefined}
                            onClick={() => select(p.slug)}
                            onDoubleClick={() => openViewer(p.slug)}
                            onKeyDown={e => rowKeys(e, i)}
                            onPointerEnter={e => { if (e.pointerType !== "mouse" || !finePointer) return; window.clearTimeout(hoverTimer.current); hoverTimer.current = window.setTimeout(() => select(p.slug), 160); }}
                            onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
                            className="group relative grid w-full grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-3 py-2.5 ps-3 pe-2 text-start rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                            style={{ background: on ? (dark ? "rgba(200,169,110,.10)" : "rgba(200,169,110,.16)") : "transparent" }}>
                            <span aria-hidden="true" className="absolute inset-y-2 start-0 w-[2px] rounded-full transition-opacity" style={{ background: G, opacity: on ? 1 : 0 }} />
                            <span className="font-mono text-[10.5px]" style={{ color: on ? theme.hi : theme.sub }}>{pad(numberOf[p.slug])}</span>
                            <span className="min-w-0">
                              <span className="block truncate text-[15.5px] leading-tight" style={{ color: theme.hi }}>{p.name}</span>
                              <span className="mt-0.5 block truncate text-[11.5px]" style={{ color: theme.sub, fontFamily: theme.ui }}>{p.role[lang]}</span>
                            </span>
                            {p.kind === "live"
                              ? <span className="rounded-full px-2 h-5 inline-flex items-center text-[9px] font-semibold uppercase" style={{ background: LIVE, color: "#fff", letterSpacing: isAr ? 0 : "0.1em", fontFamily: theme.ui }}>{t("liveF", lang)}</span>
                              : <span aria-hidden="true" className="text-[11px] opacity-0 transition-opacity group-hover:opacity-100" style={{ color: G }}>{isAr ? "←" : "→"}</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Phones and tablets: a swipeable row of cards */}
        <div className="lg:hidden">
          <MobileRail
            list={list} device={device} lang={lang} theme={theme} numberOf={numberOf}
            railRef={railRef} onOpen={openViewer} onActive={slug => setActiveSlug(slug)} activeSlug={site.slug}
          />
          <div className="mt-6">
            <button type="button" aria-expanded={listOpen} onClick={() => setListOpen(o => !o)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full text-[11px] uppercase outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
              style={{ border: `1px solid ${theme.line}`, color: theme.hi, fontFamily: theme.ui, letterSpacing: isAr ? "0.02em" : "0.12em" }}>
              {listOpen ? t("hideList", lang) : t("showList", lang)} <span className="font-mono" style={{ color: theme.sub }}>{list.length}</span>
            </button>
            {listOpen && (
              <ol className="mt-3" style={{ borderTop: `1px solid ${theme.line}` }}>
                {list.map(p => (
                  <li key={p.slug} className="list-none" style={{ borderBottom: `1px solid ${theme.line}` }}>
                    <button type="button" className="grid w-full grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-3 py-3 text-start outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E] rounded"
                      onClick={() => {
                        setActiveSlug(p.slug);
                        const card = railRef.current?.querySelector<HTMLElement>(`[data-slug="${p.slug}"]`);
                        card?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center", inline: "center" });
                      }}>
                      <span className="font-mono text-[10.5px]" style={{ color: theme.sub }}>{pad(numberOf[p.slug])}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-[15px]" style={{ color: theme.hi }}>{p.name}</span>
                        <span className="block truncate text-[11.5px]" style={{ color: theme.sub, fontFamily: theme.ui }}>{p.role[lang]}</span>
                      </span>
                      {p.kind === "live" && <span className="rounded-full px-2 h-5 inline-flex items-center text-[9px] font-semibold uppercase" style={{ background: LIVE, color: "#fff", fontFamily: theme.ui }}>{t("liveF", lang)}</span>}
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
        </>)}
        </div>

        <div className="mt-14 flex flex-wrap items-start justify-between gap-4 pt-6" style={{ borderTop: `1px solid ${theme.line}` }}>
          <p className="max-w-3xl text-[11.5px] leading-[1.8]" style={{ color: theme.sub, fontFamily: theme.ui }}>{t("note", lang)}</p>
          <p className="text-[11.5px]" style={{ color: theme.sub, fontFamily: theme.ui }}>
            {t("want", lang)}{" "}
            <a href="#custom-builder" className="underline underline-offset-4 transition-opacity hover:opacity-70" style={{ color: dark ? G : "#8A6A2E" }}>{t("kit", lang)}</a>
          </p>
        </div>
      </div>

      {viewing && (
        <SiteViewer list={list} index={activeIndex} initialDevice={device} dark={dark} lang={lang} onIndex={i => select(list[i].slug)} onClose={closeViewer} />
      )}
    </section>
  );
}

// The device sized to fit the stage: desktop by width, tablet and phone by height.
function StageFrame(props: { site: Portfolio; device: Device; lang: Lang; theme: Theme; playing: boolean; motionOk: boolean }) {
  const { device } = props;
  return device === "desktop"
    ? <span className="block w-[84%]"><DeviceFrame {...props} /></span>
    : <span className="block h-[86%]"><DeviceFrame {...props} /></span>;
}

// The large preview beside the wheel: the device on a wall in the site's own colour, wiping in from the
// reading direction when the wheel brings another website up. Clicking it opens the website.
function WheelPreview({ site, prevSite, device, lang, theme, playing, motionOk, reduce, onSettled, onOpen, videoControl }: {
  site: Portfolio; prevSite?: Portfolio; device: Device; lang: Lang; theme: Theme; playing: boolean; motionOk: boolean; reduce: boolean;
  onSettled: () => void; onOpen: () => void; videoControl: React.ReactNode;
}) {
  const wiping = !!prevSite && prevSite.slug !== site.slug && !reduce;
  return (
    // the picture opens the viewer for pointer and touch; keyboard users have the "View the website" button
    <div
      className={`zx-wall relative cursor-pointer overflow-hidden rounded-[18px] ${device === "desktop" ? "aspect-[16/11]" : "aspect-[4/4.3] @min-[860px]/ferris:aspect-[16/11]"}`}
      style={{ backgroundColor: `color-mix(in oklab, ${site.tone} ${theme.dark ? 26 : 30}%, ${theme.bg})`, boxShadow: `inset 0 0 0 1px ${theme.line}` }}
      onClick={onOpen}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 60% at 50% 42%, ${theme.dark ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.55)"}, transparent 70%)` }} />
      {wiping && prevSite && (
        <div className="zx-layer" aria-hidden="true">
          <StageFrame site={prevSite} device={device} lang={lang} theme={theme} playing={false} motionOk={false} />
        </div>
      )}
      <div key={`${site.slug}-${device}`} className={`zx-layer ${wiping ? "zx-in" : ""}`} onAnimationEnd={e => { if (e.target === e.currentTarget) onSettled(); }}>
        <StageFrame site={site} device={device} lang={lang} theme={theme} playing={playing} motionOk={motionOk} />
      </div>
      {videoControl}
    </div>
  );
}

function MobileRail({ list, device, lang, theme, numberOf, railRef, onOpen, onActive, activeSlug }: {
  list: Portfolio[]; device: Device; lang: Lang; theme: Theme; numberOf: Record<string, number>;
  railRef: React.RefObject<HTMLDivElement | null>; onOpen: (slug: string) => void; onActive: (slug: string) => void; activeSlug: string;
}) {
  const isAr = lang === "ar";
  const [current, setCurrent] = React.useState(0);
  const tick = React.useRef(0);
  const onScroll = () => {
    cancelAnimationFrame(tick.current);
    tick.current = requestAnimationFrame(() => {
      const rail = railRef.current;
      if (!rail) return;
      const mid = rail.getBoundingClientRect().left + rail.clientWidth / 2;
      let best = 0, dist = Infinity;
      Array.from(rail.children).forEach((c, i) => {
        const r = (c as HTMLElement).getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < dist) { dist = d; best = i; }
      });
      setCurrent(best);
      if (list[best] && list[best].slug !== activeSlug) onActive(list[best].slug);
    });
  };
  const go = (d: number) => {
    const rail = railRef.current;
    const i = Math.min(list.length - 1, Math.max(0, current + d));
    (rail?.children[i] as HTMLElement | undefined)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };
  React.useEffect(() => { setCurrent(0); }, [list]);
  return (
    <div role="region" aria-roledescription="carousel" aria-label={t("carousel", lang)}>
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px]" style={{ color: theme.sub }} aria-live="polite"><span style={{ color: theme.hi }}>{pad(current + 1)}</span> / {pad(list.length)}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => go(-1)} disabled={current === 0} aria-label={t("prev", lang)} className="grid size-10 place-items-center rounded-full outline-none disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-[#C8A96E]" style={{ border: `1px solid ${theme.line}`, color: theme.hi }}><ArrowLeft size={15} className="rtl:-scale-x-100" /></button>
          <button type="button" onClick={() => go(1)} disabled={current >= list.length - 1} aria-label={t("next", lang)} className="grid size-10 place-items-center rounded-full outline-none disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-[#C8A96E]" style={{ background: G, color: INK }}><ArrowRight size={15} className="rtl:-scale-x-100" /></button>
        </div>
      </div>
      <div ref={railRef} onScroll={onScroll} className="zx-snap -mx-5 sm:-mx-8 px-5 sm:px-8 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-5 sm:scroll-px-8 pb-2">
        {list.map((p, i) => (
          <article key={p.slug} data-slug={p.slug} aria-roledescription="slide" aria-label={`${pad(i + 1)} ${t("of", lang)} ${pad(list.length)}: ${p.name}`}
            className="snap-center shrink-0 w-[84vw] max-w-[440px] sm:w-[60vw]">
            {/* the picture opens the viewer too, for pointer and touch; keyboard users have the button below */}
            <div onClick={() => onOpen(p.slug)} className="cursor-pointer">
              <span className="flex items-center justify-center rounded-[16px] overflow-hidden aspect-[4/4.6] p-4"
                style={{ backgroundColor: `color-mix(in oklab, ${p.tone} ${theme.dark ? 26 : 30}%, ${theme.bg})`, boxShadow: `inset 0 0 0 1px ${theme.line}` }}>
                {device === "desktop"
                  ? <span className="block w-full"><DeviceFrame site={p} device="desktop" lang={lang} theme={theme} playing={false} motionOk={false} compact /></span>
                  : <span className="block h-full"><DeviceFrame site={p} device={device} lang={lang} theme={theme} playing={false} motionOk={false} compact /></span>}
              </span>
            </div>
            <div className="mt-4 px-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[10.5px]" style={{ color: theme.sub }}>No. {pad(numberOf[p.slug])}</span>
                <KindBadge site={p} lang={lang} theme={theme} />
              </div>
              <h3 className="mt-2.5 text-[26px] leading-[1.1] tracking-tight" style={{ color: theme.hi }}>{p.name}</h3>
              <p className="mt-1 text-[13px]" style={{ color: theme.sub, fontFamily: theme.ui }}>{p.role[lang]}</p>
              <p className="mt-3 text-[13.5px] leading-[1.65]" style={{ color: theme.sub, fontFamily: theme.ui }}>
                {p.kind === "concept" && <b className="font-semibold" style={{ color: theme.hi }}>{p.idea[lang]}. </b>}{p.line[lang]}
              </p>
              <button type="button" onClick={() => onOpen(p.slug)}
                className="mt-4 inline-flex items-center gap-2 h-10 px-5 rounded-full text-[10px] font-semibold uppercase outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                style={{ background: theme.hi, color: theme.bg, fontFamily: theme.ui, letterSpacing: isAr ? "0.02em" : "0.14em" }}>
                <Maximize2 size={11} aria-hidden="true" />{t("view", lang)}<span className="sr-only">: {p.name}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ── Full-screen viewer: the real website in an iframe, at desktop, tablet or phone width ──────────

function SiteViewer({ list, index, initialDevice, dark, lang, onIndex, onClose }: {
  list: Portfolio[]; index: number; initialDevice: Device; dark: boolean; lang: Lang; onIndex: (i: number) => void; onClose: () => void;
}) {
  const total = list.length;
  const site = list[index];
  const live = site.kind === "live";
  const isAr = lang === "ar";
  const [loaded, setLoaded] = React.useState(false);
  const [slow, setSlow] = React.useState(false);
  const [device, setDevice] = React.useState<Device>(initialDevice);
  const box = React.useRef<HTMLDivElement | null>(null);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const go = React.useCallback((d: number) => { setLoaded(false); setSlow(false); onIndex((index + d + total) % total); }, [index, onIndex, total]);

  const shell = dark ? "#0C0B09" : "#F8F4EF";
  const bar = dark ? "#14120F" : "#FFFFFF";
  const hi = dark ? "#EDE8E0" : "#1A1410";
  const sub = dark ? "#958A80" : "#6B6057";
  const line = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const ui = isAr ? "inherit" : "sans-serif";

  React.useEffect(() => {
    closeRef.current?.focus();
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (e.key === "ArrowRight" && tag !== "INPUT") go(1);
      else if (e.key === "ArrowLeft" && tag !== "INPUT") go(-1);
      else if (e.key === "Tab" && box.current) {
        // keep keyboard focus inside the dialog
        const f = Array.from(box.current.querySelectorAll<HTMLElement>("button, a[href], iframe")).filter(el => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    // focus that leaves the dialog (for example by tabbing out of the website inside it) comes back to it
    const onFocusIn = (e: FocusEvent) => { if (box.current && e.target instanceof Node && !box.current.contains(e.target)) closeRef.current?.focus(); };
    window.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocusIn);
    return () => { root.style.overflow = before; window.removeEventListener("keydown", onKey); document.removeEventListener("focusin", onFocusIn); };
  }, [onClose, go]);

  React.useEffect(() => {
    if (loaded) return;
    const timer = window.setTimeout(() => setSlow(true), 12000);
    return () => window.clearTimeout(timer);
  }, [loaded, site.slug]);

  const iconBtn = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-70 outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]";
  const frameWidth = device === "desktop" ? "100%" : device === "tablet" ? "820px" : "390px";
  const devices: { id: Device; icon: React.ReactNode }[] = [
    { id: "desktop", icon: <Monitor size={14} aria-hidden="true" /> },
    { id: "tablet", icon: <Tablet size={14} aria-hidden="true" /> },
    { id: "mobile", icon: <Smartphone size={14} aria-hidden="true" /> },
  ];

  return (
    <div ref={box} className="fixed inset-0 z-[96] flex items-stretch justify-center sm:p-5" role="dialog" aria-modal="true" aria-label={`${site.name} · ${t(live ? "live" : "concept", lang)}`}>
      <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(5,4,3,0.88)", backdropFilter: "blur(14px)" }} />
      <div className="relative flex w-full max-w-[1440px] flex-col overflow-hidden sm:rounded-2xl" style={{ background: shell, border: `1px solid ${line}`, boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }}>
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 shrink-0" style={{ background: bar, borderBottom: `1px solid ${line}` }} dir="ltr">
          <div className="hidden sm:flex items-center gap-1.5 pe-1" aria-hidden="true">
            {["#E5534B", "#E3B341", "#57AB5A"].map(c => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.85 }} />)}
          </div>
          <div className="min-w-0 flex-1 flex items-center gap-2 rounded-full px-3 h-8" style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.035)", border: `1px solid ${line}` }}>
            {live && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full" style={{ background: "#1FA463" }} />}
            <span className="truncate text-[11px]" style={{ color: sub, fontFamily: "ui-monospace, Menlo, monospace" }}>{displayUrl(site)}</span>
          </div>
          <span className="hidden md:inline-flex" dir={isAr ? "rtl" : "ltr"}><KindBadge site={site} lang={lang} theme={{ dark, bg: shell, hi, sub, line, chrome: bar, ui }} /></span>
          <div role="group" aria-label={t("device", lang)} className="hidden lg:flex items-center gap-1 rounded-full p-0.5" style={{ border: `1px solid ${line}` }}>
            {devices.map(d => (
              <button key={d.id} type="button" aria-pressed={device === d.id} aria-label={t(d.id, lang)} title={t(d.id, lang)} onClick={() => setDevice(d.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                style={{ color: device === d.id ? INK : hi, background: device === d.id ? G : "transparent" }}>{d.icon}</button>
            ))}
          </div>
          {total > 1 && <button type="button" onClick={() => go(-1)} aria-label={t("prev", lang)} className={iconBtn} style={{ color: hi, border: `1px solid ${line}` }}><ArrowLeft size={14} /></button>}
          {total > 1 && <button type="button" onClick={() => go(1)} aria-label={t("next", lang)} className={iconBtn} style={{ color: INK, background: G }}><ArrowRight size={14} /></button>}
          <a href={site.url} target="_blank" rel="noopener" aria-label={t("newTab", lang)} title={t("newTab", lang)} className={iconBtn} style={{ color: hi, border: `1px solid ${line}` }}><ExternalLink size={13} /></a>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={t("close", lang)} className={iconBtn} style={{ color: hi, border: `1px solid ${line}` }}><X size={15} /></button>
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-2 shrink-0 md:hidden" style={{ background: bar, borderBottom: `1px solid ${line}` }} dir={isAr ? "rtl" : "ltr"}>
          <p className="truncate text-[12px]" style={{ color: hi, fontFamily: ui }}><b style={{ fontWeight: 600 }}>{site.name}</b> <span style={{ color: sub }}>· {site.role[lang]}</span></p>
          <KindBadge site={site} lang={lang} theme={{ dark, bg: shell, hi, sub, line, chrome: bar, ui }} />
        </div>
        <div className="relative flex-1 min-h-0 overflow-x-auto" style={{ background: device === "desktop" ? "#FFFFFF" : (dark ? "#0E0C0A" : "#E7E1D8") }}>
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center" style={{ background: shell }} dir={isAr ? "rtl" : "ltr"}>
              {!slow ? (
                <>
                  <Loader2 size={20} className="animate-spin motion-reduce:animate-none" color={G} />
                  <p className="text-[11px]" style={{ color: sub, fontFamily: ui }}>{t("loading", lang)}</p>
                </>
              ) : (
                <>
                  <p className="text-[13px]" style={{ color: hi, fontFamily: ui }}>{t("slow", lang)}</p>
                  <a href={site.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-[10px] font-medium uppercase" style={{ background: G, color: INK, letterSpacing: "0.16em", fontFamily: ui }}><ExternalLink size={12} aria-hidden="true" />{t("newTab", lang)}</a>
                </>
              )}
            </div>
          )}
          <div className="mx-auto h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: frameWidth, maxWidth: "100%", boxShadow: device === "desktop" ? undefined : "0 0 0 1px rgba(0,0,0,0.12), 0 30px 60px -30px rgba(0,0,0,0.5)" }}>
            <iframe
              key={site.slug}
              src={site.url}
              title={`${site.name}, ${site.role[lang]} · ${t(live ? "live" : "concept", lang)}`}
              className="block h-full w-full border-0"
              onLoad={e => {
                setLoaded(true);
                // Escape inside one of our own pages closes the viewer too (a live site on another domain cannot be reached)
                try { e.currentTarget.contentDocument?.addEventListener("keydown", ev => { if (ev.key === "Escape") onClose(); }); } catch { /* cross-origin */ }
              }}
              sandbox={live ? "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads" : undefined}
              referrerPolicy={live ? "strict-origin-when-cross-origin" : undefined}
              style={{ opacity: loaded ? 1 : 0, transition: "opacity 300ms ease", background: site.tone }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
