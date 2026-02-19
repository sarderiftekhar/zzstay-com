"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { X, User, BookOpen, Heart, LogOut, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const resetFavorites = useFavoritesStore((s) => s.reset);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    useAuthStore.getState().reset();
    resetFavorites();
    onClose();
    router.push("/");
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <button type="button" aria-label="Close menu" className="fixed inset-0 bg-black/50 border-0 cursor-default" onClick={onClose} />

      {/* Menu panel */}
      <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-2xl" style={{ fontFamily: "var(--font-ephesis)", WebkitTextStroke: "0.5px" }}>
            <span className="text-accent-bright">Book</span>
            <span className="text-accent">YourHotel</span>
          </span>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-accent transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-3 border-b border-border bg-bg-cream/50">
            <p className="text-sm font-semibold text-text-primary truncate">
              {profile?.full_name || tAuth("user")}
            </p>
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>
        )}

        <nav className="flex flex-col p-4 gap-1">
          <Link href="/" onClick={onClose} className="px-4 py-3 text-text-secondary hover:text-accent hover:bg-bg-cream rounded-lg transition-colors">
            {t("home")}
          </Link>
          <Link href="/about" onClick={onClose} className="px-4 py-3 text-text-secondary hover:text-accent hover:bg-bg-cream rounded-lg transition-colors">
            {t("about")}
          </Link>
          <Link href="/contact" onClick={onClose} className="px-4 py-3 text-text-secondary hover:text-accent hover:bg-bg-cream rounded-lg transition-colors">
            {t("contact")}
          </Link>

          <div className="h-px bg-border my-2" />

          {user ? (
            <>
              <Link href="/account" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-accent hover:bg-bg-cream rounded-lg transition-colors">
                <User size={18} />
                {tAuth("myAccount")}
              </Link>
              <Link href="/account/bookings" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-accent hover:bg-bg-cream rounded-lg transition-colors">
                <BookOpen size={18} />
                {tAuth("myBookings")}
              </Link>
              <Link href="/account/favorites" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-accent hover:bg-bg-cream rounded-lg transition-colors">
                <Heart size={18} />
                {tAuth("myFavorites")}
              </Link>
              <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                <LogOut size={18} />
                {tAuth("signOut")}
              </button>
            </>
          ) : (
            <Link href="/login" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-accent font-semibold hover:bg-bg-cream rounded-lg transition-colors">
              <LogIn size={18} />
              {tAuth("signIn")}
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
