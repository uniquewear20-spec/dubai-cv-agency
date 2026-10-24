"use client";
// components/site/Packages.tsx — the four packages, the ebook, payment information and
// (behind a disclosure) individual services. Prices come from lib/checkout/catalog.ts; the
// server re-prices every order, so nothing the browser sends can change an amount.

import React, { useEffect, useState } from "react";
import { AlertCircle, Check, Loader2, Minus, Sparkles } from "lucide-react";
import { PACKAGES, packagePrice, type PackageDef } from "@/lib/packages";
import { COACH_TIERS, aedToUsd, type TierKey } from "@/lib/checkout/catalog";
import { startCheckout } from "@/lib/checkout/client";
import { CURRENCIES, convertAed, formatAmount, type Currency, type Rates } from "@/lib/currency";
import { EBOOK, pick, type L10n, type Lang } from "@/lib/site";
import ServicesPanel from "./ServicesPanel";
import { PayLogo } from "./payLogos";
import { useAgentStatus } from "./useAgentStatus";

const T: Record<string, L10n> = {
  h2: { en: "Four packages. Pick the one that matches your search.", fr: "Quatre formules. Choisissez celle qui correspond à votre recherche.", ar: "أربع باقات. اختر ما يناسب بحثك." },
  lede: {
    en: "Each package is written by a career specialist from your real experience. One payment, no subscription.",
    fr: "Chaque formule est rédigée par un spécialiste à partir de votre parcours réel. Un seul paiement, sans abonnement.",
    ar: "تُكتب كل باقة على يد مختص مهني من خبرتك الحقيقية. دفعة واحدة، بلا اشتراك.",
  },
  showIn: { en: "Show prices in", fr: "Afficher les prix en", ar: "عرض الأسعار بـ" },
  approx: { en: "approx.", fr: "env.", ar: "تقريباً" },
  charged: { en: "PayPal charges", fr: "PayPal débite", ar: "يخصم PayPal مبلغ" },
  recommended: { en: "Our recommendation for most searches", fr: "Notre recommandation pour la plupart des recherches", ar: "توصيتنا لمعظم عمليات البحث" },
  ebook: { en: "The Global Horizon ebook", fr: "L'ebook The Global Horizon", ar: "كتاب The Global Horizon الإلكتروني" },
  ebookYes: { en: "The Global Horizon ebook included", fr: "Ebook The Global Horizon inclus", ar: "كتاب The Global Horizon مشمول" },
  ebookNo: { en: "The Global Horizon ebook not included", fr: "Ebook The Global Horizon non inclus", ar: "كتاب The Global Horizon غير مشمول" },
  aiYes: { en: "Zenith AI job agent: Pro access and the interview coach", fr: "Agent emploi Zenith AI : accès Pro et coach d'entretien", ar: "وكيل الوظائف Zenith AI: وصول Pro ومدرّب المقابلات" },
  aiCoach: { en: "Zenith AI job agent: the interview coach", fr: "Agent emploi Zenith AI : coach d'entretien", ar: "وكيل الوظائف Zenith AI: مدرّب المقابلات" },
  aiNo: { en: "Zenith AI job agent, free tools only", fr: "Agent emploi Zenith AI, outils gratuits seulement", ar: "وكيل الوظائف Zenith AI، الأدوات المجانية فقط" },
  aiHead: { en: "AI tools included", fr: "Outils IA inclus", ar: "أدوات الذكاء الاصطناعي المشمولة" },
  aiAgent: { en: "Zenith AI job agent: jobs from around the world, ranked against your CV", fr: "Agent emploi Zenith AI : des offres du monde entier, classées selon votre CV", ar: "وكيل الوظائف Zenith AI: وظائف من حول العالم مرتّبة حسب سيرتك الذاتية" },
  aiCoachLine: { en: "AI interview coach: practise out loud with an animated interviewer, follow-up questions and a scored report", fr: "Coach d'entretien IA : entraînez-vous à voix haute avec un recruteur animé, des questions de relance et un rapport noté", ar: "مدرّب المقابلات بالذكاء الاصطناعي: تدرّب بصوتك مع محاوِر متحرك وأسئلة متابعة وتقرير بالدرجات" },
  aiProLine: { en: "AI job agent Pro: we send the applications you approve, and replies come straight to you", fr: "Agent emploi IA Pro : nous envoyons les candidatures que vous validez, et les réponses vous arrivent directement", ar: "وكيل الوظائف Pro: نرسل الطلبات التي توافق عليها، وتصلك الردود مباشرة" },
  secure: { en: "Secure checkout", fr: "Paiement sécurisé", ar: "دفع آمن" },
  everything: { en: "Everything else included", fr: "Tout ce qui est inclus en plus", ar: "كل ما تشمله الباقة أيضاً" },
  pay: { en: "Pay with PayPal", fr: "Payer avec PayPal", ar: "ادفع عبر PayPal" },
  redirecting: { en: "Opening PayPal…", fr: "Ouverture de PayPal…", ar: "جارٍ فتح PayPal…" },
  // Non-breaking spaces keep "Apple Pay" and "Google Pay" whole when a narrow card wraps the label.
  wallet: { en: "Card, Apple\u00a0Pay or Google\u00a0Pay", fr: "Carte, Apple\u00a0Pay ou Google\u00a0Pay", ar: "بطاقة أو Apple\u00a0Pay أو Google\u00a0Pay" },
  walletVia: {
    en: "Checkout on Gumroad. Apple Pay and Google Pay show on devices that support them.",
    fr: "Paiement sur Gumroad. Apple Pay et Google Pay s'affichent sur les appareils compatibles.",
    ar: "الدفع عبر Gumroad. يظهر Apple Pay وGoogle Pay على الأجهزة التي تدعمهما.",
  },
  payError: {
    en: "PayPal could not be opened. Try again, or message us on WhatsApp and we'll send you a payment link.",
    fr: "PayPal n'a pas pu s'ouvrir. Réessayez, ou écrivez-nous sur WhatsApp et nous vous enverrons un lien de paiement.",
    ar: "تعذّر فتح PayPal. حاول مجدداً، أو راسلنا عبر واتساب لنرسل لك رابط دفع.",
  },
  ebookTitle: { en: "The Global Horizon", fr: "The Global Horizon", ar: "The Global Horizon" },
  ebookLine: {
    en: "Our executive playbook for winning high-value roles across the Middle East, Europe, Canada, the UK, the USA and Singapore.",
    fr: "Notre guide exécutif pour décrocher des postes à forte valeur au Moyen-Orient, en Europe, au Canada, au Royaume-Uni, aux États-Unis et à Singapour.",
    ar: "دليلنا التنفيذي للفوز بوظائف رفيعة في الشرق الأوسط وأوروبا وكندا والمملكة المتحدة والولايات المتحدة وسنغافورة.",
  },
  ebookWhere: {
    en: "Included with Career Advantage, Career Automation and Executive Career Suite. A PDF, sent to you by email once your payment is confirmed.",
    fr: "Inclus dans Avantage Carrière, Carrière Automatisée et Suite Carrière Exécutive. Un PDF, envoyé par e-mail dès la confirmation de votre paiement.",
    ar: "مشمول في الميزة المهنية وأتمتة المسار المهني والباقة التنفيذية المتكاملة. ملف PDF يُرسل إليك بالبريد الإلكتروني بعد تأكيد الدفع.",
  },
  ebookWhereGumroad: {
    en: "Included with Career Advantage, Career Automation and Executive Career Suite. A PDF: paid on Gumroad, you download it straight after payment; paid with PayPal, we email it to you once your payment is confirmed.",
    fr: "Inclus dans Avantage Carrière, Carrière Automatisée et Suite Carrière Exécutive. Un PDF : payé sur Gumroad, vous le téléchargez dès le paiement ; payé avec PayPal, nous vous l'envoyons par e-mail une fois le paiement confirmé.",
    ar: "مشمول في الميزة المهنية وأتمتة المسار المهني والباقة التنفيذية المتكاملة. ملف PDF: عند الدفع عبر Gumroad تنزّله فور الدفع، وعند الدفع عبر PayPal نرسله إليك بالبريد الإلكتروني بعد تأكيد الدفع.",
  },
  aiNote: {
    en: "The Zenith AI job agent is live and free for everyone: job search, ranking against your CV, template drafts and an application tracker. Pro access, included with Career Automation and Executive Career Suite, adds Zenith emailing the applications you approve, with replies going to you.",
    fr: "L'agent emploi Zenith AI est en service et gratuit pour tous : recherche d'offres, classement selon votre CV, brouillons modèles et suivi des candidatures. L'accès Pro, inclus dans Carrière Automatisée et Suite Carrière Exécutive, ajoute l'envoi par Zenith des candidatures que vous validez, les réponses vous parvenant directement.",
    ar: "وكيل الوظائف Zenith AI يعمل الآن ومجاني للجميع: البحث عن الوظائف، والترتيب حسب سيرتك الذاتية، ومسودات جاهزة، ومتابعة الطلبات. ويضيف وصول Pro، المشمول في أتمتة المسار المهني والباقة التنفيذية المتكاملة، إرسال Zenith للطلبات التي توافق عليها، مع وصول الردود إليك.",
  },
  aiOn: {
    en: "Pro also includes AI-tailored drafts that only use what your CV says.",
    fr: "Pro inclut aussi des brouillons adaptés par IA qui n'utilisent que ce que dit votre CV.",
    ar: "ويشمل Pro أيضاً مسودات مكيّفة بالذكاء الاصطناعي لا تستخدم إلا ما تقوله سيرتك.",
  },
  aiOff: {
    en: "AI-tailored drafts are not switched on yet; until they are, your specialist tailors the applications included in your package.",
    fr: "Les brouillons adaptés par IA ne sont pas encore activés ; d'ici là, votre spécialiste adapte les candidatures incluses dans votre formule.",
    ar: "المسودات المكيّفة بالذكاء الاصطناعي غير مفعّلة بعد، وحتى تفعيلها يكيّف مختصك الطلبات المشمولة في باقتك.",
  },
  agentLink: { en: "Open the agent", fr: "Ouvrir l'agent", ar: "افتح الوكيل" },
  payHead: { en: "How payment works", fr: "Comment se passe le paiement", ar: "كيف يتم الدفع" },
  payPaypal: {
    en: "Checkout is handled by PayPal. Pay with your PayPal balance, or by debit or credit card where PayPal offers card checkout. Amounts are charged in US dollars at the official AED rate.",
    fr: "Le paiement est assuré par PayPal : solde PayPal, ou carte de débit ou de crédit lorsque PayPal propose le paiement par carte. Les montants sont débités en dollars US au taux officiel du dirham.",
    ar: "تتم عملية الدفع عبر PayPal: برصيدك في PayPal أو ببطاقة خصم أو ائتمان حيث يتيح PayPal الدفع بالبطاقة. تُخصم المبالغ بالدولار الأمريكي وفق السعر الرسمي للدرهم.",
  },
  payDeclined: {
    en: "If a card, Apple Pay or Google Pay payment is declined, no money is taken and no order is created. Gumroad shows the message on its checkout (when the bank gives one) and emails a receipt only for completed payments, so Zenith isn't told about a declined attempt. Whether you get an SMS is up to your bank. Message us on WhatsApp if a payment keeps failing.",
    fr: "Si un paiement par carte, Apple Pay ou Google Pay est refusé, rien n'est débité et aucune commande n'est créée. Gumroad affiche le message sur sa page de paiement (quand la banque en donne un) et n'envoie un reçu que pour les paiements aboutis : Zenith n'est donc pas informé d'une tentative refusée. L'envoi d'un SMS dépend de votre banque. Écrivez-nous sur WhatsApp si un paiement échoue à plusieurs reprises.",
    ar: "إذا رُفض الدفع بالبطاقة أو Apple Pay أو Google Pay فلا يُخصم أي مبلغ ولا يُنشأ أي طلب. يعرض Gumroad الرسالة في صفحة الدفع لديه (حين يقدّمها البنك) ولا يرسل إيصالاً إلا للدفعات المكتملة، لذلك لا تُبلَّغ Zenith بالمحاولة المرفوضة. أما إرسال رسالة نصية فيعود إلى بنكك. راسلنا عبر واتساب إذا تكرر فشل الدفع.",
  },
  payGumroad: {
    en: "Prefer a card, Apple Pay or Google Pay? Use the Gumroad checkout under each package, at the same US dollar price. Gumroad takes major cards, and shows Apple Pay or Google Pay on devices and browsers that support them. Gumroad may add sales tax or VAT where it applies.",
    fr: "Vous préférez une carte, Apple Pay ou Google Pay ? Utilisez le paiement Gumroad sous chaque formule, au même prix en dollars US. Gumroad accepte les principales cartes et affiche Apple Pay ou Google Pay sur les appareils et navigateurs compatibles. Gumroad peut ajouter la TVA lorsqu'elle s'applique.",
    ar: "تفضّل البطاقة أو Apple Pay أو Google Pay؟ استخدم الدفع عبر Gumroad أسفل كل باقة بالسعر نفسه بالدولار الأمريكي. يقبل Gumroad البطاقات الرئيسية ويعرض Apple Pay أو Google Pay على الأجهزة والمتصفحات التي تدعمهما. وقد يضيف Gumroad ضريبة المبيعات أو القيمة المضافة حيث تنطبق.",
  },
  refund: { en: "Full refund within 7 days of purchase.", fr: "Remboursement intégral dans les 7 jours suivant l'achat.", ar: "استرداد كامل خلال 7 أيام من الشراء." },
  refundLink: { en: "Refund policy", fr: "Politique de remboursement", ar: "سياسة الاسترداد" },
  guarantee: {
    en: "We write to give you the strongest possible case, but no one can guarantee interviews, offers or salary outcomes: employers make those decisions.",
    fr: "Nous écrivons pour défendre au mieux votre candidature, mais personne ne peut garantir d'entretiens, d'offres ou de salaire : ce sont les employeurs qui décident.",
    ar: "نكتب لنقدّم أقوى صورة ممكنة لك، لكن لا أحد يستطيع ضمان المقابلات أو العروض أو الرواتب، فهذه قرارات أصحاب العمل.",
  },
};
const t = (k: string, l: Lang) => pick(T[k], l);

/** One line per package on what it changes for the candidate. */
const PROMISE: Record<TierKey, L10n> = {
  foundation: { en: "Your next opportunity starts with how you present yourself.", fr: "Votre prochaine opportunité commence par la façon dont vous vous présentez.", ar: "تبدأ فرصتك القادمة بالطريقة التي تقدّم بها نفسك." },
  growth: { en: "Stop sending applications with a profile that undersells you.", fr: "Arrêtez de postuler avec un profil qui ne vous rend pas justice.", ar: "توقّف عن التقديم بملف لا يُظهر قيمتك الحقيقية." },
  executive: { en: "Less time managing your job search, more time on the right opportunities.", fr: "Moins de temps à gérer vos recherches, plus de temps pour les bonnes opportunités.", ar: "وقت أقل في إدارة بحثك عن عمل، ووقت أكثر للفرص المناسبة." },
  apex: { en: "Your career deserves more than another application. It deserves a strategy.", fr: "Votre carrière mérite plus qu'une candidature de plus : une stratégie.", ar: "مسيرتك تستحق أكثر من طلب توظيف آخر، إنها تستحق استراتيجية." },
};

function PriceLine({ aed, currency, rates, lang }: { aed: number; currency: Currency; rates: Rates; lang: Lang }) {
  if (currency === "AED") {
    return <><span className="pk-cur">AED</span><span className="pk-amt">{formatAmount(aed)}</span></>;
  }
  if (currency === "USD") {
    return <><span className="pk-cur">US$</span><span className="pk-amt">{aedToUsd(aed)}</span></>;
  }
  const sym = CURRENCIES.find(c => c.code === currency)?.symbol ?? currency;
  return (
    <>
      <span className="pk-cur">{t("approx", lang)} {sym}</span>
      <span className="pk-amt">{formatAmount(convertAed(aed, currency, rates))}</span>
    </>
  );
}

function PackageCard({
  pkg, lang, currency, rates, busy, locked, error, onPay,
}: {
  pkg: PackageDef; lang: Lang; currency: Currency; rates: Rates; busy: boolean; locked: boolean; error: boolean; onPay: () => void;
}) {
  const aed = packagePrice(pkg.key);
  const headingId = `pk-${pkg.key}`;
  return (
    <article className="pk" data-recommended={pkg.recommended || undefined} aria-labelledby={headingId}>
      <div className="pk-slot">{pkg.recommended && <p className="pk-rec">{t("recommended", lang)}</p>}</div>
      <h3 id={headingId} className="pk-name z-serif">{pick(pkg.name, lang)}</h3>
      <p className="pk-promise z-serif">{pick(PROMISE[pkg.key], lang)}</p>
      <p className="pk-line">{pick(pkg.line, lang)}</p>
      <p className="pk-price" dir="ltr"><PriceLine aed={aed} currency={currency} rates={rates} lang={lang} /></p>
      <p className="pk-charge">{t("charged", lang)} <span dir="ltr">US${aedToUsd(aed)}</span></p>

      <div className="pk-ai">
        <p className="pk-ai-h"><Sparkles size={15} aria-hidden="true" />{t("aiHead", lang)}</p>
        <ul>
          {(pkg.ai === "pro" ? ["aiCoachLine", "aiProLine"] : COACH_TIERS.includes(pkg.key) ? ["aiCoachLine", "aiAgent"] : ["aiAgent"]).map(k => (
            <li key={k}><Check size={16} strokeWidth={2} aria-hidden="true" />{t(k, lang)}</li>
          ))}
        </ul>
      </div>

      <ul className="pk-list">
        {pkg.highlights.map(h => (
          <li key={h.en}><Check size={16} strokeWidth={2} aria-hidden="true" />{pick(h, lang)}</li>
        ))}
      </ul>

      <ul className="pk-inc">
        <li data-yes={pkg.ebook || undefined}>
          {pkg.ebook ? <Check size={16} strokeWidth={2} aria-hidden="true" /> : <Minus size={16} aria-hidden="true" />}
          <span>{pkg.ebook ? t("ebookYes", lang) : t("ebookNo", lang)}</span>
        </li>
      </ul>

      <details className="pk-more z-details">
        <summary>{t("everything", lang)}</summary>
        <ul>{pkg.alsoIncluded.map(a => <li key={a.en}>{pick(a, lang)}</li>)}</ul>
      </details>

      <div className="pk-ctas">
        <button type="button" className="z-btn z-btn-primary z-btn-block" onClick={onPay} disabled={locked} aria-busy={busy}>
          {busy ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />{t("redirecting", lang)}</> : t("pay", lang)}
        </button>
        {pkg.gumroadUrl && (
          <>
            <a className="z-btn z-btn-quiet z-btn-block" href={pkg.gumroadUrl} rel="noopener" aria-describedby={`${headingId}-via`}>{t("wallet", lang)}</a>
            <p id={`${headingId}-via`} className="pk-via">{t("walletVia", lang)}</p>
          </>
        )}
        {error && (
          <p role="alert" className="pk-err"><AlertCircle size={15} aria-hidden="true" />{t("payError", lang)}</p>
        )}
      </div>
    </article>
  );
}

export default function Packages({
  lang, currency, rates, onCurrency,
}: {
  lang: Lang; currency: Currency; rates: Rates; onCurrency: (c: Currency) => void;
}) {
  const [busy, setBusy] = useState<TierKey | null>(null);
  const [error, setError] = useState<TierKey | null>(null);
  const agent = useAgentStatus();
  const anyGumroad = PACKAGES.some(p => p.gumroadUrl);
  const ebookOnGumroad = PACKAGES.filter(p => p.ebook).every(p => p.gumroadUrl);

  // Coming back from PayPal with the Back button restores this page from the cache.
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => { if (e.persisted) setBusy(null); };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  async function pay(key: TierKey) {
    if (busy) return;
    setBusy(key);
    setError(null);
    try {
      await startCheckout({ tier: key }, lang);
    } catch {
      setError(key);
      setBusy(null);
    }
  }

  return (
    <section id="packages" className="z-section" aria-labelledby="pk-title">
      <style href="zenith-packages" precedence="medium">{CSS}</style>
      <div className="z-wrap z-wrap-wide">
        <div className="pk-head">
          <div>
            <h2 id="pk-title" className="z-h2">{t("h2", lang)}</h2>
            <p className="z-lede" style={{ marginTop: 16 }}>{t("lede", lang)}</p>
          </div>
          <label className="pk-currency">
            <span className="z-small">{t("showIn", lang)}</span>
            <select value={currency} onChange={e => onCurrency(e.target.value as Currency)}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </label>
        </div>

        <div className="pk-grid">
          {PACKAGES.map(p => (
            <PackageCard
              key={p.key}
              pkg={p}
              lang={lang}
              currency={currency}
              rates={rates}
              busy={busy === p.key}
              locked={busy !== null}
              error={error === p.key}
              onPay={() => pay(p.key)}
            />
          ))}
        </div>

        <div className="pk-ebook">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={EBOOK.cover} width={EBOOK.coverWidth} height={EBOOK.coverHeight} alt={`${EBOOK.title}: ${EBOOK.subtitle} (cover)`} loading="lazy" decoding="async" />
          <div>
            <p className="z-label">{t("ebook", lang)}</p>
            <h3 className="z-h3" style={{ marginTop: 6 }}>{t("ebookTitle", lang)}: <span className="pk-ebook-sub">{EBOOK.subtitle}</span></h3>
            <p className="z-body" style={{ marginTop: 10 }}>{t("ebookLine", lang)}</p>
            <p className="z-small" style={{ marginTop: 10 }}>{t(ebookOnGumroad ? "ebookWhereGumroad" : "ebookWhere", lang)}</p>
          </div>
        </div>

        <div className="pk-secure">
          <span>{t("secure", lang)}</span>
          <span className="pk-badge" title="Apple Pay"><PayLogo id="apple-pay" /><span className="z-sr">Apple Pay</span></span>
          <span className="pk-badge" title="Google Pay"><PayLogo id="google-pay" /><span className="z-sr">Google Pay</span></span>
          <span className="pk-badge" title="PayPal"><PayLogo id="paypal" height={17} /><b className="pk-pp" aria-hidden="true"><i>Pay</i>Pal</b><span className="z-sr">PayPal</span></span>
        </div>

        <div className="pk-info">
          <div>
            <h3 className="pk-info-h">{t("payHead", lang)}</h3>
            <p className="z-small">{t("payPaypal", lang)}</p>
            {anyGumroad && <p className="z-small" style={{ marginTop: 10 }}>{t("payGumroad", lang)}</p>}
            {anyGumroad && <p className="z-small" style={{ marginTop: 10 }}>{t("payDeclined", lang)}</p>}
            <p className="z-small" style={{ marginTop: 10 }}>
              {t("refund", lang)} <a className="z-link" href="/refund/">{t("refundLink", lang)}</a>
            </p>
          </div>
          <div>
            <h3 className="pk-info-h">{pick({ en: "Zenith AI job agent", fr: "Agent emploi Zenith AI", ar: "وكيل الوظائف Zenith AI" }, lang)}</h3>
            <p className="z-small">{t("aiNote", lang)} {agent?.ai ? t("aiOn", lang) : t("aiOff", lang)} <a className="z-link" href="/agent/">{t("agentLink", lang)}</a></p>
            <p className="z-small" style={{ marginTop: 10 }}>{t("guarantee", lang)}</p>
          </div>
        </div>

        <ServicesPanel lang={lang} currency={currency} rates={rates} />
      </div>
    </section>
  );
}

const CSS = `
.pk-head{display:flex;justify-content:space-between;align-items:flex-end;gap:28px;flex-wrap:wrap;margin-bottom:40px}
.pk-head .z-lede{max-width:56ch}
.pk-currency{display:flex;align-items:center;gap:10px}
.pk-currency select{min-height:42px;padding:0 34px 0 14px;border-radius:999px;border:1px solid var(--z-rule-strong);background:var(--z-surface);color:var(--z-fg);font:inherit;font-size:14px;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23C8A96E' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;cursor:pointer}
[dir="rtl"] .pk-currency select{padding:0 14px 0 34px;background-position:left 12px center}
.pk-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:auto;gap:0;border:1px solid var(--z-rule);border-radius:20px;overflow:hidden;background:var(--z-surface)}
.pk{position:relative;display:grid;grid-row:span 11;grid-template-rows:subgrid;grid-template-columns:minmax(0,1fr);align-content:start;padding:28px 26px 28px;min-width:0}
.pk+.pk{border-inline-start:1px solid var(--z-rule)}
.pk[data-recommended]{background:linear-gradient(180deg,var(--z-gold-wash),transparent 60%)}
/* The banner has its own subgrid row, so a banner that wraps (French, narrow cards) moves every
   title in that row down together instead of covering one of them. */
.pk-slot{min-width:0}
.pk-rec{margin:-28px -26px 18px;padding:7px 26px;font-size:13px;line-height:1.6;font-weight:600;color:var(--z-on-gold);background:var(--z-gold)}
.pk-name{font-size:27px;line-height:1.15;font-weight:500;letter-spacing:-.01em}
[dir="rtl"] .pk-name{font-family:var(--font-arabic-serif),serif;font-weight:700;font-size:24px}
.pk-promise{margin-top:10px;font-size:18px;line-height:1.35;font-style:italic;color:var(--z-gold-text)}
[dir="rtl"] .pk-promise{font-style:normal}
.pk-line{margin-top:8px;font-size:15px;line-height:1.55;color:var(--z-fg-2)}
.pk-ai{margin-top:20px;padding:14px 14px 12px;border:1px solid color-mix(in srgb,var(--z-gold) 45%,transparent);border-radius:12px;background:var(--z-gold-wash)}
.pk-ai-h{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600;color:var(--z-gold-text);margin-bottom:8px}
.pk-ai ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.pk-ai li{display:grid;grid-template-columns:18px 1fr;gap:10px;font-size:14.5px;line-height:1.45;color:var(--z-fg);font-weight:500}
.pk-ai li svg{margin-top:2px;color:var(--z-gold-text)}
.pk-secure{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px 10px;margin-top:22px}
.pk-secure>span:first-child{font-size:13px;color:var(--z-fg-3);margin-inline-end:4px}
.pk-badge{display:inline-flex;align-items:center;gap:4px;height:34px;padding:0 12px;border-radius:8px;background:#fff;border:1px solid rgba(0,0,0,.12)}
.pk-pp{font:italic 800 15px/1 var(--font-sans),Arial,sans-serif;color:#009cde;letter-spacing:-.02em}
.pk-pp i{color:#003087}
.pk-price{display:flex;align-items:baseline;align-self:end;gap:8px;margin-top:20px;font-family:var(--font-serif),Georgia,serif;color:var(--z-fg)}
.pk-cur{font-family:var(--font-sans),sans-serif;font-size:14px;font-weight:600;color:var(--z-fg-2)}
.pk-amt{font-size:48px;line-height:1;letter-spacing:-.02em;font-weight:400;font-variant-numeric:lining-nums}
.pk-charge{margin-top:6px;font-size:13px;color:var(--z-fg-3)}
.pk-list{list-style:none;margin:22px 0 0;padding:20px 0 0;border-top:1px solid var(--z-rule);display:grid;gap:10px;align-content:start}
.pk-list li{display:grid;grid-template-columns:18px 1fr;gap:10px;font-size:15px;line-height:1.5;color:var(--z-fg)}
.pk-list svg{margin-top:3px;color:var(--z-gold-text)}
.pk-inc{list-style:none;margin:20px 0 0;padding:16px 0 0;border-top:1px solid var(--z-rule);display:grid;gap:8px;align-content:start}
.pk-inc li{display:grid;grid-template-columns:18px 1fr;gap:10px;font-size:14px;line-height:1.45;color:var(--z-fg-3)}
.pk-inc li svg{margin-top:2px}
.pk-inc li[data-yes]{color:var(--z-fg);font-weight:500}
.pk-inc li[data-yes] svg{color:var(--z-gold-text)}
.pk-more{margin-top:16px;font-size:14px}
.pk-more summary{display:inline-flex;align-items:center;gap:8px;min-height:40px;color:var(--z-gold-text);font-weight:500}
.pk-more summary::after{content:"+";font-size:18px;line-height:1}
.pk-more[open] summary::after{content:"−"}
.pk-more ul{margin:4px 0 0;padding-inline-start:18px;display:grid;gap:6px;color:var(--z-fg-2)}
.pk-ctas{align-self:end;padding-top:22px;display:grid;gap:10px}
.pk-ctas .z-btn{white-space:normal;text-align:center;padding:8px 16px}
.pk-via{margin-top:-2px;font-size:12.5px;line-height:1.45;color:var(--z-fg-3)}
.pk-err{display:flex;gap:8px;margin-top:12px;font-size:13px;line-height:1.5;color:var(--z-error)}
.pk-err svg{flex:none;margin-top:2px}
@media (max-width:1180px){
  .pk-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pk:nth-child(odd){border-inline-start:0}
  .pk:nth-child(n+3){border-top:1px solid var(--z-rule)}
}
@media (max-width:680px){
  .pk-grid{grid-template-columns:1fr;border-radius:16px}
  .pk+.pk{border-inline-start:0;border-top:1px solid var(--z-rule)}
  .pk{padding:28px 22px 26px}
  .pk-rec{margin:-28px -22px 18px;padding:7px 22px}
}
.pk-ebook{display:grid;grid-template-columns:minmax(0,360px) minmax(0,1fr);gap:clamp(24px,4vw,48px);align-items:center;margin-top:28px;padding:clamp(20px,3vw,32px);border:1px solid var(--z-rule);border-radius:20px;background:var(--z-surface)}
.pk-ebook img{width:100%;height:auto;border-radius:10px;box-shadow:0 20px 50px -28px rgba(0,0,0,.8)}
.pk-ebook-sub{color:var(--z-fg-2)}
@media (max-width:760px){.pk-ebook{grid-template-columns:1fr}}
.pk-info{display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,4vw,48px);margin-top:28px;padding-top:28px;border-top:1px solid var(--z-rule)}
.pk-info-h{font-size:16px;font-weight:600;margin-bottom:8px;color:var(--z-fg)}
@media (max-width:760px){.pk-info{grid-template-columns:1fr}}
`;
