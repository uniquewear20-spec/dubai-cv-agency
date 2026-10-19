// lib/cv-concepts.ts — the CV design concepts shown in the "CV designs" section.
//
// Every profile here is FICTIONAL demonstration content written by Zenith to show design and
// writing standards. None of these people, documents or results are real, employers are
// described generically on purpose, and contact details are masked. The page labels each
// document as a fictional example. Do not replace them with real client documents unless the
// client has given written permission and personal details have been removed.

import type { L10n, Lang } from "@/lib/site";

export type CvField = "executive" | "finance" | "hospitality" | "technology" | "healthcare" | "creative" | "early";
export type CvLayout = "classic" | "ledger" | "sidebar" | "editorial";

export interface CvRole {
  role: string;
  org: string;
  dates: string;
  bullets: string[];
}

export interface CvContent {
  name: string;
  title: string;
  location: string;
  contact: string[];
  summary: string;
  /** Optional short facts shown as a band (executive layouts). */
  facts?: { value: string; label: string }[];
  experience: CvRole[];
  education: string[];
  skills: string[];
  languages: string[];
  certifications?: string[];
  projects?: string[];
  /** Further sections (selected deals, openings, projects…), shown after experience. */
  extra?: { title: string; items: string[] }[];
  /** Section titles in the document's own language. */
  labels: {
    profile: string;
    experience: string;
    education: string;
    skills: string;
    languages: string;
    certifications?: string;
    projects?: string;
    contact: string;
  };
  /** Order of the main sections; education first suits early-career profiles. */
  educationFirst?: boolean;
}

export interface CvPalette {
  paper: string;
  ink: string;
  muted: string;
  accent: string;
  rule: string;
  /** Sidebar or band background, where the layout has one. */
  panel: string;
  panelInk: string;
  panelMuted: string;
}

export interface CvConcept {
  id: string;
  styleName: string;
  field: CvField;
  level: L10n;
  layout: CvLayout;
  docLang: Lang;
  headingFont: "serif" | "sans" | "arabic-serif";
  bodyFont: "serif" | "sans" | "arabic";
  palette: CvPalette;
  approach: L10n;
  positioning: L10n;
  ats: L10n;
  cv: CvContent;
}

export const FIELD_LABELS: Record<CvField, L10n> = {
  executive: { en: "Executive", fr: "Direction", ar: "القيادة التنفيذية" },
  finance: { en: "Finance", fr: "Finance", ar: "المالية" },
  hospitality: { en: "Hospitality", fr: "Hôtellerie", ar: "الضيافة" },
  technology: { en: "Technology", fr: "Technologie", ar: "التقنية" },
  healthcare: { en: "Healthcare", fr: "Santé", ar: "الرعاية الصحية" },
  creative: { en: "Creative", fr: "Création", ar: "الإبداع" },
  early: { en: "Early career", fr: "Début de carrière", ar: "بداية المسار المهني" },
};

const EN_LABELS = {
  profile: "Profile",
  experience: "Experience",
  education: "Education",
  skills: "Expertise",
  languages: "Languages",
  certifications: "Certifications",
  projects: "Projects",
  contact: "Contact",
};

const ONE_COLUMN_ATS: L10n = {
  en: "Single column, real text and standard headings, so it reads cleanly in applicant tracking systems.",
  fr: "Une seule colonne, du vrai texte et des titres standard : il se lit sans difficulté dans les logiciels de recrutement (ATS).",
  ar: "عمود واحد ونص حقيقي وعناوين قياسية، فيُقرأ بسلاسة في أنظمة تتبّع المتقدمين.",
};
const TWO_COLUMN_ATS: L10n = {
  en: "Two columns suit direct applications and networking. For online portals we also supply a single-column version.",
  fr: "Les deux colonnes conviennent aux candidatures directes et au réseau. Pour les portails en ligne, nous fournissons aussi une version en une colonne.",
  ar: "العمودان مناسبان للتقديم المباشر والتواصل المهني، ونوفّر أيضاً نسخة بعمود واحد لبوابات التوظيف الإلكترونية.",
};

export const CV_CONCEPTS: CvConcept[] = [
  {
    id: "boardroom",
    styleName: "Boardroom",
    field: "executive",
    level: { en: "C-suite", fr: "Comité de direction", ar: "الإدارة العليا" },
    layout: "classic",
    docLang: "en",
    headingFont: "serif",
    bodyFont: "serif",
    palette: { paper: "#FFFDF8", ink: "#1B1712", muted: "#6B5F52", accent: "#9C7A35", rule: "#D9CBB0", panel: "#F4EEE2", panelInk: "#1B1712", panelMuted: "#6B5F52" },
    approach: {
      en: "A centred serif masthead and a band of headline facts give board readers scale before they reach the detail.",
      fr: "Un en-tête centré en serif et une bande de chiffres clés donnent l'envergure du parcours avant même le détail.",
      ar: "ترويسة بخط مزخرف في المنتصف وشريط من الأرقام الأساسية يُظهران حجم المسيرة قبل الدخول في التفاصيل.",
    },
    positioning: {
      en: "For executives in board-level and headhunter-led searches, where scope and judgement matter more than task lists.",
      fr: "Pour les dirigeants en recherche par chasseur de têtes, où l'envergure et le jugement comptent plus que les listes de tâches.",
      ar: "للقياديين في عمليات البحث على مستوى مجالس الإدارة وشركات البحث التنفيذي، حيث يهم حجم المسؤولية أكثر من قوائم المهام.",
    },
    ats: ONE_COLUMN_ATS,
    cv: {
      name: "Nadia Haroun",
      title: "Chief Operating Officer",
      location: "Dubai, United Arab Emirates",
      contact: ["+971 •• ••• ••••", "n.haroun@•••••.com"],
      summary:
        "Operations executive with 18 years across hospitality and mixed-use real estate in the GCC. Builds the systems and leadership teams that let a portfolio grow without losing its standards. Board-facing, and fluent in English, Arabic and French.",
      facts: [
        { value: "12", label: "properties opened" },
        { value: "AED 1.4bn", label: "portfolio led" },
        { value: "2,300", label: "colleagues" },
      ],
      experience: [
        {
          role: "Chief Operating Officer",
          org: "Mixed-use developer and hotel operator, Dubai",
          dates: "2019 – present",
          bullets: [
            "Lead operations for a 12-asset portfolio of hotels, residences and retail, reporting to the CEO and board.",
            "Rebuilt the pre-opening playbook, cutting the time from handover to opening by 11 weeks.",
            "Introduced a group-wide service programme now used by 2,300 colleagues.",
          ],
        },
        {
          role: "Vice President, Operations",
          org: "Regional hospitality group, Riyadh",
          dates: "2014 – 2019",
          bullets: [
            "Directed seven properties through a period of rapid expansion.",
            "Consolidated suppliers across the group, reducing annual procurement costs by 9%.",
          ],
        },
        {
          role: "General Manager",
          org: "Five-star resort, Abu Dhabi",
          dates: "2009 – 2014",
          bullets: [
            "Led a 420-key resort through repositioning and a full renovation.",
            "Raised guest satisfaction into the top quartile of the brand's regional portfolio.",
          ],
        },
      ],
      extra: [{ title: "Board and industry", items: ["Member of a hospitality advisory council, 2021 – present", "Regular speaker at regional hospitality investment forums"] }],
      education: ["Executive MBA, London, 2013", "BSc Hospitality Management, Switzerland, 2006"],
      skills: ["Portfolio operations", "Pre-opening", "P&L leadership", "Board reporting", "Change management"],
      languages: ["English", "Arabic", "French"],
      labels: EN_LABELS,
    },
  },
  {
    id: "ledger",
    styleName: "Ledger",
    field: "finance",
    level: { en: "Senior", fr: "Confirmé", ar: "مستوى متقدم" },
    layout: "ledger",
    docLang: "en",
    headingFont: "sans",
    bodyFont: "sans",
    palette: { paper: "#FFFFFF", ink: "#14202E", muted: "#5A6573", accent: "#1F4E79", rule: "#D3DAE3", panel: "#EEF2F7", panelInk: "#14202E", panelMuted: "#5A6573" },
    approach: {
      en: "Dates and figures align on a strict right-hand rail, so a reviewer can scan a decade of deals in seconds.",
      fr: "Dates et chiffres s'alignent sur une colonne droite stricte : dix ans d'opérations se lisent en quelques secondes.",
      ar: "تصطف التواريخ والأرقام على محور أيمن صارم، فيستطيع المراجع استعراض عقد من الصفقات في ثوانٍ.",
    },
    positioning: {
      en: "For banking, advisory and corporate finance roles, where precision is the first thing being judged.",
      fr: "Pour la banque, le conseil et la finance d'entreprise, où la précision est jugée en premier.",
      ar: "لوظائف المصارف والاستشارات والتمويل المؤسسي، حيث تُقيَّم الدقة أولاً.",
    },
    ats: ONE_COLUMN_ATS,
    cv: {
      name: "Daniel Okoro",
      title: "Vice President, Corporate Finance",
      location: "London, United Kingdom",
      contact: ["+44 •••• ••••••", "d.okoro@•••••.com"],
      summary:
        "Corporate finance professional with 11 years in M&A advisory and strategic finance across Europe and the Middle East. Known for clean models, clear investment cases and calm execution under deadline.",
      experience: [
        {
          role: "Vice President, Corporate Finance",
          org: "Investment bank, EMEA coverage, London",
          dates: "2021 – present",
          bullets: [
            "Led execution on nine sell-side and buy-side mandates with a combined value of £2.1bn.",
            "Built the team's valuation templates, now the standard on every live deal.",
            "Supervise four analysts and associates.",
          ],
        },
        {
          role: "Associate, Mergers & Acquisitions",
          org: "Advisory boutique, Dubai",
          dates: "2017 – 2021",
          bullets: [
            "Prepared investment memoranda and models for GCC family-office clients.",
            "Coordinated due diligence across legal, tax and commercial advisers.",
            "Ran the analyst recruitment programme for the Dubai office.",
          ],
        },
        {
          role: "Analyst, Financial Planning & Analysis",
          org: "Telecoms operator, Lagos",
          dates: "2014 – 2017",
          bullets: ["Produced monthly forecasts for a $600m revenue base.", "Built the capital expenditure tracker used by the CFO's office."],
        },
      ],
      extra: [{ title: "Selected transactions", items: ["Sale of a GCC logistics business to a European strategic buyer, £640m, 2024", "Acquisition financing for a healthcare platform, £310m, 2023", "Minority stake sale in a fintech company, £85m, 2022"] }],
      education: ["MSc Finance, London, 2014", "BSc Economics, Lagos, 2012"],
      certifications: ["CFA Program, Level III candidate"],
      skills: ["Valuation (DCF, LBO)", "Financial modelling", "Due diligence", "Board papers", "Excel and Power BI"],
      languages: ["English (native)", "French (professional)"],
      labels: EN_LABELS,
    },
  },
  {
    id: "maison",
    styleName: "Maison",
    field: "hospitality",
    level: { en: "Director", fr: "Directeur", ar: "مدير" },
    layout: "sidebar",
    docLang: "en",
    headingFont: "serif",
    bodyFont: "sans",
    palette: { paper: "#FFFCF7", ink: "#231A14", muted: "#6E6056", accent: "#8C5A2B", rule: "#E6D9C7", panel: "#F3E9DA", panelInk: "#231A14", panelMuted: "#6E6056" },
    approach: {
      en: "A warm sidebar holds languages and expertise, keeping the main column free for openings, covers and cost results.",
      fr: "Une colonne latérale chaleureuse regroupe langues et expertise ; la colonne principale reste dédiée aux ouvertures, couverts et résultats.",
      ar: "عمود جانبي دافئ يضم اللغات والخبرات، ويترك العمود الرئيسي للافتتاحات وأعداد الضيوف ونتائج التكلفة.",
    },
    positioning: {
      en: "For luxury hotel and restaurant leaders, where guest experience and commercial discipline both have to show.",
      fr: "Pour les responsables d'hôtels et de restaurants de luxe, qui doivent montrer l'expérience client et la rigueur commerciale.",
      ar: "لقادة الفنادق والمطاعم الفاخرة، حيث يجب أن تظهر تجربة الضيف والانضباط التجاري معاً.",
    },
    ats: TWO_COLUMN_ATS,
    cv: {
      name: "Sofia Benali",
      title: "Director of Food & Beverage",
      location: "Dubai, United Arab Emirates",
      contact: ["+971 •• ••• ••••", "s.benali@•••••.com"],
      summary:
        "Food and beverage leader from the luxury segment, with restaurant openings and multi-outlet hotel operations in Dubai and Marrakech. Pairs warm, precise service with tight cost control.",
      experience: [
        {
          role: "Director of Food & Beverage",
          org: "Five-star hotel with nine outlets, Dubai",
          dates: "2020 – present",
          bullets: [
            "Run nine outlets and in-room dining: a team of 240 and AED 96m in annual revenue.",
            "Opened a fine-dining concept that entered a national restaurant guide in its first season.",
            "Brought food cost from 31% to 27.5% through menu engineering and supplier reviews.",
            "Introduced a beverage programme that lifted beverage revenue by 18%.",
          ],
        },
        {
          role: "Restaurant Manager",
          org: "Fine-dining restaurant, Marrakech",
          dates: "2016 – 2020",
          bullets: [
            "Led a 60-cover dining room and a 14-person service brigade.",
            "Raised average spend per cover by 14% through service sequencing and wine pairing.",
            "Kept 90% of the team for more than a year in a high-turnover market.",
          ],
        },
        {
          role: "Assistant Manager",
          org: "Beach club, Dubai",
          dates: "2013 – 2016",
          bullets: ["Managed daily service for up to 500 guests on peak days."],
        },
      ],
      extra: [{ title: "Selected openings", items: ["Fine-dining restaurant, Dubai, 2022", "Rooftop lounge, Dubai, 2021", "Seasonal beach concept, Marrakech, 2018"] }],
      education: ["Diploma in Hospitality Management, Morocco, 2012"],
      certifications: ["Wine and spirits qualification, Level 3"],
      skills: ["Pre-opening", "Menu engineering", "Beverage programmes", "Service standards", "Revenue management"],
      languages: ["English", "French", "Arabic"],
      labels: EN_LABELS,
    },
  },
  {
    id: "signal",
    styleName: "Signal",
    field: "technology",
    level: { en: "Manager", fr: "Manager", ar: "مدير فريق" },
    layout: "sidebar",
    docLang: "en",
    headingFont: "sans",
    bodyFont: "sans",
    palette: { paper: "#FFFFFF", ink: "#111827", muted: "#4B5563", accent: "#0F766E", rule: "#E2E8F0", panel: "#0F1B2A", panelInk: "#F1F5F9", panelMuted: "#A9B6C6" },
    approach: {
      en: "A dark sidebar groups the technical stack, so the main column can tell the story of systems shipped and teams grown.",
      fr: "Une colonne sombre regroupe la stack technique ; la colonne principale raconte les systèmes livrés et les équipes construites.",
      ar: "عمود جانبي داكن يجمع الأدوات التقنية، ليحكي العمود الرئيسي قصة الأنظمة المنجزة والفرق التي نمت.",
    },
    positioning: {
      en: "For engineers moving into leadership, who need to show both technical depth and the results of their teams.",
      fr: "Pour les ingénieurs qui évoluent vers le management et doivent montrer à la fois leur expertise et les résultats de leurs équipes.",
      ar: "للمهندسين المنتقلين إلى القيادة، الذين يحتاجون إلى إظهار العمق التقني ونتائج فرقهم معاً.",
    },
    ats: TWO_COLUMN_ATS,
    cv: {
      name: "Arjun Mehta",
      title: "Engineering Manager, Platform",
      location: "Singapore",
      contact: ["+65 •••• ••••", "a.mehta@•••••.com"],
      summary:
        "Engineering manager who builds reliable platforms and the teams behind them. Nine years in payments and logistics software, still hands-on with distributed systems and cloud cost.",
      experience: [
        {
          role: "Engineering Manager, Platform",
          org: "Payments scale-up, Singapore",
          dates: "2022 – present",
          bullets: [
            "Lead three teams of 18 engineers that own the core payments platform.",
            "Cut p99 API latency by 38% and cloud spend by 22% in one year.",
            "Set up on-call and incident reviews that halved repeat incidents.",
            "Grew the platform group from 7 to 18 engineers with a structured interview loop.",
          ],
        },
        {
          role: "Senior Software Engineer",
          org: "Logistics platform, Bengaluru",
          dates: "2018 – 2022",
          bullets: [
            "Designed the routing service behind 1.2m deliveries a day.",
            "Led the move of 40 services to Kubernetes without customer-facing downtime.",
            "Mentored six engineers, three of whom were promoted.",
          ],
        },
        {
          role: "Software Engineer",
          org: "Enterprise software company, Bengaluru",
          dates: "2016 – 2018",
          bullets: ["Built reporting APIs for retail clients in four countries."],
        },
      ],
      extra: [{ title: "Selected projects", items: ["Payments ledger rewrite: a double-entry design processing 3m transactions a day", "Cost dashboard that gives every team its own cloud bill", "Talks on platform reliability at regional engineering meetups"] }],
      education: ["B.Tech Computer Science, India, 2016"],
      skills: ["Go, TypeScript, Python", "Kubernetes and AWS", "PostgreSQL and Kafka", "Hiring and career frameworks", "Roadmapping"],
      languages: ["English", "Hindi"],
      labels: EN_LABELS,
    },
  },
  {
    id: "clinical",
    styleName: "Clinical",
    field: "healthcare",
    level: { en: "Manager", fr: "Cadre", ar: "مدير" },
    layout: "ledger",
    docLang: "en",
    headingFont: "sans",
    bodyFont: "sans",
    palette: { paper: "#FFFFFF", ink: "#13241F", muted: "#4F625C", accent: "#1D6B57", rule: "#D5E3DE", panel: "#EAF3F0", panelInk: "#13241F", panelMuted: "#4F625C" },
    approach: {
      en: "Licences and certifications sit near the top, and results are framed as patient outcomes rather than duties.",
      fr: "Diplômes et certifications figurent en haut ; les résultats sont présentés en bénéfices pour les patients, pas en tâches.",
      ar: "تأتي التراخيص والشهادات في الأعلى، وتُعرض النتائج كمخرجات للمرضى لا كقائمة مهام.",
    },
    positioning: {
      en: "For clinical leaders applying to hospital groups that screen first for licensing, then for leadership.",
      fr: "Pour les cadres de santé qui postulent dans des groupes hospitaliers vérifiant d'abord les diplômes, puis le leadership.",
      ar: "للقيادات السريرية المتقدمة إلى مجموعات مستشفيات تفحص التراخيص أولاً ثم القيادة.",
    },
    ats: ONE_COLUMN_ATS,
    cv: {
      name: "Grace Mwangi",
      title: "Critical Care Nurse Manager",
      location: "Abu Dhabi, United Arab Emirates",
      contact: ["+971 •• ••• ••••", "g.mwangi@•••••.com"],
      summary:
        "Critical care nurse with 12 years in adult intensive care, six of them in leadership. Focused on patient safety, staff development and evidence-based practice.",
      certifications: ["Registered Nurse, UAE licence (active)", "Advanced cardiac life support", "Basic life support instructor"],
      experience: [
        {
          role: "Nurse Manager, Adult ICU",
          org: "Tertiary hospital with 34 ICU beds, Abu Dhabi",
          dates: "2020 – present",
          bullets: [
            "Manage 85 nurses across a 34-bed adult intensive care unit.",
            "Led a central-line bundle project that reduced bloodstream infections by 41% over 18 months.",
            "Introduced a nurse-led early-warning review that cut unplanned ICU readmissions by 18%.",
            "Recruited and onboarded 22 nurses during a unit expansion.",
          ],
        },
        {
          role: "Charge Nurse, ICU",
          org: "University hospital, Nairobi",
          dates: "2015 – 2020",
          bullets: ["Coordinated shifts of up to 14 nurses and mentored new graduates.", "Led the unit's sepsis-bundle audit for two consecutive years."],
        },
        {
          role: "Staff Nurse, ICU",
          org: "Referral hospital, Nairobi",
          dates: "2012 – 2015",
          bullets: ["Cared for ventilated and post-surgical patients."],
        },
      ],
      extra: [{ title: "Professional development", items: ["Leadership programme for nurse managers, 2021", "Clinical audit and quality improvement course, 2019"] }],
      education: ["MSc Nursing (Critical Care), 2015", "BSc Nursing, 2011"],
      skills: ["Critical care", "Staff rostering", "Clinical audit", "Infection prevention", "Mentoring"],
      languages: ["English", "Swahili"],
      labels: EN_LABELS,
    },
  },
  {
    id: "editorial",
    styleName: "Editorial",
    field: "creative",
    level: { en: "Director", fr: "Directeur", ar: "مدير" },
    layout: "editorial",
    docLang: "en",
    headingFont: "serif",
    bodyFont: "sans",
    palette: { paper: "#FBF8F4", ink: "#1F1622", muted: "#675B69", accent: "#6B2D5C", rule: "#E5D9E2", panel: "#F2E9EF", panelInk: "#1F1622", panelMuted: "#675B69" },
    approach: {
      en: "An oversized serif name and an asymmetric grid show taste on the page itself, without leaning on graphics.",
      fr: "Un nom en grand serif et une grille asymétrique montrent le goût sur la page elle-même, sans recourir aux illustrations.",
      ar: "اسم بخط مزخرف كبير وشبكة غير متماثلة تُظهر الذوق على الصفحة نفسها دون الاعتماد على الرسومات.",
    },
    positioning: {
      en: "For brand, content and creative leaders, whose CV is read as a sample of their judgement.",
      fr: "Pour les responsables de marque, de contenu et de création, dont le CV est lu comme un échantillon de leur jugement.",
      ar: "لقادة العلامات التجارية والمحتوى والإبداع، الذين تُقرأ سيرتهم الذاتية كنموذج على ذوقهم وحكمهم.",
    },
    ats: TWO_COLUMN_ATS,
    cv: {
      name: "Léa Marchand",
      title: "Brand & Content Director",
      location: "Dubai and Paris",
      contact: ["+971 •• ••• ••••", "l.marchand@•••••.com", "Portfolio on request"],
      summary:
        "Brand and content director who turns positioning into campaigns people remember. Has led creative for luxury, beauty and travel brands across Europe and the Gulf.",
      experience: [
        {
          role: "Brand & Content Director",
          org: "Luxury beauty house, Dubai",
          dates: "2021 – present",
          bullets: [
            "Lead a 12-person studio covering brand, social, CRM and retail content in four languages.",
            "Relaunched the regional social channels; engaged audience grew 3.4 times in 14 months.",
            "Wrote the house's first content style guide and creative review process.",
          ],
        },
        {
          role: "Senior Creative Lead",
          org: "Independent agency, Paris",
          dates: "2016 – 2021",
          bullets: ["Led campaigns for travel and fashion clients in 11 markets.", "Won two regional creative awards for a destination campaign."],
        },
        {
          role: "Copywriter",
          org: "Advertising agency, Paris",
          dates: "2012 – 2016",
          bullets: ["Wrote launch campaigns for fragrance and hospitality brands.", "Moved from junior to lead copywriter within three years."],
        },
      ],
      extra: [{ title: "Tools", items: ["Figma", "Adobe Creative Cloud", "Notion", "Meta Business Suite"] }],
      education: ["MA Communication and Media, Paris, 2012"],
      skills: ["Brand strategy", "Creative direction", "Editorial calendars", "Campaign concepts", "Team leadership"],
      languages: ["French", "English", "Arabic (conversational)"],
      labels: EN_LABELS,
    },
  },
  {
    id: "foundation",
    styleName: "Foundation",
    field: "early",
    level: { en: "Graduate", fr: "Jeune diplômé", ar: "حديث التخرج" },
    layout: "ledger",
    docLang: "en",
    headingFont: "sans",
    bodyFont: "sans",
    palette: { paper: "#FFFFFF", ink: "#1A1D24", muted: "#596070", accent: "#3D4F9F", rule: "#DDE1EA", panel: "#EEF0F7", panelInk: "#1A1D24", panelMuted: "#596070" },
    approach: {
      en: "Education and projects lead, so a short work history still reads as evidence of skill.",
      fr: "La formation et les projets passent en premier : un parcours court se lit tout de même comme une preuve de compétences.",
      ar: "يتقدّم التعليم والمشاريع، فيبدو التاريخ المهني القصير دليلاً على المهارة.",
    },
    positioning: {
      en: "For graduates and career changers competing for first roles in the Gulf and Europe.",
      fr: "Pour les jeunes diplômés et les reconversions qui visent un premier poste dans le Golfe ou en Europe.",
      ar: "للخريجين ومن يغيّرون مسارهم المهني ويتنافسون على وظائفهم الأولى في الخليج وأوروبا.",
    },
    ats: ONE_COLUMN_ATS,
    cv: {
      name: "Youssef Amrani",
      title: "Business Analytics Graduate",
      location: "Casablanca, Morocco",
      contact: ["+212 •• •• •• ••", "y.amrani@•••••.com"],
      summary:
        "Business analytics graduate with internships in retail banking and e-commerce. Comfortable with SQL, Python and dashboards, and looking for a graduate analyst role in the Gulf or Europe.",
      education: ["BSc Business Analytics, with honours, 2026", "Final project: predicting customer churn for a telecoms dataset"],
      projects: ["Churn model in Python and scikit-learn: 84% recall on held-out data", "Branch performance dashboard in Power BI"],
      experience: [
        {
          role: "Data Analyst Intern",
          org: "Retail bank, Casablanca",
          dates: "Summer 2025",
          bullets: [
            "Built a Power BI dashboard that 30 branch managers used to track their loan pipeline.",
            "Cleaned and merged three customer datasets, 240,000 records in all, for the marketing team.",
            "Presented the findings to the regional director in a 15-minute briefing.",
          ],
        },
        {
          role: "E-commerce Assistant, part-time",
          org: "Online fashion retailer",
          dates: "2023 – 2025",
          bullets: ["Managed product listings and the weekly sales report.", "Answered customer questions in Arabic, French and English."],
        },
      ],
      extra: [{ title: "Activities", items: ["Treasurer, university business society, 2024 – 2025", "Volunteer tutor, financial literacy workshops for secondary students"] }],
      skills: ["SQL", "Python (pandas)", "Power BI", "Excel", "Presenting findings"],
      languages: ["Arabic", "French", "English"],
      labels: EN_LABELS,
      educationFirst: true,
    },
  },
  {
    id: "rive-gauche",
    styleName: "Rive Gauche",
    field: "executive",
    level: { en: "Director, French CV", fr: "Directrice, CV en français", ar: "مديرة، سيرة بالفرنسية" },
    layout: "classic",
    docLang: "fr",
    headingFont: "serif",
    bodyFont: "serif",
    palette: { paper: "#FFFEFB", ink: "#1C1B22", muted: "#5F5D6B", accent: "#2E4A7D", rule: "#D8DCE6", panel: "#EEF1F6", panelInk: "#1C1B22", panelMuted: "#5F5D6B" },
    approach: {
      en: "French conventions throughout, from the Profil and Formation headings to date formats, set in a quiet serif.",
      fr: "Les conventions françaises partout, des rubriques Profil et Formation aux formats de date, dans un serif sobre.",
      ar: "أعراف السيرة الفرنسية في كل تفصيل، من عناوين الأقسام إلى صيغ التواريخ، بخط مزخرف هادئ.",
    },
    positioning: {
      en: "For candidates applying in France, Belgium, Switzerland, Canada or francophone Africa, where a translated English CV shows.",
      fr: "Pour les candidatures en France, Belgique, Suisse, au Canada ou en Afrique francophone, où un CV simplement traduit se remarque.",
      ar: "للمتقدمين في فرنسا وبلجيكا وسويسرا وكندا وأفريقيا الفرنكوفونية، حيث تنكشف السيرة المترجمة حرفياً.",
    },
    ats: ONE_COLUMN_ATS,
    cv: {
      name: "Camille Fournier",
      title: "Directrice des opérations",
      location: "Lyon, France",
      contact: ["+33 • •• •• •• ••", "c.fournier@•••••.fr"],
      summary:
        "Directrice des opérations avec 14 ans d'expérience dans la logistique et la distribution. Spécialiste de la transformation des chaînes d'approvisionnement et du pilotage de la performance.",
      experience: [
        {
          role: "Directrice des opérations",
          org: "Groupe de distribution spécialisée, Lyon",
          dates: "2019 – aujourd'hui",
          bullets: [
            "Pilotage de 4 entrepôts et de 380 collaborateurs, pour un budget annuel de 46 M€.",
            "Réduction de 17 % des délais de livraison grâce à la refonte des flux.",
            "Économies de 2,1 M€ par an sur le transport après renégociation des contrats.",
            "Mise en place d'indicateurs de performance partagés avec les équipes commerciales.",
          ],
        },
        {
          role: "Responsable logistique",
          org: "Prestataire logistique international, Marseille",
          dates: "2013 – 2019",
          bullets: ["Ouverture d'une plateforme de 30 000 m² en neuf mois.", "Encadrement de 120 collaborateurs sur deux sites."],
        },
        {
          role: "Cheffe de projet supply chain",
          org: "Industriel agroalimentaire, Lyon",
          dates: "2010 – 2013",
          bullets: ["Déploiement d'un nouveau processus S&OP sur trois usines.", "Réduction de 12 % des stocks de produits finis."],
        },
      ],
      extra: [{ title: "Centres d'intérêt", items: ["Course à pied, semi-marathons", "Bénévolat dans une association d'aide à l'emploi"] }],
      education: ["Master Management de la supply chain, Lyon, 2010"],
      skills: ["Pilotage de la performance", "Lean management", "S&OP", "Négociation fournisseurs", "SAP"],
      languages: ["Français (langue maternelle)", "Anglais (courant)", "Espagnol (intermédiaire)"],
      labels: {
        profile: "Profil",
        experience: "Expérience professionnelle",
        education: "Formation",
        skills: "Compétences",
        languages: "Langues",
        certifications: "Certifications",
        projects: "Projets",
        contact: "Contact",
      },
    },
  },
  {
    id: "majlis",
    styleName: "Majlis",
    field: "technology",
    level: { en: "Senior, Arabic CV", fr: "Senior, CV en arabe", ar: "مستوى أول، سيرة بالعربية" },
    layout: "sidebar",
    docLang: "ar",
    headingFont: "arabic-serif",
    bodyFont: "arabic",
    palette: { paper: "#FFFDF9", ink: "#1D1A16", muted: "#615A50", accent: "#8A6A2A", rule: "#E7DDCB", panel: "#1D1A16", panelInk: "#F6F0E6", panelMuted: "#C9BBA5" },
    approach: {
      en: "Written natively in Arabic, right to left, with a Naskh display face and clean Arabic body type rather than a translated layout.",
      fr: "Rédigé directement en arabe, de droite à gauche, avec une typographie Naskh pour les titres plutôt qu'une mise en page traduite.",
      ar: "مكتوبة بالعربية مباشرة ومن اليمين إلى اليسار، بخط نسخ للعناوين وخط عربي واضح للنص، لا بتصميم مترجم.",
    },
    positioning: {
      en: "For roles in Saudi Arabia, the UAE and government programmes where an Arabic CV is expected alongside the English one.",
      fr: "Pour les postes en Arabie saoudite, aux Émirats et dans les programmes publics où un CV arabe est attendu en plus de l'anglais.",
      ar: "للوظائف في السعودية والإمارات والبرامج الحكومية حيث يُطلب ملف عربي إلى جانب السيرة الإنجليزية.",
    },
    ats: TWO_COLUMN_ATS,
    cv: {
      name: "سلمى الراشد",
      title: "مديرة مشاريع أولى",
      location: "الرياض، المملكة العربية السعودية",
      contact: ["+966 •• ••• ••••", "s.alrashed@•••••.com"],
      summary:
        "مديرة مشاريع بخبرة عشر سنوات في مشاريع التحول الرقمي في القطاعين الحكومي والخاص. تقود فرقاً متعددة التخصصات وتسلّم المشاريع في موعدها وضمن ميزانيتها.",
      experience: [
        {
          role: "مديرة مشاريع أولى",
          org: "جهة حكومية، برنامج تحوّل رقمي، الرياض",
          dates: "2021 – حتى الآن",
          bullets: [
            "قيادة محفظة من 6 مشاريع بقيمة إجمالية 180 مليون ريال.",
            "إطلاق منصة خدمات إلكترونية استخدمها أكثر من 400 ألف مستفيد في عامها الأول.",
            "إعداد التقارير الشهرية للجنة التوجيهية وإدارة ميزانية المحفظة.",
            "قيادة فريق من 25 عضواً بين موظفين ومستشارين.",
          ],
        },
        {
          role: "مديرة مشروع",
          org: "شركة استشارات تقنية، جدة",
          dates: "2017 – 2021",
          bullets: ["تسليم 11 مشروعاً لعملاء في قطاعي المصارف والتجزئة.", "تقليص مدة التسليم بنسبة 20% عبر توحيد منهجية العمل."],
        },
        {
          role: "محللة أعمال",
          org: "شركة اتصالات، الرياض",
          dates: "2015 – 2017",
          bullets: ["توثيق متطلبات أنظمة الفوترة وتنسيق اختبارات القبول."],
        },
      ],
      extra: [{ title: "مشاريع بارزة", items: ["منصة الخدمات الإلكترونية الموحّدة", "نظام إدارة الطلبات لمراكز الخدمة"] }],
      education: ["ماجستير إدارة المشاريع، 2017", "بكالوريوس نظم المعلومات، 2014"],
      certifications: ["شهادة احترافية في إدارة المشاريع"],
      skills: ["إدارة المحافظ", "منهجيات أجايل", "إدارة أصحاب المصلحة", "إدارة المخاطر", "التخطيط المالي"],
      languages: ["العربية (اللغة الأم)", "الإنجليزية (متقدم)"],
      labels: {
        profile: "نبذة مهنية",
        experience: "الخبرات العملية",
        education: "التعليم",
        skills: "المهارات",
        languages: "اللغات",
        certifications: "الشهادات",
        projects: "المشاريع",
        contact: "التواصل",
      },
    },
  },
];

/** The filters, in display order, limited to fields that have at least one concept. */
export const CV_FILTERS: ("all" | CvField | "languages")[] = [
  "all",
  ...(["executive", "finance", "hospitality", "technology", "healthcare", "creative", "early"] as CvField[]).filter(f =>
    CV_CONCEPTS.some(c => c.field === f),
  ),
  "languages",
];
