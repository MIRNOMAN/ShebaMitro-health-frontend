import { z } from "zod";

const bangladeshiPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .regex(
      bangladeshiPhoneRegex,
      "Enter a valid Bangladeshi phone number (e.g. 01712345678 or +8801712345678)"
    ),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP code must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP code must contain numbers only"),
});

export const passwordLoginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Enter your phone number or email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  role: z.enum(["patient", "doctor", "lab", "pharmacy"]),
});

export type PhoneFormValues = z.infer<typeof phoneSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type PasswordLoginFormValues = z.infer<typeof passwordLoginSchema>;
