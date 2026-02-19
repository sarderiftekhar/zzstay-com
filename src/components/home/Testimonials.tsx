"use client";

import { useTranslations } from "next-intl";
import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    location: "London, UK",
    rating: 5,
    text: "Found the exact same hotel room for 30% less than what I was about to book on another site. BookYourHotel is my go-to now!",
    avatar: "SM",
  },
  {
    name: "Ahmed K.",
    location: "Dubai, UAE",
    rating: 5,
    text: "The search is incredibly fast and the booking process was seamless. I saved over $200 on my family vacation.",
    avatar: "AK",
  },
  {
    name: "Marie L.",
    location: "Paris, France",
    rating: 5,
    text: "Love the price comparison feature. It's great to see all options in one place. The interface is beautiful and easy to use.",
    avatar: "ML",
  },
];

export default function Testimonials() {
  const t = useTranslations("home");
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ rootMargin: "0px 0px -40px 0px" });

  return (
    <section className="py-20 sm:py-28 bg-accent relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-accent-bright/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-bright/3 rounded-full blur-3xl translate-y-1/2 translate-x-1/3 pointer-events-none" />

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
        backgroundSize: "32px 32px",
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className={`text-center mb-14 ${headerVisible ? "animate-fade-up" : "scroll-hidden"}`}>
          <span className="inline-block px-4 py-1.5 bg-white/10 text-accent-bright text-xs font-semibold uppercase tracking-widest rounded-full mb-6 border border-white/10">
            Testimonials
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("testimonialsTitle")}
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            {t("testimonialsSubtitle")}
          </p>
        </div>

        {/* Large quote icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
            <Quote size={28} className="text-accent-bright" />
          </div>
        </div>

        {/* Featured testimonial */}
        <div ref={gridRef} className={`text-center mb-12 max-w-3xl mx-auto ${gridVisible ? "animate-fade-up" : "scroll-hidden"}`}>
          <p
            className="text-xl sm:text-2xl text-white/80 leading-relaxed mb-8 italic"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            &ldquo;With our dedication and expertise in hospitality, we strive to provide stays that are not just accommodations, but a comforting journey toward relaxation and memorable experiences.&rdquo;
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`bg-white/5 backdrop-blur-sm rounded-2xl p-7 sm:p-8 border border-white/10 hover:border-accent-bright/30 hover:bg-white/8 hover:-translate-y-1 transition-all duration-300 ${
                gridVisible ? `animate-fade-up stagger-${index + 1}` : "scroll-hidden"
              }`}
              style={{ animationFillMode: "both" }}
            >
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={15} className="fill-star text-star" />
                ))}
              </div>

              <p className="text-white/70 text-[15px] leading-relaxed mb-8">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-accent-bright/20 flex items-center justify-center text-accent-bright text-sm font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-white/40 text-xs">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
