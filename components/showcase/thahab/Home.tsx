"use client";

import { Shell } from "./Chrome";
import { AfterDark, Arrive, Contact, Day, Dining, Faq, Hero, Place, Sky, Tents } from "./Sections";

export default function ThahabHome() {
  return (
    <Shell>
      <Hero />
      <Day />
      <Tents />
      <Dining />
      <Place />
      <Sky />
      <AfterDark />
      <Arrive />
      <Contact />
      <Faq />
    </Shell>
  );
}
