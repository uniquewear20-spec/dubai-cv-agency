// lib/currency.ts
// Display currencies for prices, shared by the tier cards and the package builder.
// List prices are whole AED (lib/checkout/catalog.ts). Every other currency is an
// approximate conversion for display only — PayPal always charges USD at the AED
// peg (see aedToUsd in lib/checkout/catalog.ts).

export type Currency = "AED" | "USD" | "EUR" | "MAD" | "INR" | "SAR" | "NGN";

/** Value of 1 AED in each currency. */
export type Rates = Record<Currency, number>;

export const CURRENCIES: { code: Currency; symbol: string }[] = [
  { code: "AED", symbol: "AED" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "MAD", symbol: "DH" },
  { code: "INR", symbol: "₹" },
  { code: "SAR", symbol: "SAR" },
  { code: "NGN", symbol: "₦" },
];

// Used only if the live rates can't be loaded.
export const FALLBACK_RATES: Rates = {
  AED: 1, USD: 0.27, EUR: 0.25, MAD: 2.68, INR: 22.9, SAR: 1.02, NGN: 415,
};

export const isCurrency = (v: unknown): v is Currency =>
  CURRENCIES.some(c => c.code === v);

export const currencySymbol = (currency: Currency): string =>
  CURRENCIES.find(c => c.code === currency)?.symbol ?? currency;

/** AED amount → amount in `currency`, in whole units (AED stays exact). */
export function convertAed(aed: number, currency: Currency, rates: Rates): number {
  const converted = aed * (rates[currency] ?? FALLBACK_RATES[currency]);
  return currency === "AED" ? converted : Math.round(converted);
}

export const formatAmount = (n: number): string => n.toLocaleString("en-US");

/** AED amount → display value and symbol in `currency`, e.g. 299 → { "81", "$" }. */
export function priceIn(aed: number, currency: Currency, rates: Rates): { value: string; symbol: string } {
  return { value: formatAmount(convertAed(aed, currency, rates)), symbol: currencySymbol(currency) };
}

/** A price for running text in the chosen currency, e.g. "AED 1,000", "US$272" or "approx. € 920". */
export function priceText(aed: number, currency: Currency, rates: Rates, approx = "approx."): string {
  if (currency === "AED") return `AED ${formatAmount(aed)}`;
  if (currency === "USD") return `US$${formatAmount(Math.round(aed / 3.6725))}`;
  return `${approx} ${currencySymbol(currency)} ${formatAmount(convertAed(aed, currency, rates))}`;
}
