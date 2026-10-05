"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDoctors } from "../services/doctorService";
import { DoctorFilterState } from "../types";

export function useDoctors(filters: DoctorFilterState) {
  return useQuery({
    queryKey: ["doctors", filters],
    queryFn: () => fetchDoctors(filters),
    staleTime: 60 * 1000,
  });
}
