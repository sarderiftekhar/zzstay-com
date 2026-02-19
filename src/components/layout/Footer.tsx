"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark text-text-light relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-bright/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* About — wider */}
          <div className="lg:col-span-4">
            <div className="text-3xl mb-5" style={{ fontFamily: "var(--font-ephesis)", WebkitTextStroke: "0.6px" }}>
              <span className="text-accent-bright">Book</span>YourHotel
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              {t("aboutText")}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-accent-bright text-sm font-medium hover:gap-3 transition-all duration-300 group"
            >
              Learn more about us
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-5 text-white">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/" as const, label: tn("home") },
                { href: "/about" as const, label: tn("about") },
                { href: "/contact" as const, label: tn("contact") },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-accent-bright transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-5 text-white">
              {t("legal")}
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/privacy" as const, label: t("privacyPolicy") },
                { href: "/terms" as const, label: t("termsOfService") },
                { href: "/contact" as const, label: t("helpCenter") },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-accent-bright transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-5 text-white">
              {t("support")}
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:support@bookyourhotel.online" className="flex items-center gap-3 text-sm text-gray-400 hover:text-accent-bright transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-accent-bright/10 flex items-center justify-center transition-colors">
                    <Mail size={15} className="text-accent-bright" />
                  </div>
                  support@bookyourhotel.online
                </a>
              </li>
              <li>
                <a href="tel:+18001234567" className="flex items-center gap-3 text-sm text-gray-400 hover:text-accent-bright transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-accent-bright/10 flex items-center justify-center transition-colors">
                    <Phone size={15} className="text-accent-bright" />
                  </div>
                  +1 (800) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin size={15} className="text-accent-bright" />
                </div>
                123 Travel Street, Suite 100
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            {t("copyright", { year: currentYear })}
          </p>
          <p className="text-xs text-gray-500">
            Powered by LiteAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
