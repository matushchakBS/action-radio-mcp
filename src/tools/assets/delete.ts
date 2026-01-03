import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface DeleteAssetInput {
  id: number;
}

export interface DeleteAssetOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'delete_asset',
  description: 'Delete asset template',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'number',
        description: 'The ID of the asset to delete',
        minimum: 1,
      },
    },
    required: ['id'],
    additionalProperties: false,
  },

  method: 'DELETE' as const,
  path: '/assets/{id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: DeleteAssetInput }): DeleteAssetOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: DeleteAssetInput }): DeleteAssetOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: DeleteAssetOutput) => !output.ok,
  
  successText: 'Asset deleted successfully',
  errorText: 'Failed to delete asset',
};

export default createHttpTool<DeleteAssetInput, DeleteAssetOutput>(spec);