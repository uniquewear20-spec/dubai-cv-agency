"use client";

import { Shell } from "./Chrome";
import { Area, Contact, Faq, Hero, Living, Materials, Night, Plan, View, Viewing } from "./Sections";

export default function ShorelineHome() {
  return (
    <Shell>
      <Hero />
      <Plan />
      <View />
      <Night />
      <Materials />
      <Living />
      <Area />
      <Viewing />
      <Contact />
      <Faq />
    </Shell>
  );
}
