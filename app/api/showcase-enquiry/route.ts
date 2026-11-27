// app/api/showcase-enquiry/route.ts — the enquiry form on a Zenith concept website.
// The concept businesses are fictional, so a message here is a lead for Zenith Dubai (someone who
// wants a website like the one they saw). It is emailed to the Zenith inbox; nothing is stored.

import { NextRequest, NextResponse } from "next/server";
import { adminAddress, emailConfigured, htmlEmail, sendMail } from "@/lib/email";
import { allow, clientIp } from "@/lib/agent/limits";

export const dynamic = "force-dynamic";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });
const isEmail = (v: string) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(v);
const SITES = new Set(["halo-ridge", "tifawt", "hayrat", "mawqid", "zill", "oriel-88", "khayyal", "muskana", "mabsam", "shoreline-9", "thahab", "albora", "villa-eclat"]);

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
  if (!allow("showcase-enquiry", clientIp(req.headers), 5, 60 * 60 * 1000)) return fail("rate", 429);

  const site = str("site", 40);
  const name = str("name", 120);
  const email = str("email", 200);
  const interest = str("interest", 80);
  const lang = str("lang", 4) === "ar" ? "ar" : "en";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";

  if (!SITES.has(site)) return fail("invalid");
  if (!name || !email) return fail("missing");
  if (!isEmail(email)) return fail("email");
  if (!emailConfigured()) return fail("unavailable", 503);

  const when = new Date().toISOString();
  const note = "Sent from a Zenith concept website. The business on that site is fictional: reply about building a website like it.";
  try {
    await sendMail({
      to: adminAddress()!,
      replyTo: email,
      subject: `[Concept enquiry] ${site} — ${name}`,
      text: [`Concept site: ${site}`, `Name: ${name}`, `Email: ${email}`, `Interested in: ${interest || "not given"}`, `Language: ${lang}`, `Received: ${when}`, "", message || "(no message)", "", note].join("\n"),
      html: htmlEmail({
        title: `Concept enquiry from ${name}`,
        lines: [message || "(no message)", note],
        rows: [["Concept site", site], ["Email", email], ["Interested in", interest || "not given"], ["Language", lang], ["Received", when]],
        rtl: false,
      }),
    });
  } catch (err) {
    console.error("[showcase-enquiry] send failed", err instanceof Error ? err.message.slice(0, 120) : "unknown");
    return fail("unavailable", 503);
  }
  return NextResponse.json({ ok: true });
}
