// lib/agent/interview/looks.ts — the animated interviewer's three original looks (colours only;
// the drawing is in components/agent/interview/Interviewer.tsx). Shared by the setup and the room.

export type LookId = "amal" | "karim" | "lina";
export const LOOK_IDS: LookId[] = ["amal", "karim", "lina"];

export interface Look {
  /** How the interviewer presents, so the voice can match (browsers offer female and male voices). */
  presentation: "female" | "male";
  skin: string;
  skinShade: string;
  lips: string;
  brows: string;
  iris: string;
  /** Hair, or the headscarf for Amal. */
  hair: string;
  hairShade: string;
  jacket: string;
  jacketShade: string;
  shirt: string;
  style: "scarf" | "short" | "long";
  beard?: boolean;
  pin?: boolean;
}

export const LOOKS: Record<LookId, Look> = {
  amal: {
    presentation: "female",
    skin: "#c99277", skinShade: "#ad785f", lips: "#9c5550", brows: "#3a2620", iris: "#4b3326",
    hair: "#2e4744", hairShade: "#223634", jacket: "#1f2632", jacketShade: "#171c25", shirt: "#e8ddcc", style: "scarf",
  },
  karim: {
    presentation: "male",
    skin: "#cf9f80", skinShade: "#b4856a", lips: "#a2675d", brows: "#211814", iris: "#3c291f",
    hair: "#1d1612", hairShade: "#120d0b", jacket: "#1b2434", jacketShade: "#141b27", shirt: "#eef0f3", style: "short", beard: true,
  },
  lina: {
    presentation: "female",
    skin: "#e5bb9d", skinShade: "#cc9f82", lips: "#b25f5a", brows: "#4a2e22", iris: "#5a4a2e",
    hair: "#4b2c1f", hairShade: "#371f16", jacket: "#2a2a2e", jacketShade: "#1f1f22", shirt: "#d8c6a6", style: "long", pin: true,
  },
};

/** The look that presents the other way (to match a voice when the browser has only one kind). */
export const otherLook = (id: LookId): LookId => (LOOKS[id].presentation === "male" ? "amal" : "karim");
