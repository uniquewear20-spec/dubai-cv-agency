// app/api/agent/status/route.ts — what the agent can do on this server right now. No secrets:
// only whether each dependency is configured, so the interface never offers what isn't live.

import { aiConfigured, aiModel } from "@/lib/agent/claude";
import { planLimits, sharedLimits } from "@/lib/agent/limits";
import { SOURCE_META, sourceConfigured } from "@/lib/agent/sources";
import { checkEmail, emailConfigured } from "@/lib/email";
import { ok } from "@/lib/agent/http";
import type { AgentStatus } from "@/lib/agent/types";

export const dynamic = "force-dynamic";

// GET /api/agent/status/?check=email also logs in to the mail server (nothing is sent) and reports
// whether it accepted the login. The result is cached for 15 minutes per server instance.
export async function GET(req: Request) {
  const wantsEmailCheck = new URL(req.url).searchParams.get("check") === "email";
  const status: AgentStatus = {
    ai: aiConfigured(),
    model: aiConfigured() ? aiModel() : null,
    limits: sharedLimits() ? "shared" : "per-instance",
    email: emailConfigured(),
    sources: SOURCE_META.map(m => ({ id: m.id, name: m.name, configured: sourceConfigured(m) })),
    plans: (["career-automation", "executive-suite"] as const).map(plan => {
      const l = planLimits(plan);
      return { plan, drafts: l.drafts, period: l.period, sends: l.sends };
    }),
  };
  return ok(wantsEmailCheck ? { ...status, emailCheck: await checkEmail() } : status);
}
