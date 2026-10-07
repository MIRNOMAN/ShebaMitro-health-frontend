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
// Helper: Sync with Cookies & LocalStorage for Next.js Middleware & Persistence
// ---------------------------------------------------------------------------

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
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
    const savedUser = localStorage.getItem("shebamitro_user");
    const savedAccessToken = localStorage.getItem("shebamitro_access_token");
    const savedRefreshToken = localStorage.getItem("shebamitro_refresh_token");

    if (savedAccessToken && savedUser) {
      const parsedUser = JSON.parse(savedUser) as User;
      return {
        user: parsedUser,
        accessToken: savedAccessToken,
        refreshToken: savedRefreshToken,
        isAuthenticated: true,
      };
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
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("shebamitro_user", JSON.stringify(action.payload));
        setCookie("sheba_role", action.payload.role.toLowerCase());
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

      if (typeof window !== "undefined") {
        localStorage.removeItem("shebamitro_user");
        localStorage.removeItem("shebamitro_access_token");
        localStorage.removeItem("shebamitro_refresh_token");
        deleteCookie("sheba_session");
        deleteCookie("sheba_role");
        deleteCookie("sheba_token");
        deleteCookie("access_token");
        deleteCookie("refresh_token");
      }
    },
  },
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export const { setCredentials, setUser, updateAccessToken, logout } =
  authSlice.actions;

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
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
