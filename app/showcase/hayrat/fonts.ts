// HAYRAT's own type: Instrument Serif (a fine, condensed display serif) with Amiri for Arabic
// headlines, Hanken Grotesk for Latin text and IBM Plex Sans Arabic for Arabic text.
// All self-hosted, SIL Open Font License.
import localFont from "next/font/local";

export const hyDisplay = localFont({
  src: [
    { path: "../../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--hy-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const hyText = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--hy-text",
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

export const hyArDisplay = localFont({
  src: [
    { path: "../../../node_modules/@fontsource/amiri/files/amiri-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../../node_modules/@fontsource/amiri/files/amiri-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--hy-ar-display",
  display: "swap",
  fallback: ["serif"],
});

export const hyArText = localFont({
  src: [
    { path: "../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--hy-ar-text",
  display: "swap",
  fallback: ["sans-serif"],
});
