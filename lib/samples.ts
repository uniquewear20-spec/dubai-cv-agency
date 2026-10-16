// lib/samples.ts
// The 20 sample portfolio websites shown in the "Personal brand websites" gallery.
// Every person here is fictional; each site lives at /samples/<slug>.html and is
// labelled "Sample design" on the page itself.

export type Lang = "en" | "ar" | "fr";

export interface SampleSite {
  slug: string;
  name: string;
  role: Record<Lang, string>;
}

export const SAMPLE_SITES: SampleSite[] = [
  { slug: "layla-haddad",       name: "Layla Haddad",       role: { en: "Hotel General Manager",         fr: "Directrice générale d'hôtel",            ar: "مديرة عامة لفندق فاخر" } },
  { slug: "julien-arnaud",      name: "Julien Arnaud",      role: { en: "Executive Chef",                fr: "Chef exécutif",                          ar: "رئيس الطهاة التنفيذي" } },
  { slug: "rashid-al-hammadi",  name: "Rashid Al Hammadi",  role: { en: "Airline Captain",               fr: "Commandant de bord",                     ar: "قائد طائرة" } },
  { slug: "maria-dela-cruz",    name: "Maria Dela Cruz",    role: { en: "Cabin Services Manager",        fr: "Responsable du service cabine",          ar: "مديرة خدمات المقصورة" } },
  { slug: "arjun-nair",         name: "Arjun Nair",         role: { en: "VP, Investment Banking",        fr: "Vice-président, banque d'investissement", ar: "نائب رئيس، الخدمات المصرفية الاستثمارية" } },
  { slug: "hannah-becker",      name: "Hannah Becker",      role: { en: "Chief Financial Officer",       fr: "Directrice financière",                  ar: "المديرة المالية" } },
  { slug: "daniel-okafor",      name: "Daniel Okafor",      role: { en: "Head of Software Engineering",  fr: "Directeur de l'ingénierie logicielle",   ar: "رئيس هندسة البرمجيات" } },
  { slug: "mei-lin-zhou",       name: "Mei Lin Zhou",       role: { en: "Lead Data Scientist, AI",       fr: "Data scientist principale, IA",          ar: "كبيرة علماء البيانات، الذكاء الاصطناعي" } },
  { slug: "sofia-bianchi",      name: "Sofia Bianchi",      role: { en: "Senior Product Designer",       fr: "Designer produit senior",                ar: "مصممة منتجات أولى" } },
  { slug: "karim-benjelloun",   name: "Karim Benjelloun",   role: { en: "Marketing Director, Luxury",    fr: "Directeur marketing, luxe",              ar: "مدير التسويق للعلامات الفاخرة" } },
  { slug: "noura-al-mazrouei",  name: "Noura Al Mazrouei",  role: { en: "Real Estate Sales Director",    fr: "Directrice des ventes immobilières",     ar: "مديرة المبيعات العقارية" } },
  { slug: "thomas-whitaker",    name: "Thomas Whitaker",    role: { en: "Principal Architect",           fr: "Architecte principal",                   ar: "مهندس معماري رئيسي" } },
  { slug: "youssef-haddadin",   name: "Youssef Haddadin",   role: { en: "Construction Project Director", fr: "Directeur de projets de construction",   ar: "مدير مشاريع البناء" } },
  { slug: "amira-soliman",      name: "Dr. Amira Soliman",  role: { en: "Consultant Cardiologist",       fr: "Cardiologue consultante",                ar: "استشارية أمراض القلب" } },
  { slug: "grace-wanjiku",      name: "Grace Wanjiku",      role: { en: "Nurse Manager",                 fr: "Cadre infirmière",                       ar: "مديرة التمريض" } },
  { slug: "ines-ben-salah",     name: "Inès Ben Salah",     role: { en: "Director of People & Culture",  fr: "Directrice des ressources humaines",     ar: "مديرة الموارد البشرية والثقافة" } },
  { slug: "alexei-morozov",     name: "Alexei Morozov",     role: { en: "Supply Chain Director",         fr: "Directeur de la chaîne logistique",      ar: "مدير سلسلة الإمداد" } },
  { slug: "faisal-al-qahtani",  name: "Faisal Al Qahtani",  role: { en: "Senior Legal Counsel",          fr: "Conseiller juridique principal",         ar: "مستشار قانوني أول" } },
  { slug: "lucas-ferreira",     name: "Lucas Ferreira",     role: { en: "Head Sommelier",                fr: "Chef sommelier",                         ar: "رئيس قسم المشروبات" } },
  { slug: "ji-woo-han",         name: "Ji-woo Han",         role: { en: "Luxury Events Director",        fr: "Directrice d'événements de luxe",        ar: "مديرة الفعاليات الفاخرة" } },
];

export const samplePage = (slug: string) => `/samples/${slug}.html`;
export const sampleShot = (slug: string) => `/samples/thumbs/${slug}.jpg`;
export const sampleThumb = (slug: string) => `/samples/thumbs/${slug}-sm.jpg`;
