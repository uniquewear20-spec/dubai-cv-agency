// app/api/contact/route.ts — the contact form. Sends one email to the Zenith inbox through the
// shared mailer (lib/email.ts: SMTP_USER, SMTP_PASS, CONTACT_TO, optional SMTP_HOST / SMTP_PORT).

import { NextRequest, NextResponse } from "next/server";
import { adminAddress, emailConfigured, emailErrorCode, sendMail, type Attachment } from "@/lib/email";

function isValidEmail(email: string): boolean {
  return /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email.trim());
}

// Everything a visitor typed is escaped before it goes into the HTML email.
function esc(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const MAX_SUBJECT = 160;
const MAX_MESSAGE = 5000;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_CV_TYPES    = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const senderEmail = (formData.get("senderEmail") as string | null)?.trim() ?? "";
    const subject     = (formData.get("subject")     as string | null)?.trim() ?? "";
    const message     = (formData.get("message")     as string | null)?.trim() ?? "";
    const photoFile   =  formData.get("photo") as File | null;
    const cvFile      =  formData.get("cv")    as File | null;

    // ── Spam trap: a hidden field people leave empty (the Zenith AI launch-list form sends it) ──
    const trap = (formData.get("website") as string | null)?.trim() ?? "";
    if (trap) return NextResponse.json({ success: true }, { status: 200 });

    // ── Validate required fields ──────────────────────────────────────────
    if (subject.length > MAX_SUBJECT || message.length > MAX_MESSAGE) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }
    if (!senderEmail || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!isValidEmail(senderEmail)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: "Message is too short." }, { status: 400 });
    }

    // ── Validate photo (optional) ─────────────────────────────────────────
    if (photoFile && photoFile.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(photoFile.type)) {
        return NextResponse.json(
          { error: "Photo must be JPEG, PNG, or WEBP." },
          { status: 400 }
        );
      }
      if (photoFile.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "Photo must be under 5 MB." }, { status: 400 });
      }
    }

    // ── Validate CV (optional) ────────────────────────────────────────────
    if (cvFile && cvFile.size > 0) {
      if (!ALLOWED_CV_TYPES.includes(cvFile.type)) {
        return NextResponse.json(
          { error: "CV must be a PDF or Word document (.pdf, .doc, .docx)." },
          { status: 400 }
        );
      }
      if (cvFile.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "CV file must be under 5 MB." }, { status: 400 });
      }
    }

    // ── Build attachments array ───────────────────────────────────────────
    const attachments: Attachment[] = [];

    if (photoFile && photoFile.size > 0) {
      attachments.push({
        filename:    photoFile.name || "photo.jpg",
        content:     Buffer.from(await photoFile.arrayBuffer()),
        contentType: photoFile.type,
      });
    }

    if (cvFile && cvFile.size > 0) {
      attachments.push({
        filename:    cvFile.name || "cv.pdf",
        content:     Buffer.from(await cvFile.arrayBuffer()),
        contentType: cvFile.type,
      });
    }

    // ── Mail settings ─────────────────────────────────────────────────────
    if (!emailConfigured()) {
      console.error("[contact] SMTP_USER or SMTP_PASS env var is missing.");
      return NextResponse.json(
        { error: "Server configuration error. Please try WhatsApp instead." },
        { status: 500 }
      );
    }
    const contactTo = adminAddress()!;

    // ── Attachment summary for HTML ───────────────────────────────────────
    const attachmentSummary = attachments.length > 0
      ? attachments.map((a) => `<strong>${esc(String(a.filename))}</strong>`).join(", ")
      : "None";

    // ── Send ──────────────────────────────────────────────────────────────
    await sendMail({
      to:          contactTo,
      replyTo:     senderEmail,
      subject:     `[${subject}] New inquiry from ${senderEmail}`,
      attachments,
      text: [
        `From:        ${senderEmail}`,
        `Subject:     ${subject}`,
        `Attachments: ${attachments.map((a) => String(a.filename)).join(", ") || "None"}`,
        "",
        message,
        "",
        "─────────────────────────────",
        "Sent via Zenith Dubai CV website",
      ].join("\n"),
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0c;color:#e4e4e7;padding:32px;border-radius:16px;border:1px solid rgba(212,175,55,0.3)">
          <div style="border-bottom:2px solid #D4AF37;padding-bottom:16px;margin-bottom:24px">
            <h2 style="color:#D4AF37;margin:0;font-size:20px">New CV Inquiry</h2>
            <p style="color:#a1a1aa;margin:4px 0 0;font-size:13px">Zenith Dubai CV — Website Contact Form</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr>
              <td style="padding:8px 0;color:#a1a1aa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;width:110px">From</td>
              <td style="padding:8px 0;color:#ffffff;font-size:14px">
                <a href="mailto:${esc(senderEmail)}" style="color:#D4AF37;text-decoration:none">${esc(senderEmail)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#a1a1aa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em">Subject</td>
              <td style="padding:8px 0;color:#ffffff;font-size:14px">${esc(subject)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#a1a1aa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em">Files</td>
              <td style="padding:8px 0;color:#D4AF37;font-size:13px">${attachmentSummary}</td>
            </tr>
          </table>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:24px">
            <p style="color:#a1a1aa;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px">Message</p>
            <p style="color:#d4d4d8;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap">${esc(message)}</p>
          </div>
          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;text-align:center">
            <p style="color:#52525b;font-size:11px;margin:0">Sent via Zenith Dubai CV website</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: unknown) {
    console.error("[contact] sendMail failed:", emailErrorCode(err), err instanceof Error ? err.message : "");
    return NextResponse.json(
      { error: "Failed to send email. Please try WhatsApp instead." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}