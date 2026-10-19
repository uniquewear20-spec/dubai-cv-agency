// app/api/paypal/webhook/route.ts — PayPal webhook (verified, idempotent).
//
// Why: if a customer approves a payment and closes the tab before returning to the site, the
// confirmation page never runs. This webhook captures that payment on the server, and tells
// Zenith about refunds, reversals and held payments that complete later.
//
// Setup (once, by the account owner): developer.paypal.com → Apps & Credentials → the live app
// → Add webhook → URL https://zenithdubaicv.com/api/paypal/webhook/ with the events
// CHECKOUT.ORDER.APPROVED, PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED,
// PAYMENT.CAPTURE.REFUNDED and PAYMENT.CAPTURE.REVERSED. Then put the webhook's id in Vercel as
// PAYPAL_WEBHOOK_ID. Until it is set, this endpoint refuses every call.
//
// Every event's signature is checked with PayPal before anything happens. Captures are
// race-safe: PayPal captures an order once, so if the confirmation page got there first this
// handler gets ORDER_ALREADY_CAPTURED and sends nothing.

import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { decodeOrderMeta } from "@/lib/checkout/catalog";
import { PayPalError, capturePayPalOrder, getPayPalConfig, getPayPalOrder, isPayPalOrderId, verifyWebhookSignature, type PayPalCapture } from "@/lib/checkout/paypal";
import { orderFacts, sendAdminNotice, sendPaidOrderEmails } from "@/lib/checkout/orders";

interface WebhookEvent {
  id?: string;
  event_type?: string;
  resource?: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  const paypal = getPayPalConfig();
  const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim();
  if (!paypal || !webhookId) {
    console.error("[paypal/webhook] PAYPAL_WEBHOOK_ID or PayPal keys are not configured.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  let event: WebhookEvent;
  try {
    event = (await req.json()) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  let verified = false;
  try {
    verified = await verifyWebhookSignature(paypal, req.headers, event, webhookId);
  } catch (err) {
    console.error("[paypal/webhook] verification call failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Verification unavailable." }, { status: 502 }); // PayPal retries
  }
  if (!verified) {
    console.error("[paypal/webhook] rejected an event with an invalid signature:", event.id);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const type = event.event_type ?? "";
  const resource = event.resource ?? {};

  try {
    if (type === "CHECKOUT.ORDER.APPROVED") {
      const orderId = String(resource.id ?? "");
      if (!isPayPalOrderId(orderId)) return NextResponse.json({ ok: true, ignored: "no order id" });
      const current = await getPayPalOrder(paypal, orderId);
      if (current.status !== "APPROVED") return NextResponse.json({ ok: true, ignored: `order ${current.status}` });
      try {
        const order = await capturePayPalOrder(paypal, orderId, `capture-hook-${orderId}-${randomBytes(6).toString("hex")}`);
        const f = orderFacts(order);
        if (order.status === "COMPLETED" && f.captureStatus === "COMPLETED") await sendPaidOrderEmails(f, "PayPal webhook");
        else if (f.captureStatus === "PENDING") await sendAdminNotice(`Payment held by PayPal: ${f.ref}`, [`${f.label}, US$${f.amountUsd}. PayPal is reviewing this payment. Do not start work until it completes.`, `PayPal order: ${orderId}`]);
        return NextResponse.json({ ok: true, captured: true });
      } catch (err) {
        if (err instanceof PayPalError && err.issue === "ORDER_ALREADY_CAPTURED") return NextResponse.json({ ok: true, ignored: "already captured" });
        throw err;
      }
    }

    if (type === "PAYMENT.CAPTURE.COMPLETED") {
      // Only interesting when the payment was held and completed later; immediate captures
      // were already announced by whoever captured them.
      const c = resource as unknown as PayPalCapture;
      const held = c.create_time && c.update_time && Date.parse(c.update_time) - Date.parse(c.create_time) > 120_000;
      if (held) {
        const meta = decodeOrderMeta(c.custom_id);
        await sendAdminNotice(`Held payment now completed: ${meta?.ref ?? c.invoice_id ?? c.id}`, [
          `PayPal has completed a payment it was holding: US$${c.amount?.value ?? "?"}.`,
          `Reference ${meta?.ref ?? c.invoice_id ?? "-"}, capture ${c.id}. You can start this order.`,
        ]);
      }
      return NextResponse.json({ ok: true });
    }

    if (type === "PAYMENT.CAPTURE.DENIED" || type === "PAYMENT.CAPTURE.REFUNDED" || type === "PAYMENT.CAPTURE.REVERSED") {
      const c = resource as unknown as PayPalCapture & { custom_id?: string; invoice_id?: string };
      const meta = decodeOrderMeta(c.custom_id);
      const what = type === "PAYMENT.CAPTURE.DENIED" ? "Payment denied" : type === "PAYMENT.CAPTURE.REFUNDED" ? "Payment refunded" : "Payment reversed (dispute or chargeback)";
      await sendAdminNotice(`${what}: ${meta?.ref ?? c.invoice_id ?? c.id}`, [
        `${what}: US$${c.amount?.value ?? "?"}.`,
        `Reference ${meta?.ref ?? c.invoice_id ?? "-"}, PayPal id ${c.id}.`,
        type === "PAYMENT.CAPTURE.DENIED" ? "Do not start this order." : "Check PayPal → Activity for details.",
      ]);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, ignored: type });
  } catch (err) {
    console.error(`[paypal/webhook] ${type} failed:`, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Processing failed." }, { status: 500 }); // PayPal retries later
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
