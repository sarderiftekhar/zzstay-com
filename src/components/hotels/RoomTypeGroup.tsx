"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Users,
  Check,
  X,
  BedDouble,
  BedSingle,
  CigaretteOff,
  Accessibility,
  Mountain,
  Waves,
  Building,
  type LucideIcon,
} from "lucide-react";
import { formatCurrency, isRefundablePolicy } from "@/lib/utils";

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

interface RoomTypeGroupProps {
  roomName: string;
  rates: RoomData[];
  fallbackImages: string[];
  onSelectRoom: (offerId: string) => void;
  /** When true, renders <tr> rows for a unified table (desktop). */
  asTableRows?: boolean;
}

interface RoomFeature {
  icon: LucideIcon;
  label: string;
}

function parseRoomFeatures(name: string): RoomFeature[] {
  const lower = name.toLowerCase();
  const features: RoomFeature[] = [];

  // Bed type detection
  if (/\bking\b/.test(lower)) {
    const count = lower.match(/(\d+)\s*king/)?.[1] || "1";
    features.push({ icon: BedDouble, label: `${count} King Bed${count !== "1" ? "s" : ""}` });
  } else if (/\bqueen\b/.test(lower)) {
    const count = lower.match(/(\d+)\s*queen/)?.[1] || "1";
    features.push({ icon: BedDouble, label: `${count} Queen Bed${count !== "1" ? "s" : ""}` });
  } else if (/\bdouble\b/.test(lower)) {
    const count = lower.match(/(\d+)\s*double/)?.[1] || "1";
    features.push({ icon: BedDouble, label: `${count} Double Bed${count !== "1" ? "s" : ""}` });
  } else if (/\btwin\b/.test(lower)) {
    features.push({ icon: BedSingle, label: "2 Single Beds" });
  } else if (/\bsingle\b/.test(lower)) {
    features.push({ icon: BedSingle, label: "1 Single Bed" });
  } else if (/\bbed\b/.test(lower)) {
    features.push({ icon: BedDouble, label: "Bed" });
  }

  // Smoking status
  if (/non[- ]?smoking/.test(lower) || /no[- ]?smoking/.test(lower)) {
    features.push({ icon: CigaretteOff, label: "Non-Smoking" });
  }

  // View
  if (/sea\s*view|ocean\s*view/.test(lower)) {
    features.push({ icon: Waves, label: "Sea View" });
  } else if (/mountain\s*view/.test(lower)) {
    features.push({ icon: Mountain, label: "Mountain View" });
  } else if (/city\s*view/.test(lower)) {
    features.push({ icon: Building, label: "City View" });
  } else if (/garden\s*view|pool\s*view|park\s*view/.test(lower)) {
    features.push({ icon: Mountain, label: lower.match(/(garden|pool|park)\s*view/i)?.[0] || "View" });
  }

  // Accessibility
  if (/accessible|wheelchair|disability|mobility/.test(lower)) {
    features.push({ icon: Accessibility, label: "Accessible" });
  }

  return features;
}

export default function RoomTypeGroup({
  roomName,
  rates,
  onSelectRoom,
  asTableRows,
}: RoomTypeGroupProps) {
  const t = useTranslations("hotel");
  const [expanded, setExpanded] = useState(false);

  const maxOccupancy = rates[0]?.maxOccupancy;

  const uniqueRates = deduplicateRates(rates);
  const visibleRates = expanded ? uniqueRates : uniqueRates.slice(0, 3);
  const hasMore = uniqueRates.length > 3;

  const bestRate = rates.reduce((min, r) => (r.retailRate < min.retailRate ? r : min), rates[0]);
  const roomFeatures = parseRoomFeatures(roomName);

  // --- Desktop table rows mode ---
  if (asTableRows) {
    const totalRows = visibleRates.length + (hasMore ? 1 : 0);

    return (
      <>
        {visibleRates.map((rate, idx) => {
          const isRefundable = isRefundablePolicy(rate.cancellationPolicy?.refundableTag);
          const discount = rate.originalRate && rate.originalRate > rate.retailRate ? Math.round((1 - rate.retailRate / rate.originalRate) * 100) : 0;
          const isFirst = idx === 0;

          return (
            <tr
              key={rate.offerId || idx}
              className={`hover:bg-accent/3 transition-all duration-200 cursor-pointer border-b border-border/20`}
              onClick={() => onSelectRoom(rate.offerId)}
            >
              {/* Room Type cell — spans all rows */}
              {isFirst && (
                <td className="pl-8 pr-5 py-9 align-top border-r border-border/20" rowSpan={totalRows}>
                  <h3 className="text-lg font-bold text-text-primary leading-snug mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                    {roomName}
                  </h3>
                  {roomFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {roomFeatures.map((feat) => {
                        const FeatIcon = feat.icon;
                        return (
                          <span
                            key={feat.label}
                            className="inline-flex items-center gap-2 text-sm text-text-secondary bg-bg-cream/80 px-3 py-1.5 rounded-lg"
                          >
                            <FeatIcon size={15} className="text-accent shrink-0" />
                            {feat.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <div className="mt-2 pt-3 border-t border-border/30">
                    <span className="text-xs text-text-muted">{t("from")}</span>
                    <p className="text-xl font-bold text-text-primary leading-tight mt-0.5">
                      {formatCurrency(bestRate.retailRate, bestRate.currency)}
                    </p>
                    <span className="text-xs text-text-muted">{t("perNight")}</span>
                  </div>
                </td>
              )}

              {/* Max Guests cell — spans all rows */}
              {isFirst && (
                <td className="px-4 py-9 text-center align-middle border-r border-border/20" rowSpan={totalRows}>
                  {maxOccupancy && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                      <Users size={15} className="text-accent shrink-0" />
                      {maxOccupancy} {maxOccupancy === 1 ? "guest" : "guests"}
                    </span>
                  )}
                </td>
              )}

              {/* Options: board type + cancellation */}
              <td className="px-4 py-9 text-center align-middle border-r border-border/20">
                <p className="text-sm font-medium text-text-primary">{rate.boardName}</p>
                {isRefundable ? (
                  <span className="inline-flex items-center gap-1 text-xs text-success font-medium mt-1">
                    <Check size={12} />
                    {t("freeCancellation")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-text-muted mt-1">
                    <X size={12} />
                    {t("nonRefundable")}
                  </span>
                )}
              </td>

              {/* Price + CTA */}
              <td className="px-4 py-9 text-center align-middle">
                {discount > 0 && (
                  <p className="text-[11px] text-text-muted line-through">
                    {formatCurrency(rate.originalRate!, rate.currency)}
                  </p>
                )}
                <p className="text-lg font-bold text-text-primary">
                  {formatCurrency(rate.retailRate, rate.currency)}
                </p>
                <p className="text-[10px] text-text-muted mb-3">{t("includesTaxes")}</p>
                <button
                  onClick={() => onSelectRoom(rate.offerId)}
                  className="bg-accent hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 hover:scale-105 text-white text-sm font-bold px-6 py-3 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95"
                >
                  {t("chooseRoom")}
                </button>
              </td>
            </tr>
          );
        })}

        {/* Show more / less row */}
        {hasMore && (
          <tr>
            <td colSpan={3} className="text-center py-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-medium text-accent hover:text-accent-hover cursor-pointer"
              >
                {expanded ? t("showLess") : `+${uniqueRates.length - 3} more options`}
              </button>
            </td>
          </tr>
        )}
      </>
    );
  }

  // --- Mobile card mode (no image) ---
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="p-4">
        <h3 className="text-base font-bold text-text-primary mb-1" style={{ fontFamily: "var(--font-playfair)" }}>{roomName}</h3>
        {roomFeatures.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {roomFeatures.map((feat) => {
              const FeatIcon = feat.icon;
              return (
                <span
                  key={feat.label}
                  className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary bg-bg-cream/80 px-2.5 py-1 rounded-lg"
                >
                  <FeatIcon size={14} className="text-accent shrink-0" />
                  {feat.label}
                </span>
              );
            })}
          </div>
        )}
        {maxOccupancy && <span className="flex items-center gap-1 text-xs text-text-muted mb-2"><Users size={12} />{t("maxGuests", { count: maxOccupancy })}</span>}
        <div className="flex items-end gap-1 mb-3">
          <span className="text-[11px] text-text-muted">{t("from")}</span>
          <span className="text-lg font-bold text-text-primary leading-none">{formatCurrency(bestRate.retailRate, bestRate.currency)}</span>
          <span className="text-[11px] text-text-muted">{t("perNight")}</span>
        </div>
        <div className="space-y-0">
          {visibleRates.map((rate, idx) => {
            const isRefundable = isRefundablePolicy(rate.cancellationPolicy?.refundableTag);
            const discount = rate.originalRate && rate.originalRate > rate.retailRate ? Math.round((1 - rate.retailRate / rate.originalRate) * 100) : 0;
            return (
              <div key={rate.offerId || idx} className="flex items-center justify-between gap-3 py-3 border-t border-border/40 cursor-pointer hover:bg-accent/3 transition-all duration-200 -mx-4 px-4 rounded-lg">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">{rate.boardName}</p>
                  {isRefundable ? (
                    <span className="flex items-center gap-1 text-[11px] text-success font-medium mt-0.5"><Check size={11} />{t("freeCancellation")}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5"><X size={11} />{t("nonRefundable")}</span>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {discount > 0 && <p className="text-[11px] text-text-muted line-through">{formatCurrency(rate.originalRate!, rate.currency)}</p>}
                  <p className="text-base font-bold text-text-primary">{formatCurrency(rate.retailRate, rate.currency)}</p>
                  <p className="text-[10px] text-text-muted">{t("includesTaxes")}</p>
                </div>
                <button onClick={() => onSelectRoom(rate.offerId)} className="bg-accent hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 hover:scale-105 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 shrink-0">{t("chooseRoom")}</button>
              </div>
            );
          })}
        </div>
        {hasMore && (
          <button onClick={() => setExpanded(!expanded)} className="w-full py-2 mt-1 text-xs font-medium text-accent hover:text-accent-hover cursor-pointer">
            {expanded ? t("showLess") : `+${uniqueRates.length - 3} more options`}
          </button>
        )}
      </div>
    </div>
  );
}

/** Deduplicate rates with identical boardName + cancellation + price */
function deduplicateRates(rates: RoomData[]): RoomData[] {
  const seen = new Set<string>();
  const result: RoomData[] = [];

  for (const rate of rates) {
    const key = `${rate.boardName}|${rate.cancellationPolicy?.refundableTag}|${rate.retailRate}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(rate);
    }
  }

  result.sort((a, b) => a.retailRate - b.retailRate);
  return result;
}
