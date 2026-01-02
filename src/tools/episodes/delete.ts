import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface DeleteEpisodeInput {
  episode_id: number;
}

export interface DeleteEpisodeOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'delete_episode',
  description: 'Delete an episode',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      episode_id: {
        type: 'number',
        description: 'The ID of the episode to delete',
        minimum: 1,
      },
    },
    required: ['episode_id'],
    additionalProperties: false,
  },

  method: 'DELETE' as const,
  path: '/episodes/{episode_id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: DeleteEpisodeInput }): DeleteEpisodeOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: DeleteEpisodeInput }): DeleteEpisodeOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: DeleteEpisodeOutput) => !output.ok,
  
  successText: 'Episode deleted successfully',
  errorText: 'Failed to delete episode',
};

export default createHttpTool<DeleteEpisodeInput, DeleteEpisodeOutput>(spec);