"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  TestTube,
  Pill,
  PackageCheck,
  Video,
  ShieldAlert,
  Microscope,
  FileCheck,
  Truck,
  HeartPulse,
  Activity,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import type { translations } from "@/lib/i18n/translations";

export interface MegaMenuItem {
  id: string;
  labelKey: keyof typeof translations.en;
  descKey: keyof typeof translations.en;
  href: string;
  icon: React.ReactNode;
  accentColor: string;
  subItems: {
    titleKey: keyof typeof translations.en;
    descKey: keyof typeof translations.en;
    href: string;
    icon: React.ReactNode;
  }[];
}

export const megaMenuConfig: MegaMenuItem[] = [
  {
    id: "doctors",
    labelKey: "findDoctors",
    descKey: "findDoctorsDesc",
    href: "/doctors",
    icon: <Stethoscope className="w-4 h-4" />,
    accentColor: "text-primary-teal",
    subItems: [
      {
        titleKey: "specialistSearch",
        descKey: "findDoctorsDesc",
        href: "/doctors/specialists",
        icon: <Stethoscope className="w-4 h-4 text-primary-teal" />,
      },
      {
        titleKey: "telemedicine",
        descKey: "findDoctorsDesc",
        href: "/doctors/telemedicine",
        icon: <Video className="w-4 h-4 text-emerald-accent" />,
      },
      {
        titleKey: "emergencySpecialists",
        descKey: "findDoctorsDesc",
        href: "/doctors/emergency",
        icon: <ShieldAlert className="w-4 h-4 text-coral-accent" />,
      },
    ],
  },
  {
    id: "diagnostics",
    labelKey: "diagnostics",
    descKey: "diagnosticsDesc",
    href: "/diagnostics",
    icon: <TestTube className="w-4 h-4" />,
    accentColor: "text-violet-accent",
    subItems: [
      {
        titleKey: "homeCollection",
        descKey: "diagnosticsDesc",
        href: "/diagnostics/home-collection",
        icon: <Microscope className="w-4 h-4 text-violet-accent" />,
      },
      {
        titleKey: "imagingCenters",
        descKey: "diagnosticsDesc",
        href: "/diagnostics/imaging",
        icon: <Activity className="w-4 h-4 text-primary-teal" />,
      },
      {
        titleKey: "reportVault",
        descKey: "diagnosticsDesc",
        href: "/diagnostics/reports",
        icon: <FileCheck className="w-4 h-4 text-emerald-accent" />,
      },
    ],
  },
  {
    id: "pharmacy",
    labelKey: "pharmacy",
    descKey: "pharmacyDesc",
    href: "/pharmacy",
    icon: <Pill className="w-4 h-4" />,
    accentColor: "text-emerald-accent",
    subItems: [
      {
        titleKey: "uploadPrescription",
        descKey: "pharmacyDesc",
        href: "/pharmacy/upload",
        icon: <FileCheck className="w-4 h-4 text-emerald-accent" />,
      },
      {
        titleKey: "rapidExpress",
        descKey: "pharmacyDesc",
        href: "/pharmacy/express",
        icon: <Truck className="w-4 h-4 text-coral-accent" />,
      },
      {
        titleKey: "chronicSubscriptions",
        descKey: "pharmacyDesc",
        href: "/pharmacy/subscriptions",
        icon: <HeartPulse className="w-4 h-4 text-primary-teal" />,
      },
    ],
  },
  {
    id: "packages",
    labelKey: "healthPackages",
    descKey: "packagesDesc",
    href: "/packages",
    icon: <PackageCheck className="w-4 h-4" />,
    accentColor: "text-coral-accent",
    subItems: [
      {
        titleKey: "fullBodyCheckup",
        descKey: "packagesDesc",
        href: "/packages/full-body",
        icon: <PackageCheck className="w-4 h-4 text-coral-accent" />,
      },
      {
        titleKey: "diabetesShield",
        descKey: "packagesDesc",
        href: "/packages/diabetes",
        icon: <Activity className="w-4 h-4 text-primary-teal" />,
      },
      {
        titleKey: "seniorWellness",
        descKey: "packagesDesc",
        href: "/packages/senior-care",
        icon: <HeartPulse className="w-4 h-4 text-violet-accent" />,
      },
    ],
  },
];

export function MegaMenu() {
  const { t } = useLanguage();
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-1.5" onMouseLeave={() => setActiveMenuId(null)}>
      {megaMenuConfig.map((menu) => {
        const isOpen = activeMenuId === menu.id;

        return (
          <div
            key={menu.id}
            className="relative"
            onMouseEnter={() => setActiveMenuId(menu.id)}
          >
            {/* Menu Trigger Button */}
            <button
              onClick={() => setActiveMenuId(isOpen ? null : menu.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                isOpen
                  ? "bg-primary-teal text-white shadow-md ring-2 ring-primary-teal/30"
                  : "text-fg-app hover:text-primary-teal hover:bg-muted-bg/80"
              }`}
              aria-expanded={isOpen}
            >
              <span>{t(menu.labelKey)}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-white" : "text-muted-fg"
                }`}
              />
            </button>

            {/* Dropdown Popover Container with Solid Opaque Background */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-0 mt-2.5 w-96 rounded-3xl border border-surface-border bg-surface-card p-6 shadow-2xl z-50 space-y-4 luminous-border ring-1 ring-black/10"
                  style={{
                    backgroundColor: "var(--card)",
                    opacity: 1,
                  }}
                >
                  <div className="border-b border-surface-border/80 pb-3">
                    <p className={`text-xs font-black uppercase tracking-wider ${menu.accentColor}`}>
                      {t(menu.labelKey)} Services
                    </p>
                    <p className="text-xs text-muted-fg font-medium mt-1 leading-relaxed">
                      {t(menu.descKey)}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {menu.subItems.map((sub) => (
                      <Link
                        key={sub.titleKey}
                        href={sub.href}
                        onClick={() => setActiveMenuId(null)}
                        className="flex items-start gap-3.5 p-3 rounded-2xl transition-all duration-200 hover:bg-muted-bg/90 hover:translate-x-1 group"
                      >
                        <div className="p-2.5 rounded-xl bg-muted-bg text-fg-app group-hover:bg-primary-teal/15 group-hover:scale-105 transition-all flex-shrink-0">
                          {sub.icon}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-fg-app group-hover:text-primary-teal transition-colors">
                            {t(sub.titleKey)}
                          </p>
                          <p className="text-[11px] text-muted-fg font-medium leading-relaxed mt-0.5">
                            {t(sub.descKey)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}
