import { baseApi } from "./baseApi";
import {
  SpecialtyMasterItem,
  DrugMasterItem,
  Icd10MasterItem,
} from "@/features/admin/types/masterData";

export const masterDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // MEDICAL SPECIALTIES
    // ==========================================
    getSpecialties: builder.query<SpecialtyMasterItem[], { search?: string; isActive?: string } | void>({
      query: (params) => ({
        url: "/doctors/specialties",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        const raw = response?.data ?? response;
        if (Array.isArray(raw)) {
          return raw.map((item: any) => ({
            id: item.specialtyId || item.id,
            specialtyId: item.specialtyId || item.id,
            code: item.code || item.id,
            titleEn: item.titleEn,
            titleBn: item.titleBn,
            count: item.count ?? 0,
            doctorCount: item.doctorCount || `${item.count ?? 0} Doctors`,
            doctorCountBn: item.doctorCountBn || `${item.count ?? 0} জন ডাক্তার`,
            icon: item.icon || "HeartPulse",
            gradient: item.gradient || "from-primary-teal to-emerald-accent",
            badgeColor: item.badgeColor || "text-primary-teal bg-primary-teal/15 border-primary-teal/30",
            description: item.description || "",
            keywords: item.keywords || [],
            isActive: item.isActive !== undefined ? item.isActive : true,
            status: item.isActive !== false ? "Active" : "Deprecated",
            updatedAt: item.updatedAt ? String(item.updatedAt).substring(0, 10) : new Date().toISOString().substring(0, 10),
          }));
        }
        return [];
      },
      providesTags: ["Specialties"],
    }),

    getSpecialtyById: builder.query<SpecialtyMasterItem, string>({
      query: (id) => ({
        url: `/admin/specialties/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const item = response?.data ?? response;
        return {
          id: item.specialtyId || item.id,
          specialtyId: item.specialtyId || item.id,
          code: item.code || item.id,
          titleEn: item.titleEn,
          titleBn: item.titleBn,
          count: item.count ?? 0,
          doctorCount: item.doctorCount || `${item.count ?? 0} Doctors`,
          doctorCountBn: item.doctorCountBn || `${item.count ?? 0} জন ডাক্তার`,
          icon: item.icon || "HeartPulse",
          gradient: item.gradient || "from-primary-teal to-emerald-accent",
          badgeColor: item.badgeColor || "text-primary-teal bg-primary-teal/15 border-primary-teal/30",
          description: item.description || "",
          keywords: item.keywords || [],
          isActive: item.isActive !== undefined ? item.isActive : true,
          status: item.isActive !== false ? "Active" : "Deprecated",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt ? String(item.updatedAt).substring(0, 10) : new Date().toISOString().substring(0, 10),
        };
      },
      providesTags: ["Specialties"],
    }),

    createSpecialty: builder.mutation<SpecialtyMasterItem, Partial<SpecialtyMasterItem>>({
      query: (body) => ({
        url: "/admin/specialties",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Specialties", "Doctor"],
    }),

    updateSpecialty: builder.mutation<SpecialtyMasterItem, { id: string } & Partial<SpecialtyMasterItem>>({
      query: ({ id, ...patch }) => ({
        url: `/admin/specialties/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Specialties", "Doctor"],
    }),

    deleteSpecialty: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/admin/specialties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Specialties", "Doctor"],
    }),

    // ==========================================
    // ICD-10 DIAGNOSES
    // ==========================================
    getIcd10: builder.query<
      { items: Icd10MasterItem[]; total: number; page: number; limit: number; totalPages: number },
      { page?: number; limit?: number; search?: string; category?: string; status?: string } | void
    >({
      query: (params) => ({
        url: "/admin/icd10",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 50,
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.category && params.category !== "all" ? { category: params.category } : {}),
          ...(params?.status && params.status !== "all" ? { status: params.status } : {}),
        },
      }),
      transformResponse: (response: any) => {
        const d = response?.data ?? response;
        const items = (d.items || d || []).map((item: any) => ({
          id: item.id,
          code: item.code,
          diagnosisTitle: item.diagnosisTitle,
          category: item.category,
          isChronic: Boolean(item.isChronic),
          isActive: item.isActive !== false,
          status: item.status || (item.isActive !== false ? "Active" : "Deprecated"),
          updatedAt: item.updatedAt ? String(item.updatedAt).substring(0, 10) : new Date().toISOString().substring(0, 10),
        }));
        return {
          items,
          total: d.total ?? items.length,
          page: d.page ?? 1,
          limit: d.limit ?? 50,
          totalPages: d.totalPages ?? Math.max(1, Math.ceil((d.total ?? items.length) / (d.limit ?? 50))),
        };
      },
      providesTags: ["ICD10"],
    }),

    getIcd10ById: builder.query<Icd10MasterItem, string>({
      query: (id) => ({
        url: `/admin/icd10/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const item = response?.data ?? response;
        return {
          id: item.id,
          code: item.code,
          diagnosisTitle: item.diagnosisTitle,
          category: item.category,
          isChronic: Boolean(item.isChronic),
          isActive: item.isActive !== false,
          status: item.status || (item.isActive !== false ? "Active" : "Deprecated"),
          updatedAt: item.updatedAt ? String(item.updatedAt).substring(0, 10) : new Date().toISOString().substring(0, 10),
        };
      },
      providesTags: ["ICD10"],
    }),

    createIcd10: builder.mutation<Icd10MasterItem, Partial<Icd10MasterItem>>({
      query: (body) => ({
        url: "/admin/icd10",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ICD10"],
    }),

    updateIcd10: builder.mutation<Icd10MasterItem, { id: string } & Partial<Icd10MasterItem>>({
      query: ({ id, ...patch }) => ({
        url: `/admin/icd10/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["ICD10"],
    }),

    deleteIcd10: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/admin/icd10/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ICD10"],
    }),

    // ==========================================
    // APPROVED DRUG DIRECTORY / MEDICINES
    // ==========================================
    getMasterDrugs: builder.query<
      { items: DrugMasterItem[]; total: number; page: number; limit: number; totalPages: number },
      { page?: number; limit?: number; search?: string; category?: string; status?: string } | void
    >({
      query: (params) => ({
        url: "/admin/medicines",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 50,
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.category && params.category !== "all" ? { category: params.category } : {}),
          ...(params?.status && params.status !== "all" ? { status: params.status } : {}),
        },
      }),
      transformResponse: (response: any) => {
        const d = response?.data ?? response;
        const rawList = d.items || d.medicines || d || [];
        const items = rawList.map((item: any) => ({
          id: item.id,
          brandName: item.brandName || item.name || "Drug Item",
          name: item.name || item.brandName,
          genericName: item.genericName || "",
          manufacturer: item.manufacturer || "",
          strength: item.strength || "",
          formulation: item.formulation || item.type || "Tablet",
          dgdaApprovalNo: item.dgdaApprovalNo || `DAR-${item.id?.slice(0, 4)?.toUpperCase() || "001"}-1048`,
          price: item.price !== undefined ? Number(item.price) : 10.0,
          stockCount: item.stockCount ?? item.stockQuantity ?? 100,
          stockQuantity: item.stockQuantity ?? item.stockCount ?? 100,
          category: item.category || "General",
          packSize: item.packSize || "10 Strips",
          requiresPrescription: Boolean(item.requiresPrescription || item.prescriptionRequired),
          status: item.status || (item.inStock !== false ? "Active" : "Deprecated"),
          updatedAt: item.updatedAt ? String(item.updatedAt).substring(0, 10) : new Date().toISOString().substring(0, 10),
        }));
        return {
          items,
          total: d.total ?? items.length,
          page: d.page ?? 1,
          limit: d.limit ?? 50,
          totalPages: d.totalPages ?? Math.max(1, Math.ceil((d.total ?? items.length) / (d.limit ?? 50))),
        };
      },
      providesTags: ["MasterDrugs"],
    }),

    getMasterDrugById: builder.query<DrugMasterItem, string>({
      query: (id) => ({
        url: `/admin/medicines/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const item = response?.data ?? response;
        return {
          id: item.id,
          brandName: item.brandName || item.name || "Drug Item",
          name: item.name || item.brandName,
          genericName: item.genericName || "",
          manufacturer: item.manufacturer || "",
          strength: item.strength || "",
          formulation: item.formulation || item.type || "Tablet",
          dgdaApprovalNo: item.dgdaApprovalNo || `DAR-${item.id?.slice(0, 4)?.toUpperCase() || "001"}-1048`,
          price: item.price !== undefined ? Number(item.price) : 10.0,
          stockCount: item.stockCount ?? item.stockQuantity ?? 100,
          stockQuantity: item.stockQuantity ?? item.stockCount ?? 100,
          category: item.category || "General",
          packSize: item.packSize || "10 Strips",
          requiresPrescription: Boolean(item.requiresPrescription || item.prescriptionRequired),
          status: item.status || (item.inStock !== false ? "Active" : "Deprecated"),
          updatedAt: item.updatedAt ? String(item.updatedAt).substring(0, 10) : new Date().toISOString().substring(0, 10),
        };
      },
      providesTags: ["MasterDrugs"],
    }),

    createMasterDrug: builder.mutation<DrugMasterItem, Partial<DrugMasterItem>>({
      query: (body) => ({
        url: "/admin/medicines",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MasterDrugs", "Pharmacy", "Medicine"],
    }),

    updateMasterDrug: builder.mutation<DrugMasterItem, { id: string } & Partial<DrugMasterItem>>({
      query: ({ id, ...patch }) => ({
        url: `/admin/medicines/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["MasterDrugs", "Pharmacy", "Medicine"],
    }),

    deleteMasterDrug: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/admin/medicines/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MasterDrugs", "Pharmacy", "Medicine"],
    }),
  }),
});

export const {
  useGetSpecialtiesQuery,
  useGetSpecialtyByIdQuery,
  useCreateSpecialtyMutation,
  useUpdateSpecialtyMutation,
  useDeleteSpecialtyMutation,
  useGetIcd10Query,
  useGetIcd10ByIdQuery,
  useCreateIcd10Mutation,
  useUpdateIcd10Mutation,
  useDeleteIcd10Mutation,
  useGetMasterDrugsQuery,
  useGetMasterDrugByIdQuery,
  useCreateMasterDrugMutation,
  useUpdateMasterDrugMutation,
  useDeleteMasterDrugMutation,
} = masterDataApi;
