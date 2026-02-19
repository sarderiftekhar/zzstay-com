"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import {
  MapPin,
  Clock,
  Star,
  Wifi,
  Waves,
  UtensilsCrossed,
  Car,
  Wind,
  Dumbbell,
  Bath,
  ParkingCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  LocateFixed,
  Bed,
  MessageSquareText,
  LayoutGrid,
  Building,
  FileText,
} from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { useBookingStore } from "@/store/bookingStore";
import { usePreferencesStore } from "@/store/preferencesStore";
import { getStarRatingText, formatCurrency } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";
import HotelGallery from "@/components/hotels/HotelGallery";
import AmenitiesList from "@/components/hotels/AmenitiesList";
import ReviewCard from "@/components/hotels/ReviewCard";
import HotelMap from "@/components/hotels/HotelMap";
import Spinner from "@/components/ui/Spinner";
import StickyTabNav, { type TabSection } from "@/components/hotels/StickyTabNav";
import MobileBookingBar from "@/components/hotels/MobileBookingBar";
import SmartHighlights from "@/components/hotels/SmartHighlights";
import ReviewHighlights from "@/components/hotels/ReviewHighlights";
import ReviewFilters from "@/components/hotels/ReviewFilters";
import RoomSection from "@/components/hotels/RoomSection";
import FavoriteButton from "@/components/hotels/FavoriteButton";

interface HotelData {
  id: string;
  name: string;
  hotelDescription: string;
  starRating: number;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  checkinTime: string;
  checkoutTime: string;
  facilities: string[];
  images: string[];
  reviewScore?: number;
  reviewCount?: number;
}

interface RoomData {
  offerId: string;
  roomName: string;
  boardName: string;
  currency: string;
  retailRate: number;
  originalRate?: number;
  maxOccupancy?: number;
  images?: string[];
  cancellationPolicy?: {
    refundableTag?: string;
  };
}

interface ReviewData {
  guestName?: string;
  rating?: number;
  title?: string;
  comment?: string;
  date?: string;
  country?: string;
  type?: string;
}

const QUICK_AMENITY_MAP: Array<{ keywords: string[]; icon: React.ElementType; label: string }> = [
  { keywords: ["free wifi"], icon: Wifi, label: "Free WiFi" },
  { keywords: ["swimming pool", "pool"], icon: Waves, label: "Pool" },
  { keywords: ["restaurant"], icon: UtensilsCrossed, label: "Restaurant" },
  { keywords: ["parking"], icon: ParkingCircle, label: "Parking" },
  { keywords: ["air conditioning"], icon: Wind, label: "A/C" },
  { keywords: ["fitness", "gym"], icon: Dumbbell, label: "Fitness" },
  { keywords: ["spa", "wellness"], icon: Bath, label: "Spa" },
  { keywords: ["shuttle", "airport"], icon: Car, label: "Shuttle" },
];

function getQuickAmenities(facilities: string[]) {
  const result: { icon: React.ElementType; label: string }[] = [];
  for (const entry of QUICK_AMENITY_MAP) {
    if (result.length >= 6) break;
    const hasIt = facilities.some((f) =>
      entry.keywords.some((kw) => f.toLowerCase().includes(kw))
    );
    if (hasIt) result.push({ icon: entry.icon, label: entry.label });
  }
  return result;
}

const SECTION_IDS = [
  "section-overview",
  "section-facilities",
  "section-rooms",
  "section-reviews",
  "section-description",
  "section-location",
];

export default function HotelDetailPage() {
  return (
    <Suspense fallback={<div className="pt-20 min-h-screen flex items-center justify-center"><Spinner size={40} /></div>}>
      <HotelDetailPageInner />
    </Suspense>
  );
}

function HotelDetailPageInner() {
  const t = useTranslations("hotel");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = params.id as string;
  const { checkIn, checkOut, adults, children, location } = useSearchStore();
  const { currency } = usePreferencesStore();
  const { setSelectedRoom } = useBookingStore();

  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [descExpanded, setDescExpanded] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [reviewSort, setReviewSort] = useState<"newest" | "highest" | "lowest">("newest");
  const [travelerFilter, setTravelerFilter] = useState<string | null>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const REVIEWS_PER_PAGE = 6;

  // Active search params for room section (can be updated by inline search)
  const [activeCheckIn, setActiveCheckIn] = useState(searchParams.get("checkIn") || checkIn);
  const [activeCheckOut, setActiveCheckOut] = useState(searchParams.get("checkOut") || checkOut);
  const [activeAdults, setActiveAdults] = useState(adults);
  const [activeChildren, setActiveChildren] = useState(children);

  const activeSection = useActiveSection(SECTION_IDS);

  useEffect(() => {
    async function fetchHotel() {
      setLoading(true);
      try {
        const ci = searchParams.get("checkIn") || checkIn;
        const co = searchParams.get("checkOut") || checkOut;

        const [hotelRes, reviewsRes, ratesRes] = await Promise.all([
          fetch(`/api/hotels/${hotelId}`),
          fetch(`/api/reviews?hotelId=${hotelId}&limit=50`),
          fetch(`/api/hotels/${hotelId}/rates?checkIn=${encodeURIComponent(ci)}&checkOut=${encodeURIComponent(co)}&adults=${adults}&children=${children || 0}&currency=${currency}`),
        ]);

        const hotelData = await hotelRes.json();
        const reviewsData = await reviewsRes.json();
        const ratesData = await ratesRes.json();

        if (hotelData.data) {
          const d = hotelData.data;

          const imageUrls: string[] = [];
          if (Array.isArray(d.hotelImages)) {
            d.hotelImages.forEach((img: { url?: string; urlHd?: string } | string) => {
              if (typeof img === "string") {
                imageUrls.push(img);
              } else if (img.urlHd) {
                imageUrls.push(img.urlHd);
              } else if (img.url) {
                imageUrls.push(img.url);
              }
            });
          }
          if (imageUrls.length === 0 && d.main_photo) {
            imageUrls.push(d.main_photo);
          }

          const loc = d.location || {};
          const times = d.checkinCheckoutTimes || {};

          let facilityList: string[] = [];
          if (Array.isArray(d.hotelFacilities) && d.hotelFacilities.length > 0) {
            facilityList = d.hotelFacilities.map((f: string | { name: string }) =>
              typeof f === "string" ? f : f.name
            );
          } else if (Array.isArray(d.facilities)) {
            facilityList = d.facilities.map((f: string | { name: string }) =>
              typeof f === "string" ? f : f.name
            );
          }

          setHotel({
            id: d.id || hotelId,
            name: d.name || "Hotel",
            hotelDescription: d.hotelDescription || d.description || "",
            starRating: d.starRating || 0,
            address: d.address || "",
            city: d.city || "",
            country: d.country || "",
            latitude: d.latitude || loc.latitude || 0,
            longitude: d.longitude || loc.longitude || 0,
            checkinTime: times.checkin_start || d.checkinTime || "15:00",
            checkoutTime: times.checkout || d.checkoutTime || "11:00",
            facilities: facilityList,
            images: imageUrls,
            reviewScore: d.rating ?? d.reviewScore,
            reviewCount: d.reviewCount,
          });
        }

        if (reviewsData.data && Array.isArray(reviewsData.data)) {
          const mapped: ReviewData[] = reviewsData.data.map((r: Record<string, unknown>) => {
            const pros = (r.pros as string) || "";
            const cons = (r.cons as string) || "";
            const comment = [pros, cons ? `Cons: ${cons}` : ""].filter(Boolean).join(" ") || (r.headline as string) || "";

            return {
              guestName: (r.name as string) || (r.guestName as string),
              rating: (r.averageScore as number) ?? (r.rating as number),
              title: (r.headline as string) || (r.title as string),
              comment,
              date: r.date ? new Date(r.date as string).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : undefined,
              country: r.country ? (r.country as string).toUpperCase() : undefined,
              type: (r.type as string)?.replace(/_/g, " "),
            };
          });
          setReviews(mapped);
        }

        setRooms(parseRatesResponse(ratesData));
      } catch (error) {
        console.error("Failed to load hotel:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHotel();
  }, [hotelId, currency]);

  function handleSelectRoom(offerId: string) {
    const room = rooms.find((r) => r.offerId === offerId);
    if (!room || !hotel) return;

    setSelectedRoom({
      offerId,
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomName: room.roomName,
      boardName: room.boardName,
      checkIn: activeCheckIn,
      checkOut: activeCheckOut,
      currency: room.currency,
      totalRate: room.retailRate,
      cancellationPolicy: room.cancellationPolicy?.refundableTag || "NON_REFUNDABLE",
      maxOccupancy: room.maxOccupancy || 2,
      roomImage: room.images?.[0] || hotel.images?.[0] || "",
    });

    router.push("/checkout");
  }

  function scrollToRooms() {
    document.getElementById("section-rooms")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToReviews() {
    document.getElementById("section-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function parseRatesResponse(ratesData: Record<string, unknown>): RoomData[] {
    if (!ratesData.data) return [];
    const rateHotels = Array.isArray(ratesData.data) ? ratesData.data : [ratesData.data];
    if (rateHotels.length === 0) return [];

    const hotelRates = rateHotels[0] as Record<string, unknown>;
    const roomTypes = (hotelRates.roomTypes || hotelRates.rooms || []) as Array<Record<string, unknown>>;
    const parsedRooms: RoomData[] = [];

    if (Array.isArray(roomTypes)) {
      roomTypes.forEach((rt) => {
        const offerId = rt.offerId as string;
        const rates = (rt.rates || []) as Array<Record<string, unknown>>;
        const offerRetail = rt.offerRetailRate as { amount?: number; currency?: string } | undefined;
        const roomImages = (rt.images || []) as Array<{ url?: string; urlHd?: string } | string>;

        const imgUrls: string[] = [];
        if (Array.isArray(roomImages)) {
          roomImages.forEach((img) => {
            if (typeof img === "string") imgUrls.push(img);
            else if (img.urlHd) imgUrls.push(img.urlHd);
            else if (img.url) imgUrls.push(img.url);
          });
        }

        rates.forEach((rate) => {
          const retailTotal = (rate.retailRate as Record<string, unknown>)?.total as Array<{ amount: number; currency: string }> | undefined;
          const suggestedPrice = (rate.retailRate as Record<string, unknown>)?.suggestedSellingPrice as Array<{ amount: number; currency: string }> | undefined;
          const price = offerRetail?.amount ?? retailTotal?.[0]?.amount;
          const originalPrice = suggestedPrice?.[0]?.amount;
          const cur = offerRetail?.currency ?? retailTotal?.[0]?.currency ?? currency;

          parsedRooms.push({
            offerId: offerId || `room-${parsedRooms.length}`,
            roomName: (rate.name as string) || "Room",
            boardName: (rate.boardName as string) || (rate.boardType as string) || "Room Only",
            currency: cur,
            retailRate: price || 0,
            originalRate: originalPrice,
            maxOccupancy: (rate.maxOccupancy as number) || 2,
            images: imgUrls.length > 0 ? imgUrls : undefined,
            cancellationPolicy: rate.cancellationPolicies as RoomData["cancellationPolicy"],
          });
        });
      });
    }
    return parsedRooms;
  }

  async function handleRoomSearch(params: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  }) {
    const res = await fetch(
      `/api/hotels/${hotelId}/rates?checkIn=${encodeURIComponent(params.checkIn)}&checkOut=${encodeURIComponent(params.checkOut)}&adults=${params.adults}&children=${params.children}&currency=${currency}`
    );
    const data = await res.json();
    const newRooms = parseRatesResponse(data);
    setRooms(newRooms);
    setActiveCheckIn(params.checkIn);
    setActiveCheckOut(params.checkOut);
    setActiveAdults(params.adults);
    setActiveChildren(params.children);
  }

  const filteredReviews = useMemo(() => {
    // Reset to page 1 whenever filters/sort change
    setReviewPage(1);
    let result = [...reviews];
    if (travelerFilter) {
      result = result.filter((r) => r.type === travelerFilter);
    }
    switch (reviewSort) {
      case "newest":
        result.sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        break;
      case "highest":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "lowest":
        result.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
        break;
    }
    return result;
  }, [reviews, reviewSort, travelerFilter]);

  const totalReviewPages = Math.max(1, Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE));
  const paginatedReviews = filteredReviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE
  );

  const availableTravelerTypes = useMemo(() => {
    const types = new Set<string>();
    reviews.forEach((r) => {
      if (r.type) types.add(r.type);
    });
    return Array.from(types);
  }, [reviews]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <p className="text-text-muted">{t("notFound")}</p>
      </div>
    );
  }

  const quickAmenities = getQuickAmenities(hotel.facilities);
  const ratingLabel = hotel.reviewScore ? getStarRatingText(hotel.reviewScore) : "";
  const descriptionText = hotel.hotelDescription.replace(/<[^>]*>/g, "");
  const isLongDesc = descriptionText.length > 400;
  const lowestPrice = rooms.length > 0 ? Math.min(...rooms.map((r) => r.retailRate)) : 0;
  const roomCurrency = rooms[0]?.currency || currency;

  const tabSections: TabSection[] = [
    { id: "section-overview", label: "overview", icon: LayoutGrid },
    { id: "section-facilities", label: "facilities", icon: Building, count: hotel.facilities.length },
    { id: "section-rooms", label: "rooms", icon: Bed, count: rooms.length },
    { id: "section-reviews", label: "reviews", icon: MessageSquareText, count: reviews.length },
    { id: "section-description", label: "description", icon: FileText },
    { id: "section-location", label: "location", icon: MapPin },
  ];

  return (
    <div className="pt-20 min-h-screen bg-white pb-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link href="/" className="hover:text-accent transition-colors">
            {t("breadcrumbHome")}
          </Link>
          <ChevronRight size={12} />
          {location && (
            <>
              <span className="text-text-secondary">
                {t("breadcrumbHotels", { location })}
              </span>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-text-primary font-medium truncate max-w-[200px]">
            {hotel.name}
          </span>
        </nav>

        {/* Gallery */}
        <HotelGallery images={hotel.images} hotelName={hotel.name} />

        {/* Hotel Header */}
        <div className="mt-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-2">
              {hotel.starRating > 0 && (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-star text-star" />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3">
                <h1
                  className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {hotel.name}
                </h1>
                <FavoriteButton
                  hotelId={hotel.id}
                  hotelName={hotel.name}
                  hotelImage={hotel.images?.[0]}
                  hotelAddress={hotel.address}
                  hotelStarRating={hotel.starRating}
                  hotelCity={hotel.city}
                  hotelCountry={hotel.country}
                  className="w-10 h-10 rounded-full border border-border hover:border-red-200 hover:bg-red-50 transition-all duration-200 shrink-0"
                />
              </div>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="shrink-0" />
                  {hotel.address}{hotel.city ? `, ${hotel.city}` : ""}{hotel.country ? `, ${hotel.country}` : ""}
                </span>
                {hotel.latitude !== 0 && hotel.longitude !== 0 && (
                  <>
                    <span className="text-border">&middot;</span>
                    <button
                      onClick={() => setMapOpen(true)}
                      className="text-accent font-medium hover:text-accent-hover underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      {t("showMap")}
                    </button>
                  </>
                )}
                <span className="hidden sm:inline text-border">|</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="shrink-0" />
                  {t("checkInTime", { time: hotel.checkinTime })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="shrink-0" />
                  {t("checkOutTime", { time: hotel.checkoutTime })}
                </span>
              </div>
            </div>

            {hotel.reviewScore !== undefined && hotel.reviewCount !== undefined && hotel.reviewScore > 0 && (
              <button
                onClick={scrollToReviews}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-accent/20 hover:bg-bg-cream/50 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <div className="bg-accent text-white text-xl font-bold w-12 h-12 rounded-lg flex items-center justify-center">
                  {hotel.reviewScore.toFixed(1)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-text-primary">{ratingLabel}</p>
                  <p className="text-xs text-text-muted">
                    {hotel.reviewCount.toLocaleString()} review{hotel.reviewCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </button>
            )}
          </div>

          {quickAmenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {quickAmenities.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/5 px-3 py-1.5 rounded-full transition-colors duration-200 hover:bg-accent/10"
                >
                  <Icon size={13} />
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Tab Nav */}
        <StickyTabNav
          activeSection={activeSection}
          sections={tabSections}
          lowestPrice={lowestPrice}
          currency={roomCurrency}
          onSelectRoom={scrollToRooms}
        />

        {/* Section: Overview / Smart Highlights */}
        <div id="section-overview" className="scroll-mt-[130px] pt-8 space-y-8">
          <SmartHighlights
            hotelName={hotel.name}
            description={hotel.hotelDescription}
            facilities={hotel.facilities}
            starRating={hotel.starRating}
            city={hotel.city}
          />
        </div>

        {/* Section: Property Description */}
        <div id="section-description" className="scroll-mt-[130px] pt-10">
          <div className="bg-white rounded-xl border border-border p-6 transition-shadow duration-200 hover:shadow-sm">
            <h2
              className="text-xl font-bold text-text-primary mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t("propertyDescription")}
            </h2>
            <div className="relative">
              <div
                className={`prose prose-sm text-text-secondary leading-relaxed max-w-none ${!descExpanded && isLongDesc ? "max-h-[250px] overflow-hidden" : ""}`}
                dangerouslySetInnerHTML={{ __html: hotel.hotelDescription }}
              />
              {isLongDesc && !descExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-white to-transparent" />
              )}
            </div>
            {isLongDesc && (
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="flex items-center gap-1 mt-3 text-sm font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer"
              >
                {descExpanded ? t("showLess") : t("readMore")}
                <ChevronDown size={14} className={`transition-transform ${descExpanded ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </div>

        {/* Section: Popular Facilities */}
        <div id="section-facilities" className="scroll-mt-[130px] pt-10">
          {hotel.facilities.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="text-xl font-bold text-text-primary"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {t("popularFacilities")}
                </h2>
                <button
                  onClick={() => document.getElementById("facilities-full")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="text-sm font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer"
                >
                  {t("seeAllFacilities")} &rarr;
                </button>
              </div>
              <AmenitiesList amenities={hotel.facilities} compact />
            </div>
          )}
        </div>

        {/* Section: Review Highlights */}
        {hotel.reviewScore !== undefined && hotel.reviewCount !== undefined && hotel.reviewScore > 0 && (
          <div className="pt-10">
            <ReviewHighlights
              score={hotel.reviewScore}
              count={hotel.reviewCount}
              reviews={reviews}
              onReadAll={scrollToReviews}
            />
          </div>
        )}

        {/* Section: Rooms */}
        <div id="section-rooms" className="scroll-mt-[130px] pt-10">
          <RoomSection
            rooms={rooms}
            hotelImages={hotel.images}
            checkIn={activeCheckIn}
            checkOut={activeCheckOut}
            adults={activeAdults}
            children={activeChildren}
            hotelName={hotel.name}
            onSelectRoom={handleSelectRoom}
            onSearchChange={handleRoomSearch}
          />
        </div>

        {/* Section: Guest Reviews */}
        <div id="section-reviews" className="scroll-mt-[130px] pt-10">
          <h2
            className="text-xl font-bold text-text-primary mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("guestReviews")}
          </h2>

          {hotel.reviewScore !== undefined && hotel.reviewCount !== undefined && hotel.reviewScore > 0 && (
            <div className="flex items-center gap-5 mb-6 pb-5 border-b border-border">
              <div className="bg-accent text-white text-3xl font-bold w-16 h-16 rounded-xl flex items-center justify-center">
                {hotel.reviewScore.toFixed(1)}
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{ratingLabel}</p>
                <p className="text-sm text-text-muted">
                  {t("basedOnReviews", { count: hotel.reviewCount.toLocaleString() })}
                </p>
              </div>
            </div>
          )}

          {reviews.length > 0 ? (
            <>
              <ReviewFilters
                sortOrder={reviewSort}
                travelerFilter={travelerFilter}
                availableTypes={availableTravelerTypes}
                onSortChange={setReviewSort}
                onFilterChange={setTravelerFilter}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedReviews.map((review, idx) => (
                  <ReviewCard key={`${reviewPage}-${idx}`} review={review} />
                ))}
              </div>
              {filteredReviews.length === 0 && (
                <p className="text-text-muted text-center py-8">
                  No reviews match the selected filter.
                </p>
              )}

              {/* Pagination */}
              {totalReviewPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-8">
                  <button
                    onClick={() => {
                      setReviewPage((p) => Math.max(1, p - 1));
                      document.getElementById("section-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    disabled={reviewPage === 1}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bg-cream active:scale-95"
                  >
                    <ChevronLeft size={18} className="text-text-secondary" />
                  </button>

                  {Array.from({ length: totalReviewPages }, (_, i) => i + 1)
                    .filter((p) => {
                      // Show first, last, and pages near current
                      if (p === 1 || p === totalReviewPages) return true;
                      if (Math.abs(p - reviewPage) <= 1) return true;
                      return false;
                    })
                    .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("ellipsis");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, i) =>
                      item === "ellipsis" ? (
                        <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center text-text-muted text-sm">
                          &hellip;
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => {
                            setReviewPage(item as number);
                            document.getElementById("section-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className={`w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 ${
                            reviewPage === item
                              ? "bg-accent text-white"
                              : "text-text-secondary hover:bg-bg-cream"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => {
                      setReviewPage((p) => Math.min(totalReviewPages, p + 1));
                      document.getElementById("section-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    disabled={reviewPage === totalReviewPages}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bg-cream active:scale-95"
                  >
                    <ChevronRight size={18} className="text-text-secondary" />
                  </button>

                  <span className="ml-3 text-xs text-text-muted">
                    {(reviewPage - 1) * REVIEWS_PER_PAGE + 1}–{Math.min(reviewPage * REVIEWS_PER_PAGE, filteredReviews.length)} of {filteredReviews.length}
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className="text-text-muted text-center py-8">
              {t("noReviews")}
            </p>
          )}
        </div>

        {/* Full Facilities */}
        {hotel.facilities.length > 0 && (
          <div id="facilities-full" className="scroll-mt-[130px] pt-10">
            <AmenitiesList amenities={hotel.facilities} hotelName={hotel.name} />
          </div>
        )}

        {/* Section: Location / Inline Map */}
        <div id="section-location" className="scroll-mt-[130px] pt-10 pb-8">
          <h2
            className="text-xl font-bold text-text-primary mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("location")}
          </h2>

          {hotel.latitude !== 0 && hotel.longitude !== 0 && (
            <div className="rounded-xl overflow-hidden border border-border">
              <HotelMap
                compact
                hotels={[{
                  hotelId: hotel.id,
                  name: hotel.name,
                  latitude: hotel.latitude,
                  longitude: hotel.longitude,
                }]}
                center={{ lat: hotel.latitude, lng: hotel.longitude }}
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <MapPin size={14} className="text-accent" />
              {hotel.address}{hotel.city ? `, ${hotel.city}` : ""}{hotel.country ? `, ${hotel.country}` : ""}
            </div>
            {hotel.latitude !== 0 && hotel.longitude !== 0 && (
              <button
                onClick={() => setMapOpen(true)}
                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors cursor-pointer"
              >
                {t("viewLargerMap")} &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Booking Bar */}
      {lowestPrice > 0 && (
        <MobileBookingBar
          lowestPrice={lowestPrice}
          currency={roomCurrency}
          onSelectRoom={scrollToRooms}
        />
      )}

      {/* Fullscreen Map Overlay */}
      {mapOpen && hotel.latitude !== 0 && hotel.longitude !== 0 && (
        <div className="fixed inset-0 z-200 bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-white shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={16} className="text-accent shrink-0" />
              <p className="text-sm font-medium text-text-primary truncate">
                {hotel.name}
              </p>
              <span className="text-xs text-text-muted hidden sm:inline">
                — {hotel.address}{hotel.city ? `, ${hotel.city}` : ""}
              </span>
            </div>
            <button
              onClick={() => setMapOpen(false)}
              className="p-2 rounded-lg hover:bg-bg-cream transition-all duration-200 shrink-0 cursor-pointer hover:scale-110 active:scale-95"
            >
              <X size={20} className="text-text-secondary" />
            </button>
          </div>

          <div className="flex-1 relative">
            <HotelMap
              hotels={[{
                hotelId: hotel.id,
                name: hotel.name,
                latitude: hotel.latitude,
                longitude: hotel.longitude,
              }]}
              center={{ lat: hotel.latitude, lng: hotel.longitude }}
            />
            <button
              onClick={() => {
                setMapOpen(false);
                setTimeout(() => setMapOpen(true), 50);
              }}
              className="absolute bottom-6 left-4 flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-lg border border-border text-sm font-medium text-text-primary hover:bg-bg-cream transition-all duration-200 cursor-pointer hover:shadow-xl active:scale-95"
            >
              <LocateFixed size={16} className="text-accent" />
              Re-center
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
