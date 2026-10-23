// lib/agent/interview/analyze.ts — reads one answer with fixed, explainable rules (no AI):
// the parts of a STAR answer, a specific example or general habits, figures tied to a result,
// "I" against "we", hedging and filler words, clichés, criticism of others, role vocabulary and
// whether the answer touches the question's key ideas. English, French and Arabic.
//
// Everything is matched on normalised text (lib/agent/text.ts norm: lower case, no accents,
// Arabic letter forms unified), so word lists are written naturally and normalised here.
// Arabic uses shorter word lists and allows the attached prefixes و ف ب ل ال, so its results
// are less precise; the report says so.

import { norm } from "../text";
import type { AnswerFacts, IvLang } from "./types";

// ── Lexicons ─────────────────────────────────────────────────────────────────
// "re:" items are regular-expression fragments (on normalised text) placed between word
// boundaries; "rx:" items are fragments with no boundaries added; "raw:" items are literal
// text matched without boundaries (symbols such as % and ?).

interface LexSource {
  i: string[]; we: string[]; s: string[]; t: string[]; a: string[]; r: string[];
  habit: string[]; hedge: string[]; filler: string[]; vague: string[]; negative: string[]; question: string[];
  numberWord: string[]; percent: string[]; currency: string[]; time: string[]; split: string[];
  /** Problem-solving language. */
  why: string[]; decision: string[]; diagnosis: string[]; steps: string[];
}

const EN: LexSource = {
  // Who did it: subject forms only ("our food cost" describes the situation, it doesn't share the credit).
  i: ["i", "i'm", "i've", "i'd", "i'll", "myself"],
  we: ["we", "we're", "we've", "we'd", "we'll", "ourselves"],
  s: ["when i was", "while i was", "when i worked", "at the time", "last year", "last month", "last week", "last summer", "last winter",
    "one day", "one evening", "one night", "one morning", "one weekend", "one time", "once", "re:in (?:19|20)\\d\\d", "there was", "there were",
    "we had a", "i had a", "a guest", "a customer", "a client", "a colleague", "a member of staff", "a patient", "during a", "during my", "during the",
    "the situation", "the problem was", "the challenge was", "the issue was", "i was working", "at my last", "in my last", "in my previous",
    "a few months ago", "a few years ago", "recently"],
  t: ["my role was", "my job was", "my task was", "my responsibility was", "my goal was", "my objective was", "my target was", "i was responsible",
    "i was asked", "i was in charge", "i was tasked", "i needed to", "i had to", "the goal was", "the target was", "the objective was", "the aim was",
    "i wanted to", "i was expected to"],
  a: ["re:i (?:then |also |personally |immediately |first |quickly |just |actually |finally |decided to |started to )?(?:\\p{L}+ed|made|took|spoke|led|built|ran|set|gave|wrote|met|found|put|brought|sent|began|chose|held|kept|told|taught|went|sold|won|got|did|cut|paid|drove|thought|caught|left|stood|saw|knew|rang|hired|fired|sat|split|read|sought|bought)"],
  r: ["as a result", "which meant", "which led", "which resulted", "which helped", "which allowed", "resulted in", "led to", "the result was",
    "the outcome was", "in the end", "by the end", "at the end", "finally", "increased", "increase", "reduced", "reduce", "improved", "improve",
    "saved", "grew", "raised", "achieved", "won", "exceeded", "hit the target", "hit our target", "hit my target", "went up", "went down",
    "dropped", "decreased", "lowered", "boosted", "doubled", "halved", "came back", "returned", "thanked", "promoted", "recognised", "recognized",
    "awarded", "positive feedback", "positive review", "five-star", "5-star", "five star", "5 star", "solved", "resolved", "fixed",
    "reached", "rose", "climbed", "jumped", "ranked", "went from", "record", "top ten",
    // "from 4.1 to 4.7", "from AED 210 to AED 245", "from 12 to 6 minutes" (not "from 9 to 5").
    "re:from \\d+[.,]\\d+ (?:to|up to) \\d",
    "re:from (?:(?:aed|dhs|usd|sar|qar) ?|[$€£])\\d[\\d.,]*\\s?(?:k|m)? (?:to|up to) (?:(?:aed|dhs|usd|sar|qar) ?|[$€£])?\\d",
    "re:from \\d[\\d.,]*\\s?(?:%|k|m|percent|per cent)? (?:to|up to) \\d[\\d.,]*\\s?(?:%|k|m|percent|per cent|minutes?|seconds?|hours?|days?|weeks?|months?|aed|dhs|dirhams?|stars?|points?|covers|guests|euros?|dollars?|riyals?)"],
  habit: ["usually", "always", "normally", "typically", "generally", "in general", "i would", "i'd", "i tend to", "i try to", "every time"],
  hedge: ["i think", "i guess", "maybe", "perhaps", "kind of", "sort of", "probably", "i'm not sure", "i am not sure", "i suppose", "more or less",
    "somewhat", "i don't know", "i dont know"],
  filler: ["um", "umm", "uh", "uhh", "erm", "er", "hmm", "you know"],
  vague: ["hard worker", "hard-working", "hardworking", "team player", "perfectionist", "passionate", "people person", "go-getter", "self-motivated",
    "detail-oriented", "detail oriented", "fast learner", "quick learner", "think outside the box", "natural leader", "very professional",
    "good communicator", "results-driven", "results driven", "i give 100%", "i give 110%"],
  negative: ["terrible", "useless", "hated", "stupid", "lazy", "incompetent", "toxic", "the worst", "idiot", "awful", "horrible", "clueless"],
  question: ["raw:?", "could you tell me", "can you tell me", "i'd like to know", "i would like to know", "i wanted to ask", "my question is",
    "what does", "what is the", "what are the", "how does", "how do you", "how would", "is there", "are there", "when do you", "when will",
    "who would", "what would", "what's the", "what kind of", "how soon", "how many", "how big"],
  numberWord: ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "fifteen", "twenty", "thirty", "forty",
    "fifty", "hundred", "thousand", "million", "double", "doubled", "half", "halved", "tripled", "dozen"],
  percent: ["raw:%", "percent", "per cent"],
  currency: ["aed", "dhs", "dh", "dirham", "dirhams", "usd", "eur", "euro", "euros", "dollar", "dollars", "raw:$", "raw:€", "raw:£", "sar", "qar",
    "riyal", "riyals", "mad", "k", "million", "bn"],
  time: ["year", "years", "month", "months", "week", "weeks", "day", "days", "hour", "hours", "minute", "minutes"],
  split: ["so", "then", "and then", "but", "because", "after that", "finally", "as a result", "which meant", "in the end"],
  why: ["because", "so that", "in order to", "the reason", "that's why", "which is why", "the point was"],
  decision: ["i decided", "i chose", "instead of", "rather than", "i considered", "i prioritised", "i prioritized", "my priority was", "i weighed",
    "the option", "the best option"],
  diagnosis: ["root cause", "i realised", "i realized", "i noticed", "i found that", "i found out", "i worked out", "i analysed", "i analyzed",
    "i looked at", "i checked", "the data showed", "the numbers showed", "i investigated", "i asked why"],
  steps: ["first", "firstly", "secondly", "then", "next", "after that", "finally", "step"],
};

const FR: LexSource = {
  i: ["je", "rx:(?<![\\p{L}\\p{N}])j'(?=\\p{L})", "moi"],
  we: ["nous", "on"],
  s: ["quand j'étais", "lorsque j'étais", "quand je travaillais", "lorsque je travaillais", "à l'époque", "l'année dernière", "l'an dernier",
    "le mois dernier", "la semaine dernière", "un jour", "un soir", "un matin", "une fois", "re:en (?:19|20)\\d\\d", "il y avait", "nous avions",
    "on avait", "un client", "une cliente", "un collègue", "une collègue", "un patient", "une patiente", "pendant un", "pendant une",
    "pendant mon", "pendant ma", "la situation", "le problème était", "le défi était", "je travaillais", "dans mon dernier", "dans mon précédent",
    "il y a quelques mois", "récemment"],
  t: ["mon rôle était", "mon rôle c'était", "mon objectif était", "mon travail était", "ma mission était", "ma responsabilité était",
    "ma tâche était", "j'étais responsable", "j'étais chargé", "j'étais chargée", "j'étais en charge", "je devais", "il fallait que je",
    "l'objectif était", "on m'a demandé", "je voulais", "mon but était"],
  a: ["re:j'ai (?:ensuite |alors |aussi |personnellement |tout de suite |d'abord |immediatement |donc |decide de |pu )?\\p{L}{3,}",
    "re:je suis (?:alle|allee|intervenu|intervenue|reste|restee|venu|venue|parti|partie|passe|passee|monte|montee)",
    "re:je me suis \\p{L}{3,}"],
  r: ["résultat", "par conséquent", "ce qui a permis", "ce qui a conduit", "ce qui a mené", "ce qui a abouti", "grâce à cela", "grâce à ça",
    "au final", "finalement", "à la fin", "en fin de compte", "augmenté", "augmentation", "réduit", "réduction", "amélioré", "amélioration",
    "économisé", "gagné", "obtenu", "atteint", "dépassé", "baissé", "diminué", "diminution", "hausse", "fidélisé", "remercié", "promu",
    "félicité", "avis positif", "cinq étoiles", "5 étoiles", "doublé", "résolu", "réglé", "passé de", "grimpé", "classé", "record",
    "re:de \\d+[.,]\\d+ a \\d",
    "re:de \\d[\\d.,]*\\s?(?:%|k|m|pour cent)? a \\d[\\d.,]*\\s?(?:%|k|m|pour cent|minutes?|secondes?|heures?|jours?|semaines?|mois|euros?|dirhams?|dh|mad|etoiles?|points?|couverts|clients)"],
  habit: ["d'habitude", "toujours", "normalement", "généralement", "en général", "je ferais", "j'essaie", "j'essaye", "en principe", "habituellement"],
  hedge: ["je pense", "je crois", "peut-être", "un peu", "genre", "plus ou moins", "je ne suis pas sûr", "je ne suis pas sûre", "je suis pas sûr",
    "probablement", "je suppose", "je sais pas", "je ne sais pas", "en quelque sorte"],
  filler: ["euh", "heu", "bah", "ben", "hum", "tu vois", "vous voyez", "du coup"],
  vague: ["travailleur", "travailleuse", "esprit d'équipe", "perfectionniste", "passionné", "passionnée", "dynamique", "motivé", "motivée",
    "rigoureux", "rigoureuse", "polyvalent", "polyvalente", "sens du relationnel", "je donne le maximum", "je donne tout"],
  negative: ["nul", "nulle", "incompétent", "incompétente", "horrible", "je détestais", "toxique", "le pire", "paresseux", "paresseuse",
    "catastrophique", "ingérable"],
  question: ["raw:?", "est-ce que", "qu'est-ce que", "quel est", "quelle est", "quels sont", "quelles sont", "comment", "quand", "combien",
    "pourriez-vous", "pouvez-vous", "j'aimerais savoir", "je voudrais savoir", "ma question"],
  numberWord: ["deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "quinze", "vingt", "trente", "quarante",
    "cinquante", "cent", "cents", "mille", "million", "millions", "double", "doublé", "moitié", "triple", "triplé"],
  percent: ["raw:%", "pour cent", "pourcent", "pourcents"],
  currency: ["dirham", "dirhams", "dh", "mad", "euro", "euros", "eur", "dollar", "dollars", "usd", "aed", "riyal", "riyals", "k", "raw:€", "raw:$"],
  time: ["an", "ans", "année", "années", "mois", "semaine", "semaines", "jour", "jours", "heure", "heures", "minute", "minutes"],
  split: ["alors", "ensuite", "puis", "mais", "parce que", "donc", "finalement", "du coup", "après ça", "au final"],
  why: ["parce que", "car", "afin de", "pour que", "la raison", "c'est pourquoi", "c'est pour ça"],
  decision: ["j'ai décidé", "j'ai choisi", "au lieu de", "plutôt que", "j'ai envisagé", "j'ai priorisé", "ma priorité", "la meilleure option"],
  diagnosis: ["la cause", "je me suis rendu compte", "j'ai remarqué", "j'ai constaté", "j'ai analysé", "j'ai vérifié", "j'ai regardé",
    "les chiffres montraient", "j'ai cherché à comprendre"],
  steps: ["d'abord", "premièrement", "deuxièmement", "ensuite", "puis", "enfin", "étape"],
};

const AR_I_VERBS = ["قمت", "عملت", "كنت", "أدرت", "طورت", "قدت", "نظمت", "حققت", "دربت", "ساعدت", "اقترحت", "قررت", "تعاملت", "تحدثت", "حللت",
  "وضعت", "أنشأت", "زدت", "خفضت", "بنيت", "أطلقت", "تعلمت", "شاركت", "تابعت", "أشرفت", "استطعت", "اعتذرت", "استمعت", "شرحت", "عرضت",
  "راجعت", "غيرت", "طلبت", "اتصلت", "ذهبت", "بدأت", "أنهيت", "حرصت", "عالجت", "أقنعت", "بعت", "تفاوضت", "أعددت", "جهزت", "خططت", "نفذت",
  "حسنت", "قللت", "رفعت", "اكتشفت", "لاحظت", "أخبرت", "قدمت", "ركزت", "أصلحت", "عينت", "وظفت", "تحققت", "فحصت", "استبدلت"];

const AR: LexSource = {
  i: ["أنا", "بنفسي", "نفسي", ...AR_I_VERBS],
  we: ["نحن", "قمنا", "عملنا", "كنا", "استطعنا", "حققنا", "زدنا", "خفضنا", "قررنا", "بدأنا", "ركزنا", "نجحنا", "اضطررنا", "إننا", "أننا"],
  s: ["عندما كنت", "حين كنت", "عندما عملت", "في العام الماضي", "العام الماضي", "السنة الماضية", "الشهر الماضي", "ذات يوم", "ذات مرة",
    "في أحد الأيام", "re:في (?:عام |سنه )?(?:19|20)\\d\\d", "خلال", "كان هناك", "كانت هناك", "واجهت", "واجهنا", "أحد الضيوف", "أحد العملاء",
    "أحد الزملاء", "أحد المرضى", "ضيف", "عميل", "الموقف", "المشكلة كانت", "كانت المشكلة", "كنت أعمل", "في وظيفتي السابقة", "في عملي السابق",
    "مؤخرا", "قبل بضعة أشهر"],
  t: ["دوري كان", "كان دوري", "مهمتي كانت", "كانت مهمتي", "هدفي كان", "كان هدفي", "الهدف كان", "كان الهدف", "كنت مسؤولا", "كنت مسؤول",
    "كنت مسؤولة", "طلب مني", "كان علي", "كان يجب علي", "أردت أن", "كان المطلوب"],
  a: AR_I_VERBS,
  r: ["النتيجة", "نتيجة لذلك", "مما أدى", "أدى إلى", "أدت إلى", "في النهاية", "أخيرا", "زيادة", "زادت", "زاد", "ارتفع", "ارتفعت", "انخفض",
    "انخفضت", "خفضنا", "خفضت", "تحسن", "تحسنت", "تحسين", "وفرنا", "وفرت", "توفير", "حققنا", "حققت", "تجاوزنا", "تجاوزت", "شكرني", "شكرنا",
    "ترقية", "تمت ترقيتي", "تقييم إيجابي", "خمس نجوم", "عاد الضيف", "عاد العميل", "حللنا", "حللت المشكلة", "تضاعف", "ضاعفنا",
    "وصلنا", "وصلت", "المركز الأول", "قياسي",
    "re:من \\d+[.,]\\d+ (?:الي|حتي) \\d",
    "re:من \\d[\\d.,]*\\s?%? (?:الي|حتي) \\d[\\d.,]*\\s?(?:%|٪|دقيقه|دقائق|ساعه|ساعات|يوم|ايام|اسبوع|اسابيع|شهر|اشهر|درهم|دولار|ريال|نجوم|نقاط|نقطه|ضيوف|بالمئه|بالمائه)"],
  habit: ["عادة", "دائما", "غالبا", "في العادة", "عموما", "بشكل عام", "أحاول"],
  hedge: ["ربما", "أعتقد", "أظن", "نوعا ما", "إلى حد ما", "لست متأكدا", "لست متأكدة", "تقريبا", "يمكن", "لا أعرف", "لا أدري"],
  filler: ["يعني", "امم", "اممم", "ااه", "إيه"],
  vague: ["مجتهد", "مجتهدة", "أعمل بجد", "روح الفريق", "شغوف", "شغوفة", "طموح", "طموحة", "منظم", "منظمة", "أحب العمل الجماعي", "متعاون",
    "متعاونة", "سريع التعلم", "سريعة التعلم", "مجتهدون", "مجتهدين", "طموحون", "منظمون"],
  negative: ["سيء", "سيئ", "سيئة", "فاشل", "فاشلة", "كسول", "كسولة", "أسوأ", "لا يطاق", "غبي", "غبية"],
  question: ["raw:?", "raw:؟", "هل", "ما هي", "ما هو", "ماذا", "كيف", "متى", "كم", "أود أن أعرف", "سؤالي", "أريد أن أسأل"],
  numberWord: ["اثنان", "اثنين", "ثلاث", "ثلاثة", "أربع", "أربعة", "خمس", "خمسة", "ستة", "سبع", "سبعة", "ثمانية", "تسع", "تسعة", "عشر", "عشرة",
    "عشرين", "عشرون", "ثلاثين", "أربعين", "خمسين", "مئة", "مائة", "ألف", "آلاف", "مليون", "ضعف", "نصف"],
  percent: ["raw:%", "raw:٪", "بالمئة", "بالمائة", "في المئة", "في المائة"],
  currency: ["درهم", "دراهم", "ريال", "دولار", "يورو"],
  time: ["سنة", "سنوات", "سنتين", "عام", "أعوام", "شهر", "أشهر", "شهرين", "أسبوع", "أسابيع", "يوم", "أيام", "ساعة", "ساعات", "دقيقة", "دقائق"],
  split: ["ثم", "لكن", "لذلك", "بعد ذلك", "وفي النهاية", "لأن"],
  why: ["لأن", "لكي", "من أجل", "السبب", "لذلك", "حتى أتمكن"],
  decision: ["قررت", "اخترت", "بدلا من", "فضلت", "أولويتي", "الخيار الأفضل"],
  diagnosis: ["السبب الجذري", "أدركت", "لاحظت", "وجدت أن", "حللت", "تحققت", "راجعت", "الأرقام أظهرت", "بحثت عن السبب"],
  steps: ["أولا", "ثانيا", "ثم", "بعد ذلك", "أخيرا", "خطوة"],
};

const SOURCES: Record<IvLang, LexSource> = { en: EN, fr: FR, ar: AR };

// ── Compiling ────────────────────────────────────────────────────────────────

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Arabic words often carry an attached "and", "so", "with", "for" or "the". */
const AR_PREFIX = "(?:وال|فال|بال|لل|ال|و|ف|ب|ل)?";
/** Around a short Arabic stem: those prefixes or a verb prefix before it, a common ending after it. */
const AR_SHORT_PRE = "(?:[وف]?(?:بال|كال|لل|ال|س?[اينت]|[بلك])?)";
const AR_SHORT_SUF = "(?:تما|تم|تن|ت|نا|وا|ون|ين|ان|ات|يه|ه|ها|هم|هن|هما|كم|ك|ني|ي|ا)?";

/** One global regex for a word list: boundaries on both sides, phrases with flexible spaces. */
export function compileList(items: string[], lang: IvLang): RegExp {
  const bounded: string[] = [];
  const raw: string[] = [];
  for (const item of items) {
    if (item.startsWith("raw:")) raw.push(esc(item.slice(4)));
    else if (item.startsWith("rx:")) raw.push(item.slice(3));
    else if (item.startsWith("re:")) bounded.push(item.slice(3));
    else bounded.push(esc(norm(item)).replace(/ /g, "\\s+"));
  }
  bounded.sort((a, b) => b.length - a.length); // longest first, so "i'm" wins over "i"
  const parts: string[] = [];
  if (bounded.length) parts.push(`(?<![\\p{L}\\p{N}])${lang === "ar" ? AR_PREFIX : ""}(?:${bounded.join("|")})(?![\\p{L}\\p{N}])`);
  if (raw.length) parts.push(`(?:${raw.join("|")})`);
  return new RegExp(parts.join("|") || "(?!)", "gu");
}

type Lex = { [K in keyof LexSource]: RegExp };
const compiled = new Map<IvLang, Lex>();

export function lexicon(lang: IvLang): Lex {
  let lex = compiled.get(lang);
  if (!lex) {
    const src = SOURCES[lang];
    lex = Object.fromEntries(Object.entries(src).map(([k, v]) => [k, compileList(v as string[], lang)])) as Lex;
    compiled.set(lang, lex);
  }
  return lex;
}

const count = (re: RegExp, s: string) => { re.lastIndex = 0; return [...s.matchAll(re)].length; };

// ── Normalised text with a map back to the original ──────────────────────────

/** norm() character by character, remembering where each normalised character came from. */
export function normMap(original: string): { text: string; map: number[] } {
  let text = "";
  const map: number[] = [];
  let space = true; // collapse leading and repeated whitespace
  for (let i = 0; i < original.length;) {
    const cp = original.codePointAt(i)!;
    const ch = String.fromCodePoint(cp);
    const n = /\s/.test(ch) ? " " : norm(ch) || "";
    if (n === " " || (n === "" && /\s/.test(ch))) {
      if (!space) { text += " "; map.push(i); space = true; }
    } else if (n) {
      for (const c of n) { text += c; map.push(i); }
      space = false;
    }
    i += ch.length;
  }
  if (text.endsWith(" ")) { text = text.slice(0, -1); map.pop(); }
  return { text, map };
}

/** The original wording of a match in normalised text. */
function originalOf(original: string, map: number[], start: number, end: number): string {
  if (start >= map.length) return "";
  const from = map[start];
  const lastIdx = map[Math.min(end, map.length) - 1];
  const cp = original.codePointAt(lastIdx) ?? 0;
  return original.slice(from, lastIdx + (cp > 0xffff ? 2 : 1)).trim();
}

function phrases(re: RegExp, n: { text: string; map: number[] }, original: string, max = 6): string[] {
  re.lastIndex = 0;
  const out = new Map<string, string>();
  for (const m of n.text.matchAll(re)) {
    const key = m[0].trim();
    if (!key || out.has(key)) continue;
    out.set(key, originalOf(original, n.map, m.index!, m.index! + m[0].length));
    if (out.size >= max) break;
  }
  return [...out.values()];
}

// ── Figures ──────────────────────────────────────────────────────────────────

function near(text: string, at: number, re: RegExp, span: number): boolean {
  const window = text.slice(Math.max(0, at - span), at + span);
  re.lastIndex = 0;
  return re.test(window);
}

/** Words that follow a number without being its unit ("210 to 245"), so they stay out of the figure's label. */
const NOT_UNIT: Record<IvLang, Set<string>> = {
  en: new Set("to and or in on at of for from with by the a an than then so but which that when after before over under up down into this my our we i it".split(" ")),
  fr: new Set("a et ou en de du des le la les un une pour par avec sur dans que qui puis mais apres avant chez au aux".split(" ")),
  ar: new Set("الي في من علي عن مع ثم و او خلال بعد قبل حتي".split(" ")),
};

/** Figures tied to a result ("12%", "AED 40,000", "cut waste by half"), and how many specific numbers and dates there are. */
export function figuresOf(n: { text: string; map: number[] }, original: string, lang: IvLang): { result: string[]; numbers: number; dates: number } {
  const lex = lexicon(lang);
  const text = n.text;
  const result: string[] = [];
  let numbers = 0;
  let dates = 0;
  for (const m of text.matchAll(/(?<![\p{L}\d])\d+(?:[.,]\d+)*(?:\s?%)?/gu)) {
    const start = m.index!;
    const end = start + m[0].length;
    const digits = m[0].replace(/\s?%$/, "");
    if (/^(19|20)\d\d$/.test(digits) && !m[0].includes("%")) { dates++; continue; }
    numbers++;
    const after = text.slice(end, end + 18);
    const before = text.slice(Math.max(0, start - 12), start);
    lex.percent.lastIndex = 0; lex.currency.lastIndex = 0;
    const pct = m[0].includes("%") || new RegExp(`^\\s*(?:${lex.percent.source})`, "u").test(after);
    const cur = new RegExp(`(?:${lex.currency.source})\\s*$`, "u").test(before) || new RegExp(`^\\s*(?:${lex.currency.source})`, "u").test(after);
    if (pct || cur || near(text, start, lex.r, 70)) {
      let unit = m[0].includes("%") ? undefined : after.match(/^\s*([\p{L}%$€£٪]+)/u)?.[1];
      if (unit && NOT_UNIT[lang].has(unit)) unit = undefined;
      let endAt = end;
      if (unit && unit.length <= 12) endAt = end + after.indexOf(unit) + unit.length;
      let startAt = start;
      const curBefore = before.match(/([\p{L}$€£]+)\s*$/u)?.[1];
      if (cur && curBefore && new RegExp(`^(?:${lex.currency.source})$`, "u").test(curBefore)) startAt = start - (before.length - before.lastIndexOf(curBefore));
      result.push(originalOf(original, n.map, startAt, endAt));
    }
  }
  lex.numberWord.lastIndex = 0;
  for (const m of text.matchAll(lex.numberWord)) {
    if (text[m.index! + m[0].length] === "-") continue; // "five-star"
    numbers++;
    if (near(text, m.index!, lex.r, 50)) result.push(originalOf(original, n.map, m.index!, m.index! + m[0].length));
  }
  return { result: [...new Set(result.filter(Boolean))].slice(0, 6), numbers, dates };
}

// ── Key ideas and role vocabulary ────────────────────────────────────────────

/**
 * One concept group "a|b|c": English and French match word starts ("upsell" finds "upselling"), "x$" a whole word.
 * Arabic stems of four letters or more match inside words (attached prefixes and endings); shorter stems match
 * as their own word with an attached prefix or ending ("حقق" finds "حققت" and "يحقق", not "تحقيق").
 */
export function groupRe(group: string, lang: IvLang): RegExp {
  const alts = group.split("|").map(a => a.trim()).filter(Boolean).map(a => {
    const whole = a.endsWith("$");
    const word = norm(whole ? a.slice(0, -1) : a);
    const body = esc(word).replace(/ /g, "\\s+");
    if (!/[\p{L}\p{N}]/u.test(word)) return body; // a symbol such as %
    if (lang === "ar") {
      if (whole) return `(?<![\\p{L}\\p{N}])${AR_PREFIX}${body}(?![\\p{L}\\p{N}])`;
      // Four letters and more match inside words; shorter stems need their own word ("عام" is not in "طعام").
      if (word.replace(/\s/g, "").length >= 4) return body;
      // A three-letter stem also finds its common plurals: سعر → اسعار, ضيف → ضيوف.
      const [c1, c2, c3] = [...word];
      const forms = word.length === 3 && !word.includes(" ") ? [body, esc(`ا${c1}${c2}ا${c3}`), esc(`${c1}${c2}و${c3}`)] : [body];
      return `(?<![\\p{L}\\p{N}])${AR_SHORT_PRE}(?:${forms.join("|")})${AR_SHORT_SUF}(?![\\p{L}\\p{N}])`;
    }
    // Short words match whole ("pos" is not "position"), with common endings ("ask" finds "asked").
    if (whole || word.length <= 3) return `(?<![\\p{L}\\p{N}])${body}${whole ? "" : "(?:s|es|ed|ing)?"}(?![\\p{L}\\p{N}])`;
    return `(?<![\\p{L}\\p{N}])${body}`;
  });
  return new RegExp(alts.join("|") || "(?!)", "u");
}

const groupCache = new Map<string, RegExp>();
export function hasGroup(normText: string, group: string, lang: IvLang): boolean {
  const k = `${lang}\u0000${group}`;
  let re = groupCache.get(k);
  if (!re) { re = groupRe(group, lang); groupCache.set(k, re); }
  return re.test(normText);
}

export interface TermDef {
  id: string;
  label: Record<IvLang, string>;
  /** Concept group per language, "a|b|c". */
  re: Record<IvLang, string>;
  probe?: Record<IvLang, string>;
  /** A topic every candidate for this kind of role should be ready to talk about. */
  core?: boolean;
}

// ── One answer ───────────────────────────────────────────────────────────────

export interface Analysis extends AnswerFacts {
  /** Specific numbers (not dates) and dates, for the example check. */
  numbers: number;
  anchors: number;
  actions: number;
}

export function analyse(text: string, lang: IvLang, opts: { keys?: string[]; terms?: TermDef[]; speechSec?: number } = {}): Analysis {
  const lex = lexicon(lang);
  const n = normMap(text);
  const t = n.text;
  const words = t ? t.split(" ").filter(w => /[\p{L}\p{N}]/u.test(w)).length : 0;
  const has = (re: RegExp) => { re.lastIndex = 0; return re.test(t); };

  const anchors = count(lex.s, t);
  const actions = count(lex.a, t);
  const fig = figuresOf(n, text, lang);
  const resultStated = has(lex.r);
  const star: AnswerFacts["star"] = [];
  if (anchors > 0) star.push("S");
  if (has(lex.t)) star.push("T");
  if (actions > 0) star.push("A");
  if (resultStated || fig.result.length > 0) star.push("R");
  const habitual = count(lex.habit, t);
  const example = anchors > 0 && (actions > 0 || fig.numbers > 0) || actions >= 2 && (fig.numbers > 0 || fig.dates > 0);

  const keys = opts.keys ?? [];
  const keysHit = keys.filter(g => hasGroup(t, g, lang)).length;
  const terms = (opts.terms ?? []).filter(d => d.re[lang] && hasGroup(t, d.re[lang], lang)).map(d => d.id);
  const wpm = opts.speechSec && opts.speechSec >= 5 && words >= 10 ? Math.round(words / (opts.speechSec / 60)) : null;

  return {
    words,
    star,
    example,
    habit: habitual > 0 && !example,
    figures: fig.result,
    result: resultStated || fig.result.length > 0,
    keysHit,
    keysAll: keys.length,
    i: count(lex.i, t),
    we: count(lex.we, t),
    hedges: phrases(lex.hedge, n, text),
    fillers: count(lex.filler, t),
    vague: phrases(lex.vague, n, text, 3),
    negative: phrases(lex.negative, n, text, 3),
    terms,
    // Steps count only as a sequence ("first … then …"): one "then" is just narration.
    reasoning: (["why", "decision", "diagnosis", "steps"] as const).filter(k => (k === "steps" ? count(lex.steps, t) >= 2 : has(lex[k]))),
    asked: has(lex.question),
    wpm,
    numbers: fig.numbers,
    anchors,
    actions,
  };
}

// ── Outline of a stronger answer, from the candidate's own sentences ─────────

/** Sentences, or for unpunctuated speech, clauses split at "so", "then", "but"… */
export function clauses(text: string, lang: IvLang): string[] {
  const lex = lexicon(lang);
  const out: string[] = [];
  const sentences = text.split(/(?<=[.!?؟])\s+|\n+/)
    // Long sentences also break at commas: "A guest complained, so I apologised, then …".
    .flatMap(s => (s.trim().split(/\s+/).length > 14 ? s.split(/(?<=[,;،؛])\s+/) : [s]));
  for (const sentence of sentences) {
    const s = sentence.trim();
    if (!s) continue;
    if (s.split(/\s+/).length <= 20) { out.push(s); continue; }
    // Long run-on speech: split before connecting words, keeping them with the clause they start.
    const n = normMap(s);
    lex.split.lastIndex = 0;
    let last = 0;
    for (const m of n.text.matchAll(lex.split)) {
      const at = n.map[m.index!];
      if (at - last < 30) continue;
      out.push(s.slice(last, at).trim());
      last = at;
    }
    out.push(s.slice(last).trim());
  }
  // Short pieces ("I apologised,", "Au final,") belong with the clause that follows.
  const merged: string[] = [];
  let carry = "";
  for (const c of out) {
    const piece = carry ? `${carry} ${c}` : c;
    if (piece.split(/\s+/).length < 4) {
      // A short piece that ends a sentence ("then I followed up.") closes the clause before it.
      if (/[.!?؟]$/.test(piece) && merged.length) { merged[merged.length - 1] += ` ${piece}`; carry = ""; }
      else carry = piece;
      continue;
    }
    merged.push(piece);
    carry = "";
  }
  if (carry) {
    if (merged.length) merged[merged.length - 1] += ` ${carry}`;
    else merged.push(carry);
  }
  return merged;
}

const clip = (s: string, max = 32) => {
  const w = s.split(/\s+/);
  return w.length > max ? `${w.slice(0, max).join(" ")} …` : s;
};

/** Situation, task, action and result from the candidate's own words; null where a part is missing. */
export function outlineOf(text: string, lang: IvLang): { part: "S" | "T" | "A" | "R"; text: string | null }[] {
  const lex = lexicon(lang);
  const found: Record<"S" | "T" | "A" | "R", string[]> = { S: [], T: [], A: [], R: [] };
  const list = clauses(text, lang);
  const test = (re: RegExp, s: string) => { re.lastIndex = 0; return re.test(normMap(s).text); };
  list.forEach((c, i) => {
    const n = normMap(c);
    const fig = figuresOf(n, c, lang);
    if (test(lex.r, c) || fig.result.length) { found.R.push(c); return; }
    if (test(lex.t, c)) { found.T.push(c); return; }
    // The scene is usually set in the first sentences, even when they mention what was done.
    if (test(lex.s, c) && !found.S.length && i <= 1) { found.S.push(c); return; }
    if (test(lex.a, c)) { found.A.push(c); return; }
    if (test(lex.s, c)) found.S.push(c);
  });
  return (["S", "T", "A", "R"] as const).map(part => ({
    part,
    text: found[part].length ? found[part].slice(0, part === "A" ? 2 : 1).map(c => clip(c)).join(" ") : null,
  }));
}
