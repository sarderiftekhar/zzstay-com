"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CheckCircle, LogIn } from "lucide-react";

export default function EmailConfirmedPage() {
  const t = useTranslations("auth");

  return (
    <div className="pt-20 min-h-screen bg-bg-cream/30 flex items-start justify-center px-4">
      <div className="w-full max-w-md mt-16 sm:mt-24 text-center">
        <div className="bg-white rounded-2xl border border-border p-8 sm:p-10 shadow-sm">
          <CheckCircle size={56} className="mx-auto text-success mb-4" />

          <h1
            className="text-2xl font-bold text-text-primary mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("emailConfirmedTitle")}
          </h1>

          <p className="text-sm text-text-muted mb-8 leading-relaxed">
            {t("emailConfirmedText")}
          </p>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-all duration-200"
          >
            <LogIn size={16} />
            {t("signIn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
