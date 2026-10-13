"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  Calendar,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Pill,
  TestTube,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { useLogoutMutation, useGetMeQuery } from "@/redux/api/authApi";
import { isTokenValid } from "@/lib/auth/tokenSecurity";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasValidToken = Boolean(
    (accessToken && isTokenValid(accessToken)) ||
    (isAuthenticated && user) ||
    (typeof window !== "undefined" && Boolean(localStorage.getItem("shebamitro_access_token") || localStorage.getItem("shebamitro_user")))
  );

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !hasValidToken,
  });

  const currentUser = meData || user;

  useEffect(() => {
    if (mounted && !hasValidToken) {
      router.push("/login?redirect=/profile");
    }
  }, [mounted, hasValidToken, router]);

  const handleSignOut = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // ignore network errors
    }
    dispatch(logout());
    window.location.href = "/login";
  };

  if (!mounted || !hasValidToken) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 rounded-3xl border border-surface-border bg-surface-card animate-pulse space-y-4 text-center">
          <div className="h-20 w-20 rounded-full bg-muted-bg mx-auto" />
          <div className="h-6 w-48 bg-muted-bg rounded-lg mx-auto" />
          <div className="h-4 w-32 bg-muted-bg rounded-lg mx-auto" />
        </div>
      </div>
    );
  }

  const roleRaw = (currentUser?.role || "patient").toLowerCase();
  const displayName = currentUser?.name || (currentUser?.email ? currentUser.email.split("@")[0] : "User");
  const userInitial = (currentUser?.name?.[0] || currentUser?.email?.[0] || "U").toUpperCase();

  const getRoleMeta = (r: string) => {
    switch (r) {
      case "doctor":
        return {
          title: "BMDC Verified Doctor",
          icon: Stethoscope,
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
          dashboardPath: "/dashboard/doctor",
        };
      case "lab":
        return {
          title: "Diagnostic Lab Specialist",
          icon: TestTube,
          color: "text-violet-500 bg-violet-500/10 border-violet-500/30",
          dashboardPath: "/dashboard/lab",
        };
      case "pharmacy":
        return {
          title: "Licensed Pharmacy Partner",
          icon: Pill,
          color: "text-coral-accent bg-coral-accent/10 border-coral-accent/30",
          dashboardPath: "/dashboard/pharmacy",
        };
      case "admin":
        return {
          title: "System Administrator",
          icon: Shield,
          color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
          dashboardPath: "/dashboard/admin",
        };
      case "patient":
      default:
        return {
          title: "ShebaMitro Smart Patient",
          icon: User,
          color: "text-primary-teal bg-primary-teal/10 border-primary-teal/30",
          dashboardPath: "/dashboard/patient",
        };
    }
  };

  const roleMeta = getRoleMeta(roleRaw);
  const RoleIcon = roleMeta.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* ── Top Header Banner Card ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-10 shadow-xl backdrop-blur-xl"
      >
        {/* Glow bubble decorative accents */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-teal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
            {/* User Avatar */}
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={displayName}
                className="h-24 w-24 rounded-3xl object-cover ring-4 ring-primary-teal/20 shadow-lg"
              />
            ) : (
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-primary-teal to-emerald-accent text-white font-black text-3xl flex items-center justify-center shadow-lg uppercase ring-4 ring-primary-teal/20">
                {userInitial}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight capitalize">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-muted-fg font-medium">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-primary-teal" />
                  {currentUser?.email || "No email registered"}
                </span>
                {currentUser?.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-accent" />
                      {currentUser.phone}
                    </span>
                  </>
                )}
              </div>

              <div className="pt-1">
                <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl border ${roleMeta.color}`}>
                  <RoleIcon className="w-3.5 h-3.5" />
                  {roleMeta.title}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <Link
              href={roleMeta.dashboardPath}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-primary-teal text-white font-bold text-xs shadow-md glow-teal hover:brightness-110 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border border-surface-border bg-surface-card hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-500 font-bold text-xs transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Profile Details Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-2 rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-8 space-y-6 shadow-md"
        >
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal">
                <User className="w-5 h-5" />
              </div>
              <h2 className="font-black text-lg text-fg-app">Account Information</h2>
            </div>
            <span className="text-xs font-bold text-muted-fg">Role: {roleRaw.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-muted-bg/50 border border-surface-border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-fg">Full Name</span>
              <p className="font-black text-sm text-fg-app capitalize">{displayName}</p>
            </div>

            <div className="p-4 rounded-2xl bg-muted-bg/50 border border-surface-border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-fg">Email Address</span>
              <p className="font-bold text-sm text-fg-app truncate">{currentUser?.email || "—"}</p>
            </div>

            <div className="p-4 rounded-2xl bg-muted-bg/50 border border-surface-border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-fg">Phone Number</span>
              <p className="font-bold text-sm text-fg-app">{currentUser?.phone || "+880 (Not linked)"}</p>
            </div>

            <div className="p-4 rounded-2xl bg-muted-bg/50 border border-surface-border space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-fg">Account Type</span>
              <p className="font-black text-sm text-primary-teal uppercase">{roleRaw} Workspace</p>
            </div>
          </div>

          {/* Quick Access to Workspace */}
          <div className="pt-2">
            <Link
              href={roleMeta.dashboardPath}
              className="flex items-center justify-between p-4 rounded-2xl border border-primary-teal/30 bg-primary-teal/5 hover:bg-primary-teal/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-teal text-white shadow-xs">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-fg-app group-hover:text-primary-teal transition-colors">
                    Access {roleRaw.charAt(0).toUpperCase() + roleRaw.slice(1)} Dashboard
                  </h3>
                  <p className="text-xs text-muted-fg">
                    Manage appointments, prescriptions, alarms, and clinical workflows.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-primary-teal group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Security & Credentials Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-8 space-y-6 shadow-md flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-surface-border pb-4">
              <div className="p-2 rounded-xl bg-emerald-accent/10 text-emerald-accent">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-black text-lg text-fg-app">Security & Privacy</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted-bg/50 border border-surface-border text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-bold text-fg-app block">256-Bit SSL Encrypted</span>
                  <span className="text-[11px] text-muted-fg">HIPAA / GDPR compliant</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted-bg/50 border border-surface-border text-xs">
                <Sparkles className="w-5 h-5 text-primary-teal shrink-0" />
                <div>
                  <span className="font-bold text-fg-app block">Single Sign-On Active</span>
                  <span className="text-[11px] text-muted-fg">Multi-Role Session Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border text-center space-y-2">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full text-rose-500 border-rose-500/20 hover:bg-rose-500/10 justify-center gap-2 font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of All Devices</span>
            </Button>
            <p className="text-[10px] text-muted-fg">
              ShebaMitro Healthcare Ecosystem v1.0
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
