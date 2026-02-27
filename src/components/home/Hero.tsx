"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import SearchWidget from "@/components/search/SearchWidget";

const SLIDES = [
  { city: "Dubai",         letter: "D", src: "/images/hero-slides/dubai.jpg",         gradient: "linear-gradient(135deg, #c2842f 0%, #1a1a2e 100%)" },
  { city: "Paris",         letter: "P", src: "/images/hero-slides/paris.jpg",         gradient: "linear-gradient(135deg, #4a6fa5 0%, #2d2d44 100%)" },
  { city: "New York",      letter: "N", src: "/images/hero-slides/new-york.jpg",      gradient: "linear-gradient(135deg, #3a3a5c 0%, #1a1a2e 100%)" },
  { city: "Tokyo",         letter: "T", src: "/images/hero-slides/tokyo.jpg",         gradient: "linear-gradient(135deg, #e74c6f 0%, #2d1b4e 100%)" },
  { city: "London",        letter: "L", src: "/images/hero-slides/london.jpg",        gradient: "linear-gradient(135deg, #5b7ea1 0%, #2a2a3d 100%)" },
  { city: "Istanbul",      letter: "I", src: "/images/hero-slides/istanbul.jpg",      gradient: "linear-gradient(135deg, #c17f3e 0%, #1e3a5f 100%)" },
  { city: "Singapore",     letter: "S", src: "/images/hero-slides/singapore.jpg",     gradient: "linear-gradient(135deg, #2ec4b6 0%, #1a1a3e 100%)" },
  { city: "Rome",          letter: "R", src: "/images/hero-slides/rome.jpg",          gradient: "linear-gradient(135deg, #c9a96e 0%, #3d2b1f 100%)" },
  { city: "Barcelona",     letter: "B", src: "/images/hero-slides/barcelona.jpg",     gradient: "linear-gradient(135deg, #e07b4c 0%, #1a2744 100%)" },
  { city: "Bangkok",       letter: "B", src: "/images/hero-slides/bangkok.jpg",       gradient: "linear-gradient(135deg, #d4a843 0%, #2b1a2e 100%)" },
  { city: "Sydney",        letter: "S", src: "/images/hero-slides/sydney.jpg",        gradient: "linear-gradient(135deg, #4fa8d1 0%, #1a2a3e 100%)" },
  { city: "Maldives",      letter: "M", src: "/images/hero-slides/maldives.jpg",      gradient: "linear-gradient(135deg, #00bcd4 0%, #004d5c 100%)" },
  { city: "Santorini",     letter: "S", src: "/images/hero-slides/santorini.jpg",     gradient: "linear-gradient(135deg, #4a90d9 0%, #2a1a3e 100%)" },
  { city: "Bali",          letter: "B", src: "/images/hero-slides/bali.jpg",          gradient: "linear-gradient(135deg, #4caf50 0%, #1a3a2e 100%)" },
  { city: "Rio",           letter: "R", src: "/images/hero-slides/rio.jpg",           gradient: "linear-gradient(135deg, #66bb6a 0%, #1a2e3a 100%)" },
  { city: "Cape Town",     letter: "C", src: "/images/hero-slides/cape-town.jpg",     gradient: "linear-gradient(135deg, #5c9ead 0%, #2a2a44 100%)" },
  { city: "Amsterdam",     letter: "A", src: "/images/hero-slides/amsterdam.jpg",     gradient: "linear-gradient(135deg, #5b8c5a 0%, #2a3a4e 100%)" },
  { city: "Hong Kong",     letter: "H", src: "/images/hero-slides/hong-kong.jpg",     gradient: "linear-gradient(135deg, #e65100 0%, #1a1a3e 100%)" },
  { city: "Prague",        letter: "P", src: "/images/hero-slides/prague.jpg",        gradient: "linear-gradient(135deg, #a1887f 0%, #2a2a3e 100%)" },
  { city: "Vienna",        letter: "V", src: "/images/hero-slides/vienna.jpg",        gradient: "linear-gradient(135deg, #bcaaa4 0%, #2d2d44 100%)" },
  { city: "Marrakech",     letter: "M", src: "/images/hero-slides/marrakech.jpg",     gradient: "linear-gradient(135deg, #d4843e 0%, #3e1a1a 100%)" },
  { city: "Lisbon",        letter: "L", src: "/images/hero-slides/lisbon.jpg",        gradient: "linear-gradient(135deg, #e8b960 0%, #2a3a4e 100%)" },
  { city: "Athens",        letter: "A", src: "/images/hero-slides/athens.jpg",        gradient: "linear-gradient(135deg, #8d6e63 0%, #1a2a3e 100%)" },
  { city: "Miami",         letter: "M", src: "/images/hero-slides/miami.jpg",         gradient: "linear-gradient(135deg, #ff7043 0%, #1a3a4e 100%)" },
  { city: "Mumbai",        letter: "M", src: "/images/hero-slides/mumbai.jpg",        gradient: "linear-gradient(135deg, #e07b4c 0%, #2a1a3e 100%)" },
  { city: "Delhi",         letter: "D", src: "/images/hero-slides/delhi.jpg",         gradient: "linear-gradient(135deg, #c9a96e 0%, #2d1b4e 100%)" },
  { city: "Jaipur",        letter: "J", src: "/images/hero-slides/jaipur.jpg",        gradient: "linear-gradient(135deg, #e8935a 0%, #3e1a2e 100%)" },
  { city: "Shanghai",      letter: "S", src: "/images/hero-slides/shanghai.jpg",      gradient: "linear-gradient(135deg, #6a5acd 0%, #1a1a3e 100%)" },
  { city: "Beijing",       letter: "B", src: "/images/hero-slides/beijing.jpg",       gradient: "linear-gradient(135deg, #8b6914 0%, #2a2a3e 100%)" },
  { city: "Seoul",         letter: "S", src: "/images/hero-slides/seoul.jpg",         gradient: "linear-gradient(135deg, #7986cb 0%, #1a2a3e 100%)" },
  { city: "Zurich",        letter: "Z", src: "/images/hero-slides/zurich.jpg",        gradient: "linear-gradient(135deg, #4db6ac 0%, #1a3a4e 100%)" },
  { city: "Kathmandu",     letter: "K", src: "/images/hero-slides/kathmandu.jpg",     gradient: "linear-gradient(135deg, #d4843e 0%, #1a2e3a 100%)" },
  { city: "Bruges",        letter: "B", src: "/images/hero-slides/bruges.jpg",        gradient: "linear-gradient(135deg, #c17f3e 0%, #2a3a4e 100%)" },
  { city: "Los Angeles",   letter: "L", src: "/images/hero-slides/los-angeles.jpg",   gradient: "linear-gradient(135deg, #ff7043 0%, #2d1b4e 100%)" },
  { city: "San Francisco", letter: "S", src: "/images/hero-slides/san-francisco.jpg", gradient: "linear-gradient(135deg, #e65100 0%, #1a2a3e 100%)" },
  { city: "Toronto",       letter: "T", src: "/images/hero-slides/toronto.jpg",       gradient: "linear-gradient(135deg, #5b7ea1 0%, #2a2a44 100%)" },
  { city: "Vancouver",     letter: "V", src: "/images/hero-slides/vancouver.jpg",     gradient: "linear-gradient(135deg, #4caf50 0%, #1a3a4e 100%)" },
];

const NUM = SLIDES.length;
const ANIM_MS = 750;

export default function Hero() {
  const t = useTranslations("hero");
  const [cur, setCur] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [diff, setDiff] = useState(0);           // drag pixel diff
  const [dragging, setDragging] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const contRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const active = useRef(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tmRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const curRef = useRef(0);
  const diffRef = useRef(0);

  /* ---------- preload images & detect failures ---------- */
  useEffect(() => {
    SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
      img.onerror = () => {
        setFailedImages((prev) => new Set(prev).add(slide.src));
      };
    });
  }, []);

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
                {/* Background — gradient fallback + image on top */}
                <div
                  className="absolute inset-0"
                  style={{ background: slide.gradient }}
                />
                {!failedImages.has(slide.src) && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${slide.src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}

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
                      backgroundImage: failedImages.has(slide.src) ? slide.gradient : `url(${slide.src})`,
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

          {/* Navigation dots — compact bar style */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-15">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.city}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === cur
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to ${slide.city}`}
              />
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
