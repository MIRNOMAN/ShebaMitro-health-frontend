"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDoctorById } from "../services/doctorService";
import { Doctor } from "../types";

export function useDoctorDetail(id: string, initialDoctor?: Doctor | null) {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => fetchDoctorById(id),
    initialData: initialDoctor || undefined,
    staleTime: 60 * 1000,
  });
}
