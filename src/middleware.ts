import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, just run intl middleware
  if (!supabaseUrl || !supabaseKey) {
    return intlMiddleware(request);
  }

  // Step 1: Refresh Supabase session and collect auth cookies
  const supabaseCookies: Array<{
    name: string;
    value: string;
    options: Record<string, unknown>;
  }> = [];

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseCookies.push(
            ...cookiesToSet.map((c) => ({
              name: c.name,
              value: c.value,
              options: c.options as Record<string, unknown>,
            }))
          );
        },
      },
    });

    // Refresh the session token
    await supabase.auth.getUser();
  } catch {
    // If Supabase fails, continue without auth — don't break the site
  }

  // Step 2: Run next-intl middleware (locale detection, routing)
  const intlResponse = intlMiddleware(request);

  // Step 3: Merge Supabase auth cookies into the intl response
  supabaseCookies.forEach(({ name, value, options }) => {
    intlResponse.cookies.set(name, value, options);
  });

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|auth|_next|_vercel|images|favicon.ico|.*\\..*).*)"],
};
