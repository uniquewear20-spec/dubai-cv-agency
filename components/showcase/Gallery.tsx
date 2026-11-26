"use client";

// /showcase/: the gallery of concept websites. Separate from the personal portfolio wheel on the
// homepage. Every count on this page is computed from lib/showcase/catalog.ts, so it only ever
// reports what is actually built.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, CONCEPTS, type CategoryId, type GalleryLang } from "@/lib/showcase/catalog";
import { sized, srcSet } from "@/lib/showcase/media";

const TX = {
  home: { en: "Zenith Dubai", fr: "Zenith Dubai", ar: "زينيث دبي" },
  title: { en: "Concept websites", fr: "Sites concepts", ar: "مواقع نموذجية" },
  intro: {
    en: "Working websites for businesses that do not exist. We design and build each one as a concept, with its own brand, typography and interactions, to show what a website can do for a business like yours.",
    fr: "Des sites qui fonctionnent, pour des entreprises qui n'existent pas. Nous concevons et développons chacun comme un concept, avec sa marque, sa typographie et ses interactions, pour montrer ce qu'un site peut apporter à une entreprise comme la vôtre.",
    ar: "مواقع تعمل فعلاً لشركات غير موجودة. نصمم كل موقع ونبنيه كنموذج، بهويته وخطوطه وتفاعلاته الخاصة، لنُظهر ما يمكن أن يقدمه موقع إلكتروني لشركة مثل شركتك.",
  },
  fiction: {
    en: "Every business, name, figure and image on these sites is fictional. None of them is a client.",
    fr: "Chaque entreprise, nom, chiffre et image de ces sites est fictif. Aucun n'est un client.",
    ar: "كل الشركات والأسماء والأرقام والصور في هذه المواقع خيالية، وليست أيٌّ منها عميلاً لنا.",
  },
  built: { en: "built so far", fr: "réalisés à ce jour", ar: "مكتملة حتى الآن" },
  concept: { en: "concept", fr: "concept", ar: "نموذج" },
  concepts: { en: "concepts", fr: "concepts", ar: "نماذج" },
  all: { en: "All", fr: "Tous", ar: "الكل" },
  filter: { en: "Show concepts by industry", fr: "Afficher par secteur", ar: "عرض النماذج حسب القطاع" },
  open: { en: "Open the site", fr: "Ouvrir le site", ar: "افتح الموقع" },
  tryIt: { en: "Try", fr: "À essayer", ar: "جرّب" },
  ctaTitle: { en: "Want a website like one of these?", fr: "Un site comme ceux-ci vous intéresse ?", ar: "هل تريد موقعاً مثل هذه المواقع؟" },
  ctaBody: {
    en: "Tell us about your business and which concept you liked. We reply by email with what it would take.",
    fr: "Parlez-nous de votre entreprise et du concept qui vous a plu. Nous répondons par e-mail avec ce que cela demanderait.",
    ar: "أخبرنا عن شركتك وعن النموذج الذي أعجبك، وسنرد عبر البريد الإلكتروني بما يتطلبه ذلك.",
  },
  cta: { en: "Contact Zenith Dubai", fr: "Contacter Zenith Dubai", ar: "تواصل مع زينيث دبي" },
} as const;

const LANGS: { id: GalleryLang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "fr", label: "FR" },
  { id: "ar", label: "عربي" },
];

export default function Gallery() {
  const [lang, setLang] = useState<GalleryLang>("en");
  const [filter, setFilter] = useState<"all" | CategoryId>("all");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("z-lang");
      if (saved === "fr" || saved === "ar" || saved === "en") setLang(saved);
    } catch {
      /* storage blocked */
    }
  }, []);

  const choose = (l: GalleryLang) => {
    setLang(l);
    try { localStorage.setItem("z-lang", l); } catch { /* ignore */ }
  };

  const counts = useMemo(() => {
    const c = new Map<CategoryId, number>();
    for (const x of CONCEPTS) c.set(x.category, (c.get(x.category) ?? 0) + 1);
    return c;
  }, []);
  const shown = filter === "all" ? CONCEPTS : CONCEPTS.filter((c) => c.category === filter);
  const catName = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.name[lang] ?? id;
  const total = CONCEPTS.length;

  return (
    <div className="sg" lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="sg-top">
        <Link href="/" className="sg-home">{TX.home[lang]}</Link>
        <nav aria-label="Language" className="sg-langs">
          {LANGS.map((l) => (
            <button key={l.id} type="button" aria-pressed={lang === l.id} lang={l.id} onClick={() => choose(l.id)}>{l.label}</button>
          ))}
        </nav>
      </header>

      <main className="sg-main">
        <section className="sg-head">
          <h1>{TX.title[lang]}</h1>
          <div className="sg-introwrap">
            <p className="sg-intro">{TX.intro[lang]}</p>
            <p className="sg-fiction">{TX.fiction[lang]}</p>
          </div>
          <p className="sg-count"><b>{total}</b> {total === 1 ? TX.concept[lang] : TX.concepts[lang]} {TX.built[lang]}</p>
        </section>

        <div className="sg-filters" role="group" aria-label={TX.filter[lang]}>
          <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
            {TX.all[lang]} <span>{total}</span>
          </button>
          {CATEGORIES.filter((c) => counts.get(c.id)).map((c) => (
            <button key={c.id} type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.name[lang]} <span>{counts.get(c.id)}</span>
            </button>
          ))}
        </div>

        <ul className="sg-grid">
          {shown.map((c, k) => (
            <li key={c.slug} className={k === 0 && filter === "all" ? "sg-card lead" : "sg-card"}>
              <Link href={`/showcase/${c.slug}/${lang === "ar" ? "?lang=ar" : ""}`} className="sg-link">
                <div className="sg-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sized(c.image, 1440)}
                    srcSet={srcSet(c.image, [800, 1280, 1600])}
                    sizes={k === 0 ? "(max-width: 900px) 100vw, 1200px" : "(max-width: 900px) 100vw, 600px"}
                    alt=""
                    loading={k < 2 ? "eager" : "lazy"}
                    decoding="async"
                    style={{ objectPosition: c.focus ?? "50% 50%" }}
                  />
                </div>
                <div className="sg-meta">
                  <p className="sg-cat">{catName(c.category)}</p>
                  <h2>{c.name}</h2>
                  <p className="sg-line">{c.line[lang]}</p>
                  <p className="sg-feat"><span>{TX.tryIt[lang]}</span> {c.feature[lang]}</p>
                  <span className="sg-open">{TX.open[lang]}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <section className="sg-cta">
          <h2>{TX.ctaTitle[lang]}</h2>
          <p>{TX.ctaBody[lang]}</p>
          <Link href="/#contact" className="sg-btn">{TX.cta[lang]}</Link>
        </section>
      </main>
    </div>
  );
}
