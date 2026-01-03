import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface GetAssetInput {
  id: number;
}

export interface GetAssetOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'get_asset',
  description: 'Get asset template details',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'number',
        description: 'The ID of the asset',
        minimum: 1,
      },
    },
    required: ['id'],
    additionalProperties: false,
  },

  method: 'GET' as const,
  path: '/assets/{id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: GetAssetInput }): GetAssetOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: GetAssetInput }): GetAssetOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: GetAssetOutput) => !output.ok,
  
  successText: 'Asset retrieved successfully',
  errorText: 'Failed to retrieve asset',
};

export default createHttpTool<GetAssetInput, GetAssetOutput>(spec);