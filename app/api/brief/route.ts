// app/api/brief/route.ts — receives a customer's brief after payment and emails it to Zenith.
// With a PayPal token, the order is checked with PayPal first (it must be paid). Without one
// (Gumroad and other orders) the brief is accepted with the order number the customer gives,
// and marked "to verify" in the email. Files: CV (PDF/Word, ≤ 3 MB) and photo (≤ 3 MB).
// Nothing is stored on the server: the brief exists only as the email in the Zenith inbox.

import { NextRequest, NextResponse } from "next/server";
import { getPayPalConfig, getPayPalOrder, isPayPalOrderId } from "@/lib/checkout/paypal";
import { orderFacts } from "@/lib/checkout/orders";
import { adminAddress, emailConfigured, htmlEmail, sendMail, type Attachment } from "@/lib/email";
import { isLang, CONTACT_EMAIL, WHATSAPP_NUMBER, type Lang } from "@/lib/site";

const CV_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE = 3 * 1024 * 1024;
const validEmail = (v: string) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(v);

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });
const field = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);

const ACK: Record<Lang, { subject: string; title: string; lines: string[] }> = {
  en: {
    subject: "We received your brief",
    title: "Your brief is with us.",
    lines: [
      "Thank you. Your specialist starts now, and your first draft arrives within 48 hours of your complete brief.",
      "If anything is missing, we will ask by email or WhatsApp.",
    ],
  },
  fr: {
    subject: "Nous avons bien reçu votre brief",
    title: "Votre brief est entre nos mains.",
    lines: [
      "Merci. Votre spécialiste commence dès maintenant ; le premier jet arrive sous 48 heures après votre brief complet.",
      "S'il manque quelque chose, nous vous le demanderons par e-mail ou WhatsApp.",
    ],
  },
  ar: {
    subject: "استلمنا معلوماتك",
    title: "معلوماتك وصلت إلينا.",
    lines: [
      "شكراً لك. يبدأ مختصك العمل الآن، وتصلك المسودة الأولى خلال 48 ساعة من استلام معلوماتك كاملة.",
      "إن نقصت أي معلومة، سنسألك عبر البريد أو واتساب.",
    ],
  },
};

export async function POST(req: NextRequest) {
  let fd: FormData;
  try { fd = await req.formData(); } catch { return bad("Invalid request."); }

  // Spam trap: a hidden field people never fill.
  if (field(fd, "website", 200)) return NextResponse.json({ ok: true });

  const token = field(fd, "token", 40);
  const orderNo = field(fd, "orderNo", 80);
  const name = field(fd, "name", 120);
  const email = field(fd, "email", 160);
  const phone = field(fd, "phone", 40);
  const roles = field(fd, "roles", 300);
  const places = field(fd, "places", 300);
  const languages = field(fd, "languages", 20);
  const notes = field(fd, "notes", 4000);
  const langRaw = field(fd, "lang", 4);
  const lang: Lang = isLang(langRaw) ? langRaw : "en";
  const cv = fd.get("cv");
  const photo = fd.get("photo");

  if (!name || !roles || !places) return bad("Please complete the required fields.");
  if (!validEmail(email)) return bad("Invalid email address.");
  if (!token && !orderNo) return bad("Order number is required.");

  const files: Attachment[] = [];
  if (cv instanceof File && cv.size > 0) {
    if (!CV_TYPES.includes(cv.type) || cv.size > MAX_FILE) return bad("The CV must be a PDF or Word file of 3 MB or less.");
    files.push({ filename: cv.name.replace(/[^\w.\- ()]/g, "_").slice(0, 120) || "cv", content: Buffer.from(await cv.arrayBuffer()), contentType: cv.type });
  } else if (notes.length < 50) {
    return bad("Attach a CV or describe your experience in the notes.");
  }
  if (photo instanceof File && photo.size > 0) {
    if (!PHOTO_TYPES.includes(photo.type) || photo.size > MAX_FILE) return bad("The photo must be JPG, PNG or WebP, 3 MB or less.");
    files.push({ filename: photo.name.replace(/[^\w.\- ()]/g, "_").slice(0, 120) || "photo.jpg", content: Buffer.from(await photo.arrayBuffer()), contentType: photo.type });
  }

  // Check the order with PayPal when the customer came from our confirmation page.
  let verified = false;
  let orderLine = `Order number given by the customer: ${orderNo} (TO VERIFY in Gumroad or PayPal)`;
  if (token) {
    const paypal = getPayPalConfig();
    if (!isPayPalOrderId(token) || !paypal) return bad("Invalid order.");
    try {
      const order = await getPayPalOrder(paypal, token);
      const f = orderFacts(order);
      if (order.status !== "COMPLETED" || !f.captureStatus || !["COMPLETED", "PENDING"].includes(f.captureStatus)) return bad("This order is not paid.", 402);
      verified = true;
      orderLine = `Order ${f.ref}: ${f.label}, US$${f.amountUsd} (PayPal ${f.captureStatus.toLowerCase()}, order ${order.id})${f.ebook ? ". Includes The Global Horizon ebook." : ""}${f.ai ? " Includes Pro access to the Zenith AI job agent." : ""}`;
    } catch (err) {
      console.error("[brief] PayPal lookup failed:", err instanceof Error ? err.message : err);
      return bad("We could not check this order right now. Please try again.", 502);
    }
  }

  if (!emailConfigured()) {
    console.error("[brief] SMTP is not configured.");
    return bad("Email is not configured on the server.", 500);
  }

  const lines = [
    orderLine,
    `Name: ${name}`,
    `Email: ${email}`,
    `WhatsApp: ${phone || "-"}`,
    `Target roles: ${roles}`,
    `Countries or cities: ${places}`,
    `CV languages: ${languages || "-"}`,
    `Site language: ${lang.toUpperCase()}`,
    `Files: ${files.map(a => String(a.filename)).join(", ") || "none (experience described in notes)"}`,
  ];
  try {
    await sendMail({
      to: adminAddress()!,
      replyTo: email,
      subject: `${verified ? "Brief" : "Brief (order to verify)"}: ${name}${verified ? "" : `, order ${orderNo}`}`,
      text: [...lines, "", "Notes:", notes || "-"].join("\n"),
      html: htmlEmail({ title: verified ? "New brief for a paid order" : "New brief: check the order number", lines: [...lines, `Notes: ${notes || "-"}`] }),
      attachments: files,
    });
  } catch (err) {
    console.error("[brief] admin email failed:", err instanceof Error ? err.message : err);
    return bad("We could not send your brief. Please try again or use WhatsApp.", 502);
  }

  // Confirmation for the customer. A failure here doesn't undo the brief.
  try {
    const a = ACK[lang];
    await sendMail({
      to: email,
      replyTo: adminAddress()!,
      subject: a.subject,
      text: [...a.lines, "", `${CONTACT_EMAIL} · WhatsApp +${WHATSAPP_NUMBER}`].join("\n"),
      html: htmlEmail({ title: a.title, lines: a.lines, footer: `${CONTACT_EMAIL} · WhatsApp +${WHATSAPP_NUMBER}`, rtl: lang === "ar" }),
    });
  } catch (err) {
    console.error("[brief] acknowledgement email failed:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
