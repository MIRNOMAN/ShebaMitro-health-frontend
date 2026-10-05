"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDoctorById } from "../services/doctorService";

export function useDoctorDetail(id: string) {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => fetchDoctorById(id),
    staleTime: 60 * 1000,
  });
}
