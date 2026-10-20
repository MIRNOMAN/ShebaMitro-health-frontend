"use client";

import React, { useState, useDeferredValue } from "react";
import {
  PharmacyCartProvider,
  usePharmacyCart,
} from "@/features/pharmacy/context/PharmacyCartContext";
import {
  useGetPharmacyMedicinesQuery,
  useGetPharmacyCategoriesQuery,
  useSyncMediDataMutation,
} from "@/redux/api/pharmacyApi";
import { PrescriptionUploadZone } from "@/features/pharmacy/components/PrescriptionUploadZone";
import { MedicineCard } from "@/features/pharmacy/components/MedicineCard";
import { PharmacyCheckoutDrawer } from "@/features/pharmacy/components/PharmacyCheckoutDrawer";
import {
  Pill,
  ShieldCheck,
  Zap,
  Search,
  ShoppingBag,
  Sparkles,
  Award,
  Loader2,
  RefreshCw,
  Database,
  CloudCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DEFAULT_CATEGORY_TABS = [
  { id: "all", name: "All Medicines" },
  { id: "pain", name: "Pain Relief & Fever" },
  { id: "digestive", name: "Digestive & Acidity" },
  { id: "diabetic", name: "Diabetic Care" },
  { id: "cardiac", name: "Cardiac & BP" },
  { id: "vitamins", name: "Vitamins & Supplements" },
  { id: "antibiotic", name: "Antibiotics" },
];

function PharmacyPageContent() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const deferredSearch = useDeferredValue(searchQuery);

  const { setIsDrawerOpen, totalItemCount, subtotal } = usePharmacyCart();
  const [syncMediData, { isLoading: isSyncing }] = useSyncMediDataMutation();

  // Dynamic API queries
  const {
    data: medicinesData,
    isLoading: isMedicinesLoading,
    isFetching: isMedicinesFetching,
    isError: isMedicinesError,
    refetch: refetchMedicines,
  } = useGetPharmacyMedicinesQuery({
    category: activeCategory,
    search: deferredSearch.trim(),
    limit: 60,
  });

  const { data: dynamicCategories, refetch: refetchCategories } = useGetPharmacyCategoriesQuery();

  const categories = dynamicCategories && dynamicCategories.length > 0
    ? dynamicCategories
    : DEFAULT_CATEGORY_TABS;

  const medicines = medicinesData?.medicines || [];

  const handleSyncMediData = async () => {
    try {
      const res = await syncMediData().unwrap();
      toast.success(
        `Successfully synced ${res.synced} Bangladesh medications from MediData API!`
      );
      refetchMedicines();
      refetchCategories();
    } catch (e: any) {
      toast.error("Failed to sync from MediData API. Local database is active.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-teal/10 via-background to-background py-10 lg:py-14 border-b border-card-border/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-radial from-primary-teal/20 to-transparent blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" /> 100% Genuine DGDA Approved Medicines
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-fg-app tracking-tight">
              Order Medicines & <span className="text-primary-teal">AI Prescription Reader</span>
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Upload doctor prescriptions for instant AI scanning, client-side image compression, and automatic medicine cart filling. Enjoy Express 2-Hour delivery right to your doorstep.
            </p>

            {/* Features Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-fg-app">
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <Zap className="h-4 w-4 text-amber-500 fill-amber-400" />
                <span>Express 2-Hour Doorstep Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <Sparkles className="h-4 w-4 text-primary-teal" />
                <span>Free AI Prescription OCR Line Reader</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <Award className="h-4 w-4 text-emerald-500" />
                <span>Cold Chain & Sealed Packaging</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Prescription AI Scanner Zone */}
        <PrescriptionUploadZone />

        {/* OTC & Prescription Medicine Catalog */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-fg-app">Genuine Medicines & Healthcare Products</h2>
                {isMedicinesFetching && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary-teal" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Order verified pharmaceuticals directly from licensed dark stores • {medicines.length} in stock
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* MediData Sync Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncMediData}
                disabled={isSyncing}
                className="h-10 text-xs px-3 gap-1.5 border-card-border hover:border-primary-teal/50 hover:bg-primary-teal/10 text-fg-app"
                title="Sync and refresh live medicines from MediData API"
              >
                {isSyncing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-teal" />
                ) : (
                  <Database className="h-3.5 w-3.5 text-primary-teal" />
                )}
                <span>{isSyncing ? "Syncing MediData..." : "Sync MediData API"}</span>
              </Button>

              {/* Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medicine, brand or generic..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-card-border text-xs text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-fg-app"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat: any) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary-teal text-white border border-primary-teal shadow-xs"
                      : "border border-card-border bg-card hover:bg-muted/40 text-fg-app"
                  }`}
                >
                  <span>{cat.name}</span>
                  {typeof cat.count === "number" && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Medicines Grid */}
          {isMedicinesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-card-border bg-card p-4 space-y-4 animate-pulse"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-24 bg-muted/60 rounded-md" />
                    <div className="h-5 w-16 bg-muted/60 rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 bg-muted/80 rounded-md" />
                    <div className="h-3 w-1/2 bg-muted/50 rounded-md" />
                    <div className="h-3 w-2/3 bg-muted/40 rounded-md" />
                  </div>
                  <div className="h-8 bg-muted/40 rounded-lg" />
                  <div className="pt-3 border-t border-card-border flex justify-between items-center">
                    <div className="h-6 w-16 bg-muted/70 rounded-md" />
                    <div className="h-8 w-16 bg-muted/70 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : isMedicinesError ? (
            <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/5 p-8">
              <Pill className="h-12 w-12 text-rose-500 mx-auto" />
              <h3 className="text-base font-bold text-fg-app">Unable to Load Medicines</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Could not connect to the pharmacy catalog server. Please check your connection and retry.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchMedicines()}
                className="gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry Fetch
              </Button>
            </div>
          ) : medicines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {medicines.map((med) => (
                <MedicineCard key={med.id} medicine={med} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-card-border bg-card/40 p-8">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-fg-app">No Medicines Found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try searching for generic names like Paracetamol, Omeprazole, or switch categories.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
              >
                Reset Search
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Cart Widget Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-primary-teal text-white shadow-xl hover:opacity-95 transition-all hover:scale-105 active:scale-95 group border border-primary-teal/40 glow-teal cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalItemCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-emerald-400 text-slate-950 text-[11px] font-extrabold flex items-center justify-center border-2 border-primary-teal">
                {totalItemCount}
              </span>
            )}
          </div>
          <div className="text-left font-semibold text-xs">
            <span className="block text-[10px] opacity-80 uppercase tracking-wider font-bold">
              Medicine Cart
            </span>
            <span>
              {totalItemCount > 0
                ? `৳${subtotal.toLocaleString()} (${totalItemCount} ${totalItemCount === 1 ? "Item" : "Items"})`
                : "View Cart & Checkout"}
            </span>
          </div>
        </button>
      </div>

      {/* 3-Step Checkout Drawer */}
      <PharmacyCheckoutDrawer />
    </div>
  );
}

export default function PharmacyPage() {
  return (
    <PharmacyCartProvider>
      <PharmacyPageContent />
    </PharmacyCartProvider>
  );
}
