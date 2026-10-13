/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import { setCredentials, logout, type User } from "../features/authSlice";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface RequestOtpRequest {
  phone: string;
}

export interface RequestOtpResponse {
  message: string;
  phone: string;
  ttlSeconds: number;
  demoOtp?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface ForgotPasswordResponse {
  message: string;
  identifier: string;
  ttlSeconds: number;
  demoCode?: string;
}

export interface ResetPasswordRequest {
  identifier: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// ---------------------------------------------------------------------------
// Auth API — login, register, logout, refresh, OTP, forgot/reset password
// ---------------------------------------------------------------------------

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response?.data ?? response,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const payload = (data as any)?.data ?? data;
          if (payload?.accessToken) {
            dispatch(
              setCredentials({
                user: payload.user,
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken,
              }),
            );
          }
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response?.data ?? response,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const payload = (data as any)?.data ?? data;
          if (payload?.accessToken) {
            dispatch(
              setCredentials({
                user: payload.user,
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken,
              }),
            );
          }
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ["Auth"],
    }),

    requestOtp: builder.mutation<RequestOtpResponse, RequestOtpRequest>({
      query: (body) => ({
        url: "/auth/request-otp",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data ?? response,
    }),

    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data ?? response,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const payload = (data as any)?.data ?? data;
          if (payload?.accessToken) {
            dispatch(
              setCredentials({
                user: payload.user,
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken || "otp-refresh-token",
              }),
            );
          }
        } catch {
          // Handled by component
        }
      },
      invalidatesTags: ["Auth"],
    }),

    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch {
          dispatch(logout());
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    refreshToken: builder.mutation<RefreshResponse, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
    }),

    getMe: builder.query<User, void>({
      query: () => "/users/me",
      transformResponse: (response: any) => response?.data?.profile ?? response?.data ?? response,
      providesTags: ["User"],
    }),
  }),
});

// ---------------------------------------------------------------------------
// Auto-generated hooks
// ---------------------------------------------------------------------------

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
