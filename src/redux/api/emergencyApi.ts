import { baseApi } from "./baseApi";

export interface EmergencyEstimateResponse {
  success: boolean;
  latitude: number;
  longitude: number;
  nearbyAmbulanceCount: number;
  nearestAmbulanceDistanceKm: number;
  estimatedMinutesMin: number;
  estimatedMinutesMax: number;
  estimatedArrivalText: string;
  nearestHospitalName: string;
}

export interface DispatchedAmbulanceInfo {
  id: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  distanceKm: number;
}

export interface NearestHospitalInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  distanceKm?: number;
}

export interface TriggerSosRequest {
  latitude: number;
  longitude: number;
  notes?: string;
  emergencyContact?: string;
}

export interface TriggerSosResponse {
  success: boolean;
  message: string;
  sosId: string;
  trackingToken: string;
  trackingUrl: string;
  trackingExpiresAt: string;
  smsSent: boolean;
  dispatchedAmbulance: DispatchedAmbulanceInfo | null;
  nearestHospital: NearestHospitalInfo | null;
  nearbyAmbulancesCount: number;
  nearbyHospitalsCount?: number;
}

export interface TrackingStatusResponse {
  success: boolean;
  sosId: string;
  status: string;
  trackingToken: string;
  patientLatitude: number;
  patientLongitude: number;
  dispatchedAmbulance?: DispatchedAmbulanceInfo | null;
  nearestHospital?: NearestHospitalInfo | null;
}

export const emergencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmergencyEstimate: builder.query<
      EmergencyEstimateResponse,
      { latitude: number; longitude: number }
    >({
      query: ({ latitude, longitude }) => ({
        url: "/emergency/estimate",
        method: "GET",
        params: { latitude, longitude },
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: ["Emergency"],
    }),

    triggerSos: builder.mutation<TriggerSosResponse, TriggerSosRequest>({
      query: (body) => ({
        url: "/emergency/sos",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: ["Emergency"],
    }),

    getTrackingStatus: builder.query<TrackingStatusResponse, string>({
      query: (token) => `/emergency/track/${token}`,
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: ["Emergency"],
    }),
  }),
});

export const {
  useGetEmergencyEstimateQuery,
  useLazyGetEmergencyEstimateQuery,
  useTriggerSosMutation,
  useGetTrackingStatusQuery,
} = emergencyApi;
