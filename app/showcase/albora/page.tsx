import type { Metadata } from "next";
import AlboraHome from "@/components/showcase/albora/Home";
import { IMG } from "@/lib/showcase/albora";
import { alArabic, alDisplay, alSans, alScript } from "./fonts";
import "@/components/showcase/kit/kit.css";
import "./al.css";

export const metadata: Metadata = {
  title: "ALBORA Residences, a concept website by Zenith Dubai",
  description: "A fictional gated village of 29 white homes above Tamuda Bay, on Morocco's Mediterranean coast: trace the coast, pick a residence on the plan and book a call. A concept by Zenith Dubai.",
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/albora/icon.svg" },
  openGraph: { title: "ALBORA Residences, a concept website by Zenith Dubai", description: "A village by the sea at Tamuda Bay. A concept website by Zenith Dubai.", images: IMG.day ? [{ url: IMG.day }] : undefined },
};

export default function Page() {
  return (
    <div className={`${alDisplay.variable} ${alScript.variable} ${alSans.variable} ${alArabic.variable}`}>
      <AlboraHome />
    </div>
  );
}
