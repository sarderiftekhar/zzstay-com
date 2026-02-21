"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MapPin, Mail } from "lucide-react";
import Image from "next/image";
import { useLegalModalStore } from "@/store/legalModalStore";

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const currentYear = new Date().getFullYear();
  const openModal = useLegalModalStore((s) => s.openModal);

  return (
    <footer className="bg-bg-dark text-text-light relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-bright/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* About — wider */}
          <div className="lg:col-span-4">
            <div className="mb-5">
              <Image
                src="/images/Logo-Book-Your-hotel.png"
                alt="BookYourHotel"
                width={320}
                height={90}
                className="w-full max-w-xs h-auto"
                style={{ height: "auto" }}
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {t("aboutText")}
            </p>
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
                { key: "privacy" as const, label: t("privacyPolicy") },
                { key: "terms" as const, label: t("termsOfService") },
                { key: "cookies" as const, label: t("cookiePolicy") },
                { key: "help" as const, label: t("helpCenter") },
              ].map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => openModal(item.key)}
                    className="text-sm text-gray-400 hover:text-accent-bright transition-colors duration-200"
                  >
                    {item.label}
                  </button>
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
                <a href="mailto:sales@uniqevo.co.uk" className="flex items-center gap-3 text-sm text-gray-400 hover:text-accent-bright transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-accent-bright/10 flex items-center justify-center transition-colors">
                    <Mail size={15} className="text-accent-bright" />
                  </div>
                  sales@uniqevo.co.uk
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin size={15} className="text-accent-bright" />
                </div>
                Willett House, Queens Road West, London, UK
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            {t.rich("copyright", {
              year: currentYear,
              company: (chunks) => (
                <a
                  href="https://www.uniqevo.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-bright hover:underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
          <div className="flex items-center gap-3">
            {[
              {
                label: "Facebook",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.042 1.587.084V7.98h-1.264c-1.24 0-1.628.59-1.628 1.696v2.349h2.745l-.472 3.667h-2.273v8z" />
                  </svg>
                ),
              },
              {
                label: "Twitter",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
              {
                label: "LinkedIn",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ),
              },
              {
                label: "Instagram",
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <span
                key={social.label}
                aria-label={social.label}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500 cursor-default opacity-50"
              >
                {social.icon}
              </span>
            ))}
            <span className="text-[10px] uppercase tracking-wider text-gray-500 ml-1">Coming Soon</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
