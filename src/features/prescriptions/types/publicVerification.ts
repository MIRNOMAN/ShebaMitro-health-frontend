export interface PrescribedItemSummary {
  medicineName: string;
  dosageSchedule: string;
  durationDays: number;
}

export interface PublicRxVerificationProof {
  rxId: string;
  rxNumber: string;
  doctorName: string;
  bmdcRegNo: string;
  doctorSpecialty: string;
  hospitalAffiliation: string;
  doctorSealUrl: string;
  maskedPatientInitials: string; // e.g. "T. A.*** (HIPAA Protected)"
  patientAgeGender: string; // e.g. "34 Yrs / Male"
  issuanceTimestamp: string;
  validUntil: string;
  verificationHash: string; // SHA-256 signature hash
  merkleRootHash: string;
  blockchainLedgerBlock: number;
  status: "VALID_UNALTERED" | "DISPENSED_EXPIRED" | "INVALID_TAMPERED";
  prescribedItems: PrescribedItemSummary[];
}
