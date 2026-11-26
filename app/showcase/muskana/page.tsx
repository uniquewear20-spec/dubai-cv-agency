import type { Metadata } from "next";
import MuskanaHome from "@/components/showcase/muskana/Home";
import { IMG } from "@/lib/showcase/muskana";
import { muNaskh, muRuqaa, muSerif, muText } from "./fonts";
import "@/components/showcase/kit/kit.css";
import "./mu.css";

export const metadata: Metadata = {
  title: "MUSKANA, a concept website by Zenith Dubai",
  description: "A fictional oud and fragrance house in Dubai: build a layered scent in a bottle that fills as you choose, then shop oils, attars and bakhoor. A concept by Zenith Dubai.",
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/muskana/icon.svg" },
  openGraph: { title: "MUSKANA, a concept website by Zenith Dubai", description: "Wear it in layers. A concept website by Zenith Dubai.", images: [{ url: IMG.hero }] },
};

export default function Page() {
  return (
    <div className={`${muSerif.variable} ${muText.variable} ${muRuqaa.variable} ${muNaskh.variable}`}>
      <MuskanaHome />
    </div>
  );
}
