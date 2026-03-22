// app/terms-of-service/page.tsx — Zenith Dubai CV · Terms of Service
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ArrowLeft, Globe } from "lucide-react";

const G = "#C8A96E", INK = "#0A0907", ASH = "#F5F1EB";
const WA = "971502879462", EM = "info@zenithdubaicv.com";
const wlMsg = `https://wa.me/${WA}?text=${encodeURIComponent("Hello. I would like to discuss my career positioning.")}`;

type Lang = "en" | "ar" | "fr";
const LANGS = [
  { code: "en" as Lang, label: "EN",      dir: "ltr" as const, font: "'Georgia','Times New Roman',serif" },
  { code: "ar" as Lang, label: "العربية", dir: "rtl" as const, font: "'Noto Naskh Arabic','Tahoma','Arial',sans-serif" },
  { code: "fr" as Lang, label: "FR",      dir: "ltr" as const, font: "'Georgia','Times New Roman',serif" },
];

const UI: Record<string, Record<Lang, string>> = {
  pageTitle: { en: "Terms of Service", ar: "شروط الخدمة", fr: "Conditions d'utilisation" },
  legal:     { en: "Legal",            ar: "قانوني",       fr: "Légal" },
  lastUpdated: { en: "Last updated: March 2025 · Zenith Dubai CV, Dubai, UAE", ar: "آخر تحديث: مارس 2025 · Zenith Dubai CV، دبي، الإمارات", fr: "Dernière mise à jour : mars 2025 · Zenith Dubai CV, Dubaï, EAU" },
  backHome:  { en: "Back to Home",     ar: "العودة إلى الرئيسية", fr: "Retour à l'accueil" },
  emailUs:   { en: "Email Us",         ar: "راسلنا",              fr: "Nous écrire" },
  whatsapp:  { en: "WhatsApp",         ar: "واتساب",              fr: "WhatsApp" },
  questions: { en: "Questions about these terms? We are happy to clarify before you proceed.", ar: "هل لديك أسئلة حول هذه الشروط؟ يسعدنا توضيحها قبل المتابعة.", fr: "Des questions sur ces conditions ? Nous sommes là pour clarifier avant de commencer." },
  copyright: { en: "© 2025 Zenith Dubai CV", ar: "© 2025 Zenith Dubai CV", fr: "© 2025 Zenith Dubai CV" },
  privacyLink: { en: "Privacy Policy", ar: "سياسة الخصوصية", fr: "Politique de confidentialité" },
  termsLink:   { en: "Terms of Service", ar: "شروط الخدمة", fr: "Conditions d'utilisation" },
  intro: {
    en: "These Terms of Service govern your use of the Zenith Dubai CV website and the professional career services we provide. By engaging our services or submitting an enquiry, you agree to be bound by these terms. Please read them carefully before proceeding.",
    ar: "تحكم شروط الخدمة هذه استخدامك لموقع Zenith Dubai CV والخدمات المهنية التي نقدّمها. بتعاملك مع خدماتنا أو تقديم استفسار، فإنك توافق على الالتزام بهذه الشروط. يُرجى قراءتها بعناية قبل المتابعة.",
    fr: "Ces Conditions d'utilisation régissent votre utilisation du site Zenith Dubai CV et des services professionnels que nous proposons. En faisant appel à nos services ou en soumettant une demande, vous acceptez d'être lié par ces conditions.",
  },
};

const SECTIONS = [
  {
    id: "01",
    title: { en: "Introduction & Agreement", ar: "المقدمة والاتفاقية", fr: "Introduction et accord" },
    body: {
      en: ["By accessing this website or engaging Zenith Dubai CV for any service, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.", "These terms constitute a legally binding agreement between you ('the client') and Zenith Dubai CV ('we', 'us', 'our'), a professional career services company based in Dubai, United Arab Emirates."],
      ar: ["بوصولك إلى هذا الموقع أو تعاملك مع Zenith Dubai CV للحصول على أي خدمة، فإنك تُقرّ بأنك قرأت شروط الخدمة هذه وفهمتها وتوافق على الالتزام بها. إذا كنت لا توافق على هذه الشروط، يُرجى عدم استخدام موقعنا أو خدماتنا.", "تُشكّل هذه الشروط اتفاقية ملزمة قانونياً بينك ('العميل') وبين Zenith Dubai CV ('نحن')، وهي شركة خدمات مهنية متخصصة في المسار الوظيفي مقرّها دبي، الإمارات العربية المتحدة."],
      fr: ["En accédant à ce site ou en faisant appel à Zenith Dubai CV pour tout service, vous confirmez avoir lu, compris et accepté d'être lié par ces Conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site ou nos services.", "Ces conditions constituent un accord juridiquement contraignant entre vous ('le client') et Zenith Dubai CV ('nous'), une société de services professionnels de carrière basée à Dubaï, Émirats arabes unis."],
    },
  },
  {
    id: "02",
    title: { en: "Services Description", ar: "وصف الخدمات", fr: "Description des services" },
    body: {
      en: ["Zenith Dubai CV provides professional career document services including CV writing, cover letter creation, LinkedIn profile optimisation, interview coaching, career strategy consulting, and related advisory services. The specific deliverables for each engagement are determined by the package selected or agreed upon in writing prior to commencement.", "All services are delivered digitally. Final documents are delivered via email in the formats specified at the time of engagement. No physical materials are produced or shipped."],
      ar: ["تقدّم Zenith Dubai CV خدمات وثائق المسار المهني الاحترافية، تشمل كتابة السيَر الذاتية وإعداد خطابات التغطية وتحسين ملفات لينكدإن والتدريب على المقابلات واستشارات استراتيجية المسار المهني وغيرها. تُحدَّد المخرجات المحددة لكل تعاقد وفقاً للباقة المختارة أو المتفق عليها كتابةً قبل الشروع في العمل.", "تُقدَّم جميع الخدمات رقمياً. تُسلَّم المستندات النهائية عبر البريد الإلكتروني بالصيغ المحددة وقت التعاقد. لا يتم إنتاج أي مواد مادية أو شحنها."],
      fr: ["Zenith Dubai CV fournit des services professionnels de documents de carrière, notamment la rédaction de CV, la création de lettres de motivation, l'optimisation de profil LinkedIn, le coaching entretien, le conseil en stratégie de carrière et des services connexes. Les livrables spécifiques de chaque engagement sont définis par le forfait choisi ou convenu par écrit avant le démarrage.", "Tous les services sont fournis numériquement. Les documents finaux sont livrés par e-mail dans les formats spécifiés au moment de l'engagement. Aucun support physique n'est produit ni expédié."],
    },
  },
  {
    id: "03",
    title: { en: "User Responsibilities", ar: "مسؤوليات العميل", fr: "Responsabilités de l'utilisateur" },
    body: {
      en: ["You are responsible for providing accurate, complete, and truthful information about your career history, qualifications, and objectives. Zenith Dubai CV relies entirely on the information you provide to create your documents. We are not responsible for inaccuracies in final documents that result from inaccurate or incomplete information supplied by you.", "You confirm that all information you provide is your own and does not infringe the intellectual property or confidentiality obligations of any third party. You agree not to use our services for any unlawful purpose."],
      ar: ["أنت مسؤول عن تقديم معلومات دقيقة وكاملة وصادقة حول تاريخك المهني ومؤهلاتك وأهدافك. تعتمد Zenith Dubai CV كلياً على المعلومات التي تقدّمها لإعداد مستنداتك. لسنا مسؤولين عن أي عدم دقة في المستندات النهائية ناتج عن معلومات غير دقيقة أو ناقصة قدّمتها.", "تُقرّ بأن جميع المعلومات التي تقدّمها خاصة بك ولا تنتهك الملكية الفكرية أو التزامات السرية لأي طرف ثالث. كما توافق على عدم استخدام خدماتنا لأي غرض غير مشروع."],
      fr: ["Vous êtes responsable de fournir des informations exactes, complètes et véridiques sur votre parcours professionnel, vos qualifications et vos objectifs. Zenith Dubai CV se base entièrement sur les informations que vous fournissez pour créer vos documents. Nous ne sommes pas responsables des inexactitudes dans les documents finaux résultant d'informations incorrectes ou incomplètes.", "Vous confirmez que toutes les informations fournies vous appartiennent et ne portent pas atteinte aux droits de propriété intellectuelle ou aux obligations de confidentialité de tiers. Vous vous engagez à ne pas utiliser nos services à des fins illégales."],
    },
  },
  {
    id: "04",
    title: { en: "Payments & Refund Policy", ar: "المدفوعات وسياسة الاسترداد", fr: "Paiements et remboursements" },
    body: {
      en: ["All prices are stated in UAE Dirhams (AED). Payment is due in full prior to the commencement of any work. By submitting payment, you confirm that you have read and agreed to these Terms of Service. We reserve the right to adjust pricing at any time, but changes will not affect engagements already confirmed and paid.", "We offer a full refund if you request cancellation before the intake process is complete and no work has commenced. Once work has commenced, refunds are assessed on a case-by-case basis. If you are not satisfied after the revision process has been completed in good faith, please contact us directly — we are committed to reaching a fair resolution."],
      ar: ["جميع الأسعار بالدرهم الإماراتي (AED). الدفع مستحق بالكامل قبل الشروع في أي عمل. بتقديمك الدفعة، تُقرّ بأنك قرأت شروط الخدمة هذه وتوافق عليها. نحتفظ بحق تعديل الأسعار في أي وقت، غير أن التغييرات لن تؤثر على التعاقدات المؤكدة والمدفوعة مسبقاً.", "نُقدّم استرداداً كاملاً في حال طلبك الإلغاء قبل إتمام عملية الاستقبال ودون البدء في أي عمل. بعد الشروع في العمل، يُقيَّم الاسترداد حالةً بحالة. إذا لم تكن راضياً بعد إتمام عملية المراجعة بحسن نية، يُرجى التواصل معنا مباشرةً — نلتزم بالتوصل إلى حل عادل."],
      fr: ["Tous les prix sont indiqués en Dirhams des Émirats arabes unis (AED). Le paiement est dû intégralement avant le début de tout travail. En effectuant votre paiement, vous confirmez avoir lu et accepté ces Conditions. Nous nous réservons le droit de modifier les tarifs à tout moment, mais sans effet sur les engagements déjà confirmés et payés.", "Nous offrons un remboursement complet si vous demandez l'annulation avant la fin du processus d'intégration et sans démarrage des travaux. Une fois les travaux commencés, les remboursements sont évalués au cas par cas. Si vous n'êtes pas satisfait après révision de bonne foi, contactez-nous directement — nous nous engageons à une résolution équitable."],
    },
  },
  {
    id: "05",
    title: { en: "Delivery", ar: "التسليم", fr: "Livraison" },
    body: {
      en: ["Standard delivery for all packages is 48 hours from the completion of the client intake process. This timeline begins once we have received all necessary information from you, including your career background, target markets, and objectives.", "Delivery timelines are estimates and may be extended in exceptional circumstances. We will notify you promptly if a delay is anticipated. Delays attributable to late submission of client intake information do not affect our delivery obligation timeline."],
      ar: ["يبلغ وقت التسليم القياسي لجميع الباقات 48 ساعة من اكتمال عملية الاستقبال. يبدأ هذا الإطار الزمني فور استلامنا جميع المعلومات الضرورية منك، بما تشمل خلفيتك المهنية وأسواقك المستهدفة وأهدافك.", "أوقات التسليم تقديرية وقد تمتد في ظروف استثنائية. سنخطرك فوراً في حال توقع أي تأخير. لا تؤثر التأخيرات الناجمة عن تأخر العميل في تقديم معلومات الاستقبال على التزامنا بموعد التسليم."],
      fr: ["Le délai de livraison standard pour tous les forfaits est de 48 heures à compter de la finalisation du processus d'intégration. Ce délai commence dès réception de toutes les informations nécessaires de votre part.", "Les délais de livraison sont indicatifs et peuvent être prolongés dans des circonstances exceptionnelles. Nous vous notifierons promptement en cas de retard anticipé. Les retards imputables au client n'affectent pas notre obligation de livraison."],
    },
  },
  {
    id: "06",
    title: { en: "Revisions", ar: "المراجعات", fr: "Révisions" },
    body: {
      en: ["All packages include unlimited revision rounds until the client is fully satisfied with the deliverables. Revisions must be requested within 30 days of the initial delivery. Revision requests submitted after this period may be subject to additional charges.", "Revisions are scoped to the content and structure of the original deliverables. Requests that constitute a fundamental change in direction — such as targeting an entirely new industry or career level — may be treated as a new engagement at our sole discretion."],
      ar: ["تشمل جميع الباقات جولات مراجعة غير محدودة حتى يكون العميل راضياً تماماً عن المخرجات. يجب تقديم طلبات المراجعة في غضون 30 يوماً من التسليم الأولي. قد تخضع طلبات المراجعة المقدَّمة بعد هذه الفترة لرسوم إضافية.", "تقتصر المراجعات على محتوى وهيكل المخرجات الأصلية. قد تُعامَل الطلبات التي تشكّل تغييراً جوهرياً في الاتجاه باعتبارها تعاقداً جديداً وفق تقديرنا المنفرد."],
      fr: ["Tous les forfaits incluent des révisions illimitées jusqu'à la pleine satisfaction du client. Les révisions doivent être demandées dans les 30 jours suivant la livraison initiale. Les demandes soumises après ce délai peuvent entraîner des frais supplémentaires.", "Les révisions sont limitées au contenu et à la structure des livrables originaux. Les demandes constituant un changement fondamental de direction peuvent être traitées comme un nouvel engagement à notre seule discrétion."],
    },
  },
  {
    id: "07",
    title: { en: "Intellectual Property", ar: "الملكية الفكرية", fr: "Propriété intellectuelle" },
    body: {
      en: ["Upon full payment and delivery, you are granted full ownership of all documents created for you by Zenith Dubai CV. You may use, modify, and distribute these documents freely for your personal career purposes.", "Zenith Dubai CV retains the right to use anonymised or aggregated insights derived from client engagements for internal quality improvement and training purposes only. We will never publish, attribute, or share identifiable client content without explicit written consent."],
      ar: ["عند اكتمال الدفع والتسليم، تُمنح ملكية كاملة لجميع المستندات التي أعدّتها Zenith Dubai CV خصيصاً لك. يحق لك استخدام هذه المستندات وتعديلها وتوزيعها بحرية لأغراض مسارك المهني الشخصي.", "تحتفظ Zenith Dubai CV بحق استخدام الرؤى المجهولة الهوية أو الموحّدة المستخلصة من تعاقدات العملاء لأغراض تحسين الجودة الداخلية والتدريب فقط. لن نقوم أبداً بنشر محتوى عملاء قابل للتعريف دون موافقة خطية صريحة."],
      fr: ["Dès le paiement intégral et la livraison, vous obtenez la pleine propriété de tous les documents créés pour vous par Zenith Dubai CV. Vous pouvez les utiliser, les modifier et les distribuer librement à des fins personnelles de carrière.", "Zenith Dubai CV se réserve le droit d'utiliser des informations anonymisées tirées des engagements clients uniquement à des fins d'amélioration interne et de formation. Nous ne publierons jamais de contenu client identifiable sans consentement écrit explicite."],
    },
  },
  {
    id: "08",
    title: { en: "Confidentiality", ar: "السرية", fr: "Confidentialité" },
    body: {
      en: ["All information shared with us in the course of an engagement is treated as strictly confidential. We do not share your personal career information, documents, or correspondence with any third party without your explicit consent, except as required by applicable law.", "We expect clients to treat any proprietary methodologies, templates, or strategic frameworks shared during an engagement as confidential and not to reproduce or distribute them."],
      ar: ["تُعامَل جميع المعلومات التي تشاركها معنا في سياق التعاقد بسرية تامة. لا نشارك معلوماتك المهنية الشخصية أو مستنداتك أو مراسلاتك مع أي طرف ثالث دون موافقتك الصريحة، إلا إذا اقتضى القانون المعمول به ذلك.", "نتوقع من العملاء معاملة أي منهجيات خاصة أو قوالب أو أطر استراتيجية تُشارك خلال التعاقد بسرية وعدم إعادة إنتاجها أو توزيعها."],
      fr: ["Toutes les informations partagées avec nous lors d'un engagement sont traitées comme strictement confidentielles. Nous ne partageons pas vos informations de carrière, documents ou correspondances avec des tiers sans votre consentement explicite, sauf si la loi l'exige.", "Nous attendons des clients qu'ils traitent toute méthodologie propriétaire, modèle ou cadre stratégique partagé lors d'un engagement comme confidentiel et qu'ils ne les reproduisent ni ne les distribuent."],
    },
  },
  {
    id: "09",
    title: { en: "Limitation of Liability", ar: "تحديد المسؤولية", fr: "Limitation de responsabilité" },
    body: {
      en: ["Zenith Dubai CV provides career document services and professional guidance. We do not guarantee any specific outcome, including but not limited to employment, interview invitations, salary increases, or career advancement. The effectiveness of career documents depends on many factors outside our control.", "Our total liability to any client in connection with any engagement shall not exceed the total amount paid by the client for that engagement. We are not liable for any indirect, consequential, or incidental damages arising from the use of our services."],
      ar: ["تقدّم Zenith Dubai CV خدمات وثائق المسار المهني والإرشاد المهني. لا نضمن أي نتيجة محددة، بما في ذلك على سبيل المثال: الحصول على وظيفة أو دعوات للمقابلات أو زيادات في الراتب أو التقدم الوظيفي. تعتمد فعالية وثائق المسار المهني على عوامل كثيرة خارجة عن سيطرتنا.", "لا تتجاوز مسؤوليتنا الإجمالية تجاه أي عميل المبلغ الإجمالي المدفوع من قِبَل العميل لذلك التعاقد. لسنا مسؤولين عن أي أضرار غير مباشرة أو تبعية أو عرضية ناجمة عن استخدام خدماتنا."],
      fr: ["Zenith Dubai CV fournit des services de documents de carrière et des conseils professionnels. Nous ne garantissons aucun résultat spécifique, notamment l'emploi, les invitations à des entretiens, les augmentations de salaire ou l'avancement de carrière.", "Notre responsabilité totale envers tout client ne saurait dépasser le montant total payé pour l'engagement concerné. Nous ne sommes pas responsables des dommages indirects, consécutifs ou accessoires découlant de l'utilisation de nos services."],
    },
  },
  {
    id: "10",
    title: { en: "Disclaimer", ar: "إخلاء المسؤولية", fr: "Avis de non-responsabilité" },
    body: {
      en: ["Our services are provided 'as is' and 'as available'. To the fullest extent permitted by law, we disclaim all warranties, express or implied, regarding our services, including warranties of merchantability, fitness for a particular purpose, and non-infringement.", "We reserve the right to modify, suspend, or discontinue any aspect of our services at any time. We do not warrant that our website will be uninterrupted or error-free."],
      ar: ["تُقدَّم خدماتنا 'كما هي' و'حسب التوفر'. بالقدر الأقصى المسموح به قانوناً، نُخلي مسؤوليتنا من جميع الضمانات الصريحة أو الضمنية المتعلقة بخدماتنا، بما في ذلك ضمانات القابلية للتسويق والملاءمة لغرض معين وعدم الانتهاك.", "نحتفظ بحق تعديل أي جانب من جوانب خدماتنا أو تعليقها أو إيقافها في أي وقت. لا نضمن أن موقعنا سيعمل دون انقطاع أو أخطاء."],
      fr: ["Nos services sont fournis 'en l'état' et 'selon disponibilité'. Dans toute la mesure permise par la loi, nous déclinons toute garantie, expresse ou implicite, concernant nos services.", "Nous nous réservons le droit de modifier, suspendre ou interrompre tout aspect de nos services à tout moment. Nous ne garantissons pas que notre site fonctionnera sans interruption ni erreur."],
    },
  },
  {
    id: "11",
    title: { en: "Termination", ar: "الإنهاء", fr: "Résiliation" },
    body: {
      en: ["We reserve the right to refuse service to, or terminate an engagement with, any client who provides false information, engages in abusive or inappropriate conduct, or violates any of these Terms of Service.", "In the event of termination for cause attributable to the client, no refund will be issued for work already commenced. In the event of termination at our discretion without cause, a proportionate refund will be provided."],
      ar: ["نحتفظ بحق رفض الخدمة لأي عميل أو إنهاء التعاقد معه إذا قدّم معلومات كاذبة أو انخرط في سلوك مسيء أو غير لائق أو انتهك أياً من شروط الخدمة هذه.", "في حال إنهاء التعاقد لأسباب تُعزى إلى العميل، لن يُقدَّم أي استرداد للعمل الذي تم الشروع فيه. في حال إنهاء التعاقد بموجب تقديرنا دون مبرر، سيُقدَّم استرداد متناسب."],
      fr: ["Nous nous réservons le droit de refuser nos services ou de mettre fin à un engagement avec tout client qui fournit de fausses informations, adopte un comportement abusif ou enfreint ces Conditions.", "En cas de résiliation pour cause imputable au client, aucun remboursement ne sera accordé pour les travaux déjà commencés. En cas de résiliation sans cause à notre discrétion, un remboursement proportionnel sera fourni."],
    },
  },
  {
    id: "12",
    title: { en: "Governing Law", ar: "القانون الحاكم", fr: "Droit applicable" },
    body: {
      en: ["These Terms of Service are governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising from or related to these terms or our services shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.", "If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect. These terms constitute the entire agreement between you and Zenith Dubai CV regarding your use of our services."],
      ar: ["تخضع شروط الخدمة هذه وتُفسَّر وفقاً لقوانين الإمارات العربية المتحدة. تخضع أي نزاعات ناشئة عن هذه الشروط أو خدماتنا للاختصاص الحصري لمحاكم دبي بالإمارات.", "إذا وجدت محكمة مختصة أن أي بند من هذه الشروط غير قابل للتنفيذ، يظل سريان الأحكام المتبقية بكامل قوته. تُشكّل هذه الشروط الاتفاقية الكاملة بينك وبين Zenith Dubai CV."],
      fr: ["Ces Conditions d'utilisation sont régies et interprétées conformément aux lois des Émirats arabes unis. Tout litige sera soumis à la juridiction exclusive des tribunaux de Dubaï, EAU.", "Si une disposition est jugée inapplicable, les dispositions restantes continueront à s'appliquer pleinement. Ces conditions constituent l'accord complet entre vous et Zenith Dubai CV."],
    },
  },
  {
    id: "13",
    title: { en: "Contact Information", ar: "معلومات التواصل", fr: "Coordonnées" },
    body: {
      en: ["If you have any questions about these Terms of Service, or wish to clarify anything before engaging our services, please contact us at info@zenithdubaicv.com or via WhatsApp at +971 50 287 9462.", "Zenith Dubai CV · Dubai, United Arab Emirates · We are available to clarify any aspect of these terms and committed to conducting all engagements with transparency and professionalism."],
      ar: ["إذا كانت لديك أي أسئلة حول شروط الخدمة هذه، أو ترغب في توضيح أي شيء قبل التعامل مع خدماتنا، يُرجى التواصل معنا على info@zenithdubaicv.com أو عبر واتساب على 9462 287 50 971+.", "Zenith Dubai CV · دبي، الإمارات العربية المتحدة · نحن متاحون لتوضيح أي جانب من جوانب هذه الشروط، ونلتزم بإجراء جميع التعاقدات بشفافية واحترافية."],
      fr: ["Pour toute question concernant ces Conditions, contactez-nous à info@zenithdubaicv.com ou via WhatsApp au +971 50 287 9462.", "Zenith Dubai CV · Dubaï, Émirats arabes unis · Nous sommes disponibles pour clarifier tout aspect de ces conditions et nous engageons à conduire tous nos engagements avec transparence et professionnalisme."],
    },
  },
];

function Rise({ children, d = 0, className = "" }: { children: React.ReactNode; d?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5% 0px" }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: d }}>
      {children}
    </motion.div>
  );
}

export default function TermsOfService() {
  const [dark, setDark] = useState(() => { if (typeof window === "undefined") return true; const s = localStorage.getItem("z-theme"); return s !== null ? s === "dark" : true; });
  const [lang, setLang] = useState<Lang>("en");
  const [langOpen, setLangOpen] = useState(false);
  const tog = () => { const n = !dark; setDark(n); localStorage.setItem("z-theme", n ? "dark" : "light"); };
  useEffect(() => { document.title = `${UI.pageTitle[lang]} · Zenith Dubai CV`; }, [lang]);

  const LG  = LANGS.find(l => l.code === lang)!;
  const bg  = dark ? INK : ASH;
  const hi  = dark ? "#EDE8E0" : "#1A1410";
  const sub = dark ? "#857870" : "#786860";
  const bdr = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const nav = dark ? "rgba(10,9,7,0.94)" : "rgba(245,241,235,0.95)";
  const logoFilter = dark ? "brightness(1.08) drop-shadow(0 0 8px rgba(212,175,55,0.15)) drop-shadow(0 2px 6px rgba(0,0,0,0.50))" : "brightness(0) saturate(0) contrast(1)";
  const grad = `linear-gradient(${LG.dir === "rtl" ? "270deg" : "90deg"},${G}60,transparent)`;

  return (
    <div className="min-h-screen w-full transition-colors duration-700" dir={LG.dir} style={{ background: bg, color: hi, fontFamily: LG.font }}>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
      {dark && <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: `radial-gradient(ellipse 70% 50% at 50% -5%,${G}09,transparent 65%)` }} />}

      <header className="fixed top-0 inset-x-0 z-50" style={{ background: nav, backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", borderBottom: dark ? "none" : `1px solid ${bdr}` }}>
        {dark && <div aria-hidden className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.12) 15%,rgba(212,175,55,0.55) 50%,rgba(212,175,55,0.12) 85%,transparent)" }} />}
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8" style={{ height: "76px" }}>
          <a href="/" style={{ lineHeight: 0 }}>
            <img src="/images/logo.png" alt="Zenith Dubai CV" style={{ height: "auto", width: "100px", objectFit: "contain", display: "block", borderRadius: "8px", filter: logoFilter, transition: "filter 0.4s ease", paddingTop: "4px" }} />
          </a>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button type="button" onClick={() => setLangOpen(o => !o)} className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.15em] uppercase px-3 rounded-full" style={{ border: `1px solid ${dark ? "rgba(200,169,110,0.28)" : `${G}32`}`, color: dark ? "#C8A96E" : G, height: "32px", fontFamily: "sans-serif", minWidth: "62px", justifyContent: "center", background: "transparent", transition: "border-color 0.25s ease" }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = dark ? "rgba(212,175,55,0.55)" : `${G}55`; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = dark ? "rgba(200,169,110,0.28)" : `${G}32`; }}>
                <Globe size={10} strokeWidth={1.5} />{LG.label}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.2 }} className="absolute top-10 right-0 rounded-xl overflow-hidden z-50" style={{ background: dark ? "#111009" : "#F5F1EB", border: dark ? "1px solid rgba(200,169,110,0.16)" : `1px solid ${bdr}`, boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.65)" : "0 8px 24px rgba(0,0,0,0.12)", minWidth: "136px" }}>
                    {LANGS.map(l => (
                      <button key={l.code} type="button" onClick={() => { setLang(l.code); setLangOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[11px]" style={{ color: l.code === lang ? (dark ? "#D4AF37" : G) : hi, fontFamily: "sans-serif", background: l.code === lang ? (dark ? "rgba(212,175,55,0.07)" : `${G}07`) : "transparent", fontWeight: l.code === lang ? 600 : 400, border: "none", cursor: "pointer", textAlign: "start" }}>
                        {l.code === lang && <span className="h-1 w-1 rounded-full shrink-0" style={{ background: dark ? "#D4AF37" : G }} />}
                        <span style={{ marginInlineStart: l.code === lang ? "0" : "9px" }}>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a href="/" className="hidden sm:flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] uppercase transition-opacity hover:opacity-70" style={{ color: dark ? "rgba(200,169,110,0.55)" : `${hi}65`, fontFamily: "sans-serif", textDecoration: "none" }}>
              <ArrowLeft size={11} strokeWidth={1.5} />{UI.backHome[lang]}
            </a>
            <button type="button" onClick={tog} aria-label="Toggle theme" className="flex items-center justify-center rounded-full" style={{ border: dark ? "1px solid rgba(200,169,110,0.16)" : `1px solid ${bdr}`, width: "32px", height: "32px", opacity: 0.45, background: "transparent", transition: "opacity 0.2s ease" }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.80"; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.45"; }}>
              {dark ? <Sun size={12} color="#D4AF37" strokeWidth={1.5} /> : <Moon size={12} color={hi} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-[76px]">
        <div className="mx-auto max-w-3xl px-8 py-24">
          <Rise d={0.1}>
            <p className="text-[10px] font-medium tracking-[0.42em] uppercase mb-5" style={{ color: G, fontFamily: "sans-serif" }}>{UI.legal[lang]}</p>
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight leading-[1.08] mb-5" style={{ color: hi }}>{UI.pageTitle[lang]}</h1>
            <p className="text-sm mb-16" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>{UI.lastUpdated[lang]}</p>
            <div className="h-px mb-16" style={{ background: grad }} />
          </Rise>
          <Rise d={0.15} className="mb-4">
            <p className="text-base leading-[1.95]" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>{UI.intro[lang]}</p>
          </Rise>
          <div className="flex flex-col">
            {SECTIONS.map((s, i) => (
              <Rise key={s.id} d={0.03 * i}>
                <div className="flex gap-8 py-10" style={{ borderTop: `1px solid ${bdr}` }}>
                  <div className="shrink-0 w-7 pt-1">
                    <span className="text-[10px]" style={{ color: G, fontFamily: "sans-serif", opacity: 0.5, fontWeight: 500 }}>{s.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-normal mb-5 tracking-tight" style={{ color: hi }}>{s.title[lang]}</h2>
                    {s.body[lang].map((para, j) => (
                      <p key={j} className="text-sm leading-[1.95] mb-4 last:mb-0" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>{para}</p>
                    ))}
                  </div>
                </div>
              </Rise>
            ))}
          </div>
          <Rise d={0.1} className="mt-16">
            <div className="h-px mb-12" style={{ background: grad }} />
            <p className="text-sm leading-[1.9] mb-8" style={{ color: sub, fontFamily: "sans-serif", fontWeight: 300 }}>{UI.questions[lang]}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`mailto:${EM}`} className="flex items-center justify-center gap-2 px-8 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-85" style={{ background: G, color: INK, height: "48px", fontFamily: "sans-serif" }}>{UI.emailUs[lang]}</a>
              <a href={wlMsg} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-8 text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all hover:opacity-70" style={{ border: `1px solid ${G}40`, color: G, height: "48px", fontFamily: "sans-serif" }}>{UI.whatsapp[lang]}</a>
            </div>
          </Rise>
        </div>

        <footer className="relative py-10 px-8" style={{ borderTop: dark ? "none" : `1px solid ${bdr}` }}>
          {dark && <div aria-hidden className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.10) 15%,rgba(212,175,55,0.55) 50%,rgba(212,175,55,0.10) 85%,transparent)" }} />}
          <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="text-[10px]" style={{ color: dark ? "rgba(200,169,110,0.20)" : `${hi}30`, fontFamily: "sans-serif" }}>{UI.copyright[lang]}</p>
            <div className="flex items-center gap-4">
              <a href="/privacy-policy" className="text-[10px] transition-opacity hover:opacity-70" style={{ color: dark ? "rgba(200,169,110,0.35)" : `${hi}45`, fontFamily: "sans-serif", textDecoration: "none" }}>{UI.privacyLink[lang]}</a>
              <span style={{ color: bdr, fontSize: "10px" }}>·</span>
              <a href="/terms-of-service" className="text-[10px]" style={{ color: G, fontFamily: "sans-serif", textDecoration: "none", opacity: 0.65 }}>{UI.termsLink[lang]}</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}