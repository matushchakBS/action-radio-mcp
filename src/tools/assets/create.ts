import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface CreateAssetInput {
  format: 'audio' | 'video' | 'image' | 'text';
  kind: 'music' | 'voice' | 'video' | 'thumbnail' | 'subtitle';
  spec_text: string;
  meta_json?: Record<string, any>;
  first_variant?: {
    language?: string;
    resolution?: string;
    url?: string | null;
    generation_status?: 'missing' | 'queued' | 'generated' | 'failed';
    approval_status?: 'draft' | 'approved' | 'rejected';
    duration_seconds?: number;
    meta_json?: Record<string, any>;
  };
}

export interface CreateAssetOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'create_asset',
  description: 'Create asset template (optionally with first variant)',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      format: {
        type: 'string',
        description: 'Asset format type',
        enum: ['audio', 'video', 'image', 'text'],
      },
      kind: {
        type: 'string',
        description: 'Asset kind/category',
        enum: ['music', 'voice', 'video', 'thumbnail', 'subtitle'],
      },
      spec_text: {
        type: 'string',
        description: 'Specification text for the asset',
        minLength: 1,
      },
      meta_json: {
        type: 'object',
        description: 'Additional metadata for the asset',
      },
      first_variant: {
        type: 'object',
        description: 'Optional first variant to create with the asset',
        properties: {
          language: {
            type: 'string',
            description: 'Language code (e.g., "en")',
          },
          resolution: {
            type: 'string',
            description: 'Resolution (e.g., "1920x1080")',
          },
          url: {
            type: ['string', 'null'],
            description: 'URL to the variant file',
          },
          generation_status: {
            type: 'string',
            description: 'Generation status of the variant',
            enum: ['missing', 'queued', 'generated', 'failed'],
          },
          approval_status: {
            type: 'string',
            description: 'Approval status of the variant',
            enum: ['draft', 'approved', 'rejected'],
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
        },
        additionalProperties: false,
      },
    },
    required: ['format', 'kind', 'spec_text'],
    additionalProperties: false,
  },

  method: 'POST' as const,
  path: '/assets',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: CreateAssetInput }): CreateAssetOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: CreateAssetInput }): CreateAssetOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: CreateAssetOutput) => !output.ok,
  
  successText: 'Asset created successfully',
  errorText: 'Failed to create asset',
};

export default createHttpTool<CreateAssetInput, CreateAssetOutput>(spec);