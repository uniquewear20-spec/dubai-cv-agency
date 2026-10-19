"use client";
// app/checkout/success/SuccessView.tsx — what the customer sees after PayPal.
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import type { TierKey } from "@/lib/checkout/catalog";
import { packageByKey } from "@/lib/packages";
import { CONTACT_EMAIL, LANGS, isLang, pick, waLink, type L10n, type Lang } from "@/lib/site";

export type OrderResult =
  | { status: "paid"; lang: Lang; ref: string; orderId: string; amountUsd: string; amountAed: number; tier: TierKey | null; bundle: string | null; itemCount: number; ebook: boolean; ai: boolean }
  | { status: "pending"; lang: Lang; ref: string }
  | { status: "refunded"; lang: Lang; ref: string }
  | { status: "unfinished"; lang: Lang }
  | { status: "declined"; lang: Lang }
  | { status: "invalid" };

const T: Record<string, L10n> = {
  paidH1: { en: "Payment received. Thank you.", fr: "Paiement reçu. Merci.", ar: "تم استلام الدفع. شكراً لك." },
  paidBody: {
    en: "Your order is confirmed. PayPal is emailing you a receipt, and we've sent you an email with these next steps.",
    fr: "Votre commande est confirmée. PayPal vous envoie un reçu, et nous vous avons envoyé un e-mail avec les étapes suivantes.",
    ar: "تم تأكيد طلبك. يرسل إليك PayPal إيصالاً، وأرسلنا إليك بريداً بالخطوات التالية.",
  },
  order: { en: "Order", fr: "Commande", ar: "الطلب" },
  amount: { en: "Amount paid", fr: "Montant payé", ar: "المبلغ المدفوع" },
  ref: { en: "Order reference", fr: "Référence", ar: "رقم الطلب" },
  nextH: { en: "Next: send us your brief", fr: "Étape suivante : envoyez votre brief", ar: "الخطوة التالية: أرسل معلوماتك" },
  nextBody: {
    en: "Upload your current CV and tell us the roles and countries you're targeting. It takes about five minutes. Your first draft arrives within 48 hours of your complete brief.",
    fr: "Envoyez votre CV actuel et indiquez les postes et pays visés. Cela prend environ cinq minutes. Le premier jet arrive sous 48 heures après votre brief complet.",
    ar: "ارفع سيرتك الحالية وحدّد الوظائف والدول التي تستهدفها. يستغرق ذلك نحو خمس دقائق، وتصلك المسودة الأولى خلال 48 ساعة من استلام معلوماتك كاملة.",
  },
  brief: { en: "Send your brief", fr: "Envoyer mon brief", ar: "أرسل معلوماتك" },
  whatsapp: { en: "Ask us on WhatsApp", fr: "Nous écrire sur WhatsApp", ar: "راسلنا عبر واتساب" },
  ebook: {
    en: "Your package includes The Global Horizon ebook. We'll email you the PDF.",
    fr: "Votre formule inclut l'ebook The Global Horizon. Nous vous envoyons le PDF par e-mail.",
    ar: "تتضمن باقتك كتاب The Global Horizon الإلكتروني، وسنرسل إليك ملف PDF بالبريد.",
  },
  ai: {
    en: "Your package includes Pro access to the Zenith AI job agent. The button below opens it with your order already unlocked; the same link is in your order email.",
    fr: "Votre formule inclut l'accès Pro à l'agent emploi Zenith AI. Le bouton ci-dessous l'ouvre avec votre commande déjà activée ; le même lien figure dans votre e-mail de commande.",
    ar: "تتضمن باقتك وصول Pro إلى وكيل الوظائف Zenith AI. يفتحه الزر أدناه وطلبك مفعّل مسبقاً، والرابط نفسه موجود في رسالة طلبك.",
  },
  agent: { en: "Open the AI job agent", fr: "Ouvrir l'agent emploi IA", ar: "افتح وكيل الوظائف" },
  pendH1: { en: "Payment received, now under review.", fr: "Paiement reçu, en cours de vérification.", ar: "تم استلام الدفع وهو قيد المراجعة." },
  pendBody: {
    en: "PayPal is running a routine check on this payment and will email you once it's confirmed, usually within 24 hours. You can send your brief now.",
    fr: "PayPal effectue une vérification de routine et vous écrira dès la confirmation, généralement sous 24 heures. Vous pouvez déjà envoyer votre brief.",
    ar: "يُجري PayPal تحققاً روتينياً وسيراسلك فور التأكيد، عادةً خلال 24 ساعة. يمكنك إرسال معلوماتك الآن.",
  },
  unfinH1: { en: "Payment not completed.", fr: "Paiement non finalisé.", ar: "لم يكتمل الدفع." },
  unfinBody: {
    en: "This payment wasn't completed, so nothing has been charged. If you left PayPal early, go back to the packages and try again.",
    fr: "Ce paiement n'a pas été finalisé : rien n'a été débité. Si vous avez quitté PayPal avant la fin, revenez aux formules et réessayez.",
    ar: "لم تكتمل عملية الدفع، لذلك لم يُخصم أي مبلغ. إذا غادرت PayPal قبل الإتمام، عد إلى الباقات وحاول مجدداً.",
  },
  refH1: { en: "This payment was refunded.", fr: "Ce paiement a été remboursé.", ar: "تم استرداد هذه الدفعة." },
  refBody: {
    en: "PayPal shows this order as refunded, so it is closed. If you think this is a mistake, or you'd like to order again, message us.",
    fr: "PayPal indique que cette commande a été remboursée : elle est donc close. Si vous pensez qu'il s'agit d'une erreur, ou si vous souhaitez commander à nouveau, écrivez-nous.",
    ar: "يُظهر PayPal أن هذا الطلب مُسترد، لذا فهو مغلق. إن كنت تعتقد أن في ذلك خطأ أو ترغب في الطلب مجدداً، راسلنا.",
  },
  declH1: { en: "Payment declined.", fr: "Paiement refusé.", ar: "تم رفض الدفع." },
  declBody: {
    en: "Your bank or PayPal declined this payment, so nothing has been charged. Try another card or your PayPal balance, or message us and we'll help.",
    fr: "Votre banque ou PayPal a refusé ce paiement : rien n'a été débité. Essayez une autre carte ou votre solde PayPal, ou écrivez-nous.",
    ar: "رفض البنك أو PayPal هذه الدفعة، لذلك لم يُخصم أي مبلغ. جرّب بطاقة أخرى أو رصيد PayPal، أو راسلنا لنساعدك.",
  },
  invH1: { en: "We couldn't find that order.", fr: "Commande introuvable.", ar: "لم نعثر على هذا الطلب." },
  invBody: {
    en: "This confirmation link is incomplete or has expired. If you paid, your payment is safe: message us with the email you paid with and we'll confirm it.",
    fr: "Ce lien de confirmation est incomplet ou a expiré. Si vous avez payé, votre paiement est en sécurité : écrivez-nous avec l'e-mail utilisé.",
    ar: "رابط التأكيد غير مكتمل أو منتهي الصلاحية. إن كنت قد دفعت فدفعتك محفوظة: راسلنا بالبريد الذي دفعت به وسنؤكدها.",
  },
  back: { en: "Back to the packages", fr: "Retour aux formules", ar: "العودة إلى الباقات" },
  home: { en: "Back to the homepage", fr: "Retour à l'accueil", ar: "العودة إلى الصفحة الرئيسية" },
  custom: { en: "Individual services", fr: "Services à l'unité", ar: "خدمات منفردة" },
};
const t = (k: string, l: Lang) => pick(T[k], l);

function orderLabel(o: Extract<OrderResult, { status: "paid" }>, l: Lang): string {
  if (o.tier) return pick(packageByKey(o.tier).name, l);
  return o.itemCount > 0 ? `${t("custom", l)} (${o.itemCount})` : t("custom", l);
}

export default function SuccessView({ order }: { order: OrderResult }) {
  const [lang, setLang] = useState<Lang>(order.status === "invalid" ? "en" : order.lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    if (order.status !== "invalid") return;
    try { const saved = localStorage.getItem("z-lang"); if (isLang(saved)) window.requestAnimationFrame(() => setLang(saved)); } catch { /* ignore */ }
  }, [order.status]);

  const view = {
    paid: { Icon: CheckCircle, h1: "paidH1", body: "paidBody" },
    pending: { Icon: Clock, h1: "pendH1", body: "pendBody" },
    unfinished: { Icon: AlertCircle, h1: "unfinH1", body: "unfinBody" },
    declined: { Icon: XCircle, h1: "declH1", body: "declBody" },
    refunded: { Icon: AlertCircle, h1: "refH1", body: "refBody" },
    invalid: { Icon: AlertCircle, h1: "invH1", body: "invBody" },
  }[order.status];
  const Icon = view.Icon;
  const paid = order.status === "paid" ? order : null;
  const ref = order.status === "paid" || order.status === "pending" || order.status === "refunded" ? order.ref : null;
  const wa = waLink(ref ? `Hello Zenith Dubai CV. My order reference is ${ref}.` : "Hello Zenith Dubai CV. I need help with my order.");
  const briefHref = paid ? `/order/brief/?token=${encodeURIComponent(paid.orderId)}` : null;

  return (
    <div className="zs" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <style href="zenith-success" precedence="medium">{CSS}</style>
      <header className="ok-top z-wrap">
        <Link href="/" aria-label="Zenith Dubai CV">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="" width={92} height={52} className="ok-logo" />
        </Link>
        <div className="hd-lang" role="group" aria-label="Language">
          {LANGS.map(l => (
            <button key={l.code} type="button" lang={l.code} aria-pressed={lang === l.code} aria-label={l.name} onClick={() => setLang(l.code)}>{l.label}</button>
          ))}
        </div>
      </header>

      <main className="z-wrap ok-main">
        <span className="ok-icon" data-status={order.status}><Icon size={22} strokeWidth={1.75} aria-hidden="true" /></span>
        <h1 className="z-h2">{t(view.h1, lang)}</h1>
        <p className="z-lede" style={{ marginTop: 14 }}>{t(view.body, lang)}</p>

        {(paid || ref) && (
          <dl className="ok-rows">
            {paid && <div><dt>{t("order", lang)}</dt><dd>{orderLabel(paid, lang)}</dd></div>}
            {paid && <div><dt>{t("amount", lang)}</dt><dd dir="ltr">US${paid.amountUsd}{paid.amountAed ? ` · AED ${paid.amountAed}` : ""}</dd></div>}
            {ref && <div><dt>{t("ref", lang)}</dt><dd dir="ltr">{ref}</dd></div>}
          </dl>
        )}

        {paid && (
          <section className="ok-next" aria-labelledby="ok-next-h">
            <h2 id="ok-next-h" className="z-h3">{t("nextH", lang)}</h2>
            <p className="z-body" style={{ marginTop: 8 }}>{t("nextBody", lang)}</p>
            {paid.ebook && <p className="z-small" style={{ marginTop: 10 }}>{t("ebook", lang)}</p>}
            {paid.ai && <p className="z-small" style={{ marginTop: 10 }}>{t("ai", lang)}</p>}
            <div className="ok-actions">
              <a className="z-btn z-btn-primary" href={briefHref!}>{t("brief", lang)}</a>
              {paid.ai && <a className="z-btn z-btn-quiet" href={`/agent/?access=${encodeURIComponent(paid.orderId)}`}>{t("agent", lang)}</a>}
              <a className="z-btn z-btn-quiet" href={wa} target="_blank" rel="noopener noreferrer">{t("whatsapp", lang)}</a>
            </div>
          </section>
        )}

        {!paid && (
          <div className="ok-actions">
            {(order.status === "unfinished" || order.status === "declined") && <Link className="z-btn z-btn-primary" href="/#packages">{t("back", lang)}</Link>}
            <a className="z-btn z-btn-quiet" href={wa} target="_blank" rel="noopener noreferrer">{t("whatsapp", lang)}</a>
          </div>
        )}

        <p className="z-small" style={{ marginTop: 34 }}>
          <Link className="z-link" href="/">{t("home", lang)}</Link> · <a className="z-link" href={`mailto:${CONTACT_EMAIL}`} dir="ltr">{CONTACT_EMAIL}</a>
        </p>
      </main>
    </div>
  );
}

const CSS = `
.ok-top{display:flex;justify-content:space-between;align-items:center;height:72px}
.ok-logo{width:92px;height:auto;border-radius:6px}
html[data-theme="light"] .ok-logo{filter:brightness(0) saturate(0)}
.hd-lang{display:flex;padding:3px;border:1px solid var(--z-rule-strong);border-radius:999px}
.hd-lang button{min-width:36px;height:32px;padding:0 10px;border:0;border-radius:999px;background:transparent;color:var(--z-fg-2);font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.hd-lang button[aria-pressed="true"]{background:var(--z-fg);color:var(--z-bg)}
.ok-main{max-width:680px;padding-block:48px 96px}
.ok-icon{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;border:1px solid var(--z-rule-strong);color:var(--z-gold-text);margin-bottom:22px}
.ok-icon[data-status="declined"],.ok-icon[data-status="invalid"],.ok-icon[data-status="unfinished"]{color:var(--z-error)}
.ok-rows{margin:28px 0 0;border-top:1px solid var(--z-rule)}
.ok-rows div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid var(--z-rule);font-size:15px}
.ok-rows dt{color:var(--z-fg-2)}
.ok-rows dd{margin:0;font-weight:600;text-align:end}
.ok-next{margin-top:32px;padding:26px;border:1px solid var(--z-rule);border-radius:18px;background:var(--z-surface)}
.ok-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px}
`;
