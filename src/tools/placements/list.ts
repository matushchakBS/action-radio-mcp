import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface ListPlacementsInput {
  episode_id: number;
  track_id: number;
}

export interface ListPlacementsOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'list_placements',
  description: 'List placements for a track',
  
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
    },
    required: ['episode_id', 'track_id'],
    additionalProperties: false,
  },

  method: 'GET' as const,
  path: '/episodes/{episode_id}/tracks/{track_id}/placements',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: ListPlacementsInput }): ListPlacementsOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: ListPlacementsInput }): ListPlacementsOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: ListPlacementsOutput) => !output.ok,
  
  successText: 'Placements fetched successfully',
  errorText: 'Failed to fetch placements',
};

export default createHttpTool<ListPlacementsInput, ListPlacementsOutput>(spec);