"use client";

// "Portfolio websites" section: live portfolios and concept designs, browsed on the
// Ferris wheel (or as a grid), filtered by field, and opened in a full-screen viewer.
// Every count on screen comes from lib/portfolios.ts, so the numbers stay honest.

import * as React from "react";
import { ArrowLeft, ArrowRight, CircleDot, ExternalLink, LayoutGrid, Loader2, Maximize2, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { FerrisWheelGallery, type FerrisWheelItem } from "@/components/ui/ferris-wheel-gallery";
import { CATEGORIES, PORTFOLIOS, displayUrl, preview, type Category, type Lang, type Portfolio } from "@/lib/portfolios";

const G = "#C8A96E", INK = "#0A0907", LIVE = "#1FA463";

type Filter = "all" | "live" | Category;
type Device = "desktop" | "tablet" | "mobile";

const TX: Record<string, Record<Lang, string>> = {
  eyebrow:  { en: "Portfolio websites", fr: "Sites portfolio", ar: "مواقع الملفات المهنية" },
  h2b:      { en: "One higher standard.", fr: "Un seul niveau d'exigence.", ar: "بمعيار أعلى." },
  body:     { en: "Explore exceptional personal websites engineered to elevate careers, strengthen professional identities, and open doors to new opportunities.",
              fr: "Découvrez des sites personnels d'exception, conçus pour faire progresser les carrières, affirmer les identités professionnelles et ouvrir la voie à de nouvelles opportunités.",
              ar: "اكتشف مواقع شخصية استثنائية صُمّمت للارتقاء بالمسيرة المهنية، وتعزيز الهوية المهنية، وفتح الأبواب أمام فرص جديدة." },
  note:     { en: "Live websites are real portfolios, shown as published by their owners. Concept designs were created by Zenith Dubai CV for fictional people; their employers and figures are illustrative.",
              fr: "Les sites en ligne sont de vrais portfolios, présentés tels que publiés par leurs propriétaires. Les concepts ont été créés par Zenith Dubai CV pour des personnes fictives ; employeurs et chiffres sont illustratifs.",
              ar: "المواقع المباشرة ملفات مهنية حقيقية تُعرض كما نشرها أصحابها. أما التصاميم المفاهيمية فقد أعدّتها زينيث دبي سي في لشخصيات خيالية، وجهات العمل والأرقام فيها توضيحية." },
  live:     { en: "Live website", fr: "Site en ligne", ar: "موقع مباشر" },
  concept:  { en: "Concept design", fr: "Concept", ar: "تصميم مفاهيمي" },
  idea:     { en: "Concept", fr: "Concept", ar: "الفكرة" },
  open:     { en: "View full website", fr: "Voir le site complet", ar: "عرض الموقع كاملاً" },
  openShort:{ en: "View website", fr: "Voir le site", ar: "عرض الموقع" },
  want:     { en: "Want a website like these?", fr: "Vous voulez un site comme ceux-ci ?", ar: "هل تريد موقعاً كهذه المواقع؟" },
  kit:      { en: "Portfolio / Personal Branding Kit", fr: "Kit portfolio / personal branding", ar: "مجموعة الملف والعلامة الشخصية" },
  newTab:   { en: "Open in a new tab", fr: "Ouvrir dans un nouvel onglet", ar: "فتح في علامة تبويب جديدة" },
  close:    { en: "Close", fr: "Fermer", ar: "إغلاق" },
  prev:     { en: "Previous website", fr: "Site précédent", ar: "الموقع السابق" },
  next:     { en: "Next website", fr: "Site suivant", ar: "الموقع التالي" },
  loading:  { en: "Loading website…", fr: "Chargement du site…", ar: "جارٍ تحميل الموقع…" },
  slow:     { en: "This website is taking a while to load.", fr: "Ce site met du temps à se charger.", ar: "يستغرق تحميل هذا الموقع وقتاً أطول من المعتاد." },
  onView:   { en: "ON VIEW", fr: "À L'AFFICHE", ar: "المعروض" },
  hub:      { en: "SITES", fr: "SITES", ar: "موقع" },
  browse:   { en: "Browse the portfolio websites", fr: "Parcourir les sites portfolio", ar: "تصفّح مواقع الملفات المهنية" },
  help:     { en: "Drag or swipe sideways  /  use ← →", fr: "Glissez latéralement  /  utilisez ← →", ar: "اسحب جانبياً  /  استخدم ← →" },
  region:   { en: "Portfolio websites", fr: "Sites portfolio", ar: "مواقع الملفات المهنية" },
  missing:  { en: "Preview unavailable", fr: "Aperçu indisponible", ar: "المعاينة غير متاحة" },
  show:     { en: "Show", fr: "Afficher", ar: "عرض" },
  of:       { en: "of", fr: "sur", ar: "من" },
  homeOf:   { en: "Homepage of the website of", fr: "Page d'accueil du site de", ar: "الصفحة الرئيسية لموقع" },
  filterBy: { en: "Filter by field", fr: "Filtrer par domaine", ar: "تصفية حسب المجال" },
  viewAs:   { en: "Display", fr: "Affichage", ar: "طريقة العرض" },
  wheel:    { en: "Wheel", fr: "Roue", ar: "العجلة" },
  grid:     { en: "Grid", fr: "Grille", ar: "الشبكة" },
  device:   { en: "Preview size", fr: "Taille de l'aperçu", ar: "حجم المعاينة" },
  desktop:  { en: "Desktop", fr: "Ordinateur", ar: "سطح المكتب" },
  tablet:   { en: "Tablet", fr: "Tablette", ar: "جهاز لوحي" },
  mobile:   { en: "Mobile", fr: "Mobile", ar: "الجوال" },
  all:      { en: "All", fr: "Tous", ar: "الكل" },
  liveF:    { en: "Live", fr: "En ligne", ar: "مباشر" },
  hospitality: { en: "Hospitality & travel", fr: "Hôtellerie et voyage", ar: "الضيافة والسفر" },
  finance:  { en: "Finance & law", fr: "Finance et droit", ar: "المال والقانون" },
  tech:     { en: "Technology & design", fr: "Technologie et design", ar: "التقنية والتصميم" },
  business: { en: "Business & management", fr: "Entreprise et management", ar: "الأعمال والإدارة" },
  built:    { en: "Architecture & construction", fr: "Architecture et construction", ar: "العمارة والبناء" },
  health:   { en: "Healthcare", fr: "Santé", ar: "الرعاية الصحية" },
};
const t = (k: string, l: Lang) => TX[k]?.[l] ?? TX[k]?.en ?? k;

// Counted phrases, with Arabic number agreement (1, 2, 3–10, 11+).
type Forms = { en: [string, string]; fr: [string, string]; ar: [string, string, string, string] };
const COUNT: Record<"portfolios" | "live" | "concept", Forms> = {
  portfolios: { en: ["portfolio", "portfolios"], fr: ["portfolio", "portfolios"], ar: ["موقع مهني واحد", "موقعان مهنيان", "مواقع مهنية", "موقعاً مهنياً"] },
  live:       { en: ["live website", "live websites"], fr: ["site en ligne", "sites en ligne"], ar: ["موقع مباشر واحد", "موقعان مباشران", "مواقع مباشرة", "موقعاً مباشراً"] },
  concept:    { en: ["concept design", "concept designs"], fr: ["concept", "concepts"], ar: ["تصميم مفاهيمي واحد", "تصميمان مفاهيميان", "تصاميم مفاهيمية", "تصميماً مفاهيمياً"] },
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

function themeVars(dark: boolean): React.CSSProperties {
  return (dark ? {
    "--background": "#0A0907", "--foreground": "#EDE8E0", "--card": "#14120F", "--muted": "#1C1915",
    "--muted-foreground": "#8A7E74", "--border": "rgba(255,255,255,0.09)", "--accent": "rgba(200,169,110,0.10)",
    "--primary": G, "--primary-foreground": INK, "--ring": G, "--chart-2": G,
  } : {
    "--background": "#F7F3EE", "--foreground": "#1A1410", "--card": "#FFFFFF", "--muted": "#EFE9E1",
    "--muted-foreground": "#8A7E74", "--border": "rgba(0,0,0,0.09)", "--accent": "rgba(200,169,110,0.14)",
    "--primary": G, "--primary-foreground": INK, "--ring": "#A88A4E", "--chart-2": G,
  }) as React.CSSProperties;
}

function KindBadge({ kind, lang, solid = false }: { kind: Portfolio["kind"]; lang: Lang; solid?: boolean }) {
  const live = kind === "live";
  const c = live ? LIVE : G;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 h-6 text-[9.5px] font-medium uppercase whitespace-nowrap"
      style={{ color: solid ? "#fff" : c, background: solid ? "rgba(10,9,7,0.78)" : "transparent", border: `1px solid ${solid ? "rgba(255,255,255,0.14)" : `${c}66`}`, letterSpacing: lang === "ar" ? "0.04em" : "0.16em", fontFamily: "sans-serif", backdropFilter: solid ? "blur(6px)" : undefined }}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: c, boxShadow: live ? `0 0 6px ${LIVE}` : undefined }} />
      {t(live ? "live" : "concept", lang)}
    </span>
  );
}

function DevicePreview({ site, lang, dark, onOpen }: { site: Portfolio; lang: Lang; dark: boolean; onOpen: () => void }) {
  const line = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const bar = dark ? "#1A1714" : "#FFFFFF";
  const sub = "#8A7E74";
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${t("open", lang)}: ${site.name}, ${site.role[lang]}`}
      className="group relative block w-full pb-[10%] text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-xl"
    >
      <span className="block overflow-hidden rounded-xl" style={{ border: `1px solid ${line}`, background: bar, boxShadow: "0 26px 50px -30px rgba(0,0,0,0.6)" }}>
        <span aria-hidden="true" className="flex items-center gap-1.5 px-3 h-7" style={{ borderBottom: `1px solid ${line}` }}>
          {["#E5534B", "#E3B341", "#57AB5A"].map(c => <span key={c} className="size-2 rounded-full" style={{ background: c, opacity: 0.8 }} />)}
          <span className="ms-2 min-w-0 truncate font-mono text-[10px]" style={{ color: sub }}>{displayUrl(site)}</span>
        </span>
        <span className="relative block aspect-[16/10] overflow-hidden" style={{ background: dark ? "#1C1915" : "#EFE9E1" }}>
          <img src={preview.desktop(site.slug)} alt="" width={960} height={600} decoding="async" draggable={false}
            className="absolute inset-0 size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.015] motion-reduce:transition-none" />
        </span>
      </span>
      <span aria-hidden="true" className="absolute bottom-0 right-[4%] w-[22%] rounded-[16px] p-[3px]" style={{ background: "#0B0A09", boxShadow: "0 24px 40px -16px rgba(0,0,0,0.75)" }}>
        <span className="relative block aspect-[360/779] overflow-hidden rounded-[13px]" style={{ background: "#1C1915" }}>
          <img src={preview.mobile(site.slug)} alt="" width={360} height={779} decoding="async" draggable={false} className="absolute inset-0 size-full object-cover object-top" />
        </span>
      </span>
      <span aria-hidden="true" className="absolute left-3 bottom-[14%] inline-flex items-center gap-1.5 rounded-full px-3 h-7 text-[10px] font-medium uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" style={{ background: G, color: INK, letterSpacing: "0.14em", fontFamily: "sans-serif" }}>
        <Maximize2 size={11} strokeWidth={2} /> {t("openShort", lang)}
      </span>
    </button>
  );
}

export default function PortfolioShowcase({ dark, lang }: { dark: boolean; lang: Lang }) {
  const isAr = lang === "ar";
  const [filter, setFilter] = React.useState<Filter>("all");
  const [mode, setMode] = React.useState<"wheel" | "grid">("wheel");
  const [active, setActive] = React.useState(0);
  const [viewing, setViewing] = React.useState(false);
  const opener = React.useRef<HTMLElement | null>(null);

  const hi = dark ? "#EDE8E0" : "#1A1410";
  const sub = dark ? "#7A6E66" : "#8A7E74";
  const bdr = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const card = dark ? "#12100D" : "#FFFFFF";

  const totals = React.useMemo(() => {
    const live = PORTFOLIOS.filter(p => p.kind === "live").length;
    const byCat = Object.fromEntries(CATEGORIES.map(c => [c, PORTFOLIOS.filter(p => p.category === c).length])) as Record<Category, number>;
    return { all: PORTFOLIOS.length, live, concept: PORTFOLIOS.length - live, byCat };
  }, []);

  const list = React.useMemo(
    () => PORTFOLIOS.filter(p => filter === "all" || (filter === "live" ? p.kind === "live" : p.category === filter)),
    [filter],
  );

  const items: FerrisWheelItem[] = React.useMemo(() => list.map(p => ({
    id: p.slug,
    src: preview.desktop(p.slug),
    thumb: preview.thumb(p.slug),
    alt: `${t("homeOf", lang)} ${p.name}`,
    title: p.name,
    discipline: p.role[lang],
    year: p.kind === "concept" ? `${t("idea", lang)}: ${p.idea[lang]}` : p.idea[lang],
    badge: <KindBadge kind={p.kind} lang={lang} />,
  })), [list, lang]);

  const chooseFilter = (f: Filter) => { setFilter(f); setActive(0); };
  const openViewer = (index: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setActive(index);
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

  const segBtn = "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[10px] font-medium uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]";

  return (
    <section id="websites" className="py-32 sm:py-40 px-5 sm:px-8" style={{ borderTop: `1px solid ${bdr}` }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 sm:mb-12 max-w-3xl" style={{ textAlign: isAr ? "right" : "left", marginInlineStart: isAr ? "auto" : undefined }} dir={isAr ? "rtl" : "ltr"}>
          <p className="text-[9px] font-medium uppercase mb-5" style={{ color: dark ? `${G}88` : G, fontFamily: "sans-serif", letterSpacing: isAr ? "0.08em" : "0.40em" }}>{t("eyebrow", lang)}</p>
          <h2 className="text-[34px] sm:text-[52px] font-normal tracking-tight leading-[1.08]" style={{ color: hi }}>
            {counted(totals.all, "portfolios", lang)}.<br />
            <em style={{ fontStyle: "italic", color: G }}>{t("h2b", lang)}</em>
          </h2>
          <p className="mt-6 max-w-2xl text-[14px] leading-[1.85]" style={{ color: sub, fontFamily: "sans-serif" }}>{t("body", lang)}</p>
          <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase" style={{ color: hi, fontFamily: "sans-serif", letterSpacing: isAr ? "0.02em" : "0.14em" }}>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: LIVE, boxShadow: `0 0 6px ${LIVE}` }} />{counted(totals.live, "live", lang)}</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: G }} />{counted(totals.concept, "concept", lang)}</span>
          </p>
        </div>

        <div className="mb-8 sm:mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" dir={isAr ? "rtl" : "ltr"}>
          <div role="group" aria-label={t("filterBy", lang)} className="-mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chips.map(c => {
              const on = filter === c.id;
              return (
                <button key={c.id} type="button" aria-pressed={on} onClick={() => chooseFilter(c.id)}
                  className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-full text-[12px] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                  style={{ fontFamily: "sans-serif", color: on ? INK : hi, background: on ? G : "transparent", border: `1px solid ${on ? G : (dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)")}` }}>
                  {c.id === "live" && <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: on ? INK : LIVE }} />}
                  {c.label}
                  <span className="font-mono text-[10px]" style={{ color: on ? INK : sub }}>{c.n}</span>
                </button>
              );
            })}
          </div>
          <div role="group" aria-label={t("viewAs", lang)} className="shrink-0 inline-flex self-start items-center gap-1 p-1 rounded-full" style={{ border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}` }}>
            {(["wheel", "grid"] as const).map(m => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={segBtn}
                style={{ fontFamily: "sans-serif", letterSpacing: isAr ? "0.02em" : "0.14em", background: mode === m ? (dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)") : "transparent", color: mode === m ? hi : sub }}>
                {m === "wheel" ? <CircleDot size={12} aria-hidden="true" /> : <LayoutGrid size={12} aria-hidden="true" />}
                {t(m, lang)}
              </button>
            ))}
          </div>
        </div>

        {mode === "wheel" ? (
          <div dir="ltr" style={themeVars(dark)}>
            <FerrisWheelGallery
              key={filter}
              items={items}
              active={active}
              onActiveChange={setActive}
              labels={{
                region: t("region", lang), onView: t("onView", lang), hub: t("hub", lang), item: "",
                browse: t("browse", lang), help: t("help", lang), previous: t("prev", lang), next: t("next", lang),
                unavailable: t("missing", lang),
                view: (title, n, total) => `${t("show", lang)} ${title}, ${n} ${t("of", lang)} ${total}`,
              }}
              renderPreview={(_, index) => <DevicePreview site={list[index]} lang={lang} dark={dark} onOpen={() => openViewer(index)} />}
              renderActions={(_, index) => (
                <button
                  type="button"
                  onClick={() => openViewer(index)}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-full whitespace-nowrap text-[10px] font-medium uppercase transition-opacity hover:opacity-85 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  style={{ background: G, color: INK, fontFamily: "sans-serif", letterSpacing: "0.16em" }}
                >
                  <Maximize2 size={11} strokeWidth={2} aria-hidden="true" />
                  <span className="sm:hidden">{t("openShort", lang)}</span>
                  <span className="hidden sm:inline">{t("open", lang)}</span>
                </button>
              )}
            />
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" dir={isAr ? "rtl" : "ltr"}>
            {list.map((p, i) => (
              <li key={p.slug}>
                <button type="button" onClick={() => openViewer(i)} aria-label={`${t("open", lang)}: ${p.name}, ${p.role[lang]}`}
                  className="group block w-full overflow-hidden rounded-2xl text-start outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#C8A96E] focus-visible:ring-offset-2 motion-reduce:transition-none"
                  style={{ background: card, border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                  <span className="relative block aspect-[16/10] overflow-hidden" style={{ background: dark ? "#1C1915" : "#EFE9E1" }}>
                    <img src={preview.desktop(p.slug)} alt="" loading="lazy" decoding="async" width={960} height={600}
                      className="absolute inset-0 size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none" />
                    <span className="absolute top-3 start-3"><KindBadge kind={p.kind} lang={lang} solid /></span>
                  </span>
                  <span className="flex items-start justify-between gap-3 px-4 py-4">
                    <span className="min-w-0">
                      <span className="block text-[17px] leading-tight" style={{ color: hi }}>{p.name}</span>
                      <span className="mt-1.5 block text-[12px] leading-snug" style={{ color: sub, fontFamily: "sans-serif" }}>{p.role[lang]}</span>
                    </span>
                    <span aria-hidden="true" className="shrink-0 font-mono text-[10px] pt-1" style={{ color: sub }}>{String(i + 1).padStart(2, "0")}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex flex-wrap items-start justify-between gap-4" style={{ borderTop: `1px solid ${bdr}`, paddingTop: "22px", direction: isAr ? "rtl" : "ltr" }}>
          <p className="max-w-3xl text-[11px] leading-[1.8]" style={{ color: sub, fontFamily: "sans-serif" }}>{t("note", lang)}</p>
          <p className="text-[11px]" style={{ color: sub, fontFamily: "sans-serif" }}>
            {t("want", lang)}{" "}
            <a href="#custom-builder" className="underline underline-offset-4 transition-opacity hover:opacity-70" style={{ color: dark ? `${G}CC` : G }}>{t("kit", lang)}</a>
          </p>
        </div>
      </div>

      {viewing && list[active] && (
        <SiteViewer list={list} index={active} dark={dark} lang={lang} onIndex={setActive} onClose={closeViewer} />
      )}
    </section>
  );
}

function SiteViewer({ list, index, dark, lang, onIndex, onClose }: {
  list: Portfolio[]; index: number; dark: boolean; lang: Lang; onIndex: (i: number) => void; onClose: () => void;
}) {
  const total = list.length;
  const site = list[index];
  const live = site.kind === "live";
  const [loaded, setLoaded] = React.useState(false);
  const [slow, setSlow] = React.useState(false);
  const [device, setDevice] = React.useState<Device>("desktop");
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const go = React.useCallback((step: number) => { setLoaded(false); setSlow(false); onIndex((index + step + total) % total); }, [index, onIndex, total]);

  const shell = dark ? "#0C0B09" : "#F8F4EF";
  const bar = dark ? "#14120F" : "#FFFFFF";
  const hi = dark ? "#EDE8E0" : "#1A1410";
  const sub = "#8A7E74";
  const line = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  React.useEffect(() => {
    closeRef.current?.focus();
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { root.style.overflow = before; window.removeEventListener("keydown", onKey); };
  }, [onClose, go]);

  // If a site has not loaded after 12 s, offer to open it directly.
  React.useEffect(() => {
    if (loaded) return;
    const timer = window.setTimeout(() => setSlow(true), 12000);
    return () => window.clearTimeout(timer);
  }, [loaded, site.slug]);

  const iconBtn = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-70 outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]";
  const frameWidth = device === "desktop" ? "100%" : device === "tablet" ? "834px" : "390px";
  const devices: { id: Device; icon: React.ReactNode }[] = [
    { id: "desktop", icon: <Monitor size={14} aria-hidden="true" /> },
    { id: "tablet", icon: <Tablet size={14} aria-hidden="true" /> },
    { id: "mobile", icon: <Smartphone size={14} aria-hidden="true" /> },
  ];

  return (
    <div className="fixed inset-0 z-[96] flex items-stretch justify-center sm:p-5" role="dialog" aria-modal="true" aria-label={`${site.name} · ${t(live ? "live" : "concept", lang)}`}>
      <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(5,4,3,0.88)", backdropFilter: "blur(14px)" }} />
      <div className="relative flex w-full max-w-[1440px] flex-col overflow-hidden sm:rounded-2xl" style={{ background: shell, border: `1px solid ${line}`, boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }}>
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 shrink-0" style={{ background: bar, borderBottom: `1px solid ${line}` }} dir="ltr">
          <div className="hidden sm:flex items-center gap-1.5 pe-1" aria-hidden="true">
            {["#E5534B", "#E3B341", "#57AB5A"].map(c => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.85 }} />)}
          </div>
          <div className="min-w-0 flex-1 flex items-center gap-2 rounded-full px-3 h-8" style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.035)", border: `1px solid ${line}` }}>
            <span className="truncate text-[11px]" style={{ color: sub, fontFamily: "ui-monospace, Menlo, monospace" }}>{displayUrl(site)}</span>
          </div>
          <span className="hidden md:inline-flex"><KindBadge kind={site.kind} lang={lang} /></span>
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
        <div className="flex items-center justify-between gap-3 px-4 py-2 shrink-0 md:hidden" style={{ background: bar, borderBottom: `1px solid ${line}`, direction: lang === "ar" ? "rtl" : "ltr" }}>
          <p className="truncate text-[12px]" style={{ color: hi, fontFamily: "sans-serif" }}><b style={{ fontWeight: 600 }}>{site.name}</b> <span style={{ color: sub }}>· {site.role[lang]}</span></p>
          <KindBadge kind={site.kind} lang={lang} />
        </div>
        <div className="relative flex-1 min-h-0 overflow-x-auto" style={{ background: device === "desktop" ? "#FFFFFF" : (dark ? "#0E0C0A" : "#E7E1D8") }}>
          {!loaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center" style={{ background: shell }}>
              {!slow ? (
                <>
                  <Loader2 size={20} className="animate-spin" color={G} />
                  <p className="text-[11px]" style={{ color: sub, fontFamily: "sans-serif" }}>{t("loading", lang)}</p>
                </>
              ) : (
                <>
                  <p className="text-[13px]" style={{ color: hi, fontFamily: "sans-serif" }}>{t("slow", lang)}</p>
                  <a href={site.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-[10px] font-medium uppercase" style={{ background: G, color: INK, letterSpacing: "0.16em", fontFamily: "sans-serif" }}><ExternalLink size={12} aria-hidden="true" />{t("newTab", lang)}</a>
                </>
              )}
            </div>
          )}
          <div className="mx-auto h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: frameWidth, maxWidth: "100%", boxShadow: device === "desktop" ? undefined : "0 0 0 1px rgba(0,0,0,0.12), 0 30px 60px -30px rgba(0,0,0,0.5)" }}>
            <iframe
              key={site.slug}
              src={site.url}
              title={`${site.name}, ${site.role.en} · ${t(live ? "live" : "concept", "en")}`}
              className="block h-full w-full border-0"
              onLoad={() => setLoaded(true)}
              sandbox={live ? "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads" : undefined}
              referrerPolicy={live ? "strict-origin-when-cross-origin" : undefined}
              style={{ opacity: loaded ? 1 : 0, transition: "opacity 300ms ease", background: "#fff" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
