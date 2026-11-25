// components/about/copy.ts — every word on the About page, in English, French and Arabic.
// Founder facts come only from the verified background the founder supplied (Nov 2026):
// 11+ years hospitality operations and management, including international luxury hospitality;
// 7+ years in Dubai; 7+ years building businesses (business development, e-commerce, UI/UX,
// web development, digital media). No degrees, awards, employers or results are claimed.
// Service promises match the FAQ, the Refund Policy and the homepage: first draft within 48 hours
// of a complete brief, unlimited revisions for 30 days within the brief, refund within 7 days.

import type { L10n } from "@/lib/site";

type L = L10n;

export const FOUNDER_NAME = "Abdelilah El Khayir";

export const META = {
  title: "About Zenith Dubai",
  description:
    "Zenith Dubai is a career engineering company founded by a hospitality operator: positioning, CVs, LinkedIn profiles, applications and interview preparation for professionals moving across the Gulf, Europe, North America and Asia.",
};

export const CHAPTERS: { id: string; label: L }[] = [
  { id: "philosophy", label: { en: "Philosophy", fr: "Philosophie", ar: "فلسفتنا" } },
  { id: "founder", label: { en: "Founder", fr: "Fondateur", ar: "المؤسس" } },
  { id: "disciplines", label: { en: "Disciplines", fr: "Disciplines", ar: "التخصصات" } },
  { id: "method", label: { en: "Method", fr: "Méthode", ar: "المنهج" } },
  { id: "markets", label: { en: "Markets", fr: "Marchés", ar: "الأسواق" } },
  { id: "technology", label: { en: "Technology", fr: "Technologie", ar: "التقنية" } },
  { id: "working", label: { en: "Working together", fr: "Travailler ensemble", ar: "العمل معاً" } },
  { id: "standard", label: { en: "Our standard", fr: "Notre exigence", ar: "معاييرنا" } },
];

export const UI = {
  onThisPage: { en: "On this page", fr: "Sur cette page", ar: "في هذه الصفحة" } as L,
  skip: { en: "Skip to content", fr: "Aller au contenu", ar: "انتقل إلى المحتوى" } as L,
};

export const HERO = {
  h1: {
    en: "The standard of luxury hospitality, applied to your career.",
    fr: "L'exigence de l'hôtellerie de luxe, appliquée à votre carrière.",
    ar: "معايير الضيافة الفاخرة، مطبّقة على مسيرتك المهنية.",
  } as L,
  lede: {
    en: "Zenith Dubai is a career engineering company. We decide how you should be positioned, build the documents that carry that position, and prepare you for the conversations they open, in English, French or Arabic.",
    fr: "Zenith Dubai est une entreprise d'ingénierie de carrière. Nous définissons votre positionnement, concevons les documents qui le portent et vous préparons aux entretiens qu'ils ouvrent, en français, en anglais ou en arabe.",
    ar: "Zenith Dubai شركة متخصصة في هندسة المسارات المهنية. نحدد كيف يجب أن تُقدَّم، ونبني المستندات التي تحمل هذا التموضع، ونهيّئك للمقابلات التي تفتحها، بالعربية أو الإنجليزية أو الفرنسية.",
  } as L,
  xray: { en: "Run the free CV X-Ray", fr: "Lancer la radiographie gratuite", ar: "ابدأ فحص السيرة المجاني" } as L,
  packages: { en: "See packages", fr: "Voir les formules", ar: "عرض الباقات" } as L,
};

export const PHILOSOPHY = {
  h2: {
    en: "A CV is the last step, not the first.",
    fr: "Le CV est la dernière étape, pas la première.",
    ar: "السيرة الذاتية هي الخطوة الأخيرة، لا الأولى.",
  } as L,
  p: {
    en: "Most CV services start writing on the first day. We start by deciding what you should be known for, in the market you are aiming at. The documents come after, built to carry that position past screening software and in front of the person who decides.",
    fr: "La plupart des services commencent à rédiger dès le premier jour. Nous commençons par définir ce pour quoi vous devez être reconnu, sur le marché que vous visez. Les documents viennent ensuite, conçus pour porter ce positionnement à travers les logiciels de tri, jusqu'à la personne qui décide.",
    ar: "تبدأ معظم خدمات السير الذاتية بالكتابة منذ اليوم الأول. أما نحن فنبدأ بتحديد ما يجب أن تُعرف به في السوق الذي تستهدفه. ثم تأتي المستندات، مصمَّمة لتحمل هذا التموضع عبر أنظمة الفرز وصولاً إلى من يتخذ القرار.",
  } as L,
  principles: [
    {
      name: { en: "Position", fr: "Positionner", ar: "التموضع" } as L,
      text: {
        en: "Decide the role, the market and the story that connects your experience to them.",
        fr: "Choisir le poste, le marché et le récit qui relie votre parcours à cette cible.",
        ar: "تحديد الدور والسوق والقصة التي تربط خبرتك بهما.",
      } as L,
    },
    {
      name: { en: "Engineer", fr: "Concevoir", ar: "الهندسة" } as L,
      text: {
        en: "Build every document to be read correctly by software and quickly by a person.",
        fr: "Construire chaque document pour être lu correctement par un logiciel et rapidement par un recruteur.",
        ar: "بناء كل مستند ليقرأه النظام بدقة ويقرأه الإنسان بسرعة.",
      } as L,
    },
    {
      name: { en: "Prepare", fr: "Préparer", ar: "التحضير" } as L,
      text: {
        en: "Rehearse the conversation the documents open, until it sounds like you.",
        fr: "Répéter l'entretien que les documents ouvrent, jusqu'à ce qu'il vous ressemble.",
        ar: "التدرّب على المقابلة التي تفتحها المستندات، حتى تشبهك.",
      } as L,
    },
  ],
};

export const FOUNDER = {
  role: { en: "Founder & CEO", fr: "Fondateur et PDG", ar: "المؤسس والرئيس التنفيذي" } as L,
  statement: {
    en: "A first impression is designed, not improvised.",
    fr: "Une première impression se conçoit, elle ne s'improvise pas.",
    ar: "الانطباع الأول يُصمَّم، لا يُرتجل.",
  } as L,
  story: [
    {
      en: `${FOUNDER_NAME} spent more than eleven years in hospitality operations and management, including international luxury hospitality, and more than seven years in Dubai. In that world, guests never see the preparation behind a flawless evening. They only feel the result.`,
      fr: `${FOUNDER_NAME} a passé plus de onze ans dans l'exploitation et le management hôteliers, notamment dans l'hôtellerie de luxe internationale, et plus de sept ans à Dubaï. Dans cet univers, le client ne voit jamais la préparation derrière une soirée parfaite. Il n'en ressent que le résultat.`,
      ar: "أمضى مؤسس Zenith Dubai أكثر من أحد عشر عاماً في تشغيل قطاع الضيافة وإدارته، بما في ذلك الضيافة الفاخرة الدولية، وأكثر من سبع سنوات في دبي. في ذلك العالم، لا يرى الضيف التحضير الذي يقف خلف أمسية مثالية، بل يشعر بالنتيجة فقط.",
    },
    {
      en: "Alongside operations, he spent more than seven years building businesses of his own, across business development, e-commerce, UI/UX design, web development and digital media.",
      fr: "En parallèle, il a consacré plus de sept ans à bâtir ses propres activités : développement commercial, e-commerce, design UI/UX, développement web et médias numériques.",
      ar: "وإلى جانب العمليات، أمضى أكثر من سبع سنوات في بناء مشاريعه الخاصة في تطوير الأعمال والتجارة الإلكترونية وتصميم واجهات المستخدم وتجربته وتطوير المواقع والإعلام الرقمي.",
    },
    {
      en: "Zenith Dubai joins the two. Hospitality taught him that the way a person is presented decides how they are received. Building digital products taught him how to make that quality repeatable. The company runs on both: human judgement on every document, and technology that carries the heavy work around it.",
      fr: "Zenith Dubai réunit les deux. L'hôtellerie lui a appris que la manière dont une personne est présentée décide de la façon dont elle est reçue. La création de produits numériques lui a appris à rendre cette qualité reproductible. L'entreprise repose sur les deux : un jugement humain sur chaque document, et une technologie qui prend en charge le travail lourd autour.",
      ar: "تجمع Zenith Dubai بين العالمين. علّمته الضيافة أن طريقة تقديم الشخص تحدد كيف يُستقبَل، وعلّمه بناء المنتجات الرقمية كيف يجعل هذه الجودة قابلة للتكرار. وتقوم الشركة على الأمرين معاً: حكم بشري على كل مستند، وتقنية تتولى العمل الثقيل من حوله.",
    },
  ] as L[],
  quote: {
    en: "A well-written document is not enough. A career needs positioning, strategy, technology, presentation and execution.",
    fr: "Un document bien écrit ne suffit pas. Une carrière demande un positionnement, une stratégie, de la technologie, une présentation et une exécution.",
    ar: "المستند المكتوب جيداً لا يكفي. المسيرة المهنية تحتاج إلى تموضع واستراتيجية وتقنية وحسن تقديم وتنفيذ.",
  } as L,
  facts: [
    {
      value: { en: "11+ years", fr: "11+ ans", ar: "أكثر من 11 عاماً" } as L,
      label: { en: "Hospitality operations and management", fr: "Exploitation et management hôteliers", ar: "تشغيل قطاع الضيافة وإدارته" } as L,
    },
    {
      value: { en: "7+ years", fr: "7+ ans", ar: "أكثر من 7 سنوات" } as L,
      label: { en: "Working in Dubai", fr: "À Dubaï", ar: "في دبي" } as L,
    },
    {
      value: { en: "7+ years", fr: "7+ ans", ar: "أكثر من 7 سنوات" } as L,
      label: {
        en: "Building businesses: business development, e-commerce, UI/UX, web, digital media",
        fr: "Création d'entreprises : développement commercial, e-commerce, UI/UX, web, médias numériques",
        ar: "بناء المشاريع: تطوير الأعمال، التجارة الإلكترونية، تجربة المستخدم، الويب، الإعلام الرقمي",
      } as L,
    },
  ],
  alt: {
    en: `${FOUNDER_NAME}, founder and CEO of Zenith Dubai`,
    fr: `${FOUNDER_NAME}, fondateur et PDG de Zenith Dubai`,
    ar: `${FOUNDER_NAME}، مؤسس Zenith Dubai ورئيسها التنفيذي`,
  } as L,
};

export const DISCIPLINES = {
  h2: { en: "Four disciplines in every engagement", fr: "Quatre disciplines dans chaque mission", ar: "أربعة تخصصات في كل مهمة" } as L,
  intro: {
    en: "Every order draws on the same four areas of expertise, whichever package you choose.",
    fr: "Chaque commande mobilise les mêmes quatre domaines d'expertise, quelle que soit la formule choisie.",
    ar: "كل طلب يعتمد على مجالات الخبرة الأربعة نفسها، أياً كانت الباقة التي تختارها.",
  } as L,
  usedIn: { en: "Used in", fr: "Au service de", ar: "تُستخدم في" } as L,
  items: [
    {
      slug: "strategy",
      name: { en: "Career Strategy & Professional Positioning", fr: "Stratégie de carrière et positionnement", ar: "الاستراتيجية المهنية والتموضع" } as L,
      text: {
        en: "Defines what you should be known for: target roles, market, seniority, and the story that connects your experience to them.",
        fr: "Définit ce pour quoi vous devez être reconnu : postes visés, marché, niveau, et le récit qui relie votre expérience à ces cibles.",
        ar: "تحدد ما يجب أن تُعرف به: الوظائف المستهدفة والسوق والمستوى، والقصة التي تربط خبرتك بها.",
      } as L,
      uses: [
        { en: "Career strategy session", fr: "Séance de stratégie de carrière", ar: "جلسة الاستراتيجية المهنية" },
        { en: "Career-narrative session", fr: "Séance de récit de carrière", ar: "جلسة سرد المسار المهني" },
        { en: "Cover letters", fr: "Lettres de motivation", ar: "رسائل التقديم" },
      ] as L[],
    },
    {
      slug: "ats",
      name: { en: "Recruitment Intelligence & ATS Optimisation", fr: "Intelligence du recrutement et optimisation ATS", ar: "ذكاء التوظيف والتوافق مع أنظمة ATS" } as L,
      text: {
        en: "Builds each CV to be read correctly by applicant tracking systems and quickly by a recruiter: clean structure, the language of real job ads, results you can prove.",
        fr: "Construit chaque CV pour être lu correctement par les logiciels de recrutement (ATS) et rapidement par un recruteur : structure nette, vocabulaire des vraies offres, résultats vérifiables.",
        ar: "تبني كل سيرة ذاتية لتقرأها أنظمة تتبّع المتقدمين بدقة ويقرأها مسؤول التوظيف بسرعة: بنية واضحة، ولغة الإعلانات الوظيفية الحقيقية، ونتائج يمكنك إثباتها.",
      } as L,
      uses: [
        { en: "ATS CV writing", fr: "Rédaction de CV optimisé ATS", ar: "كتابة سيرة متوافقة مع ATS" },
        { en: "Free CV X-Ray", fr: "Radiographie CV gratuite", ar: "فحص السيرة المجاني" },
        { en: "Executive CV design", fr: "Design de CV exécutif", ar: "تصميم السيرة التنفيذية" },
      ] as L[],
    },
    {
      slug: "executive",
      name: { en: "Executive Branding & Global Mobility", fr: "Image de dirigeant et mobilité internationale", ar: "العلامة القيادية والتنقل الدولي" } as L,
      text: {
        en: "Positions senior profiles and international moves: leadership narrative, LinkedIn for a new market, and the conventions of the country you are targeting.",
        fr: "Positionne les profils seniors et les projets à l'international : récit de leadership, LinkedIn pour un nouveau marché, et les codes du pays visé.",
        ar: "تموضع الملفات القيادية والانتقالات الدولية: سرد قيادي، وملف LinkedIn لسوق جديدة، وأعراف البلد الذي تستهدفه.",
      } as L,
      uses: [
        { en: "Full LinkedIn transformation", fr: "Transformation LinkedIn complète", ar: "تحويل كامل لملف LinkedIn" },
        { en: "Portfolio & branding kit", fr: "Kit portfolio et image", ar: "حزمة الملف التعريفي والعلامة الشخصية" },
        { en: "Executive Career Suite", fr: "Executive Career Suite", ar: "Executive Career Suite" },
      ] as L[],
    },
    {
      slug: "technology",
      name: { en: "Digital Products & AI Career Technology", fr: "Produits numériques et technologie de carrière IA", ar: "المنتجات الرقمية وتقنيات المسار المهني" } as L,
      text: {
        en: "Builds and runs the tools: the CV X-Ray, the AI job agent and the interview coach, with usage limits and privacy designed in from the start.",
        fr: "Conçoit et exploite les outils : la radiographie CV, l'agent emploi IA et le coach d'entretien, avec des limites d'usage et la confidentialité intégrées dès le départ.",
        ar: "تبني الأدوات وتشغّلها: فحص السيرة، ووكيل الوظائف بالذكاء الاصطناعي، ومدرّب المقابلات، مع حدود استخدام وخصوصية مصمَّمة منذ البداية.",
      } as L,
      uses: [
        { en: "AI job agent", fr: "Agent emploi IA", ar: "وكيل الوظائف بالذكاء الاصطناعي" },
        { en: "AI interview coach", fr: "Coach d'entretien IA", ar: "مدرّب المقابلات بالذكاء الاصطناعي" },
        { en: "AI profile photo", fr: "Photo de profil IA", ar: "صورة الملف الشخصي بالذكاء الاصطناعي" },
      ] as L[],
    },
  ],
};

export const METHOD = {
  h2: { en: "How a career is engineered", fr: "Comment une carrière se conçoit", ar: "كيف تُهندَس المسيرة المهنية" } as L,
  steps: [
    {
      name: { en: "Diagnose", fr: "Diagnostiquer", ar: "التشخيص" } as L,
      text: {
        en: "We read your CV the way screening software does, and compare it with the roles you want.",
        fr: "Nous lisons votre CV comme un logiciel de tri, puis le comparons aux postes visés.",
        ar: "نقرأ سيرتك كما تقرؤها أنظمة الفرز، ونقارنها بالوظائف التي تريدها.",
      } as L,
    },
    {
      name: { en: "Position", fr: "Positionner", ar: "التموضع" } as L,
      text: {
        en: "We agree your target: role, level, market, and the story that makes you the obvious candidate.",
        fr: "Nous fixons votre cible : poste, niveau, marché, et le récit qui fait de vous le candidat évident.",
        ar: "نتفق على هدفك: الدور والمستوى والسوق، والقصة التي تجعلك المرشح الأنسب.",
      } as L,
    },
    {
      name: { en: "Engineer", fr: "Concevoir", ar: "الهندسة" } as L,
      text: {
        en: "We rewrite your CV and profile from your real experience, around results and the language of the role.",
        fr: "Nous réécrivons votre CV et votre profil à partir de votre expérience réelle, autour de vos résultats et du vocabulaire du poste.",
        ar: "نعيد كتابة سيرتك وملفك من خبرتك الحقيقية، حول نتائجك ولغة الوظيفة.",
      } as L,
    },
    {
      name: { en: "Rehearse", fr: "Répéter", ar: "التدريب" } as L,
      text: {
        en: "You practise the interview out loud and get scored feedback with an action plan.",
        fr: "Vous vous entraînez à voix haute et recevez une évaluation notée avec un plan d'action.",
        ar: "تتدرّب على المقابلة بصوت مسموع وتحصل على تقييم بالدرجات وخطة عمل.",
      } as L,
    },
    {
      name: { en: "Advance", fr: "Avancer", ar: "التقدّم" } as L,
      text: {
        en: "You apply with documents built for each market, and track every application through to the offer.",
        fr: "Vous postulez avec des documents adaptés à chaque marché et suivez chaque candidature jusqu'à l'offre.",
        ar: "تتقدّم بمستندات مُعدّة لكل سوق، وتتابع كل طلب حتى العرض.",
      } as L,
    },
  ],
  note: {
    en: "Which steps are included depends on the package or services you choose.",
    fr: "Les étapes incluses dépendent de la formule ou des services choisis.",
    ar: "تعتمد الخطوات المشمولة على الباقة أو الخدمات التي تختارها.",
  } as L,
};

export const MARKETS = {
  h2: { en: "One CV does not travel.", fr: "Un CV ne voyage pas tel quel.", ar: "سيرة واحدة لا تصلح لكل البلدان." } as L,
  intro: {
    en: "Each market reads a CV differently: its length, whether a photo belongs on it, which personal details to include, even what it is called. We adapt every document to the conventions of the country you are applying to.",
    fr: "Chaque marché lit un CV différemment : sa longueur, la place de la photo, les informations personnelles à inclure, jusqu'à son nom. Nous adaptons chaque document aux usages du pays visé.",
    ar: "كل سوق يقرأ السيرة الذاتية بطريقة مختلفة: طولها، ووجود الصورة من عدمه، والبيانات الشخصية المطلوبة، وحتى اسمها. نكيّف كل مستند مع أعراف البلد الذي تتقدم إليه.",
  } as L,
  items: [
    {
      name: { en: "Canada", fr: "Canada", ar: "كندا" } as L,
      text: {
        en: "A résumé of one or two pages. No photo, date of birth or marital status.",
        fr: "Un « résumé » d'une ou deux pages. Pas de photo, ni date de naissance, ni situation familiale.",
        ar: "سيرة من صفحة أو صفحتين، دون صورة أو تاريخ ميلاد أو حالة اجتماعية.",
      } as L,
    },
    {
      name: { en: "United States", fr: "États-Unis", ar: "الولايات المتحدة" } as L,
      text: {
        en: "A résumé, often one page early in a career. No photo or personal details; results first.",
        fr: "Un « résumé », souvent d'une page en début de carrière. Pas de photo ni d'informations personnelles ; les résultats d'abord.",
        ar: "سيرة غالباً من صفحة واحدة في بداية المسار، دون صورة أو بيانات شخصية، والنتائج أولاً.",
      } as L,
    },
    {
      name: { en: "United Kingdom", fr: "Royaume-Uni", ar: "المملكة المتحدة" } as L,
      text: {
        en: "A CV of about two pages with a short personal profile. No photo.",
        fr: "Un CV d'environ deux pages avec un court profil personnel. Pas de photo.",
        ar: "سيرة من صفحتين تقريباً مع نبذة شخصية قصيرة، دون صورة.",
      } as L,
    },
    {
      name: { en: "European Union", fr: "Union européenne", ar: "الاتحاد الأوروبي" } as L,
      text: {
        en: "Conventions vary by country. A photo is still common in some, such as Germany; the Europass format suits some public and academic roles.",
        fr: "Les usages varient selon les pays. La photo reste courante dans certains, comme l'Allemagne ; le format Europass convient à certains postes publics et académiques.",
        ar: "تختلف الأعراف من بلد لآخر؛ ما زالت الصورة شائعة في بعضها مثل ألمانيا، ويناسب نموذج Europass بعض الوظائف العامة والأكاديمية.",
      } as L,
    },
    {
      name: { en: "UAE & GCC", fr: "Émirats et pays du Golfe", ar: "الإمارات ودول الخليج" } as L,
      text: {
        en: "A photo, nationality and visa status are commonly included, along with notice period and languages.",
        fr: "La photo, la nationalité et le statut de visa sont couramment indiqués, avec le préavis et les langues.",
        ar: "يُدرَج عادةً الصورة والجنسية ووضع التأشيرة، إلى جانب فترة الإشعار واللغات.",
      } as L,
    },
    {
      name: { en: "Singapore & Asia", fr: "Singapour et Asie", ar: "سنغافورة وآسيا" } as L,
      text: {
        en: "Concise and achievement-led. Work-pass or residency status is often relevant; conventions differ across Asian markets.",
        fr: "Concis et centré sur les résultats. Le statut de résidence ou de permis de travail compte souvent ; les usages varient selon les marchés asiatiques.",
        ar: "سيرة موجزة تركّز على الإنجازات. وغالباً ما يكون وضع الإقامة أو تصريح العمل مهماً، وتختلف الأعراف بين أسواق آسيا.",
      } as L,
    },
  ],
  disclaimer: {
    en: "We provide career services, not immigration or legal advice. We do not guarantee interviews, job offers, visas or work permits.",
    fr: "Nous fournissons des services de carrière, pas de conseil juridique ni en immigration. Nous ne garantissons ni entretiens, ni offres d'emploi, ni visas, ni permis de travail.",
    ar: "نقدم خدمات مهنية، لا استشارات قانونية أو استشارات هجرة. ولا نضمن المقابلات أو عروض العمل أو التأشيرات أو تصاريح العمل.",
  } as L,
};

export const TECHNOLOGY = {
  h2: {
    en: "Technology that works for you, not instead of you",
    fr: "Une technologie à votre service, pas à votre place",
    ar: "تقنية تعمل لأجلك، لا بدلاً منك",
  } as L,
  intro: {
    en: "Our tools do the slow, repetitive work so human judgement goes where it matters. Each one says what it can and cannot do.",
    fr: "Nos outils font le travail lent et répétitif, pour que le jugement humain aille là où il compte. Chacun dit ce qu'il peut faire, et ce qu'il ne peut pas faire.",
    ar: "تتولى أدواتنا العمل البطيء والمتكرر، ليتجه الحكم البشري إلى حيث يهم. وكل أداة توضح ما تستطيع فعله وما لا تستطيع.",
  } as L,
  tools: [
    {
      name: { en: "CV X-Ray", fr: "Radiographie CV", ar: "فحص السيرة" } as L,
      text: {
        en: "Free. Reads your CV the way screening software does and shows what to fix first. Your file never leaves your device.",
        fr: "Gratuit. Lit votre CV comme un logiciel de tri et montre quoi corriger d'abord. Votre fichier ne quitte jamais votre appareil.",
        ar: "مجاني. يقرأ سيرتك كما تقرؤها أنظمة الفرز ويبيّن ما يجب إصلاحه أولاً. لا يغادر ملفك جهازك.",
      } as L,
      cta: { en: "Run the X-Ray", fr: "Lancer la radiographie", ar: "ابدأ الفحص" } as L,
      href: "/x-ray/",
    },
    {
      name: { en: "AI job agent", fr: "Agent emploi IA", ar: "وكيل الوظائف" } as L,
      text: {
        en: "Finds jobs that fit your CV across public job sources, ranks them and prepares each application with you. You approve every step. Search and ranking are free.",
        fr: "Trouve les offres adaptées à votre CV sur des sources publiques, les classe et prépare chaque candidature avec vous. Vous validez chaque étape. La recherche et le classement sont gratuits.",
        ar: "يجد الوظائف المناسبة لسيرتك من مصادر عامة، ويرتّبها ويُعدّ كل طلب معك. أنت توافق على كل خطوة. البحث والترتيب مجانيان.",
      } as L,
      cta: { en: "Open the agent", fr: "Ouvrir l'agent", ar: "افتح الوكيل" } as L,
      href: "/agent/",
    },
    {
      name: { en: "Interview coach", fr: "Coach d'entretien", ar: "مدرّب المقابلات" } as L,
      text: {
        en: "An animated interviewer, not a real person, asks questions for your role in English, French or Arabic, follows up on your answers and scores them on eight criteria.",
        fr: "Un recruteur animé, pas une vraie personne, pose les questions de votre poste en français, anglais ou arabe, relance sur vos réponses et les note sur huit critères.",
        ar: "محاور متحرك، وليس شخصاً حقيقياً، يطرح أسئلة وظيفتك بالعربية أو الإنجليزية أو الفرنسية، ويتابع إجاباتك ويقيّمها وفق ثمانية معايير.",
      } as L,
      cta: { en: "See the coach", fr: "Voir le coach", ar: "اطّلع على المدرّب" } as L,
      href: "/agent/#interview",
    },
  ],
  honest: {
    en: "No tool can predict a hiring decision. Scores show how well a document or an answer meets common criteria, not your chance of an offer.",
    fr: "Aucun outil ne peut prédire une décision d'embauche. Les scores indiquent dans quelle mesure un document ou une réponse répond à des critères courants, pas vos chances d'obtenir une offre.",
    ar: "لا توجد أداة تستطيع التنبؤ بقرار التوظيف. الدرجات تبيّن مدى استيفاء المستند أو الإجابة للمعايير الشائعة، لا فرصتك في الحصول على عرض.",
  } as L,
};

export const WORKING = {
  h2: { en: "Working together", fr: "Travailler ensemble", ar: "كيف نعمل معاً" } as L,
  steps: [
    {
      name: { en: "Choose", fr: "Choisir", ar: "الاختيار" } as L,
      text: {
        en: "Choose a package, or build your own from individual services. Pay securely, with no subscription.",
        fr: "Choisissez une formule, ou composez la vôtre à partir des services. Paiement sécurisé, sans abonnement.",
        ar: "اختر باقة أو كوّن باقتك من الخدمات الفردية. دفع آمن ودون اشتراك.",
      } as L,
    },
    {
      name: { en: "Brief", fr: "Brief", ar: "الملخص" } as L,
      text: {
        en: "Send your brief: your current CV, the roles you are aiming for, and anything we should know.",
        fr: "Envoyez votre brief : votre CV actuel, les postes visés et tout ce que nous devons savoir.",
        ar: "أرسل ملخصك: سيرتك الحالية، والوظائف التي تستهدفها، وأي معلومة يجب أن نعرفها.",
      } as L,
    },
    {
      name: { en: "Draft", fr: "Première version", ar: "المسودة" } as L,
      text: {
        en: "Receive your first draft within 48 hours of your complete brief.",
        fr: "Recevez votre première version sous 48 heures après réception de votre brief complet.",
        ar: "استلم المسودة الأولى خلال 48 ساعة من استلام ملخصك كاملاً.",
      } as L,
    },
    {
      name: { en: "Refine", fr: "Affiner", ar: "التحسين" } as L,
      text: {
        en: "Refine it with unlimited revisions for 30 days after delivery, within your original brief.",
        fr: "Affinez-la avec des révisions illimitées pendant 30 jours après la livraison, dans le cadre de votre brief initial.",
        ar: "حسّنها بتعديلات غير محدودة لمدة 30 يوماً بعد التسليم، ضمن نطاق ملخصك الأصلي.",
      } as L,
    },
  ],
};

export const CLOSING = {
  h2: { en: "Start with what the software sees.", fr: "Commencez par ce que voit le logiciel.", ar: "ابدأ بما يراه النظام." } as L,
  p: {
    en: "Run the free CV X-Ray, then tell us about the role you want. We reply within 24 hours.",
    fr: "Lancez la radiographie CV gratuite, puis parlez-nous du poste que vous visez. Nous répondons sous 24 heures.",
    ar: "ابدأ فحص السيرة المجاني، ثم أخبرنا عن الوظيفة التي تريدها. نرد خلال 24 ساعة.",
  } as L,
  whatsapp: { en: "Message us on WhatsApp", fr: "Écrire sur WhatsApp", ar: "راسلنا عبر واتساب" } as L,
  waText: "Hello Zenith Dubai. I read your About page and I'd like to talk about my career.",
};
