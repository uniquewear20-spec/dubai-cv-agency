import type { Metadata } from "next";
import ShorelineHome from "@/components/showcase/shoreline/Home";
import { IMG } from "@/lib/showcase/shoreline";
import { shAr, shHead, shText } from "./fonts";
import "@/components/showcase/kit/kit.css";
import "./sh.css";

export const metadata: Metadata = {
  title: "SHORELINE NO. 9, a concept website by Zenith Dubai",
  description: "One fictional beachfront house on Palm Jumeirah: walk its plan room by room, pan the view from the terrace, and request a private viewing. A concept by Zenith Dubai.",
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/shoreline-9/icon.svg" },
  openGraph: { title: "SHORELINE NO. 9, a concept website by Zenith Dubai", description: "Number nine, on the water. A concept website by Zenith Dubai.", images: [{ url: IMG.hero }] },
};

export default function Page() {
  return (
    <div className={`${shHead.variable} ${shText.variable} ${shAr.variable}`}>
      <ShorelineHome />
    </div>
  );
}
