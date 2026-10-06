"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Search, ShoppingCart, AlertTriangle, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicineInventoryItem, WholesaleReorderItem } from "@/features/pharmacy/types";
import { MOCK_INVENTORY_ITEMS } from "@/features/pharmacy/data/inventoryData";
import { InventoryTable } from "@/features/pharmacy/components/inventory/InventoryTable";
import { InventoryPagination } from "@/features/pharmacy/components/inventory/InventoryPagination";
import { ReorderPoModal } from "@/features/pharmacy/components/inventory/ReorderPoModal";

const ITEMS_PER_PAGE = 5;

export default function PharmacyInventoryPage() {
  const [inventory, setInventory] = useState<MedicineInventoryItem[]>(MOCK_INVENTORY_ITEMS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals & Toasts
  const [isPoModalOpen, setIsPoModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper for expiry check
  const isExpiringWithin60Days = (expiryDateStr: string) => {
    const today = new Date("2026-10-06").getTime();
    const expTime = new Date(expiryDateStr).getTime();
    const diffDays = Math.ceil((expTime - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 60;
  };

  // Filtered Inventory List based on Search Query
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        item.brandName.toLowerCase().includes(q) ||
        item.genericName.toLowerCase().includes(q) ||
        item.batchNo.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q)
      );
    });
  }, [inventory, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const paginatedInventory = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInventory.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredInventory, currentPage]);

  // Calculate items requiring reorder (Units < 20 or Expiry < 60 days)
  const itemsToReorder: WholesaleReorderItem[] = useMemo(() => {
    return inventory
      .filter((item) => item.availableUnits < 20 || isExpiringWithin60Days(item.expiryDate))
      .map((item) => ({
        inventoryId: item.id,
        brandName: item.brandName,
        genericName: item.genericName,
        manufacturer: item.manufacturer,
        currentUnits: item.availableUnits,
        reorderUnits: Math.max(50, item.minimumThreshold * 2 - item.availableUnits),
        estimatedUnitPrice: item.unitPrice,
        reason:
          item.availableUnits < 20
            ? "Low Stock (< 20)"
            : "Expiring Soon (< 60 Days)",
      }));
  }, [inventory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSubmitPo = (poNumber: string) => {
    setIsPoModalOpen(false);
    triggerToast(`Wholesale Purchase Order ${poNumber} submitted to manufacturer depots!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-primary-teal/40 shadow-2xl text-fg-app text-xs font-semibold glow-teal"
          >
            <div className="h-7 w-7 rounded-xl bg-primary-teal text-white flex items-center justify-center shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-purple-500/15 via-primary-teal/10 to-card p-6 rounded-2xl border border-card-border shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
            <Pill className="h-4 w-4" /> Dark Store & Retail Inventory Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg-app tracking-tight">
            Medicine Stock <span className="text-purple-500">Inventory & Reorder</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Search medicine batch numbers, monitor low stock lines (&lt; 20 units) and expiring stock (&lt; 60 days), and generate wholesale POs.
          </p>
        </div>

        {/* 1-Click Wholesale Reorder PO Button */}
        <Button
          variant="primary"
          onClick={() => setIsPoModalOpen(true)}
          className="font-bold text-xs shadow-md glow-teal"
        >
          <ShoppingCart className="h-4 w-4 mr-1.5" /> 1-Click Generate Wholesale Reorder PO ({itemsToReorder.length})
        </Button>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Brand Name, Generic, Batch No, or Manufacturer..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:border-primary-teal"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
            <AlertTriangle className="h-3.5 w-3.5" /> {inventory.filter((i) => i.availableUnits < 20).length} Low Stock
          </span>
          <span className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Clock className="h-3.5 w-3.5" /> {inventory.filter((i) => isExpiringWithin60Days(i.expiryDate)).length} Expiring Soon
          </span>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable items={paginatedInventory} />

      {/* Pagination Controls */}
      <InventoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredInventory.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />

      {/* Wholesale Purchase Order Modal */}
      <ReorderPoModal
        isOpen={isPoModalOpen}
        onClose={() => setIsPoModalOpen(false)}
        reorderItems={itemsToReorder}
        onSubmitPo={handleSubmitPo}
      />
    </div>
  );
}
