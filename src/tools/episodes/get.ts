import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface GetEpisodeInput {
  episode_id: number;
}

export interface GetEpisodeOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'get_episode',
  description: 'Get episode details including tracks',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      episode_id: {
        type: 'number',
        description: 'The ID of the episode to retrieve',
        minimum: 1,
      },
    },
    required: ['episode_id'],
    additionalProperties: false,
  },

  method: 'GET' as const,
  path: '/episodes/{episode_id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: GetEpisodeInput }): GetEpisodeOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: GetEpisodeInput }): GetEpisodeOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: GetEpisodeOutput) => !output.ok,
  
  successText: 'Episode retrieved successfully',
  errorText: 'Failed to retrieve episode',
};

export default createHttpTool<GetEpisodeInput, GetEpisodeOutput>(spec);