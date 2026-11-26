// ZILL's own type: Archivo, a grotesque with a width axis, set wide for headlines (the stretched
// letters of a drawing's title block) and at normal width for text; Noto Kufi Arabic for Arabic.
// Both self-hosted, SIL Open Font License.
import localFont from "next/font/local";

export const zlLatin = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--zl-latin",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const zlArabic = localFont({
  src: [{ path: "../../../node_modules/@fontsource-variable/noto-kufi-arabic/files/noto-kufi-arabic-arabic-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--zl-arabic",
  display: "swap",
  fallback: ["Geeza Pro", "Tahoma", "sans-serif"],
});
