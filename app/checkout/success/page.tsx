// app/checkout/success/page.tsx — Zenith Dubai CV · payment confirmation
// PayPal sends the visitor here after they approve the payment, and when they leave PayPal
// without paying (the order's cancel link):
//   /checkout/success/?token=<PayPal order id>&PayerID=…
//   /checkout/success/?cancelled=1&token=<PayPal order id>
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
import { orderFacts, sendPaidOrderEmails, sendPaymentStatusEmails } from "@/lib/checkout/orders";
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

/** PayPal issues that mean the payer's bank or PayPal refused the money (shown as declined, never as a technical problem). */
const DECLINED = new Set(["INSTRUMENT_DECLINED", "TRANSACTION_REFUSED", "PAYER_CANNOT_PAY", "PAYER_ACCOUNT_RESTRICTED", "PAYER_ACCOUNT_LOCKED_OR_CLOSED",
  "MAX_NUMBER_OF_PAYMENT_ATTEMPTS_EXCEEDED", "TRANSACTION_LIMIT_EXCEEDED", "CARD_EXPIRED", "CARD_CLOSED", "REDIRECT_PAYER_FOR_ALTERNATE_FUNDING"]);

/** The PayPal page where the payer finishes a step PayPal asks for (a bank's security check). */
const payerActionUrl = (order: PayPalOrder) => order.links?.find(l => l.rel === "payer-action" || l.rel === "approve")?.href ?? null;

/**
 * Works out the order's state from PayPal, capturing it when the visitor has approved it. Each
 * outcome is told apart: paid, held for review, declined, a step left on PayPal, left before paying
 * (`cancelled`: PayPal's cancel link brings the visitor here), and a technical problem, in which
 * case the visitor is asked not to pay again.
 */
async function settle(orderId: string | undefined, cancelled: boolean): Promise<OrderResult> {
  if (!isPayPalOrderId(orderId)) return cancelled ? { status: "cancelled", lang: "en" } : { status: "invalid" };
  const paypal = getPayPalConfig();
  if (!paypal) {
    console.error("[checkout/success] PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET env vars are missing.");
    return { status: "error", lang: "en" };
  }

  let order: PayPalOrder;
  try {
    order = await getPayPalOrder(paypal, orderId);
  } catch (err: unknown) {
    console.error("[checkout/success] order lookup failed:", err instanceof Error ? err.message : err);
    const notFound = err instanceof PayPalError && (err.status === 404 || err.issue === "RESOURCE_NOT_FOUND" || err.issue === "INVALID_RESOURCE_ID");
    return notFound ? { status: "invalid" } : { status: "error", lang: "en" };
  }

  // Left PayPal before approving (cancelled, or the card was refused on PayPal's own page).
  if (order.status === "CREATED" || order.status === "SAVED" || order.status === "VOIDED") return { status: "cancelled", lang: langOf(order) };
  if (order.status === "PAYER_ACTION_REQUIRED") {
    const url = payerActionUrl(order);
    return url ? { status: "action", lang: langOf(order), url } : { status: "cancelled", lang: langOf(order) };
  }

  // Approved by the visitor but not paid yet: take the payment now.
  if (order.status === "APPROVED") {
    try {
      order = await capturePayPalOrder(paypal, orderId, `capture-page-${orderId}-${randomBytes(6).toString("hex")}`);
      // This request took the payment, so it is the one that announces the order.
      const facts = orderFacts(order);
      if (order.status === "COMPLETED" && facts.captureStatus === "COMPLETED") {
        after(() => sendPaidOrderEmails(facts, "confirmation page"));
      } else if (facts.captureStatus === "PENDING") {
        after(() => sendPaymentStatusEmails(facts, "pending", "confirmation page"));
      } else if (facts.captureStatus === "DECLINED" || facts.captureStatus === "FAILED") {
        after(() => sendPaymentStatusEmails(facts, "declined", "confirmation page"));
      }
    } catch (err: unknown) {
      const issue = err instanceof PayPalError ? err.issue ?? "" : "";
      console.error("[checkout/success] capture failed:", err instanceof Error ? err.message : err);
      if (DECLINED.has(issue)) {
        // PayPal itself reported the decline: the customer is told on screen and by email.
        const facts = orderFacts(order);
        after(() => sendPaymentStatusEmails(facts, "declined", "confirmation page"));
        return { status: "declined", lang: langOf(order) };
      }
      if (issue === "PAYER_ACTION_REQUIRED") {
        try { order = await getPayPalOrder(paypal, orderId); } catch { return { status: "error", lang: langOf(order) }; }
        const url = payerActionUrl(order);
        return url ? { status: "action", lang: langOf(order), url } : { status: "declined", lang: langOf(order) };
      }
      if (issue === "ORDER_ALREADY_CAPTURED") {
        // Captured a moment ago by another request (a second tab, or the PayPal webhook).
        try { order = await getPayPalOrder(paypal, orderId); } catch { return { status: "error", lang: langOf(order) }; }
      } else {
        // PayPal didn't answer, or answered something unexpected: we can't say whether money was taken.
        return { status: "error", lang: langOf(order) };
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
  const params = await searchParams;
  const raw = params.token;
  const order = await settle(Array.isArray(raw) ? raw[0] : raw, params.cancelled === "1");
  return <SuccessView order={order} />;
}
