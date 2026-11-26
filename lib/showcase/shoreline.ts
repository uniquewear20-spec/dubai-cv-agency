// SHORELINE NO. 9: one fictional beachfront mansion for sale on Palm Jumeirah. A concept website by
// Zenith Dubai. The house, its plan, price and the viewing request are invented; the request works
// end to end and stops at a notice before anything is sent.

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
const hf = (id: string) => `${CDN}${id}_min.webp`;
const crop = (id: string, W: number, H: number, boxes: number[][]) => boxes.map((b) => `crop:${CDN}${id}_min.webp#${W},${H},${b.join(",")}`);

export const IMG = {
  hero: hf("hf_20261126_191823_ae8207fa-3da4-48cf-bea6-8f8315c0a940"),
  heroTall: hf("hf_20261126_191204_ff7cb5e6-abdc-4727-b648-361e5161da3b"),
  aerial: hf("hf_20261126_191718_63c42b9b-b41b-44ab-b6c9-d83906cf1102"),
  night: hf("hf_20261126_192517_aeb998ae-9894-499f-88ac-984084f0b8ff"),
  living: hf("hf_20261126_193843_e1eb5a9f-784a-494c-9b55-d8c75a8ce7ad"),
  view: hf("hf_20261126_194809_e52747a2-cee8-4910-8230-d25f4dfcc96e"),
};
export const GRID = {
  interiors: crop("hf_20261126_192533_e8f49720-d61c-49c3-81d0-a41830d359bc", 2720, 1536, [[4, 4, 1343, 755], [1373, 4, 1343, 755], [4, 784, 1343, 748], [1373, 784, 1343, 748]]),
  amenities: crop("hf_20261126_193215_ae6b18b8-9593-419f-bd7d-ddad33af4974", 2048, 2048, [[27, 28, 982, 981], [1040, 28, 981, 981], [27, 1039, 982, 981], [1040, 1039, 981, 982]]),
  materials: crop("hf_20261126_193814_f4086718-9113-4a5a-9115-102e05f0df91", 2048, 2048, [[24, 24, 986, 985], [1039, 24, 985, 985], [24, 1038, 986, 985], [1039, 1038, 985, 985]]),
  area: crop("hf_20261126_194730_6200982b-f6c9-47e6-b273-5a5c9cf1f337", 2720, 1536, [[4, 4, 1342, 750], [1374, 4, 1342, 750], [4, 782, 1342, 750], [1375, 782, 1341, 750]]),
};
export const ALT = {
  hero: { en: "A white stone house with deep terraces and a long pool above a private beach", ar: "منزل من الحجر الأبيض بشرفات عميقة ومسبح طويل فوق شاطئ خاص" },
  heroTall: { en: "The house's terraces stacked above the pool and the sea", ar: "شرفات المنزل فوق المسبح والبحر" },
  aerial: { en: "The house from the air, on the curve of a frond with turquoise water", ar: "المنزل من الجو على انحناءة سعفة ومياه فيروزية" },
  night: { en: "The house at blue hour, lit from inside, palms around the pool", ar: "المنزل في الساعة الزرقاء مضاء من الداخل والنخيل حول المسبح" },
  living: { en: "A family lunch on the terrace by the sea", ar: "غداء عائلي على الشرفة بجانب البحر" },
  view: { en: "The sea and the beach from the main terrace", ar: "البحر والشاطئ من الشرفة الرئيسية" },
} satisfies Record<string, L>;

export const FACTS: { v: string; k: L }[] = [
  { v: "2,410 m²", k: { en: "plot", ar: "مساحة الأرض" } },
  { v: "1,640 m²", k: { en: "built", ar: "المساحة المبنية" } },
  { v: "46 m", k: { en: "of private beach", ar: "من الشاطئ الخاص" } },
  { v: "7", k: { en: "bedrooms, all facing the sea", ar: "غرف نوم، كلها تطل على البحر" } },
];

/* ───────── the plan ───────── */

export interface Room {
  id: string;
  level: number;
  name: L;
  m2: number;
  note: L;
  img?: string;
  r: [number, number, number, number]; // x, y, w, h in metres; the sea is at the bottom
}
export const LEVELS: L[] = [
  { en: "Beach level", ar: "مستوى الشاطئ" },
  { en: "Ground floor", ar: "الطابق الأرضي" },
  { en: "First floor", ar: "الطابق الأول" },
];
export const ROOMS: Room[] = [
  { id: "cinema", level: 0, name: { en: "Cinema", ar: "السينما" }, m2: 96, note: { en: "Twelve seats, doors that open onto the sand.", ar: "اثنا عشر مقعداً وأبواب تنفتح على الرمل." }, img: GRID.amenities[0], r: [2, 10, 12, 10] },
  { id: "gym", level: 0, name: { en: "Gym", ar: "النادي الرياضي" }, m2: 84, note: { en: "Facing the water, with a cold plunge.", ar: "يطل على الماء مع حوض بارد." }, img: GRID.amenities[1], r: [15, 10, 11, 10] },
  { id: "spa", level: 0, name: { en: "Hammam and spa", ar: "الحمام المغربي والسبا" }, m2: 120, note: { en: "Steam, a massage room and a stone bench.", ar: "بخار وغرفة تدليك ومقعد حجري." }, r: [27, 10, 11, 10] },
  { id: "staff", level: 0, name: { en: "Staff and service", ar: "الخدمة والعاملون" }, m2: 210, note: { en: "Four rooms, a laundry and a separate entrance.", ar: "أربع غرف وغرفة غسيل ومدخل منفصل." }, r: [2, 2, 36, 7] },
  { id: "arrival", level: 1, name: { en: "Arrival hall", ar: "بهو الوصول" }, m2: 140, note: { en: "Seven metres high, the sea straight ahead.", ar: "بارتفاع سبعة أمتار، والبحر أمامك مباشرة." }, img: GRID.amenities[2], r: [15, 2, 10, 8] },
  { id: "living", level: 1, name: { en: "Living room", ar: "غرفة المعيشة" }, m2: 180, note: { en: "Glass that slides away completely.", ar: "زجاج ينزلق بالكامل." }, img: GRID.interiors[0], r: [15, 11, 14, 9] },
  { id: "kitchen", level: 1, name: { en: "Kitchen and dining", ar: "المطبخ والطعام" }, m2: 130, note: { en: "A table for sixteen, a show kitchen and a working one.", ar: "طاولة لستة عشر، ومطبخ عرض وآخر للعمل." }, img: GRID.interiors[1], r: [30, 11, 8, 9] },
  { id: "majlis", level: 1, name: { en: "Majlis", ar: "المجلس" }, m2: 110, note: { en: "Its own entrance for guests.", ar: "له مدخله الخاص للضيوف." }, r: [2, 2, 12, 9] },
  { id: "guest", level: 1, name: { en: "Two guest suites", ar: "جناحان للضيوف" }, m2: 150, note: { en: "On the garden side, each with a terrace.", ar: "على جهة الحديقة ولكل منهما شرفة." }, r: [2, 12, 12, 8] },
  { id: "study", level: 1, name: { en: "Study", ar: "المكتب" }, m2: 45, note: { en: "Wood-lined, the quietest room in the house.", ar: "مكسو بالخشب، أهدأ غرفة في البيت." }, r: [26, 2, 12, 8] },
  { id: "principal", level: 2, name: { en: "Principal suite", ar: "الجناح الرئيسي" }, m2: 260, note: { en: "The whole sea side of the floor.", ar: "كامل جهة البحر من الطابق." }, img: GRID.interiors[2], r: [14, 11, 16, 9] },
  { id: "bath", level: 2, name: { en: "Principal bathroom", ar: "الحمام الرئيسي" }, m2: 70, note: { en: "A stone bath facing the horizon.", ar: "حوض حجري يواجه الأفق." }, img: GRID.interiors[3], r: [31, 11, 7, 9] },
  { id: "bedrooms", level: 2, name: { en: "Four bedrooms", ar: "أربع غرف نوم" }, m2: 300, note: { en: "Each with its own bathroom and a balcony.", ar: "لكل منها حمامها وشرفتها." }, r: [2, 11, 11, 9] },
  { id: "roof", level: 2, name: { en: "Roof garden", ar: "حديقة السطح" }, m2: 220, note: { en: "Olive trees, a fire pit and the sunset.", ar: "أشجار زيتون وموقد نار والغروب." }, img: GRID.amenities[3], r: [2, 2, 36, 8] },
];
export const PLAN_W = 40;
export const PLAN_H = 22;

export const MATERIALS: L[] = [
  { en: "White limestone, inside and out", ar: "حجر جيري أبيض، في الداخل والخارج" },
  { en: "Teak decking around the pool", ar: "أرضيات من خشب الساج حول المسبح" },
  { en: "Brushed brass, which darkens with the salt", ar: "نحاس مصقول يغمق مع الملح" },
  { en: "Linen everywhere the sun reaches", ar: "كتان حيث تصل الشمس" },
];
export const AREA: L[] = [
  { en: "The marina, five minutes by tender", ar: "المرسى، خمس دقائق بالقارب" },
  { en: "A beach club along the crescent", ar: "نادٍ شاطئي على الهلال" },
  { en: "Anchorage off the beach", ar: "مرسى قبالة الشاطئ" },
  { en: "The promenade for evening walks", ar: "الممشى لنزهات المساء" },
];

export const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "Is Shoreline No. 9 a real house?", ar: "هل شورلاين رقم 9 منزل حقيقي؟" },
    a: {
      en: "No. The house, its plan, its price and the agency are fictional: a concept website designed and built by Zenith Dubai. The photographs are AI-generated and no viewing can be arranged.",
      ar: "لا. المنزل ومخططه وسعره والوكالة من الخيال: موقع تجريبي صمّمته وبنته زينيث دبي. الصور مولّدة بالذكاء الاصطناعي ولا يمكن ترتيب أي معاينة.",
    },
  },
  { q: { en: "Why is the price not shown?", ar: "لماذا لا يظهر السعر؟" }, a: { en: "Houses like this are usually priced on application. In this concept, a figure is shared after a viewing request.", ar: "تُسعّر منازل كهذه عادة عند الطلب. في هذا التصور يُشارك الرقم بعد طلب المعاينة." } },
  { q: { en: "Can I view it at sunset?", ar: "هل يمكنني معاينته وقت الغروب؟" }, a: { en: "Yes. Most people ask for the last hour of light.", ar: "نعم. يطلب معظم الناس الساعة الأخيرة من الضوء." } },
];

const en = {
  tagline: "Number nine, on the water.",
  sub: "One house on the outer crescent of Palm Jumeirah: forty-six metres of its own beach, seven bedrooms, and the sun setting straight ahead.",
  explore: "Walk the plan",
  request: "Request a private viewing",
  nav: { house: "The house", plan: "Plan", view: "The view", materials: "Materials", area: "Around", viewing: "Viewing" },
  menu: "Menu",
  close: "Close",
  langName: "العربية",
  concept: "Concept website. Shoreline No. 9 is fictional.",
  conceptShort: "Fictional house",
  price: "Price on application",
  planTitle: "Walk the plan",
  planIntro: "Three levels from the sand up. Choose a room.",
  sea: "The sea",
  noPhoto: "No photograph of this room yet.",
  viewTitle: "What you see from the terrace",
  nightLine: "After dark, the house is the only light on this stretch of sand.",
  materialsTitle: "Four materials",
  livingTitle: "A house for long lunches",
  livingBody: "The terrace takes a table for twenty in the shade of the floor above, two steps from the pool and twenty from the sea.",
  areaTitle: "Around number nine",
  viewingTitle: "Request a private viewing",
  viewingIntro: "Viewings are by appointment, with the listing agent, never more than one party a day.",
  when: "When",
  windows: [
    { id: "week", name: "This week" },
    { id: "next", name: "Next week" },
    { id: "later", name: "Later this month" },
  ],
  light: "Light",
  lights: [
    { id: "morning", name: "Morning" },
    { id: "sunset", name: "The last hour of light" },
  ],
  party: "Who will come",
  parties: [
    { id: "me", name: "Just me" },
    { id: "family", name: "With family" },
    { id: "advisor", name: "With an advisor" },
  ],
  funds: "I can show proof of funds before the viewing",
  needFunds: "The agent asks for this before any viewing.",
  send: "Send the request",
  noticeTitle: "This is where the request would go to the agent",
  noticeBody: "Shoreline No. 9 is a concept website by Zenith Dubai. The house and the agency are invented, so the request was not sent and no one has your details.",
  noticeCta: "Back to the house",
  noticeZenith: "Want a website like this?",
  contactTitle: "Write to the agent",
  contactIntro: "The house is fictional, so a message here reaches Zenith Dubai, who designed and built this website.",
  faqTitle: "Questions",
  footer: "Shoreline No. 9 is a fictional property. Plans, figures and photographs are illustrative and AI-generated for this concept.",
  footerBy: "Concept, design and build by Zenith Dubai",
  backToGallery: "All concept websites",
  skip: "Skip to the plan",
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
  interests: ["A viewing", "The price", "The plot", "Something else"],
};
export const UI: Record<Lang, typeof en> = {
  en,
  ar: {
    tagline: "رقم تسعة، على الماء.",
    sub: "منزل واحد على الهلال الخارجي لنخلة جميرا: ستة وأربعون متراً من شاطئه الخاص، وسبع غرف نوم، والشمس تغرب أمامه مباشرة.",
    explore: "تجوّل في المخطط",
    request: "اطلب معاينة خاصة",
    nav: { house: "المنزل", plan: "المخطط", view: "الإطلالة", materials: "المواد", area: "الجوار", viewing: "المعاينة" },
    menu: "القائمة",
    close: "إغلاق",
    langName: "English",
    concept: "موقع تجريبي. شورلاين رقم 9 منزل خيالي.",
    conceptShort: "منزل خيالي",
    price: "السعر عند الطلب",
    planTitle: "تجوّل في المخطط",
    planIntro: "ثلاثة مستويات من الرمل إلى الأعلى. اختر غرفة.",
    sea: "البحر",
    noPhoto: "لا صورة لهذه الغرفة بعد.",
    viewTitle: "ما تراه من الشرفة",
    nightLine: "بعد الغروب، يكون المنزل الضوء الوحيد على هذا الامتداد من الرمل.",
    materialsTitle: "أربع مواد",
    livingTitle: "منزل للغداءات الطويلة",
    livingBody: "تتسع الشرفة لطاولة من عشرين شخصاً في ظل الطابق العلوي، على بعد خطوتين من المسبح وعشرين من البحر.",
    areaTitle: "حول رقم تسعة",
    viewingTitle: "اطلب معاينة خاصة",
    viewingIntro: "المعاينات بموعد مسبق مع الوكيل، ولا أكثر من جهة واحدة في اليوم.",
    when: "متى",
    windows: [
      { id: "week", name: "هذا الأسبوع" },
      { id: "next", name: "الأسبوع القادم" },
      { id: "later", name: "لاحقاً هذا الشهر" },
    ],
    light: "الضوء",
    lights: [
      { id: "morning", name: "الصباح" },
      { id: "sunset", name: "الساعة الأخيرة من الضوء" },
    ],
    party: "من سيحضر",
    parties: [
      { id: "me", name: "أنا فقط" },
      { id: "family", name: "مع العائلة" },
      { id: "advisor", name: "مع مستشار" },
    ],
    funds: "يمكنني تقديم إثبات الملاءة المالية قبل المعاينة",
    needFunds: "يطلب الوكيل هذا قبل أي معاينة.",
    send: "أرسل الطلب",
    noticeTitle: "هنا كان سيُرسل الطلب إلى الوكيل",
    noticeBody: "شورلاين رقم 9 موقع تجريبي من زينيث دبي. المنزل والوكالة من الخيال، لذلك لم يُرسل الطلب ولا أحد لديه بياناتك.",
    noticeCta: "العودة إلى المنزل",
    noticeZenith: "تريد موقعاً كهذا؟",
    contactTitle: "راسل الوكيل",
    contactIntro: "المنزل خيالي، لذلك تصل رسالتك هنا إلى زينيث دبي التي صمّمت هذا الموقع وبنته.",
    faqTitle: "أسئلة",
    footer: "شورلاين رقم 9 عقار خيالي. المخططات والأرقام والصور توضيحية ومولّدة بالذكاء الاصطناعي لهذا التصور.",
    footerBy: "الفكرة والتصميم والتنفيذ: زينيث دبي",
    backToGallery: "كل المواقع التجريبية",
    skip: "انتقل إلى المخطط",
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
    interests: ["معاينة", "السعر", "الأرض", "شيء آخر"],
  },
};
export type UIStrings = typeof en;
