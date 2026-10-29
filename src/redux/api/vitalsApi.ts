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

export interface BiomarkerChartPoint {
  id: string;
  timestamp: string;
  date: string;
  value: number;
  unit: string;
  markerKey: string;
  markerName: string;
  status: string;
  referenceRange: string;
}

export interface BiomarkerAnalyticsResponse {
  patientId: string;
  markerKey: string;
  markerName: string;
  unit: string;
  referenceRange: string;
  latestStatus: string;
  totalDataPoints: number;
  chartData: BiomarkerChartPoint[];
  dataPoints?: any[];
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

    getBiomarkerAnalytics: builder.query<
      BiomarkerAnalyticsResponse,
      { patientId: string; marker?: string; testType?: string; limit?: number }
    >({
      query: ({ patientId, marker, testType, limit = 50 }) => ({
        url: `/analytics/biomarkers/${patientId}`,
        params: { marker, testType, limit },
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

    uploadReportScan: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/ocr/upload-scan",
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
  useGetBiomarkerAnalyticsQuery,
  useSyncVitalsMutation,
  useUploadReportScanMutation,
  useGetVitalAlertsQuery,
} = vitalsApi;
