export interface ContactChannelItem {
  id: string;
  title: string;
  detail: string;
  subText: string;
  iconName: string;
  actionUrl: string;
  actionLabel: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Doctors" | "Prescriptions" | "Billing";
}

export interface OfficeLocationItem {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
