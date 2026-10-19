// lib/email.ts — server only. Sends email through the Zenith mailbox (GoDaddy SMTP).
// Environment variables (Vercel → Settings → Environment Variables):
//   SMTP_USER   e.g. info@zenithdubaicv.com
//   SMTP_PASS   the mailbox password (stored as a secret in Vercel, never in code)
//   CONTACT_TO  where order and contact notifications go (defaults to SMTP_USER)
//   SMTP_HOST / SMTP_PORT / SMTP_SECURE  optional; default GoDaddy (smtpout.secureserver.net, 465, TLS)

import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

export type Attachment = Mail.Attachment;

export function emailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

export function adminAddress(): string | null {
  return process.env.CONTACT_TO?.trim() || process.env.SMTP_USER?.trim() || null;
}

/** Escapes text before it goes into an HTML email. */
export function esc(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

let transport: nodemailer.Transporter | null = null;
function getTransport(): nodemailer.Transporter {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT) || 465;
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST?.trim() || "smtpout.secureserver.net",
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: { user: process.env.SMTP_USER!.trim(), pass: process.env.SMTP_PASS!.trim() },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return transport;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  bcc?: string;
  /** Display name for the sender; the address is always the Zenith mailbox. */
  fromName?: string;
  attachments?: Attachment[];
}): Promise<void> {
  if (!emailConfigured()) throw new Error("SMTP_USER / SMTP_PASS are not configured.");
  const name = (opts.fromName ?? "Zenith Dubai CV").replace(/["\r\n<>]/g, "").slice(0, 80);
  await getTransport().sendMail({
    from: `"${name}" <${process.env.SMTP_USER!.trim()}>`,
    to: opts.to,
    bcc: opts.bcc,
    replyTo: opts.replyTo,
    subject: opts.subject.slice(0, 200),
    text: opts.text,
    html: opts.html,
    attachments: opts.attachments,
  });
}

/** A plain, readable HTML layout for transactional emails. Body lines are escaped here. */
export function htmlEmail(opts: { title: string; lines: string[]; rows?: [string, string][]; cta?: { label: string; href: string }; footer?: string; rtl?: boolean }): string {
  const dir = opts.rtl ? "rtl" : "ltr";
  const align = opts.rtl ? "right" : "left";
  const rows = (opts.rows ?? [])
    .map(([k, v]) => `<tr><td style="padding:6px 0;color:#7a6d63;font-size:13px;width:150px;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#1a1410;font-size:14px">${esc(v)}</td></tr>`)
    .join("");
  const cta = opts.cta
    ? `<p style="margin:24px 0"><a href="${esc(opts.cta.href)}" style="display:inline-block;background:#c8a96e;color:#1a1410;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px">${esc(opts.cta.label)}</a></p>`
    : "";
  return `<!doctype html><html dir="${dir}"><body style="margin:0;background:#f7f3ee;padding:24px;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6dccd;border-radius:14px;padding:28px;text-align:${align}">
<p style="margin:0 0 6px;color:#7d5f22;font-size:13px;font-weight:600">Zenith Dubai CV</p>
<h1 style="margin:0 0 16px;color:#1a1410;font-size:22px;line-height:1.3;font-family:Georgia,serif;font-weight:normal">${esc(opts.title)}</h1>
${opts.lines.map(l => `<p style="margin:0 0 12px;color:#3d332b;font-size:15px;line-height:1.6">${esc(l)}</p>`).join("")}
${rows ? `<table style="width:100%;border-collapse:collapse;margin:8px 0 4px">${rows}</table>` : ""}
${cta}
${opts.footer ? `<p style="margin:20px 0 0;padding-top:14px;border-top:1px solid #eee6da;color:#7a6d63;font-size:12.5px;line-height:1.6">${esc(opts.footer)}</p>` : ""}
</div></body></html>`;
}
