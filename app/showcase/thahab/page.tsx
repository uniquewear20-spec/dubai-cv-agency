import type { Metadata } from "next";
import ThahabHome from "@/components/showcase/thahab/Home";
import { IMG } from "@/lib/showcase/thahab";
import { thAr, thHead, thLalezar, thText } from "./fonts";
import "@/components/showcase/kit/kit.css";
import "./th.css";

export const metadata: Metadata = {
  title: "THAHAB, a concept website by Zenith Dubai",
  description: "A fictional camp of twelve tents in the Empty Quarter: a day from first light to the telescope, and a stay you plan by the real phases of the moon. A concept by Zenith Dubai.",
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/thahab/icon.svg" },
  openGraph: { title: "THAHAB, a concept website by Zenith Dubai", description: "Twelve tents and the whole sky. A concept website by Zenith Dubai.", images: [{ url: IMG.hero }] },
};

export default function Page() {
  return (
    <div className={`${thHead.variable} ${thText.variable} ${thLalezar.variable} ${thAr.variable}`}>
      <ThahabHome />
    </div>
  );
}
