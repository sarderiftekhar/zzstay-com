"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Star,
  Users,
  Bed,
  UtensilsCrossed,
  Wifi,
  Waves,
  Car,
  Dumbbell,
  Wind,
  Bath,
  ParkingCircle,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency, formatDate, getNightsCount } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

const FACILITY_ICONS: Array<{
  keywords: string[];
  icon: React.ElementType;
  label: string;
}> = [
  { keywords: ["free wifi", "wifi"], icon: Wifi, label: "Free WiFi" },
  { keywords: ["swimming pool", "pool"], icon: Waves, label: "Pool" },
  { keywords: ["restaurant"], icon: UtensilsCrossed, label: "Restaurant" },
  { keywords: ["parking"], icon: ParkingCircle, label: "Parking" },
  { keywords: ["air conditioning"], icon: Wind, label: "A/C" },
  { keywords: ["fitness", "gym"], icon: Dumbbell, label: "Fitness" },
  { keywords: ["spa", "wellness"], icon: Bath, label: "Spa" },
  { keywords: ["shuttle", "airport"], icon: Car, label: "Shuttle" },
];

function getTopFacilities(facilities: string[], max = 4) {
  const result: { icon: React.ElementType; label: string }[] = [];
  for (const entry of FACILITY_ICONS) {
    if (result.length >= max) break;
    const hasIt = facilities.some((f) =>
      entry.keywords.some((kw) => f.toLowerCase().includes(kw))
    );
    if (hasIt) result.push({ icon: entry.icon, label: entry.label });
  }
  return result;
}

interface PriceBreakdownProps {
  hotelName: string;
  hotelAddress?: string;
  hotelCity?: string;
  hotelCountry?: string;
  hotelStarRating?: number;
  hotelFacilities?: string[];
  roomName: string;
  boardName: string;
  checkIn: string;
  checkOut: string;
  currency: string;
  totalRate: number;
  cancellationPolicy: string;
  roomImage: string;
  adults?: number;
  children?: number;
}

export default function PriceBreakdown({
  hotelName,
  hotelAddress,
  hotelCity,
  hotelCountry,
  hotelStarRating,
  hotelFacilities,
  roomName,
  boardName,
  checkIn,
  checkOut,
  currency,
  totalRate,
  cancellationPolicy,
  roomImage,
  adults,
  children: childrenCount,
}: PriceBreakdownProps) {
  const t = useTranslations("booking");
  const nights = getNightsCount(checkIn, checkOut);
  const perNight = totalRate / (nights || 1);
  const topFacilities = hotelFacilities ? getTopFacilities(hotelFacilities) : [];
  const locationParts = [hotelAddress, hotelCity, hotelCountry].filter(Boolean);
  const isFreeCancellation =
    cancellationPolicy === "FREE_CANCELLATION" || cancellationPolicy === "REFUNDABLE";

  const totalGuests = (adults || 2) + (childrenCount || 0);

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden sticky top-24">
      {/* Room Image */}
      {roomImage && (
        <div className="relative h-44">
          <Image
            src={roomImage}
            alt={roomName}
            fill
            className="object-cover"
            sizes="400px"
          />
          {/* Star rating overlay */}
          {hotelStarRating && hotelStarRating > 0 && (
            <div className="absolute top-3 left-3 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
              {Array.from({ length: hotelStarRating }).map((_, i) => (
                <Star key={i} size={12} className="fill-star text-star" />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Hotel name & location */}
        <div>
          <h3
            className="text-lg font-bold text-text-primary leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {hotelName}
          </h3>
          {locationParts.length > 0 && (
            <div className="flex items-start gap-1.5 mt-1.5">
              <MapPin size={13} className="text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-text-muted leading-relaxed">
                {locationParts.join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Room details */}
        <div className="bg-bg-cream rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Bed size={14} className="text-accent shrink-0" />
            <span className="text-sm font-medium text-text-primary">{roomName}</span>
          </div>
          {boardName && (
            <Badge className="text-xs">{boardName}</Badge>
          )}
        </div>

        {/* Dates & Guests */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar size={14} className="text-accent shrink-0" />
            <span>
              {formatDate(checkIn, "MMM dd")} — {formatDate(checkOut, "MMM dd")}
            </span>
            <span className="text-text-muted text-xs">
              ({nights} night{nights !== 1 ? "s" : ""})
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Users size={14} className="text-accent shrink-0" />
            <span>
              {adults || 2} adult{(adults || 2) !== 1 ? "s" : ""}
              {childrenCount && childrenCount > 0
                ? `, ${childrenCount} child${childrenCount !== 1 ? "ren" : ""}`
                : ""}
              {" "}({totalGuests} guest{totalGuests !== 1 ? "s" : ""})
            </span>
          </div>
        </div>

        {/* Top facilities */}
        {topFacilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topFacilities.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-accent bg-accent/5 px-2 py-1 rounded-full"
              >
                <Icon size={11} />
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Price Summary */}
        <div className="border-t border-border pt-4 space-y-2">
          <h4 className="text-sm font-semibold text-text-primary">{t("priceSummary")}</h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              {t("roomRate")} x {nights} night{nights !== 1 ? "s" : ""}
            </span>
            <span className="text-text-primary font-medium">
              {formatCurrency(perNight * nights, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Taxes & fees</span>
            <span className="text-text-muted text-xs">Included</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="text-base font-bold text-text-primary">{t("total")}</span>
          <div className="text-right">
            <span className="text-xl font-bold text-accent">
              {formatCurrency(totalRate, currency)}
            </span>
            <p className="text-[11px] text-text-muted">
              {formatCurrency(perNight, currency)} / night
            </p>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="pt-1">
          <p className="text-xs text-text-muted mb-1">{t("cancellationPolicy")}:</p>
          <Badge
            variant={isFreeCancellation ? "success" : "warning"}
          >
            {isFreeCancellation ? "Free Cancellation" : "Non-Refundable"}
          </Badge>
        </div>

        {/* Security badge */}
        <div className="bg-accent -mx-5 px-5 -mb-5 pb-5 pt-4 rounded-b-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Secure Payment</p>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                Processed by Stripe. Your card details are encrypted and never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
