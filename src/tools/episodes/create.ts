import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface CreateEpisodeInput {
  system_name: string;
  title: string;
  description?: string;
  music_brief?: string;
  voice_brief?: string;
  video_brief?: string;
}

export interface CreateEpisodeOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'create_episode',
  description: 'Create a new episode in the Episode Manager',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
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
    required: ['system_name', 'title'],
    additionalProperties: false,
  },

  method: 'POST' as const,
  path: '/episodes',

  mapResponse: (data: any, ctx: { apiBaseUrl: string }): CreateEpisodeOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string }): CreateEpisodeOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: CreateEpisodeOutput) => !output.ok,
  
  successText: 'Episode created successfully',
  errorText: 'Failed to create episode',
};

export default createHttpTool<CreateEpisodeInput, CreateEpisodeOutput>(spec);