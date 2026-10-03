"use client";

import * as React from "react";
import Link from "next/link";
import {
  HeartPulse,
  Siren,
  Menu,
  ChevronDown,
  User,
  Stethoscope,
  TestTube,
  Pill,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MegaMenu } from "@/components/navigation/mega-menu";
import { EmergencySosModal } from "@/components/navigation/emergency-sos-modal";
import { RoleLoginModal, type HealthcareRole } from "@/components/navigation/role-login-modal";
import { MobileNavSheet } from "@/components/navigation/mobile-nav-sheet";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSosModalOpen, setIsSosModalOpen] = React.useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<HealthcareRole>("patient");
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  const handleOpenRoleModal = (role: HealthcareRole = "patient") => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-app text-fg-app selection:bg-primary-teal/20">
      {/* ── Sticky Glassmorphic Navigation Header ──────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-bg-app/80 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* 1. Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-teal via-emerald-accent to-violet-accent flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform duration-300 glow-teal">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-primary-teal via-emerald-accent to-violet-accent bg-clip-text text-transparent font-black text-2xl tracking-tight">
                ShebaMitro
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-fg -mt-1">
                Healthcare Ecosystem
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Mega-Menu */}
          <MegaMenu />

          {/* 3. Header Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Pulsating Emergency SOS Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-red-700 transition-all duration-300 glow-coral group animate-pulse"
              aria-label="Trigger Emergency SOS"
            >
              <Siren className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline-block">SOS 24/7</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-400 animate-ping" />
            </button>

            {/* Theme Toggle Button */}
            <div className="hidden sm:inline-block">
              <ThemeToggle />
            </div>

            {/* Login / Signup with Role Badge Selector */}
            <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-surface-card/80 border border-surface-border backdrop-blur-md shadow-sm">
              <button
                onClick={() => handleOpenRoleModal("patient")}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-fg-app hover:bg-muted-bg transition-colors flex items-center gap-1.5"
                title="Select role &amp; sign in"
              >
                <User className="w-3.5 h-3.5 text-primary-teal" />
                <span>Log In</span>
                <ChevronDown className="w-3 h-3 text-muted-fg" />
              </button>

              <Button
                onClick={() => handleOpenRoleModal("patient")}
                variant="primary"
                size="sm"
                className="text-xs font-bold px-3.5 h-8 rounded-xl"
              >
                Sign Up
              </Button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2.5 rounded-2xl border border-surface-border bg-surface-card text-fg-app hover:bg-muted-bg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Public Layout Footer ───────────────────────────── */}
      <footer className="border-t border-surface-border py-12 bg-surface-card/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-teal/15 text-primary-teal flex items-center justify-center font-bold">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-sm">ShebaMitro Health Platform</p>
                <p className="text-xs text-muted-fg">Connected Digital Healthcare for Everyone</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-fg">
              <button onClick={() => handleOpenRoleModal("patient")} className="hover:text-primary-teal transition-colors">Patient Portal</button>
              <button onClick={() => handleOpenRoleModal("doctor")} className="hover:text-emerald-accent transition-colors">Doctor Portal</button>
              <button onClick={() => handleOpenRoleModal("lab")} className="hover:text-violet-accent transition-colors">Lab Portal</button>
              <button onClick={() => handleOpenRoleModal("pharmacy")} className="hover:text-coral-accent transition-colors">Pharmacy Portal</button>
            </div>
          </div>

          <div className="border-t border-surface-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-fg gap-4">
            <p>&copy; {new Date().getFullYear()} ShebaMitro Health Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary-teal" />
              <span>Next.js 15 App Router &bull; Public Navigation System</span>
            </div>
          </div>
        </div>
      </footer>

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
