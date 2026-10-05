export interface TestParameter {
  id: string;
  name: string;
  description?: string;
}

export interface PartnerLab {
  id: string;
  name: string;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  accredited: string; // e.g. "ISO 15189 Certified"
  discountPercent: number;
  homeCollectionAvailable: boolean;
  branchesCount: number;
}

export interface DiagnosticPackage {
  id: string;
  title: string;
  subtitle: string;
  categoryId: "full_body" | "diabetic" | "cardiac" | "women" | "liver_kidney" | "thyroid";
  categoryName: string;
  originalPrice: number;
  discountedPrice: number;
  parameterCount: number;
  parameters: string[];
  fastingRequired: boolean;
  fastingHours?: number;
  turnaroundTime: string; // e.g. "12 Hours", "24 Hours"
  sampleType: string; // e.g. "Blood & Urine"
  popular: boolean;
  partnerLabIds: string[];
  description: string;
}

export interface CartItem {
  packageObj: DiagnosticPackage;
  quantity: number;
  selectedLab: PartnerLab;
}

export interface CollectionAddress {
  fullName: string;
  phone: string;
  area: string;
  fullAddress: string;
  lat: number;
  lng: number;
}
