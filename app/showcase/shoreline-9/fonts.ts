// SHORELINE NO. 9's type: Tenor Sans for headlines, Instrument Sans for text, El Messiri for Arabic.
// Self-hosted, SIL Open Font License.
import localFont from "next/font/local";

export const shHead = localFont({ src: [{ path: "../../../node_modules/@fontsource/tenor-sans/files/tenor-sans-latin-400-normal.woff2", weight: "400", style: "normal" }], variable: "--sh-head", display: "swap", fallback: ["Helvetica Neue", "Arial", "sans-serif"] });
export const shText = localFont({ src: [{ path: "../../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2", weight: "400 700", style: "normal" }], variable: "--sh-text", display: "swap", fallback: ["Helvetica Neue", "Arial", "sans-serif"] });
export const shAr = localFont({ src: [{ path: "../../../node_modules/@fontsource-variable/el-messiri/files/el-messiri-arabic-wght-normal.woff2", weight: "400 700", style: "normal" }], variable: "--sh-ar", display: "swap", fallback: ["Tahoma", "sans-serif"] });
