"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { passwordLoginSchema } from "../schemas/authSchema";
import { UserRole } from "../types";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/redux/api/authApi";

interface PasswordLoginFormProps {
  role: UserRole;
  onSuccessAuth?: (role: UserRole) => void;
}

const DEMO_ACCOUNTS: Record<UserRole, { email: string; pass: string }> = {
  patient: { email: "patient@shebamitro.health", pass: "Password123!" },
  doctor: { email: "doctor@shebamitro.health", pass: "Password123!" },
  pharmacy: { email: "pharmacy@shebamitro.health", pass: "Password123!" },
  lab: { email: "lab@shebamitro.health", pass: "Password123!" },
  admin: { email: "admin@shebamitro.health", pass: "Password123!" },
};

export function PasswordLoginForm({ role, onSuccessAuth }: PasswordLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [identifier, setIdentifier] = useState<string>(DEMO_ACCOUNTS[role]?.email || "");
  const [password, setPassword] = useState<string>("Password123!");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  // Auto-fill when role changes for delightful developer / tester UX
  useEffect(() => {
    if (DEMO_ACCOUNTS[role]) {
      setIdentifier(DEMO_ACCOUNTS[role].email);
      setPassword(DEMO_ACCOUNTS[role].pass);
    }
  }, [role]);

  const handleQuickDemoFill = (targetRole: UserRole) => {
    const demo = DEMO_ACCOUNTS[targetRole];
    if (demo) {
      setIdentifier(demo.email);
      setPassword(demo.pass);
      toast.info(`Filled demo credentials for ${targetRole.toUpperCase()}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrimmed = identifier.trim();

    const result = passwordLoginSchema.safeParse({
      identifier: emailTrimmed,
      password,
      role,
    });

    if (!result.success) {
      const msg = result.error.issues[0]?.message || "Please check your inputs";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    try {
      const response = await login({
        email: emailTrimmed,
        password,
      }).unwrap();

      toast.success(`Welcome back! Logged in as ${response.user?.role || role.toUpperCase()}`);

      if (onSuccessAuth) {
        onSuccessAuth(role);
      }

      // Determine target destination
      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      const userRole = (response.user?.role || role).toLowerCase();
      switch (userRole) {
        case "doctor":
          router.push("/dashboard/doctor");
          break;
        case "lab":
          router.push("/dashboard/lab");
          break;
        case "pharmacy":
          router.push("/dashboard/pharmacy");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "patient":
        default:
          router.push("/dashboard/patient");
          break;
      }
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string | string[] }; status?: number };
      const rawMsg = apiError?.data?.message;
      const errorMsg = Array.isArray(rawMsg)
        ? rawMsg.join(", ")
        : rawMsg || "Invalid credentials. Please verify your email and password.";

      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
          Email Address <span className="text-rose-500">*</span>
        </label>
        <div className="relative flex items-center group">
          <Mail className="absolute left-3.5 h-4 w-4 text-muted-fg group-focus-within:text-primary-teal transition-colors pointer-events-none" />
          <input
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={`Enter your ${role} email`}
            required
            className="w-full h-12 pl-10 pr-4 rounded-2xl bg-surface-card border border-surface-border text-sm text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-muted-fg">
            Password <span className="text-rose-500">*</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary-teal hover:underline font-bold"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative flex items-center group">
          <Lock className="absolute left-3.5 h-4 w-4 text-muted-fg group-focus-within:text-primary-teal transition-colors pointer-events-none" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full h-12 pl-10 pr-11 rounded-2xl bg-surface-card border border-surface-border text-sm text-fg-app placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-all shadow-xs"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 text-muted-fg hover:text-fg-app transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-500 animate-in fade-in duration-200">
          {errorMessage}
        </div>
      )}

      {/* Submit CTA Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 justify-center text-sm font-black uppercase tracking-wider rounded-2xl bg-gradient-to-r from-primary-teal via-teal-500 to-emerald-accent text-white shadow-lg shadow-primary-teal/25 hover:shadow-primary-teal/40 hover:brightness-110 transition-all cursor-pointer"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Authenticating {role.toUpperCase()}...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Sign In as {role.toUpperCase()} <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>

      {/* Quick Demo Credentials Autofill Bar */}
      <div className="pt-2">
        <div className="p-3.5 rounded-2xl bg-muted-bg/60 border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-extrabold text-fg-app flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary-teal" />
              1-Click Demo Fill:
            </span>
            <span className="text-muted-fg text-[10px]">Pass: Password123!</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(["patient", "doctor", "pharmacy", "lab", "admin"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleQuickDemoFill(r)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                  role === r
                    ? "bg-primary-teal/20 text-primary-teal border-primary-teal/40 font-extrabold"
                    : "bg-surface-card border-surface-border text-muted-fg hover:text-fg-app hover:border-primary-teal/30"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
