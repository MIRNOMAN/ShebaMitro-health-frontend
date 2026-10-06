"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Pill, FileSpreadsheet } from "lucide-react";
import { DrugMasterItem, Icd10MasterItem, MasterDataTab } from "../../types/masterData";

interface MasterDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: MasterDataTab;
  editingDrugItem: DrugMasterItem | null;
  editingIcdItem: Icd10MasterItem | null;
  onSaveDrug: (drug: Partial<DrugMasterItem>) => void;
  onSaveIcd: (icd: Partial<Icd10MasterItem>) => void;
}

export function MasterDataModal({
  isOpen,
  onClose,
  activeTab,
  editingDrugItem,
  editingIcdItem,
  onSaveDrug,
  onSaveIcd,
}: MasterDataModalProps) {
  // Drug Form state
  const [brandName, setBrandName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [strength, setStrength] = useState("");
  const [formulation, setFormulation] = useState("Tablet");
  const [dgdaApprovalNo, setDgdaApprovalNo] = useState("");

  // ICD-10 Form state
  const [code, setCode] = useState("");
  const [diagnosisTitle, setDiagnosisTitle] = useState("");
  const [category, setCategory] = useState("Cardiovascular");
  const [isChronic, setIsChronic] = useState(false);

  useEffect(() => {
    if (activeTab === "DRUGS" && editingDrugItem) {
      setBrandName(editingDrugItem.brandName);
      setGenericName(editingDrugItem.genericName);
      setManufacturer(editingDrugItem.manufacturer);
      setStrength(editingDrugItem.strength);
      setFormulation(editingDrugItem.formulation);
      setDgdaApprovalNo(editingDrugItem.dgdaApprovalNo);
    } else if (activeTab === "DRUGS") {
      setBrandName("");
      setGenericName("");
      setManufacturer("");
      setStrength("");
      setFormulation("Tablet");
      setDgdaApprovalNo("DAR-000-0000");
    }

    if (activeTab === "ICD10" && editingIcdItem) {
      setCode(editingIcdItem.code);
      setDiagnosisTitle(editingIcdItem.diagnosisTitle);
      setCategory(editingIcdItem.category);
      setIsChronic(editingIcdItem.isChronic);
    } else if (activeTab === "ICD10") {
      setCode("");
      setDiagnosisTitle("");
      setCategory("Cardiovascular");
      setIsChronic(false);
    }
  }, [activeTab, editingDrugItem, editingIcdItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "DRUGS") {
      onSaveDrug({
        id: editingDrugItem ? editingDrugItem.id : undefined,
        brandName,
        genericName,
        manufacturer,
        strength,
        formulation,
        dgdaApprovalNo,
        status: editingDrugItem ? editingDrugItem.status : "Active",
      });
    } else {
      onSaveIcd({
        id: editingIcdItem ? editingIcdItem.id : undefined,
        code,
        diagnosisTitle,
        category,
        isChronic,
        status: editingIcdItem ? editingIcdItem.status : "Active",
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-card-border pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary-teal/10 text-primary-teal border border-primary-teal/20">
              {activeTab === "DRUGS" ? <Pill className="h-5 w-5" /> : <FileSpreadsheet className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-fg-app">
                {activeTab === "DRUGS"
                  ? editingDrugItem
                    ? "Edit Drug Master Record"
                    : "Add New Pharmaceutical Drug"
                  : editingIcdItem
                  ? "Edit ICD-10 Clinical Diagnosis"
                  : "Add New ICD-10 Code"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Master Clinical Data Registry Editor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-fg-app transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {activeTab === "DRUGS" ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-fg-app mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Napa Extra"
                    className="w-full h-8 px-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
                  />
                </div>
                <div>
                  <label className="block font-bold text-fg-app mb-1">Generic Name *</label>
                  <input
                    type="text"
                    required
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    placeholder="e.g. Paracetamol + Caffeine"
                    className="w-full h-8 px-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-fg-app mb-1">Strength *</label>
                  <input
                    type="text"
                    required
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    placeholder="e.g. 500 mg"
                    className="w-full h-8 px-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
                  />
                </div>
                <div>
                  <label className="block font-bold text-fg-app mb-1">Formulation *</label>
                  <select
                    value={formulation}
                    onChange={(e) => setFormulation(e.target.value)}
                    className="w-full h-8 px-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment / Cream">Ointment / Cream</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-fg-app mb-1">Manufacturer *</label>
                  <input
                    type="text"
                    required
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="e.g. Square Pharmaceuticals PLC"
                    className="w-full h-8 px-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
                  />
                </div>
                <div>
                  <label className="block font-bold text-fg-app mb-1">DGDA DAR Reg # *</label>
                  <input
                    type="text"
                    required
                    value={dgdaApprovalNo}
                    onChange={(e) => setDgdaApprovalNo(e.target.value)}
                    placeholder="e.g. DAR-012-0089"
                    className="w-full h-8 px-3 rounded-lg bg-card border border-card-border text-xs text-fg-app font-mono"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-fg-app mb-1">ICD-10 Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. E11.9"
                    className="w-full h-8 px-3 rounded-lg bg-card border border-card-border text-xs text-fg-app font-mono uppercase"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-fg-app mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Endocrine & Metabolic"
                    className="w-full h-8 px-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-fg-app mb-1">Diagnosis Title *</label>
                <input
                  type="text"
                  required
                  value={diagnosisTitle}
                  onChange={(e) => setDiagnosisTitle(e.target.value)}
                  placeholder="e.g. Type 2 diabetes mellitus without complications"
                  className="w-full h-8 px-3 rounded-lg bg-card border border-card-border text-xs text-fg-app"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isChronic"
                  checked={isChronic}
                  onChange={(e) => setIsChronic(e.target.checked)}
                  className="rounded border-card-border accent-primary-teal"
                />
                <label htmlFor="isChronic" className="font-semibold text-fg-app cursor-pointer">
                  Mark as Chronic / Long-term Management Condition
                </label>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-card-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-card-border bg-card hover:bg-muted text-fg-app text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-teal hover:bg-primary-teal/90 transition-colors shadow-xs"
            >
              <Save className="h-3.5 w-3.5" /> Save Master Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
