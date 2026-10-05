"use client";

import React, { useState, useMemo } from "react";
import {
  PharmacyCartProvider,
  usePharmacyCart,
} from "@/features/pharmacy/context/PharmacyCartContext";
import { MOCK_MEDICINES } from "@/features/pharmacy/data/medicines";
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
  Truck,
  HeartPulse,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_TABS = [
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
  const { setIsDrawerOpen, totalItemCount, subtotal } = usePharmacyCart();

  const filteredMedicines = useMemo(() => {
    return MOCK_MEDICINES.filter((med) => {
      const matchesCategory =
        activeCategory === "all" || med.category === activeCategory;
      const matchesSearch =
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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
                <span>AI OCR Prescription Line Reader</span>
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
              <h2 className="text-xl font-bold text-fg-app">Genuine Medicines & Healthcare Products</h2>
              <p className="text-xs text-muted-foreground">Order verified pharmaceuticals directly from licensed dark stores</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicine, brand or generic..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-card-border text-xs text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal shadow-xs"
              />
            </div>
          </div>

          {/* Category Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORY_TABS.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-primary-teal text-white border border-primary-teal shadow-xs"
                      : "border border-card-border bg-card hover:bg-muted/40 text-fg-app"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Medicines Grid */}
          {filteredMedicines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredMedicines.map((med) => (
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
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-primary-teal text-white shadow-xl hover:opacity-95 transition-all hover:scale-105 active:scale-95 group border border-primary-teal/40 glow-teal"
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
