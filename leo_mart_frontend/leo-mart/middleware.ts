import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/Register"];
  const isPublicRoute = publicRoutes.some((route) => pathname.toLowerCase() === route.toLowerCase());

  const protectedRoutes = ["/dashboard", "/profile"];
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) || pathname.toLowerCase() === route.toLowerCase()
  );

  // If logged in and trying to access login/register, redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If not logged in and trying to access protected paths, redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/Register",
  ],
};
