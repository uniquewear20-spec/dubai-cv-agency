// lib/checkout/client.ts — browser helper shared by the tier cards and the package builder.
import type { Lang, TierKey } from "./catalog";

export type CheckoutSelection = { tier: TierKey } | { items: string[] };

// Asks the server for a Stripe Checkout Session and sends the visitor to it.
// Throws if the session could not be created; the caller shows the error.
export async function startCheckout(selection: CheckoutSelection, lang: Lang): Promise<void> {
  // Trailing slash matches `trailingSlash: true` in next.config.mjs (avoids a redirect on POST).
  const res = await fetch("/api/checkout/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...selection, lang }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || typeof data?.url !== "string") {
    throw new Error(data?.error ?? "Checkout could not be started.");
  }
  window.location.assign(data.url);
}

export const CHECKOUT_TX: Record<"redirecting" | "error", Record<Lang, string>> = {
  redirecting: { en: "Redirecting…", ar: "جارٍ التحويل…", fr: "Redirection…" },
  error: {
    en: "Payment could not be started. Please try again or contact us on WhatsApp.",
    ar: "تعذّر بدء عملية الدفع. يرجى المحاولة مجدداً أو التواصل معنا عبر واتساب.",
    fr: "Le paiement n'a pas pu démarrer. Veuillez réessayer ou nous contacter sur WhatsApp.",
  },
};
