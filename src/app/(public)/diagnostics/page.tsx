"use client";

import React, { useState, useMemo } from "react";
import {
  DiagnosticCartProvider,
  useDiagnosticCart,
} from "@/features/diagnostics/context/DiagnosticCartContext";
import { DIAGNOSTIC_PACKAGES } from "@/features/diagnostics/data/packages";
import { DiagnosticPackageCard } from "@/features/diagnostics/components/DiagnosticPackageCard";
import { DiagnosticCartDrawer } from "@/features/diagnostics/components/DiagnosticCartDrawer";
import {
  FlaskConical,
  ShieldCheck,
  Truck,
  Clock,
  Search,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_TABS = [
  { id: "all", name: "All Packages" },
  { id: "full_body", name: "Full Body Checkup" },
  { id: "diabetic", name: "Diabetic Health" },
  { id: "cardiac", name: "Cardiac Profile" },
  { id: "women", name: "Women's Wellness" },
  { id: "liver_kidney", name: "Liver & Kidney Care" },
  { id: "thyroid", name: "Thyroid & Hormonal" },
];

function DiagnosticsPageContent() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { setIsCartOpen, totalItemCount, subtotal } = useDiagnosticCart();

  const filteredPackages = useMemo(() => {
    return DIAGNOSTIC_PACKAGES.filter((pkg) => {
      const matchesCategory =
        activeCategory === "all" || pkg.categoryId === activeCategory;
      const matchesSearch =
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.parameters.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-teal/10 via-background to-background py-10 lg:py-14 border-b border-card-border/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-radial from-primary-teal/20 to-transparent blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" /> ISO 15189 Accredited Partner Labs
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-fg-app tracking-tight">
              Book <span className="text-primary-teal">Diagnostic Packages</span> & Home Sample Pickup
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Choose from curated diagnostic checkup packages with instant price discounts. Enjoy free home sample collection by certified phlebotomists and digital report delivery within 12-24 hours.
            </p>

            {/* Feature Highlights Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-fg-app">
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <Truck className="h-4 w-4 text-primary-teal" />
                <span>Free Home Sample Collection over ৳2,000</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span>12-24h Digital Report Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card/60 border border-card-border px-3 py-1.5 rounded-xl shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <span>Sterile Sealed Sample Kits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Search & Category Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search diagnostic packages or test parameters (e.g. HbA1c, Vitamin D, CBC)..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-card-border text-sm text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal transition-all shadow-xs"
              />
            </div>

            <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <span>Showing {filteredPackages.length} Diagnostic Packages</span>
            </div>
          </div>

          {/* Category Tabs Ribbon */}
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
        </div>

        {/* Diagnostic Package Cards Grid */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <DiagnosticPackageCard key={pkg.id} packageObj={pkg} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-card-border bg-card/40 p-8">
            <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold text-fg-app">No Diagnostic Packages Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try searching with different keywords or switch categories to explore checkup packages.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Widget Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
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
              Test Cart
            </span>
            <span>
              {totalItemCount > 0
                ? `৳${subtotal.toLocaleString()} (${totalItemCount} ${totalItemCount === 1 ? "Item" : "Items"})`
                : "View Cart"}
            </span>
          </div>
        </button>
      </div>

      {/* Persistent Sliding Cart Drawer */}
      <DiagnosticCartDrawer />
    </div>
  );
}

export default function DiagnosticsPage() {
  return (
    <DiagnosticCartProvider>
      <DiagnosticsPageContent />
    </DiagnosticCartProvider>
  );
}
