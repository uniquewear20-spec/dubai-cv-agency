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
  style?: CSSProperties;
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
  const [translateX, setTranslateX] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      const totalWidth = el.scrollWidth / 3; // لأننا نكرر 3 مرات
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
        {/* كرر 3 مرات لعمل seamless حقيقي */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex shrink-0"
            style={{ gap: `${gap}px` }}
          >
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