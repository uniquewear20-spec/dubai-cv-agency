import type { Metadata } from "next";
import MawqidHome from "@/components/showcase/mawqid/Home";
import { IMG } from "@/lib/showcase/mawqid";
import { mqArDisplay, mqDisplay, mqMono, mqText } from "./fonts";
import "@/components/showcase/kit/kit.css";
import "./mq.css";

export const metadata: Metadata = {
  title: "MAWQID, a concept website by Zenith Dubai",
  description:
    "A fictional fourteen-seat chef's counter around one open fire in Dubai: a tasting menu you scroll through at each course's heat, and a reservation where you pick your seat. A concept by Zenith Dubai.",
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/mawqid/icon.svg" },
  openGraph: {
    title: "MAWQID, a concept website by Zenith Dubai",
    description: "Fourteen seats around one fire. A concept website by Zenith Dubai.",
    images: IMG.heroCounter ? [{ url: IMG.heroCounter }] : undefined,
  },
};

export default function Page() {
  return (
    <div className={`${mqDisplay.variable} ${mqText.variable} ${mqArDisplay.variable} ${mqMono.variable}`}>
      <MawqidHome />
    </div>
  );
}
