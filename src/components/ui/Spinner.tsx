"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

/**
 * Branded BookYourHotel loading spinner.
 * Shows the logo image with a shimmer sweep and gentle pulse.
 */
export default function Spinner({ size = 48, className }: SpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative animate-logo-breathe" style={{ width: size, height: size }}>
        {/* Pulsing ring */}
        <div
          className="absolute inset-0 rounded-full animate-logo-ring"
          style={{
            border: `${Math.max(2, size * 0.04)}px solid`,
            borderColor: "var(--color-accent-bright)",
            opacity: 0.3,
          }}
        />

        {/* Orbiting dot */}
        <div className="absolute inset-0 animate-logo-spin">
          <span
            className="absolute rounded-full bg-accent-bright"
            style={{
              width: Math.max(4, size * 0.1),
              height: Math.max(4, size * 0.1),
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Full-area overlay spinner with the actual logo image.
 * Used for page loading states and content transitions.
 */
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
      {/* Logo with shimmer effect */}
      <div className="relative">
        <div className="animate-logo-breathe">
          <Image
            src="/images/logo-white.png"
            alt="BookYourHotel"
            width={540}
            height={150}
            className="w-[220px] sm:w-[280px] h-auto"
            priority
          />
        </div>

        {/* Shimmer sweep overlay */}
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute inset-0 animate-logo-shimmer"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(62, 206, 173, 0.15) 50%, transparent 100%)",
              width: "200%",
            }}
          />
        </div>
      </div>

      {/* Animated dots bar */}
      <div className="flex items-center gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-accent-bright"
            style={{
              animation: "logoDotBounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {message && (
        <p className="mt-5 text-sm font-medium text-text-muted tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
}
