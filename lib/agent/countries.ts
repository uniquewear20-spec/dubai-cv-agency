// lib/agent/countries.ts — countries the agent understands, with their names in English, French
// and Arabic, main cities, and the codes each job source expects. Shared by browser and server.

import { norm, phraseRe } from "./text";

export type Region = "GCC" | "MENA" | "EMEA" | "Europe" | "APAC" | "Americas" | "North America" | "LATAM" | "Africa";

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  en: string;
  fr: string;
  ar: string;
  /** Other names and main cities, as people write them in listings. */
  aliases: string[];
  regions: Region[];
  /** Jobicy location slug, when Jobicy has one. */
  jobicy?: string;
  /** Adzuna country code, when Adzuna covers the country. */
  adzuna?: string;
}

const ME: Region[] = ["GCC", "MENA", "EMEA"];
const EU: Region[] = ["Europe", "EMEA"];
const NA: Region[] = ["Americas", "North America"];
const LA: Region[] = ["Americas", "LATAM"];
const AF: Region[] = ["Africa", "EMEA"];
const MAGHREB: Region[] = ["MENA", "Africa", "EMEA"];

export const COUNTRIES: Country[] = [
  { code: "AE", en: "United Arab Emirates", fr: "Émirats arabes unis", ar: "الإمارات العربية المتحدة", aliases: ["UAE", "U.A.E.", "Emirates", "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Al Ain", "Dubaï", "الإمارات", "دبي", "أبوظبي", "أبو ظبي", "الشارقة"], regions: ME, jobicy: "united-arab-emirates" },
  { code: "SA", en: "Saudi Arabia", fr: "Arabie saoudite", ar: "السعودية", aliases: ["KSA", "Kingdom of Saudi Arabia", "Riyadh", "Jeddah", "Dammam", "Khobar", "Al Khobar", "NEOM", "Mecca", "Medina", "Riyad", "المملكة العربية السعودية", "الرياض", "جدة", "الدمام"], regions: ME },
  { code: "QA", en: "Qatar", fr: "Qatar", ar: "قطر", aliases: ["Doha", "الدوحة"], regions: ME },
  { code: "KW", en: "Kuwait", fr: "Koweït", ar: "الكويت", aliases: ["Kuwait City"], regions: ME },
  { code: "BH", en: "Bahrain", fr: "Bahreïn", ar: "البحرين", aliases: ["Manama", "المنامة"], regions: ME },
  { code: "OM", en: "Oman", fr: "Oman", ar: "عُمان", aliases: ["Muscat", "مسقط", "عمان"], regions: ME },
  { code: "EG", en: "Egypt", fr: "Égypte", ar: "مصر", aliases: ["Cairo", "Le Caire", "Alexandria", "القاهرة"], regions: ["MENA", "Africa", "EMEA"] },
  { code: "JO", en: "Jordan", fr: "Jordanie", ar: "الأردن", aliases: ["Amman"], regions: ["MENA", "EMEA"] },
  { code: "LB", en: "Lebanon", fr: "Liban", ar: "لبنان", aliases: ["Beirut", "Beyrouth", "بيروت"], regions: ["MENA", "EMEA"] },
  { code: "MA", en: "Morocco", fr: "Maroc", ar: "المغرب", aliases: ["Casablanca", "Rabat", "Marrakech", "Marrakesh", "Tangier", "Tanger", "Fès", "Fez", "Agadir", "الدار البيضاء", "الرباط"], regions: MAGHREB },
  { code: "TN", en: "Tunisia", fr: "Tunisie", ar: "تونس", aliases: ["Tunis", "Sfax"], regions: MAGHREB },
  { code: "DZ", en: "Algeria", fr: "Algérie", ar: "الجزائر", aliases: ["Algiers", "Alger", "Oran"], regions: MAGHREB },
  { code: "TR", en: "Türkiye", fr: "Turquie", ar: "تركيا", aliases: ["Turkey", "Turkiye", "Istanbul", "Ankara"], regions: ["Europe", "EMEA", "MENA"], jobicy: "turkiye" },
  { code: "GB", en: "United Kingdom", fr: "Royaume-Uni", ar: "المملكة المتحدة", aliases: ["UK", "U.K.", "Great Britain", "England", "Scotland", "Wales", "London", "Londres", "Manchester", "Birmingham", "Edinburgh", "لندن", "بريطانيا"], regions: EU, jobicy: "uk", adzuna: "gb" },
  { code: "IE", en: "Ireland", fr: "Irlande", ar: "أيرلندا", aliases: ["Dublin"], regions: EU, jobicy: "ireland" },
  { code: "FR", en: "France", fr: "France", ar: "فرنسا", aliases: ["Paris", "Lyon", "Marseille", "Toulouse", "Lille", "Bordeaux", "Nantes", "Île-de-France", "باريس"], regions: EU, jobicy: "france", adzuna: "fr" },
  { code: "DE", en: "Germany", fr: "Allemagne", ar: "ألمانيا", aliases: ["Deutschland", "Berlin", "Munich", "München", "Hamburg", "Frankfurt", "Cologne", "Köln", "Düsseldorf", "Stuttgart"], regions: EU, jobicy: "germany", adzuna: "de" },
  { code: "NL", en: "Netherlands", fr: "Pays-Bas", ar: "هولندا", aliases: ["Holland", "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"], regions: EU, jobicy: "netherlands", adzuna: "nl" },
  { code: "BE", en: "Belgium", fr: "Belgique", ar: "بلجيكا", aliases: ["Brussels", "Bruxelles", "Antwerp", "Anvers", "Ghent"], regions: EU, jobicy: "belgium", adzuna: "be" },
  { code: "LU", en: "Luxembourg", fr: "Luxembourg", ar: "لوكسمبورغ", aliases: [], regions: EU },
  { code: "CH", en: "Switzerland", fr: "Suisse", ar: "سويسرا", aliases: ["Zurich", "Zürich", "Geneva", "Genève", "Basel", "Bâle", "Lausanne", "Bern"], regions: EU, jobicy: "switzerland", adzuna: "ch" },
  { code: "AT", en: "Austria", fr: "Autriche", ar: "النمسا", aliases: ["Vienna", "Wien", "Vienne", "Graz", "Salzburg"], regions: EU, jobicy: "austria", adzuna: "at" },
  { code: "ES", en: "Spain", fr: "Espagne", ar: "إسبانيا", aliases: ["Madrid", "Barcelona", "Barcelone", "Valencia", "Seville"], regions: EU, jobicy: "spain", adzuna: "es" },
  { code: "PT", en: "Portugal", fr: "Portugal", ar: "البرتغال", aliases: ["Lisbon", "Lisbonne", "Porto"], regions: EU, jobicy: "portugal" },
  { code: "IT", en: "Italy", fr: "Italie", ar: "إيطاليا", aliases: ["Milan", "Milano", "Rome", "Roma", "Turin", "Torino"], regions: EU, jobicy: "italy", adzuna: "it" },
  { code: "SE", en: "Sweden", fr: "Suède", ar: "السويد", aliases: ["Stockholm", "Gothenburg"], regions: EU, jobicy: "sweden" },
  { code: "NO", en: "Norway", fr: "Norvège", ar: "النرويج", aliases: ["Oslo"], regions: EU, jobicy: "norway" },
  { code: "DK", en: "Denmark", fr: "Danemark", ar: "الدنمارك", aliases: ["Copenhagen", "Copenhague"], regions: EU, jobicy: "denmark" },
  { code: "FI", en: "Finland", fr: "Finlande", ar: "فنلندا", aliases: ["Helsinki"], regions: EU, jobicy: "finland" },
  { code: "PL", en: "Poland", fr: "Pologne", ar: "بولندا", aliases: ["Warsaw", "Varsovie", "Krakow", "Kraków", "Wroclaw"], regions: EU, jobicy: "poland", adzuna: "pl" },
  { code: "CZ", en: "Czechia", fr: "Tchéquie", ar: "التشيك", aliases: ["Czech Republic", "Prague", "Brno"], regions: EU, jobicy: "czechia" },
  { code: "RO", en: "Romania", fr: "Roumanie", ar: "رومانيا", aliases: ["Bucharest", "Bucarest", "Cluj"], regions: EU, jobicy: "romania" },
  { code: "GR", en: "Greece", fr: "Grèce", ar: "اليونان", aliases: ["Athens", "Athènes"], regions: EU, jobicy: "greece" },
  { code: "CY", en: "Cyprus", fr: "Chypre", ar: "قبرص", aliases: ["Limassol", "Nicosia"], regions: EU, jobicy: "cyprus" },
  { code: "HU", en: "Hungary", fr: "Hongrie", ar: "المجر", aliases: ["Budapest"], regions: EU, jobicy: "hungary" },
  { code: "BG", en: "Bulgaria", fr: "Bulgarie", ar: "بلغاريا", aliases: ["Sofia"], regions: EU, jobicy: "bulgaria" },
  { code: "US", en: "United States", fr: "États-Unis", ar: "الولايات المتحدة", aliases: ["USA", "U.S.", "US", "United States of America", "New York", "San Francisco", "Los Angeles", "Chicago", "Boston", "Seattle", "Austin", "Miami", "Washington, DC"], regions: NA, jobicy: "usa", adzuna: "us" },
  { code: "CA", en: "Canada", fr: "Canada", ar: "كندا", aliases: ["Toronto", "Montreal", "Montréal", "Vancouver", "Calgary", "Ottawa"], regions: NA, jobicy: "canada", adzuna: "ca" },
  { code: "MX", en: "Mexico", fr: "Mexique", ar: "المكسيك", aliases: ["Mexico City", "Guadalajara", "Monterrey"], regions: LA, jobicy: "mexico", adzuna: "mx" },
  { code: "BR", en: "Brazil", fr: "Brésil", ar: "البرازيل", aliases: ["Brasil", "São Paulo", "Rio de Janeiro"], regions: LA, jobicy: "brazil", adzuna: "br" },
  { code: "IN", en: "India", fr: "Inde", ar: "الهند", aliases: ["Mumbai", "Bangalore", "Bengaluru", "Delhi", "New Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata"], regions: ["APAC"], adzuna: "in" },
  { code: "PK", en: "Pakistan", fr: "Pakistan", ar: "باكستان", aliases: ["Karachi", "Lahore", "Islamabad"], regions: ["APAC"] },
  { code: "SG", en: "Singapore", fr: "Singapour", ar: "سنغافورة", aliases: [], regions: ["APAC"], jobicy: "singapore", adzuna: "sg" },
  { code: "MY", en: "Malaysia", fr: "Malaisie", ar: "ماليزيا", aliases: ["Kuala Lumpur"], regions: ["APAC"], jobicy: "malaysia" },
  { code: "PH", en: "Philippines", fr: "Philippines", ar: "الفلبين", aliases: ["Manila", "Cebu"], regions: ["APAC"], jobicy: "philippines" },
  { code: "HK", en: "Hong Kong", fr: "Hong Kong", ar: "هونغ كونغ", aliases: [], regions: ["APAC"], jobicy: "hong-kong" },
  { code: "JP", en: "Japan", fr: "Japon", ar: "اليابان", aliases: ["Tokyo", "Osaka"], regions: ["APAC"], jobicy: "japan" },
  { code: "AU", en: "Australia", fr: "Australie", ar: "أستراليا", aliases: ["Sydney", "Melbourne", "Brisbane", "Perth"], regions: ["APAC"], jobicy: "australia", adzuna: "au" },
  { code: "NZ", en: "New Zealand", fr: "Nouvelle-Zélande", ar: "نيوزيلندا", aliases: ["Auckland", "Wellington"], regions: ["APAC"], jobicy: "new-zealand", adzuna: "nz" },
  { code: "ZA", en: "South Africa", fr: "Afrique du Sud", ar: "جنوب أفريقيا", aliases: ["Johannesburg", "Cape Town", "Durban"], regions: AF, adzuna: "za" },
  { code: "NG", en: "Nigeria", fr: "Nigeria", ar: "نيجيريا", aliases: ["Lagos", "Abuja"], regions: AF },
  { code: "KE", en: "Kenya", fr: "Kenya", ar: "كينيا", aliases: ["Nairobi"], regions: AF },
  { code: "SN", en: "Senegal", fr: "Sénégal", ar: "السنغال", aliases: ["Dakar"], regions: AF },
  { code: "CI", en: "Côte d'Ivoire", fr: "Côte d'Ivoire", ar: "ساحل العاج", aliases: ["Ivory Coast", "Abidjan"], regions: AF },
];

export const countryByCode = (code: string): Country | undefined => COUNTRIES.find(c => c.code === code.toUpperCase());

export function countryName(code: string, lang: "en" | "fr" | "ar"): string {
  const c = countryByCode(code);
  return c ? c[lang] : code;
}

let nameRes: { code: string; re: RegExp }[] | null = null;
function nameIndex() {
  if (!nameRes) {
    nameRes = [];
    for (const c of COUNTRIES) {
      for (const n of new Set([c.en, c.fr, c.ar, ...c.aliases])) {
        // Two-letter aliases ("US", "UK") only in capitals, so "us" the word doesn't match.
        if (/^[A-Z.]{2,4}$/.test(n)) nameRes.push({ code: c.code, re: new RegExp(`(?<![A-Za-z])${n.replace(/\./g, "\\.")}(?![A-Za-z])`) });
        else nameRes.push({ code: c.code, re: phraseRe(n) });
      }
    }
  }
  return nameRes;
}

/** Country codes named in a place text ("Dubai, UAE" → ["AE"]). Two-letter aliases need capitals. */
export function countriesIn(text: string): string[] {
  const n = norm(text);
  const out = new Set<string>();
  for (const { code, re } of nameIndex()) {
    if (re.flags.includes("u") ? re.test(n) : re.test(text)) out.add(code);
  }
  return [...out];
}

/** The country a user means by what they typed: a name in any of the three languages, a city or a code. */
export function parseCountry(input: string): string | null {
  const t = input.trim();
  if (!t) return null;
  if (/^[A-Za-z]{2}$/.test(t) && countryByCode(t)) return t.toUpperCase();
  const n = norm(t);
  const exact = COUNTRIES.find(c => [c.en, c.fr, c.ar, ...c.aliases].some(x => norm(x) === n));
  if (exact) return exact.code;
  const found = countriesIn(t);
  return found.length === 1 ? found[0] : null;
}

const WORLDWIDE_RE = /(?<![\p{L}])(worldwide|anywhere|global|globally|any location|international|monde entier|partout|n'importe où|عن بعد من أي مكان)(?![\p{L}])/u;
const REGION_WORDS: [RegExp, Region][] = [
  [/(?<![\p{L}])(emea)(?![\p{L}])/u, "EMEA"],
  [/(?<![\p{L}])(europe|european union|eu|eea|europa)(?![\p{L}])/u, "Europe"],
  [/(?<![\p{L}])(mena|middle east|moyen-orient|الشرق الأوسط)(?![\p{L}])/u, "MENA"],
  [/(?<![\p{L}])(gcc|gulf|golfe|الخليج)(?![\p{L}])/u, "GCC"],
  [/(?<![\p{L}])(apac|asia pacific|asia-pacific|asia)(?![\p{L}])/u, "APAC"],
  [/(?<![\p{L}])(latam|latin america|south america|amérique latine)(?![\p{L}])/u, "LATAM"],
  [/(?<![\p{L}])(north america|northern america|amérique du nord)(?![\p{L}])/u, "North America"],
  [/(?<![\p{L}])(americas)(?![\p{L}])/u, "Americas"],
  [/(?<![\p{L}])(africa|afrique)(?![\p{L}])/u, "Africa"],
];

export interface PlaceFit {
  /** The listing is open to (or located in) one of the wanted countries. */
  match: boolean;
  /** Which wanted country or region made it match. */
  via: string | null;
  worldwide: boolean;
  /** Countries the listing names, when none of them is wanted. */
  elsewhere: string[];
}

/** Does a listing's location fit the countries a candidate wants? */
export function placeFit(location: string, remote: boolean, wanted: string[]): PlaceFit {
  const n = norm(location);
  const named = countriesIn(location);
  if (!wanted.length) return { match: true, via: null, worldwide: remote && (!n || WORLDWIDE_RE.test(n)), elsewhere: [] };
  const direct = named.find(c => wanted.includes(c));
  if (direct) return { match: true, via: direct, worldwide: false, elsewhere: [] };
  if (remote && (!n || WORLDWIDE_RE.test(n))) return { match: true, via: "worldwide", worldwide: true, elsewhere: [] };
  if (remote) {
    for (const [re, region] of REGION_WORDS) {
      if (!re.test(n)) continue;
      const hit = wanted.find(code => countryByCode(code)?.regions.includes(region));
      if (hit) return { match: true, via: region, worldwide: false, elsewhere: [] };
    }
  }
  return { match: false, via: null, worldwide: false, elsewhere: named };
}

export type PlaceVerdict = "fits" | "elsewhere" | "unclear";

/**
 * Whether a listing is open to the wanted countries: "elsewhere" when it names only other countries
 * or a region that doesn't include them (a remote job for "USA only" or "Europe" on a UAE search),
 * "unclear" when its location says nothing usable (kept: it may well fit).
 */
export function placeVerdict(location: string, remote: boolean, wanted: string[]): PlaceVerdict {
  if (!wanted.length) return "fits";
  const fit = placeFit(location, remote, wanted);
  if (fit.match) return "fits";
  if (fit.elsewhere.length) return "elsewhere";
  const n = norm(location);
  if (REGION_WORDS.some(([re]) => re.test(n))) return "elsewhere";
  return "unclear";
}

/** Other spellings of the main cities, as listings write them. */
const CITY_ALIASES: string[][] = [
  ["dubai", "dubaï", "دبي"], ["abu dhabi", "abudhabi", "abou dabi", "أبوظبي", "أبو ظبي"], ["sharjah", "charjah", "الشارقة"], ["ajman", "عجمان"],
  ["ras al khaimah", "rak", "رأس الخيمة"], ["al ain", "العين"], ["fujairah", "الفجيرة"], ["riyadh", "riyad", "الرياض"], ["jeddah", "jiddah", "djeddah", "جدة"],
  ["dammam", "الدمام"], ["khobar", "al khobar", "الخبر"], ["doha", "الدوحة"], ["kuwait city", "kuwait", "الكويت"], ["manama", "المنامة"], ["muscat", "mascate", "مسقط"],
  ["cairo", "le caire", "القاهرة"], ["alexandria", "alexandrie", "الإسكندرية"], ["casablanca", "casa", "الدار البيضاء"], ["rabat", "الرباط"],
  ["marrakech", "marrakesh", "مراكش"], ["tangier", "tanger", "طنجة"], ["agadir", "أكادير"], ["fes", "fez", "فاس"], ["tunis", "تونس"], ["algiers", "alger", "الجزائر"],
  ["paris", "باريس"], ["london", "londres", "لندن"], ["istanbul", "إسطنبول"], ["beirut", "beyrouth", "بيروت"], ["amman", "عمان"], ["geneva", "genève", "geneve", "genf"],
  ["zurich", "zürich"], ["munich", "münchen"], ["cologne", "köln"], ["brussels", "bruxelles", "brussel"], ["new york", "nyc", "new york city"],
];

/**
 * Whether a listing is in the wanted city: "fits" when its location names the city, "elsewhere"
 * when it names another place first ("Sharjah, United Arab Emirates" for Dubai), "unclear" when it
 * names only a country or nothing.
 */
export function cityVerdict(location: string, city: string): PlaceVerdict {
  const c = norm(city);
  if (!c) return "fits";
  const names = CITY_ALIASES.find(a => a.some(x => norm(x) === c)) ?? [city];
  const n = norm(location);
  if (names.some(x => phraseRe(x).test(n))) return "fits";
  const first = norm(location.split(/[,(|/]/)[0] ?? "").trim();
  if (!first || /^(remote|hybrid|on-?site|anywhere|worldwide)$/.test(first)) return "unclear";
  const country = COUNTRIES.find(k => [k.en, k.fr, k.ar, ...k.aliases.filter(a => a.length > 3)].some(x => norm(x) === first));
  if (country && [country.en, country.fr, country.ar].some(x => norm(x) === first)) return "unclear";
  return "elsewhere";
}

/** French-speaking and German-speaking markets, for searching job titles in those languages. */
export const FRENCH_MARKETS = new Set(["FR", "BE", "CH", "LU", "MA", "TN", "DZ", "SN", "CI", "LB", "CA"]);
export const GERMAN_MARKETS = new Set(["DE", "AT", "CH"]);
