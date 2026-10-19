"use client";

// Zenith AI Career Automation: the section that follows the portfolio websites on the homepage.
//
// The service is not live. Nothing on this section pretends otherwise: it explains the product (the Ink Orbit
// drawings, how it works, the candidate's controls), lists the proposed plans without prices, answers the hard
// questions honestly, and every call to action joins a launch list, sent through the site's existing /api/contact.
// Plans and prices: lib/zenith-ai/plans.ts. Backend contracts: lib/zenith-ai/contracts.ts. What is still needed
// before taking payments or sending applications: docs/zenith-ai-career-automation.md.

import * as React from "react";
import { MotionConfig, motion } from "framer-motion";
import {
  ArrowDown, ArrowRight, Check, ChevronDown, Info, KeyRound, Loader2, MessageCircle, PauseCircle, ShieldCheck,
  SlidersHorizontal, Undo2, X,
} from "lucide-react";
import InkOrbitFeatures, { ZENITH_MARK, type InkOrbitCopy } from "@/components/ui/ink-orbit-features";
import { ZENITH_AI_PLANS, type ZenithAIPlanId } from "@/lib/zenith-ai/plans";
import { ZENITH_AI_SAMPLE_WEEKS } from "@/lib/zenith-ai/preview-data";
import { FALLBACK_RATES, priceIn, type Currency, type Rates } from "@/lib/currency";
import type { Lang } from "@/lib/portfolios";

const G = "#C8A96E", INK = "#0A0907";

/* ------------------------------------------------------------------------------------------------ copy */

type PlanCopy = { name: string; qty: string; unit: string; for: string; features: string[]; note?: string };

const EN = {
  eyebrow: "Zenith AI Career Automation",
  status: "In development · launch list open",
  h2a: "Your Next Career Move.",
  h2b: "Engineered.",
  lede: "Discover relevant opportunities. Personalize every application. Keep your career moving — while Zenith helps handle the repetitive work.",
  positioning: "You focus on your future. We automate the search.",
  support: "Your career deserves more than endless job boards, repetitive application forms, and hours spent rewriting the same application. Zenith AI helps you discover relevant opportunities, prepare personalized applications, track submissions, and manage your job-search pipeline from one intelligent platform.",
  ctaStart: "Start Your AI Job Search",
  ctaHow: "Explore How It Works",
  ctaPlans: "See the plans",
  statusNote: "Zenith AI is being built now. Nothing on this page is live yet except the launch list, and each feature says what it depends on: your permission, a supported source, or an employer channel that allows it.",
  orbit: {
    brand: "Zenith AI",
    preview: "Interactive preview · nothing on these drawings is connected",
    motion: { pause: "Pause motion", play: "Play motion" },
    engine: {
      index: "01", kicker: "AI Application Engine", title: "Your Career. In Motion.",
      body: "Your profile becomes the foundation for a structured, personalized job-search workflow, with every application prepared around your experience and target role.",
      aria: "Diagram: your CV and career profile flow into Zenith AI, which reads supported job sources and prepares an application pack. Each application then moves from prepared, to approved by you, to submitted once the sending channel confirms it, to a response.",
      stagesLabel: "Workflow stages",
      stages: [
        { label: "Profile", detail: "Your CV and career profile are the starting point: your experience, target roles, countries, salary range and the employers you want to avoid." },
        { label: "Discover", detail: "Openings come only from supported sources whose terms allow it, and each one is scored against your profile. Finding a role is not applying to it." },
        { label: "Prepare", detail: "For each suitable role, Zenith AI drafts a tailored CV note, a cover letter and an application message, using only your real experience." },
        { label: "Approve", detail: "You decide: review every application before it is sent, or let your own rules approve them within the limits you set." },
        { label: "Submit & track", detail: "An application is marked submitted only when the sending channel confirms it. Employer responses and interviews are logged separately, where the integrations allow." },
      ],
      cv: "Your CV", profile: "Career profile",
      fields: ["Roles", "Countries", "Salary", "Industries"],
      sources: "Supported job sources",
      hubSub: "match · tailor · track",
      pack: "Application pack",
      sheets: ["Tailored CV", "Cover letter", "Message"],
      pipeline: { prepared: "Prepared", approved: "Approved by you", submitted: "Submitted", confirmed: "Confirmed", response: "Response" },
    },
    connect: {
      index: "02", kicker: "Your Job Search, Connected", title: "One Intelligent Workflow",
      body: "Organize relevant opportunities, personalized application materials, authorized submissions, and responses in one coherent career workflow.",
      aria: "Connections around Zenith AI. Select one to see what it does and what it depends on.",
      hubSub: "your workflow",
      nodes: [
        { id: "profile", title: "Your profile", status: "You decide", detail: "Target roles, countries, industries, salary range, employers to exclude and a weekly limit. You can change any of them, or pause the campaign, at any time." },
        { id: "email", title: "Your email", status: "Your permission", detail: "Where an employer accepts applications by email, they go from your own address, connected through your email provider's secure sign-in (OAuth). Zenith never asks for your password, and you can revoke access at any time." },
        { id: "sources", title: "Job sources", status: "Supported sources", detail: "Openings come only from sources whose terms allow it, such as job feeds, employer career pages and partner APIs. Nothing is collected from behind a login." },
        { id: "portals", title: "Employer portals", status: "Where supported", detail: "Many employers use their own application systems. Zenith AI submits only through channels that permit it; anything that needs your account, an assessment or a CAPTCHA comes back to you as a task." },
        { id: "tracker", title: "Application tracker", status: "In development", detail: "Every application in one place: prepared, approved, submitted once confirmed, and any response we can see with your permission." },
      ],
      choose: "Select another connection to see what it depends on.",
      revoke: "Revoke access", reconnect: "Reconnect", revoked: "Disconnected · sending stopped",
      pauseCampaign: "Pause campaign", resumeCampaign: "Resume campaign", pausedNote: "Paused · nothing is sent", pausedHub: "campaign paused",
      handshake: ["Zenith AI asks", "You approve", "Connected"],
    },
    intel: {
      index: "03", kicker: "Application Intelligence", title: "Know Where Every Application Stands.",
      body: "A preview of the dashboard: what was prepared, what was actually submitted, and the responses and interviews that follow, each counted separately.",
      badge: "Product preview · illustrative sample data, not customer results",
      series: { prepared: "Prepared", submitted: "Submitted", responses: "Employer responses", interviews: "Interviews" },
      week: (n: number) => `Week ${n}`, weekShort: (n: number) => `W${n}`,
      slider: "Week shown in the readout",
      hint: "Hover the chart, or focus it and use the arrow keys, to read any week.",
      showTable: "Show as table", hideTable: "Hide table",
      tableCaption: "Illustrative sample data for one campaign, by week. Not customer results.",
      weekCol: "Week",
      defs: {
        prepared: "Drafted for one specific opening. Nothing has been sent yet.",
        submitted: "Sent, and confirmed by your email provider or the employer's system.",
        responses: "A reply from the employer, seen through your connected email or their platform, or logged by you.",
        interviews: "An interview that has been scheduled and logged in your dashboard.",
      },
    },
  } satisfies InkOrbitCopy,
  how: {
    eyebrow: "How it works",
    h: "Four steps, each kept distinct.",
    steps: [
      { tag: "You provide", title: "Build Your Career Profile", body: "Upload your CV and define your experience, target roles, preferred locations, industries, salary expectations and any other preferences." },
      { tag: "Discovery", title: "Discover Relevant Opportunities", body: "The system finds suitable openings in supported sources and scores each one against your profile and preferences. Finding a job is not applying to it." },
      { tag: "Preparation", title: "Prepare Tailored Applications", body: "AI drafts role-specific CV recommendations, a cover letter and an application message from your real experience and the information you approve." },
      { tag: "Submission · tracking", title: "Submit and Track", body: "Applications are sent only through supported, authorized channels. Each is marked submitted when the channel confirms it; responses and interviews are tracked where the integrations allow." },
    ],
    note: "Discovered, prepared, submitted and answered are four different things. The dashboard will never count one as another.",
  },
  control: {
    eyebrow: "Candidate control",
    h1: "Your name. Your decisions.",
    h2: "Your permission.",
    lede: "Zenith AI acts for you only within the limits you set. Your identity, your career choices and your email stay yours.",
    items: [
      { title: "You set the rules", body: "Choose target roles, countries, industries, salary range and the employers to exclude. Set a weekly limit, and review applications before they are sent if you prefer." },
      { title: "Your email, by permission", body: "Your address is connected through your email provider's secure authorization (OAuth). We never ask for, or store, your email password." },
      { title: "Revoke at any time", body: "Disconnect your email from your Zenith dashboard or from your email provider's security settings. Sending stops immediately." },
      { title: "Pause or stop", body: "Pause a campaign or stop it completely. Nothing is sent while it is paused." },
      { title: "No shortcuts", body: "Zenith AI will not bypass CAPTCHAs, assessments or security checks, and will not invent experience or credentials." },
    ],
    card: {
      title: "What you would authorize",
      may: "Zenith AI may",
      mayList: [
        "Send the applications you allow, from your connected address, to employers that accept email applications",
        "Read replies to those applications, only if you switch on response tracking",
        "Keep a record of every application in your dashboard",
      ],
      never: "Zenith AI will never",
      neverList: [
        "Ask for your email password",
        "Send outside your roles, countries, exclusions or limits",
        "Apply to an employer you have excluded",
        "Share your details with anyone but the employer you are applying to",
      ],
      revoke: "To revoke access, disconnect in your dashboard or in your email provider's security settings. Sending stops at once, and your records stay until you delete them.",
    },
  },
  plans: {
    eyebrow: "Plans",
    h: "Choose the scale of your search.",
    lede: "Prices will be published when the service opens. Joining the launch list is free and does not commit you to a plan.",
    price: "Price",
    priceTbd: "To be announced",
    proposed: "Proposed",
    cta: "Join the launch list",
    goldCta: "Register interest",
    countNote: "Allowances count confirmed submissions only. Drafts that were never sent do not use any of them.",
    checkoutNote: "Checkout is not open: no payment can be taken for these plans until prices and terms are approved.",
    items: {
      starter: { name: "Starter", qty: "100", unit: "applications", for: "For candidates beginning a structured job search.", features: ["Up to 100 application submissions", "Personalized application materials", "Job relevance filtering", "Application activity tracking, where supported"] },
      professional: { name: "Professional", qty: "500", unit: "applications", for: "For candidates pursuing a broader range of suitable opportunities.", features: ["Up to 500 application submissions", "Personalized CV and cover-letter assistance", "Configurable job-search preferences", "Submission history and tracking", "Response tracking where integrations permit"] },
      executive: { name: "Executive", qty: "1,000", unit: "applications", for: "For experienced professionals pursuing opportunities across several target markets.", features: ["Up to 1,000 application submissions", "Advanced role and location preferences", "Tailored executive application materials", "Priority workflow features, if implemented", "Application analytics and tracking"] },
      gold: { name: "Gold", qty: "Extended", unit: "career search", for: "A premium long-term service supporting your job search over an agreed service period.", features: ["Applications continue over an agreed service period", "Fair-use limits and eligibility set out before you join", "Renewal or extension conditions agreed in advance", "No promise of employment or interviews"], note: "Proposed package: its service period, fair-use policy, eligibility and renewal terms need commercial approval before it can open." },
    } satisfies Record<ZenithAIPlanId, PlanCopy>,
  },
  faq: {
    eyebrow: "Questions",
    h: "Honest answers.",
    lede: "If something here is unclear, ask us before you join. You will see the final terms before you pay anything.",
    items: [
      { q: "Does Zenith guarantee that I will get a job?", a: "No. Zenith AI can help you apply more consistently, with better-prepared applications, but employers make hiring decisions. No plan guarantees interviews, offers or employment." },
      { q: "Can I use my own email address?", a: "Yes, that is the design. Where an employer accepts applications by email, they are sent from your own address after you connect it through your email provider's secure authorization. We never ask for your password, and you can disconnect at any time." },
      { q: "Will applications be personalized for each role?", a: "Yes. Each application is prepared for the specific role from your real experience and the information you approve. Nothing is invented, and you can choose to review every application before it is sent." },
      { q: "Can I choose the countries, companies and roles I target?", a: "Yes. You set target roles, countries, industries and salary range, list employers to exclude, and cap how many applications go out each week." },
      { q: "How do I track applications and employer responses?", a: "Your dashboard will list every application with its status: prepared, approved, submitted (only after the channel confirms it) and any response. Responses are tracked where your email connection or the employer's platform makes them visible, and you can log others yourself." },
      { q: "What happens if a company requires a CAPTCHA, an assessment or extra verification?", a: "Zenith AI will not bypass them. The application is handed back to you to complete yourself, or skipped. It does not count as submitted until it actually is." },
      { q: "Can I pause or stop my campaign?", a: "Yes, at any time. Nothing is sent while a campaign is paused, and stopping it ends all sending." },
      { q: "How is my personal information protected?", a: "Your details are used only to run your search and are shared with an employer only when an application you allowed is sent. You can ask us to delete your data. Full privacy and data-handling terms will be published before onboarding opens." },
      { q: "What happens when my application allowance runs out?", a: "Sending stops. Your records stay available, and you choose whether to extend or change plan. Drafts that were never submitted do not count toward the allowance." },
      { q: "When can I start?", a: "Zenith AI is in development. Join the launch list and we will email you when onboarding opens. Joining is free and commits you to nothing." },
    ],
  },
  join: {
    eyebrow: "Launch list",
    h: "Be first when Zenith AI opens.",
    lede: "Tell us what you are looking for and we will contact you when onboarding opens. Joining does not create an account, start a campaign or send any application.",
    nextTitle: "What happens next",
    next: [
      "We confirm your place on the list.",
      "When onboarding opens, we invite you to build your profile and connect your email, only if you choose to.",
      "You see the final prices and terms before you pay anything.",
    ],
    email: "Email", name: "Full name", optional: "optional",
    roles: "Target roles", rolesPh: "e.g. Hotel General Manager, F&B Director",
    countries: "Target countries", countriesPh: "e.g. UAE, Saudi Arabia, Qatar",
    plan: "Plan you are considering", unsure: "Not sure yet",
    consent: "Zenith Dubai CV may email me about Zenith AI. I understand this does not start a job search or commit me to a plan.",
    submit: "Join the launch list", sending: "Sending…",
    okTitle: "You are on the list.",
    okBody: "We will write to {email} when onboarding opens. Nothing has been sent or submitted on your behalf.",
    err: "We could not send that. Please try again, or reach us directly:",
    errEmail: "Please enter a valid email address.",
    errConsent: "Please confirm that we may email you about Zenith AI.",
    wa: "Message us on WhatsApp",
    privacy: "We use these details only to contact you about Zenith AI.",
    privacyLink: "Privacy policy",
  },
  footnote: "Zenith AI Career Automation is a planned service from Zenith Dubai CV. The features, plans and terms on this page are proposals and may change before launch.",
};

type Copy = typeof EN;

const FR: Copy = {
  eyebrow: "Zenith AI · Automatisation de carrière",
  status: "En développement · liste de lancement ouverte",
  h2a: "Votre prochaine étape de carrière.",
  h2b: "Conçue avec précision.",
  lede: "Repérez les opportunités pertinentes. Personnalisez chaque candidature. Gardez votre carrière en mouvement, pendant que Zenith prend en charge les tâches répétitives.",
  positioning: "Concentrez-vous sur votre avenir. Nous automatisons la recherche.",
  support: "Votre carrière mérite mieux que des sites d'emploi sans fin, des formulaires répétitifs et des heures à réécrire la même candidature. Zenith AI vous aide à repérer les opportunités pertinentes, à préparer des candidatures personnalisées, à suivre vos envois et à piloter votre recherche depuis une seule plateforme intelligente.",
  ctaStart: "Lancer ma recherche avec l'IA",
  ctaHow: "Découvrir le fonctionnement",
  ctaPlans: "Voir les formules",
  statusNote: "Zenith AI est en cours de développement. Rien sur cette page n'est encore actif, à part la liste de lancement, et chaque fonction indique ce dont elle dépend : votre autorisation, une source prise en charge ou un canal employeur qui le permet.",
  orbit: {
    brand: "Zenith AI",
    preview: "Aperçu interactif · rien n'est connecté sur ces schémas",
    motion: { pause: "Mettre en pause", play: "Relancer l'animation" },
    engine: {
      index: "01", kicker: "Moteur de candidature IA", title: "Votre carrière, en mouvement.",
      body: "Votre profil devient la base d'une recherche d'emploi structurée et personnalisée, où chaque candidature est préparée autour de votre expérience et du poste visé.",
      aria: "Schéma : votre CV et votre profil de carrière alimentent Zenith AI, qui consulte des sources d'offres autorisées et prépare un dossier de candidature. Chaque candidature passe ensuite de préparée à validée par vous, puis envoyée une fois le canal d'envoi confirmé, puis réponse.",
      stagesLabel: "Étapes du flux",
      stages: [
        { label: "Profil", detail: "Votre CV et votre profil de carrière sont le point de départ : expérience, postes visés, pays, fourchette de salaire et employeurs à éviter." },
        { label: "Recherche", detail: "Les offres proviennent uniquement de sources dont les conditions le permettent, et chacune est évaluée selon votre profil. Trouver une offre n'est pas y postuler." },
        { label: "Préparation", detail: "Pour chaque poste adapté, Zenith AI rédige une note de CV sur mesure, une lettre de motivation et un message, à partir de votre expérience réelle uniquement." },
        { label: "Validation", detail: "Vous décidez : relisez chaque candidature avant son envoi, ou laissez vos propres règles les valider dans les limites que vous fixez." },
        { label: "Envoi et suivi", detail: "Une candidature n'est marquée envoyée que lorsque le canal d'envoi le confirme. Les réponses et entretiens sont suivis à part, quand les intégrations le permettent." },
      ],
      cv: "Votre CV", profile: "Profil de carrière",
      fields: ["Postes", "Pays", "Salaire", "Secteurs"],
      sources: "Sources d'offres autorisées",
      hubSub: "trouver · adapter · suivre",
      pack: "Dossier de candidature",
      sheets: ["CV adapté", "Lettre", "Message"],
      pipeline: { prepared: "Préparée", approved: "Validée par vous", submitted: "Envoyée", confirmed: "Confirmée", response: "Réponse" },
    },
    connect: {
      index: "02", kicker: "Votre recherche, connectée", title: "Un seul flux intelligent",
      body: "Réunissez les opportunités pertinentes, les documents de candidature personnalisés, les envois autorisés et les réponses dans un même flux cohérent.",
      aria: "Les connexions autour de Zenith AI. Sélectionnez-en une pour voir son rôle et ce dont elle dépend.",
      hubSub: "votre flux",
      nodes: [
        { id: "profile", title: "Votre profil", status: "Vous décidez", detail: "Postes visés, pays, secteurs, fourchette de salaire, employeurs à exclure et limite hebdomadaire. Vous pouvez tout modifier, ou mettre la campagne en pause, à tout moment." },
        { id: "email", title: "Votre e-mail", status: "Votre autorisation", detail: "Lorsqu'un employeur accepte les candidatures par e-mail, elles partent de votre propre adresse, connectée via l'authentification sécurisée de votre fournisseur (OAuth). Zenith ne demande jamais votre mot de passe, et vous pouvez retirer l'accès à tout moment." },
        { id: "sources", title: "Sources d'offres", status: "Sources autorisées", detail: "Les offres proviennent uniquement de sources dont les conditions le permettent : flux d'offres, pages carrières d'employeurs et API partenaires. Rien n'est collecté derrière une connexion." },
        { id: "portals", title: "Portails employeurs", status: "Selon les cas", detail: "Beaucoup d'employeurs utilisent leur propre système de candidature. Zenith AI n'envoie que par les canaux qui le permettent ; tout ce qui exige votre compte, un test ou un CAPTCHA vous revient sous forme de tâche." },
        { id: "tracker", title: "Suivi des candidatures", status: "En développement", detail: "Chaque candidature au même endroit : préparée, validée, envoyée une fois confirmée, et toute réponse visible avec votre autorisation." },
      ],
      choose: "Sélectionnez une autre connexion pour voir ce dont elle dépend.",
      revoke: "Retirer l'accès", reconnect: "Reconnecter", revoked: "Déconnecté · envois arrêtés",
      pauseCampaign: "Mettre la campagne en pause", resumeCampaign: "Reprendre la campagne", pausedNote: "En pause · rien n'est envoyé", pausedHub: "campagne en pause",
      handshake: ["Zenith AI demande", "Vous acceptez", "Connecté"],
    },
    intel: {
      index: "03", kicker: "Intelligence des candidatures", title: "Sachez où en est chaque candidature.",
      body: "Un aperçu du tableau de bord : ce qui a été préparé, ce qui a réellement été envoyé, puis les réponses et entretiens qui suivent, chacun compté à part.",
      badge: "Aperçu du produit · données d'exemple, pas des résultats clients",
      series: { prepared: "Préparées", submitted: "Envoyées", responses: "Réponses d'employeurs", interviews: "Entretiens" },
      week: (n: number) => `Semaine ${n}`, weekShort: (n: number) => `S${n}`,
      slider: "Semaine affichée",
      hint: "Survolez le graphique, ou sélectionnez-le et utilisez les flèches, pour lire chaque semaine.",
      showTable: "Afficher en tableau", hideTable: "Masquer le tableau",
      tableCaption: "Données d'exemple pour une seule campagne, par semaine. Pas des résultats clients.",
      weekCol: "Semaine",
      defs: {
        prepared: "Rédigée pour une offre précise. Rien n'a encore été envoyé.",
        submitted: "Envoyée, et confirmée par votre fournisseur de messagerie ou le système de l'employeur.",
        responses: "Une réponse de l'employeur, vue via votre e-mail connecté ou sa plateforme, ou ajoutée par vous.",
        interviews: "Un entretien planifié et noté dans votre tableau de bord.",
      },
    },
  },
  how: {
    eyebrow: "Fonctionnement",
    h: "Quatre étapes, bien distinctes.",
    steps: [
      { tag: "Vous fournissez", title: "Créez votre profil de carrière", body: "Importez votre CV et précisez votre expérience, les postes visés, vos lieux préférés, vos secteurs, vos attentes salariales et vos autres préférences." },
      { tag: "Recherche", title: "Repérez les opportunités pertinentes", body: "Le système trouve les offres adaptées dans des sources autorisées et évalue chacune selon votre profil et vos préférences. Trouver une offre n'est pas y postuler." },
      { tag: "Préparation", title: "Préparez des candidatures sur mesure", body: "L'IA rédige des recommandations de CV adaptées au poste, une lettre de motivation et un message de candidature, à partir de votre expérience réelle et des informations que vous validez." },
      { tag: "Envoi · suivi", title: "Envoyez et suivez", body: "Les candidatures ne partent que par des canaux autorisés et pris en charge. Chacune est marquée envoyée lorsque le canal le confirme ; réponses et entretiens sont suivis quand les intégrations le permettent." },
    ],
    note: "Trouvée, préparée, envoyée, obtenu une réponse : quatre choses différentes. Le tableau de bord ne confondra jamais l'une avec l'autre.",
  },
  control: {
    eyebrow: "Maîtrise du candidat",
    h1: "Votre nom. Vos décisions.",
    h2: "Votre autorisation.",
    lede: "Zenith AI n'agit pour vous que dans les limites que vous fixez. Votre identité, vos choix de carrière et votre e-mail restent les vôtres.",
    items: [
      { title: "Vous fixez les règles", body: "Choisissez postes, pays, secteurs, fourchette de salaire et employeurs à exclure. Fixez une limite hebdomadaire et, si vous le souhaitez, relisez chaque candidature avant son envoi." },
      { title: "Votre e-mail, sur autorisation", body: "Votre adresse est connectée via l'autorisation sécurisée de votre fournisseur de messagerie (OAuth). Nous ne demandons ni ne conservons jamais votre mot de passe." },
      { title: "Révocable à tout moment", body: "Déconnectez votre e-mail depuis votre tableau de bord Zenith ou depuis les paramètres de sécurité de votre fournisseur. Les envois s'arrêtent immédiatement." },
      { title: "Pause ou arrêt", body: "Mettez une campagne en pause ou arrêtez-la complètement. Rien n'est envoyé pendant la pause." },
      { title: "Aucun raccourci", body: "Zenith AI ne contournera ni CAPTCHA, ni test, ni contrôle de sécurité, et n'inventera ni expérience ni diplôme." },
    ],
    card: {
      title: "Ce que vous autoriseriez",
      may: "Zenith AI pourra",
      mayList: [
        "Envoyer les candidatures que vous permettez, depuis votre adresse connectée, aux employeurs qui acceptent les candidatures par e-mail",
        "Lire les réponses à ces candidatures, seulement si vous activez le suivi des réponses",
        "Garder une trace de chaque candidature dans votre tableau de bord",
      ],
      never: "Zenith AI ne fera jamais",
      neverList: [
        "Vous demander le mot de passe de votre messagerie",
        "Envoyer hors de vos postes, pays, exclusions ou limites",
        "Postuler chez un employeur que vous avez exclu",
        "Partager vos informations avec quiconque d'autre que l'employeur visé",
      ],
      revoke: "Pour retirer l'accès, déconnectez-vous dans votre tableau de bord ou dans les paramètres de sécurité de votre fournisseur. Les envois s'arrêtent aussitôt et vos dossiers restent jusqu'à ce que vous les supprimiez.",
    },
  },
  plans: {
    eyebrow: "Formules",
    h: "Choisissez l'ampleur de votre recherche.",
    lede: "Les prix seront publiés à l'ouverture du service. L'inscription à la liste de lancement est gratuite et ne vous engage à aucune formule.",
    price: "Prix",
    priceTbd: "Annoncé à l'ouverture",
    proposed: "Proposée",
    cta: "Rejoindre la liste",
    goldCta: "Manifester mon intérêt",
    countNote: "Les quotas ne comptent que les envois confirmés. Les brouillons jamais envoyés n'en consomment aucun.",
    checkoutNote: "Le paiement n'est pas ouvert : aucun règlement ne peut être pris pour ces formules avant la validation des prix et des conditions.",
    items: {
      starter: { name: "Starter", qty: "100", unit: "candidatures", for: "Pour démarrer une recherche d'emploi structurée.", features: ["Jusqu'à 100 candidatures envoyées", "Documents de candidature personnalisés", "Filtrage des offres pertinentes", "Suivi de l'activité, selon les intégrations"] },
      professional: { name: "Professionnel", qty: "500", unit: "candidatures", for: "Pour viser un éventail plus large d'opportunités adaptées.", features: ["Jusqu'à 500 candidatures envoyées", "Aide personnalisée pour le CV et la lettre", "Préférences de recherche configurables", "Historique et suivi des envois", "Suivi des réponses quand les intégrations le permettent"] },
      executive: { name: "Exécutif", qty: "1 000", unit: "candidatures", for: "Pour les profils expérimentés qui visent plusieurs marchés.", features: ["Jusqu'à 1 000 candidatures envoyées", "Préférences avancées de postes et de lieux", "Documents de candidature pour cadres dirigeants", "Traitement prioritaire, s'il est mis en place", "Analyses et suivi des candidatures"] },
      gold: { name: "Gold", qty: "Étendue", unit: "recherche de carrière", for: "Un service premium sur la durée, qui accompagne votre recherche pendant une période de service convenue.", features: ["Candidatures poursuivies sur une période de service convenue", "Usage raisonnable et éligibilité définis avant l'inscription", "Conditions de renouvellement convenues à l'avance", "Aucune promesse d'emploi ni d'entretien"], note: "Formule proposée : sa période de service, sa politique d'usage raisonnable, son éligibilité et ses conditions de renouvellement doivent être validées commercialement avant l'ouverture." },
    },
  },
  faq: {
    eyebrow: "Questions",
    h: "Des réponses franches.",
    lede: "Si quelque chose n'est pas clair, demandez-nous avant de vous inscrire. Vous verrez les conditions définitives avant tout paiement.",
    items: [
      { q: "Zenith garantit-il que je trouverai un emploi ?", a: "Non. Zenith AI peut vous aider à postuler plus régulièrement, avec des candidatures mieux préparées, mais ce sont les employeurs qui décident. Aucune formule ne garantit d'entretien, d'offre ni d'emploi." },
      { q: "Puis-je utiliser ma propre adresse e-mail ?", a: "Oui, c'est le principe. Lorsqu'un employeur accepte les candidatures par e-mail, elles partent de votre propre adresse, après connexion via l'autorisation sécurisée de votre fournisseur. Nous ne demandons jamais votre mot de passe et vous pouvez vous déconnecter à tout moment." },
      { q: "Les candidatures seront-elles personnalisées pour chaque poste ?", a: "Oui. Chaque candidature est préparée pour le poste visé à partir de votre expérience réelle et des informations que vous validez. Rien n'est inventé, et vous pouvez choisir de relire chaque candidature avant son envoi." },
      { q: "Puis-je choisir les pays, les entreprises et les postes visés ?", a: "Oui. Vous fixez les postes, les pays, les secteurs et la fourchette de salaire, listez les employeurs à exclure et plafonnez le nombre de candidatures envoyées chaque semaine." },
      { q: "Comment suivre mes candidatures et les réponses des employeurs ?", a: "Votre tableau de bord listera chaque candidature avec son statut : préparée, validée, envoyée (seulement après confirmation du canal) et toute réponse. Les réponses sont suivies lorsque votre connexion e-mail ou la plateforme de l'employeur les rend visibles, et vous pouvez en ajouter vous-même." },
      { q: "Que se passe-t-il si une entreprise exige un CAPTCHA, un test ou une vérification ?", a: "Zenith AI ne les contournera pas. La candidature vous revient pour que vous la terminiez vous-même, ou elle est ignorée. Elle n'est comptée comme envoyée que lorsqu'elle l'est réellement." },
      { q: "Puis-je mettre ma campagne en pause ou l'arrêter ?", a: "Oui, à tout moment. Rien n'est envoyé pendant une pause, et l'arrêt met fin à tous les envois." },
      { q: "Comment mes données personnelles sont-elles protégées ?", a: "Vos informations servent uniquement à mener votre recherche et ne sont transmises à un employeur que lorsqu'une candidature que vous avez autorisée est envoyée. Vous pouvez demander la suppression de vos données. Les conditions complètes de confidentialité et de traitement seront publiées avant l'ouverture." },
      { q: "Que se passe-t-il quand mon quota de candidatures est épuisé ?", a: "Les envois s'arrêtent. Vos dossiers restent accessibles et vous choisissez de prolonger ou de changer de formule. Les brouillons jamais envoyés ne sont pas décomptés." },
      { q: "Quand puis-je commencer ?", a: "Zenith AI est en développement. Rejoignez la liste de lancement : nous vous écrirons à l'ouverture. L'inscription est gratuite et ne vous engage à rien." },
    ],
  },
  join: {
    eyebrow: "Liste de lancement",
    h: "Soyez parmi les premiers à l'ouverture.",
    lede: "Dites-nous ce que vous recherchez et nous vous contacterons à l'ouverture. L'inscription ne crée aucun compte, ne lance aucune campagne et n'envoie aucune candidature.",
    nextTitle: "Et ensuite",
    next: [
      "Nous confirmons votre inscription.",
      "À l'ouverture, nous vous invitons à créer votre profil et à connecter votre e-mail, seulement si vous le souhaitez.",
      "Vous voyez les prix et conditions définitifs avant de payer quoi que ce soit.",
    ],
    email: "E-mail", name: "Nom complet", optional: "facultatif",
    roles: "Postes visés", rolesPh: "ex. Directeur d'hôtel, Directeur F&B",
    countries: "Pays visés", countriesPh: "ex. Émirats arabes unis, Arabie saoudite, Qatar",
    plan: "Formule envisagée", unsure: "Je ne sais pas encore",
    consent: "Zenith Dubai CV peut m'écrire au sujet de Zenith AI. Je comprends que cela ne lance aucune recherche et ne m'engage à aucune formule.",
    submit: "Rejoindre la liste", sending: "Envoi…",
    okTitle: "Vous êtes inscrit.",
    okBody: "Nous écrirons à {email} à l'ouverture. Rien n'a été envoyé ni soumis en votre nom.",
    err: "L'envoi a échoué. Réessayez, ou contactez-nous directement :",
    errEmail: "Saisissez une adresse e-mail valide.",
    errConsent: "Confirmez que nous pouvons vous écrire au sujet de Zenith AI.",
    wa: "Nous écrire sur WhatsApp",
    privacy: "Ces informations servent uniquement à vous contacter au sujet de Zenith AI.",
    privacyLink: "Politique de confidentialité",
  },
  footnote: "Zenith AI · Automatisation de carrière est un service en projet de Zenith Dubai CV. Les fonctions, formules et conditions présentées ici sont des propositions et peuvent évoluer avant le lancement.",
};

const AR: Copy = {
  eyebrow: "Zenith AI · أتمتة المسار المهني",
  status: "قيد التطوير · قائمة الإطلاق مفتوحة",
  h2a: "خطوتك المهنية التالية.",
  h2b: "مُصمَّمة بإتقان.",
  lede: "اكتشف الفرص المناسبة. خصّص كل طلب توظيف. وأبقِ مسيرتك في حركة مستمرة، بينما تتولى زينيث الأعمال المتكررة.",
  positioning: "ركّز على مستقبلك، ونحن نؤتمت البحث.",
  support: "مسيرتك تستحق أكثر من مواقع توظيف لا تنتهي، ونماذج تقديم متكررة، وساعات في إعادة كتابة الطلب نفسه. يساعدك Zenith AI على اكتشاف الفرص المناسبة، وإعداد طلبات مخصصة، وتتبّع ما أُرسل، وإدارة بحثك عن عمل من منصة ذكية واحدة.",
  ctaStart: "ابدأ بحثك الوظيفي بالذكاء الاصطناعي",
  ctaHow: "اكتشف كيف يعمل",
  ctaPlans: "اطّلع على الباقات",
  statusNote: "يجري تطوير Zenith AI الآن. لا شيء في هذه الصفحة مفعَّل بعد سوى قائمة الإطلاق، وكل ميزة توضّح ما تعتمد عليه: إذنك، أو مصدر مدعوم، أو قناة لدى صاحب العمل تسمح بذلك.",
  orbit: {
    brand: "Zenith AI",
    preview: "معاينة تفاعلية · لا شيء في هذه المخططات متصل فعلياً",
    motion: { pause: "إيقاف الحركة", play: "تشغيل الحركة" },
    engine: {
      index: "01", kicker: "محرّك الطلبات الذكي", title: "مسيرتك. في حركة.",
      body: "يصبح ملفك الأساس لبحث وظيفي منظَّم ومخصَّص، يُعَدّ فيه كل طلب حول خبرتك والوظيفة التي تستهدفها.",
      aria: "مخطط: سيرتك الذاتية وملفك المهني يدخلان إلى Zenith AI، الذي يقرأ مصادر الوظائف المدعومة ويُعِدّ ملف التقديم، ثم ينتقل كل طلب من الإعداد إلى موافقتك، ثم الإرسال عند تأكيد القناة، ثم الردّ.",
      stagesLabel: "مراحل المسار",
      stages: [
        { label: "الملف", detail: "سيرتك الذاتية وملفك المهني هما نقطة البداية: خبرتك والوظائف المستهدفة والدول ونطاق الراتب وجهات العمل التي تريد تجنّبها." },
        { label: "الاكتشاف", detail: "تأتي الفرص فقط من مصادر مدعومة تسمح شروطها بذلك، ويُقيَّم كل منها وفق ملفك. إيجاد الوظيفة لا يعني التقديم عليها." },
        { label: "الإعداد", detail: "لكل وظيفة مناسبة، يصوغ Zenith AI ملاحظات مخصصة للسيرة الذاتية وخطاب تقديم ورسالة، اعتماداً على خبرتك الحقيقية فقط." },
        { label: "الموافقة", detail: "القرار لك: راجع كل طلب قبل إرساله، أو دع قواعدك أنت توافق عليه ضمن الحدود التي تضعها." },
        { label: "الإرسال والمتابعة", detail: "لا يُعلَّم الطلب مُرسَلاً إلا عندما تؤكد قناة الإرسال ذلك، وتُسجَّل ردود أصحاب العمل والمقابلات بشكل منفصل حيثما تسمح التكاملات." },
      ],
      cv: "سيرتك الذاتية", profile: "الملف المهني",
      fields: ["الوظائف", "الدول", "الراتب", "القطاعات"],
      sources: "مصادر وظائف مدعومة",
      hubSub: "مطابقة · تخصيص · متابعة",
      pack: "ملف التقديم",
      sheets: ["سيرة مخصصة", "خطاب تقديم", "رسالة"],
      pipeline: { prepared: "أُعِدّ", approved: "وافقتَ عليه", submitted: "أُرسل", confirmed: "مؤكَّد", response: "ردّ" },
    },
    connect: {
      index: "02", kicker: "بحثك الوظيفي، متصلاً", title: "مسار ذكي واحد",
      body: "نظّم الفرص المناسبة، ومواد التقديم المخصصة، والإرسال المأذون به، والردود، في مسار مهني واحد متماسك.",
      aria: "الاتصالات حول Zenith AI. اختر أحدها لترى ما يفعله وما يعتمد عليه.",
      hubSub: "مسارك",
      nodes: [
        { id: "profile", title: "ملفك", status: "القرار لك", detail: "الوظائف المستهدفة والدول والقطاعات ونطاق الراتب وجهات العمل المستبعدة وسقف أسبوعي. يمكنك تعديل أيٍّ منها، أو إيقاف الحملة مؤقتاً، في أي وقت." },
        { id: "email", title: "بريدك الإلكتروني", status: "بإذن منك", detail: "حين يقبل صاحب العمل الطلبات عبر البريد، تُرسَل من عنوانك أنت بعد ربطه عبر تسجيل الدخول الآمن لدى مزوّد بريدك (OAuth). لا تطلب زينيث كلمة مرورك أبداً، ويمكنك سحب الإذن في أي وقت." },
        { id: "sources", title: "مصادر الوظائف", status: "مصادر مدعومة", detail: "تأتي الفرص فقط من مصادر تسمح شروطها بذلك، مثل خلاصات الوظائف وصفحات التوظيف لدى أصحاب العمل وواجهات الشركاء البرمجية. لا يُجمع شيء من خلف تسجيل الدخول." },
        { id: "portals", title: "بوابات أصحاب العمل", status: "حيثما أمكن", detail: "يستخدم كثير من أصحاب العمل أنظمة تقديم خاصة بهم. لا يرسل Zenith AI إلا عبر القنوات التي تسمح بذلك، وكل ما يتطلب حسابك أو اختباراً أو CAPTCHA يعود إليك كمهمة." },
        { id: "tracker", title: "متتبّع الطلبات", status: "قيد التطوير", detail: "كل طلب في مكان واحد: أُعِدّ، ووافقتَ عليه، وأُرسل بعد التأكيد، وأي ردّ يمكننا رؤيته بإذنك." },
      ],
      choose: "اختر اتصالاً آخر لترى ما يعتمد عليه.",
      revoke: "سحب الإذن", reconnect: "إعادة الربط", revoked: "غير متصل · توقف الإرسال",
      pauseCampaign: "إيقاف الحملة مؤقتاً", resumeCampaign: "استئناف الحملة", pausedNote: "متوقفة · لا يُرسَل شيء", pausedHub: "الحملة متوقفة",
      handshake: ["Zenith AI يطلب", "أنت توافق", "متصل"],
    },
    intel: {
      index: "03", kicker: "ذكاء الطلبات", title: "اعرف أين يقف كل طلب.",
      body: "معاينة للوحة التحكم: ما أُعِدّ، وما أُرسل فعلاً، ثم الردود والمقابلات التي تليها، وكلٌّ منها يُحتسب على حدة.",
      badge: "معاينة للمنتج · بيانات توضيحية وليست نتائج عملاء",
      series: { prepared: "أُعِدّت", submitted: "أُرسلت", responses: "ردود أصحاب العمل", interviews: "مقابلات" },
      week: (n: number) => `الأسبوع ${n}`, weekShort: (n: number) => `${n}`,
      slider: "الأسبوع المعروض",
      hint: "مرّر فوق الرسم، أو اختره واستخدم مفاتيح الأسهم، لقراءة أي أسبوع.",
      showTable: "عرض كجدول", hideTable: "إخفاء الجدول",
      tableCaption: "بيانات توضيحية لحملة واحدة حسب الأسبوع، وليست نتائج عملاء.",
      weekCol: "الأسبوع",
      defs: {
        prepared: "أُعِدّ لفرصة محددة، ولم يُرسَل شيء بعد.",
        submitted: "أُرسل، وأكّد ذلك مزوّد بريدك أو نظام صاحب العمل.",
        responses: "ردّ من صاحب العمل يظهر عبر بريدك المربوط أو منصته، أو تسجّله بنفسك.",
        interviews: "مقابلة مُجدولة ومسجّلة في لوحة تحكمك.",
      },
    },
  },
  how: {
    eyebrow: "كيف يعمل",
    h: "أربع خطوات، لكلٍّ منها حدودها.",
    steps: [
      { tag: "ما تقدّمه أنت", title: "أنشئ ملفك المهني", body: "حمّل سيرتك الذاتية وحدّد خبرتك والوظائف المستهدفة والمواقع المفضلة والقطاعات وتوقعات الراتب وغيرها من التفضيلات." },
      { tag: "الاكتشاف", title: "اكتشف الفرص المناسبة", body: "يجد النظام الوظائف الملائمة في مصادر مدعومة ويقيّم كلاً منها وفق ملفك وتفضيلاتك. إيجاد الوظيفة لا يعني التقديم عليها." },
      { tag: "الإعداد", title: "أعِدّ طلبات مخصصة", body: "يصوغ الذكاء الاصطناعي توصيات للسيرة الذاتية تناسب الوظيفة، وخطاب تقديم، ورسالة طلب، اعتماداً على خبرتك الحقيقية والمعلومات التي توافق عليها." },
      { tag: "الإرسال · المتابعة", title: "أرسِل وتابِع", body: "لا تُرسَل الطلبات إلا عبر قنوات مدعومة ومأذون بها. يُعلَّم كل طلب مُرسَلاً حين تؤكد القناة ذلك، وتُتابَع الردود والمقابلات حيثما تسمح التكاملات." },
    ],
    note: "الإيجاد والإعداد والإرسال وتلقي الرد أربعة أمور مختلفة، ولن تخلط لوحة التحكم بينها أبداً.",
  },
  control: {
    eyebrow: "تحكّم المرشّح",
    h1: "اسمك. قراراتك.",
    h2: "إذنك.",
    lede: "لا يعمل Zenith AI نيابةً عنك إلا ضمن الحدود التي تضعها. هويتك وخياراتك المهنية وبريدك الإلكتروني تبقى ملكك.",
    items: [
      { title: "أنت تضع القواعد", body: "اختر الوظائف والدول والقطاعات ونطاق الراتب وجهات العمل التي تريد استبعادها. حدّد سقفاً أسبوعياً، وراجع الطلبات قبل إرسالها إن شئت." },
      { title: "بريدك، بإذنك", body: "يُربط عنوانك عبر التفويض الآمن لدى مزوّد بريدك (OAuth). لا نطلب كلمة مرور بريدك ولا نحتفظ بها أبداً." },
      { title: "سحب الإذن في أي وقت", body: "افصل بريدك من لوحة تحكم زينيث أو من إعدادات الأمان لدى مزوّد بريدك، فيتوقف الإرسال فوراً." },
      { title: "إيقاف مؤقت أو نهائي", body: "أوقف الحملة مؤقتاً أو أنهِها تماماً. لا يُرسَل شيء أثناء الإيقاف." },
      { title: "بلا طرق ملتوية", body: "لن يتجاوز Zenith AI اختبارات CAPTCHA أو التقييمات أو إجراءات الأمان، ولن يختلق خبرات أو مؤهلات." },
    ],
    card: {
      title: "ما ستأذن به",
      may: "يمكن لـ Zenith AI",
      mayList: [
        "إرسال الطلبات التي تسمح بها، من عنوانك المربوط، إلى أصحاب العمل الذين يقبلون التقديم بالبريد",
        "قراءة الردود على تلك الطلبات، فقط إذا فعّلتَ تتبّع الردود",
        "الاحتفاظ بسجلّ لكل طلب في لوحة تحكمك",
      ],
      never: "لن يقوم Zenith AI أبداً بـ",
      neverList: [
        "طلب كلمة مرور بريدك",
        "الإرسال خارج الوظائف أو الدول أو الاستثناءات أو الحدود التي وضعتها",
        "التقديم لدى جهة عمل استبعدتها",
        "مشاركة بياناتك مع أي طرف غير صاحب العمل الذي تتقدم إليه",
      ],
      revoke: "لسحب الإذن، افصل الربط من لوحة تحكمك أو من إعدادات الأمان لدى مزوّد بريدك. يتوقف الإرسال فوراً، وتبقى سجلاتك حتى تحذفها.",
    },
  },
  plans: {
    eyebrow: "الباقات",
    h: "اختر حجم بحثك.",
    lede: "ستُعلَن الأسعار عند افتتاح الخدمة. الانضمام إلى قائمة الإطلاق مجاني ولا يُلزمك بأي باقة.",
    price: "السعر",
    priceTbd: "يُعلَن عند الإطلاق",
    proposed: "مقترحة",
    cta: "انضم إلى قائمة الإطلاق",
    goldCta: "سجّل اهتمامك",
    countNote: "لا يُحتسب من الرصيد إلا الإرسال المؤكَّد، والمسودات التي لم تُرسَل لا تُخصم منه.",
    checkoutNote: "الدفع غير مفتوح: لا يمكن تحصيل أي مبلغ مقابل هذه الباقات قبل اعتماد الأسعار والشروط.",
    items: {
      starter: { name: "البداية", qty: "100", unit: "طلب", for: "لمن يبدأ بحثاً وظيفياً منظّماً.", features: ["حتى 100 طلب مُرسَل", "مواد تقديم مخصصة", "تصفية الوظائف حسب الملاءمة", "تتبّع نشاط الطلبات حيثما أمكن"] },
      professional: { name: "الاحترافية", qty: "500", unit: "طلب", for: "لمن يسعى إلى نطاق أوسع من الفرص المناسبة.", features: ["حتى 500 طلب مُرسَل", "مساعدة مخصصة في السيرة الذاتية وخطاب التقديم", "تفضيلات بحث قابلة للضبط", "سجلّ الإرسال والمتابعة", "تتبّع الردود حيثما تسمح التكاملات"] },
      executive: { name: "التنفيذية", qty: "1,000", unit: "طلب", for: "لأصحاب الخبرة الذين يستهدفون فرصاً في أسواق متعددة.", features: ["حتى 1,000 طلب مُرسَل", "تفضيلات متقدمة للوظائف والمواقع", "مواد تقديم مصممة للمناصب التنفيذية", "معالجة ذات أولوية، إن تم تطبيقها", "تحليلات الطلبات ومتابعتها"] },
      gold: { name: "الذهبية", qty: "ممتدّ", unit: "بحث مهني", for: "خدمة مميزة طويلة الأمد تدعم بحثك عن عمل خلال فترة خدمة متفق عليها.", features: ["استمرار الطلبات خلال فترة خدمة متفق عليها", "حدود استخدام عادل وشروط أهلية تُحدَّد قبل انضمامك", "شروط تجديد أو تمديد يُتفق عليها مسبقاً", "لا وعد بوظيفة أو مقابلات"], note: "باقة مقترحة: تحتاج فترة الخدمة وسياسة الاستخدام العادل وشروط الأهلية والتجديد إلى اعتماد تجاري قبل إطلاقها." },
    },
  },
  faq: {
    eyebrow: "أسئلة",
    h: "إجابات صريحة.",
    lede: "إن كان أي شيء هنا غير واضح، اسألنا قبل الانضمام. سترى الشروط النهائية قبل أن تدفع أي شيء.",
    items: [
      { q: "هل تضمن زينيث حصولي على وظيفة؟", a: "لا. يمكن لـ Zenith AI أن يساعدك على التقديم بانتظام أكبر وبطلبات أفضل إعداداً، لكن قرار التوظيف يعود لأصحاب العمل. لا تضمن أي باقة مقابلات أو عروضاً أو وظيفة." },
      { q: "هل يمكنني استخدام بريدي الإلكتروني الخاص؟", a: "نعم، فهذا أساس التصميم. حين يقبل صاحب العمل الطلبات بالبريد، تُرسَل من عنوانك أنت بعد ربطه عبر التفويض الآمن لدى مزوّد بريدك. لا نطلب كلمة مرورك أبداً، ويمكنك فصل الربط في أي وقت." },
      { q: "هل ستكون الطلبات مخصصة لكل وظيفة؟", a: "نعم. يُعَدّ كل طلب للوظيفة المحددة اعتماداً على خبرتك الحقيقية والمعلومات التي توافق عليها. لا شيء مختلق، ويمكنك اختيار مراجعة كل طلب قبل إرساله." },
      { q: "هل يمكنني اختيار الدول والشركات والوظائف التي أستهدفها؟", a: "نعم. تحدّد الوظائف والدول والقطاعات ونطاق الراتب، وتضع قائمة بجهات العمل المستبعدة، وسقفاً لعدد الطلبات المرسلة كل أسبوع." },
      { q: "كيف أتابع طلباتي وردود أصحاب العمل؟", a: "ستعرض لوحة تحكمك كل طلب بحالته: أُعِدّ، ووافقتَ عليه، وأُرسل (فقط بعد تأكيد القناة)، وأي ردّ. تُتتبَّع الردود حين يجعلها ربط بريدك أو منصة صاحب العمل مرئية، ويمكنك تسجيل غيرها بنفسك." },
      { q: "ماذا يحدث إذا طلبت شركة اختبار CAPTCHA أو تقييماً أو تحققاً إضافياً؟", a: "لن يتجاوزها Zenith AI. يعود الطلب إليك لتكمله بنفسك، أو يُتخطّى، ولا يُحتسب مُرسَلاً حتى يُرسَل فعلاً." },
      { q: "هل يمكنني إيقاف حملتي مؤقتاً أو إنهاؤها؟", a: "نعم، في أي وقت. لا يُرسَل شيء أثناء الإيقاف المؤقت، والإنهاء يوقف كل الإرسال." },
      { q: "كيف تُحمى معلوماتي الشخصية؟", a: "تُستخدم بياناتك فقط لإدارة بحثك، ولا تُشارَك مع صاحب عمل إلا عند إرسال طلب سمحتَ به. يمكنك طلب حذف بياناتك، وستُنشر شروط الخصوصية ومعالجة البيانات كاملة قبل فتح التسجيل." },
      { q: "ماذا يحدث عند نفاد رصيد طلباتي؟", a: "يتوقف الإرسال، وتبقى سجلاتك متاحة، ولك أن تختار التمديد أو تغيير الباقة. المسودات التي لم تُرسَل لا تُخصم من الرصيد." },
      { q: "متى يمكنني البدء؟", a: "Zenith AI قيد التطوير. انضم إلى قائمة الإطلاق وسنراسلك عند فتح التسجيل. الانضمام مجاني ولا يُلزمك بشيء." },
    ],
  },
  join: {
    eyebrow: "قائمة الإطلاق",
    h: "كن من الأوائل عند إطلاق Zenith AI.",
    lede: "أخبرنا بما تبحث عنه وسنتواصل معك عند فتح التسجيل. الانضمام لا ينشئ حساباً ولا يبدأ حملة ولا يرسل أي طلب.",
    nextTitle: "ما الخطوة التالية",
    next: [
      "نؤكد تسجيلك في القائمة.",
      "عند فتح التسجيل، ندعوك لإنشاء ملفك وربط بريدك، فقط إن رغبت.",
      "ترى الأسعار والشروط النهائية قبل أن تدفع أي شيء.",
    ],
    email: "البريد الإلكتروني", name: "الاسم الكامل", optional: "اختياري",
    roles: "الوظائف المستهدفة", rolesPh: "مثال: مدير عام فندق، مدير الأغذية والمشروبات",
    countries: "الدول المستهدفة", countriesPh: "مثال: الإمارات، السعودية، قطر",
    plan: "الباقة التي تفكر فيها", unsure: "لم أقرر بعد",
    consent: "أوافق على أن تراسلني زينيث دبي سي في بشأن Zenith AI، وأدرك أن ذلك لا يبدأ بحثاً وظيفياً ولا يُلزمني بأي باقة.",
    submit: "انضم إلى قائمة الإطلاق", sending: "جارٍ الإرسال…",
    okTitle: "أصبحتَ على القائمة.",
    okBody: "سنراسلك على {email} عند فتح التسجيل. لم يُرسَل أي شيء ولم يُقدَّم أي طلب نيابةً عنك.",
    err: "تعذّر الإرسال. حاول مرة أخرى، أو تواصل معنا مباشرة:",
    errEmail: "أدخل بريداً إلكترونياً صحيحاً.",
    errConsent: "يرجى تأكيد موافقتك على مراسلتك بشأن Zenith AI.",
    wa: "راسلنا عبر واتساب",
    privacy: "نستخدم هذه البيانات فقط للتواصل معك بشأن Zenith AI.",
    privacyLink: "سياسة الخصوصية",
  },
  footnote: "Zenith AI لأتمتة المسار المهني خدمة مخطط لها من زينيث دبي سي في. الميزات والباقات والشروط في هذه الصفحة مقترحات وقد تتغير قبل الإطلاق.",
};

const COPY: Record<Lang, Copy> = { en: EN, fr: FR, ar: AR };

/* ------------------------------------------------------------------------------------------------ bits */

function Rise({ children, d = 0, className }: { children: React.ReactNode; d?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: d }}>
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, color, isAr }: { children: React.ReactNode; color: string; isAr: boolean }) {
  return <p className="text-[9.5px] font-medium uppercase" style={{ color, fontFamily: isAr ? "inherit" : "sans-serif", letterSpacing: isAr ? "0.04em" : "0.36em" }}>{children}</p>;
}

/* ------------------------------------------------------------------------------------------------ section */

export default function AICareerAutomation({ dark, lang, whatsappHref, currency = "AED", rates }: {
  dark: boolean; lang: Lang; whatsappHref: string; currency?: Currency; rates?: Rates;
}) {
  const t = COPY[lang];
  const isAr = lang === "ar";
  const ui = isAr ? "inherit" : "sans-serif";
  const th = dark
    ? { hi: "#EDE8E0", sub: "#A3988C", faint: "#7A6E66", line: "rgba(255,255,255,0.08)", card: "rgba(255,255,255,0.02)", raise: "#12100D", gold: G, goldText: "#D9BD84", field: "rgba(255,255,255,0.03)" }
    : { hi: "#1A1410", sub: "#665B52", faint: "#8A7E74", line: "rgba(0,0,0,0.09)", card: "rgba(255,255,255,0.7)", raise: "#FFFFFF", gold: G, goldText: "#7E5F22", field: "rgba(0,0,0,0.025)" };

  // The launch list: every call to action on the section leads here.
  const [plan, setPlan] = React.useState<"" | ZenithAIPlanId>("");
  const emailRef = React.useRef<HTMLInputElement>(null);
  const openJoin = (p?: ZenithAIPlanId) => {
    if (p) setPlan(p);
    const el = document.getElementById("zenith-ai-join");
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => emailRef.current?.focus({ preventScroll: true }), reduce ? 0 : 650);
  };

  const [open, setOpen] = React.useState<number | null>(0);

  const btnBase = "inline-flex items-center justify-center gap-2.5 h-[50px] px-8 rounded-full text-[10px] font-medium uppercase transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E] focus-visible:ring-offset-2";
  const track = isAr ? "0.04em" : "0.2em";
  const arrow = { transform: isAr ? "scaleX(-1)" : "none" };

  return (
    <section id="zenith-ai" aria-labelledby="zai-title" className="relative py-28 sm:py-36 px-5 sm:px-8 scroll-mt-20" style={{ borderTop: `1px solid ${th.line}` }}>
      <MotionConfig reducedMotion="user">
        <div className="mx-auto max-w-[1320px]">

          {/* A · Introduction */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
            <Rise>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-7">
                <span className="inline-flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={ZENITH_MARK} fill={G} /></svg>
                  <Eyebrow color={dark ? `${G}CC` : th.goldText} isAr={isAr}>{t.eyebrow}</Eyebrow>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px]" style={{ border: `1px solid ${th.line}`, color: th.sub, fontFamily: ui, letterSpacing: isAr ? 0 : "0.04em" }}>
                  <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: G, boxShadow: `0 0 0 3px ${G}26` }} />{t.status}
                </span>
              </div>
              <h2 id="zai-title" className="font-normal tracking-tight" style={{ color: th.hi, fontSize: "clamp(38px, 5.4vw, 70px)", lineHeight: isAr ? 1.35 : 1.04, letterSpacing: isAr ? 0 : "-0.025em" }}>
                {t.h2a}<br /><em style={{ fontStyle: "italic", color: G }}>{t.h2b}</em>
              </h2>
            </Rise>
            <Rise d={0.08}>
              <p className="text-[16.5px] leading-[1.75] max-w-xl" style={{ color: th.hi, fontFamily: ui, fontWeight: 300 }}>{t.lede}</p>
              <p className="mt-5 text-[19px] italic" style={{ color: th.goldText }}>{t.positioning}</p>
              <p className="mt-4 text-[14px] leading-[1.9] max-w-xl" style={{ color: th.sub, fontFamily: ui }}>{t.support}</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={() => openJoin()} className={btnBase + " hover:opacity-90"} style={{ background: G, color: INK, fontFamily: ui, letterSpacing: track, boxShadow: `0 6px 28px ${G}2E` }}>
                  {t.ctaStart}<ArrowRight size={12} strokeWidth={1.8} aria-hidden="true" style={arrow} />
                </button>
                <a href="#zenith-ai-how" className={btnBase + " hover:opacity-70"} style={{ border: `1px solid ${G}55`, color: dark ? G : th.goldText, fontFamily: ui, letterSpacing: track }}>{t.ctaHow}</a>
              </div>
              <a href="#zenith-ai-plans" className="mt-5 inline-flex items-center gap-2 text-[12px] underline-offset-4 hover:underline" style={{ color: th.sub, fontFamily: ui }}>
                {t.ctaPlans}<ArrowDown size={12} strokeWidth={1.6} aria-hidden="true" />
              </a>
            </Rise>
          </div>

          <Rise className="mt-12">
            <p className="flex items-start gap-3 px-4 py-3.5 text-[12.5px] leading-[1.7]" style={{ border: `1px solid ${th.line}`, background: th.card, color: th.sub, fontFamily: ui }}>
              <Info size={14} strokeWidth={1.6} className="mt-0.5 shrink-0" style={{ color: G }} aria-hidden="true" />{t.statusNote}
            </p>
          </Rise>

          {/* B · The drawings */}
          <div className="mt-10">
            <InkOrbitFeatures copy={t.orbit} data={ZENITH_AI_SAMPLE_WEEKS} tone={dark ? "dark" : "light"} dir={isAr ? "rtl" : "ltr"} />
          </div>

          {/* C · How it works */}
          <div id="zenith-ai-how" className="mt-28 sm:mt-36 scroll-mt-24">
            <Rise className="mb-12">
              <Eyebrow color={dark ? `${G}AA` : th.goldText} isAr={isAr}>{t.how.eyebrow}</Eyebrow>
              <h3 className="mt-5 text-[30px] sm:text-[42px] font-normal tracking-tight" style={{ color: th.hi, lineHeight: isAr ? 1.4 : 1.12 }}>{t.how.h}</h3>
            </Rise>
            <ol className="grid sm:grid-cols-2 xl:grid-cols-4" style={{ borderTop: `1px solid ${th.line}`, listStyle: "none", padding: 0, margin: 0 }}>
              {t.how.steps.map((s, i) => (
                <li key={s.title} style={{ borderBottom: `1px solid ${th.line}`, borderInlineEnd: `1px solid ${th.line}` }}>
                  <Rise d={0.06 * i} className="h-full p-8 lg:p-9 flex flex-col">
                    <div className="flex items-center gap-4 mb-9">
                      <span className="font-mono text-[11px]" style={{ color: th.goldText }}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 h-px" style={{ background: `linear-gradient(${isAr ? "to left" : "to right"}, ${G}55, transparent)` }} />
                    </div>
                    <h4 className="text-[21px] font-normal leading-snug mb-4" style={{ color: th.hi }}>{s.title}</h4>
                    <p className="text-[13.5px] leading-[1.85] mb-8" style={{ color: th.sub, fontFamily: ui }}>{s.body}</p>
                    <p className="mt-auto text-[9.5px] uppercase" style={{ color: th.goldText, fontFamily: ui, letterSpacing: isAr ? 0 : "0.18em" }}>{s.tag}</p>
                  </Rise>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex items-start gap-3 text-[13px] leading-[1.7] max-w-3xl" style={{ color: th.sub, fontFamily: ui }}>
              <span aria-hidden="true" className="mt-[9px] h-px w-6 shrink-0" style={{ background: G }} />{t.how.note}
            </p>
          </div>

          {/* D · Candidate control */}
          <div id="zenith-ai-control" className="mt-28 sm:mt-36 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16 scroll-mt-24">
            <div>
              <Rise>
                <Eyebrow color={dark ? `${G}AA` : th.goldText} isAr={isAr}>{t.control.eyebrow}</Eyebrow>
                <h3 className="mt-5 text-[30px] sm:text-[42px] font-normal tracking-tight" style={{ color: th.hi, lineHeight: isAr ? 1.4 : 1.12 }}>
                  {t.control.h1}<br /><em style={{ fontStyle: "italic", color: G }}>{t.control.h2}</em>
                </h3>
                <p className="mt-5 text-[14.5px] leading-[1.85] max-w-xl" style={{ color: th.sub, fontFamily: ui }}>{t.control.lede}</p>
              </Rise>
              <ul className="mt-10" style={{ listStyle: "none", padding: 0, borderTop: `1px solid ${th.line}` }}>
                {t.control.items.map((it, i) => {
                  const Icon = [SlidersHorizontal, KeyRound, Undo2, PauseCircle, ShieldCheck][i];
                  return (
                    <li key={it.title} className="flex gap-5 py-6" style={{ borderBottom: `1px solid ${th.line}` }}>
                      <span className="mt-0.5 inline-grid place-items-center size-9 shrink-0" style={{ border: `1px solid ${th.line}`, color: G }}><Icon size={15} strokeWidth={1.5} aria-hidden="true" /></span>
                      <div>
                        <p className="text-[17px]" style={{ color: th.hi }}>{it.title}</p>
                        <p className="mt-1.5 text-[13.5px] leading-[1.8]" style={{ color: th.sub, fontFamily: ui }}>{it.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Rise d={0.1} className="self-start lg:sticky lg:top-28 lg:mt-24">
              <div className="relative p-7 sm:p-9" style={{ border: `1px solid ${dark ? `${G}40` : `${G}66`}`, background: th.raise }}>
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${G}, transparent)` }} />
                <p className="text-[22px]" style={{ color: th.hi }}>{t.control.card.title}</p>
                <p className="mt-7 text-[9.5px] uppercase" style={{ color: th.goldText, fontFamily: ui, letterSpacing: isAr ? 0 : "0.2em" }}>{t.control.card.may}</p>
                <ul className="mt-3 space-y-3" style={{ listStyle: "none", padding: 0 }}>
                  {t.control.card.mayList.map(x => (
                    <li key={x} className="flex gap-3 text-[13.5px] leading-[1.7]" style={{ color: th.hi, fontFamily: ui }}><Check size={14} strokeWidth={2} className="mt-1 shrink-0" style={{ color: G }} aria-hidden="true" />{x}</li>
                  ))}
                </ul>
                <p className="mt-8 text-[9.5px] uppercase" style={{ color: th.goldText, fontFamily: ui, letterSpacing: isAr ? 0 : "0.2em" }}>{t.control.card.never}</p>
                <ul className="mt-3 space-y-3" style={{ listStyle: "none", padding: 0 }}>
                  {t.control.card.neverList.map(x => (
                    <li key={x} className="flex gap-3 text-[13.5px] leading-[1.7]" style={{ color: th.hi, fontFamily: ui }}><X size={14} strokeWidth={2} className="mt-1 shrink-0" style={{ color: th.faint }} aria-hidden="true" />{x}</li>
                  ))}
                </ul>
                <p className="mt-8 pt-6 flex gap-3 text-[13px] leading-[1.75]" style={{ borderTop: `1px solid ${th.line}`, color: th.sub, fontFamily: ui }}>
                  <Undo2 size={14} strokeWidth={1.7} className="mt-1 shrink-0" style={{ color: G }} aria-hidden="true" />{t.control.card.revoke}
                </p>
              </div>
            </Rise>
          </div>

          {/* E · Plans */}
          <div id="zenith-ai-plans" className="mt-28 sm:mt-36 scroll-mt-24">
            <Rise className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <Eyebrow color={dark ? `${G}AA` : th.goldText} isAr={isAr}>{t.plans.eyebrow}</Eyebrow>
                <h3 className="mt-5 text-[30px] sm:text-[42px] font-normal tracking-tight" style={{ color: th.hi, lineHeight: isAr ? 1.4 : 1.12 }}>{t.plans.h}</h3>
              </div>
              <p className="text-[14px] leading-[1.85] max-w-lg" style={{ color: th.sub, fontFamily: ui }}>{t.plans.lede}</p>
            </Rise>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4" style={{ borderTop: `1px solid ${th.line}`, borderInlineStart: `1px solid ${th.line}` }}>
              {ZENITH_AI_PLANS.map((p, i) => {
                const c: PlanCopy = t.plans.items[p.id];
                const gold = p.id === "gold";
                const price = p.price ? priceIn(p.price.aed, currency, rates ?? FALLBACK_RATES) : null;
                return (
                  <Rise key={p.id} d={0.05 * i} className="h-full">
                    <article className="relative h-full flex flex-col p-7 lg:p-8" aria-labelledby={`zai-plan-${p.id}`}
                      style={{ borderInlineEnd: `1px solid ${th.line}`, borderBottom: `1px solid ${th.line}`, background: gold ? (dark ? "rgba(200,169,110,0.045)" : "rgba(200,169,110,0.08)") : "transparent" }}>
                      {gold && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${G}, transparent)` }} />}
                      <div className="flex items-center justify-between gap-3">
                        <p id={`zai-plan-${p.id}`} className="text-[10px] font-medium uppercase" style={{ color: th.goldText, fontFamily: ui, letterSpacing: isAr ? 0 : "0.3em" }}>{c.name}</p>
                        {p.status === "proposed" && <span className="rounded-full px-2.5 py-0.5 text-[9px] uppercase" style={{ border: `1px dashed ${dark ? `${G}66` : `${G}99`}`, color: th.sub, fontFamily: ui, letterSpacing: isAr ? 0 : "0.14em" }}>{t.plans.proposed}</span>}
                      </div>
                      <p className="mt-7 flex items-baseline gap-2 flex-wrap">
                        <span className="text-[44px] leading-none" style={{ color: th.hi }}>{c.qty}</span>
                        <span className="text-[12.5px]" style={{ color: th.sub, fontFamily: ui }}>{c.unit}</span>
                      </p>
                      <p className="mt-4 text-[13px] leading-[1.7] min-h-[3.4em]" style={{ color: th.sub, fontFamily: ui }}>{c.for}</p>
                      <span aria-hidden="true" className="my-6 h-px" style={{ background: gold ? `${G}40` : th.line }} />
                      <ul className="space-y-2.5 flex-1" style={{ listStyle: "none", padding: 0 }}>
                        {c.features.map(f => (
                          <li key={f} className="flex gap-2.5 text-[12.5px] leading-[1.65]" style={{ color: th.hi, fontFamily: ui, fontWeight: 300 }}>
                            <span aria-hidden="true" className="mt-[8px] size-[3px] rounded-full shrink-0" style={{ background: G }} />{f}
                          </li>
                        ))}
                      </ul>
                      {c.note && <p className="mt-6 px-3.5 py-3 text-[11.5px] leading-[1.65]" style={{ border: `1px dashed ${dark ? `${G}55` : `${G}88`}`, color: th.sub, fontFamily: ui }}>{c.note}</p>}
                      <div className="mt-7 pt-5" style={{ borderTop: `1px solid ${th.line}` }}>
                        <p className="text-[9.5px] uppercase" style={{ color: th.faint, fontFamily: ui, letterSpacing: isAr ? 0 : "0.2em" }}>{t.plans.price}</p>
                        <p className="mt-1.5 text-[18px]" style={{ color: th.hi }}>{price ? `${price.value} ${price.symbol}` : t.plans.priceTbd}</p>
                      </div>
                      <button type="button" onClick={() => openJoin(p.id)}
                        className="mt-5 flex items-center justify-between w-full h-[44px] px-5 rounded-full text-[10px] font-medium uppercase transition-all hover:opacity-80 outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E]"
                        style={{ border: `1px solid ${G}55`, background: "transparent", color: dark ? G : th.goldText, fontFamily: ui, letterSpacing: isAr ? 0 : "0.16em" }}>
                        {gold ? t.plans.goldCta : t.plans.cta}<ArrowRight size={12} strokeWidth={1.8} aria-hidden="true" style={arrow} />
                      </button>
                    </article>
                  </Rise>
                );
              })}
            </div>
            <div className="mt-6 grid gap-2 text-[12px] leading-[1.7]" style={{ color: th.sub, fontFamily: ui }}>
              <p className="flex items-start gap-2.5"><Info size={13} strokeWidth={1.6} className="mt-0.5 shrink-0" style={{ color: G }} aria-hidden="true" />{t.plans.countNote}</p>
              <p className="flex items-start gap-2.5"><Info size={13} strokeWidth={1.6} className="mt-0.5 shrink-0" style={{ color: G }} aria-hidden="true" />{t.plans.checkoutNote}</p>
            </div>
          </div>

          {/* F · Questions */}
          <div id="zenith-ai-faq" className="mt-28 sm:mt-36 grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16 scroll-mt-24">
            <Rise className="self-start lg:sticky lg:top-28">
              <Eyebrow color={dark ? `${G}AA` : th.goldText} isAr={isAr}>{t.faq.eyebrow}</Eyebrow>
              <h3 className="mt-5 text-[30px] sm:text-[42px] font-normal tracking-tight" style={{ color: th.hi, lineHeight: isAr ? 1.4 : 1.12 }}>{t.faq.h}</h3>
              <p className="mt-5 text-[14px] leading-[1.85] max-w-sm" style={{ color: th.sub, fontFamily: ui }}>{t.faq.lede}</p>
            </Rise>
            <div style={{ borderTop: `1px solid ${th.line}` }}>
              {t.faq.items.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={f.q} style={{ borderBottom: `1px solid ${th.line}` }}>
                    <h4 className="m-0">
                      <button type="button" id={`zai-q-${i}`} aria-expanded={isOpen} aria-controls={`zai-a-${i}`} onClick={() => setOpen(isOpen ? null : i)}
                        className="w-full flex items-start justify-between gap-6 py-5 text-start outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E] rounded-sm">
                        <span className="text-[16.5px] leading-snug" style={{ color: th.hi }}>{f.q}</span>
                        <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" className="mt-1 shrink-0 transition-transform duration-300 motion-reduce:transition-none" style={{ color: G, transform: isOpen ? "rotate(180deg)" : "none" }} />
                      </button>
                    </h4>
                    <div id={`zai-a-${i}`} role="region" aria-labelledby={`zai-q-${i}`} inert={!isOpen}
                      className="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                      <div className="overflow-hidden">
                        <p className="pb-6 pe-10 text-[14px] leading-[1.85]" style={{ color: th.sub, fontFamily: ui }}>{f.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* G · Launch list */}
          <JoinPanel t={t} th={th} ui={ui} isAr={isAr} dark={dark} lang={lang} plan={plan} setPlan={setPlan} emailRef={emailRef} whatsappHref={whatsappHref} />

          <p className="mt-10 text-[11.5px] leading-[1.7] max-w-3xl" style={{ color: th.faint, fontFamily: ui }}>{t.footnote}</p>
        </div>
      </MotionConfig>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------ launch list */

type Theme = { hi: string; sub: string; faint: string; line: string; card: string; raise: string; gold: string; goldText: string; field: string };

function JoinPanel({ t, th, ui, isAr, dark, lang, plan, setPlan, emailRef, whatsappHref }: {
  t: Copy; th: Theme; ui: string; isAr: boolean; dark: boolean; lang: Lang;
  plan: "" | ZenithAIPlanId; setPlan: (p: "" | ZenithAIPlanId) => void;
  emailRef: React.RefObject<HTMLInputElement | null>; whatsappHref: string;
}) {
  const j = t.join;
  const [form, setForm] = React.useState({ email: "", name: "", roles: "", countries: "", consent: false, website: "" });
  const [state, setState] = React.useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = React.useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    const email = form.email.trim();
    if (!/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) { setErr(j.errEmail); setState("error"); return; }
    if (!form.consent) { setErr(j.errConsent); setState("error"); return; }
    setState("sending"); setErr("");
    const planName = plan ? `${t.plans.items[plan].name} (${EN.plans.items[plan].name})` : j.unsure;
    const message = [
      "Zenith AI Career Automation: launch list request",
      "",
      `Name: ${form.name.trim() || "-"}`,
      `Email: ${email}`,
      `Target roles: ${form.roles.trim() || "-"}`,
      `Target countries: ${form.countries.trim() || "-"}`,
      `Plan considered: ${planName}`,
      `Language: ${lang.toUpperCase()}`,
      "Consent: agreed to be emailed about Zenith AI (no account, campaign or application created).",
    ].join("\n");
    try {
      const fd = new FormData();
      fd.append("senderEmail", email);
      fd.append("subject", "Zenith AI · launch list");
      fd.append("message", message);
      fd.append("website", form.website);
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
    } catch {
      setErr(j.err); setState("error");
    }
  }

  const field = "w-full h-11 px-4 text-[14px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#C8A96E]";
  const fs: React.CSSProperties = { background: th.field, border: `1px solid ${th.line}`, color: th.hi, fontFamily: ui };
  const label = "block mb-2 text-[9.5px] uppercase";
  const ls: React.CSSProperties = { color: th.sub, fontFamily: ui, letterSpacing: isAr ? 0 : "0.18em" };

  return (
    <div id="zenith-ai-join" className="mt-28 sm:mt-36 grid lg:grid-cols-2 scroll-mt-24" style={{ border: `1px solid ${dark ? `${G}33` : `${G}55`}`, background: th.raise }}>
      <div className="p-8 sm:p-10 lg:p-12 border-b lg:border-b-0" style={{ borderColor: th.line }}>
        <Eyebrow color={dark ? `${G}AA` : th.goldText} isAr={isAr}>{j.eyebrow}</Eyebrow>
        <h3 className="mt-5 text-[30px] sm:text-[38px] font-normal tracking-tight" style={{ color: th.hi, lineHeight: isAr ? 1.4 : 1.12 }}>{j.h}</h3>
        <p className="mt-5 text-[14px] leading-[1.85] max-w-md" style={{ color: th.sub, fontFamily: ui }}>{j.lede}</p>
        <p className="mt-10 text-[9.5px] uppercase" style={{ color: th.goldText, fontFamily: ui, letterSpacing: isAr ? 0 : "0.2em" }}>{j.nextTitle}</p>
        <ol className="mt-4 space-y-4" style={{ listStyle: "none", padding: 0 }}>
          {j.next.map((n, i) => (
            <li key={n} className="flex gap-4 text-[13.5px] leading-[1.7]" style={{ color: th.hi, fontFamily: ui }}>
              <span className="font-mono text-[11px] mt-0.5" style={{ color: th.goldText }}>{String(i + 1).padStart(2, "0")}</span>{n}
            </li>
          ))}
        </ol>
      </div>
      <div className="p-8 sm:p-10 lg:p-12 lg:border-s" style={{ borderColor: th.line }}>
        {state === "done" ? (
          <div role="status" className="h-full flex flex-col justify-center gap-4">
            <span className="inline-grid place-items-center size-12 rounded-full" style={{ border: `1px solid ${G}55`, color: G }}><Check size={18} strokeWidth={1.8} aria-hidden="true" /></span>
            <p className="text-[24px]" style={{ color: th.hi }}>{j.okTitle}</p>
            <p className="text-[14px] leading-[1.8] max-w-md" style={{ color: th.sub, fontFamily: ui }}>{j.okBody.replace("{email}", form.email.trim())}</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="zai-email" className={label} style={ls}>{j.email}</label>
                <input id="zai-email" ref={emailRef} type="email" required autoComplete="email" inputMode="email" dir="ltr" value={form.email} onChange={set("email")} className={field} style={{ ...fs, textAlign: isAr ? "right" : "left" }} aria-invalid={state === "error" && err === j.errEmail} />
              </div>
              <div>
                <label htmlFor="zai-name" className={label} style={ls}>{j.name} <span className="normal-case opacity-70" style={{ letterSpacing: 0 }}>({j.optional})</span></label>
                <input id="zai-name" type="text" autoComplete="name" value={form.name} onChange={set("name")} className={field} style={fs} />
              </div>
            </div>
            <div>
              <label htmlFor="zai-roles" className={label} style={ls}>{j.roles} <span className="normal-case opacity-70" style={{ letterSpacing: 0 }}>({j.optional})</span></label>
              <input id="zai-roles" type="text" autoComplete="organization-title" placeholder={j.rolesPh} value={form.roles} onChange={set("roles")} className={field} style={fs} />
            </div>
            <div>
              <label htmlFor="zai-countries" className={label} style={ls}>{j.countries} <span className="normal-case opacity-70" style={{ letterSpacing: 0 }}>({j.optional})</span></label>
              <input id="zai-countries" type="text" placeholder={j.countriesPh} value={form.countries} onChange={set("countries")} className={field} style={fs} />
            </div>
            <div>
              <label htmlFor="zai-plan" className={label} style={ls}>{j.plan}</label>
              <select id="zai-plan" value={plan} onChange={e => setPlan(e.target.value as "" | ZenithAIPlanId)} className={field + " appearance-none cursor-pointer"}
                style={{ ...fs, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23C8A96E' stroke-width='1.3' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: isAr ? "left 1rem center" : "right 1rem center" }}>
                <option value="" style={{ color: "#1A1410" }}>{j.unsure}</option>
                {ZENITH_AI_PLANS.map(p => <option key={p.id} value={p.id} style={{ color: "#1A1410" }}>{t.plans.items[p.id].name} · {t.plans.items[p.id].qty} {t.plans.items[p.id].unit}</option>)}
              </select>
            </div>
            {/* left empty by people; filled by bots */}
            <div aria-hidden="true" className="sr-only">
              <label htmlFor="zai-website">Website</label>
              <input id="zai-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
            </div>
            <label className="flex items-start gap-3 text-[12.5px] leading-[1.7] cursor-pointer" style={{ color: th.sub, fontFamily: ui }}>
              <input type="checkbox" checked={form.consent} onChange={set("consent")} required className="mt-1 size-4 shrink-0 accent-[#C8A96E]" aria-invalid={state === "error" && err === j.errConsent} />
              <span>{j.consent}</span>
            </label>
            {state === "error" && (
              <p role="alert" className="text-[12.5px] leading-[1.6]" style={{ color: dark ? "#E0A090" : "#9A2E22", fontFamily: ui }}>
                {err}{err === j.err && <> <a href={whatsappHref} target="_blank" rel="noreferrer" className="underline underline-offset-2 inline-flex items-center gap-1"><MessageCircle size={12} aria-hidden="true" />{j.wa}</a></>}
              </p>
            )}
            <button type="submit" disabled={state === "sending"} aria-busy={state === "sending"}
              className="mt-1 inline-flex items-center justify-center gap-2.5 h-[50px] px-8 rounded-full text-[10px] font-medium uppercase transition-opacity hover:opacity-90 disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96E] focus-visible:ring-offset-2"
              style={{ background: G, color: INK, fontFamily: ui, letterSpacing: isAr ? 0 : "0.2em" }}>
              {state === "sending" ? <><Loader2 size={13} className="animate-spin" aria-hidden="true" />{j.sending}</> : j.submit}
            </button>
            <p className="text-[11.5px] leading-[1.6]" style={{ color: th.faint, fontFamily: ui }}>
              {j.privacy} <a href="/privacy" className="underline underline-offset-2" style={{ color: th.sub }}>{j.privacyLink}</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
