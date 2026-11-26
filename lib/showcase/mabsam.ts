// MABSAM: a fictional dental clinic in Jumeirah. A concept website by Zenith Dubai. The clinic, its
// treatments, prices and times are invented and illustrative; nothing here is medical advice. The
// treatment finder and the booking work end to end and stop at a notice before anything is sent.

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
const hf = (id: string) => `${CDN}${id}_min.webp`;
const crop = (id: string, W: number, H: number, boxes: number[][]) => boxes.map((b) => `crop:${CDN}${id}_min.webp#${W},${H},${b.join(",")}`);

export const IMG = {
  hero: hf("hf_20261126_172908_062cde89-7357-495e-aca2-fe370a4ae34e"),
  heroTall: hf("hf_20261126_172948_126e5ef5-6f37-4140-a2db-d1182a6658ae"),
  room: hf("hf_20261126_173410_b66b2126-75d5-4c39-a3f3-b074572ca8d3"),
  visit: hf("hf_20261126_173454_8cffd90b-9e03-43e9-9406-586059a5a343"),
  facade: hf("hf_20261126_174504_9631824a-d94a-4c66-98a1-a55c414c2fc9"),
  calm: hf("hf_20261126_174956_a0093076-9e4f-4ce6-bf71-bd0d2af3883b"),
};
export const GRID = {
  clinic: crop("hf_20261126_173918_78df7b4e-8152-4273-aa27-9711869df6ef", 2720, 1536, [[4, 4, 1338, 750], [1381, 4, 1335, 750], [4, 791, 1338, 741], [1381, 791, 1335, 741]]),
  details: crop("hf_20261126_173949_ccded099-8234-4aed-8323-768b7ae2bf48", 2048, 2048, [[4, 4, 1001, 1000], [1049, 4, 995, 1000], [4, 1047, 1001, 997], [1049, 1047, 995, 997]]),
  care: crop("hf_20261126_174449_31bb7ee9-5130-4b1a-bab8-1d828f822f7e", 1760, 2352, [[4, 4, 863, 1159], [893, 4, 863, 1159], [4, 1191, 863, 1157], [893, 1191, 863, 1157]]),
};
export const ALT = {
  hero: { en: "A calm clinic reception with curved oak walls and a garden window", ar: "استقبال عيادة هادئ بجدران منحنية من خشب البلوط ونافذة على الحديقة" },
  heroTall: { en: "A curved oak corridor with plants and soft light", ar: "ممر منحنٍ من البلوط مع نباتات وضوء ناعم" },
  room: { en: "A treatment room with a white chair and a window onto olive trees", ar: "غرفة علاج بكرسي أبيض ونافذة على أشجار الزيتون" },
  visit: { en: "A dentist showing a patient a tooth model on a tablet", ar: "طبيب أسنان يُري مريضاً نموذج سن على جهاز لوحي" },
  facade: { en: "A white single-storey clinic among olive trees", ar: "عيادة بيضاء من طابق واحد بين أشجار الزيتون" },
  calm: { en: "Olive leaves against a pale wall in soft light", ar: "أوراق زيتون على جدار فاتح في ضوء ناعم" },
} satisfies Record<string, L>;
export const CLINIC: L[] = [
  { en: "The lounge, with nothing on the walls to read", ar: "الصالة، بلا شيء على الجدران لتقرأه" },
  { en: "Sterilisation, behind glass so you can see it", ar: "التعقيم، خلف زجاج لتراه" },
  { en: "Corridors lit from below, never from above", ar: "ممرات مضاءة من الأسفل، لا من الأعلى" },
  { en: "A quiet room for after a longer visit", ar: "غرفة هادئة لما بعد الزيارات الطويلة" },
];
export const DETAILS: L[] = [
  { en: "Instruments laid out only when you are ready", ar: "الأدوات لا تُعرض إلا حين تكون مستعداً" },
  { en: "Shade matched in daylight, by the window", ar: "مطابقة اللون في ضوء النهار قرب النافذة" },
  { en: "Water and a warm towel, every time", ar: "ماء ومنشفة دافئة في كل مرة" },
  { en: "Stone, oak and plants instead of posters", ar: "حجر وبلوط ونباتات بدل الملصقات" },
];
export const CARE: L[] = [
  { en: "The light is moved, never shone in your eyes", ar: "يُحرّك الضوء ولا يُسلّط على عينيك" },
  { en: "Raise a hand and everything stops", ar: "ارفع يدك فيتوقف كل شيء" },
  { en: "Trays prepared out of sight", ar: "الأدوات تُجهّز بعيداً عن نظرك" },
  { en: "A kit to take home, in linen", ar: "طقم تأخذه معك إلى البيت في كيس كتان" },
];

/* ───────── treatment finder ───────── */

export const CONCERNS: { id: string; name: L; tx: string[] }[] = [
  { id: "checkup", name: { en: "It's time for a check-up", ar: "حان وقت الفحص" }, tx: ["checkup"] },
  { id: "sensitive", name: { en: "Teeth feel sensitive", ar: "أسنان حساسة" }, tx: ["sensitivity", "checkup"] },
  { id: "colour", name: { en: "I'd like them whiter", ar: "أريدها أكثر بياضاً" }, tx: ["whitening", "veneers"] },
  { id: "chip", name: { en: "A chipped or worn tooth", ar: "سن مكسور أو متآكل" }, tx: ["bonding", "veneers"] },
  { id: "gaps", name: { en: "Gaps or crowding", ar: "فراغات أو تزاحم" }, tx: ["aligners", "bonding"] },
  { id: "missing", name: { en: "A missing tooth", ar: "سن مفقود" }, tx: ["implant"] },
  { id: "gums", name: { en: "Gums that bleed", ar: "لثة تنزف" }, tx: ["gums", "checkup"] },
];
export interface Treatment {
  id: string;
  name: L;
  what: L;
  visits: L;
  span: number; // 0 one visit, 1 weeks, 2 months
  price: L;
}
export const TREATMENTS: Treatment[] = [
  { id: "checkup", name: { en: "Check-up and clean", ar: "فحص وتنظيف" }, what: { en: "An exam, X-rays if needed, and a gentle clean.", ar: "فحص وأشعة عند الحاجة وتنظيف لطيف." }, visits: { en: "1 visit, about 60 min", ar: "زيارة واحدة، نحو 60 دقيقة" }, span: 0, price: { en: "AED 450 to 650", ar: "450 إلى 650 درهماً" } },
  { id: "sensitivity", name: { en: "Sensitivity visit", ar: "زيارة الحساسية" }, what: { en: "Finding where it comes from, then protecting the surface.", ar: "معرفة مصدرها ثم حماية سطح السن." }, visits: { en: "1 visit, about 40 min", ar: "زيارة واحدة، نحو 40 دقيقة" }, span: 0, price: { en: "AED 350 to 600", ar: "350 إلى 600 درهم" } },
  { id: "whitening", name: { en: "Whitening", ar: "التبييض" }, what: { en: "After a check-up: in the chair, at home, or both.", ar: "بعد الفحص: في العيادة أو في البيت أو الاثنان." }, visits: { en: "1 to 2 visits", ar: "زيارة إلى زيارتين" }, span: 1, price: { en: "AED 1,500 to 2,800", ar: "1,500 إلى 2,800 درهم" } },
  { id: "bonding", name: { en: "Composite bonding", ar: "الترميم التجميلي" }, what: { en: "Tooth-coloured resin shaped by hand, no drilling in most cases.", ar: "مادة بلون السن تُشكّل باليد، دون حفر في أغلب الحالات." }, visits: { en: "1 visit per tooth", ar: "زيارة لكل سن" }, span: 0, price: { en: "AED 900 to 1,600 per tooth", ar: "900 إلى 1,600 درهم للسن" } },
  { id: "veneers", name: { en: "Porcelain veneers", ar: "قشور البورسلين" }, what: { en: "Thin porcelain shells, planned on a model before anything changes.", ar: "قشور رقيقة من البورسلين تُخطط على نموذج قبل أي تغيير." }, visits: { en: "2 to 3 visits over 2 to 3 weeks", ar: "زيارتان إلى ثلاث خلال 2 إلى 3 أسابيع" }, span: 1, price: { en: "AED 3,500 to 5,500 per tooth", ar: "3,500 إلى 5,500 درهم للسن" } },
  { id: "aligners", name: { en: "Clear aligners", ar: "التقويم الشفاف" }, what: { en: "A series of clear trays you change every week or two.", ar: "سلسلة من القوالب الشفافة تغيّرها كل أسبوع أو اثنين." }, visits: { en: "A visit every 6 to 8 weeks, 6 to 18 months", ar: "زيارة كل 6 إلى 8 أسابيع، لمدة 6 إلى 18 شهراً" }, span: 2, price: { en: "AED 12,000 to 24,000", ar: "12,000 إلى 24,000 درهم" } },
  { id: "implant", name: { en: "Implant", ar: "زراعة سن" }, what: { en: "A titanium root and a porcelain crown, in stages.", ar: "جذر من التيتانيوم وتاج من البورسلين، على مراحل." }, visits: { en: "3 to 4 visits over 3 to 6 months", ar: "3 إلى 4 زيارات خلال 3 إلى 6 أشهر" }, span: 2, price: { en: "AED 9,000 to 14,000", ar: "9,000 إلى 14,000 درهم" } },
  { id: "gums", name: { en: "Gum care", ar: "العناية باللثة" }, what: { en: "A deeper clean under the gum line, then a review.", ar: "تنظيف أعمق تحت خط اللثة ثم مراجعة." }, visits: { en: "1 to 2 visits", ar: "زيارة إلى زيارتين" }, span: 1, price: { en: "AED 900 to 2,200", ar: "900 إلى 2,200 درهم" } },
];
export const NERVES: { id: string; name: L; comfort: L[] }[] = [
  { id: "calm", name: { en: "I'm fine with dentists", ar: "لا مشكلة لدي مع أطباء الأسنان" }, comfort: [{ en: "Music of your choice in the room", ar: "موسيقى من اختيارك في الغرفة" }] },
  { id: "little", name: { en: "A little nervous", ar: "متوتر قليلاً" }, comfort: [{ en: "Everything explained before it happens", ar: "شرح كل خطوة قبل حدوثها" }, { en: "A raised hand stops everything", ar: "رفع اليد يوقف كل شيء" }, { en: "A weighted blanket in the chair", ar: "بطانية ثقيلة على الكرسي" }] },
  { id: "very", name: { en: "Very nervous", ar: "متوتر جداً" }, comfort: [{ en: "A first visit with no treatment, just talking", ar: "زيارة أولى بلا علاج، للحديث فقط" }, { en: "The longest slot of the day, so nobody rushes", ar: "أطول موعد في اليوم، فلا أحد يستعجل" }, { en: "A raised hand stops everything", ar: "رفع اليد يوقف كل شيء" }, { en: "Sedation discussed, if you want it", ar: "مناقشة التهدئة إن رغبت" }] },
];
export const SPANS: { id: number; name: L }[] = [
  { id: 0, name: { en: "One visit", ar: "زيارة واحدة" } },
  { id: 1, name: { en: "A few weeks", ar: "بضعة أسابيع" } },
  { id: 2, name: { en: "Months, if it's worth it", ar: "أشهر، إن كان يستحق" } },
];
export function shortlist(concerns: string[], span: number) {
  const ids = [...new Set(concerns.flatMap((c) => CONCERNS.find((x) => x.id === c)?.tx ?? []))];
  const list = ids.map((id) => TREATMENTS.find((t) => t.id === id)!).filter(Boolean);
  return { fits: list.filter((t) => t.span <= span), longer: list.filter((t) => t.span > span) };
}

export const TIMES = ["09:00", "10:30", "12:00", "15:00", "16:30", "18:00"];
export function takenTimes(iso: string) {
  let h = 7;
  for (const c of iso) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return TIMES.filter((_, i) => (h >> (i * 2)) % 3 === 0);
}

export const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "Is MABSAM a real clinic?", ar: "هل مَبسم عيادة حقيقية؟" },
    a: {
      en: "No. MABSAM, its treatments, prices and times are fictional: a concept website designed and built by Zenith Dubai. Nothing here is medical advice, the photographs are AI-generated, and no appointment can be booked.",
      ar: "لا. مَبسم وعلاجاتها وأسعارها ومواعيدها من الخيال: موقع تجريبي صمّمته وبنته زينيث دبي. لا شيء هنا نصيحة طبية، والصور مولّدة بالذكاء الاصطناعي، ولا يمكن حجز أي موعد.",
    },
  },
  { q: { en: "Are the prices real?", ar: "هل الأسعار حقيقية؟" }, a: { en: "They are illustrative ranges for this concept. A real clinic confirms a plan and a price only after an examination.", ar: "إنها نطاقات توضيحية لهذا التصور. العيادة الحقيقية لا تؤكد خطة أو سعراً إلا بعد الفحص." } },
  { q: { en: "Does the finder diagnose anything?", ar: "هل تشخّص الأداة شيئاً؟" }, a: { en: "No. It shows the kinds of treatment people usually ask about, to start a conversation with a dentist.", ar: "لا. إنها تعرض أنواع العلاج التي يسأل عنها الناس عادة، لبدء حديث مع طبيب الأسنان." } },
];

const common = {
  en: {
    tagline: "A dentist you don't dread.",
    sub: "MABSAM is a small clinic in Jumeirah: four rooms, olive trees at every window, and as much time as you need.",
    find: "Find what you need",
    book: "Book a first visit",
    nav: { finder: "Treatments", clinic: "The clinic", care: "Care", breathe: "Breathe", visit: "Visit", contact: "Contact" },
    menu: "Menu",
    close: "Close",
    langName: "العربية",
    concept: "Concept website. MABSAM is fictional.",
    conceptShort: "Fictional clinic",
    finderTitle: "What brings you in?",
    finderIntro: "Choose everything that applies. This shows options to talk through with a dentist; it is not a diagnosis.",
    q1: "What brings you in",
    q2: "How do you feel about dentists",
    q3: "How much time you have",
    options: "Options to ask about",
    takesLonger: "These take longer than you said",
    nothing: "Choose at least one reason to see options.",
    comfortTitle: "What we would do for you",
    priceNote: "Indicative ranges for this concept. A plan and a price are only confirmed after an exam.",
    bookThis: "Book a first visit about this",
    roomTitle: "The rooms",
    roomBody: "Four treatment rooms, each with a window onto olive trees. The chair faces the garden, not the equipment.",
    firstTitle: "Your first visit",
    firstSteps: [
      "Forty-five minutes, and the first ten are only talking.",
      "Photos and a scan, shown to you on a screen as we go.",
      "A written plan with options and prices to take home.",
      "Nothing happens on the day unless you ask for it.",
    ],
    clinicTitle: "The clinic",
    detailsTitle: "Small things",
    careTitle: "How you are looked after",
    breatheTitle: "Breathe with it",
    breatheBody: "Many of our patients do this in the waiting room. In for four, out for six.",
    breatheStart: "Start",
    breatheStop: "Stop",
    breathIn: "In",
    breathOut: "Out",
    visitTitle: "Book a first visit",
    visitIntro: "Choose a day and a time. First visits are 45 minutes.",
    reason: "Reason",
    reasonFree: "Just a first visit",
    day: "Day",
    time: "Time",
    taken: "Taken",
    pickTime: "Choose a time first.",
    confirm: "Request this visit",
    yourVisit: (when: string) => `${when}, 45 minutes`,
    where: "Jumeirah Beach Road, opposite the park. Parking at the door. Sunday to Thursday 9:00 to 19:00, Saturday 10:00 to 16:00.",
    noticeTitle: "This is where the visit would be requested",
    noticeBody: "MABSAM is a concept website by Zenith Dubai. The clinic is invented, so no appointment was made and no one has been contacted.",
    noticeCta: "Back to the clinic",
    noticeZenith: "Want a website like this?",
    contactTitle: "Ask a question",
    contactIntro: "MABSAM is fictional, so a message here reaches Zenith Dubai, who designed and built this website. Please don't send health details.",
    faqTitle: "Questions",
    footer: "MABSAM is a fictional clinic. Treatments, prices and photographs are illustrative and AI-generated for this concept; nothing here is medical advice.",
    footerBy: "Concept, design and build by Zenith Dubai",
    backToGallery: "All concept websites",
    skip: "Skip to the treatment finder",
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
    interests: ["A first visit", "A treatment", "Prices", "Something else"],
  },
};
export const UI = {
  en: common.en,
  ar: {
    tagline: "طبيب أسنان لا تخشاه.",
    sub: "مَبسم عيادة صغيرة في جميرا: أربع غرف، وأشجار زيتون عند كل نافذة، والوقت الذي تحتاجه.",
    find: "اعرف ما تحتاجه",
    book: "احجز زيارة أولى",
    nav: { finder: "العلاجات", clinic: "العيادة", care: "الرعاية", breathe: "تنفّس", visit: "الزيارة", contact: "تواصل" },
    menu: "القائمة",
    close: "إغلاق",
    langName: "English",
    concept: "موقع تجريبي. مَبسم عيادة خيالية.",
    conceptShort: "عيادة خيالية",
    finderTitle: "ما الذي أتى بك؟",
    finderIntro: "اختر كل ما ينطبق. تعرض الأداة خيارات للنقاش مع طبيب الأسنان، وليست تشخيصاً.",
    q1: "ما الذي أتى بك",
    q2: "ما شعورك تجاه أطباء الأسنان",
    q3: "كم من الوقت لديك",
    options: "خيارات تسأل عنها",
    takesLonger: "هذه تستغرق وقتاً أطول مما ذكرت",
    nothing: "اختر سبباً واحداً على الأقل لترى الخيارات.",
    comfortTitle: "ما سنفعله من أجلك",
    priceNote: "نطاقات توضيحية لهذا التصور. لا تُؤكد الخطة والسعر إلا بعد الفحص.",
    bookThis: "احجز زيارة أولى بخصوص هذا",
    roomTitle: "الغرف",
    roomBody: "أربع غرف علاج، لكل منها نافذة على أشجار الزيتون. الكرسي يواجه الحديقة لا الأجهزة.",
    firstTitle: "زيارتك الأولى",
    firstSteps: ["خمس وأربعون دقيقة، أولها عشر دقائق للحديث فقط.", "صور ومسح ضوئي نعرضها عليك على الشاشة خطوة بخطوة.", "خطة مكتوبة بالخيارات والأسعار تأخذها معك.", "لا يحدث شيء في ذلك اليوم إلا إذا طلبته."],
    clinicTitle: "العيادة",
    detailsTitle: "أشياء صغيرة",
    careTitle: "كيف نعتني بك",
    breatheTitle: "تنفّس معها",
    breatheBody: "يفعل كثير من مرضانا هذا في غرفة الانتظار. شهيق لأربع، وزفير لست.",
    breatheStart: "ابدأ",
    breatheStop: "توقف",
    breathIn: "شهيق",
    breathOut: "زفير",
    visitTitle: "احجز زيارة أولى",
    visitIntro: "اختر يوماً ووقتاً. الزيارة الأولى 45 دقيقة.",
    reason: "السبب",
    reasonFree: "زيارة أولى فقط",
    day: "اليوم",
    time: "الوقت",
    taken: "محجوز",
    pickTime: "اختر وقتاً أولاً.",
    confirm: "اطلب هذه الزيارة",
    yourVisit: (when: string) => `${when}، 45 دقيقة`,
    where: "شارع جميرا بيتش، مقابل الحديقة. موقف عند الباب. من الأحد إلى الخميس 9:00 حتى 19:00، والسبت 10:00 حتى 16:00.",
    noticeTitle: "هنا كانت ستُطلب الزيارة",
    noticeBody: "مَبسم موقع تجريبي من زينيث دبي. العيادة من الخيال، لذلك لم يُحجز أي موعد ولم يُتواصل مع أحد.",
    noticeCta: "العودة إلى العيادة",
    noticeZenith: "تريد موقعاً كهذا؟",
    contactTitle: "اطرح سؤالاً",
    contactIntro: "مَبسم عيادة خيالية، لذلك تصل رسالتك هنا إلى زينيث دبي التي صمّمت هذا الموقع وبنته. يرجى عدم إرسال معلومات صحية.",
    faqTitle: "أسئلة",
    footer: "مَبسم عيادة خيالية. العلاجات والأسعار والصور توضيحية ومولّدة بالذكاء الاصطناعي لهذا التصور، ولا شيء هنا نصيحة طبية.",
    footerBy: "الفكرة والتصميم والتنفيذ: زينيث دبي",
    backToGallery: "كل المواقع التجريبية",
    skip: "انتقل إلى أداة العلاجات",
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
    interests: ["زيارة أولى", "علاج", "الأسعار", "شيء آخر"],
  } as typeof common.en,
};
export type UIStrings = typeof common.en;
