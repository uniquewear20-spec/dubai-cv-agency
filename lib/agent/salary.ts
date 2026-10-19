// lib/agent/salary.ts — reads salaries written as text ("$170k - $200k", "AED 25,000 per month").

import type { SalaryRange } from "./types";

const CURRENCIES: [RegExp, string][] = [
  [/\bAED\b|د\.إ|dirham/i, "AED"], [/\bSAR\b|ريال سعودي/i, "SAR"], [/\bQAR\b/i, "QAR"], [/\bKWD\b/i, "KWD"], [/\bBHD\b/i, "BHD"], [/\bOMR\b/i, "OMR"],
  [/\bEUR\b|€/i, "EUR"], [/\bGBP\b|£/i, "GBP"], [/\bCHF\b/i, "CHF"], [/\bCAD\b|C\$/i, "CAD"], [/\bAUD\b|A\$/i, "AUD"], [/\bINR\b|₹/i, "INR"],
  [/\bMAD\b|dirhams? marocains?/i, "MAD"], [/\bUSD\b|US\$|\$/i, "USD"],
];

const PERIODS: [RegExp, SalaryRange["period"]][] = [
  [/(per|an|\/|a)\s*h(ou)?r\b|hourly|de l'heure|\/h\b/i, "hour"],
  [/(per|a|\/)\s*day\b|daily|par jour|\/d\b/i, "day"],
  [/(per|a|\/)\s*month|monthly|\bp\.?m\.?\b|par mois|mensuel|شهري/i, "month"],
  [/(per|a|\/)\s*(year|annum|yr)|annual|yearly|\bp\.?a\.?\b|par an|annuel|سنوي/i, "year"],
];

/** Numbers in a salary text, with k / m suffixes applied ("35,3k" → 35300). */
function amounts(text: string): number[] {
  const out: number[] = [];
  for (const m of text.matchAll(/(\d{1,3}(?:[ ,.]\d{3})+|\d+(?:[.,]\d+)?)\s*([kKmM])?(?![\d])/g)) {
    let raw = m[1];
    const suffix = m[2]?.toLowerCase();
    // "35,3k" (decimal comma with a suffix) vs "35,000" (thousands separator)
    if (/^\d{1,3}([ ,.]\d{3})+$/.test(raw) && !suffix) raw = raw.replace(/[ ,.]/g, "");
    else raw = raw.replace(",", ".").replace(/ /g, "");
    let n = Number(raw);
    if (!Number.isFinite(n)) continue;
    if (suffix === "k") n *= 1_000;
    if (suffix === "m") n *= 1_000_000;
    out.push(Math.round(n));
  }
  return out;
}

export function parseSalary(text: string | null | undefined): SalaryRange | null {
  if (!text || !/\d/.test(text)) return null;
  const currency = CURRENCIES.find(([re]) => re.test(text))?.[1] ?? null;
  const nums = amounts(text).filter(n => n >= 5);
  if (!nums.length) return null;
  let period = PERIODS.find(([re]) => re.test(text))?.[1] ?? null;
  const top = Math.max(...nums);
  if (!period) period = top < 300 ? "hour" : top < 20_000 && /\b(AED|SAR|QAR|KWD|BHD|OMR)\b/i.test(text) ? "month" : top >= 15_000 ? "year" : null;
  return { min: Math.min(...nums), max: nums.length > 1 ? top : null, currency, period };
}

/** Rough annual equivalent, for comparing with the candidate's minimum. */
export function annual(n: number, period: SalaryRange["period"]): number {
  switch (period) {
    case "month": return n * 12;
    case "day": return n * 220;
    case "hour": return n * 1_800;
    default: return n;
  }
}
