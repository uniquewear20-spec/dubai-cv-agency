// app/order/brief/page.tsx — after payment, the customer sends their brief (CV, target roles).
//   /order/brief/?token=<PayPal order id>   PayPal orders: checked with PayPal, details prefilled
//   /order/brief/                           Gumroad and other orders: the customer gives their order number
import type { Metadata } from "next";
import { getPayPalConfig, getPayPalOrder, isPayPalOrderId } from "@/lib/checkout/paypal";
import { orderFacts } from "@/lib/checkout/orders";
import BriefForm, { type BriefOrder } from "./BriefForm";

export const metadata: Metadata = {
  title: "Send your brief",
  robots: { index: false, follow: false },
};

async function lookup(token: string | undefined): Promise<BriefOrder | null> {
  if (!isPayPalOrderId(token)) return null;
  const paypal = getPayPalConfig();
  if (!paypal) return null;
  try {
    const order = await getPayPalOrder(paypal, token);
    const f = orderFacts(order);
    if (order.status !== "COMPLETED" || !f.captureStatus || !["COMPLETED", "PENDING"].includes(f.captureStatus)) return null;
    return { token, ref: f.ref, tier: f.tier, items: f.items.length, lang: f.lang, email: f.payerEmail ?? "", name: f.payerName ?? "" };
  } catch (err) {
    console.error("[order/brief] lookup failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

export default async function BriefPage({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const raw = (await searchParams).token;
  const token = Array.isArray(raw) ? raw[0] : raw;
  const order = await lookup(token);
  return <BriefForm order={order} tokenGiven={Boolean(token)} />;
}
