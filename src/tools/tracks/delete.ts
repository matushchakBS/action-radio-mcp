import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface DeleteTrackInput {
  episode_id: number;
  track_id: number;
}

export interface DeleteTrackOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'delete_track',
  description: 'Delete track',
  
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

  method: 'DELETE' as const,
  path: '/episodes/{episode_id}/tracks/{track_id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: DeleteTrackInput }): DeleteTrackOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: DeleteTrackInput }): DeleteTrackOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: DeleteTrackOutput) => !output.ok,
  
  successText: 'Track deleted successfully',
  errorText: 'Failed to delete track',
};

export default createHttpTool<DeleteTrackInput, DeleteTrackOutput>(spec);