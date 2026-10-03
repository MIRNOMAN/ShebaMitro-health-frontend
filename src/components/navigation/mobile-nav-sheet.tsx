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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ShebaMitroLogo } from "@/components/ui/logo";
import { megaMenuData } from "./mega-menu";
import type { HealthcareRole } from "./role-login-modal";

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
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

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

              {/* Emergency SOS Button */}
              <button
                onClick={() => {
                  onClose();
                  onOpenSosModal();
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-coral-accent text-white font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 glow-coral animate-pulse"
              >
                <Siren className="w-4 h-4" />
                <span>Emergency SOS Dispatch 24/7</span>
              </button>

              {/* Navigation Accordion */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-fg px-1">
                  Healthcare Services
                </p>

                {megaMenuData.map((menu) => {
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
                          <span>{menu.label}</span>
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
                              key={sub.title}
                              href={sub.href}
                              onClick={onClose}
                              className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-muted-fg hover:text-fg-app hover:bg-surface-card transition-colors"
                            >
                              {sub.icon}
                              <span>{sub.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Role Badges */}
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
                    className="p-2.5 rounded-xl border border-primary-teal/30 bg-primary-teal/10 text-primary-teal text-xs font-bold flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Patient</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenRoleModal("doctor");
                    }}
                    className="p-2.5 rounded-xl border border-emerald-accent/30 bg-emerald-accent/10 text-emerald-accent text-xs font-bold flex items-center gap-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Doctor</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenRoleModal("lab");
                    }}
                    className="p-2.5 rounded-xl border border-violet-accent/30 bg-violet-accent/10 text-violet-accent text-xs font-bold flex items-center gap-1.5"
                  >
                    <TestTube className="w-3.5 h-3.5" />
                    <span>Lab</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenRoleModal("pharmacy");
                    }}
                    className="p-2.5 rounded-xl border border-coral-accent/30 bg-coral-accent/10 text-coral-accent text-xs font-bold flex items-center gap-1.5"
                  >
                    <Pill className="w-3.5 h-3.5" />
                    <span>Pharmacy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sheet Footer */}
            <div className="space-y-4 border-t border-surface-border/60 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-fg">Theme</span>
                <ThemeToggle />
              </div>

              <Button
                onClick={() => {
                  onClose();
                  onOpenRoleModal("patient");
                }}
                variant="primary"
                size="md"
                className="w-full justify-center font-bold"
              >
                Log In to Portal
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
