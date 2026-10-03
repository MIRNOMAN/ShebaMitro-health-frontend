/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Stethoscope,
  TestTube,
  Pill,
  X,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import type { translations } from "@/lib/i18n/translations";

export type HealthcareRole = "patient" | "doctor" | "lab" | "pharmacy";

interface RoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: HealthcareRole;
}

const roleConfigs: {
  id: HealthcareRole;
  titleKey: keyof typeof translations.en;
  badgeKey: keyof typeof translations.en;
  descKey: keyof typeof translations.en;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  bgActive: string;
}[] = [
  {
    id: "patient",
    titleKey: "rolePatientTitle",
    badgeKey: "patientBadge",
    descKey: "patientRoleDesc",
    icon: <User className="w-5 h-5" />,
    color: "text-primary-teal",
    borderColor: "border-primary-teal/40",
    bgActive: "bg-primary-teal/15",
  },
  {
    id: "doctor",
    titleKey: "roleDoctorTitle",
    badgeKey: "doctorBadge",
    descKey: "doctorRoleDesc",
    icon: <Stethoscope className="w-5 h-5" />,
    color: "text-emerald-accent",
    borderColor: "border-emerald-accent/40",
    bgActive: "bg-emerald-accent/15",
  },
  {
    id: "lab",
    titleKey: "roleLabTitle",
    badgeKey: "labBadge",
    descKey: "labRoleDesc",
    icon: <TestTube className="w-5 h-5" />,
    color: "text-violet-accent",
    borderColor: "border-violet-accent/40",
    bgActive: "bg-violet-accent/15",
  },
  {
    id: "pharmacy",
    titleKey: "rolePharmacyTitle",
    badgeKey: "pharmacyBadge",
    descKey: "pharmacyRoleDesc",
    icon: <Pill className="w-5 h-5" />,
    color: "text-coral-accent",
    borderColor: "border-coral-accent/40",
    bgActive: "bg-coral-accent/15",
  },
];

export function RoleLoginModal({
  isOpen,
  onClose,
  defaultRole = "patient",
}: RoleLoginModalProps) {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = React.useState<HealthcareRole>(defaultRole);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedRole(defaultRole);
    }
  }, [isOpen, defaultRole]);

  const activeRoleConfig = roleConfigs.find((r) => r.id === selectedRole) ?? roleConfigs[0]!;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-2xl z-10 luminous-border"
            style={{ backgroundColor: "var(--card)" }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full border border-surface-border bg-muted-bg text-muted-fg hover:text-fg-app hover:border-primary-teal transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-teal/15 text-primary-teal text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>{t("multiRoleTitle")}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t("selectAccountRole")}
              </h2>
              <p className="text-xs sm:text-sm text-muted-fg">
                {t("chooseRoleDesc")}
              </p>
            </div>

            {/* Role Grid Selectors */}
            <div className="grid grid-cols-2 gap-3 my-6">
              {roleConfigs.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 relative ${
                      isSelected
                        ? `${role.borderColor} ${role.bgActive} shadow-md`
                        : "border-surface-border bg-muted-bg/50 hover:bg-muted-bg"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl bg-surface-card ${role.color}`}>
                        {role.icon}
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-emerald-accent text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-black text-fg-app">{t(role.titleKey)}</p>
                    <span className="text-[10px] font-bold text-muted-fg uppercase tracking-wider">
                      {t(role.badgeKey)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Role Action Summary */}
            <div className="p-4 rounded-2xl border border-surface-border bg-muted-bg/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-muted-fg">Role Selected:</span>
                <span className={`font-black uppercase tracking-wider ${activeRoleConfig.color}`}>
                  {t(activeRoleConfig.titleKey)}
                </span>
              </div>
              <p className="text-xs text-muted-fg leading-relaxed">
                {t(activeRoleConfig.descKey)}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Link
                href={`/login?role=${selectedRole}`}
                onClick={onClose}
                className="w-full"
              >
                <Button variant="primary" size="lg" className="w-full justify-center gap-2">
                  <span>{t("loginAs")} {t(activeRoleConfig.badgeKey)}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
