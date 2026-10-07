import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("sheba_session")?.value ||
    request.cookies.get("sheba_token")?.value ||
    request.cookies.get("access_token")?.value;

  const rawUserRole =
    request.cookies.get("sheba_role")?.value?.toLowerCase() || "patient";

  const isAuthenticated = Boolean(sessionToken);

  // 1. If unauthenticated user tries to access /dashboard or any /dashboard/* route
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Root /dashboard route -> redirect to role dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return NextResponse.redirect(
        new URL(getRoleDashboardPath(rawUserRole), request.url),
      );
    }

    // 2. Strict Role-Based Access Control (RBAC) Enforcement
    if (pathname.startsWith("/dashboard/doctor") && rawUserRole !== "doctor" && rawUserRole !== "admin") {
      return NextResponse.redirect(
        new URL(getRoleDashboardPath(rawUserRole), request.url),
      );
    }

    if (pathname.startsWith("/dashboard/lab") && rawUserRole !== "lab" && rawUserRole !== "admin") {
      return NextResponse.redirect(
        new URL(getRoleDashboardPath(rawUserRole), request.url),
      );
    }

    if (pathname.startsWith("/dashboard/pharmacy") && rawUserRole !== "pharmacy" && rawUserRole !== "admin") {
      return NextResponse.redirect(
        new URL(getRoleDashboardPath(rawUserRole), request.url),
      );
    }

    if (pathname.startsWith("/dashboard/admin") && rawUserRole !== "admin") {
      return NextResponse.redirect(
        new URL(getRoleDashboardPath(rawUserRole), request.url),
      );
    }
  }

  // 3. If authenticated user attempts to visit /login, /register, /auth, redirect to matching dashboard
  if (
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/auth") &&
    isAuthenticated
  ) {
    return NextResponse.redirect(
      new URL(getRoleDashboardPath(rawUserRole), request.url),
    );
  }

  // 4. Persistence & Headers
  const response = NextResponse.next();
  const localeCookie =
    request.cookies.get("NEXT_LOCALE")?.value ||
    request.cookies.get("shebamitro_locale")?.value ||
    "bn";

  response.cookies.set("NEXT_LOCALE", localeCookie, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });

  return response;
}

function getRoleDashboardPath(role: string): string {
  const normalizedRole = role.toLowerCase();
  switch (normalizedRole) {
    case "doctor":
      return "/dashboard/doctor";
    case "lab":
      return "/dashboard/lab";
    case "pharmacy":
      return "/dashboard/pharmacy";
    case "admin":
      return "/dashboard/admin";
    case "patient":
    default:
      return "/dashboard/patient";
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/auth"],
};
