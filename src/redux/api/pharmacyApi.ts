/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import type { Medicine, RecognizedMedicine, SuggestedMedicine } from "@/features/pharmacy/types";

export interface PharmacyMedicinesResponse {
  medicines: Medicine[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PharmacyCategory {
  id: string;
  name: string;
  count: number;
}

export interface PrescriptionScanResponse {
  success: boolean;
  detectedCount: number;
  confidenceAvg: number;
  processingTimeMs: number;
  aiProvider: string;
  prescriptionImageUrl?: string;
  clinicalCondition?: string;
  doctorAdvice?: string[];
  recognizedItems: RecognizedMedicine[];
  suggestedMedicines?: SuggestedMedicine[];
}

export interface CheckoutOrderInput {
  items: Array<{
    medicineId: string;
    quantity: number;
    name?: string;
    price?: number;
  }>;
  shippingAddress: string;
  paymentMethod?: string;
  isExpressDelivery?: boolean;
  prescriptionImageUrl?: string;
  notes?: string;
  contactPhone?: string;
  customerName?: string;
}

export interface CheckoutOrderResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  isExpressDelivery: boolean;
  estimatedDelivery: string;
  shippingAddress: string;
  pharmacyName: string;
  items: any[];
  createdAt: string;
}

export const pharmacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPharmacyMedicines: builder.query<
      PharmacyMedicinesResponse,
      { category?: string; search?: string; names?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/pharmacy/medicines",
        params: {
          ...(params?.category && params.category !== "all" ? { category: params.category } : {}),
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.names ? { names: params.names } : {}),
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
        },
      }),
      transformResponse: (response: any) => {
        const d = response.data ?? response;
        const total = d.total ?? d.meta?.total ?? (d.medicines ? d.medicines.length : 0);
        const page = d.page ?? d.meta?.page ?? 1;
        const limit = d.limit ?? d.meta?.limit ?? 20;
        const totalPages = d.totalPages ?? d.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit));
        return {
          medicines: d.medicines || [],
          total,
          page,
          limit,
          totalPages,
          meta: { total, page, limit, totalPages },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.medicines.map(({ id }) => ({ type: "Medicine" as const, id })),
              { type: "Medicine", id: "LIST" },
            ]
          : [{ type: "Medicine", id: "LIST" }],
    }),

    getPharmacyCategories: builder.query<PharmacyCategory[], void>({
      query: () => "/pharmacy/categories",
      transformResponse: (response: any) => response.data ?? response,
      providesTags: [{ type: "Medicine", id: "CATEGORIES" }],
    }),

    getMedicineById: builder.query<Medicine, string>({
      query: (id) => `/pharmacy/medicines/${id}`,
      transformResponse: (response: any) => response.data ?? response,
      providesTags: (_result, _error, id) => [{ type: "Medicine", id }],
    }),

    scanPrescription: builder.mutation<
      PrescriptionScanResponse,
      FormData | { imageBase64?: string; rawText?: string; fileUrl?: string }
    >({
      query: (body) => ({
        url: "/pharmacy/scan-prescription",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response.data ?? response,
    }),

    checkoutCart: builder.mutation<CheckoutOrderResponse, CheckoutOrderInput>({
      query: (body) => ({
        url: "/pharmacy/checkout",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response.data ?? response,
      invalidatesTags: [{ type: "Medicine", id: "LIST" }, "Pharmacy"],
    }),

    syncMediData: builder.mutation<{ success: boolean; synced: number; items: string[] }, void>({
      query: () => ({
        url: "/medicines/sync",
        method: "POST",
      }),
      transformResponse: (response: any) => response.data ?? response,
      invalidatesTags: [{ type: "Medicine", id: "LIST" }, { type: "Medicine", id: "CATEGORIES" }],
    }),
  }),
});

export const {
  useGetPharmacyMedicinesQuery,
  useLazyGetPharmacyMedicinesQuery,
  useGetPharmacyCategoriesQuery,
  useGetMedicineByIdQuery,
  useScanPrescriptionMutation,
  useCheckoutCartMutation,
  useSyncMediDataMutation,
} = pharmacyApi;
