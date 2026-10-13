import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserRole =
  | "PATIENT"
  | "DOCTOR"
  | "LAB"
  | "PHARMACY"
  | "ADMIN"
  | "patient"
  | "doctor"
  | "lab"
  | "pharmacy"
  | "admin";

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// ---------------------------------------------------------------------------
import {
  decodeJwt,
  isTokenValid,
  clearAllAuthStorage,
} from "@/lib/auth/tokenSecurity";

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]!) : null;
}

const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    };
  }

  try {
    const savedAccessToken =
      localStorage.getItem("shebamitro_access_token") ||
      getCookie("sheba_session") ||
      getCookie("sheba_token");

    // Strictly validate token presence and expiration
    if (savedAccessToken && isTokenValid(savedAccessToken)) {
      const savedUser = localStorage.getItem("shebamitro_user");
      const savedRefreshToken = localStorage.getItem("shebamitro_refresh_token");
      let parsedUser = savedUser ? (JSON.parse(savedUser) as User) : null;

      // If user object was missing in localStorage, rebuild from JWT payload
      if (!parsedUser) {
        const decoded = decodeJwt(savedAccessToken);
        if (decoded) {
          parsedUser = {
            id: (decoded.sub || decoded.id || "") as string,
            email: (decoded.email || "") as string,
            role: (decoded.role || "patient") as UserRole,
            isVerified: Boolean(decoded.isVerified),
            name: decoded.name as string | undefined,
          };
        }
      }

      return {
        user: parsedUser,
        accessToken: savedAccessToken,
        refreshToken: savedRefreshToken || null,
        isAuthenticated: true,
      };
    } else if (savedAccessToken) {
      // Purge invalid or expired token
      clearAllAuthStorage();
    }
  } catch {
    // Ignore storage parse errors
  }

  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = getInitialState();

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Hydrate auth state from localStorage and cookies on client mount.
     */
    initializeAuth: (state) => {
      if (typeof window === "undefined") return;
      try {
        const savedAccessToken =
          localStorage.getItem("shebamitro_access_token") ||
          getCookie("sheba_session") ||
          getCookie("sheba_token");
        const savedRefreshToken = localStorage.getItem("shebamitro_refresh_token");
        const savedUser = localStorage.getItem("shebamitro_user");

        // Validate token integrity and expiration
        if (savedAccessToken && isTokenValid(savedAccessToken)) {
          state.accessToken = savedAccessToken;
          state.refreshToken = savedRefreshToken || null;
          state.isAuthenticated = true;

          if (savedUser) {
            state.user = JSON.parse(savedUser) as User;
          } else {
            // Reconstruct user from JWT payload if missing
            const decoded = decodeJwt(savedAccessToken);
            if (decoded) {
              state.user = {
                id: (decoded.sub || decoded.id || "") as string,
                email: (decoded.email || "") as string,
                role: (decoded.role || "patient") as UserRole,
                isVerified: Boolean(decoded.isVerified),
                name: decoded.name as string | undefined,
              };
            }
          }
        } else {
          // Token is expired, invalid, or absent — purge all credentials
          if (savedAccessToken) {
            clearAllAuthStorage();
          }
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
        }
      } catch (e) {
        console.error("Auth hydration error:", e);
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      }
    },

    /**
     * Set user + tokens after login/register.
     */
    setCredentials: (
      state,
      action: PayloadAction<{
        user?: User;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      const { user, accessToken, refreshToken } = action.payload;

      if (user) {
        state.user = user;
      }

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        if (user) {
          localStorage.setItem("shebamitro_user", JSON.stringify(user));
          setCookie("sheba_role", user.role.toLowerCase());
        }
        localStorage.setItem("shebamitro_access_token", accessToken);
        localStorage.setItem("shebamitro_refresh_token", refreshToken);
        setCookie("sheba_session", accessToken);
        setCookie("sheba_token", accessToken);
      }
    },

    /**
     * Update only the user profile.
     */
    setUser: (state, action: PayloadAction<User>) => {
      const merged = {
        ...state.user,
        ...action.payload,
        avatar: action.payload.avatar || state.user?.avatar,
      };
      state.user = merged as User;
      if (typeof window !== "undefined") {
        localStorage.setItem("shebamitro_user", JSON.stringify(merged));
        if (merged.role) {
          setCookie("sheba_role", merged.role.toLowerCase());
        }
      }
    },

    /**
     * Update access token only (e.g. after silent refresh).
     */
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("shebamitro_access_token", action.payload);
        setCookie("sheba_session", action.payload);
        setCookie("sheba_token", action.payload);
      }
    },

    /**
     * Clear all auth state — full logout.
     */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      clearAllAuthStorage();
    },
  },
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export const { initializeAuth, setCredentials, setUser, updateAccessToken, logout } =
  authSlice.actions;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectHasValidAccessToken = (state: RootState) =>
  Boolean(state.auth.accessToken && isTokenValid(state.auth.accessToken));
export const selectUserRole = (state: RootState) => state.auth.user?.role ?? null;

export const selectHasRole = (
  state: RootState,
  roles: Array<string>,
): boolean => {
  const userRole = state.auth.user?.role;
  if (!userRole) return false;
  return roles
    .map((r) => r.toLowerCase())
    .includes(userRole.toLowerCase());
};

// ---------------------------------------------------------------------------
// Reducer export
// ---------------------------------------------------------------------------

export default authSlice.reducer;
