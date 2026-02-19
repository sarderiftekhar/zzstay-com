"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";

interface FavoriteButtonProps {
  hotelId: string;
  hotelName?: string;
  hotelImage?: string;
  hotelAddress?: string;
  hotelStarRating?: number;
  hotelCity?: string;
  hotelCountry?: string;
  className?: string;
}

export default function FavoriteButton({
  hotelId,
  hotelName,
  hotelImage,
  hotelAddress,
  hotelStarRating,
  hotelCity,
  hotelCountry,
  className = "",
}: FavoriteButtonProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [animating, setAnimating] = useState(false);

  const favorited = isFavorite(hotelId);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    const supabase = createClient();

    if (favorited) {
      // Optimistic remove
      removeFavorite(hotelId);
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("hotel_id", hotelId);

      if (error) {
        addFavorite(hotelId); // revert
      }
    } else {
      // Optimistic add
      addFavorite(hotelId);
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        hotel_id: hotelId,
        hotel_name: hotelName,
        hotel_image: hotelImage,
        hotel_address: hotelAddress,
        hotel_star_rating: hotelStarRating,
        hotel_city: hotelCity,
        hotel_country: hotelCountry,
      });

      if (error) {
        removeFavorite(hotelId); // revert
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${className}`}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
    >
      <Heart
        size={16}
        className={`transition-all duration-200 ${
          favorited
            ? "fill-red-500 text-red-500"
            : "text-text-muted hover:text-red-400"
        } ${animating ? "scale-125" : ""}`}
      />
    </button>
  );
}
