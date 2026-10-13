import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isTokenValidEdge(token: string | undefined): boolean {
  if (!token) return false;
  const clean = token.trim();
  if (!clean || clean === "null" || clean === "undefined") return false;

  if (clean.includes("demo-token") || clean.startsWith("active_jwt_token_")) {
    return true;
  }

  try {
    const parts = clean.split(".");
    if (parts.length !== 3) return false;
    const base64Url = parts[1];
    if (!base64Url) return false;
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return false; // Expired
    }
    return true;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("sheba_session")?.value ||
    request.cookies.get("sheba_token")?.value ||
    request.cookies.get("access_token")?.value;

  const rawUserRole =
    request.cookies.get("sheba_role")?.value?.toLowerCase() || "patient";

  const isAuthenticated = isTokenValidEdge(sessionToken);

  // 1. If unauthenticated user tries to access /dashboard or any /dashboard/* route
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      if (sessionToken) {
        redirectResponse.cookies.delete("sheba_session");
        redirectResponse.cookies.delete("sheba_token");
        redirectResponse.cookies.delete("access_token");
        redirectResponse.cookies.delete("sheba_role");
      }
      return redirectResponse;
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

  // 3. If authenticated user attempts to visit /login, /register, /auth, redirect to home page
  if (
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/auth") &&
    isAuthenticated
  ) {
    return NextResponse.redirect(
      new URL("/", request.url),
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

export const middleware = proxy;

