"use client";

import { useRef, useState, useEffect, CSSProperties } from "react";

const DARK_BG = "#0A0907";
const LIGHT_BG = "#F7F3EE";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
  fade?: boolean;
  className?: string;
  gap?: number;
  style?: CSSProperties;
  dark?: boolean;
}

export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  reverse = false,
  fade = true,
  className = "",
  gap = 24,
  dark = true,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      const totalWidth = el.scrollWidth / 3;
      setTranslateX(totalWidth);
      setDuration(totalWidth / speed);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [speed, children]);

  const animStyle: CSSProperties = {
    animationDuration: duration > 0 ? `${duration}s` : "0s",
    animationPlayState: paused ? "paused" : "running",
    animationDirection: reverse ? "reverse" : "normal",
  };

  // Use the actual page background colour so the fade dissolves into it correctly
  const fadeBg = dark ? DARK_BG : LIGHT_BG;
  const maskImage = `linear-gradient(to right, ${fadeBg} 0%, transparent 8%, transparent 92%, ${fadeBg} 100%)`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={
        fade
          ? { maskImage, WebkitMaskImage: maskImage }
          : undefined
      }
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex w-max marquee-track"
        style={{ gap: `${gap}px`, ...animStyle }}
      >
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex shrink-0" style={{ gap: `${gap}px` }}>
            {children}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-${translateX}px); }
        }
        .marquee-track {
          animation-name: marquee-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}

export default Marquee;