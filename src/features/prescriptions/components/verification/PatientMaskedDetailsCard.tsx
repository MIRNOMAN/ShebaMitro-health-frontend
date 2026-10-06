"use client";

import React from "react";
import { Lock, User, Clock, Calendar, Pill } from "lucide-react";
import { PublicRxVerificationProof } from "../../types/publicVerification";

interface PatientMaskedDetailsCardProps {
  proof: PublicRxVerificationProof;
}

export function PatientMaskedDetailsCard({ proof }: PatientMaskedDetailsCardProps) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary-teal" /> Patient Clinical Record (HIPAA Masked)
        </h3>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-card-border">
          Privacy Protected
        </span>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-xl border border-card-border text-xs">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Patient Initials</span>
          <span className="font-extrabold text-fg-app flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-primary-teal" />
            {proof.maskedPatientInitials}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Age / Gender</span>
          <span className="font-semibold text-fg-app">{proof.patientAgeGender}</span>
        </div>

        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Issuance Date</span>
          <span className="font-mono text-fg-app flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            {proof.issuanceTimestamp}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Valid Until</span>
          <span className="font-mono text-emerald-600 font-bold flex items-center gap-1">
            <Calendar className="h-3 w-3 text-emerald-500" />
            {proof.validUntil}
          </span>
        </div>
      </div>

      {/* Prescribed Items Summary */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-fg-app flex items-center gap-1.5">
          <Pill className="h-3.5 w-3.5 text-primary-teal" /> Prescribed Medications Summary ({proof.prescribedItems.length} items)
        </h4>

        <div className="space-y-1.5">
          {proof.prescribedItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-card border border-card-border"
            >
              <div>
                <span className="font-bold text-fg-app block">{item.medicineName}</span>
                <span className="text-[10px] text-muted-foreground">Dosage: {item.dosageSchedule}</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-muted text-fg-app border border-card-border shrink-0">
                {item.durationDays} Days
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
