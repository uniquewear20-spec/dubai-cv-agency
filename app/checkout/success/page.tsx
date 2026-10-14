// app/checkout/success/page.tsx — Zenith Dubai CV · Payment confirmation
// PayPal sends the visitor here after they approve the payment:
//   /checkout/success/?token=<PayPal order id>&PayerID=…
// The order is looked up on the server; if it is approved but not yet paid,
// the money is captured here. It is only shown as paid when PayPal reports
// the capture as COMPLETED.

import type { Metadata } from "next";
import { decodeOrderMeta, type Lang } from "@/lib/checkout/catalog";
import {
  PayPalError, capturePayPalOrder, getPayPalConfig, getPayPalOrder, isPayPalOrderId,
  type PayPalOrder,
} from "@/lib/checkout/paypal";
import SuccessView, { type OrderResult } from "./SuccessView";

export const metadata: Metadata = {
  title: "Your order — Zenith Dubai CV",
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
  if (capture.status !== "COMPLETED") return { status: "pending", lang, ref: meta?.ref ?? order.id };

  return {
    status: "paid",
    lang,
    ref: meta?.ref ?? order.id,
    amountUsd: capture.amount?.value ?? unit?.amount?.value ?? "",
    amountAed: meta?.aed ?? 0,
    tier: meta?.tier ?? null,
    bundle: meta?.bundle ?? null,
    itemCount: meta?.items?.length ?? 0,
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
      order = await capturePayPalOrder(paypal, orderId);
    } catch (err: unknown) {
      const issue = err instanceof PayPalError ? err.issue : undefined;
      console.error("[checkout/success] capture failed:", err instanceof Error ? err.message : err);
      if (issue === "INSTRUMENT_DECLINED" || issue === "PAYER_ACTION_REQUIRED") {
        return { status: "declined", lang: langOf(order) };
      }
      if (issue === "ORDER_ALREADY_CAPTURED") {
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
