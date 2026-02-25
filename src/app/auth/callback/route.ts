import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/en";
  const type = searchParams.get("type"); // "signup" for email confirmation

  if (code) {
    // Determine redirect: email confirmation goes to confirmation page, login goes to requested page
    const redirectTo = type === "signup" ? "/en/email-confirmed" : next;
    const response = NextResponse.redirect(`${origin}${redirectTo}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  // Handle error params from Supabase (e.g. expired link)
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    const errorMsg = encodeURIComponent(errorDescription || "Authentication failed");
    return NextResponse.redirect(`${origin}/en/login?error=${errorMsg}`);
  }

  return NextResponse.redirect(`${origin}/en/login?error=auth_failed`);
}
