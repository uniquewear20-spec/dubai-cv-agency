// app/checkout/success/page.tsx — Zenith Dubai CV · Payment confirmation
// Stripe sends the visitor here after paying:
//   /checkout/success?session_id=cs_…
// The session is looked up on the server and only shown as confirmed when
// Stripe reports payment_status "paid".

import type { Metadata } from "next";
import { PRESETS, SERVICES, isTierKey, type Lang } from "@/lib/checkout/catalog";
import { getStripe } from "@/lib/checkout/stripe";
import SuccessView, { type OrderResult } from "./SuccessView";

export const metadata: Metadata = {
  title: "Your order — Zenith Dubai CV",
  robots: { index: false, follow: false },
};

async function lookUp(sessionId: string | undefined): Promise<OrderResult> {
  // Checkout Session ids look like cs_test_… / cs_live_…
  if (!sessionId || !/^cs_[A-Za-z0-9_]{10,250}$/.test(sessionId)) return { status: "invalid" };
  const stripe = getStripe();
  if (!stripe) {
    console.error("[checkout/success] STRIPE_SECRET_KEY env var is missing.");
    return { status: "invalid" };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const md = session.metadata ?? {};
    const lang: Lang = md.language === "fr" || md.language === "ar" ? md.language : "en";
    if (session.payment_status !== "paid") return { status: "pending", lang };

    const items = (md.items ?? "").split(",").filter(id => SERVICES.some(s => s.id === id));
    return {
      status: "paid",
      lang,
      ref: md.order_ref || session.id.slice(-8).toUpperCase(),
      amountAed: (session.amount_total ?? 0) / 100,
      tier: isTierKey(md.tier) ? md.tier : null,
      bundle: PRESETS.some(p => p.id === md.bundle) ? md.bundle : null,
      itemCount: items.length,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[checkout/success] session lookup failed:", msg);
    return { status: "invalid" };
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = (await searchParams).session_id;
  const order = await lookUp(Array.isArray(raw) ? raw[0] : raw);
  return <SuccessView order={order} />;
}
