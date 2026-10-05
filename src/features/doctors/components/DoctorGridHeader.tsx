"use client";

import React from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Stethoscope,
  Check,
} from "lucide-react";
import { DoctorFilterState } from "../types";
import { SPECIALTY_OPTIONS } from "../data/doctors";
import { Button } from "@/components/ui/button";

interface DoctorGridHeaderProps {
  filters: DoctorFilterState;
  total: number;
  isLoading: boolean;
  setSearch: (query: string) => void;
  setSortBy: (sortBy: DoctorFilterState["sortBy"]) => void;
  toggleSpecialty: (id: string) => void;
  setMaxFee: (fee: number) => void;
  setMinRating: (rating: number) => void;
  setGender: (gender: DoctorFilterState["gender"]) => void;
  setAvailableToday: (available: boolean) => void;
  resetFilters: () => void;
  activeCount: number;
  onOpenMobileFilters: () => void;
}

export function DoctorGridHeader({
  filters,
  total,
  isLoading,
  setSearch,
  setSortBy,
  toggleSpecialty,
  setMaxFee,
  setMinRating,
  setGender,
  setAvailableToday,
  resetFilters,
  activeCount,
  onOpenMobileFilters,
}: DoctorGridHeaderProps) {
  const [searchInput, setSearchInput] = React.useState(filters.search);

  // Sync internal search input with external filters state
  React.useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Controls: Search bar & Sort dropdown & Mobile Filter toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 flex items-center"
        >
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onBlur={() => setSearch(searchInput)}
            placeholder="Search doctor name, specialty, degree, hospital or chamber location..."
            className="w-full h-11 pl-10 pr-9 rounded-xl bg-card border border-card-border text-sm text-fg-app placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-teal transition-all shadow-xs"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearch("");
              }}
              className="absolute right-3 p-1 rounded-md text-muted-foreground hover:text-fg-app"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            onClick={onOpenMobileFilters}
            className="lg:hidden h-11 px-3.5 flex items-center gap-2 rounded-xl border-card-border"
          >
            <SlidersHorizontal className="h-4 w-4 text-primary-teal" />
            <span className="text-xs font-semibold">Filters</span>
            {activeCount > 0 && (
              <span className="h-5 w-5 rounded-full bg-primary-teal text-white text-[11px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </Button>

          {/* Sort Select */}
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => setSortBy(e.target.value as DoctorFilterState["sortBy"])}
              className="h-11 pl-8 pr-8 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:ring-2 focus:ring-primary-teal cursor-pointer appearance-none shadow-xs"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Highest Rating</option>
              <option value="fee_asc">Sort: Fee (Low to High)</option>
              <option value="fee_desc">Sort: Fee (High to Low)</option>
              <option value="experience">Sort: Most Experienced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills & Results Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-fg-app">
            {isLoading ? (
              <span className="animate-pulse">Loading doctors...</span>
            ) : (
              <span>
                Found <span className="text-primary-teal font-extrabold">{total}</span> Verified Specialist{total === 1 ? "" : "s"}
              </span>
            )}
          </span>

          {/* Active filter badges */}
          {filters.specialties.map((specId) => {
            const specObj = SPECIALTY_OPTIONS.find((s) => s.id === specId);
            return (
              <span
                key={specId}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-teal/10 text-primary-teal font-medium border border-primary-teal/20"
              >
                {specObj?.name || specId}
                <button
                  onClick={() => toggleSpecialty(specId)}
                  className="hover:bg-primary-teal/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}

          {filters.maxFee < 3000 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
              Max ৳{filters.maxFee}
              <button
                onClick={() => setMaxFee(3000)}
                className="hover:bg-emerald-500/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
              {filters.minRating}+ Stars
              <button
                onClick={() => setMinRating(0)}
                className="hover:bg-amber-500/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.gender !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium border border-purple-500/20 capitalize">
              Gender: {filters.gender}
              <button
                onClick={() => setGender("all")}
                className="hover:bg-purple-500/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.availableToday && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-medium border border-emerald-500/20">
              Available Today
              <button
                onClick={() => setAvailableToday(false)}
                className="hover:bg-emerald-500/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-500 hover:underline pl-1"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
