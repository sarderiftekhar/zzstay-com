"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Star, MapPin, Heart, Trash2, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import Spinner from "@/components/ui/Spinner";

interface FavoriteHotel {
  id: string;
  hotel_id: string;
  hotel_name: string;
  hotel_image: string;
  hotel_address: string;
  hotel_star_rating: number;
  hotel_city: string;
  hotel_country: string;
  created_at: string;
}

export default function FavoritesPage() {
  const t = useTranslations("account");
  const { user } = useAuthStore();
  const { removeFavorite } = useFavoritesStore();
  const [favorites, setFavorites] = useState<FavoriteHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (data) setFavorites(data);
      setLoading(false);
    }

    load();
  }, [user]);

  async function handleRemove(hotelId: string) {
    if (!user) return;
    removeFavorite(hotelId);
    setFavorites((prev) => prev.filter((f) => f.hotel_id !== hotelId));

    const supabase = createClient();
    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("hotel_id", hotelId);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={32} />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center">
        <Heart size={40} className="mx-auto text-text-muted/40 mb-3" />
        <p className="text-text-muted mb-4">{t("noFavorites")}</p>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Image */}
          <div className="relative h-40">
            {fav.hotel_image ? (
              <img
                src={fav.hotel_image}
                alt={fav.hotel_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-bg-cream flex items-center justify-center">
                <MapPin size={32} className="text-text-muted/30" />
              </div>
            )}
            <button
              onClick={() => handleRemove(fav.hotel_id)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer active:scale-90"
              aria-label={t("removeFromFavorites")}
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          </div>

          {/* Details */}
          <div className="p-4">
            {fav.hotel_star_rating > 0 && (
              <div className="flex items-center gap-0.5 mb-1">
                {Array.from({ length: fav.hotel_star_rating }).map((_, i) => (
                  <Star key={i} size={12} className="fill-star text-star" />
                ))}
              </div>
            )}
            <h3 className="font-semibold text-text-primary text-sm truncate">
              {fav.hotel_name}
            </h3>
            <p className="text-xs text-text-muted mt-0.5 truncate">
              {[fav.hotel_city, fav.hotel_country].filter(Boolean).join(", ")}
            </p>

            <Link
              href={`/hotel/${fav.hotel_id}`}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              <Search size={13} />
              {t("viewHotel")}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
