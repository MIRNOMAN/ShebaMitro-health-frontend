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
  }),
});

export const {
  useGetHomeStatsQuery,
  useGetLiveActivitiesQuery,
} = statsApi;
