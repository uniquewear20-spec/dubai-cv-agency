// app/api/agent/tailor/route.ts — AI-tailored CV highlights and cover letter for one job.
// Only for Advanced Career Support and Executive Career Suite customers, checked with PayPal or
// Gumroad on every call. The CV is sent to Anthropic for this one draft (contact details
// removed first) and is not stored by Zenith. The draft is checked before it is returned:
// highlights must quote the CV, and unsupported figures or skills are flagged.

import type { NextRequest } from "next/server";
import { AccessError, verifyAccess } from "@/lib/agent/access";
import { AiError, aiConfigured, draftWithClaude } from "@/lib/agent/claude";
import { allow, clientIp, giveBack, take } from "@/lib/agent/limits";
import { fail, ok, readJson, strings, text } from "@/lib/agent/http";
import { redactContacts } from "@/lib/agent/text";
import type { TailorRequest } from "@/lib/agent/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!allow("tailor", clientIp(req.headers), 6, 60_000)) return fail("Too many drafts at once. Wait a minute and try again.", 429);
  if (!aiConfigured()) return fail("ai-off");

  const body = await readJson<Record<string, unknown>>(req, 120_000);
  if (!body) return fail("invalid");
  const access = body.access as { kind?: unknown; proof?: unknown } | undefined;
  const kind = access?.kind === "paypal" || access?.kind === "gumroad" ? access.kind : null;
  const proof = text(access?.proof, 64);
  const lang = body.lang === "fr" || body.lang === "ar" ? body.lang : "en";
  const p = (body.profile ?? {}) as Record<string, unknown>;
  const j = (body.job ?? {}) as Record<string, unknown>;
  const cvText = text(body.cvText, 20_000);
  const request: TailorRequest = {
    access: { kind: kind ?? "paypal", proof },
    lang,
    profile: { name: text(p.name, 120), headline: text(p.headline, 200), roles: strings(p.roles, 5, 80), languages: strings(p.languages, 12, 40), skills: strings(p.skills, 40, 60) },
    cvText: redactContacts(cvText),
    job: { title: text(j.title, 200), company: text(j.company, 160), location: text(j.location, 160), description: text(j.description, 12_000), url: text(j.url, 600) },
  };
  if (!kind || !proof) return fail("invalid");
  if (cvText.length < 200) return fail("Add your CV text first (at least a few lines).", 400);
  if (!request.job.title || request.job.description.length < 80) return fail("This listing has too little text to tailor to.", 400);

  let v;
  try {
    v = await verifyAccess(request.access);
  } catch (err) {
    if (err instanceof AccessError) return fail(err.code);
    return fail("unavailable");
  }

  const credit = await take("drafts", v.key, v.plan).catch(() => null);
  if (!credit) return fail("unavailable");
  if (!credit.ok) return fail("limit", 429, { usage: credit.usage });

  try {
    const { draft, dropped } = await draftWithClaude(request);
    return ok({ draft, usage: credit.usage, dropped });
  } catch (err) {
    await giveBack("drafts", v.key, v.plan);
    const message = err instanceof AiError ? err.message : "The draft could not be written. Try again.";
    if (!(err instanceof AiError)) console.error("[agent/tailor] failed:", err instanceof Error ? err.message : err);
    return fail(message, 502);
  }
}

export async function GET() {
  return fail("Method not allowed.", 405);
}
