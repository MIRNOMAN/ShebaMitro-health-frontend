import { FamilyMember } from "../types/family";

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: "fam-self",
    name: "Sabbir Ahmed",
    relationship: "Self",
    age: 32,
    gender: "male",
    bloodGroup: "O+",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    chronicConditions: ["Mild Acid Reflux"],
    allergies: ["Dust Pollen"],
    emergencyPhone: "+880 1712-345678",
    isPrimary: true,
    alarms: [
      { id: "a1", medicineName: "Napa Extra 500mg", dosage: "1 Tablet After Meal", time: "08:30 AM", status: "TAKEN" },
      { id: "a2", medicineName: "Seclo 20mg", dosage: "1 Capsule Before Meal", time: "01:30 PM", status: "DUE_NOW" },
    ],
    prescriptions: [
      { id: "p1", title: "General Health Checkup Rx", doctorName: "Dr. Nusrat Jahan", date: "Sep 28, 2026", medicinesCount: 2 },
    ],
    appointments: [
      { id: "ap1", doctorName: "Prof. Dr. Syed Mahmudul Hasan", specialty: "Cardiology", chamber: "Square Hospital", dateTime: "Today at 05:30 PM", status: "Confirmed" },
    ],
  },
  {
    id: "fam-father",
    name: "Lateef Ahmed",
    relationship: "Father",
    age: 68,
    gender: "male",
    bloodGroup: "B+",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    chronicConditions: ["Type 2 Diabetes", "Hypertension", "Coronary Heart Disease"],
    allergies: ["Penicillin", "Sulfa Drugs"],
    emergencyPhone: "+880 1819-987654",
    isPrimary: false,
    alarms: [
      { id: "fa1", medicineName: "Metfo 850mg", dosage: "1 Tablet Breakfast", time: "08:00 AM", status: "TAKEN" },
      { id: "fa2", medicineName: "Angilock 50mg", dosage: "1 Tablet Night", time: "09:00 PM", status: "UPCOMING" },
      { id: "fa3", medicineName: "Atova 10mg", dosage: "1 Tablet Night", time: "09:30 PM", status: "UPCOMING" },
    ],
    prescriptions: [
      { id: "fp1", title: "Cardiology & Diabetes Routine Rx", doctorName: "Prof. Dr. Syed Mahmudul Hasan", date: "Oct 1, 2026", medicinesCount: 4 },
      { id: "fp2", title: "Kidney Function Review", doctorName: "Dr. Tahmina Chowdhury", date: "Aug 15, 2026", medicinesCount: 2 },
    ],
    appointments: [
      { id: "fap1", doctorName: "Prof. Dr. Syed Mahmudul Hasan", specialty: "Cardiology", chamber: "Square Hospital", dateTime: "Tomorrow at 10:00 AM", status: "Confirmed" },
    ],
  },
  {
    id: "fam-mother",
    name: "Suraiya Begum",
    relationship: "Mother",
    age: 62,
    gender: "female",
    bloodGroup: "A+",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    chronicConditions: ["Hypothyroidism", "Osteoarthritis"],
    allergies: ["NSAIDs / Aspirin"],
    emergencyPhone: "+880 1911-223344",
    isPrimary: false,
    alarms: [
      { id: "ma1", medicineName: "Thyrox 50mcg", dosage: "1 Tablet Empty Stomach", time: "06:30 AM", status: "TAKEN" },
      { id: "ma2", medicineName: "Calbo D", dosage: "1 Tablet Lunch", time: "01:00 PM", status: "DUE_NOW" },
    ],
    prescriptions: [
      { id: "mp1", title: "Endocrinology & Bone Care Rx", doctorName: "Dr. Sabina Yasmin", date: "Sep 20, 2026", medicinesCount: 3 },
    ],
    appointments: [
      { id: "map1", doctorName: "Dr. Kazi Mostafizur Rahman", specialty: "Orthopedics", chamber: "Care Medical Hospital", dateTime: "Thu, Oct 8 at 04:00 PM", status: "Confirmed" },
    ],
  },
  {
    id: "fam-daughter",
    name: "Aria Ahmed",
    relationship: "Daughter",
    age: 7,
    gender: "female",
    bloodGroup: "O+",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    chronicConditions: ["Pediatric Asthma"],
    allergies: ["Dust Mites", "Seafood"],
    emergencyPhone: "+880 1712-345678",
    isPrimary: false,
    alarms: [
      { id: "da1", medicineName: "Syr. Tusca Child 5ml", dosage: "1 Teaspoonful", time: "08:00 AM", status: "TAKEN" },
      { id: "da2", medicineName: "Inhaler Ventolin 100mcg", dosage: "2 Puffs as needed", time: "08:00 PM", status: "UPCOMING" },
    ],
    prescriptions: [
      { id: "dp1", title: "Pediatric Asthma & Growth Care", doctorName: "Dr. Tanvir Ahmed Quareshi", date: "Sep 10, 2026", medicinesCount: 2 },
    ],
    appointments: [
      { id: "dap1", doctorName: "Dr. Tanvir Ahmed Quareshi", specialty: "Pediatrics", chamber: "Popular Dhanmondi", dateTime: "Sat, Oct 10 at 11:00 AM", status: "Confirmed" },
    ],
  },
];
