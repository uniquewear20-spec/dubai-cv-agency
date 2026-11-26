import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPage from "@/components/showcase/tifawt/ProductPage";
import { PRODUCTS, bySlug, sized } from "@/lib/showcase/tifawt";
import { tfDisplay, tfText, tfTifinagh } from "../fonts";
import "../tf.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  const title = `${p.name}, TIFAWT (concept by Zenith Dubai)`;
  return {
    title: { absolute: title },
    description: `${p.kind.en}. ${p.tagline.en} A fictional product on a concept website by Zenith Dubai.`,
    alternates: { canonical: `/showcase/tifawt/${p.slug}/` },
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description: p.tagline.en,
      url: `/showcase/tifawt/${p.slug}/`,
      type: "website",
      images: p.pack ? [{ url: sized(p.pack, 1200), width: 1200, height: 1600, alt: `${p.name}, ${p.object.en}` }] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!bySlug(slug)) notFound();
  return (
    <div className={`${tfDisplay.variable} ${tfText.variable} ${tfTifinagh.variable}`}>
      <ProductPage slug={slug} />
    </div>
  );
}
