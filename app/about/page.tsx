// app/about/page.tsx — About Zenith Dubai: the founder, the four disciplines, the method, the markets.
import type { Metadata } from "next";
import AboutApp from "@/components/about/AboutApp";
import { META } from "@/components/about/copy";

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: "/about/" },
  openGraph: {
    title: `${META.title} — Zenith Dubai CV`,
    description: META.description,
    url: "/about/",
    images: [{ url: "/images/og-zenith.png", width: 1200, height: 630, alt: "Zenith Dubai CV" }],
  },
};

export default function AboutPage() {
  return <AboutApp />;
}
