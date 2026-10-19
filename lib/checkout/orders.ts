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
    ebook: tier ? EBOOK_TIERS.includes(tier) : false,
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
