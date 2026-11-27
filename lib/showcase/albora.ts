// ALBORA: a fictional boutique gated community of 29 whitewashed residences above Tamuda Bay, on
// Morocco's Mediterranean coast. A concept website by Zenith Dubai, in the spirit of the great
// Riviera sales sites: giant condensed type, a script hand, bougainvillea, a coast you can trace.
// The village, its homes, prices and availability are invented; the residence picker and the call
// booking work end to end and stop at a notice before anything is sent.

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
const hf = (id: string) => (id ? `${CDN}${id}_min.webp` : "");

/** Photographs generated for this concept on the Higgsfield website (Seedream 5.0 Pro). */
export const IMG = {
  day: hf("hf_20261127_072712_085b6447-f8fd-4b1c-99dc-40cabde678d9"),
  night: hf("hf_20261127_072724_c4442b7a-552a-4a44-9cde-7958df33d1e8"),
  lane: hf("hf_20261127_073523_1af9e7a4-9373-4717-a8cb-bb9e2333d1cf"),
  bloom: hf("hf_20261127_073527_25d3327e-4453-4127-a17e-ddcbab1c948a"),
  terrace: hf("hf_20261127_074103_87738417-568c-4e40-964d-cd679cf6c773"),
  rif: hf("hf_20261127_074133_1c45b3b5-6d31-46b2-90cf-2d2829e587c8"),
  living: hf("hf_20261127_075238_57ffedfa-a193-4f68-8353-af30d5a81226"),
  aerial: hf("hf_20261127_074649_dcf2cea1-f103-491e-9b57-4e87aedad45c"),
  wellness: hf("hf_20261127_080424_e9ca9f97-d38c-46c3-a98c-784c60796a7f"),
  garden: hf("hf_20261127_075517_b0d0ef85-cd39-44fe-aa4c-a6030c13698a"),
  model: hf("hf_20261127_081028_5104bcf9-195c-4d16-bc47-31a7c7ba995b"),
};
/** 2x2 grids, cut in CSS: "crop:<url>#W,H,x,y,w,h". Filled once the grids are generated. */
const cell = (id: string, W: number, H: number, x: number, y: number, w: number, h: number) => `crop:${hf(id)}#${W},${H},${x},${y},${w},${h}`;
export const GRID: Record<"interiors" | "materials", string[]> = {
  interiors: [cell("hf_20261127_080329_baff2180-beda-4967-b8cd-8c3006aed326", 2720, 1536, 4, 4, 1341, 750), cell("hf_20261127_080329_baff2180-beda-4967-b8cd-8c3006aed326", 2720, 1536, 1374, 4, 1342, 750), cell("hf_20261127_080329_baff2180-beda-4967-b8cd-8c3006aed326", 2720, 1536, 4, 782, 1342, 750), cell("hf_20261127_080329_baff2180-beda-4967-b8cd-8c3006aed326", 2720, 1536, 1374, 782, 1342, 750)],
  materials: [cell("hf_20261127_074732_848863df-7d04-45bf-bdaa-6138fadbdabf", 2048, 2048, 4, 4, 1006, 1006), cell("hf_20261127_074732_848863df-7d04-45bf-bdaa-6138fadbdabf", 2048, 2048, 1038, 4, 1006, 1006), cell("hf_20261127_074732_848863df-7d04-45bf-bdaa-6138fadbdabf", 2048, 2048, 4, 1038, 1006, 1006), cell("hf_20261127_074732_848863df-7d04-45bf-bdaa-6138fadbdabf", 2048, 2048, 1038, 1037, 1006, 1007)],
};
export const ALT: Record<keyof typeof IMG, L> = {
  day: { en: "White residences stepping down a hillside, bougainvillea pergolas and a long pool under a deep blue sky", ar: "مساكن بيضاء متدرجة على تلة، وعرائش الجهنمية ومسبح طويل تحت سماء زرقاء عميقة" },
  night: { en: "The same residences at blue hour, lanterns lit and the pool glowing", ar: "المساكن نفسها في الساعة الزرقاء، والفوانيس مضاءة والمسبح يتوهّج" },
  lane: { en: "A whitewashed stepped lane under bougainvillea arches, blue doors and the sea at the end", ar: "زقاق أبيض متدرج تحت أقواس الجهنمية، وأبواب زرقاء والبحر في آخره" },
  bloom: { en: "", ar: "" },
  terrace: { en: "A roof terrace with linen sofas under bougainvillea, the sea and Cabo Negro beyond", ar: "سطح بأرائك من الكتان تحت الجهنمية، والبحر وكابو نيغرو خلفه" },
  rif: { en: "The Rif mountains coming down to the sea at Tamuda Bay", ar: "جبال الريف تنحدر نحو البحر في خليج تمودة" },
  living: { en: "A white living room with arched openings onto a bougainvillea terrace and the sea", ar: "غرفة معيشة بيضاء بفتحات مقوّسة على شرفة الجهنمية والبحر" },
  aerial: { en: "The village from above: white roofs around a long pool garden, the sea beyond", ar: "القرية من الأعلى: أسطح بيضاء حول حديقة المسبح الطويل، والبحر خلفها" },
  wellness: { en: "An indoor pool under a vaulted lime-plaster ceiling with blue zellige at the waterline", ar: "مسبح داخلي تحت سقف مقبّب من الجير وزليج أزرق عند خط الماء" },
  garden: { en: "Olive trees, lavender and jasmine along gravel paths between white walls", ar: "أشجار زيتون وخزامى وياسمين على ممرات من الحصى بين جدران بيضاء" },
  model: { en: "A white architectural model of the village on an oak table", ar: "نموذج معماري أبيض للقرية على طاولة من البلوط" },
};

/* ───────── the rest of the story ───────── */

export const FIGURES: { v: string; k: L }[] = [
  { v: "29", k: { en: "homes, and never more", ar: "منزلاً، ولن تزيد" } },
  { v: "4", k: { en: "rows on the hill", ar: "صفوف على التلة" } },
  { v: "40 m", k: { en: "pool in the garden", ar: "طول المسبح في الحديقة" } },
  { v: "1.8 ha", k: { en: "of gardens and lanes", ar: "هكتار من الحدائق والأزقة" } },
];
export const PRINCIPLES: { t: L; b: L }[] = [
  { t: { en: "Limewash", ar: "الجير" }, b: { en: "Walls breathe and stay cool; repainted every spring, like the medinas.", ar: "جدران تتنفس وتبقى باردة، تُطلى كل ربيع كما في المدن العتيقة." } },
  { t: { en: "Blue", ar: "الأزرق" }, b: { en: "Doors, shutters and tiles in the blue of the northern towns.", ar: "أبواب ونوافذ وزليج بزرقة مدن الشمال." } },
  { t: { en: "Pergolas", ar: "العرائش" }, b: { en: "Timber frames that the bougainvillea fills in one summer.", ar: "أطر خشبية تملؤها الجهنمية في صيف واحد." } },
  { t: { en: "Lanes", ar: "الأزقة" }, b: { en: "Stepped and shaded, so every home has a front door to the outside.", ar: "متدرجة ومظللة، فلكل منزل باب يطل على الخارج." } },
];
export const PLANTS: { name: L; months: number[]; color: string }[] = [
  { name: { en: "Orange blossom", ar: "زهر البرتقال" }, months: [2, 3], color: "#f3f0e6" },
  { name: { en: "Rosemary", ar: "إكليل الجبل" }, months: [0, 1, 2, 3, 10, 11], color: "#7d8fb8" },
  { name: { en: "Bougainvillea", ar: "الجهنمية" }, months: [3, 4, 5, 6, 7, 8, 9, 10], color: "#c8246e" },
  { name: { en: "Jasmine", ar: "الياسمين" }, months: [4, 5, 6, 7, 8, 9], color: "#ffffff" },
  { name: { en: "Lavender", ar: "الخزامى" }, months: [5, 6, 7], color: "#8b7cc4" },
  { name: { en: "Olive harvest", ar: "قطاف الزيتون" }, months: [9, 10, 11], color: "#6d7a3e" },
];
export const MONTHS: Record<Lang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
};
export const WELLNESS: L[] = [
  { en: "A 40 m outdoor pool, heated from October to May", ar: "مسبح خارجي بطول 40 م، مُدفأ من أكتوبر إلى مايو" },
  { en: "An indoor pool and a hammam under a vaulted roof", ar: "مسبح داخلي وحمّام تحت سقف مقبّب" },
  { en: "Two treatment rooms and a gym facing the olives", ar: "غرفتا علاج ونادٍ رياضي يطلان على الزيتون" },
  { en: "A shaded children's pool, walled off from the main garden", ar: "مسبح مظلل للأطفال منفصل عن الحديقة الرئيسية" },
];
export const AMENITIES: { t: L; b: L }[] = [
  { t: { en: "Gatehouse", ar: "البوابة" }, b: { en: "Staffed day and night; one entrance for the whole village.", ar: "حراسة ليلاً ونهاراً، ومدخل واحد للقرية كلها." } },
  { t: { en: "Concierge", ar: "الكونسيرج" }, b: { en: "Housekeeping, a cook for the evening, the boat for Saturday.", ar: "تنظيف وطاهٍ للمساء وقارب ليوم السبت." } },
  { t: { en: "Beach shuttle", ar: "حافلة الشاطئ" }, b: { en: "Every half hour to the sand, four minutes away.", ar: "كل نصف ساعة إلى الرمل، على بعد أربع دقائق." } },
  { t: { en: "Parking", ar: "المواقف" }, b: { en: "Under the hill, two spaces per home, with charging.", ar: "تحت التلة، موقفان لكل منزل مع شحن كهربائي." } },
  { t: { en: "Library and salon", ar: "المكتبة والصالون" }, b: { en: "A shared room for long lunches and rainy afternoons.", ar: "غرفة مشتركة للغداءات الطويلة وأمسيات المطر." } },
  { t: { en: "Storage", ar: "المخازن" }, b: { en: "For bicycles, boards and everything a summer brings.", ar: "للدراجات وألواح الركمجة وكل ما يحمله الصيف." } },
];
export type SceneId = "morning" | "siesta" | "evening" | "away";
export const SCENES: { id: SceneId; name: L; note: L; lights: number; shutters: number; temp: number; pool: boolean }[] = [
  { id: "morning", name: { en: "Morning", ar: "الصباح" }, note: { en: "Shutters open to the east, coffee on, terrace lights off.", ar: "تُفتح النوافذ شرقاً، تبدأ القهوة، وتنطفئ أضواء الشرفة." }, lights: 0.2, shutters: 1, temp: 23, pool: false },
  { id: "siesta", name: { en: "Siesta", ar: "القيلولة" }, note: { en: "West shutters half closed, the house cooled to 24°.", ar: "تُغلق النوافذ الغربية نصفاً ويُبرَّد البيت إلى 24°." }, lights: 0, shutters: 0.45, temp: 24, pool: false },
  { id: "evening", name: { en: "Evening", ar: "المساء" }, note: { en: "Lanterns on the terrace, pool lights, music in the garden.", ar: "فوانيس على الشرفة وأضواء المسبح وموسيقى في الحديقة." }, lights: 1, shutters: 1, temp: 22, pool: true },
  { id: "away", name: { en: "Away", ar: "الغياب" }, note: { en: "Everything closed and watched; the concierge sees what you see.", ar: "كل شيء مغلق ومراقب، ويرى الكونسيرج ما تراه." }, lights: 0.05, shutters: 0, temp: 27, pool: false },
];
export const TIMELINE: { when: string; t: L; b: L }[] = [
  { when: "2027", t: { en: "Design", ar: "التصميم" }, b: { en: "The village drawn and modelled with the landscape architects.", ar: "رسم القرية ونمذجتها مع مهندسي الحدائق." } },
  { when: "2028", t: { en: "Groundworks", ar: "الأعمال الأرضية" }, b: { en: "Terraces cut into the hill; the olive trees moved, not felled.", ar: "شق المدرجات في التلة؛ نُقلت أشجار الزيتون ولم تُقطع." } },
  { when: "2029", t: { en: "Building", ar: "البناء" }, b: { en: "Walls, pergolas, the pool garden, then the planting.", ar: "الجدران والعرائش وحديقة المسبح، ثم الغرس." } },
  { when: "2030", t: { en: "Keys", ar: "المفاتيح" }, b: { en: "The first summer in the village.", ar: "أول صيف في القرية." } },
];
export const GALLERY: Exclude<keyof typeof IMG, "bloom">[] = ["day", "lane", "terrace", "living", "wellness", "garden", "aerial", "night", "rif"];

/* ───────── the residences ───────── */

export type Kind = "garden" | "terrace" | "roof";
export type Status = "available" | "reserved" | "sold";
export interface Home {
  code: string;
  row: number;
  kind: Kind;
  beds: number;
  inside: number; // m²
  outside: number; // m²
  price: number; // EUR
  status: Status;
  view: L;
  x: number; // site plan position
  y: number;
}
export const KINDS: Record<Kind, { name: L; note: L }> = {
  roof: { name: { en: "Roof villa", ar: "فيلا السطح" }, note: { en: "Top of the hill: two floors, a roof terrace and a plunge pool.", ar: "أعلى التلة: طابقان وسطح ومسبح صغير." } },
  terrace: { name: { en: "Terrace residence", ar: "مسكن الشرفة" }, note: { en: "On the middle rows, with a deep terrace under a pergola.", ar: "في الصفوف الوسطى، بشرفة عميقة تحت عريشة." } },
  garden: { name: { en: "Garden residence", ar: "مسكن الحديقة" }, note: { en: "Beside the pool garden, with a private walled garden.", ar: "بجانب حديقة المسبح، بحديقة خاصة مسوّرة." } },
};
const VIEWS: L[] = [
  { en: "Full sea view", ar: "إطلالة كاملة على البحر" },
  { en: "Sea and mountains", ar: "البحر والجبال" },
  { en: "Sea and pool garden", ar: "البحر وحديقة المسبح" },
  { en: "Pool garden", ar: "حديقة المسبح" },
];
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
const ROWS: { kind: Kind; n: number }[] = [
  { kind: "roof", n: 5 },
  { kind: "terrace", n: 8 },
  { kind: "terrace", n: 8 },
  { kind: "garden", n: 8 },
];
export const HOMES: Home[] = (() => {
  const r = rng(29);
  const out: Home[] = [];
  ROWS.forEach((row, ri) => {
    for (let i = 0; i < row.n; i++) {
      const beds = row.kind === "roof" ? (i % 2 ? 4 : 3) : row.kind === "terrace" ? 2 + (i % 2) : 2 + ((i + 1) % 3 === 0 ? 1 : 0);
      const inside = Math.round(row.kind === "roof" ? 210 + beds * 22 + r() * 30 : row.kind === "terrace" ? 118 + beds * 18 + r() * 20 : 104 + beds * 16 + r() * 18);
      const outside = Math.round(row.kind === "roof" ? 120 + r() * 60 : row.kind === "terrace" ? 38 + r() * 26 : 70 + r() * 50);
      const rate = row.kind === "roof" ? 7600 : row.kind === "terrace" ? 6400 - ri * 250 : 5600;
      const roll = r();
      const status: Status = roll < 0.3 ? "sold" : roll < 0.45 ? "reserved" : "available";
      const span = 760 / row.n;
      const x = 120 + span * (i + 0.5) + (row.n === 5 ? 0 : 0);
      const y = 120 + ri * 112 + Math.sin((i / Math.max(1, row.n - 1)) * Math.PI) * -16;
      out.push({
        code: `${"ABCD"[ri]}${i + 1}`,
        row: ri,
        kind: row.kind,
        beds,
        inside,
        outside,
        price: Math.round(((inside + outside * 0.35) * rate) / 5000) * 5000,
        status,
        view: VIEWS[Math.min(3, ri)],
        x,
        y,
      });
    }
  });
  return out;
})();
export const eur = (n: number) => `€${n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : Math.round(n / 1000) + "k"}`;

/* ───────── the coast ───────── */

export const COAST: { name: L; min: number; x: number; y: number; home?: boolean }[] = [
  { name: { en: "Tangier airport", ar: "مطار طنجة" }, min: 55, x: 60, y: 172 },
  { name: { en: "Tanger Med", ar: "طنجة المتوسط" }, min: 40, x: 190, y: 118 },
  { name: { en: "Fnideq", ar: "الفنيدق" }, min: 12, x: 330, y: 104 },
  { name: { en: "Albora", ar: "ألبورا" }, min: 0, x: 470, y: 128, home: true },
  { name: { en: "M'diq marina", ar: "مارينا المضيق" }, min: 6, x: 600, y: 112 },
  { name: { en: "Cabo Negro", ar: "كابو نيغرو" }, min: 10, x: 720, y: 96 },
  { name: { en: "Tetouan", ar: "تطوان" }, min: 20, x: 860, y: 132 },
];
// a hand-drawn coastline through the stops, with a loop at the bay
export const COAST_PATH =
  "M30 196 C 80 178, 110 150, 160 132 S 230 96, 262 118 C 290 138, 300 102, 340 100 S 410 128, 440 122 C 470 116, 440 150, 470 150 C 500 150, 512 112, 560 110 S 640 120, 680 100 S 760 74, 790 104 C 812 126, 836 140, 880 132 S 950 120, 980 126";

/* ───────── interface text ───────── */

const en = {
  name: "ALBORA",
  residences: "RESIDENCES",
  script: "Tamuda Bay",
  left: "A VILLAGE",
  right: "BY THE SEA",
  byDay: "By day",
  byNight: "By night",
  selectHome: "SELECT A RESIDENCE",
  bookCall: "Book a call",
  contact: "Contact",
  menu: "Menu",
  close: "Close",
  langName: "العربية",
  concept: "Concept website. ALBORA is fictional.",
  conceptShort: "Fictional village",
  scroll: "Scroll",
  viewHomes: "VIEW AVAILABLE RESIDENCES",
  hotspots: [
    { x: 33, y: 82, title: "Pool garden", body: "Forty metres of water between olive and palm." },
    { x: 9, y: 70, title: "Pergola terraces", body: "Every home has one, under bougainvillea." },
    { x: 74, y: 80, title: "The lanes", body: "Stepped and shaded, never a corridor." },
  ],
  quote: "There are no corridors here. Twenty-nine front doors open onto lanes, gardens and terraces, the way a village by the sea has always worked.",
  conceptLabel: "The village",
  conceptTitle: "ALBORA IS A GATED VILLAGE OF TWENTY-NINE WHITE HOMES ON THE HILL ABOVE TAMUDA BAY, WHERE MOROCCO MEETS THE MEDITERRANEAN",
  conceptBody: "Built like the old towns of the north: limewashed walls, blue doors and shutters, stepped lanes, and pergolas that bougainvillea takes over in a single summer.",
  golden1: "THE NEW",
  golden2: "ANDALUSIAN",
  golden3: "COAST",
  country: "MOROCCO",
  goldenNote: "Ninety minutes from Tarifa by sea. A world away by everything else.",
  coastA: "THE OTHER SIDE",
  coastScript: "finally",
  coastB: "OF THE STRAIT",
  coastTitle: "BETWEEN TANGIER AND TETOUAN",
  coastBody: "Beaches, a marina, the golf at Cabo Negro and the medina of Tetouan, all within twenty minutes. A coast that still feels like a secret.",
  minutes: "min",
  coastNote: "Approximate drive times.",
  rifTitle: "WHERE THE RIF COMES DOWN TO THE SEA",
  rifBody: "Mountains behind, the Alboran Sea in front, and the light the painters came for.",
  livingTitle: "INSIDE",
  livingScript: "light",
  livingBody: "Lime plaster, terrazzo, oak and linen. Every room opens through an arch onto a terrace, a garden or the sky.",
  pickTitle: "SELECT A RESIDENCE",
  pickIntro: "Twenty-nine homes in four rows on the hill. Choose one on the plan.",
  filterType: "Type",
  filterBeds: "Bedrooms",
  all: "All",
  onlyAvailable: "Available only",
  sea: "The Alboran Sea",
  pool: "Pool garden",
  status: { available: "Available", reserved: "Reserved", sold: "Sold" } as Record<Status, string>,
  shown: (n: number, a: number) => `${n} homes shown, ${a} available`,
  bedsN: (n: number) => `${n} bedrooms`,
  inside: "Inside",
  outside: "Terrace or garden",
  price: "Price",
  view: "View",
  plan: "Plan",
  rooms: { living: "Living", kitchen: "Kitchen", bed: "Bedroom", bath: "Bath", terrace: "Terrace", garden: "Garden", pool: "Pool" },
  callAbout: (c: string) => `Book a call about ${c}`,
  callTitle: "BOOK A CALL",
  callScript: "with us",
  callIntro: "Thirty minutes with the sales team, by video, by phone, or on site with a glass of mint tea.",
  about: "About",
  anyHome: "The village in general",
  format: "How",
  formats: ["Video call", "Phone call", "Visit the site"],
  language: "Language",
  languages: ["English", "Français", "العربية", "Español"],
  day: "Day",
  time: "Time (Morocco)",
  pickTime: "Choose a time first.",
  confirm: "Request this call",
  summary: (what: string, when: string, how: string) => `${how} about ${what}, ${when}.`,
  noticeTitle: "This is where the call would be booked",
  noticeBody: "ALBORA is a concept website by Zenith Dubai. The village and its homes are invented, so nothing was reserved and no one has been contacted.",
  noticeCta: "Back to the village",
  noticeZenith: "Want a website like this?",
  footerLine: "A village to come back to.",
  footer: "ALBORA is a fictional development. Homes, prices, availability and photographs are illustrative and AI-generated for this concept.",
  footerBy: "Concept, design and build by Zenith Dubai",
  backToGallery: "All concept websites",
  skip: "Skip to the residences",
  faqTitle: "Questions",
  contactTitle: "WRITE TO US",
  contactIntro: "ALBORA is fictional, so a message here reaches Zenith Dubai, who designed and built this website.",
  form: {
    name: "Your name",
    email: "Email",
    interest: "About",
    message: "Your message",
    send: "Send",
    sending: "Sending…",
    sent: "Thank you. Zenith Dubai, who built this concept, will reply by email.",
    errs: {
      missing: "Please add your name and email.",
      email: "Please check the email address.",
      rate: "Too many messages from this connection. Please try again in an hour.",
      invalid: "Something was missing. Reload the page and try again.",
      unavailable: "The form is not available right now. Email hello@zenithdubaicv.com instead.",
    } as Record<string, string>,
  },
  interests: ["A residence", "A call", "Visiting", "Something else"],
  nav: { village: "The village", coast: "The coast", homes: "Residences", living: "Living", gallery: "Gallery", call: "Book a call" },
  figuresNote: "Figures for this concept.",
  archTitle: "BUILT LIKE A HILLSIDE TOWN",
  archBody: "Four rows follow the contour of the hill, so every roof is someone's terrace and nobody looks into anybody's garden.",
  gardenTitle: "GARDENS FOR EVERY MONTH",
  gardenBody: "Planted for scent as much as shade. Move through the year to see what is in flower.",
  inFlower: "In flower",
  wellTitle: "THE POOL GARDEN AND THE HAMMAM",
  interiorsTitle: "INTERIORS AND MATERIALS",
  interiorTabs: ["Kitchen", "Bedroom", "Bathroom", "Dining"],
  materialNames: ["Lime plaster", "Terrazzo", "Blue zellige", "Oak and brass"],
  terraceTitle: "EVERY HOME HAS A VIEW",
  terraceBody: "The roof villas see the whole bay; the middle rows look over the pool to the sea; the garden residences sit among the olives.",
  amenTitle: "LIFE IN THE VILLAGE",
  homeTitle: "A HOUSE THAT KNOWS THE TIME OF DAY",
  homeBody: "One quiet panel by the door, or your phone: light, shutters, air and the pool, set in scenes.",
  lights: "Lights",
  shutters: "Shutters",
  air: "Air",
  poolLights: "Pool lights",
  on: "On",
  off: "Off",
  open: "Open",
  closed: "Closed",
  storyTitle: "HOW IT WOULD COME TO BE",
  storyNote: "A concept timeline. ALBORA is not a real project and has no permits.",
  galleryTitle: "GALLERY",
  galleryHint: "Keep scrolling to walk through the village. Open any photograph to see it full screen.",
  prev: "Previous",
  next: "Next",
  of: "of",
  priceNote: "Illustrative price for this concept.",
  month: "Month",
  backTop: "back to the top",
  ring: "ALBORA RESIDENCES ◦ TAMUDA BAY ◦ MOROCCO ◦ ",
  viewRing: "VIEW AVAILABLE RESIDENCES ◦ VIEW AVAILABLE RESIDENCES ◦ ",
  hotspotOpen: "Show details",
  scene: "Scene",
  noneMatch: "No home matches these filters. Clear one to see more.",
  clear: "Clear filters",
  open3d: "Open on the plan",
  soldOut: "Sold. Choose another home, or ask about the waiting list on a call.",
  timeTaken: "Taken",
  daysLoading: "Loading the calendar…",
  wellNote: "Shared by the twenty-nine homes, run by the concierge.",
};
export type UIStrings = typeof en;

export const UI: Record<Lang, UIStrings> = {
  en,
  ar: {
    ...en,
    name: "ألبورا",
    residences: "ريزيدنس",
    script: "Tamuda Bay",
    left: "قرية",
    right: "على البحر",
    byDay: "نهاراً",
    byNight: "ليلاً",
    selectHome: "اختر مسكناً",
    bookCall: "احجز مكالمة",
    contact: "تواصل",
    menu: "القائمة",
    close: "إغلاق",
    langName: "English",
    concept: "موقع تجريبي. ألبورا مشروع خيالي.",
    conceptShort: "قرية خيالية",
    scroll: "مرّر",
    viewHomes: "المساكن المتاحة",
    hotspots: [
      { x: 33, y: 82, title: "حديقة المسبح", body: "أربعون متراً من الماء بين الزيتون والنخيل." },
      { x: 9, y: 70, title: "شرفات العرائش", body: "لكل منزل شرفة تحت الجهنمية." },
      { x: 74, y: 80, title: "الأزقة", body: "متدرجة ومظللة، ولا ممرات أبداً." },
    ],
    quote: "لا ممرات هنا. تسعة وعشرون باباً أمامياً تنفتح على أزقة وحدائق وشرفات، كما عاشت القرى على البحر دائماً.",
    conceptLabel: "القرية",
    conceptTitle: "ألبورا قرية مسوّرة من تسعة وعشرين منزلاً أبيض على التلة فوق خليج تمودة، حيث يلتقي المغرب بالمتوسط",
    conceptBody: "مبنية كالمدن القديمة في الشمال: جدران مطلية بالجير، وأبواب ونوافذ زرقاء، وأزقة متدرجة، وعرائش تكسوها الجهنمية في صيف واحد.",
    golden1: "الساحل",
    golden2: "الأندلسي",
    golden3: "الجديد",
    country: "المغرب",
    goldenNote: "تسعون دقيقة من طريفة بحراً، وعالم آخر في كل ما عدا ذلك.",
    coastA: "الضفة الأخرى",
    coastScript: "finally",
    coastB: "من المضيق",
    coastTitle: "بين طنجة وتطوان",
    coastBody: "شواطئ ومارينا وملعب غولف كابو نيغرو ومدينة تطوان العتيقة، كلها في عشرين دقيقة. ساحل ما زال يشبه السر.",
    minutes: "دقيقة",
    coastNote: "أوقات قيادة تقريبية.",
    rifTitle: "حيث ينحدر الريف إلى البحر",
    rifBody: "الجبال خلفك، وبحر البوران أمامك، والضوء الذي جاء من أجله الرسامون.",
    livingTitle: "من الداخل",
    livingScript: "light",
    livingBody: "جير وتيرازو وبلوط وكتان. كل غرفة تنفتح عبر قوس على شرفة أو حديقة أو السماء.",
    pickTitle: "اختر مسكناً",
    pickIntro: "تسعة وعشرون منزلاً في أربعة صفوف على التلة. اختر واحداً على المخطط.",
    filterType: "النوع",
    filterBeds: "غرف النوم",
    all: "الكل",
    onlyAvailable: "المتاحة فقط",
    sea: "بحر البوران",
    pool: "حديقة المسبح",
    status: { available: "متاح", reserved: "محجوز", sold: "مباع" } as Record<Status, string>,
    shown: (n: number, a: number) => `${n} منزلاً معروضاً، ${a} متاحة`,
    bedsN: (n: number) => `${n} غرف نوم`,
    inside: "الداخل",
    outside: "الشرفة أو الحديقة",
    price: "السعر",
    view: "الإطلالة",
    plan: "المخطط",
    rooms: { living: "معيشة", kitchen: "مطبخ", bed: "نوم", bath: "حمام", terrace: "شرفة", garden: "حديقة", pool: "مسبح" },
    callAbout: (c: string) => `احجز مكالمة بخصوص ${c}`,
    callTitle: "احجز مكالمة",
    callScript: "with us",
    callIntro: "ثلاثون دقيقة مع فريق المبيعات، بالفيديو أو الهاتف أو في الموقع مع كأس شاي بالنعناع.",
    about: "بخصوص",
    anyHome: "القرية عموماً",
    format: "الطريقة",
    formats: ["مكالمة فيديو", "مكالمة هاتفية", "زيارة الموقع"],
    language: "اللغة",
    languages: ["English", "Français", "العربية", "Español"],
    day: "اليوم",
    time: "الوقت (المغرب)",
    pickTime: "اختر وقتاً أولاً.",
    confirm: "اطلب هذه المكالمة",
    summary: (what: string, when: string, how: string) => `${how} بخصوص ${what}، ${when}.`,
    noticeTitle: "هنا كانت ستُحجز المكالمة",
    noticeBody: "ألبورا موقع تجريبي من زينيث دبي. القرية ومنازلها من الخيال، لذلك لم يُحجز شيء ولم يُتواصل مع أحد.",
    noticeCta: "العودة إلى القرية",
    noticeZenith: "تريد موقعاً كهذا؟",
    footerLine: "قرية تعود إليها.",
    footer: "ألبورا مشروع خيالي. المنازل والأسعار والتوفّر والصور توضيحية ومولّدة بالذكاء الاصطناعي لهذا التصور.",
    footerBy: "الفكرة والتصميم والتنفيذ: زينيث دبي",
    backToGallery: "كل المواقع التجريبية",
    skip: "انتقل إلى المساكن",
    faqTitle: "أسئلة",
    contactTitle: "راسلنا",
    contactIntro: "ألبورا مشروع خيالي، لذلك تصل رسالتك هنا إلى زينيث دبي التي صمّمت هذا الموقع وبنته.",
    form: {
      name: "اسمك",
      email: "البريد الإلكتروني",
      interest: "الموضوع",
      message: "رسالتك",
      send: "إرسال",
      sending: "جارٍ الإرسال…",
      sent: "شكراً لك. سترد عليك زينيث دبي، التي بنت هذا المشروع، عبر البريد الإلكتروني.",
      errs: {
        missing: "يرجى إضافة اسمك وبريدك الإلكتروني.",
        email: "يرجى التحقق من البريد الإلكتروني.",
        rate: "رسائل كثيرة من هذا الاتصال. يرجى المحاولة بعد ساعة.",
        invalid: "نقصت معلومة. أعد تحميل الصفحة وحاول مجدداً.",
        unavailable: "النموذج غير متاح الآن. راسلنا على hello@zenithdubaicv.com.",
      } as Record<string, string>,
    },
    interests: ["مسكن", "مكالمة", "زيارة", "شيء آخر"],
    nav: { village: "القرية", coast: "الساحل", homes: "المساكن", living: "الحياة", gallery: "المعرض", call: "احجز مكالمة" },
    figuresNote: "أرقام لهذا التصور.",
    archTitle: "مبنية كبلدة على تلة",
    archBody: "أربعة صفوف تتبع خط التلة، فكل سطح شرفة لأحدهم ولا أحد يطل على حديقة غيره.",
    gardenTitle: "حدائق لكل شهر",
    gardenBody: "مزروعة للرائحة بقدر الظل. تنقّل عبر السنة لترى ما يزهر.",
    inFlower: "يزهر الآن",
    wellTitle: "حديقة المسبح والحمّام",
    interiorsTitle: "الداخل والمواد",
    interiorTabs: ["المطبخ", "غرفة النوم", "الحمام", "الطعام"],
    materialNames: ["لياسة الجير", "التيرازو", "الزليج الأزرق", "البلوط والنحاس"],
    terraceTitle: "لكل منزل إطلالة",
    terraceBody: "فلل السطح ترى الخليج كله، والصفوف الوسطى تطل فوق المسبح على البحر، ومساكن الحديقة بين الزيتون.",
    amenTitle: "الحياة في القرية",
    homeTitle: "بيت يعرف وقت اليوم",
    homeBody: "لوحة هادئة عند الباب، أو هاتفك: الضوء والنوافذ والهواء والمسبح، في مشاهد جاهزة.",
    lights: "الإضاءة",
    shutters: "النوافذ",
    air: "التكييف",
    poolLights: "أضواء المسبح",
    on: "تشغيل",
    off: "إيقاف",
    open: "مفتوحة",
    closed: "مغلقة",
    storyTitle: "كيف سيتحقق",
    storyNote: "جدول زمني تصوري. ألبورا ليس مشروعاً حقيقياً وليست له تراخيص.",
    galleryTitle: "المعرض",
    galleryHint: "واصل التمرير لتتجول في القرية. افتح أي صورة لتراها بملء الشاشة.",
    prev: "السابق",
    next: "التالي",
    of: "من",
    priceNote: "سعر توضيحي لهذا التصور.",
    month: "الشهر",
    backTop: "العودة إلى الأعلى",
    ring: "ألبورا ريزيدنس ◦ خليج تمودة ◦ المغرب ◦ ",
    viewRing: "المساكن المتاحة ◦ المساكن المتاحة ◦ المساكن المتاحة ◦ ",
    hotspotOpen: "اعرض التفاصيل",
    scene: "المشهد",
    noneMatch: "لا يوجد منزل يطابق هذه الخيارات. ألغِ أحدها لترى المزيد.",
    clear: "إلغاء الخيارات",
    open3d: "افتح على المخطط",
    soldOut: "مباع. اختر منزلاً آخر، أو اسأل عن قائمة الانتظار في مكالمة.",
    timeTaken: "محجوز",
    daysLoading: "جارٍ تحميل التقويم…",
    wellNote: "مشتركة بين المنازل التسعة والعشرين ويديرها الكونسيرج.",
  },
};

export const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "Is ALBORA a real development?", ar: "هل ألبورا مشروع حقيقي؟" },
    a: {
      en: "No. ALBORA, its homes, prices and availability are fictional: a concept website designed and built by Zenith Dubai. The photographs are AI-generated and nothing can be reserved here.",
      ar: "لا. ألبورا ومنازلها وأسعارها وتوفّرها من الخيال: موقع تجريبي صمّمته وبنته زينيث دبي. الصور مولّدة بالذكاء الاصطناعي ولا يمكن حجز أي شيء هنا.",
    },
  },
  { q: { en: "Where is Tamuda Bay?", ar: "أين يقع خليج تمودة؟" }, a: { en: "On Morocco's Mediterranean coast, between Tangier and Tetouan, the stretch people call Andalusian Morocco.", ar: "على ساحل المغرب المتوسطي بين طنجة وتطوان، في المنطقة التي يسميها الناس المغرب الأندلسي." } },
  { q: { en: "Can I visit?", ar: "هل يمكنني الزيارة؟" }, a: { en: "In this concept, visits are booked as a call with the sales team, on site or by video.", ar: "في هذا التصور تُحجز الزيارات كمكالمة مع فريق المبيعات، في الموقع أو بالفيديو." } },
];
