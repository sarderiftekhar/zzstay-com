"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? t("authError") : null
  );
  const [success, setSuccess] = useState<string | null>(null);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(t("checkEmail"));
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push(redirect as "/");
      }
    }

    setLoading(false);
  }

  async function handleGoogleAuth() {
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-bg-cream/30 flex items-start justify-center px-4">
      <div className="w-full max-w-md mt-8 sm:mt-16">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/Logo-Book-Your-hotel.png"
              alt="BookYourHotel"
              width={200}
              height={55}
              className="h-14 w-auto brightness-0 opacity-80"
            />
          </Link>
          <p className="text-sm text-text-muted mt-2">{t("signInToContinue")}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
          {/* Tabs */}
          <div className="flex mb-6 bg-bg-cream rounded-xl p-1">
            <button
              onClick={() => { setMode("signin"); setError(null); setSuccess(null); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                mode === "signin"
                  ? "bg-white text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {t("signIn")}
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                mode === "signup"
                  ? "bg-white text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {t("signUp")}
            </button>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 mb-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  {t("fullName")}
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("fullNamePlaceholder")}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                {t("email")}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                {t("password")}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  {t("confirmPassword")}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("confirmPasswordPlaceholder")}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "signin" ? t("signIn") : t("signUp")}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted">{t("orContinueWith")}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleAuth}
            className="w-full py-2.5 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-bg-cream transition-colors cursor-pointer flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {t("google")}
          </button>

          {/* Toggle */}
          <p className="text-center text-sm text-text-muted mt-5">
            {mode === "signin" ? t("noAccount") : t("haveAccount")}{" "}
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setSuccess(null); }}
              className="text-accent font-semibold hover:text-accent-hover transition-colors cursor-pointer"
            >
              {mode === "signin" ? t("signUp") : t("signIn")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
