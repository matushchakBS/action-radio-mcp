import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface UpdateAssetInput {
  id: number;
  format?: 'audio' | 'video' | 'image' | 'text';
  kind?: 'music' | 'voice' | 'video' | 'thumbnail' | 'subtitle';
  spec_text?: string;
  meta_json?: Record<string, any>;
  approval_status?: 'draft' | 'approved' | 'rejected';
}

export interface UpdateAssetOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'update_asset',
  description: 'Update asset template',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'number',
        description: 'The ID of the asset to update',
        minimum: 1,
      },
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
      approval_status: {
        type: 'string',
        description: 'Approval status of the asset',
        enum: ['draft', 'approved', 'rejected'],
      },
    },
    required: ['id'],
    additionalProperties: false,
  },

  method: 'PUT' as const,
  path: '/assets/{id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: UpdateAssetInput }): UpdateAssetOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: UpdateAssetInput }): UpdateAssetOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: UpdateAssetOutput) => !output.ok,
  
  successText: 'Asset updated successfully',
  errorText: 'Failed to update asset',
};

export default createHttpTool<UpdateAssetInput, UpdateAssetOutput>(spec);