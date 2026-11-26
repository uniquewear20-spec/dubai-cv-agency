import type { Metadata } from "next";
import HayratHome from "@/components/showcase/hayrat/Home";
import { IMG } from "@/lib/showcase/hayrat";
import { hyArDisplay, hyArText, hyDisplay, hyText } from "./fonts";
import "@/components/showcase/kit/kit.css";
import "./hy.css";

export const metadata: Metadata = {
  title: "HAYRAT, a concept website by Zenith Dubai",
  description: "A fictional island hotel over the old pearl banks of the Gulf: a scroll dive to the oyster banks, five room types and a working booking engine. A concept by Zenith Dubai.",
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/hayrat/icon.svg" },
  openGraph: {
    title: "HAYRAT, a concept website by Zenith Dubai",
    description: "An island over the old pearl banks of the Gulf. A concept website by Zenith Dubai.",
    images: IMG.heroDhow ? [{ url: IMG.heroDhow }] : undefined,
  },
};

export default function Page() {
  return (
    <div className={`${hyDisplay.variable} ${hyText.variable} ${hyArDisplay.variable} ${hyArText.variable}`}>
      <HayratHome />
    </div>
  );
}
