import { LegalDocument } from "../types/legal";

export const TERMS_AND_CONDITIONS_DATA: LegalDocument = {
  docType: "TERMS",
  title: "ShebaMitro Platform Terms & Conditions",
  lastUpdated: "October 06, 2026",
  version: "v2.4",
  summaryNote: "Please read these Terms & Conditions carefully before using the ShebaMitro digital health platform. By accessing or using our services, you agree to be bound by these terms.",
  sections: [
    {
      id: "acceptance-of-terms",
      title: "1. Acceptance of Terms",
      content: "By registering for, accessing, or using the ShebaMitro web application, mobile interface, tele-consultation services, digital prescription verification system, or pharmacy dispatch services, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms and Conditions and our Privacy Policy.",
    },
    {
      id: "telemedicine-services",
      title: "2. Telemedicine Consultations & Clinical Disclaimer",
      content: "ShebaMitro provides a technological platform connecting registered patients with verified Bangladesh Medical & Dental Council (BMDC) registered doctors. Telemedicine is intended for non-emergency clinical consultation, follow-ups, and chronic disease management.",
      bulletPoints: [
        "In medical emergencies (e.g., severe chest pain, acute trauma, stroke), patients must immediately call 999 or visit the nearest hospital emergency room.",
        "Medical advice provided during consultations is based solely on patient-disclosed symptoms and uploaded records.",
        "Doctors reserve the clinical right to recommend in-person physical examination whenever necessary.",
      ],
    },
    {
      id: "doctor-compliance",
      title: "3. Doctor Qualification & BMDC Verification",
      content: "All medical practitioners rendering consultation services on ShebaMitro undergo strict credential inspection, BMDC registration verification, and identity audits before being authorized to issue electronic prescriptions.",
    },
    {
      id: "prescription-verification",
      title: "4. Electronic Prescriptions & Cryptographic Integrity",
      content: "Prescriptions generated through ShebaMitro are cryptographically signed with SHA-256 hashes and stored in an immutable verification registry.",
      bulletPoints: [
        "Prescriptions contain QR codes for instant public and pharmacy verification.",
        "Alteration or tampering with electronic prescriptions is strictly prohibited under Bangladesh Digital Security laws.",
        "Narcotics and controlled substances (Schedule X drugs) cannot be prescribed via telemedicine.",
      ],
    },
    {
      id: "pharmacy-and-labs",
      title: "5. Pharmacy Fulfillment & Diagnostic Sample Collection",
      content: "Medicine fulfillment and home lab sample collections are conducted by DGDA-licensed model dark store pharmacies and accredited diagnostic laboratories.",
      bulletPoints: [
        "Pharmacists verify prescription QR code authenticity prior to dispensing.",
        "Sample collection time windows and PIN codes are delivered via automated SMS.",
      ],
    },
    {
      id: "payments-and-refunds",
      title: "6. Payment Settlement & Refund Policy",
      content: "All payments processed via MFS (bKash, Nagad) or Debit/Credit cards are processed securely. Full refunds are issued within 24-48 hours if a doctor cancels an appointment or a lab sample collection is unfulfilled.",
    },
  ],
};

export const PRIVACY_POLICY_DATA: LegalDocument = {
  docType: "PRIVACY",
  title: "ShebaMitro Patient Privacy & Data Protection Policy",
  lastUpdated: "October 06, 2026",
  version: "v2.4",
  summaryNote: "We are committed to protecting your Personal Health Information (PHI). This policy outlines how ShebaMitro collects, encrypts, uses, and safeguards your medical records.",
  sections: [
    {
      id: "data-collection",
      title: "1. Information We Collect",
      content: "We collect information necessary to deliver quality digital healthcare services and verify identities.",
      bulletPoints: [
        "Personal Identifier Data: Name, mobile phone number, email address, national ID (NID) for doctors.",
        "Protected Health Information (PHI): Medical history, vitals, lab reports, prescribed medications, diagnostic biomarker records.",
        "Technical Data: IP address, device telemetry, browser type, and geolocation for security audits.",
      ],
    },
    {
      id: "encryption-security",
      title: "2. Cryptographic Security & Encryption Standards",
      content: "ShebaMitro employs bank-grade 256-bit SSL/TLS encryption in transit and AES-256 encryption at rest for all stored patient medical files and prescriptions.",
      bulletPoints: [
        "Prescriptions are hashed using SHA-256 for public verification without exposing full patient identities.",
        "Public verification endpoints display HIPAA-masked patient initials (e.g. T. A.***).",
      ],
    },
    {
      id: "data-usage",
      title: "3. How We Use Your Information",
      content: "Your data is used strictly for medical consultation, order fulfillment, diagnostic lab reporting, and system security monitoring. We never sell or rent patient health data to third-party advertisers.",
    },
    {
      id: "third-party-sharing",
      title: "4. Information Sharing with Authorized Partners",
      content: "We share necessary data only with authorized healthcare ecosystem providers required to complete your requested service:",
      bulletPoints: [
        "Assigned BMDC doctors during active video consultations.",
        "Licensed phlebotomists & lab technicians for sample collection.",
        "Model pharmacies for medicine delivery verification.",
        "MFS Payment gateways (bKash/Nagad) for transaction processing.",
      ],
    },
    {
      id: "patient-rights",
      title: "5. Patient Control & Data Rights",
      content: "Patients retain full ownership of their medical records. You have the right to access, download PDF copies, or request account deletion at any time through your dashboard.",
    },
    {
      id: "policy-updates",
      title: "6. Updates to Privacy Policy",
      content: "We may update this policy periodically to comply with new Bangladesh DGHS health regulations or data protection directives. Material updates will be notified via SMS and email.",
    },
  ],
};
