"use client";

import { Axo } from "./Axo";
import { Brief } from "./Brief";
import { Shell } from "./Chrome";
import { Approach, Contact, Details, Faq, Hero, Materials, Model, Process, ScreenBand, Work } from "./Sections";
import { SunStudy } from "./Sun";

export default function ZillHome() {
  return (
    <Shell>
      <Hero />
      <Approach />
      <Axo />
      <Model />
      <SunStudy />
      <ScreenBand />
      <Work />
      <Materials />
      <Process />
      <Details />
      <Brief />
      <Contact />
      <Faq />
    </Shell>
  );
}
