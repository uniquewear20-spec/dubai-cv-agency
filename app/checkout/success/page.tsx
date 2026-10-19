// app/checkout/success/page.tsx — Zenith Dubai CV · payment confirmation
// PayPal sends the visitor here after they approve the payment:
//   /checkout/success/?token=<PayPal order id>&PayerID=…
// The order is looked up on the server; if it is approved but not yet paid, the money is
// captured here. It is shown as paid only when PayPal reports the capture as COMPLETED, and
// only the request that actually captured it sends the order emails (see lib/checkout/orders.ts).

import { randomBytes } from "node:crypto";
import type { Metadata } from "next";
import { after } from "next/server";
import { decodeOrderMeta, type Lang } from "@/lib/checkout/catalog";
import {
  PayPalError, capturePayPalOrder, getPayPalConfig, getPayPalOrder, isPayPalOrderId,
  type PayPalOrder,
} from "@/lib/checkout/paypal";
import { orderFacts, sendPaidOrderEmails } from "@/lib/checkout/orders";
import SuccessView, { type OrderResult } from "./SuccessView";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
};

function langOf(order: PayPalOrder): Lang {
  return decodeOrderMeta(order.purchase_units?.[0]?.custom_id)?.lang ?? "en";
}

function toResult(order: PayPalOrder): OrderResult {
  const unit = order.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  const meta = decodeOrderMeta(unit?.custom_id ?? capture?.custom_id);
  const lang = meta?.lang ?? "en";

  if (order.status !== "COMPLETED" || !capture) return { status: "unfinished", lang };
  if (capture.status === "DECLINED" || capture.status === "FAILED") return { status: "declined", lang };
  const f = orderFacts(order);
  if (capture.status === "REFUNDED" || capture.status === "PARTIALLY_REFUNDED") return { status: "refunded", lang, ref: f.ref };
  if (capture.status !== "COMPLETED") return { status: "pending", lang, ref: f.ref };

  return {
    status: "paid",
    lang,
    ref: f.ref,
    orderId: order.id,
    amountUsd: f.amountUsd,
    amountAed: f.amountAed,
    tier: f.tier,
    bundle: meta?.bundle ?? null,
    itemCount: f.items.length,
    ebook: f.ebook,
    ai: f.ai,
  };
}

async function settle(orderId: string | undefined): Promise<OrderResult> {
  if (!isPayPalOrderId(orderId)) return { status: "invalid" };
  const paypal = getPayPalConfig();
  if (!paypal) {
    console.error("[checkout/success] PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET env vars are missing.");
    return { status: "invalid" };
  }

  let order: PayPalOrder;
  try {
    order = await getPayPalOrder(paypal, orderId);
  } catch (err: unknown) {
    console.error("[checkout/success] order lookup failed:", err instanceof Error ? err.message : err);
    return { status: "invalid" };
  }

  // Approved by the visitor but not paid yet: take the payment now.
  if (order.status === "APPROVED") {
    try {
      order = await capturePayPalOrder(paypal, orderId, `capture-page-${orderId}-${randomBytes(6).toString("hex")}`);
      // This request took the payment, so it is the one that announces the order.
      const facts = orderFacts(order);
      if (order.status === "COMPLETED" && facts.captureStatus === "COMPLETED") {
        after(() => sendPaidOrderEmails(facts, "confirmation page"));
      }
    } catch (err: unknown) {
      const issue = err instanceof PayPalError ? err.issue : undefined;
      console.error("[checkout/success] capture failed:", err instanceof Error ? err.message : err);
      if (issue === "INSTRUMENT_DECLINED" || issue === "PAYER_ACTION_REQUIRED") {
        return { status: "declined", lang: langOf(order) };
      }
      if (issue === "ORDER_ALREADY_CAPTURED") {
        // Captured a moment ago by another request (a second tab, or the PayPal webhook).
        try { order = await getPayPalOrder(paypal, orderId); } catch { return { status: "invalid" }; }
      } else {
        return { status: "unfinished", lang: langOf(order) };
      }
    }
  }

  return toResult(order);
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = (await searchParams).token;
  const order = await settle(Array.isArray(raw) ? raw[0] : raw);
  return <SuccessView order={order} />;
}
