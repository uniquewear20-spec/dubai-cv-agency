// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // required for nodemailer + Buffer

// ── Environment variables expected in .env.local ──────────────────────────────
// SMTP_HOST        e.g. smtp.gmail.com | smtp.hostinger.com | mail.zenithdubaicv.com
// SMTP_PORT        e.g. 465 (SSL) or 587 (TLS/STARTTLS)
// SMTP_SECURE      "true" for port 465, "false" for 587
// SMTP_USER        full email address used to authenticate, e.g. info@zenithdubaicv.com
// SMTP_PASS        SMTP password or app-specific password
// SMTP_FROM        display name + address, e.g. "Zenith Dubai CV <info@zenithdubaicv.com>"
// SMTP_TO          recipient, e.g. info@zenithdubaicv.com (can be same as SMTP_USER)
// ─────────────────────────────────────────────────────────────────────────────

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB per attachment

function missingEnvError(key: string): NextResponse {
  console.error(`[contact] Missing env var: ${key}`);
  return NextResponse.json(
    { error: "Server configuration error. Please try WhatsApp instead." },
    { status: 500 }
  );
}

export async function POST(req: NextRequest) {
  // ── 1. Validate env ────────────────────────────────────────────────────────
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    SMTP_TO,
  } = process.env;

  if (!SMTP_HOST)  return missingEnvError("SMTP_HOST");
  if (!SMTP_PORT)  return missingEnvError("SMTP_PORT");
  if (!SMTP_USER)  return missingEnvError("SMTP_USER");
  if (!SMTP_PASS)  return missingEnvError("SMTP_PASS");
  if (!SMTP_TO)    return missingEnvError("SMTP_TO");

  const secure = SMTP_SECURE === "true";
  const port   = parseInt(SMTP_PORT, 10);

  // ── 2. Parse multipart form ────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const senderEmail = (formData.get("senderEmail") as string | null)?.trim();
  const subject     = (formData.get("subject")     as string | null)?.trim();
  const message     = (formData.get("message")     as string | null)?.trim();
  const photoFile   =  formData.get("photo")  as File | null;
  const cvFile      =  formData.get("cv")     as File | null;

  // ── 3. Basic validation ────────────────────────────────────────────────────
  if (!senderEmail || !message) {
    return NextResponse.json(
      { error: "Email and message are required." },
      { status: 400 }
    );
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(senderEmail)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  // ── 4. Build attachments ───────────────────────────────────────────────────
  type Attachment = {
    filename: string;
    content: Buffer;
    contentType: string;
  };
  const attachments: Attachment[] = [];

  async function processFile(file: File, label: string) {
    if (!file || file.size === 0) return;
    if (file.size > MAX_FILE_BYTES) {
      // Skip silently — client already validates, but guard server-side too
      console.warn(`[contact] ${label} exceeds 5 MB, skipping.`);
      return;
    }
    const buf = Buffer.from(await file.arrayBuffer());
    attachments.push({
      filename: file.name,
      content: buf,
      contentType: file.type || "application/octet-stream",
    });
  }

  if (photoFile instanceof File) await processFile(photoFile, "photo");
  if (cvFile    instanceof File) await processFile(cvFile,    "cv");

  // ── 5. Compose email ───────────────────────────────────────────────────────
  const emailSubject = subject
    ? `[Zenith Dubai CV] ${subject} — from ${senderEmail}`
    : `[Zenith Dubai CV] New Enquiry — from ${senderEmail}`;

  const htmlBody = `
    <div style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;color:#1A1410;">
      <div style="border-bottom:2px solid #C8A96E;padding-bottom:16px;margin-bottom:24px;">
        <h2 style="margin:0;color:#C8A96E;font-size:20px;font-weight:normal;letter-spacing:0.05em;">
          New Enquiry — Zenith Dubai CV
        </h2>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:8px 0;color:#786860;font-size:12px;width:120px;vertical-align:top;">FROM</td>
          <td style="padding:8px 0;font-size:14px;"><a href="mailto:${senderEmail}" style="color:#C8A96E;">${senderEmail}</a></td>
        </tr>
        ${subject ? `
        <tr>
          <td style="padding:8px 0;color:#786860;font-size:12px;vertical-align:top;">SUBJECT</td>
          <td style="padding:8px 0;font-size:14px;">${subject}</td>
        </tr>` : ""}
        ${attachments.length > 0 ? `
        <tr>
          <td style="padding:8px 0;color:#786860;font-size:12px;vertical-align:top;">ATTACHMENTS</td>
          <td style="padding:8px 0;font-size:14px;">${attachments.map(a => a.filename).join(", ")}</td>
        </tr>` : ""}
      </table>

      <div style="background:#F5F1EB;border-left:3px solid #C8A96E;padding:20px 24px;border-radius:4px;margin-bottom:32px;">
        <p style="margin:0;font-size:14px;line-height:1.8;white-space:pre-wrap;">${message.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>
      </div>

      <div style="border-top:1px solid #E2C98E33;padding-top:16px;">
        <p style="margin:0;font-size:11px;color:#9A8E84;letter-spacing:0.05em;">
          Zenith Dubai CV · info@zenithdubaicv.com · wa.me/971502879462
        </p>
      </div>
    </div>
  `;

  const textBody = [
    `New enquiry from: ${senderEmail}`,
    subject ? `Subject: ${subject}` : "",
    "",
    message,
    "",
    attachments.length > 0
      ? `Attachments: ${attachments.map(a => a.filename).join(", ")}`
      : "",
  ].filter(l => l !== undefined).join("\n");

  // ── 6. Send via SMTP ───────────────────────────────────────────────────────
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    // Sensible timeouts — avoids hanging on cold starts
    connectionTimeout: 10_000,
    greetingTimeout:   10_000,
    socketTimeout:     15_000,
  });

  try {
    await transporter.sendMail({
      from:        SMTP_FROM || `"Zenith Dubai CV" <${SMTP_USER}>`,
      to:          SMTP_TO,
      replyTo:     senderEmail,
      subject:     emailSubject,
      text:        textBody,
      html:        htmlBody,
      attachments,
    });

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[contact] SMTP error:", msg);

    // Surface a useful but safe message to the client
    const clientMsg = msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND")
      ? "Could not reach the mail server. Please try WhatsApp instead."
      : msg.includes("535") || msg.includes("auth") || msg.includes("534")
      ? "Mail authentication failed. Please try WhatsApp instead."
      : "Failed to send email. Please try WhatsApp instead.";

    return NextResponse.json({ error: clientMsg }, { status: 500 });
  }
}