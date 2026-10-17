// lib/portfolios.ts
// Every portfolio website shown in the "Portfolio websites" gallery.
//
// Two kinds, always labelled as such on the site:
// - "live":    real websites of real professionals, shown as published (iframed from their own URL).
// - "concept": concept designs by Zenith Dubai CV for fictional people. Each one lives at
//              /samples/<slug>.html and says on the page that the person, employers and
//              figures are illustrative.
//
// Counts shown in the gallery (headline, chips, wheel hub) are derived from this list,
// so adding or removing an entry keeps every number accurate.

export type Lang = "en" | "ar" | "fr";
export type Kind = "live" | "concept";
export type Category = "hospitality" | "finance" | "tech" | "business" | "built" | "health";

export interface Portfolio {
  slug: string;
  name: string;
  kind: Kind;
  category: Category;
  role: Record<Lang, string>;
  /** Short name of the creative direction (concept sites) or "Published portfolio" (live sites). */
  idea: Record<Lang, string>;
  /** Where the website itself lives. */
  url: string;
}

const PUBLISHED: Record<Lang, string> = { en: "Published portfolio", fr: "Portfolio publié", ar: "ملف مهني منشور" };

export const PORTFOLIOS: Portfolio[] = [
  // Live websites
  { slug: "abdelilah-el-khayir", name: "Abdelilah El Khayir", kind: "live", category: "tech", url: "https://abdell-portfolio.netlify.app/",
    role: { en: "Digital Experience Architect", fr: "Architecte d'expériences numériques", ar: "مهندس التجارب الرقمية" }, idea: PUBLISHED },
  { slug: "wasim-akram", name: "Wasim Akram", kind: "live", category: "built", url: "https://wasim-akram-portfolio.netlify.app/",
    role: { en: "3D Visualizer & Interior Designer", fr: "Visualiseur 3D et architecte d'intérieur", ar: "مصمم مرئيات ثلاثية الأبعاد ومصمم داخلي" }, idea: PUBLISHED },

  // Concept designs: hospitality & travel
  { slug: "layla-haddad", name: "Layla Haddad", kind: "concept", category: "hospitality", url: "/samples/layla-haddad.html",
    role: { en: "Hotel General Manager", fr: "Directrice générale d'hôtel", ar: "مديرة عامة لفندق فاخر" },
    idea: { en: "The grand lobby", fr: "Le grand hall", ar: "البهو الكبير" } },
  { slug: "julien-arnaud", name: "Julien Arnaud", kind: "concept", category: "hospitality", url: "/samples/julien-arnaud.html",
    role: { en: "Executive Chef", fr: "Chef exécutif", ar: "رئيس الطهاة التنفيذي" },
    idea: { en: "Plated at the pass", fr: "Dressé au passe", ar: "طبق جاهز للتقديم" } },
  { slug: "rashid-al-hammadi", name: "Rashid Al Hammadi", kind: "concept", category: "hospitality", url: "/samples/rashid-al-hammadi.html",
    role: { en: "Airline Captain", fr: "Commandant de bord", ar: "قائد طائرة" },
    idea: { en: "The glass cockpit", fr: "Le cockpit numérique", ar: "قمرة القيادة الرقمية" } },
  { slug: "maria-dela-cruz", name: "Maria Dela Cruz", kind: "concept", category: "hospitality", url: "/samples/maria-dela-cruz.html",
    role: { en: "Cabin Services Manager", fr: "Responsable du service cabine", ar: "مديرة خدمات المقصورة" },
    idea: { en: "Postcards from 38,000 ft", fr: "Cartes postales d'en haut", ar: "بطاقات بريدية من السماء" } },
  { slug: "lucas-ferreira", name: "Lucas Ferreira", kind: "concept", category: "hospitality", url: "/samples/lucas-ferreira.html",
    role: { en: "Head Sommelier", fr: "Chef sommelier", ar: "رئيس قسم المشروبات" },
    idea: { en: "The bottle", fr: "La bouteille", ar: "الزجاجة" } },
  { slug: "ji-woo-han", name: "Ji-woo Han", kind: "concept", category: "hospitality", url: "/samples/ji-woo-han.html",
    role: { en: "Luxury Events Director", fr: "Directrice d'événements de luxe", ar: "مديرة الفعاليات الفاخرة" },
    idea: { en: "The invitation", fr: "L'invitation", ar: "بطاقة الدعوة" } },

  // Finance & law
  { slug: "arjun-nair", name: "Arjun Nair", kind: "concept", category: "finance", url: "/samples/arjun-nair.html",
    role: { en: "VP, Mergers & Acquisitions", fr: "Vice-président, fusions et acquisitions", ar: "نائب رئيس، الاندماج والاستحواذ" },
    idea: { en: "A Swiss deal poster", fr: "Une affiche suisse", ar: "ملصق بالطراز السويسري" } },
  { slug: "hannah-becker", name: "Hannah Becker", kind: "concept", category: "finance", url: "/samples/hannah-becker.html",
    role: { en: "Chief Financial Officer", fr: "Directrice financière", ar: "المديرة المالية" },
    idea: { en: "The annual report", fr: "Le rapport annuel", ar: "التقرير السنوي" } },
  { slug: "faisal-al-qahtani", name: "Faisal Al Qahtani", kind: "concept", category: "finance", url: "/samples/faisal-al-qahtani.html",
    role: { en: "Senior Legal Counsel", fr: "Conseiller juridique principal", ar: "مستشار قانوني أول" },
    idea: { en: "The deed", fr: "L'acte", ar: "الوثيقة الرسمية" } },

  // Technology & design
  { slug: "daniel-okafor", name: "Daniel Okafor", kind: "concept", category: "tech", url: "/samples/daniel-okafor.html",
    role: { en: "Head of Software Engineering", fr: "Directeur de l'ingénierie logicielle", ar: "رئيس هندسة البرمجيات" },
    idea: { en: "The code editor", fr: "L'éditeur de code", ar: "محرر الأكواد" } },
  { slug: "mei-lin-zhou", name: "Mei Lin Zhou", kind: "concept", category: "tech", url: "/samples/mei-lin-zhou.html",
    role: { en: "Lead Data Scientist, AI", fr: "Data scientist principale, IA", ar: "كبيرة علماء البيانات، الذكاء الاصطناعي" },
    idea: { en: "A live notebook", fr: "Un notebook vivant", ar: "دفتر بيانات تفاعلي" } },
  { slug: "sofia-bianchi", name: "Sofia Bianchi", kind: "concept", category: "tech", url: "/samples/sofia-bianchi.html",
    role: { en: "Senior Product Designer", fr: "Designer produit senior", ar: "مصممة منتجات أولى" },
    idea: { en: "The open design file", fr: "Le fichier de design ouvert", ar: "ملف التصميم المفتوح" } },

  // Business & management
  { slug: "karim-benjelloun", name: "Karim Benjelloun", kind: "concept", category: "business", url: "/samples/karim-benjelloun.html",
    role: { en: "Marketing Director, Luxury", fr: "Directeur marketing, luxe", ar: "مدير التسويق للعلامات الفاخرة" },
    idea: { en: "The cover star", fr: "En couverture", ar: "نجم الغلاف" } },
  { slug: "noura-al-mazrouei", name: "Noura Al Mazrouei", kind: "concept", category: "business", url: "/samples/noura-al-mazrouei.html",
    role: { en: "Director of Residential Sales", fr: "Directrice des ventes résidentielles", ar: "مديرة المبيعات العقارية" },
    idea: { en: "Sold out", fr: "Tout est vendu", ar: "بيعت بالكامل" } },
  { slug: "ines-ben-salah", name: "Inès Ben Salah", kind: "concept", category: "business", url: "/samples/ines-ben-salah.html",
    role: { en: "Director of People & Culture", fr: "Directrice des ressources humaines", ar: "مديرة الموارد البشرية والثقافة" },
    idea: { en: "A manifesto", fr: "Un manifeste", ar: "بيان مبادئ" } },
  { slug: "alexei-morozov", name: "Alexei Morozov", kind: "concept", category: "business", url: "/samples/alexei-morozov.html",
    role: { en: "Supply Chain Director", fr: "Directeur de la chaîne logistique", ar: "مدير سلسلة الإمداد" },
    idea: { en: "Departures", fr: "Départs", ar: "لوحة المغادرة" } },

  // Architecture & construction
  { slug: "thomas-whitaker", name: "Thomas Whitaker", kind: "concept", category: "built", url: "/samples/thomas-whitaker.html",
    role: { en: "Principal Architect", fr: "Architecte principal", ar: "مهندس معماري رئيسي" },
    idea: { en: "Drawing sheet A-001", fr: "Planche A-001", ar: "لوحة الرسم A-001" } },
  { slug: "youssef-haddadin", name: "Youssef Haddadin", kind: "concept", category: "built", url: "/samples/youssef-haddadin.html",
    role: { en: "Construction Project Director", fr: "Directeur de projets de construction", ar: "مدير مشاريع البناء" },
    idea: { en: "The site hoarding", fr: "La palissade de chantier", ar: "سياج موقع البناء" } },

  // Healthcare
  { slug: "amira-soliman", name: "Dr. Amira Soliman", kind: "concept", category: "health", url: "/samples/amira-soliman.html",
    role: { en: "Consultant Cardiologist", fr: "Cardiologue consultante", ar: "استشارية أمراض القلب" },
    idea: { en: "Calm precision", fr: "Précision sereine", ar: "دقة هادئة" } },
  { slug: "grace-wanjiku", name: "Grace Wanjiku", kind: "concept", category: "health", url: "/samples/grace-wanjiku.html",
    role: { en: "Nurse Manager", fr: "Cadre infirmière", ar: "مديرة التمريض" },
    idea: { en: "On shift", fr: "En service", ar: "في المناوبة" } },
];

export const CATEGORIES: Category[] = ["hospitality", "finance", "tech", "business", "built", "health"];

/** Preview images, captured from each website's first screen. */
export const preview = {
  desktop: (slug: string) => `/samples/previews/${slug}-d.webp`, // 960 × 600
  mobile: (slug: string) => `/samples/previews/${slug}-m.webp`,  // 360 × 779
  thumb: (slug: string) => `/samples/previews/${slug}-t.webp`,   // 320 × 200
};

/** Address shown in the viewer's address bar. */
export function displayUrl(site: Portfolio): string {
  return site.kind === "live"
    ? site.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : `zenithdubaicv.com/samples/${site.slug}`;
}
