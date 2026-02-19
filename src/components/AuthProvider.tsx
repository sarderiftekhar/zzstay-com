"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setProfile, setLoading } = useAuthStore();
  const { setFavorites, reset: resetFavorites } = useFavoritesStore();

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Load profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();
        setProfile(profile);

        // Load favorites
        const { data: favs } = await supabase
          .from("favorites")
          .select("hotel_id")
          .eq("user_id", user.id);
        if (favs) {
          setFavorites(favs.map((f) => f.hotel_id));
        }
      }

      setLoading(false);
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();
        setProfile(profile);

        const { data: favs } = await supabase
          .from("favorites")
          .select("hotel_id")
          .eq("user_id", user.id);
        if (favs) {
          setFavorites(favs.map((f) => f.hotel_id));
        }
      } else {
        setProfile(null);
        resetFavorites();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile, setLoading, setFavorites, resetFavorites]);

  return <>{children}</>;
}
