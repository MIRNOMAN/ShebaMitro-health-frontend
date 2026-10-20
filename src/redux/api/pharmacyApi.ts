import { baseApi } from "./baseApi";
import type { Medicine, RecognizedMedicine } from "@/features/pharmacy/types";

export interface PharmacyMedicinesResponse {
  medicines: Medicine[];
  meta: {
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
  recognizedItems: RecognizedMedicine[];
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
      { category?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/pharmacy/medicines",
        params: {
          ...(params?.category && params.category !== "all" ? { category: params.category } : {}),
          ...(params?.search ? { search: params.search } : {}),
          page: params?.page ?? 1,
          limit: params?.limit ?? 50,
        },
      }),
      transformResponse: (response: any) => response.data ?? response,
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
  }),
});

export const {
  useGetPharmacyMedicinesQuery,
  useLazyGetPharmacyMedicinesQuery,
  useGetPharmacyCategoriesQuery,
  useGetMedicineByIdQuery,
  useScanPrescriptionMutation,
  useCheckoutCartMutation,
} = pharmacyApi;
