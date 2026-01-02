import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface CreatePlacementInput {
  episode_id: number;
  track_id: number;
  asset_id: number;
  planned_duration: number;
  metadata?: Record<string, any>;
}

export interface CreatePlacementOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'create_placement',
  description: 'Create a placement for a track',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      episode_id: {
        type: 'number',
        description: 'The ID of the episode',
        minimum: 1,
      },
      track_id: {
        type: 'number',
        description: 'The ID of the track',
        minimum: 1,
      },
      asset_id: {
        type: 'number',
        description: 'References an Asset Template',
        minimum: 1,
      },
      planned_duration: {
        type: 'number',
        description: 'Approximate time length in seconds',
        minimum: 0,
      },
      metadata: {
        type: 'object',
        description: 'Additional metadata for the placement',
      },
    },
    required: ['episode_id', 'track_id', 'asset_id', 'planned_duration'],
    additionalProperties: false,
  },

  method: 'POST' as const,
  path: '/episodes/{episode_id}/tracks/{track_id}/placements',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: CreatePlacementInput }): CreatePlacementOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: CreatePlacementInput }): CreatePlacementOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: CreatePlacementOutput) => !output.ok,
  
  successText: 'Placement created successfully',
  errorText: 'Failed to create placement',
};

export default createHttpTool<CreatePlacementInput, CreatePlacementOutput>(spec);