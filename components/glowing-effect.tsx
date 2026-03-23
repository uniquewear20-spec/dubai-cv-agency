"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

export function GlowingEffect({
  blur = 0,
  inactiveZone = 0.7,
  proximity = 64,
  spread = 20,
  variant = "default",
  glow = false,
  className,
  movementDuration = 2,
  borderWidth = 1,
  disabled = false,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);

  const handleMove = useCallback(
    (e?: MouseEvent | { x: number; y: number }) => {
      if (!containerRef.current) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const element = containerRef.current;
        if (!element) return;

        const { left, top, width, height } = element.getBoundingClientRect();
        const mouseX = e?.x ?? lastPosition.current.x;
        const mouseY = e?.y ?? lastPosition.current.y;

        if (e) {
          lastPosition.current = { x: mouseX, y: mouseY };
        }

        const center = [left + width * 0.5, top + height * 0.5];
        const distanceFromCenter = Math.hypot(
          mouseX - center[0],
          mouseY - center[1]
        );
        const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

        if (distanceFromCenter < inactiveRadius) {
          element.style.setProperty("--active", "0");
          return;
        }

        const isActive =
          mouseX > left - proximity &&
          mouseX < left + width + proximity &&
          mouseY > top - proximity &&
          mouseY < top + height + proximity;

        element.style.setProperty("--active", isActive ? "1" : "0");

        if (!isActive) return;

        const currentAngle =
          parseFloat(element.style.getPropertyValue("--start")) || 0;

        let targetAngle =
          (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
            Math.PI +
          90;

        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
        const newAngle = currentAngle + angleDiff;

        element.style.setProperty(
          "--start",
          newAngle.toFixed(2)
        );
      });
    },
    [inactiveZone, proximity]
  );

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => handleMove(e);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMove, disabled]);

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "pointer-events-none absolute -inset-px hidden rounded-[inherit] opacity-0 transition-opacity",
          glow && "opacity-100",
          variant === "white" && "invert",
          "[--active:0] [--start:0] [transition:opacity_1s]",
          "[&:is([style*='--active:1'])]:opacity-100",
          className
        )}
        style={
          {
            "--spread": spread,
            "--blur": blur,
            "--border-width": borderWidth,
            "--movement-duration": `${movementDuration}s`,
          } as React.CSSProperties
        }
      >
        {/* Glow layer */}
        <div
          className={cn(
            "glow absolute inset-0 rounded-[inherit]",
            'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(var(--border-width)*-1)]',
            "after:[background:radial-gradient(circle_at_50%_0%,rgba(200,169,110,0.15),transparent_70%)]",
            "after:opacity-[var(--active)] after:transition-opacity after:duration-500",
            "[mask-image:linear-gradient(black,black)]"
          )}
        />
        {/* Border trail layer */}
        <div
          className={cn(
            "absolute inset-0 rounded-[inherit]",
            'after:content-[""] after:rounded-[inherit]',
            "after:absolute after:[inset:0]",
            "after:[background:conic-gradient(from_calc(var(--start)*1deg),transparent_0deg,rgba(200,169,110,0.9)_calc(var(--spread)*0.5*1deg),rgba(226,201,142,1)_calc(var(--spread)*1deg),transparent_calc(var(--spread)*1.5*1deg))]",
            "after:opacity-[var(--active)]",
            "after:[transition:--start_var(--movement-duration)_ease,opacity_0.3s_ease]",
            "[mask-image:linear-gradient(white,white)]",
            "after:[mask-image:linear-gradient(white,white)]",
            `[mask-composite:exclude] after:[mask-composite:exclude]`,
            blur > 0 && `after:blur-[${blur}px]`
          )}
          style={{
            WebkitMaskImage: `linear-gradient(white, white), linear-gradient(white, white)`,
            WebkitMaskComposite: "destination-out",
            maskImage: `linear-gradient(white, white), linear-gradient(white, white)`,
            maskComposite: "exclude",
            padding: borderWidth,
          }}
        >
          <div className="absolute inset-0 rounded-[inherit]" />
        </div>
      </div>
    </>
  );
}