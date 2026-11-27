"use client";

import { useEffect, useRef, useState } from "react";
import { Hero, Wordmark } from "./Hero";
import { CHAPTERS, Film, goFilm } from "./Film";
import { Figures, Light, Plans, Rule, Sheet, Viewing } from "./Sections";

const PAGES = [
  { id: "residence", name: "The residence" },
  { id: "plans", name: "Plans" },
  { id: "light", name: "The same view, later" },
  { id: "rooms", name: "Every room" },
  { id: "viewing", name: "Private viewings" },
];

function Menu({ onClose }: { onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", key);
    box.current?.querySelector<HTMLElement>("button")?.focus();
    return () => removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div className="ve-menu" role="dialog" aria-modal="true" aria-label="Chapters" ref={box}>
      <button className="ve-menu-x" onClick={onClose}>Close</button>
      <div className="ve-menu-cols">
        <nav aria-label="The film">
          <p className="ve-menu-h">The film</p>
          <ol>
            {CHAPTERS.map((c) => (
              <li key={c.name}>
                <button
                  onClick={() => {
                    onClose();
                    goFilm(c.at + 0.02);
                  }}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <nav aria-label="The house">
          <p className="ve-menu-h">The house</p>
          <ul>
            {PAGES.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`} onClick={onClose}>{p.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Rule className="ve-menu-rule" />
    </div>
  );
}

export default function VillaEclat() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="ve">
      <header className="ve-top">
        <a className="ve-top-mark" href="#top" aria-label="Villa Éclat, back to the top">
          <Wordmark hair />
        </a>
        <nav className="ve-top-nav" aria-label="Site">
          <button className="ve-top-btn" onClick={() => setMenu(true)} aria-haspopup="dialog">Chapters</button>
          <a className="ve-top-btn ve-top-cta" href="#viewing">Book a viewing</a>
        </nav>
      </header>
      {menu && <Menu onClose={() => setMenu(false)} />}
      <main>
        <Hero />
        <Film />
        <Figures />
        <Plans />
        <Light />
        <Sheet />
        <Viewing />
      </main>
      <footer className="ve-foot">
        <Wordmark className="ve-foot-mark" hair />
        <p>Villa Éclat is a fictional property. This is a concept website designed and built by Zenith Dubai; the photographs are generated, and nothing here is for sale.</p>
        <a href="/showcase/">See more concept websites</a>
      </footer>
    </div>
  );
}
