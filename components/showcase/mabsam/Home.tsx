"use client";

import { Shell } from "./Chrome";
import { Breathe, Care, Clinic, Contact, Faq, Finder, Hero, Rooms, Small, Visit } from "./Sections";

export default function MabsamHome() {
  return (
    <Shell>
      <Hero />
      <Finder />
      <Rooms />
      <Clinic />
      <Small />
      <Care />
      <Breathe />
      <Visit />
      <Contact />
      <Faq />
    </Shell>
  );
}
