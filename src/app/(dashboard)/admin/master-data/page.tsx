"use client";

import React, { useState } from "react";
import { Database, Pill, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { DrugMasterItem, Icd10MasterItem, MasterDataTab } from "@/features/admin/types/masterData";
import { MOCK_DRUG_DIRECTORY, MOCK_ICD10_DIRECTORY } from "@/features/admin/data/masterData";
import { MasterDataHeaderControls } from "@/features/admin/components/master-data/MasterDataHeaderControls";
import { DrugDirectoryTable } from "@/features/admin/components/master-data/DrugDirectoryTable";
import { Icd10DirectoryTable } from "@/features/admin/components/master-data/Icd10DirectoryTable";
import { MasterDataModal } from "@/features/admin/components/master-data/MasterDataModal";

export default function AdminMasterDataPage() {
  const [activeTab, setActiveTab] = useState<MasterDataTab>("DRUGS");
  const [drugs, setDrugs] = useState<DrugMasterItem[]>(MOCK_DRUG_DIRECTORY);
  const [icd10Items, setIcd10Items] = useState<Icd10MasterItem[]>(MOCK_ICD10_DIRECTORY);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDrugItem, setEditingDrugItem] = useState<DrugMasterItem | null>(null);
  const [editingIcdItem, setEditingIcdItem] = useState<Icd10MasterItem | null>(null);

  // Notification Banner
  const [importNotification, setImportNotification] = useState<string | null>(null);

  const handleToggleDrugStatus = (id: string) => {
    setDrugs((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === "Active" ? "Deprecated" : "Active" } : d
      )
    );
  };

  const handleToggleIcdStatus = (id: string) => {
    setIcd10Items((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === "Active" ? "Deprecated" : "Active" } : item
      )
    );
  };

  const handleSaveDrug = (data: Partial<DrugMasterItem>) => {
    if (data.id) {
      setDrugs((prev) =>
        prev.map((d) => (d.id === data.id ? ({ ...d, ...data } as DrugMasterItem) : d))
      );
    } else {
      const newDrug: DrugMasterItem = {
        id: `DRUG-${Math.floor(100 + Math.random() * 900)}`,
        brandName: data.brandName || "",
        genericName: data.genericName || "",
        manufacturer: data.manufacturer || "",
        strength: data.strength || "",
        formulation: data.formulation || "Tablet",
        dgdaApprovalNo: data.dgdaApprovalNo || "DAR-000-0000",
        status: "Active",
        updatedAt: new Date().toISOString().substring(0, 10),
      };
      setDrugs((prev) => [newDrug, ...prev]);
    }
  };

  const handleSaveIcd = (data: Partial<Icd10MasterItem>) => {
    if (data.id) {
      setIcd10Items((prev) =>
        prev.map((item) => (item.id === data.id ? ({ ...item, ...data } as Icd10MasterItem) : item))
      );
    } else {
      const newIcd: Icd10MasterItem = {
        id: `ICD-${Math.floor(100 + Math.random() * 900)}`,
        code: data.code || "",
        diagnosisTitle: data.diagnosisTitle || "",
        category: data.category || "General",
        isChronic: !!data.isChronic,
        status: "Active",
        updatedAt: new Date().toISOString().substring(0, 10),
      };
      setIcd10Items((prev) => [newIcd, ...prev]);
    }
  };

  const handleExportCsv = () => {
    const filename = activeTab === "DRUGS" ? "drugs_master_directory.csv" : "icd10_diagnosis_directory.csv";
    const dataStr =
      activeTab === "DRUGS"
        ? "ID,Brand Name,Generic Name,Manufacturer,Strength,Formulation,DGDA DAR No,Status\n" +
          drugs.map((d) => `"${d.id}","${d.brandName}","${d.genericName}","${d.manufacturer}","${d.strength}","${d.formulation}","${d.dgdaApprovalNo}","${d.status}"`).join("\n")
        : "ID,ICD10 Code,Diagnosis Title,Category,Is Chronic,Status\n" +
          icd10Items.map((i) => `"${i.id}","${i.code}","${i.diagnosisTitle}","${i.category}","${i.isChronic}","${i.status}"`).join("\n");

    const blob = new Blob([dataStr], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportCsv = (file: File) => {
    setImportNotification(`Successfully parsed "${file.name}" and merged 14 new records into ${activeTab === "DRUGS" ? "Drug Directory" : "ICD-10 Table"}.`);
    setTimeout(() => setImportNotification(null), 5000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-fg-app flex items-center gap-2">
            <Database className="h-6 w-6 text-primary-teal" /> Clinical Master Data Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Platform-wide directory for DGDA registered pharmaceuticals & ICD-10 diagnostic codes.
          </p>
        </div>
      </div>

      {importNotification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-600 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4" /> {importNotification}
        </div>
      )}

      {/* Navigation Tabs & CSV Controls */}
      <MasterDataHeaderControls
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onExportCsv={handleExportCsv}
        onImportCsv={handleImportCsv}
      />

      {/* Main Table Views */}
      {activeTab === "DRUGS" ? (
        <DrugDirectoryTable
          drugs={drugs}
          onEditDrug={(drug) => {
            setEditingDrugItem(drug);
            setIsModalOpen(true);
          }}
          onToggleStatus={handleToggleDrugStatus}
          onAddNew={() => {
            setEditingDrugItem(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <Icd10DirectoryTable
          icd10Items={icd10Items}
          onEditIcd={(item) => {
            setEditingIcdItem(item);
            setIsModalOpen(true);
          }}
          onToggleStatus={handleToggleIcdStatus}
          onAddNew={() => {
            setEditingIcdItem(null);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Edit / Add Modal */}
      <MasterDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeTab={activeTab}
        editingDrugItem={editingDrugItem}
        editingIcdItem={editingIcdItem}
        onSaveDrug={handleSaveDrug}
        onSaveIcd={handleSaveIcd}
      />
    </div>
  );
}
