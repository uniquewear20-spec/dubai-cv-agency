import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoomPage from "@/components/showcase/hayrat/RoomPage";
import { ROOMS, roomById, type RoomId } from "@/lib/showcase/hayrat";
import { hyArDisplay, hyArText, hyDisplay, hyText } from "../fonts";
import "@/components/showcase/kit/kit.css";
import "../hy.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return ROOMS.map((r) => ({ room: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ room: string }> }): Promise<Metadata> {
  const { room } = await params;
  const r = roomById(room);
  if (!r) return {};
  return {
    title: `${r.name.en}, HAYRAT (concept)`,
    description: `${r.line.en}. A room at HAYRAT, a fictional island hotel and concept website by Zenith Dubai.`,
    robots: { index: false, follow: true },
    icons: { icon: "/showcase/hayrat/icon.svg" },
    openGraph: r.img ? { images: [{ url: r.img }] } : undefined,
  };
}

export default async function Page({ params }: { params: Promise<{ room: string }> }) {
  const { room } = await params;
  const r = roomById(room);
  if (!r) notFound();
  return (
    <div className={`${hyDisplay.variable} ${hyText.variable} ${hyArDisplay.variable} ${hyArText.variable}`}>
      <RoomPage id={r.id as RoomId} />
    </div>
  );
}
