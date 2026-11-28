// One clock for the whole opening: the hero's walk through the house and the film after it share
// their chapters, their timecode and the progress line, so the hand-over between them is invisible.
// Times are in film units: one unit is UNIT screens of scrolling.

import { FILM, OPENING, WALK_CHAPTERS, WALK_LINES } from "@/lib/showcase/villa-eclat";

/** Screens of scrolling per unit, for the hero and the film alike. */
export const UNIT = 0.95;

/** Where each opening scene starts, in units from the top of the page. */
export const SCENE_AT = OPENING.reduce<number[]>((a, _s, i) => (a.push(i ? a[i - 1] + OPENING[i - 1].len : 0), a), []);
/** The hero's whole length; the drone shot comes first and the walk is everything after it. */
export const HERO_LEN = SCENE_AT[SCENE_AT.length - 1] + OPENING[OPENING.length - 1].len;
export const DRONE_LEN = OPENING[0].len;
export const WALK_LEN = HERO_LEN - DRONE_LEN;

export const FILM_AT = FILM.reduce<number[]>((a, _s, i) => (a.push(i ? a[i - 1] + FILM[i - 1].len : 0), a), []);
export const FILM_LEN = FILM_AT[FILM_AT.length - 1] + FILM[FILM.length - 1].len;

/** The clock runs from the start of the dive to the end of the film. */
export const TOTAL = WALK_LEN + FILM_LEN;
export const CHAPTERS: { name: string; at: number }[] = [
  ...WALK_CHAPTERS,
  ...FILM.flatMap((s, i) => (s.chapter ? [{ name: s.chapter, at: WALK_LEN + FILM_AT[i] }] : [])),
];
export const WALK_CAPS = WALK_LINES.map((l) => ({ a: l.at[0], b: l.at[1], text: l.text }));

export const chapterAt = (t: number) => {
  let name = "";
  for (const c of CHAPTERS) if (t >= c.at - 0.001) name = c.name;
  return name;
};
export const timecode = (t: number) => {
  const sec = Math.max(0, t) * 2.6, f = Math.floor((sec % 1) * 24), s = Math.floor(sec) % 60, m = Math.floor(sec / 60);
  return `00:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

// Where the two sections sit on the page, kept up to date by each as it measures itself.
const at = { heroTop: 0, heroSpan: 1, filmTop: 0 };
export const placeHero = (top: number, span: number) => { at.heroTop = top; at.heroSpan = span; };
export const placeFilm = (top: number) => { at.filmTop = top; };

/** Scrolls the page to a moment `t` of the clock (the walk, then the film). */
export function goTo(t: number) {
  const top = t < WALK_LEN
    ? at.heroTop + ((DRONE_LEN + t) / HERO_LEN) * at.heroSpan
    : at.filmTop + (t - WALK_LEN) * innerHeight * UNIT;
  window.scrollTo({ top: Math.round(top) + 2, behavior: "auto" });
}
