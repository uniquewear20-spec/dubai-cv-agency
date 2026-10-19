// lib/zenith-ai/preview-data.ts
// ILLUSTRATIVE SAMPLE DATA for the product-preview chart in the Zenith AI section.
// It describes one imaginary campaign so the dashboard idea can be shown. It is not customer data, not a forecast
// and not a performance claim, and the page labels it that way wherever it appears. Replace it with nothing but
// real, consented data once a dashboard exists.

import type { InkWeek } from "@/components/ui/ink-orbit-features";

export const ZENITH_AI_SAMPLE_WEEKS: readonly InkWeek[] = [
  { prepared: 22, submitted: 15, responses: 0, interviews: 0 },
  { prepared: 28, submitted: 21, responses: 1, interviews: 0 },
  { prepared: 31, submitted: 24, responses: 2, interviews: 0 },
  { prepared: 27, submitted: 22, responses: 2, interviews: 1 },
  { prepared: 34, submitted: 27, responses: 3, interviews: 1 },
  { prepared: 30, submitted: 25, responses: 2, interviews: 1 },
  { prepared: 36, submitted: 29, responses: 4, interviews: 2 },
  { prepared: 33, submitted: 28, responses: 3, interviews: 1 },
];
