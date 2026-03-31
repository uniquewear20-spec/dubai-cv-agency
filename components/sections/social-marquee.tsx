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
  const innerRef = useRef<HTMLDivElement>(null);
  const [copyWidth, setCopyWidth] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const measure = () => {
      const firstCopy = inner.children[0] as HTMLElement | undefined;
      if (firstCopy) {
        setCopyWidth(firstCopy.scrollWidth + gap);
      }
    };

    const id = setTimeout(measure, 50);
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    return () => { clearTimeout(id); ro.disconnect(); };
  }, [gap, children]);

  const duration = copyWidth > 0 ? copyWidth / speed : 0;
  const keyframeName = "zenith-marquee";

  const animStyle: CSSProperties =
    duration > 0
      ? {
          animationName: keyframeName,
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: paused ? "paused" : "running",
          animationDirection: reverse ? "reverse" : "normal",
          willChange: "transform",
        }
      : {};

  const maskImage =
    "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={fade ? { maskImage, WebkitMaskImage: maskImage } : undefined}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      {copyWidth > 0 && (
        <style>{`
          @keyframes ${keyframeName} {
            from { transform: translateX(0); }
            to   { transform: translateX(-${copyWidth}px); }
          }
        `}</style>
      )}

      <div ref={innerRef} className="flex w-max" style={animStyle}>
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="flex shrink-0"
            style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;