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
    titleKey: "patientTitle",
    badgeKey: "patientBadge",
    descKey: "patientRoleDesc",
    icon: <User className="w-5 h-5" />,
    color: "text-primary-teal",
    borderColor: "border-primary-teal/40",
    bgActive: "bg-primary-teal/15",
  },
  {
    id: "doctor",
    titleKey: "doctorTitle",
    badgeKey: "doctorBadge",
    descKey: "doctorRoleDesc",
    icon: <Stethoscope className="w-5 h-5" />,
    color: "text-emerald-accent",
    borderColor: "border-emerald-accent/40",
    bgActive: "bg-emerald-accent/15",
  },
  {
    id: "lab",
    titleKey: "labTitle",
    badgeKey: "labBadge",
    descKey: "labRoleDesc",
    icon: <TestTube className="w-5 h-5" />,
    color: "text-violet-accent",
    borderColor: "border-violet-accent/40",
    bgActive: "bg-violet-accent/15",
  },
  {
    id: "pharmacy",
    titleKey: "pharmacyTitle",
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

  const activeRoleConfig = roleConfigs.find((r) => r.id === selectedRole) || roleConfigs[0];

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

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-8 backdrop-blur-xl shadow-2xl z-10 space-y-6"
            style={{ backgroundColor: "var(--card)" }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-muted-fg hover:text-fg-app hover:bg-muted-bg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-teal/15 text-primary-teal text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t("multiRoleTitle")}</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                {t("selectAccountRole")}
              </h2>
              <p className="text-xs text-muted-fg font-medium">
                {t("chooseRoleDesc")}
              </p>
            </div>

            {/* Role Badge Switcher */}
            <div className="grid grid-cols-2 gap-3">
              {roleConfigs.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 relative ${
                      isSelected
                        ? `${role.borderColor} ${role.bgActive} shadow-sm ring-1 ring-primary-teal/30`
                        : "border-surface-border bg-surface-card/60 hover:bg-muted-bg/50"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-teal text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div className={`p-2 rounded-xl w-fit ${role.bgActive} ${role.color}`}>
                      {role.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isSelected ? role.color : "text-fg-app"}`}>
                        {t(role.titleKey)}
                      </p>
                      <p className="text-[11px] text-muted-fg leading-relaxed mt-0.5 font-medium">
                        {t(role.descKey)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Action Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href={`/login?role=${selectedRole}`}
                  onClick={onClose}
                  className="w-full"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center gap-2 font-bold shadow-md"
                  >
                    <span>{t("logIn")} ({t(activeRoleConfig?.badgeKey || "patientBadge")})</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link
                  href={`/signup?role=${selectedRole}`}
                  onClick={onClose}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center gap-2 font-bold"
                  >
                    <span>{t("registerNewAccount")}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
