import type { Metadata } from "next";
import HaloRidge from "@/components/showcase/HaloRidge";
import { SCENES, sized } from "@/lib/showcase/halo-ridge";
import { hrDisplay, hrText } from "./fonts";
import { arabic } from "../../fonts";
import "./hr.css";

// A concept site: kept out of search results so nobody mistakes the fictional development for a listing.
export const metadata: Metadata = {
  title: { absolute: "Halo Ridge, a concept website by Zenith Dubai" },
  description: "A scroll-controlled flight into a fictional villa community, designed and built by Zenith Dubai as a concept.",
  alternates: { canonical: "/showcase/halo-ridge/" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Halo Ridge, a concept website by Zenith Dubai",
    description: "A scroll-controlled flight into a fictional villa community on the edge of the desert.",
    url: "/showcase/halo-ridge/",
    type: "website",
    images: [{ url: sized(SCENES[0].still.url ?? "", 1200), width: 1200, height: 675, alt: "Aerial view of the fictional Halo Ridge villa community" }],
  },
  twitter: { card: "summary_large_image", title: "Halo Ridge, a concept website by Zenith Dubai" },
};

export default function Page() {
  return (
    <div className={`${hrDisplay.variable} ${hrText.variable} ${arabic.variable}`}>
      <HaloRidge />
    </div>
  );
}
