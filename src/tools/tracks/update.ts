import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface UpdateTrackInput {
  episode_id: number;
  track_id: number;
  type?: 'video' | 'audio' | 'subtitle';
  description?: string;
  metadata?: Record<string, any>;
}

export interface UpdateTrackOutput {
  ok: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'update_track',
  description: 'Update track',
  
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
    required: ['episode_id', 'track_id'],
    additionalProperties: false,
  },

  method: 'PUT' as const,
  path: '/episodes/{episode_id}/tracks/{track_id}',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; input: UpdateTrackInput }): UpdateTrackOutput => ({
    ok: true,
    data: data,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; input: UpdateTrackInput }): UpdateTrackOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  }),

  isError: (output: UpdateTrackOutput) => !output.ok,
  
  successText: 'Track updated successfully',
  errorText: 'Failed to update track',
};

export default createHttpTool<UpdateTrackInput, UpdateTrackOutput>(spec);