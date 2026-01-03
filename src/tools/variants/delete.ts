import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface DeleteVariantInput {
  id: number;
}

export interface DeleteVariantOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'delete_variant',
  description: 'Delete a specific variant',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'number',
        description: 'The ID of the variant to delete',
        minimum: 1,
      },
    },
    required: ['id'],
    additionalProperties: false,
  },

  method: 'DELETE' as const,
  path: '/variants/{id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: DeleteVariantInput }): DeleteVariantOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: DeleteVariantInput }): DeleteVariantOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: DeleteVariantOutput) => !output.ok,
  
  successText: 'Variant deleted successfully',
  errorText: 'Failed to delete variant',
};

export default createHttpTool<DeleteVariantInput, DeleteVariantOutput>(spec);