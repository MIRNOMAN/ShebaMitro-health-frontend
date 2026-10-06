export type AuditLogSeverity = "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";

export type AuditLogAction =
  | "PROVIDER_APPROVAL"
  | "PRESCRIPTION_MODIFIED"
  | "REFUND_ISSUED"
  | "ADMIN_MUTATION"
  | "UNAUTHORIZED_LOGIN";

export type UserRole =
  | "SuperAdmin"
  | "Doctor"
  | "Pharmacist"
  | "Lab Technician"
  | "Patient"
  | "Anonymous";

export interface LiveAuditEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: UserRole;
  action: AuditLogAction;
  targetResource: string;
  details: string;
  ipAddress: string;
  geolocation: string; // e.g., "Dhaka, Bangladesh" or "Moscow, Russia (Suspicious)"
  severity: AuditLogSeverity;
  sha256Hash: string;
}
