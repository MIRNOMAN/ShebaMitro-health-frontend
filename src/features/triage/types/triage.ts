export type UrgencyLevel = "EMERGENCY" | "URGENT" | "ROUTINE" | "SELF_CARE";

export interface DoctorSpecialtyCard {
  id: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  matchingScore: number; // 0-100
  iconName: string;
  bookingUrl: string;
  availableDoctorsCount: number;
  avgConsultationFeeBDT: number;
  badgeTag: string;
}

export interface TriageRequestPayload {
  symptoms: string;
  language?: "en" | "bn" | "banglish";
  patientAge?: number;
  gender?: string;
}

export interface TriageResponseData {
  urgency: UrgencyLevel;
  urgencyScore: number; // 0 - 100 severity index
  urgencyTitle: string;
  urgencyTitleBn: string;
  summary: string;
  summaryBn: string;
  advice: string[];
  adviceBn: string[];
  redFlags: string[];
  redFlagsBn: string[];
  recommendedSpecialties: DoctorSpecialtyCard[];
  sourceService: "NestJS-AI-Microservice" | "Fallback-Edge-AI";
  timestamp: string;
}
