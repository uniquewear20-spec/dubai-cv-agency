// TIFAWT's own type, separate from Zenith's: Italiana (a hairline display with high contrast, for
// product names and headlines), Alexandria (one geometric family for Latin and Arabic text) and
// Noto Sans Tifinagh for the brand name in Tamazight. All self-hosted, SIL Open Font License.
import localFont from "next/font/local";

export const tfDisplay = localFont({
  src: [{ path: "../../../node_modules/@fontsource/italiana/files/italiana-latin-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--tf-display",
  display: "swap",
  fallback: ["Didot", "Georgia", "serif"],
});

export const tfText = localFont({
  src: [
    { path: "../../../node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../../../node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--tf-text",
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

export const tfTifinagh = localFont({
  src: [{ path: "../../../node_modules/@fontsource/noto-sans-tifinagh/files/noto-sans-tifinagh-tifinagh-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--tf-tifinagh",
  display: "swap",
  fallback: ["sans-serif"],
});
