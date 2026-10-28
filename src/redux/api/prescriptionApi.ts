import { baseApi } from "./baseApi";

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  medicineName: string;
  genericName?: string;
  dosageForm?: string;
  schedulePattern: string;
  mealTiming: string;
  durationDays: number;
}

export interface Prescription {
  id: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  diagnosis?: string;
  notes?: string;
  pdfUrl?: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
  items: PrescriptionItem[];
  doctor?: {
    id: string;
    name: string;
    specialization: string;
    hospital?: string;
    bmdcRegNo?: string;
  };
  patient?: {
    id: string;
    userId: string;
    user?: {
      name: string;
      email: string;
    };
  };
}

export const prescriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrescriptions: builder.query<Prescription[], void>({
      query: () => "/prescriptions",
      transformResponse: (response: any) => {
        const payload = response?.data ?? response;
        if (Array.isArray(payload)) return payload;
        return [];
      },
      providesTags: ["Doctor", "Reminders"],
    }),

    getPrescriptionById: builder.query<Prescription, string>({
      query: (id) => `/prescriptions/${id}`,
      transformResponse: (response: any) => response?.data ?? response,
    }),
  }),
});

export const { useGetPrescriptionsQuery, useGetPrescriptionByIdQuery } = prescriptionApi;

