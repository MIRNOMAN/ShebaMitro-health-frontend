import { baseApi } from "./baseApi";

export interface SpecialtyItemData {
  id: string;
  titleEn: string;
  titleBn: string;
  count: number;
  doctorCount: string;
  doctorCountBn: string;
  icon: string;
  gradient: string;
  badgeColor: string;
}

export interface SpecialtiesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SpecialtyItemData[];
}

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get all medical specialties with dynamic doctor count per category
     * GET /api/v1/doctors/specialties
     */
    getSpecialties: builder.query<SpecialtiesResponse, void>({
      query: () => "/doctors/specialties",
      providesTags: ["Doctor"],
    }),
  }),
});

export const { useGetSpecialtiesQuery } = doctorApi;
