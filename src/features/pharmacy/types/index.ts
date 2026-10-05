export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  type: "Tablet" | "Capsule" | "Syrup" | "Injection" | "Ointment" | "Drops";
  strength: string; // e.g. "500mg", "20mg"
  packSize: string; // e.g. "10 Tablets / Strip", "100ml Bottle"
  price: number;
  originalPrice?: number;
  category: "pain" | "diabetic" | "cardiac" | "vitamins" | "digestive" | "antibiotic";
  requiresPrescription: boolean;
  inStock: boolean;
  imageUrl: string;
}

export interface RecognizedMedicine {
  id: string;
  name: string;
  dosage: string;
  matchedMedicine?: Medicine;
  confidence: number;
}

export interface PharmacyCartItem {
  medicine: Medicine;
  quantity: number;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  area: string;
  addressLine: string;
  lat: number;
  lng: number;
}

export type PaymentMethod = "bkash" | "nagad" | "card" | "cod";

export interface OcrScanResult {
  fileName: string;
  fileSizeFormatted: string;
  compressedSizeFormatted: string;
  originalImageSrc: string;
  recognizedLines: RecognizedMedicine[];
  isScanning: boolean;
  isComplete: boolean;
}
