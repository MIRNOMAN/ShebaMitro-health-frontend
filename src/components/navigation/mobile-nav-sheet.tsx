"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Siren,
  ChevronRight,
  User,
  Stethoscope,
  TestTube,
  Pill,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ShebaMitroLogo } from "@/components/ui/logo";
import { megaMenuConfig } from "./mega-menu";
import type { HealthcareRole } from "./role-login-modal";
import { useLanguage } from "@/components/providers/language-provider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, initializeAuth } from "@/redux/features/authSlice";
import { useLogoutMutation } from "@/redux/api/authApi";

interface MobileNavSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSosModal: () => void;
  onOpenRoleModal: (role: HealthcareRole) => void;
}

export function MobileNavSheet({
  isOpen,
  onClose,
  onOpenSosModal,
  onOpenRoleModal,
}: MobileNavSheetProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  React.useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const [logoutApi] = useLogoutMutation();

  const handleSignOut = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // ignore network errors on logout
    }
    dispatch(logout());
    onClose();
    window.location.href = "/login";
  };

  const userRoleRaw = (user?.role || "patient").toLowerCase();
  const isAdmin = userRoleRaw === "admin";
  const userRoleLower = (isAdmin ? "patient" : userRoleRaw) as HealthcareRole;
  const userInitial = (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase();
  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "User");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Slide-out Panel with Spring Physics */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-surface-card border-l border-surface-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto backdrop-blur-2xl z-10 space-y-6"
          >
            {/* Sheet Header */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-surface-border/60 pb-4">
                <Link href="/" onClick={onClose}>
                  <ShebaMitroLogo size="sm" showText={true} />
                </Link>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-muted-fg hover:text-fg-app hover:bg-muted-bg transition-colors"
                  aria-label="Close navigation panel"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Authenticated User Quick Card */}
              {isAuthenticated && user && (
                <div className="p-3.5 rounded-2xl bg-muted-bg/50 border border-surface-border flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-teal text-white font-black flex items-center justify-center text-sm shadow-xs uppercase shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-black text-xs text-fg-app block truncate capitalize">
                      {displayName}
                    </span>
                    <span className="text-[11px] font-medium text-muted-fg block truncate">
                      {user.email}
                    </span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-primary-teal/15 text-primary-teal uppercase">
                    {user.role}
                  </span>
                </div>
              )}

              {/* Emergency SOS Button */}
              <button
                onClick={() => {
                  onClose();
                  onOpenSosModal();
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-coral-accent text-white font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 glow-coral animate-pulse cursor-pointer"
              >
                <Siren className="w-4 h-4" />
                <span>{t("emergencySosFull")}</span>
              </button>

              {/* Navigation Accordion */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-fg px-1">
                  Healthcare Services
                </p>

                {megaMenuConfig.map((menu) => {
                  const isExpanded = expandedSection === menu.id;

                  return (
                    <div
                      key={menu.id}
                      className="rounded-2xl border border-surface-border/60 bg-surface-card/60 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(menu.id)}
                        className="w-full flex items-center justify-between p-3 text-left font-bold text-sm text-fg-app hover:bg-muted-bg/50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className={menu.accentColor}>{menu.icon}</span>
                          <span>{t(menu.labelKey)}</span>
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 text-muted-fg transition-transform duration-300 ${
                            isExpanded ? "rotate-90 text-primary-teal" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="p-3 pt-0 border-t border-surface-border/40 space-y-1 bg-muted-bg/30">
                          {menu.subItems.map((sub) => (
                            <Link
                              key={sub.titleKey}
                              href={sub.href}
                              onClick={onClose}
                              className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-muted-fg hover:text-fg-app hover:bg-surface-card transition-colors"
                            >
                              {sub.icon}
                              <span>{t(sub.titleKey)}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Role Section: Guest Login Options OR Admin Workspace Links */}
              {!isAuthenticated ? (
                <div className="space-y-2 pt-2 border-t border-surface-border/60">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-fg px-1">
                    Access Portal Roles
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenRoleModal("patient");
                      }}
                      className="p-2.5 rounded-xl border border-primary-teal/30 bg-primary-teal/10 text-primary-teal text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{t("patientRole")}</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenRoleModal("doctor");
                      }}
                      className="p-2.5 rounded-xl border border-emerald-accent/30 bg-emerald-accent/10 text-emerald-accent text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>{t("doctorRole")}</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenRoleModal("lab");
                      }}
                      className="p-2.5 rounded-xl border border-violet-accent/30 bg-violet-accent/10 text-violet-accent text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <TestTube className="w-3.5 h-3.5" />
                      <span>{t("labRole")}</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenRoleModal("pharmacy");
                      }}
                      className="p-2.5 rounded-xl border border-coral-accent/30 bg-coral-accent/10 text-coral-accent text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>{t("pharmacyRole")}</span>
                    </button>
                  </div>
                </div>
              ) : isAdmin ? (
                <div className="space-y-2 pt-2 border-t border-surface-border/60">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-fg">
                      Admin Workspaces
                    </p>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      Admin Mode
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/dashboard/patient"
                      onClick={onClose}
                      className="p-2.5 rounded-xl border border-primary-teal/30 bg-primary-teal/10 text-primary-teal text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Patient</span>
                    </Link>
                    <Link
                      href="/dashboard/doctor"
                      onClick={onClose}
                      className="p-2.5 rounded-xl border border-emerald-accent/30 bg-emerald-accent/10 text-emerald-accent text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Doctor</span>
                    </Link>
                    <Link
                      href="/dashboard/lab"
                      onClick={onClose}
                      className="p-2.5 rounded-xl border border-violet-accent/30 bg-violet-accent/10 text-violet-accent text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <TestTube className="w-3.5 h-3.5" />
                      <span>Lab Admin</span>
                    </Link>
                    <Link
                      href="/dashboard/pharmacy"
                      onClick={onClose}
                      className="p-2.5 rounded-xl border border-coral-accent/30 bg-coral-accent/10 text-coral-accent text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>Pharmacy</span>
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Sheet Footer */}
            <div className="space-y-4 border-t border-surface-border/60 pt-4">
              <div className="flex items-center justify-between">
                <LanguageToggle />
                <ThemeToggle />
              </div>

              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <Link
                    href={`/dashboard/${userRoleLower}`}
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-primary-teal text-white font-bold text-xs shadow-md glow-teal hover:brightness-110 transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Go to Dashboard</span>
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="md"
                    className="w-full justify-center font-bold text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    onClose();
                    onOpenRoleModal("patient");
                  }}
                  variant="primary"
                  size="md"
                  className="w-full justify-center font-bold cursor-pointer"
                >
                  {t("logIn")}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
