"use client";

// Shared by the concept sites: a Higgsfield still served through the resizing proxy at a few
// widths. A missing source renders a quiet placeholder so a page never shows a broken image.

import type { CSSProperties } from "react";
import { sized } from "@/lib/showcase/media";

export function Img({
  src,
  alt,
  sizes = "100vw",
  widths = [480, 800, 1200, 1600],
  className,
  style,
  eager,
}: {
  src: string;
  alt: string;
  sizes?: string;
  widths?: number[];
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}) {
  if (!src) return <span className={`kit-img-missing ${className ?? ""}`} style={style} aria-hidden />;
  const proxied = src.includes("cloudfront.net");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={proxied ? sized(src, widths[Math.min(2, widths.length - 1)]) : src}
      srcSet={proxied ? widths.map((w) => `${sized(src, w)} ${w}w`).join(", ") : undefined}
      sizes={sizes}
      alt={alt}
      className={className}
      style={style}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );
}
