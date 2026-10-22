// lib/email.ts — server only. Sends every email the site sends (contact form, orders, briefs,
// agent applications) through the Zenith mailbox.
// Environment variables (Vercel → Settings → Environment Variables):
//   SMTP_USER   e.g. info@zenithdubaicv.com
//   SMTP_PASS   the mailbox password (stored as a secret in Vercel, never in code)
//   CONTACT_TO  where order and contact notifications go (defaults to SMTP_FROM, then SMTP_USER)
//   SMTP_FROM   optional sender address, for mail services whose login is not an address
//               (defaults to SMTP_USER)
//   SMTP_HOST / SMTP_PORT / SMTP_SECURE  optional. The default is Microsoft 365
//               (smtp.office365.com, 587, STARTTLS): zenithdubaicv.com's mail is hosted there
//               (MX zenithdubaicv-com.mail.protection.outlook.com, checked 22 Oct 2026). The mailbox
//               needs SMTP AUTH turned on (GoDaddy: Email & Office Dashboard → the mailbox →
//               SMTP Authentication). GoDaddy's own SMTP (smtpout.secureserver.net) only works for
//               GoDaddy Workspace mailboxes.

import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

export type Attachment = Mail.Attachment;

export function emailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

/** The address mail is sent from. */
export function fromAddress(): string {
  return process.env.SMTP_FROM?.trim() || process.env.SMTP_USER!.trim();
}

export function adminAddress(): string | null {
  return process.env.CONTACT_TO?.trim() || process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim() || null;
}

/** Escapes text before it goes into an HTML email. */
export function esc(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const DEFAULT_HOST = "smtp.office365.com";

/** Where mail is sent from. No secrets: safe to show in a status check. */
export function smtpServer(): { host: string; port: number; secure: boolean } {
  const host = process.env.SMTP_HOST?.trim() || DEFAULT_HOST;
  const port = Number(process.env.SMTP_PORT) || (host === DEFAULT_HOST ? 587 : 465);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  return { host, port, secure };
}

let transport: nodemailer.Transporter | null = null;
function getTransport(): nodemailer.Transporter {
  if (!transport) {
    const { host, port, secure } = smtpServer();
    transport = nodemailer.createTransport({
      host,
      port,
      secure,
      // Port 587: refuse to send the password unless the server upgrades to TLS (STARTTLS).
      // Only a local test mail sink is exempt.
      requireTLS: !secure && !/^(localhost|127\.0\.0\.1|::1)$/.test(host),
      auth: { user: process.env.SMTP_USER!.trim(), pass: process.env.SMTP_PASS!.trim() },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return transport;
}

/** A short, secret-free description of a mail error for logs and the status check, e.g. "EAUTH 535 5.7.139". */
export function emailErrorCode(err: unknown): string {
  const e = (err ?? {}) as { code?: string; responseCode?: number; response?: string };
  const enhanced = typeof e.response === "string" ? e.response.match(/^\d{3}[ -](\d\.\d{1,3}\.\d{1,3})/)?.[1] : undefined;
  return [e.code, e.responseCode, enhanced].filter(Boolean).join(" ") || (err instanceof Error ? err.name : "unknown");
}

export interface EmailCheck {
  ok: boolean;
  server: string;
  /** "auth": the server refused the login (password, or SMTP AUTH switched off for the mailbox). */
  problem?: "not-configured" | "auth" | "connection" | "other";
  code?: string;
  /** The server's own explanation, with any email address removed. */
  detail?: string;
  checkedAt: string;
}

/** The mail server's reply text, safe to show: addresses removed, one line, short. */
function serverDetail(err: unknown): string | undefined {
  const r = (err as { response?: unknown })?.response;
  if (typeof r !== "string" || !r.trim()) return undefined;
  return r.replace(/[^\s@<>"]+@[^\s@<>"]+/g, "[address]").replace(/\s+/g, " ").trim().slice(0, 200);
}

let lastCheck: { at: number; result: EmailCheck } | null = null;
const CHECK_TTL = 15 * 60_000;

/** Logs in to the mail server without sending anything. Cached for 15 minutes per server instance. */
export async function checkEmail(): Promise<EmailCheck> {
  if (lastCheck && Date.now() - lastCheck.at < CHECK_TTL) return lastCheck.result;
  const { host, port } = smtpServer();
  const server = `${host}:${port}`;
  let result: EmailCheck;
  if (!emailConfigured()) {
    result = { ok: false, server, problem: "not-configured", checkedAt: new Date().toISOString() };
  } else {
    try {
      await getTransport().verify();
      result = { ok: true, server, checkedAt: new Date().toISOString() };
    } catch (err) {
      const code = emailErrorCode(err);
      const problem = /EAUTH|\b53\d\b/.test(code) ? "auth" : /ECONNECTION|ETIMEDOUT|ESOCKET|EDNS|ECONNREFUSED|ENOTFOUND|ETLS/.test(code) ? "connection" : "other";
      console.error(`[email] check failed (${server}): ${code} ${serverDetail(err) ?? ""}`);
      result = { ok: false, server, problem, code, detail: serverDetail(err), checkedAt: new Date().toISOString() };
    }
  }
  lastCheck = { at: Date.now(), result };
  return result;
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
    from: `"${name}" <${fromAddress()}>`,
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
