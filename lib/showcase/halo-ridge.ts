// Halo Ridge — a fictional villa community, built by Zenith Dubai as a concept website.
// Every name, number and price here is illustrative. Nothing describes a real development.

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

/** One generated asset. `url` stays null until the asset exists; the page then falls back gracefully. */
export interface Asset {
  url: string | null;
  /** Where it came from, for the manifest: model, route (website or connector), job id, credits. */
  model?: string;
  route?: "website" | "connector";
  job?: string;
  credits?: number;
  /** The untouched original, when the page uses a processed copy. */
  source?: string;
}

export interface Scene {
  id: string;
  /** Opening frame of the move, shown while the clip loads and as the still when there is no clip. */
  still: Asset;
  /** The scrubbed clip for this move (5 s), starting on `still` and ending on the next scene's still. */
  clip: Asset;
  /** Where the camera pushes in when the scene is a still: percentages of the frame. */
  focus: { x: number; y: number };
  kicker: L;
  title: L;
  body: L;
  /** Optional facts shown at the station, label then value. */
  facts?: { label: L; value: L }[];
}

const none: Asset = { url: null };

/** Generated on higgsfield.ai with Seedream 5.0 Pro in unlimited mode: no credits used. */
const seedream = (file: string): Asset => ({
  url: `https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/${file}_min.webp`,
  model: "Seedream 5.0 Pro, 2K, 16:9",
  route: "website",
  job: file,
  credits: 0,
});

/**
 * A scrubbed clip made through the Higgsfield connector: MiniMax H3, start and end frame, 10 credits.
 * The page plays a web copy re-encoded in Higgsfield's sandbox (1280 x 720, H.264, a keyframe every
 * 8 frames, no audio), so a scroll seek takes about 8 ms instead of about 110 ms on the 2K original.
 */
const minimax = (file: string, web: string): Asset => ({
  url: `https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/${web}.mp4`,
  source: `https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/${file}.mp4`,
  model: "MiniMax H3, 2K, 5 s, start and end frame",
  route: "connector",
  job: file.slice(-36),
  credits: 10,
});

export { sized, srcSet } from "./media";

export const SCENES: Scene[] = [
  {
    id: "arrival",
    still: seedream("hf_20261126_001957_11af7275-f38e-44b7-95e1-c0ac392e3b20"),
    clip: minimax("hf_20261126_002942_1f0f2e0c-a9b3-459f-af12-1fed73fca96e", "e812e913-0ecc-4b1a-88c5-a5edf710b613"), focus: { x: 50, y: 52 },
    kicker: { en: "Halo Ridge", ar: "هالو ريدج" },
    title: { en: "A crescent of 64 villas on the edge of the desert", ar: "هلال من 64 فيلا على حافة الصحراء" },
    body: { en: "Scroll to fly in. You land at the door of Villa 17.", ar: "مرّر للأسفل لتطير إلى الداخل. ستهبط عند باب الفيلا 17." },
  },
  {
    id: "avenue",
    still: seedream("hf_20261126_002156_0940a123-30c7-4806-8435-2df90ea61442"),
    clip: minimax("hf_20261126_003506_1f4182d7-1d2c-4800-b19f-9d09f24b4762", "db6e5581-6249-47c5-925c-a28a771f86e3"), focus: { x: 50, y: 45 },
    kicker: { en: "The avenue", ar: "الجادة" },
    title: { en: "Four streets, each opening onto the lake", ar: "أربعة شوارع، كل منها يطل على البحيرة" },
    body: { en: "Every street ends at the water, so every villa is a short walk from the park.", ar: "ينتهي كل شارع عند الماء، فتبقى كل فيلا على بعد خطوات من الحديقة." },
    facts: [
      { label: { en: "Villas", ar: "الفلل" }, value: { en: "64 in four streets", ar: "64 في أربعة شوارع" } },
      { label: { en: "Left on Lake Street", ar: "المتبقي في شارع البحيرة" }, value: { en: "3", ar: "3" } },
    ],
  },
  {
    id: "street",
    still: seedream("hf_20261126_002159_967d3be7-a68d-434e-bd66-2132cd39dbc9"),
    clip: minimax("hf_20261126_003508_0c3fcf0b-2da4-42c8-a9df-e23d40c4884a", "59e74a1b-bfbb-456f-81f2-d83e33f2c51c"), focus: { x: 52, y: 52 },
    kicker: { en: "Lake Street", ar: "شارع البحيرة" },
    title: { en: "Palms, shade and nothing faster than a bicycle", ar: "نخيل وظل، ولا شيء أسرع من الدراجة" },
    body: { en: "Cars stay at the edge. The street belongs to the people who live on it.", ar: "تبقى السيارات على الأطراف. الشارع لمن يسكنه." },
  },
  {
    id: "villa",
    still: seedream("hf_20261126_001926_16cea4b9-f4e2-458f-b42f-01e37241980a"),
    clip: minimax("hf_20261126_003510_25c9087f-289b-4947-a3f6-90dfa44da9d3", "83afef72-9f01-45ae-91cf-322703afef3c"), focus: { x: 52, y: 55 },
    kicker: { en: "Villa 17", ar: "الفيلا 17" },
    title: { en: "The Lake Villa", ar: "فيلا البحيرة" },
    body: { en: "Travertine, oak and glass, set back behind a planted courtyard.", ar: "ترافرتين وخشب البلوط والزجاج، خلف فناء مزروع." },
    facts: [
      { label: { en: "Bedrooms", ar: "غرف النوم" }, value: { en: "5", ar: "5" } },
      { label: { en: "Built-up", ar: "المساحة المبنية" }, value: { en: "6,900 ft²", ar: "6,900 قدم²" } },
      { label: { en: "Plot", ar: "الأرض" }, value: { en: "9,800 ft²", ar: "9,800 قدم²" } },
      { label: { en: "View", ar: "الإطلالة" }, value: { en: "Lake and skyline", ar: "البحيرة والأفق" } },
    ],
  },
  {
    id: "entrance",
    still: seedream("hf_20261126_002357_aaf51ebb-646e-4635-87bc-70a59a3f2d4a"),
    clip: minimax("hf_20261126_003512_5c38cce6-095e-48d4-bbe9-539dd0e2ba80", "a4d3221e-ba9b-48ed-b8c7-6e1aec11c27e"), focus: { x: 42, y: 50 },
    kicker: { en: "Arrival court", ar: "فناء الوصول" },
    title: { en: "A pivot door in solid oak, 3.6 metres tall", ar: "باب محوري من البلوط الصلب بارتفاع 3.6 متر" },
    body: { en: "The court is planted with olive and ghaf, and the path is lit from the ground.", ar: "الفناء مزروع بالزيتون والغاف، والممر مضاء من الأرض." },
  },
  {
    id: "hall",
    still: seedream("hf_20261126_002549_dd388285-9656-46d8-8cdc-41574254a838"),
    clip: minimax("hf_20261126_003514_4b733c4e-c40f-4dbe-a33e-4cd48e96338b", "17f8b721-73be-4ebc-8605-8f393d8b214c"), focus: { x: 55, y: 45 },
    kicker: { en: "Ground floor", ar: "الطابق الأرضي" },
    title: { en: "A double-height hall under a skylight", ar: "قاعة بارتفاع مزدوج تحت مَنوَر" },
    body: { en: "Light falls 7 metres from the roof to the floor, and the stair seems to float.", ar: "ينزل الضوء سبعة أمتار من السقف إلى الأرض، ويبدو الدرج كأنه معلّق." },
  },
  {
    id: "living",
    still: seedream("hf_20261126_002600_1e04c179-59aa-456c-b6f0-cea3382b7fb2"),
    clip: minimax("hf_20261126_003517_a2b769a4-b977-4f8f-a73a-308ce9f45364", "0afc832d-f7f2-4a17-921c-20bf0227645a"), focus: { x: 52, y: 48 },
    kicker: { en: "Living, dining, kitchen", ar: "المعيشة والطعام والمطبخ" },
    title: { en: "One room, 16 metres of glass to the lake", ar: "غرفة واحدة و16 مترًا من الزجاج نحو البحيرة" },
    body: { en: "The kitchen island faces the water, and the glass slides away completely.", ar: "جزيرة المطبخ تواجه الماء، والزجاج ينزلق بالكامل." },
  },
  {
    id: "terrace",
    still: seedream("hf_20261126_002747_0b08622e-e2ed-4f85-9d07-d41292fc7e24"),
    clip: minimax("hf_20261126_003913_34b8026a-2e60-4a51-a4e4-8b6e0e072b70", "998cb988-88dc-485c-ac20-ce1e191d47d5"), focus: { x: 45, y: 60 },
    kicker: { en: "Terrace", ar: "التراس" },
    title: { en: "A 14-metre pool that runs toward the lake", ar: "مسبح بطول 14 مترًا يمتد نحو البحيرة" },
    body: { en: "Facing west, so the evening sun sets over the water.", ar: "يواجه الغرب، فتغيب شمس المساء فوق الماء." },
  },
  {
    id: "dusk",
    still: seedream("hf_20261126_002403_153c7719-9940-4157-9d58-30930bcff11f"),
    clip: minimax("hf_20261126_003913_81ba5b59-f251-4143-b277-ff484a2e4872", "039c1e33-b4b5-455f-8d70-f82e83199417"), focus: { x: 50, y: 52 },
    kicker: { en: "From the garden", ar: "من الحديقة" },
    title: { en: "The house, looking back at dusk", ar: "البيت عند الغسق، من الحديقة" },
    body: { en: "Every distance below is illustrative until the location is final.", ar: "كل المسافات أدناه توضيحية حتى يتحدد الموقع." },
    facts: [
      { label: { en: "City centre", ar: "وسط المدينة" }, value: { en: "18 min", ar: "18 دقيقة" } },
      { label: { en: "Airport", ar: "المطار" }, value: { en: "25 min", ar: "25 دقيقة" } },
      { label: { en: "Beach", ar: "الشاطئ" }, value: { en: "20 min", ar: "20 دقيقة" } },
    ],
  },
  {
    id: "rise",
    still: seedream("hf_20261126_002910_15757aad-b57d-417e-b9f4-6247acac537c"), clip: none, focus: { x: 50, y: 50 },
    kicker: { en: "Halo Ridge", ar: "هالو ريدج" },
    title: { en: "Back to the sky, and the whole crescent", ar: "عودة إلى السماء، والهلال كاملًا" },
    body: { en: "Clubhouse, lagoon pool, 4.2 km of shaded trails. Book a private viewing below.", ar: "النادي ومسبح البحيرة و4.2 كم من الممرات المظللة. احجز معاينة خاصة في الأسفل." },
  },
];

export const RESIDENCES = [
  { id: "courtyard", name: { en: "Courtyard Villa", ar: "فيلا الفناء" }, beds: 4, built: 5200, plot: 7400, count: 28, note: { en: "Rooms around a shaded inner court", ar: "غرف حول فناء داخلي مظلل" } },
  { id: "lake", name: { en: "Lake Villa", ar: "فيلا البحيرة" }, beds: 5, built: 6900, plot: 9800, count: 24, note: { en: "Living space opening onto the water", ar: "مساحة معيشة تنفتح على الماء" } },
  { id: "ridge", name: { en: "Ridge Mansion", ar: "قصر الهضبة" }, beds: 6, built: 9400, plot: 14200, count: 12, note: { en: "On the high ground, with a roof terrace", ar: "على المرتفع، مع سطح مفتوح" } },
] as const;

/** Floor plan of the Lake Villa, in metres on a 24 × 16 grid. `scene` links a room to its moment in the flight. */
export const FLOORS = [
  {
    id: "ground", name: { en: "Ground floor", ar: "الطابق الأرضي" },
    rooms: [
      { id: "court", name: { en: "Arrival court", ar: "فناء الوصول" }, x: 0, y: 0, w: 6, h: 16, area: 96, scene: "entrance" },
      { id: "hall", name: { en: "Hall", ar: "القاعة" }, x: 6, y: 5, w: 5, h: 6, area: 30, scene: "hall" },
      { id: "living", name: { en: "Living and dining", ar: "المعيشة والطعام" }, x: 11, y: 0, w: 13, h: 10, area: 130, scene: "living" },
      { id: "kitchen", name: { en: "Kitchen", ar: "المطبخ" }, x: 11, y: 10, w: 7, h: 6, area: 42, scene: "living" },
      { id: "guest", name: { en: "Guest suite", ar: "جناح الضيوف" }, x: 6, y: 11, w: 5, h: 5, area: 25, scene: null },
      { id: "study", name: { en: "Study", ar: "المكتب" }, x: 6, y: 0, w: 5, h: 5, area: 25, scene: null },
      { id: "pool", name: { en: "Terrace and pool", ar: "التراس والمسبح" }, x: 18, y: 10, w: 6, h: 6, area: 36, scene: "terrace" },
    ],
  },
  {
    id: "first", name: { en: "First floor", ar: "الطابق الأول" },
    rooms: [
      { id: "primary", name: { en: "Principal suite", ar: "الجناح الرئيسي" }, x: 11, y: 0, w: 13, h: 9, area: 117, scene: null },
      { id: "bed2", name: { en: "Bedroom 2", ar: "غرفة النوم 2" }, x: 0, y: 0, w: 6, h: 7, area: 42, scene: null },
      { id: "bed3", name: { en: "Bedroom 3", ar: "غرفة النوم 3" }, x: 0, y: 9, w: 6, h: 7, area: 42, scene: null },
      { id: "void", name: { en: "Open to the hall", ar: "مفتوح على القاعة" }, x: 6, y: 5, w: 5, h: 6, area: 30, scene: "hall" },
      { id: "bed4", name: { en: "Bedroom 4", ar: "غرفة النوم 4" }, x: 11, y: 9, w: 7, h: 7, area: 49, scene: null },
      { id: "family", name: { en: "Family room", ar: "غرفة العائلة" }, x: 18, y: 9, w: 6, h: 7, area: 42, scene: null },
    ],
  },
  {
    id: "roof", name: { en: "Roof", ar: "السطح" },
    rooms: [
      { id: "roofdeck", name: { en: "Roof terrace", ar: "تراس السطح" }, x: 11, y: 0, w: 13, h: 10, area: 130, scene: "rise" },
      { id: "bed5", name: { en: "Bedroom 5", ar: "غرفة النوم 5" }, x: 0, y: 0, w: 6, h: 7, area: 42, scene: null },
      { id: "plant", name: { en: "Plant room", ar: "غرفة المعدات" }, x: 0, y: 9, w: 6, h: 7, area: 42, scene: null },
    ],
  },
] as const;

export const AMENITIES = [
  { name: { en: "Clubhouse", ar: "النادي" }, value: { en: "Gym, spa, café", ar: "صالة رياضية وسبا ومقهى" } },
  { name: { en: "Lagoon pool", ar: "مسبح البحيرة" }, value: { en: "50 m, shaded", ar: "50 مترًا ومظلل" } },
  { name: { en: "Shaded trails", ar: "ممرات مظللة" }, value: { en: "4.2 km", ar: "4.2 كم" } },
  { name: { en: "Padel courts", ar: "ملاعب بادل" }, value: { en: "4, floodlit", ar: "4 بإضاءة ليلية" } },
  { name: { en: "Nursery", ar: "حضانة" }, value: { en: "Inside the gates", ar: "داخل البوابات" } },
  { name: { en: "Market court", ar: "ساحة السوق" }, value: { en: "Grocer, bakery, pharmacy", ar: "بقالة ومخبز وصيدلية" } },
] as const;

export const MATERIALS = [
  { id: "travertine", name: { en: "Travertine", ar: "الترافرتين" }, text: { en: "Honed, laid in long courses on every outside wall.", ar: "مصقول، مرصوف بصفوف طويلة على كل الجدران الخارجية." } },
  { id: "oak", name: { en: "European oak", ar: "البلوط الأوروبي" }, text: { en: "Door, stair treads and screens, oiled, never lacquered.", ar: "الباب ودرجات السلم والحواجز، مزيّتة دون طلاء لامع." } },
  { id: "brass", name: { en: "Brushed brass", ar: "النحاس المصقول" }, text: { en: "Handles and fittings that darken slowly with use.", ar: "مقابض وتجهيزات تكتسب لونًا أعمق مع الاستعمال." } },
  { id: "glass", name: { en: "Low-iron glass", ar: "زجاج منخفض الحديد" }, text: { en: "Clear, without the green edge of ordinary glass.", ar: "شفاف، دون الحافة الخضراء للزجاج العادي." } },
] as const;

/** Close-ups for the materials section. Until one exists, the page draws the material in CSS. */
export const MATERIAL_ASSETS: Record<string, Asset> = {
  travertine: seedream("hf_20261126_003207_717b1761-9dd6-4ad0-aa50-90ef10275351"),
  oak: seedream("hf_20261126_004110_3cc95b3b-9284-4871-b912-784e85fac850"),
  brass: seedream("hf_20261126_004112_0710daec-8fc8-4ed1-9d70-86f8a04153fe"),
  glass: seedream("hf_20261126_004425_a6f7c79b-1a09-43da-b181-c34ce1e16ae9"),
};

/** The wide picture beside the amenities list (clubhouse and lagoon pool). */
export const AMENITY_ASSET: Asset = seedream("hf_20261126_003024_598a25a5-e833-4485-bb4b-8ffdae8a7edf");

export const PAYMENT = [
  { share: 10, label: { en: "On booking", ar: "عند الحجز" } },
  { share: 50, label: { en: "During construction, in five instalments", ar: "أثناء البناء، على خمس دفعات" } },
  { share: 40, label: { en: "On handover", ar: "عند التسليم" } },
] as const;

export const UI = {
  concept: { en: "A Zenith Dubai concept website. Halo Ridge is fictional; every figure is illustrative.", ar: "موقع تجريبي من زينيث دبي. هالو ريدج مشروع خيالي، وكل الأرقام توضيحية." },
  back: { en: "All concepts", ar: "كل النماذج" },
  scroll: { en: "Scroll to fly in", ar: "مرّر لتطير" },
  next: { en: "Next scene", ar: "المشهد التالي" },
  prev: { en: "Previous scene", ar: "المشهد السابق" },
  skip: { en: "Skip to the enquiry", ar: "انتقل إلى الاستفسار" },
  residences: { en: "Three ways to live at Halo Ridge", ar: "ثلاث طرق للعيش في هالو ريدج" },
  beds: { en: "bedrooms", ar: "غرف نوم" },
  built: { en: "built-up", ar: "مبنية" },
  plot: { en: "plot", ar: "الأرض" },
  of: { en: "villas", ar: "فلل" },
  plans: { en: "Walk the Lake Villa, floor by floor", ar: "تجوّل في فيلا البحيرة طابقًا طابقًا" },
  plansHint: { en: "Choose a room. Where the flight passed through it, you can see it again.", ar: "اختر غرفة. إن مرّت بها الرحلة يمكنك رؤيتها مجددًا." },
  seeIt: { en: "See it in the flight", ar: "شاهدها في الرحلة" },
  amenities: { en: "Everything inside the gates", ar: "كل شيء داخل البوابات" },
  location: { en: "Where it sits", ar: "الموقع" },
  locationNote: { en: "Drive times are illustrative until the location is set.", ar: "أوقات القيادة توضيحية حتى يتحدد الموقع." },
  materials: { en: "Four materials, used everywhere", ar: "أربع مواد في كل مكان" },
  payment: { en: "Payment plan", ar: "خطة الدفع" },
  paymentNote: { en: "Illustrative schedule for a concept project.", ar: "جدول توضيحي لمشروع تجريبي." },
  enquire: { en: "Book a private viewing", ar: "احجز معاينة خاصة" },
  enquireNote: { en: "This is a concept site, so there is no villa to sell. Your message goes to Zenith Dubai, who designed it, and we will reply about building a site like this one.", ar: "هذا موقع تجريبي، فلا توجد فيلا للبيع. تصل رسالتك إلى زينيث دبي التي صممته، وسنرد عليك بشأن بناء موقع مثله." },
  name: { en: "Name", ar: "الاسم" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  interest: { en: "Villa you are interested in", ar: "الفيلا التي تهمك" },
  message: { en: "Message", ar: "الرسالة" },
  send: { en: "Send", ar: "إرسال" },
  sending: { en: "Sending…", ar: "جارٍ الإرسال…" },
  sent: { en: "Sent. Zenith Dubai will reply by email.", ar: "تم الإرسال. ستردّ زينيث دبي عبر البريد الإلكتروني." },
  failed: { en: "It did not send. Try again, or write to {email}.", ar: "لم تُرسل. حاول مرة أخرى أو راسلنا على {email}." },
  errEmail: { en: "Check the email address, it does not look complete.", ar: "تحقق من البريد الإلكتروني، يبدو غير مكتمل." },
  errMissing: { en: "Add your name and email, then send again.", ar: "أضف اسمك وبريدك الإلكتروني ثم أعد الإرسال." },
  errRate: { en: "Too many messages from this connection. Try again in an hour, or write to {email}.", ar: "رسائل كثيرة من هذا الاتصال. حاول بعد ساعة أو راسلنا على {email}." },
  notSure: { en: "Not sure yet", ar: "لم أقرر بعد" },
  tag: { en: "Concept", ar: "نموذج" },
  scenes: { en: "Scenes of the flight", ar: "مشاهد الرحلة" },
  floors: { en: "Floors", ar: "الطوابق" },
  minutes: { en: "min", ar: "دقيقة" },
  journey: { en: "Flight into Halo Ridge", ar: "رحلة إلى هالو ريدج" },
  mapLabel: { en: "Drive-time rings around Halo Ridge: 10, 20 and 30 minutes", ar: "حلقات زمن القيادة حول هالو ريدج: 10 و20 و30 دقيقة" },
  footer: { en: "Designed and built by Zenith Dubai as a concept. Not an offer, a listing or a real development.", ar: "صممته وبنته زينيث دبي كنموذج. ليس عرضًا ولا إعلانًا ولا مشروعًا حقيقيًا." },
  lang: { en: "العربية", ar: "English" },
} as const;
