// app/page.tsx — Zenith Dubai CV
"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Mail, X, Send, Loader2, CheckCircle, AlertCircle,
  Upload, FileText, ImageIcon, Trash2, CreditCard, ArrowRight, Globe, LayoutGrid,
} from "lucide-react";

// ── Tokens ─────────────────────────────────────────────────────────────────────
const G = "#C8A96E", GL = "#E2C98E", INK = "#0A0907", ASH = "#F5F1EB";
const WA = "971502879462", EM = "info@zenithdubaicv.com";
const LINKS = {
  basic:        "https://buy.stripe.com/test_eVq4gyeEe25R03d5GG0oM00",
  professional: "https://buy.stripe.com/test_aFa28q8fQcKv3fpglk0oM01",
  ultimate:     "https://buy.stripe.com/test_aFadR89jU6m75nx4CC0oM02",
};
const SUBS_EN = ["General Enquiry","Foundation Package","Growth Package","Executive Package"];
const SUBS_AR = ["استفسار عام","الباقة الأساسية","باقة النمو","الباقة التنفيذية"];
const SUBS_FR = ["Demande Générale","Forfait Fondation","Forfait Croissance","Forfait Exécutif"];
const PAGE_SIZE = 9;

// ── Language ───────────────────────────────────────────────────────────────────
type Lang = "en"|"ar"|"fr";
const LANGS: {code:Lang;label:string;dir:"ltr"|"rtl";font:string}[] = [
  {code:"en", label:"EN",      dir:"ltr", font:"'Georgia','Times New Roman',serif"},
  {code:"ar", label:"العربية", dir:"rtl", font:"'Noto Naskh Arabic','Arial',sans-serif"},
  {code:"fr", label:"FR",      dir:"ltr", font:"'Georgia','Times New Roman',serif"},
];

// ── Full translation dictionary ────────────────────────────────────────────────
const TX: Record<string,Record<Lang,string>> = {
  // Nav
  navServices:  {en:"Expertise",       ar:"خدماتنا",            fr:"Expertise"},
  navTemplates: {en:"Templates",       ar:"القوالب",            fr:"Modèles"},
  navMethod:    {en:"Process",         ar:"المنهجية",           fr:"Processus"},
  navPricing:   {en:"Investment",      ar:"الاستثمار",          fr:"Investissement"},
  navClients:   {en:"Results",         ar:"النتائج",            fr:"Résultats"},
  enquire:      {en:"Get Started",     ar:"ابدأ الآن",          fr:"Commencer"},
  // Hero
  eyebrow:      {en:"Executive Career Studio · Based in Dubai · Operating Globally",
                 ar:"استوديو التميّز المهني · مقره دبي · يعمل عالمياً",
                 fr:"Studio Carrière Exécutif · Basé à Dubaï · Présence Mondiale"},
  h1a:          {en:"Your Experience Deserves",        ar:"خبرتك تستحق",                    fr:"Votre Expérience Mérite"},
  h1b:          {en:"a Global Stage.",                 ar:"مسرحاً عالمياً.",                fr:"une Scène Mondiale."},
  heroSub:      {en:"We elevate the careers of ambitious professionals from the Gulf, Africa, and Asia — crafting authoritative profiles that unlock opportunities across North America, Europe, and the Gulf countries.",
                 ar:"نُرتقي بمسارات المحترفين الطموحين من الخليج وأفريقيا وآسيا — نصنع ملفات احترافية موثوقة تفتح الأبواب في أمريكا الشمالية وأوروبا ودول الخليج.",
                 fr:"Nous propulsons les carrières de professionnels ambitieux du Golfe, d'Afrique et d'Asie — créant des profils de référence qui ouvrent les portes en Amérique du Nord, en Europe et dans les pays du Golfe."},
  viewPkg:      {en:"Explore Packages",  ar:"استعرض الباقات",   fr:"Voir les Offres"},
  beginEnq:     {en:"Speak to an Expert",ar:"تحدّث مع خبير",    fr:"Parler à un Expert"},
  // Metrics
  mAts:         {en:"ATS Pass Rate",   ar:"معدل اجتياز الفلترة", fr:"Taux de Passage ATS"},
  mRate:        {en:"Interview Uplift", ar:"ارتفاع معدل المقابلات",fr:"Hausse des Entretiens"},
  mDraft:       {en:"Delivery Time",   ar:"وقت التسليم",         fr:"Délai de Livraison"},
  mTpl:         {en:"Premium Templates",ar:"قوالب متميزة",       fr:"Modèles Premium"},
  // Services
  svcEyebrow:   {en:"Our Disciplines", ar:"تخصصاتنا",           fr:"Nos Disciplines"},
  svcH2:        {en:"Three strategic disciplines. One decisive outcome.",
                 ar:"ثلاثة تخصصات استراتيجية. نتيجة واحدة حاسمة.",
                 fr:"Trois disciplines stratégiques. Un résultat décisif."},
  s1t: {en:"ATS Architecture",   ar:"هندسة الفلترة الآلية",  fr:"Architecture ATS"},
  s1b: {en:"Every keyword, format, and structural decision is reverse-engineered from the ATS logic used by top employers across the GCC, Europe, and North America — guaranteeing your document clears automated screening before any recruiter sees it.",
        ar:"كل كلمة مفتاحية وقرار تنسيقي يُعاد هندسته انطلاقاً من منطق الفلترة الآلية المعتمد لدى كبار أصحاب العمل في الخليج وأوروبا وأمريكا الشمالية — لضمان اجتياز وثيقتك للفرز الآلي قبل أن تصل إلى أي مُوظِّف.",
        fr:"Chaque mot-clé, format et décision structurelle est rétro-conçu à partir de la logique ATS utilisée par les meilleurs employeurs du CCG, d'Europe et d'Amérique du Nord — garantissant que votre document passe le tri automatisé avant tout recruteur."},
  s1tag:{en:"Mandatory for every digital application",ar:"ضروري لكل تقديم إلكتروني",fr:"Indispensable pour toute candidature numérique"},
  s2t: {en:"Executive-Grade Design",  ar:"التصميم التنفيذي الاحترافي", fr:"Design de Niveau Exécutif"},
  s2b: {en:"Visual hierarchy, typographic authority, and strategic white space — calibrated to your seniority level and your target market. Your document should command attention the moment it is opened.",
        ar:"هرمية بصرية وسلطة طباعية ومساحة بيضاء استراتيجية — معيارة وفق مستوى أقدميتك وسوقك المستهدف. يجب أن تستحوذ وثيقتك على الانتباه في اللحظة التي تُفتح فيها.",
        fr:"Hiérarchie visuelle, autorité typographique et espacement stratégique — calibrés selon votre niveau de séniorité et votre marché cible. Votre document doit capter l'attention dès qu'il est ouvert."},
  s2tag:{en:"Recommended from Director level and above",ar:"موصى به من مستوى المدير فما فوق",fr:"Recommandé à partir du niveau Directeur"},
  s3t: {en:"LinkedIn Profile Intelligence", ar:"تحسين ملف لينكد إن باحترافية", fr:"Intelligence de Profil LinkedIn"},
  s3b: {en:"Your LinkedIn profile, rebuilt with the keyword density, authority signals, and search-optimised narrative that places you in front of recruiters actively hiring across the GCC, Europe, APAC, and North America.",
        ar:"يُعاد بناء ملفك على لينكد إن بكثافة الكلمات المفتاحية وإشارات السلطة والسرد المُحسَّن للبحث — ليضعك أمام المُوظِّفين النشطين في التوظيف عبر الخليج وأوروبا وآسيا وأمريكا الشمالية.",
        fr:"Votre profil LinkedIn, reconstruit avec la densité de mots-clés, les signaux d'autorité et le récit optimisé qui vous placent devant les recruteurs actifs dans le CCG, l'Europe, l'APAC et l'Amérique du Nord."},
  s3tag:{en:"Included in Growth & Executive packages",ar:"مشمول في باقتَي النمو والتنفيذية",fr:"Inclus dans les offres Croissance & Exécutif"},
  // Templates
  tplEyebrow:  {en:"Template Library",    ar:"مكتبة القوالب",      fr:"Bibliothèque de Modèles"},
  tplH2:       {en:"Designed to perform.", ar:"مصممة للأداء.",     fr:"Conçus pour performer."},
  tplDesc:     {en:"Every Zenith engagement unlocks access to our curated library of 500+ ATS-optimised templates — each engineered for a specific industry, seniority level, and target hiring market across Europe, North America, and the GCC.",
                ar:"كل تعاقد مع Zenith يفتح الوصول إلى مكتبتنا المنتقاة من أكثر من 500 قالب مُحسَّن لأنظمة ATS — كل منها مُصمَّم لقطاع محدد ومستوى أقدمية وسوق توظيف مستهدف في أوروبا وأمريكا الشمالية ودول الخليج.",
                fr:"Chaque engagement avec Zenith débloque l'accès à notre bibliothèque de 500+ modèles optimisés ATS — chacun conçu pour un secteur, un niveau de séniorité et un marché cible spécifiques en Europe, Amérique du Nord et CCG."},
  tplBadge:    {en:"Market-Specific Designs",ar:"تصاميم مخصصة للسوق",fr:"Designs Spécifiques au Marché"},
  tplGet:      {en:"Request This Template", ar:"اطلب هذا القالب",  fr:"Demander ce Modèle"},
  tplMore:     {en:"View More Designs",     ar:"عرض المزيد",        fr:"Voir Plus"},
  tplDone:     {en:"All showcase designs displayed · Contact us for full 500+ library access",
                ar:"تم عرض جميع تصاميم العرض · تواصل معنا للوصول الكامل لمكتبة +500",
                fr:"Tous les modèles affichés · Contactez-nous pour l'accès complet 500+"},
  // Global
  glbEyebrow:  {en:"Based in Dubai. Built for the World.",ar:"مقره دبي. مبني للعالم.",fr:"Basé à Dubaï. Construit pour le Monde."},
  glbH2a:      {en:"Dubai is our base.",  ar:"دبي قاعدتنا.",    fr:"Dubaï est notre base."},
  glbH2b:      {en:"The world is our market.",ar:"العالم سوقنا.", fr:"Le monde est notre marché."},
  glbBody:     {en:"Headquartered in Dubai and active across every major hiring market, we work with professionals from the Gulf, Africa, and Asia to build career profiles that are truly competitive — calibrated to the exact standards of North America, Europe, and the wider Gulf region. We don't simply write CVs. We reframe your experience in the language that international decision-makers act on.",
                ar:"مقرّنا دبي ونعمل عبر كل الأسواق الرائدة في التوظيف — نتعاون مع المحترفين في الخليج وأفريقيا وآسيا لبناء ملفات مهنية تنافسية حقاً، معايَرة وفق المعايير الدقيقة لأمريكا الشمالية وأوروبا ومنطقة الخليج الأوسع. لا نكتب السيَر الذاتية فحسب — بل نُعيد صياغة خبرتك بلغة تُحرّك صانعي القرار الدوليين.",
                fr:"Basé à Dubaï et actif sur tous les marchés d'emploi majeurs, nous accompagnons des professionnels du Golfe, d'Afrique et d'Asie pour construire des profils véritablement compétitifs — calibrés aux standards exacts de l'Amérique du Nord, de l'Europe et de la région du Golfe. Nous ne rédigeons pas simplement des CV. Nous reformulons votre expérience dans le langage que les décideurs internationaux prennent au sérieux."},
  glb1t: {en:"Market-Specific Calibration", ar:"معايرة لكل سوق على حدة",  fr:"Calibrage Spécifique au Marché"},
  glb1b: {en:"Hiring norms differ fundamentally between the GCC, North America, and Europe — in tone, structure, length, and cultural expectation. We engineer each document to the precise standards of your target market, not a generic international template.",
          ar:"تختلف معايير التوظيف اختلافاً جوهرياً بين الخليج وأمريكا الشمالية وأوروبا — في النبرة والهيكل والطول والتوقعات الثقافية. نهندس كل وثيقة وفق المعايير الدقيقة لسوقك المستهدف، لا قالباً عالمياً عاماً.",
          fr:"Les normes de recrutement diffèrent fondamentalement entre le CCG, l'Amérique du Nord et l'Europe — en ton, structure, longueur et attente culturelle. Nous concevons chaque document selon les standards précis de votre marché cible, non un modèle international générique."},
  glb2t: {en:"Dual-Market Positioning",ar:"التموضع في سوقين",    fr:"Positionnement Double Marché"},
  glb2b: {en:"A single engagement delivers documents simultaneously calibrated for two distinct geographic markets — giving you the flexibility to pursue the best opportunity, wherever it emerges.",
          ar:"تعاقد واحد يُنتج وثائق معايَرة في آنٍ واحد لسوقين جغرافيين مستقلين — مما يمنحك المرونة لملاحقة أفضل الفرص أينما ظهرت.",
          fr:"Un seul engagement produit des documents calibrés simultanément pour deux marchés géographiques distincts — vous offrant la flexibilité de saisir la meilleure opportunité, où qu'elle se présente."},
  glb3t: {en:"Multi-Language Delivery", ar:"التسليم متعدد اللغات", fr:"Livraison Multilingue"},
  glb3b: {en:"Growth and Executive packages include full versions in English, French, German, Arabic, and Spanish — at no additional cost. No market is out of reach.",
          ar:"تشمل باقتا النمو والتنفيذية نسخاً كاملة بالإنجليزية والفرنسية والألمانية والعربية والإسبانية — دون تكلفة إضافية. لا يوجد سوق بعيد المنال.",
          fr:"Les offres Croissance et Exécutif incluent des versions complètes en anglais, français, allemand, arabe et espagnol — sans frais supplémentaires. Aucun marché n'est hors de portée."},
  // Process
  procEyebrow: {en:"How It Works",     ar:"كيف يعمل",           fr:"Comment Ça Marche"},
  procH2:      {en:"A rigorous process. Delivered in 48 hours.",
                ar:"منهجية صارمة. تُسلَّم في 48 ساعة.",
                fr:"Un processus rigoureux. Livré en 48 heures."},
  p1t:{en:"Select",        ar:"الاختيار",   fr:"Choisir"},
  p1b:{en:"Choose the package that matches your career stage and complete a secure payment in minutes.",
       ar:"اختر الباقة التي تتناسب مع مرحلتك المهنية وأتمّ الدفع الآمن في دقائق.",
       fr:"Choisissez le forfait adapté à votre étape de carrière et effectuez un paiement sécurisé en quelques minutes."},
  p2t:{en:"Brief",         ar:"الإحاطة",    fr:"Briefing"},
  p2b:{en:"Share your career background, target markets, and objectives via our intake form, WhatsApp, or email — whichever is most convenient for you.",
       ar:"شارك خلفيتك المهنية وأسواقك المستهدفة وأهدافك عبر نموذج الاستقبال أو واتساب أو البريد الإلكتروني — أيّها أنسب لك.",
       fr:"Partagez votre parcours, vos marchés cibles et vos objectifs via notre formulaire, WhatsApp ou email — selon ce qui vous convient le mieux."},
  p3t:{en:"Engineer",      ar:"الهندسة",    fr:"Conception"},
  p3b:{en:"Your dedicated career document specialist architects every element of your profile within 48 hours.",
       ar:"يُصمّم متخصصك المخصص في وثائق المسار المهني كل عنصر من ملفك خلال 48 ساعة.",
       fr:"Votre spécialiste dédié en documents de carrière conçoit chaque élément de votre profil en 48 heures."},
  p4t:{en:"Refine",        ar:"التحسين",    fr:"Affiner"},
  p4b:{en:"Unlimited revision rounds until every word, format, and strategic nuance meets your full satisfaction.",
       ar:"جولات مراجعة غير محدودة حتى تُستوفى كل كلمة وتنسيق وفارق استراتيجي دقيق وفق رضاك الكامل.",
       fr:"Révisions illimitées jusqu'à ce que chaque mot, format et nuance stratégique réponde pleinement à vos attentes."},
  // Pricing
  prcEyebrow:  {en:"Investment Tiers",   ar:"مستويات الاستثمار",  fr:"Niveaux d'Investissement"},
  prcH2:       {en:"Three tiers. One uncompromising standard.",
                ar:"ثلاثة مستويات. معيار واحد لا تهاون فيه.",
                fr:"Trois niveaux. Une norme sans compromis."},
  prcNote:     {en:"All prices in UAE Dirhams. Payments are processed securely via Stripe.",
                ar:"جميع الأسعار بالدرهم الإماراتي. تتم معالجة المدفوعات بأمان عبر Stripe.",
                fr:"Tous les prix en Dirhams émiratis. Les paiements sont traités de manière sécurisée via Stripe."},
  prcMostSel:  {en:"Most Popular",       ar:"الأكثر اختياراً",    fr:"Le Plus Populaire"},
  prcBegin:    {en:"Get Started",        ar:"ابدأ الآن",           fr:"Commencer"},
  prcApplePay: {en:"Get Started · Apple Pay", ar:"ابدأ الآن · Apple Pay", fr:"Commencer · Apple Pay"},
  prcStripe:   {en:"Secured by Stripe",  ar:"مؤمَّن بـ Stripe",   fr:"Sécurisé par Stripe"},
  // Foundation
  pF:    {en:"Foundation",   ar:"الأساسية",   fr:"Fondation"},
  pFsub: {en:"Precise. ATS-ready. Results-driven.",ar:"دقيق. جاهز للفلترة. موجَّه للنتائج.",fr:"Précis. Prêt pour l'ATS. Axé sur les résultats."},
  pFi1:  {en:"ATS-optimised CV, built to pass automated screening",
          ar:"سيرة ذاتية مُحسَّنة لـ ATS، مبنية لاجتياز الفرز الآلي",
          fr:"CV optimisé ATS, conçu pour passer le tri automatisé"},
  pFi2:  {en:"Targeted cover letter aligned to your role and market",
          ar:"خطاب تغطية مستهدف يتوافق مع دورك وسوقك",
          fr:"Lettre de motivation ciblée alignée sur votre poste et marché"},
  pFi3:  {en:"Professional photo enhancement via AI retouching",
          ar:"تحسين الصورة الاحترافية عبر المعالجة بالذكاء الاصطناعي",
          fr:"Amélioration de photo professionnelle par retouche IA"},
  pFi4:  {en:"Full access to the 500+ premium template library",
          ar:"وصول كامل لمكتبة القوالب المتميزة +500",
          fr:"Accès complet à la bibliothèque de 500+ modèles premium"},
  // Growth
  pG:    {en:"Growth",        ar:"النمو",      fr:"Croissance"},
  pGsub: {en:"Multi-market. Complete. Career-defining.",
          ar:"متعدد الأسواق. مكتمل. محوري في المسيرة المهنية.",
          fr:"Multi-marché. Complet. Déterminant pour la carrière."},
  pGi1:  {en:"ATS-optimised CV with executive-grade visual design",
          ar:"سيرة ذاتية مُحسَّنة لـ ATS بتصميم بصري تنفيذي",
          fr:"CV optimisé ATS avec design visuel de niveau exécutif"},
  pGi2:  {en:"Full LinkedIn profile rebuild with recruiter-visibility optimisation",
          ar:"إعادة بناء كاملة لملف لينكد إن مع تحسين الظهور أمام المُوظِّفين",
          fr:"Reconstruction complète du profil LinkedIn avec optimisation de visibilité recruteurs"},
  pGi3:  {en:"International career strategy guide tailored to your targets",
          ar:"دليل استراتيجية المسار الدولي مُصمَّم وفق أهدافك",
          fr:"Guide de stratégie de carrière internationale adapté à vos objectifs"},
  pGi4:  {en:"Full document versions in EN, FR, DE, AR, and ES",
          ar:"نسخ كاملة من الوثائق بالإنجليزية والفرنسية والألمانية والعربية والإسبانية",
          fr:"Versions complètes en EN, FR, DE, AR et ES"},
  pGi5:  {en:"Full access to the 500+ premium template library",
          ar:"وصول كامل لمكتبة القوالب المتميزة +500",
          fr:"Accès complet à la bibliothèque de 500+ modèles premium"},
  // Executive
  pE:    {en:"Executive",     ar:"التنفيذية",  fr:"Exécutif"},
  pEsub: {en:"White-glove. Strategic. Comprehensive.",
          ar:"احترافي. استراتيجي. شامل.",
          fr:"Gants blancs. Stratégique. Complet."},
  pEi1:  {en:"All Growth package deliverables included",
          ar:"جميع مخرجات باقة النمو مشمولة",
          fr:"Tous les livrables de l'offre Croissance inclus"},
  pEi2:  {en:"60-minute 1-on-1 interview coaching with a senior consultant",
          ar:"تدريب مقابلات فردي لمدة 60 دقيقة مع مستشار أول",
          fr:"Coaching entretien individuel de 60 min avec un consultant senior"},
  pEi3:  {en:"Personal career narrative strategy session",
          ar:"جلسة استراتيجية لبناء السرد المهني الشخصي",
          fr:"Session de stratégie narrative de carrière personnelle"},
  pEi4:  {en:"30-day priority access to your dedicated consultant",
          ar:"وصول أولوية لمدة 30 يوماً إلى مستشارك المخصص",
          fr:"Accès prioritaire pendant 30 jours à votre consultant dédié"},
  pEi5:  {en:"Full access to the 500+ premium template library",
          ar:"وصول كامل لمكتبة القوالب المتميزة +500",
          fr:"Accès complet à la bibliothèque de 500+ modèles premium"},
  // Testimonials
  tmEyebrow:   {en:"Verified Outcomes",  ar:"نتائج موثّقة",       fr:"Résultats Vérifiés"},
  tmH2a:       {en:"Measured results,",  ar:"نتائج قابلة للقياس،",fr:"Résultats mesurables,"},
  tmH2b:       {en:"not testimonials.",  ar:"لا مجرد شهادات.",    fr:"pas des témoignages."},
  tmStars:     {en:"5.0 · 7,000+ verified client engagements", ar:"5.0 · أكثر من 7,000 تعاقد موثّق مع عملاء", fr:"5.0 · 7 000+ engagements clients vérifiés"},
  // CTA
  ctaH2a:      {en:"Your next role",         ar:"منصبك القادم",      fr:"Votre prochain poste"},
  ctaH2b:      {en:"starts here.",           ar:"يبدأ هنا.",          fr:"commence ici."},
  ctaBody:     {en:"Over 7,000 professionals from 40+ nationalities have used Zenith to secure roles across six continents. Each one made a deliberate decision to stop applying and start positioning.",
                ar:"استعان أكثر من 7,000 محترف من أكثر من 40 جنسية بـ Zenith لتأمين مناصب عبر ستة قارات. اتخذ كل واحد منهم قراراً واعياً بالتوقف عن التقديم والبدء في التموضع.",
                fr:"Plus de 7 000 professionnels de plus de 40 nationalités ont utilisé Zenith pour décrocher des postes sur six continents. Chacun a pris la décision délibérée d'arrêter de postuler et de commencer à se positionner."},
  startWA:     {en:"Start on WhatsApp",      ar:"ابدأ على واتساب",   fr:"Démarrer sur WhatsApp"},
  sendEnq:     {en:"Get Your Profile Reviewed", ar:"احصل على مراجعة ملفك", fr:"Faites Évaluer Votre Profil"},
  // Footer
  tagline:     {en:"Based in Dubai · Careers Placed Globally",
                ar:"مقره دبي · مسارات مهنية تُوظَّف عالمياً",
                fr:"Basé à Dubaï · Carrières Placées Mondialement"},
  footerWA:    {en:"WhatsApp",               ar:"واتساب",             fr:"WhatsApp"},
  // Modal / form
  frmEmail:    {en:"Your Email Address",     ar:"عنوان بريدك الإلكتروني",  fr:"Votre Adresse E-mail"},
  frmSubject:  {en:"Subject",               ar:"الموضوع",             fr:"Sujet"},
  frmMessage:  {en:"Your Message",          ar:"رسالتك",              fr:"Votre Message"},
  frmAttach:   {en:"Attachments",           ar:"المرفقات",            fr:"Pièces jointes"},
  frmOptional: {en:"— optional",            ar:"— اختياري",           fr:"— facultatif"},
  frmPhoto:    {en:"Profile Photo",         ar:"صورة الملف الشخصي",   fr:"Photo de profil"},
  frmPhotoH:   {en:"JPG · PNG · WEBP · max 5 MB", ar:"JPG · PNG · WEBP · الحد الأقصى 5 ميغابايت", fr:"JPG · PNG · WEBP · max 5 Mo"},
  frmCv:       {en:"Current CV",            ar:"السيرة الذاتية الحالية",fr:"CV Actuel"},
  frmCvH:      {en:"PDF · DOC · DOCX · max 5 MB", ar:"PDF · DOC · DOCX · الحد الأقصى 5 ميغابايت", fr:"PDF · DOC · DOCX · max 5 Mo"},
  frmDrop:     {en:"Click or drop file here", ar:"انقر أو اسحب الملف هنا", fr:"Cliquer ou déposer le fichier ici"},
  frmSending:  {en:"Sending",               ar:"جارٍ الإرسال",        fr:"Envoi en cours"},
  frmRetry:    {en:"Retry",                 ar:"إعادة المحاولة",      fr:"Réessayer"},
  frmReceived: {en:"Message received.",     ar:"تم استلام رسالتك.",    fr:"Message reçu."},
  frmReply:    {en:"We will respond to",    ar:"سنرد على",            fr:"Nous répondrons à"},
  frmHours:    {en:"within 24 hours.",      ar:"خلال 24 ساعة.",        fr:"dans les 24 heures."},
  frmClose:    {en:"Close",                 ar:"إغلاق",               fr:"Fermer"},
  frmErrNet:   {en:"Network error — please reach us via WhatsApp.", ar:"خطأ في الشبكة — يرجى التواصل عبر واتساب.", fr:"Erreur réseau — contactez-nous via WhatsApp."},
  frmErrGen:   {en:"Something went wrong. Please try again.", ar:"حدث خطأ ما. يرجى المحاولة مجدداً.", fr:"Une erreur s'est produite. Veuillez réessayer."},
  // Template card badges
  tplAts:      {en:"ATS ✓",                ar:"ATS ✓",               fr:"ATS ✓"},
  tplDesign:   {en:"Design ✦",             ar:"تصميم ✦",             fr:"Design ✦"},
  tplPreview:  {en:"Preview Full Template", ar:"معاينة القالب كاملاً", fr:"Aperçu Complet"},
  tplEnquire:  {en:"Enquire About This Template", ar:"استفسر عن هذا القالب", fr:"Demander ce Modèle"},
  tplClose:    {en:"Close",                ar:"إغلاق",               fr:"Fermer"},
  // Global section connector (TX dict only — not used directly in JSX)
  glbConnector:{en:"The world is our",     ar:"العالم هو",            fr:"Le monde est notre"},
};
const tr = (k:string, l:Lang):string => TX[k]?.[l] ?? TX[k]?.en ?? k;

// ── Types ──────────────────────────────────────────────────────────────────────
type Fm = {email:string;subject:string;message:string;photo:File|null;cv:File|null};
type St  = "idle"|"sending"|"success"|"error";

// ── Template data — 33 items ───────────────────────────────────────────────────
const TEMPLATES = [
  {id:1,  ats:true,  name:"The DIFC Leadership",       ind:"Finance · Banking",          reg:"Dubai · London · New York"},
  {id:2,  ats:true,  name:"Urban Tech Professional",   ind:"Technology · Engineering",   reg:"GCC · Singapore · Toronto"},
  {id:3,  ats:false, name:"Editorial Creative",        ind:"Design · Media · Marketing", reg:"Europe · UK · Australia"},
  {id:4,  ats:true,  name:"The Toronto Executive",     ind:"Operations · Consulting",    reg:"Canada · USA · UK"},
  {id:5,  ats:true,  name:"Global Minimalist",         ind:"Engineering · IT",           reg:"Americas · APAC"},
  {id:6,  ats:true,  name:"African Enterprise",        ind:"Sales · Management",         reg:"GCC · Africa · Europe"},
  {id:7,  ats:false, name:"Singapore Tech Expert",     ind:"Technology · Data Science",  reg:"Singapore · APAC · USA"},
  {id:8,  ats:true,  name:"Paris Creative",            ind:"Creative · Marketing",       reg:"France · EU · Canada"},
  {id:9,  ats:true,  name:"Riyadh C-Suite",            ind:"Finance · Executive",        reg:"KSA · GCC · London"},
  {id:10, ats:true,  name:"London Financial",          ind:"Finance · Fintech",          reg:"UK · Europe · Dubai"},
  {id:11, ats:true,  name:"Mumbai Corporate",          ind:"Operations · HR",            reg:"India · GCC · Singapore"},
  {id:12, ats:true,  name:"New York Banking",          ind:"Investment Banking",         reg:"USA · Canada · London"},
  {id:13, ats:false, name:"Amsterdam Innovation",      ind:"Product · UX · Design",     reg:"Netherlands · EU · Remote"},
  {id:14, ats:true,  name:"Sydney Modern",             ind:"Healthcare · Research",      reg:"Australia · NZ · Canada"},
  {id:15, ats:false, name:"Dubai Hospitality Elite",   ind:"Hospitality · Tourism",     reg:"UAE · GCC · Maldives"},
  {id:16, ats:true,  name:"Lagos Rising",              ind:"Business · Entrepreneurship",reg:"Nigeria · UK · USA"},
  {id:17, ats:true,  name:"Nairobi Leadership",        ind:"NGO · Development",          reg:"Kenya · East Africa · UN"},
  {id:18, ats:true,  name:"Frankfurt Banking",         ind:"Finance · Insurance",        reg:"Germany · EU · Switzerland"},
  {id:19, ats:true,  name:"Beirut Medical",            ind:"Healthcare · Medicine",      reg:"Lebanon · GCC · EU"},
  {id:20, ats:true,  name:"Cairo Engineering",         ind:"Civil · Infrastructure",    reg:"Egypt · GCC · Europe"},
  {id:21, ats:false, name:"Kuala Lumpur Digital",      ind:"Digital · E-Commerce",      reg:"Malaysia · ASEAN · Australia"},
  {id:22, ats:true,  name:"Hong Kong Finance",         ind:"Asset Management",           reg:"HK · Singapore · London"},
  {id:23, ats:true,  name:"Doha Energy Leader",        ind:"Oil & Gas · Energy",        reg:"Qatar · GCC · USA"},
  {id:24, ats:true,  name:"Brussels Policy",           ind:"Law · Policy · EU Affairs", reg:"Belgium · EU · Geneva"},
  {id:25, ats:true,  name:"Johannesburg Executive",    ind:"Mining · Resources",         reg:"South Africa · GCC · London"},
  {id:26, ats:true,  name:"Geneva International",      ind:"Diplomacy · International",  reg:"Switzerland · UN · Global"},
  {id:27, ats:false, name:"Jakarta Tech Startup",      ind:"Technology · Startup",      reg:"Indonesia · ASEAN · Remote"},
  {id:28, ats:true,  name:"Casablanca Professional",   ind:"Finance · Consulting",      reg:"Morocco · France · GCC"},
  {id:29, ats:true,  name:"Abu Dhabi Government",      ind:"Public Sector · Policy",    reg:"UAE · GCC · International"},
  {id:30, ats:false, name:"Seoul Innovation",          ind:"Technology · R&D",          reg:"South Korea · Japan · USA"},
  {id:31, ats:true,  name:"Mexico City Operations",    ind:"Supply Chain · Logistics",  reg:"Mexico · USA · Latin America"},
  {id:32, ats:true,  name:"Accra Global",              ind:"Development · Finance",     reg:"Ghana · UK · EU"},
  {id:33, ats:true,  name:"The Executive Portfolio",   ind:"C-Suite · Board Level",     reg:"Global · Any Market"},
];

// ── CV images: /public/templates-new/cv1.png … cv33.png ──────────────────────
// Files must be named cv1.png, cv2.png … cv33.png (no underscore) in /public/templates-new/

const TMS = [
  {name:"Sara Al-Rashidi",         role:"Finance Director",         co:"DIFC, Dubai",      ind:"Finance",    img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face", text:"Nine interview invitations in eleven days. Zenith understood the DIFC recruitment landscape at a level no previous service had come close to matching. The document did not just pass ATS — it opened conversations.", hl:"9 interviews · 11 days"},
  {name:"James Okafor",            role:"General Manager",          co:"Jumeirah Group",   ind:"Hospitality",img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face", text:"Three interviewers opened by complimenting the document before asking a single question. I secured the role and negotiated a package 28% above the initial offer. The positioning was transformative.", hl:"+28% on package"},
  {name:"Capt. Rashed Al-Bloushi", role:"Senior First Officer",     co:"Emirates",         ind:"Aviation",   img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face", text:"Aviation HR operates within highly specific technical standards. Zenith knew precisely what Emirates recruitment evaluates at each stage. I was on the shortlist within days of submission — which had never happened with previous applications.", hl:"Shortlisted in 4 days"},
  {name:"Marcus Vandenberg",       role:"VP Engineering",           co:"ADNOC, Abu Dhabi", ind:"Energy",     img:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=face", text:"Two competing offers from major energy companies within three weeks. My previous CV had been failing automated screening entirely. The Zenith document cleared every filter and reached decision-makers directly.", hl:"2 competing offers"},
  {name:"Priya Nair",              role:"Cloud Architect",          co:"Singapore",        ind:"Technology", img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=face", text:"My interview rate tripled. I accepted a Singapore-based offer at 40% above my previous compensation. Zenith repositioned me for the APAC technology market in a way that made immediate, measurable impact.", hl:"+40% total compensation"},
  {name:"Dr. Layla Al-Hosani",     role:"Head of Cardiology",       co:"SEHA, Abu Dhabi",  ind:"Healthcare", img:"https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=160&h=160&fit=crop&crop=face", text:"For the first time, my profile reflected the actual weight of my clinical experience. The executive design and precisely calibrated language secured my department leadership appointment within the month.", hl:"Department Head · 30 days"},
  {name:"Claire Beaumont",         role:"Private Banking Director", co:"DIFC, Dubai",      ind:"Finance",    img:"https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=160&h=160&fit=crop&crop=face", text:"Two of the most selective private banks in the DIFC reached out within four weeks. Zenith understood what wealth management recruiters are actually looking for — and built a document that spoke directly to that.", hl:"2 DIFC banks · 4 weeks"},
  {name:"Yousef Al-Qahtani",       role:"Operations Director",      co:"Aramco",           ind:"Energy",     img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&crop=face", text:"An internal promotion and an unsolicited external offer at 35% uplift — both within six weeks of the Zenith repositioning. The career narrative they constructed framed my experience in a way I had never been able to articulate myself.", hl:"+35% · dual offer"},
];
const IH: Record<string,string> = {Finance:"#B8962E",Hospitality:"#9A7A3A",Healthcare:"#4A8A6A",Energy:"#9A6A20",Technology:"#3A6A8A",Aviation:"#5A5090"};
const ROUTES = [
  {from:"Lagos · Nairobi · Cairo",          to:"London · Amsterdam · Paris",     label:"Africa → Europe"},
  {from:"Dubai · Riyadh · Doha",            to:"Toronto · New York · Boston",    label:"GCC → North America"},
  {from:"Mumbai · Karachi · Dhaka",         to:"London · Amsterdam · Frankfurt", label:"South Asia → Europe"},
  {from:"Manila · Jakarta · Kuala Lumpur",  to:"Dubai · Abu Dhabi · Doha",       label:"SE Asia → GCC"},
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const wl = (m:string) => `https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
const fb = (b:number) => b<1024?`${b}B`:b<1048576?`${(b/1024).toFixed(1)}KB`:`${(b/1048576).toFixed(1)}MB`;

// ── Rise — NO style prop allowed. Wrap in <div> for border/bg styles. ─────────
function Rise({children,d=0,y=24,className=""}:{children:React.ReactNode;d?:number;y?:number;className?:string}){
  return(
    <motion.div className={className}
      initial={{opacity:0,y}} whileInView={{opacity:1,y:0}}
      viewport={{once:true,margin:"-5% 0px"}}
      transition={{duration:1.1,ease:[0.16,1,0.3,1],delay:d}}>
      {children}
    </motion.div>
  );
}

// ── GlowCard ──────────────────────────────────────────────────────────────────
function GlowCard({color=G,children,className=""}:{color?:string;children:React.ReactNode;className?:string}){
  const ref = useRef<HTMLDivElement>(null);
  const ang = useRef(0), op = useRef(0), raf = useRef<number|null>(null);
  const lerp = (a:number,b:number,t:number)=>a+(b-a)*t;
  const onMove = useCallback((e:PointerEvent)=>{
    const el=ref.current; if(!el) return;
    const r=el.getBoundingClientRect();
    const dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2);
    if(Math.sqrt(dx*dx+dy*dy)>280) return;
    const tgt=Math.atan2(dy,dx)*(180/Math.PI);
    if(raf.current) cancelAnimationFrame(raf.current);
    const step=()=>{ ang.current=lerp(ang.current,tgt,0.12); el.style.setProperty("--ga",`${ang.current}deg`); if(Math.abs(ang.current-tgt)>0.5) raf.current=requestAnimationFrame(step); };
    raf.current=requestAnimationFrame(step);
  },[]);
  const onEnter=useCallback(()=>{ const el=ref.current; if(!el) return; const s=()=>{ op.current=lerp(op.current,1,0.14); el.style.setProperty("--go",String(op.current)); if(op.current<0.97) requestAnimationFrame(s); }; requestAnimationFrame(s); },[]);
  const onLeave=useCallback(()=>{ const el=ref.current; if(!el) return; const s=()=>{ op.current=lerp(op.current,0,0.10); el.style.setProperty("--go",String(op.current)); if(op.current>0.01) requestAnimationFrame(s); else el.style.setProperty("--go","0"); }; requestAnimationFrame(s); },[]);
  useEffect(()=>{ window.addEventListener("pointermove",onMove); return()=>{ window.removeEventListener("pointermove",onMove); if(raf.current) cancelAnimationFrame(raf.current); }; },[onMove]);
  return(
    <div ref={ref} className={`relative ${className}`} onPointerEnter={onEnter} onPointerLeave={onLeave}
      style={{"--gc":color,"--ga":"0deg","--go":"0"} as React.CSSProperties}>
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{padding:"1px",background:"conic-gradient(from var(--ga),transparent 0deg,var(--gc) 60deg,transparent 120deg)",WebkitMask:"linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",WebkitMaskComposite:"xor",maskComposite:"exclude",opacity:"var(--go)",borderRadius:"inherit",zIndex:1}}/>
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{boxShadow:"0 0 40px 12px var(--gc)",opacity:"calc(var(--go)*0.12)",zIndex:0,borderRadius:"inherit"}}/>
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}

// ── Upload Zone ────────────────────────────────────────────────────────────────
function UZ({label,hint,accept,Ic,file,onFile,onClear,dark,busy,dropLabel="Click or drop here"}:{label:string;hint:string;accept:string;Ic:React.ElementType;file:File|null;onFile:(f:File)=>void;onClear:()=>void;dark:boolean;busy:boolean;dropLabel?:string}){
  const inp=useRef<HTMLInputElement>(null);
  const [drag,setDrag]=useState(false);
  const s=dark?"#80746A":"#9A8E84", h=dark?"#EDE8E0":"#1A1410";
  return(
    <div>
      <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em]" style={{color:s}}>{label}</label>
      {file?(
        <div className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{borderColor:`${G}50`,background:dark?`${G}08`:`${G}05`}}>
          <Ic size={14} color={G} strokeWidth={1.5} className="shrink-0"/>
          <div className="min-w-0 flex-1"><p className="truncate text-xs" style={{color:h}}>{file.name}</p><p className="text-[10px]" style={{color:s}}>{fb(file.size)}</p></div>
          <button type="button" onClick={onClear} disabled={busy} className="opacity-30 hover:opacity-60 p-1" style={{color:s}}><Trash2 size={11}/></button>
        </div>
      ):(
        <div className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-5 text-center transition-all"
          style={{borderColor:drag?`${G}60`:dark?"rgba(255,255,255,0.10)":"rgba(0,0,0,0.10)"}}
          onClick={()=>!busy&&inp.current?.click()}
          onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
          onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)onFile(f);}}
          role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&inp.current?.click()}>
          <Upload size={13} color={drag?G:s} strokeWidth={1.5}/>
          <p className="text-xs" style={{color:drag?G:s}}>{dropLabel}</p>
          <p className="text-[10px] opacity-50" style={{color:s}}>{hint}</p>
        </div>
      )}
      <input ref={inp} type="file" accept={accept} className="hidden" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(f)onFile(f);}}/>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({open,onClose,dark,lang}:{open:boolean;onClose:()=>void;dark:boolean;lang:Lang}){
  const subs = lang==="ar"?SUBS_AR:lang==="fr"?SUBS_FR:SUBS_EN;
  const [form,setForm]=useState<Fm>({email:"",subject:subs[0],message:"",photo:null,cv:null});
  const [st,setSt]=useState<St>("idle");
  const [err,setErr]=useState("");
  const mbg=dark?"#0E0D0B":"#F8F4EF";
  const bd=dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";
  const h=dark?"#EDE8E0":"#1A1410", s=dark?"#80746A":"#9A8E84";
  const iS:React.CSSProperties={background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)",borderColor:dark?"rgba(255,255,255,0.09)":"rgba(0,0,0,0.09)",color:h,outline:"none"};
  async function submit(){
    if(!form.email.trim()||!form.message.trim()) return;
    setSt("sending"); setErr("");
    try{
      const fd=new FormData();
      fd.append("senderEmail",form.email.trim()); fd.append("subject",form.subject); fd.append("message",form.message.trim());
      if(form.photo) fd.append("photo",form.photo); if(form.cv) fd.append("cv",form.cv);
      const res=await fetch("/api/contact",{method:"POST",body:fd}); const d=await res.json();
      res.ok?setSt("success"):(setErr(d.error??tr("frmErrGen",lang)),setSt("error"));
    }catch{setErr(tr("frmErrNet",lang));setSt("error");}
  }
  function close(){onClose();setTimeout(()=>{setForm({email:"",subject:subs[0],message:"",photo:null,cv:null});setSt("idle");setErr("");},350);}
  const busy=st==="sending", can=!!form.email.trim()&&!!form.message.trim()&&!busy;
  return(
    <AnimatePresence>
      {open&&(
        <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-4 pt-8 sm:items-center">
          <motion.div className="absolute inset-0" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close} style={{background:"rgba(5,4,3,0.90)",backdropFilter:"blur(16px)"}}/>
          <motion.div className="relative w-full max-w-[420px] rounded-2xl overflow-hidden"
            initial={{opacity:0,y:20,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12}}
            transition={{duration:0.55,ease:[0.16,1,0.3,1]}}
            style={{background:mbg,border:`1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)"}`}}>
            <div className="h-px w-full" style={{background:`linear-gradient(90deg,transparent,${G}80,transparent)`}}/>
            <div className="flex items-center justify-between px-7 py-5 border-b" style={{borderColor:bd}}>
              <div><p className="text-[10px] font-medium uppercase tracking-[0.28em]" style={{color:G}}>{tr("enquire",lang)}</p><p className="mt-0.5 text-xs" style={{color:s}}>{EM}</p></div>
              <button type="button" onClick={close} className="opacity-25 hover:opacity-50 transition-opacity" style={{color:h}}><X size={15} strokeWidth={1.5}/></button>
            </div>
            <div className="overflow-y-auto px-7 py-6 flex flex-col gap-5" style={{maxHeight:"calc(100svh - 9rem)"}}>
              {st==="success"?(
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex flex-col items-center gap-4 py-10 text-center">
                  <div className="h-14 w-14 rounded-full flex items-center justify-center" style={{border:`1px solid ${G}40`,background:`${G}0C`}}><CheckCircle size={20} color={G} strokeWidth={1.5}/></div>
                  <div><p className="font-semibold" style={{color:h}}>{tr("frmReceived",lang)}</p><p className="mt-1 text-sm" style={{color:s}}>{tr("frmReply",lang)} <span style={{color:G}}>{form.email}</span> {tr("frmHours",lang)}</p></div>
                  <button type="button" onClick={close} className="mt-1 px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-80" style={{background:G,color:INK}}>{tr("frmClose",lang)}</button>
                </motion.div>
              ):(
                <>
                  {st==="error"&&<motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-start gap-3 rounded-xl px-4 py-3" style={{background:"rgba(180,50,50,0.07)",border:"1px solid rgba(180,50,50,0.15)"}}><AlertCircle size={12} className="mt-0.5 shrink-0" style={{color:"#B43232"}}/><p className="text-[11px]" style={{color:s}}>{err}</p></motion.div>}
                  <div><label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em]" style={{color:s}}>{tr("frmEmail",lang)}</label>
                    <input type="email" placeholder="name@company.com" value={form.email} disabled={busy} onChange={e=>setForm(p=>({...p,email:e.target.value}))} className="w-full rounded-xl border px-4 py-3 text-sm disabled:opacity-40 transition-all" style={iS} onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=`${G}60`;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=dark?"rgba(255,255,255,0.09)":"rgba(0,0,0,0.09)";}}/>
                  </div>
                  <div><label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em]" style={{color:s}}>{tr("frmSubject",lang)}</label>
                    <select value={form.subject} disabled={busy} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} className="w-full rounded-xl border px-4 py-3 text-sm appearance-none cursor-pointer disabled:opacity-40" style={{...iS,backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23C8A96E' stroke-width='1.3' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 1rem center"}} onFocus={e=>{(e.target as HTMLSelectElement).style.borderColor=`${G}60`;}} onBlur={e=>{(e.target as HTMLSelectElement).style.borderColor=dark?"rgba(255,255,255,0.09)":"rgba(0,0,0,0.09)";}}>
                      {subs.map(o=><option key={o} value={o} style={{background:dark?"#0E0D0B":"#F8F4EF",color:h}}>{o}</option>)}
                    </select>
                  </div>
                  <div><label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em]" style={{color:s}}>{tr("frmMessage",lang)}</label>
                    <textarea rows={4} disabled={busy} placeholder="Describe your current role, target market, and career objective…" value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} className="w-full rounded-xl border px-4 py-3 text-sm resize-none disabled:opacity-40 transition-all" style={iS} onFocus={e=>{(e.target as HTMLTextAreaElement).style.borderColor=`${G}60`;}} onBlur={e=>{(e.target as HTMLTextAreaElement).style.borderColor=dark?"rgba(255,255,255,0.09)":"rgba(0,0,0,0.09)";}}/>
                  </div>
                  <div className="h-px" style={{background:bd}}/>
                  <p className="text-[10px] uppercase tracking-[0.2em] -mb-1" style={{color:s}}>{tr("frmAttach",lang)} <span className="opacity-40">{tr("frmOptional",lang)}</span></p>
                  <UZ label={tr("frmPhoto",lang)} hint={tr("frmPhotoH",lang)} dropLabel={tr("frmDrop",lang)} accept="image/jpeg,image/png,image/webp" Ic={ImageIcon} file={form.photo} onFile={f=>setForm(p=>({...p,photo:f}))} onClear={()=>setForm(p=>({...p,photo:null}))} dark={dark} busy={busy}/>
                  <UZ label={tr("frmCv",lang)} hint={tr("frmCvH",lang)} dropLabel={tr("frmDrop",lang)} accept=".pdf,.doc,.docx" Ic={FileText} file={form.cv} onFile={f=>setForm(p=>({...p,cv:f}))} onClear={()=>setForm(p=>({...p,cv:null}))} dark={dark} busy={busy}/>
                  <button type="button" onClick={submit} disabled={!can} className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-medium tracking-wide transition-all hover:opacity-85 disabled:opacity-25 disabled:cursor-not-allowed" style={{background:G,color:INK}}>
                    {busy?<><Loader2 size={13} className="animate-spin"/>{tr("frmSending",lang)}</>:st==="error"?<><Send size={13}/>{tr("frmRetry",lang)}</>:<><Send size={13}/>{tr("sendEnq",lang)}</>}
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

// ── Testimonial card + column ──────────────────────────────────────────────────
function TC({t,dark}:{t:typeof TMS[0];dark:boolean}){
  const ac=IH[t.ind]??G;
  return(
    <div className="flex flex-col p-5 mb-4 rounded-xl" style={{background:dark?"rgba(255,255,255,0.025)":"rgba(255,255,255,0.85)",border:`1px solid ${dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)"}`}}>
      <p className="text-[11px] leading-[1.8] italic mb-4" style={{color:dark?"#ADA098":"#524840"}}>"{t.text}"</p>
      <div className="pt-3 flex items-center gap-3" style={{borderTop:`1px solid ${dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)"}`}}>
        <img src={t.img} alt={t.name} className="h-8 w-8 rounded-full object-cover" style={{filter:"grayscale(40%) contrast(1.05)"}}/>
        <div className="min-w-0 flex-1"><p className="text-[11px] font-semibold truncate" style={{color:dark?"#EDE8E0":"#1A1410"}}>{t.name}</p><p className="text-[10px] truncate" style={{color:dark?"#706860":"#9A8E84"}}>{t.role} · {t.co}</p></div>
        <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium" style={{background:`${ac}12`,color:ac,border:`1px solid ${ac}25`}}>{t.hl}</span>
      </div>
    </div>
  );
}
function TCol({items,dark,dur=55,rev=false}:{items:typeof TMS;dark:boolean;dur?:number;rev?:boolean}){
  const doubled=[...items,...items];
  return(
    <div className="overflow-hidden">
      <motion.div animate={{y:rev?["0%","50%"]:["0%","-50%"]}} transition={{duration:dur,ease:"linear",repeat:Infinity,repeatType:"loop"}}>
        {doubled.map((tm,i)=><TC key={`${tm.name}-${i}`} t={tm} dark={dark}/>)}
      </motion.div>
    </div>
  );
}

// ── Preview Lightbox — full scrollable template preview ───────────────────────
function PreviewLightbox({cv,onClose,onEnquire,dark,lang}:{
  cv:{id:number;name:string;ats:boolean};
  onClose:()=>void;
  onEnquire:()=>void;
  dark:boolean;
  lang:Lang;
}){
  const src = '/templates-new/cv' + cv.id + '.png';
  const [loaded,setLoaded]=useState(false);
  const [imgError,setImgError]=useState(false);
  // Close on Escape key
  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{ if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown",handler);
    document.body.style.overflow="hidden";
    return()=>{ window.removeEventListener("keydown",handler); document.body.style.overflow=""; };
  },[onClose]);
  const badgeBg = cv.ats ? `${G}15` : "rgba(120,100,160,0.10)";
  const badgeColor = cv.ats ? G : "#8A6AAA";
  const badgeBorder = cv.ats ? `1px solid ${G}30` : "1px solid rgba(120,100,160,0.22)";
  return(
    <AnimatePresence>
      <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          onClick={onClose}
          style={{background:"rgba(5,4,3,0.92)",backdropFilter:"blur(20px)"}}
        />
        {/* Panel */}
        <motion.div
          className="relative flex flex-col w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{maxHeight:"calc(100svh - 2rem)",background:dark?"#0E0D0B":"#F8F4EF",border:`1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)"}`}}
          initial={{opacity:0,y:24,scale:0.97}}
          animate={{opacity:1,y:0,scale:1}}
          exit={{opacity:0,y:16,scale:0.98}}
          transition={{duration:0.45,ease:[0.16,1,0.3,1]}}
        >
          {/* Gold top line */}
          <div className="h-px w-full shrink-0" style={{background:`linear-gradient(90deg,transparent,${G}80,transparent)`}}/>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{borderBottom:`1px solid ${dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)"}`}}>
            <div className="flex items-center gap-3 min-w-0">
              <h3 className="text-sm font-semibold truncate" style={{color:dark?"#EDE8E0":"#1A1410",fontFamily:"sans-serif"}}>{cv.name}</h3>
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium" style={{background:badgeBg,color:badgeColor,border:badgeBorder,fontFamily:"sans-serif"}}>
                {cv.ats ? "ATS ✓" : "Design ✦"}
              </span>
            </div>
            <button type="button" onClick={onClose} className="shrink-0 ml-3 opacity-25 hover:opacity-60 transition-opacity" style={{color:dark?"#EDE8E0":"#1A1410"}}>
              <X size={15} strokeWidth={1.5}/>
            </button>
          </div>
          {/* Scrollable image area */}
          <div className="flex-1 overflow-y-auto overscroll-contain" style={{WebkitOverflowScrolling:"touch" as React.CSSProperties["WebkitOverflowScrolling"]}}>
            {!imgError ? (
              <div className="relative">
                {!loaded && (
                  <div className="flex items-center justify-center" style={{height:"420px"}}>
                    <Loader2 size={20} color={G} className="animate-spin" strokeWidth={1.5}/>
                  </div>
                )}
                <img
                  src={src}
                  alt={cv.name}
                  className="w-full h-auto block"
                  style={{display:loaded?"block":"none",objectFit:"contain"}}
                  onLoad={()=>setLoaded(true)}
                  onError={()=>setImgError(true)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-20" style={{color:dark?"#706860":"#9A8E84"}}>
                <FileText size={36} strokeWidth={1} style={{opacity:0.3}}/>
                <p className="text-sm" style={{fontFamily:"sans-serif"}}>{cv.name}</p>
              </div>
            )}
          </div>
          {/* Footer CTA */}
          <div className="px-6 py-4 shrink-0 flex gap-3" style={{borderTop:`1px solid ${dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)"}`}}>
            <button type="button" onClick={()=>{onClose();onEnquire();}}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full text-[11px] font-medium tracking-[0.15em] uppercase transition-all hover:opacity-85"
              style={{background:G,color:INK,fontFamily:"sans-serif"}}>
              <Mail size={12} strokeWidth={2}/>{tr("tplEnquire",lang)}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 h-11 rounded-full text-[11px] font-medium tracking-[0.15em] uppercase transition-all hover:opacity-70"
              style={{border:`1px solid ${dark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.12)"}`,color:dark?"#706860":"#9A8E84",fontFamily:"sans-serif"}}>
              {tr("tplClose",lang)}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function Home(){
  const [dark,setDark]=useState(()=>{ if(typeof window==="undefined") return true; const s=localStorage.getItem("z-theme"); return s!==null?s==="dark":true; });
  const tog=()=>{const n=!dark;setDark(n);localStorage.setItem("z-theme",n?"dark":"light");};
  const [modal,setModal]=useState(false);
  const [lang,setLang]=useState<Lang>("en");
  const [langOpen,setLangOpen]=useState(false);
  const [visible,setVisible]=useState(PAGE_SIZE);
  const [preview,setPreview]=useState<{id:number;name:string;ats:boolean}|null>(null);

  const LG    = LANGS.find(l=>l.code===lang)!;
  const dir   = LG.dir;
  const font  = LG.font;
  const bg    = dark?INK:ASH;
  const hi    = dark?"#EDE8E0":"#1A1410";
  const sub   = dark?"#706860":"#9A8E84";
  const mid   = dark?"#ADA098":"#706050";
  const bdr   = dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";
  const card  = dark?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.90)";
  const nav   = dark?"rgba(10,9,7,0.93)":"rgba(245,241,235,0.93)";
  const cols  = [TMS.filter((_,i)=>i%3===0),TMS.filter((_,i)=>i%3===1),TMS.filter((_,i)=>i%3===2)];
  const wlMsg = wl("Hello. I would like to discuss my career positioning.");
  const shown = TEMPLATES.slice(0,visible);
  const hasMore = visible < TEMPLATES.length;

  const STEPS = [
    {n:"I",  t:tr("p1t",lang), b:tr("p1b",lang), Ic:CreditCard},
    {n:"II", t:tr("p2t",lang), b:tr("p2b",lang), Ic:FileText},
    {n:"III",t:tr("p3t",lang), b:tr("p3b",lang), Ic:Send},
    {n:"IV", t:tr("p4t",lang), b:tr("p4b",lang), Ic:CheckCircle},
  ];

  return(
    <div key={lang} className="min-h-screen w-full transition-colors duration-700" dir={dir} style={{background:bg,color:hi,fontFamily:font}}>
      {/* Grain */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022]" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",backgroundSize:"200px"}}/>
      {dark&&<div className="pointer-events-none fixed inset-0 -z-10" style={{background:`radial-gradient(ellipse 70% 50% at 50% -5%,${G}09,transparent 65%)`}}/>}

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 inset-x-0 z-50" style={{background:nav,borderBottom:`1px solid ${bdr}`,backdropFilter:"blur(24px)"}}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8" style={{height:"60px"}}>
          <div className="flex items-center">
            <img
              src="/images/logo.png"
              alt="Zenith Dubai CV"
              style={{
                height:"36px",
                width:"auto",
                objectFit:"contain",
                display:"block",
                filter: dark ? "invert(1) brightness(1.8)" : "none",
                transition:"filter 0.3s",
              }}
            />
          </div>
          <nav className="hidden md:flex items-center gap-9">
            {([["#services","navServices"],["#templates","navTemplates"],["#process","navMethod"],["#pricing","navPricing"],["#clients","navClients"]] as [string,string][]).map(([href,k])=>(
              <a key={href} href={href} className="text-[10px] font-medium tracking-[0.18em] uppercase opacity-40 hover:opacity-80 transition-opacity" style={{color:hi,fontFamily:"sans-serif"}}>{tr(k,lang)}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {/* Lang switcher */}
            <div className="relative">
              <button type="button" onClick={()=>setLangOpen(o=>!o)}
                className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.15em] uppercase px-3 rounded-full transition-all hover:opacity-80"
                style={{border:`1px solid ${G}35`,color:G,height:"32px",fontFamily:"sans-serif",minWidth:"58px",justifyContent:"center"}}>
                <Globe size={10} strokeWidth={1.5}/>{LG.label}
              </button>
              <AnimatePresence>
                {langOpen&&(
                  <motion.div initial={{opacity:0,y:-6,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-4,scale:0.98}} transition={{duration:0.2,ease:[0.16,1,0.3,1]}}
                    className="absolute top-10 right-0 rounded-xl overflow-hidden shadow-2xl z-50" style={{background:dark?"#141210":"#F5F1EB",border:`1px solid ${bdr}`,minWidth:"130px"}}>
                    {LANGS.map(l=>(
                      <button key={l.code} type="button" onClick={()=>{setLang(l.code);setLangOpen(false);}}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-[11px] transition-all hover:opacity-70 text-left"
                        style={{color:l.code===lang?G:hi,fontFamily:"sans-serif",background:l.code===lang?(dark?`${G}10`:`${G}08`):"transparent",fontWeight:l.code===lang?600:400}}>
                        {l.code===lang&&<span className="h-1 w-1 rounded-full shrink-0" style={{background:G}}/>}{l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button type="button" onClick={()=>setModal(true)}
              className="hidden sm:flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] uppercase px-5 rounded-full transition-all hover:opacity-80"
              style={{border:`1px solid ${G}45`,color:G,height:"32px",fontFamily:"sans-serif"}}>
              {tr("enquire",lang)}
            </button>
            <button type="button" onClick={tog} aria-label="Toggle theme"
              className="flex items-center justify-center rounded-full opacity-30 hover:opacity-60 transition-opacity"
              style={{border:`1px solid ${bdr}`,width:"32px",height:"32px"}}>
              {dark?<Sun size={12} color={hi} strokeWidth={1.5}/>:<Moon size={12} color={hi} strokeWidth={1.5}/>}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-[60px]">

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-8 text-center overflow-hidden">
          <motion.div className="absolute top-16 left-1/2 -translate-x-1/2 w-px" initial={{height:0,opacity:0}} animate={{height:80,opacity:1}} transition={{duration:2,ease:[0.16,1,0.3,1],delay:0.4}} style={{background:`linear-gradient(to bottom,transparent,${G}50,transparent)`}}/>
          <Rise d={0.3} y={36}><p className="text-[10px] font-medium tracking-[0.42em] uppercase mb-10" style={{color:G,fontFamily:"sans-serif"}}>{tr("eyebrow",lang)}</p></Rise>
          <Rise d={0.55} y={44}>
            <h1 className="text-5xl sm:text-6xl lg:text-[88px] font-normal leading-[1.04] tracking-[-0.025em] mb-7 mx-auto" style={{color:hi,maxWidth:"860px"}}>
              {tr("h1a",lang)}<br/><em style={{fontStyle:"italic",color:G}}>{tr("h1b",lang)}</em>
            </h1>
          </Rise>
          <Rise d={0.75} y={28}><p className="text-base sm:text-lg leading-[1.9] max-w-lg mb-14 mx-auto" style={{color:sub,fontFamily:"sans-serif",fontWeight:300}}>{tr("heroSub",lang)}</p></Rise>
          <Rise d={0.92} y={20}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#pricing" className="flex items-center gap-3 px-9 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-85" style={{background:G,color:INK,height:"52px",fontFamily:"sans-serif"}}>{tr("viewPkg",lang)} <ArrowRight size={13} strokeWidth={2}/></a>
              <button type="button" onClick={()=>setModal(true)} className="flex items-center gap-3 px-9 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-70" style={{border:`1px solid ${G}40`,color:G,height:"52px",fontFamily:"sans-serif"}}><Mail size={12} strokeWidth={1.5}/>{tr("beginEnq",lang)}</button>
            </div>
          </Rise>
          <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" initial={{opacity:0}} animate={{opacity:0.2}} transition={{delay:2.5,duration:1.5}}>
            <motion.div className="w-px h-10" style={{background:hi}} animate={{scaleY:[1,0,1],transformOrigin:"top"}} transition={{duration:2.4,repeat:Infinity,ease:"easeInOut"}}/>
          </motion.div>
        </section>

        {/* ══ METRICS ═══════════════════════════════════════════════════════ */}
        <section className="border-y" style={{borderColor:bdr}}>
          <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4">
            {([{n:"99.9%",k:"mAts"},{n:"3×",k:"mRate"},{n:"48h",k:"mDraft"},{n:"500+",k:"mTpl"}] as {n:string;k:string}[]).map(({n,k},i)=>(
              <div key={k} className="border-r last:border-r-0" style={{borderColor:bdr}}>
                <Rise d={0.07*i} className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <p className="text-3xl sm:text-4xl font-normal tracking-tight" style={{color:GL,fontFamily:"'Georgia',serif"}}>{n}</p>
                  <p className="mt-2 text-[10px] font-medium tracking-[0.22em] uppercase" style={{color:sub,fontFamily:"sans-serif"}}>{tr(k,lang)}</p>
                </Rise>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SERVICES ══════════════════════════════════════════════════════ */}
        <section id="services" className="py-32 px-8">
          <div className="mx-auto max-w-6xl">
            <Rise className="mb-20">
              <p className="text-[10px] font-medium tracking-[0.35em] uppercase mb-4" style={{color:G,fontFamily:"sans-serif"}}>{tr("svcEyebrow",lang)}</p>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight leading-snug" style={{color:hi}}>{tr("svcH2",lang)}</h2>
            </Rise>
            <div className="grid sm:grid-cols-3" style={{borderTop:`1px solid ${bdr}`}}>
              {([{t:"s1t",b:"s1b",tag:"s1tag",n:"01"},{t:"s2t",b:"s2b",tag:"s2tag",n:"02"},{t:"s3t",b:"s3b",tag:"s3tag",n:"03"}] as {t:string;b:string;tag:string;n:string}[]).map((s,i)=>(
                <div key={s.n} className="border-b border-r last:border-r-0" style={{borderColor:bdr}}>
                  <Rise d={0.1*i} className="p-10">
                    <p className="text-[10px] tracking-[0.3em] uppercase mb-8" style={{color:G,fontFamily:"sans-serif",opacity:0.7}}>{s.n}</p>
                    <h3 className="text-xl font-normal mb-5 tracking-tight leading-snug" style={{color:hi}}>{tr(s.t,lang)}</h3>
                    <p className="text-sm leading-[1.9] mb-8" style={{color:sub,fontFamily:"sans-serif",fontWeight:300}}>{tr(s.b,lang)}</p>
                    <p className="text-[10px] tracking-[0.1em] uppercase" style={{color:G,fontFamily:"sans-serif",opacity:0.55}}>{tr(s.tag,lang)}</p>
                  </Rise>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CV TEMPLATES ══════════════════════════════════════════════════ */}
        <section id="templates" className="py-32 px-8 border-t" style={{borderColor:bdr}}>
          <div className="mx-auto max-w-6xl">
            <Rise className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-[10px] font-medium tracking-[0.35em] uppercase mb-4" style={{color:G,fontFamily:"sans-serif"}}>{tr("tplEyebrow",lang)}</p>
                  <h2 className="text-3xl sm:text-4xl font-normal tracking-tight leading-snug" style={{color:hi}}><em style={{fontStyle:"italic",color:G}}>{tr("tplH2",lang)}</em></h2>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3 rounded-2xl px-5 py-3" style={{background:dark?`${G}0C`:`${G}08`,border:`1px solid ${G}30`}}>
                  <LayoutGrid size={16} color={G} strokeWidth={1.5}/>
                  <div><p className="text-base font-semibold leading-none" style={{color:G,fontFamily:"sans-serif"}}>500+</p><p className="text-[10px] mt-0.5" style={{color:sub,fontFamily:"sans-serif"}}>{tr("tplBadge",lang)}</p></div>
                </div>
              </div>
            </Rise>
            <Rise d={0.1} className="mb-16"><p className="text-sm leading-[1.9] max-w-3xl" style={{color:sub,fontFamily:"sans-serif",fontWeight:300}}>{tr("tplDesc",lang)}</p></Rise>

            {/* Template cards — 3-column responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <AnimatePresence initial={false}>
                {shown.map((cv,i)=>(
                  <motion.div key={cv.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.55,ease:[0.16,1,0.3,1],delay:(i%PAGE_SIZE)*0.04}}>
                    <GlowCard color={G} className="rounded-2xl h-full">
                      <div className="rounded-2xl overflow-hidden h-full flex flex-col" style={{background:card,border:`1px solid ${bdr}`}}>
                        <div
                          className="relative overflow-hidden cursor-pointer"
                          style={{height:"280px",background:dark?"rgba(200,169,110,0.05)":"rgba(200,169,110,0.06)"}}
                          onClick={()=>setPreview({id:cv.id,name:cv.name,ats:cv.ats})}
                          title={tr("tplPreview",lang)}
                        >
                          <img
                            key={lang + cv.id}
                            src={'/templates-new/cv' + cv.id + '.png'}
                            alt={cv.name}
                            loading="lazy"
                            className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                            style={{filter:dark?"brightness(0.92) contrast(1.05)":"none",display:"block"}}
                            onError={(e)=>{
                              const img = e.currentTarget;
                              img.style.display = "none";
                              const p = img.parentElement;
                              if(p){
                                p.style.cssText = "height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:24px;cursor:pointer";
                                const icon = document.createElement("div");
                                icon.textContent = "📄";
                                icon.style.cssText = "font-size:36px;opacity:0.2";
                                const title = document.createElement("p");
                                title.textContent = cv.name;
                                title.style.cssText = `font-size:12px;color:${G};font-family:sans-serif;text-align:center;opacity:0.8;font-weight:600`;
                                const sub = document.createElement("p");
                                sub.textContent = cv.ind;
                                sub.style.cssText = "font-size:10px;color:#9A8E84;font-family:sans-serif;text-align:center";
                                p.appendChild(icon); p.appendChild(title); p.appendChild(sub);
                              }
                            }}
                          />
                          {/* Hover overlay — Preview prompt */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300" style={{background:"rgba(10,9,7,0.70)"}}>
                            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{background:`${G}20`,border:`1px solid ${G}50`}}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                            </div>
                            <p className="text-[10px] font-medium tracking-[0.18em] uppercase" style={{color:G,fontFamily:"sans-serif"}}>{tr("tplPreview",lang)}</p>
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-sm font-semibold leading-tight" style={{color:hi,fontFamily:"sans-serif"}}>{cv.name}</h3>
                            {cv.ats
                              ? <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium mt-0.5" style={{background:`${G}15`,color:G,border:`1px solid ${G}30`,fontFamily:"sans-serif"}}>{tr("tplAts",lang)}</span>
                              : <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium mt-0.5" style={{background:"rgba(120,100,160,0.10)",color:"#8A6AAA",border:"1px solid rgba(120,100,160,0.22)",fontFamily:"sans-serif"}}>{tr("tplDesign",lang)}</span>
                            }
                          </div>
                          <p className="text-[11px] mb-1" style={{color:sub,fontFamily:"sans-serif"}}>{cv.ind}</p>
                          <p className="text-[10px] mb-3" style={{color:sub,fontFamily:"sans-serif",opacity:0.7}}>{cv.reg}</p>
                          <button type="button" onClick={()=>setModal(true)}
                            className="mt-auto w-full py-2 rounded-xl text-[10px] font-medium tracking-[0.15em] uppercase transition-all hover:opacity-80"
                            style={{border:`1px solid ${G}35`,color:G,fontFamily:"sans-serif"}}>
                            {tr("tplGet",lang)}
                          </button>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load more / done */}
            <div className="text-center">
              {hasMore?(
                <button type="button" onClick={()=>setVisible(n=>Math.min(n+PAGE_SIZE,TEMPLATES.length))}
                  className="inline-flex items-center gap-3 px-8 text-[11px] font-medium tracking-[0.18em] uppercase rounded-full transition-all hover:opacity-80"
                  style={{border:`1px solid ${G}40`,color:G,height:"50px",fontFamily:"sans-serif"}}>
                  <LayoutGrid size={13} strokeWidth={1.5}/>{tr("tplMore",lang)}<ArrowRight size={12} strokeWidth={2}/>
                </button>
              ):(
                <Rise>
                  <button type="button" onClick={()=>setModal(true)} className="text-[11px] tracking-[0.2em] uppercase hover:opacity-70 transition-opacity" style={{color:G,fontFamily:"sans-serif"}}>{tr("tplDone",lang)}</button>
                </Rise>
              )}
            </div>
          </div>
        </section>

        {/* ══ GLOBAL ════════════════════════════════════════════════════════ */}
        <section id="global" className="py-32 px-8 border-t" style={{borderColor:bdr}}>
          <div className="mx-auto max-w-6xl">
            <Rise className="mb-20">
              <p className="text-[10px] font-medium tracking-[0.35em] uppercase mb-4" style={{color:G,fontFamily:"sans-serif"}}>{tr("glbEyebrow",lang)}</p>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight leading-snug" style={{color:hi,textDecoration:"none"}}>{tr("glbH2a",lang)}<br/><em style={{fontStyle:"italic",color:G,textDecoration:"none"}}>{tr("glbH2b",lang)}</em></h2>
              <p className="mt-6 text-base leading-[1.9] max-w-2xl" style={{color:sub,fontFamily:"sans-serif",fontWeight:300}}>{tr("glbBody",lang)}</p>
            </Rise>
            <div className="grid sm:grid-cols-2 gap-5 mb-16">
              {ROUTES.map((r,i)=>(
                <Rise key={i} d={0.08*i}>
                  <div className="p-7 rounded-xl flex items-start gap-5" style={{background:card,border:`1px solid ${bdr}`}}>
                    <Globe size={16} color={G} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{opacity:0.7}}/>
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.2em] uppercase mb-2" style={{color:G,fontFamily:"sans-serif"}}>{r.label}</p>
                      <p className="text-sm" style={{color:hi}}>{r.from}</p>
                      <div className="flex items-center gap-2 my-1.5"><div className="h-px flex-1" style={{background:`${G}30`}}/><ArrowRight size={10} color={G} strokeWidth={2} style={{opacity:0.5}}/><div className="h-px flex-1" style={{background:`${G}30`}}/></div>
                      <p className="text-sm" style={{color:hi}}>{r.to}</p>
                    </div>
                  </div>
                </Rise>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-8 pt-8 border-t" style={{borderColor:bdr}}>
              {([{t:"glb1t",b:"glb1b"},{t:"glb2t",b:"glb2b"},{t:"glb3t",b:"glb3b"}] as {t:string;b:string}[]).map((p,i)=>(
                <Rise key={i} d={0.1*i}>
                  <div className="h-px w-8 mb-6" style={{background:G,opacity:0.5}}/>
                  <h3 className="text-base font-semibold mb-3" style={{color:hi,fontFamily:"sans-serif"}}>{tr(p.t,lang)}</h3>
                  <p className="text-sm leading-[1.9]" style={{color:sub,fontFamily:"sans-serif",fontWeight:300}}>{tr(p.b,lang)}</p>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROCESS ═══════════════════════════════════════════════════════ */}
        <section id="process" className="py-32 px-8 border-t" style={{borderColor:bdr}}>
          <div className="mx-auto max-w-6xl">
            <Rise className="mb-20">
              <p className="text-[10px] font-medium tracking-[0.35em] uppercase mb-4" style={{color:G,fontFamily:"sans-serif"}}>{tr("procEyebrow",lang)}</p>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight" style={{color:hi}}>{tr("procH2",lang)}</h2>
            </Rise>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map(({n,t,b,Ic},i)=>(
                <Rise key={n} d={0.08*i}>
                  <div className="group p-8 rounded-xl h-full relative transition-all duration-500" style={{background:card,border:`1px solid ${bdr}`}}>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{boxShadow:`0 0 0 1px ${G}25`}}/>
                    <p className="text-3xl font-normal mb-8" style={{color:G,fontFamily:"'Georgia',serif",opacity:0.45}}>{n}</p>
                    <Ic size={16} color={G} strokeWidth={1.5} style={{opacity:0.65}}/>
                    <h3 className="mt-4 text-[15px] font-semibold" style={{color:hi,fontFamily:"sans-serif"}}>{t}</h3>
                    <p className="mt-3 text-[13px] leading-[1.85]" style={{color:sub,fontFamily:"sans-serif",fontWeight:300}}>{b}</p>
                    <div className="mt-8 h-px w-7 opacity-35" style={{background:G}}/>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ═══════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-32 px-8 border-t" style={{borderColor:bdr}}>
          <div className="mx-auto max-w-6xl">
            <Rise className="mb-20">
              <p className="text-[10px] font-medium tracking-[0.35em] uppercase mb-4" style={{color:G,fontFamily:"sans-serif"}}>{tr("prcEyebrow",lang)}</p>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight" style={{color:hi}}>{tr("prcH2",lang)}</h2>
              <p className="mt-4 text-sm" style={{color:sub,fontFamily:"sans-serif",fontWeight:300}}>{tr("prcNote",lang)}</p>
            </Rise>
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {/* Foundation */}
              <Rise d={0}>
                <div className="p-10 rounded-2xl h-full flex flex-col" style={{background:card,border:`1px solid ${bdr}`}}>
                  <p className="text-[10px] tracking-[0.3em] uppercase mb-7" style={{color:G,fontFamily:"sans-serif",opacity:0.7}}>{tr("pF",lang)}</p>
                  <div className="flex items-baseline gap-2 mb-2"><span className="text-4xl font-normal" style={{color:hi}}>179</span><span className="text-sm" style={{color:sub,fontFamily:"sans-serif"}}>AED</span></div>
                  <p className="text-xs mb-8" style={{color:sub,fontFamily:"sans-serif"}}>{tr("pFsub",lang)}</p>
                  <div className="h-px mb-8" style={{background:bdr}}/>
                  <ul className="space-y-3.5 mb-10 flex-1">
                    {(["pFi1","pFi2","pFi3","pFi4"] as string[]).map(k=>(
                      <li key={k} className="flex items-start gap-3 text-sm" style={{color:mid,fontFamily:"sans-serif",fontWeight:300}}>
                        <div className="mt-2 h-1 w-1 rounded-full shrink-0" style={{background:G,opacity:0.5}}/>{tr(k,lang)}
                      </li>
                    ))}
                  </ul>
                  <a href={LINKS.basic} target="_blank" rel="noreferrer" className="flex items-center justify-between w-full px-5 rounded-full text-[11px] tracking-[0.15em] uppercase font-medium transition-all hover:opacity-75" style={{border:`1px solid ${G}38`,color:G,fontFamily:"sans-serif",height:"46px"}}>{tr("prcBegin",lang)}<ArrowRight size={12}/></a>
                </div>
              </Rise>
              {/* Growth */}
              <Rise d={0.08}>
                <div className="p-10 rounded-2xl h-full flex flex-col relative" style={{background:dark?"rgba(200,169,110,0.06)":"rgba(200,169,110,0.07)",border:`1px solid ${G}38`}}>
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] tracking-[0.28em] uppercase font-medium" style={{background:G,color:INK,fontFamily:"sans-serif"}}>{tr("prcMostSel",lang)}</div>
                  <p className="text-[10px] tracking-[0.3em] uppercase mb-7" style={{color:G,fontFamily:"sans-serif"}}>{tr("pG",lang)}</p>
                  <div className="flex items-baseline gap-2 mb-2"><span className="text-4xl font-normal" style={{color:hi}}>299</span><span className="text-sm" style={{color:sub,fontFamily:"sans-serif"}}>AED</span></div>
                  <p className="text-xs mb-8" style={{color:sub,fontFamily:"sans-serif"}}>{tr("pGsub",lang)}</p>
                  <div className="h-px mb-8" style={{background:`${G}25`}}/>
                  <ul className="space-y-3.5 mb-10 flex-1">
                    {(["pGi1","pGi2","pGi3","pGi4","pGi5"] as string[]).map(k=>(
                      <li key={k} className="flex items-start gap-3 text-sm" style={{color:mid,fontFamily:"sans-serif",fontWeight:300}}>
                        <div className="mt-2 h-1 w-1 rounded-full shrink-0" style={{background:G}}/>{tr(k,lang)}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <a href={LINKS.professional} target="_blank" rel="noreferrer" className="flex items-center justify-between w-full px-5 rounded-full text-[11px] tracking-[0.15em] uppercase font-medium transition-all hover:opacity-85" style={{background:G,color:INK,fontFamily:"sans-serif",height:"46px"}}>{tr("prcApplePay",lang)}<ArrowRight size={12}/></a>
                    <p className="mt-2 text-center text-[10px] opacity-30" style={{color:hi,fontFamily:"sans-serif"}}>{tr("prcStripe",lang)}</p>
                  </div>
                </div>
              </Rise>
              {/* Executive */}
              <Rise d={0.16}>
                <div className="p-10 rounded-2xl h-full flex flex-col" style={{background:card,border:`1px solid ${bdr}`}}>
                  <p className="text-[10px] tracking-[0.3em] uppercase mb-7" style={{color:G,fontFamily:"sans-serif",opacity:0.7}}>{tr("pE",lang)}</p>
                  <div className="flex items-baseline gap-2 mb-2"><span className="text-4xl font-normal" style={{color:hi}}>449</span><span className="text-sm" style={{color:sub,fontFamily:"sans-serif"}}>AED</span></div>
                  <p className="text-xs mb-8" style={{color:sub,fontFamily:"sans-serif"}}>{tr("pEsub",lang)}</p>
                  <div className="h-px mb-8" style={{background:bdr}}/>
                  <ul className="space-y-3.5 mb-10 flex-1">
                    {(["pEi1","pEi2","pEi3","pEi4","pEi5"] as string[]).map(k=>(
                      <li key={k} className="flex items-start gap-3 text-sm" style={{color:mid,fontFamily:"sans-serif",fontWeight:300}}>
                        <div className="mt-2 h-1 w-1 rounded-full shrink-0" style={{background:G,opacity:0.5}}/>{tr(k,lang)}
                      </li>
                    ))}
                  </ul>
                  <a href={LINKS.ultimate} target="_blank" rel="noreferrer" className="flex items-center justify-between w-full px-5 rounded-full text-[11px] tracking-[0.15em] uppercase font-medium transition-all hover:opacity-75" style={{border:`1px solid ${G}38`,color:G,fontFamily:"sans-serif",height:"46px"}}>{tr("prcBegin",lang)}<ArrowRight size={12}/></a>
                </div>
              </Rise>
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══════════════════════════════════════════════════ */}
        <section id="clients" className="py-32 px-8 border-t" style={{borderColor:bdr}}>
          <div className="mx-auto max-w-6xl">
            <Rise className="mb-20">
              <p className="text-[10px] font-medium tracking-[0.35em] uppercase mb-4" style={{color:G,fontFamily:"sans-serif"}}>{tr("tmEyebrow",lang)}</p>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight" style={{color:hi}}>{tr("tmH2a",lang)}<br/><em style={{fontStyle:"italic",color:G}}>{tr("tmH2b",lang)}</em></h2>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><svg key={i} width="12" height="12" viewBox="0 0 14 14" fill={G} opacity="0.8"><path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9l-4 2.5 1.5-4L1 5h4.5z"/></svg>)}</div>
                <span className="text-xs" style={{color:sub,fontFamily:"sans-serif"}}>{tr("tmStars",lang)}</span>
              </div>
            </Rise>
            <div className="hidden lg:grid grid-cols-3 gap-6" style={{height:"700px",maskImage:"linear-gradient(to bottom,transparent,black 10%,black 90%,transparent)",WebkitMaskImage:"linear-gradient(to bottom,transparent,black 10%,black 90%,transparent)"}}>
              {cols.map((col,ci)=><TCol key={ci} items={col} dark={dark} dur={[58,70,46][ci]} rev={ci===1}/>)}
            </div>
            <div className="lg:hidden overflow-hidden" style={{height:"520px",maskImage:"linear-gradient(to bottom,transparent,black 8%,black 92%,transparent)",WebkitMaskImage:"linear-gradient(to bottom,transparent,black 8%,black 92%,transparent)"}}>
              <TCol items={TMS} dark={dark} dur={90}/>
            </div>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
        <section className="py-32 px-8 border-t text-center" style={{borderColor:bdr}}>
          <Rise>
            <div className="mx-auto max-w-lg">
              <div className="h-px w-10 mx-auto mb-12" style={{background:G,opacity:0.5}}/>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight mb-6" style={{color:hi}}>{tr("ctaH2a",lang)}<br/>{tr("ctaH2b",lang)}</h2>
              <p className="text-sm leading-[1.9] mb-12" style={{color:sub,fontFamily:"sans-serif",fontWeight:300}}>{tr("ctaBody",lang)}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={wlMsg} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-9 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-85" style={{background:G,color:INK,height:"52px",fontFamily:"sans-serif"}}>{tr("startWA",lang)}</a>
                <button type="button" onClick={()=>setModal(true)} className="flex items-center gap-3 px-9 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-70" style={{border:`1px solid ${G}40`,color:G,height:"52px",fontFamily:"sans-serif"}}><Mail size={12} strokeWidth={1.5}/>{tr("sendEnq",lang)}</button>
              </div>
            </div>
          </Rise>
        </section>

        {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
        <footer className="border-t py-10 px-8" style={{borderColor:bdr}}>
          <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <img
                src="/images/logo.png"
                alt="Zenith Dubai CV"
                style={{
                  height:"32px",
                  width:"auto",
                  objectFit:"contain",
                  display:"block",
                  filter: dark ? "invert(1) brightness(1.8)" : "none",
                  transition:"filter 0.3s",
                }}
              />
              <p className="mt-2 text-[11px]" style={{color:sub,fontFamily:"sans-serif"}}>{tr("tagline",lang)}</p>
            </div>
            <div className="flex items-center gap-6">
              <button type="button" onClick={()=>setModal(true)} className="text-[10px] tracking-[0.15em] uppercase opacity-35 hover:opacity-65 transition-opacity flex items-center gap-2" style={{color:hi,fontFamily:"sans-serif"}}><Mail size={11} strokeWidth={1.5}/>{EM}</button>
              <a href={wlMsg} target="_blank" rel="noreferrer" className="text-[10px] tracking-[0.15em] uppercase opacity-35 hover:opacity-65 transition-opacity flex items-center gap-2" style={{color:"#4A9A5A",fontFamily:"sans-serif"}}>
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none"><path d="M12 22a10 10 0 0 0 8.66-15 10 10 0 0 0-16.9 10.6L3 22l4.56-.7A10 10 0 0 0 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                {tr("footerWA",lang)}
              </a>
            </div>
            <p className="text-[10px] opacity-20" style={{color:hi,fontFamily:"sans-serif"}}>© {new Date().getFullYear()} Zenith Dubai CV</p>
          </div>
        </footer>
      </main>

      {/* FAB */}
      <button type="button" onClick={()=>setModal(true)} aria-label="Enquire" className="fixed bottom-24 right-7 h-12 w-12 rounded-full flex items-center justify-center transition-all hover:scale-105 z-40" style={{background:G,boxShadow:`0 6px 28px ${G}40`}}><Mail size={15} color={INK} strokeWidth={2}/></button>
      <a href={`https://wa.me/${WA}?text=${encodeURIComponent("Hello. I would like to discuss my career positioning.")}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="fixed bottom-8 right-7 h-12 w-12 rounded-full flex items-center justify-center transition-all hover:scale-105 z-40" style={{background:"#25D366",boxShadow:"0 6px 28px rgba(37,211,102,0.32)"}}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path d="M12 22a10 10 0 0 0 8.66-15 10 10 0 0 0-16.9 10.6L3 22l4.56-.7A10 10 0 0 0 12 22Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M9.35 8.9c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.1.8 2.6.7 3.1.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.2-.2-.3-.5-.4l-1.9-.9c-.2-.1-.4-.1-.6.1-.2.2-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.5c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.5l-.8-2Z" fill="white"/>
        </svg>
      </a>

      {/* Preview Lightbox */}
      {preview&&(
        <PreviewLightbox
          cv={preview}
          onClose={()=>setPreview(null)}
          onEnquire={()=>setModal(true)}
          dark={dark}
          lang={lang}
        />
      )}

      <Modal open={modal} onClose={()=>setModal(false)} dark={dark} lang={lang}/>
    </div>
  );
}