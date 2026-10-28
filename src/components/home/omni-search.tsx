"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Stethoscope,
  Activity,
  TestTube,
  Pill,
  X,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/language-provider";
import { MagneticButton } from "@/components/motion/magnetic-button";
import {
  useSearchHealthcareQuery,
  useGetTrendingSearchesQuery,
  SearchResultItem,
} from "@/redux/api/searchApi";
import { useGetSpecialtiesQuery } from "@/redux/api/doctorApi";

export type { SearchResultItem };

export function OmniSearch() {
  const { t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Debounce query by 200ms for fast responsive backend searches
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Primary: Dynamic trending searches from backend API (/search/trending)
  const {
    data: trendingData,
    isLoading: isLoadingTrending,
  } = useGetTrendingSearchesQuery();

  // Secondary dynamic source: Medical specialties from backend API (/doctors/specialties)
  const {
    data: specialtiesRes,
    isLoading: isLoadingSpecialties,
  } = useGetSpecialtiesQuery();

  const dynamicSpecialtyTags = React.useMemo(() => {
    if (!specialtiesRes?.data || !Array.isArray(specialtiesRes.data)) return [];
    return specialtiesRes.data
      .slice(0, 8)
      .map((s) => s.titleEn)
      .filter(Boolean);
  }, [specialtiesRes]);

  // 100% Dynamic tags from backend - No static fallback
  const trendingTags = (trendingData && trendingData.length > 0)
    ? trendingData
    : dynamicSpecialtyTags;

  const isTrendingLoading = isLoadingTrending && isLoadingSpecialties && trendingTags.length === 0;

  // Dynamic live search API from backend (/search?q=...)
  const {
    data: searchResults,
    isLoading: isSearching,
    isFetching,
  } = useSearchHealthcareQuery(
    { q: debouncedQuery, limit: 12 },
    { skip: !debouncedQuery }
  );

  const results = searchResults || [];
  const hasActiveQuery = query.trim().length > 0;
  const isQueryLoading = isSearching || (isFetching && debouncedQuery.length > 0);

  // Handle click outside to close autocomplete popup
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    setIsOpen(false);

    // If there is an exact first result, prioritize its destination, or default to doctors search
    const firstResult = results[0];
    if (firstResult?.href) {
      router.push(firstResult.href);
    } else {
      router.push(`/doctors?search=${encodeURIComponent(cleanQuery)}`);
    }
  };

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
      default:
        return <Search className="w-4 h-4 text-primary-teal" />;
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={containerRef}>
      {/* Omni-Search Box Form - Seamless borderless design with pure soft shadow */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex items-center rounded-full bg-surface-card/95 backdrop-blur-2xl p-2 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 outline-none ring-0"
        style={{ border: "none", outline: "none", boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0,0,0,0.03)" }}
      >
        <div className="pl-4 pr-2 text-muted-fg flex items-center gap-2">
          {isQueryLoading ? (
            <Loader2 className="w-5 h-5 text-primary-teal animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-primary-teal animate-pulse" />
          )}
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
          style={{ outline: "none", boxShadow: "none", border: "none" }}
          className="w-full bg-transparent py-3 pr-4 text-sm font-semibold text-fg-app placeholder:text-muted-fg/70 outline-none border-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none shadow-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
            }}
            className="p-2 text-muted-fg hover:text-fg-app transition-colors focus:outline-none focus-visible:outline-none"
            aria-label="Clear search query"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <MagneticButton distance={20} strength={0.3} className="ml-2 flex-shrink-0">
          <button
            type="submit"
            className="px-5 py-3 rounded-full bg-gradient-to-r from-primary-teal to-emerald-accent text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:brightness-110 transition-all cursor-pointer focus:outline-none focus-visible:outline-none"
          >
            <span>{t("searchButton")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </MagneticButton>
      </form>

      {/* Autocomplete Dynamic Popup Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 mt-3 rounded-3xl bg-surface-card p-4 sm:p-5 shadow-2xl z-50 overflow-hidden border border-surface-border/40"
            style={{ backgroundColor: "var(--card)" }}
          >
            {!hasActiveQuery ? (
              /* Dynamic Popular Quick Searches from Backend API */
              <div className="space-y-3 p-1">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-fg">
                  <Sparkles className="w-3.5 h-3.5 text-primary-teal" />
                  <span>{t("trendingSearches")}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isTrendingLoading ? (
                    /* Dynamic loading skeleton pills */
                    Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-8 w-24 rounded-xl bg-muted-bg/60 animate-pulse border border-surface-border/30"
                      />
                    ))
                  ) : trendingTags.length > 0 ? (
                    trendingTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setQuery(tag);
                          setDebouncedQuery(tag);
                          setIsOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-surface-border/50 bg-muted-bg/50 text-xs font-bold text-fg-app hover:border-primary-teal hover:text-primary-teal hover:bg-primary-teal/10 transition-all cursor-pointer outline-none focus:outline-none focus-visible:outline-none"
                      >
                        {tag}
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-muted-fg py-1">
                      No trending searches found at this moment.
                    </div>
                  )}
                </div>
              </div>
            ) : isQueryLoading ? (
              /* Live Dynamic Searching State Skeleton */
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-2 px-1 text-[11px] font-bold text-muted-fg">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-teal" />
                  <span>Searching real-time medical database...</span>
                </div>
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-muted-bg/40 animate-pulse"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-9 h-9 rounded-xl bg-muted-bg/80 shrink-0" />
                      <div className="w-2/3 space-y-1.5">
                        <div className="h-3.5 w-1/2 bg-muted-bg/80 rounded" />
                        <div className="h-2.5 w-3/4 bg-muted-bg/50 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              /* Dynamic Live Autocomplete Results from Backend */
              <div className="space-y-1.5 max-h-80 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-fg border-b border-surface-border/60 flex items-center justify-between">
                  <span>
                    {results.length} Results Found for &quot;{query}&quot;
                  </span>
                  <span className="text-[9px] text-muted-fg/70">Press Enter or click to open</span>
                </div>
                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted-bg transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="p-2.5 rounded-xl bg-muted-bg group-hover:bg-primary-teal/15 transition-colors shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-extrabold text-fg-app group-hover:text-primary-teal transition-colors truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-muted-fg font-medium truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border border-surface-border bg-surface-card text-muted-fg group-hover:border-primary-teal group-hover:text-primary-teal shrink-0 transition-colors">
                      {item.badge}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              /* No Results State */
              <div className="p-6 text-center text-muted-fg space-y-2">
                <p className="text-sm font-bold text-fg-app">{t("noResultsFound")}</p>
                <p className="text-xs">{t("noResultsSub")}</p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      router.push(`/doctors?search=${encodeURIComponent(query)}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-teal/10 text-primary-teal font-bold text-xs hover:bg-primary-teal/20 transition-all cursor-pointer"
                  >
                    <span>Browse all doctors for &quot;{query}&quot;</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
