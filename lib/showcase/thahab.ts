// THAHAB: a fictional camp of twelve tents in the Empty Quarter. A concept website by Zenith Dubai.
// The camp, its tents, prices and experiences are invented; the moon on each night is real
// (computed), and the booking stops at a notice before anything is sent.

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
const hf = (id: string) => `${CDN}${id}_min.webp`;
const crop = (id: string, W: number, H: number, boxes: number[][]) => boxes.map((b) => `crop:${CDN}${id}_min.webp#${W},${H},${b.join(",")}`);

export const IMG = {
  hero: hf("hf_20261126_204232_82f576cb-b046-4bca-a3d7-7031f74a1ee2"),
  heroTall: hf("hf_20261126_204258_db57a137-e791-4e77-afef-ea30449d5506"),
  aerial: hf("hf_20261126_205144_95832f81-76ec-4774-bba4-e9513cbc81ce"),
  oasis: hf("hf_20261126_205157_c7af2da2-4a14-47f8-8685-0b4528dc293d"),
  suite: hf("hf_20261126_210027_333b932f-3d22-46db-8543-0fca81bada00"),
  family: hf("hf_20261126_210039_5b60b424-efa5-4cbd-bbb3-6c475cea63fb"),
  arrival: hf("hf_20261126_212113_57fb5c1f-ce7d-4d07-a45d-b34f416ecbfb"),
};
export const GRID = {
  room: crop("hf_20261126_210710_4680b4f5-3334-4261-9224-a3207cbc1d3d", 1760, 2352, [[4, 23, 864, 1140], [894, 4, 862, 1159], [4, 1190, 864, 1158], [894, 1190, 862, 1158]]),
  dining: crop("hf_20261126_210732_bdf5d0cf-2931-421f-8fb2-57377d856285", 1760, 2352, [[4, 4, 866, 1160], [893, 4, 863, 1160], [4, 1188, 866, 1160], [893, 1188, 863, 1160]]),
  spa: crop("hf_20261126_211420_1c646845-86c2-44a2-aa52-f186e0ae30dd", 1760, 2352, [[4, 4, 860, 1157], [899, 4, 857, 1156], [4, 1195, 860, 1153], [899, 1195, 857, 1153]]),
  days: crop("hf_20261126_211502_2308757a-ec30-4802-99cc-689072291ce3", 2720, 1536, [[4, 4, 1343, 750], [1374, 4, 1342, 750], [4, 782, 1342, 750], [1374, 782, 1342, 750]]),
  night: crop("hf_20261126_212031_0eaa2b2f-fce8-4691-a48d-3f66852abfd6", 2048, 2048, [[4, 4, 1006, 1006], [1038, 4, 1006, 1006], [4, 1038, 1006, 1006], [1038, 1038, 1006, 1006]]),
};
export const ALT = {
  hero: { en: "Canvas tents along a dune ridge at golden hour", ar: "خيام قماشية على قمة كثيب عند الغروب" },
  heroTall: { en: "Looking out of a tent doorway at the dunes and the camp", ar: "النظر من باب خيمة إلى الكثبان والمخيم" },
  aerial: { en: "The camp from above, tents in a ring around the majlis", ar: "المخيم من الأعلى، والخيام في حلقة حول المجلس" },
  oasis: { en: "The camp's pool among the dunes in late light", ar: "مسبح المخيم بين الكثبان في ضوء متأخر" },
  suite: { en: "A dune suite: a four-poster bed, rugs and lanterns", ar: "جناح الكثيب: سرير بأعمدة وسجاد وفوانيس" },
  family: { en: "The family tent with a deck facing the dunes", ar: "خيمة العائلة بشرفة تطل على الكثبان" },
  arrival: { en: "A 4x4 cresting the dunes toward the camp at sunset", ar: "سيارة دفع رباعي تعبر الكثبان نحو المخيم عند الغروب" },
} satisfies Record<string, L>;

export const DAY: { time: string; name: L; note: L; img: string }[] = [
  { time: "05:40", name: { en: "Camels at first light", ar: "الجمال مع أول ضوء" }, note: { en: "An hour along the ridge before the sand warms.", ar: "ساعة على طول الكثيب قبل أن يسخن الرمل." }, img: GRID.days[0] },
  { time: "08:30", name: { en: "Breakfast on the deck", ar: "الفطور على الشرفة" }, note: { en: "Bread from the fire, dates, labneh, coffee.", ar: "خبز من النار وتمر ولبنة وقهوة." }, img: GRID.dining[3] },
  { time: "13:00", name: { en: "The heat, indoors", ar: "الحر، في الداخل" }, note: { en: "The spa tent and a copper bath in the shade.", ar: "خيمة السبا وحوض نحاسي في الظل." }, img: GRID.spa[1] },
  { time: "16:45", name: { en: "Down the big dune", ar: "نزولاً على الكثيب الكبير" }, note: { en: "Sandboards, then the walk back up.", ar: "ألواح الرمل ثم الصعود سيراً." }, img: GRID.days[1] },
  { time: "18:10", name: { en: "The falconer", ar: "الصقّار" }, note: { en: "A hood comes off as the sun goes.", ar: "يُنزع الغطاء مع غياب الشمس." }, img: GRID.days[3] },
  { time: "20:00", name: { en: "Dinner on the rugs", ar: "العشاء على السجاد" }, note: { en: "Lamb from the pit, lanterns, no menu.", ar: "لحم من الحفرة وفوانيس وبلا قائمة." }, img: GRID.dining[2] },
  { time: "22:30", name: { en: "The telescope", ar: "التلسكوب" }, note: { en: "On a dark night, the Milky Way to the horizon.", ar: "في الليلة المظلمة، درب التبانة حتى الأفق." }, img: GRID.days[2] },
];

export const TENTS: { id: string; name: L; note: L; img: string; sleeps: number; count: number; price: number }[] = [
  { id: "suite", name: { en: "Dune suite", ar: "جناح الكثيب" }, note: { en: "A four-poster bed, a stone bathroom and a terrace on the ridge.", ar: "سرير بأعمدة وحمام حجري وشرفة على الكثيب." }, img: IMG.suite, sleeps: 2, count: 9, price: 4800 },
  { id: "family", name: { en: "Family tent", ar: "خيمة العائلة" }, note: { en: "Two bedrooms joined by a deck facing the dunes.", ar: "غرفتا نوم تجمعهما شرفة تطل على الكثبان." }, img: IMG.family, sleeps: 4, count: 3, price: 7200 },
];
export const ROOM_TEXT: L[] = [
  { en: "Stone, folded towels, hot water from the sun", ar: "حجر ومناشف مطوية وماء ساخن من الشمس" },
  { en: "Your terrace at sunset", ar: "شرفتك عند الغروب" },
  { en: "A lamp and a book by the bed", ar: "مصباح وكتاب بجانب السرير" },
  { en: "The dunes from your pillow", ar: "الكثبان من وسادتك" },
];
export const NIGHT_TEXT: L[] = [
  { en: "Lanterns along the paths", ar: "فوانيس على الممرات" },
  { en: "Woven rugs from Liwa", ar: "سجاد منسوج من ليوا" },
  { en: "Canvas and rope", ar: "قماش وحبال" },
  { en: "Coffee on the embers", ar: "قهوة على الجمر" },
];

/* ───────── the moon ───────── */

const SYNODIC = 29.530588853;
/** Moon phase 0..1 (0 new, 0.5 full) and lit fraction for a date (UTC noon). */
export function moon(d: Date) {
  const jd = d.getTime() / 864e5 + 2440587.5;
  const phase = ((((jd - 2451550.1) / SYNODIC) % 1) + 1) % 1;
  const lit = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  return { phase, lit };
}
/** How dark the night sky gets, 0..1: the moon's light matters most when it is up all night. */
export const darkness = (lit: number) => Math.round((1 - lit) * 100) / 100;

export const TRANSFER: { id: string; name: L; note: L; price: number }[] = [
  { id: "drive", name: { en: "By 4x4 from Abu Dhabi", ar: "بالدفع الرباعي من أبوظبي" }, note: { en: "3 hours, the last 40 minutes on sand.", ar: "3 ساعات، آخر 40 دقيقة على الرمل." }, price: 0 },
  { id: "air", name: { en: "By helicopter", ar: "بالمروحية" }, note: { en: "45 minutes from the capital.", ar: "45 دقيقة من العاصمة." }, price: 9500 },
];

export const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "Is THAHAB a real camp?", ar: "هل ذهب مخيم حقيقي؟" },
    a: {
      en: "No. THAHAB, its tents, prices and experiences are fictional: a concept website designed and built by Zenith Dubai. The photographs are AI-generated and nothing can be booked. The moon phases are real.",
      ar: "لا. ذهب وخيامه وأسعاره وتجاربه من الخيال: موقع تجريبي صمّمته وبنته زينيث دبي. الصور مولّدة بالذكاء الاصطناعي ولا يمكن حجز شيء. أطوار القمر حقيقية.",
    },
  },
  { q: { en: "When is the best time to come?", ar: "ما أفضل وقت للزيارة؟" }, a: { en: "October to April, when nights are cool. For stars, choose nights near the new moon.", ar: "من أكتوبر إلى أبريل حين تبرد الليالي. وللنجوم، اختر الليالي القريبة من المحاق." } },
  { q: { en: "Is it suitable for children?", ar: "هل يناسب الأطفال؟" }, a: { en: "Yes, from six. The family tents sleep four.", ar: "نعم، من ست سنوات. تتسع خيام العائلة لأربعة." } },
];

const en = {
  tagline: "Twelve tents and the whole sky.",
  sub: "THAHAB is a camp on a dune ridge in the Empty Quarter: canvas suites, a fire, and nights dark enough to see the Milky Way rise.",
  plan: "Choose your nights",
  day: "A day here",
  nav: { day: "A day", tents: "Tents", dining: "Dining", sky: "The sky", arrive: "Getting here", contact: "Contact" },
  menu: "Menu",
  close: "Close",
  langName: "العربية",
  concept: "Concept website. THAHAB is fictional.",
  conceptShort: "Fictional camp",
  dayTitle: "A day here, from first light",
  tentsTitle: "Two kinds of tent",
  perNight: "a night",
  sleeps: (n: number) => `Sleeps ${n}`,
  count: (n: number) => `${n} on the ridge`,
  diningTitle: "Cooked over fire",
  diningNote: ["Lamb from the pit", "Dates and coffee", "Dinner under lanterns", "Breakfast on the deck"],
  skyTitle: "Choose your nights by the moon",
  skyIntro: "Each night shows the real moon over the Empty Quarter. The darker the night, the more stars.",
  arrive: "Arrive",
  nights: "Nights",
  tent: "Tent",
  transfer: "Getting here",
  darkest: (d: string, pct: number) => `Darkest night of your stay: ${d}, ${pct}% dark sky.`,
  fullWarn: "The moon is nearly full during your stay: beautiful dunes, fewer stars.",
  newGood: "A new moon falls in your stay: the Milky Way will be bright.",
  total: "Total",
  reserve: "Hold these nights",
  pickArrive: "Choose an arrival night.",
  tonight: "Tonight",
  arriveTitle: "Getting here",
  arriveBody: "The road ends forty minutes before the camp. From there a driver takes the dunes the old way, and you arrive with the sun going down.",
  placeTitle: "The ridge",
  placeBody: "Twelve tents in a ring around the majlis, a pool in the hollow, and nothing else for ninety kilometres.",
  materialsTitle: "After dark",
  noticeTitle: "This is where your nights would be held",
  noticeBody: "THAHAB is a concept website by Zenith Dubai. The camp is invented, so nothing was reserved. The moons were real, though.",
  noticeCta: "Back to the camp",
  noticeZenith: "Want a website like this?",
  contactTitle: "Write to the camp",
  contactIntro: "THAHAB is fictional, so a message here reaches Zenith Dubai, who designed and built this website.",
  faqTitle: "Questions",
  footer: "THAHAB is a fictional camp. Tents, prices and photographs are illustrative and AI-generated for this concept; moon phases are calculated.",
  footerBy: "Concept, design and build by Zenith Dubai",
  backToGallery: "All concept websites",
  skip: "Skip to the night planner",
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
  interests: ["A stay", "A private buy-out", "A celebration", "Something else"],
};
export const UI: Record<Lang, typeof en> = {
  en,
  ar: {
    tagline: "اثنتا عشرة خيمة والسماء كلها.",
    sub: "ذهب مخيم على قمة كثيب في الربع الخالي: أجنحة من القماش ونار وليالٍ مظلمة بما يكفي لترى درب التبانة يرتفع.",
    plan: "اختر لياليك",
    day: "يوم هنا",
    nav: { day: "اليوم", tents: "الخيام", dining: "الطعام", sky: "السماء", arrive: "الوصول", contact: "تواصل" },
    menu: "القائمة",
    close: "إغلاق",
    langName: "English",
    concept: "موقع تجريبي. ذهب مخيم خيالي.",
    conceptShort: "مخيم خيالي",
    dayTitle: "يوم هنا، من أول الضوء",
    tentsTitle: "نوعان من الخيام",
    perNight: "لليلة",
    sleeps: (n: number) => `يتسع لـ${n}`,
    count: (n: number) => `${n} على الكثيب`,
    diningTitle: "مطبوخ على النار",
    diningNote: ["لحم من الحفرة", "تمر وقهوة", "عشاء تحت الفوانيس", "فطور على الشرفة"],
    skyTitle: "اختر لياليك حسب القمر",
    skyIntro: "تعرض كل ليلة القمر الحقيقي فوق الربع الخالي. كلما أظلمت الليلة زادت النجوم.",
    arrive: "الوصول",
    nights: "الليالي",
    tent: "الخيمة",
    transfer: "طريقة الوصول",
    darkest: (d: string, pct: number) => `أظلم ليلة في إقامتك: ${d}، سماء مظلمة بنسبة ${pct}٪.`,
    fullWarn: "القمر قرب البدر خلال إقامتك: كثبان جميلة ونجوم أقل.",
    newGood: "يقع المحاق في إقامتك: سيكون درب التبانة ساطعاً.",
    total: "المجموع",
    reserve: "احجز هذه الليالي",
    pickArrive: "اختر ليلة الوصول.",
    tonight: "الليلة",
    arriveTitle: "الوصول",
    arriveBody: "ينتهي الطريق قبل المخيم بأربعين دقيقة. ومن هناك يعبر السائق الكثبان على الطريقة القديمة، فتصل مع غروب الشمس.",
    placeTitle: "الكثيب",
    placeBody: "اثنتا عشرة خيمة في حلقة حول المجلس، ومسبح في المنخفض، ولا شيء آخر لتسعين كيلومتراً.",
    materialsTitle: "بعد الغروب",
    noticeTitle: "هنا كانت ستُحجز لياليك",
    noticeBody: "ذهب موقع تجريبي من زينيث دبي. المخيم من الخيال، لذلك لم يُحجز شيء. أما الأقمار فكانت حقيقية.",
    noticeCta: "العودة إلى المخيم",
    noticeZenith: "تريد موقعاً كهذا؟",
    contactTitle: "راسل المخيم",
    contactIntro: "ذهب مخيم خيالي، لذلك تصل رسالتك هنا إلى زينيث دبي التي صمّمت هذا الموقع وبنته.",
    faqTitle: "أسئلة",
    footer: "ذهب مخيم خيالي. الخيام والأسعار والصور توضيحية ومولّدة بالذكاء الاصطناعي لهذا التصور، وأطوار القمر محسوبة.",
    footerBy: "الفكرة والتصميم والتنفيذ: زينيث دبي",
    backToGallery: "كل المواقع التجريبية",
    skip: "انتقل إلى مخطط الليالي",
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
    interests: ["إقامة", "حجز المخيم كاملاً", "احتفال", "شيء آخر"],
  },
};
export type UIStrings = typeof en;
export const aed = (n: number, lang: Lang) => (lang === "ar" ? `${n.toLocaleString("en")} درهم` : `AED ${n.toLocaleString("en")}`);
