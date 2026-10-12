// lib/checkout/stripe.ts — server only.
// Environment variable required (.env.local and Vercel):
//   STRIPE_SECRET_KEY → sk_test_… locally, sk_live_… in production

import Stripe from "stripe";

let client: Stripe | null = null;

// Returns null when the key is not configured so callers can fail politely.
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (!client) client = new Stripe(key);
  return client;
}
