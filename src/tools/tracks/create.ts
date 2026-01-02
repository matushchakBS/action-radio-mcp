import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface CreateTrackInput {
  episode_id: number;
  type: 'video' | 'audio' | 'subtitle';
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreateTrackOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'create_track',
  description: 'Create a track for an episode',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      episode_id: {
        type: 'number',
        description: 'The ID of the episode',
        minimum: 1,
      },
      type: {
        type: 'string',
        description: 'Track type',
        enum: ['video', 'audio', 'subtitle'],
      },
      description: {
        type: 'string',
        description: 'Track description',
        maxLength: 1000,
      },
      metadata: {
        type: 'object',
        description: 'Additional metadata for the track',
      },
    },
    required: ['episode_id', 'type'],
    additionalProperties: false,
  },

  method: 'POST' as const,
  path: '/episodes/{episode_id}/tracks',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: CreateTrackInput }): CreateTrackOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: CreateTrackInput }): CreateTrackOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: CreateTrackOutput) => !output.ok,
  
  successText: 'Track created successfully',
  errorText: 'Failed to create track',
};

export default createHttpTool<CreateTrackInput, CreateTrackOutput>(spec);