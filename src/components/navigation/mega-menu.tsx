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

export interface MegaMenuItem {
  id: string;
  label: string;
  href: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  subItems: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

const megaMenuData: MegaMenuItem[] = [
  {
    id: "doctors",
    label: "Find Doctors",
    href: "/doctors",
    description: "Connect with verified specialists & online consultations",
    icon: <Stethoscope className="w-4 h-4" />,
    accentColor: "text-primary-teal",
    subItems: [
      {
        title: "Specialist Search",
        description: "Browse 50+ medical specialties & book in-person visits",
        href: "/doctors/specialists",
        icon: <Stethoscope className="w-4 h-4 text-primary-teal" />,
      },
      {
        title: "Telemedicine Video Consult",
        description: "Instant HD video consultations with top physicians 24/7",
        href: "/doctors/telemedicine",
        icon: <Video className="w-4 h-4 text-emerald-accent" />,
      },
      {
        title: "Emergency Specialists",
        description: "Urgent care & ICU specialists available for immediate dispatch",
        href: "/doctors/emergency",
        icon: <ShieldAlert className="w-4 h-4 text-coral-accent" />,
      },
    ],
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    href: "/diagnostics",
    description: "Book accredited lab tests & home sample collection",
    icon: <TestTube className="w-4 h-4" />,
    accentColor: "text-violet-accent",
    subItems: [
      {
        title: "Home Lab Sample Collection",
        description: "Certified phlebotomists collect samples at your doorstep",
        href: "/diagnostics/home-collection",
        icon: <Microscope className="w-4 h-4 text-violet-accent" />,
      },
      {
        title: "Diagnostic Imaging Centers",
        description: "Book MRI, CT Scans, X-Rays, & Ultrasound appointments",
        href: "/diagnostics/imaging",
        icon: <Activity className="w-4 h-4 text-primary-teal" />,
      },
      {
        title: "E-Report Vault",
        description: "Secure digital lab test reports delivered in <24 hours",
        href: "/diagnostics/reports",
        icon: <FileCheck className="w-4 h-4 text-emerald-accent" />,
      },
    ],
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    href: "/pharmacy",
    description: "Order genuine medicines & healthcare products online",
    icon: <Pill className="w-4 h-4" />,
    accentColor: "text-emerald-accent",
    subItems: [
      {
        title: "Upload Prescription",
        description: "Instant AI prescription parsing & pharmacist validation",
        href: "/pharmacy/upload",
        icon: <FileCheck className="w-4 h-4 text-emerald-accent" />,
      },
      {
        title: "Rapid Medicine Express",
        description: "Guaranteed 2-hour home delivery for critical medications",
        href: "/pharmacy/express",
        icon: <Truck className="w-4 h-4 text-coral-accent" />,
      },
      {
        title: "Chronic Care Subscriptions",
        description: "Automatic monthly refill orders with 15% discount",
        href: "/pharmacy/subscriptions",
        icon: <HeartPulse className="w-4 h-4 text-primary-teal" />,
      },
    ],
  },
  {
    id: "packages",
    label: "Health Packages",
    href: "/packages",
    description: "Comprehensive health checkups for individuals & families",
    icon: <PackageCheck className="w-4 h-4" />,
    accentColor: "text-coral-accent",
    subItems: [
      {
        title: "Full Body Checkups",
        description: "80+ vital health parameters tested in a single package",
        href: "/packages/full-body",
        icon: <PackageCheck className="w-4 h-4 text-coral-accent" />,
      },
      {
        title: "Diabetes Care Shield",
        description: "HbA1c, lipid profile, kidney & eye screening bundle",
        href: "/packages/diabetes",
        icon: <Activity className="w-4 h-4 text-primary-teal" />,
      },
      {
        title: "Senior Citizen Wellness",
        description: "Comprehensive cardiac, bone density, & organ screening",
        href: "/packages/senior-care",
        icon: <HeartPulse className="w-4 h-4 text-violet-accent" />,
      },
    ],
  },
];

export function MegaMenu() {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setActiveMenuId(null)}>
      {megaMenuData.map((menu) => {
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
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isOpen
                  ? "bg-primary-teal/15 text-primary-teal shadow-xs"
                  : "text-muted-fg hover:text-fg-app hover:bg-muted-bg/60"
              }`}
              aria-expanded={isOpen}
            >
              <span>{menu.label}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-primary-teal" : "text-muted-fg"
                }`}
              />
            </button>

            {/* Dropdown Popover Container */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-0 mt-2 w-96 rounded-3xl border border-surface-border bg-surface-card/95 p-5 backdrop-blur-2xl shadow-2xl z-50 space-y-3 luminous-border glow-teal"
                >
                  <div className="border-b border-surface-border/60 pb-3">
                    <p className={`text-xs font-bold uppercase tracking-wider ${menu.accentColor}`}>
                      {menu.label} Services
                    </p>
                    <p className="text-xs text-muted-fg mt-0.5">{menu.description}</p>
                  </div>

                  <div className="space-y-1">
                    {menu.subItems.map((sub) => (
                      <Link
                        key={sub.title}
                        href={sub.href}
                        onClick={() => setActiveMenuId(null)}
                        className="flex items-start gap-3 p-2.5 rounded-2xl transition-all duration-200 hover:bg-muted-bg group"
                      >
                        <div className="p-2 rounded-xl bg-muted-bg group-hover:bg-primary-teal/15 transition-colors">
                          {sub.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-fg-app group-hover:text-primary-teal transition-colors">
                            {sub.title}
                          </p>
                          <p className="text-[11px] text-muted-fg leading-relaxed">
                            {sub.description}
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

export { megaMenuData };
