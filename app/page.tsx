// app/page.tsx — Zenith Dubai CV · Reimagined
"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  Sun, Moon, Mail, X, Send, Loader2, CheckCircle, AlertCircle,
  Upload, FileText, ImageIcon, Trash2, CreditCard, ArrowRight,
  Globe, LayoutGrid, ArrowUpRight,
} from "lucide-react";
import SocialMarquee from "@/components/sections/social-marquee";
import CustomPackageBuilder from "@/components/sections/CustomPackageBuilder";
// ── Tokens ──────────────────────────────────────────────────────────────────
const G = "#C8A96E", GL = "#E2C98E", INK = "#0A0907", ASH = "#F7F3EE";
const WA = "971502879462", EM = "info@zenithdubaicv.com";

// ── Social platforms (mirrors social-marquee.tsx — kept here to avoid import issues) ──
const SOCIALS = [
  { id: "linkedin",  name: "LinkedIn",     handle: "@zenithdubaicv",   href: "https://www.linkedin.com/company/zenith-dubai-uae",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { id: "instagram", name: "Instagram",    handle: "@zenith.dubai.cv", href: "https://www.instagram.com/zenithdubaicv?igsh=ZG84NWttZjA3dTkx&utm_source=qr",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
  { id: "facebook",  name: "Facebook",     handle: "Zenith Dubai CV",  href: "https://www.facebook.com/profile.php?id=61576464566311",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { id: "x",         name: "X (Twitter)",  handle: "@zenithdubaicv",   href: "https://x.com/ZenithDubai_CV",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { id: "tiktok",    name: "TikTok",       handle: "@zenithdubaicv",   href: "https://tiktok.com/@zenithdubai?_r=1&_t=ZS-94z6PW9xSm9",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.27 8.27 0 0 0 4.83 1.56V6.79a4.85 4.85 0 0 1-1.07-.1z"/></svg> },
  { id: "youtube",   name: "YouTube",      handle: "@ZenithDUBAI",     href: "https://www.youtube.com/@ZenithDUBAI",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
];

const SUBS_EN = ["General Enquiry", "Foundation", "Growth", "Executive"];
const SUBS_AR = ["استفسار عام", "الأساسية", "النمو", "التنفيذية"];
const SUBS_FR = ["Demande générale", "Fondation", "Croissance", "Exécutif"];
const PAGE_SIZE = 9;

// ── Language ─────────────────────────────────────────────────────────────────
type Lang = "en" | "ar" | "fr";
const LANGS: { code: Lang; label: string; dir: "ltr" | "rtl"; font: string }[] = [
  { code: "en", label: "EN", dir: "ltr", font: "'Georgia','Times New Roman',serif" },
  { code: "ar", label: "ع", dir: "rtl", font: "'Noto Naskh Arabic','Tahoma',sans-serif" },
  { code: "fr", label: "FR", dir: "ltr", font: "'Georgia','Times New Roman',serif" },
];

// ── Translations ─────────────────────────────────────────────────────────────
const TX: Record<string, Record<Lang, string>> = {
  // Nav
  navServices:  { en: "Disciplines",  ar: "تخصصاتنا",   fr: "Disciplines" },
  navTemplates: { en: "Portfolio",    ar: "المحفظة",    fr: "Portfolio" },
  navMethod:    { en: "Process",      ar: "المنهجية",   fr: "Processus" },
  navPricing:   { en: "Investment",   ar: "الاستثمار",  fr: "Investissement" },
  navClients:   { en: "Outcomes",     ar: "النتائج",    fr: "Résultats" },
  enquire:      { en: "Apply",        ar: "تقدّم",       fr: "Postuler" },

  // Hero
  h1a: { en: "We Don't Write CVs.", ar: "لا نكتب سيرًا ذاتية.", fr: "Nous n'écrivons pas de CVs." },
  h1b: { en: "We Engineer Careers.", ar: "نبني مسارات مهنية.", fr: "Nous architecturons des carrières." },
  heroSub: {
    en: "Precision career positioning for professionals who intend to lead — across the Gulf, Europe, and beyond.",
    ar: "تموضع مهني دقيق للمحترفين الذين يعزمون على القيادة — في الخليج وأوروبا وما وراءهما.",
    fr: "Positionnement de carrière de précision pour les professionnels qui aspirent à diriger.",
  },
  ctaPrimary:   { en: "Request Private Review", ar: "طلب مراجعة خاصة", fr: "Demander une revue privée" },
  ctaSecondary: { en: "View Outcomes",          ar: "عرض النتائج",      fr: "Voir les résultats" },
  scarcity:     { en: "Limited intake · Application-based", ar: "قبول محدود · بناءً على الطلب", fr: "Admission limitée · Sur candidature" },

  // Metrics
  mAts:     { en: "ATS Pass Rate",       ar: "معدل اجتياز الفرز", fr: "Taux ATS" },
  mDraft:   { en: "Delivery",            ar: "التسليم",            fr: "Livraison" },
  mClients: { en: "Careers Positioned",  ar: "مسار موضَّع",        fr: "Carrières positionnées" },
  mMarkets: { en: "Markets",             ar: "سوق",                fr: "Marchés" },

  // Disciplines
  svcEyebrow: { en: "Three Disciplines", ar: "ثلاثة تخصصات", fr: "Trois disciplines" },
  svcH2: {
    en: "Precision instruments\nfor the ambitious.",
    ar: "أدوات دقيقة\nللمحترفين الطموحين.",
    fr: "Des instruments de précision\npour les ambitieux.",
  },
  s1t:   { en: "Executive CV Architecture",          ar: "هندسة السيرة الذاتية التنفيذية",   fr: "Architecture CV Exécutif" },
  s1b:   { en: "Reverse-engineered from the ATS logic of top-tier employers across the GCC, Europe, and North America. Your document clears every automated gate before a human ever sees it.", ar: "مُعادة الهندسة من منطق الفرز الآلي لكبار أصحاب العمل في الخليج وأوروبا وأمريكا الشمالية.", fr: "Rétro-conçue depuis la logique ATS des employeurs de premier plan au CCG, en Europe et en Amérique du Nord." },
  s1tag: { en: "Foundation of every engagement",     ar: "أساس كل تعاقد",                     fr: "Base de chaque mission" },
  s2t:   { en: "LinkedIn Authority Positioning",     ar: "تموضع السلطة على لينكدإن",          fr: "Positionnement d'autorité LinkedIn" },
  s2b:   { en: "Your profile rebuilt with keyword density, authority signals, and a search-optimised narrative that places you in front of the right decision-makers — before they know they're looking.", ar: "ملفك يُعاد بناؤه بكثافة الكلمات المفتاحية وإشارات المصداقية والسرد المُحسَّن للبحث.", fr: "Votre profil reconstruit avec densité de mots-clés, signaux d'autorité et narrative optimisée." },
  s2tag: { en: "Growth & Executive engagements",     ar: "باقتا النمو والتنفيذية",             fr: "Offres Croissance et Exécutif" },
  s3t:   { en: "Career Identity Transformation",     ar: "تحويل الهوية المهنية",               fr: "Transformation d'identité de carrière" },
  s3b:   { en: "A complete strategic repositioning — how you're perceived, articulated, and remembered. Built for professionals targeting markets where reputation precedes every application.", ar: "إعادة تموضع استراتيجية كاملة — كيف تُرى وتُعبَّر عنك وتُتذكر.", fr: "Un repositionnement stratégique complet — comment vous êtes perçu, articulé et mémorisé." },
  s3tag: { en: "Executive engagement only",          ar: "الباقة التنفيذية فقط",               fr: "Mission Exécutif uniquement" },

  // Portfolio
  tplEyebrow: { en: "Document Portfolio",       ar: "محفظة الوثائق",    fr: "Portfolio documentaire" },
  tplH2:      { en: "Engineered to perform.",   ar: "مُصمَّمة للأداء.", fr: "Conçus pour performer." },
  tplDesc: {
    en: "Every engagement unlocks our vault of 3,000+ precision-engineered documents across two collections: ATS-Optimised and Premium Design.",
    ar: "كل تعاقد يفتح مخزوننا من أكثر من 3,000 وثيقة مُهندَسة بدقة عبر مجموعتين: مُحسَّنة للفرز وتصميم متميز.",
    fr: "Chaque engagement débloque notre vault de 3 000+ documents en deux collections : ATS-Optimisé et Design Premium.",
  },
  tplBadge:   { en: "Market-specific designs",  ar: "تصاميم مخصصة",     fr: "Designs par marché" },
  tplGet:     { en: "Enquire",                  ar: "استفسر",            fr: "Demander" },
  tplMore:    { en: "Continue",                 ar: "المزيد",            fr: "Continuer" },
  tplDone:    { en: "Full library available on request",  ar: "المكتبة الكاملة متاحة عند الطلب", fr: "Bibliothèque complète sur demande" },
  tplAts:     { en: "ATS",                      ar: "ATS",               fr: "ATS" },
  tplDesign:  { en: "Design",                   ar: "تصميم",             fr: "Design" },
  tplPreview: { en: "Preview",                  ar: "معاينة",            fr: "Aperçu" },
  tplEnquire: { en: "Enquire about this document", ar: "استفسر عن هذه الوثيقة", fr: "Demander ce document" },
  tplClose:   { en: "Close",                    ar: "إغلاق",             fr: "Fermer" },

  // Exclusivity
  exclEyebrow: { en: "Selective intake",          ar: "قبول انتقائي",          fr: "Admission sélective" },
  exclH2a:     { en: "We work with those",        ar: "نعمل مع أولئك",         fr: "Nous travaillons avec ceux" },
  exclH2b:     { en: "who intend to win.",        ar: "الذين يعزمون على الفوز.", fr: "qui ont l'intention de gagner." },
  exclBody:    { en: "Zenith is not a platform. It is a practice. We accept a limited number of engagements each month — chosen for ambition, not convenience.", ar: "Zenith ليست منصة. إنها ممارسة. نقبل عدداً محدوداً من التعاقدات كل شهر — مختارة بناءً على الطموح.", fr: "Zenith n'est pas une plateforme. C'est une pratique. Nous acceptons un nombre limité de missions chaque mois." },
  exclPt1:     { en: "Application-based intake",        ar: "قبول قائم على الطلب",       fr: "Admission sur candidature" },
  exclPt2:     { en: "Limited monthly engagements",     ar: "تعاقدات شهرية محدودة",      fr: "Engagements mensuels limités" },
  exclPt3:     { en: "Senior-level professionals only", ar: "للمحترفين رفيعي المستوى",   fr: "Professionnels senior uniquement" },

  // Process
  procEyebrow: { en: "Four movements", ar: "أربع حركات", fr: "Quatre mouvements" },
  procH2:      { en: "Rigorous. Delivered in 48 hours.", ar: "صارم. يُسلَّم في 48 ساعة.", fr: "Rigoureux. Livré en 48 heures." },
  p1t: { en: "Select",   ar: "الاختيار", fr: "Choisir" },
  p1b: { en: "Choose your engagement tier and complete a secure payment in minutes.", ar: "اختر مستوى تعاقدك وأتمّ الدفع الآمن في دقائق.", fr: "Choisissez votre niveau d'engagement et effectuez un paiement sécurisé." },
  p2t: { en: "Brief",    ar: "الإحاطة",  fr: "Briefing" },
  p2b: { en: "Share your trajectory — where you are, where you intend to go, and what stands between.", ar: "شارك مسارك — أين أنت، وأين تعتزم الذهاب، وما يقف بينهما.", fr: "Partagez votre trajectoire — où vous êtes, où vous voulez aller." },
  p3t: { en: "Engineer", ar: "التصميم", fr: "Conception" },
  p3b: { en: "Your dedicated specialist architects every element within 48 hours. No templates. No shortcuts.", ar: "يُصمِّم متخصصك المخصص كل عنصر خلال 48 ساعة. لا قوالب جاهزة.", fr: "Votre spécialiste dédié conçoit chaque élément en 48 heures. Aucun modèle." },
  p4t: { en: "Refine",   ar: "التحسين", fr: "Affiner" },
  p4b: { en: "Unlimited revisions until every word, format, and strategic nuance is precise.", ar: "مراجعات غير محدودة حتى تكون كل كلمة وتنسيق ونبرة دقيقة.", fr: "Révisions illimitées jusqu'à ce que chaque mot et nuance soit précis." },

  // ── PRICING ────────────────────────────────────────────────────────────────
  prcEyebrow: { en: "Investment tiers",   ar: "مستويات الاستثمار", fr: "Niveaux d'investissement" },
  prcH2:      { en: "Three tiers.\nOne standard.", ar: "ثلاثة مستويات.\nمعيار واحد.", fr: "Trois niveaux.\nUne seule exigence." },
  prcNote:    { en: "All prices in UAE Dirhams. Processed via Stripe.", ar: "جميع الأسعار بالدرهم الإماراتي. عبر Stripe.", fr: "Tous les prix en dirhams émiratis. Via Stripe." },
  prcBegin:   { en: "Begin",   ar: "ابدأ", fr: "Commencer" },

  // Foundation tier
  pF:    { en: "Foundation",    ar: "الأساسية",        fr: "Fondation" },
  pFsub: { en: "Precise. Optimized. Built for Results.", ar: "دقيق. محسَّن. مبني للنتائج.", fr: "Précis. Optimisé. Conçu pour les résultats." },
  pFi1:  { en: "ATS-optimized or Executive-grade CV with refined design",          ar: "سيرة ذاتية محسَّنة للفرز الآلي أو تنفيذية بتصميم متقن",       fr: "CV optimisé ATS ou Executive avec design soigné" },
  pFi2:  { en: "Professionally crafted resume tailored to industry/goals",         ar: "سيرة ذاتية محترفة مصمَّمة لصناعتك وأهدافك",                   fr: "CV professionnel adapté à votre secteur et objectifs" },
  pFi3:  { en: "Access to our high-performance resume builder",                    ar: "وصول إلى منشئ السيرة الذاتية عالي الأداء",                     fr: "Accès à notre générateur de CV haute performance" },
  pFi4:  { en: "Strategic submission to 5 relevant job opportunities",             ar: "تقديم استراتيجي لـ 5 فرص عمل ذات صلة",                        fr: "Soumission stratégique à 5 opportunités d'emploi ciblées" },
  pFi5:  { en: "Tailored cover letter aligned with target positions",              ar: "خطاب تغطية مُخصَّص يتوافق مع الوظائف المستهدفة",              fr: "Lettre de motivation personnalisée selon vos cibles" },
  pFi6:  { en: "LinkedIn profile photo enhancement",                               ar: "تحسين صورة الملف الشخصي على لينكدإن",                          fr: "Amélioration de la photo de profil LinkedIn" },
  pFi7:  { en: "Full access to our 3,000+ premium document library",              ar: "وصول كامل إلى مكتبة الوثائق المتميزة +3,000",                 fr: "Accès complet à notre bibliothèque 3 000+ documents premium" },

  // Growth tier
  pG:      { en: "Growth",    ar: "النمو",    fr: "Croissance" },
  pGsub:   { en: "Expand Your Reach. Elevate Your Positioning. Compete Globally.", ar: "وسِّع نطاقك. ارفع مستوى تموضعك. تنافس عالمياً.", fr: "Élargissez votre portée. Élevez votre positionnement. Compétez mondialement." },
  pGBadge: { en: "Most Popular", ar: "الأكثر طلباً", fr: "Le plus populaire" },
  pGi1:  { en: "Dual-format strategy: ATS-optimized and Executive-grade CVs",     ar: "استراتيجية ثنائية الشكل: سيرة محسَّنة للفرز وأخرى تنفيذية",   fr: "Stratégie double format : CV ATS-optimisé et Executive" },
  pGi2:  { en: "High-impact resume designed for competitive markets",             ar: "سيرة ذاتية عالية التأثير لأسواق تنافسية",                       fr: "CV à fort impact conçu pour les marchés compétitifs" },
  pGi3:  { en: "Access to our advanced resume builder platform",                  ar: "وصول إلى منصة منشئ السيرة الذاتية المتقدمة",                   fr: "Accès à notre plateforme avancée de création de CV" },
  pGi4:  { en: "Strategic applications to 10 targeted job opportunities",         ar: "طلبات استراتيجية لـ 10 فرص عمل مستهدفة",                      fr: "Candidatures stratégiques à 10 opportunités ciblées" },
  pGi5:  { en: "Tailored cover letter customized to your role",                   ar: "خطاب تغطية مُخصَّص لدورك المهني",                              fr: "Lettre de motivation sur mesure pour votre rôle" },
  pGi6:  { en: "LinkedIn profile photo enhancement",                              ar: "تحسين صورة الملف الشخصي على لينكدإن",                          fr: "Amélioration de la photo de profil LinkedIn" },
  pGi7:  { en: "Complete LinkedIn profile & keyword optimization",                ar: "تحسين كامل لملف لينكدإن والكلمات المفتاحية",                   fr: "Optimisation complète du profil LinkedIn & mots-clés" },
  pGi8:  { en: "International career strategy guide",                             ar: "دليل استراتيجية المسار المهني الدولي",                          fr: "Guide de stratégie de carrière internationale" },
  pGi9:  { en: "Multi-language CV versions: EN, FR, DE, AR, ES",                 ar: "نسخ متعددة اللغات: EN, FR, DE, AR, ES",                        fr: "Versions multilingues : EN, FR, DE, AR, ES" },
  pGi10: { en: "Full access to our 3,000+ premium document library",             ar: "وصول كامل إلى مكتبة الوثائق المتميزة +3,000",                 fr: "Accès complet à notre bibliothèque 3 000+ documents premium" },

  // Executive tier
  pE:    { en: "Executive",   ar: "التنفيذية",  fr: "Exécutif" },
  pEsub: { en: "Elite Positioning. Strategic Advantage. Total Career Upgrade.", ar: "تموضع نخبوي. ميزة استراتيجية. ترقية مهنية كاملة.", fr: "Positionnement élite. Avantage stratégique. Mise à niveau totale." },
  pEi1:  { en: "ATS & Executive CVs crafted for senior leadership",               ar: "سيرة ذاتية للفرز الآلي وأخرى تنفيذية للقيادة العليا",          fr: "CVs ATS & Executive conçus pour la direction senior" },
  pEi2:  { en: "Executive-standard resume for leadership roles",                  ar: "سيرة ذاتية بمعايير تنفيذية لأدوار القيادة",                    fr: "CV standard exécutif pour les rôles de direction" },
  pEi3:  { en: "Access to our advanced resume development system",                ar: "وصول إلى نظام تطوير السيرة الذاتية المتقدم",                   fr: "Accès à notre système avancé de développement de CV" },
  pEi4:  { en: "Strategic submission to 30 high-potential job opportunities",     ar: "تقديم استراتيجي لـ 30 فرصة عمل عالية الإمكانات",             fr: "Soumission stratégique à 30 opportunités à fort potentiel" },
  pEi5:  { en: "High-conversion, tailored cover letter",                          ar: "خطاب تغطية مُخصَّص عالي التحويل",                              fr: "Lettre de motivation sur mesure à haute conversion" },
  pEi6:  { en: "LinkedIn profile photo enhancement",                              ar: "تحسين صورة الملف الشخصي على لينكدإن",                          fr: "Amélioration de la photo de profil LinkedIn" },
  pEi7:  { en: "Full LinkedIn transformation & personal branding",                ar: "تحويل كامل للينكدإن والعلامة الشخصية",                         fr: "Transformation LinkedIn complète & personal branding" },
  pEi8:  { en: "International mobility & career strategy guide",                  ar: "دليل التنقل الدولي واستراتيجية المسار المهني",                  fr: "Guide de mobilité internationale & stratégie de carrière" },
  pEi9:  { en: "Multi-language CV versions: EN, FR, DE, AR, ES",                 ar: "نسخ متعددة اللغات: EN, FR, DE, AR, ES",                        fr: "Versions multilingues : EN, FR, DE, AR, ES" },
  pEi10: { en: "Executive portfolio & compelling elevator pitch",                 ar: "ملف تنفيذي وعرض موجز مقنع",                                    fr: "Portfolio exécutif & elevator pitch convaincant" },
  pEi11: { en: "60-minute 1-on-1 interview coaching session",                     ar: "60 دقيقة تدريب مقابلات فردي",                                  fr: "60 min de coaching entretien individuel" },
  pEi12: { en: "Personalized career narrative strategy session",                  ar: "جلسة استراتيجية السرد المهني الشخصي",                          fr: "Session de stratégie narrative personnelle" },
  pEi13: { en: "30-day priority access to your dedicated consultant",             ar: "30 يوماً وصول أولوية لمستشارك المخصص",                        fr: "30 jours d'accès prioritaire à votre consultant dédié" },
  pEi14: { en: "Full access to our 3,000+ premium document library",             ar: "وصول كامل إلى مكتبة الوثائق المتميزة +3,000",                 fr: "Accès complet à notre bibliothèque 3 000+ documents premium" },

  // Testimonials
  tmEyebrow: { en: "Verified outcomes",    ar: "نتائج موثّقة",         fr: "Résultats vérifiés" },
  tmH2a:     { en: "Measured results,",   ar: "نتائج قابلة للقياس،", fr: "Résultats mesurables," },
  tmH2b:     { en: "not testimonials.",   ar: "لا مجرد شهادات.",      fr: "pas des témoignages." },
  tmStars:   { en: "5.0 · 7,000+ engagements", ar: "5.0 · +7,000 تعاقد", fr: "5.0 · 7 000+ missions" },

  // CTA
  ctaH2a:      { en: "Your next role",             ar: "منصبك القادم",   fr: "Votre prochain poste" },
  ctaH2b:      { en: "starts here.",               ar: "يبدأ هنا.",       fr: "commence ici." },
  ctaBody:     { en: "7,000+ professionals. 40+ nationalities. Six continents. One decision.", ar: "أكثر من 7,000 محترف. 40+ جنسية. ستة قارات. قرار واحد.", fr: "7 000+ professionnels. 40+ nationalités. Six continents. Une décision." },
  ctaFinalBtn: { en: "Begin Your Positioning", ar: "ابدأ تموضعك",    fr: "Commencer votre positionnement" },
  startWA:     { en: "WhatsApp",                ar: "واتساب",           fr: "WhatsApp" },

  // Forms
  sendEnq:     { en: "Submit", ar: "إرسال", fr: "Envoyer" },
  tagline:     { en: "Based in Dubai · Careers Placed Globally", ar: "مقره دبي · مسارات مهنية عالمياً", fr: "Basé à Dubaï · Carrières placées mondialement" },
  footerWA:    { en: "WhatsApp", ar: "واتساب", fr: "WhatsApp" },
  frmEmail:    { en: "Email address",        ar: "البريد الإلكتروني",       fr: "Adresse e-mail" },
  frmSubject:  { en: "Subject",              ar: "الموضوع",                 fr: "Sujet" },
  frmMessage:  { en: "Message",              ar: "رسالتك",                  fr: "Message" },
  frmAttach:   { en: "Attachments",          ar: "المرفقات",                fr: "Pièces jointes" },
  frmOptional: { en: "— optional",           ar: "— اختياري",               fr: "— facultatif" },
  frmPhoto:    { en: "Profile photo",        ar: "صورة الملف الشخصي",       fr: "Photo de profil" },
  frmPhotoH:   { en: "JPG · PNG · WEBP · 5 MB max", ar: "JPG · PNG · WEBP · 5 ميغابايت", fr: "JPG · PNG · WEBP · 5 Mo max" },
  frmCv:       { en: "Current CV",           ar: "السيرة الذاتية الحالية",  fr: "CV actuel" },
  frmCvH:      { en: "PDF · DOC · DOCX · 5 MB max", ar: "PDF · DOC · DOCX · 5 ميغابايت", fr: "PDF · DOC · DOCX · 5 Mo max" },
  frmDrop:     { en: "Click or drop file",   ar: "انقر أو اسحب الملف",      fr: "Cliquer ou déposer" },
  frmSending:  { en: "Sending…",             ar: "جارٍ الإرسال…",           fr: "Envoi…" },
  frmRetry:    { en: "Retry",                ar: "إعادة المحاولة",           fr: "Réessayer" },
  frmReceived: { en: "Received.",            ar: "تم الاستلام.",             fr: "Reçu." },
  frmReply:    { en: "We will respond to",   ar: "سنرد على",                 fr: "Nous répondrons à" },
  frmHours:    { en: "within 24 hours.",     ar: "خلال 24 ساعة.",            fr: "dans les 24 heures." },
  frmClose:    { en: "Close",                ar: "إغلاق",                   fr: "Fermer" },
  frmErrNet:   { en: "Network error — contact us via WhatsApp.", ar: "خطأ في الشبكة — تواصل عبر واتساب.", fr: "Erreur réseau — contactez-nous via WhatsApp." },
  frmErrGen:   { en: "Something went wrong. Please try again.", ar: "حدث خطأ. يرجى المحاولة مجدداً.", fr: "Une erreur s'est produite. Veuillez réessayer." },
};
const tr = (k: string, l: Lang): string => TX[k]?.[l] ?? TX[k]?.en ?? k;

// ── Types ─────────────────────────────────────────────────────────────────────
type Fm = { email: string; subject: string; message: string; photo: File | null; cv: File | null };
type St = "idle" | "sending" | "success" | "error";

const ATS_IDS = new Set([1, 5, 9, 21]);
const TEMPLATES = [
  { id: 1,  name: "The DIFC Leadership",       ind: "Finance · Banking",          reg: "Dubai · London · New York" },
  { id: 2,  name: "Urban Tech Professional",   ind: "Technology · Engineering",   reg: "GCC · Singapore · Toronto" },
  { id: 3,  name: "Editorial Creative",        ind: "Design · Media · Marketing", reg: "Europe · UK · Australia" },
  { id: 4,  name: "The Toronto Executive",     ind: "Operations · Consulting",    reg: "Canada · USA · UK" },
  { id: 5,  name: "Global Minimalist",         ind: "Engineering · IT",           reg: "Americas · APAC" },
  { id: 6,  name: "African Enterprise",        ind: "Sales · Management",         reg: "GCC · Africa · Europe" },
  { id: 7,  name: "Singapore Tech Expert",     ind: "Technology · Data Science",  reg: "Singapore · APAC · USA" },
  { id: 8,  name: "Paris Creative",            ind: "Creative · Marketing",       reg: "France · EU · Canada" },
  { id: 9,  name: "Riyadh C-Suite",            ind: "Finance · Executive",        reg: "KSA · GCC · London" },
  { id: 10, name: "London Financial",          ind: "Finance · Fintech",          reg: "UK · Europe · Dubai" },
  { id: 11, name: "Mumbai Corporate",          ind: "Operations · HR",            reg: "India · GCC · Singapore" },
  { id: 12, name: "New York Banking",          ind: "Investment Banking",         reg: "USA · Canada · London" },
  { id: 13, name: "Amsterdam Innovation",      ind: "Product · UX · Design",     reg: "Netherlands · EU · Remote" },
  { id: 14, name: "Sydney Modern",             ind: "Healthcare · Research",      reg: "Australia · NZ · Canada" },
  { id: 15, name: "Dubai Hospitality Elite",   ind: "Hospitality · Tourism",     reg: "UAE · GCC · Maldives" },
  { id: 16, name: "Lagos Rising",              ind: "Business · Entrepreneurship",reg: "Nigeria · UK · USA" },
  { id: 17, name: "Nairobi Leadership",        ind: "NGO · Development",          reg: "Kenya · East Africa · UN" },
  { id: 18, name: "Frankfurt Banking",         ind: "Finance · Insurance",        reg: "Germany · EU · Switzerland" },
  { id: 19, name: "Beirut Medical",            ind: "Healthcare · Medicine",      reg: "Lebanon · GCC · EU" },
  { id: 20, name: "Cairo Engineering",         ind: "Civil · Infrastructure",    reg: "Egypt · GCC · Europe" },
  { id: 21, name: "Kuala Lumpur Digital",      ind: "Digital · E-Commerce",      reg: "Malaysia · ASEAN · Australia" },
  { id: 22, name: "Hong Kong Finance",         ind: "Asset Management",           reg: "HK · Singapore · London" },
  { id: 23, name: "Doha Energy Leader",        ind: "Oil & Gas · Energy",        reg: "Qatar · GCC · USA" },
  { id: 24, name: "Brussels Policy",           ind: "Law · Policy · EU Affairs", reg: "Belgium · EU · Geneva" },
  { id: 25, name: "Johannesburg Executive",    ind: "Mining · Resources",         reg: "South Africa · GCC · London" },
  { id: 26, name: "Geneva International",      ind: "Diplomacy · International",  reg: "Switzerland · UN · Global" },
  { id: 27, name: "Jakarta Tech Startup",      ind: "Technology · Startup",      reg: "Indonesia · ASEAN · Remote" },
  { id: 28, name: "Casablanca Professional",   ind: "Finance · Consulting",      reg: "Morocco · France · GCC" },
  { id: 29, name: "Abu Dhabi Government",      ind: "Public Sector · Policy",    reg: "UAE · GCC · International" },
  { id: 30, name: "Seoul Innovation",          ind: "Technology · R&D",          reg: "South Korea · Japan · USA" },
  { id: 31, name: "Mexico City Operations",    ind: "Supply Chain · Logistics",  reg: "Mexico · USA · Latin America" },
  { id: 32, name: "Accra Global",              ind: "Development · Finance",     reg: "Ghana · UK · EU" },
  { id: 33, name: "The Executive Portfolio",   ind: "C-Suite · Board Level",     reg: "Global · Any Market" },
].map(cv => ({ ...cv, ats: ATS_IDS.has(cv.id) }));

const TMS = [
  { name: "Sara Al-Rashidi",         role: "Finance Director",         co: "DIFC, Dubai",      ind: "Finance",    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face", text: "Nine interview invitations in eleven days. Zenith understood the DIFC recruitment landscape at a level no previous service had come close to matching.", hl: "9 interviews · 11 days" },
  { name: "James Okafor",            role: "General Manager",          co: "Jumeirah Group",   ind: "Hospitality",img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face", text: "Three interviewers opened by complimenting the document before asking a single question. I negotiated a package 28% above the initial offer.", hl: "+28% on package" },
  { name: "Capt. Rashed Al-Bloushi", role: "Senior First Officer",     co: "Emirates",         ind: "Aviation",   img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face", text: "Zenith knew precisely what Emirates recruitment evaluates at each stage. I was on the shortlist within days — which had never happened before.", hl: "Shortlisted in 4 days" },
  { name: "Marcus Vandenberg",       role: "VP Engineering",           co: "ADNOC, Abu Dhabi", ind: "Energy",     img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=face", text: "Two competing offers within three weeks. My previous CV had been failing automated screening entirely. The Zenith document cleared every filter.", hl: "2 competing offers" },
  { name: "Priya Nair",              role: "Cloud Architect",          co: "Singapore",        ind: "Technology", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=face", text: "My interview rate tripled. I accepted a Singapore-based offer at 40% above my previous compensation.", hl: "+40% compensation" },
  { name: "Dr. Layla Al-Hosani",     role: "Head of Cardiology",       co: "SEHA, Abu Dhabi",  ind: "Healthcare", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=160&h=160&fit=crop&crop=face", text: "For the first time, my profile reflected the actual weight of my clinical experience. The language secured my department leadership within the month.", hl: "Department Head · 30 days" },
  { name: "Claire Beaumont",         role: "Private Banking Director", co: "DIFC, Dubai",      ind: "Finance",    img: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=160&h=160&fit=crop&crop=face", text: "Two of the most selective private banks in the DIFC reached out within four weeks. Zenith understood what wealth management recruiters actually want.", hl: "2 DIFC banks · 4 weeks" },
  { name: "Yousef Al-Qahtani",       role: "Operations Director",      co: "Aramco",           ind: "Energy",     img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&crop=face", text: "An internal promotion and an unsolicited external offer at 35% uplift — both within six weeks. The career narrative framed my experience in a way I never had.", hl: "+35% · dual offer" },
];
const IH: Record<string, string> = { Finance: "#B8962E", Hospitality: "#9A7A3A", Healthcare: "#4A8A6A", Energy: "#9A6A20", Technology: "#3A6A8A", Aviation: "#5A5090" };

// ── Helpers ───────────────────────────────────────────────────────────────────
const wl = (m: string) => `https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
const fb = (b: number) => b < 1024 ? `${b}B` : b < 1048576 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1048576).toFixed(1)}MB`;

// ── Animated number counter ───────────────────────────────────────────────────
function CountUp({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { setDisplay(value); return; }
    const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
    const sfx = value.match(/[^0-9.]+$/)?.[0] ?? "";
    const duration = 1800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * num * 10) / 10;
      setDisplay(`${prefix}${Number.isInteger(num) ? Math.round(current) : current.toFixed(1)}${sfx}`);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// ── Reveal animation ──────────────────────────────────────────────────────────
function Reveal({ children, d = 0, y = 20, className = "" }: { children: React.ReactNode; d?: number; y?: number; className?: string }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-4% 0px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: d }}>
      {children}
    </motion.div>
  );
}

// ── Gold line draw ────────────────────────────────────────────────────────────
function GoldLine({ className = "" }: { className?: string }) {
  return (
    <motion.div className={`h-px ${className}`}
      style={{ background: `linear-gradient(to right, transparent, ${G}, transparent)`, boxShadow: `0 0 8px ${G}50` }}
      initial={{ scaleX: 0, transformOrigin: "left" }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} />
  );
}

// ── GlowCard ──────────────────────────────────────────────────────────────────
function GlowCard({ color = G, children, className = "" }: { color?: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const ang = useRef(0), op = useRef(0), raf = useRef<number | null>(null);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const onMove = useCallback((e: PointerEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    if (Math.sqrt(dx * dx + dy * dy) > 300) return;
    const tgt = Math.atan2(dy, dx) * (180 / Math.PI);
    if (raf.current) cancelAnimationFrame(raf.current);
    const step = () => { ang.current = lerp(ang.current, tgt, 0.12); el.style.setProperty("--ga", `${ang.current}deg`); if (Math.abs(ang.current - tgt) > 0.5) raf.current = requestAnimationFrame(step); };
    raf.current = requestAnimationFrame(step);
  }, []);
  const onEnter = useCallback(() => { const el = ref.current; if (!el) return; const s = () => { op.current = lerp(op.current, 1, 0.14); el.style.setProperty("--go", String(op.current)); if (op.current < 0.97) requestAnimationFrame(s); }; requestAnimationFrame(s); }, []);
  const onLeave = useCallback(() => { const el = ref.current; if (!el) return; const s = () => { op.current = lerp(op.current, 0, 0.10); el.style.setProperty("--go", String(op.current)); if (op.current > 0.01) requestAnimationFrame(s); else el.style.setProperty("--go", "0"); }; requestAnimationFrame(s); }, []);
  useEffect(() => { window.addEventListener("pointermove", onMove); return () => { window.removeEventListener("pointermove", onMove); if (raf.current) cancelAnimationFrame(raf.current); }; }, [onMove]);
  return (
    <div ref={ref} className={`relative ${className}`} onPointerEnter={onEnter} onPointerLeave={onLeave} style={{ "--gc": color, "--ga": "0deg", "--go": "0" } as React.CSSProperties}>
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ padding: "1px", background: "conic-gradient(from var(--ga),transparent 0deg,var(--gc) 60deg,transparent 120deg)", WebkitMask: "linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", opacity: "var(--go)", borderRadius: "inherit", zIndex: 1 }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ boxShadow: "0 0 40px 12px var(--gc)", opacity: "calc(var(--go)*0.10)", zIndex: 0, borderRadius: "inherit" }} />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}

// ── Upload Zone ───────────────────────────────────────────────────────────────
function UZ({ label, hint, accept, Ic, file, onFile, onClear, dark, busy, dropLabel = "Click or drop file" }: { label: string; hint: string; accept: string; Ic: React.ElementType; file: File | null; onFile: (f: File) => void; onClear: () => void; dark: boolean; busy: boolean; dropLabel?: string }) {
  const inp = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const s = dark ? "#70645A" : "#9A8E84", h = dark ? "#EDE8E0" : "#1A1410";
  return (
    <div>
      <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.22em]" style={{ color: s }}>{label}</label>
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ borderColor: `${G}45`, background: dark ? `${G}07` : `${G}05` }}>
          <Ic size={13} color={G} strokeWidth={1.5} className="shrink-0" />
          <div className="min-w-0 flex-1"><p className="truncate text-xs" style={{ color: h }}>{file.name}</p><p className="text-[9px]" style={{ color: s }}>{fb(file.size)}</p></div>
          <button type="button" onClick={onClear} disabled={busy} className="opacity-25 hover:opacity-50 p-1" style={{ color: s }}><Trash2 size={11} /></button>
        </div>
      ) : (
        <div className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-dashed px-4 py-4 text-center transition-all"
          style={{ borderColor: drag ? `${G}55` : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
          onClick={() => !busy && inp.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
          role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && inp.current?.click()}>
          <Upload size={12} color={drag ? G : s} strokeWidth={1.5} />
          <p className="text-[11px]" style={{ color: drag ? G : s }}>{dropLabel}</p>
          <p className="text-[9px] opacity-40" style={{ color: s }}>{hint}</p>
        </div>
      )}
      <input ref={inp} type="file" accept={accept} className="hidden" disabled={busy} onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
    </div>
  );
}

// ── Contact Modal ─────────────────────────────────────────────────────────────
function Modal({ open, onClose, dark, lang }: { open: boolean; onClose: () => void; dark: boolean; lang: Lang }) {
  const subs = lang === "ar" ? SUBS_AR : lang === "fr" ? SUBS_FR : SUBS_EN;
  const [form, setForm] = useState<Fm>({ email: "", subject: subs[0], message: "", photo: null, cv: null });
  const [st, setSt] = useState<St>("idle");
  const [err, setErr] = useState("");
  const mbg = dark ? "#0C0B09" : "#F8F4EF";
  const bd = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const h = dark ? "#EDE8E0" : "#1A1410", s = dark ? "#70645A" : "#9A8E84";
  const iS: React.CSSProperties = { background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)", borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", color: h, outline: "none" };

  async function submit() {
    if (!form.email.trim() || !form.message.trim()) return;
    setSt("sending"); setErr("");
    try {
      const fd = new FormData();
      fd.append("senderEmail", form.email.trim()); fd.append("subject", form.subject); fd.append("message", form.message.trim());
      if (form.photo) fd.append("photo", form.photo); if (form.cv) fd.append("cv", form.cv);
      const res = await fetch("/api/contact", { method: "POST", body: fd }); const d = await res.json();
      res.ok ? setSt("success") : (setErr(d.error ?? tr("frmErrGen", lang)), setSt("error"));
    } catch { setErr(tr("frmErrNet", lang)); setSt("error"); }
  }
  function close() { onClose(); setTimeout(() => { setForm({ email: "", subject: subs[0], message: "", photo: null, cv: null }); setSt("idle"); setErr(""); }, 350); }
  const busy = st === "sending", can = !!form.email.trim() && !!form.message.trim() && !busy;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-4 pt-10 sm:items-center">
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} style={{ background: "rgba(5,4,3,0.92)", backdropFilter: "blur(20px)" }} />
          <motion.div className="relative w-full max-w-[400px] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: mbg, border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
            <div className="h-px w-full" style={{ background: `linear-gradient(90deg,transparent,${G}70,transparent)` }} />
            <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: bd }}>
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.32em]" style={{ color: G }}>{tr("enquire", lang)}</p>
                <p className="mt-0.5 text-[11px]" style={{ color: s }}>{EM}</p>
              </div>
              <button type="button" onClick={close} className="opacity-20 hover:opacity-45 transition-opacity" style={{ color: h }}><X size={14} strokeWidth={1.5} /></button>
            </div>
            <div className="overflow-y-auto px-7 py-6 flex flex-col gap-4" style={{ maxHeight: "calc(100svh - 8rem)" }}>
              {st === "success" ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 py-10 text-center">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ border: `1px solid ${G}35`, background: `${G}0A` }}><CheckCircle size={18} color={G} strokeWidth={1.5} /></div>
                  <div><p className="font-medium text-sm" style={{ color: h }}>{tr("frmReceived", lang)}</p><p className="mt-1 text-xs leading-relaxed" style={{ color: s }}>{tr("frmReply", lang)} <span style={{ color: G }}>{form.email}</span> {tr("frmHours", lang)}</p></div>
                  <button type="button" onClick={close} className="mt-1 px-6 py-2 rounded-full text-xs font-medium hover:opacity-80 transition-opacity" style={{ background: G, color: INK }}>{tr("frmClose", lang)}</button>
                </motion.div>
              ) : (
                <>
                  {st === "error" && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2.5 rounded-xl px-4 py-3" style={{ background: "rgba(160,40,40,0.06)", border: "1px solid rgba(160,40,40,0.12)" }}><AlertCircle size={11} className="mt-0.5 shrink-0" style={{ color: "#A03232" }} /><p className="text-[10px]" style={{ color: s }}>{err}</p></motion.div>}
                  <div>
                    <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.22em]" style={{ color: s }}>{tr("frmEmail", lang)}</label>
                    <input type="email" placeholder="name@company.com" value={form.email} disabled={busy} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full rounded-xl border px-4 py-2.5 text-sm disabled:opacity-40 transition-all" style={iS} onFocus={e => { (e.target as HTMLInputElement).style.borderColor = `${G}55`; }} onBlur={e => { (e.target as HTMLInputElement).style.borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"; }} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.22em]" style={{ color: s }}>{tr("frmSubject", lang)}</label>
                    <select value={form.subject} disabled={busy} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="w-full rounded-xl border px-4 py-2.5 text-sm appearance-none cursor-pointer disabled:opacity-40" style={{ ...iS, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23C8A96E' stroke-width='1.3' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }} onFocus={e => { (e.target as HTMLSelectElement).style.borderColor = `${G}55`; }} onBlur={e => { (e.target as HTMLSelectElement).style.borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"; }}>
                      {subs.map(o => <option key={o} value={o} style={{ background: dark ? "#0C0B09" : "#F8F4EF", color: h }}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.22em]" style={{ color: s }}>{tr("frmMessage", lang)}</label>
                    <textarea rows={4} disabled={busy} placeholder="Your current role, target markets, and career objective…" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="w-full rounded-xl border px-4 py-2.5 text-sm resize-none disabled:opacity-40 transition-all" style={iS} onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = `${G}55`; }} onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"; }} />
                  </div>
                  <div className="h-px" style={{ background: bd }} />
                  <p className="text-[9px] uppercase tracking-[0.22em] -mb-1" style={{ color: s }}>{tr("frmAttach", lang)} <span className="opacity-35">{tr("frmOptional", lang)}</span></p>
                  <UZ label={tr("frmPhoto", lang)} hint={tr("frmPhotoH", lang)} dropLabel={tr("frmDrop", lang)} accept="image/jpeg,image/png,image/webp" Ic={ImageIcon} file={form.photo} onFile={f => setForm(p => ({ ...p, photo: f }))} onClear={() => setForm(p => ({ ...p, photo: null }))} dark={dark} busy={busy} />
                  <UZ label={tr("frmCv", lang)} hint={tr("frmCvH", lang)} dropLabel={tr("frmDrop", lang)} accept=".pdf,.doc,.docx" Ic={FileText} file={form.cv} onFile={f => setForm(p => ({ ...p, cv: f }))} onClear={() => setForm(p => ({ ...p, cv: null }))} dark={dark} busy={busy} />
                  <button type="button" onClick={submit} disabled={!can} className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-xs font-medium tracking-wider transition-all hover:opacity-85 disabled:opacity-20 disabled:cursor-not-allowed mt-1" style={{ background: G, color: INK }}>
                    {busy ? <><Loader2 size={12} className="animate-spin" />{tr("frmSending", lang)}</> : st === "error" ? <><Send size={12} />{tr("frmRetry", lang)}</> : <><Send size={12} />{tr("sendEnq", lang)}</>}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Testimonial card ──────────────────────────────────────────────────────────
function TC({ t, dark }: { t: typeof TMS[0]; dark: boolean }) {
  const ac = IH[t.ind] ?? G;
  return (
    <div className="flex flex-col p-5 mb-3 rounded-xl" style={{ background: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.88)", border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, fontFamily: "sans-serif" }}>
      <p style={{ fontSize: "11px", lineHeight: "1.9", marginBottom: "14px", color: dark ? "#8A847E" : "#5A4E44", fontStyle: "italic", fontWeight: 400 }}>"{t.text}"</p>
      <div style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, paddingTop: "11px", display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={t.img} alt={t.name} className="h-7 w-7 rounded-full object-cover shrink-0" style={{ filter: "grayscale(50%) contrast(1.05)" }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: 600, color: dark ? "#C8C0B8" : "#1A1410", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</p>
          <p style={{ fontSize: "9px", color: dark ? "#5A5450" : "#9A8E84", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.role} · {t.co}</p>
        </div>
        <span style={{ flexShrink: 0, borderRadius: "9999px", padding: "1px 7px", fontSize: "8px", fontWeight: 500, background: `${ac}14`, color: ac, border: `1px solid ${ac}25`, whiteSpace: "nowrap" }}>{t.hl}</span>
      </div>
    </div>
  );
}

function TCol({ items, dark, dur = 55, rev = false }: { items: typeof TMS; dark: boolean; dur?: number; rev?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <motion.div animate={{ y: rev ? ["0%", "50%"] : ["0%", "-50%"] }} transition={{ duration: dur, ease: "linear", repeat: Infinity, repeatType: "loop" }}>
        {doubled.map((tm, i) => <TC key={`${tm.name}-${i}`} t={tm} dark={dark} />)}
      </motion.div>
    </div>
  );
}

// ── Preview Lightbox ──────────────────────────────────────────────────────────
function PreviewLightbox({ cv, onClose, onEnquire, dark, lang }: { cv: { id: number; name: string; ats: boolean }; onClose: () => void; onEnquire: () => void; dark: boolean; lang: Lang }) {
  const src = "/templates-new/cv" + cv.id + ".png";
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ background: "rgba(5,4,3,0.94)", backdropFilter: "blur(24px)" }} />
        <motion.div className="relative flex flex-col w-full max-w-xl rounded-2xl overflow-hidden"
          style={{ maxHeight: "calc(100svh - 2rem)", background: dark ? "#0C0B09" : "#F8F4EF", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}
          initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          <div className="h-px w-full shrink-0" style={{ background: `linear-gradient(90deg,transparent,${G}70,transparent)` }} />
          <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
            <div className="flex items-center gap-3 min-w-0">
              <h3 className="text-sm font-semibold truncate" style={{ color: dark ? "#EDE8E0" : "#1A1410", fontFamily: "sans-serif" }}>{cv.name}</h3>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[8px] font-medium" style={{ background: cv.ats ? `${G}12` : "rgba(120,100,160,0.10)", color: cv.ats ? G : "#8A6AAA", border: `1px solid ${cv.ats ? `${G}28` : "rgba(120,100,160,0.22)"}`, fontFamily: "sans-serif" }}>
                {cv.ats ? tr("tplAts", lang) : tr("tplDesign", lang)}
              </span>
            </div>
            <button type="button" onClick={onClose} className="shrink-0 ml-3 opacity-20 hover:opacity-50 transition-opacity" style={{ color: dark ? "#EDE8E0" : "#1A1410" }}><X size={14} strokeWidth={1.5} /></button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {!imgError ? (
              <div className="relative">
                {!loaded && <div className="flex items-center justify-center" style={{ height: "380px" }}><Loader2 size={18} color={G} className="animate-spin" strokeWidth={1.5} /></div>}
                <img src={src} alt={cv.name} className="w-full h-auto block" style={{ display: loaded ? "block" : "none", objectFit: "contain" }} onLoad={() => setLoaded(true)} onError={() => setImgError(true)} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-20" style={{ color: dark ? "#605850" : "#9A8E84" }}>
                <FileText size={32} strokeWidth={1} style={{ opacity: 0.25 }} /><p className="text-sm" style={{ fontFamily: "sans-serif" }}>{cv.name}</p>
              </div>
            )}
          </div>
          <div className="px-6 py-4 shrink-0 flex gap-3" style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
            <button type="button" onClick={() => { onClose(); onEnquire(); }} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-full text-[10px] font-medium tracking-[0.16em] uppercase transition-all hover:opacity-85" style={{ background: G, color: INK, fontFamily: "sans-serif" }}>
              <Mail size={11} strokeWidth={2} />{tr("tplEnquire", lang)}
            </button>
            <button type="button" onClick={onClose} className="px-5 h-10 rounded-full text-[10px] font-medium tracking-[0.16em] uppercase transition-all hover:opacity-60" style={{ border: `1px solid ${dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"}`, color: dark ? "#605850" : "#9A8E84", fontFamily: "sans-serif" }}>
              {tr("tplClose", lang)}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [dark, setDark] = useState(() => { if (typeof window === "undefined") return true; const s = localStorage.getItem("z-theme"); return s !== null ? s === "dark" : true; });
  const tog = () => { const n = !dark; setDark(n); localStorage.setItem("z-theme", n ? "dark" : "light"); };
  const [modal, setModal] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [langOpen, setLangOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [preview, setPreview] = useState<{ id: number; name: string; ats: boolean } | null>(null);

  const LG = LANGS.find(l => l.code === lang)!;
  const dir = LG.dir;
  const font = LG.font;

  // Theme tokens
  const bg   = dark ? INK : ASH;
  const hi   = dark ? "#EDE8E0" : "#1A1410";
  const sub  = dark ? "#7A6E66" : "#8A7E74";
  const mid  = dark ? "#B8A89C" : "#6A5A50";
  const bdr  = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const card = dark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.92)";
  const nav  = dark ? "rgba(10,9,7,0.97)" : "rgba(247,243,238,0.97)";

  // Social link colour (theme-aware, matches SocialMarquee's dotColor logic)
  const socialLinkColor = dark ? `${G}55` : `${G}70`;



  const cols = [TMS.filter((_, i) => i % 3 === 0), TMS.filter((_, i) => i % 3 === 1), TMS.filter((_, i) => i % 3 === 2)];
  const wlMsg = wl("Hello. I would like to request a private review.");
  const shown = TEMPLATES.slice(0, visible);
  const hasMore = visible < TEMPLATES.length;

  const STEPS = [
    { n: "I",   t: tr("p1t", lang), b: tr("p1b", lang), Ic: CreditCard },
    { n: "II",  t: tr("p2t", lang), b: tr("p2b", lang), Ic: FileText },
    { n: "III", t: tr("p3t", lang), b: tr("p3b", lang), Ic: Send },
    { n: "IV",  t: tr("p4t", lang), b: tr("p4b", lang), Ic: CheckCircle },
  ];

  const AUTHORITY = [
    { n: "7,000+", k: tr("mClients", lang) },
    { n: "40+",    k: tr("mMarkets", lang) },
    { n: "99.9%",  k: tr("mAts", lang) },
    { n: "48h",    k: tr("mDraft", lang) },
  ];

  const logoFilter = dark
    ? ["brightness(1.05)", "drop-shadow(0 0 6px rgba(200,169,110,0.12))", "drop-shadow(0 2px 4px rgba(0,0,0,0.45))"].join(" ")
    : "brightness(0) saturate(0) contrast(1)";

  return (
    <div key={lang} className="min-h-screen w-full overflow-x-hidden" dir={dir} style={{ background: bg, color: hi, fontFamily: font, transition: "background 0.7s ease, color 0.4s ease" }}>

      {/* Grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ opacity: dark ? 0.03 : 0.025, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

      {/* Dark radial glow */}
      {dark && <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: `radial-gradient(ellipse 55% 35% at 50% -4%,${G}06,transparent 60%)` }} />}

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50" style={{ background: nav, backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderBottom: dark ? "none" : `1px solid ${bdr}` }}>
        {dark && <div aria-hidden className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: `linear-gradient(90deg,transparent 0%,rgba(200,169,110,0.06) 15%,rgba(200,169,110,0.35) 50%,rgba(200,169,110,0.06) 85%,transparent 100%)` }} />}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 sm:px-8" style={{ height: "72px" }}>
          <a href="#" className="flex items-center shrink-0">
            <img src="/images/logo.png" alt="Zenith Dubai CV" style={{ height: "auto", width: "96px", objectFit: "contain", display: "block", borderRadius: "6px", filter: logoFilter, transition: "filter 0.4s ease" }} />
          </a>
          <nav className="hidden md:flex items-center gap-7">
            {([["#disciplines", "navServices"], ["#portfolio", "navTemplates"], ["#method", "navMethod"], ["#investment", "navPricing"], ["#outcomes", "navClients"]] as [string, string][]).map(([href, k]) => (
              <a key={href} href={href} className="text-[9px] font-medium tracking-[0.22em] uppercase transition-all duration-300" style={{ color: dark ? `${G}38` : `${hi}55`, fontFamily: "sans-serif", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = dark ? G : hi; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = dark ? `${G}38` : `${hi}55`; }}>
                {tr(k, lang)}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <div className="relative">
              <button type="button" onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1 text-[9px] font-medium tracking-[0.16em] uppercase px-3 rounded-full transition-all duration-300"
                style={{ border: `1px solid ${dark ? `${G}20` : `${G}25`}`, color: dark ? `${G}70` : G, height: "30px", fontFamily: "sans-serif", background: "transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = dark ? `${G}45` : `${G}50`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = dark ? `${G}20` : `${G}25`; }}>
                <Globe size={9} strokeWidth={1.5} />{LG.label}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.18 }}
                    className="absolute top-9 right-0 rounded-xl overflow-hidden z-50"
                    style={{ background: dark ? "#111009" : "#F5F1EB", border: dark ? `1px solid rgba(200,169,110,0.12)` : `1px solid ${bdr}`, boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.70)" : "0 8px 24px rgba(0,0,0,0.10)", minWidth: "130px" }}>
                    {LANGS.map(l => (
                      <button key={l.code} type="button" onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] text-left"
                        style={{ color: l.code === lang ? (dark ? "#D4AF37" : G) : hi, fontFamily: "sans-serif", background: l.code === lang ? (dark ? "rgba(212,175,55,0.06)" : `${G}06`) : "transparent", fontWeight: l.code === lang ? 600 : 400, border: "none", cursor: "pointer", width: "100%" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = dark ? "rgba(212,175,55,0.04)" : `${G}04`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = l.code === lang ? (dark ? "rgba(212,175,55,0.06)" : `${G}06`) : "transparent"; }}>
                        {l.code === lang && <span className="h-1 w-1 rounded-full shrink-0" style={{ background: dark ? "#D4AF37" : G }} />}
                        <span style={{ marginLeft: l.code === lang ? "0" : "9px" }}>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Apply button */}
            <button type="button" onClick={() => setModal(true)}
              className="hidden sm:flex items-center gap-1.5 text-[9px] font-medium tracking-[0.20em] uppercase px-5 rounded-full transition-all duration-300"
              style={{ border: dark ? `1px solid rgba(200,169,110,0.28)` : `1px solid ${G}35`, color: dark ? `${G}80` : G, height: "30px", fontFamily: "sans-serif", background: "transparent" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = dark ? `${G}60` : `${G}60`; el.style.color = G; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = dark ? "rgba(200,169,110,0.28)" : `${G}35`; el.style.color = dark ? `${G}80` : G; }}>
              {tr("enquire", lang)}
            </button>

            {/* Theme toggle */}
            <div onClick={tog} role="button" aria-label="Toggle theme" tabIndex={0} onKeyDown={e => e.key === "Enter" && tog()}
              className="flex p-1 rounded-full cursor-pointer"
              style={{ width: "52px", height: "26px", background: dark ? "#111009" : "#FFFFFF", border: dark ? "1px solid rgba(200,169,110,0.12)" : "1px solid rgba(0,0,0,0.08)", transition: "background 0.4s ease", flexShrink: 0 }}>
              <div className="flex justify-between items-center w-full">
                <div className="flex justify-center items-center rounded-full transition-all duration-300" style={{ width: "18px", height: "18px", transform: dark ? "translateX(0)" : "translateX(26px)", background: dark ? "#1C1A17" : "#EDE8E3", flexShrink: 0 }}>
                  {dark ? <Moon size={10} strokeWidth={1.5} color={G} /> : <Sun size={10} strokeWidth={1.5} color="#786860" />}
                </div>
                <div className="flex justify-center items-center rounded-full transition-all duration-300" style={{ width: "18px", height: "18px", transform: dark ? "translateX(0)" : "translateX(-26px)", flexShrink: 0 }}>
                  {dark ? <Sun size={10} strokeWidth={1.5} color="rgba(200,169,110,0.20)" /> : <Moon size={10} strokeWidth={1.5} color="rgba(0,0,0,0.15)" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-[72px]">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[98vh] flex flex-col items-center justify-center px-5 sm:px-8 text-center overflow-hidden">
          <Reveal d={0.1} y={12}>
            <div className="inline-flex items-center gap-2 mb-12 px-4 py-1.5 rounded-full" style={{ border: `1px solid ${G}22`, background: dark ? `${G}06` : `${G}04` }}>
              <span className="h-1 w-1 rounded-full animate-pulse" style={{ background: G }} />
              <span className="text-[8px] font-medium tracking-[0.35em] uppercase" style={{ color: dark ? `${G}80` : G, fontFamily: "sans-serif" }}>{tr("scarcity", lang)}</span>
            </div>
          </Reveal>
          <Reveal d={0.3} y={40}>
            <h1 className="font-normal leading-[1.0] tracking-[-0.035em] mb-8 mx-auto" style={{ fontSize: "clamp(44px, 8vw, 96px)", color: hi, maxWidth: "900px" }}>
              {tr("h1a", lang)}<br />
              <em style={{ fontStyle: "italic", color: G }}>{tr("h1b", lang)}</em>
            </h1>
          </Reveal>
          <Reveal d={0.55} y={0} className="w-full max-w-xs mb-10 mx-auto">
            <GoldLine />
          </Reveal>
          <Reveal d={0.65} y={20}>
            <p className="text-[15px] sm:text-[17px] leading-[2.0] max-w-[420px] mx-auto mb-0 px-4 sm:px-0" style={{ color: dark ? "#6A5E56" : "#8A7A70", fontFamily: "sans-serif", fontWeight: 300 }}>
              {tr("heroSub", lang)}
            </p>
          </Reveal>
          <div style={{ height: "48px" }} />
          <Reveal d={0.8} y={16}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full px-4 sm:px-0">
              <button type="button" onClick={() => setModal(true)}
                className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-10 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full transition-all duration-300 hover:opacity-90"
                style={{ background: G, color: INK, height: "50px", fontFamily: "sans-serif", boxShadow: `0 6px 28px ${G}28` }}>
                {tr("ctaPrimary", lang)}
              </button>
              <a href="#outcomes"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-10 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full transition-all duration-300 hover:opacity-65"
                style={{ border: `1px solid ${G}28`, color: dark ? `${G}60` : G, height: "50px", fontFamily: "sans-serif" }}>
                {tr("ctaSecondary", lang)} <ArrowRight size={11} strokeWidth={1.5} />
              </a>
            </div>
          </Reveal>
          <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" initial={{ opacity: 0 }} animate={{ opacity: dark ? 0.12 : 0.2 }} transition={{ delay: 2.5, duration: 1.5 }}>
            <motion.div className="w-px h-10" style={{ background: hi }} animate={{ scaleY: [1, 0, 1], transformOrigin: "top" }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} />
          </motion.div>
        </section>

        {/* ── PROOF METRICS ───────────────────────────────────────────────── */}
        <section style={{ borderTop: `1px solid ${bdr}`, borderBottom: `1px solid ${bdr}` }}>
          <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4">
            {AUTHORITY.map(({ n, k }, i) => (
              <div key={k} className="border-r last:border-r-0" style={{ borderColor: bdr }}>
                <Reveal d={0.06 * i} className="flex flex-col items-center justify-center py-14 px-6 text-center">
                  <p className="text-3xl sm:text-4xl font-normal tracking-tight mb-2" style={{ color: dark ? GL : "#B8962E", fontFamily: "'Georgia',serif" }}>
                    <CountUp value={n} />
                  </p>
                  <p className="text-[9px] font-medium tracking-[0.24em] uppercase" style={{ color: sub, fontFamily: "sans-serif" }}>{k}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* ── SOCIAL LINKS ────────────────────────────────────────────────── */}
        <div style={{ borderBottom: `1px solid ${bdr}`, transition: "border-color 0.7s ease, background 0.7s ease" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "32px",
              padding: "22px 24px",
              maxWidth: "1152px",
              margin: "0 auto",
            }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                  color: socialLinkColor,
                  fontFamily: "sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase" as React.CSSProperties["textTransform"],
                  transition: "color 0.25s ease",
                  padding: "4px 0",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = GL; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = socialLinkColor; }}
              >
                <span style={{ color: "inherit", display: "flex" }}>{s.icon}</span>
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* ── DISCIPLINES ─────────────────────────────────────────────────── */}
        <section id="disciplines" className="py-40 px-5 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-24">
              <p className="text-[9px] font-medium tracking-[0.40em] uppercase mb-5" style={{ color: dark ? `${G}55` : G, fontFamily: "sans-serif" }}>{tr("svcEyebrow", lang)}</p>
              <h2 className="text-3xl sm:text-[42px] font-normal tracking-tight leading-[1.15]" style={{ color: hi, maxWidth: "520px" }}>
                {tr("svcH2", lang).split("\n").map((line, i) => (
                  <React.Fragment key={i}>{i > 0 && <br />}{i === 1 ? <em style={{ fontStyle: "italic", color: G }}>{line}</em> : line}</React.Fragment>
                ))}
              </h2>
            </Reveal>
            <div className="grid sm:grid-cols-3" style={{ borderTop: `1px solid ${bdr}` }}>
              {[{ t: "s1t", b: "s1b", tag: "s1tag", n: "I" }, { t: "s2t", b: "s2b", tag: "s2tag", n: "II" }, { t: "s3t", b: "s3b", tag: "s3tag", n: "III" }].map((s, i) => (
                <div key={s.n} className="sm:border-r sm:last:border-r-0 border-b sm:border-b-0" style={{ borderColor: bdr }}>
                  <Reveal d={0.1 * i} className="p-10 lg:p-12">
                    <div className="flex items-center gap-4 mb-10">
                      <p className="text-[10px] tracking-[0.35em] uppercase" style={{ color: dark ? `${G}35` : `${G}60`, fontFamily: "sans-serif" }}>{s.n}</p>
                      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${G}35, transparent)` }} />
                    </div>
                    <h3 className="text-xl font-normal mb-5 tracking-tight leading-snug" style={{ color: hi }}>{tr(s.t, lang)}</h3>
                    <p className="text-sm leading-[2.0] mb-10" style={{ color: dark ? "#6A5E56" : "#8A7A70", fontFamily: "sans-serif", fontWeight: 300 }}>{tr(s.b, lang)}</p>
                    <p className="text-[9px] tracking-[0.14em] uppercase" style={{ color: dark ? `${G}35` : `${G}55`, fontFamily: "sans-serif" }}>{tr(s.tag, lang)}</p>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXCLUSIVITY ─────────────────────────────────────────────────── */}
        <section className="py-40 px-5 sm:px-8" style={{ borderTop: `1px solid ${bdr}` }}>
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <Reveal>
                <p className="text-[9px] font-medium tracking-[0.40em] uppercase mb-6" style={{ color: dark ? `${G}55` : G, fontFamily: "sans-serif" }}>{tr("exclEyebrow", lang)}</p>
                <h2 className="text-3xl sm:text-[42px] font-normal tracking-tight leading-[1.15] mb-8" style={{ color: hi }}>
                  {tr("exclH2a", lang)}<br />
                  <em style={{ fontStyle: "italic", color: G }}>{tr("exclH2b", lang)}</em>
                </h2>
                <p className="text-base leading-[2.0] max-w-md" style={{ color: dark ? "#6A5E56" : "#8A7A70", fontFamily: "sans-serif", fontWeight: 300 }}>{tr("exclBody", lang)}</p>
              </Reveal>
              <Reveal d={0.15}>
                <div className="flex flex-col gap-3 mb-8">
                  {[tr("exclPt1", lang), tr("exclPt2", lang), tr("exclPt3", lang)].map((pt, i) => (
                    <div key={i} className="flex items-center gap-5 px-7 py-5 rounded-2xl" style={{ background: dark ? `${G}04` : `${G}06`, border: `1px solid ${G}16` }}>
                      <div className="shrink-0 h-1 w-5" style={{ background: G, opacity: 0.5 }} />
                      <p className="text-sm" style={{ color: dark ? "#C0B0A0" : "#5A4E44", fontFamily: "sans-serif", fontWeight: 400 }}>{pt}</p>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setModal(true)}
                  className="flex items-center justify-center gap-2.5 px-10 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full transition-all hover:opacity-88"
                  style={{ background: G, color: INK, height: "50px", fontFamily: "sans-serif", boxShadow: `0 6px 28px ${G}24` }}>
                  {tr("ctaPrimary", lang)} <ArrowRight size={11} strokeWidth={1.5} />
                </button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── DOCUMENT PORTFOLIO ──────────────────────────────────────────── */}
        <section id="portfolio" className="py-40 px-5 sm:px-8" style={{ borderTop: `1px solid ${bdr}` }}>
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div>
                  <p className="text-[9px] font-medium tracking-[0.40em] uppercase mb-5" style={{ color: dark ? `${G}55` : G, fontFamily: "sans-serif" }}>{tr("tplEyebrow", lang)}</p>
                  <h2 className="text-3xl sm:text-[42px] font-normal tracking-tight" style={{ color: hi }}>
                    <em style={{ fontStyle: "italic", color: G }}>{tr("tplH2", lang)}</em>
                  </h2>
                </div>
                <div className="flex items-center gap-3 rounded-2xl px-5 py-3 shrink-0" style={{ background: dark ? `${G}07` : `${G}06`, border: `1px solid ${G}22` }}>
                  <LayoutGrid size={14} color={dark ? `${G}80` : G} strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-semibold leading-none" style={{ color: G, fontFamily: "sans-serif" }}>3,000+</p>
                    <p className="text-[9px] mt-0.5" style={{ color: sub, fontFamily: "sans-serif" }}>{tr("tplBadge", lang)}</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal d={0.1} className="mb-16">
              <p className="text-sm leading-[2.0] max-w-2xl" style={{ color: dark ? "#6A5E56" : "#8A7A70", fontFamily: "sans-serif", fontWeight: 300 }}>{tr("tplDesc", lang)}</p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              <AnimatePresence initial={false}>
                {shown.map((cv, i) => (
                  <motion.div key={cv.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: (i % PAGE_SIZE) * 0.04 }}>
                    <GlowCard color={G} className="rounded-2xl h-full">
                      <div className="rounded-2xl overflow-hidden h-full flex flex-col" style={{ background: card, border: `1px solid ${bdr}` }}>
                        <div className="relative overflow-hidden cursor-pointer" style={{ height: "260px", background: dark ? "rgba(200,169,110,0.03)" : "rgba(200,169,110,0.04)" }}
                          onClick={() => setPreview({ id: cv.id, name: cv.name, ats: cv.ats })} title={tr("tplPreview", lang)}>
                          <img src={"/templates-new/cv" + cv.id + ".png"} alt={cv.name} loading="lazy"
                            className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-[1.04]"
                            style={{ filter: dark ? "brightness(0.88) contrast(1.05)" : "none", display: "block" }}
                            onError={e => { const img = e.currentTarget; img.style.display = "none"; const p = img.parentElement; if (p) { p.style.cssText = "height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:20px;cursor:pointer"; const icon = document.createElement("div"); icon.textContent = "📄"; icon.style.cssText = "font-size:28px;opacity:0.15"; const title = document.createElement("p"); title.textContent = cv.name; title.style.cssText = `font-size:11px;color:${G};font-family:sans-serif;text-align:center;opacity:0.7;font-weight:600`; p.appendChild(icon); p.appendChild(title); } }} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(10,9,7,0.75)" }}>
                            <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ background: `${G}18`, border: `1px solid ${G}45` }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                            </div>
                            <p className="text-[9px] font-medium tracking-[0.20em] uppercase" style={{ color: G, fontFamily: "sans-serif" }}>{tr("tplPreview", lang)}</p>
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <h3 className="text-[13px] font-semibold leading-tight" style={{ color: hi, fontFamily: "sans-serif" }}>{cv.name}</h3>
                            <span className="shrink-0 rounded-full px-2 py-0.5 text-[8px] font-medium mt-0.5" style={{ background: cv.ats ? `${G}12` : "rgba(120,100,160,0.08)", color: cv.ats ? G : "#8A6AAA", border: `1px solid ${cv.ats ? `${G}22` : "rgba(120,100,160,0.18)"}`, fontFamily: "sans-serif" }}>
                              {cv.ats ? tr("tplAts", lang) : tr("tplDesign", lang)}
                            </span>
                          </div>
                          <p className="text-[10px] mb-0.5" style={{ color: sub, fontFamily: "sans-serif" }}>{cv.ind}</p>
                          <p className="text-[9px] mb-4" style={{ color: dark ? "#4A4440" : "#AFA8A0", fontFamily: "sans-serif" }}>{cv.reg}</p>
                          <button type="button" onClick={() => setModal(true)} className="mt-auto w-full py-2 rounded-xl text-[9px] font-medium tracking-[0.18em] uppercase transition-all hover:opacity-70" style={{ border: `1px solid ${G}22`, color: dark ? `${G}60` : G, fontFamily: "sans-serif", background: "transparent" }}>
                            {tr("tplGet", lang)}
                          </button>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="text-center">
              {hasMore
                ? <button type="button" onClick={() => setVisible(n => Math.min(n + PAGE_SIZE, TEMPLATES.length))}
                    className="inline-flex items-center gap-2.5 px-8 text-[9px] font-medium tracking-[0.22em] uppercase rounded-full transition-all hover:opacity-75"
                    style={{ border: `1px solid ${G}28`, color: dark ? `${G}55` : G, height: "46px", fontFamily: "sans-serif", background: "transparent" }}>
                    <LayoutGrid size={12} strokeWidth={1.5} />{tr("tplMore", lang)}<ArrowRight size={11} strokeWidth={1.5} />
                  </button>
                : <Reveal>
                    <button type="button" onClick={() => setModal(true)} className="text-[9px] tracking-[0.24em] uppercase hover:opacity-60 transition-opacity" style={{ color: dark ? `${G}45` : G, fontFamily: "sans-serif", background: "none", border: "none", cursor: "pointer" }}>{tr("tplDone", lang)}</button>
                  </Reveal>}
            </div>
          </div>
        </section>

        {/* ── PROCESS ─────────────────────────────────────────────────────── */}
        <section id="method" className="py-40 px-5 sm:px-8" style={{ borderTop: `1px solid ${bdr}` }}>
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-24">
              <p className="text-[9px] font-medium tracking-[0.40em] uppercase mb-5" style={{ color: dark ? `${G}55` : G, fontFamily: "sans-serif" }}>{tr("procEyebrow", lang)}</p>
              <h2 className="text-3xl sm:text-[42px] font-normal tracking-tight" style={{ color: hi }}>{tr("procH2", lang)}</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {STEPS.map(({ n, t, b, Ic }, i) => (
                <Reveal key={n} d={0.08 * i}>
                  <div className="group p-8 rounded-2xl h-full relative transition-all duration-500" style={{ background: card, border: `1px solid ${bdr}` }}>
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ boxShadow: `0 0 0 1px ${G}18,0 0 32px ${G}07` }} />
                    <p className="text-[28px] font-normal mb-8" style={{ color: G, fontFamily: "'Georgia',serif", opacity: 0.28 }}>{n}</p>
                    <Ic size={14} color={G} strokeWidth={1.5} style={{ opacity: 0.55 }} />
                    <h3 className="mt-4 text-[14px] font-semibold" style={{ color: hi, fontFamily: "sans-serif" }}>{t}</h3>
                    <p className="mt-2.5 text-[12px] leading-[1.9]" style={{ color: dark ? "#6A5E56" : "#8A7A70", fontFamily: "sans-serif", fontWeight: 300 }}>{b}</p>
                    <div className="mt-8 h-px w-5 opacity-25" style={{ background: G }} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── INVESTMENT ──────────────────────────────────────────────────── */}
        <section id="investment" className="py-40 px-5 sm:px-8" style={{ borderTop: `1px solid ${bdr}` }}>
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-24">
              <p className="text-[9px] font-medium tracking-[0.40em] uppercase mb-5" style={{ color: dark ? `${G}55` : G, fontFamily: "sans-serif" }}>{tr("prcEyebrow", lang)}</p>
              <h2 className="text-3xl sm:text-[42px] font-normal tracking-tight leading-[1.15]" style={{ color: hi }}>
                {tr("prcH2", lang).split("\n").map((line, i) => (
                  <React.Fragment key={i}>{i > 0 && <br />}{i === 1 ? <em style={{ fontStyle: "italic", color: G }}>{line}</em> : line}</React.Fragment>
                ))}
              </h2>
              <p className="mt-4 text-[11px]" style={{ color: sub, fontFamily: "sans-serif" }}>{tr("prcNote", lang)}</p>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-5 items-start">

              {/* ── Foundation ── */}
              <Reveal d={0}>
                <div className="p-10 rounded-2xl h-full flex flex-col" style={{ background: card, border: `1px solid ${bdr}` }}>
                  <p className="text-[9px] tracking-[0.35em] uppercase mb-8" style={{ color: dark ? `${G}45` : `${G}70`, fontFamily: "sans-serif" }}>{tr("pF", lang)}</p>
                  <div className="flex items-baseline gap-1.5 mb-1.5">
                    <span className="text-[40px] font-normal leading-none" style={{ color: hi }}>179</span>
                    <span className="text-xs" style={{ color: sub, fontFamily: "sans-serif" }}>AED</span>
                  </div>
                  <p className="text-[11px] mb-8" style={{ color: dark ? "#5A5450" : "#9A8E84", fontFamily: "sans-serif" }}>{tr("pFsub", lang)}</p>
                  <div className="h-px mb-8" style={{ background: bdr }} />
                  <ul className="space-y-3 mb-10 flex-1">
                    {(["pFi1", "pFi2", "pFi3", "pFi4", "pFi5", "pFi6", "pFi7"] as string[]).map(k => (
                      <li key={k} className="flex items-start gap-3 text-[12px]" style={{ color: mid, fontFamily: "sans-serif", fontWeight: 300 }}>
                        <div className="mt-[7px] h-[3px] w-[3px] rounded-full shrink-0" style={{ background: G, opacity: 0.4 }} />{tr(k, lang)}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => setModal(true)} className="flex items-center justify-between w-full px-5 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium transition-all hover:opacity-70" style={{ border: `1px solid ${G}28`, color: dark ? `${G}55` : G, fontFamily: "sans-serif", height: "44px", background: "transparent" }}>
                    {tr("prcBegin", lang)}<ArrowRight size={11} />
                  </button>
                </div>
              </Reveal>

              {/* ── Growth (Most Popular) ── */}
              <Reveal d={0.08}>
                <div className="p-10 rounded-2xl h-full flex flex-col relative" style={{ background: dark ? "rgba(200,169,110,0.045)" : "rgba(200,169,110,0.065)", border: `1px solid ${G}30` }}>
                  <div className="absolute top-0 inset-x-0 h-px rounded-full" style={{ background: `linear-gradient(to right,transparent,${G}50,transparent)` }} />
                  {/* Most Popular badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full"
                    style={{ background: G, fontFamily: "sans-serif" }}>
                    <span className="h-1 w-1 rounded-full animate-pulse" style={{ background: INK, opacity: 0.6 }} />
                    <span className="text-[8px] font-semibold tracking-[0.28em] uppercase" style={{ color: INK }}>
                      {tr("pGBadge", lang)}
                    </span>
                  </div>
                  <p className="text-[9px] tracking-[0.35em] uppercase mb-8" style={{ color: G, fontFamily: "sans-serif" }}>{tr("pG", lang)}</p>
                  <div className="flex items-baseline gap-1.5 mb-1.5">
                    <span className="text-[40px] font-normal leading-none" style={{ color: hi }}>299</span>
                    <span className="text-xs" style={{ color: sub, fontFamily: "sans-serif" }}>AED</span>
                  </div>
                  <p className="text-[11px] mb-8" style={{ color: dark ? "#5A5450" : "#9A8E84", fontFamily: "sans-serif" }}>{tr("pGsub", lang)}</p>
                  <div className="h-px mb-8" style={{ background: `${G}20` }} />
                  <ul className="space-y-3 mb-10 flex-1">
                    {(["pGi1", "pGi2", "pGi3", "pGi4", "pGi5", "pGi6", "pGi7", "pGi8", "pGi9", "pGi10"] as string[]).map(k => (
                      <li key={k} className="flex items-start gap-3 text-[12px]" style={{ color: mid, fontFamily: "sans-serif", fontWeight: 300 }}>
                        <div className="mt-[7px] h-[3px] w-[3px] rounded-full shrink-0" style={{ background: G }} />{tr(k, lang)}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => setModal(true)} className="flex items-center justify-between w-full px-5 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium transition-all hover:opacity-88" style={{ background: G, color: INK, fontFamily: "sans-serif", height: "44px", boxShadow: `0 5px 20px ${G}25` }}>
                    {tr("prcBegin", lang)}<ArrowRight size={11} />
                  </button>
                </div>
              </Reveal>

              {/* ── Executive ── */}
              <Reveal d={0.16}>
                <div className="p-10 rounded-2xl h-full flex flex-col" style={{ background: card, border: `1px solid ${bdr}` }}>
                  <p className="text-[9px] tracking-[0.35em] uppercase mb-8" style={{ color: dark ? `${G}45` : `${G}70`, fontFamily: "sans-serif" }}>{tr("pE", lang)}</p>
                  <div className="flex items-baseline gap-1.5 mb-1.5">
                    <span className="text-[40px] font-normal leading-none" style={{ color: hi }}>449</span>
                    <span className="text-xs" style={{ color: sub, fontFamily: "sans-serif" }}>AED</span>
                  </div>
                  <p className="text-[11px] mb-8" style={{ color: dark ? "#5A5450" : "#9A8E84", fontFamily: "sans-serif" }}>{tr("pEsub", lang)}</p>
                  <div className="h-px mb-8" style={{ background: bdr }} />
                  <ul className="space-y-3 mb-10 flex-1">
                    {(["pEi1", "pEi2", "pEi3", "pEi4", "pEi5", "pEi6", "pEi7", "pEi8", "pEi9", "pEi10", "pEi11", "pEi12", "pEi13", "pEi14"] as string[]).map(k => (
                      <li key={k} className="flex items-start gap-3 text-[12px]" style={{ color: mid, fontFamily: "sans-serif", fontWeight: 300 }}>
                        <div className="mt-[7px] h-[3px] w-[3px] rounded-full shrink-0" style={{ background: G, opacity: 0.4 }} />{tr(k, lang)}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => setModal(true)} className="flex items-center justify-between w-full px-5 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium transition-all hover:opacity-70" style={{ border: `1px solid ${G}28`, color: dark ? `${G}55` : G, fontFamily: "sans-serif", height: "44px", background: "transparent" }}>
                    {tr("prcBegin", lang)}<ArrowRight size={11} />
                  </button>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        <CustomPackageBuilder
          dark={dark}
          lang={lang}
          onEnquire={(services, total) => {
            setModal(true);
          }}
        />

        {/* ── OUTCOMES ────────────────────────────────────────────────────── */}
        <section id="outcomes" className="py-40 px-5 sm:px-8" style={{ borderTop: `1px solid ${bdr}` }}>
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-20">
              <p className="text-[9px] font-medium tracking-[0.40em] uppercase mb-5" style={{ color: dark ? `${G}55` : G, fontFamily: "sans-serif" }}>{tr("tmEyebrow", lang)}</p>
              <h2 className="text-3xl sm:text-[42px] font-normal tracking-tight" style={{ color: hi }}>
                {tr("tmH2a", lang)}<br />
                <em style={{ fontStyle: "italic", color: G }}>{tr("tmH2b", lang)}</em>
              </h2>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <svg key={i} width="11" height="11" viewBox="0 0 14 14" fill={G} opacity="0.65"><path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9l-4 2.5 1.5-4L1 5h4.5z" /></svg>)}</div>
                <span className="text-[10px]" style={{ color: sub, fontFamily: "sans-serif" }}>{tr("tmStars", lang)}</span>
              </div>
            </Reveal>
            <div className="hidden lg:grid grid-cols-3 gap-5" style={{ height: "680px", maskImage: "linear-gradient(to bottom,transparent,black 10%,black 90%,transparent)", WebkitMaskImage: "linear-gradient(to bottom,transparent,black 10%,black 90%,transparent)" }}>
              {cols.map((col, ci) => <TCol key={ci} items={col} dark={dark} dur={[58, 72, 48][ci]} rev={ci === 1} />)}
            </div>
            <div className="lg:hidden overflow-hidden" style={{ height: "500px", maskImage: "linear-gradient(to bottom,transparent,black 8%,black 92%,transparent)", WebkitMaskImage: "linear-gradient(to bottom,transparent,black 8%,black 92%,transparent)" }}>
              <TCol items={TMS} dark={dark} dur={90} />
            </div>
          </div>
        </section>

        {/* ── SOCIAL MARQUEE ──────────────────────────────────────────────── */}
        <SocialMarquee dark={dark} />

        {/* ── CLOSING CTA ─────────────────────────────────────────────────── */}
        <section className="py-48 px-5 sm:px-8 text-center" style={{ borderTop: `1px solid ${bdr}` }}>
          <Reveal>
            <div className="mx-auto max-w-xl">
              <GoldLine className="w-10 mx-auto mb-20" />
              <h2 className="text-3xl sm:text-[44px] font-normal tracking-tight leading-[1.1] mb-5" style={{ color: hi }}>
                {tr("ctaH2a", lang)}<br />
                <em style={{ fontStyle: "italic", color: G }}>{tr("ctaH2b", lang)}</em>
              </h2>
              <p className="text-base leading-[2.0] mb-14 max-w-sm mx-auto" style={{ color: dark ? "#6A5E56" : "#8A7A70", fontFamily: "sans-serif", fontWeight: 300 }}>{tr("ctaBody", lang)}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button type="button" onClick={() => setModal(true)}
                  className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-12 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full transition-all hover:opacity-90"
                  style={{ background: G, color: INK, height: "52px", fontFamily: "sans-serif", boxShadow: `0 8px 36px ${G}28` }}>
                  {tr("ctaFinalBtn", lang)}
                </button>
                <a href={wlMsg} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-10 text-[10px] font-medium tracking-[0.22em] uppercase rounded-full transition-all hover:opacity-65"
                  style={{ border: `1px solid ${G}25`, color: dark ? `${G}55` : G, height: "52px", fontFamily: "sans-serif" }}>
                  {tr("startWA", lang)}
                </a>
              </div>
              <p className="mt-20 text-[8px] tracking-[0.32em] uppercase" style={{ color: dark ? `${G}18` : "rgba(26,20,16,0.25)", fontFamily: "sans-serif" }}>{tr("tagline", lang)}</p>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="relative py-10 px-5 sm:px-8" style={{ borderTop: `1px solid ${bdr}` }}>
        {dark && <div aria-hidden className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: `linear-gradient(90deg,transparent 0%,rgba(200,169,110,0.06) 15%,rgba(200,169,110,0.28) 50%,rgba(200,169,110,0.06) 85%,transparent 100%)` }} />}
        <div className="mx-auto max-w-6xl flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Zenith Dubai CV" style={{ height: "32px", width: "auto", objectFit: "contain", display: "block", borderRadius: "5px", filter: logoFilter, transition: "filter 0.4s ease", maxWidth: "120px" }} />
              <span className="text-[9px] tracking-[0.10em]" style={{ color: dark ? `${G}25` : sub, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>{tr("tagline", lang)}</span>
            </div>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setModal(true)} className="flex items-center gap-1.5 text-[9px] tracking-[0.16em] uppercase transition-all duration-300" style={{ color: dark ? `${G}22` : `${hi}35`, fontFamily: "sans-serif", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = dark ? `${G}60` : hi; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = dark ? `${G}22` : `${hi}35`; }}>
                <Mail size={9} strokeWidth={1.5} />{EM}
              </button>
              <span style={{ color: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)", fontSize: "9px" }}>·</span>
              <a href={wlMsg} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[9px] tracking-[0.16em] uppercase transition-all duration-300" style={{ color: dark ? "rgba(74,154,90,0.32)" : "#4A9A5A55", fontFamily: "sans-serif", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#4A9A5A"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = dark ? "rgba(74,154,90,0.32)" : "#4A9A5A55"; }}>
                <svg viewBox="0 0 24 24" width="9" height="9" fill="none"><path d="M12 22a10 10 0 0 0 8.66-15 10 10 0 0 0-16.9 10.6L3 22l4.56-.7A10 10 0 0 0 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                {tr("footerWA", lang)}
              </a>
            </div>
          </div>
          <div className="h-px" style={{ background: bdr }} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-[9px]" style={{ color: dark ? `${G}10` : `${hi}20`, fontFamily: "sans-serif", whiteSpace: "nowrap" }}>© {new Date().getFullYear()} Zenith Dubai CV</p>
            {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Refund Policy", "/refund"]].map(([label, href]) => (
              <React.Fragment key={href}>
                <span style={{ color: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)", fontSize: "9px" }}>·</span>
                <a href={href} className="text-[9px] transition-opacity hover:opacity-60" style={{ color: dark ? `${G}18` : `${hi}30`, fontFamily: "sans-serif", textDecoration: "none", whiteSpace: "nowrap" }}>{label}</a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </footer>

      {/* ── FLOATING ACTIONS ────────────────────────────────────────────── */}
      <button type="button" onClick={() => setModal(true)} aria-label="Request Review"
        className="fixed bottom-24 right-6 h-11 w-11 rounded-full flex items-center justify-center transition-all hover:scale-105 z-40"
        style={{ background: G, boxShadow: `0 4px 22px ${G}35` }}>
        <Mail size={13} color={INK} strokeWidth={2} />
      </button>
      <a href={`https://wa.me/${WA}?text=${encodeURIComponent("Hello. I would like to request a private review.")}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
        className="fixed bottom-8 right-6 h-11 w-11 rounded-full flex items-center justify-center transition-all hover:scale-105 z-40"
        style={{ background: "#25D366", boxShadow: "0 4px 22px rgba(37,211,102,0.28)" }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
          <path d="M12 22a10 10 0 0 0 8.66-15 10 10 0 0 0-16.9 10.6L3 22l4.56-.7A10 10 0 0 0 12 22Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9.35 8.9c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3.1.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.2-.2-.3-.5-.4l-1.9-.9c-.2-.1-.4-.1-.6.1-.2.2-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.5c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.5l-.8-2Z" fill="white" />
        </svg>
      </a>

      {preview && <PreviewLightbox cv={preview} onClose={() => setPreview(null)} onEnquire={() => setModal(true)} dark={dark} lang={lang} />}
      <Modal open={modal} onClose={() => setModal(false)} dark={dark} lang={lang} />
    </div>
  );
}