"use client";
import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Moon, Mail, CheckCircle, Clock, AlertCircle, XCircle, ArrowLeft } from "lucide-react";
import type { Lang, TierKey } from "@/lib/checkout/catalog";

// ── Tokens (mirrors page.tsx) ────────────────────────────────────────────────
const G = "#C8A96E", GL = "#E2C98E", INK = "#0A0907", ASH = "#F7F3EE";
const WA = "971502879462", EM = "info@zenithdubaicv.com";

const LANGS: { code: Lang; label: string; dir: "ltr" | "rtl"; font: string }[] = [
  { code: "en", label: "EN", dir: "ltr", font: "'Georgia','Times New Roman',serif" },
  { code: "ar", label: "ع",  dir: "rtl", font: "'IBM Plex Sans Arabic','Noto Naskh Arabic','Tahoma',sans-serif" },
  { code: "fr", label: "FR", dir: "ltr", font: "'Georgia','Times New Roman',serif" },
];

const TX: Record<string, Record<Lang, string>> = {
  eyebrow:     { en: "Order confirmed", ar: "تم تأكيد الطلب", fr: "Commande confirmée" },
  paidH1:      { en: "Payment received.", ar: "تم استلام الدفع.", fr: "Paiement reçu." },
  paidBody:    { en: "Thank you — your engagement with Zenith Dubai CV is secured. A receipt from PayPal is on its way to your inbox.", ar: "شكراً لك — تم تأكيد تعاقدك مع Zenith Dubai CV. سيصلك إيصال من PayPal على بريدك الإلكتروني.", fr: "Merci — votre mission avec Zenith Dubai CV est confirmée. Un reçu PayPal vous est envoyé par e-mail." },
  rowOrder:    { en: "Order", ar: "الطلب", fr: "Commande" },
  rowAmount:   { en: "Amount paid", ar: "المبلغ المدفوع", fr: "Montant payé" },
  rowRef:      { en: "Order reference", ar: "مرجع الطلب", fr: "Référence" },
  nextEyebrow: { en: "Next step", ar: "الخطوة التالية", fr: "Étape suivante" },
  nextH2:      { en: "Send us your current CV and target role.", ar: "أرسل لنا سيرتك الذاتية الحالية والدور المستهدف.", fr: "Envoyez-nous votre CV actuel et le poste visé." },
  nextBody:    { en: "Your specialist begins as soon as we receive them. Quote your order reference so we can match your payment instantly.", ar: "يبدأ متخصصك فور استلامها. اذكر مرجع طلبك لنطابق دفعتك فوراً.", fr: "Votre spécialiste démarre dès réception. Indiquez votre référence pour que nous retrouvions votre paiement immédiatement." },
  btnWA:       { en: "Send via WhatsApp", ar: "الإرسال عبر واتساب", fr: "Envoyer par WhatsApp" },
  btnEmail:    { en: "Send by email", ar: "الإرسال بالبريد الإلكتروني", fr: "Envoyer par e-mail" },
  backHome:    { en: "Back to home", ar: "العودة إلى الرئيسية", fr: "Retour à l'accueil" },
  backTiers:   { en: "View the tiers", ar: "عرض المستويات", fr: "Voir les niveaux" },
  unfinH1:     { en: "Payment not completed.", ar: "لم يكتمل الدفع.", fr: "Paiement non finalisé." },
  unfinBody:   { en: "This payment was not completed, so nothing has been charged. If you left PayPal early, you can return to the tiers and try again.", ar: "لم تكتمل عملية الدفع هذه، لذلك لم يُخصم أي مبلغ. إذا غادرت صفحة PayPal قبل الإتمام، يمكنك العودة إلى المستويات والمحاولة مجدداً.", fr: "Ce paiement n'a pas été finalisé : aucun montant n'a été débité. Si vous avez quitté PayPal avant la fin, revenez aux niveaux et réessayez." },
  pendH1:      { en: "Payment received — under review.", ar: "تم استلام الدفع — قيد المراجعة.", fr: "Paiement reçu — en cours de vérification." },
  pendBody:    { en: "PayPal is completing a routine check on this payment. You will receive an email from PayPal as soon as it is confirmed — usually within 24 hours. You can already send us your CV and target role.", ar: "يُجري PayPal تحققاً روتينياً من هذه الدفعة. سيصلك بريد إلكتروني من PayPal فور تأكيدها — عادةً خلال 24 ساعة. يمكنك منذ الآن إرسال سيرتك الذاتية والدور المستهدف.", fr: "PayPal effectue une vérification de routine sur ce paiement. Vous recevrez un e-mail de PayPal dès sa confirmation — généralement sous 24 heures. Vous pouvez déjà nous envoyer votre CV et le poste visé." },
  declH1:      { en: "Payment declined.", ar: "تم رفض الدفع.", fr: "Paiement refusé." },
  declBody:    { en: "Your bank or PayPal declined this payment, so nothing has been charged. Please try again with another card or your PayPal balance — or message us and we will help.", ar: "رفض البنك أو PayPal هذه الدفعة، لذلك لم يُخصم أي مبلغ. يرجى المحاولة مجدداً ببطاقة أخرى أو برصيد PayPal — أو راسلنا وسنساعدك.", fr: "Votre banque ou PayPal a refusé ce paiement : aucun montant n'a été débité. Réessayez avec une autre carte ou votre solde PayPal — ou écrivez-nous, nous vous aiderons." },
  invH1:       { en: "We could not find that order.", ar: "لم نتمكن من العثور على هذا الطلب.", fr: "Commande introuvable." },
  invBody:     { en: "This confirmation link is incomplete or has expired. If you completed a payment, it is safe — message us with the email you paid with and we will confirm it right away.", ar: "رابط التأكيد هذا غير مكتمل أو انتهت صلاحيته. إذا أتممت الدفع فهو آمن — راسلنا بالبريد الإلكتروني الذي دفعت به وسنؤكده فوراً.", fr: "Ce lien de confirmation est incomplet ou a expiré. Si vous avez payé, votre paiement est en sécurité — écrivez-nous avec l'e-mail utilisé et nous le confirmerons aussitôt." },
  helpWA:      { en: "WhatsApp", ar: "واتساب", fr: "WhatsApp" },
  helpEmail:   { en: "Email us", ar: "راسلنا", fr: "Nous écrire" },
  tierWord:    { en: "tier", ar: "المستوى", fr: "Niveau" },
  custom:      { en: "Custom Package", ar: "باقة مخصصة", fr: "Forfait sur mesure" },
  services:    { en: "services", ar: "خدمات", fr: "services" },
  bundleWord:  { en: "Bundle", ar: "باقة", fr: "Forfait" },
};
const tr = (k: string, l: Lang): string => TX[k]?.[l] ?? TX[k]?.en ?? k;

const TIER_NAMES: Record<TierKey, Record<Lang, string>> = {
  foundation: { en: "Foundation", ar: "الأساسية",  fr: "Fondation" },
  growth:     { en: "Growth",     ar: "النمو",      fr: "Croissance" },
  executive:  { en: "Executive",  ar: "التنفيذية", fr: "Exécutif" },
  apex:       { en: "Apex",       ar: "أبيكس",     fr: "Apex" },
};
const BUNDLE_NAMES: Record<string, Record<Lang, string>> = {
  "job-hunter":     { en: "Job Hunter",     ar: "باحث عن عمل", fr: "Chercheur d'emploi" },
  "international":  { en: "International",  ar: "دولي",        fr: "International" },
  "career-upgrade": { en: "Career Upgrade", ar: "ترقية مهنية", fr: "Mise à niveau carrière" },
};

export type OrderResult =
  | { status: "paid"; lang: Lang; ref: string; amountUsd: string; amountAed: number; tier: TierKey | null; bundle: string | null; itemCount: number }
  | { status: "pending"; lang: Lang; ref: string }
  | { status: "unfinished"; lang: Lang }
  | { status: "declined"; lang: Lang }
  | { status: "invalid" };

// Theme preference — same localStorage key as the main site (dark unless "light" was chosen)
const themeListeners = new Set<() => void>();
const subscribeTheme = (cb: () => void) => { themeListeners.add(cb); return () => { themeListeners.delete(cb); }; };
const readTheme = () => localStorage.getItem("z-theme") !== "light";

type Paid = Extract<OrderResult, { status: "paid" }>;

function orderLabel(o: Paid, l: Lang): string {
  if (o.tier) {
    const n = TIER_NAMES[o.tier][l];
    return l === "en" ? `${n} ${tr("tierWord", l)}` : `${tr("tierWord", l)} ${n}`;
  }
  if (o.bundle && BUNDLE_NAMES[o.bundle]) {
    const n = BUNDLE_NAMES[o.bundle][l];
    return l === "en" ? `${n} ${tr("bundleWord", l)}` : `${tr("bundleWord", l)} ${n}`;
  }
  return o.itemCount > 0 ? `${tr("custom", l)} (${o.itemCount} ${tr("services", l)})` : tr("custom", l);
}

function contactLinks(o: OrderResult, l: Lang): { wa: string; mail: string } {
  if (o.status === "pending") {
    const msg = {
      en: `Hello Zenith Dubai CV. I have just paid via PayPal (under review).\nOrder reference: ${o.ref}\n\nHere are my current CV and my target role:`,
      ar: `مرحباً Zenith Dubai CV. لقد دفعت للتو عبر PayPal (قيد المراجعة).\nمرجع الطلب: ${o.ref}\n\nإليكم سيرتي الذاتية الحالية والدور المستهدف:`,
      fr: `Bonjour Zenith Dubai CV. Je viens de payer via PayPal (en cours de vérification).\nRéférence de commande : ${o.ref}\n\nVoici mon CV actuel et le poste que je vise :`,
    }[l];
    return { wa: `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, mail: `mailto:${EM}?subject=${encodeURIComponent(`Order ${o.ref} — PayPal under review`)}&body=${encodeURIComponent(msg)}` };
  }
  if (o.status !== "paid") {
    const msg = { en: "Hello. I need help with my Zenith Dubai CV order.", ar: "مرحباً. أحتاج مساعدة بخصوص طلبي لدى Zenith Dubai CV.", fr: "Bonjour. J'ai besoin d'aide concernant ma commande Zenith Dubai CV." }[l];
    return { wa: `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, mail: `mailto:${EM}?subject=${encodeURIComponent("Order help — Zenith Dubai CV")}` };
  }
  const label = orderLabel(o, l);
  const msg = {
    en: `Hello Zenith Dubai CV. I have just paid for the ${label}.\nOrder reference: ${o.ref}\n\nHere are my current CV and my target role:`,
    ar: `مرحباً Zenith Dubai CV. لقد أتممت الدفع مقابل: ${label}.\nمرجع الطلب: ${o.ref}\n\nإليكم سيرتي الذاتية الحالية والدور المستهدف:`,
    fr: `Bonjour Zenith Dubai CV. Je viens de régler : ${label}.\nRéférence de commande : ${o.ref}\n\nVoici mon CV actuel et le poste que je vise :`,
  }[l];
  return {
    wa: `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,
    mail: `mailto:${EM}?subject=${encodeURIComponent(`Order ${o.ref} — ${orderLabel(o, "en")}`)}&body=${encodeURIComponent(msg)}`,
  };
}

export default function SuccessView({ order }: { order: OrderResult }) {
  const dark = useSyncExternalStore(subscribeTheme, readTheme, () => true);
  const [lang, setLang] = useState<Lang>(order.status === "invalid" ? "en" : order.lang);

  const tog = () => { localStorage.setItem("z-theme", dark ? "light" : "dark"); themeListeners.forEach(cb => cb()); };

  const LG = LANGS.find(l => l.code === lang)!;
  const isAr = LG.dir === "rtl";

  const bg   = dark ? INK : ASH;
  const hi   = dark ? "#EDE8E0" : "#1A1410";
  const sub  = dark ? "#7A6E66" : "#8A7E74";
  const mid  = dark ? "#B8A89C" : "#6A5A50";
  const bdr  = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const card = dark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.92)";
  const logoFilter = dark ? "brightness(1.05) drop-shadow(0 0 6px rgba(200,169,110,0.12))" : "brightness(0) saturate(0) contrast(1)";
  const track = isAr ? "0.05em" : "0.30em";

  const paid = order.status === "paid";
  const pending = order.status === "pending";
  const { wa, mail } = contactLinks(order, lang);
  const VIEW = {
    paid:       { Icon: CheckCircle, h1: "paidH1",  body: "paidBody" },
    pending:    { Icon: Clock,       h1: "pendH1",  body: "pendBody" },
    unfinished: { Icon: AlertCircle, h1: "unfinH1", body: "unfinBody" },
    declined:   { Icon: XCircle,     h1: "declH1",  body: "declBody" },
    invalid:    { Icon: AlertCircle, h1: "invH1",   body: "invBody" },
  }[order.status];
  const Icon = VIEW.Icon;
  const h1 = tr(VIEW.h1, lang);
  const body = tr(VIEW.body, lang);

  const rows: [string, string, boolean][] = pending ? [[tr("rowRef", lang), order.ref, true]] : paid ? [
    [tr("rowOrder", lang), orderLabel(order, lang), false],
    [tr("rowAmount", lang), order.amountAed > 0 ? `$${order.amountUsd} USD · ${order.amountAed.toLocaleString("en-US")} AED` : `$${order.amountUsd} USD`, true],
    [tr("rowRef", lang), order.ref, true],
  ] : [];

  const primaryBtn: React.CSSProperties = { background: G, color: INK, height: "48px", fontFamily: "sans-serif", boxShadow: `0 5px 24px ${G}28`, letterSpacing: isAr ? "0.04em" : "0.16em", textDecoration: "none" };
  const ghostBtn: React.CSSProperties = { border: `1px solid ${G}35`, color: dark ? GL : G, height: "48px", fontFamily: "sans-serif", background: "transparent", letterSpacing: isAr ? "0.04em" : "0.16em", textDecoration: "none" };

  return (
    <div className="min-h-screen w-full overflow-x-hidden" dir={LG.dir} style={{ background: bg, color: hi, fontFamily: LG.font, transition: "background 0.7s ease, color 0.4s ease" }}>
      <style>{`
        [dir="rtl"] { -webkit-font-smoothing: antialiased; line-height: 2.0; }
        [dir="rtl"] h1, [dir="rtl"] h2 { line-height: 1.5; letter-spacing: 0 !important; }
      `}</style>
      {dark && <div className="pointer-events-none fixed inset-0" style={{ background: `radial-gradient(ellipse 55% 35% at 50% -4%,${G}0A,transparent 60%)` }} />}

      {/* ── Top bar ── */}
      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-5 sm:px-8" style={{ height: "72px" }}>
        <Link href="/" className="flex items-center shrink-0"><img src="/images/logo.png" alt="Zenith Dubai CV" style={{ height: "auto", width: "96px", objectFit: "contain", display: "block", borderRadius: "6px", filter: logoFilter, transition: "filter 0.4s ease" }} /></Link>
        <div className="flex items-center gap-2" dir="ltr">
          <div className="flex items-center rounded-full p-0.5" style={{ border: `1px solid ${dark ? `${G}20` : `${G}25`}` }}>
            {LANGS.map(l => (
              <button key={l.code} type="button" onClick={() => setLang(l.code)} aria-pressed={l.code === lang} className="rounded-full px-2.5 text-[9px] font-medium uppercase transition-all duration-300" style={{ height: "24px", fontFamily: "sans-serif", letterSpacing: "0.12em", border: "none", cursor: "pointer", background: l.code === lang ? G : "transparent", color: l.code === lang ? INK : dark ? `${G}70` : G }}>{l.label}</button>
            ))}
          </div>
          <button type="button" onClick={tog} aria-label="Toggle theme" className="flex items-center justify-center rounded-full transition-all duration-300" style={{ width: "30px", height: "30px", border: `1px solid ${dark ? `${G}20` : `${G}25`}`, color: dark ? `${G}70` : G, background: "transparent", cursor: "pointer" }}>{dark ? <Moon size={11} strokeWidth={1.5} /> : <Sun size={11} strokeWidth={1.5} />}</button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-xl px-5 sm:px-8 pt-10 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: isAr ? "right" : "left" }}>

          <div className="mb-8 h-12 w-12 rounded-full flex items-center justify-center" style={{ border: `1px solid ${G}35`, background: `${G}0A` }}><Icon size={18} color={G} strokeWidth={1.5} /></div>
          {paid && <p className="text-[9px] font-medium uppercase mb-5" style={{ color: dark ? `${G}90` : G, fontFamily: "sans-serif", letterSpacing: isAr ? "0.08em" : "0.40em" }}>{tr("eyebrow", lang)}</p>}
          <h1 className="text-3xl sm:text-[40px] font-normal tracking-tight leading-[1.15] mb-5" style={{ color: hi }}>{paid ? <em style={{ fontStyle: "italic", color: G }}>{h1}</em> : h1}</h1>
          <p className="text-sm mb-10" style={{ color: mid, fontFamily: isAr ? LG.font : "sans-serif", fontWeight: 300, lineHeight: 2 }}>{body}</p>

          {paid || pending ? (<>
            {/* ── Order summary ── */}
            <div className="rounded-2xl overflow-hidden mb-6" style={{ background: dark ? "rgba(200,169,110,0.04)" : "rgba(200,169,110,0.06)", border: `1px solid ${G}25` }}>
              <div className="h-px w-full" style={{ background: `linear-gradient(90deg,transparent,${G}55,transparent)` }} />
              <div className="px-6 py-2">
                {rows.map(([k, v, ltr], i) => (
                  <div key={k} className="flex items-center justify-between gap-4 py-3.5" style={{ borderTop: i > 0 ? `1px solid ${G}14` : "none" }}>
                    <p className="text-[9px] font-medium uppercase shrink-0" style={{ color: sub, fontFamily: "sans-serif", letterSpacing: isAr ? "0.04em" : "0.20em" }}>{k}</p>
                    <p className="text-[13px] font-medium" dir={ltr ? "ltr" : undefined} style={{ color: dark ? GL : "#8A6A2A", fontFamily: ltr || !isAr ? "sans-serif" : LG.font, textAlign: isAr ? "left" : "right" }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Next step ── */}
            <div className="rounded-2xl p-6 sm:p-7" style={{ background: card, border: `1px solid ${bdr}` }}>
              <p className="text-[9px] font-medium uppercase mb-4" style={{ color: dark ? `${G}90` : G, fontFamily: "sans-serif", letterSpacing: track }}>{tr("nextEyebrow", lang)}</p>
              <h2 className="text-xl font-normal mb-3" style={{ color: hi }}>{tr("nextH2", lang)}</h2>
              <p className="text-[13px] mb-6" style={{ color: mid, fontFamily: isAr ? LG.font : "sans-serif", fontWeight: 300, lineHeight: 1.9 }}>{tr("nextBody", lang)}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={wa} target="_blank" rel="noopener noreferrer" className="flex w-full shrink-0 sm:flex-1 items-center justify-center gap-2 px-5 rounded-full text-[10px] font-medium uppercase transition-all duration-300 hover:opacity-85" style={primaryBtn}>{tr("btnWA", lang)}</a>
                <a href={mail} className="flex w-full shrink-0 sm:flex-1 items-center justify-center gap-2 px-5 rounded-full text-[10px] font-medium uppercase transition-all duration-300 hover:opacity-75" style={ghostBtn}><Mail size={12} strokeWidth={1.5} />{tr("btnEmail", lang)}</a>
              </div>
              <p className="mt-4 text-[11px] text-center" dir="ltr" style={{ color: sub, fontFamily: "sans-serif" }}>{EM}</p>
            </div>
          </>) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="flex w-full shrink-0 sm:flex-1 items-center justify-center gap-2 px-5 rounded-full text-[10px] font-medium uppercase transition-all duration-300 hover:opacity-85" style={primaryBtn}>{tr("helpWA", lang)}</a>
              <a href={mail} className="flex w-full shrink-0 sm:flex-1 items-center justify-center gap-2 px-5 rounded-full text-[10px] font-medium uppercase transition-all duration-300 hover:opacity-75" style={ghostBtn}><Mail size={12} strokeWidth={1.5} />{tr("helpEmail", lang)}</a>
            </div>
          )}

          <Link href={paid || pending ? "/" : "/#investment"} className="mt-10 inline-flex items-center gap-2 text-[9px] font-medium uppercase transition-opacity hover:opacity-70" style={{ color: dark ? `${G}90` : G, fontFamily: "sans-serif", letterSpacing: isAr ? "0.05em" : "0.22em", textDecoration: "none" }}>
            <ArrowLeft size={11} strokeWidth={1.5} style={{ transform: isAr ? "scaleX(-1)" : "none" }} />{paid || pending ? tr("backHome", lang) : tr("backTiers", lang)}
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
