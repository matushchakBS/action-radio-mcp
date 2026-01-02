import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface DeletePlacementInput {
  id: number; // episode_id (using 'id' to match API spec)
  track_id: number;
  placement_id: number;
}

export interface DeletePlacementOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'delete_placement',
  description: 'Delete placement',
  
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
    },
    required: ['id', 'track_id', 'placement_id'],
    additionalProperties: false,
  },

  method: 'DELETE' as const,
  path: '/episodes/{id}/tracks/{track_id}/placements/{placement_id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: DeletePlacementInput }): DeletePlacementOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: DeletePlacementInput }): DeletePlacementOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: DeletePlacementOutput) => !output.ok,
  
  successText: 'Placement deleted successfully',
  errorText: 'Failed to delete placement',
};

export default createHttpTool<DeletePlacementInput, DeletePlacementOutput>(spec);