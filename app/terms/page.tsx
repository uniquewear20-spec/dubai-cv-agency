// app/terms/page.tsx — Terms of service. The text lives in lib/legal/docs.ts.
import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";
import { TERMS } from "@/lib/legal/docs";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms for Zenith Dubai CV's career services, payments and the Zenith AI job agent.",
  alternates: { canonical: "/terms/" },
};

export default function Page() {
  return <LegalPage kind="terms" docs={TERMS} />;
}
