// lib/checkout/orders.ts — server only. Reads a PayPal order into the facts we need, and sends
// the order emails: one to Zenith (what to fulfil) and one to the customer (what happens next).
//
// The system of record for payments is PayPal (Activity → each payment carries the ZN- order
// reference as its invoice id). These emails are notifications, not a database: if email is not
// configured, nothing is lost — PayPal still emails both sides.

import { AI_TIERS, EBOOK_TIERS, SERVICES, TIERS, decodeOrderMeta, type Lang, type TierKey } from "./catalog";
import type { PayPalCapture, PayPalOrder } from "./paypal";
import { adminAddress, emailConfigured, htmlEmail, sendMail } from "@/lib/email";
import { SITE_URL, CONTACT_EMAIL, WHATSAPP_NUMBER, pick } from "@/lib/site";
import { packageByKey } from "@/lib/packages";
import { firstTime } from "@/lib/agent/limits";

export interface OrderFacts {
  orderId: string;
  ref: string;
  lang: Lang;
  label: string;           // English package or service list
  tier: TierKey | null;
  items: string[];
  amountUsd: string;
  amountAed: number;
  captureId: string | null;
  captureStatus: string | null;
  payerEmail: string | null;
  payerName: string | null;
  ebook: boolean;
  ai: boolean;
}

export function orderFacts(order: PayPalOrder): OrderFacts {
  const unit = order.purchase_units?.[0];
  const capture: PayPalCapture | undefined = unit?.payments?.captures?.[0];
  const meta = decodeOrderMeta(unit?.custom_id ?? capture?.custom_id);
  const tier = meta?.tier ?? null;
  const items = meta?.items ?? [];
  const label = tier
    ? TIERS[tier].name
    : items.length
      ? `Individual services: ${items.map(id => SERVICES.find(s => s.id === id)?.name ?? id).join(", ")}`
      : "Order";
  const given = order.payer?.name?.given_name ?? order.payment_source?.paypal?.name?.given_name ?? "";
  const surname = order.payer?.name?.surname ?? order.payment_source?.paypal?.name?.surname ?? "";
  return {
    orderId: order.id,
    ref: meta?.ref ?? order.id,
    lang: meta?.lang ?? "en",
    label,
    tier,
    items,
    amountUsd: capture?.amount?.value ?? unit?.amount?.value ?? "",
    amountAed: meta?.aed ?? 0,
    captureId: capture?.id ?? null,
    captureStatus: capture?.status ?? null,
    payerEmail: order.payer?.email_address ?? order.payment_source?.paypal?.email_address ?? null,
    payerName: `${given} ${surname}`.trim() || null,
    ebook: tier ? EBOOK_TIERS.includes(tier) : items.includes("ebook"),
    ai: tier ? AI_TIERS.includes(tier) : false,
  };
}

export function briefUrl(orderId: string): string {
  return `${SITE_URL}/order/brief/?token=${encodeURIComponent(orderId)}`;
}

/** Personal link that opens the AI job agent with this order's Pro access (checked with PayPal on use). */
export function agentUrl(orderId: string): string {
  return `${SITE_URL}/agent/?access=${encodeURIComponent(orderId)}`;
}

// ── Customer email copy ───────────────────────────────────────────────────────
const CUSTOMER: Record<Lang, {
  subject: (ref: string) => string; title: string; thanks: (label: string) => string; next: string; cta: string;
  ebook: string; ai: (url: string) => string; timing: string; rowsRef: string; rowsPkg: string; rowsPaid: string; help: string; refund: string;
}> = {
  en: {
    subject: ref => `Your Zenith Dubai CV order ${ref}: the next step`,
    title: "Payment received. Thank you.",
    thanks: label => `Your payment for ${label} is confirmed. PayPal will also send you its own receipt.`,
    next: "Next step: send us your brief. It takes about five minutes: upload your current CV and tell us the roles and countries you are targeting.",
    cta: "Send your brief",
    ebook: "Your package includes The Global Horizon ebook. We will email you the PDF separately.",
    ai: url => `Your package includes Pro access to the Zenith AI job agent. Open it with this personal link, which unlocks Pro for your order: ${url} (keep it private).`,
    timing: "Your first draft arrives within 48 hours of receiving your complete brief, and you have unlimited revisions for 30 days after delivery.",
    rowsRef: "Order reference", rowsPkg: "Order", rowsPaid: "Amount paid",
    help: `Questions? Reply to this email, write to ${CONTACT_EMAIL} or message us on WhatsApp (+${WHATSAPP_NUMBER}).`,
    refund: `You can ask for a full refund within 7 days of purchase: ${SITE_URL}/refund/`,
  },
  fr: {
    subject: ref => `Votre commande Zenith Dubai CV ${ref} : l'étape suivante`,
    title: "Paiement reçu. Merci.",
    thanks: label => `Votre paiement pour ${label} est confirmé. PayPal vous envoie également son propre reçu.`,
    next: "Étape suivante : envoyez-nous votre brief. Cela prend environ cinq minutes : votre CV actuel, puis les postes et pays visés.",
    cta: "Envoyer mon brief",
    ebook: "Votre formule inclut l'ebook The Global Horizon. Nous vous enverrons le PDF par un e-mail séparé.",
    ai: url => `Votre formule inclut l'accès Pro à l'agent emploi Zenith AI. Ouvrez-le avec ce lien personnel, qui active Pro pour votre commande : ${url} (gardez-le pour vous).`,
    timing: "Le premier jet arrive sous 48 heures après réception de votre brief complet, avec des révisions illimitées pendant 30 jours après la livraison.",
    rowsRef: "Référence", rowsPkg: "Commande", rowsPaid: "Montant payé",
    help: `Une question ? Répondez à cet e-mail, écrivez à ${CONTACT_EMAIL} ou sur WhatsApp (+${WHATSAPP_NUMBER}).`,
    refund: `Remboursement intégral possible dans les 7 jours suivant l'achat : ${SITE_URL}/refund/`,
  },
  ar: {
    subject: ref => `طلبك لدى Zenith Dubai CV رقم ${ref}: الخطوة التالية`,
    title: "تم استلام الدفع. شكراً لك.",
    thanks: label => `تم تأكيد دفعك مقابل ${label}. سيرسل إليك PayPal إيصاله الخاص أيضاً.`,
    next: "الخطوة التالية: أرسل لنا معلوماتك. يستغرق ذلك نحو خمس دقائق: ارفع سيرتك الحالية وحدّد الوظائف والدول التي تستهدفها.",
    cta: "أرسل معلوماتك",
    ebook: "تتضمن باقتك كتاب The Global Horizon الإلكتروني، وسنرسل إليك ملف PDF في بريد منفصل.",
    ai: url => `تتضمن باقتك وصول Pro إلى وكيل الوظائف Zenith AI. افتحه عبر هذا الرابط الشخصي الذي يفعّل Pro لطلبك: ${url} (احتفظ به لنفسك).`,
    timing: "تصلك المسودة الأولى خلال 48 ساعة من استلام معلوماتك كاملة، مع تعديلات غير محدودة لمدة 30 يوماً بعد التسليم.",
    rowsRef: "رقم الطلب", rowsPkg: "الطلب", rowsPaid: "المبلغ المدفوع",
    help: `لديك سؤال؟ ردّ على هذا البريد أو راسلنا على ${CONTACT_EMAIL} أو عبر واتساب (+${WHATSAPP_NUMBER}).`,
    refund: `يمكنك طلب استرداد كامل خلال 7 أيام من الشراء: ${SITE_URL}/refund/`,
  },
};

/** Emails for a payment this request has just captured. Never throws. */
export async function sendPaidOrderEmails(f: OrderFacts, source: "confirmation page" | "PayPal webhook"): Promise<void> {
  if (!emailConfigured()) {
    console.error(`[orders] ${f.ref}: SMTP is not configured, order emails were not sent.`);
    return;
  }
  const admin = adminAddress()!;
  const link = briefUrl(f.orderId);
  const amount = `US$${f.amountUsd}${f.amountAed ? ` (AED ${f.amountAed})` : ""}`;

  const adminLines = [
    `Paid order ${f.ref}: ${f.label}, ${amount}.`,
    `Customer: ${f.payerName ?? "name not shared"} <${f.payerEmail ?? "email not shared"}>.`,
    f.ebook ? "To do: email the customer The Global Horizon PDF." : "",
    f.ai ? `Includes Pro access to the Zenith AI job agent. The customer's agent link: ${agentUrl(f.orderId)}` : "",
    "The customer has been sent a link to submit their brief. You will receive it by email.",
    `Recorded by the ${source}. The payment itself is in PayPal → Activity (invoice id ${f.ref}).`,
  ].filter(Boolean);

  try {
    await sendMail({
      to: admin,
      replyTo: f.payerEmail ?? undefined,
      subject: `Paid order ${f.ref}: ${f.label}, US$${f.amountUsd}`,
      text: [...adminLines, "", `PayPal order: ${f.orderId}`, `Capture: ${f.captureId ?? "-"} (${f.captureStatus ?? "-"})`, `Brief link: ${link}`].join("\n"),
      html: htmlEmail({
        title: `Paid order ${f.ref}`,
        lines: adminLines,
        rows: [["Package", f.label], ["Amount", amount], ["PayPal order", f.orderId], ["Capture", `${f.captureId ?? "-"} (${f.captureStatus ?? "-"})`], ["Language", f.lang.toUpperCase()]],
        cta: { label: "Open the customer's brief link", href: link },
      }),
    });
  } catch (err) {
    console.error(`[orders] ${f.ref}: admin email failed:`, err instanceof Error ? err.message : err);
  }

  if (!f.payerEmail) return;
  const c = CUSTOMER[f.lang];
  const localLabel = f.tier ? pick(packageByKey(f.tier).name, f.lang) : f.label;
  const lines = [c.thanks(localLabel), c.next, f.ebook ? c.ebook : "", f.ai ? c.ai(agentUrl(f.orderId)) : "", c.timing].filter(Boolean);
  try {
    await sendMail({
      to: f.payerEmail,
      replyTo: admin,
      subject: c.subject(f.ref),
      text: [...lines, "", `${c.cta}: ${link}`, "", `${c.rowsRef}: ${f.ref}`, `${c.rowsPaid}: ${amount}`, "", c.help, c.refund].join("\n"),
      html: htmlEmail({
        title: c.title,
        lines,
        rows: [[c.rowsRef, f.ref], [c.rowsPkg, localLabel], [c.rowsPaid, amount]],
        cta: { label: c.cta, href: link },
        footer: `${c.help} ${c.refund}`,
        rtl: f.lang === "ar",
      }),
    });
  } catch (err) {
    console.error(`[orders] ${f.ref}: customer email failed:`, err instanceof Error ? err.message : err);
  }
}

/** A short note to Zenith about a payment event that needs attention. Never throws. */
export async function sendAdminNotice(subject: string, lines: string[]): Promise<void> {
  if (!emailConfigured()) {
    console.error(`[orders] SMTP not configured; notice not sent: ${subject}`);
    return;
  }
  try {
    await sendMail({ to: adminAddress()!, subject, text: lines.join("\n"), html: htmlEmail({ title: subject, lines }) });
  } catch (err) {
    console.error("[orders] notice email failed:", err instanceof Error ? err.message : err);
  }
}

// ── Payment status emails (declined, held for review) ─────────────────────────
// Sent only for an outcome PayPal itself reported to this server (a declined capture, a capture
// held for review, a denied payment): never for something only the browser saw. Each outcome is
// emailed once per order. No card details are ever included: PayPal doesn't share them.

const STATUS: Record<Lang, { declined: { subject: (ref: string) => string; title: string; lines: string[] }; pending: { subject: (ref: string) => string; title: string; lines: string[] }; denied: { subject: (ref: string) => string; title: string; lines: string[] }; retry: string; help: string }> = {
  en: {
    declined: {
      subject: ref => `Your payment for order ${ref} was not completed`,
      title: "Your payment was not completed",
      lines: ["PayPal told us that this payment was declined, so nothing has been charged and your order is not placed.",
        "A decline usually comes from the bank that issued the card (for example, not enough available balance or an online payment limit). PayPal doesn't tell us the exact reason; your bank can.",
        "You can try again with another card or your PayPal balance, or pay by card, Apple Pay or Google Pay through Gumroad."],
    },
    pending: {
      subject: ref => `Your payment for order ${ref} is under review`,
      title: "Payment received, now under review",
      lines: ["PayPal is reviewing this payment before it completes. This is routine and usually takes less than 24 hours.",
        "We will start your order as soon as PayPal confirms the payment. Please don't pay again."],
    },
    denied: {
      subject: ref => `Your payment for order ${ref} was denied`,
      title: "Your payment was denied",
      lines: ["PayPal has denied this payment after reviewing it, so nothing has been charged and your order is not placed.",
        "You can try again with another card or your PayPal balance, or pay by card, Apple Pay or Google Pay through Gumroad."],
    },
    retry: "See the packages",
    help: `Questions? Reply to this email, write to ${CONTACT_EMAIL} or message us on WhatsApp (+${WHATSAPP_NUMBER}).`,
  },
  fr: {
    declined: {
      subject: ref => `Votre paiement pour la commande ${ref} n'a pas abouti`,
      title: "Votre paiement n'a pas abouti",
      lines: ["PayPal nous a indiqué que ce paiement a été refusé : rien n'a été débité et votre commande n'est pas passée.",
        "Un refus vient en général de la banque qui a émis la carte (solde disponible insuffisant ou plafond de paiement en ligne, par exemple). PayPal ne nous donne pas le motif exact ; votre banque peut vous le donner.",
        "Vous pouvez réessayer avec une autre carte ou votre solde PayPal, ou payer par carte, Apple Pay ou Google Pay via Gumroad."],
    },
    pending: {
      subject: ref => `Votre paiement pour la commande ${ref} est en cours de vérification`,
      title: "Paiement reçu, en cours de vérification",
      lines: ["PayPal vérifie ce paiement avant de le finaliser. C'est une vérification de routine, en général sous 24 heures.",
        "Nous lancerons votre commande dès que PayPal confirmera le paiement. Merci de ne pas payer une seconde fois."],
    },
    denied: {
      subject: ref => `Votre paiement pour la commande ${ref} a été refusé`,
      title: "Votre paiement a été refusé",
      lines: ["Après vérification, PayPal a refusé ce paiement : rien n'a été débité et votre commande n'est pas passée.",
        "Vous pouvez réessayer avec une autre carte ou votre solde PayPal, ou payer par carte, Apple Pay ou Google Pay via Gumroad."],
    },
    retry: "Voir les formules",
    help: `Une question ? Répondez à cet e-mail, écrivez à ${CONTACT_EMAIL} ou sur WhatsApp (+${WHATSAPP_NUMBER}).`,
  },
  ar: {
    declined: {
      subject: ref => `لم يكتمل دفعك للطلب ${ref}`,
      title: "لم يكتمل دفعك",
      lines: ["أبلغنا PayPal أن هذه الدفعة رُفضت، لذلك لم يُخصم أي مبلغ ولم يُسجَّل طلبك.",
        "يأتي الرفض عادةً من البنك الذي أصدر البطاقة (مثل عدم كفاية الرصيد المتاح أو حدّ الدفع عبر الإنترنت). لا يخبرنا PayPal بالسبب الدقيق، ويمكن لبنكك إخبارك به.",
        "يمكنك المحاولة مجدداً ببطاقة أخرى أو برصيد PayPal، أو الدفع بالبطاقة أو Apple Pay أو Google Pay عبر Gumroad."],
    },
    pending: {
      subject: ref => `دفعك للطلب ${ref} قيد المراجعة`,
      title: "تم استلام الدفع وهو قيد المراجعة",
      lines: ["يراجع PayPal هذه الدفعة قبل إتمامها. هذا إجراء روتيني يستغرق عادةً أقل من 24 ساعة.",
        "سنبدأ طلبك فور تأكيد PayPal للدفع. يُرجى عدم الدفع مرة أخرى."],
    },
    denied: {
      subject: ref => `رُفض دفعك للطلب ${ref}`,
      title: "رُفض دفعك",
      lines: ["رفض PayPal هذه الدفعة بعد مراجعتها، لذلك لم يُخصم أي مبلغ ولم يُسجَّل طلبك.",
        "يمكنك المحاولة مجدداً ببطاقة أخرى أو برصيد PayPal، أو الدفع بالبطاقة أو Apple Pay أو Google Pay عبر Gumroad."],
    },
    retry: "عرض الباقات",
    help: `لديك سؤال؟ ردّ على هذا البريد أو راسلنا على ${CONTACT_EMAIL} أو عبر واتساب (+${WHATSAPP_NUMBER}).`,
  },
};

/**
 * Tells the customer (when PayPal shared their email) and Zenith about a payment outcome PayPal
 * reported: declined at capture, held for review, or denied after review. Once per order and
 * outcome; never throws.
 */
export async function sendPaymentStatusEmails(f: OrderFacts, kind: "declined" | "pending" | "denied", source: string): Promise<void> {
  try {
    if (!(await firstTime(`pay-status:${kind}:${f.orderId}`, 60 * 86400))) return;
  } catch { /* send anyway */ }
  const amount = f.amountUsd ? `US$${f.amountUsd}${f.amountAed ? ` (AED ${f.amountAed})` : ""}` : "-";
  const what = kind === "declined" ? "Payment declined" : kind === "pending" ? "Payment held for review" : "Payment denied";
  await sendAdminNotice(`${what}: ${f.ref}`, [
    `${what} for ${f.label}, ${amount}.`,
    `Customer: ${f.payerName ?? "name not shared"} <${f.payerEmail ?? "email not shared"}>.`,
    kind === "pending" ? "Do not start this order until PayPal completes the payment." : "Nothing was charged. Do not start this order.",
    `Reported by the ${source}. PayPal order ${f.orderId}.`,
    f.payerEmail ? "The customer has been emailed about it." : "PayPal didn't share the customer's email, so they were not emailed.",
  ]);
  if (!f.payerEmail || !emailConfigured()) return;
  const c = STATUS[f.lang];
  const m = c[kind];
  const packages = `${SITE_URL}/#packages`;
  try {
    await sendMail({
      to: f.payerEmail,
      replyTo: adminAddress() ?? undefined,
      subject: m.subject(f.ref),
      text: [...m.lines, "", `${c.retry}: ${packages}`, "", c.help].join("\n"),
      html: htmlEmail({ title: m.title, lines: m.lines, rows: [[CUSTOMER[f.lang].rowsRef, f.ref]], cta: kind === "pending" ? undefined : { label: c.retry, href: packages }, footer: c.help, rtl: f.lang === "ar" }),
    });
  } catch (err) {
    console.error(`[orders] ${f.ref}: ${kind} email failed:`, err instanceof Error ? err.message : err);
  }
}
