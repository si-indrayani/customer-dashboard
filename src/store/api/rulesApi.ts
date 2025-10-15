import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the GameRule interface
export interface GameRule {
  id: string;
  gameId: string;
  tenantId: string;
  name: string;
  description: string | null;
  ruleType: 'SCORING' | 'PROGRESSION' | 'REWARD' | 'VALIDATION' | 'CUSTOM';
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  game?: {
    id: string;
    title: string;
  };
  tenant?: {
    id: string;
    name: string;
  };
}

// Define rule condition interface
export interface RuleCondition {
  id?: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

// Define rule action interface
export interface RuleAction {
  id?: string;
  type: 'ADD_POINTS' | 'SUBTRACT_POINTS' | 'SET_LEVEL' | 'ADD_BADGE' | 'SEND_NOTIFICATION' | 'CUSTOM';
  parameters: Record<string, any>;
}

// Define rule creation payload
export interface CreateRulePayload {
  gameId: string;
  tenantId: string;
  name: string;
  description?: string;
  ruleType: GameRule['ruleType'];
  conditions: Omit<RuleCondition, 'id'>[];
  actions: Omit<RuleAction, 'id'>[];
  priority?: number;
  metadata?: Record<string, any>;
  questionCount?: number;
}

// Define rule field configuration (for dynamic form generation)
export interface RuleField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
  datatype?: 'string' | 'integer' | 'float' | 'boolean' | 'date';
  required?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Define the rules API
export const rulesApi = createApi({
  reducerPath: 'rulesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${ import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api`,
    prepareHeaders: (headers) => {
      headers.set('accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      // Add ngrok bypass header to avoid browser warning
      headers.set('ngrok-skip-browser-warning', 'true');
      return headers;
    },
    responseHandler: async (response) => {
      const text = await response.text();
      console.log('Rules API Response:', text);
      try {
        return JSON.parse(text);
      } catch (error) {
        console.error('Failed to parse rules response:', error);
        return text;
      }
    },
  }),
  tagTypes: ['Rule', 'RuleField'],
  endpoints: (builder) => ({
    // Get all rules for a specific game and tenant
    getGameRules: builder.query<GameRule[], { gameId: string; tenantId: string }>({
      query: ({ gameId, tenantId }) => `api/client-games/${tenantId}/${gameId}`,
      transformResponse: (response: any) => {
        // Extract rules from the tenantGameConfig
        return response.tenantGameConfig?.rules || [];
      },
      providesTags: (result, _error, { gameId, tenantId }) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Rule' as const, id })),
              { type: 'Rule', id: `GAME-${gameId}-TENANT-${tenantId}` },
            ]
          : [{ type: 'Rule', id: `GAME-${gameId}-TENANT-${tenantId}` }],
    }),

    // Get all rules for a tenant (across all games)
    getTenantRules: builder.query<GameRule[], string>({
      query: (tenantId) => `/client-games?tenantId=${tenantId}`,
      transformResponse: (response: any[]) => {
        // Extract all rules from all client games for this tenant
        const allRules: GameRule[] = [];
        response.forEach(clientGame => {
          if (clientGame.tenantGameConfig?.rules) {
            allRules.push(...clientGame.tenantGameConfig.rules);
          }
        });
        return allRules;
      },
      providesTags: (result, _error, tenantId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Rule' as const, id })),
              { type: 'Rule', id: `TENANT-${tenantId}` },
            ]
          : [{ type: 'Rule', id: `TENANT-${tenantId}` }],
    }),

    // Get single rule by ID
    getRule: builder.query<GameRule, string>({
      query: (id) => `/rules/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Rule', id }],
    }),

    // Create new rule (updates client game configuration)
    createRule: builder.mutation<GameRule, CreateRulePayload>({
      query: ({ gameId, tenantId, ...ruleData }) => ({
        url: `client-games/${tenantId}/${gameId}`,
        method: 'PUT',
        body: {
          tenantGameConfig: {
            rules: {
              questionCount: ruleData.questionCount || 10
            }
          }
        },
      }),
      invalidatesTags: (_result, _error, { gameId, tenantId }) => [
        { type: 'Rule', id: `GAME-${gameId}-TENANT-${tenantId}` },
        { type: 'Rule', id: `TENANT-${tenantId}` },
      ],
    }),

    // Update rule
    updateRule: builder.mutation<GameRule, { id: string; updates: Partial<CreateRulePayload> }>({
      query: ({ id, updates }) => ({
        url: `/rules/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Rule', id },
        // We need to invalidate the game-tenant cache but we don't have that info
        // This could be improved by including gameId/tenantId in the update payload
      ],
    }),

    // Delete rule
    deleteRule: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/rules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Rule', id },
      ],
    }),

    // Update rule status
    updateRuleStatus: builder.mutation<GameRule, { id: string; status: GameRule['status'] }>({
      query: ({ id, status }) => ({
        url: `/rules/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Rule', id },
      ],
    }),

    // Get rule field configuration for a specific game type
    getRuleFields: builder.query<RuleField[], string>({
      query: (gameType) => `/rule-fields/${gameType}`,
      providesTags: (_result, _error, gameType) => [
        { type: 'RuleField', id: gameType },
      ],
    }),

    // Test rule execution
    testRule: builder.mutation<any, { ruleId: string; testData: Record<string, any> }>({
      query: ({ ruleId, testData }) => ({
        url: `/rules/${ruleId}/test`,
        method: 'POST',
        body: testData,
      }),
    }),

    // Validate rule syntax
    validateRule: builder.mutation<{ valid: boolean; errors?: string[] }, CreateRulePayload>({
      query: (ruleData) => ({
        url: '/rules/validate',
        method: 'POST',
        body: ruleData,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetGameRulesQuery,
  useGetTenantRulesQuery,
  useGetRuleQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
  useUpdateRuleStatusMutation,
  useGetRuleFieldsQuery,
  useTestRuleMutation,
  useValidateRuleMutation,
  useLazyGetGameRulesQuery,
  useLazyGetTenantRulesQuery,
  useLazyGetRuleQuery,
  useLazyGetRuleFieldsQuery,
} = rulesApi;
