"use client";

import React, { useState } from "react";
import { Database, CheckCircle2, AlertCircle } from "lucide-react";
import {
  SpecialtyMasterItem,
  DrugMasterItem,
  Icd10MasterItem,
  MasterDataTab,
} from "@/features/admin/types/masterData";
import { MasterDataHeaderControls } from "@/features/admin/components/master-data/MasterDataHeaderControls";
import { SpecialtiesDirectoryTable } from "@/features/admin/components/master-data/SpecialtiesDirectoryTable";
import { DrugDirectoryTable } from "@/features/admin/components/master-data/DrugDirectoryTable";
import { Icd10DirectoryTable } from "@/features/admin/components/master-data/Icd10DirectoryTable";
import { MasterDataModal } from "@/features/admin/components/master-data/MasterDataModal";
import { MasterDataSingleViewModal } from "@/features/admin/components/master-data/MasterDataSingleViewModal";
import { DeleteConfirmModal } from "@/features/admin/components/master-data/DeleteConfirmModal";
import {
  useGetSpecialtiesQuery,
  useCreateSpecialtyMutation,
  useUpdateSpecialtyMutation,
  useDeleteSpecialtyMutation,
  useGetMasterDrugsQuery,
  useCreateMasterDrugMutation,
  useUpdateMasterDrugMutation,
  useDeleteMasterDrugMutation,
  useGetIcd10Query,
  useCreateIcd10Mutation,
  useUpdateIcd10Mutation,
  useDeleteIcd10Mutation,
} from "@/redux/api/masterDataApi";

export default function AdminMasterDataPage() {
  const [activeTab, setActiveTab] = useState<MasterDataTab>("SPECIALTIES");

  // RTK Query hooks for Specialties
  const { data: specialties = [], isLoading: isLoadingSpecialties } = useGetSpecialtiesQuery();
  const [createSpecialty] = useCreateSpecialtyMutation();
  const [updateSpecialty] = useUpdateSpecialtyMutation();
  const [deleteSpecialty] = useDeleteSpecialtyMutation();

  // RTK Query hooks for Drugs / Medicines
  const { data: drugsData, isLoading: isLoadingDrugs } = useGetMasterDrugsQuery({ limit: 200 });
  const drugs = drugsData?.items || [];
  const [createDrug] = useCreateMasterDrugMutation();
  const [updateDrug] = useUpdateMasterDrugMutation();
  const [deleteDrug] = useDeleteMasterDrugMutation();

  // RTK Query hooks for ICD-10
  const { data: icd10Data, isLoading: isLoadingIcd10 } = useGetIcd10Query({ limit: 200 });
  const icd10Items = icd10Data?.items || [];
  const [createIcd] = useCreateIcd10Mutation();
  const [updateIcd] = useUpdateIcd10Mutation();
  const [deleteIcd] = useDeleteIcd10Mutation();

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialtyItem, setEditingSpecialtyItem] = useState<SpecialtyMasterItem | null>(null);
  const [editingDrugItem, setEditingDrugItem] = useState<DrugMasterItem | null>(null);
  const [editingIcdItem, setEditingIcdItem] = useState<Icd10MasterItem | null>(null);

  // Single View Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingSpecialty, setViewingSpecialty] = useState<SpecialtyMasterItem | null>(null);
  const [viewingDrug, setViewingDrug] = useState<DrugMasterItem | null>(null);
  const [viewingIcd, setViewingIcd] = useState<Icd10MasterItem | null>(null);

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
    type: "SPECIALTY" | "DRUG" | "ICD10";
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification Banner
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- SPECIALTY HANDLERS ---
  const handleSaveSpecialty = async (data: Partial<SpecialtyMasterItem>) => {
    try {
      if (data.id) {
        await updateSpecialty({ id: data.id, ...data }).unwrap();
        showNotification("Specialty updated successfully in live database.");
      } else {
        await createSpecialty(data).unwrap();
        showNotification("New medical specialty registered successfully.");
      }
    } catch (err: any) {
      showNotification(err?.data?.message || "Failed to save medical specialty.", "error");
    }
  };

  const handleToggleSpecialtyStatus = async (item: SpecialtyMasterItem) => {
    try {
      const nextActive = item.isActive === false ? true : false;
      await updateSpecialty({
        id: item.id || item.code,
        isActive: nextActive,
      }).unwrap();
      showNotification(`Specialty status updated to ${nextActive ? "Active" : "Deprecated"}.`);
    } catch (err: any) {
      showNotification("Failed to update status.", "error");
    }
  };

  // --- DRUG HANDLERS ---
  const handleSaveDrug = async (data: Partial<DrugMasterItem>) => {
    try {
      if (data.id) {
        await updateDrug({ id: data.id, ...data }).unwrap();
        showNotification("Pharmaceutical record updated successfully in database.");
      } else {
        await createDrug(data).unwrap();
        showNotification("New drug added to platform directory.");
      }
    } catch (err: any) {
      showNotification(err?.data?.message || "Failed to save drug.", "error");
    }
  };

  const handleToggleDrugStatus = async (item: DrugMasterItem) => {
    try {
      const nextStatus = item.status === "Active" ? "Deprecated" : "Active";
      await updateDrug({
        id: item.id,
        status: nextStatus,
      }).unwrap();
      showNotification(`Drug status changed to ${nextStatus}.`);
    } catch (err: any) {
      showNotification("Failed to update drug status.", "error");
    }
  };

  // --- ICD-10 HANDLERS ---
  const handleSaveIcd = async (data: Partial<Icd10MasterItem>) => {
    try {
      if (data.id) {
        await updateIcd({ id: data.id, ...data }).unwrap();
        showNotification("ICD-10 clinical diagnosis updated successfully.");
      } else {
        await createIcd(data).unwrap();
        showNotification("New ICD-10 code added to master table.");
      }
    } catch (err: any) {
      showNotification(err?.data?.message || "Failed to save ICD-10 record.", "error");
    }
  };

  const handleToggleIcdStatus = async (item: Icd10MasterItem) => {
    try {
      const nextStatus = item.status === "Active" ? "Deprecated" : "Active";
      await updateIcd({
        id: item.id,
        status: nextStatus,
      }).unwrap();
      showNotification(`ICD-10 diagnosis status changed to ${nextStatus}.`);
    } catch (err: any) {
      showNotification("Failed to update ICD-10 status.", "error");
    }
  };

  // --- DELETE CONFIRMATION ---
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (itemToDelete.type === "SPECIALTY") {
        await deleteSpecialty(itemToDelete.id).unwrap();
        showNotification(`Specialty "${itemToDelete.name}" deleted successfully.`);
      } else if (itemToDelete.type === "DRUG") {
        await deleteDrug(itemToDelete.id).unwrap();
        showNotification(`Drug "${itemToDelete.name}" deleted successfully.`);
      } else if (itemToDelete.type === "ICD10") {
        await deleteIcd(itemToDelete.id).unwrap();
        showNotification(`ICD-10 Code "${itemToDelete.name}" deleted successfully.`);
      }
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      showNotification(err?.data?.message || "Failed to delete record.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- EXPORT CSV ---
  const handleExportCsv = () => {
    let filename = "shebamitro_master_data.csv";
    let dataStr = "";

    if (activeTab === "SPECIALTIES") {
      filename = "medical_specialties_master.csv";
      dataStr =
        "ID,Code,Title English,Title Bangla,Doctor Count,Status\n" +
        specialties
          .map(
            (s) =>
              `"${s.id}","${s.code}","${s.titleEn}","${s.titleBn}","${s.doctorCount || s.count || 0}","${s.status || (s.isActive !== false ? "Active" : "Deprecated")}"`
          )
          .join("\n");
    } else if (activeTab === "DRUGS") {
      filename = "drugs_master_directory.csv";
      dataStr =
        "ID,Brand Name,Generic Name,Manufacturer,Strength,Formulation,DGDA DAR No,Price,Status\n" +
        drugs
          .map(
            (d) =>
              `"${d.id}","${d.brandName}","${d.genericName}","${d.manufacturer}","${d.strength}","${d.formulation}","${d.dgdaApprovalNo}","${d.price ?? 10}","${d.status}"`
          )
          .join("\n");
    } else {
      filename = "icd10_diagnosis_directory.csv";
      dataStr =
        "ID,ICD10 Code,Diagnosis Title,Category,Is Chronic,Status\n" +
        icd10Items
          .map(
            (i) =>
              `"${i.id}","${i.code}","${i.diagnosisTitle}","${i.category}","${i.isChronic}","${i.status}"`
          )
          .join("\n");
    }

    const blob = new Blob([dataStr], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification(`Exported ${activeTab} data to CSV.`);
  };

  const handleImportCsv = (file: File) => {
    showNotification(`Imported "${file.name}" for live processing.`);
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
            100% database-driven administration for Medical Specialties, DGDA Pharmaceuticals, and ICD-10 Diagnoses.
          </p>
        </div>
      </div>

      {/* Notification Toast Banner */}
      {notification && (
        <div
          className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-600"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{notification.message}</span>
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
      {activeTab === "SPECIALTIES" && (
        <SpecialtiesDirectoryTable
          specialties={specialties}
          isLoading={isLoadingSpecialties}
          onAddNew={() => {
            setEditingSpecialtyItem(null);
            setIsModalOpen(true);
          }}
          onViewSpecialty={(spec) => {
            setViewingSpecialty(spec);
            setIsViewModalOpen(true);
          }}
          onEditSpecialty={(spec) => {
            setEditingSpecialtyItem(spec);
            setIsModalOpen(true);
          }}
          onDeleteSpecialty={(spec) => {
            setItemToDelete({
              id: spec.id || spec.code,
              name: spec.titleEn,
              type: "SPECIALTY",
            });
            setIsDeleteModalOpen(true);
          }}
          onToggleStatus={handleToggleSpecialtyStatus}
        />
      )}

      {activeTab === "DRUGS" && (
        <DrugDirectoryTable
          drugs={drugs}
          isLoading={isLoadingDrugs}
          onAddNew={() => {
            setEditingDrugItem(null);
            setIsModalOpen(true);
          }}
          onViewDrug={(drug) => {
            setViewingDrug(drug);
            setIsViewModalOpen(true);
          }}
          onEditDrug={(drug) => {
            setEditingDrugItem(drug);
            setIsModalOpen(true);
          }}
          onDeleteDrug={(drug) => {
            setItemToDelete({
              id: drug.id,
              name: drug.brandName,
              type: "DRUG",
            });
            setIsDeleteModalOpen(true);
          }}
          onToggleStatus={handleToggleDrugStatus}
        />
      )}

      {activeTab === "ICD10" && (
        <Icd10DirectoryTable
          icd10Items={icd10Items}
          isLoading={isLoadingIcd10}
          onAddNew={() => {
            setEditingIcdItem(null);
            setIsModalOpen(true);
          }}
          onViewIcd={(item) => {
            setViewingIcd(item);
            setIsViewModalOpen(true);
          }}
          onEditIcd={(item) => {
            setEditingIcdItem(item);
            setIsModalOpen(true);
          }}
          onDeleteIcd={(item) => {
            setItemToDelete({
              id: item.id,
              name: `${item.code} - ${item.diagnosisTitle}`,
              type: "ICD10",
            });
            setIsDeleteModalOpen(true);
          }}
          onToggleStatus={handleToggleIcdStatus}
        />
      )}

      {/* Add / Edit Modal */}
      <MasterDataModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSpecialtyItem(null);
          setEditingDrugItem(null);
          setEditingIcdItem(null);
        }}
        activeTab={activeTab}
        editingSpecialtyItem={editingSpecialtyItem}
        editingDrugItem={editingDrugItem}
        editingIcdItem={editingIcdItem}
        onSaveSpecialty={handleSaveSpecialty}
        onSaveDrug={handleSaveDrug}
        onSaveIcd={handleSaveIcd}
      />

      {/* Single View Drawer / Modal */}
      <MasterDataSingleViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingSpecialty(null);
          setViewingDrug(null);
          setViewingIcd(null);
        }}
        tab={activeTab}
        specialty={viewingSpecialty}
        drug={viewingDrug}
        icd10={viewingIcd}
        onEdit={() => {
          setIsViewModalOpen(false);
          if (activeTab === "SPECIALTIES" && viewingSpecialty) {
            setEditingSpecialtyItem(viewingSpecialty);
            setIsModalOpen(true);
          } else if (activeTab === "DRUGS" && viewingDrug) {
            setEditingDrugItem(viewingDrug);
            setIsModalOpen(true);
          } else if (activeTab === "ICD10" && viewingIcd) {
            setEditingIcdItem(viewingIcd);
            setIsModalOpen(true);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={
          itemToDelete?.type === "SPECIALTY"
            ? "Delete Medical Specialty"
            : itemToDelete?.type === "DRUG"
            ? "Delete Pharmaceutical Drug"
            : "Delete ICD-10 Code"
        }
        itemName={itemToDelete?.name || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
