// The concept-website gallery at /showcase/. Every business listed here is fictional: each entry is a
// working website Zenith Dubai designed and built as a concept. This catalog is separate from the
// personal portfolio sites in lib/portfolios.ts.

export type GalleryLang = "en" | "fr" | "ar";
export type T = Record<GalleryLang, string>;

export type CategoryId =
  | "real-estate" | "beauty" | "hotels" | "restaurants" | "ecommerce" | "architecture"
  | "healthcare" | "automotive" | "professional" | "fitness" | "travel" | "events";

/** `planned` is the size of each series in the 100-site plan; the page only ever counts what is built. */
export const CATEGORIES: { id: CategoryId; name: T; planned: number }[] = [
  { id: "real-estate", name: { en: "Real estate", fr: "Immobilier", ar: "العقارات" }, planned: 20 },
  { id: "beauty", name: { en: "Beauty", fr: "Beauté", ar: "التجميل" }, planned: 12 },
  { id: "hotels", name: { en: "Hotels", fr: "Hôtels", ar: "الفنادق" }, planned: 10 },
  { id: "restaurants", name: { en: "Restaurants", fr: "Restaurants", ar: "المطاعم" }, planned: 8 },
  { id: "ecommerce", name: { en: "Online shops", fr: "Boutiques en ligne", ar: "المتاجر الإلكترونية" }, planned: 8 },
  { id: "architecture", name: { en: "Architecture and interiors", fr: "Architecture et intérieurs", ar: "العمارة والتصميم الداخلي" }, planned: 8 },
  { id: "healthcare", name: { en: "Healthcare", fr: "Santé", ar: "الرعاية الصحية" }, planned: 7 },
  { id: "automotive", name: { en: "Automotive", fr: "Automobile", ar: "السيارات" }, planned: 7 },
  { id: "professional", name: { en: "Finance, law and consulting", fr: "Finance, droit et conseil", ar: "المال والقانون والاستشارات" }, planned: 5 },
  { id: "fitness", name: { en: "Fitness", fr: "Sport et bien-être", ar: "اللياقة" }, planned: 5 },
  { id: "travel", name: { en: "Travel", fr: "Voyage", ar: "السفر" }, planned: 5 },
  { id: "events", name: { en: "Events, education and creative", fr: "Événements, éducation et création", ar: "الفعاليات والتعليم والإبداع" }, planned: 5 },
];

export interface Concept {
  slug: string;
  name: string;
  category: CategoryId;
  /** What the site does, in one line. */
  line: T;
  /** The one thing to try on the site. */
  feature: T;
  /** Generated cover image (16:9). */
  image: string;
  focus?: string;
}

export const CONCEPTS: Concept[] = [
  {
    slug: "halo-ridge",
    name: "Halo Ridge",
    category: "real-estate",
    line: {
      en: "A villa community on the edge of the desert, sold through a flight you control with your scroll.",
      fr: "Une communauté de villas aux portes du désert, présentée par un vol que l'on pilote au défilement.",
      ar: "مجتمع فلل على حافة الصحراء، يُعرض عبر رحلة جوية تتحكم بها بالتمرير.",
    },
    feature: {
      en: "Scroll-controlled flight from the sky to the front door, then floor plans you can walk",
      fr: "Vol piloté au défilement, du ciel jusqu'à la porte, puis des plans à parcourir",
      ar: "رحلة بالتمرير من السماء حتى الباب، ثم مخططات طوابق يمكن التجول فيها",
    },
    image: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_001957_11af7275-f38e-44b7-95e1-c0ac392e3b20_min.webp",
    focus: "50% 55%",
  },
  {
    slug: "tifawt",
    name: "TIFAWT",
    category: "beauty",
    line: {
      en: "A Moroccan argan beauty house where every product is a sculpted object, from a horseshoe-arch flask to a tajine jar.",
      fr: "Une maison de beauté marocaine à l'argan où chaque produit est un objet sculpté, du flacon en arc outrepassé au pot en tajine.",
      ar: "دار تجميل مغربية بالأركان، كل منتج فيها قطعة منحوتة، من قارورة القوس إلى برطمان الطاجين.",
    },
    feature: {
      en: "A split-screen opening you scroll through, then a full shop: bag, rituals, a product finder and nine product pages",
      fr: "Une ouverture en écran partagé pilotée au défilement, puis une boutique complète : panier, rituels, diagnostic et neuf fiches produit",
      ar: "افتتاحية بشاشة مقسومة تتنقل فيها بالتمرير، ثم متجر كامل: سلة وطقوس ومساعد اختيار وتسع صفحات منتجات",
    },
    image: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_051546_454b796d-6f42-466e-980a-a04c8ec37468_min.webp",
    focus: "50% 45%",
  },
  {
    slug: "hayrat",
    name: "HAYRAT",
    category: "hotels",
    line: {
      en: "Eighteen rooms on an old pearl-diving island in the Gulf, forty minutes from shore by dhow.",
      fr: "Dix-huit chambres sur une ancienne île de pêcheurs de perles du Golfe, à quarante minutes du rivage en boutre.",
      ar: "ثماني عشرة غرفة على جزيرة قديمة لصيد اللؤلؤ في الخليج، على بُعد أربعين دقيقة من الشاطئ بالسفينة الشراعية.",
    },
    feature: {
      en: "A dive you scroll, from the dhow down to the oyster banks at twelve metres, then a booking engine with live rates",
      fr: "Une plongée au défilement, du boutre jusqu'aux bancs d'huîtres à douze mètres, puis un moteur de réservation avec tarifs en direct",
      ar: "غوص بالتمرير من السفينة حتى هيرات المحار على عمق اثني عشر متراً، ثم محرك حجز بأسعار مباشرة",
    },
    image: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_123629_c59c7157-18d8-4950-b9d4-379fe802c80e_min.webp",
    focus: "40% 55%",
  },
  {
    slug: "mawqid",
    name: "MAWQID",
    category: "restaurants",
    line: {
      en: "Fourteen seats around one open fire in Al Quoz, cooked over oak, olive and date palm.",
      fr: "Quatorze places autour d'un seul feu à Al Quoz, une cuisine au chêne, à l'olivier et au palmier dattier.",
      ar: "أربعة عشر مقعداً حول نار واحدة في القوز، والطهي على البلوط والزيتون وسعف النخيل.",
    },
    feature: {
      en: "A tasting menu you scroll at each course's heat, then a reservation where you pick your seat at the counter",
      fr: "Un menu dégustation qui défile à la chaleur de chaque plat, puis une réservation où l'on choisit sa place au comptoir",
      ar: "قائمة تذوّق تتنقّل فيها بالتمرير على حرارة كل طبق، ثم حجز تختار فيه مقعدك على الكاونتر",
    },
    image: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_145705_4cca2547-5048-49bb-bbb3-a648b2f5a4e3_min.webp",
    focus: "50% 60%",
  },
  {
    slug: "zill",
    name: "ZILL",
    category: "architecture",
    line: {
      en: "An architecture and interiors studio for hot climates: courtyards, thick earth walls and wind towers.",
      fr: "Un studio d'architecture et d'intérieurs pour les climats chauds : patios, murs de terre épais et tours à vent.",
      ar: "استوديو للعمارة والتصميم الداخلي في المناخات الحارة: أفنية وجدران سميكة من التراب وأبراج رياح.",
    },
    feature: {
      en: "A courtyard house that puts itself together as you scroll, and a sun study that measures its shade hour by hour",
      fr: "Une maison à patio qui se monte au fil du défilement, et une étude solaire qui mesure son ombre heure par heure",
      ar: "بيت بفناء يتركّب كلما مرّرت، ودراسة شمس تقيس ظلّه ساعة بساعة",
    },
    image: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_153253_673f7f5e-f3ca-47b3-ab4b-ab8b209aa248_min.webp",
    focus: "60% 55%",
  },
  {
    slug: "oriel-88",
    name: "ORIEL 88",
    category: "real-estate",
    line: {
      en: "Eighty-eight floors of residences in a bronze-finned tower on the Dubai Water Canal.",
      fr: "Quatre-vingt-huit étages de résidences dans une tour aux ailettes de bronze, sur le Dubai Water Canal.",
      ar: "ثمانية وثمانون طابقاً من المساكن في برج بزعانف برونزية على قناة دبي المائية.",
    },
    feature: {
      en: "Pick a floor on the tower's elevation to see its homes, prices and the view from that height",
      fr: "Choisissez un étage sur la façade de la tour pour voir ses logements, leurs prix et la vue depuis cette hauteur",
      ar: "اختر طابقاً على واجهة البرج لترى منازله وأسعارها والمنظر من ذلك الارتفاع",
    },
    image: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_160324_6edfd8c4-6034-4e45-8a9e-9d185965814f_min.webp",
    focus: "50% 50%",
  },
  {
    slug: "khayyal",
    name: "KHAYYAL",
    category: "automotive",
    line: {
      en: "A Gulf grand-tourer marque: one long, low coupé built by hand, ninety-nine a year.",
      fr: "Une marque de grand tourisme du Golfe : un seul coupé long et bas, fait main, quatre-vingt-dix-neuf par an.",
      ar: "علامة سيارات جي تي خليجية: كوبيه واحدة طويلة ومنخفضة تُصنع يدوياً، تسع وتسعون في السنة.",
    },
    feature: {
      en: "Move the studio light along the car, build yours with a live price, then book a test drive",
      fr: "Déplacez la lumière du studio le long de la voiture, configurez la vôtre avec le prix en direct, puis réservez un essai",
      ar: "حرّك ضوء الاستوديو على السيارة، وصمّم سيارتك بسعر مباشر، ثم احجز تجربة قيادة",
    },
    image: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_162629_d523d832-6dcf-4cf8-bdbe-d78602c53839_min.webp",
    focus: "50% 55%",
  },
  {
    slug: "muskana",
    name: "MUSKANA",
    category: "ecommerce",
    line: {
      en: "An oud house in Dubai: oils, attars and bakhoor, made to be worn one over the other.",
      fr: "Une maison de oud à Dubaï : huiles, attars et bakhoor, faits pour se porter les uns sur les autres.",
      ar: "دار عود في دبي: دهون وعطور زيتية وبخور، صُنعت لتُلبس الواحدة فوق الأخرى.",
    },
    feature: {
      en: "Build a layered scent in a bottle that fills as you choose, then shop with a working bag",
      fr: "Composez un parfum en couches dans un flacon qui se remplit à chaque choix, puis faites vos achats avec un panier qui fonctionne",
      ar: "اصنع عطراً من طبقات في زجاجة تمتلئ مع كل اختيار، ثم تسوّق بحقيبة تعمل",
    },
    image: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_165152_2e7cf649-5da6-451b-b851-548c08ff1074_min.webp",
    focus: "50% 50%",
  },
  {
    slug: "mabsam",
    name: "MABSAM",
    category: "healthcare",
    line: {
      en: "A small dental clinic in Jumeirah: four rooms, olive trees at every window, and time.",
      fr: "Une petite clinique dentaire à Jumeirah : quatre salles, des oliviers à chaque fenêtre, et du temps.",
      ar: "عيادة أسنان صغيرة في جميرا: أربع غرف، وأشجار زيتون عند كل نافذة، ووقت كافٍ.",
    },
    feature: {
      en: "A calm treatment finder that also asks how you feel about dentists, then a first-visit booking",
      fr: "Un outil apaisant pour trouver un soin, qui demande aussi ce que vous ressentez chez le dentiste, puis la réservation d'un premier rendez-vous",
      ar: "أداة هادئة لاختيار العلاج تسألك أيضاً عن شعورك تجاه طبيب الأسنان، ثم حجز زيارة أولى",
    },
    image: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_172908_062cde89-7357-495e-aca2-fe370a4ae34e_min.webp",
    focus: "50% 50%",
  },
  {
    slug: "shoreline-9",
    name: "SHORELINE NO. 9",
    category: "real-estate",
    line: {
      en: "One beachfront house for sale on Palm Jumeirah: forty-six metres of private beach and seven bedrooms.",
      fr: "Une seule maison en front de mer à vendre sur Palm Jumeirah : quarante-six mètres de plage privée et sept chambres.",
      ar: "منزل واحد على الشاطئ للبيع في نخلة جميرا: ستة وأربعون متراً من الشاطئ الخاص وسبع غرف نوم.",
    },
    feature: {
      en: "Walk the plan room by room across three levels, pan the terrace view, then request a private viewing",
      fr: "Parcourez le plan pièce par pièce sur trois niveaux, faites défiler la vue de la terrasse, puis demandez une visite privée",
      ar: "تجوّل في المخطط غرفة غرفة على ثلاثة مستويات، ومرّر منظر الشرفة، ثم اطلب معاينة خاصة",
    },
    image: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261126_191823_ae8207fa-3da4-48cf-bea6-8f8315c0a940_min.webp",
    focus: "50% 55%",
  },
];
