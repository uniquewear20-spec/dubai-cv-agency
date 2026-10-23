// lib/agent/limits.ts — server only. Counts AI drafts and Zenith-sent applications per purchase.
//
// The allowances below are DEFAULTS awaiting the owner's approval (see docs/zenith-ai-agent.md).
// They can be changed in Vercel without a code change:
//   AGENT_AI_DRAFTS_CAREER_AUTOMATION         AI drafts per Advanced Career Support order (default 30,
//                                             set when the package covered 30 applications; it now
//                                             covers up to 100: raise it if AI drafting is switched on)
//   AGENT_AI_DRAFTS_EXECUTIVE_SUITE_PER_DAY   AI drafts per day for Executive Career Suite (default 20;
//                                             its applications continue until the customer accepts an
//                                             offer, so there is no total, only a daily cap against abuse)
//   AGENT_SENDS_PER_DAY                       applications Zenith may email per day per order (default 10)
//
// Counts live in Redis when one is connected (Vercel KV / Upstash: KV_REST_API_URL + KV_REST_API_TOKEN,
// or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). Without it, each server instance counts
// on its own, which is best-effort only.

import type { Plan, Usage } from "./types";

const num = (name: string, fallback: number) => {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v >= 0 ? Math.floor(v) : fallback;
};

export function planLimits(plan: Plan): { drafts: number; period: Usage["period"]; sends: number } {
  return plan === "career-automation"
    ? { drafts: num("AGENT_AI_DRAFTS_CAREER_AUTOMATION", 30), period: "order", sends: num("AGENT_SENDS_PER_DAY", 10) }
    : { drafts: num("AGENT_AI_DRAFTS_EXECUTIVE_SUITE_PER_DAY", 20), period: "day", sends: num("AGENT_SENDS_PER_DAY", 10) };
}

function redisConfig(): { url: string; token: string } | null {
  const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL)?.trim();
  const token = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)?.trim();
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export const sharedLimits = (): boolean => redisConfig() !== null;

async function redis(cmds: (string | number)[][]): Promise<unknown[]> {
  const cfg = redisConfig()!;
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`Redis HTTP ${res.status}`);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  const failed = out.find(r => r.error);
  if (failed) throw new Error(`Redis: ${failed.error}`);
  return out.map(r => r.result);
}

const memory = new Map<string, { n: number; exp: number }>();
function memIncr(k: string, by: number, ttl: number): number {
  const now = Date.now();
  const cur = memory.get(k);
  const entry = cur && cur.exp > now ? cur : { n: 0, exp: now + ttl * 1000 };
  entry.n = Math.max(0, entry.n + by);
  memory.set(k, entry);
  return entry.n;
}

type Counter = "drafts" | "sends";

function counterKey(counter: Counter, key: string, period: Usage["period"]): { k: string; ttl: number } {
  const day = new Date().toISOString().slice(0, 10);
  return period === "day" || counter === "sends"
    ? { k: `zagent:${counter}:${key}:${day}`, ttl: 2 * 86400 }
    : { k: `zagent:${counter}:${key}`, ttl: 400 * 86400 };
}

async function incr(k: string, by: number, ttl: number): Promise<number> {
  if (!redisConfig()) return memIncr(k, by, ttl);
  const out = await redis([["SET", k, "0", "EX", ttl, "NX"], ["INCRBY", k, by]]);
  return Number(out[1]);
}

/** Takes one unit of an allowance. Returns the usage after taking it, or ok:false when none is left. */
export async function take(counter: Counter, key: string, plan: Plan): Promise<{ ok: boolean; usage: Usage }> {
  const lim = planLimits(plan);
  const limit = counter === "drafts" ? lim.drafts : lim.sends;
  const period: Usage["period"] = counter === "drafts" ? lim.period : "day";
  const { k, ttl } = counterKey(counter, key, period);
  const used = await incr(k, 1, ttl);
  if (used > limit) {
    await incr(k, -1, ttl);
    return { ok: false, usage: { used: limit, limit, period } };
  }
  return { ok: true, usage: { used, limit, period } };
}

/** Gives a unit back, for example when the AI call failed after the unit was taken. */
export async function giveBack(counter: Counter, key: string, plan: Plan): Promise<void> {
  const lim = planLimits(plan);
  const { k, ttl } = counterKey(counter, key, counter === "drafts" ? lim.period : "day");
  await incr(k, -1, ttl).catch(() => undefined);
}

export async function usageOf(counter: Counter, key: string, plan: Plan): Promise<Usage> {
  const lim = planLimits(plan);
  const period: Usage["period"] = counter === "drafts" ? lim.period : "day";
  const limit = counter === "drafts" ? lim.drafts : lim.sends;
  const { k, ttl } = counterKey(counter, key, period);
  const used = await incr(k, 0, ttl);
  return { used: Math.min(used, limit), limit, period };
}

// ── Request rate limits (per IP, per instance) ───────────────────────────────

const hits = new Map<string, number[]>();

/** True when this caller made fewer than `max` calls to `bucket` in the last `windowMs`. */
export function allow(bucket: string, ip: string, max: number, windowMs: number): boolean {
  const k = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(k) ?? []).filter(t => now - t < windowMs);
  if (recent.length >= max) { hits.set(k, recent); return false; }
  recent.push(now);
  hits.set(k, recent);
  if (hits.size > 5000) for (const [key, ts] of hits) if (!ts.some(t => now - t < windowMs)) hits.delete(key);
  return true;
}

export function clientIp(headers: Headers): string {
  return headers.get("x-real-ip") || headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
