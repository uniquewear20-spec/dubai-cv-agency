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
  navServices:  {en:"Services",        ar:"الخدمات",           fr:"Services"},
  navTemplates: {en:"Templates",       ar:"القوالب",           fr:"Modèles"},
  navMethod:    {en:"Method",          ar:"المنهجية",          fr:"Méthode"},
  navPricing:   {en:"Investment",      ar:"الاستثمار",         fr:"Investissement"},
  navClients:   {en:"Clients",         ar:"العملاء",           fr:"Clients"},
  enquire:      {en:"Enquire",         ar:"استفسار",           fr:"Enquêter"},
  // Hero
  eyebrow:      {en:"Premier CV Studio · Dubai",    ar:"الاستوديو الأول للسيرة الذاتية · دبي",  fr:"Studio CV Premier · Dubaï"},
  h1a:          {en:"From Local Talent",             ar:"من موهبة محلية",                         fr:"Du Talent Local"},
  h1b:          {en:"to Global Opportunity.",        ar:"إلى فرصة عالمية.",                       fr:"à l'Opportunité Mondiale."},
  heroSub:      {en:"We engineer bespoke career documents for professionals from Africa, the Middle East, and Asia — securing positions across Europe, the Americas, and APAC.",
                 ar:"نصمم وثائق مهنية مخصصة للمحترفين من أفريقيا والشرق الأوسط وآسيا — لتأمين مناصب في أوروبا والأمريكيتين ومنطقة آسيا والمحيط الهادئ.",
                 fr:"Nous concevons des documents de carrière sur mesure pour les professionnels d'Afrique, du Moyen-Orient et d'Asie — garantissant des postes en Europe, aux Amériques et en APAC."},
  viewPkg:      {en:"View Packages",   ar:"عرض الباقات",       fr:"Voir les Offres"},
  beginEnq:     {en:"Begin Enquiry",   ar:"ابدأ الاستفسار",    fr:"Commencer une Demande"},
  // Metrics
  mAts:         {en:"ATS Clearance",   ar:"اجتياز الفلترة",    fr:"Passage ATS"},
  mRate:        {en:"Interview Rate",  ar:"معدل المقابلات",     fr:"Taux d'entretien"},
  mDraft:       {en:"First Draft",     ar:"أول مسودة",          fr:"Premier brouillon"},
  mTpl:         {en:"Templates",       ar:"قوالب",              fr:"Modèles"},
  // Services
  svcEyebrow:   {en:"What We Engineer",ar:"ما نُصمّمه",         fr:"Ce Que Nous Concevons"},
  svcH2:        {en:"Three disciplines. One authoritative outcome.",
                 ar:"ثلاثة تخصصات. نتيجة واحدة موثوقة.",
                 fr:"Trois disciplines. Un résultat d'autorité."},
  s1t: {en:"ATS Architecture",   ar:"هندسة الفلترة الآلية",  fr:"Architecture ATS"},
  s1b: {en:"Every keyword and format decision is reverse-engineered against GCC and global ATS — ensuring your document is never filtered before human eyes see it.",
        ar:"كل كلمة مفتاحية وقرار تنسيق مُعكوس الهندسة وفق أنظمة الفلترة الآلية في دول الخليج والعالم، لضمان وصول وثيقتك إلى العيون البشرية دون عوائق.",
        fr:"Chaque mot-clé et décision de format est rétro-conçu selon les ATS — garantissant que votre document n'est jamais filtré avant d'être lu."},
  s1tag:{en:"Essential for all digital applications",ar:"ضروري لجميع التقديمات الإلكترونية",fr:"Essentiel pour toutes les candidatures numériques"},
  s2t: {en:"Executive Design",    ar:"التصميم التنفيذي",      fr:"Design Exécutif"},
  s2b: {en:"Typography, hierarchy, and visual weight calibrated to your seniority and target market. A document that signals leadership before a recruiter reads a word.",
        ar:"طباعة وهرمية وثقل بصري مُعاير وفق مستوى أقدميتك وسوقك المستهدف. وثيقة تُعلن القيادة قبل أن يقرأ أي مُوظِّف كلمة واحدة.",
        fr:"Typographie, hiérarchie et poids visuel calibrés selon votre ancienneté et marché cible. Un document qui signale le leadership avant qu'un recruteur lise un mot."},
  s2tag:{en:"Recommended: Director level and above",ar:"موصى به: مستوى المدير فما فوق",fr:"Recommandé : Niveau Directeur et supérieur"},
  s3t: {en:"LinkedIn Intelligence", ar:"استخبارات لينكد إن",  fr:"Intelligence LinkedIn"},
  s3b: {en:"Your profile rewritten with keyword density and authority signals that surface you for the searches that matter — GCC, Europe, APAC, and North America.",
        ar:"يُعاد كتابة ملفك الشخصي بكثافة كلمات مفتاحية وإشارات سلطة تُظهرك في عمليات البحث المهمة — الخليج، أوروبا، آسيا والمحيط الهادئ، وأمريكا الشمالية.",
        fr:"Votre profil réécrit avec une densité de mots-clés et des signaux d'autorité pour les recherches importantes — CCG, Europe, APAC et Amérique du Nord."},
  s3tag:{en:"Included: Growth & Executive tiers",ar:"مشمول: خطتا النمو والتنفيذية",fr:"Inclus : Offres Croissance & Exécutif"},
  // Templates
  tplEyebrow:  {en:"Template Library",  ar:"مكتبة القوالب",    fr:"Bibliothèque de Modèles"},
  tplH2:       {en:"Premium designs.",  ar:"تصاميم متميزة.",   fr:"Designs premium."},
  tplDesc:     {en:"Every Zenith package includes access to our exclusive library of over 500 ATS-optimised templates — engineered for Europe, Canada, the GCC, and the USA.",
                ar:"تشمل كل باقة Zenith الوصول إلى مكتبتنا الحصرية التي تضم أكثر من 500 قالب مُحسَّن لأنظمة ATS — مُصمَّمة لأوروبا وكندا ودول الخليج والولايات المتحدة.",
                fr:"Chaque forfait Zenith inclut l'accès à notre bibliothèque exclusive de plus de 500 modèles optimisés ATS — conçus pour l'Europe, le Canada, le CCG et les États-Unis."},
  tplBadge:    {en:"Industry-Specific Blueprints",ar:"قوالب مخصصة للقطاعات",fr:"Plans Spécifiques au Secteur"},
  tplGet:      {en:"Get This Template", ar:"احصل على هذا القالب",fr:"Obtenir ce Modèle"},
  tplMore:     {en:"View More Designs", ar:"عرض المزيد من التصاميم",fr:"Voir Plus de Modèles"},
  tplDone:     {en:"All designs shown · Enquire for 500+ full access",
                ar:"تم عرض جميع التصاميم · استفسر للوصول الكامل لـ +500",
                fr:"Tous les modèles affichés · Demandez l'accès complet à 500+"},
  // Global
  glbEyebrow:  {en:"From Dubai, To the World",ar:"من دبي إلى العالم",fr:"De Dubaï, Vers le Monde"},
  glbH2a:      {en:"Dubai is not the destination.",ar:"دبي ليست الوجهة.",fr:"Dubaï n'est pas la destination."},
  glbH2b:      {en:"It is the platform.",ar:"إنها المنصة.",fr:"C'est la plateforme."},
  glbBody:     {en:"Positioned at the intersection of Africa, Asia, and Europe, Dubai is the world's most strategically located talent gateway. We cross-calibrate your profile for multiple markets simultaneously.",
                ar:"يقع دبي عند تقاطع أفريقيا وآسيا وأوروبا، ليكون أكثر بوابات المواهب الاستراتيجية في العالم. نُعاير ملفك الشخصي لأسواق متعددة في آنٍ واحد.",
                fr:"Positionné à l'intersection de l'Afrique, de l'Asie et de l'Europe, Dubaï est la passerelle de talents la plus stratégique au monde. Nous calibrons votre profil pour plusieurs marchés simultanément."},
  glb1t: {en:"Cultural Fluency",     ar:"الطلاقة الثقافية",   fr:"Fluidité Culturelle"},
  glb1b: {en:"We calibrate tone and phrasing for the cultural norms of your target market — not just its ATS requirements.",
          ar:"نُعاير النبرة والصياغة وفق الأعراف الثقافية لسوقك المستهدف — ليس فقط متطلبات الفلترة الآلية.",
          fr:"Nous calibrons le ton et la formulation selon les normes culturelles de votre marché cible — pas seulement ses exigences ATS."},
  glb2t: {en:"Dual-Market Documents",ar:"وثائق السوقين",       fr:"Documents Double Marché"},
  glb2b: {en:"One engagement produces documents optimised for two geographic markets simultaneously — protecting your optionality.",
          ar:"مشاركة واحدة تُنتج وثائق مُحسَّنة لسوقين جغرافيين في آنٍ واحد — لحماية خياراتك المستقبلية.",
          fr:"Un seul engagement produit des documents optimisés pour deux marchés géographiques simultanément — protégeant votre flexibilité."},
  glb3t: {en:"Language Versions",    ar:"النسخ اللغوية",       fr:"Versions Linguistiques"},
  glb3b: {en:"Growth and Executive tiers include EN, FR, DE, and AR versions at no additional cost.",
          ar:"تشمل خطتا النمو والتنفيذية نسخاً بالإنجليزية والفرنسية والألمانية والعربية دون تكلفة إضافية.",
          fr:"Les offres Croissance et Exécutif incluent des versions EN, FR, DE et AR sans coût supplémentaire."},
  // Process
  procEyebrow: {en:"The Method",       ar:"المنهجية",          fr:"La Méthode"},
  procH2:      {en:"Four steps. Forty-eight hours.",ar:"أربع خطوات. ثمانية وأربعون ساعة.",fr:"Quatre étapes. Quarante-huit heures."},
  p1t:{en:"Select",   ar:"الاختيار", fr:"Sélectionner"},
  p1b:{en:"Choose your investment tier and complete a secure payment.",ar:"اختر مستوى استثمارك وأتمّ الدفع الآمن.",fr:"Choisissez votre niveau d'investissement et effectuez un paiement sécurisé."},
  p2t:{en:"Brief",    ar:"الإحاطة",  fr:"Brief"},
  p2b:{en:"Submit your career history via our intake form or WhatsApp.",ar:"أرسل تاريخك المهني عبر نموذج الاستقبال أو واتساب.",fr:"Soumettez votre parcours professionnel via notre formulaire ou WhatsApp."},
  p3t:{en:"Engineer", ar:"الهندسة", fr:"Ingénierie"},
  p3b:{en:"Your dedicated writer architects your document within 48 hours.",ar:"يُصمّم كاتبك المخصص وثيقتك خلال 48 ساعة.",fr:"Votre rédacteur dédié structure votre document en 48 heures."},
  p4t:{en:"Refine",   ar:"التحسين", fr:"Affiner"},
  p4b:{en:"Unlimited revisions until the output exceeds your expectations.",ar:"مراجعات غير محدودة حتى يتجاوز الناتج توقعاتك.",fr:"Révisions illimitées jusqu'à ce que le résultat dépasse vos attentes."},
  // Pricing
  prcEyebrow:  {en:"Investment Tiers",  ar:"مستويات الاستثمار", fr:"Niveaux d'Investissement"},
  prcH2:       {en:"Three tiers. One standard of excellence.",ar:"ثلاثة مستويات. معيار واحد من التميز.",fr:"Trois niveaux. Une norme d'excellence."},
  prcNote:     {en:"All prices in UAE Dirhams. Secure payment via Stripe.",ar:"جميع الأسعار بالدرهم الإماراتي. دفع آمن عبر Stripe.",fr:"Tous les prix en Dirhams émiratis. Paiement sécurisé via Stripe."},
  prcMostSel:  {en:"Most Selected",    ar:"الأكثر اختياراً",   fr:"Le Plus Choisi"},
  prcBegin:    {en:"Begin",            ar:"ابدأ",               fr:"Commencer"},
  prcApplePay: {en:"Begin · Apple Pay",ar:"ابدأ · Apple Pay",  fr:"Commencer · Apple Pay"},
  prcStripe:   {en:"Stripe-secured payment",ar:"دفع مؤمَّن بـ Stripe",fr:"Paiement sécurisé Stripe"},
  // Foundation
  pF:    {en:"Foundation",  ar:"الأساسية",  fr:"Fondation"},
  pFsub: {en:"Entry-level. Precise. Effective.",ar:"مستوى مبتدئ. دقيق. فعّال.",fr:"Niveau entrée. Précis. Efficace."},
  pFi1:  {en:"ATS-engineered CV",          ar:"سيرة ذاتية مُهندَسة لـ ATS",       fr:"CV conçu pour ATS"},
  pFi2:  {en:"Professional cover letter",  ar:"خطاب تغطية احترافي",               fr:"Lettre de motivation professionnelle"},
  pFi3:  {en:"AI photo enhancement",       ar:"تحسين الصورة بالذكاء الاصطناعي",  fr:"Amélioration photo IA"},
  pFi4:  {en:"Access to 500+ template library",ar:"الوصول لمكتبة +500 قالب",     fr:"Accès bibliothèque 500+ modèles"},
  // Growth
  pG:    {en:"Growth",       ar:"النمو",      fr:"Croissance"},
  pGsub: {en:"Comprehensive. Multi-market. Complete.",ar:"شامل. متعدد الأسواق. مكتمل.",fr:"Complet. Multi-marché. Achevé."},
  pGi1:  {en:"ATS + Executive Design CV",    ar:"سيرة ذاتية ATS + تصميم تنفيذي",  fr:"CV ATS + Design Exécutif"},
  pGi2:  {en:"LinkedIn profile intelligence",ar:"استخبارات ملف لينكد إن",         fr:"Intelligence profil LinkedIn"},
  pGi3:  {en:"Career strategy e-book",       ar:"كتاب استراتيجية المسار المهني",   fr:"E-book stratégie de carrière"},
  pGi4:  {en:"EN, FR, DE, AR versions",      ar:"نسخ EN، FR، DE، AR",             fr:"Versions EN, FR, DE, AR"},
  pGi5:  {en:"Access to 500+ template library",ar:"الوصول لمكتبة +500 قالب",     fr:"Accès bibliothèque 500+ modèles"},
  // Executive
  pE:    {en:"Executive",    ar:"التنفيذية",  fr:"Exécutif"},
  pEsub: {en:"Full-service. Strategic. White-glove.",ar:"خدمة كاملة. استراتيجي. احترافي.",fr:"Service complet. Stratégique. Gants blancs."},
  pEi1:  {en:"All Growth deliverables",          ar:"جميع مخرجات خطة النمو",        fr:"Tous les livrables Croissance"},
  pEi2:  {en:"60-minute interview coaching",     ar:"تدريب مقابلات 60 دقيقة",      fr:"Coaching entretien 60 minutes"},
  pEi3:  {en:"Career narrative consultation",    ar:"استشارة السرد المهني",         fr:"Consultation narrative de carrière"},
  pEi4:  {en:"30-day VIP priority support",      ar:"دعم VIP أولوية لمدة 30 يوماً",fr:"Support prioritaire VIP 30 jours"},
  pEi5:  {en:"Access to 500+ template library",  ar:"الوصول لمكتبة +500 قالب",     fr:"Accès bibliothèque 500+ modèles"},
  // Testimonials
  tmEyebrow:   {en:"Client Outcomes",  ar:"نتائج العملاء",     fr:"Résultats Clients"},
  tmH2a:       {en:"Results, without", ar:"نتائج، دون",        fr:"Résultats, sans"},
  tmH2b:       {en:"embellishment.",   ar:"مبالغة.",           fr:"embellissement."},
  tmStars:     {en:"5.0 · 200+ verified engagements",ar:"5.0 · +200 تعامل موثوق", fr:"5.0 · 200+ engagements vérifiés"},
  // CTA
  ctaH2a:      {en:"Your next position",      ar:"منصبك القادم",    fr:"Votre prochain poste"},
  ctaH2b:      {en:"begins with a document.", ar:"يبدأ بوثيقة.",    fr:"commence par un document."},
  ctaBody:     {en:"Over 200 professionals from 18 nationalities have used Zenith to secure roles across six continents. The common denominator was a decision to invest in positioning.",
                ar:"استخدم أكثر من 200 محترف من 18 جنسية مختلفة خدمات Zenith لتأمين مناصب عبر ستة قارات. القاسم المشترك كان قراراً بالاستثمار في التموضع المهني.",
                fr:"Plus de 200 professionnels de 18 nationalités ont utilisé Zenith pour décrocher des postes sur six continents. Le dénominateur commun était la décision d'investir dans le positionnement."},
  startWA:     {en:"Start on WhatsApp",ar:"ابدأ على واتساب",    fr:"Commencer sur WhatsApp"},
  sendEnq:     {en:"Send Enquiry",    ar:"إرسال الاستفسار",     fr:"Envoyer une Demande"},
  // Footer
  tagline:     {en:"Dubai · Global Career Intelligence",ar:"دبي · ذكاء مهني عالمي",fr:"Dubaï · Intelligence Carrière Mondiale"},
  footerWA:    {en:"WhatsApp",        ar:"واتساب",              fr:"WhatsApp"},
  // Modal / form
  frmEmail:    {en:"Email Address",   ar:"البريد الإلكتروني",   fr:"Adresse e-mail"},
  frmSubject:  {en:"Subject",         ar:"الموضوع",             fr:"Sujet"},
  frmMessage:  {en:"Message",         ar:"الرسالة",             fr:"Message"},
  frmAttach:   {en:"Attachments",     ar:"المرفقات",            fr:"Pièces jointes"},
  frmOptional: {en:"— optional",      ar:"— اختياري",           fr:"— facultatif"},
  frmPhoto:    {en:"Profile Photo",   ar:"صورة الملف الشخصي",   fr:"Photo de profil"},
  frmPhotoH:   {en:"JPG · PNG · WEBP · max 5 MB", ar:"JPG · PNG · WEBP · الحد الأقصى 5 ميغابايت", fr:"JPG · PNG · WEBP · max 5 Mo"},
  frmCv:       {en:"Current CV",      ar:"السيرة الذاتية الحالية",fr:"CV Actuel"},
  frmCvH:      {en:"PDF · DOC · DOCX · max 5 MB", ar:"PDF · DOC · DOCX · الحد الأقصى 5 ميغابايت", fr:"PDF · DOC · DOCX · max 5 Mo"},
  frmDrop:     {en:"Click or drop here", ar:"انقر أو اسحب هنا",  fr:"Cliquer ou déposer ici"},
  frmSending:  {en:"Sending",         ar:"جارٍ الإرسال",        fr:"Envoi en cours"},
  frmRetry:    {en:"Retry",           ar:"إعادة المحاولة",      fr:"Réessayer"},
  frmReceived: {en:"Received.",       ar:"تم الاستلام.",         fr:"Reçu."},
  frmReply:    {en:"We respond to",   ar:"سنرد على",            fr:"Nous répondons à"},
  frmHours:    {en:"within 24 hours.",ar:"خلال 24 ساعة.",        fr:"dans les 24 heures."},
  frmClose:    {en:"Close",           ar:"إغلاق",               fr:"Fermer"},
  frmErrNet:   {en:"Network error — please try WhatsApp.", ar:"خطأ في الشبكة — يرجى المحاولة عبر واتساب.", fr:"Erreur réseau — veuillez essayer WhatsApp."},
  frmErrGen:   {en:"Something went wrong.", ar:"حدث خطأ ما.",     fr:"Quelque chose s'est mal passé."},
  // Template card
  tplAts:      {en:"ATS ✓",          ar:"ATS ✓",               fr:"ATS ✓"},
  // Global section — literal connector
  glbConnector:{en:"It is the",      ar:"إنها",                 fr:"C'est"},
};
const tr = (k:string, l:Lang):string => TX[k]?.[l] ?? TX[k]?.en ?? k;

// ── Types ──────────────────────────────────────────────────────────────────────
type Fm = {email:string;subject:string;message:string;photo:File|null;cv:File|null};
type St  = "idle"|"sending"|"success"|"error";

// ── Template data — 33 items ───────────────────────────────────────────────────
const TEMPLATES = [
  {id:1,  name:"The DIFC Leadership",       ind:"Finance · Banking",          reg:"Dubai · London · New York"},
  {id:2,  name:"Urban Tech Professional",   ind:"Technology · Engineering",   reg:"GCC · Singapore · Toronto"},
  {id:3,  name:"Editorial Creative",        ind:"Design · Media · Marketing", reg:"Europe · UK · Australia"},
  {id:4,  name:"The Toronto Executive",     ind:"Operations · Consulting",    reg:"Canada · USA · UK"},
  {id:5,  name:"Global Minimalist",         ind:"Engineering · IT",           reg:"Americas · APAC"},
  {id:6,  name:"African Enterprise",        ind:"Sales · Management",         reg:"GCC · Africa · Europe"},
  {id:7,  name:"Singapore Tech Expert",     ind:"Technology · Data Science",  reg:"Singapore · APAC · USA"},
  {id:8,  name:"Paris Creative",            ind:"Creative · Marketing",       reg:"France · EU · Canada"},
  {id:9,  name:"Riyadh C-Suite",            ind:"Finance · Executive",        reg:"KSA · GCC · London"},
  {id:10, name:"London Financial",          ind:"Finance · Fintech",          reg:"UK · Europe · Dubai"},
  {id:11, name:"Mumbai Corporate",          ind:"Operations · HR",            reg:"India · GCC · Singapore"},
  {id:12, name:"New York Banking",          ind:"Investment Banking",         reg:"USA · Canada · London"},
  {id:13, name:"Amsterdam Innovation",      ind:"Product · UX · Design",     reg:"Netherlands · EU · Remote"},
  {id:14, name:"Sydney Modern",             ind:"Healthcare · Research",      reg:"Australia · NZ · Canada"},
  {id:15, name:"Dubai Hospitality Elite",   ind:"Hospitality · Tourism",     reg:"UAE · GCC · Maldives"},
  {id:16, name:"Lagos Rising",              ind:"Business · Entrepreneurship",reg:"Nigeria · UK · USA"},
  {id:17, name:"Nairobi Leadership",        ind:"NGO · Development",          reg:"Kenya · East Africa · UN"},
  {id:18, name:"Frankfurt Banking",         ind:"Finance · Insurance",        reg:"Germany · EU · Switzerland"},
  {id:19, name:"Beirut Medical",            ind:"Healthcare · Medicine",      reg:"Lebanon · GCC · EU"},
  {id:20, name:"Cairo Engineering",         ind:"Civil · Infrastructure",    reg:"Egypt · GCC · Europe"},
  {id:21, name:"Kuala Lumpur Digital",      ind:"Digital · E-Commerce",      reg:"Malaysia · ASEAN · Australia"},
  {id:22, name:"Hong Kong Finance",         ind:"Asset Management",           reg:"HK · Singapore · London"},
  {id:23, name:"Doha Energy Leader",        ind:"Oil & Gas · Energy",        reg:"Qatar · GCC · USA"},
  {id:24, name:"Brussels Policy",           ind:"Law · Policy · EU Affairs", reg:"Belgium · EU · Geneva"},
  {id:25, name:"Johannesburg Executive",    ind:"Mining · Resources",         reg:"South Africa · GCC · London"},
  {id:26, name:"Geneva International",      ind:"Diplomacy · International",  reg:"Switzerland · UN · Global"},
  {id:27, name:"Jakarta Tech Startup",      ind:"Technology · Startup",      reg:"Indonesia · ASEAN · Remote"},
  {id:28, name:"Casablanca Professional",   ind:"Finance · Consulting",      reg:"Morocco · France · GCC"},
  {id:29, name:"Abu Dhabi Government",      ind:"Public Sector · Policy",    reg:"UAE · GCC · International"},
  {id:30, name:"Seoul Innovation",          ind:"Technology · R&D",          reg:"South Korea · Japan · USA"},
  {id:31, name:"Mexico City Operations",    ind:"Supply Chain · Logistics",  reg:"Mexico · USA · Latin America"},
  {id:32, name:"Accra Global",              ind:"Development · Finance",     reg:"Ghana · UK · EU"},
  {id:33, name:"The Executive Portfolio",   ind:"C-Suite · Board Level",     reg:"Global · Any Market"},
];

// ── CV images: /public/templates-new/cv1.png … cv33.png ──────────────────────
// Files must be named cv1.png, cv2.png … cv33.png (no underscore) in /public/templates-new/

const TMS = [
  {name:"Sara Al-Rashidi",         role:"Finance Director",         co:"DIFC, Dubai",      ind:"Finance",    img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=face", text:"Nine interview callbacks in two weeks. Zenith understood the DIFC hiring landscape with a precision I had never encountered from any previous service.", hl:"9 callbacks · 2 weeks"},
  {name:"James Okafor",            role:"General Manager",          co:"Jumeirah Group",   ind:"Hospitality",img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face", text:"Every interviewer opened by complimenting the document itself. I secured the role and negotiated a salary 28% above the initial offer.", hl:"+28% salary"},
  {name:"Capt. Rashed Al-Bloushi", role:"Senior First Officer",     co:"Emirates",         ind:"Aviation",   img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face", text:"Aviation HR is a specialised discipline. Zenith knew exactly what Emirates recruitment requires. I was shortlisted within days of submission.", hl:"Shortlisted in days"},
  {name:"Marcus Vandenberg",       role:"VP Engineering",           co:"ADNOC, Abu Dhabi", ind:"Energy",     img:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=face", text:"Two competing offers from major energy firms within three weeks. The ATS document passed every automated filter that had previously blocked me.", hl:"2 offers · 3 weeks"},
  {name:"Priya Nair",              role:"Cloud Architect",          co:"Singapore",        ind:"Technology", img:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=face", text:"My interview rate doubled and I accepted an offer 40% above my previous compensation — a direct result of being repositioned for APAC.", hl:"+40% compensation"},
  {name:"Dr. Layla Al-Hosani",     role:"Head of Cardiology",       co:"SEHA, Abu Dhabi",  ind:"Healthcare", img:"https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=160&h=160&fit=crop&crop=face", text:"A document that finally matched my clinical standing. The executive design secured my department leadership appointment within the month.", hl:"Department Head"},
  {name:"Claire Beaumont",         role:"Private Banking Director", co:"DIFC, Dubai",      ind:"Finance",    img:"https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=160&h=160&fit=crop&crop=face", text:"Two of the most prestigious private banks in Dubai opened their doors within four weeks of using the Zenith executive portfolio.", hl:"DIFC · 4 weeks"},
  {name:"Yousef Al-Qahtani",       role:"Operations Director",      co:"Aramco",           ind:"Energy",     img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&crop=face", text:"Promoted internally and received an unsolicited external offer at 35% uplift — both within six weeks of the Zenith repositioning.", hl:"+35% uplift"},
];
const IH: Record<string,string> = {Finance:"#B8962E",Hospitality:"#9A7A3A",Healthcare:"#4A8A6A",Energy:"#9A6A20",Technology:"#3A6A8A",Aviation:"#5A5090"};
const ROUTES = [
  {from:"Lagos · Nairobi · Cairo",     to:"London · Amsterdam · Paris",    label:"Africa → Europe"},
  {from:"Dubai · Riyadh · Doha",       to:"Singapore · Hong Kong · Tokyo",  label:"GCC → APAC"},
  {from:"Mumbai · Karachi · Dhaka",    to:"Toronto · New York · Boston",    label:"South Asia → Americas"},
  {from:"Manila · Jakarta · Kuala L.", to:"Dubai · Abu Dhabi · Doha",       label:"SE Asia → GCC"},
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

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function Home(){
  const [dark,setDark]=useState(()=>{ if(typeof window==="undefined") return true; const s=localStorage.getItem("z-theme"); return s!==null?s==="dark":true; });
  const tog=()=>{const n=!dark;setDark(n);localStorage.setItem("z-theme",n?"dark":"light");};
  const [modal,setModal]=useState(false);
  const [lang,setLang]=useState<Lang>("en");
  const [langOpen,setLangOpen]=useState(false);
  const [visible,setVisible]=useState(PAGE_SIZE);

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
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-[0.12em] uppercase" style={{fontFamily:"'Georgia',serif",color:hi}}>Zenith</span>
            <div className="h-3 w-px opacity-20" style={{background:hi}}/>
            <span className="text-[11px] tracking-[0.12em] uppercase" style={{color:G,fontFamily:"sans-serif"}}>Dubai CV</span>
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
                        <div className="relative overflow-hidden" style={{height:"280px",background:dark?"rgba(200,169,110,0.05)":"rgba(200,169,110,0.06)"}}>
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
                                p.style.cssText = "height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:24px";
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
                          <div className="absolute inset-0 flex items-end opacity-0 hover:opacity-100 transition-opacity duration-300" style={{background:"linear-gradient(to top,rgba(10,9,7,0.85) 0%,transparent 55%)"}}>
                            <button type="button" onClick={()=>setModal(true)} className="w-full m-4 py-2.5 rounded-xl text-[11px] font-medium tracking-[0.15em] uppercase transition-all hover:opacity-85" style={{background:G,color:INK,fontFamily:"sans-serif"}}>{tr("tplGet",lang)}</button>
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-sm font-semibold leading-tight" style={{color:hi,fontFamily:"sans-serif"}}>{cv.name}</h3>
                            <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium mt-0.5" style={{background:`${G}15`,color:G,border:`1px solid ${G}30`,fontFamily:"sans-serif"}}>{tr("tplAts",lang)}</span>
                          </div>
                          <p className="text-[11px] mb-1" style={{color:sub,fontFamily:"sans-serif"}}>{cv.ind}</p>
                          <p className="text-[10px]" style={{color:sub,fontFamily:"sans-serif",opacity:0.7}}>{cv.reg}</p>
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
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight leading-snug" style={{color:hi}}>{tr("glbH2a",lang)}<br/><em style={{fontStyle:"italic",color:G}}>{tr("glbH2b",lang)}</em></h2>
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
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tracking-[0.12em] uppercase" style={{fontFamily:"'Georgia',serif",color:hi}}>Zenith</span>
                <div className="h-3 w-px opacity-15" style={{background:hi}}/>
                <span className="text-[11px] tracking-[0.12em] uppercase" style={{color:G,fontFamily:"sans-serif"}}>Dubai CV</span>
              </div>
              <p className="mt-1 text-[11px]" style={{color:sub,fontFamily:"sans-serif"}}>{tr("tagline",lang)}</p>
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

      <Modal open={modal} onClose={()=>setModal(false)} dark={dark} lang={lang}/>
    </div>
  );
}