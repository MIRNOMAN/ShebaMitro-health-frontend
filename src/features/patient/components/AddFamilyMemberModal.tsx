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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="relative w-full max-w-lg bg-card border border-card-border rounded-3xl p-6 shadow-2xl z-10 space-y-5 overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-card-border">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-teal/10 text-primary-teal">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-fg-app">Add Family Member / Dependent</h3>
                  <p className="text-xs text-muted-foreground">Manage health records & alarms for family</p>
                </div>
              </div>

              <button onClick={onClose} className="p-1.5 rounded-lg bg-muted text-fg-app">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Name & Relationship */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lateef Ahmed"
                    className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-foreground">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as RelationshipType)}
                    className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app"
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
                  <label className="font-bold uppercase tracking-wider text-muted-foreground">
                    Age
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={110}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-bold text-fg-app"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-foreground">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "male" | "female")}
                    className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-foreground">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-bold text-fg-app"
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
                <label className="font-bold uppercase tracking-wider text-muted-foreground block">
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
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                          isSelected
                            ? "bg-primary-teal text-white border-primary-teal shadow-xs"
                            : "border-card-border bg-card hover:bg-muted/40 text-fg-app"
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
                  <label className="font-bold uppercase tracking-wider text-muted-foreground">
                    Known Drug/Food Allergies
                  </label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Sulfa drugs, Peanuts"
                    className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs text-fg-app"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-muted-foreground">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs text-fg-app"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button variant="emerald" type="submit" className="w-full h-11 justify-center text-xs shadow-md">
                  Save Family Member Profile
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
