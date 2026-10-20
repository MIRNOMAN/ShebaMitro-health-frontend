export type MasterDataTab = "SPECIALTIES" | "DRUGS" | "ICD10";

export interface SpecialtyMasterItem {
  id: string;
  specialtyId?: string;
  code: string;
  titleEn: string;
  titleBn: string;
  count?: number;
  doctorCount?: string;
  doctorCountBn?: string;
  icon?: string;
  gradient?: string;
  badgeColor?: string;
  description?: string;
  keywords?: string[];
  isActive?: boolean;
  status?: "Active" | "Deprecated";
  createdAt?: string;
  updatedAt?: string;
}

export interface DrugMasterItem {
  id: string;
  name?: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  strength: string; // e.g. "500 mg", "20 mg", "100 mg/5ml"
  formulation: string; // e.g. "Tablet", "Capsule", "Syrup", "Injection"
  dgdaApprovalNo: string;
  price?: number;
  stockCount?: number;
  stockQuantity?: number;
  category?: string;
  packSize?: string;
  requiresPrescription?: boolean;
  status: "Active" | "Deprecated";
  updatedAt: string;
}

export interface Icd10MasterItem {
  id: string;
  code: string; // e.g. "E11.9", "I10"
  diagnosisTitle: string; // e.g. "Type 2 diabetes mellitus without complications"
  category: string; // e.g. "Endocrine & Metabolic", "Cardiovascular"
  isChronic: boolean;
  isActive?: boolean;
  status: "Active" | "Deprecated";
  updatedAt: string;
}
