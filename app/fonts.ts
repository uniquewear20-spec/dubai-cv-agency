// app/fonts.ts — self-hosted fonts (SIL Open Font License), served by next/font from our own domain.
// Newsreader: display serif. IBM Plex Sans: text and interface.
// IBM Plex Sans Arabic and Noto Naskh Arabic: Arabic text and headings, loaded only when Arabic is shown.
import localFont from "next/font/local";

export const serif = localFont({
  src: [{ path: "../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const sans = localFont({
  src: [{ path: "../node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2", weight: "100 700", style: "normal" }],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

export const arabic = localFont({
  src: [
    { path: "../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

export const arabicSerif = localFont({
  src: [{ path: "../node_modules/@fontsource-variable/noto-naskh-arabic/files/noto-naskh-arabic-arabic-wght-normal.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-arabic-serif",
  display: "swap",
  preload: false,
  fallback: ["Tahoma", "serif"],
});

export const fontVariables = [serif.variable, sans.variable, arabic.variable, arabicSerif.variable].join(" ");
