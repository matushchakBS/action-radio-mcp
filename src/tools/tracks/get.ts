import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface GetTrackInput {
  episode_id: number;
  track_id: number;
}

export interface GetTrackOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'get_track',
  description: 'Get track details',
  
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
  path: '/episodes/{episode_id}/tracks/{track_id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: GetTrackInput }): GetTrackOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: GetTrackInput }): GetTrackOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: GetTrackOutput) => !output.ok,
  
  successText: 'Track retrieved successfully',
  errorText: 'Failed to retrieve track',
};

export default createHttpTool<GetTrackInput, GetTrackOutput>(spec);