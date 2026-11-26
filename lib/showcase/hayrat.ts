// HAYRAT: a fictional hotel on a low coral-stone island over the old pearl banks of the Arabian
// Gulf. A concept website by Zenith Dubai. Every room, price and date here is invented; the booking
// engine works end to end and stops at a notice before anything would be reserved or charged.

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
export const hf = (id: string) => (id ? `${CDN}${id}_min.webp` : "");

/** Every photograph, by role. Filled from the Higgsfield generations in showcase-assets/hayrat-prompts.json. */
export const IMG = {
  heroDhow: hf("hf_20261126_123629_c59c7157-18d8-4950-b9d4-379fe802c80e"),
  heroJetty: hf("hf_20261126_123716_2eba8659-ab61-466e-9991-9edb1ba4f0c4"),
  aerial: hf("hf_20261126_124002_a85e6580-46b4-45d2-af73-2b894bdbb5df"),
  night: hf("hf_20261126_124044_881e2c32-e492-4537-a46b-62f84b8b2c8e"),
  diveSurface: hf("hf_20261126_125055_cb85211d-4621-4540-bdd3-c5641b771525"),
  diveDiver: hf("hf_20261126_125401_15b53b04-0c0f-411c-9250-56ef66c98544"),
  diveBank: hf("hf_20261126_125512_fe5ad520-c8ed-4acc-bd9b-c55dbc3e7ca1"),
  pearl: hf("hf_20261126_125713_0dccb9f5-aa08-474d-a334-30b3dff36463"),
};

/** 2x2 grids cut into four files (top-left, top-right, bottom-left, bottom-right). */
export const GRID: Record<"dining" | "experience" | "spa" | "details" | "rooms", string[]> = {
  dining: [
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/2660e638-9dba-4f56-b6ea-453186a16da7.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/15ff7cb7-e9b1-4436-a45e-a8cd9c90f537.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/5305cca1-e206-48cb-8ec3-550e174ea29b.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/40bab4c6-1436-4e12-9c79-1361fd81fed7.webp",
  ],
  experience: [
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/ca544d71-ba5e-49f3-93c8-d28ecc3f8abb.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/55f33845-14c8-4deb-9680-821d5fdfcbd7.webp",
    "",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/72a63438-9528-4ab9-ae06-fe98b4c34af5.webp",
  ],
  spa: [
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/78d16dd2-f6fb-4076-b01a-ac5b6021ed07.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/9d8fd27a-9ad5-4f9c-b311-0d303fdee719.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/84196443-97bd-4bae-a1d2-dce183436119.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/b38b9fc8-a014-4a9e-8a46-fecc38f954ab.webp",
  ],
  details: [
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/c3e0b309-8fa8-4a65-983d-81b297761a8c.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/9aa0fa6b-f290-435c-becb-cd7e65789f59.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/fcd2b173-d8f7-4bd6-bd89-efc3133cd0b9.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/6bf5bc30-2563-4e43-95e1-0a8590005dc4.webp",
  ],
  rooms: [
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/79fb602d-e33e-4921-99bd-3faa46189d72.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/771a04a7-d7ab-4c50-9563-84fa4ef0b18f.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/44192862-aeaf-4902-ab5f-60ea7fbe0982.webp",
    "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/8e11eec1-8436-4213-b08d-9c9c834cecd6.webp",
  ],
};
export const cell = (g: keyof typeof GRID, i: number) => GRID[g][i] ?? "";

/* ───────────────────────── Rooms ───────────────────────── */

export type RoomId = "barasti" | "merchant" | "nakhuda" | "lagoon" | "dana";

export interface Room {
  id: RoomId;
  name: L;
  line: L;
  body: L;
  keys: number;
  size: number;
  terrace?: number;
  beds: L;
  maxAdults: number;
  maxChildren: number;
  view: L;
  base: number;
  img: string;
  details: number[];
  features: L[];
  transferIncluded?: boolean;
}

export const ROOMS: Room[] = [
  {
    id: "merchant",
    name: { en: "Merchant's Room", ar: "غرفة التاجر" },
    line: { en: "In the houses where the season's pearls were weighed", ar: "في البيوت التي كانت تُوزن فيها لآلئ الموسم" },
    body: {
      en: "Six rooms in the restored coral-stone houses of the pearl merchants, each opening onto a shaded courtyard with a ghaf tree. Thick lime-plaster walls keep the noon heat out the old way; carved teak doors, arched niches and a low majlis keep the house as it was.",
      ar: "ست غرف في بيوت تجار اللؤلؤ المرمّمة من الحجر المرجاني، تطلّ كلّ منها على فناء ظليل تتوسّطه شجرة غاف. جدران الجص السميكة تحجب حرّ الظهيرة بالطريقة القديمة، والأبواب الخشبية المنقوشة والكوّات المقوّسة والمجلس المنخفض تُبقي البيت كما كان.",
    },
    keys: 6,
    size: 48,
    beds: { en: "King or twin", ar: "سرير كبير أو سريران" },
    maxAdults: 2,
    maxChildren: 1,
    view: { en: "Courtyard", ar: "الفناء" },
    base: 1850,
    img: hf("hf_20261126_124438_c62ae5e5-8b22-4e14-8211-98ae81c1a07f"),
    details: [1, 2],
    features: [
      { en: "Courtyard with a ghaf tree", ar: "فناء بشجرة غاف" },
      { en: "Coral-stone walls, natural cooling", ar: "جدران من الحجر المرجاني وتبريد طبيعي" },
      { en: "Stone bath with a brass tap", ar: "حوض حجري بصنبور نحاسي" },
    ],
  },
  {
    id: "barasti",
    name: { en: "Barasti Villa", ar: "فيلا البرستي" },
    line: { en: "Palm-frond walls on the beach, shade first", ar: "جدران من سعف النخيل على الشاطئ، والظلّ أولاً" },
    body: {
      en: "Six villas built the way summer houses were built on the coast: a teak frame, walls and roof of woven palm frond that let the sea breeze through, a sand-coloured floor and doors that fold away onto the shallows. An outdoor shower stands open to the sky.",
      ar: "ست فلل مبنية كما كانت تُبنى بيوت الصيف على الساحل: هيكل من خشب الساج وجدران وسقف من سعف النخيل المنسوج يمرّ منه نسيم البحر، وأرضية بلون الرمل، وأبواب تنطوي لتنفتح على المياه الضحلة. ودُش في الهواء الطلق مفتوح على السماء.",
    },
    keys: 6,
    size: 75,
    beds: { en: "King", ar: "سرير كبير" },
    maxAdults: 2,
    maxChildren: 1,
    view: { en: "Beach and shallows", ar: "الشاطئ والمياه الضحلة" },
    base: 2600,
    img: hf("hf_20261126_124353_3a55c09e-540a-499d-b07e-fd202b4def75"),
    details: [0, 3],
    features: [
      { en: "Doors that fold onto the sand", ar: "أبواب تنطوي على الرمل" },
      { en: "Outdoor shower open to the sky", ar: "دُش في الهواء الطلق" },
      { en: "Woven palm-frond walls", ar: "جدران من سعف النخيل المنسوج" },
    ],
  },
  {
    id: "nakhuda",
    name: { en: "Nakhuda Suite", ar: "جناح النوخذة" },
    line: { en: "The captain's rooms, with the roof to yourself", ar: "غرف الربّان، والسطح لك وحدك" },
    body: {
      en: "Three suites at the top of the merchant houses, where the nakhuda, the dhow's captain, kept his charts and chests. A private roof terrace of sixty square metres for breakfast at dawn and the stars at night, with the moored dhows below.",
      ar: "ثلاثة أجنحة في أعلى بيوت التجار، حيث كان النوخذة، ربّان السفينة، يحفظ خرائطه وصناديقه. سطح خاص مساحته ستون متراً مربعاً لإفطار الفجر ونجوم الليل، والسفن الراسية في الأسفل.",
    },
    keys: 3,
    size: 90,
    terrace: 60,
    beds: { en: "King", ar: "سرير كبير" },
    maxAdults: 2,
    maxChildren: 1,
    view: { en: "Rooftops and the anchorage", ar: "الأسطح والمرسى" },
    base: 3900,
    img: hf("hf_20261126_124652_7165b45e-df43-4ec0-aba3-8228559280fc"),
    details: [2, 1],
    features: [
      { en: "60 m² private roof terrace", ar: "سطح خاص بمساحة 60 م²" },
      { en: "Breakfast served on the roof", ar: "إفطار يُقدَّم على السطح" },
      { en: "Telescope for the night sky", ar: "تلسكوب لسماء الليل" },
    ],
  },
  {
    id: "lagoon",
    name: { en: "Lagoon Pavilion", ar: "جناح البحيرة" },
    line: { en: "A stone room on the water, with its own pool", ar: "غرفة حجرية على الماء ومسبحها الخاص" },
    body: {
      en: "Two pavilions at the edge of the lagoon, each with a private plunge pool, steps down into the warm shallows and a daybed under a palm-frond shade. The dhow transfer is included, and the pavilion has its own jetty.",
      ar: "جناحان على حافة البحيرة، في كلّ منهما مسبح خاص ودرجات تنزل إلى المياه الضحلة الدافئة، وأريكة تحت ظلّة من سعف النخيل. انتقال السفينة مشمول، وللجناح رصيفه الخاص.",
    },
    keys: 2,
    size: 110,
    beds: { en: "King", ar: "سرير كبير" },
    maxAdults: 2,
    maxChildren: 0,
    view: { en: "Lagoon", ar: "البحيرة" },
    base: 5400,
    img: hf("hf_20261126_124739_9bedf568-51ce-4649-8cd2-1f2e8a93aaad"),
    details: [3, 0],
    features: [
      { en: "Private plunge pool", ar: "مسبح خاص" },
      { en: "Steps into the lagoon", ar: "درجات تنزل إلى البحيرة" },
      { en: "Dhow transfer included", ar: "انتقال السفينة مشمول" },
    ],
    transferIncluded: true,
  },
  {
    id: "dana",
    name: { en: "Dana Residence", ar: "دار الدانة" },
    line: { en: "Two bedrooms, a wind tower and a table for everyone", ar: "غرفتا نوم وبرج رياح ومائدة تتّسع للجميع" },
    body: {
      en: "Named after the dana, the largest and rarest pearl. The merchant's own house: two bedrooms around a private courtyard, a wind tower over the living room, a long table of reclaimed dhow teak and a cabinet inlaid with mother-of-pearl. For families, with a host of its own.",
      ar: "سُمّيت باسم الدانة، أكبر اللآلئ وأندرها. بيت التاجر نفسه: غرفتا نوم حول فناء خاص، وبرج رياح فوق غرفة الجلوس، ومائدة طويلة من خشب سفينة قديمة، وخزانة مطعّمة بالصدف. للعائلات، ولها مضيف خاص.",
    },
    keys: 1,
    size: 220,
    beds: { en: "Two kings, two singles", ar: "سريران كبيران وسريران مفردان" },
    maxAdults: 4,
    maxChildren: 2,
    view: { en: "Private courtyard and sea", ar: "فناء خاص والبحر" },
    base: 9800,
    img: hf("hf_20261126_124954_ce235f8a-2560-414e-8e1a-cb3489ab5087"),
    details: [1, 2],
    features: [
      { en: "Private courtyard and wind tower", ar: "فناء خاص وبرج رياح" },
      { en: "Your own host", ar: "مضيف خاص" },
      { en: "Dhow transfer included", ar: "انتقال السفينة مشمول" },
    ],
    transferIncluded: true,
  },
];

export const roomById = (id?: string | null) => ROOMS.find((r) => r.id === id);

/* ───────────────────────── Dates, rates, availability ───────────────────────── */

/** Dates are plain "YYYY-MM-DD" strings handled in UTC so they never shift with the visitor's zone. */
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const parse = (s: string) => new Date(`${s}T00:00:00Z`);
export const addDays = (s: string, n: number) => {
  const d = parse(s);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
};
export const nightsBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000);
export const todayIso = () => {
  const n = new Date();
  return iso(new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate())));
};

type Season = "peak" | "high" | "shoulder" | "summer";
export function season(s: string): Season {
  const d = parse(s);
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const md = m * 100 + day;
  if (md >= 1220 || md <= 104) return "peak";
  if (md >= 616 && md <= 915) return "summer";
  if ((md >= 501 && md <= 615) || (md >= 916 && md <= 1014)) return "shoulder";
  return "high";
}
const SEASON_X: Record<Season, number> = { peak: 1.35, high: 1, shoulder: 0.85, summer: 0.7 };
export const SEASON_NAME: Record<Season, L> = {
  peak: { en: "Festive season", ar: "موسم الأعياد" },
  high: { en: "Winter season", ar: "موسم الشتاء" },
  shoulder: { en: "Spring and autumn", ar: "الربيع والخريف" },
  summer: { en: "Diving season", ar: "موسم الغوص" },
};

/** The rate for the night that starts on `s`. Friday and Saturday nights carry 15% more. */
export function nightly(room: Room, s: string) {
  const dow = parse(s).getUTCDay();
  const weekend = dow === 5 || dow === 6 ? 1.15 : 1;
  return Math.round((room.base * SEASON_X[season(s)] * weekend) / 10) * 10;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 1000;
}

/** Invented but steady availability: the same date is always free or full for the same room. */
export function soldOut(room: Room, s: string) {
  if (s.endsWith("-12-31")) return true;
  const pct = { peak: 46, high: 16, shoulder: 7, summer: 4 }[season(s)] + (room.keys === 1 ? 14 : room.keys <= 3 ? 6 : 0);
  return hash(`${room.id}:${s}`) < pct * 10;
}

export const minStay = (checkIn: string) => (season(checkIn) === "peak" ? 3 : 2);

/** Any room free every night of the range? */
export function stayAvailable(room: Room, checkIn: string, checkOut: string) {
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) if (soldOut(room, d)) return false;
  return true;
}

export function stayNights(room: Room, checkIn: string, checkOut: string) {
  const out: { date: string; rate: number }[] = [];
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) out.push({ date: d, rate: nightly(room, d) });
  return out;
}

/** Lowest nightly rate on a date across rooms that are free (for the calendar). */
export function fromRate(s: string, roomId?: RoomId) {
  const pool = roomId ? ROOMS.filter((r) => r.id === roomId) : ROOMS;
  let best = Infinity;
  for (const r of pool) if (!soldOut(r, s)) best = Math.min(best, nightly(r, s));
  return best === Infinity ? null : best;
}

/* ───────────────────────── Add-ons ───────────────────────── */

export type AddOnId = "transfer" | "halfboard" | "dive" | "nahham" | "salt";
export interface AddOn {
  id: AddOnId;
  name: L;
  note: L;
  price: number;
  unit: "guest" | "adultNight" | "adult";
}
export const ADDONS: AddOn[] = [
  { id: "transfer", name: { en: "Dhow transfer, both ways", ar: "انتقال بالسفينة ذهاباً وإياباً" }, note: { en: "40 minutes from the marina pier", ar: "40 دقيقة من رصيف المرسى" }, price: 350, unit: "guest" },
  { id: "halfboard", name: { en: "Dinner every night", ar: "العشاء كل ليلة" }, note: { en: "At the Nakhuda's Table, children half price", ar: "على مائدة النوخذة، ونصف السعر للأطفال" }, price: 420, unit: "adultNight" },
  { id: "dive", name: { en: "Dive to the banks", ar: "الغوص إلى الهيرات" }, note: { en: "With a free diver, from age 12", ar: "مع غوّاص حرّ، من عمر 12 عاماً" }, price: 650, unit: "adult" },
  { id: "nahham", name: { en: "An evening with the nahham", ar: "أمسية مع النهّام" }, note: { en: "Songs of the pearl divers on the dhow", ar: "أغاني الغوّاصين على ظهر السفينة" }, price: 300, unit: "adult" },
  { id: "salt", name: { en: "Salt House ritual", ar: "طقس بيت الملح" }, note: { en: "90 minutes, one each", ar: "90 دقيقة لكلّ شخص" }, price: 780, unit: "adult" },
];

export interface Stay {
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
  room: RoomId | null;
  addons: AddOnId[];
}
export const EMPTY_STAY: Stay = { checkIn: null, checkOut: null, adults: 2, children: 0, room: null, addons: [] };

export function addOnTotal(a: AddOn, stay: Stay, nights: number, room?: Room) {
  if (a.id === "transfer" && room?.transferIncluded) return 0;
  if (a.unit === "guest") return a.price * (stay.adults + stay.children);
  if (a.unit === "adultNight") return Math.round(a.price * nights * (stay.adults + stay.children * 0.5));
  return a.price * stay.adults;
}

export function quote(stay: Stay) {
  const room = roomById(stay.room);
  if (!room || !stay.checkIn || !stay.checkOut) return null;
  const nights = stayNights(room, stay.checkIn, stay.checkOut);
  const roomTotal = nights.reduce((s, n) => s + n.rate, 0);
  const extras = ADDONS.filter((a) => stay.addons.includes(a.id)).map((a) => ({ a, total: addOnTotal(a, stay, nights.length, room) }));
  const total = roomTotal + extras.reduce((s, e) => s + e.total, 0);
  return { room, nights, roomTotal, extras, total };
}

export const fits = (room: Room, adults: number, children: number) => adults <= room.maxAdults && children <= room.maxChildren;

export const money = (n: number, lang: Lang) =>
  lang === "ar" ? `${n.toLocaleString("ar-AE-u-nu-latn")} درهم` : `AED ${n.toLocaleString("en-US")}`;

const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
};
export const monthName = (m: number, lang: Lang) => MONTHS[lang][m];
export const shortDate = (s: string, lang: Lang) => {
  const d = parse(s);
  return lang === "ar" ? `${d.getUTCDate()} ${MONTHS.ar[d.getUTCMonth()]}` : `${d.getUTCDate()} ${MONTHS.en[d.getUTCMonth()].slice(0, 3)}`;
};
export const WEEKDAYS: Record<Lang, string[]> = {
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  ar: ["ن", "ث", "ر", "خ", "ج", "س", "ح"],
};

/* ───────────────────────── The descent ───────────────────────── */

export const DESCENT: { depth: number; line: L; img: keyof typeof IMG }[] = [
  { depth: 0, line: { en: "The dhow drops anchor over the bank.", ar: "ترسو السفينة فوق الهيرات." }, img: "diveSurface" },
  { depth: 4, line: { en: "For thousands of summers, divers came down here on one breath.", ar: "على مدى آلاف الصيفيات، كان الغوّاصون ينزلون إلى هنا بنَفَس واحد." }, img: "diveSurface" },
  { depth: 8, line: { en: "A stone took them down. A rope, and a friend on deck, brought them back.", ar: "حجرٌ ينزل بهم، وحبلٌ وسَيْبٌ على ظهر السفينة يعيدانهم." }, img: "diveDiver" },
  { depth: 12, line: { en: "At twelve metres, the oysters. One in a thousand holds a pearl.", ar: "على عمق اثني عشر متراً، المحار. وفي واحدة من كل ألف لؤلؤة." }, img: "diveBank" },
];

/* ───────────────────────── Dining, Salt House, days, map ───────────────────────── */

export const DINING: { name: L; when: L; body: L; img: number }[] = [
  {
    name: { en: "The Jetty", ar: "الرصيف" },
    when: { en: "Lunch, 12:30 to 15:30", ar: "الغداء، 12:30 إلى 15:30" },
    body: { en: "The morning's catch, grilled over date-palm wood at the end of the jetty: hammour, safi and prawns with lime, saffron rice and flatbread from the clay oven.", ar: "صيد الصباح مشويّاً على خشب النخيل عند طرف الرصيف: هامور وصافي وروبيان بالليمون، وأرز بالزعفران وخبز من التنور." },
    img: 3,
  },
  {
    name: { en: "The Nakhuda's Table", ar: "مائدة النوخذة" },
    when: { en: "Dinner, 19:30, one sitting", ar: "العشاء، 19:30، جلسة واحدة" },
    body: { en: "One long table under the palms, one menu of the Gulf a night: machboos, saloona, harees on Fridays, and luqaimat with date syrup. Twenty-four seats, so book a day ahead.", ar: "مائدة طويلة تحت النخيل وقائمة واحدة من مطبخ الخليج كل ليلة: مجبوس وصالونة، وهريس يوم الجمعة، ولقيمات بدبس التمر. أربعة وعشرون مقعداً، فاحجز قبل يوم." },
    img: 1,
  },
  {
    name: { en: "Dawn on the roof", ar: "الفجر على السطح" },
    when: { en: "Breakfast, from 06:00", ar: "الإفطار، من الساعة 06:00" },
    body: { en: "Karak and dates as the sun comes up over the water, then balaleet, eggs with saffron, regag bread and the fruit of the season. Included in every stay.", ar: "كرك وتمر مع شروق الشمس فوق الماء، ثم بلاليط وبيض بالزعفران وخبز رقاق وفاكهة الموسم. مشمول في كل إقامة." },
    img: 2,
  },
];

export const RITUALS: { name: L; mins: number; price: number; body: L }[] = [
  { name: { en: "Salt and seaweed", ar: "الملح والطحالب" }, mins: 90, price: 780, body: { en: "A scrub of Gulf sea salt, a seaweed wrap and a long, slow massage.", ar: "تقشير بملح الخليج ولفّ بالطحالب وتدليك طويل هادئ." } },
  { name: { en: "The diver's rest", ar: "راحة الغوّاص" }, mins: 60, price: 560, body: { en: "Deep work on the back and shoulders, the way divers were looked after between dives.", ar: "عمل عميق على الظهر والكتفين، كما كان الغوّاصون يُعتنى بهم بين غطسة وأخرى." } },
  { name: { en: "Rose and nacre", ar: "الورد والصدف" }, mins: 60, price: 620, body: { en: "A facial with Taif rose water and a cool mother-of-pearl shell.", ar: "عناية بالوجه بماء ورد الطائف وصدفة باردة من عرق اللؤلؤ." } },
  { name: { en: "Hammam of the sea", ar: "حمّام البحر" }, mins: 75, price: 690, body: { en: "Steam in the salt-stone dome, a black-soap scrub and cold water from the well.", ar: "بخار في القبّة الحجرية المالحة، وتقشير بالصابون الأسود، وماء بارد من البئر." } },
];

export const DAY: { t: string; name: L; body: L; img: { g: keyof typeof GRID; i: number } | keyof typeof IMG }[] = [
  { t: "05:30", name: { en: "Dawn dive", ar: "غوص الفجر" }, body: { en: "Down to the bank with a free diver while the water is glass.", ar: "إلى الهيرات مع غوّاص حرّ والماء ساكن كالزجاج." }, img: "diveDiver" },
  { t: "07:00", name: { en: "Breakfast on the roof", ar: "الإفطار على السطح" }, body: { en: "Karak, dates and balaleet as the island wakes.", ar: "كرك وتمر وبلاليط والجزيرة تستيقظ." }, img: { g: "dining", i: 2 } },
  { t: "09:00", name: { en: "Mangroves by kayak", ar: "القرم بالقارب" }, body: { en: "Herons, crabs and silence in the green channels.", ar: "مالك الحزين والسرطانات والسكون في القنوات الخضراء." }, img: { g: "experience", i: 0 } },
  { t: "12:30", name: { en: "Lunch at the jetty", ar: "الغداء على الرصيف" }, body: { en: "Whatever the boats brought in, grilled over palm wood.", ar: "ما جاءت به القوارب، مشويّاً على خشب النخيل." }, img: { g: "dining", i: 3 } },
  { t: "15:00", name: { en: "The Salt House", ar: "بيت الملح" }, body: { en: "Steam, salt and the long afternoon.", ar: "بخار وملح وعصر طويل." }, img: { g: "spa", i: 0 } },
  { t: "17:30", name: { en: "Under sail", ar: "تحت الشراع" }, body: { en: "The dhow takes the evening wind around the island.", ar: "تأخذ السفينة ريح المساء حول الجزيرة." }, img: { g: "experience", i: 1 } },
  { t: "19:30", name: { en: "The nahham sings", ar: "يغنّي النهّام" }, body: { en: "The songs the crews sang to keep the divers' rhythm.", ar: "الأغاني التي كانت تضبط إيقاع الغوّاصين." }, img: { g: "dining", i: 1 } },
  { t: "21:30", name: { en: "Stars from the roof", ar: "النجوم من السطح" }, body: { en: "No city light for forty minutes in any direction.", ar: "لا ضوء مدينة على مسافة أربعين دقيقة في كل اتجاه." }, img: "night" },
];

/** Island map hotspots, in a 1000 x 640 drawing. */
export const SPOTS: { id: string; x: number; y: number; name: L; body: L }[] = [
  { id: "jetty", x: 248, y: 404, name: { en: "The jetty", ar: "الرصيف" }, body: { en: "Where the dhow comes in, four times a day.", ar: "حيث ترسو السفينة أربع مرات في اليوم." } },
  { id: "houses", x: 430, y: 300, name: { en: "The merchant houses", ar: "بيوت التجار" }, body: { en: "Six houses, the Merchant's Rooms and the Nakhuda Suites.", ar: "ستة بيوت فيها غرف التاجر وأجنحة النوخذة." } },
  { id: "dana", x: 520, y: 236, name: { en: "Dana Residence", ar: "دار الدانة" }, body: { en: "The merchant's own house, with its wind tower.", ar: "بيت التاجر نفسه، ببرج الرياح." } },
  { id: "villas", x: 640, y: 420, name: { en: "Barasti Villas", ar: "فلل البرستي" }, body: { en: "Six palm-frond villas along the beach.", ar: "ست فلل من السعف على طول الشاطئ." } },
  { id: "lagoon", x: 812, y: 330, name: { en: "Lagoon Pavilions", ar: "أجنحة البحيرة" }, body: { en: "Two pavilions over the lagoon.", ar: "جناحان فوق البحيرة." } },
  { id: "salt", x: 352, y: 214, name: { en: "The Salt House", ar: "بيت الملح" }, body: { en: "Steam dome, treatment rooms and the old well.", ar: "قبّة البخار وغرف العلاج والبئر القديمة." } },
  { id: "mangroves", x: 150, y: 170, name: { en: "Mangroves", ar: "أشجار القرم" }, body: { en: "Kayak channels on the sheltered side.", ar: "قنوات للتجديف على الجانب المحمي." } },
  { id: "bank", x: 905, y: 120, name: { en: "The pearl bank", ar: "الهيرات" }, body: { en: "Twelve metres down, ten minutes by boat.", ar: "على عمق اثني عشر متراً، عشر دقائق بالقارب." } },
];

export const DEPARTURES = [
  { out: "07:00", back: "08:30" },
  { out: "11:00", back: "12:30" },
  { out: "15:00", back: "16:30" },
  { out: "18:30", back: "20:00" },
];

export const FAQ: { q: L; a: L }[] = [
  { q: { en: "Is Hayrat a real hotel?", ar: "هل هيرات فندق حقيقي؟" }, a: { en: "No. Hayrat is a fictional hotel and this is a concept website designed and built by Zenith Dubai to show what a hotel website can do. Nothing here can be booked or paid for.", ar: "لا. هيرات فندق خيالي، وهذا موقع تجريبي صمّمته وبنته زينيث دبي ليُظهر ما يمكن أن يقدّمه موقع فندق. لا يمكن حجز أو دفع أي شيء هنا." } },
  { q: { en: "How do I get to the island?", ar: "كيف أصل إلى الجزيرة؟" }, a: { en: "By dhow from the marina pier, four times a day, in about forty minutes. A private speedboat can be arranged at any hour.", ar: "بالسفينة من رصيف المرسى أربع مرات يومياً، في نحو أربعين دقيقة. ويمكن ترتيب قارب سريع خاص في أي ساعة." } },
  { q: { en: "When is the best time to come?", ar: "ما أفضل وقت للزيارة؟" }, a: { en: "October to April for the weather. June to September is the old diving season: hot, very still, the clearest water of the year and the lowest rates.", ar: "من أكتوبر إلى أبريل لاعتدال الطقس. ومن يونيو إلى سبتمبر موسم الغوص القديم: حارّ وساكن جداً، وأصفى مياه في السنة وأدنى الأسعار." } },
  { q: { en: "Can I dive without experience?", ar: "هل يمكنني الغوص دون خبرة؟" }, a: { en: "Yes. You go down with a free diver as far as you are comfortable, on a line, with a boat above. Most guests snorkel the bank from the surface and that is just as beautiful.", ar: "نعم. تنزل مع غوّاص حرّ إلى العمق الذي يريحك، على حبل وفوقك قارب. ومعظم الضيوف يسبحون فوق الهيرات من السطح، والمشهد بالجمال نفسه." } },
  { q: { en: "Are children welcome?", ar: "هل الأطفال مرحَّب بهم؟" }, a: { en: "In every room except the Lagoon Pavilions, which are for two. The Dana Residence was made for families.", ar: "في جميع الغرف باستثناء أجنحة البحيرة المخصّصة لشخصين. ودار الدانة صُمّمت للعائلات." } },
  { q: { en: "What is included in the rate?", ar: "ماذا يشمل السعر؟" }, a: { en: "Breakfast on the roof, kayaks, the mangrove walk and taxes. The dhow transfer is included in the Lagoon Pavilions and the Dana Residence.", ar: "الإفطار على السطح والقوارب وجولة القرم والضرائب. وانتقال السفينة مشمول في أجنحة البحيرة ودار الدانة." } },
  { q: { en: "Can I cancel?", ar: "هل يمكنني الإلغاء؟" }, a: { en: "In this concept, stays can be cancelled free of charge up to fourteen days before arrival.", ar: "في هذا التصوّر، يمكن إلغاء الإقامة مجاناً حتى أربعة عشر يوماً قبل الوصول." } },
];

/* ───────────────────────── Interface copy ───────────────────────── */

export const UI = {
  en: {
    concept: "Concept",
    skip: "Skip to content",
    conceptLine: "A concept website by Zenith Dubai. Hayrat is fictional.",
    menu: "Menu",
    close: "Close",
    book: "Book",
    nav: { island: "The island", rooms: "Rooms", dive: "The banks", dining: "Dining", salt: "Salt House", days: "A day", map: "Map", arrive: "Getting here", book: "Book a stay" },
    heroKicker: "An island over the old pearl banks of the Gulf",
    heroTitle: ["Forty minutes by dhow.", "A hundred years back."],
    heroBody: "Eighteen rooms in pearl merchants' houses and palm-frond villas, on an island the divers left in 1931.",
    heroCta: "Plan your stay",
    heroDive: "Dive first",
    scroll: "Scroll to dive",
    depth: "Depth",
    surface: "Surface",
    descentEnd: "Then you come up for air, and breakfast.",
    islandTitle: "Hayrat is the old word for the pearl banks.",
    islandBody: [
      "Our island sits on one: a low ridge of coral stone with six houses of the merchants who bought the season's pearls, a sandbank, a lagoon and the mangroves.",
      "We restored the houses with the families who sold them, and built six villas of palm frond on the beach the way the summer houses were built: shade first, then walls.",
    ],
    facts: [
      { n: "18", l: "rooms and villas" },
      { n: "40", l: "minutes by dhow" },
      { n: "12 m", l: "down to the bank" },
      { n: "1931", l: "the last pearling season here" },
    ],
    roomsTitle: "Rooms",
    roomsLead: "Five ways to stay, from a merchant's room to the merchant's own house.",
    from: "From",
    perNight: "a night",
    sqm: "m²",
    guests: "Guests",
    view: "View",
    beds: "Beds",
    size: "Size",
    terrace: "terrace",
    keys: (n: number) => (n === 1 ? "One on the island" : `${n} on the island`),
    seeRoom: "See the room",
    chooseRoom: "Choose this room",
    chosen: "Selected",
    dragHint: "Drag",
    bookTitle: "Book a stay",
    bookLead: "Choose your dates and we show which rooms are free, night by night.",
    checkIn: "Arrive",
    checkOut: "Leave",
    addDates: "Add dates",
    adults: "Adults",
    children: "Children",
    childrenNote: "Under 12",
    nights: (n: number) => (n === 1 ? "1 night" : `${n} nights`),
    minStay: (n: number) => `${n} nights minimum from this date`,
    full: "Full",
    clear: "Clear dates",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    pickDates: "Pick your dates to see prices.",
    soldOutStay: "Full on some of your nights",
    tooMany: "Too many guests for this room",
    total: "Total",
    roomTotal: "Room",
    extras: "Add to your stay",
    included: "Included",
    taxes: "Breakfast, taxes and service included.",
    request: "Request this stay",
    summary: "Your stay",
    edit: "Change",
    noticeTitle: "This is where Hayrat would confirm your stay.",
    noticeBody: "Hayrat is a fictional hotel and this is a concept website by Zenith Dubai, so nothing was booked or charged. If you would like a booking engine like this for your own hotel, tell us below.",
    noticeCta: "Ask Zenith Dubai",
    keep: "Keep exploring",
    diningTitle: "Three tables",
    saltTitle: "The Salt House",
    saltLead: "A steam dome of salt stone, four rooms and the island's old well. Treatments by appointment, every afternoon.",
    mins: "min",
    dayTitle: "A day on Hayrat",
    dayLead: "Drag the sun across the day.",
    mapTitle: "The island",
    mapLead: "Twelve hundred metres end to end. Tap a place.",
    arriveTitle: "Getting here",
    arriveLead: "The dhow leaves the marina pier four times a day. The crossing takes about forty minutes; the last one goes out at sunset.",
    outbound: "To the island",
    inbound: "Back to the pier",
    speedboat: "Private speedboat at any hour, AED 1,800 each way for up to six.",
    banksTitle: "The banks",
    banks: [
      { n: "8,000", l: "years: the age of the oldest pearl found in the Gulf" },
      { n: "June to Sept", l: "the great dive, al ghous al kabir" },
      { n: "1930s", l: "cultured pearls end the trade" },
    ],
    faqTitle: "Questions",
    enquiryTitle: "A website like this, for your hotel",
    enquiryLead: "Hayrat is a concept by Zenith Dubai. We design and build websites with booking engines, room pages and real photography for hotels in the Gulf. Tell us about yours.",
    form: {
      name: "Your name",
      email: "Email",
      interest: "Your hotel or company",
      message: "Message",
      send: "Send",
      sending: "Sending",
      sent: "Thank you. Zenith Dubai will reply within a day.",
      errs: { missing: "Please add your name and email.", email: "That email address does not look right.", rate: "Too many messages from here. Try again later.", invalid: "Something went wrong. Try again.", unavailable: "The form is resting. Email hello@zenithdubaicv.com instead." },
    },
    footerLine: "Forty minutes by dhow. A hundred years back.",
    footerNote: "Hayrat is a fictional hotel. This website is a concept designed and built by Zenith Dubai to show what a hotel website can do. Rooms, prices, dates and photographs are illustrative.",
    backHome: "All rooms",
    roomFacts: "The room",
    roomGallery: "Around the room",
    roomBook: "Check dates for this room",
    otherRooms: "Other rooms",
    lang: "العربية",
  },
  ar: {
    concept: "تصوّر",
    skip: "انتقل إلى المحتوى",
    conceptLine: "موقع تجريبي من زينيث دبي. هيرات فندق خيالي.",
    menu: "القائمة",
    close: "إغلاق",
    book: "احجز",
    nav: { island: "الجزيرة", rooms: "الغرف", dive: "الهيرات", dining: "المطاعم", salt: "بيت الملح", days: "يوم", map: "الخريطة", arrive: "الوصول", book: "احجز إقامة" },
    heroKicker: "جزيرة فوق هيرات اللؤلؤ القديمة في الخليج",
    heroTitle: ["أربعون دقيقة بالسفينة.", "ومئة عام إلى الوراء."],
    heroBody: "ثماني عشرة غرفة في بيوت تجار اللؤلؤ وفلل من سعف النخيل، على جزيرة غادرها الغوّاصون عام 1931.",
    heroCta: "خطّط لإقامتك",
    heroDive: "اغطس أولاً",
    scroll: "مرّر للغوص",
    depth: "العمق",
    surface: "السطح",
    descentEnd: "ثم تصعد لتتنفّس، وتفطر.",
    islandTitle: "الهيرات هي الكلمة القديمة لمغاصات اللؤلؤ.",
    islandBody: [
      "وجزيرتنا تقوم على واحدة منها: سلسلة منخفضة من الحجر المرجاني، فيها ستة بيوت للتجار الذين كانوا يشترون لآلئ الموسم، ولسان رملي وبحيرة وأشجار القرم.",
      "رمّمنا البيوت مع العائلات التي باعتها، وبنينا ست فلل من السعف على الشاطئ كما كانت تُبنى بيوت الصيف: الظلّ أولاً ثم الجدران.",
    ],
    facts: [
      { n: "18", l: "غرفة وفيلا" },
      { n: "40", l: "دقيقة بالسفينة" },
      { n: "12 م", l: "حتى الهيرات" },
      { n: "1931", l: "آخر موسم غوص هنا" },
    ],
    roomsTitle: "الغرف",
    roomsLead: "خمس طرق للإقامة، من غرفة التاجر إلى بيت التاجر نفسه.",
    from: "ابتداءً من",
    perNight: "لليلة",
    sqm: "م²",
    guests: "الضيوف",
    view: "الإطلالة",
    beds: "الأسرّة",
    size: "المساحة",
    terrace: "سطح",
    keys: (n: number) => (n === 1 ? "واحدة على الجزيرة" : `${n} على الجزيرة`),
    seeRoom: "شاهد الغرفة",
    chooseRoom: "اختر هذه الغرفة",
    chosen: "مختارة",
    dragHint: "اسحب",
    bookTitle: "احجز إقامة",
    bookLead: "اختر تواريخك ونُريك الغرف المتاحة ليلةً بليلة.",
    checkIn: "الوصول",
    checkOut: "المغادرة",
    addDates: "أضف التواريخ",
    adults: "البالغون",
    children: "الأطفال",
    childrenNote: "دون 12",
    nights: (n: number) => (n === 1 ? "ليلة واحدة" : n === 2 ? "ليلتان" : n <= 10 ? `${n} ليالٍ` : `${n} ليلة`),
    minStay: (n: number) => `حدّ أدنى ${n} ليالٍ من هذا التاريخ`,
    full: "محجوز",
    clear: "امسح التواريخ",
    prevMonth: "الشهر السابق",
    nextMonth: "الشهر التالي",
    pickDates: "اختر تواريخك لرؤية الأسعار.",
    soldOutStay: "محجوزة في بعض لياليك",
    tooMany: "عدد الضيوف أكبر من سعة الغرفة",
    total: "المجموع",
    roomTotal: "الغرفة",
    extras: "أضف إلى إقامتك",
    included: "مشمول",
    taxes: "الإفطار والضرائب والخدمة مشمولة.",
    request: "اطلب هذه الإقامة",
    summary: "إقامتك",
    edit: "تعديل",
    noticeTitle: "هنا كان هيرات سيؤكّد إقامتك.",
    noticeBody: "هيرات فندق خيالي وهذا موقع تجريبي من زينيث دبي، فلم يُحجز شيء ولم يُدفع شيء. إن أردت محرّك حجز كهذا لفندقك، أخبرنا في الأسفل.",
    noticeCta: "اسأل زينيث دبي",
    keep: "تابع الاستكشاف",
    diningTitle: "ثلاث موائد",
    saltTitle: "بيت الملح",
    saltLead: "قبّة بخار من الحجر المالح وأربع غرف وبئر الجزيرة القديمة. العلاجات بموعد مسبق كل عصر.",
    mins: "دقيقة",
    dayTitle: "يوم في هيرات",
    dayLead: "اسحب الشمس عبر اليوم.",
    mapTitle: "الجزيرة",
    mapLead: "ألف ومئتا متر من طرف إلى طرف. اضغط على مكان.",
    arriveTitle: "الوصول",
    arriveLead: "تغادر السفينة رصيف المرسى أربع مرات يومياً. تستغرق الرحلة نحو أربعين دقيقة، وآخرها عند الغروب.",
    outbound: "إلى الجزيرة",
    inbound: "العودة إلى الرصيف",
    speedboat: "قارب سريع خاص في أي ساعة، 1,800 درهم لكل اتجاه حتى ستة أشخاص.",
    banksTitle: "الهيرات",
    banks: [
      { n: "8,000", l: "عام: عمر أقدم لؤلؤة عُثر عليها في الخليج" },
      { n: "يونيو إلى سبتمبر", l: "موسم الغوص الكبير" },
      { n: "ثلاثينيات القرن العشرين", l: "اللؤلؤ المستزرع ينهي التجارة" },
    ],
    faqTitle: "أسئلة",
    enquiryTitle: "موقع كهذا لفندقك",
    enquiryLead: "هيرات تصوّر من زينيث دبي. نصمّم ونبني مواقع بمحرّكات حجز وصفحات غرف وتصوير حقيقي لفنادق الخليج. أخبرنا عن فندقك.",
    form: {
      name: "اسمك",
      email: "البريد الإلكتروني",
      interest: "فندقك أو شركتك",
      message: "الرسالة",
      send: "أرسل",
      sending: "جارٍ الإرسال",
      sent: "شكراً لك. سترد زينيث دبي خلال يوم.",
      errs: { missing: "أضف اسمك وبريدك الإلكتروني.", email: "يبدو أن البريد الإلكتروني غير صحيح.", rate: "رسائل كثيرة من هنا. حاول لاحقاً.", invalid: "حدث خطأ. حاول مجدداً.", unavailable: "النموذج متوقف الآن. راسلنا على hello@zenithdubaicv.com." },
    },
    footerLine: "أربعون دقيقة بالسفينة. ومئة عام إلى الوراء.",
    footerNote: "هيرات فندق خيالي. هذا الموقع تصوّر صمّمته وبنته زينيث دبي ليُظهر ما يمكن أن يقدّمه موقع فندق. الغرف والأسعار والتواريخ والصور توضيحية.",
    backHome: "كل الغرف",
    roomFacts: "الغرفة",
    roomGallery: "حول الغرفة",
    roomBook: "تحقّق من التواريخ لهذه الغرفة",
    otherRooms: "غرف أخرى",
    lang: "English",
  },
};
export type UIStrings = (typeof UI)["en"];
