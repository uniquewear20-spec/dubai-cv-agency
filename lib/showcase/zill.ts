// ZILL: a fictional architecture and interiors studio for hot climates. A concept website by Zenith
// Dubai. The studio, its projects and its brief are invented; the brief builder works end to end and
// stops at a notice before anything is sent.

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
export const hf = (id: string) => (id ? `${CDN}${id}_min.webp` : "");
const crop = (id: string, W: number, H: number, b: number[]) => `crop:${CDN}${id}_min.webp#${W},${H},${b.join(",")}`;

export const IMG = {
  hero: hf("hf_20261126_153253_673f7f5e-f3ca-47b3-ab4b-ab8b209aa248"),
  courtyard: hf("hf_20261126_153323_5d813cc9-fb22-4505-a2d2-1998aa3ac3fd"),
  guesthouse: hf("hf_20261126_153737_d00ac95c-9951-4d33-b6fa-d67fb6f3163a"),
  shadow: hf("hf_20261126_154130_5211df06-6d8b-4da8-aeda-f06f2029bc86"),
  earthVilla: hf("hf_20261126_154211_86ed8fb4-9dea-49ac-a91f-9cc60973b48e"),
  cafe: hf("hf_20261126_154519_0cb4d86f-2f65-4123-830b-4fa186b09cae"),
  pavilion: hf("hf_20261126_154629_1bb073a1-082f-4ff3-977d-9e560f3898c7"),
  model: hf("hf_20261126_155020_69d1412b-c42d-489f-b749-dfd470c75614"),
};

/** 2x2 grids, each cell cut out in CSS. Filled by the build step from the grid images. */
export const GRID: Record<"materials" | "process" | "interiors" | "details", string[]> = {
  materials: [
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155058_edaed7b2-cab9-4253-b1f2-1d50e7dea83f_min.webp#2048,2048,4,4,998,998",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155058_edaed7b2-cab9-4253-b1f2-1d50e7dea83f_min.webp#2048,2048,1047,4,997,998",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155058_edaed7b2-cab9-4253-b1f2-1d50e7dea83f_min.webp#2048,2048,4,1047,998,997",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155058_edaed7b2-cab9-4253-b1f2-1d50e7dea83f_min.webp#2048,2048,1047,1047,997,997",
  ],
  process: [
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155557_1760b579-0600-434a-9105-0873ab8c6311_min.webp#2048,2048,33,33,971,970",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155557_1760b579-0600-434a-9105-0873ab8c6311_min.webp#2048,2048,1045,33,970,970",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155557_1760b579-0600-434a-9105-0873ab8c6311_min.webp#2048,2048,33,1044,971,971",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155557_1760b579-0600-434a-9105-0873ab8c6311_min.webp#2048,2048,1044,1044,971,971",
  ],
  interiors: [
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155631_5087e821-4fad-46e3-bc9b-0739e5b99141_min.webp#1760,2352,4,4,864,1159",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155631_5087e821-4fad-46e3-bc9b-0739e5b99141_min.webp#1760,2352,894,4,862,1159",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155631_5087e821-4fad-46e3-bc9b-0739e5b99141_min.webp#1760,2352,4,1190,864,1158",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155631_5087e821-4fad-46e3-bc9b-0739e5b99141_min.webp#1760,2352,894,1190,862,1158",
  ],
  details: [
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155958_189328b0-20f7-42c1-a329-5db036ba938d_min.webp#2720,1536,4,4,1338,751",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155958_189328b0-20f7-42c1-a329-5db036ba938d_min.webp#2720,1536,1384,4,1332,750",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155958_189328b0-20f7-42c1-a329-5db036ba938d_min.webp#2720,1536,4,793,1339,739",
    "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_155958_189328b0-20f7-42c1-a329-5db036ba938d_min.webp#2720,1536,1383,793,1333,739",
  ],
};
export const GRID_SRC = {
  materials: "hf_20261126_155058_edaed7b2-cab9-4253-b1f2-1d50e7dea83f",
  process: "hf_20261126_155557_1760b579-0600-434a-9105-0873ab8c6311",
  interiors: "hf_20261126_155631_5087e821-4fad-46e3-bc9b-0739e5b99141",
  details: "hf_20261126_155958_189328b0-20f7-42c1-a329-5db036ba938d",
};
export { crop };

/** What each photograph shows, for screen readers, in both languages. */
export const ALT: Record<keyof typeof IMG, L> = {
  hero: { en: "A courtyard house with thick sand-coloured walls and a terracotta screen at golden hour", ar: "بيت بفناء داخلي بجدران سميكة بلون الرمل وحاجز من الطين المحروق عند الغروب" },
  courtyard: { en: "The shaded courtyard: a long narrow pool and one olive tree", ar: "الفناء المظلّل: بركة طويلة ضيقة وشجرة زيتون واحدة" },
  guesthouse: { en: "Three stone rooms with wind towers in the mountains at dawn", ar: "ثلاث غرف حجرية بأبراج رياح في الجبال عند الفجر" },
  shadow: { en: "Hard sunlight through a perforated screen on a plaster wall", ar: "ضوء الشمس الحاد عبر حاجز مثقّب على جدار من الجير" },
  earthVilla: { en: "A rammed-earth villa with layered ochre walls above the sea", ar: "فيلا من التراب المدكوك بجدران مطبّقة بلون المغرة فوق البحر" },
  cafe: { en: "A café under a deep plaster arcade with stripes of sunlight", ar: "مقهى تحت رواق عميق من الجير وخطوط من ضوء الشمس" },
  pavilion: { en: "A round concrete pavilion in the dunes at night under the stars", ar: "جناح دائري من الخرسانة بين الكثبان ليلاً تحت النجوم" },
  model: { en: "A white card model of the courtyard house, lifted apart in layers", ar: "نموذج من الورق المقوّى الأبيض لبيت الفناء، مرفوع طبقات" },
};
export const GRID_ALT: Record<keyof typeof GRID, L[]> = {
  materials: [
    { en: "Rammed earth in fine layers of ochre, rose and sand", ar: "تراب مدكوك في طبقات رقيقة بلون المغرة والوردي والرمل" },
    { en: "Hand-trowelled lime plaster", ar: "لياسة جير مسوّاة باليد" },
    { en: "A terracotta block screen with light behind it", ar: "حاجز من طوب الطين المحروق والضوء خلفه" },
    { en: "Oiled oak with a brass hinge", ar: "خشب بلوط مزيت بمفصّلة نحاسية" },
  ],
  process: [
    { en: "A pencil section of a courtyard house on tracing paper", ar: "مقطع بالقلم لبيت بفناء على ورق شفاف" },
    { en: "A card model under a lamp", ar: "نموذج من الورق المقوّى تحت مصباح" },
    { en: "A sample board of earth, plaster, terracotta and oak", ar: "لوحة عينات من التراب والجير والطين المحروق والبلوط" },
    { en: "Hands holding a small earth sample", ar: "يدان تمسكان عينة صغيرة من التراب" },
  ],
  interiors: [
    { en: "A double-height living room opening onto the courtyard", ar: "غرفة معيشة بارتفاع طابقين تنفتح على الفناء" },
    { en: "A stone stair along a plaster wall in a shaft of light", ar: "درج حجري بمحاذاة جدار من الجير في شعاع ضوء" },
    { en: "A kitchen with a long stone counter and a deep window", ar: "مطبخ بطاولة حجرية طويلة ونافذة عميقة" },
    { en: "A bedroom with a low oak bed and dotted light from a screen", ar: "غرفة نوم بسرير منخفض من البلوط وضوء منقّط من حاجز" },
  ],
  details: [
    { en: "The top of a wind tower against the sky", ar: "قمة برج رياح على خلفية السماء" },
    { en: "A deep window reveal with a timber shutter", ar: "نافذة عميقة في الجدار بمصراع خشبي" },
    { en: "A stone water channel through a courtyard", ar: "قناة ماء حجرية تعبر فناءً" },
    { en: "A curved plaster bench in a shaded corner", ar: "مقعد منحنٍ من الجير في زاوية مظلّلة" },
  ],
};
const TOKEN: Record<string, keyof typeof GRID> = { i: "interiors", d: "details", m: "materials", p: "process" };
/** A gallery token is an IMG key ("courtyard") or a grid cell ("i:0" = interiors, first cell). */
export function token(t: string): { src: string; alt: L } {
  const [k, n] = t.split(":");
  if (n !== undefined && TOKEN[k]) return { src: GRID[TOKEN[k]][Number(n)] ?? "", alt: GRID_ALT[TOKEN[k]][Number(n)] };
  const key = t as keyof typeof IMG;
  return { src: IMG[key] ?? "", alt: ALT[key] ?? { en: "", ar: "" } };
}
export type CellRef = { g: keyof typeof GRID; i: number };
export const cell = (r: CellRef) => GRID[r.g][r.i] ?? "";

/* ───────────────────────── Principles ───────────────────────── */

export const PRINCIPLES: { id: "shade" | "mass" | "air" | "water"; name: L; body: L }[] = [
  {
    id: "shade",
    name: { en: "Shade before glass", ar: "الظل قبل الزجاج" },
    body: {
      en: "We place the shade first and the openings second. A window the sun never reaches costs nothing to cool.",
      ar: "نضع الظل أولاً ثم الفتحات. النافذة التي لا تصلها الشمس لا تكلّف شيئاً لتبريدها.",
    },
  },
  {
    id: "mass",
    name: { en: "Walls that hold the night", ar: "جدران تحفظ برودة الليل" },
    body: {
      en: "Thick earth and lime walls take the day's heat slowly and give it back after dark, when the house can breathe.",
      ar: "الجدران السميكة من التراب والجير تمتص حرارة النهار ببطء، وتعيدها بعد الغروب حين يتنفس البيت.",
    },
  },
  {
    id: "air",
    name: { en: "Air that moves on its own", ar: "هواء يتحرك من تلقاء نفسه" },
    body: {
      en: "Courtyards, wind towers and high vents set up a draught, so fans and machines do less of the work.",
      ar: "الأفنية وأبراج الرياح والفتحات العالية تصنع تياراً، فتقلّ حاجة البيت إلى المراوح والأجهزة.",
    },
  },
  {
    id: "water",
    name: { en: "Water you can hear", ar: "ماء تسمعه" },
    body: {
      en: "A narrow pool or a channel in the shade cools the air around it and the people sitting beside it.",
      ar: "بركة ضيقة أو قناة ماء في الظل تبرّد الهواء حولها ومن يجلس بجانبها.",
    },
  },
];

/* ───────────────────────── The exploded house ───────────────────────── */

export const LAYERS: { name: L; note: L }[] = [
  {
    name: { en: "Plinth", ar: "القاعدة" },
    note: { en: "Raised 45 cm above the sand on a ventilated stone base.", ar: "مرفوعة 45 سم عن الرمل على قاعدة حجرية مهوّاة." },
  },
  {
    name: { en: "Ground floor", ar: "الطابق الأرضي" },
    note: { en: "60 cm rammed-earth walls around an 8 by 8 m courtyard.", ar: "جدران من التراب المدكوك بسماكة 60 سم حول فناء 8 × 8 أمتار." },
  },
  {
    name: { en: "Courtyard", ar: "الفناء" },
    note: { en: "A 14 m pool runs north to south under one olive tree.", ar: "بركة بطول 14 متراً تمتد من الشمال إلى الجنوب تحت شجرة زيتون واحدة." },
  },
  {
    name: { en: "Upper floor", ar: "الطابق العلوي" },
    note: { en: "Bedrooms on the north and east, where the walls stay in shade.", ar: "غرف النوم في الشمال والشرق حيث تبقى الجدران في الظل." },
  },
  {
    name: { en: "Roof and wind tower", ar: "السقف وبرج الرياح" },
    note: { en: "The tower catches the north-west breeze and draws it down through the stair.", ar: "يلتقط البرج نسيم الشمال الغربي ويسحبه إلى الأسفل عبر الدرج." },
  },
  {
    name: { en: "Screen", ar: "الحاجز المثقّب" },
    note: { en: "Terracotta blocks shade the west wall and leave a lace of light inside.", ar: "طوب الطين المحروق يظلّل الجدار الغربي ويترك داخله دانتيلاً من الضوء." },
  },
];

/* ───────────────────────── Sun study ───────────────────────── */

export const LAT = 25.2; // Dubai
export const COURT = 8; // courtyard side, metres
export const WALL = { south: 4, west: 4, north: 8, east: 8 }; // wall heights, metres

export const DAYS: { id: string; doy: number; name: L }[] = [
  { id: "jun", doy: 172, name: { en: "21 June", ar: "21 يونيو" } },
  { id: "mar", doy: 80, name: { en: "21 March", ar: "21 مارس" } },
  { id: "dec", doy: 355, name: { en: "21 December", ar: "21 ديسمبر" } },
];

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Sun altitude and azimuth (degrees, azimuth clockwise from north) for solar time in hours. */
export function sun(doy: number, hour: number, lat = LAT) {
  const dec = 23.44 * Math.sin(rad((360 / 365) * (doy - 81)));
  const H = rad(15 * (hour - 12));
  const phi = rad(lat);
  const d = rad(dec);
  const alt = Math.asin(Math.sin(phi) * Math.sin(d) + Math.cos(phi) * Math.cos(d) * Math.cos(H));
  const azS = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(d) * Math.cos(phi));
  return { alt: deg(alt), az: (deg(azS) + 180 + 360) % 360 };
}

/** The olive tree in plan (metres; x grows east, y grows south) with its canopy height and radius. */
export const TREE = { x: 10, y: 9, h: 3.6, r: 1.9 };
/** The courtyard in plan: the house is 0 to 20 m on both axes, the courtyard 6 to 14. */
export const C0 = 6;
export const C1 = 6 + COURT;

/**
 * What the sun does to the courtyard floor. The walls leave one lit rectangle (exact for walls of
 * one height, close otherwise); the olive tree adds an ellipse of shade pushed away from the sun.
 * share is the part of the floor in shade, walls and tree together, sampled on a 40 x 40 grid.
 */
export function courtyardShade(doy: number, hour: number) {
  const { alt, az } = sun(doy, hour);
  if (alt <= 0.5) return { alt, az, up: false as const, lit: null, tree: null, share: 1 };
  const cot = 1 / Math.tan(rad(alt));
  const sx = Math.sin(rad(az)); // east component, towards the sun
  const sy = Math.cos(rad(az)); // north component, towards the sun
  const fromY = sy < 0 ? "south" : "north";
  const fromX = sx > 0 ? "east" : "west";
  const dY = Math.min(COURT, WALL[fromY] * cot * Math.abs(sy));
  const dX = Math.min(COURT, WALL[fromX] * cot * Math.abs(sx));
  const lit = {
    x0: fromX === "west" ? C0 + dX : C0,
    x1: fromX === "east" ? C1 - dX : C1,
    y0: fromY === "north" ? C0 + dY : C0,
    y1: fromY === "south" ? C1 - dY : C1,
  };
  // away from the sun, in plan (y grows south)
  const ux = -sx;
  const uy = sy;
  const tree = {
    cx: TREE.x + ux * TREE.h * cot,
    cy: TREE.y + uy * TREE.h * cot,
    a: TREE.r / Math.sin(rad(alt)),
    b: TREE.r,
    angle: deg(Math.atan2(uy, ux)),
  };
  const N = 40;
  let s = 0;
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      const x = C0 + ((i + 0.5) * COURT) / N;
      const y = C0 + ((j + 0.5) * COURT) / N;
      if (!(x > lit.x0 && x < lit.x1 && y > lit.y0 && y < lit.y1)) {
        s++;
        continue;
      }
      const dx = x - tree.cx;
      const dy = y - tree.cy;
      const p = dx * ux + dy * uy;
      const q = -dx * uy + dy * ux;
      if ((p * p) / (tree.a * tree.a) + (q * q) / (tree.b * tree.b) <= 1) s++;
    }
  return { alt, az, up: true as const, lit, tree, share: s / (N * N) };
}

/** Right now in Dubai (UTC+4, 55.27 E): clock time, solar time, day of the year and the sun. */
export function dubaiNow(d = new Date()) {
  const local = new Date(d.getTime() + 4 * 3600e3);
  const doy = Math.floor((local.getTime() - Date.UTC(local.getUTCFullYear(), 0, 0)) / 864e5);
  const B = rad((360 / 365) * (doy - 81));
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const utc = d.getUTCHours() + d.getUTCMinutes() / 60;
  const solar = (((utc + 55.27 / 15 + eot / 60) % 24) + 24) % 24;
  const clock = `${String(local.getUTCHours()).padStart(2, "0")}:${String(local.getUTCMinutes()).padStart(2, "0")}`;
  return { doy, solar, clock, ...sun(doy, solar) };
}

/** Eight compass points, clockwise from north. */
export const COMPASS: Record<Lang, string[]> = {
  en: ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"],
  ar: ["الشمال", "الشمال الشرقي", "الشرق", "الجنوب الشرقي", "الجنوب", "الجنوب الغربي", "الغرب", "الشمال الغربي"],
};
export const compass = (az: number, lang: Lang) => COMPASS[lang][Math.round((((az % 360) + 360) % 360) / 45) % 8];

export const fmtHour = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

/* ───────────────────────── Projects ───────────────────────── */

export interface Project {
  slug: string;
  name: L;
  place: L;
  kind: L;
  area: string;
  img: string;
  gallery: string[];
  moves: L[];
  body: L;
}

export const PROJECTS: Project[] = [
  {
    slug: "courtyard-house",
    name: { en: "Courtyard House", ar: "بيت الفناء" },
    place: { en: "Al Khawaneej, Dubai", ar: "الخوانيج، دبي" },
    kind: { en: "House", ar: "سكن" },
    area: "640 m²",
    img: "hero",
    gallery: ["courtyard", "i:0", "i:1", "i:2", "i:3", "shadow"],
    moves: [
      { en: "8 by 8 m courtyard, two-thirds in shade by 15:00 in June", ar: "فناء 8 × 8 أمتار، ثلثاه في الظل عند الثالثة عصراً في يونيو" },
      { en: "Rammed-earth walls, 60 cm", ar: "جدران من التراب المدكوك بسماكة 60 سم" },
      { en: "Wind tower over the stair", ar: "برج رياح فوق الدرج" },
      { en: "Terracotta screen on the west", ar: "حاجز من الطين المحروق على الغرب" },
    ],
    body: {
      en: "A family house turned inward. From the street it is almost blank; inside, every room opens onto the courtyard, the pool and the tree. The upper floor sits only on the north and east, so the bedrooms keep their outer walls out of the afternoon sun and the winter sun still reaches the courtyard floor.",
      ar: "بيت عائلي يلتفت إلى الداخل. من الشارع يبدو شبه مغلق، ومن الداخل تنفتح كل الغرف على الفناء والبركة والشجرة. يقع الطابق العلوي على الشمال والشرق فقط، فتبقى الجدران الخارجية لغرف النوم بعيدة عن شمس العصر، وتصل شمس الشتاء إلى أرض الفناء.",
    },
  },
  {
    slug: "mountain-guesthouse",
    name: { en: "Wadi Guesthouse", ar: "استراحة الوادي" },
    place: { en: "Hajar Mountains", ar: "جبال الحجر" },
    kind: { en: "Hospitality", ar: "ضيافة" },
    area: "410 m²",
    img: "guesthouse",
    gallery: ["guesthouse", "d:0", "d:1"],
    moves: [
      { en: "Three rooms, three wind towers", ar: "ثلاث غرف، ثلاثة أبراج رياح" },
      { en: "Local stone from the site", ar: "حجر محلي من الموقع" },
      { en: "Terraces facing the dry riverbed", ar: "شرفات تطل على مجرى الوادي الجاف" },
    ],
    body: {
      en: "Three stone rooms set back from a dry riverbed, each under its own tower. The stone came out of the ground the rooms stand on.",
      ar: "ثلاث غرف حجرية مرتدة عن مجرى وادٍ جاف، تحت كل واحدة برجها. الحجر خرج من الأرض التي تقوم عليها الغرف.",
    },
  },
  {
    slug: "earth-villa",
    name: { en: "Earth Villa", ar: "فيلا التراب" },
    place: { en: "Souss, Morocco", ar: "سوس، المغرب" },
    kind: { en: "House", ar: "سكن" },
    area: "380 m²",
    img: "earthVilla",
    gallery: ["earthVilla", "m:0", "d:3"],
    moves: [
      { en: "Rammed earth in three local soils", ar: "تراب مدكوك من ثلاث تربات محلية" },
      { en: "A 3 m roof overhang to the south", ar: "بروز سقف بعمق 3 أمتار جهة الجنوب" },
      { en: "Argan trees kept where they stood", ar: "أشجار الأركان بقيت في أماكنها" },
    ],
    body: {
      en: "A long villa above the Atlantic, built from the earth dug for its foundations. The layers of the walls follow the colours of the hill.",
      ar: "فيلا طويلة فوق المحيط الأطلسي، بُنيت من التراب الذي حُفر لأساساتها. طبقات جدرانها تتبع ألوان التلة.",
    },
  },
  {
    slug: "arcade-cafe",
    name: { en: "Arcade Café", ar: "مقهى الرواق" },
    place: { en: "Jumeirah, Dubai", ar: "جميرا، دبي" },
    kind: { en: "Interior", ar: "تصميم داخلي" },
    area: "220 m²",
    img: "cafe",
    gallery: ["cafe", "m:2", "m:3"],
    moves: [
      { en: "A 4 m deep arcade on the street side", ar: "رواق بعمق 4 أمتار على جهة الشارع" },
      { en: "Timber screen for stripes of light", ar: "حاجز خشبي يصنع خطوطاً من الضوء" },
      { en: "Terrazzo and oak", ar: "تيرازو وخشب البلوط" },
    ],
    body: {
      en: "A café that starts outside. The arcade is where most people sit, in shade, with the street a step away.",
      ar: "مقهى يبدأ من الخارج. الرواق هو حيث يجلس معظم الناس، في الظل، والشارع على بُعد خطوة.",
    },
  },
  {
    slug: "desert-pavilion",
    name: { en: "Night Pavilion", ar: "جناح الليل" },
    place: { en: "Al Qudra desert", ar: "صحراء القدرة" },
    kind: { en: "Pavilion", ar: "جناح" },
    area: "90 m²",
    img: "pavilion",
    gallery: ["pavilion", "d:2"],
    moves: [
      { en: "An open oculus over a ring bench", ar: "فتحة سماوية فوق مقعد دائري" },
      { en: "Concrete cast with desert sand", ar: "خرسانة مصبوبة برمل الصحراء" },
      { en: "No light pollution after 21:00", ar: "لا تلوث ضوئي بعد التاسعة مساءً" },
    ],
    body: {
      en: "A ring of concrete in the dunes for looking at the sky. During the day it is a shaded seat; at night the oculus frames the stars.",
      ar: "حلقة من الخرسانة بين الكثبان للنظر إلى السماء. نهاراً هي مقعد مظلّل، وليلاً تؤطّر الفتحة النجوم.",
    },
  },
];

export const MATERIALS: { name: L; body: L }[] = [
  { name: { en: "Rammed earth", ar: "التراب المدكوك" }, body: { en: "Soil from the site, pressed in layers. Each wall keeps the hill's colours.", ar: "تربة الموقع مضغوطة في طبقات. يحتفظ كل جدار بألوان التلة." } },
  { name: { en: "Lime plaster", ar: "لياسة الجير" }, body: { en: "Breathes, takes the heat slowly, and is repaired with the same lime.", ar: "تتنفس، وتمتص الحرارة ببطء، وتُرمَّم بالجير نفسه." } },
  { name: { en: "Terracotta screen", ar: "حاجز الطين المحروق" }, body: { en: "Fired blocks laid open: shade outside, light inside.", ar: "طوب محروق بفتحات: ظل في الخارج وضوء في الداخل." } },
  { name: { en: "Oiled oak", ar: "بلوط مزيت" }, body: { en: "For everything the hand touches: doors, shutters, rails.", ar: "لكل ما تلمسه اليد: الأبواب والمصاريع والدرابزين." } },
];

export const PROCESS: { name: L; body: L; weeks: L }[] = [
  { name: { en: "Brief and site", ar: "المتطلبات والموقع" }, body: { en: "We walk the site at noon and at dusk, and write down how you live.", ar: "نزور الموقع ظهراً وعند الغروب، ونكتب كيف تعيشون." }, weeks: { en: "2 weeks", ar: "أسبوعان" } },
  { name: { en: "Sun and sketch", ar: "الشمس والرسم" }, body: { en: "Card models under a lamp until the courtyard is in shade when you need it.", ar: "نماذج من الورق المقوّى تحت مصباح حتى يصبح الفناء في الظل حين تحتاجونه." }, weeks: { en: "4 to 6 weeks", ar: "4 إلى 6 أسابيع" } },
  { name: { en: "Materials", ar: "المواد" }, body: { en: "Samples from the site's own soil, plaster trials, the screen block.", ar: "عينات من تربة الموقع، وتجارب اللياسة، وطوبة الحاجز." }, weeks: { en: "6 to 10 weeks", ar: "6 إلى 10 أسابيع" } },
  { name: { en: "On site", ar: "في الموقع" }, body: { en: "We stay through the build, with the builders and the hands that hold the earth.", ar: "نبقى طوال البناء، مع البنّائين والأيدي التي تمسك التراب." }, weeks: { en: "Until the keys", ar: "حتى تسليم المفاتيح" } },
];

/* ───────────────────────── Brief builder ───────────────────────── */

export const KINDS = [
  { id: "house", name: { en: "A house", ar: "بيت" } },
  { id: "interior", name: { en: "An interior", ar: "تصميم داخلي" } },
  { id: "hospitality", name: { en: "Hospitality", ar: "ضيافة" } },
  { id: "pavilion", name: { en: "A pavilion or garden", ar: "جناح أو حديقة" } },
] as const;
export const PLACES = [
  { id: "uae-coast", name: { en: "UAE coast", ar: "ساحل الإمارات" } },
  { id: "uae-desert", name: { en: "UAE desert or mountains", ar: "صحراء أو جبال الإمارات" } },
  { id: "oman", name: { en: "Oman", ar: "عُمان" } },
  { id: "morocco", name: { en: "Morocco", ar: "المغرب" } },
  { id: "elsewhere", name: { en: "Somewhere else hot", ar: "مكان حار آخر" } },
] as const;
export const PRIORITIES = [
  { id: "shade", name: { en: "Shade outside", ar: "ظل في الخارج" } },
  { id: "privacy", name: { en: "Privacy", ar: "الخصوصية" } },
  { id: "air", name: { en: "Fresh air without machines", ar: "هواء نقي دون أجهزة" } },
  { id: "water", name: { en: "Water in the garden", ar: "ماء في الحديقة" } },
  { id: "local", name: { en: "Local materials", ar: "مواد محلية" } },
  { id: "energy", name: { en: "Low energy bills", ar: "فواتير طاقة منخفضة" } },
] as const;
export const STARTS = [
  { id: "now", name: { en: "As soon as possible", ar: "في أقرب وقت" } },
  { id: "soon", name: { en: "In 3 to 6 months", ar: "خلال 3 إلى 6 أشهر" } },
  { id: "later", name: { en: "Later, just exploring", ar: "لاحقاً، مجرد استكشاف" } },
] as const;

export interface Brief {
  kind: string;
  place: string;
  size: number;
  priorities: string[];
  start: string;
  name: string;
}
export const EMPTY_BRIEF: Brief = { kind: "house", place: "uae-coast", size: 450, priorities: ["shade", "air"], start: "soon", name: "" };

const ADVICE: Record<string, L> = {
  shade: { en: "Deep overhangs and a courtyard sized to its walls, checked hour by hour.", ar: "بروزات عميقة وفناء بحجم يناسب جدرانه، نراجعه ساعة بساعة." },
  privacy: { en: "Rooms turned to the courtyard, with screens rather than blank walls to the street.", ar: "غرف تلتفت إلى الفناء، مع حواجز مثقبة بدلاً من جدران صمّاء نحو الشارع." },
  air: { en: "A wind tower or a stack vent over the stair, and openings on opposite walls.", ar: "برج رياح أو فتحة تهوية فوق الدرج، وفتحات على جدران متقابلة." },
  water: { en: "A narrow pool in the shaded part of the courtyard, fed by recycled water.", ar: "بركة ضيقة في الجزء المظلّل من الفناء، تتغذى بالمياه المعاد تدويرها." },
  local: { en: "Earth, stone or lime from within 50 km of the site, tested before we draw.", ar: "تراب أو حجر أو جير من مسافة لا تتجاوز 50 كم عن الموقع، نختبره قبل أن نرسم." },
  energy: { en: "Thermal mass on the west, glass on the north, and solar on a roof that shades itself.", ar: "كتلة حرارية على الغرب، وزجاج على الشمال، وطاقة شمسية على سقف يظلل نفسه." },
};
const PLACE_NOTE: Record<string, L> = {
  "uae-coast": { en: "On the coast humidity matters as much as heat: air movement comes first.", ar: "على الساحل تهمّ الرطوبة بقدر الحرارة: حركة الهواء أولاً." },
  "uae-desert": { en: "In the desert, nights are cold: thick walls pay off twice.", ar: "في الصحراء ليالٍ باردة: الجدران السميكة تفيد مرتين." },
  oman: { en: "Between mountain and sea: stone, shade and the evening breeze.", ar: "بين الجبل والبحر: حجر وظل ونسيم المساء." },
  morocco: { en: "Rammed earth and tadelakt have done this job for centuries.", ar: "التراب المدكوك والتادلاكت قاما بهذه المهمة لقرون." },
  elsewhere: { en: "We start with a year of the site's weather before the first sketch.", ar: "نبدأ بسنة من بيانات طقس الموقع قبل الرسم الأول." },
};

export function briefSheet(b: Brief) {
  const factor = b.kind === "interior" ? 0.6 : b.kind === "pavilion" ? 0.5 : 1;
  const concept = Math.round((3 + b.size / 300) * factor);
  const design = Math.round((6 + b.size / 120) * factor);
  return {
    concept: Math.max(2, concept),
    design: Math.max(4, design),
    advice: b.priorities.map((p) => ADVICE[p]).filter(Boolean),
    placeNote: PLACE_NOTE[b.place],
  };
}

/* ───────────────────────── Questions ───────────────────────── */

export const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "Is ZILL a real studio?", ar: "هل زِلّ استوديو حقيقي؟" },
    a: {
      en: "No. ZILL and its projects are fictional: a concept website designed and built by Zenith Dubai. The photographs are AI-generated and no brief is sent anywhere.",
      ar: "لا. زِلّ ومشاريعه من الخيال: موقع تجريبي صمّمته وبنته زينيث دبي. الصور مولّدة بالذكاء الاصطناعي ولا يُرسل أي ملخص إلى أي جهة.",
    },
  },
  {
    q: { en: "Do you only work in hot places?", ar: "هل تعملون في الأماكن الحارة فقط؟" },
    a: { en: "Mostly. Everything we know is about making shade, holding the cool and moving air.", ar: "غالباً. كل ما نعرفه يدور حول صنع الظل وحفظ البرودة وتحريك الهواء." },
  },
  {
    q: { en: "Can a courtyard house work on a small plot?", ar: "هل يصلح بيت الفناء لقطعة أرض صغيرة؟" },
    a: { en: "Yes. Even a 4 by 4 m courtyard changes how a house breathes, if its walls are tall enough to shade it.", ar: "نعم. حتى فناء 4 × 4 أمتار يغيّر طريقة تنفس البيت، إذا كانت جدرانه عالية بما يكفي لتظليله." },
  },
  {
    q: { en: "Is rammed earth allowed by the authorities?", ar: "هل تسمح الجهات المختصة بالتراب المدكوك؟" },
    a: { en: "It depends on the place and the structure. We test the soil and agree the method with the engineer before we commit to it.", ar: "يعتمد على المكان والهيكل. نختبر التربة ونتفق على الطريقة مع المهندس قبل اعتمادها." },
  },
];

/* ───────────────────────── Interface text ───────────────────────── */

export const UI = {
  en: {
    tagline: "Buildings that make their own shade.",
    sub: "ZILL is an architecture and interiors studio for hot climates, working across the Gulf and North Africa.",
    seeWork: "See the work",
    startBrief: "Start a brief",
    nav: { approach: "Approach", house: "The house", sun: "Sun study", work: "Work", brief: "Brief", contact: "Contact" },
    menu: "Menu",
    close: "Close",
    langName: "العربية",
    concept: "Concept website. ZILL is fictional.",
    conceptShort: "Fictional studio",
    approachTitle: "Four things we do before anything else",
    houseTitle: "The Courtyard House, taken apart",
    houseIntro: "Scroll to put it back together, one layer at a time.",
    layer: "Layer",
    skipHouse: "Skip the drawing",
    sunTitle: "Sun study",
    sunIntro: "The same courtyard on three days of the year. Move the hour and watch the shade.",
    hour: "Solar time",
    day: "Day",
    altitude: "Sun height",
    azimuth: "Sun bearing",
    inShade: "of the courtyard in shade",
    night: "The sun is down. The walls give back the day's heat to the night sky.",
    sunLine: (time: string, day: string, pct: number) => `At ${time} on ${day}, ${pct}% of the courtyard is in shade.`,
    north: "N",
    play: "Play the day",
    pause: "Pause",
    today: "Today in Dubai",
    dayChart: "Shade through the day, hour by hour",
    inSun: "In sun",
    inShadeKey: "In shade",
    twoFloors: "Two floors",
    oneFloor: "One floor",
    treeKey: "Olive tree",
    poolKey: "Pool",
    towerKey: "Wind tower",
    sunPath: "The sun's path that day",
    model: "The model the study comes from: one courtyard, two wall heights, one tree. The walls on the north and east are 8 m, on the south and west 4 m.",
    nowLine: (clock: string, alt: number, dir: string) => `In Dubai it is ${clock}. The sun is ${alt}° above the ${dir} horizon.`,
    nightNow: (clock: string) => `In Dubai it is ${clock}. The sun is down and the walls are giving back the day's heat.`,
    nowLink: "See what that does to a courtyard",
    modelTitle: "The same house in card",
    modelBody: "Every project starts as a model under a desk lamp. We move the lamp through the day and cut the walls back until the courtyard is in shade when it matters.",
    shadowCaption: "What a screen does with the afternoon sun.",
    workTitle: "Work",
    workIntro: "Five projects, all in places where the afternoon is the enemy.",
    colProject: "Project",
    colPlace: "Place",
    colKind: "Type",
    prevProject: "Previous project",
    nextProject: "Next project",
    materialsIntro: "Chosen for how they hold heat and how they age.",
    processIntro: "From the first site visit to the keys.",
    contactIntro: "ZILL is fictional, so a message here reaches Zenith Dubai, who designed and built this website.",
    open: "Open project",
    moves: "What makes the shade",
    area: "Area",
    materialsTitle: "Four materials",
    processTitle: "How a project runs",
    detailsTitle: "Details",
    briefTitle: "Start a brief",
    briefIntro: "Tell us the outline. The drawing sheet fills in as you go.",
    kind: "What is it",
    place: "Where",
    size: "Size",
    priorities: "What matters most",
    start: "When",
    yourName: "Your name (optional)",
    sheetTitle: "Brief",
    sheetFor: "For",
    weeksConcept: (n: number) => `Concept in about ${n} weeks`,
    weeksDesign: (n: number) => `Full design in about ${n} more weeks`,
    firstLook: "What we would look at first",
    sendBrief: "Send the brief",
    m2: "m²",
    sizeRef: "Dashed square: the Courtyard House, 640 m², at the same scale",
    pickPriority: "Pick at least one priority.",
    contactTitle: "Talk to the studio",
    noticeTitle: "This is where the brief would be sent",
    noticeBody: "ZILL is a concept website by Zenith Dubai. The studio and its projects are invented, so the brief was not sent anywhere. It is still saved on this page.",
    noticeCta: "Back to the site",
    noticeZenith: "Want a website like this?",
    faqTitle: "Questions",
    footer: "ZILL is a fictional studio. Photographs are AI-generated for this concept.",
    footerBy: "Concept, design and build by Zenith Dubai",
    backToGallery: "All concept websites",
    form: {
      name: "Your name",
      email: "Email",
      interest: "About",
      message: "The project in a few lines",
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
    interests: ["A house", "An interior", "Hospitality", "Something else"],
    skip: "Skip to the brief",
  },
  ar: {
    tagline: "مبانٍ تصنع ظلّها بنفسها.",
    sub: "زِلّ استوديو للعمارة والتصميم الداخلي في المناخات الحارة، يعمل في الخليج وشمال أفريقيا.",
    seeWork: "شاهد الأعمال",
    startBrief: "ابدأ ملخص مشروع",
    nav: { approach: "النهج", house: "البيت", sun: "دراسة الشمس", work: "الأعمال", brief: "الملخص", contact: "تواصل" },
    menu: "القائمة",
    close: "إغلاق",
    langName: "English",
    concept: "موقع تجريبي. زِلّ استوديو خيالي.",
    conceptShort: "استوديو خيالي",
    approachTitle: "أربعة أشياء نفعلها قبل أي شيء",
    houseTitle: "بيت الفناء، مفكّكاً",
    houseIntro: "مرّر لتعيد تركيبه، طبقة بعد طبقة.",
    layer: "الطبقة",
    skipHouse: "تخطَّ الرسم",
    sunTitle: "دراسة الشمس",
    sunIntro: "الفناء نفسه في ثلاثة أيام من السنة. حرّك الساعة وراقب الظل.",
    hour: "التوقيت الشمسي",
    day: "اليوم",
    altitude: "ارتفاع الشمس",
    azimuth: "اتجاه الشمس",
    inShade: "من الفناء في الظل",
    night: "الشمس غائبة. الجدران تعيد حرارة النهار إلى سماء الليل.",
    sunLine: (time: string, day: string, pct: number) => `في الساعة ${time} يوم ${day}، يكون ${pct}٪ من الفناء في الظل.`,
    north: "ش",
    play: "شغّل اليوم",
    pause: "إيقاف",
    today: "اليوم في دبي",
    dayChart: "الظل خلال اليوم، ساعة بساعة",
    inSun: "في الشمس",
    inShadeKey: "في الظل",
    twoFloors: "طابقان",
    oneFloor: "طابق واحد",
    treeKey: "شجرة الزيتون",
    poolKey: "البركة",
    towerKey: "برج الرياح",
    sunPath: "مسار الشمس في ذلك اليوم",
    model: "النموذج الذي تقوم عليه الدراسة: فناء واحد، وارتفاعان للجدران، وشجرة واحدة. جدران الشمال والشرق بارتفاع 8 أمتار، وجدران الجنوب والغرب 4 أمتار.",
    nowLine: (clock: string, alt: number, dir: string) => `الساعة الآن ${clock} في دبي. الشمس على ارتفاع ${alt}° جهة ${dir}.`,
    nightNow: (clock: string) => `الساعة الآن ${clock} في دبي. الشمس غائبة، والجدران تعيد حرارة النهار.`,
    nowLink: "شاهد ما يفعله ذلك بالفناء",
    modelTitle: "البيت نفسه من الورق المقوّى",
    modelBody: "يبدأ كل مشروع نموذجاً تحت مصباح مكتب. نحرّك المصباح عبر ساعات اليوم ونقصّ الجدران حتى يصبح الفناء في الظل حين يهمّ ذلك.",
    shadowCaption: "ما يفعله الحاجز بشمس العصر.",
    workTitle: "الأعمال",
    workIntro: "خمسة مشاريع، كلها في أماكن يكون فيها العصر هو الخصم.",
    colProject: "المشروع",
    colPlace: "المكان",
    colKind: "النوع",
    prevProject: "المشروع السابق",
    nextProject: "المشروع التالي",
    materialsIntro: "اخترناها لطريقة حفظها للحرارة وطريقة تقدّمها في العمر.",
    processIntro: "من أول زيارة للموقع حتى تسليم المفاتيح.",
    contactIntro: "زِلّ استوديو خيالي، لذلك تصل رسالتك هنا إلى زينيث دبي التي صمّمت هذا الموقع وبنته.",
    open: "افتح المشروع",
    moves: "ما الذي يصنع الظل",
    area: "المساحة",
    materialsTitle: "أربع مواد",
    processTitle: "كيف يسير المشروع",
    detailsTitle: "تفاصيل",
    briefTitle: "ابدأ ملخص مشروع",
    briefIntro: "أخبرنا بالخطوط العريضة. تمتلئ ورقة الرسم كلما تقدّمت.",
    kind: "ما هو",
    place: "أين",
    size: "المساحة",
    priorities: "ما الأهم",
    start: "متى",
    yourName: "اسمك (اختياري)",
    sheetTitle: "ملخص",
    sheetFor: "لـ",
    weeksConcept: (n: number) => `الفكرة خلال نحو ${n} أسابيع`,
    weeksDesign: (n: number) => `التصميم الكامل خلال نحو ${n} أسبوعاً إضافياً`,
    firstLook: "ما سننظر إليه أولاً",
    sendBrief: "أرسل الملخص",
    m2: "م²",
    sizeRef: "المربع المتقطع: بيت الفناء، 640 م²، بالمقياس نفسه",
    pickPriority: "اختر أولوية واحدة على الأقل.",
    contactTitle: "تحدّث إلى الاستوديو",
    noticeTitle: "هنا كان سيُرسل الملخص",
    noticeBody: "زِلّ موقع تجريبي من زينيث دبي. الاستوديو ومشاريعه من الخيال، لذلك لم يُرسل الملخص إلى أي جهة. وما زال محفوظاً في هذه الصفحة.",
    noticeCta: "العودة إلى الموقع",
    noticeZenith: "تريد موقعاً كهذا؟",
    faqTitle: "أسئلة",
    footer: "زِلّ استوديو خيالي. الصور مولّدة بالذكاء الاصطناعي لهذا المشروع.",
    footerBy: "الفكرة والتصميم والتنفيذ: زينيث دبي",
    backToGallery: "كل المواقع التجريبية",
    form: {
      name: "اسمك",
      email: "البريد الإلكتروني",
      interest: "الموضوع",
      message: "المشروع في بضعة أسطر",
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
    interests: ["بيت", "تصميم داخلي", "ضيافة", "شيء آخر"],
    skip: "انتقل إلى الملخص",
  },
};
export type UIStrings = (typeof UI)["en"];
