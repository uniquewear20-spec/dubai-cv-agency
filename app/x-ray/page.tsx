// app/x-ray/page.tsx — the free ATS CV X-Ray. The CV is read and checked in the visitor's browser.
import type { Metadata } from "next";
import XrayApp from "@/components/xray/XrayApp";
import "./xray.css";

export const metadata: Metadata = {
  title: "Free ATS CV X-Ray",
  description:
    "See your CV the way screening software reads it: layout, sections, keywords, results and role fit, checked in your browser. Your CV is never uploaded. Free, in English, French and Arabic.",
  alternates: { canonical: "/x-ray/" },
  openGraph: {
    title: "Free ATS CV X-Ray — Zenith Dubai CV",
    description: "See your CV the way screening software reads it. Checked in your browser; your CV is never uploaded.",
    url: "/x-ray/",
    images: [{ url: "/images/og-zenith.png", width: 1200, height: 630, alt: "Zenith Dubai CV" }],
  },
};

export default function XrayPage() {
  return <XrayApp />;
}
