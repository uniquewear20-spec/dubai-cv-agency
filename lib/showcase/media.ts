// Shared by every concept site and the gallery.

/**
 * A resized WebP of a generated image from Higgsfield's image service, until the files are copied to
 * this site. Local paths pass through unchanged.
 */
export const sized = (url: string, w: number) =>
  url.includes("cloudfront.net") ? `https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(url)}&w=${w}&q=82` : url;

/** Higgsfield's image service stops at 1,600 px, so the largest candidate is the 2,720 px original. */
export const srcSet = (url: string, widths: number[] = [960, 1440, 1600]) =>
  url.includes("cloudfront.net") ? [...widths.map((w) => `${sized(url, w)} ${w}w`), `${url} 2720w`].join(", ") : undefined;
