import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface UpdateEpisodeInput {
  episode_id: number;
  system_name?: string;
  title?: string;
  description?: string;
  music_brief?: string;
  voice_brief?: string;
  video_brief?: string;
}

export interface UpdateEpisodeOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'update_episode',
  description: 'Update an existing episode',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      episode_id: {
        type: 'number',
        description: 'The ID of the episode to update',
        minimum: 1,
      },
      system_name: {
        type: 'string',
        description: 'System name/identifier for the episode',
        minLength: 1,
        maxLength: 100,
      },
      title: {
        type: 'string',
        description: 'Episode title',
        minLength: 1,
        maxLength: 200,
      },
      description: {
        type: 'string',
        description: 'Episode description',
        maxLength: 1000,
      },
      music_brief: {
        type: 'string',
        description: 'Brief description for music requirements',
        maxLength: 500,
      },
      voice_brief: {
        type: 'string',
        description: 'Brief description for voice requirements',
        maxLength: 500,
      },
      video_brief: {
        type: 'string',
        description: 'Brief description for video requirements',
        maxLength: 500,
      },
    },
    required: ['episode_id'],
    additionalProperties: false,
  },

  method: 'PUT' as const,
  path: '/episodes/{episode_id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: UpdateEpisodeInput }): UpdateEpisodeOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: UpdateEpisodeInput }): UpdateEpisodeOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: UpdateEpisodeOutput) => !output.ok,
  
  successText: 'Episode updated successfully',
  errorText: 'Failed to update episode',
};

export default createHttpTool<UpdateEpisodeInput, UpdateEpisodeOutput>(spec);