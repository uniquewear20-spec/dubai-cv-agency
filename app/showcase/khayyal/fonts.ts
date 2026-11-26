// KHAYYAL's type: Unbounded (wide and engineered) for headlines, Manrope for text, IBM Plex Sans
// Arabic for Arabic. Self-hosted, SIL Open Font License.
import localFont from "next/font/local";

export const khDisplay = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/unbounded/files/unbounded-latin-wght-normal.woff2", weight: "200 900", style: "normal" }],
  variable: "--kh-display",
  display: "swap",
  fallback: ["Arial Black", "sans-serif"],
});
export const khText = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2", weight: "200 800", style: "normal" }],
  variable: "--kh-text",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});
export const khArabic = localFont({
  src: [
    { path: "../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--kh-arabic",
  display: "swap",
  fallback: ["Tahoma", "sans-serif"],
});
