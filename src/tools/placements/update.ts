import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface UpdatePlacementInput {
  id: number; // episode_id (using 'id' to match API spec)
  track_id: number;
  placement_id: number;
  asset_id?: number;
  planned_duration?: number;
  metadata?: Record<string, any>;
}

export interface UpdatePlacementOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'update_placement',
  description: 'Update placement',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'number',
        description: 'The ID of the episode',
        minimum: 1,
      },
      track_id: {
        type: 'number',
        description: 'The ID of the track',
        minimum: 1,
      },
      placement_id: {
        type: 'number',
        description: 'The ID of the placement',
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
    required: ['id', 'track_id', 'placement_id'],
    additionalProperties: false,
  },

  method: 'PUT' as const,
  path: '/episodes/{id}/tracks/{track_id}/placements/{placement_id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: UpdatePlacementInput }): UpdatePlacementOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: UpdatePlacementInput }): UpdatePlacementOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: UpdatePlacementOutput) => !output.ok,
  
  successText: 'Placement updated successfully',
  errorText: 'Failed to update placement',
};

export default createHttpTool<UpdatePlacementInput, UpdatePlacementOutput>(spec);