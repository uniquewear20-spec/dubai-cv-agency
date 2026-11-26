import type { Metadata } from "next";
import Home from "@/components/showcase/tifawt/Home";
import { PRODUCTS, sized } from "@/lib/showcase/tifawt";
import { tfDisplay, tfLogo, tfText, tfTifinagh } from "./fonts";
import "./tf.css";

// A concept site: kept out of search results so nobody mistakes the fictional brand for a real shop.
export const metadata: Metadata = {
  title: { absolute: "TIFAWT, a concept website by Zenith Dubai" },
  description: "A fictional Moroccan argan beauty house: sculptural packaging, a split-screen hero and a complete shop, designed and built by Zenith Dubai as a concept.",
  alternates: { canonical: "/showcase/tifawt/" },
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/tifawt/argan-icon.svg" },
  openGraph: {
    title: "TIFAWT, a concept website by Zenith Dubai",
    description: "Argan from the Souss, shaped by Moroccan design. A fictional beauty house built as a concept.",
    url: "/showcase/tifawt/",
    type: "website",
    images: PRODUCTS[0].pack ? [{ url: sized(PRODUCTS[0].pack, 1200), width: 1200, height: 1600, alt: "TIFAWT Huile Pure in its horseshoe-arch flask" }] : undefined,
  },
  twitter: { card: "summary_large_image", title: "TIFAWT, a concept website by Zenith Dubai" },
};

export default function Page() {
  return (
    <div className={`${tfDisplay.variable} ${tfText.variable} ${tfTifinagh.variable} ${tfLogo.variable}`}>
      <Home />
    </div>
  );
}
