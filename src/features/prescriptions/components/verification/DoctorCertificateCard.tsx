"use client";

import React from "react";
import { UserCheck, Award, Building, FileCheck } from "lucide-react";
import { PublicRxVerificationProof } from "../../types/publicVerification";

interface DoctorCertificateCardProps {
  proof: PublicRxVerificationProof;
}

export function DoctorCertificateCard({ proof }: DoctorCertificateCardProps) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <h3 className="font-bold text-sm text-fg-app flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-primary-teal" /> Prescribing Medical Practitioner
        </h3>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
          BMDC Registered
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Doctor Seal Image */}
        <div className="h-16 w-16 rounded-2xl overflow-hidden border border-card-border bg-slate-100 shrink-0">
          <img
            src={proof.doctorSealUrl}
            alt={proof.doctorName}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Doctor Details */}
        <div className="space-y-1 flex-1">
          <h4 className="text-base font-extrabold text-fg-app">{proof.doctorName}</h4>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono font-bold text-primary-teal bg-primary-teal/10 px-2 py-0.5 rounded border border-primary-teal/20">
              {proof.bmdcRegNo}
            </span>
            <span className="text-muted-foreground font-medium">{proof.doctorSpecialty}</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
            <Building className="h-3.5 w-3.5 text-muted-foreground" />
            {proof.hospitalAffiliation}
          </p>
        </div>
      </div>

      <div className="p-3 bg-muted/40 rounded-xl border border-card-border text-[11px] text-muted-foreground flex items-center gap-2">
        <FileCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>Digital signature verified against Bangladesh Medical & Dental Council public keys.</span>
      </div>
    </div>
  );
}
