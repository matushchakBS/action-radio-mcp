import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface UpdateVariantInput {
  id: number;
  url?: string;
  duration_seconds?: number;
  meta_json?: Record<string, any>;
  generation_status?: 'missing' | 'queued' | 'generating' | 'generated' | 'failed';
  approval_status?: 'draft' | 'approved' | 'rejected';
}

export interface UpdateVariantOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'update_variant',
  description: 'Update variant URL, status, and metadata',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'number',
        description: 'The ID of the variant to update',
        minimum: 1,
      },
      url: {
        type: 'string',
        description: 'URL to the variant file',
      },
      duration_seconds: {
        type: 'number',
        description: 'Duration in seconds',
        minimum: 0,
      },
      meta_json: {
        type: 'object',
        description: 'Additional metadata for the variant',
      },
      generation_status: {
        type: 'string',
        description: 'Generation status of the variant',
        enum: ['missing', 'queued', 'generating', 'generated', 'failed'],
      },
      approval_status: {
        type: 'string',
        description: 'Approval status of the variant',
        enum: ['draft', 'approved', 'rejected'],
      },
    },
    required: ['id'],
    additionalProperties: false,
  },

  method: 'PUT' as const,
  path: '/variants/{id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: UpdateVariantInput }): UpdateVariantOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: UpdateVariantInput }): UpdateVariantOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: UpdateVariantOutput) => !output.ok,
  
  successText: 'Variant updated successfully',
  errorText: 'Failed to update variant',
};

export default createHttpTool<UpdateVariantInput, UpdateVariantOutput>(spec);