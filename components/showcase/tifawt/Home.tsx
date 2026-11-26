"use client";

// TIFAWT home page. The first five scenes follow the reference site's order and behaviour
// (split hero, Maison telescope, story line, pinned product walk, big-word pillars); the rest
// make it a complete shop: collection, objects, process, rituals, finder, ingredients, gift
// boxes, questions and the enquiry form.

import { Footer, Enquiry, Shell } from "./Chrome";
import Hero from "./Hero";
import { Atelier, Coffrets, Collection, Faq, Finder, Ingredients, Pillars, Process, Rituals } from "./Sections";
import { Maison, Showcase, StoryLine } from "./Story";
import { TifawtProvider } from "./state";

export default function Home() {
  return (
    <TifawtProvider>
      <Shell onHome>
        <Hero />
        <div className="tf-over">
          <Maison />
          <StoryLine />
          <Showcase />
          <Pillars />
          <Collection />
          <Atelier />
          <Process />
          <Rituals />
          <Finder />
          <Ingredients />
          <Coffrets />
          <Faq />
          <Enquiry />
          <Footer />
        </div>
      </Shell>
    </TifawtProvider>
  );
}
