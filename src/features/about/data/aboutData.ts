import { PlatformStatItem, CoreValueItem, LeadershipMember } from "../types/about";

export const MOCK_PLATFORM_STATS: PlatformStatItem[] = [
  {
    value: "250,000+",
    label: "Consultations Completed",
    description: "Delivering accessible video consultations across all 64 districts of Bangladesh.",
  },
  {
    value: "1,200+",
    label: "BMDC Verified Doctors",
    description: "Specialists from BSMMU, DMC, SSMC, and leading medical colleges.",
  },
  {
    value: "99.9%",
    label: "Rx Integrity & Safety",
    description: "Cryptographically signed prescriptions eliminating counterfeit medications.",
  },
  {
    value: "45 Mins",
    label: "Medicine Delivery",
    description: "Express cold-chain doorstep dispatch from licensed dark store pharmacies.",
  },
];

export const MOCK_CORE_VALUES: CoreValueItem[] = [
  {
    id: "val-1",
    title: "Patient First Healthcare",
    description: "We place patient welfare, convenience, and affordability at the heart of every technological innovation.",
    iconName: "HeartPulse",
  },
  {
    id: "val-2",
    title: "Cryptographic Trust & Privacy",
    description: "All electronic prescriptions and lab reports are signed with SHA-256 hashes for total tamper resistance.",
    iconName: "ShieldCheck",
  },
  {
    id: "val-3",
    title: "End-to-End Ecosystem",
    description: "Unifying doctor video consults, lab sample home dispatch, and model pharmacy fulfillment into one seamless app.",
    iconName: "Activity",
  },
  {
    id: "val-4",
    title: "24/7 National Access",
    description: "Ensuring specialized healthcare reaches rural and urban communities anytime, anywhere without long queues.",
    iconName: "Clock",
  },
];

export const MOCK_LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    id: "lead-1",
    name: "Prof. Dr. Mahmudul Hasan",
    role: "Chief Medical Officer",
    bmdcOrTitle: "BMDC-A-48920 • Ex-BSMMU Professor",
    bio: "Pioneering digital health ethics, clinical protocols, and BMDC accreditation for ShebaMitro.",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "lead-2",
    name: "Dr. Syeda Rashida Begum",
    role: "Head of Tele-Oncology & Research",
    bmdcOrTitle: "BMDC-A-50119 • Associate Professor",
    bio: "Leading clinical research in remote biomarker monitoring and specialized cancer care access.",
    imageUrl: "https://images.unsplash.com/photo-1594824813566-78a9930f3532?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "lead-3",
    name: "Tanvir Ahmed",
    role: "Chief Technology Officer",
    bmdcOrTitle: "M.Sc Computer Science",
    bio: "Architecting real-time WebRTC tele-consultations, NestJS microservices, and cryptographic proof verification.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "lead-4",
    name: "Nusrat Jahan",
    role: "VP of Pharmacy & Logistics",
    bmdcOrTitle: "B.Pharm (DU), M.Pharm",
    bio: "Overseeing DGDA-compliant cold chain storage, barcode picking validation, and express dark store delivery.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  },
];
