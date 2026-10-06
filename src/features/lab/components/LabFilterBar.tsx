import React from "react";
import { Search, X, RefreshCw } from "lucide-react";

interface LabFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedDoctor: string;
  setSelectedDoctor: (val: string) => void;
  selectedTest: string;
  setSelectedTest: (val: string) => void;
  selectedPriority: string;
  setSelectedPriority: (val: string) => void;
  doctorOptions: string[];
  testOptions: string[];
  isFiltered: boolean;
  onResetFilters: () => void;
}

export function LabFilterBar({
  searchQuery,
  setSearchQuery,
  selectedDoctor,
  setSelectedDoctor,
  selectedTest,
  setSelectedTest,
  selectedPriority,
  setSelectedPriority,
  doctorOptions,
  testOptions,
  isFiltered,
  onResetFilters,
}: LabFilterBarProps) {
  return (
    <div className="p-4 rounded-2xl border border-card-border bg-card shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Patient Name, ID, Doctor, or Test..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:border-primary-teal transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-fg-app"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Doctor Filter Select */}
        <div className="lg:col-span-3">
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
          >
            <option value="ALL">All Referring Doctors</option>
            {doctorOptions.map((doc) => (
              <option key={doc} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>

        {/* Test Name Filter Select */}
        <div className="lg:col-span-3">
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
          >
            <option value="ALL">All Test Names</option>
            {testOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="lg:col-span-2">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-card border border-card-border text-xs font-semibold text-fg-app focus:outline-none focus:border-primary-teal cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="Routine">Routine</option>
            <option value="Urgent">Urgent</option>
            <option value="STAT">STAT (Emergency)</option>
          </select>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {isFiltered && (
        <div className="flex items-center justify-between pt-2 border-t border-card-border/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">Active Filters:</span>
            {searchQuery && (
              <span className="px-2 py-0.5 rounded-md bg-primary-teal/10 text-primary-teal text-[11px] font-semibold border border-primary-teal/20">
                Search: "{searchQuery}"
              </span>
            )}
            {selectedDoctor !== "ALL" && (
              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 text-[11px] font-semibold border border-purple-500/20">
                Doctor: {selectedDoctor}
              </span>
            )}
            {selectedTest !== "ALL" && (
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[11px] font-semibold border border-blue-500/20">
                Test: {selectedTest}
              </span>
            )}
            {selectedPriority !== "ALL" && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[11px] font-semibold border border-amber-500/20">
                Priority: {selectedPriority}
              </span>
            )}
          </div>

          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
