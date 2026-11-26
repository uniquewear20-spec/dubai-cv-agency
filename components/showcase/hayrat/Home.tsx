"use client";

import { Shell } from "./Chrome";
import { Descent } from "./Descent";
import { Arrive, Banks, BookSection, DayDial, Dining, Enquiry, Faq, Island, IslandMap, Materials, Rooms, SaltHouse } from "./Sections";

export default function HayratHome() {
  return (
    <Shell onHome>
      <Descent />
      <Island />
      <Materials />
      <Rooms />
      <BookSection />
      <Dining />
      <SaltHouse />
      <DayDial />
      <IslandMap />
      <Arrive />
      <Banks />
      <Faq />
      <Enquiry />
    </Shell>
  );
}
