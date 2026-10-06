import { ContactChannelItem, FaqItem, OfficeLocationItem } from "../types/contact";

export const CONTACT_CHANNELS_DATA: ContactChannelItem[] = [
  {
    id: "chan-1",
    title: "24/7 Patient Helpline",
    detail: "+880 9612-880099",
    subText: "Toll-free 24/7 tele-health support across Bangladesh",
    iconName: "PhoneCall",
    actionUrl: "tel:+8809612880099",
    actionLabel: "Call Helpline",
  },
  {
    id: "chan-2",
    title: "Medical Emergency Hotline",
    detail: "16263 / 999",
    subText: "Direct dispatch for urgent ambulance & emergency care",
    iconName: "Ambulance",
    actionUrl: "tel:16263",
    actionLabel: "Emergency Call",
  },
  {
    id: "chan-3",
    title: "Official Email Support",
    detail: "support@shebamitro.health",
    subText: "Guaranteed response within 2 hours for all inquiries",
    iconName: "Mail",
    actionUrl: "mailto:support@shebamitro.health",
    actionLabel: "Send Email",
  },
  {
    id: "chan-4",
    title: "Headquarters Address",
    detail: "Green Road, Dhanmondi, Dhaka",
    subText: "Level 8, Green Life Medical Tower, Dhaka-1205",
    iconName: "MapPin",
    actionUrl: "https://maps.google.com",
    actionLabel: "Get Directions",
  },
];

export const CONTACT_FAQS_DATA: FaqItem[] = [
  {
    id: "faq-1",
    question: "How do I book a video consultation with a BMDC doctor?",
    answer: "You can search for doctors by specialty or symptom on our portal, select an available time slot, complete payment via bKash/Nagad, and receive an instant video consult link.",
    category: "General",
  },
  {
    id: "faq-2",
    question: "How are electronic prescriptions verified for authenticity?",
    answer: "Every prescription generated on ShebaMitro is cryptographically signed with a SHA-256 digital seal and QR code, allowing pharmacies and patients to instantly verify authenticity.",
    category: "Prescriptions",
  },
  {
    id: "faq-3",
    question: "How do I apply for Doctor or Pharmacy verification?",
    answer: "Healthcare providers can submit their BMDC registration certificate, NID card, and trade license through our Verification Audit Desk at /admin for automated auditing.",
    category: "Doctors",
  },
  {
    id: "faq-4",
    question: "What is the refund policy for canceled appointments?",
    answer: "If a doctor cancels an appointment or a lab sample collection cannot be completed, full refunds are processed automatically to your MFS wallet within 24 hours.",
    category: "Billing",
  },
];

export const OFFICE_LOCATIONS_DATA: OfficeLocationItem[] = [
  {
    id: "loc-1",
    city: "Dhaka (Headquarters)",
    name: "ShebaMitro Central Operations Center",
    address: "Level 8, Green Life Medical Tower, Green Road, Dhanmondi, Dhaka-1205",
    phone: "+880 2-9661200",
    hours: "Sun - Thu: 8:00 AM - 10:00 PM",
  },
  {
    id: "loc-2",
    city: "Chittagong",
    name: "Chattogram Regional Health Hub",
    address: "House 14, Road 3, GEC Circle, Agrabad, Chattogram",
    phone: "+880 31-658900",
    hours: "Sun - Thu: 9:00 AM - 8:00 PM",
  },
  {
    id: "loc-3",
    city: "Sylhet",
    name: "Sylhet Telemedicine Center",
    address: "Zindabazar Commercial Area, Sylhet Sadar, Sylhet",
    phone: "+880 821-729900",
    hours: "Sun - Thu: 9:00 AM - 8:00 PM",
  },
];
