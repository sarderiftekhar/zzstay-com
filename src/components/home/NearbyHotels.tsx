"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePreferencesStore } from "@/store/preferencesStore";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import HomeHotelCard, { HomeHotelCardSkeleton } from "./HomeHotelCard";

interface Hotel {
  hotelId: string;
  name: string;
  starRating?: number;
  address?: string;
  city?: string;
  country?: string;
  main_photo?: string;
  minRate?: number;
  currency?: string;
  reviewScore?: number;
  reviewCount?: number;
  distanceFromCenter?: number;
}

export default function NearbyHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currency } = usePreferencesStore();
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  useEffect(() => {
    let cancelled = false;

    async function fetchNearby() {
      try {
        // First get user's location
        const geoRes = await fetch("/api/geo");
        if (!geoRes.ok) return;
        const geo = await geoRes.json();

        if (!geo.city && !geo.country) return;
        if (!cancelled) setCityName(geo.city);

        // Then fetch nearby hotels
        const params = new URLSearchParams({ currency });
        if (geo.city) params.set("city", geo.city);
        if (geo.country) params.set("countryCode", geo.country);
        if (geo.lat) params.set("lat", String(geo.lat));
        if (geo.lon) params.set("lon", String(geo.lon));

        const res = await fetch(`/api/hotels/nearby?${params}`);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && json.data?.length) {
          setHotels(json.data);
        }
      } catch {
        // Silently fail — section won't show
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNearby();
    return () => { cancelled = true; };
  }, [currency]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 380;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  // Don't render section if no hotels found
  if (!loading && hotels.length === 0) return null;

  return (
    <section className="pt-4 pb-16 sm:pt-6 sm:pb-20">
      <div
        ref={sectionRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "animate-fade-up" : "scroll-hidden"}`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl sm:text-3xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Nearby hotels
          </h2>

          {/* Arrow buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-border/50 hover:border-accent/40 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft size={18} className="text-text-secondary" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-border/50 hover:border-accent/40 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight size={18} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[calc(100%-16px)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <HomeHotelCardSkeleton />
                </div>
              ))
            : hotels.map((hotel) => (
                <div
                  key={hotel.hotelId}
                  className="shrink-0 w-[calc(100%-16px)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <HomeHotelCard hotel={hotel} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
