import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface ListVariantsInput {
  id: number;
  language?: string;
  resolution?: string;
  generation_status?: 'missing' | 'queued' | 'generating' | 'generated' | 'failed';
  approval_status?: 'draft' | 'approved' | 'rejected';
}

export interface ListVariantsOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'list_variants',
  description: 'List variants for a specific asset template',
  
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
        description: 'Filter by language (e.g., "en")',
      },
      resolution: {
        type: 'string',
        description: 'Filter by resolution (e.g., "1920x1080")',
      },
      generation_status: {
        type: 'string',
        description: 'Filter by generation status',
        enum: ['missing', 'queued', 'generating', 'generated', 'failed'],
      },
      approval_status: {
        type: 'string',
        description: 'Filter by approval status',
        enum: ['draft', 'approved', 'rejected'],
      },
    },
    required: ['id'],
    additionalProperties: false,
  },

  method: 'GET' as const,
  path: '/assets/{id}/variants',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: ListVariantsInput }): ListVariantsOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: ListVariantsInput }): ListVariantsOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: ListVariantsOutput) => !output.ok,
  
  successText: 'Variants fetched successfully',
  errorText: 'Failed to fetch variants',
};

export default createHttpTool<ListVariantsInput, ListVariantsOutput>(spec);