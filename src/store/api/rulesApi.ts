import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the GameRule interface
export interface GameRule {
  id: number;
  gameId: number;
  tenantId: number;
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
    id: number;
    title: string;
  };
  tenant?: {
    id: number;
    name: string;
  };
}

// Define rule condition interface
export interface RuleCondition {
  id?: number;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

// Define rule action interface
export interface RuleAction {
  id?: number;
  type: 'ADD_POINTS' | 'SUBTRACT_POINTS' | 'SET_LEVEL' | 'ADD_BADGE' | 'SEND_NOTIFICATION' | 'CUSTOM';
  parameters: Record<string, any>;
}

// Define rule creation payload
export interface CreateRulePayload {
  gameId: number;
  tenantId: number;
  name: string;
  description?: string;
  ruleType: GameRule['ruleType'];
  conditions: Omit<RuleCondition, 'id'>[];
  actions: Omit<RuleAction, 'id'>[];
  priority?: number;
  metadata?: Record<string, any>;
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
    baseUrl: `${import.meta.env.VITE_GAMES_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api`,
    prepareHeaders: (headers) => {
      const apiUrl = import.meta.env.VITE_GAMES_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      console.log('Rules API Base URL:', `${apiUrl}/api`);
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
    getGameRules: builder.query<GameRule[], { gameId: number; tenantId: number }>({
      query: ({ gameId, tenantId }) => `/games/${gameId}/tenants/${tenantId}/rules`,
      providesTags: (result, _error, { gameId, tenantId }) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Rule' as const, id })),
              { type: 'Rule', id: `GAME-${gameId}-TENANT-${tenantId}` },
            ]
          : [{ type: 'Rule', id: `GAME-${gameId}-TENANT-${tenantId}` }],
    }),

    // Get all rules for a tenant (across all games)
    getTenantRules: builder.query<GameRule[], number>({
      query: (tenantId) => `/tenants/${tenantId}/rules`,
      providesTags: (result, _error, tenantId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Rule' as const, id })),
              { type: 'Rule', id: `TENANT-${tenantId}` },
            ]
          : [{ type: 'Rule', id: `TENANT-${tenantId}` }],
    }),

    // Get single rule by ID
    getRule: builder.query<GameRule, number>({
      query: (id) => `/rules/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Rule', id }],
    }),

    // Create new rule
    createRule: builder.mutation<GameRule, CreateRulePayload>({
      query: (newRule) => ({
        url: '/rules',
        method: 'POST',
        body: newRule,
      }),
      invalidatesTags: (_result, _error, { gameId, tenantId }) => [
        { type: 'Rule', id: `GAME-${gameId}-TENANT-${tenantId}` },
        { type: 'Rule', id: `TENANT-${tenantId}` },
      ],
    }),

    // Update rule
    updateRule: builder.mutation<GameRule, { id: number; updates: Partial<CreateRulePayload> }>({
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
    deleteRule: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/rules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Rule', id },
      ],
    }),

    // Update rule status
    updateRuleStatus: builder.mutation<GameRule, { id: number; status: GameRule['status'] }>({
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
    testRule: builder.mutation<any, { ruleId: number; testData: Record<string, any> }>({
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
