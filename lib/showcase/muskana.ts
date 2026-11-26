// MUSKANA: a fictional oud and fragrance house in Dubai. A concept website by Zenith Dubai. The
// house, its scents and prices are invented; the layering builder and the bag work end to end and
// stop at a notice before any payment.

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
const hf = (id: string) => `${CDN}${id}_min.webp`;
const crop = (id: string, W: number, H: number, boxes: number[][]) => boxes.map((b) => `crop:${CDN}${id}_min.webp#${W},${H},${b.join(",")}`);

export const IMG = {
  hero: hf("hf_20261126_165152_2e7cf649-5da6-451b-b851-548c08ff1074"),
  heroTall: hf("hf_20261126_165508_3ebb7ef2-51c0-499c-807d-50fa44125605"),
  lookbook: hf("hf_20261126_171812_34556306-e1c8-457f-a566-4a60533d893c"),
  store: hf("hf_20261126_171958_fc5ba562-b6bf-430a-bc6a-65ad72c6b6bd"),
  gift: hf("hf_20261126_172431_d22ff276-86a0-4ee2-8492-3091c92ab6c5"),
};
export const GRID = {
  shopA: crop("hf_20261126_165747_94d04f2f-b261-4b0d-8486-193038b460b7", 2048, 2048, [[38, 38, 967, 965], [1043, 38, 967, 965], [38, 1043, 967, 966], [1044, 1043, 966, 966]]),
  shopB: crop("hf_20261126_165955_8ab40ec9-4082-4195-86cd-fad7558304b2", 2048, 2048, [[33, 35, 971, 969], [1044, 35, 970, 969], [33, 1044, 971, 969], [1044, 1044, 970, 969]]),
  details: crop("hf_20261126_171142_e068e75b-1397-4b79-9cc5-865dbaa5a034", 2048, 2048, [[29, 29, 977, 976], [1043, 29, 976, 976], [29, 1041, 977, 977], [1042, 1042, 977, 976]]),
  craft: crop("hf_20261126_171412_30d7cb9c-da40-4dc0-8a5c-2978efd9316b", 1760, 2352, [[23, 28, 843, 1134], [896, 28, 845, 1134], [24, 1192, 842, 1134], [896, 1192, 845, 1134]]),
};
export const ALT = {
  hero: { en: "A faceted crystal bottle with a gold cap on black stone, oud smoke rising", ar: "زجاجة كريستال مضلّعة بغطاء ذهبي على حجر أسود ودخان العود يتصاعد" },
  heroTall: { en: "The crystal bottle on a carved plinth in warm light", ar: "زجاجة الكريستال على قاعدة منحوتة في ضوء دافئ" },
  lookbook: { en: "A man in a white kandura holding the bottle near his wrist", ar: "رجل بكندورة بيضاء يمسك الزجاجة قرب معصمه" },
  store: { en: "The boutique: dark wood shelves in warm gold light", ar: "البوتيك: رفوف من الخشب الداكن في ضوء ذهبي دافئ" },
  gift: { en: "A black lacquered gift box opened on a table with candles", ar: "علبة هدايا سوداء مطلية مفتوحة على طاولة مع شموع" },
} satisfies Record<string, L>;

/* ───────── the shop ───────── */

export interface Product {
  id: string;
  img: string;
  name: L;
  kind: L;
  size: string;
  price: number;
}
export const PRODUCTS: Product[] = [
  { id: "oud-oil", img: GRID.shopA[0], name: { en: "Hindi oud oil", ar: "دهن العود الهندي" }, kind: { en: "Oil", ar: "دهن" }, size: "3 ml", price: 680 },
  { id: "amber", img: GRID.shopA[1], name: { en: "Amber nights", ar: "ليالي العنبر" }, kind: { en: "Eau de parfum", ar: "ماء عطر" }, size: "50 ml", price: 540 },
  { id: "rose", img: GRID.shopA[2], name: { en: "Taif rose attar", ar: "عطر الورد الطائفي" }, kind: { en: "Attar", ar: "عطر زيتي" }, size: "6 ml", price: 420 },
  { id: "musk", img: GRID.shopA[3], name: { en: "White musk mist", ar: "رذاذ المسك الأبيض" }, kind: { en: "Spray", ar: "بخاخ" }, size: "100 ml", price: 260 },
  { id: "bakhoor", img: GRID.shopB[0], name: { en: "Bakhoor, house blend", ar: "بخور، خلطة الدار" }, kind: { en: "Incense", ar: "بخور" }, size: "60 g", price: 190 },
  { id: "burner", img: GRID.shopB[1], name: { en: "Carved mabkhara", ar: "مبخرة منحوتة" }, kind: { en: "Burner", ar: "مبخرة" }, size: "—", price: 850 },
  { id: "travel", img: GRID.shopB[2], name: { en: "Travel atomiser", ar: "بخاخة السفر" }, kind: { en: "Refillable", ar: "قابلة لإعادة التعبئة" }, size: "8 ml", price: 310 },
  { id: "giftset", img: GRID.shopB[3], name: { en: "The majlis set", ar: "طقم المجلس" }, kind: { en: "Gift set", ar: "طقم هدايا" }, size: "4 pieces", price: 1_450 },
];
export const DETAILS: L[] = [
  { en: "Agarwood, aged twelve years", ar: "خشب العود، معتّق اثنتي عشرة سنة" },
  { en: "One drop is a whole evening", ar: "قطرة واحدة تكفي سهرة كاملة" },
  { en: "Smoke from the house bakhoor", ar: "دخان بخور الدار" },
  { en: "A cap cast in solid brass, gilded", ar: "غطاء مصبوب من النحاس الأصفر ومذهّب" },
];
export const CRAFT: { name: L; note: L }[] = [
  { name: { en: "The organ", ar: "الأورغن" }, note: { en: "Three hundred materials within reach of one chair.", ar: "ثلاثمئة مادة في متناول كرسي واحد." } },
  { name: { en: "Shaving the wood", ar: "كشط الخشب" }, note: { en: "Only the dark, resinous heart is kept.", ar: "لا يُحفظ إلا القلب الداكن المشبع بالراتنج." } },
  { name: { en: "The still", ar: "التقطير" }, note: { en: "Copper, slow fire, eleven days.", ar: "نحاس ونار هادئة وأحد عشر يوماً." } },
  { name: { en: "Weighed by hand", ar: "يوزن باليد" }, note: { en: "Every batch to a tenth of a gram.", ar: "كل دفعة إلى عُشر الغرام." } },
];

/* ───────── the layering builder ───────── */

export interface Note {
  id: string;
  name: L;
  word: L;
  color: string;
  strength: number; // 1..5
  hours: number;
}
export const LAYERS: { id: "base" | "heart" | "top"; name: L; hint: L; notes: Note[] }[] = [
  {
    id: "base",
    name: { en: "Base: the oud", ar: "القاعدة: العود" },
    hint: { en: "Goes on first, on the pulse points.", ar: "يوضع أولاً على نقاط النبض." },
    notes: [
      { id: "hindi", name: { en: "Hindi oud", ar: "عود هندي" }, word: { en: "Hindi oud", ar: "العود الهندي" }, color: "#3b2414", strength: 5, hours: 14 },
      { id: "cambodi", name: { en: "Cambodi oud", ar: "عود كمبودي" }, word: { en: "Cambodi oud", ar: "العود الكمبودي" }, color: "#5a3518", strength: 4, hours: 12 },
      { id: "sandal", name: { en: "Sandal oud", ar: "عود الصندل" }, word: { en: "sandalwood", ar: "الصندل" }, color: "#7a4f2a", strength: 3, hours: 10 },
    ],
  },
  {
    id: "heart",
    name: { en: "Heart: the flower or the resin", ar: "القلب: الزهرة أو الراتنج" },
    hint: { en: "A minute later, on the same places.", ar: "بعد دقيقة، على المواضع نفسها." },
    notes: [
      { id: "rose", name: { en: "Taif rose", ar: "ورد طائفي" }, word: { en: "Taif rose", ar: "الورد الطائفي" }, color: "#9c3346", strength: 3, hours: 6 },
      { id: "amber", name: { en: "Amber", ar: "عنبر" }, word: { en: "amber", ar: "العنبر" }, color: "#b8731f", strength: 4, hours: 8 },
      { id: "saffron", name: { en: "Saffron", ar: "زعفران" }, word: { en: "saffron", ar: "الزعفران" }, color: "#c8541c", strength: 3, hours: 5 },
    ],
  },
  {
    id: "top",
    name: { en: "Top: the light", ar: "القمة: النفحة الخفيفة" },
    hint: { en: "Last, sprayed on clothes and hair.", ar: "أخيراً، رشاً على الملابس والشعر." },
    notes: [
      { id: "musk", name: { en: "White musk", ar: "مسك أبيض" }, word: { en: "white musk", ar: "المسك الأبيض" }, color: "#e8dfcf", strength: 2, hours: 6 },
      { id: "bergamot", name: { en: "Bergamot", ar: "برغموت" }, word: { en: "bergamot", ar: "البرغموت" }, color: "#c9c25a", strength: 2, hours: 2 },
      { id: "cardamom", name: { en: "Cardamom", ar: "هيل" }, word: { en: "cardamom", ar: "الهيل" }, color: "#7f9a5c", strength: 2, hours: 3 },
    ],
  },
];
export type Blend = { base: string; heart: string; top: string };
export const DEFAULT_BLEND: Blend = { base: "hindi", heart: "rose", top: "musk" };
export const noteOf = (layer: "base" | "heart" | "top", id: string) => LAYERS.find((l) => l.id === layer)!.notes.find((n) => n.id === id) ?? LAYERS.find((l) => l.id === layer)!.notes[0];
export const BLEND_PRICE = 890;
export function blendFacts(b: Blend) {
  const n = [noteOf("base", b.base), noteOf("heart", b.heart), noteOf("top", b.top)];
  return { strength: Math.round((n[0].strength * 3 + n[1].strength * 2 + n[2].strength) / 6 * 10) / 10, hours: Math.max(...n.map((x) => x.hours)), notes: n };
}

export const FREE_DELIVERY = 500;
export const aed = (n: number, lang: Lang) => (lang === "ar" ? `${n.toLocaleString("en")} درهم` : `AED ${n.toLocaleString("en")}`);

export const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "Is MUSKANA a real perfume house?", ar: "هل مُسكانة دار عطور حقيقية؟" },
    a: {
      en: "No. MUSKANA, its scents and prices are fictional: a concept website designed and built by Zenith Dubai. The photographs are AI-generated and nothing can be bought here.",
      ar: "لا. مُسكانة وعطورها وأسعارها من الخيال: موقع تجريبي صمّمته وبنته زينيث دبي. الصور مولّدة بالذكاء الاصطناعي ولا يمكن شراء أي شيء هنا.",
    },
  },
  { q: { en: "What is layering?", ar: "ما هو تطبيق الطبقات؟" }, a: { en: "Wearing an oil, an attar and a spray one over the other, from heaviest to lightest, so the scent changes through the day.", ar: "وضع دهن ثم عطر زيتي ثم بخاخ فوق بعضها، من الأثقل إلى الأخف، فيتغير العطر خلال اليوم." } },
  { q: { en: "How long does oud oil last?", ar: "كم يدوم دهن العود؟" }, a: { en: "On skin, most of a day. On a scarf, sometimes a week.", ar: "على الجلد معظم اليوم، وعلى الوشاح أحياناً أسبوعاً." } },
];

export const UI = {
  en: {
    tagline: "Wear it in layers.",
    sub: "MUSKANA is an oud house in Dubai: oils, attars and bakhoor, made to be worn one over the other.",
    build: "Layer your own",
    shop: "Shop",
    nav: { layer: "Layering", shop: "Shop", craft: "Craft", gift: "Gifting", stores: "Boutique", contact: "Contact" },
    menu: "Menu",
    close: "Close",
    langName: "العربية",
    concept: "Concept website. MUSKANA is fictional.",
    conceptShort: "Fictional house",
    layerTitle: "Layer your own",
    layerIntro: "Pick one note for each layer. The bottle fills in the order you would wear them.",
    yourBlend: "Your blend",
    blendName: (top: string, heart: string, base: string) => `${cap(top)} over ${heart}, on ${base}`,
    strength: "Strength",
    lasts: "Lasts",
    hours: (n: number) => `about ${n} hours`,
    order: "How to wear it",
    setOf: "Three 12 ml bottles",
    addBlend: "Add the set to the bag",
    shopTitle: "The shop",
    add: "Add",
    added: "Added",
    detailsTitle: "Up close",
    craftTitle: "How it is made",
    lookTitle: "Worn close",
    lookBody: "Oud is worn on the wrist, behind the ear and on the cuff of the kandura, where the warmth of the skin keeps it moving.",
    giftTitle: "Wrapped by hand",
    giftBody: "Every order leaves the boutique in black lacquer and gold paper, with a card written by hand. Delivery in Dubai the same evening.",
    storeTitle: "The boutique",
    storeBody: "One room in Al Seef with three hundred bottles and a mabkhara always lit. Open 10:00 to 23:00.",
    bag: "Bag",
    bagEmpty: "Your bag is empty. The layering set is a good place to start.",
    subtotal: "Subtotal",
    delivery: "Delivery",
    free: "Free",
    toFree: (n: string) => `${n} more for free delivery`,
    checkout: "Checkout",
    remove: "Remove",
    qty: "Quantity",
    noticeTitle: "This is where you would pay",
    noticeBody: "MUSKANA is a concept website by Zenith Dubai. The house and its scents are invented, so nothing has been charged or sent. Your bag is still saved on this page.",
    noticeCta: "Back to the house",
    noticeZenith: "Want a website like this?",
    contactTitle: "Ask the perfumer",
    contactIntro: "MUSKANA is fictional, so a message here reaches Zenith Dubai, who designed and built this website.",
    faqTitle: "Questions",
    footer: "MUSKANA is a fictional perfume house. Scents, prices and photographs are illustrative and AI-generated for this concept.",
    footerBy: "Concept, design and build by Zenith Dubai",
    backToGallery: "All concept websites",
    skip: "Skip to the layering builder",
    form: {
      name: "Your name",
      email: "Email",
      interest: "About",
      message: "Your question",
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
    interests: ["A scent for me", "A gift", "A wedding or event", "Something else"],
  },
  ar: {
    tagline: "تعطّر طبقةً فوق طبقة.",
    sub: "مُسكانة دار عود في دبي: دهون وعطور زيتية وبخور، صُنعت لتُلبس الواحدة فوق الأخرى.",
    build: "اصنع خلطتك",
    shop: "المتجر",
    nav: { layer: "الطبقات", shop: "المتجر", craft: "الصنعة", gift: "الهدايا", stores: "البوتيك", contact: "تواصل" },
    menu: "القائمة",
    close: "إغلاق",
    langName: "English",
    concept: "موقع تجريبي. مُسكانة دار خيالية.",
    conceptShort: "دار خيالية",
    layerTitle: "اصنع خلطتك",
    layerIntro: "اختر نفحة لكل طبقة. تمتلئ الزجاجة بالترتيب الذي تضعها به.",
    yourBlend: "خلطتك",
    blendName: (top: string, heart: string, base: string) => `${top} فوق ${heart}، على ${base}`,
    strength: "القوة",
    lasts: "الثبات",
    hours: (n: number) => `نحو ${n} ساعة`,
    order: "كيف تضعه",
    setOf: "ثلاث زجاجات سعة 12 مل",
    addBlend: "أضف الطقم إلى الحقيبة",
    shopTitle: "المتجر",
    add: "أضف",
    added: "أُضيف",
    detailsTitle: "عن قرب",
    craftTitle: "كيف يُصنع",
    lookTitle: "قريباً من الجلد",
    lookBody: "يوضع العود على المعصم وخلف الأذن وعلى كمّ الكندورة، حيث يبقيه دفء الجلد حيّاً.",
    giftTitle: "مغلّف باليد",
    giftBody: "يغادر كل طلب البوتيك في علبة سوداء مطلية وورق ذهبي مع بطاقة مكتوبة باليد. التوصيل في دبي في المساء نفسه.",
    storeTitle: "البوتيك",
    storeBody: "غرفة واحدة في السيف فيها ثلاثمئة زجاجة ومبخرة مشتعلة دائماً. مفتوح من 10:00 حتى 23:00.",
    bag: "الحقيبة",
    bagEmpty: "حقيبتك فارغة. طقم الطبقات بداية جيدة.",
    subtotal: "المجموع الفرعي",
    delivery: "التوصيل",
    free: "مجاني",
    toFree: (n: string) => `${n} إضافية للتوصيل المجاني`,
    checkout: "إتمام الطلب",
    remove: "إزالة",
    qty: "الكمية",
    noticeTitle: "هنا كنت ستدفع",
    noticeBody: "مُسكانة موقع تجريبي من زينيث دبي. الدار وعطورها من الخيال، لذلك لم يُخصم أي مبلغ ولم يُرسل شيء. وما زالت حقيبتك محفوظة في هذه الصفحة.",
    noticeCta: "العودة إلى الدار",
    noticeZenith: "تريد موقعاً كهذا؟",
    contactTitle: "اسأل العطّار",
    contactIntro: "مُسكانة دار خيالية، لذلك تصل رسالتك هنا إلى زينيث دبي التي صمّمت هذا الموقع وبنته.",
    faqTitle: "أسئلة",
    footer: "مُسكانة دار عطور خيالية. العطور والأسعار والصور توضيحية ومولّدة بالذكاء الاصطناعي لهذا التصور.",
    footerBy: "الفكرة والتصميم والتنفيذ: زينيث دبي",
    backToGallery: "كل المواقع التجريبية",
    skip: "انتقل إلى صانع الخلطات",
    form: {
      name: "اسمك",
      email: "البريد الإلكتروني",
      interest: "الموضوع",
      message: "سؤالك",
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
    interests: ["عطر لي", "هدية", "زفاف أو مناسبة", "شيء آخر"],
  },
};
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export type UIStrings = (typeof UI)["en"];
