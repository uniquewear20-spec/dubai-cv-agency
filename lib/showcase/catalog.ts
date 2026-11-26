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
];
