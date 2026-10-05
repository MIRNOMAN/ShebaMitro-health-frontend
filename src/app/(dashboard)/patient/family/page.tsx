"use client";

import React, { useState } from "react";
import { MOCK_FAMILY_MEMBERS } from "@/features/patient/data/mockFamily";
import { FamilyMember } from "@/features/patient/types/family";
import { FamilyAvatarSelector } from "@/features/patient/components/FamilyAvatarSelector";
import { AddFamilyMemberModal } from "@/features/patient/components/AddFamilyMemberModal";
import { DependentHealthView } from "@/features/patient/components/DependentHealthView";
import { Users, ShieldCheck, Heart } from "lucide-react";

export default function FamilyManagementPage() {
  const [members, setMembers] = useState<FamilyMember[]>(MOCK_FAMILY_MEMBERS);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("fam-self");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const activeMember = members.find((m) => m.id === selectedMemberId) || members[0]!;

  const handleAddMember = (newMember: FamilyMember) => {
    setMembers((prev) => [...prev, newMember]);
    setSelectedMemberId(newMember.id);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/10 via-background to-background p-6 rounded-2xl border border-card-border">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Family Health Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Family Dependents & <span className="text-primary-teal">Health Portals</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage Parents, Spouse, Children health profiles, medicine alarms, and prescriptions under 1 primary account.
          </p>
        </div>
      </div>

      {/* Avatar Selector for Dependents */}
      <FamilyAvatarSelector
        members={members}
        selectedMemberId={selectedMemberId}
        onSelectMember={setSelectedMemberId}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Dynamic Filtered Health View for Selected Dependent */}
      <DependentHealthView member={activeMember} />

      {/* Add Family Member Modal */}
      <AddFamilyMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMember={handleAddMember}
      />
    </div>
  );
}
