export type MasterDataTab = "DRUGS" | "ICD10";

export interface DrugMasterItem {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  strength: string; // e.g. "500 mg", "20 mg", "100 mg/5ml"
  formulation: string; // e.g. "Tablet", "Capsule", "Syrup", "Injection"
  dgdaApprovalNo: string;
  status: "Active" | "Deprecated";
  updatedAt: string;
}

export interface Icd10MasterItem {
  id: string;
  code: string; // e.g. "E11.9", "I10"
  diagnosisTitle: string; // e.g. "Type 2 diabetes mellitus without complications"
  category: string; // e.g. "Endocrine & Metabolic", "Cardiovascular"
  isChronic: boolean;
  status: "Active" | "Deprecated";
  updatedAt: string;
}
