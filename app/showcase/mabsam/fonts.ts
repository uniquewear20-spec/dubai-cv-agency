// MABSAM's type: Outfit for headlines, Figtree for text, Tajawal for Arabic. Self-hosted, SIL Open
// Font License.
import localFont from "next/font/local";

export const mbHead = localFont({ src: [{ path: "../../../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2", weight: "100 900", style: "normal" }], variable: "--mb-head", display: "swap", fallback: ["Helvetica Neue", "Arial", "sans-serif"] });
export const mbText = localFont({ src: [{ path: "../../../node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2", weight: "300 900", style: "normal" }], variable: "--mb-text", display: "swap", fallback: ["Helvetica Neue", "Arial", "sans-serif"] });
export const mbAr = localFont({
  src: [
    { path: "../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../../node_modules/@fontsource/tajawal/files/tajawal-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--mb-ar",
  display: "swap",
  fallback: ["Tahoma", "sans-serif"],
});
