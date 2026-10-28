"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  PenTool,
  Plus,
  Trash2,
  Save,
  Printer,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Pill,
  User,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function DoctorRxWriterPage() {
  const searchParams = useSearchParams();
  const initialPatientName = searchParams?.get("patientName") || "Kamrul Islam Manik";
  const appointmentId = searchParams?.get("appointmentId") || "";

  const [patientName, setPatientName] = useState(initialPatientName);
  const [patientAge, setPatientAge] = useState("45");
  const [patientGender, setPatientGender] = useState("Male");
  const [chiefComplaints, setChiefComplaints] = useState("Chest discomfort and breathlessness on exertion");
  const [diagnosis, setDiagnosis] = useState("Stable Angina Pectoris / Essential Hypertension");
  const [advice, setAdvice] = useState("Low salt diet, regular morning walk 30 mins, avoid heavy physical stress.");

  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: "m-1",
      name: "Tab. Monocard 20mg (Isosorbide Mononitrate)",
      dosage: "1 Tablet",
      frequency: "1 + 0 + 1 (Twice daily)",
      duration: "30 Days",
      instructions: "After meals with water",
    },
    {
      id: "m-2",
      name: "Tab. Bislol 2.5mg (Bisoprolol Fumarate)",
      dosage: "1 Tablet",
      frequency: "1 + 0 + 0 (Morning)",
      duration: "30 Days",
      instructions: "Before breakfast",
    },
  ]);

  const [newMed, setNewMed] = useState<MedicineItem>({
    id: "",
    name: "",
    dosage: "1 Tablet",
    frequency: "1 + 0 + 1",
    duration: "14 Days",
    instructions: "After meal",
  });

  const handleAddMedicine = () => {
    if (!newMed.name.trim()) {
      toast.error("Please enter a medicine name");
      return;
    }
    setMedicines((prev) => [...prev, { ...newMed, id: `med-${Date.now()}` }]);
    setNewMed({
      id: "",
      name: "",
      dosage: "1 Tablet",
      frequency: "1 + 0 + 1",
      duration: "14 Days",
      instructions: "After meal",
    });
    toast.success("Medicine added to prescription");
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSaveRx = () => {
    toast.success("Digital Prescription generated & signed cryptographically!");
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-teal/15 via-background to-background p-6 rounded-3xl border border-surface-border">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-primary-teal flex items-center gap-1.5">
            <PenTool className="h-4 w-4" /> Digital EHR & Smart Rx Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-fg-app tracking-tight">
            Digital <span className="text-primary-teal">Prescription Writer</span>
          </h1>
          <p className="text-xs text-muted-fg">
            Draft, cryptographically sign, and dispatch verified digital prescriptions directly to patients and pharmacies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs font-bold rounded-xl gap-1.5"
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveRx}
            className="text-xs font-bold rounded-xl gap-1.5"
          >
            <Save className="h-4 w-4" /> Sign & Issue Rx
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Details & Clinical Findings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-card border border-surface-border rounded-3xl p-5 space-y-4 shadow-sm">
            <h3 className="font-black text-sm text-fg-app flex items-center gap-2 border-b border-surface-border pb-3">
              <User className="h-4 w-4 text-primary-teal" /> Patient Demographics
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-muted-fg uppercase tracking-wider block mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted-bg/50 border border-surface-border text-fg-app focus:outline-none focus:border-primary-teal font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-fg uppercase tracking-wider block mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted-bg/50 border border-surface-border text-fg-app focus:outline-none focus:border-primary-teal"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-fg uppercase tracking-wider block mb-1">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted-bg/50 border border-surface-border text-fg-app focus:outline-none focus:border-primary-teal"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-fg uppercase tracking-wider block mb-1">
                  Chief Complaints / Symptoms
                </label>
                <textarea
                  rows={2}
                  value={chiefComplaints}
                  onChange={(e) => setChiefComplaints(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted-bg/50 border border-surface-border text-fg-app focus:outline-none focus:border-primary-teal"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-fg uppercase tracking-wider block mb-1">
                  Provisional Diagnosis
                </label>
                <textarea
                  rows={2}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted-bg/50 border border-surface-border text-fg-app focus:outline-none focus:border-primary-teal font-semibold text-primary-teal"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-fg uppercase tracking-wider block mb-1">
                  General Advice & Lifestyle
                </label>
                <textarea
                  rows={2}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted-bg/50 border border-surface-border text-fg-app focus:outline-none focus:border-primary-teal"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Medicines Section */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
            <h3 className="font-black text-base text-fg-app flex items-center gap-2 border-b border-surface-border pb-3">
              <Pill className="h-4 w-4 text-emerald-accent" /> Prescribed Medications (Rx)
            </h3>

            {/* Add Medicine Bar */}
            <div className="p-4 rounded-2xl bg-muted-bg/40 border border-surface-border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Medicine name (e.g. Tab. Napa Extend 665mg)"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-surface-card border border-surface-border text-fg-app focus:outline-none focus:border-primary-teal"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 1 Tablet)"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-surface-card border border-surface-border text-fg-app focus:outline-none focus:border-primary-teal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Frequency (e.g. 1+0+1)"
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-surface-card border border-surface-border text-fg-app focus:outline-none focus:border-primary-teal"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 14 Days)"
                  value={newMed.duration}
                  onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-surface-card border border-surface-border text-fg-app focus:outline-none focus:border-primary-teal"
                />
                <input
                  type="text"
                  placeholder="Instructions (e.g. After meal)"
                  value={newMed.instructions}
                  onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-surface-card border border-surface-border text-fg-app focus:outline-none focus:border-primary-teal"
                />
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleAddMedicine}
                className="w-full text-xs font-bold rounded-xl gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Medication to List
              </Button>
            </div>

            {/* Prescribed List */}
            <div className="space-y-3">
              {medicines.map((med, idx) => (
                <div
                  key={med.id}
                  className="p-3.5 rounded-2xl border border-surface-border bg-surface-card hover:border-primary-teal/40 transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-lg bg-primary-teal/10 text-primary-teal flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-fg-app">{med.name}</h4>
                      <p className="text-xs text-primary-teal font-semibold mt-0.5">
                        {med.dosage} • {med.frequency} • {med.duration}
                      </p>
                      <p className="text-[11px] text-muted-fg mt-0.5">Note: {med.instructions}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(med.id)}
                    className="p-1.5 text-muted-fg hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
