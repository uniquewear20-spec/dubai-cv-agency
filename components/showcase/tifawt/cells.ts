// The 2x2 photo grids generated for TIFAWT are cut into four separate files (in the Higgsfield
// sandbox) so each quarter loads on its own at the right size. This maps grid + quarter to a URL.

import type { GridCell } from "@/lib/showcase/tifawt";

const M = "https://d2ol7oe51mr4n9.cloudfront.net/";

export const CELLS: Record<string, string[]> = {
  mosaicA: [],
  mosaicB: [],
  mosaicC: [],
  texA: [],
  texB: [],
  procA: [],
  procB: [],
};

export const cellSrc = (c: GridCell) => CELLS[c.src]?.[c.cell] ?? "";
export const MEDIA_HOST = M;
