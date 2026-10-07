export type UserRole = "patient" | "doctor" | "lab" | "pharmacy" | "admin";

export type AuthMode = "otp" | "password";

export interface UserSession {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  token: string;
  expiresAt: number;
}
