import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface ListAssetsInput {
  format?: 'audio' | 'video' | 'image' | 'text';
  kind?: 'music' | 'voice' | 'video' | 'thumbnail' | 'subtitle';
  approval_status?: 'draft' | 'approved' | 'rejected';
}

export interface ListAssetsOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'list_assets',
  description: 'List asset templates with optional filters',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      format: {
        type: 'string',
        description: 'Filter by asset format',
        enum: ['audio', 'video', 'image', 'text'],
      },
      kind: {
        type: 'string',
        description: 'Filter by asset kind',
        enum: ['music', 'voice', 'video', 'thumbnail', 'subtitle'],
      },
      approval_status: {
        type: 'string',
        description: 'Filter by approval status',
        enum: ['draft', 'approved', 'rejected'],
      },
    },
    additionalProperties: false,
  },

  method: 'GET' as const,
  path: '/assets',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: ListAssetsInput }): ListAssetsOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: ListAssetsInput }): ListAssetsOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: ListAssetsOutput) => !output.ok,
  
  successText: 'Assets fetched successfully',
  errorText: 'Failed to fetch assets',
};

export default createHttpTool<ListAssetsInput, ListAssetsOutput>(spec);