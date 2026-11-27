// VILLA ÉCLAT: a fictional beachfront villa on the Dubai coast, built by Zenith Dubai as a concept
// website. Nothing here is a real property, listing, price or client. The pictures are generated
// (prompts in image-prompts/VILLA-ECLAT.md); a key left empty shows a quiet placeholder.

export type ImgKey =
  | "day" | "night" | "approach" | "door" | "hall" | "up" | "living" | "golden" | "dining" | "kitchen"
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
  bar: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_145001_50a83ab7-38d1-4c7b-957f-55f2776f5af4.png",
  bar2: "https://d8j0ntlcm91z4.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/hf_20261127_145138_27a79bbf-620d-43b1-86ce-7c5419dec0c8.png",
  suite: "",
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
  guest: "", library: "", gym: "", wine: "",
};

/** The hero drone shot as numbered frames in /public. 0 frames: the hero eases over the still instead. */
/** The hero drone shot: a short-GOP MP4 scrubbed by scroll (re-encoded so every seek is quick). */
export const HERO = { video: "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/35773e69-293a-4137-84bd-6f30c61eaaf4.mp4", frames: 0, path: (i: number) => `/showcase/villa-eclat/hero/${String(i).padStart(3, "0")}.webp`, focus: [0.5, 0.56] as [number, number] };

// ── The film: one camera walking through the house, driven by scroll ───────────────────────────
export type Cam = { s?: number; x?: number; y?: number; r?: number }; // zoom, pan (share of view), roll (deg)
export type Out = "cut" | "zoom" | "whip" | "whipUp" | "fade" | "white" | "glow";
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

export const FILM: Shot[] = [
  { id: "approach", img: "approach", focus: [0.5, 0.56], from: { s: 1 }, to: { s: 1.32 }, out: "zoom", len: 1.25, chapter: "Arrival",
    flare: { from: [0.18, 0.12], to: [0.1, 0.08], k: 0.55 },
    lines: [{ at: [0.08, 0.62], text: "The lawn runs from the sand to a bronze door five metres tall." }] },
  { id: "door", img: "door", clip: { src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3MQDgHvQJDdXT6IO2Dd583p7SEq/5bb0d469-b4df-4037-ad36-259776b59b41.mp4", dur: 5.04 },
    focus: [0.5, 0.5], from: { s: 1 }, to: { s: 1 }, out: "cut", len: 1.6,
    lines: [{ at: [0.06, 0.5], text: "It turns on a single pivot, and stands open all day." }] },
  { id: "hall", img: "hall", focus: [0.5, 0.5], from: { s: 1 }, to: { s: 1.14, y: -0.03 }, out: "whipUp", len: 1.1, chapter: "The hall",
    lines: [{ at: [0.1, 0.72], text: "A staircase that turns once, under a rain of glass." }] },
  { id: "up", img: "up", focus: [0.5, 0.5], from: { s: 1.12, r: -38 }, to: { s: 1.3, r: 42 }, out: "whip", len: 1,
    lines: [{ at: [0.15, 0.7], text: "Look up." }] },
  { id: "salon", img: "living", img2: "golden", mix: [0.42, 0.74], focus: [0.5, 0.55], from: { s: 1.02, x: -0.04 }, to: { s: 1.12, x: 0.04 }, out: "whip", len: 1.7, chapter: "The salon",
    flare: { from: [0.86, 0.3], to: [0.78, 0.26], k: 0.85, with: "mix" },
    lines: [
      { at: [0.06, 0.38], text: "Two steps down, so the sea sits at eye level from the sofas." },
      { at: [0.5, 0.8], text: "At five o'clock the sun walks across the room." },
    ] },
  { id: "dining", img: "dining", focus: [0.5, 0.5], from: { s: 1.03, x: 0.05 }, to: { s: 1.14, x: -0.03 }, out: "whip", len: 1.1, chapter: "Dining",
    lines: [{ at: [0.1, 0.72], text: "A table for fourteen, under four hundred glass rods." }] },
  { id: "kitchen", img: "kitchen", focus: [0.5, 0.52], from: { s: 1.14, r: -3 }, to: { s: 1.02, r: 0 }, out: "fade", len: 1, chapter: "Kitchen",
    lines: [{ at: [0.1, 0.66], text: "Green marble, a brass edge, and the sea at the sink." }] },
  { id: "bar", img: "bar", focus: [0.5, 0.5], from: { s: 1.18 }, to: { s: 1.03 }, out: "white", len: 1.05, chapter: "After dark",
    lines: [{ at: [0.1, 0.66], text: "Black lacquer, brass and mirror, for the late hours." }] },
  { id: "suite", img: "suite", focus: [0.5, 0.52], framed: true, from: { s: 1.14 }, to: { s: 1.02 }, out: "whip", len: 1.25, chapter: "The suites",
    lines: [{ at: [0.42, 0.8], text: "The principal suite opens onto its own terrace above the sea." }] },
  { id: "bath", img: "bath", focus: [0.5, 0.5], from: { s: 1.02, y: 0.02 }, to: { s: 1.12, y: -0.02 }, out: "fade", len: 1,
    lines: [{ at: [0.1, 0.66], text: "A bath carved from one block of travertine." }] },
  { id: "spa", img: "spa", focus: [0.5, 0.55], from: { s: 1 }, to: { s: 1.2 }, out: "fade", len: 1.05, chapter: "Spa",
    lines: [{ at: [0.1, 0.68], text: "Below ground, a vaulted pool lit by round skylights." }] },
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
