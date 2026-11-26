"use client";

import { Shell } from "./Chrome";
import { Layering } from "./Layering";
import { Contact, Craft, Details, Faq, Gift, Hero, Look, Shop, Store } from "./Sections";

export default function MuskanaHome() {
  return (
    <Shell>
      <Hero />
      <Layering />
      <Shop />
      <Details />
      <Craft />
      <Look />
      <Gift />
      <Store />
      <Contact />
      <Faq />
    </Shell>
  );
}
