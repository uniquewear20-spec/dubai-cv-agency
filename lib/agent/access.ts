// lib/agent/access.ts — server only. Checks that a visitor bought a package, with the payment
// provider itself, every time it matters, and what that package includes in the agent:
//
//   Pro (AI drafting and sending)   packages 3 and 4 (AI_TIERS)
//   Interview coach                 packages 2, 3 and 4 (COACH_TIERS)
//
// Nothing is stored: the proof stays in the customer's browser.
//
//   PayPal   the PayPal order id from the confirmation page or the order email link
//            (/agent/?access=<order id>). The order must be COMPLETED with a COMPLETED capture.
//   Gumroad  the license key from the Gumroad purchase (download page, library), checked with Gumroad's public
//            license API (POST /v2/licenses/verify) against the package's product id. Only packages whose
//            Gumroad product has license keys switched on (a product id in lib/packages.ts) can be checked.

import { createHash } from "node:crypto";
import { COACH_TIERS, type TierKey } from "@/lib/checkout/catalog";
import { PayPalError, getPayPalConfig, getPayPalOrder, isPayPalOrderId } from "@/lib/checkout/paypal";
import { orderFacts } from "@/lib/checkout/orders";
import { PACKAGES } from "@/lib/packages";
import type { Access, AccessErrorCode, Plan } from "./types";

export class AccessError extends Error {
  constructor(public readonly code: AccessErrorCode, message = code) {
    super(message);
    this.name = "AccessError";
  }
}

/** A paid, not refunded package purchase. */
export interface Purchase {
  tier: TierKey;
  ref: string;
  /** Hash of the proof: what usage is counted against. The proof itself is never stored. */
  key: string;
  test: boolean;
}

/** A purchase that includes Pro access. */
export interface Verified extends Purchase {
  plan: Plan;
}

const PLAN_OF: Partial<Record<TierKey, Plan>> = { executive: "career-automation", apex: "executive-suite" };

/** What a package includes in the agent. */
export function featuresOf(tier: TierKey): { plan: Plan | null; coach: boolean } {
  return { plan: PLAN_OF[tier] ?? null, coach: COACH_TIERS.includes(tier) };
}

const keyOf = (kind: string, proof: string) => createHash("sha256").update(`${kind}:${proof}`).digest("hex").slice(0, 40);

const LICENSE_RE = /^[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}$/i;

// Local tests only: a stub of Gumroad's license API. Never active on Vercel.
const GUMROAD_API = (!process.env.VERCEL && process.env.GUMROAD_API_BASE_TEST?.trim()) || "https://api.gumroad.com";

/** Gumroad product ids of the packages whose license keys can be checked. */
function gumroadProducts(): { id: string; tier: TierKey }[] {
  return PACKAGES.filter(p => p.gumroadProductId).map(p => ({ id: p.gumroadProductId!, tier: p.key }));
}

/** Checks a package purchase with PayPal or Gumroad. Orders from the service builder aren't packages. */
export async function verifyPurchase(access: Pick<Access, "kind" | "proof">): Promise<Purchase> {
  const proof = String(access.proof ?? "").trim();
  if (access.kind === "paypal") return verifyPayPal(proof);
  if (access.kind === "gumroad") return verifyGumroad(proof);
  throw new AccessError("invalid");
}

/** Pro access: AI drafting and sending (packages 3 and 4). */
export async function verifyAccess(access: Pick<Access, "kind" | "proof">): Promise<Verified> {
  const p = await verifyPurchase(access);
  const plan = PLAN_OF[p.tier];
  if (!plan) throw new AccessError("not-eligible");
  return { ...p, plan };
}

// A coach session makes many calls; the provider is asked again after this long.
const COACH_TTL = 15 * 60_000;
const coachCache = new Map<string, { p: Purchase; exp: number }>();

/** The interview coach (packages 2, 3 and 4). Results are remembered for 15 minutes per server instance. */
export async function verifyCoach(access: Pick<Access, "kind" | "proof">): Promise<Purchase> {
  const k = keyOf(String(access.kind), String(access.proof ?? "").trim().toUpperCase());
  const hit = coachCache.get(k);
  if (hit && hit.exp > Date.now()) return hit.p;
  const p = await verifyPurchase(access);
  if (!COACH_TIERS.includes(p.tier)) throw new AccessError("not-eligible");
  coachCache.set(k, { p, exp: Date.now() + COACH_TTL });
  if (coachCache.size > 2000) for (const [key, v] of coachCache) if (v.exp <= Date.now()) coachCache.delete(key);
  return p;
}

async function verifyPayPal(orderId: string): Promise<Purchase> {
  if (!isPayPalOrderId(orderId)) throw new AccessError("invalid");
  const cfg = getPayPalConfig();
  if (!cfg) throw new AccessError("not-configured");
  let order;
  try {
    order = await getPayPalOrder(cfg, orderId);
  } catch (err) {
    if (err instanceof PayPalError && (err.status === 404 || err.issue === "RESOURCE_NOT_FOUND" || err.issue === "INVALID_RESOURCE_ID")) throw new AccessError("not-found");
    console.error("[agent/access] PayPal lookup failed:", err instanceof Error ? err.message : err);
    throw new AccessError("unavailable");
  }
  const f = orderFacts(order);
  const capture = (f.captureStatus ?? "").toUpperCase();
  if (capture === "REFUNDED" || capture === "PARTIALLY_REFUNDED") throw new AccessError("refunded");
  if (capture === "PENDING") throw new AccessError("pending");
  if (order.status !== "COMPLETED" || capture !== "COMPLETED") throw new AccessError("not-paid");
  if (!f.tier) throw new AccessError("not-eligible");
  return { tier: f.tier, ref: f.ref, key: keyOf("paypal", orderId), test: cfg.env === "sandbox" };
}

interface GumroadVerify {
  success?: boolean;
  message?: string;
  purchase?: { sale_id?: string; order_number?: number; refunded?: boolean; chargebacked?: boolean; disputed?: boolean; test?: boolean; product_id?: string };
}

async function verifyGumroad(licenseKey: string): Promise<Purchase> {
  if (!LICENSE_RE.test(licenseKey)) throw new AccessError("invalid");
  const products = gumroadProducts();
  if (!products.length) throw new AccessError("not-configured");
  for (const p of products) {
    let res: Response;
    try {
      res = await fetch(`${GUMROAD_API}/v2/licenses/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body: new URLSearchParams({ product_id: p.id, license_key: licenseKey, increment_uses_count: "false" }),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
    } catch (err) {
      console.error("[agent/access] Gumroad call failed:", err instanceof Error ? err.message : err);
      throw new AccessError("unavailable");
    }
    const data = (await res.json().catch(() => null)) as GumroadVerify | null;
    if (res.status === 404 || data?.success === false) continue; // not this product's key
    if (!res.ok || !data?.success || !data.purchase) throw new AccessError("unavailable");
    const pur = data.purchase;
    if (pur.refunded || pur.chargebacked || pur.disputed) throw new AccessError("refunded");
    return { tier: p.tier, ref: pur.order_number ? `Gumroad #${pur.order_number}` : `Gumroad ${pur.sale_id ?? ""}`.trim(), key: keyOf("gumroad", licenseKey.toUpperCase()), test: Boolean(pur.test) };
  }
  throw new AccessError("not-found");
}
