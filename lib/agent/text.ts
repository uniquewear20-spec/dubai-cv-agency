// lib/agent/text.ts — text tools shared by the agent's browser code and its server routes:
// HTML to text, normalisation (accents, Arabic letter forms), a skills lexicon, language
// requirements, and the checks that keep drafts honest (quoted evidence, figures, skills).

// ── Normalising ──────────────────────────────────────────────────────────────

const ARABIC_MARKS = /[ً-ْٰـ]/g; // tashkeel, dagger alef, tatweel
const ARABIC_DIGITS = /[٠-٩۰-۹]/g;

/** Lower case, no accents, Arabic letter forms unified, digits in ASCII, one space between words. */
export function norm(s: string): string {
  return s
    .replace(ARABIC_DIGITS, d => String((d.charCodeAt(0) & 0xf) % 10))
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(ARABIC_MARKS, "")
    .replace(/[آأإٱ]/g, "ا") // آ أ إ ٱ → ا
    .replace(/ى/g, "ي")                     // ى → ي
    .replace(/ة/g, "ه")                     // ة → ه
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[‐-―−]/g, "-")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Letters and digits only, for comparisons that should ignore punctuation. */
export const bare = (s: string): string => norm(s).replace(/[^\p{L}\p{N}]+/gu, "");

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", hellip: "…",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", bull: "•", middot: "·", eacute: "é", egrave: "è",
  agrave: "à", ccedil: "ç", ecirc: "ê", ocirc: "ô", uuml: "ü", ouml: "ö", auml: "ä", szlig: "ß", euro: "€", pound: "£",
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : " ";
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

/** HTML to readable plain text: block elements become line breaks, list items get a bullet. */
export function htmlToText(html: string, max = 12000): string {
  const text = html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/(p|div|li|ul|ol|h[1-6]|tr|section|article|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(text)
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Regex for a phrase with letter/digit boundaries on both sides (works for "c++", ".net", Arabic). */
export function phraseRe(phrase: string, flags = "u"): RegExp {
  return new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(norm(phrase)).replace(/ /g, "[\\s\\-/]+")}(?![\\p{L}\\p{N}])`, flags);
}

export const hasPhrase = (normText: string, phrase: string): boolean => phraseRe(phrase).test(normText);

// ── Words ────────────────────────────────────────────────────────────────────

const STOP = new Set(`a an and are as at be by for from has have in into is it its of on or our that the their this to we will with you your
job role roles position team work working company experience years year plus new senior junior lead manager head
le la les un une des de du et en au aux pour par sur dans avec vous nous est sont ce cette ces qui que poste
der die das und mit für ein eine von zu im den
و في من على إلى عن مع أو ان`.split(/\s+/));

/** Meaningful words (lower case, no accents), stop words removed. */
export function words(s: string): string[] {
  return norm(s).split(/[^\p{L}\p{N}+#]+/u).filter(w => w.length > 1 && !STOP.has(w));
}

// ── Skills lexicon ───────────────────────────────────────────────────────────
// Canonical name first, then other ways people write it. An alias starting with "=" only
// matches with that exact capitalisation ("=AP" is accounts payable, "ap" in a word is not).
// Kept to concrete, checkable skills: soft skills ("communication") are left out because
// nearly every listing mentions them.

type SkillDef = [name: string, ...aliases: string[]];

const SKILLS: SkillDef[] = [
  // Finance and accounting
  ["IFRS"], ["US GAAP", "gaap"], ["Financial reporting", "reporting financier", "التقارير المالية"], ["Budgeting", "budget planning", "budgétisation", "الموازنة"],
  ["Forecasting", "prévisions"], ["FP&A", "financial planning and analysis", "financial planning & analysis"], ["Financial modelling", "financial modeling", "modélisation financière"],
  ["Consolidation", "group consolidation"], ["Internal audit", "audit interne", "التدقيق الداخلي"], ["External audit", "statutory audit", "commissariat aux comptes"], ["Audit"],
  ["VAT", "tva", "value added tax", "ضريبة القيمة المضافة"], ["Corporate tax", "impôt sur les sociétés"], ["Tax", "taxation", "fiscalité"], ["Treasury", "trésorerie", "الخزينة"],
  ["Cash flow management", "cash management", "gestion de trésorerie"], ["Cost accounting", "comptabilité analytique", "cost control"], ["Accounts payable", "=AP"], ["Accounts receivable", "=AR"],
  ["Payroll", "paie", "الرواتب"], ["Reconciliation", "reconciliations", "rapprochement"], ["Month-end close", "month end close", "monthly close", "clôture mensuelle", "year-end close"],
  ["SAP FICO", "sap fi/co", "sap fi co"], ["SAP"], ["Oracle Financials", "oracle fusion", "oracle ebs"], ["NetSuite"], ["QuickBooks"], ["Xero"], ["Microsoft Dynamics", "dynamics 365", "navision"],
  ["Excel", "microsoft excel", "ms excel", "advanced excel"], ["Power BI", "powerbi"], ["Tableau"], ["CPA"], ["ACCA"], ["CFA"], ["CMA"], ["CIMA"],
  ["Risk management", "gestion des risques", "إدارة المخاطر"], ["Compliance", "conformité", "الامتثال"], ["AML", "anti-money laundering", "lutte anti-blanchiment"], ["KYC", "know your customer"],
  ["M&A", "mergers and acquisitions", "fusions et acquisitions"], ["Due diligence"], ["Valuation", "valorisation", "business valuation"], ["Private equity"], ["Venture capital"],
  ["Wealth management", "gestion de patrimoine"], ["Credit analysis", "credit risk", "analyse crédit"], ["Underwriting"], ["Actuarial", "actuariat"], ["Investment banking", "banque d'investissement"],
  ["Islamic finance", "finance islamique", "التمويل الإسلامي"], ["Corporate finance", "finance d'entreprise"],
  // Technology
  ["Python"], ["Java"], ["JavaScript", "=JS"], ["TypeScript"], ["=React", "react.js", "reactjs", "react native"], ["Node.js", "nodejs", "node js"], ["Next.js", "nextjs"], ["Angular"], ["Vue.js", "vuejs"],
  ["SQL"], ["PostgreSQL", "postgres"], ["MySQL"], ["MongoDB"], ["Redis"], ["AWS", "amazon web services"], ["Azure", "microsoft azure"], ["Google Cloud", "gcp"],
  ["Docker"], ["Kubernetes", "k8s"], ["Terraform"], ["Linux"], ["Git", "github", "gitlab"], ["CI/CD", "continuous integration"], ["DevOps"],
  ["Machine learning", "apprentissage automatique", "التعلم الآلي"], ["Deep learning"], ["NLP", "natural language processing"], ["Generative AI", "genai", "llm", "llms", "large language models"],
  ["Data analysis", "data analytics", "analyse de données", "تحليل البيانات"], ["Data science"], ["Data engineering", "etl", "data pipelines"], ["Apache Spark", "pyspark"],
  ["C#"], [".NET", "dotnet", "asp.net"], ["C++"], ["Golang"], ["PHP"], ["Laravel"], ["Ruby on Rails", "ror"], ["=Swift", "swiftui"], ["Kotlin"], ["iOS"], ["Android"],
  ["REST APIs", "rest api", "restful"], ["GraphQL"], ["Microservices"], ["Cybersecurity", "cyber security", "information security", "cybersécurité", "الأمن السيبراني"],
  ["Penetration testing", "pentesting"], ["ISO 27001"], ["Network engineering", "ccna", "ccnp"], ["ServiceNow"], ["Salesforce"], ["ERP"], ["CRM"],
  ["Agile"], ["Scrum"], ["Jira"], ["Product management", "gestion de produit"], ["UX design", "user experience", "ux research"], ["UI design", "user interface design"], ["Figma"],
  ["QA testing", "quality assurance testing", "software testing"], ["Test automation", "selenium", "cypress"], ["Power Automate"], ["SharePoint"],
  // Management and operations
  ["Project management", "gestion de projet", "إدارة المشاريع"], ["PMP"], ["PRINCE2"], ["Programme management", "program management"], ["Stakeholder management"],
  ["Strategic planning", "corporate strategy", "planification stratégique", "التخطيط الاستراتيجي"], ["Business development", "développement commercial", "تطوير الأعمال"], ["Sales", "ventes", "المبيعات"],
  ["Account management", "key account management", "gestion de comptes"], ["B2B"], ["B2C"], ["Negotiation", "négociation"], ["P&L management", "p&l", "profit and loss"],
  ["Operations management", "gestion des opérations"], ["Supply chain", "chaîne d'approvisionnement", "سلسلة الإمداد"], ["Logistics", "logistique", "اللوجستيات"],
  ["Procurement", "purchasing", "achats", "المشتريات"], ["Inventory management", "gestion des stocks"], ["Lean management", "lean manufacturing", "lean methodology"], ["Six Sigma"],
  ["Change management", "conduite du changement"], ["Team management", "people management", "management d'équipe", "إدارة الفرق"],
  // Marketing and communications
  ["Digital marketing", "marketing digital", "التسويق الرقمي"], ["SEO", "search engine optimisation", "search engine optimization", "référencement"], ["SEM", "paid search", "ppc"],
  ["Google Ads", "adwords"], ["Social media marketing", "social media", "réseaux sociaux"], ["Content marketing"], ["Copywriting", "rédaction"], ["Branding", "brand management"],
  ["Market research", "étude de marché"], ["HubSpot"], ["Email marketing"], ["Google Analytics", "ga4"], ["Public relations", "=PR", "relations presse"], ["Event management", "événementiel"],
  // People
  ["Recruitment", "talent acquisition", "recrutement", "التوظيف"], ["Onboarding"], ["HR business partner", "hrbp"], ["Employee relations"], ["Compensation and benefits", "c&b", "rémunération"],
  ["Learning and development", "l&d", "training and development"], ["Performance management"], ["HRIS"], ["Workday"], ["SuccessFactors"], ["UAE labour law", "uae labor law"], ["Emiratisation", "emiratization"],
  // Healthcare
  ["Nursing", "registered nurse", "soins infirmiers", "التمريض"], ["Patient care", "soins aux patients"], ["Clinical research", "recherche clinique"], ["Pharmacy", "pharmacist", "pharmacie"],
  ["DHA licence", "dha license", "dha"], ["DOH licence", "doh license", "haad"], ["MOH licence", "moh license", "mohap"], ["BLS"], ["ACLS"], ["ICU", "intensive care"], ["Emergency medicine"],
  ["Medical coding"], ["Infection control"], ["JCI accreditation", "jci"], ["Healthcare management"],
  // Engineering and construction
  ["AutoCAD"], ["Revit"], ["BIM"], ["Civil engineering", "génie civil"], ["Structural engineering"], ["MEP"], ["HVAC"], ["Electrical engineering"], ["Mechanical engineering"],
  ["Primavera P6", "primavera"], ["Project controls"], ["Quantity surveying", "quantity surveyor"], ["Cost estimation"], ["HSE", "health and safety", "qhse"], ["NEBOSH"],
  ["Oil and gas", "oil & gas", "pétrole et gaz", "النفط والغاز"], ["QA/QC"], ["Commissioning"], ["Facilities management", "facility management"],
  // Hospitality, retail, travel
  ["Hospitality", "hôtellerie", "الضيافة"], ["Hotel management"], ["Food and beverage", "f&b"], ["Guest relations"], ["Front office"], ["Revenue management"], ["Opera PMS", "=Opera"],
  ["Customer service", "service client", "خدمة العملاء"], ["Retail management"], ["Visual merchandising"], ["Luxury retail"], ["Tourism", "tourisme"],
  // Legal
  ["Contract drafting", "contract management", "rédaction de contrats"], ["Corporate law", "droit des sociétés"], ["Litigation", "contentieux"], ["Arbitration", "arbitrage"],
  ["Intellectual property", "propriété intellectuelle"], ["Employment law", "droit du travail"], ["DIFC"], ["Legal research"],
  // Education
  ["Teaching", "enseignement", "التدريس"], ["Curriculum development"], ["IB curriculum", "international baccalaureate"], ["IGCSE"], ["British curriculum"], ["Instructional design"], ["E-learning"],
  // Trade and logistics
  ["Freight forwarding"], ["Customs clearance", "dédouanement"], ["Warehouse management", "wms"], ["Fleet management"], ["Import/export", "import export"], ["Incoterms"],
];

/** "Excel" the software, not "excel at…". */
const EXCEL_RE = /(?<![\p{L}\p{N}])excel(?![\p{L}\p{N}])(?!\s+(?:at|in|under|as|when|with)\b)/u;

interface CompiledSkill { name: string; test: (normText: string, original: string) => boolean }
let compiled: CompiledSkill[] | null = null;
function skillsCompiled(): CompiledSkill[] {
  if (!compiled) {
    compiled = SKILLS.map(def => {
      const name = def[0].replace(/^=/, "");
      const tests = def.map(alias => {
        if (alias === "Excel") return (n: string) => EXCEL_RE.test(n);
        if (alias.startsWith("=")) {
          const re = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(alias.slice(1))}(?![\\p{L}\\p{N}])`, "u");
          return (_n: string, original: string) => re.test(original);
        }
        const re = phraseRe(alias);
        return (n: string) => re.test(n);
      });
      return { name, test: (n, o) => tests.some(t => t(n, o)) };
    });
  }
  return compiled;
}

/** Canonical skills found in a text. */
export function extractSkills(text: string): string[] {
  const n = norm(text);
  const found = skillsCompiled().filter(s => s.test(n, text)).map(s => s.name);
  // A specific skill makes its general parent redundant.
  const drop = new Set<string>();
  if (found.includes("SAP FICO")) drop.add("SAP");
  if (found.includes("Internal audit") || found.includes("External audit")) drop.add("Audit");
  if (found.includes("Corporate tax") || found.includes("VAT")) drop.add("Tax");
  return found.filter(s => !drop.has(s));
}

const matchers = new Map<string, (normText: string, original: string) => boolean>();

/** A test for one skill (a canonical name, or anything the user typed), compiled once. */
export function skillMatcher(skill: string): (normText: string, original: string) => boolean {
  const key = norm(skill);
  let m = matchers.get(key);
  if (!m) {
    const s = skillsCompiled().find(x => norm(x.name) === key);
    const re = phraseRe(skill);
    m = s ? s.test : (n: string) => re.test(n);
    matchers.set(key, m);
  }
  return m;
}

/** True when a skill (a canonical name, or anything the user typed) appears in a text. */
export function mentions(text: string, skill: string): boolean {
  return skillMatcher(skill)(norm(text), text);
}

// ── Languages ────────────────────────────────────────────────────────────────

export const LANGUAGES: { name: string; names: string[] }[] = [
  { name: "English", names: ["english", "anglais", "englisch", "inglés", "الإنجليزية", "الانجليزية", "الإنكليزية"] },
  { name: "Arabic", names: ["arabic", "arabe", "arabisch", "árabe", "العربية", "عربي"] },
  { name: "French", names: ["french", "français", "francais", "französisch", "francés", "الفرنسية"] },
  { name: "German", names: ["german", "allemand", "deutsch", "alemán", "الألمانية"] },
  { name: "Spanish", names: ["spanish", "espagnol", "español", "spanisch", "الإسبانية"] },
  { name: "Italian", names: ["italian", "italien", "italiano", "italienisch", "الإيطالية"] },
  { name: "Portuguese", names: ["portuguese", "portugais", "português", "portugiesisch", "البرتغالية"] },
  { name: "Dutch", names: ["dutch", "néerlandais", "nederlands", "niederländisch", "الهولندية"] },
  { name: "Russian", names: ["russian", "russe", "russisch", "الروسية"] },
  { name: "Mandarin", names: ["mandarin", "chinese", "chinois", "chinesisch", "الصينية"] },
  { name: "Hindi", names: ["hindi", "الهندية"] },
  { name: "Urdu", names: ["urdu", "ourdou", "الأردية"] },
  { name: "Tagalog", names: ["tagalog", "filipino"] },
  { name: "Turkish", names: ["turkish", "turc", "türkisch", "التركية"] },
  { name: "Persian", names: ["persian", "farsi", "persan", "الفارسية"] },
  { name: "Japanese", names: ["japanese", "japonais", "japanisch", "اليابانية"] },
  { name: "Korean", names: ["korean", "coréen", "koreanisch", "الكورية"] },
  { name: "Polish", names: ["polish", "polonais", "polnisch"] },
  { name: "Swedish", names: ["swedish", "suédois", "schwedisch"] },
];

const LEVEL = "(?:fluent|fluency|native|proficien\\w*|business[- ]level|professional[- ]level|excellent|strong|good|working|written and (?:spoken|verbal)|spoken and written|courant|maîtrise|maitrise|bilingue|parfaite|إجادة|اجادة|طلاقة|verhandlungssicher|fließend|fliessend|sehr gute)";

/** Languages a listing asks for (fluent, required, -speaking…), plus the listing's own language. */
export function requiredLanguages(text: string): string[] {
  const n = norm(text);
  const out = new Set<string>();
  for (const l of LANGUAGES) {
    for (const raw of l.names) {
      const name = escapeRe(norm(raw));
      const b = "(?<![\\p{L}\\p{N}])", e = "(?![\\p{L}\\p{N}])";
      const patterns = [
        `${LEVEL}[^.\\n]{0,40}${b}${name}${e}`,
        `${b}${name}${e}[^.\\n]{0,25}(?:required|mandatory|essential|a must|is a must|must|speaking|speaker|native|fluent|obligatoire|exigé|courant|requis|erforderlich|زامي|مطلوب)`,
        `${b}${name}${e}[- ](?:speaking|speaker)`,
        `(?:langue|language)s?\\s*:?[^.\\n]{0,30}${b}${name}${e}`,
      ];
      if (patterns.some(p => new RegExp(p, "u").test(n))) { out.add(l.name); break; }
    }
  }
  const own = writtenIn(text);
  if (own && own !== "English") out.add(own);
  return [...out];
}

const LANG_HINTS: [string, string[]][] = [
  ["German", ["und", "wir", "sie", "mit", "für", "die", "der", "das", "eine", "ihre", "werden", "sind"]],
  ["French", ["et", "nous", "vous", "avec", "pour", "les", "des", "une", "dans", "votre", "sont", "être"]],
  ["Spanish", ["y", "nosotros", "con", "para", "los", "las", "una", "en", "tu", "somos", "estar"]],
  ["English", ["and", "we", "you", "with", "for", "the", "our", "your", "are", "will", "this"]],
];

/** The language a text is written in (by common words), or null if unclear. */
export function writtenIn(text: string): string | null {
  if (/[؀-ۿ]/.test(text) && (text.match(/[؀-ۿ]/g)?.length ?? 0) > text.length * 0.3) return "Arabic";
  const toks = norm(text).split(/[^\p{L}]+/u).slice(0, 400);
  if (toks.length < 20) return null;
  let best: string | null = null, bestN = 0;
  for (const [lang, hints] of LANG_HINTS) {
    const set = new Set(hints);
    const n = toks.filter(t => set.has(t)).length;
    if (n > bestN) { best = lang; bestN = n; }
  }
  return bestN >= 8 ? best : null;
}

/** Canonical language names found in free text the user typed ("anglais, Arabic"). */
export function parseLanguages(text: string): string[] {
  const n = norm(text);
  return LANGUAGES.filter(l => l.names.some(x => hasPhrase(n, x)) || hasPhrase(n, l.name)).map(l => l.name);
}

// ── Contacts in listings ─────────────────────────────────────────────────────

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,24}/gi;

/** The application address published in a listing: one that sits near "apply/send/CV". */
export function findApplyEmail(text: string): string | null {
  const all = [...text.matchAll(EMAIL_RE)];
  for (const m of all) {
    const around = text.slice(Math.max(0, (m.index ?? 0) - 120), (m.index ?? 0) + 40).toLowerCase();
    if (/(apply|send|submit|email|e-mail|cv|resume|résumé|candidature|postuler|envoy|أرسل|السيرة)/.test(around)) {
      const addr = m[0].replace(/[.,;:]+$/, "");
      if (!/(noreply|no-reply|example\.|privacy|gdpr|dpo@|unsubscribe)/i.test(addr)) return addr;
    }
  }
  return null;
}

/** CV text without email addresses and phone numbers: the AI doesn't need them to write a draft. */
export function redactContacts(text: string): string {
  return text
    .replace(EMAIL_RE, "[email]")
    .replace(/(?:\+|00|\()[\d\s().-]{7,}\d|\b\d[\d\s.-]{8,}\d\b/g, m => {
      if (m.replace(/\D/g, "").length < 9) return m;
      if ((m.match(/\d+/g) ?? []).every(g => /^(19|20)\d\d$/.test(g))) return m; // year ranges, not phones
      return "[phone]";
    });
}

// ── Honesty checks for drafts ────────────────────────────────────────────────

/** True when a quoted CV sentence really is in the CV (punctuation and case ignored). */
export function quotedFrom(evidence: string, cvText: string): boolean {
  const e = norm(evidence).replace(/^[•\-–*·\s]+/, "");
  if (e.length < 12) return false;
  const c = norm(cvText);
  if (c.includes(e)) return true;
  const eb = bare(evidence);
  return eb.length >= 10 && bare(cvText).includes(eb);
}

/** Figures in a generated text that appear in neither the CV nor the listing. */
export function unsupportedFigures(generated: string, ...sources: string[]): string[] {
  const groups = (s: string) => new Set(norm(s).match(/\d+/g) ?? []);
  const known = new Set<string>();
  for (const s of sources) for (const g of groups(s)) known.add(g);
  const out = new Set<string>();
  for (const m of norm(generated).matchAll(/\d+(?:[.,]\d+)*\s?(?:%|k|m|bn|million|billion|years?|ans|mois|months?)?/g)) {
    const parts = m[0].match(/\d+/g) ?? [];
    if (parts.some(p => !known.has(p))) out.add(m[0].trim());
  }
  return [...out].slice(0, 12);
}

/** Skills named in a generated text that the CV never mentions. */
export function unsupportedSkills(generated: string, cvText: string): string[] {
  return extractSkills(generated).filter(s => !mentions(cvText, s));
}

const YEAR_RANGE = /(19|20)\d\d\s*[-–—]\s*((19|20)\d\d|present|current|now|today|aujourd'hui|actuel|الآن|حتى الآن)/i;

/** CV lines worth quoting: achievements and sentences, not headings, job-title lines or skill lists. */
export function cvLines(cvText: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of cvText.split(/\n|(?<=[.!?])\s+(?=[A-Z؀-ۿ])/)) {
    const line = raw.replace(/^[\s•\-–*·▪●■◦]+/, "").replace(/\s+/g, " ").trim();
    if (line.length < 25 || line.length > 400) continue;
    if (/^(?:\+?\d[\d\s()-]{6,}|[\w.+-]+@[\w.-]+)$/.test(line)) continue;
    if (/@/.test(line) || /\+?\d[\d\s()-]{8,}\d/.test(line) && line.includes("|")) continue; // contact lines
    const parts = line.split(/[,;|·]/);
    if (parts.length >= 4 && parts.every(p => p.trim().split(" ").length <= 4)) continue; // skill or keyword lists
    if (YEAR_RANGE.test(line) && line.split(" ").length <= 14) continue; // job title and dates
    const key = bare(line);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out;
}
