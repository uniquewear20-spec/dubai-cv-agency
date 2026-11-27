// ALBORA's type: Oranienbaum, a condensed high-contrast didone for the giant headlines; Pinyon
// Script for the handwritten words laid over them; Josefin Sans, geometric and airy, for text;
// Noto Naskh Arabic for Arabic. Self-hosted, SIL Open Font License.
import localFont from "next/font/local";

export const alDisplay = localFont({
  src: [{ path: "../../../node_modules/@fontsource/oranienbaum/files/oranienbaum-latin-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--al-oran",
  display: "swap",
  fallback: ["Didot", "serif"],
});
export const alScript = localFont({
  src: [{ path: "../../../node_modules/@fontsource/pinyon-script/files/pinyon-script-latin-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--al-pinyon",
  display: "swap",
  fallback: ["Snell Roundhand", "cursive"],
});
export const alSans = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/josefin-sans/files/josefin-sans-latin-wght-normal.woff2", weight: "100 700", style: "normal" }],
  variable: "--al-josefin",
  display: "swap",
  fallback: ["Futura", "Century Gothic", "sans-serif"],
});
export const alArabic = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/noto-naskh-arabic/files/noto-naskh-arabic-arabic-wght-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--al-naskh",
  display: "swap",
  fallback: ["Geeza Pro", "Tahoma", "serif"],
});
