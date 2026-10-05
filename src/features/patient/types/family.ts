export type RelationshipType = "Self" | "Father" | "Mother" | "Spouse" | "Son" | "Daughter" | "Sibling" | "Other";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

export interface FamilyMemberAlarm {
  id: string;
  medicineName: string;
  dosage: string;
  time: string;
  status: "TAKEN" | "DUE_NOW" | "UPCOMING";
}

export interface FamilyMemberPrescription {
  id: string;
  title: string;
  doctorName: string;
  date: string;
  medicinesCount: number;
}

export interface FamilyMemberAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  chamber: string;
  dateTime: string;
  status: "Confirmed" | "Pending";
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: RelationshipType;
  age: number;
  gender: "male" | "female";
  bloodGroup: BloodGroup;
  avatarUrl: string;
  chronicConditions: string[];
  allergies: string[];
  emergencyPhone: string;
  isPrimary: boolean;
  alarms: FamilyMemberAlarm[];
  prescriptions: FamilyMemberPrescription[];
  appointments: FamilyMemberAppointment[];
}
