import { Metadata } from "next";
import { MedicationScheduleView } from "@/features/reminders/components/MedicationScheduleView";

export const metadata: Metadata = {
  title: "Medicine Alarms & Dose Schedule | Patient Portal",
  description: "Manage your prescription dose alarms and adherence schedule.",
};

export default function DashboardMedicineAlarmsPage() {
  return <MedicationScheduleView />;
}
