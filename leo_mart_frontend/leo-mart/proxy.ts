import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string): { id?: string; email?: string; role?: string } | null {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;
    const jsonPayload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isUserRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/profile");
  const isAdminRoute = pathname.startsWith("/admin");

  // --- Not logged in: protect private routes ---
  if (!token) {
    if (isUserRoute || isAdminRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // --- Logged in: decode role ---
  const payload = decodeJwtPayload(token);
  if (!payload) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    return response;
  }

  const role = payload?.role;

  // Admin accessing user routes → redirect to admin dashboard
  if (role === "admin" && isUserRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Regular user accessing admin routes → redirect to user dashboard
  if (role !== "admin" && isAdminRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
