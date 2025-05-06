import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password"
];

export function middleware(req) {
  // Only run on pages, not static files
  if (req.nextUrl.pathname.startsWith("/_next")) return;

  // Allow public auth pages
  if (PUBLIC_PATHS.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for Supabase auth cookie (sb-access-token)
  const hasSession = req.cookies.get("sb-access-token");
  if (!hasSession) {
    // Not authenticated, redirect to login
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated, allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets).*)"],
};
