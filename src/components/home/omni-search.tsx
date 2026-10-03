"use client";

import * as React from "react";
import { Search, Stethoscope, Activity, TestTube, Pill, X, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/language-provider";
import { MagneticButton } from "@/components/motion/magnetic-button";

export interface SearchResultItem {
  id: string;
  title: string;
  category: "doctor" | "symptom" | "test" | "medicine";
  subtitle: string;
  badge: string;
  href: string;
}

const searchDatabase: SearchResultItem[] = [
  // Doctors
  { id: "d1", title: "Dr. Sarah Jenkins", category: "doctor", subtitle: "Cardiologist • 12+ Yrs Exp", badge: "Doctor", href: "/doctors/specialists" },
  { id: "d2", title: "Dr. Aris Thorne", category: "doctor", subtitle: "Neurologist • 15+ Yrs Exp", badge: "Doctor", href: "/doctors/specialists" },
  { id: "d3", title: "Dr. Elena Rostova", category: "doctor", subtitle: "Pediatric Specialist • 9+ Yrs Exp", badge: "Doctor", href: "/doctors/specialists" },
  
  // Symptoms
  { id: "s1", title: "Chest Pain & Shortness of Breath", category: "symptom", subtitle: "Requires Urgent Cardiology Review", badge: "Symptom", href: "/doctors/emergency" },
  { id: "s2", title: "Migraine & Severe Headache", category: "symptom", subtitle: "Consult Neurologist or General Physician", badge: "Symptom", href: "/doctors/specialists" },
  { id: "s3", title: "Fever, Cold & Persistent Cough", category: "symptom", subtitle: "Book Telemedicine Video Consult", badge: "Symptom", href: "/doctors/telemedicine" },
  { id: "s4", title: "Joint Pain & Stiffness", category: "symptom", subtitle: "Consult Orthopedic Specialist", badge: "Symptom", href: "/doctors/specialists" },

  // Tests
  { id: "t1", title: "Full Body Executive Health Checkup", category: "test", subtitle: "80+ Vital Parameters Included", badge: "Lab Test", href: "/packages/full-body" },
  { id: "t2", title: "HbA1c & Fasting Blood Sugar Test", category: "test", subtitle: "Home Sample Collection Available", badge: "Lab Test", href: "/diagnostics/home-collection" },
  { id: "t3", title: "Brain & Spine MRI 3T Scan", category: "test", subtitle: "Book Accredited Imaging Center", badge: "Lab Test", href: "/diagnostics/imaging" },

  // Medicines
  { id: "m1", title: "Paracetamol 500mg", category: "medicine", subtitle: "Rapid 2-Hour Express Delivery", badge: "Pharmacy", href: "/pharmacy/express" },
  { id: "m2", title: "Amoxicillin 500mg Antibiotic", category: "medicine", subtitle: "Prescription Required", badge: "Pharmacy", href: "/pharmacy/upload" },
];

export function OmniSearch() {
  const { t } = useLanguage();
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Filter live results
  const filteredResults = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchDatabase.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
    );
  }, [query]);

  // Handle click outside to close autocomplete popup
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCategoryIcon = (category: SearchResultItem["category"]) => {
    switch (category) {
      case "doctor":
        return <Stethoscope className="w-4 h-4 text-primary-teal" />;
      case "symptom":
        return <Activity className="w-4 h-4 text-coral-accent" />;
      case "test":
        return <TestTube className="w-4 h-4 text-violet-accent" />;
      case "medicine":
        return <Pill className="w-4 h-4 text-emerald-accent" />;
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={containerRef}>
      {/* Omni-Search Box with Clean Border & No Nested Inner Input Focus Outline */}
      <div className="relative flex items-center rounded-3xl border border-surface-border bg-surface-card/90 backdrop-blur-2xl p-2 shadow-2xl transition-all duration-300 focus-within:border-primary-teal focus-within:ring-1 focus-within:ring-primary-teal/50 luminous-border">
        <div className="pl-4 pr-2 text-muted-fg flex items-center gap-2">
          <Search className="w-5 h-5 text-primary-teal animate-pulse" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t("searchPlaceholder")}
          className="w-full bg-transparent py-3 pr-4 text-sm font-semibold text-fg-app placeholder:text-muted-fg/70 outline-none border-none focus:outline-none focus:ring-0 focus:border-none shadow-none"
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="p-2 text-muted-fg hover:text-fg-app transition-colors"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <MagneticButton distance={20} strength={0.3} className="ml-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-primary-teal to-emerald-accent text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:brightness-110 transition-all"
          >
            <span>{t("searchButton")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </MagneticButton>
      </div>

      {/* Autocomplete Popup Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 mt-3 rounded-3xl border border-surface-border bg-surface-card p-4 shadow-2xl z-50 overflow-hidden luminous-border"
            style={{ backgroundColor: "var(--card)" }}
          >
            {query.trim() === "" ? (
              /* Popular Quick Searches */
              <div className="space-y-3 p-2">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-fg">
                  <Sparkles className="w-3.5 h-3.5 text-primary-teal" />
                  <span>{t("trendingSearches")}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Chest Pain", "Cardiologist", "Full Body Checkup", "Migraine", "Diabetes Test", "Paracetamol"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setQuery(tag);
                          setIsOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-surface-border bg-muted-bg/60 text-xs font-bold text-fg-app hover:border-primary-teal hover:text-primary-teal transition-all"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : filteredResults.length > 0 ? (
              /* Live Autocomplete Results */
              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-fg border-b border-surface-border/60">
                  {filteredResults.length} Results Found for &quot;{query}&quot;
                </div>
                {filteredResults.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted-bg transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-muted-bg group-hover:bg-primary-teal/15 transition-colors">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-fg-app group-hover:text-primary-teal transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-muted-fg font-medium">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border border-surface-border bg-surface-card text-muted-fg group-hover:border-primary-teal group-hover:text-primary-teal transition-colors">
                      {item.badge}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              /* No Results State */
              <div className="p-6 text-center text-muted-fg space-y-1">
                <p className="text-sm font-bold text-fg-app">{t("noResultsFound")}</p>
                <p className="text-xs">{t("noResultsSub")}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
