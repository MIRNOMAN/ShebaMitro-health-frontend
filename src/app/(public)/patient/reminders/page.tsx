import { Metadata } from "next";
import { MedicationScheduleView } from "@/features/reminders/components/MedicationScheduleView";

export const metadata: Metadata = {
  title: "Smart Medication Schedule & Medicine Alarms | ShebaMitro",
  description:
    "Automated AI dose alarms, WhatsApp alerts, and precision medication schedule tracking tailored to your doctor prescriptions.",
};

export default function PatientRemindersPage() {
  return <MedicationScheduleView />;
}
