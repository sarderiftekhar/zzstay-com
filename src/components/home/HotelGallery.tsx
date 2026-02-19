"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", alt: "Luxury hotel bedroom", rotate: "-3deg", size: "w-44 h-56 sm:w-52 sm:h-64" },
  { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", alt: "Hotel bathroom", rotate: "2deg", size: "w-36 h-48 sm:w-44 sm:h-56" },
  { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80", alt: "Hotel exterior view", rotate: "-1deg", size: "w-48 h-60 sm:w-56 sm:h-72" },
  { src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80", alt: "Hotel pool area", rotate: "3deg", size: "w-40 h-52 sm:w-48 sm:h-60" },
  { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80", alt: "Hotel room interior", rotate: "-2deg", size: "w-44 h-56 sm:w-52 sm:h-64" },
];

export default function HotelGallery() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 sm:py-28 bg-bg-cream overflow-hidden">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isVisible ? "animate-fade-up" : "scroll-hidden"}`}>
        {/* Scattered gallery layout */}
        <div className="relative flex items-center justify-center min-h-[400px] sm:min-h-[480px]">
          {/* Left images */}
          <div className="hidden md:flex flex-col gap-4 absolute left-0 top-1/2 -translate-y-1/2">
            <div className={`${GALLERY_IMAGES[0].size} rounded-2xl overflow-hidden shadow-lg animate-float`} style={{ transform: `rotate(${GALLERY_IMAGES[0].rotate})` }}>
              <Image src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} fill className="object-cover" sizes="220px" />
            </div>
            <div className={`${GALLERY_IMAGES[1].size} rounded-2xl overflow-hidden shadow-lg ml-8 animate-float-delayed`} style={{ transform: `rotate(${GALLERY_IMAGES[1].rotate})` }}>
              <Image src={GALLERY_IMAGES[1].src} alt={GALLERY_IMAGES[1].alt} fill className="object-cover" sizes="180px" />
            </div>
          </div>

          {/* Center CTA Card */}
          <div className="relative z-10 bg-accent text-white rounded-3xl p-8 sm:p-10 max-w-sm mx-auto text-center shadow-2xl">
            <h3
              className="text-2xl sm:text-3xl font-bold mb-3 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Join our community of travelers and experience unforgettable stays
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Over 2 million hotels at the best prices
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-accent font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              support@bookyourhotel.online
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right images */}
          <div className="hidden md:flex flex-col gap-4 absolute right-0 top-1/2 -translate-y-1/2">
            <div className={`${GALLERY_IMAGES[3].size} rounded-2xl overflow-hidden shadow-lg ml-auto animate-float-delayed`} style={{ transform: `rotate(${GALLERY_IMAGES[3].rotate})` }}>
              <Image src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} fill className="object-cover" sizes="200px" />
            </div>
            <div className={`${GALLERY_IMAGES[4].size} rounded-2xl overflow-hidden shadow-lg mr-8 animate-float`} style={{ transform: `rotate(${GALLERY_IMAGES[4].rotate})` }}>
              <Image src={GALLERY_IMAGES[4].src} alt={GALLERY_IMAGES[4].alt} fill className="object-cover" sizes="220px" />
            </div>
          </div>

          {/* Mobile: show 2 images flanking the card */}
          <div className="md:hidden absolute left-2 top-4 w-24 h-32 rounded-xl overflow-hidden shadow-lg opacity-60 -rotate-3">
            <Image src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} fill className="object-cover" sizes="96px" />
          </div>
          <div className="md:hidden absolute right-2 bottom-4 w-24 h-32 rounded-xl overflow-hidden shadow-lg opacity-60 rotate-3">
            <Image src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} fill className="object-cover" sizes="96px" />
          </div>
        </div>
      </div>
    </section>
  );
}
