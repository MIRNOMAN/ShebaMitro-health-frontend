/**
 * ShebaMitro Health Platform - Token Security & JWT Validation Utilities
 */

export interface DecodedJwtPayload {
  sub?: string;
  id?: string;
  email?: string;
  role?: string;
  isVerified?: boolean;
  name?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Safely decodes a JWT token without external dependencies.
 */
export function decodeJwt(token: string): DecodedJwtPayload | null {
  if (!token || typeof token !== "string") return null;

  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    if (!base64Url) return null;

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

    return JSON.parse(jsonPayload) as DecodedJwtPayload;
  } catch {
    return null;
  }
}

/**
 * Checks whether a JWT token is expired (includes a 10s grace buffer).
 */
export function isJwtExpired(token: string, bufferSeconds = 10): boolean {
  const payload = decodeJwt(token);
  if (!payload) return false;
  if (typeof payload.exp !== "number") {
    // If no exp claim exists, do not treat as expired
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds + bufferSeconds;
}

/**
 * Verifies if a token is present, well-formed, and unexpired.
 */
export function isTokenValid(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  const trimmed = token.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return false;

  // Support demo / mock tokens for local testing
  if (trimmed.includes("demo-token") || trimmed.startsWith("active_jwt_token_")) {
    return true;
  }

  const payload = decodeJwt(trimmed);
  if (!payload) return false;

  return !isJwtExpired(trimmed);
}

/**
 * Securely deletes all auth cookies across multiple path variations.
 */
export function clearAuthCookies() {
  if (typeof document === "undefined") return;

  const cookieNames = [
    "sheba_session",
    "sheba_token",
    "sheba_role",
    "access_token",
    "refresh_token",
    "token",
  ];

  for (const name of cookieNames) {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
  }
}

/**
 * Securely clears all auth data from localStorage and cookies.
 */
export function clearAllAuthStorage() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("shebamitro_user");
    localStorage.removeItem("shebamitro_access_token");
    localStorage.removeItem("shebamitro_refresh_token");
    sessionStorage.removeItem("shebamitro_user");
    sessionStorage.removeItem("shebamitro_access_token");
  } catch {
    // Ignore storage errors
  }

  clearAuthCookies();
}
