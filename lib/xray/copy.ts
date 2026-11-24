// lib/xray/copy.ts — the CV X-Ray's words in English, French and Arabic: interface text and what each
// finding says. Findings state facts about the file and what to do; they never give a score or
// promise an outcome.

import type { Lang } from "@/lib/site";
import type { AreaId, Check, CheckId, Data } from "./analyze";
import type { ReadFailure } from "./read";

export interface Said { title: string; body: string; fix?: string }

const num = (d: Data, k: string): number => Number(d[k] ?? 0);
const raw = (d: Data, k: string): string[] => (Array.isArray(d[k]) ? (d[k] as string[]) : []);
const arr = (d: Data, k: string): string[] => raw(d, k).map(v => `\u2068${v}\u2069`);
/** Text from the CV or typed by the visitor, isolated so a Latin line inside Arabic (or the reverse) keeps its own direction. */
const iso = (v: string): string => `\u2068${v}\u2069`;
const str = (d: Data, k: string): string => iso(String(d[k] ?? ""));

const SECTION: Record<Lang, Record<string, string>> = {
  en: { experience: "Experience", education: "Education", skills: "Skills" },
  fr: { experience: "Expérience", education: "Formation", skills: "Compétences" },
  ar: { experience: "الخبرة", education: "التعليم", skills: "المهارات" },
};
const LEVEL: Record<Lang, Record<string, string>> = {
  en: { entry: "entry level", mid: "mid level", senior: "senior", manager: "manager", executive: "executive" },
  fr: { entry: "débutant", mid: "intermédiaire", senior: "confirmé", manager: "manager", executive: "direction" },
  ar: { entry: "مبتدئ", mid: "متوسط", senior: "أول", manager: "مدير", executive: "إدارة عليا" },
};
const STYLE: Record<string, string> = { "month-name": "Jan 2021", numeric: "01/2021", "year-only": "2019 – 2021" };
const SEP: Record<Lang, string> = { en: ", ", fr: ", ", ar: "، " };

type Say = (c: Check) => Said;

// ── English ──────────────────────────────────────────────────────────────────

const EN: Record<CheckId, Say> = {
  text: c => ({ title: "Your text can be read", body: `We read ${num(c.data, "words")} words. A screening system can extract the text of this file.` }),
  columns: c => c.status === "pass"
    ? { title: "One reading order", body: "Your text runs in a single column, so a parser meets it in the right order." }
    : { title: "Text set side by side", body: "Part of your CV sits beside the main text (a sidebar or two columns). Many ATS read straight across the page and mix the two.", fix: "For online applications, send a one-column version. Keep the designed version for email and interviews." },
  tables: c => c.status === "pass"
    ? { title: "No layout tables", body: "Nothing is placed in Word tables, which some parsers flatten or skip." }
    : { title: `Content inside tables (${num(c.data, "n")})`, body: "Part of your CV is laid out in Word tables. Several ATS flatten tables cell by cell, or skip them.", fix: "Move the content out of the tables into normal paragraphs and bullet points." },
  textboxes: c => ({ title: `Text inside text boxes (${num(c.data, "n")})`, body: "Screening systems often ignore text boxes completely, so what is inside them may never be read.", fix: "Take the text out of every text box and put it in the body of the document." }),
  "header-contact": () => ({ title: "Contact details only in the header", body: "Your email or phone number appears only in the Word header or footer, which some ATS don't read.", fix: "Repeat your email and phone number at the top of the page itself." }),
  glyphs: c => ({ title: `Symbols that don't read as text (${num(c.data, "n")})`, body: "Icons, or a font without text mapping, produce characters a parser can't read. Where they stand for words (phone, email, skills), those words are lost.", fix: "Write labels as words rather than icons, and export the file with standard fonts." }),
  headings: c => c.status === "pass"
    ? { title: "Standard section headings", body: "We found Experience, Education and Skills: the sections a parser looks for." }
    : { title: `No ${raw(c.data, "missing").map(s => SECTION.en[s]).join(" or ")} heading`, body: "Parsers file your CV by its headings. Content under a creative title, or no title, can end up unfiled.", fix: `Use plain headings: ${raw(c.data, "missing").map(s => SECTION.en[s]).join(", ")}.` },
  length: c => {
    const pages = num(c.data, "pages"), words = num(c.data, "words");
    if (num(c.data, "thin")) return { title: "A very short CV", body: `At ${words} words there is little for a keyword search, or a recruiter, to find.`, fix: "For each recent role, add the scope you handled and the results you delivered." };
    if (c.status === "warn") return { title: pages ? `A long CV (${pages} pages)` : `A long CV (${words} words)`, body: "Recruiters skim. After two pages, your strongest points get lost.", fix: "Keep the last 10 to 15 years in detail and sum up earlier roles in one line each." };
    if (c.status === "info") return { title: "Three pages", body: "Acceptable with 15 years or more of experience, as long as page one carries your strongest results." };
    return { title: "A sensible length", body: pages ? `${pages} ${pages === 1 ? "page" : "pages"}, ${words} words.` : `${words} words.` };
  },
  contact: c => {
    if (c.status === "pass") return { title: "Email and phone found", body: "A recruiter, and the system, can reach you." };
    const lack = [num(c.data, "email") ? "" : "email", num(c.data, "phone") ? "" : "phone number"].filter(Boolean).join(" and ");
    return { title: `No ${lack} found`, body: "If the system can't find your contact details, your application can't be followed up.", fix: "Put your email and phone number at the top of the page, as plain text." };
  },
  linkedin: c => c.status === "pass"
    ? { title: "LinkedIn link included", body: "Recruiters can check your profile in one click." }
    : { title: "No LinkedIn link", body: "Recruiters in the Gulf check LinkedIn. A link saves them the search." },
  order: c => c.status === "pass"
    ? { title: "Most recent role first", body: "Your experience runs from newest to oldest, as recruiters expect." }
    : { title: "Oldest role first", body: "Your experience seems to run from oldest to newest. Recruiters and parsers expect your latest role at the top.", fix: "Reverse the order: your current or latest role first." },
  "ad-skills": c => {
    const have = arr(c.data, "have"), lack = arr(c.data, "lack"), asked = num(c.data, "asked");
    if (c.status === "info") return { title: "No skills we recognise in the ad", body: "Compare the ad's requirements with your CV by hand, word for word." };
    if (c.status === "pass") return { title: "Every skill in the ad is in your CV", body: `All ${asked} skills we recognised: ${have.join(", ")}.` };
    return { title: `${lack.length} of ${asked} skills from the ad are missing`, body: `Missing: ${lack.join(", ")}.${have.length ? ` Found: ${have.join(", ")}.` : ""}`, fix: "Where it's true, use the ad's own words for these skills, in your summary and your experience." };
  },
  "no-ad": () => ({ title: "Add a job ad for a keyword check", body: "Paste a job ad above and run the X-Ray again to see which of its skills your CV is missing." }),
  "cv-skills": c => c.status === "pass"
    ? { title: `${num(c.data, "n")} skills a search can find`, body: `${arr(c.data, "skills").join(", ")}.` }
    : { title: `Few skills a search can find (${num(c.data, "n")})`, body: arr(c.data, "skills").length ? `We found: ${arr(c.data, "skills").join(", ")}.` : "We found no skills that a keyword search would match.", fix: "Name your tools, systems and specialisms in plain words, in a Skills section and inside your experience." },
  summary: c => c.status === "pass"
    ? { title: "Profile summary found", body: "The top of your CV says who you are before the details." }
    : { title: "No profile summary", body: "Without a short profile at the top, the recruiter has to work out what you do and what you want.", fix: "Add three or four lines at the top: your role, your years, your strongest result, the role you want next." },
  headline: c => c.status === "pass"
    ? { title: "Headline under your name", body: `“${str(c.data, "headline")}”` }
    : { title: "No clear headline", body: "The line under your name is the first thing a recruiter reads. Yours is missing or unclear.", fix: "Put your target title under your name, for example “Restaurant Manager · Fine Dining · UAE”." },
  "headline-target": c => c.status === "pass"
    ? { title: "Headline matches your target role", body: `“${str(c.data, "headline")}” fits “${str(c.data, "role")}”.` }
    : c.status === "info"
      ? { title: "Headline close to your target role", body: `Your headline says “${str(c.data, "headline")}”. For “${str(c.data, "role")}”, make the link explicit.` }
      : { title: "Headline points to another job", body: `Your headline says “${str(c.data, "headline")}”, but you are aiming for “${str(c.data, "role")}”. Recruiters screen on the headline first.`, fix: "Rewrite the headline in the words of the role you want." },
  "date-styles": c => c.status === "pass"
    ? { title: "Dates written one way", body: "One date style throughout: easy for a parser to add up your experience." }
    : { title: "Dates written in several styles", body: `Your dates mix ${raw(c.data, "styles").map(s => STYLE[s]).join(" and ")}. Parsers work out your experience from them; one style is safer.`, fix: "Use one style for every date, for example “Jan 2021 – Mar 2024”." },
  undated: c => c.status === "pass"
    ? { title: "Every role has dates", body: "Each job can be placed on a timeline." }
    : { title: `${num(c.data, "n")} ${num(c.data, "n") === 1 ? "role" : "roles"} without dates`, body: "A parser can't place a role without dates, and recruiters read missing dates as a gap.", fix: "Give every role a start and an end: month and year." },
  dense: c => c.status === "pass"
    ? { title: "Lines a recruiter can skim", body: "No long blocks of text in your experience." }
    : { title: `Long blocks of text (${num(c.data, "n")})`, body: "Some lines run past 260 characters. A system reads them; a recruiter skims past them.", fix: "Break long paragraphs into bullets of one or two lines, one result each." },
  images: c => ({ title: `${num(c.data, "n")} ${num(c.data, "n") === 1 ? "image" : "images"} in the file`, body: "A photo is usual in the UAE, but screening systems ignore images. Check that no text sits inside a picture." }),
  metrics: c => {
    const n = num(c.data, "n"), ex = arr(c.data, "examples")[0];
    if (c.status === "pass") return { title: `${n} results with figures`, body: ex ? `For example: “${ex}”` : "Your experience shows measurable results." };
    if (c.status === "warn") return { title: `Only ${n} ${n === 1 ? "result" : "results"} with figures`, body: "Most of your experience is not measured: no percentages, amounts, team sizes or volumes.", fix: "Give your best results a number: revenue, savings, ratings, team size, covers, targets met." };
    return { title: "No results with figures", body: "Nothing in your experience is measured: no percentages, amounts, team sizes or volumes.", fix: "Give your best results a number: revenue, savings, ratings, team size, covers, targets met." };
  },
  duties: c => ({ title: `${num(c.data, "n")} duty ${num(c.data, "n") === 1 ? "statement" : "statements"}`, body: `Lines like “${arr(c.data, "examples")[0] ?? ""}” describe the job, not what you achieved in it.`, fix: "Rewrite duties as results: what you did, at what scale, and what changed because of it." }),
  leadership: c => c.status === "pass"
    ? { title: "Leadership scope stated", body: "Your CV says who or what you managed." }
    : { title: "No leadership scope", body: "If you have led people, projects or budgets, say how many and how much." },
  "no-role": () => ({ title: "Add your target role", body: "Type the role you are applying for, then run the X-Ray again to check how your CV lines up with it." }),
  "title-fit": c => {
    const titles = arr(c.data, "titles").join(", "), role = str(c.data, "role");
    if (c.status === "pass") return { title: `Your recent titles match “${role}”`, body: `${titles}.` };
    if (c.status === "info") return { title: `Your recent titles are close to “${role}”`, body: `Your last titles (${titles}) are neighbouring jobs. Spell out the overlap in your summary.` };
    return { title: "Your recent titles point elsewhere", body: `Your last titles (${titles}) are a different job from “${role}”. The recruiter needs to see why you fit.`, fix: `Lead with the experience that matches “${role}” and name your transferable skills.` };
  },
  level: c => {
    if (c.status === "pass") return { title: "Target level matches your experience", body: `Your latest title is at ${LEVEL.en[String(c.data.have)]} level, like the role you want.` };
    if (c.status === "info") return { title: "A step up", body: `The role you want is one level above your latest title (${LEVEL.en[String(c.data.have)]}). Show the leadership you already take on.` };
    return { title: "A big step up", body: `The role you want is at ${LEVEL.en[String(c.data.want)]} level, ${num(c.data, "step")} levels above your latest title. Evidence of scope and leadership is essential.`, fix: "Show the people, budgets and results you already handle at the higher level." };
  },
  languages: c => c.status === "pass"
    ? { title: "Languages in the ad: covered", body: `${arr(c.data, "asked").join(", ")}.` }
    : { title: `Language in the ad: ${arr(c.data, "gaps").join(", ")}`, body: `The ad mentions ${arr(c.data, "asked").join(", ")}. We didn't find ${arr(c.data, "gaps").join(", ")} in your CV: if it is required and you speak it, list it with your level.`, fix: "If you speak it, list it with your level, for example “Arabic: professional”." },
};

// ── French ───────────────────────────────────────────────────────────────────

const FR: Record<CheckId, Say> = {
  text: c => ({ title: "Votre texte est lisible", body: `Nous avons lu ${num(c.data, "words")} mots. Un logiciel de tri peut extraire le texte de ce fichier.` }),
  columns: c => c.status === "pass"
    ? { title: "Un seul sens de lecture", body: "Votre texte tient sur une colonne : un logiciel le lit dans le bon ordre." }
    : { title: "Texte disposé côte à côte", body: "Une partie du CV est placée à côté du texte principal (colonne latérale ou deux colonnes). Beaucoup d'ATS lisent la page en ligne droite et mélangent les deux.", fix: "Pour les candidatures en ligne, envoyez une version sur une colonne. Gardez la version design pour l'e-mail et l'entretien." },
  tables: c => c.status === "pass"
    ? { title: "Pas de tableaux de mise en page", body: "Rien n'est placé dans des tableaux Word, que certains logiciels aplatissent ou ignorent." }
    : { title: `Contenu dans des tableaux (${num(c.data, "n")})`, body: "Une partie du CV est mise en page dans des tableaux Word. Plusieurs ATS les lisent cellule par cellule, ou les ignorent.", fix: "Sortez le contenu des tableaux et mettez-le en paragraphes et en puces." },
  textboxes: c => ({ title: `Texte dans des zones de texte (${num(c.data, "n")})`, body: "Les logiciels de tri ignorent souvent les zones de texte : leur contenu peut ne jamais être lu.", fix: "Sortez le texte de chaque zone de texte et placez-le dans le corps du document." }),
  "header-contact": () => ({ title: "Coordonnées seulement dans l'en-tête", body: "Votre e-mail ou votre téléphone n'apparaît que dans l'en-tête ou le pied de page Word, que certains ATS ne lisent pas.", fix: "Répétez votre e-mail et votre téléphone en haut de la page elle-même." }),
  glyphs: c => ({ title: `Symboles illisibles comme texte (${num(c.data, "n")})`, body: "Des icônes, ou une police sans correspondance texte, produisent des caractères qu'un logiciel ne sait pas lire. S'ils remplacent des mots (téléphone, e-mail, compétences), ces mots sont perdus.", fix: "Écrivez les intitulés en mots plutôt qu'en icônes et exportez avec des polices standard." }),
  headings: c => c.status === "pass"
    ? { title: "Titres de sections standard", body: "Nous avons trouvé Expérience, Formation et Compétences : les sections qu'un logiciel cherche." }
    : { title: `Pas de titre ${raw(c.data, "missing").map(s => SECTION.fr[s]).join(" ni ")}`, body: "Les logiciels classent votre CV d'après ses titres. Un contenu sous un titre original, ou sans titre, peut rester non classé.", fix: `Utilisez des titres simples : ${raw(c.data, "missing").map(s => SECTION.fr[s]).join(", ")}.` },
  length: c => {
    const pages = num(c.data, "pages"), words = num(c.data, "words");
    if (num(c.data, "thin")) return { title: "Un CV très court", body: `Avec ${words} mots, une recherche par mots-clés, ou un recruteur, trouve peu de choses.`, fix: "Pour chaque poste récent, ajoutez l'envergure de votre rôle et vos résultats." };
    if (c.status === "warn") return { title: pages ? `Un CV long (${pages} pages)` : `Un CV long (${words} mots)`, body: "Les recruteurs survolent. Au-delà de deux pages, vos meilleurs atouts se perdent.", fix: "Détaillez les 10 à 15 dernières années et résumez les postes plus anciens en une ligne chacun." };
    if (c.status === "info") return { title: "Trois pages", body: "Acceptable avec 15 ans d'expérience ou plus, si la première page porte vos meilleurs résultats." };
    return { title: "Une longueur raisonnable", body: pages ? `${pages} page${pages > 1 ? "s" : ""}, ${words} mots.` : `${words} mots.` };
  },
  contact: c => {
    if (c.status === "pass") return { title: "E-mail et téléphone trouvés", body: "Un recruteur, et le logiciel, peuvent vous joindre." };
    const lack = [num(c.data, "email") ? "" : "d'e-mail", num(c.data, "phone") ? "" : "de téléphone"].filter(Boolean).join(" ni ");
    return { title: `Pas ${lack} trouvé`, body: "Si le logiciel ne trouve pas vos coordonnées, votre candidature ne peut pas être suivie.", fix: "Placez votre e-mail et votre téléphone en haut de la page, en texte simple." };
  },
  linkedin: c => c.status === "pass"
    ? { title: "Lien LinkedIn présent", body: "Les recruteurs consultent votre profil en un clic." }
    : { title: "Pas de lien LinkedIn", body: "Les recruteurs du Golfe consultent LinkedIn. Un lien leur évite la recherche." },
  order: c => c.status === "pass"
    ? { title: "Le poste le plus récent en premier", body: "Votre expérience va du plus récent au plus ancien, comme les recruteurs l'attendent." }
    : { title: "Le poste le plus ancien en premier", body: "Votre expérience semble aller du plus ancien au plus récent. Recruteurs et logiciels attendent le dernier poste en haut.", fix: "Inversez l'ordre : votre poste actuel ou le plus récent d'abord." },
  "ad-skills": c => {
    const have = arr(c.data, "have"), lack = arr(c.data, "lack"), asked = num(c.data, "asked");
    if (c.status === "info") return { title: "Aucune compétence reconnue dans l'annonce", body: "Comparez les exigences de l'annonce avec votre CV, mot pour mot." };
    if (c.status === "pass") return { title: "Toutes les compétences de l'annonce sont dans votre CV", body: `Les ${asked} compétences reconnues : ${have.join(", ")}.` };
    return { title: `${lack.length} compétence${lack.length > 1 ? "s" : ""} de l'annonce sur ${asked} manque${lack.length > 1 ? "nt" : ""}`, body: `Manquent : ${lack.join(", ")}.${have.length ? ` Présentes : ${have.join(", ")}.` : ""}`, fix: "Quand c'est exact, reprenez les mots de l'annonce pour ces compétences, dans votre profil et votre expérience." };
  },
  "no-ad": () => ({ title: "Ajoutez une annonce pour vérifier les mots-clés", body: "Collez une offre d'emploi ci-dessus et relancez la radiographie pour voir les compétences qui manquent à votre CV." }),
  "cv-skills": c => c.status === "pass"
    ? { title: `${num(c.data, "n")} compétences repérables`, body: `${arr(c.data, "skills").join(", ")}.` }
    : { title: `Peu de compétences repérables (${num(c.data, "n")})`, body: arr(c.data, "skills").length ? `Nous avons trouvé : ${arr(c.data, "skills").join(", ")}.` : "Nous n'avons trouvé aucune compétence qu'une recherche par mots-clés retrouverait.", fix: "Nommez vos outils, logiciels et spécialités en toutes lettres, dans une section Compétences et dans votre expérience." },
  summary: c => c.status === "pass"
    ? { title: "Profil trouvé", body: "Le haut du CV dit qui vous êtes avant les détails." }
    : { title: "Pas de profil en tête", body: "Sans un court profil en haut, le recruteur doit deviner ce que vous faites et ce que vous cherchez.", fix: "Ajoutez trois ou quatre lignes en haut : votre métier, vos années, votre meilleur résultat, le poste visé." },
  headline: c => c.status === "pass"
    ? { title: "Titre sous votre nom", body: `« ${str(c.data, "headline")} »` }
    : { title: "Pas de titre clair", body: "La ligne sous votre nom est la première chose que lit un recruteur. La vôtre manque ou n'est pas claire.", fix: "Placez le poste visé sous votre nom, par exemple « Directeur de restaurant · Gastronomie · Émirats »." },
  "headline-target": c => c.status === "pass"
    ? { title: "Le titre correspond au poste visé", body: `« ${str(c.data, "headline")} » correspond à « ${str(c.data, "role")} ».` }
    : c.status === "info"
      ? { title: "Titre proche du poste visé", body: `Votre titre dit « ${str(c.data, "headline")} ». Pour « ${str(c.data, "role")} », rendez le lien explicite.` }
      : { title: "Le titre annonce un autre métier", body: `Votre titre dit « ${str(c.data, "headline")} », mais vous visez « ${str(c.data, "role")} ». Les recruteurs trient d'abord sur ce titre.`, fix: "Réécrivez le titre avec les mots du poste que vous voulez." },
  "date-styles": c => c.status === "pass"
    ? { title: "Dates écrites d'une seule façon", body: "Un seul format de date : facile pour un logiciel de calculer votre expérience." }
    : { title: "Dates écrites de plusieurs façons", body: `Vos dates mélangent ${raw(c.data, "styles").map(s => STYLE[s]).join(" et ")}. Les logiciels calculent votre expérience à partir d'elles : un seul format est plus sûr.`, fix: "Utilisez un seul format, par exemple « janv. 2021 – mars 2024 »." },
  undated: c => c.status === "pass"
    ? { title: "Chaque poste est daté", body: "Chaque emploi peut être placé sur une ligne du temps." }
    : { title: `${num(c.data, "n")} poste${num(c.data, "n") > 1 ? "s" : ""} sans dates`, body: "Un logiciel ne peut pas situer un poste sans dates, et les recruteurs y voient un trou.", fix: "Donnez à chaque poste un début et une fin : mois et année." },
  dense: c => c.status === "pass"
    ? { title: "Des lignes faciles à survoler", body: "Pas de longs blocs de texte dans votre expérience." }
    : { title: `Longs blocs de texte (${num(c.data, "n")})`, body: "Certaines lignes dépassent 260 caractères. Le logiciel les lit ; le recruteur les saute.", fix: "Découpez les longs paragraphes en puces d'une ou deux lignes, un résultat chacune." },
  images: c => ({ title: `${num(c.data, "n")} image${num(c.data, "n") > 1 ? "s" : ""} dans le fichier`, body: "Une photo est courante aux Émirats, mais les logiciels de tri ignorent les images. Vérifiez qu'aucun texte n'est dans une image." }),
  metrics: c => {
    const n = num(c.data, "n"), ex = arr(c.data, "examples")[0];
    const fix = "Chiffrez vos meilleurs résultats : chiffre d'affaires, économies, notes clients, taille d'équipe, couverts, objectifs atteints.";
    if (c.status === "pass") return { title: `${n} résultats chiffrés`, body: ex ? `Par exemple : « ${ex} »` : "Votre expérience montre des résultats mesurables." };
    if (c.status === "warn") return { title: `Seulement ${n} résultat${n > 1 ? "s" : ""} chiffré${n > 1 ? "s" : ""}`, body: "L'essentiel de votre expérience n'est pas mesuré : ni pourcentages, ni montants, ni taille d'équipe, ni volumes.", fix };
    return { title: "Aucun résultat chiffré", body: "Rien dans votre expérience n'est mesuré : ni pourcentages, ni montants, ni taille d'équipe, ni volumes.", fix };
  },
  duties: c => ({ title: `${num(c.data, "n")} description${num(c.data, "n") > 1 ? "s" : ""} de tâches`, body: `Des lignes comme « ${arr(c.data, "examples")[0] ?? ""} » décrivent le poste, pas ce que vous y avez accompli.`, fix: "Réécrivez les tâches en résultats : ce que vous avez fait, à quelle échelle, et ce qui a changé." }),
  leadership: c => c.status === "pass"
    ? { title: "Périmètre de management indiqué", body: "Votre CV dit qui ou quoi vous avez dirigé." }
    : { title: "Pas de périmètre de management", body: "Si vous avez dirigé des personnes, des projets ou des budgets, dites combien." },
  "no-role": () => ({ title: "Ajoutez le poste visé", body: "Indiquez le poste auquel vous postulez, puis relancez la radiographie pour vérifier l'adéquation de votre CV." }),
  "title-fit": c => {
    const titles = arr(c.data, "titles").join(", "), role = str(c.data, "role");
    if (c.status === "pass") return { title: `Vos derniers postes correspondent à « ${role} »`, body: `${titles}.` };
    if (c.status === "info") return { title: `Vos derniers postes sont proches de « ${role} »`, body: `Vos derniers intitulés (${titles}) sont des métiers voisins. Montrez les points communs dans votre profil.` };
    return { title: "Vos derniers postes mènent ailleurs", body: `Vos derniers intitulés (${titles}) relèvent d'un autre métier que « ${role} ». Le recruteur doit voir pourquoi vous convenez.`, fix: `Commencez par l'expérience qui correspond à « ${role} » et nommez vos compétences transférables.` };
  },
  level: c => {
    if (c.status === "pass") return { title: "Le niveau visé correspond à votre expérience", body: `Votre dernier poste est de niveau ${LEVEL.fr[String(c.data.have)]}, comme le poste visé.` };
    if (c.status === "info") return { title: "Une marche au-dessus", body: `Le poste visé est un niveau au-dessus de votre dernier intitulé (${LEVEL.fr[String(c.data.have)]}). Montrez les responsabilités que vous assumez déjà.` };
    return { title: "Un grand saut", body: `Le poste visé est de niveau ${LEVEL.fr[String(c.data.want)]}, ${num(c.data, "step")} niveaux au-dessus de votre dernier intitulé. Les preuves de périmètre et de leadership sont indispensables.`, fix: "Montrez les équipes, budgets et résultats que vous gérez déjà au niveau supérieur." };
  },
  languages: c => c.status === "pass"
    ? { title: "Langues demandées : couvertes", body: `${arr(c.data, "asked").join(", ")}.` }
    : { title: `Langue citée dans l'annonce : ${arr(c.data, "gaps").join(", ")}`, body: `L'annonce mentionne ${arr(c.data, "asked").join(", ")}. Nous n'avons pas trouvé ${arr(c.data, "gaps").join(", ")} dans votre CV : si elle est exigée et que vous la parlez, indiquez-la avec votre niveau.`, fix: "Si vous la parlez, indiquez-la avec votre niveau, par exemple « Arabe : professionnel »." },
};

// ── Arabic ───────────────────────────────────────────────────────────────────

const AR: Record<CheckId, Say> = {
  text: c => ({ title: "نص سيرتك قابل للقراءة", body: `قرأنا النص كاملاً (عدد الكلمات: ${num(c.data, "words")}). يستطيع نظام الفرز استخراج نص هذا الملف.` }),
  columns: c => c.status === "pass"
    ? { title: "ترتيب قراءة واحد", body: "نصك في عمود واحد، فيقرؤه النظام بالترتيب الصحيح." }
    : { title: "نص موزّع جنباً إلى جنب", body: "جزء من سيرتك موضوع بجانب النص الرئيسي (عمود جانبي أو عمودان). كثير من أنظمة الفرز تقرأ الصفحة أفقياً فتخلط بينهما.", fix: "أرسل نسخة بعمود واحد في التقديم الإلكتروني، واحتفظ بالنسخة المصمّمة للبريد والمقابلات." },
  tables: c => c.status === "pass"
    ? { title: "لا جداول للتنسيق", body: "لا شيء موضوع داخل جداول Word، التي تسطّحها بعض الأنظمة أو تتجاهلها." }
    : { title: `محتوى داخل جداول (${num(c.data, "n")})`, body: "جزء من سيرتك منسّق داخل جداول Word. أنظمة كثيرة تقرأ الجداول خلية خلية أو تتجاهلها.", fix: "انقل المحتوى من الجداول إلى فقرات ونقاط عادية." },
  textboxes: c => ({ title: `نص داخل مربعات نص (${num(c.data, "n")})`, body: "كثيراً ما تتجاهل أنظمة الفرز مربعات النص تماماً، فقد لا يُقرأ ما بداخلها أبداً.", fix: "أخرج النص من كل مربع نص وضعه في متن المستند." }),
  "header-contact": () => ({ title: "بيانات التواصل في الترويسة فقط", body: "بريدك أو هاتفك موجود فقط في ترويسة Word أو تذييله، وبعض الأنظمة لا تقرؤهما.", fix: "كرّر بريدك ورقم هاتفك في أعلى الصفحة نفسها." }),
  glyphs: c => ({ title: `رموز لا تُقرأ كنص (${num(c.data, "n")})`, body: "الأيقونات، أو خط بلا ربط نصي، تُنتج رموزاً لا يقرؤها النظام. إذا حلّت محل كلمات (الهاتف، البريد، المهارات) ضاعت تلك الكلمات.", fix: "اكتب العناوين كلمات لا أيقونات، وصدّر الملف بخطوط قياسية." }),
  headings: c => c.status === "pass"
    ? { title: "عناوين أقسام قياسية", body: "وجدنا الخبرة والتعليم والمهارات: الأقسام التي يبحث عنها النظام." }
    : { title: `لا يوجد عنوان «${raw(c.data, "missing").map(s => SECTION.ar[s]).join("» أو «")}»`, body: "يصنّف النظام سيرتك حسب عناوينها. المحتوى تحت عنوان مبتكر، أو بلا عنوان، قد يبقى بلا تصنيف.", fix: `استخدم عناوين واضحة: ${raw(c.data, "missing").map(s => SECTION.ar[s]).join("، ")}.` },
  length: c => {
    const pages = num(c.data, "pages"), words = num(c.data, "words");
    if (num(c.data, "thin")) return { title: "سيرة قصيرة جداً", body: `بعدد كلمات لا يتجاوز ${words}، لا يجد البحث بالكلمات المفتاحية ولا المسؤول عن التوظيف الكثير.`, fix: "أضف لكل وظيفة حديثة حجم مسؤوليتك والنتائج التي حققتها." };
    if (c.status === "warn") return { title: pages ? `سيرة طويلة (عدد الصفحات: ${pages})` : `سيرة طويلة (عدد الكلمات: ${words})`, body: "المسؤولون عن التوظيف يتصفّحون بسرعة، وبعد صفحتين تضيع أقوى نقاطك.", fix: "فصّل آخر 10 إلى 15 سنة، ولخّص الوظائف الأقدم في سطر واحد لكل منها." };
    if (c.status === "info") return { title: "ثلاث صفحات", body: "مقبول مع خبرة 15 سنة أو أكثر، بشرط أن تحمل الصفحة الأولى أقوى نتائجك." };
    return { title: "طول مناسب", body: pages ? `عدد الصفحات: ${pages}، عدد الكلمات: ${words}.` : `عدد الكلمات: ${words}.` };
  },
  contact: c => {
    if (c.status === "pass") return { title: "البريد والهاتف موجودان", body: "يستطيع المسؤول عن التوظيف، والنظام، التواصل معك." };
    const lack = [num(c.data, "email") ? "" : "البريد الإلكتروني", num(c.data, "phone") ? "" : "رقم الهاتف"].filter(Boolean).join(" ولا ");
    return { title: `لم نجد ${lack}`, body: "إذا لم يجد النظام بيانات تواصلك، لا يمكن متابعة طلبك.", fix: "ضع بريدك ورقم هاتفك في أعلى الصفحة كنص عادي." };
  },
  linkedin: c => c.status === "pass"
    ? { title: "رابط لينكدإن موجود", body: "يمكن للمسؤولين عن التوظيف فتح ملفك بنقرة واحدة." }
    : { title: "لا يوجد رابط لينكدإن", body: "المسؤولون عن التوظيف في الخليج يراجعون لينكدإن، والرابط يوفّر عليهم البحث." },
  order: c => c.status === "pass"
    ? { title: "الوظيفة الأحدث أولاً", body: "خبرتك مرتّبة من الأحدث إلى الأقدم، كما يتوقع المسؤولون عن التوظيف." }
    : { title: "الوظيفة الأقدم أولاً", body: "يبدو أن خبرتك مرتّبة من الأقدم إلى الأحدث، بينما يتوقع المسؤولون والأنظمة أحدث وظيفة في الأعلى.", fix: "اعكس الترتيب: وظيفتك الحالية أو الأحدث أولاً." },
  "ad-skills": c => {
    const have = arr(c.data, "have"), lack = arr(c.data, "lack"), asked = num(c.data, "asked");
    if (c.status === "info") return { title: "لم نتعرّف على مهارات في الإعلان", body: "قارن متطلبات الإعلان بسيرتك يدوياً، كلمة بكلمة." };
    if (c.status === "pass") return { title: "كل مهارات الإعلان موجودة في سيرتك", body: `المهارات التي تعرّفنا عليها (${asked}): ${have.join("، ")}.` };
    return { title: `مهارات من الإعلان غير موجودة: ${lack.length} من ${asked}`, body: `غير موجودة: ${lack.join("، ")}.${have.length ? ` موجودة: ${have.join("، ")}.` : ""}`, fix: "حيث يكون ذلك صحيحاً، استخدم كلمات الإعلان نفسها لهذه المهارات في ملخصك وخبرتك." };
  },
  "no-ad": () => ({ title: "أضف إعلان وظيفة لفحص الكلمات المفتاحية", body: "الصق إعلان وظيفة في الأعلى وأعد الفحص لترى المهارات التي تنقص سيرتك." }),
  "cv-skills": c => c.status === "pass"
    ? { title: `مهارات يمكن للبحث إيجادها (${num(c.data, "n")})`, body: `${arr(c.data, "skills").join("، ")}.` }
    : { title: `مهارات قليلة يمكن إيجادها (${num(c.data, "n")})`, body: arr(c.data, "skills").length ? `وجدنا: ${arr(c.data, "skills").join("، ")}.` : "لم نجد مهارات يطابقها بحث بالكلمات المفتاحية.", fix: "اذكر أدواتك وأنظمتك وتخصصاتك بكلمات واضحة، في قسم المهارات وداخل خبرتك." },
  summary: c => c.status === "pass"
    ? { title: "يوجد ملخص مهني", body: "أعلى سيرتك يقول من أنت قبل التفاصيل." }
    : { title: "لا يوجد ملخص مهني", body: "بدون ملخص قصير في الأعلى، على المسؤول عن التوظيف أن يستنتج ما تعمله وما تريده.", fix: "أضف ثلاثة أو أربعة أسطر في الأعلى: مهنتك، سنوات خبرتك، أقوى نتيجة لك، والوظيفة التي تستهدفها." },
  headline: c => c.status === "pass"
    ? { title: "عنوان مهني تحت اسمك", body: `«${str(c.data, "headline")}»` }
    : { title: "لا يوجد عنوان مهني واضح", body: "السطر تحت اسمك أول ما يقرؤه المسؤول عن التوظيف، وهو مفقود أو غير واضح في سيرتك.", fix: "ضع الوظيفة المستهدفة تحت اسمك، مثل «مدير مطعم · مطاعم راقية · الإمارات»." },
  "headline-target": c => c.status === "pass"
    ? { title: "العنوان يطابق الوظيفة المستهدفة", body: `«${str(c.data, "headline")}» يناسب «${str(c.data, "role")}».` }
    : c.status === "info"
      ? { title: "العنوان قريب من الوظيفة المستهدفة", body: `عنوانك يقول «${str(c.data, "headline")}». لوظيفة «${str(c.data, "role")}» اجعل الصلة صريحة.` }
      : { title: "العنوان يشير إلى وظيفة أخرى", body: `عنوانك يقول «${str(c.data, "headline")}» بينما تستهدف «${str(c.data, "role")}». الفرز يبدأ من العنوان.`, fix: "أعد كتابة العنوان بمفردات الوظيفة التي تريدها." },
  "date-styles": c => c.status === "pass"
    ? { title: "التواريخ بصيغة واحدة", body: "صيغة تاريخ واحدة: يسهل على النظام حساب خبرتك." }
    : { title: "التواريخ بصيغ متعددة", body: `تواريخك تخلط بين ${raw(c.data, "styles").map(s => STYLE[s]).join(" و")}. الأنظمة تحسب خبرتك منها، والصيغة الواحدة أكثر أماناً.`, fix: "استخدم صيغة واحدة لكل التواريخ، مثل «Jan 2021 – Mar 2024»." },
  undated: c => c.status === "pass"
    ? { title: "كل وظيفة مؤرّخة", body: "يمكن وضع كل وظيفة على خط زمني." }
    : { title: `وظائف بلا تواريخ (${num(c.data, "n")})`, body: "لا يستطيع النظام تحديد موقع وظيفة بلا تواريخ، ويقرأ المسؤولون غيابها كفجوة.", fix: "اكتب لكل وظيفة بداية ونهاية: الشهر والسنة." },
  dense: c => c.status === "pass"
    ? { title: "أسطر سهلة التصفح", body: "لا كتل نصية طويلة في خبرتك." }
    : { title: `كتل نصية طويلة (${num(c.data, "n")})`, body: "بعض الأسطر تتجاوز 260 حرفاً. يقرؤها النظام، لكن المسؤول عن التوظيف يتخطاها.", fix: "قسّم الفقرات الطويلة إلى نقاط من سطر أو سطرين، لكل منها نتيجة واحدة." },
  images: c => ({ title: `صور في الملف (${num(c.data, "n")})`, body: "الصورة الشخصية معتادة في الإمارات، لكن أنظمة الفرز تتجاهل الصور. تأكد أن لا نص داخل صورة." }),
  metrics: c => {
    const n = num(c.data, "n"), ex = arr(c.data, "examples")[0];
    const fix = "أعطِ أفضل نتائجك رقماً: الإيرادات، التوفير، التقييمات، حجم الفريق، عدد الضيوف، الأهداف المحققة.";
    if (c.status === "pass") return { title: `نتائج بالأرقام (${n})`, body: ex ? `مثلاً: «${ex}»` : "خبرتك تُظهر نتائج قابلة للقياس." };
    if (c.status === "warn") return { title: `نتائج قليلة بالأرقام (${n})`, body: "معظم خبرتك غير مقيسة: لا نسب ولا مبالغ ولا أحجام فرق ولا كميات.", fix };
    return { title: "لا نتائج بالأرقام", body: "لا شيء في خبرتك مقيس: لا نسب ولا مبالغ ولا أحجام فرق ولا كميات.", fix };
  },
  duties: c => ({ title: `عبارات تصف مهاماً (${num(c.data, "n")})`, body: `أسطر مثل «${arr(c.data, "examples")[0] ?? ""}» تصف الوظيفة، لا ما حققته فيها.`, fix: "أعد كتابة المهام كنتائج: ماذا فعلت، وبأي حجم، وما الذي تغيّر بفضلك." }),
  leadership: c => c.status === "pass"
    ? { title: "نطاق القيادة واضح", body: "سيرتك تذكر من أو ما الذي أدرته." }
    : { title: "لا يظهر نطاق القيادة", body: "إذا قدت أشخاصاً أو مشاريع أو ميزانيات، فاذكر العدد والحجم." },
  "no-role": () => ({ title: "أضف الوظيفة المستهدفة", body: "اكتب الوظيفة التي تتقدم لها، ثم أعد الفحص لترى مدى توافق سيرتك معها." }),
  "title-fit": c => {
    const titles = arr(c.data, "titles").join("، "), role = str(c.data, "role");
    if (c.status === "pass") return { title: `مسمياتك الأخيرة تطابق «${role}»`, body: `${titles}.` };
    if (c.status === "info") return { title: `مسمياتك الأخيرة قريبة من «${role}»`, body: `مسمياتك الأخيرة (${titles}) وظائف مجاورة. وضّح نقاط التقاطع في ملخصك.` };
    return { title: "مسمياتك الأخيرة تشير إلى مجال آخر", body: `مسمياتك الأخيرة (${titles}) وظيفة مختلفة عن «${role}». على المسؤول عن التوظيف أن يرى لماذا تناسبها.`, fix: `ابدأ بالخبرة التي تطابق «${role}» واذكر مهاراتك القابلة للنقل.` };
  },
  level: c => {
    if (c.status === "pass") return { title: "المستوى المستهدف يناسب خبرتك", body: `مسمّاك الأخير بمستوى «${LEVEL.ar[String(c.data.have)]}»، مثل الوظيفة المستهدفة.` };
    if (c.status === "info") return { title: "خطوة إلى الأعلى", body: `الوظيفة المستهدفة أعلى بمستوى واحد من مسمّاك الأخير (${LEVEL.ar[String(c.data.have)]}). أظهر القيادة التي تمارسها فعلاً.` };
    return { title: "قفزة كبيرة", body: `الوظيفة المستهدفة بمستوى «${LEVEL.ar[String(c.data.want)]}»، أعلى من مسمّاك الأخير بعدة مستويات (${num(c.data, "step")}). أدلة النطاق والقيادة ضرورية.`, fix: "أظهر الفرق والميزانيات والنتائج التي تديرها فعلاً بالمستوى الأعلى." };
  },
  languages: c => c.status === "pass"
    ? { title: "لغات الإعلان: متوفرة", body: `${arr(c.data, "asked").join("، ")}.` }
    : { title: `لغة مذكورة في الإعلان: ${arr(c.data, "gaps").join("، ")}`, body: `يذكر الإعلان ${arr(c.data, "asked").join("، ")}، ولم نجد ${arr(c.data, "gaps").join("، ")} في سيرتك: إذا كانت مطلوبة وتتحدثها فاذكرها مع مستواك.`, fix: "إذا كنت تتحدثها، فاذكرها مع مستواك، مثل «العربية: مهنية»." },
};

const SAY: Record<Lang, Record<CheckId, Say>> = { en: EN, fr: FR, ar: AR };
export const say = (c: Check, lang: Lang): Said => SAY[lang][c.id](c);

// ── Interface ────────────────────────────────────────────────────────────────

export interface Ui {
  back: string; eyebrow: string; h1: string; lede: string;
  promise: [string, string, string];
  drop: string; dropOr: string; dropHint: string; change: string; remove: string;
  role: string; rolePh: string; adToggle: string; ad: string; adPh: string;
  run: string; running: string; steps: [string, string, string, string];
  results: string; again: string; print: string;
  facts: { pdf: string; docx: string; txt: string; pages: (n: number) => string; words: (n: number) => string; years: (n: number) => string };
  counts: { pass: (n: number) => string; warn: (n: number) => string; fail: (n: number) => string };
  status: { pass: string; warn: string; fail: string; info: string };
  areas: Record<AreaId, string>;
  film: string; filmNote: string; legend: { heading: string; metric: string; duty: string; contact: string }; filmMore: string; filmLess: string;
  fixes: string; fixesNone: string;
  fitTitle: string; reasons: Record<"senior" | "positioning" | "rebuild" | "polish", string>; included: string; from: string;
  wa: string; waNote: string; waMessage: (role: string, ref: string) => string;
  disclaimer: string; privacy: string; terms: string;
  errors: Record<Exclude<ReadFailure, "scanned">, string>;
  scanned: { title: string; body: string; fix: string };
  theme: [string, string]; skip: string; language: string; live: { reading: string; done: string };
}

export const UI: Record<Lang, Ui> = {
  en: {
    back: "Back to Zenith", eyebrow: "ATS CV X-Ray",
    h1: "See your CV the way screening software reads it.",
    lede: "Drop in your CV. In seconds you'll see what an applicant tracking system can read, what it can't, and what to fix first.",
    promise: ["Runs in your browser: your CV is never uploaded or stored", "PDF or Word (.docx), up to 5 MB", "Free, no sign-up"],
    drop: "Drop your CV here", dropOr: "or choose a file", dropHint: "PDF or .docx, up to 5 MB", change: "Choose another file", remove: "Remove file",
    role: "Target role (optional)", rolePh: "e.g. Restaurant Manager", adToggle: "Add a job ad for a keyword check (optional)", ad: "The job ad", adPh: "Paste the full job ad here",
    run: "Run the X-Ray", running: "Reading your CV…",
    steps: ["Reading the file", "Finding the sections", "Checking the layout", "Testing keywords and results"],
    results: "Your X-Ray", again: "Check another CV", print: "Save as PDF",
    facts: { pdf: "PDF", docx: "Word", txt: "Text", pages: n => `${n} ${n === 1 ? "page" : "pages"}`, words: n => `${n} words`, years: n => `about ${n} ${n === 1 ? "year" : "years"} of experience` },
    counts: { pass: n => `${n} clear`, warn: n => `${n} to improve`, fail: n => `${n} ${n === 1 ? "problem" : "problems"}` },
    status: { pass: "Clear", warn: "Improve", fail: "Problem", info: "Note" },
    areas: { readability: "ATS readability", structure: "Document structure", keywords: "Keyword relevance", positioning: "Professional positioning", formatting: "Formatting", achievements: "Achievement statements", alignment: "Role alignment" },
    film: "What the system reads", filmNote: "Your CV as plain text, in the order a parser meets it.",
    legend: { heading: "Section it recognised", metric: "Result with a figure", duty: "Duty, no result", contact: "Contact details" },
    filmMore: "Show all lines", filmLess: "Show fewer lines",
    fixes: "Fix these first", fixesNone: "Nothing urgent. The notes below can still sharpen your CV.",
    fitTitle: "Where Zenith fits",
    reasons: {
      senior: "Your CV reads at executive level. The Executive Career Suite gives you a dedicated consultant for the narrative, the CV and LinkedIn of a senior search.",
      positioning: "The gaps are in positioning: how your headline, summary and keywords present you for the role you want. Career Advantage works on your CV, in two formats, and your full LinkedIn profile, around that role.",
      rebuild: "The main problems are in how the file is built. CV Essentials rewrites your CV for your target role, in an ATS-friendly structure.",
      polish: "Your file reads well. What's left is wording and results, and CV Essentials is the simplest way to have a specialist rewrite them.",
    },
    included: "See what's included", from: "One payment of",
    wa: "Get a free human review on WhatsApp", waNote: "A Zenith specialist reads your CV and tells you which changes matter most. Send your CV in the chat.",
    waMessage: (role, ref) => `Hi Zenith, I ran the CV X-Ray on your website and would like a free human review of my CV.${role ? ` Target role: ${role}.` : ""} Ref: XRAY${ref ? `-${ref}` : ""}`,
    disclaimer: "The X-Ray is an automated check for common reading problems. It is not an official ATS score: every employer sets up its system differently, and no CV can guarantee an interview.",
    privacy: "Privacy policy", terms: "Terms",
    errors: {
      "too-big": "That file is larger than 5 MB. Save a smaller copy (images compressed) and try again.",
      "old-doc": "Old Word files (.doc) can't be read here. Save it as .docx or PDF and try again.",
      "not-cv": "This file isn't what its name says. Try the original PDF or .docx.",
      unreadable: "We couldn't read this file. Try a PDF or .docx export of your CV.",
    },
    scanned: {
      title: "Your CV has no readable text",
      body: "This PDF is an image: a scan, or a design exported as a picture. Most screening systems see an empty document, so none of your experience reaches a keyword search.",
      fix: "Export it again from Word, Google Docs or Canva as a text PDF, or let us rebuild it.",
    },
    theme: ["Switch to light theme", "Switch to dark theme"], skip: "Skip to content", language: "Language",
    live: { reading: "Reading your CV", done: "X-Ray ready" },
  },
  fr: {
    back: "Retour à Zenith", eyebrow: "Radiographie ATS du CV",
    h1: "Voyez votre CV comme le lit un logiciel de tri.",
    lede: "Déposez votre CV. En quelques secondes, vous voyez ce qu'un logiciel de recrutement (ATS) peut lire, ce qu'il ne peut pas lire, et quoi corriger en premier.",
    promise: ["Tout se passe dans votre navigateur : votre CV n'est jamais envoyé ni conservé", "PDF ou Word (.docx), 5 Mo maximum", "Gratuit, sans inscription"],
    drop: "Déposez votre CV ici", dropOr: "ou choisissez un fichier", dropHint: "PDF ou .docx, 5 Mo maximum", change: "Choisir un autre fichier", remove: "Retirer le fichier",
    role: "Poste visé (facultatif)", rolePh: "ex. Directeur de restaurant", adToggle: "Ajouter une offre d'emploi pour vérifier les mots-clés (facultatif)", ad: "L'offre d'emploi", adPh: "Collez ici l'offre complète",
    run: "Lancer la radiographie", running: "Lecture de votre CV…",
    steps: ["Lecture du fichier", "Repérage des sections", "Vérification de la mise en page", "Mots-clés et résultats"],
    results: "Votre radiographie", again: "Vérifier un autre CV", print: "Enregistrer en PDF",
    facts: { pdf: "PDF", docx: "Word", txt: "Texte", pages: n => `${n} page${n > 1 ? "s" : ""}`, words: n => `${n} mots`, years: n => `environ ${n} an${n > 1 ? "s" : ""} d'expérience` },
    counts: { pass: n => `${n} conforme${n > 1 ? "s" : ""}`, warn: n => `${n} à améliorer`, fail: n => `${n} problème${n > 1 ? "s" : ""}` },
    status: { pass: "Conforme", warn: "À améliorer", fail: "Problème", info: "Note" },
    areas: { readability: "Lisibilité ATS", structure: "Structure du document", keywords: "Mots-clés", positioning: "Positionnement professionnel", formatting: "Mise en forme", achievements: "Réalisations", alignment: "Adéquation au poste" },
    film: "Ce que lit le logiciel", filmNote: "Votre CV en texte brut, dans l'ordre où un logiciel le découvre.",
    legend: { heading: "Section reconnue", metric: "Résultat chiffré", duty: "Tâche sans résultat", contact: "Coordonnées" },
    filmMore: "Afficher toutes les lignes", filmLess: "Afficher moins de lignes",
    fixes: "À corriger en premier", fixesNone: "Rien d'urgent. Les notes ci-dessous peuvent encore affiner votre CV.",
    fitTitle: "Ce que Zenith peut faire",
    reasons: {
      senior: "Votre CV se lit à un niveau de direction. La Suite Carrière Exécutive vous donne un consultant dédié pour le récit, le CV et le LinkedIn d'une recherche de haut niveau.",
      positioning: "Les lacunes portent sur le positionnement : comment votre titre, votre profil et vos mots-clés vous présentent pour le poste visé. Avantage Carrière travaille votre CV, en deux formats, et tout votre profil LinkedIn, autour de ce poste.",
      rebuild: "Les principaux problèmes viennent de la construction du fichier. CV Essentiel réécrit votre CV pour le poste visé, dans une structure compatible ATS.",
      polish: "Votre fichier se lit bien. Il reste la formulation et les résultats : CV Essentiel est le moyen le plus simple de les faire réécrire par un spécialiste.",
    },
    included: "Voir le contenu", from: "Un seul paiement de",
    wa: "Relecture humaine gratuite sur WhatsApp", waNote: "Un spécialiste Zenith lit votre CV et vous dit quels changements comptent le plus. Envoyez votre CV dans la conversation.",
    waMessage: (role, ref) => `Bonjour Zenith, j'ai lancé la radiographie de CV sur votre site et j'aimerais une relecture humaine gratuite de mon CV.${role ? ` Poste visé : ${role}.` : ""} Réf : XRAY${ref ? `-${ref}` : ""}`,
    disclaimer: "La radiographie est une vérification automatique des problèmes de lecture courants. Ce n'est pas une note ATS officielle : chaque employeur configure son logiciel différemment, et aucun CV ne garantit un entretien.",
    privacy: "Confidentialité", terms: "Conditions",
    errors: {
      "too-big": "Ce fichier dépasse 5 Mo. Enregistrez une copie plus légère (images compressées) et réessayez.",
      "old-doc": "Les anciens fichiers Word (.doc) ne peuvent pas être lus ici. Enregistrez-le en .docx ou en PDF et réessayez.",
      "not-cv": "Ce fichier n'est pas ce que son nom indique. Essayez le PDF ou le .docx d'origine.",
      unreadable: "Nous n'avons pas pu lire ce fichier. Essayez un export PDF ou .docx de votre CV.",
    },
    scanned: {
      title: "Votre CV ne contient aucun texte lisible",
      body: "Ce PDF est une image : un scan, ou un design exporté en image. La plupart des logiciels de tri voient un document vide : rien de votre expérience n'atteint une recherche par mots-clés.",
      fix: "Exportez-le à nouveau depuis Word, Google Docs ou Canva en PDF texte, ou laissez-nous le reconstruire.",
    },
    theme: ["Passer au thème clair", "Passer au thème sombre"], skip: "Aller au contenu", language: "Langue",
    live: { reading: "Lecture de votre CV", done: "Radiographie prête" },
  },
  ar: {
    back: "العودة إلى Zenith", eyebrow: "أشعة السيرة الذاتية لأنظمة الفرز",
    h1: "شاهد سيرتك الذاتية كما يقرؤها نظام الفرز الآلي.",
    lede: "ضع سيرتك الذاتية هنا، وخلال ثوانٍ سترى ما يستطيع نظام تتبّع المتقدمين (ATS) قراءته وما لا يستطيع، وما الذي تصلحه أولاً.",
    promise: ["يعمل داخل متصفحك: سيرتك لا تُرفع ولا تُحفظ أبداً", "PDF أو Word ‏(.docx)، حتى 5 ميغابايت", "مجاني، بلا تسجيل"],
    drop: "ضع سيرتك الذاتية هنا", dropOr: "أو اختر ملفاً", dropHint: "PDF أو ‎.docx، حتى 5 ميغابايت", change: "اختر ملفاً آخر", remove: "إزالة الملف",
    role: "الوظيفة المستهدفة (اختياري)", rolePh: "مثال: مدير مطعم", adToggle: "أضف إعلان وظيفة لفحص الكلمات المفتاحية (اختياري)", ad: "إعلان الوظيفة", adPh: "الصق نص الإعلان كاملاً هنا",
    run: "ابدأ الفحص", running: "نقرأ سيرتك…",
    steps: ["قراءة الملف", "تحديد الأقسام", "فحص التنسيق", "اختبار الكلمات المفتاحية والنتائج"],
    results: "نتيجة الفحص", again: "افحص سيرة أخرى", print: "حفظ كملف PDF",
    facts: { pdf: "PDF", docx: "Word", txt: "نص", pages: n => `عدد الصفحات: ${n}`, words: n => `عدد الكلمات: ${n}`, years: n => `الخبرة: نحو ${n} ${n >= 3 && n <= 10 ? "سنوات" : "سنة"}` },
    counts: { pass: n => `سليم: ${n}`, warn: n => `للتحسين: ${n}`, fail: n => `مشكلات: ${n}` },
    status: { pass: "سليم", warn: "للتحسين", fail: "مشكلة", info: "ملاحظة" },
    areas: { readability: "قابلية القراءة الآلية", structure: "بنية المستند", keywords: "الكلمات المفتاحية", positioning: "التموضع المهني", formatting: "التنسيق", achievements: "عبارات الإنجاز", alignment: "التوافق مع الوظيفة" },
    film: "ما يقرؤه النظام", filmNote: "سيرتك كنص خام، بالترتيب الذي يصادفه به النظام.",
    legend: { heading: "قسم تعرّف عليه", metric: "نتيجة بالأرقام", duty: "مهمة بلا نتيجة", contact: "بيانات التواصل" },
    filmMore: "عرض كل الأسطر", filmLess: "عرض أسطر أقل",
    fixes: "أصلح هذه أولاً", fixesNone: "لا شيء عاجل. الملاحظات أدناه قد تحسّن سيرتك أكثر.",
    fitTitle: "كيف تساعدك Zenith",
    reasons: {
      senior: "سيرتك بمستوى الإدارة العليا. الباقة التنفيذية المتكاملة تمنحك مستشاراً مخصصاً للقصة المهنية والسيرة الذاتية ولينكدإن في بحث بمستوى عالٍ.",
      positioning: "الفجوات في التموضع: كيف يقدّمك عنوانك وملخصك وكلماتك المفتاحية للوظيفة التي تريدها. باقة الميزة المهنية تعمل على سيرتك بنسختين وعلى ملفك الكامل في لينكدإن حول تلك الوظيفة.",
      rebuild: "المشكلات الرئيسية في طريقة بناء الملف. باقة أساسيات السيرة الذاتية تعيد كتابة سيرتك للوظيفة المستهدفة ببنية متوافقة مع أنظمة الفرز.",
      polish: "ملفك يُقرأ جيداً. يبقى الأسلوب والنتائج، وباقة أساسيات السيرة الذاتية أبسط طريقة ليعيد مختص كتابتها.",
    },
    included: "ماذا تتضمن الباقة", from: "دفعة واحدة",
    wa: "مراجعة بشرية مجانية عبر واتساب", waNote: "يقرأ مختص من Zenith سيرتك ويخبرك بأهم التغييرات. أرسل سيرتك في المحادثة.",
    waMessage: (role, ref) => `مرحباً Zenith، استخدمت فحص السيرة الذاتية على موقعكم وأرغب في مراجعة بشرية مجانية لسيرتي.${role ? ` الوظيفة المستهدفة: ${role}.` : ""} المرجع: XRAY${ref ? `-${ref}` : ""}`,
    disclaimer: "هذا الفحص تدقيق آلي لمشكلات القراءة الشائعة، وليس درجة رسمية من أي نظام فرز: كل جهة توظيف تضبط نظامها بطريقتها، ولا توجد سيرة ذاتية تضمن مقابلة.",
    privacy: "سياسة الخصوصية", terms: "الشروط",
    errors: {
      "too-big": "حجم الملف أكبر من 5 ميغابايت. احفظ نسخة أصغر (بصور مضغوطة) وحاول مجدداً.",
      "old-doc": "لا يمكن قراءة ملفات Word القديمة (.doc) هنا. احفظه بصيغة ‎.docx أو PDF وحاول مجدداً.",
      "not-cv": "هذا الملف ليس ما يدل عليه اسمه. جرّب ملف PDF أو ‎.docx الأصلي.",
      unreadable: "لم نتمكن من قراءة هذا الملف. جرّب نسخة PDF أو ‎.docx من سيرتك.",
    },
    scanned: {
      title: "سيرتك لا تحتوي على نص قابل للقراءة",
      body: "ملف PDF هذا صورة: مسح ضوئي أو تصميم مُصدَّر كصورة. معظم أنظمة الفرز ترى مستنداً فارغاً، فلا يصل شيء من خبرتك إلى البحث بالكلمات المفتاحية.",
      fix: "صدّره من جديد من Word أو Google Docs أو Canva كملف PDF نصي، أو دعنا نعيد بناءه.",
    },
    theme: ["التبديل إلى المظهر الفاتح", "التبديل إلى المظهر الداكن"], skip: "انتقل إلى المحتوى", language: "اللغة",
    live: { reading: "نقرأ سيرتك", done: "الفحص جاهز" },
  },
};

export const listSep = (lang: Lang): string => SEP[lang];
