// VILLA ÉCLAT's type: Poiret One, a thin geometric Art Deco face from the 1920s poster tradition,
// for every word on the site. The wordmark itself is drawn in triple gold lines (Hero.tsx).
// Self-hosted, SIL Open Font License.
import localFont from "next/font/local";

export const veDeco = localFont({
  src: [{ path: "../../../node_modules/@fontsource/poiret-one/files/poiret-one-latin-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--ve-deco",
  display: "swap",
  fallback: ["Futura", "Century Gothic", "sans-serif"],
});
