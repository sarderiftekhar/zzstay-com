"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import {
  Search,
  Loader2,
  AlertCircle,
  CalendarDays,
  User,
  Mail,
  Phone,
  Building,
  Printer,
  Home,
  Hash,
  BedDouble,
  Users,
  UtensilsCrossed,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { formatCurrency, formatDate, isRefundablePolicy } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface BookingData {
  bookingId: string;
  hotelName: string;
  hotelConfirmationCode?: string;
  status: string;
  checkin: string;
  checkout: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currency: string;
  price: number;
  guests?: number;
  bookedRooms?: Array<{
    roomType?: {
      name?: string;
      boardName?: string;
    };
  }>;
  cancellationPolicies?: {
    refundableTag?: string;
    cancelPolicyInfos?: Array<{
      cancelTime?: string;
      amount?: number;
    }>;
  };
}

export default function ManageBookingPage() {
  const t = useTranslations("manageBooking");
  const tBooking = useTranslations("booking");
  const searchParams = useSearchParams();

  const [lastName, setLastName] = useState(searchParams.get("lastName") || "");
  const [bookingId, setBookingId] = useState(searchParams.get("id") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBooking(null);

    if (!lastName.trim() || !bookingId.trim()) {
      setError(t("fieldsRequired"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/booking/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingId.trim(),
          lastName: lastName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.data) {
        setError(t("notFound"));
      } else {
        setBooking(data.data as BookingData);
      }
    } catch {
      setError(t("lookupError"));
    } finally {
      setLoading(false);
    }
  }

  const roomName = booking?.bookedRooms?.[0]?.roomType?.name || "";
  const boardName = booking?.bookedRooms?.[0]?.roomType?.boardName || "";
  const cancellationTag = booking?.cancellationPolicies?.refundableTag || "";
  const isRefundable = isRefundablePolicy(cancellationTag);
  const cancelDeadline = booking?.cancellationPolicies?.cancelPolicyInfos?.[0]?.cancelTime;

  const statusColor =
    booking?.status === "confirmed"
      ? "bg-green-50 text-green-700 border-green-200"
      : booking?.status === "cancelled"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-yellow-50 text-yellow-700 border-yellow-200";

  return (
    <div className="pt-20 min-h-screen bg-bg-cream/30">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold text-text-primary mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("title")}
          </h1>
          <p className="text-sm text-text-muted">{t("subtitle")}</p>
        </div>

        {/* Lookup Form */}
        {!booking && (
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
            {error && (
              <div className="flex items-start gap-2 p-3 mb-5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  {t("lastName")} <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t("lastNamePlaceholder")}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  {t("bookingIdLabel")} <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    placeholder={t("bookingIdPlaceholder")}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                {loading ? t("searching") : t("findBooking")}
              </button>
            </form>

            <p className="text-xs text-text-muted text-center mt-5 leading-relaxed">
              {t("helpText")}
            </p>
          </div>
        )}

        {/* Booking Details */}
        {booking && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${statusColor}`}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider">{t("bookingStatus")}</p>
                <p className="text-lg font-bold capitalize">{booking.status}</p>
              </div>
              <button
                onClick={() => setBooking(null)}
                className="text-sm font-medium underline underline-offset-2 hover:no-underline cursor-pointer"
              >
                {t("searchAnother")}
              </button>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
              {/* Booking & Confirmation IDs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider">{tBooking("bookingRef")}</p>
                  <p className="font-bold text-accent text-lg">{booking.bookingId}</p>
                </div>
                {booking.hotelConfirmationCode && (
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider">{tBooking("hotelConfirmation")}</p>
                    <p className="font-bold text-text-primary">{booking.hotelConfirmationCode}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-border" />

              {/* Hotel & Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <Building size={16} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted">{t("hotel")}</p>
                    <p className="font-medium text-text-primary">{booking.hotelName}</p>
                  </div>
                </div>
                {roomName && (
                  <div className="flex items-start gap-2.5">
                    <BedDouble size={16} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted">{t("room")}</p>
                      <p className="font-medium text-text-primary">{roomName}</p>
                    </div>
                  </div>
                )}
                {boardName && (
                  <div className="flex items-start gap-2.5">
                    <UtensilsCrossed size={16} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted">{t("board")}</p>
                      <p className="font-medium text-text-primary">{boardName}</p>
                    </div>
                  </div>
                )}
                {booking.guests && booking.guests > 0 && (
                  <div className="flex items-start gap-2.5">
                    <Users size={16} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted">{t("guests")}</p>
                      <p className="font-medium text-text-primary">
                        {booking.guests} {t("guestCount", { count: booking.guests })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border" />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <CalendarDays size={16} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted">{t("checkIn")}</p>
                    <p className="font-medium text-text-primary">{formatDate(booking.checkin, "MMM dd, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CalendarDays size={16} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted">{t("checkOut")}</p>
                    <p className="font-medium text-text-primary">{formatDate(booking.checkout, "MMM dd, yyyy")}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Guest Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <User size={16} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted">{t("guestName")}</p>
                    <p className="font-medium text-text-primary">{booking.firstName} {booking.lastName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail size={16} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted">{t("email")}</p>
                    <p className="font-medium text-text-primary">{booking.email}</p>
                  </div>
                </div>
                {booking.phone && (
                  <div className="flex items-start gap-2.5">
                    <Phone size={16} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-text-muted">{t("phone")}</p>
                      <p className="font-medium text-text-primary">{booking.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border" />

              {/* Cancellation Policy */}
              {cancellationTag && (
                <div className="flex items-start gap-2.5">
                  {isRefundable ? (
                    <ShieldCheck size={16} className="text-success shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert size={16} className="text-warning shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs text-text-muted">{t("cancellationPolicy")}</p>
                    <Badge variant={isRefundable ? "success" : "warning"} className="mt-1">
                      {isRefundable ? t("freeCancellation") : t("nonRefundable")}
                    </Badge>
                    {isRefundable && cancelDeadline && (
                      <p className="text-xs text-text-muted mt-1.5">
                        {t("cancelBefore", { date: formatDate(cancelDeadline, "MMM dd, yyyy 'at' HH:mm") })}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="font-bold text-text-primary text-lg">{tBooking("total")}</span>
                <span className="text-xl font-bold text-accent">
                  {formatCurrency(booking.price, booking.currency)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-border rounded-lg bg-white hover:bg-bg-cream transition-colors cursor-pointer"
              >
                <Printer size={16} />
                {tBooking("printBooking")}
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
              >
                <Home size={16} />
                {tBooking("backToHome")}
              </Link>
            </div>

            {/* Need help */}
            <p className="text-xs text-text-muted text-center leading-relaxed">
              {t("needHelp")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
