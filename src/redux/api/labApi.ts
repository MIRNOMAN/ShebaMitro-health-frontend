/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface LabTest {
  id: string;
  testName: string;
  category: string;
  description?: string;
  sampleType?: string;
  parameters: string[];
  parametersCount: number;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  fastingRequired: boolean;
  turnaroundHours: number;
  labAccreditation?: string;
  homeCollectionEligible: boolean;
  isPopular: boolean;
  imageUrl?: string;
  lab?: {
    id: string;
    labName: string;
    licenseNo?: string;
    address?: string;
    accreditation?: string;
  };
}

export interface LabCategory {
  id: string;
  name: string;
  count: number;
}

export interface LabOrder {
  id: string;
  patientId: string;
  labId: string;
  testNames: string[];
  totalFee: number;
  status: "PENDING" | "SAMPLE_COLLECTED" | "PROCESSING" | "REPORT_READY" | "CANCELLED";
  sampleCollectionAddress?: string;
  sampleCollectionSlot?: string;
  technicianName?: string;
  technicianPhone?: string;
  technicianLatitude?: number;
  technicianLongitude?: number;
  reportPdfUrl?: string;
  isEncrypted?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    user?: {
      name: string;
      phone: string;
      email: string;
    };
  };
  lab?: {
    id: string;
    labName: string;
    address?: string;
    accreditation?: string;
  };
}

export interface CreateLabOrderInput {
  testNames: string[];
  sampleCollectionAddress: string;
  sampleCollectionSlot: string;
  patientName?: string;
  patientPhone?: string;
  notes?: string;
  labId?: string;
  prescriptionId?: string;
}

export interface LabStats {
  totalRequisitions: number;
  pendingPickups: number;
  sampleCollected: number;
  inLabProcessing: number;
  reportsReady: number;
  totalRevenue: number;
}

export interface GetLabTestsParams {
  category?: string;
  search?: string;
  fastingRequired?: boolean;
  page?: number;
  limit?: number;
}

export interface LabTestsResponse {
  tests: LabTest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LabOrdersResponse {
  orders: LabOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const labApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLabTests: builder.query<LabTestsResponse, GetLabTestsParams | void>({
      query: (params) => ({
        url: "/labs/tests",
        params: {
          ...(params?.category && params.category !== "all" ? { category: params.category } : {}),
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.fastingRequired !== undefined ? { fastingRequired: params.fastingRequired } : {}),
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
        },
      }),
      transformResponse: (response: any) => {
        const d = response.data ?? response;
        const list = Array.isArray(d) ? d : d.data || d.tests || [];
        const meta = d.meta || {};
        const total = meta.total ?? list.length;
        const page = meta.page ?? 1;
        const limit = meta.limit ?? 20;
        const totalPages = meta.totalPages ?? Math.max(1, Math.ceil(total / limit));
        return {
          tests: list,
          total,
          page,
          limit,
          totalPages,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.tests.map(({ id }) => ({ type: "Lab" as const, id })),
              { type: "Lab", id: "LIST" },
            ]
          : [{ type: "Lab", id: "LIST" }],
    }),

    getLabCategories: builder.query<LabCategory[], void>({
      query: () => "/labs/categories",
      transformResponse: (response: any) => response.data ?? response,
      providesTags: [{ type: "Lab", id: "CATEGORIES" }],
    }),

    getLabTestById: builder.query<LabTest, string>({
      query: (id) => `/labs/tests/${id}`,
      transformResponse: (response: any) => response.data ?? response,
      providesTags: (_result, _error, id) => [{ type: "Lab", id }],
    }),

    createLabOrder: builder.mutation<LabOrder, CreateLabOrderInput>({
      query: (body) => ({
        url: "/labs/orders",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response.data ?? response,
      invalidatesTags: [
        { type: "LabOrder", id: "LIST" },
        { type: "Stats", id: "LAB" },
      ],
    }),

    getLabOrders: builder.query<
      LabOrdersResponse,
      { status?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/labs/orders",
        params: {
          ...(params?.status && params.status !== "ALL" ? { status: params.status } : {}),
          ...(params?.search ? { search: params.search } : {}),
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
        },
      }),
      transformResponse: (response: any) => {
        const d = response.data ?? response;
        const list = Array.isArray(d) ? d : d.data || d.orders || [];
        const meta = d.meta || {};
        const total = meta.total ?? list.length;
        const page = meta.page ?? 1;
        const limit = meta.limit ?? 20;
        const totalPages = meta.totalPages ?? Math.max(1, Math.ceil(total / limit));
        return {
          orders: list,
          total,
          page,
          limit,
          totalPages,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ id }) => ({ type: "LabOrder" as const, id })),
              { type: "LabOrder", id: "LIST" },
            ]
          : [{ type: "LabOrder", id: "LIST" }],
    }),

    updateLabOrderStatus: builder.mutation<LabOrder, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/labs/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: any) => response.data ?? response,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "LabOrder", id },
        { type: "LabOrder", id: "LIST" },
        { type: "Stats", id: "LAB" },
      ],
    }),

    assignLabTechnician: builder.mutation<
      any,
      { id: string; technicianName: string; technicianPhone: string; latitude: number; longitude: number }
    >({
      query: ({ id, ...body }) => ({
        url: `/labs/orders/${id}/assign-technician`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: any) => response.data ?? response,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "LabOrder", id },
        { type: "LabOrder", id: "LIST" },
      ],
    }),

    uploadLabReport: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/labs/orders/${id}/upload-report`,
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: any) => response.data ?? response,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "LabOrder", id },
        { type: "LabOrder", id: "LIST" },
      ],
    }),

    getLabStats: builder.query<LabStats, void>({
      query: () => "/labs/stats",
      transformResponse: (response: any) => response.data ?? response,
      providesTags: [{ type: "Stats", id: "LAB" }],
    }),
  }),
});

export const {
  useGetLabTestsQuery,
  useGetLabCategoriesQuery,
  useGetLabTestByIdQuery,
  useCreateLabOrderMutation,
  useGetLabOrdersQuery,
  useUpdateLabOrderStatusMutation,
  useAssignLabTechnicianMutation,
  useUploadLabReportMutation,
  useGetLabStatsQuery,
} = labApi;
