"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, ShieldCheck, Heart, AlertCircle, Phone, Check } from "lucide-react";
import { FamilyMember, RelationshipType, BloodGroup } from "../types/family";
import { Button } from "@/components/ui/button";

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (newMember: FamilyMember) => void;
}

const CHRONIC_OPTIONS = [
  "Type 2 Diabetes",
  "Hypertension (High BP)",
  "Coronary Heart Disease",
  "Asthma & Respiratory",
  "Kidney Disease",
  "Hypothyroidism",
  "Osteoarthritis",
];

export function AddFamilyMemberModal({ isOpen, onClose, onAddMember }: AddFamilyMemberModalProps) {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<RelationshipType>("Father");
  const [age, setAge] = useState<number>(65);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("B+");
  const [allergies, setAllergies] = useState("Penicillin, Dust Mites");
  const [phone, setPhone] = useState("+880 1819-987654");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    "Type 2 Diabetes",
    "Hypertension (High BP)",
  ]);

  const toggleCondition = (cond: string) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: name.trim(),
      relationship,
      age: Number(age),
      gender,
      bloodGroup,
      avatarUrl:
        gender === "female"
          ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      chronicConditions: selectedConditions,
      allergies: allergies.split(",").map((a) => a.trim()).filter(Boolean),
      emergencyPhone: phone,
      isPrimary: false,
      alarms: [
        {
          id: `a-${Date.now()}`,
          medicineName: "Napa 500mg",
          dosage: "1 Tablet After Meal",
          time: "08:30 AM",
          status: "UPCOMING",
        },
      ],
      prescriptions: [],
      appointments: [],
    };

    onAddMember(newMember);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-5 overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-teal/10 text-primary-teal border border-primary-teal/20">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-fg-app tracking-tight">Add Family Member / Dependent</h3>
                  <p className="text-xs text-muted-fg">Manage health records & alarms for family</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-muted-bg text-fg-app hover:bg-surface-card-hover border border-surface-border transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Name & Relationship */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-fg">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lateef Ahmed"
                    className="w-full h-10 px-3.5 rounded-xl bg-muted-bg/30 border border-surface-border text-xs text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-fg">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as RelationshipType)}
                    className="w-full h-10 px-3 rounded-xl bg-muted-bg/30 border border-surface-border text-xs font-bold text-fg-app"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Age, Gender, Blood Group */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-fg">
                    Age
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={110}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-muted-bg/30 border border-surface-border text-xs font-bold text-fg-app"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-fg">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "male" | "female")}
                    className="w-full h-10 px-3 rounded-xl bg-muted-bg/30 border border-surface-border text-xs font-bold text-fg-app"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-fg">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full h-10 px-3 rounded-xl bg-muted-bg/30 border border-surface-border text-xs font-bold text-fg-app"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chronic Medical Conditions */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-muted-fg block">
                  Chronic Medical Conditions
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CHRONIC_OPTIONS.map((cond) => {
                    const isSelected = selectedConditions.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleCondition(cond)}
                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary-teal text-white border-primary-teal shadow-xs"
                            : "border-surface-border bg-muted-bg/40 hover:bg-surface-card-hover text-fg-app"
                        }`}
                      >
                        {cond} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Allergies & Emergency Contact */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-fg">
                    Known Drug/Food Allergies
                  </label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Sulfa drugs, Peanuts"
                    className="w-full h-10 px-3.5 rounded-xl bg-muted-bg/30 border border-surface-border text-xs text-fg-app"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-fg">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    className="w-full h-10 px-3.5 rounded-xl bg-muted-bg/30 border border-surface-border text-xs text-fg-app"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-accent to-primary-teal text-white font-bold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Check className="h-4 w-4" /> Save Family Member Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
