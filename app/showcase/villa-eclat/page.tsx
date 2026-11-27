import type { Metadata } from "next";
import VillaEclat from "@/components/showcase/villa-eclat/Home";
import { IMG } from "@/lib/showcase/villa-eclat";
import { veDeco } from "./fonts";
import "@/components/showcase/kit/kit.css";
import "./ve.css";

export const metadata: Metadata = {
  title: "Villa Éclat, a concept website by Zenith Dubai",
  description: "A fictional beachfront villa on the Dubai coast, shown as a film you drive with your scroll: fly in over the lawn, through the door and room by room, then explore the plans and request a viewing. A concept by Zenith Dubai.",
  robots: { index: false, follow: true },
  icons: { icon: "/showcase/villa-eclat/icon.svg" },
  openGraph: { title: "Villa Éclat, a concept website by Zenith Dubai", description: "A fictional beachfront villa on the Dubai coast. A concept website by Zenith Dubai.", images: IMG.day ? [{ url: IMG.day }] : undefined },
};

export default function Page() {
  return (
    <div className={veDeco.variable}>
      <VillaEclat />
    </div>
  );
}
