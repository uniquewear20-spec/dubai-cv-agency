// app/refund/page.tsx — Refund policy. The text lives in lib/legal/docs.ts.
import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { REFUND } from "@/lib/legal/docs";

export const metadata: Metadata = {
  title: "Refund policy",
  description: "A full refund on any purchase when you ask within 7 days of the purchase date.",
  alternates: { canonical: "/refund/" },
};

export default function Page() {
  return <LegalPage kind="refund" docs={REFUND} />;
}
