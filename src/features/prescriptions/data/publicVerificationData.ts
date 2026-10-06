import { PublicRxVerificationProof } from "../types/publicVerification";

export const MOCK_PUBLIC_RX_DATA: Record<string, PublicRxVerificationProof> = {
  "RX-2026-90412": {
    rxId: "RX-2026-90412",
    rxNumber: "SHEBA-RX-90412",
    doctorName: "Prof. Dr. Mahmudul Hasan",
    bmdcRegNo: "BMDC-A-48920",
    doctorSpecialty: "Senior Consultant, Internal Medicine",
    hospitalAffiliation: "BSMMU & ShebaMitro Digital Health Network",
    doctorSealUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
    maskedPatientInitials: "T. A.*** (HIPAA Protected)",
    patientAgeGender: "34 Yrs / Male",
    issuanceTimestamp: "2026-10-06 08:30:15 AM BST",
    validUntil: "2026-10-13 11:59:59 PM BST",
    verificationHash: "SHA256:77A01FE9920B448100C210A88902FE",
    merkleRootHash: "0x8920bc4410f99201048e",
    blockchainLedgerBlock: 1489204,
    status: "VALID_UNALTERED",
    prescribedItems: [
      { medicineName: "Napa Extra (Paracetamol 500mg + Caffeine 65mg)", dosageSchedule: "1 + 0 + 1 (After Meals)", durationDays: 5 },
      { medicineName: "Seclo 20mg (Omeprazole)", dosageSchedule: "1 + 0 + 1 (Before Meals)", durationDays: 14 },
      { medicineName: "Cef-3 200mg (Cefixime)", dosageSchedule: "1 + 0 + 1 (After Meals)", durationDays: 7 },
    ],
  },
  "RX-2026-88102": {
    rxId: "RX-2026-88102",
    rxNumber: "SHEBA-RX-88102",
    doctorName: "Dr. Syeda Rashida Begum",
    bmdcRegNo: "BMDC-A-50119",
    doctorSpecialty: "Assistant Professor, Hematology & Oncology",
    hospitalAffiliation: "Green Life Medical College Hospital",
    doctorSealUrl: "https://images.unsplash.com/photo-1594824813566-78a9930f3532?w=300&auto=format&fit=crop&q=80",
    maskedPatientInitials: "R. K.*** (HIPAA Protected)",
    patientAgeGender: "48 Yrs / Female",
    issuanceTimestamp: "2026-10-05 04:15:22 PM BST",
    validUntil: "2026-10-12 11:59:59 PM BST",
    verificationHash: "SHA256:48902A01FE98402D1120048E",
    merkleRootHash: "0x44810f9920b8801f",
    blockchainLedgerBlock: 1489180,
    status: "VALID_UNALTERED",
    prescribedItems: [
      { medicineName: "Sergel 20mg (Esomeprazole)", dosageSchedule: "1 + 0 + 1 (Before Meals)", durationDays: 30 },
      { medicineName: "Monas 10mg (Montelukast)", dosageSchedule: "0 + 0 + 1 (At Bedtime)", durationDays: 30 },
    ],
  },
};

export function getPublicRxProof(id: string): PublicRxVerificationProof {
  if (MOCK_PUBLIC_RX_DATA[id]) {
    return MOCK_PUBLIC_RX_DATA[id];
  }

  // Fallback dynamic generator for any QR code ID scanned
  return {
    rxId: id,
    rxNumber: `SHEBA-RX-${id.replace(/[^0-9]/g, "") || "90412"}`,
    doctorName: "Prof. Dr. Mahmudul Hasan",
    bmdcRegNo: "BMDC-A-48920",
    doctorSpecialty: "Senior Consultant, Internal Medicine",
    hospitalAffiliation: "BSMMU & ShebaMitro Digital Health Network",
    doctorSealUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
    maskedPatientInitials: "M. I.*** (HIPAA Protected)",
    patientAgeGender: "38 Yrs / Male",
    issuanceTimestamp: "2026-10-06 09:10:00 AM BST",
    validUntil: "2026-10-13 11:59:59 PM BST",
    verificationHash: `SHA256:${Math.floor(1000000000 + Math.random() * 9000000000).toString(16).toUpperCase()}`,
    merkleRootHash: `0x${Math.floor(10000000 + Math.random() * 90000000).toString(16)}`,
    blockchainLedgerBlock: 1489210,
    status: "VALID_UNALTERED",
    prescribedItems: [
      { medicineName: "Napa Extra 500mg", dosageSchedule: "1 + 0 + 1", durationDays: 5 },
      { medicineName: "Sergel 20mg", dosageSchedule: "1 + 0 + 1", durationDays: 14 },
    ],
  };
}
