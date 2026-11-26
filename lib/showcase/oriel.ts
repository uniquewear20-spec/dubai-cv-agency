// ORIEL 88: a fictional 88-storey residential tower on the Dubai Water Canal. A concept website by
// Zenith Dubai. The tower, its homes, prices and availability are invented; the floor picker works
// end to end and stops at a notice before anything is sent.

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
const hf = (id: string) => `${CDN}${id}_min.webp`;
const crop = (id: string, W: number, H: number, boxes: number[][]) => boxes.map((b) => `crop:${CDN}${id}_min.webp#${W},${H},${b.join(",")}`);

export const IMG = {
  hero: hf("hf_20261126_160324_6edfd8c4-6034-4e45-8a9e-9d185965814f"),
  heroTall: hf("hf_20261126_160406_08c7ac18-ad97-4dc3-a2d6-6c116fede5aa"),
  aerial: hf("hf_20261126_160820_1670179e-fd25-48e1-984f-626ab1efb7aa"),
  twilight: hf("hf_20261126_160850_2358cc95-7181-4059-adb6-3cf089e5b088"),
  view: hf("hf_20261126_161720_2eb27350-dbb2-4288-9340-b5ce7b00b4f4"),
  living: hf("hf_20261126_162146_7d8aa77d-59b7-4156-924f-03de601cf1a7"),
};
export const GRID = {
  interiors: crop("hf_20261126_161256_19a994bd-d995-4ce9-993a-e26ab4a3d227", 2720, 1536, [[4, 4, 1342, 750], [1374, 4, 1342, 750], [4, 783, 1342, 749], [1375, 783, 1341, 749]]),
  amenities: crop("hf_20261126_161328_d51b889b-f276-4ce1-a34d-7881410e1c03", 2048, 2048, [[30, 31, 975, 973], [1044, 31, 974, 973], [31, 1044, 974, 973], [1044, 1044, 974, 973]]),
  materials: crop("hf_20261126_161758_e219b2e6-4c4a-4052-8ddf-2cdae13f95d9", 2048, 2048, [[33, 33, 973, 973], [1042, 33, 973, 973], [33, 1042, 973, 971], [1042, 1042, 973, 971]]),
  area: crop("hf_20261126_162224_0d9f0313-4b37-470d-9b81-13745b6647e6", 2720, 1536, [[4, 4, 1349, 762], [1368, 4, 1348, 762], [4, 779, 1349, 753], [1368, 779, 1348, 753]]),
};

export const ALT: Record<keyof typeof IMG, L> = {
  hero: { en: "A bronze-finned residential tower beside the canal at golden hour", ar: "برج سكني بزعانف برونزية بجانب القناة عند الغروب" },
  heroTall: { en: "Looking up the tower's bronze fins into a blue sky", ar: "النظر إلى أعلى على زعانف البرج البرونزية في سماء زرقاء" },
  aerial: { en: "The tower from the air, between the canal and the Business Bay skyline", ar: "البرج من الجو بين القناة وأفق الخليج التجاري" },
  twilight: { en: "The tower at blue hour, its homes lit warm above the canal", ar: "البرج في الساعة الزرقاء ومنازله مضاءة فوق القناة" },
  view: { en: "The skyline and the canal seen from a high terrace", ar: "الأفق والقناة من شرفة عالية" },
  living: { en: "Residents gathered in a bright lounge with a view of the city", ar: "سكان في صالة مضيئة تطل على المدينة" },
};
export const GRID_TEXT: Record<keyof typeof GRID, { name: L; note: L }[]> = {
  interiors: [
    { name: { en: "Living room", ar: "غرفة المعيشة" }, note: { en: "3.4 m ceilings, glass to the floor on two sides.", ar: "أسقف بارتفاع 3.4 م وزجاج حتى الأرض على جانبين." } },
    { name: { en: "Kitchen and dining", ar: "المطبخ والطعام" }, note: { en: "Limestone island, walnut joinery, a hidden pantry.", ar: "جزيرة من الحجر الجيري وخزائن من الجوز ومخزن مخفي." } },
    { name: { en: "Principal bedroom", ar: "غرفة النوم الرئيسية" }, note: { en: "Faces the canal, with blackout glass built in.", ar: "تطل على القناة مع زجاج معتم مدمج." } },
    { name: { en: "Principal bathroom", ar: "الحمام الرئيسي" }, note: { en: "A stone bath placed where the view is widest.", ar: "حوض حجري حيث يكون المنظر في أوسعه." } },
  ],
  amenities: [
    { name: { en: "Sky pool, floor 60", ar: "مسبح السماء، الطابق 60" }, note: { en: "25 m, open from 6:00 to 23:00.", ar: "25 م، مفتوح من 6:00 حتى 23:00." } },
    { name: { en: "Residents' gym", ar: "نادي السكان الرياضي" }, note: { en: "Above the pool, facing downtown.", ar: "فوق المسبح، باتجاه وسط المدينة." } },
    { name: { en: "Arrival lobby", ar: "بهو الوصول" }, note: { en: "Concierge every hour of the day.", ar: "كونسيرج على مدار الساعة." } },
    { name: { en: "Garden terrace", ar: "شرفة الحديقة" }, note: { en: "Shade trees and a family pool on the podium.", ar: "أشجار ظل ومسبح عائلي على المنصة." } },
  ],
  materials: [
    { name: { en: "Bronze fin", ar: "الزعنفة البرونزية" }, note: { en: "1,408 of them shade the glass from the afternoon sun.", ar: "1,408 زعنفة تظلل الزجاج من شمس العصر." } },
    { name: { en: "Honed limestone", ar: "حجر جيري مصقول" }, note: { en: "Floors and walls in the lobby and bathrooms.", ar: "أرضيات وجدران البهو والحمامات." } },
    { name: { en: "Walnut", ar: "خشب الجوز" }, note: { en: "Doors, wardrobes and the kitchen.", ar: "الأبواب والخزائن والمطبخ." } },
    { name: { en: "Smoked glass", ar: "زجاج مدخّن" }, note: { en: "Low-iron, double-glazed, tinted on the west.", ar: "زجاج مزدوج قليل الحديد، مظلّل على الغرب." } },
  ],
  area: [
    { name: { en: "Canal boardwalk", ar: "ممشى القناة" }, note: { en: "3 km of shade and water from the door.", ar: "3 كم من الظل والماء من الباب." } },
    { name: { en: "Corner cafés", ar: "مقاهي الزاوية" }, note: { en: "Four within two minutes' walk.", ar: "أربعة على بعد دقيقتين سيراً." } },
    { name: { en: "Running track", ar: "مسار الجري" }, note: { en: "Along the water, lit at night.", ar: "على طول الماء، ومضاء ليلاً." } },
    { name: { en: "Marina", ar: "المرسى" }, note: { en: "Berths for small boats, by request.", ar: "مراسٍ للقوارب الصغيرة عند الطلب." } },
  ],
};

/* ───────── the tower ───────── */

export const FLOORS = 88;
export type CollectionId = "canal" | "city" | "horizon" | "sky" | "crown";
export const AMENITY_FLOORS: Record<number, L> = {
  1: { en: "Arrival lobby and concierge", ar: "بهو الوصول والكونسيرج" },
  2: { en: "Residents' lounge and library", ar: "صالة السكان والمكتبة" },
  3: { en: "Garden terrace and family pool", ar: "شرفة الحديقة ومسبح العائلة" },
  4: { en: "Children's club and screening room", ar: "نادي الأطفال وغرفة العرض" },
  60: { en: "Sky pool and gym", ar: "مسبح السماء والنادي الرياضي" },
  86: { en: "Owners' club and observatory", ar: "نادي الملّاك والمرصد" },
};
export const COLLECTIONS: { id: CollectionId; from: number; to: number; name: L; note: L; beds: number[]; size: [number, number]; perFloor: number }[] = [
  { id: "canal", from: 5, to: 29, name: { en: "Canal residences", ar: "مساكن القناة" }, note: { en: "Close to the water and the trees.", ar: "قريبة من الماء والأشجار." }, beds: [1, 2], size: [820, 1450], perFloor: 4 },
  { id: "city", from: 30, to: 59, name: { en: "City residences", ar: "مساكن المدينة" }, note: { en: "Level with the towers of Business Bay.", ar: "على مستوى أبراج الخليج التجاري." }, beds: [2, 3], size: [1400, 2300], perFloor: 3 },
  { id: "horizon", from: 61, to: 79, name: { en: "Horizon residences", ar: "مساكن الأفق" }, note: { en: "Above the skyline; the sea on clear days.", ar: "فوق الأفق، والبحر في الأيام الصافية." }, beds: [3, 4], size: [2600, 3900], perFloor: 2 },
  { id: "sky", from: 80, to: 85, name: { en: "Sky villas", ar: "فلل السماء" }, note: { en: "Double-height homes with a private pool.", ar: "منازل بارتفاع طابقين ومسبح خاص." }, beds: [4, 5], size: [5200, 6800], perFloor: 1 },
  { id: "crown", from: 87, to: 88, name: { en: "The crown", ar: "التاج" }, note: { en: "One penthouse on the top two floors.", ar: "بنتهاوس واحد في الطابقين الأخيرين." }, beds: [6], size: [11800, 11800], perFloor: 1 },
];
export const collectionOf = (f: number) => COLLECTIONS.find((c) => f >= c.from && f <= c.to) ?? null;
export const heightOf = (f: number) => Math.round(14 + (f - 1) * 3.85);

const FACING: { id: string; name: L }[] = [
  { id: "canal", name: { en: "Canal and Downtown", ar: "القناة ووسط المدينة" } },
  { id: "bay", name: { en: "Business Bay", ar: "الخليج التجاري" } },
  { id: "creek", name: { en: "The Creek and sunrise", ar: "الخور والشروق" } },
  { id: "sea", name: { en: "The sea and sunset", ar: "البحر والغروب" } },
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

export type Status = "available" | "reserved" | "sold";
export interface Unit {
  code: string;
  floor: number;
  beds: number;
  sqft: number;
  facing: L;
  price: number; // AED
  status: Status;
}

/** The homes on one floor: invented, but the same on every visit. */
export function unitsOn(f: number): Unit[] {
  const c = collectionOf(f);
  if (!c) return [];
  if (c.id === "crown") {
    if (f !== 87) return unitsOn(87);
    return [{ code: "PH", floor: 87, beds: 6, sqft: 11800, facing: { en: "All four sides", ar: "الجهات الأربع" }, price: 98_000_000, status: "available" }];
  }
  if (c.id === "sky" && (f - c.from) % 2 === 1) return unitsOn(f - 1);
  const r = rng(f * 7919);
  return Array.from({ length: c.perFloor }, (_, i) => {
    const beds = c.beds[i % c.beds.length];
    const sqft = Math.round((c.size[0] + (c.size[1] - c.size[0]) * (0.25 * (beds - c.beds[0]) + 0.6 * r())) / 10) * 10;
    const face = FACING[(i + (c.perFloor === 1 ? f : 0)) % FACING.length];
    const rate = 2900 + f * 52 + (face.id === "canal" ? 420 : face.id === "sea" ? 300 : 0) + (c.id === "sky" ? 1800 : 0);
    const roll = r();
    const status: Status = roll < 0.42 ? "sold" : roll < 0.58 ? "reserved" : "available";
    return { code: `${String(f).padStart(2, "0")}${String.fromCharCode(65 + i)}`, floor: f, beds, sqft, facing: face.name, price: Math.round((sqft * rate) / 10000) * 10000, status };
  });
}

export const fmtAED = (n: number, lang: Lang) =>
  n >= 1e6 ? `AED ${(n / 1e6).toFixed(n >= 1e7 ? 0 : 2)}${lang === "ar" ? " مليون" : "M"}` : `AED ${n.toLocaleString("en")}`;

/* ───────── neighbourhood ───────── */

export const TRAVEL: { to: L; min: number; by: L }[] = [
  { to: { en: "Dubai Mall", ar: "دبي مول" }, min: 6, by: { en: "by car", ar: "بالسيارة" } },
  { to: { en: "DIFC", ar: "مركز دبي المالي" }, min: 9, by: { en: "by car", ar: "بالسيارة" } },
  { to: { en: "Canal water taxi", ar: "تاكسي القناة المائي" }, min: 2, by: { en: "on foot", ar: "سيراً" } },
  { to: { en: "DXB airport", ar: "مطار دبي" }, min: 18, by: { en: "by car", ar: "بالسيارة" } },
];

export const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "Is ORIEL 88 a real tower?", ar: "هل أوريل 88 برج حقيقي؟" },
    a: {
      en: "No. ORIEL 88, its homes, prices and availability are fictional: a concept website designed and built by Zenith Dubai. The photographs are AI-generated and nothing can be bought or reserved here.",
      ar: "لا. أوريل 88 ومنازله وأسعاره وتوفّره من الخيال: موقع تجريبي صمّمته وبنته زينيث دبي. الصور مولّدة بالذكاء الاصطناعي ولا يمكن شراء أو حجز أي شيء هنا.",
    },
  },
  { q: { en: "How do the floors differ?", ar: "ما الفرق بين الطوابق؟" }, a: { en: "Lower floors sit with the canal and the trees; above the 60th floor the skyline drops below you. Prices rise with every floor.", ar: "الطوابق السفلى قريبة من القناة والأشجار، وفوق الطابق الستين يصبح الأفق تحتك. ترتفع الأسعار مع كل طابق." } },
  { q: { en: "What does the service charge cover?", ar: "ماذا تشمل رسوم الخدمة؟" }, a: { en: "In this concept: concierge, the pools, the gym, security and the facade's upkeep.", ar: "في هذا التصور: الكونسيرج والمسابح والنادي والأمن وصيانة الواجهة." } },
];

/* ───────── interface text ───────── */

export const UI = {
  en: {
    tagline: "Eighty-eight floors above the canal.",
    sub: "Residences in a bronze-finned tower on the Dubai Water Canal, from one bedroom by the trees to the penthouse in the crown.",
    findHome: "Find your floor",
    register: "Register interest",
    nav: { tower: "The tower", homes: "Homes", interiors: "Interiors", amenities: "Amenities", area: "Area", contact: "Register" },
    menu: "Menu",
    close: "Close",
    langName: "العربية",
    concept: "Concept website. ORIEL 88 is fictional.",
    conceptShort: "Fictional tower",
    facts: [
      { v: "88", k: "floors" },
      { v: "339 m", k: "to the crown" },
      { v: "1,408", k: "bronze fins" },
      { v: "232", k: "homes" },
    ],
    towerTitle: "Pick a floor",
    towerIntro: "Point at the tower to read each floor. Choose one to see its homes and the view from that height.",
    floor: "Floor",
    height: "Height",
    collection: "Collection",
    amenityFloor: "A floor for everyone who lives here",
    viewFrom: (f: number, m: number) => `The view from floor ${f}, ${m} m up`,
    homesOn: "Homes on this floor",
    beds: (n: number) => (n === 1 ? "1 bedroom" : `${n} bedrooms`),
    sqft: "sq ft",
    facing: "Facing",
    status: { available: "Available", reserved: "Reserved", sold: "Sold" } as Record<string, string>,
    requestViewing: "Arrange a viewing",
    onlyAvailable: "Only show floors with homes available",
    keys: "Use the arrow keys to move one floor at a time.",
    up: "One floor up",
    down: "One floor down",
    noticeTitle: "This is where the viewing would be arranged",
    noticeBody: "ORIEL 88 is a concept website by Zenith Dubai. The tower and its homes are invented, so nothing has been reserved and no one has been contacted.",
    noticeCta: "Back to the tower",
    noticeZenith: "Want a website like this?",
    interiorsTitle: "Inside a City residence",
    interiorsIntro: "Floor 44, home B: three bedrooms facing Business Bay.",
    twilightLine: "At blue hour the fins go dark and the homes glow.",
    amenitiesTitle: "Shared floors",
    materialsTitle: "What it is made of",
    livingTitle: "Living there",
    livingBody: "The lounge on floor 2 is where neighbours meet: a long table, a library wall, and a terrace above the boardwalk.",
    areaTitle: "On the canal",
    areaIntro: "Business Bay on one side, the water on the other.",
    minutes: "min",
    contactTitle: "Register your interest",
    contactIntro: "ORIEL 88 is fictional, so a message here reaches Zenith Dubai, who designed and built this website.",
    faqTitle: "Questions",
    footer: "ORIEL 88 is a fictional development. Prices, plans and photographs are illustrative and AI-generated for this concept.",
    footerBy: "Concept, design and build by Zenith Dubai",
    backToGallery: "All concept websites",
    skip: "Skip to the floor picker",
    form: {
      name: "Your name",
      email: "Email",
      interest: "Interested in",
      message: "Anything we should know",
      send: "Register",
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
    interests: ["Canal residences", "City residences", "Horizon residences", "Sky villas", "The crown"],
  },
  ar: {
    tagline: "ثمانية وثمانون طابقاً فوق القناة.",
    sub: "مساكن في برج بزعانف برونزية على قناة دبي المائية، من غرفة نوم واحدة بين الأشجار إلى البنتهاوس في التاج.",
    findHome: "اختر طابقك",
    register: "سجّل اهتمامك",
    nav: { tower: "البرج", homes: "المنازل", interiors: "الداخل", amenities: "المرافق", area: "المنطقة", contact: "التسجيل" },
    menu: "القائمة",
    close: "إغلاق",
    langName: "English",
    concept: "موقع تجريبي. أوريل 88 برج خيالي.",
    conceptShort: "برج خيالي",
    facts: [
      { v: "88", k: "طابقاً" },
      { v: "339 م", k: "حتى التاج" },
      { v: "1,408", k: "زعنفة برونزية" },
      { v: "232", k: "منزلاً" },
    ],
    towerTitle: "اختر طابقاً",
    towerIntro: "مرّر على البرج لتقرأ كل طابق. اختر واحداً لترى منازله والمنظر من ذلك الارتفاع.",
    floor: "الطابق",
    height: "الارتفاع",
    collection: "المجموعة",
    amenityFloor: "طابق لكل من يسكن هنا",
    viewFrom: (f: number, m: number) => `المنظر من الطابق ${f}، على ارتفاع ${m} م`,
    homesOn: "المنازل في هذا الطابق",
    beds: (n: number) => (n === 1 ? "غرفة نوم واحدة" : n === 2 ? "غرفتا نوم" : `${n} غرف نوم`),
    sqft: "قدم²",
    facing: "الإطلالة",
    status: { available: "متاح", reserved: "محجوز", sold: "مباع" } as Record<string, string>,
    requestViewing: "رتّب معاينة",
    onlyAvailable: "أظهر الطوابق التي فيها منازل متاحة فقط",
    keys: "استخدم مفاتيح الأسهم للتنقل طابقاً طابقاً.",
    up: "طابق إلى الأعلى",
    down: "طابق إلى الأسفل",
    noticeTitle: "هنا كانت ستُرتّب المعاينة",
    noticeBody: "أوريل 88 موقع تجريبي من زينيث دبي. البرج ومنازله من الخيال، لذلك لم يُحجز شيء ولم يُتواصل مع أحد.",
    noticeCta: "العودة إلى البرج",
    noticeZenith: "تريد موقعاً كهذا؟",
    interiorsTitle: "داخل مسكن من مساكن المدينة",
    interiorsIntro: "الطابق 44، المنزل B: ثلاث غرف نوم تطل على الخليج التجاري.",
    twilightLine: "في الساعة الزرقاء تعتم الزعانف وتتوهّج المنازل.",
    amenitiesTitle: "الطوابق المشتركة",
    materialsTitle: "مما صُنع",
    livingTitle: "الحياة هناك",
    livingBody: "صالة الطابق الثاني هي حيث يلتقي الجيران: طاولة طويلة وجدار مكتبة وشرفة فوق الممشى.",
    areaTitle: "على القناة",
    areaIntro: "الخليج التجاري من جهة، والماء من الجهة الأخرى.",
    minutes: "دقيقة",
    contactTitle: "سجّل اهتمامك",
    contactIntro: "أوريل 88 برج خيالي، لذلك تصل رسالتك هنا إلى زينيث دبي التي صمّمت هذا الموقع وبنته.",
    faqTitle: "أسئلة",
    footer: "أوريل 88 مشروع خيالي. الأسعار والمخططات والصور توضيحية ومولّدة بالذكاء الاصطناعي لهذا التصور.",
    footerBy: "الفكرة والتصميم والتنفيذ: زينيث دبي",
    backToGallery: "كل المواقع التجريبية",
    skip: "انتقل إلى اختيار الطابق",
    form: {
      name: "اسمك",
      email: "البريد الإلكتروني",
      interest: "مهتم بـ",
      message: "ما يجب أن نعرفه",
      send: "سجّل",
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
    interests: ["مساكن القناة", "مساكن المدينة", "مساكن الأفق", "فلل السماء", "التاج"],
  },
};
export type UIStrings = (typeof UI)["en"];
