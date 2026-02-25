"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Globe, Wallet, Home, Info, Mail, LogIn, ClipboardList } from "lucide-react";
import Image from "next/image";
import { usePreferencesStore } from "@/store/preferencesStore";
import LanguageSelector from "./LanguageSelector";
import CurrencySelector from "./CurrencySelector";
import UserMenu from "@/components/auth/UserMenu";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const locale = useLocale();
  const { currency } = usePreferencesStore();
  const { user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLangSelector, setShowLangSelector] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [menuOpen]);

  const navItems = [
    { href: "/" as const, label: t("home"), icon: Home },
    { href: "/manage-booking" as const, label: t("manageBooking"), icon: ClipboardList },
    { href: "/about" as const, label: t("about"), icon: Info },
    { href: "/contact" as const, label: t("contact"), icon: Mail },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-accent ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      {/* Centered hero logo — straddles header/content boundary */}
      <Link
        href="/"
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[45%] z-10 transition-transform duration-300 hover:scale-105"
      >
        <Image
          src="/images/logo-white.png"
          alt="BookYourHotel"
          width={540}
          height={150}
          className="w-[200px] sm:w-[260px] lg:w-[300px] h-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          style={{ height: "auto" }}
          priority
        />
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Spacer — keeps layout balanced with right-side actions */}
          <div className="w-24" />

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

            {/* Burger Menu */}
            <div ref={menuRef} className="relative">
              {/* Outer dip / inset ring */}
              <div
                className="rounded-full p-[3px]"
                style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.35), inset 0 -1px 2px rgba(255,255,255,0.1)" }}
              >
                {/* Raised button */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="group relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-500 text-white/90 hover:text-accent-bright active:scale-95 hover:animate-[burgerGlow_1.5s_ease-in-out_infinite]"
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))",
                    boxShadow: "2px 3px 6px rgba(0,0,0,0.35), -1px -1px 4px rgba(255,255,255,0.08), inset 0 1px 1px rgba(255,255,255,0.2)",
                  }}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                >
                  {/* Hover ring pulse */}
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 8px rgba(62,206,173,0.3)" }} />
                  <div className="relative w-[18px] h-[14px]">
                    <span
                      className={`absolute left-0 h-[2px] bg-current rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                        menuOpen ? "w-full top-1.5 rotate-45" : "w-full top-0 group-hover:w-[14px] group-hover:left-[2px]"
                      }`}
                    />
                    <span
                      className={`absolute left-0 top-1.5 h-[2px] bg-current rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                        menuOpen ? "opacity-0 scale-x-0 w-full" : "opacity-100 w-full group-hover:w-[18px]"
                      }`}
                    />
                    <span
                      className={`absolute left-0 h-[2px] bg-current rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                        menuOpen ? "w-full top-1.5 -rotate-45" : "w-full top-3 group-hover:w-[10px] group-hover:left-[4px]"
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Dropdown Menu — pill-shaped */}
              <div
                className={`absolute right-1/2 translate-x-1/2 top-full mt-3 w-40 bg-accent border border-white/20 rounded-[24px] shadow-2xl shadow-black/25 overflow-hidden transition-all duration-300 origin-top ${
                  menuOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="py-1.5 px-1.5">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-medium text-white/80 hover:text-white hover:bg-white/15 rounded-full transition-colors"
                    >
                      <item.icon size={15} />
                      {item.label}
                    </Link>
                  ))}

                  {/* Divider */}
                  <div className="h-px bg-white/15 my-1 mx-2" />

                  {/* Auth Section */}
                  {user ? (
                    <UserMenu variant="dropdown" onItemClick={() => setMenuOpen(false)} />
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-semibold text-accent-bright hover:bg-white/15 rounded-full transition-colors"
                    >
                      <LogIn size={15} />
                      {tAuth("signIn")}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
