"use client";

import { useRef, useState, useEffect, CSSProperties } from "react";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
  fade?: boolean;
  className?: string;
  gap?: number;
  style?: CSSProperties; // أضف هذا السطر هنا
}

export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  reverse = false,
  fade = true,
  className = "",
  gap = 24,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      // The track holds two copies; we animate one full copy width
      const halfWidth = el.scrollWidth / 2;
      setDuration(halfWidth / speed);
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

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={
        fade
          ? {
              maskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }
          : undefined
      }
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex w-max marquee-track"
        style={{
          gap: `${gap}px`,
          ...animStyle,
        }}
      >
        {/* Original set */}
        <div className="flex shrink-0" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex shrink-0" aria-hidden style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation-name: marquee-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}

export default Marquee;