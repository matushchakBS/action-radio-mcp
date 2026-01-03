import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface CreateVariantInput {
  id: number;
  language: string;
  resolution: string;
  url?: string;
  generation_status?: 'missing' | 'queued' | 'generating' | 'generated' | 'failed';
  approval_status?: 'draft' | 'approved' | 'rejected';
  meta_json?: Record<string, any>;
}

export interface CreateVariantOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'create_variant',
  description: 'Create a new variant for a specific asset template',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'number',
        description: 'Asset template ID',
        minimum: 1,
      },
      language: {
        type: 'string',
        description: 'Language code (e.g., "en")',
        minLength: 1,
      },
      resolution: {
        type: 'string',
        description: 'Resolution (e.g., "1920x1080")',
        minLength: 1,
      },
      url: {
        type: 'string',
        description: 'URL to the variant file',
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
      meta_json: {
        type: 'object',
        description: 'Additional metadata for the variant',
      },
    },
    required: ['id', 'language', 'resolution'],
    additionalProperties: false,
  },

  method: 'POST' as const,
  path: '/assets/{id}/variants',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: CreateVariantInput }): CreateVariantOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: CreateVariantInput }): CreateVariantOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: CreateVariantOutput) => !output.ok,
  
  successText: 'Variant created successfully',
  errorText: 'Failed to create variant',
};

export default createHttpTool<CreateVariantInput, CreateVariantOutput>(spec);