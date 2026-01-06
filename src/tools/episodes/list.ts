import { createHttpTool } from '../factory.js';

// Input/Output type definitions
export interface ListEpisodesInput {
  limit?: number;
  offset?: number;
}

export interface ListEpisodesOutput {
  ok: boolean;
  data?: any;
  error?: string;
  api_url?: string;
  timestamp: string;
}

// Tool specification
const spec = {
  name: 'list_episodes',
  description: 'List episodes with their metadata and IDs',
  
  inputSchema: {
    type: 'object' as const,
    properties: {
      limit: {
        type: 'number',
        description: 'Limit number of episodes returned',
        minimum: 1,
        maximum: 100,
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination',
        minimum: 0,
      },
    },
    additionalProperties: false,
  },

  method: 'GET' as const,
  path: '/episodes',

  mapResponse: (data: any, ctx: { apiBaseUrl: string; url: string; method: string }): ListEpisodesOutput => ({
    ok: true,
    data: data,
    api_url: ctx.url,
    timestamp: new Date().toISOString(),
  }),

  mapError: (err: unknown, ctx: { apiBaseUrl: string; url: string; method: string }): ListEpisodesOutput => ({
    ok: false,
    error: err instanceof Error ? err.message : 'Unknown error',
    api_url: ctx.url,
    timestamp: new Date().toISOString(),
  }),

  isError: (output: ListEpisodesOutput) => !output.ok,
  
  successText: 'Episodes fetched successfully',
  errorText: 'Failed to fetch episodes',
};

export default createHttpTool<ListEpisodesInput, ListEpisodesOutput>(spec);