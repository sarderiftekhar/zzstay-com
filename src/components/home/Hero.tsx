"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import SearchWidget from "@/components/search/SearchWidget";

const SLIDES = [
  { city: "Dubai",      letter: "D", src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80" },
  { city: "Paris",      letter: "P", src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80" },
  { city: "New York",   letter: "N", src: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&q=80" },
  { city: "Tokyo",      letter: "T", src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80" },
  { city: "London",     letter: "L", src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80" },
  { city: "Istanbul",   letter: "I", src: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1920&q=80" },
  { city: "Singapore",  letter: "S", src: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&q=80" },
  { city: "Rome",       letter: "R", src: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80" },
  { city: "Barcelona",  letter: "B", src: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80" },
  { city: "Bangkok",    letter: "B", src: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1920&q=80" },
  { city: "Sydney",     letter: "S", src: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80" },
  { city: "Maldives",   letter: "M", src: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920&q=80" },
  { city: "Santorini",  letter: "S", src: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80" },
  { city: "Bali",       letter: "B", src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80" },
  { city: "Rio",        letter: "R", src: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1920&q=80" },
  { city: "Cape Town",  letter: "C", src: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=80" },
];

const NUM = SLIDES.length;
const ANIM_MS = 750;

export default function Hero() {
  const t = useTranslations("hero");
  const [cur, setCur] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [diff, setDiff] = useState(0);           // drag pixel diff
  const [dragging, setDragging] = useState(false);

  const contRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const active = useRef(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tmRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const curRef = useRef(0);
  const diffRef = useRef(0);

  useEffect(() => { curRef.current = cur; }, [cur]);
  useEffect(() => { diffRef.current = diff; }, [diff]);

  /* ---------- auto-scroll ---------- */
  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      const c = curRef.current;
      const next = c < NUM - 1 ? c + 1 : 0;
      setAnimating(true);
      setCur(next);
      if (tmRef.current) clearTimeout(tmRef.current);
      tmRef.current = setTimeout(() => setAnimating(false), ANIM_MS);
    }, 5000);
  }, []);

  useEffect(() => {
    resetAuto();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
      if (tmRef.current) clearTimeout(tmRef.current);
    };
  }, [resetAuto]);

  /* ---------- navigation ---------- */
  const goTo = useCallback((idx: number) => {
    if (animating) return;
    if (idx < 0 || idx >= NUM) return;
    setAnimating(true);
    setCur(idx);
    setDiff(0);
    if (tmRef.current) clearTimeout(tmRef.current);
    tmRef.current = setTimeout(() => setAnimating(false), ANIM_MS);
    resetAuto();
  }, [animating, resetAuto]);

  const goRight = useCallback(() => { if (cur < NUM - 1) goTo(cur + 1); }, [cur, goTo]);
  const goLeft  = useCallback(() => { if (cur > 0) goTo(cur - 1); }, [cur, goTo]);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goRight();
      if (e.key === "ArrowLeft") goLeft();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [goRight, goLeft]);

  /* ---------- drag ---------- */
  function onDown(e: React.MouseEvent | React.TouchEvent) {
    if (animating) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    startX.current = x;
    active.current = true;
    setDragging(true);
    setDiff(0);
    if (autoRef.current) clearInterval(autoRef.current);
  }

  function onMove(e: React.MouseEvent | React.TouchEvent) {
    if (!active.current) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const d = startX.current - x;
    // clamp at edges
    if (curRef.current === 0 && d < 0) return;
    if (curRef.current === NUM - 1 && d > 0) return;
    setDiff(d);
  }

  function onUp() {
    if (!active.current) return;
    active.current = false;
    setDragging(false);
    const threshold = (contRef.current?.offsetWidth || 400) * 0.15;
    const d = diffRef.current;
    if (d >= threshold && curRef.current < NUM - 1) {
      goTo(curRef.current + 1);
    } else if (d <= -threshold && curRef.current > 0) {
      goTo(curRef.current - 1);
    } else {
      setDiff(0);
      resetAuto();
    }
  }

  /* ---------- compute transforms ---------- */
  const contW = contRef.current?.offsetWidth || 1;
  // Slider track: each slide is 100/NUM % of total track width
  // Track translate = -(cur * slideWidthPercent) - (dragPixels converted to percent of track)
  const slidePercent = 100 / NUM;
  const dragPercent = (diff / contW) * slidePercent;
  const trackX = -(cur * slidePercent) - dragPercent;

  const trans = dragging ? "none" : `transform ${ANIM_MS}ms ease-in-out`;

  /* ---------- marquee phrases ---------- */
  const phrases = [
    "Find Amazing Hotels",
    "Compare Prices Instantly",
    "Search Over 2 Million Hotels",
    "Book Your Dream Vacation",
    "Best Price Guarantee",
    "No Hidden Fees",
    "Free Cancellation",
    "Discover Top Destinations",
  ];
  const marqueeText = phrases.join("  \u2022  "); // bullet separator

  return (
    <section className="relative bg-white pt-32 sm:pt-36 pb-40 sm:pb-36">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={contRef}
          role="region"
          aria-label="Featured destinations carousel"
          className="relative rounded-3xl overflow-hidden h-[400px] sm:h-[600px] select-none"
          style={{ cursor: dragging ? "grabbing" : "grab" }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        >
          {/* Track — holds all slides side by side */}
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: `${NUM * 100}%`,
              transform: `translate3d(${trackX}%, 0, 0)`,
              transition: trans,
            }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={slide.city}
                className="absolute top-0 h-full overflow-hidden"
                style={{
                  width: `${100 / NUM}%`,
                  left: `${(i * 100) / NUM}%`,
                }}
              >
                {/* Background image — same image visible behind dark overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${slide.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {/* Dark overlay — subtle tint so city text + letter cutout stay readable */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: "rgba(8, 12, 30, 0.40)",
                    zIndex: 1,
                  }}
                />

                {/* Transparent letter — image clips through text */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ zIndex: 2 }}
                >
                  <span
                    style={{
                      backgroundImage: `url(${slide.src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontSize: "clamp(200px, 50vw, 600px)",
                      fontWeight: 800,
                      lineHeight: 1,
                      fontFamily: "var(--font-playfair)",
                      transform: `translate3d(${diff / 60}px, -8%, 0)`,
                      transition: trans,
                              userSelect: "none",
                    }}
                  >
                    {slide.letter}
                  </span>
                </div>

                {/* City name overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ zIndex: 3 }}
                >
                  <span
                    className="text-white font-extrabold uppercase tracking-[0.12em] whitespace-nowrap"
                    style={{
                      fontSize: "clamp(1.8rem, 8vw, 7rem)",
                      transform: `translate3d(${diff / 15}px, -40%, 0)`,
                      transition: trans,
                              userSelect: "none",
                      textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 4px 60px rgba(0,0,0,0.3)",
                    }}
                  >
                    {slide.city}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient overlays — stronger at bottom for text legibility */}
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/60 pointer-events-none z-5" />

          {/* Trust badge — prominent with slow pulse */}
          <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-15 opacity-0 animate-hero-badge">
            <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md border border-white/25 rounded-full pl-3.5 pr-5 py-2.5 shadow-lg shadow-black/20 animate-badge-float">
              <span className="relative flex items-center justify-center w-3 h-3">
                <span className="absolute inset-0 bg-accent-bright rounded-full animate-ping opacity-50" />
                <span className="relative w-2.5 h-2.5 bg-accent-bright rounded-full" />
              </span>
              <span className="text-white text-sm sm:text-base font-bold tracking-wide">2.6M+ Hotels</span>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-15">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.city}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                className="group relative w-7 h-7 flex items-center justify-center"
                aria-label={`Go to ${slide.city}`}
              >
                <span className="block w-7 h-7 rounded-full border-2 border-white transition-all duration-300" />
                <span
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                    i === cur
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-0 group-hover:opacity-60 group-hover:scale-75"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Side nav hover areas */}
          <button
            type="button"
            aria-label="Previous slide"
            className="absolute left-0 top-0 w-[10%] h-full z-12 cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300 border-0 bg-transparent p-0"
            onClick={() => goLeft()}
          >
            <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="absolute right-0 top-0 w-[10%] h-full z-12 cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300 border-0 bg-transparent p-0"
            onClick={() => goRight()}
          >
            <div className="absolute inset-0 bg-linear-to-l from-white/10 to-transparent" />
          </button>
        </div>
      </div>

      {/* Search Widget */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-14 opacity-0 animate-hero-widget">
        <SearchWidget />
      </div>

      {/* Trust indicators */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex items-center justify-center gap-6 sm:gap-10 text-text-muted text-xs sm:text-sm opacity-0 animate-hero-trust">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          No hidden fees
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          Best price guarantee
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          Free cancellation
        </div>
      </div>

      {/* Scrolling text marquee bar — bottom of hero */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
        <div className="overflow-hidden py-2.5">
          <div className="animate-marquee-slow flex whitespace-nowrap">
            {["marquee-a", "marquee-b"].map((id) => (
              <span
                key={id}
                className="text-text-muted/40 text-xs font-medium tracking-wider uppercase shrink-0"
              >
                {marqueeText}&nbsp;&nbsp;&bull;&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
