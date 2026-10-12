// app/api/checkout/route.ts
// Creates a Stripe Checkout Session (Stripe's hosted payment page).
// Environment variable required (.env.local and Vercel):
//   STRIPE_SECRET_KEY → sk_test_… locally, sk_live_… in production
//
// The browser only says WHAT is being bought (a tier, or package item ids).
// The amount is always worked out here from lib/checkout/catalog.ts.

import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  BRAND, CHARGE_CURRENCY, SERVICES, TIERS,
  isTierKey, matchPreset, quotePackage,
  type Lang,
} from "@/lib/checkout/catalog";
import { getStripe } from "@/lib/checkout/stripe";

// Stripe Checkout has no Arabic, so Arabic visitors get Stripe's own detection.
const STRIPE_LOCALE: Record<Lang, "en" | "fr" | "auto"> = { en: "en", fr: "fr", ar: "auto" };

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

// Short human-friendly reference, e.g. ZN-7K2QXM (no 0/O/1/I to avoid misreads).
function orderRef(): string {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  return "ZN-" + Array.from(randomBytes(6), b => alphabet[b % alphabet.length]).join("");
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    console.error("[checkout] STRIPE_SECRET_KEY env var is missing.");
    return NextResponse.json(
      { error: "Payments are not configured yet: STRIPE_SECRET_KEY is missing on the server." },
      { status: 500 }
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

  // ── Work out what is being bought, from the catalog only ────────────────
  let name: string;
  let description: string | undefined;
  let totalAed: number;
  const metadata: Record<string, string> = { language: lang };

  if (body.tier !== undefined) {
    if (!isTierKey(body.tier)) return bad("Unknown tier.");
    const tier = TIERS[body.tier];
    name = `${tier.name} — ${BRAND}`;
    totalAed = tier.price;
    metadata.kind = "tier";
    metadata.tier = body.tier;
  } else if (body.items !== undefined) {
    const items = body.items;
    if (!Array.isArray(items) || items.length === 0) return bad("No services selected.");
    if (items.length > SERVICES.length || new Set(items).size !== items.length) return bad("Invalid selection.");
    const known = new Set(SERVICES.map(s => s.id));
    if (!items.every((id): id is string => typeof id === "string" && known.has(id))) return bad("Unknown service.");

    const quote = quotePackage(items);
    const preset = matchPreset(items);
    name = `${preset ? `${preset.name} Bundle` : "Custom Package"} — ${BRAND}`;
    description = quote.services.map(s => s.name).join(" · ")
      + (quote.discount > 0 ? ` (${Math.round(quote.discount * 100)}% bundle discount applied)` : "");
    totalAed = quote.total;
    metadata.kind = "package";
    metadata.items = quote.services.map(s => s.id).join(",");
    if (preset) metadata.bundle = preset.id;
  } else {
    return bad("Nothing selected.");
  }

  const ref = orderRef();
  metadata.order_ref = ref;
  metadata.amount_aed = String(totalAed);

  const origin = req.nextUrl.origin;

  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      // payment_method_types is deliberately not set: the methods enabled in the
      // Stripe Dashboard (cards, Apple Pay, Google Pay) apply automatically.
      line_items: [{
        quantity: 1,
        price_data: {
          currency: CHARGE_CURRENCY,
          unit_amount: totalAed * 100, // AED → fils
          product_data: { name, ...(description ? { description } : {}) },
        },
      }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#investment`,
      locale: STRIPE_LOCALE[lang],
      customer_creation: "always",
      client_reference_id: ref,
      metadata,
      payment_intent_data: { description: `${name} · ${ref}`, metadata },
    };
    const session = await stripe.checkout.sessions.create(params);

    if (!session.url) throw new Error("Stripe returned no checkout URL.");
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[checkout] session create failed:", msg);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again or contact us on WhatsApp." },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
