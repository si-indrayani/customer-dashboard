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
  tenantId: string;
  gameId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://secure-lacewing-sweeping.ngrok-free.app/api',
    prepareHeaders: (headers) => {
      headers.set('Authorization', 'Basic YWRtaW46Z2FtaW5nMTIz');
      headers.set('Accept', 'application/json');
      headers.set('ngrok-skip-browser-warning', 'true');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    fetchFn: async (input, init) => {
      console.log('Making API request:', input, init);
      try {
        const response = await fetch(input, init);
        console.log('API response:', response);
        return response;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
  }),
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    // Daily Active Users
    getDailyActiveUsers: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics',
        params: {
          type: 'daily-active-users',
          tenantId: params.tenantId,
          gameId: params.gameId,
          // dateFrom: params.dateFrom,
          // dateTo: params.dateTo,
        },
      }),
      providesTags: ['Analytics'],
    }),

    // Game Plays
    getGamePlays: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics',
        params: {
          type: 'game-plays',
          tenantId: params.tenantId,
          gameId: params.gameId,
          // dateFrom: params.dateFrom,
          // dateTo: params.dateTo,
        },
      }),
      providesTags: ['Analytics'],
    }),

    // Game Completions
    getGameCompletions: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics',
        params: {
          type: 'game-completions',
          tenantId: params.tenantId,
          gameId: params.gameId,
          // dateFrom: params.dateFrom,
          // dateTo: params.dateTo,
        },
      }),
      providesTags: ['Analytics'],
    }),

    // Average Session Time
    getAverageSessionTime: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics',
        params: {
          type: 'average-session-time',
          tenantId: params.tenantId,
          gameId: params.gameId,
          // dateFrom: params.dateFrom,
          // dateTo: params.dateTo,
        },
      }),
      providesTags: ['Analytics'],
    }),

    // Answer Accuracy
    getAnswerAccuracy: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics',
        params: {
          type: 'answer-accuracy',
          tenantId: params.tenantId,
          gameId: params.gameId,
          // dateFrom: params.dateFrom,
          // dateTo: params.dateTo,
        },
      }),
      providesTags: ['Analytics'],
    }),

    // Events By Type
    getEventsByType: builder.query<MetricsResponse, AnalyticsQueryParams>({
      query: (params) => ({
        url: '/metrics',
        params: {
          type: 'events-by-type',
          tenantId: params.tenantId,
          gameId: params.gameId,
          // dateFrom: params.dateFrom,
          // dateTo: params.dateTo,
        },
      }),
      providesTags: ['Analytics'],
    }),

    // Traffic Analytics
    getTrafficAnalytics: builder.query<any, { tenantId: string; dateFrom: string; dateTo: string }>({
      query: ({ tenantId }) => ({
        url: '/metrics',
        params: {
          type: 'traffic',
          tenantId,
          granularity: 'day',
          // dateFrom,
          // dateTo,
          includeTimeseries: true,
        },
      }),
      providesTags: ['Analytics'],
    }),

    // Game-Specific Engagement
    getGameEngagement: builder.query<any, { tenantId: string; gameId: string; dateFrom?: string; dateTo?: string }>({
      query: ({ tenantId, gameId }) => ({
        url: '/metrics',
        params: {
          type: 'engagement',
          tenantId,
          gameId,
          granularity: 'day',
          // dateFrom,
          // dateTo,
          includeTimeseries: true,
        },
      }),
      providesTags: ['Analytics'],
    }),

    // Performance Analysis
    getPerformanceAnalytics: builder.query<any, { tenantId: string; dateFrom?: string; dateTo?: string }>({
      query: ({ tenantId }) => ({
        url: '/metrics',
        params: {
          type: 'performance',
          tenantId,
          granularity: 'day',
          // dateFrom,
          // dateTo,
          includeTimeseries: true,
        },
      }),
      providesTags: ['Analytics'],
    }),

    // Popular Games Ranking
    getPopularGamesRanking: builder.query<any, { tenantId: string; limit?: number; dateFrom?: string; dateTo?: string }>({
      query: ({ tenantId, limit = 10 }) => ({
        url: '/metrics',
        params: {
          type: 'popularity',
          tenantId,
          limit,
          // dateFrom,
          // dateTo,
        },
      }),
      providesTags: ['Analytics'],
    }),

    // Conversion Funnel Analysis
    getConversionFunnel: builder.query<any, { tenantId: string; dateFrom?: string; dateTo?: string }>({
      query: ({ tenantId }) => ({
        url: '/metrics',
        params: {
          type: 'conversion',
          tenantId,
          granularity: 'day',
          // dateFrom,
          // dateTo,
          includeTimeseries: true,
        },
      }),
      providesTags: ['Analytics'],
    }),

    // Reliability Metrics
    getReliabilityMetrics: builder.query<any, { tenantId: string; dateFrom?: string; dateTo?: string }>({
      query: ({ tenantId }) => ({
        url: '/metrics',
        params: {
          type: 'reliability',
          tenantId,
          granularity: 'day',
          // dateFrom,
          // dateTo,
          includeTimeseries: true,
        },
      }),
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
  useGetReliabilityMetricsQuery,
  useGetHealthCheckQuery,
} = analyticsApi;
