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
  slots: TimeSlot[];
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
  about?: string;
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
