// MAWQID: a fictional fourteen-seat chef's counter around one open hearth in Al Quoz, Dubai.
// A concept website by Zenith Dubai. The menu, prices, seats and availability are invented; the
// reservation works end to end and stops at a notice before anything would be booked or charged.

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
export const hf = (id: string) => (id ? `${CDN}${id}_min.webp` : "");

/** Single photographs, by role (showcase-assets/mawqid-prompts.json). */
export const IMG = {
  heroCounter: hf("hf_20261126_145705_4cca2547-5048-49bb-bbb3-a648b2f5a4e3"),
  heroHands: hf("hf_20261126_145952_9d4dbc68-bb21-4882-8966-c0fcec23f7d4"),
  fire: hf("hf_20261126_150118_309f5347-16fc-4167-9984-06b5acc2d2bf"),
  smoke: hf("hf_20261126_150357_e5fdfe58-c055-4339-ba8a-55e37cd316fa"),
  privateDinner: hf("hf_20261126_151954_729b428e-1737-487d-88b2-43a0b9d806a0"),
  entrance: hf("hf_20261126_152138_65ea46d0-c608-4526-a86a-0e6f3904c212"),
  ash: hf("hf_20261126_152439_3973985d-bf2d-4f8e-a7b5-242ae71a3046"),
  wood: hf("hf_20261126_152607_7f93dde9-9bd2-4e76-9346-19ec15895344"),
};

/** 2x2 grids cut into four files (top-left, top-right, bottom-left, bottom-right). */
export const GRID: Record<"dishesA" | "dishesB" | "dishesC" | "pairing" | "room" | "views", string[]> = {
  dishesA: [
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_150545_fb8d2a96-3e3d-4c38-a36e-df6feb8ee84e_min.webp#2048,2048,4,4,949,943",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_150545_fb8d2a96-3e3d-4c38-a36e-df6feb8ee84e_min.webp#2048,2048,1028,4,1016,943",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_150545_fb8d2a96-3e3d-4c38-a36e-df6feb8ee84e_min.webp#2048,2048,4,1028,949,1016",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_150545_fb8d2a96-3e3d-4c38-a36e-df6feb8ee84e_min.webp#2048,2048,1028,1028,1016,1016",
  ],
  dishesB: [
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_150829_34524967-3960-44ca-a4b1-a85ede4c77a9_min.webp#2048,2048,4,4,1006,1004",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_150829_34524967-3960-44ca-a4b1-a85ede4c77a9_min.webp#2048,2048,1041,4,1003,1004",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_150829_34524967-3960-44ca-a4b1-a85ede4c77a9_min.webp#2048,2048,4,1036,1006,1008",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_150829_34524967-3960-44ca-a4b1-a85ede4c77a9_min.webp#2048,2048,1041,1036,1003,1008",
  ],
  dishesC: [
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151054_283af492-634b-4cbe-bbc5-943beeb23ad5_min.webp#2048,2048,4,4,1016,1016",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151054_283af492-634b-4cbe-bbc5-943beeb23ad5_min.webp#2048,2048,1170,4,874,1016",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151054_283af492-634b-4cbe-bbc5-943beeb23ad5_min.webp#2048,2048,4,1126,1016,918",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151054_283af492-634b-4cbe-bbc5-943beeb23ad5_min.webp#2048,2048,1170,1126,874,918",
  ],
  pairing: [
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151244_b6c62003-11c5-4eb2-91eb-2b22ff55a669_min.webp#2048,2048,4,4,1006,1007",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151244_b6c62003-11c5-4eb2-91eb-2b22ff55a669_min.webp#2048,2048,1038,4,1006,1007",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151244_b6c62003-11c5-4eb2-91eb-2b22ff55a669_min.webp#2048,2048,4,1065,1006,979",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151244_b6c62003-11c5-4eb2-91eb-2b22ff55a669_min.webp#2048,2048,1038,1180,1006,864",
  ],
  room: [
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151513_5c87341b-3804-40f3-bc6f-28a60d4f898d_min.webp#1760,2352,4,4,868,1158",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151513_5c87341b-3804-40f3-bc6f-28a60d4f898d_min.webp#1760,2352,896,4,860,1158",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151513_5c87341b-3804-40f3-bc6f-28a60d4f898d_min.webp#1760,2352,4,1186,868,1162",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151513_5c87341b-3804-40f3-bc6f-28a60d4f898d_min.webp#1760,2352,896,1187,860,1161",
  ],
  views: [
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151657_5a6eb121-3921-45f0-b599-be8a6602082e_min.webp#2720,1536,4,4,1343,751",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151657_5a6eb121-3921-45f0-b599-be8a6602082e_min.webp#2720,1536,1375,4,1341,750",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151657_5a6eb121-3921-45f0-b599-be8a6602082e_min.webp#2720,1536,4,781,1343,751",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_151657_5a6eb121-3921-45f0-b599-be8a6602082e_min.webp#2720,1536,1375,781,1341,751",
  ],
};
export type CellRef = { g: keyof typeof GRID; i: number };
export const cell = (r: CellRef) => GRID[r.g][r.i] ?? "";

/* ───────────────────────── The counter ───────────────────────── */

export const MENU_PRICE = 950;
export const PAIRING_PRICE = 320;
export const DEPOSIT = 250;
export const SEATS = 14;
export const MAX_PARTY = 6;
export const BOOK_AHEAD = 56;

export type SittingId = "early" | "late";
export const SITTINGS: { id: SittingId; time: string; ends: string; name: L }[] = [
  { id: "early", time: "18:30", ends: "21:00", name: { en: "First sitting", ar: "الجلسة الأولى" } },
  { id: "late", time: "21:15", ends: "23:45", name: { en: "Second sitting", ar: "الجلسة الثانية" } },
];

export type Zone = "pass" | "arm" | "curve" | "hearth";
/** Seats 1 to 14 run around the horseshoe, from the pass on one side to the pass on the other. */
export const SEAT_ZONE: Zone[] = ["pass", "pass", "arm", "curve", "curve", "hearth", "hearth", "hearth", "hearth", "curve", "curve", "arm", "pass", "pass"];
export const zoneOf = (seat: number) => SEAT_ZONE[seat - 1];

export const ZONES: Record<Zone, { name: L; note: L; view: CellRef }> = {
  hearth: {
    name: { en: "Facing the hearth", ar: "أمام الموقد" },
    note: {
      en: "Straight into the fire. You feel the heat, and the cooks work the embers in front of you.",
      ar: "مباشرة أمام النار. تشعر بحرارتها، والطهاة يقلّبون الجمر أمامك.",
    },
    view: { g: "views", i: 0 },
  },
  curve: {
    name: { en: "Where the counter turns", ar: "عند انعطاف الكاونتر" },
    note: {
      en: "Best for two. You sit at an angle to each other and can talk without leaning in.",
      ar: "الأنسب لشخصين. تجلسان بزاوية متقابلة وتتحدثان دون أن تميلا.",
    },
    view: { g: "views", i: 1 },
  },
  pass: {
    name: { en: "At the pass", ar: "عند منصة التقديم" },
    note: {
      en: "Every plate is finished at your elbow, a few seconds before it reaches you.",
      ar: "كل طبق يُستكمل بجوار مرفقك، قبل ثوانٍ من وصوله إليك.",
    },
    view: { g: "views", i: 2 },
  },
  arm: {
    name: { en: "Across the fire", ar: "عبر النار" },
    note: {
      en: "The long view, over the flames to the copper hood and the whole room.",
      ar: "المنظر الأوسع، فوق اللهب حتى المظلة النحاسية والمكان كله.",
    },
    view: { g: "views", i: 3 },
  },
};

/* ───────────────────────── Dates and availability ───────────────────────── */

const pad = (n: number) => String(n).padStart(2, "0");
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export function parse(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(s: string, n: number) {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}
export const todayIso = () => iso(new Date());

/** Tuesday to Saturday. Sunday and Monday are for private hire. */
export const isOpenDay = (s: string) => [2, 3, 4, 5, 6].includes(parse(s).getDay());
export function bookable(s: string, today = todayIso()) {
  return s > today && s <= addDays(today, BOOK_AHEAD) && isOpenDay(s);
}

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BUSY: Record<number, number> = { 2: 5, 3: 6, 4: 9, 5: 11, 6: 10 };

/** Seats already taken for a date and sitting. Invented, but the same every time for the same night. */
export function takenSeats(date: string, sitting: SittingId): number[] {
  if (!isOpenDay(date)) return Array.from({ length: SEATS }, (_, i) => i + 1);
  const day = parse(date).getDay();
  const r = rng(hash(`${date}|${sitting}`));
  let target = (BUSY[day] ?? 0) + (sitting === "late" ? 1 : -1) + Math.floor(r() * 5) - 2;
  if ((day === 5 || day === 6) && sitting === "late" && r() < 0.35) target = SEATS;
  target = Math.max(0, Math.min(SEATS, target));
  const taken = new Set<number>();
  let guard = 0;
  while (taken.size < target && guard++ < 300) {
    const size = Math.min(target - taken.size, 1 + Math.floor(r() * 4));
    const start = 1 + Math.floor(r() * (SEATS + 1 - size));
    let free = true;
    for (let k = 0; k < size; k++) if (taken.has(start + k)) free = false;
    if (free) for (let k = 0; k < size; k++) taken.add(start + k);
  }
  for (let s = 1; taken.size < target && s <= SEATS; s++) taken.add(s);
  return [...taken].sort((a, b) => a - b);
}

/** Every first seat of a run of `n` free seats side by side. */
export function freeBlocks(taken: number[], n: number) {
  const out: number[] = [];
  for (let s = 1; s + n - 1 <= SEATS; s++) {
    let ok = true;
    for (let k = 0; k < n; k++) if (taken.includes(s + k)) ok = false;
    if (ok) out.push(s);
  }
  return out;
}

/** The run of seats closest to the middle of the hearth. */
export function bestBlock(taken: number[], n: number): number[] {
  const starts = freeBlocks(taken, n);
  if (!starts.length) return [];
  const mid = (SEATS + 1) / 2;
  const s = starts.reduce((a, b) => (Math.abs(b + (n - 1) / 2 - mid) < Math.abs(a + (n - 1) / 2 - mid) ? b : a));
  return Array.from({ length: n }, (_, k) => s + k);
}

/** The run of `n` seats that includes `seat`, starting there if it fits, otherwise ending there. */
export function blockAt(taken: number[], n: number, seat: number): number[] {
  const starts = freeBlocks(taken, n).filter((s) => seat >= s && seat <= s + n - 1);
  if (!starts.length) return [];
  const s = starts.includes(seat) ? seat : starts.reduce((a, b) => (Math.abs(b - seat) < Math.abs(a - seat) ? b : a));
  return Array.from({ length: n }, (_, k) => s + k);
}

export const seatsLeft = (date: string, sitting: SittingId) => SEATS - takenSeats(date, sitting).length;
export const canSeat = (date: string, sitting: SittingId, n: number) => freeBlocks(takenSeats(date, sitting), n).length > 0;

/** The next night with room for `n`, for the "tonight" line in the hero. */
export function nextOpening(n = 2, from = todayIso()) {
  for (let i = 0; i <= BOOK_AHEAD; i++) {
    const d = addDays(from, i);
    if (i === 0 || !isOpenDay(d)) continue;
    for (const s of SITTINGS) if (canSeat(d, s.id, n)) return { date: d, sitting: s.id, left: seatsLeft(d, s.id) };
  }
  return null;
}

/* ───────────────────────── Reservation ───────────────────────── */

export const DIETS: { id: string; name: L }[] = [
  { id: "shellfish", name: { en: "No shellfish", ar: "بدون قشريات" } },
  { id: "nuts", name: { en: "No nuts", ar: "بدون مكسرات" } },
  { id: "dairy", name: { en: "No dairy", ar: "بدون ألبان" } },
  { id: "gluten", name: { en: "No gluten", ar: "بدون غلوتين" } },
  { id: "raw", name: { en: "Nothing raw or cured", ar: "لا شيء نيئاً أو مُعالجاً" } },
  { id: "vegetarian", name: { en: "Vegetarian menu (72 hours' notice)", ar: "قائمة نباتية (بإشعار قبل 72 ساعة)" } },
];

export const OCCASIONS: { id: string; name: L }[] = [
  { id: "", name: { en: "No occasion", ar: "بلا مناسبة" } },
  { id: "birthday", name: { en: "Birthday", ar: "عيد ميلاد" } },
  { id: "anniversary", name: { en: "Anniversary", ar: "ذكرى سنوية" } },
  { id: "business", name: { en: "Business dinner", ar: "عشاء عمل" } },
  { id: "first", name: { en: "First time at a counter", ar: "المرة الأولى على كاونتر" } },
];

export interface Booking {
  date: string;
  sitting: SittingId | "";
  party: number;
  seats: number[];
  pairing: number;
  diet: string[];
  occasion: string;
  notes: string;
}
export const EMPTY_BOOKING: Booking = { date: "", sitting: "", party: 2, seats: [], pairing: 0, diet: [], occasion: "", notes: "" };

export function quote(b: Booking) {
  const menu = MENU_PRICE * b.party;
  const pairing = PAIRING_PRICE * Math.min(b.pairing, b.party);
  return { menu, pairing, total: menu + pairing, deposit: DEPOSIT * b.party };
}

/** A booking is complete when the seats still fit the night that was picked. */
export function bookingReady(b: Booking) {
  if (!b.date || !b.sitting || b.seats.length !== b.party) return false;
  const taken = takenSeats(b.date, b.sitting);
  return b.seats.every((s) => !taken.includes(s));
}

/* ───────────────────────── Formatting ───────────────────────── */

export const money = (n: number, lang: Lang) => (lang === "ar" ? `${n.toLocaleString("en-US")} درهم` : `AED ${n.toLocaleString("en-US")}`);

export const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
};
export const WEEKDAYS: Record<Lang, string[]> = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ar: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
};
const DAYNAMES: Record<Lang, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
};
export function longDate(s: string, lang: Lang) {
  const d = parse(s);
  return `${DAYNAMES[lang][d.getDay()]} ${d.getDate()} ${MONTHS[lang][d.getMonth()]}`;
}
export function shortDate(s: string, lang: Lang) {
  const d = parse(s);
  return `${WEEKDAYS[lang][d.getDay()]} ${d.getDate()} ${MONTHS[lang][d.getMonth()].slice(0, lang === "en" ? 3 : undefined)}`;
}
export const seatRange = (seats: number[]) =>
  seats.length ? (seats.length === 1 ? `${seats[0]}` : `${seats[0]}–${seats[seats.length - 1]}`) : "";

/* ───────────────────────── The menu ───────────────────────── */

export type Stage = "smoke" | "ember" | "flame" | "ash" | "rest";
export type Wood = "oak" | "olive" | "palm" | "";

export interface Course {
  name: L;
  plate: L;
  stage: Stage;
  heat: number;
  time: L;
  wood: Wood;
  img: CellRef;
}

export const STAGES: Record<Stage, L> = {
  smoke: { en: "Smoke", ar: "دخان" },
  ember: { en: "Embers", ar: "جمر" },
  flame: { en: "Flame", ar: "لهب" },
  ash: { en: "Ash", ar: "رماد" },
  rest: { en: "The fire rests", ar: "النار تستريح" },
};

export const COURSES: Course[] = [
  {
    name: { en: "Bread from the embers", ar: "خبز من الجمر" },
    plate: { en: "Flatbread blistered on the coals, smoked labneh, ghee from the morning's milk", ar: "خبز رقيق ينتفخ على الجمر، لبنة مدخّنة، سمن من حليب الصباح" },
    stage: "ember",
    heat: 450,
    time: { en: "40 seconds", ar: "40 ثانية" },
    wood: "oak",
    img: { g: "dishesA", i: 0 },
  },
  {
    name: { en: "Hamour, palm smoke", ar: "هامور بدخان السعف" },
    plate: { en: "Cured hamour, date vinegar, charred spring onion", ar: "هامور مُعالج، خل التمر، بصل أخضر محروق الأطراف" },
    stage: "smoke",
    heat: 60,
    time: { en: "12 minutes of cold smoke", ar: "12 دقيقة من الدخان البارد" },
    wood: "palm",
    img: { g: "dishesA", i: 1 },
  },
  {
    name: { en: "Beetroot under the ash", ar: "شمندر تحت الرماد" },
    plate: { en: "Beetroot buried in the ash, sumac yoghurt, crushed pistachio", ar: "شمندر مدفون في الرماد، لبن بالسماق، فستق مجروش" },
    stage: "ash",
    heat: 180,
    time: { en: "3 hours", ar: "3 ساعات" },
    wood: "olive",
    img: { g: "dishesA", i: 2 },
  },
  {
    name: { en: "Gulf prawns, black lime", ar: "روبيان الخليج بالليمون الأسود" },
    plate: { en: "Prawns over open flame, black-lime butter, charred lemon", ar: "روبيان على اللهب المباشر، زبدة اللومي، ليمون محروق" },
    stage: "flame",
    heat: 700,
    time: { en: "90 seconds", ar: "90 ثانية" },
    wood: "oak",
    img: { g: "dishesA", i: 3 },
  },
  {
    name: { en: "Okra and tomato", ar: "بامية وطماطم" },
    plate: { en: "Okra charred on iron, blistered tomatoes, toasted cumin, herb oil", ar: "بامية محروقة على الحديد، طماطم متشققة، كمون محمّص، زيت الأعشاب" },
    stage: "flame",
    heat: 520,
    time: { en: "4 minutes", ar: "4 دقائق" },
    wood: "olive",
    img: { g: "dishesB", i: 1 },
  },
  {
    name: { en: "Kingfish in salt and ash", ar: "كنعد في الملح والرماد" },
    plate: { en: "Kingfish baked in a crust of salt and ash, broken open at the counter", ar: "كنعد مخبوز في قشرة من الملح والرماد، تُكسر أمامك على الكاونتر" },
    stage: "ember",
    heat: 320,
    time: { en: "18 minutes", ar: "18 دقيقة" },
    wood: "oak",
    img: { g: "dishesB", i: 0 },
  },
  {
    name: { en: "Aubergine in the coals", ar: "باذنجان في الجمر" },
    plate: { en: "Aubergine roasted directly in the coals, tahini, pomegranate, parsley", ar: "باذنجان مشوي داخل الجمر، طحينة، رمان، بقدونس" },
    stage: "ember",
    heat: 600,
    time: { en: "25 minutes", ar: "25 دقيقة" },
    wood: "olive",
    img: { g: "dishesB", i: 3 },
  },
  {
    name: { en: "Lamb from the pit", ar: "لحم من الحفرة" },
    plate: { en: "Lamb shoulder buried overnight under the hearth, saffron rice cooked in its fat", ar: "كتف لحم مدفون طوال الليل تحت الموقد، أرز بالزعفران مطبوخ بدهنه" },
    stage: "ash",
    heat: 130,
    time: { en: "12 hours", ar: "12 ساعة" },
    wood: "oak",
    img: { g: "dishesB", i: 2 },
  },
  {
    name: { en: "Laban, mint, lime", ar: "لبن ونعناع وليمون" },
    plate: { en: "Frozen yoghurt granita, fresh mint, lime zest. The one cold course.", ar: "غرانيتا اللبن المثلّج، نعناع طازج، قشر الليمون. الطبق البارد الوحيد." },
    stage: "rest",
    heat: -12,
    time: { en: "Frozen that morning", ar: "جُمّد صباح اليوم نفسه" },
    wood: "",
    img: { g: "dishesC", i: 1 },
  },
  {
    name: { en: "Dates in the coals", ar: "تمر في الجمر" },
    plate: { en: "Dates roasted in the last embers, camel-milk ice cream, burnt honey", ar: "تمر محمّص في آخر الجمر، آيس كريم حليب النوق، عسل محروق" },
    stage: "ember",
    heat: 380,
    time: { en: "6 minutes", ar: "6 دقائق" },
    wood: "palm",
    img: { g: "dishesC", i: 0 },
  },
];

export const FINISH: { name: L; plate: L; img: CellRef }[] = [
  { name: { en: "Luqaimat", ar: "لقيمات" }, plate: { en: "Fried in the last of the fire, date syrup, sesame", ar: "تُقلى على آخر النار، دبس التمر، سمسم" }, img: { g: "dishesC", i: 2 } },
  { name: { en: "Gahwa", ar: "قهوة" }, plate: { en: "Light-roast Arabic coffee with cardamom, poured at the counter", ar: "قهوة عربية شقراء بالهيل، تُصبّ على الكاونتر" }, img: { g: "dishesC", i: 3 } },
];

export const WOODS: { id: Wood; name: L; body: L; img: string | CellRef }[] = [
  {
    id: "oak",
    name: { en: "Oak", ar: "البلوط" },
    body: { en: "Burns long and even. It holds the lamb through the night and gives the prawns their flame.", ar: "يحترق طويلاً وبثبات. يحفظ حرارة اللحم طوال الليل ويمنح الروبيان لهبه." },
    img: "fire",
  },
  {
    id: "olive",
    name: { en: "Olive", ar: "الزيتون" },
    body: { en: "Prunings from old groves. A sweeter smoke, for vegetables and the kingfish crust.", ar: "أغصان تقليم من بساتين قديمة. دخان أحلى للخضار ولقشرة الكنعد." },
    img: { g: "room", i: 1 },
  },
  {
    id: "palm",
    name: { en: "Date palm", ar: "سعف النخيل" },
    body: { en: "Dried fronds from the farms. They flare hot and fast, then give the white smoke the hamour sits in.", ar: "سعف يابس من المزارع. يشتعل بسرعة وحرارة، ثم يعطي الدخان الأبيض الذي يستقر فيه الهامور." },
    img: "smoke",
  },
];

export const NIGHT: { t: number; name: L; body: L }[] = [
  { t: -15, name: { en: "The door", ar: "الباب" }, body: { en: "Gahwa and dates at the threshold while the counter fills.", ar: "قهوة وتمر عند العتبة بينما يمتلئ الكاونتر." } },
  { t: 0, name: { en: "The fire is fed", ar: "تُغذّى النار" }, body: { en: "Oak goes on and the first course comes straight out of the embers.", ar: "يوضع البلوط، ويخرج الطبق الأول مباشرة من الجمر." } },
  { t: 40, name: { en: "Smoke and ash", ar: "دخان ورماد" }, body: { en: "Fish goes into the palm smoke. Vegetables come up from under the ash.", ar: "يدخل السمك دخان السعف، وتخرج الخضار من تحت الرماد." } },
  { t: 80, name: { en: "Flame", ar: "اللهب" }, body: { en: "The hottest stretch of the night. Prawns, okra, and the salt crust broken in front of you.", ar: "أشد ساعات الليل حرارة. روبيان وبامية، وقشرة الملح تُكسر أمامك." } },
  { t: 120, name: { en: "The pit", ar: "الحفرة" }, body: { en: "The lamb comes up from twelve hours under the coals.", ar: "يخرج اللحم بعد اثنتي عشرة ساعة تحت الجمر." } },
  { t: 140, name: { en: "The fire rests", ar: "النار تستريح" }, body: { en: "Something cold, then dates roasted in what is left of the embers.", ar: "شيء بارد، ثم تمر يُحمّص فيما تبقّى من الجمر." } },
  { t: 150, name: { en: "Ash", ar: "الرماد" }, body: { en: "Gahwa and luqaimat. Stay at the counter as long as you like.", ar: "قهوة ولقيمات. ابقَ على الكاونتر قدر ما تشاء." } },
];

/** "18:30" plus minutes, as a clock time. */
export function clock(start: string, plus: number) {
  const [h, m] = start.split(":").map(Number);
  const t = (((h * 60 + m + plus) % 1440) + 1440) % 1440;
  return `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
}

export const PAIRING: { name: L; body: L; img: CellRef }[] = [
  { name: { en: "From the shelf", ar: "من الرف" }, body: { en: "Saffron kombucha, citrus and date shrubs, fermented in the kitchen.", ar: "كومبوتشا بالزعفران، وشراب الحمضيات والتمر، مخمّرة في المطبخ." }, img: { g: "pairing", i: 0 } },
  { name: { en: "Poured", ar: "يُصبّ" }, body: { en: "Teas brewed to each course, poured from a height at the counter.", ar: "شاي يُخمّر لكل طبق، ويُصبّ من علوّ على الكاونتر." }, img: { g: "pairing", i: 1 } },
  { name: { en: "Sparkling", ar: "فوّار" }, body: { en: "A dry, sparkling ferment with dried lime for the prawns.", ar: "مشروب مخمّر فوّار وجاف مع الليمون الأسود للروبيان." }, img: { g: "pairing", i: 2 } },
  { name: { en: "The spice drawer", ar: "درج البهارات" }, body: { en: "Black lime, cardamom and saffron, in every glass in some way.", ar: "لومي وهيل وزعفران، في كل كأس بطريقة ما." }, img: { g: "pairing", i: 3 } },
];

/* ───────────────────────── Gift and private hire ───────────────────────── */

export type GiftKind = "one" | "two";
export type GiftFormat = "ecard" | "box";
export interface Gift {
  kind: GiftKind;
  pairing: boolean;
  format: GiftFormat;
  to: string;
  from: string;
  message: string;
}
export const EMPTY_GIFT: Gift = { kind: "two", pairing: false, format: "ecard", to: "", from: "", message: "" };
export const BOX_PRICE = 75;
export function giftTotal(g: Gift) {
  const seats = g.kind === "one" ? 1 : 2;
  return seats * (MENU_PRICE + (g.pairing ? PAIRING_PRICE : 0)) + (g.format === "box" ? BOX_PRICE : 0);
}
export const GIFT_MAX = 140;

export const PRIVATE_FROM = 16500;

/* ───────────────────────── Questions ───────────────────────── */

export const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "Is MAWQID a real restaurant?", ar: "هل موقد مطعم حقيقي؟" },
    a: {
      en: "No. MAWQID is fictional: a concept website designed and built by Zenith Dubai. Nothing here can be booked, and no card is ever asked for.",
      ar: "لا. موقد مطعم خيالي: موقع تجريبي صمّمته وبنته زينيث دبي. لا يمكن حجز أي شيء هنا، ولا يُطلب أي بطاقة دفع.",
    },
  },
  {
    q: { en: "Can the menu change for allergies?", ar: "هل يمكن تعديل القائمة بسبب الحساسية؟" },
    a: {
      en: "Yes. Tell us when you book. Versions without shellfish, nuts, dairy or gluten are cooked every night. The vegetarian menu needs 72 hours' notice.",
      ar: "نعم. أخبرنا عند الحجز. نطهو كل ليلة نسخاً بدون قشريات أو مكسرات أو ألبان أو غلوتين. القائمة النباتية تحتاج إشعاراً قبل 72 ساعة.",
    },
  },
  {
    q: { en: "Can children come?", ar: "هل يمكن حضور الأطفال؟" },
    a: { en: "Guests aged 12 and over. The counter is close to an open fire.", ar: "من عمر 12 سنة فما فوق. الكاونتر قريب من نار مكشوفة." },
  },
  {
    q: { en: "What if we have to cancel?", ar: "ماذا لو اضطررنا للإلغاء؟" },
    a: {
      en: "Free up to 48 hours before. After that the deposit of AED 250 per guest is kept, because the lamb went into the pit the night before.",
      ar: "مجاناً حتى 48 ساعة قبل الموعد. بعدها يُحتفظ بالعربون، 250 درهماً عن كل ضيف، لأن اللحم دُفن في الحفرة في الليلة السابقة.",
    },
  },
  {
    q: { en: "We are more than six.", ar: "نحن أكثر من ستة أشخاص." },
    a: {
      en: "Six is the most we seat along one stretch of the counter. For more, take the whole counter on a Sunday or Monday.",
      ar: "ستة هو أقصى عدد نجلسه متجاورين على الكاونتر. للأكثر، احجز الكاونتر كاملاً يوم أحد أو إثنين.",
    },
  },
  {
    q: { en: "What if we are late?", ar: "ماذا لو تأخرنا؟" },
    a: {
      en: "Seats are held for 15 minutes. The fire does not wait, so courses already served are not cooked again.",
      ar: "نحتفظ بالمقاعد 15 دقيقة. النار لا تنتظر، لذلك لا نعيد طهو الأطباق التي قُدّمت.",
    },
  },
];

/* ───────────────────────── Interface text ───────────────────────── */

export const UI = {
  en: {
    tagline: "Fourteen seats. One fire.",
    sub: "A chef's counter around an open hearth in Al Quoz. Ten courses, cooked over oak, olive and date palm.",
    choose: "Choose your seat",
    seeMenu: "The fire menu",
    nextOpen: "Next seats for two",
    seatsLeft: (n: number) => (n === 1 ? "1 seat left" : `${n} seats left`),
    full: "Full",
    nav: { counter: "The counter", menu: "Menu", reserve: "Reserve", gift: "Gift a seat", private: "Private", visit: "Visit" },
    menuLabel: "Menu",
    close: "Close",
    langName: "العربية",
    concept: "Concept website. MAWQID is fictional.",
    conceptLong: "A concept by Zenith Dubai",
    counterTitle: "A horseshoe of smoked oak, and the hearth in the middle",
    counterBody:
      "Fourteen stools face the fire. There is no gas and no electric hob: everything is cooked over wood, a few feet from you. Two sittings a night, Tuesday to Saturday.",
    facts: [
      { n: "14", l: "seats around the hearth" },
      { n: "2", l: "sittings a night" },
      { n: "10", l: "courses" },
      { n: "3", l: "woods" },
    ],
    hoverSeat: "Point at a seat to see the view from it",
    menuTitle: "The fire menu",
    menuIntro: "Ten courses, each at its own heat. Scroll to move through the night.",
    course: "Course",
    heatAtFood: "Heat at the food",
    onFire: "Over the fire",
    wood: "Wood",
    woods: { oak: "Oak", olive: "Olive", palm: "Date palm", "": "None" },
    toFinish: "To finish",
    perGuest: "per guest",
    skipMenu: "Skip the menu",
    woodsTitle: "Three woods",
    woodsIntro: "The fire is built three times a night, from three woods that burn in different ways.",
    nightTitle: "A night at the counter",
    nightIntro: "Two and a half hours, from the door to the ash.",
    sittingSwitch: "Times for the",
    pairingTitle: "Ferments and teas",
    pairingBody: "Seven glasses made in the kitchen to go with the fire menu. No alcohol.",
    reserveTitle: "Reserve",
    reserveIntro: "Pick a night, a sitting and the seats you want. You see the counter as it is booked.",
    steps: { date: "Night", sitting: "Sitting", party: "Guests", seats: "Seats", extras: "Pairing and notes", ticket: "Your ticket" },
    closed: "Closed",
    noNight: "Choose a night to see the sittings.",
    sittingFull: "Full",
    noBlock: (n: number) => `No ${n} seats side by side are left for this sitting. Try the other sitting or fewer guests.`,
    party: "Guests",
    partyHint: "Up to six together. For more, take the whole counter.",
    seatsHint: (n: number) => `Choose ${n === 1 ? "a seat" : `${n} seats side by side`}. Tap a seat to move your party there.`,
    taken: "Taken",
    yours: "Yours",
    free: "Free",
    viewFrom: "The view from seat",
    pairingFor: "Pairing for",
    guests: (n: number) => (n === 1 ? "1 guest" : `${n} guests`),
    diet: "Allergies and preferences",
    occasion: "Occasion",
    notes: "Anything else",
    notesPh: "A seat for a wheelchair, a birthday plate…",
    ticketTitle: "Kitchen ticket",
    covers: "Covers",
    seatsLbl: "Seats",
    sittingLbl: "Sitting",
    menuLine: (n: number) => `Fire menu × ${n}`,
    pairingLine: (n: number) => `Pairing × ${n}`,
    total: "Total at the counter",
    deposit: "Held now as a deposit",
    request: "Request these seats",
    incomplete: "Pick a night, a sitting and your seats first.",
    changed: "Those seats were just taken. We picked the closest ones still free.",
    giftTitle: "Give a seat at the counter",
    giftIntro: "A card for one or two seats at the fire. Valid for a year, on any night with seats.",
    giftOne: "One seat",
    giftTwo: "Two seats",
    withPairing: "With the pairing",
    format: "Delivered as",
    ecard: "E-card by email",
    box: "Card in a smoked-oak box",
    boxNote: "Collected at the counter or delivered in Dubai",
    to: "For",
    from: "From",
    message: "Message",
    messagePh: "Write a few words. They are printed on the card.",
    giftCta: "Continue to payment",
    giftEmpty: "Add a name for the card.",
    privateTitle: "The whole counter",
    privateBody:
      "On Sundays and Mondays the counter is closed to the public and can be taken whole, for up to fourteen guests, with a menu written for the evening.",
    privateFrom: "Minimum spend from",
    visitTitle: "Find the door",
    address: "Al Quoz Industrial Area 1, Dubai",
    addressNote: "The exact door is sent with your booking. Look for the smoke.",
    hours: "Tuesday to Saturday. Sittings at 18:30 and 21:15.",
    hoursClosed: "Sunday and Monday: private hire only.",
    parking: "Valet parking at the door.",
    faqTitle: "Questions",
    enquiryTitle: "Ask about a private evening",
    form: {
      name: "Your name",
      email: "Email",
      interest: "What it is for",
      message: "Date, guests, what you have in mind",
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
    interests: ["Birthday", "Company dinner", "Celebration", "Something else"],
    noticeTitle: "This is where the booking would be made",
    noticeBody:
      "MAWQID is a concept website by Zenith Dubai. The restaurant, its seats and prices are invented, so nothing has been reserved and no payment was taken. Everything you chose is still saved on this page.",
    noticeCta: "Back to the counter",
    noticeZenith: "Want a website like this?",
    footer: "MAWQID is a fictional restaurant. Photographs are AI-generated for this concept.",
    footerBy: "Concept, design and build by Zenith Dubai",
    backToGallery: "All concept websites",
    skip: "Skip to the reservation",
  },
  ar: {
    tagline: "أربعة عشر مقعداً. ونار واحدة.",
    sub: "كاونتر للطاهي حول موقد مكشوف في القوز. عشرة أطباق تُطهى على خشب البلوط والزيتون وسعف النخيل.",
    choose: "اختر مقعدك",
    seeMenu: "قائمة النار",
    nextOpen: "أقرب مقعدين متاحين",
    seatsLeft: (n: number) => (n === 1 ? "بقي مقعد واحد" : n === 2 ? "بقي مقعدان" : n <= 10 ? `بقيت ${n} مقاعد` : `بقي ${n} مقعداً`),
    full: "محجوز بالكامل",
    nav: { counter: "الكاونتر", menu: "القائمة", reserve: "الحجز", gift: "أهدِ مقعداً", private: "حفلات خاصة", visit: "الزيارة" },
    menuLabel: "القائمة",
    close: "إغلاق",
    langName: "English",
    concept: "موقع تجريبي. موقد مطعم خيالي.",
    conceptLong: "مشروع تجريبي من زينيث دبي",
    counterTitle: "حدوة من خشب البلوط المدخّن، والموقد في وسطها",
    counterBody:
      "أربعة عشر مقعداً تواجه النار. لا غاز ولا مواقد كهربائية: كل شيء يُطهى على الحطب، على بُعد خطوات منك. جلستان كل ليلة، من الثلاثاء إلى السبت.",
    facts: [
      { n: "14", l: "مقعداً حول الموقد" },
      { n: "2", l: "عدد الجلسات في الليلة" },
      { n: "10", l: "أطباق" },
      { n: "3", l: "أنواع من الحطب" },
    ],
    hoverSeat: "أشر إلى مقعد لترى المنظر منه",
    menuTitle: "قائمة النار",
    menuIntro: "عشرة أطباق، لكل منها حرارتها. مرّر لتتنقل عبر الليلة.",
    course: "الطبق",
    heatAtFood: "الحرارة عند الطعام",
    onFire: "على النار",
    wood: "الحطب",
    woods: { oak: "بلوط", olive: "زيتون", palm: "سعف النخيل", "": "بلا حطب" },
    toFinish: "للختام",
    perGuest: "للضيف",
    skipMenu: "تخطَّ القائمة",
    woodsTitle: "ثلاثة أنواع من الحطب",
    woodsIntro: "تُبنى النار ثلاث مرات كل ليلة، من ثلاثة أنواع من الحطب تحترق بطرق مختلفة.",
    nightTitle: "ليلة على الكاونتر",
    nightIntro: "ساعتان ونصف، من الباب حتى الرماد.",
    sittingSwitch: "الأوقات في",
    pairingTitle: "مخمّرات وشاي",
    pairingBody: "سبعة كؤوس تُحضّر في المطبخ لترافق قائمة النار. بدون كحول.",
    reserveTitle: "الحجز",
    reserveIntro: "اختر الليلة والجلسة والمقاعد التي تريدها. ترى الكاونتر كما هو محجوز الآن.",
    steps: { date: "الليلة", sitting: "الجلسة", party: "الضيوف", seats: "المقاعد", extras: "المشروبات والملاحظات", ticket: "تذكرتك" },
    closed: "مغلق",
    noNight: "اختر ليلة لترى الجلسات.",
    sittingFull: "محجوزة",
    noBlock: (n: number) => `لم يبقَ ${n} مقاعد متجاورة في هذه الجلسة. جرّب الجلسة الأخرى أو عدداً أقل.`,
    party: "الضيوف",
    partyHint: "حتى ستة معاً. للأكثر، احجز الكاونتر كاملاً.",
    seatsHint: (n: number) => (n === 1 ? "اختر مقعداً. المس مقعداً لنقل حجزك إليه." : `اختر ${n} مقاعد متجاورة. المس مقعداً لنقل مجموعتك إليه.`),
    taken: "محجوز",
    yours: "لك",
    free: "متاح",
    viewFrom: "المنظر من المقعد",
    pairingFor: "المشروبات لـ",
    guests: (n: number) => (n === 1 ? "ضيف واحد" : n === 2 ? "ضيفين" : `${n} ضيوف`),
    diet: "الحساسية والتفضيلات",
    occasion: "المناسبة",
    notes: "أي شيء آخر",
    notesPh: "مقعد مناسب لكرسي متحرك، طبق لعيد ميلاد…",
    ticketTitle: "تذكرة المطبخ",
    covers: "الضيوف",
    seatsLbl: "المقاعد",
    sittingLbl: "الجلسة",
    menuLine: (n: number) => `قائمة النار × ${n}`,
    pairingLine: (n: number) => `المشروبات × ${n}`,
    total: "المجموع على الكاونتر",
    deposit: "عربون يُحجز الآن",
    request: "اطلب هذه المقاعد",
    incomplete: "اختر الليلة والجلسة ومقاعدك أولاً.",
    changed: "حُجزت تلك المقاعد للتو. اخترنا أقرب المقاعد المتاحة.",
    giftTitle: "أهدِ مقعداً على الكاونتر",
    giftIntro: "بطاقة لمقعد أو مقعدين أمام النار. صالحة لسنة، في أي ليلة فيها مقاعد.",
    giftOne: "مقعد واحد",
    giftTwo: "مقعدان",
    withPairing: "مع المشروبات",
    format: "طريقة التسليم",
    ecard: "بطاقة إلكترونية بالبريد",
    box: "بطاقة في علبة من البلوط المدخّن",
    boxNote: "تُستلم من الكاونتر أو تُوصّل داخل دبي",
    to: "إلى",
    from: "من",
    message: "الرسالة",
    messagePh: "اكتب بضع كلمات. تُطبع على البطاقة.",
    giftCta: "المتابعة إلى الدفع",
    giftEmpty: "أضف اسماً للبطاقة.",
    privateTitle: "الكاونتر كاملاً",
    privateBody:
      "يومي الأحد والإثنين يُغلق الكاونتر أمام الجمهور ويمكن حجزه كاملاً، لما يصل إلى أربعة عشر ضيفاً، مع قائمة تُكتب لتلك الأمسية.",
    privateFrom: "حد أدنى للإنفاق يبدأ من",
    visitTitle: "اعثر على الباب",
    address: "المنطقة الصناعية القوز 1، دبي",
    addressNote: "نرسل لك الباب بالتحديد مع الحجز. ابحث عن الدخان.",
    hours: "من الثلاثاء إلى السبت. الجلسات في 18:30 و21:15.",
    hoursClosed: "الأحد والإثنين: للحفلات الخاصة فقط.",
    parking: "خدمة صفّ السيارات عند الباب.",
    faqTitle: "أسئلة",
    enquiryTitle: "اسأل عن أمسية خاصة",
    form: {
      name: "اسمك",
      email: "البريد الإلكتروني",
      interest: "المناسبة",
      message: "التاريخ وعدد الضيوف وما تفكر فيه",
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
    interests: ["عيد ميلاد", "عشاء شركة", "احتفال", "شيء آخر"],
    noticeTitle: "هنا كان سيتم الحجز",
    noticeBody:
      "موقد موقع تجريبي من زينيث دبي. المطعم ومقاعده وأسعاره من الخيال، لذلك لم يُحجز أي شيء ولم يُدفع أي مبلغ. كل ما اخترته ما زال محفوظاً في هذه الصفحة.",
    noticeCta: "العودة إلى الكاونتر",
    noticeZenith: "تريد موقعاً كهذا؟",
    footer: "موقد مطعم خيالي. الصور مولّدة بالذكاء الاصطناعي لهذا المشروع.",
    footerBy: "الفكرة والتصميم والتنفيذ: زينيث دبي",
    backToGallery: "كل المواقع التجريبية",
    skip: "انتقل إلى الحجز",
  },
};
export type UIStrings = (typeof UI)["en"];
