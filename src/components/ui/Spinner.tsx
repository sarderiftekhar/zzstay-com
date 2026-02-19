"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

/**
 * Branded BookYourHotel loading spinner.
 * Shows the "ZZ" logo with orbiting dots and a breathing pulse.
 */
export default function Spinner({ size = 48, className }: SpinnerProps) {
  const scale = size / 48;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Outer orbiting ring */}
        <div
          className="absolute inset-0 animate-logo-spin"
          style={{ width: size, height: size }}
        >
          {/* Orbiting dot 1 */}
          <span
            className="absolute rounded-full bg-accent-bright"
            style={{
              width: 6 * scale,
              height: 6 * scale,
              top: 0,
              left: "50%",
              marginLeft: -3 * scale,
            }}
          />
          {/* Orbiting dot 2 (opposite) */}
          <span
            className="absolute rounded-full bg-accent-bright/40"
            style={{
              width: 5 * scale,
              height: 5 * scale,
              bottom: 0,
              left: "50%",
              marginLeft: -2.5 * scale,
            }}
          />
        </div>

        {/* Center logo text */}
        <div className="absolute inset-0 flex items-center justify-center animate-logo-breathe">
          <span
            className="font-bold tracking-tight select-none"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 18 * scale,
              lineHeight: 1,
            }}
          >
            <span className="text-accent">ZZ</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Full-area overlay spinner — used for content transitions.
 * Fades in smoothly and shows the branded spinner centred.
 */
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <Spinner size={56} />
      {message && (
        <p className="mt-4 text-sm text-text-muted animate-logo-breathe">
          {message}
        </p>
      )}
    </div>
  );
}
