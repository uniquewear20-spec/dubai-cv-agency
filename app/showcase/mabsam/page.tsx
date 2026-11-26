import type { Metadata } from "next";
import MabsamHome from "@/components/showcase/mabsam/Home";
import { IMG } from "@/lib/showcase/mabsam";
import { mbAr, mbHead, mbText } from "./fonts";
import "@/components/showcase/kit/kit.css";
import "./mb.css";

export const metadata: Metadata = {
  title: "MABSAM, a concept website by Zenith Dubai",
  description: "A fictional dental clinic in Jumeirah: a calm treatment finder that also asks how you feel about dentists, a breathing exercise, and a first-visit booking. A concept by Zenith Dubai.",
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/mabsam/icon.svg" },
  openGraph: { title: "MABSAM, a concept website by Zenith Dubai", description: "A dentist you don't dread. A concept website by Zenith Dubai.", images: [{ url: IMG.hero }] },
};

export default function Page() {
  return (
    <div className={`${mbHead.variable} ${mbText.variable} ${mbAr.variable}`}>
      <MabsamHome />
    </div>
  );
}
