"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Siren,
  Menu,
  ChevronDown,
  User,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  TestTube,
  Pill,
  Check,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { MegaMenu } from "@/components/navigation/mega-menu";
import { EmergencySosModal } from "@/components/navigation/emergency-sos-modal";
import { RoleLoginModal, type HealthcareRole } from "@/components/navigation/role-login-modal";
import { MobileNavSheet } from "@/components/navigation/mobile-nav-sheet";
import { ShebaMitroLogo } from "@/components/ui/logo";
import { Footer } from "./components/Footer";
import { useLanguage } from "@/components/providers/language-provider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, initializeAuth, setUser } from "@/redux/features/authSlice";
import { useLogoutMutation, useGetMeQuery } from "@/redux/api/authApi";
import { isTokenValid } from "@/lib/auth/tokenSecurity";

const ROLE_OPTIONS = [
  { role: "patient", name: "Patient Workspace", desc: "Personal Health & Records", icon: User },
  { role: "doctor", name: "Doctor Clinic Workspace", desc: "Chamber & Teleconsultation", icon: Stethoscope },
  { role: "lab", name: "Lab Admin Workspace", desc: "Diagnostic Sample Hub", icon: TestTube },
  { role: "pharmacy", name: "Pharmacy Hub Workspace", desc: "Order Dispatch & Express Rider", icon: Pill },
];

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, accessToken } = useAppSelector((state) => state.auth);

  const [isMounted, setIsMounted] = React.useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = React.useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<HealthcareRole>("patient");
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);

  const profileRef = React.useRef<HTMLDivElement>(null);

  // Sync auth state on client mount
  React.useEffect(() => {
    setIsMounted(true);
    dispatch(initializeAuth());
  }, [dispatch]);

  // Security check: strictly verify accessToken validity and expiration
  const hasValidToken = Boolean(
    (accessToken && isTokenValid(accessToken)) ||
    (isAuthenticated && user) ||
    (typeof window !== "undefined" && Boolean(localStorage.getItem("shebamitro_access_token") || localStorage.getItem("shebamitro_user")))
  );

  const isLoggedIn = isMounted && hasValidToken;

  // Security purge: If token exists in state but has expired or is invalid, log out immediately
  React.useEffect(() => {
    if (accessToken && !isTokenValid(accessToken)) {
      dispatch(logout());
    }
  }, [accessToken, dispatch]);

  // Background fetch user profile if token is valid but user object is incomplete
  const { data: meData } = useGetMeQuery(undefined, {
    skip: !hasValidToken || Boolean(user?.email),
  });

  React.useEffect(() => {
    if (meData && !user) {
      dispatch(setUser(meData));
    }
  }, [meData, user, dispatch]);

  // Close profile dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenRoleModal = (role: HealthcareRole = "patient") => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const [logoutApi] = useLogoutMutation();

  const handleSignOut = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // ignore network errors on logout
    }
    dispatch(logout());
    setIsProfileDropdownOpen(false);
    window.location.href = "/login";
  };

  const userRoleRaw = (user?.role || "patient").toLowerCase();
  const isAdmin = userRoleRaw === "admin";
  const userRoleLower = (isAdmin ? "patient" : userRoleRaw) as HealthcareRole;
  const userInitial = (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase();
  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "User");

  return (
    <div className="min-h-screen flex flex-col bg-bg-app text-fg-app selection:bg-primary-teal/20">
      {/* ── Beautiful Sticky Glassmorphic Navigation Header ─────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-surface-border/80 bg-bg-app/85 backdrop-blur-2xl transition-colors duration-300 shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* 1. Official ShebaMitro Logo */}
          <Link href="/" className="group flex items-center">
            <ShebaMitroLogo size="md" showText={true} />
          </Link>

          {/* 2. Desktop Navigation Mega-Menu */}
          <MegaMenu />

          {/* 3. Right Header Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Language Selector Dropdown (Bangla, English, Hindi) */}
            <LanguageToggle />

            {/* Pulsating Emergency SOS Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-red-500 to-coral-accent text-white font-black text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all duration-300 glow-coral group animate-pulse cursor-pointer"
              aria-label="Trigger Emergency SOS"
            >
              <Siren className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline-block">{t("emergencySos")}</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-400 animate-ping" />
            </button>

            {/* Compact Icon-Only Theme Toggle */}
            <ThemeToggle />

            {/* Auth Dependent: Profile Dropdown or Log In Button */}
            {!isMounted ? (
              <div className="hidden md:inline-block w-24 h-9 rounded-2xl bg-surface-card/40 animate-pulse border border-surface-border/50" />
            ) : isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  id="profile-dropdown-btn"
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 sm:gap-2.5 p-1 sm:p-1.5 sm:pl-2.5 rounded-full border border-surface-border bg-surface-card hover:border-primary-teal/40 hover:bg-surface-card-hover transition-all shadow-xs cursor-pointer active:scale-95"
                  aria-expanded={isProfileDropdownOpen}
                  aria-label="User profile menu"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={displayName}
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover ring-2 ring-primary-teal/30"
                    />
                  ) : (
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-tr from-primary-teal to-emerald-accent text-white font-black flex items-center justify-center text-xs shadow-xs uppercase ring-2 ring-primary-teal/20">
                      {userInitial}
                    </div>
                  )}
                  <span className="hidden sm:inline-block text-xs font-bold text-fg-app capitalize max-w-[110px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-fg mr-1 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180 text-primary-teal" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-2.5 w-72 sm:w-80 rounded-2xl border border-surface-border bg-surface-card p-3 shadow-2xl z-50 space-y-2.5 backdrop-blur-xl"
                      style={{ backgroundColor: "var(--card)" }}
                    >
                      {/* Profile Header Info */}
                      <div className="p-3 rounded-xl bg-muted-bg/60 border border-surface-border flex items-center gap-3">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={displayName}
                            className="h-10 w-10 rounded-xl object-cover ring-2 ring-primary-teal/30 shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-teal to-emerald-accent text-white font-black flex items-center justify-center text-sm shadow-xs uppercase shrink-0">
                            {userInitial}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="font-black text-xs text-fg-app block truncate capitalize">
                            {displayName}
                          </span>
                          <span className="text-[11px] font-medium text-muted-fg block truncate">
                            {user?.email || "Account Active"}
                          </span>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-primary-teal/15 text-primary-teal uppercase tracking-wider">
                          {user?.role || "PATIENT"}
                        </span>
                      </div>

                      {/* Main Navigation Links: Dashboard & Profile */}
                      <div className="space-y-1">
                        <Link
                          href={`/dashboard/${userRoleLower}`}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-fg-app hover:bg-primary-teal/10 hover:text-primary-teal transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-1.5 rounded-lg bg-primary-teal/10 text-primary-teal group-hover:bg-primary-teal group-hover:text-white transition-colors shrink-0">
                              <LayoutDashboard className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block font-black text-xs">Dashboard</span>
                              <span className="block text-[10px] text-muted-fg font-medium truncate">
                                {userRoleLower.charAt(0).toUpperCase() + userRoleLower.slice(1)} Workspace
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-fg group-hover:text-primary-teal group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-fg-app hover:bg-primary-teal/10 hover:text-primary-teal transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-1.5 rounded-lg bg-emerald-accent/10 text-emerald-accent group-hover:bg-emerald-accent group-hover:text-white transition-colors shrink-0">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block font-black text-xs">Profile</span>
                              <span className="block text-[10px] text-muted-fg font-medium truncate">
                                Account & Personal Details
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-fg group-hover:text-primary-teal group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      </div>

                      {/* Switch Workspace / Role Section - Only for Admins */}
                      {isAdmin && (
                        <div className="space-y-1.5 pt-1.5 border-t border-surface-border">
                          <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-fg">
                              Switch Workspace / Role
                            </span>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              Admin Mode
                            </span>
                          </div>
                          <div className="space-y-1">
                            {ROLE_OPTIONS.map((ws) => {
                              const Icon = ws.icon;
                              const isSelected = userRoleLower === ws.role;

                              return (
                                <Link
                                  key={ws.role}
                                  href={`/dashboard/${ws.role}`}
                                  onClick={() => setIsProfileDropdownOpen(false)}
                                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-all ${
                                    isSelected
                                      ? "bg-primary-teal/15 text-primary-teal font-black border border-primary-teal/30 shadow-2xs"
                                      : "text-fg-app hover:bg-muted-bg/70 font-semibold"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <Icon className="h-4 w-4 shrink-0 text-primary-teal" />
                                    <div className="min-w-0">
                                      <span className="block text-xs truncate">{ws.name}</span>
                                      <span className="block text-[10px] text-muted-fg truncate font-medium">
                                        {ws.desc}
                                      </span>
                                    </div>
                                  </div>
                                  {isSelected && <Check className="h-4 w-4 text-primary-teal shrink-0" />}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Sign Out */}
                      <div className="pt-2 border-t border-surface-border">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <LogOut className="h-4 w-4" /> Sign Out
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Direct Login link to /login when not authenticated */
              <Link
                href="/login"
                className="hidden md:inline-flex items-center gap-2 px-4.5 py-2 rounded-2xl border border-primary-teal/40 bg-surface-card/90 backdrop-blur-md text-xs font-bold text-fg-app hover:border-primary-teal hover:bg-primary-teal hover:text-white transition-all duration-300 shadow-xs group cursor-pointer"
              >
                <User className="w-4 h-4 text-primary-teal group-hover:text-white group-hover:scale-110 transition-transform" />
                <span>{t("logIn")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-fg group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2.5 rounded-2xl border border-surface-border bg-surface-card text-fg-app hover:bg-muted-bg transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Page Content ───────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Public Multi-Column Footer ──────────────────── */}
      <Footer />

      {/* ── Modals & Drawers ───────────────────────────────── */}
      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      <RoleLoginModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        defaultRole={selectedRole}
      />

      <MobileNavSheet
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSosModal={() => setIsSosModalOpen(true)}
        onOpenRoleModal={handleOpenRoleModal}
      />
    </div>
  );
}
