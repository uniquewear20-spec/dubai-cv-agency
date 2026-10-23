// app/api/agent/access/route.ts — checks a purchase (PayPal order or Gumroad license key) with the
// payment provider and says what it unlocks in the agent: the interview coach (packages 2–4) and
// Pro drafting and sending (packages 3–4), with the Pro allowance left.

import type { NextRequest } from "next/server";
import { AccessError, featuresOf, verifyPurchase } from "@/lib/agent/access";
import { allow, clientIp, usageOf } from "@/lib/agent/limits";
import { fail, ok, readJson, text } from "@/lib/agent/http";

export async function POST(req: NextRequest) {
  if (!allow("access", clientIp(req.headers), 10, 60_000)) return fail("Too many attempts. Wait a minute and try again.", 429);
  const body = await readJson<{ kind?: unknown; proof?: unknown }>(req, 2_000);
  const kind = body?.kind === "paypal" || body?.kind === "gumroad" ? body.kind : null;
  const proof = text(body?.proof, 64);
  if (!kind || !proof) return fail("invalid");

  try {
    const v = await verifyPurchase({ kind, proof });
    const { plan, coach } = featuresOf(v.tier);
    if (!plan && !coach) return fail("not-eligible");
    const usage = plan ? await Promise.all([usageOf("drafts", v.key, plan), usageOf("sends", v.key, plan)]) : null;
    return ok({
      tier: v.tier, plan, coach, ref: v.ref, test: v.test,
      ...(usage ? { drafts: usage[0], sends: usage[1] } : {}),
      verifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    if (err instanceof AccessError) return fail(err.code);
    console.error("[agent/access] failed:", err instanceof Error ? err.message : err);
    return fail("unavailable");
  }
}

export async function GET() {
  return fail("Method not allowed.", 405);
}
