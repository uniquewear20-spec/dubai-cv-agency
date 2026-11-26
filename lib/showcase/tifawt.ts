// TIFAWT (ⵜⵉⴼⴰⵡⵜ, "light at dawn" in Tamazight) — a fictional Moroccan argan beauty house.
// A Zenith Dubai concept website: the brand, products, prices and photography are invented and
// nothing is for sale. All imagery was generated for this concept (see showcase-assets/tifawt.json).

import { sized, srcSet } from "./media";

export { sized, srcSet };
export type Lang = "en" | "ar";
export type L = { en: string; ar: string };
export type Cat = "face" | "hair" | "sun" | "botanical";

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
/** A Seedream / GPT Image still generated on the Higgsfield website. */
const hf = (id: string) => `${CDN}${id}_min.webp`;

/** Every image on the site, by role. Crops of 2x2 grids are served as one file with a focus. */
export const A = {
  heroModel1: hf("hf_20261126_050735_09ca1f01-d8b8-402a-a4ac-5ac6536e4da7"),
  heroModel2: hf("hf_20261126_050737_84aa640c-cf90-4745-922b-d1ca15512912"),
  heroModel3: "",
  heroProd1: "",
  heroProd2: "",
  heroProd3: "",
  lineup: "",
  pill: "",
  mosaicA: "",
  mosaicB: "",
  mosaicC: "",
  texA: "",
  texB: "",
  procA: "",
  procB: "",
  gift: "",
  center1: "",
  center2: "",
  center3: "",
};

export type GridCell = { src: string; cell: 0 | 1 | 2 | 3 };

export interface Ingredient {
  id: string;
  name: L;
  latin: string;
  origin: L;
  body: L;
  img: GridCell;
}

export interface Product {
  slug: string;
  name: string;
  kind: L;
  object: L;
  cat: Cat[];
  size: string;
  price: number;
  /** Background tone used behind this product in the showcase and on its page. */
  tone: string;
  pack: string;
  env: string;
  cut?: string;
  /** A turntable clip of the object, scrubbed by drag and scroll when present. */
  video?: string;
  tex: GridCell;
  tagline: L;
  desc: L;
  benefits: { t: L; d: L }[];
  ingredients: string[];
  texture: L;
  howTo: L[];
  why: L;
  pairs: string[];
}

export const CURRENCY: L = { en: "AED", ar: "د.إ" };
export const FREE_SHIPPING = 450;

export const INGREDIENTS: Ingredient[] = [
  {
    id: "argan",
    name: { en: "Argan kernel oil", ar: "زيت نواة الأركان" },
    latin: "Argania spinosa",
    origin: { en: "Souss forest, south-west Morocco", ar: "غابة سوس، جنوب غرب المغرب" },
    body: {
      en: "Pressed from the kernels of a tree that grows wild almost only in south-west Morocco. Rich in oleic and linoleic fatty acids and vitamin E, it softens skin and helps it hold on to moisture.",
      ar: "يُعصر من نوى شجرة لا تنمو برّيًا تقريبًا إلا في جنوب غرب المغرب. غني بحمضَي الأوليك واللينوليك وبفيتامين E، يليّن البشرة ويساعدها على الاحتفاظ بالرطوبة.",
    },
    img: { src: "mosaicA", cell: 1 },
  },
  {
    id: "figue",
    name: { en: "Prickly pear seed oil", ar: "زيت بذور التين الشوكي" },
    latin: "Opuntia ficus-indica",
    origin: { en: "Aït Baâmrane, southern Morocco", ar: "آيت باعمران، جنوب المغرب" },
    body: {
      en: "Cold-pressed from the tiny seeds of the cactus fruit. It takes a very large harvest to press a little oil, which is light, fast and rich in linoleic acid and vitamin E.",
      ar: "يُعصر على البارد من بذور ثمرة الصبّار الدقيقة. يتطلب محصولًا كبيرًا جدًا لعصر القليل من زيت خفيف سريع الامتصاص غني بحمض اللينوليك وفيتامين E.",
    },
    img: { src: "mosaicB", cell: 2 },
  },
  {
    id: "rose",
    name: { en: "Damask rose water", ar: "ماء الورد الدمشقي" },
    latin: "Rosa damascena",
    origin: { en: "Dadès valley, Kelaat M'Gouna", ar: "وادي دادس، قلعة مكونة" },
    body: {
      en: "Steam-distilled from petals picked at dawn each May in the valley of roses. It refreshes skin after cleansing and leaves it damp and ready for serum and oil.",
      ar: "يُقطَّر بالبخار من بتلات تُقطف عند الفجر كل شهر ماي في وادي الورود. ينعش البشرة بعد التنظيف ويتركها رطبة ومستعدة للسيروم والزيت.",
    },
    img: { src: "mosaicB", cell: 0 },
  },
  {
    id: "ghassoul",
    name: { en: "Ghassoul clay", ar: "طين الغاسول" },
    latin: "Stevensite clay",
    origin: { en: "Middle Atlas", ar: "الأطلس المتوسط" },
    body: {
      en: "A mineral clay from the Middle Atlas, used in Moroccan hammams for centuries. Mixed with water it turns silky and lifts away oil and impurities without stripping skin or hair.",
      ar: "طين معدني من الأطلس المتوسط يُستعمل في الحمّامات المغربية منذ قرون. يصبح حريريًا عند خلطه بالماء ويزيل الدهون والشوائب دون أن يجفف البشرة أو الشعر.",
    },
    img: { src: "mosaicB", cell: 1 },
  },
  {
    id: "hyaluronic",
    name: { en: "Hyaluronic acid", ar: "حمض الهيالورونيك" },
    latin: "Sodium hyaluronate",
    origin: { en: "The modern partner to argan", ar: "الشريك الحديث للأركان" },
    body: {
      en: "A moisture-binding molecule that holds water in the upper layers of skin. Argan seals what it brings, which is why we pair them.",
      ar: "جزيء يربط الرطوبة ويحبس الماء في الطبقات العليا من البشرة. والأركان يحفظ ما يجلبه، ولهذا نجمع بينهما.",
    },
    img: { src: "texA", cell: 3 },
  },
  {
    id: "cedar",
    name: { en: "Atlas cedar", ar: "أرز الأطلس" },
    latin: "Cedrus atlantica",
    origin: { en: "Middle Atlas forests", ar: "غابات الأطلس المتوسط" },
    body: {
      en: "The dry, woody note in our hair oil, and the wood we carve for our droppers and stoppers.",
      ar: "النوتة الخشبية الجافة في زيت الشعر، والخشب الذي ننحت منه القطّارات والسدادات.",
    },
    img: { src: "mosaicC", cell: 0 },
  },
];

export const PRODUCTS: Product[] = [
  {
    slug: "huile-pure",
    name: "Huile Pure",
    kind: { en: "Pure argan oil, face and body", ar: "زيت أركان نقي للوجه والجسم" },
    object: { en: "The arch flask", ar: "قارورة القوس" },
    cat: ["face"],
    size: "30 ml",
    price: 220,
    tone: "#c9a27e",
    pack: hf("hf_20261126_051546_454b796d-6f42-466e-980a-a04c8ec37468"),
    env: "",
    video: "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/bb36660e-dab0-4d37-b8fc-7993dad83b36.mp4",
    tex: { src: "texA", cell: 0 },
    tagline: { en: "One cold-pressed drop of Souss argan, nothing added.", ar: "قطرة واحدة من أركان سوس معصورة على البارد، دون أي إضافة." },
    desc: {
      en: "Unroasted kernels, cracked by hand and cold-pressed, bottled as they are. A light, pale-gold oil that sinks into skin, softens dry patches and leaves a satin glow without shine.",
      ar: "نوى غير محمّصة، تُكسر يدويًا وتُعصر على البارد وتُعبّأ كما هي. زيت خفيف بلون ذهبي فاتح يتغلغل في البشرة ويليّن المناطق الجافة ويترك إشراقة حريرية دون لمعان.",
    },
    benefits: [
      { t: { en: "Softens", ar: "يليّن" }, d: { en: "Helps soften rough, dry skin from the first use.", ar: "يساعد على تليين البشرة الخشنة والجافة من الاستعمال الأول." } },
      { t: { en: "Comforts", ar: "يريح" }, d: { en: "Supports the skin's moisture barrier with oleic and linoleic fatty acids.", ar: "يدعم حاجز الرطوبة في البشرة بفضل حمضَي الأوليك واللينوليك." } },
      { t: { en: "Glows", ar: "يضيء" }, d: { en: "Leaves a satin finish that never feels greasy.", ar: "يترك لمسة حريرية لا تبدو دهنية أبدًا." } },
    ],
    ingredients: ["argan"],
    texture: {
      en: "Fluid and silky, with a faint nutty scent that fades within minutes. On damp skin it disappears in about a minute.",
      ar: "سائل وحريري برائحة جوزية خفيفة تتلاشى خلال دقائق. على البشرة الرطبة يختفي في نحو دقيقة.",
    },
    howTo: [
      { en: "Warm two drops between your palms.", ar: "دفّئي قطرتين بين راحتي يديك." },
      { en: "Press onto clean, damp skin of the face and neck.", ar: "اضغطي بهما على بشرة الوجه والرقبة النظيفة والرطبة." },
      { en: "Use morning and night, with a drop more on hands, elbows and the ends of your hair.", ar: "استعمليه صباحًا ومساءً، مع قطرة إضافية لليدين والمرفقين وأطراف الشعر." },
    ],
    why: {
      en: "Many argan oils are blended or roasted. Huile Pure is one ingredient, from kernels traced to the Souss forest, in thick amber glass that keeps out the light.",
      ar: "كثير من زيوت الأركان مخلوطة أو محمّصة. أما هويل بور فمكوّن واحد من نوى مصدرها غابة سوس، في زجاج كهرماني سميك يحجب الضوء.",
    },
    pairs: ["creme-lumiere", "voile-solaire", "eau-de-rose"],
  },
  {
    slug: "creme-lumiere",
    name: "Crème Lumière",
    kind: { en: "Advanced argan face cream", ar: "كريم وجه متطور بالأركان" },
    object: { en: "The star jar", ar: "برطمان النجمة" },
    cat: ["face"],
    size: "50 ml",
    price: 360,
    tone: "#d4b59a",
    pack: hf("hf_20261126_051552_139e4156-0a0c-4e19-b326-de3570a272ee"),
    env: "",
    video: "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/478e8a4b-cabd-4b6c-9d9a-8d61b4f21d71.mp4",
    tex: { src: "texA", cell: 1 },
    tagline: { en: "A rich cream that melts like an oil and leaves skin lit from within.", ar: "كريم غني يذوب كالزيت ويترك البشرة مضيئة من الداخل." },
    desc: {
      en: "Argan oil, hyaluronic acid and prickly pear seed oil in a cushiony cream for skin that wants comfort and bounce. Made for dry air, air conditioning and long days in the sun.",
      ar: "زيت الأركان وحمض الهيالورونيك وزيت بذور التين الشوكي في كريم ناعم لبشرة تحتاج إلى الراحة والامتلاء. صُمّم للهواء الجاف والمكيّفات والأيام الطويلة تحت الشمس.",
    },
    benefits: [
      { t: { en: "Nourishes", ar: "يغذّي" }, d: { en: "Argan and prickly pear oils replenish dry skin.", ar: "زيتا الأركان والتين الشوكي يعوّضان البشرة الجافة." } },
      { t: { en: "Plumps", ar: "يملأ" }, d: { en: "Hyaluronic acid holds water in the upper layers of skin.", ar: "حمض الهيالورونيك يحبس الماء في الطبقات العليا من البشرة." } },
      { t: { en: "Illuminates", ar: "ينير" }, d: { en: "A soft, even radiance that lasts through the day.", ar: "إشراقة ناعمة ومتجانسة تدوم طوال اليوم." } },
    ],
    ingredients: ["argan", "hyaluronic", "figue"],
    texture: {
      en: "Whipped and dense in the jar, it melts on contact into a velvet film that disappears in a minute.",
      ar: "كثيف ومخفوق في البرطمان، يذوب عند اللمس إلى طبقة مخملية تختفي في دقيقة.",
    },
    howTo: [
      { en: "Take a pea-sized amount.", ar: "خذي كمية بحجم حبة البازلاء." },
      { en: "Warm it between your fingertips and press over face and neck.", ar: "دفّئيها بين أطراف أصابعك واضغطي بها على الوجه والرقبة." },
      { en: "Mornings under Voile Solaire, evenings alone or over Huile Pure.", ar: "صباحًا تحت فوال سولير، ومساءً وحده أو فوق هويل بور." },
    ],
    why: {
      en: "One cream for two climates: rich enough for a desert night, light enough for a Dubai morning.",
      ar: "كريم واحد لمناخين: غني بما يكفي لليلة صحراوية، وخفيف بما يكفي لصباح في دبي.",
    },
    pairs: ["huile-pure", "serum-hydra", "voile-solaire"],
  },
  {
    slug: "voile-solaire",
    name: "Voile Solaire SPF 50",
    kind: { en: "Daily facial sunscreen", ar: "واقٍ يومي من الشمس للوجه" },
    object: { en: "The kasbah tower", ar: "برج القصبة" },
    cat: ["sun", "face"],
    size: "50 ml",
    price: 210,
    tone: "#d7b47a",
    pack: hf("hf_20261126_052014_9dae3052-74dd-417c-a6bb-b3149f0bdf79"),
    env: "",
    video: "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/1d069c5b-c46b-4108-9ba8-00ca4b578ac1.mp4",
    tex: { src: "texA", cell: 2 },
    tagline: { en: "A weightless veil for Gulf light, with a drop of argan.", ar: "غلالة خفيفة لضوء الخليج، مع قطرة من الأركان." },
    desc: {
      en: "A fluid, invisible sun veil for every skin tone, worn as the last step each morning. It dries to a soft, natural finish that sits well under makeup.",
      ar: "واقٍ سائل غير مرئي يناسب كل ألوان البشرة، يُوضع كآخر خطوة كل صباح. يجف بلمسة طبيعية ناعمة تنسجم مع المكياج.",
    },
    benefits: [
      { t: { en: "Protects", ar: "يحمي" }, d: { en: "High daily protection for face and neck.", ar: "حماية يومية عالية للوجه والرقبة." } },
      { t: { en: "Disappears", ar: "يختفي" }, d: { en: "No white cast, including on deep skin tones.", ar: "دون أثر أبيض، حتى على البشرة الداكنة." } },
      { t: { en: "Layers", ar: "ينسجم" }, d: { en: "Sits under makeup without pilling.", ar: "يبقى تحت المكياج دون أن يتكتل." } },
    ],
    ingredients: ["argan", "hyaluronic"],
    texture: {
      en: "A milky fluid that spreads in one pass and sets in under a minute to a soft, skin-like finish.",
      ar: "سائل حليبي ينتشر بلمسة واحدة ويثبت في أقل من دقيقة بلمسة ناعمة تشبه البشرة.",
    },
    howTo: [
      { en: "Apply two finger-lengths to face and neck as the last step of your morning.", ar: "ضعي ما يعادل طول إصبعين على الوجه والرقبة كآخر خطوة صباحية." },
      { en: "Reapply every two hours outdoors, and after swimming or sweating.", ar: "أعيدي وضعه كل ساعتين في الخارج، وبعد السباحة أو التعرق." },
      { en: "At midday, add a hat and shade.", ar: "عند الظهيرة، أضيفي قبعة وابحثي عن الظل." },
    ],
    why: {
      en: "Sunscreen only works if you wear it every day, so we made one you won't want to skip.",
      ar: "الواقي الشمسي لا ينفع إلا إذا استعملتِه كل يوم، لذلك صنعنا واقيًا لن ترغبي في تفويته.",
    },
    pairs: ["creme-lumiere", "eau-de-rose", "huile-pure"],
  },
  {
    slug: "huile-capillaire",
    name: "Huile Capillaire",
    kind: { en: "Argan hair oil", ar: "زيت أركان للشعر" },
    object: { en: "The braid bottle", ar: "قارورة الضفيرة" },
    cat: ["hair"],
    size: "100 ml",
    price: 190,
    tone: "#b9a184",
    pack: hf("hf_20261126_054119_13b11fe4-4aef-4c37-bdb8-13e8d231add1"),
    env: "",
    tex: { src: "mosaicC", cell: 1 },
    tagline: { en: "Gloss for lengths, comfort for ends, from the same Souss argan.", ar: "لمعان للأطوال وراحة للأطراف، من أركان سوس نفسه." },
    desc: {
      en: "Argan with prickly pear seed oil and a note of Atlas cedar, for hair dried by sun, sea and heat styling. It smooths frizz without weighing hair down.",
      ar: "أركان مع زيت بذور التين الشوكي ونوتة من أرز الأطلس، لشعر أرهقته الشمس والبحر وأدوات التصفيف الحرارية. ينعّم التموّج دون أن يُثقل الشعر.",
    },
    benefits: [
      { t: { en: "Smooths", ar: "ينعّم" }, d: { en: "Tames frizz and flyaways in humid heat.", ar: "يروّض التموّج والشعيرات المتطايرة في الحر الرطب." } },
      { t: { en: "Shines", ar: "يلمّع" }, d: { en: "A glassy gloss with no film on the roots.", ar: "لمعان زجاجي دون أثر على الجذور." } },
      { t: { en: "Cares for ends", ar: "يعتني بالأطراف" }, d: { en: "Helps reduce the look of split, brittle ends.", ar: "يساعد على تقليل مظهر الأطراف المتقصفة والهشّة." } },
    ],
    ingredients: ["argan", "figue", "cedar"],
    texture: {
      en: "A light, dry oil that disappears into damp lengths and leaves no residue.",
      ar: "زيت خفيف وجاف يختفي في الشعر الرطب ولا يترك أي أثر.",
    },
    howTo: [
      { en: "Warm three to five drops in your palms.", ar: "دفّئي من ثلاث إلى خمس قطرات بين راحتيك." },
      { en: "Work through damp lengths and ends, avoiding the roots.", ar: "وزّعيها على الأطوال والأطراف الرطبة بعيدًا عن الجذور." },
      { en: "Once a week, apply generously as a 30-minute mask before washing.", ar: "مرة في الأسبوع، ضعيه بسخاء كقناع لمدة 30 دقيقة قبل الغسل." },
    ],
    why: {
      en: "Hair needs a lighter oil than skin. We tuned the blend to give slip and shine without greasy roots.",
      ar: "الشعر يحتاج زيتًا أخف من البشرة. ضبطنا التركيبة لتمنح انسيابية ولمعانًا دون جذور دهنية.",
    },
    pairs: ["ghassoul", "huile-pure", "baume-nuit"],
  },
  {
    slug: "serum-hydra",
    name: "Sérum Hydra",
    kind: { en: "Hydrating serum", ar: "سيروم مرطّب" },
    object: { en: "The kernel bottle", ar: "قارورة النواة" },
    cat: ["face"],
    size: "30 ml",
    price: 290,
    tone: "#b8b4a6",
    pack: hf("hf_20261126_054835_1430fee6-184b-48e5-8b5e-edc1dd5142b2"),
    env: "",
    tex: { src: "texA", cell: 3 },
    tagline: { en: "Water for skin that lives in dry air.", ar: "ماء لبشرة تعيش في هواء جاف." },
    desc: {
      en: "A clear gel of hyaluronic acid and Damask rose water that floods skin with moisture before your oil or cream. Light enough for humid summers, generous enough for air-conditioned rooms.",
      ar: "جل شفاف من حمض الهيالورونيك وماء الورد الدمشقي يغمر البشرة بالرطوبة قبل الزيت أو الكريم. خفيف بما يكفي لصيف رطب، وسخيّ بما يكفي للغرف المكيّفة.",
    },
    benefits: [
      { t: { en: "Hydrates", ar: "يرطّب" }, d: { en: "Draws water into the upper layers of skin.", ar: "يجذب الماء إلى الطبقات العليا من البشرة." } },
      { t: { en: "Smooths", ar: "ينعّم" }, d: { en: "Softens the look of fine lines caused by dryness.", ar: "يخفف مظهر الخطوط الدقيقة الناتجة عن الجفاف." } },
      { t: { en: "Prepares", ar: "يهيّئ" }, d: { en: "Helps oils and creams spread further.", ar: "يساعد الزيوت والكريمات على الانتشار أكثر." } },
    ],
    ingredients: ["hyaluronic", "rose"],
    texture: {
      en: "Cool, clear and slippery, it vanishes on damp skin and leaves it springy.",
      ar: "منعش وشفاف وانسيابي، يختفي على البشرة الرطبة ويتركها مرنة.",
    },
    howTo: [
      { en: "After Eau de Rose, press two drops into damp skin.", ar: "بعد أو دو روز، اضغطي بقطرتين على البشرة الرطبة." },
      { en: "Follow with Huile Pure or Crème Lumière to seal it in.", ar: "أتبعيه بهويل بور أو كريم لوميير لحبس الرطوبة." },
      { en: "Morning and night.", ar: "صباحًا ومساءً." },
    ],
    why: {
      en: "Oil on its own can't hydrate, it seals. Sérum Hydra brings the water and argan keeps it there.",
      ar: "الزيت وحده لا يرطّب بل يحبس الرطوبة. سيروم هيدرا يجلب الماء والأركان يحفظه.",
    },
    pairs: ["eau-de-rose", "huile-pure", "creme-lumiere"],
  },
  {
    slug: "baume-nuit",
    name: "Baume Nuit",
    kind: { en: "Nourishing night balm", ar: "بلسم ليلي مغذّ" },
    object: { en: "The tajine", ar: "الطاجين" },
    cat: ["face"],
    size: "50 ml",
    price: 260,
    tone: "#5a5348",
    pack: hf("hf_20261126_054816_ef23d037-d055-4ec0-be09-16b6ebad4e26"),
    env: "",
    tex: { src: "texB", cell: 0 },
    tagline: { en: "A slow, melting balm for the hours skin repairs.", ar: "بلسم يذوب ببطء خلال الساعات التي تتجدد فيها البشرة." },
    desc: {
      en: "Argan oil, shea butter and prickly pear seed oil in a dense balm that turns to oil on warm skin. For very dry or tight skin, and for hands, cuticles and lips.",
      ar: "زيت الأركان وزبدة الشيا وزيت بذور التين الشوكي في بلسم كثيف يتحول إلى زيت على البشرة الدافئة. للبشرة شديدة الجفاف أو المشدودة، ولليدين والجلد حول الأظافر والشفاه.",
    },
    benefits: [
      { t: { en: "Comforts", ar: "يريح" }, d: { en: "Eases the feeling of tight, dry skin.", ar: "يخفف الإحساس بشدّ البشرة وجفافها." } },
      { t: { en: "Replenishes", ar: "يعوّض" }, d: { en: "Cushions skin through the night.", ar: "يغلف البشرة طوال الليل." } },
      { t: { en: "Multi-use", ar: "متعدد الاستعمالات" }, d: { en: "Face, hands, cuticles, lips.", ar: "للوجه واليدين وحول الأظافر والشفاه." } },
    ],
    ingredients: ["argan", "figue"],
    texture: {
      en: "Firm in its tajine, it turns to oil on contact and leaves a cushion that sinks in overnight.",
      ar: "متماسك في طاجينه، يتحول إلى زيت عند اللمس ويترك طبقة واقية تتغلغل خلال الليل.",
    },
    howTo: [
      { en: "Warm a little between your fingertips until it melts.", ar: "دفّئي قليلًا منه بين أطراف أصابعك حتى يذوب." },
      { en: "Press over face and neck as your last step at night.", ar: "اضغطي به على الوجه والرقبة كآخر خطوة في الليل." },
      { en: "Use on dry patches, cuticles and lips whenever needed.", ar: "استعمليه على المناطق الجافة وحول الأظافر والشفاه عند الحاجة." },
    ],
    why: {
      en: "Skin loses the most water at night in air-conditioned rooms. A balm stays where a cream can't.",
      ar: "تفقد البشرة أكثر ماءها ليلًا في الغرف المكيّفة، والبلسم يبقى حيث لا يبقى الكريم.",
    },
    pairs: ["huile-de-figue", "ghassoul", "eau-de-rose"],
  },
  {
    slug: "eau-de-rose",
    name: "Eau de Rose du Dadès",
    kind: { en: "Damask rose water toner", ar: "تونر ماء الورد الدمشقي" },
    object: { en: "The rose sprinkler", ar: "المرشّ" },
    cat: ["botanical", "face"],
    size: "150 ml",
    price: 140,
    tone: "#d9b9b0",
    pack: hf("hf_20261126_055137_156e5c8a-ab69-4bc1-a13b-4a80ca1774dd"),
    env: "",
    tex: { src: "texB", cell: 1 },
    tagline: { en: "Spring in the Dadès valley, misted over skin.", ar: "ربيع وادي دادس، رذاذًا على بشرتك." },
    desc: {
      en: "Steam-distilled water of Damask roses from the valley around Kelaat M'Gouna. Mist it over clean skin to refresh it and prepare it for serum and oil.",
      ar: "ماء مقطّر بالبخار من الورد الدمشقي في الوادي المحيط بقلعة مكونة. رشّيه على البشرة النظيفة لإنعاشها وتهيئتها للسيروم والزيت.",
    },
    benefits: [
      { t: { en: "Refreshes", ar: "ينعش" }, d: { en: "A cool mist for hot days and long flights.", ar: "رذاذ منعش للأيام الحارة والرحلات الطويلة." } },
      { t: { en: "Balances", ar: "يوازن" }, d: { en: "Leaves skin soft and comfortable after cleansing.", ar: "يترك البشرة ناعمة ومرتاحة بعد التنظيف." } },
      { t: { en: "Prepares", ar: "يهيّئ" }, d: { en: "Damp skin takes serum and oil better.", ar: "البشرة الرطبة تستقبل السيروم والزيت بشكل أفضل." } },
    ],
    ingredients: ["rose"],
    texture: {
      en: "A fine, cool mist with the true scent of fresh roses.",
      ar: "رذاذ ناعم ومنعش برائحة الورد الطازج الحقيقية.",
    },
    howTo: [
      { en: "Mist over face and neck after cleansing.", ar: "رشّيه على الوجه والرقبة بعد التنظيف." },
      { en: "Press it in, then apply Sérum Hydra while skin is still damp.", ar: "اضغطي عليه ثم ضعي سيروم هيدرا والبشرة ما زالت رطبة." },
      { en: "Keep it close during the day to refresh over makeup.", ar: "احتفظي به قريبًا خلال اليوم لإنعاش بشرتك فوق المكياج." },
    ],
    why: {
      en: "Dadès roses are picked at dawn in May, when their scent is strongest. This is the water of that harvest.",
      ar: "يُقطف ورد دادس عند الفجر في ماي حين تكون رائحته في أوجها، وهذا ماء ذلك القطاف.",
    },
    pairs: ["serum-hydra", "huile-pure", "ghassoul"],
  },
  {
    slug: "ghassoul",
    name: "Ghassoul Purifiant",
    kind: { en: "Atlas clay mask", ar: "قناع طين الأطلس" },
    object: { en: "The hammam bowl", ar: "طاسة الحمّام" },
    cat: ["botanical", "face", "hair"],
    size: "100 g",
    price: 150,
    tone: "#c4ad92",
    pack: hf("hf_20261126_055140_55dd4031-facb-42f2-9582-8f30d8358337"),
    env: "",
    tex: { src: "texB", cell: 2 },
    tagline: { en: "The hammam's oldest ritual: clay that cleanses without stripping.", ar: "أقدم طقوس الحمّام: طين ينظّف دون أن يجفّف." },
    desc: {
      en: "Ghassoul from the Middle Atlas, finely sifted and blended with powdered rose petals. Mix it with Eau de Rose into a silky paste for face, body or scalp.",
      ar: "غاسول من الأطلس المتوسط، منخول بعناية وممزوج بمسحوق بتلات الورد. اخلطيه مع أو دو روز لعجينة حريرية للوجه أو الجسم أو فروة الرأس.",
    },
    benefits: [
      { t: { en: "Purifies", ar: "ينقّي" }, d: { en: "Lifts away oil and impurities.", ar: "يزيل الدهون والشوائب." } },
      { t: { en: "Softens", ar: "ينعّم" }, d: { en: "Leaves skin and hair soft, never tight.", ar: "يترك البشرة والشعر ناعمين دون شدّ." } },
      { t: { en: "Refines", ar: "يصقل" }, d: { en: "Skin looks smoother and clearer.", ar: "تبدو البشرة أنعم وأصفى." } },
    ],
    ingredients: ["ghassoul", "rose"],
    texture: {
      en: "A soft powder that becomes a silky, mousse-like paste with water or rose water.",
      ar: "بودرة ناعمة تتحول إلى عجينة حريرية كالموس عند خلطها بالماء أو ماء الورد.",
    },
    howTo: [
      { en: "Mix one spoon of powder with Eau de Rose until smooth.", ar: "اخلطي ملعقة من البودرة مع أو دو روز حتى تصبح ناعمة." },
      { en: "Apply to face or scalp for 5 to 10 minutes, without letting it dry completely.", ar: "ضعيها على الوجه أو فروة الرأس من 5 إلى 10 دقائق دون أن تجف تمامًا." },
      { en: "Rinse with warm water. Once or twice a week.", ar: "اشطفي بالماء الدافئ، مرة أو مرتين في الأسبوع." },
    ],
    why: {
      en: "Ghassoul has been part of the Moroccan hammam for centuries. We keep it pure and fine, so it feels like silk rather than mud.",
      ar: "الغاسول جزء من الحمّام المغربي منذ قرون، ونحافظ عليه نقيًا وناعمًا ليبدو كالحرير لا كالطين.",
    },
    pairs: ["eau-de-rose", "huile-capillaire", "baume-nuit"],
  },
  {
    slug: "huile-de-figue",
    name: "Huile de Figue de Barbarie",
    kind: { en: "Prickly pear seed oil", ar: "زيت بذور التين الشوكي" },
    object: { en: "The jewel vial", ar: "قارورة الجوهرة" },
    cat: ["botanical", "face"],
    size: "15 ml",
    price: 420,
    tone: "#7d5a4a",
    pack: "",
    env: "",
    tex: { src: "texB", cell: 3 },
    tagline: { en: "The rarest oil of the south, a few drops at a time.", ar: "أندر زيوت الجنوب، بضع قطرات في كل مرة." },
    desc: {
      en: "Cold-pressed from the tiny seeds of the prickly pear, it takes an enormous harvest to fill one vial. Light and fast, rich in linoleic acid and vitamin E, it is the most precious oil we make.",
      ar: "يُعصر على البارد من بذور التين الشوكي الدقيقة، ويتطلب ملء قارورة واحدة محصولًا هائلًا. خفيف وسريع الامتصاص، غني بحمض اللينوليك وفيتامين E، وهو أثمن زيت نصنعه.",
    },
    benefits: [
      { t: { en: "Revives", ar: "ينعش" }, d: { en: "Skin looks rested and even by morning.", ar: "تبدو البشرة مرتاحة ومتجانسة في الصباح." } },
      { t: { en: "Softens", ar: "يليّن" }, d: { en: "Absorbs fast and leaves no film.", ar: "يُمتص بسرعة ولا يترك أي أثر." } },
      { t: { en: "Protects", ar: "يحمي" }, d: { en: "Naturally rich in antioxidant vitamin E.", ar: "غني طبيعيًا بفيتامين E المضاد للأكسدة." } },
    ],
    ingredients: ["figue"],
    texture: {
      en: "A dry, fast oil with a green, faintly herbal scent.",
      ar: "زيت جاف وسريع برائحة خضراء عشبية خفيفة.",
    },
    howTo: [
      { en: "At night, warm two or three drops in your palms.", ar: "في الليل، دفّئي قطرتين أو ثلاثًا بين راحتيك." },
      { en: "Press over face, neck and under the eyes.", ar: "اضغطي بها على الوجه والرقبة وتحت العينين." },
      { en: "On very dry nights, follow with Baume Nuit.", ar: "في الليالي شديدة الجفاف، أتبعيه ببوم نوي." },
    ],
    why: {
      en: "We use it neat, because it needs nothing else.",
      ar: "نستعمله صافيًا، لأنه لا يحتاج إلى شيء آخر.",
    },
    pairs: ["baume-nuit", "huile-pure", "creme-lumiere"],
  },
];

export const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

/** The three products the hero opens on, and the four the pinned showcase walks through. */
export const HERO = [
  { slug: "huile-pure", left: { word: "Huile", img: "heroProd1", tone: "light" }, right: { word: "Pure", img: "heroModel1", tone: "light" }, center: "center1", productSide: "left" },
  { slug: "creme-lumiere", left: { word: "Crème", img: "heroModel2", tone: "light" }, right: { word: "Lumière", img: "heroProd2", tone: "dark" }, center: "center2", productSide: "right" },
  { slug: "voile-solaire", left: { word: "Voile", img: "heroProd3", tone: "dark" }, right: { word: "Solaire", img: "heroModel3", tone: "light" }, center: "center3", productSide: "left" },
] as const;

export const SHOWCASE = ["huile-pure", "creme-lumiere", "voile-solaire", "huile-capillaire"];

export const COFFRETS: { id: string; name: string; line: L; items: string[]; price: number; focus: string }[] = [
  { id: "coffret-aube", name: "Coffret Aube", line: { en: "The dawn ritual: rose mist, water, sun veil.", ar: "طقس الفجر: رذاذ الورد والترطيب والحماية من الشمس." }, items: ["eau-de-rose", "serum-hydra", "voile-solaire"], price: 560, focus: "18% 55%" },
  { id: "coffret-souss", name: "Coffret Souss", line: { en: "Argan three ways: face, cream and hair.", ar: "الأركان بثلاث طرق: للوجه والكريم والشعر." }, items: ["huile-pure", "creme-lumiere", "huile-capillaire"], price: 680, focus: "50% 55%" },
  { id: "coffret-nuit", name: "Coffret Nuit", line: { en: "The night ritual: clay, precious oil, balm.", ar: "طقس الليل: طين وزيت نفيس وبلسم." }, items: ["ghassoul", "huile-de-figue", "baume-nuit"], price: 720, focus: "82% 55%" },
];

export const RITUALS: Record<"dawn" | "night", { slug: string; note: L }[]> = {
  dawn: [
    { slug: "eau-de-rose", note: { en: "Mist over clean skin", ar: "رذاذ على بشرة نظيفة" } },
    { slug: "serum-hydra", note: { en: "Two drops while still damp", ar: "قطرتان والبشرة رطبة" } },
    { slug: "creme-lumiere", note: { en: "A pea of cream, or two drops of Huile Pure", ar: "حبة كريم، أو قطرتان من هويل بور" } },
    { slug: "voile-solaire", note: { en: "Always last, every morning", ar: "دائمًا في الأخير، كل صباح" } },
  ],
  night: [
    { slug: "ghassoul", note: { en: "Twice a week, before everything", ar: "مرتين في الأسبوع، قبل كل شيء" } },
    { slug: "eau-de-rose", note: { en: "Mist to rebalance", ar: "رذاذ لإعادة التوازن" } },
    { slug: "huile-de-figue", note: { en: "Three drops pressed in", ar: "ثلاث قطرات بالضغط" } },
    { slug: "baume-nuit", note: { en: "Seal it all in", ar: "لحبس كل شيء" } },
  ],
};

export const PROCESS: { t: L; d: L; img: GridCell }[] = [
  { t: { en: "Gather", ar: "الجمع" }, d: { en: "In summer the ripe fruit falls from the argan trees and is gathered from the ground.", ar: "في الصيف تسقط الثمار الناضجة من أشجار الأركان وتُجمع من الأرض." }, img: { src: "procA", cell: 0 } },
  { t: { en: "Dry", ar: "التجفيف" }, d: { en: "The fruit dries in the sun on flat earth roofs until the pulp turns brittle.", ar: "تجف الثمار تحت الشمس على الأسطح الترابية حتى يصبح لبّها هشًا." }, img: { src: "procA", cell: 1 } },
  { t: { en: "Crack", ar: "الكسر" }, d: { en: "Each nut is cracked between two stones by hand to free one to three kernels.", ar: "تُكسر كل جوزة يدويًا بين حجرين لتحرير نواة إلى ثلاث." }, img: { src: "procA", cell: 2 } },
  { t: { en: "Sort", ar: "الفرز" }, d: { en: "The pale kernels are sorted and kept raw. For skin, they are never roasted.", ar: "تُفرز النوى الفاتحة وتُحفظ نيئة، ولا تُحمَّص أبدًا حين تكون للبشرة." }, img: { src: "procA", cell: 3 } },
  { t: { en: "Press", ar: "العصر" }, d: { en: "A cold press releases the oil slowly, without heat or solvents.", ar: "معصرة باردة تُخرج الزيت ببطء، دون حرارة أو مذيبات." }, img: { src: "procB", cell: 0 } },
  { t: { en: "Rest and bottle", ar: "الترويق والتعبئة" }, d: { en: "The oil settles for days, is filtered, and is bottled in amber glass in Agadir.", ar: "يُترك الزيت ليروق أيامًا ثم يُصفّى ويُعبّأ في زجاج كهرماني في أكادير." }, img: { src: "procB", cell: 2 } },
];

export const PILLARS: { words: [string, string]; ar: [string, string]; img: GridCell; title: L; body: L; meta: L[] }[] = [
  {
    words: ["Pressed", "in the Souss"],
    ar: ["معصور", "في سوس"],
    img: { src: "mosaicA", cell: 2 },
    title: { en: "Pressed in the Souss", ar: "معصور في سوس" },
    body: {
      en: "Our kernels are cracked by hand around Taroudant and cold-pressed within days, never roasted, so the oil keeps its pale gold colour and its own light scent.",
      ar: "تُكسر نوانا يدويًا حول تارودانت وتُعصر على البارد خلال أيام دون تحميص، فيحتفظ الزيت بلونه الذهبي الفاتح ورائحته الخفيفة.",
    },
    meta: [{ en: "Cold-pressed", ar: "عصر بارد" }, { en: "Unroasted kernels", ar: "نوى غير محمّصة" }, { en: "Souss-Massa", ar: "سوس ماسة" }],
  },
  {
    words: ["Made", "for daylight"],
    ar: ["مصنوع", "لضوء النهار"],
    img: { src: "mosaicC", cell: 3 },
    title: { en: "Made for daylight", ar: "مصنوع لضوء النهار" },
    body: {
      en: "Every formula is built for the sun the Souss and the Gulf share: light textures that sit well under sunscreen, and a sun veil you can reapply without feeling it.",
      ar: "كل تركيبة مصممة للشمس التي يتقاسمها سوس والخليج: قوام خفيف ينسجم تحت الواقي الشمسي، وغلالة شمسية يمكن إعادة وضعها دون الإحساس بها.",
    },
    meta: [{ en: "Light textures", ar: "قوام خفيف" }, { en: "Layer-friendly", ar: "سهل الطبقات" }, { en: "Made for heat", ar: "مصنوع للحرارة" }],
  },
  {
    words: ["Argan", "root to ritual"],
    ar: ["الأركان", "من الجذر إلى الطقس"],
    img: { src: "mosaicA", cell: 3 },
    title: { en: "Argan, from root to ritual", ar: "الأركان، من الجذر إلى الطقس" },
    body: {
      en: "Around the argan we gathered the south's other treasures: rose from the Dadès, ghassoul from the Middle Atlas and prickly pear seed from Aït Baâmrane.",
      ar: "حول الأركان جمعنا كنوز الجنوب الأخرى: ورد دادس، وغاسول الأطلس المتوسط، وبذور التين الشوكي من آيت باعمران.",
    },
    meta: [{ en: "Souss argan", ar: "أركان سوس" }, { en: "Dadès rose", ar: "ورد دادس" }, { en: "Atlas ghassoul", ar: "غاسول الأطلس" }],
  },
];

/** The ten images that float around the Maison title and fly past as you scroll. */
export const MOSAIC: { img: GridCell; x: number; y: number; w: number; ar: number }[] = [
  { img: { src: "mosaicA", cell: 0 }, x: 4, y: 20, w: 10, ar: 0.82 },
  { img: { src: "mosaicC", cell: 0 }, x: 19, y: 7, w: 11, ar: 1.45 },
  { img: { src: "mosaicA", cell: 1 }, x: 27, y: 15, w: 9, ar: 0.78 },
  { img: { src: "mosaicB", cell: 0 }, x: 72, y: 28, w: 10, ar: 0.8 },
  { img: { src: "mosaicC", cell: 2 }, x: 81, y: 6, w: 11, ar: 1.4 },
  { img: { src: "mosaicB", cell: 2 }, x: 9, y: 78, w: 11, ar: 0.8 },
  { img: { src: "mosaicA", cell: 3 }, x: 23, y: 63, w: 10, ar: 0.78 },
  { img: { src: "mosaicC", cell: 1 }, x: 46, y: 70, w: 10, ar: 1.35 },
  { img: { src: "mosaicB", cell: 1 }, x: 75, y: 76, w: 10, ar: 0.8 },
  { img: { src: "mosaicB", cell: 3 }, x: 84, y: 58, w: 10, ar: 0.78 },
];

export const QUIZ: { q: L; options: { id: string; l: L }[] }[] = [
  {
    q: { en: "By midday, your skin feels…", ar: "عند الظهيرة، تشعرين أن بشرتك…" },
    options: [
      { id: "tight", l: { en: "Tight and thirsty", ar: "مشدودة وعطشى" } },
      { id: "balanced", l: { en: "Comfortable", ar: "مرتاحة" } },
      { id: "shiny", l: { en: "A little shiny", ar: "لامعة قليلًا" } },
    ],
  },
  {
    q: { en: "What matters most right now?", ar: "ما الأهم بالنسبة لك الآن؟" },
    options: [
      { id: "glow", l: { en: "Glow", ar: "الإشراقة" } },
      { id: "firm", l: { en: "Bounce and fine lines", ar: "الامتلاء والخطوط الدقيقة" } },
      { id: "sun", l: { en: "Sun", ar: "الشمس" } },
      { id: "hair", l: { en: "Hair", ar: "الشعر" } },
    ],
  },
  {
    q: { en: "Where do you spend your days?", ar: "أين تقضين أيامك؟" },
    options: [
      { id: "in", l: { en: "Mostly indoors", ar: "غالبًا في الداخل" } },
      { id: "out", l: { en: "Mostly outdoors", ar: "غالبًا في الخارج" } },
      { id: "both", l: { en: "Both", ar: "الاثنان" } },
    ],
  },
];

/** Three answers in, three products out. */
export function recommend(a: (string | undefined)[]): string[] {
  const [skin, goal, days] = a;
  const out: string[] = [];
  const add = (s: string) => !out.includes(s) && out.push(s);
  if (goal === "glow") { add("huile-pure"); add("eau-de-rose"); }
  if (goal === "firm") { add("creme-lumiere"); add("serum-hydra"); }
  if (goal === "sun") { add("voile-solaire"); add("serum-hydra"); }
  if (goal === "hair") { add("huile-capillaire"); add("ghassoul"); }
  if (skin === "tight") add("baume-nuit");
  if (skin === "shiny") add("serum-hydra");
  if (skin === "balanced") add("huile-pure");
  if (days === "out" || days === "both") add("voile-solaire");
  add("creme-lumiere");
  return out.slice(0, 3);
}

export const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "Is TIFAWT a real brand?", ar: "هل تيفاوت علامة حقيقية؟" },
    a: {
      en: "No. TIFAWT is a concept website designed and built by Zenith Dubai to show what a Moroccan beauty house could look like online. The brand, products, prices and photography are invented, and no orders are taken.",
      ar: "لا. تيفاوت موقع تجريبي صممته وبنته زينيث دبي ليُظهر كيف يمكن أن تبدو دار تجميل مغربية على الإنترنت. العلامة والمنتجات والأسعار والصور كلها متخيّلة، ولا تُقبل أي طلبات.",
    },
  },
  {
    q: { en: "Where would the argan come from?", ar: "من أين سيأتي الأركان؟" },
    a: {
      en: "From the argan forest of the Souss-Massa region around Taroudant and Agadir, the only place the tree grows wild in large numbers.",
      ar: "من غابة الأركان في جهة سوس ماسة حول تارودانت وأكادير، المكان الوحيد الذي تنمو فيه الشجرة برّيًا بأعداد كبيرة.",
    },
  },
  {
    q: { en: "How would shipping work?", ar: "كيف سيتم الشحن؟" },
    a: {
      en: "In this concept, orders ship from Agadir to Morocco, the UAE and the wider GCC, with free delivery over AED 450. The bag works so you can try the experience; checkout stops before any payment.",
      ar: "في هذا التصور، تُشحن الطلبات من أكادير إلى المغرب والإمارات وباقي دول الخليج، مع توصيل مجاني فوق 450 درهمًا. السلة تعمل لتجربة التصفح، والدفع يتوقف قبل أي عملية أداء.",
    },
  },
  {
    q: { en: "Can I use argan oil on oily skin?", ar: "هل يمكنني استعمال زيت الأركان على البشرة الدهنية؟" },
    a: {
      en: "Usually, yes: argan is light and absorbs quickly. Start with one or two drops at night over Sérum Hydra and see how your skin responds. If you have a skin condition, ask a dermatologist first.",
      ar: "غالبًا نعم، فالأركان خفيف وسريع الامتصاص. ابدئي بقطرة أو قطرتين ليلًا فوق سيروم هيدرا وراقبي استجابة بشرتك. وإن كانت لديك حالة جلدية، استشيري طبيب الجلد أولًا.",
    },
  },
  {
    q: { en: "Who made this website?", ar: "من صنع هذا الموقع؟" },
    a: {
      en: "Zenith Dubai designed the brand, the packaging and the website as one of its concept projects. If you want a site like this for your own brand, use the form below.",
      ar: "صممت زينيث دبي العلامة والتغليف والموقع كأحد مشاريعها التجريبية. إن أردت موقعًا مثله لعلامتك، استعمل النموذج أدناه.",
    },
  },
];

export const UI = {
  en: {
    concept: "Concept",
    conceptLong: "A concept website by Zenith Dubai. TIFAWT is a fictional brand and nothing here is for sale.",
    home: "Maison",
    products: "Collection",
    rituals: "Rituals",
    bag: "Bag",
    explore: "Explore",
    scroll: "Scroll",
    discover: "Discover the collection",
    storyLines: ["Tifawt, the first light;", "skin that wakes", "with a single", "drop", "and keeps its glow."],
    storyBody: [
      "In Tamazight, tifawt is the light that comes over the Atlas before sunrise. Our house begins there, in the argan forest of the Souss, where kernels are still cracked by hand and pressed without heat.",
      "Around that one oil we built a collection for skin, hair and the sun, with the science that makes it work in modern lives: hyaluronic water, high daily sun protection, textures made for heat.",
    ],
    storyGiant: "Souss",
    line: "Argan",
    collectionTitle: "La Collection",
    collectionLead: "Nine pieces, one oil at the heart of them. Each object is shaped after something you would find in a Moroccan house.",
    filters: { all: "All", face: "Face", hair: "Hair", sun: "Sun", botanical: "Botanicals" },
    add: "Add to bag",
    added: "Added",
    view: "View",
    atelierTitle: "The objects",
    atelierLead: "Drag to turn. Every bottle is a piece of Moroccan design: an arch, a star, a kasbah tower, a tajine.",
    processTitle: "From kernel to bottle",
    processLead: "How argan oil for skin is made, step by step.",
    ritualTitle: "Rituals",
    ritualLead: "Four steps at dawn, four at night. Add the whole ritual or one step at a time.",
    dawn: "Dawn",
    night: "Night",
    addRitual: "Add the ritual",
    finderTitle: "Find your ritual",
    finderLead: "Three questions, three products chosen for you.",
    finderAgain: "Start again",
    finderResult: "Your ritual",
    addAll: "Add all three",
    ingredientsTitle: "The south, in five ingredients",
    coffretsTitle: "Coffrets",
    coffretsLead: "Three gift boxes in sand paper with a carved cedar inlay.",
    contains: "Contains",
    faqTitle: "Questions",
    enquiryTitle: "Want a house like this online?",
    enquiryLead: "TIFAWT is a concept by Zenith Dubai. Tell us about your brand and we'll reply within two working days.",
    name: "Your name",
    email: "Email",
    brand: "Your brand or business",
    message: "What would you like to build?",
    send: "Send enquiry",
    sending: "Sending…",
    sent: "Thank you. We'll reply within two working days.",
    errs: {
      missing: "Add your name and email.",
      email: "Check the email address.",
      rate: "Too many messages from this connection. Try again in an hour.",
      unavailable: "The form isn't available right now. Email hello@zenithdubaicv.com instead.",
      invalid: "Something was missing. Reload the page and try again.",
    } as Record<string, string>,
    bagTitle: "Your bag",
    bagEmpty: "Your bag is empty.",
    bagEmptyCta: "Discover the collection",
    subtotal: "Subtotal",
    shippingLeft: (n: string) => `You're ${n} away from free delivery.`,
    shippingFree: "Free delivery unlocked.",
    checkout: "Checkout",
    remove: "Remove",
    qty: "Quantity",
    close: "Close",
    checkoutTitle: "This is a concept store",
    checkoutBody: "TIFAWT is a fictional brand designed by Zenith Dubai. The bag works so you can feel the experience, but no order is placed and no payment is taken.",
    checkoutCta: "Ask about a site like this",
    keep: "Keep browsing",
    benefits: "Benefits",
    keyIngredients: "Key ingredients",
    textureTitle: "Texture",
    howTo: "How to use",
    why: "Why choose it",
    pairs: "Complete the ritual",
    back: "Back",
    allProducts: "All products",
    footerLine: "Argan from the Souss, shaped by Moroccan design.",
    madeBy: "Concept website by Zenith Dubai",
    rights: "TIFAWT is a fictional brand. Photography generated for this concept.",
    skipIntro: "Skip intro",
    next: "Next",
    prev: "Previous",
    of: "of",
    turn: "Drag to turn",
  },
  ar: {
    concept: "تجريبي",
    conceptLong: "موقع تجريبي من زينيث دبي. تيفاوت علامة متخيّلة ولا يُباع هنا أي شيء.",
    home: "الدار",
    products: "المجموعة",
    rituals: "الطقوس",
    bag: "السلة",
    explore: "اكتشفي",
    scroll: "مرّري",
    discover: "اكتشفي المجموعة",
    storyLines: ["تيفاوت، أول الضوء؛", "بشرة تستيقظ", "مع", "قطرة", "واحدة وتحتفظ بإشراقتها."],
    storyBody: [
      "في الأمازيغية، تيفاوت هي الضوء الذي يعلو الأطلس قبل شروق الشمس. من هناك تبدأ دارنا، في غابة الأركان بسوس، حيث ما زالت النوى تُكسر يدويًا وتُعصر دون حرارة.",
      "وحول هذا الزيت الواحد بنينا مجموعة للبشرة والشعر والشمس، مع العلم الذي يجعلها تناسب الحياة العصرية: ترطيب بالهيالورونيك، وحماية يومية عالية من الشمس، وقوام مصنوع للحرارة.",
    ],
    storyGiant: "سوس",
    line: "أركان",
    collectionTitle: "المجموعة",
    collectionLead: "تسع قطع، وزيت واحد في قلبها. كل قارورة مستوحاة من شيء تجدينه في بيت مغربي.",
    filters: { all: "الكل", face: "الوجه", hair: "الشعر", sun: "الشمس", botanical: "النباتات" },
    add: "أضيفي إلى السلة",
    added: "أُضيف",
    view: "عرض",
    atelierTitle: "القطع",
    atelierLead: "اسحبي للتدوير. كل قارورة قطعة من التصميم المغربي: قوس، ونجمة، وبرج قصبة، وطاجين.",
    processTitle: "من النواة إلى القارورة",
    processLead: "كيف يُصنع زيت الأركان للبشرة، خطوة بخطوة.",
    ritualTitle: "الطقوس",
    ritualLead: "أربع خطوات عند الفجر، وأربع في الليل. أضيفي الطقس كاملًا أو خطوة واحدة.",
    dawn: "الفجر",
    night: "الليل",
    addRitual: "أضيفي الطقس",
    finderTitle: "اكتشفي طقسك",
    finderLead: "ثلاثة أسئلة، وثلاثة منتجات مختارة لك.",
    finderAgain: "ابدئي من جديد",
    finderResult: "طقسك",
    addAll: "أضيفي الثلاثة",
    ingredientsTitle: "الجنوب في خمسة مكونات",
    coffretsTitle: "علب الهدايا",
    coffretsLead: "ثلاث علب هدايا من ورق رملي مع ترصيع من خشب الأرز المنحوت.",
    contains: "تحتوي على",
    faqTitle: "أسئلة",
    enquiryTitle: "هل تريد دارًا كهذه على الإنترنت؟",
    enquiryLead: "تيفاوت مشروع تجريبي من زينيث دبي. حدّثنا عن علامتك وسنرد خلال يومي عمل.",
    name: "اسمك",
    email: "البريد الإلكتروني",
    brand: "علامتك أو نشاطك",
    message: "ماذا تريد أن تبني؟",
    send: "أرسل الطلب",
    sending: "جارٍ الإرسال…",
    sent: "شكرًا لك. سنرد خلال يومي عمل.",
    errs: {
      missing: "أضف اسمك وبريدك الإلكتروني.",
      email: "تحقق من عنوان البريد الإلكتروني.",
      rate: "رسائل كثيرة من هذا الاتصال. حاول مجددًا بعد ساعة.",
      unavailable: "النموذج غير متاح الآن. راسلنا على hello@zenithdubaicv.com.",
      invalid: "نقصت معلومة. أعد تحميل الصفحة وحاول مجددًا.",
    } as Record<string, string>,
    bagTitle: "سلتك",
    bagEmpty: "سلتك فارغة.",
    bagEmptyCta: "اكتشفي المجموعة",
    subtotal: "المجموع",
    shippingLeft: (n: string) => `يفصلك ${n} عن التوصيل المجاني.`,
    shippingFree: "التوصيل مجاني.",
    checkout: "إتمام الطلب",
    remove: "إزالة",
    qty: "الكمية",
    close: "إغلاق",
    checkoutTitle: "هذا متجر تجريبي",
    checkoutBody: "تيفاوت علامة متخيّلة صممتها زينيث دبي. السلة تعمل لتعيشي التجربة، لكن لا يُسجَّل أي طلب ولا يُؤخذ أي أداء.",
    checkoutCta: "اسأل عن موقع كهذا",
    keep: "تابعي التصفح",
    benefits: "الفوائد",
    keyIngredients: "المكونات الأساسية",
    textureTitle: "القوام",
    howTo: "طريقة الاستعمال",
    why: "لماذا تختارينه",
    pairs: "أكملي الطقس",
    back: "رجوع",
    allProducts: "كل المنتجات",
    footerLine: "أركان من سوس، بتصميم مغربي.",
    madeBy: "موقع تجريبي من زينيث دبي",
    rights: "تيفاوت علامة متخيّلة. الصور مولّدة لهذا المشروع.",
    skipIntro: "تخطي المقدمة",
    next: "التالي",
    prev: "السابق",
    of: "من",
    turn: "اسحبي للتدوير",
  },
};

export type UIStrings = (typeof UI)["en"];

export const money = (n: number, lang: Lang) =>
  lang === "ar" ? `${n.toLocaleString("ar-MA")} ${CURRENCY.ar}` : `${CURRENCY.en} ${n.toLocaleString("en-US")}`;

/** Resolves a grid-cell image to a URL plus the CSS that shows only that quarter. */
export function cellStyle(c: GridCell): { url: string; size: string; pos: string } {
  const url = (A as Record<string, string>)[c.src] ?? "";
  const pos = ["0% 0%", "100% 0%", "0% 100%", "100% 100%"][c.cell];
  return { url, size: "200% 200%", pos };
}

/** Why each object has its shape: every piece is taken from something in a Moroccan house. */
export const OBJECT_NOTES: Record<string, L> = {
  "huile-pure": {
    en: "A flat flask cut like a horseshoe arch, the doorway of every riad. The label repeats the arch, and the brass dropper ends in a carved cedar bulb.",
    ar: "قارورة مسطحة على شكل قوس حدوة الحصان، باب كل رياض. الملصق يكرر القوس، والقطارة النحاسية تنتهي بكرة من خشب الأرز المنحوت.",
  },
  "creme-lumiere": {
    en: "An eight-pointed star, the khatam of Moroccan zellige, cast in thick amber glass under a brass lid struck with the rays of the sun.",
    ar: "نجمة ثمانية الرؤوس، خاتم الزليج المغربي، مصبوبة في زجاج كهرماني سميك تحت غطاء نحاسي محفور بأشعة الشمس.",
  },
  "voile-solaire": {
    en: "A square tower in opaline glass, stepped at the top like the crenellations of a kasbah in the Dadès.",
    ar: "برج مربع من الزجاج الأوباليني، متدرج في أعلاه كشرفات قصبة في دادس.",
  },
  "huile-capillaire": {
    en: "A bottle that turns like a braid, with a cedar stopper and an arch-shaped tag on an indigo cord.",
    ar: "قارورة تلتف كالضفيرة، بسدادة من خشب الأرز وبطاقة على شكل قوس معلقة بخيط نيلي.",
  },
  "serum-hydra": {
    en: "A frosted bottle in the shape of an argan kernel, the seed every TIFAWT formula starts from.",
    ar: "قارورة مصنفرة على شكل نواة الأركان، البذرة التي تبدأ منها كل تركيبة لتيفاوت.",
  },
  "baume-nuit": {
    en: "A miniature tajine in black stoneware. The brass knob lifts the cone the way you lift a tajine at dinner.",
    ar: "طاجين صغير من الفخار الأسود. المقبض النحاسي يرفع المخروط كما يُرفع غطاء الطاجين على العشاء.",
  },
  "eau-de-rose": {
    en: "The silhouette of the mrech, the rose-water sprinkler poured over guests' hands at Moroccan celebrations.",
    ar: "شكل المرش، الذي يُرش منه ماء الورد على أيدي الضيوف في الأفراح المغربية.",
  },
  ghassoul: {
    en: "A hammam bowl, the tassa, in sand-coloured ceramic under a hand-hammered brass lid.",
    ar: "طاسة الحمّام من خزف بلون الرمل تحت غطاء نحاسي مطروق يدويًا.",
  },
  "huile-de-figue": {
    en: "A vial cut like a gem, crowned with a brass stopper shaped like the cactus pad its seeds come from.",
    ar: "قارورة مقطوعة كالجوهرة، يعلوها سداد نحاسي على شكل لوح الصبّار الذي تأتي منه بذورها.",
  },
};
