"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Save, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";

export default function AccountProfilePage() {
  const t = useTranslations("account");
  const { user, profile, setProfile } = useAuthStore();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (!error) {
      setProfile({ full_name: fullName, avatar_url: profile?.avatar_url || "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "";

  return (
    <div className="bg-white rounded-xl border border-border p-6 sm:p-8 max-w-2xl">
      <h2
        className="text-lg font-bold text-text-primary mb-6"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {t("profile")}
      </h2>

      <div className="space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-border flex items-center justify-center text-xl font-bold text-accent">
              {(fullName || user?.email || "U")[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-text-primary">{fullName || user?.email}</p>
            {memberSince && (
              <p className="text-xs text-text-muted">{t("memberSince", { date: memberSince })}</p>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            {t("fullName")}
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            {t("email")}
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-bg-cream/50 text-text-muted cursor-not-allowed"
          />
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2 active:scale-[0.98]"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {t("saveChanges")}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">{t("changesSaved")}</span>
          )}
        </div>
      </div>
    </div>
  );
}
