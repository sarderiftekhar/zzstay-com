"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function BookingConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const booking = useBookingStore();
  const { user } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const tid = searchParams.get("tid");
    const pid = searchParams.get("pid");

    if (!tid || !pid) {
      setError("Missing payment information. Please try again.");
      setStatus("error");
      return;
    }

    // Get guest info from sessionStorage (stored before redirect)
    const guestRaw = sessionStorage.getItem("byh_guest_info");
    if (!guestRaw) {
      setError("Guest information not found. Please try again.");
      setStatus("error");
      return;
    }

    const guest = JSON.parse(guestRaw);

    completeBooking(pid, tid, guest);

    async function completeBooking(
      prebookId: string,
      transactionId: string,
      guestInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        specialRequests: string;
      }
    ) {
      try {
        const bookRes = await fetch("/api/booking/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prebookId,
            transactionId,
            firstName: guestInfo.firstName,
            lastName: guestInfo.lastName,
            email: guestInfo.email,
            phone: guestInfo.phone,
            specialRequests: guestInfo.specialRequests,
          }),
        });

        const bookData = await bookRes.json();

        if (!bookRes.ok || !bookData.data) {
          throw new Error(bookData.error || "Booking failed");
        }

        const bookingId = bookData.data.bookingId || bookData.data.id;

        // Save to booking history if logged in
        if (user) {
          try {
            const supabase = createClient();
            await supabase.from("booking_history").insert({
              user_id: user.id,
              liteapi_booking_id: bookingId,
              hotel_id: booking.hotelId,
              hotel_name: booking.hotelName,
              hotel_image: booking.roomImage,
              room_name: booking.roomName,
              check_in: booking.checkIn,
              check_out: booking.checkOut,
              currency: booking.currency,
              total_rate: booking.totalRate,
              status: "confirmed",
              guest_name: `${guestInfo.firstName} ${guestInfo.lastName}`,
              guest_email: guestInfo.email,
            });
          } catch {
            // Don't block booking confirmation if history save fails
          }
        }

        // Clean up sessionStorage
        sessionStorage.removeItem("byh_guest_info");

        setStatus("success");
        // Navigate to booking details
        router.push(`/booking/${bookingId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Booking failed");
        setStatus("error");
      }
    }
  }, [searchParams, router, booking, user]);

  if (status === "loading") {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4 bg-bg-cream">
        <Loader2 size={40} className="animate-spin text-accent" />
        <p className="text-text-primary font-medium">Confirming your booking...</p>
        <p className="text-sm text-text-muted">Please don&apos;t close this page.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4 bg-bg-cream px-4">
        <div className="max-w-md w-full bg-white rounded-xl border border-border p-8 text-center">
          <h1
            className="text-2xl font-bold text-text-primary mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Booking Issue
          </h1>
          <p className="text-sm text-error mb-6">{error}</p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return null;
}
