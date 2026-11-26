// MUSKANA's type: Gloock for headlines, Hanken Grotesk for text, Aref Ruqaa for Arabic headlines and
// Noto Naskh Arabic for Arabic text. Self-hosted, SIL Open Font License.
import localFont from "next/font/local";

export const muSerif = localFont({ src: [{ path: "../../../node_modules/@fontsource/gloock/files/gloock-latin-400-normal.woff2", weight: "400", style: "normal" }], variable: "--mu-serif", display: "swap", fallback: ["Georgia", "serif"] });
export const muText = localFont({ src: [{ path: "../../../node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2", weight: "100 900", style: "normal" }], variable: "--mu-text", display: "swap", fallback: ["Helvetica Neue", "Arial", "sans-serif"] });
export const muRuqaa = localFont({
  src: [
    { path: "../../../node_modules/@fontsource/aref-ruqaa/files/aref-ruqaa-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../../node_modules/@fontsource/aref-ruqaa/files/aref-ruqaa-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--mu-ruqaa",
  display: "swap",
  fallback: ["serif"],
});
export const muNaskh = localFont({ src: [{ path: "../../../node_modules/@fontsource-variable/noto-naskh-arabic/files/noto-naskh-arabic-arabic-wght-normal.woff2", weight: "400 700", style: "normal" }], variable: "--mu-naskh", display: "swap", fallback: ["Tahoma", "serif"] });
