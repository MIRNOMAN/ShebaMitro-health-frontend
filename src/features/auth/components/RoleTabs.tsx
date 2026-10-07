"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Stethoscope, FlaskConical, Pill, ShieldAlert, Check } from "lucide-react";
import { UserRole } from "../types";

interface RoleTabsProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

const ROLES: {
  id: UserRole;
  label: string;
  badge: string;
  icon: React.ElementType;
  activeColor: string;
  borderColor: string;
  bgGlow: string;
}[] = [
  {
    id: "patient",
    label: "Patient",
    badge: "Personal",
    icon: User,
    activeColor: "text-emerald-accent",
    borderColor: "border-emerald-accent/50",
    bgGlow: "bg-emerald-accent/15",
  },
  {
    id: "doctor",
    label: "Doctor",
    badge: "BMDC",
    icon: Stethoscope,
    activeColor: "text-primary-teal",
    borderColor: "border-primary-teal/50",
    bgGlow: "bg-primary-teal/15",
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    badge: "DGDA",
    icon: Pill,
    activeColor: "text-coral-accent",
    borderColor: "border-coral-accent/50",
    bgGlow: "bg-coral-accent/15",
  },
  {
    id: "lab",
    label: "Lab",
    badge: "ISO",
    icon: FlaskConical,
    activeColor: "text-violet-accent",
    borderColor: "border-violet-accent/50",
    bgGlow: "bg-violet-accent/15",
  },
  {
    id: "admin",
    label: "Admin",
    badge: "Security",
    icon: ShieldAlert,
    activeColor: "text-rose-500",
    borderColor: "border-rose-500/50",
    bgGlow: "bg-rose-500/15",
  },
];

export function RoleTabs({ selectedRole, onSelectRole }: RoleTabsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-muted-fg">
        <span>Select Account Portal</span>
        <span className="text-[10px] text-primary-teal font-bold lowercase">
          active: {selectedRole}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 p-1.5 rounded-2xl bg-muted-bg/60 border border-surface-border">
        {ROLES.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.id;

          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRole(r.id)}
              className={`relative py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `bg-surface-card ${r.borderColor} border shadow-md font-extrabold text-fg-app`
                  : "hover:bg-surface-card/60 text-muted-fg hover:text-fg-app font-semibold border border-transparent"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-all ${
                  isSelected ? `${r.bgGlow} ${r.activeColor}` : "text-muted-fg"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <span className="text-[11px] leading-tight tracking-tight truncate w-full text-center">
                {r.label}
              </span>

              <span className="text-[9px] font-mono text-muted-fg uppercase opacity-80">
                {r.badge}
              </span>

              {/* Active Underline Pill */}
              {isSelected && (
                <motion.div
                  layoutId="roleUnderlinePill"
                  className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-primary-teal shadow-[0_0_8px_var(--primary-teal)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
