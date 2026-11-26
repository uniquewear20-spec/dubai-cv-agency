// MAWQID's own type: Big Shoulders Display (a condensed industrial grotesque, for the warehouse and
// the heat numbers), Readex Pro for text in both scripts, Reem Kufi for Arabic headlines and IBM Plex
// Mono for the kitchen ticket. All self-hosted, SIL Open Font License.
import localFont from "next/font/local";

export const mqDisplay = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/big-shoulders-display/files/big-shoulders-display-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--mq-display",
  display: "swap",
  fallback: ["Arial Narrow", "sans-serif"],
});

export const mqText = localFont({
  src: [
    { path: "../../../node_modules/@fontsource-variable/readex-pro/files/readex-pro-latin-wght-normal.woff2", weight: "160 700", style: "normal" },
    { path: "../../../node_modules/@fontsource-variable/readex-pro/files/readex-pro-arabic-wght-normal.woff2", weight: "160 700", style: "normal" },
  ],
  variable: "--mq-text",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const mqArDisplay = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/reem-kufi/files/reem-kufi-arabic-wght-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--mq-ar-display",
  display: "swap",
  fallback: ["sans-serif"],
});

export const mqMono = localFont({
  src: [
    { path: "../../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--mq-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});
