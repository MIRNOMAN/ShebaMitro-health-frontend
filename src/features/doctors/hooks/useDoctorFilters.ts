"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { DoctorFilterState } from "../types";

const DEFAULT_FILTERS: DoctorFilterState = {
  specialties: [],
  maxFee: 3000,
  minRating: 0,
  gender: "all",
  availableToday: false,
  search: "",
  sortBy: "recommended",
};

export function useDoctorFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse filters from searchParams
  const filters: DoctorFilterState = useMemo(() => {
    const rawSpecialties = searchParams.get("specialty");
    const specialties = rawSpecialties ? rawSpecialties.split(",").filter(Boolean) : [];

    const rawMaxFee = searchParams.get("maxFee");
    const maxFee = rawMaxFee ? Number(rawMaxFee) : DEFAULT_FILTERS.maxFee;

    const rawMinRating = searchParams.get("minRating");
    const minRating = rawMinRating ? Number(rawMinRating) : DEFAULT_FILTERS.minRating;

    const rawGender = searchParams.get("gender") as DoctorFilterState["gender"];
    const gender = ["all", "male", "female"].includes(rawGender || "")
      ? rawGender!
      : DEFAULT_FILTERS.gender;

    const availableToday = searchParams.get("availableToday") === "true";

    const search = searchParams.get("search") || DEFAULT_FILTERS.search;

    const rawSortBy = searchParams.get("sortBy") as DoctorFilterState["sortBy"];
    const sortBy = ["recommended", "rating", "fee_asc", "fee_desc", "experience"].includes(rawSortBy || "")
      ? rawSortBy!
      : DEFAULT_FILTERS.sortBy;

    return {
      specialties,
      maxFee,
      minRating,
      gender,
      availableToday,
      search,
      sortBy,
    };
  }, [searchParams]);

  // Update URL helper
  const updateParams = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "" || value === "0" || value === "all" || value === "false") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const toggleSpecialty = useCallback(
    (specialtyId: string) => {
      const current = new Set(filters.specialties);
      if (current.has(specialtyId)) {
        current.delete(specialtyId);
      } else {
        current.add(specialtyId);
      }
      const updated = Array.from(current);
      updateParams({
        specialty: updated.length > 0 ? updated.join(",") : null,
      });
    },
    [filters.specialties, updateParams]
  );

  const setMaxFee = useCallback(
    (fee: number) => {
      updateParams({
        maxFee: fee >= 3000 ? null : fee.toString(),
      });
    },
    [updateParams]
  );

  const setMinRating = useCallback(
    (rating: number) => {
      updateParams({
        minRating: rating === 0 ? null : rating.toString(),
      });
    },
    [updateParams]
  );

  const setGender = useCallback(
    (gender: DoctorFilterState["gender"]) => {
      updateParams({
        gender: gender === "all" ? null : gender,
      });
    },
    [updateParams]
  );

  const setAvailableToday = useCallback(
    (available: boolean) => {
      updateParams({
        availableToday: available ? "true" : null,
      });
    },
    [updateParams]
  );

  const setSearch = useCallback(
    (search: string) => {
      updateParams({
        search: search.trim() || null,
      });
    },
    [updateParams]
  );

  const setSortBy = useCallback(
    (sortBy: DoctorFilterState["sortBy"]) => {
      updateParams({
        sortBy: sortBy === "recommended" ? null : sortBy,
      });
    },
    [updateParams]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.specialties.length > 0) count += filters.specialties.length;
    if (filters.maxFee < 3000) count += 1;
    if (filters.minRating > 0) count += 1;
    if (filters.gender !== "all") count += 1;
    if (filters.availableToday) count += 1;
    if (filters.search) count += 1;
    return count;
  }, [filters]);

  return {
    filters,
    toggleSpecialty,
    setMaxFee,
    setMinRating,
    setGender,
    setAvailableToday,
    setSearch,
    setSortBy,
    resetFilters,
    activeCount,
  };
}
