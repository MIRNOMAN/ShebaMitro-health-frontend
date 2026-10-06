export type RequisitionStatus =
  | "New Order"
  | "Sample Collection Scheduled"
  | "Processing in Lab"
  | "Report Ready";

export type PriorityLevel = "Routine" | "Urgent" | "STAT";

export interface TestRequisition {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientId: string;
  referringDoctor: string;
  doctorSpecialty: string;
  doctorHospital: string;
  testName: string;
  testCategory: string;
  specimenType: string;
  status: RequisitionStatus;
  priority: PriorityLevel;
  requestedAt: string;
  barcode: string;
  rackLocation: string;
  clinicalNotes: {
    diagnosis: string;
    symptoms: string[];
    specialInstructions: string;
    fastingRequired: boolean;
    fastingDuration?: string;
    allergies?: string[];
  };
}

export type PickupStatus =
  | "Pending Assignment"
  | "Assigned"
  | "En Route"
  | "Arrived at Location"
  | "Sample Collected"
  | "In Transit to Lab";

export interface Phlebotomist {
  id: string;
  name: string;
  phone: string;
  vehicle: "Motorbike" | "Scooter" | "Electric Bike";
  zone: string;
  status: "Available" | "Busy" | "En Route" | "On Break";
  pickupsToday: number;
  rating: number;
}

export interface HomePickupRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  address: string;
  areaZone: "Dhanmondi" | "Banani" | "Uttara" | "Mirpur" | "Panthapath" | "Bashundhara";
  testName: string;
  specimenType: string;
  status: PickupStatus;
  phlebotomistId: string | null;
  phlebotomistName?: string;
  collectionTimeSlot: string;
  collectionPin: string;
  smsSent: boolean;
  smsSentAt?: string;
  tubeBarcode?: string;
  mapCoords: { x: number; y: number };
  requestedAt: string;
}

export interface BiomarkerDefinition {
  id: string;
  name: string;
  unit: string;
  minRef: number;
  maxRef: number;
  defaultValue: number;
}

export interface TestTemplate {
  id: string;
  title: string;
  category: string;
  biomarkers: BiomarkerDefinition[];
}
