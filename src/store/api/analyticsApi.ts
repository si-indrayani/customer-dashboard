import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types for analytics data
interface MetricSeries {
  date: string;
  count: number;
}

interface MetricsResponse {
  series: MetricSeries[];
  total: number;
}

interface AnalyticsQueryParams {
  tenant_id: string;
  game_id?: string;
  from?: string;
  to?: string;
}

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_EVENTS_API_BASE_URL || 'http://localhost:8080',
    prepareHeaders: (headers) => {
      headers.set('Authorization', 'Basic YWRtaW46Z2FtaW5nMTIz');
      headers.set('Accept', 'application/json');
      headers.set('ngrok-skip-browser-warning', 'true');
      return headers;
    },
  }),
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    // Daily Active Users
    getDailyActiveUsers: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics/daily-active-users',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    // Game Plays
    getGamePlays: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics/game-plays',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    // Game Completions
    getGameCompletions: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics/game-completions',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    // Average Session Time
    getAverageSessionTime: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics/average-session-time',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    // Answer Accuracy
    getAnswerAccuracy: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics/answer-accuracy',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    // Events By Type
    getEventsByType: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics/events-by-type',
        params,
      }),
      providesTags: ['Analytics'],
    }),

    // Traffic Analytics
    getTrafficAnalytics: builder.query<any, { tenantId: string; dateFrom: string; dateTo: string }>({
      query: ({ tenantId, dateFrom, dateTo }) => ({
        url: `/metrics?type=traffic&tenant_id=${tenantId}&granularity=day&include_timeseries=true&date_from=${dateFrom}&date_to=${dateTo}`,
        headers: {
          'Authorization': 'Basic YWRtaW46Z2FtaW5nMTIz',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        }
      }),
      providesTags: ['Analytics'],
    }),

    // Game-Specific Engagement
    getGameEngagement: builder.query<any, { tenantId: string; gameId: string; dateFrom?: string; dateTo?: string }>({
      query: ({ tenantId, gameId, dateFrom, dateTo }) => {
        let url = `/metrics?type=engagement&tenant_id=${tenantId}&game_id=${gameId}&granularity=day&include_timeseries=true`;
        if (dateFrom) url += `&date_from=${dateFrom}`;
        if (dateTo) url += `&date_to=${dateTo}`;
        return {
          url,
          headers: {
            'Authorization': 'Basic YWRtaW46Z2FtaW5nMTIz',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          }
        };
      },
      providesTags: ['Analytics'],
    }),

    // Performance Analysis
    getPerformanceAnalytics: builder.query<any, { tenantId: string; dateFrom?: string; dateTo?: string }>({
      query: ({ tenantId, dateFrom, dateTo }) => {
        let url = `/metrics?type=performance&tenant_id=${tenantId}&granularity=day&include_timeseries=true`;
        if (dateFrom) url += `&date_from=${dateFrom}`;
        if (dateTo) url += `&date_to=${dateTo}`;
        return {
          url,
          headers: {
            'Authorization': 'Basic YWRtaW46Z2FtaW5nMTIz',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          }
        };
      },
      providesTags: ['Analytics'],
    }),

    // Popular Games Ranking
    getPopularGamesRanking: builder.query<any, { tenantId: string; limit?: number }>({
      query: ({ tenantId, limit = 10 }) => ({
        url: `/metrics?type=popularity&tenant_id=${tenantId}&limit=${limit}`,
        headers: {
          'Authorization': 'Basic YWRtaW46Z2FtaW5nMTIz',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        }
      }),
      providesTags: ['Analytics'],
    }),

    // Conversion Funnel Analysis
    getConversionFunnel: builder.query<any, { tenantId: string; dateFrom?: string; dateTo?: string }>({
      query: ({ tenantId, dateFrom, dateTo }) => {
        let url = `/metrics?type=conversion&tenant_id=${tenantId}&granularity=day&include_timeseries=true`;
        if (dateFrom) url += `&date_from=${dateFrom}`;
        if (dateTo) url += `&date_to=${dateTo}`;
        return {
          url,
          headers: {
            'Authorization': 'Basic YWRtaW46Z2FtaW5nMTIz',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          }
        };
      },
      providesTags: ['Analytics'],
    }),

    // Health Check
    getHealthCheck: builder.query<{ status: string }, void>({
      query: () => '/health',
    }),
  }),
});

export const {
  useGetDailyActiveUsersQuery,
  useGetGamePlaysQuery,
  useGetGameCompletionsQuery,
  useGetAverageSessionTimeQuery,
  useGetAnswerAccuracyQuery,
  useGetEventsByTypeQuery,
  useGetTrafficAnalyticsQuery,
  useGetGameEngagementQuery,
  useGetPerformanceAnalyticsQuery,
  useGetPopularGamesRankingQuery,
  useGetConversionFunnelQuery,
  useGetHealthCheckQuery,
} = analyticsApi;
