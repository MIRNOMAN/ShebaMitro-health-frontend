import { baseApi } from "./baseApi";

export interface StatCounterItem {
  id: string;
  labelKey: string;
  subtextKey: string;
  label: string;
  labelBn: string;
  subtext: string;
  subtextBn: string;
  value: number;
  suffix: string;
  decimals?: number;
  icon: string;
  gradient: string;
}

export interface LiveActivityItem {
  id: string;
  message: string;
  messageBn: string;
  doctorName?: string;
  action?: string;
  location?: string;
  timeAgo: string;
  timeAgoBn: string;
  timestamp: string;
}

export interface HomeStatsData {
  counters: StatCounterItem[];
  liveActivity: LiveActivityItem;
  liveActivities: LiveActivityItem[];
}

export interface HomeStatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: HomeStatsData;
}

export interface LiveActivityResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    current: LiveActivityItem;
    feed: LiveActivityItem[];
  };
}

export interface BentoEcosystemData {
  header: {
    badge: string;
    badgeBn: string;
    title: string;
    titleBn: string;
    titleHighlight: string;
    titleHighlightBn: string;
    subtitle: string;
    subtitleBn: string;
  };
  alarm: {
    badge: string;
    badgeBn: string;
    title: string;
    titleBn: string;
    description: string;
    descriptionBn: string;
    medicineName: string;
    medicineNameBn: string;
    instruction: string;
    instructionBn: string;
    scheduledTime: string;
    scheduledTimeBn: string;
    upcomingStatus: string;
    upcomingStatusBn: string;
    status: 'ACTIVE' | 'PAUSED';
    statusText: string;
    statusTextBn: string;
    audioAlertText: string;
    audioAlertTextBn: string;
    btnTakeDoseText: string;
    btnTakeDoseTextBn: string;
    actionBtnText: string;
    actionBtnTextBn: string;
    actionUrl: string;
  };
  telemed: {
    badge: string;
    badgeBn: string;
    title: string;
    titleBn: string;
    description: string;
    descriptionBn: string;
    doctorName: string;
    doctorNameBn: string;
    bmdcRegNo: string;
    specialization: string;
    specializationBn: string;
    statusBadge: string;
    statusBadgeBn: string;
    callBadge: string;
    callBadgeBn: string;
    imageUrl: string;
    actionUrl: string;
    actionBtnText: string;
    actionBtnTextBn: string;
  };
  pharmacy: {
    badge: string;
    badgeBn: string;
    title: string;
    titleBn: string;
    description: string;
    descriptionBn: string;
    pharmacyName: string;
    pharmacyNameBn: string;
    storageCondition: string;
    storageConditionBn: string;
    eta: string;
    etaBn: string;
    tagBadge: string;
    tagBadgeBn: string;
    imageUrl: string;
    actionUrl: string;
    actionBtnText: string;
    actionBtnTextBn: string;
  };
  lab: {
    badge: string;
    badgeBn: string;
    title: string;
    titleBn: string;
    description: string;
    descriptionBn: string;
    labName: string;
    labNameBn: string;
    serviceText: string;
    serviceTextBn: string;
    offerText: string;
    offerTextBn: string;
    tagBadge: string;
    tagBadgeBn: string;
    imageUrl: string;
    actionUrl: string;
    actionBtnText: string;
    actionBtnTextBn: string;
  };
}

export interface BentoResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BentoEcosystemData;
}

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get home platform counters and live activities
     * GET /api/v1/stats
     */
    getHomeStats: builder.query<HomeStatsResponse, void>({
      query: () => "/stats",
      providesTags: ["Stats"],
    }),

    /**
     * Get real-time live activity feed
     * GET /api/v1/stats/live-activity
     */
    getLiveActivities: builder.query<LiveActivityResponse, void>({
      query: () => "/stats/live-activity",
      providesTags: ["Stats"],
    }),

    /**
     * Get dynamic Bento Grid ecosystem features data
     * GET /api/v1/stats/bento
     */
    getBentoData: builder.query<BentoResponse, void>({
      query: () => "/stats/bento",
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetHomeStatsQuery,
  useGetLiveActivitiesQuery,
  useGetBentoDataQuery,
} = statsApi;
