// ORIEL 88's type: Newsreader (an optical-size serif, light and tall for the tower's voice), IBM
// Plex Sans for text and figures, Noto Naskh Arabic for Arabic. Self-hosted, SIL Open Font License.
import localFont from "next/font/local";

export const orSerif = localFont({
  src: [
    { path: "../../../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2", weight: "200 800", style: "normal" },
    { path: "../../../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2", weight: "200 800", style: "italic" },
  ],
  variable: "--or-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
export const orSans = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2", weight: "100 700", style: "normal" }],
  variable: "--or-sans",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});
export const orArabic = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/noto-naskh-arabic/files/noto-naskh-arabic-arabic-wght-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--or-arabic",
  display: "swap",
  fallback: ["Geeza Pro", "Tahoma", "serif"],
});
