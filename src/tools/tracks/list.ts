import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface ListTracksInput {
  episode_id: number;
}

export interface ListTracksOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'list_tracks',
  description: 'List tracks for an episode',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      episode_id: {
        type: 'number',
        description: 'The ID of the episode',
        minimum: 1,
      },
    },
    required: ['episode_id'],
    additionalProperties: false,
  },

  method: 'GET' as const,
  path: '/episodes/{episode_id}/tracks',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: ListTracksInput }): ListTracksOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: ListTracksInput }): ListTracksOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: ListTracksOutput) => !output.ok,
  
  successText: 'Tracks fetched successfully',
  errorText: 'Failed to fetch tracks',
};

export default createHttpTool<ListTracksInput, ListTracksOutput>(spec);