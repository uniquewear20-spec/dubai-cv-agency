"use client";
// components/site/CvShowcase.tsx — "CV designs": a curated set of fictional CV concepts.
// Large stage + design notes, a filmstrip, field filters and a full-page reader.
// Keyboard: arrow keys move through the filmstrip; Escape closes the reader.
// Touch: swipe the stage. Reduced motion: page changes without movement.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { CV_CONCEPTS, CV_FILTERS, FIELD_LABELS, type CvConcept, type CvField } from "@/lib/cv-concepts";
import { pick, type L10n, type Lang } from "@/lib/site";
import { A4_H, A4_W, CvPage, ScaledCv } from "./CvDocument";

type Filter = "all" | CvField | "languages";

const T: Record<string, L10n> = {
  h2: { en: "A CV designed around the role you want.", fr: "Un CV conçu pour le poste que vous visez.", ar: "سيرة ذاتية مصمّمة حول الوظيفة التي تريدها." },
  lede: {
    en: "Nine examples show how we shape structure, typography and wording for different fields and career stages. Your CV is written from your own experience, in the design that suits it.",
    fr: "Neuf exemples montrent comment nous adaptons la structure, la typographie et le ton à chaque secteur et à chaque étape de carrière. Votre CV est rédigé à partir de votre propre parcours, dans le design qui lui convient.",
    ar: "تسعة أمثلة توضّح كيف نصوغ البنية والخط والأسلوب لكل مجال ومرحلة مهنية. تُكتب سيرتك من خبرتك الفعلية، بالتصميم الذي يناسبها.",
  },
  fictional: {
    en: "Fictional examples: the people, employers and figures are invented.",
    fr: "Exemples fictifs : les personnes, employeurs et chiffres sont inventés.",
    ar: "أمثلة افتراضية: الأشخاص وجهات العمل والأرقام غير حقيقية.",
  },
  filterLabel: { en: "Filter by field", fr: "Filtrer par secteur", ar: "التصفية حسب المجال" },
  all: { en: "All", fr: "Tous", ar: "الكل" },
  languages: { en: "French and Arabic", fr: "Français et arabe", ar: "بالفرنسية والعربية" },
  approach: { en: "Design approach", fr: "Parti pris", ar: "فكرة التصميم" },
  bestFor: { en: "Best for", fr: "Idéal pour", ar: "الأنسب لـ" },
  online: { en: "Online applications", fr: "Candidatures en ligne", ar: "التقديم الإلكتروني" },
  read: { en: "Read the full page", fr: "Lire la page entière", ar: "اقرأ الصفحة كاملة" },
  packages: { en: "See the packages", fr: "Voir les formules", ar: "عرض الباقات" },
  prev: { en: "Previous design", fr: "Design précédent", ar: "التصميم السابق" },
  next: { en: "Next design", fr: "Design suivant", ar: "التصميم التالي" },
  of: { en: "of", fr: "sur", ar: "من" },
  close: { en: "Close", fr: "Fermer", ar: "إغلاق" },
  zoomIn: { en: "Actual size", fr: "Taille réelle", ar: "الحجم الفعلي" },
  zoomOut: { en: "Fit to screen", fr: "Ajuster à l'écran", ar: "ملاءمة الشاشة" },
  docLang: { en: "Document language", fr: "Langue du document", ar: "لغة المستند" },
  strip: { en: "All designs", fr: "Tous les designs", ar: "كل التصاميم" },
  open: { en: "Open", fr: "Ouvrir", ar: "فتح" },
};
const DOC_LANG: Record<Lang, L10n> = {
  en: { en: "English", fr: "anglais", ar: "الإنجليزية" },
  fr: { en: "French", fr: "français", ar: "الفرنسية" },
  ar: { en: "Arabic", fr: "arabe", ar: "العربية" },
};

const t = (k: string, l: Lang) => pick(T[k], l);

function filterLabel(f: Filter, l: Lang): string {
  if (f === "all") return t("all", l);
  if (f === "languages") return t("languages", l);
  return pick(FIELD_LABELS[f], l);
}

function matches(c: CvConcept, f: Filter): boolean {
  if (f === "all") return true;
  if (f === "languages") return c.docLang !== "en";
  return c.field === f;
}

export default function CvShowcase({ lang }: { lang: Lang }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const list = useMemo(() => CV_CONCEPTS.filter(c => matches(c, filter)), [filter]);
  const [activeId, setActiveId] = useState(CV_CONCEPTS[0].id);
  const [direction, setDirection] = useState(1);
  const [reader, setReader] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const isAr = lang === "ar";

  // Keep the selection inside the filtered list.
  const active = list.find(c => c.id === activeId) ?? list[0];
  const index = list.indexOf(active);

  const go = useCallback(
    (delta: number) => {
      if (list.length < 2) return;
      const next = list[(index + delta + list.length) % list.length];
      setDirection(delta);
      setActiveId(next.id);
    },
    [index, list],
  );

  const choose = (id: string) => {
    const i = list.findIndex(c => c.id === id);
    setDirection(i >= index ? 1 : -1);
    setActiveId(id);
  };

  // Bring the active thumbnail into view in the filmstrip (without moving the page).
  useEffect(() => {
    const strip = stripRef.current;
    const btn = strip?.querySelector<HTMLElement>(`[data-id="${active.id}"]`);
    if (!strip || !btn) return;
    const left = btn.offsetLeft - strip.clientWidth / 2 + btn.clientWidth / 2;
    strip.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [active.id, reduce]);

  const onStripKey = (e: React.KeyboardEvent) => {
    const fwd = isAr ? "ArrowLeft" : "ArrowRight";
    const back = isAr ? "ArrowRight" : "ArrowLeft";
    if (e.key !== fwd && e.key !== back) return;
    e.preventDefault();
    const delta = e.key === fwd ? 1 : -1;
    const next = list[(index + delta + list.length) % list.length];
    go(delta);
    requestAnimationFrame(() => stripRef.current?.querySelector<HTMLElement>(`[data-id="${next.id}"]`)?.focus());
  };

  const slide = reduce ? 0 : 36;
  const enterX = (isAr ? -1 : 1) * direction * slide;

  return (
    <section id="cv-designs" className="z-section" aria-labelledby="cvd-title">
      <style href="zenith-cv-showcase" precedence="medium">{CSS}</style>
      <div className="z-wrap z-wrap-wide">
        <div className="cvs-head">
          <div>
            <h2 id="cvd-title" className="z-h2">{t("h2", lang)}</h2>
            <p className="z-lede" style={{ marginTop: 18 }}>{t("lede", lang)}</p>
          </div>
          <p className="cvs-fictional z-small">{t("fictional", lang)}</p>
        </div>

        <div className="cvs-filters" role="group" aria-label={t("filterLabel", lang)}>
          {CV_FILTERS.map(f => (
            <button key={f} type="button" className="z-chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {filterLabel(f, lang)}
              <span className="cvs-count" aria-hidden="true">{CV_CONCEPTS.filter(c => matches(c, f)).length}</span>
            </button>
          ))}
        </div>

        <div className="cvs-main">
          {/* ── Stage ── */}
          <div className="cvs-stage-wrap">
            <div className="cvs-stage">
              <div className="cvs-sheet-shadow cvs-s1" aria-hidden="true" />
              <div className="cvs-sheet-shadow cvs-s2" aria-hidden="true" />
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={active.id}
                  className="cvs-doc"
                  initial={{ opacity: 0, x: enterX, rotate: reduce ? 0 : 0.6 * direction }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -enterX * 0.6, transition: { duration: 0.22 } }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  drag={reduce || list.length < 2 ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  dragSnapToOrigin
                  onDragStart={() => { dragged.current = true; }}
                  onDragEnd={(_, info) => {
                    const threshold = 60;
                    if (info.offset.x < -threshold) go(isAr ? -1 : 1);
                    else if (info.offset.x > threshold) go(isAr ? 1 : -1);
                    window.setTimeout(() => { dragged.current = false; }, 0);
                  }}
                  style={{ touchAction: "pan-y" }}
                >
                  <ScaledCv concept={active} decorative maxScale={0.95} />
                  <button
                    type="button"
                    className="cvs-open"
                    aria-label={`${t("read", lang)}: ${active.styleName}`}
                    onClick={() => { if (!dragged.current) setReader(true); }}
                  >
                    <span className="cvs-open-icon"><Maximize2 size={16} strokeWidth={1.75} aria-hidden="true" /></span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="cvs-nav">
              <button type="button" className="cvs-arrow" onClick={() => go(-1)} aria-label={t("prev", lang)} disabled={list.length < 2}>
                {isAr ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              <p className="z-small" aria-live="polite">
                <span className="z-sr">{active.styleName}, </span>
                {index + 1} {t("of", lang)} {list.length}
              </p>
              <button type="button" className="cvs-arrow" onClick={() => go(1)} aria-label={t("next", lang)} disabled={list.length < 2}>
                {isAr ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          </div>

          {/* ── Notes ── */}
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={active.id}
              className="cvs-notes"
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -6 }}
              transition={{ duration: 0.28 }}
            >
              <div className="cvs-tags">
                <span className="z-tag z-tag-gold">{pick(FIELD_LABELS[active.field], lang)}</span>
                <span className="z-tag">{pick(active.level, lang)}</span>
                {active.docLang !== "en" && <span className="z-tag">{t("docLang", lang)}: {pick(DOC_LANG[active.docLang], lang)}</span>}
              </div>
              <h3 className="cvs-style z-serif">{active.styleName}</h3>
              <dl className="cvs-dl">
                <div><dt>{t("approach", lang)}</dt><dd>{pick(active.approach, lang)}</dd></div>
                <div><dt>{t("bestFor", lang)}</dt><dd>{pick(active.positioning, lang)}</dd></div>
                <div><dt>{t("online", lang)}</dt><dd>{pick(active.ats, lang)}</dd></div>
              </dl>
              <div className="cvs-actions">
                <button type="button" className="z-btn z-btn-quiet" onClick={() => setReader(true)}>{t("read", lang)}</button>
                <a href="#packages" className="z-btn z-btn-primary">{t("packages", lang)}</a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Filmstrip ── */}
        <div className="cvs-strip" ref={stripRef} role="group" aria-label={t("strip", lang)} onKeyDown={onStripKey}>
          {list.map(c => {
            const on = c.id === active.id;
            return (
              <div key={c.id} className="cvs-thumb" data-on={on || undefined}>
                <div className="cvs-thumb-page"><ScaledCv concept={c} decorative /></div>
                <button
                  type="button"
                  data-id={c.id}
                  className="cvs-thumb-btn"
                  aria-pressed={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => choose(c.id)}
                >
                  <span className="cvs-thumb-name">{c.styleName}</span>
                  <span className="cvs-thumb-field">{pick(FIELD_LABELS[c.field], lang)}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {reader && <Reader concept={active} lang={lang} onClose={() => setReader(false)} onStep={go} canStep={list.length > 1} />}
    </section>
  );
}

// ── Full-page reader ─────────────────────────────────────────────────────────
function Reader({ concept, lang, onClose, onStep, canStep }: { concept: CvConcept; lang: Lang; onClose: () => void; onStep: (d: number) => void; canStep: boolean }) {
  const [actual, setActual] = useState(false);
  const [fit, setFit] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isAr = lang === "ar";

  const viewport = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const update = () => setFit(Math.min(1.15, (el.clientWidth - 32) / A4_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (canStep && (e.key === "ArrowRight" || e.key === "ArrowLeft") && !(e.target instanceof HTMLInputElement)) {
        const fwd = isAr ? "ArrowLeft" : "ArrowRight";
        onStep(e.key === fwd ? 1 : -1);
      }
      if (e.key === "Tab" && dialogRef.current) {
        const f = [...dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])")];
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [onClose, onStep, canStep, isAr]);

  const scale = actual ? 1 : fit;

  return (
    <div className="cvr" role="dialog" aria-modal="true" aria-labelledby="cvr-title" ref={dialogRef} dir={isAr ? "rtl" : "ltr"}>
      <div className="cvr-bar">
        <div className="cvr-title">
          <h3 id="cvr-title" className="z-serif">{concept.styleName}</h3>
          <span className="z-micro">{pick(FIELD_LABELS[concept.field], lang)} · {pick(concept.level, lang)}</span>
        </div>
        <div className="cvr-tools">
          {canStep && (
            <>
              <button type="button" className="cvs-arrow" onClick={() => onStep(-1)} aria-label={t("prev", lang)}>{isAr ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}</button>
              <button type="button" className="cvs-arrow" onClick={() => onStep(1)} aria-label={t("next", lang)}>{isAr ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}</button>
            </>
          )}
          <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => setActual(a => !a)} aria-pressed={actual}>
            {actual ? <ZoomOut size={16} /> : <ZoomIn size={16} />}{actual ? t("zoomOut", lang) : t("zoomIn", lang)}
          </button>
          <button type="button" className="cvs-arrow" onClick={onClose} aria-label={t("close", lang)} data-autofocus><X size={18} /></button>
        </div>
      </div>
      <div className="cvr-view" ref={viewport}>
        <div className="cvr-page" style={{ width: A4_W * scale, height: A4_H * scale }}>
          <div style={{ width: A4_W, height: A4_H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <CvPage concept={concept} id="cvr-doc" />
          </div>
        </div>
        <p className="z-micro cvr-note">{t("fictional", lang)}</p>
      </div>
    </div>
  );
}

const CSS = `
.cvs-head{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:32px;margin-bottom:36px}
.cvs-head .z-lede{max-width:58ch}
.cvs-fictional{max-width:280px;padding:12px 16px;border:1px dashed var(--z-rule-strong);border-radius:12px}
@media (max-width:900px){.cvs-head{grid-template-columns:1fr;gap:20px}.cvs-fictional{max-width:none}}
.cvs-filters{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 6px;margin:0 -2px 28px;scrollbar-width:none}
.cvs-filters::-webkit-scrollbar{display:none}
.cvs-count{font-size:12px;opacity:.6;font-variant-numeric:tabular-nums}
.cvs-main{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:clamp(28px,5vw,72px);align-items:start}
@media (max-width:1023px){.cvs-main{grid-template-columns:1fr}}
.cvs-stage-wrap{display:flex;flex-direction:column;align-items:center}
.cvs-stage{position:relative;width:min(100%,560px);padding:18px 0 10px}
.cvs-sheet-shadow{position:absolute;inset:18px 0 10px;border-radius:4px;background:var(--z-surface-2);border:1px solid var(--z-rule)}
.cvs-s1{transform:rotate(-1.6deg) translate(-8px,4px)}
.cvs-s2{transform:rotate(1.2deg) translate(9px,2px);opacity:.7}
.cvs-doc{position:relative;display:block;width:100%;border-radius:4px;box-shadow:var(--z-shadow);overflow:hidden;cursor:grab}
.cvs-doc:active{cursor:grabbing}
.cvs-open{position:absolute;inset:0;z-index:1;padding:0;border:0;border-radius:4px;background:transparent;cursor:zoom-in}
.cvs-open:focus-visible{outline:2px solid var(--z-focus);outline-offset:4px}
.cvs-open-icon{position:absolute;top:12px;inset-inline-end:12px;z-index:1;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:rgba(10,9,7,.8);color:#ede8e0;opacity:0;transition:opacity .2s}
.cvs-doc:hover .cvs-open-icon,.cvs-open:focus-visible .cvs-open-icon{opacity:1}
@media (hover:none){.cvs-open-icon{opacity:1}}
.cvs-nav{display:flex;align-items:center;gap:18px;margin-top:18px}
.cvs-nav p{min-width:72px;text-align:center;font-variant-numeric:tabular-nums}
.cvs-arrow{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;border:1px solid var(--z-rule-strong);background:transparent;color:var(--z-fg);cursor:pointer;transition:border-color .2s,color .2s}
.cvs-arrow:hover:not(:disabled){border-color:var(--z-gold);color:var(--z-gold-text)}
.cvs-arrow:disabled{opacity:.4;cursor:default}
.cvs-notes{padding-top:clamp(0px,2vw,24px)}
.cvs-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}
.cvs-style{font-size:clamp(34px,4vw,48px);line-height:1.05;letter-spacing:-.015em;font-weight:400;margin-bottom:22px}
.cvs-dl{display:grid;gap:18px;margin:0 0 30px}
.cvs-dl div{padding-top:16px;border-top:1px solid var(--z-rule)}
.cvs-dl dt{font-size:14px;font-weight:600;color:var(--z-gold-text);margin-bottom:6px}
.cvs-dl dd{margin:0;font-size:16px;line-height:1.65;color:var(--z-fg-2)}
.cvs-actions{display:flex;flex-wrap:wrap;gap:12px}
.cvs-strip{display:flex;gap:18px;overflow-x:auto;scroll-snap-type:x mandatory;padding:34px 4px 10px;margin-top:40px;border-top:1px solid var(--z-rule);scrollbar-width:thin}
.cvs-thumb{position:relative;flex:0 0 132px;scroll-snap-align:center;display:flex;flex-direction:column}
.cvs-thumb-page{display:block;border-radius:3px;overflow:hidden;box-shadow:0 0 0 1px var(--z-rule),0 12px 24px -16px rgba(0,0,0,.6);transition:box-shadow .2s,transform .25s;margin-bottom:10px}
.cvs-thumb:hover .cvs-thumb-page{transform:translateY(-3px)}
.cvs-thumb[data-on] .cvs-thumb-page{box-shadow:0 0 0 2px var(--z-gold),0 14px 28px -14px rgba(0,0,0,.7)}
.cvs-thumb-btn{display:flex;flex-direction:column;gap:2px;padding:0;border:0;background:transparent;color:var(--z-fg);cursor:pointer;text-align:start}
.cvs-thumb-btn::after{content:"";position:absolute;inset:0}
.cvs-thumb-name{font-size:14px;font-weight:600;line-height:1.35}
.cvs-thumb-field{font-size:13px;color:var(--z-fg-3);line-height:1.35}
@media (prefers-reduced-motion:reduce){.cvs-thumb:hover .cvs-thumb-page{transform:none}}
.cvr{position:fixed;inset:0;z-index:95;display:flex;flex-direction:column;background:rgba(8,7,5,.94);backdrop-filter:blur(8px);color:#ede8e0}
.cvr-bar{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:12px clamp(12px,3vw,28px);border-bottom:1px solid rgba(237,232,224,.12)}
.cvr-title{display:flex;align-items:baseline;gap:12px;min-width:0}
.cvr-title h3{font-size:22px;font-weight:500;white-space:nowrap}
.cvr-title .z-micro{color:#bdb0a3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cvr-tools{display:flex;align-items:center;gap:8px}
.cvr .cvs-arrow{color:#ede8e0;border-color:rgba(237,232,224,.24)}
.cvr .z-btn-quiet{color:#ede8e0;border-color:rgba(237,232,224,.24)}
.cvr-view{flex:1;overflow:auto;padding:24px 16px 40px;display:flex;flex-direction:column;align-items:center}
.cvr-page{flex:none;box-shadow:0 30px 80px -20px rgba(0,0,0,.8);border-radius:2px;overflow:hidden}
.cvr-note{margin-top:16px;color:#bdb0a3}
@media (max-width:640px){.cvr-title .z-micro{display:none}.cvr-tools .z-btn{padding:0 12px}}
`;
