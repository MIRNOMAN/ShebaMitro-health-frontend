import { baseApi } from "./baseApi";

export interface SearchResultItem {
  id: string;
  title: string;
  category: "doctor" | "symptom" | "test" | "medicine";
  subtitle: string;
  badge: string;
  href: string;
}

export interface SearchResponse {
  query: string;
  total: number;
  items: SearchResultItem[];
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchHealthcare: builder.query<
      SearchResultItem[],
      { q: string; category?: string; limit?: number }
    >({
      query: ({ q, category, limit = 10 }) => ({
        url: "/search",
        method: "GET",
        params: {
          q,
          ...(category && category !== "all" ? { category } : {}),
          limit,
        },
      }),
      transformResponse: (response: any) => {
        const payload = response?.data ?? response;
        if (payload?.items && Array.isArray(payload.items)) {
          return payload.items;
        }
        if (Array.isArray(payload)) {
          return payload;
        }
        return [];
      },
    }),

    getTrendingSearches: builder.query<string[], void>({
      query: () => ({
        url: "/search/trending",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const payload = response?.data ?? response;
        if (Array.isArray(payload)) {
          return payload;
        }
        return [];
      },
    }),
  }),
});

export const { useSearchHealthcareQuery, useGetTrendingSearchesQuery } = searchApi;
