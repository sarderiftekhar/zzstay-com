import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Step 1: Refresh Supabase session and collect auth cookies
  const supabaseCookies: Array<{
    name: string;
    value: string;
    options: Record<string, unknown>;
  }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  // Refresh the session token
  await supabase.auth.getUser();

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
