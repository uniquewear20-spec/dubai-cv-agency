// app/api/agent/status/route.ts — what the agent can do on this server right now. No secrets:
// only whether each dependency is configured, so the interface never offers what isn't live.

import { aiConfigured, aiModel } from "@/lib/agent/claude";
import { planLimits, sharedLimits } from "@/lib/agent/limits";
import { SOURCE_META, sourceConfigured } from "@/lib/agent/sources";
import { emailConfigured } from "@/lib/email";
import { ok } from "@/lib/agent/http";
import type { AgentStatus } from "@/lib/agent/types";

export const dynamic = "force-dynamic";

export async function GET() {
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
  return ok(status);
}
