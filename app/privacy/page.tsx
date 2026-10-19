// app/privacy/page.tsx — Privacy policy. The text lives in lib/legal/docs.ts.
import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { PRIVACY } from "@/lib/legal/docs";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Zenith Dubai CV collects, why, who processes it, and how to have it corrected or deleted, including the AI job agent.",
  alternates: { canonical: "/privacy/" },
};

export default function Page() {
  return <LegalPage kind="privacy" docs={PRIVACY} />;
}
