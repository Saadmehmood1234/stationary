import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const session = token ? await verifySessionToken(token) : null;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/profile", "/orders", "/checkout"];
  const adminRoutes = ["/admin"];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  const authRoutes = ["/auth/signin", "/auth/signup", "/auth/login", "/auth/register"];
  const isAuthRoute = authRoutes.includes(pathname);

  console.log("Middleware:", {
    pathname,
    hasToken: !!token,
    hasSession: !!session,
    isProtectedRoute,
    isAdminRoute,
    isAuthRoute,
    role: session?.role,
  });

  if ((isProtectedRoute || isAdminRoute) && !session) {
    const loginUrl = new URL("/auth/signin", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }


  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/auth/signin",
    "/auth/signup",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
  ],
};
