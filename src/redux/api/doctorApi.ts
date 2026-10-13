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

export interface CreateAppointmentRequest {
  doctorId: string;
  slotStartTime: string;
  slotEndTime: string;
  type?: "CHAMBER" | "ONLINE";
  notes?: string;
}

export interface CreateAppointmentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    doctorId: string;
    patientId: string;
    slotStartTime: string;
    slotEndTime: string;
    type: "CHAMBER" | "ONLINE";
    status: string;
    paymentStatus: string;
    notes?: string;
    doctor?: {
      id: string;
      name: string;
      specialization: string;
      consultFee: number;
    };
    patient?: {
      id: string;
      user?: {
        name: string;
        email: string;
        phone?: string;
      };
    };
    notifications?: {
      sms?: {
        success: boolean;
        recipient: string;
        messageId: string;
        message: string;
        dispatchedAt: string;
      };
      email?: {
        success: boolean;
        recipient: string;
        messageId: string;
        subject: string;
        dispatchedAt: string;
      };
      notice?: string;
    };
  };
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

    /**
     * Book appointment slot (Patient role)
     * POST /api/v1/appointments
     */
    createAppointment: builder.mutation<CreateAppointmentResponse, CreateAppointmentRequest>({
      query: (body) => ({
        url: "/appointments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Doctor", "Reminders"],
    }),
  }),
});

export const { useGetSpecialtiesQuery, useCreateAppointmentMutation } = doctorApi;
