import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get("sheba_session")?.value;
  const userRole = request.cookies.get("sheba_role")?.value || "patient";

  const isAuthenticated = Boolean(sessionToken);

  // 1. If unauthenticated user tries to access /dashboard or any /dashboard/* route
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Strict Role-Based Access Control (RBAC) Enforcement
    // Check path matching rules
    if (pathname.startsWith("/dashboard/doctor") && userRole !== "doctor") {
      return NextResponse.redirect(new URL(getRoleDashboardPath(userRole), request.url));
    }

    if (pathname.startsWith("/dashboard/lab") && userRole !== "lab") {
      return NextResponse.redirect(new URL(getRoleDashboardPath(userRole), request.url));
    }

    if (pathname.startsWith("/dashboard/pharmacy") && userRole !== "pharmacy") {
      return NextResponse.redirect(new URL(getRoleDashboardPath(userRole), request.url));
    }

    if (pathname.startsWith("/dashboard/patient") && userRole !== "patient") {
      return NextResponse.redirect(new URL(getRoleDashboardPath(userRole), request.url));
    }
  }

  // 3. If authenticated user attempts to visit public /auth page, redirect to matching dashboard
  if (pathname === "/auth" && isAuthenticated) {
    return NextResponse.redirect(new URL(getRoleDashboardPath(userRole), request.url));
  }

  // 4. Automatic Token Refresh & Locale Cookie Persistence
  const response = NextResponse.next();
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value || request.cookies.get("shebamitro_locale")?.value || "bn";

  response.cookies.set("NEXT_LOCALE", localeCookie, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });

  if (isAuthenticated && sessionToken) {
    response.cookies.set("sheba_session", sessionToken, {
      path: "/",
      maxAge: 86400, // Extend 24 hours
      sameSite: "lax",
    });
    response.cookies.set("sheba_role", userRole, {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
    });
  }

  return response;
}

function getRoleDashboardPath(role: string): string {
  switch (role) {
    case "doctor":
      return "/dashboard/doctor";
    case "lab":
      return "/dashboard/lab";
    case "pharmacy":
      return "/dashboard/pharmacy";
    case "patient":
    default:
      return "/dashboard/patient";
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
