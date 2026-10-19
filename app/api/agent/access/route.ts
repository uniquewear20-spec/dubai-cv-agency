// app/api/agent/access/route.ts — checks a purchase (PayPal order or Gumroad license key) with the
// payment provider and says which agent plan it unlocks, with the allowance left.

import type { NextRequest } from "next/server";
import { AccessError, verifyAccess } from "@/lib/agent/access";
import { allow, clientIp, usageOf } from "@/lib/agent/limits";
import { fail, ok, readJson, text } from "@/lib/agent/http";

export async function POST(req: NextRequest) {
  if (!allow("access", clientIp(req.headers), 10, 60_000)) return fail("Too many attempts. Wait a minute and try again.", 429);
  const body = await readJson<{ kind?: unknown; proof?: unknown }>(req, 2_000);
  const kind = body?.kind === "paypal" || body?.kind === "gumroad" ? body.kind : null;
  const proof = text(body?.proof, 64);
  if (!kind || !proof) return fail("invalid");

  try {
    const v = await verifyAccess({ kind, proof });
    const [drafts, sends] = await Promise.all([usageOf("drafts", v.key, v.plan), usageOf("sends", v.key, v.plan)]);
    return ok({ plan: v.plan, ref: v.ref, test: v.test, drafts, sends, verifiedAt: new Date().toISOString() });
  } catch (err) {
    if (err instanceof AccessError) return fail(err.code);
    console.error("[agent/access] failed:", err instanceof Error ? err.message : err);
    return fail("unavailable");
  }
}

export async function GET() {
  return fail("Method not allowed.", 405);
}
