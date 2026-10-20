"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Pill, FileSpreadsheet, Stethoscope } from "lucide-react";
import {
  DrugMasterItem,
  Icd10MasterItem,
  SpecialtyMasterItem,
  MasterDataTab,
} from "../../types/masterData";

interface MasterDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: MasterDataTab;
  editingSpecialtyItem?: SpecialtyMasterItem | null;
  editingDrugItem?: DrugMasterItem | null;
  editingIcdItem?: Icd10MasterItem | null;
  onSaveSpecialty?: (specialty: Partial<SpecialtyMasterItem>) => void;
  onSaveDrug: (drug: Partial<DrugMasterItem>) => void;
  onSaveIcd: (icd: Partial<Icd10MasterItem>) => void;
}

export function MasterDataModal({
  isOpen,
  onClose,
  activeTab,
  editingSpecialtyItem,
  editingDrugItem,
  editingIcdItem,
  onSaveSpecialty,
  onSaveDrug,
  onSaveIcd,
}: MasterDataModalProps) {
  // Specialty Form state
  const [specCode, setSpecCode] = useState("");
  const [specTitleEn, setSpecTitleEn] = useState("");
  const [specTitleBn, setSpecTitleBn] = useState("");
  const [specIcon, setSpecIcon] = useState("HeartPulse");
  const [specDescription, setSpecDescription] = useState("");
  const [specKeywords, setSpecKeywords] = useState("");

  // Drug Form state
  const [brandName, setBrandName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [strength, setStrength] = useState("");
  const [formulation, setFormulation] = useState("Tablet");
  const [dgdaApprovalNo, setDgdaApprovalNo] = useState("");
  const [price, setPrice] = useState("10");
  const [stockQuantity, setStockQuantity] = useState("100");
  const [category, setCategory] = useState("pain");

  // ICD-10 Form state
  const [code, setCode] = useState("");
  const [diagnosisTitle, setDiagnosisTitle] = useState("");
  const [icdCategory, setIcdCategory] = useState("Cardiovascular");
  const [isChronic, setIsChronic] = useState(false);

  useEffect(() => {
    if (activeTab === "SPECIALTIES" && editingSpecialtyItem) {
      setSpecCode(editingSpecialtyItem.code);
      setSpecTitleEn(editingSpecialtyItem.titleEn);
      setSpecTitleBn(editingSpecialtyItem.titleBn);
      setSpecIcon(editingSpecialtyItem.icon || "HeartPulse");
      setSpecDescription(editingSpecialtyItem.description || "");
      setSpecKeywords((editingSpecialtyItem.keywords || []).join(", "));
    } else if (activeTab === "SPECIALTIES") {
      setSpecCode("");
      setSpecTitleEn("");
      setSpecTitleBn("");
      setSpecIcon("HeartPulse");
      setSpecDescription("");
      setSpecKeywords("");
    }

    if (activeTab === "DRUGS" && editingDrugItem) {
      setBrandName(editingDrugItem.brandName);
      setGenericName(editingDrugItem.genericName);
      setManufacturer(editingDrugItem.manufacturer);
      setStrength(editingDrugItem.strength);
      setFormulation(editingDrugItem.formulation);
      setDgdaApprovalNo(editingDrugItem.dgdaApprovalNo);
      setPrice(String(editingDrugItem.price ?? 10));
      setStockQuantity(String(editingDrugItem.stockCount ?? editingDrugItem.stockQuantity ?? 100));
      setCategory(editingDrugItem.category || "pain");
    } else if (activeTab === "DRUGS") {
      setBrandName("");
      setGenericName("");
      setManufacturer("");
      setStrength("");
      setFormulation("Tablet");
      setDgdaApprovalNo("DAR-000-0000");
      setPrice("10");
      setStockQuantity("100");
      setCategory("pain");
    }

    if (activeTab === "ICD10" && editingIcdItem) {
      setCode(editingIcdItem.code);
      setDiagnosisTitle(editingIcdItem.diagnosisTitle);
      setIcdCategory(editingIcdItem.category);
      setIsChronic(editingIcdItem.isChronic);
    } else if (activeTab === "ICD10") {
      setCode("");
      setDiagnosisTitle("");
      setIcdCategory("Cardiovascular");
      setIsChronic(false);
    }
  }, [activeTab, editingSpecialtyItem, editingDrugItem, editingIcdItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "SPECIALTIES" && onSaveSpecialty) {
      const kwList = specKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      onSaveSpecialty({
        id: editingSpecialtyItem ? editingSpecialtyItem.id : undefined,
        code: specCode || specTitleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        titleEn: specTitleEn,
        titleBn: specTitleBn,
        icon: specIcon,
        description: specDescription,
        keywords: kwList.length > 0 ? kwList : [specTitleEn.toLowerCase()],
        status: editingSpecialtyItem ? editingSpecialtyItem.status : "Active",
      });
    } else if (activeTab === "DRUGS") {
      onSaveDrug({
        id: editingDrugItem ? editingDrugItem.id : undefined,
        brandName,
        genericName,
        manufacturer,
        strength,
        formulation,
        dgdaApprovalNo,
        price: Number(price) || 10,
        stockCount: Number(stockQuantity) || 100,
        category,
        status: editingDrugItem ? editingDrugItem.status : "Active",
      });
    } else if (activeTab === "ICD10") {
      onSaveIcd({
        id: editingIcdItem ? editingIcdItem.id : undefined,
        code,
        diagnosisTitle,
        category: icdCategory,
        isChronic,
        status: editingIcdItem ? editingIcdItem.status : "Active",
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-card border border-card-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-card-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary-teal/10 border border-primary-teal/20 flex items-center justify-center text-primary-teal shrink-0">
              {activeTab === "SPECIALTIES" && <Stethoscope className="h-4 w-4" />}
              {activeTab === "DRUGS" && <Pill className="h-4 w-4" />}
              {activeTab === "ICD10" && <FileSpreadsheet className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-fg-app">
                {activeTab === "SPECIALTIES" && (editingSpecialtyItem ? "Edit Specialty Record" : "Add Medical Specialty")}
                {activeTab === "DRUGS" && (editingDrugItem ? "Edit Pharmaceutical Record" : "Add New Pharmaceutical Drug")}
                {activeTab === "ICD10" && (editingIcdItem ? "Edit ICD-10 Code" : "Add New ICD-10 Clinical Diagnosis")}
              </h3>
              <p className="text-xs text-muted-foreground">
                Commit changes to ShebaMitro master PostgreSQL database.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-fg-app p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* SPECIALTIES TAB FORM */}
          {activeTab === "SPECIALTIES" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">Specialty Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. cardiology"
                    value={specCode}
                    onChange={(e) => setSpecCode(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app font-mono focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">Icon Identifier</label>
                  <select
                    value={specIcon}
                    onChange={(e) => setSpecIcon(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  >
                    <option value="HeartPulse">HeartPulse (Cardio)</option>
                    <option value="Brain">Brain (Neurology)</option>
                    <option value="Baby">Baby (Pediatrics)</option>
                    <option value="Bone">Bone (Orthopedics)</option>
                    <option value="Sparkles">Sparkles (Dermatology)</option>
                    <option value="UserCheck">UserCheck (Gynecology)</option>
                    <option value="Eye">Eye (Ophthalmology)</option>
                    <option value="ShieldPlus">ShieldPlus (Oncology)</option>
                    <option value="Smile">Smile (Psychiatry)</option>
                    <option value="Activity">Activity (ENT / General)</option>
                    <option value="Stethoscope">Stethoscope (General)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">English Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiology"
                    value={specTitleEn}
                    onChange={(e) => setSpecTitleEn(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">Bengali Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. হৃদরোগ (কার্ডিওলজি)"
                    value={specTitleBn}
                    onChange={(e) => setSpecTitleBn(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-fg-app">Keywords (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. cardio, heart, কার্ডিওলজি, ecg, bp"
                  value={specKeywords}
                  onChange={(e) => setSpecKeywords(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-fg-app">Description</label>
                <textarea
                  rows={3}
                  placeholder="Clinical consultation details and scope of specialty..."
                  value={specDescription}
                  onChange={(e) => setSpecDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                />
              </div>
            </>
          )}

          {/* DRUGS TAB FORM */}
          {activeTab === "DRUGS" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Napa Extra"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">Generic Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol + Caffeine"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-fg-app">Pharmaceutical Manufacturer</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beximco Pharmaceuticals Ltd."
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">Strength</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 mg + 65 mg"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">Dosage Formulation</label>
                  <select
                    value={formulation}
                    onChange={(e) => setFormulation(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Eye Drops">Eye Drops</option>
                    <option value="Ointment">Ointment / Cream</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">DGDA DAR No.</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DAR-028-1048"
                    value={dgdaApprovalNo}
                    onChange={(e) => setDgdaApprovalNo(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app font-mono focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">Price (BDT)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">Stock Quantity</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  />
                </div>
              </div>
            </>
          )}

          {/* ICD-10 TAB FORM */}
          {activeTab === "ICD10" && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">ICD-10 Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. I10"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app font-mono uppercase focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-fg-app">Disease Category</label>
                  <select
                    value={icdCategory}
                    onChange={(e) => setIcdCategory(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                  >
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Endocrine & Metabolic">Endocrine & Metabolic</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Infectious & Parasitic">Infectious & Parasitic</option>
                    <option value="Neurological">Neurological</option>
                    <option value="Mental & Behavioral">Mental & Behavioral</option>
                    <option value="Musculoskeletal">Musculoskeletal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-fg-app">Diagnosis Title Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Official WHO ICD-10 clinical diagnosis title..."
                  value={diagnosisTitle}
                  onChange={(e) => setDiagnosisTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-card-border bg-card text-xs text-fg-app focus:outline-none focus:ring-1 focus:ring-primary-teal"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isChronic"
                  checked={isChronic}
                  onChange={(e) => setIsChronic(e.target.checked)}
                  className="rounded border-card-border text-primary-teal focus:ring-primary-teal h-4 w-4"
                />
                <label htmlFor="isChronic" className="text-xs font-semibold text-fg-app cursor-pointer">
                  Mark as Chronic Medical Condition (Long-term Disease Management)
                </label>
              </div>
            </>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-card-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-card-border bg-card hover:bg-muted text-xs font-bold text-fg-app transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-teal hover:bg-primary-teal/90 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Save className="h-3.5 w-3.5" /> Save to Database
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
