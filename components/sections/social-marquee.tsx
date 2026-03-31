"use client";
import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";

// ── Tokens (mirrors page.tsx) ────────────────────────────────────────────────
const G = "#C8A96E", GL = "#E2C98E", INK = "#0A0907";

// ── Lang type ────────────────────────────────────────────────────────────────
type Lang = "en" | "ar" | "fr";

// ── Translations ─────────────────────────────────────────────────────────────
const TX: Record<string, Record<Lang, string>> = {
  // Section header
  eyebrow:     { en: "À la carte",                      ar: "خدمات مفردة",                        fr: "À la carte" },
  headlineA:   { en: "Create Your Custom",              ar: "صمِّم باقتك",                         fr: "Créez votre" },
  headlineB:   { en: "Career Package.",                 ar: "المهنية المخصصة.",                    fr: "Package Carrière." },
  subtext:     {
    en: "Select only what you need. Bundle discounts are applied automatically — the more you choose, the more you save.",
    ar: "اختر ما تحتاجه فقط. تُطبَّق خصومات الباقة تلقائياً — كلما اخترت أكثر، وفّرت أكثر.",
    fr: "Choisissez uniquement ce dont vous avez besoin. Les remises sont appliquées automatiquement — plus vous choisissez, plus vous économisez.",
  },

  // Presets
  quickBundles:      { en: "Quick bundles",              ar: "باقات سريعة",                        fr: "Offres rapides" },
  presetJobHunter:   { en: "Job Hunter",                 ar: "صيد الوظائف",                        fr: "Chasseur d'emploi" },
  presetJobTag:      { en: "Fast track to interviews",   ar: "مسار سريع للمقابلات",                fr: "Accès rapide aux entretiens" },
  presetIntl:        { en: "International",              ar: "دولي",                               fr: "International" },
  presetIntlTag:     { en: "Global market ready",        ar: "جاهز للسوق العالمي",                 fr: "Prêt pour le marché mondial" },
  presetUpgrade:     { en: "Career Upgrade",             ar: "ترقية مهنية",                        fr: "Évolution de carrière" },
  presetUpgradeTag:  { en: "Full positioning reset",     ar: "إعادة تموضع كاملة",                  fr: "Repositionnement complet" },

  // Category labels
  catDocument:      { en: "Documents",                  ar: "الوثائق",                            fr: "Documents" },
  catDigital:       { en: "Digital Presence",           ar: "الحضور الرقمي",                      fr: "Présence digitale" },
  catApplications:  { en: "Job Applications",           ar: "طلبات التوظيف",                      fr: "Candidatures" },
  catCoaching:      { en: "Coaching & Strategy",        ar: "التدريب والاستراتيجية",              fr: "Coaching & Stratégie" },

  // Service labels
  svcCvAts:         { en: "CV Writing (ATS Optimised)", ar: "كتابة السيرة الذاتية (محسَّنة للفرز)", fr: "Rédaction CV (optimisé ATS)" },
  svcCvDesign:      { en: "Executive CV Design",        ar: "تصميم السيرة الذاتية التنفيذية",     fr: "Design CV Exécutif" },
  svcCoverLetter:   { en: "Cover Letter",               ar: "خطاب التغطية",                       fr: "Lettre de motivation" },
  svcLinkedin:      { en: "LinkedIn Makeover",          ar: "تجديد ملف لينكدإن",                  fr: "Refonte LinkedIn" },
  svcApps5:         { en: "Job Applications (5)",       ar: "طلبات توظيف (5)",                    fr: "Candidatures (5)" },
  svcApps10:        { en: "Job Applications (10)",      ar: "طلبات توظيف (10)",                   fr: "Candidatures (10)" },
  svcApps30:        { en: "Job Applications (30)",      ar: "طلبات توظيف (30)",                   fr: "Candidatures (30)" },
  svcCoaching:      { en: "Interview Coaching (60 min)", ar: "تدريب المقابلات (60 دقيقة)",        fr: "Coaching entretien (60 min)" },
  svcStrategy:      { en: "Career Strategy Session",   ar: "جلسة استراتيجية مهنية",               fr: "Session stratégie carrière" },
  svcBranding:      { en: "Portfolio / Personal Branding Kit", ar: "حقيبة الملف الشخصي والعلامة", fr: "Portfolio / Kit Personal Branding" },

  // Service notes
  noteApps5:        { en: "Tailored per role",          ar: "مُخصَّص لكل دور",                    fr: "Personnalisé par poste" },
  noteApps10:       { en: "Most popular",               ar: "الأكثر طلباً",                       fr: "Le plus populaire" },
  noteApps30:       { en: "Full campaign",              ar: "حملة كاملة",                         fr: "Campagne complète" },

  // Summary panel
  yourSelection:    { en: "Your selection",             ar: "اختياراتك",                          fr: "Votre sélection" },
  noServices:       { en: "No services selected yet.",  ar: "لم تختر أي خدمة بعد.",               fr: "Aucun service sélectionné." },
  subtotalLabel:    { en: "Subtotal",                   ar: "المجموع الجزئي",                     fr: "Sous-total" },
  totalLabel:       { en: "Total",                      ar: "الإجمالي",                           fr: "Total" },
  youSave:          { en: "You save",                   ar: "توفيرك",                             fr: "Vous économisez" },
  discount10:       { en: "10% bundle discount applied", ar: "خصم باقة 10% مُطبَّق",              fr: "Remise pack 10% appliquée" },
  discount15:       { en: "15% bundle discount applied", ar: "خصم باقة 15% مُطبَّق",              fr: "Remise pack 15% appliquée" },
  discount20:       { en: "20% bundle discount applied", ar: "خصم باقة 20% مُطبَّق",              fr: "Remise pack 20% appliquée" },
  ctaReady:         { en: "Request This Package",       ar: "اطلب هذه الباقة",                    fr: "Demander ce package" },
  ctaEmpty:         { en: "Select services above",      ar: "اختر الخدمات أعلاه",                 fr: "Sélectionnez des services" },
  nudge:            { en: "Not sure what to choose?",   ar: "لست متأكداً من اختيارك؟",            fr: "Vous ne savez pas quoi choisir ?" },
  nudgeLink:        { en: "Most clients choose our Growth Package.", ar: "معظم العملاء يختارون باقة النمو.", fr: "La plupart choisissent notre offre Croissance." },

  // Discount scale
  bundleSavings:    { en: "Bundle savings",             ar: "وفورات الباقة",                      fr: "Économies pack" },
};
const tr = (k: string, l: Lang): string => TX[k]?.[l] ?? TX[k]?.en ?? k;

// ── Service definitions ──────────────────────────────────────────────────────
export interface Service {
  id: string;
  labelKey: string;
  price: number;
  category: "document" | "digital" | "coaching" | "applications";
  noteKey?: string;
}

const SERVICES: Service[] = [
  { id: "cv-ats",       labelKey: "svcCvAts",       price: 149, category: "document" },
  { id: "cv-design",    labelKey: "svcCvDesign",     price: 99,  category: "document" },
  { id: "cover-letter", labelKey: "svcCoverLetter",  price: 79,  category: "document" },
  { id: "linkedin",     labelKey: "svcLinkedin",     price: 149, category: "digital" },
  { id: "branding",     labelKey: "svcBranding",     price: 149, category: "digital" },
  { id: "apps-5",       labelKey: "svcApps5",        price: 79,  category: "applications", noteKey: "noteApps5" },
  { id: "apps-10",      labelKey: "svcApps10",       price: 119, category: "applications", noteKey: "noteApps10" },
  { id: "apps-30",      labelKey: "svcApps30",       price: 199, category: "applications", noteKey: "noteApps30" },
  { id: "coaching",     labelKey: "svcCoaching",     price: 199, category: "coaching" },
  { id: "strategy",     labelKey: "svcStrategy",     price: 149, category: "coaching" },
];

// ── Preset combos ────────────────────────────────────────────────────────────
interface Preset {
  labelKey: string;
  tagKey: string;
  ids: string[];
}

const PRESETS: Preset[] = [
  { labelKey: "presetJobHunter", tagKey: "presetJobTag",      ids: ["cv-ats", "cover-letter", "apps-10"] },
  { labelKey: "presetIntl",      tagKey: "presetIntlTag",     ids: ["cv-ats", "linkedin", "cv-design"] },
  { labelKey: "presetUpgrade",   tagKey: "presetUpgradeTag",  ids: ["cv-ats", "linkedin", "coaching"] },
];

// ── Discount logic ────────────────────────────────────────────────────────────
function getDiscount(count: number): number {
  if (count >= 4) return 0.20;
  if (count === 3) return 0.15;
  if (count === 2) return 0.10;
  return 0;
}

const CAT_KEY: Record<Service["category"], string> = {
  document:     "catDocument",
  digital:      "catDigital",
  applications: "catApplications",
  coaching:     "catCoaching",
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  dark: boolean;
  lang?: Lang;
  onEnquire?: (selected: string[], total: number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CustomPackageBuilder({ dark, lang = "en", onEnquire }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const isAr = lang === "ar";

  // Theme tokens
  const hi        = dark ? "#EDE8E0" : "#1A1410";
  const sub       = dark ? "#7A6E66" : "#8A7E74";
  const mid       = dark ? "#B8A89C" : "#6A5A50";
  const bdr       = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const card      = dark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.92)";
  const cardHover = dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,1)";

  // Computed totals
  const selectedServices = SERVICES.filter(s => selected.has(s.id));
  const subtotal  = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const discount  = getDiscount(selected.size);
  const savings   = Math.round(subtotal * discount);
  const total     = subtotal - savings;
  const hasSelection = selected.size > 0;

  const discountLabel =
    discount === 0.20 ? tr("discount20", lang) :
    discount === 0.15 ? tr("discount15", lang) :
    discount === 0.10 ? tr("discount10", lang) : null;

  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else { next.add(id); setJustAdded(id); setTimeout(() => setJustAdded(null), 600); }
      return next;
    });
    setActivePreset(null);
  }, []);

  const applyPreset = useCallback((preset: Preset) => {
    setSelected(new Set(preset.ids));
    setActivePreset(preset.labelKey);
  }, []);

  const scrollToGrowth = useCallback(() => {
    const el = document.getElementById("investment");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const categories = Array.from(
    new Set(SERVICES.map(s => s.category))
  ) as Service["category"][];

  // Arabic: flex-row-reverse for items so icon is on the correct side
  const rowDir = isAr ? "rtl" : "ltr";

  return (
    <section
      id="custom-builder"
      className="py-40 px-5 sm:px-8"
      style={{ borderTop: `1px solid ${bdr}` }}
    >
      <div className="mx-auto max-w-6xl">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-4% 0px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="text-[9px] font-medium tracking-[0.40em] uppercase mb-5"
            style={{
              color: dark ? `${G}55` : G,
              fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
              letterSpacing: isAr ? "0.06em" : undefined,
              textTransform: isAr ? "none" : "uppercase",
            }}
          >
            {tr("eyebrow", lang)}
          </p>
          <h2
            className="text-3xl sm:text-[42px] font-normal tracking-tight leading-[1.15] mb-5"
            style={{
              color: hi,
              fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : undefined,
            }}
          >
            {tr("headlineA", lang)}<br />
            <em style={{ fontStyle: isAr ? "normal" : "italic", color: G }}>
              {tr("headlineB", lang)}
            </em>
          </h2>
          <p
            className="text-sm leading-[2.0] max-w-lg"
            style={{
              color: dark ? "#6A5E56" : "#8A7A70",
              fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
              fontWeight: 300,
            }}
          >
            {tr("subtext", lang)}
          </p>
        </motion.div>

        {/* ── Preset Combos ──────────────────────────────────────────── */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-4% 0px" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <p
            className="text-[9px] font-medium tracking-[0.28em] uppercase mb-4"
            style={{
              color: sub,
              fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
              letterSpacing: isAr ? "0.06em" : undefined,
              textTransform: isAr ? "none" : "uppercase",
            }}
          >
            {tr("quickBundles", lang)}
          </p>
          <div className="flex flex-wrap gap-3">
            {PRESETS.map((preset, i) => {
              const isActive = activePreset === preset.labelKey;
              const presetTotal = SERVICES
                .filter(s => preset.ids.includes(s.id))
                .reduce((a, s) => a + s.price, 0);
              const presetDiscount = getDiscount(preset.ids.length);
              const presetFinal = Math.round(presetTotal * (1 - presetDiscount));

              return (
                <motion.button
                  key={preset.labelKey}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  dir={rowDir}
                  initial={{ opacity: 0, x: isAr ? 12 : -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-center gap-3 px-5 py-3 rounded-xl text-left transition-all duration-300"
                  style={{
                    background: isActive
                      ? (dark ? `${G}12` : `${G}10`)
                      : (dark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.85)"),
                    border: `1px solid ${isActive ? `${G}40` : bdr}`,
                    boxShadow: isActive ? `0 0 0 1px ${G}20, 0 4px 20px ${G}10` : "none",
                  }}
                >
                  <div
                    className="h-5 w-5 rounded-full shrink-0 flex items-center justify-center transition-all"
                    style={{
                      background: isActive ? G : `${G}14`,
                      border: `1px solid ${isActive ? G : `${G}25`}`,
                    }}
                  >
                    <Check size={9} strokeWidth={2.5} color={isActive ? INK : `${G}60`} />
                  </div>
                  <div>
                    <p
                      className="text-[11px] font-semibold"
                      style={{
                        color: isActive ? (dark ? GL : G) : hi,
                        fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                      }}
                    >
                      {tr(preset.labelKey, lang)}
                    </p>
                    <p
                      className="text-[9px]"
                      style={{
                        color: sub,
                        fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                      }}
                    >
                      {tr(preset.tagKey, lang)} · {presetFinal} AED
                    </p>
                  </div>
                  <ArrowRight
                    size={10}
                    strokeWidth={1.5}
                    style={{
                      color: `${G}50`,
                      marginLeft: isAr ? undefined : "auto",
                      marginRight: isAr ? "auto" : undefined,
                      transform: isAr ? "scaleX(-1)" : undefined,
                    }}
                  />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Service Grid + Summary ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* Service categories */}
          <div className="flex flex-col gap-10">
            {categories.map((cat, ci) => {
              const catServices = SERVICES.filter(s => s.category === cat);
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-4% 0px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.06 * ci }}
                >
                  <p
                    className="text-[9px] font-medium tracking-[0.30em] uppercase mb-4"
                    style={{
                      color: dark ? `${G}40` : `${G}70`,
                      fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                      letterSpacing: isAr ? "0.04em" : undefined,
                      textTransform: isAr ? "none" : "uppercase",
                    }}
                  >
                    {tr(CAT_KEY[cat], lang)}
                  </p>
                  <div className="flex flex-col gap-2">
                    {catServices.map((svc) => {
                      const isSelected = selected.has(svc.id);
                      const isNew = justAdded === svc.id;

                      return (
                        <motion.button
                          key={svc.id}
                          type="button"
                          dir={rowDir}
                          onClick={() => toggle(svc.id)}
                          layout
                          animate={isNew ? { scale: [1, 1.015, 1] } : {}}
                          transition={{ duration: 0.3 }}
                          className="group w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-300"
                          style={{
                            background: isSelected
                              ? (dark ? `${G}08` : `${G}07`)
                              : card,
                            border: `1px solid ${isSelected ? `${G}35` : bdr}`,
                            boxShadow: isSelected
                              ? `0 0 0 1px ${G}15, 0 2px 16px ${G}08`
                              : "none",
                          }}
                          onMouseEnter={e => {
                            if (!isSelected)
                              (e.currentTarget as HTMLButtonElement).style.background = cardHover;
                          }}
                          onMouseLeave={e => {
                            if (!isSelected)
                              (e.currentTarget as HTMLButtonElement).style.background = card;
                          }}
                        >
                          {/* Checkbox */}
                          <div
                            className="shrink-0 h-5 w-5 rounded flex items-center justify-center transition-all duration-300"
                            style={{
                              background: isSelected ? G : "transparent",
                              border: `1px solid ${isSelected ? G : dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                            }}
                          >
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                >
                                  <Check size={10} strokeWidth={2.5} color={INK} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Label */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[13px] font-medium leading-tight"
                              style={{
                                color: isSelected ? (dark ? GL : G) : hi,
                                fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                                transition: "color 0.25s ease",
                              }}
                            >
                              {tr(svc.labelKey, lang)}
                            </p>
                            {svc.noteKey && (
                              <p
                                className="text-[10px] mt-0.5"
                                style={{
                                  color: sub,
                                  fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                                }}
                              >
                                {tr(svc.noteKey, lang)}
                              </p>
                            )}
                          </div>

                          {/* Price — always LTR for numerals */}
                          <div className="shrink-0 text-right" dir="ltr">
                            <p
                              className="text-[13px] font-semibold"
                              style={{
                                color: isSelected ? G : mid,
                                fontFamily: "sans-serif",
                                transition: "color 0.25s ease",
                              }}
                            >
                              {svc.price}{" "}
                              <span className="text-[9px] font-normal">AED</span>
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Sticky Summary ─────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              className="rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{
                background: dark ? "rgba(200,169,110,0.04)" : "rgba(200,169,110,0.06)",
                border: `1px solid ${G}25`,
              }}
            >
              {/* Gold top line */}
              <div
                className="h-px w-full"
                style={{ background: `linear-gradient(90deg,transparent,${G}55,transparent)` }}
              />

              <div className="p-7" dir={rowDir}>
                <p
                  className="text-[9px] font-medium tracking-[0.35em] uppercase mb-6"
                  style={{
                    color: dark ? `${G}55` : G,
                    fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                    letterSpacing: isAr ? "0.05em" : undefined,
                    textTransform: isAr ? "none" : "uppercase",
                  }}
                >
                  {tr("yourSelection", lang)}
                </p>

                {/* Selected list */}
                <div className="min-h-[80px] mb-6">
                  <AnimatePresence mode="popLayout">
                    {selectedServices.length === 0 ? (
                      <motion.p
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[11px] leading-relaxed"
                        style={{
                          color: dark ? "rgba(200,169,110,0.20)" : "rgba(200,169,110,0.45)",
                          fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                          fontStyle: isAr ? "normal" : "italic",
                        }}
                      >
                        {tr("noServices", lang)}
                      </motion.p>
                    ) : (
                      selectedServices.map(svc => (
                        <motion.div
                          key={svc.id}
                          layout
                          initial={{ opacity: 0, x: isAr ? 10 : -10, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: "auto" }}
                          exit={{ opacity: 0, x: isAr ? -10 : 10, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center justify-between py-2"
                          style={{ borderBottom: `1px solid ${G}12` }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="shrink-0 h-1 w-1 rounded-full"
                              style={{ background: G, opacity: 0.6 }}
                            />
                            <p
                              className="text-[11px] truncate"
                              style={{
                                color: dark ? "#C0B0A0" : "#5A4E44",
                                fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                              }}
                            >
                              {tr(svc.labelKey, lang)}
                            </p>
                          </div>
                          {/* Price always LTR */}
                          <p
                            className="shrink-0 text-[11px] ml-3"
                            dir="ltr"
                            style={{ color: mid, fontFamily: "sans-serif" }}
                          >
                            {svc.price}
                          </p>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="h-px mb-5" style={{ background: `${G}18` }} />

                {/* Pricing rows */}
                <div className="flex flex-col gap-2 mb-6">
                  {discount > 0 && (
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <p
                        className="text-[10px]"
                        style={{
                          color: sub,
                          fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                        }}
                      >
                        {tr("subtotalLabel", lang)}
                      </p>
                      <p
                        className="text-[11px] line-through opacity-40"
                        dir="ltr"
                        style={{ color: hi, fontFamily: "sans-serif" }}
                      >
                        {subtotal} AED
                      </p>
                    </motion.div>
                  )}

                  {discount > 0 && (
                    <motion.div
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{ background: `${G}10`, border: `1px solid ${G}20` }}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={9} color={G} strokeWidth={1.5} />
                        <p
                          className="text-[10px] font-medium"
                          style={{
                            color: G,
                            fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                          }}
                        >
                          {discountLabel}
                        </p>
                      </div>
                      <p
                        className="text-[11px] font-semibold"
                        dir="ltr"
                        style={{ color: G, fontFamily: "sans-serif" }}
                      >
                        −{savings} AED
                      </p>
                    </motion.div>
                  )}

                  <div className="flex items-end justify-between mt-1">
                    <p
                      className="text-[10px] font-medium tracking-[0.20em] uppercase"
                      style={{
                        color: sub,
                        fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                        letterSpacing: isAr ? "0.04em" : undefined,
                        textTransform: isAr ? "none" : "uppercase",
                      }}
                    >
                      {tr("totalLabel", lang)}
                    </p>
                    <div className="text-right" dir="ltr">
                      <motion.p
                        key={total}
                        initial={{ opacity: 0.5, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-3xl font-normal leading-none"
                        style={{
                          color: hasSelection
                            ? (dark ? GL : G)
                            : (dark ? "rgba(200,169,110,0.18)" : "rgba(200,169,110,0.35)"),
                          fontFamily: "'Georgia',serif",
                        }}
                      >
                        {hasSelection ? total : "—"}
                      </motion.p>
                      {hasSelection && (
                        <p className="text-[9px] mt-0.5" style={{ color: sub, fontFamily: "sans-serif" }}>
                          AED
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Savings badge */}
                  <AnimatePresence>
                    {savings > 0 && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] font-medium text-center mt-1 py-1 rounded-full"
                        style={{
                          background: `${G}0C`,
                          color: dark ? `${G}80` : G,
                          fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                          border: `1px solid ${G}18`,
                        }}
                      >
                        {tr("youSave", lang)} {savings} AED
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  disabled={!hasSelection}
                  onClick={() => onEnquire?.(Array.from(selected), total)}
                  className="w-full flex items-center justify-between px-5 rounded-full text-[10px] font-medium tracking-[0.18em] uppercase transition-all duration-300"
                  style={{
                    background: hasSelection ? G : `${G}20`,
                    color: hasSelection ? INK : `${G}40`,
                    height: "48px",
                    fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                    letterSpacing: isAr ? "0.04em" : undefined,
                    textTransform: isAr ? "none" : "uppercase",
                    boxShadow: hasSelection ? `0 5px 24px ${G}28` : "none",
                    cursor: hasSelection ? "pointer" : "not-allowed",
                  }}
                >
                  <span>{hasSelection ? tr("ctaReady", lang) : tr("ctaEmpty", lang)}</span>
                  <ArrowRight
                    size={11}
                    strokeWidth={hasSelection ? 2 : 1.5}
                    style={{ transform: isAr ? "scaleX(-1)" : undefined }}
                  />
                </button>

                {/* Upsell nudge */}
                <div className="mt-5 pt-5" style={{ borderTop: `1px solid ${G}12` }}>
                  <p
                    className="text-[10px] leading-relaxed text-center"
                    style={{
                      color: dark ? "rgba(200,169,110,0.28)" : "rgba(200,169,110,0.55)",
                      fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                    }}
                  >
                    {tr("nudge", lang)}{" "}
                    <button
                      type="button"
                      onClick={scrollToGrowth}
                      className="underline underline-offset-2 transition-opacity hover:opacity-70"
                      style={{
                        color: dark ? `${G}55` : G,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        padding: 0,
                      }}
                    >
                      {tr("nudgeLink", lang)}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Discount scale indicator */}
            <motion.div
              className="mt-4 p-4 rounded-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{ background: card, border: `1px solid ${bdr}` }}
            >
              <p
                className="text-[8px] font-medium tracking-[0.28em] uppercase mb-3"
                style={{
                  color: sub,
                  fontFamily: isAr ? "'Noto Naskh Arabic','Tahoma',sans-serif" : "sans-serif",
                  letterSpacing: isAr ? "0.04em" : undefined,
                  textTransform: isAr ? "none" : "uppercase",
                }}
              >
                {tr("bundleSavings", lang)}
              </p>
              <div className="flex items-center gap-1" dir="ltr">
                {[
                  { n: 1, label: "1", discount: "—" },
                  { n: 2, label: "2", discount: "10%" },
                  { n: 3, label: "3", discount: "15%" },
                  { n: 4, label: "4+", discount: "20%" },
                ].map(tier => {
                  const active =
                    tier.n === 4 ? selected.size >= 4 : selected.size === tier.n;
                  return (
                    <div
                      key={tier.n}
                      className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-300"
                      style={{
                        background: active
                          ? (dark ? `${G}12` : `${G}10`)
                          : "transparent",
                        border: `1px solid ${active ? `${G}30` : "transparent"}`,
                      }}
                    >
                      <p
                        className="text-[9px] font-semibold"
                        style={{ color: active ? G : sub, fontFamily: "sans-serif" }}
                      >
                        {tier.label}
                      </p>
                      <p
                        className="text-[8px]"
                        style={{
                          color: active
                            ? G
                            : dark
                              ? "rgba(200,169,110,0.20)"
                              : "rgba(200,169,110,0.35)",
                          fontFamily: "sans-serif",
                        }}
                      >
                        {tier.discount}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}