import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Decode the JWT payload without verifying the signature.
 * This is safe for routing decisions because:
 * - The backend always verifies the signature on protected API calls.
 * - We only use the role for redirect decisions, not for access control.
 */
function decodeJwtPayload(token: string): { id?: string; email?: string; role?: string } | null {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;
    // atob is available in Next.js Edge Runtime
    const jsonPayload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    pathname.toLowerCase() === "/login" || pathname.toLowerCase() === "/register";

  const isUserRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/profile");
  const isAdminRoute = pathname.startsWith("/admin");

  // --- Not logged in ---
  if (!token) {
    if (isUserRoute || isAdminRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // --- Logged in: decode role from token ---
  const payload = decodeJwtPayload(token);
  const role = payload?.role;

  // If token is unreadable, clear and redirect to login
  if (!payload) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    return response;
  }

  // --- Admin user ---
  if (role === "admin") {
    // Admin visiting login/register → go to admin dashboard
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    // Admin trying to access user dashboard/profile → redirect to admin dashboard
    if (isUserRoute) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    // Admin accessing admin routes → allow
    return NextResponse.next();
  }

  // --- Regular user ---
  // User visiting login/register → go to homepage
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // User trying to access admin routes → redirect to user dashboard
  if (isAdminRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // User accessing their own routes → allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/Register",
  ],
};
