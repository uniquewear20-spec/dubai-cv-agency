"use client";

// Shared by the concept sites: a Higgsfield still served through the resizing proxy at a few
// widths. A missing source renders a quiet placeholder so a page never shows a broken image.
// A source written "crop:<url>#W,H,x,y,w,h" shows one cell of a 2x2 grid image: the cell is cut
// out by CSS and covers its box like object-fit: cover, so grids need no separate files.

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
  if (src.startsWith("crop:")) {
    const [url, box] = src.slice(5).split("#");
    const [W, H, x, y, w, h] = box.split(",").map(Number);
    const vars = { "--W": W, "--H": H, "--cw": w, "--ch": h, "--cx": x + w / 2, "--cy": y + h / 2 } as CSSProperties;
    const twice = sizes.replace(/(\d+(?:\.\d+)?(?:vw|px))/g, "calc(2 * $1)");
    const wide = widths.map((n) => Math.min(2400, n * 2));
    return (
      <span className={`kit-img-missing kit-crop ${className ?? ""}`} style={{ ...style, ...vars }} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="kit-crop-img"
          src={sized(url, wide[Math.min(2, wide.length - 1)])}
          srcSet={wide.map((n) => `${sized(url, n)} ${n}w`).join(", ")}
          sizes={twice}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
        />
      </span>
    );
  }
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
