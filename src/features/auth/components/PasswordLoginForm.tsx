"use client";

import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { passwordLoginSchema } from "../schemas/authSchema";
import { UserRole } from "../types";
import { Button } from "@/components/ui/button";

interface PasswordLoginFormProps {
  role: UserRole;
  onSuccessAuth: (role: UserRole) => void;
}

export function PasswordLoginForm({ role, onSuccessAuth }: PasswordLoginFormProps) {
  const [identifier, setIdentifier] = useState<string>("01712345678");
  const [password, setPassword] = useState<string>("password123");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = passwordLoginSchema.safeParse({ identifier, password, role });
    if (!result.success) {
      setErrorMessage(result.error.issues[0]?.message || "Invalid credentials format");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessAuth(role);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Identifier Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Phone Number or Email
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="01712345678 or doctor@shebamitro.health"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-card-border text-sm text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <a href="#forgot" className="text-xs text-primary-teal hover:underline font-semibold">
            Forgot password?
          </a>
        </div>
        <div className="relative flex items-center">
          <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-card border border-card-border text-sm text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal transition-all shadow-xs"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-muted-foreground hover:text-fg-app"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs font-semibold text-rose-500 pt-0.5">{errorMessage}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="w-full h-11 justify-center text-sm shadow-md"
      >
        {isSubmitting ? (
          "Signing in..."
        ) : (
          <span className="flex items-center gap-1.5">
            Sign In as {role.toUpperCase()} <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
