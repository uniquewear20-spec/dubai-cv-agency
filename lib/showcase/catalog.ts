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
];
