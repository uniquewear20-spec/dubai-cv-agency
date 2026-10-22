"use client";
// components/site/AgentSection.tsx — the Zenith AI job agent on the homepage (#zenith-ai).
// Says exactly what is live, using /api/agent/status, and shows the agent's real ranking code at
// work on a fictional CV and a fictional listing.

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { pick, type L10n, type Lang } from "@/lib/site";
import { scoreJob, type Reason } from "@/lib/agent/score";
import { COPY as AGENT_COPY } from "@/lib/agent/i18n";
import { countryName } from "@/lib/agent/countries";
import type { Job, Profile } from "@/lib/agent/types";
import { useAgentStatus } from "./useAgentStatus";

const T: Record<string, L10n> = {
  h: { en: "Zenith AI job agent", fr: "L'agent emploi Zenith AI", ar: "وكيل الوظائف Zenith AI" },
  lede: {
    en: "A working tool, not a promise. It searches public job sources, ranks every listing against your CV, drafts applications from what your CV actually says, and tracks each one to the offer. Nothing is sent without your approval.",
    fr: "Un outil qui fonctionne, pas une promesse. Il interroge des sources d'offres publiques, classe chaque annonce selon votre CV, rédige vos candidatures à partir de ce que dit réellement votre CV et suit chacune jusqu'à l'offre. Rien n'est envoyé sans votre accord.",
    ar: "أداة تعمل فعلاً، لا وعد. يبحث في مصادر وظائف عامة، ويرتّب كل إعلان حسب تطابقه مع سيرتك الذاتية، ويكتب طلباتك مما تقوله سيرتك فعلاً، ويتابع كل طلب حتى العرض. لا يُرسل شيء دون موافقتك.",
  },
  live: { en: "Live now, free for everyone", fr: "Disponible, gratuit pour tous", ar: "متاح الآن ومجاني للجميع" },
  liveList: {
    en: "Job search, match ranking with reasons, template drafts, an application tracker with follow-up reminders, and export or deletion of your data.",
    fr: "Recherche d'offres, classement motivé, brouillons modèles, suivi des candidatures avec rappels de relance, export ou suppression de vos données.",
    ar: "البحث عن الوظائف، والترتيب مع أسبابه، ومسودات جاهزة، ومتابعة الطلبات مع تذكيرات، وتصدير بياناتك أو حذفها.",
  },
  pro: { en: "Pro, with Career Automation and Executive Career Suite", fr: "Pro, avec Carrière Automatisée et Suite Carrière Exécutive", ar: "Pro، مع أتمتة المسار المهني والباقة التنفيذية المتكاملة" },
  proSend: {
    en: "Zenith emails the applications you approve, with your name, replies to you and a copy to you.",
    fr: "Zenith envoie par e-mail les candidatures que vous validez, à votre nom, avec les réponses et une copie pour vous.",
    ar: "ترسل Zenith بالبريد الطلبات التي توافق عليها، باسمك، مع وصول الردود ونسخة إليك.",
  },
  proAiOn: {
    en: "AI-tailored CV highlights and cover letters. Every highlight quotes the CV line it comes from; figures or skills your CV doesn't show are flagged.",
    fr: "Points forts et lettres adaptés par IA. Chaque point fort cite la ligne du CV dont il vient ; les chiffres ou compétences absents de votre CV sont signalés.",
    ar: "نقاط بارزة وخطابات مكيّفة بالذكاء الاصطناعي. كل نقطة تقتبس السطر الذي جاءت منه في سيرتك، ويُنبَّه إلى أي رقم أو مهارة لا تُظهرها سيرتك.",
  },
  proAiOff: {
    en: "AI-tailored drafts are not switched on yet. Until they are, Pro drafts are template drafts, and your specialist tailors the applications included in your package.",
    fr: "Les brouillons adaptés par IA ne sont pas encore activés. D'ici là, les brouillons Pro sont des brouillons modèles, et votre spécialiste adapte les candidatures incluses dans votre formule.",
    ar: "المسودات المكيّفة بالذكاء الاصطناعي غير مفعّلة بعد. وحتى تفعيلها، تكون مسودات Pro مسودات جاهزة، ويكيّف مختصك الطلبات المشمولة في باقتك.",
  },
  open: { en: "Open the agent", fr: "Ouvrir l'agent", ar: "افتح الوكيل" },
  packages: { en: "See the packages", fr: "Voir les formules", ar: "اطّلع على الباقات" },
  stepsH: { en: "How it works", fr: "Comment ça marche", ar: "كيف يعمل" },
  example: {
    en: "A fictional CV against a fictional listing, scored by the agent's own ranking code.",
    fr: "Un CV fictif face à une offre fictive, notés par le code de classement de l'agent.",
    ar: "سيرة ذاتية افتراضية مقابل إعلان افتراضي، بتقييم شيفرة الترتيب الفعلية في الوكيل.",
  },
  exampleTag: { en: "Fictional example", fr: "Exemple fictif", ar: "مثال افتراضي" },
  neverH: { en: "What it will never do", fr: "Ce qu'il ne fera jamais", ar: "ما لن يفعله أبداً" },
  sourcesH: { en: "Where the jobs come from", fr: "D'où viennent les offres", ar: "من أين تأتي الوظائف" },
  sources: {
    en: "Public job APIs that allow it: Himalayas, Jobicy, Remotive and Arbeitnow, each credited and linked to the original listing. LinkedIn, Indeed, Bayt, GulfTalent and Naukrigulf have no open API: the agent opens the same search there, and you can add any listing by hand.",
    fr: "Des API d'offres publiques qui l'autorisent : Himalayas, Jobicy, Remotive et Arbeitnow, chacune citée et liée à l'offre d'origine. LinkedIn, Indeed, Bayt, GulfTalent et Naukrigulf n'ont pas d'API ouverte : l'agent ouvre la même recherche sur ces sites, et vous pouvez ajouter n'importe quelle offre à la main.",
    ar: "واجهات وظائف عامة تسمح بذلك: Himalayas وJobicy وRemotive وArbeitnow، مع ذكر كل مصدر ورابط الإعلان الأصلي. لا تملك LinkedIn وIndeed وBayt وGulfTalent وNaukrigulf واجهة مفتوحة، فيفتح الوكيل البحث نفسه فيها، ويمكنك إضافة أي إعلان يدوياً.",
  },
  privacy: {
    en: "Your profile, CV and applications stay in your browser. Search sends only your target roles and countries.",
    fr: "Votre profil, votre CV et vos candidatures restent dans votre navigateur. La recherche n'envoie que vos postes visés et vos pays.",
    ar: "يبقى ملفك وسيرتك الذاتية وطلباتك في متصفحك. لا يُرسل البحث إلا الوظائف والدول التي تستهدفها.",
  },
};

const STEPS: { title: L10n; body: L10n }[] = [
  {
    title: { en: "Your profile and CV", fr: "Votre profil et votre CV", ar: "ملفك وسيرتك الذاتية" },
    body: {
      en: "Upload a PDF or Word CV; it is read on your device. Add target roles, countries, salary floor, languages and employers to skip.",
      fr: "Importez un CV PDF ou Word, lu sur votre appareil. Ajoutez postes visés, pays, salaire minimum, langues et employeurs à ignorer.",
      ar: "حمّل سيرة PDF أو Word تُقرأ على جهازك، وأضف الوظائف والدول والحد الأدنى للراتب واللغات والشركات التي لا تريدها.",
    },
  },
  {
    title: { en: "Find and rank", fr: "Trouver et classer", ar: "البحث والترتيب" },
    body: {
      en: "Listings from public job sources, each scored out of 100 on title, skills, place, seniority and freshness, with every reason shown.",
      fr: "Des offres issues de sources publiques, notées sur 100 selon l'intitulé, les compétences, le lieu, le niveau et la date, chaque raison affichée.",
      ar: "إعلانات من مصادر عامة، لكل منها درجة من 100 حسب المسمّى والمهارات والمكان والمستوى والحداثة، مع عرض كل سبب.",
    },
  },
  {
    title: { en: "Prepare, then approve", fr: "Préparer, puis valider", ar: "التجهيز ثم الموافقة" },
    body: {
      en: "A draft built from your CV lines, a cover letter with gaps you fill in, and the requirements your CV doesn't show. You edit and approve it.",
      fr: "Un brouillon bâti sur les lignes de votre CV, une lettre avec des passages à compléter, et les exigences que votre CV ne montre pas. Vous le modifiez et le validez.",
      ar: "مسودة مبنية على أسطر سيرتك، وخطاب بفراغات تكملها، وقائمة بما لا تُظهره سيرتك من متطلبات. تعدّلها وتوافق عليها.",
    },
  },
  {
    title: { en: "Apply and follow up", fr: "Postuler et relancer", ar: "التقديم والمتابعة" },
    body: {
      en: "Apply on the employer's site or by email, mark it submitted, and get a follow-up date you can add to your calendar.",
      fr: "Postulez sur le site de l'employeur ou par e-mail, marquez-la envoyée et recevez une date de relance à ajouter à votre agenda.",
      ar: "قدّم في موقع صاحب العمل أو بالبريد، وعلّم الطلب كمقدَّم، واحصل على موعد متابعة تضيفه إلى تقويمك.",
    },
  },
];

const NEVER: L10n[] = [
  { en: "Apply on job boards or employer portals for you", fr: "Postuler pour vous sur les sites d'emploi ou les portails employeurs", ar: "التقديم نيابةً عنك في مواقع التوظيف أو بوابات أصحاب العمل" },
  { en: "Get past CAPTCHAs, sign-ins or assessments", fr: "Contourner CAPTCHA, connexions ou tests", ar: "تجاوز اختبارات CAPTCHA أو تسجيل الدخول أو التقييمات" },
  { en: "Invent experience, figures or qualifications", fr: "Inventer une expérience, des chiffres ou des diplômes", ar: "اختلاق خبرة أو أرقام أو مؤهلات" },
  { en: "Send anything you haven't approved", fr: "Envoyer quoi que ce soit sans votre accord", ar: "إرسال أي شيء لم توافق عليه" },
];

// The example: fictional on both sides, scored with the real code at a fixed moment.
const NOW = Date.parse("2026-10-19T09:00:00Z");
const EXAMPLE_JOB: Job = {
  id: "example:finance-manager", source: "manual", title: "Finance Manager, Hospitality", company: "A hotel group (fictional)",
  location: "Dubai, United Arab Emirates", remote: false, url: "https://zenithdubaicv.com/agent/",
  description: "We are looking for a Finance Manager to lead budgeting, forecasting and month-end close for our hotels. You will own cash flow management, prepare IFRS reporting and manage VAT filings. Experience with SAP is a plus. Fluent Arabic and English required.",
  postedAt: new Date(NOW - 3 * 86_400_000).toISOString(), salary: null, salaryRange: null, tags: [], applyEmail: null,
};
const EXAMPLE_PROFILE: Profile = {
  name: "Sample candidate", email: "", phone: "", headline: "Finance manager, hospitality", roles: ["Finance Manager"], countries: ["AE"],
  remoteOk: true, onsiteOk: true, salaryMin: null, salaryCurrency: "AED", salaryPeriod: "month", languages: ["English", "Arabic"],
  skills: ["Budgeting", "Forecasting", "IFRS", "Cash flow management", "Month-end close", "Power BI"], excludeCompanies: [],
  cvText: "", cvFileName: null, updatedAt: null,
};

export default function AgentSection({ lang }: { lang: Lang }) {
  const status = useAgentStatus();
  const t = (k: keyof typeof T) => pick(T[k], lang);
  const copy = AGENT_COPY[lang];
  const match = useMemo(() => scoreJob(EXAMPLE_JOB, EXAMPLE_PROFILE, EXAMPLE_PROFILE.skills, NOW), []);
  const reason = (r: Reason) => copy.reason(r, c => countryName(c, lang));
  const segments: { key: keyof typeof match.parts; max: number }[] = [
    { key: "title", max: 35 }, { key: "skills", max: 30 }, { key: "place", max: 15 }, { key: "level", max: 10 }, { key: "fresh", max: 10 },
  ];

  return (
    <section id="zenith-ai" className="z-section ag" aria-labelledby="ag-title">
      <style href="zenith-agent-section" precedence="medium">{CSS}</style>
      <div className="z-wrap">
        <div className="ag-top">
          <div>
            <h2 id="ag-title" className="z-h2">{t("h")}</h2>
            <p className="z-lede" style={{ marginTop: 18 }}>{t("lede")}</p>
            <div className="ag-ctas">
              <Link href="/agent/" className="z-btn z-btn-primary">{t("open")} <ArrowRight size={16} aria-hidden className="ag-arrow" /></Link>
              <a href="#packages" className="z-btn z-btn-quiet">{t("packages")}</a>
            </div>
          </div>
          <div className="ag-status">
            <div>
              <p className="ag-status-h"><span className="ag-dot" data-on="true" aria-hidden />{t("live")}</p>
              <p className="z-small">{t("liveList")}</p>
            </div>
            <div>
              <p className="ag-status-h"><span className="ag-dot" data-on={status?.email ? "true" : "false"} aria-hidden />{t("pro")}</p>
              <ul className="ag-pro">
                <li>{t("proSend")}</li>
                <li><span className="ag-dot" data-on={status?.ai ? "true" : "false"} aria-hidden />{status?.ai ? t("proAiOn") : t("proAiOff")}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="ag-grid">
          <div>
            <h3 className="z-h3">{t("stepsH")}</h3>
            <ol className="ag-steps">
              {STEPS.map(s => (
                <li key={s.title.en}>
                  <p className="ag-step-t">{pick(s.title, lang)}</p>
                  <p className="z-small">{pick(s.body, lang)}</p>
                </li>
              ))}
            </ol>
          </div>

          <figure className="ag-example">
            <figcaption className="z-micro">{t("example")}</figcaption>
            <div className="ag-card">
              <div className="ag-card-head">
                <div>
                  <p className="z-tag z-tag-gold">{t("exampleTag")}</p>
                  <p className="ag-job">{EXAMPLE_JOB.title}</p>
                  <p className="z-micro">{EXAMPLE_JOB.company} · {countryName("AE", lang)}</p>
                </div>
                <div className="ag-score">
                  <p className="ag-score-n">{match.score}<span className="z-sr"> / 100</span></p>
                  <p className="z-micro">{copy.jobs.label(match.score)}</p>
                </div>
              </div>
              <span className="ag-meter" aria-hidden>
                {segments.map(s => <i key={s.key} style={{ "--w": s.max, "--f": `${Math.round((Math.min(s.max, match.parts[s.key]) / s.max) * 100)}%` } as React.CSSProperties} />)}
              </span>
              <ul className="ag-reasons">
                {match.reasons.map((r, i) => (
                  <li key={i} data-tone={r.tone}><span aria-hidden>{r.tone === "plus" ? "+" : r.tone === "minus" ? "−" : "·"}</span>{reason(r)}</li>
                ))}
              </ul>
            </div>
          </figure>
        </div>

        <div className="ag-foot">
          <div>
            <h3 className="z-h3">{t("neverH")}</h3>
            <ul className="ag-never">
              {NEVER.map(n => <li key={n.en}><X size={15} aria-hidden />{pick(n, lang)}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="z-h3">{t("sourcesH")}</h3>
            <p className="z-small" style={{ marginTop: 12 }}>{t("sources")}</p>
            <p className="z-small ag-privacy"><Check size={15} aria-hidden />{t("privacy")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.ag-top{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:40px 64px;align-items:end}
.ag-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
[dir="rtl"] .ag-arrow{transform:scaleX(-1)}
.ag-status{display:flex;flex-direction:column;gap:18px;padding:22px 24px;border:1px solid var(--z-rule);border-radius:18px;background:var(--z-surface)}
.ag-status-h{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:600;color:var(--z-fg);margin-bottom:6px}
.ag-dot{display:inline-block;flex:none;width:8px;height:8px;border-radius:50%;background:var(--z-fg-3)}
.ag-dot[data-on="true"]{background:var(--z-success);box-shadow:0 0 0 3px color-mix(in srgb,var(--z-success) 22%,transparent)}
.ag-pro{list-style:none;display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.6;color:var(--z-fg-2)}
.ag-pro li{display:flex;gap:10px;align-items:baseline}
.ag-pro li:first-child{padding-inline-start:18px}
.ag-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px 64px;margin-top:72px;align-items:start}
.ag-steps{list-style:none;counter-reset:s;margin-top:18px;display:flex;flex-direction:column}
.ag-steps li{counter-increment:s;display:grid;grid-template-columns:44px minmax(0,1fr);column-gap:8px;padding:18px 0;border-top:1px solid var(--z-rule)}
.ag-steps li::before{content:counter(s);grid-row:span 2;font-family:var(--font-serif),Georgia,serif;font-size:28px;line-height:1;color:var(--z-gold-text)}
.ag-step-t{font-size:16px;font-weight:600;color:var(--z-fg);margin-bottom:4px}
.ag-example{margin:0}
.ag-example figcaption{margin-bottom:12px}
.ag-card{border:1px solid var(--z-rule-strong);border-radius:18px;padding:22px 24px;background:var(--z-surface);box-shadow:var(--z-shadow)}
.ag-card-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}
.ag-job{font-size:18px;font-weight:600;color:var(--z-fg);margin:10px 0 2px}
.ag-card-head > div:first-child{min-width:0}
.ag-score{text-align:end;flex:0 1 auto;min-width:0}
.ag-score-n{font-family:var(--font-serif),Georgia,serif;font-size:52px;line-height:.95;color:var(--z-gold-text);font-variant-numeric:lining-nums tabular-nums}
.ag-meter{display:flex;gap:3px;height:7px;margin:18px 0 16px}
.ag-meter i{position:relative;flex:var(--w) 1 0;border-radius:2px;background:var(--z-rule-strong);overflow:hidden}
.ag-meter i::after{content:"";position:absolute;inset-block:0;inset-inline-start:0;width:var(--f);background:var(--z-gold)}
.ag-reasons{list-style:none;display:flex;flex-direction:column;gap:6px;font-size:14px;line-height:1.5;color:var(--z-fg-2)}
.ag-reasons li{display:grid;grid-template-columns:16px minmax(0,1fr);gap:6px}
.ag-reasons li span{font-weight:700;text-align:center;color:var(--z-fg-3)}
.ag-reasons li[data-tone="plus"] span{color:var(--z-success)}
.ag-reasons li[data-tone="minus"] span{color:var(--z-error)}
.ag-foot{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px 64px;margin-top:64px;padding-top:40px;border-top:1px solid var(--z-rule)}
.ag-never{list-style:none;margin-top:14px;display:flex;flex-direction:column;gap:10px;font-size:15px;color:var(--z-fg-2)}
.ag-never li{display:flex;gap:10px;align-items:flex-start}
.ag-never svg{color:var(--z-error);margin-top:4px;flex:none}
.ag-privacy{display:flex;gap:10px;align-items:flex-start;margin-top:14px}
.ag-privacy svg{color:var(--z-success);margin-top:4px;flex:none}
@media (max-width:960px){.ag-top,.ag-grid,.ag-foot{grid-template-columns:minmax(0,1fr)}.ag-grid{margin-top:48px}}
@media (max-width:480px){.ag-card{padding:18px}.ag-score-n{font-size:44px}}
`;
