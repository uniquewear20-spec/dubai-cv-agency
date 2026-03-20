// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderEmail, subject, message } = body as {
      senderEmail: string;
      subject:     string;
      message:     string;
    };

    if (!senderEmail || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!isValidEmail(senderEmail)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (message.trim().length < 10) {
      return NextResponse.json({ error: "Message is too short." }, { status: 400 });
    }

    const smtpUser  = process.env.SMTP_USER;
    const smtpPass  = process.env.SMTP_PASS;
    const contactTo = process.env.CONTACT_TO ?? smtpUser;

    if (!smtpUser || !smtpPass) {
      console.error("[contact] SMTP_USER or SMTP_PASS env var is missing.");
      return NextResponse.json(
        { error: "Server configuration error. Please try WhatsApp instead." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host:              "smtpout.secureserver.net",
      port:              465,
      secure:            true,
      auth:              { user: smtpUser, pass: smtpPass },
      connectionTimeout: 10_000,
      greetingTimeout:   10_000,
      socketTimeout:     15_000,
    });

    await transporter.sendMail({
      from:    `"Zenith Dubai CV" <${smtpUser}>`,
      to:      contactTo,
      replyTo: senderEmail,
      subject: `[${subject}] New inquiry from ${senderEmail}`,
      text: [
        `From:    ${senderEmail}`,
        `Subject: ${subject}`,
        ``,
        message,
        ``,
        `─────────────────────────────`,
        `Sent via Zenith Dubai CV website`,
      ].join("\n"),
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0c;color:#e4e4e7;padding:32px;border-radius:16px;border:1px solid rgba(212,175,55,0.3)">
          <div style="border-bottom:2px solid #D4AF37;padding-bottom:16px;margin-bottom:24px">
            <h2 style="color:#D4AF37;margin:0;font-size:20px">New CV Inquiry</h2>
            <p style="color:#a1a1aa;margin:4px 0 0;font-size:13px">Zenith Dubai CV — Website Contact Form</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr>
              <td style="padding:8px 0;color:#a1a1aa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;width:90px">From</td>
              <td style="padding:8px 0;color:#ffffff;font-size:14px">
                <a href="mailto:${senderEmail}" style="color:#D4AF37;text-decoration:none">${senderEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#a1a1aa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em">Subject</td>
              <td style="padding:8px 0;color:#ffffff;font-size:14px">${subject}</td>
            </tr>
          </table>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:24px">
            <p style="color:#a1a1aa;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px">Message</p>
            <p style="color:#d4d4d8;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </div>
          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;text-align:center">
            <p style="color:#52525b;font-size:11px;margin:0">Sent via Zenith Dubai CV website</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[contact] sendMail failed:", msg);
    return NextResponse.json(
      { error: "Failed to send email. Please try WhatsApp instead." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}