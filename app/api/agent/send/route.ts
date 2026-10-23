// app/api/agent/send/route.ts — sends one job application by email, for a candidate who approved it.
//
// This is the only automated submission the agent makes, because it is the only channel where an
// employer has published how to apply (an email address in the listing) and no platform rules,
// sign-in or CAPTCHA stand in the way. Job boards and employer application forms are never filled
// in automatically: the candidate opens them and applies there.
//
// Conditions: a verified Advanced Career Support or Executive Career Suite purchase, the candidate's
// explicit approval of this exact message (approve=yes), and a daily allowance. The email goes
// from the Zenith mailbox, names the candidate as the sender, sets Reply-To to the candidate and
// sends them a blind copy. The CV file passes through to the email and is not stored.

import type { NextRequest } from "next/server";
import { AccessError, verifyAccess } from "@/lib/agent/access";
import { allow, clientIp, giveBack, take } from "@/lib/agent/limits";
import { fail, ok } from "@/lib/agent/http";
import { emailConfigured, sendMail, type Attachment } from "@/lib/email";

const CV_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_FILE = 3 * 1024 * 1024;
const EMAIL = /^[^\s@<>"(),;:]+@[^\s@<>"(),;:]+\.[A-Za-z]{2,24}$/;
const field = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);

const FOOTER = {
  en: (n: string, e: string) => `--\nSent on behalf of ${n} (${e}) with the Zenith AI job-application agent, zenithdubaicv.com/agent. Reply to this email to reach ${n} directly.`,
  fr: (n: string, e: string) => `--\nEnvoyé au nom de ${n} (${e}) avec l'agent de candidature Zenith AI, zenithdubaicv.com/agent. Répondez à cet e-mail pour joindre ${n} directement.`,
  ar: (n: string, e: string) => `--\nأُرسلت نيابةً عن ${n} (${e}) عبر وكيل التقديم على الوظائف Zenith AI على zenithdubaicv.com/agent. للرد على ${n} مباشرةً، أجب على هذه الرسالة.`,
};

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  if (!allow("send", clientIp(req.headers), 5, 60_000)) return fail("Too many emails at once. Wait a minute and try again.", 429);
  let fd: FormData;
  try { fd = await req.formData(); } catch { return fail("invalid"); }
  if (field(fd, "website", 200)) return ok({ ok: true }); // spam trap

  const kind = field(fd, "kind", 10);
  const proof = field(fd, "proof", 64);
  const to = field(fd, "to", 160);
  const subject = field(fd, "subject", 200);
  const message = field(fd, "body", 8000);
  const name = field(fd, "name", 120);
  const from = field(fd, "email", 160);
  const langRaw = field(fd, "lang", 4);
  const lang = langRaw === "fr" || langRaw === "ar" ? langRaw : "en";
  const cv = fd.get("cv");

  if (field(fd, "approve", 4) !== "yes") return fail("Approve this exact email before it is sent.", 400);
  if (kind !== "paypal" && kind !== "gumroad") return fail("invalid");
  if (!EMAIL.test(to)) return fail("The employer's email address is not valid.", 400);
  if (!EMAIL.test(from)) return fail("Your email address is not valid.", 400);
  if (!name || !subject || message.length < 50) return fail("Add your name, a subject and your message.", 400);
  if (!emailConfigured()) return fail("Email is not configured on this server.", 503);

  const attachments: Attachment[] = [];
  if (cv instanceof File && cv.size > 0) {
    if (!CV_TYPES.includes(cv.type) || cv.size > MAX_FILE) return fail("The CV must be a PDF or Word file of 3 MB or less.", 400);
    attachments.push({ filename: cv.name.replace(/[^\w.\- ()]/g, "_").slice(0, 120) || "cv.pdf", content: Buffer.from(await cv.arrayBuffer()), contentType: cv.type });
  }

  let v;
  try {
    v = await verifyAccess({ kind, proof });
  } catch (err) {
    if (err instanceof AccessError) return fail(err.code);
    return fail("unavailable");
  }

  const credit = await take("sends", v.key, v.plan).catch(() => null);
  if (!credit) return fail("unavailable");
  if (!credit.ok) return fail("limit", 429, { usage: credit.usage });

  try {
    await sendMail({
      to,
      bcc: from,
      replyTo: from,
      fromName: `${name} via Zenith`,
      subject,
      text: `${message}\n\n${FOOTER[lang](name, from)}`,
      attachments,
    });
    return ok({ ok: true, usage: credit.usage, sentAt: new Date().toISOString() });
  } catch (err) {
    await giveBack("sends", v.key, v.plan);
    console.error("[agent/send] email failed:", err instanceof Error ? err.message : err);
    return fail("The email could not be sent. Nothing was delivered; try again or apply another way.", 502);
  }
}

export async function GET() {
  return fail("Method not allowed.", 405);
}
