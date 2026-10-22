// lib/packages.ts — the four packages shown on the site (client-safe).
//
// Prices come from lib/checkout/catalog.ts (TIERS), which is also what the PayPal checkout
// route charges. Package keys keep the original tier ids (foundation, growth, executive, apex)
// so existing orders, order references and the confirmation page keep working.
//
// Gumroad: `gumroadUrl` is the product's page on zenithdubaicv.gumroad.com (published and checked
// on 22 Oct 2026, same US$ price as PayPal). Gumroad sells as merchant of record and takes cards,
// PayPal, and Apple Pay or Google Pay on devices and browsers that support them. A null URL hides
// the Gumroad button and every Apple Pay / Google Pay mention for that package.
// `gumroadProductId` is the id Gumroad shows in the product's license key block; the agent uses
// it to check license keys (packages 3 and 4 only).

import { TIERS, type TierKey } from "@/lib/checkout/catalog";
import type { L10n } from "@/lib/site";

/** "pro": Pro access to the Zenith AI job agent (sending for you, and AI drafting when it is switched on). */
export type AiAccess = "none" | "pro";

export interface PackageDef {
  key: TierKey;
  name: L10n;
  /** One sentence: what this package is for. */
  line: L10n;
  /** 3–5 benefits shown on the card. */
  highlights: L10n[];
  /** Everything else that is included, shown on request. */
  alsoIncluded: L10n[];
  /** The Global Horizon ebook (packages 2–4 only). */
  ebook: boolean;
  ai: AiAccess;
  recommended?: boolean;
  /** Gumroad checkout for card, Apple Pay and Google Pay. Null until the product exists. */
  gumroadUrl: string | null;
  /** Gumroad product id, used to check license keys for agent access. Null until the product exists. */
  gumroadProductId: string | null;
}

const FIRST_DRAFT: L10n = {
  en: "First draft within 48 hours of receiving your complete brief",
  fr: "Premier jet sous 48 heures après réception de votre brief complet",
  ar: "المسودة الأولى خلال 48 ساعة من استلام معلوماتك كاملة",
};
const REVISIONS: L10n = {
  en: "Unlimited revisions for 30 days after delivery",
  fr: "Révisions illimitées pendant 30 jours après la livraison",
  ar: "تعديلات غير محدودة لمدة 30 يوماً بعد التسليم",
};
const DESIGN_CHOICE: L10n = {
  en: "Your choice of design from the Zenith CV collection",
  fr: "Le design de votre choix dans la collection de CV Zenith",
  ar: "تصميم تختاره من مجموعة سير Zenith الذاتية",
};
const COVER_LETTER: L10n = { en: "Tailored cover letter", fr: "Lettre de motivation personnalisée", ar: "خطاب تغطية مخصّص" };
const PHOTO: L10n = {
  en: "LinkedIn profile photo enhancement",
  fr: "Amélioration de votre photo de profil LinkedIn",
  ar: "تحسين صورة ملفك الشخصي على لينكدإن",
};
const DUAL_FORMAT: L10n = {
  en: "Two CV formats: ATS-friendly and executive design",
  fr: "Deux formats de CV : compatible ATS et design exécutif",
  ar: "نسختان من السيرة الذاتية: متوافقة مع أنظمة الفرز الآلي وبتصميم تنفيذي",
};

export const PACKAGES: PackageDef[] = [
  {
    key: "foundation",
    name: { en: "CV Essentials", fr: "CV Essentiel", ar: "أساسيات السيرة الذاتية" },
    line: {
      en: "A professionally written CV, aimed at the role you want next.",
      fr: "Un CV rédigé par un professionnel, orienté vers le poste que vous visez.",
      ar: "سيرة ذاتية مكتوبة باحتراف وموجّهة إلى الوظيفة التي تستهدفها.",
    },
    highlights: [
      {
        en: "Your CV rewritten for your target role, ATS-friendly or in an executive design",
        fr: "Votre CV réécrit pour le poste visé, compatible ATS ou en design exécutif",
        ar: "إعادة كتابة سيرتك الذاتية للوظيفة المستهدفة، متوافقة مع الفرز الآلي أو بتصميم تنفيذي",
      },
      COVER_LETTER,
      {
        en: "5 targeted job applications submitted for you",
        fr: "5 candidatures ciblées envoyées pour vous",
        ar: "تقديم 5 طلبات توظيف مستهدفة نيابةً عنك",
      },
      PHOTO,
    ],
    alsoIncluded: [DESIGN_CHOICE, FIRST_DRAFT, REVISIONS],
    ebook: false,
    ai: "none",
    gumroadUrl: "https://zenithdubaicv.gumroad.com/l/cv-essentials",
    gumroadProductId: null,
  },
  {
    key: "growth",
    name: { en: "Career Advantage", fr: "Avantage Carrière", ar: "الميزة المهنية" },
    line: {
      en: "Your CV and LinkedIn profile, aligned for competitive markets.",
      fr: "Votre CV et votre profil LinkedIn, alignés pour les marchés compétitifs.",
      ar: "سيرتك الذاتية وملفك على لينكدإن، متناسقان للأسواق التنافسية.",
    },
    highlights: [
      DUAL_FORMAT,
      {
        en: "Full LinkedIn profile optimisation: content and keywords",
        fr: "Optimisation complète du profil LinkedIn : contenu et mots-clés",
        ar: "تحسين كامل لملف لينكدإن: المحتوى والكلمات المفتاحية",
      },
      {
        en: "10 targeted job applications submitted for you",
        fr: "10 candidatures ciblées envoyées pour vous",
        ar: "تقديم 10 طلبات توظيف مستهدفة نيابةً عنك",
      },
      COVER_LETTER,
    ],
    alsoIncluded: [
      PHOTO,
      {
        en: "International career strategy guide",
        fr: "Guide de stratégie de carrière internationale",
        ar: "دليل استراتيجية المسار المهني الدولي",
      },
      DESIGN_CHOICE,
      FIRST_DRAFT,
      REVISIONS,
    ],
    ebook: true,
    ai: "none",
    recommended: true,
    gumroadUrl: "https://zenithdubaicv.gumroad.com/l/career-advantage",
    gumroadProductId: null,
  },
  {
    key: "executive",
    name: { en: "Career Automation", fr: "Carrière Automatisée", ar: "أتمتة المسار المهني" },
    line: {
      en: "Your complete career kit, plus a 30-application campaign we run for you.",
      fr: "Votre kit carrière complet, avec une campagne de 30 candidatures que nous menons pour vous.",
      ar: "مجموعتك المهنية الكاملة، مع حملة من 30 طلب توظيف نديرها نيابةً عنك.",
    },
    highlights: [
      {
        en: "30 targeted job applications submitted for you",
        fr: "30 candidatures ciblées envoyées pour vous",
        ar: "تقديم 30 طلب توظيف مستهدفاً نيابةً عنك",
      },
      {
        en: "CV in two formats, plus language versions (EN, FR, DE, AR, ES)",
        fr: "CV en deux formats, plus des versions linguistiques (EN, FR, DE, AR, ES)",
        ar: "سيرة ذاتية بنسختين، ونسخ بلغات أخرى (EN، FR، DE، AR، ES)",
      },
      {
        en: "Full LinkedIn transformation and personal branding",
        fr: "Transformation LinkedIn complète et personal branding",
        ar: "تحويل كامل لملف لينكدإن وبناء علامتك الشخصية",
      },
      {
        en: "60-minute one-to-one interview coaching session",
        fr: "Séance individuelle de coaching entretien de 60 minutes",
        ar: "جلسة تدريب فردية على المقابلات مدتها 60 دقيقة",
      },
    ],
    alsoIncluded: [
      COVER_LETTER,
      PHOTO,
      { en: "International mobility guide", fr: "Guide de mobilité internationale", ar: "دليل التنقل الدولي" },
      {
        en: "Executive portfolio and elevator pitch",
        fr: "Portfolio exécutif et pitch de présentation",
        ar: "ملف تنفيذي وعرض تعريفي موجز",
      },
      DESIGN_CHOICE,
      FIRST_DRAFT,
      REVISIONS,
    ],
    ebook: true,
    ai: "pro",
    gumroadUrl: "https://zenithdubaicv.gumroad.com/l/career-automation",
    gumroadProductId: "fXzEa7lD_kUyi8-7elslzw==",
  },
  {
    key: "apex",
    name: { en: "Executive Career Suite", fr: "Suite Carrière Exécutive", ar: "الباقة التنفيذية المتكاملة" },
    line: {
      en: "Everything in Career Automation, with a dedicated consultant through your search.",
      fr: "Tout Carrière Automatisée, avec un consultant dédié pendant votre recherche.",
      ar: "كل ما في أتمتة المسار المهني، مع مستشار مخصّص طوال فترة بحثك.",
    },
    highlights: [
      { en: "Everything in Career Automation", fr: "Tout le contenu de Carrière Automatisée", ar: "كل ما في باقة أتمتة المسار المهني" },
      {
        en: "Unlimited targeted job applications submitted for you",
        fr: "Candidatures ciblées illimitées envoyées pour vous",
        ar: "طلبات توظيف مستهدفة غير محدودة نقدّمها نيابةً عنك",
      },
      {
        en: "Personal career-narrative strategy session",
        fr: "Séance de stratégie sur votre récit de carrière",
        ar: "جلسة استراتيجية لصياغة سردك المهني",
      },
      {
        en: "30 days of priority access to your dedicated consultant",
        fr: "30 jours d'accès prioritaire à votre consultant dédié",
        ar: "30 يوماً من الوصول ذي الأولوية إلى مستشارك المخصّص",
      },
    ],
    alsoIncluded: [
      { en: "Interview tips guide (PDF)", fr: "Guide de conseils pour l'entretien (PDF)", ar: "دليل نصائح المقابلات (PDF)" },
      FIRST_DRAFT,
      REVISIONS,
    ],
    ebook: true,
    ai: "pro",
    gumroadUrl: "https://zenithdubaicv.gumroad.com/l/executive-career-suite",
    gumroadProductId: "POC2Tb9C8IkI7KYA3Jdc-g==",
  },
];

export const packagePrice = (key: TierKey): number => TIERS[key].price;
export const packageByKey = (key: TierKey): PackageDef => PACKAGES.find(p => p.key === key)!;
