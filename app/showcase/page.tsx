import type { Metadata } from "next";
import Gallery from "@/components/showcase/Gallery";
import "./gallery.css";

export const metadata: Metadata = {
  title: { absolute: "Concept websites by Zenith Dubai" },
  description: "Working websites for fictional businesses, designed and built by Zenith Dubai as concepts.",
  alternates: { canonical: "/showcase/" },
  // Kept out of search until the collection is approved for launch.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Gallery />;
}
