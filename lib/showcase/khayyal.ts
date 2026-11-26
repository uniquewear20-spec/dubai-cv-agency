// KHAYYAL: a fictional Gulf grand-tourer marque. A concept website by Zenith Dubai. The car, its
// figures, prices and showrooms are invented; the configurator and the test-drive booking work end
// to end and stop at a notice before anything is sent.

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
const hf = (id: string) => `${CDN}${id}_min.webp`;
const crop = (id: string, W: number, H: number, boxes: number[][]) => boxes.map((b) => `crop:${CDN}${id}_min.webp#${W},${H},${b.join(",")}`);

export const IMG = {
  hero: hf("hf_20261126_162629_d523d832-6dcf-4cf8-bdbe-d78602c53839"),
  profile: hf("hf_20261126_163055_ca62bfdc-238a-4fd8-b686-ea2e3b0f4e3d"),
  drive: hf("hf_20261126_163223_852681d5-c230-4986-9ff5-4c754791a36b"),
  heroTall: hf("hf_20261126_163608_d182693e-01ef-47a3-b71f-69a4d56924e9"),
  night: hf("hf_20261126_163753_267ba293-4aed-4dfb-bf1e-b9816a1d8183"),
  falcon: hf("hf_20261126_164716_41d33432-fffe-477f-a9c0-4af37d82d9d6"),
  showroom: hf("hf_20261126_165000_0b4a8eb2-1c69-4ceb-92f0-f7819abf6d5d"),
};
export const GRID = {
  colours: crop("hf_20261126_164038_95ca07a3-4c06-4af7-83dd-56cf242e3ab8", 2048, 2048, [[23, 23, 987, 987], [1038, 24, 987, 986], [23, 1038, 987, 986], [1038, 1038, 986, 986]]),
  details: crop("hf_20261126_164237_5cfffeda-7d92-45d9-93f0-54dd1fe47baa", 2048, 2048, [[23, 24, 987, 986], [1038, 24, 986, 986], [23, 1038, 987, 986], [1038, 1038, 986, 986]]),
  cabin: crop("hf_20261126_164513_5926eac4-eb08-42af-bcdc-2cb06040f21a", 2720, 1536, [[17, 23, 1330, 732], [1373, 23, 1330, 732], [17, 781, 1330, 732], [1373, 781, 1330, 732]]),
};
export const ALT = {
  hero: { en: "A long, low gold grand tourer in a dark studio", ar: "سيارة جي تي ذهبية طويلة ومنخفضة في استوديو مظلم" },
  profile: { en: "The grand tourer in side profile", ar: "سيارة الجي تي من الجانب" },
  drive: { en: "The car on a desert road at dusk, mountains behind", ar: "السيارة على طريق صحراوي عند الغسق والجبال خلفها" },
  night: { en: "The car moving through a city at night, lights streaking", ar: "السيارة تعبر مدينة ليلاً والأضواء تمتد" },
  falcon: { en: "The car beside a falconry camp in the dunes at dawn", ar: "السيارة بجانب مخيم صقور بين الكثبان عند الفجر" },
  showroom: { en: "The car on a turntable in a stone showroom", ar: "السيارة على منصة دوّارة في صالة عرض حجرية" },
} satisfies Record<string, L>;

export const DETAILS: { name: L; note: L }[] = [
  { name: { en: "Light blade", ar: "شفرة الضوء" }, note: { en: "One line across the nose, like a falcon's brow.", ar: "خط واحد عبر المقدمة، كحاجب الصقر." } },
  { name: { en: "Forged wheel", ar: "عجلة مطروقة" }, note: { en: "Ten spokes, each machined from one billet.", ar: "عشرة أذرع، كل منها مشغول من قطعة واحدة." } },
  { name: { en: "Rear bar", ar: "الشريط الخلفي" }, note: { en: "Full width, dimmed in the desert at night.", ar: "بعرض السيارة، يخفت في الصحراء ليلاً." } },
  { name: { en: "Shoulder", ar: "الكتف" }, note: { en: "A single highlight from headlight to tail.", ar: "انعكاس واحد من المصباح الأمامي حتى الذيل." } },
];
export const CABIN: { name: L; note: L }[] = [
  { name: { en: "Driver's seat", ar: "مقعد السائق" }, note: { en: "Two screens, one dial you can feel.", ar: "شاشتان وقرص واحد تشعر به." } },
  { name: { en: "The front seats", ar: "المقعدان الأماميان" }, note: { en: "Built for a night across the Empty Quarter.", ar: "مصمّمان لليلة عبر الربع الخالي." } },
  { name: { en: "Console", ar: "الكونسول" }, note: { en: "Metal switches, no menus for the things you use daily.", ar: "مفاتيح معدنية، بلا قوائم لما تستخدمه يومياً." } },
  { name: { en: "Door panel", ar: "لوحة الباب" }, note: { en: "Hand stitching in a sadu pattern.", ar: "خياطة يدوية بنقشة السدو." } },
];

/* ───────── configurator ───────── */

export const BASE_PRICE = 1_240_000;
export const COLOURS: { id: string; cell: number; name: L; hex: string; price: number }[] = [
  { id: "gold", cell: 0, name: { en: "Desert gold", ar: "ذهب الصحراء" }, hex: "#a98a55", price: 0 },
  { id: "obsidian", cell: 1, name: { en: "Obsidian", ar: "أوبسيديان" }, hex: "#121212", price: 0 },
  { id: "pearl", cell: 2, name: { en: "Salt pearl", ar: "لؤلؤ الملح" }, hex: "#d9d9d6", price: 9_500 },
  { id: "gulf", cell: 3, name: { en: "Gulf blue", ar: "أزرق الخليج" }, hex: "#1f4f8a", price: 14_000 },
];
export const WHEELS: { id: string; name: L; price: number }[] = [
  { id: "satin", name: { en: '21" forged, satin bronze', ar: "21 بوصة مطروقة، برونزي ساتان" }, price: 0 },
  { id: "black", name: { en: '22" forged, gloss black', ar: "22 بوصة مطروقة، أسود لامع" }, price: 12_000 },
];
export const TRIMS: { id: string; name: L; price: number }[] = [
  { id: "sand", name: { en: "Sand leather", ar: "جلد رملي" }, price: 0 },
  { id: "night", name: { en: "Black and bronze", ar: "أسود وبرونزي" }, price: 6_500 },
  { id: "camel", name: { en: "Camel suede", ar: "شامواه بلون الجمل" }, price: 8_000 },
];
export const OPTIONS: { id: string; name: L; price: number }[] = [
  { id: "nightpack", name: { en: "Night pack: dark glass and trim", ar: "حزمة الليل: زجاج وزخارف داكنة" }, price: 7_800 },
  { id: "ceramic", name: { en: "Carbon-ceramic brakes", ar: "مكابح كربون سيراميك" }, price: 31_000 },
  { id: "luggage", name: { en: "Fitted luggage, four pieces", ar: "حقائب مفصّلة، أربع قطع" }, price: 4_200 },
];
export interface Build {
  colour: string;
  wheel: string;
  trim: string;
  options: string[];
}
export const DEFAULT_BUILD: Build = { colour: "gold", wheel: "satin", trim: "sand", options: [] };
export function priceOf(b: Build) {
  const f = <T extends { id: string; price: number }>(list: T[], id: string) => list.find((x) => x.id === id)?.price ?? 0;
  return BASE_PRICE + f(COLOURS, b.colour) + f(WHEELS, b.wheel) + f(TRIMS, b.trim) + b.options.reduce((s, o) => s + f(OPTIONS, o), 0);
}
export const aed = (n: number) => `AED ${n.toLocaleString("en")}`;

/** Concept figures for an invented car, shown as such. */
export const FIGURES: { v: string; k: L }[] = [
  { v: "4", k: { en: "seats, two of them for adults", ar: "مقاعد، اثنان منها للبالغين" } },
  { v: "640", k: { en: "litres of luggage space", ar: "لتراً لمساحة الأمتعة" } },
  { v: "880", k: { en: "km on one tank, at a cruise", ar: "كم بخزان واحد بسرعة ثابتة" } },
  { v: "99", k: { en: "cars a year, built by hand", ar: "سيارة في السنة، تُصنع يدوياً" } },
];

/* ───────── test drives ───────── */

export const SHOWROOMS: { id: string; name: L; days: number[] }[] = [
  { id: "alquoz", name: { en: "Al Quoz, Dubai", ar: "القوز، دبي" }, days: [0, 1, 2, 3, 4, 6] },
  { id: "saadiyat", name: { en: "Saadiyat, Abu Dhabi", ar: "السعديات، أبوظبي" }, days: [1, 2, 3, 4, 6] },
];
export const TIMES = ["10:00", "11:30", "14:00", "16:30", "19:00"];
/** Which times are already taken on a day: invented, the same on every visit. */
export function takenTimes(showroom: string, iso: string) {
  let h = 0;
  for (const c of showroom + iso) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TIMES.filter((_, i) => (h >> i) % 3 === 0);
}

export const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "Is KHAYYAL a real car?", ar: "هل خيّال سيارة حقيقية؟" },
    a: {
      en: "No. KHAYYAL, its car, figures, prices and showrooms are fictional: a concept website designed and built by Zenith Dubai. The photographs are AI-generated and nothing can be ordered or booked here.",
      ar: "لا. خيّال وسيارتها وأرقامها وأسعارها وصالات عرضها من الخيال: موقع تجريبي صمّمته وبنته زينيث دبي. الصور مولّدة بالذكاء الاصطناعي ولا يمكن طلب أو حجز أي شيء هنا.",
    },
  },
  { q: { en: "What does a build slot mean?", ar: "ماذا يعني موعد البناء؟" }, a: { en: "In this concept, each car is built to order; a slot is your place in the year's 99.", ar: "في هذا التصور تُبنى كل سيارة حسب الطلب، والموعد هو مكانك بين سيارات السنة الـ99." } },
  { q: { en: "Can I bring the car to the desert?", ar: "هل يمكنني أخذ السيارة إلى الصحراء؟" }, a: { en: "The concept car is a grand tourer for roads, including the long empty ones.", ar: "السيارة في هذا التصور سيارة جي تي للطرق، بما فيها الطويلة الخالية." } },
];

export const UI = {
  en: {
    tagline: "The long way, by choice.",
    sub: "KHAYYAL builds one grand tourer: two doors, four seats and a bonnet long enough to cross the Gulf at night.",
    configure: "Build yours",
    testDrive: "Book a drive",
    nav: { light: "Design", build: "Build", cabin: "Cabin", drive: "Drive", visit: "Test drive", contact: "Contact" },
    menu: "Menu",
    close: "Close",
    langName: "العربية",
    concept: "Concept website. KHAYYAL is fictional.",
    conceptShort: "Fictional marque",
    lightTitle: "Move the light",
    lightIntro: "Drag across the car, the way a designer moves a lamp along the clay, to follow the shoulder line.",
    lightLabel: "Studio light position",
    detailsTitle: "Four details",
    buildTitle: "Build yours",
    buildIntro: "Every choice changes the price at the foot of the sheet.",
    colour: "Paint",
    wheels: "Wheels",
    trim: "Cabin",
    extras: "Options",
    total: "Total",
    base: "Starting price",
    reserve: "Reserve a build slot",
    figuresNote: "Concept figures for an invented car.",
    cabinTitle: "Inside",
    driveLine: "Built for the road out of the city.",
    nightLine: "And back in again.",
    storyTitle: "Named for the rider",
    storyBody: "Khayyal is the Arabic for a horseman. The car keeps the idea: a long stride, a calm cabin, and the patience of a falconer waiting for first light.",
    visitTitle: "Book a test drive",
    visitIntro: "Choose a showroom, a day and a time. A driver brings the car to the turntable.",
    showroom: "Showroom",
    day: "Day",
    time: "Time",
    taken: "Taken",
    book: "Book this drive",
    pickTime: "Choose a time first.",
    yourDrive: (when: string, where: string) => `${when}, ${where}`,
    noticeTitle: "This is where it would be confirmed",
    noticeBody: "KHAYYAL is a concept website by Zenith Dubai. The car and the marque are invented, so nothing was reserved or booked. Your build is still saved on this page.",
    noticeCta: "Back to the car",
    noticeZenith: "Want a website like this?",
    contactTitle: "Talk to KHAYYAL",
    contactIntro: "KHAYYAL is fictional, so a message here reaches Zenith Dubai, who designed and built this website.",
    faqTitle: "Questions",
    footer: "KHAYYAL is a fictional marque. Figures, prices and photographs are illustrative and AI-generated for this concept.",
    footerBy: "Concept, design and build by Zenith Dubai",
    backToGallery: "All concept websites",
    skip: "Skip to the configurator",
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
    interests: ["Ordering a car", "A test drive", "Ownership", "Something else"],
  },
  ar: {
    tagline: "الطريق الطويل، عن اختيار.",
    sub: "تبني خيّال سيارة جي تي واحدة: بابان وأربعة مقاعد وغطاء محرك طويل بما يكفي لعبور الخليج ليلاً.",
    configure: "صمّم سيارتك",
    testDrive: "احجز تجربة قيادة",
    nav: { light: "التصميم", build: "التصميم الخاص", cabin: "المقصورة", drive: "القيادة", visit: "تجربة القيادة", contact: "تواصل" },
    menu: "القائمة",
    close: "إغلاق",
    langName: "English",
    concept: "موقع تجريبي. خيّال علامة خيالية.",
    conceptShort: "علامة خيالية",
    lightTitle: "حرّك الضوء",
    lightIntro: "اسحب عبر السيارة، كما يحرّك المصمم المصباح على نموذج الطين، لتتبع خط الكتف.",
    lightLabel: "موضع ضوء الاستوديو",
    detailsTitle: "أربع تفاصيل",
    buildTitle: "صمّم سيارتك",
    buildIntro: "كل اختيار يغيّر السعر في أسفل الورقة.",
    colour: "الطلاء",
    wheels: "العجلات",
    trim: "المقصورة",
    extras: "الإضافات",
    total: "المجموع",
    base: "السعر الأساسي",
    reserve: "احجز موعد بناء",
    figuresNote: "أرقام تصورية لسيارة متخيَّلة.",
    cabinTitle: "من الداخل",
    driveLine: "مصمّمة للطريق الخارج من المدينة.",
    nightLine: "وللعودة إليها.",
    storyTitle: "سُمّيت على اسم الفارس",
    storyBody: "الخيّال بالعربية هو الفارس. وتحفظ السيارة الفكرة: خطوة طويلة ومقصورة هادئة وصبر صقّار ينتظر أول الضوء.",
    visitTitle: "احجز تجربة قيادة",
    visitIntro: "اختر صالة عرض ويوماً ووقتاً. يُحضر سائق السيارة إلى المنصة الدوّارة.",
    showroom: "صالة العرض",
    day: "اليوم",
    time: "الوقت",
    taken: "محجوز",
    book: "احجز هذه التجربة",
    pickTime: "اختر وقتاً أولاً.",
    yourDrive: (when: string, where: string) => `${when}، ${where}`,
    noticeTitle: "هنا كان سيُؤكَّد الطلب",
    noticeBody: "خيّال موقع تجريبي من زينيث دبي. السيارة والعلامة من الخيال، لذلك لم يُحجز شيء. وما زال تصميمك محفوظاً في هذه الصفحة.",
    noticeCta: "العودة إلى السيارة",
    noticeZenith: "تريد موقعاً كهذا؟",
    contactTitle: "تحدّث إلى خيّال",
    contactIntro: "خيّال علامة خيالية، لذلك تصل رسالتك هنا إلى زينيث دبي التي صمّمت هذا الموقع وبنته.",
    faqTitle: "أسئلة",
    footer: "خيّال علامة خيالية. الأرقام والأسعار والصور توضيحية ومولّدة بالذكاء الاصطناعي لهذا التصور.",
    footerBy: "الفكرة والتصميم والتنفيذ: زينيث دبي",
    backToGallery: "كل المواقع التجريبية",
    skip: "انتقل إلى التصميم الخاص",
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
    interests: ["طلب سيارة", "تجربة قيادة", "الملكية", "شيء آخر"],
  },
};
export type UIStrings = (typeof UI)["en"];
