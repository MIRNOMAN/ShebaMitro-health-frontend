export interface LegalSection {
  id: string;
  title: string;
  content: string;
  bulletPoints?: string[];
}

export interface LegalDocument {
  docType: "TERMS" | "PRIVACY";
  title: string;
  lastUpdated: string;
  version: string;
  summaryNote: string;
  sections: LegalSection[];
}
