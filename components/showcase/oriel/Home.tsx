"use client";

import { Shell } from "./Chrome";
import { Aerial, Amenities, Area, Contact, Faq, Hero, Interiors, Living, Materials, Twilight } from "./Sections";
import { Tower } from "./Tower";

export default function OrielHome() {
  return (
    <Shell>
      <Hero />
      <Tower />
      <Interiors />
      <Twilight />
      <Amenities />
      <Materials />
      <Living />
      <Aerial />
      <Area />
      <Contact />
      <Faq />
    </Shell>
  );
}
