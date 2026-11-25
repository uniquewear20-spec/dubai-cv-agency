// app/api/review/route.ts — a client's statement about their experience. Nothing is stored or
// published here: the submission is emailed to the Zenith inbox with the exact consent wording,
// for a person to verify against a real order before anything goes on the site (lib/testimonials.ts).

import { NextRequest, NextResponse } from "next/server";
import { adminAddress, emailConfigured, htmlEmail, sendMail } from "@/lib/email";
import { allow, clientIp } from "@/lib/agent/limits";
import { isLang } from "@/lib/site";
import { CONSENT_TEXT, CONSENT_VERSION, REVIEW_DISPLAY, REVIEW_LIMITS, REVIEW_SERVICES, type ReviewDisplay, type ReviewService } from "@/lib/review";

export const dynamic = "force-dynamic";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
const isEmail = (v: string) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(v);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object") return fail("invalid");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail("invalid");
  }
  const str = (k: string, max: number) => (typeof body[k] === "string" ? (body[k] as string).replace(/\s+/g, " ").trim().slice(0, max) : "");

  // Spam trap: a hidden field people leave empty.
  if (str("website", 200)) return NextResponse.json({ ok: true });

  if (!allow("review", clientIp(req.headers), 5, 60 * 60 * 1000)) return fail("rate", 429);

  const name = str("name", REVIEW_LIMITS.name);
  const email = str("email", REVIEW_LIMITS.email);
  const order = str("order", REVIEW_LIMITS.order);
  const role = str("role", REVIEW_LIMITS.role);
  const message = typeof body.message === "string" ? body.message.trim().slice(0, REVIEW_LIMITS.messageMax) : "";
  const service = str("service", 20) as ReviewService;
  const display = str("display", 20) as ReviewDisplay;
  const lang = isLang(body.lang) ? body.lang : "en";
  const publish = body.publish === true;

  if (!name || !email || !message) return fail("missing");
  if (!isEmail(email)) return fail("email");
  if (message.length < REVIEW_LIMITS.messageMin) return fail("short");
  if (!REVIEW_SERVICES.includes(service)) return fail("invalid");
  if (!REVIEW_DISPLAY.includes(display)) return fail("invalid");

  if (!emailConfigured()) return fail("unavailable", 503);

  const when = new Date().toISOString();
  const shownAs = display === "full" ? name : display === "initial" ? `${name.split(" ")[0]} ${name.split(" ").slice(1).map(w => w[0] ? `${w[0]}.` : "").join(" ")}`.trim() : "Anonymous";
  const consentLine = publish
    ? `Consent to publish: YES (consent text v${CONSENT_VERSION}, ${lang.toUpperCase()}): "${CONSENT_TEXT[lang]}"`
    : "Consent to publish: NO. Private feedback only; do not publish.";

  try {
    await sendMail({
      to: adminAddress()!,
      replyTo: email,
      subject: `[Review] ${publish ? "Consent to publish" : "Private feedback"} from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Order reference: ${order || "not given"}`,
        `Service: ${service}`,
        `Role and market: ${role || "not given"}`,
        `Display choice: ${display} (would show as: ${shownAs})`,
        `Language: ${lang}`,
        `Received: ${when}`,
        "",
        consentLine,
        "",
        "Statement:",
        message,
        "",
        "Before publishing: match this to a real order, confirm with the client, then add it to lib/testimonials.ts with verified: true.",
      ].join("\n"),
      html: htmlEmail({
        title: publish ? `Review with consent to publish: ${name}` : `Private feedback: ${name}`,
        lines: [message, consentLine],
        rows: [
          ["Email", email],
          ["Order reference", order || "not given"],
          ["Service", service],
          ["Role and market", role || "not given"],
          ["Display choice", `${display} (shows as: ${shownAs})`],
          ["Language", lang],
          ["Received", when],
        ],
        footer: "Before publishing: match this to a real order, confirm with the client, then add it to lib/testimonials.ts with verified: true.",
        rtl: false,
      }),
    });
  } catch (err) {
    console.error("[review] send failed", err instanceof Error ? err.message.slice(0, 120) : "unknown");
    return fail("unavailable", 503);
  }
  return NextResponse.json({ ok: true });
}
