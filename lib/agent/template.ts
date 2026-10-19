// lib/agent/template.ts — a draft built without AI, in the browser: the CV lines that best match
// the listing, quoted as they are, and a cover-letter frame with gaps the candidate fills in.
// Nothing is written that the CV doesn't already say.

import { cvLines, extractSkills, mentions, norm, requiredLanguages, words } from "./text";
import type { Draft, Job, Profile } from "./types";

type L = "en" | "fr" | "ar";

const COPY: Record<L, {
  fit: (m: number, t: number) => string; fitNone: string; gapsLang: (l: string) => string;
  letter: (o: { title: string; company: string; name: string; contact: string; bullets: string }) => string;
}> = {
  en: {
    fit: (m, t) => `${m} of the ${t} skills this listing names appear in your CV. The highlights below are your own CV lines that match it best.`,
    fitNone: "The highlights below are the lines of your CV that share the most words with this listing.",
    gapsLang: l => `The listing asks for ${l}`,
    letter: o => `Dear [hiring manager's name],

I am applying for the ${o.title} position at ${o.company}. [One or two sentences on why this role and ${o.company} interest you.]

Some of what I bring:
${o.bullets}

[One or two sentences connecting these results to what ${o.company} is looking for, in your own words.]

I would welcome the opportunity to discuss how I can contribute. Thank you for your time and consideration.

Kind regards,
${o.name}${o.contact ? `\n${o.contact}` : ""}`,
  },
  fr: {
    fit: (m, t) => `${m} des ${t} compétences citées dans cette offre figurent dans votre CV. Les points forts ci-dessous sont les lignes de votre CV qui y répondent le mieux.`,
    fitNone: "Les points forts ci-dessous sont les lignes de votre CV qui partagent le plus de mots avec cette offre.",
    gapsLang: l => `L'offre demande : ${l}`,
    letter: o => `Madame, Monsieur [nom du recruteur],

Je vous adresse ma candidature pour le poste de ${o.title} chez ${o.company}. [Une ou deux phrases sur ce qui vous attire dans ce poste et chez ${o.company}.]

Ce que j'apporte, entre autres :
${o.bullets}

[Une ou deux phrases, avec vos mots, qui relient ces résultats aux attentes de ${o.company}.]

Je serais heureux·se d'échanger avec vous sur la manière dont je peux contribuer. Je vous remercie de votre attention.

Bien cordialement,
${o.name}${o.contact ? `\n${o.contact}` : ""}`,
  },
  ar: {
    fit: (m, t) => `تظهر في سيرتك الذاتية ${m} من أصل ${t} مهارات يذكرها هذا الإعلان. النقاط أدناه هي أسطر من سيرتك الذاتية كما كتبتها، وهي الأقرب إلى متطلباته.`,
    fitNone: "النقاط أدناه هي أسطر سيرتك الذاتية الأكثر اشتراكاً في الكلمات مع هذا الإعلان.",
    gapsLang: l => `يطلب الإعلان: ${l}`,
    letter: o => `السيد/السيدة [اسم مسؤول التوظيف] المحترم/ة،

أتقدم بطلبي لشغل وظيفة ${o.title} لدى ${o.company}. [جملة أو جملتان عن سبب اهتمامك بهذه الوظيفة وبـ ${o.company}.]

من أبرز ما أقدمه:
${o.bullets}

[جملة أو جملتان بكلماتك تربط هذه النتائج بما تبحث عنه ${o.company}.]

يسعدني أن أناقش معكم كيف يمكنني الإسهام. شكراً لوقتكم واهتمامكم.

مع خالص التحية،
${o.name}${o.contact ? `\n${o.contact}` : ""}`,
  },
};

const ACTION = /^(led|managed|built|prepared|implemented|introduced|delivered|reduced|increased|developed|launched|oversaw|created|negotiated|designed|improved|grew|drove|ran|coordinated|trained|supervised|achieved|established|streamlined|automated|dirigé|géré|piloté|mis en place|développé|créé|réduit|augmenté|lancé|أدرت|قدت|طورت|أنشأت|خفضت|زدت)(?![\p{L}])/iu;

/** CV lines ranked by how much they share with the listing. */
export function bestLines(cvText: string, job: Pick<Job, "title" | "description" | "tags">, n = 5): string[] {
  const listing = `${job.title}\n${job.tags.join(" ")}\n${job.description}`;
  const asked = extractSkills(listing);
  const listingWords = new Set(words(listing).filter(w => w.length >= 4));
  return cvLines(cvText)
    .map(line => {
      let s = asked.filter(sk => mentions(line, sk)).length * 3;
      for (const w of new Set(words(line))) if (w.length >= 4 && listingWords.has(w)) s += 1;
      if (/\d/.test(line)) s += 1; // results with figures read better
      if (ACTION.test(line)) s += 1; // achievements start with what the candidate did
      return { line, s };
    })
    .filter(x => x.s >= 2)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(x => x.line);
}

export function templateDraft(job: Job, p: Profile, lang: L): Draft {
  const c = COPY[lang];
  const listing = `${job.title}\n${job.tags.join(" ")}\n${job.description}`;
  const asked = extractSkills(listing);
  const own = `${p.cvText}\n${p.skills.join(", ")}`;
  const have = asked.filter(s => mentions(own, s));
  const lines = bestLines(p.cvText, job);
  const langs = requiredLanguages(listing).filter(l => !p.languages.some(x => norm(x) === norm(l)));

  const bullets = (lines.length ? lines.slice(0, 3) : ["[" + (lang === "fr" ? "un résultat de votre CV" : lang === "ar" ? "إنجاز من سيرتك الذاتية" : "a result from your CV") + "]"])
    .map(l => `• ${l}`).join("\n");
  const contact = [p.email, p.phone].filter(Boolean).join(" · ");

  return {
    kind: "template",
    lang,
    createdAt: new Date().toISOString(),
    fitSummary: asked.length ? c.fit(have.length, asked.length) : c.fitNone,
    tailoredSummary: p.headline || "",
    highlights: lines.map(l => ({ text: l, evidence: l })),
    coverLetter: c.letter({ title: job.title, company: job.company || "[company]", name: p.name || "[your name]", contact, bullets }),
    gaps: [...asked.filter(s => !have.includes(s)), ...langs.map(l => c.gapsLang(l))].slice(0, 10),
    keywords: have.slice(0, 20),
    warnings: [],
  };
}
