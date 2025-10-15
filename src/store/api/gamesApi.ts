import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the Game interface based on your API response
export interface Game {
  gameId: string;
  title?: string | null;
  description: string | null;
  gameType: 'HOSTED_LINK' | 'UPLOADED_BUILD';
  url: string;
  status: 'ACTIVE' | 'DEPRECATED' | 'INACTIVE';
  createdAt: string;
}

// Define the Tenant interface for dropdown
export interface Tenant {
  tenantId: string;
  name: string;
  createdAt: string;
}

// Define the ClientGame interface for client-specific game configurations
export interface ClientGame {
  id: number;
  gameId: string;
  tenantId: string;
  title: string | null;
  description: string | null;
  isActive: boolean;
  game?: Game;
  tenant?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
}

// Define API endpoints and queries
export const gamesApi = createApi({
  reducerPath: 'gamesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://secure-lacewing-sweeping.ngrok-free.app/api',
    prepareHeaders: (headers) => {
      headers.set('Authorization', 'Basic YWRtaW46Z2FtaW5nMTIz');
      headers.set('Accept', 'application/json');
      headers.set('ngrok-skip-browser-warning', 'true');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    responseHandler: async (response) => {
      const text = await response.text();
      console.log('Games API Response:', text);
      try {
        return JSON.parse(text);
      } catch (error) {
        console.error('Failed to parse response:', error);
        return text;
      }
    },
  }),
  tagTypes: ['Game', 'Tenant'],
  endpoints: (builder) => ({
    // Get all tenants for dropdown
    getTenants: builder.query<Tenant[], void>({
      query: () => '/tenants',
      providesTags: [{ type: 'Tenant', id: 'LIST' }],
    }),

    // Get all games with caching
    getGames: builder.query<Game[], void>({
      query: () => '/client-games',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ gameId }) => ({ type: 'Game' as const, id: gameId })),
              { type: 'Game', id: 'LIST' },
            ]
          : [{ type: 'Game', id: 'LIST' }],
      keepUnusedDataFor: 0, // Disable caching temporarily for debugging
      forceRefetch() {
        return true; // Always refetch for debugging
      },
    }),

    // Get single game by ID
    getGame: builder.query<Game, number>({
      query: (id) => `/client-games/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Game', id }],
    }),

    // Create new game
    createGame: builder.mutation<Game, Partial<Game>>({
      query: (newGame) => ({
        url: '/client-games',
        method: 'POST',
        body: newGame,
      }),
      invalidatesTags: [{ type: 'Game', id: 'LIST' }],
    }),

    // Update game
    updateGame: builder.mutation<Game, { id: number; updates: Partial<Game> }>({
      query: ({ id, updates }) => {
        // Convert status to isActive boolean format
        if (updates.status) {
          const isActive = updates.status === 'ACTIVE';
          return {
            url: `/client-games/${id}`,
            method: 'PUT',
            body: { isActive },
          };
        }
        // For other updates, use original format
        return {
          url: `/client-games/${id}`,
          method: 'PUT',
          body: updates,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Game', id },
        { type: 'Game', id: 'LIST' },
      ],
    }),

    // Delete game
    deleteGame: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/client-games/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Game', id },
        { type: 'Game', id: 'LIST' },
      ],
    }),

    // Get games by status
    getGamesByStatus: builder.query<Game[], string>({
      query: (status) => `/client-games?status=${status}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ gameId }) => ({ type: 'Game' as const, id: gameId })),
              { type: 'Game', id: 'LIST' },
            ]
          : [{ type: 'Game', id: 'LIST' }],
    }),

    // Get client games (games configured for a specific tenant)
    getClientGames: builder.query<ClientGame[], string>({
      query: (tenantId) => `/client-games?tenantId=${tenantId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Game' as const, id: `client-${id}` })),
              { type: 'Game', id: 'CLIENT_LIST' },
            ]
          : [{ type: 'Game', id: 'CLIENT_LIST' }],
    }),

    // Update client game active status (Show/Hide game for tenant)
    updateClientGameStatus: builder.mutation<ClientGame, { tenantId: string; gameId: string; isActive: boolean }>({
      query: ({ tenantId, gameId, isActive }) => ({
        url: `/client-games/${tenantId}/${gameId}`,
        method: 'PUT',
        body: { tenantId,  isActive },
      }),
      invalidatesTags: (_result, _error, { tenantId, gameId }) => [
        { type: 'Game', id: `client-${tenantId}-${gameId}` },
        { type: 'Game', id: 'CLIENT_LIST' },
        { type: 'Game', id: 'LIST' },
      ],
    }),

    // Update client game title and description
    updateClientGameInfo: builder.mutation<ClientGame, { tenantId: string; gameId: string; title: string; description: string }>({
      query: ({ tenantId, gameId, title, description }) => ({
        url: `/client-games/${tenantId}/${gameId}`,
        method: 'PUT',
        body: { title, description },
      }),
      invalidatesTags: (_result, _error, { tenantId, gameId }) => [
        { type: 'Game', id: `client-${tenantId}-${gameId}` },
        { type: 'Game', id: 'CLIENT_LIST' },
        { type: 'Game', id: 'LIST' },
      ],
    }),

    // Publish client game configuration for a tenant
    publishClientGames: builder.mutation<{ success: boolean; message: string }, string>({
      query: (tenantId) => ({
        url: `/client-games/${tenantId}/publish`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: [{ type: 'Game', id: 'CLIENT_LIST' }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetTenantsQuery,
  useGetGamesQuery,
  useGetGameQuery,
  useCreateGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
  useGetGamesByStatusQuery,
  useLazyGetGamesQuery,
  useLazyGetGameQuery,
  useGetClientGamesQuery,
  useUpdateClientGameStatusMutation,
  useUpdateClientGameInfoMutation,
  usePublishClientGamesMutation,
  useLazyGetClientGamesQuery,
} = gamesApi;
