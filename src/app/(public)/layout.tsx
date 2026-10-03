"use client";

import * as React from "react";
import Link from "next/link";
import {
  Siren,
  Menu,
  ChevronDown,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MegaMenu } from "@/components/navigation/mega-menu";
import { EmergencySosModal } from "@/components/navigation/emergency-sos-modal";
import { RoleLoginModal, type HealthcareRole } from "@/components/navigation/role-login-modal";
import { MobileNavSheet } from "@/components/navigation/mobile-nav-sheet";
import { ShebaMitroLogo } from "@/components/ui/logo";
import { Footer } from "./components/Footer";

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
      {/* ── Beautiful Sticky Glassmorphic Navigation Header ─────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-surface-border/80 bg-bg-app/85 backdrop-blur-2xl transition-colors duration-300 shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* 1. Official ShebaMitro Logo (Image 2) */}
          <Link href="/" className="group flex items-center">
            <ShebaMitroLogo size="md" showText={true} />
          </Link>

          {/* 2. Desktop Navigation Mega-Menu */}
          <MegaMenu />

          {/* 3. Right Header Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Pulsating Emergency SOS Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-red-500 to-coral-accent text-white font-black text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all duration-300 glow-coral group animate-pulse"
              aria-label="Trigger Emergency SOS"
            >
              <Siren className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline-block">SOS 24/7</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-400 animate-ping" />
            </button>

            {/* Compact Icon-Only Theme Toggle (User Spec 1) */}
            <ThemeToggle />

            {/* Role Login Button (No Sign Up button, User Spec 2) */}
            <button
              onClick={() => handleOpenRoleModal("patient")}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-surface-border/80 bg-surface-card/90 backdrop-blur-md text-xs font-bold text-fg-app hover:border-luminous hover:bg-surface-card-hover transition-all duration-300 shadow-xs group"
              title="Select portal role to log in"
            >
              <User className="w-4 h-4 text-primary-teal group-hover:scale-110 transition-transform" />
              <span>Log In</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-fg group-hover:text-primary-teal transition-colors" />
            </button>

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

      {/* ── Main Page Content ───────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Public Multi-Column Footer ──────────────────────────── */}
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
