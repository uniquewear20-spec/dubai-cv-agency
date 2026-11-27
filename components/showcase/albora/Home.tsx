"use client";

import { Call, Contact, Faq } from "./Call";
import { Shell } from "./Chrome";
import { Amenities, Gallery, Living, SmartHome, Story, Terraces } from "./Living";
import { Residences } from "./Residences";
import { Architecture, Coast, Concept, Gardens, Golden, Hero, Quote, Rif, Wellness } from "./Scenes";

export default function AlboraHome() {
  return (
    <Shell>
      <Hero />
      <Quote />
      <Concept />
      <Golden />
      <Coast />
      <Rif />
      <Architecture />
      <Gardens />
      <Wellness />
      <Residences />
      <Living />
      <Terraces />
      <Amenities />
      <SmartHome />
      <Story />
      <Gallery />
      <Call />
      <Contact />
      <Faq />
    </Shell>
  );
}
