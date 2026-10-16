"use client";

// "Personal brand websites" section: the Ferris wheel gallery of 20 sample
// portfolio websites, plus a full-screen viewer to scroll through each one.

import * as React from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Loader2, Maximize2, X } from "lucide-react";
import { FerrisWheelGallery, type FerrisWheelItem } from "@/components/ui/ferris-wheel-gallery";
import { SAMPLE_SITES, samplePage, sampleShot, sampleThumb, type Lang } from "@/lib/samples";

const G = "#C8A96E", INK = "#0A0907";

const TX: Record<string, Record<Lang, string>> = {
  eyebrow:  { en: "Personal brand websites", fr: "Sites de marque personnelle", ar: "مواقع العلامة الشخصية" },
  h2:       { en: "Twenty professionals.\nTwenty distinct identities.", fr: "Vingt professionnels.\nVingt identités uniques.", ar: "عشرون محترفاً.\nعشرون هوية فريدة." },
  body:     { en: "Each website is designed around one career, never a template. Turn the wheel to browse twenty sample designs, then open any of them to scroll through the full site.",
              fr: "Chaque site est conçu autour d'une carrière, jamais à partir d'un modèle. Faites tourner la roue pour parcourir vingt exemples, puis ouvrez-en un pour explorer le site complet.",
              ar: "كل موقع مصمَّم حول مسيرة مهنية واحدة، وليس قالباً جاهزاً. أدِر العجلة لتصفّح عشرين تصميماً نموذجياً، ثم افتح أيّاً منها لتتصفّح الموقع كاملاً." },
  note:     { en: "All profiles shown are fictional sample designs created by Zenith Dubai CV.",
              fr: "Tous les profils présentés sont des exemples fictifs créés par Zenith Dubai CV.",
              ar: "جميع الملفات المعروضة تصاميم نموذجية لشخصيات خيالية من إعداد زينيث دبي." },
  sample:   { en: "Sample design", fr: "Exemple de design", ar: "تصميم نموذجي" },
  open:     { en: "View full website", fr: "Voir le site complet", ar: "عرض الموقع كاملاً" },
  want:     { en: "Want a website like these?", fr: "Vous voulez un site comme ceux-ci ?", ar: "هل تريد موقعاً كهذه المواقع؟" },
  kit:      { en: "Portfolio / Personal Branding Kit", fr: "Kit portfolio / personal branding", ar: "مجموعة الملف والعلامة الشخصية" },
  newTab:   { en: "Open in a new tab", fr: "Ouvrir dans un nouvel onglet", ar: "فتح في علامة تبويب جديدة" },
  close:    { en: "Close", fr: "Fermer", ar: "إغلاق" },
  prev:     { en: "Previous website", fr: "Site précédent", ar: "الموقع السابق" },
  next:     { en: "Next website", fr: "Site suivant", ar: "الموقع التالي" },
  loading:  { en: "Loading website…", fr: "Chargement du site…", ar: "جارٍ تحميل الموقع…" },
  onView:   { en: "ON VIEW", fr: "À L'AFFICHE", ar: "المعروض" },
  hub:      { en: "SITES", fr: "SITES", ar: "موقع" },
  item:     { en: "SAMPLE", fr: "EXEMPLE", ar: "نموذج" },
  browse:   { en: "Browse the sample websites", fr: "Parcourir les exemples de sites", ar: "تصفّح المواقع النموذجية" },
  help:     { en: "Drag or swipe sideways  /  use ← →", fr: "Glissez latéralement  /  utilisez ← →", ar: "اسحب جانبياً  /  استخدم ← →" },
  region:   { en: "Sample portfolio websites", fr: "Exemples de sites portfolio", ar: "مواقع نموذجية للملفات المهنية" },
  missing:  { en: "Preview unavailable", fr: "Aperçu indisponible", ar: "المعاينة غير متاحة" },
  show:     { en: "Show", fr: "Afficher", ar: "عرض" },
  of:       { en: "of", fr: "sur", ar: "من" },
  homeOf:   { en: "Homepage of the sample website for", fr: "Page d'accueil du site exemple de", ar: "الصفحة الرئيسية للموقع النموذجي لـ" },
};
const t = (k: string, l: Lang) => TX[k]?.[l] ?? TX[k]?.en ?? k;

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

export default function PortfolioShowcase({ dark, lang }: { dark: boolean; lang: Lang }) {
  const isAr = lang === "ar";
  const [active, setActive] = React.useState(0);
  const [viewing, setViewing] = React.useState(false);
  const opener = React.useRef<HTMLElement | null>(null);

  const hi = dark ? "#EDE8E0" : "#1A1410";
  const sub = dark ? "#7A6E66" : "#8A7E74";
  const bdr = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const items: FerrisWheelItem[] = React.useMemo(() => SAMPLE_SITES.map(s => ({
    id: s.slug,
    src: sampleShot(s.slug),
    thumb: sampleThumb(s.slug),
    alt: `${t("homeOf", lang)} ${s.name}`,
    title: s.name,
    discipline: s.role[lang],
    year: t("sample", lang),
  })), [lang]);

  const openViewer = (index: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setActive(index);
    setViewing(true);
  };
  const closeViewer = React.useCallback(() => {
    setViewing(false);
    window.setTimeout(() => opener.current?.focus(), 0);
  }, []);

  return (
    <section id="websites" className="py-32 sm:py-40 px-5 sm:px-8" style={{ borderTop: `1px solid ${bdr}` }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 sm:mb-20 max-w-2xl" style={{ textAlign: isAr ? "right" : "left", marginInlineStart: isAr ? "auto" : undefined }}>
          <p className="text-[9px] font-medium uppercase mb-5" style={{ color: dark ? `${G}55` : G, fontFamily: "sans-serif", letterSpacing: isAr ? "0.08em" : "0.40em" }}>{t("eyebrow", lang)}</p>
          <h2 className="text-3xl sm:text-[42px] font-normal tracking-tight leading-[1.15]" style={{ color: hi }}>
            {t("h2", lang).split("\n").map((line, i) => (<React.Fragment key={i}>{i > 0 && <br />}{i === 1 ? <em style={{ fontStyle: "italic", color: G }}>{line}</em> : line}</React.Fragment>))}
          </h2>
          <p className="mt-5 text-[13px] leading-[1.9]" style={{ color: sub, fontFamily: "sans-serif" }}>{t("body", lang)}</p>
        </div>

        <div dir="ltr" style={themeVars(dark)}>
          <FerrisWheelGallery
            items={items}
            active={active}
            onActiveChange={setActive}
            labels={{
              region: t("region", lang), onView: t("onView", lang), hub: t("hub", lang), item: t("item", lang),
              browse: t("browse", lang), help: t("help", lang), previous: t("prev", lang), next: t("next", lang),
              unavailable: t("missing", lang),
              view: (title, n, total) => `${t("show", lang)} ${title}, ${n} ${t("of", lang)} ${total}`,
            }}
            renderActions={(_, index) => (
              <button
                type="button"
                onClick={() => openViewer(index)}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-[10px] font-medium uppercase transition-opacity hover:opacity-85 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={{ background: G, color: INK, fontFamily: "sans-serif", letterSpacing: "0.16em" }}
              >
                <Maximize2 size={11} strokeWidth={2} aria-hidden="true" />
                {t("open", lang)}
              </button>
            )}
          />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4" style={{ borderTop: `1px solid ${bdr}`, paddingTop: "22px", direction: isAr ? "rtl" : "ltr" }}>
          <p className="text-[11px]" style={{ color: sub, fontFamily: "sans-serif" }}>{t("note", lang)}</p>
          <p className="text-[11px]" style={{ color: sub, fontFamily: "sans-serif" }}>
            {t("want", lang)}{" "}
            <a href="#custom-builder" className="underline underline-offset-4 transition-opacity hover:opacity-70" style={{ color: dark ? `${G}CC` : G }}>{t("kit", lang)}</a>
          </p>
        </div>
      </div>

      {viewing && (
        <SiteViewer
          index={active}
          dark={dark}
          lang={lang}
          onIndex={setActive}
          onClose={closeViewer}
        />
      )}
    </section>
  );
}

function SiteViewer({ index, dark, lang, onIndex, onClose }: {
  index: number; dark: boolean; lang: Lang; onIndex: (i: number) => void; onClose: () => void;
}) {
  const total = SAMPLE_SITES.length;
  const site = SAMPLE_SITES[index];
  const [loaded, setLoaded] = React.useState(false);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const go = React.useCallback((step: number) => { setLoaded(false); onIndex((index + step + total) % total); }, [index, onIndex, total]);

  const shell = dark ? "#0C0B09" : "#F8F4EF";
  const bar = dark ? "#14120F" : "#FFFFFF";
  const hi = dark ? "#EDE8E0" : "#1A1410";
  const sub = dark ? "#8A7E74" : "#8A7E74";
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

  const iconBtn = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-70 outline-none focus-visible:ring-2";

  return (
    <div className="fixed inset-0 z-[96] flex items-stretch justify-center sm:p-5" role="dialog" aria-modal="true" aria-label={`${site.name} · ${t("sample", lang)}`}>
      <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(5,4,3,0.88)", backdropFilter: "blur(14px)" }} />
      <div className="relative flex w-full max-w-[1440px] flex-col overflow-hidden sm:rounded-2xl" style={{ background: shell, border: `1px solid ${line}`, boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }}>
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 shrink-0" style={{ background: bar, borderBottom: `1px solid ${line}` }} dir="ltr">
          <div className="hidden sm:flex items-center gap-1.5 pe-1" aria-hidden="true">
            {["#E5534B", "#E3B341", "#57AB5A"].map(c => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.85 }} />)}
          </div>
          <div className="min-w-0 flex-1 flex items-center gap-2 rounded-full px-3 h-8" style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.035)", border: `1px solid ${line}` }}>
            <span className="truncate text-[11px]" style={{ color: sub, fontFamily: "ui-monospace, Menlo, monospace" }}>zenithdubaicv.com/samples/{site.slug}</span>
          </div>
          <span className="hidden md:inline-flex items-center rounded-full px-2.5 h-6 text-[9px] font-medium uppercase" style={{ color: G, border: `1px solid ${G}45`, letterSpacing: "0.18em", fontFamily: "sans-serif" }}>{t("sample", lang)}</span>
          <button type="button" onClick={() => go(-1)} aria-label={t("prev", lang)} className={iconBtn} style={{ color: hi, border: `1px solid ${line}` }}><ArrowLeft size={14} /></button>
          <button type="button" onClick={() => go(1)} aria-label={t("next", lang)} className={iconBtn} style={{ color: INK, background: G }}><ArrowRight size={14} /></button>
          <a href={samplePage(site.slug)} target="_blank" rel="noopener" aria-label={t("newTab", lang)} title={t("newTab", lang)} className={`${iconBtn} hidden sm:flex`} style={{ color: hi, border: `1px solid ${line}` }}><ExternalLink size={13} /></a>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={t("close", lang)} className={iconBtn} style={{ color: hi, border: `1px solid ${line}` }}><X size={15} /></button>
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-2 shrink-0 sm:hidden" style={{ background: bar, borderBottom: `1px solid ${line}`, direction: lang === "ar" ? "rtl" : "ltr" }}>
          <p className="truncate text-[12px]" style={{ color: hi, fontFamily: "sans-serif" }}><b style={{ fontWeight: 600 }}>{site.name}</b> <span style={{ color: sub }}>· {site.role[lang]}</span></p>
          <span className="shrink-0 rounded-full px-2 h-5 inline-flex items-center text-[8px] font-medium uppercase" style={{ color: G, border: `1px solid ${G}45`, letterSpacing: "0.14em", fontFamily: "sans-serif" }}>{t("sample", lang)}</span>
        </div>
        <div className="relative flex-1 min-h-0" style={{ background: "#FFFFFF" }}>
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: shell }}>
              <Loader2 size={20} className="animate-spin" color={G} />
              <p className="text-[11px]" style={{ color: sub, fontFamily: "sans-serif" }}>{t("loading", lang)}</p>
            </div>
          )}
          <iframe
            key={site.slug}
            src={samplePage(site.slug)}
            title={`${site.name}, ${site.role.en} · ${t("sample", lang)}`}
            className="block h-full w-full border-0"
            onLoad={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0, transition: "opacity 300ms ease" }}
          />
        </div>
      </div>
    </div>
  );
}
