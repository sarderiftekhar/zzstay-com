"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CalendarDays, ExternalLink, Building } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/lib/utils";
import Spinner from "@/components/ui/Spinner";

interface Booking {
  id: string;
  liteapi_booking_id: string;
  hotel_id: string;
  hotel_name: string;
  hotel_image: string;
  room_name: string;
  check_in: string;
  check_out: string;
  currency: string;
  total_rate: number;
  status: string;
  guest_name: string;
  created_at: string;
}

export default function BookingsPage() {
  const t = useTranslations("account");
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("booking_history")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (data) setBookings(data);
      setLoading(false);
    }

    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={32} />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center">
        <Building size={40} className="mx-auto text-text-muted/40 mb-3" />
        <p className="text-text-muted mb-4">{t("noBookings")}</p>
        <Link
          href="/"
          className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
        >
          {t("startSearching")} &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-xl border border-border p-5 flex flex-col sm:flex-row gap-4 hover:shadow-sm transition-shadow"
        >
          {/* Image */}
          {booking.hotel_image ? (
            <img
              src={booking.hotel_image}
              alt={booking.hotel_name}
              className="w-full sm:w-32 h-24 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-full sm:w-32 h-24 rounded-lg bg-bg-cream flex items-center justify-center shrink-0">
              <Building size={24} className="text-text-muted/40" />
            </div>
          )}

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-text-primary truncate">
                  {booking.hotel_name}
                </h3>
                <p className="text-sm text-text-muted">{booking.room_name}</p>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                  booking.status === "confirmed"
                    ? "bg-green-50 text-green-700"
                    : booking.status === "cancelled"
                    ? "bg-red-50 text-red-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-accent" />
                {new Date(booking.check_in).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {" — "}
                {new Date(booking.check_out).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span className="font-semibold text-text-primary">
                {formatCurrency(booking.total_rate, booking.currency)}
              </span>
            </div>

            <div className="mt-3">
              <Link
                href={`/booking/${booking.liteapi_booking_id}`}
                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1"
              >
                {t("viewBooking")}
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
