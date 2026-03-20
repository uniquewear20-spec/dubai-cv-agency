"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const GOLD = "#D4AF37";
const WA = "971502879462";

type Lang = "en" | "ar" | "fr";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Francais" },
];

type Pkg = { name: string; price: string; badge: string; highlight: boolean; items: string[]; stripeUrl: string };
type Faq = { q: string; a: string };
type Why = { stat: string; statSub: string; title: string; sub: string; body: string };
type Tm  = { name: string; role: string; flag: string; industry: string; stars: number; text: string; highlight: string };

type Translations = {
  dir: "ltr" | "rtl";
  font: string;
  nav: string;
  heroTitle: string;
  heroSub: string;
  heroTarget: string;
  cta1: string;
  cta2: string;
  whyLabel: string;
  whyTitle: string;
  why: Why[];
  missionLabel: string;
  missionTitle: string;
  missionP1: string;
  missionP2: string;
  missionCta: string;
  transLabel: string;
  transTitle: string;
  transSub: string;
  videoTitle: string;
  videoSub: string;
  beforeLabel: string;
  afterLabel: string;
  beforeTag: string;
  afterTag: string;
  transformCta: string;
  transformBtn: string;
  pkgLabel: string;
  pkgTitle: string;
  pkgSub: string;
  packages: Pkg[];
  choosePkg: string;
  portLabel: string;
  portTitle: string;
  portSub: string;
  viewBtn: string;
  loadMore: string;
  testLabel: string;
  testTitle: string;
  testimonials: Tm[];
  faqLabel: string;
  faqTitle: string;
  faqs: Faq[];
  ctaTitle: string;
  ctaBtn: string;
  footerLeft: string;
  footerRight: string;
  lbPortrait: string;
  lbRequest: string;
  waUpgrade: string;
  waStart: string;
  waMission: string;
  waBefore: string;
  waPkg: (n: string, p: string) => string;
  waStyle: (c: string, n: string) => string;
};

const STRIPE_GLOBAL  = "https://buy.stripe.com/test_eVq4gyeEe25R03d5GG0oM00";
const STRIPE_NOMAD   = "https://buy.stripe.com/test_aFa28q8fQcKv3fpglk0oM01";
const STRIPE_VIP     = "https://buy.stripe.com/test_aFadR89jU6m75nx4CC0oM02";

const T: Record<Lang, Translations> = {
  en: {
    dir: "ltr", font: "inherit",
    nav: "Zenith Dubai CV — Premium CV Agency",
    heroTitle: "Elevate Your Career in Dubai and Beyond",
    heroSub: "ATS-optimized and visually stunning CVs for the world's most competitive job markets.",
    heroTarget: "Targeting GCC, Asia, Africa, Europe and Canada.",
    cta1: "View Packages", cta2: "See Templates",
    whyLabel: "Why Choose Us",
    whyTitle: "The Standard for Premium CVs in the GCC",
    why: [
      { stat: "99.9%", statSub: "ATS pass rate",    title: "ATS-Dominance",   sub: "99.9% Filter Pass Rate",        body: "We reverse-engineer UAE and GCC recruitment software so your CV is never filtered out. Every keyword is precision-coded to pass applicant tracking systems." },
      { stat: "3x",    statSub: "more callbacks",   title: "Cinematic Visuals", sub: "A Brand Identity, Not a Document", body: "Your CV is the first impression in a room you have not entered yet. We create layouts that command attention and make hiring managers remember your name." },
      { stat: "6",     statSub: "GCC markets",      title: "Dubai-Centric",   sub: "Built for the GCC Market",      body: "Dubai hiring is unlike anywhere else. We understand DIFC expectations, free-zone standards, and the nuances that determine who gets shortlisted." },
    ],
    missionLabel: "Our Mission",
    missionTitle: "Empowering Dubai Professionals to Own Their Career Story",
    missionP1: "Dubai is the most competitive talent market in the world. Every day, exceptional professionals lose to inferior candidates because their CV fails to communicate their true value.",
    missionP2: "Our mission is to give every GCC professional world-class personal branding — precision-engineered for ATS systems and designed to convert first impressions into boardroom invitations.",
    missionCta: "Start Your Transformation",
    transLabel: "The Transformation", transTitle: "From a Draft to a Boardroom-Ready Brand",
    transSub: "This is what separates a CV that gets deleted from one that gets remembered.",
    videoTitle: "Watch: The Full CV Transformation", videoSub: "2 min, Makeover Process, Dubai 2024",
    beforeLabel: "Before", afterLabel: "After",
    beforeTag: "BEFORE — Generic Draft", afterTag: "AFTER — Cinematic Brand CV",
    transformCta: "Ready to make this transformation?", transformBtn: "Get My Transformation Now",
    pkgLabel: "Pricing", pkgTitle: "Packages", pkgSub: "Transparent pricing. Global-ready results.",
    packages: [
      { name: "The Global Entry",       price: "179 AED", badge: "Starter",      highlight: false, stripeUrl: STRIPE_GLOBAL, items: ["ATS CV or Designed CV", "Cover Letter", "AI Photo Touch-up"] },
      { name: "The Professional Nomad", price: "299 AED", badge: "BEST VALUE",   highlight: true,  stripeUrl: STRIPE_NOMAD,  items: ["Both CV types", "LinkedIn SEO Optimization", "Career E-book", "EN, FR, DE, AR"] },
      { name: "The VIP Pass",           price: "499 AED", badge: "30-day VIP",   highlight: false, stripeUrl: STRIPE_VIP,   items: ["Everything in Nomad", "1hr Interview Coaching", "Experience Consultation", "30-day VIP Support"] },
    ],
    choosePkg: "Choose this package",
    portLabel: "Portfolio", portTitle: "Premium CV Templates", portSub: "Cinematic and ATS, crafted for top job markets worldwide.",
    viewBtn: "View Sample", loadMore: "Load More",
    testLabel: "Testimonials", testTitle: "Client Reviews",
    testimonials: [
      { name: "Sara Al-Rashidi",          role: "Finance Director, Dubai",          flag: "🇦🇪", industry: "Finance",    stars: 5, text: "I applied to 12 roles and received 9 interview callbacks in under two weeks. The ATS CV passed every recruiter filter. Zenith understood the DIFC market perfectly.", highlight: "9 callbacks in 2 weeks" },
      { name: "James Okafor",             role: "Hospitality GM, Dubai Marina",     flag: "🇳🇬", industry: "Hospitality", stars: 5, text: "Every hiring manager mentioned my CV before the interview. The Cinematic Visual was breathtaking. Landed my dream role and negotiated a 28% higher salary.", highlight: "+28% salary negotiated" },
      { name: "Captain Rashed Al-Bloushi",role: "Senior First Officer, Emirates",   flag: "🇦🇪", industry: "Aviation",   stars: 5, text: "Aviation CVs are a different discipline. The Zenith team knew exactly what airline HR departments look for. My Emirates application was shortlisted within days.", highlight: "Emirates shortlisted in days" },
      { name: "Marcus Vandenberg",        role: "VP Engineering, ADNOC",            flag: "🇳🇱", industry: "Oil & Gas",  stars: 5, text: "The ATS Professional template passed Fortune 500 filters I had struggled with for months. Within three weeks I had two competing offers from major energy firms.", highlight: "2 competing offers in 3 weeks" },
      { name: "Priya Nair",               role: "Cloud Architect, Singapore",       flag: "🇸🇬", industry: "Tech",       stars: 5, text: "Transitioning from India to Singapore is incredibly competitive. Zenith repositioned my profile for the APAC tech market. I doubled my interview rate and accepted an offer 40% above my previous package.", highlight: "40% salary increase" },
      { name: "Dr. Layla Al-Hosani",      role: "Head of Cardiology, SEHA",        flag: "🇦🇪", industry: "Healthcare", stars: 5, text: "I needed a CV that reflected both my clinical excellence and leadership. Zenith delivered a world-class executive design that helped me secure my department head position.", highlight: "Department Head secured" },
      { name: "Claire Beaumont",          role: "Private Banking Director, DIFC",   flag: "🇬🇧", industry: "Finance",    stars: 5, text: "Relocated from London to DIFC and needed a CV for ultra-high-net-worth client management. The Executive Premium design opened doors at two of the top private banks in Dubai.", highlight: "DIFC role landed in 4 weeks" },
      { name: "Yousef Al-Qahtani",        role: "Operations Director, Aramco",      flag: "🇸🇦", industry: "Oil & Gas",  stars: 5, text: "My previous CV kept me at the same level for three years. After Zenith rebuilt my profile, I was promoted internally and received an unsolicited offer at 35% uplift.", highlight: "+35% salary uplift" },
    ],
    faqLabel: "FAQ", faqTitle: "Quick Answers",
    faqs: [
      { q: "What is the difference between Cinematic and ATS designs?", a: "Cinematic is design-forward for creative and hospitality roles. ATS is engineered to pass automated recruiter software." },
      { q: "Do I get both CV versions?", a: "Yes, both are included in The Professional Nomad and The VIP Pass packages." },
      { q: "How long does delivery take?", a: "First draft in 48 hours. Revisions within 24 hours of feedback." },
    ],
    ctaTitle: "Your Dream Role Is One CV Away", ctaBtn: "Get Started on WhatsApp",
    footerLeft: "Based in Dubai. Serving the World.", footerRight: "Premium CVs — ATS + Design",
    lbPortrait: "Full A4 portrait, gold-framed preview", lbRequest: "Request this style",
    waUpgrade: "Hi! I want to upgrade my CV. Help me choose the right package.",
    waStart:   "Hi! I am ready to get started. Help me choose the right CV package.",
    waMission: "Hi! I want to upgrade my CV and reach my dream role.",
    waBefore:  "Hi! I saw the Before/After and I want this transformation for my CV.",
    waPkg:   (n, p) => `Hi! I want to order the ${n} package (${p}).`,
    waStyle: (c, n) => `Hi! I want a CV like the ${c} sample for ${n}.`,
  },
  ar: {
    dir: "rtl", font: "'Cairo', 'Noto Sans Arabic', Arial, sans-serif",
    nav: "Zenith Dubai CV — وكالة سيرة ذاتية احترافية",
    heroTitle: "ارتق بمسيرتك المهنية في دبي وما وراءها",
    heroSub: "سير ذاتية محسنة لانظمة التتبع الآلي وبتصميم بصري استثنائي.",
    heroTarget: "نستهدف الخليج وآسيا وافريقيا واوروبا وكندا.",
    cta1: "عرض الباقات", cta2: "استعرض القوالب",
    whyLabel: "لماذا نحن", whyTitle: "المعيار الذهبي للسير الذاتية في منطقة الخليج",
    why: [
      { stat: "99.9%", statSub: "معدل اجتياز ATS", title: "هيمنة على انظمة ATS",   sub: "معدل نجاح 99.9%",              body: "نعيد هندسة برامج التوظيف الإماراتية والخليجية لضمان عدم تصفية سيرتك الذاتية ابدا." },
      { stat: "3x",    statSub: "مزيد من الدعوات", title: "تصميم سينمائي",         sub: "هوية مهنية لا مجرد وثيقة",    body: "سيرتك الذاتية هي الانطباع الاول. نصمم تخطيطات بصرية تستقطب الانتباه." },
      { stat: "6",     statSub: "اسواق خليجية",    title: "محوره دبي",              sub: "مصمم لسوق الخليج",             body: "التوظيف في دبي مختلف تماما. نفهم توقعات مركز دبي المالي ومعايير المناطق الحرة." },
    ],
    missionLabel: "رسالتنا",
    missionTitle: "تمكين المحترفين في دبي لامتلاك قصة مسيرتهم المهنية",
    missionP1: "دبي هي الاكثر تنافسية في سوق المواهب عالميا. كل يوم يخسر محترفون استثنائيون لان سيرتهم الذاتية تفشل في ايصال قيمتهم الحقيقية.",
    missionP2: "رسالتنا هي منح كل محترف في الخليج نفس العلامة التجارية الشخصية العالمية التي يتمتع بها المدراء التنفيذيون.",
    missionCta: "ابدا تحولك الآن",
    transLabel: "التحول", transTitle: "من مسودة الى علامة جاهزة لقاعة الاجتماعات",
    transSub: "هذا ما يفصل بين سيرة ذاتية تحذف واخرى تذكر.",
    videoTitle: "شاهد: التحول الكامل للسيرة الذاتية", videoSub: "دقيقتان، عملية التحسين، دبي 2024",
    beforeLabel: "قبل", afterLabel: "بعد",
    beforeTag: "قبل - مسودة عادية", afterTag: "بعد - سيرة ذاتية سينمائية",
    transformCta: "هل انت مستعد لهذا التحول؟", transformBtn: "احصل على تحولي الآن",
    pkgLabel: "التسعير", pkgTitle: "الباقات", pkgSub: "اسعار شفافة. نتائج جاهزة للعالمية.",
    packages: [
      { name: "البداية العالمية", price: "179 درهم", badge: "مبتدئ",         highlight: false, stripeUrl: STRIPE_GLOBAL, items: ["سيرة ATS او مصممة", "خطاب تقديم", "تحسين الصورة"] },
      { name: "المحترف المتنقل", price: "299 درهم", badge: "افضل قيمة",      highlight: true,  stripeUrl: STRIPE_NOMAD,  items: ["كلا النوعين", "تحسين لينكدإن SEO", "كتيب مهني", "EN, FR, DE, AR"] },
      { name: "تصريح VIP",       price: "499 درهم", badge: "دعم VIP 30 يوم", highlight: false, stripeUrl: STRIPE_VIP,   items: ["كل شيء في الباقة الثانية", "تدريب مقابلات", "استشارة تعزيز الخبرة", "دعم 30 يوما"] },
    ],
    choosePkg: "اختر هذه الباقة",
    portLabel: "معرض الاعمال", portTitle: "قوالب سيرة ذاتية احترافية", portSub: "قوالب سينمائية وATS مصممة لافضل اسواق العمل.",
    viewBtn: "عرض النموذج", loadMore: "تحميل المزيد",
    testLabel: "آراء العملاء", testTitle: "تقييمات العملاء",
    testimonials: [
      { name: "سارة الراشدي",           role: "مدير مالي، دبي",               flag: "🇦🇪", industry: "المال",         stars: 5, text: "تقدمت لـ 12 وظيفة وحصلت على 9 دعوات مقابلة خلال اسبوعين. اجتازت سيرتي الذاتية كل مرشح تلقائي.", highlight: "9 دعوات في اسبوعين" },
      { name: "جيمس اوكافور",           role: "مدير فندقي، دبي مارينا",       flag: "🇳🇬", industry: "الضيافة",       stars: 5, text: "التصميم السينمائي كان مذهلا. حصلت على وظيفة احلامي وتفاوضت على راتب اعلى بـ 28%.", highlight: "+28% زيادة في الراتب" },
      { name: "الكابتن راشد البلوشي",   role: "كابتن اول، طيران الامارات",    flag: "🇦🇪", industry: "الطيران",       stars: 5, text: "فريق Zenith عرف بالضبط ما تبحث عنه شركات الطيران. تمت الموافقة على طلبي في طيران الامارات خلال ايام.", highlight: "القبول في طيران الامارات" },
      { name: "ماركوس فاندنبرغ",        role: "نائب رئيس الهندسة، ادنوك",    flag: "🇳🇱", industry: "النفط والغاز", stars: 5, text: "خلال ثلاثة اسابيع حصلت على عرضين متنافسين من كبرى شركات الطاقة.", highlight: "عرضان متنافسان في 3 اسابيع" },
      { name: "بريا ناير",              role: "مهندسة سحابية، سنغافورة",      flag: "🇸🇬", industry: "التقنية",       stars: 5, text: "Zenith اعاد تموضع ملفي لسوق التقنية في آسيا. ضاعفت معدل المقابلات وقبلت عرضا بـ 40% فوق راتبي السابق.", highlight: "زيادة 40% في الراتب" },
      { name: "د. ليلى الحوسني",        role: "رئيسة طب القلب، صحة",         flag: "🇦🇪", industry: "الرعاية الصحية", stars: 5, text: "Zenith قدم تصميما تنفيذيا ساعدني على تامين منصب رئيس القسم في احد مستشفيات ابوظبي الرائدة.", highlight: "تامين منصب رئيس القسم" },
      { name: "كلير بومون",             role: "مدير المصرفية الخاصة، DIFC",   flag: "🇬🇧", industry: "المال",         stars: 5, text: "فتحت التصميم التنفيذي ابواب بنكين من اكبر بنوك دبي في شهر واحد.", highlight: "دور في DIFC خلال 4 اسابيع" },
      { name: "يوسف القحطاني",          role: "مدير العمليات، ارامكو",        flag: "🇸🇦", industry: "النفط والغاز", stars: 5, text: "بعد ان اعاد Zenith بناء ملفي، ترقيت داخليا وتلقيت عرضا من منافس بزيادة 35%.", highlight: "+35% زيادة في الراتب" },
    ],
    faqLabel: "اسئلة شائعة", faqTitle: "اجابات سريعة",
    faqs: [
      { q: "ما الفرق بين التصميم السينمائي وتصميم ATS؟", a: "التصميم السينمائي يناسب الادوار الإبداعية والضيافة. اما ATS فمصمم لاجتياز البرامج الآلية." },
      { q: "هل احصل على النوعين من السيرة الذاتية؟", a: "نعم، كلا النوعين مدرجان في باقة المحترف المتنقل وتصريح VIP." },
      { q: "كم يستغرق التسليم؟", a: "المسودة الاولى خلال 48 ساعة. التعديلات خلال 24 ساعة من تلقي الملاحظات." },
    ],
    ctaTitle: "وظيفة احلامك تبعد خطوة واحدة", ctaBtn: "ابدا عبر واتساب",
    footerLeft: "مقرنا دبي. نخدم العالم.", footerRight: "سير ذاتية احترافية — ATS + تصميم",
    lbPortrait: "عرض A4 كامل، اطار سينمائي ذهبي", lbRequest: "اطلب هذا الاسلوب",
    waUpgrade: "مرحبا! اريد الارتقاء بسيرتي الذاتية. ساعدني في اختيار الباقة المناسبة.",
    waStart:   "مرحبا! انا مستعد للبدء. ساعدني في اختيار الباقة.",
    waMission: "مرحبا! اريد الارتقاء بسيرتي الذاتية والوصول الى وظيفة احلامي.",
    waBefore:  "مرحبا! رايت مقارنة قبل وبعد واريد هذا التحول في سيرتي الذاتية.",
    waPkg:   (n, p) => `مرحبا! اريد طلب باقة ${n} بسعر ${p}.`,
    waStyle: (c, n) => `مرحبا! اريد سيرة ذاتية مشابهة لنموذج ${c} لـ ${n}.`,
  },
  fr: {
    dir: "ltr", font: "inherit",
    nav: "Zenith Dubai CV — Agence CV Premium",
    heroTitle: "Propulsez votre carriere a Dubai et au-dela",
    heroSub: "CVs optimises ATS et visuellement epoustouflants pour les marches les plus competitifs.",
    heroTarget: "Ciblant CCG, Asie, Afrique, Europe et Canada.",
    cta1: "Voir les forfaits", cta2: "Voir les modeles",
    whyLabel: "Pourquoi nous", whyTitle: "Le standard des CVs premium dans le CCG",
    why: [
      { stat: "99.9%", statSub: "taux de passage ATS", title: "Dominance ATS",       sub: "99,9% de taux de passage",   body: "Nous decryptons les logiciels de recrutement des Emirats pour garantir que votre CV ne soit jamais filtre." },
      { stat: "3x",    statSub: "plus d'entretiens",   title: "Visuels Cinematiques", sub: "Une identite, pas un document", body: "Votre CV est la premiere impression dans une piece que vous n'avez pas encore rejointe. Nos layouts captivent les recruteurs." },
      { stat: "6",     statSub: "marches CCG",         title: "Centre sur Dubai",    sub: "Concu pour le marche CCG",   body: "Le recrutement a Dubai est unique. Nous comprenons les attentes du DIFC et les nuances culturelles." },
    ],
    missionLabel: "Notre mission",
    missionTitle: "Donner aux professionnels de Dubai les moyens de maitriser leur histoire",
    missionP1: "Dubai est le marche des talents le plus competitif au monde. Chaque jour, des professionnels exceptionnels perdent parce que leur CV ne communique pas leur vraie valeur.",
    missionP2: "Notre mission est d'offrir a chaque professionnel du CCG le meme personal branding de classe mondiale dont jouissent les dirigeants.",
    missionCta: "Commencez votre transformation",
    transLabel: "La Transformation", transTitle: "D'une ebauche a une marque prete pour le boardroom",
    transSub: "C'est ce qui separe un CV supprime d'un CV memorable.",
    videoTitle: "Regardez: La transformation complete du CV", videoSub: "2 min, Processus de refonte, Dubai 2024",
    beforeLabel: "Avant", afterLabel: "Apres",
    beforeTag: "AVANT - Ebauche generique", afterTag: "APRES - CV Cinematique de marque",
    transformCta: "Pret a vivre cette transformation?", transformBtn: "Obtenir ma transformation",
    pkgLabel: "Tarifs", pkgTitle: "Forfaits", pkgSub: "Tarification transparente. Resultats mondiaux.",
    packages: [
      { name: "L'Entree Mondiale",       price: "179 AED", badge: "Debutant",       highlight: false, stripeUrl: STRIPE_GLOBAL, items: ["CV ATS ou CV design", "Lettre de motivation", "Retouche photo IA"] },
      { name: "Le Nomade Professionnel", price: "299 AED", badge: "MEILLEURE OFFRE", highlight: true,  stripeUrl: STRIPE_NOMAD,  items: ["Les deux types de CV", "Optimisation LinkedIn SEO", "E-book carriere", "EN, FR, DE, AR"] },
      { name: "Le Pass VIP",             price: "499 AED", badge: "Support VIP 30j", highlight: false, stripeUrl: STRIPE_VIP,   items: ["Tout du Nomade", "1h coaching entretien", "Consultation experience", "Support VIP 30 jours"] },
    ],
    choosePkg: "Choisir ce forfait",
    portLabel: "Portfolio", portTitle: "Modeles CV Premium", portSub: "Cinematiques et ATS, concus pour les meilleurs marches.",
    viewBtn: "Voir l'exemple", loadMore: "Charger plus",
    testLabel: "Temoignages", testTitle: "Avis clients",
    testimonials: [
      { name: "Sara Al-Rashidi",          role: "Directrice Financiere, Dubai",  flag: "🇦🇪", industry: "Finance",    stars: 5, text: "J'ai postule a 12 postes et obtenu 9 entretiens en deux semaines. Le CV ATS a passe tous les filtres. L'equipe a compris le marche CCG.", highlight: "9 entretiens en 2 semaines" },
      { name: "James Okafor",             role: "DG Hotellerie, Dubai Marina",   flag: "🇳🇬", industry: "Hotellerie", stars: 5, text: "Chaque recruteur a mentionne mon CV avant l'entretien. J'ai negocie un salaire 28% superieur a l'offre initiale.", highlight: "+28% de salaire negocie" },
      { name: "Cpt. Rashed Al-Bloushi",   role: "Premier Officier, Emirates",    flag: "🇦🇪", industry: "Aviation",   stars: 5, text: "L'equipe Zenith savait exactement ce que recherchent les RH des compagnies aeriennes. Ma candidature Emirates a ete selectionnee en quelques jours.", highlight: "Selection Emirates en quelques jours" },
      { name: "Marcus Vandenberg",        role: "VP Ingenierie, ADNOC",          flag: "🇳🇱", industry: "Petrole",    stars: 5, text: "En trois semaines, j'avais deux offres concurrentes de grandes societes energetiques de la region.", highlight: "2 offres en 3 semaines" },
      { name: "Priya Nair",               role: "Architecte Cloud, Singapour",   flag: "🇸🇬", industry: "Tech",       stars: 5, text: "J'ai double mon taux d'entretiens et accepte une offre 40% au-dessus de mon ancien package.", highlight: "+40% de package salarial" },
      { name: "Dr. Layla Al-Hosani",      role: "Chef Cardiologie, SEHA",        flag: "🇦🇪", industry: "Sante",      stars: 5, text: "Ce CV m'a permis d'obtenir le poste de chef de departement dans l'un des principaux reseaux hospitaliers d'Abu Dhabi.", highlight: "Poste de chef de departement" },
      { name: "Claire Beaumont",          role: "Directrice Banque Privee, DIFC",flag: "🇬🇧", industry: "Finance",    stars: 5, text: "Le design Executif Premium m'a ouvert les portes de deux des plus grandes banques privees de Dubai en un mois.", highlight: "Poste DIFC en 4 semaines" },
      { name: "Yousef Al-Qahtani",        role: "Directeur Operations, Aramco",  flag: "🇸🇦", industry: "Petrole",    stars: 5, text: "Apres la refonte Zenith, j'ai ete promu en interne et recu une offre avec une hausse de 35% de mon salaire.", highlight: "+35% d'augmentation" },
    ],
    faqLabel: "FAQ", faqTitle: "Reponses rapides",
    faqs: [
      { q: "Quelle est la difference entre les designs Cinematique et ATS?", a: "Le Cinematique est design pour les roles creatifs. L'ATS est concu pour passer les logiciels de recrutement automatises." },
      { q: "Est-ce que j'obtiens les deux versions du CV?", a: "Oui, les deux sont inclus dans Le Nomade Professionnel et Le Pass VIP." },
      { q: "Combien de temps prend la livraison?", a: "Premiere ebauche en 48 heures. Revisions en 24 heures apres retour." },
    ],
    ctaTitle: "Votre poste de reve est a un CV pres", ctaBtn: "Commencer sur WhatsApp",
    footerLeft: "Base a Dubai. Au service du monde.", footerRight: "CVs Premium — ATS + Design",
    lbPortrait: "Portrait A4 complet, apercu cadre dore", lbRequest: "Demander ce style",
    waUpgrade: "Bonjour! Je souhaite ameliorer mon CV. Aidez-moi a choisir le bon forfait.",
    waStart:   "Bonjour! Je suis pret a commencer. Aidez-moi a choisir le bon forfait CV.",
    waMission: "Bonjour! Je souhaite ameliorer mon CV et atteindre mon poste de reve.",
    waBefore:  "Bonjour! J'ai vu la comparaison Avant/Apres et je veux cette transformation.",
    waPkg:   (n, p) => `Bonjour! Je souhaite commander le forfait ${n} (${p}).`,
    waStyle: (c, n) => `Bonjour! Je veux un CV comme l'exemple ${c} pour ${n}.`,
  },
};

const CAT_ACCENT: Record<string, string> = {
  Hospitality: "#D4AF37", Finance: "#F59E0B", Tech: "#3B82F6",
  Creative: "#C084FC",    Healthcare: "#34D399", Executive: "#60A5FA",
  Aviation: "#818CF8",    "Oil & Gas": "#FB923C", Legal: "#A78BFA", Marketing: "#F472B6",
};

const PORTFOLIO_CARDS: Array<{ id: string; name: string; cat: string; type: string; role: string; region: string; img: string; accent: string }> = [
  { id:"001", name:"Zaid Al-Harbi",       cat:"Executive",   type:"Executive / Premium", role:"CEO, Regional Operations",       region:"Riyadh, Saudi",      img:"/cv2.png",  accent:"#60A5FA" },
  { id:"002", name:"Fatima Al-Mansoori",  cat:"Healthcare",  type:"Classic / ATS",       role:"Clinical Operations Director",   region:"Abu Dhabi, UAE",     img:"/cv3.png",  accent:"#34D399" },
  { id:"003", name:"Omar Al-Rashidi",     cat:"Finance",     type:"Executive / Premium", role:"Investment Banking VP",          region:"Dubai, UAE",         img:"/cv4.png",  accent:"#F59E0B" },
  { id:"004", name:"Noura Al-Ketbi",      cat:"Legal",       type:"Classic / ATS",       role:"General Counsel, DIFC",          region:"Dubai, UAE",         img:"/cv5.png",  accent:"#A78BFA" },
  { id:"005", name:"Khalid Al-Mazrouei", cat:"Tech",        type:"Modern / Creative",   role:"Chief Technology Officer",       region:"Abu Dhabi, UAE",     img:"/cv6.png",  accent:"#3B82F6" },
  { id:"006", name:"Sara Al-Suwaidi",     cat:"Marketing",   type:"Modern / Creative",   role:"Brand Strategy Director",        region:"Dubai, UAE",         img:"/cv7.png",  accent:"#F472B6" },
  { id:"007", name:"Rashed Al-Naqbi",     cat:"Aviation",    type:"Executive / Premium", role:"Airport Operations Director",    region:"Al Ain, UAE",        img:"/cv8.png",  accent:"#818CF8" },
  { id:"008", name:"Yousef Al-Shamsi",    cat:"Oil & Gas",   type:"Executive / Premium", role:"Upstream Operations Director",   region:"Dubai, UAE",         img:"/cv10.png", accent:"#FB923C" },
  { id:"009", name:"Nadia El-Sayed",      cat:"Hospitality", type:"Classic / ATS",       role:"Resort General Manager",         region:"Cairo, Egypt",       img:"/cv11.png", accent:"#D4AF37" },
  { id:"010", name:"Hassan El-Masri",     cat:"Finance",     type:"Classic / ATS",       role:"Corporate Finance Manager",      region:"Beirut, Lebanon",    img:"/cv12.png", accent:"#F59E0B" },
  { id:"011", name:"Yara Abdelrahman",    cat:"Healthcare",  type:"Modern / Creative",   role:"Pharmaceutical Affairs Lead",    region:"Amman, Jordan",      img:"/cv13.png", accent:"#34D399" },
  { id:"012", name:"Tariq Aziz",          cat:"Oil & Gas",   type:"Classic / ATS",       role:"Petroleum Engineering Manager",  region:"Riyadh, Saudi",      img:"/cv14.png", accent:"#FB923C" },
];

const CATEGORIES = ["All", "Hospitality", "Finance", "Tech", "Creative", "Healthcare", "Executive", "Aviation", "Oil & Gas", "Legal", "Marketing"];

const INDUSTRY_COLORS: Record<string, string> = {
  Finance: "#F59E0B", Hospitality: "#D4AF37", Healthcare: "#34D399",
  "Oil & Gas": "#FB923C", Tech: "#3B82F6", Aviation: "#818CF8",
  Marketing: "#F472B6", Executive: "#60A5FA", Legal: "#A78BFA",
  Hotellerie: "#D4AF37", Sante: "#34D399", Petrole: "#FB923C",
  "المال": "#F59E0B", "الضيافة": "#D4AF37", "الرعاية الصحية": "#34D399",
  "النفط والغاز": "#FB923C", "التقنية": "#3B82F6", "الطيران": "#818CF8",
};

function wa(msg: string) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function Stars({ n, size = 12 }: { n: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 14 14" fill={GOLD}>
          <path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9l-4 2.5 1.5-4L1 5h4.5z" />
        </svg>
      ))}
    </div>
  );
}

function DarkToggle({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => setDark(!dark)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:opacity-80"
      style={{ borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(212,175,55,0.50)", background: dark ? "rgba(255,255,255,0.05)" : "rgba(212,175,55,0.08)" }}
    >
      {dark ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

function LangSwitcher({ lang, setLang, dark }: { lang: Lang; setLang: (l: Lang) => void; dark: boolean }) {
  const [open, setOpen] = useState(false);
  const cur = LANGS.find((l) => l.code === lang)!;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition hover:opacity-80"
        style={{ borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: dark ? "#fff" : "#111827" }}
      >
        {cur.label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{ background: dark ? "#111114" : "#ffffff", borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" }}
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => { setLang(l.code); setOpen(false); }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm transition hover:opacity-70"
                style={{ color: l.code === lang ? GOLD : dark ? "#d4d4d8" : "#374151", fontWeight: l.code === lang ? 600 : 400 }}
              >
                {l.label}
                {l.code === lang && <span className="ms-auto h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}

type ModalState = { open: boolean; name: string; cat: string; type: string; img: string; accent: string };

function Modal({ state, onClose, t, dark }: { state: ModalState; onClose: () => void; t: Translations; dark: boolean }) {
  if (!state.open) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80]">
        <motion.div
          className="absolute inset-0 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ background: `radial-gradient(800px 400px at 30% 20%, ${state.accent}28, transparent 60%), rgba(0,0,0,0.88)` }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative flex w-full max-w-[520px] flex-col overflow-hidden rounded-3xl border"
            style={{ background: dark ? "#08080b" : "#ffffff", borderColor: `${GOLD}80`, maxHeight: "calc(100svh - 2rem)" }}
          >
            <div
              className="flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4"
              style={{ background: `linear-gradient(135deg, ${state.accent}12, transparent 60%)`, borderColor: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)" }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: state.accent }}>{state.cat}</p>
                <p className="mt-0.5 text-base font-semibold" style={{ color: dark ? "#fff" : "#111827" }}>{state.name}</p>
                <p className="mt-0.5 text-xs" style={{ color: dark ? "#71717a" : "#9ca3af" }}>{state.type}</p>
              </div>
              <button
                type="button" onClick={onClose}
                className="h-9 w-9 shrink-0 rounded-full border text-sm transition hover:opacity-70"
                style={{ background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.10)", color: dark ? "#fff" : "#111827" }}
                aria-label="Close"
              >
                X
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="overflow-hidden rounded-xl border" style={{ borderColor: `${GOLD}35` }}>
                <div className="relative w-full" style={{ aspectRatio: "210 / 297" }}>
                  <Image src={state.img} alt={state.name} fill className="object-contain" sizes="520px" priority />
                </div>
              </div>
            </div>
            <div className="shrink-0 border-t px-5 py-4" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px]" style={{ color: dark ? "#52525b" : "#9ca3af" }}>{t.lbPortrait}</p>
                <a href={wa(t.waStyle(state.cat, state.name))} target="_blank" rel="noreferrer"
                  className="inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold text-black hover:brightness-105"
                  style={{ background: GOLD }}>
                  {t.lbRequest}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function PortfolioSection({ t, openModal, dark }: { t: Translations; openModal: (c: typeof PORTFOLIO_CARDS[0]) => void; dark: boolean }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [limit, setLimit] = useState(12);

  const filtered = activeFilter === "All" ? PORTFOLIO_CARDS : PORTFOLIO_CARDS.filter((c) => c.cat === activeFilter);
  const visible = filtered.slice(0, limit);
  const remaining = filtered.length - visible.length;

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active = activeFilter === cat;
          const accent = cat !== "All" ? (CAT_ACCENT[cat] ?? GOLD) : GOLD;
          return (
            <button
              key={cat} type="button"
              onClick={() => { setActiveFilter(cat); setLimit(12); }}
              className="h-9 rounded-full px-4 text-xs font-semibold transition hover:opacity-80"
              style={active
                ? { background: accent, color: "#000" }
                : { border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: dark ? "#fff" : "#374151" }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((card, i) => (
          <FadeIn key={card.id} delay={Math.min(0.03 * i, 0.3)}>
            <div
              className="group overflow-hidden rounded-3xl border transition-all duration-300 hover:border-[#D4AF37]/40"
              style={{ border: `1px solid ${dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"}`, background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.80)" }}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <div className="absolute inset-0 opacity-[0.18] transition-opacity duration-300 group-hover:opacity-[0.35]">
                  <Image src={card.img} alt={card.name} fill className="object-cover object-center" sizes="33vw" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-5">
                  <div
                    className="w-full max-w-xs rounded-2xl border p-4 backdrop-blur-sm"
                    style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(0,0,0,0.40)" }}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold" style={{ color: card.accent }}>{card.cat}</p>
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-300">{card.type}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-white">{card.name}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-300">{card.role}</p>
                    <p className="mt-0.5 text-[10px] text-zinc-500">{card.region}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-xs font-medium" style={{ color: dark ? "#d4d4d8" : "#1f2937" }}>{card.name}</p>
                  <p className="text-[11px]" style={{ color: dark ? "#71717a" : "#9ca3af" }}>{card.role}</p>
                </div>
                <button
                  type="button" onClick={() => openModal(card)}
                  className="inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold text-white ring-1 ring-white/15 transition hover:ring-white/30"
                  style={{ background: `${card.accent}1a` }}
                >
                  {t.viewBtn}
                </button>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button" onClick={() => setLimit((n) => n + 12)}
            className="inline-flex h-11 items-center rounded-full border px-8 text-sm font-semibold transition hover:opacity-80"
            style={{ borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: dark ? "#fff" : "#374151" }}
          >
            {t.loadMore} ({remaining})
          </button>
        </div>
      )}
    </>
  );
}

function TestimonialsCarousel({ testimonials, dark }: { testimonials: Tm[]; dark: boolean }) {
  const [page, setPage] = useState(0);
  const perPage = 4;
  const total = testimonials.length;
  const pages = Math.ceil(total / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((tm, i) => {
          const accentColor = INDUSTRY_COLORS[tm.industry] ?? GOLD;
          return (
            <motion.div
              key={tm.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
              className="relative flex flex-col overflow-hidden rounded-3xl border p-4"
              style={{
                borderColor: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)",
                background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.80)",
              }}
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-15"
                style={{ background: `radial-gradient(circle, ${accentColor}55, transparent 70%)` }}
              />
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ borderColor: `${accentColor}40`, background: `${accentColor}12`, color: accentColor }}
                >
                  {tm.industry}
                </span>
                <Stars n={tm.stars} size={11} />
              </div>
              <div
                className="mb-3 inline-flex items-center gap-1 self-start rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
                style={{ borderColor: `${GOLD}35`, background: `${GOLD}10`, color: GOLD }}
              >
                {tm.highlight}
              </div>
              <p className="flex-1 text-xs leading-6" style={{ color: dark ? "#d4d4d8" : "#374151" }}>
                &ldquo;{tm.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2.5 border-t pt-3" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border text-base"
                  style={{ borderColor: `${accentColor}35`, background: `${accentColor}12` }}
                >
                  {tm.flag}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: dark ? "#fff" : "#111827" }}>{tm.name}</p>
                  <p className="text-[10px]" style={{ color: dark ? "#71717a" : "#9ca3af" }}>{tm.role}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: pages }).map((_, pi) => (
              <button
                key={pi} type="button" onClick={() => setPage(pi)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: page === pi ? "2rem" : "0.5rem", background: page === pi ? GOLD : "rgba(255,255,255,0.20)" }}
                aria-label={`Page ${pi + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:opacity-80 disabled:opacity-30"
              style={{ borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: dark ? "#fff" : "#374151" }}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button" onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page === pages - 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:opacity-80 disabled:opacity-30"
              style={{ borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)", background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: dark ? "#fff" : "#374151" }}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="text-xs ms-1" style={{ color: dark ? "#71717a" : "#9ca3af" }}>{page + 1} / {pages}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");

  // ─── DARK MODE WITH localStorage PERSISTENCE ───────────────────────────────
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true; // SSR: default dark
    const saved = localStorage.getItem("zenith-theme");
    return saved !== null ? saved === "dark" : true; // default dark if no saved preference
  });

  const handleSetDark = (v: boolean) => {
    setDark(v);
    localStorage.setItem("zenith-theme", v ? "dark" : "light");
  };
  // ───────────────────────────────────────────────────────────────────────────

  const t = T[lang];

  const [side, setSide] = useState<"before" | "after">("before");
  const [modal, setModal] = useState<ModalState>({ open: false, name: "", cat: "", type: "", img: "", accent: GOLD });

  const bg       = dark ? "#050505" : "#f8f7f4";
  const textMain = dark ? "#e4e4e7" : "#1a1a1a";
  const textSub  = dark ? "#a1a1aa" : "#6b7280";
  const textMid  = dark ? "#d4d4d8" : "#374151";
  const border   = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
  const cardBg   = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)";
  const navBg    = dark ? "rgba(5,5,5,0.82)" : "rgba(248,247,244,0.90)";

  return (
    <div dir={t.dir} lang={lang} className="min-h-[100svh] w-full transition-colors duration-300" style={{ background: bg, color: textMain, fontFamily: t.font }}>
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: "radial-gradient(800px 400px at 20% 10%, rgba(212,175,55,0.12), transparent 60%)" }} />

      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300" style={{ borderColor: border, background: navBg }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <p className="hidden text-xs sm:block" style={{ color: textSub }}>
            <span className="me-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#D4AF37] align-middle" />
            {t.nav}
          </p>
          <div className="ms-auto flex items-center gap-2">
            <a href="#packages" className="hidden h-9 items-center rounded-full border px-4 text-xs font-semibold transition hover:opacity-80 sm:inline-flex"
              style={{ borderColor: border, background: cardBg, color: textMain }}>
              {t.cta1}
            </a>
            {/* ── Toggle now uses handleSetDark for localStorage persistence ── */}
            <DarkToggle dark={dark} setDark={handleSetDark} />
            <LangSwitcher lang={lang} setLang={setLang} dark={dark} />
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">

        {/* HERO */}
        <section className="pb-12 pt-16 sm:pt-20 lg:pt-28">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs" style={{ borderColor: border, background: cardBg, color: textSub }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: GOLD }} />
              {t.nav}
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: dark ? "#fff" : "#111827" }}>{t.heroTitle}</h1>
            <p className="mt-5 text-base leading-7" style={{ color: textMid }}>{t.heroSub}</p>
            <p className="mt-3 text-sm" style={{ color: textSub }}>{t.heroTarget}</p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a href="#packages" className="inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold text-black hover:brightness-105"
                style={{ background: GOLD, boxShadow: `0 0 0 1px rgba(212,175,55,0.35), 0 16px 50px rgba(212,175,55,0.22)` }}>
                {t.cta1}
              </a>
              <a href="#portfolio" className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold transition hover:opacity-80"
                style={{ borderColor: border, background: cardBg, color: textMain }}>
                {t.cta2}
              </a>
            </div>
          </FadeIn>
        </section>

        {/* WHY US */}
        <section id="why-us" className="py-14 sm:py-16">
          <FadeIn className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>{t.whyLabel}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: dark ? "#fff" : "#111827" }}>{t.whyTitle}</h2>
          </FadeIn>
          <div className="grid gap-5 sm:grid-cols-3">
            {t.why.map((item, i) => (
              <FadeIn key={item.title} delay={0.08 * i}>
                <div className="flex h-full flex-col rounded-3xl border p-6 transition-all hover:border-[#D4AF37]/30"
                  style={{ borderColor: border, background: cardBg }}>
                  <div className="mb-4 flex items-end gap-2">
                    <span className="text-3xl font-bold" style={{ color: GOLD }}>{item.stat}</span>
                    <span className="mb-0.5 text-xs" style={{ color: textSub }}>{item.statSub}</span>
                  </div>
                  <h3 className="text-base font-semibold" style={{ color: dark ? "#fff" : "#111827" }}>{item.title}</h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: GOLD }}>{item.sub}</p>
                  <p className="mt-4 flex-1 text-sm leading-7" style={{ color: textSub }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* MISSION */}
        <section id="mission" className="py-14 sm:py-16">
          <div className="relative overflow-hidden rounded-3xl border px-8 py-14 sm:px-14 sm:py-20"
            style={{ borderColor: border, background: cardBg }}>
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(212,175,55,0.18), transparent 70%)" }} />
            <FadeIn className="relative mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>{t.missionLabel}</p>
              <div className="mx-auto mt-4 h-px w-8 rounded-full" style={{ background: GOLD }} />
              <h2 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: dark ? "#fff" : "#111827" }}>{t.missionTitle}</h2>
              <p className="mt-6 text-base leading-8" style={{ color: textMid }}>{t.missionP1}</p>
              <p className="mt-4 text-base leading-8" style={{ color: textSub }}>{t.missionP2}</p>
              <div className="mt-10 flex justify-center">
                <a href={wa(t.waMission)} target="_blank" rel="noreferrer"
                  className="inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold text-black hover:brightness-105"
                  style={{ background: GOLD }}>
                  {t.missionCta}
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* TRANSFORMATION */}
        <section id="transformation" className="py-14 sm:py-16">
          <FadeIn className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>{t.transLabel}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: dark ? "#fff" : "#111827" }}>{t.transTitle}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: textSub }}>{t.transSub}</p>
          </FadeIn>

          <div className="mb-12 overflow-hidden rounded-3xl border" style={{ borderColor: border, background: dark ? "#09090c" : "#f0eeeb" }}>
            <div className="relative aspect-video w-full">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <motion.div whileHover={{ scale: 1.08 }}
                  className="relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2"
                  style={{ borderColor: GOLD, background: "rgba(212,175,55,0.12)" }}>
                  <motion.div className="absolute inset-0 rounded-full border-2" style={{ borderColor: GOLD }}
                    animate={{ scale: [1, 1.4, 1.4], opacity: [0.5, 0, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }} />
                  <svg width="22" height="22" viewBox="0 0 22 22" fill={GOLD}>
                    <path d="M5 3.5l14 7.5-14 7.5V3.5z" />
                  </svg>
                </motion.div>
                <div className="text-center">
                  <p className="text-sm font-semibold" style={{ color: dark ? "#fff" : "#111827" }}>{t.videoTitle}</p>
                  <p className="mt-1 text-xs" style={{ color: textSub }}>{t.videoSub}</p>
                </div>
              </div>
            </div>
          </div>

          <FadeIn>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: dark ? "#fff" : "#111827" }}>{t.beforeLabel} / {t.afterLabel}</p>
              <div className="flex overflow-hidden rounded-full border p-1" style={{ borderColor: border, background: cardBg }}>
                {(["before", "after"] as const).map((s) => (
                  <button key={s} type="button" onClick={() => setSide(s)}
                    className="h-8 rounded-full px-5 text-xs font-semibold transition"
                    style={side === s ? { background: GOLD, color: "#000" } : { color: textSub }}>
                    {s === "before" ? t.beforeLabel : t.afterLabel}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className={`overflow-hidden rounded-3xl border transition-all duration-500 ${side === "before" ? "" : "opacity-40"}`}
                style={{ borderColor: side === "before" ? "rgba(239,68,68,0.30)" : border }}>
                <div className="flex items-center justify-between px-5 py-3" style={{ background: "rgba(239,68,68,0.05)" }}>
                  <span className="text-xs font-semibold text-red-400">{t.beforeTag}</span>
                  <span className="font-mono text-[10px]" style={{ color: textSub }}>ATS: REJECTED</span>
                </div>
                <div className="p-5 font-mono text-xs leading-7" style={{ background: dark ? "#0d0d10" : "#f5f3f0", color: textSub }}>
                  {["John Smith", "john@email.com", "", "OBJECTIVE", "Looking for a job in hospitality.", "", "EXPERIENCE", "Hotel Receptionist, Dubai", "Checked guests in", "Answered phones"].map((l, i) => (
                    <div key={i} className={l === "" ? "h-4" : ""}>{l}</div>
                  ))}
                </div>
              </div>
              <div className={`overflow-hidden rounded-3xl border transition-all duration-500 ${side === "after" ? "" : "opacity-40"}`}
                style={{ borderColor: side === "after" ? "rgba(212,175,55,0.35)" : border }}>
                <div className="flex items-center justify-between px-5 py-3" style={{ background: "rgba(212,175,55,0.05)" }}>
                  <span className="text-xs font-semibold" style={{ color: GOLD }}>{t.afterTag}</span>
                  <span className="font-mono text-[10px] text-emerald-500">ATS: PASSED</span>
                </div>
                <div className="p-5 text-xs leading-7" style={{ background: dark ? "#0a0a0c" : "#fafafa" }}>
                  <p className="text-base font-bold" style={{ color: GOLD }}>AMINA AL-MANSOORI</p>
                  <p className="text-sm" style={{ color: textMid }}>Guest Experience Director, Dubai UAE</p>
                  <p className="mt-2 font-bold" style={{ color: GOLD }}>PROFESSIONAL PROFILE</p>
                  <p style={{ color: textMid }}>Award-winning hospitality leader, 8+ years at 5-star Dubai properties. VIP relations and revenue optimisation across MENA.</p>
                  <p className="mt-2 font-bold" style={{ color: GOLD }}>EXPERIENCE</p>
                  <p className="font-bold" style={{ color: textMid }}>GUEST EXPERIENCE DIRECTOR</p>
                  <p style={{ color: textSub }}>Jumeirah Group, Dubai, 2020 to Present</p>
                  <p style={{ color: textMid }}>Increased satisfaction scores 34% YoY</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <p className="text-sm" style={{ color: textSub }}>{t.transformCta}</p>
              <a href={wa(t.waBefore)} target="_blank" rel="noreferrer"
                className="inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold text-black hover:brightness-105"
                style={{ background: GOLD }}>
                {t.transformBtn}
              </a>
            </div>
          </FadeIn>
        </section>

        {/* PACKAGES */}
        <section id="packages" className="py-14 sm:py-16">
          <FadeIn className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>{t.pkgLabel}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: dark ? "#fff" : "#111827" }}>{t.pkgTitle}</h2>
            <p className="mt-2 text-sm" style={{ color: textSub }}>{t.pkgSub}</p>
          </FadeIn>
          <div className="grid gap-5 lg:grid-cols-3">
            {t.packages.map((p, i) => (
              <FadeIn key={p.name} delay={0.07 * i} className="h-full">
                <article
                  className="relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300"
                  style={{ borderColor: p.highlight ? `${GOLD}45` : border, background: p.highlight ? "rgba(212,175,55,0.05)" : cardBg }}
                >
                  {p.highlight && <div className="pointer-events-none absolute inset-0 rounded-3xl" style={{ background: "radial-gradient(500px 180px at 50% 0%, rgba(212,175,55,0.12), transparent 60%)" }} />}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: dark ? "#fff" : "#111827" }}>{p.name}</h3>
                      <p className="mt-2 text-4xl font-bold" style={{ color: dark ? "#fff" : "#111827" }}>{p.price}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
                      style={p.highlight ? { borderColor: `${GOLD}40`, background: `${GOLD}15`, color: GOLD } : { borderColor: border, background: cardBg, color: textSub }}>
                      {p.badge}
                    </span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3 text-sm" style={{ color: textMid }}>
                    {p.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GOLD }} />
                        <span className="leading-6">{it}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <a href={p.stripeUrl} target="_blank" rel="noreferrer"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition hover:brightness-105"
                      style={p.highlight ? { background: GOLD, color: "#000", boxShadow: `0 0 0 1px rgba(212,175,55,0.35), 0 18px 60px rgba(212,175,55,0.20)` } : { border: `1px solid ${border}`, background: cardBg, color: textMain }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      {t.choosePkg}
                    </a>
                    <p className="mt-2 text-center text-[11px]" style={{ color: textSub }}>Secure payment via Stripe</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* GLOBAL REACH */}
        <section id="global" className="py-14 sm:py-16">
          <FadeIn>
            <div className="rounded-3xl border p-6 sm:p-8" style={{ borderColor: border, background: cardBg }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: dark ? "#fff" : "#111827" }}>Global Reach</h2>
                  <p className="mt-2 text-sm" style={{ color: textSub }}>International hiring expertise for the world's top markets.</p>
                </div>
                <p className="text-sm" style={{ color: textSub }}>Dubai-based. Global-ready.</p>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {[["AE","🇦🇪","GCC"],["EU","🇪🇺","Europe"],["CA","🇨🇦","Canada"],["SG","🇸🇬","Singapore"],["WW","🌍","Africa/Asia"]].map(([,icon,label]) => (
                  <div key={label} className="inline-flex items-center gap-2 rounded-full border px-3 py-2" style={{ borderColor: border, background: cardBg }}>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/30 text-lg">{icon}</span>
                    <span className="text-sm font-semibold" style={{ color: dark ? "#fff" : "#111827" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* PORTFOLIO */}
        <section id="portfolio" className="py-14 sm:py-16">
          <FadeIn className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>{t.portLabel}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: dark ? "#fff" : "#111827" }}>{t.portTitle}</h2>
            <p className="mt-2 text-sm" style={{ color: textSub }}>{t.portSub}</p>
          </FadeIn>
          <PortfolioSection t={t} openModal={(c) => setModal({ open: true, name: c.name, cat: c.cat, type: c.type, img: c.img, accent: c.accent })} dark={dark} />
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-14 sm:py-16">
          <FadeIn className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>{t.testLabel}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: dark ? "#fff" : "#111827" }}>{t.testTitle}</h2>
          </FadeIn>
          <FadeIn delay={0.05} className="mb-8 flex items-center gap-3">
            <Stars n={5} />
            <span className="text-sm font-semibold" style={{ color: dark ? "#fff" : "#111827" }}>5.0</span>
            <span className="text-xs" style={{ color: textSub }}>200+ verified reviews</span>
          </FadeIn>
          <TestimonialsCarousel testimonials={t.testimonials} dark={dark} />
        </section>

        {/* FAQ */}
        <section id="faq" className="py-14 sm:py-16">
          <FadeIn className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>{t.faqLabel}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: dark ? "#fff" : "#111827" }}>{t.faqTitle}</h2>
          </FadeIn>
          <div className="grid gap-3">
            {t.faqs.map((item, i) => (
              <FadeIn key={i} delay={0.04 * i}>
                <details className="group rounded-2xl border px-5 py-4 transition-colors duration-300" style={{ borderColor: border, background: cardBg }}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold" style={{ color: dark ? "#fff" : "#111827" }}>
                    <span>{item.q}</span>
                    <span className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: GOLD }}>+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6" style={{ color: textSub }}>{item.a}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-14 sm:py-16">
          <FadeIn>
            <div className="rounded-3xl border border-[#D4AF37]/25 p-8 text-center sm:p-12"
              style={{ background: dark ? "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(212,175,55,0.10), transparent 60%)" : "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(212,175,55,0.08), transparent 60%)" }}>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: dark ? "#fff" : "#111827" }}>{t.ctaTitle}</h2>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={wa(t.waStart)} target="_blank" rel="noreferrer"
                  className="inline-flex h-12 items-center rounded-full px-8 text-sm font-semibold text-black hover:brightness-105"
                  style={{ background: GOLD, boxShadow: `0 0 0 1px rgba(212,175,55,0.40), 0 18px 60px rgba(212,175,55,0.26)` }}>
                  {t.ctaBtn}
                </a>
                <a href="#portfolio" className="inline-flex h-12 items-center rounded-full border px-8 text-sm font-semibold transition hover:opacity-80"
                  style={{ borderColor: border, background: cardBg, color: textMain }}>
                  {t.cta2}
                </a>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* FOOTER */}
        <footer className="border-t py-10" style={{ borderColor: border }}>
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-start">
            <p className="text-sm" style={{ color: textSub }}>{t.footerLeft}</p>
            <p className="text-xs" style={{ color: dark ? "#52525b" : "#9ca3af" }}>{new Date().getFullYear()} — {t.footerRight}</p>
          </div>
        </footer>
      </main>

      <Modal state={modal} onClose={() => setModal((m) => ({ ...m, open: false }))} t={t} dark={dark} />

      <a href={wa(t.waUpgrade)} target="_blank" rel="noreferrer"
        className="fixed bottom-5 end-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full text-black hover:brightness-110"
        style={{ background: GOLD, boxShadow: `0 0 0 1px rgba(212,175,55,0.40), 0 20px 60px rgba(212,175,55,0.28)` }}
        aria-label="Chat on WhatsApp">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 22a10 10 0 0 0 8.66-15 10 10 0 0 0-16.9 10.6L3 22l4.56-.7A10 10 0 0 0 12 22Z" stroke="rgba(0,0,0,0.85)" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9.35 8.9c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3.1.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.2-.2-.3-.5-.4l-1.9-.9c-.2-.1-.4-.1-.6.1-.2.2-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.5c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.5l-.8-2Z" fill="rgba(0,0,0,0.85)" />
        </svg>
      </a>
    </div>
  );
}