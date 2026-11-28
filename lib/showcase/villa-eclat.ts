// VILLA ÉCLAT: a fictional beachfront villa on the Dubai coast, built by Zenith Dubai as a concept
// website. Nothing here is a real property, listing, price or client. The pictures are generated
// (prompts in image-prompts/VILLA-ECLAT.md); a key left empty shows a quiet placeholder.

export type ImgKey =
  | "day" | "night" | "approach" | "door" | "hall" | "up" | "living" | "golden" | "dining" | "kitchen"
  | "kitchenEnd" | "kitchenEndTall"
  | "bar" | "bar2" | "suite" | "bath" | "spa" | "poolDay" | "poolDusk" | "roof" | "aerial" | "cinema"
  | "brass" | "oak" | "marble" | "pull" | "guest" | "library" | "gym" | "wine";

/** Higgsfield stills. Grid cells are written "crop:<url>#W,H,x,y,w,h" (one cell of a 2x2 grid). */
export const IMG: Record<ImgKey, string> = {
  day: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_141600_73d0920d-47ee-4d84-9bc3-cef72e01efe2.png",
  night: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_152619_13467498-628f-4e2c-8309-cb809df8124e.png",
  approach: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_142250_7fedd1bc-e4db-47b0-be37-9f6998c784ee.png",
  door: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_142309_16ddccfc-6772-48bd-b21c-e41be34f52a1.png",
  hall: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_142922_3274a0e2-af39-4965-b7f0-59821a1f2cfc.png",
  up: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_142944_ddd5cbdd-8322-4853-adde-7574e4673f14.png",
  living: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_143636_2556c607-e0b5-4078-aa46-4f9a3c189c5c.png",
  golden: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_152625_a9e94580-f064-407b-833a-9f78a60c3ddc.png",
  dining: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_143650_5f91da9b-e88f-4642-ae0c-3f72d39e2ced.png",
  kitchen: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_144305_bfb5eb5d-2506-4d5f-9986-b3c04e7ee3ec.png",
  // The kitchen walk's last frame, exactly as the opening leaves it, so the film picks up on it.
  kitchenEnd: "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/4aaa33cf-5e74-4cbf-84ec-b5de495b00e5.jpg",
  kitchenEndTall: "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/f5f69b66-bb85-4489-b985-4a9d4b1ef7e1.jpg",
  bar: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_145001_50a83ab7-38d1-4c7b-957f-55f2776f5af4.png",
  bar2: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_145138_27a79bbf-620d-43b1-86ce-7c5419dec0c8.png",
  suite: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_154703_7fef0b9f-b902-4b56-918b-85602391ba4b.png",
  bath: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_145626_b6423671-b2fd-43ab-bae8-eb409165e07b.png",
  spa: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_145803_b0ce6ca4-deef-4869-85f0-d7b6ae742aad.png",
  poolDay: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_150253_454651ae-fa42-484f-a965-98c4af2e7775.png",
  poolDusk: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_152629_620e4182-de3d-41ef-b3f6-0728dfaf6b0e.png",
  roof: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_150836_6364f1bf-2e08-4643-bbb5-b66d21516073.png",
  aerial: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_150913_b9ee2fc8-77a4-4d43-a449-407100944248.png",
  cinema: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_151455_bd985c1f-f5f1-4b90-9c77-bbbe945916d7.png",
  brass: "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_151608_2af8a55d-3647-487d-98cd-54059099add8.png#2048,2048,26,26,983,983",
  oak: "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_151608_2af8a55d-3647-487d-98cd-54059099add8.png#2048,2048,1039,26,983,983",
  marble: "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_151608_2af8a55d-3647-487d-98cd-54059099add8.png#2048,2048,26,1038,984,984",
  pull: "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_151608_2af8a55d-3647-487d-98cd-54059099add8.png#2048,2048,1039,1038,983,984",
  guest: "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_152231_d9bf25f0-8a0b-4077-a62f-ccf8e9ea8d40.png#2720,1536,4,4,1340,750",
  library: "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_152231_d9bf25f0-8a0b-4077-a62f-ccf8e9ea8d40.png#2720,1536,1377,4,1339,750",
  gym: "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_152231_d9bf25f0-8a0b-4077-a62f-ccf8e9ea8d40.png#2720,1536,4,783,1340,749",
  wine: "crop:https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_152231_d9bf25f0-8a0b-4077-a62f-ccf8e9ea8d40.png#2720,1536,1377,783,1339,749",
};

const UP = "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/";
const webp = (ids: string[]) => ids.map((id) => `${UP}${id}.webp`);
/**
 * A shot stored as frame sheets: `n` frames of fw x fh px, laid out cols x rows per sheet. `proxy`:
 * every second frame, small and soft, all in one sheet that loads first; it stands in for any frame
 * not yet loaded and gives the zoom blur its soft layers.
 */
export type Seq = { sheets: string[]; cols: number; rows: number; n: number; fw: number; fh: number; proxy?: { url: string; cols: number; fw: number; fh: number } };
const pxWide = (id: string) => ({ url: `${UP}${id}.webp`, cols: 6, fw: 384, fh: 216 });
const pxTall = (id: string) => ({ url: `${UP}${id}.webp`, cols: 8, fw: 152, fh: 270 });
/**
 * One real camera move (a Kling clip) as frame sheets for wide and for tall screens.
 * `warp`: where each frame falls along the move's share of the scroll (0 to 1), measured from the
 * clip's optical flow, so the camera keeps an even pace instead of lurching with the clip's own
 * accelerations, and its speed carries straight across the join into the next room.
 * `track`: on screens narrower than the frame, where to look (frame index, share of the width).
 */
export type Clip = { desk: Seq; phone: Seq; warp?: number[]; track?: [number, number][] };

export const HERO = {
  /**
   * The drone climb as frames drawn on a canvas, the way Son Daven draws theirs: every third
   * frame of the 1080p clip at full size (41 frames, 7 sheets of 6), and on phones every sixth
   * frame as a sharp portrait crop (21 frames, 3 sheets of 8).
   */
  seq: {
    desk: {
      sheets: webp(["9d8518ce-0976-40e3-b977-83cb7b748db1", "05e67805-4d76-4dbc-bc8d-82523ba13284", "9e277294-d9ac-42ac-8172-acde2b7af727", "982f7c12-f261-46a2-b7fd-3463e73f0d22", "d50d334b-cb9b-4738-a192-d7664fd63bdd", "c78e86b8-1551-47e5-9aec-019ffe9114f0", "b772b391-3c2d-4889-bced-d36d636a1674"]),
      cols: 2, rows: 3, n: 41, fw: 1916, fh: 1080, proxy: pxWide("be90ec67-0246-4d4a-aa85-dd8f9a1db4ef"),
    } satisfies Seq,
    phone: {
      sheets: webp(["18e9ad72-0256-4b22-8c02-2276998c883e", "48c4fc01-6b14-4ffe-bf6c-7a4354905b91", "242c60aa-db2d-40d7-86cc-d749f17106de"]),
      cols: 4, rows: 2, n: 21, fw: 608, fh: 1080, proxy: pxTall("eed74d22-ab49-4f36-95c4-de8a57f46f44"),
    } satisfies Seq,
  },
};

// ── The walk: the drone's camera carries on into the house without a cut ─────────────────────────
// Every second frame of each 5-second clip (61 frames; the slow kitchen drift every fourth), 1600 px
// wide in sheets of 3 x 3, and for phones the same frames as 608 x 1080 portrait crops in sheets of 4 x 2.
const wide = (ids: string[], n: number, proxy: string): Seq => ({ sheets: webp(ids), cols: 3, rows: 3, n, fw: 1600, fh: 900, proxy: pxWide(proxy) });
const tall = (ids: string[], n: number, proxy: string): Seq => ({ sheets: webp(ids), cols: 4, rows: 2, n, fw: 608, fh: 1080, proxy: pxTall(proxy) });
export const CLIPS = {
  door: {
    desk: wide(["b4157272-b128-423e-b36d-af118625091a", "2492addf-9713-4a9e-8758-2392ac7a18f1", "7c6a18f9-a2d3-4047-bbb2-c63942c94cf9", "8d7d0ff7-add8-4f00-bd56-116b84e5563d", "ec0dd00a-2739-4fc4-9b29-60579f1ecf24", "47b5932d-799e-44cd-90e7-c542e8356dd7", "d4d7161c-567e-4651-ad27-d0573aec313c"], 61, "0b5a9643-bc2c-4e71-886f-53485dc06628"),
    phone: tall(["ee2894de-9484-4a82-ba2e-48c29e3d92ac", "28f088f5-f424-463f-92c6-2efd08e2ae33", "68707c13-e61e-4191-b00e-800105da788f", "2808292c-6124-4af6-9119-d5eb7831e966", "fea10ec3-7c1b-4914-93f1-acf0fe8c3abf", "6d33a9e9-3e24-414a-9180-268cea323910", "d37de7e3-850b-4b7e-89b9-321081905fc0", "9901045f-e8e2-4bba-a30c-e00c4596b006"], 61, "40f486b7-ff1e-40f5-9579-23f32ed01510"),
    warp: [0, 0.004, 0.008, 0.016, 0.029, 0.043, 0.059, 0.075, 0.093, 0.111, 0.13, 0.148, 0.165, 0.18, 0.194, 0.208, 0.223, 0.238, 0.257, 0.277, 0.299, 0.323, 0.346, 0.368, 0.391, 0.412, 0.431, 0.449, 0.466, 0.48, 0.497, 0.514, 0.532, 0.55, 0.567, 0.585, 0.605, 0.623, 0.64, 0.658, 0.676, 0.695, 0.715, 0.736, 0.757, 0.776, 0.792, 0.807, 0.823, 0.839, 0.855, 0.87, 0.886, 0.903, 0.92, 0.937, 0.954, 0.969, 0.982, 0.992, 1],
  },
  hs: {
    desk: wide(["a4268352-bd7d-47c0-a2a1-fc3a7f74c381", "2c8db5aa-8f0f-4905-af03-3425e483f78a", "b48d71a2-1a59-484e-a62b-0301b7a17fe2", "95986f33-a9f9-4a76-81f4-8399f3fa246e", "2d4b5258-7db2-456c-9740-b37d7eda64cc", "f0916117-56c6-4505-b1f4-2d9103a906e9", "a08ffbb6-c858-4789-bbce-5cf46eeb1fb2"], 61, "fe271846-089b-4cb7-b87a-a9b074aa5a73"),
    phone: tall(["1e12d0ce-2b18-4fb7-9bed-5e3cf401034c", "5ef7cd91-ec93-4a5b-bbb7-1e8ac07a0530", "9fbbe9e4-0070-4cbe-bd50-0288b9f6eb1f", "c3b174db-51ce-4911-afd5-a15182eec64d", "0834d518-aca7-460b-97c9-611ec09f6f53", "60811ff2-7e2f-4bfc-be5d-a6fb81a3646e", "db2655fc-e889-4bc1-a8ad-fc1437249b53", "6ff4b4b9-3aa2-43ec-a454-a0b4161670e0"], 61, "c0229fb3-b978-4332-afd9-bc0bf572894a"),
    warp: [0, 0.009, 0.021, 0.035, 0.051, 0.067, 0.085, 0.101, 0.117, 0.133, 0.15, 0.166, 0.183, 0.199, 0.215, 0.231, 0.248, 0.265, 0.281, 0.298, 0.316, 0.332, 0.349, 0.366, 0.383, 0.4, 0.42, 0.441, 0.462, 0.484, 0.503, 0.52, 0.537, 0.555, 0.571, 0.583, 0.593, 0.602, 0.611, 0.622, 0.64, 0.659, 0.68, 0.7, 0.722, 0.744, 0.764, 0.782, 0.799, 0.815, 0.828, 0.843, 0.859, 0.876, 0.894, 0.912, 0.931, 0.948, 0.966, 0.984, 1],
    // Under the stair the camera turns right into the salon; a tall screen follows the arch.
    track: [[0, 0.5], [18, 0.5], [20, 0.56], [24, 0.66], [28, 0.76], [30, 0.8], [34, 0.8], [36, 0.76], [38, 0.66], [40, 0.58], [42, 0.52], [44, 0.5], [60, 0.5]],
  },
  sd: {
    desk: wide(["9f3ef9e8-e2a6-4555-9a90-492b4b0f2226", "99b20e69-11ad-41ab-bae6-40adb98da12d", "3e7a6d20-2108-4e22-bc98-0597fa853a56", "8217952a-ccc5-46b6-875c-da624b7edde3", "e5f169f1-cbdc-45f6-824e-493baf853974", "c1f5751e-a880-4e49-a809-50115877449b", "d02a8408-7db2-40f4-bdd7-0e550c7c4eb7"], 61, "1991fffe-dd6f-431b-ad72-8ff3d65b3a84"),
    phone: tall(["edebf2d9-c80a-423a-8025-408f333d9bc6", "de15fcd1-b18c-4eab-9d18-1ee41464461b", "8fe6c4ce-a0a1-4502-be12-76c41bacd2c1", "7c75f1fc-29d2-4757-ac69-998be78e27d3", "05bb7c49-6cd3-4476-a3f4-a384a7bfbb42", "3dfeefad-29b2-4b26-8120-9f1973e8e41e", "00377519-049a-4ecc-b5b3-7a0761da8f45", "599c3f71-cc9b-4e45-a234-0f932ac0f18d"], 61, "04bde03a-9ecc-47b4-b401-fb76278d7a92"),
    warp: [0, 0.004, 0.01, 0.018, 0.029, 0.042, 0.057, 0.074, 0.092, 0.112, 0.131, 0.15, 0.17, 0.188, 0.208, 0.228, 0.248, 0.268, 0.288, 0.306, 0.325, 0.345, 0.364, 0.384, 0.403, 0.421, 0.439, 0.459, 0.48, 0.5, 0.518, 0.537, 0.557, 0.578, 0.598, 0.619, 0.642, 0.664, 0.689, 0.712, 0.735, 0.755, 0.773, 0.791, 0.816, 0.835, 0.852, 0.867, 0.881, 0.896, 0.911, 0.926, 0.941, 0.955, 0.966, 0.975, 0.982, 0.988, 0.992, 0.996, 1],
  },
  kit: {
    desk: wide(["1f33e745-94de-43a7-b292-723d38695e3c", "b6c22c4d-3603-4540-8331-3a62249003e7", "a0d2720c-7092-4a17-87f8-94a396773bbc", "1e313e05-354d-4309-9e5c-d2f43cbb1cc5"], 31, "b08b19b9-3b8d-4bfa-9855-0fd68262b0be"),
    phone: tall(["09c08f18-e113-42c3-87e4-af9db035e1de", "c6b051de-e758-4094-9044-ca13682a8855", "fbeb9612-68ee-41d2-b710-e086d4842815", "ff1664e5-ab25-4bc4-bae2-6fb10fa0c89f"], 31, "316d8578-1991-4ed7-ad6e-046a08ab7480"),
    warp: [0, 0.015, 0.041, 0.06, 0.087, 0.115, 0.146, 0.179, 0.213, 0.25, 0.285, 0.322, 0.357, 0.395, 0.432, 0.467, 0.502, 0.538, 0.573, 0.607, 0.643, 0.677, 0.714, 0.75, 0.786, 0.823, 0.859, 0.894, 0.929, 0.963, 1],
  },
} satisfies Record<string, Clip>;
export type ClipKey = keyof typeof CLIPS;

/**
 * The opening, in film units (one unit = 0.95 of a screen of scrolling, as in the film). The drone
 * circles the house; the camera dives through the colonnade to the bronze door, goes through it into
 * the hall, looks up, passes under the stair into the salon, through the bronze arch to the dining
 * room, and on through its far arch into the kitchen, where the film below takes over.
 * A push carries the camera through an opening: `at` is where it aims in the last frame (wide and
 * tall), `into` where it lands in the first frame of the next room.
 */
export type Scene =
  | { id: string; kind: "drone"; len: number }
  | { id: string; kind: "clip"; clip: ClipKey; len: number }
  | { id: string; kind: "look"; clip: ClipKey; len: number }
  | { id: string; kind: "push"; from: ClipKey | "drone"; to: ClipKey; len: number; at: { desk: [number, number]; phone: [number, number] }; into: [number, number] };
export const OPENING: Scene[] = [
  { id: "drone", kind: "drone", len: 2.4 },
  { id: "dive", kind: "push", from: "drone", to: "door", len: 0.8, at: { desk: [0.42, 0.79], phone: [0.53, 0.79] }, into: [0.5, 0.52] },
  { id: "door", kind: "clip", clip: "door", len: 1.6 },
  { id: "look", kind: "look", clip: "hs", len: 0.45 },
  { id: "hs", kind: "clip", clip: "hs", len: 1.85 },
  { id: "sd", kind: "clip", clip: "sd", len: 1.6 },
  { id: "through", kind: "push", from: "sd", to: "kit", len: 0.6, at: { desk: [0.29, 0.5], phone: [0.3, 0.5] }, into: [0.38, 0.5] },
  { id: "kit", kind: "clip", clip: "kit", len: 1.2 },
];
/** Chapters and captions of the walk, timed from the start of the dive (film units). */
export const WALK_CHAPTERS: { name: string; at: number }[] = [
  { name: "Arrival", at: 0 },
  { name: "The hall", at: 2.15 },
  { name: "The salon", at: 4.05 },
  { name: "Dining", at: 5.75 },
  { name: "Kitchen", at: 6.9 },
];
export const WALK_LINES: Line[] = [
  { at: [0.05, 0.95], text: "Through the colonnade, to a bronze door five metres tall." },
  { at: [1.1, 1.95], text: "It turns on a single pivot, and stands open all day." },
  { at: [2.2, 3.2], text: "A staircase that turns once, under a rain of glass." },
  { at: [4.1, 5.05], text: "Two steps down, so the sea sits at eye level from the sofas." },
  { at: [5.8, 6.5], text: "A table for fourteen, under four hundred glass rods." },
  { at: [6.95, 7.95], text: "Green marble, a brass edge, and the sea at the sink." },
];

// ── The film: one camera walking through the house, driven by scroll ───────────────────────────
export type Cam = { s?: number; x?: number; y?: number; r?: number }; // zoom, pan (share of view), roll (deg)
export type Out = "cut" | "zoom" | "whip" | "whipUp" | "whipDown" | "fade" | "white" | "glow";
export type Line = { at: [number, number]; text: string };
export interface Shot {
  id: string;
  img: ImgKey;
  /** A second picture of the same view, crossfaded in over `mix` (share of the shot). */
  img2?: ImgKey;
  mix?: [number, number];
  focus?: [number, number];
  from: Cam;
  to: Cam;
  out?: Out;
  /** The shot arrives in a rounded frame on ivory that grows to full screen. */
  framed?: boolean;
  /** A real camera move: a short video scrubbed by scroll instead of a still. */
  clip?: { src: string; dur: number };
  /** Film-strip shot: these pictures pass as frames of film; the last one hands over to the next shot. */
  strip?: ImgKey[];
  len: number;
  chapter?: string;
  lines?: Line[];
  /** Sun flare: start and end position (share of the screen, from top left) and strength. */
  flare?: { from: [number, number]; to: [number, number]; k: number; with?: "mix" };
}

const CLIP = {
  spa: "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/7cb3e38c-a75b-4b92-8fe8-fe9fff0103bb.mp4",
};

// The film starts where the opening's walk leaves off: on the kitchen's last frame, which it holds
// for a breath before the first dissolve. Its chapters and timecode continue the opening's.
export const FILM: Shot[] = [
  { id: "kitchenEnd", img: "kitchenEnd", focus: [0.5, 0.5], from: { s: 1 }, to: { s: 1.03 }, out: "fade", len: 0.5 },
  { id: "bar", img: "bar", focus: [0.5, 0.5], from: { s: 1.18 }, to: { s: 1.03 }, out: "white", len: 1.05, chapter: "After dark",
    lines: [{ at: [0.1, 0.66], text: "Black lacquer, brass and mirror, for the late hours." }] },
  { id: "suite", img: "suite", focus: [0.5, 0.52], framed: true, from: { s: 1.14 }, to: { s: 1.02 }, out: "whip", len: 1.25, chapter: "The suites",
    lines: [{ at: [0.42, 0.8], text: "The principal suite opens onto its own terrace above the sea." }] },
  { id: "bath", img: "bath", focus: [0.5, 0.5], from: { s: 1.02, y: 0.02 }, to: { s: 1.12, y: -0.02 }, out: "fade", len: 1,
    lines: [{ at: [0.1, 0.66], text: "A bath carved from one block of travertine." }] },
  { id: "spa", img: "spa", clip: { src: CLIP.spa, dur: 5.04 }, focus: [0.5, 0.5], from: { s: 1 }, to: { s: 1.14 }, out: "fade", len: 1.3, chapter: "Spa",
    lines: [{ at: [0.1, 0.8], text: "Below ground, a vaulted pool lit by round skylights." }] },
  { id: "golden", img: "living", img2: "golden", mix: [0.12, 0.55], focus: [0.5, 0.55], from: { s: 1.02, x: -0.03 }, to: { s: 1.1, x: 0.03 }, out: "fade", len: 1.3, chapter: "Five o'clock",
    flare: { from: [0.86, 0.3], to: [0.78, 0.26], k: 0.8, with: "mix" },
    lines: [{ at: [0.3, 0.9], text: "At five o'clock the sun walks across the salon." }] },
  { id: "cinema", img: "cinema", focus: [0.5, 0.42], from: { s: 1 }, to: { s: 1.5 }, out: "glow", len: 1, chapter: "The screen",
    lines: [{ at: [0.08, 0.5], text: "Eight velvet seats, and tonight's programme." }] },
  { id: "reel", img: "aerial", strip: ["aerial", "roof", "poolDay"], from: { s: 1 }, to: { s: 1 }, out: "cut", len: 1.9, chapter: "The views",
    lines: [{ at: [0.12, 0.85], text: "The house from the air, from the roof, from the water's edge." }] },
  { id: "pool", img: "poolDay", img2: "poolDusk", mix: [0.3, 0.72], focus: [0.5, 0.5], from: { s: 1 }, to: { s: 1.12, x: 0.03 }, out: "fade", len: 1.3, chapter: "Evening",
    lines: [{ at: [0.08, 0.5], text: "The terrace, from noon until the lanterns." }] },
  { id: "finale", img: "day", img2: "night", mix: [0.22, 0.66], focus: [0.5, 0.55], from: { s: 1.08 }, to: { s: 1.0 }, out: "cut", len: 1.4,
    lines: [{ at: [0.7, 1.01], text: "Shown by private appointment." }] },
];

// ── The residence, in figures (a fictional villa) ──────────────────────────────────────────────
export const FIGURES: { n: string; unit?: string; label: string }[] = [
  { n: "2,150", unit: "m²", label: "built across four levels" },
  { n: "3,400", unit: "m²", label: "of private beachfront plot" },
  { n: "80", unit: "m", label: "of sand to the water" },
  { n: "6", label: "suites, each with a terrace" },
  { n: "25", unit: "m", label: "infinity pool along the beach" },
  { n: "8", label: "seats in the private cinema" },
];

// ── Floor plans: each room is a rounded rectangle on a 1000 × 640 drawing ──────────────────────
export type Room = { id: string; name: string; m2: number; box: [number, number, number, number, number]; img?: ImgKey; note: string };
export const LEVELS: { id: string; name: string; rooms: Room[] }[] = [
  { id: "lower", name: "Lower ground", rooms: [
    { id: "spa", name: "Spa pool", m2: 210, box: [70, 90, 520, 200, 90], img: "spa", note: "A 20 m pool under a plaster vault, lit by six round skylights." },
    { id: "hammam", name: "Hammam", m2: 38, box: [620, 90, 150, 200, 70], note: "Steam, a heated marble bench and a cold plunge." },
    { id: "gym", name: "Gym", m2: 72, box: [800, 90, 130, 200, 18], img: "gym", note: "A wall of glass onto the sunken garden." },
    { id: "cinema", name: "Cinema", m2: 64, box: [70, 330, 300, 220, 18], img: "cinema", note: "Eight reclining velvet seats." },
    { id: "wine", name: "Wine room", m2: 26, box: [400, 330, 170, 220, 18], img: "wine", note: "Glass walls and bronze racks." },
    { id: "service", name: "Service and staff", m2: 140, box: [600, 330, 330, 220, 18], note: "Staff quarters, laundry and plant." },
  ] },
  { id: "ground", name: "Ground", rooms: [
    { id: "terrace", name: "Pool terrace", m2: 420, box: [60, 40, 880, 120, 60], img: "poolDay", note: "Travertine, loungers and the 25 m infinity pool." },
    { id: "salon", name: "Salon", m2: 140, box: [560, 190, 380, 230, 110], img: "living", note: "Sunk two steps below the terrace, with a green marble fireplace." },
    { id: "hall", name: "Entrance hall", m2: 90, box: [400, 250, 140, 300, 70], img: "hall", note: "Double height, with the curved stair and the glass-rod chandelier." },
    { id: "dining", name: "Dining room", m2: 75, box: [190, 190, 190, 200, 24], img: "dining", note: "Seats fourteen." },
    { id: "kitchen", name: "Kitchen", m2: 60, box: [60, 190, 110, 360, 24], img: "kitchen", note: "Fluted oak and green marble, with a scullery behind." },
    { id: "bar", name: "Bar", m2: 34, box: [190, 410, 190, 140, 24], img: "bar", note: "Black lacquer and brass." },
    { id: "library", name: "Library", m2: 40, box: [560, 440, 380, 110, 24], img: "library", note: "Fluted oak shelves and a rolling brass ladder." },
  ] },
  { id: "first", name: "First", rooms: [
    { id: "principal", name: "Principal suite", m2: 190, box: [520, 60, 420, 300, 110], img: "suite", note: "Bedroom, two dressing rooms and a private terrace." },
    { id: "bath", name: "Principal bath", m2: 48, box: [520, 380, 200, 170, 24], img: "bath", note: "The travertine bath at the window." },
    { id: "s2", name: "Suite two", m2: 64, box: [60, 60, 200, 230, 24], img: "guest", note: "Sea view and a balcony." },
    { id: "s3", name: "Suite three", m2: 64, box: [280, 60, 200, 230, 24], note: "Sea view and a balcony." },
    { id: "s4", name: "Suite four", m2: 58, box: [60, 320, 200, 230, 24], note: "Garden view." },
    { id: "lounge", name: "Family lounge", m2: 52, box: [280, 320, 200, 230, 24], note: "Opens onto the stair gallery." },
    { id: "terrace1", name: "Terrace", m2: 70, box: [740, 380, 200, 170, 60], note: "Shaded by the floor above." },
  ] },
  { id: "roof", name: "Roof", rooms: [
    { id: "roofdeck", name: "Roof terrace", m2: 260, box: [60, 60, 600, 490, 140], img: "roof", note: "A long sofa, a fire pit and olive trees, facing the sunset." },
    { id: "sky", name: "Sky lounge", m2: 55, box: [690, 60, 250, 260, 90], note: "Glass on three sides, with a bar." },
    { id: "kitchen2", name: "Summer kitchen", m2: 24, box: [690, 350, 250, 200, 24], note: "A grill and a cold room." },
  ] },
];

/** The rooms index (contact sheet). */
export const SHEET: { img: ImgKey; name: string }[] = [
  { img: "hall", name: "Entrance hall" }, { img: "living", name: "Salon" }, { img: "golden", name: "Salon at five" },
  { img: "dining", name: "Dining room" }, { img: "kitchen", name: "Kitchen" }, { img: "bar", name: "Bar" }, { img: "bar2", name: "Bar, from the lounge" },
  { img: "cinema", name: "Cinema" }, { img: "suite", name: "Principal suite" }, { img: "bath", name: "Principal bath" },
  { img: "guest", name: "Suite two" }, { img: "library", name: "Library" }, { img: "spa", name: "Spa pool" },
  { img: "gym", name: "Gym" }, { img: "wine", name: "Wine room" }, { img: "roof", name: "Roof terrace" },
  { img: "poolDay", name: "Pool terrace" }, { img: "aerial", name: "From the air" }, { img: "brass", name: "Brass in terrazzo" },
  { img: "oak", name: "Fluted oak" }, { img: "marble", name: "Green marble" }, { img: "pull", name: "The bronze door" },
];

export const PAIRS: { id: string; name: string; a: ImgKey; b: ImgKey; aName: string; bName: string }[] = [
  { id: "facade", name: "The façade", a: "day", b: "night", aName: "Afternoon", bName: "Blue hour" },
  { id: "terrace", name: "The pool terrace", a: "poolDay", b: "poolDusk", aName: "Noon", bName: "Dusk" },
];
