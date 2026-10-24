// lib/agent/titles.ts — what a job title means. Shared by the browser (ranking) and the server
// (searching). Employers write the same job many ways ("Bartender", "Mixologist", "Barman",
// "بارتندر"), so each job is a family: every way of writing it, its level, and its neighbours.
// Hospitality families are below; every other field is in occupations.ts.
//
// - Same family = the same job: searched for and ranked as a match. A kind of the job (a family
//   whose `parent` is the job: a cardiologist for "doctor") is the same job too.
// - Related families = neighbouring jobs (a level up or down, the broader job, its other kinds):
//   offered to the candidate, searched for when they switch them on, and used to widen a search
//   that found nothing (always labelled as related).
// - A title that belongs to an unrelated family is not this job, whatever words it shares
//   ("Executive Chef" is not a bartender job, "Assistant Restaurant Manager" is not
//   "Restaurant Manager").
// - A whole field typed as a role ("healthcare", "marketing") searches the field: every job in it.
// - A role no family knows is matched by its words: the listing's title must name it ("Underwater
//   welder" needs "welder" and "underwater"), never just its description.
//
// Adding a job: add a family (here for hospitality, in occupations.ts otherwise). The first title
// is the one shown; `search` lists the titles worth sending to job sources.

import { norm } from "./text";
import { countriesIn } from "./countries";
import { OCCUPATIONS } from "./occupations";

export type Industry =
  | "hospitality" | "healthcare" | "technology" | "engineering" | "finance" | "legal" | "education" | "sales" | "marketing" | "creative"
  | "beauty" | "real-estate" | "logistics" | "aviation" | "customer-service" | "admin" | "trades" | "retail" | "management" | "science";

/** Which rule decides a title that also means something else ("model", "architect", "server"). */
export type ContextId = "hospitality" | "fashion" | "building" | "legal" | "fitness" | "transport" | "education" | "animation" | "entertainment";

export interface Family {
  id: string;
  /** 1 entry · 2 skilled · 3 supervisor · 4 assistant manager · 5 manager · 6 director · 7 executive */
  level: number;
  /** Every way employers write this job: English, French, Arabic, German, abbreviations. */
  titles: string[];
  /** Titles to send to keyword searches, most common first (defaults to the first title). */
  search?: string[];
  /** Titles to search in French-speaking markets (France, Belgium, Switzerland, Luxembourg, North and West Africa). */
  fr?: string[];
  /** Titles to search in German-speaking markets (Germany, Austria, Switzerland). */
  de?: string[];
  /** Neighbouring jobs (family ids). */
  related?: string[];
  /** Titles that also name other jobs ("server", "model"): they count only in the right context. */
  ambiguous?: string[];
  /** The rule for the ambiguous titles (hospitality by default). */
  context?: ContextId;
  /** The broader job this is a kind of (a cardiologist is a doctor). */
  parent?: string;
  /** The fields the job belongs to, for the industry filter and for searches of a whole field. */
  industries?: Industry[];
  /** "level": a career stage (internship, graduate programme) rather than a job. */
  kind?: "level";
  /** The part of hospitality the job belongs to (set below), for broader searches by sector. */
  sector?: Sector;
}

export type Sector = "fnb" | "hotel" | "kitchen" | "events";

const HOSPITALITY_FAMILIES: Family[] = [
  // ── Bar and coffee ──
  {
    id: "bartender", level: 1,
    titles: ["bartender", "bar tender", "barman", "barmaid", "bar attendant", "bar server", "bar staff", "mixologist", "mixology", "cocktail bartender",
      "serveur de bar", "mixologue", "بارتندر", "ساقي", "عامل بار"],
    search: ["bartender", "mixologist"], fr: ["barman"],
    related: ["head-bartender", "barback", "barista", "bar-manager"],
  },
  {
    id: "barback", level: 1,
    titles: ["barback", "bar back", "bar porter", "bar commis", "commis bartender", "commis de bar"],
    related: ["bartender"],
  },
  {
    id: "head-bartender", level: 3,
    titles: ["head bartender", "senior bartender", "lead bartender", "head mixologist", "bar supervisor", "bar captain", "assistant bar manager",
      "chef barman", "chef de bar", "superviseur de bar", "مشرف بار", "رئيس السقاة"],
    search: ["head bartender", "bar supervisor"],
    related: ["bartender", "bar-manager"],
  },
  {
    id: "bar-manager", level: 5,
    titles: ["bar manager", "bar operations manager", "lounge manager", "bar and lounge manager", "nightlife manager",
      "responsable de bar", "manager de bar", "directeur de bar", "مدير بار"],
    related: ["head-bartender", "beverage-manager", "restaurant-manager"],
  },
  {
    id: "beverage-manager", level: 5,
    titles: ["beverage manager", "beverage director", "director of beverage", "head of beverage", "beverage operations manager", "wine and beverage manager",
      "responsable des boissons", "directeur des boissons", "مدير المشروبات"],
    related: ["bar-manager", "sommelier", "fb-manager"],
  },
  {
    id: "sommelier", level: 2,
    titles: ["sommelier", "head sommelier", "assistant sommelier", "chef sommelier", "wine steward", "wine waiter", "سوميلييه"],
    related: ["beverage-manager", "waiter"],
  },
  {
    id: "barista", level: 1,
    titles: ["barista", "senior barista", "coffee barista", "coffee specialist", "coffee bar attendant", "coffee maker", "باريستا", "صانع قهوة"],
    related: ["cafe-supervisor", "bartender", "waiter"],
  },
  {
    id: "cafe-supervisor", level: 3,
    titles: ["head barista", "cafe supervisor", "coffee shop supervisor", "cafe team leader", "assistant cafe manager", "superviseur de cafe", "مشرف مقهى"],
    related: ["barista", "cafe-manager"],
  },
  {
    id: "cafe-manager", level: 5,
    titles: ["cafe manager", "coffee shop manager", "gerant de cafe", "responsable de cafe", "مدير مقهى"],
    related: ["cafe-supervisor", "restaurant-manager"],
  },

  // ── Restaurant service ──
  {
    id: "waiter", level: 1,
    titles: ["waiter", "waitress", "server", "food server", "restaurant server", "cocktail server", "banquet server", "waitstaff", "wait staff", "commis waiter", "commis de rang", "chef de rang",
      "food runner", "restaurant attendant", "f&b attendant", "food and beverage attendant", "f&b associate", "service attendant", "dining attendant",
      "serveur", "serveuse", "commis de salle", "نادل", "نادلة", "ويتر", "جرسون"],
    search: ["waiter", "waitress"], fr: ["serveur"], de: ["Kellner"],
    related: ["head-waiter", "host", "barista", "bartender"],
    ambiguous: ["server"],
  },
  {
    id: "head-waiter", level: 3,
    titles: ["head waiter", "head waitress", "senior waiter", "senior waitress", "captain waiter", "captain waitress", "restaurant captain", "section captain", "maitre d", "maitre d'hotel",
      "chef de salle", "رئيس النادلين", "كابتن مطعم"],
    search: ["head waiter", "captain waiter"],
    related: ["waiter", "restaurant-supervisor"],
  },
  {
    id: "host", level: 1,
    titles: ["host", "hostess", "restaurant host", "restaurant hostess", "reception host", "greeter", "مضيف", "مضيفة"],
    search: ["restaurant host", "hostess"],
    related: ["waiter", "guest-relations"],
    ambiguous: ["host", "hostess", "greeter"],
  },
  {
    id: "restaurant-supervisor", level: 3,
    titles: ["restaurant supervisor", "f&b supervisor", "food and beverage supervisor", "outlet supervisor", "floor supervisor", "dining room supervisor",
      "restaurant team leader", "restaurant shift leader", "service supervisor", "superviseur de restaurant", "superviseur f&b", "superviseur restauration",
      "مشرف مطعم", "مشرف الاغذيه والمشروبات"],
    search: ["restaurant supervisor", "f&b supervisor"],
    related: ["head-waiter", "assistant-restaurant-manager"],
  },
  {
    id: "assistant-restaurant-manager", level: 4,
    titles: ["assistant restaurant manager", "restaurant assistant manager", "assistant manager restaurant", "assistant outlet manager",
      "deputy restaurant manager", "assistant f&b manager", "assistant food and beverage manager",
      "directeur adjoint de restaurant", "responsable adjoint de restaurant", "adjoint au directeur de restaurant", "مساعد مدير مطعم"],
    search: ["assistant restaurant manager", "assistant outlet manager"],
    related: ["restaurant-supervisor", "restaurant-manager"],
  },
  {
    id: "restaurant-manager", level: 5,
    titles: ["restaurant manager", "outlet manager", "restaurant general manager", "general manager restaurant", "restaurant gm", "f&b outlet manager",
      "restaurant operations manager", "venue manager", "dining room manager",
      "directeur de restaurant", "responsable de restaurant", "gerant de restaurant", "manager de restaurant", "responsable de salle",
      "مدير مطعم", "مدير المطعم"],
    search: ["restaurant manager", "outlet manager"], fr: ["directeur de restaurant"],
    related: ["assistant-restaurant-manager", "fb-manager", "multi-unit-manager"],
  },
  {
    id: "multi-unit-manager", level: 6,
    titles: ["multi-unit manager", "multi unit manager", "multi-site manager", "multi site manager", "area manager", "district manager",
      "area operations manager", "regional operations manager", "responsable multi-sites", "directeur regional", "مدير منطقة"],
    search: ["area manager", "multi-unit manager"],
    related: ["restaurant-manager", "operations-director"],
  },
  {
    id: "fb-manager", level: 5,
    titles: ["food and beverage manager", "food & beverage manager", "f&b manager", "f & b manager", "f and b manager", "f&b operations manager",
      "food and beverage operations manager", "food & beverage operations manager",
      "responsable de la restauration", "responsable f&b", "manager f&b", "مدير الاغذيه والمشروبات"],
    search: ["f&b manager", "food and beverage manager"],
    related: ["restaurant-manager", "fb-director", "beverage-manager"],
  },
  {
    id: "fb-director", level: 6,
    titles: ["director of food and beverage", "director of f&b", "director food and beverage", "director f&b", "f&b director", "food and beverage director",
      "head of food and beverage", "head of f&b",
      "assistant director of food and beverage", "vp food and beverage", "directeur de la restauration", "directeur f&b", "مدير عام الاغذيه والمشروبات"],
    search: ["director of food and beverage", "f&b director"],
    related: ["fb-manager", "hospitality-director"],
  },

  // ── Hotels ──
  {
    id: "hospitality-ops-manager", level: 5,
    titles: ["hospitality operations manager", "hotel operations manager", "operations manager hospitality", "hospitality manager", "resident manager",
      "rooms division manager", "responsable des operations hotelieres", "مدير العمليات الفندقيه"],
    search: ["hospitality operations manager", "hotel operations manager"],
    related: ["hotel-manager", "operations-director", "fb-manager", "front-office-manager"],
  },
  {
    id: "operations-director", level: 6,
    titles: ["director of operations", "operations director", "head of operations", "vp of operations", "vp operations", "vice president of operations",
      "coo", "chief operating officer", "directeur des operations", "directrice des operations", "مدير العمليات"],
    related: ["hospitality-ops-manager", "general-manager", "operations-manager"],
    industries: ["management", "hospitality"],
  },
  {
    id: "hotel-manager", level: 6,
    titles: ["hotel manager", "hotel general manager", "general manager hotel", "hotel gm", "executive assistant manager", "resort manager",
      "directeur d'hotel", "directrice d'hotel", "directeur general d'hotel", "مدير فندق", "مدير عام فندق"],
    search: ["hotel manager", "hotel general manager"],
    related: ["hospitality-ops-manager", "general-manager"],
  },
  {
    id: "general-manager", level: 7,
    titles: ["general manager", "gm", "directeur general", "directrice generale", "مدير عام"],
    related: ["hotel-manager", "operations-director", "ceo"],
    industries: ["management", "hospitality"],
  },
  {
    id: "guest-relations", level: 2,
    titles: ["guest relations executive", "guest relations officer", "guest relations agent", "guest relations", "gre", "gro", "guest experience executive",
      "guest experience agent", "relations clientele", "علاقات الضيوف", "موظف علاقات الضيوف"],
    search: ["guest relations"],
    related: ["guest-relations-manager", "front-desk", "host"],
  },
  {
    id: "guest-relations-manager", level: 5,
    titles: ["guest relations manager", "guest experience manager", "guest services manager", "guest relations supervisor",
      "responsable des relations clients", "responsable relations clientele", "مدير علاقات الضيوف"],
    search: ["guest relations manager", "guest experience manager"],
    related: ["guest-relations", "front-office-manager"],
  },
  {
    id: "front-desk", level: 1,
    titles: ["front desk agent", "front desk receptionist", "front office agent", "front office associate", "hotel receptionist",
      "guest service agent", "gsa", "night auditor", "reservations agent", "agent de reception", "receptionniste d'hotel", "موظف مكتب امامي", "موظف استقبال فندق"],
    search: ["front desk agent", "hotel receptionist"], fr: ["réceptionniste"],
    related: ["front-office-manager", "guest-relations", "receptionist"],
  },
  {
    id: "front-office-manager", level: 5,
    titles: ["front office manager", "front desk manager", "assistant front office manager", "front office supervisor", "reception manager", "duty manager",
      "night manager", "fom", "chef de reception", "responsable de la reception", "مدير المكتب الامامي", "مدير الاستقبال"],
    search: ["front office manager", "duty manager"],
    related: ["front-desk", "guest-relations-manager", "hospitality-ops-manager"],
  },
  {
    id: "concierge", level: 2,
    titles: ["concierge", "chef concierge", "head concierge", "guest services concierge", "كونسيرج"],
    related: ["guest-relations", "front-desk"],
  },
  {
    id: "housekeeping-manager", level: 5,
    titles: ["executive housekeeper", "housekeeping manager", "assistant executive housekeeper", "housekeeping supervisor", "gouvernante generale",
      "مديره التدبير المنزلي", "مشرف التدبير المنزلي"],
    search: ["executive housekeeper", "housekeeping manager"],
    related: ["room-attendant", "hospitality-ops-manager"],
  },
  {
    id: "room-attendant", level: 1,
    titles: ["room attendant", "housekeeper", "housekeeping attendant", "room maid", "femme de chambre", "valet de chambre", "عامل تنظيف غرف"],
    related: ["housekeeping-manager", "cleaner"],
  },
  {
    id: "catering-manager", level: 5,
    titles: ["catering manager", "catering operations manager", "catering sales manager", "event catering manager", "head of catering", "catering supervisor",
      "responsable traiteur", "responsable restauration collective", "مدير التموين", "مدير الضيافه والتموين"],
    related: ["banquet-manager", "fb-manager", "event-manager"],
  },
  {
    id: "banquet-manager", level: 5,
    titles: ["banquet manager", "banqueting manager", "banquet operations manager", "conference and banqueting manager", "c&b manager",
      "events and banqueting manager", "assistant banquet manager", "banquet supervisor", "banquet captain",
      "responsable banquets", "responsable des banquets", "maitre d'hotel banquets", "مدير الحفلات", "مدير المادب"],
    search: ["banquet manager", "banqueting manager"],
    related: ["catering-manager", "fb-manager", "waiter", "event-manager"],
  },
  {
    id: "hospitality-director", level: 6,
    titles: ["hospitality director", "director of hospitality", "head of hospitality", "directeur de l'hospitalite", "مدير الضيافه"],
    related: ["fb-director", "hotel-manager", "operations-director"],
  },

  // ── Kitchen ──
  {
    id: "executive-chef", level: 6,
    titles: ["executive chef", "head chef", "chef de cuisine", "culinary director", "group executive chef", "chef executif", "chef cuisinier",
      "شيف تنفيذي", "رئيس الطهاه"],
    search: ["executive chef", "head chef"],
    related: ["sous-chef", "pastry-chef"],
  },
  {
    id: "sous-chef", level: 5,
    titles: ["sous chef", "junior sous chef", "senior sous chef", "executive sous chef", "second de cuisine", "سو شيف", "مساعد رئيس الطهاه"],
    related: ["executive-chef", "chef-de-partie"],
  },
  {
    id: "chef-de-partie", level: 3,
    titles: ["chef de partie", "chefs de partie", "demi chef de partie", "senior chef de partie", "cdp", "dcdp", "station chef", "شيف دي بارتي"],
    related: ["sous-chef", "commis-chef"],
  },
  {
    id: "commis-chef", level: 1,
    titles: ["commis chef", "commis cook", "commis 1", "commis 2", "commis 3", "cook", "line cook", "prep cook", "commis de cuisine", "cuisinier",
      "aide cuisinier", "طباخ", "مساعد طباخ", "koch", "köchin", "jungkoch"],
    search: ["commis chef", "cook"], fr: ["cuisinier"], de: ["Koch"],
    related: ["chef-de-partie", "kitchen-steward"],
  },
  {
    id: "pastry-chef", level: 3,
    titles: ["pastry chef", "pastry cook", "executive pastry chef", "pastry sous chef", "baker", "patissier", "chef patissier", "boulanger",
      "شيف حلويات", "خباز", "konditor", "bäcker"],
    related: ["executive-chef", "commis-chef"],
  },

  // ── Real estate (the same idea; other fields are in occupations.ts) ──
  {
    id: "real-estate-agent", level: 2,
    titles: ["real estate agent", "real estate consultant", "property consultant", "property advisor", "property agent", "real estate broker",
      "real estate sales agent", "real estate sales consultant", "estate agent", "leasing consultant", "leasing agent", "off-plan sales consultant",
      "agent immobilier", "conseiller immobilier", "negociateur immobilier", "consultant immobilier", "وكيل عقاري", "مستشار عقاري", "وسيط عقاري",
      "immobilienmakler", "immobilienberater"],
    search: ["real estate agent", "property consultant"], fr: ["agent immobilier"], de: ["Immobilienmakler"],
    related: ["real-estate-manager", "property-manager"],
    industries: ["real-estate", "sales"],
  },
  {
    id: "real-estate-manager", level: 5,
    titles: ["real estate manager", "sales manager real estate", "real estate sales manager", "leasing manager", "brokerage manager",
      "directeur d'agence immobiliere", "مدير مبيعات عقارية"],
    related: ["real-estate-agent", "property-manager"],
    industries: ["real-estate", "sales"],
  },
];

const SECTORS: Record<Sector, string[]> = {
  fnb: ["bartender", "barback", "head-bartender", "bar-manager", "beverage-manager", "sommelier", "barista", "cafe-supervisor", "cafe-manager",
    "waiter", "head-waiter", "host", "restaurant-supervisor", "assistant-restaurant-manager", "restaurant-manager", "multi-unit-manager",
    "fb-manager", "fb-director"],
  hotel: ["hospitality-ops-manager", "hotel-manager", "guest-relations", "guest-relations-manager", "front-desk", "front-office-manager",
    "concierge", "housekeeping-manager", "room-attendant", "hospitality-director"],
  kitchen: ["executive-chef", "sous-chef", "chef-de-partie", "commis-chef", "pastry-chef", "kitchen-steward"],
  events: ["catering-manager", "banquet-manager"],
};

/**
 * Broad searches per sector. Job boards title the same work many ways ("Food & Beverage / Fine
 * Dining Server", "Restaurant Captain"), so for hospitality jobs the agent also searches the sector
 * and keeps the listings whose titles are the job.
 */
export const SECTOR_SEARCHES: Record<Sector, string[]> = {
  fnb: ["food and beverage", "restaurant"],
  hotel: ["hotel", "hospitality"],
  kitchen: ["kitchen", "restaurant"],
  events: ["catering", "banquet"],
};

export const FAMILIES: Family[] = [...HOSPITALITY_FAMILIES, ...OCCUPATIONS];

const BY_ID = new Map(FAMILIES.map(f => [f.id, f]));
for (const [sector, ids] of Object.entries(SECTORS) as [Sector, string[]][]) {
  for (const id of ids) {
    const f = BY_ID.get(id);
    if (f) f.sector = sector;
  }
}
for (const f of HOSPITALITY_FAMILIES) f.industries ??= ["hospitality"];
export const familyById = (id: string): Family | undefined => BY_ID.get(id);

// ── Fields (industries) ──────────────────────────────────────────────────────

export interface IndustryInfo {
  id: Industry;
  en: string; fr: string; ar: string;
  /** What people type for the whole field ("healthcare", "IT", "تسويق"), as a role. */
  words: string[];
  /** Keyword searches for the whole field, most useful first. */
  queries: string[];
  /** Broad searches of employers in the field, used with the role's own searches (Workable, chosen countries). */
  sweep?: string[];
}

export const INDUSTRIES: IndustryInfo[] = [
  { id: "hospitality", en: "Hospitality and food", fr: "Hôtellerie et restauration", ar: "الضيافة والمطاعم",
    words: ["hospitality", "hotel", "hotels", "restaurant", "restaurants", "f&b", "food and beverage", "hotellerie", "restauration", "ضيافة", "فنادق", "مطاعم", "gastronomie", "hotellerie und gastronomie"],
    queries: ["hospitality", "hotel", "restaurant"] },
  { id: "healthcare", en: "Healthcare and medicine", fr: "Santé et médecine", ar: "الرعاية الصحية والطب",
    words: ["healthcare", "health care", "medical", "medicine", "health", "hospital", "clinic", "sante", "medical et sante", "medecine", "soins", "صحة", "طبي", "طب", "رعاية صحية", "gesundheitswesen", "medizin"],
    queries: ["healthcare", "medical", "nurse"], sweep: ["hospital", "clinic"] },
  { id: "technology", en: "Technology and IT", fr: "Technologie et informatique", ar: "التقنية وتكنولوجيا المعلومات",
    words: ["technology", "tech", "it", "information technology", "software", "digital", "informatique", "technologie", "numerique", "تقنية", "تكنولوجيا", "تقنية المعلومات", "برمجيات", "informatik"],
    queries: ["software", "developer", "IT"] },
  { id: "engineering", en: "Engineering and construction", fr: "Ingénierie et BTP", ar: "الهندسة والإنشاءات",
    words: ["engineering", "construction", "ingenierie", "btp", "batiment", "genie civil", "هندسة", "إنشاءات", "مقاولات", "bau", "bauwesen", "ingenieurwesen"],
    queries: ["engineer", "construction"] },
  { id: "finance", en: "Finance and accounting", fr: "Finance et comptabilité", ar: "المالية والمحاسبة",
    words: ["finance", "accounting", "banking", "accounts", "financial services", "comptabilite", "banque", "audit", "مالية", "محاسبة", "بنوك", "مصرفية", "finanzen", "buchhaltung", "bankwesen"],
    queries: ["finance", "accountant"] },
  { id: "legal", en: "Legal", fr: "Juridique", ar: "القانون",
    words: ["legal", "law", "juridique", "droit", "قانون", "قانوني", "محاماة", "recht"], queries: ["legal", "lawyer"] },
  { id: "education", en: "Education and training", fr: "Enseignement et formation", ar: "التعليم والتدريب",
    words: ["education", "teaching", "school", "schools", "academic", "enseignement", "education nationale", "formation", "تعليم", "تدريس", "bildung", "lehre", "unterricht"],
    queries: ["teacher", "education"], sweep: ["school"] },
  { id: "sales", en: "Sales and business development", fr: "Vente et développement commercial", ar: "المبيعات وتطوير الأعمال",
    words: ["sales", "selling", "business development", "vente", "ventes", "commercial", "مبيعات", "تطوير الأعمال", "vertrieb", "verkauf"], queries: ["sales", "business development"] },
  { id: "marketing", en: "Marketing and communications", fr: "Marketing et communication", ar: "التسويق والاتصال",
    words: ["marketing", "communications", "communication", "pr", "public relations", "advertising", "publicite", "تسويق", "إعلان", "علاقات عامة", "werbung", "kommunikation"],
    queries: ["marketing", "communications"] },
  { id: "creative", en: "Creative, media and entertainment", fr: "Création, médias et divertissement", ar: "الإبداع والإعلام والترفيه",
    words: ["creative", "design", "media", "film", "photography", "entertainment", "arts", "art", "creation", "medias", "audiovisuel", "تصميم", "إعلام", "فنون", "ترفيه", "medien", "unterhaltung"],
    queries: ["designer", "creative", "media"] },
  { id: "beauty", en: "Fashion, beauty and wellness", fr: "Mode, beauté et bien-être", ar: "الأزياء والتجميل والعافية",
    words: ["fashion", "beauty", "modelling", "modeling", "cosmetics", "wellness", "spa", "fitness", "mode", "beaute", "mannequinat", "bien-etre", "أزياء", "موضة", "تجميل", "عرض أزياء", "لياقة", "kosmetik", "wellness"],
    queries: ["fashion", "beauty", "model"] },
  { id: "real-estate", en: "Real estate and property", fr: "Immobilier", ar: "العقارات",
    words: ["real estate", "property", "properties", "realty", "immobilier", "عقارات", "عقاري", "immobilien"], queries: ["real estate", "property"] },
  { id: "logistics", en: "Logistics, transport and supply chain", fr: "Logistique, transport et achats", ar: "اللوجستيات والنقل وسلاسل الإمداد",
    words: ["logistics", "supply chain", "transport", "transportation", "shipping", "warehousing", "procurement", "purchasing", "logistique", "achats", "لوجستيات", "خدمات لوجستية", "نقل", "سلاسل الإمداد", "مشتريات", "logistik", "einkauf"],
    queries: ["logistics", "warehouse", "driver"] },
  { id: "aviation", en: "Aviation and travel", fr: "Aérien et voyage", ar: "الطيران والسفر",
    words: ["aviation", "airline", "airlines", "airport", "travel", "tourism", "aerien", "aeroport", "voyage", "tourisme", "طيران", "سفر", "سياحة", "luftfahrt", "tourismus"],
    queries: ["cabin crew", "airport", "travel"] },
  { id: "customer-service", en: "Customer service", fr: "Service client", ar: "خدمة العملاء",
    words: ["customer service", "customer support", "call center", "call centre", "contact center", "service client", "relation client", "خدمة العملاء", "kundenservice"],
    queries: ["customer service", "call center"] },
  { id: "admin", en: "Administration and HR", fr: "Administration et RH", ar: "الإدارة والموارد البشرية",
    words: ["administration", "admin", "office", "administrative", "hr", "human resources", "recruitment", "administratif", "ressources humaines", "rh", "إدارة", "إداري", "موارد بشرية", "verwaltung", "personalwesen"],
    queries: ["administrative", "HR", "receptionist"] },
  { id: "trades", en: "Skilled trades and services", fr: "Métiers techniques et services", ar: "الحرف والخدمات",
    words: ["trades", "skilled trades", "maintenance", "technician", "manufacturing", "labour", "labor", "factory", "metiers", "artisanat", "industrie", "صيانة", "حرف", "مصنع", "handwerk"],
    queries: ["technician", "maintenance", "electrician"] },
  { id: "retail", en: "Retail", fr: "Commerce de détail", ar: "تجارة التجزئة",
    words: ["retail", "shop", "store", "stores", "commerce de detail", "grande distribution", "magasin", "بيع بالتجزئة", "تجزئة", "einzelhandel"], queries: ["retail", "sales associate", "store"] },
  { id: "management", en: "General management", fr: "Direction générale", ar: "الإدارة العليا",
    words: ["management", "executive", "leadership", "general management", "direction", "direction generale", "إدارة عليا", "قيادة", "geschäftsführung"],
    queries: ["general manager", "operations manager", "director"] },
  { id: "science", en: "Science and research", fr: "Sciences et recherche", ar: "العلوم والبحث",
    words: ["science", "research", "laboratory", "lab", "scientific", "recherche", "laboratoire", "علوم", "بحث علمي", "مختبر", "forschung", "wissenschaft"], queries: ["scientist", "laboratory"] },
];

const INDUSTRY_BY_ID = new Map(INDUSTRIES.map(i => [i.id, i]));
export const industryById = (id: string): IndustryInfo | undefined => INDUSTRY_BY_ID.get(id as Industry);
export const isIndustry = (v: unknown): v is Industry => typeof v === "string" && INDUSTRY_BY_ID.has(v as Industry);
/** A field's name in the interface language. */
export const industryName = (id: string, lang: "en" | "fr" | "ar"): string => INDUSTRY_BY_ID.get(id as Industry)?.[lang] ?? id;

/** The field a typed role names as a whole ("Healthcare", "IT", "تسويق"), or null. */
export function fieldOf(role: string): Industry | null {
  const t = cleanTitle(role);
  if (!t) return null;
  for (const i of INDUSTRIES) if (i.words.some(w => cleanTitle(w) === t)) return i.id;
  return null;
}

let FIELD_RES: Map<Industry, RegExp> | null = null;
/** Field words too common in other jobs' titles to place a listing in the field ("Executive Assistant"). */
const NOT_TITLE_EVIDENCE = new Set(["executive", "office", "direction", "digital", "management", "leadership", "admin", "art", "design", "media", "shop", "store", "lab"]);
/** A field's own words in a title ("Healthcare Assistant", "Marketing Intern"). */
function fieldWordsRe(id: Industry): RegExp {
  if (!FIELD_RES) {
    FIELD_RES = new Map(INDUSTRIES.map(i => {
      const alts = i.words.filter(w => cleanTitle(w).length >= 2 && !NOT_TITLE_EVIDENCE.has(cleanTitle(w))).map(titleBody);
      return [i.id, new RegExp(`(?<![\\p{L}\\p{N}])(?:${alts.join("|")})(?![\\p{L}\\p{N}])`, "u")];
    }));
  }
  return FIELD_RES.get(id)!;
}

/** Fields a listing belongs to, from its title's jobs, else from the field's words in its title or tags. */
export function industriesOf(title: string, tags: string[] = [], context = ""): Industry[] {
  const jobs = familiesOfTitle(title, context).filter(f => f.kind !== "level");
  const out = new Set<Industry>(jobs.flatMap(f => f.industries ?? []));
  if (out.size) return [...out];
  const hay = cleanTitle(`${title} ${tags.join(" ")}`);
  for (const i of INDUSTRIES) if (fieldWordsRe(i.id).test(hay)) out.add(i.id);
  return [...out];
}

// ── Titles ───────────────────────────────────────────────────────────────────

/**
 * A title as a pattern: whole words, any spacing or hyphen between them, and the plural that job
 * boards use for several openings ("Bartenders", "Waiters", "Commis Chefs").
 */
export function titleRe(title: string): RegExp {
  return new RegExp(`(?<![\\p{L}\\p{N}])${titleBody(title)}(?![\\p{L}\\p{N}])`, "u");
}

/** A title's words as a pattern, with the plural ending job boards add ("Bartenders"). */
function titleBody(title: string): string {
  const t = cleanTitle(title);
  const body = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "[\\s\\-/]+");
  return /[a-z]$/.test(t) ? `${body}(?:e?s)?` : body;
}

// Every title with its family, longest first, so "assistant restaurant manager" wins over
// "restaurant manager" and "head bartender" over "bartender".
interface TitleEntry { family: Family; title: string; re: RegExp; len: number; ambiguous: boolean; order: number }
let BY_FIRST: Map<string, TitleEntry[]> | null = null;
const SPLIT = /[\s\-/,;:|()]+/u;
/** Every title, filed under its first word: only titles whose first word is in a listing's title are tried. */
function byFirst(): Map<string, TitleEntry[]> {
  if (!BY_FIRST) {
    const all = FAMILIES.flatMap(f => f.titles.map(t => ({
      family: f, title: t, re: titleRe(t), len: cleanTitle(t).length,
      ambiguous: (f.ambiguous ?? []).some(a => cleanTitle(a) === cleanTitle(t)), order: 0,
    }))).sort((a, b) => b.len - a.len);
    all.forEach((e, i) => { e.order = i; });
    BY_FIRST = new Map();
    for (const e of all) {
      const first = cleanTitle(e.title).split(SPLIT)[0];
      const list = BY_FIRST.get(first) ?? [];
      list.push(e);
      BY_FIRST.set(first, list);
    }
  }
  return BY_FIRST;
}

/** The titles worth trying for a cleaned title, longest first. */
function candidates(t: string): TitleEntry[] {
  const map = byFirst();
  const seen = new Set<TitleEntry[]>();
  const out: TitleEntry[] = [];
  for (const w of t.split(SPLIT)) {
    if (!w) continue;
    for (const k of [w, w.replace(/es$/u, ""), w.replace(/s$/u, "")]) {
      const list = map.get(k);
      if (list && !seen.has(list)) { seen.add(list); out.push(...list); }
    }
  }
  return out.sort((a, b) => a.order - b.order);
}

const FAMILY_CACHE = new Map<string, Family[]>();

// ── Context for titles that mean several jobs ────────────────────────────────

const W = (alts: string) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${alts})(?![\\p{L}\\p{N}])`, "u");

/** Words that show a listing is about hospitality, for titles like "Server" or "Host". */
const HOSPITALITY = W("restaurants?|dining|dinner|lunch|breakfast|brunch|food|beverages?|drinks|cocktails?|wine|f&b|guests?|bar|cafe|coffee|hotels?|resorts?|kitchen|chef|menu|cuisine|catering|banquets?|hospitality|venues?|lounge|serveur|مطعم|فندق|ضيوف");
/** Words in a title that make "Server" or "Host" another job ("Server Engineer", "Podcast Host"). */
const NOT_HOSPITALITY = W("engineer|engineering|developer|software|devops|sre|sysadmin|administrator|architect|backend|frontend|database|sql|linux|windows|cloud|network|infrastructure|security|platform|api|web|it|data|game|gaming|minecraft|discord|proxy|dns|mail|email|podcast|radio|tv|television|show|stream|streaming|webinar|youtube|virtual");

const CONTEXTS: Record<ContextId, { yes: RegExp; no: RegExp }> = {
  hospitality: { yes: HOSPITALITY, no: NOT_HOSPITALITY },
  // "Model": fashion and commercial modelling, not data, AI, 3D or financial models.
  fashion: {
    yes: W("fashion|runway|catwalk|modell?ing|model agency|modelling agency|photoshoots?|photo shoots?|shoots?|commercials?|promotional|editorial|showroom|fittings?|brand ambassadors?|beauty|makeup|make-up|castings?|hijab|abaya|lookbook|campaigns?|portfolio|agency|designers?|couture|ازياء|عرض ازياء|defile|mannequinat|mode|photographers?"),
    no: W("data|ai|ml|machine|learning|risk|financial|finance|3d|bim|language|llm|llms|business|operating|pricing|credit|statistical|quantitative|validation|trainer|training|annotation|annotator|evaluation|evaluator|engineer|engineering|analyst|scientist|developer|research|researcher|architect|software|cloud|deployment|governance|actuarial|predictive|forecasting|revit|cad|role|reviewer|economic|econometric|simulation|threat|mathematical"),
  },
  // "Architect": buildings, not software, cloud or enterprise architecture.
  building: {
    yes: W("architectural|buildings?|construction|interiors?|interior design|landscape|revit|autocad|archicad|sketchup|riba|design studio|villas?|residential|urban|masterplan|master plan|facades?|fit-?out|planning permission|leed|rhino|معماري|البناء|batiment|chantier|hospitality design"),
    no: W("software|solutions?|cloud|data|enterprise|it|security|network|systems?|technical|integration|platform|salesforce|aws|azure|gcp|ai|application|applications|infrastructure|devops|java|sap|oracle|microsoft|product|ux|information|digital|crm|erp|api|microservices|kubernetes"),
  },
  // "Advocate": a lawyer, not a customer, patient or developer advocate.
  legal: {
    yes: W("legal|law|lawyers?|courts?|litigation|bar council|attorneys?|law firm|advocates?|counsel|legal practice|contracts|محاماه|قانوني|قانونيه|محكمه|avocat|juridique|tribunal"),
    no: W("customer|patients?|developer|developers|brand|employee|employees|community|users?|consumer|clients?|sales|support|success|health|care|student|students|guest|guests|devrel|product|wellbeing|accessibility|technical|partner|education"),
  },
  // "Trainer": fitness and sport, not AI training data or corporate training.
  fitness: {
    yes: W("gym|gyms|fitness|personal training|strength|conditioning|workouts?|members|wellness|sports?|clubs?|yoga|pilates|crossfit|bootcamp|lifting|cardio|لياقه|نادي|salle de sport|musculation"),
    no: W("ai|data|annotation|annotator|llm|llms|models?|language|corporate|sales|technical|software|product|customer|it|clinical|medical|learning|instructional|soft skills|onboarding|systems?|crm|erp|sap|safety|driving|flight|aviation|writing|coding|math|maths|chemistry|physics|biology|finance|legal|reasoning|expert"),
  },
  // "Driver": a person who drives, not a device or growth driver.
  transport: {
    yes: W("driving|licen[cs]e|vehicles?|delivery|deliveries|trucks?|lorry|bus|buses|transport|routes?|chauffeur|fleet|cars?|vans?|motorbike|logistics|قياده|رخصه|توصيل|permis|livraison"),
    no: W("software|kernel|firmware|engineer|engineering|developer|development|growth|revenue|key|business|device|linux|windows|graphics|gpu|test|testing|qa|strategy|value|change|performance|innovation|digital|data"),
  },
  // "Principal": the head of a school, not a principal engineer or consultant.
  education: {
    yes: W("schools?|students?|curriculum|teaching|academic|education|educational|campus|pupils|learners|ofsted|khda|igcse|مدرسه|مدارس|طلاب|ecole|lycee|eleves"),
    no: W("engineer|engineering|consultant|architect|scientist|designer|developer|analyst|manager|product|data|software|investigator|associate|program|programme|technical|security|cloud|partner|research|firmware|staff|lead|account|accountant|auditor|design|ux|counsel|recruiter|specialist"),
  },
  // "Animator" in a studio: 2D, 3D, motion.
  animation: {
    yes: W("2d|3d|motion|after effects|maya|blender|cinema 4d|c4d|animation studio|cartoons?|character|characters|vfx|unity|spine|storyboards?|rigging|keyframe|toon boom|adobe animate"),
    no: W("kids|club|hotel|resort|entertainment|sports|fitness|guests?|activities|recreation|holiday|camp"),
  },
  // "Animator" in a hotel or resort: guest entertainment.
  entertainment: {
    yes: W("kids club|kids|children|hotel|resorts?|guests?|entertainment|activities|recreation|animation team|holidays?|camp|club|فندق|منتجع|ضيوف|hotellerie|club enfants|tourism|tourisme"),
    no: W("2d|3d|motion|vfx|character|graphics|cgi|unity|maya|blender|after effects|designer|digital"),
  },
};

/**
 * Whether an ambiguous title is the job its family means: never when the title itself names
 * another field; yes when the title names the family's field; otherwise when the listing's text
 * names the field in at least two different words (one passing mention is not enough). A role
 * the candidate typed counts unless it names another field.
 */
function contextFits(id: ContextId, title: string, context: string): boolean {
  const c = CONTEXTS[id];
  if (c.no.test(title)) return false;
  if (context === TARGET) return true;
  if (c.yes.test(title)) return true;
  const all = new RegExp(c.yes.source, "gu");
  const hits = new Set([...norm(context).matchAll(all)].map(m => m[0].replace(/s$/, "")));
  return hits.size >= 2;
}

/** Spellings that mean the same thing ("F & B", "F and B" → "f&b"), without gender markers ("(m/w/d)", "(H/F)"). */
export function cleanTitle(s: string): string {
  return norm(s)
    .replace(/\(\s*(?:[mwfhdx]\s*[/|,]\s*)+[mwfhdx]\s*\)|\(\s*(?:all genders|alle geschlechter|gn\*?|f\/h|h\/f)\s*\)/g, " ")
    .replace(/\bf\s*(?:&|and|\+|\/)\s*b\b/g, "f&b")
    .replace(/\bfood\s*(?:&|\+)\s*beverage/g, "food and beverage")
    .replace(/\bc\s*&\s*b\b/g, "c&b")
    .replace(/\bmaitre\s*d['’]?(?=\s|$)/g, "maitre d")
    .replace(/\s+/g, " ")
    .trim();
}

/** Context marker: the title is a role the candidate typed, not a listing. */
const TARGET = "\u0000target";

/**
 * The jobs a title names, most specific first: "Assistant Restaurant Manager" is that job, not also
 * "Restaurant Manager" (the longer title wins its words); "Barista, Waiter, Waitress, Kitchen Helper"
 * names barista and waiter. `context` (the listing's other text) decides titles that also name
 * other jobs: "Server" is a waiter only in a restaurant, not in a data centre. A career stage
 * ("Marketing Intern") is returned too, marked `kind: "level"`.
 */
export function familiesOfTitle(title: string, context = ""): Family[] {
  const t = cleanTitle(title);
  if (!t) return [];
  const key = `${t}\u0001${context.length}\u0001${context.slice(0, 80)}`;
  const hit = FAMILY_CACHE.get(key);
  if (hit) return hit;
  const taken: [number, number][] = [];
  const out: Family[] = [];
  const verdicts = new Map<ContextId, boolean>();
  for (const e of candidates(t)) {
    const m = e.re.exec(t);
    if (!m) continue;
    const span: [number, number] = [m.index, m.index + m[0].length];
    if (taken.some(([a, b]) => span[0] < b && span[1] > a)) continue;
    if (e.ambiguous) {
      const id = e.family.context ?? "hospitality";
      let ok = verdicts.get(id);
      if (ok === undefined) { ok = contextFits(id, t, context); verdicts.set(id, ok); }
      if (!ok) continue;
    }
    taken.push(span);
    // "Marketing Manager - F&B" is a marketing job, "Manager - F&B Systems Design" a design job.
    if (!out.includes(e.family) && !namesOtherJob(e.family, t, span)) out.push(e.family);
  }
  if (FAMILY_CACHE.size > 4000) FAMILY_CACHE.clear();
  FAMILY_CACHE.set(key, out);
  return out;
}

/** The job a title names (its most specific one, not a career stage), or null. See familiesOfTitle. */
export function familyOfTitle(title: string, context = ""): Family | null {
  const all = familiesOfTitle(title, context);
  return all.find(f => f.kind !== "level") ?? all[0] ?? null;
}

const PARENT_OF = new Map(FAMILIES.filter(f => f.parent).map(f => [f.id, f.parent!]));
/** Whether a family is a kind of another (a cardiologist of "doctor", a civil engineer of "engineer"). */
export function isKindOf(id: string, ancestor: string): boolean {
  let p = PARENT_OF.get(id);
  for (let i = 0; p && i < 6; i++) {
    if (p === ancestor) return true;
    p = PARENT_OF.get(p);
  }
  return false;
}

// ── Spelling ──

let VOCAB: Set<string> | null = null;
function vocab(): Set<string> {
  if (!VOCAB) VOCAB = new Set(FAMILIES.flatMap(f => f.titles.flatMap(t => cleanTitle(t).split(/[^\p{L}&]+/u))).filter(w => w.length >= 4));
  return VOCAB;
}

/** Edit distance with transpositions, stopping early above `max`. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      rowMin = Math.min(rowMin, d[i][j]);
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length][b.length];
}

/** The title with likely typos fixed ("f&B suoervisor" → "f&b supervisor"), or null when nothing changed. */
export function correctTitle(input: string): string | null {
  const words = cleanTitle(input).split(" ");
  const v = vocab();
  let changed = false;
  const out = words.map(w => {
    if (w.length < 4 || v.has(w) || /[^\p{L}]/u.test(w)) return w;
    const max = w.length >= 8 ? 2 : 1;
    let best: string | null = null;
    let bestD = max + 1;
    let tie = false;
    for (const c of v) {
      const dd = distance(w, c, max);
      if (dd < bestD) { best = c; bestD = dd; tie = false; } else if (dd === bestD) tie = true;
    }
    if (best && !tie && bestD <= max) { changed = true; return best; }
    return w;
  });
  return changed ? out.join(" ") : null;
}

// ── Roles the agent doesn't know: matching by the title's words ──────────────

/** Small words that carry no meaning in a title. */
const FILLER = new Set(["of", "the", "and", "for", "in", "at", "to", "a", "an", "with", "de", "du", "des", "la", "le", "les", "et", "en", "au", "aux", "d", "l",
  "und", "der", "die", "das", "für", "in", "و", "في", "من", "لل", "&", "-", "/"]);
/** Seniority words: a level, not the job ("Senior Underwater Welder" is an underwater welder). */
const LEVEL_WORDS = new Set(["senior", "sr", "junior", "jr", "mid", "entry", "level", "experienced", "confirme", "confirmee", "debutant", "debutante"]);
/** French and Arabic titles start with their main word ("Responsable boutique", "مهندس مدني"). */
const FR_HEADS = new Set(["responsable", "chef", "directeur", "directrice", "assistant", "assistante", "charge", "chargee", "conseiller", "conseillere", "technicien",
  "technicienne", "ingenieur", "ingenieure", "agent", "agente", "gestionnaire", "employe", "employee", "operateur", "operatrice", "vendeur", "vendeuse", "animateur",
  "animatrice", "coordinateur", "coordinatrice", "consultant", "consultante", "educateur", "educatrice", "professeur", "formateur", "formatrice", "infirmier", "infirmiere"]);

export interface WordPlan {
  /** The word that names the job ("welder" in "underwater welder", "head" in "head of growth"). */
  head: string;
  /** The words that make it this job rather than another of the same kind. */
  mods: string[];
}

/** One spelling for singular and plural ("analysts" → "analyst", "nannies" → "nanny"). */
export function stemWord(w: string): string {
  if (w.length > 4 && w.endsWith("ies")) return `${w.slice(0, -3)}y`;
  if (w.length > 3 && /[^s]s$/u.test(w)) return w.slice(0, -1);
  return w;
}

function titleWords(s: string): string[] {
  return cleanTitle(s).split(/[^\p{L}\p{N}+#&.]+/u).map(w => w.replace(/^\.+|\.+$/g, "")).filter(w => w.length >= 2 || /[\p{Script=Arabic}]/u.test(w));
}

/** How a role the agent doesn't know is matched against titles: its main word and the rest. */
export function wordPlan(role: string): WordPlan | null {
  const all = titleWords(role).filter(w => !LEVEL_WORDS.has(w));
  if (!all.length) return null;
  const ofAt = all.indexOf("of");
  if (ofAt > 0) {
    const before = all.slice(0, ofAt).filter(w => !FILLER.has(w));
    const after = all.slice(ofAt + 1).filter(w => !FILLER.has(w));
    if (before.length) return { head: stemWord(before[before.length - 1]), mods: [...before.slice(0, -1), ...after].map(stemWord) };
  }
  const words = all.filter(w => !FILLER.has(w));
  if (!words.length) return null;
  const headFirst = /[\p{Script=Arabic}]/u.test(role) || FR_HEADS.has(words[0]) || /\s(?:de|du|des)\s|\sd'/u.test(cleanTitle(role));
  const head = headFirst ? words[0] : words[words.length - 1];
  const mods = headFirst ? words.slice(1) : words.slice(0, -1);
  return { head: stemWord(head), mods: mods.map(stemWord) };
}

/**
 * Whether a listing's title names a role the agent doesn't know: "all" when it has the role's main
 * word and its other words (all of them for two or fewer, two thirds otherwise), "head" when it has
 * only the main word (a broader title, used to widen a search that found nothing), else null.
 */
export function wordsFitTitle(plan: WordPlan, title: string): "all" | "head" | null {
  const have = new Set(titleWords(title).map(stemWord));
  if (!have.has(plan.head)) return null;
  if (!plan.mods.length) return "all";
  const hit = plan.mods.filter(m => have.has(m)).length;
  const need = plan.mods.length <= 2 ? plan.mods.length : Math.ceil((plan.mods.length * 2) / 3);
  return hit >= need ? "all" : "head";
}

/** Words that name a profession: a title with one of them is a job of its own, not a generic posting. */
const PROFESSION = W([
  "engineers?", "engineering", "developers?", "programmers?", "managers?", "specialists?", "analysts?", "consultants?", "officers?", "coordinators?", "executives?",
  "representatives?", "technicians?", "designers?", "directors?", "administrators?", "supervisors?", "advisors?", "advisers?", "architects?", "scientists?",
  "writers?", "editors?", "teachers?", "nurses?", "accountants?", "lawyers?", "drivers?", "operators?", "clerks?", "controllers?", "planners?", "buyers?", "recruiters?",
  "trainers?", "instructors?", "therapists?", "doctors?", "physicians?", "pharmacists?", "chefs?", "cooks?", "waiters?", "waitress", "bartenders?", "baristas?",
  "cashiers?", "receptionists?", "agents?", "guards?", "cleaners?", "mechanics?", "electricians?", "plumbers?", "welders?", "carpenters?", "painters?",
  "photographers?", "videographers?", "producers?", "marketers?", "strategists?", "auditors?", "surveyors?", "estimators?", "inspectors?", "testers?", "recruitment",
  "ingenieur", "responsable", "charge", "conseiller", "technicien", "directeur", "gestionnaire", "comptable", "developpeur",
  "مهندس", "مدير", "محاسب", "مطور", "فني", "اخصائي", "مسؤول", "منسق", "مشرف", "سائق", "مندوب",
].join("|"));

/** Whether a title names no profession of its own ("Team Member – Lounge", "Bar Crew", "Join our team"). */
export function genericTitle(title: string): boolean {
  return !PROFESSION.test(cleanTitle(title));
}

// ── Plans ──

export interface RolePlan {
  /** As the candidate typed it. */
  input: string;
  /** What is searched for: the input, with likely typos fixed. */
  role: string;
  corrected: boolean;
  family: Family | null;
  /** A whole field typed as a role ("healthcare"): every job in it counts. */
  field: Industry | null;
  /** For a role no family knows: its words. */
  words: WordPlan | null;
  /** English terms for keyword searches, most important first. */
  terms: string[];
  /** Terms for French- and German-speaking markets. */
  local: { fr: string[]; de: string[] };
  /** Families that count as this same job (only the role's own; its kinds count through isKindOf). */
  same: string[];
  /** Neighbouring families, offered as related titles. */
  related: string[];
  /**
   * Words the candidate typed beyond the job's own title ("underwater" in "Underwater welder"):
   * a listing without them is the related, broader job, not this one.
   */
  extras: string[];
}

/** Words in a typed role that describe the search, not the job ("remote", "part time", "Arabic speaking", "urgent"). */
const NOT_JOB_WORDS = new Set(["remote", "hybrid", "onsite", "on-site", "part", "time", "full", "freelance", "contract", "temporary", "female", "male", "urgent",
  "urgently", "hiring", "job", "jobs", "vacancy", "vacancies", "position", "positions", "required", "needed", "wanted", "speaking", "speaker", "bilingual", "arabic",
  "english", "french", "german", "native", "immediate", "immediately", "joiner", "opening", "openings", "role", "roles", "work", "from", "home", "wfh", "available",
  "teletravail", "distance", "temps", "partiel", "plein", "urgence", "poste", "emploi", "عن", "بعد", "دوام", "جزئي", "كامل", "وظيفة", "وظائف", "مطلوب", "عاجل"]);

/** The words of a typed role that its job's title doesn't account for. */
function extraWords(role: string, family: Family): string[] {
  const t = cleanTitle(role);
  const matched = family.titles.filter(x => titleRe(x).test(t)).sort((a, b) => b.length - a.length)[0];
  if (!matched) return [];
  const own = new Set(titleWords(matched).map(stemWord));
  const places = new Set(countriesIn(role).length ? titleWords(role).filter(w => countriesIn(w).length) : []);
  return [...new Set(titleWords(role).map(stemWord))]
    .filter(w => !own.has(w) && !FILLER.has(w) && !LEVEL_WORDS.has(w) && !NOT_JOB_WORDS.has(w) && !places.has(w) && !/^\d+$/.test(w));
}

/** Whether a title has every extra word of a role. */
function hasExtras(extras: string[], title: string): boolean {
  if (!extras.length) return true;
  const have = new Set(titleWords(title).map(stemWord));
  return extras.every(w => have.has(w));
}

const ARABIC = /[\p{Script=Arabic}]/u;

/** How to search for one target role. */
export function planRole(input: string, includeRelated = false): RolePlan {
  const typed = input.trim();
  let role = cleanTitle(typed);
  let family = familyOfTitle(role, TARGET);
  let corrected = false;
  if (!family) {
    const fixed = correctTitle(typed);
    const fixedFamily = fixed ? familyOfTitle(fixed, TARGET) : null;
    if (fixed && fixedFamily) { role = fixed; family = fixedFamily; corrected = true; }
  }
  const field = family ? null : fieldOf(role);
  // Most listings are written in English: an Arabic title is searched by its English titles; a
  // whole field by its usual searches.
  const terms: string[] = (ARABIC.test(role) && family) || field ? [] : [role];
  const add = (t: string | undefined) => { if (t && !terms.some(x => cleanTitle(x) === cleanTitle(t))) terms.push(t); };
  if (family) {
    for (const t of family.search ?? [family.titles[0]]) add(t);
    if (includeRelated) {
      for (const id of [...(family.related ?? []), ...(family.parent ? [family.parent] : [])]) {
        const r = BY_ID.get(id);
        add(r ? (r.search?.[0] ?? r.titles[0]) : undefined);
      }
    }
  } else if (field) {
    for (const t of industryById(field)!.queries) add(t);
  }
  if (!terms.length) terms.push(role);
  const extras = family && family.kind !== "level" ? extraWords(role, family) : [];
  // A more specific job than its family ("Underwater welder"): searched as typed first; the
  // family's own titles are the widening step if that finds nothing.
  if (extras.length && !ARABIC.test(role)) terms.splice(1);
  const related = family ? [...new Set([...(family.related ?? []), ...(family.parent ? [family.parent] : [])])] : [];
  return {
    input: typed, role, corrected, family, field,
    words: family || field ? null : wordPlan(role),
    terms,
    local: { fr: family?.fr ?? [], de: family?.de ?? [] },
    same: family ? [family.id] : [], related,
    extras,
  };
}

/** Terms to search when a role found nothing: its broader job and neighbours, or its main word. */
export function widenTerms(p: RolePlan): string[] {
  if (p.family && p.extras.length) return (p.family.search ?? [p.family.titles[0]]).slice(0, 2);
  if (p.family) {
    const ids = [...(p.family.parent ? [p.family.parent] : []), ...(p.family.related ?? [])];
    return [...new Set(ids.map(id => BY_ID.get(id)).filter((f): f is Family => Boolean(f)).map(f => f.search?.[0] ?? f.titles[0]))].slice(0, 3);
  }
  if (p.words && p.words.mods.length) return [p.words.head];
  return [];
}

export type TitleFit = "same" | "related" | "other" | "unknown";

/**
 * How a listing's title relates to a planned role:
 *   same     the same job (any way of writing it, or a kind of it), or a job in the field searched
 *   related  a neighbouring job, the broader job or another kind of it
 *   other    a different, known job (for example a chef listing for a bartender)
 *   unknown  the title isn't a job this file knows; judge it by its words instead
 */
export function titleFit(plan: RolePlan, title: string, context = ""): TitleFit {
  const named = familiesOfTitle(title, context);
  const jobs = named.filter(f => f.kind !== "level");
  if (plan.field) {
    if (jobs.some(f => f.industries?.includes(plan.field!))) return "same";
    if (fieldWordsRe(plan.field).test(cleanTitle(title))) return "same";
    return jobs.length ? "other" : "unknown";
  }
  const own = plan.family;
  if (!own) return "unknown";
  // An internship or graduate search: the title must say so, whatever the job.
  if (own.kind === "level") return named.some(f => f.id === own.id) ? "same" : "other";
  if (!jobs.length) return "unknown";
  if (jobs.some(f => f.id === own.id || isKindOf(f.id, own.id))) return hasExtras(plan.extras, title) ? "same" : "related";
  if (jobs.some(f => plan.related.includes(f.id) || (f.related ?? []).includes(own.id) || isKindOf(own.id, f.id)
    || (own.parent !== undefined && f.parent === own.parent))) return "related";
  return "other";
}

/**
 * For a listing whose title this file doesn't know ("Bar Associate", "Team Member – Lounge"):
 * whether its title or text names the planned job ("We're looking for an experienced bartender…").
 * Pass the start of the description: a job named deep in the text ("reporting to the restaurant
 * manager") says little. Titles that also name other jobs ("server") count only in the right context.
 */
export function mentionsJob(plan: RolePlan, title: string, text: string): boolean {
  const f = plan.family;
  if (!f || f.kind === "level") return false;
  // A title that names another profession is that profession, whatever its text mentions
  // ("HR Recruiter – Real Estate Agency", "Sales Executive – Specialty Coffee").
  const t = cleanTitle(title);
  if (namesOtherJob(f, t, [0, t.length])) return false;
  const hay = cleanTitle(`${title}\n${text}`);
  const ambiguous = new Set((f.ambiguous ?? []).map(cleanTitle));
  let fits: boolean | null = null;
  for (const x of new Set([plan.role, ...f.titles])) {
    if (!titleRe(x).test(hay)) continue;
    if (ambiguous.has(cleanTitle(x))) {
      fits ??= contextFits(f.context ?? "hospitality", t, text);
      if (!fits) continue;
    }
    return true;
  }
  return false;
}

/** Words that name a profession of their own, in a title that also names a hospitality job. */
const OTHER_JOB_ALL = /(?<![\p{L}])(recruiter|recruitment|recruiting|talent|hr|engineer|engineering|developer|programmer|accountant|accounting|finance|financial|payroll|marketing|design|designer|systems|analyst|controller|cost|auditor|audit|purchasing|procurement|buyer|photographer|videographer|content|driver|nurse|teacher|lawyer|legal|technician|electrician|plumber|security|cashier|storekeeper|sales|telesales)(?![\p{L}])/gu;

const OWN_WORDS = new Map<string, Set<string>>();
/** Separators between the jobs of a title that lists several ("Barista, Waiter, Cashier"). */
const LIST_SEPARATOR = /\s*(?:,|\/|;|\||\s(?:or|ou)\s)\s*/gu;

/**
 * Whether the part of a cleaned title around `span` (where this job is named) also names another
 * profession that isn't part of the job's own titles: "marketing manager - f&b" does; "catering
 * sales manager" doesn't (sales is part of catering); "barista, waiter, cashier" doesn't for barista
 * (cashier is another job in the list, not a word of this one). Only hospitality jobs are checked:
 * other fields name their own jobs precisely enough.
 */
function namesOtherJob(f: Family, t: string, span: [number, number]): boolean {
  if (!f.industries?.includes("hospitality") || f.industries.length > 1) return false;
  let own = OWN_WORDS.get(f.id);
  if (!own) { own = new Set(f.titles.flatMap(x => cleanTitle(x).split(" "))); OWN_WORDS.set(f.id, own); }
  let from = 0;
  let to = t.length;
  for (const m of t.matchAll(LIST_SEPARATOR)) {
    if (m.index + m[0].length <= span[0]) from = m.index + m[0].length;
    else if (m.index >= span[1]) { to = m.index; break; }
  }
  for (const m of t.slice(from, to).matchAll(OTHER_JOB_ALL)) if (!own.has(m[1])) return true;
  return false;
}

/** Display name of a family: its first title, capitalised ("F&B manager", "Bartender", "CEO"). */
export function familyLabel(f: Family): string {
  const t = f.titles[0];
  if (/^[a-z]{2,4}$/.test(t) && !["host", "cook", "dj"].includes(t)) return t.toUpperCase();
  return t.replace(/\b(ux|ui|it|hr|qa|hse|mep|ceo|cfo|cto|dj|gm|erp|seo|esg|ent|gis|bim|cad|pr|ehs|hvac)\b/g, m => m.toUpperCase())
    .replace(/\bf&b\b/gi, "F&B").replace(/^(\p{L})/u, c => c.toUpperCase());
}

// ── Levels and contract types (filters) ──────────────────────────────────────

export type LevelBucket = "entry" | "mid" | "senior" | "manager" | "executive";
export const LEVEL_BUCKETS: LevelBucket[] = ["entry", "mid", "senior", "manager", "executive"];

const BUCKET_WORDS: [RegExp, LevelBucket][] = [
  [W("ceo|coo|cfo|cto|cmo|cio|chro|cpo|ciso|chief|vp|vice president|president|managing director|general manager|director|head of|partner|directeur|directrice|pdg|dg|geschäftsführer|الرئيس التنفيذي|مدير عام|رئيس قسم"), "executive"],
  [W("manager|supervisor|team lead|team leader|superintendent|foreman|responsable|gerant|gerante|chef d'equipe|superviseur|teamleiter|leiter|leiterin|مدير|مشرف|رئيس فريق"), "manager"],
  [W("senior|sr|snr|lead|principal|expert|iii|iv|confirme|confirmee|experimente|experimentee|اول|خبير"), "senior"],
  [W("intern|interns|internship|trainee|graduate|entry level|entry-level|junior|jr|apprentice|apprenticeship|assistant|stagiaire|alternance|alternant|apprenti|debutant|praktikant|praktikum|werkstudent|auszubildende|auszubildender|متدرب|مبتدئ|خريج"), "entry"],
  [W("mid-level|mid level|intermediate|ii"), "mid"],
];

/**
 * The career level a listing's title states, or null when it doesn't say: from its words ("Senior
 * Accountant", "Marketing Intern", "Head of Sales") and from jobs that are a level by themselves
 * ("Executive Chef", "Restaurant Manager", "School Principal"); the higher of the two.
 */
export function levelOfListing(title: string, context = ""): LevelBucket | null {
  const t = cleanTitle(title);
  const byWords = BUCKET_WORDS.find(([re]) => re.test(t))?.[1] ?? null;
  const f = familyOfTitle(title, context);
  const byJob: LevelBucket | null = !f ? null : f.kind === "level" ? "entry"
    : f.level >= 6 ? "executive" : f.level >= 5 ? "manager" : null;
  if (!byWords || !byJob) return byWords ?? byJob;
  return LEVEL_BUCKETS.indexOf(byWords) >= LEVEL_BUCKETS.indexOf(byJob) ? byWords : byJob;
}

export type Employment = "full-time" | "part-time" | "contract" | "temporary" | "internship" | "freelance";
export const EMPLOYMENTS: Employment[] = ["full-time", "part-time", "contract", "temporary", "internship", "freelance"];

const EMPLOYMENT_WORDS: [RegExp, Employment][] = [
  [W("full time|fulltime|permanent|cdi|vollzeit|دوام كامل"), "full-time"],
  [W("part time|parttime|teilzeit|temps partiel|دوام جزئي"), "part-time"],
  [W("contract|contractor|fixed term|cdd|befristet|عقد"), "contract"],
  [W("temporary|temp|seasonal|interim|saisonnier|zeitarbeit|مؤقت"), "temporary"],
  [W("intern|internship|stage|stagiaire|praktikum|werkstudent|apprenticeship|alternance|تدريب"), "internship"],
  [W("freelance|freelancer|independent|self employed|independant|freiberuflich|عمل حر"), "freelance"],
];

/** Contract types a source states ("Full time", "full_time", "CDI", "Contractor", "Werkstudent"). */
export function employmentOf(...values: (string | null | undefined)[]): Employment[] {
  const out = new Set<Employment>();
  for (const v of values) {
    const n = norm(v ?? "").replace(/[_-]+/g, " ");
    if (!n) continue;
    for (const [re, e] of EMPLOYMENT_WORDS) if (re.test(n)) out.add(e);
  }
  return [...out];
}
