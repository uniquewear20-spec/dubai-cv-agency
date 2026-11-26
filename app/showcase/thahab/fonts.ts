// THAHAB's type: Young Serif for headlines, Work Sans for text, Lalezar for Arabic headlines and Noto
// Sans Arabic for Arabic text. Self-hosted, SIL Open Font License.
import localFont from "next/font/local";

export const thHead = localFont({ src: [{ path: "../../../node_modules/@fontsource/young-serif/files/young-serif-latin-400-normal.woff2", weight: "400", style: "normal" }], variable: "--th-head", display: "swap", fallback: ["Georgia", "serif"] });
export const thText = localFont({ src: [{ path: "../../../node_modules/@fontsource-variable/work-sans/files/work-sans-latin-wght-normal.woff2", weight: "100 900", style: "normal" }], variable: "--th-text", display: "swap", fallback: ["Helvetica Neue", "Arial", "sans-serif"] });
export const thLalezar = localFont({ src: [{ path: "../../../node_modules/@fontsource/lalezar/files/lalezar-arabic-400-normal.woff2", weight: "400", style: "normal" }], variable: "--th-lalezar", display: "swap", fallback: ["Tahoma", "sans-serif"] });
export const thAr = localFont({ src: [{ path: "../../../node_modules/@fontsource-variable/noto-sans-arabic/files/noto-sans-arabic-arabic-wght-normal.woff2", weight: "100 900", style: "normal" }], variable: "--th-ar", display: "swap", fallback: ["Tahoma", "sans-serif"] });
