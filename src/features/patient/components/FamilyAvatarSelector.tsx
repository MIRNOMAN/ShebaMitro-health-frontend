"use client";

import React from "react";
import { UserPlus, Check, Heart, ShieldCheck, User } from "lucide-react";
import { FamilyMember } from "../types/family";
import { Button } from "@/components/ui/button";

interface FamilyAvatarSelectorProps {
  members: FamilyMember[];
  selectedMemberId: string;
  onSelectMember: (id: string) => void;
  onOpenAddModal: () => void;
}

export function FamilyAvatarSelector({
  members,
  selectedMemberId,
  onSelectMember,
  onOpenAddModal,
}: FamilyAvatarSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <User className="h-4 w-4 text-primary-teal" /> Select Account Dependent Profile
        </label>
        <span className="text-xs font-semibold text-primary-teal">
          {members.length} Active Profiles
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {members.map((member) => {
          const isSelected = selectedMemberId === member.id;

          return (
            <div
              key={member.id}
              onClick={() => onSelectMember(member.id)}
              className={`flex-1 min-w-[160px] p-3 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center space-y-2 ${
                isSelected
                  ? "bg-primary-teal/10 border-primary-teal ring-2 ring-primary-teal/30 shadow-md scale-105"
                  : "bg-card border-card-border hover:bg-surface-card-hover"
              }`}
            >
              {/* Active Selection Check Badge */}
              {isSelected && (
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-teal text-white text-[10px] shadow-xs">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
              )}

              {/* Avatar Photo */}
              <div className="relative">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className={`h-14 w-14 rounded-full object-cover border-2 ${
                    isSelected ? "border-primary-teal shadow-md" : "border-card-border"
                  }`}
                />
                <span className="absolute -bottom-1 -right-1 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-card border border-card-border text-coral-accent shadow-xs">
                  {member.bloodGroup}
                </span>
              </div>

              {/* Name & Relationship Tag */}
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-fg-app block truncate max-w-[130px]">
                  {member.name}
                </span>
                <span className="text-[11px] font-semibold text-primary-teal block truncate">
                  {member.relationship} ({member.age} Yrs)
                </span>
              </div>
            </div>
          );
        })}

        {/* Add Family Member Card */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="min-w-[140px] h-[132px] p-3 rounded-2xl border-2 border-dashed border-card-border hover:border-primary-teal/60 bg-surface-card-hover/40 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-teal/10 text-primary-teal group-hover:bg-primary-teal group-hover:text-white transition-colors">
            <UserPlus className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-fg-app group-hover:text-primary-teal transition-colors">
            + Add Dependent
          </span>
        </button>
      </div>
    </div>
  );
}
