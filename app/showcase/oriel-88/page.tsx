import type { Metadata } from "next";
import OrielHome from "@/components/showcase/oriel/Home";
import { IMG } from "@/lib/showcase/oriel";
import { orArabic, orSans, orSerif } from "./fonts";
import "@/components/showcase/kit/kit.css";
import "./or.css";

export const metadata: Metadata = {
  title: "ORIEL 88, a concept website by Zenith Dubai",
  description: "A fictional 88-storey residential tower on the Dubai Water Canal: pick a floor on the elevation to see its homes and its view. A concept by Zenith Dubai.",
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/oriel-88/icon.svg" },
  openGraph: { title: "ORIEL 88, a concept website by Zenith Dubai", description: "Eighty-eight floors above the canal. A concept website by Zenith Dubai.", images: [{ url: IMG.hero }] },
};

export default function Page() {
  return (
    <div className={`${orSerif.variable} ${orSans.variable} ${orArabic.variable}`}>
      <OrielHome />
    </div>
  );
}
