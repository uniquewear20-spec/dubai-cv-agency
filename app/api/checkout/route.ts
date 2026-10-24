// app/api/checkout/route.ts
// Creates a PayPal order and returns the PayPal page to send the visitor to.
// Environment variables required: see lib/checkout/paypal.ts.
//
// The browser only says WHAT is being bought (a tier, or package item ids).
// The amount is always worked out here from lib/checkout/catalog.ts.

import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  BRAND, SERVICES, TIERS,
  aedToUsd, encodeOrderMeta, isTierKey, matchPreset, quotePackage,
  type Lang, type OrderMeta,
} from "@/lib/checkout/catalog";
import { createPayPalOrder, getPayPalConfig } from "@/lib/checkout/paypal";

// PayPal page language. Arabic is left to PayPal's own browser detection.
const PAYPAL_LOCALE: Record<Lang, string | undefined> = { en: "en-US", fr: "fr-FR", ar: undefined };

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

// Short human-friendly reference, e.g. ZN-7K2QXM (no 0/O/1/I to avoid misreads).
function orderRef(): string {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  return "ZN-" + Array.from(randomBytes(6), b => alphabet[b % alphabet.length]).join("");
}

export async function POST(req: NextRequest) {
  const paypal = getPayPalConfig();
  if (!paypal) {
    console.error("[checkout] PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET env vars are missing.");
    return NextResponse.json(
      { error: "Payments are not configured yet: PayPal keys are missing on the server." },
      { status: 500 },
    );
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return bad("Invalid request.");
    body = parsed as Record<string, unknown>;
  } catch {
    return bad("Invalid request.");
  }

  const lang: Lang = body.lang === "fr" || body.lang === "ar" ? body.lang : "en";
  const ref = orderRef();

  // ── Work out what is being bought, from the catalog only ────────────────
  let name: string;
  let meta: OrderMeta;

  if (body.tier !== undefined) {
    if (!isTierKey(body.tier)) return bad("Unknown tier.");
    const tier = TIERS[body.tier];
    name = `${tier.name} — ${BRAND}`;
    meta = { ref, lang, aed: tier.price, tier: body.tier };
  } else if (body.items !== undefined) {
    const items = body.items;
    if (!Array.isArray(items) || items.length === 0) return bad("No services selected.");
    if (items.length > SERVICES.length || new Set(items).size !== items.length) return bad("Invalid selection.");
    const known = new Set(SERVICES.map(s => s.id));
    if (!items.every((id): id is string => typeof id === "string" && known.has(id))) return bad("Unknown service.");

    const quote = quotePackage(items);
    const preset = matchPreset(items);
    name = `${preset ? `${preset.name} Bundle` : "Custom Package"} — ${BRAND}: `
      + quote.services.map(s => s.name).join(", ");
    meta = {
      ref, lang, aed: quote.total,
      items: quote.services.map(s => s.id),
      ...(preset ? { bundle: preset.id } : {}),
    };
  } else {
    return bad("Nothing selected.");
  }

  const origin = req.nextUrl.origin;

  try {
    const { approveUrl } = await createPayPalOrder(paypal, {
      amountUsd: aedToUsd(meta.aed),
      description: name,
      customId: encodeOrderMeta(meta),
      invoiceId: ref,
      // PayPal adds ?token=<order id>&PayerID=… to this address after approval.
      returnUrl: `${origin}/checkout/success/`,
      // Leaving PayPal without paying (or after the card was refused on PayPal's page) comes back to
      // a page that says so, instead of the homepage with no message. PayPal adds &token=<order id>.
      cancelUrl: `${origin}/checkout/success/?cancelled=1`,
      locale: PAYPAL_LOCALE[lang],
    });
    return NextResponse.json({ url: approveUrl }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error(`[checkout] PayPal order create failed (${paypal.env}):`, msg);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again or contact us on WhatsApp." },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
