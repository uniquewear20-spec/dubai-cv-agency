import type { Metadata } from "next";
import KhayyalHome from "@/components/showcase/khayyal/Home";
import { IMG } from "@/lib/showcase/khayyal";
import { khArabic, khDisplay, khText } from "./fonts";
import "@/components/showcase/kit/kit.css";
import "./kh.css";

export const metadata: Metadata = {
  title: "KHAYYAL, a concept website by Zenith Dubai",
  description: "A fictional Gulf grand-tourer marque: move the studio light along the car, build yours with a live price, and book a test drive. A concept by Zenith Dubai.",
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/khayyal/icon.svg" },
  openGraph: { title: "KHAYYAL, a concept website by Zenith Dubai", description: "The long way, by choice. A concept website by Zenith Dubai.", images: [{ url: IMG.hero }] },
};

export default function Page() {
  return (
    <div className={`${khDisplay.variable} ${khText.variable} ${khArabic.variable}`}>
      <KhayyalHome />
    </div>
  );
}
