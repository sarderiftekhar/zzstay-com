"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MapPin, Star, Wifi, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency, getStarRatingText } from "@/lib/utils";
import { usePreferencesStore } from "@/store/preferencesStore";
import { useSearchStore } from "@/store/searchStore";
import FavoriteButton from "@/components/hotels/FavoriteButton";

interface HotelCardProps {
  hotel: {
    hotelId: string;
    name: string;
    starRating?: number;
    address?: string;
    city?: string;
    country?: string;
    main_photo?: string;
    hotelImages?: string[];
    minRate?: number;
    currency?: string;
    reviewScore?: number;
    reviewCount?: number;
    boardName?: string;
    cancellationPolicy?: string;
  };
}

function getRatingLabel(score: number) {
  if (score >= 9) return "Exceptional";
  if (score >= 8) return "Excellent";
  if (score >= 7) return "Very Good";
  if (score >= 6) return "Good";
  return "Pleasant";
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const t = useTranslations("common");
  const ts = useTranslations("search");
  const { currency } = usePreferencesStore();
  const { checkIn, checkOut } = useSearchStore();

  const displayCurrency = hotel.currency || currency;
  const ratingLabel = hotel.reviewScore ? (getStarRatingText(hotel.reviewScore) || getRatingLabel(hotel.reviewScore)) : "";
  const isFreeCancellation = hotel.cancellationPolicy === "FREE_CANCELLATION";

  // Build image list: main_photo first, then hotelImages (deduplicated)
  const images: string[] = [];
  if (hotel.main_photo) images.push(hotel.main_photo);
  if (hotel.hotelImages) {
    for (const img of hotel.hotelImages) {
      if (img && !images.includes(img)) images.push(img);
    }
  }
  const maxImages = Math.min(images.length, 5); // cap at 5 for performance
  const carouselImages = images.slice(0, maxImages);
  const hasCarousel = carouselImages.length > 1;

  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  const goPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  }, [carouselImages.length]);

  const goNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  }, [carouselImages.length]);

  return (
    <Link
      href={`/hotel/${hotel.hotelId}?checkIn=${checkIn}&checkOut=${checkOut}`}
      className="group block min-w-0"
    >
      <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 border border-border/40">
        <div className="flex flex-col sm:flex-row min-w-0">
          {/* Image Carousel */}
          <div
            className="relative w-full sm:w-60 lg:w-72 h-56 sm:h-auto sm:min-h-[260px] shrink-0 overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {carouselImages.length > 0 ? (
              <>
                {/* Stacked images — only active one is visible */}
                {carouselImages.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt={`${hotel.name} - ${i + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      i === imgIdx ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 640px) 100vw, 256px"
                    priority={i === 0}
                  />
                ))}

                {/* Prev/Next arrows — visible on hover */}
                {hasCarousel && hovered && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all z-10 cursor-pointer"
                    >
                      <ChevronLeft size={16} className="text-text-primary" />
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all z-10 cursor-pointer"
                    >
                      <ChevronRight size={16} className="text-text-primary" />
                    </button>
                  </>
                )}

                {/* Dot indicators */}
                {hasCarousel && (
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                    {carouselImages.map((_, i) => (
                      <span
                        key={i}
                        className={`block rounded-full transition-all duration-200 ${
                          i === imgIdx
                            ? "w-2 h-2 bg-white"
                            : "w-1.5 h-1.5 bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-linear-to-br from-accent/10 via-accent/5 to-bg-cream flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin size={20} className="text-accent/40" />
                </div>
                <span className="text-text-muted/60 text-xs">{ts("photoUnavailable")}</span>
              </div>
            )}

            {/* Wishlist button */}
            <FavoriteButton
              hotelId={hotel.hotelId}
              hotelName={hotel.name}
              hotelImage={hotel.main_photo || hotel.hotelImages?.[0]}
              hotelAddress={hotel.address}
              hotelStarRating={hotel.starRating}
              hotelCity={hotel.city}
              hotelCountry={hotel.country}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200 z-10"
            />

            {/* Free cancellation badge on image */}
            {isFreeCancellation && (
              <div className="absolute bottom-3 left-3 bg-success/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-full z-10">
                {ts("freeCancellationLabel")}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 p-5 sm:p-6 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              {/* Left: Hotel info */}
              <div className="flex-1 min-w-0">
                {/* Name + Stars */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3
                    className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors duration-200 leading-tight"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {hotel.name}
                  </h3>
                  {hotel.starRating && hotel.starRating > 0 && (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-star text-star" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Location */}
                {(hotel.city || hotel.address) && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
                    <MapPin size={13} className="text-accent shrink-0" />
                    <span className="truncate">
                      {hotel.address ? `${hotel.address}, ` : ""}
                      {hotel.city}
                      {hotel.country ? `, ${hotel.country}` : ""}
                    </span>
                    <span className="text-accent font-bold hover:underline ml-1 shrink-0 cursor-pointer">
                      {ts("showOnMap")}
                    </span>
                  </div>
                )}

                {/* Amenity tags */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/8 px-3 py-1.5 rounded-full">
                    <Wifi size={12} />
                    {ts("freeWifi")}
                  </span>
                  {hotel.boardName && hotel.boardName !== "Room Only" && (
                    <span className="text-xs font-medium text-text-primary bg-bg-cream px-3 py-1.5 rounded-full">
                      {hotel.boardName}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Review score — full circle, light teal bg */}
              {hotel.reviewScore && hotel.reviewScore > 0 && (
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <p className="text-xs font-bold text-text-primary">{ratingLabel}</p>
                      {hotel.reviewCount && (
                        <p className="text-[11px] text-text-muted font-medium">
                          {hotel.reviewCount.toLocaleString()} {ts("reviewsLabel")}
                        </p>
                      )}
                    </div>
                    <span className="bg-accent-bright/15 text-accent text-sm font-bold w-11 h-11 rounded-full flex items-center justify-center">
                      {hotel.reviewScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom: Price + CTA */}
            <div className="mt-auto pt-4 flex items-end justify-end gap-4 border-t border-border/30">
              {hotel.minRate !== undefined && hotel.minRate > 0 && (
                <div className="text-right">
                  <p className="text-xs text-text-muted">{ts("fromLabel")}</p>
                  <p className="text-2xl font-bold text-text-primary leading-tight">
                    {formatCurrency(hotel.minRate, displayCurrency)}
                  </p>
                  <p className="text-xs text-text-muted">{t("perNight")}</p>
                </div>
              )}
              <span className="bg-accent group-hover:bg-accent-hover active:scale-95 text-white text-sm font-bold px-6 py-3.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap inline-block">
                {ts("showPrices")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
