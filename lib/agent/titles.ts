// lib/agent/titles.ts — what a job title means. Shared by the browser (ranking) and the server
// (searching). Employers write the same job many ways ("Bartender", "Mixologist", "Barman",
// "بارتندر"), so each job is a family: every way of writing it, its level, and its neighbours.
//
// - Same family = the same job: searched for and ranked as a match.
// - Related families = neighbouring jobs (a level up or down, or next to it): offered to the
//   candidate, and only searched for when they switch them on.
// - A title that belongs to an unrelated family is not this job, whatever words it shares
//   ("Executive Chef" is not a bartender job, "Assistant Restaurant Manager" is not
//   "Restaurant Manager").
//
// Adding a job: add a family below. The first title is the one shown; `search` lists the
// titles worth sending to job sources (most listings use one of them).

import { norm } from "./text";

export interface Family {
  id: string;
  /** 1 entry · 2 skilled · 3 supervisor · 4 assistant manager · 5 manager · 6 director · 7 executive */
  level: number;
  /** Every way employers write this job: English, French, Arabic, abbreviations. */
  titles: string[];
  /** Titles to send to keyword searches, most common first (defaults to the first title). */
  search?: string[];
  /** Neighbouring jobs (family ids). */
  related?: string[];
  /** Titles that also name other jobs ("server", "host"): they count only when the listing is about hospitality. */
  ambiguous?: string[];
  /** The part of hospitality the job belongs to (set below), for broader searches by sector. */
  sector?: Sector;
}

export type Sector = "fnb" | "hotel" | "kitchen" | "events";

export const FAMILIES: Family[] = [
  // ── Bar and coffee ──
  {
    id: "bartender", level: 1,
    titles: ["bartender", "bar tender", "barman", "barmaid", "bar attendant", "bar server", "bar staff", "mixologist", "mixology", "cocktail bartender",
      "serveur de bar", "mixologue", "بارتندر", "ساقي", "عامل بار"],
    search: ["bartender", "mixologist"],
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
    search: ["waiter", "waitress"],
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
    titles: ["host", "hostess", "restaurant host", "restaurant hostess", "reception host", "greeter", "hote d'accueil", "hotesse d'accueil", "مضيف", "مضيفة"],
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
    search: ["restaurant manager", "outlet manager"],
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
      "directeur des operations", "directrice des operations", "مدير العمليات"],
    related: ["hospitality-ops-manager", "general-manager"],
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
    related: ["hotel-manager", "operations-director"],
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
    titles: ["front desk agent", "front desk receptionist", "front office agent", "front office associate", "receptionist", "hotel receptionist",
      "guest service agent", "gsa", "night auditor", "reservations agent", "receptionniste", "agent de reception", "موظف استقبال", "موظف مكتب امامي"],
    search: ["receptionist", "front desk agent"],
    related: ["front-office-manager", "guest-relations"],
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
    related: ["housekeeping-manager"],
  },
  {
    id: "catering-manager", level: 5,
    titles: ["catering manager", "catering operations manager", "catering sales manager", "event catering manager", "head of catering", "catering supervisor",
      "responsable traiteur", "responsable restauration collective", "مدير التموين", "مدير الضيافه والتموين"],
    related: ["banquet-manager", "fb-manager"],
  },
  {
    id: "banquet-manager", level: 5,
    titles: ["banquet manager", "banqueting manager", "banquet operations manager", "conference and banqueting manager", "c&b manager",
      "events and banqueting manager", "assistant banquet manager", "banquet supervisor", "banquet captain",
      "responsable banquets", "responsable des banquets", "maitre d'hotel banquets", "مدير الحفلات", "مدير المادب"],
    search: ["banquet manager", "banqueting manager"],
    related: ["catering-manager", "fb-manager", "waiter"],
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
      "aide cuisinier", "طباخ", "مساعد طباخ"],
    search: ["commis chef", "cook"],
    related: ["chef-de-partie"],
  },
  {
    id: "pastry-chef", level: 3,
    titles: ["pastry chef", "pastry cook", "executive pastry chef", "pastry sous chef", "baker", "patissier", "chef patissier", "boulanger",
      "شيف حلويات", "خباز"],
    related: ["executive-chef", "commis-chef"],
  },

  // ── Beyond hospitality (the same idea; add families as needed) ──
  {
    id: "real-estate-agent", level: 2,
    titles: ["real estate agent", "real estate consultant", "property consultant", "property advisor", "property agent", "real estate broker",
      "real estate sales agent", "real estate sales consultant", "estate agent", "leasing consultant", "leasing agent", "off-plan sales consultant",
      "agent immobilier", "conseiller immobilier", "negociateur immobilier", "consultant immobilier", "وكيل عقاري", "مستشار عقاري", "وسيط عقاري"],
    search: ["real estate agent", "property consultant"],
    related: ["real-estate-manager"],
  },
  {
    id: "real-estate-manager", level: 5,
    titles: ["real estate manager", "sales manager real estate", "real estate sales manager", "property manager", "leasing manager", "brokerage manager",
      "directeur d'agence immobiliere", "مدير عقارات"],
    related: ["real-estate-agent"],
  },
];

const SECTORS: Record<Sector, string[]> = {
  fnb: ["bartender", "barback", "head-bartender", "bar-manager", "beverage-manager", "sommelier", "barista", "cafe-supervisor", "cafe-manager",
    "waiter", "head-waiter", "host", "restaurant-supervisor", "assistant-restaurant-manager", "restaurant-manager", "multi-unit-manager",
    "fb-manager", "fb-director"],
  hotel: ["hospitality-ops-manager", "hotel-manager", "guest-relations", "guest-relations-manager", "front-desk", "front-office-manager",
    "concierge", "housekeeping-manager", "room-attendant", "hospitality-director"],
  kitchen: ["executive-chef", "sous-chef", "chef-de-partie", "commis-chef", "pastry-chef"],
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

const BY_ID = new Map(FAMILIES.map(f => [f.id, f]));
for (const [sector, ids] of Object.entries(SECTORS) as [Sector, string[]][]) for (const id of ids) BY_ID.get(id)!.sector = sector;
export const familyById = (id: string): Family | undefined => BY_ID.get(id);

/**
 * A title as a pattern: whole words, any spacing or hyphen between them, and the plural that job
 * boards use for several openings ("Bartenders", "Waiters", "Commis Chefs").
 */
export function titleRe(title: string): RegExp {
  const t = norm(title);
  const body = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "[\\s\\-/]+");
  const plural = /[a-z]$/.test(t) ? "(?:e?s)?" : "";
  return new RegExp(`(?<![\\p{L}\\p{N}])${body}${plural}(?![\\p{L}\\p{N}])`, "u");
}

// Every title with its family, longest first, so "assistant restaurant manager" wins over
// "restaurant manager" and "head bartender" over "bartender".
interface TitleEntry { family: Family; title: string; re: RegExp; len: number; ambiguous: boolean }
let INDEX: TitleEntry[] | null = null;
function index(): TitleEntry[] {
  if (!INDEX) {
    INDEX = FAMILIES.flatMap(f => f.titles.map(t => ({ family: f, title: t, re: titleRe(t), len: norm(t).length, ambiguous: (f.ambiguous ?? []).includes(t) })))
      .sort((a, b) => b.len - a.len);
  }
  return INDEX;
}

/** Words that show a listing is about hospitality, for titles like "Server" or "Host". */
const HOSPITALITY = /(?<![\p{L}])(restaurants?|dining|dinner|lunch|breakfast|brunch|food|beverages?|drinks|cocktails?|wine|f&b|guests?|bar|cafe|coffee|hotels?|resorts?|kitchen|chef|menu|cuisine|catering|banquets?|hospitality|venues?|lounge|serveur|مطعم|فندق|ضيوف)(?![\p{L}])/u;
const HOSPITALITY_ALL = new RegExp(HOSPITALITY.source, "gu");

/** Words in a title that make "Server" or "Host" another job ("Server Engineer", "Podcast Host"). */
const NOT_HOSPITALITY = /(?<![\p{L}])(engineer|engineering|developer|software|devops|sre|sysadmin|administrator|architect|backend|frontend|database|sql|linux|windows|cloud|network|infrastructure|security|platform|api|web|it|data|game|gaming|minecraft|discord|proxy|dns|mail|email|podcast|radio|tv|television|show|stream|streaming|webinar|youtube|virtual)(?![\p{L}])/u;

/**
 * Whether an ambiguous title ("Server", "Host") is the hospitality job: never when the title
 * itself names another field; yes when the title names hospitality; otherwise when the listing
 * mentions hospitality in at least two different words (one "free food" perk is not enough).
 */
function hospitalityContext(title: string, context: string): boolean {
  if (NOT_HOSPITALITY.test(title)) return false;
  if (HOSPITALITY.test(title)) return true;
  const hits = new Set([...norm(context).matchAll(HOSPITALITY_ALL)].map(m => m[1].replace(/s$/, "")));
  return hits.size >= 2;
}

/** Spellings that mean the same thing ("F & B", "F and B" → "f&b"; "food & beverage" → "food and beverage"). */
export function cleanTitle(s: string): string {
  return norm(s)
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
 * other jobs: "Server" is a waiter only in a restaurant, not in a data centre.
 */
export function familiesOfTitle(title: string, context = ""): Family[] {
  const t = cleanTitle(title);
  if (!t) return [];
  const taken: [number, number][] = [];
  const out: Family[] = [];
  let hospitality: boolean | null = null;
  for (const e of index()) {
    const m = e.re.exec(t);
    if (!m) continue;
    const span: [number, number] = [m.index, m.index + m[0].length];
    if (taken.some(([a, b]) => span[0] < b && span[1] > a)) continue;
    if (e.ambiguous) {
      // A candidate who types just "Server" or "Host" as a target role means the hospitality job.
      hospitality ??= context === TARGET ? !NOT_HOSPITALITY.test(t) : hospitalityContext(t, context);
      if (!hospitality) continue;
    }
    taken.push(span);
    // "Marketing Manager - F&B" is a marketing job, "Manager - F&B Systems Design" a design job.
    if (!out.includes(e.family) && !namesOtherJob(e.family, t, span)) out.push(e.family);
  }
  return out;
}

/** The job a title names (its most specific one), or null. See familiesOfTitle. */
export function familyOfTitle(title: string, context = ""): Family | null {
  return familiesOfTitle(title, context)[0] ?? null;
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

// ── Plans ──

export interface RolePlan {
  /** As the candidate typed it. */
  input: string;
  /** What is searched for: the input, with likely typos fixed. */
  role: string;
  corrected: boolean;
  family: Family | null;
  /** Terms for keyword searches, most important first. */
  terms: string[];
  /** Families that count as this same job (only the role's own). */
  same: string[];
  /** Neighbouring families, offered as related titles. */
  related: string[];
}

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
  const terms = [role];
  if (family) {
    for (const t of family.search ?? [family.titles[0]]) if (!terms.includes(t)) terms.push(t);
    if (includeRelated) {
      for (const id of family.related ?? []) {
        const r = BY_ID.get(id);
        const t = r ? (r.search?.[0] ?? r.titles[0]) : null;
        if (t && !terms.includes(t)) terms.push(t);
      }
    }
  }
  return { input: typed, role, corrected, family, terms, same: family ? [family.id] : [], related: family?.related ?? [] };
}

export type TitleFit = "same" | "related" | "other" | "unknown";

/**
 * How a listing's title relates to a planned role:
 *   same     the same job (any way of writing it)
 *   related  a neighbouring job
 *   other    a different, known job (for example a chef listing for a bartender)
 *   unknown  the title isn't a job this file knows; judge it by its words instead
 */
export function titleFit(plan: RolePlan, title: string, context = ""): TitleFit {
  const own = plan.family;
  if (!own) return "unknown";
  const named = familiesOfTitle(title, context);
  if (!named.length) return "unknown";
  if (named.some(f => f.id === own.id)) return "same";
  if (named.some(f => plan.related.includes(f.id) || (f.related ?? []).includes(own.id))) return "related";
  return "other";
}

/**
 * For a listing whose title this file doesn't know ("Bar Associate", "Team Member – Lounge"):
 * whether its title or text names the planned job ("We're looking for an experienced bartender…").
 * Pass the start of the description: a job named deep in the text ("reporting to the restaurant
 * manager") says little. Titles that also name other jobs ("server") count only in a hospitality listing.
 */
export function mentionsJob(plan: RolePlan, title: string, text: string): boolean {
  const f = plan.family;
  if (!f) return false;
  // A title that names another profession is that profession, whatever its text mentions
  // ("HR Recruiter – Real Estate Agency", "Sales Executive – Specialty Coffee").
  const t = cleanTitle(title);
  if (namesOtherJob(f, t, [0, t.length])) return false;
  const hay = cleanTitle(`${title}\n${text}`);
  const ambiguous = new Set((f.ambiguous ?? []).map(cleanTitle));
  let hospitality: boolean | null = null;
  for (const t of new Set([plan.role, ...f.titles])) {
    if (!titleRe(t).test(hay)) continue;
    if (ambiguous.has(cleanTitle(t))) {
      hospitality ??= hospitalityContext(cleanTitle(title), text);
      if (!hospitality) continue;
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
 * (cashier is another job in the list, not a word of this one).
 */
function namesOtherJob(f: Family, t: string, span: [number, number]): boolean {
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

/** Display name of a family: its first title, capitalised ("F&B manager", "Bartender"). */
export function familyLabel(f: Family): string {
  const t = f.titles[0];
  return t.replace(/^(\p{L})/u, c => c.toUpperCase()).replace(/\bf&b\b/gi, "F&B").replace(/\bgm\b/g, "GM");
}
