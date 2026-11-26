"use client";

import { FireMenu } from "./FireMenu";
import { Reserve } from "./Reserve";
import { Counter, Faq, GiftSeat, Hero, Night, Pairing, Private, Visit, Woods } from "./Sections";
import { Shell } from "./Chrome";

export default function MawqidHome() {
  return (
    <Shell>
      <Hero />
      <Counter />
      <FireMenu />
      <Woods />
      <Night />
      <Pairing />
      <Reserve />
      <GiftSeat />
      <Private />
      <Visit />
      <Faq />
    </Shell>
  );
}
