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

    /**
     * Get top featured doctors for homepage
     * GET /api/v1/doctors?limit=3
     */
    getFeaturedDoctors: builder.query<{ success: boolean; data: { items: any[] } }, { limit?: number } | void>({
      query: (params) => ({
        url: `/doctors?limit=${params?.limit || 3}`,
        method: "GET",
      }),
      providesTags: ["Doctor"],
    }),

    /**
     * Get doctor OPD live queue appointments
     * GET /api/v1/appointments/doctor
     */
    getDoctorAppointments: builder.query<{ success: boolean; data: any[] }, { doctorId?: string } | void>({
      query: (params) => ({
        url: params?.doctorId ? `/appointments/doctor?doctorId=${params.doctorId}` : "/appointments/doctor",
        method: "GET",
      }),
      providesTags: ["Doctor"],
    }),

    /**
     * Get doctor OPD queue statistics
     * GET /api/v1/appointments/doctor/stats
     */
    getDoctorStats: builder.query<{ success: boolean; data: any }, { doctorId?: string } | void>({
      query: (params) => ({
        url: params?.doctorId ? `/appointments/doctor/stats?doctorId=${params.doctorId}` : "/appointments/doctor/stats",
        method: "GET",
      }),
      providesTags: ["Doctor"],
    }),

    /**
     * Update appointment status (Doctor/Admin: e.g. IN_PROGRESS, COMPLETED)
     * PATCH /api/v1/appointments/:id/status
     */
    updateAppointmentStatus: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: string; status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "CONFIRMED" }
    >({
      query: ({ id, status }) => ({
        url: `/appointments/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Doctor"],
    }),

    /**
     * Get patient's booked appointments
     * GET /api/v1/appointments
     */
    getPatientAppointments: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => ({
        url: "/appointments",
        method: "GET",
      }),
      providesTags: ["Doctor"],
    }),

    /**
     * Get single appointment details by ID
     * GET /api/v1/appointments/:id
     */
    getAppointmentById: builder.query<{ success: boolean; data: any }, string>({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "GET",
      }),
      providesTags: ["Doctor"],
    }),

    /**
     * Get teleconsultation RTC token
     * GET /api/v1/teleconsult/:appointmentId/token
     */
    getTeleconsultToken: builder.query<{ success: boolean; data: any }, string>({
      query: (appointmentId) => ({
        url: `/teleconsult/${appointmentId}/token`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetSpecialtiesQuery,
  useCreateAppointmentMutation,
  useGetFeaturedDoctorsQuery,
  useGetDoctorAppointmentsQuery,
  useGetDoctorStatsQuery,
  useUpdateAppointmentStatusMutation,
  useGetPatientAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useGetTeleconsultTokenQuery,
} = doctorApi;
