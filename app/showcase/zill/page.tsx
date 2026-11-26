import type { Metadata } from "next";
import ZillHome from "@/components/showcase/zill/Home";
import { IMG } from "@/lib/showcase/zill";
import { zlArabic, zlLatin } from "./fonts";
import "@/components/showcase/kit/kit.css";
import "./zl.css";

export const metadata: Metadata = {
  title: "ZILL, a concept website by Zenith Dubai",
  description:
    "A fictional architecture studio for hot climates: a courtyard house that assembles itself as you scroll, a working sun study and a brief that fills in a drawing sheet. A concept by Zenith Dubai.",
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/zill/icon.svg" },
  openGraph: {
    title: "ZILL, a concept website by Zenith Dubai",
    description: "Buildings that make their own shade. A concept website by Zenith Dubai.",
    images: IMG.hero ? [{ url: IMG.hero }] : undefined,
  },
};

export default function Page() {
  return (
    <div className={`${zlLatin.variable} ${zlArabic.variable}`}>
      <ZillHome />
    </div>
  );
}
