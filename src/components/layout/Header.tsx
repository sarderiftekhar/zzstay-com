"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Menu, Globe, Wallet } from "lucide-react";
import Image from "next/image";
import { usePreferencesStore } from "@/store/preferencesStore";
import LanguageSelector from "./LanguageSelector";
import CurrencySelector from "./CurrencySelector";
import MobileMenu from "./MobileMenu";
import UserMenu from "@/components/auth/UserMenu";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { currency } = usePreferencesStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangSelector, setShowLangSelector] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-accent ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-transform duration-200 hover:scale-105">
            <Image
              src="/images/Logo-Book-Your-hotel.png"
              alt="BookYourHotel"
              width={180}
              height={50}
              className="h-14 sm:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/" as const, label: t("home") },
              { href: "/about" as const, label: t("about") },
              { href: "/contact" as const, label: t("contact") },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium rounded-full transition-colors text-white/80 hover:bg-white/15 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLangSelector(!showLangSelector);
                  setShowCurrencySelector(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-full transition-colors text-white/80 hover:bg-white/15 hover:text-white"
                aria-label={t("language")}
              >
                <Globe size={16} />
                <span className="hidden sm:inline uppercase text-xs font-semibold">{locale}</span>
              </button>
              {showLangSelector && (
                <LanguageSelector onClose={() => setShowLangSelector(false)} />
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCurrencySelector(!showCurrencySelector);
                  setShowLangSelector(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-full transition-colors text-white/80 hover:bg-white/15 hover:text-white"
                aria-label={t("currency")}
              >
                <Wallet size={16} />
                <span className="hidden sm:inline text-xs font-semibold">{currency}</span>
              </button>
              {showCurrencySelector && (
                <CurrencySelector onClose={() => setShowCurrencySelector(false)} />
              )}
            </div>

            {/* User Menu */}
            <UserMenu />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full transition-colors text-white/80 hover:bg-white/15 hover:text-white"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu onClose={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
}
