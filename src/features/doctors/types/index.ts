export interface Chamber {
  id: string;
  name: string;
  address: string;
  area: string;
  city: string;
  mapTag: string;
  consultationFee: number;
  followupFee: number;
  availableDays: string[];
}

export interface TimeSlot {
  id: string;
  time: string;
  period: "morning" | "afternoon" | "evening";
  isBooked: boolean;
}

export interface DayAvailability {
  date: string; // ISO date string YYYY-MM-DD
  dayLabel: string; // e.g. "Today, Oct 5"
  dayName: string; // e.g. "Mon"
  dayNum: string; // e.g. "05"
  slots: TimeSlot[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  location?: string;
  description?: string;
}

export interface PatientReview {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  consultationType: "Video Consultation" | "Chamber Visit";
}

export interface ReviewCategory {
  name: string;
  rating: number;
}

export interface RatingStarBreakdown {
  stars: number;
  count: number;
  percentage: number;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialtyId: string;
  specialtyName: string;
  bmdcNo: string;
  isBmdcVerified: boolean;
  qualifications: string[];
  designation: string;
  hospital: string;
  chambers: Chamber[];
  videoConsultationFee: number;
  chamberConsultationFee: number;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  gender: "male" | "female";
  availableToday: boolean;
  nextSlot: string;
  avatarUrl: string;
  languages: string[];
  totalPatientsTreated: number;
  availability: DayAvailability[];
  videoAvailability?: DayAvailability[];
  about?: string;
  educationTimeline?: EducationItem[];
  patientReviews?: PatientReview[];
  reviewCategories?: ReviewCategory[];
  ratingStarBreakdown?: RatingStarBreakdown[];
}

export interface SpecialtyOption {
  id: string;
  name: string;
  iconName: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  doctorCount: number;
}

export interface DoctorFilterState {
  specialties: string[];
  maxFee: number;
  minRating: number;
  gender: "all" | "male" | "female";
  availableToday: boolean;
  search: string;
  sortBy: "recommended" | "rating" | "fee_asc" | "fee_desc" | "experience";
}
