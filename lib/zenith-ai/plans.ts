// lib/zenith-ai/plans.ts
// Zenith AI Career Automation: the plans shown on the homepage.
//
// No price has been approved. Every plan has `price: null`, which the page shows as "Price to be announced" with a
// launch-list call to action. To publish a price, set `price: { aed: <amount> }` and `status: "approved"`; the page
// then shows it in the visitor's chosen currency, with no other change to the UI.
//
// `checkout` is false for every plan and must stay false until a real checkout, plan entitlements and fulfilment
// exist (see docs/zenith-ai-career-automation.md). While it is false the page cannot take payment for these plans.
//
// Allowances count confirmed submissions only: a drafted application that was never sent does not use any of it
// (see `countsTowardAllowance` in lib/zenith-ai/contracts.ts).

export type ZenithAIPlanId = "starter" | "professional" | "executive" | "gold";

export interface ZenithAIPlan {
  id: ZenithAIPlanId;
  /** Confirmed application submissions included. `null`: defined by an agreed service period (Gold). */
  submissions: number | null;
  /** Approved price in AED, or `null` while the price has not been decided. */
  price: { aed: number } | null;
  /** "proposed" until commercially approved. Gold also needs its service period, fair-use policy,
   *  eligibility criteria and renewal conditions defined before it can open. */
  status: "proposed" | "approved";
  /** Stays false until checkout, entitlements and fulfilment are built. */
  checkout: false;
}

export const ZENITH_AI_PLANS: readonly ZenithAIPlan[] = [
  { id: "starter",      submissions: 100,  price: null, status: "proposed", checkout: false },
  { id: "professional", submissions: 500,  price: null, status: "proposed", checkout: false },
  { id: "executive",    submissions: 1000, price: null, status: "proposed", checkout: false },
  { id: "gold",         submissions: null, price: null, status: "proposed", checkout: false },
];

/** Where the service stands. While it is "launch-list", every call to action on the page joins the launch list. */
export const ZENITH_AI_STATUS: "launch-list" | "onboarding" | "live" = "launch-list";
