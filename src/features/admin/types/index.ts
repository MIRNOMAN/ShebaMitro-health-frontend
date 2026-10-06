export type ProviderType = "Doctor" | "Diagnostic Lab" | "Pharmacy";

export type AuditStatus = "Pending Audit" | "Approved" | "Rejected" | "Additional Info Requested";

export interface VerificationDocument {
  id: string;
  title: string;
  docType: "BMDC Certificate" | "DGDA Drug License" | "ISO 15189 Certificate" | "NID Card" | "Trade License" | "Tin Certificate";
  issueDate: string;
  expiryDate: string;
  documentNumber: string;
  fileUrl: string;
  previewImage: string;
  verifiedStatus: "Valid" | "Pending Review" | "Suspicious";
}

export interface ProviderRegistrationRequest {
  id: string;
  providerType: ProviderType;
  entityName: string; // Doctor Name or Lab Name or Pharmacy Name
  contactEmail: string;
  contactPhone: string;
  locationAddress: string;
  cityZone: string;
  bmdcOrLicenseNo: string;
  specialtyOrCategory: string;
  registeredAt: string;
  status: AuditStatus;
  documents: VerificationDocument[];
}

export type DecisionAction = "APPROVE" | "REJECT" | "REQUEST_DOCS";

export interface AuditRecord {
  auditId: string;
  providerId: string;
  providerName: string;
  providerType: ProviderType;
  decision: "APPROVED" | "REJECTED" | "INFO_REQUESTED";
  deficiencyNote?: string;
  requestedDocDetails?: string;
  auditedBy: string;
  timestamp: string;
  sha256Hash: string;
}
