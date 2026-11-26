// The 2x2 photo grids generated for TIFAWT are cut into four separate files (in the Higgsfield
// sandbox) so each quarter loads on its own at the right size. This maps grid + quarter to a URL.

import type { GridCell } from "@/lib/showcase/tifawt";

const M = "https://d2ol7oe51mr4n9.cloudfront.net/";

export const CELLS: Record<string, string[]> = {
  // argan fruit, hands cracking nuts, oil pouring, the argan forest at dawn
  mosaicA: [
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/6651a4f0-4b42-40c1-86e9-e6a44df39034.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/456ad177-fcfa-49fd-83a2-6b360be83d3b.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/c673f2c9-1f19-457c-be9e-f1d6e0e549e7.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/21ee748a-bb42-4241-bf3a-1d3d3fb35b44.webp`,
  ],
  // damask roses, ghassoul in a carved bowl, prickly pear on sandstone, a riad courtyard
  mosaicB: [
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/76d29be3-11d5-41cd-b266-5cd824fee741.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/7ef67772-b868-4205-8b77-e4dfce9020a6.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/f4155ac9-7441-4419-94ad-795f3df721b4.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/a7db9e04-30e8-4be3-8706-2001a36f4e2b.webp`,
  ],
  // carved cedar and brass, glossy hair, a cream and oil swatch, a straw hat on a shaded roof
  mosaicC: [
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/4580a9fd-b004-4151-8ab5-937e997cb203.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/30b52dd9-5cea-436b-b420-70c836cee832.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/6e6549e9-126d-46b5-b572-3ae9d126954d.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/ec52aa8d-81f3-4757-8017-16005bc915ea.webp`,
  ],
  // golden oil, whipped cream, a sheer fluid on skin, a clear gel
  texA: [
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/3c84db58-f47b-48c5-9bcd-65ba479cb111.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/eb02864c-2845-454a-bfc8-c25f3f801d8a.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/63bc1f0c-e2f1-4556-aa51-991b6ba23915.webp`,
    `${M}user_3MQDgHvQJDdXT6IO2Dd583p7SEq/61c7c476-5d2c-449b-9f82-0315b25084d7.webp`,
  ],
  texB: [],
  procA: [],
  procB: [],
};

export const cellSrc = (c: GridCell) => CELLS[c.src]?.[c.cell] ?? "";
export const MEDIA_HOST = M;
