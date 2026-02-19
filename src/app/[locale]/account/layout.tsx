"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { User, BookOpen, Heart } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Spinner from "@/components/ui/Spinner";

const TABS = [
  { href: "/account" as const, icon: User, labelKey: "profile" as const },
  { href: "/account/bookings" as const, icon: BookOpen, labelKey: "bookings" as const },
  { href: "/account/favorites" as const, icon: Heart, labelKey: "favorites" as const },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("account");
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="pt-20 min-h-screen bg-bg-cream/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1
          className="text-2xl font-bold text-text-primary mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("myAccount")}
        </h1>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl border border-border p-1">
          {TABS.map(({ href, icon: Icon, labelKey }) => {
            const isActive = pathname.endsWith(href.replace("/account", "")) ||
              (href === "/account" && (pathname.endsWith("/account") || pathname.endsWith("/account/")));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:bg-bg-cream hover:text-accent"
                }`}
              >
                <Icon size={16} />
                {t(labelKey)}
              </Link>
            );
          })}
        </div>

        {children}
      </div>
    </div>
  );
}
