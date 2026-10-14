// lib/checkout/paypal.ts — server only. Talks to the PayPal REST API (Orders v2).
//
// Environment variables (Vercel → Settings → Environment Variables):
//   PAYPAL_CLIENT_ID       → developer.paypal.com → Apps & Credentials → your app
//   PAYPAL_CLIENT_SECRET   → same app (store as a Secret)
//   PAYPAL_ENV (optional)  → "live" or "sandbox". When not set: live on Vercel
//                            Production, sandbox everywhere else (Preview, local).
//
// Use the Live app's keys for Production and the Sandbox app's keys for
// Preview / .env.local, so test versions of the site never take real money.

import { BRAND, CHARGE_CURRENCY } from "./catalog";

type PayPalEnv = "live" | "sandbox";

export interface PayPalConfig {
  clientId: string;
  secret: string;
  env: PayPalEnv;
  apiBase: string;
}

// Returns null when the keys are not configured so callers can fail politely.
export function getPayPalConfig(): PayPalConfig | null {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  if (!clientId || !secret) return null;
  const explicit = process.env.PAYPAL_ENV?.trim().toLowerCase();
  const env: PayPalEnv =
    explicit === "live" || explicit === "sandbox"
      ? explicit
      : process.env.VERCEL_ENV === "production" ? "live" : "sandbox";
  return {
    clientId,
    secret,
    env,
    apiBase: env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com",
  };
}

export class PayPalError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly issue?: string,
    public readonly debugId?: string,
  ) {
    super(message);
    this.name = "PayPalError";
  }
}

// ── Types (only the fields this site reads) ──────────────────────────────────
export interface PayPalMoney { currency_code: string; value: string }
export interface PayPalCapture {
  id: string;
  status: string; // COMPLETED | PENDING | DECLINED | FAILED | …
  amount?: PayPalMoney;
  custom_id?: string;
  invoice_id?: string;
}
export interface PayPalPurchaseUnit {
  custom_id?: string;
  invoice_id?: string;
  description?: string;
  amount?: PayPalMoney;
  payments?: { captures?: PayPalCapture[] };
}
export interface PayPalOrder {
  id: string;
  status: string; // CREATED | SAVED | APPROVED | VOIDED | COMPLETED | PAYER_ACTION_REQUIRED
  links?: { href: string; rel: string; method?: string }[];
  purchase_units?: PayPalPurchaseUnit[];
}

// PayPal order ids are short upper-case alphanumeric strings, e.g. 5O190127TN364715T.
export const isPayPalOrderId = (v: unknown): v is string =>
  typeof v === "string" && /^[A-Z0-9]{8,32}$/.test(v);

// ── Auth ─────────────────────────────────────────────────────────────────────
let cachedToken: { key: string; token: string; expiresAt: number } | null = null;

async function getAccessToken(cfg: PayPalConfig): Promise<string> {
  const key = `${cfg.env}:${cfg.clientId}`;
  if (cachedToken && cachedToken.key === key && cachedToken.expiresAt > Date.now()) return cachedToken.token;

  const res = await fetch(`${cfg.apiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${cfg.clientId}:${cfg.secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as
    | { access_token?: string; expires_in?: number; error?: string; error_description?: string }
    | null;
  if (!res.ok || !data?.access_token) {
    throw new PayPalError(
      `PayPal authentication failed (${res.status}): ${data?.error ?? "unknown"} ${data?.error_description ?? ""}`.trim(),
      res.status,
      data?.error,
    );
  }
  const ttlSeconds = Math.max(60, (data.expires_in ?? 3600) - 120);
  cachedToken = { key, token: data.access_token, expiresAt: Date.now() + ttlSeconds * 1000 };
  return data.access_token;
}

async function call<T>(
  cfg: PayPalConfig,
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  requestId?: string,
  retried = false,
): Promise<T> {
  const token = await getAccessToken(cfg);
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
  if (requestId) headers["PayPal-Request-Id"] = requestId;

  const res = await fetch(`${cfg.apiBase}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  // A revoked or expired token: fetch a fresh one once and retry.
  if (res.status === 401 && !retried) {
    cachedToken = null;
    return call<T>(cfg, method, path, body, requestId, true);
  }

  const data = (await res.json().catch(() => null)) as
    | (T & { name?: string; message?: string; debug_id?: string; details?: { issue?: string; description?: string }[] })
    | null;
  if (!res.ok) {
    const issue = data?.details?.[0]?.issue ?? data?.name;
    const detail = data?.details?.[0]?.description ?? data?.message ?? "";
    throw new PayPalError(
      `PayPal ${method} ${path} failed (${res.status}): ${issue ?? "unknown"} ${detail}`.trim(),
      res.status,
      issue,
      data?.debug_id,
    );
  }
  return data as T;
}

// ── Orders ───────────────────────────────────────────────────────────────────
export interface CreateOrderInput {
  amountUsd: string;   // e.g. "81.42"
  description: string; // shown on the PayPal page and receipt (first 127 chars)
  customId: string;    // packed order details, see encodeOrderMeta
  invoiceId: string;   // our order reference, e.g. ZN-7K2QXM
  returnUrl: string;
  cancelUrl: string;
  locale?: string;     // e.g. "en-US", "fr-FR"
}

// Creates an order and returns the PayPal page the visitor must be sent to.
export async function createPayPalOrder(
  cfg: PayPalConfig,
  input: CreateOrderInput,
): Promise<{ id: string; approveUrl: string }> {
  const order = await call<PayPalOrder>(
    cfg,
    "POST",
    "/v2/checkout/orders",
    {
      intent: "CAPTURE",
      purchase_units: [{
        description: input.description.slice(0, 127),
        custom_id: input.customId.slice(0, 255),
        invoice_id: input.invoiceId,
        amount: { currency_code: CHARGE_CURRENCY, value: input.amountUsd },
      }],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: BRAND,
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            landing_page: "NO_PREFERENCE",
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            return_url: input.returnUrl,
            cancel_url: input.cancelUrl,
            ...(input.locale ? { locale: input.locale } : {}),
          },
        },
      },
    },
    `create-${input.invoiceId}`,
  );

  const approve = order.links?.find(l => l.rel === "payer-action" || l.rel === "approve");
  if (!order.id || !approve?.href) throw new PayPalError("PayPal returned no approval link.", 502);
  return { id: order.id, approveUrl: approve.href };
}

export function getPayPalOrder(cfg: PayPalConfig, orderId: string): Promise<PayPalOrder> {
  return call<PayPalOrder>(cfg, "GET", `/v2/checkout/orders/${orderId}`);
}

// Takes the money for an order the visitor has approved. The request id makes
// repeated calls (page refresh, double load) safe: PayPal captures only once.
export function capturePayPalOrder(cfg: PayPalConfig, orderId: string): Promise<PayPalOrder> {
  return call<PayPalOrder>(cfg, "POST", `/v2/checkout/orders/${orderId}/capture`, undefined, `capture-${orderId}`);
}
