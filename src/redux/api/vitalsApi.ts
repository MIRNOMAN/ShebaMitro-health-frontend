import { baseApi } from "./baseApi";

export interface BiometricVital {
  id: string;
  patientId: string;
  type: "HEART_RATE" | "BP" | "GLUCOSE" | "SPO2";
  value: number;
  unit: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncVitalsPayload {
  vitals: {
    type: "HEART_RATE" | "BP" | "GLUCOSE" | "SPO2";
    value: number;
    unit: string;
    recordedAt?: string;
    patientId?: string;
  }[];
  idempotencyKey?: string;
}

export const vitalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientVitals: builder.query<BiometricVital[], { patientId: string; limit?: number }>({
      query: ({ patientId, limit = 50 }) => ({
        url: `/vitals/patient/${patientId}`,
        params: { limit },
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: ["Stats"],
    }),

    syncVitals: builder.mutation<any, SyncVitalsPayload>({
      query: (body) => ({
        url: "/vitals/sync",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: ["Stats"],
    }),

    getVitalAlerts: builder.query<any[], { patientId?: string; doctorId?: string } | void>({
      query: (params) => ({
        url: "/vitals/alerts",
        params: params || {},
      }),
      transformResponse: (response: any) => response?.data ?? response,
    }),
  }),
});

export const {
  useGetPatientVitalsQuery,
  useSyncVitalsMutation,
  useGetVitalAlertsQuery,
} = vitalsApi;

