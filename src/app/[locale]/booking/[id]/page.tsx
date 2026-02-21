"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { UserPlus } from "lucide-react";
import BookingSummary from "@/components/booking/BookingSummary";
import Spinner from "@/components/ui/Spinner";
import { useAuthStore } from "@/store/authStore";

export default function BookingConfirmationPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const t = useTranslations("booking");
  const { user } = useAuthStore();

  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/booking/${bookingId}`);
        const data = await res.json();
        if (data.data) {
          setBooking(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch booking:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BookingSummary
          bookingId={bookingId}
          hotelName={(booking?.hotelName as string) || "Hotel"}
          roomName={((booking?.bookedRooms as Array<Record<string, unknown>>)?.[0]?.roomType as Record<string, unknown>)?.name as string || "Room"}
          checkIn={(booking?.checkin as string) || ""}
          checkOut={(booking?.checkout as string) || ""}
          guestName={`${(booking?.firstName as string) || ""} ${(booking?.lastName as string) || ""}`.trim() || "Guest"}
          email={(booking?.email as string) || ""}
          currency={(booking?.currency as string) || "USD"}
          totalRate={(booking?.price as number) || 0}
          hotelConfirmationCode={booking?.hotelConfirmationCode as string | undefined}
        />

        {/* Create account prompt for non-authenticated users */}
        {!user && (
          <div className="mt-6 bg-accent/5 border border-accent/20 rounded-xl p-6 text-center">
            <UserPlus size={28} className="mx-auto text-accent mb-3" />
            <h3 className="text-lg font-bold text-text-primary mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
              {t("createAccountTitle")}
            </h3>
            <p className="text-sm text-text-muted mb-4">
              {t("createAccountSubtitle")}
            </p>
            <Link
              href={`/login?redirect=/account/bookings`}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all duration-200"
            >
              {t("createAccountCta")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
