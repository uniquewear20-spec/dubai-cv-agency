"use client";

import { Shell } from "./Chrome";
import { Cabin, Configurator, Contact, Drive, Faq, Hero, Light, Story, Visit } from "./Sections";

export default function KhayyalHome() {
  return (
    <Shell>
      <Hero />
      <Light />
      <Configurator />
      <Cabin />
      <Drive />
      <Story />
      <Visit />
      <Contact />
      <Faq />
    </Shell>
  );
}
