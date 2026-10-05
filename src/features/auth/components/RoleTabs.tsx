"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserCheck, Stethoscope, FlaskConical, Pill } from "lucide-react";
import { UserRole } from "../types";

interface RoleTabsProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

const ROLES: { id: UserRole; label: string; icon: React.ElementType; colorClass: string }[] = [
  { id: "patient", label: "Patient", icon: UserCheck, colorClass: "text-emerald-500" },
  { id: "doctor", label: "Doctor", icon: Stethoscope, colorClass: "text-primary-teal" },
  { id: "lab", label: "Lab Partner", icon: FlaskConical, colorClass: "text-purple-500" },
  { id: "pharmacy", label: "Pharmacy", icon: Pill, colorClass: "text-amber-500" },
];

export function RoleTabs({ selectedRole, onSelectRole }: RoleTabsProps) {
  return (
    <div className="relative border-b border-card-border pb-1">
      <div className="grid grid-cols-4 gap-1">
        {ROLES.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.id;

          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRole(r.id)}
              className={`relative py-3 px-1 flex flex-col items-center justify-center gap-1.5 transition-colors duration-200 ${
                isSelected ? "text-fg-app font-bold" : "text-muted-foreground hover:text-fg-app font-medium"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                  isSelected
                    ? "bg-card shadow-xs scale-105 border border-card-border"
                    : "bg-transparent"
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? r.colorClass : "text-muted-foreground"}`} />
              </div>

              <span className="text-xs tracking-tight">{r.label}</span>

              {/* Smooth Sliding Underline Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="roleUnderline"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-teal rounded-full shadow-[0_0_8px_#06b6d4]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
