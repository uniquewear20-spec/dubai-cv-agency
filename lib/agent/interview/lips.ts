// lib/agent/interview/lips.ts — browser and server. Mouth shapes for the animated interviewer,
// read from the letters being spoken (a simple viseme map for English, French and Arabic).

export interface MouthShape {
  /** 0 closed … 1 wide open. */
  open: number;
  /** Mouth width, 1 = rest. */
  wide: number;
  /** Lip rounding, 0 … 1. */
  round: number;
  /** How much of the upper teeth shows, 0 … 1. */
  teeth: number;
}

const S = (open: number, wide: number, round: number, teeth: number): MouthShape => ({ open, wide, round, teeth });

export const REST = S(0.03, 1, 0, 0);
const CLOSED = S(0, 0.94, 0.05, 0);
const FV = S(0.1, 0.98, 0, 1);
const A = S(0.8, 1.03, 0, 0.45);
const E = S(0.42, 1.14, 0, 0.75);
const I = S(0.28, 1.18, 0, 0.85);
const O = S(0.6, 0.8, 0.68, 0.2);
const U = S(0.3, 0.64, 0.95, 0);
const CONS = S(0.24, 1, 0, 0.55);
const SOFT = S(0.36, 1.04, 0, 0.5);

const MAP: Record<string, MouthShape> = {
  m: CLOSED, b: CLOSED, p: CLOSED, f: FV, v: FV,
  a: A, e: E, i: I, y: I, o: O, u: U, w: U, q: U,
  // Arabic
  "ا": A, "أ": A, "إ": A, "آ": A, "ى": A, "ع": A, "و": U, "ؤ": U, "ي": I, "ئ": I,
  "م": CLOSED, "ب": CLOSED, "ف": FV, "ه": SOFT, "ح": SOFT, "خ": SOFT, "ء": SOFT, "ة": SOFT,
};

/** The mouth shape for the character at `index` (rest between words). */
export function shapeAt(text: string, index: number): MouthShape {
  if (index < 0 || index >= text.length) return REST;
  const raw = text[index];
  const ch = raw.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (/\s|[.,;:!?،؛؟…"«»“”()\-–—]/u.test(ch)) return REST;
  return MAP[ch] ?? (/[\p{L}\p{N}]/u.test(ch) ? CONS : REST);
}

/** Moves `cur` toward `target` by `k` (0 … 1), in place. */
export function ease(cur: MouthShape, target: MouthShape, k: number): MouthShape {
  cur.open += (target.open - cur.open) * k;
  cur.wide += (target.wide - cur.wide) * k;
  cur.round += (target.round - cur.round) * k;
  cur.teeth += (target.teeth - cur.teeth) * k;
  return cur;
}
