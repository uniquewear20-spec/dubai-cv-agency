// Halo Ridge has its own type, separate from Zenith's: Marcellus (carved, architectural capitals)
// for headlines and Manrope for everything else. Both self-hosted under the SIL Open Font License.
import localFont from "next/font/local";

export const hrDisplay = localFont({
  src: [{ path: "../../../node_modules/@fontsource/marcellus/files/marcellus-latin-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--hr-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const hrText = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2", weight: "200 800", style: "normal" }],
  variable: "--hr-text",
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});
